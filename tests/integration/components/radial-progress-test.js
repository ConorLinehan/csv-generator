import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('radial-progress', 'Integration | Component | radial progress', {
  integration: true
});

test('it shows progress', function(assert) {

  this.set('progress', 0);
  this.render(hbs`{{radial-progress progress=progress}}`);

  let progressDegree = () =>{
    return this.$('circle:last').attr('stroke-dashoffset');
  };

  assert.ok(progressDegree() > 339, 'shows zero progress');

  this.set('progress', 100);

  assert.equal(progressDegree(), 0, 'shows completed');
});
