// Export localization turns same-document SVG references into HTML-file URLs.
export function normalizeSvgReferences(html) {
  // shortcut: inline SVG attributes only; extend if exports move references into CSS blocks.
  const tokens = /<!--[\s\S]*?-->|<(?:script|style)\b[^>]*>[\s\S]*?<\/(?:script|style)\s*>|<\/?[a-z][^"'<>]*(?:(?:"[^"]*"|'[^']*')[^"'<>]*)*>/gi;
  const ids = new Set();
  for (const [tag] of html.matchAll(tokens)) {
    if (/^<\/?(?:script|style)\b|^<!--/i.test(tag)) continue;
    for (const match of tag.matchAll(/\s+id\s*=\s*(["'])(.*?)\1/gi)) ids.add(match[2]);
  }

  function localFragment(value) {
    const match = /^(?:\.{1,2}\/)*[^/?#:'"\s]+\.html#([\w.:-]+)$/.exec(value);
    if (!match) return value;
    if (!ids.has(match[1])) return value;
    return `#${match[1]}`;
  }

  let depth = 0;
  return html.replace(tokens, (tag) => {
    if (/^<\/?(?:script|style)\b|^<!--/i.test(tag)) return tag;
    const [, closing, rawName] = /^<(\/?)([\w:-]+)/.exec(tag);
    const name = rawName.toLowerCase();
    if (closing) {
      if (name === 'svg') depth--;
      return tag;
    }
    if (name === 'svg') depth++;
    let rewritten = tag;
    if (depth > 0) {
      rewritten = tag.replace(/(\s+([\w:-]+)\s*=\s*)(["'])([\s\S]*?)\3/g, (attribute, prefix, key, quote, value) => {
        if (/^(?:use|lineargradient|radialgradient|pattern|filter|textpath|mpath)$/.test(name) && /^(?:xlink:)?href$/i.test(key)) {
          value = localFragment(value);
        }
        value = value.replace(/url\(\s*(["']?)([^"'()\s]+)\1\s*\)/gi, (url, q, target) => {
          const fragment = localFragment(target);
          return fragment === target ? url : `url(${q}${fragment}${q})`;
        });
        return `${prefix}${quote}${value}${quote}`;
      });
    }
    if (name === 'svg' && /\/\s*>$/.test(tag)) depth--;
    return rewritten;
  });
}
