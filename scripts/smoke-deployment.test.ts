import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

test('smoke follows the pull request head and fails a broken deployment immediately', () => {
  const dir = mkdtempSync(join(tmpdir(), 'hn-smoke-'));
  const log = join(dir, 'gh.log');
  writeFileSync(log, '');
  writeFileSync(
    join(dir, 'gh'),
    `#!/usr/bin/env node
const { appendFileSync } = require('node:fs');
const path = process.argv[2] === 'api' ? process.argv[3] : process.argv[2];
appendFileSync(process.env.GH_LOG, path + '\\n');
if (String(path).includes('/statuses')) {
  process.stdout.write(process.env.GH_STATUSES ?? '[]');
} else {
  process.stdout.write(process.env.GH_DEPLOYMENTS ?? '[]');
}
`
  );
  const chmod = spawnSync('chmod', ['+x', join(dir, 'gh')]);
  assert.equal(chmod.status, 0);

  const started = Date.now();
  const result = spawnSync('bash', ['scripts/smoke-deployment.sh'], {
    cwd: root,
    encoding: 'utf8',
    env: {
      ...process.env,
      PATH: `${dir}:${process.env.PATH ?? ''}`,
      GH_LOG: log,
      GITHUB_REPOSITORY: 'ghocevar/hackernews-jobs',
      SMOKE_SHA: 'deadbeef',
      GH_DEPLOYMENTS: JSON.stringify([{ id: 9, environment: 'Preview' }]),
      GH_STATUSES: JSON.stringify([
        {
          state: 'failure',
          environment_url: 'https://example.com',
          description: 'Deployment has failed',
        },
      ]),
    },
  });
  const elapsed = Date.now() - started;

  assert.notEqual(result.status, 0);
  assert.match(result.stderr ?? '', /Deployment has failed/);
  assert.match(readFileSync(log, 'utf8'), /sha=deadbeef/);
  assert.equal(elapsed < 4000, true, `waited ${elapsed}ms`);
});
