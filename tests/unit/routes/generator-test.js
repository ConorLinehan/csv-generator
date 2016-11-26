import { moduleFor, test } from 'ember-qunit';
import sinon from 'sinon';
import Ember from 'ember';

const {
  RSVP,
  run
} = Ember;

moduleFor('route:generator', 'Unit | Route | generator', {
  beforeEach() {
    this.sandbox = sinon.sandbox.create();
  },

  afterEach() {
    this.sandbox.restore();
  }
});

test('_seedIntialValues', function(assert) {
  let route = this.subject();

  // TODO: Tidy
  let createRecordStub =
  this.sandbox.stub(route.get('store'), 'createRecord')
  .returns({save(){ return RSVP.Promise.resolve({});}});


  return run(() =>{
    return route.get('_seedIntialValuesTask').perform()
    .then(seededValues =>{
      assert.equal(createRecordStub.callCount, 4, 'seeded 4 records');
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

      assert.equal(seededValues.length, 4);
    });
  });
});
