import { moduleFor, test } from 'ember-qunit';

moduleFor('controller:collections/show', 'Unit | Controller | collections/show', {
  // Specify the other units that are required for this test.
  // needs: ['controller:foo']
});

test('activeGenerator', function(assert) {
  let controller = this.subject();
  controller.set('activeGeneratorId', 'myId');
  let peekStub = this.stub(controller.get('store'), 'peekRecord')
  .returns('stub');

  let generator = controller.get('activeGenerator');

  assert.equal(generator, 'stub');
  assert.ok(peekStub.calledWithExactly('generator', 'myId'));
});
