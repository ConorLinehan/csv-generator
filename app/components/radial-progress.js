// https://codepen.io/xgad/post/svg-radial-progress-meters
const RADIUS = 54;
const CIRCUMFRANCE = 2 * RADIUS * Math.PI;

import Ember from 'ember';

const {
  computed
} = Ember;

export default Ember.Component.extend({
  classNames: ['radial-progress'],

  /**
   * Value for dashoffset
   * @param {Number}
   */
  offsetValue: computed('progress', {
    get() {
      return CIRCUMFRANCE * ((100 - this.get('progress')) / 100);
    }
  })
});
