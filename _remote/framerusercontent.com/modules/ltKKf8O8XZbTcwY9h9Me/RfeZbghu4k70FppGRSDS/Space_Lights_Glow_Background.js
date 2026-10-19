// ============================================================================
//  Lightyear — Interactive Light Glow Background
// ----------------------------------------------------------------------------
//  WebGL + GLSL. Directional light beams rise from the bottom; beam positions
//  are fixed and the animation is a vertical brightness sweep. The beam under
//  the cursor brightens and climbs. Static seam-free film grain on top.
//
//  Static contexts (Framer canvas / export): animations and continuous
//  effects are disabled via useIsStaticRenderer(). The component renders
//  exactly ONE shader frame as a static preview image — no loop, no timers,
//  no event listeners — so the editor preview matches the live result and
//  updates with property changes.
//
//  Performance notes:
//  • Zero trig in the shader — precision-safe hash12 only
//  • Opaque, non-antialiased context (cheapest compositing path)
//  • Colors parsed once per prop change, never per frame
//  • Rendering pauses when off-viewport or when the tab is hidden
// ============================================================================
import{jsx as _jsx}from"react/jsx-runtime";import{addPropertyControls,ControlType,useIsStaticRenderer}from"framer";import*as React from"react";// ----------------------------------------------------------------------------
// Shaders
// ----------------------------------------------------------------------------
const VERTEX_SHADER=/* glsl */`
attribute vec2 a_position;
varying vec2 v_uv;

void main() {
    v_uv = a_position * 0.5 + 0.5;
    gl_Position = vec4(a_position, 0.0, 1.0);
}
`;const FRAGMENT_SHADER=/* glsl */`
precision highp float;

uniform vec2  u_resolution;
uniform float u_time;
uniform vec2  u_mouse;
uniform float u_glow;
uniform float u_scale;
uniform float u_grain;
uniform vec3  u_colorCore;
uniform vec3  u_colorGlow;
uniform vec3  u_colorBg;

varying vec2 v_uv;

// Precision-safe hash — seam-free noise at any canvas size, no trig.
float hash12(vec2 p) {
    vec3 p3 = fract(vec3(p.xyx) * 0.1031);
    p3 += dot(p3, p3.yzx + 33.33);
    return fract((p3.x + p3.y) * p3.z);
}

float vnoise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    float a = hash12(i);
    float b = hash12(i + vec2(1.0, 0.0));
    float c = hash12(i + vec2(0.0, 1.0));
    float d = hash12(i + vec2(1.0, 1.0));
    return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

float fbm(vec2 p) {
    float v = 0.60 * vnoise(p);
    v += 0.30 * vnoise(p * 2.02 + vec2(31.4, 17.7));
    v += 0.15 * vnoise(p * 4.04 + vec2(11.9, 7.3));
    return v * 1.07;
}

void main() {
    vec2 uv = v_uv; // y = 0 at the bottom edge
    float aspect = u_resolution.x / max(u_resolution.y, 1.0);
    float t = u_time;
    float scale = max(u_scale, 3.0);
    float x = (uv.x - 0.5) * aspect;

    // 1. Column field — fixed in X, evolves vertically over time.
    //    Minimal sway keeps beams essentially straight (directional look).
    float sway = (vnoise(vec2(x * 0.7 + t * 0.07, uv.y * 1.2 - t * 0.22)) - 0.5)
               * 0.05 * (0.4 + uv.y);
    float xs = x * (1.0 + uv.y * 0.04);

    float columns = fbm(vec2(xs * scale + sway * scale, t * 0.18));

    // 2. Shape into rays: wide, softly-edged, few gaps.
    float ray = pow(smoothstep(0.36, 0.72, columns), 1.1);
    float streaks = vnoise(vec2(xs * scale * 3.0 + 7.0, t * 0.19));
    ray *= 0.85 + 0.20 * streaks;

    // 3. Vertical envelopes. riseCursor is ray-independent so the pointer
    //    beam climbs high even inside dark gaps.
    float glow = max(u_glow, 0.05);
    float rise = pow(clamp(1.0 - uv.y, 0.0, 1.0),
                     (1.5 + (1.0 - min(ray, 1.0)) * 0.6) / glow);
    float riseCursor = pow(clamp(1.0 - uv.y, 0.0, 1.0), 1.1 / glow);

    // 4. Light accumulation.
    float light = ray * rise * (0.55 + 0.45 * glow)
                + rise * rise * 0.30 * glow;

    float dx = (uv.x - u_mouse.x) * aspect;
    float cursor = exp(-dx * dx * 8.0);
    light += cursor * riseCursor * (0.80 + 0.20 * ray) * 1.05 * glow;

    // 5. Color: background -> glow -> white-hot bases.
    vec3 col = u_colorBg;
    col = mix(col, u_colorGlow, clamp(light, 0.0, 1.0));

    float white = pow(rise, 5.0) * (0.50 + 0.40 * ray) * glow
                + cursor * pow(riseCursor, 3.0) * (0.70 + 0.30 * ray) * 0.9 * glow;
    col = mix(col, u_colorCore, clamp(smoothstep(0.30, 0.90, white), 0.0, 1.0));

    // 6. Static film grain.
    col += (hash12(gl_FragCoord.xy) - 0.5) * u_grain;

    gl_FragColor = vec4(clamp(col, 0.0, 1.0), 1.0);
}
`;// Fixed timestamp for the static preview frame (canvas / export).
const STATIC_PREVIEW_TIME=1.5;function parseColor(color,fallback){if(!color)return fallback;const value=color.trim().toLowerCase();if(value[0]==="#"){let hex=value.slice(1);if(hex.length===3)hex=hex.replace(/./g,"$&$&");if(hex.length===8)hex=hex.slice(0,6);const num=parseInt(hex,16);if(!Number.isNaN(num)){return[(num>>16&255)/255,(num>>8&255)/255,(num&255)/255];}}const match=value.match(/rgba?\(([^)]+)\)/);if(match){const parts=match[1].split(",").map(parseFloat);if(parts.length>=3&&parts.slice(0,3).every(Number.isFinite)){return[parts[0]/255,parts[1]/255,parts[2]/255];}}return fallback;}const DEFAULT_COLORS={core:[1,1,1],glow:[.357,.129,1],bg:[0,0,0]};export default function Lightyear(props){// True on the Framer canvas and during static exports.
const isStatic=useIsStaticRenderer();const containerRef=React.useRef(null);const canvasRef=React.useRef(null);const propsRef=React.useRef(props);const colorsRef=React.useRef(DEFAULT_COLORS);const renderRef=React.useRef(null);const[glFailed,setGlFailed]=React.useState(false);const[contextEpoch,setContextEpoch]=React.useState(0);// Visual props that affect the single preview frame on the canvas.
const previewKey=`${props.color1}|${props.color2}|${props.color3}|${props.glowIntensity}|${props.waveDensity}|${props.grainIntensity}`;// Cache latest props + parsed colors. Runs on every render; the render
// loop reads these refs, so WebGL is never re-initialised for prop changes.
React.useEffect(()=>{propsRef.current=props;colorsRef.current={core:parseColor(props.color1,DEFAULT_COLORS.core),glow:parseColor(props.color2,DEFAULT_COLORS.glow),bg:parseColor(props.color3,DEFAULT_COLORS.bg)};});React.useEffect(()=>{const container=containerRef.current;const canvas=canvasRef.current;if(!container||!canvas)return;const cleanups=[];const addCleanup=fn=>cleanups.push(fn);let gl=null;let program=null;try{gl=canvas.getContext("webgl",{alpha:false,depth:false,stencil:false,antialias:false})??canvas.getContext("experimental-webgl");if(!gl)throw new Error("WebGL unavailable");// --- Program setup ---------------------------------------------------
const compile=(type,source)=>{const shader=gl.createShader(type);gl.shaderSource(shader,source);gl.compileShader(shader);if(!gl.getShaderParameter(shader,gl.COMPILE_STATUS)){throw new Error("Shader: "+gl.getShaderInfoLog(shader));}return shader;};const vert=compile(gl.VERTEX_SHADER,VERTEX_SHADER);const frag=compile(gl.FRAGMENT_SHADER,FRAGMENT_SHADER);program=gl.createProgram();gl.attachShader(program,vert);gl.attachShader(program,frag);gl.linkProgram(program);if(!gl.getProgramParameter(program,gl.LINK_STATUS)){throw new Error("Link: "+gl.getProgramInfoLog(program));}gl.useProgram(program);gl.bindBuffer(gl.ARRAY_BUFFER,gl.createBuffer());gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,1,1]),gl.STATIC_DRAW);const aPosition=gl.getAttribLocation(program,"a_position");gl.enableVertexAttribArray(aPosition);gl.vertexAttribPointer(aPosition,2,gl.FLOAT,false,0,0);const uniform=name=>gl.getUniformLocation(program,name);const uniforms={resolution:uniform("u_resolution"),time:uniform("u_time"),mouse:uniform("u_mouse"),glow:uniform("u_glow"),scale:uniform("u_scale"),grain:uniform("u_grain"),core:uniform("u_colorCore"),glowColor:uniform("u_colorGlow"),bg:uniform("u_colorBg")};// --- Resize (DPI-aware, capped at 2x) ---------------------------------
const resize=()=>{const rect=container.getBoundingClientRect();const dpr=Math.min(window.devicePixelRatio||1,2);const w=Math.max(1,Math.round(rect.width*dpr));const h=Math.max(1,Math.round(rect.height*dpr));if(canvas.width!==w||canvas.height!==h){canvas.width=w;canvas.height=h;}};resize();// --- Frame renderer ----------------------------------------------------
let raf=0;let running=false;let inView=true;let lastFrame=0;let animTime=0;const renderFrame=now=>{if(!gl||!canvas)return;const dt=Math.min((now-lastFrame)/1e3,1/15);lastFrame=now;if(!isStatic){animTime+=dt*Math.max(propsRef.current.animationSpeed??1,0);}// Frame-rate-independent mouse damping (live mode only; in
// static mode target === current, so this is a no-op).
const sens=Math.min(Math.max(propsRef.current.mouseSensitivity??.1,.001),1);const k=1-Math.pow(1-sens,dt*60);current.x+=(target.x-current.x)*k;current.y+=(target.y-current.y)*k;const c=colorsRef.current;gl.viewport(0,0,canvas.width,canvas.height);gl.uniform2f(uniforms.resolution,canvas.width,canvas.height);// Live: accumulated clock. Static preview: fixed timestamp,
// so the preview image is deterministic for a given state.
gl.uniform1f(uniforms.time,isStatic?STATIC_PREVIEW_TIME:animTime);gl.uniform2f(uniforms.mouse,current.x,current.y);gl.uniform1f(uniforms.glow,propsRef.current.glowIntensity??1);gl.uniform1f(uniforms.scale,propsRef.current.waveDensity??6);gl.uniform1f(uniforms.grain,propsRef.current.grainIntensity??.08);gl.uniform3f(uniforms.core,c.core[0],c.core[1],c.core[2]);gl.uniform3f(uniforms.glowColor,c.glow[0],c.glow[1],c.glow[2]);gl.uniform3f(uniforms.bg,c.bg[0],c.bg[1],c.bg[2]);gl.clearColor(c.bg[0],c.bg[1],c.bg[2],1);gl.clear(gl.COLOR_BUFFER_BIT);gl.drawArrays(gl.TRIANGLE_STRIP,0,4);};// Pointer state (live mode only).
const target={x:.5,y:1};const current={x:.5,y:1};if(isStatic){// ================================================================
// STATIC CONTEXT (Framer canvas / export)
// Render exactly ONE frame as the preview image. No animation
// loop, no timers, no event listeners — fully compliant with
// the static-renderer requirement. A ResizeObserver redraws
// the single frame if the frame is resized on the canvas.
// ================================================================
renderRef.current=now=>{lastFrame=now;renderFrame(now);};renderRef.current(performance.now());const ro=new ResizeObserver(()=>{resize();renderRef.current?.(performance.now());});ro.observe(container);addCleanup(()=>ro.disconnect());}else{// ================================================================
// LIVE CONTEXT (Preview / published site)
// ================================================================
// Pointer tracking (window-level, overlay-proof).
const onPointerMove=e=>{const rect=container.getBoundingClientRect();if(!rect.width||!rect.height)return;if(e.clientX<rect.left||e.clientX>rect.right||e.clientY<rect.top||e.clientY>rect.bottom)return;target.x=(e.clientX-rect.left)/rect.width;target.y=1-(e.clientY-rect.top)/rect.height;};window.addEventListener("pointermove",onPointerMove,{passive:true});addCleanup(()=>window.removeEventListener("pointermove",onPointerMove));const onWindowResize=()=>resize();window.addEventListener("resize",onWindowResize);addCleanup(()=>window.removeEventListener("resize",onWindowResize));const ro=new ResizeObserver(resize);ro.observe(container);addCleanup(()=>ro.disconnect());// Render loop, paused when off-viewport or tab hidden.
const loop=now=>{renderFrame(now);raf=requestAnimationFrame(loop);};const start=()=>{if(running||!inView||document.hidden)return;running=true;lastFrame=performance.now();raf=requestAnimationFrame(loop);};const stop=()=>{running=false;cancelAnimationFrame(raf);};// First frame, synchronously: the canvas is never blank.
lastFrame=performance.now();renderFrame(lastFrame);start();const io=new IntersectionObserver(entries=>{inView=entries[0]?.isIntersecting??true;inView?start():stop();},{threshold:0});io.observe(container);addCleanup(()=>io.disconnect());const onVisibility=()=>document.hidden?stop():start();document.addEventListener("visibilitychange",onVisibility);addCleanup(()=>document.removeEventListener("visibilitychange",onVisibility));// GPU context loss: stop now, re-init everything when restored.
const onContextLost=e=>{e.preventDefault();stop();};const onContextRestored=()=>setContextEpoch(n=>n+1);canvas.addEventListener("webglcontextlost",onContextLost);canvas.addEventListener("webglcontextrestored",onContextRestored);addCleanup(()=>{canvas.removeEventListener("webglcontextlost",onContextLost);canvas.removeEventListener("webglcontextrestored",onContextRestored);});}}catch(err){console.warn("[Lightyear] WebGL unavailable — using static fallback.",err);setGlFailed(true);}return()=>{renderRef.current=null;cleanups.forEach(fn=>fn());if(gl&&program){gl.getAttachedShaders(program).forEach(s=>gl.deleteShader(s));gl.deleteProgram(program);}};},[isStatic,contextEpoch]);// Static canvas: re-render the single preview frame whenever a visual
// property changes, so the editor preview tracks property edits 1:1.
React.useEffect(()=>{if(!isStatic)return;renderRef.current?.(performance.now());},[isStatic,previewKey]);// Gradient fallback: shown if WebGL is unavailable at runtime, and
// visible behind the canvas until the first frame is painted.
const gradient=`radial-gradient(ellipse 130% 90% at 50% 115%, ${props.color2||"#5B21FF"} 0%, ${props.color3||"#000000"} 70%)`;return /*#__PURE__*/_jsx("div",{ref:containerRef,style:{position:"relative",width:"100%",height:"100%",minWidth:300,minHeight:300,overflow:"hidden",background:gradient},children:/*#__PURE__*/_jsx("canvas",{ref:canvasRef,style:{position:"absolute",inset:0,width:"100%",height:"100%",display:glFailed?"none":"block"}})});}Lightyear.defaultSize={width:300,height:300};addPropertyControls(Lightyear,{color1:{type:ControlType.Color,title:"Core Light",defaultValue:"#FFFFFF"},color2:{type:ControlType.Color,title:"Bloom",defaultValue:"#5B21FF"},color3:{type:ControlType.Color,title:"Background",defaultValue:"#000000"},glowIntensity:{type:ControlType.Number,title:"Glow Intensity",min:.1,max:3,step:.05,defaultValue:1},waveDensity:{type:ControlType.Number,title:"Wave Density",min:1,max:24,step:.5,defaultValue:6},animationSpeed:{type:ControlType.Number,title:"Speed",min:0,max:3,step:.05,defaultValue:1},grainIntensity:{type:ControlType.Number,title:"Grain",min:0,max:1,step:.01,defaultValue:.08},mouseSensitivity:{type:ControlType.Number,title:"Mouse Sensitivity",min:.01,max:1,step:.01,defaultValue:.1}});
export const __FramerMetadata__ = {"exports":{"default":{"type":"reactComponent","name":"Lightyear","slots":[],"annotations":{"framerContractVersion":"1"}},"__FramerMetadata__":{"type":"variable"}}}
//# sourceMappingURL=./Space_Lights_Glow_Background.map