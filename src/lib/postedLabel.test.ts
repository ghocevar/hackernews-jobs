import assert from 'node:assert/strict';
import test from 'node:test';
import { postedLabel } from './postedLabel.ts';

const now = 1_700_000_000_000;

test('a past job says how long ago it was posted', () => {
  assert.equal(postedLabel(1_700_000_000 - 3600, now), 'Posted 1 hour ago');
});

test('a future timestamp is not described as already posted', () => {
  assert.equal(postedLabel(1_700_000_000 + 3600, now), 'Posted in 1 hour');
});

test('a missing or impossible timestamp has no label', () => {
  assert.equal(postedLabel(0, now), null);
  assert.equal(postedLabel(Number.NaN, now), null);
  assert.equal(postedLabel(1e16, now), null);
});
