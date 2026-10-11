import assert from 'node:assert/strict';
import test from 'node:test';
import { jobHref } from './jobs.ts';
import { plainText } from './plainText.ts';

test('jobs with a url keep that url', () => {
  assert.equal(
    jobHref({ id: 1, url: 'https://example.com/jobs' }),
    'https://example.com/jobs'
  );
});

test('text-only jobs link to the Hacker News item', () => {
  assert.equal(
    jobHref({ id: 49524704 }),
    'https://news.ycombinator.com/item?id=49524704'
  );
});

test('only http and https job urls are followed', () => {
  const item = 'https://news.ycombinator.com/item?id=5';
  assert.equal(jobHref({ id: 5, url: 'javascript:alert(1)' }), item);
  assert.equal(jobHref({ id: 5, url: 'data:text/html,hi' }), item);
  assert.equal(jobHref({ id: 5, url: '//evil.example/phish' }), item);
  assert.equal(jobHref({ id: 5, url: 'mailto:jobs@example.com' }), item);
});

test('job text is shown without markup', () => {
  const html =
    'Quill | Fullstack SWE | <a href="https:&#x2F;&#x2F;quill.co&#x2F;">https:&#x2F;&#x2F;quill.co&#x2F;</a><p>Hiring</p>';
  assert.equal(
    plainText(html),
    'Quill | Fullstack SWE | https://quill.co/ Hiring'
  );
});

test('job text keeps unknown entities and does not throw on a bad code point', () => {
  assert.equal(plainText('We&rsquo;re hiring'), 'We&rsquo;re hiring');
  assert.equal(plainText('A &amp; B'), 'A & B');
  assert.equal(plainText('Role &#x110000; open'), 'Role &#x110000; open');
  assert.equal(plainText('Role &#1114112; open'), 'Role &#1114112; open');
});
