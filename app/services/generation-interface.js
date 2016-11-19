/* global Worker */

import Ember from 'ember';
import faker from 'npm:faker';
import Papa from 'npm:papaparse';
import fileSaver from 'npm:file-saver';
import { task, timeout } from 'ember-concurrency';

const {
  computed,
  RSVP
} = Ember;

const SHOULD_USE_WORKERS_NUMBER = 500;

export default Ember.Service.extend({

  /**
   * Starts generation of mock data csvString
   * @param { Array } models
   * @param { Number } rows
   * @param { boolean } shouldIncludeHeaders
   * @return  { TaskInstance }
   */
  generateTask: task(function* (models, rows, shouldIncludeHeaders) {
    // Create Session Model
    this.setProperties({
      generators: models,
      rows: rows,
      shouldIncludeHeaders: shouldIncludeHeaders
    });

    let stringTask;
    if (this.get('shouldUseWorker')) {
      stringTask = this.get('_workerTask').perform();
    } else {
      stringTask = this.get('_chunkTask').perform();
    }
    let csvString = yield stringTask;

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

  /**
   *
   */
  _chunkTask: task(function *() {
    let array = [];
    if (this.get('shouldIncludeHeaders')) {
      let headers = this.get('headers');
      array = [headers];
    }

    // Stores functions in array to avoid lookups in loop
    let generatorFuncs = this.get('generatorFuncs');
    let rows = this.get('rows');
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

    return Papa.unparse(array);
  }),

  /**
   *
   */
  _workerTask: task(function *() {
    let data = {
      paths: this.get('generatorPaths'),
      rows: this.get('rows')
    };

    if (this.get('shouldIncludeHeaders')) {
      data.headers = this.get('headers');
    }

    let worker = this._createWorker();
    worker.postMessage(data);

    let workerPromise = new RSVP.Promise((resolve, reject) =>{
      worker.addEventListener('message', ({ data }) => resolve(data));
      worker.addEventListener('error', (e) => reject(e));
    });

    return yield workerPromise;
  }),

  /**
   * Creates gen-data worker
   * @return { Worker }
   */
  _createWorker() {
    return new Worker('/assets/gen-data.js');
  },

  // CPS
  headers: computed.mapBy('generators.[]', 'name'),

  /**
   *Returns faker methods from generator paths
   * @type { Array }
   */
  generatorFuncs: computed('generatorPaths.[]', {
    get() {
      return this.get('generatorPaths').map(path =>{
        return faker[path[0]][path[1]];
      });
    }
  }),

  /**
   * Paths for generators
   * @type { Array }
   */
  generatorPaths: computed('generators.[]', {
    get() {
      return this.get('generators').map(g =>{
        return g.get('fakerPath').split('.');
      });
    }
  }),

  /**
   * Decides whether or not to use a worker
   * @type { Boolean }
   */
  shouldUseWorker: computed('rows', {
    get() {
      let rows = this.get('rows');
      if (Worker) {
        return (rows > SHOULD_USE_WORKERS_NUMBER) ? true : false;
      } else {
        return false;
      }
    }
  })
});