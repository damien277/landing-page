import{jsx as _jsx}from"react/jsx-runtime";import*as React from"react";/**
 * Pause Offscreen — code override.
 *
 * Some animated components (path / flow animations) run a requestAnimationFrame
 * loop and re-render React every frame, even when they are far off screen. On
 * iPhones that keeps the main thread busy, so scrolling stutters and the page
 * paints late. This override keeps the component mounted only while it is on
 * (or near) the screen. Off screen it is swapped for an empty box with the same
 * class and style, so the layout does not move. Server render and first paint
 * always show the real component.
 */const MARGIN="300px 0px";export function withPauseOffscreen(Component){return /*#__PURE__*/React.forwardRef(function PauseOffscreen(props,ref){const[inView,setInView]=React.useState(true);const io=React.useRef(null);const setNode=React.useCallback(el=>{if(typeof ref==="function")ref(el);else if(ref)ref.current=el;io.current?.disconnect();io.current=null;if(!el||typeof IntersectionObserver==="undefined")return;const obs=new IntersectionObserver(entries=>{const e=entries[entries.length-1];if(e)setInView(e.isIntersecting);},{rootMargin:MARGIN});obs.observe(el);io.current=obs;},[ref]);React.useEffect(()=>()=>io.current?.disconnect(),[]);if(!inView){return /*#__PURE__*/_jsx("div",{ref:setNode,className:props.className,style:{...props.style||{}},"aria-hidden":"true"});}return /*#__PURE__*/_jsx(Component,{...props,ref:setNode});});}
export const __FramerMetadata__ = {"exports":{"withPauseOffscreen":{"type":"reactHoc","name":"withPauseOffscreen","annotations":{"framerContractVersion":"1"}},"__FramerMetadata__":{"type":"variable"}}}
//# sourceMappingURL=./PauseOffscreen.map