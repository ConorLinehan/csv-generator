import Ember from 'ember';
import { task, all } from 'ember-concurrency';

const SEED_VALUES = [
  ['id', 'random.number'],
  ['first_name', 'name.firstName'],
  ['last_name', 'name.lastName'],
  ['ip_address', 'internet.ip']
];

export default Ember.Route.extend({

  /**
   * We seed an intial collection with generators if none found within store/localStorage
   */
  model() {
    return this.get('store').findAll('collection')
    .then(collections =>{
      if (collections.get('length') > 0) {
        return collections;
      } else {
        return this.get('_seedIntialCollection').perform()
        .then(() =>{
          return collections;
        });
      }
    });
  },

  _seedIntialCollection: task(function *() {
    let tasks = SEED_VALUES.map(valueTuple =>{
      let [name, path] = valueTuple;
      return this.get('store').createRecord('generator', {
        name: name,
        fakerPath: path
      }).save();
    });
    let generators = yield all(tasks);

    return yield this.get('store').createRecord('collection', {
      generators: generators
    }).save();
  }),

});
