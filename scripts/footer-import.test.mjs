import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, cpSync, writeFileSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';

test('build retains contact and restores offices in each footer without duplication', () => {
  const dir = mkdtempSync(join(tmpdir(), 'botanika-footer-'));
  try {
    cpSync(new URL('./', import.meta.url), join(dir, 'scripts'), { recursive: true });
    const contact = '<!--$--><div class="framer-1c3ri1y"><p><a href="https://hello.botanika.ai/contact">Contact</a></p></div><!--/$-->';
    writeFileSync(join(dir, 'index.html'), `<html><head><style>.framer-s0sE4 .framer-1c3ri1y,{height:auto}</style></head><body><footer>${contact}</footer><footer>${contact}</footer></body></html>`);
    const build = () => execFileSync(process.execPath, ['scripts/finalize-seo-origin.mjs'], { cwd: dir, env: { ...process.env, SITE_URL: 'https://hello.botanika.ai' } });
    build();
    const first = readFileSync(join(dir, 'public/index.html'), 'utf8');
    assert.equal((first.match(/href="https:\/\/hello.botanika.ai\/offices">Global Offices<\/a>/g) ?? []).length, 2);
    assert.equal((first.match(/href="https:\/\/hello.botanika.ai\/contact">Contact<\/a>/g) ?? []).length, 2);
    assert.ok(first.includes('.framer-s0sE4 .framer-1j2j8uc,'));
    build();
    assert.equal(readFileSync(join(dir, 'public/index.html'), 'utf8'), first);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});
