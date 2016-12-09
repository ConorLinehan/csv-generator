import {
  create,
  visitable,
  clickable,
  collection,
  fillable,
  hasClass,
  text
} from 'ember-cli-page-object';

const generatorModal = {
  scope: '.modal-card',
  tabs: collection({
    itemScope: '.tabs li',
    item: {
      click: clickable('a'),
      isActive: hasClass('is-active')
    }
  }),
  types: collection({
    itemScope: 'a.generator-type',
    item: {
      type: text('p'),
      example: text('h4')
    }
  })
};

export { generatorModal };

export default create({
  visit: visitable('/:collection_id'),

  generatorModal,

  addGenerator: clickable('a.add-generator'),
  generators: collection({
    itemScope: 'li.generator',
    item: {
      remove: clickable('a.remove-generator'),
      triggerPathChange: clickable('a.change-type'),
      name: fillable('input.name')
    }
  }),
  createControl: {
    scope: 'p.row-count',
    fillInput: fillable('input'),
    create: clickable('a'),
    isLoading: hasClass('is-loading', 'a')
  }
});
