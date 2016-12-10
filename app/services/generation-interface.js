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
    let paths = this.get('generatorPaths');
    let rows = this.get('rows');
    let pathsLength = paths.length;

    for (let i = rows; i--;) {
      if (i % 100 === 0) {
        yield timeout(20);
      }

      let row = [];
      for (let i = 0; i < pathsLength; i++) {
        row[i] = faker[paths[i][0]][paths[i][1]]();
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
      worker.addEventListener('message', ({ data }) => {
        if (data.result) {
          resolve(data.result);
        } else if (data.progress) {
          this.set('progress', data.progress);
        }
      });
      worker.addEventListener('error', (e) => reject(e));
    });

    return yield workerPromise;
  }),

  /**
   * Creates gen-data worker
   * @return { Worker }
   */
  _createWorker() {
    let cachedWorker = this.get('cachedWorker');
    if (cachedWorker) {
      return cachedWorker;
    } else {

      let worker = new Worker('/assets/gen-data.js');
      this.set('cachedWorker', worker);
      return worker;
    }
  },

  /**
   * Setup worker on init
   */
  init() {
    this._super(...arguments);
    this._createWorker();
  },

  // CPS
  headers: computed.mapBy('generators.[]', 'name'),

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
