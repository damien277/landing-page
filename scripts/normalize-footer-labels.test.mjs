import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizeFooterLabels } from './normalize-footer-labels.mjs';

test('strips the leading space from the two padded office labels', () => {
  const html = '<a class="framer-text" href="https://hello.botanika.ai/offices#dubai" rel> Dubai, United Arab Emirates</a><a href="https://hello.botanika.ai/offices#vietnam" rel> Ho Chi Minh City, Vietnam</a>';
  const expected = '<a class="framer-text" href="https://hello.botanika.ai/offices#dubai" rel>Dubai, United Arab Emirates</a><a href="https://hello.botanika.ai/offices#vietnam" rel>Ho Chi Minh City, Vietnam</a>';
  const normalized = normalizeFooterLabels(html);
  assert.equal(normalized, expected);
  assert.equal(normalizeFooterLabels(normalized), normalized);
});

test('leaves aligned labels and unrelated text untouched', () => {
  const html = '<a href="#panama">Panama City, Republic of Panama</a><a href="#dubai">Botanika Cortex Trading LLC — Dubai, United Arab Emirates</a><p> Dubai, United Arab Emirates</p>';
  assert.equal(normalizeFooterLabels(html), html);
});
