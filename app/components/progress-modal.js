import Ember from 'ember';
import { animate, Promise, stop } from 'liquid-fire';
import { timeout, task } from 'ember-concurrency';

const {
  inject: { service },
  computed
} = Ember;

export default Ember.Component.extend({
  classNames: ['progress-modal'],
  progressAnimation,

  interface: service('generation-interface'),

  didInsertElement() {
    this._super(...arguments);
    // this.get('_demo').perform();
  },

  _demo: task(function *() {
    while (true) {
      yield timeout(1200);
      if (this.get('state') === 'generating') {
        this.set('state', 'foo');
      } else {
        this.set('state', 'generating');
      }
    }
  }),

  progress: computed.oneWay('interface.progress'),
  // state: 'foo'
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

function progressAnimation(opts = {}) {
  stop(this.oldElement);
  return Promise.all([
    animate(this.oldElement, { translateY: ['-30px', '-60px'], opacity: '0' }, opts),
    animate(this.newElement, { translateY: ['0px', '-30px'] }, opts),
  ]);
}
