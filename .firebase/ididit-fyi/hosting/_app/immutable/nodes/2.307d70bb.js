import{s as S,e as j,v as k,h as D,d,u as I,g as x,f as C}from"../chunks/scheduler.cbec24b0.js";import{S as N,i as O,d as L,v as R,j as _,k as m,l as p,g as f,m as h,n as $,a as V,z as E,f as q,t as z}from"../chunks/index.10018323.js";import{u as v}from"../chunks/firebaseStores.8d8ba113.js";const y="src/routes/auth/+layout.svelte";function b(o){let e,l,n,i;const u=o[2].default,s=j(u,o,o[1],null),a={c:function(){e=_("main"),l=_("div"),n=_("div"),s&&s.c(),this.h()},l:function(t){e=m(t,"MAIN",{class:!0});var r=p(e);l=m(r,"DIV",{class:!0});var g=p(l);n=m(g,"DIV",{class:!0});var w=p(n);s&&s.l(w),w.forEach(f),g.forEach(f),r.forEach(f),this.h()},h:function(){h(n,"class","card-body"),d(n,y,9,2,288),h(l,"class","prose prose-sm card flex-shrink-0 w-full max-w-sm shadow-2xl bg-base-100"),d(l,y,8,1,199),h(e,"class","flex h-screen justify-center items-center flex-col"),$(e,"display",o[0]===null?"flex":"none"),d(e,y,4,0,80)},m:function(t,r){V(t,e,r),E(e,l),E(l,n),s&&s.m(n,null),i=!0},p:function(t,[r]){s&&s.p&&(!i||r&2)&&I(s,u,t,t[1],i?C(u,t[1],r,null):x(t[1]),null),r&1&&$(e,"display",t[0]===null?"flex":"none")},i:function(t){i||(q(s,t),i=!0)},o:function(t){z(s,t),i=!1},d:function(t){t&&f(e),s&&s.d(t)}};return L("SvelteRegisterBlock",{block:a,id:b.name,type:"component",source:"",ctx:o}),a}function A(o,e,l){let n;k(v,"user"),D(o,v,a=>l(0,n=a));let{$$slots:i={},$$scope:u}=e;R("Layout",i,["default"]);const s=[];return Object.keys(e).forEach(a=>{!~s.indexOf(a)&&a.slice(0,2)!=="$$"&&a!=="slot"&&console.warn(`<Layout> was created with unknown prop '${a}'`)}),o.$$set=a=>{"$$scope"in a&&l(1,u=a.$$scope)},o.$capture_state=()=>({user:v,$user:n}),[n,u,i]}class G extends N{constructor(e){super(e),O(this,e,A,b,S,{}),L("SvelteRegisterComponent",{component:this,tagName:"Layout",options:e,id:b.name})}}export{G as component};
