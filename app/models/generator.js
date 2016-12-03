import DS from 'ember-data';
import Ember from 'ember';

const {
  computed,
} = Ember;

const {
  Model,
  belongsTo,
  attr
} = DS;

export default Model.extend({
  name: attr('string'),
  fakerPath: attr('string', {defaultValue: 'name.findName'}),

  collection: belongsTo('collection', { async: true, autoSave: true }),

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
