import {
  create,
  clickable,
  text
} from 'ember-cli-page-object';

export default create({
  type: text('.card-header-title'),
  example: text('.card-content .title'),
  refresh: clickable('a.refresh')
});
