import Ember from 'ember';
import { task, timeout } from 'ember-concurrency';
import fileSaver from 'npm:file-saver';
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

  generateCSVTask: task(function *(rows) {
    let csvArray = yield this.get('_generateCSVStringTask').perform(rows);
    let csvString = PapaParse.unparse(csvArray);
    this._saveCSV(csvString);
  }).drop(),

  /*
    Saves csvString
    @params { String }
   */
  _saveCSV(csvString) {
    let blob = new Blob([csvString], {
        type: "text/csv; charset=utf-8;"
    });
    fileSaver.saveAs(blob, 'data.csv');
  },

  /*
  Chunks in csv string
  @params { Number }
  @returns { Promise }
   */
  _generateCSVStringTask: task(function *(rows) {
    let headers = this.get('headers');
    let array = [headers];

    // Stores functions in array to avoid lookups in loop
    let generatorFuncs = this.get('generatorFuncs');

    let generatorFuncsLength = generatorFuncs.length;

    for (let i = rows; i--;) {
      if (i % 100 === 0) {
        yield timeout(20);
      }

      let row = [];
      for (let i = 0; i < generatorFuncsLength; i++) {
        row[i] = generatorFuncs[i]();
      }
      array.push(row);
    }

    return array;
  }),

  // CP's

  generators: computed.alias('model'),

  /*
  Returns generator from queryParams
  @returns { DS.Model }
   */
  activeGenerator: computed('activeGeneratorId', {
    get() {
      return this.get('store').peekRecord('generator', this.get('activeGeneratorId'));
    }
  }),

  /*
  Returns faker methods from generator paths
  @returns { Array }
   */
  generatorFuncs: computed('generators.[]', {
    get() {
      return this.get('generators')
      .map(g =>{
        let path = g.get('fakerPath').split('.');
        return faker[path[0]][path[1]];
      });
    }
  }),

  headers: computed.mapBy('generators.[]', 'name'),

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
