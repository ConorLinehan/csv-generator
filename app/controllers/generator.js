import Ember from 'ember';
import { task, timeout } from 'ember-concurrency';

const {
  computed,
  inject: { service }
} = Ember;

export default Ember.Controller.extend({
  interface: service('generation-interface'),

  queryParams: ['activeGeneratorId'],
  activeGeneratorId: null,

  saveGeneratorTask: task(function *(generator) {
    yield timeout(125);
    yield generator.save();
  }).enqueue(),

  /*
  Returns generator from queryParams
  @returns { DS.Model }
   */
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
    },

    generate() {
      let generators = this.get('model');
      let rows = this.get('rowCount');
      this.get('interface.generateTask').perform(generators, rows, true);
    }
  }
});
