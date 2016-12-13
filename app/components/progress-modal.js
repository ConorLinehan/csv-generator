import Ember from 'ember';
import { timeout, task } from 'ember-concurrency';

const {
  inject: { service },
  computed
} = Ember;

export default Ember.Component.extend({
  classNames: ['progress-modal'],

  interface: service('generation-interface'),

  didInsertElement() {
    this._super(...arguments);
    // this.get('_demo').perform();
  },

  _demo: task(function *() {
    while (true) {
      yield timeout(2000);
      if (this.get('state') === 'generating') {
        this.set('state', 'foo');
      } else {
        this.set('state', 'generating');
      }
    }
  }),

  progress: computed.oneWay('interface.progress'),
  // state: 'generating'
  state: computed('progress', {
    get() {
      if (this.get('progress') > 99) {
        return 'parsing';
      } else {
        return 'generating';
      }
    }
  }),
});
