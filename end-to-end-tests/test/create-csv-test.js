"use strict";

var Nightmare = require('nightmare');
require('nightmare-inline-download')(Nightmare);
var nightmare = Nightmare({
    switches: {
      'ignore-certificate-errors': true
    },
});
var assert = require('chai').assert;
var mocha = require('mocha');
var coMocha = require('co-mocha');
var csv = require('fast-csv');
var RSVP = require('rsvp');

coMocha(mocha);

const URL = 'https://csv-generator.staging.pagefrontapp.com/';
const TEN_SECONDS = 1e4;
const WORKER_TRIGGER_NUMBER = 700;

/**
 * Returns Promise with csv data
 * @param  {String} path
 * @return {Promise}
 */
function parseCSV(path) {
  return new RSVP.Promise(function(resolve, reject) {
    let result = [];

    csv
    .fromPath(path)
    .on('data', function(data) {
      result.push(data);
    })
    .on('end', function() {
      resolve(result);
    });
  });
}


describe('Downloads CSV File', function() {
  this.timeout(TEN_SECONDS);

  before(function* (){
    return yield nightmare.goto(URL);
  });

  it('can create csv [NON Worker]', function*() {
    yield nightmare
    .click('.collection-item')
    .click('button.generate')
    .download('./csv_dump/non_worker.csv');

    let result = yield parseCSV('./csv_dump/non_worker.csv');
    assert.lengthOf(result, 102, 'creates csv');
  });

  it('can create csv [WORKER]', function*() {
    yield nightmare
    .insert('.row-count input', '')
    .insert('.row-count input', WORKER_TRIGGER_NUMBER)
    .click('button.generate')
    .download('./csv_dump/worker.csv');

    let result = yield parseCSV('./csv_dump/worker.csv');

    assert.lengthOf(result, 701, 'creates csv');
  });

});
