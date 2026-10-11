import assert from 'node:assert/strict';
import type { Server } from 'node:http';
import { createServer } from 'node:http';
import type { AddressInfo } from 'node:net';
import test from 'node:test';
import { loadJobStories } from './hnStories.ts';

interface FixtureItem {
  by: string;
  id: number;
  time: number;
  title: string;
  type: string;
  url?: string;
  text?: string;
}

async function withFixture(
  ids: number[],
  items: Record<number, FixtureItem | 'fail' | 'null'>,
  run: (
    baseURL: string,
    hits: { ids: number; items: Record<string, number> }
  ) => Promise<void>
): Promise<void> {
  const hits = { ids: 0, items: {} as Record<string, number> };
  const server: Server = createServer((req, res) => {
    if (req.url === '/v0/jobstories.json') {
      hits.ids += 1;
      res.setHeader('content-type', 'application/json');
      res.end(JSON.stringify(ids));
      return;
    }
    const match = req.url?.match(/^\/v0\/item\/(\d+)\.json$/);
    if (match) {
      hits.items[match[1]] = (hits.items[match[1]] ?? 0) + 1;
    }
    const item = match ? items[Number(match[1])] : undefined;
    if (item === 'null') {
      res.setHeader('content-type', 'application/json');
      res.end('null');
      return;
    }
    if (!item || item === 'fail') {
      res.statusCode = 500;
      res.end('missing');
      return;
    }
    res.setHeader('content-type', 'application/json');
    res.end(JSON.stringify(item));
  });

  await new Promise<void>((resolve) => {
    server.listen(0, '127.0.0.1', () => resolve());
  });
  const { port } = server.address() as AddressInfo;

  try {
    await run(`http://127.0.0.1:${port}`, hits);
  } finally {
    await new Promise<void>((resolve, reject) => {
      server.close((error) => (error ? reject(error) : resolve()));
    });
  }
}

test('keeps official order and text-only posts', async () => {
  await withFixture(
    [3, 2, 1],
    {
      3: {
        by: 'ada',
        id: 3,
        time: 1700000000,
        title: 'With URL',
        type: 'job',
        url: 'https://example.com/jobs',
      },
      2: {
        by: 'bea',
        id: 2,
        time: 1700000100,
        title: 'Text only',
        type: 'job',
        text: '<p>Come work with us</p>',
      },
      1: {
        by: 'cy',
        id: 1,
        time: 1700000200,
        title: 'Not a job',
        type: 'story',
        url: 'https://example.com/nope',
      },
    },
    async (baseURL) => {
      const stories = await loadJobStories(baseURL);
      assert.deepEqual(
        stories.map((story) => story.id),
        [3, 2]
      );
      assert.equal(stories[0]?.url, 'https://example.com/jobs');
      assert.equal(stories[0]?.text, undefined);
      assert.equal(stories[1]?.url, undefined);
      assert.equal(stories[1]?.text, '<p>Come work with us</p>');
    }
  );
});

test('skips items that fail to load', async () => {
  await withFixture(
    [10, 11],
    {
      10: {
        by: 'ada',
        id: 10,
        time: 1700000000,
        title: 'Kept',
        type: 'job',
      },
      11: 'fail',
    },
    async (baseURL) => {
      const stories = await loadJobStories(baseURL);
      assert.deepEqual(
        stories.map((story) => story.title),
        ['Kept']
      );
    }
  );
});

test('errors when every item fails', async () => {
  await withFixture([10, 11], { 10: 'fail', 11: 'fail' }, async (baseURL) => {
    await assert.rejects(() => loadJobStories(baseURL), /none could be loaded/);
  });
});

test('does not keep a short list when an item failed', async () => {
  const items: Record<number, FixtureItem | 'fail'> = {
    10: {
      by: 'ada',
      id: 10,
      time: 1700000000,
      title: 'Kept',
      type: 'job',
    },
    11: 'fail',
  };
  await withFixture([10, 11], items, async (baseURL, hits) => {
    const first = await loadJobStories(baseURL);
    assert.deepEqual(
      first.map((story) => story.title),
      ['Kept']
    );
    items[11] = {
      by: 'bea',
      id: 11,
      time: 1700000100,
      title: 'Back',
      type: 'job',
    };
    const second = await loadJobStories(baseURL);
    assert.deepEqual(
      second.map((story) => story.title),
      ['Kept', 'Back']
    );
    assert.equal(hits.items['11'], 2);
  });
});

test('a missing item is left out and the rest of the list is kept', async () => {
  await withFixture(
    [10, 11],
    {
      10: {
        by: 'ada',
        id: 10,
        time: 1700000000,
        title: 'Kept',
        type: 'job',
      },
      11: 'null',
    },
    async (baseURL, hits) => {
      const first = await loadJobStories(baseURL);
      const second = await loadJobStories(baseURL);
      assert.deepEqual(
        first.map((story) => story.id),
        [10]
      );
      assert.deepEqual(
        second.map((story) => story.id),
        [10]
      );
      assert.equal(hits.ids, 1);
      assert.equal(hits.items['11'], 1);
    }
  );
});

test('a failed refresh keeps the last complete list', async () => {
  const items: Record<number, FixtureItem | 'fail'> = {
    7: {
      by: 'ada',
      id: 7,
      time: 1700000000,
      title: 'Hiring',
      type: 'job',
    },
  };
  await withFixture([7], items, async (baseURL, hits) => {
    const first = await loadJobStories(baseURL, 0);
    assert.equal(first[0]?.title, 'Hiring');
    items[7] = 'fail';
    const second = await loadJobStories(baseURL, 0);
    assert.equal(second[0]?.title, 'Hiring');
    assert.equal(hits.ids, 2);
  });
});

test('reuses the list until the cache expires', async () => {
  await withFixture(
    [7],
    {
      7: {
        by: 'ada',
        id: 7,
        time: 1700000000,
        title: 'Hiring',
        type: 'job',
      },
    },
    async (baseURL, hits) => {
      const first = await loadJobStories(baseURL);
      const second = await loadJobStories(baseURL);
      assert.equal(hits.ids, 1);
      assert.equal(first[0]?.title, 'Hiring');
      assert.equal(second[0]?.title, 'Hiring');
    }
  );
});
