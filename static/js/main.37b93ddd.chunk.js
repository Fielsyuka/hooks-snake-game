(this["webpackJsonphooks-snake-game"]=this["webpackJsonphooks-snake-game"]||[]).push([[0],{13:function(e,t,n){},15:function(e,t,n){"use strict";n.r(t);var i,c=n(1),a=n.n(c),s=n(8),o=n.n(s),r=(n(13),function(e,t){for(var n=function(){var n=Math.floor(Math.random()*(e-1-1))+1,i=Math.floor(Math.random()*(e-1-1))+1;if(!t.some((function(e){return e.x===n&&e.y===i})))return{v:{y:i,x:n}}};;){var i=n();if("object"===typeof i)return i.v}}),l=function(e,t,n){for(var i=[],c=0;c<e;c++){var a=new Array(e).fill("");i.push(a)}return i[t.y][t.x]="snake",i[n.y][n.x]="food",i},u=35,d={x:17,y:17},f=r(u,[d]),b=l(u,d,f),j=[1e3,500,100,50,10],x={body:[d],food:f,fields:b},h=Object.freeze({init:"init",playing:"playing",suspended:"suspended",gameover:"gameover"}),m=Object.freeze({up:"up",right:"right",left:"left",down:"down"}),y=Object.freeze({37:m.left,38:m.up,39:m.right,40:m.down}),v=Object.freeze({up:"down",right:"left",left:"right",down:"up"}),O=Object.freeze({up:{x:0,y:-1},right:{x:1,y:0},left:{x:-1,y:0},down:{x:0,y:1}}),p=n(0),g=function(e){var t=e.length,n=e.difficulty,i=void 0===n?3:n,c=e.onChangeDifficulty,a=i<j.length?"":"is-hidden",s=i>1?"":"is-hidden";return Object(p.jsxs)("div",{className:"navigation",children:[Object(p.jsxs)("div",{className:"navigation-item",children:[Object(p.jsx)("span",{className:"navigation-label",children:"Length: "}),Object(p.jsx)("div",{className:"navigation-item-number-container",children:Object(p.jsx)("div",{className:"num-board",children:t})})]}),Object(p.jsxs)("div",{className:"navigation-item",children:[Object(p.jsx)("span",{className:"navigation-label",children:"Difficulty: "}),Object(p.jsxs)("div",{className:"navigation-item-number-container",children:[Object(p.jsx)("span",{className:"num-board",children:i}),Object(p.jsxs)("div",{className:"difficulty-button-container",children:[Object(p.jsx)("div",{className:"difficulty-button difficulty-up ".concat(a),onClick:function(){return c(i+1)}}),Object(p.jsx)("div",{className:"difficulty-button difficulty-down ".concat(s),onClick:function(){return c(i-1)}})]})]})]})]})},N=function(e){var t=e.fields;return Object(p.jsx)("div",{className:"field",children:t.map((function(e){return e.map((function(e,t){return Object(p.jsx)("div",{className:"dots ".concat(e)},t)}))}))})},k=function(e){var t=e.status,n=e.onStart,i=e.onRestart,c=e.onStop;return Object(p.jsxs)("div",{className:"button",children:[t===h.gameover&&Object(p.jsx)("button",{className:"btn btn-gameover",onClick:i,children:"gameover"}),t===h.init&&Object(p.jsx)("button",{className:"btn btn-init",onClick:n,children:"start"}),t===h.suspended&&Object(p.jsx)("button",{className:"btn btn-suspended",onClick:n,children:"start"}),t===h.playing&&Object(p.jsx)("button",{className:"btn btn-playing",onClick:c,children:"stop"})]})},C=function(e){var t=e.onChange;return Object(p.jsxs)("div",{className:"manipulation-panel",children:[Object(p.jsx)("button",{className:"manipulation-btn btn btn-left",onClick:function(){return t(m.left)},children:"\u2190"}),Object(p.jsxs)("div",{children:[Object(p.jsx)("button",{className:"manipulation-btn btn btn-up",onClick:function(){return t(m.up)},children:"\u2191"}),Object(p.jsx)("button",{className:"manipulation-btn btn btn-down",onClick:function(){return t(m.down)},children:"\u2193"})]}),Object(p.jsx)("button",{className:"manipulation-btn btn btn-right",onClick:function(){return t(m.right)},children:"\u2192"})]})},w=n(3),F=n(4),S=n(7),D=function(e,t){var n=[t.nextPos].concat(Object(w.a)(e.body)),i=Object(w.a)(e.fields);switch(t.type){case"reset":return{body:[d],food:f,fields:l(u,d,f)};case"continue":var c=n.pop();return i[c.y][c.x]="",i[n[0].y][n[0].x]="snake",Object(S.a)(Object(S.a)({},e),{},{body:n,fields:i});case"newFood":return i[t.nextPos.y][t.nextPos.x]="snake",i[t.nextFood.y][t.nextFood.x]="food",{body:n,food:t.nextFood,fields:i};default:return e}},P=function(){i&&clearInterval(i)},z=function(){var e=Object(c.useReducer)(D,x),t=Object(F.a)(e,2),n=t[0],a=t[1],s=Object(c.useState)(h.init),o=Object(F.a)(s,2),l=o[0],d=o[1],f=Object(c.useState)(m.up),b=Object(F.a)(f,2),p=b[0],g=b[1],N=Object(c.useState)(3),k=Object(F.a)(N,2),C=k[0],S=k[1],z=Object(c.useCallback)((function(e){if(l!==h.playing)return p;v[p]!==e&&g(e)}),[p,l]),E=Object(c.useCallback)((function(e){l===h.init&&(e<1||e>j.length||S(e))}),[l]);return Object(c.useEffect)((function(){var e=function(e){var t=y[e.keyCode];t&&z(t)};return document.addEventListener("keydown",e),function(){return document.removeEventListener("keydown",e)}}),[z]),Object(c.useEffect)((function(){if(l===h.playing)return i=setInterval((function(){var e,t={x:n.body[0].x+O[p].x,y:n.body[0].y+O[p].y};if((e=t).y<0||e.x<0||e.y>u-1||e.x>u-1||function(e,t){return"snake"===e[t.y][t.x]}(n.fields,t))d(h.gameover);else if("food"===n.fields[t.y][t.x]){var i=r(u,[].concat(Object(w.a)(n.body),[t]));a({type:"newFood",nextPos:t,nextFood:i})}else a({type:"continue",nextPos:t})}),j[C-1]),P}),[n,l,p,C]),{state:n,difficulty:C,status:l,start:function(){return d(h.playing)},stop:function(){return d(h.suspended)},reload:function(){d(h.init),g(m.up),a({type:"reset"})},updateDirection:z,updateDifficulty:E}};var E=function(){var e=z(),t=e.state,n=e.difficulty,i=e.start,c=e.stop,a=e.reload,s=e.status,o=e.updateDirection,r=e.updateDifficulty;return Object(p.jsxs)("div",{className:"App",children:[Object(p.jsxs)("header",{className:"header",children:[Object(p.jsx)("div",{className:"title-container",children:Object(p.jsx)("h1",{className:"nav-title",children:"Snake Game"})}),Object(p.jsx)(g,{length:t.body.length,difficulty:n,onChangeDifficulty:r},"navigation")]}),Object(p.jsx)("main",{className:"main",children:Object(p.jsx)(N,{fields:t.fields})}),Object(p.jsxs)("footer",{className:"footer",children:[Object(p.jsx)(k,{status:s,onStart:i,onRestart:a,onStop:c}),Object(p.jsx)(C,{onChange:o})]})]})},L=function(e){e&&e instanceof Function&&n.e(3).then(n.bind(null,16)).then((function(t){var n=t.getCLS,i=t.getFID,c=t.getFCP,a=t.getLCP,s=t.getTTFB;n(e),i(e),c(e),a(e),s(e)}))};o.a.render(Object(p.jsx)(a.a.StrictMode,{children:Object(p.jsx)(E,{})}),document.getElementById("root")),L()}},[[15,1,2]]]);
//# sourceMappingURL=main.37b93ddd.chunk.js.map