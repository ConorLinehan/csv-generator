import Ember from 'ember';

export default Ember.Controller.extend({

  actions: {
    addCollection() {
      this.get('store').createRecord('collection').save();
    },

    deleteCollection(collection) {
      collection.destoyRecord();
    }
  }
});
