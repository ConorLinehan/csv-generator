import Ember from 'ember';

const {
  RSVP
} = Ember;

const SEED_VALUES = [

];

export default Ember.Route.extend({
  model() {
    return this.get('store').findAll('generator')
    .then(generators =>{
      if (generators.get('length') > 0) {
        return generators;
      } else {
        return this._seedIntialValues()
        .then(seededValues =>{
          return seededValues;
        });
      }
    });
  },

  _seedIntialValues() {
    return new RSVP.Promise(resolve =>{
      resolve([]);
    });
  },

  setupController(controller) {
    this._super(...arguments);
    controller.set('rowCount', 100);
  }
});
