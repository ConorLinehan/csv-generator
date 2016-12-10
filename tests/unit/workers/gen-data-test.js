/* global Worker */
import { module, test } from 'qunit';
import Papa from 'npm:papaparse';

module('Unit | Utility | gen-data');

test('it generates fake data', function(assert) {
  let done = assert.async();
  let worker = new Worker('/assets/gen-data.js');

  worker.addEventListener('message', ({ data }) =>{
    if (data.result) {
      let result = data.result;
      assert.ok((typeof result === 'string'), 'returns unparsed data');
      let parsedData = Papa.parse(result).data;
      assert.equal(parsedData.length, 10, 'generated ten rows');
      done();
    }
  });

  worker.addEventListener('error', (e) =>{
    console.error(e);
    assert.ok(false);
    done();
  });

  let data = {
    rows: 10,
    paths: [ [['random'], ['number']], [['name'], ['firstName']] ]
  };

  worker.postMessage(data);
});

test('it posts back progress', function(assert) {
  let done = assert.async();
  let worker = new Worker('/assets/gen-data.js');

  let messages = [];

  worker.addEventListener('message', ({ data }) =>{
    if (data.result) {
      assert.deepEqual(
        messages,
        [0, 20, 40, 60, 80],
        'sends progress messages'
      );
      done();
    } else {
      messages.push(data.progress);
    }
  });

  worker.addEventListener('error', () =>{
    done();
  });

  let data = {
    rows: 500,
    paths: [ [['random'], ['number']], [['name'], ['firstName']] ]
  };

  worker.postMessage(data);
});
