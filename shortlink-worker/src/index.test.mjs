import test from 'node:test';
import assert from 'node:assert/strict';
import worker, {createRandomSlug, validateAlias, validateDestination} from './index.mjs';

function fakeDb(initial) {
  const rows = new Map(initial || []);
  return {
    rows,
    prepare(sql) {
      return {
        bind(...values) {
          return {
            async first() {
              if (sql.startsWith('SELECT target_url')) {
                const row = rows.get(values[0]);
                return row ? {target_url: row.target_url} : null;
              }
              return null;
            },
            async run() {
              if (sql.startsWith('INSERT OR IGNORE')) {
                const slug = values[0];
                if (rows.has(slug)) return {meta: {changes: 0}};
                rows.set(slug, {target_url: values[1], created_at: values[2]});
                return {meta: {changes: 1}};
              }
              return {meta: {changes: 0}};
            }
          };
        }
      };
    }
  };
}

test('destination validation only accepts http and https', () => {
  assert.equal(validateDestination('https://example.com/path').ok, true);
  assert.equal(validateDestination('http://example.com').ok, true);
  assert.equal(validateDestination('javascript:alert(1)').ok, false);
  assert.equal(validateDestination('file:///etc/passwd').ok, false);
  assert.equal(validateDestination('https://user:secret@example.com').ok, false);
  assert.equal(validateDestination('https://go.marcelloart.site/demo1').ok, false);
});

test('custom alias validation limits characters, length, and reserved names', () => {
  assert.equal(validateAlias(null).ok, true);
  assert.equal(validateAlias('promo-2026').value, 'promo-2026');
  assert.equal(validateAlias('Bad Name').ok, false);
  assert.equal(validateAlias('a').ok, false);
  assert.equal(validateAlias('api').ok, false);
});

test('generated codes use lowercase letters and digits', () => {
  const slug = createRandomSlug(8);
  assert.match(slug, /^[a-z0-9]{8}$/);
});

test('existing slug redirects with a no-referrer policy', async () => {
  const env = {DB: fakeDb([['demo1', {target_url: 'https://example.com/long'}]])};
  const response = await worker.fetch(new Request('https://go.marcelloart.site/demo1'), env);
  assert.equal(response.status, 302);
  assert.equal(response.headers.get('Location'), 'https://example.com/long');
  assert.equal(response.headers.get('Referrer-Policy'), 'no-referrer');
});

test('unknown slug returns 404', async () => {
  const env = {DB: fakeDb()};
  const response = await worker.fetch(new Request('https://go.marcelloart.site/unknown'), env);
  assert.equal(response.status, 404);
});
