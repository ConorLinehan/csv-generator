import { moduleForModel, test } from 'ember-qunit';
import Ember from 'ember';

const {
  run
} = Ember;


moduleForModel('collection', 'Unit | Model | collection', {
  // Specify the other units that are required for this test.
  needs: ['model:generator']
});

test('it set\'s up intial name', function(assert) {
  let store = this.store();

  let record = run(store, 'createRecord', 'collection');
  assert.ok(record.get('name'));
});
