import Ember from 'ember';
import faker from 'npm:faker';

const {
  isBlank
} = Ember;

export default Ember.Component.extend({
  classNames: ['card'],

  didReceiveAttrs() {
    this._super(...arguments);
    // If we're provided with intial example don't generate
    if (isBlank(this.get('example'))) {
      this._generateExample();
    }
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
