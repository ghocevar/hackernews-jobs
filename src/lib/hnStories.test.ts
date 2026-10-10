import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import type { AddressInfo } from 'node:net';
import test from 'node:test';
import { loadJobStories } from './hnStories.ts';

test('loadJobStories keeps official order and drops a failed item', async () => {
  const server = createServer((req, res) => {
    if (req.url === '/v0/jobstories.json') {
      res.setHeader('content-type', 'application/json');
      res.end(JSON.stringify([11, 22, 33]));
      return;
    }
    const stories: Record<string, unknown> = {
      '/v0/item/11.json': {
        by: 'a',
        id: 11,
        time: 1700000000,
        title: 'Alpha is hiring',
        type: 'job',
        url: 'https://example.com/alpha',
      },
      '/v0/item/33.json': {
        by: 'c',
        id: 33,
        time: 1700000002,
        title: 'Gamma is hiring',
        type: 'job',
        text: '<p>Text only</p>',
      },
    };
    const story = req.url ? stories[req.url] : undefined;
    if (!story) {
      res.statusCode = 500;
      res.end('missing');
      return;
    }
    res.setHeader('content-type', 'application/json');
    res.end(JSON.stringify(story));
  });

  await new Promise<void>((resolve) => {
    server.listen(0, '127.0.0.1', () => resolve());
  });
  const { port } = server.address() as AddressInfo;

  try {
    const stories = await loadJobStories(`http://127.0.0.1:${port}`);
    assert.deepEqual(
      stories.map((story) => story.title),
      ['Alpha is hiring', 'Gamma is hiring']
    );
    assert.equal(stories[1]?.url, undefined);
    assert.match(stories[1]?.text ?? '', /Text only/);
  } finally {
    await new Promise<void>((resolve, reject) => {
      server.close((error) => (error ? reject(error) : resolve()));
    });
  }
});
