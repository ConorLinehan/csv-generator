import DS from 'ember-data';
import faker from 'npm:faker';

const {
  hasMany,
  attr
} = DS;

export default DS.Model.extend({
  name: attr('string', { defaultValue: () =>{
    return faker.commerce.productName();
  }}),
  generators: hasMany('generator', { async: true, dependent: 'destroy' }),
});
