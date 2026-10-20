import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizeSvgReferences } from './normalize-svg-references.mjs';

test('repairs exported SVG uses, masks, gradients and quoted style URLs', () => {
  const html = `<svg><defs><path id="mark"/><clipPath id="clip"/><linearGradient id="paint"/></defs><use href="./index.html#mark" clip-path="url(./index.html#clip)" style="fill:url('../contact.html#paint')"/><use xlink:href="../page-4.html#mark"/></svg>`;
  assert.equal(normalizeSvgReferences(html), `<svg><defs><path id="mark"/><clipPath id="clip"/><linearGradient id="paint"/></defs><use href="#mark" clip-path="url(#clip)" style="fill:url('#paint')"/><use xlink:href="#mark"/></svg>`);
});

test('preserves navigation, external assets, scripts, comments and unknown targets', () => {
  const html = `<a href="./index.html#mark">Navigate</a><script>const template = '<svg><use href="./index.html#mark"/></svg>';</script><!-- <svg><use href="./index.html#mark"/></svg> --><style>.icon{fill:url(./index.html#mark)}</style><svg><path id="mark"/><a href="../contact.html#mark"/><use href="https://example.com/icon.svg#mark"/><use href="./sprite.svg#mark"/><use href="./index.html#absent"/><path fill="url(#mark)"/></svg>`;
  assert.equal(normalizeSvgReferences(html), html);
});

test('keeps SVG scope through nested and self-closing SVGs and is idempotent', () => {
  const html = `<svg/><a href="./index.html#mark">Before</a><svg><svg><path id="mark"/></svg><use href="index.html#mark"/></svg><a href="./index.html#mark">After</a>`;
  const expected = html.replace('href="index.html#mark"', 'href="#mark"');
  const normalized = normalizeSvgReferences(html);
  assert.equal(normalized, expected);
  assert.equal(normalizeSvgReferences(normalized), normalized);
});
