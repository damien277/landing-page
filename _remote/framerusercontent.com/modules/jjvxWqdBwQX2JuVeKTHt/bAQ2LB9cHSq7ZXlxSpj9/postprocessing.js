// @ts-nocheck
// #region 15. SHADER PASSES
function _define_property(obj,key,value){if(key in obj){Object.defineProperty(obj,key,{value:value,enumerable:true,configurable:true,writable:true});}else{obj[key]=value;}return obj;}import{THREE,React}from"../../lDlihTzuNidcfpI2z42X/8kQwXucX9auVs1n7lCpb/deps.js";import{TONE_MAPPINGS}from"../../FDHIOMci1EhV6YK9dEv1/T8XZzoRv9RZVnrnxvznF/constants.js";export const useBrowserLayoutEffect=typeof window!=="undefined"?React.useLayoutEffect:React.useEffect;// Shared 3D Noise GLSL (Perlin-like)
export const NOISE_GLSL=`
    vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
    vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

    float snoise(vec3 v) {
        const vec2 C = vec2(1.0/6.0, 1.0/3.0);
        const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
        vec3 i  = floor(v + dot(v, C.yyy));
        vec3 x0 = v - i + dot(i, C.xxx);
        vec3 g = step(x0.yzx, x0.xyz);
        vec3 l = 1.0 - g;
        vec3 i1 = min(g.xyz, l.zxy);
        vec3 i2 = max(g.xyz, l.zxy);
        vec3 x1 = x0 - i1 + C.xxx;
        vec3 x2 = x0 - i2 + C.yyy;
        vec3 x3 = x0 - D.yyy;
        i = mod289(i);
        vec4 p = permute(permute(permute(
            i.z + vec4(0.0, i1.z, i2.z, 1.0))
            + i.y + vec4(0.0, i1.y, i2.y, 1.0))
            + i.x + vec4(0.0, i1.x, i2.x, 1.0));
        float n_ = 0.142857142857;
        vec3 ns = n_ * D.wyz - D.xzx;
        vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
        vec4 x_ = floor(j * ns.z);
        vec4 y_ = floor(j - 7.0 * x_);
        vec4 x = x_ *ns.x + ns.yyyy;
        vec4 y = y_ *ns.x + ns.yyyy;
        vec4 h = 1.0 - abs(x) - abs(y);
        vec4 b0 = vec4(x.xy, y.xy);
        vec4 b1 = vec4(x.zw, y.zw);
        vec4 s0 = floor(b0)*2.0 + 1.0;
        vec4 s1 = floor(b1)*2.0 + 1.0;
        vec4 sh = -step(h, vec4(0.0));
        vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
        vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
        vec3 p0 = vec3(a0.xy, h.x);
        vec3 p1 = vec3(a0.zw, h.y);
        vec3 p2 = vec3(a1.xy, h.z);
        vec3 p3 = vec3(a1.zw, h.w);
        vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
        p0 *= norm.x;
        p1 *= norm.y;
        p2 *= norm.z;
        p3 *= norm.w;
        vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
        m = m * m;
        return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
    }
`;/* ═══════════════════════════════════════════════════════════
   Custom Post-Processing Shaders
   ═══════════════════════════════════════════════════════════ */export const VignetteShader={uniforms:{tDiffuse:{value:null},offset:{value:1},darkness:{value:1}},vertexShader:`varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}`,fragmentShader:`
        uniform sampler2D tDiffuse;
        uniform float offset;
        uniform float darkness;
        varying vec2 vUv;
        void main(){
            vec4 texel=texture2D(tDiffuse,vUv);
            vec2 uv=(vUv-vec2(0.5))*vec2(offset);
            float vig=clamp(1.0-dot(uv,uv),0.0,1.0);
            texel.rgb*=mix(1.0,pow(vig,0.5),darkness);
            gl_FragColor=texel;
        }`};export const ChromaticAberrationShader={uniforms:{tDiffuse:{value:null},strength:{value:.005},resolution:{value:new THREE.Vector2(1,1)}},vertexShader:`varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}`,fragmentShader:`
        uniform sampler2D tDiffuse;
        uniform float strength;
        uniform vec2 resolution;
        varying vec2 vUv;
        void main(){
            vec2 dir=vUv-vec2(0.5);
            float d=length(dir);
            float s=strength*d*d;
            vec2 offset=dir*s;
            float r=texture2D(tDiffuse,vUv+offset).r;
            float g=texture2D(tDiffuse,vUv).g;
            float b=texture2D(tDiffuse,vUv-offset).b;
            float a=texture2D(tDiffuse,vUv).a;
            gl_FragColor=vec4(r,g,b,a);
        }`};export const FilmGrainShader={uniforms:{tDiffuse:{value:null},time:{value:0},intensity:{value:.05}},vertexShader:`varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}`,fragmentShader:`
        uniform sampler2D tDiffuse;
        uniform float time;
        uniform float intensity;
        varying vec2 vUv;
        float rand(vec2 co){return fract(sin(dot(co,vec2(12.9898,78.233)))*43758.5453);}
        void main(){
            vec4 texel=texture2D(tDiffuse,vUv);
            float noise=rand(vUv+vec2(time*0.01,time*0.007))*2.0-1.0;
            texel.rgb+=noise*intensity;
            gl_FragColor=texel;
        }`};/**
 * AlphaRestoreShader — restores original alpha from a saved render target.
 * UnrealBloomPass destroys alpha (writes 1.0 everywhere via AdditiveBlending).
 * This pass takes RGB from the post-processed chain but alpha from the pre-bloom render.
 */export const AlphaRestoreShader={uniforms:{tDiffuse:{value:null},tAlpha:{value:null}},vertexShader:`varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}`,fragmentShader:`
        uniform sampler2D tDiffuse;
        uniform sampler2D tAlpha;
        varying vec2 vUv;
        void main(){
            vec4 color=texture2D(tDiffuse,vUv);
            float alpha=texture2D(tAlpha,vUv).a;
            gl_FragColor=vec4(color.rgb*alpha, alpha);
        }`};/**
 * AlphaSavePass — copies current readBuffer to a side render target (alphaRT)
 * to preserve alpha before bloom destroys it. Passes through unchanged.
 */export class AlphaSavePass{setSize(w,h){this.targetRT.setSize(w,h);}render(renderer,writeBuffer,readBuffer){if(!this.enabled)return;this._copyMat.uniforms.tDiffuse.value=readBuffer.texture;const oldRT=renderer.getRenderTarget();renderer.setRenderTarget(this.targetRT);renderer.clear();renderer.render(this._scene,this._cam);renderer.setRenderTarget(oldRT);}dispose(){this._copyMat.dispose();this._fsQuad.geometry.dispose();this.targetRT.dispose();}constructor(targetRT){_define_property(this,"enabled",true);_define_property(this,"needsSwap",false);_define_property(this,"renderToScreen",false);_define_property(this,"clear",false);_define_property(this,"targetRT",void 0);_define_property(this,"_copyMat",void 0);_define_property(this,"_fsQuad",void 0);_define_property(this,"_scene",void 0);_define_property(this,"_cam",void 0);this.targetRT=targetRT;this._copyMat=new THREE.ShaderMaterial({uniforms:{tDiffuse:{value:null}},vertexShader:`varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}`,fragmentShader:`uniform sampler2D tDiffuse;varying vec2 vUv;void main(){gl_FragColor=texture2D(tDiffuse,vUv);}`,depthTest:false,depthWrite:false});const geo=new THREE.PlaneGeometry(2,2);this._fsQuad=new THREE.Mesh(geo,this._copyMat);this._fsQuad.frustumCulled=false;this._scene=new THREE.Scene;this._scene.add(this._fsQuad);this._cam=new THREE.OrthographicCamera(-1,1,1,-1,0,1);}}export const ColorGradingShader={uniforms:{tDiffuse:{value:null},brightness:{value:0},contrast:{value:1},saturation:{value:1}},vertexShader:`varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}`,fragmentShader:`
        uniform sampler2D tDiffuse;
        uniform float brightness;
        uniform float contrast;
        uniform float saturation;
        varying vec2 vUv;
        void main(){
            vec4 texel=texture2D(tDiffuse,vUv);
            texel.rgb+=brightness;
            texel.rgb=((texel.rgb-0.5)*contrast)+0.5;
            float lum=dot(texel.rgb,vec3(0.2126,0.7152,0.0722));
            texel.rgb=mix(vec3(lum),texel.rgb,saturation);
            gl_FragColor=vec4(max(texel.rgb,0.0),texel.a);
        }`};/**
 * Apply effects/post-processing changes.
 */export function applyEffectsChanges(st,cfg){const{_bloom:bloom,_ssao:ssao,_colorGrading:colorGrading,_vignette:vignette,_chromaticAberration:chromaticAberration,_filmGrain:filmGrain,_fxaa:fxaa}=st;// Tone mapping
st._renderer.toneMapping=TONE_MAPPINGS[cfg.toneMapping]||THREE.ACESFilmicToneMapping;st._renderer.toneMappingExposure=cfg.exposure;// Bloom
if(bloom)bloom.enabled=cfg.bloomEnabled;if(bloom&&cfg.bloomEnabled){bloom.strength=cfg.bloomStrength;bloom.threshold=cfg.bloomThreshold;bloom.radius=cfg.bloomRadius;}// SSAO
if(ssao){ssao.enabled=cfg.enableSSAO;if(cfg.enableSSAO){ssao.kernelRadius=cfg.ssaoRadius;ssao.minDistance=cfg.ssaoMinDistance;ssao.maxDistance=cfg.ssaoMaxDistance;}}// DOF (Depth of Field) — disabled for orthographic camera
const dof=st._dof;if(dof){dof.enabled=cfg.enableDOF&&cfg.cameraType!=="orthographic";if(cfg.enableDOF){dof.uniforms["focus"].value=cfg.dofFocus;dof.uniforms["aperture"].value=cfg.dofAperture;dof.uniforms["maxblur"].value=cfg.dofMaxBlur;}}// Alpha save/restore: needed when bloom + transparent background
const needAlphaFix=(cfg.bloomEnabled||cfg.enableDOF)&&cfg.transparentBackground;if(st._alphaSave)st._alphaSave.enabled=needAlphaFix;if(st._alphaRestore)st._alphaRestore.enabled=needAlphaFix;// Color grading
if(colorGrading)colorGrading.enabled=cfg.enableColorGrading;if(colorGrading&&cfg.enableColorGrading){colorGrading.uniforms.brightness.value=cfg.brightness;colorGrading.uniforms.contrast.value=cfg.contrast;colorGrading.uniforms.saturation.value=cfg.saturation;}// Vignette
if(vignette)vignette.enabled=cfg.enableVignette;if(vignette&&cfg.enableVignette){vignette.uniforms.offset.value=cfg.vignetteOffset;vignette.uniforms.darkness.value=cfg.vignetteDarkness;}// Chromatic aberration
if(chromaticAberration)chromaticAberration.enabled=cfg.enableChromaticAberration;if(chromaticAberration&&cfg.enableChromaticAberration){chromaticAberration.uniforms.strength.value=cfg.chromaticAberrationStrength;}// Film grain
if(filmGrain)filmGrain.enabled=cfg.enableFilmGrain;if(filmGrain&&cfg.enableFilmGrain){filmGrain.uniforms.intensity.value=cfg.filmGrainIntensity;}// FXAA
if(fxaa)fxaa.enabled=cfg.enableFXAA;}// #endregion

export const __FramerMetadata__ = {"exports":{"ChromaticAberrationShader":{"type":"variable","annotations":{"framerContractVersion":"1"}},"applyEffectsChanges":{"type":"function","annotations":{"framerContractVersion":"1"}},"useBrowserLayoutEffect":{"type":"variable","annotations":{"framerContractVersion":"1"}},"FilmGrainShader":{"type":"variable","annotations":{"framerContractVersion":"1"}},"AlphaSavePass":{"type":"class","annotations":{"framerContractVersion":"1"}},"AlphaRestoreShader":{"type":"variable","annotations":{"framerContractVersion":"1"}},"VignetteShader":{"type":"variable","annotations":{"framerContractVersion":"1"}},"ColorGradingShader":{"type":"variable","annotations":{"framerContractVersion":"1"}},"NOISE_GLSL":{"type":"variable","annotations":{"framerContractVersion":"1"}},"__FramerMetadata__":{"type":"variable"}}}