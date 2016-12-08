import Ember from 'ember';

export default Ember.Route.extend({
  // NOTE: Used to populate collection hasMany relationships
  model() {
    return this.get('store').findAll('generator');
  }
});
