var app=function(){"use strict";function t(){}function n(t){return t()}function e(){return Object.create(null)}function o(t){t.forEach(n)}function i(t){return"function"==typeof t}function r(t,n){return t!=t?n==n:t!==n||t&&"object"==typeof t||"function"==typeof t}function s(n,e,o){n.$$.on_destroy.push(function(n,...e){if(null==n)return t;const o=n.subscribe(...e);return o.unsubscribe?()=>o.unsubscribe():o}(e,o))}function u(t,n,e=n){return t.set(e),n}function c(t,n){t.appendChild(n)}function l(t,n,e){t.insertBefore(n,e||null)}function a(t){t.parentNode.removeChild(t)}function f(t,n){for(let e=0;e<t.length;e+=1)t[e]&&t[e].d(n)}function d(t){return document.createElement(t)}function m(t){return document.createTextNode(t)}function h(){return m(" ")}function p(t,n,e,o){return t.addEventListener(n,e,o),()=>t.removeEventListener(n,e,o)}function g(t,n,e){null==e?t.removeAttribute(n):t.getAttribute(n)!==e&&t.setAttribute(n,e)}function $(t){return""===t?null:+t}function b(t,n){n=""+n,t.wholeText!==n&&(t.data=n)}function v(t,n){t.value=null==n?"":n}function y(t,n,e){t.classList[e?"add":"remove"](n)}let k;function _(t){k=t}function M(){if(!k)throw new Error("Function called outside component initialization");return k}function x(){const t=M();return(n,e)=>{const o=t.$$.callbacks[n];if(o){const i=function(t,n){const e=document.createEvent("CustomEvent");return e.initCustomEvent(t,!1,!1,n),e}(n,e);o.slice().forEach((n=>{n.call(t,i)}))}}}const w=[],L=[],E=[],O=[],T=Promise.resolve();let C=!1;function S(t){E.push(t)}function j(t){O.push(t)}let D=!1;const H=new Set;function I(){if(!D){D=!0;do{for(let t=0;t<w.length;t+=1){const n=w[t];_(n),N(n.$$)}for(_(null),w.length=0;L.length;)L.pop()();for(let t=0;t<E.length;t+=1){const n=E[t];H.has(n)||(H.add(n),n())}E.length=0}while(w.length);for(;O.length;)O.pop()();C=!1,D=!1,H.clear()}}function N(t){if(null!==t.fragment){t.update(),o(t.before_update);const n=t.dirty;t.dirty=[-1],t.fragment&&t.fragment.p(t.ctx,n),t.after_update.forEach(S)}}const A=new Set;let P;function z(){P={r:0,c:[],p:P}}function B(){P.r||o(P.c),P=P.p}function G(t,n){t&&t.i&&(A.delete(t),t.i(n))}function R(t,n,e,o){if(t&&t.o){if(A.has(t))return;A.add(t),P.c.push((()=>{A.delete(t),o&&(e&&t.d(1),o())})),t.o(n)}}function F(t,n,e){const o=t.$$.props[n];void 0!==o&&(t.$$.bound[o]=e,e(t.$$.ctx[o]))}function J(t){t&&t.c()}function q(t,e,r,s){const{fragment:u,on_mount:c,on_destroy:l,after_update:a}=t.$$;u&&u.m(e,r),s||S((()=>{const e=c.map(n).filter(i);l?l.push(...e):o(e),t.$$.on_mount=[]})),a.forEach(S)}function K(t,n){const e=t.$$;null!==e.fragment&&(o(e.on_destroy),e.fragment&&e.fragment.d(n),e.on_destroy=e.fragment=null,e.ctx=[])}function Q(t,n){-1===t.$$.dirty[0]&&(w.push(t),C||(C=!0,T.then(I)),t.$$.dirty.fill(0)),t.$$.dirty[n/31|0]|=1<<n%31}function U(n,i,r,s,u,c,l=[-1]){const f=k;_(n);const d=n.$$={fragment:null,ctx:null,props:c,update:t,not_equal:u,bound:e(),on_mount:[],on_destroy:[],on_disconnect:[],before_update:[],after_update:[],context:new Map(f?f.$$.context:i.context||[]),callbacks:e(),dirty:l,skip_bound:!1};let m=!1;if(d.ctx=r?r(n,i.props||{},((t,e,...o)=>{const i=o.length?o[0]:e;return d.ctx&&u(d.ctx[t],d.ctx[t]=i)&&(!d.skip_bound&&d.bound[t]&&d.bound[t](i),m&&Q(n,t)),e})):[],d.update(),m=!0,o(d.before_update),d.fragment=!!s&&s(d.ctx),i.target){if(i.hydrate){const t=function(t){return Array.from(t.childNodes)}(i.target);d.fragment&&d.fragment.l(t),t.forEach(a)}else d.fragment&&d.fragment.c();i.intro&&G(n.$$.fragment),q(n,i.target,i.anchor,i.customElement),I()}_(f)}class V{$destroy(){K(this,1),this.$destroy=t}$on(t,n){const e=this.$$.callbacks[t]||(this.$$.callbacks[t]=[]);return e.push(n),()=>{const t=e.indexOf(n);-1!==t&&e.splice(t,1)}}$set(t){var n;this.$$set&&(n=t,0!==Object.keys(n).length)&&(this.$$.skip_bound=!0,this.$$set(t),this.$$.skip_bound=!1)}}function W(n){let e,i,r,s,u,f,b,k,_,M,x,w,L,E,O,T,C,S,j,D;return{c(){e=d("tr"),i=d("td"),r=d("input"),s=h(),u=d("td"),f=d("input"),b=m(" min"),k=h(),_=d("td"),M=d("input"),x=h(),w=d("td"),L=d("button"),L.innerHTML='<img src="images/edit.svg" alt="Edit Item" class="svelte-lynhnu"/>',E=h(),O=d("td"),T=d("button"),C=d("img"),g(r,"type","text"),r.disabled=n[3],g(f,"type","number"),g(f,"min","0"),g(f,"max","90"),f.disabled=n[3],g(M,"type","checkbox"),M.disabled=n[3],g(L,"class","svelte-lynhnu"),y(L,"active",n[4]),C.src!==(S="images/trash-alt.svg")&&g(C,"src","images/trash-alt.svg"),g(C,"alt","Remove Item"),g(C,"class","svelte-lynhnu"),g(T,"class","svelte-lynhnu")},m(t,o){l(t,e,o),c(e,i),c(i,r),v(r,n[0]),c(e,s),c(e,u),c(u,f),v(f,n[1]),c(u,b),c(e,k),c(e,_),c(_,M),M.checked=n[2],c(e,x),c(e,w),c(w,L),c(e,E),c(e,O),c(O,T),c(T,C),j||(D=[p(r,"input",n[7]),p(f,"input",n[8]),p(M,"change",n[9]),p(L,"click",n[5]),p(C,"click",n[6])],j=!0)},p(t,[n]){8&n&&(r.disabled=t[3]),1&n&&r.value!==t[0]&&v(r,t[0]),8&n&&(f.disabled=t[3]),2&n&&$(f.value)!==t[1]&&v(f,t[1]),8&n&&(M.disabled=t[3]),4&n&&(M.checked=t[2]),16&n&&y(L,"active",t[4])},i:t,o:t,d(t){t&&a(e),j=!1,o(D)}}}function X(t,n,e){let{name:o}=n,{time:i}=n,{done:r}=n,s=!0,u=!1,c=i;const l=x();return t.$$set=t=>{"name"in t&&e(0,o=t.name),"time"in t&&e(1,i=t.time),"done"in t&&e(2,r=t.done)},[o,i,r,s,u,function(){u&&(i>90||i<0||!i)?e(1,i=c):c=i,e(3,s=!s),e(4,u=!u)},function(){l("delete")},function(){o=this.value,e(0,o)},function(){i=$(this.value),e(1,i)},function(){r=this.checked,e(2,r)}]}class Y extends V{constructor(t){super(),U(this,t,X,W,r,{name:0,time:1,done:2})}}const Z=[];let tt=function(n,e=t){let o;const i=[];function s(t){if(r(n,t)&&(n=t,o)){const t=!Z.length;for(let t=0;t<i.length;t+=1){const e=i[t];e[1](),Z.push(e,n)}if(t){for(let t=0;t<Z.length;t+=2)Z[t][0](Z[t+1]);Z.length=0}}}return{set:s,update:function(t){s(t(n))},subscribe:function(r,u=t){const c=[r,u];return i.push(c),1===i.length&&(o=e(s)||t),r(n),()=>{const t=i.indexOf(c);-1!==t&&i.splice(t,1),0===i.length&&(o(),o=null)}}}}([]);function nt(t,n,e){const o=t.slice();return o[14]=n[e].name,o[15]=n[e].time,o[16]=n[e].done,o[17]=n,o[18]=e,o}function et(t){let n,e,o,i,r;function s(n){t[6](n,t[14],t[17],t[18])}function u(n){t[7](n,t[15],t[17],t[18])}function c(n){t[8](n,t[16],t[17],t[18])}let l={};return void 0!==t[14]&&(l.name=t[14]),void 0!==t[15]&&(l.time=t[15]),void 0!==t[16]&&(l.done=t[16]),n=new Y({props:l}),L.push((()=>F(n,"name",s))),L.push((()=>F(n,"time",u))),L.push((()=>F(n,"done",c))),n.$on("delete",(function(){return t[9](t[18])})),{c(){J(n.$$.fragment)},m(t,e){q(n,t,e),r=!0},p(r,s){t=r;const u={};!e&&8&s&&(e=!0,u.name=t[14],j((()=>e=!1))),!o&&8&s&&(o=!0,u.time=t[15],j((()=>o=!1))),!i&&8&s&&(i=!0,u.done=t[16],j((()=>i=!1))),n.$set(u)},i(t){r||(G(n.$$.fragment,t),r=!0)},o(t){R(n.$$.fragment,t),r=!1},d(t){K(n,t)}}}function ot(t){let n,e,i,r,s,u,b,y,k,_,M,x,w,L,E,O,T,C,S,j,D,H,I,N,A=t[3],P=[];for(let n=0;n<A.length;n+=1)P[n]=et(nt(t,A,n));const F=t=>R(P[t],1,1,(()=>{P[t]=null}));return{c(){n=d("table"),e=d("thead"),e.innerHTML="<th>Task:</th> \n    <th>Time:</th> \n    <th>Done?</th> \n    <th>Edit?</th> \n    <th>Remove?</th>",i=h(),r=d("tbody");for(let t=0;t<P.length;t+=1)P[t].c();s=h(),u=d("tfoot"),b=d("h4"),b.textContent="Add Task",y=h(),k=d("tr"),_=d("td"),M=d("input"),x=h(),w=d("td"),L=d("input"),E=m(" min"),O=h(),T=d("td"),C=d("input"),S=h(),j=d("td"),D=d("button"),D.textContent="+",g(M,"type","text"),g(L,"type","number"),g(L,"min","0"),g(L,"max","90"),g(C,"type","checkbox"),g(n,"class","svelte-c3e669")},m(o,a){l(o,n,a),c(n,e),c(n,i),c(n,r);for(let t=0;t<P.length;t+=1)P[t].m(r,null);c(n,s),c(n,u),c(u,b),c(u,y),c(u,k),c(k,_),c(_,M),v(M,t[0]),c(k,x),c(k,w),c(w,L),v(L,t[1]),c(w,E),c(k,O),c(k,T),c(T,C),C.checked=t[2],c(k,S),c(k,j),c(j,D),H=!0,I||(N=[p(M,"input",t[10]),p(L,"input",t[11]),p(C,"change",t[12]),p(D,"click",t[4])],I=!0)},p(t,[n]){if(40&n){let e;for(A=t[3],e=0;e<A.length;e+=1){const o=nt(t,A,e);P[e]?(P[e].p(o,n),G(P[e],1)):(P[e]=et(o),P[e].c(),G(P[e],1),P[e].m(r,null))}for(z(),e=A.length;e<P.length;e+=1)F(e);B()}1&n&&M.value!==t[0]&&v(M,t[0]),2&n&&$(L.value)!==t[1]&&v(L,t[1]),4&n&&(C.checked=t[2])},i(t){if(!H){for(let t=0;t<A.length;t+=1)G(P[t]);H=!0}},o(t){P=P.filter(Boolean);for(let t=0;t<P.length;t+=1)R(P[t]);H=!1},d(t){t&&a(n),f(P,t),I=!1,o(N)}}}function it(t,n,e){let o;s(t,tt,(t=>e(3,o=t))),null!=localStorage.getItem("userList")&&Object.assign(o,JSON.parse(localStorage.getItem("userList")));const i=tt.subscribe((()=>localStorage.setItem("userList",JSON.stringify(o))));var r;let c;r=i,M().$$.on_destroy.push(r);let l=25,a=!1;function f(t){o.splice(t,1),tt.set(o)}return[c,l,a,o,function(){void 0===l||l>90||l<0||(u(tt,o=[...o,{name:c,time:l,done:a}],o),e(0,c=""),e(1,l=25),e(2,a=!1)),console.log(o)},f,function(t,n,e,i){e[i].name=t,tt.set(o)},function(t,n,e,i){e[i].time=t,tt.set(o)},function(t,n,e,i){e[i].done=t,tt.set(o)},t=>f(t),function(){c=this.value,e(0,c)},function(){l=$(this.value),e(1,l)},function(){a=this.checked,e(2,a)}]}class rt extends V{constructor(t){super(),U(this,t,it,ot,r,{})}}function st(n){let e,o,i,r,s,u,f,p,$,v,y,k,_,M=(n[0]%12||12)+"",x=(n[1]<10?"0"+n[1]:n[1])+"",w=n[0]>12?"PM":"AM";return{c(){e=d("h1"),o=m(M),i=m(":"),r=m(x),s=h(),u=m(w),f=h(),p=d("br"),$=h(),v=d("sub"),y=m(n[2]),k=h(),_=d("h2"),_.textContent="TFH",g(v,"class","svelte-1sru9z3"),g(e,"class","svelte-1sru9z3"),g(_,"class","svelte-1sru9z3")},m(t,n){l(t,e,n),c(e,o),c(e,i),c(e,r),c(e,s),c(e,u),c(e,f),c(e,p),c(e,$),c(e,v),c(v,y),l(t,k,n),l(t,_,n)},p(t,[n]){1&n&&M!==(M=(t[0]%12||12)+"")&&b(o,M),2&n&&x!==(x=(t[1]<10?"0"+t[1]:t[1])+"")&&b(r,x),1&n&&w!==(w=t[0]>12?"PM":"AM")&&b(u,w),4&n&&b(y,t[2])},i:t,o:t,d(t){t&&a(e),t&&a(k),t&&a(_)}}}function ut(t,n,e){let{version:o}=n,{hour:i}=n,{min:r}=n,s="";return t.$$set=t=>{"version"in t&&e(3,o=t.version),"hour"in t&&e(0,i=t.hour),"min"in t&&e(1,r=t.min)},t.$$.update=()=>{9&t.$$.dirty&&e(2,s=23===i?"Hour of the Rat":0===i?"Midnight":1===i?"Hour of the Ox":2===i?"Late Hour":3===i?"Hour of the Tiger":4===i?"Morning Hour":5===i?"Daybreak":o)},[i,r,s,o]}class ct extends V{constructor(t){super(),U(this,t,ut,st,r,{version:3,hour:0,min:1})}}function lt(t,n,e){const o=t.slice();return o[16]=n[e].name,o[17]=n[e].time,o[18]=n[e].done,o[19]=n,o[20]=e,o}function at(t){let n,e,o;function i(){t[10].call(n,t[19],t[20])}return{c(){n=d("input"),g(n,"type","checkbox"),n.disabled=!0},m(r,s){l(r,n,s),n.checked=t[18],e||(o=p(n,"change",i),e=!0)},p(e,o){t=e,1&o&&(n.checked=t[18])},d(t){t&&a(n),e=!1,o()}}}function ft(t){let n,e,o,i,r,s,u,f,p,g,$=t[16]+"",v=t[17]+"",y=void 0!==t[18]&&at(t);return{c(){n=d("br"),e=h(),o=d("span"),i=m($),r=h(),s=d("span"),u=m(v),f=m(" min"),p=h(),y&&y.c(),g=m("")},m(t,a){l(t,n,a),l(t,e,a),l(t,o,a),c(o,i),l(t,r,a),l(t,s,a),c(s,u),c(s,f),l(t,p,a),y&&y.m(t,a),l(t,g,a)},p(t,n){1&n&&$!==($=t[16]+"")&&b(i,$),1&n&&v!==(v=t[17]+"")&&b(u,v),void 0!==t[18]?y?y.p(t,n):(y=at(t),y.c(),y.m(g.parentNode,g)):y&&(y.d(1),y=null)},d(t){t&&a(n),t&&a(e),t&&a(o),t&&a(r),t&&a(s),t&&a(p),y&&y.d(t),t&&a(g)}}}function dt(t){let n;return{c(){n=d("p"),n.textContent="Now Playing"},m(t,e){l(t,n,e)},d(t){t&&a(n)}}}function mt(n){let e,o,i,r,s,u,g,$,v,y,k,_,M,x,w,L=(n[2]._hour%12||12)+"",E=(n[2]._min<10?"0"+n[2]._min:n[2]._min)+"",O=n[2]._hour>12?"PM":"AM",T=n[0],C=[];for(let t=0;t<T.length;t+=1)C[t]=ft(lt(n,T,t));let S=n[3]&&dt();return{c(){for(let t=0;t<C.length;t+=1)C[t].c();e=h(),o=d("button"),o.textContent="Play this",i=h(),S&&S.c(),r=h(),s=d("p"),u=m("Playlist has "),g=m(n[1]),$=m(" minutes remaining. This will finish at aprox. "),v=m(L),y=m(":"),k=m(E),_=h(),M=m(O)},m(t,a){for(let n=0;n<C.length;n+=1)C[n].m(t,a);l(t,e,a),l(t,o,a),l(t,i,a),S&&S.m(t,a),l(t,r,a),l(t,s,a),c(s,u),c(s,g),c(s,$),c(s,v),c(s,y),c(s,k),c(s,_),c(s,M),x||(w=p(o,"click",n[11]),x=!0)},p(t,[n]){if(1&n){let o;for(T=t[0],o=0;o<T.length;o+=1){const i=lt(t,T,o);C[o]?C[o].p(i,n):(C[o]=ft(i),C[o].c(),C[o].m(e.parentNode,e))}for(;o<C.length;o+=1)C[o].d(1);C.length=T.length}t[3]?S||(S=dt(),S.c(),S.m(r.parentNode,r)):S&&(S.d(1),S=null),2&n&&b(g,t[1]),4&n&&L!==(L=(t[2]._hour%12||12)+"")&&b(v,L),4&n&&E!==(E=(t[2]._min<10?"0"+t[2]._min:t[2]._min)+"")&&b(k,E),4&n&&O!==(O=t[2]._hour>12?"PM":"AM")&&b(M,O)},i:t,o:t,d(t){f(C,t),t&&a(e),t&&a(o),t&&a(i),S&&S.d(t),t&&a(r),t&&a(s),x=!1,w()}}}function ht(t,n,e){let o;s(t,tt,(t=>e(13,o=t)));let{userListObj:i}=n,{min:r}=n,c=[],l=0;i.forEach(((t,n)=>{!1===t.done&&(c.push({...t,callback:()=>{u(tt,o[n].done=!0,o)}}),c.push({name:"Break",time:5,done:void 0}))}));let a,{normalMusic:f}=n,{breakMusic:d}=n;f.pause(),d.pause();let m={_hour:0,_min:0},{hour:h}=n,p=!1,g=0;function $(){void 0===c[l].done?(f.pause(),d.play()):(f.play(),d.pause())}return t.$$set=t=>{"userListObj"in t&&e(4,i=t.userListObj),"min"in t&&e(5,r=t.min),"normalMusic"in t&&e(6,f=t.normalMusic),"breakMusic"in t&&e(7,d=t.breakMusic),"hour"in t&&e(8,h=t.hour)},t.$$.update=()=>{if(807&t.$$.dirty){p&&(c[l].time>0?e(0,c[l].time--,c):c.length>l&&(e(0,c[l].done=!0,c),null!=c[l].callback&&c[l].callback(),l++,$()),e(0,c)),e(9,g=0);for(let t of c)e(9,g+=t.time);e(1,a=g),e(2,m={_hour:h,_min:r}),m._min+a>=60?(e(2,m._hour++,m),24==m._hour&&e(2,m._hour=0,m),e(2,m._min=m._min+a%60,m)):e(2,m._min+=a,m)}200&t.$$.dirty&&(p?$():(f.pause(),d.pause()))},[c,a,m,p,i,r,f,d,h,g,function(t,n){t[n].done=this.checked,e(0,c)},()=>{e(3,p=!p)}]}class pt extends V{constructor(t){super(),U(this,t,ht,mt,r,{userListObj:4,min:5,normalMusic:6,breakMusic:7,hour:8})}}function gt(t){let n,e;return n=new pt({props:{userListObj:t[8],min:t[3],hour:t[2],breakMusic:t[7],normalMusic:t[6]}}),{c(){J(n.$$.fragment)},m(t,o){q(n,t,o),e=!0},p(t,e){const o={};256&e&&(o.userListObj=t[8]),8&e&&(o.min=t[3]),4&e&&(o.hour=t[2]),128&e&&(o.breakMusic=t[7]),64&e&&(o.normalMusic=t[6]),n.$set(o)},i(t){e||(G(n.$$.fragment,t),e=!0)},o(t){R(n.$$.fragment,t),e=!1},d(t){K(n,t)}}}function $t(t){let n,e,i,r,s,u,f,g,$,v,y,k,_,M,x,w,L,E,O,T,C,S;e=new ct({props:{version:t[0],hour:t[2],min:t[3]}}),v=new rt({});let j=t[5]&&t[8]!=[]&&gt(t);return{c(){n=d("main"),J(e.$$.fragment),i=h(),r=d("p"),s=m(t[4]),u=h(),f=d("p"),g=m(t[1]),$=h(),J(v.$$.fragment),y=h(),k=d("br"),_=h(),M=d("button"),x=m("Make into Playlist : "),w=m(t[5]),L=h(),E=d("button"),E.textContent="Nuke Task List (removes cache)",O=h(),j&&j.c()},m(o,a){l(o,n,a),q(e,n,null),c(n,i),c(n,r),c(r,s),c(n,u),c(n,f),c(f,g),c(n,$),q(v,n,null),c(n,y),c(n,k),c(n,_),c(n,M),c(M,x),c(M,w),c(n,L),c(n,E),c(n,O),j&&j.m(n,null),T=!0,C||(S=[p(M,"click",t[9]),p(E,"click",t[10])],C=!0)},p(t,[o]){const i={};1&o&&(i.version=t[0]),4&o&&(i.hour=t[2]),8&o&&(i.min=t[3]),e.$set(i),(!T||16&o)&&b(s,t[4]),(!T||2&o)&&b(g,t[1]),(!T||32&o)&&b(w,t[5]),t[5]&&t[8]!=[]?j?(j.p(t,o),288&o&&G(j,1)):(j=gt(t),j.c(),G(j,1),j.m(n,null)):j&&(z(),R(j,1,1,(()=>{j=null})),B())},i(t){T||(G(e.$$.fragment,t),G(v.$$.fragment,t),G(j),T=!0)},o(t){R(e.$$.fragment,t),R(v.$$.fragment,t),R(j),T=!1},d(t){t&&a(n),K(e),K(v),j&&j.d(),C=!1,o(S)}}}let bt=1e3;async function vt(t,n){let e=await browser.tabs.sendMessage(t,{[n]:!0});return console.log("Message from the content script:"),console.log(e,n),e}function yt(t,n,e){let o;s(t,tt,(t=>e(8,o=t)));let{version:i}=n,r=Date.now()+bt,c=new Date,l=c.getSeconds(),a=c.getHours(),f=c.getMinutes(),d=[],m=0;setTimeout((function t(){var n=Date.now()-r;n>bt&&(console.log("Significant time drift ... Correcting ... (if you get this message many times, please contact us, because it's likely a bug)"),e(4,c=new Date),e(2,a=c.getHours()),e(3,f=c.getMinutes()),e(1,l=c.getSeconds()));e(1,l++,l),n<=bt&&(d.push(n+m),m=function(t){var n=t.concat();if(n.sort((function(t,n){return t-n})),0===n.length)return 0;var e=Math.floor(n.length/2);return n.length%2?n[e]:(n[e-1]+n[e])/2}(d),d.length>=10&&d.shift());r+=bt,setTimeout(t,Math.max(0,bt-n-m))}),bt);let h=!1,p={},g={};p.play=async()=>vt(await browser.runtime.sendMessage({GetID:"normalMusic"}),"play"),p.pause=async()=>vt(await browser.runtime.sendMessage({GetID:"normalMusic"}),"pause"),g.play=async()=>vt(await browser.runtime.sendMessage({GetID:"breakMusic"}),"play"),g.pause=async()=>vt(await browser.runtime.sendMessage({GetID:"breakMusic"}),"pause");return t.$$set=t=>{"version"in t&&e(0,i=t.version)},t.$$.update=()=>{14&t.$$.dirty&&(60===l&&(e(3,f++,f),e(1,l=0)),f>=60&&(e(2,a++,a),e(3,f=0)),24==a&&e(2,a=0))},[i,l,a,f,c,h,p,g,o,function(){e(5,h=!h)},function(){u(tt,o=[],o),localStorage.removeItem("userList")}]}return new class extends V{constructor(t){super(),U(this,t,yt,$t,r,{version:0})}}({target:document.body,props:{version:"Beta"}})}();
//# sourceMappingURL=bundle.js.map
