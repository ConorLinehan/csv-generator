import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import Ember from 'ember';
import wait from 'ember-test-helpers/wait';

const interfaceStub = Ember.Service.extend({
  progress: 0
});

moduleForComponent('progress-modal', 'Integration | Component | progress modal', {
  integration: true,

  beforeEach() {
    this.register('service:generation-interface', interfaceStub);
    this.inject.service('generation-interface', { as: 'interface' });
  }
});

test('it switches from generation to parsing animations', function(assert) {

  let done = assert.async();

  this.render(hbs`{{progress-modal}}`);

  assert.ok(this.$('h3.generating-text'), 'shows generating animation');

  this.set('interface.progress', 100);

  wait().then(() =>{
    assert.ok(this.$('h3.parsing-text'), 'shows parsing animation');
    done();
  });
});
