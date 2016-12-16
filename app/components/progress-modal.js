import Ember from 'ember';

const {
  inject: { service },
  computed
} = Ember;

export default Ember.Component.extend({
  classNames: ['progress-modal'],

  interface: service('generation-interface'),

  progress: computed.oneWay('interface.progress'),
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
