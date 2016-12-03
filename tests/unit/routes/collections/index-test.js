import { moduleFor, test } from 'ember-qunit';
import sinon from 'sinon';
import Ember from 'ember';

const {
  run,
  RSVP
} = Ember;

moduleFor('route:collections/index', 'Unit | Route | collections/index', {
  beforeEach() {
    this.sandbox = sinon.sandbox.create();
  },

  afterEach() {
    this.sandbox.restore();
  }
});

test('_seedIntialCollection', function(assert) {
  let route = this.subject();
  let fakeGenerator = Ember.Object.create();
  let fakeCollection = Ember.Object.create({ save(){} });

  let createRecordStub = this.sandbox.stub(route.get('store'), 'createRecord')
  .returns({ save() { return RSVP.Promise.resolve(fakeGenerator); }});
  createRecordStub.onCall(4).returns(fakeCollection);

  return run(() =>{
    return route.get('_seedIntialCollection').perform()
    .then(() =>{
      assert.equal(createRecordStub.callCount, 5);
      assert.ok(createRecordStub.firstCall.calledWithExactly('generator', {
        name: 'id', fakerPath: 'random.number',
      }));
      assert.ok(createRecordStub.secondCall.calledWithExactly('generator', {
        name: 'first_name', fakerPath: 'name.firstName'
      }));
      assert.ok(createRecordStub.thirdCall.calledWithExactly('generator', {
        name: 'last_name', fakerPath: 'name.lastName'
      }));
      assert.ok(createRecordStub.getCall(3).calledWithExactly('generator', {
        name: 'ip_address', fakerPath: 'internet.ip'
      }));

      assert.ok(createRecordStub.getCall(4).calledWithExactly('collection', {
        generators: [fakeGenerator, fakeGenerator, fakeGenerator, fakeGenerator]
      }));
    });
  });
});

test('model hook doesn\'t seed if collections in store' , function(assert) {
  let route = this.subject();

  let fakeCollectionArray = [{}];
  this.sandbox.stub(route.get('store'), 'findAll')
  .returns(RSVP.Promise.resolve(fakeCollectionArray));

  let _seedSpy = this.sandbox.spy(route.get('_seedIntialCollection'), 'perform');

  return route.model()
  .then(arr =>{
    assert.deepEqual(arr, fakeCollectionArray);
    assert.equal(_seedSpy.callCount, 0, 'doesn\'t call seed');
  });
});

test('model hook seeds an intial collection value if store is empty', function(assert) {
  let route = this.subject();

  let fakeCollectionArray = [];
  this.sandbox.stub(route.get('store'), 'findAll').returns(RSVP.Promise.resolve([]));

  let _seedStub = this.sandbox.stub(route.get('_seedIntialCollection'), 'perform')
  .returns(RSVP.Promise.resolve());

  return route.model()
  .then(arr =>{
    assert.deepEqual(arr, fakeCollectionArray);
    assert.ok(_seedStub.calledOnce, 'seeds intial collection');
  });
});
