import { moduleForModel, test } from 'ember-qunit';

moduleForModel('generator', 'Unit | Model | generator', {
  // Specify the other units that are required for this test.
  needs: ['model:collection']
});

test('it exists', function(assert) {
  let model = this.subject();
  // let store = this.store();
  assert.ok(!!model);
});
