import { moduleFor } from 'ember-qunit';
import test from 'ember-sinon-qunit/test-support/test';
import sinon from 'sinon';
import faker from 'npm:faker';
import Papa from 'npm:papaparse';
import Ember from 'ember';
import fileSaver from 'npm:file-saver';
import { timeout } from 'ember-concurrency';

const {
  run
} = Ember;

moduleFor('service:generation-interface', 'Unit | Service | generation-interface', {
  beforeEach() {
    faker['myTest'] = {
      foo: ()=>{ return 'foo';},
      bar: ()=>{ return 'bar';},
      baz: ()=>{ return 'baz';}
    };
  },

  afterEach() {
    faker['myTest'] = undefined;
    delete faker['myTest'];
  }
});

// Session Model - Tests
test('header', function(assert) {
  let generators = [
    Ember.Object.create({name: 'Col 1'}),
    Ember.Object.create({name: 'Col 2'}),
    Ember.Object.create({name: 'Col 3'}),
  ];

  let model = this.subject({
    generators: generators
  });

  let firstResult = model.get('headers');
  assert.deepEqual(firstResult, ['Col 1', 'Col 2', 'Col 3']);

  let firstGenerator = model.get('generators.firstObject');

  run(() =>{
    firstGenerator.set('name', 'new name');
  });

  let secondResult = model.get('headers');
  assert.deepEqual(secondResult, ['new name', 'Col 2', 'Col 3']);
});

test('shouldUseWorker', function(assert) {
  let model = this.subject({ rows: 600 });
  assert.ok(model.get('shouldUseWorker'), 'returns true for above threshold rows');

  model.set('rows', 400);
  assert.notOk(model.get('shouldUseWorker'), 'returns false for below threshold');
});

test('_chunkTask: it throttles task', function(assert) {
  let generators = [
    Ember.Object.create({fakerPath: 'myTest.foo'}),
    Ember.Object.create({fakerPath: 'myTest.bar'}),
    Ember.Object.create({fakerPath: 'myTest.baz'}),
  ];
  let model = this.subject({
    generators: generators,
    rows: 500
  });

  return run(() =>{
    let task = model.get('_chunkTask').perform();
    // Should throttle generation to ~ 200ms
    return timeout(50)
    .then(() =>{
      assert.ok(task.get('isRunning'));
      return timeout(200)
      .then(() =>{
        assert.ok(task.get('value'));
      });
    });
  });
});

test('generatorPaths', function(assert) {
  let generators = [
    Ember.Object.create({fakerPath: 'myTest.foo'}),
    Ember.Object.create({fakerPath: 'myTest.bar'}),
    Ember.Object.create({fakerPath: 'myTest.baz'}),
  ];

  let model = this.subject({
    generators: generators
  });

  assert.deepEqual(model.get('generatorPaths'), [
    ['myTest', 'foo'], ['myTest', 'bar'], ['myTest', 'baz']
  ]);
});

test('_chunkTask: it returns csvString', function(assert) {

  let sandbox = sinon.sandbox.create();

  let _firstSpy = sandbox.spy(faker.myTest, 'bar');
  let _secondSpy = sandbox.spy(faker.myTest, 'baz');
  let generators = [
    Ember.Object.create({fakerPath: 'myTest.bar'}),
    Ember.Object.create({fakerPath: 'myTest.baz'}),
  ];
  let unparseStub = sandbox.stub(Papa, 'unparse').returns('my-csv');

  let service = this.subject({
    generators,
    rows: 10,
    shouldIncludeHeaders: true,
  });
  service.reopen({ headers: ['col1', 'col2'] });

  return run(() =>{
    return service.get('_chunkTask').perform()
    .then(result =>{
      assert.equal(result, 'my-csv', 'returns unparsed array');
      assert.equal(_firstSpy.callCount, 10, 'called generator funs correct number of times');
      assert.equal(_secondSpy.callCount, 10, 'called generator funs correct number of times');
      let _unparseArray = unparseStub.firstCall.args[0];
      assert.deepEqual(_unparseArray[0], ['col1', 'col2'], 'passes in headers');
      assert.equal(_unparseArray.length, 11, 'generates correct length based on row');

      // No Headers
      service.set('shouldIncludeHeaders', false);
      return service.get('_chunkTask').perform()
      .then(() =>{
        let _unparseArray = unparseStub.secondCall.args[0];
        assert.equal(_unparseArray.length, 10, 'returns correct length for no headers');
        assert.deepEqual(_unparseArray[0], ['bar', 'baz']);

        sandbox.restore();
      });
    });
  });
});

test('_workerTask', function(assert) {

  let service = this.subject({
    generatorPaths: ['path1', 'path2'],
    rows: 200,
    shouldIncludeHeaders: true,
  });
  service.reopen({ headers: ['col1', 'col2'] });

  let fakeWorker = {postMessage(){}, addEventListener(){}};
  let postMessageSpy = this.spy(fakeWorker, 'postMessage');
  let addEventListenerSpy = this.spy(fakeWorker, 'addEventListener');

  let workerStub = this.stub(service, '_createWorker').returns(fakeWorker);

  return run(() =>{
    let task = service.get('_workerTask').perform();
    return timeout(10)
    .then(() =>{
      // Assert on spys
      assert.ok(workerStub.calledOnce, 'worker was created');
      assert.ok(postMessageSpy.calledWithExactly({
        paths: ['path1', 'path2'],
        rows: 200,
        headers: ['col1', 'col2']
      }), 'called postMessage with correct data');
      assert.equal(addEventListenerSpy.firstCall.args[0], 'message', 'sets up message listener');
      assert.equal(addEventListenerSpy.secondCall.args[0], 'error', 'sets up error listener');
      // Call success
      addEventListenerSpy.firstCall.args[1]({
        data: {
          myData: 'test'
        }
      });
      return task.then(result =>{
        assert.deepEqual(result, {myData: 'test'}, 'returns success from worker');
      });
    });
  });
});

test('_workerTask: error', function(assert) {
  let service = this.subject({
    generatorPaths: ['path1'],
    rows: 10
  });

  let fakeWorker = {postMessage(){}, addEventListener(){}};
  let addEventListenerSpy = this.spy(fakeWorker, 'addEventListener');

  this.stub(service, '_createWorker').returns(fakeWorker);

  return run(() =>{
    let task = service.get('_workerTask').perform();
    return timeout(10)
    .then(() =>{
      // Call error
      addEventListenerSpy.secondCall.args[1]({error: 'error'});
      task.catch(e =>{
        assert.ok(e);
      });
    });
  });
});

test('generateTask', function(assert) {
  let service = this.subject();

  let sandbox = sinon.sandbox.create();
  let fileSaveStub  = sandbox.stub(fileSaver, 'saveAs');
  let _saveCSVSpy = sandbox.spy(service, '_saveCSV');

  let generators = [
    Ember.Object.create({name: 'col1', fakerPath: 'random.number'}),
    Ember.Object.create({name: 'col2', fakerPath: 'name.firstName'}),
    Ember.Object.create({name: 'col3', fakerPath: 'address.city'}),
  ];

  return run(() =>{
    // Chunk
    return service.get('generateTask').perform(generators, 10, true)
    .then(() =>{
      let result = _saveCSVSpy.firstCall.args[0];

      assert.ok(typeof result === 'string');
      // Parse result string and assert.
      let { data } = Papa.parse(result);
      assert.equal(data.length, 11, 'generates correct number of rows');

      // Worker
      return service.get('generateTask').perform(generators, 501, true)
      .then(() =>{
        let result = _saveCSVSpy.secondCall.args[0];
        assert.ok(typeof result === 'string');

        let { data } = Papa.parse(result);
        assert.equal(data.length, 502, 'generates correct number of rows');

        assert.ok(fileSaveStub.calledTwice, 'called save twice');

        sandbox.restore();
      });
    });
  });
});

test('it setups worker on init', function(assert) {
  let service = this.subject();

  assert.ok(service.get('cachedWorker'));
});
