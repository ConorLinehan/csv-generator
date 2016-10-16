import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import Ember from 'ember';

const {
  computed,
} = Ember;

export default Model.extend({
  name: attr('string'),
  fakerPath: attr('string', {defaultValue: 'name.findName'}),
  generatorCategory: computed('fakerPath', {
    get() {
      return this.get('fakerPath').split('.')[0];
    }
  }).readOnly(),

  generatorName: computed('fakerPath', {
    get() {
      return this.get('fakerPath').split('.')[1];
    }
  }).readOnly(),
});
