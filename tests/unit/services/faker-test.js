import { moduleFor, test } from 'ember-qunit';

const EXPECTED_CATEGORIES = [
  'address', 'commerce', 'company',
  'date', 'finance', 'hacker',
  'helpers', 'image', 'internet',
  'lorem', 'name', 'phone',
  'random', 'system'
];

moduleFor('service:faker', 'Unit | Service | faker', {
  // Specify the other units that are required for this test.
  // needs: ['service:foo']
});

// Replace this with your real tests.
test('it computes categories', function(assert) {
  let service = this.subject();

  let result = service.get('categories');
  assert.deepEqual(result, EXPECTED_CATEGORIES, 'returns correct categories');
});

test('it computes results for a category', function(assert) {
  let service = this.subject();

  let result = service.resultsForCategory('address');
  assert.deepEqual(result.length, 16);

  assert.deepEqual(result, service.cachedResults['address'], 'caches results');

  service.cachedResults['address'] = ['fake cache'];
  assert.deepEqual(service.resultsForCategory('address'), ['fake cache'], 'fetches from cache');
});
