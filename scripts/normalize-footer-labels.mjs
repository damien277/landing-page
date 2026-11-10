// The export pads the first two footer office labels with a leading space; trim only that label text.
const PADDED_LABELS = [' Dubai, United Arab Emirates', ' Ho Chi Minh City, Vietnam'];

export function normalizeFooterLabels(html) {
  return PADDED_LABELS.reduce(
    (output, label) => output.replaceAll(`>${label}</a>`, `>${label.slice(1)}</a>`),
    html,
  );
}
