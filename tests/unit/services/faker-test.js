import { moduleFor, test } from 'ember-qunit';

const EXPECTED_CATEGORIES = [
  'address', 'commerce', 'company',
  'date', 'finance', 'hacker',
  'helpers', 'image', 'internet',
  'lorem', 'name', 'phone',
  'random', 'system'
];

moduleFor('service:faker', 'Unit | Service | faker');

// Replace this with your real tests.
test('it computes results', function(assert) {
  let service = this.subject();

  let result = service.get('results');
  assert.deepEqual(result.map(r => r[0]), EXPECTED_CATEGORIES, 'returns correct categories');
});

test('it computes results for a category', function(assert) {
  let service = this.subject();

  let result = service._resultsForCategory('address');
  assert.deepEqual(result.length, 16);
});
