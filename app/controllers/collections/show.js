import Ember from 'ember';
import { task, timeout } from 'ember-concurrency';

const {
  computed,
  inject: { service }
} = Ember;

export default Ember.Controller.extend({
  queryParams: ['activeGeneratorId'],
  activeGeneratorId: null,

  interface: service('generation-interface'),

  // CPS
  collection: computed.alias('model'),
  generators: computed.alias('collection.generators'),


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
      let genCount = this.get('generators.length') + 1;
      this.get('store').createRecord('generator', {
        name: `Col ${genCount}`,
        collection: this.get('collection')
      }).save();
    },

    removeGenerator(generator) {
      generator.destroyRecord();
    },

    generate() {
      let generators = this.get('generators');
      let rows = this.get('rowCount');
      let includeHeaders = this.get('includeHeaders');
      this.get('interface.generateTask').perform(generators, rows, includeHeaders);
    }
  }
});
