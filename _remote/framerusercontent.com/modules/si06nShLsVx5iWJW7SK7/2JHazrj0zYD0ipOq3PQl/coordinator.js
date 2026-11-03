// @ts-nocheck
// #region 19. WEBGL COORDINATOR
// @api WebGLCoordinator.budget
export const _webglCoordinator=(()=>{const instances=new Map;const _sortScratch=[];let nextId=1;let scheduled=false;function _detectBudget(){if(typeof navigator==="undefined")return 4;const ua=navigator.userAgent||"";const isIOS=/iP(hone|ad|od)/.test(ua)||/Mac/.test(ua)&&navigator.maxTouchPoints>1;const isSafari=/^((?!chrome|android|crios|fxios).)*safari/i.test(ua);const mem=navigator.deviceMemory||4;if(isIOS)return mem<=3?2:3;if(isSafari)return mem<=4?3:4;return mem<=4?4:6;}const _deviceBudget=_detectBudget();// Read the Root-coordinator-supplied budget override from the shared bridge.
// Root sets bridge.contextBudget when mounted. Falls back to device auto-detect.
function _effectiveBudget(){if(typeof window==="undefined")return _deviceBudget;const bridge=window["__IMPORT_3D_CANVAS_BRIDGE__"];const override=bridge?.contextBudget;return typeof override==="number"&&override>0?override:_deviceBudget;}function _destroyPolicy(){if(typeof window==="undefined"){return{enabled:false,ttlMs:_DESTROY_TTL_MS};}const bridge=window["__IMPORT_3D_CANVAS_BRIDGE__"];return{enabled:!!bridge?.destroyOffscreen,ttlMs:Math.max(1e3,Number(bridge?.destroyAfterMs)||_DESTROY_TTL_MS)};}// Hard context limit before we start flagging slots for context destruction.
// Destroying + recreating is expensive, so we only do it beyond this threshold.
// Safari hard limit ≈ 16 (spec); we stay well under.
function _contextLimit(){return Math.min((_effectiveBudget()+2)*2,8);}// Seconds a slot must be completely off-screen before its context is destroyed.
// Destruction frees GPU memory and lowers context count.
// Re-creation is fast because parsed geometry stays in _modelCache.
const _DESTROY_TTL_MS=2e4// 20 s
;function _cmpRatio(a,b){return(b.ratio||0)-(a.ratio||0);}function _reevaluate(){scheduled=false;_sortScratch.length=0;for(const inst of instances.values())_sortScratch.push(inst);_sortScratch.sort(_cmpRatio);const n=_sortScratch.length;const budget=_effectiveBudget();const limit=_contextLimit();const now=performance.now();const destroyPolicy=_destroyPolicy();for(let i=0;i<n;i++){const inst=_sortScratch[i];const visible=(inst.ratio||0)>0;const shouldPause=i>=budget||!visible;if(inst.st){inst.st._coordinatorPaused=shouldPause;// Track continuous off-screen time for context destruction.
if(!visible){if(!inst.st._coordOffscreenSince){inst.st._coordOffscreenSince=now;}if(inst.st._hasSubSceneItems){inst.st._coordinatorShouldDestroy=false;continue;}if(!destroyPolicy.enabled){inst.st._coordinatorShouldDestroy=false;}else{// Signal context destruction only when:
//   1. slot has been off-screen long enough
//   2. total registered instances exceed the hard limit
const offMs=now-inst.st._coordOffscreenSince;inst.st._coordinatorShouldDestroy=n>limit&&offMs>destroyPolicy.ttlMs;}}else{inst.st._coordOffscreenSince=0;inst.st._coordinatorShouldDestroy=false;}}}_sortScratch.length=0;}function _scheduleReeval(){if(scheduled)return;scheduled=true;if(typeof queueMicrotask!=="undefined")queueMicrotask(_reevaluate);else Promise.resolve().then(_reevaluate);}return{register(st){const id=nextId++;instances.set(id,{id,ratio:1,st});_scheduleReeval();return id;},unregister(id){if(id<=0)return;instances.delete(id);_scheduleReeval();},notify(id,ratio){const inst=instances.get(id);if(!inst)return;if(inst.ratio===ratio)return;inst.ratio=ratio;_scheduleReeval();},// Force an immediate re-evaluation (called when bridge budget changes).
forceReeval(){_scheduleReeval();},size(){return instances.size;},getBudget(){return _effectiveBudget();},// DPR multiplier: scales render resolution down as more canvases mount,
// so total pixel-shaded area stays roughly constant across the page.
getDprMultiplier(){const total=instances.size;if(total<=1)return 1;if(total===2)return .92;if(total===3)return .82;return .72;},// Sync helper for performanceLazyWebgl / performancePauseOffscreen:
// when more than one canvas is mounted, treat per-instance gates as
// "force-enabled" regardless of the user's configuration.
shouldForcePerfGates(){return instances.size>1;}};})()// #endregion
;
export const __FramerMetadata__ = {"exports":{"_webglCoordinator":{"type":"variable","annotations":{"framerContractVersion":"1"}},"__FramerMetadata__":{"type":"variable"}}}
//# sourceMappingURL=./coordinator.map