import{m as h,b as H,a0 as b,w as V,a1 as A,a as P,g as S,n as T,a2 as U,a3 as w,a4 as B,a5 as D}from"./index.50f01cbf.js";const x={dark:{type:Boolean,default:null}};function E(e,t){return h(()=>e.dark===null?t.dark.isActive:e.dark)}function F(e,t,r){let l;function a(){l!==void 0&&(b.remove(l),l=void 0)}return H(()=>{e.value===!0&&a()}),{removeFromHistory:a,addToHistory(){l={condition:()=>r.value===!0,handler:t},b.add(l)}}}const I={modelValue:{type:Boolean,default:null},"onUpdate:modelValue":[Function,Array]},j=["beforeShow","show","beforeHide","hide"];function q({showing:e,canShow:t,hideOnRouteChange:r,handleShow:l,handleHide:a,processOnMount:k}){const f=S(),{props:u,emit:n,proxy:c}=f;let i;function M(o){e.value===!0?d(o):m(o)}function m(o){if(u.disable===!0||o!==void 0&&o.qAnchorHandled===!0||t!==void 0&&t(o)!==!0)return;const s=u["onUpdate:modelValue"]!==void 0;s===!0&&(n("update:modelValue",!0),i=o,T(()=>{i===o&&(i=void 0)})),(u.modelValue===null||s===!1)&&v(o)}function v(o){e.value!==!0&&(e.value=!0,n("beforeShow",o),l!==void 0?l(o):n("show",o))}function d(o){if(u.disable===!0)return;const s=u["onUpdate:modelValue"]!==void 0;s===!0&&(n("update:modelValue",!1),i=o,T(()=>{i===o&&(i=void 0)})),(u.modelValue===null||s===!1)&&p(o)}function p(o){e.value!==!1&&(e.value=!1,n("beforeHide",o),a!==void 0?a(o):n("hide",o))}function y(o){u.disable===!0&&o===!0?u["onUpdate:modelValue"]!==void 0&&n("update:modelValue",!1):o===!0!==e.value&&(o===!0?v:p)(i)}V(()=>u.modelValue,y),r!==void 0&&A(f)===!0&&V(()=>c.$route.fullPath,()=>{r.value===!0&&e.value===!0&&d()}),k===!0&&P(()=>{y(u.modelValue)});const g={show:m,hide:d,toggle:M};return Object.assign(c,g),g}function C(){let e;return{preventBodyScroll(t){t!==e&&(e!==void 0||t===!0)&&(e=t,U(t))}}}function $(){let e=null;const t=S();function r(){e!==null&&(clearTimeout(e),e=null)}return w(r),H(r),{removeTimeout:r,registerTimeout(l,a){r(),B(t)===!1&&(e=setTimeout(()=>{e=null,l()},a))}}}function z(){if(window.getSelection!==void 0){const e=window.getSelection();e.empty!==void 0?e.empty():e.removeAllRanges!==void 0&&(e.removeAllRanges(),D.is.mobile!==!0&&e.addRange(document.createRange()))}else document.selection!==void 0&&document.selection.empty()}export{x as a,j as b,E as c,$ as d,q as e,F as f,C as g,z as h,I as u};