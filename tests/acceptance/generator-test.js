import { test } from 'qunit';
import moduleForAcceptance from 'csv-generator/tests/helpers/module-for-acceptance';
import page from '../pages/generator';
import Ember from 'ember';
import sinon from 'sinon';
import fileSaver  from 'npm:file-saver';

const {
  run,
  RSVP
} = Ember;

const genFakeData = (numOfItems, store) => {
  let promises = [];
  let collection = store.peekRecord('collection', 'myCollection');
  for (var i = 0; i < numOfItems; i++) {
    promises.push(store.createRecord('generator', {
      name: `Col ${i}`,
      collection: collection
    }).save());
  }
  return new RSVP.Promise(resolve =>{
    RSVP.all(promises)
    .then(arr =>{
      resolve(arr.map(g => `generators-${g.get('id')}`));
    });
  });
};

const fetchGenerator = id => {
  return JSON.parse(window.localStorage.getItem(`${id}`));
};

moduleForAcceptance('Acceptance | generator', {

  beforeEach() {
    let store = this.application.__container__.lookup('service:store');
    run(() =>{
      store.createRecord('collection', {
        id: 'myCollection'
      }).save();
    });
  },

  afterEach() {
    window.localStorage.clear();
  }
});

test('it can add a generator', function(assert) {
  page.visit({ collection_id: 'myCollection'});

  andThen(() =>{
    page.addGenerator();
    andThen(() =>{
      assert.equal(page.generators().count, 1, 'added generator');
    });
  });
});

test('it can remove a generator', function(assert) {
  let store = this.application.__container__.lookup('service:store');
  run(() =>{
    genFakeData(1, store);
  });

  page.visit({ collection_id: 'myCollection'});
  page.generators(0).remove();
  andThen(() =>{
    // assert.equal(fetchAllGenerators().length, 0, 'removed generator from local storage');
    assert.equal(page.generators().count, 0, 'removed generator');
  });
});

test('it lists out generators', function(assert) {
  let store = this.application.__container__.lookup('service:store');
  run(() =>{
    genFakeData(5, store);
  });

  page.visit({ collection_id: 'myCollection'});
  andThen(() =>{
    assert.equal(page.generators().count, 5);
  });
});

test('it can edit a generator', function(assert) {
  let store = this.application.__container__.lookup('service:store');
  let genPromise;
  run(() =>{
    genPromise = genFakeData(1, store);
  });

  page.visit({ collection_id: 'myCollection'});

  page.generators(0).name('new name');
  page.generators(0).triggerPathChange();

  page.generatorModal.types(1).click();

  andThen(() =>{
    genPromise.then(ids =>{
      let generator = fetchGenerator(ids[0]);
      assert.equal(generator.attributes.name, 'new name', 'changed name');
      assert.equal(generator.attributes['faker-path'], 'address.city', 'changed type');
    });
  });
});

test('it can generate csv', function(assert) {
  let store = this.application.__container__.lookup('service:store');
  run(() =>{
    genFakeData(3, store);
  });

  let sandbox = sinon.sandbox.create();
  let fileSaveStub = sandbox.stub(fileSaver, 'saveAs');

  page.visit({ collection_id: 'myCollection'});
  page.createControl.fillInput(100);
  page.createControl.create();

  andThen(() =>{
    assert.ok(fileSaveStub.calledOnce);
    sandbox.restore();
  });
});
