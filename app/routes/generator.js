import Ember from 'ember';
import { task, all } from 'ember-concurrency';

const SEED_VALUES = [
  ['id', 'random.number'],
  ['first_name', 'name.firstName'],
  ['last_name', 'name.lastName'],
  ['ip_address', 'internet.ip']
];

export default Ember.Route.extend({
  model() {
    return this.get('store').findAll('generator')
    .then(generators =>{
      if (generators.get('length') > 0) {
        return generators;
      } else {
        return this.get('_seedIntialValuesTask').perform()
        .then(() =>{
          return this.get('store').findAll('generator');
        });
      }
    });
  },

  _seedIntialValuesTask: task(function *() {
    let tasks = SEED_VALUES.map(valueTuple =>{
      let [name, path] = valueTuple;
      return this.get('store').createRecord('generator', {
        name: name,
        fakerPath: path
      }).save();
    });
    return yield all(tasks);
  }),

  setupController(controller) {
    this._super(...arguments);
    controller.set('rowCount', 100);
  }
});
