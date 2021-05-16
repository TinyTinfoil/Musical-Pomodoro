var app=function(){"use strict";function t(){}function e(t){return t()}function n(){return Object.create(null)}function o(t){t.forEach(e)}function i(t){return"function"==typeof t}function s(t,e){return t!=t?e==e:t!==e||t&&"object"==typeof t||"function"==typeof t}function r(e,n,o){e.$$.on_destroy.push(function(e,...n){if(null==e)return t;const o=e.subscribe(...n);return o.unsubscribe?()=>o.unsubscribe():o}(n,o))}function c(t,e,n=e){return t.set(n),e}function u(t,e){t.appendChild(e)}function l(t,e,n){t.insertBefore(e,n||null)}function a(t){t.parentNode.removeChild(t)}function f(t,e){for(let n=0;n<t.length;n+=1)t[n]&&t[n].d(e)}function d(t){return document.createElement(t)}function h(t){return document.createTextNode(t)}function m(){return h(" ")}function p(t,e,n,o){return t.addEventListener(e,n,o),()=>t.removeEventListener(e,n,o)}function g(t,e,n){null==n?t.removeAttribute(e):t.getAttribute(e)!==n&&t.setAttribute(e,n)}function $(t){return""===t?null:+t}function b(t,e){e=""+e,t.wholeText!==e&&(t.data=e)}function v(t,e){t.value=null==e?"":e}function y(t,e,n,o){t.style.setProperty(e,n,o?"important":"")}function k(t,e,n){t.classList[n?"add":"remove"](e)}let M;function x(t){M=t}function w(){if(!M)throw new Error("Function called outside component initialization");return M}function _(){const t=w();return(e,n)=>{const o=t.$$.callbacks[e];if(o){const i=function(t,e){const n=document.createEvent("CustomEvent");return n.initCustomEvent(t,!1,!1,e),n}(e,n);o.slice().forEach((e=>{e.call(t,i)}))}}}const S=[],j=[],L=[],E=[],O=Promise.resolve();let P=!1;function T(t){L.push(t)}function A(t){E.push(t)}let I=!1;const D=new Set;function H(){if(!I){I=!0;do{for(let t=0;t<S.length;t+=1){const e=S[t];x(e),C(e.$$)}for(x(null),S.length=0;j.length;)j.pop()();for(let t=0;t<L.length;t+=1){const e=L[t];D.has(e)||(D.add(e),e())}L.length=0}while(S.length);for(;E.length;)E.pop()();P=!1,I=!1,D.clear()}}function C(t){if(null!==t.fragment){t.update(),o(t.before_update);const e=t.dirty;t.dirty=[-1],t.fragment&&t.fragment.p(t.ctx,e),t.after_update.forEach(T)}}const N=new Set;let z;function G(){z={r:0,c:[],p:z}}function J(){z.r||o(z.c),z=z.p}function R(t,e){t&&t.i&&(N.delete(t),t.i(e))}function B(t,e,n,o){if(t&&t.o){if(N.has(t))return;N.add(t),z.c.push((()=>{N.delete(t),o&&(n&&t.d(1),o())})),t.o(e)}}function U(t,e,n){const o=t.$$.props[e];void 0!==o&&(t.$$.bound[o]=n,n(t.$$.ctx[o]))}function q(t){t&&t.c()}function F(t,n,s,r){const{fragment:c,on_mount:u,on_destroy:l,after_update:a}=t.$$;c&&c.m(n,s),r||T((()=>{const n=u.map(e).filter(i);l?l.push(...n):o(n),t.$$.on_mount=[]})),a.forEach(T)}function K(t,e){const n=t.$$;null!==n.fragment&&(o(n.on_destroy),n.fragment&&n.fragment.d(e),n.on_destroy=n.fragment=null,n.ctx=[])}function Q(t,e){-1===t.$$.dirty[0]&&(S.push(t),P||(P=!0,O.then(H)),t.$$.dirty.fill(0)),t.$$.dirty[e/31|0]|=1<<e%31}function V(e,i,s,r,c,u,l=[-1]){const f=M;x(e);const d=e.$$={fragment:null,ctx:null,props:u,update:t,not_equal:c,bound:n(),on_mount:[],on_destroy:[],on_disconnect:[],before_update:[],after_update:[],context:new Map(f?f.$$.context:i.context||[]),callbacks:n(),dirty:l,skip_bound:!1};let h=!1;if(d.ctx=s?s(e,i.props||{},((t,n,...o)=>{const i=o.length?o[0]:n;return d.ctx&&c(d.ctx[t],d.ctx[t]=i)&&(!d.skip_bound&&d.bound[t]&&d.bound[t](i),h&&Q(e,t)),n})):[],d.update(),h=!0,o(d.before_update),d.fragment=!!r&&r(d.ctx),i.target){if(i.hydrate){const t=function(t){return Array.from(t.childNodes)}(i.target);d.fragment&&d.fragment.l(t),t.forEach(a)}else d.fragment&&d.fragment.c();i.intro&&R(e.$$.fragment),F(e,i.target,i.anchor,i.customElement),H()}x(f)}class W{$destroy(){K(this,1),this.$destroy=t}$on(t,e){const n=this.$$.callbacks[t]||(this.$$.callbacks[t]=[]);return n.push(e),()=>{const t=n.indexOf(e);-1!==t&&n.splice(t,1)}}$set(t){var e;this.$$set&&(e=t,0!==Object.keys(e).length)&&(this.$$.skip_bound=!0,this.$$set(t),this.$$.skip_bound=!1)}}function X(e){let n,i,s,r,c,f,b,y,M,x,w,_,S,j,L,E,O,P,T,A;return{c(){n=d("tr"),i=d("td"),s=d("input"),r=m(),c=d("td"),f=d("input"),b=h(" min"),y=m(),M=d("td"),x=d("input"),w=m(),_=d("td"),S=d("button"),S.innerHTML='<img src="images/edit.svg" alt="Edit Item" class="svelte-1nhaj3o"/>',j=m(),L=d("td"),E=d("button"),O=d("img"),g(s,"type","text"),s.disabled=e[3],g(s,"class","svelte-1nhaj3o"),g(f,"type","number"),g(f,"min","0"),g(f,"max","90"),f.disabled=e[3],g(f,"class","svelte-1nhaj3o"),g(x,"type","checkbox"),x.disabled=e[3],g(x,"class","svelte-1nhaj3o"),g(S,"class","svelte-1nhaj3o"),k(S,"active",e[4]),O.src!==(P="images/trash-alt.svg")&&g(O,"src","images/trash-alt.svg"),g(O,"alt","Remove Item"),g(O,"class","svelte-1nhaj3o"),g(E,"class","svelte-1nhaj3o")},m(t,o){l(t,n,o),u(n,i),u(i,s),v(s,e[0]),u(n,r),u(n,c),u(c,f),v(f,e[1]),u(c,b),u(n,y),u(n,M),u(M,x),x.checked=e[2],u(n,w),u(n,_),u(_,S),u(n,j),u(n,L),u(L,E),u(E,O),T||(A=[p(s,"input",e[7]),p(f,"input",e[8]),p(x,"change",e[9]),p(S,"click",e[5]),p(O,"click",e[6])],T=!0)},p(t,[e]){8&e&&(s.disabled=t[3]),1&e&&s.value!==t[0]&&v(s,t[0]),8&e&&(f.disabled=t[3]),2&e&&$(f.value)!==t[1]&&v(f,t[1]),8&e&&(x.disabled=t[3]),4&e&&(x.checked=t[2]),16&e&&k(S,"active",t[4])},i:t,o:t,d(t){t&&a(n),T=!1,o(A)}}}function Y(t,e,n){let{name:o}=e,{time:i}=e,{done:s}=e,r=!0,c=!1,u=i;const l=_();return t.$$set=t=>{"name"in t&&n(0,o=t.name),"time"in t&&n(1,i=t.time),"done"in t&&n(2,s=t.done)},[o,i,s,r,c,function(){c&&(i>90||i<0||!i)?n(1,i=u):u=i,n(3,r=!r),n(4,c=!c)},function(){l("delete")},function(){o=this.value,n(0,o)},function(){i=$(this.value),n(1,i)},function(){s=this.checked,n(2,s)}]}class Z extends W{constructor(t){super(),V(this,t,Y,X,s,{name:0,time:1,done:2})}}const tt=[];let et=function(e,n=t){let o;const i=[];function r(t){if(s(e,t)&&(e=t,o)){const t=!tt.length;for(let t=0;t<i.length;t+=1){const n=i[t];n[1](),tt.push(n,e)}if(t){for(let t=0;t<tt.length;t+=2)tt[t][0](tt[t+1]);tt.length=0}}}return{set:r,update:function(t){r(t(e))},subscribe:function(s,c=t){const u=[s,c];return i.push(u),1===i.length&&(o=n(r)||t),s(e),()=>{const t=i.indexOf(u);-1!==t&&i.splice(t,1),0===i.length&&(o(),o=null)}}}}([]);function nt(t,e,n){const o=t.slice();return o[13]=e[n].name,o[14]=e[n].time,o[15]=e[n].done,o[16]=e,o[17]=n,o}function ot(t){let e,n,o,i,s;function r(e){t[6](e,t[13],t[16],t[17])}function c(e){t[7](e,t[14],t[16],t[17])}function u(e){t[8](e,t[15],t[16],t[17])}let l={};return void 0!==t[13]&&(l.name=t[13]),void 0!==t[14]&&(l.time=t[14]),void 0!==t[15]&&(l.done=t[15]),e=new Z({props:l}),j.push((()=>U(e,"name",r))),j.push((()=>U(e,"time",c))),j.push((()=>U(e,"done",u))),e.$on("delete",(function(){return t[9](t[17])})),{c(){q(e.$$.fragment)},m(t,n){F(e,t,n),s=!0},p(s,r){t=s;const c={};!n&&8&r&&(n=!0,c.name=t[13],A((()=>n=!1))),!o&&8&r&&(o=!0,c.time=t[14],A((()=>o=!1))),!i&&8&r&&(i=!0,c.done=t[15],A((()=>i=!1))),e.$set(c)},i(t){s||(R(e.$$.fragment,t),s=!0)},o(t){B(e.$$.fragment,t),s=!1},d(t){K(e,t)}}}function it(t){let e,n,i,s,r,c,b,y,k,M,x,w,_,S,j,L,E,O,P,T,A,I,D,H,C=t[3],N=[];for(let e=0;e<C.length;e+=1)N[e]=ot(nt(t,C,e));const z=t=>B(N[t],1,1,(()=>{N[t]=null}));return{c(){e=d("table"),n=d("thead"),n.innerHTML="<th>Task:</th> \n    <th>Time:</th> \n    <th>Done?</th> \n    <th>Edit?</th> \n    <th>Remove?</th>",i=m(),s=d("tbody");for(let t=0;t<N.length;t+=1)N[t].c();r=m(),c=d("tfoot"),b=d("h4"),b.textContent="Add Task",y=m(),k=d("tr"),M=d("td"),x=d("input"),w=m(),_=d("td"),S=d("input"),j=h(" min"),L=m(),E=d("td"),O=d("input"),P=m(),T=d("td"),A=d("button"),A.textContent="+",g(x,"type","text"),g(S,"type","number"),g(S,"min","0"),g(S,"max","90"),g(O,"type","checkbox")},m(o,a){l(o,e,a),u(e,n),u(e,i),u(e,s);for(let t=0;t<N.length;t+=1)N[t].m(s,null);u(e,r),u(e,c),u(c,b),u(c,y),u(c,k),u(k,M),u(M,x),v(x,t[0]),u(k,w),u(k,_),u(_,S),v(S,t[1]),u(_,j),u(k,L),u(k,E),u(E,O),O.checked=t[2],u(k,P),u(k,T),u(T,A),I=!0,D||(H=[p(x,"input",t[10]),p(S,"input",t[11]),p(O,"change",t[12]),p(A,"click",t[4])],D=!0)},p(t,[e]){if(40&e){let n;for(C=t[3],n=0;n<C.length;n+=1){const o=nt(t,C,n);N[n]?(N[n].p(o,e),R(N[n],1)):(N[n]=ot(o),N[n].c(),R(N[n],1),N[n].m(s,null))}for(G(),n=C.length;n<N.length;n+=1)z(n);J()}1&e&&x.value!==t[0]&&v(x,t[0]),2&e&&$(S.value)!==t[1]&&v(S,t[1]),4&e&&(O.checked=t[2])},i(t){if(!I){for(let t=0;t<C.length;t+=1)R(N[t]);I=!0}},o(t){N=N.filter(Boolean);for(let t=0;t<N.length;t+=1)B(N[t]);I=!1},d(t){t&&a(e),f(N,t),D=!1,o(H)}}}function st(t,e,n){let o,i;r(t,et,(t=>n(3,o=t)));let s=25,u=!1;function l(t){o.splice(t,1),et.set(o)}return[i,s,u,o,function(){void 0===s||s>90||s<0||(c(et,o=[...o,{name:i,time:s,done:u}],o),n(0,i=""),n(1,s=25),n(2,u=!1))},l,function(t,e,n,i){n[i].name=t,et.set(o)},function(t,e,n,i){n[i].time=t,et.set(o)},function(t,e,n,i){n[i].done=t,et.set(o)},t=>l(t),function(){i=this.value,n(0,i)},function(){s=$(this.value),n(1,s)},function(){u=this.checked,n(2,u)}]}class rt extends W{constructor(t){super(),V(this,t,st,it,s,{})}}function ct(e){let n,o,i,s,r,c,f,p,$,v,y,k,M,x=(e[0]%12||12)+"",w=(e[1]<10?"0"+e[1]:e[1])+"",_=e[0]>12?"PM":"AM";return{c(){n=d("h1"),o=h(x),i=h(":"),s=h(w),r=m(),c=h(_),f=m(),p=d("br"),$=m(),v=d("sub"),y=h(e[2]),k=m(),M=d("h2"),M.textContent="Musical Pomodoro",g(v,"class","svelte-1sru9z3"),g(n,"class","svelte-1sru9z3"),g(M,"class","svelte-1sru9z3")},m(t,e){l(t,n,e),u(n,o),u(n,i),u(n,s),u(n,r),u(n,c),u(n,f),u(n,p),u(n,$),u(n,v),u(v,y),l(t,k,e),l(t,M,e)},p(t,[e]){1&e&&x!==(x=(t[0]%12||12)+"")&&b(o,x),2&e&&w!==(w=(t[1]<10?"0"+t[1]:t[1])+"")&&b(s,w),1&e&&_!==(_=t[0]>12?"PM":"AM")&&b(c,_),4&e&&b(y,t[2])},i:t,o:t,d(t){t&&a(n),t&&a(k),t&&a(M)}}}function ut(t,e,n){let{version:o}=e,{hour:i}=e,{min:s}=e,r="";return t.$$set=t=>{"version"in t&&n(3,o=t.version),"hour"in t&&n(0,i=t.hour),"min"in t&&n(1,s=t.min)},t.$$.update=()=>{9&t.$$.dirty&&n(2,r=23===i?"Hour of the Rat":0===i?"Midnight":1===i?"Hour of the Ox":2===i?"Late Hour":3===i?"Hour of the Tiger":4===i?"Morning Hour":5===i?"Daybreak":o)},[i,s,r,o]}class lt extends W{constructor(t){super(),V(this,t,ut,ct,s,{version:3,hour:0,min:1})}}function at(t,e,n){const o=t.slice();return o[17]=e[n].name,o[18]=e[n].time,o[19]=e[n].done,o[20]=e,o[21]=n,o}function ft(t){let e,n,o,i;function s(){t[11].call(n,t[20],t[21])}return{c(){e=d("td"),n=d("input"),g(n,"type","checkbox"),n.disabled=!0,g(n,"class","svelte-wrrsnf")},m(r,c){l(r,e,c),u(e,n),n.checked=t[19],o||(i=p(n,"change",s),o=!0)},p(e,o){t=e,1&o&&(n.checked=t[19])},d(t){t&&a(e),o=!1,i()}}}function dt(t){let e,n,o,i,s,r,c,f,p,g=t[17]+"",$=t[18]+"",v=void 0!==t[19]&&ft(t);return{c(){e=d("tr"),n=d("td"),o=h(g),i=m(),s=d("td"),r=h($),c=h(" min"),f=m(),v&&v.c(),p=m()},m(t,a){l(t,e,a),u(e,n),u(n,o),u(e,i),u(e,s),u(s,r),u(s,c),u(e,f),v&&v.m(e,null),u(e,p)},p(t,n){1&n&&g!==(g=t[17]+"")&&b(o,g),1&n&&$!==($=t[18]+"")&&b(r,$),void 0!==t[19]?v?v.p(t,n):(v=ft(t),v.c(),v.m(e,p)):v&&(v.d(1),v=null)},d(t){t&&a(e),v&&v.d()}}}function ht(e){let n,o,i,s,r,c,$,v,y,k,M,x,w,_,S,j,L,E,O=(e[3]._hour%12||12)+"",P=(e[3]._min<10?"0"+e[3]._min:e[3]._min)+"",T=e[3]._hour>12?"PM":"AM",A=e[0],I=[];for(let t=0;t<A.length;t+=1)I[t]=dt(at(e,A,t));return{c(){n=d("table");for(let t=0;t<I.length;t+=1)I[t].c();o=m(),i=d("button"),s=d("img"),$=m(),v=d("p"),y=h("Playlist has "),k=h(e[1]),M=h(" minutes remaining. This will finish at aprox. "),x=h(O),w=h(":"),_=h(P),S=m(),j=h(T),s.src!==(r=e[2]?"images/stop-circle.svg":"images/play-circle.svg")&&g(s,"src",r),g(s,"width","32"),g(s,"alt",c=e[2]?"Stop Playing?":"Play?")},m(t,r){l(t,n,r);for(let t=0;t<I.length;t+=1)I[t].m(n,null);l(t,o,r),l(t,i,r),u(i,s),l(t,$,r),l(t,v,r),u(v,y),u(v,k),u(v,M),u(v,x),u(v,w),u(v,_),u(v,S),u(v,j),L||(E=p(i,"click",e[12]),L=!0)},p(t,[e]){if(1&e){let o;for(A=t[0],o=0;o<A.length;o+=1){const i=at(t,A,o);I[o]?I[o].p(i,e):(I[o]=dt(i),I[o].c(),I[o].m(n,null))}for(;o<I.length;o+=1)I[o].d(1);I.length=A.length}4&e&&s.src!==(r=t[2]?"images/stop-circle.svg":"images/play-circle.svg")&&g(s,"src",r),4&e&&c!==(c=t[2]?"Stop Playing?":"Play?")&&g(s,"alt",c),2&e&&b(k,t[1]),8&e&&O!==(O=(t[3]._hour%12||12)+"")&&b(x,O),8&e&&P!==(P=(t[3]._min<10?"0"+t[3]._min:t[3]._min)+"")&&b(_,P),8&e&&T!==(T=t[3]._hour>12?"PM":"AM")&&b(j,T)},i:t,o:t,d(t){t&&a(n),f(I,t),t&&a(o),t&&a(i),t&&a($),t&&a(v),L=!1,E()}}}function mt(t,e,n){let o;r(t,et,(t=>n(14,o=t)));let{userListObj:i}=e,{min:s}=e,u=[],l=0;i.forEach(((t,e)=>{!1===t.done&&(u.push({...t,callback:()=>{c(et,o[e].done=!0,o)}}),u.push({name:"Break",time:5,done:void 0}))}));let a,{normalMusic:f}=e,{breakMusic:d}=e;f.pause(),d.pause();let h={_hour:0,_min:0},{hour:m}=e,p=!1,g=0,{speak:$=!1}=e;function b(){void 0===u[l].done?(f.pause(),d.play()):(f.play(),d.pause()),$&&speechSynthesis.speak(new window.SpeechSynthesisUtterance(u[l].name))}return t.$$set=t=>{"userListObj"in t&&n(4,i=t.userListObj),"min"in t&&n(5,s=t.min),"normalMusic"in t&&n(6,f=t.normalMusic),"breakMusic"in t&&n(7,d=t.breakMusic),"hour"in t&&n(8,m=t.hour),"speak"in t&&n(9,$=t.speak)},t.$$.update=()=>{if(1315&t.$$.dirty){p&&(u[l].time>0?n(0,u[l].time--,u):u.length>l&&(n(0,u[l].done=!0,u),null!=u[l].callback&&u[l].callback(),l++,b()),n(0,u)),n(10,g=0);for(let t of u)n(10,g+=t.time);n(1,a=g),n(3,h={_hour:(m+Math.floor((s+a)/60))%24,_min:(s+a)%60})}196&t.$$.dirty&&(p?b():(f.pause(),d.pause()))},[u,a,p,h,i,s,f,d,m,$,g,function(t,e){t[e].done=this.checked,n(0,u)},()=>{n(2,p=!p)}]}class pt extends W{constructor(t){super(),V(this,t,mt,ht,s,{userListObj:4,min:5,normalMusic:6,breakMusic:7,hour:8,speak:9})}}function gt(t){let e,n;return e=new pt({props:{userListObj:t[7],speak:t[6],min:t[2],hour:t[1],breakMusic:t[5],normalMusic:t[4]}}),{c(){q(e.$$.fragment)},m(t,o){F(e,t,o),n=!0},p(t,n){const o={};128&n&&(o.userListObj=t[7]),64&n&&(o.speak=t[6]),4&n&&(o.min=t[2]),2&n&&(o.hour=t[1]),32&n&&(o.breakMusic=t[5]),16&n&&(o.normalMusic=t[4]),e.$set(o)},i(t){n||(R(e.$$.fragment,t),n=!0)},o(t){B(e.$$.fragment,t),n=!1},d(t){K(e,t)}}}function $t(t){let e,n,i,s,r,c,f,$,v,k,M,x,w,_,S,j,L,E,O,P,T,A,I,D,H,C;n=new lt({props:{version:t[0],hour:t[1],min:t[2]}}),s=new rt({});let N=t[3]&&gt(t);return{c(){e=d("main"),q(n.$$.fragment),i=m(),q(s.$$.fragment),r=m(),c=d("br"),f=m(),$=d("button"),v=h("Make into Playlist : "),k=h(t[3]),M=m(),x=d("button"),x.textContent="Nuke Task List (removes cache)",w=m(),_=d("button"),_.innerHTML='Export tasks to file <img src="images/save.svg" width="16" alt="Save to file"/>',S=d("button"),j=d("label"),L=d("input"),E=h("\n      Load tasks from file"),O=m(),P=d("label"),T=d("input"),A=h("\n    Speak cues"),I=m(),N&&N.c(),g(L,"type","file"),y(L,"display","none"),g(T,"type","checkbox"),y(P,"display","inline")},m(o,a){l(o,e,a),F(n,e,null),u(e,i),F(s,e,null),u(e,r),u(e,c),u(e,f),u(e,$),u($,v),u($,k),u(e,M),u(e,x),u(e,w),u(e,_),u(e,S),u(S,j),u(j,L),u(j,E),u(e,O),u(e,P),u(P,T),T.checked=t[6],u(P,A),u(e,I),N&&N.m(e,null),D=!0,H||(C=[p($,"click",t[10]),p(x,"click",t[8]),p(_,"click",t[11]),p(L,"change",t[12]),p(T,"change",t[13])],H=!0)},p(t,[o]){const i={};1&o&&(i.version=t[0]),2&o&&(i.hour=t[1]),4&o&&(i.min=t[2]),n.$set(i),(!D||8&o)&&b(k,t[3]),64&o&&(T.checked=t[6]),t[3]?N?(N.p(t,o),8&o&&R(N,1)):(N=gt(t),N.c(),R(N,1),N.m(e,null)):N&&(G(),B(N,1,1,(()=>{N=null})),J())},i(t){D||(R(n.$$.fragment,t),R(s.$$.fragment,t),R(N),D=!0)},o(t){B(n.$$.fragment,t),B(s.$$.fragment,t),B(N),D=!1},d(t){t&&a(e),K(n),K(s),N&&N.d(),H=!1,o(C)}}}let bt=1e3;async function vt(t,e){return await browser.tabs.sendMessage(t,{[e]:!0})}function yt(t,e,n){let o;r(t,et,(t=>n(7,o=t)));let{version:i}=e,s=Date.now()+bt,u=new Date,l=u.getSeconds(),a=u.getHours(),f=u.getMinutes(),d=[],h=0;setTimeout((function t(){let e=Date.now()-s;e>bt&&(console.log("Significant time drift ..."),u=new Date,n(1,a=u.getHours()),n(2,f=u.getMinutes()),n(9,l=u.getSeconds()));n(9,l++,l),e<=bt&&(d.push(e+h),h=function(t){let e=t.concat();if(e.sort((function(t,e){return t-e})),0===e.length)return 0;let n=Math.floor(e.length/2);return e.length%2?e[n]:(e[n-1]+e[n])/2}(d),d.length>=10&&d.shift());s+=bt,setTimeout(t,Math.max(0,bt-e-h))}),bt);let m=!1,p={},g={};p.play=async()=>vt(await browser.runtime.sendMessage({GetID:"normalMusic"}),"play"),p.pause=async()=>vt(await browser.runtime.sendMessage({GetID:"normalMusic"}),"pause"),g.play=async()=>vt(await browser.runtime.sendMessage({GetID:"breakMusic"}),"play"),g.pause=async()=>vt(await browser.runtime.sendMessage({GetID:"breakMusic"}),"pause"),null!=localStorage.getItem("userList")&&Object.assign(o,JSON.parse(localStorage.getItem("userList")));const $=et.subscribe((()=>localStorage.setItem("userList",JSON.stringify(o))));var b;b=$,w().$$.on_destroy.push(b);let v=!1;return t.$$set=t=>{"version"in t&&n(0,i=t.version)},t.$$.update=()=>{516&t.$$.dirty&&60===l&&(n(2,f++,f),n(9,l=0)),6&t.$$.dirty&&f>=60&&(n(1,a++,a),n(2,f=0)),2&t.$$.dirty&&24===a&&n(1,a=0)},[i,a,f,m,p,g,v,o,function(){c(et,o=[],o),localStorage.removeItem("userList")},l,function(){0!==o.length&&n(3,m=!m)},function(){let t=document.createElement("a");t.setAttribute("href","data:application/json;charset=utf-8,"+encodeURIComponent(JSON.stringify(o))),t.setAttribute("download","tasks.json"),t.click()},async function(){let t=await this.files[0].text();c(et,o=JSON.parse(t),o)},function(){v=this.checked,n(6,v)}]}return new class extends W{constructor(t){super(),V(this,t,yt,$t,s,{version:0})}}({target:document.body,props:{version:browser.runtime.getManifest().version}})}();
//# sourceMappingURL=bundle.js.map
