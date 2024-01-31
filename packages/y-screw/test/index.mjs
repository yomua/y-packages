import*as crypto from"crypto";function getType(e){return Object.prototype.toString.call(e).replace(/\[?\]?/g,"").replace("object ","").replace(/\w/,(e=>e.toLowerCase()))}function isNil(e){return"null"===getType(e)||"undefined"===getType(e)}function isType(e,t){return getType(e)===t}var index$5=(e,t)=>{let n;return function(...i){n||(n=setTimeout((()=>{"function"==typeof e&&e.apply(this,i),n=null}),t))}};let preventRefreshItselfTimer;var index$4=(e,t,n)=>{const{isRefreshItself:i=!1}=null!=n?n:{};let r;return i?function(...n){preventRefreshItselfTimer&&clearTimeout(preventRefreshItselfTimer),preventRefreshItselfTimer=setTimeout((()=>{"function"==typeof e&&e.apply(e,n)}),t)}:function(...n){r&&clearTimeout(r),r=setTimeout((()=>{"function"==typeof e&&e.apply(e,n)}),t)}};function hashString(e){const t=crypto.createHash("sha256");return t.update(e),t.digest("hex")}const cache=new Map;function memoizeFn(e,t){if("function"!=typeof e)throw new Error("memoizeFn expects got a function");const{resolver:n,context:i}=null!=t?t:{};if(i&&!(i instanceof Map))throw new Error("context must be a Map Instance");e.cache=null!=i?i:cache;const r=n||hashString(e.toString());return e.cache.has(r)||e.cache.set(r,e),e.cache.get(r)}function index$3(e,t){const{go:n=!1,state:i=null}=null!=t?t:{};if(window.history.replaceState(null,"",e),n){const e=new PopStateEvent("popstate",{state:i});window.dispatchEvent(e)}}function limiter(e){const t=[];let n=0;function i(r){const o=null==r?void 0:r.taskFn().then((r=>(n>0&&n--,function(){if(n<e){const e=t.shift();e&&i(e)}}(),r)));Promise.resolve(o).then(null==r?void 0:r.resolve,null==r?void 0:r.reject)}return r=>n>=e?function(e){return new Promise(((n,i)=>{t.push({taskFn:e,resolve:n,reject:i})}))}(r):(n++,new Promise(((e,t)=>{i({taskFn:r,resolve:e,reject:t})})))}function index$2(e=""){let t="",n="",i="";return{add(t){let r=`${e}`.split(".")[0],o=`${t}`.split(".")[0],s=`${e}`.split(".")[1],l=`${t}`.split(".")[1];r.length<o.length?r=r.padStart(o.length,"0"):o=o.padStart(r.length,"0"),s||(s=""),l||(l=""),s.length<l.length?s=s.padStart(l.length,"0"):l=l.padStart(s.length,"0");for(let e=r.length-1;e>=0;e--){const t=r[e],i=o[e];n=`${+t+ +i}${n}`}for(let e=s.length-1;e>=0;e--){const t=s[e],n=l[e];i=`${+t+ +n}${i}`}return this},get:()=>(t=i?`${n}.${i}`:n,t||e)}}function index$1(e,t){const{maxAge:n}=t||{};let i=isNil(n)?NaN:Date.now()+1e3*n;const r=(...t)=>{const o=Date.now(),s=t[0];if((0===n||!isNil(n)&&o>i)&&(r.cache.delete(s),i=o+1e3*n),r.cache.has(s))return r.cache.get(s);const l=e.apply(this,t);return r.cache=r.cache.set(s,l),l};return r.cache=new Map,r}var index=e=>{let t=!0;return t=0===Object.keys(e).length,Object.getOwnPropertySymbols(e).length>0&&(t=!1),t};function isPrimitive(e){return"object"!=typeof e&&null!==e}function toJSON(e){if(isType(e,"array"))return JSON.stringify(e.map((e=>{let t=!1;return isPrimitive(e)||(t=!0),t?JSON.parse(toJSON(e)):toJSON(e)})));if(isType(e,"object")){let t="{";const n=Reflect.ownKeys(e);return n.forEach(((i,r)=>{var o;const s=null!==(o=e[i])&&void 0!==o?o:null;let l=r===n.length-1?"":",";const c=isPrimitive(s)?JSON.stringify(s):toJSON(s);t+=JSON.stringify(String(i))+`:${c}${l}`,r===n.length-1&&(t+="}")})),t}return isType(e,"function")||isType(e,"symbol")?null==e?void 0:e.toString():isPrimitive(e)||isType(e,"null")||isType(e,"undefined")?null!=e?e:null:JSON.stringify(e)}export{index$2 as addBigNumbers,index$4 as debounce,getType,index as isEmptyObject,isNil,isType,limiter as limitPromise,memoizeFn,index$1 as memoizeFnValue,index$5 as throttle,toJSON,index$3 as urlChange};
