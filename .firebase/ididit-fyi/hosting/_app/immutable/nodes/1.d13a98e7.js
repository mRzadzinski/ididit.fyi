import{s as C,v as O,h as R,d as b,n as g}from"../chunks/scheduler.cbec24b0.js";import{S as z,i as B,d as y,v as D,j as E,o as $,s as H,k as w,l as S,p as j,g as d,c as N,a as m,z as k,q}from"../chunks/index.10018323.js";import{d as P}from"../chunks/singletons.dfe99b27.js";const A=()=>{const t=P;return{page:{subscribe:t.page.subscribe},navigating:{subscribe:t.navigating.subscribe},updated:t.updated}},_={subscribe(t){return A().page.subscribe(t)}},x="node_modules/@sveltejs/kit/src/runtime/components/error.svelte";function f(t){var h;let e,i=t[0].status+"",r,l,n,c=((h=t[0].error)==null?void 0:h.message)+"",a;const v={c:function(){e=E("h1"),r=$(i),l=H(),n=E("p"),a=$(c),this.h()},l:function(s){e=w(s,"H1",{});var o=S(e);r=j(o,i),o.forEach(d),l=N(s),n=w(s,"P",{});var u=S(n);a=j(u,c),u.forEach(d),this.h()},h:function(){b(e,x,4,0,57),b(n,x,5,0,81)},m:function(s,o){m(s,e,o),k(e,r),m(s,l,o),m(s,n,o),k(n,a)},p:function(s,[o]){var u;o&1&&i!==(i=s[0].status+"")&&q(r,i),o&1&&c!==(c=((u=s[0].error)==null?void 0:u.message)+"")&&q(a,c)},i:g,o:g,d:function(s){s&&(d(e),d(l),d(n))}};return y("SvelteRegisterBlock",{block:v,id:f.name,type:"component",source:"",ctx:t}),v}function F(t,e,i){let r;O(_,"page"),R(t,_,a=>i(0,r=a));let{$$slots:l={},$$scope:n}=e;D("Error",l,[]);const c=[];return Object.keys(e).forEach(a=>{!~c.indexOf(a)&&a.slice(0,2)!=="$$"&&a!=="slot"&&console.warn(`<Error> was created with unknown prop '${a}'`)}),t.$capture_state=()=>({page:_,$page:r}),[r]}let K=class extends z{constructor(e){super(e),B(this,e,F,f,C,{}),y("SvelteRegisterComponent",{component:this,tagName:"Error",options:e,id:f.name})}};export{K as component};
