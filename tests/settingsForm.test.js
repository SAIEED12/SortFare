const test = require('node:test');
const assert = require('node:assert/strict');
const { validateSettings } = require('../src/settingsForm');

test('accepts valid settings', () => {
  const result = validateSettings({ email: 'user@example.com', interval: 'weekly', digest: true });
  assert.equal(result.isValid, true);
  assert.deepEqual(result.errors, {});
});

test('reports missing email and interval', () => {
  const result = validateSettings({});
  assert.equal(result.isValid, false);
  assert.equal(result.errors.email, 'Email is required.');
  assert.equal(result.errors.interval, 'Choose a delivery interval.');
});

test('rejects malformed email', () => {
  const result = validateSettings({ email: 'not-an-email', interval: 'daily' });
  assert.equal(result.isValid, false);
  assert.equal(result.errors.email, 'Enter a valid email address.');
});

test('rejects unsupported intervals', () => {
  const result = validateSettings({ email: 'user@example.com', interval: 'every-hour' });
  assert.equal(result.isValid, false);
  assert.equal(result.errors.interval, 'Choose a supported delivery interval.');
});
