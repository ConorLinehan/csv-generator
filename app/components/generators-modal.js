import Ember from 'ember';

const {
  inject: { service }
} = Ember;

export default Ember.Component.extend({
  faker: service(),

  init() {
    this._super(...arguments);
    this.set('activeGenerator', this.get('faker.results.firstObject'));
  },

  actions: {
    selected(catergory, type) {
      let path = `${catergory}.${type}`;
      this.attrs.updatePath(path);
    }
  }
});
