/* global Blob */

import { moduleFor } from 'ember-qunit';
import test from 'ember-sinon-qunit/test-support/test';
import Ember from 'ember';
import { timeout } from 'ember-concurrency';
import fileSaver from 'npm:file-saver';
import PapaParse from 'npm:papaparse';
import faker from 'npm:faker';
import wait from 'ember-test-helpers/wait';

const {
  run,
  RSVP
} = Ember;

moduleFor('controller:generator', 'Unit | Controller | generator', {
  beforeEach() {
    faker['myTest'] = {
      foo: ()=>{},
      bar: ()=>{},
      baz: ()=>{}
    };
  },

  afterEach() {
    faker['myTest'] = undefined;
    delete faker['myTest'];
  }
});

test('generateCSVTask', function(assert) {
  let controller = this.subject();
  let generateCSVTaskStub = this.stub(controller.get('_generateCSVStringTask'), 'perform')
  .returns(RSVP.Promise.resolve(['csv']));
  let saveStub = this.stub(controller, '_saveCSV');
  let unparseStub = this.stub(PapaParse, 'unparse').returns('my-csv');

  return run(() =>{
    controller.get('generateCSVTask').perform(10);

    return wait()
    .then(() =>{
      assert.ok(generateCSVTaskStub.calledWithExactly(10));
      assert.ok(unparseStub.calledWithExactly(['csv']));
      assert.ok(saveStub.calledWithExactly('my-csv'));
    });
  });
}),

test('activeGenerator', function(assert) {
  let controller = this.subject();
  controller.set('activeGeneratorId', 'myId');
  let peekStub = this.stub(controller.get('store'), 'peekRecord')
  .returns('stub');

  let generator = controller.get('activeGenerator');

  assert.equal(generator, 'stub');
  assert.ok(peekStub.calledWithExactly('generator', 'myId'));
}),

test('generatorFuncs', function(assert) {
  let generators = [
    Ember.Object.create({fakerPath: 'myTest.foo'}),
    Ember.Object.create({fakerPath: 'myTest.bar'}),
    Ember.Object.create({fakerPath: 'myTest.baz'}),
  ];

  let controller = this.subject({
    generators: generators
  });

  let expected = [
    faker.myTest.foo,
    faker.myTest.bar,
    faker.myTest.baz
  ];
  let funcs = controller.get('generatorFuncs');
  assert.deepEqual(funcs, expected);

  controller.set('generators', generators.slice(0, 1));
  let updatedFuncs = controller.get('generatorFuncs');
  assert.deepEqual(updatedFuncs, [faker.myTest.foo]);
});

test('header', function(assert) {
  let generators = [
    Ember.Object.create({name: 'Col 1'}),
    Ember.Object.create({name: 'Col 2'}),
    Ember.Object.create({name: 'Col 3'}),
  ];

  let controller = this.subject({
    generators: generators
  });

  let firstResult = controller.get('headers');
  assert.deepEqual(firstResult, ['Col 1', 'Col 2', 'Col 3']);

  let firstGenerator = controller.get('generators.firstObject');

  run(() =>{
    firstGenerator.set('name', 'new name');
  });

  let secondResult = controller.get('headers');
  assert.deepEqual(secondResult, ['new name', 'Col 2', 'Col 3']);
});

test('_saveCSV', function(assert) {
  let controller = this.subject();
  let saveAsStub = this.stub(fileSaver, 'saveAs');

  controller._saveCSV('my-csv');
  assert.ok(saveAsStub.calledOnce);
  let expectedBlob = new Blob(['my-csv'], {
    type: "text/csv; charset=utf-8"
  });
  assert.ok(saveAsStub.calledWithExactly(expectedBlob, 'data.csv'));
});

test('_generateCSVStringTask: it throttles task', function(assert) {
  let generators = [
    Ember.Object.create({name: 'col 1', fakerPath: 'address.zipCode'}),
    Ember.Object.create({name: 'col 2', fakerPath: 'name.firstName'}),
    Ember.Object.create({name: 'col 1', fakerPath: 'random.number'}),
  ];
  let controller = this.subject({
    model: generators
  });

  return run(() =>{
    let task = controller.get('_generateCSVStringTask').perform(500);
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

test('_generateCSVStringTask: it returns array', function(assert) {
  let generators = [
    Ember.Object.create({name: 'col 1', fakerPath: 'random.number'}),
    Ember.Object.create({name: 'col 2', fakerPath: 'name.firstName'})
  ];

  let controller = this.subject({
    model: generators
  });

  return run(() =>{
    let task = controller.get('_generateCSVStringTask').perform(10);
    return timeout(50)
    .then(() =>{
      let result = task.get('value');
      assert.ok(Array.isArray(result));
      assert.deepEqual(result[0], ['col 1', 'col 2'], 'passes headers');
      assert.equal(result.length, 11, 'returns correct number of data');
    });
  });
});
