import{t as e}from"./rolldown-runtime.7KfmP6A5.mjs";import{I as t,R as n,_ as r,b as i,o as a,s as o,w as s,y as c}from"./react.CrJwuYTF.mjs";import{E as l,W as u,ft as d,o as f}from"./framer.RofkCH3y.mjs";function p(e,t){if(!e)return t;let n=e.trim().toLowerCase();if(n[0]===`#`){let e=n.slice(1);e.length===3&&(e=e.replace(/./g,`$&$&`)),e.length===8&&(e=e.slice(0,6));let t=parseInt(e,16);if(!Number.isNaN(t))return[(t>>16&255)/255,(t>>8&255)/255,(t&255)/255]}let r=n.match(/rgba?\(([^)]+)\)/);if(r){let e=r[1].split(`,`).map(parseFloat);if(e.length>=3&&e.slice(0,3).every(Number.isFinite))return[e[0]/255,e[1]/255,e[2]/255]}return t}function m(e){let t=d(),o=i(null),s=i(null),l=i(e),u=i(v),f=i(null),[m,y]=r(!1),[b,x]=r(0),S=`${e.color1}|${e.color2}|${e.color3}|${e.glowIntensity}|${e.waveDensity}|${e.grainIntensity}`;c(()=>{l.current=e,u.current={core:p(e.color1,v.core),glow:p(e.color2,v.glow),bg:p(e.color3,v.bg)}}),c(()=>{let e=o.current,r=s.current;if(!e||!r)return;let i=[],a=e=>i.push(e),c=null,d=null;try{if(c=r.getContext(`webgl`,{alpha:!1,depth:!1,stencil:!1,antialias:!1})??r.getContext(`experimental-webgl`),!c)throw Error(`WebGL unavailable`);let i=(e,t)=>{let n=c.createShader(e);if(c.shaderSource(n,t),c.compileShader(n),!c.getShaderParameter(n,c.COMPILE_STATUS))throw Error(`Shader: `+c.getShaderInfoLog(n));return n},o=i(c.VERTEX_SHADER,h),s=i(c.FRAGMENT_SHADER,g);if(d=c.createProgram(),c.attachShader(d,o),c.attachShader(d,s),c.linkProgram(d),!c.getProgramParameter(d,c.LINK_STATUS))throw Error(`Link: `+c.getProgramInfoLog(d));c.useProgram(d),c.bindBuffer(c.ARRAY_BUFFER,c.createBuffer()),c.bufferData(c.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,1,1]),c.STATIC_DRAW);let p=c.getAttribLocation(d,`a_position`);c.enableVertexAttribArray(p),c.vertexAttribPointer(p,2,c.FLOAT,!1,0,0);let m=e=>c.getUniformLocation(d,e),v={resolution:m(`u_resolution`),time:m(`u_time`),mouse:m(`u_mouse`),glow:m(`u_glow`),scale:m(`u_scale`),grain:m(`u_grain`),core:m(`u_colorCore`),glowColor:m(`u_colorGlow`),bg:m(`u_colorBg`)},y=()=>{let t=e.getBoundingClientRect(),i=Math.min(n.devicePixelRatio||1,2),a=Math.max(1,Math.round(t.width*i)),o=Math.max(1,Math.round(t.height*i));(r.width!==a||r.height!==o)&&(r.width=a,r.height=o)};y();let b=0,S=!1,C=!0,w=0,T=0,E=e=>{if(!c||!r)return;let n=Math.min((e-w)/1e3,1/15);w=e,t||(T+=n*Math.max(l.current.animationSpeed??1,0));let i=1-(1-Math.min(Math.max(l.current.mouseSensitivity??.1,.001),1))**(n*60);O.x+=(D.x-O.x)*i,O.y+=(D.y-O.y)*i;let a=u.current;c.viewport(0,0,r.width,r.height),c.uniform2f(v.resolution,r.width,r.height),c.uniform1f(v.time,t?_:T),c.uniform2f(v.mouse,O.x,O.y),c.uniform1f(v.glow,l.current.glowIntensity??1),c.uniform1f(v.scale,l.current.waveDensity??6),c.uniform1f(v.grain,l.current.grainIntensity??.08),c.uniform3f(v.core,a.core[0],a.core[1],a.core[2]),c.uniform3f(v.glowColor,a.glow[0],a.glow[1],a.glow[2]),c.uniform3f(v.bg,a.bg[0],a.bg[1],a.bg[2]),c.clearColor(a.bg[0],a.bg[1],a.bg[2],1),c.clear(c.COLOR_BUFFER_BIT),c.drawArrays(c.TRIANGLE_STRIP,0,4)},D={x:.5,y:1},O={x:.5,y:1};if(t){f.current=e=>{w=e,E(e)},f.current(performance.now());let t=new ResizeObserver(()=>{y(),f.current?.(performance.now())});t.observe(e),a(()=>t.disconnect())}else{let t=t=>{let n=e.getBoundingClientRect();n.width&&n.height&&(t.clientX<n.left||t.clientX>n.right||t.clientY<n.top||t.clientY>n.bottom||(D.x=(t.clientX-n.left)/n.width,D.y=1-(t.clientY-n.top)/n.height))};n.addEventListener(`pointermove`,t,{passive:!0}),a(()=>n.removeEventListener(`pointermove`,t));let i=()=>y();n.addEventListener(`resize`,i),a(()=>n.removeEventListener(`resize`,i));let o=new ResizeObserver(y);o.observe(e),a(()=>o.disconnect());let s=e=>{E(e),b=requestAnimationFrame(s)},c=()=>{S||!C||document.hidden||(S=!0,w=performance.now(),b=requestAnimationFrame(s))},l=()=>{S=!1,cancelAnimationFrame(b)};w=performance.now(),E(w),c();let u=new IntersectionObserver(e=>{C=e[0]?.isIntersecting??!0,C?c():l()},{threshold:0});u.observe(e),a(()=>u.disconnect());let d=()=>document.hidden?l():c();document.addEventListener(`visibilitychange`,d),a(()=>document.removeEventListener(`visibilitychange`,d));let f=e=>{e.preventDefault(),l()},p=()=>x(e=>e+1);r.addEventListener(`webglcontextlost`,f),r.addEventListener(`webglcontextrestored`,p),a(()=>{r.removeEventListener(`webglcontextlost`,f),r.removeEventListener(`webglcontextrestored`,p)})}}catch(e){console.warn(`[Lightyear] WebGL unavailable — using static fallback.`,e),y(!0)}return()=>{f.current=null,i.forEach(e=>e()),c&&d&&(c.getAttachedShaders(d).forEach(e=>c.deleteShader(e)),c.deleteProgram(d))}},[t,b]),c(()=>{t&&f.current?.(performance.now())},[t,S]);let C=`radial-gradient(ellipse 130% 90% at 50% 115%, ${e.color2||`#5B21FF`} 0%, ${e.color3||`#000000`} 70%)`;return/*#__PURE__*/ a(`div`,{ref:o,style:{position:`relative`,width:`100%`,height:`100%`,minWidth:300,minHeight:300,overflow:`hidden`,background:C},children:/*#__PURE__*/ a(`canvas`,{ref:s,style:{position:`absolute`,inset:0,width:`100%`,height:`100%`,display:m?`none`:`block`}})})}var h,g,_,v;function y(){return(y=e((()=>{t(),o(),u(),s(),h=`
attribute vec2 a_position;
varying vec2 v_uv;

void main() {
    v_uv = a_position * 0.5 + 0.5;
    gl_Position = vec4(a_position, 0.0, 1.0);
}
`,g=`
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
`,_=1.5,v={core:[1,1,1],glow:[.357,.129,1],bg:[0,0,0]},m.defaultSize={width:300,height:300},l(m,{color1:{type:f.Color,title:`Core Light`,defaultValue:`#FFFFFF`},color2:{type:f.Color,title:`Bloom`,defaultValue:`#5B21FF`},color3:{type:f.Color,title:`Background`,defaultValue:`#000000`},glowIntensity:{type:f.Number,title:`Glow Intensity`,min:.1,max:3,step:.05,defaultValue:1},waveDensity:{type:f.Number,title:`Wave Density`,min:1,max:24,step:.5,defaultValue:6},animationSpeed:{type:f.Number,title:`Speed`,min:0,max:3,step:.05,defaultValue:1},grainIntensity:{type:f.Number,title:`Grain`,min:0,max:1,step:.01,defaultValue:.08},mouseSensitivity:{type:f.Number,title:`Mouse Sensitivity`,min:.01,max:1,step:.01,defaultValue:.1}})})))()}export{y as n,m as t};
//# sourceMappingURL=./Space_Lights_Glow_Background.D5XWMMTk.mjs.map