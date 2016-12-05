import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route('generator');
  this.route('collections', { path: '/' } , function() {});
});

export default Router;
