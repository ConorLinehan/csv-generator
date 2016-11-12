/* global Worker */
import { module, test } from 'qunit';
import Papa from 'npm:papaparse';

module('Unit | Utility | gen-data');

test('it generates fake data', function(assert) {
  let done = assert.async();
  let worker = new Worker('/assets/gen-data.js');

  worker.addEventListener('message', ({ data }) =>{
    assert.ok((typeof data === 'string'), 'returns unparsed data');
    let parsedData = Papa.parse(data).data;
    assert.equal(parsedData.length, 10, 'generated ten rows');
    done();
  });

  worker.addEventListener('error', (e) =>{
    console.error(e);
    done();
  });

  let data = {
    rows: 10,
    paths: ['random.number', 'name.firstName']
  };

  worker.postMessage(data);
});
