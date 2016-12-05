import { test } from 'qunit';
import moduleForAcceptance from 'csv-generator/tests/helpers/module-for-acceptance';
import Ember from 'ember';
import page from 'csv-generator/tests/pages/collections';

const {
  run
} = Ember;

moduleForAcceptance('Acceptance | collections', {
  beforeEach() {
    window.localStorage.clear();
  },

  afterEach() {
    window.localStorage.clear();
  }
});

test('it shows collections', function(assert) {
  let store = this.application.__container__.lookup('service:store');

  run(() =>{
    store.createRecord('collection', { name: 'First Collection' }).save();
    store.createRecord('collection', { name: 'Second Collection' }).save();
    store.createRecord('collection', { name: 'Third Collection' }).save();
  });

  page.visit();

  andThen(() =>{
    let collectionNames = page.collections().toArray().mapBy('name');

    assert.deepEqual(
      collectionNames,
      ['First Collection', 'Second Collection', 'Third Collection'],
      'Shows Collections'
    );
  });
});

test('it can add a collection', function(assert) {
  page.visit();

  andThen(() =>{
    page.newCollection();

    andThen(() =>{
      assert.equal(page.collections().count, 2);
    });
  });
});

test('it can delete a collection', function(assert) {
  let store = this.application.__container__.lookup('service:store');

  run(() =>{
    store.createRecord('collection').save();
  });

  page.visit();

  andThen(() =>{
    page.collections(0).delete();

    andThen(() =>{
      assert.equal(page.collections().count, 0);
    });
  });
});

test('it seeds first collection', function(assert) {
  page.visit();

  andThen(() =>{
    assert.equal(page.collections().count, 1);

    // TODO: Go into generators
  });
});
