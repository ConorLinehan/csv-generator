import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import Ember from 'ember';
import { generatorModal } from 'csv-generator/tests/pages/generator';
import PageObject from 'ember-cli-page-object';

const fakerService = Ember.Service.extend({
  results: [
    ['boo', [['name', 'john'], ['job', 'painter']]],
    ['foo', [['number', 5]]],
    ['baz', [['place', 'dublin'], ['animal', 'cat'], ['food', 'chips']]]
  ]
});

const page = PageObject.create(generatorModal);

moduleForComponent('generators-modal', 'Integration | Component | generators modal', {
  integration: true,

  beforeEach() {
    page.setContext(this);
    this.register('service:faker', fakerService);
  },

  afterEach() {
    page.removeContext();
  }
});

test('it sets up intial state', function(assert) {
  page.render(hbs`
    <div class="modal-card">
      {{generators-modal}}
    </div>
  `);

  assert.ok(page.tabs(0).isActive, 'first tab is active');
  assert.deepEqual(page.tabs().toArray().mapBy('text'), ['boo (2)', 'foo (1)', 'baz (3)'], 'shows three tabs');

  assert.equal(page.types().count, 2, 'shows active types');
  assert.equal(page.types(0).type, 'name');
  assert.equal(page.types(0).example, 'john');
  assert.equal(page.types(1).type, 'job');
  assert.equal(page.types(1).example, 'painter');
});

test('it can switch tabs', function(assert) {
  page.render(hbs`
    <div class="modal-card">
      {{generators-modal}}
    </div>
  `);

  page.tabs(1).click();
  assert.ok(page.tabs(1).isActive, 'sets active tab');
  assert.equal(page.types().count, 1, 'swtices active types');
  assert.equal(page.types(0).type, 'number');
  assert.equal(page.types(0).example, '5');
});

test('it can select new type', function(assert) {
  this.on('update', path =>{
    assert.equal(path, 'boo.name', 'passes back selected path');
  });

  page.render(hbs`
    <div class="modal-card">
      {{generators-modal updatePath=(action 'update')}}
    </div>
  `);

  page.types(0).click();
});
