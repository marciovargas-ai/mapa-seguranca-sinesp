var jw=Object.defineProperty,zw=Object.defineProperties;var Hw=Object.getOwnPropertyDescriptors;var _b=Object.getOwnPropertySymbols;var $w=Object.prototype.hasOwnProperty,Uw=Object.prototype.propertyIsEnumerable;var xb=(t,n,e)=>n in t?jw(t,n,{enumerable:!0,configurable:!0,writable:!0,value:e}):t[n]=e,I=(t,n)=>{for(var e in n||={})$w.call(n,e)&&xb(t,e,n[e]);if(_b)for(var e of _b(n))Uw.call(n,e)&&xb(t,e,n[e]);return t},W=(t,n)=>zw(t,Hw(n));var os=[null],Rc=[!1],zo=1,Gw=null,Ht=Symbol("SIGNAL");function de(t){let n=os[0];return os[0]=t,n}function Bc(){return os[0]}var $o={version:0,lastCleanEpoch:0,dirty:!1,producers:void 0,producersTail:void 0,consumers:void 0,consumersTail:void 0,recomputing:!1,consumerAllowSignalWrites:!1,consumerIsAlwaysLive:!1,kind:"unknown",producerMustRecompute:()=>!1,producerRecomputeValue:()=>{},consumerMarkedDirty:()=>{},consumerOnSignalRead:()=>{}};function ao(t){if(Rc[0])throw new Error("");let n=os[0];if(n===null)return;n.consumerOnSignalRead(t);let e=n.producersTail;if(e!==void 0&&e.producer===t)return;let i,o=n.recomputing;if(o&&(i=e!==void 0?e.nextProducer:n.producers,i!==void 0&&i.producer===t)){n.producersTail=i,i.lastReadVersion=t.version,i.knownValidAtEpoch=zo;return}let a=t.consumersTail;if(a!==void 0&&a.consumer===n&&(!o||a.knownValidAtEpoch===zo))return;let r=Ua(n),s={producer:t,consumer:n,nextProducer:i,prevConsumer:void 0,knownValidAtEpoch:zo,lastReadVersion:t.version,nextConsumer:void 0};n.producersTail=s,e!==void 0?e.nextProducer=s:n.producers=s,r&&Eb(t,s)}function Cb(){zo++}function as(t){if(!(Ua(t)&&!t.dirty)&&!(!t.dirty&&t.lastCleanEpoch===zo)){if(!t.producerMustRecompute(t)&&!$a(t)){Lc(t);return}t.producerRecomputeValue(t),Lc(t)}}function rm(t){if(t.consumers===void 0)return;let n=Rc[0];Rc[0]=!0;try{for(let e=t.consumers;e!==void 0;e=e.nextConsumer){let i=e.consumer;i.dirty||Ww(i)}}finally{Rc[0]=n}}function sm(){return os[0]?.consumerAllowSignalWrites!==!1}function Ww(t){t.dirty=!0,rm(t),t.consumerMarkedDirty?.(t)}function Lc(t){t.dirty=!1,t.lastCleanEpoch=zo}function ro(t){return t&&Sb(t),de(t)}function Sb(t){if(t.producersTail?.knownValidAtEpoch===zo){let n=t.producers;for(;n!==void 0;)n.knownValidAtEpoch=null,n=n.nextProducer}t.producersTail=void 0,t.recomputing=!0}function Uo(t,n){de(n),t&&wb(t)}function wb(t){t.recomputing=!1;let n=t.producersTail,e=n!==void 0?n.nextProducer:t.producers;if(e!==void 0){if(Ua(t))do e=cm(e);while(e!==void 0);n!==void 0?n.nextProducer=void 0:t.producers=void 0}}function $a(t){for(let n=t.producers;n!==void 0;n=n.nextProducer){let e=n.producer,i=n.lastReadVersion;if(i!==e.version||(as(e),i!==e.version))return!0}return!1}function so(t){if(Ua(t)){let n=t.producers;for(;n!==void 0;)n=cm(n)}t.producers=void 0,t.producersTail=void 0,t.consumers=void 0,t.consumersTail=void 0}function Eb(t,n){let e=t.consumersTail,i=Ua(t);if(e!==void 0?(n.nextConsumer=e.nextConsumer,e.nextConsumer=n):(n.nextConsumer=void 0,t.consumers=n),n.prevConsumer=e,t.consumersTail=n,!i)for(let o=t.producers;o!==void 0;o=o.nextProducer)Eb(o.producer,o)}function cm(t){let n=t.producer,e=t.nextProducer,i=t.nextConsumer,o=t.prevConsumer;if(t.nextConsumer=void 0,t.prevConsumer=void 0,i!==void 0?i.prevConsumer=o:n.consumersTail=o,o!==void 0)o.nextConsumer=i;else if(n.consumers=i,!Ua(n)){let a=n.producers;for(;a!==void 0;)a=cm(a)}return e}function Ua(t){return t.consumerIsAlwaysLive||t.consumers!==void 0}function Vc(t){Gw?.(t)}function jc(t,n){return Object.is(t,n)}function rs(t,n){let e=Object.create(qw);e.computation=t,n!==void 0&&(e.equal=n);let i=()=>{if(as(e),ao(e),e.value===Ho)throw e.error;return e.value};return i[Ht]=e,Vc(e),i}var Pc=Symbol("UNSET"),Fc=Symbol("COMPUTING"),Ho=Symbol("ERRORED"),qw=W(I({},$o),{value:Pc,dirty:!0,error:null,equal:jc,kind:"computed",producerMustRecompute(t){return t.value===Pc||t.value===Fc},producerRecomputeValue(t){if(t.value===Fc)throw new Error("");let n=t.value;t.value=Fc;let e=ro(t),i,o=!1;try{i=t.computation(),de(null),o=n!==Pc&&n!==Ho&&i!==Ho&&t.equal(n,i)}catch(a){i=Ho,t.error=a}finally{Uo(t,e)}if(o){t.value=n;return}t.value=i,t.version++}});function Yw(){throw new Error}var Db=Yw;function Mb(t){Db(t)}function lm(t){Db=t}var Zw=null;function dm(t,n){let e=Object.create(Ga);e.value=t,n!==void 0&&(e.equal=n);let i=()=>Ib(e);return i[Ht]=e,Vc(e),[i,r=>Go(e,r),r=>um(e,r)]}function Ib(t){return ao(t),t.value}function Go(t,n){sm()||Mb(t),t.equal(t.value,n)||(t.value=n,Kw(t))}function um(t,n){sm()||Mb(t),Go(t,n(t.value))}var Ga=W(I({},$o),{equal:jc,value:void 0,kind:"signal"});function Kw(t){t.version++,Cb(),rm(t),Zw?.(t)}var mm=W(I({},$o),{consumerIsAlwaysLive:!0,consumerAllowSignalWrites:!0,dirty:!0,kind:"effect"});function pm(t){if(t.dirty=!1,t.version>0&&!$a(t))return;t.version++;let n=ro(t);try{t.cleanup(),t.fn()}finally{Uo(t,n)}}var fm=[void 0];function zc(){return fm[0]}function mi(t){let n=fm[0];return fm[0]=t,n}var kb=Symbol("NotFound");function Wa(t){return t===kb||t?.name==="\u0275NotFound"}function Nb(t){let n=de(null);try{return t()}finally{de(n)}}function Ae(t){return typeof t=="function"}function Hc(t){let e=t(i=>{Error.call(i),i.stack=new Error().stack});return e.prototype=Object.create(Error.prototype),e.prototype.constructor=e,e}var $c=Hc(t=>function(e){t(this),this.message=e?`${e.length} errors occurred during unsubscription:
${e.map((i,o)=>`${o+1}) ${i.toString()}`).join(`
  `)}`:"",this.name="UnsubscriptionError",this.errors=e});function Wo(t,n){if(t){let e=t.indexOf(n);0<=e&&t.splice(e,1)}}var _e=class t{constructor(n){this.initialTeardown=n,this.closed=!1,this._parentage=null,this._finalizers=null}unsubscribe(){let n;if(!this.closed){this.closed=!0;let{_parentage:e}=this;if(e)if(this._parentage=null,Array.isArray(e))for(let a of e)a.remove(this);else e.remove(this);let{initialTeardown:i}=this;if(Ae(i))try{i()}catch(a){n=a instanceof $c?a.errors:[a]}let{_finalizers:o}=this;if(o){this._finalizers=null;for(let a of o)try{Tb(a)}catch(r){n=n??[],r instanceof $c?n=[...n,...r.errors]:n.push(r)}}if(n)throw new $c(n)}}add(n){var e;if(n&&n!==this)if(this.closed)Tb(n);else{if(n instanceof t){if(n.closed||n._hasParent(this))return;n._addParent(this)}(this._finalizers=(e=this._finalizers)!==null&&e!==void 0?e:[]).push(n)}}_hasParent(n){let{_parentage:e}=this;return e===n||Array.isArray(e)&&e.includes(n)}_addParent(n){let{_parentage:e}=this;this._parentage=Array.isArray(e)?(e.push(n),e):e?[e,n]:n}_removeParent(n){let{_parentage:e}=this;e===n?this._parentage=null:Array.isArray(e)&&Wo(e,n)}remove(n){let{_finalizers:e}=this;e&&Wo(e,n),n instanceof t&&n._removeParent(this)}};_e.EMPTY=(()=>{let t=new _e;return t.closed=!0,t})();var hm=_e.EMPTY;function Uc(t){return t instanceof _e||t&&"closed"in t&&Ae(t.remove)&&Ae(t.add)&&Ae(t.unsubscribe)}function Tb(t){Ae(t)?t():t.unsubscribe()}var Wn={onUnhandledError:null,onStoppedNotification:null,Promise:void 0,useDeprecatedSynchronousErrorHandling:!1,useDeprecatedNextContext:!1};var qa={setTimeout(t,n,...e){let{delegate:i}=qa;return i?.setTimeout?i.setTimeout(t,n,...e):setTimeout(t,n,...e)},clearTimeout(t){let{delegate:n}=qa;return(n?.clearTimeout||clearTimeout)(t)},delegate:void 0};function Gc(t){qa.setTimeout(()=>{let{onUnhandledError:n}=Wn;if(n)n(t);else throw t})}function qo(){}var Ab=gm("C",void 0,void 0);function Ob(t){return gm("E",void 0,t)}function Rb(t){return gm("N",t,void 0)}function gm(t,n,e){return{kind:t,value:n,error:e}}var Yo=null;function Ya(t){if(Wn.useDeprecatedSynchronousErrorHandling){let n=!Yo;if(n&&(Yo={errorThrown:!1,error:null}),t(),n){let{errorThrown:e,error:i}=Yo;if(Yo=null,e)throw i}}else t()}function Pb(t){Wn.useDeprecatedSynchronousErrorHandling&&Yo&&(Yo.errorThrown=!0,Yo.error=t)}var Zo=class extends _e{constructor(n){super(),this.isStopped=!1,n?(this.destination=n,Uc(n)&&n.add(this)):this.destination=Jw}static create(n,e,i){return new ki(n,e,i)}next(n){this.isStopped?vm(Rb(n),this):this._next(n)}error(n){this.isStopped?vm(Ob(n),this):(this.isStopped=!0,this._error(n))}complete(){this.isStopped?vm(Ab,this):(this.isStopped=!0,this._complete())}unsubscribe(){this.closed||(this.isStopped=!0,super.unsubscribe(),this.destination=null)}_next(n){this.destination.next(n)}_error(n){try{this.destination.error(n)}finally{this.unsubscribe()}}_complete(){try{this.destination.complete()}finally{this.unsubscribe()}}},Xw=Function.prototype.bind;function bm(t,n){return Xw.call(t,n)}var ym=class{constructor(n){this.partialObserver=n}next(n){let{partialObserver:e}=this;if(e.next)try{e.next(n)}catch(i){Wc(i)}}error(n){let{partialObserver:e}=this;if(e.error)try{e.error(n)}catch(i){Wc(i)}else Wc(n)}complete(){let{partialObserver:n}=this;if(n.complete)try{n.complete()}catch(e){Wc(e)}}},ki=class extends Zo{constructor(n,e,i){super();let o;if(Ae(n)||!n)o={next:n??void 0,error:e??void 0,complete:i??void 0};else{let a;this&&Wn.useDeprecatedNextContext?(a=Object.create(n),a.unsubscribe=()=>this.unsubscribe(),o={next:n.next&&bm(n.next,a),error:n.error&&bm(n.error,a),complete:n.complete&&bm(n.complete,a)}):o=n}this.destination=new ym(o)}};function Wc(t){Wn.useDeprecatedSynchronousErrorHandling?Pb(t):Gc(t)}function Qw(t){throw t}function vm(t,n){let{onStoppedNotification:e}=Wn;e&&qa.setTimeout(()=>e(t,n))}var Jw={closed:!0,next:qo,error:Qw,complete:qo};var Za=typeof Symbol=="function"&&Symbol.observable||"@@observable";function qn(t){return t}function Fb(t){return t.length===0?qn:t.length===1?t[0]:function(e){return t.reduce((i,o)=>o(i),e)}}var ge=class t{constructor(n){n&&(this._subscribe=n)}lift(n){let e=new t;return e.source=this,e.operator=n,e}subscribe(n,e,i){let o=tE(n)?n:new ki(n,e,i);return Ya(()=>{let{operator:a,source:r}=this;o.add(a?a.call(o,r):r?this._subscribe(o):this._trySubscribe(o))}),o}_trySubscribe(n){try{return this._subscribe(n)}catch(e){n.error(e)}}forEach(n,e){return e=Lb(e),new e((i,o)=>{let a=new ki({next:r=>{try{n(r)}catch(s){o(s),a.unsubscribe()}},error:o,complete:i});this.subscribe(a)})}_subscribe(n){var e;return(e=this.source)===null||e===void 0?void 0:e.subscribe(n)}[Za](){return this}pipe(...n){return Fb(n)(this)}toPromise(n){return n=Lb(n),new n((e,i)=>{let o;this.subscribe(a=>o=a,a=>i(a),()=>e(o))})}};ge.create=t=>new ge(t);function Lb(t){var n;return(n=t??Wn.Promise)!==null&&n!==void 0?n:Promise}function eE(t){return t&&Ae(t.next)&&Ae(t.error)&&Ae(t.complete)}function tE(t){return t&&t instanceof Zo||eE(t)&&Uc(t)}function nE(t){return Ae(t?.lift)}function Fe(t){return n=>{if(nE(n))return n.lift(function(e){try{return t(e,this)}catch(i){this.error(i)}});throw new TypeError("Unable to lift unknown Observable type")}}function Ve(t,n,e,i,o){return new _m(t,n,e,i,o)}var _m=class extends Zo{constructor(n,e,i,o,a,r){super(n),this.onFinalize=a,this.shouldUnsubscribe=r,this._next=e?function(s){try{e(s)}catch(c){n.error(c)}}:super._next,this._error=o?function(s){try{o(s)}catch(c){n.error(c)}finally{this.unsubscribe()}}:super._error,this._complete=i?function(){try{i()}catch(s){n.error(s)}finally{this.unsubscribe()}}:super._complete}unsubscribe(){var n;if(!this.shouldUnsubscribe||this.shouldUnsubscribe()){let{closed:e}=this;super.unsubscribe(),!e&&((n=this.onFinalize)===null||n===void 0||n.call(this))}}};var Bb=Hc(t=>function(){t(this),this.name="ObjectUnsubscribedError",this.message="object unsubscribed"});var B=class extends ge{constructor(){super(),this.closed=!1,this.currentObservers=null,this.observers=[],this.isStopped=!1,this.hasError=!1,this.thrownError=null}lift(n){let e=new qc(this,this);return e.operator=n,e}_throwIfClosed(){if(this.closed)throw new Bb}next(n){Ya(()=>{if(this._throwIfClosed(),!this.isStopped){this.currentObservers||(this.currentObservers=Array.from(this.observers));for(let e of this.currentObservers)e.next(n)}})}error(n){Ya(()=>{if(this._throwIfClosed(),!this.isStopped){this.hasError=this.isStopped=!0,this.thrownError=n;let{observers:e}=this;for(;e.length;)e.shift().error(n)}})}complete(){Ya(()=>{if(this._throwIfClosed(),!this.isStopped){this.isStopped=!0;let{observers:n}=this;for(;n.length;)n.shift().complete()}})}unsubscribe(){this.isStopped=this.closed=!0,this.observers=this.currentObservers=null}get observed(){var n;return((n=this.observers)===null||n===void 0?void 0:n.length)>0}_trySubscribe(n){return this._throwIfClosed(),super._trySubscribe(n)}_subscribe(n){return this._throwIfClosed(),this._checkFinalizedStatuses(n),this._innerSubscribe(n)}_innerSubscribe(n){let{hasError:e,isStopped:i,observers:o}=this;return e||i?hm:(this.currentObservers=null,o.push(n),new _e(()=>{this.currentObservers=null,Wo(o,n)}))}_checkFinalizedStatuses(n){let{hasError:e,thrownError:i,isStopped:o}=this;e?n.error(i):o&&n.complete()}asObservable(){let n=new ge;return n.source=this,n}};B.create=(t,n)=>new qc(t,n);var qc=class extends B{constructor(n,e){super(),this.destination=n,this.source=e}next(n){var e,i;(i=(e=this.destination)===null||e===void 0?void 0:e.next)===null||i===void 0||i.call(e,n)}error(n){var e,i;(i=(e=this.destination)===null||e===void 0?void 0:e.error)===null||i===void 0||i.call(e,n)}complete(){var n,e;(e=(n=this.destination)===null||n===void 0?void 0:n.complete)===null||e===void 0||e.call(n)}_subscribe(n){var e,i;return(i=(e=this.source)===null||e===void 0?void 0:e.subscribe(n))!==null&&i!==void 0?i:hm}};var co=class extends B{constructor(n){super(),this._value=n}get value(){return this.getValue()}_subscribe(n){let e=super._subscribe(n);return!e.closed&&n.next(this._value),e}getValue(){let{hasError:n,thrownError:e,_value:i}=this;if(n)throw e;return this._throwIfClosed(),i}next(n){super.next(this._value=n)}};var ss={now(){return(ss.delegate||Date).now()},delegate:void 0};var lo=class extends B{constructor(n=1/0,e=1/0,i=ss){super(),this._bufferSize=n,this._windowTime=e,this._timestampProvider=i,this._buffer=[],this._infiniteTimeWindow=!0,this._infiniteTimeWindow=e===1/0,this._bufferSize=Math.max(1,n),this._windowTime=Math.max(1,e)}next(n){let{isStopped:e,_buffer:i,_infiniteTimeWindow:o,_timestampProvider:a,_windowTime:r}=this;e||(i.push(n),!o&&i.push(a.now()+r)),this._trimBuffer(),super.next(n)}_subscribe(n){this._throwIfClosed(),this._trimBuffer();let e=this._innerSubscribe(n),{_infiniteTimeWindow:i,_buffer:o}=this,a=o.slice();for(let r=0;r<a.length&&!n.closed;r+=i?1:2)n.next(a[r]);return this._checkFinalizedStatuses(n),e}_trimBuffer(){let{_bufferSize:n,_timestampProvider:e,_buffer:i,_infiniteTimeWindow:o}=this,a=(o?1:2)*n;if(n<1/0&&a<i.length&&i.splice(0,i.length-a),!o){let r=e.now(),s=0;for(let c=1;c<i.length&&i[c]<=r;c+=2)s=c;s&&i.splice(0,s+1)}}};var Yc=class extends _e{constructor(n,e){super()}schedule(n,e=0){return this}};var cs={setInterval(t,n,...e){let{delegate:i}=cs;return i?.setInterval?i.setInterval(t,n,...e):setInterval(t,n,...e)},clearInterval(t){let{delegate:n}=cs;return(n?.clearInterval||clearInterval)(t)},delegate:void 0};var Zc=class extends Yc{constructor(n,e){super(n,e),this.scheduler=n,this.work=e,this.pending=!1}schedule(n,e=0){var i;if(this.closed)return this;this.state=n;let o=this.id,a=this.scheduler;return o!=null&&(this.id=this.recycleAsyncId(a,o,e)),this.pending=!0,this.delay=e,this.id=(i=this.id)!==null&&i!==void 0?i:this.requestAsyncId(a,this.id,e),this}requestAsyncId(n,e,i=0){return cs.setInterval(n.flush.bind(n,this),i)}recycleAsyncId(n,e,i=0){if(i!=null&&this.delay===i&&this.pending===!1)return e;e!=null&&cs.clearInterval(e)}execute(n,e){if(this.closed)return new Error("executing a cancelled action");this.pending=!1;let i=this._execute(n,e);if(i)return i;this.pending===!1&&this.id!=null&&(this.id=this.recycleAsyncId(this.scheduler,this.id,null))}_execute(n,e){let i=!1,o;try{this.work(n)}catch(a){i=!0,o=a||new Error("Scheduled action threw falsy error")}if(i)return this.unsubscribe(),o}unsubscribe(){if(!this.closed){let{id:n,scheduler:e}=this,{actions:i}=e;this.work=this.state=this.scheduler=null,this.pending=!1,Wo(i,this),n!=null&&(this.id=this.recycleAsyncId(e,n,null)),this.delay=null,super.unsubscribe()}}};var Ka=class t{constructor(n,e=t.now){this.schedulerActionCtor=n,this.now=e}schedule(n,e=0,i){return new this.schedulerActionCtor(this,n).schedule(i,e)}};Ka.now=ss.now;var Kc=class extends Ka{constructor(n,e=Ka.now){super(n,e),this.actions=[],this._active=!1}flush(n){let{actions:e}=this;if(this._active){e.push(n);return}let i;this._active=!0;do if(i=n.execute(n.state,n.delay))break;while(n=e.shift());if(this._active=!1,i){for(;n=e.shift();)n.unsubscribe();throw i}}};var Ko=new Kc(Zc),Vb=Ko;var Ni=new ge(t=>t.complete());function Xc(t){return t&&Ae(t.schedule)}function xm(t){return t[t.length-1]}function Qc(t){return Ae(xm(t))?t.pop():void 0}function pi(t){return Xc(xm(t))?t.pop():void 0}function jb(t,n){return typeof xm(t)=="number"?t.pop():n}function Hb(t,n,e,i){function o(a){return a instanceof e?a:new e(function(r){r(a)})}return new(e||(e=Promise))(function(a,r){function s(l){try{d(i.next(l))}catch(m){r(m)}}function c(l){try{d(i.throw(l))}catch(m){r(m)}}function d(l){l.done?a(l.value):o(l.value).then(s,c)}d((i=i.apply(t,n||[])).next())})}function zb(t){var n=typeof Symbol=="function"&&Symbol.iterator,e=n&&t[n],i=0;if(e)return e.call(t);if(t&&typeof t.length=="number")return{next:function(){return t&&i>=t.length&&(t=void 0),{value:t&&t[i++],done:!t}}};throw new TypeError(n?"Object is not iterable.":"Symbol.iterator is not defined.")}function Xo(t){return this instanceof Xo?(this.v=t,this):new Xo(t)}function $b(t,n,e){if(!Symbol.asyncIterator)throw new TypeError("Symbol.asyncIterator is not defined.");var i=e.apply(t,n||[]),o,a=[];return o=Object.create((typeof AsyncIterator=="function"?AsyncIterator:Object).prototype),s("next"),s("throw"),s("return",r),o[Symbol.asyncIterator]=function(){return this},o;function r(g){return function(y){return Promise.resolve(y).then(g,m)}}function s(g,y){i[g]&&(o[g]=function(_){return new Promise(function(C,w){a.push([g,_,C,w])>1||c(g,_)})},y&&(o[g]=y(o[g])))}function c(g,y){try{d(i[g](y))}catch(_){v(a[0][3],_)}}function d(g){g.value instanceof Xo?Promise.resolve(g.value.v).then(l,m):v(a[0][2],g)}function l(g){c("next",g)}function m(g){c("throw",g)}function v(g,y){g(y),a.shift(),a.length&&c(a[0][0],a[0][1])}}function Ub(t){if(!Symbol.asyncIterator)throw new TypeError("Symbol.asyncIterator is not defined.");var n=t[Symbol.asyncIterator],e;return n?n.call(t):(t=typeof zb=="function"?zb(t):t[Symbol.iterator](),e={},i("next"),i("throw"),i("return"),e[Symbol.asyncIterator]=function(){return this},e);function i(a){e[a]=t[a]&&function(r){return new Promise(function(s,c){r=t[a](r),o(s,c,r.done,r.value)})}}function o(a,r,s,c){Promise.resolve(c).then(function(d){a({value:d,done:s})},r)}}var Jc=(t=>t&&typeof t.length=="number"&&typeof t!="function");function el(t){return Ae(t?.then)}function tl(t){return Ae(t[Za])}function nl(t){return Symbol.asyncIterator&&Ae(t?.[Symbol.asyncIterator])}function il(t){return new TypeError(`You provided ${t!==null&&typeof t=="object"?"an invalid object":`'${t}'`} where a stream was expected. You can provide an Observable, Promise, ReadableStream, Array, AsyncIterable, or Iterable.`)}function iE(){return typeof Symbol!="function"||!Symbol.iterator?"@@iterator":Symbol.iterator}var ol=iE();function al(t){return Ae(t?.[ol])}function rl(t){return $b(this,arguments,function*(){let e=t.getReader();try{for(;;){let{value:i,done:o}=yield Xo(e.read());if(o)return yield Xo(void 0);yield yield Xo(i)}}finally{e.releaseLock()}})}function sl(t){return Ae(t?.getReader)}function nt(t){if(t instanceof ge)return t;if(t!=null){if(tl(t))return oE(t);if(Jc(t))return aE(t);if(el(t))return rE(t);if(nl(t))return Gb(t);if(al(t))return sE(t);if(sl(t))return cE(t)}throw il(t)}function oE(t){return new ge(n=>{let e=t[Za]();if(Ae(e.subscribe))return e.subscribe(n);throw new TypeError("Provided object does not correctly implement Symbol.observable")})}function aE(t){return new ge(n=>{for(let e=0;e<t.length&&!n.closed;e++)n.next(t[e]);n.complete()})}function rE(t){return new ge(n=>{t.then(e=>{n.closed||(n.next(e),n.complete())},e=>n.error(e)).then(null,Gc)})}function sE(t){return new ge(n=>{for(let e of t)if(n.next(e),n.closed)return;n.complete()})}function Gb(t){return new ge(n=>{lE(t,n).catch(e=>n.error(e))})}function cE(t){return Gb(rl(t))}function lE(t,n){var e,i,o,a;return Hb(this,void 0,void 0,function*(){try{for(e=Ub(t);i=yield e.next(),!i.done;){let r=i.value;if(n.next(r),n.closed)return}}catch(r){o={error:r}}finally{try{i&&!i.done&&(a=e.return)&&(yield a.call(e))}finally{if(o)throw o.error}}n.complete()})}function yn(t,n,e,i=0,o=!1){let a=n.schedule(function(){e(),o?t.add(this.schedule(null,i)):this.unsubscribe()},i);if(t.add(a),!o)return a}function cl(t,n=0){return Fe((e,i)=>{e.subscribe(Ve(i,o=>yn(i,t,()=>i.next(o),n),()=>yn(i,t,()=>i.complete(),n),o=>yn(i,t,()=>i.error(o),n)))})}function ll(t,n=0){return Fe((e,i)=>{i.add(t.schedule(()=>e.subscribe(i),n))})}function Wb(t,n){return nt(t).pipe(ll(n),cl(n))}function qb(t,n){return nt(t).pipe(ll(n),cl(n))}function Yb(t,n){return new ge(e=>{let i=0;return n.schedule(function(){i===t.length?e.complete():(e.next(t[i++]),e.closed||this.schedule())})})}function Zb(t,n){return new ge(e=>{let i;return yn(e,n,()=>{i=t[ol](),yn(e,n,()=>{let o,a;try{({value:o,done:a}=i.next())}catch(r){e.error(r);return}a?e.complete():e.next(o)},0,!0)}),()=>Ae(i?.return)&&i.return()})}function dl(t,n){if(!t)throw new Error("Iterable cannot be null");return new ge(e=>{yn(e,n,()=>{let i=t[Symbol.asyncIterator]();yn(e,n,()=>{i.next().then(o=>{o.done?e.complete():e.next(o.value)})},0,!0)})})}function Kb(t,n){return dl(rl(t),n)}function Xb(t,n){if(t!=null){if(tl(t))return Wb(t,n);if(Jc(t))return Yb(t,n);if(el(t))return qb(t,n);if(nl(t))return dl(t,n);if(al(t))return Zb(t,n);if(sl(t))return Kb(t,n)}throw il(t)}function kn(t,n){return n?Xb(t,n):nt(t)}function Nt(...t){let n=pi(t);return kn(t,n)}function Cm(t,n){let e=Ae(t)?t:()=>t,i=o=>o.error(e());return new ge(n?o=>n.schedule(i,0,o):i)}function Qb(t){return t instanceof Date&&!isNaN(t)}function je(t,n){return Fe((e,i)=>{let o=0;e.subscribe(Ve(i,a=>{i.next(t.call(n,a,o++))}))})}var{isArray:dE}=Array;function uE(t,n){return dE(n)?t(...n):t(n)}function ul(t){return je(n=>uE(t,n))}var{isArray:mE}=Array,{getPrototypeOf:pE,prototype:fE,keys:hE}=Object;function ml(t){if(t.length===1){let n=t[0];if(mE(n))return{args:n,keys:null};if(gE(n)){let e=hE(n);return{args:e.map(i=>n[i]),keys:e}}}return{args:t,keys:null}}function gE(t){return t&&typeof t=="object"&&pE(t)===fE}function pl(t,n){return t.reduce((e,i,o)=>(e[i]=n[o],e),{})}function Sm(...t){let n=pi(t),e=Qc(t),{args:i,keys:o}=ml(t);if(i.length===0)return kn([],n);let a=new ge(bE(i,n,o?r=>pl(o,r):qn));return e?a.pipe(ul(e)):a}function bE(t,n,e=qn){return i=>{Jb(n,()=>{let{length:o}=t,a=new Array(o),r=o,s=o;for(let c=0;c<o;c++)Jb(n,()=>{let d=kn(t[c],n),l=!1;d.subscribe(Ve(i,m=>{a[c]=m,l||(l=!0,s--),s||i.next(e(a.slice()))},()=>{--r||i.complete()}))},i)},i)}}function Jb(t,n,e){t?yn(e,t,n):n()}function ev(t,n,e,i,o,a,r,s){let c=[],d=0,l=0,m=!1,v=()=>{m&&!c.length&&!d&&n.complete()},g=_=>d<i?y(_):c.push(_),y=_=>{a&&n.next(_),d++;let C=!1;nt(e(_,l++)).subscribe(Ve(n,w=>{o?.(w),a?g(w):n.next(w)},()=>{C=!0},void 0,()=>{if(C)try{for(d--;c.length&&d<i;){let w=c.shift();r?yn(n,r,()=>y(w)):y(w)}v()}catch(w){n.error(w)}}))};return t.subscribe(Ve(n,g,()=>{m=!0,v()})),()=>{s?.()}}function uo(t,n,e=1/0){return Ae(n)?uo((i,o)=>je((a,r)=>n(i,a,o,r))(nt(t(i,o))),e):(typeof n=="number"&&(e=n),Fe((i,o)=>ev(i,o,t,e)))}function fl(t=1/0){return uo(qn,t)}function tv(){return fl(1)}function mo(...t){return tv()(kn(t,pi(t)))}function Ti(t){return new ge(n=>{nt(t()).subscribe(n)})}function ls(...t){let n=Qc(t),{args:e,keys:i}=ml(t),o=new ge(a=>{let{length:r}=e;if(!r){a.complete();return}let s=new Array(r),c=r,d=r;for(let l=0;l<r;l++){let m=!1;nt(e[l]).subscribe(Ve(a,v=>{m||(m=!0,d--),s[l]=v},()=>c--,void 0,()=>{(!c||!m)&&(d||a.next(i?pl(i,s):s),a.complete())}))}});return n?o.pipe(ul(n)):o}function Qo(t=0,n,e=Vb){let i=-1;return n!=null&&(Xc(n)?e=n:i=n),new ge(o=>{let a=Qb(t)?+t-e.now():t;a<0&&(a=0);let r=0;return e.schedule(function(){o.closed||(o.next(r++),0<=i?this.schedule(void 0,i):o.complete())},a)})}function bt(...t){let n=pi(t),e=jb(t,1/0),i=t;return i.length?i.length===1?nt(i[0]):fl(e)(kn(i,n)):Ni}function Ze(t,n){return Fe((e,i)=>{let o=0;e.subscribe(Ve(i,a=>t.call(n,a,o++)&&i.next(a)))})}function nv(t){return Fe((n,e)=>{let i=!1,o=null,a=null,r=!1,s=()=>{if(a?.unsubscribe(),a=null,i){i=!1;let d=o;o=null,e.next(d)}r&&e.complete()},c=()=>{a=null,r&&e.complete()};n.subscribe(Ve(e,d=>{i=!0,o=d,a||nt(t(d)).subscribe(a=Ve(e,s,c))},()=>{r=!0,(!i||!a||a.closed)&&e.complete()}))})}function hl(t,n=Ko){return nv(()=>Qo(t,n))}function gl(t){return Fe((n,e)=>{let i=null,o=!1,a;i=n.subscribe(Ve(e,void 0,void 0,r=>{a=nt(t(r,gl(t)(n))),i?(i.unsubscribe(),i=null,a.subscribe(e)):o=!0})),o&&(i.unsubscribe(),i=null,a.subscribe(e))})}function wm(t,n){return Ae(n)?uo(t,n,1):uo(t,1)}function Ai(t,n=Ko){return Fe((e,i)=>{let o=null,a=null,r=null,s=()=>{if(o){o.unsubscribe(),o=null;let d=a;a=null,i.next(d)}};function c(){let d=r+t,l=n.now();if(l<d){o=this.schedule(void 0,d-l),i.add(o);return}s()}e.subscribe(Ve(i,d=>{a=d,r=n.now(),o||(o=n.schedule(c,t),i.add(o))},()=>{s(),i.complete()},void 0,()=>{a=o=null}))})}function Ft(t){return t<=0?()=>Ni:Fe((n,e)=>{let i=0;n.subscribe(Ve(e,o=>{++i<=t&&(e.next(o),t<=i&&e.complete())}))})}function iv(){return Fe((t,n)=>{t.subscribe(Ve(n,qo))})}function ov(t){return je(()=>t)}function Em(t,n){return n?e=>mo(n.pipe(Ft(1),iv()),e.pipe(Em(t))):uo((e,i)=>nt(t(e,i)).pipe(Ft(1),ov(e)))}function Dm(t,n=Ko){let e=Qo(t,n);return Em(()=>e)}function bl(t,n=qn){return t=t??vE,Fe((e,i)=>{let o,a=!0;e.subscribe(Ve(i,r=>{let s=n(r);(a||!t(o,s))&&(a=!1,o=s,i.next(r))}))})}function vE(t,n){return t===n}function ds(t){return Fe((n,e)=>{try{n.subscribe(e)}finally{e.add(t)}})}function vl(){return Fe((t,n)=>{let e,i=!1;t.subscribe(Ve(n,o=>{let a=e;e=o,i&&n.next([a,o]),i=!0}))})}function us(t={}){let{connector:n=()=>new B,resetOnError:e=!0,resetOnComplete:i=!0,resetOnRefCountZero:o=!0}=t;return a=>{let r,s,c,d=0,l=!1,m=!1,v=()=>{s?.unsubscribe(),s=void 0},g=()=>{v(),r=c=void 0,l=m=!1},y=()=>{let _=r;g(),_?.unsubscribe()};return Fe((_,C)=>{d++,!m&&!l&&v();let w=c=c??n();C.add(()=>{d--,d===0&&!m&&!l&&(s=Mm(y,o))}),w.subscribe(C),!r&&d>0&&(r=new ki({next:E=>w.next(E),error:E=>{m=!0,v(),s=Mm(g,e,E),w.error(E)},complete:()=>{l=!0,v(),s=Mm(g,i),w.complete()}}),nt(_).subscribe(r))})(a)}}function Mm(t,n,...e){if(n===!0){t();return}if(n===!1)return;let i=new ki({next:()=>{i.unsubscribe(),t()}});return nt(n(...e)).subscribe(i)}function yl(t,n,e){let i,o=!1;return t&&typeof t=="object"?{bufferSize:i=1/0,windowTime:n=1/0,refCount:o=!1,scheduler:e}=t:i=t??1/0,us({connector:()=>new lo(i,n,e),resetOnError:!0,resetOnComplete:!1,resetOnRefCountZero:o})}function Jo(t){return Ze((n,e)=>t<=e)}function st(...t){let n=pi(t);return Fe((e,i)=>{(n?mo(t,e,n):mo(t,e)).subscribe(i)})}function Kt(t,n){return Fe((e,i)=>{let o=null,a=0,r=!1,s=()=>r&&!o&&i.complete();e.subscribe(Ve(i,c=>{o?.unsubscribe();let d=0,l=a++;nt(t(c,l)).subscribe(o=Ve(i,m=>i.next(n?n(c,m,l,d++):m),()=>{o=null,s()}))},()=>{r=!0,s()}))})}function Re(t){return Fe((n,e)=>{nt(t).subscribe(Ve(e,()=>e.complete(),qo)),!e.closed&&n.subscribe(e)})}function Im(t,n=!1){return Fe((e,i)=>{let o=0;e.subscribe(Ve(i,a=>{let r=t(a,o++);(r||n)&&i.next(a),!r&&i.complete()}))})}function Oi(t,n,e){let i=Ae(t)||n||e?{next:t,error:n,complete:e}:t;return i?Fe((o,a)=>{var r;(r=i.subscribe)===null||r===void 0||r.call(i);let s=!0;o.subscribe(Ve(a,c=>{var d;(d=i.next)===null||d===void 0||d.call(i,c),a.next(c)},()=>{var c;s=!1,(c=i.complete)===null||c===void 0||c.call(i),a.complete()},c=>{var d;s=!1,(d=i.error)===null||d===void 0||d.call(i,c),a.error(c)},()=>{var c,d;s&&((c=i.unsubscribe)===null||c===void 0||c.call(i)),(d=i.finalize)===null||d===void 0||d.call(i)}))}):qn}var Hm="https://angular.dev/best-practices/security#preventing-cross-site-scripting-xss",te=class extends Error{code;constructor(n,e){super(Li(n,e)),this.code=n}};function yE(t){return`NG0${Math.abs(t)}`}function Li(t,n){return`${yE(t)}${n?": "+n:""}`}function ct(t){for(let n in t)if(t[n]===ct)return n;throw Error("")}function lv(t,n){for(let e in n)Object.hasOwn(n,e)&&!Object.hasOwn(t,e)&&(t[e]=n[e])}function Dl(t){if(typeof t=="string")return t;if(Array.isArray(t))return`[${t.map(Dl).join(", ")}]`;if(t==null)return""+t;let n=t.overriddenName||t.name;if(n)return`${n}`;let e=t.toString();if(e==null)return""+e;let i=e.indexOf(`
`);return i>=0?e.slice(0,i):e}function Ml(t,n){return t?n?`${t} ${n}`:t:n||""}var _E=ct({__forward_ref__:ct});function $t(t){return t.__forward_ref__=$t,t}function Xt(t){return $m(t)?t():t}function $m(t){return typeof t=="function"&&Object.hasOwn(t,_E)&&t.__forward_ref__===$t}function Le(t){return{token:t.token,providedIn:t.providedIn||null,factory:t.factory,value:void 0}}function se(t){return{providers:t.providers||[],imports:t.imports||[]}}function Il(t){return xE(t,kl)}function xE(t,n){return Object.hasOwn(t,n)&&t[n]||null}function CE(t){let n=t?.[kl]??null;return n||null}function Nm(t){return t&&Object.hasOwn(t,xl)?t[xl]:null}var kl=ct({\u0275prov:ct}),xl=ct({\u0275inj:ct}),D=class{_desc;ngMetadataName="InjectionToken";\u0275prov;constructor(n,e){this._desc=n,this.\u0275prov=void 0,typeof e=="number"?this.__NG_ELEMENT_ID__=e:e!==void 0&&(this.\u0275prov=Le({token:this,providedIn:e.providedIn||"root",factory:e.factory}))}get multi(){return this}toString(){return`InjectionToken ${this._desc}`}};function Um(t){return t&&!!t.\u0275providers}var bs=ct({\u0275cmp:ct}),vs=ct({\u0275dir:ct}),Gm=ct({\u0275pipe:ct});var ps=ct({\u0275fac:ct}),aa=ct({__NG_ELEMENT_ID__:ct}),av=ct({__NG_ENV_ID__:ct});function po(t){return Wm(t,"@Component"),t[bs]||null}function Nl(t){return Wm(t,"@Directive"),t[vs]||null}function dv(t){return Wm(t,"@Pipe"),t[Gm]||null}function Wm(t,n){if(t==null)throw new te(-919,!1)}function Sn(t){return typeof t=="string"?t:t==null?"":String(t)}var uv=ct({ngErrorCode:ct}),SE=ct({ngErrorMessage:ct}),wE=ct({ngTokenPath:ct});function qm(t,n){return mv("",-200,n)}function Tl(t,n){throw new te(-201,!1)}function mv(t,n,e){let i=new te(n,t);return i[uv]=n,i[SE]=t,e&&(i[wE]=e),i}function EE(t){return t[uv]}var Tm;function pv(){return Tm}function Cn(t){let n=Tm;return Tm=t,n}function Ym(t,n,e){let i=Il(t);if(i&&i.providedIn=="root")return i.value===void 0?i.value=i.factory():i.value;if(e&8)return null;if(n!==void 0)return n;Tl(t,"")}var Ja=globalThis;var DE={},ea=DE,ME="__NG_DI_FLAG__",Am=class{injector;constructor(n){this.injector=n}retrieve(n,e){let i=ta(e)||0;try{return this.injector.get(n,i&8?null:ea,i)}catch(o){if(Wa(o))return o;throw o}}};function IE(t,n=0){let e=zc();if(e===void 0)throw new te(-203,!1);if(e===null)return Ym(t,void 0,n);{let i=kE(n),o=e.retrieve(t,i);if(Wa(o)){if(i.optional)return null;throw o}return o}}function be(t,n=0){return(pv()||IE)(Xt(t),n)}function p(t,n){return be(t,ta(n))}function ta(t){return typeof t>"u"||typeof t=="number"?t:0|(t.optional&&8)|(t.host&&1)|(t.self&&2)|(t.skipSelf&&4)}function kE(t){return{optional:!!(t&8),host:!!(t&1),self:!!(t&2),skipSelf:!!(t&4)}}function Om(t){let n=[];for(let e=0;e<t.length;e++){let i=Xt(t[e]);if(Array.isArray(i)){if(i.length===0)throw new te(900,!1);let o,a=0;for(let r=0;r<i.length;r++){let s=i[r],c=NE(s);typeof c=="number"?c===-1?o=s.token:a|=c:o=s}n.push(be(o,a))}else n.push(be(i))}return n}function NE(t){return t[ME]}function na(t,n){let e=Object.hasOwn(t,ps);return e?t[ps]:null}function fv(t,n,e){if(t.length!==n.length)return!1;for(let i=0;i<t.length;i++){let o=t[i],a=n[i];if(e&&(o=e(o),a=e(a)),a!==o)return!1}return!0}function hv(t){return t.flat(Number.POSITIVE_INFINITY)}function Al(t,n){t.forEach(e=>Array.isArray(e)?Al(e,n):n(e))}function Zm(t,n,e){n>=t.length?t.push(e):t.splice(n,0,e)}function ys(t,n){return n>=t.length-1?t.pop():t.splice(n,1)[0]}function gv(t,n){let e=[];for(let i=0;i<t;i++)e.push(n);return e}function bv(t,n,e,i){let o=t.length;if(o==n)t.push(e,i);else if(o===1)t.push(i,t[0]),t[0]=e;else{for(o--,t.push(t[o-1],t[o]);o>n;){let a=o-2;t[o]=t[a],o--}t[n]=e,t[n+1]=i}}function Ol(t,n,e){let i=er(t,n);return i>=0?t[i|1]=e:(i=~i,bv(t,i,n,e)),i}function Rl(t,n){let e=er(t,n);if(e>=0)return t[e|1]}function er(t,n){return TE(t,n,1)}function TE(t,n,e){let i=0,o=t.length>>e;for(;o!==i;){let a=i+(o-i>>1),r=t[a<<e];if(n===r)return a<<e;r>n?o=a:i=a+1}return~(o<<e)}var fo={},sn=[],ra=new D(""),Km=new D("",-1),Xm=new D(""),Qa=class{get(n,e=ea){if(e===ea){let o=mv("",-201);throw o.name="\u0275NotFound",o}return e}};function Bi(t){return{\u0275providers:t}}function vv(t){return Bi([{provide:ra,multi:!0,useValue:t}])}function yv(...t){return{\u0275providers:Qm(!0,t),\u0275fromNgModule:!0}}function Qm(t,...n){let e=[],i=new Set,o,a=r=>{e.push(r)};return Al(n,r=>{let s=r;Cl(s,a,[],i)&&(o||=[],o.push(s))}),o!==void 0&&_v(o,a),e}function _v(t,n){for(let e=0;e<t.length;e++){let{ngModule:i,providers:o}=t[e];Jm(o,a=>{n(a,i)})}}function Cl(t,n,e,i){if(t=Xt(t),!t)return!1;let o=null,a=Nm(t),r=!a&&po(t);if(!a&&!r){let c=t.ngModule;if(a=Nm(c),a)o=c;else return!1}else{if(r&&!r.standalone)return!1;o=t}let s=i.has(o);if(r){if(s)return!1;if(i.add(o),r.dependencies){let c=typeof r.dependencies=="function"?r.dependencies():r.dependencies;for(let d of c)Cl(d,n,e,i)}}else if(a){if(a.imports!=null&&!s){i.add(o);let d;Al(a.imports,l=>{Cl(l,n,e,i)&&(d||=[],d.push(l))}),d!==void 0&&_v(d,n)}if(!s){let d=na(o)||(()=>new o);n({provide:o,useFactory:d,deps:sn},o),n({provide:Xm,useValue:o,multi:!0},o),n({provide:ra,useValue:()=>be(o),multi:!0},o)}let c=a.providers;if(c!=null&&!s){let d=t;Jm(c,l=>{n(l,d)})}}else return!1;return o!==t&&t.providers!==void 0}function Jm(t,n){for(let e of t)Um(e)&&(e=e.\u0275providers),Array.isArray(e)?Jm(e,n):n(e)}var AE=ct({provide:String,useValue:ct});function xv(t){return t!==null&&typeof t=="object"&&AE in t}function OE(t){return!!(t&&t.useExisting)}function RE(t){return!!(t&&t.useFactory)}function ia(t){return typeof t=="function"}function Cv(t){return!!t.useClass}var _s=new D(""),_l={},rv={},km;function tr(){return km===void 0&&(km=new Qa),km}var xt=class{},oa=class extends xt{parent;source;scopes;records=new Map;_ngOnDestroyHooks=new Set;_onDestroyHooks=[];get destroyed(){return this._destroyed}_destroyed=!1;injectorDefTypes;constructor(n,e,i,o){super(),this.parent=e,this.source=i,this.scopes=o,Pm(n,r=>this.processProvider(r)),this.records.set(Km,Xa(void 0,this)),o.has("environment")&&this.records.set(xt,Xa(void 0,this));let a=this.records.get(_s);a!=null&&typeof a.value=="string"&&this.scopes.add(a.value),this.injectorDefTypes=new Set(this.get(Xm,sn,{self:!0}))}retrieve(n,e){let i=ta(e)||0;try{return this.get(n,ea,i)}catch(o){if(Wa(o))return o;throw o}}destroy(){ms(this),this._destroyed=!0;let n=de(null);try{for(let i of this._ngOnDestroyHooks)i.ngOnDestroy();let e=this._onDestroyHooks;this._onDestroyHooks=[];for(let i of e)i()}finally{this.records.clear(),this._ngOnDestroyHooks.clear(),this.injectorDefTypes.clear(),de(n)}}onDestroy(n){return ms(this),this._onDestroyHooks.push(n),()=>this.removeOnDestroy(n)}runInContext(n){ms(this);let e=mi(this),i=Cn(void 0),o;try{return n()}finally{mi(e),Cn(i)}}get(n,e=ea,i){if(ms(this),Object.hasOwn(n,av))return n[av](this);let o=ta(i),a,r=mi(this),s=Cn(void 0);try{if(!(o&4)){let d=this.records.get(n);if(d===void 0){let l=VE(n)&&Il(n);l&&this.injectableDefInScope(l)?d=Xa(Rm(n),_l):d=null,this.records.set(n,d)}if(d!=null)return this.hydrate(n,d,o)}let c=o&2?tr():this.parent;return e=o&8&&e===ea?null:e,c.get(n,e)}catch(c){let d=EE(c);throw d===-200||d===-201?new te(d,null):c}finally{Cn(s),mi(r)}}resolveInjectorInitializers(){let n=de(null),e=mi(this),i=Cn(void 0),o;try{let a=this.get(ra,sn,{self:!0});for(let r of a)r()}finally{mi(e),Cn(i),de(n)}}toString(){return"R3Injector[...]"}processProvider(n){n=Xt(n);let e=ia(n)?n:Xt(n&&n.provide),i=FE(n);if(!ia(n)&&n.multi===!0){let o=this.records.get(e);o||(o=Xa(void 0,_l,!0),o.factory=()=>Om(o.multi),this.records.set(e,o)),e=n,o.multi.push(n)}this.records.set(e,i)}hydrate(n,e,i){let o=de(null);try{if(e.value===rv)throw qm("");return e.value===_l&&(e.value=rv,e.value=e.factory(void 0,i)),typeof e.value=="object"&&e.value&&BE(e.value)&&this._ngOnDestroyHooks.add(e.value),e.value}finally{de(o)}}injectableDefInScope(n){if(!n.providedIn)return!1;let e=Xt(n.providedIn);return typeof e=="string"?e==="any"||this.scopes.has(e):this.injectorDefTypes.has(e)}removeOnDestroy(n){let e=this._onDestroyHooks.indexOf(n);e!==-1&&this._onDestroyHooks.splice(e,1)}};function Rm(t){let n=Il(t),e=n!==null?n.factory:na(t);if(e!==null)return e;if(t instanceof D)throw new te(-204,!1);if(t instanceof Function)return PE(t);throw new te(-204,!1)}function PE(t){if(t.length>0)throw new te(-204,!1);let e=CE(t);return e!==null?()=>e.factory(t):()=>new t}function FE(t){if(xv(t))return Xa(void 0,t.useValue);{let n=ep(t);return Xa(n,_l)}}function ep(t,n,e){let i;if(ia(t)){let o=Xt(t);return na(o)||Rm(o)}else if(xv(t))i=()=>Xt(t.useValue);else if(RE(t))i=()=>t.useFactory(...Om(t.deps||[]));else if(OE(t))i=(o,a)=>be(Xt(t.useExisting),a!==void 0&&a&8?8:void 0);else{let o=Xt(t&&(t.useClass||t.provide));if(LE(t))i=()=>new o(...Om(t.deps));else return na(o)||Rm(o)}return i}function ms(t){if(t.destroyed)throw new te(-205,!1)}function Xa(t,n,e=!1){return{factory:t,value:n,multi:e?[]:void 0}}function LE(t){return!!t.deps}function BE(t){return t!==null&&typeof t=="object"&&typeof t.ngOnDestroy=="function"}function VE(t){return typeof t=="function"||typeof t=="object"&&t.ngMetadataName==="InjectionToken"}function Pm(t,n){for(let e of t)Array.isArray(e)?Pm(e,n):e&&Um(e)?Pm(e.\u0275providers,n):n(e)}function nr(t,n){let e;t instanceof oa?(ms(t),e=t):e=new Am(t);let i,o=mi(e),a=Cn(void 0);try{return n()}finally{mi(o),Cn(a)}}function Sv(){return pv()!==void 0||zc()!=null}var Yn=0,he=1,ve=2,Tt=3,Nn=4,Qt=5,sa=6,ir=7,Ct=8,Vi=9,Zn=10,mt=11,or=12,tp=13,ho=14,ln=15,go=16,ca=17,hi=18,xs=19,np=20,Ri=21,Pl=22,Pi=23,wn=24,la=25,wv=26,ar=27,yt=28,Ev=1,ip=6,da=7,Cs=8,ua=9,St=10;function ji(t){return Array.isArray(t)&&typeof t[Ev]=="object"}function Tn(t){return Array.isArray(t)&&t[Ev]===!0}function op(t){return(t.flags&4)!==0}function gi(t){return t.componentOffset>-1}function Ss(t){return(t.flags&1)===1}function bi(t){return!!t.template}function rr(t){return(t[ve]&512)!==0}function ma(t){return(t[ve]&256)===256}var Ut=(function(t){return t[t.NONE=0]="NONE",t[t.HTML=1]="HTML",t[t.STYLE=2]="STYLE",t[t.SCRIPT=3]="SCRIPT",t[t.URL=4]="URL",t[t.RESOURCE_URL=5]="RESOURCE_URL",t[t.ATTRIBUTE_NO_BINDING=6]="ATTRIBUTE_NO_BINDING",t})(Ut||{});var ap="svg",Dv="math";function Jt(t){for(;Array.isArray(t);)t=t[Yn];return t}function rp(t,n){return Jt(n[t])}function An(t,n){return Jt(n[t.index])}function Fl(t,n){return t.data[n]}function sp(t,n){return t[n]}function Ll(t,n,e,i){e>=t.data.length&&(t.data[e]=null,t.blueprint[e]=null),n[e]=i}function On(t,n){let e=n[t];return ji(e)?e:e[Yn]}function Mv(t){return(t[ve]&4)===4}function Bl(t){return(t[ve]&128)===128}function Iv(t){return Tn(t[Tt])}function En(t,n){return n==null?null:t[n]}function cp(t){t[ca]=0}function lp(t){t[ve]&1024||(t[ve]|=1024,Bl(t)&&pa(t))}function kv(t,n){for(;t>0;)n=n[ho],t--;return n}function ws(t){return!!(t[ve]&9216||t[wn]?.dirty)}function Vl(t){t[Zn].changeDetectionScheduler?.notify(8),t[ve]&64&&(t[ve]|=1024),ws(t)&&pa(t)}function pa(t){t[Zn].changeDetectionScheduler?.notify(0);let n=Fi(t);for(;n!==null&&!(n[ve]&8192||(n[ve]|=8192,!Bl(n)));)n=Fi(n)}function jl(t,n){if(ma(t))throw new te(911,!1);t[Ri]===null&&(t[Ri]=[]),t[Ri].push(n)}function Nv(t,n){if(t[Ri]===null)return;let e=t[Ri].indexOf(n);e!==-1&&t[Ri].splice(e,1)}function Fi(t){let n=t[Tt];return Tn(n)?n[Tt]:n}function dp(t){return t[ir]??=[]}function up(t){return t.cleanup??=[]}function Tv(t,n,e,i){let o=dp(n);o.push(e),t.firstCreatePass&&up(t).push(i,o.length-1)}var ke={lFrame:zv(null),bindingsEnabled:!0,skipHydrationRootTNode:null};var Fm=!1;function Av(){return ke.lFrame.elementDepthCount}function Ov(){ke.lFrame.elementDepthCount++}function mp(){ke.lFrame.elementDepthCount--}function pp(){return ke.bindingsEnabled}function fp(){return ke.skipHydrationRootTNode!==null}function hp(t){return ke.skipHydrationRootTNode===t}function gp(){ke.skipHydrationRootTNode=null}function ye(){return ke.lFrame.lView}function ht(){return ke.lFrame.tView}function De(t){return ke.lFrame.contextLView=t,t[Ct]}function Me(t){return ke.lFrame.contextLView=null,t}function qt(){let t=bp();for(;t!==null&&t.type===64;)t=t.parent;return t}function bp(){return ke.lFrame.currentTNode}function Rv(){let t=ke.lFrame,n=t.currentTNode;return t.isParent?n:n.parent}function fa(t,n){let e=ke.lFrame;e.currentTNode=t,e.isParent=n}function vp(){return ke.lFrame.isParent}function yp(){ke.lFrame.isParent=!1}function _p(){return ke.lFrame.contextLView}function xp(){return Fm}function fs(t){let n=Fm;return Fm=t,n}function zl(){return ke.lFrame.bindingIndex}function Pv(t){return ke.lFrame.bindingIndex=t}function bo(){return ke.lFrame.bindingIndex++}function sr(t){let n=ke.lFrame,e=n.bindingIndex;return n.bindingIndex=n.bindingIndex+t,e}function Fv(){return ke.lFrame.inI18n}function Lv(t,n){let e=ke.lFrame;e.bindingIndex=e.bindingRootIndex=t,Hl(n)}function Bv(){return ke.lFrame.currentDirectiveIndex}function Hl(t){ke.lFrame.currentDirectiveIndex=t}function Vv(t){let n=ke.lFrame.currentDirectiveIndex;return n===-1?null:t[n]}function $l(){return ke.lFrame.currentQueryIndex}function Es(t){ke.lFrame.currentQueryIndex=t}function jE(t){let n=t[he];return n.type===2?n.declTNode:n.type===1?t[Qt]:null}function Cp(t,n,e){if(e&4){let o=n,a=t;for(;o=o.parent,o===null&&!(e&1);)if(o=jE(a),o===null||(a=a[ho],o.type&10))break;if(o===null)return!1;n=o,t=a}let i=ke.lFrame=jv();return i.currentTNode=n,i.lView=t,!0}function Ul(t){let n=jv(),e=t[he];ke.lFrame=n,n.currentTNode=e.firstChild,n.lView=t,n.tView=e,n.contextLView=t,n.bindingIndex=e.bindingStartIndex,n.inI18n=!1}function jv(){let t=ke.lFrame,n=t===null?null:t.child;return n===null?zv(t):n}function zv(t){let n={currentTNode:null,isParent:!0,lView:null,tView:null,selectedIndex:-1,contextLView:null,elementDepthCount:0,currentNamespace:null,currentDirectiveIndex:-1,bindingRootIndex:-1,bindingIndex:-1,currentQueryIndex:0,parent:t,child:null,inI18n:!1};return t!==null&&(t.child=n),n}function Hv(){let t=ke.lFrame;return ke.lFrame=t.parent,t.currentTNode=null,t.lView=null,t}var Sp=Hv;function Gl(){let t=Hv();t.isParent=!0,t.tView=null,t.selectedIndex=-1,t.contextLView=null,t.elementDepthCount=0,t.currentDirectiveIndex=-1,t.currentNamespace=null,t.bindingRootIndex=-1,t.bindingIndex=-1,t.currentQueryIndex=0}function $v(t){return(ke.lFrame.contextLView=kv(t,ke.lFrame.contextLView))[Ct]}function Dn(){return ke.lFrame.selectedIndex}function vo(t){ke.lFrame.selectedIndex=t}function Ds(){let t=ke.lFrame;return Fl(t.tView,t.selectedIndex)}function _n(){ke.lFrame.currentNamespace=ap}function cr(){zE()}function zE(){ke.lFrame.currentNamespace=null}function wp(){return ke.lFrame.currentNamespace}var Uv=!0;function Wl(){return Uv}function ql(t){Uv=t}function Lm(t,n=null,e=null,i){let o=Gv(t,n,e,i);return o.resolveInjectorInitializers(),o}function Gv(t,n=null,e=null,i,o=new Set){let a=[e||sn,yv(t)],r;return new oa(a,n||tr(),r||null,o)}var ie=class t{static THROW_IF_NOT_FOUND=ea;static NULL=new Qa;static create(n,e){if(Array.isArray(n))return Lm({name:""},e,n,"");{let i=n.name??"";return Lm({name:i},n.parent,n.providers,i)}}static \u0275prov=Le({token:t,providedIn:"any",factory:()=>be(Km)});static __NG_ELEMENT_ID__=-1},ae=new D(""),Wt=class{static __NG_ELEMENT_ID__=HE;static __NG_ENV_ID__=n=>n},Sl=class extends Wt{_lView;constructor(n){super(),this._lView=n}get destroyed(){return ma(this._lView)}onDestroy(n){let e=this._lView;return jl(e,n),()=>Nv(e,n)}};function HE(){return new Sl(ye())}var Wv=!1,qv=new D(""),ha=(()=>{class t{taskId=0;pendingTasks=new Set;destroyed=!1;pendingTask=new co(!1);debugTaskTracker=p(qv,{optional:!0});get hasPendingTasks(){return this.destroyed?!1:this.pendingTask.value}get hasPendingTasksObservable(){return this.destroyed?new ge(e=>{e.next(!1),e.complete()}):this.pendingTask}add(){!this.hasPendingTasks&&!this.destroyed&&this.pendingTask.next(!0);let e=this.taskId++;return this.pendingTasks.add(e),this.debugTaskTracker?.add(e),e}has(e){return this.pendingTasks.has(e)}remove(e){this.pendingTasks.delete(e),this.debugTaskTracker?.remove(e),this.pendingTasks.size===0&&this.hasPendingTasks&&this.pendingTask.next(!1)}ngOnDestroy(){this.pendingTasks.clear(),this.hasPendingTasks&&this.pendingTask.next(!1),this.destroyed=!0,this.pendingTask.unsubscribe()}static \u0275prov=Le({token:t,providedIn:"root",factory:()=>new t})}return t})(),Bm=class extends B{__isAsync;destroyRef=void 0;pendingTasks=void 0;constructor(n=!1){super(),this.__isAsync=n,Sv()&&(this.destroyRef=p(Wt,{optional:!0})??void 0,this.pendingTasks=p(ha,{optional:!0})??void 0)}emit(n){let e=de(null);try{super.next(n)}finally{de(e)}}subscribe(n,e,i){let o=n,a=e||(()=>null),r=i;if(n&&typeof n=="object"){let c=n;o=c.next?.bind(c),a=c.error?.bind(c),r=c.complete?.bind(c)}this.__isAsync&&(a=this.wrapInTimeout(a),o&&(o=this.wrapInTimeout(o)),r&&(r=this.wrapInTimeout(r)));let s=super.subscribe({next:o,error:a,complete:r});return n instanceof _e&&n.add(s),s}wrapInTimeout(n){return e=>{let i=this.pendingTasks?.add();setTimeout(()=>{try{n(e)}finally{i!==void 0&&this.pendingTasks?.remove(i)}})}}},K=Bm;function wl(...t){}function Ep(t){let n,e;function i(){t=wl;try{e!==void 0&&typeof cancelAnimationFrame=="function"&&cancelAnimationFrame(e),n!==void 0&&clearTimeout(n)}catch{}}return n=setTimeout(()=>{t(),i()}),typeof requestAnimationFrame=="function"&&(e=requestAnimationFrame(()=>{t(),i()})),()=>i()}function Yv(t){return queueMicrotask(()=>t()),()=>{t=wl}}var Dp="isAngularZone",hs=Dp+"_ID",$E=0,X=class t{hasPendingMacrotasks=!1;hasPendingMicrotasks=!1;isStable=!0;onUnstable=new K(!1);onMicrotaskEmpty=new K(!1);onStable=new K(!1);onError=new K(!1);constructor(n){let{enableLongStackTrace:e=!1,shouldCoalesceEventChangeDetection:i=!1,shouldCoalesceRunChangeDetection:o=!1,scheduleInRootZone:a=Wv}=n;if(typeof Zone>"u")throw new te(908,!1);Zone.assertZonePatched();let r=this;r._nesting=0,r._outer=r._inner=Zone.current,Zone.TaskTrackingZoneSpec&&(r._inner=r._inner.fork(new Zone.TaskTrackingZoneSpec)),e&&Zone.longStackTraceZoneSpec&&(r._inner=r._inner.fork(Zone.longStackTraceZoneSpec)),r.shouldCoalesceEventChangeDetection=!o&&i,r.shouldCoalesceRunChangeDetection=o,r.callbackScheduled=!1,r.scheduleInRootZone=a,WE(r)}static isInAngularZone(){return typeof Zone<"u"&&Zone.current.get(Dp)===!0}static assertInAngularZone(){if(!t.isInAngularZone())throw new te(909,!1)}static assertNotInAngularZone(){if(t.isInAngularZone())throw new te(909,!1)}run(n,e,i){return this._inner.run(n,e,i)}runTask(n,e,i,o){let a=this._inner,r=a.scheduleEventTask("NgZoneEvent: "+o,n,UE,wl,wl);try{return a.runTask(r,e,i)}finally{a.cancelTask(r)}}runGuarded(n,e,i){return this._inner.runGuarded(n,e,i)}runOutsideAngular(n){return this._outer.run(n)}},UE={};function Mp(t){if(t._nesting==0&&!t.hasPendingMicrotasks&&!t.isStable)try{t._nesting++,t.onMicrotaskEmpty.emit(null)}finally{if(t._nesting--,!t.hasPendingMicrotasks)try{t.runOutsideAngular(()=>t.onStable.emit(null))}finally{t.isStable=!0}}}function GE(t){if(t.isCheckStableRunning||t.callbackScheduled)return;t.callbackScheduled=!0;function n(){Ep(()=>{t.callbackScheduled=!1,Vm(t),t.isCheckStableRunning=!0,Mp(t),t.isCheckStableRunning=!1})}t.scheduleInRootZone?Zone.root.run(()=>{n()}):t._outer.run(()=>{n()}),Vm(t)}function WE(t){let n=()=>{GE(t)},e=$E++;t._inner=t._inner.fork({name:"angular",properties:{[Dp]:!0,[hs]:e,[hs+e]:!0},onInvokeTask:(i,o,a,r,s,c)=>{if(qE(c))return i.invokeTask(a,r,s,c);try{return sv(t),i.invokeTask(a,r,s,c)}finally{(t.shouldCoalesceEventChangeDetection&&r.type==="eventTask"||t.shouldCoalesceRunChangeDetection)&&n(),cv(t)}},onInvoke:(i,o,a,r,s,c,d)=>{try{return sv(t),i.invoke(a,r,s,c,d)}finally{t.shouldCoalesceRunChangeDetection&&!t.callbackScheduled&&!YE(c)&&n(),cv(t)}},onHasTask:(i,o,a,r)=>{i.hasTask(a,r),o===a&&(r.change=="microTask"?(t._hasPendingMicrotasks=r.microTask,Vm(t),Mp(t)):r.change=="macroTask"&&(t.hasPendingMacrotasks=r.macroTask))},onHandleError:(i,o,a,r)=>(i.handleError(a,r),t.runOutsideAngular(()=>t.onError.emit(r)),!1)})}function Vm(t){t._hasPendingMicrotasks||(t.shouldCoalesceEventChangeDetection||t.shouldCoalesceRunChangeDetection)&&t.callbackScheduled===!0?t.hasPendingMicrotasks=!0:t.hasPendingMicrotasks=!1}function sv(t){t._nesting++,t.isStable&&(t.isStable=!1,t.onUnstable.emit(null))}function cv(t){t._nesting--,Mp(t)}var gs=class{hasPendingMicrotasks=!1;hasPendingMacrotasks=!1;isStable=!0;onUnstable=new K;onMicrotaskEmpty=new K;onStable=new K;onError=new K;run(n,e,i){return n.apply(e,i)}runGuarded(n,e,i){return n.apply(e,i)}runOutsideAngular(n){return n()}runTask(n,e,i,o){return n.apply(e,i)}};function qE(t){return Zv(t,"__ignore_ng_zone__")}function YE(t){return Zv(t,"__scheduler_tick__")}function Zv(t,n){return!Array.isArray(t)||t.length!==1?!1:t[0]?.data?.[n]===!0}var cn=class{_console=console;handleError(n){this._console.error("ERROR",n)}};function Kv(t){return Xv(t)?t:new jm(t)}function Xv(t){return t instanceof Error||typeof t=="object"&&t!==null&&typeof t.name=="string"&&typeof t.message=="string"}var jm=class extends Error{constructor(n){super(String(n),{cause:n}),this.name="ErrorBoundaryWrappedError"}},zi=new D("",{factory:()=>{let t=p(X),n=p(xt),e;return i=>{t.runOutsideAngular(()=>{n.destroyed&&!e?setTimeout(()=>{throw i}):(e??=n.get(cn),e.handleError(i))})}}}),Qv={provide:ra,useValue:()=>{let t=p(cn,{optional:!0})},multi:!0},ZE=new D("",{factory:()=>{let t=p(ae).defaultView;if(!t)return;let n=p(zi),e=a=>{n(a.reason),a.preventDefault()},i=a=>{a.error?n(a.error):n(new Error(a.message,{cause:a})),a.preventDefault()},o=()=>{t.addEventListener("unhandledrejection",e),t.addEventListener("error",i)};typeof Zone<"u"?Zone.root.run(o):o(),p(Wt).onDestroy(()=>{t.removeEventListener("error",i),t.removeEventListener("unhandledrejection",e)})}});function Ip(){return Bi([vv(()=>{p(ZE)})])}function G(t,n){let[e,i,o]=dm(t,n?.equal),a=e,r=a[Ht];return a.set=i,a.update=o,a.asReadonly=kp.bind(a),a}function kp(){let t=this[Ht];if(t.readonlyFn===void 0){let n=()=>this();n[Ht]=t,t.readonlyFn=n}return t.readonlyFn}var Hi=new D("",{factory:()=>KE}),KE="ng";var Yl=new D(""),ga=new D("",{providedIn:"platform",factory:()=>"unknown"}),Ms=new D(""),yo=new D("",{factory:()=>p(ae).body?.querySelector("[ngCspNonce]")?.getAttribute("ngCspNonce")||null});var lr=(()=>{class t{view;node;constructor(e,i){this.view=e,this.node=i}static __NG_ELEMENT_ID__=XE}return t})();function XE(){return new lr(ye(),qt())}var fi=class{},Is=new D("",{factory:()=>!0});var Np=new D(""),Zl=(()=>{class t{static \u0275prov=Le({token:t,providedIn:"root",factory:()=>new zm})}return t})(),zm=class{dirtyEffectCount=0;queues=new Map;add(n){this.enqueue(n),this.schedule(n)}schedule(n){n.dirty&&this.dirtyEffectCount++}remove(n){let e=n.zone,i=this.queues.get(e);i.has(n)&&(i.delete(n),n.dirty&&this.dirtyEffectCount--)}enqueue(n){let e=n.zone;this.queues.has(e)||this.queues.set(e,new Set);let i=this.queues.get(e);i.has(n)||i.add(n)}flush(){for(;this.dirtyEffectCount>0;){let n=!1;for(let[e,i]of this.queues)e===null?n||=this.flushQueue(i):n||=e.run(()=>this.flushQueue(i));n||(this.dirtyEffectCount=0)}}flushQueue(n){let e=!1;for(let i of n)i.dirty&&(this.dirtyEffectCount--,e=!0,i.run());return e}},El=class{[Ht];constructor(n){this[Ht]=n}destroy(){this[Ht].destroy()}};function lt(t,n){let e=n?.injector??p(ie),i=n?.manualCleanup!==!0?e.get(Wt):null,o,a=e.get(lr,null,{optional:!0}),r=e.get(fi);return a!==null?(o=ey(a.view,r,t),i instanceof Sl&&i._lView===a.view&&(i=null)):o=eD(t,e.get(Zl),r),o.injector=e,i!==null&&(o.onDestroyFns=[i.onDestroy(()=>o.destroy())]),new El(o)}var Jv=W(I({},mm),{cleanupFns:void 0,zone:null,onDestroyFns:null,run(){let t=fs(!1);try{pm(this)}finally{fs(t)}},cleanup(){if(!this.cleanupFns?.length)return;let t=de(null);try{for(;this.cleanupFns.length;)this.cleanupFns.pop()()}finally{this.cleanupFns=[],de(t)}}}),QE=W(I({},Jv),{consumerMarkedDirty(){this.scheduler.schedule(this),this.notifier.notify(12)},destroy(){if(so(this),this.onDestroyFns!==null)for(let t of this.onDestroyFns)t();this.cleanup(),this.scheduler.remove(this)}}),JE=W(I({},Jv),{consumerMarkedDirty(){this.view[ve]|=8192,pa(this.view),this.notifier.notify(13)},destroy(){if(so(this),this.onDestroyFns!==null)for(let t of this.onDestroyFns)t();this.cleanup(),this.view[Pi]?.delete(this)}});function ey(t,n,e){let i=Object.create(JE);return i.view=t,i.zone=typeof Zone<"u"?Zone.current:null,i.notifier=n,i.userFn=e,i.fn=ty(i,e),t[Pi]??=new Set,t[Pi].add(i),i.consumerMarkedDirty(i),i}function eD(t,n,e){let i=Object.create(QE);return i.userFn=t,i.fn=ty(i,t),i.scheduler=n,i.notifier=e,i.zone=typeof Zone<"u"?Zone.current:null,i.scheduler.add(i),i.notifier.notify(12),i}function ty(t,n){return()=>{n(e=>(t.cleanupFns??=[]).push(e))}}function dn(t){return typeof t=="function"&&t[Ht]!==void 0}function Kl(t){return dn(t)&&typeof t.set=="function"}var ks=(()=>{class t{internalPendingTasks=p(ha);scheduler=p(fi);errorHandler=p(zi);add(){let e=this.internalPendingTasks.add();return()=>{this.internalPendingTasks.has(e)&&(this.scheduler.notify(11),this.internalPendingTasks.remove(e))}}run(e){let i=this.add();try{e().catch(this.errorHandler).finally(i)}catch(o){this.errorHandler(o),i()}}static \u0275prov=Le({token:t,providedIn:"root",factory:()=>new t})}return t})();var Ef=Symbol("InputSignalNode#UNSET"),Fy=W(I({},Ga),{transformFn:void 0,applyValueToInputSignal(t,n){Go(t,n)}});function Bs(t){return{toString:t}.toString()}var Ye=(function(t){return t[t.TemplateCreateStart=0]="TemplateCreateStart",t[t.TemplateCreateEnd=1]="TemplateCreateEnd",t[t.TemplateUpdateStart=2]="TemplateUpdateStart",t[t.TemplateUpdateEnd=3]="TemplateUpdateEnd",t[t.LifecycleHookStart=4]="LifecycleHookStart",t[t.LifecycleHookEnd=5]="LifecycleHookEnd",t[t.OutputStart=6]="OutputStart",t[t.OutputEnd=7]="OutputEnd",t[t.BootstrapApplicationStart=8]="BootstrapApplicationStart",t[t.BootstrapApplicationEnd=9]="BootstrapApplicationEnd",t[t.BootstrapComponentStart=10]="BootstrapComponentStart",t[t.BootstrapComponentEnd=11]="BootstrapComponentEnd",t[t.ChangeDetectionStart=12]="ChangeDetectionStart",t[t.ChangeDetectionEnd=13]="ChangeDetectionEnd",t[t.ChangeDetectionSyncStart=14]="ChangeDetectionSyncStart",t[t.ChangeDetectionSyncEnd=15]="ChangeDetectionSyncEnd",t[t.AfterRenderHooksStart=16]="AfterRenderHooksStart",t[t.AfterRenderHooksEnd=17]="AfterRenderHooksEnd",t[t.ComponentStart=18]="ComponentStart",t[t.ComponentEnd=19]="ComponentEnd",t[t.DeferBlockStateStart=20]="DeferBlockStateStart",t[t.DeferBlockStateEnd=21]="DeferBlockStateEnd",t[t.DynamicComponentStart=22]="DynamicComponentStart",t[t.DynamicComponentEnd=23]="DynamicComponentEnd",t[t.HostBindingsUpdateStart=24]="HostBindingsUpdateStart",t[t.HostBindingsUpdateEnd=25]="HostBindingsUpdateEnd",t})(Ye||{}),ad=class{previousValue;currentValue;firstChange;constructor(n,e,i){this.previousValue=n,this.currentValue=e,this.firstChange=i}isFirstChange(){return this.firstChange}};function Ly(t,n,e,i){n!==null?n.applyValueToInputSignal(n,i):t[e]=i}var By=null,wt=(()=>{By=ny;let t=()=>ny;return t.ngInherit=!0,t})();function mD(){return By}function ny(t){return t.type.prototype.ngOnChanges&&(t.setInput=fD),pD}function pD(){let t=Vy(this),n=t?.current;if(n){let e=t.previous;if(e===fo)t.previous=n;else for(let i in n)e[i]=n[i];t.current=null,this.ngOnChanges(n)}}function fD(t,n,e,i,o){let a=this.declaredInputs[i],r=Vy(t)||hD(t,{previous:fo,current:null}),s=r.current||(r.current={}),c=r.previous,d=c[a];s[a]=new ad(d&&d.currentValue,e,c===fo),Ly(t,n,o,e)}var zp="__ngSimpleChanges__";function Vy(t){return Object.hasOwn(t,zp)&&t[zp]||null}function hD(t,n){return t[zp]=n}var iy=[];var et=function(t,n=null,e){for(let i=0;i<iy.length;i++){let o=iy[i];o(t,n,e)}};function gD(t,n,e){let{ngOnChanges:i,ngOnInit:o,ngDoCheck:a}=n.type.prototype;if(i){let r=mD()(n);(e.preOrderHooks??=[]).push(t,r),(e.preOrderCheckHooks??=[]).push(t,r)}o&&(e.preOrderHooks??=[]).push(0-t,o),a&&((e.preOrderHooks??=[]).push(t,a),(e.preOrderCheckHooks??=[]).push(t,a))}function jy(t,n){for(let e=n.directiveStart,i=n.directiveEnd;e<i;e++){let a=t.data[e].type.prototype,{ngAfterContentInit:r,ngAfterContentChecked:s,ngAfterViewInit:c,ngAfterViewChecked:d,ngOnDestroy:l}=a;r&&(t.contentHooks??=[]).push(-e,r),s&&((t.contentHooks??=[]).push(e,s),(t.contentCheckHooks??=[]).push(e,s)),c&&(t.viewHooks??=[]).push(-e,c),d&&((t.viewHooks??=[]).push(e,d),(t.viewCheckHooks??=[]).push(e,d)),l!=null&&(t.destroyHooks??=[]).push(e,l)}}function ed(t,n,e){zy(t,n,3,e)}function td(t,n,e,i){(t[ve]&3)===e&&zy(t,n,e,i)}function Tp(t,n){let e=t[ve];(e&3)===n&&(e&=16383,e+=1,t[ve]=e)}function zy(t,n,e,i){let o=i!==void 0?t[ca]&65535:0,a=i??-1,r=n.length-1,s=0;for(let c=o;c<r;c++)if(typeof n[c+1]=="number"){if(s=n[c],i!=null&&s>=i)break}else n[c]<0&&(t[ca]+=65536),(s<a||a==-1)&&(bD(t,e,n,c),t[ca]=(t[ca]&4294901760)+c+2),c++}function oy(t,n){et(Ye.LifecycleHookStart,t,n);let e=de(null);try{n.call(t)}finally{de(e),et(Ye.LifecycleHookEnd,t,n)}}function bD(t,n,e,i){let o=e[i]<0,a=e[i+1],r=o?-e[i]:e[i],s=t[r];o?t[ve]>>14<t[ca]>>16&&(t[ve]&3)===n&&(t[ve]+=16384,oy(s,a)):oy(s,a)}var mr=-1,va=class{factory;name;injectImpl;resolving=!1;canSeeViewProviders;multi;componentProviders;index;providerFactory;constructor(n,e,i,o){this.factory=n,this.name=o,this.canSeeViewProviders=e,this.injectImpl=i}};function vD(t){return(t.flags&8)!==0}function yD(t){return(t.flags&16)!==0}function _D(t,n,e){let i=0;for(;i<e.length;){let o=e[i];if(typeof o=="number"){if(o!==0)break;i++;let a=e[i++],r=e[i++],s=e[i++];t.setAttribute(n,r,s,a)}else{let a=o,r=e[++i];xD(a)?t.setProperty(n,a,r):t.setAttribute(n,a,r),i++}}return i}function Hy(t){return t===3||t===4||t===6}function xD(t){return t.charCodeAt(0)===64}function pr(t,n){if(!(n===null||n.length===0))if(t===null||t.length===0)t=n.slice();else{let e=-1;for(let i=0;i<n.length;i++){let o=n[i];typeof o=="number"?e=o:e===0||(e===-1||e===2?ay(t,e,o,null,n[++i]):ay(t,e,o,null,null))}}return t}function ay(t,n,e,i,o){let a=0,r=t.length;if(n===-1)r=-1;else for(;a<t.length;){let s=t[a++];if(typeof s=="number"){if(s===n){r=-1;break}else if(s>n){r=a-1;break}}}for(;a<t.length;){let s=t[a];if(typeof s=="number")break;if(s===e){o!==null&&(t[a+1]=o);return}a++,o!==null&&a++}r!==-1&&(t.splice(r,0,n),a=r+1),t.splice(a++,0,e),o!==null&&t.splice(a++,0,o)}function $y(t){return t!==mr}function rd(t){return t&32767}function CD(t){return t>>16}function sd(t,n){let e=CD(t),i=n;for(;e>0;)i=i[ho],e--;return i}var Hp=!0;function ry(t){let n=Hp;return Hp=t,n}var SD=256,Uy=SD-1,Gy=5,wD=0,vi={};function ED(t,n,e){let i;typeof e=="string"?i=e.charCodeAt(0)||0:Object.hasOwn(e,aa)&&(i=e[aa]),i==null&&(i=e[aa]=wD++);let o=i&Uy,a=1<<o;n.data[t+(o>>Gy)]|=a}function cd(t,n){let e=Wy(t,n);if(e!==-1)return e;let i=n[he];i.firstCreatePass&&(t.injectorIndex=n.length,Ap(i.data,t),Ap(n,null),Ap(i.blueprint,null));let o=Df(t,n),a=t.injectorIndex;if($y(o)){let r=rd(o),s=sd(o,n),c=s[he].data;for(let d=0;d<8;d++)n[a+d]=s[r+d]|c[r+d]}return n[a+8]=o,a}function Ap(t,n){t.push(0,0,0,0,0,0,0,0,n)}function Wy(t,n){return t.injectorIndex===-1||t.parent&&t.parent.injectorIndex===t.injectorIndex||n[t.injectorIndex+8]===null?-1:t.injectorIndex}function Df(t,n){if(t.parent&&t.parent.injectorIndex!==-1)return t.parent.injectorIndex;let e=0,i=null,o=n;for(;o!==null;){if(i=Xy(o),i===null)return mr;if(e++,o=o[ho],i.injectorIndex!==-1)return i.injectorIndex|e<<16}return mr}function $p(t,n,e){ED(t,n,e)}function DD(t,n){if(n==="class")return t.classes;if(n==="style")return t.styles;let e=t.attrs;if(e){let i=e.length,o=0;for(;o<i;){let a=e[o];if(Hy(a))break;if(a===0)o=o+2;else if(typeof a=="number")for(o++;o<i&&typeof e[o]=="string";)o++;else{if(a===n)return e[o+1];o=o+2}}}return null}function qy(t,n,e){if(e&8||t!==void 0)return t;Tl(n,"NodeInjector")}function Yy(t,n,e,i){if(e&8&&i===void 0&&(i=null),(e&3)===0){let o=t[Vi],a=Cn(void 0);try{return o?o.get(n,i,e&8):Ym(n,i,e&8)}finally{Cn(a)}}return qy(i,n,e)}function Zy(t,n,e,i=0,o){if(t!==null){if(n[ve]&2048&&!(i&2)){let r=ND(t,n,e,i,vi);if(r!==vi)return r}let a=Ky(t,n,e,i,vi);if(a!==vi)return a}return Yy(n,e,i,o)}function Ky(t,n,e,i,o){let a=ID(e);if(typeof a=="function"){if(!Cp(n,t,i))return i&1?qy(o,e,i):Yy(n,e,i,o);try{let r;if(r=a(i),r==null&&!(i&8))Tl(e);else return r}finally{Sp()}}else if(typeof a=="number"){let r=null,s=Wy(t,n),c=mr,d=i&1?n[ln][Qt]:null;for((s===-1||i&4)&&(c=s===-1?Df(t,n):n[s+8],c===mr||!cy(i,!1)?s=-1:(r=n[he],s=rd(c),n=sd(c,n)));s!==-1;){let l=n[he];if(sy(a,s,l.data)){let m=MD(s,n,e,r,i,d);if(m!==vi)return m}c=n[s+8],c!==mr&&cy(i,n[he].data[s+8]===d)&&sy(a,s,n)?(r=l,s=rd(c),n=sd(c,n)):s=-1}}return o}function MD(t,n,e,i,o,a){let r=n[he],s=r.data[t+8],c=i==null?gi(s)&&Hp:i!=r&&(s.type&3)!==0,d=o&1&&a===s,l=nd(s,r,e,c,d);return l!==null?As(n,r,l,s,o):vi}function nd(t,n,e,i,o){let a=t.providerIndexes,r=n.data,s=a&1048575,c=t.directiveStart,d=t.directiveEnd,l=a>>20,m=i?s:s+l,v=o?s+l:d;for(let g=m;g<v;g++){let y=r[g];if(g<c&&e===y||g>=c&&y.type===e)return g}if(o){let g=r[c];if(g&&bi(g)&&g.type===e)return c}return null}function As(t,n,e,i,o){let a=t[e],r=n.data;if(a instanceof va){let s=a;if(s.resolving)throw qm("");let c=ry(s.canSeeViewProviders);s.resolving=!0;let d=r[e].type||r[e],l,m=s.injectImpl?Cn(s.injectImpl):null,v=Cp(t,i,0);try{a=t[e]=s.factory(void 0,o,r,t,i),n.firstCreatePass&&e>=i.directiveStart&&gD(e,r[e],n)}finally{m!==null&&Cn(m),ry(c),s.resolving=!1,Sp()}}return a}function ID(t){if(typeof t=="string")return t.charCodeAt(0)||0;let n=Object.hasOwn(t,aa)?t[aa]:void 0;return typeof n=="number"?n>=0?n&Uy:kD:n}function sy(t,n,e){let i=1<<t;return!!(e[n+(t>>Gy)]&i)}function cy(t,n){return!(t&2)&&!(t&1&&n)}var $i=class{_tNode;_lView;constructor(n,e){this._tNode=n,this._lView=e}get(n,e,i){return Zy(this._tNode,this._lView,n,ta(i),e)}};function kD(){return new $i(qt(),ye())}function Ot(t){return Bs(()=>{let n=t.prototype.constructor,e=n[ps]||Up(n),i=Object.prototype,o=Object.getPrototypeOf(t.prototype).constructor;for(;o&&o!==i;){let a=o[ps]||Up(o);if(a&&a!==e)return a;o=Object.getPrototypeOf(o)}return a=>new a})}function Up(t){return $m(t)?()=>{let n=Up(Xt(t));return n&&n()}:na(t)}function ND(t,n,e,i,o){let a=t,r=n;for(;a!==null&&r!==null&&r[ve]&2048&&!rr(r);){let s=Ky(a,r,e,i|2,vi);if(s!==vi)return s;i&=-5;let c=a.parent;if(!c){let d=r[np];if(d){let l=d.get(e,vi,i);if(l!==vi)return l}c=Xy(r),r=r[ho]}a=c}return o}function Xy(t){let n=t[he],e=n.type;return e===2?n.declTNode:e===1?t[Qt]:null}function Mf(t){return DD(qt(),t)}function ce(t){return{token:t.token,providedIn:t.autoProvided===!1?null:"root",factory:t.factory,value:void 0}}function TD(){return yr(qt(),ye())}function yr(t,n){return new q(An(t,n))}var q=(()=>{class t{nativeElement;constructor(e){this.nativeElement=e}static __NG_ELEMENT_ID__=TD}return t})();function Qy(t){return t instanceof q?t.nativeElement:t}function AD(){return this._results[Symbol.iterator]()}var Mn=class{_emitDistinctChangesOnly;dirty=!0;_onDirty=void 0;_results=[];_changesDetected=!1;_changes=void 0;length=0;first=void 0;last=void 0;get changes(){return this._changes??=new B}constructor(n=!1){this._emitDistinctChangesOnly=n}get(n){return this._results[n]}map(n){return this._results.map(n)}filter(n){return this._results.filter(n)}find(n){return this._results.find(n)}reduce(n,e){return this._results.reduce(n,e)}forEach(n){this._results.forEach(n)}some(n){return this._results.some(n)}toArray(){return this._results.slice()}toString(){return this._results.toString()}reset(n,e){this.dirty=!1;let i=hv(n);(this._changesDetected=!fv(this._results,i,e))&&(this._results=i,this.length=i.length,this.last=i[this.length-1],this.first=i[0])}notifyOnChanges(){this._changes!==void 0&&(this._changesDetected||!this._emitDistinctChangesOnly)&&this._changes.next(this)}onDirty(n){this._onDirty=n}setDirty(){this.dirty=!0,this._onDirty?.()}destroy(){this._changes!==void 0&&(this._changes.complete(),this._changes.unsubscribe())}[Symbol.iterator]=AD};function Jy(t){return(t.flags&128)===128}var If=(function(t){return t[t.OnPush=0]="OnPush",t[t.Eager=1]="Eager",t[t.Default=1]="Default",t})(If||{}),e_=new Map,OD=0;function RD(){return OD++}function PD(t){e_.set(t[xs],t)}function Gp(t){e_.delete(t[xs])}var ly="__ngContext__";function fr(t,n){ji(n)?(t[ly]=n[xs],PD(n)):t[ly]=n}function t_(t){return i_(t[or])}function n_(t){return i_(t[Nn])}function i_(t){for(;t!==null&&!Tn(t);)t=t[Nn];return t}var Wp;function kf(t){Wp=t}function o_(){if(Wp!==void 0)return Wp;if(typeof document<"u")return document;throw new te(210,!1)}var a_="r";var r_="di";var s_=!1,c_=new D("",{factory:()=>s_});var dy=new WeakMap;function FD(t,n){if(t==null||typeof t!="object")return;let e=dy.get(t);e||(e=new WeakSet,dy.set(t,e)),e.add(n)}var LD=(t,n,e,i)=>{};function BD(t,n,e,i){LD(t,n,e,i)}function vd(t){return(t.flags&32)===32}var VD=()=>null;function l_(t,n,e=!1){return VD(t,n,e)}function d_(t,n){let e=t.contentQueries;if(e!==null){let i=de(null);try{for(let o=0;o<e.length;o+=2){let a=e[o],r=e[o+1];if(r!==-1){let s=t.data[r];Es(a),s.contentQueries(2,n[r],r)}}}finally{de(i)}}}function qp(t,n,e){Es(0);let i=de(null);try{n(t,e)}finally{de(i)}}function u_(t,n,e){if(op(n)){let i=de(null);try{let o=n.directiveStart,a=n.directiveEnd;for(let r=o;r<a;r++){let s=t.data[r];if(s.contentQueries){let c=e[r];s.contentQueries(1,c,r)}}}finally{de(i)}}}var Qn=(function(t){return t[t.Emulated=0]="Emulated",t[t.None=2]="None",t[t.ShadowDom=3]="ShadowDom",t[t.ExperimentalIsolatedShadowDom=4]="ExperimentalIsolatedShadowDom",t})(Qn||{}),Ui=class{changingThisBreaksApplicationSecurity;constructor(n){this.changingThisBreaksApplicationSecurity=n}toString(){return`SafeValue must use [property]=binding: ${this.changingThisBreaksApplicationSecurity}`}},Yp=class extends Ui{getTypeName(){return"HTML"}},Zp=class extends Ui{getTypeName(){return"Style"}},Kp=class extends Ui{getTypeName(){return"Script"}},Xp=class extends Ui{getTypeName(){return"URL"}},Qp=class extends Ui{getTypeName(){return"ResourceURL"}};function Rn(t){return t instanceof Ui?t.changingThisBreaksApplicationSecurity:t}function Co(t,n){let e=m_(t);if(e!=null&&e!==n){if(e==="ResourceURL"&&n==="URL")return!0;throw new Error(`Required a safe ${n}, got a ${e} (see ${Hm})`)}return e===n}function m_(t){return t instanceof Ui&&t.getTypeName()||null}function Nf(t){return new Yp(t)}function Tf(t){return new Zp(t)}function Af(t){return new Kp(t)}function Of(t){return new Xp(t)}function Rf(t){return new Qp(t)}var Xl;function jD(){if(Xl===void 0&&(Xl=null,Ja.trustedTypes))try{Xl=Ja.trustedTypes.createPolicy("angular",{createHTML:t=>t,createScript:t=>t,createScriptURL:t=>t})}catch{}return Xl}function yd(t){return jD()?.createHTML(t)||t}function zD(t){let n=new ef(t);return HD()?new Jp(n):n}var Jp=class{inertDocumentHelper;constructor(n){this.inertDocumentHelper=n}getInertBodyElement(n){n="<body><remove></remove>"+n;try{let e=new window.DOMParser().parseFromString(yd(n),"text/html").body;return e===null?this.inertDocumentHelper.getInertBodyElement(n):(e.firstChild?.remove(),e)}catch{return null}}},ef=class{defaultDoc;inertDocument;constructor(n){this.defaultDoc=n,this.inertDocument=this.defaultDoc.implementation.createHTMLDocument("sanitization-inert")}getInertBodyElement(n){let e=this.inertDocument.createElement("template");return e.innerHTML=yd(n),e}};function HD(){try{return!!new window.DOMParser().parseFromString(yd(""),"text/html")}catch{return!1}}var $D=/^(?!javascript:)(?:[a-z0-9+.-]+:|[^&:\/?#]*(?:[\/?#]|$))/i;function Vs(t){return t=String(t),t.match($D)?t:"unsafe:"+t}function Gi(t){let n=Object.create(null);for(let e of t.split(","))n[e]=!0;return n}function js(...t){let n=Object.create(null);for(let e of t)for(let i in e)Object.hasOwn(e,i)&&(n[i]=!0);return n}var p_=Gi("area,br,col,hr,img,wbr"),f_=Gi("colgroup,dd,dt,li,p,tbody,td,tfoot,th,thead,tr"),h_=Gi("rp,rt"),UD=js(h_,f_),GD=js(f_,Gi("address,article,aside,blockquote,caption,center,del,details,dialog,dir,div,dl,figure,figcaption,footer,h1,h2,h3,h4,h5,h6,header,hgroup,hr,ins,main,map,menu,nav,ol,pre,section,summary,table,ul")),WD=js(h_,Gi("a,abbr,acronym,audio,b,bdi,bdo,big,br,cite,code,del,dfn,em,font,i,img,ins,kbd,label,map,mark,picture,q,ruby,rp,rt,s,samp,small,source,span,strike,strong,sub,sup,time,track,tt,u,var,video")),uy=js(p_,GD,WD,UD),g_=Gi("background,cite,href,itemtype,longdesc,poster,src,xlink:href"),qD=Gi("abbr,accesskey,align,alt,autoplay,axis,bgcolor,border,cellpadding,cellspacing,class,clear,color,cols,colspan,compact,controls,coords,datetime,default,dir,download,face,headers,height,hidden,hreflang,hspace,ismap,itemscope,itemprop,kind,label,lang,language,loop,media,muted,nohref,nowrap,open,preload,rel,rev,role,rows,rowspan,rules,scope,scrolling,shape,size,sizes,span,srclang,srcset,start,summary,tabindex,target,title,translate,type,usemap,valign,value,vspace,width"),YD=Gi("aria-activedescendant,aria-atomic,aria-autocomplete,aria-busy,aria-checked,aria-colcount,aria-colindex,aria-colspan,aria-controls,aria-current,aria-describedby,aria-details,aria-disabled,aria-dropeffect,aria-errormessage,aria-expanded,aria-flowto,aria-grabbed,aria-haspopup,aria-hidden,aria-invalid,aria-keyshortcuts,aria-label,aria-labelledby,aria-level,aria-live,aria-modal,aria-multiline,aria-multiselectable,aria-orientation,aria-owns,aria-placeholder,aria-posinset,aria-pressed,aria-readonly,aria-relevant,aria-required,aria-roledescription,aria-rowcount,aria-rowindex,aria-rowspan,aria-selected,aria-setsize,aria-sort,aria-valuemax,aria-valuemin,aria-valuenow,aria-valuetext"),ZD=js(g_,qD,YD),KD=Gi("script,style,template"),tf=class{sanitizedSomething=!1;buf=[];sanitizeChildren(n){let e=n.firstChild,i=!0,o=[];for(;e;){if(e.nodeType===Node.ELEMENT_NODE?i=this.startElement(e):e.nodeType===Node.TEXT_NODE?this.chars(e.nodeValue):this.sanitizedSomething=!0,i&&e.firstChild){o.push(e),e=JD(e);continue}for(;e;){e.nodeType===Node.ELEMENT_NODE&&this.endElement(e);let a=QD(e);if(a){e=a;break}e=o.pop()}}return this.buf.join("")}startElement(n){let e=my(n).toLowerCase();if(!Object.hasOwn(uy,e))return this.sanitizedSomething=!0,!Object.hasOwn(KD,e);this.buf.push("<"),this.buf.push(e);let i=n.attributes;for(let o=0;o<i.length;o++){let a=i.item(o),r=a.name,s=r.toLowerCase();if(!Object.hasOwn(ZD,s)){this.sanitizedSomething=!0;continue}let c=a.value;g_[s]&&(c=Vs(c)),this.buf.push(" ",r,'="',py(c),'"')}return this.buf.push(">"),!0}endElement(n){let e=my(n).toLowerCase();Object.hasOwn(uy,e)&&!Object.hasOwn(p_,e)&&(this.buf.push("</"),this.buf.push(e),this.buf.push(">"))}chars(n){this.buf.push(py(n))}};function XD(t,n){return(t.compareDocumentPosition(n)&Node.DOCUMENT_POSITION_CONTAINED_BY)!==Node.DOCUMENT_POSITION_CONTAINED_BY}function QD(t){let n=t.nextSibling;if(n&&t!==n.previousSibling)throw b_(n);return n}function JD(t){let n=t.firstChild;if(n&&XD(t,n))throw b_(n);return n}function my(t){let n=t.nodeName;return typeof n=="string"?n:"FORM"}function b_(t){return new Error(`Failed to sanitize html because the element is clobbered: ${t.outerHTML}`)}var eM=/[\uD800-\uDBFF][\uDC00-\uDFFF]/g,tM=/([^\#-~ |!])/g;function py(t){return t.replace(/&/g,"&amp;").replace(eM,function(n){let e=n.charCodeAt(0),i=n.charCodeAt(1);return"&#"+((e-55296)*1024+(i-56320)+65536)+";"}).replace(tM,function(n){return"&#"+n.charCodeAt(0)+";"}).replace(/</g,"&lt;").replace(/>/g,"&gt;")}var Ql;function Pf(t,n){let e=null;try{Ql=Ql||zD(t);let i=n?String(n):"";e=Ql.getInertBodyElement(i);let o=5,a=i;do{if(o===0)throw new Error("Failed to sanitize html because the input is unstable");o--,i=a,a=e.innerHTML,e=Ql.getInertBodyElement(i)}while(i!==a);let s=new tf().sanitizeChildren(fy(e)||e);return yd(s)}finally{if(e){let i=fy(e)||e;for(;i.firstChild;)i.firstChild.remove()}}}function fy(t){return"content"in t&&nM(t)?t.content:null}function nM(t){return t.nodeType===Node.ELEMENT_NODE&&t.nodeName==="TEMPLATE"}function iM(t,n){return t.createText(n)}function oM(t,n,e){t.setValue(n,e)}function v_(t,n,e){return t.createElement(n,e)}function ba(t,n,e,i,o){t.insertBefore(n,e,i,o)}function y_(t,n,e){t.appendChild(n,e)}function hy(t,n,e,i,o){i!==null?ba(t,n,e,i,o):y_(t,n,e)}function __(t,n,e,i){t.removeChild(null,n,e,i)}function aM(t,n,e){t.setAttribute(n,"style",e)}function rM(t,n,e){e===""?t.removeAttribute(n,"class"):t.setAttribute(n,"class",e)}function x_(t,n,e){let{mergedAttrs:i,classes:o,styles:a}=e;i!==null&&_D(t,n,i),o!==null&&rM(t,n,o),a!==null&&aM(t,n,a)}function So(t){let n=sM();return n?n.sanitize(Ut.URL,t)||"":Co(t,"URL")?Rn(t):Vs(Sn(t))}function sM(){let t=ye();return t&&t[Zn].sanitizer}function Ff(t){return t.ownerDocument.defaultView}function Lf(t){return t.ownerDocument}function cM(t,n,e){let i=t.length;for(;;){let o=t.indexOf(n,e);if(o===-1)return o;if(o===0||t.charCodeAt(o-1)<=32){let a=n.length;if(o+a===i||t.charCodeAt(o+a)<=32)return o}e=o+1}}var C_="ng-template";function lM(t,n,e,i){let o=0;if(i){for(;o<n.length&&typeof n[o]=="string";o+=2)if(n[o]==="class"&&cM(n[o+1].toLowerCase(),e,0)!==-1)return!0}else if(Bf(t))return!1;if(o=n.indexOf(1,o),o>-1){let a;for(;++o<n.length&&typeof(a=n[o])=="string";)if(a.toLowerCase()===e)return!0}return!1}function Bf(t){return t.type===4&&t.value!==C_}function dM(t,n,e){let i=t.type===4&&!e?C_:t.value;return n===i}function uM(t,n,e){let i=4,o=t.attrs,a=o!==null?fM(o):0,r=!1;for(let s=0;s<n.length;s++){let c=n[s];if(typeof c=="number"){if(!r&&!Kn(i)&&!Kn(c))return!1;if(r&&Kn(c))continue;r=!1,i=c|i&1;continue}if(!r)if(i&4){if(i=2|i&1,c!==""&&!dM(t,c,e)||c===""&&n.length===1){if(Kn(i))return!1;r=!0}}else if(i&8){if(o===null||!lM(t,o,c,e)){if(Kn(i))return!1;r=!0}}else{let d=n[++s],l=mM(c,o,Bf(t),e);if(l===-1){if(Kn(i))return!1;r=!0;continue}if(d!==""){let m;if(l>a?m="":m=o[l+1].toLowerCase(),i&2&&d!==m){if(Kn(i))return!1;r=!0}}}}return Kn(i)||r}function Kn(t){return(t&1)===0}function mM(t,n,e,i){if(n===null)return-1;let o=0;if(i||!e){let a=!1;for(;o<n.length;){let r=n[o];if(r===t)return o;if(r===3||r===6)a=!0;else if(r===1||r===2){let s=n[++o];for(;typeof s=="string";)s=n[++o];continue}else{if(r===4)break;if(r===0){o+=4;continue}}o+=a?1:2}return-1}else return hM(n,t)}function S_(t,n,e=!1){for(let i=0;i<n.length;i++)if(uM(t,n[i],e))return!0;return!1}function pM(t){let n=t.attrs;if(n!=null){let e=n.indexOf(5);if((e&1)===0)return n[e+1]}return null}function fM(t){for(let n=0;n<t.length;n++){let e=t[n];if(Hy(e))return n}return t.length}function hM(t,n){let e=t.indexOf(4);if(e>-1)for(e++;e<t.length;){let i=t[e];if(typeof i=="number")return-1;if(i===n)return e;e++}return-1}function gM(t,n){e:for(let e=0;e<n.length;e++){let i=n[e];if(t.length===i.length){for(let o=0;o<t.length;o++)if(t[o]!==i[o])continue e;return!0}}return!1}function gy(t,n){return t?":not("+n.trim()+")":n}function bM(t){let n=t[0],e=1,i=2,o="",a=!1;for(;e<t.length;){let r=t[e];if(typeof r=="string")if(i&2){let s=t[++e];o+="["+r+(s.length>0?'="'+s+'"':"")+"]"}else i&8?o+="."+r:i&4&&(o+=" "+r);else o!==""&&!Kn(r)&&(n+=gy(a,o),o=""),i=r,a=a||!Kn(i);e++}return o!==""&&(n+=gy(a,o)),n}function vM(t){return t.map(bM).join(",")}function yM(t){let n=[],e=[],i=1,o=2;for(;i<t.length;){let a=t[i];if(typeof a=="string")o===2?a!==""&&n.push(a,t[++i]):o===8&&e.push(a);else{if(!Kn(o))break;o=a}i++}return e.length&&n.push(1,...e),n}var en={},yi=(function(t){return t[t.Important=1]="Important",t[t.DashCase=2]="DashCase",t})(yi||{}),_M;function Vf(t,n){return _M(t,n)}var jf=new Set;var I8=typeof document<"u"&&typeof document?.documentElement?.getAnimations=="function";var nf=new WeakMap;function w_(t){return t?t[ho]??t:null}var dr=new WeakSet;function xM(t,n,e){let i=nf.get(t);if(!i||i.length===0)return;let o=n.parentNode,a=n.previousSibling,r=w_(e);for(let s=i.length-1;s>=0;s--){let{el:c,declarationView:d}=i[s],l=c.parentNode;c===n?(i.splice(s,1),dr.add(c),c.dispatchEvent(new CustomEvent("animationend",{detail:{cancel:!0}}))):a&&c===a?(i.splice(s,1),c.dispatchEvent(new CustomEvent("animationend",{detail:{cancel:!0}})),c.parentNode?.removeChild(c)):l&&o&&l!==o&&(r===null||d===null||r===d)&&(i.splice(s,1),c.dispatchEvent(new CustomEvent("animationend",{detail:{cancel:!0}})),c.parentNode?.removeChild(c))}}function CM(t,n,e){let i=w_(e),o=nf.get(t);o?o.some(a=>a.el===n)||o.push({el:n,declarationView:i}):nf.set(t,[{el:n,declarationView:i}])}var _d=(function(t){return t[t.CHANGE_DETECTION=0]="CHANGE_DETECTION",t[t.AFTER_NEXT_RENDER=1]="AFTER_NEXT_RENDER",t})(_d||{}),Jn=new D(""),by=new Set;function Wi(t){by.has(t)||(by.add(t),performance?.mark?.("mark_feature_usage",{detail:{feature:t}}))}var xd=(()=>{class t{impl=null;execute(){this.impl?.execute()}static \u0275prov=Le({token:t,providedIn:"root",factory:()=>new t})}return t})(),zf=[0,1,2,3],Hf=(()=>{class t{ngZone=p(X);scheduler=p(fi);errorHandler=p(cn,{optional:!0});sequences=new Set;deferredRegistrations=new Set;executing=!1;constructor(){p(Jn,{optional:!0})}execute(){let e=this.sequences.size>0;e&&et(Ye.AfterRenderHooksStart),this.executing=!0;for(let i of zf)for(let o of this.sequences)if(!(o.erroredOrDestroyed||!o.hooks[i]))try{o.pipelinedValue=this.ngZone.runOutsideAngular(()=>this.maybeTrace(()=>{let a=o.hooks[i];return a(o.pipelinedValue)},o.snapshot))}catch(a){o.erroredOrDestroyed=!0,this.errorHandler?.handleError(a)}this.executing=!1;for(let i of this.sequences)i.afterRun(),i.once&&(this.sequences.delete(i),i.destroy());for(let i of this.deferredRegistrations)this.sequences.add(i);this.deferredRegistrations.size>0&&this.scheduler.notify(7),this.deferredRegistrations.clear(),e&&et(Ye.AfterRenderHooksEnd)}register(e){let{view:i}=e;i!==void 0?((i[la]??=[]).push(e),pa(i),i[ve]|=8192):this.addSequence(e)}addSequence(e){this.executing?this.deferredRegistrations.add(e):this.sequences.add(e),this.scheduler.notify(7)}unregister(e){this.executing&&this.sequences.has(e)?(e.erroredOrDestroyed=!0,e.pipelinedValue=void 0,e.once=!0):(this.sequences.delete(e),this.deferredRegistrations.delete(e))}maybeTrace(e,i){return i?i.run(_d.AFTER_NEXT_RENDER,e):e()}static \u0275prov=Le({token:t,providedIn:"root",factory:()=>new t})}return t})(),Os=class{impl;hooks;view;once;snapshot;erroredOrDestroyed=!1;pipelinedValue=void 0;unregisterOnDestroy;constructor(n,e,i,o,a,r=null){this.impl=n,this.hooks=e,this.view=i,this.once=o,this.snapshot=r,this.unregisterOnDestroy=a?.onDestroy(()=>this.destroy())}afterRun(){this.erroredOrDestroyed=!1,this.pipelinedValue=void 0,this.snapshot?.dispose(),this.snapshot=null}destroy(){this.impl.unregister(this),this.unregisterOnDestroy?.();let n=this.view?.[la];n&&(this.view[la]=n.filter(e=>e!==this))}};function Et(t,n){let e=n?.injector??p(ie);return Wi("NgAfterNextRender"),wM(t,e,n,!0)}function SM(t){return t instanceof Function?[void 0,void 0,t,void 0]:[t.earlyRead,t.write,t.mixedReadWrite,t.read]}function wM(t,n,e,i){let o=n.get(xd);o.impl??=n.get(Hf);let a=n.get(Jn,null,{optional:!0}),r=e?.manualCleanup!==!0?n.get(Wt):null,s=n.get(lr,null,{optional:!0}),c=new Os(o.impl,SM(t),s?.view,i,r,a?.snapshot(null));return o.impl.register(c),c}var of=null,E_=null;function vy(t,n,e,i){of?.maybeQueueEnterAnimation(t,n,e,i)}function yy(t,n,e,i){of===null?i(!1):of.runLeaveAnimationsWithCallback(t,n,e,i)}function EM(t){E_?.initViewDetachAnimations(t)}function DM(t){E_?.clearViewDetachAnimations(t)}function ur(t,n,e,i,o,a,r,s){if(o!=null){let c,d=!1;Tn(o)?c=o:ji(o)&&(d=!0,o=o[Yn]);let l=Jt(o);t===0&&i!==null?(vy(s,i,a,e),r==null?y_(n,i,l):ba(n,i,l,r||null,!0)):t===1&&i!==null?(ba(n,i,l,r||null,!0),xM(a,l,s),dr.has(l)||vy(s,i,a,e)):t===2?(s?.[wv]?.leave?.has(a.index)&&CM(a,l,s),dr.delete(l),yy(s,a,e,m=>{if(dr.has(l)){dr.delete(l);return}__(n,l,d,m)})):t===3&&(dr.delete(l),yy(s,a,e,()=>{n.destroyNode(l)})),c!=null&&LM(n,t,e,c,a,i,r)}}function MM(t,n){D_(t,n),n[Yn]=null,n[Qt]=null}function IM(t,n,e,i,o,a){i[Yn]=o,i[Qt]=n,Sd(t,i,e,1,o,a)}function D_(t,n){n[Zn].changeDetectionScheduler?.notify(9),Sd(t,n,n[mt],2,null,null)}function kM(t){let n=t[or];if(!n)return Op(t[he],t);for(;n;){let e=null;if(ji(n))e=n[or];else{let i=n[St];i&&(e=i)}if(!e){for(;n&&!n[Nn]&&n!==t;)ji(n)&&Op(n[he],n),n=n[Tt];n===null&&(n=t),ji(n)&&Op(n[he],n),e=n&&n[Nn]}n=e}}function $f(t,n){let e=t[ua],i=e.indexOf(n);e.splice(i,1)}function Cd(t,n){if(ma(n))return;let e=n[mt];e.destroyNode&&Sd(t,n,e,3,null,null),kM(n)}function Op(t,n){if(ma(n))return;let e=de(null);try{n[ve]&=-129,n[ve]|=256,n[wn]&&so(n[wn]),TM(t,n),NM(t,n),n[he].type===1&&n[mt].destroy();let i=n[go];if(i!==null&&Tn(n[Tt])){i!==n[Tt]&&$f(i,n);let o=n[hi];o!==null&&o.detachView(t)}Gp(n)}finally{de(e)}}function NM(t,n){let e=t.cleanup,i=n[ir];if(e!==null)for(let r=0;r<e.length-1;r+=2)if(typeof e[r]=="string"){let s=e[r+3];s>=0?i[s]():i[-s].unsubscribe(),r+=2}else{let s=i[e[r+1]];e[r].call(s)}i!==null&&(n[ir]=null);let o=n[Ri];if(o!==null){n[Ri]=null;for(let r=0;r<o.length;r++){let s=o[r];s()}}let a=n[Pi];if(a!==null){n[Pi]=null;for(let r of a)r.destroy()}}function TM(t,n){let e;if(t!=null&&(e=t.destroyHooks)!=null)for(let i=0;i<e.length;i+=2){let o=n[e[i]];if(!(o instanceof va)){let a=e[i+1];if(Array.isArray(a))for(let r=0;r<a.length;r+=2){let s=o[a[r]],c=a[r+1];et(Ye.LifecycleHookStart,s,c);try{c.call(s)}finally{et(Ye.LifecycleHookEnd,s,c)}}else{et(Ye.LifecycleHookStart,o,a);try{a.call(o)}finally{et(Ye.LifecycleHookEnd,o,a)}}}}}function M_(t,n,e){if(n===null)throw new te(510,!1);return AM(t,n.parent,e)}function AM(t,n,e){let i=n;for(;i!==null&&i.type&168;)n=i,i=n.parent;if(i===null)return e[Yn];if(gi(i)){let{encapsulation:o}=t.data[i.directiveStart+i.componentOffset];if(o===Qn.None||o===Qn.Emulated)return null}return An(i,e)}function I_(t,n,e){return RM(t,n,e)}function OM(t,n,e){return t.type&40?An(t,e):null}var RM=OM,_y;function Uf(t,n,e,i){let o=M_(t,i,n),a=n[mt],r=i.parent||n[Qt],s=I_(r,i,n);if(o!=null)if(Array.isArray(e))for(let c=0;c<e.length;c++)hy(a,o,e[c],s,!1);else hy(a,o,e,s,!1);_y!==void 0&&_y(a,i,n,e,o)}function Ns(t,n){if(n!==null){let e=n.type;if(e&3)return An(n,t);if(e&4)return af(-1,t[n.index]);if(e&8){let i=n.child;if(i!==null)return Ns(t,i);{let o=t[n.index];return Tn(o)?af(-1,o):Jt(o)}}else{if(e&128)return Ns(t,n.next);if(e&32)return Vf(n,t)()||Jt(t[n.index]);{let i=k_(t,n);if(i!==null){if(Array.isArray(i))return i[0];let o=Fi(t[ln]);return Ns(o,i)}else return Ns(t,n.next)}}}return null}function k_(t,n){if(n!==null){let i=t[ln][Qt],o=n.projection;return i.projection[o]}return null}function af(t,n){let e=St+t+1;if(e<n.length){let i=n[e],o=i[he].firstChild;if(o!==null)return Ns(i,o)}return n[da]}function Gf(t,n,e,i,o,a,r){for(;e!=null;){let s=i[Vi];if(e.type===128){e=e.next;continue}let c=i[e.index],d=e.type;if(r&&n===0&&(c&&fr(Jt(c),i),e.flags|=2),!vd(e))if(d&8)Gf(t,n,e.child,i,o,a,!1),ur(n,t,s,o,c,e,a,i);else if(d&32){let l=Vf(e,i),m;for(;m=l();)ur(n,t,s,o,m,e,a,i);ur(n,t,s,o,c,e,a,i)}else d&16?N_(t,n,i,e,o,a):ur(n,t,s,o,c,e,a,i);e=r?e.projectionNext:e.next}}function Sd(t,n,e,i,o,a){t.type===3?PM(e,i,n,o,a):Gf(e,i,t.firstChild,n,o,a,!1)}function PM(t,n,e,i,o){let r=e[he].firstChild,s=r.next,c=Jt(e[r.index]),d=Jt(e[s.index]),l=s.index+1,m=e[l];if(n===1||n===0)i!==null&&(m&&m.hasChildNodes()?ba(t,i,m,o,!0):(ba(t,i,c,o,!0),ba(t,i,d,o,!0)));else if(n===2){if(m||(m=document.createDocumentFragment(),e[l]=m),c&&c.parentNode===m)return;let v=c;for(;v!==null;){let g=v.nextSibling;if(m.appendChild(v),v===d)break;v=g}}}function FM(t,n,e){let i=n[mt],o=M_(t,e,n),a=e.parent||n[Qt],r=I_(a,e,n);N_(i,0,n,e,o,r)}function N_(t,n,e,i,o,a){let r=e[ln],c=r[Qt].projection[i.projection];if(Array.isArray(c))for(let d=0;d<c.length;d++){let l=c[d];ur(n,t,e[Vi],o,l,i,a,e)}else{let d=c,l=r[Tt];Jy(i)&&(d.flags|=128),Gf(t,n,d,l,o,a,!0)}}function LM(t,n,e,i,o,a,r){let s=i[da],c=Jt(i);if(s!==c&&ur(n,t,e,a,s,o,r),(i[ve]&4)===0)for(let d=St;d<i.length;d++){let l=i[d];Sd(l[he],l,t,n,a,s)}}function BM(t,n,e,i,o){if(n)o?t.addClass(e,i):t.removeClass(e,i);else{let a=i.indexOf("-")===-1?void 0:yi.DashCase;o==null?t.removeStyle(e,i,a):(typeof o=="string"&&o.endsWith("!important")&&(o=o.slice(0,-10),a|=yi.Important),t.setStyle(e,i,o,a))}}function Wf(t,n,e,i,o,a,r,s,c,d,l){let m=yt+i,v=m+o,g=VM(m,v),y=typeof d=="function"?d():d;return g[he]={type:t,blueprint:g,template:e,queries:null,viewQuery:s,declTNode:n,data:g.slice().fill(null,m),bindingStartIndex:m,expandoStartIndex:v,hostBindingOpCodes:null,firstCreatePass:!0,firstUpdatePass:!0,staticViewQueries:!1,staticContentQueries:!1,preOrderHooks:null,preOrderCheckHooks:null,contentHooks:null,contentCheckHooks:null,viewHooks:null,viewCheckHooks:null,destroyHooks:null,cleanup:null,contentQueries:null,components:null,directiveRegistry:typeof a=="function"?a():a,pipeRegistry:typeof r=="function"?r():r,firstChild:null,schemas:c,consts:y,incompleteFirstPass:!1,ssrId:l}}function VM(t,n){let e=[];for(let i=0;i<n;i++)e.push(i<t?null:en);return e}function jM(t){let n=t.tView;return n===null||n.incompleteFirstPass?t.tView=Wf(1,null,t.template,t.decls,t.vars,t.directiveDefs,t.pipeDefs,t.viewQuery,t.schemas,t.consts,t.id):n}function qf(t,n,e,i,o,a,r,s,c,d,l){let m=n.blueprint.slice();return m[Yn]=o,m[ve]=i|4|128|8|64|1024,(d!==null||t&&t[ve]&2048)&&(m[ve]|=2048),cp(m),m[Tt]=m[ho]=t,m[Ct]=e,m[Zn]=r||t&&t[Zn],m[mt]=s||t&&t[mt],m[Vi]=c||t&&t[Vi]||null,m[Qt]=a,m[xs]=RD(),m[sa]=l,m[np]=d,m[ln]=n.type==2?t[ln]:m,m}function zM(t,n,e){let i=An(n,t),o=jM(e),a=t[Zn].rendererFactory,r=Yf(t,qf(t,o,null,T_(e),i,n,null,a.createRenderer(i,e),null,null,null));return t[n.index]=r}function T_(t){let n=16;return t.signals?n=4096:t.onPush&&(n=64),n}function A_(t,n,e,i){if(e===0)return-1;let o=n.length;for(let a=0;a<e;a++)n.push(i),t.blueprint.push(i),t.data.push(null);return o}function Yf(t,n){return t[or]?t[tp][Nn]=n:t[or]=n,t[tp]=n,n}function h(t=1){O_(ht(),ye(),Dn()+t,!1)}function O_(t,n,e,i){if(!i)if((n[ve]&3)===3){let a=t.preOrderCheckHooks;a!==null&&ed(n,a,e)}else{let a=t.preOrderHooks;a!==null&&td(n,a,0,e)}vo(e)}var wd=(function(t){return t[t.None=0]="None",t[t.SignalBased=1]="SignalBased",t[t.HasDecoratorInputTransform=2]="HasDecoratorInputTransform",t})(wd||{});function rf(t,n,e,i){let o=de(null);try{let[a,r,s]=t.inputs[e],c=null;(r&wd.SignalBased)!==0&&(c=n[a][Ht]),c!==null&&c.transformFn!==void 0?i=c.transformFn(i):s!==null&&(i=s.call(n,i)),t.setInput!==null?t.setInput(n,c,i,e,a):Ly(n,c,a,i)}finally{de(o)}}function R_(t,n,e,i,o){let a=Dn(),r=i&2;try{vo(-1),r&&n.length>yt&&O_(t,n,yt,!1);let s=r?Ye.TemplateUpdateStart:Ye.TemplateCreateStart;et(s,o,e),e(i,o)}finally{vo(a);let s=r?Ye.TemplateUpdateEnd:Ye.TemplateCreateEnd;et(s,o,e)}}function Zf(t,n,e){qM(t,n,e),(e.flags&64)===64&&YM(t,n,e)}function Ed(t,n,e=An){let i=n.localNames;if(i!==null){let o=n.index+1;for(let a=0;a<i.length;a+=2){let r=i[a+1],s=r===-1?e(n,t):t[r];t[o++]=s}}}function HM(t,n,e,i){let a=i.get(c_,s_)||e===Qn.ShadowDom||e===Qn.ExperimentalIsolatedShadowDom,r=t.selectRootElement(n,a);return $M(r),r}function $M(t){UM(t)}var UM=()=>null;function GM(t){return t==="class"?"className":t==="for"?"htmlFor":t==="formaction"?"formAction":t==="innerHtml"?"innerHTML":t==="readonly"?"readOnly":t==="tabindex"?"tabIndex":t}function WM(t,n,e,i,o,a){let r=n[he];if(Dd(t,r,n,e,i)){gi(t)&&L_(n,t.index);return}t.type&3&&(e=GM(e)),P_(t,n,e,i,o,a)}function P_(t,n,e,i,o,a){if(t.type&3){let r=An(t,n);i=a!=null?a(i,t.value||"",e):i,i=F_(e,r,i),o.setProperty(r,e,i)}else t.type&12}function F_(t,n,e){return t==="src"&&(n.tagName==="IMG"||n.tagName==="VIDEO")?e==null?"":Rn(e):e}function L_(t,n){let e=On(n,t);e[ve]&16||(e[ve]|=64)}function qM(t,n,e){let i=e.directiveStart,o=e.directiveEnd;gi(e)&&zM(n,e,t.data[i+e.componentOffset]),t.firstCreatePass||cd(e,n);let a=e.initialInputs;for(let r=i;r<o;r++){let s=t.data[r],c=As(n,t,r,e);if(fr(c,n),a!==null&&XM(n,r-i,c,s,e,a),bi(s)){let d=On(e.index,n);d[Ct]=As(n,t,r,e)}}}function YM(t,n,e){let i=e.directiveStart,o=e.directiveEnd,a=e.index,r=Bv();try{vo(a);for(let s=i;s<o;s++){let c=t.data[s],d=n[s];Hl(s),(c.hostBindings!==null||c.hostVars!==0||c.hostAttrs!==null)&&ZM(c,d)}}finally{vo(-1),Hl(r)}}function ZM(t,n){t.hostBindings!==null&&t.hostBindings(1,n)}function B_(t,n){let e=t.directiveRegistry,i=null;if(e)for(let o=0;o<e.length;o++){let a=e[o];S_(n,a.selectors,!1)&&(i??=[],bi(a)?i.unshift(a):i.push(a))}return i}function KM(t,n,e,i,o,a){let r=An(t,n);i=F_(e,r,i),V_(n[mt],r,a,t.value,e,i,o)}function V_(t,n,e,i,o,a,r){if(a==null)r?.(a,i||"",o),t.removeAttribute(n,o,e);else{let s=r==null?Sn(a):r(a,i||"",o);t.setAttribute(n,o,s,e)}}function XM(t,n,e,i,o,a){let r=a[n];if(r!==null)for(let s=0;s<r.length;s+=2){let c=r[s],d=r[s+1];rf(i,e,c,d)}}function j_(t,n,e,i,o){let a=yt+e,r=n[he],s=o(r,n,t,i,e);n[a]=s,fa(t,!0);let c=t.type===2;return c?(x_(n[mt],s,t),(Av()===0||Ss(t))&&fr(s,n),Ov()):fr(s,n),Wl()&&(!c||!vd(t))&&Uf(r,n,s,t),t}function z_(t){let n=t;return vp()?yp():(n=n.parent,fa(n,!1)),n}function QM(t,n){let e=t[Vi];if(!e)return;let i;try{i=e.get(zi,null)}catch{i=null}i?.(n)}function Dd(t,n,e,i,o){let a=t.inputs?.[i],r=t.hostDirectiveInputs?.[i],s=!1;if(r)for(let c=0;c<r.length;c+=2){let d=r[c],l=r[c+1],m=n.data[d];rf(m,e[d],l,o),s=!0}if(a)for(let c of a){let d=e[c],l=n.data[c];rf(l,d,i,o),s=!0}return s}function JM(t,n){let e=On(n,t),i=e[he];eI(i,e);let o=e[Yn];o!==null&&e[sa]===null&&(e[sa]=l_(o,e[Vi])),et(Ye.ComponentStart);try{Kf(i,e,e[Ct])}finally{et(Ye.ComponentEnd,e[Ct])}}function eI(t,n){for(let e=n.length;e<t.blueprint.length;e++)n.push(t.blueprint[e])}function Kf(t,n,e){Ul(n);try{let i=t.viewQuery;i!==null&&qp(1,i,e);let o=t.template;o!==null&&R_(t,n,o,1,e),t.firstCreatePass&&(t.firstCreatePass=!1),n[hi]?.finishViewCreation(t),t.staticContentQueries&&d_(t,n),t.staticViewQueries&&qp(2,t.viewQuery,e);let a=t.components;a!==null&&tI(n,a)}catch(i){throw t.firstCreatePass&&(t.incompleteFirstPass=!0,t.firstCreatePass=!1),i}finally{n[ve]&=-5,Gl()}}function tI(t,n){for(let e=0;e<n.length;e++)JM(t,n[e])}function zs(t,n,e,i){let o=de(null);try{let a=n.tView,s=t[ve]&4096?4096:16,c=qf(t,a,e,s,null,n,null,null,i?.injector??null,i?.embeddedViewInjector??null,i?.dehydratedView??null),d=t[n.index];c[go]=d;let l=t[hi];return l!==null&&(c[hi]=l.createEmbeddedView(a)),Kf(a,c,e),c}finally{de(o)}}function hr(t,n){return!n||n.firstChild===null||Jy(t)}function Rs(t,n,e,i,o=!1){if(t.type===3){let a=t.firstChild,r=a.next,s=Jt(n[a.index]),c=Jt(n[r.index]),d=s;for(;d!==null&&(i.push(d),d!==c);)d=d.nextSibling;return i}for(;e!==null;){if(e.type===128){e=o?e.projectionNext:e.next;continue}let a=n[e.index];if(a!==null)if(Tn(a)){let s=a[da];s!==a[Yn]&&i.push(Jt(a)),a[ve]&4||H_(a,i),i.push(s)}else i.push(Jt(a));let r=e.type;if(r&8)Rs(t,n,e.child,i);else if(r&32){let s=Vf(e,n),c;for(;c=s();)i.push(c)}else if(r&16){let s=k_(n,e);if(Array.isArray(s))i.push(...s);else{let c=Fi(n[ln]);Rs(c[he],c,s,i,!0)}}e=o?e.projectionNext:e.next}return i}function H_(t,n){for(let e=St;e<t.length;e++){let i=t[e],o=i[he].firstChild;o!==null&&Rs(i[he],i,o,n)}}function $_(t){if(t[la]!==null){for(let n of t[la])n.impl.addSequence(n);t[la].length=0}}var U_=[];function nI(t){return t[wn]??iI(t)}function iI(t){let n=U_.pop()??Object.create(aI);return n.lView=t,n}function oI(t){t.lView[wn]!==t&&(t.lView=null,U_.push(t))}var aI=W(I({},$o),{consumerIsAlwaysLive:!0,kind:"template",consumerMarkedDirty:t=>{pa(t.lView)},consumerOnSignalRead(){this.lView[wn]=this}});function rI(t){let n=t[wn]??Object.create(sI);return n.lView=t,n}var sI=W(I({},$o),{consumerIsAlwaysLive:!0,kind:"template",consumerMarkedDirty:t=>{let n=Fi(t.lView);for(;n&&!G_(n[he]);)n=Fi(n);n&&lp(n)},consumerOnSignalRead(){this.lView[wn]=this}});function G_(t){return t.type!==2}function W_(t){if(t[Pi]===null)return;let n=!0;for(;n;){let e=!1;for(let i of t[Pi])if(i.dirty&&(e=!0,i.zone===null||Zone.current===i.zone?i.run():i.zone.run(()=>i.run()),t[Pi]===null))return;n=e&&!!(t[ve]&8192)}}var cI=100;function q_(t,n=0){let i=t[Zn].rendererFactory,o=!1;o||i.begin?.();try{lI(t,n)}finally{o||i.end?.()}}function lI(t,n){let e=xp();try{fs(!0),sf(t,n);let i=0;for(;ws(t);){if(i===cI)throw new te(103,!1);i++,sf(t,1)}}finally{fs(e)}}function dI(t,n,e,i){if(ma(n))return;let o=n[ve],a=!1,r=!1;Ul(n);let s=!0,c=null,d=null;a||(G_(t)?(d=nI(n),c=ro(d)):Bc()===null?(s=!1,d=rI(n),c=ro(d)):n[wn]&&(so(n[wn]),n[wn]=null));try{cp(n),Pv(t.bindingStartIndex),e!==null&&R_(t,n,e,2,i);let l=(o&3)===3;if(!a)if(l){let g=t.preOrderCheckHooks;g!==null&&ed(n,g,null)}else{let g=t.preOrderHooks;g!==null&&td(n,g,0,null),Tp(n,0)}if(r||uI(n),W_(n),Y_(n,0),t.contentQueries!==null&&d_(t,n),!a)if(l){let g=t.contentCheckHooks;g!==null&&ed(n,g)}else{let g=t.contentHooks;g!==null&&td(n,g,1),Tp(n,1)}pI(t,n);let m=t.components;m!==null&&K_(n,m,0);let v=t.viewQuery;if(v!==null&&qp(2,v,i),!a)if(l){let g=t.viewCheckHooks;g!==null&&ed(n,g)}else{let g=t.viewHooks;g!==null&&td(n,g,2),Tp(n,2)}if(t.firstUpdatePass===!0&&(t.firstUpdatePass=!1),n[Pl]){for(let g of n[Pl])g();n[Pl]=null}a||($_(n),n[ve]&=-73)}catch(l){let m=!1,v=l,g=n;for(;g!==null;){if(Tn(g)){g=g[Tt];continue}let y=g[ar];if(y)try{let _=n[ln][Ct],C=_?.constructor,w={declarationInstance:_,declarationType:C,caughtBy:y},E=de(null);try{y(Kv(v),w)}finally{de(E)}m=!0;break}catch(_){v=_}g=g[Tt]}if(!m)throw a||pa(n),v}finally{d!==null&&(Uo(d,c),s&&oI(d)),Gl()}}function Y_(t,n){for(let e=t_(t);e!==null;e=n_(e))for(let i=St;i<e.length;i++){let o=e[i];Z_(o,n)}}function uI(t){for(let n=t_(t);n!==null;n=n_(n)){if(!(n[ve]&2))continue;let e=n[ua];for(let i=0;i<e.length;i++){let o=e[i];lp(o)}}}function mI(t,n,e){et(Ye.ComponentStart);let i=On(n,t);try{Z_(i,e)}finally{et(Ye.ComponentEnd,i[Ct])}}function Z_(t,n){Bl(t)&&sf(t,n)}function sf(t,n){let i=t[he],o=t[ve],a=t[wn],r=!!(n===0&&o&16);if(r||=!!(o&64&&n===0),r||=!!(o&1024),r||=!!(a?.dirty&&$a(a)),r||=!1,a&&(a.dirty=!1),t[ve]&=-9217,r)dI(i,t,i.template,t[Ct]);else if(o&8192){let s=de(null);try{W_(t),Y_(t,1);let c=i.components;c!==null&&K_(t,c,1),$_(t)}finally{de(s)}}}function K_(t,n,e){for(let i=0;i<n.length;i++)mI(t,n[i],e)}function pI(t,n){let e=t.hostBindingOpCodes;if(e!==null)try{for(let i=0;i<e.length;i++){let o=e[i];if(o<0)vo(~o);else{let a=o,r=e[++i],s=e[++i];Lv(r,a);let c=n[a];et(Ye.HostBindingsUpdateStart,c);try{s(2,c)}finally{et(Ye.HostBindingsUpdateEnd,c)}}}}finally{vo(-1)}}function Xf(t,n){let e=xp()?64:1088;for(t[Zn].changeDetectionScheduler?.notify(n);t;){t[ve]|=e;let i=Fi(t);if(rr(t)&&!i)return t;t=i}return null}function X_(t,n,e,i){return[t,!0,0,n,null,i,null,e,null,null]}function Q_(t,n){let e=St+n;if(e<t.length)return t[e]}function Hs(t,n,e,i=!0){let o=n[he];if(fI(o,n,t,e),i){let r=af(e,t),s=n[mt],c=s.parentNode(t[da]);c!==null&&IM(o,t[Qt],s,n,c,r)}let a=n[sa];a!==null&&a.firstChild!==null&&(a.firstChild=null)}function J_(t,n){let e=Ps(t,n);return e!==void 0&&Cd(e[he],e),e}function Ps(t,n){if(t.length<=St)return;let e=St+n,i=t[e];if(i){let o=i[go];o!==null&&o!==t&&$f(o,i),n>0&&(t[e-1][Nn]=i[Nn]);let a=ys(t,St+n);MM(i[he],i);let r=a[hi];r!==null&&r.detachView(a[he]),i[Tt]=null,i[Nn]=null,i[ve]&=-129}return i}function fI(t,n,e,i){let o=St+i,a=e.length;i>0&&(e[o-1][Nn]=n),i<a-St?(n[Nn]=e[o],Zm(e,St+i,n)):(e.push(n),n[Nn]=null),n[Tt]=e;let r=n[go];r!==null&&e!==r&&e0(r,n);let s=n[hi];s!==null&&s.insertView(t),Vl(n),n[ve]|=128}function e0(t,n){let e=t[ua],i=n[Tt];if(ji(i))t[ve]|=2;else{let o=i[Tt][ln];n[ln]!==o&&(t[ve]|=2)}e===null?t[ua]=[n]:e.push(n)}var _o=class{_lView;_cdRefInjectingView;_appRef=null;_attachedToViewContainer=!1;exhaustive;get rootNodes(){let n=this._lView,e=n[he];return Rs(e,n,e.firstChild,[])}constructor(n,e){this._lView=n,this._cdRefInjectingView=e}get context(){return this._lView[Ct]}set context(n){this._lView[Ct]=n}get destroyed(){return ma(this._lView)}destroy(){if(this._appRef)this._appRef.detachView(this);else if(this._attachedToViewContainer){let n=this._lView[Tt];if(Tn(n)){let e=n[Cs],i=e?e.indexOf(this):-1;i>-1&&(Ps(n,i),ys(e,i))}this._attachedToViewContainer=!1}Cd(this._lView[he],this._lView)}onDestroy(n){jl(this._lView,n)}markForCheck(){Xf(this._cdRefInjectingView||this._lView,4)}detach(){this._lView[ve]&=-129}reattach(){Vl(this._lView),this._lView[ve]|=128}detectChanges(){this._lView[ve]|=1024,q_(this._lView)}checkNoChanges(){}attachToViewContainerRef(){if(this._appRef)throw new te(902,!1);this._attachedToViewContainer=!0}detachFromAppRef(){this._appRef=null;let n=rr(this._lView),e=this._lView[go];e!==null&&!n&&$f(e,this._lView),D_(this._lView[he],this._lView)}attachToAppRef(n){if(this._attachedToViewContainer)throw new te(902,!1);this._appRef=n;let e=rr(this._lView),i=this._lView[go];i!==null&&!e&&e0(i,this._lView),Vl(this._lView)}};var At=(()=>{class t{_declarationLView;_declarationTContainer;elementRef;static __NG_ELEMENT_ID__=hI;constructor(e,i,o){this._declarationLView=e,this._declarationTContainer=i,this.elementRef=o}get ssrId(){return this._declarationTContainer.tView?.ssrId||null}createEmbeddedView(e,i){return this.createEmbeddedViewImpl(e,i)}createEmbeddedViewImpl(e,i,o){let a=zs(this._declarationLView,this._declarationTContainer,e,{embeddedViewInjector:i,dehydratedView:o});return new _o(a)}}return t})();function hI(){return Md(qt(),ye())}function Md(t,n){return t.type&4?new At(n,t,yr(t,n)):null}function _a(t,n,e,i,o){let a=t.data[n];if(a===null)a=gI(t,n,e,i,o),Fv()&&(a.flags|=32);else if(a.type&64){a.type=e,a.value=i,a.attrs=o;let r=Rv();a.injectorIndex=r===null?-1:r.injectorIndex}return fa(a,!0),a}function gI(t,n,e,i,o){let a=bp(),r=vp(),s=r?a:a&&a.parent,c=t.data[n]=vI(t,s,e,n,i,o);return bI(t,c,a,r),c}function bI(t,n,e,i){t.firstChild===null&&(t.firstChild=n),e!==null&&(i?e.child==null&&n.parent!==null&&(e.child=n):e.next===null&&(e.next=n,n.prev=e))}function vI(t,n,e,i,o,a){let r=n?n.injectorIndex:-1,s=0;return fp()&&(s|=128),{type:e,index:i,insertBeforeIndex:null,injectorIndex:r,directiveStart:-1,directiveEnd:-1,directiveStylingLast:-1,componentOffset:-1,controlDirectiveIndex:-1,customControlIndex:-1,propertyBindings:null,flags:s,providerIndexes:0,value:o,namespace:wp(),attrs:a,mergedAttrs:null,localNames:null,initialInputs:null,inputs:null,hostDirectiveInputs:null,outputs:null,hostDirectiveOutputs:null,directiveToIndex:null,tView:null,next:null,prev:null,projectionNext:null,child:null,parent:n,projection:null,styles:null,stylesWithoutHost:null,residualStyles:void 0,classes:null,classesWithoutHost:null,residualClasses:void 0,classBindings:0,styleBindings:0}}function yI(t){let n=t[ip]??[],i=t[Tt][mt],o=[];for(let a of n)a.data[r_]!==void 0?o.push(a):_I(a,i);t[ip]=o}function _I(t,n){let e=0,i=t.firstChild;if(i){let o=t.data[a_];for(;e<o;){let a=i.nextSibling;__(n,i,!1),i=a,e++}}}var xI=()=>null,CI=()=>null;function ld(t,n){return xI(t,n)}function t0(t,n,e){return CI(t,n,e)}var n0=class{},Lt=class{},Ue=class{destroyNode=null;static __NG_ELEMENT_ID__=()=>SI()};function SI(){let t=ye(),n=qt(),e=On(n.index,t);return(ji(e)?e:t)[mt]}var i0=(()=>{class t{static \u0275prov=Le({token:t,providedIn:"root",factory:()=>null})}return t})();function o0(t){return t.debugInfo?.className||t.type.name||null}var id={},dd=class{injector;parentInjector;constructor(n,e){this.injector=n,this.parentInjector=e}get(n,e,i){let o=this.injector.get(n,id,i);return o!==id||e===id?o:this.parentInjector.get(n,e,i)}};function Pn(t,n,e){if(e===en)return!1;let i=t[n];return Object.is(i,e)?!1:(t[n]=e,!0)}function ud(t,n,e,i){let o=Pn(t,n,e);return Pn(t,n+1,i)||o}function wI(t,n,e,i,o){let a=ud(t,n,e,i);return Pn(t,n+2,o)||a}function EI(t,n,e,i,o,a){let r=ud(t,n,e,i);return ud(t,n+2,o,a)||r}function od(t,n,e){return function i(o){let a=i.__ngNativeEl__;a!==void 0&&FD(o,a);let r=gi(t)?On(t.index,n):n;Xf(r,5);let s=n[Ct],c=xy(n,s,e,o),d=i.__ngNextListenerFn__;for(;d;)c=xy(n,s,d,o)&&c,d=d.__ngNextListenerFn__;return c}}function xy(t,n,e,i){let o=de(null);try{return et(Ye.OutputStart,n,e),e(i)!==!1}catch(a){return QM(t,a),!1}finally{et(Ye.OutputEnd,n,e),de(o)}}function a0(t,n,e,i,o,a,r,s){let c=Ss(t),d=!1,l=null;if(!i&&c&&(l=MI(n,e,a,t.index)),l!==null){let m=l.__ngLastListenerFn__||l;m.__ngNextListenerFn__=r,l.__ngLastListenerFn__=r,d=!0}else{let m=An(t,e),v=i?i(m):m;BD(e,v,a,s),i||(s.__ngNativeEl__=m);let g=o.listen(v,a,s);if(!DI(a)){let y=i?_=>i(Jt(_[t.index])):t.index;r0(y,n,e,a,s,g,!1)}}return d}function DI(t){return t.startsWith("animation")||t.startsWith("transition")}function MI(t,n,e,i){let o=t.cleanup;if(o!=null)for(let a=0;a<o.length-1;a+=2){let r=o[a];if(r===e&&o[a+1]===i){let s=n[ir],c=o[a+2];return s&&s.length>c?s[c]:null}typeof r=="string"&&(a+=2)}return null}function r0(t,n,e,i,o,a,r){let s=n.firstCreatePass?up(n):null,c=dp(e),d=c.length;c.push(o,a),s&&s.push(i,t,d,(d+1)*(r?-1:1))}function Cy(t,n,e,i,o,a){let r=n[e],s=n[he],d=s.data[e].outputs[i],m=r[d].subscribe(a);r0(t.index,s,n,o,a,m,!0)}var cf=Symbol("BINDING");var xa=new D("");function md(t,n,e){let i=e?t.styles:null,o=e?t.classes:null,a=0;if(n!==null)for(let r=0;r<n.length;r++){let s=n[r];if(typeof s=="number")a=s;else if(a==1)o=Ml(o,s);else if(a==2){let c=s,d=n[++r];i=Ml(i,c+": "+d+";")}}e?t.styles=i:t.stylesWithoutHost=i,e?t.classes=o:t.classesWithoutHost=o}function Yt(t,n=0){let e=ye();if(e===null)return be(t,n);let i=qt();return Zy(i,e,Xt(t),n)}function Qf(){let t="invalid";throw new Error(t)}function s0(t,n,e,i,o){let a=i===null?null:{"":-1},r=o(t,e);if(r!==null){let s=r,c=null,d=null;for(let l of r)if(l.resolveHostDirectives!==null){[s,c,d]=l.resolveHostDirectives(r);break}NI(t,n,e,s,a,c,d)}a!==null&&i!==null&&II(e,i,a)}function II(t,n,e){let i=t.localNames=[];for(let o=0;o<n.length;o+=2){let a=e[n[o+1]];if(a==null)throw new te(-301,!1);i.push(n[o],a)}}function kI(t,n,e){n.componentOffset=e,(t.components??=[]).push(n.index)}function NI(t,n,e,i,o,a,r){let s=i.length,c=null;for(let v=0;v<s;v++){let g=i[v];c===null&&bi(g)&&(c=g,kI(t,e,v)),$p(cd(e,n),t,g.type)}FI(e,t.data.length,s),c?.viewProvidersResolver&&c.viewProvidersResolver(c);for(let v=0;v<s;v++){let g=i[v];g.providersResolver&&g.providersResolver(g)}let d=!1,l=!1,m=A_(t,n,s,null);s>0&&(e.directiveToIndex=new Map);for(let v=0;v<s;v++){let g=i[v];if(e.mergedAttrs=pr(e.mergedAttrs,g.hostAttrs),AI(t,e,n,m,g),PI(m,g,o),r!==null&&r.has(g)){let[_,C]=r.get(g);e.directiveToIndex.set(g.type,[m,_+e.directiveStart,C+e.directiveStart])}else(a===null||!a.has(g))&&e.directiveToIndex.set(g.type,m);g.contentQueries!==null&&(e.flags|=4),(g.hostBindings!==null||g.hostAttrs!==null||g.hostVars!==0)&&(e.flags|=64);let y=g.type.prototype;!d&&(y.ngOnChanges||y.ngOnInit||y.ngDoCheck)&&((t.preOrderHooks??=[]).push(e.index),d=!0),!l&&(y.ngOnChanges||y.ngDoCheck)&&((t.preOrderCheckHooks??=[]).push(e.index),l=!0),m++}TI(t,e,a)}function TI(t,n,e){for(let i=n.directiveStart;i<n.directiveEnd;i++){let o=t.data[i];if(e===null||!e.has(o))Sy(0,n,o,i),Sy(1,n,o,i),Ey(n,i,!1);else{let a=e.get(o);wy(0,n,a,i),wy(1,n,a,i),Ey(n,i,!0)}}}function Sy(t,n,e,i){let o=t===0?e.inputs:e.outputs;for(let a in o)if(Object.hasOwn(o,a)){let r;t===0?r=n.inputs??={}:r=n.outputs??={},r[a]??=[],r[a].push(i),c0(n,a)}}function wy(t,n,e,i){let o=t===0?e.inputs:e.outputs;for(let a in o)if(Object.hasOwn(o,a)){let r=o[a],s;t===0?s=n.hostDirectiveInputs??={}:s=n.hostDirectiveOutputs??={},s[r]??=[],s[r].push(i,a),c0(n,r)}}function c0(t,n){n==="class"?t.flags|=8:n==="style"&&(t.flags|=16)}function Ey(t,n,e){let{attrs:i,inputs:o,hostDirectiveInputs:a}=t;if(i===null||!e&&o===null||e&&a===null||Bf(t)){t.initialInputs??=[],t.initialInputs.push(null);return}let r=null,s=0;for(;s<i.length;){let c=i[s];if(c===0){s+=4;continue}else if(c===5){s+=2;continue}else if(typeof c=="number")break;if(!e&&Object.hasOwn(o,c)){let d=o[c];for(let l of d)if(l===n){r??=[],r.push(c,i[s+1]);break}}else if(e&&Object.hasOwn(a,c)){let d=a[c];for(let l=0;l<d.length;l+=2)if(d[l]===n){r??=[],r.push(d[l+1],i[s+1]);break}}s+=2}t.initialInputs??=[],t.initialInputs.push(r)}function AI(t,n,e,i,o){t.data[i]=o;let a=o.factory||(o.factory=na(o.type,!0)),r=new va(a,bi(o),Yt,null);t.blueprint[i]=r,e[i]=r,OI(t,n,i,A_(t,e,o.hostVars,en),o)}function OI(t,n,e,i,o){let a=o.hostBindings;if(a){let r=t.hostBindingOpCodes;r===null&&(r=t.hostBindingOpCodes=[]);let s=~n.index;RI(r)!=s&&r.push(s),r.push(e,i,a)}}function RI(t){let n=t.length;for(;n>0;){let e=t[--n];if(typeof e=="number"&&e<0)return e}return 0}function PI(t,n,e){if(e){if(n.exportAs)for(let i=0;i<n.exportAs.length;i++)e[n.exportAs[i]]=t;bi(n)&&(e[""]=t)}}function FI(t,n,e){t.flags|=1,t.directiveStart=n,t.directiveEnd=n+e,t.providerIndexes=n}function l0(t,n,e,i,o,a,r,s){let c=n[he],d=c.consts,l=En(d,r),m=_a(c,t,e,i,l);return a&&s0(c,n,m,En(d,s),o),m.mergedAttrs=pr(m.mergedAttrs,m.attrs),m.attrs!==null&&md(m,m.attrs,!1),m.mergedAttrs!==null&&md(m,m.mergedAttrs,!0),c.queries!==null&&c.queries.elementStart(c,m),m}function d0(t,n){jy(t,n),op(n)&&t.queries.elementEnd(n)}function LI(t,n,e,i,o,a){let r=n.consts,s=En(r,o),c=_a(n,t,e,i,s);if(c.mergedAttrs=pr(c.mergedAttrs,c.attrs),a!=null){let d=En(r,a);c.localNames=[];for(let l=0;l<d.length;l+=2)c.localNames.push(d[l],-1)}return c.attrs!==null&&md(c,c.attrs,!1),c.mergedAttrs!==null&&md(c,c.mergedAttrs,!0),n.queries!==null&&n.queries.elementStart(n,c),c}var u0=typeof ShadowRoot<"u",BI=typeof Document<"u";function VI(t){return Object.keys(t).map(n=>{let[e,i,o]=t[n],a={propName:e,templateName:n,isSignal:(i&wd.SignalBased)!==0};return o&&(a.transform=o),a})}function jI(t){return Object.keys(t).map(n=>({propName:t[n],templateName:n}))}function zI(t,n,e){let i=n instanceof xt?n:n?.injector;return i&&t.getStandaloneInjector!==null&&(i=t.getStandaloneInjector(i)||i),i?new dd(e,i):e}function HI(t){let n=t.get(Lt,null);if(n===null)throw new te(407,!1);let e=t.get(i0,null),i=t.get(fi,null),o=t.get(Jn,null,{optional:!0});return{rendererFactory:n,sanitizer:e,changeDetectionScheduler:i,ngReflect:!1,tracingService:o}}function $I(t,n,e){let i=m0(t);return v_(n,i,i==="svg"?ap:i==="math"?Dv:e)}function UI(t){if((t&&"localName"in t&&typeof t.localName=="string"?t.localName:t?.tagName)?.toLowerCase()==="script")throw new te(905,!1)}function m0(t){return(t.selectors[0][0]||"div").toLowerCase()}var gr=class{componentDef;ngModule;selector;componentType;ngContentSelectors;isBoundToModule;cachedInputs=null;cachedOutputs=null;get inputs(){return this.cachedInputs??=VI(this.componentDef.inputs),this.cachedInputs}get outputs(){return this.cachedOutputs??=jI(this.componentDef.outputs),this.cachedOutputs}constructor(n,e){this.componentDef=n,this.ngModule=e,this.componentType=n.type,this.selector=vM(n.selectors),this.ngContentSelectors=n.ngContentSelectors??[],this.isBoundToModule=!!e}create(n,e,i,o,a,r,s,c){et(Ye.DynamicComponentStart);let d=de(null);try{let l=this.componentDef,m=zI(l,o||this.ngModule,n),v=HI(m),g=v.tracingService;return g&&g.componentCreate?g.componentCreate(o0(l),()=>this.createComponentRef(v,m,e,i,a,r,s,c)):this.createComponentRef(v,m,e,i,a,r,s,c)}finally{de(d)}}createComponentRef(n,e,i,o,a,r,s,c){let d=this.componentDef,l=GI(o,d,r,a,c),m=n.rendererFactory.createRenderer(null,d),v=o?HM(m,o,d.encapsulation,e):$I(d,m,s??null);UI(v);let g=e.get(xa,null),y=WI(v,()=>e.get(ae,null)??o_());g&&g.addHost(y);let _=r?.some(Dy)||a?.some(E=>typeof E!="function"&&E.bindings.some(Dy)),C=qf(null,l,null,512|T_(d),null,null,n,m,e,null,l_(v,e,!0));g&&u0&&y instanceof ShadowRoot&&jl(C,()=>{g.removeHost(y)}),C[yt]=v,Ul(C);let w=null;try{let E=l0(yt,C,2,"#host",()=>l.directiveRegistry,!0,0);x_(m,v,E),fr(v,C),Zf(l,C,E),u_(l,E,C),d0(l,E),i!==void 0&&YI(E,this.ngContentSelectors,i),w=On(E.index,C),C[Ct]=w[Ct],Kf(l,C,null)}catch(E){throw w!==null&&Gp(w),Gp(C),E}finally{et(Ye.DynamicComponentEnd),Gl()}return new pd(this.componentType,C,!!_)}};function GI(t,n,e,i,o){let a=t?["ng-version","22.2.3"]:yM(n.selectors[0]),r=null,s=null,c=0;if(e)for(let m of e)c+=m[cf].requiredVars,m.create&&(m.targetIdx=0,(r??=[]).push(m)),m.update&&(m.targetIdx=0,(s??=[]).push(m));if(i)for(let m=0;m<i.length;m++){let v=i[m];if(typeof v!="function")for(let g of v.bindings){c+=g[cf].requiredVars;let y=m+1;g.create&&(g.targetIdx=y,(r??=[]).push(g)),g.update&&(g.targetIdx=y,(s??=[]).push(g))}}let d=[n];if(i)for(let m of i){let v=typeof m=="function"?m:m.type,g=Nl(v);d.push(g)}return Wf(0,null,qI(r,s),1,c,d,null,null,null,[a],null)}function WI(t,n){let e=t.getRootNode?.();return BI&&e instanceof Document?e.head:e&&u0&&e instanceof ShadowRoot?e:n().head}function qI(t,n){return!t&&!n?null:e=>{if(e&1&&t)for(let i of t)i.create();if(e&2&&n)for(let i of n)i.update()}}function Dy(t){let n=t[cf].kind;return n==="input"||n==="twoWay"}var pd=class extends n0{_rootLView;_hasInputBindings;instance;hostView;changeDetectorRef;componentType;location;previousInputValues=null;_tNode;constructor(n,e,i){super(),this._rootLView=e,this._hasInputBindings=i,this._tNode=Fl(e[he],yt),this.location=yr(this._tNode,e),this.instance=On(this._tNode.index,e)[Ct],this.hostView=this.changeDetectorRef=new _o(e,void 0),this.componentType=n}setInput(n,e){this._hasInputBindings;let i=this._tNode;if(this.previousInputValues??=new Map,this.previousInputValues.has(n)&&Object.is(this.previousInputValues.get(n),e))return;let o=this._rootLView,a=Dd(i,o[he],o,n,e);this.previousInputValues.set(n,e);let r=On(i.index,o);Xf(r,1)}get injector(){return new $i(this._tNode,this._rootLView)}destroy(){this.hostView.destroy()}onDestroy(n){this.hostView.onDestroy(n)}};function YI(t,n,e){let i=t.projection=[];for(let o=0;o<n.length;o++){let a=e[o];i.push(a!=null&&a.length?Array.from(a):null)}}var Bt=(()=>{class t{static __NG_ELEMENT_ID__=ZI}return t})();function ZI(){let t=qt();return p0(t,ye())}var lf=class t extends Bt{_lContainer;_hostTNode;_hostLView;constructor(n,e,i){super(),this._lContainer=n,this._hostTNode=e,this._hostLView=i}get element(){return yr(this._hostTNode,this._hostLView)}get injector(){return new $i(this._hostTNode,this._hostLView)}get parentInjector(){let n=Df(this._hostTNode,this._hostLView);if($y(n)){let e=sd(n,this._hostLView),i=rd(n),o=e[he].data[i+8];return new $i(o,e)}else return new $i(null,this._hostLView)}clear(){for(;this.length>0;)this.remove(this.length-1)}get(n){let e=My(this._lContainer);return e!==null&&e[n]||null}get length(){return this._lContainer.length-St}createEmbeddedView(n,e,i){let o,a,r;typeof i=="number"?o=i:i!=null&&(o=i.index,a=i.injector,r=i.onError);let s=ld(this._lContainer,n.ssrId),c=n.createEmbeddedViewImpl(e||{},a,s);return r&&(c._lView[ar]=r),this.insertImpl(c,o,hr(this._hostTNode,s)),c}createComponent(n,e,i,o,a,r,s){let c,d,l=e||{};c=l.index,i=l.injector,o=l.projectableNodes,a=l.environmentInjector||l.ngModuleRef,r=l.directives,s=l.bindings,d=l.onError;let m=new gr(po(n)),v=i||this.parentInjector;if(!a&&m.ngModule==null){let E=this.parentInjector.get(xt,null);E&&(a=E)}let g=po(m.componentType??{}),y=ld(this._lContainer,g?.id??null),_=y?.firstChild??null,C=m.create(v,o,_,a,r,s,this._getHostElementNamespace());return d&&(C.hostView._lView[ar]=d),this.insertImpl(C.hostView,c,hr(this._hostTNode,y)),C}_getHostElementNamespace(){if(this._hostTNode.type&2){let n=this._hostTNode.parent??this._hostLView[Qt];return n!==null&&n.type&2&&typeof n.value=="string"&&n.value.toLowerCase()==="foreignobject"?null:n?.namespace??null}return this._hostTNode.namespace}insert(n,e){return this.insertImpl(n,e,!0)}insertImpl(n,e,i){let o=n._lView;if(Iv(o)){let s=this.indexOf(n);if(s!==-1)this.detach(s);else{let c=o[Tt],d=new t(c,c[Qt],c[Tt]);d.detach(d.indexOf(n))}}let a=this._adjustIndex(e),r=this._lContainer;return Hs(r,o,a,i),n.attachToViewContainerRef(),Zm(Rp(r),a,n),n}move(n,e){return this.insert(n,e)}indexOf(n){let e=My(this._lContainer);return e!==null?e.indexOf(n):-1}remove(n){let e=this._adjustIndex(n,-1),i=Ps(this._lContainer,e);i&&(ys(Rp(this._lContainer),e),Cd(i[he],i))}detach(n){let e=this._adjustIndex(n,-1),i=Ps(this._lContainer,e);return i&&ys(Rp(this._lContainer),e)!=null?new _o(i):null}_adjustIndex(n,e=0){return n??this.length+e}};function My(t){return t[Cs]}function Rp(t){return t[Cs]||(t[Cs]=[])}function p0(t,n){let e,i=n[t.index];return Tn(i)?e=i:(e=X_(i,n,null,t),n[t.index]=e,Yf(n,e)),XI(e,n,t,i),new lf(e,t,n)}function KI(t,n){let e=t[mt],i=e.createComment(""),o=An(n,t),a=e.parentNode(o);return ba(e,a,i,e.nextSibling(o),!1),i}var XI=ek,QI=()=>!1;function JI(t,n,e){return QI(t,n,e)}function ek(t,n,e,i){if(t[da])return;let o;e.type&8?o=Jt(i):o=KI(n,e),t[da]=o}var df=class t{queryList;matches=null;constructor(n){this.queryList=n}clone(){return new t(this.queryList)}setDirty(){this.queryList.setDirty()}},uf=class t{queries;constructor(n=[]){this.queries=n}createEmbeddedView(n){let e=n.queries;if(e!==null){let i=n.contentQueries!==null?n.contentQueries[0]:e.length,o=[];for(let a=0;a<i;a++){let r=e.getByIndex(a),s=this.queries[r.indexInDeclarationView];o.push(s.clone())}return new t(o)}return null}insertView(n){this.dirtyQueriesWithMatches(n)}detachView(n){this.dirtyQueriesWithMatches(n)}finishViewCreation(n){this.dirtyQueriesWithMatches(n)}dirtyQueriesWithMatches(n){for(let e=0;e<this.queries.length;e++)eh(n,e).matches!==null&&this.queries[e].setDirty()}},fd=class{flags;read;predicate;constructor(n,e,i=null){this.flags=e,this.read=i,typeof n=="string"?this.predicate=ak(n):this.predicate=n}},mf=class t{queries;constructor(n=[]){this.queries=n}elementStart(n,e){for(let i=0;i<this.queries.length;i++)this.queries[i].elementStart(n,e)}elementEnd(n){for(let e=0;e<this.queries.length;e++)this.queries[e].elementEnd(n)}embeddedTView(n){let e=null;for(let i=0;i<this.length;i++){let o=e!==null?e.length:0,a=this.getByIndex(i).embeddedTView(n,o);a&&(a.indexInDeclarationView=i,e!==null?e.push(a):e=[a])}return e!==null?new t(e):null}template(n,e){for(let i=0;i<this.queries.length;i++)this.queries[i].template(n,e)}getByIndex(n){return this.queries[n]}get length(){return this.queries.length}track(n){this.queries.push(n)}},pf=class t{metadata;matches=null;indexInDeclarationView=-1;crossesNgTemplate=!1;_declarationNodeIndex;_appliesToNextNode=!0;constructor(n,e=-1){this.metadata=n,this._declarationNodeIndex=e}elementStart(n,e){this.isApplyingToNode(e)&&this.matchTNode(n,e)}elementEnd(n){this._declarationNodeIndex===n.index&&(this._appliesToNextNode=!1)}template(n,e){this.elementStart(n,e)}embeddedTView(n,e){return this.isApplyingToNode(n)?(this.crossesNgTemplate=!0,this.addMatch(-n.index,e),new t(this.metadata)):null}isApplyingToNode(n){if(this._appliesToNextNode&&(this.metadata.flags&1)!==1){let e=this._declarationNodeIndex,i=n.parent;for(;i!==null&&i.type&8&&i.index!==e;)i=i.parent;return e===(i!==null?i.index:-1)}return this._appliesToNextNode}matchTNode(n,e){let i=this.metadata.predicate;if(Array.isArray(i))for(let o=0;o<i.length;o++){let a=i[o];this.matchTNodeWithReadOption(n,e,tk(e,a)),this.matchTNodeWithReadOption(n,e,nd(e,n,a,!1,!1))}else i===At?e.type&4&&this.matchTNodeWithReadOption(n,e,-1):this.matchTNodeWithReadOption(n,e,nd(e,n,i,!1,!1))}matchTNodeWithReadOption(n,e,i){if(i!==null){let o=this.metadata.read;if(o!==null)if(o===q||o===Bt||o===ie||o===At&&e.type&4)this.addMatch(e.index,-2);else{let a=nd(e,n,o,!1,!1);a!==null&&this.addMatch(e.index,a)}else this.addMatch(e.index,i)}}addMatch(n,e){this.matches===null?this.matches=[n,e]:this.matches.push(n,e)}};function tk(t,n){let e=t.localNames;if(e!==null){for(let i=0;i<e.length;i+=2)if(e[i]===n)return e[i+1]}return null}function nk(t,n){return t.type&11?yr(t,n):t.type&4?Md(t,n):null}function ik(t,n,e,i){return e===-1?nk(n,t):e===-2?ok(t,n,i):As(t,t[he],e,n)}function ok(t,n,e){if(e===q)return yr(n,t);if(e===At)return Md(n,t);if(e===Bt)return p0(n,t);if(e===ie)return new $i(n,t)}function f0(t,n,e,i){let o=n[hi].queries[i];if(o.matches===null){let a=t.data,r=e.matches,s=[];for(let c=0;r!==null&&c<r.length;c+=2){let d=r[c];if(d<0)s.push(null);else{let l=a[d];s.push(ik(n,l,r[c+1],e.metadata.read))}}o.matches=s}return o.matches}function ff(t,n,e,i){let o=t.queries.getByIndex(e),a=o.matches;if(a!==null){let r=f0(t,n,o,e);for(let s=0;s<a.length;s+=2){let c=a[s];if(c>0)i.push(r[s/2]);else{let d=a[s+1],l=n[-c];for(let m=St;m<l.length;m++){let v=l[m];v[go]===v[Tt]&&ff(v[he],v,d,i)}if(l[ua]!==null){let m=l[ua];for(let v=0;v<m.length;v++){let g=m[v];ff(g[he],g,d,i)}}}}}return i}function Jf(t,n){return t[hi].queries[n].queryList}function h0(t,n,e){let i=new Mn((e&4)===4);return Tv(t,n,i,i.destroy),(n[hi]??=new uf).queries.push(new df(i))-1}function g0(t,n,e){let i=ht();return i.firstCreatePass&&(v0(i,new fd(t,n,e),-1),(n&2)===2&&(i.staticViewQueries=!0)),h0(i,ye(),n)}function b0(t,n,e,i){let o=ht();if(o.firstCreatePass){let a=qt();v0(o,new fd(n,e,i),a.index),rk(o,t),(e&2)===2&&(o.staticContentQueries=!0)}return h0(o,ye(),e)}function ak(t){return t.split(",").map(n=>n.trim())}function v0(t,n,e){t.queries===null&&(t.queries=new mf),t.queries.track(new pf(n,e))}function rk(t,n){let e=t.contentQueries||(t.contentQueries=[]),i=e.length?e[e.length-1]:-1;n!==i&&e.push(t.queries.length-1,n)}function eh(t,n){return t.queries.getByIndex(n)}function y0(t,n){let e=t[he],i=eh(e,n);return i.crossesNgTemplate?ff(e,t,n,[]):f0(e,t,i,n)}function _0(t,n,e){let i,o=rs(()=>{i._dirtyCounter();let a=sk(i,t);if(n&&a===void 0)throw new te(-951,!1);return a});return i=o[Ht],i._dirtyCounter=G(0),i._flatValue=void 0,o}function th(t){return _0(!0,!1,t)}function nh(t){return _0(!0,!0,t)}function x0(t,n){let e=t[Ht];e._lView=ye(),e._queryIndex=n,e._queryList=Jf(e._lView,n),e._queryList.onDirty(()=>e._dirtyCounter.update(i=>i+1))}function sk(t,n){let e=t._lView,i=t._queryIndex;if(e===void 0||i===void 0||e[ve]&4)return n?void 0:sn;let o=Jf(e,i),a=y0(e,i);return o.reset(a,Qy),n?o.first:o._changesDetected||t._flatValue===void 0?t._flatValue=o.toArray():t._flatValue}function Ca(t){return!!t&&typeof t.then=="function"}function ih(t){return!!t&&typeof t.subscribe=="function"}var xo=class{};var Fs=class extends xo{injector;instance=null;constructor(n){super();let e=new oa([...n.providers,{provide:xo,useValue:this}],n.parent||tr(),n.debugName,new Set(["environment"]));this.injector=e,n.runEnvironmentInitializers&&e.resolveInjectorInitializers()}destroy(){this.injector.destroy()}onDestroy(n){this.injector.onDestroy(n)}};function C0(t,n,e=null){return new Fs({providers:t,parent:n,debugName:e,runEnvironmentInitializers:!0}).injector}var ck=(()=>{class t{_injector;cachedInjectors=new Map;constructor(e){this._injector=e}getOrCreateStandaloneInjector(e){if(!e.standalone)return null;if(!this.cachedInjectors.has(e)){let i=Qm(!1,e.type),o=i.length>0?C0([i],this._injector,""):null;this.cachedInjectors.set(e,o)}return this.cachedInjectors.get(e)}ngOnDestroy(){try{for(let e of this.cachedInjectors.values())e!==null&&e.destroy()}finally{this.cachedInjectors.clear()}}static \u0275prov=Le({token:t,providedIn:"environment",factory:()=>new t(be(xt))})}return t})();function H(t){return Bs(()=>{let n=S0(t),e=W(I({},n),{decls:t.decls,vars:t.vars,template:t.template,consts:t.consts||null,ngContentSelectors:t.ngContentSelectors,onPush:t.changeDetection!==If.Eager,directiveDefs:null,pipeDefs:null,dependencies:n.standalone&&t.dependencies||null,getStandaloneInjector:n.standalone?o=>o.get(ck).getOrCreateStandaloneInjector(e):null,getExternalStyles:null,signals:t.signals??!1,data:t.data||{},encapsulation:t.encapsulation||Qn.Emulated,styles:t.styles||sn,_:null,schemas:t.schemas||null,tView:null,id:""});n.standalone&&Wi("NgStandalone"),w0(e);let i=t.dependencies;return e.directiveDefs=Iy(i,lk),e.pipeDefs=Iy(i,dv),e.id=mk(e),e})}function lk(t){return po(t)||Nl(t)}function le(t){return Bs(()=>({type:t.type,bootstrap:t.bootstrap||sn,declarations:t.declarations||sn,imports:t.imports||sn,exports:t.exports||sn,transitiveCompileScopes:null,schemas:t.schemas||null,id:t.id||null}))}function dk(t,n){if(t==null)return fo;let e={};for(let i in t)if(Object.hasOwn(t,i)){let o=t[i],a,r,s,c;Array.isArray(o)?(s=o[0],a=o[1],r=o[2]??a,c=o[3]||null):(a=o,r=o,s=wd.None,c=null),e[a]=[i,s,c],n[a]=r}return e}function uk(t){if(t==null)return fo;let n={};for(let e in t)Object.hasOwn(t,e)&&(n[t[e]]=e);return n}function ee(t){return Bs(()=>{let n=S0(t);return w0(n),n})}function S0(t){let n={};return{type:t.type,providersResolver:null,viewProvidersResolver:null,factory:null,hostBindings:t.hostBindings||null,hostVars:t.hostVars||0,hostAttrs:t.hostAttrs||null,contentQueries:t.contentQueries||null,declaredInputs:n,inputConfig:t.inputs||fo,exportAs:t.exportAs||null,standalone:t.standalone??!0,signals:t.signals===!0,selectors:t.selectors||sn,viewQuery:t.viewQuery||null,features:t.features||null,setInput:null,resolveHostDirectives:null,hostDirectives:null,controlDef:null,signalFormsInputPresence:null,inputs:dk(t.inputs,n),outputs:uk(t.outputs),debugInfo:null}}function w0(t){t.features?.forEach(n=>n(t))}function Iy(t,n){return t?()=>{let e=typeof t=="function"?t():t,i=[];for(let o of e){let a=n(o);a!==null&&i.push(a)}return i}:null}function mk(t){let n=0,e=typeof t.consts=="function"?"":t.consts,i=[t.selectors,t.ngContentSelectors,t.hostVars,t.hostAttrs,e,t.vars,t.decls,t.encapsulation,t.standalone,t.signals,t.exportAs,JSON.stringify(t.inputs),JSON.stringify(t.outputs),Object.getOwnPropertyNames(t.type.prototype),!!t.contentQueries,!!t.viewQuery];for(let a of i.join("|"))n=Math.imul(31,n)+a.charCodeAt(0)<<0;return n+=2147483648,"c"+n}var E0=new D("");var oh=(()=>{class t{resolve;reject;initialized=!1;done=!1;donePromise=new Promise((e,i)=>{this.resolve=e,this.reject=i});appInits=p(E0,{optional:!0})??[];injector=p(ie);constructor(){}runInitializers(){if(this.initialized)return;let e=[];for(let o of this.appInits){let a=nr(this.injector,o);if(Ca(a))e.push(a);else if(ih(a)){let r=new Promise((s,c)=>{a.subscribe({complete:s,error:c})});e.push(r)}}let i=()=>{this.done=!0,this.resolve()};Promise.all(e).then(()=>{i()}).catch(o=>{this.reject(o)}),e.length===0&&i(),this.initialized=!0}static \u0275fac=function(i){return new(i||t)};static \u0275prov=ce({token:t,factory:t.\u0275fac})}return t})();function pk(t){return Object.getPrototypeOf(t.prototype).constructor}function Ge(t){let n=pk(t.type),e=!0,i=[t];for(;n&&n!==Function.prototype&&n!==Object.prototype;){let o,a=Object.hasOwn(n,bs)?n[bs]:void 0,r=Object.hasOwn(n,vs)?n[vs]:void 0;if(bi(t))o=a??r;else{if(a)throw new te(903,!1);o=r}if(o){if(e){i.push(o);let c=t;c.inputs=Pp(t.inputs),c.declaredInputs=Pp(t.declaredInputs),c.outputs=Pp(t.outputs);let d=o.hostBindings;d&&vk(t,d);let l=o.viewQuery,m=o.contentQueries;if(l&&gk(t,l),m&&bk(t,m),fk(t,o),lv(t.outputs,o.outputs),bi(o)&&o.data.animation){let v=t.data;v.animation=(v.animation||[]).concat(o.data.animation)}}let s=o.features;if(s)for(let c=0;c<s.length;c++){let d=s[c];d&&d.ngInherit&&d(t),d===Ge&&(e=!1)}}n=Object.getPrototypeOf(n)}hk(i)}function fk(t,n){for(let e in n.inputs){if(!Object.hasOwn(n.inputs,e)||Object.hasOwn(t.inputs,e))continue;let i=n.inputs[e];i!==void 0&&(t.inputs[e]=i,t.declaredInputs[e]=n.declaredInputs[e])}}function hk(t){let n=0,e=null;for(let i=t.length-1;i>=0;i--){let o=t[i];o.hostVars=n+=o.hostVars,o.hostAttrs=pr(o.hostAttrs,e=pr(e,o.hostAttrs))}}function Pp(t){return t===fo?{}:t===sn?[]:t}function gk(t,n){let e=t.viewQuery;e?t.viewQuery=(i,o)=>{n(i,o),e(i,o)}:t.viewQuery=n}function bk(t,n){let e=t.contentQueries;e?t.contentQueries=(i,o,a)=>{n(i,o,a),e(i,o,a)}:t.contentQueries=n}function vk(t,n){let e=t.hostBindings;e?t.hostBindings=(i,o)=>{n(i,o),e(i,o)}:t.hostBindings=n}function D0(t,n,e,i,o,a,r,s){if(e.firstCreatePass){t.mergedAttrs=pr(t.mergedAttrs,t.attrs);let l=t.tView=Wf(2,t,o,a,r,e.directiveRegistry,e.pipeRegistry,null,e.schemas,e.consts,null);e.queries!==null&&(e.queries.template(e,t),l.queries=e.queries.embeddedTView(t))}s&&(t.flags|=s),fa(t,!1);let c=_k(e,n,t,i);Wl()&&Uf(e,n,c,t),fr(c,n);let d=X_(c,n,c,t);n[i+yt]=d,Yf(n,d),JI(d,t,n)}function yk(t,n,e,i,o,a,r,s,c,d,l){let m=e+yt,v;return n.firstCreatePass?(v=_a(n,m,4,r||null,s||null),pp()&&s0(n,t,v,En(n.consts,d),B_),jy(n,v)):v=n.data[m],D0(v,t,n,e,i,o,a,c),Ss(v)&&Zf(n,t,v),d!=null&&Ed(t,v,l),v}function br(t,n,e,i,o,a,r,s,c,d,l){let m=e+yt,v;if(n.firstCreatePass){if(v=_a(n,m,4,r||null,s||null),d!=null){let g=En(n.consts,d);v.localNames=[];for(let y=0;y<g.length;y+=2)v.localNames.push(g[y],-1)}}else v=n.data[m];return D0(v,t,n,e,i,o,a,c),d!=null&&Ed(t,v,l),v}function tn(t,n,e,i,o,a,r,s){let c=ye(),d=ht(),l=En(d.consts,a);return yk(c,d,t,n,e,i,o,l,void 0,r,s),tn}function wo(t,n,e,i,o,a,r,s){let c=ye(),d=ht(),l=En(d.consts,a);return br(c,d,t,n,e,i,o,l,void 0,r,s),wo}var _k=xk;function xk(t,n,e,i){return ql(!0),n[mt].createComment("")}var ah=new D("");var rh=new D("");function M0(){lm(t=>{let n="";throw new te(-600,n)})}var Ck=10;var Fn=(()=>{class t{_runningTick=!1;_destroyed=!1;_destroyListeners=[];_views=[];internalErrorHandler=p(zi);afterRenderManager=p(xd);zonelessEnabled=p(Is);rootEffectScheduler=p(Zl);dirtyFlags=0;tracingSnapshot=null;allTestViews=new Set;autoDetectTestViews=new Set;includeAllTestViews=!1;afterTick=new B;get allViews(){return[...(this.includeAllTestViews?this.allTestViews:this.autoDetectTestViews).keys(),...this._views]}get destroyed(){return this._destroyed}componentTypes=[];components=[];internalPendingTask=p(ha);get isStable(){return this.internalPendingTask.hasPendingTasksObservable.pipe(je(e=>!e))}constructor(){p(Jn,{optional:!0})}whenStable(){let e;return new Promise(i=>{e=this.isStable.subscribe({next:o=>{o&&i()}})}).finally(()=>{e.unsubscribe()})}_injector=p(xt);_rendererFactory=null;get injector(){return this._injector}bootstrap(e,i){return this.bootstrapImpl(e,i)}bootstrapImpl(e,i,o=ie.NULL){return this._injector.get(X).run(()=>{if(et(Ye.BootstrapComponentStart),!this._injector.get(oh).done){let w="";throw new te(405,w)}let s=po(e),c=this._injector.get(xo),d=new gr(s,c);this.componentTypes.push(e);let{hostElement:l,directives:m,bindings:v}=Sk(i),g=l||d.selector,y=d.create(o,[],g,c.injector,m,v),_=y.location.nativeElement,C=y.injector.get(ah,null);return C?.registerApplication(_),y.onDestroy(()=>{this.detachView(y.hostView),Ts(this.components,y),C?.unregisterApplication(_)}),this._loadComponent(y),et(Ye.BootstrapComponentEnd,y),y})}tick(){this.zonelessEnabled||(this.dirtyFlags|=1),this._tick()}_tick(){et(Ye.ChangeDetectionStart),this.tracingSnapshot!==null?this.tracingSnapshot.run(_d.CHANGE_DETECTION,this.tickImpl):this.tickImpl()}tickImpl=()=>{if(this._runningTick)throw et(Ye.ChangeDetectionEnd),new te(101,!1);let e=de(null);try{this._runningTick=!0,this.synchronize()}finally{this._runningTick=!1,this.tracingSnapshot?.dispose(),this.tracingSnapshot=null,de(e),this.afterTick.next(),et(Ye.ChangeDetectionEnd)}};synchronize(){this._rendererFactory===null&&!this._injector.destroyed&&(this._rendererFactory=this._injector.get(Lt,null,{optional:!0}));let e=0;for(;this.dirtyFlags!==0&&e++<Ck;){et(Ye.ChangeDetectionSyncStart);try{this.synchronizeOnce()}finally{et(Ye.ChangeDetectionSyncEnd)}}}synchronizeOnce(){this.dirtyFlags&16&&(this.dirtyFlags&=-17,this.rootEffectScheduler.flush());let e=!1;if(this.dirtyFlags&7){let i=!!(this.dirtyFlags&1);this.dirtyFlags&=-8,this.dirtyFlags|=8;for(let{_lView:o}of this.allViews){if(!i&&!ws(o))continue;let a=i&&!this.zonelessEnabled?0:1;q_(o,a),e=!0}if(this.dirtyFlags&=-5,this.syncDirtyFlagsWithViews(),this.dirtyFlags&23)return}e||(this._rendererFactory?.begin?.(),this._rendererFactory?.end?.()),this.dirtyFlags&8&&(this.dirtyFlags&=-9,this.afterRenderManager.execute()),this.syncDirtyFlagsWithViews()}syncDirtyFlagsWithViews(){if(this.allViews.some(({_lView:e})=>ws(e))){this.dirtyFlags|=2;return}else this.dirtyFlags&=-8}attachView(e){let i=e;this._views.push(i),i.attachToAppRef(this)}detachView(e){let i=e;Ts(this._views,i),i.detachFromAppRef()}_loadComponent(e){this.attachView(e.hostView);try{this.tick()}catch(o){this.internalErrorHandler(o)}this.components.push(e),this._injector.get(rh,[]).forEach(o=>o(e))}ngOnDestroy(){if(!this._destroyed)try{this._destroyListeners.forEach(e=>e()),this._views.slice().forEach(e=>e.destroy())}finally{this._destroyed=!0,this._views=[],this._destroyListeners=[]}}onDestroy(e){return this._destroyListeners.push(e),()=>Ts(this._destroyListeners,e)}destroy(){if(this._destroyed)throw new te(406,!1);let e=this._injector;e.destroy&&!e.destroyed&&e.destroy()}get viewCount(){return this._views.length}static \u0275fac=function(i){return new(i||t)};static \u0275prov=ce({token:t,factory:t.\u0275fac})}return t})();function Sk(t){return t===void 0||typeof t=="string"||t instanceof Element?{hostElement:t}:t}function Ts(t,n){let e=t.indexOf(n);e>-1&&t.splice(e,1)}function Id(t,n){let e=ye(),i=bo();if(Pn(e,i,n)){let o=ht(),a=Ds();if(Dd(a,o,e,t,n))gi(a)&&L_(e,a.index);else{let s=An(a,e);V_(e[mt],s,null,a.value,t,n,null)}}return Id}function Q(t,n,e,i){let o=ye(),a=bo();if(Pn(o,a,n)){let r=ht(),s=Ds();KM(s,o,t,n,e,i)}return Q}var hf=class{destroy(n){}updateValue(n,e){}swap(n,e){let i=Math.min(n,e),o=Math.max(n,e),a=this.detach(o);if(o-i>1){let r=this.detach(i);this.attach(i,a),this.attach(o,r)}else this.attach(i,a)}move(n,e){this.attach(e,this.detach(n))}};function Fp(t,n,e,i,o){return t===e&&Object.is(n,i)?1:Object.is(o(t,n),o(e,i))?-1:0}function wk(t,n,e,i){let o,a,r=0,s=t.length-1,c=void 0;if(Array.isArray(n)){de(i);let d=n.length-1;for(de(null);r<=s&&r<=d;){let l=t.at(r),m=n[r],v=Fp(r,l,r,m,e);if(v!==0){v<0&&t.updateValue(r,m),r++;continue}let g=t.at(s),y=n[d],_=Fp(s,g,d,y,e);if(_!==0){_<0&&t.updateValue(s,y),s--,d--;continue}let C=e(r,l),w=e(s,g),E=e(r,m);if(Object.is(E,w)){let U=e(d,y);Object.is(U,C)?(t.swap(r,s),t.updateValue(s,y),d--,s--):t.move(s,r),t.updateValue(r,m),r++;continue}if(o??=new hd,a??=Ny(t,r,s,e),gf(t,o,r,E))t.updateValue(r,m),r++,s++;else if(a.has(E))o.set(C,t.detach(r)),s--;else{let U=t.create(r,n[r]);t.attach(r,U),r++,s++}}for(;r<=d;)ky(t,o,e,r,n[r]),r++}else if(n!=null){de(i);let d=n[Symbol.iterator]();de(null);let l=d.next();for(;!l.done&&r<=s;){let m=t.at(r),v=l.value,g=Fp(r,m,r,v,e);if(g!==0)g<0&&t.updateValue(r,v),r++,l=d.next();else{o??=new hd,a??=Ny(t,r,s,e);let y=e(r,v);if(gf(t,o,r,y))t.updateValue(r,v),r++,s++,l=d.next();else if(!a.has(y))t.attach(r,t.create(r,v)),r++,s++,l=d.next();else{let _=e(r,m);o.set(_,t.detach(r)),s--}}}for(;!l.done;)ky(t,o,e,t.length,l.value),l=d.next()}for(;r<=s;)t.destroy(t.detach(s--));o?.forEach(d=>{t.destroy(d)})}function gf(t,n,e,i){return n!==void 0&&n.has(i)?(t.attach(e,n.get(i)),n.delete(i),!0):!1}function ky(t,n,e,i,o){if(gf(t,n,i,e(i,o)))t.updateValue(i,o);else{let a=t.create(i,o);t.attach(i,a)}}function Ny(t,n,e,i){let o=new Set;for(let a=n;a<=e;a++)o.add(i(a,t.at(a)));return o}var hd=class{kvMap=new Map;_vMap=void 0;has(n){return this.kvMap.has(n)}delete(n){if(!this.has(n))return!1;let e=this.kvMap.get(n);return this._vMap!==void 0&&this._vMap.has(e)?(this.kvMap.set(n,this._vMap.get(e)),this._vMap.delete(e)):this.kvMap.delete(n),!0}get(n){return this.kvMap.get(n)}set(n,e){if(this.kvMap.has(n)){let i=this.kvMap.get(n);this._vMap===void 0&&(this._vMap=new Map);let o=this._vMap;for(;o.has(i);)i=o.get(i);o.set(i,e)}else this.kvMap.set(n,e)}forEach(n){for(let[e,i]of this.kvMap)if(n(i,e),this._vMap!==void 0){let o=this._vMap;for(;o.has(i);)i=o.get(i),n(i,e)}}};function k(t,n,e,i,o,a,r,s){Wi("NgControlFlow");let c=ye(),d=ht(),l=En(d.consts,a);return br(c,d,t,n,e,i,o,l,256,r,s),sh}function sh(t,n,e,i,o,a,r,s){return Wi("NgControlFlow"),Ek(t,n,e,i,o,a,r,s),sh}function Ek(t,n,e,i,o,a,r,s){let c=ye(),d=ht(),l=En(d.consts,a);br(c,d,t,n,e,i,o,l,512,r,s)}function N(t,n){Wi("NgControlFlow");let e=ye(),i=bo(),o=e[i]!==en?e[i]:-1,a=o!==-1?gd(e,yt+o):void 0,r=0;if(Pn(e,i,t)){let s=de(null);try{if(a!==void 0&&J_(a,r),t!==-1){let c=yt+t,d=gd(e,c),l=_f(e[he],c),m=t0(d,l,e),v=zs(e,l,n,{dehydratedView:m});Hs(d,v,r,hr(l,m))}}finally{de(s)}}else if(a!==void 0){let s=Q_(a,r);s!==void 0&&(s[Ct]=n)}}var bf=class{lContainer;$implicit;$index;constructor(n,e,i){this.lContainer=n,this.$implicit=e,this.$index=i}get $count(){return this.lContainer.length-St}};function Eo(t){return t}function _i(t,n){return n}var vf=class{hasEmptyBlock;trackByFn;liveCollection;constructor(n,e,i){this.hasEmptyBlock=n,this.trackByFn=e,this.liveCollection=i}};function xe(t,n,e,i,o,a,r,s,c,d,l,m,v){Wi("NgControlFlow");let g=ye(),y=ht(),_=c!==void 0,C=ye(),w=s?r.bind(C[ln][Ct]):r,E=new vf(_,w);C[yt+t]=E,br(g,y,t+1,n,e,i,o,En(y.consts,a),256),_&&br(g,y,t+2,c,d,l,m,En(y.consts,v),512)}var yf=class extends hf{lContainer;hostLView;templateTNode;operationsCounter=void 0;needsIndexUpdate=!1;constructor(n,e,i){super(),this.lContainer=n,this.hostLView=e,this.templateTNode=i}get length(){return this.lContainer.length-St}at(n){return this.getLView(n)[Ct].$implicit}attach(n,e){let i=e[sa];this.needsIndexUpdate||=n!==this.length,Hs(this.lContainer,e,n,hr(this.templateTNode,i)),Dk(this.lContainer,n)}detach(n){return this.needsIndexUpdate||=n!==this.length-1,Mk(this.lContainer,n),Ik(this.lContainer,n)}create(n,e){let i=ld(this.lContainer,this.templateTNode.tView.ssrId);return zs(this.hostLView,this.templateTNode,new bf(this.lContainer,e,n),{dehydratedView:i})}destroy(n){Cd(n[he],n)}updateValue(n,e){this.getLView(n)[Ct].$implicit=e}reset(){this.needsIndexUpdate=!1}updateIndexes(){if(this.needsIndexUpdate)for(let n=0;n<this.length;n++)this.getLView(n)[Ct].$index=n}getLView(n){return kk(this.lContainer,n)}};function Ce(t){let n=de(null),e=Dn();try{let i=ye(),o=i[he],a=i[e],r=e+1,s=gd(i,r);if(a.liveCollection===void 0){let d=_f(o,r);a.liveCollection=new yf(s,i,d)}else a.liveCollection.reset();let c=a.liveCollection;if(wk(c,t,a.trackByFn,n),c.updateIndexes(),a.hasEmptyBlock){let d=bo(),l=c.length===0;if(Pn(i,d,l)){let m=e+2,v=gd(i,m);if(l){let g=_f(o,m),y=t0(v,g,i),_=zs(i,g,void 0,{dehydratedView:y});Hs(v,_,0,hr(g,y))}else o.firstUpdatePass&&yI(v),J_(v,0)}}}finally{de(n)}}function gd(t,n){return t[n]}function Dk(t,n){if(t.length<=St)return;let e=St+n,i=t[e];i&&DM(i)}function Mk(t,n){if(t.length<=St)return;let e=St+n,i=t[e];i&&EM(i)}function Ik(t,n){return Ps(t,n)}function kk(t,n){return Q_(t,n)}function _f(t,n){return Fl(t,n)}function R(t,n,e){let i=ye(),o=bo();if(Pn(i,o,n)){let a=ht(),r=Ds();WM(r,i,t,n,i[mt],e)}return R}function xf(t,n,e,i,o){Dd(n,t,e,o?"class":"style",i)}function f(t,n,e,i){let o=ye(),a=o[he],r=t+yt,s=a.firstCreatePass?l0(r,o,2,n,B_,pp(),e,i):a.data[r];if(gi(s)){let c=o[Zn].tracingService;if(c&&c.componentCreate){let d=a.data[s.directiveStart+s.componentOffset];return c.componentCreate(o0(d),()=>(Ty(t,n,o,s,i),f))}}return Ty(t,n,o,s,i),f}function Ty(t,n,e,i,o){if(j_(i,e,t,n,I0),Ss(i)){let a=e[he];Zf(a,e,i),u_(a,i,e)}o!=null&&Ed(e,i)}function u(){let t=ht(),n=qt(),e=z_(n);return t.firstCreatePass&&d0(t,e),hp(e)&&gp(),mp(),e.classesWithoutHost!=null&&vD(e)&&xf(t,e,ye(),e.classesWithoutHost,!0),e.stylesWithoutHost!=null&&yD(e)&&xf(t,e,ye(),e.stylesWithoutHost,!1),u}function A(t,n,e,i){return f(t,n,e,i),u(),A}function Je(t,n,e,i){let o=ye(),a=o[he],r=t+yt,s=a.firstCreatePass?LI(r,a,2,n,e,i):a.data[r];return j_(s,o,t,n,I0),i!=null&&Ed(o,s),Je}function it(){let t=qt(),n=z_(t);return hp(n)&&gp(),mp(),it}function Dt(t,n,e,i){return Je(t,n,e,i),it(),Dt}var I0=(t,n,e,i,o)=>(ql(!0),v_(n[mt],i,wp()));function We(){return ye()}function Vt(t,n,e){let i=ye(),o=bo();if(Pn(i,o,n)){let a=ht(),r=Ds();P_(r,i,t,n,i[mt],e)}return Vt}var $s="en-US";var Nk=$s;function k0(t){typeof t=="string"&&(Nk=t.toLowerCase().replace(/_/g,"-"))}function V(t,n,e){let i=ye(),o=ht(),a=qt();return Tk(o,i,i[mt],a,t,n,e),V}function _r(t,n,e){let i=ye(),o=ht(),a=qt();return(a.type&3||e)&&a0(a,o,i,e,i[mt],t,n,od(a,i,n)),_r}function Tk(t,n,e,i,o,a,r){let s=!0,c=null;if((i.type&3||r)&&(c??=od(i,n,a),a0(i,t,n,r,e,o,a,c)&&(s=!1)),s){let d=i.outputs?.[o],l=i.hostDirectiveOutputs?.[o];if(l&&l.length)for(let m=0;m<l.length;m+=2){let v=l[m],g=l[m+1];c??=od(i,n,a),Cy(i,n,v,g,o,c)}if(d&&d.length)for(let m of d)c??=od(i,n,a),Cy(i,n,m,o,o,c)}}function x(t=1){return $v(t)}function Ak(t,n){let e=null,i=pM(t);for(let o=0;o<n.length;o++){let a=n[o];if(a==="*"){e=o;continue}if(i===null?S_(t,a,!0):gM(i,a))return o}return e}function Be(t){let n=ye()[ln][Qt];if(!n.projection){let e=t?t.length:1,i=n.projection=gv(e,null),o=i.slice(),a=n.child;for(;a!==null;){if(a.type!==128){let r=t?Ak(a,t):0;r!==null&&(o[r]?o[r].projectionNext=a:i[r]=a,o[r]=a)}a=a.next}}}function oe(t,n=0,e,i,o,a){let r=ye(),s=ht(),c=i?t+1:null;c!==null&&br(r,s,c,i,o,a,null,e);let d=_a(s,yt+t,16,null,e||null);d.projection===null&&(d.projection=n),yp();let m=!r[sa]||fp();r[ln][Qt].projection[d.projection]===null&&c!==null?Ok(r,s,c):m&&!vd(d)&&FM(s,r,d)}function Ok(t,n,e){let i=yt+e,o=n.data[i],a=t[i],r=ld(a,o.tView.ssrId),s=zs(t,o,void 0,{dehydratedView:r});Hs(a,s,0,hr(o,r))}function Mt(t,n,e,i){return b0(t,n,e,i),Mt}function ot(t,n,e){return g0(t,n,e),ot}function Y(t){let n=ye(),e=ht(),i=$l();Es(i+1);let o=eh(e,i);if(t.dirty&&Mv(n)===((o.metadata.flags&2)===2)){if(o.matches===null)t.reset([]);else{let a=y0(n,i);t.reset(a,Qy),t.notifyOnChanges()}return!0}return!1}function Z(){return Jf(ye(),$l())}function kd(t,n,e,i,o){return x0(n,b0(t,e,i,o)),kd}function xi(t,n,e,i){return x0(t,g0(n,e,i)),xi}function Ci(t=1){Es($l()+t)}function nn(t){let n=_p();return sp(n,yt+t)}function Jl(t,n){return t<<17|n<<2}function ya(t){return t>>17&32767}function Rk(t){return(t&2)==2}function Pk(t,n){return t&131071|n<<17}function Cf(t){return t|2}function vr(t){return(t&131068)>>2}function Lp(t,n){return t&-131069|n<<2}function Fk(t){return(t&1)===1}function Sf(t){return t|1}function Lk(t,n,e,i,o,a){let r=a?n.classBindings:n.styleBindings,s=ya(r),c=vr(r);t[i]=e;let d=!1,l;if(Array.isArray(e)){let m=e;l=m[1],(l===null||er(m,l)>0)&&(d=!0)}else l=e;if(o)if(c!==0){let v=ya(t[s+1]);t[i+1]=Jl(v,s),v!==0&&(t[v+1]=Lp(t[v+1],i)),t[s+1]=Pk(t[s+1],i)}else t[i+1]=Jl(s,0),s!==0&&(t[s+1]=Lp(t[s+1],i)),s=i;else t[i+1]=Jl(c,0),s===0?s=i:t[c+1]=Lp(t[c+1],i),c=i;d&&(t[i+1]=Cf(t[i+1])),Ay(t,l,i,!0),Ay(t,l,i,!1),Bk(n,l,t,i,a),r=Jl(s,c),a?n.classBindings=r:n.styleBindings=r}function Bk(t,n,e,i,o){let a=o?t.residualClasses:t.residualStyles;a!=null&&typeof n=="string"&&er(a,n)>=0&&(e[i+1]=Sf(e[i+1]))}function Ay(t,n,e,i){let o=t[e+1],a=n===null,r=i?ya(o):vr(o),s=!1;for(;r!==0&&(s===!1||a);){let c=t[r],d=t[r+1];Vk(c,n)&&(s=!0,t[r+1]=i?Sf(d):Cf(d)),r=i?ya(d):vr(d)}s&&(t[e+1]=i?Cf(o):Sf(o))}function Vk(t,n){return t===null||n==null||(Array.isArray(t)?t[1]:t)===n?!0:Array.isArray(t)&&typeof n=="string"?er(t,n)>=0:!1}var Xn={textEnd:0,key:0,keyEnd:0,value:0,valueEnd:0};function jk(t){return t.substring(Xn.key,Xn.keyEnd)}function zk(t){return Hk(t),N0(t,T0(t,0,Xn.textEnd))}function N0(t,n){let e=Xn.textEnd;return e===n?-1:(n=Xn.keyEnd=$k(t,Xn.key=n,e),T0(t,n,e))}function Hk(t){Xn.key=0,Xn.keyEnd=0,Xn.value=0,Xn.valueEnd=0,Xn.textEnd=t.length}function T0(t,n,e){for(;n<e&&t.charCodeAt(n)<=32;)n++;return n}function $k(t,n,e){for(;n<e&&t.charCodeAt(n)>32;)n++;return n}function we(t,n,e){return A0(t,n,e,!1),we}function z(t,n){return A0(t,n,null,!0),z}function Ke(t){Gk(Xk,Uk,t,!0)}function Uk(t,n){for(let e=zk(n);e>=0;e=N0(n,e))Ol(t,jk(n),!0)}function A0(t,n,e,i){let o=ye(),a=ht(),r=sr(2);if(a.firstUpdatePass&&R0(a,t,r,i),n!==en&&Pn(o,r,n)){let s=a.data[Dn()];P0(a,s,o,o[mt],t,o[r+1]=Jk(n,e),i,r)}}function Gk(t,n,e,i){let o=ht(),a=sr(2);o.firstUpdatePass&&R0(o,null,a,i);let r=ye();if(e!==en&&Pn(r,a,e)){let s=o.data[Dn()];if(F0(s,i)&&!O0(o,a)){let c=i?s.classesWithoutHost:s.stylesWithoutHost;c!==null&&(e=Ml(c,e||"")),xf(o,s,r,e,i)}else Qk(o,s,r,r[mt],r[a+1],r[a+1]=Kk(t,n,e),i,a)}}function O0(t,n){return n>=t.expandoStartIndex}function R0(t,n,e,i){let o=t.data;if(o[e+1]===null){let a=o[Dn()],r=O0(t,e);F0(a,i)&&n===null&&!r&&(n=!1),n=Wk(o,a,n,i),Lk(o,a,n,e,r,i)}}function Wk(t,n,e,i){let o=Vv(t),a=i?n.residualClasses:n.residualStyles;if(o===null)(i?n.classBindings:n.styleBindings)===0&&(e=Bp(null,t,n,e,i),e=Ls(e,n.attrs,i),a=null);else{let r=n.directiveStylingLast;if(r===-1||t[r]!==o)if(e=Bp(o,t,n,e,i),a===null){let c=qk(t,n,i);c!==void 0&&Array.isArray(c)&&(c=Bp(null,t,n,c[1],i),c=Ls(c,n.attrs,i),Yk(t,n,i,c))}else a=Zk(t,n,i)}return a!==void 0&&(i?n.residualClasses=a:n.residualStyles=a),e}function qk(t,n,e){let i=e?n.classBindings:n.styleBindings;if(vr(i)!==0)return t[ya(i)]}function Yk(t,n,e,i){let o=e?n.classBindings:n.styleBindings;t[ya(o)]=i}function Zk(t,n,e){let i,o=n.directiveEnd;for(let a=1+n.directiveStylingLast;a<o;a++){let r=t[a].hostAttrs;i=Ls(i,r,e)}return Ls(i,n.attrs,e)}function Bp(t,n,e,i,o){let a=null,r=e.directiveEnd,s=e.directiveStylingLast;for(s===-1?s=e.directiveStart:s++;s<r&&(a=n[s],i=Ls(i,a.hostAttrs,o),a!==t);)s++;return t!==null&&(e.directiveStylingLast=s),i}function Ls(t,n,e){let i=e?1:2,o=-1;if(n!==null)for(let a=0;a<n.length;a++){let r=n[a];typeof r=="number"?o=r:o===i&&(Array.isArray(t)||(t=t===void 0?[]:["",t]),Ol(t,r,e?!0:n[++a]))}return t===void 0?null:t}function Kk(t,n,e){if(e==null||e==="")return sn;let i=[],o=Rn(e);if(Array.isArray(o))for(let a=0;a<o.length;a++)t(i,o[a],!0);else if(o instanceof Set)for(let a of o)t(i,a,!0);else if(typeof o=="object")for(let a in o)Object.hasOwn(o,a)&&t(i,a,o[a]);else typeof o=="string"&&n(i,o);return i}function Xk(t,n,e){let i=String(n);i!==""&&!i.includes(" ")&&Ol(t,i,e)}function Qk(t,n,e,i,o,a,r,s){o===en&&(o=sn);let c=0,d=0,l=0<o.length?o[0]:null,m=0<a.length?a[0]:null;for(;l!==null||m!==null;){let v=c<o.length?o[c+1]:void 0,g=d<a.length?a[d+1]:void 0,y=null,_;l===m?(c+=2,d+=2,v!==g&&(y=m,_=g)):m===null||l!==null&&l<m?(c+=2,y=l):(d+=2,y=m,_=g),y!==null&&P0(t,n,e,i,y,_,r,s),l=c<o.length?o[c]:null,m=d<a.length?a[d]:null}}function P0(t,n,e,i,o,a,r,s){if(!(n.type&3))return;let c=t.data,d=c[s+1],l=Fk(d)?Oy(c,n,e,o,vr(d),r):void 0;if(!bd(l)){bd(a)||Rk(d)&&(a=Oy(c,null,e,o,s,r));let m=rp(Dn(),e);BM(i,r,m,o,a)}}function Oy(t,n,e,i,o,a){let r=n===null,s;for(;o>0;){let c=t[o],d=Array.isArray(c),l=d?c[1]:c,m=l===null,v=e[o+1];v===en&&(v=m?sn:void 0);let g=m?Rl(v,i):l===i?v:void 0;if(d&&!bd(g)&&(g=Rl(c,i)),bd(g)&&(s=g,r))return s;let y=t[o+1];o=r?ya(y):vr(y)}if(n!==null){let c=a?n.residualClasses:n.residualStyles;c!=null&&(s=Rl(c,i))}return s}function bd(t){return t!==void 0}function Jk(t,n){return t==null||t===""||(typeof n=="string"?t=Rn(t)+n:typeof t=="object"&&(t=Dl(Rn(t)))),t}function F0(t,n){return(t.flags&(n?8:16))!==0}function b(t,n=""){let e=ye(),i=ht(),o=t+yt,a=i.firstCreatePass?_a(i,o,1,n,null):i.data[o],r=eN(i,e,a,n);e[o]=r,Wl()&&Uf(i,e,r,a),fa(a,!1)}var eN=(t,n,e,i)=>(ql(!0),iM(n[mt],i));function tN(t,n,e,i=""){return Pn(t,bo(),e)?n+Sn(e)+i:en}function nN(t,n,e,i,o,a=""){let r=zl(),s=ud(t,r,e,o);return sr(2),s?n+Sn(e)+i+Sn(o)+a:en}function iN(t,n,e,i,o,a,r,s=""){let c=zl(),d=wI(t,c,e,o,r);return sr(3),d?n+Sn(e)+i+Sn(o)+a+Sn(r)+s:en}function oN(t,n,e,i,o,a,r,s,c,d=""){let l=zl(),m=EI(t,l,e,o,r,c);return sr(4),m?n+Sn(e)+i+Sn(o)+a+Sn(r)+s+Sn(c)+d:en}function S(t){return re("",t),S}function re(t,n,e){let i=ye(),o=tN(i,t,n,e);return o!==en&&Nd(i,Dn(),o),re}function dt(t,n,e,i,o){let a=ye(),r=nN(a,t,n,e,i,o);return r!==en&&Nd(a,Dn(),r),dt}function qi(t,n,e,i,o,a,r){let s=ye(),c=iN(s,t,n,e,i,o,a,r);return c!==en&&Nd(s,Dn(),c),qi}function Us(t,n,e,i,o,a,r,s,c){let d=ye(),l=oN(d,t,n,e,i,o,a,r,s,c);return l!==en&&Nd(d,Dn(),l),Us}function Nd(t,n,e){let i=rp(n,t);oM(t[mt],i,e)}var L0={};function Ln(t){Wi("NgLet");let n=ht(),e=ye(),i=t+yt,o=_a(n,i,128,null,null);return fa(o,!1),Ll(n,e,i,L0),Ln}function ei(t){let n=ht(),e=ye(),i=Dn();return Ll(n,e,i,t),t}function at(t){let n=_p(),e=sp(n,yt+t);if(e===L0)throw new te(314,!1);return e}function Ry(t,n,e){let i=ht();i.firstCreatePass&&B0(n,i.data,i.blueprint,bi(t),e)}function B0(t,n,e,i,o){if(t=Xt(t),Array.isArray(t))for(let a=0;a<t.length;a++)B0(t[a],n,e,i,o);else{let a=ht(),r=ye(),s=qt(),c=ia(t)?t:Xt(t.provide),d=ep(t),l=s.providerIndexes&1048575,m=s.directiveStart,v=s.providerIndexes>>20;if(ia(t)||!t.multi){let g=new va(d,o,Yt,null),y=jp(c,n,o?l:l+v,m);y===-1?($p(cd(s,r),a,c),Vp(a,t,n.length),n.push(c),s.directiveStart++,s.directiveEnd++,o&&(s.providerIndexes+=1048576),e.push(g),r.push(g)):(e[y]=g,r[y]=g)}else{let g=jp(c,n,l+v,m),y=jp(c,n,l,l+v),_=g>=0&&e[g],C=y>=0&&e[y];if(o&&!C||!o&&!_){$p(cd(s,r),a,c);let w=sN(o?rN:aN,e.length,o,i,d,t);!o&&C&&(e[y].providerFactory=w),Vp(a,t,n.length,0),n.push(c),s.directiveStart++,s.directiveEnd++,o&&(s.providerIndexes+=1048576),e.push(w),r.push(w)}else{let w=V0(e[o?y:g],d,!o&&i);Vp(a,t,g>-1?g:y,w)}!o&&i&&C&&e[y].componentProviders++}}}function Vp(t,n,e,i){let o=ia(n),a=Cv(n);if(o||a){let c=(a?Xt(n.useClass):n).prototype.ngOnDestroy;if(c){let d=t.destroyHooks||(t.destroyHooks=[]);if(!o&&n.multi){let l=d.indexOf(e);l===-1?d.push(e,[i,c]):d[l+1].push(i,c)}else d.push(e,c)}}}function V0(t,n,e){return e&&t.componentProviders++,t.multi.push(n)-1}function jp(t,n,e,i){for(let o=e;o<i;o++)if(n[o]===t)return o;return-1}function aN(t,n,e,i,o){return wf(this.multi,[])}function rN(t,n,e,i,o){let a=this.multi,r;if(this.providerFactory){let s=this.providerFactory.componentProviders,c=As(i,i[he],this.providerFactory.index,o);r=c.slice(0,s),wf(a,r);for(let d=s;d<c.length;d++)r.push(c[d])}else r=[],wf(a,r);return r}function wf(t,n){for(let e=0;e<t.length;e++){let i=t[e];n.push(i())}return n}function sN(t,n,e,i,o,a){let r=new va(t,e,Yt,null);return r.multi=[],r.index=n,r.componentProviders=0,V0(r,o,i&&!e),r}function ze(t,n){return e=>{e.providersResolver=(i,o)=>Ry(i,o?o(t):t,!1),n&&(e.viewProvidersResolver=(i,o)=>Ry(i,o?o(n):n,!0))}}function ch(t,n){return Md(t,n)}var j0=(()=>{class t{applicationErrorHandler=p(zi);appRef=p(Fn);taskService=p(ha);ngZone=p(X);zonelessEnabled=p(Is);tracing=p(Jn,{optional:!0});zoneIsDefined=typeof Zone<"u"&&!!Zone.root.run;schedulerTickApplyArgs=[{data:{__scheduler_tick__:!0}}];subscriptions=new _e;angularZoneId=this.zoneIsDefined?this.ngZone._inner?.get(hs):null;scheduleInRootZone=!this.zonelessEnabled&&this.zoneIsDefined&&(p(Np,{optional:!0})??!1);cancelScheduledCallback=null;useMicrotaskScheduler=!1;runningTick=!1;pendingRenderTaskId=null;constructor(){this.subscriptions.add(this.appRef.afterTick.subscribe(()=>{let e=this.taskService.add();if(!this.runningTick&&(this.cleanup(),!this.zonelessEnabled||this.appRef.includeAllTestViews)){this.taskService.remove(e);return}this.switchToMicrotaskScheduler(),this.taskService.remove(e)})),this.subscriptions.add(this.ngZone.onUnstable.subscribe(()=>{this.runningTick||this.cleanup()}))}switchToMicrotaskScheduler(){this.ngZone.runOutsideAngular(()=>{let e=this.taskService.add();this.useMicrotaskScheduler=!0,queueMicrotask(()=>{this.useMicrotaskScheduler=!1,this.taskService.remove(e)})})}notify(e){if(!this.zonelessEnabled&&e===5)return;switch(e){case 0:case 2:{this.appRef.dirtyFlags|=2;break}case 3:case 4:case 5:case 1:{this.appRef.dirtyFlags|=4;break}case 6:{this.appRef.dirtyFlags|=2;break}case 12:{this.appRef.dirtyFlags|=16;break}case 13:{this.appRef.dirtyFlags|=2;break}case 11:break;default:this.appRef.dirtyFlags|=8}if(this.appRef.tracingSnapshot=this.tracing?.snapshot(this.appRef.tracingSnapshot)??null,!this.shouldScheduleTick())return;let i=this.useMicrotaskScheduler?Yv:Ep;this.pendingRenderTaskId=this.taskService.add(),this.scheduleInRootZone?this.cancelScheduledCallback=Zone.root.run(()=>i(()=>this.tick())):this.cancelScheduledCallback=this.ngZone.runOutsideAngular(()=>i(()=>this.tick()))}shouldScheduleTick(){return!(this.appRef.destroyed||this.pendingRenderTaskId!==null||this.runningTick||this.appRef._runningTick||!this.zonelessEnabled&&this.zoneIsDefined&&Zone.current.get(hs+this.angularZoneId))}tick(){if(this.runningTick||this.appRef.destroyed)return;if(this.appRef.dirtyFlags===0){this.cleanup();return}!this.zonelessEnabled&&this.appRef.dirtyFlags&7&&(this.appRef.dirtyFlags|=1);let e=this.taskService.add();try{this.ngZone.run(()=>{this.runningTick=!0,this.appRef._tick()},void 0,this.schedulerTickApplyArgs)}catch(i){this.applicationErrorHandler(i)}finally{this.taskService.remove(e),this.cleanup()}}ngOnDestroy(){this.subscriptions.unsubscribe(),this.cleanup()}cleanup(){if(this.runningTick=!1,this.cancelScheduledCallback?.(),this.cancelScheduledCallback=null,this.pendingRenderTaskId!==null){let e=this.pendingRenderTaskId;this.pendingRenderTaskId=null,this.taskService.remove(e)}}static \u0275fac=function(i){return new(i||t)};static \u0275prov=ce({token:t,factory:t.\u0275fac})}return t})();function lh(){return Wi("NgZoneless"),Bi([...dh(),[]])}function dh(){return[{provide:fi,useExisting:j0},{provide:X,useClass:gs},{provide:Is,useValue:!0}]}function cN(){return typeof $localize<"u"&&$localize.locale||$s}var Td=new D("",{factory:()=>p(Td,{optional:!0,skipSelf:!0})||cN()});var Ad=class{destroyed=!1;listeners=null;errorHandler=p(cn,{optional:!0});isEmitting=!1;hasNullListeners=!1;destroyRef=p(Wt);constructor(){this.destroyRef.onDestroy(()=>{this.destroyed=!0,this.listeners=null})}subscribe(n){if(this.destroyed)throw new te(953,!1);return(this.listeners??=[]).push(n),{unsubscribe:()=>{let e=this.listeners?this.listeners.indexOf(n):-1;e>-1&&(this.isEmitting?(this.hasNullListeners=!0,this.listeners[e]=null):this.listeners.splice(e,1))}}}emit(n){if(this.destroyed){console.warn(Li(953,!1));return}if(this.listeners===null)return;this.isEmitting=!0;let e=de(null);try{for(let i of this.listeners)try{i!==null&&i(n)}catch(o){this.errorHandler?.handleError(o)}}finally{this.hasNullListeners&&(this.hasNullListeners=!1,this.listeners&&lN(this.listeners)),de(e),this.isEmitting=!1}}};function lN(t){let n=t.length-1;for(;n>-1;)t[n]===null&&t.splice(n,1),n--}function P(t,n){return rs(t,n?.equal)}function Xe(t){return Nb(t)}var z0=class t extends Error{_brand;constructor(n){super(n)}static IDLE=new t("IDLE");static LOADING=new t("LOADING")};function W0(t,n){let e=Object.create(Fy);e.value=t,e.transformFn=n?.transform;function i(){if(ao(e),e.value===Ef){let o=null;throw new te(-950,o)}return e.value}return i[Ht]=e,i}var ti=class{attributeName;constructor(n){this.attributeName=n}__NG_ELEMENT_ID__=()=>Mf(this.attributeName);toString(){return`HostAttributeToken ${this.attributeName}`}},q0=(()=>{let t=new D("");return t.__NG_ELEMENT_ID__=n=>{let e=qt();if(e===null)throw new te(-204,!1);if(e.type&2)return e.value;if(n&8)return null;throw new te(-204,!1)},t})();function Y0(t){return new Ad}function H0(t,n){return W0(t,n)}function kN(t){return W0(Ef,t)}var hn=(H0.required=kN,H0);function $0(t,n){return th(n)}function NN(t,n){return nh(n)}var Bn=($0.required=NN,$0);function U0(t,n){return th(n)}function TN(t,n){return nh(n)}var Z0=(U0.required=TN,U0);var AN=1e4;var H6=AN-1e3;var He=(()=>{class t{static __NG_ELEMENT_ID__=ON}return t})();function ON(t){return RN(qt(),ye(),(t&16)===16)}function RN(t,n,e){if(gi(t)&&!e){let i=On(t.index,n);return new _o(i,i)}else if(t.type&175){let i=n[ln];return new _o(i,n)}return null}var mh=new D(""),PN=new D("");function Gs(t){return!t.moduleRef}function FN(t){let n=Gs(t)?t.r3Injector:t.moduleRef.injector,e=n.get(X);return e.run(()=>{Gs(t)?t.r3Injector.resolveInjectorInitializers():t.moduleRef.resolveInjectorInitializers();let i=n.get(zi),o;if(e.runOutsideAngular(()=>{o=e.onError.subscribe({next:i})}),Gs(t)){let a=()=>n.destroy(),r=t.platformInjector.get(mh);r.add(a),n.onDestroy(()=>{o.unsubscribe(),r.delete(a)})}else{let a=()=>t.moduleRef.destroy(),r=t.platformInjector.get(mh);r.add(a),t.moduleRef.onDestroy(()=>{Ts(t.allPlatformModules,t.moduleRef),o.unsubscribe(),r.delete(a)})}return BN(i,e,()=>{let a=n.get(ha),r=a.add(),s=n.get(oh);return s.runInitializers(),s.donePromise.then(()=>{let c=n.get(Td,$s);if(k0(c||$s),!n.get(PN,!0))return Gs(t)?n.get(Fn):(t.allPlatformModules.push(t.moduleRef),t.moduleRef);if(Gs(t)){let l=n.get(Fn);return t.rootComponent!==void 0&&l.bootstrap(t.rootComponent),l}else return LN?.(t.moduleRef,t.allPlatformModules),t.moduleRef}).finally(()=>{a.remove(r)})})})}var LN;function BN(t,n,e){try{let i=e();return Ca(i)?i.catch(o=>{throw n.runOutsideAngular(()=>t(o)),o}):i}catch(i){throw n.runOutsideAngular(()=>t(i)),i}}var Od=null;function VN(t=[],n){return ie.create({name:n,providers:[{provide:_s,useValue:"platform"},{provide:mh,useValue:new Set([()=>Od=null])},...t]})}function jN(t=[]){if(Od)return Od;let n=VN(t);return Od=n,M0(),zN(n),n}function zN(t){let n=t.get(Yl,null);nr(t,()=>{n?.forEach(e=>e())})}function K0(t){let{rootComponent:n,appProviders:e,platformProviders:i,platformRef:o}=t;et(Ye.BootstrapApplicationStart);try{let a=o?.injector??jN(i),r=[dh(),Qv,...e||[]],s=new Fs({providers:r,parent:a,debugName:"",runEnvironmentInitializers:!1});return FN({r3Injector:s.injector,platformInjector:a,rootComponent:n})}catch(a){return Promise.reject(a)}finally{et(Ye.BootstrapApplicationEnd)}}function O(t){return typeof t=="boolean"?t:t!=null&&t!=="false"}function on(t,n=NaN){return!isNaN(parseFloat(t))&&!isNaN(Number(t))?Number(t):n}var uh=Symbol("NOT_SET"),X0=new Set,HN=W(I({},Ga),{kind:"afterRenderEffectPhase",consumerIsAlwaysLive:!0,consumerAllowSignalWrites:!0,value:uh,cleanup:null,consumerMarkedDirty(){if(this.sequence.impl.executing){if(this.sequence.lastPhase===null||this.sequence.lastPhase<this.phase)return;this.sequence.erroredOrDestroyed=!0}this.sequence.scheduler.notify(7)},phaseFn(t){if(this.sequence.lastPhase=this.phase,!this.dirty)return this.signal;if(this.dirty=!1,this.value!==uh&&!$a(this))return this.signal;try{for(let o of this.cleanup??X0)o()}finally{this.cleanup?.clear()}let n=[];t!==void 0&&n.push(t),n.push(this.registerCleanupFn);let e=ro(this),i;try{i=this.userFn.apply(null,n)}finally{Uo(this,e)}return(this.value===uh||!this.equal(this.value,i))&&(this.value=i,this.version++),this.signal}}),ph=class extends Os{scheduler;lastPhase=null;nodes=[void 0,void 0,void 0,void 0];onDestroyFns=null;constructor(n,e,i,o,a,r=null,s){super(n,[void 0,void 0,void 0,void 0],i,!1,a.get(Wt),r),this.scheduler=o;for(let c of zf){let d=e[c];if(d===void 0)continue;let l=Object.create(HN);l.sequence=this,l.phase=c,l.userFn=d,l.dirty=!0,l.signal=()=>(ao(l),l.value),l.signal[Ht]=l,l.registerCleanupFn=m=>(l.cleanup??=new Set).add(m),this.nodes[c]=l,this.hooks[c]=m=>l.phaseFn(m)}}afterRun(){super.afterRun(),this.lastPhase=null}destroy(){if(this.onDestroyFns!==null)for(let n of this.onDestroyFns)n();super.destroy();for(let n of this.nodes)if(n)try{for(let e of n.cleanup??X0)e()}finally{so(n)}}};function fh(t,n){let e=n?.injector??p(ie),i=e.get(fi),o=e.get(xd),a=e.get(Jn,null,{optional:!0});o.impl??=e.get(Hf);let r=t;typeof r=="function"&&(r={mixedReadWrite:t});let s=e.get(lr,null,{optional:!0}),c=new ph(o.impl,[r.earlyRead,r.write,r.mixedReadWrite,r.read],s?.view,i,e,a?.snapshot(null),void 0);return o.impl.register(c),c}function Rd(t,n){let e=po(t),i=n.elementInjector||tr(),a=new gr(e).create(i,n.projectableNodes,n.hostElement,n.environmentInjector,n.directives,n.bindings);return n.onError&&(a.hostView._lView[ar]=n.onError),a}var Q0=null;function Vn(){return Q0}function hh(t){Q0??=t}var Ws=class{},xr=(()=>{class t{historyGo(e){throw new Error("")}static \u0275fac=function(i){return new(i||t)};static \u0275prov=Le({token:t,factory:()=>p(J0),providedIn:"platform"})}return t})();var J0=(()=>{class t extends xr{_location;_history;_doc=p(ae);constructor(){super(),this._location=window.location,this._history=window.history}getBaseHrefFromDOM(){return Vn().getBaseHref(this._doc)}onPopState(e){let i=Vn().getGlobalEventTarget(this._doc,"window");return i.addEventListener("popstate",e,!1),()=>i.removeEventListener("popstate",e)}onHashChange(e){let i=Vn().getGlobalEventTarget(this._doc,"window");return i.addEventListener("hashchange",e,!1),()=>i.removeEventListener("hashchange",e)}get href(){return this._location.href}get protocol(){return this._location.protocol}get hostname(){return this._location.hostname}get port(){return this._location.port}get pathname(){return this._location.pathname}get search(){return this._location.search}get hash(){return this._location.hash}set pathname(e){this._location.pathname=e}pushState(e,i,o){this._history.pushState(e,i,o)}replaceState(e,i,o){this._history.replaceState(e,i,o)}forward(){this._history.forward()}back(){this._history.back()}historyGo(e=0){this._history.go(e)}getState(){return this._history.state}static \u0275fac=function(i){return new(i||t)};static \u0275prov=Le({token:t,factory:()=>new t,providedIn:"platform"})}return t})();function nx(t,n){return t?n?t.endsWith("/")?n.startsWith("/")?t+n.slice(1):t+n:n.startsWith("/")?t+n:`${t}/${n}`:t:n}function ex(t){let n=t.search(/#|\?|$/);return t[n-1]==="/"?t.slice(0,n-1)+t.slice(n):t}function Do(t){return t&&t[0]!=="?"?`?${t}`:t}var Pd=(()=>{class t{historyGo(e){throw new Error("")}static \u0275fac=function(i){return new(i||t)};static \u0275prov=Le({token:t,factory:()=>p(UN),providedIn:"root"})}return t})(),$N=new D(""),UN=(()=>{class t extends Pd{_platformLocation;_baseHref;_removeListenerFns=[];constructor(e,i){super(),this._platformLocation=e,this._baseHref=i??this._platformLocation.getBaseHrefFromDOM()??p(ae).location?.origin??""}ngOnDestroy(){for(;this._removeListenerFns.length;)this._removeListenerFns.pop()()}onPopState(e){this._removeListenerFns.push(this._platformLocation.onPopState(e),this._platformLocation.onHashChange(e))}getBaseHref(){return this._baseHref}prepareExternalUrl(e){return nx(this._baseHref,e)}path(e=!1){let i=this._platformLocation.pathname+Do(this._platformLocation.search),o=this._platformLocation.hash;return o&&e?`${i}${o}`:i}pushState(e,i,o,a){let r=this.prepareExternalUrl(o+Do(a));this._platformLocation.pushState(e,i,r)}replaceState(e,i,o,a){let r=this.prepareExternalUrl(o+Do(a));this._platformLocation.replaceState(e,i,r)}forward(){this._platformLocation.forward()}back(){this._platformLocation.back()}getState(){return this._platformLocation.getState()}historyGo(e=0){this._platformLocation.historyGo?.(e)}static \u0275fac=function(i){return new(i||t)(be(xr),be($N,8))};static \u0275prov=Le({token:t,factory:t.\u0275fac,providedIn:"root"})}return t})();var Fd=(()=>{class t{_subject=new B;_basePath;_locationStrategy;_urlChangeListeners=[];_urlChangeSubscription=null;constructor(e){this._locationStrategy=e;let i=this._locationStrategy.getBaseHref();this._basePath=qN(ex(tx(i))),this._locationStrategy.onPopState(o=>{let a={url:this.path(!0),pop:!0,state:o.state,type:o.type};o.hasUAVisualTransition&&(a.hasUAVisualTransition=!0),this._subject.next(a)})}ngOnDestroy(){this._urlChangeSubscription?.unsubscribe(),this._urlChangeListeners=[]}path(e=!1){return this.normalize(this._locationStrategy.path(e))}getState(){return this._locationStrategy.getState()}isCurrentPathEqualTo(e,i=""){return this.path()==this.normalize(e+Do(i))}normalize(e){return t.stripTrailingSlash(WN(this._basePath,tx(e)))}prepareExternalUrl(e){return e&&e[0]!=="/"&&(e="/"+e),this._locationStrategy.prepareExternalUrl(e)}go(e,i="",o=null){this._locationStrategy.pushState(o,"",e,i),this._notifyUrlChangeListeners(this.prepareExternalUrl(e+Do(i)),o)}replaceState(e,i="",o=null){this._locationStrategy.replaceState(o,"",e,i),this._notifyUrlChangeListeners(this.prepareExternalUrl(e+Do(i)),o)}forward(){this._locationStrategy.forward()}back(){this._locationStrategy.back()}historyGo(e=0){this._locationStrategy.historyGo?.(e)}onUrlChange(e){return this._urlChangeListeners.push(e),this._urlChangeSubscription??=this.subscribe(i=>{this._notifyUrlChangeListeners(i.url,i.state)}),()=>{let i=this._urlChangeListeners.indexOf(e);this._urlChangeListeners.splice(i,1),this._urlChangeListeners.length===0&&(this._urlChangeSubscription?.unsubscribe(),this._urlChangeSubscription=null)}}_notifyUrlChangeListeners(e="",i){this._urlChangeListeners.forEach(o=>o(e,i))}subscribe(e,i,o){return this._subject.subscribe({next:e,error:i??void 0,complete:o??void 0})}static normalizeQueryParams=Do;static joinWithSlash=nx;static stripTrailingSlash=ex;static \u0275fac=function(i){return new(i||t)(be(Pd))};static \u0275prov=Le({token:t,factory:()=>GN(),providedIn:"root"})}return t})();function GN(){return new Fd(be(Pd))}function WN(t,n){if(!t||!n.startsWith(t))return n;let e=n.substring(t.length);return e===""||["/",";","?","#"].includes(e[0])?e:n}function tx(t){return t.replace(/\/index\.html$/,"")}function qN(t){if(new RegExp("^(https?:)?//").test(t)){let[,e]=t.split(/\/\/[^\/]+/);return e}return t}var gh=(()=>{class t{_viewContainerRef;_viewRef=null;ngTemplateOutletContext=null;ngTemplateOutlet=null;ngTemplateOutletInjector=null;injector=p(ie);constructor(e){this._viewContainerRef=e}ngOnChanges(e){if(this._shouldRecreateView(e)){let i=this._viewContainerRef;if(this._viewRef&&i.remove(i.indexOf(this._viewRef)),!this.ngTemplateOutlet){this._viewRef=null;return}let o=this._createContextForwardProxy();this._viewRef=i.createEmbeddedView(this.ngTemplateOutlet,o,{injector:this._getInjector()})}}_getInjector(){return this.ngTemplateOutletInjector==="outlet"?this.injector:this.ngTemplateOutletInjector??void 0}_shouldRecreateView(e){return!!e.ngTemplateOutlet||!!e.ngTemplateOutletInjector}_createContextForwardProxy(){return new Proxy({},{set:(e,i,o)=>this.ngTemplateOutletContext?Reflect.set(this.ngTemplateOutletContext,i,o):!1,get:(e,i,o)=>{if(this.ngTemplateOutletContext)return Reflect.get(this.ngTemplateOutletContext,i,o)}})}static \u0275fac=function(i){return new(i||t)(Yt(Bt))};static \u0275dir=ee({type:t,selectors:[["","ngTemplateOutlet",""]],inputs:{ngTemplateOutletContext:"ngTemplateOutletContext",ngTemplateOutlet:"ngTemplateOutlet",ngTemplateOutletInjector:"ngTemplateOutletInjector"},features:[wt]})}return t})();function qs(t,n){n=encodeURIComponent(n);for(let e of t.split(";")){let i=e.indexOf("="),[o,a]=i==-1?[e,""]:[e.slice(0,i),e.slice(i+1)];if(o.trim()!==n)continue;let r=a;try{r=decodeURIComponent(a)}catch{}return r.length>1&&r[0]==='"'&&r[r.length-1]==='"'&&(r=r.slice(1,-1)),r}return null}var bh="browser";function ix(t){return t===bh}var Ys=class{_doc;constructor(n){this._doc=n}manager},Ld=(()=>{class t extends Ys{constructor(e){super(e)}supports(e){return!0}addEventListener(e,i,o,a){return e.addEventListener(i,o,a),()=>this.removeEventListener(e,i,o,a)}removeEventListener(e,i,o,a){return e.removeEventListener(i,o,a)}static \u0275fac=function(i){return new(i||t)(be(ae))};static \u0275prov=Le({token:t,factory:t.\u0275fac})}return t})(),jd=new D(""),xh=(()=>{class t{_zone;_plugins;_eventNameToPlugin=new Map;constructor(e,i){this._zone=i,e.forEach(r=>{r.manager=this});let o=e.filter(r=>!(r instanceof Ld));this._plugins=o.slice().reverse();let a=e.find(r=>r instanceof Ld);a&&this._plugins.push(a)}addEventListener(e,i,o,a){return this._findPluginFor(i).addEventListener(e,i,o,a)}getZone(){return this._zone}_findPluginFor(e){let i=this._eventNameToPlugin.get(e);if(i)return i;if(i=this._plugins.find(a=>a.supports(e)),!i)throw new te(-5101,!1);return this._eventNameToPlugin.set(e,i),i}static \u0275fac=function(i){return new(i||t)(be(jd),be(X))};static \u0275prov=Le({token:t,factory:t.\u0275fac})}return t})(),vh="ng-app-id";function ox(t){for(let n of t)n.remove()}function ax(t,n){let e=n.createElement("style");return e.textContent=t,e}function QN(t,n,e,i){let o=t.head?.querySelectorAll(`style[${vh}="${n}"],link[${vh}="${n}"]`);if(!o||o.length===0)return!1;for(let a of o)a.removeAttribute(vh),a instanceof HTMLLinkElement?i.set(a.href.slice(a.href.lastIndexOf("/")+1),{usage:0,elements:[a]}):a.textContent&&e.set(a.textContent,{usage:0,elements:[a]});return!0}function _h(t,n){let e=n.createElement("link");return e.setAttribute("rel","stylesheet"),e.setAttribute("href",t),e}var Ch=(()=>{class t{doc;appId;nonce;inline=new Map;external=new Map;hosts=new Set;constructor(e,i,o,a={}){this.doc=e,this.appId=i,this.nonce=o,QN(e,i,this.inline,this.external)&&this.hosts.add(e.head)}addStyles(e,i){for(let o of e)this.addUsage(o,this.inline,ax);i?.forEach(o=>this.addUsage(o,this.external,_h))}removeStyles(e,i){for(let o of e)this.removeUsage(o,this.inline);i?.forEach(o=>this.removeUsage(o,this.external))}addUsage(e,i,o){let a=i.get(e);a?a.usage++:i.set(e,{usage:1,elements:[...this.hosts].map(r=>this.addElement(r,o(e,this.doc)))})}removeUsage(e,i){let o=i.get(e);o&&(o.usage--,o.usage<=0&&(ox(o.elements),i.delete(e)))}ngOnDestroy(){for(let[,{elements:e}]of[...this.inline,...this.external])ox(e);this.hosts.clear()}addHost(e){if(!this.hosts.has(e)){this.hosts.add(e);for(let[i,{elements:o}]of this.inline)o.push(this.addElement(e,ax(i,this.doc)));for(let[i,{elements:o}]of this.external)o.push(this.addElement(e,_h(i,this.doc)))}}removeHost(e){this.hosts.delete(e);for(let i of[...this.inline.values(),...this.external.values()]){let o=[];for(let a of i.elements)a.parentNode===e?a.remove():o.push(a);i.elements=o}}addElement(e,i){return this.nonce&&i.setAttribute("nonce",this.nonce),e.appendChild(i)}static \u0275fac=function(i){return new(i||t)(be(ae),be(Hi),be(yo,8),be(ga))};static \u0275prov=Le({token:t,factory:t.\u0275fac})}return t})(),yh={svg:"http://www.w3.org/2000/svg",xhtml:"http://www.w3.org/1999/xhtml",xlink:"http://www.w3.org/1999/xlink",xml:"http://www.w3.org/XML/1998/namespace",xmlns:"http://www.w3.org/2000/xmlns/",math:"http://www.w3.org/1998/Math/MathML"},Sh=/%COMP%/g;var sx="%COMP%",JN=`_nghost-${sx}`,eT=`_ngcontent-${sx}`,tT=!0,nT=new D("",{factory:()=>tT}),iT=new D("");function oT(t){return eT.replace(Sh,t)}function aT(t){return JN.replace(Sh,t)}function cx(t,n){return n.map(e=>e.replace(Sh,t))}var wh=(()=>{class t{eventManager;sharedStylesHost;appId;removeStylesOnCompDestroy;doc;ngZone;nonce;tracingService;rendererByCompId=new Map;defaultRenderer;cssVarNamespace;constructor(e,i,o,a,r,s,c=null,d=null,l=null){this.eventManager=e,this.sharedStylesHost=i,this.appId=o,this.removeStylesOnCompDestroy=a,this.doc=r,this.ngZone=s,this.nonce=c,this.tracingService=d,this.cssVarNamespace=l??"",this.defaultRenderer=new Zs(e,r,s,this.tracingService,this.cssVarNamespace)}createRenderer(e,i){if(!e||!i)return this.defaultRenderer;let o=this.getOrCreateRenderer(e,i);return o instanceof Vd?o.applyToHost(e):o instanceof Ks&&o.applyStyles(),o}getOrCreateRenderer(e,i){let o=this.rendererByCompId,a=o.get(i.id);if(!a){let r=this.doc,s=this.ngZone,c=this.eventManager,d=this.sharedStylesHost,l=this.removeStylesOnCompDestroy,m=this.tracingService;switch(i.encapsulation){case Qn.Emulated:a=new Vd(c,d,i,this.appId,l,r,s,m,this.cssVarNamespace);break;case Qn.ShadowDom:return new Bd(c,e,i,r,s,this.nonce,m,this.cssVarNamespace,d);case Qn.ExperimentalIsolatedShadowDom:return new Bd(c,e,i,r,s,this.nonce,m,this.cssVarNamespace);default:a=new Ks(c,d,i,l,r,s,m,this.cssVarNamespace);break}o.set(i.id,a)}return a}ngOnDestroy(){this.rendererByCompId.clear()}componentReplaced(e){this.rendererByCompId.delete(e)}static \u0275fac=function(i){return new(i||t)(be(xh),be(xa),be(Hi),be(nT),be(ae),be(X),be(yo),be(Jn,8),be(iT,8))};static \u0275prov=Le({token:t,factory:t.\u0275fac})}return t})(),Zs=class{eventManager;doc;ngZone;tracingService;cssVarNamespace;data=Object.create(null);throwOnSyntheticProps=!0;constructor(n,e,i,o,a=""){this.eventManager=n,this.doc=e,this.ngZone=i,this.tracingService=o,this.cssVarNamespace=a}destroy(){}destroyNode=null;createElement(n,e){return e?this.doc.createElementNS(yh[e]||e,n):this.doc.createElement(n)}createComment(n){return this.doc.createComment(n)}createText(n){return this.doc.createTextNode(n)}appendChild(n,e){(rx(n)?n.content:n).appendChild(e)}insertBefore(n,e,i){if(n){let o=rx(n)?n.content:n;if(i!=null&&i.parentNode!==o)throw new te(-5106,!1);o.insertBefore(e,i)}}removeChild(n,e){e.remove()}selectRootElement(n,e){let i=typeof n=="string"?this.doc.querySelector(n):n;if(!i)throw new te(-5104,!1);return e||(i.textContent=""),i}parentNode(n){return n.parentNode}nextSibling(n){return n.nextSibling}setAttribute(n,e,i,o){if(o){e=o+":"+e;let a=yh[o];a?n.setAttributeNS(a,e,i):n.setAttribute(e,i)}else n.setAttribute(e,i)}removeAttribute(n,e,i){if(i){let o=yh[i];o?n.removeAttributeNS(o,e):n.removeAttribute(`${i}:${e}`)}else n.removeAttribute(e)}addClass(n,e){n.classList.add(e)}removeClass(n,e){n.classList.remove(e)}setStyle(n,e,i,o){let a=e.startsWith("--");a&&(e=e.replace("%NS%",this.cssVarNamespace)),a||o&(yi.DashCase|yi.Important)?n.style.setProperty(e,i,o&yi.Important?"important":""):n.style[e]=i}removeStyle(n,e,i){let o=e.startsWith("--");o&&(e=e.replace("%NS%",this.cssVarNamespace)),o||i&yi.DashCase?n.style.removeProperty(e):n.style[e]=""}setProperty(n,e,i){n!=null&&(n[e]=i)}setValue(n,e){n.nodeValue=e}listen(n,e,i,o){if(typeof n=="string"&&(n=Vn().getGlobalEventTarget(this.doc,n),!n))throw new te(-5102,!1);let a=this.decoratePreventDefault(i);return this.tracingService?.wrapEventListener&&(a=this.tracingService.wrapEventListener(n,e,a)),this.eventManager.addEventListener(n,e,a,o)}decoratePreventDefault(n){return e=>{if(e==="__ngUnwrap__")return n;n(e)===!1&&e.preventDefault()}}};function rx(t){return t.tagName==="TEMPLATE"&&t.content!==void 0}var Bd=class extends Zs{hostEl;sharedStylesHost;shadowRoot;constructor(n,e,i,o,a,r,s,c,d){super(n,o,a,s,c),this.hostEl=e,this.sharedStylesHost=d,this.shadowRoot=e.attachShadow({mode:"open"}),this.sharedStylesHost&&this.sharedStylesHost.addHost(this.shadowRoot);let l=i.styles;l=cx(i.id,l).map(v=>v.replace(/%NS%/g,c));for(let v of l){let g=document.createElement("style");r&&g.setAttribute("nonce",r),g.textContent=v,this.shadowRoot.appendChild(g)}let m=i.getExternalStyles?.();if(m)for(let v of m){let g=_h(v,o);r&&g.setAttribute("nonce",r),this.shadowRoot.appendChild(g)}}nodeOrShadowRoot(n){return n===this.hostEl?this.shadowRoot:n}appendChild(n,e){return super.appendChild(this.nodeOrShadowRoot(n),e)}insertBefore(n,e,i){return super.insertBefore(this.nodeOrShadowRoot(n),e,i)}removeChild(n,e){return super.removeChild(null,e)}parentNode(n){return this.nodeOrShadowRoot(super.parentNode(this.nodeOrShadowRoot(n)))}destroy(){this.sharedStylesHost&&this.sharedStylesHost.removeHost(this.shadowRoot)}},Ks=class extends Zs{sharedStylesHost;removeStylesOnCompDestroy;styles;styleUrls;constructor(n,e,i,o,a,r,s,c,d){super(n,a,r,s,c),this.sharedStylesHost=e,this.removeStylesOnCompDestroy=o;let l=i.styles,m=d?cx(d,l):l;this.styles=m.map(v=>v.replace(/%NS%/g,c)),this.styleUrls=i.getExternalStyles?.(d)}applyStyles(){this.sharedStylesHost.addStyles(this.styles,this.styleUrls)}destroy(){this.removeStylesOnCompDestroy&&jf.size===0&&this.sharedStylesHost.removeStyles(this.styles,this.styleUrls)}},Vd=class extends Ks{contentAttr;hostAttr;constructor(n,e,i,o,a,r,s,c,d){let l=o+"-"+i.id;super(n,e,i,a,r,s,c,d,l),this.contentAttr=oT(l),this.hostAttr=aT(l)}applyToHost(n){this.applyStyles(),this.setAttribute(n,this.hostAttr,"")}createElement(n,e){let i=super.createElement(n,e);return super.setAttribute(i,this.contentAttr,""),i}};var zd=class t extends Ws{supportsDOMEvents=!0;static makeCurrent(){hh(new t)}onAndCancel(n,e,i,o){return n.addEventListener(e,i,o),()=>{n.removeEventListener(e,i,o)}}dispatchEvent(n,e){n.dispatchEvent(e)}remove(n){n.remove()}createElement(n,e){return e=e||this.getDefaultDocument(),e.createElement(n)}createHtmlDocument(){return document.implementation.createHTMLDocument("fakeTitle")}getDefaultDocument(){return document}isElementNode(n){return n.nodeType===Node.ELEMENT_NODE}isShadowRoot(n){return n instanceof DocumentFragment}getGlobalEventTarget(n,e){return e==="window"?window:e==="document"?n:e==="body"?n.body:null}getBaseHref(n){let e=rT();return e==null?null:sT(e)}resetBaseElement(){Xs=null}getUserAgent(){return window.navigator.userAgent}getCookie(n){return qs(document.cookie,n)}},Xs=null;function rT(){return Xs=Xs||document.head.querySelector("base"),Xs?Xs.getAttribute("href"):null}function sT(t){return new URL(t,document.baseURI).pathname}var lx=["alt","control","meta","shift"],cT={"\b":"Backspace","	":"Tab","\x7F":"Delete","\x1B":"Escape",Del:"Delete",Esc:"Escape",Left:"ArrowLeft",Right:"ArrowRight",Up:"ArrowUp",Down:"ArrowDown",Menu:"ContextMenu",Scroll:"ScrollLock",Win:"OS"},lT={alt:t=>t.altKey,control:t=>t.ctrlKey,meta:t=>t.metaKey,shift:t=>t.shiftKey},dx=(()=>{class t extends Ys{constructor(e){super(e)}supports(e){return t.parseEventName(e)!=null}addEventListener(e,i,o,a){let r=t.parseEventName(i),s=t.eventCallback(r.fullKey,o,this.manager.getZone());return this.manager.getZone().runOutsideAngular(()=>Vn().onAndCancel(e,r.domEventName,s,a))}static parseEventName(e){let i=e.toLowerCase().split("."),o=i.shift();if(i.length===0||!(o==="keydown"||o==="keyup"))return null;let a=t._normalizeKey(i.pop()),r="",s=i.indexOf("code");if(s>-1&&(i.splice(s,1),r="code."),lx.forEach(d=>{let l=i.indexOf(d);l>-1&&(i.splice(l,1),r+=d+".")}),r+=a,i.length!=0||a.length===0)return null;let c={};return c.domEventName=o,c.fullKey=r,c}static matchEventFullKeyCode(e,i){let o=cT[e.key]||e.key,a="";return i.indexOf("code.")>-1&&(o=e.code,a="code."),o==null||!o?!1:(o=o.toLowerCase(),o===" "?o="space":o==="."&&(o="dot"),lx.forEach(r=>{if(r!==o){let s=lT[r];s(e)&&(a+=r+".")}}),a+=o,a===i)}static eventCallback(e,i,o){return a=>{t.matchEventFullKeyCode(a,e)&&o.runGuarded(()=>i(a))}}static _normalizeKey(e){return e==="esc"?"escape":e}static \u0275fac=function(i){return new(i||t)(be(ae))};static \u0275prov=Le({token:t,factory:t.\u0275fac})}return t})();async function Eh(t,n,e){let i=I({rootComponent:t},dT(n,e));return K0(i)}function dT(t,n){return{platformRef:n?.platformRef,appProviders:[...hT,...t?.providers??[]],platformProviders:fT}}function uT(){zd.makeCurrent()}function mT(){return new cn}function pT(){return kf(document),document}var fT=[{provide:ga,useValue:bh},{provide:Yl,useValue:uT,multi:!0},{provide:ae,useFactory:pT}];var hT=[{provide:_s,useValue:"root"},{provide:cn,useFactory:mT},{provide:jd,useClass:Ld,multi:!0},{provide:jd,useClass:dx,multi:!0},wh,{provide:xa,useClass:Ch},{provide:Ch,useExisting:xa},xh,{provide:Lt,useExisting:wh},[]];var Zi=class t{headers;normalizedNames=new Map;lazyInit;lazyUpdate=null;constructor(n){n?typeof n=="string"?this.lazyInit=()=>{this.headers=new Map,n.split(`
`).forEach(e=>{let i=e.indexOf(":");if(i>0){let o=e.slice(0,i),a=e.slice(i+1).trim();this.addHeaderEntry(o,a)}})}:typeof Headers<"u"&&n instanceof Headers?(this.headers=new Map,n.forEach((e,i)=>{this.addHeaderEntry(i,e)})):this.lazyInit=()=>{this.headers=new Map,Object.entries(n).forEach(([e,i])=>{this.setHeaderEntries(e,i)})}:this.headers=new Map}has(n){return this.init(),this.headers.has(n.toLowerCase())}get(n){this.init();let e=this.headers.get(n.toLowerCase());return e&&e.length>0?e[0]:null}keys(){return this.init(),Array.from(this.normalizedNames.values())}getAll(n){return this.init(),this.headers.get(n.toLowerCase())||null}append(n,e){return this.clone({name:n,value:e,op:"a"})}set(n,e){return this.clone({name:n,value:e,op:"s"})}delete(n,e){return this.clone({name:n,value:e,op:"d"})}maybeSetNormalizedName(n,e){this.normalizedNames.has(e)||this.normalizedNames.set(e,n)}init(){this.lazyInit&&(this.lazyInit instanceof t?this.copyFrom(this.lazyInit):this.lazyInit(),this.lazyInit=null,this.lazyUpdate&&(this.lazyUpdate.forEach(n=>this.applyUpdate(n)),this.lazyUpdate=null))}copyFrom(n){n.init();for(let[e,i]of n.headers.entries())this.headers.set(e,i),this.normalizedNames.set(e,n.normalizedNames.get(e))}clone(n){let e=new t;return e.lazyInit=this.lazyInit&&this.lazyInit instanceof t?this.lazyInit:this,e.lazyUpdate=(this.lazyUpdate||[]).concat([n]),e}applyUpdate(n){let e=n.name.toLowerCase();switch(n.op){case"a":case"s":let i=n.value;if(typeof i=="string"&&(i=[i]),i.length===0)return;this.maybeSetNormalizedName(n.name,e);let o=n.op==="a"?(this.headers.get(e)||[]).slice():[];o.push(...i),this.headers.set(e,o);break;case"d":let a=n.value;if(a===void 0)this.headers.delete(e),this.normalizedNames.delete(e);else{let r=Array.isArray(a)?a:[a],s=this.headers.get(e);if(!s)return;s=s.filter(c=>r.indexOf(c)===-1),s.length===0?(this.headers.delete(e),this.normalizedNames.delete(e)):this.headers.set(e,s)}break}}addHeaderEntry(n,e){let i=n.toLowerCase();this.maybeSetNormalizedName(n,i),this.headers.has(i)?this.headers.get(i).push(e):this.headers.set(i,[e])}setHeaderEntries(n,e){let i=(Array.isArray(e)?e:[e]).map(a=>a.toString()),o=n.toLowerCase();this.headers.set(o,i),this.maybeSetNormalizedName(n,o)}forEach(n){this.init(),Array.from(this.normalizedNames.keys()).forEach(e=>n(this.normalizedNames.get(e),this.headers.get(e)))}};var Ih=class{map=new Map;set(n,e){return this.map.set(n,e),this}get(n){return this.map.has(n)||this.map.set(n,n.defaultValue()),this.map.get(n)}delete(n){return this.map.delete(n),this}has(n){return this.map.has(n)}keys(){return this.map.keys()}},kh=class{encodeKey(n){return ux(n)}encodeValue(n){return ux(n)}decodeKey(n){return decodeURIComponent(n)}decodeValue(n){return decodeURIComponent(n)}};function gT(t,n){let e=new Map;return t.length>0&&t.replace(/^\?/,"").split("&").forEach(o=>{let a=o.indexOf("="),[r,s]=a==-1?[n.decodeKey(o),""]:[n.decodeKey(o.slice(0,a)),n.decodeValue(o.slice(a+1))],c=e.get(r)||[];c.push(s),e.set(r,c)}),e}var bT=/[&+#]/g;function ux(t){return encodeURI(t).replace(bT,encodeURIComponent)}function Hd(t){return`${t}`}var Yi=class t{map;encoder;updates=null;cloneFrom=null;constructor(n={}){if(this.encoder=n.encoder||new kh,n.fromString){if(n.fromObject)throw new te(2805,!1);this.map=gT(n.fromString,this.encoder)}else n.fromObject?(this.map=new Map,Object.keys(n.fromObject).forEach(e=>{let i=n.fromObject[e],o=Array.isArray(i)?i.map(Hd):[Hd(i)];this.map.set(e,o)})):this.map=null}has(n){return this.init(),this.map.has(n)}get(n){this.init();let e=this.map.get(n);return e?e[0]:null}getAll(n){return this.init(),this.map.get(n)||null}keys(){return this.init(),Array.from(this.map.keys())}append(n,e){return this.clone({param:n,value:e,op:"a"})}appendAll(n){let e=[];return Object.keys(n).forEach(i=>{let o=n[i];Array.isArray(o)?o.forEach(a=>{e.push({param:i,value:a,op:"a"})}):e.push({param:i,value:o,op:"a"})}),this.clone(e)}set(n,e){return this.clone({param:n,value:e,op:"s"})}delete(n,e){return this.clone({param:n,value:e,op:"d"})}toString(){return this.init(),this.keys().map(n=>{let e=this.encoder.encodeKey(n);return this.map.get(n).map(i=>e+"="+this.encoder.encodeValue(i)).join("&")}).filter(n=>n!=="").join("&")}clone(n){let e=new t({encoder:this.encoder});return e.cloneFrom=this.cloneFrom||this,e.updates=(this.updates||[]).concat(n),e}init(){if(this.map===null&&(this.map=new Map),this.cloneFrom!==null){this.cloneFrom.init();for(let[n,e]of this.cloneFrom.map.entries())this.map.set(n,e);this.updates.forEach(n=>{switch(n.op){case"a":case"s":let e=n.op==="a"?(this.map.get(n.param)||[]).slice():[];e.push(Hd(n.value)),this.map.set(n.param,e);break;case"d":if(n.value!==void 0){let i=(this.map.get(n.param)||[]).slice(),o=i.indexOf(Hd(n.value));o!==-1&&i.splice(o,1),i.length>0?this.map.set(n.param,i):this.map.delete(n.param)}else{this.map.delete(n.param);break}}}),this.cloneFrom=this.updates=null}}};function vT(t){switch(t){case"DELETE":case"GET":case"HEAD":case"OPTIONS":case"JSONP":return!1;default:return!0}}function mx(t){return typeof ArrayBuffer<"u"&&t instanceof ArrayBuffer}function px(t){return typeof Blob<"u"&&t instanceof Blob}function fx(t){return typeof FormData<"u"&&t instanceof FormData}function yT(t){return typeof URLSearchParams<"u"&&t instanceof URLSearchParams}var Dh="Content-Type",hx="Accept",vx="text/plain",yx="application/json",_T=`${yx}, ${vx}, */*`,Cr=class t{url;body=null;headers;context;reportProgress=!1;reportUploadProgress=!1;reportDownloadProgress=!1;withCredentials=!1;credentials;keepalive=!1;cache;priority;mode;redirect;referrer;integrity;referrerPolicy;responseType="json";method;params;urlWithParams;transferCache;timeout;constructor(n,e,i,o){this.url=e,this.method=n.toUpperCase();let a;if(vT(this.method)||o?(this.body=i!==void 0?i:null,a=o):a=i,a){if(this.reportProgress=!!a.reportProgress,this.reportUploadProgress=!!a.reportUploadProgress,this.reportDownloadProgress=!!a.reportDownloadProgress,this.withCredentials=!!a.withCredentials,this.keepalive=!!a.keepalive,a.responseType&&(this.responseType=a.responseType),a.headers&&(this.headers=a.headers),a.context&&(this.context=a.context),a.params&&(this.params=a.params),a.priority&&(this.priority=a.priority),a.cache&&(this.cache=a.cache),a.credentials&&(this.credentials=a.credentials),typeof a.timeout=="number"){if(a.timeout<1||!Number.isInteger(a.timeout))throw new te(2822,"");this.timeout=a.timeout}a.mode&&(this.mode=a.mode),a.redirect&&(this.redirect=a.redirect),a.integrity&&(this.integrity=a.integrity),a.referrer!==void 0&&(this.referrer=a.referrer),a.referrerPolicy&&(this.referrerPolicy=a.referrerPolicy),this.transferCache=a.transferCache}if(this.headers??=new Zi,this.context??=new Ih,!this.params)this.params=new Yi,this.urlWithParams=e;else{let r=this.params.toString();if(r.length===0)this.urlWithParams=e;else{let s=e,c="",d=e.indexOf("#");d!==-1&&(c=e.substring(d),s=e.substring(0,d));let l=s.indexOf("?"),m=l===-1?"?":l<s.length-1?"&":"";this.urlWithParams=s+m+r+c}}}serializeBody(){return this.body===null?null:typeof this.body=="string"||mx(this.body)||px(this.body)||fx(this.body)||yT(this.body)?this.body:this.body instanceof Yi?this.body.toString():typeof this.body=="object"||typeof this.body=="boolean"||Array.isArray(this.body)?JSON.stringify(this.body):this.body.toString()}detectContentTypeHeader(){return this.body===null||fx(this.body)?null:px(this.body)?this.body.type||null:mx(this.body)?null:typeof this.body=="string"?vx:this.body instanceof Yi?"application/x-www-form-urlencoded;charset=UTF-8":typeof this.body=="object"||typeof this.body=="number"||typeof this.body=="boolean"?yx:null}clone(n={}){let e=n.method||this.method,i=n.url||this.url,o=n.responseType||this.responseType,a=n.keepalive??this.keepalive,r=n.priority||this.priority,s=n.cache||this.cache,c=n.mode||this.mode,d=n.redirect||this.redirect,l=n.credentials||this.credentials,m=n.referrer??this.referrer,v=n.integrity||this.integrity,g=n.referrerPolicy||this.referrerPolicy,y=n.transferCache??this.transferCache,_=n.timeout??this.timeout,C=n.body!==void 0?n.body:this.body,w=n.withCredentials??this.withCredentials,E=n.reportProgress??this.reportProgress,U=n.reportUploadProgress??this.reportUploadProgress,F=n.reportDownloadProgress??this.reportDownloadProgress,j=n.headers||this.headers,Ie=n.params||this.params,tt=n.context??this.context;return n.setHeaders!==void 0&&(j=Object.keys(n.setHeaders).reduce((vn,Pt)=>vn.set(Pt,n.setHeaders[Pt]),j)),n.setParams&&(Ie=Object.keys(n.setParams).reduce((vn,Pt)=>vn.set(Pt,n.setParams[Pt]),Ie)),new t(e,i,C,{params:Ie,headers:j,context:tt,reportProgress:E,reportUploadProgress:U,reportDownloadProgress:F,responseType:o,withCredentials:w,transferCache:y,keepalive:a,cache:s,priority:r,timeout:_,mode:c,redirect:d,credentials:l,referrer:m,integrity:v,referrerPolicy:g})}},wa=(function(t){return t[t.Sent=0]="Sent",t[t.UploadProgress=1]="UploadProgress",t[t.ResponseHeader=2]="ResponseHeader",t[t.DownloadProgress=3]="DownloadProgress",t[t.Response=4]="Response",t[t.User=5]="User",t})(wa||{}),Qs=class{headers;status;statusText;url;ok;type;redirected;responseType;constructor(n,e=200,i="OK"){this.headers=n.headers||new Zi,this.status=n.status!==void 0?n.status:e,this.statusText=n.statusText||i,this.url=n.url||null,this.redirected=n.redirected,this.responseType=n.responseType,this.ok=this.status>=200&&this.status<300}},Nh=class t extends Qs{constructor(n={}){super(n)}type=wa.ResponseHeader;clone(n={}){return new t({headers:n.headers||this.headers,status:n.status!==void 0?n.status:this.status,statusText:n.statusText||this.statusText,url:n.url||this.url||void 0})}},Js=class t extends Qs{body;constructor(n={}){super(n),this.body=n.body!==void 0?n.body:null}type=wa.Response;clone(n={}){return new t({body:n.body!==void 0?n.body:this.body,headers:n.headers||this.headers,status:n.status!==void 0?n.status:this.status,statusText:n.statusText||this.statusText,url:n.url||this.url||void 0,redirected:n.redirected??this.redirected,responseType:n.responseType??this.responseType})}},Sa=class extends Qs{name="HttpErrorResponse";message;error;ok=!1;constructor(n){super(n,0,"Unknown Error"),this.status>=200&&this.status<300?this.message=`Http failure during parsing for ${n.url||"(unknown url)"}`:this.message=`Http failure response for ${n.url||"(unknown url)"}: ${n.status} ${n.statusText}`,this.error=n.error||null}},xT=200;var CT=/^\)\]\}',?\n/,l9=1024*1024,ST=new D("",{factory:()=>null}),wT=(()=>{class t{fetchImpl=p(Th,{optional:!0})?.fetch??((...e)=>globalThis.fetch(...e));ngZone=p(X);destroyRef=p(Wt);maxResponseSize=p(ST);handle(e){return new ge(i=>{let o=new AbortController,a=!1,r={next:c=>{c.type===wa.Response&&(a=!0),i.next(c)},error:c=>{a=!0,i.error(c)},complete:()=>{a=!0,i.complete()}};this.doRequest(e,o.signal,r).then(Ah,c=>r.error(new Sa({error:c})));let s;return e.timeout&&(s=this.ngZone.runOutsideAngular(()=>setTimeout(()=>{o.signal.aborted||o.abort(new DOMException("signal timed out","TimeoutError"))},e.timeout))),()=>{s!==void 0&&clearTimeout(s),!a&&!o.signal.aborted&&o.abort()}})}async doRequest(e,i,o){let a=this.createRequestInit(e),r;try{let C=this.ngZone.runOutsideAngular(()=>this.fetchImpl(e.urlWithParams,I({signal:i},a)));ET(C),o.next({type:wa.Sent}),r=await C}catch(C){o.error(new Sa({error:C,status:C.status??0,statusText:C.statusText,url:e.urlWithParams,headers:C.headers}));return}let s=new Zi(r.headers),c=r.statusText,d=r.url||e.urlWithParams,l=r.status,m=null,v=e.reportProgress||e.reportDownloadProgress;if(v&&o.next(new Nh({headers:s,status:l,statusText:c,url:d})),r.body){let C=r.headers.get(Dh)??"",w=r.headers.get("content-length"),E=w!==null?Number(w):NaN;this.maxResponseSize!==null&&Number.isFinite(E)&&E>this.maxResponseSize&&(await r.body.cancel(),gx(this.maxResponseSize));let U=[],F=r.body.getReader(),j=0,Ie,tt,vn=typeof Zone<"u"&&Zone.current,Pt=!1;if(await this.ngZone.runOutsideAngular(async()=>{for(;;){if(this.destroyRef.destroyed){await F.cancel(),Pt=!0;break}let{done:$,value:M}=await F.read();if($)break;if(U.push(M),j+=M.length,this.maxResponseSize!==null&&j>this.maxResponseSize&&(await F.cancel(),gx(this.maxResponseSize)),v){tt=e.responseType==="text"?(tt??"")+(Ie??=bx(C)).decode(M,{stream:!0}):void 0;let pe=()=>o.next({type:wa.DownloadProgress,total:Number.isFinite(E)?E:void 0,loaded:j,partialText:tt});vn?vn.run(pe):pe()}}}),Pt){o.complete();return}let ue=this.concatChunks(U,j);try{m=this.parseBody(e,ue,C,l)}catch($){o.error(new Sa({error:$,headers:new Zi(r.headers),status:r.status,statusText:r.statusText,url:r.url||e.urlWithParams}));return}}l===0&&(l=m?xT:0);let g=l>=200&&l<300,y=r.redirected,_=r.type;g?(o.next(new Js({body:m,headers:s,status:l,statusText:c,url:d,redirected:y,responseType:_})),o.complete()):o.error(new Sa({error:m,headers:s,status:l,statusText:c,url:d,redirected:y,responseType:_}))}parseBody(e,i,o,a){switch(e.responseType){case"json":let r=new TextDecoder().decode(i).replace(CT,"");if(r==="")return null;try{return JSON.parse(r)}catch(s){if(a<200||a>=300)return r;throw s}case"text":return bx(o).decode(i);case"blob":return new Blob([i],{type:o});case"arraybuffer":return i.buffer}}createRequestInit(e){if(e.reportUploadProgress)throw new te(2824,!1);let i={},o;if(o=e.credentials,e.withCredentials&&(o="include"),e.headers.forEach((a,r)=>i[a]=r.join(",")),e.headers.has(hx)||(i[hx]=_T),!e.headers.has(Dh)){let a=e.detectContentTypeHeader();a!==null&&(i[Dh]=a)}return{body:e.serializeBody(),method:e.method,headers:i,credentials:o,keepalive:e.keepalive,cache:e.cache,priority:e.priority,mode:e.mode,redirect:e.redirect,referrer:e.referrer,integrity:e.integrity,referrerPolicy:e.referrerPolicy}}concatChunks(e,i){let o=new Uint8Array(i),a=0;for(let r of e)o.set(r,a),a+=r.length;return o}static \u0275fac=function(i){return new(i||t)};static \u0275prov=ce({token:t,factory:t.\u0275fac})}return t})(),Th=class{};function Ah(){}function ET(t){t.then(Ah,Ah)}function gx(t){throw new te(-2825,!1)}var DT=/charset=\s*["']?([^;"'\s]+)["']?/i;function bx(t){let n=t.match(DT);if(n!==null)try{return new TextDecoder(n[1])}catch{}return new TextDecoder}var MT=new D("",{factory:()=>!0}),IT="XSRF-TOKEN",kT=new D("",{factory:()=>IT}),NT="X-XSRF-TOKEN",TT=new D("",{factory:()=>NT}),AT=(()=>{class t{cookieName=p(kT);doc=p(ae);lastCookieString="";lastToken=null;parseCount=0;getToken(){let e=this.doc.cookie||"";return e!==this.lastCookieString&&(this.parseCount++,this.lastToken=qs(e,this.cookieName),this.lastCookieString=e),this.lastToken}static \u0275fac=function(i){return new(i||t)};static \u0275prov=ce({token:t,factory:t.\u0275fac})}return t})(),OT=(()=>{class t{static \u0275fac=function(i){return new(i||t)};static \u0275prov=Le({token:t,factory:function(i){let o=null;return i?o=new(i||t):o=be(AT),o},providedIn:"root"})}return t})();function RT(t,n){if(!p(MT)||t.method==="GET"||t.method==="HEAD")return n(t);try{let o=p(xr).href,{origin:a}=new URL(o),{origin:r}=new URL(t.url,a);if(a!==r)return n(t)}catch{return n(t)}let e=p(OT).getToken(),i=p(TT);return e!=null&&!t.headers.has(i)&&(t=t.clone({headers:t.headers.set(i,e)})),n(t)}function PT(t,n){return n(t)}function FT(t,n,e){return(i,o)=>nr(e,()=>n(i,a=>t(a,o)))}var LT=new D("",{factory:()=>[RT]}),_x=new D(""),BT=new D("",{factory:()=>!0});var VT=(()=>{class t{static \u0275fac=function(i){return new(i||t)};static \u0275prov=Le({token:t,factory:function(i){let o=null;return i?o=new(i||t):o=be(wT),o},providedIn:"root"})}return t})();var jT=(()=>{class t{backend;injector;chain=null;pendingTasks=p(ks);contributeToStability=p(BT);constructor(e,i){this.backend=e,this.injector=i}handle(e){if(this.chain===null){let o=this.injector.get(xx,null,{skipSelf:!0}),a=o!==null&&this.backend===o,r=this.injector.get(_x,[],a?{self:!0}:void 0),s=Array.from(new Set([...this.injector.get(LT),...r]));this.chain=s.reduceRight((c,d)=>FT(c,d,this.injector),PT)}let i=this.chain;if(this.contributeToStability){let o=this.pendingTasks.add();return Xe(()=>i(e,a=>this.backend.handle(a))).pipe(ds(o))}else return Xe(()=>i(e,o=>this.backend.handle(o)))}static \u0275fac=function(i){return new(i||t)(be(VT),be(xt))};static \u0275prov=Le({token:t,factory:t.\u0275fac,providedIn:"root"})}return t})(),xx=(()=>{class t{static \u0275fac=function(i){return new(i||t)};static \u0275prov=Le({token:t,factory:function(i){let o=null;return i?o=new(i||t):o=be(jT),o},providedIn:"root"})}return t})();function Mh(t,n){return I({body:n},t)}var Oh=(()=>{class t{handler;constructor(e){this.handler=e}request(e,i,o={}){let a;if(e instanceof Cr)a=e;else{let c;o.headers instanceof Zi?c=o.headers:c=new Zi(o.headers);let d;o.params&&(o.params instanceof Yi?d=o.params:d=new Yi({fromObject:o.params})),a=new Cr(e,i,o.body!==void 0?o.body:null,{headers:c,context:o.context,params:d,reportProgress:o.reportProgress,reportUploadProgress:o.reportUploadProgress,reportDownloadProgress:o.reportDownloadProgress,responseType:o.responseType||"json",withCredentials:o.withCredentials,transferCache:o.transferCache,keepalive:o.keepalive,priority:o.priority,cache:o.cache,mode:o.mode,redirect:o.redirect,credentials:o.credentials,referrer:o.referrer,referrerPolicy:o.referrerPolicy,integrity:o.integrity,timeout:o.timeout})}let r=Nt(a).pipe(wm(c=>this.handler.handle(c)));if(e instanceof Cr||o.observe==="events")return r;let s=r.pipe(Ze(c=>c instanceof Js));switch(o.observe||"body"){case"body":switch(a.responseType){case"arraybuffer":return s.pipe(je(c=>{if(c.body!==null&&!(c.body instanceof ArrayBuffer))throw new te(2806,!1);return c.body}));case"blob":return s.pipe(je(c=>{if(c.body!==null&&!(c.body instanceof Blob))throw new te(2807,!1);return c.body}));case"text":return s.pipe(je(c=>{if(c.body!==null&&typeof c.body!="string")throw new te(2808,!1);return c.body}));default:return s.pipe(je(c=>c.body))}case"response":return s;default:throw new te(2809,!1)}}delete(e,i={}){return this.request("DELETE",e,i)}get(e,i={}){return this.request("GET",e,i)}head(e,i={}){return this.request("HEAD",e,i)}jsonp(e,i){return this.request("JSONP",e,{params:new Yi().append(i,"JSONP_CALLBACK"),observe:"body",responseType:"json"})}options(e,i={}){return this.request("OPTIONS",e,i)}patch(e,i,o={}){return this.request("PATCH",e,Mh(o,i))}post(e,i,o={}){return this.request("POST",e,Mh(o,i))}put(e,i,o={}){return this.request("PUT",e,Mh(o,i))}static \u0275fac=function(i){return new(i||t)(be(xx))};static \u0275prov=Le({token:t,factory:t.\u0275fac,providedIn:"root"})}return t})();var ec=(()=>{class t{static \u0275fac=function(i){return new(i||t)};static \u0275prov=Le({token:t,factory:function(i){let o=null;return i?o=new(i||t):o=be(HT),o},providedIn:"root"})}return t})(),HT=(()=>{class t extends ec{_doc=p(ae);sanitize(e,i){if(i==null)return null;switch(e){case Ut.NONE:return i;case Ut.HTML:return Co(i,"HTML")?Rn(i):Pf(this._doc,String(i)).toString();case Ut.STYLE:return Co(i,"Style")?Rn(i):i;case Ut.SCRIPT:if(Co(i,"Script"))return Rn(i);throw new te(5200,!1);case Ut.URL:return Co(i,"URL")?Rn(i):Vs(String(i));case Ut.RESOURCE_URL:if(Co(i,"ResourceURL"))return Rn(i);throw new te(-5201,!1);default:throw new te(5202,!1)}}bypassSecurityTrustHtml(e){return Nf(e)}bypassSecurityTrustStyle(e){return Tf(e)}bypassSecurityTrustScript(e){return Af(e)}bypassSecurityTrustUrl(e){return Of(e)}bypassSecurityTrustResourceUrl(e){return Rf(e)}static \u0275fac=function(i){return new(i||t)};static \u0275prov=ce({token:t,factory:t.\u0275fac})}return t})();var Cx={providers:[Ip(),lh()]};function Ea(t){return t.buttons===0||t.detail===0}function Da(t){let n=t.touches&&t.touches[0]||t.changedTouches&&t.changedTouches[0];return!!n&&n.identifier===-1&&(n.radiusX==null||n.radiusX===1)&&(n.radiusY==null||n.radiusY===1)}var Rh;function Sx(){if(Rh==null){let t=typeof document<"u"?document.head:null;Rh=!!(t&&(t.createShadowRoot||t.attachShadow))}return Rh}function Ph(t){if(Sx()){let n=t.getRootNode?t.getRootNode():null;if(typeof ShadowRoot<"u"&&ShadowRoot&&n instanceof ShadowRoot)return n}return null}function Ma(){let t=typeof document<"u"&&document?document.activeElement:null;for(;t&&t.shadowRoot;){let n=t.shadowRoot.activeElement;if(n===t)break;t=n}return t}function Gt(t){if(t.composedPath)try{return t.composedPath()[0]}catch{}return t.target}var Fh;try{Fh=typeof Intl<"u"&&Intl.v8BreakIterator}catch{Fh=!1}var Pe=(()=>{class t{_platformId=p(ga);isBrowser=this._platformId?ix(this._platformId):typeof document=="object"&&!!document;EDGE=this.isBrowser&&/(edge)/i.test(navigator.userAgent);TRIDENT=this.isBrowser&&/(msie|trident)/i.test(navigator.userAgent);BLINK=this.isBrowser&&!!(window.chrome||Fh)&&typeof CSS<"u"&&!this.EDGE&&!this.TRIDENT;WEBKIT=this.isBrowser&&/AppleWebKit/i.test(navigator.userAgent)&&!this.BLINK&&!this.EDGE&&!this.TRIDENT;IOS=this.isBrowser&&/iPad|iPhone|iPod/.test(navigator.userAgent)&&!("MSStream"in window);FIREFOX=this.isBrowser&&/(firefox|minefield)/i.test(navigator.userAgent);ANDROID=this.isBrowser&&/android/i.test(navigator.userAgent)&&!this.TRIDENT;SAFARI=this.isBrowser&&/safari/i.test(navigator.userAgent)&&this.WEBKIT;static \u0275fac=function(i){return new(i||t)};static \u0275prov=ce({token:t,factory:t.\u0275fac})}return t})();var tc;function wx(){if(tc==null&&typeof window<"u")try{window.addEventListener("test",null,Object.defineProperty({},"passive",{get:()=>tc=!0}))}finally{tc=tc||!1}return tc}function Sr(t){return wx()?t:!!t.capture}function ii(t,n=0){return Ex(t)?Number(t):arguments.length===2?n:0}function Ex(t){return!isNaN(parseFloat(t))&&!isNaN(Number(t))}function gn(t){return t instanceof q?t.nativeElement:t}var Dx=new D("cdk-input-modality-detector-options"),Mx={ignoreKeys:[18,17,224,91,16]},Ix=650,Lh={passive:!0,capture:!0},kx=(()=>{class t{_platform=p(Pe);_listenerCleanups;modalityDetected;modalityChanged;get mostRecentModality(){return this._modality.value}_mostRecentTarget=null;_modality=new co(null);_options;_lastTouchMs=0;_onKeydown=e=>{this._options?.ignoreKeys?.some(i=>i===e.keyCode)||(this._modality.next("keyboard"),this._mostRecentTarget=Gt(e))};_onMousedown=e=>{Date.now()-this._lastTouchMs<Ix||(this._modality.next(Ea(e)?"keyboard":"mouse"),this._mostRecentTarget=Gt(e))};_onTouchstart=e=>{if(Da(e)){this._modality.next("keyboard");return}this._lastTouchMs=Date.now(),this._modality.next("touch"),this._mostRecentTarget=Gt(e)};constructor(){let e=p(X),i=p(ae),o=p(Dx,{optional:!0});if(this._options=I(I({},Mx),o),this.modalityDetected=this._modality.pipe(Jo(1)),this.modalityChanged=this.modalityDetected.pipe(bl()),this._platform.isBrowser){let a=p(Lt).createRenderer(null,null);this._listenerCleanups=e.runOutsideAngular(()=>[a.listen(i,"keydown",this._onKeydown,Lh),a.listen(i,"mousedown",this._onMousedown,Lh),a.listen(i,"touchstart",this._onTouchstart,Lh)])}}ngOnDestroy(){this._modality.complete(),this._listenerCleanups?.forEach(e=>e())}static \u0275fac=function(i){return new(i||t)};static \u0275prov=ce({token:t,factory:t.\u0275fac})}return t})(),nc=(function(t){return t[t.IMMEDIATE=0]="IMMEDIATE",t[t.EVENTUAL=1]="EVENTUAL",t})(nc||{}),Nx=new D("cdk-focus-monitor-default-options"),$d=Sr({passive:!0,capture:!0}),un=(()=>{class t{_ngZone=p(X);_platform=p(Pe);_inputModalityDetector=p(kx);_origin=null;_lastFocusOrigin=null;_windowFocused=!1;_windowFocusTimeoutId;_originTimeoutId;_originFromTouchInteraction=!1;_elementInfo=new Map;_monitoredElementCount=0;_rootNodeFocusListenerCount=new Map;_detectionMode;_windowFocusListener=()=>{this._windowFocused=!0,this._windowFocusTimeoutId=setTimeout(()=>this._windowFocused=!1)};_document=p(ae);_stopInputModalityDetector=new B;constructor(){let e=p(Nx,{optional:!0});this._detectionMode=e?.detectionMode||nc.IMMEDIATE}_rootNodeFocusAndBlurListener=e=>{let i=Gt(e);for(let o=i;o;o=o.parentElement)e.type==="focus"?this._onFocus(e,o):this._onBlur(e,o)};monitor(e,i=!1){let o=gn(e);if(!this._platform.isBrowser||o.nodeType!==1)return Nt();let a=Ph(o)||this._document,r=this._elementInfo.get(o);if(r)return i&&(r.checkChildren=!0),r.subject;let s={checkChildren:i,subject:new B,rootNode:a};return this._elementInfo.set(o,s),this._registerGlobalListeners(s),s.subject}stopMonitoring(e){let i=gn(e),o=this._elementInfo.get(i);o&&(o.subject.complete(),this._setClasses(i),this._elementInfo.delete(i),this._removeGlobalListeners(o))}focusVia(e,i,o){let a=gn(e),r=this._document.activeElement;a===r?this._getClosestElementsInfo(a).forEach(([s,c])=>this._originChanged(s,i,c)):(this._setOrigin(i),typeof a.focus=="function"&&a.focus(o))}ngOnDestroy(){this._elementInfo.forEach((e,i)=>this.stopMonitoring(i))}_getWindow(){return this._document.defaultView||window}_getFocusOrigin(e){return this._origin?this._originFromTouchInteraction?this._shouldBeAttributedToTouch(e)?"touch":"program":this._origin:this._windowFocused&&this._lastFocusOrigin?this._lastFocusOrigin:e&&this._isLastInteractionFromInputLabel(e)?"mouse":"program"}_shouldBeAttributedToTouch(e){return this._detectionMode===nc.EVENTUAL||!!e?.contains(this._inputModalityDetector._mostRecentTarget)}_setClasses(e,i){e.classList.toggle("cdk-focused",!!i),e.classList.toggle("cdk-touch-focused",i==="touch"),e.classList.toggle("cdk-keyboard-focused",i==="keyboard"),e.classList.toggle("cdk-mouse-focused",i==="mouse"),e.classList.toggle("cdk-program-focused",i==="program")}_setOrigin(e,i=!1){this._ngZone.runOutsideAngular(()=>{if(this._origin=e,this._originFromTouchInteraction=e==="touch"&&i,this._detectionMode===nc.IMMEDIATE){clearTimeout(this._originTimeoutId);let o=this._originFromTouchInteraction?Ix:1;this._originTimeoutId=setTimeout(()=>this._origin=null,o)}})}_onFocus(e,i){let o=this._elementInfo.get(i),a=Gt(e);!o||!o.checkChildren&&i!==a||this._originChanged(i,this._getFocusOrigin(a),o)}_onBlur(e,i){let o=this._elementInfo.get(i);!o||o.checkChildren&&e.relatedTarget instanceof Node&&i.contains(e.relatedTarget)||(this._setClasses(i),this._emitOrigin(o,null))}_emitOrigin(e,i){e.subject.observers.length&&this._ngZone.run(()=>e.subject.next(i))}_registerGlobalListeners(e){if(!this._platform.isBrowser)return;let i=e.rootNode,o=this._rootNodeFocusListenerCount.get(i)||0;o||this._ngZone.runOutsideAngular(()=>{i.addEventListener("focus",this._rootNodeFocusAndBlurListener,$d),i.addEventListener("blur",this._rootNodeFocusAndBlurListener,$d)}),this._rootNodeFocusListenerCount.set(i,o+1),++this._monitoredElementCount===1&&(this._ngZone.runOutsideAngular(()=>{this._getWindow().addEventListener("focus",this._windowFocusListener)}),this._inputModalityDetector.modalityDetected.pipe(Re(this._stopInputModalityDetector)).subscribe(a=>{this._setOrigin(a,!0)}))}_removeGlobalListeners(e){let i=e.rootNode;if(this._rootNodeFocusListenerCount.has(i)){let o=this._rootNodeFocusListenerCount.get(i);o>1?this._rootNodeFocusListenerCount.set(i,o-1):(i.removeEventListener("focus",this._rootNodeFocusAndBlurListener,$d),i.removeEventListener("blur",this._rootNodeFocusAndBlurListener,$d),this._rootNodeFocusListenerCount.delete(i))}--this._monitoredElementCount||(this._getWindow().removeEventListener("focus",this._windowFocusListener),this._stopInputModalityDetector.next(),clearTimeout(this._windowFocusTimeoutId),clearTimeout(this._originTimeoutId))}_originChanged(e,i,o){this._setClasses(e,i),this._emitOrigin(o,i),this._lastFocusOrigin=i}_getClosestElementsInfo(e){let i=[];return this._elementInfo.forEach((o,a)=>{(a===e||o.checkChildren&&a.contains(e))&&i.push([a,o])}),i}_isLastInteractionFromInputLabel(e){let{_mostRecentTarget:i,mostRecentModality:o}=this._inputModalityDetector;if(o!=="mouse"||!i||i===e||e.nodeName!=="INPUT"&&e.nodeName!=="TEXTAREA"||e.disabled)return!1;let a=e.labels;if(a){for(let r=0;r<a.length;r++)if(a[r].contains(i))return!0}return!1}static \u0275fac=function(i){return new(i||t)};static \u0275prov=ce({token:t,factory:t.\u0275fac})}return t})(),Bh=(()=>{class t{_elementRef=p(q);_focusMonitor=p(un);_monitorSubscription;_focusOrigin=null;cdkFocusChange=new K;get focusOrigin(){return this._focusOrigin}ngAfterViewInit(){let e=this._elementRef.nativeElement;this._monitorSubscription=this._focusMonitor.monitor(e,e.nodeType===1&&e.hasAttribute("cdkMonitorSubtreeFocus")).subscribe(i=>{this._focusOrigin=i,this.cdkFocusChange.emit(i)})}ngOnDestroy(){this._focusMonitor.stopMonitoring(this._elementRef),this._monitorSubscription?.unsubscribe()}static \u0275fac=function(i){return new(i||t)};static \u0275dir=ee({type:t,selectors:[["","cdkMonitorElementFocus",""],["","cdkMonitorSubtreeFocus",""]],outputs:{cdkFocusChange:"cdkFocusChange"},exportAs:["cdkMonitorFocus"]})}return t})();var Ud=new WeakMap,ut=(()=>{class t{_appRef;_injector=p(ie);_environmentInjector=p(xt);load(e){let i=this._appRef=this._appRef||this._injector.get(Fn),o=Ud.get(i);o||(o={loaders:new Set,refs:[]},Ud.set(i,o),i.onDestroy(()=>{Ud.get(i)?.refs.forEach(a=>a.destroy()),Ud.delete(i)})),o.loaders.has(e)||(o.loaders.add(e),o.refs.push(Rd(e,{environmentInjector:this._environmentInjector})))}static \u0275fac=function(i){return new(i||t)};static \u0275prov=ce({token:t,factory:t.\u0275fac})}return t})();var Mo=(()=>{class t{static \u0275fac=function(i){return new(i||t)};static \u0275cmp=H({type:t,selectors:[["ng-component"]],exportAs:["cdkVisuallyHidden"],decls:0,vars:0,template:function(i,o){},styles:[`.cdk-visually-hidden {
  border: 0;
  clip: rect(0 0 0 0);
  height: 1px;
  margin: -1px;
  overflow: hidden;
  padding: 0;
  position: absolute;
  width: 1px;
  white-space: nowrap;
  outline: 0;
  -webkit-appearance: none;
  -moz-appearance: none;
  left: 0;
}
[dir=rtl] .cdk-visually-hidden {
  left: auto;
  right: 0;
}
`],encapsulation:2})}return t})(),Gd;function UT(){if(Gd===void 0&&(Gd=null,typeof window<"u")){let t=window;if(t.trustedTypes!==void 0)try{Gd=t.trustedTypes.createPolicy("angular#components",{createHTML:n=>n})}catch(n){console.error(n)}}return Gd}function Ia(t){return UT()?.createHTML(t)||t}function Tx(t,n,e){let i=e.sanitize(Ut.HTML,n);t.innerHTML=Ia(i||"")}function Ki(t){return Array.isArray(t)?t:[t]}var Ax=new Set,ka,wr=(()=>{class t{_platform=p(Pe);_nonce=p(yo,{optional:!0});_matchMedia;constructor(){this._matchMedia=this._platform.isBrowser&&window.matchMedia?window.matchMedia.bind(window):WT}matchMedia(e){return(this._platform.WEBKIT||this._platform.BLINK)&&GT(e,this._nonce),this._matchMedia(e)}static \u0275fac=function(i){return new(i||t)};static \u0275prov=ce({token:t,factory:t.\u0275fac})}return t})();function GT(t,n){if(!Ax.has(t))try{ka||(ka=document.createElement("style"),n&&ka.setAttribute("nonce",n),ka.setAttribute("type","text/css"),document.head.appendChild(ka)),ka.sheet&&(ka.sheet.insertRule(`@media ${t.replace(/[{}]/g,"")} {body{ }}`,0),Ax.add(t))}catch(e){console.error(e)}}function WT(t){return{matches:t==="all"||t==="",media:t,addListener:()=>{},removeListener:()=>{}}}var ic=(()=>{class t{_mediaMatcher=p(wr);_zone=p(X);_queries=new Map;_destroySubject=new B;ngOnDestroy(){this._destroySubject.next(),this._destroySubject.complete()}isMatched(e){return Ox(Ki(e)).some(o=>this._registerQuery(o).mql.matches)}observe(e){let o=Ox(Ki(e)).map(r=>this._registerQuery(r).observable),a=Sm(o);return a=mo(a.pipe(Ft(1)),a.pipe(Jo(1),Ai(0))),a.pipe(je(r=>{let s={matches:!1,breakpoints:{}};return r.forEach(({matches:c,query:d})=>{s.matches=s.matches||c,s.breakpoints[d]=c}),s}))}_registerQuery(e){if(this._queries.has(e))return this._queries.get(e);let i=this._mediaMatcher.matchMedia(e),a={observable:new ge(r=>{let s=c=>this._zone.run(()=>r.next(c));return i.addListener(s),()=>{i.removeListener(s)}}).pipe(st(i),je(({matches:r})=>({query:e,matches:r})),Re(this._destroySubject)),mql:i};return this._queries.set(e,a),a}static \u0275fac=function(i){return new(i||t)};static \u0275prov=ce({token:t,factory:t.\u0275fac})}return t})();function Ox(t){return t.map(n=>n.split(",")).reduce((n,e)=>n.concat(e)).map(n=>n.trim())}function qT(t){if(t.type==="characterData"&&t.target instanceof Comment)return!0;if(t.type==="childList"){for(let n=0;n<t.addedNodes.length;n++)if(!(t.addedNodes[n]instanceof Comment))return!1;for(let n=0;n<t.removedNodes.length;n++)if(!(t.removedNodes[n]instanceof Comment))return!1;return!0}return!1}var Rx=(()=>{class t{create(e){return typeof MutationObserver>"u"?null:new MutationObserver(e)}static \u0275fac=function(i){return new(i||t)};static \u0275prov=ce({token:t,factory:t.\u0275fac})}return t})(),Px=(()=>{class t{_mutationObserverFactory=p(Rx);_observedElements=new Map;_ngZone=p(X);ngOnDestroy(){this._observedElements.forEach((e,i)=>this._cleanupObserver(i))}observe(e){let i=gn(e);return new ge(o=>{let r=this._observeElement(i).pipe(je(s=>s.filter(c=>!qT(c))),Ze(s=>!!s.length)).subscribe(s=>{this._ngZone.run(()=>{o.next(s)})});return()=>{r.unsubscribe(),this._unobserveElement(i)}})}_observeElement(e){return this._ngZone.runOutsideAngular(()=>{if(this._observedElements.has(e))this._observedElements.get(e).count++;else{let i=new B,o=this._mutationObserverFactory.create(a=>i.next(a));o&&o.observe(e,{characterData:!0,childList:!0,subtree:!0}),this._observedElements.set(e,{observer:o,stream:i,count:1})}return this._observedElements.get(e).stream})}_unobserveElement(e){this._observedElements.has(e)&&(this._observedElements.get(e).count--,this._observedElements.get(e).count||this._cleanupObserver(e))}_cleanupObserver(e){if(this._observedElements.has(e)){let{observer:i,stream:o}=this._observedElements.get(e);i&&i.disconnect(),o.complete(),this._observedElements.delete(e)}}static \u0275fac=function(i){return new(i||t)};static \u0275prov=ce({token:t,factory:t.\u0275fac})}return t})(),Fx=(()=>{class t{_contentObserver=p(Px);_elementRef=p(q);event=new K;get disabled(){return this._disabled}set disabled(e){this._disabled=e,this._disabled?this._unsubscribe():this._subscribe()}_disabled=!1;get debounce(){return this._debounce}set debounce(e){this._debounce=ii(e),this._subscribe()}_debounce;_currentSubscription=null;ngAfterContentInit(){!this._currentSubscription&&!this.disabled&&this._subscribe()}ngOnDestroy(){this._unsubscribe()}_subscribe(){this._unsubscribe();let e=this._contentObserver.observe(this._elementRef);this._currentSubscription=(this.debounce?e.pipe(Ai(this.debounce)):e).subscribe(this.event)}_unsubscribe(){this._currentSubscription?.unsubscribe()}static \u0275fac=function(i){return new(i||t)};static \u0275dir=ee({type:t,selectors:[["","cdkObserveContent",""]],inputs:{disabled:[2,"cdkObserveContentDisabled","disabled",O],debounce:"debounce"},outputs:{event:"cdkObserveContent"},exportAs:["cdkObserveContent"]})}return t})(),Wd=(()=>{class t{static \u0275fac=function(i){return new(i||t)};static \u0275mod=le({type:t});static \u0275inj=se({providers:[Rx]})}return t})();var qd=(()=>{class t{_platform=p(Pe);isDisabled(e){return e.hasAttribute("disabled")}isVisible(e){return ZT(e)&&getComputedStyle(e).visibility==="visible"}isTabbable(e){if(!this._platform.isBrowser)return!1;let i=YT(i1(e));if(i&&(Lx(i)===-1||!this.isVisible(i)))return!1;let o=e.nodeName.toLowerCase(),a=Lx(e);return e.hasAttribute("contenteditable")?a!==-1:o==="iframe"||o==="object"||this._platform.WEBKIT&&this._platform.IOS&&!t1(e)?!1:o==="audio"?e.hasAttribute("controls")?a!==-1:!1:o==="video"?a===-1?!1:a!==null?!0:this._platform.FIREFOX||e.hasAttribute("controls"):e.tabIndex>=0}isFocusable(e,i){return n1(e)&&!this.isDisabled(e)&&(i?.ignoreInert||!e.closest?.("[inert]"))&&(i?.ignoreVisibility||this.isVisible(e))}static \u0275fac=function(i){return new(i||t)};static \u0275prov=ce({token:t,factory:t.\u0275fac})}return t})();function YT(t){try{return t.frameElement}catch{return null}}function ZT(t){return!!(t.offsetWidth||t.offsetHeight||typeof t.getClientRects=="function"&&t.getClientRects().length)}function KT(t){let n=t.nodeName.toLowerCase();return n==="input"||n==="select"||n==="button"||n==="textarea"}function XT(t){return JT(t)&&t.type=="hidden"}function QT(t){return e1(t)&&t.hasAttribute("href")}function JT(t){return t.nodeName.toLowerCase()=="input"}function e1(t){return t.nodeName.toLowerCase()=="a"}function jx(t){if(!t.hasAttribute("tabindex")||t.tabIndex===void 0)return!1;let n=t.getAttribute("tabindex");return!!(n&&!isNaN(parseInt(n,10)))}function Lx(t){if(!jx(t))return null;let n=parseInt(t.getAttribute("tabindex")||"",10);return isNaN(n)?-1:n}function t1(t){let n=t.nodeName.toLowerCase(),e=n==="input"&&t.type;return e==="text"||e==="password"||n==="select"||n==="textarea"}function n1(t){return XT(t)?!1:KT(t)||QT(t)||t.hasAttribute("contenteditable")||jx(t)}function i1(t){return t.ownerDocument&&t.ownerDocument.defaultView||window}var jh=class{_element;_checker;_ngZone;_document;_injector;_startAnchor=null;_endAnchor=null;_hasAttached=!1;startAnchorListener=()=>{!this.focusLastTabbableElement()&&this._checker.isFocusable(this._element)&&this._element.focus()};endAnchorListener=()=>{!this.focusFirstTabbableElement()&&this._checker.isFocusable(this._element)&&this._element.focus()};get enabled(){return this._enabled}set enabled(n){this._enabled=n,this._startAnchor&&this._endAnchor&&(this._toggleAnchorTabIndex(n,this._startAnchor),this._toggleAnchorTabIndex(n,this._endAnchor))}_enabled=!0;constructor(n,e,i,o,a=!1,r){this._element=n,this._checker=e,this._ngZone=i,this._document=o,this._injector=r,a||this.attachAnchors()}destroy(){let n=this._startAnchor,e=this._endAnchor;n&&(n.removeEventListener("focus",this.startAnchorListener),n.remove()),e&&(e.removeEventListener("focus",this.endAnchorListener),e.remove()),this._startAnchor=this._endAnchor=null,this._hasAttached=!1}attachAnchors(){return this._hasAttached?!0:(this._ngZone.runOutsideAngular(()=>{this._startAnchor||(this._startAnchor=this._createAnchor(),this._startAnchor.addEventListener("focus",this.startAnchorListener)),this._endAnchor||(this._endAnchor=this._createAnchor(),this._endAnchor.addEventListener("focus",this.endAnchorListener))}),this._element.parentNode&&(this._element.parentNode.insertBefore(this._startAnchor,this._element),this._element.parentNode.insertBefore(this._endAnchor,this._element.nextSibling),this._hasAttached=!0),this._hasAttached)}focusInitialElementWhenReady(n){return new Promise(e=>{this._executeOnStable(()=>e(this.focusInitialElement(n)))})}focusFirstTabbableElementWhenReady(n){return new Promise(e=>{this._executeOnStable(()=>e(this.focusFirstTabbableElement(n)))})}focusLastTabbableElementWhenReady(n){return new Promise(e=>{this._executeOnStable(()=>e(this.focusLastTabbableElement(n)))})}_getRegionBoundary(n){let e=this._element.querySelectorAll(`[cdk-focus-region-${n}], [cdkFocusRegion${n}], [cdk-focus-${n}]`);return n=="start"?e.length?e[0]:this._getFirstTabbableElement(this._element):e.length?e[e.length-1]:this._getLastTabbableElement(this._element)}focusInitialElement(n){let e=this._element.querySelector("[cdk-focus-initial], [cdkFocusInitial]");if(e){if(!this._checker.isFocusable(e)){let i=this._getFirstTabbableElement(e);return i?.focus(n),!!i}return e.focus(n),!0}return this.focusFirstTabbableElement(n)}focusFirstTabbableElement(n){let e=this._getRegionBoundary("start");return e&&e.focus(n),!!e}focusLastTabbableElement(n){let e=this._getRegionBoundary("end");return e&&e.focus(n),!!e}hasAttached(){return this._hasAttached}_getFirstTabbableElement(n){if(this._checker.isFocusable(n)&&this._checker.isTabbable(n))return n;let e=n.children;for(let i=0;i<e.length;i++){let o=e[i].nodeType===this._document.ELEMENT_NODE?this._getFirstTabbableElement(e[i]):null;if(o)return o}return null}_getLastTabbableElement(n){if(this._checker.isFocusable(n)&&this._checker.isTabbable(n))return n;let e=n.children;for(let i=e.length-1;i>=0;i--){let o=e[i].nodeType===this._document.ELEMENT_NODE?this._getLastTabbableElement(e[i]):null;if(o)return o}return null}_createAnchor(){let n=this._document.createElement("div");return this._toggleAnchorTabIndex(this._enabled,n),n.classList.add("cdk-visually-hidden"),n.classList.add("cdk-focus-trap-anchor"),n.setAttribute("aria-hidden","true"),n}_toggleAnchorTabIndex(n,e){n?e.setAttribute("tabindex","0"):e.removeAttribute("tabindex")}toggleAnchors(n){this._startAnchor&&this._endAnchor&&(this._toggleAnchorTabIndex(n,this._startAnchor),this._toggleAnchorTabIndex(n,this._endAnchor))}_executeOnStable(n){Et(n,{injector:this._injector})}},zh=(()=>{class t{_checker=p(qd);_ngZone=p(X);_document=p(ae);_injector=p(ie);constructor(){p(ut).load(Mo)}create(e,i=!1){return new jh(e,this._checker,this._ngZone,this._document,i,this._injector)}static \u0275fac=function(i){return new(i||t)};static \u0275prov=ce({token:t,factory:t.\u0275fac})}return t})();var zx=new D("liveAnnouncerElement",{providedIn:"root",factory:()=>null}),Hx=new D("LIVE_ANNOUNCER_DEFAULT_OPTIONS"),o1=0,Hh=(()=>{class t{_ngZone=p(X);_defaultOptions=p(Hx,{optional:!0});_liveElement;_document=p(ae);_sanitizer=p(ec);_previousTimeout;_currentPromise;_currentResolve;constructor(){let e=p(zx,{optional:!0});this._liveElement=e||this._createLiveElement()}announce(e,...i){let o=this._defaultOptions,a,r;return i.length===1&&typeof i[0]=="number"?r=i[0]:[a,r]=i,this.clear(),clearTimeout(this._previousTimeout),a||(a=o&&o.politeness?o.politeness:"polite"),r==null&&o&&(r=o.duration),this._liveElement.setAttribute("aria-live",a),this._liveElement.id&&this._exposeAnnouncerToModals(this._liveElement.id),this._ngZone.runOutsideAngular(()=>(this._currentPromise||(this._currentPromise=new Promise(s=>this._currentResolve=s)),clearTimeout(this._previousTimeout),this._previousTimeout=setTimeout(()=>{!e||typeof e=="string"?this._liveElement.textContent=e:Tx(this._liveElement,e,this._sanitizer),typeof r=="number"&&(this._previousTimeout=setTimeout(()=>this.clear(),r)),this._currentResolve?.(),this._currentPromise=this._currentResolve=void 0},100),this._currentPromise))}clear(){this._liveElement&&(this._liveElement.textContent="")}ngOnDestroy(){clearTimeout(this._previousTimeout),this._liveElement?.remove(),this._liveElement=null,this._currentResolve?.(),this._currentPromise=this._currentResolve=void 0}_createLiveElement(){let e="cdk-live-announcer-element",i=this._document.getElementsByClassName(e),o=this._document.createElement("div");for(let a=0;a<i.length;a++)i[a].remove();return o.classList.add(e),o.classList.add("cdk-visually-hidden"),o.setAttribute("aria-atomic","true"),o.setAttribute("aria-live","polite"),o.id=`cdk-live-announcer-${o1++}`,this._document.body.appendChild(o),o}_exposeAnnouncerToModals(e){let i=this._document.querySelectorAll('body > .cdk-overlay-container [aria-modal="true"]');for(let o=0;o<i.length;o++){let a=i[o],r=a.getAttribute("aria-owns");r?r.indexOf(e)===-1&&a.setAttribute("aria-owns",r+" "+e):a.setAttribute("aria-owns",e)}}static \u0275fac=function(i){return new(i||t)};static \u0275prov=ce({token:t,factory:t.\u0275fac})}return t})();var Io=(function(t){return t[t.NONE=0]="NONE",t[t.BLACK_ON_WHITE=1]="BLACK_ON_WHITE",t[t.WHITE_ON_BLACK=2]="WHITE_ON_BLACK",t})(Io||{}),Bx="cdk-high-contrast-black-on-white",Vx="cdk-high-contrast-white-on-black",Vh="cdk-high-contrast-active",$x=(()=>{class t{_platform=p(Pe);_hasCheckedHighContrastMode=!1;_document=p(ae);_breakpointSubscription;constructor(){this._breakpointSubscription=p(ic).observe("(forced-colors: active)").subscribe(()=>{this._hasCheckedHighContrastMode&&(this._hasCheckedHighContrastMode=!1,this._applyBodyHighContrastModeCssClasses())})}getHighContrastMode(){if(!this._platform.isBrowser)return Io.NONE;let e=this._document.createElement("div");e.style.backgroundColor="rgb(1,2,3)",e.style.position="absolute",this._document.body.appendChild(e);let i=this._document.defaultView||window,o=i&&i.getComputedStyle?i.getComputedStyle(e):null,a=(o&&o.backgroundColor||"").replace(/ /g,"");switch(e.remove(),a){case"rgb(0,0,0)":case"rgb(45,50,54)":case"rgb(32,32,32)":return Io.WHITE_ON_BLACK;case"rgb(255,255,255)":case"rgb(255,250,239)":return Io.BLACK_ON_WHITE}return Io.NONE}ngOnDestroy(){this._breakpointSubscription.unsubscribe()}_applyBodyHighContrastModeCssClasses(){if(!this._hasCheckedHighContrastMode&&this._platform.isBrowser&&this._document.body){let e=this._document.body.classList;e.remove(Vh,Bx,Vx),this._hasCheckedHighContrastMode=!0;let i=this.getHighContrastMode();i===Io.BLACK_ON_WHITE?e.add(Vh,Bx):i===Io.WHITE_ON_BLACK&&e.add(Vh,Vx)}}static \u0275fac=function(i){return new(i||t)};static \u0275prov=ce({token:t,factory:t.\u0275fac})}return t})(),Er=(()=>{class t{constructor(){p($x)._applyBodyHighContrastModeCssClasses()}static \u0275fac=function(i){return new(i||t)};static \u0275mod=le({type:t});static \u0275inj=se({imports:[Wd]})}return t})();var a1=200,Yd=class{_letterKeyStream=new B;_items=[];_selectedItemIndex=-1;_pressedLetters=[];_skipPredicateFn;_selectedItem=new B;selectedItem=this._selectedItem;constructor(n,e){let i=typeof e?.debounceInterval=="number"?e.debounceInterval:a1;e?.skipPredicate&&(this._skipPredicateFn=e.skipPredicate),this.setItems(n),this._setupKeyHandler(i)}destroy(){this._pressedLetters=[],this._letterKeyStream.complete(),this._selectedItem.complete()}setCurrentSelectedItemIndex(n){this._selectedItemIndex=n}setItems(n){this._items=n}handleKey(n){let e=n.keyCode;n.key&&n.key.length===1?this._letterKeyStream.next(n.key.toLocaleUpperCase()):(e>=65&&e<=90||e>=48&&e<=57)&&this._letterKeyStream.next(String.fromCharCode(e))}isTyping(){return this._pressedLetters.length>0}reset(){this._pressedLetters=[]}_setupKeyHandler(n){this._letterKeyStream.pipe(Oi(e=>this._pressedLetters.push(e)),Ai(n),Ze(()=>this._pressedLetters.length>0),je(()=>this._pressedLetters.join("").toLocaleUpperCase())).subscribe(e=>{for(let i=1;i<this._items.length+1;i++){let o=(this._selectedItemIndex+i)%this._items.length,a=this._items[o];if(!this._skipPredicateFn?.(a)&&a.getLabel?.().toLocaleUpperCase().trim().indexOf(e)===0){this._selectedItem.next(a);break}}this._pressedLetters=[]})}};function pt(t,...n){return n.length?n.some(e=>t[e]):t.altKey||t.shiftKey||t.ctrlKey||t.metaKey}var Dr=class{_items;_activeItemIndex=G(-1);_activeItem=G(null);_wrap=!1;_typeaheadSubscription=_e.EMPTY;_itemChangesSubscription;_vertical=!0;_horizontal=null;_allowedModifierKeys=[];_homeAndEnd=!1;_pageUpAndDown={enabled:!1,delta:10};_effectRef;_typeahead;_skipPredicateFn=n=>n.disabled;constructor(n,e){this._items=n,n instanceof Mn?this._itemChangesSubscription=n.changes.subscribe(i=>this._itemsChanged(i.toArray())):dn(n)&&(this._effectRef=lt(()=>this._itemsChanged(n()),{injector:e}))}tabOut=new B;change=new B;skipPredicate(n){return this._skipPredicateFn=n,this}withWrap(n=!0){return this._wrap=n,this}withVerticalOrientation(n=!0){return this._vertical=n,this}withHorizontalOrientation(n){return this._horizontal=n,this}withAllowedModifierKeys(n){return this._allowedModifierKeys=n,this}withTypeAhead(n=200){this._typeaheadSubscription.unsubscribe();let e=this._getItemsArray();return this._typeahead=new Yd(e,{debounceInterval:typeof n=="number"?n:void 0,skipPredicate:i=>this._skipPredicateFn(i)}),this._typeaheadSubscription=this._typeahead.selectedItem.subscribe(i=>{this.setActiveItem(i)}),this}cancelTypeahead(){return this._typeahead?.reset(),this}withHomeAndEnd(n=!0){return this._homeAndEnd=n,this}withPageUpDown(n=!0,e=10){return this._pageUpAndDown={enabled:n,delta:e},this}setActiveItem(n){let e=this._activeItem();this.updateActiveItem(n),this._activeItem()!==e&&this.change.next(this._activeItemIndex())}onKeydown(n){let e=n.keyCode,o=["altKey","ctrlKey","metaKey","shiftKey"].every(a=>!n[a]||this._allowedModifierKeys.indexOf(a)>-1);switch(e){case 9:this.tabOut.next();return;case 40:if(this._vertical&&o){this.setNextItemActive();break}else return;case 38:if(this._vertical&&o){this.setPreviousItemActive();break}else return;case 39:if(this._horizontal&&o){this._horizontal==="rtl"?this.setPreviousItemActive():this.setNextItemActive();break}else return;case 37:if(this._horizontal&&o){this._horizontal==="rtl"?this.setNextItemActive():this.setPreviousItemActive();break}else return;case 36:if(this._homeAndEnd&&o){this.setFirstItemActive();break}else return;case 35:if(this._homeAndEnd&&o){this.setLastItemActive();break}else return;case 33:if(this._pageUpAndDown.enabled&&o){let a=this._activeItemIndex()-this._pageUpAndDown.delta;this._setActiveItemByIndex(a>0?a:0,1);break}else return;case 34:if(this._pageUpAndDown.enabled&&o){let a=this._activeItemIndex()+this._pageUpAndDown.delta,r=this._getItemsArray().length;this._setActiveItemByIndex(a<r?a:r-1,-1);break}else return;default:(o||pt(n,"shiftKey"))&&this._typeahead?.handleKey(n);return}this._typeahead?.reset(),n.preventDefault()}get activeItemIndex(){return this._activeItemIndex()}get activeItem(){return this._activeItem()}isTyping(){return!!this._typeahead&&this._typeahead.isTyping()}setFirstItemActive(){this._setActiveItemByIndex(0,1)}setLastItemActive(){this._setActiveItemByIndex(this._getItemsArray().length-1,-1)}setNextItemActive(){this._activeItemIndex()<0?this.setFirstItemActive():this._setActiveItemByDelta(1)}setPreviousItemActive(){this._activeItemIndex()<0&&this._wrap?this.setLastItemActive():this._setActiveItemByDelta(-1)}updateActiveItem(n){let e=this._getItemsArray(),i=typeof n=="number"?n:e.indexOf(n),o=e[i];this._activeItem.set(o??null),this._activeItemIndex.set(i),this._typeahead?.setCurrentSelectedItemIndex(i)}destroy(){this._typeaheadSubscription.unsubscribe(),this._itemChangesSubscription?.unsubscribe(),this._effectRef?.destroy(),this._typeahead?.destroy(),this.tabOut.complete(),this.change.complete()}_setActiveItemByDelta(n){this._wrap?this._setActiveInWrapMode(n):this._setActiveInDefaultMode(n)}_setActiveInWrapMode(n){let e=this._getItemsArray();for(let i=1;i<=e.length;i++){let o=(this._activeItemIndex()+n*i+e.length)%e.length,a=e[o];if(!this._skipPredicateFn(a)){this.setActiveItem(o);return}}}_setActiveInDefaultMode(n){this._setActiveItemByIndex(this._activeItemIndex()+n,n)}_setActiveItemByIndex(n,e){let i=this._getItemsArray();if(i[n]){for(;this._skipPredicateFn(i[n]);)if(n+=e,!i[n])return;this.setActiveItem(n)}}_getItemsArray(){return dn(this._items)?this._items():this._items instanceof Mn?this._items.toArray():this._items}_itemsChanged(n){this._typeahead?.setItems(n);let e=this._activeItem();if(e){let i=n.indexOf(e);i>-1&&i!==this._activeItemIndex()&&(this._activeItemIndex.set(i),this._typeahead?.setCurrentSelectedItemIndex(i))}}};var Aa=class extends Dr{setActiveItem(n){this.activeItem&&this.activeItem.setInactiveStyles(),super.setActiveItem(n),this.activeItem&&this.activeItem.setActiveStyles()}};var Qi=class extends Dr{_origin="program";setFocusOrigin(n){return this._origin=n,this}setActiveItem(n){super.setActiveItem(n),this.activeItem&&this.activeItem.focus(this._origin)}};var Gx=new Map,Qe=class t{_appId=p(Hi);static _infix=`a${Math.floor(Math.random()*1e5).toString()}`;getId(n,e=!1){this._appId!=="ng"&&(n+=this._appId);let i=Gx.get(n);return i===void 0?i=0:i++,Gx.set(n,i),`${n}${e?t._infix+"-":""}${i}`}static \u0275fac=function(e){return new(e||t)};static \u0275prov=ce({token:t,factory:t.\u0275fac})};var qx=" ";function r1(t,n,e){let i=Kd(t,n);e=e.trim(),!i.some(o=>o.trim()===e)&&(i.push(e),t.setAttribute(n,i.join(qx)))}function s1(t,n,e){let i=Kd(t,n);e=e.trim();let o=i.filter(a=>a!==e);o.length?t.setAttribute(n,o.join(qx)):t.removeAttribute(n)}function Kd(t,n){return t.getAttribute(n)?.match(/\S+/g)??[]}var Yx="cdk-describedby-message",Zd="cdk-describedby-host",Gh=0,Wh=(()=>{class t{_platform=p(Pe);_document=p(ae);_messageRegistry=new Map;_messagesContainer=null;_id=`${Gh++}`;constructor(){p(ut).load(Mo),this._id=p(Hi)+"-"+Gh++}describe(e,i,o){if(!this._canBeDescribed(e,i))return;let a=Uh(i,o);typeof i!="string"?(Wx(i,this._id),this._messageRegistry.set(a,{messageElement:i,referenceCount:0})):this._messageRegistry.has(a)||this._createMessageElement(i,o),this._isElementDescribedByMessage(e,a)||this._addMessageReference(e,a)}removeDescription(e,i,o){if(!i||!this._isElementNode(e))return;let a=Uh(i,o);if(this._isElementDescribedByMessage(e,a)&&this._removeMessageReference(e,a),typeof i=="string"){let r=this._messageRegistry.get(a);r&&r.referenceCount===0&&this._deleteMessageElement(a)}this._messagesContainer?.childNodes.length===0&&(this._messagesContainer.remove(),this._messagesContainer=null)}ngOnDestroy(){let e=this._document.querySelectorAll(`[${Zd}="${this._id}"]`);for(let i=0;i<e.length;i++)this._removeCdkDescribedByReferenceIds(e[i]),e[i].removeAttribute(Zd);this._messagesContainer?.remove(),this._messagesContainer=null,this._messageRegistry.clear()}_createMessageElement(e,i){let o=this._document.createElement("div");Wx(o,this._id),o.textContent=e,i&&o.setAttribute("role",i),this._createMessagesContainer(),this._messagesContainer.appendChild(o),this._messageRegistry.set(Uh(e,i),{messageElement:o,referenceCount:0})}_deleteMessageElement(e){this._messageRegistry.get(e)?.messageElement?.remove(),this._messageRegistry.delete(e)}_createMessagesContainer(){if(this._messagesContainer)return;let e="cdk-describedby-message-container",i=this._document.querySelectorAll(`.${e}[platform="server"]`);for(let a=0;a<i.length;a++)i[a].remove();let o=this._document.createElement("div");o.style.visibility="hidden",o.classList.add(e),o.classList.add("cdk-visually-hidden"),this._platform.isBrowser||o.setAttribute("platform","server"),this._document.body.appendChild(o),this._messagesContainer=o}_removeCdkDescribedByReferenceIds(e){let i=Kd(e,"aria-describedby").filter(o=>o.indexOf(Yx)!=0);e.setAttribute("aria-describedby",i.join(" "))}_addMessageReference(e,i){let o=this._messageRegistry.get(i);r1(e,"aria-describedby",o.messageElement.id),e.setAttribute(Zd,this._id),o.referenceCount++}_removeMessageReference(e,i){let o=this._messageRegistry.get(i);o.referenceCount--,s1(e,"aria-describedby",o.messageElement.id),e.removeAttribute(Zd)}_isElementDescribedByMessage(e,i){let o=Kd(e,"aria-describedby"),a=this._messageRegistry.get(i),r=a&&a.messageElement.id;return!!r&&o.indexOf(r)!=-1}_canBeDescribed(e,i){if(!this._isElementNode(e))return!1;if(i&&typeof i=="object")return!0;let o=i==null?"":`${i}`.trim(),a=e.getAttribute("aria-label");return o?!a||a.trim()!==o:!1}_isElementNode(e){return e.nodeType===this._document.ELEMENT_NODE}static \u0275fac=function(i){return new(i||t)};static \u0275prov=ce({token:t,factory:t.\u0275fac})}return t})();function Uh(t,n){return typeof t=="string"?`${n||""}/${t}`:t}function Wx(t,n){t.id||(t.id=`${Yx}-${n}-${Gh++}`)}var oi=(function(t){return t[t.NORMAL=0]="NORMAL",t[t.NEGATED=1]="NEGATED",t[t.INVERTED=2]="INVERTED",t})(oi||{}),Xd,Oa;function Qd(){if(Oa==null){if(typeof document!="object"||!document||typeof Element!="function"||!Element)return Oa=!1,Oa;if(document.documentElement?.style&&"scrollBehavior"in document.documentElement.style)Oa=!0;else{let t=Element.prototype.scrollTo;t?Oa=!/\{\s*\[native code\]\s*\}/.test(t.toString()):Oa=!1}}return Oa}function Mr(){if(typeof document!="object"||!document)return oi.NORMAL;if(Xd==null){let t=document.createElement("div"),n=t.style;t.dir="rtl",n.width="1px",n.overflow="auto",n.visibility="hidden",n.pointerEvents="none",n.position="absolute";let e=document.createElement("div"),i=e.style;i.width="2px",i.height="1px",t.appendChild(e),document.body.appendChild(t),Xd=oi.NORMAL,t.scrollLeft===0&&(t.scrollLeft=1,Xd=t.scrollLeft===0?oi.NEGATED:oi.INVERTED),t.remove()}return Xd}function qh(){return typeof __karma__<"u"&&!!__karma__||typeof jasmine<"u"&&!!jasmine||typeof jest<"u"&&!!jest||typeof Mocha<"u"&&!!Mocha}var Ir,Zx=["color","button","checkbox","date","datetime-local","email","file","hidden","image","month","number","password","radio","range","reset","search","submit","tel","text","time","url","week"];function Yh(){if(Ir)return Ir;if(typeof document!="object"||!document)return Ir=new Set(Zx),Ir;let t=document.createElement("input");return Ir=new Set(Zx.filter(n=>(t.setAttribute("type",n),t.type===n))),Ir}var Kx={XSmall:"(max-width: 599.98px)",Small:"(min-width: 600px) and (max-width: 959.98px)",Medium:"(min-width: 960px) and (max-width: 1279.98px)",Large:"(min-width: 1280px) and (max-width: 1919.98px)",XLarge:"(min-width: 1920px)",Handset:"(max-width: 599.98px) and (orientation: portrait), (max-width: 959.98px) and (orientation: landscape)",Tablet:"(min-width: 600px) and (max-width: 839.98px) and (orientation: portrait), (min-width: 960px) and (max-width: 1279.98px) and (orientation: landscape)",Web:"(min-width: 840px) and (orientation: portrait), (min-width: 1280px) and (orientation: landscape)",HandsetPortrait:"(max-width: 599.98px) and (orientation: portrait)",TabletPortrait:"(min-width: 600px) and (max-width: 839.98px) and (orientation: portrait)",WebPortrait:"(min-width: 840px) and (orientation: portrait)",HandsetLandscape:"(max-width: 959.98px) and (orientation: landscape)",TabletLandscape:"(min-width: 960px) and (max-width: 1279.98px) and (orientation: landscape)",WebLandscape:"(min-width: 1280px) and (orientation: landscape)"};var c1=new D("MATERIAL_ANIMATIONS"),Xx=null;function Zh(){return p(c1,{optional:!0})?.animationsDisabled||p(Ms,{optional:!0})==="NoopAnimations"?"di-disabled":(Xx??=p(wr).matchMedia("(prefers-reduced-motion)").matches,Xx?"reduced-motion":"enabled")}function qe(){return Zh()!=="enabled"}function Rt(t){return t==null?"":typeof t=="string"?t:`${t}px`}function Ji(t){return t!=null&&`${t}`!="false"}var jn=(function(t){return t[t.FADING_IN=0]="FADING_IN",t[t.VISIBLE=1]="VISIBLE",t[t.FADING_OUT=2]="FADING_OUT",t[t.HIDDEN=3]="HIDDEN",t})(jn||{}),Kh=class{_renderer;element;config;_animationForciblyDisabledThroughCss;state=jn.HIDDEN;constructor(n,e,i,o=!1){this._renderer=n,this.element=e,this.config=i,this._animationForciblyDisabledThroughCss=o}fadeOut(){this._renderer.fadeOutRipple(this)}},Qx=Sr({passive:!0,capture:!0}),Xh=class{_events=new Map;addHandler(n,e,i,o){let a=this._events.get(e);if(a){let r=a.get(i);r?r.add(o):a.set(i,new Set([o]))}else this._events.set(e,new Map([[i,new Set([o])]])),n.runOutsideAngular(()=>{document.addEventListener(e,this._delegateEventHandler,Qx)})}removeHandler(n,e,i){let o=this._events.get(n);if(!o)return;let a=o.get(e);a&&(a.delete(i),a.size===0&&o.delete(e),o.size===0&&(this._events.delete(n),document.removeEventListener(n,this._delegateEventHandler,Qx)))}_delegateEventHandler=n=>{let e=Gt(n);e&&this._events.get(n.type)?.forEach((i,o)=>{(o===e||o.contains(e))&&i.forEach(a=>a.handleEvent(n))})}},oc={enterDuration:225,exitDuration:150},l1=800,Jx=Sr({passive:!0,capture:!0}),eC=["mousedown","touchstart"],tC=["mouseup","mouseleave","touchend","touchcancel"],d1=(()=>{class t{static \u0275fac=function(i){return new(i||t)};static \u0275cmp=H({type:t,selectors:[["ng-component"]],hostAttrs:["mat-ripple-style-loader",""],decls:0,vars:0,template:function(i,o){},styles:[`.mat-ripple {
  overflow: hidden;
  position: relative;
}
.mat-ripple:not(:empty) {
  transform: translateZ(0);
}

.mat-ripple.mat-ripple-unbounded {
  overflow: visible;
}

.mat-ripple-element {
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
  transition: opacity, transform 0ms cubic-bezier(0, 0, 0.2, 1);
  transform: scale3d(0, 0, 0);
  background-color: var(--%NS%mat-ripple-color, color-mix(in srgb, var(--%NS%mat-sys-on-surface) 10%, transparent));
}
@media (forced-colors: active) {
  .mat-ripple-element {
    display: none;
  }
}
.cdk-drag-preview .mat-ripple-element, .cdk-drag-placeholder .mat-ripple-element {
  display: none;
}
`],encapsulation:2})}return t})(),ac=class t{_target;_ngZone;_platform;_containerElement;_triggerElement=null;_isPointerDown=!1;_activeRipples=new Map;_mostRecentTransientRipple=null;_lastTouchStartEvent;_pointerUpEventsRegistered=!1;_containerRect=null;static _eventManager=new Xh;constructor(n,e,i,o,a){this._target=n,this._ngZone=e,this._platform=o,o.isBrowser&&(this._containerElement=gn(i)),a&&a.get(ut).load(d1)}fadeInRipple(n,e,i={}){let o=this._containerRect=this._containerRect||this._containerElement.getBoundingClientRect(),a=I(I({},oc),i.animation);i.centered&&(n=o.left+o.width/2,e=o.top+o.height/2);let r=i.radius||u1(n,e,o),s=n-o.left,c=e-o.top,d=a.enterDuration,l=document.createElement("div");l.classList.add("mat-ripple-element"),l.style.left=`${s-r}px`,l.style.top=`${c-r}px`,l.style.height=`${r*2}px`,l.style.width=`${r*2}px`,i.color!=null&&(l.style.backgroundColor=i.color),l.style.transitionDuration=`${d}ms`,this._containerElement.appendChild(l);let m=window.getComputedStyle(l),v=m.transitionProperty,g=m.transitionDuration,y=v==="none"||g==="0s"||g==="0s, 0s"||o.width===0&&o.height===0,_=new Kh(this,l,i,y);l.style.transform="scale3d(1, 1, 1)",_.state=jn.FADING_IN,i.persistent||(this._mostRecentTransientRipple=_);let C=null;return!y&&(d||a.exitDuration)&&this._ngZone.runOutsideAngular(()=>{let w=()=>{C&&(C.fallbackTimer=null),clearTimeout(U),this._finishRippleTransition(_)},E=()=>this._destroyRipple(_),U=setTimeout(E,d+100);l.addEventListener("transitionend",w),l.addEventListener("transitioncancel",E),C={onTransitionEnd:w,onTransitionCancel:E,fallbackTimer:U}}),this._activeRipples.set(_,C),(y||!d)&&this._finishRippleTransition(_),_}fadeOutRipple(n){if(n.state===jn.FADING_OUT||n.state===jn.HIDDEN)return;let e=n.element,i=I(I({},oc),n.config.animation);e.style.transitionDuration=`${i.exitDuration}ms`,e.style.opacity="0",n.state=jn.FADING_OUT,(n._animationForciblyDisabledThroughCss||!i.exitDuration)&&this._finishRippleTransition(n)}fadeOutAll(){this._getActiveRipples().forEach(n=>n.fadeOut())}fadeOutAllNonPersistent(){this._getActiveRipples().forEach(n=>{n.config.persistent||n.fadeOut()})}setupTriggerEvents(n){let e=gn(n);!this._platform.isBrowser||!e||e===this._triggerElement||(this._removeTriggerEvents(),this._triggerElement=e,eC.forEach(i=>{t._eventManager.addHandler(this._ngZone,i,e,this)}))}handleEvent(n){n.type==="mousedown"?this._onMousedown(n):n.type==="touchstart"?this._onTouchStart(n):this._onPointerUp(),this._pointerUpEventsRegistered||(this._ngZone.runOutsideAngular(()=>{tC.forEach(e=>{this._triggerElement.addEventListener(e,this,Jx)})}),this._pointerUpEventsRegistered=!0)}_finishRippleTransition(n){n.state===jn.FADING_IN?this._startFadeOutTransition(n):n.state===jn.FADING_OUT&&this._destroyRipple(n)}_startFadeOutTransition(n){let e=n===this._mostRecentTransientRipple,{persistent:i}=n.config;n.state=jn.VISIBLE,!i&&(!e||!this._isPointerDown)&&n.fadeOut()}_destroyRipple(n){let e=this._activeRipples.get(n)??null;this._activeRipples.delete(n),this._activeRipples.size||(this._containerRect=null),n===this._mostRecentTransientRipple&&(this._mostRecentTransientRipple=null),n.state=jn.HIDDEN,e!==null&&(n.element.removeEventListener("transitionend",e.onTransitionEnd),n.element.removeEventListener("transitioncancel",e.onTransitionCancel),e.fallbackTimer!==null&&clearTimeout(e.fallbackTimer)),n.element.remove()}_onMousedown(n){let e=Ea(n),i=this._lastTouchStartEvent&&Date.now()<this._lastTouchStartEvent+l1;!this._target.rippleDisabled&&!e&&!i&&(this._isPointerDown=!0,this.fadeInRipple(n.clientX,n.clientY,this._target.rippleConfig))}_onTouchStart(n){if(!this._target.rippleDisabled&&!Da(n)){this._lastTouchStartEvent=Date.now(),this._isPointerDown=!0;let e=n.changedTouches;if(e)for(let i=0;i<e.length;i++)this.fadeInRipple(e[i].clientX,e[i].clientY,this._target.rippleConfig)}}_onPointerUp(){this._isPointerDown&&(this._isPointerDown=!1,this._getActiveRipples().forEach(n=>{let e=n.state===jn.VISIBLE||n.config.terminateOnPointerUp&&n.state===jn.FADING_IN;!n.config.persistent&&e&&n.fadeOut()}))}_getActiveRipples(){return Array.from(this._activeRipples.keys())}_removeTriggerEvents(){let n=this._triggerElement;n&&(eC.forEach(e=>t._eventManager.removeHandler(e,n,this)),this._pointerUpEventsRegistered&&(tC.forEach(e=>n.removeEventListener(e,this,Jx)),this._pointerUpEventsRegistered=!1))}};function u1(t,n,e){let i=Math.max(Math.abs(t-e.left),Math.abs(t-e.right)),o=Math.max(Math.abs(n-e.top),Math.abs(n-e.bottom));return Math.sqrt(i*i+o*o)}var kr=new D("mat-ripple-global-options"),ai=(()=>{class t{_elementRef=p(q);_animationsDisabled=qe();color;unbounded=!1;centered=!1;radius=0;animation;get disabled(){return this._disabled}set disabled(e){e&&this.fadeOutAllNonPersistent(),this._disabled=e,this._setupTriggerEventsIfEnabled()}_disabled=!1;get trigger(){return this._trigger||this._elementRef.nativeElement}set trigger(e){this._trigger=e,this._setupTriggerEventsIfEnabled()}_trigger;_rippleRenderer;_globalOptions;_isInitialized=!1;constructor(){let e=p(X),i=p(Pe),o=p(kr,{optional:!0}),a=p(ie);this._globalOptions=o||{},this._rippleRenderer=new ac(this,e,this._elementRef,i,a)}ngOnInit(){this._isInitialized=!0,this._setupTriggerEventsIfEnabled()}ngOnDestroy(){this._rippleRenderer._removeTriggerEvents()}fadeOutAll(){this._rippleRenderer.fadeOutAll()}fadeOutAllNonPersistent(){this._rippleRenderer.fadeOutAllNonPersistent()}get rippleConfig(){return{centered:this.centered,radius:this.radius,color:this.color,animation:I(I(I({},this._globalOptions.animation),this._animationsDisabled?{enterDuration:0,exitDuration:0}:{}),this.animation),terminateOnPointerUp:this._globalOptions.terminateOnPointerUp}}get rippleDisabled(){return this.disabled||!!this._globalOptions.disabled}_setupTriggerEventsIfEnabled(){!this.disabled&&this._isInitialized&&this._rippleRenderer.setupTriggerEvents(this.trigger)}launch(e,i=0,o){return typeof e=="number"?this._rippleRenderer.fadeInRipple(e,i,I(I({},this.rippleConfig),o)):this._rippleRenderer.fadeInRipple(0,0,I(I({},this.rippleConfig),e))}static \u0275fac=function(i){return new(i||t)};static \u0275dir=ee({type:t,selectors:[["","mat-ripple",""],["","matRipple",""]],hostAttrs:[1,"mat-ripple"],hostVars:2,hostBindings:function(i,o){i&2&&z("mat-ripple-unbounded",o.unbounded)},inputs:{color:[0,"matRippleColor","color"],unbounded:[0,"matRippleUnbounded","unbounded"],centered:[0,"matRippleCentered","centered"],radius:[0,"matRippleRadius","radius"],animation:[0,"matRippleAnimation","animation"],disabled:[0,"matRippleDisabled","disabled"],trigger:[0,"matRippleTrigger","trigger"]},exportAs:["matRipple"]})}return t})();var Jd=(()=>{class t{_animationsDisabled=qe();state="unchecked";disabled=!1;appearance="full";static \u0275fac=function(i){return new(i||t)};static \u0275cmp=H({type:t,selectors:[["mat-pseudo-checkbox"]],hostAttrs:[1,"mat-pseudo-checkbox"],hostVars:12,hostBindings:function(i,o){i&2&&z("mat-pseudo-checkbox-indeterminate",o.state==="indeterminate")("mat-pseudo-checkbox-checked",o.state==="checked")("mat-pseudo-checkbox-disabled",o.disabled)("mat-pseudo-checkbox-minimal",o.appearance==="minimal")("mat-pseudo-checkbox-full",o.appearance==="full")("_mat-animation-noopable",o._animationsDisabled)},inputs:{state:"state",disabled:"disabled",appearance:"appearance"},decls:0,vars:0,template:function(i,o){},styles:[`.mat-pseudo-checkbox {
  border-radius: 2px;
  cursor: pointer;
  display: inline-block;
  vertical-align: middle;
  box-sizing: border-box;
  position: relative;
  flex-shrink: 0;
  transition: border-color 90ms cubic-bezier(0, 0, 0.2, 0.1), background-color 90ms cubic-bezier(0, 0, 0.2, 0.1);
}
.mat-pseudo-checkbox::after {
  position: absolute;
  opacity: 0;
  content: "";
  border-bottom: 2px solid currentColor;
  transition: opacity 90ms cubic-bezier(0, 0, 0.2, 0.1);
}
.mat-pseudo-checkbox._mat-animation-noopable {
  transition: none !important;
  animation: none !important;
}
.mat-pseudo-checkbox._mat-animation-noopable::after {
  transition: none;
}

.mat-pseudo-checkbox-disabled {
  cursor: default;
}

.mat-pseudo-checkbox-indeterminate::after {
  left: 1px;
  opacity: 1;
  border-radius: 2px;
}

.mat-pseudo-checkbox-checked::after {
  left: 1px;
  border-left: 2px solid currentColor;
  transform: rotate(-45deg);
  opacity: 1;
  box-sizing: content-box;
}

.mat-pseudo-checkbox-minimal.mat-pseudo-checkbox-checked::after, .mat-pseudo-checkbox-minimal.mat-pseudo-checkbox-indeterminate::after {
  color: var(--%NS%mat-pseudo-checkbox-minimal-selected-checkmark-color, var(--%NS%mat-sys-primary));
}
.mat-pseudo-checkbox-minimal.mat-pseudo-checkbox-checked.mat-pseudo-checkbox-disabled::after, .mat-pseudo-checkbox-minimal.mat-pseudo-checkbox-indeterminate.mat-pseudo-checkbox-disabled::after {
  color: var(--%NS%mat-pseudo-checkbox-minimal-disabled-selected-checkmark-color, color-mix(in srgb, var(--%NS%mat-sys-on-surface) 38%, transparent));
}

.mat-pseudo-checkbox-full {
  border-color: var(--%NS%mat-pseudo-checkbox-full-unselected-icon-color, var(--%NS%mat-sys-on-surface-variant));
  border-width: 2px;
  border-style: solid;
}
.mat-pseudo-checkbox-full.mat-pseudo-checkbox-disabled {
  border-color: var(--%NS%mat-pseudo-checkbox-full-disabled-unselected-icon-color, color-mix(in srgb, var(--%NS%mat-sys-on-surface) 38%, transparent));
}
.mat-pseudo-checkbox-full.mat-pseudo-checkbox-checked, .mat-pseudo-checkbox-full.mat-pseudo-checkbox-indeterminate {
  background-color: var(--%NS%mat-pseudo-checkbox-full-selected-icon-color, var(--%NS%mat-sys-primary));
  border-color: transparent;
}
.mat-pseudo-checkbox-full.mat-pseudo-checkbox-checked::after, .mat-pseudo-checkbox-full.mat-pseudo-checkbox-indeterminate::after {
  color: var(--%NS%mat-pseudo-checkbox-full-selected-checkmark-color, var(--%NS%mat-sys-on-primary));
}
.mat-pseudo-checkbox-full.mat-pseudo-checkbox-checked.mat-pseudo-checkbox-disabled, .mat-pseudo-checkbox-full.mat-pseudo-checkbox-indeterminate.mat-pseudo-checkbox-disabled {
  background-color: var(--%NS%mat-pseudo-checkbox-full-disabled-selected-icon-color, color-mix(in srgb, var(--%NS%mat-sys-on-surface) 38%, transparent));
}
.mat-pseudo-checkbox-full.mat-pseudo-checkbox-checked.mat-pseudo-checkbox-disabled::after, .mat-pseudo-checkbox-full.mat-pseudo-checkbox-indeterminate.mat-pseudo-checkbox-disabled::after {
  color: var(--%NS%mat-pseudo-checkbox-full-disabled-selected-checkmark-color, var(--%NS%mat-sys-surface));
}

.mat-pseudo-checkbox {
  width: 18px;
  height: 18px;
}

.mat-pseudo-checkbox-minimal.mat-pseudo-checkbox-checked::after {
  width: 14px;
  height: 6px;
  transform-origin: center;
  top: -4.2426406871px;
  left: 0;
  bottom: 0;
  right: 0;
  margin: auto;
}
.mat-pseudo-checkbox-minimal.mat-pseudo-checkbox-indeterminate::after {
  top: 8px;
  width: 16px;
}

.mat-pseudo-checkbox-full.mat-pseudo-checkbox-checked::after {
  width: 10px;
  height: 4px;
  transform-origin: center;
  top: -2.8284271247px;
  left: 0;
  bottom: 0;
  right: 0;
  margin: auto;
}
.mat-pseudo-checkbox-full.mat-pseudo-checkbox-indeterminate::after {
  top: 6px;
  width: 12px;
}
`],encapsulation:2})}return t})();var bn=(()=>{class t{static \u0275fac=function(i){return new(i||t)};static \u0275cmp=H({type:t,selectors:[["structural-styles"]],decls:0,vars:0,template:function(i,o){},styles:[`.mat-focus-indicator {
  position: relative;
}
.mat-focus-indicator::before {
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  position: absolute;
  box-sizing: border-box;
  pointer-events: none;
  display: var(--%NS%mat-focus-indicator-display, none);
  border-width: var(--%NS%mat-focus-indicator-border-width, 3px);
  border-style: var(--%NS%mat-focus-indicator-border-style, solid);
  border-color: var(--%NS%mat-focus-indicator-border-color, transparent);
  border-radius: var(--%NS%mat-focus-indicator-border-radius, 4px);
}
.mat-focus-indicator:focus-visible::before {
  content: "";
}

@media (forced-colors: active) {
  html {
    --%NS%mat-focus-indicator-display: block;
    --%NS%mat-focus-indicator-fallback-border-style: none;
  }
}
`],encapsulation:2})}return t})();var sc=new D("MAT_OPTION_PARENT_COMPONENT"),cc=new D("MatOptgroup");var rc=class{source;isUserInput;constructor(n,e=!1){this.source=n,this.isUserInput=e}},ko=(()=>{class t{_element=p(q);_changeDetectorRef=p(He);_parent=p(sc,{optional:!0});group=p(cc,{optional:!0});_signalDisableRipple=!1;_selected=!1;_active=!1;_mostRecentViewValue="";get multiple(){return this._parent&&this._parent.multiple}get selected(){return this._selected}value;id=p(Qe).getId("mat-option-");get disabled(){return this.group&&this.group.disabled||this._disabled()}set disabled(e){this._disabled.set(e)}_disabled=G(!1);get disableRipple(){return this._signalDisableRipple?this._parent.disableRipple():!!this._parent?.disableRipple}get hideSingleSelectionIndicator(){return!!(this._parent&&this._parent.hideSingleSelectionIndicator)}onSelectionChange=new K;_text;_stateChanges=new B;constructor(){let e=p(ut);e.load(bn),e.load(Mo),this._signalDisableRipple=!!this._parent&&dn(this._parent.disableRipple)}get active(){return this._active}get viewValue(){return(this._text?.nativeElement.textContent||"").trim()}select(e=!0){this._selected||(this._selected=!0,this._changeDetectorRef.markForCheck(),e&&this._emitSelectionChangeEvent())}deselect(e=!0){this._selected&&(this._selected=!1,this._changeDetectorRef.markForCheck(),e&&this._emitSelectionChangeEvent())}focus(e,i){let o=this._getHostElement();typeof o.focus=="function"&&o.focus(i)}setActiveStyles(){this._active||(this._active=!0,this._changeDetectorRef.markForCheck())}setInactiveStyles(){this._active&&(this._active=!1,this._changeDetectorRef.markForCheck())}getLabel(){return this.viewValue}_handleKeydown(e){(e.keyCode===13||e.keyCode===32)&&!pt(e)&&(this._selectViaInteraction(),e.preventDefault())}_selectViaInteraction(){this.disabled||(this._selected=this.multiple?!this._selected:!0,this._changeDetectorRef.markForCheck(),this._emitSelectionChangeEvent(!0))}_getTabIndex(){return this.disabled?"-1":"0"}_getHostElement(){return this._element.nativeElement}ngAfterViewChecked(){if(this._selected){let e=this.viewValue;e!==this._mostRecentViewValue&&(this._mostRecentViewValue&&this._stateChanges.next(),this._mostRecentViewValue=e)}}ngOnDestroy(){this._stateChanges.complete()}_emitSelectionChangeEvent(e=!1){this.onSelectionChange.emit(new rc(this,e))}static \u0275fac=function(i){return new(i||t)};static \u0275cmp=(function(){let e=["text"],i=[[["mat-icon"]],"*"],o=["mat-icon","*"];function a(c,d){if(c&1&&A(0,"mat-pseudo-checkbox",1),c&2){let l=x();R("disabled",l.disabled)("state",l.selected?"checked":"unchecked")}}function r(c,d){if(c&1&&A(0,"mat-pseudo-checkbox",3),c&2){let l=x();R("disabled",l.disabled)}}function s(c,d){if(c&1&&(f(0,"span",4),b(1),u()),c&2){let l=x();h(),re("(",l.group.label,")")}}return H({type:t,selectors:[["mat-option"]],viewQuery:function(d,l){if(d&1&&ot(e,7),d&2){let m;Y(m=Z())&&(l._text=m.first)}},hostAttrs:["role","option",1,"mat-mdc-option","mdc-list-item"],hostVars:11,hostBindings:function(d,l){d&1&&V("click",function(){return l._selectViaInteraction()})("keydown",function(v){return l._handleKeydown(v)}),d&2&&(Vt("id",l.id),Q("aria-selected",l.selected)("aria-disabled",l.disabled.toString()),z("mdc-list-item--selected",l.selected)("mat-mdc-option-multiple",l.multiple)("mat-mdc-option-active",l.active)("mdc-list-item--disabled",l.disabled))},inputs:{value:"value",id:"id",disabled:[2,"disabled","disabled",O]},outputs:{onSelectionChange:"onSelectionChange"},exportAs:["matOption"],ngContentSelectors:o,decls:8,vars:5,consts:[["text",""],["aria-hidden","true",1,"mat-mdc-option-pseudo-checkbox",3,"disabled","state"],[1,"mdc-list-item__primary-text"],["state","checked","aria-hidden","true","appearance","minimal",1,"mat-mdc-option-pseudo-checkbox",3,"disabled"],[1,"cdk-visually-hidden"],["aria-hidden","true","mat-ripple","",1,"mat-mdc-option-ripple","mat-focus-indicator",3,"matRippleTrigger","matRippleDisabled"]],template:function(d,l){d&1&&(Be(i),k(0,a,1,2,"mat-pseudo-checkbox",1),oe(1),f(2,"span",2,0),oe(4,1),u(),k(5,r,1,1,"mat-pseudo-checkbox",3),k(6,s,2,1,"span",4),A(7,"div",5)),d&2&&(N(l.multiple?0:-1),h(5),N(!l.multiple&&l.selected&&!l.hideSingleSelectionIndicator?5:-1),h(),N(l.group&&l.group._inert?6:-1),h(),R("matRippleTrigger",l._getHostElement())("matRippleDisabled",l.disabled||l.disableRipple))},dependencies:[Jd,ai],styles:[`.mat-mdc-option {
  -webkit-user-select: none;
  user-select: none;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  display: flex;
  position: relative;
  align-items: center;
  justify-content: flex-start;
  overflow: hidden;
  min-height: 48px;
  padding: 0 16px;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  color: var(--%NS%mat-option-label-text-color, var(--%NS%mat-sys-on-surface));
  font-family: var(--%NS%mat-option-label-text-font, var(--%NS%mat-sys-label-large-font));
  line-height: var(--%NS%mat-option-label-text-line-height, var(--%NS%mat-sys-label-large-line-height));
  font-size: var(--%NS%mat-option-label-text-size, var(--%NS%mat-sys-body-large-size));
  letter-spacing: var(--%NS%mat-option-label-text-tracking, var(--%NS%mat-sys-label-large-tracking));
  font-weight: var(--%NS%mat-option-label-text-weight, var(--%NS%mat-sys-body-large-weight));
}
.mat-mdc-option:hover:not(.mdc-list-item--disabled) {
  background-color: var(--%NS%mat-option-hover-state-layer-color, color-mix(in srgb, var(--%NS%mat-sys-on-surface) calc(var(--%NS%mat-sys-hover-state-layer-opacity) * 100%), transparent));
}
.mat-mdc-option:focus.mdc-list-item, .mat-mdc-option.mat-mdc-option-active.mdc-list-item {
  background-color: var(--%NS%mat-option-focus-state-layer-color, color-mix(in srgb, var(--%NS%mat-sys-on-surface) calc(var(--%NS%mat-sys-focus-state-layer-opacity) * 100%), transparent));
  outline: 0;
}
.mat-mdc-option.mdc-list-item--%NS%selected:not(.mdc-list-item--disabled):not(.mat-mdc-option-active, .mat-mdc-option-multiple, :focus, :hover) {
  background-color: var(--%NS%mat-option-selected-state-layer-color, var(--%NS%mat-sys-secondary-container));
}
.mat-mdc-option.mdc-list-item--%NS%selected:not(.mdc-list-item--disabled):not(.mat-mdc-option-active, .mat-mdc-option-multiple, :focus, :hover) .mdc-list-item__primary-text {
  color: var(--%NS%mat-option-selected-state-label-text-color, var(--%NS%mat-sys-on-secondary-container));
}
.mat-mdc-option .mat-pseudo-checkbox {
  --%NS%mat-pseudo-checkbox-minimal-selected-checkmark-color: var(--%NS%mat-option-selected-state-label-text-color, var(--%NS%mat-sys-on-secondary-container));
}
.mat-mdc-option.mdc-list-item {
  align-items: center;
  background: transparent;
}
.mat-mdc-option.mdc-list-item--disabled {
  cursor: default;
  pointer-events: none;
}
.mat-mdc-option.mdc-list-item--disabled .mat-mdc-option-pseudo-checkbox, .mat-mdc-option.mdc-list-item--disabled .mdc-list-item__primary-text, .mat-mdc-option.mdc-list-item--disabled > mat-icon {
  opacity: 0.38;
}
.mat-mdc-optgroup .mat-mdc-option:not(.mat-mdc-option-multiple) {
  padding-left: 32px;
}
[dir=rtl] .mat-mdc-optgroup .mat-mdc-option:not(.mat-mdc-option-multiple) {
  padding-left: 16px;
  padding-right: 32px;
}
.mat-mdc-option .mat-icon,
.mat-mdc-option .mat-pseudo-checkbox-full {
  margin-right: 16px;
  flex-shrink: 0;
}
[dir=rtl] .mat-mdc-option .mat-icon,
[dir=rtl] .mat-mdc-option .mat-pseudo-checkbox-full {
  margin-right: 0;
  margin-left: 16px;
}
.mat-mdc-option .mat-pseudo-checkbox-minimal {
  margin-left: 16px;
  flex-shrink: 0;
}
[dir=rtl] .mat-mdc-option .mat-pseudo-checkbox-minimal {
  margin-right: 16px;
  margin-left: 0;
}
.mat-mdc-option .mat-mdc-option-ripple {
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  position: absolute;
  pointer-events: none;
}
.mat-mdc-option .mdc-list-item__primary-text {
  white-space: normal;
  font-size: inherit;
  font-weight: inherit;
  letter-spacing: inherit;
  line-height: inherit;
  font-family: inherit;
  text-decoration: inherit;
  text-transform: inherit;
  margin-right: auto;
}
[dir=rtl] .mat-mdc-option .mdc-list-item__primary-text {
  margin-right: 0;
  margin-left: auto;
}
@media (forced-colors: active) {
  .mat-mdc-option.mdc-list-item--%NS%selected:not(:has(.mat-mdc-option-pseudo-checkbox))::after {
    content: "";
    position: absolute;
    top: 50%;
    right: 16px;
    transform: translateY(-50%);
    width: 10px;
    height: 0;
    border-bottom: solid 10px;
    border-radius: 10px;
  }
  [dir=rtl] .mat-mdc-option.mdc-list-item--%NS%selected:not(:has(.mat-mdc-option-pseudo-checkbox))::after {
    right: auto;
    left: 16px;
  }
}

.mat-mdc-option-multiple {
  --%NS%mat-list-list-item-selected-container-color: var(--%NS%mat-list-list-item-container-color, transparent);
}

.mat-mdc-option-active .mat-focus-indicator::before {
  content: "";
}
`],encapsulation:2})})()}return t})();function eu(t,n,e){if(e.length){let i=n.toArray(),o=e.toArray(),a=0;for(let r=0;r<t+1;r++)i[r].group&&i[r].group===o[a]&&a++;return a}return 0}function tu(t,n,e,i){return t<e?t:t+n>e+i?Math.max(0,t-i+n):e}var m1=new D("cdk-dir-doc",{providedIn:"root",factory:()=>p(ae)}),p1=/^(ar|ckb|dv|he|iw|fa|nqo|ps|sd|ug|ur|yi|.*[-_](Adlm|Arab|Hebr|Nkoo|Rohg|Thaa))(?!.*[-_](Latn|Cyrl)($|-|_))($|-|_)/i;function nC(t){let n=t?.toLowerCase()||"";return n==="auto"&&typeof navigator<"u"&&navigator?.language?p1.test(navigator.language)?"rtl":"ltr":n==="rtl"?"rtl":"ltr"}var ft=(()=>{class t{get value(){return this.valueSignal()}valueSignal=G("ltr");change=new K;constructor(){let e=p(m1,{optional:!0});if(e){let i=e.body?e.body.dir:null,o=e.documentElement?e.documentElement.dir:null;this.valueSignal.set(nC(i||o||"ltr"))}}ngOnDestroy(){this.change.complete()}static \u0275fac=function(i){return new(i||t)};static \u0275prov=ce({token:t,factory:t.\u0275fac})}return t})();var Ne=(()=>{class t{static \u0275fac=function(i){return new(i||t)};static \u0275mod=le({type:t});static \u0275inj=se({})}return t})();var f1=20,No=(()=>{class t{_ngZone=p(X);_platform=p(Pe);_renderer=p(Lt).createRenderer(null,null);_cleanupGlobalListener;_scrolled=new B;_scrolledCount=0;scrollContainers=new Map;register(e){this.scrollContainers.has(e)||this.scrollContainers.set(e,e.elementScrolled().subscribe(()=>this._scrolled.next(e)))}deregister(e){let i=this.scrollContainers.get(e);i&&(i.unsubscribe(),this.scrollContainers.delete(e))}scrolled(e=f1){return this._platform.isBrowser?new ge(i=>{this._cleanupGlobalListener||(this._cleanupGlobalListener=this._ngZone.runOutsideAngular(()=>this._renderer.listen("document","scroll",()=>this._scrolled.next())));let o=e>0?this._scrolled.pipe(hl(e)).subscribe(i):this._scrolled.subscribe(i);return this._scrolledCount++,()=>{o.unsubscribe(),this._scrolledCount--,this._scrolledCount||(this._cleanupGlobalListener?.(),this._cleanupGlobalListener=void 0)}}):Nt()}ngOnDestroy(){this._cleanupGlobalListener?.(),this._cleanupGlobalListener=void 0,this.scrollContainers.forEach((e,i)=>this.deregister(i)),this._scrolled.complete()}ancestorScrolled(e,i){let o=this.getAncestorScrollContainers(e);return this.scrolled(i).pipe(Ze(a=>!a||o.indexOf(a)>-1))}getAncestorScrollContainers(e){let i=[];return this.scrollContainers.forEach((o,a)=>{this._targetContainsElement(a,e)&&i.push(a)}),i}_targetContainsElement(e,i){let o=gn(i),a=e.getElementRef().nativeElement;do if(o==a)return!0;while(o=o.parentElement);return!1}static \u0275fac=function(i){return new(i||t)};static \u0275prov=ce({token:t,factory:t.\u0275fac})}return t})(),Qh=(()=>{class t{elementRef=p(q);scrollDispatcher=p(No);ngZone=p(X);dir=p(ft,{optional:!0});_scrollElement=this.elementRef.nativeElement;_destroyed=new B;_renderer=p(Ue);_cleanupScroll;_elementScrolled=new B;ngOnInit(){this._cleanupScroll=this.ngZone.runOutsideAngular(()=>this._renderer.listen(this._scrollElement,"scroll",e=>this._elementScrolled.next(e))),this.scrollDispatcher.register(this)}ngOnDestroy(){this._cleanupScroll?.(),this._elementScrolled.complete(),this.scrollDispatcher.deregister(this),this._destroyed.next(),this._destroyed.complete()}elementScrolled(){return this._elementScrolled}getElementRef(){return this.elementRef}scrollTo(e){let i=this.elementRef.nativeElement,o=this.dir&&this.dir.value=="rtl";e.left==null&&(e.left=o?e.end:e.start),e.right==null&&(e.right=o?e.start:e.end),e.bottom!=null&&(e.top=i.scrollHeight-i.clientHeight-e.bottom),o&&Mr()!=oi.NORMAL?(e.left!=null&&(e.right=i.scrollWidth-i.clientWidth-e.left),Mr()==oi.INVERTED?e.left=e.right:Mr()==oi.NEGATED&&(e.left=e.right?-e.right:e.right)):e.right!=null&&(e.left=i.scrollWidth-i.clientWidth-e.right),this._applyScrollToOptions(e)}_applyScrollToOptions(e){let i=this.elementRef.nativeElement;Qd()?i.scrollTo(e):(e.top!=null&&(i.scrollTop=e.top),e.left!=null&&(i.scrollLeft=e.left))}measureScrollOffset(e){let i="left",o="right",a=this.elementRef.nativeElement;if(e=="top")return a.scrollTop;if(e=="bottom")return a.scrollHeight-a.clientHeight-a.scrollTop;let r=this.dir&&this.dir.value=="rtl";return e=="start"?e=r?o:i:e=="end"&&(e=r?i:o),r&&Mr()==oi.INVERTED?e==i?a.scrollWidth-a.clientWidth-a.scrollLeft:a.scrollLeft:r&&Mr()==oi.NEGATED?e==i?a.scrollLeft+a.scrollWidth-a.clientWidth:-a.scrollLeft:e==i?a.scrollLeft:a.scrollWidth-a.clientWidth-a.scrollLeft}static \u0275fac=function(i){return new(i||t)};static \u0275dir=ee({type:t,selectors:[["","cdk-scrollable",""],["","cdkScrollable",""]]})}return t})(),h1=20,In=(()=>{class t{_platform=p(Pe);_listeners;_viewportSize=null;_change=new B;_document=p(ae);constructor(){let e=p(X),i=p(Lt).createRenderer(null,null);e.runOutsideAngular(()=>{if(this._platform.isBrowser){let o=a=>this._change.next(a);this._listeners=[i.listen("window","resize",o),i.listen("window","orientationchange",o)]}this.change().subscribe(()=>this._viewportSize=null)})}ngOnDestroy(){this._listeners?.forEach(e=>e()),this._change.complete()}getViewportSize(){this._viewportSize||this._updateViewportSize();let e={width:this._viewportSize.width,height:this._viewportSize.height};return this._platform.isBrowser||(this._viewportSize=null),e}getViewportRect(){let e=this.getViewportScrollPosition(),{width:i,height:o}=this.getViewportSize();return{top:e.top,left:e.left,bottom:e.top+o,right:e.left+i,height:o,width:i}}getViewportScrollPosition(){if(!this._platform.isBrowser)return{top:0,left:0};let e=this._document,i=this._getWindow(),o=e.documentElement,a=o.getBoundingClientRect(),r=-a.top||e.body?.scrollTop||i.scrollY||o.scrollTop||0,s=-a.left||e.body?.scrollLeft||i.scrollX||o.scrollLeft||0;return{top:r,left:s}}change(e=h1){return e>0?this._change.pipe(hl(e)):this._change}_getWindow(){return this._document.defaultView||window}_updateViewportSize(){let e=this._getWindow();this._viewportSize=this._platform.isBrowser?{width:e.innerWidth,height:e.innerHeight}:{width:0,height:0}}static \u0275fac=function(i){return new(i||t)};static \u0275prov=ce({token:t,factory:t.\u0275fac})}return t})();var ri=(()=>{class t{static \u0275fac=function(i){return new(i||t)};static \u0275mod=le({type:t});static \u0275inj=se({})}return t})(),Jh=(()=>{class t{static \u0275fac=function(i){return new(i||t)};static \u0275mod=le({type:t});static \u0275inj=se({imports:[Ne,ri,Ne,ri]})}return t})();var lc=class{_attachedHost=null;attach(n){return this._attachedHost=n,n.attach(this)}detach(){let n=this._attachedHost;n!=null&&(this._attachedHost=null,n.detach())}get isAttached(){return this._attachedHost!=null}setAttachedHost(n){this._attachedHost=n}},To=class extends lc{component;viewContainerRef;injector;projectableNodes;bindings;directives;constructor(n,e,i,o,a,r){super(),this.component=n,this.viewContainerRef=e,this.injector=i,this.projectableNodes=o,this.bindings=a||null,this.directives=r||null}},xn=class extends lc{templateRef;viewContainerRef;context;injector;constructor(n,e,i,o){super(),this.templateRef=n,this.viewContainerRef=e,this.context=i,this.injector=o}get origin(){return this.templateRef.elementRef}attach(n,e=this.context){return this.context=e,super.attach(n)}detach(){return this.context=void 0,super.detach()}},eg=class extends lc{element;constructor(n){super(),this.element=n instanceof q?n.nativeElement:n}},Nr=class{_attachedPortal=null;_disposeFn=null;_isDisposed=!1;hasAttached(){return!!this._attachedPortal}attach(n){if(n instanceof To)return this._attachedPortal=n,this.attachComponentPortal(n);if(n instanceof xn)return this._attachedPortal=n,this.attachTemplatePortal(n);if(this.attachDomPortal&&n instanceof eg)return this._attachedPortal=n,this.attachDomPortal(n)}attachDomPortal=null;detach(){this._attachedPortal&&(this._attachedPortal.setAttachedHost(null),this._attachedPortal=null),this._invokeDisposeFn()}dispose(){this.hasAttached()&&this.detach(),this._invokeDisposeFn(),this._isDisposed=!0}setDisposeFn(n){this._disposeFn=n}_invokeDisposeFn(){this._disposeFn&&(this._disposeFn(),this._disposeFn=null)}},dc=class extends Nr{outletElement;_appRef;_defaultInjector;constructor(n,e,i){super(),this.outletElement=n,this._appRef=e,this._defaultInjector=i}attachComponentPortal(n){let e;if(n.viewContainerRef){let i=n.injector||n.viewContainerRef.injector,o=i.get(xo,null,{optional:!0})||void 0;e=n.viewContainerRef.createComponent(n.component,{index:n.viewContainerRef.length,injector:i,ngModuleRef:o,projectableNodes:n.projectableNodes||void 0,bindings:n.bindings||void 0,directives:n.directives||void 0}),this.setDisposeFn(()=>e.destroy())}else{let i=this._appRef,o=n.injector||this._defaultInjector||ie.NULL,a=o.get(xt,i.injector);e=Rd(n.component,{elementInjector:o,environmentInjector:a,projectableNodes:n.projectableNodes||void 0,bindings:n.bindings||void 0,directives:n.directives||void 0}),i.attachView(e.hostView),this.setDisposeFn(()=>{i.viewCount>0&&i.detachView(e.hostView),e.destroy()})}return this.outletElement.appendChild(this._getComponentRootNode(e)),this._attachedPortal=n,e}attachTemplatePortal(n){let e=n.viewContainerRef,i=e.createEmbeddedView(n.templateRef,n.context,{injector:n.injector});return i.rootNodes.forEach(o=>this.outletElement.appendChild(o)),i.detectChanges(),this.setDisposeFn(()=>{let o=e.indexOf(i);o!==-1&&e.remove(o)}),this._attachedPortal=n,i}attachDomPortal=n=>{let e=n.element;e.parentNode;let i=this.outletElement.ownerDocument.createComment("dom-portal");e.parentNode.insertBefore(i,e),this.outletElement.appendChild(e),this._attachedPortal=n,super.setDisposeFn(()=>{i.parentNode&&i.parentNode.replaceChild(e,i)})};dispose(){super.dispose(),this.outletElement.remove()}_getComponentRootNode(n){return n.hostView.rootNodes[0]}},iC=(()=>{class t extends xn{constructor(){let e=p(At),i=p(Bt);super(e,i)}static \u0275fac=function(i){return new(i||t)};static \u0275dir=ee({type:t,selectors:[["","cdkPortal",""]],exportAs:["cdkPortal"],features:[Ge]})}return t})(),Ao=(()=>{class t extends Nr{_moduleRef=p(xo,{optional:!0});_document=p(ae);_viewContainerRef=p(Bt);_isInitialized=!1;_attachedRef=null;get portal(){return this._attachedPortal}set portal(e){this.hasAttached()&&!e&&!this._isInitialized||(this.hasAttached()&&super.detach(),e&&super.attach(e),this._attachedPortal=e||null)}attached=new K;get attachedRef(){return this._attachedRef}ngOnInit(){this._isInitialized=!0}ngOnDestroy(){super.dispose(),this._attachedRef=this._attachedPortal=null}attachComponentPortal(e){e.setAttachedHost(this);let i=e.viewContainerRef!=null?e.viewContainerRef:this._viewContainerRef,o=i.createComponent(e.component,{index:i.length,injector:e.injector||i.injector,projectableNodes:e.projectableNodes||void 0,ngModuleRef:this._moduleRef||void 0,bindings:e.bindings||void 0,directives:e.directives||void 0});return i!==this._viewContainerRef&&this._getRootNode().appendChild(o.hostView.rootNodes[0]),super.setDisposeFn(()=>o.destroy()),this._attachedPortal=e,this._attachedRef=o,this.attached.emit(o),o}attachTemplatePortal(e){e.setAttachedHost(this);let i=this._viewContainerRef.createEmbeddedView(e.templateRef,e.context,{injector:e.injector});return super.setDisposeFn(()=>this._viewContainerRef.clear()),this._attachedPortal=e,this._attachedRef=i,this.attached.emit(i),i}attachDomPortal=e=>{let i=e.element;i.parentNode;let o=this._document.createComment("dom-portal");e.setAttachedHost(this),i.parentNode.insertBefore(o,i),this._getRootNode().appendChild(i),this._attachedPortal=e,super.setDisposeFn(()=>{o.parentNode&&o.parentNode.replaceChild(i,o)})};_getRootNode(){let e=this._viewContainerRef.element.nativeElement;return e.nodeType===e.ELEMENT_NODE?e:e.parentNode}static \u0275fac=(()=>{let e;return function(o){return(e||(e=Ot(t)))(o||t)}})();static \u0275dir=ee({type:t,selectors:[["","cdkPortalOutlet",""]],inputs:{portal:[0,"cdkPortalOutlet","portal"]},outputs:{attached:"attached"},exportAs:["cdkPortalOutlet"],features:[Ge]})}return t})(),nu=(()=>{class t{static \u0275fac=function(i){return new(i||t)};static \u0275mod=le({type:t});static \u0275inj=se({})}return t})();var oC=Qd();function Or(t){return new iu(t.get(In),t.get(ae))}var iu=class{_viewportRuler;_previousHTMLStyles={top:"",left:""};_previousScrollPosition;_isEnabled=!1;_document;constructor(n,e){this._viewportRuler=n,this._document=e}attach(){}enable(){if(this._canBeEnabled()){let n=this._document.documentElement;this._previousScrollPosition=this._viewportRuler.getViewportScrollPosition(),this._previousHTMLStyles.left=n.style.left||"",this._previousHTMLStyles.top=n.style.top||"",n.style.left=Rt(-this._previousScrollPosition.left),n.style.top=Rt(-this._previousScrollPosition.top),n.classList.add("cdk-global-scrollblock"),this._isEnabled=!0}}disable(){if(this._isEnabled){let n=this._document.documentElement,e=this._document.body,i=n.style,o=e.style,a=i.scrollBehavior||"",r=o.scrollBehavior||"";this._isEnabled=!1,i.left=this._previousHTMLStyles.left,i.top=this._previousHTMLStyles.top,n.classList.remove("cdk-global-scrollblock"),oC&&(i.scrollBehavior=o.scrollBehavior="auto"),window.scroll(this._previousScrollPosition.left,this._previousScrollPosition.top),oC&&(i.scrollBehavior=a,o.scrollBehavior=r)}}_canBeEnabled(){if(this._document.documentElement.classList.contains("cdk-global-scrollblock")||this._isEnabled)return!1;let e=this._document.documentElement,i=this._viewportRuler.getViewportSize();return e.scrollHeight>i.height||e.scrollWidth>i.width}};function uC(t,n){return new ou(t.get(No),t.get(X),t.get(In),n)}var ou=class{_scrollDispatcher;_ngZone;_viewportRuler;_config;_scrollSubscription=null;_overlayRef;_initialScrollPosition;constructor(n,e,i,o){this._scrollDispatcher=n,this._ngZone=e,this._viewportRuler=i,this._config=o}attach(n){this._overlayRef,this._overlayRef=n}enable(){if(this._scrollSubscription)return;let n=this._scrollDispatcher.scrolled(0).pipe(Ze(e=>!e||!this._overlayRef.overlayElement.contains(e.getElementRef().nativeElement)));this._config&&this._config.threshold&&this._config.threshold>1?(this._initialScrollPosition=this._viewportRuler.getViewportScrollPosition().top,this._scrollSubscription=n.subscribe(()=>{let e=this._viewportRuler.getViewportScrollPosition().top;Math.abs(e-this._initialScrollPosition)>this._config.threshold?this._detach():this._overlayRef.updatePosition()})):this._scrollSubscription=n.subscribe(this._detach)}disable(){this._scrollSubscription&&(this._scrollSubscription.unsubscribe(),this._scrollSubscription=null)}detach(){this.disable(),this._overlayRef=null}_detach=()=>{this.disable(),this._overlayRef.hasAttached()&&this._ngZone.run(()=>this._overlayRef.detach())}};var uc=class{enable(){}disable(){}attach(){}};function ng(t,n){return n.some(e=>{let i=t.bottom<e.top,o=t.top>e.bottom,a=t.right<e.left,r=t.left>e.right;return i||o||a||r})}function aC(t,n){return n.some(e=>{let i=t.top<e.top,o=t.bottom>e.bottom,a=t.left<e.left,r=t.right>e.right;return i||o||a||r})}function ci(t,n){return new au(t.get(No),t.get(In),t.get(X),n)}var au=class{_scrollDispatcher;_viewportRuler;_ngZone;_config;_scrollSubscription=null;_overlayRef;constructor(n,e,i,o){this._scrollDispatcher=n,this._viewportRuler=e,this._ngZone=i,this._config=o}attach(n){this._overlayRef,this._overlayRef=n}enable(){if(!this._scrollSubscription){let n=this._config?this._config.scrollThrottle:0;this._scrollSubscription=this._scrollDispatcher.scrolled(n).subscribe(()=>{if(this._overlayRef.updatePosition(),this._config&&this._config.autoClose){let e=this._overlayRef.overlayElement.getBoundingClientRect(),{width:i,height:o}=this._viewportRuler.getViewportSize();ng(e,[{width:i,height:o,bottom:o,right:i,top:0,left:0}])&&(this.disable(),this._ngZone.run(()=>this._overlayRef.detach()))}})}}disable(){this._scrollSubscription&&(this._scrollSubscription.unsubscribe(),this._scrollSubscription=null)}detach(){this.disable(),this._overlayRef=null}},mC=(()=>{class t{_injector=p(ie);noop=()=>new uc;close=e=>uC(this._injector,e);block=()=>Or(this._injector);reposition=e=>ci(this._injector,e);static \u0275fac=function(i){return new(i||t)};static \u0275prov=ce({token:t,factory:t.\u0275fac})}return t})(),si=class{positionStrategy;scrollStrategy=new uc;panelClass="";hasBackdrop=!1;backdropClass="cdk-overlay-dark-backdrop";disableAnimations;width;height;minWidth;minHeight;maxWidth;maxHeight;direction;disposeOnNavigation=!1;usePopover;eventPredicate;constructor(n){if(n){let e=Object.keys(n);for(let i of e)n[i]!==void 0&&(this[i]=n[i])}}};var ru=class{connectionPair;scrollableViewProperties;constructor(n,e){this.connectionPair=n,this.scrollableViewProperties=e}};var pC=(()=>{class t{_attachedOverlays=[];_document=p(ae);_isAttached=!1;ngOnDestroy(){this.detach()}add(e){this.remove(e),this._attachedOverlays.push(e)}remove(e){let i=this._attachedOverlays.indexOf(e);i>-1&&this._attachedOverlays.splice(i,1),this._attachedOverlays.length===0&&this.detach()}canReceiveEvent(e,i,o){return o.observers.length<1?!1:e.eventPredicate?e.eventPredicate(i):!0}static \u0275fac=function(i){return new(i||t)};static \u0275prov=ce({token:t,factory:t.\u0275fac})}return t})(),fC=(()=>{class t extends pC{_ngZone=p(X);_renderer=p(Lt).createRenderer(null,null);_cleanupKeydown;add(e){super.add(e),this._isAttached||(this._ngZone.runOutsideAngular(()=>{this._cleanupKeydown=this._renderer.listen("body","keydown",this._keydownListener)}),this._isAttached=!0)}detach(){this._isAttached&&(this._cleanupKeydown?.(),this._isAttached=!1)}_keydownListener=e=>{let i=this._attachedOverlays;for(let o=i.length-1;o>-1;o--){let a=i[o];if(this.canReceiveEvent(a,e,a._keydownEvents)){this._ngZone.run(()=>a._keydownEvents.next(e));break}}};static \u0275fac=function(i){return new(i||t)};static \u0275prov=ce({token:t,factory:t.\u0275fac})}return t})(),hC=(()=>{class t extends pC{_platform=p(Pe);_ngZone=p(X);_renderer=p(Lt).createRenderer(null,null);_cursorOriginalValue;_cursorStyleIsSet=!1;_pointerDownEventTarget=null;_cleanups;add(e){if(super.add(e),!this._isAttached){let i=this._document.body,o={capture:!0},a=this._renderer;this._cleanups=this._ngZone.runOutsideAngular(()=>[a.listen(i,"pointerdown",this._pointerDownListener,o),a.listen(i,"click",this._clickListener,o),a.listen(i,"auxclick",this._clickListener,o),a.listen(i,"contextmenu",this._clickListener,o)]),this._platform.IOS&&!this._cursorStyleIsSet&&(this._cursorOriginalValue=i.style.cursor,i.style.cursor="pointer",this._cursorStyleIsSet=!0),this._isAttached=!0}}detach(){this._isAttached&&(this._cleanups?.forEach(e=>e()),this._cleanups=void 0,this._platform.IOS&&this._cursorStyleIsSet&&(this._document.body.style.cursor=this._cursorOriginalValue,this._cursorStyleIsSet=!1),this._isAttached=!1)}_pointerDownListener=e=>{this._pointerDownEventTarget=Gt(e)};_clickListener=e=>{let i=Gt(e),o=e.type==="click"&&this._pointerDownEventTarget?this._pointerDownEventTarget:i;this._pointerDownEventTarget=null;let a=this._attachedOverlays.slice();for(let r=a.length-1;r>-1;r--){let s=a[r],c=s._outsidePointerEvents;if(!(!s.hasAttached()||!this.canReceiveEvent(s,e,c))){if(rC(s.overlayElement,i)||rC(s.overlayElement,o))break;this._ngZone?this._ngZone.run(()=>c.next(e)):c.next(e)}}};static \u0275fac=function(i){return new(i||t)};static \u0275prov=ce({token:t,factory:t.\u0275fac})}return t})();function rC(t,n){let e=typeof ShadowRoot<"u"&&ShadowRoot,i=n;for(;i;){if(i===t)return!0;i=e&&i instanceof ShadowRoot?i.host:i.parentNode}return!1}var gC=(()=>{class t{static \u0275fac=function(i){return new(i||t)};static \u0275cmp=H({type:t,selectors:[["ng-component"]],hostAttrs:["cdk-overlay-style-loader",""],decls:0,vars:0,template:function(i,o){},styles:[`.cdk-overlay-container, .cdk-global-overlay-wrapper {
  pointer-events: none;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
}

.cdk-overlay-container {
  position: fixed;
}
@layer cdk-overlay {
  .cdk-overlay-container {
    z-index: 1000;
  }
}
.cdk-overlay-container:empty {
  display: none;
}

.cdk-global-overlay-wrapper {
  display: flex;
  position: absolute;
}
@layer cdk-overlay {
  .cdk-global-overlay-wrapper {
    z-index: 1000;
  }
}

.cdk-overlay-pane {
  position: absolute;
  pointer-events: auto;
  box-sizing: border-box;
  display: flex;
  max-width: 100%;
  max-height: 100%;
}
@layer cdk-overlay {
  .cdk-overlay-pane {
    z-index: 1000;
  }
}

.cdk-overlay-backdrop {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  pointer-events: auto;
  -webkit-tap-highlight-color: transparent;
  opacity: 0;
  touch-action: manipulation;
}
@layer cdk-overlay {
  .cdk-overlay-backdrop {
    z-index: 1000;
    transition: opacity 400ms cubic-bezier(0.25, 0.8, 0.25, 1);
  }
}
@media (prefers-reduced-motion) {
  .cdk-overlay-backdrop {
    transition-duration: 1ms;
  }
}

.cdk-overlay-backdrop-showing {
  opacity: 1;
}
@media (forced-colors: active) {
  .cdk-overlay-backdrop-showing {
    opacity: 0.6;
  }
}

@layer cdk-overlay {
  .cdk-overlay-dark-backdrop {
    background: rgba(0, 0, 0, 0.32);
  }
}

.cdk-overlay-transparent-backdrop {
  transition: visibility 1ms linear, opacity 1ms linear;
  visibility: hidden;
  opacity: 1;
}
.cdk-overlay-transparent-backdrop.cdk-overlay-backdrop-showing, .cdk-high-contrast-active .cdk-overlay-transparent-backdrop {
  opacity: 0;
  visibility: visible;
}

.cdk-overlay-backdrop-noop-animation {
  transition: none;
}

.cdk-overlay-connected-position-bounding-box {
  position: absolute;
  display: flex;
  flex-direction: column;
  min-width: 1px;
  min-height: 1px;
}
@layer cdk-overlay {
  .cdk-overlay-connected-position-bounding-box {
    z-index: 1000;
  }
}

.cdk-global-scrollblock {
  position: fixed;
  width: 100%;
  overflow-y: scroll;
}

.cdk-overlay-popover {
  background: none;
  border: none;
  padding: 0;
  outline: 0;
  overflow: visible;
  position: fixed;
  pointer-events: none;
  white-space: normal;
  color: inherit;
  text-decoration: none;
  width: 100%;
  height: 100%;
  inset: auto;
  top: 0;
  left: 0;
}
.cdk-overlay-popover::backdrop {
  display: none;
}
.cdk-overlay-popover .cdk-overlay-backdrop {
  position: fixed;
  z-index: auto;
}
`],encapsulation:2})}return t})(),lu=(()=>{class t{_platform=p(Pe);_containerElement;_document=p(ae);_styleLoader=p(ut);ngOnDestroy(){this._containerElement?.remove()}getContainerElement(){return this._loadStyles(),this._containerElement||this._createContainer(),this._containerElement}_createContainer(){let e="cdk-overlay-container";if(this._platform.isBrowser||qh()){let o=this._document.querySelectorAll(`.${e}[platform="server"], .${e}[platform="test"]`);for(let a=0;a<o.length;a++)o[a].remove()}let i=this._document.createElement("div");i.classList.add(e),qh()?i.setAttribute("platform","test"):this._platform.isBrowser||i.setAttribute("platform","server"),this._document.body.appendChild(i),this._containerElement=i}_loadStyles(){this._styleLoader.load(gC)}static \u0275fac=function(i){return new(i||t)};static \u0275prov=ce({token:t,factory:t.\u0275fac})}return t})(),ig=class{_renderer;_ngZone;element;_cleanupClick;_cleanupTransitionEnd;_fallbackTimeout;constructor(n,e,i,o){this._renderer=e,this._ngZone=i,this.element=n.createElement("div"),this.element.classList.add("cdk-overlay-backdrop"),this._cleanupClick=e.listen(this.element,"click",o)}detach(){this._ngZone.runOutsideAngular(()=>{let n=this.element;clearTimeout(this._fallbackTimeout),this._cleanupTransitionEnd?.(),this._cleanupTransitionEnd=this._renderer.listen(n,"transitionend",this.dispose),this._fallbackTimeout=setTimeout(this.dispose,500),n.style.pointerEvents="none",n.classList.remove("cdk-overlay-backdrop-showing")})}dispose=()=>{clearTimeout(this._fallbackTimeout),this._cleanupClick?.(),this._cleanupTransitionEnd?.(),this._cleanupClick=this._cleanupTransitionEnd=this._fallbackTimeout=void 0,this.element.remove()}};function og(t){return t&&t.nodeType===1}var tg=G([]),Tr=class{_portalOutlet;_host;_pane;_config;_ngZone;_keyboardDispatcher;_document;_location;_outsideClickDispatcher;_animationsDisabled;_injector;_renderer;_backdropClick=new B;_attachments=new B;_detachments=new B;_positionStrategy;_scrollStrategy;_locationChanges;_backdropRef=null;_detachContentMutationObserver;_detachContentAfterRenderRef;_disposed=!1;_previousHostParent;_keydownEvents=new B;_outsidePointerEvents=new B;_afterNextRenderRef;constructor(n,e,i,o,a,r,s,c,d,l=!1,m,v){this._portalOutlet=n,this._host=e,this._pane=i,this._config=o,this._ngZone=a,this._keyboardDispatcher=r,this._document=s,this._location=c,this._outsideClickDispatcher=d,this._animationsDisabled=l,this._injector=m,this._renderer=v,o.scrollStrategy&&(this._scrollStrategy=o.scrollStrategy,this._scrollStrategy.attach(this)),this._positionStrategy=o.positionStrategy}get overlayElement(){return this._pane}get backdropElement(){return this._backdropRef?.element||null}get hostElement(){return this._host}get eventPredicate(){return this._config?.eventPredicate||null}attach(n){if(this._disposed)return null;this._attachHost();let e=this._portalOutlet.attach(n);if(this._positionStrategy?.attach(this),this._updateStackingOrder(),this._updateElementSize(),this._updateElementDirection(),Xe(()=>{tg.update(i=>i.includes(this)?i:[...i,this])}),this._scrollStrategy&&this._scrollStrategy.enable(),this._afterNextRenderRef?.destroy(),this._afterNextRenderRef=Et(()=>{this.hasAttached()&&this.updatePosition()},{injector:this._injector}),this._togglePointerEvents(!0),this._config.hasBackdrop&&this._attachBackdrop(),this._config.panelClass&&this._toggleClasses(this._pane,this._config.panelClass,!0),this._attachments.next(),this._completeDetachContent(),this._keyboardDispatcher.add(this),this._config.disposeOnNavigation===!0||this._config.disposeOnNavigation==="pop-state"){let i=this._location.subscribe(()=>this.dispose());this._locationChanges=()=>i.unsubscribe()}else this._config.disposeOnNavigation==="url-change"&&(this._locationChanges=this._location.onUrlChange(()=>this.dispose()));return this._outsideClickDispatcher.add(this),typeof e?.onDestroy=="function"&&e.onDestroy(()=>{this.hasAttached()&&this._ngZone.runOutsideAngular(()=>Promise.resolve().then(()=>this.detach()))}),e}detach(){if(!this.hasAttached())return;this.detachBackdrop(),this._togglePointerEvents(!1),this._positionStrategy&&this._positionStrategy.detach&&this._positionStrategy.detach(),this._scrollStrategy&&this._scrollStrategy.disable();let n=this._portalOutlet.detach();return this._detachments.next(),this._completeDetachContent(),this._keyboardDispatcher.remove(this),this._detachContentWhenEmpty(),this._locationChanges?.(),this._outsideClickDispatcher.remove(this),Xe(()=>{tg.update(e=>e.filter(i=>i!==this))}),n}dispose(){if(this._disposed)return;let n=this.hasAttached();this._positionStrategy&&this._positionStrategy.dispose(),this._disposeScrollStrategy(),this._backdropRef?.dispose(),this._locationChanges?.(),this._keyboardDispatcher.remove(this),this._portalOutlet.dispose(),this._attachments.complete(),this._backdropClick.complete(),this._keydownEvents.complete(),this._outsidePointerEvents.complete(),this._outsideClickDispatcher.remove(this),this._host?.remove(),this._afterNextRenderRef?.destroy(),this._previousHostParent=this._pane=this._host=this._backdropRef=null,n&&this._detachments.next(),this._detachments.complete(),this._completeDetachContent(),this._disposed=!0,Xe(()=>{tg.update(e=>e.filter(i=>i!==this))})}hasAttached(){return this._portalOutlet.hasAttached()}backdropClick(){return this._backdropClick}attachments(){return this._attachments}detachments(){return this._detachments}keydownEvents(){return this._keydownEvents}outsidePointerEvents(){return this._outsidePointerEvents}getConfig(){return this._config}updatePosition(){this._positionStrategy&&this._positionStrategy.apply()}updatePositionStrategy(n){n!==this._positionStrategy&&(this._positionStrategy&&this._positionStrategy.dispose(),this._positionStrategy=n,this.hasAttached()&&(n.attach(this),this.updatePosition()))}updateSize(n){this._config=I(I({},this._config),n),this._updateElementSize()}setDirection(n){this._config=W(I({},this._config),{direction:n}),this._updateElementDirection()}addPanelClass(n){this._pane&&this._toggleClasses(this._pane,n,!0)}removePanelClass(n){this._pane&&this._toggleClasses(this._pane,n,!1)}getDirection(){let n=this._config.direction;return n?typeof n=="string"?n:n.value:"ltr"}updateScrollStrategy(n){n!==this._scrollStrategy&&(this._disposeScrollStrategy(),this._scrollStrategy=n,this.hasAttached()&&(n.attach(this),n.enable()))}_updateElementDirection(){this._host.setAttribute("dir",this.getDirection())}_updateElementSize(){if(!this._pane)return;let n=this._pane.style;n.width=Rt(this._config.width),n.height=Rt(this._config.height),n.minWidth=Rt(this._config.minWidth),n.minHeight=Rt(this._config.minHeight),n.maxWidth=Rt(this._config.maxWidth),n.maxHeight=Rt(this._config.maxHeight)}_togglePointerEvents(n){this._pane.style.pointerEvents=n?"":"none"}_attachHost(){if(!this._host.parentElement){let n=this._config.usePopover?this._positionStrategy?.getPopoverInsertionPoint?.():null;og(n)?n.after(this._host):n?.type==="parent"?n.element.appendChild(this._host):this._previousHostParent?.appendChild(this._host)}if(this._config.usePopover)try{this._host.showPopover()}catch{}}_attachBackdrop(){let n="cdk-overlay-backdrop-showing";this._backdropRef?.dispose(),this._backdropRef=new ig(this._document,this._renderer,this._ngZone,e=>{this._backdropClick.next(e)}),this._animationsDisabled&&this._backdropRef.element.classList.add("cdk-overlay-backdrop-noop-animation"),this._config.backdropClass&&this._toggleClasses(this._backdropRef.element,this._config.backdropClass,!0),this._config.usePopover?this._host.prepend(this._backdropRef.element):this._host.parentElement.insertBefore(this._backdropRef.element,this._host),!this._animationsDisabled&&typeof requestAnimationFrame<"u"?this._ngZone.runOutsideAngular(()=>{requestAnimationFrame(()=>this._backdropRef?.element.classList.add(n))}):this._backdropRef.element.classList.add(n)}_updateStackingOrder(){!this._config.usePopover&&this._host.nextSibling&&this._host.parentNode.appendChild(this._host)}detachBackdrop(){this._animationsDisabled?(this._backdropRef?.dispose(),this._backdropRef=null):this._backdropRef?.detach()}_toggleClasses(n,e,i){let o=Ki(e||[]).filter(a=>!!a);o.length&&(i?n.classList.add(...o):n.classList.remove(...o))}_detachContentWhenEmpty(){let n=!1;try{this._detachContentAfterRenderRef=Et(()=>{n=!0,this._detachContent()},{injector:this._injector})}catch(e){if(n)throw e;this._detachContent()}globalThis.MutationObserver&&this._pane&&(this._detachContentMutationObserver||=new globalThis.MutationObserver(()=>{this._detachContent()}),this._detachContentMutationObserver.observe(this._pane,{childList:!0}))}_detachContent(){(!this._pane||!this._host||this._pane.children.length===0)&&(this._pane&&this._config.panelClass&&this._toggleClasses(this._pane,this._config.panelClass,!1),this._host&&this._host.parentElement&&(this._previousHostParent=this._host.parentElement,this._host.remove()),this._completeDetachContent())}_completeDetachContent(){this._detachContentAfterRenderRef?.destroy(),this._detachContentAfterRenderRef=void 0,this._detachContentMutationObserver?.disconnect()}_disposeScrollStrategy(){let n=this._scrollStrategy;n?.disable(),n?.detach?.()}},sC="cdk-overlay-connected-position-bounding-box",g1=/([A-Za-z%]+)$/;function eo(t,n){return new su(n,t.get(In),t.get(ae),t.get(Pe),t.get(lu))}var su=class{_viewportRuler;_document;_platform;_overlayContainer;_overlayRef;_isInitialRender=!1;_lastBoundingBoxSize={width:0,height:0};_isPushed=!1;_canPush=!0;_growAfterOpen=!1;_hasFlexibleDimensions=!0;_positionLocked=!1;_originRect;_overlayRect;_viewportRect;_containerRect;_viewportMargin=0;_scrollables=[];_preferredPositions=[];_origin;_pane;_isDisposed=!1;_boundingBox=null;_lastPosition=null;_lastScrollVisibility=null;_positionChanges=new B;_resizeSubscription=_e.EMPTY;_offsetX=0;_offsetY=0;_transformOriginSelector;_appliedPanelClasses=[];_previousPushAmount=null;_popoverLocation="global";positionChanges=this._positionChanges;get positions(){return this._preferredPositions}constructor(n,e,i,o,a){this._viewportRuler=e,this._document=i,this._platform=o,this._overlayContainer=a,this.setOrigin(n)}attach(n){this._overlayRef&&this._overlayRef,this._validatePositions(),n.hostElement.classList.add(sC),this._overlayRef=n,this._boundingBox=n.hostElement,this._pane=n.overlayElement,this._isDisposed=!1,this._isInitialRender=!0,this._lastPosition=null,this._resizeSubscription.unsubscribe(),this._resizeSubscription=this._viewportRuler.change().subscribe(()=>{this._isInitialRender=!0,this.apply()})}apply(){if(this._isDisposed||!this._platform.isBrowser)return;if(!this._isInitialRender&&this._positionLocked&&this._lastPosition){this.reapplyLastPosition();return}this._clearPanelClasses(),this._resetOverlayElementStyles(),this._resetBoundingBoxStyles(),this._viewportRect=this._getNarrowedViewportRect(),this._originRect=this._getOriginRect(),this._overlayRect=this._pane.getBoundingClientRect(),this._containerRect=this._getContainerRect();let n=this._originRect,e=this._overlayRect,i=this._viewportRect,o=this._containerRect,a=[],r;for(let s of this._preferredPositions){let c=this._getOriginPoint(n,o,s),d=this._getOverlayPoint(c,e,s),l=this._getOverlayFit(d,e,i,s);if(l.isCompletelyWithinViewport){this._isPushed=!1,this._applyPosition(s,c);return}if(this._canFitWithFlexibleDimensions(l,d,i)){a.push({position:s,origin:c,overlayRect:e,boundingBoxRect:this._calculateBoundingBoxRect(c,s)});continue}(!r||r.overlayFit.visibleArea<l.visibleArea)&&(r={overlayFit:l,overlayPoint:d,originPoint:c,position:s,overlayRect:e})}if(a.length){let s=null,c=-1;for(let d of a){let l=d.boundingBoxRect.width*d.boundingBoxRect.height*(d.position.weight||1);l>c&&(c=l,s=d)}this._isPushed=!1,this._applyPosition(s.position,s.origin);return}if(this._canPush){this._isPushed=!0,this._applyPosition(r.position,r.originPoint);return}this._applyPosition(r.position,r.originPoint)}detach(){this._clearPanelClasses(),this._lastPosition=null,this._previousPushAmount=null,this._resizeSubscription.unsubscribe()}dispose(){this._isDisposed||(this._boundingBox&&Ra(this._boundingBox.style,{top:"",left:"",right:"",bottom:"",height:"",width:"",alignItems:"",justifyContent:""}),this._pane&&this._resetOverlayElementStyles(),this._overlayRef&&this._overlayRef.hostElement.classList.remove(sC),this.detach(),this._positionChanges.complete(),this._overlayRef=this._boundingBox=null,this._isDisposed=!0)}reapplyLastPosition(){if(this._isDisposed||!this._platform.isBrowser)return;let n=this._lastPosition;n?(this._originRect=this._getOriginRect(),this._overlayRect=this._pane.getBoundingClientRect(),this._viewportRect=this._getNarrowedViewportRect(),this._containerRect=this._getContainerRect(),this._applyPosition(n,this._getOriginPoint(this._originRect,this._containerRect,n))):this.apply()}withScrollableContainers(n){return this._scrollables=n,this}withPositions(n){return this._preferredPositions=n,n.indexOf(this._lastPosition)===-1&&(this._lastPosition=null),this._validatePositions(),this}withViewportMargin(n){return this._viewportMargin=n,this}withFlexibleDimensions(n=!0){return this._hasFlexibleDimensions=n,this}withGrowAfterOpen(n=!0){return this._growAfterOpen=n,this}withPush(n=!0){return this._canPush=n,this}withLockedPosition(n=!0){return this._positionLocked=n,this}setOrigin(n){return this._origin=n,this}withDefaultOffsetX(n){return this._offsetX=n,this}withDefaultOffsetY(n){return this._offsetY=n,this}withTransformOriginOn(n){return this._transformOriginSelector=n,this}withPopoverLocation(n){return this._popoverLocation=n,this}getPopoverInsertionPoint(){return this._popoverLocation==="global"?null:this._popoverLocation!=="inline"?this._popoverLocation:this._origin instanceof q?this._origin.nativeElement:og(this._origin)?this._origin:null}_getOriginPoint(n,e,i){let o;if(i.originX=="center")o=n.left+n.width/2;else{let r=this._isRtl()?n.right:n.left,s=this._isRtl()?n.left:n.right;o=i.originX=="start"?r:s}e.left<0&&(o-=e.left);let a;return i.originY=="center"?a=n.top+n.height/2:a=i.originY=="top"?n.top:n.bottom,e.top<0&&(a-=e.top),{x:o,y:a}}_getOverlayPoint(n,e,i){let o;i.overlayX=="center"?o=-e.width/2:i.overlayX==="start"?o=this._isRtl()?-e.width:0:o=this._isRtl()?0:-e.width;let a;return i.overlayY=="center"?a=-e.height/2:a=i.overlayY=="top"?0:-e.height,{x:n.x+o,y:n.y+a}}_getOverlayFit(n,e,i,o){let a=lC(e),{x:r,y:s}=n,c=this._getOffset(o,"x"),d=this._getOffset(o,"y");c&&(r+=c),d&&(s+=d);let l=0-r,m=r+a.width-i.width,v=0-s,g=s+a.height-i.height,y=this._subtractOverflows(a.width,l,m),_=this._subtractOverflows(a.height,v,g),C=y*_;return{visibleArea:C,isCompletelyWithinViewport:a.width*a.height===C,fitsInViewportVertically:_===a.height,fitsInViewportHorizontally:y==a.width}}_canFitWithFlexibleDimensions(n,e,i){if(this._hasFlexibleDimensions){let o=i.bottom-e.y,a=i.right-e.x,r=cC(this._overlayRef.getConfig().minHeight),s=cC(this._overlayRef.getConfig().minWidth),c=n.fitsInViewportVertically||r!=null&&r<=o,d=n.fitsInViewportHorizontally||s!=null&&s<=a;return c&&d}return!1}_pushOverlayOnScreen(n,e,i){if(this._previousPushAmount&&this._positionLocked)return{x:n.x+this._previousPushAmount.x,y:n.y+this._previousPushAmount.y};let o=lC(e),a=this._viewportRect,r=Math.max(n.x+o.width-a.width,0),s=Math.max(n.y+o.height-a.height,0),c=Math.max(a.top-i.top-n.y,0),d=Math.max(a.left-i.left-n.x,0),l=0,m=0;return o.width<=a.width?l=d||-r:l=n.x<this._getViewportMarginStart()?a.left-i.left-n.x:0,o.height<=a.height?m=c||-s:m=n.y<this._getViewportMarginTop()?a.top-i.top-n.y:0,this._previousPushAmount={x:l,y:m},{x:n.x+l,y:n.y+m}}_applyPosition(n,e){if(this._setTransformOrigin(n),this._setOverlayElementStyles(e,n),this._setBoundingBoxStyles(e,n),n.panelClass&&this._addPanelClasses(n.panelClass),this._positionChanges.observers.length){let i=this._getScrollVisibility();if(n!==this._lastPosition||!this._lastScrollVisibility||!b1(this._lastScrollVisibility,i)){let o=new ru(n,i);this._positionChanges.next(o)}this._lastScrollVisibility=i}this._lastPosition=n,this._isInitialRender=!1}_setTransformOrigin(n){if(!this._transformOriginSelector)return;let e=this._boundingBox.querySelectorAll(this._transformOriginSelector),i,o=n.overlayY;n.overlayX==="center"?i="center":this._isRtl()?i=n.overlayX==="start"?"right":"left":i=n.overlayX==="start"?"left":"right";for(let a=0;a<e.length;a++)e[a].style.transformOrigin=`${i} ${o}`}_calculateBoundingBoxRect(n,e){let i=this._viewportRect,o=this._isRtl(),a,r,s;if(e.overlayY==="top")r=n.y,a=i.height-r+this._getViewportMarginBottom();else if(e.overlayY==="bottom")s=i.height-n.y+this._getViewportMarginTop()+this._getViewportMarginBottom(),a=i.height-s+this._getViewportMarginTop();else{let g=Math.min(i.bottom-n.y+i.top,n.y),y=this._lastBoundingBoxSize.height;a=g*2,r=n.y-g,a>y&&!this._isInitialRender&&!this._growAfterOpen&&(r=n.y-y/2)}let c=e.overlayX==="start"&&!o||e.overlayX==="end"&&o,d=e.overlayX==="end"&&!o||e.overlayX==="start"&&o,l,m,v;if(d)v=i.width-n.x+this._getViewportMarginStart()+this._getViewportMarginEnd(),l=n.x-this._getViewportMarginStart();else if(c)m=n.x,l=i.right-n.x-this._getViewportMarginEnd();else{let g=Math.min(i.right-n.x+i.left,n.x),y=this._lastBoundingBoxSize.width;l=g*2,m=n.x-g,l>y&&!this._isInitialRender&&!this._growAfterOpen&&(m=n.x-y/2)}return{top:r,left:m,bottom:s,right:v,width:l,height:a}}_setBoundingBoxStyles(n,e){let i=this._calculateBoundingBoxRect(n,e);!this._isInitialRender&&!this._growAfterOpen&&(i.height=Math.min(i.height,this._lastBoundingBoxSize.height),i.width=Math.min(i.width,this._lastBoundingBoxSize.width));let o={};if(this._hasExactPosition())o.top=o.left="0",o.bottom=o.right="auto",o.maxHeight=o.maxWidth="",o.width=o.height="100%";else{let a=this._overlayRef.getConfig().maxHeight,r=this._overlayRef.getConfig().maxWidth;o.width=Rt(i.width),o.height=Rt(i.height),o.top=Rt(i.top)||"auto",o.bottom=Rt(i.bottom)||"auto",o.left=Rt(i.left)||"auto",o.right=Rt(i.right)||"auto",e.overlayX==="center"?o.alignItems="center":o.alignItems=e.overlayX==="end"?"flex-end":"flex-start",e.overlayY==="center"?o.justifyContent="center":o.justifyContent=e.overlayY==="bottom"?"flex-end":"flex-start",a&&(o.maxHeight=Rt(a)),r&&(o.maxWidth=Rt(r))}this._lastBoundingBoxSize=i,Ra(this._boundingBox.style,o)}_resetBoundingBoxStyles(){Ra(this._boundingBox.style,{top:"0",left:"0",right:"0",bottom:"0",height:"",width:"",alignItems:"",justifyContent:""})}_resetOverlayElementStyles(){Ra(this._pane.style,{top:"",left:"",bottom:"",right:"",position:"",transform:""})}_setOverlayElementStyles(n,e){let i={},o=this._hasExactPosition(),a=this._hasFlexibleDimensions,r=this._overlayRef.getConfig();if(o){let l=this._viewportRuler.getViewportScrollPosition();Ra(i,this._getExactOverlayY(e,n,l)),Ra(i,this._getExactOverlayX(e,n,l))}else i.position="static";let s="",c=this._getOffset(e,"x"),d=this._getOffset(e,"y");c&&(s+=`translateX(${c}px) `),d&&(s+=`translateY(${d}px)`),i.transform=s.trim(),r.maxHeight&&(o?i.maxHeight=Rt(r.maxHeight):a&&(i.maxHeight="")),r.maxWidth&&(o?i.maxWidth=Rt(r.maxWidth):a&&(i.maxWidth="")),Ra(this._pane.style,i)}_getExactOverlayY(n,e,i){let o={top:"",bottom:""},a=this._getOverlayPoint(e,this._overlayRect,n);if(this._isPushed&&(a=this._pushOverlayOnScreen(a,this._overlayRect,i)),n.overlayY==="bottom"){let r=this._document.documentElement.clientHeight;o.bottom=`${r-(a.y+this._overlayRect.height)}px`}else o.top=Rt(a.y);return o}_getExactOverlayX(n,e,i){let o={left:"",right:""},a=this._getOverlayPoint(e,this._overlayRect,n);this._isPushed&&(a=this._pushOverlayOnScreen(a,this._overlayRect,i));let r;if(this._isRtl()?r=n.overlayX==="end"?"left":"right":r=n.overlayX==="end"?"right":"left",r==="right"){let s=this._document.documentElement.clientWidth;o.right=`${s-(a.x+this._overlayRect.width)}px`}else o.left=Rt(a.x);return o}_getScrollVisibility(){let n=this._getOriginRect(),e=this._pane.getBoundingClientRect(),i=this._scrollables.map(o=>o.getElementRef().nativeElement.getBoundingClientRect());return{isOriginClipped:aC(n,i),isOriginOutsideView:ng(n,i),isOverlayClipped:aC(e,i),isOverlayOutsideView:ng(e,i)}}_subtractOverflows(n,...e){return e.reduce((i,o)=>i-Math.max(o,0),n)}_getNarrowedViewportRect(){let n=this._document.documentElement.clientWidth,e=this._document.documentElement.clientHeight,i=this._viewportRuler.getViewportScrollPosition();return{top:i.top+this._getViewportMarginTop(),left:i.left+this._getViewportMarginStart(),right:i.left+n-this._getViewportMarginEnd(),bottom:i.top+e-this._getViewportMarginBottom(),width:n-this._getViewportMarginStart()-this._getViewportMarginEnd(),height:e-this._getViewportMarginTop()-this._getViewportMarginBottom()}}_isRtl(){return this._overlayRef.getDirection()==="rtl"}_hasExactPosition(){return!this._hasFlexibleDimensions||this._isPushed}_getOffset(n,e){return e==="x"?n.offsetX==null?this._offsetX:n.offsetX:n.offsetY==null?this._offsetY:n.offsetY}_validatePositions(){}_addPanelClasses(n){this._pane&&Ki(n).forEach(e=>{e!==""&&this._appliedPanelClasses.indexOf(e)===-1&&(this._appliedPanelClasses.push(e),this._pane.classList.add(e))})}_clearPanelClasses(){this._pane&&(this._appliedPanelClasses.forEach(n=>{this._pane.classList.remove(n)}),this._appliedPanelClasses=[])}_getViewportMarginStart(){return typeof this._viewportMargin=="number"?this._viewportMargin:this._viewportMargin?.start??0}_getViewportMarginEnd(){return typeof this._viewportMargin=="number"?this._viewportMargin:this._viewportMargin?.end??0}_getViewportMarginTop(){return typeof this._viewportMargin=="number"?this._viewportMargin:this._viewportMargin?.top??0}_getViewportMarginBottom(){return typeof this._viewportMargin=="number"?this._viewportMargin:this._viewportMargin?.bottom??0}_getOriginRect(){let n=this._origin;if(n instanceof q)return n.nativeElement.getBoundingClientRect();if(n instanceof Element)return n.getBoundingClientRect();let e=n.width||0,i=n.height||0;return{top:n.y,bottom:n.y+i,left:n.x,right:n.x+e,height:i,width:e}}_getContainerRect(){let n=this._overlayRef.getConfig().usePopover&&this._popoverLocation!=="global",e=this._overlayContainer.getContainerElement();n&&(e.style.display="block");let i=e.getBoundingClientRect();return n&&(e.style.display=""),i}};function Ra(t,n){for(let e in n)Object.hasOwn(n,e)&&(t[e]=n[e]);return t}function cC(t){if(typeof t!="number"&&t!=null){let[n,e]=t.split(g1);return!e||e==="px"?parseFloat(n):null}return t||null}function lC(t){return{top:Math.floor(t.top),right:Math.floor(t.right),bottom:Math.floor(t.bottom),left:Math.floor(t.left),width:Math.floor(t.width),height:Math.floor(t.height)}}function b1(t,n){return t===n?!0:t.isOriginClipped===n.isOriginClipped&&t.isOriginOutsideView===n.isOriginOutsideView&&t.isOverlayClipped===n.isOverlayClipped&&t.isOverlayOutsideView===n.isOverlayOutsideView}var dC="cdk-global-overlay-wrapper";function Rr(t){return new cu}var cu=class{_overlayRef;_cssPosition="static";_topOffset="";_bottomOffset="";_alignItems="";_xPosition="";_xOffset="";_width="";_height="";_isDisposed=!1;attach(n){let e=n.getConfig();this._overlayRef=n,this._width&&!e.width&&n.updateSize({width:this._width}),this._height&&!e.height&&n.updateSize({height:this._height}),n.hostElement.classList.add(dC),this._isDisposed=!1}top(n=""){return this._bottomOffset="",this._topOffset=n,this._alignItems="flex-start",this}left(n=""){return this._xOffset=n,this._xPosition="left",this}bottom(n=""){return this._topOffset="",this._bottomOffset=n,this._alignItems="flex-end",this}right(n=""){return this._xOffset=n,this._xPosition="right",this}start(n=""){return this._xOffset=n,this._xPosition="start",this}end(n=""){return this._xOffset=n,this._xPosition="end",this}width(n=""){return this._overlayRef?this._overlayRef.updateSize({width:n}):this._width=n,this}height(n=""){return this._overlayRef?this._overlayRef.updateSize({height:n}):this._height=n,this}centerHorizontally(n=""){return this.left(n),this._xPosition="center",this}centerVertically(n=""){return this.top(n),this._alignItems="center",this}apply(){if(!this._overlayRef||!this._overlayRef.hasAttached())return;let n=this._overlayRef.overlayElement.style,e=this._overlayRef.hostElement.style,i=this._overlayRef.getConfig(),{width:o,height:a,maxWidth:r,maxHeight:s}=i,c=(o==="100%"||o==="100vw")&&(!r||r==="100%"||r==="100vw"),d=(a==="100%"||a==="100vh")&&(!s||s==="100%"||s==="100vh"),l=this._xPosition,m=this._xOffset,v=this._overlayRef.getConfig().direction==="rtl",g="",y="",_="";c?_="flex-start":l==="center"?(_="center",v?y=m:g=m):v?l==="left"||l==="end"?(_="flex-end",g=m):(l==="right"||l==="start")&&(_="flex-start",y=m):l==="left"||l==="start"?(_="flex-start",g=m):(l==="right"||l==="end")&&(_="flex-end",y=m),n.position=this._cssPosition,n.marginLeft=c?"0":g,n.marginTop=d?"0":this._topOffset,n.marginBottom=this._bottomOffset,n.marginRight=c?"0":y,e.justifyContent=_,e.alignItems=d?"flex-start":this._alignItems}dispose(){if(this._isDisposed||!this._overlayRef)return;let n=this._overlayRef.overlayElement.style,e=this._overlayRef.hostElement,i=e.style;e.classList.remove(dC),i.justifyContent=i.alignItems=n.marginTop=n.marginBottom=n.marginLeft=n.marginRight=n.position="",this._overlayRef=null,this._isDisposed=!0}},bC=(()=>{class t{_injector=p(ie);global(){return Rr()}flexibleConnectedTo(e){return eo(this._injector,e)}static \u0275fac=function(i){return new(i||t)};static \u0275prov=ce({token:t,factory:t.\u0275fac})}return t})(),mc=new D("OVERLAY_DEFAULT_CONFIG");function li(t,n){t.get(ut).load(gC);let e=t.get(lu),i=t.get(ae),o=t.get(Qe),a=t.get(Fn),r=t.get(ft),s=t.get(Ue,null,{optional:!0})||t.get(Lt).createRenderer(null,null),c=new si(n),d=t.get(mc,null,{optional:!0})?.usePopover??!0;c.direction=c.direction||r.value,!i.body||!("showPopover"in i.body)?c.usePopover=!1:c.usePopover=n?.usePopover??d;let l=i.createElement("div"),m=i.createElement("div");l.id=o.getId("cdk-overlay-"),l.classList.add("cdk-overlay-pane"),m.appendChild(l),c.usePopover&&(m.setAttribute("popover","manual"),m.classList.add("cdk-overlay-popover"));let v=c.usePopover?c.positionStrategy?.getPopoverInsertionPoint?.():null;return og(v)?v.after(m):v?.type==="parent"?v.element.appendChild(m):e.getContainerElement().appendChild(m),new Tr(new dc(l,a,t),m,l,c,t.get(X),t.get(fC),i,t.get(Fd),t.get(hC),n?.disableAnimations??t.get(Ms,null,{optional:!0})==="NoopAnimations",t.get(xt),s)}var vC=(()=>{class t{scrollStrategies=p(mC);_positionBuilder=p(bC);_injector=p(ie);create(e){return li(this._injector,e)}position(){return this._positionBuilder}static \u0275fac=function(i){return new(i||t)};static \u0275prov=ce({token:t,factory:t.\u0275fac})}return t})(),v1=[{originX:"start",originY:"bottom",overlayX:"start",overlayY:"top"},{originX:"start",originY:"top",overlayX:"start",overlayY:"bottom"},{originX:"end",originY:"top",overlayX:"end",overlayY:"bottom"},{originX:"end",originY:"bottom",overlayX:"end",overlayY:"top"}],y1=new D("cdk-connected-overlay-scroll-strategy",{providedIn:"root",factory:()=>{let t=p(ie);return()=>ci(t)}}),Ar=(()=>{class t{elementRef=p(q);static \u0275fac=function(i){return new(i||t)};static \u0275dir=ee({type:t,selectors:[["","cdk-overlay-origin",""],["","overlay-origin",""],["","cdkOverlayOrigin",""]],exportAs:["cdkOverlayOrigin"]})}return t})(),yC=new D("cdk-connected-overlay-default-config"),du=(()=>{class t{_dir=p(ft,{optional:!0});_injector=p(ie);_overlayRef;_templatePortal;_backdropSubscription=_e.EMPTY;_attachSubscription=_e.EMPTY;_detachSubscription=_e.EMPTY;_positionSubscription=_e.EMPTY;_offsetX;_offsetY;_position;_scrollStrategyFactory=p(y1);_ngZone=p(X);origin;positions;positionStrategy;get offsetX(){return this._offsetX}set offsetX(e){this._offsetX=e,this._position&&this._updatePositionStrategy(this._position)}get offsetY(){return this._offsetY}set offsetY(e){this._offsetY=e,this._position&&this._updatePositionStrategy(this._position)}width;height;minWidth;minHeight;backdropClass;panelClass;viewportMargin=0;scrollStrategy;open=!1;disableClose=!1;transformOriginSelector;hasBackdrop=!1;lockPosition=!1;flexibleDimensions=!1;growAfterOpen=!1;push=!1;disposeOnNavigation=!1;usePopover;matchWidth=!1;set _config(e){typeof e!="string"&&this._assignConfig(e)}backdropClick=new K;positionChange=new K;attach=new K;detach=new K;overlayKeydown=new K;overlayOutsideClick=new K;constructor(){let e=p(At),i=p(Bt),o=p(yC,{optional:!0}),a=p(mc,{optional:!0});this.usePopover=a?.usePopover===!1?null:"global",this._templatePortal=new xn(e,i),this.scrollStrategy=this._scrollStrategyFactory(),o&&this._assignConfig(o)}get overlayRef(){return this._overlayRef}get dir(){return this._dir?this._dir.value:"ltr"}ngOnDestroy(){this._attachSubscription.unsubscribe(),this._detachSubscription.unsubscribe(),this._backdropSubscription.unsubscribe(),this._positionSubscription.unsubscribe(),this._overlayRef?.dispose()}ngOnChanges(e){this._position&&(this._updatePositionStrategy(this._position),this._overlayRef?.updateSize({width:this._getWidth(),minWidth:this.minWidth,height:this.height,minHeight:this.minHeight}),e.origin&&this.open&&this._position.apply()),e.open&&(this.open?this.attachOverlay():this.detachOverlay())}_createOverlay(){(!this.positions||!this.positions.length)&&(this.positions=v1);let e=this._overlayRef=li(this._injector,this._buildConfig());this._attachSubscription=e.attachments().subscribe(()=>this.attach.emit()),this._detachSubscription=e.detachments().subscribe(()=>this.detach.emit()),e.keydownEvents().subscribe(i=>{this.overlayKeydown.next(i),i.keyCode===27&&!this.disableClose&&!pt(i)&&(i.preventDefault(),this.detachOverlay())}),this._overlayRef.outsidePointerEvents().subscribe(i=>{let o=this._getOriginElement(),a=Gt(i);(!o||o!==a&&!o.contains(a))&&this.overlayOutsideClick.next(i)})}_buildConfig(){let e=this._position=this.positionStrategy||this._createPositionStrategy(),i=new si({direction:this._dir||"ltr",positionStrategy:e,scrollStrategy:this.scrollStrategy,hasBackdrop:this.hasBackdrop,disposeOnNavigation:this.disposeOnNavigation,usePopover:!!this.usePopover});return(this.height||this.height===0)&&(i.height=this.height),(this.minWidth||this.minWidth===0)&&(i.minWidth=this.minWidth),(this.minHeight||this.minHeight===0)&&(i.minHeight=this.minHeight),this.backdropClass&&(i.backdropClass=this.backdropClass),this.panelClass&&(i.panelClass=this.panelClass),i}_updatePositionStrategy(e){let i=this.positions.map(o=>({originX:o.originX,originY:o.originY,overlayX:o.overlayX,overlayY:o.overlayY,offsetX:o.offsetX||this.offsetX,offsetY:o.offsetY||this.offsetY,panelClass:o.panelClass||void 0}));return e.setOrigin(this._getOrigin()).withPositions(i).withFlexibleDimensions(this.flexibleDimensions).withPush(this.push).withGrowAfterOpen(this.growAfterOpen).withViewportMargin(this.viewportMargin).withLockedPosition(this.lockPosition).withTransformOriginOn(this.transformOriginSelector).withPopoverLocation(this.usePopover===null?"global":this.usePopover)}_createPositionStrategy(){let e=eo(this._injector,this._getOrigin());return this._updatePositionStrategy(e),e}_getOrigin(){return this.origin instanceof Ar?this.origin.elementRef:this.origin}_getOriginElement(){return this.origin instanceof Ar?this.origin.elementRef.nativeElement:this.origin instanceof q?this.origin.nativeElement:typeof Element<"u"&&this.origin instanceof Element?this.origin:null}_getWidth(){return this.width?this.width:this.matchWidth?this._getOriginElement()?.getBoundingClientRect?.().width:void 0}attachOverlay(){this._overlayRef||this._createOverlay();let e=this._overlayRef;e.getConfig().hasBackdrop=this.hasBackdrop,e.updateSize({width:this._getWidth()}),e.hasAttached()||e.attach(this._templatePortal),this.hasBackdrop?this._backdropSubscription=e.backdropClick().subscribe(i=>this.backdropClick.emit(i)):this._backdropSubscription.unsubscribe(),this._positionSubscription.unsubscribe(),this.positionChange.observers.length>0&&(this._positionSubscription=this._position.positionChanges.pipe(Im(()=>this.positionChange.observers.length>0)).subscribe(i=>{this._ngZone.run(()=>this.positionChange.emit(i)),this.positionChange.observers.length===0&&this._positionSubscription.unsubscribe()})),this.open=!0}detachOverlay(){this._overlayRef?.detach(),this._backdropSubscription.unsubscribe(),this._positionSubscription.unsubscribe(),this.open=!1}_assignConfig(e){this.origin=e.origin??this.origin,this.positions=e.positions??this.positions,this.positionStrategy=e.positionStrategy??this.positionStrategy,this.offsetX=e.offsetX??this.offsetX,this.offsetY=e.offsetY??this.offsetY,this.width=e.width??this.width,this.height=e.height??this.height,this.minWidth=e.minWidth??this.minWidth,this.minHeight=e.minHeight??this.minHeight,this.backdropClass=e.backdropClass??this.backdropClass,this.panelClass=e.panelClass??this.panelClass,this.viewportMargin=e.viewportMargin??this.viewportMargin,this.scrollStrategy=e.scrollStrategy??this.scrollStrategy,this.disableClose=e.disableClose??this.disableClose,this.transformOriginSelector=e.transformOriginSelector??this.transformOriginSelector,this.hasBackdrop=e.hasBackdrop??this.hasBackdrop,this.lockPosition=e.lockPosition??this.lockPosition,this.flexibleDimensions=e.flexibleDimensions??this.flexibleDimensions,this.growAfterOpen=e.growAfterOpen??this.growAfterOpen,this.push=e.push??this.push,this.disposeOnNavigation=e.disposeOnNavigation??this.disposeOnNavigation,this.usePopover=e.usePopover??this.usePopover,this.matchWidth=e.matchWidth??this.matchWidth}static \u0275fac=function(i){return new(i||t)};static \u0275dir=ee({type:t,selectors:[["","cdk-connected-overlay",""],["","connected-overlay",""],["","cdkConnectedOverlay",""]],inputs:{origin:[0,"cdkConnectedOverlayOrigin","origin"],positions:[0,"cdkConnectedOverlayPositions","positions"],positionStrategy:[0,"cdkConnectedOverlayPositionStrategy","positionStrategy"],offsetX:[0,"cdkConnectedOverlayOffsetX","offsetX"],offsetY:[0,"cdkConnectedOverlayOffsetY","offsetY"],width:[0,"cdkConnectedOverlayWidth","width"],height:[0,"cdkConnectedOverlayHeight","height"],minWidth:[0,"cdkConnectedOverlayMinWidth","minWidth"],minHeight:[0,"cdkConnectedOverlayMinHeight","minHeight"],backdropClass:[0,"cdkConnectedOverlayBackdropClass","backdropClass"],panelClass:[0,"cdkConnectedOverlayPanelClass","panelClass"],viewportMargin:[0,"cdkConnectedOverlayViewportMargin","viewportMargin"],scrollStrategy:[0,"cdkConnectedOverlayScrollStrategy","scrollStrategy"],open:[0,"cdkConnectedOverlayOpen","open"],disableClose:[0,"cdkConnectedOverlayDisableClose","disableClose"],transformOriginSelector:[0,"cdkConnectedOverlayTransformOriginOn","transformOriginSelector"],hasBackdrop:[2,"cdkConnectedOverlayHasBackdrop","hasBackdrop",O],lockPosition:[2,"cdkConnectedOverlayLockPosition","lockPosition",O],flexibleDimensions:[2,"cdkConnectedOverlayFlexibleDimensions","flexibleDimensions",O],growAfterOpen:[2,"cdkConnectedOverlayGrowAfterOpen","growAfterOpen",O],push:[2,"cdkConnectedOverlayPush","push",O],disposeOnNavigation:[2,"cdkConnectedOverlayDisposeOnNavigation","disposeOnNavigation",e=>e==="url-change"||e==="pop-state"?e:O(e)],usePopover:[0,"cdkConnectedOverlayUsePopover","usePopover"],matchWidth:[2,"cdkConnectedOverlayMatchWidth","matchWidth",O],_config:[0,"cdkConnectedOverlay","_config"]},outputs:{backdropClick:"backdropClick",positionChange:"positionChange",attach:"attach",detach:"detach",overlayKeydown:"overlayKeydown",overlayOutsideClick:"overlayOutsideClick"},exportAs:["cdkConnectedOverlay"],features:[wt]})}return t})(),di=(()=>{class t{static \u0275fac=function(i){return new(i||t)};static \u0275mod=le({type:t});static \u0275inj=se({providers:[vC],imports:[Ne,nu,Jh,Jh]})}return t})();var DC=(()=>{class t{_renderer;_elementRef;onChange=e=>{};onTouched=()=>{};constructor(e,i){this._renderer=e,this._elementRef=i}setProperty(e,i){this._renderer.setProperty(this._elementRef.nativeElement,e,i)}registerOnTouched(e){this.onTouched=e}registerOnChange(e){this.onChange=e}setDisabledState(e){this.setProperty("disabled",e)}static \u0275fac=function(i){return new(i||t)(Yt(Ue),Yt(q))};static \u0275dir=ee({type:t})}return t})(),_1=(()=>{class t extends DC{static \u0275fac=(()=>{let e;return function(o){return(e||(e=Ot(t)))(o||t)}})();static \u0275dir=ee({type:t,features:[Ge]})}return t})(),to=new D("");var x1={provide:to,useExisting:$t(()=>MC),multi:!0};function C1(){let t=Vn()?Vn().getUserAgent():"";return/android (\d+)/.test(t.toLowerCase())}var S1=new D(""),MC=(()=>{class t extends DC{_compositionMode;_composing=!1;constructor(e,i,o){super(e,i),this._compositionMode=o,this._compositionMode==null&&(this._compositionMode=!C1())}writeValue(e){let i=e??"";this.setProperty("value",i)}_handleInput(e){(!this._compositionMode||this._compositionMode&&!this._composing)&&this.onChange(e)}_compositionStart(){this._composing=!0}_compositionEnd(e){this._composing=!1,this._compositionMode&&this.onChange(e)}static \u0275fac=function(i){return new(i||t)(Yt(Ue),Yt(q),Yt(S1,8))};static \u0275dir=ee({type:t,selectors:[["input","formControlName","",3,"type","checkbox",3,"ngNoCva",""],["textarea","formControlName","",3,"ngNoCva",""],["input","formControl","",3,"type","checkbox",3,"ngNoCva",""],["textarea","formControl","",3,"ngNoCva",""],["input","ngModel","",3,"type","checkbox",3,"ngNoCva",""],["textarea","ngModel","",3,"ngNoCva",""],["","ngDefaultControl",""]],hostBindings:function(i,o){i&1&&V("input",function(r){return o._handleInput(r.target.value)})("blur",function(){return o.onTouched()})("compositionstart",function(){return o._compositionStart()})("compositionend",function(r){return o._compositionEnd(r.target.value)})},standalone:!1,features:[ze([x1]),Ge]})}return t})();function sg(t){return t==null||cg(t)===0}function cg(t){return t==null?null:Array.isArray(t)||typeof t=="string"?t.length:t instanceof Set?t.size:null}var vc=new D(""),IC=new D(""),w1=/^(?=.{1,254}$)(?=.{1,64}@)[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,Oo=class{static min(n){return E1(n)}static max(n){return D1(n)}static required(n){return kC(n)}static requiredTrue(n){return M1(n)}static email(n){return I1(n)}static minLength(n){return k1(n)}static maxLength(n){return N1(n)}static pattern(n){return T1(n)}static nullValidator(n){return mu()}static compose(n){return PC(n)}static composeAsync(n){return FC(n)}};function E1(t){return n=>{if(n.value==null||t==null)return null;let e=parseFloat(n.value);return!isNaN(e)&&e<t?{min:{min:t,actual:n.value}}:null}}function D1(t){return n=>{if(n.value==null||t==null)return null;let e=parseFloat(n.value);return!isNaN(e)&&e>t?{max:{max:t,actual:n.value}}:null}}function kC(t){return sg(t.value)?{required:!0}:null}function M1(t){return t.value===!0?null:{required:!0}}function I1(t){return sg(t.value)||w1.test(t.value)?null:{email:!0}}function k1(t){return n=>{let e=n.value?.length??cg(n.value);return e===null||e===0?null:e<t?{minlength:{requiredLength:t,actualLength:e}}:null}}function N1(t){return n=>{let e=n.value?.length??cg(n.value);return e!==null&&e>t?{maxlength:{requiredLength:t,actualLength:e}}:null}}function T1(t){if(!t)return mu;let n,e;return typeof t=="string"?(e="",t.charAt(0)!=="^"&&(e+="^"),e+=t,t.charAt(t.length-1)!=="$"&&(e+="$"),n=new RegExp(e)):(e=t.toString(),n=t),i=>{if(sg(i.value))return null;let o=i.value;return n.test(o)?null:{pattern:{requiredPattern:e,actualValue:o}}}}function mu(t){return null}function NC(t){return t!=null}function TC(t){return Ca(t)?kn(t):t}function AC(t){let n={};return t.forEach(e=>{n=e!=null?I(I({},n),e):n}),Object.keys(n).length===0?null:n}function OC(t,n){return n.map(e=>e(t))}function A1(t){return!t.validate}function RC(t){return t.map(n=>A1(n)?n:e=>n.validate(e))}function PC(t){if(!t)return null;let n=t.filter(NC);return n.length==0?null:function(e){return AC(OC(e,n))}}function lg(t){return t!=null?PC(RC(t)):null}function FC(t){if(!t)return null;let n=t.filter(NC);return n.length==0?null:function(e){let i=OC(e,n).map(TC);return ls(i).pipe(je(AC))}}function dg(t){return t!=null?FC(RC(t)):null}function _C(t,n){return t===null?[n]:Array.isArray(t)?[...t,n]:[t,n]}function LC(t){return t._rawValidators}function BC(t){return t._rawAsyncValidators}function ag(t){return t?Array.isArray(t)?t:[t]:[]}function pu(t,n){return Array.isArray(t)?t.includes(n):t===n}function xC(t,n){let e=ag(n);return ag(t).forEach(o=>{pu(e,o)||e.push(o)}),e}function CC(t,n){return ag(n).filter(e=>!pu(t,e))}var fu=class{get value(){return this.control?this.control.value:null}get valid(){return this.control?this.control.valid:null}get invalid(){return this.control?this.control.invalid:null}get pending(){return this.control?this.control.pending:null}get disabled(){return this.control?this.control.disabled:null}get enabled(){return this.control?this.control.enabled:null}get errors(){return this.control?this.control.errors:null}get pristine(){return this.control?this.control.pristine:null}get dirty(){return this.control?this.control.dirty:null}get touched(){return this.control?this.control.touched:null}get status(){return this.control?this.control.status:null}get untouched(){return this.control?this.control.untouched:null}get statusChanges(){return this.control?this.control.statusChanges:null}get valueChanges(){return this.control?this.control.valueChanges:null}get path(){return null}_composedValidatorFn;_composedAsyncValidatorFn;_rawValidators=[];_rawAsyncValidators=[];_setValidators(n){this._rawValidators=n||[],this._composedValidatorFn=lg(this._rawValidators)}_setAsyncValidators(n){this._rawAsyncValidators=n||[],this._composedAsyncValidatorFn=dg(this._rawAsyncValidators)}get validator(){return this._composedValidatorFn||null}get asyncValidator(){return this._composedAsyncValidatorFn||null}_onDestroyCallbacks=[];_registerOnDestroy(n){this._onDestroyCallbacks.push(n)}_invokeOnDestroyCallbacks(){this._onDestroyCallbacks.forEach(n=>n()),this._onDestroyCallbacks=[]}reset(n=void 0){this.control?.reset(n)}hasError(n,e){return this.control?this.control.hasError(n,e):!1}getError(n,e){return this.control?this.control.getError(n,e):null}},Lr=class extends fu{name;get formDirective(){return null}get path(){return null}};var pc="VALID",uu="INVALID",Pr="PENDING",fc="DISABLED",Ro=class{},hu=class extends Ro{value;source;constructor(n,e){super(),this.value=n,this.source=e}},gc=class extends Ro{pristine;source;constructor(n,e){super(),this.pristine=n,this.source=e}},bc=class extends Ro{touched;source;constructor(n,e){super(),this.touched=n,this.source=e}},Fr=class extends Ro{status;source;constructor(n,e){super(),this.status=n,this.source=e}},gu=class extends Ro{source;constructor(n){super(),this.source=n}},Br=class extends Ro{source;constructor(n){super(),this.source=n}};function VC(t){return(xu(t)?t.validators:t)||null}function O1(t){return Array.isArray(t)?lg(t):t||null}function jC(t,n){return(xu(n)?n.asyncValidators:t)||null}function R1(t){return Array.isArray(t)?dg(t):t||null}function xu(t){return t!=null&&!Array.isArray(t)&&typeof t=="object"}function P1(t,n,e){let i=t.controls;if(!(n?Object.keys(i):i).length)throw new te(1e3,"");if(!zC(i,e))throw new te(1001,"")}function F1(t,n,e){t._forEachChild((i,o)=>{if(e[o]===void 0)throw new te(-1002,"")})}var bu=class{_pendingDirty=!1;_hasOwnPendingAsyncValidator=null;_pendingTouched=!1;_onCollectionChange=()=>{};_updateOn;_hasRequired=G(!1);_parent=null;_asyncValidationSubscription;_composedValidatorFn;_composedAsyncValidatorFn;_rawValidators;_rawAsyncValidators;value;constructor(n,e){this._assignValidators(n),this._assignAsyncValidators(e)}get validator(){return this._composedValidatorFn}set validator(n){this._rawValidators=this._composedValidatorFn=n,this._updateHasRequiredValidator()}get asyncValidator(){return this._composedAsyncValidatorFn}set asyncValidator(n){this._rawAsyncValidators=this._composedAsyncValidatorFn=n}get parent(){return this._parent}get status(){return Xe(this.statusReactive)}set status(n){Xe(()=>this.statusReactive.set(n))}_status=P(()=>this.statusReactive());statusReactive=G(void 0);get valid(){return this.status===pc}get invalid(){return this.status===uu}get pending(){return this.status===Pr}get disabled(){return this.status===fc}get enabled(){return this.status!==fc}errors;get pristine(){return Xe(this.pristineReactive)}set pristine(n){Xe(()=>this.pristineReactive.set(n))}_pristine=P(()=>this.pristineReactive());pristineReactive=G(!0);get dirty(){return!this.pristine}get touched(){return Xe(this.touchedReactive)}set touched(n){Xe(()=>this.touchedReactive.set(n))}_touched=P(()=>this.touchedReactive());touchedReactive=G(!1);get untouched(){return!this.touched}_events=new B;events=this._events.asObservable();valueChanges;statusChanges;get updateOn(){return this._updateOn?this._updateOn:this.parent?this.parent.updateOn:"change"}setValidators(n){this._assignValidators(n)}setAsyncValidators(n){this._assignAsyncValidators(n)}addValidators(n){this.setValidators(xC(n,this._rawValidators))}addAsyncValidators(n){this.setAsyncValidators(xC(n,this._rawAsyncValidators))}removeValidators(n){this.setValidators(CC(n,this._rawValidators))}removeAsyncValidators(n){this.setAsyncValidators(CC(n,this._rawAsyncValidators))}hasValidator(n){return pu(this._rawValidators,n)}hasAsyncValidator(n){return pu(this._rawAsyncValidators,n)}clearValidators(){this.validator=null}clearAsyncValidators(){this.asyncValidator=null}markAsTouched(n={}){let e=this.touched===!1;this.touched=!0;let i=n.sourceControl??this;n.onlySelf||this._parent?.markAsTouched(W(I({},n),{sourceControl:i})),e&&n.emitEvent!==!1&&this._events.next(new bc(!0,i))}markAllAsDirty(n={}){this.markAsDirty({onlySelf:!0,emitEvent:n.emitEvent,sourceControl:this}),this._forEachChild(e=>e.markAllAsDirty(n))}markAllAsTouched(n={}){this.markAsTouched({onlySelf:!0,emitEvent:n.emitEvent,sourceControl:this}),this._forEachChild(e=>e.markAllAsTouched(n))}markAsUntouched(n={}){let e=this.touched===!0;this.touched=!1,this._pendingTouched=!1;let i=n.sourceControl??this;this._forEachChild(o=>{o.markAsUntouched({onlySelf:!0,emitEvent:n.emitEvent,sourceControl:i})}),n.onlySelf||this._parent?._updateTouched(n,i),e&&n.emitEvent!==!1&&this._events.next(new bc(!1,i))}markAsDirty(n={}){let e=this.pristine===!0;this.pristine=!1;let i=n.sourceControl??this;n.onlySelf||this._parent?.markAsDirty(W(I({},n),{sourceControl:i})),e&&n.emitEvent!==!1&&this._events.next(new gc(!1,i))}markAsPristine(n={}){let e=this.pristine===!1;this.pristine=!0,this._pendingDirty=!1;let i=n.sourceControl??this;this._forEachChild(o=>{o.markAsPristine({onlySelf:!0,emitEvent:n.emitEvent})}),n.onlySelf||this._parent?._updatePristine(n,i),e&&n.emitEvent!==!1&&this._events.next(new gc(!0,i))}markAsPending(n={}){this.status=Pr;let e=n.sourceControl??this;n.emitEvent!==!1&&(this._events.next(new Fr(this.status,e)),this.statusChanges.emit(this.status)),n.onlySelf||this._parent?.markAsPending(W(I({},n),{sourceControl:e}))}disable(n={}){let e=this._parentMarkedDirty(n.onlySelf);this.status=fc,this.errors=null,this._forEachChild(o=>{o.disable(W(I({},n),{onlySelf:!0}))}),this._updateValue();let i=n.sourceControl??this;n.emitEvent!==!1&&(this._events.next(new hu(this.value,i)),this._events.next(new Fr(this.status,i)),this.valueChanges.emit(this.value),this.statusChanges.emit(this.status)),this._updateAncestors(W(I({},n),{skipPristineCheck:e}),this),this._onDisabledChange.forEach(o=>o(!0))}enable(n={}){let e=this._parentMarkedDirty(n.onlySelf);this.status=pc,this._forEachChild(i=>{i.enable(W(I({},n),{onlySelf:!0}))}),this.updateValueAndValidity({onlySelf:!0,emitEvent:n.emitEvent}),this._updateAncestors(W(I({},n),{skipPristineCheck:e}),this),this._onDisabledChange.forEach(i=>i(!1))}_updateAncestors(n,e){n.onlySelf||(this._parent?.updateValueAndValidity(n),n.skipPristineCheck||this._parent?._updatePristine({},e),this._parent?._updateTouched({},e))}setParent(n){this._parent=n}getRawValue(){return this.value}updateValueAndValidity(n={}){if(this._setInitialStatus(),this._updateValue(),this.enabled){let i=this._cancelExistingSubscription();this.errors=this._runValidator(),this.status=this._calculateStatus(),(this.status===pc||this.status===Pr)&&this._runAsyncValidator(i,n.emitEvent)}let e=n.sourceControl??this;n.emitEvent!==!1&&(this._events.next(new hu(this.value,e)),this._events.next(new Fr(this.status,e)),this.valueChanges.emit(this.value),this.statusChanges.emit(this.status)),n.onlySelf||this._parent?.updateValueAndValidity(W(I({},n),{sourceControl:e}))}_updateTreeValidity(n={emitEvent:!0}){this._forEachChild(e=>e._updateTreeValidity(n)),this.updateValueAndValidity({onlySelf:!0,emitEvent:n.emitEvent})}_setInitialStatus(){this.status=this._allControlsDisabled()?fc:pc}_runValidator(){return this.validator?this.validator(this):null}_runAsyncValidator(n,e){if(this.asyncValidator){this.status=Pr,this._hasOwnPendingAsyncValidator={emitEvent:e!==!1,shouldHaveEmitted:n!==!1};let i=TC(this.asyncValidator(this));this._asyncValidationSubscription=i.subscribe(o=>{this._hasOwnPendingAsyncValidator=null,this.setErrors(o,{emitEvent:e,shouldHaveEmitted:n})})}}_cancelExistingSubscription(){if(this._asyncValidationSubscription){this._asyncValidationSubscription.unsubscribe();let n=(this._hasOwnPendingAsyncValidator?.emitEvent||this._hasOwnPendingAsyncValidator?.shouldHaveEmitted)??!1;return this._hasOwnPendingAsyncValidator=null,n}return!1}setErrors(n,e={}){this.errors=n,this._updateControlsErrors(e.emitEvent!==!1,this,e.shouldHaveEmitted)}get(n){let e=n;return e==null||(Array.isArray(e)||(e=e.split(".")),e.length===0)?null:e.reduce((i,o)=>i&&i._find(o),this)}getError(n,e){let i=e?this.get(e):this;return i?.errors?i.errors[n]:null}hasError(n,e){return!!this.getError(n,e)}get root(){let n=this;for(;n._parent;)n=n._parent;return n}_updateControlsErrors(n,e,i){this.status=this._calculateStatus(),n&&this.statusChanges.emit(this.status),(n||i)&&this._events.next(new Fr(this.status,e)),this._parent&&this._parent._updateControlsErrors(n,e,i)}_initObservables(){this.valueChanges=new K,this.statusChanges=new K}_calculateStatus(){return this._allControlsDisabled()?fc:this.errors?uu:this._hasOwnPendingAsyncValidator||this._anyControlsHaveStatus(Pr)?Pr:this._anyControlsHaveStatus(uu)?uu:pc}_anyControlsHaveStatus(n){return this._anyControls(e=>e.status===n)}_anyControlsDirty(){return this._anyControls(n=>n.dirty)}_anyControlsTouched(){return this._anyControls(n=>n.touched)}_updatePristine(n,e){let i=!this._anyControlsDirty(),o=this.pristine!==i;this.pristine=i,n.onlySelf||this._parent?._updatePristine(n,e),o&&this._events.next(new gc(this.pristine,e))}_updateTouched(n={},e){this.touched=this._anyControlsTouched(),this._events.next(new bc(this.touched,e)),n.onlySelf||this._parent?._updateTouched(n,e)}_onDisabledChange=[];_registerOnCollectionChange(n){this._onCollectionChange=n}_setUpdateStrategy(n){xu(n)&&n.updateOn!=null&&(this._updateOn=n.updateOn)}_parentMarkedDirty(n){return!n&&!!this._parent?.dirty&&!this._parent._anyControlsDirty()}_find(n){return null}_assignValidators(n){this._rawValidators=Array.isArray(n)?n.slice():n,this._composedValidatorFn=O1(this._rawValidators),this._updateHasRequiredValidator()}_assignAsyncValidators(n){this._rawAsyncValidators=Array.isArray(n)?n.slice():n,this._composedAsyncValidatorFn=R1(this._rawAsyncValidators)}_updateHasRequiredValidator(){Xe(()=>this._hasRequired.set(this.hasValidator(Oo.required)))}};function zC(t,n){return Object.hasOwn(t,n)}function L1(t){return t.tagName==="INPUT"||t.tagName==="SELECT"||t.tagName==="TEXTAREA"}function B1(t,n,e,i){switch(e){case"name":t.setAttribute(n,e,i);break;case"disabled":case"readonly":case"required":i?t.setAttribute(n,e,""):t.removeAttribute(n,e);break;case"max":case"min":case"minLength":case"maxLength":i!==void 0?t.setAttribute(n,e,i.toString()):t.removeAttribute(n,e);break}}var rg=class{kind;context;control;message;constructor({kind:n,context:e,control:i}){this.kind=n,this.context=e,this.control=i}};var V1=(()=>{class t{_validator=mu;_onChange;_enabled;ngOnChanges(e){if(this.inputName in e){let i=this.normalizeInput(e[this.inputName].currentValue);this._enabled=this.enabled(i),this._validator=this._enabled?this.createValidator(i):mu,this._onChange?.()}}validate(e){return this._validator(e)}registerOnValidatorChange(e){this._onChange=e}enabled(e){return e!=null}static \u0275fac=function(i){return new(i||t)};static \u0275dir=ee({type:t,features:[wt]})}return t})();var j1={provide:vc,useExisting:$t(()=>HC),multi:!0};var HC=(()=>{class t extends V1{required;inputName="required";normalizeInput=O;createValidator=e=>kC;enabled(e){return e}static \u0275fac=(()=>{let e;return function(o){return(e||(e=Ot(t)))(o||t)}})();static \u0275dir=ee({type:t,selectors:[["","required","","formControlName","",3,"type","checkbox"],["","required","","formControl","",3,"type","checkbox"],["","required","","ngModel","",3,"type","checkbox"]],hostVars:1,hostBindings:function(i,o){i&2&&Q("required",o._enabled?"":null)},inputs:{required:"required"},standalone:!1,features:[ze([j1]),Ge]})}return t})();var $C=new D("",{factory:()=>z1}),z1="always";function SC(t,n,e=!0){let i=()=>{};n?.valueAccessor?.registerOnChange(i),n?.valueAccessor?.registerOnTouched(i),yu(t,n),t&&(n._invokeOnDestroyCallbacks(),t._registerOnCollectionChange(()=>{}))}function vu(t,n){t.forEach(e=>{e.registerOnValidatorChange&&e.registerOnValidatorChange(n)})}function UC(t,n){let e=LC(t);n.validator!==null?t.setValidators(_C(e,n.validator)):typeof e=="function"&&t.setValidators([e]);let i=BC(t);n.asyncValidator!==null?t.setAsyncValidators(_C(i,n.asyncValidator)):typeof i=="function"&&t.setAsyncValidators([i]);let o=()=>t.updateValueAndValidity();vu(n._rawValidators,o),vu(n._rawAsyncValidators,o)}function yu(t,n){let e=!1;if(t!==null){if(n.validator!==null){let o=LC(t);if(Array.isArray(o)&&o.length>0){let a=o.filter(r=>r!==n.validator);a.length!==o.length&&(e=!0,t.setValidators(a))}}if(n.asyncValidator!==null){let o=BC(t);if(Array.isArray(o)&&o.length>0){let a=o.filter(r=>r!==n.asyncValidator);a.length!==o.length&&(e=!0,t.setAsyncValidators(a))}}}let i=()=>{};return vu(n._rawValidators,i),vu(n._rawAsyncValidators,i),e}function GC(t,n){t==null,UC(t,n)}function H1(t,n){return yu(t,n)}function $1(t){return Object.getPrototypeOf(t.constructor)===_1}function WC(t,n){t._syncPendingControls(),n.forEach(e=>{let i=e.control;i.updateOn==="submit"&&i._pendingChange&&(e.viewToModelUpdate(i._pendingValue),i._pendingChange=!1)})}function U1(t,n){if(!n)return null;Array.isArray(n);let e,i,o;return n.forEach(a=>{a.constructor===MC?e=a:$1(a)?i=a:o=a}),o||i||e||null}function G1(t,n){let e=t.indexOf(n);e>-1&&t.splice(e,1)}var Pa=class extends fu{_parent=null;name=null;valueAccessor=null;isCustomControlBased=!1;userOnReset;resetSubscription;set onReset(n){this.userOnReset=n,this.resetSubscription?.unsubscribe(),this.resetSubscription=void 0,this.control&&(this.resetSubscription=this.control.events.subscribe(e=>{e instanceof Br&&this.control&&this.userOnReset?.(this.control.value)}),this.subscription?.add(this.resetSubscription))}isNativeFormElement=!1;rawValueAccessors;_selectedValueAccessor=null;get selectedValueAccessor(){return this._selectedValueAccessor??=U1(this,this.rawValueAccessors)}parseErrorsValidator=null;renderer;injector;requiredValidatorViaDi;subscription;customControlBindings=null;constructor(n,e,i){super(),this.injector=n,this.renderer=e,this.rawValueAccessors=i,this.injector?.get(Wt)?.onDestroy(()=>{this.removeParseErrorsValidator(this.control),this.subscription?.unsubscribe()})}setupCustomControl(){this.subscription?.unsubscribe();let n=this.injector?.get(He);if(!this.control||!n)return;let e=n.markForCheck.bind(n);this.subscription=new _e,this.subscription.add(this.control.valueChanges.subscribe(e)),this.subscription.add(this.control.statusChanges.subscribe(e)),this.resetSubscription?.unsubscribe(),this.resetSubscription=void 0,this.userOnReset&&(this.resetSubscription=this.control.events.subscribe(i=>{i instanceof Br&&this.control&&this.userOnReset?.(this.control.value)}),this.subscription.add(this.resetSubscription)),this.parseErrorsValidator&&this.control.addValidators(this.parseErrorsValidator)}ngControlCreate(n){!n.nativeElement.hasAttribute?.("ngNoCva")&&(this.rawValueAccessors&&this.rawValueAccessors.length>0||this.valueAccessor!==null)||!n.customControl||(this.isCustomControlBased=!0,n.listenToCustomControlModel(o=>{this.control?.markAsDirty(),this.control?.setValue(o,{emitModelToViewChange:!1}),this.viewToModelUpdate(o)}),n.listenToCustomControlOutput("touch",()=>{this.control?.markAsTouched()}),this.customControlBindings={},this.isNativeFormElement=L1(n.nativeElement),this.requiredValidatorViaDi=this._rawValidators.find(o=>o instanceof HC))}ngControlUpdate(n,e){if(!this.isCustomControlBased)return;let i=this.control,o=this.customControlBindings;Object.is(o.value,i.value)||(o.value=i.value,n.setCustomControlModelInput(i.value)),this.bindControlProperty(n,o,"touched",i.touched),this.bindControlProperty(n,o,"dirty",i.dirty),this.bindControlProperty(n,o,"valid",i.valid),this.bindControlProperty(n,o,"invalid",i.invalid),this.bindControlProperty(n,o,"pending",i.pending),this.bindControlProperty(n,o,"disabled",i.disabled),this.shouldBindRequired&&this.bindControlProperty(n,o,"required",this.isRequired);let a=i.errors;if(o.errors!==a){o.errors=a;let r=this._convertErrors(a);n.setInputOnDirectives("errors",r)}}get isRequired(){return(this.requiredValidatorViaDi?._enabled||this.control?._hasRequired())??!1}get shouldBindRequired(){return!0}bindControlProperty(n,e,i,o){if(e[i]===o)return;e[i]=o;let a=n.setInputOnDirectives(i,o);this.isNativeFormElement&&!a&&(i==="disabled"||i==="required")&&this.renderer&&B1(this.renderer,n.nativeElement,i,o)}_convertErrors(n){if(n===null)return[];let e=this.control;return Object.entries(n).map(([i,o])=>new rg({context:o,kind:i,control:e}))}setParseErrorSource(n){if(n===void 0)return;let e=null,i=P(()=>{let o=n();return o.length===0?null:o.reduce((a,r)=>(a[r.kind]=r,a),{})});this.parseErrorsValidator=(()=>e).bind(this),lt(()=>{e=i(),this.control?.updateValueAndValidity({emitEvent:!1})},{injector:this.injector})}removeParseErrorsValidator(n){this.parseErrorsValidator&&(n?.removeValidators(this.parseErrorsValidator),n?.updateValueAndValidity({emitEvent:!1}))}};var _u=class extends bu{constructor(n,e,i){super(VC(e),jC(i,e)),this.controls=n,this._initObservables(),this._setUpdateStrategy(e),this._setUpControls(),this.updateValueAndValidity({onlySelf:!0,emitEvent:!!this.asyncValidator})}controls;registerControl(n,e){let i=this._find(n);return i||(this.controls[n]=e,e.setParent(this),e._registerOnCollectionChange(this._onCollectionChange),e)}addControl(n,e,i={}){this.registerControl(n,e),this.updateValueAndValidity({emitEvent:i.emitEvent}),this._onCollectionChange()}removeControl(n,e={}){let i=this._find(n);i&&i._registerOnCollectionChange(()=>{}),delete this.controls[n],this.updateValueAndValidity({emitEvent:e.emitEvent}),this._onCollectionChange()}setControl(n,e,i={}){let o=this._find(n);o&&o._registerOnCollectionChange(()=>{}),delete this.controls[n],e&&this.registerControl(n,e),this.updateValueAndValidity({emitEvent:i.emitEvent}),this._onCollectionChange()}contains(n){return this._find(n)?.enabled===!0}setValue(n,e={}){Xe(()=>{F1(this,!0,n),Object.keys(n).forEach(i=>{P1(this,!0,i),this.controls[i].setValue(n[i],{onlySelf:!0,emitEvent:e.emitEvent})}),this.updateValueAndValidity(e)})}patchValue(n,e={}){n!=null&&(Object.keys(n).forEach(i=>{let o=this._find(i);o&&o.patchValue(n[i],{onlySelf:!0,emitEvent:e.emitEvent})}),this.updateValueAndValidity(e))}reset(n={},e={}){this._forEachChild((i,o)=>{i.reset(n?n[o]:null,W(I({},e),{onlySelf:!0}))}),this._updatePristine(e,this),this._updateTouched(e,this),this.updateValueAndValidity(e),e?.emitEvent!==!1&&this._events.next(new Br(this))}getRawValue(){return this._reduceChildren({},(n,e,i)=>(n[i]=e.getRawValue(),n))}_syncPendingControls(){let n=this._reduceChildren(!1,(e,i)=>i._syncPendingControls()?!0:e);return n&&this.updateValueAndValidity({onlySelf:!0}),n}_forEachChild(n){Object.keys(this.controls).forEach(e=>{let i=this.controls[e];i&&n(i,e)})}_setUpControls(){this._forEachChild(n=>{n.setParent(this),n._registerOnCollectionChange(this._onCollectionChange)})}_updateValue(){this.value=this._reduceValue()}_anyControls(n){for(let[e,i]of Object.entries(this.controls))if(this.contains(e)&&n(i))return!0;return!1}_reduceValue(){let n={};return this._reduceChildren(n,(e,i,o)=>((i.enabled||this.disabled)&&(e[o]=i.value),e))}_reduceChildren(n,e){let i=n;return this._forEachChild((o,a)=>{i=e(i,o,a)}),i}_allControlsDisabled(){for(let n of Object.keys(this.controls))if(this.controls[n].enabled)return!1;return Object.keys(this.controls).length>0||this.disabled}_find(n){return zC(this.controls,n)?this.controls[n]:null}};var W1={provide:Lr,useExisting:$t(()=>Vr)},hc=Promise.resolve(),Vr=(()=>{class t extends Lr{callSetDisabledState;get submitted(){return Xe(this.submittedReactive)}_submitted=P(()=>this.submittedReactive());submittedReactive=G(!1);_directives=new Set;form;ngSubmit=new K;options;constructor(e,i,o){super(),this.callSetDisabledState=o,this.form=new _u({},lg(e),dg(i))}ngAfterViewInit(){this._setUpdateStrategy()}get formDirective(){return this}get control(){return this.form}get path(){return[]}get controls(){return this.form.controls}addControl(e){hc.then(()=>{let i=this._findContainer(e.path);e.control=i.registerControl(e.name,e.control),e._setupWithForm(this.callSetDisabledState),e.control.updateValueAndValidity({emitEvent:!1}),this._directives.add(e)})}getControl(e){return this.form.get(e.path)}removeControl(e){hc.then(()=>{this._findContainer(e.path)?.removeControl(e.name),this._directives.delete(e)})}addFormGroup(e){hc.then(()=>{let i=this._findContainer(e.path),o=new _u({});GC(o,e),i.registerControl(e.name,o),o.updateValueAndValidity({emitEvent:!1})})}removeFormGroup(e){hc.then(()=>{this._findContainer(e.path)?.removeControl?.(e.name)})}getFormGroup(e){return this.form.get(e.path)}updateModel(e,i){hc.then(()=>{this.form.get(e.path).setValue(i)})}setValue(e){this.control.setValue(e)}onSubmit(e){return this.submittedReactive.set(!0),WC(this.form,this._directives),this.ngSubmit.emit(e),this.form._events.next(new gu(this.control)),e?.target?.method==="dialog"}onReset(){this.resetForm()}resetForm(e=void 0){this.form.reset(e),this.submittedReactive.set(!1)}_setUpdateStrategy(){this.options&&this.options.updateOn!=null&&(this.form._updateOn=this.options.updateOn)}_findContainer(e){return e.pop(),e.length?this.form.get(e):this.form}static \u0275fac=function(i){return new(i||t)(Yt(vc,10),Yt(IC,10),Yt($C,8))};static \u0275dir=ee({type:t,selectors:[["form",3,"ngNoForm","",3,"formGroup","",3,"formArray",""],["ng-form"],["","ngForm",""]],hostBindings:function(i,o){i&1&&V("submit",function(r){return o.onSubmit(r)})("reset",function(){return o.onReset()})},inputs:{options:[0,"ngFormOptions","options"]},outputs:{ngSubmit:"ngSubmit"},exportAs:["ngForm"],standalone:!1,features:[ze([W1]),Ge]})}return t})();function wC(t,n){let e=t.indexOf(n);e>-1&&t.splice(e,1)}function EC(t){return typeof t=="object"&&t!==null&&Object.keys(t).length===2&&"value"in t&&"disabled"in t}var q1=class extends bu{defaultValue=null;_onChange=[];_pendingValue;_pendingChange=!1;constructor(n=null,e,i){super(VC(e),jC(i,e)),this._applyFormState(n),this._setUpdateStrategy(e),this._initObservables(),this.updateValueAndValidity({onlySelf:!0,emitEvent:!!this.asyncValidator}),xu(e)&&(e.nonNullable||e.initialValueIsDefault)&&(EC(n)?this.defaultValue=n.value:this.defaultValue=n)}setValue(n,e={}){Xe(()=>{this.value=this._pendingValue=n,this._onChange.length&&e.emitModelToViewChange!==!1&&this._onChange.forEach(i=>i(this.value,e.emitViewToModelChange!==!1)),this.updateValueAndValidity(e)})}patchValue(n,e={}){this.setValue(n,e)}reset(n=this.defaultValue,e={}){this._applyFormState(n),this.markAsPristine(e),this.markAsUntouched(e),this.setValue(this.value,e),e.overwriteDefaultValue&&(this.defaultValue=this.value),this._pendingChange=!1,e?.emitEvent!==!1&&this._events.next(new Br(this))}_updateValue(){}_anyControls(n){return!1}_allControlsDisabled(){return this.disabled}registerOnChange(n){this._onChange.push(n)}_unregisterOnChange(n){wC(this._onChange,n)}registerOnDisabledChange(n){this._onDisabledChange.push(n)}_unregisterOnDisabledChange(n){wC(this._onDisabledChange,n)}_forEachChild(n){}_syncPendingControls(){return this.updateOn==="submit"&&(this._pendingDirty&&this.markAsDirty(),this._pendingTouched&&this.markAsTouched(),this._pendingChange)?(this.setValue(this._pendingValue,{onlySelf:!0,emitModelToViewChange:!1}),!0):!1}_applyFormState(n){EC(n)?(this.value=this._pendingValue=n.value,n.disabled?this.disable({onlySelf:!0,emitEvent:!1}):this.enable({onlySelf:!0,emitEvent:!1})):this.value=this._pendingValue=n}};var Y1=t=>t instanceof q1;var Z1=(()=>{class t extends Lr{callSetDisabledState;get submitted(){return Xe(this._submittedReactive)}set submitted(e){this._submittedReactive.set(e)}_submitted=P(()=>this._submittedReactive());_submittedReactive=G(!1);_oldForm;_onCollectionChange=()=>this._updateDomValue();directives=[];constructor(e,i,o){super(),this.callSetDisabledState=o,this._setValidators(e),this._setAsyncValidators(i)}ngOnChanges(e){this.onChanges(e)}ngOnDestroy(){this.onDestroy()}onChanges(e){if(!this.form)throw new te(1052,!1);Object.hasOwn(e,"form")&&(this._updateValidators(),this._updateDomValue(),this._updateRegistrations(),this._oldForm=this.form)}onDestroy(){this.form&&(yu(this.form,this),this.form._onCollectionChange===this._onCollectionChange&&this.form._registerOnCollectionChange(()=>{}))}get formDirective(){return this}get path(){return[]}addControl(e){let i=this.form.get(e.path);return e._setupWithForm(i,this.callSetDisabledState),i.updateValueAndValidity({emitEvent:!1}),this.directives.push(e),i}getControl(e){return this.form.get(e.path)}removeControl(e){SC(e.control||null,e,!1),G1(this.directives,e)}addFormGroup(e){this._setUpFormContainer(e)}removeFormGroup(e){this._cleanUpFormContainer(e)}getFormGroup(e){return this.form.get(e.path)}getFormArray(e){return this.form.get(e.path)}addFormArray(e){this._setUpFormContainer(e)}removeFormArray(e){this._cleanUpFormContainer(e)}updateModel(e,i){this.form.get(e.path).setValue(i)}onReset(){this.resetForm()}resetForm(e=void 0,i={}){this.form.reset(e,i),this._submittedReactive.set(!1)}onSubmit(e){return this.submitted=!0,WC(this.form,this.directives),this.ngSubmit.emit(e),this.form._events.next(new gu(this.control)),e?.target?.method==="dialog"}_updateDomValue(){this.directives.forEach(e=>{let i=e.control,o=this.form.get(e.path);i!==o&&(SC(i||null,e),Y1(o)&&e._setupWithForm(o,this.callSetDisabledState))}),this.form._updateTreeValidity({emitEvent:!1})}_setUpFormContainer(e){let i=this.form.get(e.path);GC(i,e),i.updateValueAndValidity({emitEvent:!1})}_cleanUpFormContainer(e){let i=this.form?.get(e.path);i&&H1(i,e)&&i.updateValueAndValidity({emitEvent:!1})}_updateRegistrations(){this.form._registerOnCollectionChange(this._onCollectionChange),this._oldForm?._registerOnCollectionChange(()=>{})}_updateValidators(){UC(this.form,this),this._oldForm&&yu(this._oldForm,this)}static \u0275fac=function(i){return new(i||t)(Yt(vc,10),Yt(IC,10),Yt($C,8))};static \u0275dir=ee({type:t,features:[Ge,wt]})}return t})(),K1={provide:Lr,useExisting:$t(()=>jr)},jr=(()=>{class t extends Z1{form=null;ngSubmit=new K;get control(){return this.form}static \u0275fac=(()=>{let e;return function(o){return(e||(e=Ot(t)))(o||t)}})();static \u0275dir=ee({type:t,selectors:[["","formGroup",""]],hostBindings:function(i,o){i&1&&V("submit",function(r){return o.onSubmit(r)})("reset",function(){return o.onReset()})},inputs:{form:[0,"formGroup","form"]},outputs:{ngSubmit:"ngSubmit"},exportAs:["ngForm"],standalone:!1,features:[ze([K1]),Ge]})}return t})();var YC=Symbol("FIELD_TREE");var ZC=Symbol("IS_ASYNC_VALIDATION_RESOURCE"),qC=class{reducer;create;brand;[ZC];constructor(n,e){this.reducer=n,this.create=e}};function yc(t){return typeof t=="function"&&t[YC]===!0}var Cu=new D("");var ug=class{_box;_destroyed=new B;_resizeSubject=new B;_resizeObserver;_elementObservables=new Map;constructor(n){this._box=n,typeof ResizeObserver<"u"&&(this._resizeObserver=new ResizeObserver(e=>this._resizeSubject.next(e)))}observe(n){return this._elementObservables.has(n)||this._elementObservables.set(n,new ge(e=>{let i=this._resizeSubject.subscribe(e);return this._resizeObserver?.observe(n,{box:this._box}),()=>{this._resizeObserver?.unobserve(n),i.unsubscribe(),this._elementObservables.delete(n)}}).pipe(Ze(e=>e.some(i=>i.target===n)),yl({bufferSize:1,refCount:!0}),Re(this._destroyed))),this._elementObservables.get(n)}destroy(){this._destroyed.next(),this._destroyed.complete(),this._resizeSubject.complete(),this._elementObservables.clear()}},Su=(()=>{class t{_cleanupErrorListener;_observers=new Map;_ngZone=p(X);constructor(){typeof ResizeObserver<"u"}ngOnDestroy(){for(let[,e]of this._observers)e.destroy();this._observers.clear(),this._cleanupErrorListener?.()}observe(e,i){let o=i?.box||"content-box";return this._observers.has(o)||this._observers.set(o,new ug(o)),this._observers.get(o).observe(e)}static \u0275fac=function(i){return new(i||t)};static \u0275prov=ce({token:t,factory:t.\u0275fac})}return t})();var mg=(()=>{class t{static \u0275fac=function(i){return new(i||t)};static \u0275dir=ee({type:t,selectors:[["mat-label"]]})}return t})(),X1=new D("MatError");var pg=(()=>{class t{align="start";id=p(Qe).getId("mat-mdc-hint-");static \u0275fac=function(i){return new(i||t)};static \u0275dir=ee({type:t,selectors:[["mat-hint"]],hostAttrs:[1,"mat-mdc-form-field-hint","mat-mdc-form-field-bottom-align"],hostVars:4,hostBindings:function(i,o){i&2&&(Vt("id",o.id),Q("align",null),z("mat-mdc-form-field-hint-end",o.align==="end"))},inputs:{align:"align",id:"id"}})}return t})(),nS=new D("MatPrefix"),_c=(()=>{class t{set _isTextSelector(e){this._isText=!0}_isText=!1;static \u0275fac=function(i){return new(i||t)};static \u0275dir=ee({type:t,selectors:[["","matPrefix",""],["","matIconPrefix",""],["","matTextPrefix",""]],inputs:{_isTextSelector:[0,"matTextPrefix","_isTextSelector"]},features:[ze([{provide:nS,useExisting:t}])]})}return t})(),Q1=new D("MatSuffix");var iS=new D("FloatingLabelParent"),KC=(()=>{class t{_elementRef=p(q);get floating(){return this._floating}set floating(e){this._floating=e,this.monitorResize&&this._handleResize()}_floating=!1;get monitorResize(){return this._monitorResize}set monitorResize(e){this._monitorResize=e,this._monitorResize?this._subscribeToResize():this._resizeSubscription.unsubscribe()}_monitorResize=!1;_resizeObserver=p(Su);_ngZone=p(X);_parent=p(iS);_resizeSubscription=new _e;ngOnDestroy(){this._resizeSubscription.unsubscribe()}getWidth(){return J1(this._elementRef.nativeElement)}get element(){return this._elementRef.nativeElement}_handleResize(){setTimeout(()=>this._parent._handleLabelResized())}_subscribeToResize(){this._resizeSubscription.unsubscribe(),this._ngZone.runOutsideAngular(()=>{this._resizeSubscription=this._resizeObserver.observe(this._elementRef.nativeElement,{box:"border-box"}).subscribe(()=>this._handleResize())})}static \u0275fac=function(i){return new(i||t)};static \u0275dir=ee({type:t,selectors:[["label","matFormFieldFloatingLabel",""]],hostAttrs:[1,"mdc-floating-label","mat-mdc-floating-label"],hostVars:2,hostBindings:function(i,o){i&2&&z("mdc-floating-label--float-above",o.floating)},inputs:{floating:"floating",monitorResize:"monitorResize"}})}return t})();function J1(t){let n=t;if(n.offsetParent!==null)return n.scrollWidth;let e=n.cloneNode(!0);e.style.setProperty("position","absolute"),e.style.setProperty("transform","translate(-9999px, -9999px)"),document.documentElement.appendChild(e);let i=e.scrollWidth;return e.remove(),i}var XC="mdc-line-ripple--active",wu="mdc-line-ripple--deactivating",QC=(()=>{class t{_elementRef=p(q);_cleanupTransitionEnd;constructor(){let e=p(X),i=p(Ue);e.runOutsideAngular(()=>{this._cleanupTransitionEnd=i.listen(this._elementRef.nativeElement,"transitionend",this._handleTransitionEnd)})}activate(){let e=this._elementRef.nativeElement.classList;e.remove(wu),e.add(XC)}deactivate(){this._elementRef.nativeElement.classList.add(wu)}_handleTransitionEnd=e=>{let i=this._elementRef.nativeElement.classList,o=i.contains(wu);e.propertyName==="opacity"&&o&&i.remove(XC,wu)};ngOnDestroy(){this._cleanupTransitionEnd()}static \u0275fac=function(i){return new(i||t)};static \u0275dir=ee({type:t,selectors:[["div","matFormFieldLineRipple",""]],hostAttrs:[1,"mdc-line-ripple"]})}return t})(),JC=(()=>{class t{_elementRef=p(q);_ngZone=p(X);open=!1;_notch;ngAfterViewInit(){let e=this._elementRef.nativeElement,i=e.querySelector(".mdc-floating-label");i?(e.classList.add("mdc-notched-outline--upgraded"),typeof requestAnimationFrame=="function"&&(i.style.transitionDuration="0s",this._ngZone.runOutsideAngular(()=>{requestAnimationFrame(()=>i.style.transitionDuration="")}))):e.classList.add("mdc-notched-outline--no-label")}_setNotchWidth(e){let i=this._notch.nativeElement;!this.open||!e?i.style.width="":i.style.width=`calc(${e}px * var(--mat-mdc-form-field-floating-label-scale, 0.75) + 9px)`}_setMaxWidth(e){this._notch.nativeElement.style.setProperty("--mat-form-field-notch-max-width",`calc(100% - ${e}px)`)}static \u0275fac=function(i){return new(i||t)};static \u0275cmp=(function(){let e=["notch"];return H({type:t,selectors:[["div","matFormFieldNotchedOutline",""]],viewQuery:function(a,r){if(a&1&&ot(e,5),a&2){let s;Y(s=Z())&&(r._notch=s.first)}},hostAttrs:[1,"mdc-notched-outline"],hostVars:2,hostBindings:function(a,r){a&2&&z("mdc-notched-outline--notched",r.open)},inputs:{open:[0,"matFormFieldNotchedOutlineOpen","open"]},ngContentSelectors:["*"],decls:5,vars:0,consts:[["notch",""],[1,"mat-mdc-notch-piece","mdc-notched-outline__leading"],[1,"mat-mdc-notch-piece","mdc-notched-outline__notch"],[1,"mat-mdc-notch-piece","mdc-notched-outline__trailing"]],template:function(a,r){a&1&&(Be(),Dt(0,"div",1),Je(1,"div",2,0),oe(3),it(),Dt(4,"div",3))},encapsulation:2})})()}return t})(),xc=(()=>{class t{id;ngField=null;ngControl=null;focused=!1;empty=!1;shouldLabelFloat=!1;required=!1;disabled=!1;errorState=!1;controlType;autofilled;userAriaDescribedBy;disableAutomaticLabeling;describedByIds;stateChanges=null;value;static \u0275fac=function(i){return new(i||t)};static \u0275dir=ee({type:t})}return t})();var Fa=new D("MatFormField"),eA=new D("MAT_FORM_FIELD_DEFAULT_OPTIONS"),eS="fill",tA="auto",tS="fixed",nA="translateY(-50%)",zr=(()=>{class t{_elementRef=p(q);_changeDetectorRef=p(He);_platform=p(Pe);_idGenerator=p(Qe);_ngZone=p(X);_defaults=p(eA,{optional:!0});_currentDirection;_unwrapMaybeSignal(e){return dn(e)?e():e}_textField;_iconPrefixContainer;_textPrefixContainer;_iconSuffixContainer;_textSuffixContainer;_floatingLabel;_notchedOutline;_lineRipple;_iconPrefixContainerSignal=Bn("iconPrefixContainer");_textPrefixContainerSignal=Bn("textPrefixContainer");_iconSuffixContainerSignal=Bn("iconSuffixContainer");_textSuffixContainerSignal=Bn("textSuffixContainer");_prefixSuffixContainers=P(()=>[this._iconPrefixContainerSignal(),this._textPrefixContainerSignal(),this._iconSuffixContainerSignal(),this._textSuffixContainerSignal()].map(e=>e?.nativeElement).filter(e=>e!==void 0));_formFieldControl;_prefixChildren;_suffixChildren;_errorChildren;_hintChildren;_labelChild=Z0(mg);get hideRequiredMarker(){return this._hideRequiredMarker}set hideRequiredMarker(e){this._hideRequiredMarker=Ji(e)}_hideRequiredMarker=!1;color="primary";get floatLabel(){return this._floatLabel||this._defaults?.floatLabel||tA}set floatLabel(e){e!==this._floatLabel&&(this._floatLabel=e,this._changeDetectorRef.markForCheck())}_floatLabel;get appearance(){return this._appearanceSignal()}set appearance(e){let i=e||this._defaults?.appearance||eS;this._appearanceSignal.set(i)}_appearanceSignal=G(eS);get subscriptSizing(){return this._subscriptSizing||this._defaults?.subscriptSizing||tS}set subscriptSizing(e){this._subscriptSizing=e||this._defaults?.subscriptSizing||tS}_subscriptSizing=null;get hintLabel(){return this._hintLabel}set hintLabel(e){this._hintLabel=e,this._processHints()}_hintLabel="";_hasIconPrefix=!1;_hasTextPrefix=!1;_hasIconSuffix=!1;_hasTextSuffix=!1;_labelId=this._idGenerator.getId("mat-mdc-form-field-label-");_hintLabelId=this._idGenerator.getId("mat-mdc-hint-");_describedByIds;get _control(){return this._explicitFormFieldControl||this._formFieldControl}set _control(e){this._explicitFormFieldControl=e}_destroyed=new B;_isFocused=null;_explicitFormFieldControl;_previousControl=null;_previousControlValidatorFn=null;_stateChanges;_valueChanges;_describedByChanges;_outlineLabelOffsetResizeObserver=null;_animationsDisabled=qe();constructor(){let e=this._defaults,i=p(ft);e&&(e.appearance&&(this.appearance=e.appearance),this._hideRequiredMarker=!!e?.hideRequiredMarker,e.color&&(this.color=e.color)),lt(()=>this._currentDirection=i.valueSignal()),this._syncOutlineLabelOffset()}ngAfterViewInit(){this._updateFocusState(),this._animationsDisabled||this._ngZone.runOutsideAngular(()=>{setTimeout(()=>{this._elementRef.nativeElement.classList.add("mat-form-field-animations-enabled")},300)}),this._changeDetectorRef.detectChanges()}ngAfterContentInit(){this._assertFormFieldControl(),this._initializeSubscript(),this._initializePrefixAndSuffix()}ngAfterContentChecked(){this._assertFormFieldControl(),this._control!==this._previousControl&&(this._initializeControl(this._previousControl),this._control.ngControl&&this._control.ngControl.control&&(this._previousControlValidatorFn=yc(this._control.ngField)?null:this._control.ngControl.control.validator),this._previousControl=this._control,this._changeDetectorRef.markForCheck()),this._control.ngControl&&this._control.ngControl.control&&!yc(this._control.ngField)&&this._control.ngControl.control.validator!==this._previousControlValidatorFn&&this._changeDetectorRef.markForCheck()}ngOnDestroy(){this._outlineLabelOffsetResizeObserver?.disconnect(),this._stateChanges?.unsubscribe(),this._valueChanges?.unsubscribe(),this._describedByChanges?.unsubscribe(),this._destroyed.next(),this._destroyed.complete()}getLabelId=P(()=>this._hasFloatingLabel()?this._labelId:null);getConnectedOverlayOrigin(){return this._textField||this._elementRef}_animateAndLockLabel(){this._hasFloatingLabel()&&(this.floatLabel="always")}_initializeControl(e){let i=this._control,o="mat-mdc-form-field-type-";e&&this._elementRef.nativeElement.classList.remove(o+e.controlType),i.controlType&&this._elementRef.nativeElement.classList.add(o+i.controlType),this._stateChanges?.unsubscribe(),this._stateChanges=i.stateChanges?.subscribe(()=>{this._updateFocusState(),this._changeDetectorRef.markForCheck()}),this._describedByChanges?.unsubscribe(),this._describedByChanges=i.stateChanges?.pipe(st([void 0,void 0]),je(()=>[this._unwrapMaybeSignal(i.errorState),i.userAriaDescribedBy]),vl(),Ze(([[a,r],[s,c]])=>a!==s||r!==c)).subscribe(()=>this._syncDescribedByIds()),this._valueChanges?.unsubscribe(),i.ngControl&&i.ngControl.valueChanges&&!yc(i.ngField)&&(this._valueChanges=i.ngControl.valueChanges.pipe(Re(this._destroyed)).subscribe(()=>this._changeDetectorRef.markForCheck()))}_checkPrefixAndSuffixTypes(){this._hasIconPrefix=!!this._prefixChildren.find(e=>!e._isText),this._hasTextPrefix=!!this._prefixChildren.find(e=>e._isText),this._hasIconSuffix=!!this._suffixChildren.find(e=>!e._isText),this._hasTextSuffix=!!this._suffixChildren.find(e=>e._isText)}_initializePrefixAndSuffix(){this._checkPrefixAndSuffixTypes(),bt(this._prefixChildren.changes,this._suffixChildren.changes).subscribe(()=>{this._checkPrefixAndSuffixTypes(),this._changeDetectorRef.markForCheck()})}_initializeSubscript(){this._hintChildren.changes.subscribe(()=>{this._processHints(),this._changeDetectorRef.markForCheck()}),this._errorChildren.changes.subscribe(()=>{this._syncDescribedByIds(),this._changeDetectorRef.markForCheck()}),this._validateHints(),this._syncDescribedByIds()}_assertFormFieldControl(){this._control}_updateFocusState(){let e=this._unwrapMaybeSignal(this._control.focused);e&&!this._isFocused?(this._isFocused=!0,this._lineRipple?.activate()):!e&&(this._isFocused||this._isFocused===null)&&(this._isFocused=!1,this._lineRipple?.deactivate()),this._elementRef.nativeElement.classList.toggle("mat-focused",e),this._textField?.nativeElement.classList.toggle("mdc-text-field--focused",e)}_syncOutlineLabelOffset(){fh({earlyRead:()=>{if(this._appearanceSignal()!=="outline")return this._outlineLabelOffsetResizeObserver?.disconnect(),null;if(globalThis.ResizeObserver){this._outlineLabelOffsetResizeObserver||=new globalThis.ResizeObserver(()=>{this._writeOutlinedLabelStyles(this._getOutlinedLabelOffset())});for(let e of this._prefixSuffixContainers())this._outlineLabelOffsetResizeObserver.observe(e,{box:"border-box"})}return this._getOutlinedLabelOffset()},write:e=>this._writeOutlinedLabelStyles(e())})}_shouldAlwaysFloat(){return this.floatLabel==="always"}_hasOutline(){return this.appearance==="outline"}_forceDisplayInfixLabel(){return!this._platform.isBrowser&&this._prefixChildren.length&&!this._shouldLabelFloat()}_hasFloatingLabel=P(()=>!!this._labelChild());_shouldLabelFloat(){return this._hasFloatingLabel()?this._shouldAlwaysFloat()||this._unwrapMaybeSignal(this._control.shouldLabelFloat):!1}_shouldForward(e){let i=this._control?.ngField||this._control?.ngControl;if(!i)return!1;if(yc(i)){let o=i();return e==="valid"?o.valid():e==="dirty"?o.dirty():e==="touched"?o.touched():e==="pending"?o.pending():e==="untouched"?!o.touched():e==="pristine"?!o.dirty():e==="invalid"?!o.valid():!1}else{let o=i;return e==="valid"?o.valid:e==="dirty"?o.dirty:e==="touched"?o.touched:e==="pending"?o.pending:e==="untouched"?o.untouched:e==="pristine"?o.pristine:e==="invalid"?o.invalid:!1}}_getSubscriptMessageType(){return this._errorChildren&&this._errorChildren.length>0&&this._unwrapMaybeSignal(this._control.errorState)?"error":"hint"}_handleLabelResized(){this._refreshOutlineNotchWidth()}_refreshOutlineNotchWidth(){!this._hasOutline()||!this._floatingLabel||!this._shouldLabelFloat()?this._notchedOutline?._setNotchWidth(0):this._notchedOutline?._setNotchWidth(this._floatingLabel.getWidth())}_processHints(){this._validateHints(),this._syncDescribedByIds()}_validateHints(){this._hintChildren}_syncDescribedByIds(){if(this._control){let e=[];if(this._control.userAriaDescribedBy&&typeof this._control.userAriaDescribedBy=="string"&&e.push(...this._control.userAriaDescribedBy.split(" ")),this._getSubscriptMessageType()==="hint"){let a=this._hintChildren?this._hintChildren.find(s=>s.align==="start"):null,r=this._hintChildren?this._hintChildren.find(s=>s.align==="end"):null;a?e.push(a.id):this._hintLabel&&e.push(this._hintLabelId),r&&e.push(r.id)}else this._errorChildren&&e.push(...this._errorChildren.map(a=>a.id));let i=this._control.describedByIds,o;if(i){let a=this._describedByIds||e;o=e.concat(i.filter(r=>r&&!a.includes(r)))}else o=e;this._control.setDescribedByIds(o),this._describedByIds=e}}_getOutlinedLabelOffset(){if(!this._hasOutline()||!this._floatingLabel)return null;if(!this._iconPrefixContainer&&!this._textPrefixContainer)return["",null];if(!this._isAttachedToDom())return null;let e=this._iconPrefixContainer?.nativeElement,i=this._textPrefixContainer?.nativeElement,o=this._iconSuffixContainer?.nativeElement,a=this._textSuffixContainer?.nativeElement,r=e?.getBoundingClientRect().width??0,s=i?.getBoundingClientRect().width??0,c=o?.getBoundingClientRect().width??0,d=a?.getBoundingClientRect().width??0,l=this._currentDirection==="rtl"?"-1":"1",m=`${r+s}px`,g=`calc(${l} * (${m} + var(--mat-mdc-form-field-label-offset-x, 0px)))`,y=`var(--mat-mdc-form-field-label-transform, ${nA} translateX(${g}))`,_=r+s+c+d;return[y,_]}_writeOutlinedLabelStyles(e){if(e!==null){let[i,o]=e;this._floatingLabel&&(this._floatingLabel.element.style.transform=i),o!==null&&this._notchedOutline?._setMaxWidth(o)}}_isAttachedToDom(){let e=this._elementRef.nativeElement;if(e.getRootNode){let i=e.getRootNode();return i&&i!==e}return document.documentElement.contains(e)}static \u0275fac=function(i){return new(i||t)};static \u0275cmp=(function(){let e=["iconPrefixContainer"],i=["textPrefixContainer"],o=["iconSuffixContainer"],a=["textSuffixContainer"],r=["textField"],s=["*",[["mat-label"]],[["","matPrefix",""],["","matIconPrefix",""]],[["","matTextPrefix",""]],[["","matTextSuffix",""]],[["","matSuffix",""],["","matIconSuffix",""]],[["mat-error"],["","matError",""]],[["mat-hint",3,"align","end"]],[["mat-hint","align","end"]]],c=["*","mat-label","[matPrefix], [matIconPrefix]","[matTextPrefix]","[matTextSuffix]","[matSuffix], [matIconSuffix]","mat-error, [matError]","mat-hint:not([align='end'])","mat-hint[align='end']"];function d(ue,$){ue&1&&A(0,"span",21)}function l(ue,$){if(ue&1&&(f(0,"label",20),oe(1,1),k(2,d,1,0,"span",21),u()),ue&2){let M=x(2);R("floating",M._shouldLabelFloat())("monitorResize",M._hasOutline())("id",M._labelId),Q("for",M._control.disableAutomaticLabeling?null:M._control.id),h(2),N(!M.hideRequiredMarker&&M._unwrapMaybeSignal(M._control.required)?2:-1)}}function m(ue,$){if(ue&1&&k(0,l,3,5,"label",20),ue&2){let M=x();N(M._hasFloatingLabel()?0:-1)}}function v(ue,$){ue&1&&A(0,"div",7)}function g(ue,$){}function y(ue,$){if(ue&1&&tn(0,g,0,0,"ng-template",13),ue&2){x(2);let M=nn(1);R("ngTemplateOutlet",M)}}function _(ue,$){if(ue&1&&(f(0,"div",9),k(1,y,1,1,null,13),u()),ue&2){let M=x();R("matFormFieldNotchedOutlineOpen",M._shouldLabelFloat()),h(),N(M._forceDisplayInfixLabel()?-1:1)}}function C(ue,$){ue&1&&(f(0,"div",10,2),oe(2,2),u())}function w(ue,$){ue&1&&(f(0,"div",11,3),oe(2,3),u())}function E(ue,$){}function U(ue,$){if(ue&1&&tn(0,E,0,0,"ng-template",13),ue&2){x();let M=nn(1);R("ngTemplateOutlet",M)}}function F(ue,$){ue&1&&(f(0,"div",14,4),oe(2,4),u())}function j(ue,$){ue&1&&(f(0,"div",15,5),oe(2,5),u())}function Ie(ue,$){ue&1&&A(0,"div",16)}function tt(ue,$){ue&1&&(f(0,"div",18),oe(1,6),u())}function vn(ue,$){if(ue&1&&(f(0,"mat-hint",22),b(1),u()),ue&2){let M=x(2);R("id",M._hintLabelId),h(),S(M.hintLabel)}}function Pt(ue,$){if(ue&1&&(f(0,"div",19),k(1,vn,2,2,"mat-hint",22),oe(2,7),A(3,"div",23),oe(4,8),u()),ue&2){let M=x();h(),N(M.hintLabel?1:-1)}}return H({type:t,selectors:[["mat-form-field"]],contentQueries:function($,M,pe){if($&1&&(kd(pe,M._labelChild,mg,5),Mt(pe,xc,5)(pe,nS,5)(pe,Q1,5)(pe,X1,5)(pe,pg,5)),$&2){Ci();let ne;Y(ne=Z())&&(M._formFieldControl=ne.first),Y(ne=Z())&&(M._prefixChildren=ne),Y(ne=Z())&&(M._suffixChildren=ne),Y(ne=Z())&&(M._errorChildren=ne),Y(ne=Z())&&(M._hintChildren=ne)}},viewQuery:function($,M){if($&1&&(xi(M._iconPrefixContainerSignal,e,5)(M._textPrefixContainerSignal,i,5)(M._iconSuffixContainerSignal,o,5)(M._textSuffixContainerSignal,a,5),ot(r,5)(e,5)(i,5)(o,5)(a,5)(KC,5)(JC,5)(QC,5)),$&2){Ci(4);let pe;Y(pe=Z())&&(M._textField=pe.first),Y(pe=Z())&&(M._iconPrefixContainer=pe.first),Y(pe=Z())&&(M._textPrefixContainer=pe.first),Y(pe=Z())&&(M._iconSuffixContainer=pe.first),Y(pe=Z())&&(M._textSuffixContainer=pe.first),Y(pe=Z())&&(M._floatingLabel=pe.first),Y(pe=Z())&&(M._notchedOutline=pe.first),Y(pe=Z())&&(M._lineRipple=pe.first)}},hostAttrs:[1,"mat-mdc-form-field"],hostVars:38,hostBindings:function($,M){$&2&&z("mat-mdc-form-field-label-always-float",M._shouldAlwaysFloat())("mat-mdc-form-field-has-icon-prefix",M._hasIconPrefix)("mat-mdc-form-field-has-icon-suffix",M._hasIconSuffix)("mat-form-field-invalid",M._unwrapMaybeSignal(M._control.errorState))("mat-form-field-disabled",M._unwrapMaybeSignal(M._control.disabled))("mat-form-field-autofilled",M._unwrapMaybeSignal(M._control.autofilled))("mat-form-field-appearance-fill",M.appearance=="fill")("mat-form-field-appearance-outline",M.appearance=="outline")("mat-form-field-hide-placeholder",M._hasFloatingLabel()&&!M._shouldLabelFloat())("mat-primary",M.color!=="accent"&&M.color!=="warn")("mat-accent",M.color==="accent")("mat-warn",M.color==="warn")("ng-untouched",M._shouldForward("untouched"))("ng-touched",M._shouldForward("touched"))("ng-pristine",M._shouldForward("pristine"))("ng-dirty",M._shouldForward("dirty"))("ng-valid",M._shouldForward("valid"))("ng-invalid",M._shouldForward("invalid"))("ng-pending",M._shouldForward("pending"))},inputs:{hideRequiredMarker:"hideRequiredMarker",color:"color",floatLabel:"floatLabel",appearance:"appearance",subscriptSizing:"subscriptSizing",hintLabel:"hintLabel"},exportAs:["matFormField"],features:[ze([{provide:Fa,useExisting:t},{provide:iS,useExisting:t}])],ngContentSelectors:c,decls:18,vars:21,consts:[["labelTemplate",""],["textField",""],["iconPrefixContainer",""],["textPrefixContainer",""],["textSuffixContainer",""],["iconSuffixContainer",""],[1,"mat-mdc-text-field-wrapper","mdc-text-field",3,"click"],[1,"mat-mdc-form-field-focus-overlay"],[1,"mat-mdc-form-field-flex"],["matFormFieldNotchedOutline","",3,"matFormFieldNotchedOutlineOpen"],[1,"mat-mdc-form-field-icon-prefix"],[1,"mat-mdc-form-field-text-prefix"],[1,"mat-mdc-form-field-infix"],[3,"ngTemplateOutlet"],[1,"mat-mdc-form-field-text-suffix"],[1,"mat-mdc-form-field-icon-suffix"],["matFormFieldLineRipple",""],["aria-atomic","true","aria-live","polite",1,"mat-mdc-form-field-subscript-wrapper","mat-mdc-form-field-bottom-align"],[1,"mat-mdc-form-field-error-wrapper"],[1,"mat-mdc-form-field-hint-wrapper"],["matFormFieldFloatingLabel","",3,"floating","monitorResize","id"],["aria-hidden","true",1,"mat-mdc-form-field-required-marker","mdc-floating-label--required"],[3,"id"],[1,"mat-mdc-form-field-hint-spacer"]],template:function($,M){if($&1&&(Be(s),tn(0,m,1,1,"ng-template",null,0,ch),f(2,"div",6,1),V("click",function(ne){return M._control.onContainerClick(ne)}),k(4,v,1,0,"div",7),f(5,"div",8),k(6,_,2,2,"div",9),k(7,C,3,0,"div",10),k(8,w,3,0,"div",11),f(9,"div",12),k(10,U,1,1,null,13),oe(11),u(),k(12,F,3,0,"div",14),k(13,j,3,0,"div",15),u(),k(14,Ie,1,0,"div",16),u(),f(15,"div",17),k(16,tt,2,0,"div",18)(17,Pt,5,1,"div",19),u()),$&2){let pe,ne=M._unwrapMaybeSignal(M._control.disabled);h(2),z("mdc-text-field--filled",!M._hasOutline())("mdc-text-field--outlined",M._hasOutline())("mdc-text-field--no-label",!M._hasFloatingLabel())("mdc-text-field--disabled",ne)("mdc-text-field--invalid",M._unwrapMaybeSignal(M._control.errorState)),h(2),N(!M._hasOutline()&&!ne?4:-1),h(2),N(M._hasOutline()?6:-1),h(),N(M._hasIconPrefix?7:-1),h(),N(M._hasTextPrefix?8:-1),h(2),N(!M._hasOutline()||M._forceDisplayInfixLabel()?10:-1),h(2),N(M._hasTextSuffix?12:-1),h(),N(M._hasIconSuffix?13:-1),h(),N(M._hasOutline()?-1:14),h(),z("mat-mdc-form-field-subscript-dynamic-size",M.subscriptSizing==="dynamic");let Se=M._getSubscriptMessageType();h(),N((pe=Se)==="error"?16:pe==="hint"?17:-1)}},dependencies:[KC,JC,gh,QC,pg],styles:[`.mdc-text-field {
  display: inline-flex;
  align-items: baseline;
  padding: 0 16px;
  position: relative;
  box-sizing: border-box;
  overflow: hidden;
  will-change: opacity, transform, color;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
  border-bottom-right-radius: 0;
  border-bottom-left-radius: 0;
}

.mdc-text-field__input {
  width: 100%;
  min-width: 0;
  border: none;
  border-radius: 0;
  background: none;
  padding: 0;
  -moz-appearance: none;
  -webkit-appearance: none;
  height: 28px;
}
.mdc-text-field__input::-webkit-calendar-picker-indicator, .mdc-text-field__input::-webkit-search-cancel-button {
  display: none;
}
.mdc-text-field__input::-ms-clear {
  display: none;
}
.mdc-text-field__input:focus {
  outline: none;
}
.mdc-text-field__input:invalid {
  box-shadow: none;
}
.mdc-text-field__input::placeholder {
  opacity: 0;
}
.mdc-text-field__input::-moz-placeholder {
  opacity: 0;
}
.mdc-text-field__input::-webkit-input-placeholder {
  opacity: 0;
}
.mdc-text-field__input:-ms-input-placeholder {
  opacity: 0;
}
.mdc-text-field--no-label .mdc-text-field__input::placeholder, .mdc-text-field--focused .mdc-text-field__input::placeholder {
  opacity: 1;
}
.mdc-text-field--no-label .mdc-text-field__input::-moz-placeholder, .mdc-text-field--focused .mdc-text-field__input::-moz-placeholder {
  opacity: 1;
}
.mdc-text-field--no-label .mdc-text-field__input::-webkit-input-placeholder, .mdc-text-field--focused .mdc-text-field__input::-webkit-input-placeholder {
  opacity: 1;
}
.mdc-text-field--no-label .mdc-text-field__input:-ms-input-placeholder, .mdc-text-field--focused .mdc-text-field__input:-ms-input-placeholder {
  opacity: 1;
}
.mdc-text-field--%NS%disabled:not(.mdc-text-field--no-label) .mdc-text-field__input.mat-mdc-input-disabled-interactive::placeholder {
  opacity: 0;
}
.mdc-text-field--%NS%disabled:not(.mdc-text-field--no-label) .mdc-text-field__input.mat-mdc-input-disabled-interactive::-moz-placeholder {
  opacity: 0;
}
.mdc-text-field--%NS%disabled:not(.mdc-text-field--no-label) .mdc-text-field__input.mat-mdc-input-disabled-interactive::-webkit-input-placeholder {
  opacity: 0;
}
.mdc-text-field--%NS%disabled:not(.mdc-text-field--no-label) .mdc-text-field__input.mat-mdc-input-disabled-interactive:-ms-input-placeholder {
  opacity: 0;
}
.mdc-text-field--outlined .mdc-text-field__input, .mdc-text-field--filled.mdc-text-field--no-label .mdc-text-field__input {
  height: 100%;
}
.mdc-text-field--outlined .mdc-text-field__input {
  display: flex;
  border: none !important;
  background-color: transparent;
}
.mdc-text-field--disabled .mdc-text-field__input {
  pointer-events: auto;
}
.mdc-text-field--%NS%filled:not(.mdc-text-field--disabled) .mdc-text-field__input {
  color: var(--%NS%mat-form-field-filled-input-text-color, var(--%NS%mat-sys-on-surface));
  caret-color: var(--%NS%mat-form-field-filled-caret-color, var(--%NS%mat-sys-primary));
}
.mdc-text-field--%NS%filled:not(.mdc-text-field--disabled) .mdc-text-field__input::placeholder {
  color: var(--%NS%mat-form-field-filled-input-text-placeholder-color, var(--%NS%mat-sys-on-surface-variant));
}
.mdc-text-field--%NS%filled:not(.mdc-text-field--disabled) .mdc-text-field__input::-moz-placeholder {
  color: var(--%NS%mat-form-field-filled-input-text-placeholder-color, var(--%NS%mat-sys-on-surface-variant));
}
.mdc-text-field--%NS%filled:not(.mdc-text-field--disabled) .mdc-text-field__input::-webkit-input-placeholder {
  color: var(--%NS%mat-form-field-filled-input-text-placeholder-color, var(--%NS%mat-sys-on-surface-variant));
}
.mdc-text-field--%NS%filled:not(.mdc-text-field--disabled) .mdc-text-field__input:-ms-input-placeholder {
  color: var(--%NS%mat-form-field-filled-input-text-placeholder-color, var(--%NS%mat-sys-on-surface-variant));
}
.mdc-text-field--%NS%outlined:not(.mdc-text-field--disabled) .mdc-text-field__input {
  color: var(--%NS%mat-form-field-outlined-input-text-color, var(--%NS%mat-sys-on-surface));
  caret-color: var(--%NS%mat-form-field-outlined-caret-color, var(--%NS%mat-sys-primary));
}
.mdc-text-field--%NS%outlined:not(.mdc-text-field--disabled) .mdc-text-field__input::placeholder {
  color: var(--%NS%mat-form-field-outlined-input-text-placeholder-color, var(--%NS%mat-sys-on-surface-variant));
}
.mdc-text-field--%NS%outlined:not(.mdc-text-field--disabled) .mdc-text-field__input::-moz-placeholder {
  color: var(--%NS%mat-form-field-outlined-input-text-placeholder-color, var(--%NS%mat-sys-on-surface-variant));
}
.mdc-text-field--%NS%outlined:not(.mdc-text-field--disabled) .mdc-text-field__input::-webkit-input-placeholder {
  color: var(--%NS%mat-form-field-outlined-input-text-placeholder-color, var(--%NS%mat-sys-on-surface-variant));
}
.mdc-text-field--%NS%outlined:not(.mdc-text-field--disabled) .mdc-text-field__input:-ms-input-placeholder {
  color: var(--%NS%mat-form-field-outlined-input-text-placeholder-color, var(--%NS%mat-sys-on-surface-variant));
}
.mdc-text-field--filled.mdc-text-field--%NS%invalid:not(.mdc-text-field--disabled) .mdc-text-field__input {
  caret-color: var(--%NS%mat-form-field-filled-error-caret-color, var(--%NS%mat-sys-error));
}
.mdc-text-field--outlined.mdc-text-field--%NS%invalid:not(.mdc-text-field--disabled) .mdc-text-field__input {
  caret-color: var(--%NS%mat-form-field-outlined-error-caret-color, var(--%NS%mat-sys-error));
}
.mdc-text-field--filled.mdc-text-field--disabled .mdc-text-field__input {
  color: var(--%NS%mat-form-field-filled-disabled-input-text-color, color-mix(in srgb, var(--%NS%mat-sys-on-surface) 38%, transparent));
}
.mdc-text-field--outlined.mdc-text-field--disabled .mdc-text-field__input {
  color: var(--%NS%mat-form-field-outlined-disabled-input-text-color, color-mix(in srgb, var(--%NS%mat-sys-on-surface) 38%, transparent));
}
@media (forced-colors: active) {
  .mdc-text-field--disabled .mdc-text-field__input {
    background-color: Window;
  }
}

.mdc-text-field--filled {
  height: 56px;
  border-bottom-right-radius: 0;
  border-bottom-left-radius: 0;
  border-top-left-radius: var(--%NS%mat-form-field-filled-container-shape, var(--%NS%mat-sys-corner-extra-small));
  border-top-right-radius: var(--%NS%mat-form-field-filled-container-shape, var(--%NS%mat-sys-corner-extra-small));
}
.mdc-text-field--%NS%filled:not(.mdc-text-field--disabled) {
  background-color: var(--%NS%mat-form-field-filled-container-color, var(--%NS%mat-sys-surface-variant));
}
.mdc-text-field--filled.mdc-text-field--disabled {
  background-color: var(--%NS%mat-form-field-filled-disabled-container-color, color-mix(in srgb, var(--%NS%mat-sys-on-surface) 4%, transparent));
}

.mdc-text-field--outlined {
  height: 56px;
  overflow: visible;
  padding-right: max(16px, var(--%NS%mat-form-field-outlined-container-shape, var(--%NS%mat-sys-corner-extra-small)));
  padding-left: max(16px, var(--%NS%mat-form-field-outlined-container-shape, var(--%NS%mat-sys-corner-extra-small)) + 4px);
}
[dir=rtl] .mdc-text-field--outlined {
  padding-right: max(16px, var(--%NS%mat-form-field-outlined-container-shape, var(--%NS%mat-sys-corner-extra-small)) + 4px);
  padding-left: max(16px, var(--%NS%mat-form-field-outlined-container-shape, var(--%NS%mat-sys-corner-extra-small)));
}

.mdc-floating-label {
  position: absolute;
  left: 0;
  transform-origin: left top;
  line-height: 1.15rem;
  text-align: left;
  text-overflow: ellipsis;
  white-space: nowrap;
  cursor: text;
  overflow: hidden;
  will-change: transform;
}
[dir=rtl] .mdc-floating-label {
  right: 0;
  left: auto;
  transform-origin: right top;
  text-align: right;
}
.mdc-text-field .mdc-floating-label {
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
}
.mdc-notched-outline .mdc-floating-label {
  display: inline-block;
  position: relative;
  max-width: 100%;
}
.mdc-text-field--outlined .mdc-floating-label {
  left: 4px;
  right: auto;
}
[dir=rtl] .mdc-text-field--outlined .mdc-floating-label {
  left: auto;
  right: 4px;
}
.mdc-text-field--filled .mdc-floating-label {
  left: 16px;
  right: auto;
}
[dir=rtl] .mdc-text-field--filled .mdc-floating-label {
  left: auto;
  right: 16px;
}
.mdc-text-field--disabled .mdc-floating-label {
  cursor: default;
}
@media (forced-colors: active) {
  .mdc-text-field--disabled .mdc-floating-label {
    z-index: 1;
  }
}
.mdc-text-field--filled.mdc-text-field--no-label .mdc-floating-label {
  display: none;
}
.mdc-text-field--%NS%filled:not(.mdc-text-field--disabled) .mdc-floating-label {
  color: var(--%NS%mat-form-field-filled-label-text-color, var(--%NS%mat-sys-on-surface-variant));
}
.mdc-text-field--%NS%filled:not(.mdc-text-field--disabled).mdc-text-field--focused .mdc-floating-label {
  color: var(--%NS%mat-form-field-filled-focus-label-text-color, var(--%NS%mat-sys-primary));
}
.mdc-text-field--%NS%filled:not(.mdc-text-field--disabled):not(.mdc-text-field--focused):hover .mdc-floating-label {
  color: var(--%NS%mat-form-field-filled-hover-label-text-color, var(--%NS%mat-sys-on-surface-variant));
}
.mdc-text-field--filled.mdc-text-field--disabled .mdc-floating-label {
  color: var(--%NS%mat-form-field-filled-disabled-label-text-color, color-mix(in srgb, var(--%NS%mat-sys-on-surface) 38%, transparent));
}
.mdc-text-field--%NS%filled:not(.mdc-text-field--disabled).mdc-text-field--invalid .mdc-floating-label {
  color: var(--%NS%mat-form-field-filled-error-label-text-color, var(--%NS%mat-sys-error));
}
.mdc-text-field--%NS%filled:not(.mdc-text-field--disabled).mdc-text-field--invalid.mdc-text-field--focused .mdc-floating-label {
  color: var(--%NS%mat-form-field-filled-error-focus-label-text-color, var(--%NS%mat-sys-error));
}
.mdc-text-field--%NS%filled:not(.mdc-text-field--disabled).mdc-text-field--%NS%invalid:not(.mdc-text-field--disabled):hover .mdc-floating-label {
  color: var(--%NS%mat-form-field-filled-error-hover-label-text-color, var(--%NS%mat-sys-on-error-container));
}
.mdc-text-field--filled .mdc-floating-label {
  font-family: var(--%NS%mat-form-field-filled-label-text-font, var(--%NS%mat-sys-body-large-font));
  font-size: var(--%NS%mat-form-field-filled-label-text-size, var(--%NS%mat-sys-body-large-size));
  font-weight: var(--%NS%mat-form-field-filled-label-text-weight, var(--%NS%mat-sys-body-large-weight));
  letter-spacing: var(--%NS%mat-form-field-filled-label-text-tracking, var(--%NS%mat-sys-body-large-tracking));
}
.mdc-text-field--%NS%outlined:not(.mdc-text-field--disabled) .mdc-floating-label {
  color: var(--%NS%mat-form-field-outlined-label-text-color, var(--%NS%mat-sys-on-surface-variant));
}
.mdc-text-field--%NS%outlined:not(.mdc-text-field--disabled).mdc-text-field--focused .mdc-floating-label {
  color: var(--%NS%mat-form-field-outlined-focus-label-text-color, var(--%NS%mat-sys-primary));
}
.mdc-text-field--%NS%outlined:not(.mdc-text-field--disabled):not(.mdc-text-field--focused):hover .mdc-floating-label {
  color: var(--%NS%mat-form-field-outlined-hover-label-text-color, var(--%NS%mat-sys-on-surface));
}
.mdc-text-field--outlined.mdc-text-field--disabled .mdc-floating-label {
  color: var(--%NS%mat-form-field-outlined-disabled-label-text-color, color-mix(in srgb, var(--%NS%mat-sys-on-surface) 38%, transparent));
}
.mdc-text-field--%NS%outlined:not(.mdc-text-field--disabled).mdc-text-field--invalid .mdc-floating-label {
  color: var(--%NS%mat-form-field-outlined-error-label-text-color, var(--%NS%mat-sys-error));
}
.mdc-text-field--%NS%outlined:not(.mdc-text-field--disabled).mdc-text-field--invalid.mdc-text-field--focused .mdc-floating-label {
  color: var(--%NS%mat-form-field-outlined-error-focus-label-text-color, var(--%NS%mat-sys-error));
}
.mdc-text-field--%NS%outlined:not(.mdc-text-field--disabled).mdc-text-field--%NS%invalid:not(.mdc-text-field--disabled):hover .mdc-floating-label {
  color: var(--%NS%mat-form-field-outlined-error-hover-label-text-color, var(--%NS%mat-sys-on-error-container));
}
.mdc-text-field--outlined .mdc-floating-label {
  font-family: var(--%NS%mat-form-field-outlined-label-text-font, var(--%NS%mat-sys-body-large-font));
  font-size: var(--%NS%mat-form-field-outlined-label-text-size, var(--%NS%mat-sys-body-large-size));
  font-weight: var(--%NS%mat-form-field-outlined-label-text-weight, var(--%NS%mat-sys-body-large-weight));
  letter-spacing: var(--%NS%mat-form-field-outlined-label-text-tracking, var(--%NS%mat-sys-body-large-tracking));
}

.mdc-floating-label--float-above {
  cursor: auto;
  transform: translateY(-106%) scale(0.75);
}
.mdc-text-field--filled .mdc-floating-label--float-above {
  transform: translateY(-106%) scale(0.75);
}
.mdc-text-field--outlined .mdc-floating-label--float-above {
  transform: translateY(-37.25px) scale(1);
  font-size: 0.75rem;
}
.mdc-notched-outline .mdc-floating-label--float-above {
  text-overflow: clip;
}
.mdc-notched-outline--upgraded .mdc-floating-label--float-above {
  max-width: 133.3333333333%;
}
.mdc-text-field--outlined.mdc-notched-outline--upgraded .mdc-floating-label--float-above, .mdc-text-field--outlined .mdc-notched-outline--upgraded .mdc-floating-label--float-above {
  transform: translateY(-34.75px) scale(0.75);
}
.mdc-text-field--outlined.mdc-notched-outline--upgraded .mdc-floating-label--float-above, .mdc-text-field--outlined .mdc-notched-outline--upgraded .mdc-floating-label--float-above {
  font-size: 1rem;
}

.mdc-floating-label--%NS%required:not(.mdc-floating-label--hide-required-marker)::after {
  margin-left: 1px;
  margin-right: 0;
  content: "*";
}
[dir=rtl] .mdc-floating-label--%NS%required:not(.mdc-floating-label--hide-required-marker)::after {
  margin-left: 0;
  margin-right: 1px;
}

.mdc-notched-outline {
  display: flex;
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  box-sizing: border-box;
  width: 100%;
  max-width: 100%;
  height: 100%;
  text-align: left;
  pointer-events: none;
}
[dir=rtl] .mdc-notched-outline {
  text-align: right;
}
.mdc-text-field--outlined .mdc-notched-outline {
  z-index: 1;
}

.mat-mdc-notch-piece {
  box-sizing: border-box;
  height: 100%;
  pointer-events: none;
  border: none;
  border-top: 1px solid;
  border-bottom: 1px solid;
}
.mdc-text-field--focused .mat-mdc-notch-piece {
  border-width: 2px;
}
.mdc-text-field--%NS%outlined:not(.mdc-text-field--disabled) .mat-mdc-notch-piece {
  border-color: var(--%NS%mat-form-field-outlined-outline-color, var(--%NS%mat-sys-outline));
  border-width: var(--%NS%mat-form-field-outlined-outline-width, 1px);
}
.mdc-text-field--%NS%outlined:not(.mdc-text-field--disabled):not(.mdc-text-field--focused):hover .mat-mdc-notch-piece {
  border-color: var(--%NS%mat-form-field-outlined-hover-outline-color, var(--%NS%mat-sys-on-surface));
}
.mdc-text-field--%NS%outlined:not(.mdc-text-field--disabled).mdc-text-field--focused .mat-mdc-notch-piece {
  border-color: var(--%NS%mat-form-field-outlined-focus-outline-color, var(--%NS%mat-sys-primary));
}
.mdc-text-field--outlined.mdc-text-field--disabled .mat-mdc-notch-piece {
  border-color: var(--%NS%mat-form-field-outlined-disabled-outline-color, color-mix(in srgb, var(--%NS%mat-sys-on-surface) 12%, transparent));
}
.mdc-text-field--%NS%outlined:not(.mdc-text-field--disabled).mdc-text-field--invalid .mat-mdc-notch-piece {
  border-color: var(--%NS%mat-form-field-outlined-error-outline-color, var(--%NS%mat-sys-error));
}
.mdc-text-field--%NS%outlined:not(.mdc-text-field--disabled).mdc-text-field--%NS%invalid:not(.mdc-text-field--focused):hover .mdc-notched-outline .mat-mdc-notch-piece {
  border-color: var(--%NS%mat-form-field-outlined-error-hover-outline-color, var(--%NS%mat-sys-on-error-container));
}
.mdc-text-field--%NS%outlined:not(.mdc-text-field--disabled).mdc-text-field--invalid.mdc-text-field--focused .mat-mdc-notch-piece {
  border-color: var(--%NS%mat-form-field-outlined-error-focus-outline-color, var(--%NS%mat-sys-error));
}
.mdc-text-field--%NS%outlined:not(.mdc-text-field--disabled).mdc-text-field--focused .mdc-notched-outline .mat-mdc-notch-piece {
  border-width: var(--%NS%mat-form-field-outlined-focus-outline-width, 2px);
}

.mdc-notched-outline__leading {
  border-left: 1px solid;
  border-right: none;
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
  border-top-left-radius: var(--%NS%mat-form-field-outlined-container-shape, var(--%NS%mat-sys-corner-extra-small));
  border-bottom-left-radius: var(--%NS%mat-form-field-outlined-container-shape, var(--%NS%mat-sys-corner-extra-small));
}
.mdc-text-field--outlined .mdc-notched-outline .mdc-notched-outline__leading {
  width: max(12px, var(--%NS%mat-form-field-outlined-container-shape, var(--%NS%mat-sys-corner-extra-small)));
}
[dir=rtl] .mdc-notched-outline__leading {
  border-left: none;
  border-right: 1px solid;
  border-bottom-left-radius: 0;
  border-top-left-radius: 0;
  border-top-right-radius: var(--%NS%mat-form-field-outlined-container-shape, var(--%NS%mat-sys-corner-extra-small));
  border-bottom-right-radius: var(--%NS%mat-form-field-outlined-container-shape, var(--%NS%mat-sys-corner-extra-small));
}

.mdc-notched-outline__trailing {
  flex-grow: 1;
  border-left: none;
  border-right: 1px solid;
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
  border-top-right-radius: var(--%NS%mat-form-field-outlined-container-shape, var(--%NS%mat-sys-corner-extra-small));
  border-bottom-right-radius: var(--%NS%mat-form-field-outlined-container-shape, var(--%NS%mat-sys-corner-extra-small));
}
[dir=rtl] .mdc-notched-outline__trailing {
  border-left: 1px solid;
  border-right: none;
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
  border-top-left-radius: var(--%NS%mat-form-field-outlined-container-shape, var(--%NS%mat-sys-corner-extra-small));
  border-bottom-left-radius: var(--%NS%mat-form-field-outlined-container-shape, var(--%NS%mat-sys-corner-extra-small));
}

.mdc-notched-outline__notch {
  flex: 0 0 auto;
  width: auto;
}
.mdc-text-field--outlined .mdc-notched-outline .mdc-notched-outline__notch {
  max-width: min(var(--%NS%mat-form-field-notch-max-width, 100%), calc(100% - max(12px, var(--%NS%mat-form-field-outlined-container-shape, var(--%NS%mat-sys-corner-extra-small))) * 2));
}
.mdc-text-field--outlined .mdc-notched-outline--notched .mdc-notched-outline__notch {
  max-width: min(100%, calc(100% - max(12px, var(--%NS%mat-form-field-outlined-container-shape, var(--%NS%mat-sys-corner-extra-small))) * 2));
}
.mdc-text-field--outlined .mdc-notched-outline--notched .mdc-notched-outline__notch {
  padding-top: 1px;
}
.mdc-text-field--focused.mdc-text-field--outlined .mdc-notched-outline--notched .mdc-notched-outline__notch {
  padding-top: 2px;
}
.mdc-notched-outline--notched .mdc-notched-outline__notch {
  padding-left: 0;
  padding-right: 8px;
  border-top: none;
}
[dir=rtl] .mdc-notched-outline--notched .mdc-notched-outline__notch {
  padding-left: 8px;
  padding-right: 0;
}
.mdc-notched-outline--no-label .mdc-notched-outline__notch {
  display: none;
}

.mdc-line-ripple::before, .mdc-line-ripple::after {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  border-bottom-style: solid;
  content: "";
}
.mdc-line-ripple::before {
  z-index: 1;
  border-bottom-width: var(--%NS%mat-form-field-filled-active-indicator-height, 1px);
}
.mdc-text-field--%NS%filled:not(.mdc-text-field--disabled) .mdc-line-ripple::before {
  border-bottom-color: var(--%NS%mat-form-field-filled-active-indicator-color, var(--%NS%mat-sys-on-surface-variant));
}
.mdc-text-field--%NS%filled:not(.mdc-text-field--disabled):not(.mdc-text-field--focused):hover .mdc-line-ripple::before {
  border-bottom-color: var(--%NS%mat-form-field-filled-hover-active-indicator-color, var(--%NS%mat-sys-on-surface));
}
.mdc-text-field--filled.mdc-text-field--disabled .mdc-line-ripple::before {
  border-bottom-color: var(--%NS%mat-form-field-filled-disabled-active-indicator-color, color-mix(in srgb, var(--%NS%mat-sys-on-surface) 38%, transparent));
}
.mdc-text-field--%NS%filled:not(.mdc-text-field--disabled).mdc-text-field--invalid .mdc-line-ripple::before {
  border-bottom-color: var(--%NS%mat-form-field-filled-error-active-indicator-color, var(--%NS%mat-sys-error));
}
.mdc-text-field--%NS%filled:not(.mdc-text-field--disabled).mdc-text-field--%NS%invalid:not(.mdc-text-field--focused):hover .mdc-line-ripple::before {
  border-bottom-color: var(--%NS%mat-form-field-filled-error-hover-active-indicator-color, var(--%NS%mat-sys-on-error-container));
}
.mdc-line-ripple::after {
  transform: scaleX(0);
  opacity: 0;
  z-index: 2;
}
.mdc-text-field--filled .mdc-line-ripple::after {
  border-bottom-width: var(--%NS%mat-form-field-filled-focus-active-indicator-height, 2px);
}
.mdc-text-field--%NS%filled:not(.mdc-text-field--disabled) .mdc-line-ripple::after {
  border-bottom-color: var(--%NS%mat-form-field-filled-focus-active-indicator-color, var(--%NS%mat-sys-primary));
}
.mdc-text-field--filled.mdc-text-field--%NS%invalid:not(.mdc-text-field--disabled) .mdc-line-ripple::after {
  border-bottom-color: var(--%NS%mat-form-field-filled-error-focus-active-indicator-color, var(--%NS%mat-sys-error));
}

.mdc-line-ripple--%NS%active::after {
  transform: scaleX(1);
  opacity: 1;
}

.mdc-line-ripple--%NS%deactivating::after {
  opacity: 0;
}

.mdc-text-field--disabled {
  pointer-events: none;
}

.mat-mdc-form-field-textarea-control {
  vertical-align: middle;
  resize: vertical;
  box-sizing: border-box;
  height: auto;
  margin: 0;
  padding: 0;
  border: none;
  overflow: auto;
}

.mat-mdc-form-field-input-control.mat-mdc-form-field-input-control {
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  font: inherit;
  letter-spacing: inherit;
  text-decoration: inherit;
  text-transform: inherit;
  border: none;
}

.mat-mdc-form-field .mat-mdc-floating-label.mdc-floating-label {
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  line-height: normal;
  pointer-events: all;
  will-change: auto;
}

.mat-mdc-form-field:not(.mat-form-field-disabled) .mat-mdc-floating-label.mdc-floating-label {
  cursor: inherit;
}

.mdc-text-field--%NS%no-label:not(.mdc-text-field--textarea) .mat-mdc-form-field-input-control.mdc-text-field__input,
.mat-mdc-text-field-wrapper .mat-mdc-form-field-input-control {
  height: auto;
}

.mat-mdc-text-field-wrapper .mat-mdc-form-field-input-control.mdc-text-field__input[type=color] {
  height: 23px;
}

.mat-mdc-text-field-wrapper {
  height: auto;
  flex: auto;
  will-change: auto;
}

.mat-mdc-form-field-has-icon-prefix .mat-mdc-text-field-wrapper {
  padding-left: 0;
  --%NS%mat-mdc-form-field-label-offset-x: -16px;
}

.mat-mdc-form-field-has-icon-suffix .mat-mdc-text-field-wrapper {
  padding-right: 0;
}

[dir=rtl] .mat-mdc-text-field-wrapper {
  padding-left: 16px;
  padding-right: 16px;
}
[dir=rtl] .mat-mdc-form-field-has-icon-suffix .mat-mdc-text-field-wrapper {
  padding-left: 0;
}
[dir=rtl] .mat-mdc-form-field-has-icon-prefix .mat-mdc-text-field-wrapper {
  padding-right: 0;
}

.mat-form-field-disabled .mdc-text-field__input::placeholder {
  color: var(--%NS%mat-form-field-disabled-input-text-placeholder-color, color-mix(in srgb, var(--%NS%mat-sys-on-surface) 38%, transparent));
}
.mat-form-field-disabled .mdc-text-field__input::-moz-placeholder {
  color: var(--%NS%mat-form-field-disabled-input-text-placeholder-color, color-mix(in srgb, var(--%NS%mat-sys-on-surface) 38%, transparent));
}
.mat-form-field-disabled .mdc-text-field__input::-webkit-input-placeholder {
  color: var(--%NS%mat-form-field-disabled-input-text-placeholder-color, color-mix(in srgb, var(--%NS%mat-sys-on-surface) 38%, transparent));
}
.mat-form-field-disabled .mdc-text-field__input:-ms-input-placeholder {
  color: var(--%NS%mat-form-field-disabled-input-text-placeholder-color, color-mix(in srgb, var(--%NS%mat-sys-on-surface) 38%, transparent));
}

.mat-mdc-form-field-label-always-float .mdc-text-field__input::placeholder {
  transition-delay: 40ms;
  transition-duration: 110ms;
  opacity: 1;
}

.mat-mdc-text-field-wrapper .mat-mdc-form-field-infix .mat-mdc-floating-label {
  left: auto;
  right: auto;
}

.mat-mdc-text-field-wrapper.mdc-text-field--outlined .mdc-text-field__input {
  display: inline-block;
}

.mat-mdc-form-field .mat-mdc-text-field-wrapper.mdc-text-field .mdc-notched-outline__notch {
  padding-top: 0;
}

.mat-mdc-form-field.mat-mdc-form-field.mat-mdc-form-field.mat-mdc-form-field.mat-mdc-form-field.mat-mdc-form-field .mdc-notched-outline__notch {
  border-left: 1px solid transparent;
}

[dir=rtl] .mat-mdc-form-field.mat-mdc-form-field.mat-mdc-form-field.mat-mdc-form-field.mat-mdc-form-field.mat-mdc-form-field .mdc-notched-outline__notch {
  border-left: none;
  border-right: 1px solid transparent;
}

.mat-mdc-form-field-infix {
  min-height: var(--%NS%mat-form-field-container-height, 56px);
  padding-top: var(--%NS%mat-form-field-filled-with-label-container-padding-top, 24px);
  padding-bottom: var(--%NS%mat-form-field-filled-with-label-container-padding-bottom, 8px);
}
.mdc-text-field--outlined .mat-mdc-form-field-infix, .mdc-text-field--no-label .mat-mdc-form-field-infix {
  padding-top: var(--%NS%mat-form-field-container-vertical-padding, 16px);
  padding-bottom: var(--%NS%mat-form-field-container-vertical-padding, 16px);
}

.mat-mdc-text-field-wrapper .mat-mdc-form-field-flex .mat-mdc-floating-label {
  top: calc(var(--%NS%mat-form-field-container-height, 56px) / 2);
}

.mdc-text-field--filled .mat-mdc-floating-label {
  display: var(--%NS%mat-form-field-filled-label-display, block);
}

.mat-mdc-text-field-wrapper.mdc-text-field--outlined .mdc-notched-outline--upgraded .mdc-floating-label--float-above {
  --%NS%mat-mdc-form-field-label-transform: translateY(calc(calc(6.75px + var(--%NS%mat-form-field-container-height, 56px) / 2) * -1))
    scale(var(--%NS%mat-mdc-form-field-floating-label-scale, 0.75));
  transform: var(--%NS%mat-mdc-form-field-label-transform);
}

@keyframes _mat-form-field-subscript-animation {
  from {
    opacity: 0;
    transform: translateY(-5px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.mat-mdc-form-field-subscript-wrapper {
  box-sizing: border-box;
  width: 100%;
  position: relative;
}

.mat-mdc-form-field-hint-wrapper,
.mat-mdc-form-field-error-wrapper {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  padding: 0 16px;
  opacity: 1;
  transform: translateY(0);
  animation: _mat-form-field-subscript-animation 0ms cubic-bezier(0.55, 0, 0.55, 0.2);
}

.mat-mdc-form-field-subscript-dynamic-size .mat-mdc-form-field-hint-wrapper,
.mat-mdc-form-field-subscript-dynamic-size .mat-mdc-form-field-error-wrapper {
  position: static;
}

.mat-mdc-form-field-bottom-align::before {
  content: "";
  display: inline-block;
  height: 16px;
}

.mat-mdc-form-field-bottom-align.mat-mdc-form-field-subscript-dynamic-size::before {
  content: unset;
}

.mat-mdc-form-field-hint-end {
  order: 1;
}

.mat-mdc-form-field-hint-wrapper {
  display: flex;
}

.mat-mdc-form-field-hint-spacer {
  flex: 1 0 1em;
}

.mat-mdc-form-field-error {
  display: block;
  color: var(--%NS%mat-form-field-error-text-color, var(--%NS%mat-sys-error));
}

.mat-mdc-form-field-subscript-wrapper,
.mat-mdc-form-field-bottom-align::before {
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  font-family: var(--%NS%mat-form-field-subscript-text-font, var(--%NS%mat-sys-body-small-font));
  line-height: var(--%NS%mat-form-field-subscript-text-line-height, var(--%NS%mat-sys-body-small-line-height));
  font-size: var(--%NS%mat-form-field-subscript-text-size, var(--%NS%mat-sys-body-small-size));
  letter-spacing: var(--%NS%mat-form-field-subscript-text-tracking, var(--%NS%mat-sys-body-small-tracking));
  font-weight: var(--%NS%mat-form-field-subscript-text-weight, var(--%NS%mat-sys-body-small-weight));
}

.mat-mdc-form-field-focus-overlay {
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  position: absolute;
  opacity: 0;
  pointer-events: none;
  background-color: var(--%NS%mat-form-field-state-layer-color, var(--%NS%mat-sys-on-surface));
}
.mat-mdc-text-field-wrapper:hover .mat-mdc-form-field-focus-overlay {
  opacity: var(--%NS%mat-form-field-hover-state-layer-opacity, var(--%NS%mat-sys-hover-state-layer-opacity));
}
.mat-mdc-form-field.mat-focused .mat-mdc-form-field-focus-overlay {
  opacity: var(--%NS%mat-form-field-focus-state-layer-opacity, 0);
}

select.mat-mdc-form-field-input-control {
  -moz-appearance: none;
  -webkit-appearance: none;
  background-color: transparent;
  display: inline-flex;
  box-sizing: border-box;
}
select.mat-mdc-form-field-input-control:not(:disabled) {
  cursor: pointer;
}
select.mat-mdc-form-field-input-control:not(.mat-mdc-native-select-inline) option {
  color: var(--%NS%mat-form-field-select-option-text-color, var(--%NS%mat-sys-neutral10));
}
select.mat-mdc-form-field-input-control:not(.mat-mdc-native-select-inline) option:disabled {
  color: var(--%NS%mat-form-field-select-disabled-option-text-color, color-mix(in srgb, var(--%NS%mat-sys-neutral10) 38%, transparent));
}

.mat-mdc-form-field-type-mat-native-select .mat-mdc-form-field-infix::after {
  content: "";
  width: 0;
  height: 0;
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  border-top: 5px solid;
  position: absolute;
  right: 0;
  top: 50%;
  margin-top: -2.5px;
  pointer-events: none;
  color: var(--%NS%mat-form-field-enabled-select-arrow-color, var(--%NS%mat-sys-on-surface-variant));
}
[dir=rtl] .mat-mdc-form-field-type-mat-native-select .mat-mdc-form-field-infix::after {
  right: auto;
  left: 0;
}
.mat-mdc-form-field-type-mat-native-select.mat-focused .mat-mdc-form-field-infix::after {
  color: var(--%NS%mat-form-field-focus-select-arrow-color, var(--%NS%mat-sys-primary));
}
.mat-mdc-form-field-type-mat-native-select.mat-form-field-disabled .mat-mdc-form-field-infix::after {
  color: var(--%NS%mat-form-field-disabled-select-arrow-color, color-mix(in srgb, var(--%NS%mat-sys-on-surface) 38%, transparent));
}
.mat-mdc-form-field-type-mat-native-select .mat-mdc-form-field-input-control {
  padding-right: 15px;
}
[dir=rtl] .mat-mdc-form-field-type-mat-native-select .mat-mdc-form-field-input-control {
  padding-right: 0;
  padding-left: 15px;
}

@media (forced-colors: active) {
  .mat-form-field-appearance-fill .mat-mdc-text-field-wrapper {
    outline: solid 1px;
  }
}
@media (forced-colors: active) {
  .mat-form-field-appearance-fill.mat-form-field-disabled .mat-mdc-text-field-wrapper {
    outline-color: GrayText;
  }
}

@media (forced-colors: active) {
  .mat-form-field-appearance-fill.mat-focused .mat-mdc-text-field-wrapper {
    outline: dashed 3px;
  }
}

@media (forced-colors: active) {
  .mat-mdc-form-field.mat-focused .mdc-notched-outline {
    border: dashed 3px;
  }
}

.mat-mdc-form-field-input-control[type=date], .mat-mdc-form-field-input-control[type=datetime], .mat-mdc-form-field-input-control[type=datetime-local], .mat-mdc-form-field-input-control[type=month], .mat-mdc-form-field-input-control[type=week], .mat-mdc-form-field-input-control[type=time] {
  line-height: 1;
}
.mat-mdc-form-field-input-control::-webkit-datetime-edit {
  line-height: 1;
  padding: 0;
  margin-bottom: -2px;
}

.mat-mdc-form-field {
  --%NS%mat-mdc-form-field-floating-label-scale: 0.75;
  display: inline-flex;
  flex-direction: column;
  min-width: 0;
  text-align: left;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  font-family: var(--%NS%mat-form-field-container-text-font, var(--%NS%mat-sys-body-large-font));
  line-height: var(--%NS%mat-form-field-container-text-line-height, var(--%NS%mat-sys-body-large-line-height));
  font-size: var(--%NS%mat-form-field-container-text-size, var(--%NS%mat-sys-body-large-size));
  letter-spacing: var(--%NS%mat-form-field-container-text-tracking, var(--%NS%mat-sys-body-large-tracking));
  font-weight: var(--%NS%mat-form-field-container-text-weight, var(--%NS%mat-sys-body-large-weight));
}
.mat-mdc-form-field .mdc-text-field--outlined .mdc-floating-label--float-above {
  font-size: calc(var(--%NS%mat-form-field-outlined-label-text-populated-size) * var(--%NS%mat-mdc-form-field-floating-label-scale));
}
.mat-mdc-form-field .mdc-text-field--outlined .mdc-notched-outline--upgraded .mdc-floating-label--float-above {
  font-size: var(--%NS%mat-form-field-outlined-label-text-populated-size);
}
[dir=rtl] .mat-mdc-form-field {
  text-align: right;
}

.mat-mdc-form-field-flex {
  display: inline-flex;
  align-items: baseline;
  box-sizing: border-box;
  width: 100%;
}

.mat-mdc-text-field-wrapper {
  width: 100%;
  z-index: 0;
}

.mat-mdc-form-field-icon-prefix,
.mat-mdc-form-field-icon-suffix {
  align-self: center;
  line-height: 0;
  pointer-events: auto;
  position: relative;
  z-index: 1;
}
.mat-mdc-form-field-icon-prefix > .mat-icon,
.mat-mdc-form-field-icon-suffix > .mat-icon {
  padding: 0 12px;
  box-sizing: content-box;
}

.mat-mdc-form-field-icon-prefix {
  color: var(--%NS%mat-form-field-leading-icon-color, var(--%NS%mat-sys-on-surface-variant));
}
.mat-form-field-disabled .mat-mdc-form-field-icon-prefix {
  color: var(--%NS%mat-form-field-disabled-leading-icon-color, color-mix(in srgb, var(--%NS%mat-sys-on-surface) 38%, transparent));
}

.mat-mdc-form-field-icon-suffix {
  color: var(--%NS%mat-form-field-trailing-icon-color, var(--%NS%mat-sys-on-surface-variant));
}
.mat-form-field-disabled .mat-mdc-form-field-icon-suffix {
  color: var(--%NS%mat-form-field-disabled-trailing-icon-color, color-mix(in srgb, var(--%NS%mat-sys-on-surface) 38%, transparent));
}
.mat-form-field-invalid .mat-mdc-form-field-icon-suffix {
  color: var(--%NS%mat-form-field-error-trailing-icon-color, var(--%NS%mat-sys-error));
}
.mat-form-field-invalid:not(.mat-focused):not(.mat-form-field-disabled) .mat-mdc-text-field-wrapper:hover .mat-mdc-form-field-icon-suffix {
  color: var(--%NS%mat-form-field-error-hover-trailing-icon-color, var(--%NS%mat-sys-on-error-container));
}
.mat-form-field-invalid.mat-focused .mat-mdc-text-field-wrapper .mat-mdc-form-field-icon-suffix {
  color: var(--%NS%mat-form-field-error-focus-trailing-icon-color, var(--%NS%mat-sys-error));
}

.mat-mdc-form-field-icon-prefix,
[dir=rtl] .mat-mdc-form-field-icon-suffix {
  padding: 0 4px 0 0;
}

.mat-mdc-form-field-icon-suffix,
[dir=rtl] .mat-mdc-form-field-icon-prefix {
  padding: 0 0 0 4px;
}

.mat-mdc-form-field-subscript-wrapper .mat-icon,
.mat-mdc-form-field label .mat-icon {
  width: 1em;
  height: 1em;
  font-size: inherit;
}

.mat-mdc-form-field-infix {
  flex: auto;
  min-width: 0;
  width: 180px;
  position: relative;
  box-sizing: border-box;
}
.mat-mdc-form-field-infix:has(textarea[cols]) {
  width: auto;
}

.mat-mdc-form-field .mdc-notched-outline__notch {
  margin-left: -1px;
  -webkit-clip-path: inset(-9em -999em -9em 1px);
  clip-path: inset(-9em -999em -9em 1px);
}
[dir=rtl] .mat-mdc-form-field .mdc-notched-outline__notch {
  margin-left: 0;
  margin-right: -1px;
  -webkit-clip-path: inset(-9em 1px -9em -999em);
  clip-path: inset(-9em 1px -9em -999em);
}

.mat-mdc-form-field.mat-form-field-animations-enabled .mdc-floating-label {
  transition: transform 150ms cubic-bezier(0.4, 0, 0.2, 1), color 150ms cubic-bezier(0.4, 0, 0.2, 1);
}
.mat-mdc-form-field.mat-form-field-animations-enabled .mdc-text-field__input {
  transition: opacity 150ms cubic-bezier(0.4, 0, 0.2, 1);
}
.mat-mdc-form-field.mat-form-field-animations-enabled .mdc-text-field__input::placeholder {
  transition: opacity 67ms cubic-bezier(0.4, 0, 0.2, 1);
}
.mat-mdc-form-field.mat-form-field-animations-enabled .mdc-text-field__input::-moz-placeholder {
  transition: opacity 67ms cubic-bezier(0.4, 0, 0.2, 1);
}
.mat-mdc-form-field.mat-form-field-animations-enabled .mdc-text-field__input::-webkit-input-placeholder {
  transition: opacity 67ms cubic-bezier(0.4, 0, 0.2, 1);
}
.mat-mdc-form-field.mat-form-field-animations-enabled .mdc-text-field__input:-ms-input-placeholder {
  transition: opacity 67ms cubic-bezier(0.4, 0, 0.2, 1);
}
.mat-mdc-form-field.mat-form-field-animations-enabled.mdc-text-field--no-label .mdc-text-field__input::placeholder, .mat-mdc-form-field.mat-form-field-animations-enabled.mdc-text-field--focused .mdc-text-field__input::placeholder {
  transition-delay: 40ms;
  transition-duration: 110ms;
}
.mat-mdc-form-field.mat-form-field-animations-enabled.mdc-text-field--no-label .mdc-text-field__input::-moz-placeholder, .mat-mdc-form-field.mat-form-field-animations-enabled.mdc-text-field--focused .mdc-text-field__input::-moz-placeholder {
  transition-delay: 40ms;
  transition-duration: 110ms;
}
.mat-mdc-form-field.mat-form-field-animations-enabled.mdc-text-field--no-label .mdc-text-field__input::-webkit-input-placeholder, .mat-mdc-form-field.mat-form-field-animations-enabled.mdc-text-field--focused .mdc-text-field__input::-webkit-input-placeholder {
  transition-delay: 40ms;
  transition-duration: 110ms;
}
.mat-mdc-form-field.mat-form-field-animations-enabled.mdc-text-field--no-label .mdc-text-field__input:-ms-input-placeholder, .mat-mdc-form-field.mat-form-field-animations-enabled.mdc-text-field--focused .mdc-text-field__input:-ms-input-placeholder {
  transition-delay: 40ms;
  transition-duration: 110ms;
}
.mat-mdc-form-field.mat-form-field-animations-enabled .mdc-text-field--%NS%filled:not(.mdc-ripple-upgraded):focus .mdc-text-field__ripple::before {
  transition-duration: 75ms;
}
.mat-mdc-form-field.mat-form-field-animations-enabled .mdc-line-ripple::after {
  transition: transform 180ms cubic-bezier(0.4, 0, 0.2, 1), opacity 180ms cubic-bezier(0.4, 0, 0.2, 1);
}
.mat-mdc-form-field.mat-form-field-animations-enabled .mat-mdc-form-field-hint-wrapper,
.mat-mdc-form-field.mat-form-field-animations-enabled .mat-mdc-form-field-error-wrapper {
  animation-duration: 300ms;
}

.mdc-notched-outline .mdc-floating-label {
  max-width: calc(100% + 1px);
}

.mdc-notched-outline--upgraded .mdc-floating-label--float-above {
  max-width: calc(133.3333333333% + 1px);
}
`],encapsulation:2})})()}return t})();var wi=(()=>{class t{static \u0275fac=function(i){return new(i||t)};static \u0275mod=le({type:t});static \u0275inj=se({imports:[Ne]})}return t})();var oS=(()=>{class t{static \u0275fac=function(i){return new(i||t)};static \u0275mod=le({type:t});static \u0275inj=se({imports:[Ne]})}return t})();var Hr=(()=>{class t{static \u0275fac=function(i){return new(i||t)};static \u0275mod=le({type:t});static \u0275inj=se({imports:[wi,oS,ko,Ne]})}return t})();var fg=class{source;option;constructor(n,e){this.source=n,this.option=e}},aS=new D("mat-autocomplete-default-options",{providedIn:"root",factory:()=>({autoActiveFirstOption:!1,autoSelectActiveOption:!1,hideSingleSelectionIndicator:!1,requireSelection:!1,hasBackdrop:!1})}),rS=(()=>{class t{_changeDetectorRef=p(He);_elementRef=p(q);_defaults=p(aS);_animationsDisabled=qe();_activeOptionChanges=_e.EMPTY;_keyManager;showPanel=!1;get isOpen(){return this._isOpen&&this.showPanel}_isOpen=!1;_latestOpeningTrigger;_setColor(e){this._color=e,this._changeDetectorRef.markForCheck()}_color;template;panel;options;optionGroups;ariaLabel;ariaLabelledby;displayWith=null;autoActiveFirstOption;autoSelectActiveOption;requireSelection;panelWidth;disableRipple=!1;optionSelected=new K;opened=new K;closed=new K;optionActivated=new K;set classList(e){this._classList=e,this._elementRef.nativeElement.className=""}_classList;get hideSingleSelectionIndicator(){return this._hideSingleSelectionIndicator}set hideSingleSelectionIndicator(e){this._hideSingleSelectionIndicator=e,this._syncParentProperties()}_hideSingleSelectionIndicator;_syncParentProperties(){if(this.options)for(let e of this.options)e._changeDetectorRef.markForCheck()}id=p(Qe).getId("mat-autocomplete-");inertGroups;constructor(){let e=p(Pe);this.inertGroups=e?.SAFARI||!1,this.autoActiveFirstOption=!!this._defaults.autoActiveFirstOption,this.autoSelectActiveOption=!!this._defaults.autoSelectActiveOption,this.requireSelection=!!this._defaults.requireSelection,this._hideSingleSelectionIndicator=this._defaults.hideSingleSelectionIndicator??!1}ngAfterContentInit(){this._keyManager=new Aa(this.options).withWrap().skipPredicate(this._skipPredicate),this._activeOptionChanges=this._keyManager.change.subscribe(e=>{this.isOpen&&this.optionActivated.emit({source:this,option:this.options.toArray()[e]||null})}),this._setVisibility()}ngOnDestroy(){this._keyManager?.destroy(),this._activeOptionChanges.unsubscribe()}_setScrollTop(e){this.panel&&(this.panel.nativeElement.scrollTop=e)}_getScrollTop(){return this.panel?this.panel.nativeElement.scrollTop:0}_setVisibility(){this.showPanel=!!this.options?.length,this._changeDetectorRef.markForCheck()}_emitSelectEvent(e){let i=new fg(this,e);this.optionSelected.emit(i)}_getPanelAriaLabelledby(e){if(this.ariaLabel)return null;let i=e?e+" ":"";return this.ariaLabelledby?i+this.ariaLabelledby:e}_skipPredicate(){return!1}static \u0275fac=function(i){return new(i||t)};static \u0275cmp=(function(){let e=["panel"],i=["*"];function o(a,r){if(a&1&&(Je(0,"div",1,0),oe(2),it()),a&2){let s=r.id,c=x();Ke(c._classList),z("mat-mdc-autocomplete-visible",c.showPanel)("mat-mdc-autocomplete-hidden",!c.showPanel)("mat-autocomplete-panel-animations-enabled",!c._animationsDisabled)("mat-primary",c._color==="primary")("mat-accent",c._color==="accent")("mat-warn",c._color==="warn"),Vt("id",c.id),Q("aria-label",c.ariaLabel||null)("aria-labelledby",c._getPanelAriaLabelledby(s))}}return H({type:t,selectors:[["mat-autocomplete"]],contentQueries:function(r,s,c){if(r&1&&Mt(c,ko,5)(c,cc,5),r&2){let d;Y(d=Z())&&(s.options=d),Y(d=Z())&&(s.optionGroups=d)}},viewQuery:function(r,s){if(r&1&&ot(At,7)(e,5),r&2){let c;Y(c=Z())&&(s.template=c.first),Y(c=Z())&&(s.panel=c.first)}},hostAttrs:[1,"mat-mdc-autocomplete"],inputs:{ariaLabel:[0,"aria-label","ariaLabel"],ariaLabelledby:[0,"aria-labelledby","ariaLabelledby"],displayWith:"displayWith",autoActiveFirstOption:[2,"autoActiveFirstOption","autoActiveFirstOption",O],autoSelectActiveOption:[2,"autoSelectActiveOption","autoSelectActiveOption",O],requireSelection:[2,"requireSelection","requireSelection",O],panelWidth:"panelWidth",disableRipple:[2,"disableRipple","disableRipple",O],classList:[0,"class","classList"],hideSingleSelectionIndicator:[2,"hideSingleSelectionIndicator","hideSingleSelectionIndicator",O]},outputs:{optionSelected:"optionSelected",opened:"opened",closed:"closed",optionActivated:"optionActivated"},exportAs:["matAutocomplete"],features:[ze([{provide:sc,useExisting:t}])],ngContentSelectors:i,decls:1,vars:0,consts:[["panel",""],["role","listbox",1,"mat-mdc-autocomplete-panel","mdc-menu-surface","mdc-menu-surface--open",3,"id"]],template:function(r,s){r&1&&(Be(),wo(0,o,3,17,"ng-template"))},styles:[`div.mat-mdc-autocomplete-panel {
  width: 100%;
  max-height: 256px;
  visibility: hidden;
  transform-origin: center top;
  overflow: auto;
  padding: 8px 0;
  box-sizing: border-box;
  position: relative;
  border-radius: var(--%NS%mat-autocomplete-container-shape, var(--%NS%mat-sys-corner-extra-small));
  box-shadow: var(--%NS%mat-autocomplete-container-elevation-shadow, 0px 3px 1px -2px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12));
  background-color: var(--%NS%mat-autocomplete-background-color, var(--%NS%mat-sys-surface-container));
}
@media (forced-colors: active) {
  div.mat-mdc-autocomplete-panel {
    outline: solid 1px;
  }
}
.cdk-overlay-pane:not(.mat-mdc-autocomplete-panel-above) div.mat-mdc-autocomplete-panel {
  border-top-left-radius: 0;
  border-top-right-radius: 0;
}
.mat-mdc-autocomplete-panel-above div.mat-mdc-autocomplete-panel {
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
  transform-origin: center bottom;
}
div.mat-mdc-autocomplete-panel.mat-mdc-autocomplete-visible {
  visibility: visible;
}

div.mat-mdc-autocomplete-panel.mat-mdc-autocomplete-hidden,
.cdk-overlay-pane:has(> .mat-mdc-autocomplete-hidden) {
  visibility: hidden;
  pointer-events: none;
}

@keyframes _mat-autocomplete-enter {
  from {
    opacity: 0;
    transform: scaleY(0.8);
  }
  to {
    opacity: 1;
    transform: none;
  }
}
.mat-autocomplete-panel-animations-enabled {
  animation: _mat-autocomplete-enter 120ms cubic-bezier(0, 0, 0.2, 1);
}

mat-autocomplete {
  display: none;
}
`],encapsulation:2})})()}return t})();var iA={provide:to,useExisting:$t(()=>hg),multi:!0};var oA=new D("mat-autocomplete-scroll-strategy",{providedIn:"root",factory:()=>{let t=p(ie);return()=>ci(t)}}),hg=(()=>{class t{_environmentInjector=p(xt);_element=p(q);_injector=p(ie);_viewContainerRef=p(Bt);_zone=p(X);_changeDetectorRef=p(He);_dir=p(ft,{optional:!0});_formField=p(Fa,{optional:!0,host:!0});_viewportRuler=p(In);_scrollStrategy=p(oA);_renderer=p(Ue);_animationsDisabled=qe();_defaults=p(aS,{optional:!0});_overlayRef=null;_portal;_componentDestroyed=!1;_initialized=new B;_keydownSubscription;_outsideClickSubscription;_cleanupWindowBlur;_previousValue=null;_valueOnAttach=null;_valueOnLastKeydown=null;_positionStrategy;_manuallyFloatingLabel=!1;_closingActionsSubscription;_viewportSubscription=_e.EMPTY;_breakpointObserver=p(ic);_handsetLandscapeSubscription=_e.EMPTY;_canOpenOnNextFocus=!0;_valueBeforeAutoSelection;_pendingAutoselectedOption=null;_closeKeyEventStream=new B;_overlayPanelClass=Ki(this._defaults?.overlayPanelClass||[]);_windowBlurHandler=()=>{this._canOpenOnNextFocus=this.panelOpen||!this._hasFocus()};_onChange=()=>{};_onTouched=()=>{};autocomplete;position="auto";connectedTo;autocompleteAttribute="off";autocompleteDisabled=!1;_aboveClass="mat-mdc-autocomplete-panel-above";ngAfterViewInit(){this._initialized.next(),this._initialized.complete(),this._cleanupWindowBlur=this._renderer.listen("window","blur",this._windowBlurHandler)}ngOnChanges(e){e.position&&this._positionStrategy&&(this._setStrategyPositions(this._positionStrategy),this.panelOpen&&this._overlayRef.updatePosition())}ngOnDestroy(){this._cleanupWindowBlur?.(),this._handsetLandscapeSubscription.unsubscribe(),this._viewportSubscription.unsubscribe(),this._componentDestroyed=!0,this._destroyPanel(),this._closeKeyEventStream.complete()}get panelOpen(){return this._overlayAttached&&this.autocomplete.showPanel}_overlayAttached=!1;openPanel(){this._openPanelInternal()}closePanel(){this._resetLabel(),this._overlayAttached&&(this.panelOpen&&this._zone.run(()=>{this.autocomplete.closed.emit()}),this.autocomplete._latestOpeningTrigger===this&&(this.autocomplete._isOpen=!1,this.autocomplete._latestOpeningTrigger=null),this._overlayAttached=!1,this._pendingAutoselectedOption=null,this._overlayRef&&this._overlayRef.hasAttached()&&(this._overlayRef.detach(),this._closingActionsSubscription.unsubscribe()),this._updatePanelState(),this._componentDestroyed||this._changeDetectorRef.detectChanges())}updatePosition(){this._overlayAttached&&this._overlayRef.updatePosition()}get panelClosingActions(){return bt(this.optionSelections,this.autocomplete._keyManager.tabOut.pipe(Ze(()=>this._overlayAttached)),this._closeKeyEventStream,this._getOutsideClickStream(),this._overlayRef?this._overlayRef.detachments().pipe(Ze(()=>this._overlayAttached)):Nt()).pipe(je(e=>e instanceof rc?e:null))}optionSelections=Ti(()=>{let e=this.autocomplete?this.autocomplete.options:null;return e?e.changes.pipe(st(e),Kt(()=>bt(...e.map(i=>i.onSelectionChange)))):this._initialized.pipe(Kt(()=>this.optionSelections))});get activeOption(){return this.autocomplete&&this.autocomplete._keyManager?this.autocomplete._keyManager.activeItem:null}_getOutsideClickStream(){return new ge(e=>{let i=a=>{let r=Gt(a),s=this._formField?this._formField.getConnectedOverlayOrigin().nativeElement:null,c=this.connectedTo?this.connectedTo.elementRef.nativeElement:null;this._overlayAttached&&r!==this._element.nativeElement&&!this._hasFocus()&&(!s||!s.contains(r))&&(!c||!c.contains(r))&&this._overlayRef&&!this._overlayRef.overlayElement.contains(r)&&e.next(a)},o=[this._renderer.listen("document","click",i),this._renderer.listen("document","auxclick",i),this._renderer.listen("document","touchend",i)];return()=>{o.forEach(a=>a())}})}writeValue(e){Promise.resolve(null).then(()=>this._assignOptionValue(e))}registerOnChange(e){this._onChange=e}registerOnTouched(e){this._onTouched=e}setDisabledState(e){this._element.nativeElement.disabled=e}_handleKeydown(e){let i=e,o=i.keyCode,a=pt(i);if(o===27&&!a&&i.preventDefault(),this._valueOnLastKeydown=this._element.nativeElement.value,this.activeOption&&o===13&&this.panelOpen&&!a)this.activeOption._selectViaInteraction(),this._resetActiveItem(),i.preventDefault();else if(this.autocomplete){let r=this.autocomplete._keyManager.activeItem,s=o===38||o===40;o===9||s&&!a&&this.panelOpen?this.autocomplete._keyManager.onKeydown(i):s&&this._canOpen()&&this._openPanelInternal(this._valueOnLastKeydown),(s||this.autocomplete._keyManager.activeItem!==r)&&(this._scrollToOption(this.autocomplete._keyManager.activeItemIndex||0),this.autocomplete.autoSelectActiveOption&&this.activeOption&&(this._pendingAutoselectedOption||(this._valueBeforeAutoSelection=this._valueOnLastKeydown),this._pendingAutoselectedOption=this.activeOption,this._assignOptionValue(this.activeOption.value)))}}_handleInput(e){let i=e.target,o=i.value;if(i.type==="number"&&(o=o==""?null:parseFloat(o)),this._previousValue!==o){if(this._previousValue=o,this._pendingAutoselectedOption=null,(!this.autocomplete||!this.autocomplete.requireSelection)&&this._onChange(o),!o)this._clearPreviousSelectedOption(null,!1);else if(this.panelOpen&&!this.autocomplete.requireSelection){let a=this.autocomplete.options?.find(r=>r.selected);if(a){let r=this._getDisplayValue(a.value);o!==r&&a.deselect(!1)}}if(this._canOpen()&&this._hasFocus()){let a=this._valueOnLastKeydown??this._element.nativeElement.value;this._valueOnLastKeydown=null,this._openPanelInternal(a)}}}_handleFocus(){this._canOpenOnNextFocus?this._canOpen()&&(this._previousValue=this._element.nativeElement.value,this._attachOverlay(this._previousValue),this._floatLabel(!0)):this._canOpenOnNextFocus=!0}_handleClick(){this._canOpen()&&!this.panelOpen&&this._openPanelInternal()}_hasFocus(){return Ma()===this._element.nativeElement}_floatLabel(e=!1){this._formField&&this._formField.floatLabel==="auto"&&(e?this._formField._animateAndLockLabel():this._formField.floatLabel="always",this._manuallyFloatingLabel=!0)}_resetLabel(){this._manuallyFloatingLabel&&(this._formField&&(this._formField.floatLabel="auto"),this._manuallyFloatingLabel=!1)}_subscribeToClosingActions(){let e=new ge(o=>{Et(()=>{o.next()},{injector:this._environmentInjector})}),i=this.autocomplete.options?.changes.pipe(Oi(()=>this._positionStrategy.reapplyLastPosition()),Dm(0))??Nt();return bt(e,i).pipe(Kt(()=>this._zone.run(()=>{let o=this.panelOpen;return this._resetActiveItem(),this._updatePanelState(),this._changeDetectorRef.detectChanges(),this.panelOpen&&this._overlayRef.updatePosition(),o!==this.panelOpen&&(this.panelOpen?this._emitOpened():this.autocomplete.closed.emit()),this.panelClosingActions})),Ft(1)).subscribe(o=>this._setValueAndClose(o))}_emitOpened(){this.autocomplete.opened.emit()}_destroyPanel(){this._overlayRef&&(this.closePanel(),this._overlayRef.dispose(),this._overlayRef=null)}_getDisplayValue(e){let i=this.autocomplete;return i&&i.displayWith?i.displayWith(e):e}_assignOptionValue(e){let i=this._getDisplayValue(e);e==null&&this._clearPreviousSelectedOption(null,!1),this._updateNativeInputValue(i??"")}_updateNativeInputValue(e){let i=this._formField?._control;i?Kl(i.value)?i.value.set(e):i.value=e:this._element.nativeElement.value=e,this._previousValue=e}_setValueAndClose(e){let i=this.autocomplete,o=e?e.source:this._pendingAutoselectedOption;o?(this._clearPreviousSelectedOption(o),this._assignOptionValue(o.value),this._onChange(o.value),i._emitSelectEvent(o),this._element.nativeElement.focus()):i.requireSelection&&this._element.nativeElement.value!==this._valueOnAttach&&(this._clearPreviousSelectedOption(null),this._assignOptionValue(null),this._onChange(null)),this.closePanel()}_clearPreviousSelectedOption(e,i){this.autocomplete?.options?.forEach(o=>{o!==e&&o.selected&&o.deselect(i)})}_openPanelInternal(e=this._element.nativeElement.value){this._attachOverlay(e),this._floatLabel()}_attachOverlay(e){if(!this.autocomplete)return;let i=this._overlayRef;i?(this._positionStrategy.setOrigin(this._getConnectedElement()),i.updateSize({width:this._getPanelWidth()})):(this._portal=new xn(this.autocomplete.template,this._viewContainerRef,{id:this._formField?.getLabelId()}),i=li(this._injector,this._getOverlayConfig()),this._overlayRef=i,this._viewportSubscription=this._viewportRuler.change().subscribe(()=>{this.panelOpen&&i&&i.updateSize({width:this._getPanelWidth()})}),this._handsetLandscapeSubscription=this._breakpointObserver.observe(Kx.HandsetLandscape).subscribe(a=>{a.matches?this._positionStrategy.withFlexibleDimensions(!0).withGrowAfterOpen(!0).withViewportMargin(8):this._positionStrategy.withFlexibleDimensions(!1).withGrowAfterOpen(!1).withViewportMargin(0)})),i&&!i.hasAttached()&&(i.attach(this._portal),this._valueOnAttach=e,this._valueOnLastKeydown=null,this._closingActionsSubscription=this._subscribeToClosingActions());let o=this.panelOpen;this.autocomplete._isOpen=this._overlayAttached=!0,this.autocomplete._latestOpeningTrigger=this,this.autocomplete._setColor(this._formField?.color),this._updatePanelState(),this.panelOpen&&o!==this.panelOpen&&this._emitOpened()}_handlePanelKeydown=e=>{(e.keyCode===27&&!pt(e)||e.keyCode===38&&pt(e,"altKey"))&&(this._pendingAutoselectedOption&&(this._updateNativeInputValue(this._valueBeforeAutoSelection??""),this._pendingAutoselectedOption=null),this._closeKeyEventStream.next(),this._resetActiveItem(),e.stopPropagation(),e.preventDefault())};_updatePanelState(){if(this.autocomplete._setVisibility(),this.panelOpen){let e=this._overlayRef;this._keydownSubscription||(this._keydownSubscription=e.keydownEvents().subscribe(this._handlePanelKeydown)),this._outsideClickSubscription||(this._outsideClickSubscription=e.outsidePointerEvents().subscribe())}else this._keydownSubscription?.unsubscribe(),this._outsideClickSubscription?.unsubscribe(),this._keydownSubscription=this._outsideClickSubscription=void 0}_getOverlayConfig(){return new si({positionStrategy:this._getOverlayPosition(),scrollStrategy:this._scrollStrategy(),width:this._getPanelWidth(),direction:this._dir??void 0,hasBackdrop:this._defaults?.hasBackdrop,backdropClass:this._defaults?.backdropClass||"cdk-overlay-transparent-backdrop",panelClass:this._overlayPanelClass,disableAnimations:this._animationsDisabled})}_getOverlayPosition(){let e=eo(this._injector,this._getConnectedElement()).withFlexibleDimensions(!1).withPush(!1).withPopoverLocation("inline");return this._setStrategyPositions(e),this._positionStrategy=e,e}_setStrategyPositions(e){let i=[{originX:"start",originY:"bottom",overlayX:"start",overlayY:"top"},{originX:"end",originY:"bottom",overlayX:"end",overlayY:"top"}],o=this._aboveClass,a=[{originX:"start",originY:"top",overlayX:"start",overlayY:"bottom",panelClass:o},{originX:"end",originY:"top",overlayX:"end",overlayY:"bottom",panelClass:o}],r;this.position==="above"?r=a:this.position==="below"?r=i:r=[...i,...a],e.withPositions(r)}_getConnectedElement(){return this.connectedTo?this.connectedTo.elementRef:this._formField?this._formField.getConnectedOverlayOrigin():this._element}_getPanelWidth(){return this.autocomplete.panelWidth||this._getHostWidth()}_getHostWidth(){return this._getConnectedElement().nativeElement.getBoundingClientRect().width}_resetActiveItem(){let e=this.autocomplete;if(e.autoActiveFirstOption){let i=-1;for(let o=0;o<e.options.length;o++)if(!e.options.get(o).disabled){i=o;break}e._keyManager.setActiveItem(i)}else e._keyManager.setActiveItem(-1)}_canOpen(){let e=this._element.nativeElement;return!e.readOnly&&!e.disabled&&!this.autocompleteDisabled}_scrollToOption(e){let i=this.autocomplete,o=eu(e,i.options,i.optionGroups);if(e===0&&o===1)i._setScrollTop(0);else if(i.panel){let a=i.options.toArray()[e];if(a){let r=a._getHostElement(),s=tu(r.offsetTop,r.offsetHeight,i._getScrollTop(),i.panel.nativeElement.offsetHeight);i._setScrollTop(s)}}}static \u0275fac=function(i){return new(i||t)};static \u0275dir=ee({type:t,selectors:[["input","matAutocomplete",""],["textarea","matAutocomplete",""]],hostAttrs:[1,"mat-mdc-autocomplete-trigger"],hostVars:7,hostBindings:function(i,o){i&1&&V("focusin",function(){return o._handleFocus()})("blur",function(){return o._onTouched()})("input",function(r){return o._handleInput(r)})("keydown",function(r){return o._handleKeydown(r)})("click",function(){return o._handleClick()}),i&2&&Q("autocomplete",o.autocompleteAttribute)("role",o.autocompleteDisabled?null:"combobox")("aria-autocomplete",o.autocompleteDisabled?null:"list")("aria-activedescendant",o.panelOpen&&o.activeOption?o.activeOption.id:null)("aria-expanded",o.autocompleteDisabled?null:o.panelOpen.toString())("aria-controls",o.autocompleteDisabled||!o.panelOpen?null:o.autocomplete?.id)("aria-haspopup",o.autocompleteDisabled?null:"listbox")},inputs:{autocomplete:[0,"matAutocomplete","autocomplete"],position:[0,"matAutocompletePosition","position"],connectedTo:[0,"matAutocompleteConnectedTo","connectedTo"],autocompleteAttribute:[0,"autocomplete","autocompleteAttribute"],autocompleteDisabled:[2,"matAutocompleteDisabled","autocompleteDisabled",O]},exportAs:["matAutocompleteTrigger"],features:[ze([iA]),wt]})}return t})(),sS=(()=>{class t{static \u0275fac=function(i){return new(i||t)};static \u0275mod=le({type:t});static \u0275inj=se({imports:[di,Hr,ri,Hr,Ne]})}return t})();var cS=(()=>{class t{static \u0275fac=function(i){return new(i||t)};static \u0275mod=le({type:t});static \u0275inj=se({imports:[Er,Ne]})}return t})();var rA={capture:!0},sA=["focus","mousedown","mouseenter","touchstart"],gg="mat-ripple-loader-uninitialized",bg="mat-ripple-loader-class-name",lS="mat-ripple-loader-centered",Eu="mat-ripple-loader-disabled",Du=(()=>{class t{_document=p(ae);_animationsDisabled=qe();_globalRippleOptions=p(kr,{optional:!0});_platform=p(Pe);_ngZone=p(X);_injector=p(ie);_eventCleanups;_hosts=new Map;constructor(){let e=p(Lt).createRenderer(null,null);this._eventCleanups=this._ngZone.runOutsideAngular(()=>sA.map(i=>e.listen(this._document,i,this._onInteraction,rA)))}ngOnDestroy(){let e=this._hosts.keys();for(let i of e)this.destroyRipple(i);this._eventCleanups.forEach(i=>i())}configureRipple(e,i){e.setAttribute(gg,this._globalRippleOptions?.namespace??""),(i.className||!e.hasAttribute(bg))&&e.setAttribute(bg,i.className||""),i.centered&&e.setAttribute(lS,""),i.disabled&&e.setAttribute(Eu,"")}setDisabled(e,i){let o=this._hosts.get(e);o?(o.target.rippleDisabled=i,!i&&!o.hasSetUpEvents&&(o.hasSetUpEvents=!0,o.renderer.setupTriggerEvents(e))):i?e.setAttribute(Eu,""):e.removeAttribute(Eu)}_onInteraction=e=>{let i=Gt(e);if(i instanceof HTMLElement){let o=i.closest(`[${gg}="${this._globalRippleOptions?.namespace??""}"]`);o&&this._createRipple(o)}};_createRipple(e){if(!this._document||this._hosts.has(e))return;e.querySelector(".mat-ripple")?.remove();let i=this._document.createElement("span");i.classList.add("mat-ripple",e.getAttribute(bg)),e.append(i);let o=this._globalRippleOptions,a=this._animationsDisabled?0:o?.animation?.enterDuration??oc.enterDuration,r=this._animationsDisabled?0:o?.animation?.exitDuration??oc.exitDuration,s={rippleDisabled:this._animationsDisabled||o?.disabled||e.hasAttribute(Eu),rippleConfig:{centered:e.hasAttribute(lS),terminateOnPointerUp:o?.terminateOnPointerUp,animation:{enterDuration:a,exitDuration:r}}},c=new ac(s,this._ngZone,i,this._platform,this._injector),d=!s.rippleDisabled;d&&c.setupTriggerEvents(e),this._hosts.set(e,{target:s,renderer:c,hasSetUpEvents:d}),e.removeAttribute(gg)}destroyRipple(e){let i=this._hosts.get(e);i&&(i.renderer._removeTriggerEvents(),this._hosts.delete(e))}static \u0275fac=function(i){return new(i||t)};static \u0275prov=ce({token:t,factory:t.\u0275fac})}return t})();var cA=new D("MAT_BUTTON_CONFIG");function dS(t){return t==null?void 0:on(t)}var Mu=(()=>{class t{_elementRef=p(q);_ngZone=p(X);_animationsDisabled=qe();_config=p(cA,{optional:!0});_focusMonitor=p(un);_cleanupClick;_renderer=p(Ue);_rippleLoader=p(Du);_isAnchor;_isFab=!1;color;get disableRipple(){return this._disableRipple}set disableRipple(e){this._disableRipple=e,this._updateRippleDisabled()}_disableRipple=!1;get disabled(){return this._disabled}set disabled(e){this._disabled=e,this._updateRippleDisabled()}_disabled=!1;ariaDisabled;disabledInteractive;tabIndex;set _tabindex(e){this.tabIndex=e}showProgress=hn(!1,{transform:O});constructor(){p(ut).load(bn);let e=this._elementRef.nativeElement;this._isAnchor=e.tagName==="A",this.disabledInteractive=this._config?.disabledInteractive??!1,this.color=this._config?.color??null,this._rippleLoader?.configureRipple(e,{className:"mat-mdc-button-ripple"})}ngAfterViewInit(){this._focusMonitor.monitor(this._elementRef,!0),this._isAnchor&&this._setupAsAnchor()}ngOnDestroy(){this._cleanupClick?.(),this._focusMonitor.stopMonitoring(this._elementRef),this._rippleLoader?.destroyRipple(this._elementRef.nativeElement)}focus(e="program",i){e?this._focusMonitor.focusVia(this._elementRef.nativeElement,e,i):this._elementRef.nativeElement.focus(i)}_getAriaDisabled(){return this.ariaDisabled!=null?this.ariaDisabled:this._isAnchor?this.disabled||null:this.disabled&&this.disabledInteractive?!0:null}_getDisabledAttribute(){return this.disabledInteractive||!this.disabled?null:!0}_updateRippleDisabled(){this._rippleLoader?.setDisabled(this._elementRef.nativeElement,this.disableRipple||this.disabled)}_getTabIndex(){return this._isAnchor?this.disabled&&!this.disabledInteractive?-1:this.tabIndex:this.tabIndex}_setupAsAnchor(){this._cleanupClick=this._ngZone.runOutsideAngular(()=>this._renderer.listen(this._elementRef.nativeElement,"click",e=>{this.disabled&&(e.preventDefault(),e.stopImmediatePropagation())}))}static \u0275fac=function(i){return new(i||t)};static \u0275dir=ee({type:t,hostAttrs:[1,"mat-mdc-button-base"],hostVars:15,hostBindings:function(i,o){i&2&&(Q("disabled",o._getDisabledAttribute())("aria-disabled",o._getAriaDisabled())("tabindex",o._getTabIndex()),Ke(o.color?"mat-"+o.color:""),z("mat-mdc-button-progress-indicator-shown",o.showProgress())("mat-mdc-button-disabled",o.disabled)("mat-mdc-button-disabled-interactive",o.disabledInteractive)("mat-unthemed",!o.color)("_mat-animation-noopable",o._animationsDisabled))},inputs:{color:"color",disableRipple:[2,"disableRipple","disableRipple",O],disabled:[2,"disabled","disabled",O],ariaDisabled:[2,"aria-disabled","ariaDisabled",O],disabledInteractive:[2,"disabledInteractive","disabledInteractive",O],tabIndex:[2,"tabIndex","tabIndex",dS],_tabindex:[2,"tabindex","_tabindex",dS],showProgress:[1,"showProgress"]}})}return t})(),vg=(()=>{class t extends Mu{constructor(){super(),this._rippleLoader.configureRipple(this._elementRef.nativeElement,{centered:!0})}static \u0275fac=function(i){return new(i||t)};static \u0275cmp=(function(){let e=["*",[["","progressIndicator",""]]],i=["*","[progressIndicator]"];function o(a,r){a&1&&(Je(0,"div",1),oe(1,1),it())}return H({type:t,selectors:[["button","mat-icon-button",""],["a","mat-icon-button",""],["button","matIconButton",""],["a","matIconButton",""]],hostAttrs:[1,"mdc-icon-button","mat-mdc-icon-button"],exportAs:["matButton","matAnchor"],features:[Ge],ngContentSelectors:i,decls:5,vars:1,consts:[[1,"mat-mdc-button-persistent-ripple","mdc-icon-button__ripple"],[1,"mat-mdc-button-progress-indicator-container"],[1,"mat-focus-indicator"],[1,"mat-mdc-button-touch-target"]],template:function(r,s){r&1&&(Be(e),Dt(0,"span",0),oe(1),k(2,o,2,0,"div",1),Dt(3,"span",2)(4,"span",3)),r&2&&(h(2),N(s.showProgress()?2:-1))},styles:[`.mat-mdc-icon-button {
  -webkit-user-select: none;
  user-select: none;
  display: inline-block;
  position: relative;
  box-sizing: border-box;
  border: none;
  outline: none;
  background-color: transparent;
  fill: currentColor;
  text-decoration: none;
  cursor: pointer;
  z-index: 0;
  overflow: visible;
  border-radius: var(--%NS%mat-icon-button-container-shape, var(--%NS%mat-sys-corner-full, 50%));
  flex-shrink: 0;
  text-align: center;
  width: var(--%NS%mat-icon-button-state-layer-size, 40px);
  height: var(--%NS%mat-icon-button-state-layer-size, 40px);
  padding: calc(calc(var(--%NS%mat-icon-button-state-layer-size, 40px) - var(--%NS%mat-icon-button-icon-size, 24px)) / 2);
  font-size: var(--%NS%mat-icon-button-icon-size, 24px);
  color: var(--%NS%mat-icon-button-icon-color, var(--%NS%mat-sys-on-surface-variant));
  -webkit-tap-highlight-color: transparent;
}
.mat-mdc-icon-button .mat-mdc-button-ripple,
.mat-mdc-icon-button .mat-mdc-button-persistent-ripple,
.mat-mdc-icon-button .mat-mdc-button-persistent-ripple::before {
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  position: absolute;
  pointer-events: none;
  border-radius: inherit;
}
.mat-mdc-icon-button .mat-mdc-button-ripple {
  overflow: hidden;
}
.mat-mdc-icon-button .mat-mdc-button-persistent-ripple::before {
  content: "";
  opacity: 0;
}
.mat-mdc-icon-button .mdc-button__label,
.mat-mdc-icon-button .mat-icon {
  z-index: 1;
  position: relative;
}
.mat-mdc-icon-button .mat-focus-indicator {
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  position: absolute;
  border-radius: inherit;
}
.mat-mdc-icon-button:focus-visible > .mat-focus-indicator::before {
  content: "";
  border-radius: inherit;
}
.mat-mdc-icon-button .mat-ripple-element {
  background-color: var(--%NS%mat-icon-button-ripple-color, color-mix(in srgb, var(--%NS%mat-sys-on-surface-variant) calc(var(--%NS%mat-sys-pressed-state-layer-opacity) * 100%), transparent));
}
.mat-mdc-icon-button .mat-mdc-button-persistent-ripple::before {
  background-color: var(--%NS%mat-icon-button-state-layer-color, var(--%NS%mat-sys-on-surface-variant));
}
.mat-mdc-icon-button.mat-mdc-button-disabled .mat-mdc-button-persistent-ripple::before {
  background-color: var(--%NS%mat-icon-button-disabled-state-layer-color, var(--%NS%mat-sys-on-surface-variant));
}
.mat-mdc-icon-button:hover > .mat-mdc-button-persistent-ripple::before {
  opacity: var(--%NS%mat-icon-button-hover-state-layer-opacity, var(--%NS%mat-sys-hover-state-layer-opacity));
}
.mat-mdc-icon-button.cdk-program-focused > .mat-mdc-button-persistent-ripple::before, .mat-mdc-icon-button.cdk-keyboard-focused > .mat-mdc-button-persistent-ripple::before, .mat-mdc-icon-button.mat-mdc-button-disabled-interactive:focus > .mat-mdc-button-persistent-ripple::before {
  opacity: var(--%NS%mat-icon-button-focus-state-layer-opacity, var(--%NS%mat-sys-focus-state-layer-opacity));
}
.mat-mdc-icon-button:active > .mat-mdc-button-persistent-ripple::before {
  opacity: var(--%NS%mat-icon-button-pressed-state-layer-opacity, var(--%NS%mat-sys-pressed-state-layer-opacity));
}
.mat-mdc-icon-button .mat-mdc-button-touch-target {
  position: absolute;
  top: 50%;
  height: var(--%NS%mat-icon-button-touch-target-size, 48px);
  display: var(--%NS%mat-icon-button-touch-target-display, block);
  left: 50%;
  width: var(--%NS%mat-icon-button-touch-target-size, 48px);
  transform: translate(-50%, -50%);
}
.mat-mdc-icon-button._mat-animation-noopable {
  transition: none !important;
  animation: none !important;
}
.mat-mdc-icon-button[disabled], .mat-mdc-icon-button.mat-mdc-button-disabled {
  cursor: default;
  pointer-events: none;
  color: var(--%NS%mat-icon-button-disabled-icon-color, color-mix(in srgb, var(--%NS%mat-sys-on-surface) 38%, transparent));
}
.mat-mdc-icon-button.mat-mdc-button-disabled-interactive {
  pointer-events: auto;
}
.mat-mdc-icon-button img,
.mat-mdc-icon-button svg {
  width: var(--%NS%mat-icon-button-icon-size, 24px);
  height: var(--%NS%mat-icon-button-icon-size, 24px);
  vertical-align: baseline;
}
.mat-mdc-icon-button .mat-mdc-button-progress-indicator-container .mdc-circular-progress__determinate-circle-graphic {
  width: inherit;
  height: inherit;
}
.mat-mdc-icon-button .mat-mdc-button-progress-indicator-container .mdc-circular-progress__indeterminate-circle-graphic {
  height: 100%;
}
.mat-mdc-icon-button .mat-mdc-button-persistent-ripple {
  border-radius: var(--%NS%mat-icon-button-container-shape, var(--%NS%mat-sys-corner-full, 50%));
}
.mat-mdc-icon-button[hidden] {
  display: none;
}
.mat-mdc-icon-button.mat-unthemed:not(.mdc-ripple-upgraded):focus::before, .mat-mdc-icon-button.mat-primary:not(.mdc-ripple-upgraded):focus::before, .mat-mdc-icon-button.mat-accent:not(.mdc-ripple-upgraded):focus::before, .mat-mdc-icon-button.mat-warn:not(.mdc-ripple-upgraded):focus::before {
  background: transparent;
  opacity: 1;
}

.mat-mdc-button-progress-indicator-container {
  position: absolute;
  inset-inline-start: 0;
  inset-block-start: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
}

.mat-mdc-button-progress-indicator-shown mat-icon {
  visibility: hidden;
}
`,`@media (forced-colors: active) {
  .mat-mdc-button:not(.mdc-button--outlined),
  .mat-mdc-unelevated-button:not(.mdc-button--outlined),
  .mat-mdc-raised-button:not(.mdc-button--outlined),
  .mat-mdc-outlined-button:not(.mdc-button--outlined),
  .mat-mdc-button-base.mat-tonal-button,
  .mat-mdc-icon-button.mat-mdc-icon-button,
  .mat-mdc-outlined-button .mdc-button__ripple {
    outline: solid 1px;
  }
}
`],encapsulation:2})})()}return t})();var uS=new Map([["text",["mat-mdc-button"]],["filled",["mdc-button--unelevated","mat-mdc-unelevated-button"]],["elevated",["mdc-button--raised","mat-mdc-raised-button"]],["outlined",["mdc-button--outlined","mat-mdc-outlined-button"]],["tonal",["mat-tonal-button"]]]),Iu=(()=>{class t extends Mu{get appearance(){return this._appearance}set appearance(e){this.setAppearance(e||this._config?.defaultAppearance||"text")}_appearance=null;constructor(){super();let e=lA(this._elementRef.nativeElement);e&&this.setAppearance(e)}setAppearance(e){if(e===this._appearance)return;let i=this._elementRef.nativeElement.classList,o=this._appearance?uS.get(this._appearance):null,a=uS.get(e);o&&i.remove(...o),i.add(...a),this._appearance=e}static \u0275fac=function(i){return new(i||t)};static \u0275cmp=(function(){let e=[[["",8,"material-icons",3,"iconPositionEnd",""],["mat-icon",3,"iconPositionEnd",""],["","matButtonIcon","",3,"iconPositionEnd",""],["",8,"material-symbols-outlined",3,"iconPositionEnd",""],["",8,"material-symbols-rounded",3,"iconPositionEnd",""],["",8,"material-symbols-sharp",3,"iconPositionEnd",""]],"*",[["","iconPositionEnd","",8,"material-icons"],["mat-icon","iconPositionEnd",""],["","matButtonIcon","","iconPositionEnd",""],["","iconPositionEnd","",8,"material-symbols-outlined"],["","iconPositionEnd","",8,"material-symbols-rounded"],["","iconPositionEnd","",8,"material-symbols-sharp"]],[["","progressIndicator",""]]],i=[".material-icons:not([iconPositionEnd]), mat-icon:not([iconPositionEnd]), [matButtonIcon]:not([iconPositionEnd]), .material-symbols-outlined:not([iconPositionEnd]), .material-symbols-rounded:not([iconPositionEnd]), .material-symbols-sharp:not([iconPositionEnd])","*",".material-icons[iconPositionEnd], mat-icon[iconPositionEnd], [matButtonIcon][iconPositionEnd], .material-symbols-outlined[iconPositionEnd], .material-symbols-rounded[iconPositionEnd], .material-symbols-sharp[iconPositionEnd]","[progressIndicator]"];function o(a,r){a&1&&(Je(0,"div",2),oe(1,3),it())}return H({type:t,selectors:[["button","matButton",""],["a","matButton",""],["button","mat-button",""],["button","mat-raised-button",""],["button","mat-flat-button",""],["button","mat-stroked-button",""],["a","mat-button",""],["a","mat-raised-button",""],["a","mat-flat-button",""],["a","mat-stroked-button",""]],hostAttrs:[1,"mdc-button"],inputs:{appearance:[0,"matButton","appearance"]},exportAs:["matButton","matAnchor"],features:[Ge],ngContentSelectors:i,decls:8,vars:5,consts:[[1,"mat-mdc-button-persistent-ripple"],[1,"mdc-button__label"],[1,"mat-mdc-button-progress-indicator-container"],[1,"mat-focus-indicator"],[1,"mat-mdc-button-touch-target"]],template:function(r,s){r&1&&(Be(e),Dt(0,"span",0),oe(1),Je(2,"span",1),oe(3,1),it(),oe(4,2),k(5,o,2,0,"div",2),Dt(6,"span",3)(7,"span",4)),r&2&&(z("mdc-button__ripple",!s._isFab)("mdc-fab__ripple",s._isFab),h(5),N(s.showProgress()?5:-1))},styles:[`.mat-mdc-button-base {
  text-decoration: none;
}
.mat-mdc-button-base .mat-icon {
  min-height: fit-content;
  flex-shrink: 0;
}
@media (hover: none) {
  .mat-mdc-button-base:hover > span.mat-mdc-button-persistent-ripple::before {
    opacity: 0;
  }
}

.mdc-button {
  -webkit-user-select: none;
  user-select: none;
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  min-width: 64px;
  border: none;
  outline: none;
  line-height: inherit;
  -webkit-appearance: none;
  overflow: visible;
  vertical-align: middle;
  background: transparent;
  padding: 0 8px;
}
.mdc-button::-moz-focus-inner {
  padding: 0;
  border: 0;
}
.mdc-button:active {
  outline: none;
}
.mdc-button:hover {
  cursor: pointer;
}
.mdc-button:disabled {
  cursor: default;
  pointer-events: none;
}
.mdc-button[hidden] {
  display: none;
}
.mdc-button .mdc-button__label {
  position: relative;
}

.mat-mdc-button {
  padding: 0 var(--%NS%mat-button-text-horizontal-padding, 12px);
  height: var(--%NS%mat-button-text-container-height, 40px);
  font-family: var(--%NS%mat-button-text-label-text-font, var(--%NS%mat-sys-label-large-font));
  font-size: var(--%NS%mat-button-text-label-text-size, var(--%NS%mat-sys-label-large-size));
  letter-spacing: var(--%NS%mat-button-text-label-text-tracking, var(--%NS%mat-sys-label-large-tracking));
  text-transform: var(--%NS%mat-button-text-label-text-transform);
  font-weight: var(--%NS%mat-button-text-label-text-weight, var(--%NS%mat-sys-label-large-weight));
}
.mat-mdc-button, .mat-mdc-button .mdc-button__ripple {
  border-radius: var(--%NS%mat-button-text-container-shape, var(--%NS%mat-sys-corner-full));
}
.mat-mdc-button:not(:disabled) {
  color: var(--%NS%mat-button-text-label-text-color, var(--%NS%mat-sys-primary));
}
.mat-mdc-button[disabled], .mat-mdc-button.mat-mdc-button-disabled {
  cursor: default;
  pointer-events: none;
  color: var(--%NS%mat-button-text-disabled-label-text-color, color-mix(in srgb, var(--%NS%mat-sys-on-surface) 38%, transparent));
}
.mat-mdc-button.mat-mdc-button-disabled-interactive {
  pointer-events: auto;
}
.mat-mdc-button:has(.material-icons, .material-symbols-outlined, .material-symbols-rounded,
.material-symbols-sharp, mat-icon, [matButtonIcon]) {
  padding: 0 var(--%NS%mat-button-text-with-icon-horizontal-padding, 16px);
}
.mat-mdc-button > .mat-icon {
  margin-right: var(--%NS%mat-button-text-icon-spacing, 8px);
  margin-left: var(--%NS%mat-button-text-icon-offset, -4px);
}
[dir=rtl] .mat-mdc-button > .mat-icon {
  margin-right: var(--%NS%mat-button-text-icon-offset, -4px);
  margin-left: var(--%NS%mat-button-text-icon-spacing, 8px);
}
.mat-mdc-button .mdc-button__label + .mat-icon {
  margin-right: var(--%NS%mat-button-text-icon-offset, -4px);
  margin-left: var(--%NS%mat-button-text-icon-spacing, 8px);
}
[dir=rtl] .mat-mdc-button .mdc-button__label + .mat-icon {
  margin-right: var(--%NS%mat-button-text-icon-spacing, 8px);
  margin-left: var(--%NS%mat-button-text-icon-offset, -4px);
}
.mat-mdc-button .mat-ripple-element {
  background-color: var(--%NS%mat-button-text-ripple-color, color-mix(in srgb, var(--%NS%mat-sys-primary) calc(var(--%NS%mat-sys-pressed-state-layer-opacity) * 100%), transparent));
}
.mat-mdc-button .mat-mdc-button-persistent-ripple::before {
  background-color: var(--%NS%mat-button-text-state-layer-color, var(--%NS%mat-sys-primary));
}
.mat-mdc-button.mat-mdc-button-disabled .mat-mdc-button-persistent-ripple::before {
  background-color: var(--%NS%mat-button-text-disabled-state-layer-color, var(--%NS%mat-sys-on-surface-variant));
}
.mat-mdc-button:hover > .mat-mdc-button-persistent-ripple::before {
  opacity: var(--%NS%mat-button-text-hover-state-layer-opacity, var(--%NS%mat-sys-hover-state-layer-opacity));
}
.mat-mdc-button.cdk-program-focused > .mat-mdc-button-persistent-ripple::before, .mat-mdc-button.cdk-keyboard-focused > .mat-mdc-button-persistent-ripple::before, .mat-mdc-button.mat-mdc-button-disabled-interactive:focus > .mat-mdc-button-persistent-ripple::before {
  opacity: var(--%NS%mat-button-text-focus-state-layer-opacity, var(--%NS%mat-sys-focus-state-layer-opacity));
}
.mat-mdc-button:active > .mat-mdc-button-persistent-ripple::before {
  opacity: var(--%NS%mat-button-text-pressed-state-layer-opacity, var(--%NS%mat-sys-pressed-state-layer-opacity));
}
.mat-mdc-button .mat-mdc-button-touch-target {
  position: absolute;
  top: 50%;
  height: var(--%NS%mat-button-text-touch-target-size, 48px);
  display: var(--%NS%mat-button-text-touch-target-display, block);
  left: 0;
  right: 0;
  transform: translateY(-50%);
}

.mat-mdc-unelevated-button {
  transition: box-shadow 280ms cubic-bezier(0.4, 0, 0.2, 1);
  height: var(--%NS%mat-button-filled-container-height, 40px);
  font-family: var(--%NS%mat-button-filled-label-text-font, var(--%NS%mat-sys-label-large-font));
  font-size: var(--%NS%mat-button-filled-label-text-size, var(--%NS%mat-sys-label-large-size));
  letter-spacing: var(--%NS%mat-button-filled-label-text-tracking, var(--%NS%mat-sys-label-large-tracking));
  text-transform: var(--%NS%mat-button-filled-label-text-transform);
  font-weight: var(--%NS%mat-button-filled-label-text-weight, var(--%NS%mat-sys-label-large-weight));
  padding: 0 var(--%NS%mat-button-filled-horizontal-padding, 24px);
}
.mat-mdc-unelevated-button > .mat-icon {
  margin-right: var(--%NS%mat-button-filled-icon-spacing, 8px);
  margin-left: var(--%NS%mat-button-filled-icon-offset, -8px);
}
[dir=rtl] .mat-mdc-unelevated-button > .mat-icon {
  margin-right: var(--%NS%mat-button-filled-icon-offset, -8px);
  margin-left: var(--%NS%mat-button-filled-icon-spacing, 8px);
}
.mat-mdc-unelevated-button .mdc-button__label + .mat-icon {
  margin-right: var(--%NS%mat-button-filled-icon-offset, -8px);
  margin-left: var(--%NS%mat-button-filled-icon-spacing, 8px);
}
[dir=rtl] .mat-mdc-unelevated-button .mdc-button__label + .mat-icon {
  margin-right: var(--%NS%mat-button-filled-icon-spacing, 8px);
  margin-left: var(--%NS%mat-button-filled-icon-offset, -8px);
}
.mat-mdc-unelevated-button .mat-ripple-element {
  background-color: var(--%NS%mat-button-filled-ripple-color, color-mix(in srgb, var(--%NS%mat-sys-on-primary) calc(var(--%NS%mat-sys-pressed-state-layer-opacity) * 100%), transparent));
}
.mat-mdc-unelevated-button .mat-mdc-button-persistent-ripple::before {
  background-color: var(--%NS%mat-button-filled-state-layer-color, var(--%NS%mat-sys-on-primary));
}
.mat-mdc-unelevated-button.mat-mdc-button-disabled .mat-mdc-button-persistent-ripple::before {
  background-color: var(--%NS%mat-button-filled-disabled-state-layer-color, var(--%NS%mat-sys-on-surface-variant));
}
.mat-mdc-unelevated-button:hover > .mat-mdc-button-persistent-ripple::before {
  opacity: var(--%NS%mat-button-filled-hover-state-layer-opacity, var(--%NS%mat-sys-hover-state-layer-opacity));
}
.mat-mdc-unelevated-button.cdk-program-focused > .mat-mdc-button-persistent-ripple::before, .mat-mdc-unelevated-button.cdk-keyboard-focused > .mat-mdc-button-persistent-ripple::before, .mat-mdc-unelevated-button.mat-mdc-button-disabled-interactive:focus > .mat-mdc-button-persistent-ripple::before {
  opacity: var(--%NS%mat-button-filled-focus-state-layer-opacity, var(--%NS%mat-sys-focus-state-layer-opacity));
}
.mat-mdc-unelevated-button:active > .mat-mdc-button-persistent-ripple::before {
  opacity: var(--%NS%mat-button-filled-pressed-state-layer-opacity, var(--%NS%mat-sys-pressed-state-layer-opacity));
}
.mat-mdc-unelevated-button .mat-mdc-button-touch-target {
  position: absolute;
  top: 50%;
  height: var(--%NS%mat-button-filled-touch-target-size, 48px);
  display: var(--%NS%mat-button-filled-touch-target-display, block);
  left: 0;
  right: 0;
  transform: translateY(-50%);
}
.mat-mdc-unelevated-button:not(:disabled) {
  color: var(--%NS%mat-button-filled-label-text-color, var(--%NS%mat-sys-on-primary));
  background-color: var(--%NS%mat-button-filled-container-color, var(--%NS%mat-sys-primary));
}
.mat-mdc-unelevated-button, .mat-mdc-unelevated-button .mdc-button__ripple {
  border-radius: var(--%NS%mat-button-filled-container-shape, var(--%NS%mat-sys-corner-full));
}
.mat-mdc-unelevated-button .mat-mdc-button-progress-indicator-container {
  --%NS%mat-progress-spinner-active-indicator-color: var(--%NS%mat-button-filled-progress-active-indicator-color, var(--%NS%mat-sys-on-primary));
}
.mat-mdc-unelevated-button[disabled], .mat-mdc-unelevated-button.mat-mdc-button-disabled {
  cursor: default;
  pointer-events: none;
  color: var(--%NS%mat-button-filled-disabled-label-text-color, color-mix(in srgb, var(--%NS%mat-sys-on-surface) 38%, transparent));
  background-color: var(--%NS%mat-button-filled-disabled-container-color, color-mix(in srgb, var(--%NS%mat-sys-on-surface) 12%, transparent));
}
.mat-mdc-unelevated-button.mat-mdc-button-disabled-interactive {
  pointer-events: auto;
}

.mat-mdc-raised-button {
  transition: box-shadow 280ms cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: var(--%NS%mat-button-protected-container-elevation-shadow, var(--%NS%mat-sys-level1));
  height: var(--%NS%mat-button-protected-container-height, 40px);
  font-family: var(--%NS%mat-button-protected-label-text-font, var(--%NS%mat-sys-label-large-font));
  font-size: var(--%NS%mat-button-protected-label-text-size, var(--%NS%mat-sys-label-large-size));
  letter-spacing: var(--%NS%mat-button-protected-label-text-tracking, var(--%NS%mat-sys-label-large-tracking));
  text-transform: var(--%NS%mat-button-protected-label-text-transform);
  font-weight: var(--%NS%mat-button-protected-label-text-weight, var(--%NS%mat-sys-label-large-weight));
  padding: 0 var(--%NS%mat-button-protected-horizontal-padding, 24px);
}
.mat-mdc-raised-button > .mat-icon {
  margin-right: var(--%NS%mat-button-protected-icon-spacing, 8px);
  margin-left: var(--%NS%mat-button-protected-icon-offset, -8px);
}
[dir=rtl] .mat-mdc-raised-button > .mat-icon {
  margin-right: var(--%NS%mat-button-protected-icon-offset, -8px);
  margin-left: var(--%NS%mat-button-protected-icon-spacing, 8px);
}
.mat-mdc-raised-button .mdc-button__label + .mat-icon {
  margin-right: var(--%NS%mat-button-protected-icon-offset, -8px);
  margin-left: var(--%NS%mat-button-protected-icon-spacing, 8px);
}
[dir=rtl] .mat-mdc-raised-button .mdc-button__label + .mat-icon {
  margin-right: var(--%NS%mat-button-protected-icon-spacing, 8px);
  margin-left: var(--%NS%mat-button-protected-icon-offset, -8px);
}
.mat-mdc-raised-button .mat-ripple-element {
  background-color: var(--%NS%mat-button-protected-ripple-color, color-mix(in srgb, var(--%NS%mat-sys-primary) calc(var(--%NS%mat-sys-pressed-state-layer-opacity) * 100%), transparent));
}
.mat-mdc-raised-button .mat-mdc-button-persistent-ripple::before {
  background-color: var(--%NS%mat-button-protected-state-layer-color, var(--%NS%mat-sys-primary));
}
.mat-mdc-raised-button.mat-mdc-button-disabled .mat-mdc-button-persistent-ripple::before {
  background-color: var(--%NS%mat-button-protected-disabled-state-layer-color, var(--%NS%mat-sys-on-surface-variant));
}
.mat-mdc-raised-button:hover > .mat-mdc-button-persistent-ripple::before {
  opacity: var(--%NS%mat-button-protected-hover-state-layer-opacity, var(--%NS%mat-sys-hover-state-layer-opacity));
}
.mat-mdc-raised-button.cdk-program-focused > .mat-mdc-button-persistent-ripple::before, .mat-mdc-raised-button.cdk-keyboard-focused > .mat-mdc-button-persistent-ripple::before, .mat-mdc-raised-button.mat-mdc-button-disabled-interactive:focus > .mat-mdc-button-persistent-ripple::before {
  opacity: var(--%NS%mat-button-protected-focus-state-layer-opacity, var(--%NS%mat-sys-focus-state-layer-opacity));
}
.mat-mdc-raised-button:active > .mat-mdc-button-persistent-ripple::before {
  opacity: var(--%NS%mat-button-protected-pressed-state-layer-opacity, var(--%NS%mat-sys-pressed-state-layer-opacity));
}
.mat-mdc-raised-button .mat-mdc-button-touch-target {
  position: absolute;
  top: 50%;
  height: var(--%NS%mat-button-protected-touch-target-size, 48px);
  display: var(--%NS%mat-button-protected-touch-target-display, block);
  left: 0;
  right: 0;
  transform: translateY(-50%);
}
.mat-mdc-raised-button:not(:disabled) {
  color: var(--%NS%mat-button-protected-label-text-color, var(--%NS%mat-sys-primary));
  background-color: var(--%NS%mat-button-protected-container-color, var(--%NS%mat-sys-surface));
}
.mat-mdc-raised-button, .mat-mdc-raised-button .mdc-button__ripple {
  border-radius: var(--%NS%mat-button-protected-container-shape, var(--%NS%mat-sys-corner-full));
}
@media (hover: hover) {
  .mat-mdc-raised-button:hover {
    box-shadow: var(--%NS%mat-button-protected-hover-container-elevation-shadow, var(--%NS%mat-sys-level2));
  }
}
.mat-mdc-raised-button:focus {
  box-shadow: var(--%NS%mat-button-protected-focus-container-elevation-shadow, var(--%NS%mat-sys-level1));
}
.mat-mdc-raised-button:active, .mat-mdc-raised-button:focus:active {
  box-shadow: var(--%NS%mat-button-protected-pressed-container-elevation-shadow, var(--%NS%mat-sys-level1));
}
.mat-mdc-raised-button[disabled], .mat-mdc-raised-button.mat-mdc-button-disabled {
  cursor: default;
  pointer-events: none;
  color: var(--%NS%mat-button-protected-disabled-label-text-color, color-mix(in srgb, var(--%NS%mat-sys-on-surface) 38%, transparent));
  background-color: var(--%NS%mat-button-protected-disabled-container-color, color-mix(in srgb, var(--%NS%mat-sys-on-surface) 12%, transparent));
}
.mat-mdc-raised-button[disabled].mat-mdc-button-disabled, .mat-mdc-raised-button.mat-mdc-button-disabled.mat-mdc-button-disabled {
  box-shadow: var(--%NS%mat-button-protected-disabled-container-elevation-shadow, var(--%NS%mat-sys-level0));
}
.mat-mdc-raised-button.mat-mdc-button-disabled-interactive {
  pointer-events: auto;
}

.mat-mdc-outlined-button {
  border-style: solid;
  transition: border 280ms cubic-bezier(0.4, 0, 0.2, 1);
  height: var(--%NS%mat-button-outlined-container-height, 40px);
  font-family: var(--%NS%mat-button-outlined-label-text-font, var(--%NS%mat-sys-label-large-font));
  font-size: var(--%NS%mat-button-outlined-label-text-size, var(--%NS%mat-sys-label-large-size));
  letter-spacing: var(--%NS%mat-button-outlined-label-text-tracking, var(--%NS%mat-sys-label-large-tracking));
  text-transform: var(--%NS%mat-button-outlined-label-text-transform);
  font-weight: var(--%NS%mat-button-outlined-label-text-weight, var(--%NS%mat-sys-label-large-weight));
  border-radius: var(--%NS%mat-button-outlined-container-shape, var(--%NS%mat-sys-corner-full));
  border-width: var(--%NS%mat-button-outlined-outline-width, 1px);
  padding: 0 var(--%NS%mat-button-outlined-horizontal-padding, 24px);
}
.mat-mdc-outlined-button > .mat-icon {
  margin-right: var(--%NS%mat-button-outlined-icon-spacing, 8px);
  margin-left: var(--%NS%mat-button-outlined-icon-offset, -8px);
}
[dir=rtl] .mat-mdc-outlined-button > .mat-icon {
  margin-right: var(--%NS%mat-button-outlined-icon-offset, -8px);
  margin-left: var(--%NS%mat-button-outlined-icon-spacing, 8px);
}
.mat-mdc-outlined-button .mdc-button__label + .mat-icon {
  margin-right: var(--%NS%mat-button-outlined-icon-offset, -8px);
  margin-left: var(--%NS%mat-button-outlined-icon-spacing, 8px);
}
[dir=rtl] .mat-mdc-outlined-button .mdc-button__label + .mat-icon {
  margin-right: var(--%NS%mat-button-outlined-icon-spacing, 8px);
  margin-left: var(--%NS%mat-button-outlined-icon-offset, -8px);
}
.mat-mdc-outlined-button .mat-ripple-element {
  background-color: var(--%NS%mat-button-outlined-ripple-color, color-mix(in srgb, var(--%NS%mat-sys-primary) calc(var(--%NS%mat-sys-pressed-state-layer-opacity) * 100%), transparent));
}
.mat-mdc-outlined-button .mat-mdc-button-persistent-ripple::before {
  background-color: var(--%NS%mat-button-outlined-state-layer-color, var(--%NS%mat-sys-primary));
}
.mat-mdc-outlined-button.mat-mdc-button-disabled .mat-mdc-button-persistent-ripple::before {
  background-color: var(--%NS%mat-button-outlined-disabled-state-layer-color, var(--%NS%mat-sys-on-surface-variant));
}
.mat-mdc-outlined-button:hover > .mat-mdc-button-persistent-ripple::before {
  opacity: var(--%NS%mat-button-outlined-hover-state-layer-opacity, var(--%NS%mat-sys-hover-state-layer-opacity));
}
.mat-mdc-outlined-button.cdk-program-focused > .mat-mdc-button-persistent-ripple::before, .mat-mdc-outlined-button.cdk-keyboard-focused > .mat-mdc-button-persistent-ripple::before, .mat-mdc-outlined-button.mat-mdc-button-disabled-interactive:focus > .mat-mdc-button-persistent-ripple::before {
  opacity: var(--%NS%mat-button-outlined-focus-state-layer-opacity, var(--%NS%mat-sys-focus-state-layer-opacity));
}
.mat-mdc-outlined-button:active > .mat-mdc-button-persistent-ripple::before {
  opacity: var(--%NS%mat-button-outlined-pressed-state-layer-opacity, var(--%NS%mat-sys-pressed-state-layer-opacity));
}
.mat-mdc-outlined-button .mat-mdc-button-touch-target {
  position: absolute;
  top: 50%;
  height: var(--%NS%mat-button-outlined-touch-target-size, 48px);
  display: var(--%NS%mat-button-outlined-touch-target-display, block);
  left: 0;
  right: 0;
  transform: translateY(-50%);
}
.mat-mdc-outlined-button:not(:disabled) {
  color: var(--%NS%mat-button-outlined-label-text-color, var(--%NS%mat-sys-primary));
  border-color: var(--%NS%mat-button-outlined-outline-color, var(--%NS%mat-sys-outline));
}
.mat-mdc-outlined-button[disabled], .mat-mdc-outlined-button.mat-mdc-button-disabled {
  cursor: default;
  pointer-events: none;
  color: var(--%NS%mat-button-outlined-disabled-label-text-color, color-mix(in srgb, var(--%NS%mat-sys-on-surface) 38%, transparent));
  border-color: var(--%NS%mat-button-outlined-disabled-outline-color, color-mix(in srgb, var(--%NS%mat-sys-on-surface) 12%, transparent));
}
.mat-mdc-outlined-button.mat-mdc-button-disabled-interactive {
  pointer-events: auto;
}

.mat-tonal-button {
  transition: box-shadow 280ms cubic-bezier(0.4, 0, 0.2, 1);
  height: var(--%NS%mat-button-tonal-container-height, 40px);
  font-family: var(--%NS%mat-button-tonal-label-text-font, var(--%NS%mat-sys-label-large-font));
  font-size: var(--%NS%mat-button-tonal-label-text-size, var(--%NS%mat-sys-label-large-size));
  letter-spacing: var(--%NS%mat-button-tonal-label-text-tracking, var(--%NS%mat-sys-label-large-tracking));
  text-transform: var(--%NS%mat-button-tonal-label-text-transform);
  font-weight: var(--%NS%mat-button-tonal-label-text-weight, var(--%NS%mat-sys-label-large-weight));
  padding: 0 var(--%NS%mat-button-tonal-horizontal-padding, 24px);
}
.mat-tonal-button:not(:disabled) {
  color: var(--%NS%mat-button-tonal-label-text-color, var(--%NS%mat-sys-on-secondary-container));
  background-color: var(--%NS%mat-button-tonal-container-color, var(--%NS%mat-sys-secondary-container));
}
.mat-tonal-button, .mat-tonal-button .mdc-button__ripple {
  border-radius: var(--%NS%mat-button-tonal-container-shape, var(--%NS%mat-sys-corner-full));
}
.mat-tonal-button[disabled], .mat-tonal-button.mat-mdc-button-disabled {
  cursor: default;
  pointer-events: none;
  color: var(--%NS%mat-button-tonal-disabled-label-text-color, color-mix(in srgb, var(--%NS%mat-sys-on-surface) 38%, transparent));
  background-color: var(--%NS%mat-button-tonal-disabled-container-color, color-mix(in srgb, var(--%NS%mat-sys-on-surface) 12%, transparent));
}
.mat-tonal-button.mat-mdc-button-disabled-interactive {
  pointer-events: auto;
}
.mat-tonal-button > .mat-icon {
  margin-right: var(--%NS%mat-button-tonal-icon-spacing, 8px);
  margin-left: var(--%NS%mat-button-tonal-icon-offset, -8px);
}
[dir=rtl] .mat-tonal-button > .mat-icon {
  margin-right: var(--%NS%mat-button-tonal-icon-offset, -8px);
  margin-left: var(--%NS%mat-button-tonal-icon-spacing, 8px);
}
.mat-tonal-button .mdc-button__label + .mat-icon {
  margin-right: var(--%NS%mat-button-tonal-icon-offset, -8px);
  margin-left: var(--%NS%mat-button-tonal-icon-spacing, 8px);
}
[dir=rtl] .mat-tonal-button .mdc-button__label + .mat-icon {
  margin-right: var(--%NS%mat-button-tonal-icon-spacing, 8px);
  margin-left: var(--%NS%mat-button-tonal-icon-offset, -8px);
}
.mat-tonal-button .mat-ripple-element {
  background-color: var(--%NS%mat-button-tonal-ripple-color, color-mix(in srgb, var(--%NS%mat-sys-on-secondary-container) calc(var(--%NS%mat-sys-pressed-state-layer-opacity) * 100%), transparent));
}
.mat-tonal-button .mat-mdc-button-persistent-ripple::before {
  background-color: var(--%NS%mat-button-tonal-state-layer-color, var(--%NS%mat-sys-on-secondary-container));
}
.mat-tonal-button.mat-mdc-button-disabled .mat-mdc-button-persistent-ripple::before {
  background-color: var(--%NS%mat-button-tonal-disabled-state-layer-color, var(--%NS%mat-sys-on-surface-variant));
}
.mat-tonal-button:hover > .mat-mdc-button-persistent-ripple::before {
  opacity: var(--%NS%mat-button-tonal-hover-state-layer-opacity, var(--%NS%mat-sys-hover-state-layer-opacity));
}
.mat-tonal-button.cdk-program-focused > .mat-mdc-button-persistent-ripple::before, .mat-tonal-button.cdk-keyboard-focused > .mat-mdc-button-persistent-ripple::before, .mat-tonal-button.mat-mdc-button-disabled-interactive:focus > .mat-mdc-button-persistent-ripple::before {
  opacity: var(--%NS%mat-button-tonal-focus-state-layer-opacity, var(--%NS%mat-sys-focus-state-layer-opacity));
}
.mat-tonal-button:active > .mat-mdc-button-persistent-ripple::before {
  opacity: var(--%NS%mat-button-tonal-pressed-state-layer-opacity, var(--%NS%mat-sys-pressed-state-layer-opacity));
}
.mat-tonal-button .mat-mdc-button-touch-target {
  position: absolute;
  top: 50%;
  height: var(--%NS%mat-button-tonal-touch-target-size, 48px);
  display: var(--%NS%mat-button-tonal-touch-target-display, block);
  left: 0;
  right: 0;
  transform: translateY(-50%);
}

.mat-mdc-button,
.mat-mdc-unelevated-button,
.mat-mdc-raised-button,
.mat-mdc-outlined-button,
.mat-tonal-button {
  -webkit-tap-highlight-color: transparent;
}
.mat-mdc-button .mat-mdc-button-ripple,
.mat-mdc-button .mat-mdc-button-persistent-ripple,
.mat-mdc-button .mat-mdc-button-persistent-ripple::before,
.mat-mdc-unelevated-button .mat-mdc-button-ripple,
.mat-mdc-unelevated-button .mat-mdc-button-persistent-ripple,
.mat-mdc-unelevated-button .mat-mdc-button-persistent-ripple::before,
.mat-mdc-raised-button .mat-mdc-button-ripple,
.mat-mdc-raised-button .mat-mdc-button-persistent-ripple,
.mat-mdc-raised-button .mat-mdc-button-persistent-ripple::before,
.mat-mdc-outlined-button .mat-mdc-button-ripple,
.mat-mdc-outlined-button .mat-mdc-button-persistent-ripple,
.mat-mdc-outlined-button .mat-mdc-button-persistent-ripple::before,
.mat-tonal-button .mat-mdc-button-ripple,
.mat-tonal-button .mat-mdc-button-persistent-ripple,
.mat-tonal-button .mat-mdc-button-persistent-ripple::before {
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  position: absolute;
  pointer-events: none;
  border-radius: inherit;
}
.mat-mdc-button .mat-mdc-button-ripple,
.mat-mdc-unelevated-button .mat-mdc-button-ripple,
.mat-mdc-raised-button .mat-mdc-button-ripple,
.mat-mdc-outlined-button .mat-mdc-button-ripple,
.mat-tonal-button .mat-mdc-button-ripple {
  overflow: hidden;
}
.mat-mdc-button .mat-mdc-button-persistent-ripple::before,
.mat-mdc-unelevated-button .mat-mdc-button-persistent-ripple::before,
.mat-mdc-raised-button .mat-mdc-button-persistent-ripple::before,
.mat-mdc-outlined-button .mat-mdc-button-persistent-ripple::before,
.mat-tonal-button .mat-mdc-button-persistent-ripple::before {
  content: "";
  opacity: 0;
}
.mat-mdc-button .mdc-button__label,
.mat-mdc-button .mat-icon,
.mat-mdc-unelevated-button .mdc-button__label,
.mat-mdc-unelevated-button .mat-icon,
.mat-mdc-raised-button .mdc-button__label,
.mat-mdc-raised-button .mat-icon,
.mat-mdc-outlined-button .mdc-button__label,
.mat-mdc-outlined-button .mat-icon,
.mat-tonal-button .mdc-button__label,
.mat-tonal-button .mat-icon {
  z-index: 1;
  position: relative;
}
.mat-mdc-button .mat-focus-indicator,
.mat-mdc-unelevated-button .mat-focus-indicator,
.mat-mdc-raised-button .mat-focus-indicator,
.mat-mdc-outlined-button .mat-focus-indicator,
.mat-tonal-button .mat-focus-indicator {
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  position: absolute;
  border-radius: inherit;
}
.mat-mdc-button:focus-visible > .mat-focus-indicator::before,
.mat-mdc-unelevated-button:focus-visible > .mat-focus-indicator::before,
.mat-mdc-raised-button:focus-visible > .mat-focus-indicator::before,
.mat-mdc-outlined-button:focus-visible > .mat-focus-indicator::before,
.mat-tonal-button:focus-visible > .mat-focus-indicator::before {
  content: "";
  border-radius: inherit;
}
.mat-mdc-button._mat-animation-noopable,
.mat-mdc-unelevated-button._mat-animation-noopable,
.mat-mdc-raised-button._mat-animation-noopable,
.mat-mdc-outlined-button._mat-animation-noopable,
.mat-tonal-button._mat-animation-noopable {
  transition: none !important;
  animation: none !important;
}
.mat-mdc-button > .mat-icon,
.mat-mdc-unelevated-button > .mat-icon,
.mat-mdc-raised-button > .mat-icon,
.mat-mdc-outlined-button > .mat-icon,
.mat-tonal-button > .mat-icon {
  display: inline-block;
  position: relative;
  vertical-align: top;
  font-size: 1.125rem;
  height: 1.125rem;
  width: 1.125rem;
}

.mat-mdc-outlined-button .mat-mdc-button-ripple,
.mat-mdc-outlined-button .mdc-button__ripple {
  top: -1px;
  left: -1px;
  bottom: -1px;
  right: -1px;
}

.mat-mdc-unelevated-button .mat-focus-indicator::before,
.mat-tonal-button .mat-focus-indicator::before,
.mat-mdc-raised-button .mat-focus-indicator::before {
  margin: calc(calc(var(--%NS%mat-focus-indicator-border-width, 3px) + 2px) * -1);
}

.mat-mdc-outlined-button .mat-focus-indicator::before {
  margin: calc(calc(var(--%NS%mat-focus-indicator-border-width, 3px) + 3px) * -1);
}

.mat-mdc-button-progress-indicator-container {
  position: absolute;
  inset-inline-start: 0;
  inset-block-start: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
}

.mat-mdc-button-progress-indicator-shown mat-icon,
.mat-mdc-button-progress-indicator-shown [matButtonIcon],
.mat-mdc-button-progress-indicator-shown .mdc-button__label {
  visibility: hidden;
}
`,`@media (forced-colors: active) {
  .mat-mdc-button:not(.mdc-button--outlined),
  .mat-mdc-unelevated-button:not(.mdc-button--outlined),
  .mat-mdc-raised-button:not(.mdc-button--outlined),
  .mat-mdc-outlined-button:not(.mdc-button--outlined),
  .mat-mdc-button-base.mat-tonal-button,
  .mat-mdc-icon-button.mat-mdc-icon-button,
  .mat-mdc-outlined-button .mdc-button__ripple {
    outline: solid 1px;
  }
}
`],encapsulation:2})})()}return t})();function lA(t){return t.hasAttribute("mat-raised-button")?"elevated":t.hasAttribute("mat-stroked-button")?"outlined":t.hasAttribute("mat-flat-button")?"filled":t.hasAttribute("mat-button")?"text":null}var dA=new D("mat-mdc-fab-default-options",{providedIn:"root",factory:()=>yg}),yg={color:"accent"};var mS=(()=>{class t extends Mu{_options=p(dA,{optional:!0});_isFab=!0;constructor(){super(),this._options=this._options||yg,this.color=this._options.color||yg.color}static \u0275fac=function(i){return new(i||t)};static \u0275cmp=(function(){let e=[[["",8,"material-icons",3,"iconPositionEnd",""],["mat-icon",3,"iconPositionEnd",""],["","matButtonIcon","",3,"iconPositionEnd",""],["",8,"material-symbols-outlined",3,"iconPositionEnd",""],["",8,"material-symbols-rounded",3,"iconPositionEnd",""],["",8,"material-symbols-sharp",3,"iconPositionEnd",""]],"*",[["","iconPositionEnd","",8,"material-icons"],["mat-icon","iconPositionEnd",""],["","matButtonIcon","","iconPositionEnd",""],["","iconPositionEnd","",8,"material-symbols-outlined"],["","iconPositionEnd","",8,"material-symbols-rounded"],["","iconPositionEnd","",8,"material-symbols-sharp"]],[["","progressIndicator",""]]],i=[".material-icons:not([iconPositionEnd]), mat-icon:not([iconPositionEnd]), [matButtonIcon]:not([iconPositionEnd]), .material-symbols-outlined:not([iconPositionEnd]), .material-symbols-rounded:not([iconPositionEnd]), .material-symbols-sharp:not([iconPositionEnd])","*",".material-icons[iconPositionEnd], mat-icon[iconPositionEnd], [matButtonIcon][iconPositionEnd], .material-symbols-outlined[iconPositionEnd], .material-symbols-rounded[iconPositionEnd], .material-symbols-sharp[iconPositionEnd]","[progressIndicator]"];function o(a,r){a&1&&(Je(0,"div",2),oe(1,3),it())}return H({type:t,selectors:[["button","mat-mini-fab",""],["a","mat-mini-fab",""],["button","matMiniFab",""],["a","matMiniFab",""]],hostAttrs:[1,"mdc-fab","mat-mdc-fab-base","mdc-fab--mini","mat-mdc-mini-fab"],exportAs:["matButton","matAnchor"],features:[Ge],ngContentSelectors:i,decls:8,vars:5,consts:[[1,"mat-mdc-button-persistent-ripple"],[1,"mdc-button__label"],[1,"mat-mdc-button-progress-indicator-container"],[1,"mat-focus-indicator"],[1,"mat-mdc-button-touch-target"]],template:function(r,s){r&1&&(Be(e),Dt(0,"span",0),oe(1),Je(2,"span",1),oe(3,1),it(),oe(4,2),k(5,o,2,0,"div",2),Dt(6,"span",3)(7,"span",4)),r&2&&(z("mdc-button__ripple",!s._isFab)("mdc-fab__ripple",s._isFab),h(5),N(s.showProgress()?5:-1))},styles:[`.mat-mdc-fab-base {
  -webkit-user-select: none;
  user-select: none;
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  width: 56px;
  height: 56px;
  padding: 0;
  border: none;
  fill: currentColor;
  text-decoration: none;
  cursor: pointer;
  -moz-appearance: none;
  -webkit-appearance: none;
  overflow: visible;
  transition: box-shadow 280ms cubic-bezier(0.4, 0, 0.2, 1), opacity 15ms linear 30ms, transform 270ms 0ms cubic-bezier(0, 0, 0.2, 1);
  flex-shrink: 0;
  -webkit-tap-highlight-color: transparent;
}
.mat-mdc-fab-base .mat-mdc-button-ripple,
.mat-mdc-fab-base .mat-mdc-button-persistent-ripple,
.mat-mdc-fab-base .mat-mdc-button-persistent-ripple::before {
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  position: absolute;
  pointer-events: none;
  border-radius: inherit;
}
.mat-mdc-fab-base .mat-mdc-button-ripple {
  overflow: hidden;
}
.mat-mdc-fab-base .mat-mdc-button-persistent-ripple::before {
  content: "";
  opacity: 0;
}
.mat-mdc-fab-base .mdc-button__label,
.mat-mdc-fab-base .mat-icon {
  z-index: 1;
  position: relative;
}
.mat-mdc-fab-base .mat-focus-indicator {
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  position: absolute;
}
.mat-mdc-fab-base:focus-visible > .mat-focus-indicator::before {
  content: "";
}
.mat-mdc-fab-base._mat-animation-noopable {
  transition: none !important;
  animation: none !important;
}
.mat-mdc-fab-base::before {
  position: absolute;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  border: 1px solid transparent;
  border-radius: inherit;
  content: "";
  pointer-events: none;
}
.mat-mdc-fab-base[hidden] {
  display: none;
}
.mat-mdc-fab-base::-moz-focus-inner {
  padding: 0;
  border: 0;
}
.mat-mdc-fab-base:active, .mat-mdc-fab-base:focus {
  outline: none;
}
.mat-mdc-fab-base:hover {
  cursor: pointer;
}
.mat-mdc-fab-base > svg {
  width: 100%;
}
.mat-mdc-fab-base .mat-icon,
.mat-mdc-fab-base .material-icons,
.mat-mdc-fab-base .material-symbols-outlined,
.mat-mdc-fab-base .material-symbols-rounded,
.mat-mdc-fab-base .material-symbols-sharp {
  transition: transform 180ms 90ms cubic-bezier(0, 0, 0.2, 1);
  fill: currentColor;
  will-change: transform;
}
.mat-mdc-fab-base .mat-focus-indicator::before {
  margin: calc(calc(var(--%NS%mat-focus-indicator-border-width, 3px) + 2px) * -1);
  border-radius: calc(var(--%NS%mat-fab-container-shape, var(--%NS%mat-sys-corner-large)) + calc(var(--%NS%mat-focus-indicator-border-width, 3px) + 2px));
}
.mat-mdc-fab-base[disabled], .mat-mdc-fab-base.mat-mdc-button-disabled {
  cursor: default;
  pointer-events: none;
}
.mat-mdc-fab-base[disabled], .mat-mdc-fab-base[disabled]:focus, .mat-mdc-fab-base.mat-mdc-button-disabled, .mat-mdc-fab-base.mat-mdc-button-disabled:focus {
  box-shadow: none;
}
.mat-mdc-fab-base.mat-mdc-button-disabled-interactive {
  pointer-events: auto;
}

.mat-mdc-fab {
  background-color: var(--%NS%mat-fab-container-color, var(--%NS%mat-sys-primary-container));
  border-radius: var(--%NS%mat-fab-container-shape, var(--%NS%mat-sys-corner-large));
  color: var(--%NS%mat-fab-foreground-color, var(--%NS%mat-sys-on-primary-container, inherit));
  box-shadow: var(--%NS%mat-fab-container-elevation-shadow, var(--%NS%mat-sys-level3));
}
@media (hover: hover) {
  .mat-mdc-fab:hover {
    box-shadow: var(--%NS%mat-fab-hover-container-elevation-shadow, var(--%NS%mat-sys-level4));
  }
}
.mat-mdc-fab:focus {
  box-shadow: var(--%NS%mat-fab-focus-container-elevation-shadow, var(--%NS%mat-sys-level3));
}
.mat-mdc-fab:active, .mat-mdc-fab:focus:active {
  box-shadow: var(--%NS%mat-fab-pressed-container-elevation-shadow, var(--%NS%mat-sys-level3));
}
.mat-mdc-fab[disabled], .mat-mdc-fab.mat-mdc-button-disabled {
  cursor: default;
  pointer-events: none;
  color: var(--%NS%mat-fab-disabled-state-foreground-color, color-mix(in srgb, var(--%NS%mat-sys-on-surface) 38%, transparent));
  background-color: var(--%NS%mat-fab-disabled-state-container-color, color-mix(in srgb, var(--%NS%mat-sys-on-surface) 12%, transparent));
}
.mat-mdc-fab.mat-mdc-button-disabled-interactive {
  pointer-events: auto;
}
.mat-mdc-fab .mat-mdc-button-touch-target {
  position: absolute;
  top: 50%;
  height: var(--%NS%mat-fab-touch-target-size, 48px);
  display: var(--%NS%mat-fab-touch-target-display, block);
  left: 50%;
  width: var(--%NS%mat-fab-touch-target-size, 48px);
  transform: translate(-50%, -50%);
}
.mat-mdc-fab .mat-ripple-element {
  background-color: var(--%NS%mat-fab-ripple-color, color-mix(in srgb, var(--%NS%mat-sys-on-primary-container) calc(var(--%NS%mat-sys-pressed-state-layer-opacity) * 100%), transparent));
}
.mat-mdc-fab .mat-mdc-button-persistent-ripple::before {
  background-color: var(--%NS%mat-fab-state-layer-color, var(--%NS%mat-sys-on-primary-container));
}
.mat-mdc-fab.mat-mdc-button-disabled .mat-mdc-button-persistent-ripple::before {
  background-color: var(--%NS%mat-fab-disabled-state-layer-color);
}
.mat-mdc-fab:hover > .mat-mdc-button-persistent-ripple::before {
  opacity: var(--%NS%mat-fab-hover-state-layer-opacity, var(--%NS%mat-sys-hover-state-layer-opacity));
}
.mat-mdc-fab.cdk-program-focused > .mat-mdc-button-persistent-ripple::before, .mat-mdc-fab.cdk-keyboard-focused > .mat-mdc-button-persistent-ripple::before, .mat-mdc-fab.mat-mdc-button-disabled-interactive:focus > .mat-mdc-button-persistent-ripple::before {
  opacity: var(--%NS%mat-fab-focus-state-layer-opacity, var(--%NS%mat-sys-focus-state-layer-opacity));
}
.mat-mdc-fab:active > .mat-mdc-button-persistent-ripple::before {
  opacity: var(--%NS%mat-fab-pressed-state-layer-opacity, var(--%NS%mat-sys-pressed-state-layer-opacity));
}

.mat-mdc-mini-fab {
  width: 40px;
  height: 40px;
  background-color: var(--%NS%mat-fab-small-container-color, var(--%NS%mat-sys-primary-container));
  border-radius: var(--%NS%mat-fab-small-container-shape, var(--%NS%mat-sys-corner-medium));
  color: var(--%NS%mat-fab-small-foreground-color, var(--%NS%mat-sys-on-primary-container, inherit));
  box-shadow: var(--%NS%mat-fab-small-container-elevation-shadow, var(--%NS%mat-sys-level3));
}
@media (hover: hover) {
  .mat-mdc-mini-fab:hover {
    box-shadow: var(--%NS%mat-fab-small-hover-container-elevation-shadow, var(--%NS%mat-sys-level4));
  }
}
.mat-mdc-mini-fab:focus {
  box-shadow: var(--%NS%mat-fab-small-focus-container-elevation-shadow, var(--%NS%mat-sys-level3));
}
.mat-mdc-mini-fab:active, .mat-mdc-mini-fab:focus:active {
  box-shadow: var(--%NS%mat-fab-small-pressed-container-elevation-shadow, var(--%NS%mat-sys-level3));
}
.mat-mdc-mini-fab .mat-focus-indicator::before {
  border-radius: calc(var(--%NS%mat-fab-small-container-shape, var(--%NS%mat-sys-corner-medium)) + calc(var(--%NS%mat-focus-indicator-border-width, 3px) + 2px));
}
.mat-mdc-mini-fab[disabled], .mat-mdc-mini-fab.mat-mdc-button-disabled {
  cursor: default;
  pointer-events: none;
  color: var(--%NS%mat-fab-small-disabled-state-foreground-color, color-mix(in srgb, var(--%NS%mat-sys-on-surface) 38%, transparent));
  background-color: var(--%NS%mat-fab-small-disabled-state-container-color, color-mix(in srgb, var(--%NS%mat-sys-on-surface) 12%, transparent));
}
.mat-mdc-mini-fab.mat-mdc-button-disabled-interactive {
  pointer-events: auto;
}
.mat-mdc-mini-fab .mat-mdc-button-touch-target {
  position: absolute;
  top: 50%;
  height: var(--%NS%mat-fab-small-touch-target-size, 48px);
  display: var(--%NS%mat-fab-small-touch-target-display);
  left: 50%;
  width: var(--%NS%mat-fab-small-touch-target-size, 48px);
  transform: translate(-50%, -50%);
}
.mat-mdc-mini-fab .mat-ripple-element {
  background-color: var(--%NS%mat-fab-small-ripple-color, color-mix(in srgb, var(--%NS%mat-sys-on-primary-container) calc(var(--%NS%mat-sys-pressed-state-layer-opacity) * 100%), transparent));
}
.mat-mdc-mini-fab .mat-mdc-button-persistent-ripple::before {
  background-color: var(--%NS%mat-fab-small-state-layer-color, var(--%NS%mat-sys-on-primary-container));
}
.mat-mdc-mini-fab.mat-mdc-button-disabled .mat-mdc-button-persistent-ripple::before {
  background-color: var(--%NS%mat-fab-small-disabled-state-layer-color);
}
.mat-mdc-mini-fab:hover > .mat-mdc-button-persistent-ripple::before {
  opacity: var(--%NS%mat-fab-small-hover-state-layer-opacity, var(--%NS%mat-sys-hover-state-layer-opacity));
}
.mat-mdc-mini-fab.cdk-program-focused > .mat-mdc-button-persistent-ripple::before, .mat-mdc-mini-fab.cdk-keyboard-focused > .mat-mdc-button-persistent-ripple::before, .mat-mdc-mini-fab.mat-mdc-button-disabled-interactive:focus > .mat-mdc-button-persistent-ripple::before {
  opacity: var(--%NS%mat-fab-small-focus-state-layer-opacity, var(--%NS%mat-sys-focus-state-layer-opacity));
}
.mat-mdc-mini-fab:active > .mat-mdc-button-persistent-ripple::before {
  opacity: var(--%NS%mat-fab-small-pressed-state-layer-opacity, var(--%NS%mat-sys-pressed-state-layer-opacity));
}

.mat-mdc-extended-fab {
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  padding-left: 20px;
  padding-right: 20px;
  width: auto;
  max-width: 100%;
  line-height: normal;
  box-shadow: var(--%NS%mat-fab-extended-container-elevation-shadow, var(--%NS%mat-sys-level3));
  height: var(--%NS%mat-fab-extended-container-height, 56px);
  border-radius: var(--%NS%mat-fab-extended-container-shape, var(--%NS%mat-sys-corner-large));
  font-family: var(--%NS%mat-fab-extended-label-text-font, var(--%NS%mat-sys-label-large-font));
  font-size: var(--%NS%mat-fab-extended-label-text-size, var(--%NS%mat-sys-label-large-size));
  font-weight: var(--%NS%mat-fab-extended-label-text-weight, var(--%NS%mat-sys-label-large-weight));
  letter-spacing: var(--%NS%mat-fab-extended-label-text-tracking, var(--%NS%mat-sys-label-large-tracking));
}
@media (hover: hover) {
  .mat-mdc-extended-fab:hover {
    box-shadow: var(--%NS%mat-fab-extended-hover-container-elevation-shadow, var(--%NS%mat-sys-level4));
  }
}
.mat-mdc-extended-fab:focus {
  box-shadow: var(--%NS%mat-fab-extended-focus-container-elevation-shadow, var(--%NS%mat-sys-level3));
}
.mat-mdc-extended-fab:active, .mat-mdc-extended-fab:focus:active {
  box-shadow: var(--%NS%mat-fab-extended-pressed-container-elevation-shadow, var(--%NS%mat-sys-level3));
}
.mat-mdc-extended-fab[disabled], .mat-mdc-extended-fab.mat-mdc-button-disabled {
  cursor: default;
  pointer-events: none;
}
.mat-mdc-extended-fab[disabled], .mat-mdc-extended-fab[disabled]:focus, .mat-mdc-extended-fab.mat-mdc-button-disabled, .mat-mdc-extended-fab.mat-mdc-button-disabled:focus {
  box-shadow: none;
}
.mat-mdc-extended-fab.mat-mdc-button-disabled-interactive {
  pointer-events: auto;
}
[dir=rtl] .mat-mdc-extended-fab .mdc-button__label + .mat-icon, [dir=rtl] .mat-mdc-extended-fab .mdc-button__label + .material-icons, [dir=rtl] .mat-mdc-extended-fab .mdc-button__label + .material-symbols-outlined, [dir=rtl] .mat-mdc-extended-fab .mdc-button__label + .material-symbols-rounded, [dir=rtl] .mat-mdc-extended-fab .mdc-button__label + .material-symbols-sharp,
.mat-mdc-extended-fab > .mat-icon,
.mat-mdc-extended-fab > .material-icons,
.mat-mdc-extended-fab > .material-symbols-outlined,
.mat-mdc-extended-fab > .material-symbols-rounded,
.mat-mdc-extended-fab > .material-symbols-sharp {
  margin-left: -8px;
  margin-right: 12px;
}
.mat-mdc-extended-fab .mdc-button__label + .mat-icon,
.mat-mdc-extended-fab .mdc-button__label + .material-icons,
.mat-mdc-extended-fab .mdc-button__label + .material-symbols-outlined,
.mat-mdc-extended-fab .mdc-button__label + .material-symbols-rounded,
.mat-mdc-extended-fab .mdc-button__label + .material-symbols-sharp, [dir=rtl] .mat-mdc-extended-fab > .mat-icon, [dir=rtl] .mat-mdc-extended-fab > .material-icons, [dir=rtl] .mat-mdc-extended-fab > .material-symbols-outlined, [dir=rtl] .mat-mdc-extended-fab > .material-symbols-rounded, [dir=rtl] .mat-mdc-extended-fab > .material-symbols-sharp {
  margin-left: 12px;
  margin-right: -8px;
}
.mat-mdc-extended-fab .mat-mdc-button-touch-target {
  width: 100%;
}

.mat-mdc-button-progress-indicator-container {
  position: absolute;
  inset-inline-start: 0;
  margin-block-start: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
}

.mat-mdc-button-progress-indicator-shown mat-icon,
.mat-mdc-button-progress-indicator-shown [matButtonIcon],
.mat-mdc-button-progress-indicator-shown .mdc-button__label {
  visibility: hidden;
}
`],encapsulation:2})})()}return t})();var Po=(()=>{class t{static \u0275fac=function(i){return new(i||t)};static \u0275mod=le({type:t});static \u0275inj=se({imports:[wi,Ne]})}return t})();var La=class{_multiple;_emitChanges;compareWith;_selection=new Set;_deselectedToEmit=[];_selectedToEmit=[];_selected=null;get selected(){return this._selected||(this._selected=Array.from(this._selection.values())),this._selected}changed=new B;bulk={select:n=>this._select(n),deselect:n=>this._deselect(n),setSelection:n=>this._setSelection(n)};constructor(n=!1,e,i=!0,o){this._multiple=n,this._emitChanges=i,this.compareWith=o,e&&e.length&&(n?e.forEach(a=>this._markSelected(a)):this._markSelected(e[0]),this._selectedToEmit.length=0)}select(...n){return this._select(n)}deselect(...n){return this._deselect(n)}setSelection(...n){return this._setSelection(n)}toggle(n){return this.isSelected(n)?this.deselect(n):this.select(n)}clear(n=!0){this._unmarkAll();let e=this._hasQueuedChanges();return n&&this._emitChangeEvent(),e}isSelected(n){return this._selection.has(this._getConcreteValue(n))}isEmpty(){return this._selection.size===0}hasValue(){return!this.isEmpty()}sort(n){this._multiple&&this.selected&&this._selected.sort(n)}isMultipleSelection(){return this._multiple}_select(n){this._verifyValueAssignment(n),n.forEach(i=>this._markSelected(i));let e=this._hasQueuedChanges();return this._emitChangeEvent(),e}_deselect(n){this._verifyValueAssignment(n),n.forEach(i=>this._unmarkSelected(i));let e=this._hasQueuedChanges();return this._emitChangeEvent(),e}_setSelection(n){this._verifyValueAssignment(n);let e=this.selected,i=new Set(n.map(a=>this._getConcreteValue(a)));n.forEach(a=>this._markSelected(a)),e.filter(a=>!i.has(this._getConcreteValue(a,i))).forEach(a=>this._unmarkSelected(a));let o=this._hasQueuedChanges();return this._emitChangeEvent(),o}_emitChangeEvent(){this._selected=null,(this._selectedToEmit.length||this._deselectedToEmit.length)&&(this.changed.next({source:this,added:this._selectedToEmit,removed:this._deselectedToEmit}),this._deselectedToEmit=[],this._selectedToEmit=[])}_markSelected(n){n=this._getConcreteValue(n),this.isSelected(n)||(this._multiple||this._unmarkAll(),this.isSelected(n)||this._selection.add(n),this._emitChanges&&this._selectedToEmit.push(n))}_unmarkSelected(n){n=this._getConcreteValue(n),this.isSelected(n)&&(this._selection.delete(n),this._emitChanges&&this._deselectedToEmit.push(n))}_unmarkAll(){this.isEmpty()||this._selection.forEach(n=>this._unmarkSelected(n))}_verifyValueAssignment(n){n.length>1&&this._multiple}_hasQueuedChanges(){return!!(this._deselectedToEmit.length||this._selectedToEmit.length)}_getConcreteValue(n,e){if(this.compareWith){e=e??this._selection;for(let i of e)if(this.compareWith(n,i))return i;return n}else return n}};var pS=new D("MAT_BUTTON_TOGGLE_DEFAULT_OPTIONS",{providedIn:"root",factory:()=>({hideSingleSelectionIndicator:!1,hideMultipleSelectionIndicator:!1,disabledInteractive:!1})}),fS=new D("MatButtonToggleGroup"),uA={provide:to,useExisting:$t(()=>Cc),multi:!0},Nu=class{source;value;constructor(n,e){this.source=n,this.value=e}},Cc=(()=>{class t{_changeDetector=p(He);_dir=p(ft,{optional:!0});_multiple=!1;_disabled=!1;_disabledInteractive=!1;_selectionModel;_rawValue;_controlValueAccessorChangeFn=()=>{};_onTouched=()=>{};_buttonToggles;appearance;get name(){return this._name}set name(e){this._name=e,this._markButtonsForCheck()}_name=p(Qe).getId("mat-button-toggle-group-");vertical=!1;get value(){let e=this._selectionModel?this._selectionModel.selected:[];return this.multiple?e.map(i=>i.value):e[0]?e[0].value:void 0}set value(e){this._setSelectionByValue(e),this.valueChange.emit(this.value)}valueChange=new K;get selected(){let e=this._selectionModel?this._selectionModel.selected:[];return this.multiple?e:e[0]||null}get multiple(){return this._multiple}set multiple(e){this._multiple=e,this._markButtonsForCheck()}get disabled(){return this._disabled}set disabled(e){this._disabled=e,this._markButtonsForCheck()}get disabledInteractive(){return this._disabledInteractive}set disabledInteractive(e){this._disabledInteractive=e,this._markButtonsForCheck()}get dir(){return this._dir&&this._dir.value==="rtl"?"rtl":"ltr"}change=new K;get hideSingleSelectionIndicator(){return this._hideSingleSelectionIndicator}set hideSingleSelectionIndicator(e){this._hideSingleSelectionIndicator=e,this._markButtonsForCheck()}_hideSingleSelectionIndicator;get hideMultipleSelectionIndicator(){return this._hideMultipleSelectionIndicator}set hideMultipleSelectionIndicator(e){this._hideMultipleSelectionIndicator=e,this._markButtonsForCheck()}_hideMultipleSelectionIndicator;constructor(){let e=p(pS,{optional:!0});this.appearance=e&&e.appearance?e.appearance:"standard",this._hideSingleSelectionIndicator=e?.hideSingleSelectionIndicator??!1,this._hideMultipleSelectionIndicator=e?.hideMultipleSelectionIndicator??!1}ngOnInit(){this._selectionModel=new La(this.multiple,void 0,!1)}ngAfterContentInit(){this._selectionModel.select(...this._buttonToggles.filter(e=>e.checked)),this.multiple||this._initializeTabIndex()}writeValue(e){this.value=e,this._changeDetector.markForCheck()}registerOnChange(e){this._controlValueAccessorChangeFn=e}registerOnTouched(e){this._onTouched=e}setDisabledState(e){this.disabled=e}_keydown(e){if(this.multiple||this.disabled||pt(e))return;let o=e.target.id,a=this._buttonToggles.toArray().findIndex(s=>s.buttonId===o),r=null;switch(e.keyCode){case 32:case 13:r=this._buttonToggles.get(a)||null;break;case 38:r=this._getNextButton(a,-1);break;case 37:r=this._getNextButton(a,this.dir==="ltr"?-1:1);break;case 40:r=this._getNextButton(a,1);break;case 39:r=this._getNextButton(a,this.dir==="ltr"?1:-1);break;default:return}r&&(e.preventDefault(),r._onButtonClick(),r.focus())}_emitChangeEvent(e){let i=new Nu(e,this.value);this._rawValue=i.value,this._controlValueAccessorChangeFn(i.value),this.change.emit(i)}_syncButtonToggle(e,i,o=!1,a=!1){!this.multiple&&this.selected&&!e.checked&&(this.selected.checked=!1),this._selectionModel?i?this._selectionModel.select(e):this._selectionModel.deselect(e):a=!0,a?Promise.resolve().then(()=>this._updateModelValue(e,o)):this._updateModelValue(e,o)}_isSelected(e){return this._selectionModel&&this._selectionModel.isSelected(e)}_isPrechecked(e){return typeof this._rawValue>"u"?!1:this.multiple&&Array.isArray(this._rawValue)?this._rawValue.some(i=>e.value!=null&&i===e.value):e.value===this._rawValue}_initializeTabIndex(){if(this._buttonToggles.forEach(e=>{e.tabIndex=-1}),this.selected)this.selected.tabIndex=0;else for(let e=0;e<this._buttonToggles.length;e++){let i=this._buttonToggles.get(e);if(!i.disabled){i.tabIndex=0;break}}}_getNextButton(e,i){let o=this._buttonToggles;for(let a=1;a<=o.length;a++){let r=(e+i*a+o.length)%o.length,s=o.get(r);if(s&&!s.disabled)return s}return null}_setSelectionByValue(e){if(this._rawValue=e,!this._buttonToggles)return;let i=this._buttonToggles.toArray();if(this.multiple&&e?(Array.isArray(e),this._clearSelection(),e.forEach(o=>this._selectValue(o,i))):(this._clearSelection(),this._selectValue(e,i)),!this.multiple&&i.every(o=>o.tabIndex===-1)){for(let o of i)if(!o.disabled){o.tabIndex=0;break}}}_clearSelection(){this._selectionModel.clear(),this._buttonToggles.forEach(e=>{e.checked=!1,this.multiple||(e.tabIndex=-1)})}_selectValue(e,i){for(let o of i)if(o.value===e){o.checked=!0,this._selectionModel.select(o),this.multiple||(o.tabIndex=0);break}}_updateModelValue(e,i){i&&this._emitChangeEvent(e),this.valueChange.emit(this.value)}_markButtonsForCheck(){this._buttonToggles?.forEach(e=>e._markForCheck())}static \u0275fac=function(i){return new(i||t)};static \u0275dir=ee({type:t,selectors:[["mat-button-toggle-group"]],contentQueries:function(i,o,a){if(i&1&&Mt(a,$r,5),i&2){let r;Y(r=Z())&&(o._buttonToggles=r)}},hostAttrs:[1,"mat-button-toggle-group"],hostVars:6,hostBindings:function(i,o){i&1&&V("keydown",function(r){return o._keydown(r)}),i&2&&(Q("role",o.multiple?"group":"radiogroup")("aria-disabled",o.disabled),z("mat-button-toggle-vertical",o.vertical)("mat-button-toggle-group-appearance-standard",o.appearance==="standard"))},inputs:{appearance:"appearance",name:"name",vertical:[2,"vertical","vertical",O],value:"value",multiple:[2,"multiple","multiple",O],disabled:[2,"disabled","disabled",O],disabledInteractive:[2,"disabledInteractive","disabledInteractive",O],hideSingleSelectionIndicator:[2,"hideSingleSelectionIndicator","hideSingleSelectionIndicator",O],hideMultipleSelectionIndicator:[2,"hideMultipleSelectionIndicator","hideMultipleSelectionIndicator",O]},outputs:{valueChange:"valueChange",change:"change"},exportAs:["matButtonToggleGroup"],features:[ze([uA,{provide:fS,useExisting:t}])]})}return t})(),$r=(()=>{class t{_changeDetectorRef=p(He);_elementRef=p(q);_focusMonitor=p(un);_idGenerator=p(Qe);_animationDisabled=qe();_checked=!1;ariaLabel;ariaLabelledby=null;_buttonElement;buttonToggleGroup;get buttonId(){return`${this.id}-button`}id;name;value;get tabIndex(){return this._tabIndex()}set tabIndex(e){this._tabIndex.set(e)}_tabIndex;disableRipple=!1;get appearance(){return this.buttonToggleGroup?this.buttonToggleGroup.appearance:this._appearance}set appearance(e){this._appearance=e}_appearance;get checked(){return this.buttonToggleGroup?this.buttonToggleGroup._isSelected(this):this._checked}set checked(e){e!==this._checked&&(this._checked=e,this.buttonToggleGroup&&this.buttonToggleGroup._syncButtonToggle(this,this._checked),this._changeDetectorRef.markForCheck())}get disabled(){return this._disabled||this.buttonToggleGroup&&this.buttonToggleGroup.disabled}set disabled(e){this._disabled=e}_disabled=!1;get disabledInteractive(){return this._disabledInteractive||this.buttonToggleGroup!==null&&this.buttonToggleGroup.disabledInteractive}set disabledInteractive(e){this._disabledInteractive=e}_disabledInteractive;change=new K;constructor(){p(ut).load(bn);let e=p(fS,{optional:!0}),i=p(new ti("tabindex"),{optional:!0})||"",o=p(pS,{optional:!0});this._tabIndex=G(parseInt(i)||0),this.buttonToggleGroup=e,this._appearance=o&&o.appearance?o.appearance:"standard",this._disabledInteractive=o?.disabledInteractive??!1}ngOnInit(){let e=this.buttonToggleGroup;this.id=this.id||this._idGenerator.getId("mat-button-toggle-"),e&&(e._isPrechecked(this)?this.checked=!0:e._isSelected(this)!==this._checked&&e._syncButtonToggle(this,this._checked))}ngAfterViewInit(){this._animationDisabled||this._elementRef.nativeElement.classList.add("mat-button-toggle-animations-enabled"),this._focusMonitor.monitor(this._elementRef,!0)}ngOnDestroy(){let e=this.buttonToggleGroup;this._focusMonitor.stopMonitoring(this._elementRef),e&&e._isSelected(this)&&e._syncButtonToggle(this,!1,!1,!0)}focus(e){this._buttonElement.nativeElement.focus(e)}_onButtonClick(){if(this.disabled)return;let e=this.isSingleSelector()?!0:!this._checked;if(e!==this._checked&&(this._checked=e,this.buttonToggleGroup&&(this.buttonToggleGroup._syncButtonToggle(this,this._checked,!0),this.buttonToggleGroup._onTouched())),this.isSingleSelector()){let i=this.buttonToggleGroup._buttonToggles.find(o=>o.tabIndex===0);i&&(i.tabIndex=-1),this.tabIndex=0}this.change.emit(new Nu(this,this.value))}_markForCheck(){this._changeDetectorRef.markForCheck()}_getButtonName(){return this.isSingleSelector()?this.buttonToggleGroup.name:this.name||null}isSingleSelector(){return this.buttonToggleGroup&&!this.buttonToggleGroup.multiple}static \u0275fac=function(i){return new(i||t)};static \u0275cmp=(function(){let e=["button"],i=["*"];function o(a,r){if(a&1&&(f(0,"div",2),A(1,"mat-pseudo-checkbox",6),u()),a&2){let s=x();h(),R("disabled",s.disabled)}}return H({type:t,selectors:[["mat-button-toggle"]],viewQuery:function(r,s){if(r&1&&ot(e,5),r&2){let c;Y(c=Z())&&(s._buttonElement=c.first)}},hostAttrs:["role","presentation",1,"mat-button-toggle"],hostVars:14,hostBindings:function(r,s){r&1&&V("focus",function(){return s.focus()}),r&2&&(Q("aria-label",null)("aria-labelledby",null)("id",s.id)("name",null),z("mat-button-toggle-standalone",!s.buttonToggleGroup)("mat-button-toggle-checked",s.checked)("mat-button-toggle-disabled",s.disabled)("mat-button-toggle-disabled-interactive",s.disabledInteractive)("mat-button-toggle-appearance-standard",s.appearance==="standard"))},inputs:{ariaLabel:[0,"aria-label","ariaLabel"],ariaLabelledby:[0,"aria-labelledby","ariaLabelledby"],id:"id",name:"name",value:"value",tabIndex:"tabIndex",disableRipple:[2,"disableRipple","disableRipple",O],appearance:"appearance",checked:[2,"checked","checked",O],disabled:[2,"disabled","disabled",O],disabledInteractive:[2,"disabledInteractive","disabledInteractive",O]},outputs:{change:"change"},exportAs:["matButtonToggle"],ngContentSelectors:i,decls:7,vars:13,consts:[["button",""],["type","button",1,"mat-button-toggle-button","mat-focus-indicator",3,"click","id","disabled"],[1,"mat-button-toggle-checkbox-wrapper"],[1,"mat-button-toggle-label-content"],[1,"mat-button-toggle-focus-overlay"],["matRipple","",1,"mat-button-toggle-ripple",3,"matRippleTrigger","matRippleDisabled"],["state","checked","aria-hidden","true","appearance","minimal",3,"disabled"]],template:function(r,s){if(r&1&&(Be(),f(0,"button",1,0),V("click",function(){return s._onButtonClick()}),k(2,o,2,1,"div",2),f(3,"span",3),oe(4),u()(),A(5,"span",4)(6,"span",5)),r&2){let c=nn(1);R("id",s.buttonId)("disabled",s.disabled&&!s.disabledInteractive||null),Q("role",s.isSingleSelector()?"radio":"button")("tabindex",s.disabled&&!s.disabledInteractive?-1:s.tabIndex)("aria-pressed",s.isSingleSelector()?null:s.checked)("aria-checked",s.isSingleSelector()?s.checked:null)("name",s._getButtonName())("aria-label",s.ariaLabel)("aria-labelledby",s.ariaLabelledby)("aria-disabled",s.disabled&&s.disabledInteractive?"true":null),h(2),N(s.buttonToggleGroup&&(!s.buttonToggleGroup.multiple&&!s.buttonToggleGroup.hideSingleSelectionIndicator||s.buttonToggleGroup.multiple&&!s.buttonToggleGroup.hideMultipleSelectionIndicator)?2:-1),h(4),R("matRippleTrigger",c)("matRippleDisabled",s.disableRipple||s.disabled)}},dependencies:[ai,Jd],styles:[`.mat-button-toggle-standalone,
.mat-button-toggle-group {
  position: relative;
  display: inline-flex;
  flex-direction: row;
  white-space: nowrap;
  overflow: hidden;
  -webkit-tap-highlight-color: transparent;
  border-radius: var(--%NS%mat-button-toggle-legacy-shape);
  transform: translateZ(0);
}
.mat-button-toggle-standalone:not([class*=mat-elevation-z]),
.mat-button-toggle-group:not([class*=mat-elevation-z]) {
  box-shadow: 0px 3px 1px -2px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12);
}
@media (forced-colors: active) {
  .mat-button-toggle-standalone,
  .mat-button-toggle-group {
    outline: solid 1px;
  }
}

.mat-button-toggle-standalone.mat-button-toggle-appearance-standard,
.mat-button-toggle-group-appearance-standard {
  border-radius: var(--%NS%mat-button-toggle-shape, var(--%NS%mat-sys-corner-extra-large));
  border: solid 1px var(--%NS%mat-button-toggle-divider-color, var(--%NS%mat-sys-outline));
}
.mat-button-toggle-standalone.mat-button-toggle-appearance-standard .mat-pseudo-checkbox,
.mat-button-toggle-group-appearance-standard .mat-pseudo-checkbox {
  --%NS%mat-pseudo-checkbox-minimal-selected-checkmark-color: var(--%NS%mat-button-toggle-selected-state-text-color, var(--%NS%mat-sys-on-secondary-container));
}
.mat-button-toggle-standalone.mat-button-toggle-appearance-standard:not([class*=mat-elevation-z]),
.mat-button-toggle-group-appearance-standard:not([class*=mat-elevation-z]) {
  box-shadow: none;
}
@media (forced-colors: active) {
  .mat-button-toggle-standalone.mat-button-toggle-appearance-standard,
  .mat-button-toggle-group-appearance-standard {
    outline: 0;
  }
}

.mat-button-toggle-vertical {
  flex-direction: column;
}
.mat-button-toggle-vertical .mat-button-toggle-label-content {
  display: block;
}

.mat-button-toggle {
  white-space: nowrap;
  position: relative;
  color: var(--%NS%mat-button-toggle-legacy-text-color);
  font-family: var(--%NS%mat-button-toggle-legacy-label-text-font);
  font-size: var(--%NS%mat-button-toggle-legacy-label-text-size);
  line-height: var(--%NS%mat-button-toggle-legacy-label-text-line-height);
  font-weight: var(--%NS%mat-button-toggle-legacy-label-text-weight);
  letter-spacing: var(--%NS%mat-button-toggle-legacy-label-text-tracking);
  --%NS%mat-pseudo-checkbox-minimal-selected-checkmark-color: var(--%NS%mat-button-toggle-legacy-selected-state-text-color);
}
.mat-button-toggle.cdk-keyboard-focused .mat-button-toggle-focus-overlay {
  opacity: var(--%NS%mat-button-toggle-legacy-focus-state-layer-opacity);
}
.mat-button-toggle .mat-icon svg {
  vertical-align: top;
}

.mat-button-toggle-checkbox-wrapper {
  display: inline-block;
  justify-content: flex-start;
  align-items: center;
  width: 0;
  height: 18px;
  line-height: 18px;
  overflow: hidden;
  box-sizing: border-box;
  position: absolute;
  top: 50%;
  left: 16px;
  transform: translate3d(0, -50%, 0);
}
[dir=rtl] .mat-button-toggle-checkbox-wrapper {
  left: auto;
  right: 16px;
}
.mat-button-toggle-appearance-standard .mat-button-toggle-checkbox-wrapper {
  left: 12px;
}
[dir=rtl] .mat-button-toggle-appearance-standard .mat-button-toggle-checkbox-wrapper {
  left: auto;
  right: 12px;
}
.mat-button-toggle-checked .mat-button-toggle-checkbox-wrapper {
  width: 18px;
}
.mat-button-toggle-animations-enabled .mat-button-toggle-checkbox-wrapper {
  transition: width 150ms 45ms cubic-bezier(0.4, 0, 0.2, 1);
}
.mat-button-toggle-vertical .mat-button-toggle-checkbox-wrapper {
  transition: none;
}

.mat-button-toggle-checked {
  color: var(--%NS%mat-button-toggle-legacy-selected-state-text-color);
  background-color: var(--%NS%mat-button-toggle-legacy-selected-state-background-color);
}

.mat-button-toggle-disabled {
  pointer-events: none;
  color: var(--%NS%mat-button-toggle-legacy-disabled-state-text-color);
  background-color: var(--%NS%mat-button-toggle-legacy-disabled-state-background-color);
  --%NS%mat-pseudo-checkbox-minimal-disabled-selected-checkmark-color: var(--%NS%mat-button-toggle-legacy-disabled-state-text-color);
}
.mat-button-toggle-disabled.mat-button-toggle-checked {
  background-color: var(--%NS%mat-button-toggle-legacy-disabled-selected-state-background-color);
}

.mat-button-toggle-disabled-interactive {
  pointer-events: auto;
}

.mat-button-toggle-appearance-standard {
  color: var(--%NS%mat-button-toggle-text-color, var(--%NS%mat-sys-on-surface));
  background-color: var(--%NS%mat-button-toggle-background-color, transparent);
  font-family: var(--%NS%mat-button-toggle-label-text-font, var(--%NS%mat-sys-label-large-font));
  font-size: var(--%NS%mat-button-toggle-label-text-size, var(--%NS%mat-sys-label-large-size));
  line-height: var(--%NS%mat-button-toggle-label-text-line-height, var(--%NS%mat-sys-label-large-line-height));
  font-weight: var(--%NS%mat-button-toggle-label-text-weight, var(--%NS%mat-sys-label-large-weight));
  letter-spacing: var(--%NS%mat-button-toggle-label-text-tracking, var(--%NS%mat-sys-label-large-tracking));
}
.mat-button-toggle-group-appearance-standard .mat-button-toggle-appearance-standard + .mat-button-toggle-appearance-standard {
  border-left: solid 1px var(--%NS%mat-button-toggle-divider-color, var(--%NS%mat-sys-outline));
}
[dir=rtl] .mat-button-toggle-group-appearance-standard .mat-button-toggle-appearance-standard + .mat-button-toggle-appearance-standard {
  border-left: none;
  border-right: solid 1px var(--%NS%mat-button-toggle-divider-color, var(--%NS%mat-sys-outline));
}
.mat-button-toggle-group-appearance-standard.mat-button-toggle-vertical .mat-button-toggle-appearance-standard + .mat-button-toggle-appearance-standard {
  border-left: none;
  border-right: none;
  border-top: solid 1px var(--%NS%mat-button-toggle-divider-color, var(--%NS%mat-sys-outline));
}
.mat-button-toggle-appearance-standard.mat-button-toggle-checked {
  color: var(--%NS%mat-button-toggle-selected-state-text-color, var(--%NS%mat-sys-on-secondary-container));
  background-color: var(--%NS%mat-button-toggle-selected-state-background-color, var(--%NS%mat-sys-secondary-container));
}
.mat-button-toggle-appearance-standard.mat-button-toggle-disabled {
  color: var(--%NS%mat-button-toggle-disabled-state-text-color, color-mix(in srgb, var(--%NS%mat-sys-on-surface) 38%, transparent));
  background-color: var(--%NS%mat-button-toggle-disabled-state-background-color, transparent);
}
.mat-button-toggle-appearance-standard.mat-button-toggle-disabled .mat-pseudo-checkbox {
  --%NS%mat-pseudo-checkbox-minimal-disabled-selected-checkmark-color: var(--%NS%mat-button-toggle-disabled-selected-state-text-color, color-mix(in srgb, var(--%NS%mat-sys-on-surface) 38%, transparent));
}
.mat-button-toggle-appearance-standard.mat-button-toggle-disabled.mat-button-toggle-checked {
  color: var(--%NS%mat-button-toggle-disabled-selected-state-text-color, color-mix(in srgb, var(--%NS%mat-sys-on-surface) 38%, transparent));
  background-color: var(--%NS%mat-button-toggle-disabled-selected-state-background-color, color-mix(in srgb, var(--%NS%mat-sys-on-surface) 12%, transparent));
}
.mat-button-toggle-appearance-standard .mat-button-toggle-focus-overlay {
  background-color: var(--%NS%mat-button-toggle-state-layer-color, var(--%NS%mat-sys-on-surface));
}
.mat-button-toggle-appearance-standard:hover .mat-button-toggle-focus-overlay {
  opacity: var(--%NS%mat-button-toggle-hover-state-layer-opacity, var(--%NS%mat-sys-hover-state-layer-opacity));
}
.mat-button-toggle-appearance-standard.cdk-keyboard-focused .mat-button-toggle-focus-overlay {
  opacity: var(--%NS%mat-button-toggle-focus-state-layer-opacity, var(--%NS%mat-sys-focus-state-layer-opacity));
}
@media (hover: none) {
  .mat-button-toggle-appearance-standard:hover .mat-button-toggle-focus-overlay {
    display: none;
  }
}

.mat-button-toggle-label-content {
  -webkit-user-select: none;
  user-select: none;
  display: inline-block;
  padding: 0 16px;
  line-height: var(--%NS%mat-button-toggle-legacy-height);
  position: relative;
}
.mat-button-toggle-appearance-standard .mat-button-toggle-label-content {
  padding: 0 12px;
  line-height: var(--%NS%mat-button-toggle-height, 40px);
}

.mat-button-toggle-label-content > * {
  vertical-align: middle;
}

.mat-button-toggle-focus-overlay {
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  position: absolute;
  border-radius: inherit;
  pointer-events: none;
  opacity: 0;
  background-color: var(--%NS%mat-button-toggle-legacy-state-layer-color);
}

@media (forced-colors: active) {
  .mat-button-toggle-checked .mat-button-toggle-focus-overlay {
    border-bottom: solid 500px;
    opacity: 0.5;
    height: 0;
  }
  .mat-button-toggle-checked:hover .mat-button-toggle-focus-overlay {
    opacity: 0.6;
  }
  .mat-button-toggle-checked.mat-button-toggle-appearance-standard .mat-button-toggle-focus-overlay {
    border-bottom: solid 500px;
  }
}
.mat-button-toggle .mat-button-toggle-ripple {
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  position: absolute;
  pointer-events: none;
}

.mat-button-toggle-button {
  border: 0;
  background: none;
  color: inherit;
  padding: 0;
  margin: 0;
  font: inherit;
  outline: none;
  width: 100%;
  cursor: pointer;
}
.mat-button-toggle-animations-enabled .mat-button-toggle-button {
  transition: padding 150ms 45ms cubic-bezier(0.4, 0, 0.2, 1);
}
.mat-button-toggle-vertical .mat-button-toggle-button {
  transition: none;
}
.mat-button-toggle-disabled .mat-button-toggle-button {
  cursor: default;
}
.mat-button-toggle-button::-moz-focus-inner {
  border: 0;
}
.mat-button-toggle-checked .mat-button-toggle-button:has(.mat-button-toggle-checkbox-wrapper) {
  padding-left: 30px;
}
[dir=rtl] .mat-button-toggle-checked .mat-button-toggle-button:has(.mat-button-toggle-checkbox-wrapper) {
  padding-left: 0;
  padding-right: 30px;
}

.mat-button-toggle-standalone.mat-button-toggle-appearance-standard {
  --%NS%mat-focus-indicator-border-radius: var(--%NS%mat-button-toggle-shape, var(--%NS%mat-sys-corner-extra-large));
}

.mat-button-toggle-group-appearance-standard:not(.mat-button-toggle-vertical) .mat-button-toggle:last-of-type .mat-button-toggle-button::before {
  border-top-right-radius: var(--%NS%mat-button-toggle-shape, var(--%NS%mat-sys-corner-extra-large));
  border-bottom-right-radius: var(--%NS%mat-button-toggle-shape, var(--%NS%mat-sys-corner-extra-large));
}
.mat-button-toggle-group-appearance-standard:not(.mat-button-toggle-vertical) .mat-button-toggle:first-of-type .mat-button-toggle-button::before {
  border-top-left-radius: var(--%NS%mat-button-toggle-shape, var(--%NS%mat-sys-corner-extra-large));
  border-bottom-left-radius: var(--%NS%mat-button-toggle-shape, var(--%NS%mat-sys-corner-extra-large));
}

.mat-button-toggle-group-appearance-standard.mat-button-toggle-vertical .mat-button-toggle:last-of-type .mat-button-toggle-button::before {
  border-bottom-right-radius: var(--%NS%mat-button-toggle-shape, var(--%NS%mat-sys-corner-extra-large));
  border-bottom-left-radius: var(--%NS%mat-button-toggle-shape, var(--%NS%mat-sys-corner-extra-large));
}
.mat-button-toggle-group-appearance-standard.mat-button-toggle-vertical .mat-button-toggle:first-of-type .mat-button-toggle-button::before {
  border-top-right-radius: var(--%NS%mat-button-toggle-shape, var(--%NS%mat-sys-corner-extra-large));
  border-top-left-radius: var(--%NS%mat-button-toggle-shape, var(--%NS%mat-sys-corner-extra-large));
}
`],encapsulation:2})})()}return t})(),Tu=(()=>{class t{static \u0275fac=function(i){return new(i||t)};static \u0275mod=le({type:t});static \u0275inj=se({imports:[wi,$r,Ne]})}return t})();var Ur=(()=>{class t{isErrorState(e,i){return!!(e&&e.invalid&&(e.touched||i&&i.submitted))}isSignalErrorState(e){if(!e)return!1;let i=e().invalid(),o=e().touched();return i&&o}static \u0275fac=function(i){return new(i||t)};static \u0275prov=ce({token:t,factory:t.\u0275fac})}return t})();var Gr=class{_defaultMatcher;_parentFormGroup;_parentForm;_stateChanges;errorState=!1;matcher;ngControl;formField;constructor(n,e,i,o,a){this._defaultMatcher=n,this._parentFormGroup=i,this._parentForm=o,this._stateChanges=a,e?dn(e.field)&&!e.updateValueAndValidity?(this.formField=e,this.ngControl=null):(this.formField=null,this.ngControl=e):this.ngControl=this.formField=null}updateErrorState(){let n=this.errorState,e=this._getCurrentErrorState(this.matcher||this._defaultMatcher);e!==n&&(this.errorState=e,this._stateChanges.next())}_getCurrentErrorState(n){if(this.formField&&n?.isSignalErrorState)return n.isSignalErrorState(this.formField.field())??!1;let e=this._parentFormGroup||this._parentForm,i=this.ngControl?this.ngControl.control:null;return n?.isErrorState(i,e)??!1}};var Cg=new D("mat-chips-default-options",{providedIn:"root",factory:()=>({separatorKeyCodes:[13]})}),gS=new D("MatChipAvatar"),bS=new D("MatChipTrailingIcon"),vS=new D("MatChipEdit"),_g=new D("MatChipRemove"),Sg=new D("MatChip"),yS=(()=>{class t{_elementRef=p(q);_parentChip=p(Sg);_isPrimary=!0;_isLeading=!1;get disabled(){return this._disabled||this._parentChip?.disabled||!1}set disabled(e){this._disabled=e}_disabled=!1;tabIndex=-1;_allowFocusWhenDisabled=!1;_getDisabledAttribute(){return this.disabled&&!this._allowFocusWhenDisabled?"":null}constructor(){p(ut).load(bn),this._elementRef.nativeElement.nodeName==="BUTTON"&&this._elementRef.nativeElement.setAttribute("type","button")}focus(){this._elementRef.nativeElement.focus()}static \u0275fac=function(i){return new(i||t)};static \u0275dir=ee({type:t,selectors:[["","matChipContent",""]],hostAttrs:[1,"mat-mdc-chip-action","mdc-evolution-chip__action","mdc-evolution-chip__action--presentational"],hostVars:8,hostBindings:function(i,o){i&2&&(Q("disabled",o._getDisabledAttribute())("aria-disabled",o.disabled),z("mdc-evolution-chip__action--primary",o._isPrimary)("mdc-evolution-chip__action--secondary",!o._isPrimary)("mdc-evolution-chip__action--trailing",!o._isPrimary&&!o._isLeading))},inputs:{disabled:[2,"disabled","disabled",O],tabIndex:[2,"tabIndex","tabIndex",e=>e==null?-1:on(e)],_allowFocusWhenDisabled:"_allowFocusWhenDisabled"}})}return t})(),wg=(()=>{class t extends yS{_getTabindex(){return this.disabled&&!this._allowFocusWhenDisabled?null:this.tabIndex.toString()}_handleClick(e){!this.disabled&&this._isPrimary&&(e.preventDefault(),this._parentChip._handlePrimaryActionInteraction())}_handleKeydown(e){(e.keyCode===13||e.keyCode===32)&&!this.disabled&&this._isPrimary&&!this._parentChip._isEditing&&(e.preventDefault(),this._parentChip._handlePrimaryActionInteraction())}static \u0275fac=(()=>{let e;return function(o){return(e||(e=Ot(t)))(o||t)}})();static \u0275dir=ee({type:t,selectors:[["","matChipAction",""]],hostVars:3,hostBindings:function(i,o){i&1&&V("click",function(r){return o._handleClick(r)})("keydown",function(r){return o._handleKeydown(r)}),i&2&&(Q("tabindex",o._getTabindex()),z("mdc-evolution-chip__action--presentational",!1))},features:[Ge]})}return t})();var _S=(()=>{class t extends wg{_isPrimary=!1;_handleClick(e){this.disabled||(e.stopPropagation(),e.preventDefault(),this._parentChip.remove())}_handleKeydown(e){(e.keyCode===13||e.keyCode===32)&&!this.disabled&&(e.stopPropagation(),e.preventDefault(),this._parentChip.remove())}static \u0275fac=(()=>{let e;return function(o){return(e||(e=Ot(t)))(o||t)}})();static \u0275dir=ee({type:t,selectors:[["","matChipRemove",""]],hostAttrs:["role","button",1,"mat-mdc-chip-remove","mat-mdc-chip-trailing-icon","mat-focus-indicator","mdc-evolution-chip__icon","mdc-evolution-chip__icon--trailing"],hostVars:1,hostBindings:function(i,o){i&2&&Q("aria-hidden",null)},features:[ze([{provide:_g,useExisting:t}]),Ge]})}return t})(),Sc=(()=>{class t{_changeDetectorRef=p(He);_elementRef=p(q);_tagName=p(q0);_ngZone=p(X);_focusMonitor=p(un);_globalRippleOptions=p(kr,{optional:!0});_document=p(ae);_onFocus=new B;_onBlur=new B;_isBasicChip=!1;role=null;_hasFocusInternal=!1;_pendingFocus=!1;_actionChanges;_animationsDisabled=qe();_allLeadingIcons;_allTrailingIcons;_allEditIcons;_allRemoveIcons;_hasFocus(){return this._hasFocusInternal}id=p(Qe).getId("mat-mdc-chip-");ariaLabel=null;ariaDescription=null;_chipListDisabled=!1;_hadFocusOnRemove=!1;_textElement;get value(){return this._value!==void 0?this._value:this._textElement.textContent.trim()}set value(e){this._value=e}_value;color;removable=!0;highlighted=!1;disableRipple=!1;get disabled(){return this._disabled||this._chipListDisabled}set disabled(e){this._disabled=e}_disabled=!1;removed=new K;destroyed=new K;basicChipAttrName="mat-basic-chip";leadingIcon;editIcon;trailingIcon;removeIcon;primaryAction;_rippleLoader=p(Du);_injector=p(ie);constructor(){let e=p(ut);e.load(bn),e.load(Mo),this._monitorFocus(),this._rippleLoader?.configureRipple(this._elementRef.nativeElement,{className:"mat-mdc-chip-ripple",disabled:this._isRippleDisabled()})}ngOnInit(){this._isBasicChip=this._elementRef.nativeElement.hasAttribute(this.basicChipAttrName)||this._tagName.toLowerCase()===this.basicChipAttrName}ngAfterViewInit(){this._textElement=this._elementRef.nativeElement.querySelector(".mat-mdc-chip-action-label"),this._pendingFocus&&(this._pendingFocus=!1,this.focus())}ngAfterContentInit(){this._actionChanges=bt(this._allLeadingIcons.changes,this._allTrailingIcons.changes,this._allEditIcons.changes,this._allRemoveIcons.changes).subscribe(()=>this._changeDetectorRef.markForCheck())}ngDoCheck(){this._rippleLoader.setDisabled(this._elementRef.nativeElement,this._isRippleDisabled())}ngOnDestroy(){this.destroyed.emit({chip:this}),this.destroyed.complete(),this._focusMonitor.stopMonitoring(this._elementRef),this._rippleLoader?.destroyRipple(this._elementRef.nativeElement),this._actionChanges?.unsubscribe()}remove(){this.removable&&(this._hadFocusOnRemove=this._hasFocus(),this.removed.emit({chip:this}))}_isRippleDisabled(){return this.disabled||this.disableRipple||this._animationsDisabled||this._isBasicChip||!this._hasInteractiveActions()||!!this._globalRippleOptions?.disabled}_hasTrailingIcon(){return!!(this.trailingIcon||this.removeIcon)}_handleKeydown(e){(e.keyCode===8&&!e.repeat||e.keyCode===46)&&(e.preventDefault(),this.remove())}focus(){this.disabled||(this.primaryAction?this.primaryAction.focus():this._pendingFocus=!0)}_getSourceAction(e){return this._getActions().find(i=>{let o=i._elementRef.nativeElement;return o===e||o.contains(e)})}_getActions(){let e=[];return this.editIcon&&e.push(this.editIcon),this.primaryAction&&e.push(this.primaryAction),this.removeIcon&&e.push(this.removeIcon),e}_handlePrimaryActionInteraction(){}_hasInteractiveActions(){return this._getActions().length>0}_edit(e){}_monitorFocus(){this._focusMonitor.monitor(this._elementRef,!0).subscribe(e=>{let i=e!==null;i!==this._hasFocusInternal&&(this._hasFocusInternal=i,i?this._onFocus.next({chip:this}):(this._changeDetectorRef.markForCheck(),setTimeout(()=>this._ngZone.run(()=>this._onBlur.next({chip:this})))))})}static \u0275fac=function(i){return new(i||t)};static \u0275cmp=(function(){let e=["*",[["mat-chip-avatar"],["","matChipAvatar",""]],[["mat-chip-trailing-icon"],["","matChipRemove",""],["","matChipTrailingIcon",""]]],i=["*","mat-chip-avatar, [matChipAvatar]","mat-chip-trailing-icon,[matChipRemove],[matChipTrailingIcon]"];function o(r,s){r&1&&(f(0,"span",3),oe(1,1),u())}function a(r,s){r&1&&(f(0,"span",7),oe(1,2),u())}return H({type:t,selectors:[["mat-basic-chip"],["","mat-basic-chip",""],["mat-chip"],["","mat-chip",""]],contentQueries:function(s,c,d){if(s&1&&Mt(d,gS,5)(d,vS,5)(d,bS,5)(d,_g,5)(d,gS,5)(d,bS,5)(d,vS,5)(d,_g,5),s&2){let l;Y(l=Z())&&(c.leadingIcon=l.first),Y(l=Z())&&(c.editIcon=l.first),Y(l=Z())&&(c.trailingIcon=l.first),Y(l=Z())&&(c.removeIcon=l.first),Y(l=Z())&&(c._allLeadingIcons=l),Y(l=Z())&&(c._allTrailingIcons=l),Y(l=Z())&&(c._allEditIcons=l),Y(l=Z())&&(c._allRemoveIcons=l)}},viewQuery:function(s,c){if(s&1&&ot(wg,5),s&2){let d;Y(d=Z())&&(c.primaryAction=d.first)}},hostAttrs:[1,"mat-mdc-chip"],hostVars:31,hostBindings:function(s,c){s&1&&V("keydown",function(l){return c._handleKeydown(l)}),s&2&&(Vt("id",c.id),Q("role",c.role)("aria-label",c.ariaLabel),Ke("mat-"+(c.color||"primary")),z("mdc-evolution-chip",!c._isBasicChip)("mdc-evolution-chip--disabled",c.disabled)("mdc-evolution-chip--with-trailing-action",c._hasTrailingIcon())("mdc-evolution-chip--with-primary-graphic",c.leadingIcon)("mdc-evolution-chip--with-primary-icon",c.leadingIcon)("mdc-evolution-chip--with-avatar",c.leadingIcon)("mat-mdc-chip-with-avatar",c.leadingIcon)("mat-mdc-chip-highlighted",c.highlighted)("mat-mdc-chip-disabled",c.disabled)("mat-mdc-basic-chip",c._isBasicChip)("mat-mdc-standard-chip",!c._isBasicChip)("mat-mdc-chip-with-trailing-icon",c._hasTrailingIcon())("_mat-animation-noopable",c._animationsDisabled))},inputs:{role:"role",id:"id",ariaLabel:[0,"aria-label","ariaLabel"],ariaDescription:[0,"aria-description","ariaDescription"],value:"value",color:"color",removable:[2,"removable","removable",O],highlighted:[2,"highlighted","highlighted",O],disableRipple:[2,"disableRipple","disableRipple",O],disabled:[2,"disabled","disabled",O]},outputs:{removed:"removed",destroyed:"destroyed"},exportAs:["matChip"],features:[ze([{provide:Sg,useExisting:t}])],ngContentSelectors:i,decls:9,vars:2,consts:[[1,"mat-mdc-chip-focus-overlay"],[1,"mdc-evolution-chip__cell","mdc-evolution-chip__cell--primary"],["matChipContent",""],[1,"mdc-evolution-chip__graphic","mat-mdc-chip-graphic"],[1,"mdc-evolution-chip__text-label","mat-mdc-chip-action-label"],[1,"mat-mdc-chip-primary-focus-indicator","mat-focus-indicator"],[1,"mat-mdc-chip-touch-target"],[1,"mdc-evolution-chip__cell","mdc-evolution-chip__cell--trailing"]],template:function(s,c){s&1&&(Be(e),A(0,"span",0),f(1,"span",1)(2,"span",2),k(3,o,2,0,"span",3),f(4,"span",4),oe(5),A(6,"span",5),u(),A(7,"span",6),u()(),k(8,a,2,0,"span",7)),s&2&&(h(3),N(c.leadingIcon?3:-1),h(5),N(c._hasTrailingIcon()?8:-1))},dependencies:[yS],styles:[`.mdc-evolution-chip,
.mdc-evolution-chip__cell,
.mdc-evolution-chip__action {
  display: inline-flex;
  align-items: center;
}

.mdc-evolution-chip {
  position: relative;
  max-width: 100%;
}

.mat-mdc-chip-touch-target {
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 48px;
  transform: translateY(-50%);
  display: var(--%NS%mat-chip-touch-target-display, block);
  pointer-events: auto;
}

.mdc-evolution-chip__cell,
.mdc-evolution-chip__action {
  height: 100%;
}

.mdc-evolution-chip__cell--primary {
  flex-basis: 100%;
  overflow-x: hidden;
}

.mdc-evolution-chip__cell--trailing {
  flex: 1 0 auto;
}

.mdc-evolution-chip__action {
  align-items: center;
  background: none;
  border: none;
  box-sizing: content-box;
  cursor: pointer;
  display: inline-flex;
  justify-content: center;
  outline: none;
  padding: 0;
  text-decoration: none;
  color: inherit;
}

.mdc-evolution-chip__action--presentational {
  cursor: auto;
}

.mdc-evolution-chip--disabled,
.mdc-evolution-chip__action:disabled {
  pointer-events: none;
}
@media (forced-colors: active) {
  .mdc-evolution-chip--disabled,
  .mdc-evolution-chip__action:disabled {
    forced-color-adjust: none;
  }
}

.mdc-evolution-chip__action--primary {
  font: inherit;
  letter-spacing: inherit;
  white-space: inherit;
  overflow-x: hidden;
}
.mat-mdc-standard-chip .mdc-evolution-chip__action--%NS%primary::before {
  border-width: var(--%NS%mat-chip-outline-width, 1px);
  border-radius: var(--%NS%mat-chip-container-shape-radius, 8px);
  box-sizing: border-box;
  content: "";
  height: 100%;
  left: 0;
  position: absolute;
  pointer-events: none;
  top: 0;
  width: 100%;
  z-index: 1;
  border-style: solid;
}
.mat-mdc-standard-chip .mdc-evolution-chip__action--primary {
  padding-left: 12px;
  padding-right: 12px;
}
.mat-mdc-standard-chip.mdc-evolution-chip--with-primary-graphic .mdc-evolution-chip__action--primary {
  padding-left: 0;
  padding-right: 12px;
}
[dir=rtl] .mat-mdc-standard-chip.mdc-evolution-chip--with-primary-graphic .mdc-evolution-chip__action--primary {
  padding-left: 12px;
  padding-right: 0;
}
.mat-mdc-standard-chip:not(.mdc-evolution-chip--disabled) .mdc-evolution-chip__action--%NS%primary::before {
  border-color: var(--%NS%mat-chip-outline-color, var(--%NS%mat-sys-outline));
}
.mdc-evolution-chip__action--%NS%primary:not(.mdc-evolution-chip__action--presentational):not(.mdc-ripple-upgraded):focus::before {
  border-color: var(--%NS%mat-chip-focus-outline-color, var(--%NS%mat-sys-on-surface-variant));
}
.mat-mdc-standard-chip.mdc-evolution-chip--disabled .mdc-evolution-chip__action--%NS%primary::before {
  border-color: var(--%NS%mat-chip-disabled-outline-color, color-mix(in srgb, var(--%NS%mat-sys-on-surface) 12%, transparent));
}
.mat-mdc-standard-chip.mdc-evolution-chip--selected .mdc-evolution-chip__action--%NS%primary::before {
  border-width: var(--%NS%mat-chip-flat-selected-outline-width, 0);
}
.mat-mdc-basic-chip .mdc-evolution-chip__action--primary {
  font: inherit;
}
.mat-mdc-standard-chip.mdc-evolution-chip--with-leading-action .mdc-evolution-chip__action--primary {
  padding-left: 0;
  padding-right: 12px;
}
[dir=rtl] .mat-mdc-standard-chip.mdc-evolution-chip--with-leading-action .mdc-evolution-chip__action--primary {
  padding-left: 12px;
  padding-right: 0;
}
.mat-mdc-standard-chip.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__action--primary {
  padding-left: 12px;
  padding-right: 0;
}
[dir=rtl] .mat-mdc-standard-chip.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__action--primary {
  padding-left: 0;
  padding-right: 12px;
}
.mat-mdc-standard-chip.mdc-evolution-chip--with-leading-action.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__action--primary {
  padding-left: 0;
  padding-right: 0;
}
.mat-mdc-standard-chip.mdc-evolution-chip--with-primary-graphic.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__action--primary {
  padding-left: 0;
  padding-right: 0;
}
[dir=rtl] .mat-mdc-standard-chip.mdc-evolution-chip--with-primary-graphic.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__action--primary {
  padding-left: 0;
  padding-right: 0;
}
.mdc-evolution-chip--with-avatar.mdc-evolution-chip--with-primary-graphic .mdc-evolution-chip__action--primary {
  padding-left: 0;
  padding-right: 12px;
}
[dir=rtl] .mdc-evolution-chip--with-avatar.mdc-evolution-chip--with-primary-graphic .mdc-evolution-chip__action--primary {
  padding-left: 12px;
  padding-right: 0;
}
.mdc-evolution-chip--with-avatar.mdc-evolution-chip--with-primary-graphic.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__action--primary {
  padding-left: 0;
  padding-right: 0;
}
[dir=rtl] .mdc-evolution-chip--with-avatar.mdc-evolution-chip--with-primary-graphic.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__action--primary {
  padding-left: 0;
  padding-right: 0;
}

.mdc-evolution-chip__action--secondary {
  position: relative;
  overflow: visible;
}
.mat-mdc-standard-chip:not(.mdc-evolution-chip--disabled) .mdc-evolution-chip__action--secondary {
  color: var(--%NS%mat-chip-with-trailing-icon-trailing-icon-color, var(--%NS%mat-sys-on-surface-variant));
}
.mat-mdc-standard-chip.mdc-evolution-chip--disabled .mdc-evolution-chip__action--secondary {
  color: var(--%NS%mat-chip-with-trailing-icon-disabled-trailing-icon-color, var(--%NS%mat-sys-on-surface));
}
.mat-mdc-standard-chip.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__action--secondary, .mat-mdc-standard-chip.mdc-evolution-chip--with-leading-action .mdc-evolution-chip__action--secondary {
  padding-left: 8px;
  padding-right: 8px;
}
.mat-mdc-standard-chip.mdc-evolution-chip--with-primary-graphic.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__action--secondary, .mat-mdc-standard-chip.mdc-evolution-chip--with-primary-graphic.mdc-evolution-chip--with-leading-action .mdc-evolution-chip__action--secondary {
  padding-left: 8px;
  padding-right: 8px;
}
.mdc-evolution-chip--with-avatar.mdc-evolution-chip--with-primary-graphic.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__action--secondary, .mdc-evolution-chip--with-avatar.mdc-evolution-chip--with-primary-graphic.mdc-evolution-chip--with-leading-action .mdc-evolution-chip__action--secondary {
  padding-left: 8px;
  padding-right: 8px;
}
[dir=rtl] .mdc-evolution-chip--with-avatar.mdc-evolution-chip--with-primary-graphic.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__action--secondary, [dir=rtl] .mdc-evolution-chip--with-avatar.mdc-evolution-chip--with-primary-graphic.mdc-evolution-chip--with-leading-action .mdc-evolution-chip__action--secondary {
  padding-left: 8px;
  padding-right: 8px;
}

.mdc-evolution-chip__text-label {
  -webkit-user-select: none;
  user-select: none;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
.mat-mdc-standard-chip .mdc-evolution-chip__text-label {
  font-family: var(--%NS%mat-chip-label-text-font, var(--%NS%mat-sys-label-large-font));
  line-height: var(--%NS%mat-chip-label-text-line-height, var(--%NS%mat-sys-label-large-line-height));
  font-size: var(--%NS%mat-chip-label-text-size, var(--%NS%mat-sys-label-large-size));
  font-weight: var(--%NS%mat-chip-label-text-weight, var(--%NS%mat-sys-label-large-weight));
  letter-spacing: var(--%NS%mat-chip-label-text-tracking, var(--%NS%mat-sys-label-large-tracking));
}
.mat-mdc-standard-chip:not(.mdc-evolution-chip--disabled) .mdc-evolution-chip__text-label {
  color: var(--%NS%mat-chip-label-text-color, var(--%NS%mat-sys-on-surface-variant));
}
.mat-mdc-standard-chip.mdc-evolution-chip--%NS%selected:not(.mdc-evolution-chip--disabled) .mdc-evolution-chip__text-label {
  color: var(--%NS%mat-chip-selected-label-text-color, var(--%NS%mat-sys-on-secondary-container));
}
.mat-mdc-standard-chip.mdc-evolution-chip--disabled .mdc-evolution-chip__text-label, .mat-mdc-standard-chip.mdc-evolution-chip--selected.mdc-evolution-chip--disabled .mdc-evolution-chip__text-label {
  color: var(--%NS%mat-chip-disabled-label-text-color, color-mix(in srgb, var(--%NS%mat-sys-on-surface) 38%, transparent));
}

.mdc-evolution-chip__graphic {
  align-items: center;
  display: inline-flex;
  justify-content: center;
  overflow: hidden;
  pointer-events: none;
  position: relative;
  flex: 1 0 auto;
}
.mat-mdc-standard-chip .mdc-evolution-chip__graphic {
  width: var(--%NS%mat-chip-with-avatar-avatar-size, 24px);
  height: var(--%NS%mat-chip-with-avatar-avatar-size, 24px);
  font-size: var(--%NS%mat-chip-with-avatar-avatar-size, 24px);
}
.mdc-evolution-chip--selecting .mdc-evolution-chip__graphic {
  transition: width 150ms 0ms cubic-bezier(0.4, 0, 0.2, 1);
}
.mdc-evolution-chip--%NS%selectable:not(.mdc-evolution-chip--selected):not(.mdc-evolution-chip--with-primary-icon) .mdc-evolution-chip__graphic {
  width: 0;
}
.mat-mdc-standard-chip.mdc-evolution-chip--with-primary-graphic .mdc-evolution-chip__graphic {
  padding-left: 6px;
  padding-right: 6px;
}
.mdc-evolution-chip--with-avatar.mdc-evolution-chip--with-primary-graphic .mdc-evolution-chip__graphic {
  padding-left: 4px;
  padding-right: 8px;
}
[dir=rtl] .mdc-evolution-chip--with-avatar.mdc-evolution-chip--with-primary-graphic .mdc-evolution-chip__graphic {
  padding-left: 8px;
  padding-right: 4px;
}
.mat-mdc-standard-chip.mdc-evolution-chip--with-primary-graphic.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__graphic {
  padding-left: 6px;
  padding-right: 6px;
}
.mdc-evolution-chip--with-avatar.mdc-evolution-chip--with-primary-graphic.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__graphic {
  padding-left: 4px;
  padding-right: 8px;
}
[dir=rtl] .mdc-evolution-chip--with-avatar.mdc-evolution-chip--with-primary-graphic.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__graphic {
  padding-left: 8px;
  padding-right: 4px;
}
.mdc-evolution-chip--with-avatar.mdc-evolution-chip--with-primary-graphic.mdc-evolution-chip--with-leading-action .mdc-evolution-chip__graphic {
  padding-left: 0;
}

.mdc-evolution-chip__checkmark {
  position: absolute;
  opacity: 0;
  top: 50%;
  left: 50%;
  height: 20px;
  width: 20px;
}
.mat-mdc-standard-chip:not(.mdc-evolution-chip--disabled) .mdc-evolution-chip__checkmark {
  color: var(--%NS%mat-chip-with-icon-selected-icon-color, var(--%NS%mat-sys-on-secondary-container));
}
.mat-mdc-standard-chip.mdc-evolution-chip--disabled .mdc-evolution-chip__checkmark {
  color: var(--%NS%mat-chip-with-icon-disabled-icon-color, var(--%NS%mat-sys-on-surface));
}
.mdc-evolution-chip--selecting .mdc-evolution-chip__checkmark {
  transition: transform 150ms 0ms cubic-bezier(0.4, 0, 0.2, 1);
  transform: translate(-75%, -50%);
}
.mdc-evolution-chip--selected .mdc-evolution-chip__checkmark {
  transform: translate(-50%, -50%);
  opacity: 1;
}

.mdc-evolution-chip__checkmark-svg {
  display: block;
}

.mdc-evolution-chip__checkmark-path {
  stroke-width: 2px;
  stroke-dasharray: 29.7833385;
  stroke-dashoffset: 29.7833385;
  stroke: currentColor;
}
.mdc-evolution-chip--selecting .mdc-evolution-chip__checkmark-path {
  transition: stroke-dashoffset 150ms 45ms cubic-bezier(0.4, 0, 0.2, 1);
}
.mdc-evolution-chip--selected .mdc-evolution-chip__checkmark-path {
  stroke-dashoffset: 0;
}
@media (forced-colors: active) {
  .mdc-evolution-chip__checkmark-path {
    stroke: CanvasText !important;
  }
}

.mat-mdc-standard-chip .mdc-evolution-chip__icon--trailing {
  height: 18px;
  width: 18px;
  font-size: 18px;
}
.mdc-evolution-chip--disabled .mdc-evolution-chip__icon--trailing.mat-mdc-chip-remove {
  opacity: calc(var(--%NS%mat-chip-trailing-action-opacity, 1) * var(--%NS%mat-chip-with-trailing-icon-disabled-trailing-icon-opacity, 0.38));
}
.mdc-evolution-chip--disabled .mdc-evolution-chip__icon--trailing.mat-mdc-chip-remove:focus {
  opacity: calc(var(--%NS%mat-chip-trailing-action-focus-opacity, 1) * var(--%NS%mat-chip-with-trailing-icon-disabled-trailing-icon-opacity, 0.38));
}

.mat-mdc-standard-chip {
  border-radius: var(--%NS%mat-chip-container-shape-radius, 8px);
  height: var(--%NS%mat-chip-container-height, 32px);
}
.mat-mdc-standard-chip:not(.mdc-evolution-chip--disabled) {
  background-color: var(--%NS%mat-chip-elevated-container-color, transparent);
}
.mat-mdc-standard-chip.mdc-evolution-chip--disabled {
  background-color: var(--%NS%mat-chip-elevated-disabled-container-color);
}
.mat-mdc-standard-chip.mdc-evolution-chip--%NS%selected:not(.mdc-evolution-chip--disabled) {
  background-color: var(--%NS%mat-chip-elevated-selected-container-color, var(--%NS%mat-sys-secondary-container));
}
.mat-mdc-standard-chip.mdc-evolution-chip--selected.mdc-evolution-chip--disabled {
  background-color: var(--%NS%mat-chip-flat-disabled-selected-container-color, color-mix(in srgb, var(--%NS%mat-sys-on-surface) 12%, transparent));
}
@media (forced-colors: active) {
  .mat-mdc-standard-chip {
    outline: solid 1px;
  }
}

.mat-mdc-standard-chip .mdc-evolution-chip__icon--primary {
  border-radius: var(--%NS%mat-chip-with-avatar-avatar-shape-radius, 24px);
  width: var(--%NS%mat-chip-with-icon-icon-size, 18px);
  height: var(--%NS%mat-chip-with-icon-icon-size, 18px);
  font-size: var(--%NS%mat-chip-with-icon-icon-size, 18px);
}
.mdc-evolution-chip--selected .mdc-evolution-chip__icon--primary {
  opacity: 0;
}
.mat-mdc-standard-chip:not(.mdc-evolution-chip--disabled) .mdc-evolution-chip__icon--primary {
  color: var(--%NS%mat-chip-with-icon-icon-color, var(--%NS%mat-sys-on-surface-variant));
}
.mat-mdc-standard-chip.mdc-evolution-chip--disabled .mdc-evolution-chip__icon--primary {
  color: var(--%NS%mat-chip-with-icon-disabled-icon-color, var(--%NS%mat-sys-on-surface));
}

.mat-mdc-chip-highlighted {
  --%NS%mat-chip-with-icon-icon-color: var(--%NS%mat-chip-with-icon-selected-icon-color, var(--%NS%mat-sys-on-secondary-container));
  --%NS%mat-chip-elevated-container-color: var(--%NS%mat-chip-elevated-selected-container-color, var(--%NS%mat-sys-secondary-container));
  --%NS%mat-chip-label-text-color: var(--%NS%mat-chip-selected-label-text-color, var(--%NS%mat-sys-on-secondary-container));
  --%NS%mat-chip-outline-width: var(--%NS%mat-chip-flat-selected-outline-width, 0);
}

.mat-mdc-chip-focus-overlay {
  background: var(--%NS%mat-chip-focus-state-layer-color, var(--%NS%mat-sys-on-surface-variant));
}
.mat-mdc-chip-selected .mat-mdc-chip-focus-overlay, .mat-mdc-chip-highlighted .mat-mdc-chip-focus-overlay {
  background: var(--%NS%mat-chip-selected-focus-state-layer-color, var(--%NS%mat-sys-on-secondary-container));
}
.mat-mdc-chip:hover .mat-mdc-chip-focus-overlay {
  background: var(--%NS%mat-chip-hover-state-layer-color, var(--%NS%mat-sys-on-surface-variant));
  opacity: var(--%NS%mat-chip-hover-state-layer-opacity, var(--%NS%mat-sys-hover-state-layer-opacity));
}
.mat-mdc-chip-focus-overlay .mat-mdc-chip-selected:hover, .mat-mdc-chip-highlighted:hover .mat-mdc-chip-focus-overlay {
  background: var(--%NS%mat-chip-selected-hover-state-layer-color, var(--%NS%mat-sys-on-secondary-container));
  opacity: var(--%NS%mat-chip-selected-hover-state-layer-opacity, var(--%NS%mat-sys-hover-state-layer-opacity));
}
.mat-mdc-chip.cdk-focused .mat-mdc-chip-focus-overlay {
  background: var(--%NS%mat-chip-focus-state-layer-color, var(--%NS%mat-sys-on-surface-variant));
  opacity: var(--%NS%mat-chip-focus-state-layer-opacity, var(--%NS%mat-sys-focus-state-layer-opacity));
}
.mat-mdc-chip-selected.cdk-focused .mat-mdc-chip-focus-overlay, .mat-mdc-chip-highlighted.cdk-focused .mat-mdc-chip-focus-overlay {
  background: var(--%NS%mat-chip-selected-focus-state-layer-color, var(--%NS%mat-sys-on-secondary-container));
  opacity: var(--%NS%mat-chip-selected-focus-state-layer-opacity, var(--%NS%mat-sys-focus-state-layer-opacity));
}

.mdc-evolution-chip--%NS%disabled:not(.mdc-evolution-chip--selected) .mat-mdc-chip-avatar {
  opacity: var(--%NS%mat-chip-with-avatar-disabled-avatar-opacity, 0.38);
}

.mdc-evolution-chip--disabled .mdc-evolution-chip__icon--trailing {
  opacity: var(--%NS%mat-chip-with-trailing-icon-disabled-trailing-icon-opacity, 0.38);
}

.mdc-evolution-chip--disabled.mdc-evolution-chip--selected .mdc-evolution-chip__checkmark {
  opacity: var(--%NS%mat-chip-with-icon-disabled-icon-opacity, 0.38);
}

.mat-mdc-standard-chip.mdc-evolution-chip--disabled {
  opacity: var(--%NS%mat-chip-disabled-container-opacity, 1);
}
.mat-mdc-standard-chip.mdc-evolution-chip--selected .mdc-evolution-chip__icon--trailing, .mat-mdc-standard-chip.mat-mdc-chip-highlighted .mdc-evolution-chip__icon--trailing {
  color: var(--%NS%mat-chip-selected-trailing-icon-color, var(--%NS%mat-sys-on-secondary-container));
}
.mat-mdc-standard-chip.mdc-evolution-chip--selected.mdc-evolution-chip--disabled .mdc-evolution-chip__icon--trailing, .mat-mdc-standard-chip.mat-mdc-chip-highlighted.mdc-evolution-chip--disabled .mdc-evolution-chip__icon--trailing {
  color: var(--%NS%mat-chip-selected-disabled-trailing-icon-color, var(--%NS%mat-sys-on-surface));
}

.mat-mdc-chip-edit, .mat-mdc-chip-remove {
  opacity: var(--%NS%mat-chip-trailing-action-opacity, 1);
}
.mat-mdc-chip-edit:focus, .mat-mdc-chip-remove:focus {
  opacity: var(--%NS%mat-chip-trailing-action-focus-opacity, 1);
}
.mat-mdc-chip-edit::after, .mat-mdc-chip-remove::after {
  background-color: var(--%NS%mat-chip-trailing-action-state-layer-color, var(--%NS%mat-sys-on-surface-variant));
}
.mat-mdc-chip-edit:hover::after, .mat-mdc-chip-remove:hover::after {
  opacity: calc(var(--%NS%mat-chip-hover-state-layer-opacity, var(--%NS%mat-sys-hover-state-layer-opacity)) + var(--%NS%mat-chip-trailing-action-hover-state-layer-opacity, var(--%NS%mat-sys-hover-state-layer-opacity)));
}
.mat-mdc-chip-edit:focus::after, .mat-mdc-chip-remove:focus::after {
  opacity: calc(var(--%NS%mat-chip-hover-state-layer-opacity, var(--%NS%mat-sys-hover-state-layer-opacity)) + var(--%NS%mat-chip-trailing-action-focus-state-layer-opacity, var(--%NS%mat-sys-focus-state-layer-opacity)));
}

.mat-mdc-chip-selected .mat-mdc-chip-remove::after,
.mat-mdc-chip-highlighted .mat-mdc-chip-remove::after {
  background-color: var(--%NS%mat-chip-selected-trailing-action-state-layer-color, var(--%NS%mat-sys-on-secondary-container));
}

.mat-mdc-chip.cdk-focused .mat-mdc-chip-edit:focus::after, .mat-mdc-chip.cdk-focused .mat-mdc-chip-remove:focus::after {
  opacity: calc(var(--%NS%mat-chip-selected-focus-state-layer-opacity, var(--%NS%mat-sys-focus-state-layer-opacity)) + var(--%NS%mat-chip-trailing-action-focus-state-layer-opacity, var(--%NS%mat-sys-focus-state-layer-opacity)));
}
.mat-mdc-chip.cdk-focused .mat-mdc-chip-edit:hover::after, .mat-mdc-chip.cdk-focused .mat-mdc-chip-remove:hover::after {
  opacity: calc(var(--%NS%mat-chip-selected-focus-state-layer-opacity, var(--%NS%mat-sys-focus-state-layer-opacity)) + var(--%NS%mat-chip-trailing-action-hover-state-layer-opacity, var(--%NS%mat-sys-hover-state-layer-opacity)));
}

.mat-mdc-standard-chip {
  -webkit-tap-highlight-color: transparent;
}
.mat-mdc-standard-chip .mat-mdc-chip-graphic,
.mat-mdc-standard-chip .mat-mdc-chip-trailing-icon {
  box-sizing: content-box;
}
.mat-mdc-standard-chip._mat-animation-noopable,
.mat-mdc-standard-chip._mat-animation-noopable .mdc-evolution-chip__graphic,
.mat-mdc-standard-chip._mat-animation-noopable .mdc-evolution-chip__checkmark,
.mat-mdc-standard-chip._mat-animation-noopable .mdc-evolution-chip__checkmark-path {
  transition-duration: 1ms;
  animation-duration: 1ms;
}

.mat-mdc-chip-focus-overlay {
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  position: absolute;
  pointer-events: none;
  opacity: 0;
  border-radius: inherit;
  transition: opacity 150ms linear;
}
._mat-animation-noopable .mat-mdc-chip-focus-overlay {
  transition: none;
}
.mat-mdc-basic-chip .mat-mdc-chip-focus-overlay {
  display: none;
}

.mat-mdc-chip .mat-ripple.mat-mdc-chip-ripple {
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  position: absolute;
  pointer-events: none;
  border-radius: inherit;
}

.mat-mdc-chip-avatar {
  text-align: center;
  line-height: 1;
  color: var(--%NS%mat-chip-with-icon-icon-color, currentColor);
}

.mat-mdc-chip {
  position: relative;
  z-index: 0;
}

.mat-mdc-chip-action-label {
  text-align: left;
  z-index: 1;
}
[dir=rtl] .mat-mdc-chip-action-label {
  text-align: right;
}
.mat-mdc-chip.mdc-evolution-chip--with-trailing-action .mat-mdc-chip-action-label {
  position: relative;
}
.mat-mdc-chip-action-label .mat-mdc-chip-primary-focus-indicator {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  pointer-events: none;
}
.mat-mdc-chip-action-label .mat-focus-indicator::before {
  margin: calc(calc(var(--%NS%mat-focus-indicator-border-width, 3px) + 2px) * -1);
}

.mat-mdc-chip-edit::before, .mat-mdc-chip-remove::before {
  margin: calc(var(--%NS%mat-focus-indicator-border-width, 3px) * -1);
  left: 8px;
  right: 8px;
}
.mat-mdc-chip-edit::after, .mat-mdc-chip-remove::after {
  content: "";
  display: block;
  opacity: 0;
  position: absolute;
  top: -3px;
  bottom: -3px;
  left: 5px;
  right: 5px;
  border-radius: 50%;
  box-sizing: border-box;
  padding: 12px;
  margin: -12px;
  background-clip: content-box;
}
.mat-mdc-chip-edit .mat-icon, .mat-mdc-chip-remove .mat-icon {
  width: 18px;
  height: 18px;
  font-size: 18px;
  box-sizing: content-box;
}

.mat-chip-edit-input {
  cursor: text;
  display: inline-block;
  color: inherit;
  outline: 0;
}

@media (forced-colors: active) {
  .mat-mdc-chip-selected:not(.mat-mdc-chip-multiple) {
    outline-width: 3px;
  }
}

.mat-mdc-chip-action:focus-visible .mat-focus-indicator::before {
  content: "";
}

.mdc-evolution-chip__icon, .mat-mdc-chip-edit .mat-icon, .mat-mdc-chip-remove .mat-icon {
  min-height: fit-content;
}

img.mdc-evolution-chip__icon {
  min-height: 0;
}
`],encapsulation:2})})()}return t})();var Eg=(()=>{class t extends Sc{_defaultOptions=p(Cg,{optional:!0});chipListSelectable=!0;_chipListMultiple=!1;_chipListHideSingleSelectionIndicator=this._defaultOptions?.hideSingleSelectionIndicator??!1;get selectable(){return this._selectable&&this.chipListSelectable}set selectable(e){this._selectable=e,this._changeDetectorRef.markForCheck()}_selectable=!0;get selected(){return this._selected}set selected(e){this._setSelectedState(e,!1,!0)}_selected=!1;get ariaSelected(){return this.selectable?this.selected.toString():null}basicChipAttrName="mat-basic-chip-option";selectionChange=new K;ngOnInit(){super.ngOnInit(),this.role="presentation"}select(){this._setSelectedState(!0,!1,!0)}deselect(){this._setSelectedState(!1,!1,!0)}selectViaInteraction(){this._setSelectedState(!0,!0,!0)}toggleSelected(e=!1){return this._setSelectedState(!this.selected,e,!0),this.selected}_handlePrimaryActionInteraction(){this.disabled||(this.focus(),this.selectable&&this.toggleSelected(!0))}_hasLeadingGraphic(){return this.leadingIcon?!0:!this._chipListHideSingleSelectionIndicator||this._chipListMultiple}_setSelectedState(e,i,o){e!==this.selected&&(this._selected=e,o&&this.selectionChange.emit({source:this,isUserInput:i,selected:this.selected}),this._changeDetectorRef.markForCheck())}static \u0275fac=(()=>{let e;return function(o){return(e||(e=Ot(t)))(o||t)}})();static \u0275cmp=(function(){let e=["*",[["mat-chip-avatar"],["","matChipAvatar",""]],[["mat-chip-trailing-icon"],["","matChipRemove",""],["","matChipTrailingIcon",""]]],i=["*","mat-chip-avatar, [matChipAvatar]","mat-chip-trailing-icon,[matChipRemove],[matChipTrailingIcon]"];function o(r,s){r&1&&(f(0,"span",3),oe(1,1),f(2,"span",8),_n(),f(3,"svg",9),A(4,"path",10),u()()())}function a(r,s){r&1&&(f(0,"span",7),oe(1,2),u())}return H({type:t,selectors:[["mat-basic-chip-option"],["","mat-basic-chip-option",""],["mat-chip-option"],["","mat-chip-option",""]],hostAttrs:[1,"mat-mdc-chip","mat-mdc-chip-option"],hostVars:37,hostBindings:function(s,c){s&2&&(Vt("id",c.id),Q("tabindex",null)("aria-label",null)("aria-description",null)("role",c.role),z("mdc-evolution-chip",!c._isBasicChip)("mdc-evolution-chip--filter",!c._isBasicChip)("mdc-evolution-chip--selectable",!c._isBasicChip)("mat-mdc-chip-selected",c.selected)("mat-mdc-chip-multiple",c._chipListMultiple)("mat-mdc-chip-disabled",c.disabled)("mat-mdc-chip-with-avatar",c.leadingIcon)("mdc-evolution-chip--disabled",c.disabled)("mdc-evolution-chip--selected",c.selected)("mdc-evolution-chip--selecting",!c._animationsDisabled)("mdc-evolution-chip--with-trailing-action",c._hasTrailingIcon())("mdc-evolution-chip--with-primary-icon",c.leadingIcon)("mdc-evolution-chip--with-primary-graphic",c._hasLeadingGraphic())("mdc-evolution-chip--with-avatar",c.leadingIcon)("mat-mdc-chip-highlighted",c.highlighted)("mat-mdc-chip-with-trailing-icon",c._hasTrailingIcon()))},inputs:{selectable:[2,"selectable","selectable",O],selected:[2,"selected","selected",O]},outputs:{selectionChange:"selectionChange"},features:[ze([{provide:Sc,useExisting:t},{provide:Sg,useExisting:t}]),Ge],ngContentSelectors:i,decls:9,vars:6,consts:[[1,"mat-mdc-chip-focus-overlay"],["role","presentation",1,"mdc-evolution-chip__cell","mdc-evolution-chip__cell--primary"],["matChipAction","","role","option",3,"_allowFocusWhenDisabled"],[1,"mdc-evolution-chip__graphic","mat-mdc-chip-graphic"],[1,"mdc-evolution-chip__text-label","mat-mdc-chip-action-label"],[1,"mat-mdc-chip-primary-focus-indicator","mat-focus-indicator"],[1,"mat-mdc-chip-touch-target"],["role","presentation",1,"mdc-evolution-chip__cell","mdc-evolution-chip__cell--trailing"],[1,"mdc-evolution-chip__checkmark"],["viewBox","-2 -3 30 30","focusable","false","aria-hidden","true",1,"mdc-evolution-chip__checkmark-svg"],["fill","none","stroke","currentColor","d","M1.73,12.91 8.1,19.28 22.79,4.59",1,"mdc-evolution-chip__checkmark-path"]],template:function(s,c){s&1&&(Be(e),A(0,"span",0),f(1,"span",1)(2,"button",2),k(3,o,5,0,"span",3),f(4,"span",4),oe(5),A(6,"span",5)(7,"span",6),u()()(),k(8,a,2,0,"span",7)),s&2&&(h(2),R("_allowFocusWhenDisabled",!0),Q("aria-description",c.ariaDescription)("aria-label",c.ariaLabel)("aria-selected",c.ariaSelected),h(),N(c._hasLeadingGraphic()?3:-1),h(5),N(c._hasTrailingIcon()?8:-1))},dependencies:[wg],styles:[`.mdc-evolution-chip,
.mdc-evolution-chip__cell,
.mdc-evolution-chip__action {
  display: inline-flex;
  align-items: center;
}

.mdc-evolution-chip {
  position: relative;
  max-width: 100%;
}

.mat-mdc-chip-touch-target {
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 48px;
  transform: translateY(-50%);
  display: var(--%NS%mat-chip-touch-target-display, block);
  pointer-events: auto;
}

.mdc-evolution-chip__cell,
.mdc-evolution-chip__action {
  height: 100%;
}

.mdc-evolution-chip__cell--primary {
  flex-basis: 100%;
  overflow-x: hidden;
}

.mdc-evolution-chip__cell--trailing {
  flex: 1 0 auto;
}

.mdc-evolution-chip__action {
  align-items: center;
  background: none;
  border: none;
  box-sizing: content-box;
  cursor: pointer;
  display: inline-flex;
  justify-content: center;
  outline: none;
  padding: 0;
  text-decoration: none;
  color: inherit;
}

.mdc-evolution-chip__action--presentational {
  cursor: auto;
}

.mdc-evolution-chip--disabled,
.mdc-evolution-chip__action:disabled {
  pointer-events: none;
}
@media (forced-colors: active) {
  .mdc-evolution-chip--disabled,
  .mdc-evolution-chip__action:disabled {
    forced-color-adjust: none;
  }
}

.mdc-evolution-chip__action--primary {
  font: inherit;
  letter-spacing: inherit;
  white-space: inherit;
  overflow-x: hidden;
}
.mat-mdc-standard-chip .mdc-evolution-chip__action--%NS%primary::before {
  border-width: var(--%NS%mat-chip-outline-width, 1px);
  border-radius: var(--%NS%mat-chip-container-shape-radius, 8px);
  box-sizing: border-box;
  content: "";
  height: 100%;
  left: 0;
  position: absolute;
  pointer-events: none;
  top: 0;
  width: 100%;
  z-index: 1;
  border-style: solid;
}
.mat-mdc-standard-chip .mdc-evolution-chip__action--primary {
  padding-left: 12px;
  padding-right: 12px;
}
.mat-mdc-standard-chip.mdc-evolution-chip--with-primary-graphic .mdc-evolution-chip__action--primary {
  padding-left: 0;
  padding-right: 12px;
}
[dir=rtl] .mat-mdc-standard-chip.mdc-evolution-chip--with-primary-graphic .mdc-evolution-chip__action--primary {
  padding-left: 12px;
  padding-right: 0;
}
.mat-mdc-standard-chip:not(.mdc-evolution-chip--disabled) .mdc-evolution-chip__action--%NS%primary::before {
  border-color: var(--%NS%mat-chip-outline-color, var(--%NS%mat-sys-outline));
}
.mdc-evolution-chip__action--%NS%primary:not(.mdc-evolution-chip__action--presentational):not(.mdc-ripple-upgraded):focus::before {
  border-color: var(--%NS%mat-chip-focus-outline-color, var(--%NS%mat-sys-on-surface-variant));
}
.mat-mdc-standard-chip.mdc-evolution-chip--disabled .mdc-evolution-chip__action--%NS%primary::before {
  border-color: var(--%NS%mat-chip-disabled-outline-color, color-mix(in srgb, var(--%NS%mat-sys-on-surface) 12%, transparent));
}
.mat-mdc-standard-chip.mdc-evolution-chip--selected .mdc-evolution-chip__action--%NS%primary::before {
  border-width: var(--%NS%mat-chip-flat-selected-outline-width, 0);
}
.mat-mdc-basic-chip .mdc-evolution-chip__action--primary {
  font: inherit;
}
.mat-mdc-standard-chip.mdc-evolution-chip--with-leading-action .mdc-evolution-chip__action--primary {
  padding-left: 0;
  padding-right: 12px;
}
[dir=rtl] .mat-mdc-standard-chip.mdc-evolution-chip--with-leading-action .mdc-evolution-chip__action--primary {
  padding-left: 12px;
  padding-right: 0;
}
.mat-mdc-standard-chip.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__action--primary {
  padding-left: 12px;
  padding-right: 0;
}
[dir=rtl] .mat-mdc-standard-chip.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__action--primary {
  padding-left: 0;
  padding-right: 12px;
}
.mat-mdc-standard-chip.mdc-evolution-chip--with-leading-action.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__action--primary {
  padding-left: 0;
  padding-right: 0;
}
.mat-mdc-standard-chip.mdc-evolution-chip--with-primary-graphic.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__action--primary {
  padding-left: 0;
  padding-right: 0;
}
[dir=rtl] .mat-mdc-standard-chip.mdc-evolution-chip--with-primary-graphic.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__action--primary {
  padding-left: 0;
  padding-right: 0;
}
.mdc-evolution-chip--with-avatar.mdc-evolution-chip--with-primary-graphic .mdc-evolution-chip__action--primary {
  padding-left: 0;
  padding-right: 12px;
}
[dir=rtl] .mdc-evolution-chip--with-avatar.mdc-evolution-chip--with-primary-graphic .mdc-evolution-chip__action--primary {
  padding-left: 12px;
  padding-right: 0;
}
.mdc-evolution-chip--with-avatar.mdc-evolution-chip--with-primary-graphic.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__action--primary {
  padding-left: 0;
  padding-right: 0;
}
[dir=rtl] .mdc-evolution-chip--with-avatar.mdc-evolution-chip--with-primary-graphic.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__action--primary {
  padding-left: 0;
  padding-right: 0;
}

.mdc-evolution-chip__action--secondary {
  position: relative;
  overflow: visible;
}
.mat-mdc-standard-chip:not(.mdc-evolution-chip--disabled) .mdc-evolution-chip__action--secondary {
  color: var(--%NS%mat-chip-with-trailing-icon-trailing-icon-color, var(--%NS%mat-sys-on-surface-variant));
}
.mat-mdc-standard-chip.mdc-evolution-chip--disabled .mdc-evolution-chip__action--secondary {
  color: var(--%NS%mat-chip-with-trailing-icon-disabled-trailing-icon-color, var(--%NS%mat-sys-on-surface));
}
.mat-mdc-standard-chip.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__action--secondary, .mat-mdc-standard-chip.mdc-evolution-chip--with-leading-action .mdc-evolution-chip__action--secondary {
  padding-left: 8px;
  padding-right: 8px;
}
.mat-mdc-standard-chip.mdc-evolution-chip--with-primary-graphic.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__action--secondary, .mat-mdc-standard-chip.mdc-evolution-chip--with-primary-graphic.mdc-evolution-chip--with-leading-action .mdc-evolution-chip__action--secondary {
  padding-left: 8px;
  padding-right: 8px;
}
.mdc-evolution-chip--with-avatar.mdc-evolution-chip--with-primary-graphic.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__action--secondary, .mdc-evolution-chip--with-avatar.mdc-evolution-chip--with-primary-graphic.mdc-evolution-chip--with-leading-action .mdc-evolution-chip__action--secondary {
  padding-left: 8px;
  padding-right: 8px;
}
[dir=rtl] .mdc-evolution-chip--with-avatar.mdc-evolution-chip--with-primary-graphic.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__action--secondary, [dir=rtl] .mdc-evolution-chip--with-avatar.mdc-evolution-chip--with-primary-graphic.mdc-evolution-chip--with-leading-action .mdc-evolution-chip__action--secondary {
  padding-left: 8px;
  padding-right: 8px;
}

.mdc-evolution-chip__text-label {
  -webkit-user-select: none;
  user-select: none;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
.mat-mdc-standard-chip .mdc-evolution-chip__text-label {
  font-family: var(--%NS%mat-chip-label-text-font, var(--%NS%mat-sys-label-large-font));
  line-height: var(--%NS%mat-chip-label-text-line-height, var(--%NS%mat-sys-label-large-line-height));
  font-size: var(--%NS%mat-chip-label-text-size, var(--%NS%mat-sys-label-large-size));
  font-weight: var(--%NS%mat-chip-label-text-weight, var(--%NS%mat-sys-label-large-weight));
  letter-spacing: var(--%NS%mat-chip-label-text-tracking, var(--%NS%mat-sys-label-large-tracking));
}
.mat-mdc-standard-chip:not(.mdc-evolution-chip--disabled) .mdc-evolution-chip__text-label {
  color: var(--%NS%mat-chip-label-text-color, var(--%NS%mat-sys-on-surface-variant));
}
.mat-mdc-standard-chip.mdc-evolution-chip--%NS%selected:not(.mdc-evolution-chip--disabled) .mdc-evolution-chip__text-label {
  color: var(--%NS%mat-chip-selected-label-text-color, var(--%NS%mat-sys-on-secondary-container));
}
.mat-mdc-standard-chip.mdc-evolution-chip--disabled .mdc-evolution-chip__text-label, .mat-mdc-standard-chip.mdc-evolution-chip--selected.mdc-evolution-chip--disabled .mdc-evolution-chip__text-label {
  color: var(--%NS%mat-chip-disabled-label-text-color, color-mix(in srgb, var(--%NS%mat-sys-on-surface) 38%, transparent));
}

.mdc-evolution-chip__graphic {
  align-items: center;
  display: inline-flex;
  justify-content: center;
  overflow: hidden;
  pointer-events: none;
  position: relative;
  flex: 1 0 auto;
}
.mat-mdc-standard-chip .mdc-evolution-chip__graphic {
  width: var(--%NS%mat-chip-with-avatar-avatar-size, 24px);
  height: var(--%NS%mat-chip-with-avatar-avatar-size, 24px);
  font-size: var(--%NS%mat-chip-with-avatar-avatar-size, 24px);
}
.mdc-evolution-chip--selecting .mdc-evolution-chip__graphic {
  transition: width 150ms 0ms cubic-bezier(0.4, 0, 0.2, 1);
}
.mdc-evolution-chip--%NS%selectable:not(.mdc-evolution-chip--selected):not(.mdc-evolution-chip--with-primary-icon) .mdc-evolution-chip__graphic {
  width: 0;
}
.mat-mdc-standard-chip.mdc-evolution-chip--with-primary-graphic .mdc-evolution-chip__graphic {
  padding-left: 6px;
  padding-right: 6px;
}
.mdc-evolution-chip--with-avatar.mdc-evolution-chip--with-primary-graphic .mdc-evolution-chip__graphic {
  padding-left: 4px;
  padding-right: 8px;
}
[dir=rtl] .mdc-evolution-chip--with-avatar.mdc-evolution-chip--with-primary-graphic .mdc-evolution-chip__graphic {
  padding-left: 8px;
  padding-right: 4px;
}
.mat-mdc-standard-chip.mdc-evolution-chip--with-primary-graphic.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__graphic {
  padding-left: 6px;
  padding-right: 6px;
}
.mdc-evolution-chip--with-avatar.mdc-evolution-chip--with-primary-graphic.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__graphic {
  padding-left: 4px;
  padding-right: 8px;
}
[dir=rtl] .mdc-evolution-chip--with-avatar.mdc-evolution-chip--with-primary-graphic.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__graphic {
  padding-left: 8px;
  padding-right: 4px;
}
.mdc-evolution-chip--with-avatar.mdc-evolution-chip--with-primary-graphic.mdc-evolution-chip--with-leading-action .mdc-evolution-chip__graphic {
  padding-left: 0;
}

.mdc-evolution-chip__checkmark {
  position: absolute;
  opacity: 0;
  top: 50%;
  left: 50%;
  height: 20px;
  width: 20px;
}
.mat-mdc-standard-chip:not(.mdc-evolution-chip--disabled) .mdc-evolution-chip__checkmark {
  color: var(--%NS%mat-chip-with-icon-selected-icon-color, var(--%NS%mat-sys-on-secondary-container));
}
.mat-mdc-standard-chip.mdc-evolution-chip--disabled .mdc-evolution-chip__checkmark {
  color: var(--%NS%mat-chip-with-icon-disabled-icon-color, var(--%NS%mat-sys-on-surface));
}
.mdc-evolution-chip--selecting .mdc-evolution-chip__checkmark {
  transition: transform 150ms 0ms cubic-bezier(0.4, 0, 0.2, 1);
  transform: translate(-75%, -50%);
}
.mdc-evolution-chip--selected .mdc-evolution-chip__checkmark {
  transform: translate(-50%, -50%);
  opacity: 1;
}

.mdc-evolution-chip__checkmark-svg {
  display: block;
}

.mdc-evolution-chip__checkmark-path {
  stroke-width: 2px;
  stroke-dasharray: 29.7833385;
  stroke-dashoffset: 29.7833385;
  stroke: currentColor;
}
.mdc-evolution-chip--selecting .mdc-evolution-chip__checkmark-path {
  transition: stroke-dashoffset 150ms 45ms cubic-bezier(0.4, 0, 0.2, 1);
}
.mdc-evolution-chip--selected .mdc-evolution-chip__checkmark-path {
  stroke-dashoffset: 0;
}
@media (forced-colors: active) {
  .mdc-evolution-chip__checkmark-path {
    stroke: CanvasText !important;
  }
}

.mat-mdc-standard-chip .mdc-evolution-chip__icon--trailing {
  height: 18px;
  width: 18px;
  font-size: 18px;
}
.mdc-evolution-chip--disabled .mdc-evolution-chip__icon--trailing.mat-mdc-chip-remove {
  opacity: calc(var(--%NS%mat-chip-trailing-action-opacity, 1) * var(--%NS%mat-chip-with-trailing-icon-disabled-trailing-icon-opacity, 0.38));
}
.mdc-evolution-chip--disabled .mdc-evolution-chip__icon--trailing.mat-mdc-chip-remove:focus {
  opacity: calc(var(--%NS%mat-chip-trailing-action-focus-opacity, 1) * var(--%NS%mat-chip-with-trailing-icon-disabled-trailing-icon-opacity, 0.38));
}

.mat-mdc-standard-chip {
  border-radius: var(--%NS%mat-chip-container-shape-radius, 8px);
  height: var(--%NS%mat-chip-container-height, 32px);
}
.mat-mdc-standard-chip:not(.mdc-evolution-chip--disabled) {
  background-color: var(--%NS%mat-chip-elevated-container-color, transparent);
}
.mat-mdc-standard-chip.mdc-evolution-chip--disabled {
  background-color: var(--%NS%mat-chip-elevated-disabled-container-color);
}
.mat-mdc-standard-chip.mdc-evolution-chip--%NS%selected:not(.mdc-evolution-chip--disabled) {
  background-color: var(--%NS%mat-chip-elevated-selected-container-color, var(--%NS%mat-sys-secondary-container));
}
.mat-mdc-standard-chip.mdc-evolution-chip--selected.mdc-evolution-chip--disabled {
  background-color: var(--%NS%mat-chip-flat-disabled-selected-container-color, color-mix(in srgb, var(--%NS%mat-sys-on-surface) 12%, transparent));
}
@media (forced-colors: active) {
  .mat-mdc-standard-chip {
    outline: solid 1px;
  }
}

.mat-mdc-standard-chip .mdc-evolution-chip__icon--primary {
  border-radius: var(--%NS%mat-chip-with-avatar-avatar-shape-radius, 24px);
  width: var(--%NS%mat-chip-with-icon-icon-size, 18px);
  height: var(--%NS%mat-chip-with-icon-icon-size, 18px);
  font-size: var(--%NS%mat-chip-with-icon-icon-size, 18px);
}
.mdc-evolution-chip--selected .mdc-evolution-chip__icon--primary {
  opacity: 0;
}
.mat-mdc-standard-chip:not(.mdc-evolution-chip--disabled) .mdc-evolution-chip__icon--primary {
  color: var(--%NS%mat-chip-with-icon-icon-color, var(--%NS%mat-sys-on-surface-variant));
}
.mat-mdc-standard-chip.mdc-evolution-chip--disabled .mdc-evolution-chip__icon--primary {
  color: var(--%NS%mat-chip-with-icon-disabled-icon-color, var(--%NS%mat-sys-on-surface));
}

.mat-mdc-chip-highlighted {
  --%NS%mat-chip-with-icon-icon-color: var(--%NS%mat-chip-with-icon-selected-icon-color, var(--%NS%mat-sys-on-secondary-container));
  --%NS%mat-chip-elevated-container-color: var(--%NS%mat-chip-elevated-selected-container-color, var(--%NS%mat-sys-secondary-container));
  --%NS%mat-chip-label-text-color: var(--%NS%mat-chip-selected-label-text-color, var(--%NS%mat-sys-on-secondary-container));
  --%NS%mat-chip-outline-width: var(--%NS%mat-chip-flat-selected-outline-width, 0);
}

.mat-mdc-chip-focus-overlay {
  background: var(--%NS%mat-chip-focus-state-layer-color, var(--%NS%mat-sys-on-surface-variant));
}
.mat-mdc-chip-selected .mat-mdc-chip-focus-overlay, .mat-mdc-chip-highlighted .mat-mdc-chip-focus-overlay {
  background: var(--%NS%mat-chip-selected-focus-state-layer-color, var(--%NS%mat-sys-on-secondary-container));
}
.mat-mdc-chip:hover .mat-mdc-chip-focus-overlay {
  background: var(--%NS%mat-chip-hover-state-layer-color, var(--%NS%mat-sys-on-surface-variant));
  opacity: var(--%NS%mat-chip-hover-state-layer-opacity, var(--%NS%mat-sys-hover-state-layer-opacity));
}
.mat-mdc-chip-focus-overlay .mat-mdc-chip-selected:hover, .mat-mdc-chip-highlighted:hover .mat-mdc-chip-focus-overlay {
  background: var(--%NS%mat-chip-selected-hover-state-layer-color, var(--%NS%mat-sys-on-secondary-container));
  opacity: var(--%NS%mat-chip-selected-hover-state-layer-opacity, var(--%NS%mat-sys-hover-state-layer-opacity));
}
.mat-mdc-chip.cdk-focused .mat-mdc-chip-focus-overlay {
  background: var(--%NS%mat-chip-focus-state-layer-color, var(--%NS%mat-sys-on-surface-variant));
  opacity: var(--%NS%mat-chip-focus-state-layer-opacity, var(--%NS%mat-sys-focus-state-layer-opacity));
}
.mat-mdc-chip-selected.cdk-focused .mat-mdc-chip-focus-overlay, .mat-mdc-chip-highlighted.cdk-focused .mat-mdc-chip-focus-overlay {
  background: var(--%NS%mat-chip-selected-focus-state-layer-color, var(--%NS%mat-sys-on-secondary-container));
  opacity: var(--%NS%mat-chip-selected-focus-state-layer-opacity, var(--%NS%mat-sys-focus-state-layer-opacity));
}

.mdc-evolution-chip--%NS%disabled:not(.mdc-evolution-chip--selected) .mat-mdc-chip-avatar {
  opacity: var(--%NS%mat-chip-with-avatar-disabled-avatar-opacity, 0.38);
}

.mdc-evolution-chip--disabled .mdc-evolution-chip__icon--trailing {
  opacity: var(--%NS%mat-chip-with-trailing-icon-disabled-trailing-icon-opacity, 0.38);
}

.mdc-evolution-chip--disabled.mdc-evolution-chip--selected .mdc-evolution-chip__checkmark {
  opacity: var(--%NS%mat-chip-with-icon-disabled-icon-opacity, 0.38);
}

.mat-mdc-standard-chip.mdc-evolution-chip--disabled {
  opacity: var(--%NS%mat-chip-disabled-container-opacity, 1);
}
.mat-mdc-standard-chip.mdc-evolution-chip--selected .mdc-evolution-chip__icon--trailing, .mat-mdc-standard-chip.mat-mdc-chip-highlighted .mdc-evolution-chip__icon--trailing {
  color: var(--%NS%mat-chip-selected-trailing-icon-color, var(--%NS%mat-sys-on-secondary-container));
}
.mat-mdc-standard-chip.mdc-evolution-chip--selected.mdc-evolution-chip--disabled .mdc-evolution-chip__icon--trailing, .mat-mdc-standard-chip.mat-mdc-chip-highlighted.mdc-evolution-chip--disabled .mdc-evolution-chip__icon--trailing {
  color: var(--%NS%mat-chip-selected-disabled-trailing-icon-color, var(--%NS%mat-sys-on-surface));
}

.mat-mdc-chip-edit, .mat-mdc-chip-remove {
  opacity: var(--%NS%mat-chip-trailing-action-opacity, 1);
}
.mat-mdc-chip-edit:focus, .mat-mdc-chip-remove:focus {
  opacity: var(--%NS%mat-chip-trailing-action-focus-opacity, 1);
}
.mat-mdc-chip-edit::after, .mat-mdc-chip-remove::after {
  background-color: var(--%NS%mat-chip-trailing-action-state-layer-color, var(--%NS%mat-sys-on-surface-variant));
}
.mat-mdc-chip-edit:hover::after, .mat-mdc-chip-remove:hover::after {
  opacity: calc(var(--%NS%mat-chip-hover-state-layer-opacity, var(--%NS%mat-sys-hover-state-layer-opacity)) + var(--%NS%mat-chip-trailing-action-hover-state-layer-opacity, var(--%NS%mat-sys-hover-state-layer-opacity)));
}
.mat-mdc-chip-edit:focus::after, .mat-mdc-chip-remove:focus::after {
  opacity: calc(var(--%NS%mat-chip-hover-state-layer-opacity, var(--%NS%mat-sys-hover-state-layer-opacity)) + var(--%NS%mat-chip-trailing-action-focus-state-layer-opacity, var(--%NS%mat-sys-focus-state-layer-opacity)));
}

.mat-mdc-chip-selected .mat-mdc-chip-remove::after,
.mat-mdc-chip-highlighted .mat-mdc-chip-remove::after {
  background-color: var(--%NS%mat-chip-selected-trailing-action-state-layer-color, var(--%NS%mat-sys-on-secondary-container));
}

.mat-mdc-chip.cdk-focused .mat-mdc-chip-edit:focus::after, .mat-mdc-chip.cdk-focused .mat-mdc-chip-remove:focus::after {
  opacity: calc(var(--%NS%mat-chip-selected-focus-state-layer-opacity, var(--%NS%mat-sys-focus-state-layer-opacity)) + var(--%NS%mat-chip-trailing-action-focus-state-layer-opacity, var(--%NS%mat-sys-focus-state-layer-opacity)));
}
.mat-mdc-chip.cdk-focused .mat-mdc-chip-edit:hover::after, .mat-mdc-chip.cdk-focused .mat-mdc-chip-remove:hover::after {
  opacity: calc(var(--%NS%mat-chip-selected-focus-state-layer-opacity, var(--%NS%mat-sys-focus-state-layer-opacity)) + var(--%NS%mat-chip-trailing-action-hover-state-layer-opacity, var(--%NS%mat-sys-hover-state-layer-opacity)));
}

.mat-mdc-standard-chip {
  -webkit-tap-highlight-color: transparent;
}
.mat-mdc-standard-chip .mat-mdc-chip-graphic,
.mat-mdc-standard-chip .mat-mdc-chip-trailing-icon {
  box-sizing: content-box;
}
.mat-mdc-standard-chip._mat-animation-noopable,
.mat-mdc-standard-chip._mat-animation-noopable .mdc-evolution-chip__graphic,
.mat-mdc-standard-chip._mat-animation-noopable .mdc-evolution-chip__checkmark,
.mat-mdc-standard-chip._mat-animation-noopable .mdc-evolution-chip__checkmark-path {
  transition-duration: 1ms;
  animation-duration: 1ms;
}

.mat-mdc-chip-focus-overlay {
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  position: absolute;
  pointer-events: none;
  opacity: 0;
  border-radius: inherit;
  transition: opacity 150ms linear;
}
._mat-animation-noopable .mat-mdc-chip-focus-overlay {
  transition: none;
}
.mat-mdc-basic-chip .mat-mdc-chip-focus-overlay {
  display: none;
}

.mat-mdc-chip .mat-ripple.mat-mdc-chip-ripple {
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  position: absolute;
  pointer-events: none;
  border-radius: inherit;
}

.mat-mdc-chip-avatar {
  text-align: center;
  line-height: 1;
  color: var(--%NS%mat-chip-with-icon-icon-color, currentColor);
}

.mat-mdc-chip {
  position: relative;
  z-index: 0;
}

.mat-mdc-chip-action-label {
  text-align: left;
  z-index: 1;
}
[dir=rtl] .mat-mdc-chip-action-label {
  text-align: right;
}
.mat-mdc-chip.mdc-evolution-chip--with-trailing-action .mat-mdc-chip-action-label {
  position: relative;
}
.mat-mdc-chip-action-label .mat-mdc-chip-primary-focus-indicator {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  pointer-events: none;
}
.mat-mdc-chip-action-label .mat-focus-indicator::before {
  margin: calc(calc(var(--%NS%mat-focus-indicator-border-width, 3px) + 2px) * -1);
}

.mat-mdc-chip-edit::before, .mat-mdc-chip-remove::before {
  margin: calc(var(--%NS%mat-focus-indicator-border-width, 3px) * -1);
  left: 8px;
  right: 8px;
}
.mat-mdc-chip-edit::after, .mat-mdc-chip-remove::after {
  content: "";
  display: block;
  opacity: 0;
  position: absolute;
  top: -3px;
  bottom: -3px;
  left: 5px;
  right: 5px;
  border-radius: 50%;
  box-sizing: border-box;
  padding: 12px;
  margin: -12px;
  background-clip: content-box;
}
.mat-mdc-chip-edit .mat-icon, .mat-mdc-chip-remove .mat-icon {
  width: 18px;
  height: 18px;
  font-size: 18px;
  box-sizing: content-box;
}

.mat-chip-edit-input {
  cursor: text;
  display: inline-block;
  color: inherit;
  outline: 0;
}

@media (forced-colors: active) {
  .mat-mdc-chip-selected:not(.mat-mdc-chip-multiple) {
    outline-width: 3px;
  }
}

.mat-mdc-chip-action:focus-visible .mat-focus-indicator::before {
  content: "";
}

.mdc-evolution-chip__icon, .mat-mdc-chip-edit .mat-icon, .mat-mdc-chip-remove .mat-icon {
  min-height: fit-content;
}

img.mdc-evolution-chip__icon {
  min-height: 0;
}
`],encapsulation:2})})()}return t})();var Dg=(()=>{class t{_elementRef=p(q);_changeDetectorRef=p(He);_dir=p(ft,{optional:!0});_lastDestroyedFocusedChipIndex=null;_keyManager;_destroyed=new B;_defaultRole="presentation";get chipFocusChanges(){return this._getChipStream(e=>e._onFocus)}get chipDestroyedChanges(){return this._getChipStream(e=>e.destroyed)}get chipRemovedChanges(){return this._getChipStream(e=>e.removed)}get disabled(){return this._disabled}set disabled(e){this._disabled=e,this._syncChipsState()}_disabled=!1;get empty(){return!this._chips||this._chips.length===0}get role(){return this._explicitRole?this._explicitRole:this.empty?null:this._defaultRole}tabIndex=0;set role(e){this._explicitRole=e}_explicitRole=null;get focused(){return this._hasFocusedChip()}_chips;_chipActions=new Mn;ngAfterViewInit(){this._setUpFocusManagement(),this._trackChipSetChanges(),this._trackDestroyedFocusedChip()}ngOnDestroy(){this._keyManager?.destroy(),this._chipActions.destroy(),this._destroyed.next(),this._destroyed.complete()}_hasFocusedChip(){return this._chips&&this._chips.some(e=>e._hasFocus())}_syncChipsState(){this._chips?.forEach(e=>{e._chipListDisabled=this._disabled,e._changeDetectorRef.markForCheck()})}focus(){}_handleKeydown(e){this._originatesFromChip(e)&&this._keyManager.onKeydown(e)}_isValidIndex(e){return e>=0&&e<this._chips.length}_allowFocusEscape(){let e=this._elementRef.nativeElement.tabIndex;e!==-1&&(this._elementRef.nativeElement.tabIndex=-1,setTimeout(()=>this._elementRef.nativeElement.tabIndex=e))}_getChipStream(e){return this._chips.changes.pipe(st(null),Kt(()=>bt(...this._chips.map(e))))}_originatesFromChip(e){let i=e.target;for(;i&&i!==this._elementRef.nativeElement;){if(i.classList.contains("mat-mdc-chip"))return!0;i=i.parentElement}return!1}_setUpFocusManagement(){this._chips.changes.pipe(st(this._chips)).subscribe(e=>{let i=[];e.forEach(o=>o._getActions().forEach(a=>i.push(a))),this._chipActions.reset(i),this._chipActions.notifyOnChanges()}),this._keyManager=new Qi(this._chipActions).withVerticalOrientation().withHorizontalOrientation(this._dir?this._dir.value:"ltr").withHomeAndEnd().skipPredicate(e=>this._skipPredicate(e)),this.chipFocusChanges.pipe(Re(this._destroyed)).subscribe(({chip:e})=>{let i=e._getSourceAction(document.activeElement);i&&this._keyManager.updateActiveItem(i)}),this._dir?.change.pipe(Re(this._destroyed)).subscribe(e=>this._keyManager.withHorizontalOrientation(e))}_skipPredicate(e){return e.disabled}_trackChipSetChanges(){this._chips.changes.pipe(st(null),Re(this._destroyed)).subscribe(()=>{this.disabled&&Promise.resolve().then(()=>this._syncChipsState()),this._redirectDestroyedChipFocus()})}_trackDestroyedFocusedChip(){this.chipDestroyedChanges.pipe(Re(this._destroyed)).subscribe(e=>{let o=this._chips.toArray().indexOf(e.chip),a=e.chip._hasFocus(),r=e.chip._hadFocusOnRemove&&this._keyManager.activeItem&&e.chip._getActions().includes(this._keyManager.activeItem),s=a||r;this._isValidIndex(o)&&s&&(this._lastDestroyedFocusedChipIndex=o)})}_redirectDestroyedChipFocus(){if(this._lastDestroyedFocusedChipIndex!=null){if(this._chips.length){let e=Math.min(this._lastDestroyedFocusedChipIndex,this._chips.length-1),i=this._chips.toArray()[e];i.disabled?this._chips.length===1?this.focus():this._keyManager.setPreviousItemActive():i.focus()}else this.focus();this._lastDestroyedFocusedChipIndex=null}}static \u0275fac=function(i){return new(i||t)};static \u0275cmp=(function(){return H({type:t,selectors:[["mat-chip-set"]],contentQueries:function(o,a,r){if(o&1&&Mt(r,Sc,5),o&2){let s;Y(s=Z())&&(a._chips=s)}},hostAttrs:[1,"mat-mdc-chip-set","mdc-evolution-chip-set"],hostVars:1,hostBindings:function(o,a){o&1&&V("keydown",function(s){return a._handleKeydown(s)}),o&2&&Q("role",a.role)},inputs:{disabled:[2,"disabled","disabled",O],role:"role",tabIndex:[2,"tabIndex","tabIndex",i=>i==null?0:on(i)]},ngContentSelectors:["*"],decls:2,vars:0,consts:[["role","presentation",1,"mdc-evolution-chip-set__chips"]],template:function(o,a){o&1&&(Be(),Je(0,"div",0),oe(1),it())},styles:[`.mat-mdc-chip-set {
  display: flex;
}
.mat-mdc-chip-set:focus {
  outline: none;
}
.mat-mdc-chip-set .mdc-evolution-chip-set__chips {
  min-width: 100%;
  margin-left: -8px;
  margin-right: 0;
}
.mat-mdc-chip-set .mdc-evolution-chip {
  margin: 8px 0 8px 8px;
}
[dir=rtl] .mat-mdc-chip-set .mdc-evolution-chip-set__chips {
  margin-left: 0;
  margin-right: -8px;
}
[dir=rtl] .mat-mdc-chip-set .mdc-evolution-chip {
  margin-left: 0;
  margin-right: 8px;
}

.mdc-evolution-chip-set__chips {
  display: flex;
  flex-flow: wrap;
  min-width: 0;
}

.mat-mdc-chip-set-stacked {
  flex-direction: column;
  align-items: flex-start;
}
.mat-mdc-chip-set-stacked .mat-mdc-chip {
  width: 100%;
}
.mat-mdc-chip-set-stacked .mdc-evolution-chip__graphic {
  flex-grow: 0;
}
.mat-mdc-chip-set-stacked .mdc-evolution-chip__action--primary {
  flex-basis: 100%;
  justify-content: start;
}

input.mat-mdc-chip-input {
  flex: 1 0 150px;
  margin-left: 8px;
}
[dir=rtl] input.mat-mdc-chip-input {
  margin-left: 0;
  margin-right: 8px;
}
.mat-mdc-form-field:not(.mat-form-field-hide-placeholder) input.mat-mdc-chip-input::placeholder {
  opacity: 1;
}
.mat-mdc-form-field:not(.mat-form-field-hide-placeholder) input.mat-mdc-chip-input::-moz-placeholder {
  opacity: 1;
}
.mat-mdc-form-field:not(.mat-form-field-hide-placeholder) input.mat-mdc-chip-input::-webkit-input-placeholder {
  opacity: 1;
}
.mat-mdc-form-field:not(.mat-form-field-hide-placeholder) input.mat-mdc-chip-input:-ms-input-placeholder {
  opacity: 1;
}
.mat-mdc-chip-set + input.mat-mdc-chip-input {
  margin-left: 0;
  margin-right: 0;
}
`],encapsulation:2})})()}return t})(),xg=class{source;value;constructor(n,e){this.source=n,this.value=e}},mA={provide:to,useExisting:$t(()=>Mg),multi:!0},Mg=(()=>{class t extends Dg{_onTouched=()=>{};_onChange=()=>{};_defaultRole="listbox";_defaultOptions=p(Cg,{optional:!0});get multiple(){return this._multiple}set multiple(e){this._multiple=e,this._syncListboxProperties()}_multiple=!1;get selected(){let e=this._chips.toArray().filter(i=>i.selected);return this.multiple?e:e[0]}ariaOrientation="horizontal";get selectable(){return this._selectable}set selectable(e){this._selectable=e,this._syncListboxProperties()}_selectable=!0;compareWith=(e,i)=>e===i;required=!1;get hideSingleSelectionIndicator(){return this._hideSingleSelectionIndicator}set hideSingleSelectionIndicator(e){this._hideSingleSelectionIndicator=e,this._syncListboxProperties()}_hideSingleSelectionIndicator=this._defaultOptions?.hideSingleSelectionIndicator??!1;get chipSelectionChanges(){return this._getChipStream(e=>e.selectionChange)}get chipBlurChanges(){return this._getChipStream(e=>e._onBlur)}get value(){return this._value}set value(e){this._chips&&this._chips.length&&this._setSelectionByValue(e,!1),this._value=e}_value;change=new K;_chips=void 0;ngAfterContentInit(){this._chips.changes.pipe(st(null),Re(this._destroyed)).subscribe(()=>{this.value!==void 0&&Promise.resolve().then(()=>{this._setSelectionByValue(this.value,!1)}),this._syncListboxProperties()}),this.chipBlurChanges.pipe(Re(this._destroyed)).subscribe(()=>this._blur()),this.chipSelectionChanges.pipe(Re(this._destroyed)).subscribe(e=>{this.multiple||this._chips.forEach(i=>{i!==e.source&&i._setSelectedState(!1,!1,!1)}),e.isUserInput&&this._propagateChanges()})}focus(){if(this.disabled)return;let e=this._getFirstSelectedChip();e&&!e.disabled?e.focus():this._chips.length>0?this._keyManager.setFirstItemActive():this._elementRef.nativeElement.focus()}writeValue(e){e!=null?this.value=e:this.value=void 0}registerOnChange(e){this._onChange=e}registerOnTouched(e){this._onTouched=e}setDisabledState(e){this.disabled=e}_setSelectionByValue(e,i=!0){this._clearSelection(),Array.isArray(e)?e.forEach(o=>this._selectValue(o,i)):this._selectValue(e,i)}_blur(){this.disabled||setTimeout(()=>{this.focused||this._markAsTouched()})}_keydown(e){e.keyCode===9&&super._allowFocusEscape()}_markAsTouched(){this._onTouched(),this._changeDetectorRef.markForCheck()}_propagateChanges(){let e=null;Array.isArray(this.selected)?e=this.selected.map(i=>i.value):e=this.selected?this.selected.value:void 0,this._value=e,this.change.emit(new xg(this,e)),this._onChange(e),this._changeDetectorRef.markForCheck()}_clearSelection(e){this._chips.forEach(i=>{i!==e&&i.deselect()})}_selectValue(e,i){let o=this._chips.find(a=>a.value!=null&&this.compareWith(a.value,e));return o&&(i?o.selectViaInteraction():o.select()),o}_syncListboxProperties(){this._chips&&Promise.resolve().then(()=>{this._chips.forEach(e=>{e._chipListMultiple=this.multiple,e.chipListSelectable=this._selectable,e._chipListHideSingleSelectionIndicator=this.hideSingleSelectionIndicator,e._changeDetectorRef.markForCheck()})})}_getFirstSelectedChip(){return Array.isArray(this.selected)?this.selected.length?this.selected[0]:void 0:this.selected}_skipPredicate(e){return!1}static \u0275fac=(()=>{let e;return function(o){return(e||(e=Ot(t)))(o||t)}})();static \u0275cmp=(function(){let e=["*"];return H({type:t,selectors:[["mat-chip-listbox"]],contentQueries:function(o,a,r){if(o&1&&Mt(r,Eg,5),o&2){let s;Y(s=Z())&&(a._chips=s)}},hostAttrs:[1,"mdc-evolution-chip-set","mat-mdc-chip-listbox"],hostVars:10,hostBindings:function(o,a){o&1&&V("focus",function(){return a.focus()})("blur",function(){return a._blur()})("keydown",function(s){return a._keydown(s)}),o&2&&(Vt("tabIndex",a.disabled||a.empty?-1:a.tabIndex),Q("role",a.role)("aria-required",a.role?a.required:null)("aria-disabled",a.disabled.toString())("aria-multiselectable",a.multiple)("aria-orientation",a.ariaOrientation),z("mat-mdc-chip-list-disabled",a.disabled)("mat-mdc-chip-list-required",a.required))},inputs:{multiple:[2,"multiple","multiple",O],ariaOrientation:[0,"aria-orientation","ariaOrientation"],selectable:[2,"selectable","selectable",O],compareWith:"compareWith",required:[2,"required","required",O],hideSingleSelectionIndicator:[2,"hideSingleSelectionIndicator","hideSingleSelectionIndicator",O],value:"value"},outputs:{change:"change"},features:[ze([mA]),Ge],ngContentSelectors:e,decls:2,vars:0,consts:[["role","presentation",1,"mdc-evolution-chip-set__chips"]],template:function(o,a){o&1&&(Be(),Je(0,"div",0),oe(1),it())},styles:[`.mat-mdc-chip-set {
  display: flex;
}
.mat-mdc-chip-set:focus {
  outline: none;
}
.mat-mdc-chip-set .mdc-evolution-chip-set__chips {
  min-width: 100%;
  margin-left: -8px;
  margin-right: 0;
}
.mat-mdc-chip-set .mdc-evolution-chip {
  margin: 8px 0 8px 8px;
}
[dir=rtl] .mat-mdc-chip-set .mdc-evolution-chip-set__chips {
  margin-left: 0;
  margin-right: -8px;
}
[dir=rtl] .mat-mdc-chip-set .mdc-evolution-chip {
  margin-left: 0;
  margin-right: 8px;
}

.mdc-evolution-chip-set__chips {
  display: flex;
  flex-flow: wrap;
  min-width: 0;
}

.mat-mdc-chip-set-stacked {
  flex-direction: column;
  align-items: flex-start;
}
.mat-mdc-chip-set-stacked .mat-mdc-chip {
  width: 100%;
}
.mat-mdc-chip-set-stacked .mdc-evolution-chip__graphic {
  flex-grow: 0;
}
.mat-mdc-chip-set-stacked .mdc-evolution-chip__action--primary {
  flex-basis: 100%;
  justify-content: start;
}

input.mat-mdc-chip-input {
  flex: 1 0 150px;
  margin-left: 8px;
}
[dir=rtl] input.mat-mdc-chip-input {
  margin-left: 0;
  margin-right: 8px;
}
.mat-mdc-form-field:not(.mat-form-field-hide-placeholder) input.mat-mdc-chip-input::placeholder {
  opacity: 1;
}
.mat-mdc-form-field:not(.mat-form-field-hide-placeholder) input.mat-mdc-chip-input::-moz-placeholder {
  opacity: 1;
}
.mat-mdc-form-field:not(.mat-form-field-hide-placeholder) input.mat-mdc-chip-input::-webkit-input-placeholder {
  opacity: 1;
}
.mat-mdc-form-field:not(.mat-form-field-hide-placeholder) input.mat-mdc-chip-input:-ms-input-placeholder {
  opacity: 1;
}
.mat-mdc-chip-set + input.mat-mdc-chip-input {
  margin-left: 0;
  margin-right: 0;
}
`],encapsulation:2})})()}return t})();var Au=(()=>{class t{static \u0275fac=function(i){return new(i||t)};static \u0275mod=le({type:t});static \u0275inj=se({providers:[Ur,{provide:Cg,useValue:{separatorKeyCodes:[13]}}],imports:[wi,Ne]})}return t})();var Fo=class{viewContainerRef;injector;id;role="dialog";panelClass="";hasBackdrop=!0;backdropClass="";disableClose=!1;closePredicate;width="";height="";minWidth;minHeight;maxWidth;maxHeight;positionStrategy;data=null;direction;ariaDescribedBy=null;ariaLabelledBy=null;ariaLabel=null;ariaModal=!1;autoFocus="first-tabbable";restoreFocus=!0;scrollStrategy;closeOnNavigation=!0;closeOnDestroy=!0;closeOnOverlayDetachments=!0;disableAnimations=!1;providers;container;templateContext;bindings};var kg=(()=>{class t extends Nr{_elementRef=p(q);_focusTrapFactory=p(zh);_config;_interactivityChecker=p(qd);_ngZone=p(X);_focusMonitor=p(un);_renderer=p(Ue);_changeDetectorRef=p(He);_injector=p(ie);_platform=p(Pe);_document=p(ae);_portalOutlet;_focusTrapped=new B;_focusTrap=null;_elementFocusedBeforeDialogWasOpened=null;_closeInteractionType=null;_ariaLabelledByQueue=[];_isDestroyed=!1;constructor(){super(),this._config=p(Fo,{optional:!0})||new Fo,this._config.ariaLabelledBy&&this._ariaLabelledByQueue.push(this._config.ariaLabelledBy)}_addAriaLabelledBy(e){this._ariaLabelledByQueue.push(e),this._changeDetectorRef.markForCheck()}_removeAriaLabelledBy(e){let i=this._ariaLabelledByQueue.indexOf(e);i>-1&&(this._ariaLabelledByQueue.splice(i,1),this._changeDetectorRef.markForCheck())}_contentAttached(){this._initializeFocusTrap(),this._captureInitialFocus()}_captureInitialFocus(){this._trapFocus()}ngOnDestroy(){this._focusTrapped.complete(),this._isDestroyed=!0,this._restoreFocus()}attachComponentPortal(e){this._portalOutlet.hasAttached();let i=this._portalOutlet.attachComponentPortal(e);return this._contentAttached(),i}attachTemplatePortal(e){this._portalOutlet.hasAttached();let i=this._portalOutlet.attachTemplatePortal(e);return this._contentAttached(),i}attachDomPortal=e=>{this._portalOutlet.hasAttached();let i=this._portalOutlet.attachDomPortal(e);return this._contentAttached(),i};_recaptureFocus(){this._containsFocus()||this._trapFocus()}_forceFocus(e,i){this._interactivityChecker.isFocusable(e)||(e.tabIndex=-1,this._ngZone.runOutsideAngular(()=>{let o=()=>{a(),r(),e.removeAttribute("tabindex")},a=this._renderer.listen(e,"blur",o),r=this._renderer.listen(e,"mousedown",o)})),e.focus(i)}_focusByCssSelector(e,i){let o=this._elementRef.nativeElement.querySelector(e);o&&this._forceFocus(o,i)}_trapFocus(e){this._isDestroyed||Et(()=>{let i=this._elementRef.nativeElement;switch(this._config.autoFocus){case!1:case"dialog":this._containsFocus()||i.focus(e);break;case!0:case"first-tabbable":this._focusTrap?.focusInitialElement(e)||this._focusDialogContainer(e);break;case"first-heading":this._focusByCssSelector('h1, h2, h3, h4, h5, h6, [role="heading"]',e);break;default:this._focusByCssSelector(this._config.autoFocus,e);break}this._focusTrapped.next()},{injector:this._injector})}_restoreFocus(){let e=this._config.restoreFocus,i=null;if(typeof e=="string"?i=this._document.querySelector(e):typeof e=="boolean"?i=e?this._elementFocusedBeforeDialogWasOpened:null:e&&(i=e),this._config.restoreFocus&&i&&typeof i.focus=="function"){let o=Ma(),a=this._elementRef.nativeElement;(!o||o===this._document.body||o===a||a.contains(o))&&(this._focusMonitor?(this._focusMonitor.focusVia(i,this._closeInteractionType),this._closeInteractionType=null):i.focus())}this._focusTrap&&this._focusTrap.destroy()}_focusDialogContainer(e){this._elementRef.nativeElement.focus?.(e)}_containsFocus(){let e=this._elementRef.nativeElement,i=Ma();return e===i||e.contains(i)}_initializeFocusTrap(){this._platform.isBrowser&&(this._focusTrap=this._focusTrapFactory.create(this._elementRef.nativeElement),this._document&&(this._elementFocusedBeforeDialogWasOpened=Ma()))}static \u0275fac=function(i){return new(i||t)};static \u0275cmp=(function(){function e(i,o){}return H({type:t,selectors:[["cdk-dialog-container"]],viewQuery:function(o,a){if(o&1&&ot(Ao,7),o&2){let r;Y(r=Z())&&(a._portalOutlet=r.first)}},hostAttrs:["tabindex","-1",1,"cdk-dialog-container"],hostVars:6,hostBindings:function(o,a){o&2&&Q("id",a._config.id||null)("role",a._config.role)("aria-modal",a._config.ariaModal)("aria-labelledby",a._config.ariaLabel?null:a._ariaLabelledByQueue[0])("aria-label",a._config.ariaLabel)("aria-describedby",a._config.ariaDescribedBy||null)},features:[Ge],decls:1,vars:0,consts:[["cdkPortalOutlet",""]],template:function(o,a){o&1&&tn(0,e,0,0,"ng-template",0)},dependencies:[Ao],styles:[`.cdk-dialog-container {
  display: block;
  width: 100%;
  height: 100%;
  min-height: inherit;
  max-height: inherit;
}
`],encapsulation:2,changeDetection:1})})()}return t})(),Ba=class{overlayRef;config;componentInstance=null;componentRef=null;containerInstance;disableClose;closed=new B;backdropClick;keydownEvents;outsidePointerEvents;id;_detachSubscription;constructor(n,e){this.overlayRef=n,this.config=e,this.disableClose=e.disableClose,this.backdropClick=n.backdropClick(),this.keydownEvents=n.keydownEvents(),this.outsidePointerEvents=n.outsidePointerEvents(),this.id=e.id,this.keydownEvents.subscribe(i=>{i.keyCode===27&&!this.disableClose&&!pt(i)&&(i.preventDefault(),this.close(void 0,{focusOrigin:"keyboard"}))}),this.backdropClick.subscribe(()=>{!this.disableClose&&this._canClose()?this.close(void 0,{focusOrigin:"mouse"}):this.containerInstance._recaptureFocus?.()}),this._detachSubscription=n.detachments().subscribe(()=>{e.closeOnOverlayDetachments!==!1&&this.close()})}close(n,e){if(this._canClose(n)){let i=this.closed;this.containerInstance._closeInteractionType=e?.focusOrigin||"program",this._detachSubscription.unsubscribe(),this.overlayRef.dispose(),i.next(n),i.complete(),this.componentInstance=this.containerInstance=null}}updatePosition(){return this.overlayRef.updatePosition(),this}updateSize(n="",e=""){return this.overlayRef.updateSize({width:n,height:e}),this}addPanelClass(n){return this.overlayRef.addPanelClass(n),this}removePanelClass(n){return this.overlayRef.removePanelClass(n),this}_canClose(n){let e=this.config;return!!this.containerInstance&&(!e.closePredicate||e.closePredicate(n,e,this.componentInstance))}},pA=new D("DialogScrollStrategy",{providedIn:"root",factory:()=>{let t=p(ie);return()=>Or(t)}}),fA=new D("DialogData"),hA=new D("DefaultDialogConfig");function gA(t){let n=G(t),e=new K;return{valueSignal:n,get value(){return n()},change:e,ngOnDestroy(){e.complete()}}}var CS=(()=>{class t{_injector=p(ie);_defaultOptions=p(hA,{optional:!0});_parentDialog=p(t,{optional:!0,skipSelf:!0});_overlayContainer=p(lu);_idGenerator=p(Qe);_openDialogsAtThisLevel=[];_afterAllClosedAtThisLevel=new B;_afterOpenedAtThisLevel=new B;_ariaHiddenElements=new Map;_scrollStrategy=p(pA);get openDialogs(){return this._parentDialog?this._parentDialog.openDialogs:this._openDialogsAtThisLevel}get afterOpened(){return this._parentDialog?this._parentDialog.afterOpened:this._afterOpenedAtThisLevel}afterAllClosed=Ti(()=>this.openDialogs.length?this._getAfterAllClosed():this._getAfterAllClosed().pipe(st(void 0)));open(e,i){let o=this._defaultOptions||new Fo;i=I(I({},o),i),i.id=i.id||this._idGenerator.getId("cdk-dialog-"),i.id&&this.getDialogById(i.id);let a=this._getOverlayConfig(i),r=li(this._injector,a),s=new Ba(r,i),c=this._attachContainer(r,s,i);if(s.containerInstance=c,!this.openDialogs.length){let d=this._overlayContainer.getContainerElement();c._focusTrapped?c._focusTrapped.pipe(Ft(1)).subscribe(()=>{this._hideNonDialogContentFromAssistiveTechnology(d)}):this._hideNonDialogContentFromAssistiveTechnology(d)}return this._attachDialogContent(e,s,c,i),this.openDialogs.push(s),s.closed.subscribe(()=>this._removeOpenDialog(s,!0)),this.afterOpened.next(s),s}closeAll(){Ig(this.openDialogs,e=>e.close())}getDialogById(e){return this.openDialogs.find(i=>i.id===e)}ngOnDestroy(){Ig(this._openDialogsAtThisLevel,e=>{e.config.closeOnDestroy===!1&&this._removeOpenDialog(e,!1)}),Ig(this._openDialogsAtThisLevel,e=>e.close()),this._afterAllClosedAtThisLevel.complete(),this._afterOpenedAtThisLevel.complete(),this._openDialogsAtThisLevel=[]}_getOverlayConfig(e){let i=new si({positionStrategy:e.positionStrategy||Rr().centerHorizontally().centerVertically(),scrollStrategy:e.scrollStrategy||this._scrollStrategy(),panelClass:e.panelClass,hasBackdrop:e.hasBackdrop,direction:e.direction,minWidth:e.minWidth,minHeight:e.minHeight,maxWidth:e.maxWidth,maxHeight:e.maxHeight,width:e.width,height:e.height,disposeOnNavigation:e.closeOnNavigation,disableAnimations:e.disableAnimations});return e.backdropClass&&(i.backdropClass=e.backdropClass),i}_attachContainer(e,i,o){let a=o.injector||o.viewContainerRef?.injector,r=[{provide:Fo,useValue:o},{provide:Ba,useValue:i},{provide:Tr,useValue:e}],s;o.container?typeof o.container=="function"?s=o.container:(s=o.container.type,r.push(...o.container.providers(o))):s=kg;let c=new To(s,o.viewContainerRef,ie.create({parent:a||this._injector,providers:r}));return e.attach(c).instance}_attachDialogContent(e,i,o,a){if(e instanceof At){let r=this._createInjector(a,i,o,void 0),s={$implicit:a.data,dialogRef:i};a.templateContext&&(s=I(I({},s),typeof a.templateContext=="function"?a.templateContext():a.templateContext)),o.attachTemplatePortal(new xn(e,null,s,r))}else{let r=this._createInjector(a,i,o,this._injector),s=o.attachComponentPortal(new To(e,a.viewContainerRef,r,null,a.bindings));i.componentRef=s,i.componentInstance=s.instance}}_createInjector(e,i,o,a){let r=e.injector||e.viewContainerRef?.injector,s=[{provide:fA,useValue:e.data},{provide:Ba,useValue:i}];return e.providers&&(typeof e.providers=="function"?s.push(...e.providers(i,e,o)):s.push(...e.providers)),e.direction&&(!r||!r.get(ft,null,{optional:!0}))&&s.push({provide:ft,useValue:gA(e.direction)}),ie.create({parent:r||a,providers:s})}_removeOpenDialog(e,i){let o=this.openDialogs.indexOf(e);o>-1&&(this.openDialogs.splice(o,1),this.openDialogs.length||(this._ariaHiddenElements.forEach((a,r)=>{a?r.setAttribute("aria-hidden",a):r.removeAttribute("aria-hidden")}),this._ariaHiddenElements.clear(),i&&this._getAfterAllClosed().next()))}_hideNonDialogContentFromAssistiveTechnology(e){if(e.parentElement){let i=e.parentElement.children;for(let o=i.length-1;o>-1;o--){let a=i[o];a!==e&&a.nodeName!=="SCRIPT"&&a.nodeName!=="STYLE"&&!a.hasAttribute("aria-live")&&!a.hasAttribute("popover")&&(this._ariaHiddenElements.set(a,a.getAttribute("aria-hidden")),a.setAttribute("aria-hidden","true"))}}}_getAfterAllClosed(){let e=this._parentDialog;return e?e._getAfterAllClosed():this._afterAllClosedAtThisLevel}static \u0275fac=function(i){return new(i||t)};static \u0275prov=ce({token:t,factory:t.\u0275fac})}return t})();function Ig(t,n){let e=t.length;for(;e--;)n(t[e])}var Ru=class{viewContainerRef;injector;id;role="dialog";panelClass="";hasBackdrop=!0;backdropClass="";disableClose=!1;closePredicate;width="";height="";minWidth;minHeight;maxWidth;maxHeight;position;data=null;direction;ariaDescribedBy=null;ariaLabelledBy=null;ariaLabel=null;ariaModal=!1;autoFocus="first-tabbable";restoreFocus=!0;delayFocusTrap=!0;scrollStrategy;closeOnNavigation=!0;enterAnimationDuration;exitAnimationDuration;bindings},Ng="mdc-dialog--open",SS="mdc-dialog--opening",wS="mdc-dialog--closing",bA=150,vA=75,yA=(()=>{class t extends kg{_animationStateChanged=new K;_animationsEnabled=!qe();_actionSectionCount=0;_hostElement=this._elementRef.nativeElement;_enterAnimationDuration=this._animationsEnabled?DS(this._config.enterAnimationDuration)??bA:0;_exitAnimationDuration=this._animationsEnabled?DS(this._config.exitAnimationDuration)??vA:0;_animationTimer=null;_contentAttached(){super._contentAttached(),this._startOpenAnimation()}_startOpenAnimation(){this._animationStateChanged.emit({state:"opening",totalTime:this._enterAnimationDuration}),this._animationsEnabled?(this._hostElement.style.setProperty(ES,`${this._enterAnimationDuration}ms`),this._requestAnimationFrame(()=>this._hostElement.classList.add(SS,Ng)),this._waitForAnimationToComplete(this._enterAnimationDuration,this._finishDialogOpen)):(this._hostElement.classList.add(Ng),Promise.resolve().then(()=>this._finishDialogOpen()))}_startExitAnimation(){this._animationStateChanged.emit({state:"closing",totalTime:this._exitAnimationDuration}),this._hostElement.classList.remove(Ng),this._animationsEnabled?(this._hostElement.style.setProperty(ES,`${this._exitAnimationDuration}ms`),this._requestAnimationFrame(()=>this._hostElement.classList.add(wS)),this._waitForAnimationToComplete(this._exitAnimationDuration,this._finishDialogClose)):Promise.resolve().then(()=>this._finishDialogClose())}_updateActionSectionCount(e){this._actionSectionCount+=e,this._changeDetectorRef.markForCheck()}_finishDialogOpen=()=>{this._clearAnimationClasses(),this._openAnimationDone(this._enterAnimationDuration)};_finishDialogClose=()=>{this._clearAnimationClasses(),this._animationStateChanged.emit({state:"closed",totalTime:this._exitAnimationDuration})};_clearAnimationClasses(){this._hostElement.classList.remove(SS,wS)}_waitForAnimationToComplete(e,i){this._animationTimer!==null&&clearTimeout(this._animationTimer),this._animationTimer=setTimeout(i,e)}_requestAnimationFrame(e){this._ngZone.runOutsideAngular(()=>{typeof requestAnimationFrame=="function"?requestAnimationFrame(e):e()})}_captureInitialFocus(){this._config.delayFocusTrap||this._trapFocus()}_openAnimationDone(e){this._config.delayFocusTrap&&this._trapFocus(),this._animationStateChanged.next({state:"opened",totalTime:e})}ngOnDestroy(){super.ngOnDestroy(),this._animationTimer!==null&&clearTimeout(this._animationTimer)}attachComponentPortal(e){let i=super.attachComponentPortal(e);return i.location.nativeElement.classList.add("mat-mdc-dialog-component-host"),i}static \u0275fac=(()=>{let e;return function(o){return(e||(e=Ot(t)))(o||t)}})();static \u0275cmp=(function(){function e(i,o){}return H({type:t,selectors:[["mat-dialog-container"]],hostAttrs:["tabindex","-1",1,"mat-mdc-dialog-container","mdc-dialog"],hostVars:10,hostBindings:function(o,a){o&2&&(Vt("id",a._config.id),Q("aria-modal",a._config.ariaModal)("role",a._config.role)("aria-labelledby",a._config.ariaLabel?null:a._ariaLabelledByQueue[0])("aria-label",a._config.ariaLabel)("aria-describedby",a._config.ariaDescribedBy||null),z("_mat-animation-noopable",!a._animationsEnabled)("mat-mdc-dialog-container-with-actions",a._actionSectionCount>0))},features:[Ge],decls:3,vars:0,consts:[[1,"mat-mdc-dialog-inner-container","mdc-dialog__container"],[1,"mat-mdc-dialog-surface","mdc-dialog__surface"],["cdkPortalOutlet",""]],template:function(o,a){o&1&&(f(0,"div",0)(1,"div",1),tn(2,e,0,0,"ng-template",2),u()())},dependencies:[Ao],styles:[`.mat-mdc-dialog-container {
  width: 100%;
  height: 100%;
  display: block;
  box-sizing: border-box;
  max-height: inherit;
  min-height: inherit;
  min-width: inherit;
  max-width: inherit;
  outline: 0;
}

.cdk-overlay-pane.mat-mdc-dialog-panel {
  max-width: var(--%NS%mat-dialog-container-max-width, 560px);
  min-width: var(--%NS%mat-dialog-container-min-width, 280px);
}
@media (max-width: 599px) {
  .cdk-overlay-pane.mat-mdc-dialog-panel {
    max-width: var(--%NS%mat-dialog-container-small-max-width, calc(100vw - 32px));
  }
}

.mat-mdc-dialog-inner-container {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
  box-sizing: border-box;
  height: 100%;
  opacity: 0;
  transition: opacity linear var(--%NS%mat-dialog-transition-duration, 0ms);
  max-height: inherit;
  min-height: inherit;
  min-width: inherit;
  max-width: inherit;
}
.mdc-dialog--closing .mat-mdc-dialog-inner-container {
  transition: opacity 75ms linear;
  transform: none;
}
.mdc-dialog--open .mat-mdc-dialog-inner-container {
  opacity: 1;
}
._mat-animation-noopable .mat-mdc-dialog-inner-container {
  transition: none;
}

.mat-mdc-dialog-surface {
  display: flex;
  flex-direction: column;
  flex-grow: 0;
  flex-shrink: 0;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  position: relative;
  overflow-y: auto;
  outline: 0;
  transform: scale(0.8);
  transition: transform var(--%NS%mat-dialog-transition-duration, 0ms) cubic-bezier(0, 0, 0.2, 1);
  max-height: inherit;
  min-height: inherit;
  min-width: inherit;
  max-width: inherit;
  box-shadow: var(--%NS%mat-dialog-container-elevation-shadow, none);
  border-radius: var(--%NS%mat-dialog-container-shape, var(--%NS%mat-sys-corner-extra-large, 4px));
  background-color: var(--%NS%mat-dialog-container-color, var(--%NS%mat-sys-surface, white));
}
[dir=rtl] .mat-mdc-dialog-surface {
  text-align: right;
}
.mdc-dialog--open .mat-mdc-dialog-surface, .mdc-dialog--closing .mat-mdc-dialog-surface {
  transform: none;
}
._mat-animation-noopable .mat-mdc-dialog-surface {
  transition: none;
}
.mat-mdc-dialog-surface::before {
  position: absolute;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  border: 2px solid transparent;
  border-radius: inherit;
  content: "";
  pointer-events: none;
}

.mat-mdc-dialog-title {
  display: block;
  position: relative;
  flex-shrink: 0;
  box-sizing: border-box;
  margin: 0 0 1px;
  padding: var(--%NS%mat-dialog-headline-padding, 6px 24px 13px);
}
.mat-mdc-dialog-title::before {
  display: inline-block;
  width: 0;
  height: 40px;
  content: "";
  vertical-align: 0;
}
[dir=rtl] .mat-mdc-dialog-title {
  text-align: right;
}
.mat-mdc-dialog-container .mat-mdc-dialog-title {
  color: var(--%NS%mat-dialog-subhead-color, var(--%NS%mat-sys-on-surface, rgba(0, 0, 0, 0.87)));
  font-family: var(--%NS%mat-dialog-subhead-font, var(--%NS%mat-sys-headline-small-font, inherit));
  line-height: var(--%NS%mat-dialog-subhead-line-height, var(--%NS%mat-sys-headline-small-line-height, 1.5rem));
  font-size: var(--%NS%mat-dialog-subhead-size, var(--%NS%mat-sys-headline-small-size, 1rem));
  font-weight: var(--%NS%mat-dialog-subhead-weight, var(--%NS%mat-sys-headline-small-weight, 400));
  letter-spacing: var(--%NS%mat-dialog-subhead-tracking, var(--%NS%mat-sys-headline-small-tracking, 0.03125em));
}

.mat-mdc-dialog-content {
  display: block;
  flex-grow: 1;
  box-sizing: border-box;
  margin: 0;
  overflow: auto;
  max-height: 65vh;
}
.mat-mdc-dialog-content > :first-child {
  margin-top: 0;
}
.mat-mdc-dialog-content > :last-child {
  margin-bottom: 0;
}
.mat-mdc-dialog-container .mat-mdc-dialog-content {
  color: var(--%NS%mat-dialog-supporting-text-color, var(--%NS%mat-sys-on-surface-variant, rgba(0, 0, 0, 0.6)));
  font-family: var(--%NS%mat-dialog-supporting-text-font, var(--%NS%mat-sys-body-medium-font, inherit));
  line-height: var(--%NS%mat-dialog-supporting-text-line-height, var(--%NS%mat-sys-body-medium-line-height, 1.5rem));
  font-size: var(--%NS%mat-dialog-supporting-text-size, var(--%NS%mat-sys-body-medium-size, 1rem));
  font-weight: var(--%NS%mat-dialog-supporting-text-weight, var(--%NS%mat-sys-body-medium-weight, 400));
  letter-spacing: var(--%NS%mat-dialog-supporting-text-tracking, var(--%NS%mat-sys-body-medium-tracking, 0.03125em));
}
.mat-mdc-dialog-container .mat-mdc-dialog-content {
  padding: var(--%NS%mat-dialog-content-padding, 20px 24px);
}
.mat-mdc-dialog-container-with-actions .mat-mdc-dialog-content {
  padding: var(--%NS%mat-dialog-with-actions-content-padding, 20px 24px 0);
}
.mat-mdc-dialog-container .mat-mdc-dialog-title + .mat-mdc-dialog-content {
  padding-top: 0;
}

.mat-mdc-dialog-actions {
  display: flex;
  position: relative;
  flex-shrink: 0;
  flex-wrap: wrap;
  align-items: center;
  box-sizing: border-box;
  min-height: 52px;
  margin: 0;
  border-top: 1px solid transparent;
  padding: var(--%NS%mat-dialog-actions-padding, 16px 24px);
  justify-content: var(--%NS%mat-dialog-actions-alignment, flex-end);
}
@media (forced-colors: active) {
  .mat-mdc-dialog-actions {
    border-top-color: CanvasText;
  }
}
.mat-mdc-dialog-actions.mat-mdc-dialog-actions-align-start, .mat-mdc-dialog-actions[align=start] {
  justify-content: start;
}
.mat-mdc-dialog-actions.mat-mdc-dialog-actions-align-center, .mat-mdc-dialog-actions[align=center] {
  justify-content: center;
}
.mat-mdc-dialog-actions.mat-mdc-dialog-actions-align-end, .mat-mdc-dialog-actions[align=end] {
  justify-content: flex-end;
}
.mat-mdc-dialog-actions .mat-button-base + .mat-button-base,
.mat-mdc-dialog-actions .mat-mdc-button-base + .mat-mdc-button-base {
  margin-left: 8px;
}
[dir=rtl] .mat-mdc-dialog-actions .mat-button-base + .mat-button-base,
[dir=rtl] .mat-mdc-dialog-actions .mat-mdc-button-base + .mat-mdc-button-base {
  margin-left: 0;
  margin-right: 8px;
}

.mat-mdc-dialog-component-host {
  display: contents;
}
`],encapsulation:2,changeDetection:1})})()}return t})(),ES="--mat-dialog-transition-duration";function DS(t){return t==null?null:typeof t=="number"?t:t.endsWith("ms")?ii(t.substring(0,t.length-2)):t.endsWith("s")?ii(t.substring(0,t.length-1))*1e3:t==="0"?0:null}var Ou=(function(t){return t[t.OPEN=0]="OPEN",t[t.CLOSING=1]="CLOSING",t[t.CLOSED=2]="CLOSED",t})(Ou||{}),Tg=class{_ref;_config;_containerInstance;componentInstance;componentRef=null;disableClose;id;_afterOpened=new lo(1);_beforeClosed=new lo(1);_result;_closeFallbackTimeout;_state=Ou.OPEN;_closeInteractionType;constructor(n,e,i){this._ref=n,this._config=e,this._containerInstance=i,this.disableClose=e.disableClose,this.id=n.id,n.addPanelClass("mat-mdc-dialog-panel"),i._animationStateChanged.pipe(Ze(o=>o.state==="opened"),Ft(1)).subscribe(()=>{this._afterOpened.next(),this._afterOpened.complete()}),i._animationStateChanged.pipe(Ze(o=>o.state==="closed"),Ft(1)).subscribe(()=>{clearTimeout(this._closeFallbackTimeout),this._finishDialogClose()}),n.overlayRef.detachments().subscribe(()=>{this._beforeClosed.next(this._result),this._beforeClosed.complete(),this._finishDialogClose()}),bt(this.backdropClick(),this.keydownEvents().pipe(Ze(o=>o.keyCode===27&&!this.disableClose&&!pt(o)))).subscribe(o=>{this.disableClose||(o.preventDefault(),_A(this,o.type==="keydown"?"keyboard":"mouse"))})}close(n){let e=this._config.closePredicate;e&&!e(n,this._config,this.componentInstance)||(this._result=n,this._containerInstance._animationStateChanged.pipe(Ze(i=>i.state==="closing"),Ft(1)).subscribe(i=>{this._beforeClosed.next(n),this._beforeClosed.complete(),this._ref.overlayRef.detachBackdrop(),this._closeFallbackTimeout=setTimeout(()=>this._finishDialogClose(),i.totalTime+100)}),this._state=Ou.CLOSING,this._containerInstance._startExitAnimation())}afterOpened(){return this._afterOpened}afterClosed(){return this._ref.closed}beforeClosed(){return this._beforeClosed}backdropClick(){return this._ref.backdropClick}keydownEvents(){return this._ref.keydownEvents}updatePosition(n){let e=this._ref.config.positionStrategy;return n&&(n.left||n.right)?n.left?e.left(n.left):e.right(n.right):e.centerHorizontally(),n&&(n.top||n.bottom)?n.top?e.top(n.top):e.bottom(n.bottom):e.centerVertically(),this._ref.updatePosition(),this}updateSize(n="",e=""){return this._ref.updateSize(n,e),this}addPanelClass(n){return this._ref.addPanelClass(n),this}removePanelClass(n){return this._ref.removePanelClass(n),this}getState(){return this._state}_finishDialogClose(){this._state=Ou.CLOSED,this._ref.close(this._result,{focusOrigin:this._closeInteractionType}),this.componentInstance=null}};function _A(t,n,e){return t._closeInteractionType=n,t.close(e)}var xA=new D("MatMdcDialogData"),CA=new D("mat-mdc-dialog-default-options"),SA=new D("mat-mdc-dialog-scroll-strategy",{providedIn:"root",factory:()=>{let t=p(ie);return()=>Or(t)}}),MS=(()=>{class t{_defaultOptions=p(CA,{optional:!0});_scrollStrategy=p(SA);_parentDialog=p(t,{optional:!0,skipSelf:!0});_idGenerator=p(Qe);_injector=p(ie);_dialog=p(CS);_animationsDisabled=qe();_openDialogsAtThisLevel=[];_afterAllClosedAtThisLevel=new B;_afterOpenedAtThisLevel=new B;dialogConfigClass=Ru;_dialogRefConstructor;_dialogContainerType;_dialogDataToken;get openDialogs(){return this._parentDialog?this._parentDialog.openDialogs:this._openDialogsAtThisLevel}get afterOpened(){return this._parentDialog?this._parentDialog.afterOpened:this._afterOpenedAtThisLevel}_getAfterAllClosed(){let e=this._parentDialog;return e?e._getAfterAllClosed():this._afterAllClosedAtThisLevel}afterAllClosed=Ti(()=>this.openDialogs.length?this._getAfterAllClosed():this._getAfterAllClosed().pipe(st(void 0)));constructor(){this._dialogRefConstructor=Tg,this._dialogContainerType=yA,this._dialogDataToken=xA}open(e,i){let o;i=I(I({},this._defaultOptions||new Ru),i),i.id=i.id||this._idGenerator.getId("mat-mdc-dialog-"),i.scrollStrategy=i.scrollStrategy||this._scrollStrategy();let a=this._dialog.open(e,W(I({},i),{positionStrategy:Rr(this._injector).centerHorizontally().centerVertically(),disableClose:!0,closePredicate:void 0,closeOnDestroy:!1,closeOnOverlayDetachments:!1,disableAnimations:this._animationsDisabled||i.enterAnimationDuration?.toLocaleString()==="0"||i.exitAnimationDuration?.toString()==="0",container:{type:this._dialogContainerType,providers:()=>[{provide:this.dialogConfigClass,useValue:i},{provide:Fo,useValue:i}]},templateContext:()=>({dialogRef:o}),providers:(r,s,c)=>(o=new this._dialogRefConstructor(r,i,c),o.updatePosition(i?.position),[{provide:this._dialogContainerType,useValue:c},{provide:this._dialogDataToken,useValue:s.data},{provide:this._dialogRefConstructor,useValue:o},{provide:Ba,useValue:null}])}));return o.componentRef=a.componentRef,o.componentInstance=a.componentInstance,this.openDialogs.push(o),this.afterOpened.next(o),o.afterClosed().subscribe(()=>{let r=this.openDialogs.indexOf(o);r>-1&&(this.openDialogs.splice(r,1),this.openDialogs.length||this._getAfterAllClosed().next())}),o}closeAll(){this._closeDialogs(this.openDialogs)}getDialogById(e){return this.openDialogs.find(i=>i.id===e)}ngOnDestroy(){this._closeDialogs(this._openDialogsAtThisLevel),this._afterAllClosedAtThisLevel.complete(),this._afterOpenedAtThisLevel.complete()}_closeDialogs(e){let i=e.length;for(;i--;)e[i].close()}static \u0275fac=function(i){return new(i||t)};static \u0275prov=ce({token:t,factory:t.\u0275fac})}return t})();var no=(()=>{class t{static \u0275fac=function(i){return new(i||t)};static \u0275mod=le({type:t});static \u0275inj=se({imports:[Wd,zr,Ne]})}return t})();function kS(t){return Error(`Unable to find icon with the name "${t}"`)}function wA(){return Error("Could not find HttpClient for use with Angular Material icons. Please add provideHttpClient() to your providers.")}function NS(t){return Error(`The URL provided to MatIconRegistry was not trusted as a resource URL via Angular's DomSanitizer. Attempted URL was "${t}".`)}function TS(t){return Error(`The literal provided to MatIconRegistry was not trusted as safe HTML by Angular's DomSanitizer. Attempted literal was "${t}".`)}var io=class{url;svgText;options;svgElement=null;constructor(n,e,i){this.url=n,this.svgText=e,this.options=i}},OS=(()=>{class t{_httpClient;_sanitizer;_errorHandler;_document;_svgIconConfigs=new Map;_iconSetConfigs=new Map;_cachedIconsByUrl=new Map;_inProgressUrlFetches=new Map;_fontCssClassesByAlias=new Map;_resolvers=[];_defaultFontSetClass;constructor(e,i,o,a){this._httpClient=e,this._sanitizer=i,this._errorHandler=a,this._document=o}addSvgIcon(e,i,o){return this.addSvgIconInNamespace("",e,i,o)}addSvgIconLiteral(e,i,o){return this.addSvgIconLiteralInNamespace("",e,i,o)}addSvgIconInNamespace(e,i,o,a){return this._addSvgIconConfig(e,i,new io(o,null,a))}addSvgIconResolver(e){return this._resolvers.push(e),this}addSvgIconLiteralInNamespace(e,i,o,a){let r=this._sanitizer.sanitize(Ut.HTML,o);if(!r)throw TS(o);let s=Ia(r);return this._addSvgIconConfig(e,i,new io("",s,a))}addSvgIconSet(e,i){return this.addSvgIconSetInNamespace("",e,i)}addSvgIconSetLiteral(e,i){return this.addSvgIconSetLiteralInNamespace("",e,i)}addSvgIconSetInNamespace(e,i,o){return this._addSvgIconSetConfig(e,new io(i,null,o))}addSvgIconSetLiteralInNamespace(e,i,o){let a=this._sanitizer.sanitize(Ut.HTML,i);if(!a)throw TS(i);let r=Ia(a);return this._addSvgIconSetConfig(e,new io("",r,o))}registerFontClassAlias(e,i=e){return this._fontCssClassesByAlias.set(e,i),this}classNameForFontAlias(e){return this._fontCssClassesByAlias.get(e)||e}setDefaultFontSetClass(...e){return this._defaultFontSetClass=e,this}getDefaultFontSetClass(){return this._defaultFontSetClass??=DA(this._document),this._defaultFontSetClass}getSvgIconFromUrl(e){let i=this._sanitizer.sanitize(Ut.RESOURCE_URL,e);if(!i)throw NS(e);let o=this._cachedIconsByUrl.get(i);return o?Nt(Pu(o)):this._loadSvgIconFromConfig(new io(e,null)).pipe(Oi(a=>this._cachedIconsByUrl.set(i,a)),je(a=>Pu(a)))}getNamedSvgIcon(e,i=""){let o=AS(i,e),a=this._svgIconConfigs.get(o);if(a)return this._getSvgFromConfig(a);if(a=this._getIconConfigFromResolvers(i,e),a)return this._svgIconConfigs.set(o,a),this._getSvgFromConfig(a);let r=this._iconSetConfigs.get(i);return r?this._getSvgFromIconSetConfigs(e,r):Cm(kS(o))}ngOnDestroy(){this._resolvers=[],this._svgIconConfigs.clear(),this._iconSetConfigs.clear(),this._cachedIconsByUrl.clear()}_getSvgFromConfig(e){return e.svgText?Nt(Pu(this._svgElementFromConfig(e))):this._loadSvgIconFromConfig(e).pipe(je(i=>Pu(i)))}_getSvgFromIconSetConfigs(e,i){let o=this._extractIconWithNameFromAnySet(e,i);if(o)return Nt(o);let a=i.filter(r=>!r.svgText).map(r=>this._loadSvgIconSetFromConfig(r).pipe(gl(s=>{let d=`Loading icon set URL: ${this._sanitizer.sanitize(Ut.RESOURCE_URL,r.url)} failed: ${s.message}`;return this._errorHandler.handleError(new Error(d)),Nt(null)})));return ls(a).pipe(je(()=>{let r=this._extractIconWithNameFromAnySet(e,i);if(!r)throw kS(e);return r}))}_extractIconWithNameFromAnySet(e,i){for(let o=i.length-1;o>=0;o--){let a=i[o];if(a.svgText&&a.svgText.toString().indexOf(e)>-1){let r=this._svgElementFromConfig(a),s=this._extractSvgIconFromSet(r,e,a.options);if(s)return s}}return null}_loadSvgIconFromConfig(e){return this._fetchIcon(e).pipe(Oi(i=>e.svgText=i),je(()=>this._svgElementFromConfig(e)))}_loadSvgIconSetFromConfig(e){return e.svgText?Nt(null):this._fetchIcon(e).pipe(Oi(i=>e.svgText=i))}_extractSvgIconFromSet(e,i,o){let a=e.querySelector(`[id="${i}"]`);if(!a)return null;let r=a.cloneNode(!0);if(r.removeAttribute("id"),r.nodeName.toLowerCase()==="svg")return this._setSvgAttributes(r,o);if(r.nodeName.toLowerCase()==="symbol")return this._setSvgAttributes(this._toSvgElement(r),o);let s=this._svgElementFromString(Ia("<svg></svg>"));return s.appendChild(r),this._setSvgAttributes(s,o)}_svgElementFromString(e){let i=this._document.createElement("DIV");i.innerHTML=e;let o=i.querySelector("svg");if(!o)throw Error("<svg> tag not found");return o}_toSvgElement(e){let i=this._svgElementFromString(Ia("<svg></svg>")),o=e.attributes;for(let a=0;a<o.length;a++){let{name:r,value:s}=o[a],c=r.toLowerCase();c!=="id"&&!c.startsWith("on")&&i.setAttribute(r,s)}for(let a=0;a<e.childNodes.length;a++)e.childNodes[a].nodeType===this._document.ELEMENT_NODE&&i.appendChild(e.childNodes[a].cloneNode(!0));return i}_setSvgAttributes(e,i){return e.setAttribute("fit",""),e.setAttribute("height","100%"),e.setAttribute("width","100%"),e.setAttribute("preserveAspectRatio","xMidYMid meet"),e.setAttribute("focusable","false"),i&&i.viewBox&&e.setAttribute("viewBox",i.viewBox),e}_fetchIcon(e){let{url:i,options:o}=e,a=o?.withCredentials??!1;if(!this._httpClient)throw wA();if(i==null)throw Error(`Cannot fetch icon from URL "${i}".`);let r=this._sanitizer.sanitize(Ut.RESOURCE_URL,i);if(!r)throw NS(i);let s=this._inProgressUrlFetches.get(r);if(s)return s;let c=this._httpClient.get(r,{responseType:"text",withCredentials:a}).pipe(je(d=>Ia(d)),ds(()=>this._inProgressUrlFetches.delete(r)),us());return this._inProgressUrlFetches.set(r,c),c}_addSvgIconConfig(e,i,o){return this._svgIconConfigs.set(AS(e,i),o),this}_addSvgIconSetConfig(e,i){let o=this._iconSetConfigs.get(e);return o?o.push(i):this._iconSetConfigs.set(e,[i]),this}_svgElementFromConfig(e){if(!e.svgElement){let i=this._svgElementFromString(e.svgText);this._setSvgAttributes(i,e.options),e.svgElement=i}return e.svgElement}_getIconConfigFromResolvers(e,i){for(let o=0;o<this._resolvers.length;o++){let a=this._resolvers[o](i,e);if(a)return EA(a)?new io(a.url,null,a.options):new io(a,null)}}static \u0275fac=function(i){return new(i||t)(be(Oh,8),be(ec),be(ae,8),be(cn))};static \u0275prov=Le({token:t,factory:t.\u0275fac,providedIn:"root"})}return t})();function Pu(t){return t.cloneNode(!0)}function AS(t,n){return t+":"+n}function EA(t){return!!(t.url&&t.options)}function DA(t){let n=null,e=!1;return t.fonts&&typeof t.fonts.forEach=="function"&&t.fonts.forEach(i=>{let o=i.family.replace(/['"]/g,"").trim().toLowerCase();(o==="material icons"||o.startsWith("material icons "))&&(e=!0),o.startsWith("material symbols rounded")?n="rounded":o.startsWith("material symbols sharp")?n="sharp":o.startsWith("material symbols")&&(n="outlined")}),[n&&!e?`material-symbols-${n}`:"material-icons","mat-ligature-font"]}var MA=new D("MAT_ICON_DEFAULT_OPTIONS"),IA=new D("mat-icon-location",{providedIn:"root",factory:()=>{let t=p(ae),n=t?t.location:null;return{getPathname:()=>n?n.pathname+n.search:""}}}),RS=["clip-path","color-profile","src","cursor","fill","filter","marker","marker-start","marker-mid","marker-end","mask","stroke"],kA=RS.map(t=>`[${t}]`).join(", "),NA=/^url\(['"]?#(.*?)['"]?\)$/,jt=(()=>{class t{_elementRef=p(q);_iconRegistry=p(OS);_location=p(IA);_errorHandler=p(cn);_defaultColor;get color(){return this._color||this._defaultColor}set color(e){this._color=e}_color;inline=!1;get svgIcon(){return this._svgIcon}set svgIcon(e){e!==this._svgIcon&&(e?this._updateSvgIcon(e):this._svgIcon&&this._clearSvgElement(),this._svgIcon=e)}_svgIcon;get fontSet(){return this._fontSet}set fontSet(e){let i=this._cleanupFontValue(e);i!==this._fontSet&&(this._fontSet=i,this._updateFontIconClasses())}_fontSet;get fontIcon(){return this._fontIcon}set fontIcon(e){let i=this._cleanupFontValue(e);i!==this._fontIcon&&(this._fontIcon=i,this._updateFontIconClasses())}_fontIcon;_previousFontSetClass=[];_previousFontIconClass;_svgName=null;_svgNamespace=null;_previousPath;_elementsWithExternalReferences;_currentIconFetch=_e.EMPTY;constructor(){let e=p(new ti("aria-hidden"),{optional:!0}),i=p(MA,{optional:!0});i&&(i.color&&(this.color=this._defaultColor=i.color),i.fontSet&&(this.fontSet=i.fontSet)),e||this._elementRef.nativeElement.setAttribute("aria-hidden","true")}_splitIconName(e){if(!e)return["",""];let i=e.split(":");switch(i.length){case 1:return["",i[0]];case 2:return i;default:throw Error(`Invalid icon name: "${e}"`)}}ngOnInit(){this._updateFontIconClasses()}ngAfterViewChecked(){let e=this._elementsWithExternalReferences;if(e&&e.size){let i=this._location.getPathname();i!==this._previousPath&&(this._previousPath=i,this._prependPathToReferences(i))}}ngOnDestroy(){this._currentIconFetch.unsubscribe(),this._elementsWithExternalReferences&&this._elementsWithExternalReferences.clear()}_usingFontIcon(){return!this.svgIcon}_setSvgElement(e){this._clearSvgElement();let i=this._location.getPathname();this._previousPath=i,this._cacheChildrenWithExternalReferences(e),this._prependPathToReferences(i),this._elementRef.nativeElement.appendChild(e)}_clearSvgElement(){let e=this._elementRef.nativeElement,i=e.childNodes.length;for(this._elementsWithExternalReferences&&this._elementsWithExternalReferences.clear();i--;){let o=e.childNodes[i];(o.nodeType!==1||o.nodeName.toLowerCase()==="svg")&&o.remove()}}_updateFontIconClasses(){if(!this._usingFontIcon())return;let e=this._elementRef.nativeElement,i=(this.fontSet?this._iconRegistry.classNameForFontAlias(this.fontSet).split(/ +/):this._iconRegistry.getDefaultFontSetClass()).filter(o=>o.length>0);this._previousFontSetClass.forEach(o=>e.classList.remove(o)),i.forEach(o=>e.classList.add(o)),this._previousFontSetClass=i,this.fontIcon!==this._previousFontIconClass&&!i.includes("mat-ligature-font")&&(this._previousFontIconClass&&e.classList.remove(this._previousFontIconClass),this.fontIcon&&e.classList.add(this.fontIcon),this._previousFontIconClass=this.fontIcon)}_cleanupFontValue(e){return typeof e=="string"?e.trim().split(" ")[0]:e}_prependPathToReferences(e){let i=this._elementsWithExternalReferences,o=e.startsWith("//")?`/.${e}`:e;i&&i.forEach((a,r)=>{a.forEach(s=>{r.setAttribute(s.name,`url('${o}#${s.value}')`)})})}_cacheChildrenWithExternalReferences(e){let i=e.querySelectorAll(kA),o=this._elementsWithExternalReferences=this._elementsWithExternalReferences||new Map;for(let a=0;a<i.length;a++)RS.forEach(r=>{let s=i[a],c=s.getAttribute(r),d=c?c.match(NA):null;if(d){let l=o.get(s);l||(l=[],o.set(s,l)),l.push({name:r,value:d[1]})}})}_updateSvgIcon(e){if(this._svgNamespace=null,this._svgName=null,this._currentIconFetch.unsubscribe(),e){let[i,o]=this._splitIconName(e);i&&(this._svgNamespace=i),o&&(this._svgName=o),this._currentIconFetch=this._iconRegistry.getNamedSvgIcon(o,i).pipe(Ft(1)).subscribe(a=>this._setSvgElement(a),a=>{let r=`Error retrieving icon ${i}:${o}! ${a.message}`;this._errorHandler.handleError(new Error(r))})}}static \u0275fac=function(i){return new(i||t)};static \u0275cmp=(function(){return H({type:t,selectors:[["mat-icon"]],hostAttrs:["role","img",1,"mat-icon","notranslate"],hostVars:10,hostBindings:function(o,a){o&2&&(Q("data-mat-icon-type",a._usingFontIcon()?"font":"svg")("data-mat-icon-name",a._svgName||a.fontIcon)("data-mat-icon-namespace",a._svgNamespace||a.fontSet)("fontIcon",a._usingFontIcon()?a.fontIcon:null),Ke(a.color?"mat-"+a.color:""),z("mat-icon-inline",a.inline)("mat-icon-no-color",a.color!=="primary"&&a.color!=="accent"&&a.color!=="warn"))},inputs:{color:"color",inline:[2,"inline","inline",O],svgIcon:"svgIcon",fontSet:"fontSet",fontIcon:"fontIcon"},exportAs:["matIcon"],ngContentSelectors:["*"],decls:1,vars:0,template:function(o,a){o&1&&(Be(),oe(0))},styles:[`mat-icon, mat-icon.mat-primary, mat-icon.mat-accent, mat-icon.mat-warn {
  color: var(--%NS%mat-icon-color, inherit);
}

.mat-icon {
  -webkit-user-select: none;
  user-select: none;
  background-repeat: no-repeat;
  display: inline-block;
  fill: currentColor;
  height: 24px;
  width: 24px;
  overflow: hidden;
}
.mat-icon.mat-icon-inline {
  font-size: inherit;
  height: inherit;
  line-height: inherit;
  width: inherit;
}
.mat-icon.mat-ligature-font[fontIcon]::before {
  content: attr(fontIcon);
}

[dir=rtl] .mat-icon-rtl-mirror {
  transform: scale(-1, 1);
}

.mat-form-field:not(.mat-form-field-appearance-legacy) .mat-form-field-prefix .mat-icon,
.mat-form-field:not(.mat-form-field-appearance-legacy) .mat-form-field-suffix .mat-icon {
  display: block;
}
.mat-form-field:not(.mat-form-field-appearance-legacy) .mat-form-field-prefix .mat-icon-button .mat-icon,
.mat-form-field:not(.mat-form-field-appearance-legacy) .mat-form-field-suffix .mat-icon-button .mat-icon {
  margin: auto;
}
`],encapsulation:2})})()}return t})(),It=(()=>{class t{static \u0275fac=function(i){return new(i||t)};static \u0275mod=le({type:t});static \u0275inj=se({imports:[Ne]})}return t})();var TA=(()=>{class t{static \u0275fac=function(i){return new(i||t)};static \u0275cmp=H({type:t,selectors:[["ng-component"]],hostAttrs:["cdk-text-field-style-loader",""],decls:0,vars:0,template:function(i,o){},styles:[`textarea.cdk-textarea-autosize {
  resize: none;
}

textarea.cdk-textarea-autosize-measuring {
  padding: 2px 0 !important;
  box-sizing: content-box !important;
  height: auto !important;
  overflow: hidden !important;
}

textarea.cdk-textarea-autosize-measuring-firefox {
  padding: 2px 0 !important;
  box-sizing: content-box !important;
  height: 0 !important;
}

@keyframes cdk-text-field-autofill-start { /*!*/ }
@keyframes cdk-text-field-autofill-end { /*!*/ }
.cdk-text-field-autofill-monitored:-webkit-autofill {
  animation: cdk-text-field-autofill-start 0s 1ms;
}

.cdk-text-field-autofill-monitored:not(:-webkit-autofill) {
  animation: cdk-text-field-autofill-end 0s 1ms;
}
`],encapsulation:2})}return t})(),AA={passive:!0},PS=(()=>{class t{_platform=p(Pe);_ngZone=p(X);_renderer=p(Lt).createRenderer(null,null);_styleLoader=p(ut);_monitoredElements=new Map;monitor(e){if(!this._platform.isBrowser)return Ni;this._styleLoader.load(TA);let i=gn(e),o=this._monitoredElements.get(i);if(o)return o.subject;let a=new B,r="cdk-text-field-autofilled",s=d=>{d.animationName==="cdk-text-field-autofill-start"&&!i.classList.contains(r)?(i.classList.add(r),this._ngZone.run(()=>a.next({target:d.target,isAutofilled:!0}))):d.animationName==="cdk-text-field-autofill-end"&&i.classList.contains(r)&&(i.classList.remove(r),this._ngZone.run(()=>a.next({target:d.target,isAutofilled:!1})))},c=this._ngZone.runOutsideAngular(()=>(i.classList.add("cdk-text-field-autofill-monitored"),this._renderer.listen(i,"animationstart",s,AA)));return this._monitoredElements.set(i,{subject:a,unlisten:c}),a}stopMonitoring(e){let i=gn(e),o=this._monitoredElements.get(i);o&&(o.unlisten(),o.subject.complete(),i.classList.remove("cdk-text-field-autofill-monitored"),i.classList.remove("cdk-text-field-autofilled"),this._monitoredElements.delete(i))}ngOnDestroy(){this._monitoredElements.forEach((e,i)=>this.stopMonitoring(i))}static \u0275fac=function(i){return new(i||t)};static \u0275prov=ce({token:t,factory:t.\u0275fac})}return t})();var FS=(()=>{class t{static \u0275fac=function(i){return new(i||t)};static \u0275mod=le({type:t});static \u0275inj=se({})}return t})();var LS=new D("MAT_INPUT_VALUE_ACCESSOR");var OA=["button","checkbox","file","hidden","image","radio","range","reset","submit"],RA=new D("MAT_INPUT_CONFIG"),Fu=(()=>{class t{_elementRef=p(q);_platform=p(Pe);ngControl=p(Pa,{optional:!0,self:!0});_autofillMonitor=p(PS);_ngZone=p(X);_formField=p(Fa,{optional:!0});_renderer=p(Ue);_uid=p(Qe).getId("mat-input-");_previousNativeValue;_inputValueAccessor;_signalBasedValueAccessor;_previousPlaceholder=null;_errorStateTracker;_config=p(RA,{optional:!0});_cleanupIosKeyup;_cleanupWebkitWheel;_isServer=!1;_isNativeSelect=!1;_isTextarea=!1;_isInFormField=!1;focused=!1;stateChanges=new B;controlType="mat-input";autofilled=!1;get disabled(){return this._disabled}set disabled(e){this._disabled=Ji(e),this.focused&&(this.focused=!1,this.stateChanges.next())}_disabled=!1;get id(){return this._id}set id(e){this._id=e||this._uid}_id;placeholder;name;get required(){return this._required??this.ngControl?.control?.hasValidator(Oo.required)??!1}set required(e){this._required=Ji(e)}_required;get type(){return this._type}set type(e){this._type=e||"text",this._validateType(),!this._isTextarea&&Yh().has(this._type)&&(this._elementRef.nativeElement.type=this._type)}_type="text";get errorStateMatcher(){return this._errorStateTracker.matcher}set errorStateMatcher(e){this._errorStateTracker.matcher=e}userAriaDescribedBy;get value(){return this._signalBasedValueAccessor?this._signalBasedValueAccessor.value():this._inputValueAccessor.value}set value(e){e!==this.value&&(this._signalBasedValueAccessor?this._signalBasedValueAccessor.value.set(e):this._inputValueAccessor.value=e,this.stateChanges.next())}get readonly(){return this._readonly}set readonly(e){this._readonly=Ji(e)}_readonly=!1;disabledInteractive;get errorState(){return this._errorStateTracker.errorState}set errorState(e){this._errorStateTracker.errorState=e}_neverEmptyInputTypes=["date","datetime","datetime-local","month","time","week"].filter(e=>Yh().has(e));constructor(){let e=p(Vr,{optional:!0}),i=p(jr,{optional:!0}),o=p(Ur),a=p(LS,{optional:!0,self:!0}),r=p(Cu,{optional:!0,self:!0}),s=this._elementRef.nativeElement,c=s.nodeName.toLowerCase();a?dn(a.value)?this._signalBasedValueAccessor=a:this._inputValueAccessor=a:this._inputValueAccessor=s,this._previousNativeValue=this.value,this.id=this.id,this._platform.IOS&&this._ngZone.runOutsideAngular(()=>{this._cleanupIosKeyup=this._renderer.listen(s,"keyup",this._iOSKeyupListener)}),this._errorStateTracker=new Gr(o,r||this.ngControl,i,e,this.stateChanges),this._isServer=!this._platform.isBrowser,this._isNativeSelect=c==="select",this._isTextarea=c==="textarea",this._isInFormField=!!this._formField,this.disabledInteractive=this._config?.disabledInteractive||!1,this._isNativeSelect&&(this.controlType=s.multiple?"mat-native-select-multiple":"mat-native-select"),this._signalBasedValueAccessor&&lt(()=>{this._signalBasedValueAccessor.value(),this.stateChanges.next()})}ngAfterViewInit(){this._platform.isBrowser&&this._autofillMonitor.monitor(this._elementRef.nativeElement).subscribe(e=>{this.autofilled=e.isAutofilled,this.stateChanges.next()})}ngOnChanges(){this.stateChanges.next()}ngOnDestroy(){this.stateChanges.complete(),this._platform.isBrowser&&this._autofillMonitor.stopMonitoring(this._elementRef.nativeElement),this._cleanupIosKeyup?.(),this._cleanupWebkitWheel?.()}ngDoCheck(){this.ngControl&&(this.updateErrorState(),this.ngControl.disabled!==null&&this.ngControl.disabled!==this.disabled&&(this.disabled=this.ngControl.disabled,this.stateChanges.next())),this._dirtyCheckNativeValue(),this._dirtyCheckPlaceholder()}focus(e){this._elementRef.nativeElement.focus(e)}updateErrorState(){this._errorStateTracker.updateErrorState()}_focusChanged(e){if(e!==this.focused){if(!this._isNativeSelect&&e&&this.disabled&&this.disabledInteractive){let i=this._elementRef.nativeElement;i.type==="number"?(i.type="text",i.setSelectionRange(0,0),i.type="number"):i.setSelectionRange(0,0)}this.focused=e,this.stateChanges.next()}}_onInput(){}_dirtyCheckNativeValue(){let e=this._elementRef.nativeElement.value;this._previousNativeValue!==e&&(this._previousNativeValue=e,this.stateChanges.next())}_dirtyCheckPlaceholder(){let e=this._getPlaceholder();if(e!==this._previousPlaceholder){let i=this._elementRef.nativeElement;this._previousPlaceholder=e,e?i.setAttribute("placeholder",e):i.removeAttribute("placeholder")}}_getPlaceholder(){return this.placeholder||null}_validateType(){OA.indexOf(this._type)>-1}_isNeverEmpty(){return this._neverEmptyInputTypes.indexOf(this._type)>-1}_isBadInput(){let e=this._elementRef.nativeElement.validity;return e&&e.badInput}get empty(){return!this._isNeverEmpty()&&!this._elementRef.nativeElement.value&&!this._isBadInput()&&!this.autofilled}get shouldLabelFloat(){if(this._isNativeSelect){let e=this._elementRef.nativeElement,i=e.options[0];return this.focused||e.multiple||!this.empty||!!(e.selectedIndex>-1&&i&&i.label)}else return this.focused&&!this.disabled||!this.empty}get describedByIds(){return this._elementRef.nativeElement.getAttribute("aria-describedby")?.split(" ")||[]}setDescribedByIds(e){let i=this._elementRef.nativeElement;e.length?i.setAttribute("aria-describedby",e.join(" ")):i.removeAttribute("aria-describedby")}onContainerClick(){this.focused||this.focus()}_isInlineSelect(){let e=this._elementRef.nativeElement;return this._isNativeSelect&&(e.multiple||e.size>1)}_iOSKeyupListener=e=>{let i=e.target;!i.value&&i.selectionStart===0&&i.selectionEnd===0&&(i.setSelectionRange(1,1),i.setSelectionRange(0,0))};_getReadonlyAttribute(){return this._isNativeSelect?null:this.readonly||this.disabled&&this.disabledInteractive?"true":null}static \u0275fac=function(i){return new(i||t)};static \u0275dir=ee({type:t,selectors:[["input","matInput",""],["textarea","matInput",""],["select","matNativeControl",""],["input","matNativeControl",""],["textarea","matNativeControl",""]],hostAttrs:[1,"mat-mdc-input-element"],hostVars:21,hostBindings:function(i,o){i&1&&V("focus",function(){return o._focusChanged(!0)})("blur",function(){return o._focusChanged(!1)})("input",function(){return o._onInput()}),i&2&&(Vt("id",o.id)("disabled",o.disabled&&!o.disabledInteractive)("required",o.required),Q("name",o.name||null)("readonly",o._getReadonlyAttribute())("aria-disabled",o.disabled&&o.disabledInteractive?"true":null)("aria-invalid",o.empty&&o.required?null:o.errorState)("aria-required",o.required)("id",o.id),z("mat-input-server",o._isServer)("mat-mdc-form-field-textarea-control",o._isInFormField&&o._isTextarea)("mat-mdc-form-field-input-control",o._isInFormField)("mat-mdc-input-disabled-interactive",o.disabledInteractive)("mdc-text-field__input",o._isInFormField)("mat-mdc-native-select-inline",o._isInlineSelect()))},inputs:{disabled:"disabled",id:"id",placeholder:"placeholder",name:"name",required:"required",type:"type",errorStateMatcher:"errorStateMatcher",userAriaDescribedBy:[0,"aria-describedby","userAriaDescribedBy"],value:"value",readonly:"readonly",disabledInteractive:[2,"disabledInteractive","disabledInteractive",O]},exportAs:["matInput"],features:[ze([{provide:xc,useExisting:t}]),wt]})}return t})(),Lu=(()=>{class t{static \u0275fac=function(i){return new(i||t)};static \u0275mod=le({type:t});static \u0275inj=se({imports:[no,no,FS,Ne]})}return t})();var PA=new D("mat-select-scroll-strategy",{providedIn:"root",factory:()=>{let t=p(ie);return()=>ci(t)}}),FA=new D("MAT_SELECT_CONFIG"),VS=new D("MatSelectTrigger"),Ag=class{source;value;constructor(n,e){this.source=n,this.value=e}},jS=(()=>{class t{_viewportRuler=p(In);_changeDetectorRef=p(He);_elementRef=p(q);_dir=p(ft,{optional:!0});_idGenerator=p(Qe);_renderer=p(Ue);_parentFormField=p(Fa,{optional:!0});ngControl=p(Pa,{self:!0,optional:!0});_liveAnnouncer=p(Hh);_defaultOptions=p(FA,{optional:!0});_animationsDisabled=qe();_popoverLocation;_initialized=new B;_cleanupDetach;options;optionGroups;customTrigger;_positions=[{originX:"start",originY:"bottom",overlayX:"start",overlayY:"top"},{originX:"end",originY:"bottom",overlayX:"end",overlayY:"top"},{originX:"start",originY:"top",overlayX:"start",overlayY:"bottom",panelClass:"mat-mdc-select-panel-above"},{originX:"end",originY:"top",overlayX:"end",overlayY:"bottom",panelClass:"mat-mdc-select-panel-above"}];_scrollOptionIntoView(e){let i=this.options.toArray()[e];if(i){let o=this.panel.nativeElement,a=eu(e,this.options,this.optionGroups),r=i._getHostElement();e===0&&a===1?o.scrollTop=0:o.scrollTop=tu(r.offsetTop,r.offsetHeight,o.scrollTop,o.offsetHeight)}}_positioningSettled(){this._scrollOptionIntoView(this._keyManager.activeItemIndex||0)}_getChangeEvent(e){return new Ag(this,e)}_scrollStrategyFactory=p(PA);_panelOpen=!1;_compareWith=(e,i)=>e===i;_uid=this._idGenerator.getId("mat-select-");_triggerAriaLabelledBy=null;_previousControl;_destroy=new B;_errorStateTracker;stateChanges=new B;disableAutomaticLabeling=!0;userAriaDescribedBy;_selectionModel;_keyManager;_preferredOverlayOrigin;_overlayWidth;_onChange=()=>{};_onTouched=()=>{};_valueId=this._idGenerator.getId("mat-select-value-");_scrollStrategy;_overlayPanelClass=this._defaultOptions?.overlayPanelClass||"";get focused(){return this._focused||this._panelOpen}_focused=!1;controlType="mat-select";trigger;panel;_overlayDir;panelClass;disabled=!1;get disableRipple(){return this._disableRipple()}set disableRipple(e){this._disableRipple.set(e)}_disableRipple=G(!1);tabIndex=0;get hideSingleSelectionIndicator(){return this._hideSingleSelectionIndicator}set hideSingleSelectionIndicator(e){this._hideSingleSelectionIndicator=e,this._syncParentProperties()}_hideSingleSelectionIndicator=this._defaultOptions?.hideSingleSelectionIndicator??!1;get placeholder(){return this._placeholder}set placeholder(e){this._placeholder=e,this.stateChanges.next()}_placeholder;get required(){return this._required??this.ngControl?.control?.hasValidator(Oo.required)??!1}set required(e){this._required=e,this.stateChanges.next()}_required;get multiple(){return this._multiple}set multiple(e){this._selectionModel,this._multiple=e}_multiple=!1;disableOptionCentering=this._defaultOptions?.disableOptionCentering??!1;get compareWith(){return this._compareWith}set compareWith(e){this._compareWith=e,this._selectionModel&&this._initializeSelection()}get value(){return this._value}set value(e){this._assignValue(e)&&this._onChange(e)}_value;ariaLabel="";ariaLabelledby;get errorStateMatcher(){return this._errorStateTracker.matcher}set errorStateMatcher(e){this._errorStateTracker.matcher=e}typeaheadDebounceInterval;sortComparator;get id(){return this._id}set id(e){this._id=e||this._uid,this.stateChanges.next()}_id;get errorState(){return this._errorStateTracker.errorState}set errorState(e){this._errorStateTracker.errorState=e}panelWidth=this._defaultOptions&&typeof this._defaultOptions.panelWidth<"u"?this._defaultOptions.panelWidth:"auto";canSelectNullableOptions=this._defaultOptions?.canSelectNullableOptions??!1;optionSelectionChanges=Ti(()=>{let e=this.options;return e?e.changes.pipe(st(e),Kt(()=>bt(...e.map(i=>i.onSelectionChange)))):this._initialized.pipe(Kt(()=>this.optionSelectionChanges))});openedChange=new K;_openedStream=this.openedChange.pipe(Ze(e=>e),je(()=>{}));_closedStream=this.openedChange.pipe(Ze(e=>!e),je(()=>{}));selectionChange=new K;valueChange=new K;constructor(){let e=p(Ur),i=p(Vr,{optional:!0}),o=p(jr,{optional:!0}),a=p(new ti("tabindex"),{optional:!0}),r=p(mc,{optional:!0}),s=p(Cu,{optional:!0,self:!0});this.ngControl&&(this.ngControl.valueAccessor=this),this._defaultOptions?.typeaheadDebounceInterval!=null&&(this.typeaheadDebounceInterval=this._defaultOptions.typeaheadDebounceInterval),this._errorStateTracker=new Gr(e,s||this.ngControl,o,i,this.stateChanges),this._scrollStrategy=this._scrollStrategyFactory(),this.tabIndex=a==null?0:parseInt(a)||0,this._popoverLocation=r?.usePopover===!1?null:"inline",this.id=this.id}ngOnInit(){this._selectionModel=new La(this.multiple),this.stateChanges.next(),this._viewportRuler.change().pipe(Re(this._destroy)).subscribe(()=>{this.panelOpen&&(this._overlayWidth=this._getOverlayWidth(this._preferredOverlayOrigin),this._changeDetectorRef.detectChanges())})}ngAfterContentInit(){this._initialized.next(),this._initialized.complete(),this._initKeyManager(),this._selectionModel.changed.pipe(Re(this._destroy)).subscribe(e=>{e.added.forEach(i=>i.select()),e.removed.forEach(i=>i.deselect())}),this.options.changes.pipe(st(null),Re(this._destroy)).subscribe(()=>{this._resetOptions(),this._initializeSelection()})}ngDoCheck(){let e=this._getTriggerAriaLabelledby(),i=this.ngControl;if(e!==this._triggerAriaLabelledBy){let o=this._elementRef.nativeElement;this._triggerAriaLabelledBy=e,e?o.setAttribute("aria-labelledby",e):o.removeAttribute("aria-labelledby")}i&&(this._previousControl!==i.control&&(this._previousControl!==void 0&&i.disabled!==null&&i.disabled!==this.disabled&&(this.disabled=i.disabled),this._previousControl=i.control),this.updateErrorState())}ngOnChanges(e){(e.disabled||e.userAriaDescribedBy)&&this.stateChanges.next(),e.typeaheadDebounceInterval&&this._keyManager&&this._keyManager.withTypeAhead(this.typeaheadDebounceInterval),e.panelClass&&this.panelClass instanceof Set&&(this.panelClass=Array.from(this.panelClass))}ngOnDestroy(){this._cleanupDetach?.(),this._keyManager?.destroy(),this._destroy.next(),this._destroy.complete(),this.stateChanges.complete()}toggle(){this.panelOpen?this.close():this.open()}open(){this._canOpen()&&(this._parentFormField&&(this._preferredOverlayOrigin=this._parentFormField.getConnectedOverlayOrigin()),this._cleanupDetach?.(),this._overlayWidth=this._getOverlayWidth(this._preferredOverlayOrigin),this._panelOpen=!0,this._overlayDir.positionChange.pipe(Ft(1)).subscribe(()=>{this._changeDetectorRef.detectChanges(),this._positioningSettled()}),this._overlayDir.attachOverlay(),this._keyManager.withHorizontalOrientation(null),this._highlightCorrectOption(),this._changeDetectorRef.markForCheck(),this.stateChanges.next(),Promise.resolve().then(()=>this.openedChange.emit(!0)))}close(){this._panelOpen&&(this._panelOpen=!1,this._exitAndDetach(),this._keyManager.withHorizontalOrientation(this._isRtl()?"rtl":"ltr"),this._changeDetectorRef.markForCheck(),this._onTouched(),this.stateChanges.next(),Promise.resolve().then(()=>this.openedChange.emit(!1)))}_exitAndDetach(){if(this._animationsDisabled||!this.panel){this._detachOverlay();return}this._cleanupDetach?.(),this._cleanupDetach=()=>{i(),clearTimeout(o),this._cleanupDetach=void 0};let e=this.panel.nativeElement,i=this._renderer.listen(e,"animationend",a=>{a.animationName==="_mat-select-exit"&&(this._cleanupDetach?.(),this._detachOverlay())}),o=setTimeout(()=>{this._cleanupDetach?.(),this._detachOverlay()},200);e.classList.add("mat-select-panel-exit")}_detachOverlay(){this._overlayDir.detachOverlay(),this._changeDetectorRef.markForCheck()}writeValue(e){this._assignValue(e)}registerOnChange(e){this._onChange=e}registerOnTouched(e){this._onTouched=e}setDisabledState(e){this.disabled=e,this._changeDetectorRef.markForCheck(),this.stateChanges.next()}get panelOpen(){return this._panelOpen}get selected(){return this.multiple?this._selectionModel?.selected||[]:this._selectionModel?.selected[0]}get triggerValue(){if(this.empty)return"";if(this._multiple){let e=this._selectionModel.selected.map(i=>i.viewValue);return this._isRtl()&&e.reverse(),e.join(", ")}return this._selectionModel.selected[0].viewValue}updateErrorState(){this._errorStateTracker.updateErrorState()}_isRtl(){return this._dir?this._dir.value==="rtl":!1}_handleKeydown(e){this.disabled||(this.panelOpen?this._handleOpenKeydown(e):this._handleClosedKeydown(e))}_handleClosedKeydown(e){let i=e.keyCode,o=i===40||i===38||i===37||i===39,a=i===13||i===32,r=this._keyManager;if(!r.isTyping()&&a&&!pt(e)||(this.multiple||e.altKey)&&o)e.preventDefault(),this.open();else if(!this.multiple){let s=this.selected;r.onKeydown(e);let c=this.selected;c&&s!==c&&this._liveAnnouncer.announce(c.viewValue,1e4)}}_handleOpenKeydown(e){let i=this._keyManager,o=e.keyCode,a=o===40||o===38,r=i.isTyping();if(a&&e.altKey)e.preventDefault(),this.close();else if(!r&&(o===13||o===32)&&i.activeItem&&!pt(e))e.preventDefault(),i.activeItem._selectViaInteraction();else if(!r&&this._multiple&&o===65&&e.ctrlKey){e.preventDefault();let s=this.options.some(c=>!c.disabled&&!c.selected);this.options.forEach(c=>{c.disabled||(s?c.select():c.deselect())})}else{let s=i.activeItemIndex;i.onKeydown(e),this._multiple&&a&&e.shiftKey&&i.activeItem&&i.activeItemIndex!==s&&i.activeItem._selectViaInteraction()}}_handleOverlayKeydown(e){e.keyCode===27&&!pt(e)&&(e.preventDefault(),this.close())}_onFocus(){this.disabled||(this._focused=!0,this.stateChanges.next())}_onBlur(){this._focused=!1,this._keyManager?.cancelTypeahead(),!this.disabled&&!this.panelOpen&&(this._onTouched(),this._changeDetectorRef.markForCheck(),this.stateChanges.next())}get empty(){return!this._selectionModel||this._selectionModel.isEmpty()}_initializeSelection(){Promise.resolve().then(()=>{this.ngControl&&(this._value=this.ngControl.value),this._setSelectionByValue(this._value),this.stateChanges.next()})}_setSelectionByValue(e){if(this.options.forEach(i=>i.setInactiveStyles()),this._selectionModel.clear(),this.multiple&&e)Array.isArray(e),e.forEach(i=>this._selectOptionByValue(i)),this._sortValues();else{let i=this._selectOptionByValue(e);i?this._keyManager.updateActiveItem(i):this.panelOpen||this._keyManager.updateActiveItem(-1)}this._changeDetectorRef.markForCheck()}_selectOptionByValue(e){let i=this.options.find(o=>{if(this._selectionModel.isSelected(o))return!1;try{return(o.value!=null||this.canSelectNullableOptions)&&this._compareWith(o.value,e)}catch{return!1}});return i&&this._selectionModel.select(i),i}_assignValue(e){return e!==this._value||this._multiple&&Array.isArray(e)?(this.options&&this._setSelectionByValue(e),this._value=e,!0):!1}_skipPredicate=e=>this.panelOpen?!1:e.disabled;_getOverlayWidth(e){return this.panelWidth==="auto"?(e instanceof Ar?e.elementRef:e||this._elementRef).nativeElement.getBoundingClientRect().width:this.panelWidth===null?"":this.panelWidth}_syncParentProperties(){if(this.options)for(let e of this.options)e._changeDetectorRef.markForCheck()}_initKeyManager(){this._keyManager=new Aa(this.options).withTypeAhead(this.typeaheadDebounceInterval).withVerticalOrientation().withHorizontalOrientation(this._isRtl()?"rtl":"ltr").withHomeAndEnd().withPageUpDown().withAllowedModifierKeys(["shiftKey"]).skipPredicate(this._skipPredicate),this._keyManager.tabOut.subscribe(()=>{this.panelOpen&&(!this.multiple&&this._keyManager.activeItem&&this._keyManager.activeItem._selectViaInteraction(),this.focus(),this.close())}),this._keyManager.change.subscribe(()=>{this._panelOpen&&this.panel?this._scrollOptionIntoView(this._keyManager.activeItemIndex||0):!this._panelOpen&&!this.multiple&&this._keyManager.activeItem&&this._keyManager.activeItem._selectViaInteraction()})}_resetOptions(){let e=bt(this.options.changes,this._destroy);this.optionSelectionChanges.pipe(Re(e)).subscribe(i=>{this._onSelect(i.source,i.isUserInput),i.isUserInput&&!this.multiple&&this._panelOpen&&(this.close(),this.focus())}),bt(...this.options.map(i=>i._stateChanges)).pipe(Re(e)).subscribe(()=>{this._changeDetectorRef.detectChanges(),this.stateChanges.next()})}_onSelect(e,i){let o=this._selectionModel.isSelected(e);!this.canSelectNullableOptions&&e.value==null&&!this._multiple?(e.deselect(),this._selectionModel.clear(),this.value!=null&&this._propagateChanges(e.value)):(o!==e.selected&&(e.selected?this._selectionModel.select(e):this._selectionModel.deselect(e)),i&&this._keyManager.setActiveItem(e),this.multiple&&(this._sortValues(),i&&this.focus())),o!==this._selectionModel.isSelected(e)&&this._propagateChanges(),this.stateChanges.next()}_sortValues(){if(this.multiple){let e=this.options.toArray();this._selectionModel.sort((i,o)=>this.sortComparator?this.sortComparator(i,o,e):e.indexOf(i)-e.indexOf(o)),this.stateChanges.next()}}_propagateChanges(e){let i;this.multiple?i=this.selected.map(o=>o.value):i=this.selected?this.selected.value:e,this._value=i,this.valueChange.emit(i),this._onChange(i),this.selectionChange.emit(this._getChangeEvent(i)),this._changeDetectorRef.markForCheck()}_highlightCorrectOption(){if(this._keyManager)if(this.empty){let e=-1;for(let i=0;i<this.options.length;i++)if(!this.options.get(i).disabled){e=i;break}this._keyManager.setActiveItem(e)}else this._keyManager.setActiveItem(this._selectionModel.selected[0])}_canOpen(){return!this._panelOpen&&!this.disabled&&this.options?.length>0&&!!this._overlayDir}focus(e){this._elementRef.nativeElement.focus(e)}_getPanelAriaLabelledby(){if(this.ariaLabel)return null;let e=this._parentFormField?.getLabelId()||null,i=e?e+" ":"";return this.ariaLabelledby?i+this.ariaLabelledby:e}_getAriaActiveDescendant(){return this.panelOpen&&this._keyManager&&this._keyManager.activeItem?this._keyManager.activeItem.id:null}_getTriggerAriaLabelledby(){if(this.ariaLabel)return null;let e=this._parentFormField?.getLabelId()||"";return this.ariaLabelledby&&(e+=" "+this.ariaLabelledby),e||(e=this._valueId),e}get describedByIds(){return this._elementRef.nativeElement.getAttribute("aria-describedby")?.split(" ")||[]}setDescribedByIds(e){let i=this._elementRef.nativeElement;e.length?i.setAttribute("aria-describedby",e.join(" ")):i.removeAttribute("aria-describedby")}onContainerClick(e){let i=Gt(e);i&&(i.tagName==="MAT-OPTION"||i.classList.contains("cdk-overlay-backdrop")||i.closest(".mat-mdc-select-panel"))||(this.focus(),this.open())}get shouldLabelFloat(){return this.panelOpen||!this.empty||this.focused&&!!this.placeholder}static \u0275fac=function(i){return new(i||t)};static \u0275cmp=(function(){let e=["trigger"],i=["panel"],o=[[["mat-select-trigger"]],"*"],a=["mat-select-trigger","*"];function r(m,v){if(m&1&&(f(0,"span",4),b(1),u()),m&2){let g=x();h(),S(g.placeholder)}}function s(m,v){m&1&&oe(0)}function c(m,v){if(m&1&&(f(0,"span",11),b(1),u()),m&2){let g=x(2);h(),S(g.triggerValue)}}function d(m,v){if(m&1&&(f(0,"span",5),k(1,s,1,0)(2,c,2,1,"span",11),u()),m&2){let g=x();h(),N(g.customTrigger?1:2)}}function l(m,v){if(m&1){let g=We();f(0,"div",12,1),V("keydown",function(_){De(g);let C=x();return Me(C._handleKeydown(_))}),oe(2,1),u()}if(m&2){let g=x();Ke(g.panelClass),z("mat-select-panel-animations-enabled",!g._animationsDisabled)("mat-primary",g._parentFormField?.color==="primary")("mat-accent",g._parentFormField?.color==="accent")("mat-warn",g._parentFormField?.color==="warn")("mat-undefined",!g._parentFormField?.color),Q("id",g.id+"-panel")("aria-multiselectable",g.multiple)("aria-label",g.ariaLabel||null)("aria-labelledby",g._getPanelAriaLabelledby())}}return H({type:t,selectors:[["mat-select"]],contentQueries:function(v,g,y){if(v&1&&Mt(y,VS,5)(y,ko,5)(y,cc,5),v&2){let _;Y(_=Z())&&(g.customTrigger=_.first),Y(_=Z())&&(g.options=_),Y(_=Z())&&(g.optionGroups=_)}},viewQuery:function(v,g){if(v&1&&ot(e,5)(i,5)(du,5),v&2){let y;Y(y=Z())&&(g.trigger=y.first),Y(y=Z())&&(g.panel=y.first),Y(y=Z())&&(g._overlayDir=y.first)}},hostAttrs:["role","combobox","aria-haspopup","listbox",1,"mat-mdc-select"],hostVars:21,hostBindings:function(v,g){v&1&&V("keydown",function(_){return g._handleKeydown(_)})("focus",function(){return g._onFocus()})("blur",function(){return g._onBlur()}),v&2&&(Q("id",g.id)("tabindex",g.disabled?-1:g.tabIndex)("aria-controls",g.panelOpen?g.id+"-panel":null)("aria-expanded",g.panelOpen)("aria-label",g.ariaLabel||null)("aria-required",g.required.toString())("aria-disabled",g.disabled.toString())("aria-invalid",g.errorState)("aria-activedescendant",g._getAriaActiveDescendant()),z("mat-mdc-select-disabled",g.disabled)("mat-mdc-select-invalid",g.errorState)("mat-mdc-select-required",g.required)("mat-mdc-select-empty",g.empty)("mat-mdc-select-multiple",g.multiple)("mat-select-open",g.panelOpen))},inputs:{userAriaDescribedBy:[0,"aria-describedby","userAriaDescribedBy"],panelClass:"panelClass",disabled:[2,"disabled","disabled",O],disableRipple:[2,"disableRipple","disableRipple",O],tabIndex:[2,"tabIndex","tabIndex",m=>m==null?0:on(m)],hideSingleSelectionIndicator:[2,"hideSingleSelectionIndicator","hideSingleSelectionIndicator",O],placeholder:"placeholder",required:[2,"required","required",O],multiple:[2,"multiple","multiple",O],disableOptionCentering:[2,"disableOptionCentering","disableOptionCentering",O],compareWith:"compareWith",value:"value",ariaLabel:[0,"aria-label","ariaLabel"],ariaLabelledby:[0,"aria-labelledby","ariaLabelledby"],errorStateMatcher:"errorStateMatcher",typeaheadDebounceInterval:[2,"typeaheadDebounceInterval","typeaheadDebounceInterval",on],sortComparator:"sortComparator",id:"id",panelWidth:"panelWidth",canSelectNullableOptions:[2,"canSelectNullableOptions","canSelectNullableOptions",O]},outputs:{openedChange:"openedChange",_openedStream:"opened",_closedStream:"closed",selectionChange:"selectionChange",valueChange:"valueChange"},exportAs:["matSelect"],features:[ze([{provide:xc,useExisting:t},{provide:sc,useExisting:t}]),wt],ngContentSelectors:a,decls:11,vars:10,consts:[["fallbackOverlayOrigin","cdkOverlayOrigin","trigger",""],["panel",""],["cdk-overlay-origin","",1,"mat-mdc-select-trigger",3,"click"],[1,"mat-mdc-select-value"],[1,"mat-mdc-select-placeholder","mat-mdc-select-min-line"],[1,"mat-mdc-select-value-text"],[1,"mat-mdc-select-arrow-wrapper"],[1,"mat-mdc-select-arrow"],["viewBox","0 0 24 24","width","24px","height","24px","focusable","false","aria-hidden","true"],["d","M7 10l5 5 5-5z"],["cdk-connected-overlay","","cdkConnectedOverlayHasBackdrop","","cdkConnectedOverlayBackdropClass","cdk-overlay-transparent-backdrop",3,"detach","backdropClick","overlayKeydown","cdkConnectedOverlayDisableClose","cdkConnectedOverlayPanelClass","cdkConnectedOverlayScrollStrategy","cdkConnectedOverlayOrigin","cdkConnectedOverlayPositions","cdkConnectedOverlayWidth","cdkConnectedOverlayFlexibleDimensions","cdkConnectedOverlayUsePopover"],[1,"mat-mdc-select-min-line"],["role","listbox","tabindex","-1",1,"mat-mdc-select-panel","mdc-menu-surface","mdc-menu-surface--open",3,"keydown"]],template:function(v,g){if(v&1&&(Be(o),f(0,"div",2,0),V("click",function(){return g.open()}),f(3,"div",3),k(4,r,2,1,"span",4)(5,d,3,1,"span",5),u(),f(6,"div",6)(7,"div",7),_n(),f(8,"svg",8),A(9,"path",9),u()()()(),tn(10,l,3,16,"ng-template",10),V("detach",function(){return g.close()})("backdropClick",function(){return g.close()})("overlayKeydown",function(_){return g._handleOverlayKeydown(_)})),v&2){let y=nn(1);h(3),Q("id",g._valueId),h(),N(g.empty?4:5),h(6),R("cdkConnectedOverlayDisableClose",!0)("cdkConnectedOverlayPanelClass",g._overlayPanelClass)("cdkConnectedOverlayScrollStrategy",g._scrollStrategy)("cdkConnectedOverlayOrigin",g._preferredOverlayOrigin||y)("cdkConnectedOverlayPositions",g._positions)("cdkConnectedOverlayWidth",g._overlayWidth)("cdkConnectedOverlayFlexibleDimensions",!0)("cdkConnectedOverlayUsePopover",g._popoverLocation)}},dependencies:[Ar,du],styles:[`@keyframes _mat-select-enter {
  from {
    opacity: 0;
    transform: scaleY(0.8);
  }
  to {
    opacity: 1;
    transform: none;
  }
}
@keyframes _mat-select-exit {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}
.mat-mdc-select {
  display: inline-block;
  width: 100%;
  outline: none;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  color: var(--%NS%mat-select-enabled-trigger-text-color, var(--%NS%mat-sys-on-surface));
  font-family: var(--%NS%mat-select-trigger-text-font, var(--%NS%mat-sys-body-large-font));
  line-height: var(--%NS%mat-select-trigger-text-line-height, var(--%NS%mat-sys-body-large-line-height));
  font-size: var(--%NS%mat-select-trigger-text-size, var(--%NS%mat-sys-body-large-size));
  font-weight: var(--%NS%mat-select-trigger-text-weight, var(--%NS%mat-sys-body-large-weight));
  letter-spacing: var(--%NS%mat-select-trigger-text-tracking, var(--%NS%mat-sys-body-large-tracking));
}

div.mat-mdc-select-panel {
  box-shadow: var(--%NS%mat-select-container-elevation-shadow, 0px 3px 1px -2px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12));
}

.mat-mdc-select-disabled {
  color: var(--%NS%mat-select-disabled-trigger-text-color, color-mix(in srgb, var(--%NS%mat-sys-on-surface) 38%, transparent));
}
.mat-mdc-select-disabled .mat-mdc-select-placeholder {
  color: var(--%NS%mat-select-disabled-trigger-text-color, color-mix(in srgb, var(--%NS%mat-sys-on-surface) 38%, transparent));
}

.mat-mdc-select-trigger {
  display: inline-flex;
  align-items: center;
  cursor: pointer;
  position: relative;
  box-sizing: border-box;
  width: 100%;
}
.mat-mdc-select-disabled .mat-mdc-select-trigger {
  -webkit-user-select: none;
  user-select: none;
  cursor: default;
}

.mat-mdc-select-value {
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.mat-mdc-select-value-text {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.mat-mdc-select-arrow-wrapper {
  height: 24px;
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
}
.mat-form-field-appearance-fill .mdc-text-field--no-label .mat-mdc-select-arrow-wrapper {
  transform: none;
}

.mat-mdc-form-field .mat-mdc-select.mat-mdc-select-invalid .mat-mdc-select-arrow,
.mat-form-field-invalid:not(.mat-form-field-disabled) .mat-mdc-form-field-infix::after {
  color: var(--%NS%mat-select-invalid-arrow-color, var(--%NS%mat-sys-error));
}

.mat-mdc-select-arrow {
  width: 10px;
  height: 5px;
  position: relative;
  color: var(--%NS%mat-select-enabled-arrow-color, var(--%NS%mat-sys-on-surface-variant));
}
.mat-mdc-form-field.mat-focused .mat-mdc-select-arrow {
  color: var(--%NS%mat-select-focused-arrow-color, var(--%NS%mat-sys-primary));
}
.mat-mdc-form-field .mat-mdc-select.mat-mdc-select-disabled .mat-mdc-select-arrow {
  color: var(--%NS%mat-select-disabled-arrow-color, color-mix(in srgb, var(--%NS%mat-sys-on-surface) 38%, transparent));
}
.mat-select-open .mat-mdc-select-arrow {
  transform: rotate(180deg);
}
.mat-form-field-animations-enabled .mat-mdc-select-arrow {
  transition: transform 80ms linear;
}
.mat-mdc-select-arrow svg {
  fill: currentColor;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
@media (forced-colors: active) {
  .mat-mdc-select-arrow svg {
    fill: CanvasText;
  }
  .mat-mdc-select-disabled .mat-mdc-select-arrow svg {
    fill: GrayText;
  }
}

div.mat-mdc-select-panel {
  width: 100%;
  max-height: 275px;
  outline: 0;
  overflow: auto;
  padding: 8px 0;
  box-sizing: border-box;
  transform-origin: top center;
  border-radius: 0 0 4px 4px;
  position: relative;
  background-color: var(--%NS%mat-select-panel-background-color, var(--%NS%mat-sys-surface-container));
}
.mat-mdc-select-panel-above div.mat-mdc-select-panel {
  border-radius: 4px 4px 0 0;
  transform-origin: bottom center;
}
@media (forced-colors: active) {
  div.mat-mdc-select-panel {
    outline: solid 1px;
  }
}

.mat-select-panel-animations-enabled {
  animation: _mat-select-enter 120ms cubic-bezier(0, 0, 0.2, 1) forwards;
}
.mat-select-panel-animations-enabled.mat-select-panel-exit {
  animation: _mat-select-exit 100ms linear forwards;
}

.mat-mdc-select-placeholder {
  transition: color 400ms 133.3333333333ms cubic-bezier(0.25, 0.8, 0.25, 1);
  color: var(--%NS%mat-select-placeholder-text-color, var(--%NS%mat-sys-on-surface-variant));
}
.mat-mdc-form-field:not(.mat-form-field-animations-enabled) .mat-mdc-select-placeholder, ._mat-animation-noopable .mat-mdc-select-placeholder {
  transition: none;
}
.mat-form-field-hide-placeholder .mat-mdc-select-placeholder {
  color: transparent;
  -webkit-text-fill-color: transparent;
  transition: none;
  display: block;
}

.mat-mdc-form-field-type-mat-select:not(.mat-form-field-disabled) .mat-mdc-text-field-wrapper {
  cursor: pointer;
}
.mat-mdc-form-field-type-mat-select.mat-form-field-appearance-fill .mat-mdc-floating-label {
  max-width: calc(100% - 18px);
}
.mat-mdc-form-field-type-mat-select.mat-form-field-appearance-fill .mdc-floating-label--float-above {
  max-width: calc(100% / 0.75 - 24px);
}
.mat-mdc-form-field-type-mat-select.mat-form-field-appearance-outline .mdc-notched-outline__notch {
  max-width: calc(100% - 60px);
}
.mat-mdc-form-field-type-mat-select.mat-form-field-appearance-outline .mdc-text-field--label-floating .mdc-notched-outline__notch {
  max-width: calc(100% - 24px);
}

.mat-mdc-select-min-line:empty::before {
  content: " ";
  white-space: pre;
  width: 1px;
  display: inline-block;
  visibility: hidden;
}

.mat-form-field-appearance-fill .mat-mdc-select-arrow-wrapper {
  transform: var(--%NS%mat-select-arrow-transform, translateY(-8px));
}
`],encapsulation:2})})()}return t})(),zS=(()=>{class t{static \u0275fac=function(i){return new(i||t)};static \u0275dir=ee({type:t,selectors:[["mat-select-trigger"]],features:[ze([{provide:VS,useExisting:t}])]})}return t})(),HS=(()=>{class t{static \u0275fac=function(i){return new(i||t)};static \u0275mod=le({type:t});static \u0275inj=se({imports:[di,Hr,Ne,ri,no,Hr]})}return t})();var BA=new D("MatTabContent"),Bg=(()=>{class t{template=p(At);static \u0275fac=function(i){return new(i||t)};static \u0275dir=ee({type:t,selectors:[["","matTabContent",""]],features:[ze([{provide:BA,useExisting:t}])]})}return t})(),VA=new D("MatTabLabel"),WS=new D("MAT_TAB"),Vg=(()=>{class t extends iC{_closestTab=p(WS,{optional:!0});static \u0275fac=(()=>{let e;return function(o){return(e||(e=Ot(t)))(o||t)}})();static \u0275dir=ee({type:t,selectors:[["","mat-tab-label",""],["","matTabLabel",""]],features:[ze([{provide:VA,useExisting:t}]),Ge]})}return t})(),qS=new D("MAT_TAB_GROUP"),jg=(()=>{class t{_viewContainerRef=p(Bt);_closestTabGroup=p(qS,{optional:!0});disabled=!1;get templateLabel(){return this._templateLabel}set templateLabel(e){this._setTemplateLabelInput(e)}_templateLabel;_explicitContent=void 0;_implicitContent;textLabel="";ariaLabel;ariaLabelledby;labelClass;bodyClass;id=null;_contentPortal=null;get content(){return this._contentPortal}_stateChanges=new B;position=null;origin=null;isActive=!1;constructor(){p(ut).load(bn)}ngOnChanges(e){(Object.hasOwn(e,"textLabel")||Object.hasOwn(e,"disabled"))&&this._stateChanges.next()}ngOnDestroy(){this._stateChanges.complete()}ngOnInit(){this._contentPortal=new xn(this._explicitContent||this._implicitContent,this._viewContainerRef)}_setTemplateLabelInput(e){e&&e._closestTab===this&&(this._templateLabel=e)}static \u0275fac=function(i){return new(i||t)};static \u0275cmp=(function(){let e=["*"];function i(o,a){o&1&&oe(0)}return H({type:t,selectors:[["mat-tab"]],contentQueries:function(a,r,s){if(a&1&&Mt(s,Vg,5)(s,Bg,7,At),a&2){let c;Y(c=Z())&&(r.templateLabel=c.first),Y(c=Z())&&(r._explicitContent=c.first)}},viewQuery:function(a,r){if(a&1&&ot(At,7),a&2){let s;Y(s=Z())&&(r._implicitContent=s.first)}},hostAttrs:["hidden",""],hostVars:1,hostBindings:function(a,r){a&2&&Q("id",null)},inputs:{disabled:[2,"disabled","disabled",O],textLabel:[0,"label","textLabel"],ariaLabel:[0,"aria-label","ariaLabel"],ariaLabelledby:[0,"aria-labelledby","ariaLabelledby"],labelClass:"labelClass",bodyClass:"bodyClass",id:"id"},exportAs:["matTab"],features:[ze([{provide:WS,useExisting:t}]),wt],ngContentSelectors:e,decls:1,vars:0,template:function(a,r){a&1&&(Be(),wo(0,i,1,0,"ng-template"))},encapsulation:2,changeDetection:1})})()}return t})(),Og="mdc-tab-indicator--active",$S="mdc-tab-indicator--no-transition",Pg=class{_items;_currentItem;constructor(n){this._items=n}hide(){this._items.forEach(n=>n.deactivateInkBar()),this._currentItem=void 0}alignToElement(n){let e=this._items.find(o=>o.elementRef.nativeElement===n),i=this._currentItem;if(e!==i&&(i?.deactivateInkBar(),e)){let o=i?.elementRef.nativeElement.getBoundingClientRect?.();e.activateInkBar(o),this._currentItem=e}}},jA=(()=>{class t{_elementRef=p(q);_inkBarElement=null;_inkBarContentElement=null;_fitToContent=!1;get fitInkBarToContent(){return this._fitToContent}set fitInkBarToContent(e){this._fitToContent!==e&&(this._fitToContent=e,this._inkBarElement&&this._appendInkBarElement())}activateInkBar(e){let i=this._elementRef.nativeElement;if(!e||!i.getBoundingClientRect||!this._inkBarContentElement){i.classList.add(Og);return}let o=i.getBoundingClientRect(),a=e.width/o.width,r=e.left-o.left;i.classList.add($S),this._inkBarContentElement.style.setProperty("transform",`translateX(${r}px) scaleX(${a})`),i.getBoundingClientRect(),i.classList.remove($S),i.classList.add(Og),this._inkBarContentElement.style.setProperty("transform","")}deactivateInkBar(){this._elementRef.nativeElement.classList.remove(Og)}ngOnInit(){this._createInkBarElement()}ngOnDestroy(){this._inkBarElement?.remove(),this._inkBarElement=this._inkBarContentElement=null}_createInkBarElement(){let e=this._elementRef.nativeElement.ownerDocument||document,i=this._inkBarElement=e.createElement("span"),o=this._inkBarContentElement=e.createElement("span");i.className="mdc-tab-indicator",o.className="mdc-tab-indicator__content mdc-tab-indicator__content--underline",i.appendChild(this._inkBarContentElement),this._appendInkBarElement()}_appendInkBarElement(){this._inkBarElement;let e=this._fitToContent?this._elementRef.nativeElement.querySelector(".mdc-tab__content"):this._elementRef.nativeElement;e.appendChild(this._inkBarElement)}static \u0275fac=function(i){return new(i||t)};static \u0275dir=ee({type:t,inputs:{fitInkBarToContent:[2,"fitInkBarToContent","fitInkBarToContent",O]}})}return t})();var YS=(()=>{class t extends jA{elementRef=p(q);disabled=!1;focus(){this.elementRef.nativeElement.focus()}getOffsetLeft(){return this.elementRef.nativeElement.offsetLeft}getOffsetWidth(){return this.elementRef.nativeElement.offsetWidth}static \u0275fac=(()=>{let e;return function(o){return(e||(e=Ot(t)))(o||t)}})();static \u0275dir=ee({type:t,selectors:[["","matTabLabelWrapper",""]],hostVars:3,hostBindings:function(i,o){i&2&&(Q("aria-disabled",!!o.disabled),z("mat-mdc-tab-disabled",o.disabled))},inputs:{disabled:[2,"disabled","disabled",O]},features:[Ge]})}return t})(),US={passive:!0},zA=650,HA=100;function Rg(t){let n=t+"";return/^[0-9]+(?:\.[0-9]+)?$/.test(n)?`${t}ms`:/^[0-9]+(?:\.[0-9]+)?(?:ms|s)$/.test(n)?n:""}var $A=(()=>{class t{_elementRef=p(q);_changeDetectorRef=p(He);_viewportRuler=p(In);_dir=p(ft,{optional:!0});_ngZone=p(X);_platform=p(Pe);_sharedResizeObserver=p(Su);_injector=p(ie);_renderer=p(Ue);_animationsDisabled=qe();_eventCleanups;_scrollDistance=0;_selectedIndexChanged=!1;_destroyed=new B;_showPaginationControls=!1;_disableScrollAfter=!0;_disableScrollBefore=!0;_tabLabelCount;_scrollDistanceChanged=!1;_keyManager;_currentTextContent;_stopScrolling=new B;disablePagination=!1;get selectedIndex(){return this._selectedIndex}set selectedIndex(e){let i=isNaN(e)?0:e;this._selectedIndex!=i&&(this._selectedIndexChanged=!0,this._selectedIndex=i,this._keyManager&&this._keyManager.updateActiveItem(i))}_selectedIndex=0;selectFocusedIndex=new K;indexFocused=new K;constructor(){this._eventCleanups=this._ngZone.runOutsideAngular(()=>[this._renderer.listen(this._elementRef.nativeElement,"mouseleave",()=>this._stopInterval())])}ngAfterViewInit(){this._eventCleanups.push(this._renderer.listen(this._previousPaginator.nativeElement,"touchstart",()=>this._handlePaginatorPress("before"),US),this._renderer.listen(this._nextPaginator.nativeElement,"touchstart",()=>this._handlePaginatorPress("after"),US))}ngAfterContentInit(){let e=this._dir?this._dir.change:Nt("ltr"),i=this._sharedResizeObserver.observe(this._elementRef.nativeElement).pipe(Ai(32),Re(this._destroyed)),o=this._viewportRuler.change(150).pipe(Re(this._destroyed)),a=()=>{this.updatePagination(),this._alignInkBarToSelectedTab()};this._keyManager=new Qi(this._items).withHorizontalOrientation(this._getLayoutDirection()).withHomeAndEnd().withWrap().skipPredicate(()=>!1),this._keyManager.updateActiveItem(Math.max(this._selectedIndex,0)),Et(a,{injector:this._injector}),bt(e,o,i,this._items.changes,this._itemsResized()).pipe(Re(this._destroyed)).subscribe(()=>{this._ngZone.run(()=>{Promise.resolve().then(()=>{this._scrollDistance=Math.max(0,Math.min(this._getMaxScrollDistance(),this._scrollDistance)),a()})}),this._keyManager?.withHorizontalOrientation(this._getLayoutDirection())}),this._keyManager.change.subscribe(r=>{this.indexFocused.emit(r),this._setTabFocus(r)})}_itemsResized(){return typeof ResizeObserver!="function"?Ni:this._items.changes.pipe(st(this._items),Kt(e=>new ge(i=>this._ngZone.runOutsideAngular(()=>{let o=new ResizeObserver(a=>i.next(a));return e.forEach(a=>o.observe(a.elementRef.nativeElement)),()=>{o.disconnect()}}))),Jo(1),Ze(e=>e.some(i=>i.contentRect.width>0&&i.contentRect.height>0)))}ngAfterContentChecked(){this._tabLabelCount!=this._items.length&&(this.updatePagination(),this._tabLabelCount=this._items.length,this._changeDetectorRef.markForCheck()),this._selectedIndexChanged&&(this._scrollToLabel(this._selectedIndex),this._checkScrollingControls(),this._alignInkBarToSelectedTab(),this._selectedIndexChanged=!1,this._changeDetectorRef.markForCheck()),this._scrollDistanceChanged&&(this._updateTabScrollPosition(),this._scrollDistanceChanged=!1,this._changeDetectorRef.markForCheck())}ngOnDestroy(){this._eventCleanups.forEach(e=>e()),this._keyManager?.destroy(),this._destroyed.next(),this._destroyed.complete(),this._stopScrolling.complete()}_handleKeydown(e){if(!pt(e))switch(e.keyCode){case 13:case 32:if(this.focusIndex!==this.selectedIndex){let i=this._items.get(this.focusIndex);i&&!i.disabled&&(this.selectFocusedIndex.emit(this.focusIndex),this._itemSelected(e))}break;default:this._keyManager?.onKeydown(e)}}_onContentChanges(){let e=this._elementRef.nativeElement.textContent;e!==this._currentTextContent&&(this._currentTextContent=e||"",this._ngZone.run(()=>{this.updatePagination(),this._alignInkBarToSelectedTab(),this._changeDetectorRef.markForCheck()}))}updatePagination(){this._checkPaginationEnabled(),this._checkScrollingControls(),this._updateTabScrollPosition()}get focusIndex(){return this._keyManager?this._keyManager.activeItemIndex:0}set focusIndex(e){!this._isValidIndex(e)||this.focusIndex===e||!this._keyManager||this._keyManager.setActiveItem(e)}_isValidIndex(e){return this._items?!!this._items.toArray()[e]:!0}_setTabFocus(e){if(this._showPaginationControls&&this._scrollToLabel(e),this._items&&this._items.length){this._items.toArray()[e].focus();let i=this._tabListContainer.nativeElement;this._getLayoutDirection()=="ltr"?i.scrollLeft=0:i.scrollLeft=i.scrollWidth-i.offsetWidth}}_getLayoutDirection(){return this._dir&&this._dir.value==="rtl"?"rtl":"ltr"}_updateTabScrollPosition(){if(this.disablePagination)return;let e=this.scrollDistance,i=this._getLayoutDirection()==="ltr"?-e:e;this._tabList.nativeElement.style.transform=`translateX(${Math.round(i)}px)`,(this._platform.TRIDENT||this._platform.EDGE)&&(this._tabListContainer.nativeElement.scrollLeft=0)}get scrollDistance(){return this._scrollDistance}set scrollDistance(e){this._scrollTo(e)}_scrollHeader(e){let i=this._tabListContainer.nativeElement.offsetWidth,o=(e=="before"?-1:1)*i/3;return this._scrollTo(this._scrollDistance+o)}_handlePaginatorClick(e){this._stopInterval(),this._scrollHeader(e)}_scrollToLabel(e){if(this.disablePagination)return;let i=this._items?this._items.toArray()[e]:null;if(!i)return;let o=this._tabListContainer.nativeElement.offsetWidth,{offsetLeft:a,offsetWidth:r}=i.elementRef.nativeElement,s,c;this._getLayoutDirection()=="ltr"?(s=a,c=s+r):(c=this._tabListInner.nativeElement.offsetWidth-a,s=c-r);let d=this.scrollDistance,l=this.scrollDistance+o;s<d?this.scrollDistance-=d-s:c>l&&(this.scrollDistance+=Math.min(c-l,s-d))}_checkPaginationEnabled(){if(this.disablePagination)this._showPaginationControls=!1;else{let e=this._tabListInner.nativeElement.scrollWidth,i=this._elementRef.nativeElement.offsetWidth,o=e-i>=5;o||(this.scrollDistance=0),o!==this._showPaginationControls&&(this._showPaginationControls=o,this._changeDetectorRef.markForCheck())}}_checkScrollingControls(){this.disablePagination?this._disableScrollAfter=this._disableScrollBefore=!0:(this._disableScrollBefore=this.scrollDistance==0,this._disableScrollAfter=this.scrollDistance==this._getMaxScrollDistance(),this._changeDetectorRef.markForCheck())}_getMaxScrollDistance(){let e=this._tabListInner.nativeElement.scrollWidth,i=this._tabListContainer.nativeElement.offsetWidth;return e-i||0}_alignInkBarToSelectedTab(){let e=this._items&&this._items.length?this._items.toArray()[this.selectedIndex]:null,i=e?e.elementRef.nativeElement:null;i?this._inkBar.alignToElement(i):this._inkBar.hide()}_stopInterval(){this._stopScrolling.next()}_handlePaginatorPress(e,i){i&&i.button!=null&&i.button!==0||(this._stopInterval(),Qo(zA,HA).pipe(Re(bt(this._stopScrolling,this._destroyed))).subscribe(()=>{let{maxScrollDistance:o,distance:a}=this._scrollHeader(e);(a===0||a>=o)&&this._stopInterval()}))}_scrollTo(e){if(this.disablePagination)return{maxScrollDistance:0,distance:0};let i=this._getMaxScrollDistance();return this._scrollDistance=Math.max(0,Math.min(i,e)),this._scrollDistanceChanged=!0,this._checkScrollingControls(),{maxScrollDistance:i,distance:this._scrollDistance}}static \u0275fac=function(i){return new(i||t)};static \u0275dir=ee({type:t,inputs:{disablePagination:[2,"disablePagination","disablePagination",O],selectedIndex:[2,"selectedIndex","selectedIndex",on]},outputs:{selectFocusedIndex:"selectFocusedIndex",indexFocused:"indexFocused"}})}return t})(),UA=(()=>{class t extends $A{_items;_tabListContainer;_tabList;_tabListInner;_nextPaginator;_previousPaginator;_inkBar;ariaLabel;ariaLabelledby;disableRipple=!1;ngAfterContentInit(){this._inkBar=new Pg(this._items),super.ngAfterContentInit()}_itemSelected(e){e.preventDefault()}static \u0275fac=(()=>{let e;return function(o){return(e||(e=Ot(t)))(o||t)}})();static \u0275cmp=(function(){let e=["tabListContainer"],i=["tabList"],o=["tabListInner"],a=["nextPaginator"],r=["previousPaginator"];return H({type:t,selectors:[["mat-tab-header"]],contentQueries:function(d,l,m){if(d&1&&Mt(m,YS,4),d&2){let v;Y(v=Z())&&(l._items=v)}},viewQuery:function(d,l){if(d&1&&ot(e,7)(i,7)(o,7)(a,5)(r,5),d&2){let m;Y(m=Z())&&(l._tabListContainer=m.first),Y(m=Z())&&(l._tabList=m.first),Y(m=Z())&&(l._tabListInner=m.first),Y(m=Z())&&(l._nextPaginator=m.first),Y(m=Z())&&(l._previousPaginator=m.first)}},hostAttrs:[1,"mat-mdc-tab-header"],hostVars:4,hostBindings:function(d,l){d&2&&z("mat-mdc-tab-header-pagination-controls-enabled",l._showPaginationControls)("mat-mdc-tab-header-rtl",l._getLayoutDirection()=="rtl")},inputs:{ariaLabel:[0,"aria-label","ariaLabel"],ariaLabelledby:[0,"aria-labelledby","ariaLabelledby"],disableRipple:[2,"disableRipple","disableRipple",O]},features:[Ge],ngContentSelectors:["*"],decls:13,vars:10,consts:[["previousPaginator",""],["tabListContainer",""],["tabList",""],["tabListInner",""],["nextPaginator",""],["mat-ripple","",1,"mat-mdc-tab-header-pagination","mat-mdc-tab-header-pagination-before",3,"click","mousedown","touchend","matRippleDisabled"],[1,"mat-mdc-tab-header-pagination-chevron"],[1,"mat-mdc-tab-label-container",3,"keydown"],["role","tablist",1,"mat-mdc-tab-list",3,"cdkObserveContent"],[1,"mat-mdc-tab-labels"],["mat-ripple","",1,"mat-mdc-tab-header-pagination","mat-mdc-tab-header-pagination-after",3,"mousedown","click","touchend","matRippleDisabled"]],template:function(d,l){d&1&&(Be(),f(0,"div",5,0),V("click",function(){return l._handlePaginatorClick("before")})("mousedown",function(v){return l._handlePaginatorPress("before",v)})("touchend",function(){return l._stopInterval()}),A(2,"div",6),u(),f(3,"div",7,1),V("keydown",function(v){return l._handleKeydown(v)}),f(5,"div",8,2),V("cdkObserveContent",function(){return l._onContentChanges()}),f(7,"div",9,3),oe(9),u()()(),f(10,"div",10,4),V("mousedown",function(v){return l._handlePaginatorPress("after",v)})("click",function(){return l._handlePaginatorClick("after")})("touchend",function(){return l._stopInterval()}),A(12,"div",6),u()),d&2&&(z("mat-mdc-tab-header-pagination-disabled",l._disableScrollBefore),R("matRippleDisabled",l._disableScrollBefore||l.disableRipple),h(3),z("_mat-animation-noopable",l._animationsDisabled),h(2),Q("aria-label",l.ariaLabel||null)("aria-labelledby",l.ariaLabelledby||null),h(5),z("mat-mdc-tab-header-pagination-disabled",l._disableScrollAfter),R("matRippleDisabled",l._disableScrollAfter||l.disableRipple))},dependencies:[ai,Fx],styles:[`.mat-mdc-tab-header {
  display: flex;
  overflow: hidden;
  position: relative;
  flex-shrink: 0;
}

.mdc-tab-indicator .mdc-tab-indicator__content {
  transition-duration: var(--%NS%mat-tab-header-animation-duration, 250ms);
}

.mat-mdc-tab-header-pagination {
  -webkit-user-select: none;
  user-select: none;
  position: relative;
  display: none;
  justify-content: center;
  align-items: center;
  min-width: 32px;
  cursor: pointer;
  z-index: 2;
  -webkit-tap-highlight-color: transparent;
  touch-action: none;
  box-sizing: content-box;
  outline: 0;
}
.mat-mdc-tab-header-pagination::-moz-focus-inner {
  border: 0;
}
.mat-mdc-tab-header-pagination .mat-ripple-element {
  opacity: 0.12;
  background-color: var(--%NS%mat-tab-inactive-ripple-color, var(--%NS%mat-sys-on-surface));
}
.mat-mdc-tab-header-pagination-controls-enabled .mat-mdc-tab-header-pagination {
  display: flex;
}

.mat-mdc-tab-header-pagination-before,
.mat-mdc-tab-header-rtl .mat-mdc-tab-header-pagination-after {
  padding-left: 4px;
}
.mat-mdc-tab-header-pagination-before .mat-mdc-tab-header-pagination-chevron,
.mat-mdc-tab-header-rtl .mat-mdc-tab-header-pagination-after .mat-mdc-tab-header-pagination-chevron {
  transform: rotate(-135deg);
}

.mat-mdc-tab-header-rtl .mat-mdc-tab-header-pagination-before,
.mat-mdc-tab-header-pagination-after {
  padding-right: 4px;
}
.mat-mdc-tab-header-rtl .mat-mdc-tab-header-pagination-before .mat-mdc-tab-header-pagination-chevron,
.mat-mdc-tab-header-pagination-after .mat-mdc-tab-header-pagination-chevron {
  transform: rotate(45deg);
}

.mat-mdc-tab-header-pagination-chevron {
  border-style: solid;
  border-width: 2px 2px 0 0;
  height: 8px;
  width: 8px;
  border-color: var(--%NS%mat-tab-pagination-icon-color, var(--%NS%mat-sys-on-surface));
}

.mat-mdc-tab-header-pagination-disabled {
  box-shadow: none;
  cursor: default;
  pointer-events: none;
}
.mat-mdc-tab-header-pagination-disabled .mat-mdc-tab-header-pagination-chevron {
  opacity: 0.4;
}

.mat-mdc-tab-list {
  flex-grow: 1;
  position: relative;
  transition: transform 500ms cubic-bezier(0.35, 0, 0.25, 1);
}
._mat-animation-noopable .mat-mdc-tab-list {
  transition: none;
}

.mat-mdc-tab-label-container {
  display: flex;
  flex-grow: 1;
  overflow: hidden;
  z-index: 1;
  border-bottom-style: solid;
  border-bottom-width: var(--%NS%mat-tab-divider-height, 1px);
  border-bottom-color: var(--%NS%mat-tab-divider-color, var(--%NS%mat-sys-surface-variant));
}
.mat-mdc-tab-group-inverted-header .mat-mdc-tab-label-container {
  border-bottom: none;
  border-top-style: solid;
  border-top-width: var(--%NS%mat-tab-divider-height, 1px);
  border-top-color: var(--%NS%mat-tab-divider-color, var(--%NS%mat-sys-surface-variant));
}

.mat-mdc-tab-labels {
  display: flex;
  flex: 1 0 auto;
}
[mat-align-tabs=center] > .mat-mdc-tab-header .mat-mdc-tab-labels {
  justify-content: center;
}
[mat-align-tabs=end] > .mat-mdc-tab-header .mat-mdc-tab-labels {
  justify-content: flex-end;
}
.cdk-drop-list .mat-mdc-tab-labels, .mat-mdc-tab-labels.cdk-drop-list {
  min-height: var(--%NS%mat-tab-container-height, 48px);
}

.mat-mdc-tab::before {
  margin: 5px;
}
@media (forced-colors: active) {
  .mat-mdc-tab[aria-disabled=true] {
    color: GrayText;
  }
}
`],encapsulation:2,changeDetection:1})})()}return t})(),GA=new D("MAT_TABS_CONFIG"),GS=(()=>{class t extends Ao{_host=p(Fg);_ngZone=p(X);_centeringSub=_e.EMPTY;_leavingSub=_e.EMPTY;ngOnInit(){super.ngOnInit(),this._centeringSub=this._host._beforeCentering.pipe(st(this._host._isCenterPosition())).subscribe(e=>{this._host._content&&e&&!this.hasAttached()&&this._ngZone.run(()=>{Promise.resolve().then(),this.attach(this._host._content)})}),this._leavingSub=this._host._afterLeavingCenter.subscribe(()=>{this._host.preserveContent||this._ngZone.run(()=>this.detach())})}ngOnDestroy(){super.ngOnDestroy(),this._centeringSub.unsubscribe(),this._leavingSub.unsubscribe()}static \u0275fac=(()=>{let e;return function(o){return(e||(e=Ot(t)))(o||t)}})();static \u0275dir=ee({type:t,selectors:[["","matTabBodyHost",""]],features:[Ge]})}return t})(),Fg=(()=>{class t{_elementRef=p(q);_dir=p(ft,{optional:!0});_ngZone=p(X);_injector=p(ie);_renderer=p(Ue);_diAnimationsDisabled=qe();_eventCleanups;_initialized=!1;_fallbackTimer;_positionIndex;_dirChangeSubscription=_e.EMPTY;_position;_previousPosition;_onCentering=new K;_beforeCentering=new K;_afterLeavingCenter=new K;_onCentered=new K(!0);_portalHost;_contentElement;_content;animationDuration="500ms";preserveContent=!1;set position(e){this._positionIndex=e,this._computePositionAnimationState()}constructor(){if(this._dir){let e=p(He);this._dirChangeSubscription=this._dir.change.subscribe(i=>{this._computePositionAnimationState(i),e.markForCheck()})}}ngOnInit(){this._bindTransitionEvents(),this._position==="center"&&(this._setActiveClass(!0),Et(()=>this._onCentering.emit(this._elementRef.nativeElement.clientHeight),{injector:this._injector})),this._initialized=!0}ngOnDestroy(){clearTimeout(this._fallbackTimer),this._eventCleanups?.forEach(e=>e()),this._dirChangeSubscription.unsubscribe()}_bindTransitionEvents(){this._ngZone.runOutsideAngular(()=>{let e=this._elementRef.nativeElement,i=o=>{o.target===this._contentElement?.nativeElement&&(this._elementRef.nativeElement.classList.remove("mat-tab-body-animating"),o.type==="transitionend"&&this._transitionDone())};this._eventCleanups=[this._renderer.listen(e,"transitionstart",o=>{o.target===this._contentElement?.nativeElement&&(this._elementRef.nativeElement.classList.add("mat-tab-body-animating"),this._transitionStarted())}),this._renderer.listen(e,"transitionend",i),this._renderer.listen(e,"transitioncancel",i)]})}_transitionStarted(){clearTimeout(this._fallbackTimer);let e=this._position==="center";this._beforeCentering.emit(e),e&&this._onCentering.emit(this._elementRef.nativeElement.clientHeight)}_transitionDone(){this._position==="center"?this._onCentered.emit():this._previousPosition==="center"&&this._afterLeavingCenter.emit()}_setActiveClass(e){this._elementRef.nativeElement.classList.toggle("mat-mdc-tab-body-active",e)}_getLayoutDirection(){return this._dir&&this._dir.value==="rtl"?"rtl":"ltr"}_isCenterPosition(){return this._positionIndex===0}_computePositionAnimationState(e=this._getLayoutDirection()){this._previousPosition=this._position,this._positionIndex<0?this._position=e=="ltr"?"left":"right":this._positionIndex>0?this._position=e=="ltr"?"right":"left":this._position="center",this._animationsDisabled()?this._simulateTransitionEvents():this._initialized&&(this._position==="center"||this._previousPosition==="center")&&(clearTimeout(this._fallbackTimer),this._fallbackTimer=this._ngZone.runOutsideAngular(()=>setTimeout(()=>this._simulateTransitionEvents(),100)))}_simulateTransitionEvents(){this._transitionStarted(),Et(()=>this._transitionDone(),{injector:this._injector})}_animationsDisabled(){return this._diAnimationsDisabled||this.animationDuration==="0ms"||this.animationDuration==="0s"}static \u0275fac=function(i){return new(i||t)};static \u0275cmp=(function(){let e=["content"];function i(o,a){}return H({type:t,selectors:[["mat-tab-body"]],viewQuery:function(a,r){if(a&1&&ot(GS,5)(e,5),a&2){let s;Y(s=Z())&&(r._portalHost=s.first),Y(s=Z())&&(r._contentElement=s.first)}},hostAttrs:[1,"mat-mdc-tab-body"],hostVars:1,hostBindings:function(a,r){a&2&&Q("inert",r._position==="center"?null:"")},inputs:{_content:[0,"content","_content"],animationDuration:"animationDuration",preserveContent:"preserveContent",position:"position"},outputs:{_onCentering:"_onCentering",_beforeCentering:"_beforeCentering",_onCentered:"_onCentered"},decls:3,vars:6,consts:[["content",""],["cdkScrollable","",1,"mat-mdc-tab-body-content"],["matTabBodyHost",""]],template:function(a,r){a&1&&(f(0,"div",1,0),tn(2,i,0,0,"ng-template",2),u()),a&2&&z("mat-tab-body-content-left",r._position==="left")("mat-tab-body-content-right",r._position==="right")("mat-tab-body-content-can-animate",r._position==="center"||r._previousPosition==="center")},dependencies:[GS,Qh],styles:[`.mat-mdc-tab-body {
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  position: absolute;
  display: block;
  overflow: hidden;
  outline: 0;
  flex-basis: 100%;
}
.mat-mdc-tab-body.mat-mdc-tab-body-active {
  position: relative;
  overflow-x: hidden;
  overflow-y: auto;
  z-index: 1;
  flex-grow: 1;
}
.mat-mdc-tab-group.mat-mdc-tab-group-dynamic-height .mat-mdc-tab-body.mat-mdc-tab-body-active {
  overflow-y: hidden;
}

.mat-mdc-tab-body-content {
  height: 100%;
  overflow: auto;
  transform: none;
  visibility: hidden;
}
.mat-tab-body-animating > .mat-mdc-tab-body-content, .mat-mdc-tab-body-active > .mat-mdc-tab-body-content {
  visibility: visible;
}
.mat-tab-body-animating > .mat-mdc-tab-body-content {
  min-height: 1px;
}
.mat-mdc-tab-group-dynamic-height .mat-mdc-tab-body-content {
  overflow: hidden;
}

.mat-tab-body-content-can-animate {
  transition: transform var(--%NS%mat-tab-body-animation-duration) 1ms cubic-bezier(0.35, 0, 0.25, 1);
}
.mat-mdc-tab-body-wrapper._mat-animation-noopable .mat-tab-body-content-can-animate {
  transition: none;
}

.mat-tab-body-content-left {
  transform: translate3d(-100%, 0, 0);
}

.mat-tab-body-content-right {
  transform: translate3d(100%, 0, 0);
}
`],encapsulation:2,changeDetection:1})})()}return t})(),ZS=(()=>{class t{_elementRef=p(q);_changeDetectorRef=p(He);_ngZone=p(X);_tabsSubscription=_e.EMPTY;_tabLabelSubscription=_e.EMPTY;_tabBodySubscription=_e.EMPTY;_diAnimationsDisabled=qe();_bodyAnimationDuration;_headerAnimationDuration;_allTabs;_tabBodies;_tabBodyWrapper;_tabHeader;_tabs=new Mn;_indexToSelect=0;_lastFocusedTabIndex=null;_tabBodyWrapperHeight=0;color;get fitInkBarToContent(){return this._fitInkBarToContent}set fitInkBarToContent(e){this._fitInkBarToContent=e,this._changeDetectorRef.markForCheck()}_fitInkBarToContent=!1;stretchTabs=!0;alignTabs=null;dynamicHeight=!1;get selectedIndex(){return this._selectedIndex}set selectedIndex(e){this._indexToSelect=isNaN(e)?null:e}_selectedIndex=null;headerPosition="above";get animationDuration(){return this._animationDuration}set animationDuration(e){this._animationDuration=e,e&&typeof e=="object"?(this._bodyAnimationDuration=Rg(e.body),this._headerAnimationDuration=Rg(e.header)):this._headerAnimationDuration=this._bodyAnimationDuration=Rg(e)}_animationDuration;get contentTabIndex(){return this._contentTabIndex}set contentTabIndex(e){this._contentTabIndex=isNaN(e)?null:e}_contentTabIndex=null;disablePagination=!1;disableRipple=!1;preserveContent=!1;get backgroundColor(){return this._backgroundColor}set backgroundColor(e){let i=this._elementRef.nativeElement.classList;i.remove("mat-tabs-with-background",`mat-background-${this.backgroundColor}`),e&&i.add("mat-tabs-with-background",`mat-background-${e}`),this._backgroundColor=e}_backgroundColor;ariaLabel;ariaLabelledby;selectedIndexChange=new K;focusChange=new K;animationDone=new K;selectedTabChange=new K(!0);_groupId;_isServer=!p(Pe).isBrowser;constructor(){let e=p(GA,{optional:!0});this._groupId=p(Qe).getId("mat-tab-group-"),this.animationDuration=e&&e.animationDuration?e.animationDuration:"500ms",this.disablePagination=e&&e.disablePagination!=null?e.disablePagination:!1,this.dynamicHeight=e&&e.dynamicHeight!=null?e.dynamicHeight:!1,e?.contentTabIndex!=null&&(this.contentTabIndex=e.contentTabIndex),this.preserveContent=!!e?.preserveContent,this.fitInkBarToContent=e&&e.fitInkBarToContent!=null?e.fitInkBarToContent:!1,this.stretchTabs=e&&e.stretchTabs!=null?e.stretchTabs:!0,this.alignTabs=e&&e.alignTabs!=null?e.alignTabs:null}ngAfterContentChecked(){let e=this._indexToSelect=this._clampTabIndex(this._indexToSelect);if(this._selectedIndex!=e){let i=this._selectedIndex==null;if(!i){this.selectedTabChange.emit(this._createChangeEvent(e));let o=this._tabBodyWrapper.nativeElement;o.style.minHeight=o.clientHeight+"px"}Promise.resolve().then(()=>{this._tabs.forEach((o,a)=>o.isActive=a===e),i||(this.selectedIndexChange.emit(e),this._tabBodyWrapper.nativeElement.style.minHeight="")})}this._tabs.forEach((i,o)=>{i.position=o-e,this._selectedIndex!=null&&i.position==0&&!i.origin&&(i.origin=e-this._selectedIndex)}),this._selectedIndex!==e&&(this._selectedIndex=e,this._lastFocusedTabIndex=null,this._changeDetectorRef.markForCheck())}ngAfterContentInit(){this._subscribeToAllTabChanges(),this._subscribeToTabLabels(),this._tabsSubscription=this._tabs.changes.subscribe(()=>{let e=this._clampTabIndex(this._indexToSelect);if(e===this._selectedIndex){let i=this._tabs.toArray(),o;for(let a=0;a<i.length;a++)if(i[a].isActive){this._indexToSelect=this._selectedIndex=a,this._lastFocusedTabIndex=null,o=i[a];break}!o&&i[e]&&Promise.resolve().then(()=>{i[e].isActive=!0,this.selectedTabChange.emit(this._createChangeEvent(e))})}this._changeDetectorRef.markForCheck()})}ngAfterViewInit(){this._tabBodySubscription=this._tabBodies.changes.subscribe(()=>this._bodyCentered(!0))}_subscribeToAllTabChanges(){this._allTabs.changes.pipe(st(this._allTabs)).subscribe(e=>{this._tabs.reset(e.filter(i=>i._closestTabGroup===this||!i._closestTabGroup)),this._tabs.notifyOnChanges()})}ngOnDestroy(){this._tabs.destroy(),this._tabsSubscription.unsubscribe(),this._tabLabelSubscription.unsubscribe(),this._tabBodySubscription.unsubscribe()}realignInkBar(){this._tabHeader&&this._tabHeader._alignInkBarToSelectedTab()}updatePagination(){this._tabHeader&&this._tabHeader.updatePagination()}focusTab(e){let i=this._tabHeader;i&&(i.focusIndex=e)}_focusChanged(e){this._lastFocusedTabIndex=e,this.focusChange.emit(this._createChangeEvent(e))}_createChangeEvent(e){let i=new Lg;return i.index=e,this._tabs&&this._tabs.length&&(i.tab=this._tabs.toArray()[e]),i}_subscribeToTabLabels(){this._tabLabelSubscription&&this._tabLabelSubscription.unsubscribe(),this._tabLabelSubscription=bt(...this._tabs.map(e=>e._stateChanges)).subscribe(()=>this._changeDetectorRef.markForCheck())}_clampTabIndex(e){return Math.min(this._tabs.length-1,Math.max(e||0,0))}_getTabLabelId(e,i){return e.id||`${this._groupId}-label-${i}`}_getTabContentId(e){return`${this._groupId}-content-${e}`}_setTabBodyWrapperHeight(e){if(!this.dynamicHeight||!this._tabBodyWrapperHeight){this._tabBodyWrapperHeight=e;return}let i=this._tabBodyWrapper.nativeElement;i.style.height=this._tabBodyWrapperHeight+"px",this._tabBodyWrapper.nativeElement.offsetHeight&&(i.style.height=e+"px")}_removeTabBodyWrapperHeight(){let e=this._tabBodyWrapper.nativeElement;this._tabBodyWrapperHeight=e.clientHeight,e.style.height="",this._ngZone.run(()=>this.animationDone.emit())}_handleClick(e,i,o){i.focusIndex=o,e.disabled||(this.selectedIndex=o)}_getTabIndex(e){let i=this._lastFocusedTabIndex??this.selectedIndex;return e===i?0:-1}_tabFocusChanged(e,i){e&&e!=="mouse"&&e!=="touch"&&(this._tabHeader.focusIndex=i)}_bodyCentered(e){e&&this._tabBodies?.forEach((i,o)=>i._setActiveClass(o===this._selectedIndex))}_bodyAnimationsDisabled(){return this._diAnimationsDisabled||this._bodyAnimationDuration==="0"||this._bodyAnimationDuration==="0ms"}static \u0275fac=function(i){return new(i||t)};static \u0275cmp=(function(){let e=["tabBodyWrapper"],i=["tabHeader"],o=["*"];function a(m,v){}function r(m,v){if(m&1&&tn(0,a,0,0,"ng-template",12),m&2){let g=x().$implicit;R("cdkPortalOutlet",g.templateLabel)}}function s(m,v){if(m&1&&b(0),m&2){let g=x().$implicit;S(g.textLabel)}}function c(m,v){if(m&1){let g=We();f(0,"div",7,2),V("click",function(){let _=De(g),C=_.$implicit,w=_.$index,E=x(),U=nn(1);return Me(E._handleClick(C,U,w))})("cdkFocusChange",function(_){let C=De(g).$index,w=x();return Me(w._tabFocusChanged(_,C))}),A(2,"span",8)(3,"div",9),f(4,"span",10)(5,"span",11),k(6,r,1,1,null,12)(7,s,1,1),u()()()}if(m&2){let g=v.$implicit,y=v.$index,_=nn(1),C=x();Ke(g.labelClass),z("mdc-tab--active",C.selectedIndex===y),R("id",C._getTabLabelId(g,y))("disabled",g.disabled)("fitInkBarToContent",C.fitInkBarToContent),Q("tabIndex",C._getTabIndex(y))("aria-posinset",y+1)("aria-setsize",C._tabs.length)("aria-controls",C._getTabContentId(y))("aria-selected",C.selectedIndex===y)("aria-label",g.ariaLabel||null)("aria-labelledby",!g.ariaLabel&&g.ariaLabelledby?g.ariaLabelledby:null),h(3),R("matRippleTrigger",_)("matRippleDisabled",g.disabled||C.disableRipple),h(3),N(g.templateLabel?6:7)}}function d(m,v){m&1&&oe(0)}function l(m,v){if(m&1){let g=We();f(0,"mat-tab-body",13),V("_onCentered",function(){De(g);let _=x();return Me(_._removeTabBodyWrapperHeight())})("_onCentering",function(_){De(g);let C=x();return Me(C._setTabBodyWrapperHeight(_))})("_beforeCentering",function(_){De(g);let C=x();return Me(C._bodyCentered(_))}),u()}if(m&2){let g=v.$implicit,y=v.$index,_=x();Ke(g.bodyClass),R("id",_._getTabContentId(y))("content",g.content)("position",g.position)("animationDuration",_._bodyAnimationDuration)("preserveContent",_.preserveContent),Q("tabindex",_.contentTabIndex!=null&&_.selectedIndex===y?_.contentTabIndex:null)("aria-labelledby",_._getTabLabelId(g,y))("aria-hidden",_.selectedIndex!==y)}}return H({type:t,selectors:[["mat-tab-group"]],contentQueries:function(v,g,y){if(v&1&&Mt(y,jg,5),v&2){let _;Y(_=Z())&&(g._allTabs=_)}},viewQuery:function(v,g){if(v&1&&ot(e,5)(i,5)(Fg,5),v&2){let y;Y(y=Z())&&(g._tabBodyWrapper=y.first),Y(y=Z())&&(g._tabHeader=y.first),Y(y=Z())&&(g._tabBodies=y)}},hostAttrs:[1,"mat-mdc-tab-group"],hostVars:13,hostBindings:function(v,g){v&2&&(Q("mat-align-tabs",g.alignTabs),Ke("mat-"+(g.color||"primary")),we("--%NS%mat-tab-body-animation-duration",g._bodyAnimationDuration)("--%NS%mat-tab-header-animation-duration",g._headerAnimationDuration),z("mat-mdc-tab-group-dynamic-height",g.dynamicHeight)("mat-mdc-tab-group-inverted-header",g.headerPosition==="below")("mat-mdc-tab-group-stretch-tabs",g.stretchTabs))},inputs:{color:"color",fitInkBarToContent:[2,"fitInkBarToContent","fitInkBarToContent",O],stretchTabs:[2,"mat-stretch-tabs","stretchTabs",O],alignTabs:[0,"mat-align-tabs","alignTabs"],dynamicHeight:[2,"dynamicHeight","dynamicHeight",O],selectedIndex:[2,"selectedIndex","selectedIndex",on],headerPosition:"headerPosition",animationDuration:"animationDuration",contentTabIndex:[2,"contentTabIndex","contentTabIndex",on],disablePagination:[2,"disablePagination","disablePagination",O],disableRipple:[2,"disableRipple","disableRipple",O],preserveContent:[2,"preserveContent","preserveContent",O],backgroundColor:"backgroundColor",ariaLabel:[0,"aria-label","ariaLabel"],ariaLabelledby:[0,"aria-labelledby","ariaLabelledby"]},outputs:{selectedIndexChange:"selectedIndexChange",focusChange:"focusChange",animationDone:"animationDone",selectedTabChange:"selectedTabChange"},exportAs:["matTabGroup"],features:[ze([{provide:qS,useExisting:t}])],ngContentSelectors:o,decls:9,vars:8,consts:[["tabHeader",""],["tabBodyWrapper",""],["tabNode",""],[3,"indexFocused","selectFocusedIndex","selectedIndex","disableRipple","disablePagination","aria-label","aria-labelledby"],["role","tab","matTabLabelWrapper","","cdkMonitorElementFocus","",1,"mdc-tab","mat-mdc-tab","mat-focus-indicator",3,"id","mdc-tab--active","class","disabled","fitInkBarToContent"],[1,"mat-mdc-tab-body-wrapper"],["role","tabpanel",3,"id","class","content","position","animationDuration","preserveContent"],["role","tab","matTabLabelWrapper","","cdkMonitorElementFocus","",1,"mdc-tab","mat-mdc-tab","mat-focus-indicator",3,"click","cdkFocusChange","id","disabled","fitInkBarToContent"],[1,"mdc-tab__ripple"],["mat-ripple","",1,"mat-mdc-tab-ripple",3,"matRippleTrigger","matRippleDisabled"],[1,"mdc-tab__content"],[1,"mdc-tab__text-label"],[3,"cdkPortalOutlet"],["role","tabpanel",3,"_onCentered","_onCentering","_beforeCentering","id","content","position","animationDuration","preserveContent"]],template:function(v,g){v&1&&(Be(),f(0,"mat-tab-header",3,0),V("indexFocused",function(_){return g._focusChanged(_)})("selectFocusedIndex",function(_){return g.selectedIndex=_}),xe(2,c,8,17,"div",4,_i),u(),k(4,d,1,0),f(5,"div",5,1),xe(7,l,1,10,"mat-tab-body",6,_i),u()),v&2&&(R("selectedIndex",g.selectedIndex||0)("disableRipple",g.disableRipple)("disablePagination",g.disablePagination),Id("aria-label",g.ariaLabel)("aria-labelledby",g.ariaLabelledby),h(2),Ce(g._tabs),h(2),N(g._isServer?4:-1),h(),z("_mat-animation-noopable",g._bodyAnimationsDisabled()),h(2),Ce(g._tabs))},dependencies:[UA,YS,Bh,ai,Ao,Fg],styles:[`.mdc-tab {
  min-width: 90px;
  padding: 0 24px;
  display: flex;
  flex: 1 0 auto;
  justify-content: center;
  box-sizing: border-box;
  border: none;
  outline: none;
  text-align: center;
  white-space: nowrap;
  cursor: pointer;
  z-index: 1;
  touch-action: manipulation;
}

.mdc-tab__content {
  display: flex;
  align-items: center;
  justify-content: center;
  height: inherit;
  pointer-events: none;
}

.mdc-tab__text-label {
  transition: 150ms color linear;
  display: inline-block;
  line-height: 1;
  z-index: 2;
}

.mdc-tab--active .mdc-tab__text-label {
  transition-delay: 100ms;
}

._mat-animation-noopable .mdc-tab__text-label {
  transition: none;
}

.mdc-tab-indicator {
  display: flex;
  position: absolute;
  top: 0;
  left: 0;
  justify-content: center;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
}

.mdc-tab-indicator__content {
  transition: var(--%NS%mat-tab-header-animation-duration, 250ms) transform cubic-bezier(0.4, 0, 0.2, 1);
  transform-origin: left;
  opacity: 0;
}

.mdc-tab-indicator__content--underline {
  align-self: flex-end;
  box-sizing: border-box;
  width: 100%;
  border-top-style: solid;
}

.mdc-tab-indicator--active .mdc-tab-indicator__content {
  opacity: 1;
}

._mat-animation-noopable .mdc-tab-indicator__content, .mdc-tab-indicator--no-transition .mdc-tab-indicator__content {
  transition: none;
}

.mat-mdc-tab-ripple.mat-mdc-tab-ripple {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  pointer-events: none;
}

.mat-mdc-tab {
  -webkit-tap-highlight-color: transparent;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-decoration: none;
  background: none;
  height: var(--%NS%mat-tab-container-height, 48px);
  font-family: var(--%NS%mat-tab-label-text-font, var(--%NS%mat-sys-title-small-font));
  font-size: var(--%NS%mat-tab-label-text-size, var(--%NS%mat-sys-title-small-size));
  letter-spacing: var(--%NS%mat-tab-label-text-tracking, var(--%NS%mat-sys-title-small-tracking));
  line-height: var(--%NS%mat-tab-label-text-line-height, var(--%NS%mat-sys-title-small-line-height));
  font-weight: var(--%NS%mat-tab-label-text-weight, var(--%NS%mat-sys-title-small-weight));
}
.mat-mdc-tab.mdc-tab {
  flex-grow: 0;
}
.mat-mdc-tab .mdc-tab-indicator__content--underline {
  border-color: var(--%NS%mat-tab-active-indicator-color, var(--%NS%mat-sys-primary));
  border-top-width: var(--%NS%mat-tab-active-indicator-height, 2px);
  border-radius: var(--%NS%mat-tab-active-indicator-shape, 0);
}
.mat-mdc-tab:hover .mdc-tab__text-label {
  color: var(--%NS%mat-tab-inactive-hover-label-text-color, var(--%NS%mat-sys-on-surface));
}
.mat-mdc-tab:focus .mdc-tab__text-label {
  color: var(--%NS%mat-tab-inactive-focus-label-text-color, var(--%NS%mat-sys-on-surface));
}
.mat-mdc-tab.mdc-tab--active .mdc-tab__text-label {
  color: var(--%NS%mat-tab-active-label-text-color, var(--%NS%mat-sys-on-surface));
}
.mat-mdc-tab.mdc-tab--active .mdc-tab__ripple::before,
.mat-mdc-tab.mdc-tab--active .mat-ripple-element {
  background-color: var(--%NS%mat-tab-active-ripple-color, var(--%NS%mat-sys-on-surface));
}
.mat-mdc-tab.mdc-tab--%NS%active:hover .mdc-tab__text-label {
  color: var(--%NS%mat-tab-active-hover-label-text-color, var(--%NS%mat-sys-on-surface));
}
.mat-mdc-tab.mdc-tab--%NS%active:hover .mdc-tab-indicator__content--underline {
  border-color: var(--%NS%mat-tab-active-hover-indicator-color, var(--%NS%mat-sys-primary));
}
.mat-mdc-tab.mdc-tab--%NS%active:focus .mdc-tab__text-label {
  color: var(--%NS%mat-tab-active-focus-label-text-color, var(--%NS%mat-sys-on-surface));
}
.mat-mdc-tab.mdc-tab--%NS%active:focus .mdc-tab-indicator__content--underline {
  border-color: var(--%NS%mat-tab-active-focus-indicator-color, var(--%NS%mat-sys-primary));
}
.mat-mdc-tab.mat-mdc-tab-disabled {
  opacity: 0.4;
  pointer-events: none;
}
.mat-mdc-tab.mat-mdc-tab-disabled .mdc-tab__content {
  pointer-events: none;
}
.mat-mdc-tab.mat-mdc-tab-disabled .mdc-tab__ripple::before,
.mat-mdc-tab.mat-mdc-tab-disabled .mat-ripple-element {
  background-color: var(--%NS%mat-tab-disabled-ripple-color, var(--%NS%mat-sys-on-surface-variant));
}
.mat-mdc-tab .mdc-tab__ripple::before {
  content: "";
  display: block;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  opacity: 0;
  pointer-events: none;
  background-color: var(--%NS%mat-tab-inactive-ripple-color, var(--%NS%mat-sys-on-surface));
}
.mat-mdc-tab .mdc-tab__text-label {
  color: var(--%NS%mat-tab-inactive-label-text-color, var(--%NS%mat-sys-on-surface));
  display: inline-flex;
  align-items: center;
}
.mat-mdc-tab .mdc-tab__content {
  position: relative;
  pointer-events: auto;
}
.mat-mdc-tab:hover .mdc-tab__ripple::before {
  opacity: 0.04;
}
.mat-mdc-tab.cdk-program-focused .mdc-tab__ripple::before, .mat-mdc-tab.cdk-keyboard-focused .mdc-tab__ripple::before {
  opacity: 0.12;
}
.mat-mdc-tab .mat-ripple-element {
  opacity: 0.12;
  background-color: var(--%NS%mat-tab-inactive-ripple-color, var(--%NS%mat-sys-on-surface));
}
.mat-mdc-tab-group.mat-mdc-tab-group-stretch-tabs > .mat-mdc-tab-header .mat-mdc-tab {
  flex-grow: 1;
}

.mat-mdc-tab-group {
  display: flex;
  flex-direction: column;
  max-width: 100%;
}
.mat-mdc-tab-group.mat-tabs-with-background > .mat-mdc-tab-header, .mat-mdc-tab-group.mat-tabs-with-background > .mat-mdc-tab-header-pagination {
  background-color: var(--%NS%mat-tab-background-color);
}
.mat-mdc-tab-group.mat-tabs-with-background.mat-primary > .mat-mdc-tab-header .mat-mdc-tab .mdc-tab__text-label {
  color: var(--%NS%mat-tab-foreground-color);
}
.mat-mdc-tab-group.mat-tabs-with-background.mat-primary > .mat-mdc-tab-header .mdc-tab-indicator__content--underline {
  border-color: var(--%NS%mat-tab-foreground-color);
}
.mat-mdc-tab-group.mat-tabs-with-background:not(.mat-primary) > .mat-mdc-tab-header .mat-mdc-tab:not(.mdc-tab--active) .mdc-tab__text-label {
  color: var(--%NS%mat-tab-foreground-color);
}
.mat-mdc-tab-group.mat-tabs-with-background:not(.mat-primary) > .mat-mdc-tab-header .mat-mdc-tab:not(.mdc-tab--active) .mdc-tab-indicator__content--underline {
  border-color: var(--%NS%mat-tab-foreground-color);
}
.mat-mdc-tab-group.mat-tabs-with-background > .mat-mdc-tab-header .mat-mdc-tab-header-pagination-chevron,
.mat-mdc-tab-group.mat-tabs-with-background > .mat-mdc-tab-header .mat-focus-indicator::before, .mat-mdc-tab-group.mat-tabs-with-background > .mat-mdc-tab-header-pagination .mat-mdc-tab-header-pagination-chevron,
.mat-mdc-tab-group.mat-tabs-with-background > .mat-mdc-tab-header-pagination .mat-focus-indicator::before {
  border-color: var(--%NS%mat-tab-foreground-color);
}
.mat-mdc-tab-group.mat-tabs-with-background > .mat-mdc-tab-header .mat-ripple-element, .mat-mdc-tab-group.mat-tabs-with-background > .mat-mdc-tab-header .mdc-tab__ripple::before, .mat-mdc-tab-group.mat-tabs-with-background > .mat-mdc-tab-header-pagination .mat-ripple-element, .mat-mdc-tab-group.mat-tabs-with-background > .mat-mdc-tab-header-pagination .mdc-tab__ripple::before {
  background-color: var(--%NS%mat-tab-foreground-color);
}
.mat-mdc-tab-group.mat-tabs-with-background > .mat-mdc-tab-header .mat-mdc-tab-header-pagination-chevron, .mat-mdc-tab-group.mat-tabs-with-background > .mat-mdc-tab-header-pagination .mat-mdc-tab-header-pagination-chevron {
  color: var(--%NS%mat-tab-foreground-color);
}
.mat-mdc-tab-group.mat-mdc-tab-group-inverted-header {
  flex-direction: column-reverse;
}
.mat-mdc-tab-group.mat-mdc-tab-group-inverted-header .mdc-tab-indicator__content--underline {
  align-self: flex-start;
}

.mat-mdc-tab-body-wrapper {
  position: relative;
  overflow: hidden;
  display: flex;
  transition: height 500ms cubic-bezier(0.35, 0, 0.25, 1);
}
.mat-mdc-tab-body-wrapper._mat-animation-noopable {
  transition: none !important;
  animation: none !important;
}
`],encapsulation:2,changeDetection:1})})()}return t})(),Lg=class{index;tab};var KS=(()=>{class t{static \u0275fac=function(i){return new(i||t)};static \u0275mod=le({type:t});static \u0275inj=se({imports:[Ne]})}return t})();var qA=(()=>{class t{static \u0275fac=function(i){return new(i||t)};static \u0275dir=ee({type:t,selectors:[["mat-toolbar-row"]],hostAttrs:[1,"mat-toolbar-row"],exportAs:["matToolbarRow"]})}return t})(),XS=(()=>{class t{_elementRef=p(q);_platform=p(Pe);_document=p(ae);color;_toolbarRows;ngAfterViewInit(){this._platform.isBrowser&&(this._checkToolbarMixedModes(),this._toolbarRows.changes.subscribe(()=>this._checkToolbarMixedModes()))}_checkToolbarMixedModes(){this._toolbarRows.length}static \u0275fac=function(i){return new(i||t)};static \u0275cmp=(function(){let e=["*",[["mat-toolbar-row"]]];return H({type:t,selectors:[["mat-toolbar"]],contentQueries:function(a,r,s){if(a&1&&Mt(s,qA,5),a&2){let c;Y(c=Z())&&(r._toolbarRows=c)}},hostAttrs:[1,"mat-toolbar"],hostVars:6,hostBindings:function(a,r){a&2&&(Ke(r.color?"mat-"+r.color:""),z("mat-toolbar-multiple-rows",r._toolbarRows.length>0)("mat-toolbar-single-row",r._toolbarRows.length===0))},inputs:{color:"color"},exportAs:["matToolbar"],ngContentSelectors:["*","mat-toolbar-row"],decls:2,vars:0,template:function(a,r){a&1&&(Be(e),oe(0),oe(1,1))},styles:[`.mat-toolbar {
  background: var(--%NS%mat-toolbar-container-background-color, var(--%NS%mat-sys-surface));
  color: var(--%NS%mat-toolbar-container-text-color, var(--%NS%mat-sys-on-surface));
}
.mat-toolbar, .mat-toolbar h1, .mat-toolbar h2, .mat-toolbar h3, .mat-toolbar h4, .mat-toolbar h5, .mat-toolbar h6 {
  font-family: var(--%NS%mat-toolbar-title-text-font, var(--%NS%mat-sys-title-large-font));
  font-size: var(--%NS%mat-toolbar-title-text-size, var(--%NS%mat-sys-title-large-size));
  line-height: var(--%NS%mat-toolbar-title-text-line-height, var(--%NS%mat-sys-title-large-line-height));
  font-weight: var(--%NS%mat-toolbar-title-text-weight, var(--%NS%mat-sys-title-large-weight));
  letter-spacing: var(--%NS%mat-toolbar-title-text-tracking, var(--%NS%mat-sys-title-large-tracking));
  margin: 0;
}
@media (forced-colors: active) {
  .mat-toolbar {
    outline: solid 1px;
  }
}
.mat-toolbar .mat-form-field-underline,
.mat-toolbar .mat-form-field-ripple,
.mat-toolbar .mat-focused .mat-form-field-ripple {
  background-color: currentColor;
}
.mat-toolbar .mat-form-field-label,
.mat-toolbar .mat-focused .mat-form-field-label,
.mat-toolbar .mat-select-value,
.mat-toolbar .mat-select-arrow,
.mat-toolbar .mat-form-field.mat-focused .mat-select-arrow {
  color: inherit;
}
.mat-toolbar .mat-input-element {
  caret-color: currentColor;
}
.mat-toolbar .mat-mdc-button-base.mat-mdc-button-base.mat-unthemed {
  --%NS%mat-button-text-label-text-color: var(--%NS%mat-toolbar-container-text-color, var(--%NS%mat-sys-on-surface));
  --%NS%mat-button-outlined-label-text-color: var(--%NS%mat-toolbar-container-text-color, var(--%NS%mat-sys-on-surface));
}

.mat-toolbar-row, .mat-toolbar-single-row {
  display: flex;
  box-sizing: border-box;
  padding: 0 16px;
  width: 100%;
  flex-direction: row;
  align-items: center;
  white-space: nowrap;
  height: var(--%NS%mat-toolbar-standard-height, 64px);
}
@media (max-width: 599px) {
  .mat-toolbar-row, .mat-toolbar-single-row {
    height: var(--%NS%mat-toolbar-mobile-height, 56px);
  }
}

.mat-toolbar-multiple-rows {
  display: flex;
  box-sizing: border-box;
  flex-direction: column;
  width: 100%;
  min-height: var(--%NS%mat-toolbar-standard-height, 64px);
}
@media (max-width: 599px) {
  .mat-toolbar-multiple-rows {
    min-height: var(--%NS%mat-toolbar-mobile-height, 56px);
  }
}
`],encapsulation:2})})()}return t})();var QS=(()=>{class t{static \u0275fac=function(i){return new(i||t)};static \u0275mod=le({type:t});static \u0275inj=se({imports:[Ne]})}return t})();var ZA=20;var KA=new D("mat-tooltip-scroll-strategy",{providedIn:"root",factory:()=>{let t=p(ie);return()=>ci(t,{scrollThrottle:ZA})}}),XA=new D("mat-tooltip-default-options",{providedIn:"root",factory:()=>({showDelay:0,hideDelay:0,touchendHideDelay:1500})});var JS="tooltip-panel",QA={passive:!0},JA=8,eO=8,tO=24,nO=200,oo=(()=>{class t{_elementRef=p(q);_ngZone=p(X);_platform=p(Pe);_ariaDescriber=p(Wh);_focusMonitor=p(un);_dir=p(ft);_injector=p(ie);_viewContainerRef=p(Bt);_mediaMatcher=p(wr);_document=p(ae);_renderer=p(Ue);_animationsDisabled=qe();_defaultOptions=p(XA,{optional:!0});_overlayRef=null;_tooltipInstance=null;_overlayPanelClass;_portal;_position="below";_positionAtOrigin=!1;_disabled=!1;_tooltipClass;_viewInitialized=!1;_pointerExitEventsInitialized=!1;_tooltipComponent=ew;_viewportMargin=8;_currentPosition;_cssClassPrefix="mat-mdc";_ariaDescriptionPending=!1;_dirSubscribed=!1;get position(){return this._position}set position(e){e!==this._position&&(this._position=e,this._overlayRef&&(this._updatePosition(this._overlayRef),this._tooltipInstance?.show(0),this._overlayRef.updatePosition()))}get positionAtOrigin(){return this._positionAtOrigin}set positionAtOrigin(e){this._positionAtOrigin=Ji(e),this._detach(),this._overlayRef=null}get disabled(){return this._disabled}set disabled(e){let i=Ji(e);this._disabled!==i&&(this._disabled=i,i?this.hide(0):this._setupPointerEnterEventsIfNeeded(),this._syncAriaDescription(this.message))}get showDelay(){return this._showDelay}set showDelay(e){this._showDelay=ii(e)}_showDelay;get hideDelay(){return this._hideDelay}set hideDelay(e){this._hideDelay=ii(e),this._tooltipInstance&&(this._tooltipInstance._mouseLeaveHideDelay=this._hideDelay)}_hideDelay;touchGestures="auto";get message(){return this._message}set message(e){let i=this._message;this._message=e!=null?String(e).trim():"",!this._message&&this._isTooltipVisible()?this.hide(0):(this._setupPointerEnterEventsIfNeeded(),this._updateTooltipMessage()),this._syncAriaDescription(i)}_message="";get tooltipClass(){return this._tooltipClass}set tooltipClass(e){this._tooltipClass=e,this._tooltipInstance&&this._setTooltipClass(this._tooltipClass)}_eventCleanups=[];_touchstartTimeout=null;_destroyed=new B;_isDestroyed=!1;constructor(){let e=this._defaultOptions;e&&(this._showDelay=e.showDelay,this._hideDelay=e.hideDelay,e.position&&(this.position=e.position),e.positionAtOrigin&&(this.positionAtOrigin=e.positionAtOrigin),e.touchGestures&&(this.touchGestures=e.touchGestures),e.tooltipClass&&(this.tooltipClass=e.tooltipClass)),this._viewportMargin=JA}ngAfterViewInit(){this._viewInitialized=!0,this._setupPointerEnterEventsIfNeeded(),this._focusMonitor.monitor(this._elementRef).pipe(Re(this._destroyed)).subscribe(e=>{e?e==="keyboard"&&this._ngZone.run(()=>this.show()):this._ngZone.run(()=>this.hide(0))})}ngOnDestroy(){let e=this._elementRef.nativeElement;this._touchstartTimeout&&clearTimeout(this._touchstartTimeout),this._overlayRef&&(this._overlayRef.dispose(),this._tooltipInstance=null),this._eventCleanups.forEach(i=>i()),this._eventCleanups.length=0,this._destroyed.next(),this._destroyed.complete(),this._isDestroyed=!0,this._ariaDescriber.removeDescription(e,this.message,"tooltip"),this._focusMonitor.stopMonitoring(e)}show(e=this.showDelay,i){if(this.disabled||!this.message||this._isTooltipVisible()){this._tooltipInstance?._cancelPendingAnimations();return}let o=this._createOverlay(i);this._detach(),this._portal=this._portal||new To(this._tooltipComponent,this._viewContainerRef);let a=this._tooltipInstance=o.attach(this._portal).instance;a._triggerElement=this._elementRef.nativeElement,a._mouseLeaveHideDelay=this._hideDelay,a.afterHidden().pipe(Re(this._destroyed)).subscribe(()=>this._detach()),this._setTooltipClass(this._tooltipClass),this._updateTooltipMessage(),a.show(e)}hide(e=this.hideDelay){let i=this._tooltipInstance;i&&(i.isVisible()?i.hide(e):(i._cancelPendingAnimations(),this._detach()))}toggle(e){this._isTooltipVisible()?this.hide():this.show(void 0,e)}_isTooltipVisible(){return!!this._tooltipInstance&&this._tooltipInstance.isVisible()}_createOverlay(e){if(this._overlayRef){let r=this._overlayRef.getConfig().positionStrategy;if((!this.positionAtOrigin||!e)&&r._origin instanceof q)return this._overlayRef;this._detach()}let i=this._injector.get(No).getAncestorScrollContainers(this._elementRef),o=`${this._cssClassPrefix}-${JS}`,a=eo(this._injector,this.positionAtOrigin?e||this._elementRef:this._elementRef).withTransformOriginOn(`.${this._cssClassPrefix}-tooltip`).withFlexibleDimensions(!1).withViewportMargin(this._viewportMargin).withScrollableContainers(i).withPopoverLocation("global");return a.positionChanges.pipe(Re(this._destroyed)).subscribe(r=>{this._updateCurrentPositionClass(r.connectionPair),this._tooltipInstance&&r.scrollableViewProperties.isOverlayClipped&&this._tooltipInstance.isVisible()&&this._ngZone.run(()=>this.hide(0))}),this._overlayRef=li(this._injector,{direction:this._dir,positionStrategy:a,panelClass:this._overlayPanelClass?[...this._overlayPanelClass,o]:o,scrollStrategy:this._injector.get(KA)(),disableAnimations:this._animationsDisabled,eventPredicate:this._overlayEventPredicate}),this._updatePosition(this._overlayRef),this._overlayRef.detachments().pipe(Re(this._destroyed)).subscribe(()=>this._detach()),this._overlayRef.outsidePointerEvents().pipe(Re(this._destroyed)).subscribe(()=>this._tooltipInstance?._handleBodyInteraction()),this._overlayRef.keydownEvents().pipe(Re(this._destroyed)).subscribe(r=>{r.preventDefault(),r.stopPropagation(),this._ngZone.run(()=>this.hide(0))}),this._defaultOptions?.disableTooltipInteractivity&&this._overlayRef.addPanelClass(`${this._cssClassPrefix}-tooltip-panel-non-interactive`),this._dirSubscribed||(this._dirSubscribed=!0,this._dir.change.pipe(Re(this._destroyed)).subscribe(()=>{this._overlayRef&&this._updatePosition(this._overlayRef)})),this._overlayRef}_detach(){this._overlayRef&&this._overlayRef.hasAttached()&&this._overlayRef.detach(),this._tooltipInstance=null}_updatePosition(e){let i=e.getConfig().positionStrategy,o=this._getOrigin(),a=this._getOverlayPosition();i.withPositions([this._addOffset(I(I({},o.main),a.main)),this._addOffset(I(I({},o.fallback),a.fallback))])}_addOffset(e){let i=eO,o=!this._dir||this._dir.value=="ltr";return e.originY==="top"?e.offsetY=-i:e.originY==="bottom"?e.offsetY=i:e.originX==="start"?e.offsetX=o?-i:i:e.originX==="end"&&(e.offsetX=o?i:-i),e}_getOrigin(){let e=!this._dir||this._dir.value=="ltr",i=this.position,o;i=="above"||i=="below"?o={originX:"center",originY:i=="above"?"top":"bottom"}:i=="before"||i=="left"&&e||i=="right"&&!e?o={originX:"start",originY:"center"}:(i=="after"||i=="right"&&e||i=="left"&&!e)&&(o={originX:"end",originY:"center"});let{x:a,y:r}=this._invertPosition(o.originX,o.originY);return{main:o,fallback:{originX:a,originY:r}}}_getOverlayPosition(){let e=!this._dir||this._dir.value=="ltr",i=this.position,o;i=="above"?o={overlayX:"center",overlayY:"bottom"}:i=="below"?o={overlayX:"center",overlayY:"top"}:i=="before"||i=="left"&&e||i=="right"&&!e?o={overlayX:"end",overlayY:"center"}:(i=="after"||i=="right"&&e||i=="left"&&!e)&&(o={overlayX:"start",overlayY:"center"});let{x:a,y:r}=this._invertPosition(o.overlayX,o.overlayY);return{main:o,fallback:{overlayX:a,overlayY:r}}}_updateTooltipMessage(){this._tooltipInstance&&(this._tooltipInstance.message=this.message,this._tooltipInstance._markForCheck(),Et(()=>{this._tooltipInstance&&this._overlayRef.updatePosition()},{injector:this._injector}))}_setTooltipClass(e){this._tooltipInstance&&(this._tooltipInstance.tooltipClass=e instanceof Set?Array.from(e):e,this._tooltipInstance._markForCheck())}_invertPosition(e,i){return this.position==="above"||this.position==="below"?i==="top"?i="bottom":i==="bottom"&&(i="top"):e==="end"?e="start":e==="start"&&(e="end"),{x:e,y:i}}_updateCurrentPositionClass(e){let{overlayY:i,originX:o,originY:a}=e,r;if(i==="center"?this._dir&&this._dir.value==="rtl"?r=o==="end"?"left":"right":r=o==="start"?"left":"right":r=i==="bottom"&&a==="top"?"above":"below",r!==this._currentPosition){let s=this._overlayRef;if(s){let c=`${this._cssClassPrefix}-${JS}-`;s.removePanelClass(c+this._currentPosition),s.addPanelClass(c+r)}this._currentPosition=r}}_setupPointerEnterEventsIfNeeded(){this._disabled||!this.message||!this._viewInitialized||this._eventCleanups.length||(this._isTouchPlatform()?this.touchGestures!=="off"&&(this._disableNativeGesturesIfNecessary(),this._addListener("touchstart",e=>{let i=e.targetTouches?.[0],o=i?{x:i.clientX,y:i.clientY}:void 0;this._setupPointerExitEventsIfNeeded(),this._touchstartTimeout&&clearTimeout(this._touchstartTimeout);let a=500;this._touchstartTimeout=setTimeout(()=>{this._touchstartTimeout=null,this.show(void 0,o)},this._defaultOptions?.touchLongPressShowDelay??a)})):this._addListener("mouseenter",e=>{this._setupPointerExitEventsIfNeeded();let i;e.x!==void 0&&e.y!==void 0&&(i=e),this.show(void 0,i)}))}_setupPointerExitEventsIfNeeded(){if(!this._pointerExitEventsInitialized){if(this._pointerExitEventsInitialized=!0,!this._isTouchPlatform())this._addListener("mouseleave",e=>{let i=e.relatedTarget;(!i||!this._overlayRef?.overlayElement.contains(i))&&this.hide()}),this._addListener("wheel",e=>{if(this._isTooltipVisible()){let i=this._document.elementFromPoint(e.clientX,e.clientY),o=this._elementRef.nativeElement;i!==o&&!o.contains(i)&&this.hide()}});else if(this.touchGestures!=="off"){this._disableNativeGesturesIfNecessary();let e=()=>{this._touchstartTimeout&&clearTimeout(this._touchstartTimeout),this.hide(this._defaultOptions?.touchendHideDelay)};this._addListener("touchend",e),this._addListener("touchcancel",e)}}}_addListener(e,i){this._eventCleanups.push(this._renderer.listen(this._elementRef.nativeElement,e,i,QA))}_isTouchPlatform(){let e=this._defaultOptions?.detectHoverCapability;return typeof e=="function"?!e():this._platform.IOS||this._platform.ANDROID?!0:this._platform.isBrowser?!!e&&this._mediaMatcher.matchMedia("(any-hover: none)").matches:!1}_disableNativeGesturesIfNecessary(){let e=this.touchGestures;if(e!=="off"){let i=this._elementRef.nativeElement,o=i.style;(e==="on"||i.nodeName!=="INPUT"&&i.nodeName!=="TEXTAREA")&&(o.userSelect=o.msUserSelect=o.webkitUserSelect=o.MozUserSelect="none"),(e==="on"||!i.draggable)&&(o.webkitUserDrag="none"),o.touchAction="none",o.webkitTapHighlightColor="transparent"}}_syncAriaDescription(e){this._ariaDescriptionPending||(this._ariaDescriptionPending=!0,this._ariaDescriber.removeDescription(this._elementRef.nativeElement,e,"tooltip"),this._isDestroyed||Et({write:()=>{this._ariaDescriptionPending=!1,this.message&&!this.disabled&&this._ariaDescriber.describe(this._elementRef.nativeElement,this.message,"tooltip")}},{injector:this._injector}))}_overlayEventPredicate=e=>e.type==="keydown"?this._isTooltipVisible()&&e.keyCode===27&&!pt(e):!0;static \u0275fac=function(i){return new(i||t)};static \u0275dir=ee({type:t,selectors:[["","matTooltip",""]],hostAttrs:[1,"mat-mdc-tooltip-trigger"],hostVars:2,hostBindings:function(i,o){i&2&&z("mat-mdc-tooltip-disabled",o.disabled)},inputs:{position:[0,"matTooltipPosition","position"],positionAtOrigin:[0,"matTooltipPositionAtOrigin","positionAtOrigin"],disabled:[0,"matTooltipDisabled","disabled"],showDelay:[0,"matTooltipShowDelay","showDelay"],hideDelay:[0,"matTooltipHideDelay","hideDelay"],touchGestures:[0,"matTooltipTouchGestures","touchGestures"],message:[0,"matTooltip","message"],tooltipClass:[0,"matTooltipClass","tooltipClass"]},exportAs:["matTooltip"]})}return t})(),ew=(()=>{class t{_changeDetectorRef=p(He);_elementRef=p(q);_isMultiline=!1;message;tooltipClass;_showTimeoutId;_hideTimeoutId;_triggerElement;_mouseLeaveHideDelay;_animationsDisabled=qe();_tooltip;_closeOnInteraction=!1;_isVisible=!1;_onHide=new B;_showAnimation="mat-mdc-tooltip-show";_hideAnimation="mat-mdc-tooltip-hide";show(e){this._hideTimeoutId!=null&&clearTimeout(this._hideTimeoutId),this._showTimeoutId=setTimeout(()=>{this._toggleVisibility(!0),this._showTimeoutId=void 0},e)}hide(e){this._showTimeoutId!=null&&clearTimeout(this._showTimeoutId),this._hideTimeoutId=setTimeout(()=>{this._toggleVisibility(!1),this._hideTimeoutId=void 0},e)}afterHidden(){return this._onHide}isVisible(){return this._isVisible}ngOnDestroy(){this._cancelPendingAnimations(),this._onHide.complete(),this._triggerElement=null}_handleBodyInteraction(){this._closeOnInteraction&&this.hide(0)}_markForCheck(){this._changeDetectorRef.markForCheck()}_handleMouseLeave({relatedTarget:e}){(!e||!this._triggerElement.contains(e))&&(this.isVisible()?this.hide(this._mouseLeaveHideDelay):this._finalizeAnimation(!1))}_onShow(){this._isMultiline=this._isTooltipMultiline(),this._markForCheck()}_isTooltipMultiline(){let e=this._elementRef.nativeElement.getBoundingClientRect();return e.height>tO&&e.width>=nO}_handleAnimationEnd({animationName:e}){(e===this._showAnimation||e===this._hideAnimation)&&this._finalizeAnimation(e===this._showAnimation)}_cancelPendingAnimations(){this._showTimeoutId!=null&&clearTimeout(this._showTimeoutId),this._hideTimeoutId!=null&&clearTimeout(this._hideTimeoutId),this._showTimeoutId=this._hideTimeoutId=void 0}_finalizeAnimation(e){e?this._closeOnInteraction=!0:this.isVisible()||this._onHide.next()}_toggleVisibility(e){let i=this._tooltip.nativeElement,o=this._showAnimation,a=this._hideAnimation;if(i.classList.remove(e?a:o),i.classList.add(e?o:a),this._isVisible!==e&&(this._isVisible=e,this._changeDetectorRef.markForCheck()),e&&!this._animationsDisabled&&typeof getComputedStyle=="function"){let r=getComputedStyle(i);(r.getPropertyValue("animation-duration")==="0s"||r.getPropertyValue("animation-name")==="none")&&(this._animationsDisabled=!0)}e&&this._onShow(),this._animationsDisabled&&(i.classList.add("_mat-animation-noopable"),this._finalizeAnimation(e))}static \u0275fac=function(i){return new(i||t)};static \u0275cmp=(function(){let e=["tooltip"];return H({type:t,selectors:[["mat-tooltip-component"]],viewQuery:function(o,a){if(o&1&&ot(e,7),o&2){let r;Y(r=Z())&&(a._tooltip=r.first)}},hostAttrs:["aria-hidden","true"],hostBindings:function(o,a){o&1&&V("mouseleave",function(s){return a._handleMouseLeave(s)})},decls:4,vars:5,consts:[["tooltip",""],[1,"mdc-tooltip","mat-mdc-tooltip",3,"animationend"],[1,"mat-mdc-tooltip-surface","mdc-tooltip__surface"]],template:function(o,a){o&1&&(Je(0,"div",1,0),_r("animationend",function(s){return a._handleAnimationEnd(s)}),Je(2,"div",2),b(3),it()()),o&2&&(Ke(a.tooltipClass),z("mdc-tooltip--multiline",a._isMultiline),h(3),S(a.message))},styles:[`.mat-mdc-tooltip {
  position: relative;
  transform: scale(0);
  display: inline-flex;
}
.mat-mdc-tooltip::before {
  content: "";
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: -1;
  position: absolute;
}
.mat-mdc-tooltip-panel-below .mat-mdc-tooltip::before {
  top: -8px;
}
.mat-mdc-tooltip-panel-above .mat-mdc-tooltip::before {
  bottom: -8px;
}
.mat-mdc-tooltip-panel-right .mat-mdc-tooltip::before {
  left: -8px;
}
.mat-mdc-tooltip-panel-left .mat-mdc-tooltip::before {
  right: -8px;
}
.mat-mdc-tooltip._mat-animation-noopable {
  animation: none;
  transform: scale(1);
}

.mat-mdc-tooltip-surface {
  word-break: normal;
  overflow-wrap: anywhere;
  padding: 4px 8px;
  min-width: 40px;
  max-width: 200px;
  min-height: 24px;
  max-height: 40vh;
  box-sizing: border-box;
  overflow: hidden;
  text-align: center;
  will-change: transform, opacity;
  background-color: var(--%NS%mat-tooltip-container-color, var(--%NS%mat-sys-inverse-surface));
  color: var(--%NS%mat-tooltip-supporting-text-color, var(--%NS%mat-sys-inverse-on-surface));
  border-radius: var(--%NS%mat-tooltip-container-shape, var(--%NS%mat-sys-corner-extra-small));
  font-family: var(--%NS%mat-tooltip-supporting-text-font, var(--%NS%mat-sys-body-small-font));
  font-size: var(--%NS%mat-tooltip-supporting-text-size, var(--%NS%mat-sys-body-small-size));
  font-weight: var(--%NS%mat-tooltip-supporting-text-weight, var(--%NS%mat-sys-body-small-weight));
  line-height: var(--%NS%mat-tooltip-supporting-text-line-height, var(--%NS%mat-sys-body-small-line-height));
  letter-spacing: var(--%NS%mat-tooltip-supporting-text-tracking, var(--%NS%mat-sys-body-small-tracking));
}
.mat-mdc-tooltip-surface::before {
  position: absolute;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  border: 1px solid transparent;
  border-radius: inherit;
  content: "";
  pointer-events: none;
}
.mdc-tooltip--multiline .mat-mdc-tooltip-surface {
  text-align: left;
}
[dir=rtl] .mdc-tooltip--multiline .mat-mdc-tooltip-surface {
  text-align: right;
}

.mat-mdc-tooltip-panel {
  line-height: normal;
}
.mat-mdc-tooltip-panel.mat-mdc-tooltip-panel-non-interactive {
  pointer-events: none;
}

@keyframes mat-mdc-tooltip-show {
  0% {
    opacity: 0;
    transform: scale(0.8);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}
@keyframes mat-mdc-tooltip-hide {
  0% {
    opacity: 1;
    transform: scale(1);
  }
  100% {
    opacity: 0;
    transform: scale(0.8);
  }
}
.mat-mdc-tooltip-show {
  animation: mat-mdc-tooltip-show 150ms cubic-bezier(0, 0, 0.2, 1) forwards;
}

.mat-mdc-tooltip-hide {
  animation: mat-mdc-tooltip-hide 75ms cubic-bezier(0.4, 0, 1, 1) forwards;
}
`],encapsulation:2})})()}return t})();var Di=(()=>{class t{static \u0275fac=function(i){return new(i||t)};static \u0275mod=le({type:t});static \u0275inj=se({imports:[Er,di,Ne,ri]})}return t})();var fe={PERIODO_PADRAO_DIAS:365,UF_PADRAO:"SP",CIDADE_PADRAO:"S\xE3o Paulo",TEMPO_LIMITE_LOCALIZACAO_MS:3e3,TIMEOUT_REDE_EXTERNA_MS:6e3,MINUTOS_CACHE_NAVEGADOR:5,MINUTOS_ATUALIZACAO_AUTOMATICA:3,DIAS_CACHE_FRONTEIRAS:60,CACHE_PACOTES_MB:40,MAX_NOTICIAS_POR_PAGINA:40,BASES_DADOS:["https://cdn.jsdelivr.net/gh/marciovargas-ai/mapa-seguranca-sinesp@main/dados/","https://raw.githubusercontent.com/marciovargas-ai/mapa-seguranca-sinesp/main/dados/"],RAIO_CALOR_METROS:350,RAIO_CALOR_MIN_PX:14,RAIO_CALOR_MAX_PX:46,RAIO_PINO:6,ZONA_CELULA_METROS:400,ZONA_MIN_OCORRENCIAS:3,ZONA_MAX_EXIBIDAS:8,ZONA_RAIO_MIN_METROS:250,ZONA_RAIO_MAX_METROS:1600,ZONA_MEIA_VIDA_DIAS:90,ZONA_PESO_MINIMO:1.5,DIAS_HISTORICO_SERVIDOR:365,ZOOM_CIDADE:13,COR_FRONTEIRA_CIDADE:"#113366",COR_FRONTEIRA_ESTADO:"#d97706",CHAVE_AJUDA_VISTA:"MAPA_SEG_V4_AJUDA",CHAVE_TEMA:"MAPA_SEG_V4_TEMA",CHAVE_LARGURA:"MAPA_SEG_V5_LARGURA"},Lo=[{id:"CVLI",nome:"Homic\xEDdio e latroc\xEDnio",curto:"Homic\xEDdio",cor:"#dc2626",peso:1},{id:"CONFRONTO",nome:"Tiroteio e arma de fogo",curto:"Tiroteio",cor:"#ea580c",peso:.85},{id:"CARGA",nome:"Roubo de carga",curto:"Carga",cor:"#9333ea",peso:.7},{id:"PATRIMONIO",nome:"Roubo e furto",curto:"Roubo/furto",cor:"#2563eb",peso:.55},{id:"TRAFICO",nome:"Tr\xE1fico e opera\xE7\xE3o policial",curto:"Tr\xE1fico",cor:"#0d9488",peso:.45},{id:"BLOQUEIO",nome:"Dist\xFArbio e bloqueio de via",curto:"Dist\xFArbio",cor:"#64748b",peso:.35}],vt=Object.fromEntries(Lo.map(t=>[t.id,t])),zg=[{id:"PM",nome:"Pol\xEDcia Militar",curto:"PM",cor:"#1d4ed8"},{id:"COPOM",nome:"COPOM / 190",curto:"COPOM",cor:"#0891b2"},{id:"PC",nome:"Pol\xEDcia Civil",curto:"PC",cor:"#7c3aed"},{id:"PRF",nome:"Pol\xEDcia Rodovi\xE1ria Federal",curto:"PRF",cor:"#ca8a04"},{id:"GM",nome:"Guarda Municipal",curto:"GM",cor:"#059669"},{id:"SSP",nome:"Secretaria de Seguran\xE7a (SSP)",curto:"SSP",cor:"#be123c"},{id:"PF",nome:"Pol\xEDcia Federal",curto:"PF",cor:"#334155"}],an=Object.fromEntries(zg.map(t=>[t.id,t])),Wr={ENDERECO:{nome:"Rua / endere\xE7o",cor:"#059669"},BAIRRO:{nome:"Bairro",cor:"#2563eb"},RODOVIA:{nome:"Rodovia",cor:"#d97706"},MUNICIPIO:{nome:"S\xF3 o munic\xEDpio",cor:"#64748b"},PENDENTE:{nome:"Em revalida\xE7\xE3o",cor:"#64748b"}},tw={ENDERECO:!0,BAIRRO:!0,RODOVIA:!0},Vu={critica:"#dc2626",alta:"#f97316",moderada:"#eab308"},ju={critica:"Cr\xEDtica",alta:"Alta",moderada:"Moderada"},nw=[{dias:30,rotulo:"30 dias"},{dias:90,rotulo:"90 dias"},{dias:180,rotulo:"6 meses"},{dias:365,rotulo:"12 meses"}],zt={AC:{ibge:"12",nome:"Acre",capital:"Rio Branco",lat:-9.9754,lng:-67.8249},AL:{ibge:"27",nome:"Alagoas",capital:"Macei\xF3",lat:-9.6658,lng:-35.735},AP:{ibge:"16",nome:"Amap\xE1",capital:"Macap\xE1",lat:.0349,lng:-51.0694},AM:{ibge:"13",nome:"Amazonas",capital:"Manaus",lat:-3.119,lng:-60.0217},BA:{ibge:"29",nome:"Bahia",capital:"Salvador",lat:-12.9714,lng:-38.5014},CE:{ibge:"23",nome:"Cear\xE1",capital:"Fortaleza",lat:-3.7172,lng:-38.5433},DF:{ibge:"53",nome:"Distrito Federal",capital:"Bras\xEDlia",lat:-15.7975,lng:-47.8919},ES:{ibge:"32",nome:"Esp\xEDrito Santo",capital:"Vit\xF3ria",lat:-20.3155,lng:-40.3128},GO:{ibge:"52",nome:"Goi\xE1s",capital:"Goi\xE2nia",lat:-16.6869,lng:-49.2648},MA:{ibge:"21",nome:"Maranh\xE3o",capital:"S\xE3o Lu\xEDs",lat:-2.5387,lng:-44.2825},MT:{ibge:"51",nome:"Mato Grosso",capital:"Cuiab\xE1",lat:-15.6014,lng:-56.0979},MS:{ibge:"50",nome:"Mato Grosso do Sul",capital:"Campo Grande",lat:-20.4697,lng:-54.6201},MG:{ibge:"31",nome:"Minas Gerais",capital:"Belo Horizonte",lat:-19.9167,lng:-43.9345},PA:{ibge:"15",nome:"Par\xE1",capital:"Bel\xE9m",lat:-1.4558,lng:-48.4902},PB:{ibge:"25",nome:"Para\xEDba",capital:"Jo\xE3o Pessoa",lat:-7.1195,lng:-34.845},PR:{ibge:"41",nome:"Paran\xE1",capital:"Curitiba",lat:-25.4284,lng:-49.2733},PE:{ibge:"26",nome:"Pernambuco",capital:"Recife",lat:-8.0476,lng:-34.877},PI:{ibge:"22",nome:"Piau\xED",capital:"Teresina",lat:-5.092,lng:-42.8038},RJ:{ibge:"33",nome:"Rio de Janeiro",capital:"Rio de Janeiro",lat:-22.9068,lng:-43.1729},RN:{ibge:"24",nome:"Rio Grande do Norte",capital:"Natal",lat:-5.7945,lng:-35.211},RS:{ibge:"43",nome:"Rio Grande do Sul",capital:"Porto Alegre",lat:-30.0346,lng:-51.2177},RO:{ibge:"11",nome:"Rond\xF4nia",capital:"Porto Velho",lat:-8.7619,lng:-63.9039},RR:{ibge:"14",nome:"Roraima",capital:"Boa Vista",lat:2.8235,lng:-60.6758},SC:{ibge:"42",nome:"Santa Catarina",capital:"Florian\xF3polis",lat:-27.5954,lng:-48.548},SP:{ibge:"35",nome:"S\xE3o Paulo",capital:"S\xE3o Paulo",lat:-23.5505,lng:-46.6333},SE:{ibge:"28",nome:"Sergipe",capital:"Aracaju",lat:-10.9472,lng:-37.0731},TO:{ibge:"17",nome:"Tocantins",capital:"Palmas",lat:-10.184,lng:-48.3336}},iw=Object.keys(zt).sort();var qr=["jan","fev","mar","abr","mai","jun","jul","ago","set","out","nov","dez"],zu=["Dom","Seg","Ter","Qua","Qui","Sex","S\xE1b"];function Oe(t){return String(t??"").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g,"").replace(/[^a-z0-9\s]/g," ").replace(/\s+/g," ").trim()}var T=t=>Number(t||0).toLocaleString("pt-BR"),Ee=t=>t==null?"\u2014":Number(t).toLocaleString("pt-BR",{minimumFractionDigits:1,maximumFractionDigits:1}),rn=(t,n)=>n>0?Math.round(t/n*100):0;function Mi(t,n){return t==null||n==null||n===0?null:Math.round((t-n)/n*100)}function Yr(t,n,e,i){let o=Math.PI/180,a=(e-t)*o,r=(i-n)*o,s=Math.sin(a/2)**2+Math.cos(t*o)*Math.cos(e*o)*Math.sin(r/2)**2;return 12742*Math.asin(Math.sqrt(s))}function $n(t,n=fe.TIMEOUT_REDE_EXTERNA_MS){let e=new AbortController,i=setTimeout(()=>e.abort(),n);return fetch(t,{signal:e.signal}).finally(()=>clearTimeout(i))}function wc(t){let n=new Date(Date.now()-t*864e5);return n.getFullYear()*1e4+(n.getMonth()+1)*100+n.getDate()}var Ec=t=>new Date(Math.floor(t/1e4),Math.floor(t/100)%100-1,t%100),Hu=t=>Math.max(0,(Date.now()-Ec(t).getTime())/864e5);function Zr(t){return{30:"30 dias",90:"90 dias",180:"6 meses",365:"12 meses"}[t]||t+" dias"}function Va(t){return/^https?:\/\//i.test(String(t||""))?String(t):"#"}function Te(t){return String(t??"").replace(/[&<>"']/g,n=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[n])}function Dc(t){try{return localStorage.getItem(t)}catch{return null}}function ja(t,n){try{localStorage.setItem(t,n)}catch{}}function iO(t){if(vt[t])return t;let n=Oe(t);return n.includes("cvli")||n.includes("homic")||n.includes("latroc")?"CVLI":n.includes("confronto")||n.includes("arma")?"CONFRONTO":n.includes("carga")?"CARGA":n.includes("trafico")||n.includes("operac")?"TRAFICO":n.includes("bloqueio")||n.includes("disturb")?"BLOQUEIO":"PATRIMONIO"}function $u(t){let n=(t.ocorrencias||[]).map(e=>{let i=Number(e.lat)||null,o=Number(e.lng)||null;return{id:e.id,data:e.data,ts:Number(e.ts)||0,cidade:e.cidade,bairro:e.bairro||"Local n\xE3o informado",cat:iO(e.categoria),titulo:e.titulo,veiculo:e.veiculo,link:e.link,lat:i,lng:o,precisao:e.precisao||"PENDENTE",precisa:!!(tw[e.precisao]&&i&&o),orgaos:(e.orgaos||[]).filter(a=>an[a]),local:!!e.local}});return{uf:t.uf,cidade:t.cidade,codigoIbge:t.codigoIbge||"",centroLat:Number(t.centroLat),centroLng:Number(t.centroLng),ocorrencias:n,totalNaBase:Number(t.totalNaBase)||n.length,cidadesMonitoradas:t.cidadesMonitoradas||0,oficial:t.oficial||{disponivel:!1,eventos:[]},atualizadoEm:t.atualizadoEm||"",ultimaColeta:t.ultimaColeta||"",versaoLocal:Date.now(),bairros:Array.isArray(t.bairros)?t.bairros:[]}}function ow(t,n,e,i,o){return{uf:t,cidade:n,codigoIbge:o,centroLat:e,centroLng:i,ocorrencias:[],totalNaBase:0,cidadesMonitoradas:0,oficial:null,atualizadoEm:"",ultimaColeta:"",versaoLocal:Date.now(),vazio:!0}}function Mc(t,n,e,i,o){let a=j=>!e.length||e.includes(j),r=wc(n),s=wc(n*2),c=t?t.ocorrencias.filter(j=>a(j.cat)):[],d={},l=0,m=0,v=0;for(let j of c)if(!(j.ts<r)){m++,j.local&&l++,j.orgaos.length||v++;for(let Ie of j.orgaos){let tt=d[Ie]||(d[Ie]={qtd:0,graves:0,precisas:0});tt.qtd++,(j.cat==="CVLI"||j.cat==="CONFRONTO")&&tt.graves++,j.precisa&&tt.precisas++}}let g=i?c.filter(j=>j.orgaos.includes(i)):c,y=[],_=[];for(let j of g)j.ts>=r?y.push(j):j.ts>=s&&_.push(j);let C=y.filter(j=>j.precisa),w={},E={};y.forEach(j=>w[j.cat]=(w[j.cat]||0)+1),_.forEach(j=>E[j.cat]=(E[j.cat]||0)+1);let U=[0,0,0,0,0,0,0];y.forEach(j=>{j.ts&&U[Ec(j.ts).getDay()]++});let F={};return y.forEach(j=>{let Ie=j.veiculo||"Imprensa";F[Ie]=(F[Ie]||0)+1}),{todas:y,anteriores:_,comparavel:n*2<=fe.DIAS_HISTORICO_SERVIDOR,precisas:C,semLocal:y.filter(j=>!j.precisa),porCat:w,porCatAnt:E,locais:oO(y,o),serie:aO(g),semana:U,fontes:Object.keys(F).map(j=>({nome:j,qtd:F[j]})).sort((j,Ie)=>Ie.qtd-j.qtd),zonas:Hg(C),porOrgao:d,imprensaLocal:l,totalCruzamento:m,semOrgao:v}}function oO(t,n){let e={};for(let i of t){if(!i.bairro||i.bairro==="Local n\xE3o informado")continue;let o=(n?Oe(i.cidade)+"|":"")+Oe(i.bairro),a=e[o]||(e[o]={nome:i.bairro,cidade:i.cidade,qtd:0,n:0,sLat:0,sLng:0,cats:{}});a.qtd++,a.cats[i.cat]=(a.cats[i.cat]||0)+1,i.precisa&&(a.n++,a.sLat+=i.lat,a.sLng+=i.lng)}return Object.values(e).map(i=>({nome:i.nome,cidade:i.cidade,qtd:i.qtd,n:i.n,lat:i.n?i.sLat/i.n:void 0,lng:i.n?i.sLng/i.n:void 0,catTop:Object.keys(i.cats).sort((o,a)=>i.cats[a]-i.cats[o])[0]})).sort((i,o)=>o.qtd-i.qtd)}function aO(t){let n=new Date,e=[],i={};for(let a=11;a>=0;a--){let r=new Date(n.getFullYear(),n.getMonth()-a,1);i[r.getFullYear()*100+r.getMonth()+1]=e.length,e.push(qr[r.getMonth()]+"/"+String(r.getFullYear()).slice(2))}let o={};for(let a of t){let r=i[Math.floor(a.ts/100)];r!==void 0&&(o[a.cat]||(o[a.cat]=new Array(12).fill(0)))[r]++}return{labels:e,porCat:o}}function Hg(t){if(t.length<fe.ZONA_MIN_OCORRENCIAS)return[];let n=t[0].lat,e=fe.ZONA_CELULA_METROS/111320,i=fe.ZONA_CELULA_METROS/(111320*Math.cos(n*Math.PI/180)),o={};for(let w of t){let E=Math.floor(w.lat/e),U=Math.floor(w.lng/i),F=E+":"+U,j=vt[w.cat].peso*(.4+.6*Math.pow(.5,Hu(w.ts)/fe.ZONA_MEIA_VIDA_DIAS)),Ie=o[F]||(o[F]={i:E,j:U,peso:0,pontos:[],suave:0,vizinhanca:0});Ie.peso+=j,Ie.pontos.push(w)}let a=Object.keys(o);for(let w of a){let E=o[w],U=0,F=0;for(let j=-1;j<=1;j++)for(let Ie=-1;Ie<=1;Ie++){let tt=o[E.i+j+":"+(E.j+Ie)];tt&&(U+=tt.peso*(j===0&&Ie===0?1:.5),F+=tt.pontos.length)}E.suave=U,E.vizinhanca=F}let r=a.map(w=>o[w].suave),s=r.reduce((w,E)=>w+E,0)/r.length,c=Math.sqrt(r.reduce((w,E)=>w+(E-s)**2,0)/r.length),d=Math.max(fe.ZONA_PESO_MINIMO,Math.min(s+c,Math.max(...r)*.3)),l={};for(let w of a)o[w].suave>=d&&o[w].vizinhanca>=2&&(l[w]=o[w]);let m={},v=[];for(let w of Object.keys(l)){if(m[w])continue;let E=[w],U=[];for(m[w]=!0;E.length;){let F=l[E.pop()];U.push(F);for(let j=-1;j<=1;j++)for(let Ie=-1;Ie<=1;Ie++){let tt=F.i+j+":"+(F.j+Ie);l[tt]&&!m[tt]&&(m[tt]=!0,E.push(tt))}}v.push(U)}let g=wc(30),y=wc(60),_=v.map(w=>{let E=w.flatMap(Se=>Se.pontos),U=w.reduce((Se,rt)=>Se+rt.peso,0);if(E.length<fe.ZONA_MIN_OCORRENCIAS)return null;let F=0,j=0,Ie=0,tt=0,vn=0,Pt={},ue={},$=new Set;for(let Se of E){let rt=vt[Se.cat].peso;F+=Se.lat*rt,j+=Se.lng*rt,Ie+=rt,Se.bairro&&Se.bairro!=="Local n\xE3o informado"&&(Pt[Se.bairro]=(Pt[Se.bairro]||0)+1),ue[Se.cat]=(ue[Se.cat]||0)+1,$.add(Se.cidade),Se.ts>=g?tt++:Se.ts>=y&&vn++}let M=F/Ie,pe=j/Ie,ne=Math.max(...E.map(Se=>Yr(M,pe,Se.lat,Se.lng)*1e3));return{lat:M,lng:pe,qtd:E.length,peso:U,raio:Math.max(fe.ZONA_RAIO_MIN_METROS,Math.min(fe.ZONA_RAIO_MAX_METROS,ne+120)),nome:Object.keys(Pt).sort((Se,rt)=>Pt[rt]-Pt[Se]).slice(0,3).join(", ")||"\xC1rea sem bairro citado",cidade:[...$].join(", "),cats:Object.keys(ue).sort((Se,rt)=>ue[rt]-ue[Se]).map(Se=>({id:Se,qtd:ue[Se]})),graves:(ue.CVLI||0)+(ue.CONFRONTO||0),recentes:tt,anteriores30:vn,rank:0,indice:0,nivel:"moderada"}}).filter(w=>!!w).sort((w,E)=>E.peso-w.peso).slice(0,fe.ZONA_MAX_EXIBIDAS),C=_.length?_[0].peso:1;return _.forEach((w,E)=>{w.rank=E+1,w.indice=Math.round(w.peso/C*100),w.nivel=w.indice>=70?"critica":w.indice>=40?"alta":"moderada"}),_}function aw(t){return/latroc/i.test(t)?"Latroc\xEDnio":t.replace(/\s*\([^)]*\)/g,"").replace(/ ou em decorrência dele/i,"").replace(/\s+/g," ").trim()}function $g(t){return t?.eventos?.length?W(I({},t),{eventos:t.eventos.map(n=>W(I({},n),{nome:aw(n.nome)}))}):t||null}function rw(t){return t?.disponivel?W(I({},t),{oficial:$g(t.oficial)||void 0,rankings:t.rankings?.map(n=>W(I({},n),{evento:aw(n.evento)}))}):t}var Ug=class{db=null;abrindo=null;memoria=new Map;abrir(){return this.db?Promise.resolve(this.db):this.abrindo?this.abrindo:(this.abrindo=new Promise(n=>{try{let e=indexedDB.open("mapa_seguranca_v4",1);e.onupgradeneeded=()=>{let i=e.result;i.objectStoreNames.contains("kv")||i.createObjectStore("kv"),i.objectStoreNames.contains("pacotes")||i.createObjectStore("pacotes")},e.onsuccess=()=>{this.db=e.result,n(this.db)},e.onerror=()=>n(null)}catch{n(null)}}),this.abrindo)}async obter(n,e=fe.DIAS_CACHE_FRONTEIRAS){if(this.memoria.has(n))return this.memoria.get(n);let i=await this.abrir();return i?new Promise(o=>{try{let a=i.transaction("kv","readonly").objectStore("kv").get(n);a.onsuccess=()=>{let r=a.result;r&&r.em>Date.now()-e*864e5?(this.memoria.set(n,r.dado),o(r.dado)):o(null)},a.onerror=()=>o(null)}catch{o(null)}}):null}async salvar(n,e){this.memoria.set(n,e);let i=await this.abrir();if(i)try{i.transaction("kv","readwrite").objectStore("kv").put({em:Date.now(),dado:e},n)}catch{}}async obterPacote(n){let e=await this.abrir();return e?new Promise(i=>{try{let o=e.transaction("pacotes","readwrite").objectStore("pacotes"),a=o.get(n);a.onsuccess=()=>{let r=a.result;if(!r)return i(null);r.usado=Date.now(),o.put(r,n);try{i({em:r.em,dado:JSON.parse(r.texto)})}catch{i(null)}},a.onerror=()=>i(null)}catch{i(null)}}):null}async salvarPacote(n,e){let i;try{i=JSON.stringify(e)}catch{return}let o=await this.abrir();if(o)try{let a=o.transaction("pacotes","readwrite");a.objectStore("pacotes").put({em:Date.now(),usado:Date.now(),tamanho:i.length,texto:i},n),a.oncomplete=()=>this.limitarPacotes(o)}catch{}}limitarPacotes(n){let e=fe.CACHE_PACOTES_MB*1024*1024,i=[],o=0;try{let a=n.transaction("pacotes","readwrite").objectStore("pacotes");a.openCursor().onsuccess=r=>{let s=r.target.result;if(s){i.push({chave:s.key,usado:s.value.usado||0,tamanho:s.value.tamanho||0}),o+=s.value.tamanho||0,s.continue();return}if(!(o<=e)){i.sort((c,d)=>c.usado-d.usado);for(let c=0;c<i.length&&o>e;c++)a.delete(i[c].chave),o-=i[c].tamanho}}}catch{}}},gt=new Ug;function rO(){return typeof google<"u"&&google.script&&google.script.run?google.script.run:window.__servidorTeste||null}function Ic(t,...n){return new Promise((e,i)=>{let o=rO();if(!o){i(new Error("Abra o painel pelo Apps Script"));return}o.withSuccessHandler(e).withFailureHandler(i)[t](...n)})}var ui={cidade:(t,n,e,i,o,a=0)=>Ic("obterOuAtualizarCidadeNacional",t,n,e,i,o===!0,a||0),panorama:t=>Ic("obterPanoramaEstado",t),bairros:t=>Ic("obterBairrosCidade",t).then(n=>Array.isArray(n)?n:[],()=>[]),fogoCruzado:(t,n)=>Ic("obterFogoCruzado",t,n).then(e=>e||null,e=>({configurado:!0,erro:String(e?.message||e),itens:[]})),fronteira:t=>Ic("obterFronteiraIbge",t).then(n=>{try{return JSON.parse(n)}catch{return null}},()=>null)};var sO=["https://overpass-api.de/api/interpreter","https://overpass.kumi.systems/api/interpreter"],Gg=90,Uu='["place"~"^(suburb|neighbourhood|quarter)$"]';async function lw(t,n){let e=await cO(t);if(e.length)return e;let i="BAIRROS_OSM2_"+t,o=await gt.obter(i,Gg);if(o?.length)return o;let a=`area["IBGE:GEOCODIGO"="${t}"]["admin_level"="8"]->.m;`,r=`(relation["boundary"="administrative"]["admin_level"~"^(9|10)$"](area.m);way${Uu}(area.m);relation${Uu}(area.m););`,s=`[out:json][timeout:25];${a}(node${Uu}(area.m);${r.slice(1,-2)});out center tags;`,c=`[out:json][timeout:90];${a}${r}out geom;node${Uu}(area.m);out;`,d="BAIRROS_PTS_"+t,l=await gt.obter(d,Gg)||[];if(!l.length){let g=await sw(s,25e3);l=g?cw(g):[],l.length||(l=await ui.bairros(t)),l.length&&gt.salvar(d,l)}l.length&&n?.(l);let m=await sw(c,95e3),v=m?cw(m):[];if(v.some(g=>g.aneis)){let g=new Set(v.map(_=>Oe(_.n))),y=v.concat(l.filter(_=>!g.has(Oe(_.n))));return gt.salvar(i,y),y}return l}async function cO(t){let n="BAIRROS_IBGE_"+t,e=await gt.obter(n,Gg);if(e?.length)return e;if(await gt.obter("BAIRROS_IBGE_SEM3_"+t,7))return[];let i=0;for(let o of fe.BASES_DADOS)try{let a=await $n(o+"bairros/"+t+".json",12e3);if(a.status===404){++i===fe.BASES_DADOS.length&&gt.salvar("BAIRROS_IBGE_SEM3_"+t,!0);continue}if(!a.ok)continue;let r=(await a.json()).filter(s=>s&&s.n&&s.aneis?.length).map(s=>W(I({},s),{fonte:s.f?"OSM":"IBGE",aprox:s.f==="OSM~"}));return gt.salvar(n,r),r}catch{}return[]}async function sw(t,n){let e=i=>$n(i+"?data="+encodeURIComponent(t),n).then(o=>o.ok?o.json():Promise.reject(o.status)).then(o=>Array.isArray(o?.elements)?o.elements:Promise.reject("vazio"));try{return await Promise.any(sO.map(e))}catch{return null}}var Bo=t=>Math.round(t*1e5)/1e5;function cw(t){let n=new Map;for(let e of t){let i=e.tags?.name||e.tags?.["name:pt"];if(!i)continue;let o=Oe(i),a;e.type==="relation"?a=lO((e.members||[]).filter(d=>d.type==="way"&&d.role!=="inner"&&d.geometry)):e.type==="way"&&e.geometry?.length>3&&(a=[e.geometry.map(d=>[Bo(d.lat),Bo(d.lon)])]);let r=e.lat,s=e.lon;if(a?.length?[r,s]=dO(a):e.bounds&&(r=(e.bounds.minlat+e.bounds.maxlat)/2,s=(e.bounds.minlon+e.bounds.maxlon)/2),r==null||s==null)continue;let c=n.get(o);c?!c.aneis&&a?n.set(o,W(I({},c),{aneis:a})):e.type==="node"&&c.aneis&&n.set(o,W(I({},c),{lat:Bo(r),lng:Bo(s)})):n.set(o,{n:i,lat:Bo(r),lng:Bo(s),aneis:a,fonte:"OSM"})}return[...n.values()]}function lO(t){let n=t.map(o=>o.geometry.map(a=>[Bo(a.lat),Bo(a.lon)])),e=(o,a)=>o[0]===a[0]&&o[1]===a[1],i=[];for(;n.length;){let o=n.shift(),a=!0;for(;!e(o[0],o[o.length-1])&&a;){a=!1;for(let r=0;r<n.length;r++){let s=n[r],c=o[o.length-1];if(e(c,s[0]))o=o.concat(s.slice(1));else if(e(c,s[s.length-1]))o=o.concat(s.slice(0,-1).reverse());else if(e(o[0],s[s.length-1]))o=s.slice(0,-1).concat(o);else if(e(o[0],s[0]))o=s.slice(1).reverse().concat(o);else continue;n.splice(r,1),a=!0;break}}o.length>3&&e(o[0],o[o.length-1])&&i.push(o)}return i.length?i:void 0}function dO(t){let n=t.reduce((a,r)=>r.length>a.length?r:a),e=0,i=0,o=0;for(let a=0,r=n.length-1;a<n.length;r=a++){let s=n[r][1]*n[a][0]-n[a][1]*n[r][0];e+=s,i+=(n[r][1]+n[a][1])*s,o+=(n[r][0]+n[a][0])*s}return Math.abs(e)<1e-12?[n[0][0],n[0][1]]:[o/(3*e),i/(3*e)]}function Wg(t,n,e){let i=!1;for(let o of e)for(let a=0,r=o.length-1;a<o.length;r=a++){let[s,c]=o[a],[d,l]=o[r];s>t!=d>t&&n<(l-c)*(t-s)/(d-s)+c&&(i=!i)}return i}function qg(t,n){let e=new Map,i=new Map(t.map(l=>[Oe(l.n),l])),o=t.filter(l=>l.aneis),a=(l,m)=>({nome:l.n,lat:l.lat,lng:l.lng,aneis:l.aneis,osm:m,fonte:l.fonte,aprox:l.aprox,qtd:0,graves:0,recentes:0,cats:{},catTop:"",ocorrencias:[]});t.forEach(l=>e.set(Oe(l.n),a(l,!0)));let r=[],s=0,c=t.map(l=>({b:l,n:" "+Oe(l.n)+" "})).filter(l=>l.n.length>=6).sort((l,m)=>m.n.length-l.n.length);for(let l of n){let m;l.precisa&&l.lat!=null&&l.lng!=null&&(m=o.find(_=>Wg(l.lat,l.lng,_.aneis)));let v=l.bairro&&l.bairro!=="Local n\xE3o informado"?Oe(l.bairro.split(",")[0]):"";if(!m&&v&&(m=i.get(v)),!m&&!l.precisa&&c.length){let _=" "+Oe(l.titulo)+" ",C=" "+Oe(l.cidade)+" ";m=c.find(w=>w.n!==C&&_.includes(w.n))?.b}let g=m?Oe(m.n):"";!m&&v&&l.precisa&&v!==Oe(l.cidade)&&(g=v,e.has(g)||e.set(g,a({n:l.bairro.split(",")[0],lat:l.lat,lng:l.lng},!1)));let y=g?e.get(g):void 0;y&&(s++,y.qtd++,y.cats[l.cat]=(y.cats[l.cat]||0)+1,(l.cat==="CVLI"||l.cat==="CONFRONTO")&&y.graves++,Hu(l.ts)<=30&&y.recentes++,y.ocorrencias.push(l),(!l.precisa||l.precisao==="BAIRRO")&&r.push({o:l,bairro:y.nome}))}let d=[...e.values()];return d.forEach(l=>{l.catTop=Object.keys(l.cats).sort((m,v)=>l.cats[v]-l.cats[m])[0]||""}),d.sort((l,m)=>m.qtd-l.qtd||m.graves-l.graves||l.nome.localeCompare(m.nome)),{lista:d,ligadas:s,peloBairro:r}}var Kg=["RJ","PE","BA","PA"],Yg=null,Zg=null;function Xg(t,n,e){return kc(t,n,e)}async function kc(t,n,e){let i=await gt.obter(n,e);if(i)return i;for(let o of fe.BASES_DADOS)try{let a=await $n(o+t,2e4);if(!a.ok)continue;let r=await a.json();return gt.salvar(n,r),r}catch{}return null}async function mw(t,n){if(t!=="RJ"||!n)return null;Yg??=kc("isp_rj_cisp.json","ISP_RJ_CISP",3),Zg??=kc("cisp_rj_contornos.json","ISP_RJ_CONTORNOS",30);let e=await Yg;if(!e)return Yg=null,null;let i=(await Zg)?.cisps||{};(!i||!Object.keys(i).length)&&(Zg=null);let o=(e.municipios?.[n.slice(0,6)]||[]).map(a=>{let r=i[String(a.cisp)];return r?W(I({},a),{aneis:r.aneis,lat:r.lat,lng:r.lng}):a});return o.length?{fonte:e.fonte,periodo:e.periodo,campos:e.campos,areas:o}:null}async function Qg(t,n,e=!1){if(!Kg.includes(t)||!n)return null;let i="FOGO_"+t+"_"+n,o=e?null:await gt.obter(i,1/24);if(o)return o;let a=await ui.fogoCruzado(t,n);return a?.configurado&&!a.erro&&gt.salvar(i,a),a}var dw=null;function pw(){return dw||(dw=kc("sim_homicidios.json","SIM_HOMICIDIOS",7))}var uw=null;function fw(){return uw||(uw=kc("referencia_nacional.json","REF_NACIONAL2",3))}var Nc={cvli:"Homic\xEDdio, feminic\xEDdio e latroc\xEDnio",tentativa:"Tentativa de homic\xEDdio",estupro:"Estupro",roubo:"Roubo",furto:"Furto",veiculo:"Roubo/furto de ve\xEDculo",carga:"Roubo de carga",trafico:"Tr\xE1fico de drogas"},uO={CVLI:["cvli"],CONFRONTO:["cvli","tentativa"],CARGA:["carga"],PATRIMONIO:["roubo","furto","veiculo"],TRAFICO:["trafico"],BLOQUEIO:[]};function hw(t){return t.length?[...new Set(t.flatMap(n=>uO[n]||[]))]:Object.keys(Nc)}var Jg=null;async function gw(t){if(!t)return null;Jg??=Xg("oficial/indice.json","OFICIAL_INDICE",2);let n=await Jg;return n?n[t]?Xg(`oficial/${t}.json`,"OFICIAL_"+t+"_"+n[t].periodo,7):null:(Jg=null,null)}function bw(t,n,e){let i=new Map,o=(l,m,v)=>{let g=i.get(l)||{total:0,cats:{}};g.total+=v,g.cats[m]=(g.cats[m]||0)+v,i.set(l,g)},a=new Set(e),r=n.filter(l=>l.aneis?.length).map(l=>{let m=90,v=180,g=-90,y=-180;for(let _ of l.aneis)for(let[C,w]of _)C<m&&(m=C),C>g&&(g=C),w<v&&(v=w),w>y&&(y=w);return{b:l,s:m,w:v,n:g,e:y}}),s=(l,m)=>r.find(v=>l>=v.s&&l<=v.n&&m>=v.w&&m<=v.e&&Wg(l,m,v.b.aneis)),c=0;if(r.length){for(let l of t.pontos)if(a.has(l[2])){c++;let m=s(l[0],l[1]);m&&o(m.b.n,l[2],1)}for(let[l,m]of Object.entries(t.grade||{}))if(a.has(l))for(let[v,g,y]of m){c+=y;let _=s(v,g);_&&o(_.b.n,l,y)}}let d=new Map(n.filter(l=>!l.aneis?.length).map(l=>[Oe(l.n),l.n]));if(d.size||!r.length){for(let[l,m]of Object.entries(t.bairros)){let v=d.get(Oe(l))||(r.length?null:l);if(v)for(let[g,y]of Object.entries(m))a.has(g)&&o(v,g,y)}r.length||(c=Object.entries(t.cats).filter(([l])=>a.has(l)).reduce((l,[,m])=>l+m,0))}return{porBairro:i,total:c}}var vw=new Map,yw=new Map,eb=null;function Ii(t){let n=vw.get(t);if(n)return n;let e=typeof BASE_MUNICIPIOS_BR<"u"?BASE_MUNICIPIOS_BR:window.BASE_MUNICIPIOS_BR,i=[];if(e&&e.municipios[t]){let o=e.codigosUf[t];for(let a of e.municipios[t].split(";")){let r=a.split("|"),s={uf:t,nome:r[0],ibge:o+r[1],lat:Number(r[2]),lng:Number(r[3]),norm:Oe(r[0])};i.push(s),yw.set(s.ibge,s)}}return vw.set(t,i),i}function tb(){return eb||(eb=Object.keys(zt).flatMap(t=>Ii(t))),eb}function Tc(t,n){let e=Oe(n);return Ii(t).find(i=>i.norm===e)||null}function Kr(t){return tb(),yw.get(String(t||""))||null}function nb(t,n){let e=null,i=1/0;for(let o of tb()){let a=Yr(t,n,o.lat,o.lng);a<i&&(i=a,e=o)}return e}function _w(t){let n=String(t||"").trim(),e=n.replace(/\D/g,""),i=[];if(/^\d[\d\-\s.]*$/.test(n)&&e.length>=5)return i.push({tipo:"CEP",cep:e,rotulo:"Buscar CEP "+e.replace(/^(\d{5})(\d{0,3})/,"$1-$2"),detalhe:e.length===8?"Enter":"digite 8 n\xFAmeros"}),i;if(n.length<2)return i;let o=Oe(n);for(let s of Object.keys(zt))(Oe(zt[s].nome).startsWith(o)||s.toLowerCase()===o)&&i.push({tipo:"UF",uf:s,rotulo:"Estado: "+zt[s].nome,detalhe:s});let a=[],r=[];for(let s of tb()){if(a.length>=8)break;s.norm.startsWith(o)?a.push(s):r.length<8&&s.norm.indexOf(o)>0&&r.push(s)}a.sort((s,c)=>s.norm.length-c.norm.length);for(let s of a.concat(r).slice(0,8))i.push({tipo:"MUN",uf:s.uf,nome:s.nome,rotulo:s.nome,detalhe:s.uf});return i.slice(0,9)}var ob={cvli:{nome:"Mortes violentas intencionais",curto:"MVI",re:/^(homic[ií]dio doloso|latroc[ií]nio|les[aã]o corporal seguida de morte)$/i},intervencao:{nome:"Mortes por interven\xE7\xE3o policial",curto:"Interven\xE7\xE3o",re:/^morte por interven/i},tentativas:{nome:"Tentativas de homic\xEDdio",curto:"Tentativas",re:/^tentativa de homic/i},mulher:{nome:"Viol\xEAncia letal e sexual contra a mulher",curto:"Mulher",re:/^(feminic[ií]dio|tentativa de feminic[ií]dio|estupro|estupro de vulner[aá]vel)$/i},feminicidio:{nome:"Feminic\xEDdios",curto:"Feminic\xEDdio",re:/^feminic[ií]dio$/i},veiculos:{nome:"Roubos e furtos de ve\xEDculos",curto:"Ve\xEDculos",re:/^(roubo|furto) de ve[ií]culo/i},carga:{nome:"Roubos de carga e a bancos",curto:"Carga/bancos",re:/^roubo (de carga|a institui)/i},transito:{nome:"Mortes no tr\xE2nsito",curto:"Tr\xE2nsito",re:/^mortes? no tr[aâ]nsito/i},trafico:{nome:"Tr\xE1fico de drogas",curto:"Tr\xE1fico",re:/^tr[aá]fico de drogas/i},armas:{nome:"Armas de fogo apreendidas",curto:"Armas",re:/^arma de fogo apreendida/i},prisoes:{nome:"Mandados de pris\xE3o cumpridos",curto:"Pris\xF5es",re:/^mandado de pris/i},desaparecidos:{nome:"Pessoas desaparecidas",curto:"Desaparecidos",re:/^pessoa desaparecida/i}},za=t=>t.reduce((n,e)=>n+e,0),xw=t=>t.some(n=>n!=null)?t.reduce((n,e)=>n+(e||0),0):null,Ha=(t,n)=>n?Math.round(t/n*1e6)/10:null,ib=2e4;function Cw(t,n){let e=t.eventos.filter(r=>ob[n].re.test(r.nome));if(!e.length)return null;let i=Math.max(...e.map(r=>r.serie36.length)),o=new Array(i).fill(0);e.forEach(r=>r.serie36.forEach((s,c)=>o[c]+=s||0));let a={};return e.forEach(r=>Object.entries(r.federais||{}).forEach(([s,c])=>a[s]=(a[s]||0)+c)),{ano:xw(e.map(r=>r.sel!==void 0?r.sel:r.porAno[2])),anterior:xw(e.map(r=>r.selAnterior!==void 0?r.selAnterior:r.parcialAnterior)),total12:za(e.map(r=>r.total)),serie36:o,federais:a,eventos:e.map(r=>r.nome)}}var Sw=2.9;function mO(t,n,e){if(!t?.uf)return[];let i=(t?.rankings||[]).filter(r=>ob[n].re.test(r.evento)&&r.todas);if(!i.length)return[];let o=new Map;i.forEach(r=>r.todas.forEach(([s,c,d])=>{let l=o.get(s)||{n:s,total:0,anterior:0};l.total+=c,l.anterior+=d,o.set(s,l)}));let a=new Map(Ii(t.uf).map(r=>[r.norm,r.ibge]));return[...o.values()].map(r=>{let s=a.get(Oe(r.n))||null,c=s&&e&&e.porCodigo[s]||null;return{nome:r.n,ibge:s,pop:c,total:r.total,anterior:r.anterior,taxa:Ha(r.total,c)}})}function pO(t,n,e){if(!n||!e)return{pos:null,percentil:null};let i=new Map(t.filter(g=>g.ibge).map(g=>[g.ibge,g]));if(!n.porCodigo[e])return{pos:null,percentil:null};let a=Object.entries(n.porCodigo).filter(([g,y])=>y>=ib||g===e).map(([g,y])=>({c:g,t:Ha(i.get(g)?.total||0,y)||0}));if(a.length<5)return{pos:null,percentil:null};let r=a.find(g=>g.c===e).t,s=a.map(g=>g.t).sort((g,y)=>g-y),c=s.filter(g=>g<r).length,d=s.filter(g=>g===r).length,l=a.filter(g=>g.t>r).length+1,m=s[Math.floor(s.length/2)],v=za(t.map(g=>g.total));return{pos:{rank:l,total:a.length,taxa:r,mediana:m,taxaEstado:Ha(v,n.total)},percentil:Math.round((c+d/2)/s.length*100)}}function ww(t){let n=t.oficial?.disponivel&&t.oficial.anos?t.oficial:null,e=t.panorama?.oficial?.disponivel?t.panorama.oficial:null,i=n?.populacao||(t.ehEstado?t.pop?.total:t.ibge?t.pop?.porCodigo[t.ibge]:null)||null,o=t.pop?.total||null,a=n?.anos||[],r=n?.ultimoMes||"dez",s=n?.rotuloSel||(a.length?r==="dez"?String(a[2]):`jan\u2013${r}/${a[2]}`:""),c=n?.rotuloAnt||(a.length?String(a[1]):""),d=t.periodoDias>=365?"dos \xFAltimos 12 meses":t.periodoDias>=180?"dos \xFAltimos 6 meses":`dos \xFAltimos ${t.periodoDias} dias`,l=$=>n?Cw(n,$):null,m=$=>e?Cw(e,$):null,v=[],g=[],y=null,_=null,C=l("cvli"),w=mO(t.panorama,"cvli",t.pop),E=t.ehEstado?{pos:null,percentil:null}:pO(w,t.pop,t.ibge);_=E.pos;let U=" Alta pode indicar mais crime ou mais a\xE7\xE3o policial; por isso o cart\xE3o n\xE3o fica vermelho.",F=($,M={},pe="")=>{let ne=l($);if(!ne||!ne.total12&&!ne.ano)return;let Se=m($),rt=Ha(ne.total12,i),Gn=Se&&o?Ha(Se.total12,o):null,$e=Mi(ne.ano,ne.anterior),Zt=Math.max(ne.ano||0,ne.anterior||0)<10,_t=!t.ehEstado&&rt!=null&&Gn?rt/Gn:null,fn=_t==null?"":_t>=1.1?` \xB7 ${Ee(_t)}\xD7 o estado`:_t<=.9?` \xB7 ${Ee(_t)}\xD7 o estado`:" \xB7 na m\xE9dia do estado";v.push(I({id:$,titulo:ob[$].nome,valor:T(ne.ano),sub:`${s}`+(rt!=null?` \xB7 ${Ee(rt)}/100 mil em 12 meses`:"")+fn,delta:[ne.ano,ne.anterior],instavel:Zt,tom:$e==null?"neutro":$e>5?"alerta":$e<-5?"positivo":"neutro",fonte:"Sinesp",dica:`Soma de: ${ne.eventos.join(", ")}. ${s} comparado a ${c}.`+(rt!=null?" Taxa = registros dos \xFAltimos 12 meses \xF7 popula\xE7\xE3o (IBGE) \xD7 100 mil.":"")+(Gn!=null?` Estado: ${Ee(Gn)} por 100 mil.`:"")+(Zt?" Poucos casos: a varia\xE7\xE3o percentual oscila muito.":"")+pe},M))};if(n){if(F("cvli",{destaque:!0}),!t.ehEstado&&_){let pe=_.taxaEstado!=null&&_.taxa>_.taxaEstado;v.push({id:"posicao",titulo:"Posi\xE7\xE3o no estado (MVI por 100 mil)",valor:`${_.rank}\xBA`,unidade:`de ${_.total}`,sub:`taxa ${Ee(_.taxa)} \xB7 mediana ${Ee(_.mediana)} \xB7 estado ${Ee(_.taxaEstado)}`,tom:pe?"alerta":"positivo",fonte:"Sinesp + IBGE",dica:`Ordem decrescente da taxa de mortes violentas intencionais (12 meses) entre os munic\xEDpios do estado com ${T(ib)} habitantes ou mais. 1\xBA = mais violento.`})}F("tentativas"),F("mulher"),F("veiculos"),F("trafico",{tom:"neutro"},U),F("armas",{tom:"neutro"},U),F("prisoes",{tom:"neutro"},U),F("intervencao"),F("carga"),F("transito"),F("desaparecidos");let $={};n.eventos.forEach(pe=>Object.entries(pe.federais||{}).forEach(([ne,Se])=>$[ne]=($[ne]||0)+Se));let M=za(Object.values($));v.push({id:"federais",titulo:"Registros da PRF e da PF",valor:T(M),sub:M?Object.entries($).map(([pe,ne])=>`${pe} ${T(ne)}`).join(" \xB7 ")+" \xB7 12 meses":"nenhum registro federal neste local em 12 meses",tom:"neutro",fonte:"Sinesp",dica:"O Sinesp separa o que foi lan\xE7ado pela Pol\xEDcia Rodovi\xE1ria Federal e pela Pol\xEDcia Federal. O restante vem das pol\xEDcias Civil e Militar, pelas secretarias estaduais."})}let j=t.f12,Ie=(j.porCat.CVLI||0)+(j.porCat.CONFRONTO||0),tt=t.bairros.filter($=>$.qtd>0);if(v.push({id:"noticias",titulo:`Ocorr\xEAncias noticiadas (${d.replace("dos \xFAltimos ","")})`,valor:T(j.todas.length),sub:`${T(Ie)} homic\xEDdios ou tiroteios \xB7 ${T(j.porCat.TRAFICO||0)} tr\xE1fico \xB7 ${rn(j.precisas.length,j.todas.length)}% com local preciso`,tom:"neutro",fonte:"Not\xEDcias",dica:"Google Not\xEDcias e imprensa local, classificadas automaticamente. Complementam o Sinesp com o onde e o quando, mas n\xE3o medem o total de crimes."}),!t.ehEstado){let $=j.zonas;v.push({id:"bairros",titulo:"Bairros com ocorr\xEAncia",valor:T(tt.length),unidade:t.bairrosOsm?`de ${T(t.bairrosOsm)}`:"",sub:(tt[0]?`mais citado: ${tt[0].nome} (${T(tt[0].qtd)})`:"nenhum bairro citado")+` \xB7 ${T($.length)} zonas vermelhas`,tom:$.some(M=>M.nivel==="critica")?"alerta":"neutro",fonte:"Not\xEDcias + IBGE",dica:"Cada not\xEDcia \xE9 ligada ao bairro pelo contorno oficial do IBGE (OpenStreetMap onde o IBGE n\xE3o tem) ou pelo nome citado. Zonas vermelhas = concentra\xE7\xF5es de ocorr\xEAncias graves e recentes."})}if(!t.ehEstado&&n){let $=[],M=t.referencia,pe=($e,Zt)=>{if(!$e.length)return null;let _t=0,fn=0;for(let yb of $e)yb<Zt?_t++:yb===Zt&&fn++;return Math.round((_t+fn/2)/$e.length*100)},ne=t.ibge?M?.municipios[t.ibge]:void 0,Se=ne?.[2]??E.pos?.taxa??(C?Ha(C.total12,i):null),rt=[];if(M&&Se!=null){let $e=pe(M.taxas,Se),Zt=M.sim?`DATASUS ${M.sim.ano}${M.sim.preliminar?" (preliminar)":""}`:"DATASUS",_t=ne?ne[4]>ne[3]?`${Zt}: ${T(ne[4])} mortes por agress\xE3o ou interven\xE7\xE3o policial`:`Sinesp ${M.periodo}: ${T(ne[3])} mortes violentas`:"Sinesp";$.push({nome:"Letalidade no Brasil (mortes violentas por 100 mil)",peso:60,valor:$e,texto:`${Ee(Se)} por 100 mil (${_t}); mais alta que ${$e}% dos ${T(M.taxas.length)} munic\xEDpios do pa\xEDs com 20 mil hab. ou mais (Brasil: ${Ee(M.brasil.taxa)})`}),ne&&(rt.push(`Mortes violentas em 12 meses: ${T(ne[0])} (${Ee(Se)} por 100 mil habitantes, popula\xE7\xE3o IBGE ${T(ne[1])}).`),rt.push(`Duas fontes oficiais s\xE3o comparadas e vale a maior, sem somar: Sinesp/Minist\xE9rio da Justi\xE7a, ${M.periodo}, com ${T(ne[3])} (homic\xEDdio doloso, latroc\xEDnio e les\xE3o corporal seguida de morte), e ${Zt}, Minist\xE9rio da Sa\xFAde, atestados de \xF3bito, com ${T(ne[4])} (agress\xF5es e mortes por interven\xE7\xE3o policial).`)),rt.push(`Posi\xE7\xE3o: taxa mais alta que ${$e}% dos ${T(M.taxas.length)} munic\xEDpios brasileiros com 20 mil habitantes ou mais (Brasil: ${Ee(M.brasil.taxa)} por 100 mil). Peso de 60%.`)}else E.percentil!=null&&$.push({nome:"Letalidade no estado",peso:60,valor:E.percentil,texto:`mais alta que ${E.percentil}% dos munic\xEDpios compar\xE1veis do estado (refer\xEAncia nacional ainda carregando)`});if(t.isp?.areas?.length&&i){let $e=za(t.isp.areas.map(_t=>_t.u12.hom_por_interv_policial||0)),Zt=$e/i*1e5;$.push({nome:"Mortes por interven\xE7\xE3o policial",peso:15,valor:Math.round(Math.min(100,Zt/(2*Sw)*100)),texto:`${T($e)} em 12 meses (ISP-RJ), ${Ee(Zt)} por 100 mil; m\xE9dia do Brasil \u2248 ${Ee(Sw)}`}),rt.push(`Mortes por interven\xE7\xE3o policial: ${T($e)} em 12 meses pelo ISP-RJ (${Ee(Zt)} por 100 mil; o dobro da m\xE9dia do Brasil vale 100). Peso de 15%.`)}if(t.tiroteios&&i){let $e=t.tiroteios.length/i*1e5;$.push({nome:"Tiroteios verificados",peso:15,valor:Math.round(Math.min(100,$e/40*100)),texto:`${T(t.tiroteios.length)} tiroteios em 12 meses (Fogo Cruzado), ${Ee($e)} por 100 mil (40 ou mais = 100)`}),rt.push(`Tiroteios verificados pelo Instituto Fogo Cruzado: ${T(t.tiroteios.length)} em 12 meses (${Ee($e)} por 100 mil; 40 ou mais vale 100). Peso de 15%.`)}if(C&&C.anterior!=null&&Math.max(C.ano||0,C.anterior)>=10){let $e=Mi(C.ano,C.anterior)||0;rt.push(`Tend\xEAncia: ${$e>0?"+":""}${$e}% de mortes violentas (Sinesp) em ${s} contra ${c}; est\xE1vel vale 50. Peso de 10%.`),$.push({nome:"Tend\xEAncia",peso:10,valor:Math.round(Math.max(0,Math.min(100,50+$e))),texto:`${$e>0?"+":""}${$e}% de mortes violentas em ${s}`})}let Gn=za($.map($e=>$e.peso));if(Gn>=60){let $e=Math.round(za($.map(fn=>fn.valor*fn.peso))/Gn),[Zt,_t]=$e>=75?["Muito alto","#b91c1c"]:$e>=55?["Alto","#ea580c"]:$e>=35?["Moderado","#ca8a04"]:["Baixo","#16a34a"];y={valor:$e,nivel:Zt,cor:_t,componentes:$,metodo:[...rt,$.length<4?"Onde n\xE3o h\xE1 dado de interven\xE7\xE3o policial ou de tiroteios, o peso \xE9 redistribu\xEDdo entre os demais componentes.":"","Resultado: m\xE9dia ponderada dos componentes, de 0 a 100 (0\u201334 baixo, 35\u201354 moderado, 55\u201374 alto, 75+ muito alto)."].filter(Boolean),dica:"\xCDndice de 0 a 100, compar\xE1vel entre quaisquer munic\xEDpios do Brasil: a maior parte do peso vem da taxa de mortes violentas por habitante, comparada com todos os munic\xEDpios do pa\xEDs com 20 mil hab. ou mais (Sinesp, mesmo per\xEDodo). Onde h\xE1 dados, entram tamb\xE9m mortes por interven\xE7\xE3o policial (ISP-RJ) e tiroteios verificados (Fogo Cruzado). Tamanho da cidade n\xE3o conta. M\xE9dia ponderada: "+$.map(fn=>`${fn.nome} (${Math.round(fn.peso/Gn*100)}%)`).join(", ")+"."}}}if(n&&C){let $=Mi(C.ano,C.anterior),M=Math.max(C.ano||0,C.anterior||0)<10;g.push(`${t.nomeLocal} registrou ${T(C.ano)} mortes violentas intencionais em ${s}`+($!=null?`, ${$>0?"alta de "+$:$<0?"queda de "+Math.abs($):"mesmo n\xFAmero que"}${$?"%":""} em rela\xE7\xE3o a ${c}`:"")+(M?" (base pequena, a varia\xE7\xE3o percentual oscila muito)":"")+".");let pe=Ha(C.total12,i);if(_&&pe!=null){let fn=_.taxaEstado?pe/_.taxaEstado:null;g.push(`Em 12 meses, a taxa \xE9 de ${Ee(pe)} por 100 mil habitantes`+(fn?`, ${fn>=1.1?Ee(fn)+" vezes a do estado":fn<=.9?"abaixo da do estado":"pr\xF3xima da do estado"} (${Ee(_.taxaEstado)})`:"")+`, o que p\xF5e o munic\xEDpio em ${_.rank}\xBA entre ${_.total} munic\xEDpios com mais de 20 mil habitantes.`)}else pe!=null&&g.push(`Em 12 meses, a taxa \xE9 de ${Ee(pe)} por 100 mil habitantes.`);let ne=!t.ehEstado&&t.ibge?t.referencia?.municipios[t.ibge]:void 0;ne&&t.referencia?.sim&&ne[4]>ne[3]*1.15&&ne[4]-ne[3]>=5&&g.push(`Os atestados de \xF3bito do DATASUS (${t.referencia.sim.ano}${t.referencia.sim.preliminar?", preliminar":""}) registram ${T(ne[4])} mortes por agress\xE3o ou a\xE7\xE3o policial, mais que as ${T(ne[3])} do Sinesp; o \xEDndice de risco usa o n\xFAmero maior (${Ee(ne[2])} por 100 mil).`);let Se=l("mulher"),rt=l("veiculos"),Gn=l("tentativas"),$e=l("trafico"),Zt=l("armas"),_t=[];Gn?.ano&&_t.push(`${T(Gn.ano)} tentativas de homic\xEDdio`),Se?.ano&&_t.push(`${T(Se.ano)} casos de viol\xEAncia letal ou sexual contra a mulher`),rt?.ano&&_t.push(`${T(rt.ano)} roubos e furtos de ve\xEDculos`),$e?.ano&&_t.push(`${T($e.ano)} ocorr\xEAncias de tr\xE1fico de drogas`),Zt?.ano&&_t.push(`${T(Zt.ano)} armas de fogo apreendidas`),_t.length&&g.push(`No mesmo per\xEDodo, ${_t.join(", ")}.`)}else n||g.push(`Estat\xEDstica oficial do Sinesp indispon\xEDvel para ${t.nomeLocal}: ${t.oficial?.motivo||"aguardando o servidor"}. O retrato abaixo usa s\xF3 as not\xEDcias, que s\xE3o complemento.`);if(j.todas.length){let $=tt.slice(0,3);g.push(`Nas not\xEDcias ${d} (complemento), ${T(j.todas.length)} ocorr\xEAncias`+($.length?`; os bairros mais citados s\xE3o ${$.map(M=>`${M.nome} (${T(M.qtd)})`).join(", ")}`:"")+(j.zonas[0]?` e a principal zona vermelha fica em ${j.zonas[0].nome.split(",")[0]}`:"")+".")}y&&g.push(`\xCDndice de risco local: ${y.valor} de 100 (${y.nivel.toLowerCase()}) na compara\xE7\xE3o com o Brasil.`);let vn=null;if(n&&C&&C.serie36.length){let $=["jan","fev","mar","abr","mai","jun","jul","ago","set","out","nov","dez"],M=C.serie36.map((ne,Se)=>$[Se%12]+"/"+String(a[0]+Math.floor(Se/12)).slice(2)),pe=new Map;j.serie.labels.forEach((ne,Se)=>pe.set(ne,za(Object.values(j.serie.porCat).map(rt=>rt[Se]||0)))),vn={labels:M,mvi:C.serie36,noticias:M.map(ne=>pe.has(ne)?pe.get(ne):null)}}let Pt=[{nome:"Sinesp \xB7 pol\xEDcias Civil e Militar (SSP)",estado:n?"ok":"sem",detalhe:n?`at\xE9 ${r}/${n.anoUltimoDado} \xB7 importado em ${n.importadoEm}`:t.oficial?.motivo||"aguardando",dica:"Registros oficiais do Minist\xE9rio da Justi\xE7a, enviados pelas secretarias estaduais. Um rob\xF4 confere todo dia se h\xE1 m\xEAs novo."},{nome:"Sinesp \xB7 PRF e PF",estado:n?"ok":"sem",detalhe:n?"separados pelo campo abrang\xEAncia":"\u2014",dica:"Ocorr\xEAncias lan\xE7adas pelas pol\xEDcias federais, dentro da mesma base do Sinesp."},{nome:"IBGE \xB7 popula\xE7\xE3o",estado:i?"ok":"parcial",detalhe:i?`${T(i)} hab. (${t.pop?.ano||n?.anoPopulacao||""})`:"carregando",dica:"Estimativa populacional usada nas taxas por 100 mil habitantes."},{nome:"Not\xEDcias \xB7 Google Not\xEDcias e imprensa local",estado:j.todas.length?"ok":"parcial",detalhe:t.ultimaColeta?`coletadas em ${t.ultimaColeta}`:"em coleta",dica:"Complemento: localizam e datam ocorr\xEAncias, mas n\xE3o medem o total."}];t.ehEstado||Pt.push({nome:"OpenStreetMap \xB7 bairros",estado:t.bairrosOsm?"ok":t.bairrosCarregando?"parcial":"sem",detalhe:t.bairrosOsm?`${T(t.bairrosOsm)} bairros`:t.bairrosCarregando?"carregando":"sem bairros cadastrados",dica:"Nomes e contornos dos bairros para ligar as not\xEDcias ao bairro."}),Pt.push({nome:"Guarda Municipal e COPOM/190",estado:"sem",detalhe:"sem estat\xEDstica aberta nacional",dica:"N\xE3o h\xE1 base p\xFAblica nacional. Aparecem s\xF3 quando citados nas not\xEDcias."});let ue=t.ehEstado?w.filter($=>($.pop||0)>=ib&&$.taxa!=null).sort(($,M)=>M.taxa-$.taxa).slice(0,12):[];return{parecer:g,indicadores:v,risco:y,posicao:_,fontes:Pt,serie:vn,municipios:ue}}var Ew=t=>vt[t]?.cor||"#64748b",Dw=t=>vt[t]?.curto||"";var fO=["domingo","segunda-feira","ter\xE7a-feira","quarta-feira","quinta-feira","sexta-feira","s\xE1bado"],hO=t=>t.charAt(0).toLowerCase()+t.slice(1),Mw=t=>t+"\xBA";function Gu(t){let n=[],e=[],i=t.oficial&&t.oficial.disponivel?t.oficial:null;if(i&&i.eventos.length&&i.anos){let[l,m,v]=i.anos,g=i.ultimoMes||"dez",y=g!=="dez";i.eventos.map(E=>({e:E,a:E.sel!==void 0?E.sel:E.porAno[2],b:E.selAnterior!==void 0?E.selAnterior:E.parcialAnterior})).map(E=>W(I({},E),{v:Mi(E.a,E.b)})).filter(E=>E.v!==null&&Math.abs(E.v)>=10&&Math.max(E.a||0,E.b||0)>=10).slice(0,3).forEach(({e:E,v:U,a:F,b:j})=>{let Ie=U>0;n.push({icone:Ie?"trending_up":"trending_down",tom:Ie?"alerta":"positivo",fonte:"Sinesp",titulo:`${E.nome}: ${Ie?"+":""}${U}% em ${i.rotuloSel||v}`,texto:`${T(F)} registros em ${i.rotuloSel||"jan a "+g+"/"+v}, contra ${T(j)} em ${i.rotuloAnt||"igual per\xEDodo de "+m}.`})});let C=i.eventos[0];if(C.serie.length===12){let E=C.serie[11],U=C.serie.slice(0,11).reduce((F,j)=>F+j,0)/11;if(U>=5&&(E>U*1.3||E<U*.7)){let F=E>U;n.push({icone:F?"warning":"check_circle",tom:F?"alerta":"positivo",fonte:"Sinesp",titulo:`${i.meses?.[11]||g}: m\xEAs ${F?"acima":"abaixo"} da m\xE9dia`,texto:`${C.nome}: ${T(E)} no \xFAltimo m\xEAs publicado, contra m\xE9dia de ${T(Math.round(U))} por m\xEAs no ano anterior.`})}}if(!t.ehEstado){let U=i.eventos.filter(F=>F.taxa!=null&&F.taxaEstado&&F.total>=5).map(F=>({e:F,r:F.taxa/F.taxaEstado})).filter(F=>F.r>=1.25||F.r<=.75).sort((F,j)=>Math.abs(Math.log(j.r))-Math.abs(Math.log(F.r)))[0];if(U){let F=U.r>1;n.push({icone:F?"priority_high":"verified",tom:F?"alerta":"positivo",fonte:"Sinesp + IBGE",titulo:F?`${Ee(U.r)}\xD7 a taxa do estado`:`Taxa ${rn(1-U.r,1)}% menor que a do estado`,texto:`${U.e.nome}: ${Ee(U.e.taxa)} por 100 mil habitantes em ${t.cidade}, contra ${Ee(U.e.taxaEstado)} no estado (12 meses).`})}}if(!t.ehEstado&&t.panorama?.rankings?.length){let E=Oe(t.cidade);for(let U of t.panorama.rankings.slice(0,3)){let F=U.porTotal.findIndex(Ie=>Oe(Ie.n)===E),j=U.porTaxa.findIndex(Ie=>Oe(Ie.n)===E);if(F>=0&&F<10){n.push({icone:"leaderboard",tom:F<3?"alerta":"neutro",fonte:"Sinesp",titulo:`${Mw(F+1)} do estado em ${hO(U.evento)}`,texto:`Entre ${T(U.municipiosComRegistro)} munic\xEDpios com registro nos \xFAltimos 12 meses`+(j>=0?`; ${Mw(j+1)} na taxa por 100 mil habitantes.`:".")});break}}}if(C.porAno[0]&&C.porAno[1]!=null){let E=Mi(C.porAno[1],C.porAno[0]);E!==null&&Math.abs(E)>=5&&n.push({icone:"calendar_month",tom:E>0?"alerta":"positivo",fonte:"Sinesp",titulo:`${m} fechou ${E>0?"acima":"abaixo"} de ${l}`,texto:`${C.nome}: ${T(C.porAno[1])} em ${m} contra ${T(C.porAno[0])} em ${l} (${E>0?"+":""}${E}%).`+(y?` ${v} tem dados at\xE9 ${g}.`:"")})}let w=i.eventos.map(E=>({e:E,s:E.federais?Object.values(E.federais).reduce((U,F)=>U+F,0):0})).filter(E=>E.e.total>=10&&E.s/E.e.total>=.15).sort((E,U)=>U.s/U.e.total-E.s/E.e.total)[0];if(w){let E=Object.keys(w.e.federais).map(U=>an[U]?.curto||U).join(" e ");n.push({icone:"local_police",tom:"neutro",fonte:"Sinesp",titulo:`${rn(w.s,w.e.total)}% registrados por ${E}`,texto:`${w.e.nome}: ${T(w.s)} de ${T(w.e.total)} registros dos \xFAltimos 12 meses vieram de \xF3rg\xE3os federais.`})}}if(t.ehEstado&&t.panorama?.rankings?.length){let l=t.panorama.rankings[0],m=i?.eventos.find(_=>_.nome===l.evento)?.total||0,v=l.porTotal.slice(0,5).reduce((_,C)=>_+C.total,0);m>0&&l.porTotal.length>=5&&n.push({icone:"donut_large",tom:"neutro",fonte:"Sinesp",titulo:`${rn(v,m)}% em 5 munic\xEDpios`,texto:`${l.evento}: ${l.porTotal.slice(0,5).map(_=>_.n).join(", ")} somam ${T(v)} de ${T(m)} registros do estado.`});let g=l.altas[0];g&&g.total-g.anterior>=5&&n.push({icone:"north_east",tom:"alerta",fonte:"Sinesp",titulo:`Maior alta: ${g.n}`,texto:`${l.evento}: ${T(g.total)} nos \xFAltimos 12 meses, ${T(g.total-g.anterior)} a mais que nos 12 anteriores.`});let y=l.porTaxa[0];y&&n.push({icone:"percent",tom:"alerta",fonte:"Sinesp + IBGE",titulo:`Maior taxa: ${y.n}`,texto:`${l.evento}: ${Ee(y.taxa)} por 100 mil habitantes (munic\xEDpios com 20 mil habitantes ou mais).`})}let o=t.f,a=o.todas.length,r=Zr(t.periodoDias);if(o.comparavel&&a+o.anteriores.length>=8){let l=Mi(a,o.anteriores.length);l!==null&&Math.abs(l)>=15&&e.push({icone:l>0?"campaign":"south_east",tom:l>0?"alerta":"positivo",fonte:"Not\xEDcias",titulo:`Notici\xE1rio ${l>0?"em alta":"em queda"}: ${l>0?"+":""}${l}%`,texto:`${T(a)} ocorr\xEAncias noticiadas nos \xFAltimos ${r}, contra ${T(o.anteriores.length)} nos ${r} anteriores.`})}let s=o.zonas[0];if(s&&e.push({icone:"crisis_alert",tom:"alerta",fonte:"Not\xEDcias",titulo:`Zona mais cr\xEDtica: ${s.nome.split(",")[0]}`,texto:`${T(s.qtd)} ocorr\xEAncias${s.graves?`, ${T(s.graves)} com homic\xEDdio ou tiroteio`:""}`+(s.recentes>s.anteriores30?"; em alta nos \xFAltimos 30 dias.":".")}),a>=14){let l=Math.max(...o.semana),m=a/7;if(l>=m*1.5){let v=o.semana.indexOf(l);e.push({icone:"event",tom:"neutro",fonte:"Not\xEDcias",titulo:`Pico \xE0s ${zu[v].toLowerCase()}s`,texto:`${rn(l,a)}% das ocorr\xEAncias noticiadas ca\xEDram numa ${fO[v]}.`})}}let c=Object.keys(o.porCat).sort((l,m)=>o.porCat[m]-o.porCat[l]);if(a>=10&&c.length){let l=vt[c[0]];e.push({icone:"category",tom:"neutro",fonte:"Not\xEDcias",titulo:`Predom\xEDnio de ${l.curto.toLowerCase()}`,texto:`${rn(o.porCat[l.id],a)}% das not\xEDcias dos \xFAltimos ${r} tratam de ${l.nome.toLowerCase()}.`})}let d=Object.keys(o.porOrgao).sort((l,m)=>o.porOrgao[m].qtd-o.porOrgao[l].qtd)[0];return d&&o.totalCruzamento>=10&&e.push({icone:"hub",tom:"neutro",fonte:"Not\xEDcias",titulo:`${an[d].nome} \xE9 a fonte mais citada`,texto:`Aparece em ${rn(o.porOrgao[d].qtd,o.totalCruzamento)}% das not\xEDcias; ${rn(o.imprensaLocal,o.totalCruzamento)}% vieram da imprensa local.`}),[...n.slice(0,6),...e.slice(0,4)]}var gO=[t=>`https://servicodados.ibge.gov.br/api/v3/agregados/6579/periodos/-1/variaveis/9324?localidades=N6[N3[${t}]]`,t=>`https://servicodados.ibge.gov.br/api/v3/agregados/4709/periodos/-1/variaveis/93?localidades=N6[N3[${t}]]`];async function rb(t){let n="POPULACAO_"+t,e=await gt.obter(n,180);if(e)return e;for(let i of gO)try{let o=await $n(i(zt[t].ibge),15e3);if(!o.ok)continue;let r=(await o.json())?.[0]?.resultados?.[0]?.series||[],s={},c="";for(let l of r){let[m,v]=Object.entries(l.serie||{})[0]||[];v&&/^\d+$/.test(String(v))&&(s[String(l.localidade.id)]=Number(v),c=String(m))}if(Object.keys(s).length<10)continue;let d={uf:t,ano:c,porCodigo:s,total:Object.values(s).reduce((l,m)=>l+m,0)};return gt.salvar(n,d),d}catch{}return null}var ab=(t,n)=>n&&n>0?Math.round(t/n*1e6)/10:null;function Iw(t){return new Map(Ii(t).map(n=>[n.norm,n.ibge]))}function kw(t,n,e,i,o,a){if(!t||!t.disponivel||!o||o.uf!==n||t.eventos.every(d=>d.taxa!=null))return t;let r=i?null:Iw(n).get(Oe(e))||null,s=i?o.total:r?o.porCodigo[r]:null;if(!s)return t;let c=new Map((a?.uf===n?a.oficial?.eventos||[]:[]).map(d=>[d.nome,d.total]));return W(I({},t),{populacao:s,anoPopulacao:Number(o.ano)||t.anoPopulacao,codigoIbge:r||t.codigoIbge,eventos:t.eventos.map(d=>W(I({},d),{taxa:d.taxa??ab(d.total,s),taxaEstado:i?d.taxaEstado:d.taxaEstado??(c.has(d.nome)?ab(c.get(d.nome),o.total):null)}))})}function Nw(t,n){if(!t?.disponivel||!t.rankings||!n||n.uf!==t.uf||t.rankings.every(a=>a.porTaxa.length||!a.todas))return t;let e=Iw(t.uf),i=(a,r,s)=>{let c=e.get(Oe(a))||null,d=c&&n.porCodigo[c]||null;return{n:a,ibge:c,pop:d,total:r,anterior:s,taxa:ab(r,d)}},o=t.rankings.map(a=>{if(!a.todas)return a;let r=a.todas.map(([l,m,v])=>i(l,m,v)),s={};r.forEach(l=>{l.ibge&&l.taxa!==null&&(s[l.ibge]=l.taxa)});let c=new Map(r.map(l=>[l.n,l])),d=l=>l.map(m=>c.get(m.n)||m);return W(I({},a),{valoresTaxa:s,porTotal:d(a.porTotal),altas:d(a.altas),quedas:d(a.quedas),porTaxa:r.filter(l=>(l.pop||0)>=2e4&&l.taxa!==null).sort((l,m)=>m.taxa-l.taxa).slice(0,15)})});return W(I({},t),{rankings:o,anoPopulacao:t.anoPopulacao||Number(n.ano)||null})}function Wu(t){return t<=31?1:t<=95?3:t<=190?6:12}function sb(t,n){let e=t[Math.floor(n/12)];return`${qr[(n%12+12)%12]}/${e}`}function qu(t,n){if(!t?.disponivel||!t.anos?.length||!t.eventos?.length)return t;let i=Math.max(0,t.anos.indexOf(t.anoUltimoDado??t.anos[t.anos.length-1]))*12+(t.fimMesIdx??11),o=i-n+1;if(o-12<0)return t;let a=(s,c,d)=>{let l=0;for(let m=c;m<=d;m++)l+=s[m]||0;return l},r=(s,c)=>s===c?sb(t.anos,s):`${sb(t.anos,s)}\u2013${sb(t.anos,c)}`;return W(I({},t),{mesesSel:n,rotuloSel:r(o,i),rotuloAnt:r(o-12,i-12),eventos:t.eventos.map(s=>s.serie36?.length>i?W(I({},s),{sel:a(s.serie36,o,i),selAnterior:a(s.serie36,o-12,i-12)}):W(I({},s),{sel:s.porAno[2],selAnterior:s.parcialAnterior}))})}var Ac=(t,n)=>t+"|"+Oe(n),kt=class t{uf=G(fe.UF_PADRAO);cidade=G("");escopo=G("CIDADE");periodoDias=G(fe.PERIODO_PADRAO_DIAS);categorias=G([]);orgao=G("");aba=G("PANORAMA");camadas=G({zonas:!0,calor:!0,pinos:!0,bairros:!0,fronteira:!0,vizinhos:!0,satelite:!1,mapaEscuro:!1,coropletico:!0,delegacias:!0,oficial:!0});dados=G(null);carregando=G(!1);coletando=G(!1);status=G({icone:"hourglass_empty",texto:"Iniciando\u2026",tipo:""});panoramaBruto=G(null);populacao=G(null);panorama=P(()=>Nw(rw(this.panoramaBruto()),this.populacao()));panoramaCarregando=G(!1);eventoPanorama=G(0);escuro=G(!1);foco=G(null);nomeLocal=P(()=>this.escopo()==="ESTADO"?zt[this.uf()].nome:`${this.cidade()} \u2014 ${this.uf()}`);filtrados=P(()=>{let n=Mc(this.dados(),this.periodoDias(),this.categorias(),this.orgao(),this.escopo()==="ESTADO");return this.orgao()?n:this.comTiroteios(n,this.periodoDias(),this.categorias())});comTiroteios(n,e,i){let o=vO(this.fogoCidade()?.dado?.itens,this.cidade(),e,i);if(!o.length)return n;let a=s=>Math.round(Ec(s).getTime()/864e5),r=n.precisas.filter(s=>!((s.cat==="CVLI"||s.cat==="CONFRONTO")&&o.some(c=>Math.abs(a(c.ts)-a(s.ts))<=1&&Yr(s.lat,s.lng,c.lat,c.lng)<1)));return W(I({},n),{zonas:Hg([...r,...o]),tiroteiosZonas:o.length,duplicadasFogo:n.precisas.length-r.length})}filtrados12=P(()=>this.comTiroteios(Mc(this.dados(),fe.DIAS_HISTORICO_SERVIDOR,[],"",this.escopo()==="ESTADO"),fe.DIAS_HISTORICO_SERVIDOR,[]));ibgeCidade=P(()=>this.escopo()==="CIDADE"&&(this.dados()?.codigoIbge||Tc(this.uf(),this.cidade())?.ibge)||"");bairrosOsm=G(null);listaBairros=P(()=>{let n=this.bairrosOsm(),e=this.dados();return this.escopo()!=="CIDADE"||!e?[]:n?.ibge===this.ibgeCidade()&&n.lista.length?n.lista:e.bairros||[]});isp=G(null);fogo=G(null);referencia=G(null);oficialArea=G(null);oficialCidade=P(()=>{let n=this.oficialArea();return n&&this.escopo()==="CIDADE"&&n.ibge===this.ibgeCidade()?n.dado:null});oficialBairros=P(()=>{let n=this.oficialCidade();if(!n)return null;let e=hw(this.categorias());return W(I({},bw(n,this.listaBairros(),e)),{cats:e,dado:n})});ispCidade=P(()=>{let n=this.isp();return n&&n.ibge===this.ibgeCidade()?n.dado:null});fogoCidade=P(()=>{let n=this.fogo();return n&&this.escopo()==="CIDADE"&&n.chave===this.uf()+"|"+this.cidade()?n:null});bairrosMapa=P(()=>qg(this.listaBairros(),this.filtrados().todas));bairros12=P(()=>qg(this.listaBairros(),this.filtrados12().todas));oficial=P(()=>{let n=this.dados(),e=this.escopo()==="ESTADO",i=n?.oficial?$g(n.oficial):e&&this.panorama()?.oficial||null;return qu(kw(i,this.uf(),this.cidade(),e,this.populacao(),this.panorama()),Wu(this.periodoDias()))});insights=P(()=>Gu({ehEstado:this.escopo()==="ESTADO",nomeLocal:this.nomeLocal(),cidade:this.cidade(),oficial:this.oficial(),panorama:this.panorama()?.uf===this.uf()?this.panorama():null,f:this.filtrados(),periodoDias:this.periodoDias()}));compilado=P(()=>{let n=this.dados(),e=this.escopo()==="ESTADO",i=this.bairrosOsm();return ww({ehEstado:e,nomeLocal:this.nomeLocal(),cidade:this.cidade(),uf:this.uf(),ibge:this.ibgeCidade()||null,oficial:this.oficial(),panorama:this.panorama()?.uf===this.uf()?this.panorama():null,pop:this.populacao(),f12:this.filtrados(),bairros:this.bairrosMapa().lista,periodoDias:this.periodoDias(),bairrosOsm:e?0:i?.lista.length||n?.bairros?.length||0,bairrosCarregando:!!i?.carregando,ultimaColeta:n?.ultimaColeta||"",referencia:this.referencia(),isp:this.ispCidade(),tiroteios:this.fogoCidade()?.dado?.itens||null})});tokenAbertura=0;memoria=new Map;panoramas=new Map;constructor(){setInterval(()=>this.buscarNovidades(),fe.MINUTOS_ATUALIZACAO_AUTOMATICA*6e4),setTimeout(()=>yO().then(e=>this.referencia.set(e)),1500),document.addEventListener("visibilitychange",()=>{document.visibilityState==="visible"&&this.buscarNovidades()});let n=Dc(fe.CHAVE_TEMA);this.definirTema(n?n==="escuro":window.matchMedia?.("(prefers-color-scheme: dark)").matches,!1)}ultimaBusca=Date.now();buscarNovidades(){if(document.visibilityState!=="visible"||this.escopo()!=="CIDADE"||this.carregando()||this.coletando()||Date.now()-this.ultimaBusca<6e4)return;this.ultimaBusca=Date.now();let n=this.dados();if(!n)return;let e=this.uf(),i=this.cidade(),o=this.tokenAbertura,a=this.memoria.get(Ac(e,i))?.res||null;ui.cidade(e,i,n.centroLat,n.centroLng,!1,cb(a)).then(r=>{this.receber(r,o)&&(r.precisaColeta?this.coletar(e,i,n.centroLat,n.centroLng,o):this.definirStatus("check_circle","Dados de "+(r.ultimaColeta||r.atualizadoEm)+" \xB7 atualiza\xE7\xE3o autom\xE1tica","ok"))}).catch(()=>{}),this.recarregarFogo()}recarregarFogo(){let n=this.fogo();if(!n||n.carregando)return;let[e,i]=n.chave.split("|");Qg(e,i,!0).then(o=>{this.fogo()?.chave===n.chave&&o?.configurado&&!o.erro&&this.fogo.set({chave:n.chave,dado:o,carregando:!1})})}definirTema(n,e=!0){this.escuro.set(n),document.documentElement.classList.toggle("tema-escuro",n),e&&ja(fe.CHAVE_TEMA,n?"escuro":"claro")}alternarCamada(n){this.camadas.update(e=>W(I({},e),{[n]:!e[n]}))}alternarCategoria(n){if(!n){this.categorias.set([]);return}this.categorias.update(e=>e.includes(n)?e.filter(i=>i!==n):[...e,n])}definirOrgao(n){this.orgao.update(e=>n&&n!==e?n:"")}focar(n,e,i=16,o){!n||!e||this.foco.set({lat:n,lng:e,zoom:i,raio:o,n:Date.now()})}definirStatus(n,e,i=""){this.status.set({icone:n,texto:e,tipo:i})}abrirLocal(n,e){let i=zt[n];if(!i)return;let o=++this.tokenAbertura,a=e==="ESTADO_INTEIRO",r=a?null:Tc(n,e);if(!a&&!r){this.definirStatus("error","Munic\xEDpio n\xE3o encontrado: "+e,"erro");return}let s=n!==this.uf();this.uf.set(n),this.escopo.set(a?"ESTADO":"CIDADE"),this.cidade.set(a?"":r.nome),a&&this.aba()==="ZONAS"&&this.aba.set("ESTADO"),!a&&this.aba()==="ESTADO"&&this.aba.set("PANORAMA"),s&&this.eventoPanorama.set(0);let c=a?i.lat:r.lat,d=a?i.lng:r.lng,l=a?"ESTADO_INTEIRO":r.nome,m=Ac(n,l);if(this.dados.set(ow(n,l,c,d,a?i.ibge:r.ibge)),this.carregarPanorama(n),!a&&this.bairrosOsm()?.ibge!==r.ibge){let y=r.ibge;this.bairrosOsm.set({ibge:y,lista:[],carregando:!0});let _=()=>this.bairrosOsm()?.ibge===y;lw(y,C=>{_()&&this.bairrosOsm.set({ibge:y,lista:C,carregando:!0})}).then(C=>{_()&&this.bairrosOsm.set({ibge:y,lista:C.length?C:this.bairrosOsm().lista,carregando:!1})}).catch(()=>{_()&&this.bairrosOsm.set(W(I({},this.bairrosOsm()),{carregando:!1}))})}a||this.carregarAreas(n,r.nome,r.ibge),this.populacao()?.uf!==n&&(this.populacao.set(null),rb(n).then(y=>{y&&this.uf()===n&&this.populacao.set(y)}));let v=this.memoria.get(m);if(v&&v.em>Date.now()-fe.MINUTOS_CACHE_NAVEGADOR*6e4){this.dados.set($u(v.res)),this.carregando.set(!1),this.definirStatus("check_circle","Atualizado \xE0s "+(v.res.atualizadoEm||""),"ok");return}this.carregando.set(!0),this.definirStatus("sync","Carregando "+(a?i.nome:r.nome)+"\u2026");let g=!1;gt.obterPacote(m).then(y=>{let _=y?.dado||null;return _&&o===this.tokenAbertura&&this.carregando()&&(g=!0,this.dados.set($u(_)),this.memoria.set(m,{em:0,res:_}),this.definirStatus("sync","Mostrando dados guardados \xB7 buscando novidades\u2026")),ui.cidade(n,l,c,d,!1,cb(_))}).then(y=>{if(this.receber(y,o)){if(this.carregando.set(!1),y.precisaColeta&&!a){this.coletar(n,r.nome,c,d,o);return}this.definirStatus("check_circle",y.ultimaColeta?"Dados de "+y.ultimaColeta:"Atualizado \xE0s "+y.atualizadoEm,"ok")}}).catch(y=>{o===this.tokenAbertura&&(this.carregando.set(!1),this.definirStatus("error",g?"Sem conex\xE3o com o servidor; mostrando dados guardados":"Falha ao carregar: "+(y?.message||"erro"),"erro"))})}receber(n,e){if(e!==this.tokenAbertura||!n)return!1;let i=Ac(n.uf,n.cidade),o=bO(this.memoria.get(i)?.res||null,n);return this.dados.set($u(o)),this.memoria.set(i,{em:Date.now(),res:o}),gt.salvarPacote(i,o),!0}coletar(n,e,i,o,a){this.definirStatus("travel_explore","Consultando Google Not\xEDcias e imprensa local\u2026"),this.coletando.set(!0);let r=this.memoria.get(Ac(n,e))?.res||null;ui.cidade(n,e,i,o,!0,cb(r)).then(s=>{if(this.coletando.set(!1),!this.receber(s,a))return;if(s.coletaEmAndamento){this.definirStatus("hourglass_top","Coleta em andamento; atualize em instantes");return}let c=s.novasCapturadasAgora||0;this.definirStatus("check_circle",(c?`Google Not\xEDcias: ${c} ${c===1?"not\xEDcia nova":"not\xEDcias novas"} \xB7 `:"Google Not\xEDcias: nada novo \xB7 ")+"atualizado \xE0s "+s.atualizadoEm,"ok")}).catch(()=>{this.coletando.set(!1),a===this.tokenAbertura&&this.definirStatus("error","Coleta n\xE3o conclu\xEDda; mostrando dados salvos","erro")})}atualizarAgora(){let n=this.dados();if(n){if(this.escopo()==="ESTADO"){this.memoria.delete(Ac(this.uf(),"ESTADO_INTEIRO")),this.panoramas.delete(this.uf()),this.abrirLocal(this.uf(),"ESTADO_INTEIRO");return}this.coletar(this.uf(),this.cidade(),n.centroLat,n.centroLng,this.tokenAbertura)}}carregarPanorama(n){let e=this.panoramaBruto();if(e?.uf===n&&(e.disponivel||this.panoramas.has(n)))return;let i=this.panoramas.get(n);if(i){this.panoramaBruto.set(i);return}this.panoramaBruto.set(null),this.panoramaCarregando.set(!0);let o="PANORAMA_"+n;gt.obter(o,.25).then(a=>{a&&this.uf()===n&&!this.panoramaBruto()&&this.panoramaBruto.set(a)}),ui.panorama(n).then(a=>{a=W(I({},a),{uf:n}),this.panoramas.set(n,a),a.disponivel&&gt.salvar(o,a),this.uf()===n&&(this.panoramaBruto.set(a),this.panoramaCarregando.set(!1))}).catch(a=>{this.uf()===n&&(this.panoramaCarregando.set(!1),this.panoramaBruto()||this.panoramaBruto.set({disponivel:!1,uf:n,motivo:"N\xE3o foi poss\xEDvel carregar o panorama: "+(a?.message||"erro")}))})}buscarCep(n){if(n.length!==8){this.definirStatus("error","Digite um CEP com 8 n\xFAmeros","erro");return}this.definirStatus("search","Buscando CEP\u2026"),$n("https://viacep.com.br/ws/"+n+"/json/").then(e=>e.json()).then(e=>{let i=e&&!e.erro?Kr(e.ibge)||Tc(String(e.uf).toUpperCase(),e.localidade):null;i?this.abrirLocal(i.uf,i.nome):this.definirStatus("error","CEP n\xE3o encontrado","erro")}).catch(()=>this.definirStatus("error","N\xE3o foi poss\xEDvel consultar o CEP","erro"))}carregarAreas(n,e,i){this.isp()?.ibge!==i&&(this.isp.set({ibge:i,dado:null}),mw(n,i).then(a=>{this.isp()?.ibge===i&&this.isp.set({ibge:i,dado:a})})),this.oficialArea()?.ibge!==i&&(this.oficialArea.set({ibge:i,dado:null}),gw(i).then(a=>{this.oficialArea()?.ibge===i&&this.oficialArea.set({ibge:i,dado:a})}).catch(()=>{}));let o=n+"|"+e;this.fogo()?.chave!==o&&(this.fogo.set({chave:o,dado:null,carregando:!0}),Qg(n,e).then(a=>{this.fogo()?.chave===o&&this.fogo.set({chave:o,dado:a,carregando:!1})}).catch(()=>{this.fogo()?.chave===o&&this.fogo.set({chave:o,dado:null,carregando:!1})}))}localizar(n){let e=!1,i=r=>{e||(e=!0,clearTimeout(o),r?this.abrirLocal(r.uf,r.nome):n?.())},o=setTimeout(()=>i(null),fe.TEMPO_LIMITE_LOCALIZACAO_MS),a=()=>{$n("https://api.bigdatacloud.net/data/reverse-geocode-client?localityLanguage=pt",2e3).then(r=>r.ok?r.json():null).then(r=>{if(!r||r.countryCode!=="BR")return i(null);let s=String(r.principalSubdivisionCode||"").replace("BR-","").toUpperCase(),c=zt[s]&&r.city?Tc(s,r.city):null;!c&&r.latitude&&r.longitude&&(c=nb(Number(r.latitude),Number(r.longitude))),i(c)}).catch(()=>i(null))};navigator.geolocation?navigator.geolocation.getCurrentPosition(r=>i(nb(r.coords.latitude,r.coords.longitude)),a,{timeout:fe.TEMPO_LIMITE_LOCALIZACAO_MS-300,maximumAge:6e5}):a()}statusLocalizando(){this.definirStatus("my_location","Localizando\u2026")}statusSemLocalizacao(){this.definirStatus("location_off","Localiza\xE7\xE3o indispon\xEDvel","erro")}static \u0275fac=function(e){return new(e||t)};static \u0275prov=Le({token:t,factory:t.\u0275fac,providedIn:"root"})};function cb(t){return t&&t.formato===2&&!t.ehEstado&&t.cidade!=="ESTADO_INTEIRO"&&Number(t.ultimaColetaMs)||0}function bO(t,n){if(!n?.delta)return n;if(!t?.ocorrencias)return W(I({},n),{delta:!1,ids:void 0});let e=new Set(n.ids||[]),i=new Map;t.ocorrencias.forEach(a=>{(!n.ids||e.has(a.id))&&i.set(a.id,a)}),(n.ocorrencias||[]).forEach(a=>i.set(a.id,a));let o=[...i.values()].sort((a,r)=>(r.ts||0)-(a.ts||0));return W(I({},n),{delta:!1,ids:void 0,ocorrencias:o,totalNaBase:o.length})}function vO(t,n,e,i){if(!t?.length)return[];let o=new Date(Date.now()-e*864e5),a=o.getFullYear()*1e4+(o.getMonth()+1)*100+o.getDate(),r=[];for(let s of t){let c=/^(\d{2})\/(\d{2})\/(\d{4})/.exec(s.d||"");if(!c||!isFinite(s.lat)||!isFinite(s.lng))continue;let d=Number(c[3]+c[2]+c[1]),l=s.mortos?"CVLI":"CONFRONTO";d<a||i.length&&!i.includes(l)||r.push({id:"fc"+s.id,data:s.d,ts:d,cidade:n,bairro:s.bairro||"",cat:l,titulo:"Tiroteio (Fogo Cruzado)",veiculo:"Fogo Cruzado",link:"",lat:s.lat,lng:s.lng,precisao:"ENDERECO",precisa:!0,orgaos:[],local:!1})}return r}async function yO(){let[t,n]=await Promise.all([fw(),pw().catch(()=>null)]);if(!t?.ufs)return null;let e=Object.keys(t.ufs),i=n?.populacao?.municipios,o=i?[]:await Promise.all(e.map(l=>rb(l).catch(()=>null))),a={},r=0,s=0,c=0;if(e.forEach((l,m)=>{let v=o[m];if(!i&&!v)return;c++;let g=t.ufs[l].municipios;for(let y of Ii(l)){let _=String(y.ibge).slice(0,6),C=i?i[_]:v.porCodigo[y.ibge];if(!C)continue;let w=g[y.norm]||0,E=n?.municipios[_],U=E?E[0]+E[1]:0,F=Math.max(w,U);r+=F,s+=C,C>=2e4&&(a[y.ibge]=[F,C,Math.round(F/C*1e6)/10,w,U])}}),c<20)return null;let d=Object.values(a);return{periodo:t.periodo,brasil:{cvli:r,pop:s,taxa:Math.round(r/s*1e6)/10},taxas:d.map(l=>l[2]).sort((l,m)=>l-m),totais:d.map(l=>l[0]).sort((l,m)=>l-m),municipios:a,sim:n?{ano:n.ano,preliminar:!!n.preliminar}:null}}function _O(t,n){if(t&1){let e=We();f(0,"button",8),V("click",function(){De(e);let o=x();return Me(o.ir(o.i()-1))}),b(1,"Anterior"),u()}}var Yu=[{alvo:".busca",titulo:"Escolha o local",texto:"Digite qualquer munic\xEDpio do Brasil (ou um CEP) ou escolha um estado na lista ao lado. Tudo no painel muda para o local escolhido: mapa, n\xFAmeros, abas e not\xEDcias."},{alvo:".kpis",titulo:"N\xFAmeros oficiais",texto:'Os cart\xF5es do topo v\xEAm do Sinesp (Minist\xE9rio da Justi\xE7a). "Mortes violentas" soma homic\xEDdio doloso, latroc\xEDnio e les\xE3o corporal seguida de morte. A seta compara o per\xEDodo escolhido com os mesmos meses do ano anterior.'},{alvo:".filtros",titulo:"Filtros",texto:"O per\xEDodo (30 dias a 12 meses) e o tipo de crime valem para todas as abas, para o mapa e para os cart\xF5es. No Sinesp, que \xE9 mensal, o per\xEDodo vira os \xFAltimos meses publicados."},{alvo:".area-mapa",titulo:"Mapa",texto:"Cada bairro \xE9 pintado pela quantidade de ocorr\xEAncias noticiadas (contorno do IBGE ou do OpenStreetMap). Pontos s\xE3o locais exatos; c\xEDrculos vermelhos numerados s\xE3o zonas vermelhas. Clique em qualquer coisa para ver o detalhe."},{alvo:".botao-mapa",titulo:"Camadas",texto:"Liga e desliga camadas: bairros, calor, zonas vermelhas, tiroteios do Fogo Cruzado e, no RJ, as \xE1reas de delegacia com dados oficiais do ISP."},{alvo:".legenda",titulo:"Legenda",texto:"Mostra quantas not\xEDcias h\xE1 no per\xEDodo, quantas t\xEAm local exato, as cores dos tiroteios por gravidade e a lista das not\xEDcias sem bairro identificado."},{alvo:".abas",titulo:"Abas",texto:"Panorama junta todas as fontes; Dados oficiais detalha o Sinesp ano a ano; Estado compara os munic\xEDpios; Zonas lista as \xE1reas mais violentas; Not\xEDcias traz cada ocorr\xEAncia com link."},{alvo:".cartao.parecer",aba:"PANORAMA",titulo:"Parecer",texto:"Resumo em texto escrito automaticamente a partir dos dados: quantas mortes, a tend\xEAncia, a taxa por 100 mil comparada ao estado e os bairros mais citados."},{alvo:".cartao.risco",aba:"PANORAMA",titulo:"\xCDndice de risco",texto:"De 0 a 100, compar\xE1vel entre qualquer munic\xEDpio do Brasil: pesa principalmente a taxa de mortes violentas por habitante frente a todos os munic\xEDpios do pa\xEDs com 20 mil habitantes ou mais, mais mortes por a\xE7\xE3o policial e tiroteios onde h\xE1 esse dado. Passe o mouse para ver cada componente."},{alvo:".cartao.trafico",aba:"PANORAMA",titulo:"Tr\xE1fico e fac\xE7\xF5es",texto:"Not\xEDcias de tr\xE1fico e de fac\xE7\xF5es ou mil\xEDcias citadas, o tr\xE1fico no estado (o Sinesp n\xE3o publica por cidade), apreens\xF5es do ISP no RJ e disputas entre grupos armados do Fogo Cruzado."},{alvo:".abas",aba:"ZONAS",titulo:"Zonas vermelhas",texto:"As \xE1reas onde as ocorr\xEAncias graves e recentes se concentram, com \xEDndice (100 = a mais intensa), tend\xEAncia dos \xFAltimos 30 dias e bot\xE3o para ver no mapa."},{alvo:".abas",aba:"NOTICIAS",titulo:"Not\xEDcias",texto:"Cada not\xEDcia com ve\xEDculo, data, bairro e \xF3rg\xE3os citados. Not\xEDcias s\xE3o complemento: servem para localizar e acompanhar, n\xE3o substituem a estat\xEDstica oficial."}],Zu=class t{store=p(kt);fechar=Y0();total=Yu.length;i=G(0);passo=P(()=>Yu[this.i()]);tick=G(0);caixa=P(()=>{this.tick();let n=document.querySelector(this.passo().alvo);if(!n)return{top:window.innerHeight/2,left:window.innerWidth/2,width:0,height:0};let e=n.getBoundingClientRect(),i=6,o=Math.max(4,e.top-i),a=Math.max(4,e.left-i);return{top:o,left:a,width:Math.min(window.innerWidth-a-4,e.width+2*i),height:Math.min(window.innerHeight-o-4,e.height+2*i)}});balao=P(()=>{let n=this.caixa(),e=Math.min(360,window.innerWidth-32),i=230,o=n.top+n.height+12;o+i>window.innerHeight&&(o=Math.max(12,n.top-i-12)),(o<12||n.height>window.innerHeight*.6)&&(o=Math.min(window.innerHeight-i-12,Math.max(12,n.top+16)));let a=Math.min(window.innerWidth-e-16,Math.max(16,n.left+(n.width>e?16:0)));return{top:o,left:a}});constructor(){this.ir(0)}ir(n,e=n>=this.i()?1:-1){let i=Yu[n];i.aba&&this.store.aba()!==i.aba&&this.store.aba.set(i.aba),this.i.set(n),setTimeout(()=>{let o=document.querySelector(i.alvo);if(!o){let a=n+e;a>=0&&a<Yu.length&&this.ir(a,e);return}o?.scrollIntoView({block:"center",behavior:"smooth"}),setTimeout(()=>this.tick.update(a=>a+1),350)},120),this.tick.update(o=>o+1)}redimensionar(){this.tick.update(n=>n+1)}tecla(n){n.key==="Escape"?this.fechar.emit():n.key==="ArrowRight"&&this.i()+1<this.total?this.ir(this.i()+1):n.key==="ArrowLeft"&&this.i()>0&&this.ir(this.i()-1)}static \u0275fac=function(e){return new(e||t)};static \u0275cmp=H({type:t,selectors:[["app-tour"]],hostBindings:function(e,i){e&1&&V("resize",function(){return i.redimensionar()},Ff)("keydown",function(a){return i.tecla(a)},Lf)},outputs:{fechar:"fechar"},decls:15,vars:18,consts:[[1,"foco"],["role","dialog","aria-live","polite",1,"balao"],[1,"contador"],[1,"acoes"],["mat-button","",3,"click"],[1,"esp"],["mat-stroked-button",""],["mat-flat-button","",3,"click"],["mat-stroked-button","",3,"click"]],template:function(e,i){if(e&1&&(A(0,"div",0),f(1,"div",1)(2,"div",2),b(3),u(),f(4,"h3"),b(5),u(),f(6,"p"),b(7),u(),f(8,"div",3)(9,"button",4),V("click",function(){return i.fechar.emit()}),b(10,"Sair"),u(),A(11,"span",5),k(12,_O,2,0,"button",6),f(13,"button",7),V("click",function(){return i.i()+1<i.total?i.ir(i.i()+1):i.fechar.emit()}),b(14),u()()()),e&2){let o=i.caixa();we("top",o.top,"px")("left",o.left,"px")("width",o.width,"px")("height",o.height,"px"),h(),we("top",i.balao().top,"px")("left",i.balao().left,"px"),h(2),dt("",i.i()+1," de ",i.total),h(2),S(i.passo().titulo),h(2),S(i.passo().texto),h(5),N(i.i()>0?12:-1),h(2),S(i.i()+1<i.total?"Pr\xF3ximo":"Concluir")}},dependencies:[Po,Iu,It],styles:["[_nghost-%COMP%]{position:fixed;inset:0;z-index:2000}.foco[_ngcontent-%COMP%]{position:fixed;border-radius:var(--%NS%raio-m);box-shadow:0 0 0 9999px #0a142899;outline:3px solid var(--%NS%mat-sys-primary);transition:all .25s ease;pointer-events:none}.balao[_ngcontent-%COMP%]{position:fixed;width:min(360px,100vw - 32px);background:var(--%NS%mat-sys-surface-container-lowest);color:var(--%NS%mat-sys-on-surface);border-radius:var(--%NS%raio);padding:16px 18px 12px;box-shadow:0 10px 30px #0000004d;transition:top .25s ease,left .25s ease}.contador[_ngcontent-%COMP%]{font:var(--%NS%mat-sys-label-small);color:var(--%NS%mat-sys-primary);font-weight:700;letter-spacing:.04em}h3[_ngcontent-%COMP%]{margin:4px 0 6px;font:var(--%NS%mat-sys-title-medium)}p[_ngcontent-%COMP%]{margin:0 0 12px;font:var(--%NS%mat-sys-body-medium);color:var(--%NS%mat-sys-on-surface-variant)}.acoes[_ngcontent-%COMP%]{display:flex;gap:8px;align-items:center}.esp[_ngcontent-%COMP%]{flex:1}"]})};var Tw=(()=>{class t{labelPosition="after";static \u0275fac=function(i){return new(i||t)};static \u0275cmp=(function(){return H({type:t,selectors:[["","mat-internal-form-field",""]],hostAttrs:[1,"mdc-form-field","mat-internal-form-field"],hostVars:2,hostBindings:function(o,a){o&2&&z("mdc-form-field--align-end",a.labelPosition==="before")},inputs:{labelPosition:"labelPosition"},ngContentSelectors:["*"],decls:1,vars:0,template:function(o,a){o&1&&(Be(),oe(0))},styles:[`.mat-internal-form-field {
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  display: inline-flex;
  align-items: center;
  vertical-align: middle;
}
.mat-internal-form-field > label, .mat-internal-form-field > .mat-internal-form-field-label {
  margin-left: 0;
  margin-right: auto;
  padding-left: 4px;
  padding-right: 0;
  order: 0;
}
[dir=rtl] .mat-internal-form-field > label, [dir=rtl] .mat-internal-form-field > .mat-internal-form-field-label {
  margin-left: auto;
  margin-right: 0;
  padding-left: 0;
  padding-right: 4px;
}

.mdc-form-field--align-end > label, .mdc-form-field--align-end > .mat-internal-form-field-label {
  margin-left: auto;
  margin-right: 0;
  padding-left: 0;
  padding-right: 4px;
  order: -1;
}
[dir=rtl] .mdc-form-field--align-end .mdc-form-field--align-end label, [dir=rtl] .mdc-form-field--align-end .mdc-form-field--align-end .mat-internal-form-field-label {
  margin-left: 0;
  margin-right: auto;
  padding-left: 4px;
  padding-right: 0;
}
`],encapsulation:2})})()}return t})();var lb={color:"accent",clickAction:"check-indeterminate",disabledInteractive:!1},xO=new D("mat-checkbox-default-options",{providedIn:"root",factory:()=>lb}),pn=(function(t){return t[t.Init=0]="Init",t[t.Checked=1]="Checked",t[t.Unchecked=2]="Unchecked",t[t.Indeterminate=3]="Indeterminate",t})(pn||{}),db=class{source;checked},ub=(()=>{class t{_elementRef=p(q);_changeDetectorRef=p(He);_ngZone=p(X);_animationsDisabled=qe();_options=p(xO,{optional:!0});focus(){this._inputElement.nativeElement.focus()}_createChangeEvent(e){let i=new db;return i.source=this,i.checked=e,i}_getAnimationTargetElement(){return this._inputElement?.nativeElement}_animationClasses={uncheckedToChecked:"mdc-checkbox--anim-unchecked-checked",uncheckedToIndeterminate:"mdc-checkbox--anim-unchecked-indeterminate",checkedToUnchecked:"mdc-checkbox--anim-checked-unchecked",checkedToIndeterminate:"mdc-checkbox--anim-checked-indeterminate",indeterminateToChecked:"mdc-checkbox--anim-indeterminate-checked",indeterminateToUnchecked:"mdc-checkbox--anim-indeterminate-unchecked"};ariaLabel="";ariaLabelledby=null;ariaDescribedby;ariaExpanded;ariaControls;ariaOwns;_uniqueId;id;get inputId(){return`${this.id||this._uniqueId}-input`}required=!1;labelPosition="after";name=null;change=new K;indeterminateChange=new K;value;disableRipple=!1;_inputElement;tabIndex;color;disabledInteractive;_onTouched=()=>{};_currentAnimationClass="";_currentCheckState=pn.Init;_controlValueAccessorChangeFn=()=>{};_validatorChangeFn=()=>{};constructor(){p(ut).load(bn);let e=p(new ti("tabindex"),{optional:!0});this._options=this._options||lb,this.color=this._options.color||lb.color,this.tabIndex=e==null?0:parseInt(e)||0,this.id=this._uniqueId=p(Qe).getId("mat-mdc-checkbox-"),this.disabledInteractive=this._options?.disabledInteractive??!1}ngOnChanges(e){e.required&&this._validatorChangeFn()}ngAfterViewInit(){this._syncIndeterminate(this.indeterminate)}get checked(){return this._checked}set checked(e){e!=this.checked&&(this._checked=e,this._changeDetectorRef.markForCheck())}_checked=!1;get disabled(){return this._disabled}set disabled(e){e!==this.disabled&&(this._disabled=e,this._changeDetectorRef.markForCheck())}_disabled=!1;get indeterminate(){return this._indeterminate()}set indeterminate(e){let i=e!=this._indeterminate();this._indeterminate.set(e),i&&(e?this._transitionCheckState(pn.Indeterminate):this._transitionCheckState(this.checked?pn.Checked:pn.Unchecked),this.indeterminateChange.emit(e)),this._syncIndeterminate(e)}_indeterminate=G(!1);_isRippleDisabled(){return this.disableRipple||this.disabled}_onLabelTextChange(){this._changeDetectorRef.detectChanges()}writeValue(e){this.checked=!!e}registerOnChange(e){this._controlValueAccessorChangeFn=e}registerOnTouched(e){this._onTouched=e}setDisabledState(e){this.disabled=e}validate(e){return this.required&&e.value!==!0?{required:!0}:null}registerOnValidatorChange(e){this._validatorChangeFn=e}_transitionCheckState(e){let i=this._currentCheckState,o=this._getAnimationTargetElement();if(!(i===e||!o)&&(this._currentAnimationClass&&o.classList.remove(this._currentAnimationClass),this._currentAnimationClass=this._getAnimationClassForCheckStateTransition(i,e),this._currentCheckState=e,this._currentAnimationClass.length>0)){o.classList.add(this._currentAnimationClass);let a=this._currentAnimationClass;this._ngZone.runOutsideAngular(()=>{setTimeout(()=>{o.classList.remove(a)},1e3)})}}_emitChangeEvent(){this._controlValueAccessorChangeFn(this.checked),this.change.emit(this._createChangeEvent(this.checked)),this._inputElement&&(this._inputElement.nativeElement.checked=this.checked)}toggle(){this.checked=!this.checked,this._controlValueAccessorChangeFn(this.checked)}_handleInputClick(){let e=this._options?.clickAction;!this.disabled&&e!=="noop"?(this.indeterminate&&e!=="check"&&Promise.resolve().then(()=>{this._indeterminate.set(!1),this.indeterminateChange.emit(!1)}),this._checked=!this._checked,this._transitionCheckState(this._checked?pn.Checked:pn.Unchecked),this._emitChangeEvent()):(this.disabled&&this.disabledInteractive||!this.disabled&&e==="noop")&&(this._inputElement.nativeElement.checked=this.checked,this._inputElement.nativeElement.indeterminate=this.indeterminate)}_onInteractionEvent(e){e.stopPropagation()}_onBlur(){Promise.resolve().then(()=>{this._onTouched(),this._changeDetectorRef.markForCheck()})}_getAnimationClassForCheckStateTransition(e,i){if(this._animationsDisabled)return"";switch(e){case pn.Init:if(i===pn.Checked)return this._animationClasses.uncheckedToChecked;if(i==pn.Indeterminate)return this._checked?this._animationClasses.checkedToIndeterminate:this._animationClasses.uncheckedToIndeterminate;break;case pn.Unchecked:return i===pn.Checked?this._animationClasses.uncheckedToChecked:this._animationClasses.uncheckedToIndeterminate;case pn.Checked:return i===pn.Unchecked?this._animationClasses.checkedToUnchecked:this._animationClasses.checkedToIndeterminate;case pn.Indeterminate:return i===pn.Checked?this._animationClasses.indeterminateToChecked:this._animationClasses.indeterminateToUnchecked}return""}_syncIndeterminate(e){let i=this._inputElement;i&&(i.nativeElement.indeterminate=e)}_onInputClick(){this._handleInputClick()}_preventBubblingFromLabel(e){e.target&&this._inputElement&&e.target!==this._inputElement.nativeElement&&e.stopPropagation()}static \u0275fac=function(i){return new(i||t)};static \u0275cmp=(function(){let e=["input"],i=["*"];return H({type:t,selectors:[["mat-checkbox"]],viewQuery:function(a,r){if(a&1&&ot(e,5),a&2){let s;Y(s=Z())&&(r._inputElement=s.first)}},hostAttrs:[1,"mat-mdc-checkbox"],hostVars:16,hostBindings:function(a,r){a&2&&(Vt("id",r.id),Q("tabindex",null)("aria-label",null)("aria-labelledby",null),Ke(r.color?"mat-"+r.color:"mat-accent"),z("_mat-animation-noopable",r._animationsDisabled)("mdc-checkbox--disabled",r.disabled)("mat-mdc-checkbox-disabled",r.disabled)("mat-mdc-checkbox-checked",r.checked)("mat-mdc-checkbox-disabled-interactive",r.disabledInteractive))},inputs:{ariaLabel:[0,"aria-label","ariaLabel"],ariaLabelledby:[0,"aria-labelledby","ariaLabelledby"],ariaDescribedby:[0,"aria-describedby","ariaDescribedby"],ariaExpanded:[2,"aria-expanded","ariaExpanded",O],ariaControls:[0,"aria-controls","ariaControls"],ariaOwns:[0,"aria-owns","ariaOwns"],id:"id",required:[2,"required","required",O],labelPosition:"labelPosition",name:"name",value:"value",disableRipple:[2,"disableRipple","disableRipple",O],tabIndex:[2,"tabIndex","tabIndex",o=>o==null?void 0:on(o)],color:"color",disabledInteractive:[2,"disabledInteractive","disabledInteractive",O],checked:[2,"checked","checked",O],disabled:[2,"disabled","disabled",O],indeterminate:[2,"indeterminate","indeterminate",O]},outputs:{change:"change",indeterminateChange:"indeterminateChange"},exportAs:["matCheckbox"],features:[ze([{provide:to,useExisting:$t(()=>t),multi:!0},{provide:vc,useExisting:t,multi:!0}]),wt],ngContentSelectors:i,decls:15,vars:23,consts:[["checkbox",""],["input",""],["label",""],["mat-internal-form-field","",3,"click","labelPosition","for"],[1,"mdc-checkbox"],["aria-hidden","true",1,"mat-mdc-checkbox-touch-target"],["type","checkbox",1,"mdc-checkbox__native-control",3,"blur","click","change","checked","indeterminate","disabled","id","required","tabIndex"],["aria-hidden","true",1,"mdc-checkbox__ripple"],["aria-hidden","true",1,"mdc-checkbox__background"],["focusable","false","viewBox","0 0 24 24",1,"mdc-checkbox__checkmark"],["fill","none","d","M1.73,12.91 8.1,19.28 22.79,4.59",1,"mdc-checkbox__checkmark-path"],[1,"mdc-checkbox__mixedmark"],["mat-ripple","","aria-hidden","true",1,"mat-mdc-checkbox-ripple","mat-focus-indicator",3,"matRippleTrigger","matRippleDisabled","matRippleCentered"],[1,"mat-internal-form-field-label","mdc-label"]],template:function(a,r){if(a&1&&(Be(),f(0,"label",3),V("click",function(c){return r._preventBubblingFromLabel(c)}),f(1,"span",4,0),A(3,"span",5),f(4,"input",6,1),V("blur",function(){return r._onBlur()})("click",function(){return r._onInputClick()})("change",function(c){return r._onInteractionEvent(c)}),u(),A(6,"span",7),f(7,"span",8),_n(),f(8,"svg",9),A(9,"path",10),u(),cr(),A(10,"span",11),u(),A(11,"span",12),u(),f(12,"span",13,2),oe(14),u()()),a&2){let s=nn(2);R("labelPosition",r.labelPosition)("for",r.inputId),h(4),z("mdc-checkbox--selected",r.checked),R("checked",r.checked)("indeterminate",r.indeterminate)("disabled",r.disabled&&!r.disabledInteractive)("id",r.inputId)("required",r.required)("tabIndex",r.disabled&&!r.disabledInteractive?-1:r.tabIndex),Q("aria-label",r.ariaLabel||null)("aria-labelledby",r.ariaLabelledby)("aria-describedby",r.ariaDescribedby)("aria-checked",r.indeterminate?"mixed":null)("aria-controls",r.ariaControls)("aria-disabled",r.disabled&&r.disabledInteractive?!0:null)("aria-expanded",r.ariaExpanded)("aria-owns",r.ariaOwns)("name",r.name)("value",r.value),h(7),R("matRippleTrigger",s)("matRippleDisabled",r.disableRipple||r.disabled)("matRippleCentered",!0)}},dependencies:[ai,Tw],styles:[`.mdc-checkbox {
  display: inline-block;
  position: relative;
  flex: 0 0 18px;
  box-sizing: content-box;
  width: 18px;
  height: 18px;
  line-height: 0;
  white-space: nowrap;
  cursor: pointer;
  vertical-align: bottom;
  padding: calc((var(--%NS%mat-checkbox-state-layer-size, 40px) - 18px) / 2);
  margin: calc((var(--%NS%mat-checkbox-state-layer-size, 40px) - var(--%NS%mat-checkbox-state-layer-size, 40px)) / 2);
}
.mdc-checkbox:hover > .mdc-checkbox__ripple {
  opacity: var(--%NS%mat-checkbox-unselected-hover-state-layer-opacity, var(--%NS%mat-sys-hover-state-layer-opacity));
  background-color: var(--%NS%mat-checkbox-unselected-hover-state-layer-color, var(--%NS%mat-sys-on-surface));
}
.mdc-checkbox:hover > .mat-mdc-checkbox-ripple > .mat-ripple-element {
  background-color: var(--%NS%mat-checkbox-unselected-hover-state-layer-color, var(--%NS%mat-sys-on-surface));
}
.mdc-checkbox .mdc-checkbox__native-control:focus + .mdc-checkbox__ripple {
  opacity: var(--%NS%mat-checkbox-unselected-focus-state-layer-opacity, var(--%NS%mat-sys-focus-state-layer-opacity));
  background-color: var(--%NS%mat-checkbox-unselected-focus-state-layer-color, var(--%NS%mat-sys-on-surface));
}
.mdc-checkbox .mdc-checkbox__native-control:focus ~ .mat-mdc-checkbox-ripple .mat-ripple-element {
  background-color: var(--%NS%mat-checkbox-unselected-focus-state-layer-color, var(--%NS%mat-sys-on-surface));
}
.mdc-checkbox:active > .mdc-checkbox__native-control + .mdc-checkbox__ripple {
  opacity: var(--%NS%mat-checkbox-unselected-pressed-state-layer-opacity, var(--%NS%mat-sys-pressed-state-layer-opacity));
  background-color: var(--%NS%mat-checkbox-unselected-pressed-state-layer-color, var(--%NS%mat-sys-primary));
}
.mdc-checkbox:active > .mdc-checkbox__native-control ~ .mat-mdc-checkbox-ripple .mat-ripple-element {
  background-color: var(--%NS%mat-checkbox-unselected-pressed-state-layer-color, var(--%NS%mat-sys-primary));
}
.mdc-checkbox:hover > .mdc-checkbox__native-control:checked + .mdc-checkbox__ripple {
  opacity: var(--%NS%mat-checkbox-selected-hover-state-layer-opacity, var(--%NS%mat-sys-hover-state-layer-opacity));
  background-color: var(--%NS%mat-checkbox-selected-hover-state-layer-color, var(--%NS%mat-sys-primary));
}
.mdc-checkbox:hover > .mdc-checkbox__native-control:checked ~ .mat-mdc-checkbox-ripple .mat-ripple-element {
  background-color: var(--%NS%mat-checkbox-selected-hover-state-layer-color, var(--%NS%mat-sys-primary));
}
.mdc-checkbox .mdc-checkbox__native-control:focus:checked + .mdc-checkbox__ripple {
  opacity: var(--%NS%mat-checkbox-selected-focus-state-layer-opacity, var(--%NS%mat-sys-focus-state-layer-opacity));
  background-color: var(--%NS%mat-checkbox-selected-focus-state-layer-color, var(--%NS%mat-sys-primary));
}
.mdc-checkbox .mdc-checkbox__native-control:focus:checked ~ .mat-mdc-checkbox-ripple .mat-ripple-element {
  background-color: var(--%NS%mat-checkbox-selected-focus-state-layer-color, var(--%NS%mat-sys-primary));
}
.mdc-checkbox:active > .mdc-checkbox__native-control:checked + .mdc-checkbox__ripple {
  opacity: var(--%NS%mat-checkbox-selected-pressed-state-layer-opacity, var(--%NS%mat-sys-pressed-state-layer-opacity));
  background-color: var(--%NS%mat-checkbox-selected-pressed-state-layer-color, var(--%NS%mat-sys-on-surface));
}
.mdc-checkbox:active > .mdc-checkbox__native-control:checked ~ .mat-mdc-checkbox-ripple .mat-ripple-element {
  background-color: var(--%NS%mat-checkbox-selected-pressed-state-layer-color, var(--%NS%mat-sys-on-surface));
}
.mdc-checkbox--disabled.mat-mdc-checkbox-disabled-interactive .mdc-checkbox .mdc-checkbox__native-control ~ .mat-mdc-checkbox-ripple .mat-ripple-element,
.mdc-checkbox--disabled.mat-mdc-checkbox-disabled-interactive .mdc-checkbox .mdc-checkbox__native-control + .mdc-checkbox__ripple {
  background-color: var(--%NS%mat-checkbox-unselected-hover-state-layer-color, var(--%NS%mat-sys-on-surface));
}
.mdc-checkbox .mdc-checkbox__native-control {
  position: absolute;
  margin: 0;
  padding: 0;
  opacity: 0;
  cursor: inherit;
  z-index: 1;
  width: var(--%NS%mat-checkbox-state-layer-size, 40px);
  height: var(--%NS%mat-checkbox-state-layer-size, 40px);
  top: calc((var(--%NS%mat-checkbox-state-layer-size, 40px) - var(--%NS%mat-checkbox-state-layer-size, 40px)) / 2);
  right: calc((var(--%NS%mat-checkbox-state-layer-size, 40px) - var(--%NS%mat-checkbox-state-layer-size, 40px)) / 2);
  left: calc((var(--%NS%mat-checkbox-state-layer-size, 40px) - var(--%NS%mat-checkbox-state-layer-size, 40px)) / 2);
}

.mdc-checkbox--disabled {
  cursor: default;
  pointer-events: none;
}

.mdc-checkbox__background {
  display: inline-flex;
  position: absolute;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  width: 18px;
  height: 18px;
  border: 2px solid currentColor;
  border-radius: 2px;
  background-color: transparent;
  pointer-events: none;
  will-change: background-color, border-color;
  transition: background-color 90ms cubic-bezier(0.4, 0, 0.6, 1), border-color 90ms cubic-bezier(0.4, 0, 0.6, 1);
  -webkit-print-color-adjust: exact;
  color-adjust: exact;
  border-color: var(--%NS%mat-checkbox-unselected-icon-color, var(--%NS%mat-sys-on-surface-variant));
  top: calc((var(--%NS%mat-checkbox-state-layer-size, 40px) - 18px) / 2);
  left: calc((var(--%NS%mat-checkbox-state-layer-size, 40px) - 18px) / 2);
}

.mdc-checkbox__native-control:enabled:checked ~ .mdc-checkbox__background,
.mdc-checkbox__native-control:enabled:indeterminate ~ .mdc-checkbox__background {
  border-color: var(--%NS%mat-checkbox-selected-icon-color, var(--%NS%mat-sys-primary));
  background-color: var(--%NS%mat-checkbox-selected-icon-color, var(--%NS%mat-sys-primary));
}

.mdc-checkbox--disabled .mdc-checkbox__background {
  border-color: var(--%NS%mat-checkbox-disabled-unselected-icon-color, color-mix(in srgb, var(--%NS%mat-sys-on-surface) 38%, transparent));
}
@media (forced-colors: active) {
  .mdc-checkbox--disabled .mdc-checkbox__background {
    border-color: GrayText;
  }
}

.mdc-checkbox__native-control:disabled:checked ~ .mdc-checkbox__background,
.mdc-checkbox__native-control:disabled:indeterminate ~ .mdc-checkbox__background {
  background-color: var(--%NS%mat-checkbox-disabled-selected-icon-color, color-mix(in srgb, var(--%NS%mat-sys-on-surface) 38%, transparent));
  border-color: transparent;
}
@media (forced-colors: active) {
  .mdc-checkbox__native-control:disabled:checked ~ .mdc-checkbox__background,
  .mdc-checkbox__native-control:disabled:indeterminate ~ .mdc-checkbox__background {
    border-color: GrayText;
  }
}

.mdc-checkbox:hover > .mdc-checkbox__native-control:not(:checked) ~ .mdc-checkbox__background,
.mdc-checkbox:hover > .mdc-checkbox__native-control:not(:indeterminate) ~ .mdc-checkbox__background {
  border-color: var(--%NS%mat-checkbox-unselected-hover-icon-color, var(--%NS%mat-sys-on-surface));
  background-color: transparent;
}

.mdc-checkbox:hover > .mdc-checkbox__native-control:checked ~ .mdc-checkbox__background,
.mdc-checkbox:hover > .mdc-checkbox__native-control:indeterminate ~ .mdc-checkbox__background {
  border-color: var(--%NS%mat-checkbox-selected-hover-icon-color, var(--%NS%mat-sys-primary));
  background-color: var(--%NS%mat-checkbox-selected-hover-icon-color, var(--%NS%mat-sys-primary));
}

.mdc-checkbox__native-control:focus:focus:not(:checked) ~ .mdc-checkbox__background,
.mdc-checkbox__native-control:focus:focus:not(:indeterminate) ~ .mdc-checkbox__background {
  border-color: var(--%NS%mat-checkbox-unselected-focus-icon-color, var(--%NS%mat-sys-on-surface));
}

.mdc-checkbox__native-control:focus:focus:checked ~ .mdc-checkbox__background,
.mdc-checkbox__native-control:focus:focus:indeterminate ~ .mdc-checkbox__background {
  border-color: var(--%NS%mat-checkbox-selected-focus-icon-color, var(--%NS%mat-sys-primary));
  background-color: var(--%NS%mat-checkbox-selected-focus-icon-color, var(--%NS%mat-sys-primary));
}

.mdc-checkbox--disabled.mat-mdc-checkbox-disabled-interactive .mdc-checkbox:hover > .mdc-checkbox__native-control ~ .mdc-checkbox__background,
.mdc-checkbox--disabled.mat-mdc-checkbox-disabled-interactive .mdc-checkbox .mdc-checkbox__native-control:focus ~ .mdc-checkbox__background,
.mdc-checkbox--disabled.mat-mdc-checkbox-disabled-interactive .mdc-checkbox__background {
  border-color: var(--%NS%mat-checkbox-disabled-unselected-icon-color, color-mix(in srgb, var(--%NS%mat-sys-on-surface) 38%, transparent));
}
@media (forced-colors: active) {
  .mdc-checkbox--disabled.mat-mdc-checkbox-disabled-interactive .mdc-checkbox:hover > .mdc-checkbox__native-control ~ .mdc-checkbox__background,
  .mdc-checkbox--disabled.mat-mdc-checkbox-disabled-interactive .mdc-checkbox .mdc-checkbox__native-control:focus ~ .mdc-checkbox__background,
  .mdc-checkbox--disabled.mat-mdc-checkbox-disabled-interactive .mdc-checkbox__background {
    border-color: GrayText;
  }
}
.mdc-checkbox--disabled.mat-mdc-checkbox-disabled-interactive .mdc-checkbox__native-control:checked ~ .mdc-checkbox__background,
.mdc-checkbox--disabled.mat-mdc-checkbox-disabled-interactive .mdc-checkbox__native-control:indeterminate ~ .mdc-checkbox__background {
  background-color: var(--%NS%mat-checkbox-disabled-selected-icon-color, color-mix(in srgb, var(--%NS%mat-sys-on-surface) 38%, transparent));
  border-color: transparent;
}

.mdc-checkbox__checkmark {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  width: 100%;
  opacity: 0;
  transition: opacity 180ms cubic-bezier(0.4, 0, 0.6, 1);
  color: var(--%NS%mat-checkbox-selected-checkmark-color, var(--%NS%mat-sys-on-primary));
}
@media (forced-colors: active) {
  .mdc-checkbox__checkmark {
    color: CanvasText;
  }
}

.mdc-checkbox--disabled .mdc-checkbox__checkmark, .mdc-checkbox--disabled.mat-mdc-checkbox-disabled-interactive .mdc-checkbox__checkmark {
  color: var(--%NS%mat-checkbox-disabled-selected-checkmark-color, var(--%NS%mat-sys-surface));
}
@media (forced-colors: active) {
  .mdc-checkbox--disabled .mdc-checkbox__checkmark, .mdc-checkbox--disabled.mat-mdc-checkbox-disabled-interactive .mdc-checkbox__checkmark {
    color: GrayText;
  }
}

.mdc-checkbox__checkmark-path {
  transition: stroke-dashoffset 180ms cubic-bezier(0.4, 0, 0.6, 1);
  stroke: currentColor;
  stroke-width: 3.12px;
  stroke-dashoffset: 29.7833385;
  stroke-dasharray: 29.7833385;
}

.mdc-checkbox__mixedmark {
  width: 100%;
  height: 0;
  transform: scaleX(0) rotate(0deg);
  border-width: 1px;
  border-style: solid;
  opacity: 0;
  transition: opacity 90ms cubic-bezier(0.4, 0, 0.6, 1), transform 90ms cubic-bezier(0.4, 0, 0.6, 1);
  border-color: var(--%NS%mat-checkbox-selected-checkmark-color, var(--%NS%mat-sys-on-primary));
}
@media (forced-colors: active) {
  .mdc-checkbox__mixedmark {
    margin: 0 1px;
  }
}

.mdc-checkbox--disabled .mdc-checkbox__mixedmark, .mdc-checkbox--disabled.mat-mdc-checkbox-disabled-interactive .mdc-checkbox__mixedmark {
  border-color: var(--%NS%mat-checkbox-disabled-selected-checkmark-color, var(--%NS%mat-sys-surface));
}
@media (forced-colors: active) {
  .mdc-checkbox--disabled .mdc-checkbox__mixedmark, .mdc-checkbox--disabled.mat-mdc-checkbox-disabled-interactive .mdc-checkbox__mixedmark {
    border-color: GrayText;
  }
}

.mdc-checkbox--anim-unchecked-checked .mdc-checkbox__background,
.mdc-checkbox--anim-unchecked-indeterminate .mdc-checkbox__background,
.mdc-checkbox--anim-checked-unchecked .mdc-checkbox__background,
.mdc-checkbox--anim-indeterminate-unchecked .mdc-checkbox__background {
  animation-duration: 180ms;
  animation-timing-function: linear;
}

.mdc-checkbox--anim-unchecked-checked .mdc-checkbox__checkmark-path {
  animation: mdc-checkbox-unchecked-checked-checkmark-path 180ms linear;
  transition: none;
}

.mdc-checkbox--anim-unchecked-indeterminate .mdc-checkbox__mixedmark {
  animation: mdc-checkbox-unchecked-indeterminate-mixedmark 90ms linear;
  transition: none;
}

.mdc-checkbox--anim-checked-unchecked .mdc-checkbox__checkmark-path {
  animation: mdc-checkbox-checked-unchecked-checkmark-path 90ms linear;
  transition: none;
}

.mdc-checkbox--anim-checked-indeterminate .mdc-checkbox__checkmark {
  animation: mdc-checkbox-checked-indeterminate-checkmark 90ms linear;
  transition: none;
}
.mdc-checkbox--anim-checked-indeterminate .mdc-checkbox__mixedmark {
  animation: mdc-checkbox-checked-indeterminate-mixedmark 90ms linear;
  transition: none;
}

.mdc-checkbox--anim-indeterminate-checked .mdc-checkbox__checkmark {
  animation: mdc-checkbox-indeterminate-checked-checkmark 500ms linear;
  transition: none;
}
.mdc-checkbox--anim-indeterminate-checked .mdc-checkbox__mixedmark {
  animation: mdc-checkbox-indeterminate-checked-mixedmark 500ms linear;
  transition: none;
}

.mdc-checkbox--anim-indeterminate-unchecked .mdc-checkbox__mixedmark {
  animation: mdc-checkbox-indeterminate-unchecked-mixedmark 300ms linear;
  transition: none;
}

.mdc-checkbox__native-control:checked ~ .mdc-checkbox__background,
.mdc-checkbox__native-control:indeterminate ~ .mdc-checkbox__background {
  transition: border-color 90ms cubic-bezier(0, 0, 0.2, 1), background-color 90ms cubic-bezier(0, 0, 0.2, 1);
}
.mdc-checkbox__native-control:checked ~ .mdc-checkbox__background > .mdc-checkbox__checkmark > .mdc-checkbox__checkmark-path,
.mdc-checkbox__native-control:indeterminate ~ .mdc-checkbox__background > .mdc-checkbox__checkmark > .mdc-checkbox__checkmark-path {
  stroke-dashoffset: 0;
}

.mdc-checkbox__native-control:checked ~ .mdc-checkbox__background > .mdc-checkbox__checkmark {
  transition: opacity 180ms cubic-bezier(0, 0, 0.2, 1), transform 180ms cubic-bezier(0, 0, 0.2, 1);
  opacity: 1;
}
.mdc-checkbox__native-control:checked ~ .mdc-checkbox__background > .mdc-checkbox__mixedmark {
  transform: scaleX(1) rotate(-45deg);
}

.mdc-checkbox__native-control:indeterminate ~ .mdc-checkbox__background > .mdc-checkbox__checkmark {
  transform: rotate(45deg);
  opacity: 0;
  transition: opacity 90ms cubic-bezier(0.4, 0, 0.6, 1), transform 90ms cubic-bezier(0.4, 0, 0.6, 1);
}
.mdc-checkbox__native-control:indeterminate ~ .mdc-checkbox__background > .mdc-checkbox__mixedmark {
  transform: scaleX(1) rotate(0deg);
  opacity: 1;
}

@keyframes mdc-checkbox-unchecked-checked-checkmark-path {
  0%, 50% {
    stroke-dashoffset: 29.7833385;
  }
  50% {
    animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
  }
  100% {
    stroke-dashoffset: 0;
  }
}
@keyframes mdc-checkbox-unchecked-indeterminate-mixedmark {
  0%, 68.2% {
    transform: scaleX(0);
  }
  68.2% {
    animation-timing-function: cubic-bezier(0, 0, 0, 1);
  }
  100% {
    transform: scaleX(1);
  }
}
@keyframes mdc-checkbox-checked-unchecked-checkmark-path {
  from {
    animation-timing-function: cubic-bezier(0.4, 0, 1, 1);
    opacity: 1;
    stroke-dashoffset: 0;
  }
  to {
    opacity: 0;
    stroke-dashoffset: -29.7833385;
  }
}
@keyframes mdc-checkbox-checked-indeterminate-checkmark {
  from {
    animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
    transform: rotate(0deg);
    opacity: 1;
  }
  to {
    transform: rotate(45deg);
    opacity: 0;
  }
}
@keyframes mdc-checkbox-indeterminate-checked-checkmark {
  from {
    animation-timing-function: cubic-bezier(0.14, 0, 0, 1);
    transform: rotate(45deg);
    opacity: 0;
  }
  to {
    transform: rotate(360deg);
    opacity: 1;
  }
}
@keyframes mdc-checkbox-checked-indeterminate-mixedmark {
  from {
    animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
    transform: rotate(-45deg);
    opacity: 0;
  }
  to {
    transform: rotate(0deg);
    opacity: 1;
  }
}
@keyframes mdc-checkbox-indeterminate-checked-mixedmark {
  from {
    animation-timing-function: cubic-bezier(0.14, 0, 0, 1);
    transform: rotate(0deg);
    opacity: 1;
  }
  to {
    transform: rotate(315deg);
    opacity: 0;
  }
}
@keyframes mdc-checkbox-indeterminate-unchecked-mixedmark {
  0% {
    animation-timing-function: linear;
    transform: scaleX(1);
    opacity: 1;
  }
  32.8%, 100% {
    transform: scaleX(0);
    opacity: 0;
  }
}
.mat-mdc-checkbox {
  display: inline-block;
  position: relative;
  -webkit-tap-highlight-color: transparent;
}
.mat-mdc-checkbox._mat-animation-noopable > .mat-internal-form-field > .mdc-checkbox > .mat-mdc-checkbox-touch-target,
.mat-mdc-checkbox._mat-animation-noopable > .mat-internal-form-field > .mdc-checkbox > .mdc-checkbox__native-control,
.mat-mdc-checkbox._mat-animation-noopable > .mat-internal-form-field > .mdc-checkbox > .mdc-checkbox__ripple,
.mat-mdc-checkbox._mat-animation-noopable > .mat-internal-form-field > .mdc-checkbox > .mat-mdc-checkbox-ripple::before,
.mat-mdc-checkbox._mat-animation-noopable > .mat-internal-form-field > .mdc-checkbox > .mdc-checkbox__background,
.mat-mdc-checkbox._mat-animation-noopable > .mat-internal-form-field > .mdc-checkbox > .mdc-checkbox__background > .mdc-checkbox__checkmark,
.mat-mdc-checkbox._mat-animation-noopable > .mat-internal-form-field > .mdc-checkbox > .mdc-checkbox__background > .mdc-checkbox__checkmark > .mdc-checkbox__checkmark-path,
.mat-mdc-checkbox._mat-animation-noopable > .mat-internal-form-field > .mdc-checkbox > .mdc-checkbox__background > .mdc-checkbox__mixedmark {
  transition: none !important;
  animation: none !important;
}
.mat-mdc-checkbox label {
  cursor: pointer;
}
.mat-mdc-checkbox .mat-internal-form-field {
  color: var(--%NS%mat-checkbox-label-text-color, var(--%NS%mat-sys-on-surface));
  font-family: var(--%NS%mat-checkbox-label-text-font, var(--%NS%mat-sys-body-medium-font));
  line-height: var(--%NS%mat-checkbox-label-text-line-height, var(--%NS%mat-sys-body-medium-line-height));
  font-size: var(--%NS%mat-checkbox-label-text-size, var(--%NS%mat-sys-body-medium-size));
  letter-spacing: var(--%NS%mat-checkbox-label-text-tracking, var(--%NS%mat-sys-body-medium-tracking));
  font-weight: var(--%NS%mat-checkbox-label-text-weight, var(--%NS%mat-sys-body-medium-weight));
}
.mat-mdc-checkbox.mat-mdc-checkbox-disabled.mat-mdc-checkbox-disabled-interactive {
  pointer-events: auto;
}
.mat-mdc-checkbox.mat-mdc-checkbox-disabled.mat-mdc-checkbox-disabled-interactive input {
  cursor: default;
}
.mat-mdc-checkbox.mat-mdc-checkbox-disabled label {
  cursor: default;
}
.mat-mdc-checkbox.mat-mdc-checkbox-disabled .mat-internal-form-field-label {
  color: var(--%NS%mat-checkbox-disabled-label-color, color-mix(in srgb, var(--%NS%mat-sys-on-surface) 38%, transparent));
}
@media (forced-colors: active) {
  .mat-mdc-checkbox.mat-mdc-checkbox-disabled .mat-internal-form-field-label {
    color: GrayText;
  }
}
.mat-mdc-checkbox .mat-internal-form-field-label:empty {
  display: none;
}
.mat-mdc-checkbox .mdc-checkbox__ripple {
  opacity: 0;
}

.mat-mdc-checkbox .mat-mdc-checkbox-ripple,
.mdc-checkbox__ripple {
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
}
.mat-mdc-checkbox .mat-mdc-checkbox-ripple:not(:empty),
.mdc-checkbox__ripple:not(:empty) {
  transform: translateZ(0);
}

.mat-mdc-checkbox-ripple .mat-ripple-element {
  opacity: 0.1;
}

.mat-mdc-checkbox-touch-target {
  position: absolute;
  top: 50%;
  left: 50%;
  height: var(--%NS%mat-checkbox-touch-target-size, 48px);
  width: var(--%NS%mat-checkbox-touch-target-size, 48px);
  transform: translate(-50%, -50%);
  display: var(--%NS%mat-checkbox-touch-target-display, block);
}

.mat-mdc-checkbox .mat-mdc-checkbox-ripple::before {
  border-radius: 50%;
}

.mdc-checkbox__native-control:focus-visible ~ .mat-focus-indicator::before {
  content: "";
}
`],encapsulation:2})})()}return t})(),Aw=(()=>{class t{static \u0275fac=function(i){return new(i||t)};static \u0275mod=le({type:t});static \u0275inj=se({imports:[ub,Ne]})}return t})();var pb=new D("MAT_MENU_PANEL"),Oc=(()=>{class t{_isAnchor;_elementRef=p(q);_document=p(ae);_focusMonitor=p(un);_parentMenu=p(pb,{optional:!0});_changeDetectorRef=p(He);role="menuitem";disabled=!1;disabledInteractive=!1;disableRipple=!1;_hovered=new B;_focused=new B;_highlighted=!1;_triggersSubmenu=!1;constructor(){p(ut).load(bn),this._parentMenu?.addItem?.(this),this._isAnchor=this._elementRef.nativeElement.tagName==="A"}focus(e,i){this._focusMonitor&&e?this._focusMonitor.focusVia(this._getHostElement(),e,i):this._getHostElement().focus(i),this._focused.next(this)}ngAfterViewInit(){this._focusMonitor&&this._focusMonitor.monitor(this._elementRef,!1)}ngOnDestroy(){this._focusMonitor&&this._focusMonitor.stopMonitoring(this._elementRef),this._parentMenu&&this._parentMenu.removeItem&&this._parentMenu.removeItem(this),this._hovered.complete(),this._focused.complete()}_getTabIndex(){return this.disabled&&!this.disabledInteractive?"-1":"0"}_getAriaDisabled(){return this._isAnchor?this.disabled||null:this.disabled&&this.disabledInteractive?!0:null}_getDisabled(){return this.disabledInteractive||!this.disabled?null:!0}_getHostElement(){return this._elementRef.nativeElement}_checkDisabled(e){this.disabled&&(e.preventDefault(),e.stopPropagation())}_handleMouseEnter(){this._hovered.next(this)}getLabel(){let e=this._elementRef.nativeElement.cloneNode(!0),i=e.querySelectorAll("mat-icon, .material-icons, .material-symbols-outlined, .material-symbols-rounded, .material-symbols-sharp");for(let o=0;o<i.length;o++)i[o].remove();return e.textContent?.trim()||""}_setHighlighted(e){this._highlighted=e,this._changeDetectorRef.markForCheck()}_setTriggersSubmenu(e){this._triggersSubmenu=e,this._changeDetectorRef.markForCheck()}_hasFocus(){return this._document&&this._document.activeElement===this._getHostElement()}static \u0275fac=function(i){return new(i||t)};static \u0275cmp=(function(){let e=[[["mat-icon"],["","matMenuItemIcon",""]],"*"],i=["mat-icon, [matMenuItemIcon]","*"];function o(a,r){a&1&&(_n(),f(0,"svg",2),A(1,"polygon",3),u())}return H({type:t,selectors:[["","mat-menu-item",""]],hostAttrs:[1,"mat-mdc-menu-item","mat-focus-indicator"],hostVars:12,hostBindings:function(r,s){r&1&&V("click",function(d){return s._checkDisabled(d)})("mouseenter",function(){return s._handleMouseEnter()}),r&2&&(Q("role",s.role)("tabindex",s._getTabIndex())("aria-disabled",s._getAriaDisabled())("disabled",s._getDisabled()),z("mat-mdc-menu-item-highlighted",s._highlighted)("mat-mdc-menu-item-submenu-trigger",s._triggersSubmenu)("mat-mdc-menu-item-disabled",s.disabled)("mat-mdc-menu-item-disabled-interactive",s.disabledInteractive))},inputs:{role:"role",disabled:[2,"disabled","disabled",O],disabledInteractive:[2,"disabledInteractive","disabledInteractive",O],disableRipple:[2,"disableRipple","disableRipple",O]},exportAs:["matMenuItem"],ngContentSelectors:i,decls:5,vars:3,consts:[[1,"mat-mdc-menu-item-text"],["matRipple","",1,"mat-mdc-menu-ripple",3,"matRippleDisabled","matRippleTrigger"],["viewBox","0 0 5 10","focusable","false","aria-hidden","true",1,"mat-mdc-menu-submenu-icon"],["points","0,0 5,5 0,10"]],template:function(r,s){r&1&&(Be(e),oe(0),f(1,"span",0),oe(2,1),u(),A(3,"div",1),k(4,o,2,0,"svg",2)),r&2&&(h(3),R("matRippleDisabled",s.disableRipple||s.disabled)("matRippleTrigger",s._getHostElement()),h(),N(s._triggersSubmenu?4:-1))},dependencies:[ai],encapsulation:2})})()}return t})();var SO=new D("MatMenuContent");var wO=new D("mat-menu-default-options",{providedIn:"root",factory:()=>({overlapTrigger:!1,xPosition:"after",yPosition:"below",backdropClass:"cdk-overlay-transparent-backdrop"})}),mb="_mat-menu-enter",Ku="_mat-menu-exit",Qr=(()=>{class t{_elementRef=p(q);_changeDetectorRef=p(He);_injector=p(ie);_keyManager;_xPosition;_yPosition;_firstItemFocusRef;_exitFallbackTimeout;_animationsDisabled=qe();_allItems;_directDescendantItems=new Mn;_classList={};_panelAnimationState="void";_animationDone=new B;_isAnimating=G(!1);parentMenu;direction;overlayPanelClass;backdropClass;ariaLabel;ariaLabelledby;ariaDescribedby;get xPosition(){return this._xPosition}set xPosition(e){this._xPosition=e,this.setPositionClasses()}get yPosition(){return this._yPosition}set yPosition(e){this._yPosition=e,this.setPositionClasses()}templateRef;items;lazyContent;overlapTrigger=!1;hasBackdrop;get panelClass(){return this._previousPanelClass}set panelClass(e){let i=this._previousPanelClass,o=I({},this._classList);i&&i.length&&i.split(" ").forEach(a=>{o[a]=!1}),this._previousPanelClass=e,e&&e.length&&(e.split(" ").forEach(a=>{o[a]=!0}),this._elementRef.nativeElement.className=""),this._classList=o}_previousPanelClass="";get classList(){return this.panelClass}set classList(e){this.panelClass=e}closed=new K;close=this.closed;panelId=p(Qe).getId("mat-menu-panel-");constructor(){let e=p(wO);this.overlayPanelClass=e.overlayPanelClass||"",this._xPosition=e.xPosition,this._yPosition=e.yPosition,this.backdropClass=e.backdropClass,this.overlapTrigger=e.overlapTrigger,this.hasBackdrop=e.hasBackdrop}ngOnInit(){this.setPositionClasses()}ngAfterContentInit(){this._updateDirectDescendants(),this._keyManager=new Qi(this._directDescendantItems).withWrap().withTypeAhead().withHomeAndEnd().skipPredicate(e=>e.disabled&&!e.disabledInteractive),this._keyManager.tabOut.subscribe(()=>this.closed.emit("tab")),this._directDescendantItems.changes.pipe(st(this._directDescendantItems),Kt(e=>bt(...e.map(i=>i._focused)))).subscribe(e=>this._keyManager.updateActiveItem(e)),this._directDescendantItems.changes.subscribe(e=>{let i=this._keyManager;if(this._panelAnimationState==="enter"&&i.activeItem?._hasFocus()){let o=e.toArray(),a=Math.max(0,Math.min(o.length-1,i.activeItemIndex||0));o[a]&&!o[a].disabled?i.setActiveItem(a):i.setNextItemActive()}})}ngOnDestroy(){this._keyManager?.destroy(),this._directDescendantItems.destroy(),this.closed.complete(),this._firstItemFocusRef?.destroy(),clearTimeout(this._exitFallbackTimeout)}_hovered(){return this._directDescendantItems.changes.pipe(st(this._directDescendantItems),Kt(i=>bt(...i.map(o=>o._hovered))))}addItem(e){}removeItem(e){}_handleKeydown(e){let i=e.keyCode,o=this._keyManager;switch(i){case 27:pt(e)||(e.preventDefault(),this.closed.emit("keydown"));break;case 37:this.parentMenu&&this.direction==="ltr"&&this.closed.emit("keydown");break;case 39:this.parentMenu&&this.direction==="rtl"&&this.closed.emit("keydown");break;default:(i===38||i===40)&&o.setFocusOrigin("keyboard"),o.onKeydown(e);return}}focusFirstItem(e="program"){this._firstItemFocusRef?.destroy(),this._firstItemFocusRef=Et(()=>{let i=this._resolvePanel();if(!i||!i.contains(document.activeElement)){let o=this._keyManager;o.setFocusOrigin(e).setFirstItemActive(),!o.activeItem&&i&&i.focus()}},{injector:this._injector})}resetActiveItem(){this._keyManager.setActiveItem(-1)}setElevation(e){}setPositionClasses(e=this.xPosition,i=this.yPosition){this._classList=W(I({},this._classList),{"mat-menu-before":e==="before","mat-menu-after":e==="after","mat-menu-above":i==="above","mat-menu-below":i==="below"}),this._changeDetectorRef.markForCheck()}_onAnimationDone(e){let i=e===Ku;(i||e===mb)&&(i&&(clearTimeout(this._exitFallbackTimeout),this._exitFallbackTimeout=void 0),this._animationDone.next(i?"void":"enter"),this._isAnimating.set(!1))}_onAnimationStart(e){(e===mb||e===Ku)&&this._isAnimating.set(!0)}_setIsOpen(e){if(this._panelAnimationState=e?"enter":"void",e){if(this._keyManager.activeItemIndex===0){let i=this._resolvePanel();i&&(i.scrollTop=0)}}else this._animationsDisabled||(this._exitFallbackTimeout=setTimeout(()=>this._onAnimationDone(Ku),200));this._animationsDisabled&&setTimeout(()=>{this._onAnimationDone(e?mb:Ku)}),this._changeDetectorRef.markForCheck()}_updateDirectDescendants(){this._allItems.changes.pipe(st(this._allItems)).subscribe(e=>{this._directDescendantItems.reset(e.filter(i=>i._parentMenu===this)),this._directDescendantItems.notifyOnChanges()})}_resolvePanel(){let e=null;return this._directDescendantItems.length&&(e=this._directDescendantItems.first._getHostElement().closest('[role="menu"]')),e}static \u0275fac=function(i){return new(i||t)};static \u0275cmp=(function(){let e=["*"];function i(o,a){if(o&1){let r=We();Je(0,"div",0),_r("click",function(){De(r);let c=x();return Me(c.closed.emit("click"))})("animationstart",function(c){De(r);let d=x();return Me(d._onAnimationStart(c.animationName))})("animationend",function(c){De(r);let d=x();return Me(d._onAnimationDone(c.animationName))})("animationcancel",function(c){De(r);let d=x();return Me(d._onAnimationDone(c.animationName))}),Je(1,"div",1),oe(2),it()()}if(o&2){let r=x();Ke(r._classList),z("mat-menu-panel-animations-disabled",r._animationsDisabled)("mat-menu-panel-exit-animation",r._panelAnimationState==="void")("mat-menu-panel-animating",r._isAnimating()),Vt("id",r.panelId),Q("aria-label",r.ariaLabel||null)("aria-labelledby",r.ariaLabelledby||null)("aria-describedby",r.ariaDescribedby||null)}}return H({type:t,selectors:[["mat-menu"]],contentQueries:function(a,r,s){if(a&1&&Mt(s,SO,5)(s,Oc,5)(s,Oc,4),a&2){let c;Y(c=Z())&&(r.lazyContent=c.first),Y(c=Z())&&(r._allItems=c),Y(c=Z())&&(r.items=c)}},viewQuery:function(a,r){if(a&1&&ot(At,5),a&2){let s;Y(s=Z())&&(r.templateRef=s.first)}},hostVars:3,hostBindings:function(a,r){a&2&&Q("aria-label",null)("aria-labelledby",null)("aria-describedby",null)},inputs:{backdropClass:"backdropClass",ariaLabel:[0,"aria-label","ariaLabel"],ariaLabelledby:[0,"aria-labelledby","ariaLabelledby"],ariaDescribedby:[0,"aria-describedby","ariaDescribedby"],xPosition:"xPosition",yPosition:"yPosition",overlapTrigger:[2,"overlapTrigger","overlapTrigger",O],hasBackdrop:[2,"hasBackdrop","hasBackdrop",o=>o==null?null:O(o)],panelClass:[0,"class","panelClass"],classList:"classList"},outputs:{closed:"closed",close:"close"},exportAs:["matMenu"],features:[ze([{provide:pb,useExisting:t}])],ngContentSelectors:e,decls:1,vars:0,consts:[["tabindex","-1","role","menu",1,"mat-mdc-menu-panel",3,"click","animationstart","animationend","animationcancel","id"],[1,"mat-mdc-menu-content"]],template:function(a,r){a&1&&(Be(),wo(0,i,3,12,"ng-template"))},styles:[`mat-menu {
  display: none;
}

.mat-mdc-menu-content {
  margin: 0;
  padding: 8px 0;
  outline: 0;
}
.mat-mdc-menu-content,
.mat-mdc-menu-content .mat-mdc-menu-item .mat-mdc-menu-item-text {
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  flex: 1;
  white-space: normal;
  font-family: var(--%NS%mat-menu-item-label-text-font, var(--%NS%mat-sys-label-large-font));
  line-height: var(--%NS%mat-menu-item-label-text-line-height, var(--%NS%mat-sys-label-large-line-height));
  font-size: var(--%NS%mat-menu-item-label-text-size, var(--%NS%mat-sys-label-large-size));
  letter-spacing: var(--%NS%mat-menu-item-label-text-tracking, var(--%NS%mat-sys-label-large-tracking));
  font-weight: var(--%NS%mat-menu-item-label-text-weight, var(--%NS%mat-sys-label-large-weight));
}

@keyframes _mat-menu-enter {
  from {
    opacity: 0;
    transform: scale(0.8);
  }
  to {
    opacity: 1;
    transform: none;
  }
}
@keyframes _mat-menu-exit {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}
.mat-mdc-menu-panel {
  min-width: 112px;
  max-width: 280px;
  overflow: auto;
  box-sizing: border-box;
  outline: 0;
  animation: _mat-menu-enter 120ms cubic-bezier(0, 0, 0.2, 1);
  border-radius: var(--%NS%mat-menu-container-shape, var(--%NS%mat-sys-corner-extra-small));
  background-color: var(--%NS%mat-menu-container-color, var(--%NS%mat-sys-surface-container));
  box-shadow: var(--%NS%mat-menu-container-elevation-shadow, 0px 3px 1px -2px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12));
  will-change: transform, opacity;
}
.mat-mdc-menu-panel.mat-menu-panel-exit-animation {
  animation: _mat-menu-exit 100ms 25ms linear forwards;
}
.mat-mdc-menu-panel.mat-menu-panel-animations-disabled {
  animation: none;
}
.mat-mdc-menu-panel.mat-menu-panel-animating {
  pointer-events: none;
}
.mat-mdc-menu-panel.mat-menu-panel-animating:has(.mat-mdc-menu-content:empty) {
  display: none;
}
@media (forced-colors: active) {
  .mat-mdc-menu-panel {
    outline: solid 1px;
  }
}
.mat-mdc-menu-panel .mat-divider {
  border-top-color: var(--%NS%mat-menu-divider-color, var(--%NS%mat-sys-surface-variant));
  margin-bottom: var(--%NS%mat-menu-divider-bottom-spacing, 8px);
  margin-top: var(--%NS%mat-menu-divider-top-spacing, 8px);
}

.mat-mdc-menu-item {
  display: flex;
  position: relative;
  align-items: center;
  justify-content: flex-start;
  overflow: hidden;
  padding: 0;
  cursor: pointer;
  width: 100%;
  text-align: left;
  box-sizing: border-box;
  color: inherit;
  font-size: inherit;
  background: none;
  text-decoration: none;
  margin: 0;
  min-height: 48px;
  padding-left: var(--%NS%mat-menu-item-leading-spacing, 12px);
  padding-right: var(--%NS%mat-menu-item-trailing-spacing, 12px);
  -webkit-user-select: none;
  user-select: none;
  cursor: pointer;
  outline: none;
  border: none;
  -webkit-tap-highlight-color: transparent;
}
.mat-mdc-menu-item::-moz-focus-inner {
  border: 0;
}
[dir=rtl] .mat-mdc-menu-item {
  padding-left: var(--%NS%mat-menu-item-trailing-spacing, 12px);
  padding-right: var(--%NS%mat-menu-item-leading-spacing, 12px);
}
.mat-mdc-menu-item:has(.material-icons, .material-symbols-outlined, .material-symbols-rounded, .material-symbols-sharp, mat-icon, [matButtonIcon]) {
  padding-left: var(--%NS%mat-menu-item-with-icon-leading-spacing, 12px);
  padding-right: var(--%NS%mat-menu-item-with-icon-trailing-spacing, 12px);
}
[dir=rtl] .mat-mdc-menu-item:has(.material-icons, .material-symbols-outlined, .material-symbols-rounded, .material-symbols-sharp, mat-icon, [matButtonIcon]) {
  padding-left: var(--%NS%mat-menu-item-with-icon-trailing-spacing, 12px);
  padding-right: var(--%NS%mat-menu-item-with-icon-leading-spacing, 12px);
}
.mat-mdc-menu-item, .mat-mdc-menu-item:visited, .mat-mdc-menu-item:link {
  color: var(--%NS%mat-menu-item-label-text-color, var(--%NS%mat-sys-on-surface));
}
.mat-mdc-menu-item .mat-icon-no-color,
.mat-mdc-menu-item .mat-mdc-menu-submenu-icon {
  color: var(--%NS%mat-menu-item-icon-color, var(--%NS%mat-sys-on-surface-variant));
}
.mat-mdc-menu-item[disabled], .mat-mdc-menu-item.mat-mdc-menu-item-disabled {
  cursor: default;
  opacity: 0.38;
}
.mat-mdc-menu-item[disabled]::after, .mat-mdc-menu-item.mat-mdc-menu-item-disabled::after {
  display: block;
  position: absolute;
  content: "";
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
}
.mat-mdc-menu-item:focus {
  outline: 0;
}
.mat-mdc-menu-item .mat-icon {
  flex-shrink: 0;
  margin-right: var(--%NS%mat-menu-item-spacing, 12px);
  height: var(--%NS%mat-menu-item-icon-size, 24px);
  width: var(--%NS%mat-menu-item-icon-size, 24px);
}
[dir=rtl] .mat-mdc-menu-item {
  text-align: right;
}
[dir=rtl] .mat-mdc-menu-item .mat-icon {
  margin-right: 0;
  margin-left: var(--%NS%mat-menu-item-spacing, 12px);
}
.mat-mdc-menu-item:not([disabled]):hover {
  background-color: var(--%NS%mat-menu-item-hover-state-layer-color, color-mix(in srgb, var(--%NS%mat-sys-on-surface) calc(var(--%NS%mat-sys-hover-state-layer-opacity) * 100%), transparent));
}
.mat-mdc-menu-item:not([disabled]).cdk-program-focused, .mat-mdc-menu-item:not([disabled]).cdk-keyboard-focused, .mat-mdc-menu-item:not([disabled]).mat-mdc-menu-item-highlighted {
  background-color: var(--%NS%mat-menu-item-focus-state-layer-color, color-mix(in srgb, var(--%NS%mat-sys-on-surface) calc(var(--%NS%mat-sys-focus-state-layer-opacity) * 100%), transparent));
}
@media (forced-colors: active) {
  .mat-mdc-menu-item {
    margin-top: 1px;
  }
}

.mat-mdc-menu-submenu-icon {
  width: var(--%NS%mat-menu-item-icon-size, 24px);
  height: 10px;
  fill: currentColor;
  padding-left: var(--%NS%mat-menu-item-spacing, 12px);
}
[dir=rtl] .mat-mdc-menu-submenu-icon {
  padding-right: var(--%NS%mat-menu-item-spacing, 12px);
  padding-left: 0;
}
[dir=rtl] .mat-mdc-menu-submenu-icon polygon {
  transform: scaleX(-1);
  transform-origin: center;
}
@media (forced-colors: active) {
  .mat-mdc-menu-submenu-icon {
    fill: CanvasText;
  }
}

.mat-mdc-menu-item .mat-mdc-menu-ripple {
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  position: absolute;
  pointer-events: none;
}
`],encapsulation:2})})()}return t})(),EO=new D("mat-menu-scroll-strategy",{providedIn:"root",factory:()=>{let t=p(ie);return()=>ci(t)}});var Xr=new WeakMap,DO=(()=>{class t{_canHaveBackdrop;_element=p(q);_viewContainerRef=p(Bt);_menuItemInstance=p(Oc,{optional:!0,self:!0});_dir=p(ft,{optional:!0});_focusMonitor=p(un);_ngZone=p(X);_injector=p(ie);_scrollStrategy=p(EO);_changeDetectorRef=p(He);_animationsDisabled=qe();_portal;_overlayRef=null;_menuOpen=!1;_closingActionsSubscription=_e.EMPTY;_menuCloseSubscription=_e.EMPTY;_pendingRemoval;_parentMaterialMenu;_parentInnerPadding;_openedBy=void 0;get _menu(){return this._menuInternal}set _menu(e){e!==this._menuInternal&&(this._menuInternal=e,this._menuCloseSubscription.unsubscribe(),e?(this._parentMaterialMenu,this._menuCloseSubscription=e.close.subscribe(i=>{this._destroyMenu(i),(i==="click"||i==="tab")&&this._parentMaterialMenu&&this._parentMaterialMenu.closed.emit(i)})):this._destroyMenu(),this._menuItemInstance?._setTriggersSubmenu(this._triggersSubmenu()))}_menuInternal=null;constructor(e){this._canHaveBackdrop=e;let i=p(pb,{optional:!0});this._parentMaterialMenu=i instanceof Qr?i:void 0}ngOnDestroy(){this._menu&&this._ownsMenu(this._menu)&&Xr.delete(this._menu),this._pendingRemoval?.unsubscribe(),this._menuCloseSubscription.unsubscribe(),this._closingActionsSubscription.unsubscribe(),this._overlayRef&&(this._overlayRef.dispose(),this._overlayRef=null)}get menuOpen(){return this._menuOpen}get dir(){return this._dir&&this._dir.value==="rtl"?"rtl":"ltr"}_triggersSubmenu(){return!!(this._menuItemInstance&&this._parentMaterialMenu&&this._menu)}_closeMenu(){this._menu?.close.emit()}_openMenu(e){if(this._triggerIsAriaDisabled())return;let i=this._menu;if(this._menuOpen||!i)return;this._pendingRemoval?.unsubscribe();let o=Xr.get(i);Xr.set(i,this),o&&o!==this&&o._closeMenu();let a=this._createOverlay(i),r=a.getConfig(),s=r.positionStrategy;this._setPosition(i,s),this._canHaveBackdrop?r.hasBackdrop=i.hasBackdrop==null?!this._triggersSubmenu():i.hasBackdrop:r.hasBackdrop=i.hasBackdrop??!1,a.hasAttached()||(a.attach(this._getPortal(i)),i.lazyContent?.attach(this.menuData)),this._closingActionsSubscription=this._menuClosingActions().subscribe(()=>this._closeMenu()),i.parentMenu=this._triggersSubmenu()?this._parentMaterialMenu:void 0,i.direction=this.dir,e&&i.focusFirstItem(this._openedBy||"program"),this._setIsMenuOpen(!0),i instanceof Qr&&(i._setIsOpen(!0),i._directDescendantItems.changes.pipe(Re(i.close)).subscribe(()=>{s.withLockedPosition(!1).reapplyLastPosition(),s.withLockedPosition(!0)}))}focus(e,i){this._focusMonitor&&e?this._focusMonitor.focusVia(this._element,e,i):this._element.nativeElement.focus(i)}_destroyMenu(e){let i=this._overlayRef,o=this._menu;!i||!this.menuOpen||(this._closingActionsSubscription.unsubscribe(),this._pendingRemoval?.unsubscribe(),o instanceof Qr&&this._ownsMenu(o)?(this._pendingRemoval=o._animationDone.pipe(Ft(1)).subscribe(()=>{i.detach(),Xr.has(o)||o.lazyContent?.detach()}),o._setIsOpen(!1)):(i.detach(),o?.lazyContent?.detach()),o&&this._ownsMenu(o)&&Xr.delete(o),this.restoreFocus&&(e==="keydown"||!this._openedBy||!this._triggersSubmenu())&&this.focus(this._openedBy),this._openedBy=void 0,this._setIsMenuOpen(!1))}_setIsMenuOpen(e){e!==this._menuOpen&&(this._menuOpen=e,this._menuOpen?this.menuOpened.emit():this.menuClosed.emit(),this._triggersSubmenu()&&this._menuItemInstance._setHighlighted(e),this._changeDetectorRef.markForCheck())}_createOverlay(e){if(!this._overlayRef){let i=this._getOverlayConfig(e);this._subscribeToPositions(e,i.positionStrategy),this._overlayRef=li(this._injector,i),this._overlayRef.keydownEvents().subscribe(o=>{this._menu instanceof Qr&&this._menu._handleKeydown(o)})}return this._overlayRef}_getOverlayConfig(e){return new si({positionStrategy:eo(this._injector,this._getOverlayOrigin()).withLockedPosition().withGrowAfterOpen().withTransformOriginOn(".mat-menu-panel, .mat-mdc-menu-panel"),backdropClass:e.backdropClass||"cdk-overlay-transparent-backdrop",panelClass:e.overlayPanelClass,scrollStrategy:this._scrollStrategy(),direction:this._dir||"ltr",disableAnimations:this._animationsDisabled})}_subscribeToPositions(e,i){e.setPositionClasses&&i.positionChanges.subscribe(o=>{this._ngZone.run(()=>{let a=o.connectionPair.overlayX==="start"?"after":"before",r=o.connectionPair.overlayY==="top"?"below":"above";e.setPositionClasses(a,r)})})}_setPosition(e,i){let[o,a]=e.xPosition==="before"?["end","start"]:["start","end"],[r,s]=e.yPosition==="above"?["bottom","top"]:["top","bottom"],[c,d]=[r,s],[l,m]=[o,a],v=0;if(this._triggersSubmenu()){if(m=o=e.xPosition==="before"?"start":"end",a=l=o==="end"?"start":"end",this._parentMaterialMenu){if(this._parentInnerPadding==null){let g=this._parentMaterialMenu.items.first;this._parentInnerPadding=g?g._getHostElement().offsetTop:0}v=r==="bottom"?this._parentInnerPadding:-this._parentInnerPadding}}else e.overlapTrigger||(c=r==="top"?"bottom":"top",d=s==="top"?"bottom":"top");i.withPositions([{originX:o,originY:c,overlayX:l,overlayY:r,offsetY:v},{originX:a,originY:c,overlayX:m,overlayY:r,offsetY:v},{originX:o,originY:d,overlayX:l,overlayY:s,offsetY:-v},{originX:a,originY:d,overlayX:m,overlayY:s,offsetY:-v}])}_menuClosingActions(){let e=this._getOutsideClickStream(this._overlayRef),i=this._overlayRef.detachments(),o=this._parentMaterialMenu?this._parentMaterialMenu.closed:Nt(),a=this._parentMaterialMenu?this._parentMaterialMenu._hovered().pipe(Ze(r=>this._menuOpen&&r!==this._menuItemInstance)):Nt();return bt(e,o,a,i)}_getPortal(e){return(!this._portal||this._portal.templateRef!==e.templateRef)&&(this._portal=new xn(e.templateRef,this._viewContainerRef)),this._portal}_ownsMenu(e){return Xr.get(e)===this}_triggerIsAriaDisabled(){return O(this._element.nativeElement.getAttribute("aria-disabled"))}static \u0275fac=function(i){Qf()};static \u0275dir=ee({type:t})}return t})(),Ow=(()=>{class t extends DO{_cleanupTouchstart;_hoverSubscription=_e.EMPTY;get _deprecatedMatMenuTriggerFor(){return this.menu}set _deprecatedMatMenuTriggerFor(e){this.menu=e}get menu(){return this._menu}set menu(e){this._menu=e}menuData;restoreFocus=!0;menuOpened=new K;onMenuOpen=this.menuOpened;menuClosed=new K;onMenuClose=this.menuClosed;constructor(){super(!0);let e=p(Ue);this._cleanupTouchstart=e.listen(this._element.nativeElement,"touchstart",i=>{Da(i)||(this._openedBy="touch")},{passive:!0})}triggersSubmenu(){return super._triggersSubmenu()}toggleMenu(){return this.menuOpen?this.closeMenu():this.openMenu()}openMenu(){this._openMenu(!0)}closeMenu(){this._closeMenu()}updatePosition(){this._overlayRef?.updatePosition()}ngAfterContentInit(){this._handleHover()}ngOnDestroy(){super.ngOnDestroy(),this._cleanupTouchstart(),this._hoverSubscription.unsubscribe()}_getOverlayOrigin(){return this._element}_getOutsideClickStream(e){return e.backdropClick()}_handleMousedown(e){Ea(e)||(this._openedBy=e.button===0?"mouse":void 0,this.triggersSubmenu()&&e.preventDefault())}_handleKeydown(e){let i=e.keyCode;(i===13||i===32)&&(this._openedBy="keyboard"),this.triggersSubmenu()&&(i===39&&this.dir==="ltr"||i===37&&this.dir==="rtl")&&(this._openedBy="keyboard",this.openMenu())}_handleClick(e){this.triggersSubmenu()?(e.stopPropagation(),this.openMenu()):this.toggleMenu()}_handleHover(){this.triggersSubmenu()&&this._parentMaterialMenu&&(this._hoverSubscription=this._parentMaterialMenu._hovered().subscribe(e=>{e===this._menuItemInstance&&!e.disabled&&this._parentMaterialMenu?._panelAnimationState!=="void"&&(this._openedBy="mouse",this._openMenu(!1))}))}static \u0275fac=function(i){return new(i||t)};static \u0275dir=ee({type:t,selectors:[["","mat-menu-trigger-for",""],["","matMenuTriggerFor",""]],hostAttrs:[1,"mat-mdc-menu-trigger"],hostVars:3,hostBindings:function(i,o){i&1&&V("click",function(r){return o._handleClick(r)})("mousedown",function(r){return o._handleMousedown(r)})("keydown",function(r){return o._handleKeydown(r)}),i&2&&Q("aria-haspopup",o.menu?"menu":null)("aria-expanded",o.menuOpen)("aria-controls",o.menuOpen?o.menu?.panelId:null)},inputs:{_deprecatedMatMenuTriggerFor:[0,"mat-menu-trigger-for","_deprecatedMatMenuTriggerFor"],menu:[0,"matMenuTriggerFor","menu"],menuData:[0,"matMenuTriggerData","menuData"],restoreFocus:[0,"matMenuTriggerRestoreFocus","restoreFocus"]},outputs:{menuOpened:"menuOpened",onMenuOpen:"onMenuOpen",menuClosed:"menuClosed",onMenuClose:"onMenuClose"},exportAs:["matMenuTrigger"],features:[Ge]})}return t})();var Rw=(()=>{class t{static \u0275fac=function(i){return new(i||t)};static \u0275mod=le({type:t});static \u0275inj=se({imports:[wi,di,Ne,ri]})}return t})();var IO=["alvo"],gb=(t,n)=>n.id;function kO(t,n){if(t&1){let e=We();f(0,"div",8),V("click",function(o){let a=De(e).$implicit,r=x();return o.stopPropagation(),Me(r.store.alternarCamada(a.id))}),f(1,"mat-checkbox",9),V("click",function(o){return o.preventDefault()}),u(),f(2,"mat-icon"),b(3),u(),f(4,"span"),b(5),u()()}if(t&2){let e=n.$implicit,i=x();Q("aria-checked",i.camadas()[e.id]),h(),R("checked",i.camadas()[e.id]),h(2),S(e.icone),h(2),S(e.nome)}}function NO(t,n){if(t&1&&(f(0,"span"),A(1,"i"),b(2),u()),t&2){let e=n.$implicit;h(),we("background",e.cor),h(),S(e.rotulo)}}function TO(t,n){if(t&1&&(f(0,"div",7)(1,"div",10),b(2),u(),f(3,"div",11),b(4,"por 100 mil habitantes \xB7 12 meses"),u(),f(5,"div",12),xe(6,NO,3,3,"span",null,Eo),f(8,"span"),A(9,"i",13),b(10,"sem registro"),u()()()),t&2){let e=n;h(2),S(e.titulo),h(4),Ce(e.faixas)}}function AO(t,n){if(t&1&&(f(0,"div",14)(1,"b"),b(2),u(),f(3,"span"),b(4),u()()),t&2){let e=n;h(2),re("Dados oficiais \xB7 ",e.orgao),h(2),qi("",e.total," ocorr\xEAncias registradas (",e.cats,"), ",e.periodo,". Bairros pintados pelo n\xFAmero oficial; quadrados = local do crime contra a vida.")}}function OO(t,n){t&1&&(f(0,"div",15),A(1,"i",22),b(2,"\xC1reas de delegacia: cor = mortes violentas (ISP-RJ, oficial)"),u())}function RO(t,n){if(t&1&&(f(0,"span"),A(1,"i",26),b(2),u()),t&2){let e=x();h(2),re("",e.disputa," em disputa entre fac\xE7\xF5es/mil\xEDcia")}}function PO(t,n){if(t&1&&(f(0,"div",16)(1,"b"),b(2),u(),f(3,"span"),A(4,"i",23),b(5),u(),f(6,"span"),A(7,"i",24),b(8),u(),f(9,"span"),A(10,"i",25),b(11),u(),k(12,RO,3,1,"span"),u()),t&2){let e=n;h(2),re("",e.total," tiroteios \xB7 Fogo Cruzado \xB7 12 meses"),h(3),re("",e.mortes," com morte"),h(3),re("",e.feridos," com feridos"),h(3),re("",e.sem," sem v\xEDtimas"),h(),N(e.disputa?12:-1)}}function FO(t,n){if(t&1&&(f(0,"li")(1,"a",27),b(2),u(),f(3,"small"),b(4),u()()),t&2){let e=n.$implicit;h(),R("href",e.link,So),h(),S(e.titulo),h(2),S(e.data)}}function LO(t,n){if(t&1&&(f(0,"details",17)(1,"summary"),b(2),u(),f(3,"ul"),xe(4,FO,5,3,"li",null,gb),u()()),t&2){let e=x();h(2),re("",e.semLocal," sem bairro identificado"),h(2),Ce(e.listaSem)}}function BO(t,n){if(t&1){let e=We();f(0,"button",28),V("click",function(){let o=De(e).$implicit,a=x(2);return Me(a.store.alternarCategoria(o.id))}),A(1,"i"),b(2),u()}if(t&2){let e=n.$implicit,i=x(2);z("ativa",i.store.categorias().includes(e.id)),R("title","Filtrar: "+e.nome),Q("aria-pressed",i.store.categorias().includes(e.id)),h(),we("background",e.cor),h(),dt("",e.curto," ",e.qtd)}}function VO(t,n){t&1&&(f(0,"div",20)(1,"span"),b(2,"menor"),u(),A(3,"div"),f(4,"span"),b(5,"maior"),u()())}function jO(t,n){t&1&&(f(0,"div",21),A(1,"i"),b(2," Zona vermelha (concentra\xE7\xE3o)"),u())}function zO(t,n){if(t&1&&(f(0,"div",7)(1,"div",10),b(2),u(),f(3,"div",11),b(4),u(),k(5,AO,5,4,"div",14),k(6,OO,3,0,"div",15),k(7,PO,13,5,"div",16),k(8,LO,6,1,"details",17),f(9,"div",18),xe(10,BO,3,8,"button",19,gb),u(),k(12,VO,6,0,"div",20),k(13,jO,3,0,"div",21),u()),t&2){let e,i,o=n,a=x();h(2),qi("",o.total," not\xEDcias em ",o.periodo>=365?"12 meses":o.periodo>=180?"6 meses":o.periodo+" dias"," \xB7 ",o.noMapa," com local exato"),h(2),S(o.bairro?o.bairro+" contadas no bairro citado (\xE1rea pintada)":""),h(),N((e=o.oficial)?5:-1,e),h(),N(o.delegacias?6:-1),h(),N((i=o.fogo)?7:-1,i),h(),N(o.semLocal?8:-1),h(2),Ce(o.cats),h(2),N(a.camadas().calor?12:-1),h(),N(a.camadas().zonas&&o.zonas?13:-1)}}var Jr=["#fde0c5","#facba6","#f59e74","#e5604b","#c42e3c","#8a1538"],HO=["#f59e0b","#ef4444","#7f1d1d"],es=t=>t.mortos?2:t.feridos?1:0;function fb(t,n,e){if(!e?.features?.length)return!0;for(let i of e.features){let o=i.geometry;if(!o)continue;let a=o.type==="MultiPolygon"?o.coordinates:o.type==="Polygon"?[o.coordinates]:[];for(let r of a){let s=!1;for(let c of r)for(let d=0,l=c.length-1;d<c.length;l=d++){let[m,v]=c[d],[g,y]=c[l];v>t!=y>t&&n<(g-m)*(t-v)/(y-v)+m&&(s=!s)}if(s)return!0}}return!1}var hb=["#fde047","#facc15","#fb923c","#f97316","#ef4444","#b91c1c","#7f1d1d"],Xu=class t{store=p(kt);alvo=Bn.required("alvo");camadas=this.store.camadas;listaCamadas=[{id:"zonas",nome:"Zonas vermelhas",icone:"crisis_alert"},{id:"calor",nome:"Mapa de calor",icone:"local_fire_department"},{id:"pinos",nome:"Ocorr\xEAncias",icone:"location_on"},{id:"oficial",nome:"Dados oficiais por bairro (secretaria)",icone:"verified"},{id:"delegacias",nome:"\xC1reas de delegacia (oficial, RJ)",icone:"local_police"},{id:"bairros",nome:"Nomes dos bairros",icone:"label"},{id:"fronteira",nome:"Limite do munic\xEDpio",icone:"border_outer"},{id:"vizinhos",nome:"Munic\xEDpios vizinhos (taxa oficial)",icone:"grid_view"},{id:"coropletico",nome:"Taxa por munic\xEDpio (aba Estado)",icone:"map"},{id:"satelite",nome:"Sat\xE9lite",icone:"satellite_alt"},{id:"mapaEscuro",nome:"Mapa escuro",icone:"dark_mode"}];map=null;renderer;tiles={};layerFronteira;layerZonas;layerSemLocal;layerFogo;layerDelegacias;layerOficial;contorno=G(null);layerBairros;layerCoropletico;cluster;calor=null;pontosCalor=[];usuarioMoveu=!1;movimentoProgramatico=!1;tokenFronteira=0;tokenCoropletico=0;ufEnquadradaCoropletico="";ultimoEnquadramento="";observador;malhaEstado=G(null);coropleticoAtivo=P(()=>{let n=this.store.panorama();return this.store.aba()==="ESTADO"&&this.camadas().coropletico&&!!n?.disponivel&&n.uf===this.store.uf()&&!!n.rankings?.length});vizinhosAtivo=P(()=>{let n=this.store.panorama();return!this.coropleticoAtivo()&&this.store.escopo()==="CIDADE"&&this.camadas().vizinhos&&!!n?.disponivel&&n.uf===this.store.uf()&&!!n.rankings?.length});legendaCoropletico=P(()=>{if(!this.coropleticoAtivo()||!this.malhaEstado())return null;let n=this.store.panorama().rankings[this.store.eventoPanorama()]||this.store.panorama().rankings[0],e=this.limites(Object.values(n.valoresTaxa));if(!e.length)return null;let i=Jr.slice(0,e.length+1).map((o,a)=>({cor:o,rotulo:a===0?"at\xE9 "+Ee(e[0]):a===e.length?"acima de "+Ee(e[a-1]):Ee(e[a-1])+"\u2013"+Ee(e[a])}));return{titulo:n.evento,faixas:i}});exatas(n,e){let i=this.store.escopo()==="CIDADE"&&e.lista.some(a=>a.aneis?.length),o=this.store.escopo()==="CIDADE"?this.contorno():null;return n.precisas.filter(a=>(!i||a.precisao!=="BAIRRO")&&fb(a.lat,a.lng,o))}legenda=P(()=>{let n=this.store.filtrados();if(!n.todas.length&&!this.store.oficialBairros())return null;let e=this.store.escopo()==="CIDADE"?this.store.bairrosMapa().peloBairro:[],i=new Set(e.map(a=>a.o)),o=n.semLocal.filter(a=>!i.has(a));return{total:T(n.todas.length),noMapa:T(this.exatas(n,this.store.bairrosMapa()).length),bairro:e.length?T(e.length):"",semLocal:o.length?T(o.length):"",listaSem:o.slice(0,30),oficial:(()=>{let a=this.camadas().oficial?this.store.oficialBairros():null;return a?{orgao:a.dado.orgao,total:T(a.cats.reduce((r,s)=>r+(a.dado.cats[s]||0),0)),periodo:a.dado.periodo,cats:a.cats.length>=8?"todos os tipos":a.cats.map(r=>Nc[r].toLowerCase()).join(", ")}:null})(),delegacias:this.camadas().delegacias&&!!this.store.ispCidade()?.areas.some(a=>a.aneis?.length),fogo:(()=>{let a=(this.store.fogoCidade()?.dado?.itens||[]).filter(r=>fb(r.lat,r.lng,this.contorno()));return a.length?{total:T(a.length),mortes:T(a.filter(r=>es(r)===2).length),feridos:T(a.filter(r=>es(r)===1).length),sem:T(a.filter(r=>es(r)===0).length),disputa:a.some(r=>r.gp)?T(a.filter(r=>r.gp).length):""}:null})(),periodo:this.store.periodoDias(),cats:Lo.filter(a=>n.porCat[a.id]).map(a=>W(I({},a),{qtd:T(n.porCat[a.id])})),zonas:n.zonas.length}});constructor(){lt(()=>{this.map||this.iniciar(this.alvo().nativeElement)}),lt(()=>{let n=this.camadas();n.satelite,n.mapaEscuro,Xe(()=>this.aplicarBase())}),lt(()=>{let n=this.store.filtrados(),e=this.camadas(),i=this.coropleticoAtivo(),o=this.store.bairrosMapa();this.contorno(),this.store.oficialBairros(),this.store.periodoDias(),Xe(()=>this.renderizar(n,e,i,o))}),lt(()=>{let n=this.store.dados(),e=this.camadas().fronteira,i=this.store.escopo();Xe(()=>this.desenharFronteira(n?.codigoIbge||"",e,i==="ESTADO"))}),lt(()=>{let n=this.store.dados();!n||n.vazio||Xe(()=>this.enquadrar())}),lt(()=>{let n=this.coropleticoAtivo(),e=this.vizinhosAtivo(),i=this.store.uf(),o=this.store.eventoPanorama(),a=this.malhaEstado();this.store.populacao(),this.store.cidade(),Xe(()=>this.desenharCoropletico(n,i,o,a,e))}),lt(()=>{let n=this.store.foco();!n||!this.map||(this.usuarioMoveu=!0,n.raio?this.map.flyToBounds(L.latLng(n.lat,n.lng).toBounds(n.raio*2.4),{duration:.5,maxZoom:16}):this.map.flyTo([n.lat,n.lng],n.zoom||16,{duration:.5}),window.innerWidth<=900&&this.alvo().nativeElement.scrollIntoView({behavior:"smooth",block:"start"}))}),lt(()=>{let n=this.store.ispCidade(),e=this.camadas(),i=this.coropleticoAtivo();Xe(()=>this.desenharDelegacias(n,e.delegacias&&!i&&this.store.escopo()==="CIDADE"))}),lt(()=>{let n=this.store.fogoCidade(),e=this.camadas(),i=this.coropleticoAtivo(),o=this.contorno();Xe(()=>this.desenharFogo((n?.dado?.itens||[]).filter(a=>fb(a.lat,a.lng,o)),e.pinos&&!i))}),lt(()=>{this.store.uf(),this.store.cidade(),this.usuarioMoveu=!1,this.ultimoEnquadramento="",Xe(()=>this.voarParaLocal())})}ngOnDestroy(){this.observador?.disconnect(),this.map?.remove()}iniciar(n){if(typeof L>"u")return;let e=this.map=L.map(n,{zoomControl:!0,preferCanvas:!0,minZoom:4,maxZoom:19}).setView([-14.5,-51.5],4);e.zoomControl.setPosition("bottomright"),this.renderer=L.canvas({padding:.4});let i=e.createPane("paneCoropletico");i.style.zIndex=340;let o=e.createPane("paneFronteira");o.style.zIndex=350,o.style.pointerEvents="none";let a=e.createPane("paneBairros");a.style.zIndex=360;let r=e.createPane("paneZonas");r.style.zIndex=450;let s=e.createPane("paneRotulos");s.style.zIndex=640;let c="https://server.arcgisonline.com/ArcGIS/rest/services/",d="&copy; Esri, HERE, Garmin, &copy; OpenStreetMap",l=L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png",{attribution:"&copy; colaboradores do OpenStreetMap",maxZoom:19}),m=0;l.on("tileerror",()=>{++m===4&&(this.tiles.claro=L.tileLayer(c+"World_Street_Map/MapServer/tile/{z}/{y}/{x}",{attribution:d,maxZoom:19}),this.map.removeLayer(l),this.aplicarBase())}),this.tiles.claro=l,this.tiles.escuro=L.layerGroup([L.tileLayer(c+"Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}",{attribution:d,maxNativeZoom:16,maxZoom:19}),L.tileLayer(c+"Canvas/World_Dark_Gray_Reference/MapServer/tile/{z}/{y}/{x}",{maxNativeZoom:16,maxZoom:19})]),this.tiles.satelite=L.tileLayer(c+"World_Imagery/MapServer/tile/{z}/{y}/{x}",{attribution:"&copy; Esri",maxZoom:19}),this.layerCoropletico=L.layerGroup().addTo(e),this.layerFronteira=L.layerGroup().addTo(e),this.layerZonas=L.layerGroup().addTo(e),this.layerSemLocal=L.layerGroup().addTo(e),this.layerFogo=L.layerGroup().addTo(e),this.layerDelegacias=L.layerGroup().addTo(e),this.layerOficial=L.layerGroup().addTo(e),this.layerBairros=L.layerGroup().addTo(e),this.cluster=typeof L.markerClusterGroup=="function"?L.markerClusterGroup({chunkedLoading:!0,maxClusterRadius:40,disableClusteringAtZoom:16,showCoverageOnHover:!1,spiderfyOnMaxZoom:!0}):L.layerGroup(),this.cluster.addTo(e),e.on("zoomend",()=>this.atualizarCalor()),e.on("dragstart",()=>this.usuarioMoveu=!0),e.on("zoomstart",()=>{this.movimentoProgramatico||(this.usuarioMoveu=!0)}),e.on("moveend",()=>this.movimentoProgramatico=!1),e.on("popupopen",g=>{let y=g.popup.getElement()?.querySelector("[data-abrir]");y?.addEventListener("click",()=>{let[_,C]=String(y.getAttribute("data-abrir")).split("|");e.closePopup(),this.store.abrirLocal(_,C)})});let v;this.observador=new ResizeObserver(()=>{clearTimeout(v),v=setTimeout(()=>{e.invalidateSize(),this.atualizarCalor()},120)}),this.observador.observe(n),this.aplicarBase()}aplicarBase(){if(!this.map)return;let n=this.camadas().satelite?this.tiles.satelite:this.camadas().mapaEscuro?this.tiles.escuro:this.tiles.claro;Object.values(this.tiles).forEach(e=>{e!==n&&this.map.hasLayer(e)&&this.map.removeLayer(e)}),this.map.hasLayer(n)||n.addTo(this.map)}mover(n){this.movimentoProgramatico=!0,n()}voarParaLocal(){let n=this.store.dados();if(!this.map||!n)return;let e=this.store.escopo()==="ESTADO";this.mover(()=>this.map.flyTo([n.centroLat,n.centroLng],e?6:fe.ZOOM_CIDADE,{duration:.6}))}enquadrar(){let n=this.store.dados();if(!this.map||this.usuarioMoveu||this.store.escopo()!=="CIDADE"||!n)return;let e=n.uf+"|"+n.cidade;if(this.ultimoEnquadramento===e)return;let i=this.store.filtrados();if(i.precisas.length>=3){this.ultimoEnquadramento=e;let o=L.latLngBounds(i.precisas.map(a=>[a.lat,a.lng]));this.mover(()=>this.map.flyToBounds(o.pad(.08),{padding:[30,30],maxZoom:15,duration:.6}))}}popup(n){let e=vt[n.cat],i=Wr[n.precisao]||Wr.PENDENTE;return`<div class="popup"><span class="popup-cat" style="color:${e.cor}">${Te(e.nome)}</span> \xB7 ${Te(n.data)}<div class="popup-titulo">${Te(n.titulo)}</div><div class="popup-meta">${Te(n.bairro)} \xB7 ${Te(i.nome)}</div><a href="${Te(Va(n.link))}" target="_blank" rel="noopener"><b>Abrir not\xEDcia</b> (${Te(n.veiculo||"fonte")})</a></div>`}desenharDelegacias(n,e){if(!this.map)return;this.layerDelegacias.clearLayers();let i=(n?.areas||[]).filter(r=>r.aneis?.length);if(!e||!i.length)return;let o=r=>r.u12.letalidade_violenta||0,a=Math.max(1,...i.map(o));for(let r of i){let s=o(r),c=r.a12.letalidade_violenta||0,d=Jr[Math.min(Jr.length-1,Math.floor(Math.sqrt(s)/Math.sqrt(a)*Jr.length))],l=L.polygon(r.aneis,{pane:"paneCoropletico",renderer:this.renderer,color:"#7f1d1d",weight:1,opacity:.7,fillColor:d,fillOpacity:.5}),m=Object.entries(n.campos).filter(([v])=>r.u12[v]!=null).map(([v,g])=>`<li>${Te(g)}: <b>${T(r.u12[v])}</b> <small>(antes ${T(r.a12[v]||0)})</small></li>`).join("");l.bindTooltip(`<b>${r.cisp}\xAA DP</b> \xB7 ${T(s)} mortes violentas (ISP, 12 meses)`,{sticky:!0}),l.bindPopup(`<div class="popup"><b>\xC1rea da ${r.cisp}\xAA DP</b><br>Letalidade violenta: <b>${T(s)}</b> nos 12 meses (antes: ${T(c)})<ul class="lista-sem-local">${m}</ul><div class="popup-meta">Fonte oficial: ${Te(n.fonte)} \xB7 ${Te(n.periodo.de)} a ${Te(n.periodo.ate)}</div></div>`),this.layerDelegacias.addLayer(l),r.lat!=null&&s>0&&this.layerDelegacias.addLayer(L.marker([r.lat,r.lng],{pane:"paneRotulos",keyboard:!1,interactive:!1,icon:L.divIcon({className:"rotulo-delegacia",iconSize:null,html:`<div>${r.cisp}\xAA DP \xB7 ${T(s)}</div>`})}))}}desenharFogo(n,e){if(!this.map||(this.layerFogo.clearLayers(),!e))return;let i=n.slice().sort((o,a)=>es(o)-es(a));for(let o of i){let a=es(o),r=L.circleMarker([o.lat,o.lng],{renderer:this.renderer,radius:[4,5.5,7.5][a],fillColor:HO[a],color:o.gp?"#a855f7":"#111827",weight:o.gp?2.2:a===2?1.6:1,fillOpacity:.9});r.bindPopup(()=>`<div class="popup"><span class="popup-cat" style="color:#dc2626">Tiroteio</span> \xB7 ${Te(o.d)}<div class="popup-titulo">${Te(o.bairro||"Bairro n\xE3o informado")}</div><div class="popup-meta">${Te(o.endereco)}</div>${T(o.mortos)} mortos \xB7 ${T(o.feridos)} feridos${o.tipoAcao==="presenca"?" \xB7 com presen\xE7a de agentes":o.policia?" \xB7 com a\xE7\xE3o policial":""}${o.motivo?"<br>Motivo: "+Te(o.motivo):""}${o.gp?'<br><b style="color:#a855f7">Disputa entre grupos armados (fac\xE7\xE3o/mil\xEDcia)</b>':""}${o.mc?.length?"<br>"+Te(o.mc.join(", ")):""}${o.rc?.length?"<br>Recortes: "+Te(o.rc.join(", ")):""}${o.ch?"<br><b>Chacina</b>":""}${o.ag&&(o.ag.m||o.ag.f)?`<br>Agentes: ${o.ag.m} mortos, ${o.ag.f} feridos`:""}${o.cr?`<br>${o.cr} crian\xE7a(s)/adolescente(s) atingido(s)`:""}${o.bp?"<br>Bala perdida":""}${o.tr?.length?"<br>Transporte interrompido: "+Te(o.tr.join(", ")):""}${o.un?"<br>Unidade: "+Te(o.un):""}<div class="popup-meta">Fonte: Instituto Fogo Cruzado (verificado, local exato)</div></div>`),this.layerFogo.addLayer(r)}}popupBairro(n){let e=n.ocorrencias.slice().sort((d,l)=>l.ts-d.ts),i=Object.keys(n.cats).sort((d,l)=>n.cats[l]-n.cats[d]).map(d=>`<span class="popup-tag" style="color:${vt[d].cor}">${Te(vt[d].curto)} ${T(n.cats[d])}</span>`).join(" "),o=this.store.bairrosMapa().lista.reduce((d,l)=>d+l.qtd,0),a=n.qtd?`${T(n.qtd)} ocorr\xEAncias noticiadas (${o?Math.round(n.qtd/o*100):0}% da cidade) \xB7 ${T(n.graves)} graves \xB7 ${T(n.recentes)} nos \xFAltimos 30 dias<div class="popup-tags">${i}</div><ul class="lista-sem-local">`+e.slice(0,6).map(d=>`<li><a href="${Te(Va(d.link))}" target="_blank" rel="noopener">${Te(d.titulo)}</a> <small>(${Te(d.data)})</small></li>`).join("")+"</ul>":"Nenhuma ocorr\xEAncia noticiada no per\xEDodo escolhido.",r=this.camadas().oficial?this.store.oficialBairros():null,s=r?.porBairro.get(n.nome),c=r?`<div class="popup-oficial"><b>${s?T(s.total):0} registros oficiais</b> (${Te(r.dado.orgao)}, ${Te(r.dado.periodo)})`+(s?'<ul class="lista-sem-local">'+Object.entries(s.cats).sort((d,l)=>l[1]-d[1]).map(([d,l])=>`<li>${Te(Nc[d]||d)}: <b>${T(l)}</b></li>`).join("")+"</ul>":"")+"</div>":"";return`<div class="popup"><b>${Te(n.nome)}</b><br>${c}${a}<small>Not\xEDcias (complemento) \xB7 contorno: ${n.fonte==="IBGE"?"IBGE, Censo 2022 (oficial)":n.aprox?"aproximado pelo ponto do bairro no OpenStreetMap":"OpenStreetMap"}</small></div>`}corBairro(n,e){if(!n)return"transparent";let i=Math.min(hb.length-1,Math.floor(Math.sqrt(n)/Math.sqrt(e)*hb.length));return hb[i]}desenharBairros(n,e){if(this.layerBairros.clearLayers(),this.desenharPontosOficiais(n.length>0),!n.length)return;let i=this.camadas().oficial?this.store.oficialBairros():null,o=c=>i?i.porBairro.get(c.nome)?.total||0:c.qtd,a=Math.max(1,...n.map(o)),r=this.camadas().mapaEscuro||this.camadas().satelite,s=c=>i?`${T(o(c))} registros oficiais`:`${T(c.qtd)} ocorr\xEAncias`;n.forEach(c=>{let d=o(c),l=this.corBairro(d,a),m;c.aneis?m=L.polygon(c.aneis,{pane:"paneBairros",renderer:this.renderer,color:d?"#7c2d12":r?"#cbd5e1":"#475569",weight:d?1.2:.8,opacity:d?.8:.45,dashArray:d?null:"3 3",fillColor:l,fillOpacity:d?.42:0}):d&&(m=L.circle([c.lat,c.lng],{pane:"paneBairros",renderer:this.renderer,radius:150+450*Math.sqrt(d/a),color:"#7c2d12",weight:1,fillColor:l,fillOpacity:.4})),m&&(m.bindTooltip(`<b>${Te(c.nome)}</b> \xB7 ${d?s(c):"sem registro no per\xEDodo"}`,{sticky:!0}),m.bindPopup(()=>this.popupBairro(c)),m.on("mouseover",()=>m.setStyle({weight:2.5})),m.on("mouseout",()=>m.setStyle({weight:d?1.2:.8})),this.layerBairros.addLayer(m))}),n.filter(c=>o(c)).sort((c,d)=>o(d)-o(c)).slice(0,30).forEach(c=>{let d=L.divIcon({className:"rotulo-bairro",iconSize:null,iconAnchor:[-6,12],html:`<div><i style="background:${i?"#113366":vt[c.catTop]?.cor||"#334155"}"></i>${Te(c.nome)} <b>(${T(o(c))})</b></div>`}),l=L.marker([c.lat,c.lng],{icon:d,riseOnHover:!0,title:c.nome,pane:"paneRotulos"});l.bindPopup(()=>this.popupBairro(c)),this.layerBairros.addLayer(l)})}desenharPontosOficiais(n){this.layerOficial.clearLayers();let e=this.camadas().oficial&&this.camadas().pinos?this.store.oficialBairros():null;if(!n||!e)return;let i=new Date(Date.now()-this.store.periodoDias()*864e5),o=i.getFullYear()*1e4+(i.getMonth()+1)*100+i.getDate(),a=new Set(this.store.categorias().length?e.cats:e.cats.filter(r=>r!=="trafico"));for(let[r,s,c,d,l]of e.dado.pontos){if(!a.has(c)||d<o)continue;let m=`${String(d%100).padStart(2,"0")}/${String(Math.floor(d/100)%100).padStart(2,"0")}/${Math.floor(d/1e4)}`,v=L.marker([r,s],{pane:"paneRotulos",keyboard:!1,icon:L.divIcon({className:"ponto-oficial",iconSize:[9,9],html:`<div class="${c}"></div>`})});v.bindPopup(`<div class="popup"><span class="popup-cat" style="color:#7f1d1d">${Te(Nc[c]||c)}</span> \xB7 ${m}<div class="popup-titulo">${Te(l)}</div><div class="popup-meta">Fonte oficial: ${Te(e.dado.fonte)} (local informado no boletim de ocorr\xEAncia)</div></div>`),this.layerOficial.addLayer(v)}}popupFronteira(){let n=this.store.oficial(),e=this.store.nomeLocal(),i="<br><small>Estat\xEDstica oficial indispon\xEDvel para este local.</small>";return n?.disponivel&&n.anos&&(i='<ul class="lista-sem-local">'+n.eventos.slice(0,5).map(o=>`<li>${Te(o.nome)}: <b>${o.porAno[2]==null?"\u2014":T(o.porAno[2])}</b> em ${n.anos[2]}${o.taxa!=null?` \xB7 ${Ee(o.taxa)} por 100 mil`:""}</li>`).join("")+`</ul><small>Sinesp \xB7 ${Te(n.periodoTresAnos||"")}</small>`),`<div class="popup"><b>${Te(e)}</b>${i}</div>`}renderizar(n,e,i,o){if(!this.map)return;this.cluster.clearLayers();let a=!i;if(e.pinos&&a){let r=this.exatas(n,o).map(s=>{let c=L.circleMarker([s.lat,s.lng],{renderer:this.renderer,radius:fe.RAIO_PINO,fillColor:vt[s.cat].cor,color:"#fff",weight:1.5,fillOpacity:.95});return c.bindPopup(()=>this.popup(s)),c});this.cluster.addLayers?this.cluster.addLayers(r):r.forEach(s=>this.cluster.addLayer(s))}this.layerSemLocal.clearLayers(),this.desenharBairros(e.bairros&&a&&this.store.escopo()==="CIDADE"?o.lista:[],n),this.layerZonas.clearLayers(),e.zonas&&a&&n.zonas.slice().reverse().forEach(r=>{let s=Vu[r.nivel],c=`<b>Zona vermelha ${r.rank} \xB7 ${ju[r.nivel]}</b><br>${Te(r.nome)}<br>${T(r.qtd)} ocorr\xEAncias${r.graves?", "+T(r.graves)+" homic\xEDdio/tiroteio":""} \xB7 \xEDndice ${r.indice}`;this.layerZonas.addLayer(L.circle([r.lat,r.lng],{pane:"paneZonas",renderer:this.renderer,radius:r.raio,color:s,weight:2,fillColor:s,fillOpacity:r.nivel==="critica"?.22:.15}).bindPopup(c)),this.layerZonas.addLayer(L.marker([r.lat,r.lng],{pane:"paneZonas",icon:L.divIcon({className:"rotulo-zona",html:`<div style="background:${s}">${r.rank}</div>`,iconSize:[24,24]}),keyboard:!1}).bindPopup(c))}),this.pontosCalor=a?this.exatas(n,o).map(r=>[r.lat,r.lng,vt[r.cat].peso]):[],this.atualizarCalor(),this.enquadrar()}raioCalorPx(){let n=156543.03*Math.cos(this.map.getCenter().lat*Math.PI/180)/Math.pow(2,this.map.getZoom());return Math.max(fe.RAIO_CALOR_MIN_PX,Math.min(fe.RAIO_CALOR_MAX_PX,Math.round(fe.RAIO_CALOR_METROS/n)))}maximoCalor(n){let e=Math.max(4,n/2),i={},o=0;for(let a of this.pontosCalor){let r=this.map.project([a[0],a[1]]),s=Math.floor(r.x/e)+":"+Math.floor(r.y/e);i[s]=(i[s]||0)+a[2],i[s]>o&&(o=i[s])}return Math.max(2,o)}atualizarCalor(){if(!this.map||typeof L.heatLayer!="function")return;if(!this.camadas().calor||!this.pontosCalor.length||this.map.getSize().x<50){this.calor&&this.map.hasLayer(this.calor)&&this.map.removeLayer(this.calor);return}let n=this.raioCalorPx(),e={radius:n,blur:Math.round(n*.85),maxZoom:this.map.getZoom(),max:this.maximoCalor(n),minOpacity:.25,gradient:{.2:"#3b82f6",.45:"#22c55e",.65:"#eab308",.82:"#f97316",1:"#dc2626"}};this.calor||(this.calor=L.heatLayer(this.pontosCalor,e)),this.map.hasLayer(this.calor)?(this.calor.setOptions(e),this.calor.setLatLngs(this.pontosCalor)):(L.setOptions(this.calor,e),this.calor._latlngs=this.pontosCalor,this.calor.addTo(this.map))}async obterMalha(n,e=!1){let i="MALHA_"+n+(e?"_MUN":""),o=await gt.obter(i);if(o)return o;let a="https://servicodados.ibge.gov.br/api/v3/malhas/",r=String(n).length===2?a+"estados/"+n+"?formato=application/vnd.geo+json&qualidade=minima"+(e?"&intrarregiao=municipio":""):a+"municipios/"+n+"?formato=application/vnd.geo+json&qualidade=intermediaria",s=await $n(r,e?15e3:void 0).then(c=>c.ok?c.json():null).catch(()=>null);return!s?.features?.length&&!e&&(s=await ui.fronteira(n)),s?.features?.length&&gt.salvar(i,s),s}async desenharFronteira(n,e,i){let o=++this.tokenFronteira;if(this.layerFronteira?.clearLayers(),this.contorno.set(null),!e||!n||!this.map)return;let a=await this.obterMalha(n);if(o!==this.tokenFronteira||!a?.features)return;this.contorno.set(i?null:a);let r=i?fe.COR_FRONTEIRA_ESTADO:fe.COR_FRONTEIRA_CIDADE,s=L.geoJSON(a,{pane:"paneFronteira",interactive:!1,style:{stroke:!1,fillColor:r,fillOpacity:i?.03:.08}}),c=L.geoJSON(a,{pane:"paneZonas",style:{color:r,weight:3,fill:!1,dashArray:i?null:"6 4"}});c.bindTooltip(()=>this.store.nomeLocal()+" \xB7 clique para o resumo oficial",{sticky:!0}),c.bindPopup(()=>this.popupFronteira()),this.layerFronteira.clearLayers(),this.layerFronteira.addLayer(s),this.layerFronteira.addLayer(c);let d=s.getBounds();!this.usuarioMoveu&&d.isValid()&&(i||this.store.filtrados().precisas.length<3)&&this.mover(()=>this.map.flyToBounds(d,{padding:[24,24],duration:.6}))}limites(n){let e=n.filter(a=>a>0).sort((a,r)=>a-r);if(e.length<2)return e.length?[e[0]]:[];let i=Math.min(Jr.length,Math.max(2,Math.floor(e.length/3))),o=[];for(let a=1;a<i;a++){let r=e[Math.min(e.length-1,Math.floor(a/i*e.length))];(!o.length||r>o[o.length-1])&&o.push(r)}return o}async desenharCoropletico(n,e,i,o,a){let r=++this.tokenCoropletico;if(this.layerCoropletico?.clearLayers(),!this.map)return;let s=n||a;if(!n&&this.ufEnquadradaCoropletico&&(this.store.escopo()==="CIDADE"&&(this.usuarioMoveu=!1,this.ultimoEnquadramento="",this.voarParaLocal(),this.enquadrar()),this.ufEnquadradaCoropletico=""),!s)return;if(!o||o.uf!==e){let _=await this.obterMalha(zt[e].ibge,!0);r===this.tokenCoropletico&&_?.features&&this.malhaEstado.set({uf:e,geo:_});return}let c=this.store.panorama(),d=(a?null:c.rankings[i])||c.rankings[0],l=this.store.ibgeCidade(),m=this.limites(Object.values(d.valoresTaxa)),v=_=>{if(!_)return null;let C=0;for(;C<m.length&&_>m[C];)C++;return Jr[C]},g={};[...d.porTotal,...d.porTaxa,...d.altas,...d.quedas].forEach(_=>{_.ibge&&(g[_.ibge]=_)});let y=L.geoJSON(o.geo,{pane:"paneCoropletico",style:_=>{let C=v(d.valoresTaxa[_.properties.codarea]);if(a){let w=String(_.properties.codarea)===l;return{color:"#64748b",weight:.7,opacity:.6,fillColor:C||"transparent",fillOpacity:C&&!w?.22:0}}return{color:this.store.escuro()?"#334155":"#ffffff",weight:.6,fillColor:C||"transparent",fillOpacity:C?.78:0}},onEachFeature:(_,C)=>{let w=String(_.properties.codarea),E=Kr(w),U=d.valoresTaxa[w],F=g[w];if(C.bindTooltip(`<b>${Te(E?.nome||w)}</b><br>${U?Ee(U)+" por 100 mil":"sem registro ou popula\xE7\xE3o"}`,{sticky:!0,direction:"top"}),C.bindPopup(`<div class="popup"><b>${Te(E?.nome||w)}</b><br>${Te(d.evento)}: ${U?Ee(U)+" por 100 mil habitantes":"sem taxa calculada"}`+(F?`<br>${T(F.total)} registros nos \xFAltimos 12 meses (antes: ${T(F.anterior)})`:"")+(E?`<br><button class="popup-botao" data-abrir="${Te(e+"|"+E.nome)}">Abrir munic\xEDpio</button>`:"")+"</div>"),a&&w===l){C.options.interactive=!1;return}C.on("mouseover",()=>C.setStyle({weight:2,color:"#0f172a"})),C.on("mouseout",()=>y.resetStyle(C))}});this.layerCoropletico.addLayer(y),n&&this.ufEnquadradaCoropletico!==e&&y.getBounds().isValid()&&(this.ufEnquadradaCoropletico=e,this.mover(()=>this.map.flyToBounds(y.getBounds(),{padding:[16,16],duration:.6})))}static \u0275fac=function(e){return new(e||t)};static \u0275cmp=H({type:t,selectors:[["app-mapa"]],viewQuery:function(e,i){e&1&&xi(i.alvo,IO,5),e&2&&Ci()},decls:12,vars:2,consts:[["alvo",""],["menuCamadas","matMenu"],["role","application","aria-label","Mapa de ocorr\xEAncias",1,"mapa"],[1,"controles"],["mat-mini-fab","","matTooltip","Camadas do mapa","aria-label","Camadas do mapa",1,"botao-mapa",3,"matMenuTriggerFor"],[1,"menu-camadas"],["mat-menu-item","","role","menuitemcheckbox"],[1,"legenda"],["mat-menu-item","","role","menuitemcheckbox",3,"click"],["tabindex","-1",3,"click","checked"],[1,"legenda-titulo"],[1,"legenda-sub"],[1,"escala"],[1,"sem-dado"],[1,"legenda-oficial"],[1,"legenda-fogo"],[1,"legenda-fogo-bloco"],[1,"sem-bairro"],[1,"cats"],["type","button",1,"cat",3,"ativa","title"],[1,"gradiente"],[1,"legenda-zona"],[1,"area"],[2,"background","#7f1d1d"],[2,"background","#ef4444"],[2,"background","#f59e0b"],[2,"background","transparent","border","2px solid #a855f7"],["target","_blank","rel","noopener",3,"href"],["type","button",1,"cat",3,"click","title"]],template:function(e,i){if(e&1&&(A(0,"div",2,0),f(2,"div",3)(3,"button",4)(4,"mat-icon"),b(5,"layers"),u()()(),f(6,"mat-menu",5,1),xe(8,kO,6,4,"div",6,gb),u(),k(10,TO,11,1,"div",7)(11,zO,14,10,"div",7)),e&2){let o,a=nn(7);h(3),R("matMenuTriggerFor",a),h(5),Ce(i.listaCamadas),h(2),N((o=i.legendaCoropletico())?10:(o=i.legenda())?11:-1,o)}},dependencies:[Po,mS,It,jt,Rw,Qr,Oc,Ow,Aw,ub,Di,oo],styles:["[_nghost-%COMP%]{position:relative;display:block;height:100%;min-height:0}.mapa[_ngcontent-%COMP%]{position:absolute;inset:0;background:var(--%NS%mat-sys-surface-container)}.controles[_ngcontent-%COMP%]{position:absolute;top:12px;right:12px;z-index:900;display:flex;flex-direction:column;gap:8px}.botao-mapa[_ngcontent-%COMP%]{background:var(--%NS%mat-sys-surface-container-lowest);color:var(--%NS%mat-sys-on-surface)}.legenda[_ngcontent-%COMP%]{position:absolute;left:12px;bottom:12px;z-index:800;max-width:min(300px,100% - 80px);background:color-mix(in srgb,var(--%NS%mat-sys-surface-container-lowest) 94%,transparent);-webkit-backdrop-filter:blur(6px);backdrop-filter:blur(6px);border:1px solid var(--%NS%borda-suave);border-radius:var(--%NS%raio-m);padding:10px 12px;font:var(--%NS%mat-sys-body-small);box-shadow:var(--%NS%mat-sys-level1)}.legenda-titulo[_ngcontent-%COMP%]{font:var(--%NS%mat-sys-label-large);color:var(--%NS%mat-sys-on-surface)}.legenda-sub[_ngcontent-%COMP%]{color:var(--%NS%mat-sys-on-surface-variant);margin-bottom:6px}.legenda-fogo[_ngcontent-%COMP%]{display:flex;align-items:center;gap:6px;margin-bottom:6px}.legenda-fogo[_ngcontent-%COMP%]   i[_ngcontent-%COMP%]{width:10px;height:10px;border-radius:50%;background:#dc2626;border:2px solid #111827}.legenda-fogo[_ngcontent-%COMP%]   i.area[_ngcontent-%COMP%]{border-radius:2px;background:linear-gradient(90deg,#fde0c5,#8a1538);border:1px solid #7f1d1d;flex:none}.legenda-fogo-bloco[_ngcontent-%COMP%]{display:flex;flex-wrap:wrap;gap:2px 10px;margin-bottom:6px}.legenda-fogo-bloco[_ngcontent-%COMP%]   b[_ngcontent-%COMP%]{flex-basis:100%;font-weight:500}.legenda-fogo-bloco[_ngcontent-%COMP%]   span[_ngcontent-%COMP%]{display:inline-flex;align-items:center;gap:5px}.legenda-fogo-bloco[_ngcontent-%COMP%]   i[_ngcontent-%COMP%]{width:10px;height:10px;border-radius:50%;border:1px solid #111827}.sem-bairro[_ngcontent-%COMP%]{margin:-2px 0 6px;color:var(--%NS%mat-sys-on-surface-variant)}.sem-bairro[_ngcontent-%COMP%]   summary[_ngcontent-%COMP%]{cursor:pointer}.sem-bairro[_ngcontent-%COMP%]   ul[_ngcontent-%COMP%]{max-height:160px;overflow:auto;margin:4px 0 0;padding-left:16px}.sem-bairro[_ngcontent-%COMP%]   li[_ngcontent-%COMP%]{margin:2px 0}.sem-bairro[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]{color:var(--%NS%mat-sys-primary)}.cats[_ngcontent-%COMP%], .escala[_ngcontent-%COMP%]{display:flex;flex-wrap:wrap;gap:4px 10px}.escala[_ngcontent-%COMP%]   span[_ngcontent-%COMP%]{display:inline-flex;align-items:center;gap:5px;white-space:nowrap}.cat[_ngcontent-%COMP%]{display:inline-flex;align-items:center;gap:5px;white-space:nowrap;font:inherit;color:inherit;background:none;cursor:pointer;border:1px solid transparent;border-radius:999px;padding:1px 6px;margin-left:-6px}.cat[_ngcontent-%COMP%]:hover{border-color:var(--%NS%mat-sys-outline-variant)}.cat.ativa[_ngcontent-%COMP%]{border-color:var(--%NS%mat-sys-primary);background:var(--%NS%mat-sys-primary-container)}.cats[_ngcontent-%COMP%]   i[_ngcontent-%COMP%]{width:9px;height:9px;border-radius:50%}.escala[_ngcontent-%COMP%]   i[_ngcontent-%COMP%]{width:14px;height:10px;border-radius:2px}.escala[_ngcontent-%COMP%]   i.sem-dado[_ngcontent-%COMP%]{background:transparent;border:1px dashed var(--%NS%mat-sys-outline)}.gradiente[_ngcontent-%COMP%]{display:flex;align-items:center;gap:6px;margin-top:6px;color:var(--%NS%mat-sys-on-surface-variant)}.gradiente[_ngcontent-%COMP%]   div[_ngcontent-%COMP%]{flex:1;height:6px;border-radius:3px;background:linear-gradient(90deg,#3b82f6,#22c55e,#eab308,#f97316,#dc2626)}.legenda-zona[_ngcontent-%COMP%]{display:flex;align-items:center;gap:6px;margin-top:6px}.legenda-zona[_ngcontent-%COMP%]   i[_ngcontent-%COMP%]{width:12px;height:12px;border-radius:50%;border:2px solid #dc2626;background:#dc262633}@media(max-width:600px){.legenda[_ngcontent-%COMP%]{font-size:11px;padding:6px 10px;max-width:220px}.cats[_ngcontent-%COMP%], .legenda-zona[_ngcontent-%COMP%]{display:none}}"]})};function $O(t,n){if(t&1&&(f(0,"span",0),b(1),u()),t&2){let e=x();h(),S(e.semTexto())}}function UO(t,n){t&1&&(f(0,"span",1)(1,"mat-icon"),b(2,"arrow_upward"),u(),b(3,"novo"),u())}function GO(t,n){t&1&&(f(0,"span",0),b(1,"= est\xE1vel"),u())}function WO(t,n){if(t&1&&(f(0,"span",1)(1,"mat-icon"),b(2,"arrow_upward"),u(),b(3),u()),t&2){let e=x();h(3),re("",e.estado().v,"%")}}function qO(t,n){if(t&1&&(f(0,"span",2)(1,"mat-icon"),b(2,"arrow_downward"),u(),b(3),u()),t&2){let e=x();h(3),re("",e.estado().v,"%")}}var YO=["tela"],Un=class t{atual=hn(null);anterior=hn(null);semTexto=hn("sem compara\xE7\xE3o");estado=P(()=>{let n=this.atual(),e=this.anterior();if(n==null||e==null)return{tipo:"sem",v:0};if(!n&&!e)return{tipo:"igual",v:0};if(!e)return{tipo:"novo",v:0};let i=Math.round((n-e)/e*100);return i===0?{tipo:"igual",v:i}:{tipo:i>0?"sobe":"desce",v:Math.abs(i)}});static \u0275fac=function(e){return new(e||t)};static \u0275cmp=H({type:t,selectors:[["app-delta"]],inputs:{atual:[1,"atual"],anterior:[1,"anterior"],semTexto:[1,"semTexto"]},decls:5,vars:1,consts:[[1,"delta","igual"],[1,"delta","sobe"],[1,"delta","desce"]],template:function(e,i){if(e&1&&k(0,$O,2,1,"span",0)(1,UO,4,0,"span",1)(2,GO,2,0,"span",0)(3,WO,4,1,"span",1)(4,qO,4,1,"span",2),e&2){let o;N((o=i.estado().tipo)==="sem"?0:o==="novo"?1:o==="igual"?2:o==="sobe"?3:o==="desce"?4:-1)}},dependencies:[It,jt],styles:[".delta[_ngcontent-%COMP%]{display:inline-flex;align-items:center;gap:1px;font:var(--%NS%mat-sys-label-medium);font-weight:600;padding:1px 7px 1px 4px;border-radius:999px;white-space:nowrap;line-height:18px}.delta[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%]{font-size:14px;width:14px;height:14px}.sobe[_ngcontent-%COMP%]{color:var(--%NS%cor-perigo);background:color-mix(in srgb,var(--%NS%cor-perigo) 12%,transparent)}.desce[_ngcontent-%COMP%]{color:var(--%NS%cor-sucesso);background:color-mix(in srgb,var(--%NS%cor-sucesso) 12%,transparent)}.igual[_ngcontent-%COMP%]{color:var(--%NS%mat-sys-on-surface-variant);background:var(--%NS%mat-sys-surface-container-high);padding-left:7px}"]})},ts=class t{valores=hn([]);largura=hn(120);altura=hn(28);pontos=P(()=>{let n=this.valores();if(!n.length)return"";let e=Math.max(...n,1),i=this.altura(),o=this.largura()/(n.length-1||1);return n.map((a,r)=>(r*o).toFixed(1)+","+(i-2-a/e*(i-4)).toFixed(1)).join(" ")});area=P(()=>{let n=this.pontos();return n?`0,${this.altura()} ${n} ${this.largura()},${this.altura()}`:""});static \u0275fac=function(e){return new(e||t)};static \u0275cmp=H({type:t,selectors:[["app-sparkline"]],inputs:{valores:[1,"valores"],largura:[1,"largura"],altura:[1,"altura"]},decls:3,vars:5,consts:[["aria-hidden","true"],["fill","currentColor","fill-opacity",".1","stroke","none"],["fill","none","stroke","currentColor","stroke-width","1.6","stroke-linejoin","round"]],template:function(e,i){e&1&&(_n(),Je(0,"svg",0),Dt(1,"polyline",1)(2,"polyline",2),it()),e&2&&(Q("viewBox","0 0 "+i.largura()+" "+i.altura())("width",i.largura())("height",i.altura()),h(),Q("points",i.area()),h(),Q("points",i.pontos()))},styles:["[_nghost-%COMP%]{display:inline-flex;color:var(--%NS%mat-sys-primary)}svg[_ngcontent-%COMP%]{display:block;max-width:100%}"]})},Vo=class t{store=p(kt);config=hn.required();rotulo=hn("Gr\xE1fico");tela=Bn.required("tela");grafico=null;tipo="";escuro=null;constructor(){lt(()=>{let n=this.config(),e=this.store.escuro();if(typeof Chart>"u")return;let i=e?"#c4c7cf":"#44474e",o=e?"rgba(148,163,184,.16)":"rgba(100,116,139,.16)";if(this.grafico&&this.tipo===n.type&&this.escuro===e){this.grafico.data=n.data,this.grafico.update("none");return}this.grafico?.destroy(),Chart.defaults.font.family="Roboto, system-ui, sans-serif",Chart.defaults.color=i;let a=(c={})=>I({ticks:{color:i,font:{size:11}},grid:{color:o},border:{display:!1}},c),r=n.options||{},s={};for(let c of Object.keys(r.scales||{}))s[c]=a(r.scales[c]);this.grafico=new Chart(this.tela().nativeElement,{type:n.type,data:n.data,options:W(I({responsive:!0,maintainAspectRatio:!1,animation:!1,interaction:{mode:"index",intersect:!1}},r),{plugins:I({legend:{labels:{color:i,boxWidth:10,boxHeight:10,font:{size:11}}}},r.plugins||{}),scales:s})}),this.tipo=n.type,this.escuro=e})}ngOnDestroy(){this.grafico?.destroy()}static \u0275fac=function(e){return new(e||t)};static \u0275cmp=H({type:t,selectors:[["app-grafico"]],viewQuery:function(e,i){e&1&&xi(i.tela,YO,5),e&2&&Ci()},inputs:{config:[1,"config"],rotulo:[1,"rotulo"]},decls:2,vars:1,consts:[["tela",""],["role","img"]],template:function(e,i){e&1&&Dt(0,"canvas",1,0),e&2&&Q("aria-label",i.rotulo())},styles:["[_nghost-%COMP%]{display:block;position:relative;height:200px}canvas[_ngcontent-%COMP%]{position:absolute;inset:0}"]})};var ZO=new D("MAT_PROGRESS_BAR_DEFAULT_OPTIONS");var ns=(()=>{class t{_elementRef=p(q);_ngZone=p(X);_changeDetectorRef=p(He);_renderer=p(Ue);_cleanupTransitionEnd;constructor(){let e=Zh(),i=p(ZO,{optional:!0});this._isNoopAnimation=e==="di-disabled",e==="reduced-motion"&&this._elementRef.nativeElement.classList.add("mat-progress-bar-reduced-motion"),i&&(i.color&&(this.color=this._defaultColor=i.color),this.mode=i.mode||this.mode)}_isNoopAnimation;get color(){return this._color||this._defaultColor}set color(e){this._color=e}_color;_defaultColor="primary";get value(){return this._value}set value(e){this._value=Pw(e||0),this._changeDetectorRef.markForCheck()}_value=0;get bufferValue(){return this._bufferValue||0}set bufferValue(e){this._bufferValue=Pw(e||0),this._changeDetectorRef.markForCheck()}_bufferValue=0;animationEnd=new K;get mode(){return this._mode}set mode(e){this._mode=e,this._changeDetectorRef.markForCheck()}_mode="determinate";ngAfterViewInit(){this._ngZone.runOutsideAngular(()=>{this._cleanupTransitionEnd=this._renderer.listen(this._elementRef.nativeElement,"transitionend",this._transitionendHandler)})}ngOnDestroy(){this._cleanupTransitionEnd?.()}_getPrimaryBarTransform(){return`scaleX(${this._isIndeterminate()?1:this.value/100})`}_getBufferBarFlexBasis(){return`${this.mode==="buffer"?this.bufferValue:100}%`}_isIndeterminate(){return this.mode==="indeterminate"||this.mode==="query"}_transitionendHandler=e=>{this.animationEnd.observers.length===0||!e.target||!e.target.classList.contains("mdc-linear-progress__primary-bar")||(this.mode==="determinate"||this.mode==="buffer")&&this._ngZone.run(()=>this.animationEnd.next({value:this.value}))};static \u0275fac=function(i){return new(i||t)};static \u0275cmp=(function(){function e(i,o){i&1&&Dt(0,"div",2)}return H({type:t,selectors:[["mat-progress-bar"]],hostAttrs:["role","progressbar","aria-valuemin","0","aria-valuemax","100","tabindex","-1",1,"mat-mdc-progress-bar","mdc-linear-progress"],hostVars:10,hostBindings:function(o,a){o&2&&(Q("aria-valuenow",a._isIndeterminate()?null:a.value)("mode",a.mode),Ke("mat-"+a.color),z("_mat-animation-noopable",a._isNoopAnimation)("mdc-linear-progress--animation-ready",!a._isNoopAnimation)("mdc-linear-progress--indeterminate",a._isIndeterminate()))},inputs:{color:"color",value:[2,"value","value",on],bufferValue:[2,"bufferValue","bufferValue",on],mode:"mode"},outputs:{animationEnd:"animationEnd"},exportAs:["matProgressBar"],decls:7,vars:5,consts:[["aria-hidden","true",1,"mdc-linear-progress__buffer"],[1,"mdc-linear-progress__buffer-bar"],[1,"mdc-linear-progress__buffer-dots"],["aria-hidden","true",1,"mdc-linear-progress__bar","mdc-linear-progress__primary-bar"],[1,"mdc-linear-progress__bar-inner"],["aria-hidden","true",1,"mdc-linear-progress__bar","mdc-linear-progress__secondary-bar"]],template:function(o,a){o&1&&(Je(0,"div",0),Dt(1,"div",1),k(2,e,1,0,"div",2),it(),Je(3,"div",3),Dt(4,"span",4),it(),Je(5,"div",5),Dt(6,"span",4),it()),o&2&&(h(),we("flex-basis",a._getBufferBarFlexBasis()),h(),N(a.mode==="buffer"?2:-1),h(),we("transform",a._getPrimaryBarTransform()))},styles:[`.mat-mdc-progress-bar {
  --%NS%mat-progress-bar-animation-multiplier: 1;
  display: block;
  text-align: start;
}
.mat-mdc-progress-bar[mode=query] {
  transform: scaleX(-1);
}
.mat-mdc-progress-bar._mat-animation-noopable .mdc-linear-progress__buffer-dots,
.mat-mdc-progress-bar._mat-animation-noopable .mdc-linear-progress__primary-bar,
.mat-mdc-progress-bar._mat-animation-noopable .mdc-linear-progress__secondary-bar,
.mat-mdc-progress-bar._mat-animation-noopable .mdc-linear-progress__bar-inner.mdc-linear-progress__bar-inner {
  animation: none;
}
.mat-mdc-progress-bar._mat-animation-noopable .mdc-linear-progress__primary-bar,
.mat-mdc-progress-bar._mat-animation-noopable .mdc-linear-progress__buffer-bar {
  transition: transform 1ms;
}

.mat-progress-bar-reduced-motion {
  --%NS%mat-progress-bar-animation-multiplier: 2;
}

.mdc-linear-progress {
  position: relative;
  width: 100%;
  transform: translateZ(0);
  outline: 1px solid transparent;
  overflow-x: hidden;
  transition: opacity 250ms 0ms cubic-bezier(0.4, 0, 0.6, 1);
  height: max(var(--%NS%mat-progress-bar-track-height, 4px), var(--%NS%mat-progress-bar-active-indicator-height, 4px));
}
@media (forced-colors: active) {
  .mdc-linear-progress {
    outline-color: CanvasText;
  }
}

.mdc-linear-progress__bar {
  position: absolute;
  top: 0;
  bottom: 0;
  margin: auto 0;
  width: 100%;
  animation: none;
  transform-origin: top left;
  transition: transform 250ms 0ms cubic-bezier(0.4, 0, 0.6, 1);
  height: var(--%NS%mat-progress-bar-active-indicator-height, 4px);
}
.mdc-linear-progress--indeterminate .mdc-linear-progress__bar {
  transition: none;
}
[dir=rtl] .mdc-linear-progress__bar {
  right: 0;
  transform-origin: center right;
}

.mdc-linear-progress__bar-inner {
  display: inline-block;
  position: absolute;
  width: 100%;
  animation: none;
  border-top-style: solid;
  border-color: var(--%NS%mat-progress-bar-active-indicator-color, var(--%NS%mat-sys-primary));
  border-top-width: var(--%NS%mat-progress-bar-active-indicator-height, 4px);
}

.mdc-linear-progress__buffer {
  display: flex;
  position: absolute;
  top: 0;
  bottom: 0;
  margin: auto 0;
  width: 100%;
  overflow: hidden;
  height: var(--%NS%mat-progress-bar-track-height, 4px);
  border-radius: var(--%NS%mat-progress-bar-track-shape, var(--%NS%mat-sys-corner-none));
}

.mdc-linear-progress__buffer-dots {
  background-image: radial-gradient(circle, var(--%NS%mat-progress-bar-track-color, var(--%NS%mat-sys-surface-variant)) calc(var(--%NS%mat-progress-bar-track-height, 4px) / 2), transparent 0);
  background-repeat: repeat-x;
  background-size: calc(calc(var(--%NS%mat-progress-bar-track-height, 4px) / 2) * 5);
  background-position: left;
  flex: auto;
  transform: rotate(180deg);
  animation: mdc-linear-progress-buffering calc(250ms * var(--%NS%mat-progress-bar-animation-multiplier)) infinite linear;
}
@media (forced-colors: active) {
  .mdc-linear-progress__buffer-dots {
    background-color: ButtonBorder;
  }
}
[dir=rtl] .mdc-linear-progress__buffer-dots {
  animation: mdc-linear-progress-buffering-reverse calc(250ms * var(--%NS%mat-progress-bar-animation-multiplier)) infinite linear;
  transform: rotate(0);
}

.mdc-linear-progress__buffer-bar {
  flex: 0 1 100%;
  transition: flex-basis 250ms 0ms cubic-bezier(0.4, 0, 0.6, 1);
  background-color: var(--%NS%mat-progress-bar-track-color, var(--%NS%mat-sys-surface-variant));
}

.mdc-linear-progress__primary-bar {
  transform: scaleX(0);
}
.mdc-linear-progress--indeterminate .mdc-linear-progress__primary-bar {
  left: -145.166611%;
}
.mdc-linear-progress--indeterminate.mdc-linear-progress--animation-ready .mdc-linear-progress__primary-bar {
  animation: mdc-linear-progress-primary-indeterminate-translate calc(2s * var(--%NS%mat-progress-bar-animation-multiplier)) infinite linear;
}
.mdc-linear-progress--indeterminate.mdc-linear-progress--animation-ready .mdc-linear-progress__primary-bar > .mdc-linear-progress__bar-inner {
  animation: mdc-linear-progress-primary-indeterminate-scale calc(2s * var(--%NS%mat-progress-bar-animation-multiplier)) infinite linear;
}
[dir=rtl] .mdc-linear-progress.mdc-linear-progress--animation-ready .mdc-linear-progress__primary-bar {
  animation-name: mdc-linear-progress-primary-indeterminate-translate-reverse;
}
[dir=rtl] .mdc-linear-progress.mdc-linear-progress--indeterminate .mdc-linear-progress__primary-bar {
  right: -145.166611%;
  left: auto;
}

.mdc-linear-progress__secondary-bar {
  display: none;
}
.mdc-linear-progress--indeterminate .mdc-linear-progress__secondary-bar {
  left: -54.888891%;
  display: block;
}
.mdc-linear-progress--indeterminate.mdc-linear-progress--animation-ready .mdc-linear-progress__secondary-bar {
  animation: mdc-linear-progress-secondary-indeterminate-translate calc(2s * var(--%NS%mat-progress-bar-animation-multiplier)) infinite linear;
}
.mdc-linear-progress--indeterminate.mdc-linear-progress--animation-ready .mdc-linear-progress__secondary-bar > .mdc-linear-progress__bar-inner {
  animation: mdc-linear-progress-secondary-indeterminate-scale calc(2s * var(--%NS%mat-progress-bar-animation-multiplier)) infinite linear;
}
[dir=rtl] .mdc-linear-progress.mdc-linear-progress--animation-ready .mdc-linear-progress__secondary-bar {
  animation-name: mdc-linear-progress-secondary-indeterminate-translate-reverse;
}
[dir=rtl] .mdc-linear-progress.mdc-linear-progress--indeterminate .mdc-linear-progress__secondary-bar {
  right: -54.888891%;
  left: auto;
}

@keyframes mdc-linear-progress-buffering {
  from {
    transform: rotate(180deg) translateX(calc(var(--%NS%mat-progress-bar-track-height, 4px) * -2.5));
  }
}
@keyframes mdc-linear-progress-primary-indeterminate-translate {
  0% {
    transform: translateX(0);
  }
  20% {
    animation-timing-function: cubic-bezier(0.5, 0, 0.701732, 0.495819);
    transform: translateX(0);
  }
  59.15% {
    animation-timing-function: cubic-bezier(0.302435, 0.381352, 0.55, 0.956352);
    transform: translateX(83.67142%);
  }
  100% {
    transform: translateX(200.611057%);
  }
}
@keyframes mdc-linear-progress-primary-indeterminate-scale {
  0% {
    transform: scaleX(0.08);
  }
  36.65% {
    animation-timing-function: cubic-bezier(0.334731, 0.12482, 0.785844, 1);
    transform: scaleX(0.08);
  }
  69.15% {
    animation-timing-function: cubic-bezier(0.06, 0.11, 0.6, 1);
    transform: scaleX(0.661479);
  }
  100% {
    transform: scaleX(0.08);
  }
}
@keyframes mdc-linear-progress-secondary-indeterminate-translate {
  0% {
    animation-timing-function: cubic-bezier(0.15, 0, 0.515058, 0.409685);
    transform: translateX(0);
  }
  25% {
    animation-timing-function: cubic-bezier(0.31033, 0.284058, 0.8, 0.733712);
    transform: translateX(37.651913%);
  }
  48.35% {
    animation-timing-function: cubic-bezier(0.4, 0.627035, 0.6, 0.902026);
    transform: translateX(84.386165%);
  }
  100% {
    transform: translateX(160.277782%);
  }
}
@keyframes mdc-linear-progress-secondary-indeterminate-scale {
  0% {
    animation-timing-function: cubic-bezier(0.205028, 0.057051, 0.57661, 0.453971);
    transform: scaleX(0.08);
  }
  19.15% {
    animation-timing-function: cubic-bezier(0.152313, 0.196432, 0.648374, 1.004315);
    transform: scaleX(0.457104);
  }
  44.15% {
    animation-timing-function: cubic-bezier(0.257759, -0.003163, 0.211762, 1.38179);
    transform: scaleX(0.72796);
  }
  100% {
    transform: scaleX(0.08);
  }
}
@keyframes mdc-linear-progress-primary-indeterminate-translate-reverse {
  0% {
    transform: translateX(0);
  }
  20% {
    animation-timing-function: cubic-bezier(0.5, 0, 0.701732, 0.495819);
    transform: translateX(0);
  }
  59.15% {
    animation-timing-function: cubic-bezier(0.302435, 0.381352, 0.55, 0.956352);
    transform: translateX(-83.67142%);
  }
  100% {
    transform: translateX(-200.611057%);
  }
}
@keyframes mdc-linear-progress-secondary-indeterminate-translate-reverse {
  0% {
    animation-timing-function: cubic-bezier(0.15, 0, 0.515058, 0.409685);
    transform: translateX(0);
  }
  25% {
    animation-timing-function: cubic-bezier(0.31033, 0.284058, 0.8, 0.733712);
    transform: translateX(-37.651913%);
  }
  48.35% {
    animation-timing-function: cubic-bezier(0.4, 0.627035, 0.6, 0.902026);
    transform: translateX(-84.386165%);
  }
  100% {
    transform: translateX(-160.277782%);
  }
}
@keyframes mdc-linear-progress-buffering-reverse {
  from {
    transform: translateX(-10px);
  }
}
`],encapsulation:2})})()}return t})();function Pw(t,n=0,e=100){return Math.max(n,Math.min(e,t))}var jo=(()=>{class t{static \u0275fac=function(i){return new(i||t)};static \u0275mod=le({type:t});static \u0275inj=se({imports:[Ne]})}return t})();var KO=(t,n)=>n.titulo;function XO(t,n){if(t&1&&(f(0,"article",3)(1,"mat-icon"),b(2),u(),f(3,"div")(4,"h4"),b(5),u(),f(6,"p"),b(7),u(),f(8,"span",4),b(9),u()()()),t&2){let e=n.$implicit;Ke("insight "+e.tom),h(2),S(e.icone),h(3),S(e.titulo),h(2),S(e.texto),h(2),S(e.fonte)}}function QO(t,n){if(t&1&&(f(0,"div",0),xe(1,XO,10,6,"article",2,KO),u()),t&2){let e=x();h(),Ce(e.itens())}}function JO(t,n){if(t&1&&(f(0,"p",1),b(1),u()),t&2){let e=x();h(),S(e.vazio())}}var is=class t{itens=hn([]);vazio=hn("Ainda n\xE3o h\xE1 dados suficientes para gerar insights.");static \u0275fac=function(e){return new(e||t)};static \u0275cmp=H({type:t,selectors:[["app-insights"]],inputs:{itens:[1,"itens"],vazio:[1,"vazio"]},decls:2,vars:1,consts:[[1,"grade"],[1,"nota"],[1,"insight",3,"class"],[1,"insight"],[1,"fonte"]],template:function(e,i){e&1&&k(0,QO,3,0,"div",0)(1,JO,2,1,"p",1),e&2&&N(i.itens().length?0:1)},dependencies:[It,jt],styles:[".grade[_ngcontent-%COMP%]{display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:10px}.insight[_ngcontent-%COMP%]{display:flex;gap:10px;padding:12px;border-radius:var(--%NS%raio-m);background:var(--%NS%mat-sys-surface-container-low);border:1px solid var(--%NS%borda-suave);border-left:4px solid var(--%NS%tom);--%NS%tom: var(--%NS%mat-sys-outline)}.insight.alerta[_ngcontent-%COMP%]{--%NS%tom: var(--%NS%cor-perigo)}.insight.positivo[_ngcontent-%COMP%]{--%NS%tom: var(--%NS%cor-sucesso)}.insight.neutro[_ngcontent-%COMP%]{--%NS%tom: var(--%NS%mat-sys-primary)}mat-icon[_ngcontent-%COMP%]{color:var(--%NS%tom);flex:none}h4[_ngcontent-%COMP%]{margin:0 0 2px;font:var(--%NS%mat-sys-title-small)}p[_ngcontent-%COMP%]{margin:0;font:var(--%NS%mat-sys-body-small);color:var(--%NS%mat-sys-on-surface-variant)}.fonte[_ngcontent-%COMP%]{display:inline-block;margin-top:6px;font:var(--%NS%mat-sys-label-small);color:var(--%NS%mat-sys-on-surface-variant);background:var(--%NS%mat-sys-surface-container-high);border-radius:4px;padding:1px 6px}"]})};var eR=(t,n)=>n.nome,tR=(t,n)=>n.evento,nR=(t,n)=>n.n;function iR(t,n){if(t&1&&(A(0,"mat-progress-bar",1),f(1,"p",2),b(2),u()),t&2){let e=x();h(2),re("Montando o panorama de ",e.nomeEstado()," a partir do Sinesp\u2026 na primeira vez pode levar alguns segundos.")}}function oR(t,n){if(t&1&&(f(0,"div",0)(1,"mat-icon"),b(2,"insights"),u(),f(3,"p"),b(4),u()()),t&2){x();let e=at(0);h(4),S(e.motivo||"Panorama indispon\xEDvel para este estado.")}}function aR(t,n){t&1&&A(0,"mat-progress-bar",3)}function rR(t,n){if(t&1&&(f(0,"span",18),b(1),u()),t&2){let e=x().$implicit,i=x(2);h(),re("",i.fmt1(e.taxa)," por 100 mil hab.")}}function sR(t,n){if(t&1&&(f(0,"div",6)(1,"span",17),b(2),u(),f(3,"b"),b(4),u(),f(5,"span",18),A(6,"app-delta",19),b(7," vs 12 meses anteriores"),u(),k(8,rR,2,1,"span",18),A(9,"app-sparkline",20),u()),t&2){let e=n.$implicit,i=x(2);h(2),S(e.nome),h(2),S(i.fmt(e.total)),h(2),R("atual",e.total)("anterior",e.anterior),h(2),N(e.taxa!==null?8:-1),h(),R("valores",e.serie)("largura",140)("altura",26)}}function cR(t,n){if(t&1&&(f(0,"mat-chip-option",11),b(1),u()),t&2){let e=n.$implicit,i=n.$index;R("value",i),h(),S(e.evento)}}function lR(t,n){if(t&1){let e=We();f(0,"tr",25),V("click",function(){let o=De(e).$implicit,a=x(4);return Me(a.abrir(o))})("keydown.enter",function(){let o=De(e).$implicit,a=x(4);return Me(a.abrir(o))}),f(1,"td",26),b(2),u(),f(3,"td")(4,"span",27),b(5),u(),f(6,"span",28),A(7,"span"),u()(),f(8,"td",23)(9,"b"),b(10),u()(),f(11,"td",23),b(12),u(),f(13,"td",23),A(14,"app-delta",29),u(),f(15,"td",23),b(16),u()()}if(t&2){let e=n.$implicit,i=n.$index,o=x(4);z("atual",o.ehAtual(e)),h(2),S(i+1),h(3),S(e.n),h(2),we("width",o.barra(e),"%"),h(3),S(o.fmt(e.total)),h(2),S(o.fmt(e.anterior)),h(2),R("atual",e.total)("anterior",e.anterior),h(2),S(e.taxa===null?"\u2014":o.fmt1(e.taxa))}}function dR(t,n){if(t&1&&(f(0,"div",21)(1,"table",22)(2,"thead")(3,"tr")(4,"th"),b(5,"#"),u(),f(6,"th"),b(7,"Munic\xEDpio"),u(),f(8,"th",23),b(9,"12 meses"),u(),f(10,"th",23),b(11,"Anteriores"),u(),f(12,"th",23),b(13,"Var."),u(),f(14,"th",23),b(15,"Por 100 mil"),u()()(),f(16,"tbody"),xe(17,lR,17,11,"tr",24,nR),u()()()),t&2){let e=x(3);h(17),Ce(e.linhas())}}function uR(t,n){t&1&&(f(0,"p",2),b(1,"Nenhum munic\xEDpio nesta lista."),u())}function mR(t,n){if(t&1&&(f(0,"p",2),b(1),u(),k(2,dR,19,0,"div",21)(3,uR,2,0,"p",2)),t&2){let e=n,i=x(2);h(),qi("",i.explicacao()," \xB7 ",i.fmt(e.municipiosComRegistro)," munic\xEDpios com registro de ",e.evento.toLowerCase(),"."),h(),N(i.linhas().length?2:3)}}function pR(t,n){if(t&1){let e=We();k(0,aR,1,0,"mat-progress-bar",3),f(1,"header",4)(2,"div")(3,"h2"),b(4),u(),f(5,"p"),b(6),u()()(),f(7,"div",5),xe(8,sR,10,8,"div",6,eR),u(),f(10,"section",7)(11,"h3"),b(12,"Insights do estado"),u(),A(13,"app-insights",8),u(),f(14,"section",7)(15,"div",9)(16,"h3"),b(17,"Munic\xEDpios"),u(),f(18,"span",2),b(19,"Clique num munic\xEDpio para abri-lo. O mapa colore cada munic\xEDpio pela taxa."),u()(),f(20,"mat-chip-listbox",10),V("change",function(o){De(e);let a=x();return Me(o.value!==void 0&&a.store.eventoPanorama.set(o.value))}),xe(21,cR,2,2,"mat-chip-option",11,tR),u(),f(23,"mat-button-toggle-group",12),V("change",function(o){De(e);let a=x();return Me(a.visao.set(o.value))}),f(24,"mat-button-toggle",13),b(25,"Mais registros"),u(),f(26,"mat-button-toggle",14),b(27,"Maior taxa"),u(),f(28,"mat-button-toggle",15),b(29,"Maiores altas"),u(),f(30,"mat-button-toggle",16),b(31,"Maiores quedas"),u()(),k(32,mR,4,4),u(),f(33,"p",2),b(34),u()}if(t&2){let e,i=x(),o=at(0);N(i.store.panoramaCarregando()?0:-1),h(4),re("Panorama de ",i.nomeEstado()),h(2),dt("Sinesp \xB7 \xFAltimos 12 meses publicados (",o.oficial?.periodo,") \xB7 ",i.fmt(i.totalMunicipios())," munic\xEDpios"),h(2),Ce(i.principais()),h(5),R("itens",i.insightsEstado()),h(7),R("value",i.store.eventoPanorama()),h(),Ce(o.rankings),h(2),R("value",i.visao()),h(9),N((e=i.ranking())?32:-1,e),h(2),re("Taxas calculadas com a popula\xE7\xE3o do IBGE ",o.anoPopulacao,". O ranking por taxa considera s\xF3 munic\xEDpios com 20 mil habitantes ou mais, para evitar distor\xE7\xE3o de cidades muito pequenas.")}}var Qu=class t{store=p(kt);visao=G("total");fmt=T;fmt1=Ee;panorama=P(()=>{let n=this.store.panorama();return n&&n.uf===this.store.uf()?n:null});totalMunicipios=P(()=>Ii(this.store.uf()).length);nomeEstado=P(()=>zt[this.store.uf()].nome);principais=P(()=>(this.panorama()?.oficial?.eventos||[]).slice(0,4));ranking=P(()=>{let n=this.panorama()?.rankings||[];return n[this.store.eventoPanorama()]||n[0]||null});linhas=P(()=>{let n=this.ranking();return n?{total:n.porTotal,taxa:n.porTaxa,altas:n.altas,quedas:n.quedas}[this.visao()]:[]});explicacao=P(()=>({total:"Mais registros nos \xFAltimos 12 meses",taxa:"Maior taxa por 100 mil habitantes (munic\xEDpios com 20 mil hab. ou mais)",altas:"Maior aumento em rela\xE7\xE3o aos 12 meses anteriores",quedas:"Maior redu\xE7\xE3o em rela\xE7\xE3o aos 12 meses anteriores"})[this.visao()]);insightsEstado=P(()=>{let n=this.panorama();return n?.disponivel?Gu({ehEstado:!0,nomeLocal:this.nomeEstado(),cidade:"",oficial:n.oficial||null,panorama:n,f:Mc(null,90,[],"",!0),periodoDias:90}).filter(e=>e.fonte!=="Not\xEDcias"):[]});barra(n){let e=this.visao(),i=this.linhas(),o=r=>e==="taxa"?r.taxa||0:e==="altas"?r.total-r.anterior:e==="quedas"?r.anterior-r.total:r.total,a=Math.max(...i.map(o),1);return Math.max(2,o(n)/a*100)}ehAtual(n){return this.store.escopo()==="CIDADE"&&n.n.toLowerCase()===this.store.cidade().toLowerCase()}abrir(n){let e=Kr(n.ibge);this.store.abrirLocal(this.store.uf(),e?e.nome:n.n)}static \u0275fac=function(e){return new(e||t)};static \u0275cmp=H({type:t,selectors:[["app-estado"]],decls:4,vars:2,consts:[[1,"vazio"],["mode","indeterminate"],[1,"nota"],["mode","indeterminate",1,"fina"],[1,"cabecalho"],[1,"kpis"],[1,"kpi"],[1,"bloco"],[3,"itens"],[1,"titulo-bloco"],["aria-label","Indicador",3,"change","value"],[3,"value"],["aria-label","Ordena\xE7\xE3o","hideSingleSelectionIndicator","",1,"visoes",3,"change","value"],["value","total"],["value","taxa"],["value","altas"],["value","quedas"],[1,"kpi-rotulo"],[1,"kpi-sub"],[3,"atual","anterior"],[3,"valores","largura","altura"],[1,"tabela-rolagem"],[1,"tabela"],[1,"num"],["tabindex","0",3,"atual"],["tabindex","0",3,"click","keydown.enter"],[1,"pos"],[1,"mun"],[1,"barra"],["semTexto","\u2014",3,"atual","anterior"]],template:function(e,i){if(e&1&&(Ln(0),k(1,iR,3,1)(2,oR,5,1,"div",0)(3,pR,35,9)),e&2){let o=ei(i.panorama());h(),N(o?o.disponivel?3:2:1)}},dependencies:[Au,Mg,Eg,Tu,Cc,$r,It,jt,jo,ns,Di,Un,ts,is],styles:["[_nghost-%COMP%]{display:block}.fina[_ngcontent-%COMP%]{margin-bottom:8px}.cabecalho[_ngcontent-%COMP%]{margin-bottom:12px}h2[_ngcontent-%COMP%]{font:var(--%NS%mat-sys-title-large);margin:0}.cabecalho[_ngcontent-%COMP%]   p[_ngcontent-%COMP%]{margin:2px 0 0;color:var(--%NS%mat-sys-on-surface-variant)}h3[_ngcontent-%COMP%]{font:var(--%NS%mat-sys-title-medium);margin:0 0 8px}.kpis[_ngcontent-%COMP%]{display:grid;grid-template-columns:repeat(auto-fill,minmax(170px,1fr));gap:10px;margin-bottom:14px}.kpi[_ngcontent-%COMP%]{display:flex;flex-direction:column;gap:3px;padding:12px;border-radius:var(--%NS%raio-m);background:var(--%NS%mat-sys-surface-container-low);border:1px solid var(--%NS%borda-suave);min-width:0}.kpi-rotulo[_ngcontent-%COMP%]{font:var(--%NS%mat-sys-label-medium);color:var(--%NS%mat-sys-on-surface-variant);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.kpi[_ngcontent-%COMP%]   b[_ngcontent-%COMP%]{font:var(--%NS%mat-sys-headline-small);font-weight:600;font-variant-numeric:tabular-nums}.kpi-sub[_ngcontent-%COMP%]{font:var(--%NS%mat-sys-body-small);color:var(--%NS%mat-sys-on-surface-variant);display:flex;align-items:center;gap:4px;flex-wrap:wrap}.bloco[_ngcontent-%COMP%]{margin-bottom:16px}.titulo-bloco[_ngcontent-%COMP%]{display:flex;align-items:baseline;justify-content:space-between;gap:8px;flex-wrap:wrap}mat-chip-listbox[_ngcontent-%COMP%]{display:block;margin:4px 0 10px}.visoes[_ngcontent-%COMP%]{margin-bottom:6px;flex-wrap:wrap}.tabela-rolagem[_ngcontent-%COMP%]{overflow-x:auto}tr[tabindex][_ngcontent-%COMP%]{cursor:pointer}tr[tabindex][_ngcontent-%COMP%]:hover   td[_ngcontent-%COMP%]{background:var(--%NS%mat-sys-surface-container)}tr.atual[_ngcontent-%COMP%]   td[_ngcontent-%COMP%]{background:color-mix(in srgb,var(--%NS%mat-sys-primary) 10%,transparent)}.pos[_ngcontent-%COMP%]{color:var(--%NS%mat-sys-on-surface-variant);width:28px}.mun[_ngcontent-%COMP%]{display:block;font-weight:500}.barra[_ngcontent-%COMP%]{display:block;height:4px;margin-top:3px;background:var(--%NS%mat-sys-surface-container-high);border-radius:2px;max-width:220px}.barra[_ngcontent-%COMP%]   span[_ngcontent-%COMP%]{display:block;height:100%;background:var(--%NS%cor-perigo);border-radius:2px;opacity:.75}@media(max-width:600px){.visoes[_ngcontent-%COMP%]     .mat-button-toggle-label-content{padding:0 8px;font-size:12px}}"]})};var fR=(t,n)=>n.nome+n.cidade,hR=(t,n)=>n.nome,gR=(t,n)=>n.id;function bR(t,n){t&1&&A(0,"div",13)(1,"div",14)}function vR(t,n){if(t&1&&(f(0,"div",16)(1,"div")(2,"small"),b(3),u(),f(4,"b"),b(5),u()(),f(6,"div")(7,"small"),b(8),u(),f(9,"b"),b(10),u()(),f(11,"div")(12,"small"),b(13,"Varia\xE7\xE3o"),u(),f(14,"b"),A(15,"app-delta",17),u()()()),t&2){let e=x(2),i=at(0);h(3),re("\xDAltimos ",e.periodo()),h(2),S(e.fmt(i.todas.length)),h(3),re("",e.periodo()," anteriores"),h(2),S(e.fmt(i.anteriores.length)),h(5),R("atual",i.todas.length)("anterior",i.anteriores.length)}}function yR(t,n){t&1&&(f(0,"p",5),b(1,"Para comparar com o per\xEDodo anterior, escolha 30 dias, 90 dias ou 6 meses (o hist\xF3rico guardado \xE9 de 12 meses)."),u())}function _R(t,n){if(t&1&&(f(0,"p",15),b(1),u(),k(2,vR,16,6,"div",16)(3,yR,2,0,"p",5)),t&2){let e=x(),i=at(0);h(),S(e.situacao()),h(),N(i.comparavel?2:3)}}function xR(t,n){if(t&1&&(b(0," \xB7 "),f(1,"span",23),b(2),u()),t&2){let e=x().$implicit,i=x(2);h(2),re("",i.fmt(e.graves)," graves")}}function CR(t,n){if(t&1){let e=We();f(0,"button",19),V("click",function(){let o=De(e).$implicit,a=x(2);return Me(a.store.definirOrgao(o.id))}),f(1,"span",20),A(2,"i"),b(3),u(),f(4,"span",21),A(5,"span"),u(),f(6,"span",22)(7,"b"),b(8),u(),k(9,xR,3,1),u()()}if(t&2){let e=n.$implicit,i=x(2);z("ativo",i.store.orgao()===e.id),R("title",e.nome),h(2),we("background",e.cor),h(),S(e.nome),h(2),we("width",e.largura,"%")("background",e.cor),h(3),S(i.fmt(e.qtd)),h(),N(e.graves?9:-1)}}function SR(t,n){if(t&1&&(xe(0,CR,10,12,"button",18,gR),f(2,"p",5),b(3),u()),t&2){let e=x(),i=at(0);Ce(e.orgaos()),h(3),dt("",e.fmt(i.semOrgao)," de ",e.fmt(i.totalCruzamento)," not\xEDcias n\xE3o citam \xF3rg\xE3o. Uma not\xEDcia pode citar mais de um.")}}function wR(t,n){t&1&&(f(0,"div",6)(1,"mat-icon"),b(2,"hub"),u(),b(3,"Nenhuma not\xEDcia do per\xEDodo cita \xF3rg\xE3os de seguran\xE7a."),u())}function ER(t,n){if(t&1){let e=We();f(0,"button",24),V("click",function(){let o=De(e).$implicit,a=x();return Me(a.store.focar(o.lat,o.lng))}),f(1,"span",25)(2,"span",1),b(3,"location_on"),u(),b(4),u(),f(5,"span",26),b(6),u()()}if(t&2){let e=n.$implicit,i=x();R("disabled",!e.n),h(2),we("color",i.cor(e)),h(2),S(i.store.escopo()==="ESTADO"?e.cidade+" \u2014 "+e.nome:e.nome),h(2),S(i.fmt(e.qtd))}}function DR(t,n){t&1&&(f(0,"div",6)(1,"mat-icon"),b(2,"signpost"),u(),b(3,"As not\xEDcias do per\xEDodo n\xE3o citam bairros ou ruas."),u())}function MR(t,n){if(t&1&&(f(0,"div",12)(1,"span",25),b(2),u(),f(3,"span",26),b(4),u()()),t&2){let e=n.$implicit,i=x();h(2),S(e.nome),h(2),S(i.fmt(e.qtd))}}function IR(t,n){t&1&&(f(0,"div",6)(1,"mat-icon"),b(2,"newspaper"),u(),b(3,"Sem not\xEDcias no per\xEDodo."),u())}var Ju=class t{store=p(kt);fmt=T;pct=rn;periodo=P(()=>Zr(this.store.periodoDias()));carregandoVazio=P(()=>this.store.carregando()&&(!this.store.dados()||!!this.store.dados().vazio));coleta=P(()=>{let n=this.store.dados();return n?.ultimaColeta?"coletado em "+n.ultimaColeta:""});locais=P(()=>this.store.filtrados().locais.slice(0,10));cor=n=>vt[n.catTop]?.cor||"#64748b";orgaos=P(()=>{let n=this.store.filtrados();return zg.filter(e=>n.porOrgao[e.id]).map(e=>W(I(I({},e),n.porOrgao[e.id]),{largura:rn(n.porOrgao[e.id].qtd,n.totalCruzamento)})).sort((e,i)=>i.qtd-e.qtd)});situacao=P(()=>{let n=this.store.filtrados(),e=this.store.dados(),i=n.todas.length,o=this.periodo(),a=this.store.escopo()==="ESTADO";if(!i)return e?.totalNaBase?`Nenhuma ocorr\xEAncia nos \xFAltimos ${o} para os filtros escolhidos. H\xE1 ${T(e.totalNaBase)} registros em per\xEDodos mais longos.`:a?"Ainda n\xE3o h\xE1 cidades deste estado com not\xEDcias coletadas. Abra um munic\xEDpio pela busca para come\xE7ar.":"Ainda n\xE3o h\xE1 not\xEDcias coletadas para este munic\xEDpio. A busca roda em segundo plano ao abrir a cidade.";let r=Object.keys(n.porCat).sort((m,v)=>n.porCat[v]-n.porCat[m]),s=vt[r[0]],c=(n.porCat.CVLI||0)+(n.porCat.CONFRONTO||0),d=n.zonas[0],l=`Nos \xFAltimos ${o}, ${this.store.nomeLocal()} teve ${T(i)} ocorr\xEAncias noticiadas, com predom\xEDnio de ${s.nome.toLowerCase()} (${rn(n.porCat[s.id],i)}%)`+(c?` e ${T(c)} casos de homic\xEDdio ou tiroteio`:"")+". ";return l+=d?`A principal zona vermelha fica em ${d.nome}, com ${T(d.qtd)} registros. `:n.precisas.length?"Os pontos est\xE3o dispersos, sem concentra\xE7\xE3o que forme zona vermelha. ":"",l+=`${rn(n.precisas.length,i)}% das not\xEDcias t\xEAm local preciso no mapa.`,a&&e&&(l+=` Vis\xE3o formada pelas ${T(e.cidadesMonitoradas)} cidades j\xE1 consultadas no painel.`),l});graficoMensal=P(()=>{let n=this.store.filtrados(),e=Lo.filter(i=>n.serie.porCat[i.id]);return{type:"bar",data:{labels:n.serie.labels,datasets:e.map(i=>({label:i.curto,data:n.serie.porCat[i.id],backgroundColor:i.cor,borderRadius:2,maxBarThickness:24}))},options:{plugins:{legend:{position:"bottom"}},scales:{x:{stacked:!0,grid:{display:!1}},y:{stacked:!0,beginAtZero:!0,ticks:{precision:0}}}}}});graficoTipo=P(()=>{let n=this.store.filtrados(),e=Lo.filter(i=>n.porCat[i.id]);return{type:"bar",data:{labels:e.map(i=>i.curto),datasets:[{label:"Ocorr\xEAncias",data:e.map(i=>n.porCat[i.id]),backgroundColor:e.map(i=>i.cor),borderRadius:4,maxBarThickness:18}]},options:{indexAxis:"y",plugins:{legend:{display:!1}},scales:{x:{beginAtZero:!0,ticks:{precision:0}},y:{grid:{display:!1}}}}}});graficoSemana=P(()=>{let n=this.store.filtrados();return{type:"bar",data:{labels:zu,datasets:[{label:"Ocorr\xEAncias",data:n.semana,backgroundColor:"#64748b",borderRadius:4,maxBarThickness:28}]},options:{plugins:{legend:{display:!1}},scales:{x:{grid:{display:!1}},y:{beginAtZero:!0,ticks:{precision:0}}}}}});static \u0275fac=function(e){return new(e||t)};static \u0275cmp=H({type:t,selectors:[["app-geral"]],decls:71,vars:12,consts:[[1,"titulo-aba"],[1,"material-symbols-outlined"],[1,"colunas"],[1,"cartao"],[1,"titulo-bloco"],[1,"nota"],[1,"vazio","pequeno"],["rotulo","Ocorr\xEAncias por m\xEAs",1,"alto",3,"config"],["rotulo","Ocorr\xEAncias por tipo",3,"config"],["rotulo","Ocorr\xEAncias por dia da semana",3,"config"],["type","button",1,"linha",3,"disabled"],[1,"nota","google"],[1,"linha"],[1,"esqueleto"],[1,"esqueleto","curto"],[1,"texto"],[1,"comparacao"],[3,"atual","anterior"],["type","button",1,"linha-orgao",3,"ativo","title"],["type","button",1,"linha-orgao",3,"click","title"],[1,"orgao-nome"],[1,"orgao-barra"],[1,"orgao-num"],[1,"perigo"],["type","button",1,"linha",3,"click","disabled"],[1,"linha-nome"],[1,"pilula"]],template:function(e,i){if(e&1&&(Ln(0),f(1,"h3",0)(2,"span",1),b(3,"newspaper"),u(),b(4," An\xE1lise das not\xEDcias "),f(5,"small"),b(6,"complemento ao Sinesp"),u()(),f(7,"div",2)(8,"section",3)(9,"div",4)(10,"h3"),b(11,"Situa\xE7\xE3o"),u(),f(12,"span",5),b(13),u()(),k(14,bR,2,0)(15,_R,4,2),u(),f(16,"section",3)(17,"div",4)(18,"h3"),b(19,"Cruzamento por fonte"),u(),f(20,"span",5),b(21,"clique para filtrar"),u()(),k(22,SR,4,2)(23,wR,4,0,"div",6),u()(),f(24,"section",3)(25,"div",4)(26,"h3"),b(27,"Ocorr\xEAncias noticiadas por m\xEAs"),u(),f(28,"span",5),b(29,"\xFAltimos 12 meses"),u()(),A(30,"app-grafico",7),u(),f(31,"div",2)(32,"section",3)(33,"div",4)(34,"h3"),b(35,"Por tipo de crime"),u(),f(36,"span",5),b(37),u()(),A(38,"app-grafico",8),u(),f(39,"section",3)(40,"div",4)(41,"h3"),b(42,"Dia da semana"),u(),f(43,"span",5),b(44),u()(),A(45,"app-grafico",9),u()(),f(46,"div",2)(47,"section",3)(48,"div",4)(49,"h3"),b(50,"Locais mais citados"),u(),f(51,"span",5),b(52,"clique para ver no mapa"),u()(),xe(53,ER,7,5,"button",10,fR,!1,DR,4,0,"div",6),u(),f(56,"section",3)(57,"div",4)(58,"h3"),b(59,"Ve\xEDculos de imprensa"),u(),f(60,"span",5),b(61),u()(),f(62,"p",11)(63,"span",1),b(64,"travel_explore"),u(),b(65,"Coletadas pela API do Google Not\xEDcias: busca geral, busca por \xF3rg\xE3os e sites da imprensa local do estado."),u(),xe(66,MR,5,2,"div",12,hR,!1,IR,4,0,"div",6),u()(),f(69,"p",5),b(70,"Not\xEDcias policiais classificadas automaticamente; n\xE3o equivalem ao total de boletins de ocorr\xEAncia. Os registros oficiais est\xE3o nas abas Panorama, Dados oficiais e Estado."),u()),e&2){let o=ei(i.store.filtrados());h(13),S(i.coleta()),h(),N(i.carregandoVazio()?14:15),h(8),N(i.orgaos().length?22:23),h(8),R("config",i.graficoMensal()),h(7),S(i.periodo()),h(),R("config",i.graficoTipo()),h(6),S(i.periodo()),h(),R("config",i.graficoSemana()),h(8),Ce(i.locais()),h(8),S(o.totalCruzamento?i.pct(o.imprensaLocal,o.totalCruzamento)+"% imprensa local":""),h(5),Ce(o.fontes.slice(0,7))}},dependencies:[It,jt,jo,Un,Vo],styles:["[_nghost-%COMP%]{display:grid;gap:12px;margin-bottom:12px}.titulo-aba[_ngcontent-%COMP%]   small[_ngcontent-%COMP%]{font:var(--%NS%mat-sys-body-small);color:var(--%NS%mat-sys-on-surface-variant)}.bloco[_ngcontent-%COMP%]{display:grid;gap:8px}.colunas[_ngcontent-%COMP%]{display:grid;grid-template-columns:1fr;gap:12px}@container painel (min-width: 720px){.colunas[_ngcontent-%COMP%]{grid-template-columns:1fr 1fr}}.titulo-bloco[_ngcontent-%COMP%]{display:flex;align-items:baseline;justify-content:space-between;gap:8px;margin-bottom:8px}h3[_ngcontent-%COMP%]{font:var(--%NS%mat-sys-title-medium);margin:0;display:flex;align-items:center;gap:6px}h3[_ngcontent-%COMP%]   .material-symbols-outlined[_ngcontent-%COMP%]{color:var(--%NS%mat-sys-primary);font-size:20px}.texto[_ngcontent-%COMP%]{font:var(--%NS%mat-sys-body-large);margin:0 0 10px;line-height:1.55}.comparacao[_ngcontent-%COMP%]{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}.comparacao[_ngcontent-%COMP%]   div[_ngcontent-%COMP%]{background:var(--%NS%mat-sys-surface-container);border-radius:var(--%NS%raio-m);padding:8px 10px;display:flex;flex-direction:column;gap:2px}.comparacao[_ngcontent-%COMP%]   small[_ngcontent-%COMP%]{color:var(--%NS%mat-sys-on-surface-variant);font:var(--%NS%mat-sys-label-small)}.comparacao[_ngcontent-%COMP%]   b[_ngcontent-%COMP%]{font:var(--%NS%mat-sys-title-medium)}app-grafico.alto[_ngcontent-%COMP%]{height:240px}.linha[_ngcontent-%COMP%], .linha-orgao[_ngcontent-%COMP%]{display:flex;align-items:center;justify-content:space-between;gap:8px;width:100%;padding:7px 4px;border:0;border-bottom:1px solid var(--%NS%mat-sys-outline-variant);background:none;color:inherit;font:var(--%NS%mat-sys-body-medium);text-align:left;cursor:pointer}.linha[_ngcontent-%COMP%]:disabled{cursor:default}.linha[_ngcontent-%COMP%]:not(:disabled):hover, .linha-orgao[_ngcontent-%COMP%]:hover{background:var(--%NS%mat-sys-surface-container)}.linha-nome[_ngcontent-%COMP%]{display:flex;align-items:center;gap:6px;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.linha-nome[_ngcontent-%COMP%]   .material-symbols-outlined[_ngcontent-%COMP%]{font-size:18px}.linha-orgao[_ngcontent-%COMP%]{display:grid;grid-template-columns:minmax(0,1.3fr) 1fr auto}.linha-orgao.ativo[_ngcontent-%COMP%]{background:color-mix(in srgb,var(--%NS%mat-sys-primary) 10%,transparent)}.orgao-nome[_ngcontent-%COMP%]{display:flex;align-items:center;gap:6px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.orgao-nome[_ngcontent-%COMP%]   i[_ngcontent-%COMP%]{width:10px;height:10px;border-radius:3px;flex:none}.orgao-barra[_ngcontent-%COMP%]{height:6px;background:var(--%NS%mat-sys-surface-container-high);border-radius:3px;overflow:hidden}.orgao-barra[_ngcontent-%COMP%]   span[_ngcontent-%COMP%]{display:block;height:100%}.orgao-num[_ngcontent-%COMP%]{font-variant-numeric:tabular-nums;white-space:nowrap}.perigo[_ngcontent-%COMP%]{color:var(--%NS%cor-perigo)}.google[_ngcontent-%COMP%]{display:flex;gap:6px;align-items:flex-start;margin:0 0 6px}.google[_ngcontent-%COMP%]   .material-symbols-outlined[_ngcontent-%COMP%]{font-size:18px;color:var(--%NS%mat-sys-primary)}"]})};var kR=(t,n)=>n.id;function NR(t,n){if(t&1&&(f(0,"span",17),b(1),u()),t&2){let e=n.$implicit,i=x(2);we("color",i.orgao(e).cor),R("title",i.orgao(e).nome),h(),S(i.orgao(e).curto)}}function TR(t,n){t&1&&(f(0,"span",12),b(1,"imprensa local"),u())}function AR(t,n){if(t&1){let e=We();f(0,"article",6)(1,"div",9)(2,"span",10),b(3),u(),xe(4,NR,2,4,"span",11,_i),k(6,TR,2,0,"span",12),f(7,"small"),b(8),u()(),f(9,"a",13),b(10),u(),f(11,"div",14)(12,"button",15),V("click",function(){let o=De(e).$implicit,a=x();return Me(a.store.focar(o.lat,o.lng))}),f(13,"span",1),b(14,"location_on"),u(),b(15),u(),f(16,"span"),b(17),u(),f(18,"span",16),b(19),u()()()}if(t&2){let e=n.$implicit,i=x();h(2),we("color",i.cat(e).cor),h(),S(i.cat(e).curto),h(),Ce(e.orgaos),h(2),N(e.local?6:-1),h(2),S(e.data),h(),R("href",i.url(e.link),So),h(),S(e.titulo),h(2),R("disabled",!e.precisa),h(3),re("",i.store.escopo()==="ESTADO"?e.cidade+" \u2014 "+e.bairro:e.bairro," "),h(),we("color",i.precisao(e).cor),h(),S(i.precisao(e).nome),h(2),S(e.veiculo||"Fonte")}}function OR(t,n){if(t&1&&(f(0,"div",7)(1,"mat-icon"),b(2,"newspaper"),u(),b(3),u()),t&2){let e=x();h(3),S(e.store.carregando()?"Carregando not\xEDcias\u2026":"Nenhuma not\xEDcia para os filtros escolhidos.")}}function RR(t,n){if(t&1){let e=We();f(0,"button",18),V("click",function(){De(e);let o=x();return Me(o.pagina.set(o.pagina()+1))}),b(1),u()}if(t&2){let e=x();h(),re("Mostrar mais (",e.fmt(e.lista().length-e.visiveis().length),")")}}var em=class t{store=p(kt);fmt=T;url=Va;filtro=G("");filtroAplicado=G("");pagina=G(1);timer;coleta=P(()=>{let n=this.store.dados();return n?.ultimaColeta?" \xB7 \xFAltima coleta "+n.ultimaColeta:""});lista=P(()=>{let n=Oe(this.filtroAplicado()),e=this.store.filtrados().todas;return n?e.filter(i=>Oe(i.titulo+" "+i.bairro+" "+i.veiculo).includes(n)):e});visiveis=P(()=>this.lista().slice(0,this.pagina()*fe.MAX_NOTICIAS_POR_PAGINA));constructor(){lt(()=>{this.store.filtrados(),this.pagina.set(1)})}digitar(n){this.filtro.set(n),clearTimeout(this.timer),this.timer=setTimeout(()=>{this.filtroAplicado.set(n),this.pagina.set(1)},180)}cat=n=>vt[n.cat];orgao=n=>an[n];precisao=n=>Wr[n.precisao]||Wr.PENDENTE;static \u0275fac=function(e){return new(e||t)};static \u0275cmp=H({type:t,selectors:[["app-noticias"]],decls:14,vars:5,consts:[[1,"nota","google"],[1,"material-symbols-outlined"],["appearance","outline","subscriptSizing","dynamic",1,"filtro"],["matPrefix",""],["matInput","","placeholder","Filtrar por palavra, bairro ou ve\xEDculo",3,"input","value"],[1,"nota"],[1,"cartao","noticia"],[1,"vazio"],["mat-stroked-button",""],[1,"topo"],[1,"tag"],[1,"tag",3,"color","title"],[1,"pilula"],["target","_blank","rel","noopener",1,"titulo",3,"href"],[1,"meta"],["type","button",1,"pilula",3,"click","disabled"],[1,"veiculo"],[1,"tag",3,"title"],["mat-stroked-button","",3,"click"]],template:function(e,i){e&1&&(f(0,"p",0)(1,"span",1),b(2,"travel_explore"),u(),b(3),u(),f(4,"mat-form-field",2)(5,"mat-icon",3),b(6,"filter_list"),u(),f(7,"input",4),V("input",function(a){return i.digitar(a.target.value)}),u()(),f(8,"p",5),b(9),u(),xe(10,AR,20,13,"article",6,kR,!1,OR,4,1,"div",7),k(13,RR,2,1,"button",8)),e&2&&(h(3),re("Fonte: Google Not\xEDcias e imprensa local",i.coleta()),h(4),R("value",i.filtro()),h(2),re("",i.fmt(i.lista().length)," not\xEDcias"),h(),Ce(i.visiveis()),h(3),N(i.lista().length>i.visiveis().length?13:-1))},dependencies:[no,zr,_c,Lu,Fu,It,jt,Po,Iu],styles:["[_nghost-%COMP%]{display:grid;gap:8px}.google[_ngcontent-%COMP%]{display:flex;gap:6px;align-items:center;margin:0}.google[_ngcontent-%COMP%]   .material-symbols-outlined[_ngcontent-%COMP%]{font-size:18px;color:var(--%NS%mat-sys-primary)}.filtro[_ngcontent-%COMP%]{width:100%}.noticia[_ngcontent-%COMP%]{display:grid;gap:6px;padding:12px}.topo[_ngcontent-%COMP%]{display:flex;align-items:center;gap:6px;flex-wrap:wrap}.topo[_ngcontent-%COMP%]   small[_ngcontent-%COMP%]{margin-left:auto;color:var(--%NS%mat-sys-on-surface-variant)}.titulo[_ngcontent-%COMP%]{font:var(--%NS%mat-sys-title-small);color:var(--%NS%mat-sys-on-surface);text-decoration:none}.titulo[_ngcontent-%COMP%]:hover{text-decoration:underline;color:var(--%NS%mat-sys-primary)}.meta[_ngcontent-%COMP%]{display:flex;gap:10px;align-items:center;flex-wrap:wrap;font:var(--%NS%mat-sys-body-small)}.meta[_ngcontent-%COMP%]   .pilula[_ngcontent-%COMP%]{border:0;cursor:pointer;display:inline-flex;align-items:center;gap:2px}.meta[_ngcontent-%COMP%]   .pilula[_ngcontent-%COMP%]:disabled{cursor:default}.meta[_ngcontent-%COMP%]   .material-symbols-outlined[_ngcontent-%COMP%]{font-size:15px}.veiculo[_ngcontent-%COMP%]{margin-left:auto;color:var(--%NS%mat-sys-on-surface-variant)}"]})};var Fw=(t,n)=>n.id,PR=(t,n)=>n.nome;function FR(t,n){t&1&&(A(0,"mat-progress-bar",1),f(1,"p",2),b(2,"Carregando indicadores do Sinesp\u2026"),u())}function LR(t,n){t&1&&(f(0,"div",0)(1,"mat-icon"),b(2,"account_balance"),u(),b(3,"Sem dados oficiais para este local."),u())}function BR(t,n){if(t&1&&k(0,FR,3,0)(1,LR,4,0,"div",0),t&2){let e=x();N(e.store.carregando()||e.store.panoramaCarregando()?0:1)}}function VR(t,n){if(t&1&&(f(0,"a",3),b(1,"Abrir o painel oficial do Sinesp"),u()),t&2){let e=x(2),i=at(0);R("href",e.url(i.urlPainel),So)}}function jR(t,n){if(t&1&&(f(0,"div",0)(1,"mat-icon"),b(2,"account_balance"),u(),f(3,"p"),b(4),u(),k(5,VR,2,1,"a",3),u()),t&2){x();let e=at(0);h(4),S(e.motivo||"Estat\xEDstica oficial indispon\xEDvel."),h(),N(e.urlPainel?5:-1)}}function zR(t,n){if(t&1&&(f(0,"span")(1,"mat-icon"),b(2,"groups"),u(),b(3),f(4,"small"),b(5),u()()),t&2){let e=x(2),i=at(0);h(3),re("",e.populacao(i.populacao)," hab. "),h(2),re("IBGE ",i.anoPopulacao)}}function HR(t,n){if(t&1&&(f(0,"span",14),b(1),u(),f(2,"span",15),b(3),u()),t&2){let e=x().$implicit;h(),S(e.total),h(2),S(e.sub)}}function $R(t,n){if(t&1&&(f(0,"span",16),b(1,"Sem base p\xFAblica"),u(),f(2,"span",15),b(3),u()),t&2){let e=x().$implicit;h(3),S(e.sub)}}function UR(t,n){if(t&1&&(f(0,"div",12)(1,"div",13),A(2,"i"),f(3,"b"),b(4),u()(),k(5,HR,4,2)(6,$R,4,1),u()),t&2){let e=n.$implicit;we("--%NS%cor-orgao",e.cor),z("sem-base",!e.oficial),h(4),S(e.nome),h(),N(e.oficial?5:6)}}function GR(t,n){if(t&1&&(f(0,"span"),A(1,"i"),b(2),u()),t&2){let e=n.$implicit,i=n.$index,o=x(3);h(),we("background",o.coresAnos[i]),h(),S(e)}}function WR(t,n){if(t&1&&(f(0,"section",9)(1,"div",17)(2,"div")(3,"h3"),b(4),u(),f(5,"p",2),b(6,"M\xEAs a m\xEAs, uma linha por ano \xB7 clique num indicador abaixo para trocar"),u()(),f(7,"div",18),xe(8,GR,3,3,"span",null,_i),u()(),A(10,"app-grafico",19),u()),t&2){let e=x(2),i=at(0);h(4),S(n.nome),h(4),Ce(i.anos),h(2),R("config",e.graficoAnos())}}function qR(t,n){if(t&1&&(f(0,"span",32),b(1),u()),t&2){let e=n.$implicit;we("color",e.cor),R("matTooltip","Registrado pela "+e.nome+" nos \xFAltimos 12 meses"),h(),dt("",e.id," ",e.qtd)}}function YR(t,n){if(t&1&&b(0),t&2){let e=x().$implicit,i=x(2),o=at(0);qi(" ",o.rotuloSel," \xB7 ",i.n(e.selAnterior??null)," em ",o.rotuloAnt," ")}}function ZR(t,n){if(t&1&&b(0),t&2){let e=x(2).$implicit,i=x(2),o=at(0);dt(" \xB7 ",i.n(e.parcialAnterior)," no mesmo per\xEDodo de ",o.anos[1]," ")}}function KR(t,n){if(t&1&&(b(0),k(1,ZR,1,2)),t&2){let e=x().$implicit,i=x(2),o=at(0);re(" ",i.parcial()?"jan\u2013"+o.ultimoMes+"/"+o.anos[2]:o.anos[2]," "),h(),N(e.parcialAnterior!==null?1:-1)}}function XR(t,n){if(t&1&&(f(0,"div",28)(1,"span",33),b(2),u(),f(3,"span",34),A(4,"span"),u(),f(5,"span",35),b(6),u()()),t&2){let e=n.$implicit,i=n.$index,o=x().$implicit,a=x(2),r=at(0);h(2),dt("",r.anos[i],"",i===2&&a.parcial()?"*":""),h(2),we("width",a.largura(o,e),"%")("background",a.coresAnos[i]),h(2),S(a.n(e))}}function QR(t,n){if(t&1&&(f(0,"small",37),b(1),u()),t&2){let e=x(2).$implicit,i=x(2);z("acima",e.taxa>e.taxaEstado*1.1)("abaixo",e.taxa<e.taxaEstado*.9),h(),re("\xB7 estado ",i.f1(e.taxaEstado))}}function JR(t,n){if(t&1&&(f(0,"span",30)(1,"b"),b(2),u(),b(3," por 100 mil "),k(4,QR,2,5,"small",36),u()),t&2){let e=x().$implicit,i=x(2),o=at(0);R("matTooltip","\xDAltimos 12 meses publicados ("+o.periodo+")"),h(2),S(i.f1(e.taxa)),h(2),N(e.taxaEstado?4:-1)}}function eP(t,n){if(t&1&&(f(0,"span"),b(1,"12 meses: "),f(2,"b"),b(3),u()()),t&2){let e=x().$implicit,i=x(2);h(3),S(i.n(e.total))}}function tP(t,n){if(t&1){let e=We();f(0,"button",20),V("click",function(){let o=De(e).$index,a=x(2);return Me(a.indice.set(o))}),f(1,"div",21)(2,"span",22),b(3),u(),xe(4,qR,2,5,"span",23,Fw),u(),f(6,"div",24)(7,"b"),b(8),u(),A(9,"app-delta",25),u(),f(10,"div",26),k(11,YR,1,3)(12,KR,2,2),u(),f(13,"div",27),xe(14,XR,7,7,"div",28,Eo),u(),f(16,"div",29),k(17,JR,5,3,"span",30)(18,eP,4,1,"span"),A(19,"app-sparkline",31),u()()}if(t&2){let e=n.$implicit,i=n.$index,o=x(2),a=at(0);z("ativo",o.indice()===i),Q("aria-pressed",o.indice()===i),h(3),S(e.nome),h(),Ce(o.federais(e)),h(4),S(o.n(e.sel??e.porAno[2])),h(),R("atual",e.sel??e.porAno[2])("anterior",e.selAnterior??e.parcialAnterior),h(2),N(a.rotuloSel?11:12),h(3),Ce(e.porAno),h(3),N(e.taxa!==null?17:18),h(2),R("valores",e.serie36)("largura",96)("altura",24)}}function nP(t,n){if(t&1&&(f(0,"p",2),b(1),u()),t&2){x(2);let e=at(0);h(),Us("O n\xFAmero grande de cada cart\xE3o segue o filtro de per\xEDodo: ",e.rotuloSel," (\xFAltimos meses publicados) contra ",e.rotuloAnt,". As barras mostram os anos completos (* ",e.anos[2]," vai at\xE9 ",e.ultimoMes,").")}}function iP(t,n){if(t&1&&(f(0,"p",2),b(1),u()),t&2){x(2);let e=at(0);h(),Us("* ",e.anos[2]," vai de janeiro a ",e.ultimoMes,", \xFAltimo m\xEAs publicado. A varia\xE7\xE3o compara com janeiro a ",e.ultimoMes," de ",e.anos[1],".")}}function oP(t,n){if(t&1&&(f(0,"a",3),b(1,"Painel oficial"),u()),t&2){let e=x(2),i=at(0);R("href",e.url(i.urlPainel),So)}}function aP(t,n){if(t&1&&(f(0,"header",4)(1,"div")(2,"h2"),b(3),u(),f(4,"p"),b(5),u()(),f(6,"div",5),k(7,zR,6,2,"span"),f(8,"span")(9,"mat-icon"),b(10,"event_available"),u(),b(11),u()()(),f(12,"section",6)(13,"h3"),b(14,"\xD3rg\xE3os de seguran\xE7a "),f(15,"small"),b(16),u()(),f(17,"div",7),xe(18,UR,7,6,"div",8,Fw),u()(),k(20,WR,11,2,"section",9),f(21,"div",10),xe(22,tP,20,12,"button",11,PR),u(),k(24,nP,2,4,"p",2)(25,iP,2,4,"p",2),f(26,"p",2),b(27),k(28,oP,2,1,"a",3),u()),t&2){let e,i=x(),o=at(0);h(3),S(i.titulo()),h(2),re("Registros oficiais do Sinesp \xB7 ",o.periodoTresAnos),h(2),N(o.populacao?7:-1),h(4),dt("dados at\xE9 ",o.ultimoMes,"/",o.anoUltimoDado),h(5),re("\xFAltimos 12 meses (",o.periodo,")"),h(2),Ce(i.orgaos()),h(2),N((e=i.selecionado())?20:-1,e),h(2),Ce(o.eventos),h(2),N(o.rotuloSel?24:i.parcial()?25:-1),h(3),dt("Fonte: ",o.fonte," \xB7 importado em ",o.importadoEm,". PRF e PF mostram a parte registrada pelas pol\xEDcias federais; o restante vem das pol\xEDcias e secretarias do estado. "),h(),N(o.urlPainel?28:-1)}}var vb=["#9aa7bb","#5b7bb0","#ee4d2d"],tm=class t{store=p(kt);oficial=this.store.oficial;indice=G(0);coresAnos=vb;n=n=>n==null?"\u2014":T(n);f1=Ee;url=Va;titulo=P(()=>this.store.escopo()==="ESTADO"?"Estado \u2014 "+zt[this.store.uf()].nome:"Munic\xEDpio \u2014 "+this.store.cidade());parcial=P(()=>(this.oficial()?.ultimoMes||"dez")!=="dez");selecionado=P(()=>{let n=this.oficial();return n?.eventos?.[this.indice()]||n?.eventos?.[0]||null});graficoAnos=P(()=>{let n=this.oficial(),e=this.selecionado(),i=n.anos||[],o=n.fimMesIdx??11,a=i.map((r,s)=>{let c=s*12,d=r===n.anoUltimoDado?o+1:12,l=r>(n.anoUltimoDado||0)?[]:e.serie36.slice(c,c+d);return{label:String(r),data:l,borderColor:vb[s],backgroundColor:vb[s],borderWidth:s===2?2.6:1.8,pointRadius:s===2?3:0,cubicInterpolationMode:"monotone"}});return{type:"line",data:{labels:qr,datasets:a},options:{plugins:{legend:{display:!1}},scales:{x:{grid:{display:!1}},y:{beginAtZero:!0,ticks:{precision:0}}}}}});orgaos=P(()=>{let n=this.oficial();if(!n?.disponivel)return[];let e={};for(let l of n.eventos)for(let[m,v]of Object.entries(l.federais||{}))(e[m]||={})[l.nome]=v;let i=l=>Object.values(l).reduce((m,v)=>m+v,0),o=l=>Object.entries(l).sort((m,v)=>v[1]-m[1]).slice(0,2).map(([m,v])=>`${m}: ${T(v)}`).join(" \xB7 "),a={};for(let l of n.eventos){let m=l.total-i(l.federais||{});m>0&&(a[l.nome]=m)}let r=Object.entries(a).filter(([l])=>/^(homic[ií]dio doloso|feminic[ií]dio|latroc[ií]nio|roubo seguido de morte|les[aã]o corporal seguida)/i.test(l)),s=n.eventos.filter(l=>a[l.nome]).slice(0,2).map(l=>`${l.nome}: ${T(a[l.nome])}`).join(" \xB7 "),c=this.store.filtrados().porOrgao;return[{id:"SSP",nome:"Pol\xEDcias Civil e Militar (SSP)",cor:an.PC.cor,oficial:!0,total:T(r.reduce((l,[,m])=>l+m,0)),sub:"mortes violentas intencionais"+(s?" \xB7 "+s:"")},...["PRF","PF"].map(l=>({id:l,nome:an[l].nome,cor:an[l].cor,oficial:!0,total:T(i(e[l]||{})),sub:e[l]?o(e[l]):"nenhum registro federal neste local"})),...["GM","COPOM"].map(l=>({id:l,nome:an[l].nome,cor:an[l].cor,oficial:!1,total:"",sub:`Sem estat\xEDstica aberta nacional. Citado em ${T(c[l]?.qtd||0)} not\xEDcias.`}))]});federais(n){return n.federais?Object.keys(n.federais).map(e=>({id:e,qtd:T(n.federais[e]),cor:an[e]?.cor||"#334155",nome:an[e]?.nome||e})):[]}largura(n,e){let i=Math.max(...n.porAno.map(o=>o||0),1);return e?Math.max(2,e/i*100):0}populacao(n){return n>=1e6?Ee(n/1e6)+" mi":T(n)}static \u0275fac=function(e){return new(e||t)};static \u0275cmp=H({type:t,selectors:[["app-oficial"]],decls:4,vars:2,consts:[[1,"vazio"],["mode","indeterminate"],[1,"nota"],["target","_blank","rel","noopener",3,"href"],[1,"cabecalho"],[1,"fatos"],["aria-label","Registros por \xF3rg\xE3o de seguran\xE7a",1,"orgaos"],[1,"orgaos-grade"],[1,"orgao",3,"sem-base","--%NS%cor-orgao"],[1,"cartao","destaque"],[1,"grade"],["type","button",1,"cartao","indicador",3,"ativo"],[1,"orgao"],[1,"orgao-topo"],[1,"orgao-num"],[1,"orgao-sub"],[1,"orgao-num","pequeno"],[1,"destaque-topo"],[1,"legenda-anos"],["rotulo","Evolu\xE7\xE3o mensal por ano",3,"config"],["type","button",1,"cartao","indicador",3,"click"],[1,"ind-topo"],[1,"ind-nome"],[1,"tag",3,"color","matTooltip"],[1,"ind-valor"],[3,"atual","anterior"],[1,"ind-sub"],[1,"anos"],[1,"ano"],[1,"ind-rodape"],[3,"matTooltip"],[3,"valores","largura","altura"],[1,"tag",3,"matTooltip"],[1,"ano-rotulo"],[1,"ano-barra"],[1,"ano-num"],[1,"comparado",3,"acima","abaixo"],[1,"comparado"]],template:function(e,i){if(e&1&&(Ln(0),k(1,BR,2,1)(2,jR,6,2,"div",0)(3,aP,29,11)),e&2){let o=ei(i.oficial());h(),N(o?o.disponivel?3:2:1)}},dependencies:[It,jt,Di,oo,jo,ns,Un,ts,Vo],styles:["[_nghost-%COMP%]{display:block}.cabecalho[_ngcontent-%COMP%]{display:flex;justify-content:space-between;align-items:flex-end;gap:12px;flex-wrap:wrap;margin-bottom:12px}h2[_ngcontent-%COMP%]{font:var(--%NS%mat-sys-title-large);margin:0}.cabecalho[_ngcontent-%COMP%]   p[_ngcontent-%COMP%]{margin:2px 0 0;color:var(--%NS%mat-sys-on-surface-variant);font:var(--%NS%mat-sys-body-medium)}.fatos[_ngcontent-%COMP%]{display:flex;gap:8px;flex-wrap:wrap}.fatos[_ngcontent-%COMP%]   span[_ngcontent-%COMP%]{display:inline-flex;align-items:center;gap:4px;font:var(--%NS%mat-sys-label-large);background:var(--%NS%mat-sys-surface-container-high);border-radius:8px;padding:4px 10px}.fatos[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%]{font-size:18px;width:18px;height:18px;color:var(--%NS%mat-sys-primary)}.fatos[_ngcontent-%COMP%]   small[_ngcontent-%COMP%]{color:var(--%NS%mat-sys-on-surface-variant);font-weight:400}.orgaos[_ngcontent-%COMP%]{margin-bottom:12px}.orgaos[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%]   small[_ngcontent-%COMP%]{font:var(--%NS%mat-sys-body-small);color:var(--%NS%mat-sys-on-surface-variant);margin-left:4px}.orgaos-grade[_ngcontent-%COMP%]{display:grid;grid-template-columns:repeat(auto-fill,minmax(170px,1fr));gap:8px;margin-top:8px}.orgao[_ngcontent-%COMP%]{display:flex;flex-direction:column;gap:2px;padding:10px 12px;border-radius:var(--%NS%raio-m);border:1px solid var(--%NS%borda-suave);border-left:4px solid var(--%NS%cor-orgao);background:var(--%NS%mat-sys-surface-container-low)}.orgao.sem-base[_ngcontent-%COMP%]{opacity:.75;border-left-style:dashed}.orgao-topo[_ngcontent-%COMP%]{display:flex;align-items:center;gap:6px;font:var(--%NS%mat-sys-label-large)}.orgao-topo[_ngcontent-%COMP%]   i[_ngcontent-%COMP%]{display:none}.orgao-num[_ngcontent-%COMP%]{font:var(--%NS%mat-sys-headline-small);font-weight:600;font-variant-numeric:tabular-nums}.orgao-num.pequeno[_ngcontent-%COMP%]{font:var(--%NS%mat-sys-title-small)}.orgao-sub[_ngcontent-%COMP%]{font:var(--%NS%mat-sys-body-small);color:var(--%NS%mat-sys-on-surface-variant)}.destaque[_ngcontent-%COMP%]{margin-bottom:12px}.destaque[_ngcontent-%COMP%]   app-grafico[_ngcontent-%COMP%]{height:220px}.destaque-topo[_ngcontent-%COMP%]{display:flex;justify-content:space-between;gap:8px;flex-wrap:wrap;margin-bottom:8px}h3[_ngcontent-%COMP%]{font:var(--%NS%mat-sys-title-medium);margin:0}.legenda-anos[_ngcontent-%COMP%]{display:flex;gap:12px;font:var(--%NS%mat-sys-label-medium);align-items:center}.legenda-anos[_ngcontent-%COMP%]   i[_ngcontent-%COMP%]{display:inline-block;width:14px;height:3px;border-radius:2px;margin-right:5px;vertical-align:middle}.grade[_ngcontent-%COMP%]{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:10px}.indicador[_ngcontent-%COMP%]{text-align:left;font:inherit;color:inherit;cursor:pointer;display:flex;flex-direction:column;gap:6px;transition:border-color .15s,box-shadow .15s}.indicador[_ngcontent-%COMP%]:hover{border-color:var(--%NS%mat-sys-outline)}.indicador.ativo[_ngcontent-%COMP%]{border-color:var(--%NS%mat-sys-primary);box-shadow:0 0 0 1px var(--%NS%mat-sys-primary)}.indicador[_ngcontent-%COMP%]:focus-visible{outline:2px solid var(--%NS%mat-sys-primary);outline-offset:2px}.ind-topo[_ngcontent-%COMP%]{display:flex;align-items:center;gap:6px;flex-wrap:wrap}.ind-nome[_ngcontent-%COMP%]{font:var(--%NS%mat-sys-title-small);flex:1;min-width:0}.ind-valor[_ngcontent-%COMP%]{display:flex;align-items:center;gap:8px}.ind-valor[_ngcontent-%COMP%]   b[_ngcontent-%COMP%]{font:var(--%NS%mat-sys-headline-small);font-weight:600;font-variant-numeric:tabular-nums}.ind-sub[_ngcontent-%COMP%]{font:var(--%NS%mat-sys-body-small);color:var(--%NS%mat-sys-on-surface-variant);margin-top:-4px}.anos[_ngcontent-%COMP%]{display:grid;gap:3px;margin-top:2px}.ano[_ngcontent-%COMP%]{display:grid;grid-template-columns:44px 1fr auto;gap:8px;align-items:center;font:var(--%NS%mat-sys-body-small)}.ano-rotulo[_ngcontent-%COMP%]{color:var(--%NS%mat-sys-on-surface-variant)}.ano-barra[_ngcontent-%COMP%]{height:8px;background:var(--%NS%mat-sys-surface-container-high);border-radius:4px;overflow:hidden}.ano-barra[_ngcontent-%COMP%]   span[_ngcontent-%COMP%]{display:block;height:100%;border-radius:4px}.ano-num[_ngcontent-%COMP%]{font-variant-numeric:tabular-nums;font-weight:500;min-width:48px;text-align:right}.ind-rodape[_ngcontent-%COMP%]{display:flex;justify-content:space-between;align-items:center;gap:8px;border-top:1px solid var(--%NS%mat-sys-outline-variant);padding-top:6px;font:var(--%NS%mat-sys-body-small)}.comparado[_ngcontent-%COMP%]{color:var(--%NS%mat-sys-on-surface-variant)}.comparado.acima[_ngcontent-%COMP%]{color:var(--%NS%cor-perigo);font-weight:600}.comparado.abaixo[_ngcontent-%COMP%]{color:var(--%NS%cor-sucesso);font-weight:600}"]})};var rP=(t,n)=>n.id,im=(t,n)=>n.nome,sP=(t,n)=>n.cisp;function cP(t,n){t&1&&A(0,"mat-progress-bar",0)}function lP(t,n){if(t&1&&(f(0,"p"),b(1),u()),t&2){let e=n.$implicit;h(),S(e)}}function dP(t,n){if(t&1&&(f(0,"li",12)(1,"span",21),b(2),u(),f(3,"span",22),A(4,"span"),u(),f(5,"span",23),b(6),u()()),t&2){let e=n.$implicit,i=x(2);R("matTooltip",e.texto),h(2),S(e.nome),h(2),we("width",e.valor,"%")("background",i.corValor(e.valor)),h(2),S(e.valor)}}function uP(t,n){if(t&1&&(f(0,"li"),b(1),u()),t&2){let e=n.$implicit;h(),S(e)}}function mP(t,n){if(t&1&&(f(0,"article",4)(1,"header")(2,"mat-icon"),b(3,"speed"),u(),f(4,"h3"),b(5,"\xCDndice de risco"),u(),f(6,"mat-icon",13),b(7,"info"),u()(),f(8,"div",14),_n(),f(9,"svg",15),A(10,"path",16)(11,"path",17),u(),cr(),f(12,"div",18)(13,"b"),b(14),u(),f(15,"span"),b(16),u()()(),f(17,"ul",19),xe(18,dP,7,7,"li",12,im),u(),f(20,"details",20)(21,"summary"),b(22,"De onde v\xEAm os n\xFAmeros e como chegamos ao \xEDndice"),u(),f(23,"ol"),xe(24,uP,2,1,"li",null,Eo),u()()()),t&2){let e=n,i=x();R("matTooltip",e.dica),h(11),we("stroke",e.cor),Q("stroke-dasharray",i.arco(e.valor)),h(2),we("color",e.cor),h(),S(e.valor),h(2),re("de 100 \xB7 ",e.nivel),h(2),Ce(e.componentes),h(6),Ce(e.metodo)}}function pP(t,n){if(t&1&&(f(0,"small"),b(1),u()),t&2){let e=x().$implicit;h(),S(e.unidade)}}function fP(t,n){if(t&1&&A(0,"app-delta",29),t&2){let e=x().$implicit;R("atual",e.delta[0])("anterior",e.delta[1])}}function hP(t,n){t&1&&(f(0,"mat-icon",30),b(1,"error_outline"),u())}function gP(t,n){if(t&1&&(f(0,"article",24)(1,"div",25)(2,"span",26),b(3),u(),f(4,"span",27),b(5),u()(),f(6,"div",28)(7,"b"),b(8),u(),k(9,pP,2,1,"small"),k(10,fP,1,2,"app-delta",29),k(11,hP,2,0,"mat-icon",30),u(),f(12,"div",31),b(13),u()()),t&2){let e=n.$implicit;Ke("cartao ind "+e.tom+(e.destaque?" destaque":"")),R("matTooltip",e.dica),h(3),S(e.titulo),h(),z("complemento",e.fonte.startsWith("Not\xEDcias")),h(),S(e.fonte),h(3),S(e.valor),h(),N(e.unidade?9:-1),h(),N(e.delta?10:-1),h(),N(e.instavel?11:-1),h(2),S(e.sub)}}function bP(t,n){if(t&1&&(f(0,"section",7)(1,"div",8)(2,"h3",32),b(3," Mortes violentas m\xEAs a m\xEAs \xD7 not\xEDcias "),f(4,"mat-icon",13),b(5,"info"),u()(),f(6,"span",9),b(7),u()(),A(8,"app-grafico",33),u()),t&2){let e=n,i=x();h(7),dt("Sinesp ",e.labels[0],"\u2013",e.labels[e.labels.length-1]," \xB7 not\xEDcias 12 meses"),h(),R("config",i.grafico())}}function vP(t,n){if(t&1&&(f(0,"div",43)(1,"span",44),b(2),u(),f(3,"span",45)(4,"span",46),A(5,"span"),u(),b(6),u(),f(7,"span"),b(8),u(),f(9,"span"),b(10),u(),f(11,"span"),b(12),u()()),t&2){let e=n.$implicit,i=x(3);h(2),re("",e.cisp,"\xAA DP"),h(3),we("width",e.largura,"%"),h(),S(i.fmt(e.letal)),h(),z("perigo",e.letal>e.letalAntes),h(),S(i.fmt(e.letalAntes)),h(2),S(i.fmt(e.roubos)),h(2),S(i.fmt(e.drogas))}}function yP(t,n){if(t&1&&(f(0,"section",7)(1,"div",8)(2,"h3",12)(3,"mat-icon"),b(4,"local_police"),u(),b(5," Por \xE1rea de delegacia "),f(6,"span",27),b(7,"Oficial"),u(),f(8,"mat-icon",13),b(9,"info"),u()(),f(10,"span",9),b(11),u()(),f(12,"div",41)(13,"div",42)(14,"span"),b(15,"\xC1rea"),u(),f(16,"span"),b(17,"Letalidade violenta"),u(),f(18,"span"),b(19,"Antes"),u(),f(20,"span"),b(21,"Roubos de rua"),u(),f(22,"span"),b(23,"Apreens\xE3o de drogas"),u()(),xe(24,vP,13,9,"div",43,sP),u()()),t&2){let e=n;h(2),R("matTooltip","Dado oficial do "+e.fonte+". Cada linha \xE9 a \xE1rea de uma delegacia (CISP). Compara os 12 meses mais recentes publicados com os 12 anteriores."),h(9),dt("ISP-RJ \xB7 ",e.periodo.de," a ",e.periodo.ate),h(13),Ce(e.linhas)}}function _P(t,n){if(t&1&&b(0),t&2){let e=x();dt(" \xB7 ",e.delta>0?"+":"","",e.delta,"% ")}}function xP(t,n){if(t&1&&(f(0,"div")(1,"b"),b(2),u(),f(3,"span"),b(4),k(5,_P,1,2),u()()),t&2){let e=n,i=x(2);h(2),S(i.fmt(e.valor)),h(2),re("ocorr\xEAncias de tr\xE1fico no estado (Sinesp, ",e.rotulo,")"),h(),N(e.delta!==null?5:-1)}}function CP(t,n){if(t&1&&(f(0,"div")(1,"b"),b(2),u(),f(3,"span"),b(4,"apreens\xF5es de drogas na cidade (ISP-RJ, 12 meses)"),u()()),t&2){let e=x(2);h(2),S(e.fmt(n.apreensoes))}}function SP(t,n){if(t&1&&(f(0,"div")(1,"b",37),b(2),u(),f(3,"span"),b(4,"tiroteios em disputa entre grupos armados (Fogo Cruzado)"),u()()),t&2){let e=x(2);h(2),S(e.fmt(e.tf().disputas))}}function wP(t,n){if(t&1&&(f(0,"div",9),b(1),u()),t&2){let e=x(2);h(),re("Grupos citados nas not\xEDcias: ",e.tf().faccoes)}}function EP(t,n){if(t&1&&(f(0,"div",9),b(1),u()),t&2){let e=x(2);h(),re("Bairros com mais not\xEDcias de tr\xE1fico: ",e.tf().bairros)}}function DP(t,n){if(t&1&&(f(0,"div",40)(1,"mat-icon"),b(2,"info"),u(),b(3),u()),t&2){let e=x();h(3),S(e.texto)}}function MP(t,n){if(t&1&&(f(0,"div",9),b(1),u()),t&2){let e=x(2);h(),re("Bairros com mais tiroteios: ",e.bairros)}}function IP(t,n){if(t&1&&(f(0,"div",9),b(1),u()),t&2){let e=x(3);h(),re("Onde as disputas mais acontecem: ",e.bairrosDisputa)}}function kP(t,n){if(t&1&&(f(0,"div",9),b(1),u()),t&2){let e=x(3);h(),re("Motivos registrados: ",e.motivos)}}function NP(t,n){if(t&1&&(f(0,"h4",48)(1,"mat-icon"),b(2,"groups"),u(),b(3," Fac\xE7\xF5es e mil\xEDcias"),u(),f(4,"div",36)(5,"div")(6,"b",37),b(7),u(),f(8,"span"),b(9,"tiroteios em disputa entre grupos armados"),u()(),f(10,"div")(11,"b"),b(12),u(),f(13,"span"),b(14,"mortos nessas disputas"),u()(),f(15,"div")(16,"b"),b(17),u(),f(18,"span"),b(19,"dos tiroteios da cidade"),u()()(),k(20,IP,2,1,"div",9),f(21,"div",36)(22,"div")(23,"b"),b(24),u(),f(25,"span"),b(26,"chacinas (3+ mortos)"),u()(),f(27,"div")(28,"b"),b(29),u(),f(30,"span"),b(31,"agentes mortos / feridos"),u()(),f(32,"div")(33,"b"),b(34),u(),f(35,"span"),b(36,"crian\xE7as e adolescentes atingidos"),u()(),f(37,"div")(38,"b"),b(39),u(),f(40,"span"),b(41,"bala perdida"),u()(),f(42,"div")(43,"b"),b(44),u(),f(45,"span"),b(46,"com transporte interrompido"),u()(),f(47,"div")(48,"b"),b(49),u(),f(50,"span"),b(51,"animais atingidos"),u()()(),k(52,kP,2,1,"div",9),f(53,"div",9),b(54,"No mapa, tiroteios em disputa entre grupos armados t\xEAm borda roxa. O territ\xF3rio de cada fac\xE7\xE3o n\xE3o vem na API do Fogo Cruzado."),u()),t&2){let e=x(2),i=x(2);h(7),S(i.fmt(e.disputas)),h(5),S(i.fmt(e.mortosDisputa)),h(5),S(i.pctTexto(e.disputas,e.total)),h(3),N(e.bairrosDisputa?20:-1),h(4),S(i.fmt(e.chacinas)),h(5),dt("",i.fmt(e.agentesM)," / ",i.fmt(e.agentesF)),h(5),S(i.fmt(e.jovens)),h(5),S(i.fmt(e.balas)),h(5),S(i.fmt(e.transporte)),h(5),S(i.fmt(e.animais)),h(3),N(e.motivos?52:-1)}}function TP(t,n){if(t&1&&(f(0,"div",36)(1,"div")(2,"b"),b(3),u(),f(4,"span"),b(5,"tiroteios"),u()(),f(6,"div")(7,"b",37),b(8),u(),f(9,"span"),b(10,"mortos"),u()(),f(11,"div")(12,"b"),b(13),u(),f(14,"span"),b(15,"feridos"),u()(),f(16,"div")(17,"b"),b(18),u(),f(19,"span"),b(20,"com a\xE7\xE3o policial"),u()()(),k(21,MP,2,1,"div",9),k(22,NP,55,12)),t&2){let e=x(),i=x(2);h(3),S(i.fmt(e.total)),h(5),S(i.fmt(e.mortos)),h(5),S(i.fmt(e.feridos)),h(5),S(i.fmt(e.policia)),h(3),N(e.bairros.length?21:-1),h(),N(e.detalhado?22:-1)}}function AP(t,n){t&1&&(f(0,"section",7)(1,"div",8)(2,"h3",47)(3,"mat-icon"),b(4,"my_location"),u(),b(5," Tiroteios verificados "),f(6,"span",27),b(7,"Fogo Cruzado"),u(),f(8,"mat-icon",13),b(9,"info"),u()(),f(10,"span",9),b(11,"12 meses"),u()(),k(12,DP,4,1,"div",40)(13,TP,23,6),u()),t&2&&(h(12),N(n.texto?12:13))}function OP(t,n){if(t&1){let e=We();f(0,"button",51),V("click",function(){let o=De(e).$implicit,a=x(3);return Me(a.store.focar(o.lat,o.lng,15))}),f(1,"span",44),b(2),u(),f(3,"span",45)(4,"span",46),A(5,"span"),u(),b(6),u(),f(7,"span"),b(8),u(),f(9,"span"),b(10),u(),f(11,"span",52),A(12,"i"),b(13),u()()}if(t&2){let e=n.$implicit,i=x(3);R("matTooltip","Ver "+e.nome+" no mapa"),h(2),S(e.nome),h(3),we("width",i.largura(e.qtd),"%"),h(),S(i.fmt(e.qtd)),h(),z("perigo",e.graves),h(),S(i.fmt(e.graves)),h(2),S(i.fmt(e.recentes)),h(2),we("background",i.cor(e.catTop)),h(),S(i.nomeCat(e.catTop))}}function RP(t,n){if(t&1&&(f(0,"div",39)(1,"div",49)(2,"span"),b(3,"Bairro"),u(),f(4,"span"),b(5,"Not\xEDcias"),u(),f(6,"span"),b(7,"Graves"),u(),f(8,"span"),b(9,"\xDAltimos 30 dias"),u(),f(10,"span"),b(11,"Tipo principal"),u()(),xe(12,OP,14,12,"button",50,im),u()),t&2){let e=x(2);h(12),Ce(e.bairros())}}function PP(t,n){if(t&1&&(f(0,"div",40)(1,"mat-icon"),b(2,"signpost"),u(),b(3),u()),t&2){let e=x(2);h(3),S(e.store.bairrosOsm()?.carregando?"Carregando bairros\u2026":"Nenhuma not\xEDcia dos \xFAltimos 12 meses cita bairro ou tem local preciso.")}}function FP(t,n){if(t&1&&(k(0,yP,26,3,"section",7),f(1,"section",34)(2,"div",8)(3,"h3",35)(4,"mat-icon"),b(5,"local_police"),u(),b(6," Tr\xE1fico de drogas e fac\xE7\xF5es "),f(7,"mat-icon",13),b(8,"info"),u()(),f(9,"span",9),b(10),u()(),f(11,"div",36)(12,"div")(13,"b"),b(14),u(),f(15,"span"),b(16,"not\xEDcias de tr\xE1fico"),u()(),f(17,"div")(18,"b",37),b(19),u(),f(20,"span"),b(21,"not\xEDcias que citam fac\xE7\xE3o ou mil\xEDcia"),u()(),k(22,xP,6,3,"div"),k(23,CP,5,1,"div"),k(24,SP,5,1,"div"),u(),k(25,wP,2,1,"div",9),k(26,EP,2,1,"div",9),f(27,"div",9),b(28),u()(),k(29,AP,14,1,"section",7),f(30,"section",7)(31,"div",8)(32,"h3",38),b(33," Ocorr\xEAncias por bairro "),f(34,"mat-icon",13),b(35,"info"),u()(),f(36,"span",9),b(37),u()(),k(38,RP,14,0,"div",39)(39,PP,4,1,"div",40),u()),t&2){let e,i,o,a,r=x();N((e=r.isp())?0:-1,e),h(10),S(r.tf().periodo),h(4),S(r.fmt(r.tf().noticiasTrafico)),h(5),S(r.fmt(r.tf().noticiasFaccao)),h(3),N((i=r.tf().sinespUf)?22:-1,i),h(),N((o=r.tf().isp)?23:-1,o),h(),N(r.tf().disputas!==null?24:-1),h(),N(r.tf().faccoes?25:-1),h(),N(r.tf().bairros?26:-1),h(2),S(r.tf().aviso),h(),N((a=r.fogo())?29:-1,a),h(8),S(r.resumoBairros()),h(),N(r.bairros().length?38:39)}}function LP(t,n){if(t&1){let e=We();f(0,"button",57),V("click",function(){let o=De(e).$implicit,a=x(2);return Me(a.store.abrirLocal(a.store.uf(),o.nome))}),f(1,"span",44),b(2),u(),f(3,"b"),b(4),u(),f(5,"span"),b(6),u(),f(7,"span"),b(8),u()()}if(t&2){let e=n.$implicit,i=n.$index,o=x(2);h(2),dt("",i+1,". ",e.nome),h(2),S(o.f1(e.taxa)),h(2),S(o.fmt(e.total)),h(2),S(o.fmt(e.anterior))}}function BP(t,n){if(t&1&&(f(0,"section",7)(1,"div",8)(2,"h3",53),b(3," Munic\xEDpios mais violentos "),f(4,"mat-icon",13),b(5,"info"),u()(),f(6,"span",9),b(7,"MVI por 100 mil \xB7 12 meses"),u()(),f(8,"div",54)(9,"div",55)(10,"span"),b(11,"Munic\xEDpio"),u(),f(12,"span"),b(13,"Taxa"),u(),f(14,"span"),b(15,"Casos"),u(),f(16,"span"),b(17,"Antes"),u()(),xe(18,LP,9,5,"button",56,im),u()()),t&2){x();let e=at(0);h(18),Ce(e.municipios)}}function VP(t,n){if(t&1&&(f(0,"li",12),A(1,"i"),f(2,"b"),b(3),u(),f(4,"span"),b(5),u()()),t&2){let e=n.$implicit;R("matTooltip",e.dica),h(),Ke("farol "+e.estado),h(2),S(e.nome),h(2),S(e.detalhe)}}var jP=["#9aa7bb","#5b7bb0","#ee4d2d"],nm=class t{store=p(kt);fmt=T;f1=Ee;cor=Ew;nomeCat=Dw;carregando=P(()=>this.store.carregando()&&(!this.store.dados()||!!this.store.dados().vazio));bairros=P(()=>this.store.bairros12().lista.filter(n=>n.qtd>0).slice(0,15));resumoBairros=P(()=>{let n=this.store.bairros12(),e=this.store.filtrados12().todas.length;return e?`${rn(n.ligadas,e)}% das not\xEDcias ligadas a um bairro \xB7 12 meses`:"12 meses"});isp=P(()=>{let n=this.store.ispCidade();if(!n)return null;let e=n.areas.map(o=>({cisp:o.cisp,letal:o.u12.letalidade_violenta||0,letalAntes:o.a12.letalidade_violenta||0,roubos:o.u12.roubo_rua??o.u12.roubo_transeunte??0,drogas:o.u12.apreensao_drogas||0,largura:0})).sort((o,a)=>a.letal-o.letal).slice(0,15),i=e[0]?.letal||1;return e.forEach(o=>{o.largura=Math.max(4,o.letal/i*100)}),{fonte:n.fonte,periodo:n.periodo,linhas:e}});tf=P(()=>{let n=this.store.filtrados(),e=this.store.periodoDias(),i=n.todas.filter(w=>w.cat==="TRAFICO"),o={},a=0;for(let w of n.todas){let E=Oe(w.titulo),U=HP.filter(F=>F.re.test(E)).map(F=>F.nome);U.length&&(a++,U.forEach(F=>o[F]=(o[F]||0)+1))}let r={};i.forEach(w=>{w.bairro&&w.bairro!=="Local n\xE3o informado"&&(r[w.bairro]=(r[w.bairro]||0)+1)});let s=(w,E)=>Object.entries(w).sort((U,F)=>F[1]-U[1]).slice(0,E).map(([U,F])=>`${U} (${F})`).join(", "),c=this.store.panorama(),d=c?.uf===this.store.uf()?qu(c.oficial||null,Wu(e)):null,l=d?.eventos.find(w=>/^tr[aá]fico de drogas/i.test(w.nome)),m=l?l.sel??l.porAno[2]:null,v=l?l.selAnterior??l.parcialAnterior:null,g=this.store.ispCidade(),y=this.store.fogoCidade()?.dado,_=!!y?.itens.some(w=>w.gp!==void 0),C=Kg.includes(this.store.uf());return{periodo:e>=365?"12 meses":e>=180?"6 meses":e+" dias",noticiasTrafico:i.length,noticiasFaccao:a,faccoes:s(o,8),bairros:s(r,6),sinespUf:l&&m!=null?{valor:m,rotulo:d?.rotuloSel||"ano",delta:Mi(m,v)}:null,isp:g?.areas?.length?{apreensoes:g.areas.reduce((w,E)=>w+(E.u12.apreensao_drogas||0),0)}:null,disputas:_?y.itens.filter(w=>w.gp).length:null,aviso:"O Sinesp n\xE3o publica tr\xE1fico por munic\xEDpio, s\xF3 por estado. "+(g?"No RJ, o ISP publica apreens\xF5es de drogas por delegacia. ":"")+(_?'Disputas entre fac\xE7\xF5es/mil\xEDcia v\xEAm do Fogo Cruzado (motivo "Disputa"). ':C?"Disputas entre fac\xE7\xF5es aparecem aqui depois de recopiar 7_Fontes_Area no Apps Script. ":"O Fogo Cruzado cobre s\xF3 Rio, Recife, Salvador e Bel\xE9m (regi\xF5es metropolitanas). ")+"Os grupos citados v\xEAm das manchetes das not\xEDcias."}});fogo=P(()=>{let n=this.store.fogoCidade();if(!n)return null;let e={total:0,mortos:0,feridos:0,policia:0,bairros:"",detalhado:!1};if(n.carregando)return W(I({},e),{texto:"Carregando tiroteios do Fogo Cruzado\u2026"});let i=n.dado;if(!i)return null;if(!i.configurado)return W(I({},e),{texto:"Fonte dispon\xEDvel para esta cidade. Falta gravar a conta do Fogo Cruzado nas propriedades do script (FOGO_CRUZADO_EMAIL e FOGO_CRUZADO_SENHA)."});if(i.erro)return W(I({},e),{texto:"Fogo Cruzado n\xE3o respondeu agora: "+i.erro});let o={};i.itens.forEach(r=>{r.bairro&&(o[r.bairro]=(o[r.bairro]||0)+1)});let a=Object.entries(o).sort((r,s)=>s[1]-r[1]).slice(0,5).map(([r,s])=>`${r} (${s})`).join(", ");return I({texto:i.itens.length?"":"Nenhum tiroteio registrado nos \xFAltimos 12 meses.",total:i.itens.length,mortos:i.itens.reduce((r,s)=>r+s.mortos,0),feridos:i.itens.reduce((r,s)=>r+s.feridos,0),policia:i.itens.filter(r=>r.policia).length,bairros:a},zP(i.itens))});pctTexto(n,e){return e?Math.round(n/e*100)+"%":"\u2014"}arco(n){let e=Math.PI*50;return`${e*n/100} ${e}`}corValor(n){return n>=75?"#b91c1c":n>=55?"#ea580c":n>=35?"#ca8a04":"#16a34a"}largura(n){let e=this.bairros()[0]?.qtd||1;return Math.max(4,n/e*100)}grafico=P(()=>{let n=this.store.compilado().serie,e=+("20"+n.labels[0].split("/")[1]);return{type:"bar",data:{labels:n.labels,datasets:[{type:"bar",label:"Mortes violentas (Sinesp)",data:n.mvi,yAxisID:"y",borderRadius:2,maxBarThickness:18,backgroundColor:n.labels.map(i=>jP[Math.min(2,+("20"+i.split("/")[1])-e)])},{type:"line",label:"Not\xEDcias (complemento)",data:n.noticias,yAxisID:"y1",borderColor:"#f59e0b",backgroundColor:"#f59e0b",borderWidth:2,pointRadius:2,spanGaps:!1,tension:.3}]},options:{plugins:{legend:{position:"bottom"}},scales:{x:{grid:{display:!1},ticks:{maxRotation:0,autoSkip:!0,maxTicksLimit:12}},y:{beginAtZero:!0,ticks:{precision:0},title:{display:!0,text:"Sinesp"}},y1:{position:"right",beginAtZero:!0,ticks:{precision:0},grid:{display:!1},title:{display:!0,text:"Not\xEDcias"}}}}}});static \u0275fac=function(e){return new(e||t)};static \u0275cmp=H({type:t,selectors:[["app-panorama"]],decls:38,vars:6,consts:[["mode","indeterminate"],[1,"topo"],[1,"cartao","parecer"],["matTooltip","Texto gerado por regras a partir do Sinesp, ISP-RJ, Fogo Cruzado, IBGE e not\xEDcias. Atualiza a cada consulta.",1,"selo"],["matTooltipClass","dica-larga",1,"cartao","risco",3,"matTooltip"],[1,"grade"],["matTooltipClass","dica-larga","tabindex","0",1,"cartao","ind",3,"class","matTooltip"],[1,"cartao"],[1,"titulo-bloco"],[1,"nota"],[3,"itens"],[1,"fontes"],[3,"matTooltip"],[1,"info"],[1,"medidor"],["viewBox","0 0 120 68","aria-hidden","true"],["d","M10 62 A50 50 0 0 1 110 62",1,"trilho"],["d","M10 62 A50 50 0 0 1 110 62",1,"arco"],[1,"valor"],[1,"componentes"],[1,"metodo"],[1,"k-nome"],[1,"k-barra"],[1,"k-num"],["matTooltipClass","dica-larga","tabindex","0",1,"cartao","ind",3,"matTooltip"],[1,"ind-topo"],[1,"ind-titulo"],[1,"fonte"],[1,"ind-valor"],[3,"atual","anterior"],["matTooltip","Poucos casos: a varia\xE7\xE3o percentual oscila muito",1,"instavel"],[1,"ind-sub"],["matTooltip","Barras: mortes violentas intencionais por m\xEAs no Sinesp (homic\xEDdio doloso, latroc\xEDnio e les\xE3o corporal seguida de morte). Linha: ocorr\xEAncias noticiadas no mesmo m\xEAs (eixo da direita)."],["rotulo","Mortes violentas intencionais por m\xEAs e not\xEDcias",1,"alto",3,"config"],[1,"cartao","trafico"],["matTooltip","Junta tudo o que existe sobre drogas e grupos criminosos para o local escolhido: not\xEDcias (todas as cidades), Sinesp (s\xF3 por estado), ISP (RJ, por delegacia) e Fogo Cruzado (Rio, Recife, Salvador e Bel\xE9m)."],[1,"fc"],[1,"perigo"],["matTooltip","Ocorr\xEAncias noticiadas nos \xFAltimos 12 meses ligadas a cada bairro (pelo contorno do bairro ou pelo nome citado). Contornos oficiais do IBGE (Censo 2022); onde o IBGE n\xE3o tem, OpenStreetMap. Clique para ver no mapa."],["role","table","aria-label","Ocorr\xEAncias por bairro",1,"tabela"],[1,"vazio","pequeno"],["role","table","aria-label","Ocorr\xEAncias por \xE1rea de delegacia",1,"tabela"],["role","row",1,"linha","cabeca","d"],["role","row",1,"linha","d"],[1,"b-nome"],[1,"b-qtd"],[1,"barra"],["matTooltip","Tiroteios registrados e checados pelo Instituto Fogo Cruzado, com local exato, nos \xFAltimos 12 meses. Aparecem no mapa como pontos vermelhos com borda preta."],["matTooltip","Tiroteios que o Fogo Cruzado classificou como disputa entre fac\xE7\xF5es e/ou mil\xEDcia (sem agentes de seguran\xE7a em servi\xE7o), ou com motivo complementar ligado a fac\xE7\xE3o, mil\xEDcia ou tr\xE1fico.",1,"sub-bloco"],["role","row",1,"linha","cabeca"],["type","button","role","row",1,"linha",3,"matTooltip"],["type","button","role","row",1,"linha",3,"click","matTooltip"],[1,"tipo"],["matTooltip","Taxa de mortes violentas intencionais por 100 mil habitantes nos \xFAltimos 12 meses, s\xF3 munic\xEDpios com 20 mil habitantes ou mais."],["role","table",1,"tabela"],["role","row",1,"linha","cabeca","m"],["type","button","role","row",1,"linha","m"],["type","button","role","row",1,"linha","m",3,"click"]],template:function(e,i){if(e&1&&(Ln(0),k(1,cP,1,0,"mat-progress-bar",0),f(2,"section",1)(3,"article",2)(4,"header")(5,"mat-icon"),b(6,"summarize"),u(),f(7,"h3"),b(8,"Parecer"),u(),f(9,"span",3),b(10,"autom\xE1tico"),u()(),xe(11,lP,2,1,"p",null,Eo),u(),k(13,mP,26,8,"article",4),u(),f(14,"section",5),xe(15,gP,14,12,"article",6,rP),u(),k(17,bP,9,3,"section",7),k(18,FP,40,13)(19,BP,20,0,"section",7),f(20,"section",7)(21,"div",8)(22,"h3")(23,"mat-icon"),b(24,"auto_awesome"),u(),b(25," Insights"),u(),f(26,"span",9),b(27,"oficiais primeiro"),u()(),A(28,"app-insights",10),u(),f(29,"section",7)(30,"div",8)(31,"h3")(32,"mat-icon"),b(33,"dataset"),u(),b(34," Fontes e atualiza\xE7\xE3o"),u()(),f(35,"ul",11),xe(36,VP,6,5,"li",12,im),u()()),e&2){let o,a,r=ei(i.store.compilado());h(),N(i.carregando()?1:-1),h(10),Ce(r.parecer),h(2),N((o=r.risco)?13:-1,o),h(2),Ce(r.indicadores),h(2),N((a=r.serie)?17:-1,a),h(),N(i.store.escopo()==="CIDADE"?18:r.municipios.length?19:-1),h(10),R("itens",i.store.insights()),h(8),Ce(r.fontes)}},dependencies:[It,jt,Di,oo,jo,ns,Un,Vo,is],styles:["[_nghost-%COMP%]{display:grid;gap:12px}.topo[_ngcontent-%COMP%]{display:grid;gap:12px;grid-template-columns:1fr}@container painel (min-width: 760px){.topo[_ngcontent-%COMP%]{grid-template-columns:minmax(0,1.6fr) minmax(260px,1fr)}}header[_ngcontent-%COMP%]{display:flex;align-items:center;gap:8px;margin-bottom:6px}header[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%]{color:var(--%NS%mat-sys-primary)}h3[_ngcontent-%COMP%]{font:var(--%NS%mat-sys-title-medium);margin:0;display:inline-flex;align-items:center;gap:6px}.info[_ngcontent-%COMP%]{font-size:16px;width:16px;height:16px;color:var(--%NS%mat-sys-on-surface-variant);cursor:help}.selo[_ngcontent-%COMP%]{margin-left:auto;font:var(--%NS%mat-sys-label-small);background:var(--%NS%mat-sys-secondary-container);color:var(--%NS%mat-sys-on-secondary-container);border-radius:6px;padding:2px 8px;cursor:help}.parecer[_ngcontent-%COMP%]   p[_ngcontent-%COMP%]{margin:0 0 6px;font:var(--%NS%mat-sys-body-medium);line-height:1.55}.risco[_ngcontent-%COMP%]{cursor:help}.metodo[_ngcontent-%COMP%]{margin-top:10px;font:var(--%NS%mat-sys-body-small);color:var(--%NS%mat-sys-on-surface-variant);cursor:auto}.metodo[_ngcontent-%COMP%]   summary[_ngcontent-%COMP%]{cursor:pointer;color:var(--%NS%mat-sys-primary);font-weight:600}.metodo[_ngcontent-%COMP%]   ol[_ngcontent-%COMP%]{margin:6px 0 0;padding-left:18px;display:grid;gap:4px}.medidor[_ngcontent-%COMP%]{display:flex;align-items:center;gap:12px}.medidor[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%]{width:130px;flex:none}.trilho[_ngcontent-%COMP%], .arco[_ngcontent-%COMP%]{fill:none;stroke-width:11;stroke-linecap:round}.trilho[_ngcontent-%COMP%]{stroke:var(--%NS%mat-sys-surface-container-highest)}.valor[_ngcontent-%COMP%]{display:flex;flex-direction:column}.valor[_ngcontent-%COMP%]   b[_ngcontent-%COMP%]{font:var(--%NS%mat-sys-display-small);font-weight:700;line-height:1}.valor[_ngcontent-%COMP%]   span[_ngcontent-%COMP%]{font:var(--%NS%mat-sys-label-large);color:var(--%NS%mat-sys-on-surface-variant)}.componentes[_ngcontent-%COMP%]{list-style:none;margin:8px 0 0;padding:0;display:grid;gap:5px}.componentes[_ngcontent-%COMP%]   li[_ngcontent-%COMP%]{display:grid;grid-template-columns:minmax(0,1.4fr) 1fr 28px;gap:8px;align-items:center;font:var(--%NS%mat-sys-body-small)}.k-nome[_ngcontent-%COMP%]{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.k-barra[_ngcontent-%COMP%]{height:7px;border-radius:4px;background:var(--%NS%mat-sys-surface-container-highest);overflow:hidden}.k-barra[_ngcontent-%COMP%]   span[_ngcontent-%COMP%]{display:block;height:100%;border-radius:4px}.k-num[_ngcontent-%COMP%]{text-align:right;font-variant-numeric:tabular-nums;font-weight:600}.grade[_ngcontent-%COMP%]{display:grid;grid-template-columns:repeat(auto-fill,minmax(210px,1fr));gap:10px}.ind[_ngcontent-%COMP%]{display:flex;flex-direction:column;gap:4px;cursor:help;border-top:3px solid var(--%NS%mat-sys-outline-variant)}.ind.alerta[_ngcontent-%COMP%]{border-top-color:var(--%NS%cor-perigo)}.ind.positivo[_ngcontent-%COMP%]{border-top-color:var(--%NS%cor-sucesso)}.ind.destaque[_ngcontent-%COMP%]{background:color-mix(in srgb,var(--%NS%cor-perigo) 6%,var(--%NS%mat-sys-surface-container-low))}.ind[_ngcontent-%COMP%]:focus-visible{outline:2px solid var(--%NS%mat-sys-primary);outline-offset:2px}.ind-topo[_ngcontent-%COMP%]{display:flex;justify-content:space-between;gap:6px;align-items:flex-start}.ind-titulo[_ngcontent-%COMP%]{font:var(--%NS%mat-sys-title-small)}.fonte[_ngcontent-%COMP%]{flex:none;font:var(--%NS%mat-sys-label-small);background:var(--%NS%mat-sys-primary-container);color:var(--%NS%mat-sys-on-primary-container);border-radius:4px;padding:1px 6px}.fonte.complemento[_ngcontent-%COMP%]{background:var(--%NS%mat-sys-surface-container-highest);color:var(--%NS%mat-sys-on-surface-variant)}.ind-valor[_ngcontent-%COMP%]{display:flex;align-items:center;gap:8px;flex-wrap:wrap}.ind-valor[_ngcontent-%COMP%]   b[_ngcontent-%COMP%]{font:var(--%NS%mat-sys-headline-medium);font-weight:600;font-variant-numeric:tabular-nums}.ind-valor[_ngcontent-%COMP%]   small[_ngcontent-%COMP%]{font:var(--%NS%mat-sys-label-large);color:var(--%NS%mat-sys-on-surface-variant)}.instavel[_ngcontent-%COMP%]{font-size:18px;width:18px;height:18px;color:var(--%NS%mat-sys-on-surface-variant)}.ind-sub[_ngcontent-%COMP%]{font:var(--%NS%mat-sys-body-small);color:var(--%NS%mat-sys-on-surface-variant)}.titulo-bloco[_ngcontent-%COMP%]{display:flex;align-items:baseline;justify-content:space-between;gap:8px;margin-bottom:8px;flex-wrap:wrap}.titulo-bloco[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%]:not(.info){color:var(--%NS%mat-sys-primary);font-size:20px;width:20px;height:20px}app-grafico.alto[_ngcontent-%COMP%]{height:260px}.tabela[_ngcontent-%COMP%]{display:grid}.linha[_ngcontent-%COMP%]{display:grid;grid-template-columns:minmax(0,1.6fr) minmax(90px,1.2fr) 60px 70px minmax(0,1fr);gap:8px;align-items:center;padding:7px 6px;border:0;border-bottom:1px solid var(--%NS%mat-sys-outline-variant);background:none;color:inherit;font:var(--%NS%mat-sys-body-medium);text-align:left;cursor:pointer;font-variant-numeric:tabular-nums}.linha.m[_ngcontent-%COMP%]{grid-template-columns:minmax(0,2fr) 70px 60px 60px}.linha.d[_ngcontent-%COMP%]{grid-template-columns:minmax(0,1fr) minmax(90px,1.4fr) 60px 80px 90px;cursor:default}.fc[_ngcontent-%COMP%]{display:grid;grid-template-columns:repeat(auto-fit,minmax(110px,1fr));gap:8px;margin-bottom:6px}.fc[_ngcontent-%COMP%]   span[_ngcontent-%COMP%]{font:var(--%NS%mat-sys-body-small);color:var(--%NS%mat-sys-on-surface-variant)}.sub-bloco[_ngcontent-%COMP%]{display:flex;align-items:center;gap:6px;margin:12px 0 6px;font:var(--%NS%mat-sys-title-small)}.sub-bloco[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%]{font-size:18px;width:18px;height:18px}.fc[_ngcontent-%COMP%]   div[_ngcontent-%COMP%]{display:flex;flex-direction:column}.fc[_ngcontent-%COMP%]   b[_ngcontent-%COMP%]{font:var(--%NS%mat-sys-headline-small);font-weight:600;font-variant-numeric:tabular-nums}.fc[_ngcontent-%COMP%]   span[_ngcontent-%COMP%]{font:var(--%NS%mat-sys-label-medium);color:var(--%NS%mat-sys-on-surface-variant)}h3[_ngcontent-%COMP%]   .fonte[_ngcontent-%COMP%]{margin-left:4px;vertical-align:middle}.linha[_ngcontent-%COMP%]:hover{background:var(--%NS%mat-sys-surface-container)}.linha.cabeca[_ngcontent-%COMP%]{cursor:default;font:var(--%NS%mat-sys-label-medium);color:var(--%NS%mat-sys-on-surface-variant)}.linha.cabeca[_ngcontent-%COMP%]:hover{background:none}.b-nome[_ngcontent-%COMP%]{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-weight:500}.b-qtd[_ngcontent-%COMP%]{display:flex;align-items:center;gap:6px}.barra[_ngcontent-%COMP%]{flex:1;height:8px;border-radius:4px;background:var(--%NS%mat-sys-surface-container-high);overflow:hidden}.barra[_ngcontent-%COMP%]   span[_ngcontent-%COMP%]{display:block;height:100%;background:linear-gradient(90deg,#f59e0b,#dc2626);border-radius:4px}.perigo[_ngcontent-%COMP%]{color:var(--%NS%cor-perigo);font-weight:600}.tipo[_ngcontent-%COMP%]{display:flex;align-items:center;gap:5px;overflow:hidden;white-space:nowrap;text-overflow:ellipsis}.tipo[_ngcontent-%COMP%]   i[_ngcontent-%COMP%]{width:9px;height:9px;border-radius:50%;flex:none}@container painel (max-width: 560px){.linha[_ngcontent-%COMP%]{grid-template-columns:minmax(0,1.4fr) minmax(80px,1fr) 50px}.linha[_ngcontent-%COMP%] > [_ngcontent-%COMP%]:nth-child(n+4){display:none}}.fontes[_ngcontent-%COMP%]{list-style:none;margin:0;padding:0;display:grid;gap:6px}.fontes[_ngcontent-%COMP%]   li[_ngcontent-%COMP%]{display:grid;grid-template-columns:12px minmax(0,1fr) auto;gap:8px;align-items:center;font:var(--%NS%mat-sys-body-small);cursor:help}.fontes[_ngcontent-%COMP%]   li[_ngcontent-%COMP%]   span[_ngcontent-%COMP%]{color:var(--%NS%mat-sys-on-surface-variant);text-align:right}.farol[_ngcontent-%COMP%]{width:10px;height:10px;border-radius:50%}.farol.ok[_ngcontent-%COMP%]{background:var(--%NS%cor-sucesso)}.farol.parcial[_ngcontent-%COMP%]{background:#eab308}.farol.sem[_ngcontent-%COMP%]{background:var(--%NS%mat-sys-outline)}"]})};function zP(t){let n=t.some(o=>o.gp!==void 0),e=t.filter(o=>o.gp),i=o=>{let a={};return o.forEach(r=>{r&&(a[r]=(a[r]||0)+1)}),Object.entries(a).sort((r,s)=>s[1]-r[1])};return{detalhado:n,disputas:e.length,mortosDisputa:e.reduce((o,a)=>o+a.mortos,0),bairrosDisputa:i(e.map(o=>o.bairro)).slice(0,6).map(([o,a])=>`${o} (${a})`).join(", "),chacinas:t.filter(o=>o.ch).length,agentesM:t.reduce((o,a)=>o+(a.ag?.m||0),0),agentesF:t.reduce((o,a)=>o+(a.ag?.f||0),0),jovens:t.reduce((o,a)=>o+(a.cr||0),0),balas:t.filter(o=>o.bp).length,transporte:t.filter(o=>o.tr?.length).length,animais:t.reduce((o,a)=>o+(a.an||0),0),motivos:i(t.map(o=>o.motivo)).slice(0,6).map(([o,a])=>`${o} (${a})`).join(", ")}}var HP=[{nome:"PCC",re:/\bpcc\b|primeiro comando da capital/},{nome:"Comando Vermelho",re:/comando vermelho|\bcv\b/},{nome:"Terceiro Comando Puro",re:/terceiro comando|\btcp\b/},{nome:"Amigos dos Amigos",re:/amigos dos amigos/},{nome:"Mil\xEDcia",re:/\bmilicia|\bmilicianos?\b/},{nome:"Os Manos",re:/\bos manos\b/},{nome:"Bala na Cara",re:/bala na cara/},{nome:"Guardi\xF5es do Estado (GDE)",re:/guardioes do estado|\bgde\b/},{nome:"Sindicato do Crime",re:/sindicato do crime/},{nome:"Fam\xEDlia do Norte",re:/familia do norte|\bfdn\b/},{nome:"Bonde do Maluco",re:/bonde do maluco|\bbdm\b/},{nome:"PGC",re:/primeiro grupo catarinense|\bpgc\b/},{nome:"Comando Classe A",re:/comando classe a/},{nome:"Fac\xE7\xE3o (sem nome)",re:/\bfac(c|ç)(ao|oes)\b/}];var $P=(t,n)=>n.rank,UP=(t,n)=>n.id;function GP(t,n){if(t&1&&b(0),t&2){let e=x(2),i=at(0);re("; ",e.fmt(i.duplicadasFogo)," not\xEDcias do mesmo caso n\xE3o foram contadas de novo")}}function WP(t,n){if(t&1&&(b(0),k(1,GP,1,1),b(2,". ")),t&2){let e=x(),i=at(0);re(" Inclui ",e.fmt(i.tiroteiosZonas)," tiroteios verificados pelo Fogo Cruzado"),h(),N(i.duplicadasFogo?1:-1)}}function qP(t,n){if(t&1&&(f(0,"small"),b(1),u()),t&2){let e=x().$implicit;h(),S(e.cidade)}}function YP(t,n){if(t&1&&(f(0,"span",11)(1,"b"),b(2),u(),b(3," homic\xEDdio/tiroteio"),u()),t&2){let e=x().$implicit,i=x();h(2),S(i.fmt(e.graves))}}function ZP(t,n){if(t&1&&(f(0,"span",14),b(1),u()),t&2){let e=n.$implicit,i=x(2);we("color",i.corCat(e.id)),h(),dt("",i.curtoCat(e.id)," ",e.qtd)}}function KP(t,n){if(t&1){let e=We();f(0,"button",4),V("click",function(){let o=De(e).$implicit,a=x();return Me(a.store.focar(o.lat,o.lng,16,o.raio))}),f(1,"div",5)(2,"span",6),b(3),u(),f(4,"div",7)(5,"b"),b(6),u(),k(7,qP,2,1,"small"),u(),f(8,"span",8),b(9),u()(),f(10,"div",9),A(11,"span"),u(),f(12,"div",10)(13,"span")(14,"b"),b(15),u(),b(16," ocorr\xEAncias"),u(),k(17,YP,4,1,"span",11),f(18,"span"),b(19),u(),f(20,"span"),b(21),u()(),f(22,"div",10),xe(23,ZP,2,4,"span",12,UP),f(25,"span",13),b(26,"Ver no mapa "),f(27,"span",1),b(28,"arrow_forward"),u()()()()}if(t&2){let e=n.$implicit,i=x();h(2),we("background",i.cor(e)),h(),S(e.rank),h(3),S(e.nome),h(),N(i.store.escopo()==="ESTADO"?7:-1),h(),we("color",i.cor(e))("border-color",i.cor(e)),h(),S(i.nomeNivel(e)),h(2),we("width",e.indice,"%")("background",i.cor(e)),h(4),S(i.fmt(e.qtd)),h(2),N(e.graves?17:-1),h(2),re("\xCDndice ",e.indice),h(2),re("30 dias: ",e.recentes>e.anteriores30?"\u2191 em alta":e.recentes<e.anteriores30?"\u2193 em queda":"est\xE1vel"),h(2),Ce(e.cats.slice(0,3))}}function XP(t,n){if(t&1&&(f(0,"div",3)(1,"mat-icon"),b(2,"verified_user"),u(),b(3),u()),t&2){let e=x(),i=at(0);h(3),re(" ",i.precisas.length+(i.tiroteiosZonas||0)<e.minimo?"Poucas ocorr\xEAncias com local preciso no per\xEDodo ("+(i.precisas.length+(i.tiroteiosZonas||0))+"). Amplie o per\xEDodo para 6 ou 12 meses.":"As ocorr\xEAncias est\xE3o dispersas: nenhuma \xE1rea concentra registros suficientes."," ")}}var om=class t{store=p(kt);fmt=T;minimo=fe.ZONA_MIN_OCORRENCIAS;periodo=()=>Zr(this.store.periodoDias());cor=n=>Vu[n.nivel];nomeNivel=n=>ju[n.nivel];corCat=n=>vt[n].cor;curtoCat=n=>vt[n].curto;static \u0275fac=function(e){return new(e||t)};static \u0275cmp=H({type:t,selectors:[["app-zonas"]],decls:9,vars:4,consts:[[1,"nota"],[1,"material-symbols-outlined"],["type","button",1,"cartao","zona"],[1,"vazio"],["type","button",1,"cartao","zona",3,"click"],[1,"topo"],[1,"numero"],[1,"nome"],[1,"nivel"],[1,"barra"],[1,"meta"],[1,"perigo"],[1,"tag",3,"color"],[1,"ver"],[1,"tag"]],template:function(e,i){if(e&1&&(Ln(0),f(1,"p",0)(2,"span",1),b(3,"info"),u(),b(4),k(5,WP,3,2),u(),xe(6,KP,29,18,"button",2,$P,!1,XP,4,1,"div",3)),e&2){let o=ei(i.store.filtrados());h(4),re(" \xC1reas com maior concentra\xE7\xE3o de ocorr\xEAncias nos \xFAltimos ",i.periodo(),", ponderadas pela gravidade e pela data. \xCDndice 100 = zona mais intensa do local."),h(),N(o.tiroteiosZonas?5:-1),h(),Ce(o.zonas)}},dependencies:[It,jt],styles:["[_nghost-%COMP%]{display:grid;gap:10px}.nota[_ngcontent-%COMP%]{display:flex;gap:6px;align-items:flex-start;margin:0}.nota[_ngcontent-%COMP%]   .material-symbols-outlined[_ngcontent-%COMP%]{font-size:18px}.zona[_ngcontent-%COMP%]{text-align:left;font:inherit;color:inherit;cursor:pointer;display:grid;gap:8px}.zona[_ngcontent-%COMP%]:hover{border-color:var(--%NS%mat-sys-outline)}.topo[_ngcontent-%COMP%]{display:flex;align-items:center;gap:10px}.numero[_ngcontent-%COMP%]{width:28px;height:28px;border-radius:50%;color:#fff;display:grid;place-items:center;font-weight:700;flex:none}.nome[_ngcontent-%COMP%]{flex:1;min-width:0;display:flex;flex-direction:column}.nome[_ngcontent-%COMP%]   small[_ngcontent-%COMP%]{color:var(--%NS%mat-sys-on-surface-variant)}.nivel[_ngcontent-%COMP%]{font:var(--%NS%mat-sys-label-medium);border:1px solid;border-radius:999px;padding:1px 8px}.barra[_ngcontent-%COMP%]{height:6px;background:var(--%NS%mat-sys-surface-container-high);border-radius:3px;overflow:hidden}.barra[_ngcontent-%COMP%]   span[_ngcontent-%COMP%]{display:block;height:100%}.meta[_ngcontent-%COMP%]{display:flex;flex-wrap:wrap;gap:6px 14px;font:var(--%NS%mat-sys-body-small);align-items:center}.perigo[_ngcontent-%COMP%]{color:var(--%NS%cor-perigo)}.ver[_ngcontent-%COMP%]{margin-left:auto;color:var(--%NS%mat-sys-primary);font-weight:600;display:inline-flex;align-items:center;gap:2px}.ver[_ngcontent-%COMP%]   .material-symbols-outlined[_ngcontent-%COMP%]{font-size:16px}"]})};var QP=["corpo"],JP=["busca"],eF=(t,n)=>n.rotulo+n.detalhe,Vw=(t,n)=>n.id,tF=(t,n)=>n.rotulo,nF=(t,n)=>n.dias;function iF(t,n){if(t&1&&(f(0,"mat-option",11)(1,"span"),b(2),u(),f(3,"small",30),b(4),u()()),t&2){let e=n.$implicit;R("value",e),h(2),S(e.rotulo),h(2),S(e.detalhe)}}function oF(t,n){if(t&1&&(f(0,"mat-option",11),b(1),u()),t&2){let e=n.$implicit,i=x();R("value",e),h(),dt("",e," \xB7 ",i.estados[e].nome)}}function aF(t,n){if(t&1){let e=We();f(0,"app-tour",31),V("fechar",function(){De(e);let o=x();return Me(o.fecharTour())}),u()}}function rF(t,n){if(t&1&&(f(0,"div",27)(1,"mat-icon"),b(2),u(),f(3,"div")(4,"b"),b(5),u(),f(6,"span"),b(7),u()()()),t&2){let e=n;h(2),S(e.icone),h(3),S(e.titulo),h(2),S(e.texto)}}function sF(t,n){if(t&1&&A(0,"app-delta",37),t&2){let e=x().$implicit;R("atual",e.delta[0])("anterior",e.delta[1])}}function cF(t,n){if(t&1&&(f(0,"div",33)(1,"span",35)(2,"mat-icon"),b(3,"verified"),u(),b(4),u(),f(5,"b"),b(6),u(),f(7,"span",36),k(8,sF,1,2,"app-delta",37),b(9),u()()),t&2){let e=n.$implicit;h(),R("title",e.rotulo),h(3),S(e.rotulo),h(),we("color",e.cor||null),h(),S(e.valor),h(2),N(e.delta?8:-1),h(),re(" ",e.sub," ")}}function lF(t,n){if(t&1&&(f(0,"div",32),xe(1,cF,10,7,"div",33,tF),u(),f(3,"p",34),b(4),u()),t&2){let e=x();h(),Ce(e.kpis()),h(3),dt("Sinesp/MJSP (pol\xEDcias do estado, PRF e PF) \xB7 ",e.periodoOficial(),". ",e.notaMortes()," Not\xEDcias entram s\xF3 como complemento.")}}function dF(t,n){if(t&1&&(f(0,"mat-button-toggle",11),b(1),u()),t&2){let e=n.$implicit;R("value",e.dias),h(),S(e.rotulo)}}function uF(t,n){if(t&1){let e=We();f(0,"mat-chip",43),V("click",function(){let o=De(e).$implicit,a=x(2);return Me(a.store.alternarCategoria(o.id))}),A(1,"i",44),b(2),u()}if(t&2){let e=n.$implicit,i=x(2);R("highlighted",i.store.categorias().includes(e.id))("matTooltip",e.nome),h(),we("background",e.cor),h(),re("",e.curto," ")}}function mF(t,n){if(t&1){let e=We();f(0,"mat-chip",45),V("removed",function(){De(e);let o=x(2);return Me(o.store.definirOrgao(""))}),A(1,"i",44),b(2),f(3,"button",46)(4,"mat-icon"),b(5,"cancel"),u()()()}if(t&2){let e=n;h(),we("background",e.cor),h(),re("",e.curto," ")}}function pF(t,n){if(t&1){let e=We();f(0,"div",28)(1,"mat-button-toggle-group",38),V("change",function(o){De(e);let a=x();return Me(a.store.periodoDias.set(o.value))}),xe(2,dF,2,2,"mat-button-toggle",11,nF),u(),f(4,"mat-chip-set",39)(5,"mat-chip",40),V("click",function(){De(e);let o=x();return Me(o.store.alternarCategoria(""))}),b(6,"Todos"),u(),xe(7,uF,3,5,"mat-chip",41,Vw),k(9,mF,6,3,"mat-chip",42),u()()}if(t&2){let e,i=x();h(),R("value",i.store.periodoDias()),h(),Ce(i.periodos),h(3),R("highlighted",!i.store.categorias().length),h(2),Ce(i.categorias),h(2),N((e=i.orgaoAtivo())?9:-1,e)}}function fF(t,n){if(t&1&&(f(0,"span",50),b(1),u()),t&2){let e=x(3);h(),S(e.contagem().zonas)}}function hF(t,n){if(t&1&&(f(0,"span",50),b(1),u()),t&2){let e=x(3);h(),S(e.contagem().noticias)}}function gF(t,n){if(t&1&&(f(0,"mat-icon",49),b(1),u(),b(2),k(3,fF,2,1,"span",50),k(4,hF,2,1,"span",50)),t&2){let e=x().$implicit,i=x();h(),S(e.icone),h(),re("",e.rotulo," "),h(),N(e.id==="ZONAS"&&i.contagem().zonas?3:-1),h(),N(e.id==="NOTICIAS"?4:-1)}}function bF(t,n){t&1&&A(0,"app-panorama")}function vF(t,n){t&1&&A(0,"app-oficial")}function yF(t,n){t&1&&A(0,"app-estado")}function _F(t,n){t&1&&A(0,"app-zonas")}function xF(t,n){t&1&&A(0,"app-geral")(1,"app-noticias")}function CF(t,n){if(t&1&&(f(0,"div",51),k(1,bF,1,0,"app-panorama")(2,vF,1,0,"app-oficial")(3,yF,1,0,"app-estado")(4,_F,1,0,"app-zonas")(5,xF,2,0),u()),t&2){let e,i=x().$implicit;h(),N((e=i.id)==="PANORAMA"?1:e==="OFICIAL"?2:e==="ESTADO"?3:e==="ZONAS"?4:e==="NOTICIAS"?5:-1)}}function SF(t,n){t&1&&(f(0,"mat-tab"),tn(1,gF,5,4,"ng-template",47)(2,CF,6,1,"ng-template",48),u())}var Lw=[{id:"PANORAMA",rotulo:"Panorama",icone:"space_dashboard"},{id:"OFICIAL",rotulo:"Dados oficiais",icone:"account_balance"},{id:"ESTADO",rotulo:"Estado",icone:"map"},{id:"ZONAS",rotulo:"Zonas",icone:"crisis_alert"},{id:"NOTICIAS",rotulo:"Not\xEDcias",icone:"newspaper"}],am=class t{store=p(kt);dialog=p(MS);corpo=Bn.required("corpo");busca=Bn.required("busca");abas=Lw;ufs=iw;estados=zt;periodos=nw;categorias=Lo;textoBusca=G("");sugestoes=P(()=>_w(this.textoBusca()));arrastando=G(!1);larguraPainel=G(this.larguraInicial());indiceAba=P(()=>Lw.findIndex(n=>n.id===this.store.aba()));filtrosNoticias=P(()=>!0);orgaoAtivo=P(()=>an[this.store.orgao()]||null);contagem=P(()=>{let n=this.store.filtrados();return{zonas:n.zonas.length,noticias:T(n.todas.length)}});kpis=P(()=>{let n=this.store.oficial();if(!n?.disponivel||!n.anos)return[];let e=n.ultimoMes!=="dez",i=n.anos[2],o=n.rotuloSel?`${n.rotuloSel} vs ${n.rotuloAnt}`:e?`jan\u2013${n.ultimoMes}/${i} vs ${n.anos[1]}`:`${i} vs ${n.anos[1]}`,a=[],r=Bw(n.eventos);if(!r)return[];let s=n.eventos.filter(c=>!r.partes.includes(c));a.push({rotulo:r.nome,valor:r.ano==null?"\u2014":T(r.ano),delta:[r.ano,r.anterior],sub:o,cor:"var(--cor-perigo)"}),r.taxa!=null&&a.push({rotulo:"Mortes violentas por 100 mil hab.",valor:Ee(r.taxa),sub:(r.taxaEstado?`estado: ${Ee(r.taxaEstado)} \xB7 `:"")+"\xFAltimos 12 meses"});for(let c of s){if(a.length>=4)break;let d=c.sel!==void 0?c.sel:c.porAno[2],l=c.selAnterior!==void 0?c.selAnterior:c.parcialAnterior;a.push({rotulo:c.nome,valor:d==null?"\u2014":T(d),delta:[d,l],sub:o})}return a});notaMortes=P(()=>{let n=this.store.oficial(),e=n?.disponivel?Bw(n.eventos):null;if(!e)return"";let i=e.partes.map(o=>o.nome.toLowerCase()).join(", ");return e.comIntervencao?`Mortes violentas intencionais (MVI) = ${i}.`:`Mortes violentas = ${i} (o que as secretarias chamam de CVLI). Mortes por interven\xE7\xE3o policial n\xE3o entram: o Sinesp s\xF3 as publica por estado, ent\xE3o o total das secretarias (MVI) fica maior.`});periodoOficial=P(()=>{let n=this.store.oficial();return n?.periodoTresAnos?`${n.periodoTresAnos} \xB7 importado em ${n.importadoEm}`:""});avisoOficial=P(()=>{let n=this.store.oficial();return n?.disponivel&&n.eventos.length?null:!n&&(this.store.carregando()||!this.store.dados()||this.store.dados().vazio)?{icone:"hourglass_top",titulo:"Carregando estat\xEDstica oficial",texto:"Buscando os registros do Sinesp de "+this.anosJanela()+"\u2026"}:{icone:"report",titulo:"Estat\xEDstica oficial indispon\xEDvel para este local",texto:(n?.motivo||"O servidor n\xE3o devolveu os dados do Sinesp.")+" As not\xEDcias continuam dispon\xEDveis como complemento."}});anosJanela(){let n=new Date().getFullYear();return`${n-2} a ${n}`}constructor(){queueMicrotask(()=>{this.store.localizar(()=>this.store.abrirLocal(fe.UF_PADRAO,fe.CIDADE_PADRAO)),Dc(fe.CHAVE_AJUDA_VISTA)!=="1"&&setTimeout(()=>this.ajuda(),900)})}escolher(n){let e=n.option.value;this.textoBusca.set(""),this.busca().nativeElement.value="",this.busca().nativeElement.blur(),e.tipo==="CEP"?this.store.buscarCep(e.cep):e.tipo==="UF"?this.store.abrirLocal(e.uf,"ESTADO_INTEIRO"):this.store.abrirLocal(e.uf,e.nome)}enter(){let n=this.textoBusca().replace(/\D/g,"");n.length===8&&!this.sugestoes().some(e=>e.tipo!=="CEP")&&(this.textoBusca.set(""),this.store.buscarCep(n))}localizar(){this.store.statusLocalizando(),this.store.localizar(()=>this.store.statusSemLocalizacao())}tourAberto=G(!1);ajuda(){this.tourAberto.set(!0)}fecharTour(){this.tourAberto.set(!1),ja(fe.CHAVE_AJUDA_VISTA,"1")}larguraInicial(){let n=Number(Dc(fe.CHAVE_LARGURA));return this.limitar(n||Math.round(window.innerWidth*.5))}limitar(n){let e=Math.max(420,window.innerWidth-320);return Math.round(Math.min(e,Math.max(380,n)))}iniciarArraste(n){n.preventDefault(),n.target.setPointerCapture?.(n.pointerId),this.arrastando.set(!0);let i=a=>{let r=this.corpo().nativeElement.getBoundingClientRect();this.larguraPainel.set(this.limitar(r.right-a.clientX))},o=()=>{this.arrastando.set(!1),ja(fe.CHAVE_LARGURA,String(this.larguraPainel())),window.removeEventListener("pointermove",i),window.removeEventListener("pointerup",o)};window.addEventListener("pointermove",i),window.addEventListener("pointerup",o)}ajustar(n){this.larguraPainel.update(e=>this.limitar(e+n)),ja(fe.CHAVE_LARGURA,String(this.larguraPainel()))}larguraPadrao(){this.larguraPainel.set(this.limitar(Math.round(window.innerWidth*.5))),ja(fe.CHAVE_LARGURA,String(this.larguraPainel()))}static \u0275fac=function(e){return new(e||t)};static \u0275cmp=H({type:t,selectors:[["app-root"]],viewQuery:function(e,i){e&1&&xi(i.corpo,QP,5)(i.busca,JP,5),e&2&&Ci(2)},hostVars:2,hostBindings:function(e,i){e&2&&z("arrastando",i.arrastando())},decls:62,vars:26,consts:[["busca",""],["auto","matAutocomplete"],["corpo",""],[1,"topo"],[1,"marca"],[1,"marca-icone"],[1,"marca-texto"],["appearance","outline","subscriptSizing","dynamic",1,"busca"],["matPrefix",""],["matInput","","placeholder","Buscar munic\xEDpio ou CEP","aria-label","Buscar munic\xEDpio ou CEP","autocomplete","off","spellcheck","false",3,"input","keydown.enter","value","matAutocomplete"],[3,"optionSelected","autoActiveFirstOption"],[3,"value"],["appearance","outline","subscriptSizing","dynamic",1,"uf"],["aria-label","Estado","panelWidth","260px",3,"selectionChange","value"],[1,"nome-uf"],[1,"acoes"],["mat-icon-button","","matTooltip","Minha localiza\xE7\xE3o","aria-label","Minha localiza\xE7\xE3o",3,"click"],["mat-icon-button","","matTooltip","Atualizar agora","aria-label","Atualizar agora",3,"click"],["mat-icon-button","","aria-label","Alternar tema",3,"click","matTooltip"],["mat-icon-button","","matTooltip","Como ler o painel (tour guiado)","aria-label","Como ler o painel",3,"click"],[1,"corpo"],[1,"area-mapa"],["role","separator","aria-orientation","vertical","aria-label","Redimensionar painel","tabindex","0",1,"divisor",3,"pointerdown","keydown.arrowleft","keydown.arrowright","dblclick"],[1,"painel"],[1,"painel-topo"],[1,"linha-titulo"],[1,"status",3,"title"],["role","status",1,"aviso-oficial"],[1,"filtros"],["mat-stretch-tabs","false","mat-align-tabs","start","animationDuration","0ms",1,"abas",3,"selectedIndexChange","selectedIndex","disablePagination"],[1,"detalhe"],[3,"fechar"],[1,"kpis"],[1,"kpi","oficial"],[1,"fonte-kpis"],[1,"kpi-rotulo",3,"title"],[1,"kpi-sub"],[3,"atual","anterior"],["aria-label","Per\xEDodo das not\xEDcias","hideSingleSelectionIndicator","","matTooltip","Vale para todas as abas, o mapa e os cart\xF5es (no Sinesp, os \xFAltimos meses publicados)",3,"change","value"],["aria-label","Tipos de crime",1,"categorias"],[3,"click","highlighted"],[3,"highlighted","matTooltip"],["highlighted","",1,"chip-orgao"],[3,"click","highlighted","matTooltip"],[1,"ponto"],["highlighted","",1,"chip-orgao",3,"removed"],["matChipRemove","","aria-label","Remover filtro de \xF3rg\xE3o"],["mat-tab-label",""],["matTabContent",""],[1,"icone-aba"],[1,"contador"],[1,"conteudo"]],template:function(e,i){if(e&1&&(f(0,"mat-toolbar",3)(1,"div",4)(2,"span",5)(3,"mat-icon"),b(4,"shield"),u()(),f(5,"div",6)(6,"b"),b(7,"Mapa da Seguran\xE7a"),u(),f(8,"small"),b(9),u()()(),f(10,"mat-form-field",7)(11,"mat-icon",8),b(12,"search"),u(),f(13,"input",9,0),V("input",function(a){return i.textoBusca.set(a.target.value)})("keydown.enter",function(){return i.enter()}),u(),f(15,"mat-autocomplete",10,1),V("optionSelected",function(a){return i.escolher(a)}),xe(17,iF,5,3,"mat-option",11,eF),u()(),f(19,"mat-form-field",12)(20,"mat-select",13),V("selectionChange",function(a){return i.store.abrirLocal(a.value,"ESTADO_INTEIRO")}),f(21,"mat-select-trigger"),b(22),f(23,"span",14),b(24),u()(),xe(25,oF,2,3,"mat-option",11,_i),u()(),f(27,"div",15)(28,"button",16),V("click",function(){return i.localizar()}),f(29,"mat-icon"),b(30,"my_location"),u()(),f(31,"button",17),V("click",function(){return i.store.atualizarAgora()}),f(32,"mat-icon"),b(33,"refresh"),u()(),f(34,"button",18),V("click",function(){return i.store.definirTema(!i.store.escuro())}),f(35,"mat-icon"),b(36),u()(),f(37,"button",19),V("click",function(){return i.ajuda()}),f(38,"mat-icon"),b(39,"help_outline"),u()()()(),f(40,"main",20,2)(42,"section",21),A(43,"app-mapa"),u(),k(44,aF,1,0,"app-tour"),f(45,"div",22),V("pointerdown",function(a){return i.iniciarArraste(a)})("keydown.arrowleft",function(){return i.ajustar(40)})("keydown.arrowright",function(){return i.ajustar(-40)})("dblclick",function(){return i.larguraPadrao()}),A(46,"span"),u(),f(47,"section",23)(48,"header",24)(49,"div",25)(50,"h1"),b(51),u(),f(52,"span",26)(53,"mat-icon"),b(54),u(),b(55),u()(),k(56,rF,8,3,"div",27)(57,lF,5,2),k(58,pF,10,3,"div",28),u(),f(59,"mat-tab-group",29),V("selectedIndexChange",function(a){return i.store.aba.set(i.abas[a].id)}),xe(60,SF,3,0,"mat-tab",null,Vw),u()()()),e&2){let o,a=nn(16);h(9),S(i.store.nomeLocal()),h(4),R("value",i.textoBusca())("matAutocomplete",a),h(2),R("autoActiveFirstOption",!0),h(2),Ce(i.sugestoes()),h(3),R("value",i.store.uf()),h(2),S(i.store.uf()),h(2),re(" \xB7 ",i.estados[i.store.uf()].nome),h(),Ce(i.ufs),h(6),z("girando",i.store.coletando()),h(3),R("matTooltip",i.store.escuro()?"Tema claro":"Tema escuro"),h(2),S(i.store.escuro()?"light_mode":"dark_mode"),h(4),we("--%NS%largura-painel",i.larguraPainel(),"px"),h(4),N(i.tourAberto()?44:-1),h(7),S(i.store.nomeLocal()),h(),Ke("status "+i.store.status().tipo),R("title",i.store.status().texto),h(),z("girando",i.store.status().icone==="sync"),h(),S(i.store.status().icone),h(),re("",i.store.status().texto," "),h(),N((o=i.avisoOficial())?56:57,o),h(2),N(i.filtrosNoticias()?58:-1),h(),R("selectedIndex",i.indiceAba())("disablePagination",!1),h(),Ce(i.abas)}},dependencies:[QS,XS,Po,vg,It,jt,no,zr,_c,Lu,Fu,sS,rS,ko,hg,HS,jS,zS,Di,oo,KS,Bg,Vg,jg,ZS,Tu,Cc,$r,Au,Sc,_S,Dg,cS,Xu,nm,Ju,tm,Qu,om,em,Un,Zu],styles:["[_nghost-%COMP%]{display:flex;flex-direction:column;height:100vh;height:100dvh;overflow:hidden}.arrastando[_nghost-%COMP%]{cursor:col-resize;-webkit-user-select:none;user-select:none}.topo[_ngcontent-%COMP%]{gap:12px;height:auto;min-height:60px;padding:6px 12px;background:var(--%NS%mat-sys-surface-container);border-bottom:1px solid var(--%NS%mat-sys-outline-variant);flex-wrap:nowrap;position:relative;z-index:1000}.marca[_ngcontent-%COMP%]{display:flex;align-items:center;gap:10px;min-width:0;flex:none}.marca-icone[_ngcontent-%COMP%]{width:38px;height:38px;border-radius:var(--%NS%raio-m);display:grid;place-items:center;background:var(--%NS%mat-sys-primary);color:var(--%NS%mat-sys-on-primary)}.marca-texto[_ngcontent-%COMP%]{display:flex;flex-direction:column;line-height:1.2;min-width:0}.marca-texto[_ngcontent-%COMP%]   b[_ngcontent-%COMP%]{font:var(--%NS%mat-sys-title-medium)}.marca-texto[_ngcontent-%COMP%]   small[_ngcontent-%COMP%]{font:var(--%NS%mat-sys-body-small);color:var(--%NS%mat-sys-on-surface-variant);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:220px}.busca[_ngcontent-%COMP%], .uf[_ngcontent-%COMP%]{--%NS%mat-form-field-container-height: 42px;--%NS%mat-form-field-container-vertical-padding: 9px;--%NS%mat-form-field-filled-with-label-container-padding-top: 9px}.busca[_ngcontent-%COMP%]{flex:1;max-width:520px;min-width:160px;margin-left:auto}.uf[_ngcontent-%COMP%]{width:210px;flex:none}.detalhe[_ngcontent-%COMP%]{color:var(--%NS%mat-sys-on-surface-variant);margin-left:6px}.acoes[_ngcontent-%COMP%]{display:flex;flex:none}.corpo[_ngcontent-%COMP%]{flex:1;min-height:0;display:grid;grid-template-columns:minmax(280px,1fr) 10px var(--%NS%largura-painel, 760px)}.area-mapa[_ngcontent-%COMP%]{position:relative;min-height:0}.divisor[_ngcontent-%COMP%]{cursor:col-resize;display:grid;place-items:center;background:var(--%NS%mat-sys-surface-container);border-inline:1px solid var(--%NS%mat-sys-outline-variant);touch-action:none}.divisor[_ngcontent-%COMP%]   span[_ngcontent-%COMP%]{width:4px;height:40px;border-radius:2px;background:var(--%NS%mat-sys-outline);opacity:.6}.divisor[_ngcontent-%COMP%]:hover   span[_ngcontent-%COMP%], .divisor[_ngcontent-%COMP%]:focus-visible   span[_ngcontent-%COMP%]{background:var(--%NS%mat-sys-primary);opacity:1}.divisor[_ngcontent-%COMP%]:focus-visible{outline:none}.painel[_ngcontent-%COMP%]{min-width:0;min-height:0;display:flex;flex-direction:column;background:var(--%NS%mat-sys-surface);container:painel/inline-size}.painel-topo[_ngcontent-%COMP%]{padding:14px 16px 6px;display:grid;gap:10px;border-bottom:1px solid var(--%NS%mat-sys-outline-variant)}.linha-titulo[_ngcontent-%COMP%]{display:flex;align-items:center;gap:10px;flex-wrap:wrap;justify-content:space-between}h1[_ngcontent-%COMP%]{font:var(--%NS%mat-sys-headline-small);margin:0}.status[_ngcontent-%COMP%]{display:inline-flex;align-items:center;gap:4px;font:var(--%NS%mat-sys-label-medium);color:var(--%NS%mat-sys-on-surface-variant);max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.status[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%]{font-size:16px;width:16px;height:16px;flex:none}.status.ok[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%]{color:var(--%NS%cor-sucesso)}.status.erro[_ngcontent-%COMP%]{color:var(--%NS%cor-perigo)}.filtros[_ngcontent-%COMP%]{margin-top:10px;display:flex;gap:8px 12px;flex-wrap:wrap;align-items:center}.filtros[_ngcontent-%COMP%]   mat-button-toggle-group[_ngcontent-%COMP%]{--%NS%mat-button-toggle-height: 34px;flex:none}.categorias[_ngcontent-%COMP%]{--%NS%mat-chip-container-height: 30px}.ponto[_ngcontent-%COMP%]{display:inline-block;width:8px;height:8px;border-radius:50%;margin-right:6px}.kpis[_ngcontent-%COMP%]{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:8px}@container painel (max-width: 560px){.kpis[_ngcontent-%COMP%]{grid-template-columns:repeat(2,minmax(0,1fr))}}.kpi[_ngcontent-%COMP%]{background:var(--%NS%mat-sys-surface-container-low);border:1px solid var(--%NS%borda-suave);border-radius:var(--%NS%raio-m);padding:8px 10px;min-width:0;display:flex;flex-direction:column;gap:1px}.kpi.oficial[_ngcontent-%COMP%]{border-color:color-mix(in srgb,var(--%NS%mat-sys-primary) 45%,var(--%NS%mat-sys-outline-variant))}.kpi-rotulo[_ngcontent-%COMP%]{font:var(--%NS%mat-sys-label-medium);color:var(--%NS%mat-sys-on-surface-variant);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;display:flex;align-items:center;gap:3px}.kpi-rotulo[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%]{font-size:14px;width:14px;height:14px;color:var(--%NS%mat-sys-primary);flex:none}.kpi[_ngcontent-%COMP%]   b[_ngcontent-%COMP%]{font:var(--%NS%mat-sys-headline-small);font-weight:600;font-variant-numeric:tabular-nums}.kpi-sub[_ngcontent-%COMP%]{font:var(--%NS%mat-sys-body-small);color:var(--%NS%mat-sys-on-surface-variant);display:flex;gap:4px;align-items:center;flex-wrap:wrap;min-height:20px}.aviso-oficial[_ngcontent-%COMP%]{display:flex;gap:10px;align-items:flex-start;padding:10px 12px;border-radius:var(--%NS%raio-m);margin-top:10px;background:var(--%NS%mat-sys-error-container);color:var(--%NS%mat-sys-on-error-container)}.aviso-oficial[_ngcontent-%COMP%]   div[_ngcontent-%COMP%]{display:flex;flex-direction:column;gap:2px;font:var(--%NS%mat-sys-body-medium)}.fonte-kpis[_ngcontent-%COMP%]{margin:6px 0 0;font:var(--%NS%mat-sys-body-small);color:var(--%NS%mat-sys-on-surface-variant)}.abas[_ngcontent-%COMP%]{flex:1;min-height:0}.abas[_ngcontent-%COMP%]     .mat-mdc-tab-body-wrapper{flex:1;min-height:0}.abas[_ngcontent-%COMP%]     .mat-mdc-tab-body-content{overflow:auto}.conteudo[_ngcontent-%COMP%]{padding:14px 16px 24px}.icone-aba[_ngcontent-%COMP%]{font-size:18px;width:18px;height:18px;margin-right:6px}.contador[_ngcontent-%COMP%]{margin-left:6px;font:var(--%NS%mat-sys-label-small);background:var(--%NS%mat-sys-secondary-container);color:var(--%NS%mat-sys-on-secondary-container);border-radius:999px;padding:1px 7px}.girando[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%], mat-icon.girando[_ngcontent-%COMP%]{animation:_ngcontent-%COMP%_girar 1s linear infinite}@keyframes _ngcontent-%COMP%_girar{to{transform:rotate(360deg)}}@media(max-width:1100px){.marca-texto[_ngcontent-%COMP%]   small[_ngcontent-%COMP%], .nome-uf[_ngcontent-%COMP%]{display:none}.uf[_ngcontent-%COMP%]{width:92px}}@media(max-width:900px){[_nghost-%COMP%]{height:auto;min-height:100dvh;overflow:visible}.topo[_ngcontent-%COMP%]{flex-wrap:wrap;position:sticky;top:0}.busca[_ngcontent-%COMP%]{order:3;flex-basis:100%;max-width:none;margin-left:0}.uf[_ngcontent-%COMP%]{margin-left:auto}.corpo[_ngcontent-%COMP%]{display:flex;flex-direction:column}.area-mapa[_ngcontent-%COMP%]{height:46vh;min-height:300px}.divisor[_ngcontent-%COMP%]{display:none}.abas[_ngcontent-%COMP%]     .mat-mdc-tab-body-content{overflow:visible}}@media(max-width:520px){.marca-texto[_ngcontent-%COMP%]{display:none}.painel-topo[_ngcontent-%COMP%]{padding:12px 12px 6px}.conteudo[_ngcontent-%COMP%]{padding:12px 12px 24px}h1[_ngcontent-%COMP%]{font:var(--%NS%mat-sys-title-large)}.icone-aba[_ngcontent-%COMP%]{display:none}}"]})};function Bw(t){let n=t.filter(s=>/^(homic[ií]dio doloso|latroc[ií]nio|roubo seguido de morte|les[aã]o corporal seguida de morte)/i.test(s.nome)),e=t.filter(s=>/^morte por interven/i.test(s.nome)),i=[...n,...e];if(!n.length)return null;let o=s=>{let c=i.map(s);return c.every(d=>d==null)?null:c.reduce((d,l)=>d+(l||0),0)},a=i.map(s=>s.taxa),r=i.map(s=>s.taxaEstado);return{nome:e.length?"Mortes violentas (MVI)":"Mortes violentas (CVLI)",partes:i,comIntervencao:e.length>0,ano:o(s=>s.sel!==void 0?s.sel:s.porAno[2]),anterior:o(s=>s.selAnterior!==void 0?s.selAnterior:s.parcialAnterior),taxa:a.every(s=>s!=null)?Math.round(a.reduce((s,c)=>s+c,0)*10)/10:null,taxaEstado:r.every(s=>s!=null)?Math.round(r.reduce((s,c)=>s+c,0)*10)/10:null}}Eh(am,Cx).catch(t=>console.error(t));
