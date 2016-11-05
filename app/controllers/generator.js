import Ember from 'ember';
import { task, timeout } from 'ember-concurrency';
import csvSave from 'csv-generator-post/utils/csv-save';
import faker from 'npm:faker';
import PapaParse from 'npm:papaparse';

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

  generateCSV(rows) {
    let csvString = this._generateCSVString(rows);
    csvSave(csvString, 'name.csv');
  },

  _generateCSVString(rows) {
    let array = [];
    let generators = this.get('store').peekAll('generator');
    for (let i = 0; i < rows; i++) {
      let row = generators.map(g =>{
        let path = g.get('fakerPath').split('.');
        return faker[path[0]][path[1]]();
      });
      array.push(row);
    }

    return PapaParse.unparse(array);
  },

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

    generateCSV(rows) {
      this.generateCSV(rows);
    }
  }
});
