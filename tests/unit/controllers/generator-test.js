import { moduleFor } from 'ember-qunit';
import test from 'ember-sinon-qunit/test-support/test';


moduleFor('controller:generator', 'Unit | Controller | generator');

test('activeGenerator', function(assert) {
  let controller = this.subject();
  controller.set('activeGeneratorId', 'myId');
  let peekStub = this.stub(controller.get('store'), 'peekRecord')
  .returns('stub');

  let generator = controller.get('activeGenerator');

  assert.equal(generator, 'stub');
  assert.ok(peekStub.calledWithExactly('generator', 'myId'));
});
