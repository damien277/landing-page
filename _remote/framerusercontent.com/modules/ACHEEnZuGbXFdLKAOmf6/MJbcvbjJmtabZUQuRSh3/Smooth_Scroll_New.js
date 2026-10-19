import{jsx as _jsx}from"react/jsx-runtime";import{useEffect,useRef}from"react";import{addPropertyControls,ControlType}from"framer";/**
 * Lenis Smooth Scroll
 *
 * Designed to work with:
 * - Framer Sticky sections
 * - Framer Scroll Variants
 * - Desktop wheel scrolling
 * - Mobile touch scrolling
 * - Native mobile pull-to-refresh
 *
 * The component does NOT:
 * - force scroll snapping
 * - hijack wheel events
 * - hijack touch events
 * - force sections into position
 */export default function LenisSmoothScroll(props){const lenisRef=useRef(null);const rafRef=useRef(null);const initializedRef=useRef(false);/*
     * Keep settings in a ref so Lenis always reads
     * the latest Framer controller values.
     */const settingsRef=useRef({duration:1.2,intensity:.5,scrollSpeed:1,touchSmooth:true,touchMultiplier:1.2,pullToRefresh:true});/*
     * ---------------------------------------------------------
     * UPDATE SETTINGS
     * ---------------------------------------------------------
     */useEffect(()=>{settingsRef.current={duration:Number(props.duration)||1.2,intensity:Number(props.intensity)||.5,scrollSpeed:Number(props.scrollSpeed)||1,touchSmooth:Boolean(props.touchSmooth),touchMultiplier:Number(props.touchMultiplier)||1.2,pullToRefresh:Boolean(props.pullToRefresh)};/*
         * Restart Lenis when a controller changes.
         *
         * This keeps the Framer controls live.
         */if(initializedRef.current){startLenis();}},[props.duration,props.intensity,props.scrollSpeed,props.touchSmooth,props.touchMultiplier,props.pullToRefresh]);/*
     * ---------------------------------------------------------
     * REFRESH DETECTION
     * ---------------------------------------------------------
     *
     * We use both:
     *
     * 1. Navigation Timing
     * 2. sessionStorage + beforeunload
     *
     * This makes reload-to-top reliable on desktop
     * and mobile browsers.
     */const RELOAD_KEY="__lenis_refresh__";const detectReload=()=>{let navigationReload=false;try{const navigation=performance.getEntriesByType("navigation")[0];navigationReload=navigation?.type==="reload";}catch{}let storedReload=false;try{storedReload=sessionStorage.getItem(RELOAD_KEY)==="1";/*
             * Consume immediately.
             */sessionStorage.removeItem(RELOAD_KEY);}catch{}return navigationReload||storedReload;};/*
     * ---------------------------------------------------------
     * FORCE TOP
     * ---------------------------------------------------------
     */const forceTop=()=>{try{window.scrollTo({top:0,left:0,behavior:"auto"});}catch{window.scrollTo(0,0);}document.documentElement.scrollTop=0;document.body.scrollTop=0;};/*
     * ---------------------------------------------------------
     * DESTROY LENIS
     * ---------------------------------------------------------
     */const destroyLenis=()=>{if(rafRef.current!==null){cancelAnimationFrame(rafRef.current);rafRef.current=null;}if(lenisRef.current){try{lenisRef.current.destroy();}catch{}lenisRef.current=null;}window.lenis=undefined;};/*
     * ---------------------------------------------------------
     * START LENIS
     * ---------------------------------------------------------
     */const startLenis=()=>{const Lenis=window.Lenis;if(!Lenis)return;/*
         * Always destroy the previous instance before
         * creating a new one.
         */destroyLenis();const settings=settingsRef.current;/*
         * IMPORTANT FOR MOBILE:
         *
         * When Pull To Refresh is ON, we keep touch scrolling
         * native. This allows the browser's top-edge gesture
         * to work normally.
         *
         * Desktop wheel remains fully smooth.
         */const smoothTouch=settings.touchSmooth&&!settings.pullToRefresh;/*
         * -----------------------------------------------------
         * LENIS INSTANCE
         * -----------------------------------------------------
         */const lenis=new Lenis({/*
             * Main smoothness.
             */duration:settings.duration,/*
             * Smooth easing.
             *
             * The easing is intentionally continuous so
             * sticky sections don't receive a sudden
             * acceleration/deceleration at their boundaries.
             */easing:t=>{const power=3+settings.intensity*8;return 1-Math.pow(1-t,power);},/*
             * Desktop / trackpad.
             */smoothWheel:true,wheelMultiplier:settings.scrollSpeed,/*
             * Mobile.
             */smoothTouch,touchMultiplier:settings.touchMultiplier,/*
             * Only sync touch when Lenis itself is
             * controlling the touch movement.
             */syncTouch:smoothTouch,/*
             * Keep scrolling vertical.
             */gestureOrientation:"vertical",/*
             * Let Lenis automatically recalculate
             * dimensions when Framer layout changes.
             *
             * This is important for sticky/variant sections.
             */autoResize:true});lenisRef.current=lenis/*
         * Make the instance available globally.
         */;window.lenis=lenis;/*
         * -----------------------------------------------------
         * RAF LOOP
         * -----------------------------------------------------
         */const raf=time=>{if(!lenisRef.current)return;lenis.raf(time);rafRef.current=requestAnimationFrame(raf);};rafRef.current=requestAnimationFrame(raf);/*
         * -----------------------------------------------------
         * RELOAD → TOP
         * -----------------------------------------------------
         */if(window.__LENIS_RELOAD__===true){/*
             * Do NOT animate to the top.
             *
             * On a reload the page must start at
             * exactly 0.
             */try{lenis.scrollTo(0,{immediate:true});}catch{}forceTop();/*
             * One extra frame after Lenis has mounted.
             */requestAnimationFrame(()=>{if(!lenisRef.current)return;try{lenisRef.current.scrollTo(0,{immediate:true});}catch{}forceTop();});}console.log("Lenis Smooth Scroll Activated");};/*
     * ---------------------------------------------------------
     * MAIN INITIALIZATION
     * ---------------------------------------------------------
     */useEffect(()=>{if(initializedRef.current)return;initializedRef.current=true;let mounted=true;let loadTimeout=null;/*
         * -----------------------------------------------------
         * BROWSER SCROLL RESTORATION
         * -----------------------------------------------------
         *
         * This is set before Lenis starts so browser native
         * scroll restoration doesn't fight the smooth scroll.
         */if("scrollRestoration"in history){history.scrollRestoration="manual";}/*
         * Detect whether this document is a reload.
         */const isReload=detectReload();window.__LENIS_RELOAD__=isReload;/*
         * -----------------------------------------------------
         * MARK THE NEXT DOCUMENT AS A RELOAD
         * -----------------------------------------------------
         *
         * beforeunload fires when the browser refreshes/reloads
         * the document.
         *
         * We do NOT listen to scroll or touch events here.
         */const markReload=()=>{try{sessionStorage.setItem(RELOAD_KEY,"1");}catch{}};window.addEventListener("beforeunload",markReload);/*
         * -----------------------------------------------------
         * RELOAD → FORCE TOP
         * -----------------------------------------------------
         */let topFrames=0;let topLockActive=isReload;const keepReloadAtTop=()=>{if(!mounted||!topLockActive){return;}forceTop();topFrames++;/*
             * Only during initial reload.
             *
             * After the page has settled we completely
             * stop touching scroll position.
             */if(topFrames<20){requestAnimationFrame(keepReloadAtTop);}else{topLockActive=false;}};if(isReload){forceTop();requestAnimationFrame(keepReloadAtTop);/*
             * Additional delayed protection for browsers
             * that restore scroll after layout.
             */const reloadTimers=[100,250,500,800];reloadTimers.forEach(delay=>{window.setTimeout(()=>{if(mounted&&isReload){forceTop();}},delay);});}/*
         * -----------------------------------------------------
         * PAGESHOW
         * -----------------------------------------------------
         */const handlePageShow=event=>{if(!mounted)return;/*
             * Only reset actual reloads.
             *
             * Back/forward navigation is left alone.
             */if(isReload&&!event.persisted){forceTop();requestAnimationFrame(()=>{forceTop();});}};window.addEventListener("pageshow",handlePageShow);/*
         * -----------------------------------------------------
         * LOAD LENIS SCRIPT
         * -----------------------------------------------------
         */const loadLenis=()=>{if(!mounted)return;/*
             * Lenis already exists.
             */if(window.Lenis){startLenis();return;}/*
             * Check for an existing script first.
             */const existingScript=document.querySelector('script[data-lenis="true"]');if(existingScript){existingScript.addEventListener("load",()=>{if(mounted){startLenis();}},{once:true});return;}/*
             * Load Lenis.
             */const script=document.createElement("script");script.src="https://unpkg.com/lenis@1.3.1/dist/lenis.min.js";script.async=true;script.dataset.lenis="true";script.onload=()=>{if(mounted){startLenis();}};script.onerror=()=>{console.warn("Lenis failed to load.");};document.head.appendChild(script);}/*
         * -----------------------------------------------------
         * GLOBAL UPDATE API
         * -----------------------------------------------------
         */;window.updateLenis=(options={})=>{/*
             * Update settings.
             */if(options.duration!==undefined){settingsRef.current.duration=Number(options.duration);}if(options.intensity!==undefined){settingsRef.current.intensity=Number(options.intensity);}if(options.speed!==undefined){settingsRef.current.scrollSpeed=Number(options.speed);}if(options.touchSmooth!==undefined){settingsRef.current.touchSmooth=Boolean(options.touchSmooth);}if(options.touchMultiplier!==undefined){settingsRef.current.touchMultiplier=Number(options.touchMultiplier);}if(options.pullToRefresh!==undefined){settingsRef.current.pullToRefresh=Boolean(options.pullToRefresh);}/*
             * Restart with the new values.
             */startLenis();};/*
         * -----------------------------------------------------
         * WAIT FOR DOCUMENT
         * -----------------------------------------------------
         */if(document.readyState==="complete"){loadTimeout=window.setTimeout(loadLenis,300);}else{window.addEventListener("load",loadLenis,{once:true});}/*
         * -----------------------------------------------------
         * CLEANUP
         * -----------------------------------------------------
         */return()=>{mounted=false;topLockActive=false;if(loadTimeout!==null){window.clearTimeout(loadTimeout);}window.removeEventListener("load",loadLenis);window.removeEventListener("beforeunload",markReload);window.removeEventListener("pageshow",handlePageShow);destroyLenis();delete window.lenis;delete window.updateLenis;delete window.__LENIS_RELOAD__;/*
             * Restore browser default behavior.
             */if("scrollRestoration"in history){history.scrollRestoration="auto";}};},[]);/*
     * Invisible Framer component.
     */return /*#__PURE__*/_jsx("div",{style:{width:"1px",height:"1px",position:"absolute",left:0,top:0,pointerEvents:"none",opacity:0}});}/*
 * ---------------------------------------------------------
 * FRAMER COMPONENT NAME
 * ---------------------------------------------------------
 */LenisSmoothScroll.displayName="Lenis Smooth Scroll";/*
 * ---------------------------------------------------------
 * FRAMER PROPERTY CONTROLS
 * ---------------------------------------------------------
 */addPropertyControls(LenisSmoothScroll,{duration:{type:ControlType.Number,title:"Duration",min:.1,max:3,step:.1,defaultValue:1.2,displayStepper:true},intensity:{type:ControlType.Number,title:"Intensity",min:0,max:2,step:.1,defaultValue:.5,displayStepper:true},scrollSpeed:{type:ControlType.Number,title:"Scroll Speed",min:.1,max:3,step:.1,defaultValue:1,displayStepper:true},touchSmooth:{type:ControlType.Boolean,title:"Touch Smooth",defaultValue:true,enabledTitle:"On",disabledTitle:"Off"},touchMultiplier:{type:ControlType.Number,title:"Touch Speed",min:.5,max:3,step:.1,defaultValue:1.2,displayStepper:true},pullToRefresh:{type:ControlType.Boolean,title:"Pull To Refresh",defaultValue:true,enabledTitle:"On",disabledTitle:"Off"}});
export const __FramerMetadata__ = {"exports":{"default":{"type":"reactComponent","name":"LenisSmoothScroll","slots":[],"annotations":{"framerContractVersion":"1"}},"__FramerMetadata__":{"type":"variable"}}}
//# sourceMappingURL=./Smooth_Scroll_New.map