import {
  create,
  visitable,
  clickable,
  collection,
  fillable
} from 'ember-cli-page-object';

const generatorModal = {
  scope: '.modal-card',
  types: collection({
    itemScope: 'a.generator-type'
  })
};

export { generatorModal };

export default create({
  visit: visitable('/'),

  generatorModal,

  addGenerator: clickable('a.add-generator'),
  generators: collection({
    itemScope: 'li.generator',
    item: {
      remove: clickable('a.remove-generator'),
      triggerPathChange: clickable('a.change-type'),
      name: fillable('input.name')
    }
  })
});
