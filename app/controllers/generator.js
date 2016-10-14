import Ember from 'ember';
import faker from 'npm:faker';

export default Ember.Controller.extend({
  queryParams: ['addGenerator'],
  addGenerator: false,

  fakeColumns: [],

  init() {
    this._super(...arguments);
    console.log(faker);
  }
});
