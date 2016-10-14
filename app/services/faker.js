import Ember from 'ember';
import faker from 'npm:faker';

const {
  computed
} = Ember;

const KEYS_TO_REJECT = ['locale', 'locales', 'localeFallback', 'definitions', 'fake'];

export default Ember.Service.extend({

  /*
  Returns categories available to be faked from faker
  @returns { Array }
   */
  categories: computed({
    get() {
      console.log(faker);
      let keys = Object.keys(faker);
      // Removes un-needed keys
      keys = keys.filter(key => (KEYS_TO_REJECT.indexOf(key) < 0));
      return keys.sort();
    }
  }).readOnly(),

  results: computed({
    get() {
      let keys = Object.keys(faker);
      keys = keys.filter(key => (KEYS_TO_REJECT.indexOf(key) < 0));
      keys = keys.sort();
      return keys.map(key =>{
        return [key, this._resultsForCategory(key)];
      });
    }
  }),

  /*
  Returns an array of Tuples <Method Name, Sample Value> for a given category
  @param { String }
  @returns { Array }
   */
  _resultsForCategory(key) {
    let results = [];
    for (let method in faker[key]) {
      if (typeof faker[key][method] === 'function') {
        let sampleVal = faker[key][method]();
        if (typeof sampleVal === 'string') {
          results.push([method, sampleVal]);
        }
      }
    }

    return results;
  },

});
