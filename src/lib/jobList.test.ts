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

test('job text is shown without markup', () => {
  const html =
    'Quill | Fullstack SWE | <a href="https:&#x2F;&#x2F;quill.co&#x2F;">https:&#x2F;&#x2F;quill.co&#x2F;</a><p>Hiring</p>';
  const text = plainText(html);

  assert.match(text, /Quill \| Fullstack SWE/);
  assert.match(text, /https:\/\/quill\.co\//);
  assert.equal(text.includes('<'), false);
  assert.equal(text.includes('&'), false);
});
