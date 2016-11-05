import Ember from 'ember';
import { task, timeout } from 'ember-concurrency';

const {
  computed
} = Ember;

export default Ember.Controller.extend({
  queryParams: ['activeGeneratorId'],
  activeGeneratorId: null,

  saveGeneratorTask: task(function *(generator) {
    yield timeout(125);
    yield generator.save();
  }).enqueue(),

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
