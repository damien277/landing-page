import { C as RenderTarget, n as richTextCSSRules, r as safari16TextTruncationFix, x as injectCSSRule } from "./chunk.YXhckCOx.mjs";

//#region ../../library/src/modules/LazyProp.ts
/**
* Defers construction of a value until it is read and then reuses the same value.
* A separate initialized flag allows factories to intentionally return `undefined`.
*/
function LazyProp(factory) {
	let initialized = false;
	let value;
	return { get value() {
		if (!initialized) {
			value = factory();
			initialized = true;
		}
		return value;
	} };
}

//#endregion
//#region ../../library/src/render/utils/cssVariables.ts
const willChangeOverrideCSSVariable = "--framer-will-change-override";
/**
* Smart Components and Layout Templates are serialized to javascript and instances are rendered on
* the canvas. Elements in these components may include effects, which need to be layerised in the
* published site and preview, but not on the the canvas. This variable can be set to "none" on the
* canvas, to disable layerisation.
*/
const willChangeEffectOverrideCSSVariable = "--framer-will-change-effect-override";
const willChangeFilterOverrideCSSVariable = "--framer-will-change-filter-override";
/** CSS custom property used for overflow: clip fallback. */
const overflowClipFallbackCSSVariable = "--overflow-clip-fallback";
const oneIfCornerShapeSupportedCSSVariable = "--one-if-corner-shape-supported";

//#endregion
//#region ../../library/src/render/utils/injectDeprecatedRichTextRules.ts
const richTextStylesRule = `
[data-framer-component-type="DeprecatedRichText"] p,
[data-framer-component-type="DeprecatedRichText"] div,
[data-framer-component-type="DeprecatedRichText"] h1,
[data-framer-component-type="DeprecatedRichText"] h2,
[data-framer-component-type="DeprecatedRichText"] h3,
[data-framer-component-type="DeprecatedRichText"] h4,
[data-framer-component-type="DeprecatedRichText"] h5,
[data-framer-component-type="DeprecatedRichText"] h6,
[data-framer-component-type="DeprecatedRichText"] li,
[data-framer-component-type="DeprecatedRichText"] ol,
[data-framer-component-type="DeprecatedRichText"] ul,
[data-framer-component-type="DeprecatedRichText"] span:not([data-text-fill]) {
    font-family: var(--framer-font-family, Inter, Inter Placeholder, sans-serif);
    font-style: var(--framer-font-style, normal);
    font-weight: var(--framer-font-weight, 400);
    color: var(--framer-text-color, #000);
    font-size: var(--framer-font-size, 16px);
    letter-spacing: var(--framer-letter-spacing, 0);
    text-transform: var(--framer-text-transform, none);
    text-decoration: var(--framer-text-decoration, none);
    line-height: var(--framer-line-height, 1.2em);
    text-align: var(--framer-text-alignment, start);
}
`;
const richTextParagraphSpacingStylesRule = `
[data-framer-component-type="DeprecatedRichText"] p:not(:first-child),
[data-framer-component-type="DeprecatedRichText"] div:not(:first-child),
[data-framer-component-type="DeprecatedRichText"] h1:not(:first-child),
[data-framer-component-type="DeprecatedRichText"] h2:not(:first-child),
[data-framer-component-type="DeprecatedRichText"] h3:not(:first-child),
[data-framer-component-type="DeprecatedRichText"] h4:not(:first-child),
[data-framer-component-type="DeprecatedRichText"] h5:not(:first-child),
[data-framer-component-type="DeprecatedRichText"] h6:not(:first-child),
[data-framer-component-type="DeprecatedRichText"] ol:not(:first-child),
[data-framer-component-type="DeprecatedRichText"] ul:not(:first-child),
[data-framer-component-type="DeprecatedRichText"] .framer-image:not(:first-child) {
    margin-top: var(--framer-paragraph-spacing, 0);
}
`;
const richTextBackgroundMaskStylesRule = `
[data-framer-component-type="DeprecatedRichText"] span[data-text-fill] {
    display: inline-block;
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
}
`;
const richTextLinkStylesRule = `
[data-framer-component-type="DeprecatedRichText"] a,
[data-framer-component-type="DeprecatedRichText"] a span:not([data-text-fill]) {
    font-family: var(--framer-link-font-family, var(--framer-font-family, Inter, Inter Placeholder, sans-serif));
    font-style: var(--framer-link-font-style, var(--framer-font-style, normal));
    font-weight: var(--framer-link-font-weight, var(--framer-font-weight, 400));
    color: var(--framer-link-text-color, var(--framer-text-color, #000));
    font-size: var(--framer-link-font-size, var(--framer-font-size, 16px));
    text-transform: var(--framer-link-text-transform, var(--framer-text-transform, none));
    text-decoration: var(--framer-link-text-decoration, var(--framer-text-decoration, none));
}
`;
const richTextLinkHoverStylesRule = `
[data-framer-component-type="DeprecatedRichText"] a:hover,
[data-framer-component-type="DeprecatedRichText"] a:hover span:not([data-text-fill]) {
    font-family: var(--framer-link-hover-font-family, var(--framer-link-font-family, var(--framer-font-family, Inter, Inter Placeholder, sans-serif)));
    font-style: var(--framer-link-hover-font-style, var(--framer-link-font-style, var(--framer-font-style, normal)));
    font-weight: var(--framer-link-hover-font-weight, var(--framer-link-font-weight, var(--framer-font-weight, 400)));
    color: var(--framer-link-hover-text-color, var(--framer-link-text-color, var(--framer-text-color, #000)));
    font-size: var(--framer-link-hover-font-size, var(--framer-link-font-size, var(--framer-font-size, 16px)));
    text-transform: var(--framer-link-hover-text-transform, var(--framer-link-text-transform, var(--framer-text-transform, none)));
    text-decoration: var(--framer-link-hover-text-decoration, var(--framer-link-text-decoration, var(--framer-text-decoration, none)));
}
`;
const richTextLinkCurrentStylesRule = `
[data-framer-component-type="DeprecatedRichText"] a[data-framer-page-link-current],
[data-framer-component-type="DeprecatedRichText"] a[data-framer-page-link-current] span:not([data-text-fill]):not([data-nested-link]) {
    font-family: var(--framer-link-current-font-family, var(--framer-link-font-family, var(--framer-font-family, Inter, Inter Placeholder, sans-serif)));
    font-style: var(--framer-link-current-font-style, var(--framer-link-font-style, var(--framer-font-style, normal)));
    font-weight: var(--framer-link-current-font-weight, var(--framer-link-font-weight, var(--framer-font-weight, 400)));
    color: var(--framer-link-current-text-color, var(--framer-link-text-color, var(--framer-text-color, #000)));
    font-size: var(--framer-link-current-font-size, var(--framer-link-font-size, var(--framer-font-size, 16px)));
    text-transform: var(--framer-link-current-text-transform, var(--framer-link-text-transform, var(--framer-text-transform, none)));
    text-decoration: var(--framer-link-current-text-decoration, var(--framer-link-text-decoration, var(--framer-text-decoration, none)));
}
`;
const richTextLinkCurrentHoverStylesRule = `
[data-framer-component-type="DeprecatedRichText"] a[data-framer-page-link-current]:hover,
[data-framer-component-type="DeprecatedRichText"] a[data-framer-page-link-current]:hover span:not([data-text-fill]):not([data-nested-link]) {
    font-family: var(--framer-link-hover-font-family, var(--framer-link-current-font-family, var(--framer-link-font-family, var(--framer-font-family, Inter, Inter Placeholder, sans-serif))));
    font-style: var(--framer-link-hover-font-style, var(--framer-link-current-font-style, var(--framer-link-font-style, var(--framer-font-style, normal))));
    font-weight: var(--framer-link-hover-font-weight, var(--framer-link-current-font-weight, var(--framer-link-font-weight, var(--framer-font-weight, 400))));
    color: var(--framer-link-hover-text-color, var(--framer-link-current-text-color, var(--framer-link-text-color, var(--framer-text-color, #000))));
    font-size: var(--framer-link-hover-font-size, var(--framer-link-current-font-size, var(--framer-link-font-size, var(--framer-font-size, 16px))));
    text-transform: var(--framer-link-hover-text-transform, var(--framer-link-current-text-transform, var(--framer-link-text-transform, var(--framer-text-transform, none))));
    text-decoration: var(--framer-link-hover-text-decoration, var(--framer-link-current-text-decoration, var(--framer-link-text-decoration, var(--framer-text-decoration, none))));
}
`;
const richTextBoldStylesRule = `
[data-framer-component-type="DeprecatedRichText"] strong {
    font-weight: bolder;
}
`;
const richTextItalicStylesRule = `
[data-framer-component-type="DeprecatedRichText"] em {
    font-style: italic;
}
`;
const richTextImageRule = `
[data-framer-component-type="DeprecatedRichText"] .framer-image {
    display: block;
    max-width: 100%;
    height: auto;
}
`;
const richTextBlockElementResetRule = `
[data-framer-component-type="DeprecatedRichText"] p,
[data-framer-component-type="DeprecatedRichText"] div,
[data-framer-component-type="DeprecatedRichText"] h1,
[data-framer-component-type="DeprecatedRichText"] h2,
[data-framer-component-type="DeprecatedRichText"] h3,
[data-framer-component-type="DeprecatedRichText"] h4,
[data-framer-component-type="DeprecatedRichText"] h5,
[data-framer-component-type="DeprecatedRichText"] h6 {
    margin: 0;
    padding: 0;
}
`;
const richTextStylesPresetResetRule = `
[data-framer-component-type="DeprecatedRichText"] .text-styles-preset-reset {
    --framer-font-family: Inter, Inter Placeholder, sans-serif;
    --framer-font-style: normal;
    --framer-font-weight: 500;
    --framer-text-color: #000;
    --framer-font-size: 16px;
    --framer-letter-spacing: 0;
    --framer-text-transform: none;
    --framer-text-decoration: none;
    --framer-line-height: 1.2em;
    --framer-text-alignment: start;
    --framer-font-open-type-features: normal;
    --font-variation-settings: normal;
}
`;
const richTextStylesList = `
[data-framer-component-type="DeprecatedRichText"] ul,
[data-framer-component-type="DeprecatedRichText"] ol {
    display: table;
    width: 100%;
    padding-left: 0;
    margin: 0;
}
`;
const richTextStylesListItem = `
[data-framer-component-type="DeprecatedRichText"] li {
    display: table-row;
    counter-increment: list-item;
    list-style: none;
}
`;
const richTextStylesNumberedListMarker = `
[data-framer-component-type="DeprecatedRichText"] ol > li::before {
    display: table-cell;
    width: 2.25ch;
    box-sizing: border-box;
    padding-right: 0.75ch;
    content: counter(list-item) ".";
    white-space: nowrap;
}
`;
const richTextStylesBulletedListMarker = `
[data-framer-component-type="DeprecatedRichText"] ul > li::before {
    display: table-cell;
    width: 2.25ch;
    box-sizing: border-box;
    padding-right: 0.75ch;
    content: "•";
}
`;
const deprecatedRichTextCSSRules = [
	`[data-framer-component-type="DeprecatedRichText"] { cursor: inherit; }`,
	richTextStylesPresetResetRule,
	richTextBlockElementResetRule,
	richTextStylesRule,
	richTextParagraphSpacingStylesRule,
	richTextBackgroundMaskStylesRule,
	richTextLinkStylesRule,
	richTextLinkHoverStylesRule,
	richTextLinkCurrentStylesRule,
	richTextLinkCurrentHoverStylesRule,
	richTextBoldStylesRule,
	richTextItalicStylesRule,
	richTextImageRule,
	richTextStylesList,
	richTextStylesListItem,
	richTextStylesNumberedListMarker,
	richTextStylesBulletedListMarker
];

//#endregion
//#region ../../library/src/render/utils/libraryCSSRules.ts
const combineCSSRules = (isPreview) => {
	const componentCSSRules = `[data-framer-component-type] { position: absolute; }`;
	const textCSSRules = [
		`[data-framer-component-type="Text"] { cursor: inherit; }`,
		`[data-framer-component-text-autosized] * { white-space: pre; }`,
		`
[data-framer-component-type="Text"] > * {
    text-align: var(--framer-text-alignment, start);
}`,
		`
[data-framer-component-type="Text"] span span,
[data-framer-component-type="Text"] p span,
[data-framer-component-type="Text"] h1 span,
[data-framer-component-type="Text"] h2 span,
[data-framer-component-type="Text"] h3 span,
[data-framer-component-type="Text"] h4 span,
[data-framer-component-type="Text"] h5 span,
[data-framer-component-type="Text"] h6 span {
    display: block;
}`,
		`
[data-framer-component-type="Text"] span span span,
[data-framer-component-type="Text"] p span span,
[data-framer-component-type="Text"] h1 span span,
[data-framer-component-type="Text"] h2 span span,
[data-framer-component-type="Text"] h3 span span,
[data-framer-component-type="Text"] h4 span span,
[data-framer-component-type="Text"] h5 span span,
[data-framer-component-type="Text"] h6 span span {
    display: unset;
}`,
		`
[data-framer-component-type="Text"] div div span,
[data-framer-component-type="Text"] a div span,
[data-framer-component-type="Text"] span span span,
[data-framer-component-type="Text"] p span span,
[data-framer-component-type="Text"] h1 span span,
[data-framer-component-type="Text"] h2 span span,
[data-framer-component-type="Text"] h3 span span,
[data-framer-component-type="Text"] h4 span span,
[data-framer-component-type="Text"] h5 span span,
[data-framer-component-type="Text"] h6 span span,
[data-framer-component-type="Text"] a {
    font-family: var(--font-family);
    font-style: var(--font-style);
    font-weight: min(calc(var(--framer-font-weight-increase, 0) + var(--font-weight, 400)), 900);
    color: var(--text-color);
    letter-spacing: var(--letter-spacing);
    font-size: var(--font-size);
    text-transform: var(--text-transform);
    --text-decoration: var(--framer-text-decoration-style, solid) var(--framer-text-decoration, none) var(--framer-text-decoration-color, currentcolor) var(--framer-text-decoration-thickness, auto);
    --text-decoration-skip-ink: var(--framer-text-decoration-skip-ink);
    --text-underline-offset: var(--framer-text-decoration-offset);
    line-height: var(--line-height);
}`,
		`
[data-framer-component-type="Text"] div div span,
[data-framer-component-type="Text"] a div span,
[data-framer-component-type="Text"] span span span,
[data-framer-component-type="Text"] p span span,
[data-framer-component-type="Text"] h1 span span,
[data-framer-component-type="Text"] h2 span span,
[data-framer-component-type="Text"] h3 span span,
[data-framer-component-type="Text"] h4 span span,
[data-framer-component-type="Text"] h5 span span,
[data-framer-component-type="Text"] h6 span span,
[data-framer-component-type="Text"] a {
    --font-family: var(--framer-font-family);
    --font-style: var(--framer-font-style);
    --font-weight: var(--framer-font-weight);
    --text-color: var(--framer-text-color);
    --letter-spacing: var(--framer-letter-spacing);
    --font-size: var(--framer-font-size);
    --text-transform: var(--framer-text-transform);
    --text-decoration: var(--framer-text-decoration-style, solid) var(--framer-text-decoration, none) var(--framer-text-decoration-color, currentcolor) var(--framer-text-decoration-thickness, auto);
    --text-decoration-skip-ink: var(--framer-text-decoration-skip-ink);
    --text-underline-offset: var(--framer-text-decoration-offset);
    --line-height: var(--framer-line-height);
}`,
		`
[data-framer-component-type="Text"] a,
[data-framer-component-type="Text"] a div span,
[data-framer-component-type="Text"] a span span span,
[data-framer-component-type="Text"] a p span span,
[data-framer-component-type="Text"] a h1 span span,
[data-framer-component-type="Text"] a h2 span span,
[data-framer-component-type="Text"] a h3 span span,
[data-framer-component-type="Text"] a h4 span span,
[data-framer-component-type="Text"] a h5 span span,
[data-framer-component-type="Text"] a h6 span span {
    --font-family: var(--framer-link-font-family, var(--framer-font-family));
    --font-style: var(--framer-link-font-style, var(--framer-font-style));
    --font-weight: var(--framer-link-font-weight, var(--framer-font-weight));
    --text-color: var(--framer-link-text-color, var(--framer-text-color));
    --font-size: var(--framer-link-font-size, var(--framer-font-size));
    --text-transform: var(--framer-link-text-transform, var(--framer-text-transform));
    --text-decoration: var(--framer-link-text-decoration-style, var(--framer-text-decoration-style, solid)) var(--framer-link-text-decoration, var(--framer-text-decoration, none)) var(--framer-link-text-decoration-color, var(--framer-text-decoration-color, currentcolor)) var(--framer-link-text-decoration-thickness, var(--framer-text-decoration-thickness, auto));
    --text-decoration-skip-ink: var(--framer-link-text-decoration-skip-ink, var(--framer-text-decoration-skip-ink));
    --text-underline-offset: var(--framer-link-text-decoration-offset, var(--framer-text-decoration-offset));
}`,
		`
[data-framer-component-type="Text"] a:hover,
[data-framer-component-type="Text"] a div span:hover,
[data-framer-component-type="Text"] a span span span:hover,
[data-framer-component-type="Text"] a p span span:hover,
[data-framer-component-type="Text"] a h1 span span:hover,
[data-framer-component-type="Text"] a h2 span span:hover,
[data-framer-component-type="Text"] a h3 span span:hover,
[data-framer-component-type="Text"] a h4 span span:hover,
[data-framer-component-type="Text"] a h5 span span:hover,
[data-framer-component-type="Text"] a h6 span span:hover {
    --font-family: var(--framer-link-hover-font-family, var(--framer-link-font-family, var(--framer-font-family)));
    --font-style: var(--framer-link-hover-font-style, var(--framer-link-font-style, var(--framer-font-style)));
    --font-weight: var(--framer-link-hover-font-weight, var(--framer-link-font-weight, var(--framer-font-weight)));
    --text-color: var(--framer-link-hover-text-color, var(--framer-link-text-color, var(--framer-text-color)));
    --font-size: var(--framer-link-hover-font-size, var(--framer-link-font-size, var(--framer-font-size)));
    --text-transform: var(--framer-link-hover-text-transform, var(--framer-link-text-transform, var(--framer-text-transform)));
    --text-decoration: var(--framer-link-hover-text-decoration-style, var(--framer-link-text-decoration-style, var(--framer-text-decoration-style, solid))) var(--framer-link-hover-text-decoration, var(--framer-link-text-decoration, var(--framer-text-decoration, none))) var(--framer-link-hover-text-decoration-color, var(--framer-link-text-decoration-color, var(--framer-text-decoration-color, currentcolor))) var(--framer-link-hover-text-decoration-thickness, var(--framer-link-text-decoration-thickness, var(--framer-text-decoration-thickness, auto)));
    --text-decoration-skip-ink: var(--framer-link-hover-text-decoration-skip-ink, var(--framer-link-text-decoration-skip-ink, var(--framer-text-decoration-skip-ink)));
    --text-underline-offset: var(--framer-link-hover-text-decoration-offset, var(--framer-link-text-decoration-offset, var(--framer-text-decoration-offset)));
}`,
		`
[data-framer-component-type="Text"].isCurrent a,
[data-framer-component-type="Text"].isCurrent a div span,
[data-framer-component-type="Text"].isCurrent a span span span,
[data-framer-component-type="Text"].isCurrent a p span span,
[data-framer-component-type="Text"].isCurrent a h1 span span,
[data-framer-component-type="Text"].isCurrent a h2 span span,
[data-framer-component-type="Text"].isCurrent a h3 span span,
[data-framer-component-type="Text"].isCurrent a h4 span span,
[data-framer-component-type="Text"].isCurrent a h5 span span,
[data-framer-component-type="Text"].isCurrent a h6 span span {
    --font-family: var(--framer-link-current-font-family, var(--framer-link-font-family, var(--framer-font-family)));
    --font-style: var(--framer-link-current-font-style, var(--framer-link-font-style, var(--framer-font-style)));
    --font-weight: var(--framer-link-current-font-weight, var(--framer-link-font-weight, var(--framer-font-weight)));
    --text-color: var(--framer-link-current-text-color, var(--framer-link-text-color, var(--framer-text-color)));
    --font-size: var(--framer-link-current-font-size, var(--framer-link-font-size, var(--framer-font-size)));
    --text-transform: var(--framer-link-current-text-transform, var(--framer-link-text-transform, var(--framer-text-transform)));
    --text-decoration: var(--framer-link-current-text-decoration-style, var(--framer-link-text-decoration-style, var(--framer-text-decoration-style, solid))) var(--framer-link-current-text-decoration, var(--framer-link-text-decoration, var(--framer-text-decoration, none))) var(--framer-link-current-text-decoration-color, var(--framer-link-text-decoration-color, var(--framer-text-decoration-color, currentcolor))) var(--framer-link-current-text-decoration-thickness, var(--framer-link-text-decoration-thickness, var(--framer-text-decoration-thickness, auto)));
    --text-decoration-skip-ink: var(--framer-link-current-text-decoration-skip-ink, var(--framer-link-text-decoration-skip-ink, var(--framer-text-decoration-skip-ink)));
    --text-underline-offset: var(--framer-link-current-text-decoration-offset, var(--framer-link-text-decoration-offset, var(--framer-text-decoration-offset)));
}`
	];
	/**
	* In generated code sticky is set via CSS, we don't want to set `position:
	* relative` here since it has a higher precedence. Code-gen stack children will
	* receive their `position: relative` through style overrides.
	* Keep this scoped to Stack now that the content wrapper has been removed;
	* an unqualified child selector would change positioning throughout the page.
	*/
	const stackPositionRule = `
[data-framer-component-type="Stack"]:not([data-framer-generated]) > *,
[data-framer-component-type="Stack"]:not([data-framer-generated]) > [data-framer-component-type] {
    position: relative;
}`;
	const navigationCSSRules = `
NavigationContainer
[data-framer-component-type="NavigationContainer"] > *,
[data-framer-component-type="NavigationContainer"] > [data-framer-component-type] {
    position: relative;
}`;
	const scrollCSSRules = [`[data-framer-component-type="Scroll"]::-webkit-scrollbar { display: none; }`, `[data-framer-component-type="ScrollContentWrapper"] > * { position: relative; }`];
	const nativeScrollCSSRules = [
		`[data-framer-component-type="NativeScroll"] { -webkit-overflow-scrolling: touch; }`,
		`[data-framer-component-type="NativeScroll"] > * { position: relative; }`,
		`[data-framer-component-type="NativeScroll"].direction-both { overflow-x: auto; overflow-y: auto; }`,
		`[data-framer-component-type="NativeScroll"].direction-vertical { overflow-x: hidden; overflow-y: auto; }`,
		`[data-framer-component-type="NativeScroll"].direction-horizontal { overflow-x: auto; overflow-y: hidden; }`,
		`[data-framer-component-type="NativeScroll"].direction-vertical > * { width: 100% !important; }`,
		`[data-framer-component-type="NativeScroll"].direction-horizontal > * { height: 100% !important; }`,
		`[data-framer-component-type="NativeScroll"].scrollbar-hidden::-webkit-scrollbar { display: none; }`
	];
	const deviceComponentCSSRules = `[data-framer-component-type="DeviceComponent"].no-device > * { width: 100% !important; height: 100% !important; }`;
	const pageContentWrapperWrapperCSSRules = `[data-framer-component-type="PageContentWrapper"] > *, [data-framer-component-type="PageContentWrapper"] > [data-framer-component-type] { position: relative; }`;
	const presenceCSS = `[data-is-present="false"], [data-is-present="false"] * { pointer-events: none !important; }`;
	/**
	* Framer Motion has a lengthy cross-fade when doing shared layout animations to cover up morphing
	* between the lead and follow layers. When building a lightbox, this is undesirable because we only
	* want to see the high resolution image for the entire enter AND exit animation.
	*
	* Using this !important rule allows us to achieve this without complicated/custom framer-motion
	* animation overrides - retaining the lead image at full opacity for its entire existence.
	*/
	const lightboxCSS = `.framer-lightbox-container { opacity: 1 !important; pointer-events: auto !important; }`;
	const cursorCSS = [
		`[data-framer-cursor="pointer"] { cursor: pointer; }`,
		`[data-framer-cursor="grab"] { cursor: grab; }`,
		`[data-framer-cursor="grab"]:active { cursor: grabbing; }`
	];
	const frameCSS = [`[data-framer-component-type="Frame"] *, [data-framer-component-type="Stack"] * { pointer-events: auto; }`, `[data-framer-generated] * { pointer-events: unset }`];
	const resetCSS = `[data-reset="button"] {
        border-width: 0;
        padding: 0;
        background: none;
}`;
	const hideScrollbars = [
		`[data-hide-scrollbars="true"]::-webkit-scrollbar { width: 0px; height: 0px; }`,
		`[data-hide-scrollbars="true"]::-webkit-scrollbar-thumb { background: transparent; }`,
		`[data-hide-scrollbars="true"] { scrollbar-width: none; }`
	];
	const anySafariVersion = "(background: -webkit-named-image(i))";
	const safari16OrGreater = "(grid-template-rows: subgrid)";
	const safari26OrGreater = "(position-area: top right)";
	const willChangeTransformRules = (isPreview) => isPreview ? [`body { ${willChangeOverrideCSSVariable}: none; }`, `@supports ${anySafariVersion} and (not ${safari16OrGreater}) { body { ${willChangeOverrideCSSVariable}: transform; } }`] : [`body { ${willChangeOverrideCSSVariable}: none; ${willChangeEffectOverrideCSSVariable}: none; }`];
	const willChangeFilterRules = (isPreview) => isPreview ? [`body { ${willChangeFilterOverrideCSSVariable}: none; }`, `@supports ${anySafariVersion} and (not ${safari26OrGreater}) { body { ${willChangeFilterOverrideCSSVariable}: filter; } }`] : [`body { ${willChangeFilterOverrideCSSVariable}: none; }`];
	/**
	* Add propagation-blocking if we're not on the canvas. If we add this while on the canvas,
	* strange behaviour can appear in the Component panel, with the drag event being blocked.
	*/
	const frameCSSRules = (isPreview) => {
		return isPreview ? frameCSS : [];
	};
	const svgCSSRules = `.svgContainer svg { display: block; }`;
	/**
	* Safari 15 does not support the overflow: clip property, so when `overflow: clip` is not
	* supported, we set `--overflow-clip-fallback: hidden`, which is then used in:
	*
	* ```css
	* overflow: var(--overflow-clip-fallback, clip)
	* ```
	*
	* This allows us to remove this fallback later, without having to regenerate all the existing
	* modules, since they will default to `clip` if `--overflow-clip-fallback` is not set.
	*
	* Note: we use `@supports` to set `--overflow-clip-fallback` because `var()` fallbacks don't work
	* for invalid/unsupported values, only for undefined css variables, which means the following would
	* NOT work:
	*
	* ```css
	* --clip: clip
	* overflow: var(--clip, hidden)
	* ```
	*
	* @see https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_cascading_variables/Using_CSS_custom_properties#invalid_custom_properties
	*/
	const overflowClipFallbackCSSRules = `@supports (not (overflow: clip)) {
        :root { ${overflowClipFallbackCSSVariable}: hidden; }
    }`;
	const cornerShapeCSSRules = `@supports (corner-shape: superellipse(2)) { :root { ${oneIfCornerShapeSupportedCSSVariable}: 1 } }`;
	return [
		...willChangeTransformRules(isPreview),
		...willChangeFilterRules(isPreview),
		componentCSSRules,
		...textCSSRules,
		...richTextCSSRules,
		...deprecatedRichTextCSSRules,
		stackPositionRule,
		navigationCSSRules,
		...scrollCSSRules,
		...nativeScrollCSSRules,
		pageContentWrapperWrapperCSSRules,
		deviceComponentCSSRules,
		presenceCSS,
		...cursorCSS,
		...frameCSSRules(isPreview),
		svgCSSRules,
		resetCSS,
		...hideScrollbars,
		overflowClipFallbackCSSRules,
		lightboxCSS,
		...safari16TextTruncationFix,
		cornerShapeCSSRules
	];
};
const combinedCSSRules = /* @__PURE__ */ LazyProp(() => combineCSSRules(false));
/** @internal */
const combinedCSSRulesForPreview = /* @__PURE__ */ LazyProp(() => combineCSSRules(true));
function getCombinedCSSRules() {
	return RenderTarget.current() === RenderTarget.preview ? combinedCSSRulesForPreview.value : combinedCSSRules.value;
}
/** @internal */
function injectComponentCSSRulesWithSheet(sheet, cache) {
	const styles = RenderTarget.current() === RenderTarget.preview ? combinedCSSRulesForPreview.value : combinedCSSRules.value;
	for (const rule of styles) injectCSSRule(rule, sheet, cache);
}

//#endregion
export { combinedCSSRulesForPreview, getCombinedCSSRules, injectComponentCSSRulesWithSheet };
//# sourceMappingURL=./chunk.B3RYC8bk.mjs.map