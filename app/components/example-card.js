import Ember from 'ember';
import faker from 'npm:faker';

export default Ember.Component.extend({
  classNames: ['card'],

  didReceiveAttrs() {
    this._super(...arguments);
    this._generateExample();
  },

  _generateExample() {
    let namespace = this.get('namespace');
    let type = this.get('type');

    let example = faker[namespace][type]();
    this.set('example', example);
  },

  actions: {
    refresh() {
      this._generateExample();
    }
  }
});
