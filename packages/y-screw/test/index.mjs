import*as crypto from"crypto";function getType(e){return Object.prototype.toString.call(e).replace(/\[?\]?/g,"").replace("object ","").replace(/\w/,(function(e){return e.toLowerCase()}))}function isNil(e){return"null"===getType(e)||"undefined"===getType(e)}function isType(e,t){return getType(e)===t}var preventRefreshItselfTimer,index$5=function(e,t){var n;return function(){for(var r=this,i=[],o=0;o<arguments.length;o++)i[o]=arguments[o];n||(n=setTimeout((function(){"function"==typeof e&&e.apply(r,i),n=null}),t))}},index$4=function(e,t,n){var r,i=(null!=n?n:{}).isRefreshItself;return void 0!==i&&i?function(){for(var n=[],r=0;r<arguments.length;r++)n[r]=arguments[r];preventRefreshItselfTimer&&clearTimeout(preventRefreshItselfTimer),preventRefreshItselfTimer=setTimeout((function(){"function"==typeof e&&e.apply(e,n)}),t)}:function(){for(var n=[],i=0;i<arguments.length;i++)n[i]=arguments[i];r&&clearTimeout(r),r=setTimeout((function(){"function"==typeof e&&e.apply(e,n)}),t)}};function hashString(e){var t=crypto.createHash("sha256");return t.update(e),t.digest("hex")}var cache=new Map;function memoizeFn(e,t){if("function"!=typeof e)throw new Error("memoizeFn expects got a function");var n=null!=t?t:{},r=n.resolver,i=n.context;if(i&&!(i instanceof Map))throw new Error("context must be a Map Instance");e.cache=null!=i?i:cache;var o=r||hashString(e.toString());return e.cache.has(o)||e.cache.set(o,e),e.cache.get(o)}function index$3(e,t){var n=null!=t?t:{},r=n.go,i=void 0!==r&&r,o=n.state,a=void 0===o?null:o;if(window.history.replaceState(null,"",e),i){var c=new PopStateEvent("popstate",{state:a});window.dispatchEvent(c)}}function limiter(e){var t=[],n=0;function r(i){var o=null==i?void 0:i.taskFn().then((function(i){return n>0&&n--,function(){if(n<e){var i=t.shift();i&&r(i)}}(),i}));Promise.resolve(o).then(null==i?void 0:i.resolve,null==i?void 0:i.reject)}return function(i){return n>=e?function(e){return new Promise((function(n,r){t.push({taskFn:e,resolve:n,reject:r})}))}(i):(n++,new Promise((function(e,t){r({taskFn:i,resolve:e,reject:t})})))}}function index$2(e){void 0===e&&(e="");var t="",n="";return{add:function(r){var i="".concat(e).split(".")[0],o="".concat(r).split(".")[0],a="".concat(e).split(".")[1],c="".concat(r).split(".")[1];i.length<o.length?i=i.padStart(o.length,"0"):o=o.padStart(i.length,"0"),a||(a=""),c||(c=""),a.length<c.length?a=a.padStart(c.length,"0"):c=c.padStart(a.length,"0");for(var u=i.length-1;u>=0;u--){var s=i[u],f=o[u];t="".concat(+s+ +f).concat(t)}for(u=a.length-1;u>=0;u--){var l=a[u],p=c[u];n="".concat(+l+ +p).concat(n)}return this},get:function(){return(n?"".concat(t,".").concat(n):t)||e}}}function index$1(e,t){var n=this,r=(t||{}).maxAge,i=isNil(r)?NaN:Date.now()+1e3*r,o=function(){for(var t=[],a=0;a<arguments.length;a++)t[a]=arguments[a];var c=Date.now(),u=t[0];if((0===r||!isNil(r)&&c>i)&&(o.cache.delete(u),i=c+1e3*r),o.cache.has(u))return o.cache.get(u);var s=e.apply(n,t);return o.cache=o.cache.set(u,s),s};return o.cache=new Map,o}var index=function(e){var t=!0;return t=0===Object.keys(e).length,Object.getOwnPropertySymbols(e).length>0&&(t=!1),t};function transformToJSON(e){if(Array.isArray(e))return JSON.stringify(e.map((function(e){return transformToJSON(e)})));if(isType(e,"object")){var t="{",n=Reflect.ownKeys(e);return n.forEach((function(r,i){var o=e[r],a=i===n.length-1?"":", ";t+=JSON.stringify(String(r))+":".concat(transformToJSON(o)).concat(a),i===n.length-1&&(t+="}")})),t}return"function"==typeof e||"symbol"==typeof e?null==e?void 0:e.toString():void 0===e?JSON.stringify("undefined"):JSON.stringify(e)}export{index$2 as addBigNumbers,index$4 as debounce,getType,index as isEmptyObject,isNil,isType,limiter as limitPromise,memoizeFn,index$1 as memoizeFnValue,index$5 as throttle,transformToJSON,index$3 as urlChange};
