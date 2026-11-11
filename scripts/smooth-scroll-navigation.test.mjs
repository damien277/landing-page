import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { runInNewContext } from 'node:vm';

const SITES = '_remote/framerusercontent.com/sites/2sCVuo4iVIB3EAvYAQN9Pw';
const bundlePath = readdirSync(SITES)
  .filter(name => name.endsWith('.mjs'))
  .map(name => join(SITES, name))
  .find(path => readFileSync(path, 'utf8').includes('Error in anchor click handler'));
if (!bundlePath) throw new Error('Smooth Scroll bundle not found');
const bundleSource = readFileSync(bundlePath, 'utf8');
const component = /function ([A-Za-z0-9_$]+)\(e\)\{let\{intensity:/.exec(bundleSource);
const tail = /}var [A-Za-z0-9_$]+;function/.exec(bundleSource.slice(component.index));
const endMarker = tail[0].slice(1, tail[0].lastIndexOf(';') + 1);

const implementations = [
  ['module', '_remote/framerusercontent.com/modules/Yppqt3Cs3Y8TZqvASnXl/PGrowqBrgWCViHduGfsA/SmoothScroll_Prod.js', 'function SmoothScrollComponent(', '/**', 'SmoothScrollComponent'],
  ['bundle', bundlePath, `function ${component[1]}(`, endMarker, component[1]],
];

function mount(path, start, end, name, destination, options = {}) {
  const effects = [], scrolls = [];
  const target = { id: 'present' };
  const anchor = new URL(destination, 'https://hello.botanika.ai/');
  anchor.target = options.target ?? '';
  anchor.hasAttribute = name => name === 'download' && options.download === true;
  anchor.addEventListener = (name, handler) => { if (name === 'click') anchor.click = handler; };
  const location = new URL('https://hello.botanika.ai/');
  const window = { location, getComputedStyle: () => ({ scrollMarginTop: '24' }) };
  const document = {
    documentElement: { style: {} },
    querySelector: selector => selector === '#present' ? target : null,
    querySelectorAll: () => [anchor],
    getElementById: id => id === 'present' ? target : null,
    getElementsByTagName: () => [],
  };
  const useRef = value => ({ current: value });
  const useEffect = effect => effects.push(effect);
  class Lenis {
    scrollTo(...args) { scrolls.push(args); }
    start() {}
    stop() {}
  }
  class MutationObserver { observe() {} }
  const source = readFileSync(path, 'utf8');
  const offset = source.indexOf(start);
  assert.notEqual(offset, -1);
  const component = source.slice(offset, source.indexOf(end, offset));
  const [constructorName] = /new ([A-Za-z0-9_$]+)\(\{duration:/.exec(component)?.slice(1) ?? [];
  runInNewContext(`${component}\n${name}({intensity:10});`, {
    window, a: window, document, useRef, s: useRef, useEffect, _: useEffect,
    Lenis, [constructorName ?? 'Lenis']: Lenis, MutationObserver, requestAnimationFrame: () => 1,
    _jsx: () => null, f: () => null, console,
  });
  effects.forEach(effect => effect());
  const event = {
    currentTarget: anchor, button: 0, defaultPrevented: false,
    ...options,
    preventDefault() { this.defaultPrevented = true; },
  };
  anchor.click?.(event);
  return { event, scrolls, target };
}

for (const [label, path, start, end, name] of implementations) {
  const click = (url, options) => mount(path, start, end, name, url, options);
  test(`${label}: scrolls an existing same-document anchor`, () => {
    const { event, scrolls } = click('/#present');
    assert.equal(event.defaultPrevented, true);
    assert.equal(scrolls.length, 1);
    const destination = scrolls[0][0];
    assert.equal(typeof destination === 'string' ? destination : `#${destination.id}`, '#present');
    assert.equal(scrolls[0][1].offset, -24);
  });
  test(`${label}: leaves cross-page, cross-origin, query changes and missing anchors to navigation`, () => {
    for (const url of ['/offices#present', 'https://other.example/#present', '/?language=vi#present', '/#absent']) {
      const { event, scrolls } = click(url);
      assert.equal(event.defaultPrevented, false, url);
      assert.deepEqual(scrolls, [], url);
    }
  });
  test(`${label}: preserves modified clicks, new tabs, downloads and prior cancellation`, () => {
    for (const options of [{ ctrlKey: true }, { metaKey: true }, { shiftKey: true }, { altKey: true }, { button: 1 }, { target: '_blank' }, { download: true }, { defaultPrevented: true }]) {
      const { event, scrolls } = click('/#present', options);
      assert.equal(event.defaultPrevented, options.defaultPrevented ?? false);
      assert.deepEqual(scrolls, []);
    }
  });
}
