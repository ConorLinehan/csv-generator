import Ember from 'ember';

const {
  inject: { service },
  computed
} = Ember;

export default Ember.Component.extend({
  classNames: ['progress-modal'],

  interface: service('generation-interface'),

  // CPS
  progress: computed.oneWay('interface.progress'),
  isParsing: computed.readOnly('interface.isParsing'),

});
