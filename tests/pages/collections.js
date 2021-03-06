import {
  create,
  visitable,
  collection,
  clickable,
  text
} from 'ember-cli-page-object';

export default create({
  visit: visitable('/'),

  newCollection: clickable('a.new-collection'),

  collections: collection({
    itemScope: 'a.collection-item',
    item: {
      name: text('h1'),
      delete: clickable('a.delete-collection')
    }
  })
});
