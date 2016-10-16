import Ember from 'ember';

const {
  computed
} = Ember;

export default Ember.Controller.extend({
  queryParams: ['activeGeneratorId'],
  activeGeneratorId: null,

  activeGenerator: computed('activeGeneratorId', {
    get() {
      return this.get('store').peekRecord('generator', this.get('activeGeneratorId'));
    }
  }),

  actions: {
    addGenerator() {
      let genCount = this.get('model.length') + 1;
      this.get('store').createRecord('generator', {
        name: `Col ${genCount}`
      }).save();
    },

    removeGenerator(generator) {
      generator.destroyRecord();
    }
  }
});
