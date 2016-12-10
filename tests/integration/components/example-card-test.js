import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import sinon from 'sinon';
import faker from 'npm:faker';
import page from '../../pages/example-card';
import wait from 'ember-test-helpers/wait';

moduleForComponent('example-card', 'Integration | Component | example card', {
  integration: true,

  beforeEach() {
    this.sandbox = sinon.sandbox.create();
    page.setContext(this);

    faker.example = {
      foo(){}
    };
  },

  afterEach() {
    this.sandbox.restore();
    page.removeContext();

    delete faker.example;
  }
});

test('it shows intial state', function(assert) {
  this.sandbox.stub(faker.example, 'foo').returns('My Example');

  page.render(hbs`{{example-card namespace="example" type="foo"}}`);

  assert.equal(page.type, 'foo');
  assert.equal(page.example, 'My Example');
});

test('it doesn\'t generate example if intial is passed in', function(assert) {
  page.render(hbs`{{example-card namespace="example" type="foo" example="baz"}}`);

  assert.equal(page.example, 'baz', 'shows passed in example');
});

test('it can refresh example', function(assert) {
  let done = assert.async();

  this.sandbox.stub(faker.example, 'foo').returns('Intial')
  .onSecondCall().returns('Bar Example');

  page.render(hbs`{{example-card namespace="example" type="foo"}}`);

  assert.equal(page.example, 'Intial');

  page.refresh();
  wait().then(() =>{
    assert.equal(page.example, 'Bar Example');
    done();
  });
});
