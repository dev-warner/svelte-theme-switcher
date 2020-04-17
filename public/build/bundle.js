
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.head.appendChild(r) })(window.document);
var app = (function () {
    'use strict';

    function noop() { }
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    function validate_store(store, name) {
        if (store != null && typeof store.subscribe !== 'function') {
            throw new Error(`'${name}' is not a store with a 'subscribe' method`);
        }
    }
    function subscribe(store, ...callbacks) {
        if (store == null) {
            return noop;
        }
        const unsub = store.subscribe(...callbacks);
        return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
    }
    function component_subscribe(component, store, callback) {
        component.$$.on_destroy.push(subscribe(store, callback));
    }
    function exclude_internal_props(props) {
        const result = {};
        for (const k in props)
            if (k[0] !== '$')
                result[k] = props[k];
        return result;
    }

    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function element(name) {
        return document.createElement(name);
    }
    function svg_element(name) {
        return document.createElementNS('http://www.w3.org/2000/svg', name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function set_svg_attributes(node, attributes) {
        for (const key in attributes) {
            attr(node, key, attributes[key]);
        }
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function claim_element(nodes, name, attributes, svg) {
        for (let i = 0; i < nodes.length; i += 1) {
            const node = nodes[i];
            if (node.nodeName === name) {
                let j = 0;
                while (j < node.attributes.length) {
                    const attribute = node.attributes[j];
                    if (attributes[attribute.name]) {
                        j++;
                    }
                    else {
                        node.removeAttribute(attribute.name);
                    }
                }
                return nodes.splice(i, 1)[0];
            }
        }
        return svg ? svg_element(name) : element(name);
    }
    function claim_text(nodes, data) {
        for (let i = 0; i < nodes.length; i += 1) {
            const node = nodes[i];
            if (node.nodeType === 3) {
                node.data = '' + data;
                return nodes.splice(i, 1)[0];
            }
        }
        return text(data);
    }
    function custom_event(type, detail) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, false, false, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    let flushing = false;
    const seen_callbacks = new Set();
    function flush() {
        if (flushing)
            return;
        flushing = true;
        do {
            // first, call beforeUpdate functions
            // and update components
            for (let i = 0; i < dirty_components.length; i += 1) {
                const component = dirty_components[i];
                set_current_component(component);
                update(component.$$);
            }
            dirty_components.length = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        flushing = false;
        seen_callbacks.clear();
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }

    function get_spread_update(levels, updates) {
        const update = {};
        const to_null_out = {};
        const accounted_for = { $$scope: 1 };
        let i = levels.length;
        while (i--) {
            const o = levels[i];
            const n = updates[i];
            if (n) {
                for (const key in o) {
                    if (!(key in n))
                        to_null_out[key] = 1;
                }
                for (const key in n) {
                    if (!accounted_for[key]) {
                        update[key] = n[key];
                        accounted_for[key] = 1;
                    }
                }
                levels[i] = n;
            }
            else {
                for (const key in o) {
                    accounted_for[key] = 1;
                }
            }
        }
        for (const key in to_null_out) {
            if (!(key in update))
                update[key] = undefined;
        }
        return update;
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        // onMount happens before the initial afterUpdate
        add_render_callback(() => {
            const new_on_destroy = on_mount.map(run).filter(is_function);
            if (on_destroy) {
                on_destroy.push(...new_on_destroy);
            }
            else {
                // Edge case - component was destroyed immediately,
                // most likely as a result of a binding initialising
                run_all(new_on_destroy);
            }
            component.$$.on_mount = [];
        });
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const prop_values = options.props || {};
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            before_update: [],
            after_update: [],
            context: new Map(parent_component ? parent_component.$$.context : []),
            // everything else
            callbacks: blank_object(),
            dirty
        };
        let ready = false;
        $$.ctx = instance
            ? instance(component, prop_values, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if ($$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor);
            flush();
        }
        set_current_component(parent_component);
    }
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set() {
            // overridden by instance, if it has props
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.20.1' }, detail)));
    }
    function append_dev(target, node) {
        dispatch_dev("SvelteDOMInsert", { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev("SvelteDOMInsert", { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev("SvelteDOMRemove", { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ["capture"] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev("SvelteDOMAddEventListener", { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev("SvelteDOMRemoveEventListener", { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev("SvelteDOMRemoveAttribute", { node, attribute });
        else
            dispatch_dev("SvelteDOMSetAttribute", { node, attribute, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.data === data)
            return;
        dispatch_dev("SvelteDOMSetData", { node: text, data });
        text.data = data;
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error(`'target' is a required option`);
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn(`Component was already destroyed`); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

    function unwrapExports (x) {
    	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
    }

    function createCommonjsModule(fn, module) {
    	return module = { exports: {} }, fn(module, module.exports), module.exports;
    }

    var wc = createCommonjsModule(function (module, exports) {
    !function(t,e){e(exports);}(commonjsGlobal,(function(t){function e(){}function c(t,e){for(const c in e)t[c]=e[c];return t}function r(t){return t()}function n(){return Object.create(null)}function i(t){t.forEach(r);}function o(t){return "function"==typeof t}function s(t,e){return t!=t?e==e:t!==e||t&&"object"==typeof t||"function"==typeof t}function l(t,c,r){t.$$.on_destroy.push(function(t,...c){if(null==t)return e;const r=t.subscribe(...c);return r.unsubscribe?()=>r.unsubscribe():r}(c,r));}function h(t){const e={};for(const c in t)"$"!==c[0]&&(e[c]=t[c]);return e}function a(t,e){t.appendChild(e);}function f(t,e,c){t.insertBefore(e,c||null);}function u(t){t.parentNode.removeChild(t);}function d(t){return document.createElement(t)}function m(t){return document.createElementNS("http://www.w3.org/2000/svg",t)}function p(t){return document.createTextNode(t)}function g(t,e,c){null==c?t.removeAttribute(e):t.getAttribute(e)!==c&&t.setAttribute(e,c);}function w(t,e){for(const c in e)g(t,c,e[c]);}function $(t){return Array.from(t.childNodes)}function y(t,e,c,r){for(let r=0;r<t.length;r+=1){const n=t[r];if(n.nodeName===e){let e=0;for(;e<n.attributes.length;){const t=n.attributes[e];c[t.name]?e++:n.removeAttribute(t.name);}return t.splice(r,1)[0]}}return r?m(e):d(e)}function x(t,e){for(let c=0;c<t.length;c+=1){const r=t[c];if(3===r.nodeType)return r.data=""+e,t.splice(c,1)[0]}return p(e)}let b;function v(t){b=t;}const E=[],_=[],k=[],B=[],M=Promise.resolve();let C=!1;function L(t){k.push(t);}let F=!1;const S=new Set;function j(){if(!F){F=!0;do{for(let t=0;t<E.length;t+=1){const e=E[t];v(e),D(e.$$);}for(E.length=0;_.length;)_.pop()();for(let t=0;t<k.length;t+=1){const e=k[t];S.has(e)||(S.add(e),e());}k.length=0;}while(E.length);for(;B.length;)B.pop()();C=!1,F=!1,S.clear();}}function D(t){if(null!==t.fragment){t.update(),i(t.before_update);const e=t.dirty;t.dirty=[-1],t.fragment&&t.fragment.p(t.ctx,e),t.after_update.forEach(L);}}const A=new Set;let N,O;function T(t,e){t&&t.i&&(A.delete(t),t.i(e));}function H(t,e,c,r){if(t&&t.o){if(A.has(t))return;A.add(t),N.c.push(()=>{A.delete(t),r&&(c&&t.d(1),r());}),t.o(e);}}function z(t,e){const c={},r={},n={$$scope:1};let i=t.length;for(;i--;){const o=t[i],s=e[i];if(s){for(const t in o)t in s||(r[t]=1);for(const t in s)n[t]||(c[t]=s[t],n[t]=1);t[i]=s;}else for(const t in o)n[t]=1;}for(const t in r)t in c||(c[t]=void 0);return c}function I(t){t&&t.c();}function P(t,e,c){const{fragment:n,on_mount:s,on_destroy:l,after_update:h}=t.$$;n&&n.m(e,c),L(()=>{const e=s.map(r).filter(o);l?l.push(...e):i(e),t.$$.on_mount=[];}),h.forEach(L);}function R(t,e){const c=t.$$;null!==c.fragment&&(i(c.on_destroy),c.fragment&&c.fragment.d(e),c.on_destroy=c.fragment=null,c.ctx=[]);}function q(t,e){-1===t.$$.dirty[0]&&(E.push(t),C||(C=!0,M.then(j)),t.$$.dirty.fill(0)),t.$$.dirty[e/31|0]|=1<<e%31;}function G(t,c,r,o,s,l,h=[-1]){const a=b;v(t);const f=c.props||{},d=t.$$={fragment:null,ctx:null,props:l,update:e,not_equal:s,bound:n(),on_mount:[],on_destroy:[],before_update:[],after_update:[],context:new Map(a?a.$$.context:[]),callbacks:n(),dirty:h};let m=!1;if(d.ctx=r?r(t,f,(e,c,...r)=>{const n=r.length?r[0]:c;return d.ctx&&s(d.ctx[e],d.ctx[e]=n)&&(d.bound[e]&&d.bound[e](n),m&&q(t,e)),c}):[],d.update(),m=!0,i(d.before_update),d.fragment=!!o&&o(d.ctx),c.target){if(c.hydrate){const t=$(c.target);d.fragment&&d.fragment.l(t),t.forEach(u);}else d.fragment&&d.fragment.c();c.intro&&T(t.$$.fragment),P(t,c.target,c.anchor),j();}v(a);}"function"==typeof HTMLElement&&(O=class extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"});}connectedCallback(){for(const t in this.$$.slotted)this.appendChild(this.$$.slotted[t]);}attributeChangedCallback(t,e,c){this[t]=c;}$destroy(){R(this,1),this.$destroy=e;}$on(t,e){const c=this.$$.callbacks[t]||(this.$$.callbacks[t]=[]);return c.push(e),()=>{const t=c.indexOf(e);-1!==t&&c.splice(t,1);}}$set(){}});class J{$destroy(){R(this,1),this.$destroy=e;}$on(t,e){const c=this.$$.callbacks[t]||(this.$$.callbacks[t]=[]);return c.push(e),()=>{const t=c.indexOf(e);-1!==t&&c.splice(t,1);}}$set(){}}const K={classList:[],height:"30px"},Q=["background","light","dark","height","width","transition"];function U(t){const{classList:e,...c}=t;return function t(e,c=""){return Object.keys(e).map(r=>{if(!Q.includes(r))return;const n=e[r];return "object"==typeof n?t(n,c?`${c}-${r}`:r):`--theme-switcher-${c?`${c}-`:""}${r}: ${n};`}).flat().filter(Boolean).join(" ")}(c)}const V=[];const W="dark",X="light",Y=window.matchMedia&&window.matchMedia("(prefers-color-scheme: dark)").matches,Z=localStorage.getItem("current:theme"),tt=function(t,c=e){let r;const n=[];function i(e){if(s(t,e)&&(t=e,r)){const e=!V.length;for(let e=0;e<n.length;e+=1){const c=n[e];c[1](),V.push(c,t);}if(e){for(let t=0;t<V.length;t+=2)V[t][0](V[t+1]);V.length=0;}}}return {set:i,update:function(e){i(e(t));},subscribe:function(o,s=e){const l=[o,s];return n.push(l),1===n.length&&(r=c(i)||e),o(t),()=>{const t=n.indexOf(l);-1!==t&&n.splice(t,1),0===n.length&&(r(),r=null);}}}}(Z||(Y?W:X));function et(){tt.update(t=>t===W?X:W);}function ct(t){let r,n,i,o,s,l,h,d,b,v,E,_,k,B,M=[{xmlns:"http://www.w3.org/2000/svg"},{viewBox:"0 0 36 36"},t[0]],C={};for(let t=0;t<M.length;t+=1)C=c(C,M[t]);return {c(){r=m("svg"),n=m("title"),i=p("Light theme on: Sun"),o=m("path"),s=m("g"),l=m("circle"),h=m("circle"),d=m("circle"),b=m("circle"),v=m("circle"),E=m("circle"),_=m("circle"),k=m("circle"),B=m("path"),this.h();},l(t){r=y(t,"svg",{xmlns:!0,viewBox:!0},1);var e=$(r);n=y(e,"title",{},1);var c=$(n);i=x(c,"Light theme on: Sun"),c.forEach(u),o=y(e,"path",{fill:!0,d:!0},1),$(o).forEach(u),s=y(e,"g",{fill:!0},1);var a=$(s);l=y(a,"circle",{cx:!0,cy:!0,r:!0},1),$(l).forEach(u),h=y(a,"circle",{cx:!0,cy:!0,r:!0},1),$(h).forEach(u),d=y(a,"circle",{cx:!0,cy:!0,r:!0},1),$(d).forEach(u),b=y(a,"circle",{cx:!0,cy:!0,r:!0},1),$(b).forEach(u),v=y(a,"circle",{cx:!0,cy:!0,r:!0},1),$(v).forEach(u),E=y(a,"circle",{cx:!0,cy:!0,r:!0},1),$(E).forEach(u),_=y(a,"circle",{cx:!0,cy:!0,r:!0},1),$(_).forEach(u),k=y(a,"circle",{cx:!0,cy:!0,r:!0},1),$(k).forEach(u),a.forEach(u),B=y(e,"path",{d:!0,fill:!0},1),$(B).forEach(u),e.forEach(u),this.h();},h(){g(o,"fill","#FFD983"),g(o,"d","M36 18c0 9.941-8.059 18-18 18S0 27.941 0 18 8.059 0 18 0s18 8.059 18 18"),g(l,"cx","9.5"),g(l,"cy","7.5"),g(l,"r","3.5"),g(h,"cx","24.5"),g(h,"cy","28.5"),g(h,"r","3.5"),g(d,"cx","22"),g(d,"cy","5"),g(d,"r","2"),g(b,"cx","3"),g(b,"cy","18"),g(b,"r","1"),g(v,"cx","30"),g(v,"cy","9"),g(v,"r","1"),g(E,"cx","16"),g(E,"cy","31"),g(E,"r","1"),g(_,"cx","32"),g(_,"cy","19"),g(_,"r","2"),g(k,"cx","6"),g(k,"cy","26"),g(k,"r","2"),g(s,"fill","#FFCC4D"),g(B,"d","M18 24.904c-7 0-9-2.618-9-1.381C9 24.762 13 28 18 28s9-3.238\n    9-4.477c0-1.237-2 1.381-9 1.381M27 15c0 1.657-1.344 3-3 3s-3-1.343-3-3\n    1.344-3 3-3 3 1.343 3 3m-12 0c0 1.657-1.344 3-3 3s-3-1.343-3-3 1.344-3 3-3 3\n    1.343 3 3"),g(B,"fill","#292F33"),w(r,C);},m(t,e){f(t,r,e),a(r,n),a(n,i),a(r,o),a(r,s),a(s,l),a(s,h),a(s,d),a(s,b),a(s,v),a(s,E),a(s,_),a(s,k),a(r,B);},p(t,[e]){w(r,z(M,[{xmlns:"http://www.w3.org/2000/svg"},{viewBox:"0 0 36 36"},1&e&&t[0]]));},i:e,o:e,d(t){t&&u(r);}}}function rt(t,e,r){return t.$set=t=>{r(0,e=c(c({},e),h(t)));},[e=h(e)]}"undefined"!=typeof window&&(window.matchMedia&&window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change",(function(t){const e=t.matches?W:X;tt.set(e);}),!0),tt.subscribe(t=>{document.body.classList.remove(`theme-${t===W?X:W}`),document.body.classList.add(`theme-${t}`),localStorage.setItem("current:theme",t);}));class nt extends J{constructor(t){super(),G(this,t,rt,ct,s,{});}}function it(t){let r,n,i,o,s,l,h,d,b,v,E,_,k,B,M=[{xmlns:"http://www.w3.org/2000/svg"},{viewBox:"0 0 36 36"},t[0]],C={};for(let t=0;t<M.length;t+=1)C=c(C,M[t]);return {c(){r=m("svg"),n=m("title"),i=p("Dark theme on: Moon"),o=m("circle"),s=m("path"),l=m("circle"),h=m("circle"),d=m("circle"),b=m("circle"),v=m("circle"),E=m("circle"),_=m("circle"),k=m("circle"),B=m("circle"),this.h();},l(t){r=y(t,"svg",{xmlns:!0,viewBox:!0},1);var e=$(r);n=y(e,"title",{},1);var c=$(n);i=x(c,"Dark theme on: Moon"),c.forEach(u),o=y(e,"circle",{fill:!0,cx:!0,cy:!0,r:!0},1),$(o).forEach(u),s=y(e,"path",{fill:!0,d:!0},1),$(s).forEach(u),l=y(e,"circle",{fill:!0,cx:!0,cy:!0,r:!0},1),$(l).forEach(u),h=y(e,"circle",{fill:!0,cx:!0,cy:!0,r:!0},1),$(h).forEach(u),d=y(e,"circle",{fill:!0,cx:!0,cy:!0,r:!0},1),$(d).forEach(u),b=y(e,"circle",{fill:!0,cx:!0,cy:!0,r:!0},1),$(b).forEach(u),v=y(e,"circle",{fill:!0,cx:!0,cy:!0,r:!0},1),$(v).forEach(u),E=y(e,"circle",{fill:!0,cx:!0,cy:!0,r:!0},1),$(E).forEach(u),_=y(e,"circle",{fill:!0,cx:!0,cy:!0,r:!0},1),$(_).forEach(u),k=y(e,"circle",{fill:!0,cx:!0,cy:!0,r:!0},1),$(k).forEach(u),B=y(e,"circle",{fill:!0,cx:!0,cy:!0,r:!0},1),$(B).forEach(u),e.forEach(u),this.h();},h(){g(o,"fill","#FFD983"),g(o,"cx","18"),g(o,"cy","18"),g(o,"r","18"),g(s,"fill","#66757F"),g(s,"d","M0 18c0 9.941 8.059 18 18 18 .295 0 .58-.029.87-.043C24.761 33.393 29\n    26.332 29 18 29 9.669 24.761 2.607 18.87.044 18.58.03 18.295 0 18 0 8.059 0\n    0 8.059 0 18z"),g(l,"fill","#5B6876"),g(l,"cx","10.5"),g(l,"cy","8.5"),g(l,"r","3.5"),g(h,"fill","#5B6876"),g(h,"cx","20"),g(h,"cy","16"),g(h,"r","3"),g(d,"fill","#5B6876"),g(d,"cx","21.5"),g(d,"cy","27.5"),g(d,"r","3.5"),g(b,"fill","#5B6876"),g(b,"cx","21"),g(b,"cy","6"),g(b,"r","2"),g(v,"fill","#5B6876"),g(v,"cx","3"),g(v,"cy","18"),g(v,"r","1"),g(E,"fill","#FFCC4D"),g(E,"cx","30"),g(E,"cy","9"),g(E,"r","1"),g(_,"fill","#5B6876"),g(_,"cx","15"),g(_,"cy","31"),g(_,"r","1"),g(k,"fill","#FFCC4D"),g(k,"cx","32"),g(k,"cy","19"),g(k,"r","2"),g(B,"fill","#5B6876"),g(B,"cx","10"),g(B,"cy","23"),g(B,"r","2"),w(r,C);},m(t,e){f(t,r,e),a(r,n),a(n,i),a(r,o),a(r,s),a(r,l),a(r,h),a(r,d),a(r,b),a(r,v),a(r,E),a(r,_),a(r,k),a(r,B);},p(t,[e]){w(r,z(M,[{xmlns:"http://www.w3.org/2000/svg"},{viewBox:"0 0 36 36"},1&e&&t[0]]));},i:e,o:e,d(t){t&&u(r);}}}function ot(t,e,r){return t.$set=t=>{r(0,e=c(c({},e),h(t)));},[e=h(e)]}class st extends J{constructor(t){super(),G(this,t,ot,it,s,{});}}function lt(t){let e;const c=new nt({props:{width:t[1],height:t[1]}});return {c(){I(c.$$.fragment);},m(t,r){P(c,t,r),e=!0;},p(t,e){const r={};2&e&&(r.width=t[1]),2&e&&(r.height=t[1]),c.$set(r);},i(t){e||(T(c.$$.fragment,t),e=!0);},o(t){H(c.$$.fragment,t),e=!1;},d(t){R(c,t);}}}function ht(t){let e;const c=new st({props:{width:t[1],height:t[1]}});return {c(){I(c.$$.fragment);},m(t,r){P(c,t,r),e=!0;},p(t,e){const r={};2&e&&(r.width=t[1]),2&e&&(r.height=t[1]),c.$set(r);},i(t){e||(T(c.$$.fragment,t),e=!0);},o(t){H(c.$$.fragment,t),e=!1;},d(t){R(c,t);}}}function at(t){let c,r,n,o,s,l,h;const m=[ht,lt],p=[];function w(t,e){return t[0]?0:1}return n=w(t),o=p[n]=m[n](t),{c(){c=d("button"),r=d("span"),o.c(),this.c=e,g(r,"class","theme-switcher__state"),g(c,"class",s="theme-switcher "+t[2].join(" ")),g(c,"aria-label","Switch theme"),g(c,"style",t[3]);},m(t,e,i){var o,s,u,d;f(t,c,e),a(c,r),p[n].m(r,null),l=!0,i&&h(),s="click",u=et,(o=c).addEventListener(s,u,d),h=()=>o.removeEventListener(s,u,d);},p(t,[e]){let h=n;n=w(t),n===h?p[n].p(t,e):(N={r:0,c:[],p:N},H(p[h],1,1,()=>{p[h]=null;}),N.r||i(N.c),N=N.p,o=p[n],o||(o=p[n]=m[n](t),o.c()),T(o,1),o.m(r,null)),(!l||4&e&&s!==(s="theme-switcher "+t[2].join(" ")))&&g(c,"class",s),(!l||8&e)&&g(c,"style",t[3]);},i(t){l||(T(o),l=!0);},o(t){H(o),l=!1;},d(t){t&&u(c),p[n].d(),h();}}}function ft(t,e,c){let r;l(t,tt,t=>c(5,r=t));let n,i,o,s,h,{options:a=K}=e;return t.$set=t=>{"options"in t&&c(4,a=t.options);},t.$$.update=()=>{32&t.$$.dirty&&c(0,n=r===W),16&t.$$.dirty&&c(6,o={...K,...a}),64&t.$$.dirty&&c(1,i=Number(String(o.height).split("px").shift())),65&t.$$.dirty&&c(2,s=[...[o.classList].flat(),n?"theme-switcher__state--dark":"theme-switcher__state--light"]),64&t.$$.dirty&&c(3,h=U(o));},[n,i,s,h,a]}class ut extends O{constructor(t){super(),this.shadowRoot.innerHTML="<style>:global(:root){--theme-switcher-background-light:#ecf0f1;--theme-switcher-background-dark:#333;--theme-switcher-transition:0.6s;--theme-switcher-height:30px;--theme-switcher-width:60px;--theme-switcher-border-radius:calc(var(--theme-switcher-width) / 2);--theme-switcher-offset:calc(var(--theme-switcher-height) / 30)}.theme-switcher{border:0;overflow:hidden;position:relative;width:var(--theme-switcher-width);min-width:var(--theme-switcher-height);height:var(--theme-switcher-height);border-radius:var(--theme-switcher-border-radius)}.theme-switcher__state{top:0;line-height:1;position:absolute;height:var(--theme-switcher-height);transition:left var(--theme-switcher-transition);width:calc(\n      var(--theme-switcher-height) - calc(var(--theme-switcher-offset) * 4)\n    );font-size:calc(\n      var(--theme-switcher-height) + var(--theme-switcher-offset)\n    )}.theme-switcher__state--dark{background-color:var(--theme-switcher-background-dark)}.theme-switcher__state--light{background-color:var(--theme-switcher-background-light)}.theme-switcher__state--light>.theme-switcher__state{left:calc(\n      100% - calc(var(--theme-switcher-height) - var(--theme-switcher-offset))\n    )}.theme-switcher__state--dark>.theme-switcher__state{left:0}</style>",G(this,{target:this.shadowRoot},ft,at,s,{options:4}),t&&(t.target&&f(t.target,this,t.anchor),t.props&&(this.$set(t.props),j()));}static get observedAttributes(){return ["options"]}get options(){return this.$$.ctx[4]}set options(t){this.$set({options:t}),j();}}customElements.define("theme-switcher",ut),t.default=ut,t.theme=tt,Object.defineProperty(t,"__esModule",{value:!0});}));
    });

    unwrapExports(wc);

    const DEFAULT_OPTIONS = {
      classList: [],
      height: "30px"
    };

    const ALLOWED_PROPERTIES = [
      "background",
      "light",
      "dark",
      "height",
      "width",
      "transition"
    ];

    function optionsToStyle(options, parent = "") {
      const BASE = "--theme-switcher-";

      return Object.keys(options)
        .map(key => {
          if (!ALLOWED_PROPERTIES.includes(key)) {
            return;
          }

          const value = options[key];

          if (typeof value === "object") {
            return optionsToStyle(value, parent ? `${parent}-${key}` : key);
          }

          return `${BASE}${parent ? `${parent}-` : ""}${key}: ${value};`;
        })
        .flat()
        .filter(Boolean)
        .join(" ");
    }

    function setStyles(userOptions) {
      const { classList, ...opts } = userOptions;

      return optionsToStyle(opts);
    }

    const subscriber_queue = [];
    /**
     * Create a `Writable` store that allows both updating and reading by subscription.
     * @param {*=}value initial value
     * @param {StartStopNotifier=}start start and stop notifications for subscriptions
     */
    function writable(value, start = noop) {
        let stop;
        const subscribers = [];
        function set(new_value) {
            if (safe_not_equal(value, new_value)) {
                value = new_value;
                if (stop) { // store is ready
                    const run_queue = !subscriber_queue.length;
                    for (let i = 0; i < subscribers.length; i += 1) {
                        const s = subscribers[i];
                        s[1]();
                        subscriber_queue.push(s, value);
                    }
                    if (run_queue) {
                        for (let i = 0; i < subscriber_queue.length; i += 2) {
                            subscriber_queue[i][0](subscriber_queue[i + 1]);
                        }
                        subscriber_queue.length = 0;
                    }
                }
            }
        }
        function update(fn) {
            set(fn(value));
        }
        function subscribe(run, invalidate = noop) {
            const subscriber = [run, invalidate];
            subscribers.push(subscriber);
            if (subscribers.length === 1) {
                stop = start(set) || noop;
            }
            run(value);
            return () => {
                const index = subscribers.indexOf(subscriber);
                if (index !== -1) {
                    subscribers.splice(index, 1);
                }
                if (subscribers.length === 0) {
                    stop();
                    stop = null;
                }
            };
        }
        return { set, update, subscribe };
    }

    const LOCAL_STORAGE_KEY = "current:theme";

    const THEMES = {
      DARK: "dark",
      LIGHT: "light",
    };

    const MATCH_DARK_THEME = "(prefers-color-scheme: dark)";

    const IS_USER_PREFERNCE_DARK =
      window.matchMedia && window.matchMedia(MATCH_DARK_THEME).matches;

    const STORED = localStorage.getItem(LOCAL_STORAGE_KEY);

    const DEFAULT_THEME = STORED
      ? STORED
      : IS_USER_PREFERNCE_DARK
      ? THEMES.DARK
      : THEMES.LIGHT;

    const theme = writable(DEFAULT_THEME);

    function toggleTheme() {
      theme.update((current) =>
        current === THEMES.DARK ? THEMES.LIGHT : THEMES.DARK
      );
    }

    function onSystemThemeChange(e) {
      const newTheme = e.matches ? THEMES.DARK : THEMES.LIGHT;

      theme.set(newTheme);
    }

    if (typeof window !== "undefined") {
      window.matchMedia &&
        window
          .matchMedia(MATCH_DARK_THEME)
          .addEventListener("change", onSystemThemeChange, true);

      theme.subscribe((theme) => {
        document.body.classList.remove(
          `theme-${theme === THEMES.DARK ? THEMES.LIGHT : THEMES.DARK}`
        );
        document.body.classList.add(`theme-${theme}`);
        localStorage.setItem(LOCAL_STORAGE_KEY, theme);
      });
    }

    /* src/icons/sun.svg generated by Svelte v3.20.1 */

    function create_fragment(ctx) {
    	let svg;
    	let title;
    	let t;
    	let path0;
    	let g;
    	let circle0;
    	let circle1;
    	let circle2;
    	let circle3;
    	let circle4;
    	let circle5;
    	let circle6;
    	let circle7;
    	let path1;

    	let svg_levels = [
    		{ xmlns: "http://www.w3.org/2000/svg" },
    		{ viewBox: "0 0 36 36" },
    		/*$$props*/ ctx[0]
    	];

    	let svg_data = {};

    	for (let i = 0; i < svg_levels.length; i += 1) {
    		svg_data = assign(svg_data, svg_levels[i]);
    	}

    	return {
    		c() {
    			svg = svg_element("svg");
    			title = svg_element("title");
    			t = text("Light theme on: Sun");
    			path0 = svg_element("path");
    			g = svg_element("g");
    			circle0 = svg_element("circle");
    			circle1 = svg_element("circle");
    			circle2 = svg_element("circle");
    			circle3 = svg_element("circle");
    			circle4 = svg_element("circle");
    			circle5 = svg_element("circle");
    			circle6 = svg_element("circle");
    			circle7 = svg_element("circle");
    			path1 = svg_element("path");
    			this.h();
    		},
    		l(nodes) {
    			svg = claim_element(nodes, "svg", { xmlns: true, viewBox: true }, 1);
    			var svg_nodes = children(svg);
    			title = claim_element(svg_nodes, "title", {}, 1);
    			var title_nodes = children(title);
    			t = claim_text(title_nodes, "Light theme on: Sun");
    			title_nodes.forEach(detach);
    			path0 = claim_element(svg_nodes, "path", { fill: true, d: true }, 1);
    			children(path0).forEach(detach);
    			g = claim_element(svg_nodes, "g", { fill: true }, 1);
    			var g_nodes = children(g);
    			circle0 = claim_element(g_nodes, "circle", { cx: true, cy: true, r: true }, 1);
    			children(circle0).forEach(detach);
    			circle1 = claim_element(g_nodes, "circle", { cx: true, cy: true, r: true }, 1);
    			children(circle1).forEach(detach);
    			circle2 = claim_element(g_nodes, "circle", { cx: true, cy: true, r: true }, 1);
    			children(circle2).forEach(detach);
    			circle3 = claim_element(g_nodes, "circle", { cx: true, cy: true, r: true }, 1);
    			children(circle3).forEach(detach);
    			circle4 = claim_element(g_nodes, "circle", { cx: true, cy: true, r: true }, 1);
    			children(circle4).forEach(detach);
    			circle5 = claim_element(g_nodes, "circle", { cx: true, cy: true, r: true }, 1);
    			children(circle5).forEach(detach);
    			circle6 = claim_element(g_nodes, "circle", { cx: true, cy: true, r: true }, 1);
    			children(circle6).forEach(detach);
    			circle7 = claim_element(g_nodes, "circle", { cx: true, cy: true, r: true }, 1);
    			children(circle7).forEach(detach);
    			g_nodes.forEach(detach);
    			path1 = claim_element(svg_nodes, "path", { d: true, fill: true }, 1);
    			children(path1).forEach(detach);
    			svg_nodes.forEach(detach);
    			this.h();
    		},
    		h() {
    			attr(path0, "fill", "#FFD983");
    			attr(path0, "d", "M36 18c0 9.941-8.059 18-18 18S0 27.941 0 18 8.059 0 18 0s18 8.059 18 18");
    			attr(circle0, "cx", "9.5");
    			attr(circle0, "cy", "7.5");
    			attr(circle0, "r", "3.5");
    			attr(circle1, "cx", "24.5");
    			attr(circle1, "cy", "28.5");
    			attr(circle1, "r", "3.5");
    			attr(circle2, "cx", "22");
    			attr(circle2, "cy", "5");
    			attr(circle2, "r", "2");
    			attr(circle3, "cx", "3");
    			attr(circle3, "cy", "18");
    			attr(circle3, "r", "1");
    			attr(circle4, "cx", "30");
    			attr(circle4, "cy", "9");
    			attr(circle4, "r", "1");
    			attr(circle5, "cx", "16");
    			attr(circle5, "cy", "31");
    			attr(circle5, "r", "1");
    			attr(circle6, "cx", "32");
    			attr(circle6, "cy", "19");
    			attr(circle6, "r", "2");
    			attr(circle7, "cx", "6");
    			attr(circle7, "cy", "26");
    			attr(circle7, "r", "2");
    			attr(g, "fill", "#FFCC4D");
    			attr(path1, "d", "M18 24.904c-7 0-9-2.618-9-1.381C9 24.762 13 28 18 28s9-3.238\n    9-4.477c0-1.237-2 1.381-9 1.381M27 15c0 1.657-1.344 3-3 3s-3-1.343-3-3\n    1.344-3 3-3 3 1.343 3 3m-12 0c0 1.657-1.344 3-3 3s-3-1.343-3-3 1.344-3 3-3 3\n    1.343 3 3");
    			attr(path1, "fill", "#292F33");
    			set_svg_attributes(svg, svg_data);
    		},
    		m(target, anchor) {
    			insert(target, svg, anchor);
    			append(svg, title);
    			append(title, t);
    			append(svg, path0);
    			append(svg, g);
    			append(g, circle0);
    			append(g, circle1);
    			append(g, circle2);
    			append(g, circle3);
    			append(g, circle4);
    			append(g, circle5);
    			append(g, circle6);
    			append(g, circle7);
    			append(svg, path1);
    		},
    		p(ctx, [dirty]) {
    			set_svg_attributes(svg, get_spread_update(svg_levels, [
    				{ xmlns: "http://www.w3.org/2000/svg" },
    				{ viewBox: "0 0 36 36" },
    				dirty & /*$$props*/ 1 && /*$$props*/ ctx[0]
    			]));
    		},
    		i: noop,
    		o: noop,
    		d(detaching) {
    			if (detaching) detach(svg);
    		}
    	};
    }

    function instance($$self, $$props, $$invalidate) {
    	$$self.$set = $$new_props => {
    		$$invalidate(0, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    	};

    	$$props = exclude_internal_props($$props);
    	return [$$props];
    }

    class sun extends SvelteComponent {
    	constructor(options) {
    		super();
    		init(this, options, instance, create_fragment, safe_not_equal, {});
    	}
    }

    /* src/icons/moon.svg generated by Svelte v3.20.1 */

    function create_fragment$1(ctx) {
    	let svg;
    	let title;
    	let t;
    	let circle0;
    	let path;
    	let circle1;
    	let circle2;
    	let circle3;
    	let circle4;
    	let circle5;
    	let circle6;
    	let circle7;
    	let circle8;
    	let circle9;

    	let svg_levels = [
    		{ xmlns: "http://www.w3.org/2000/svg" },
    		{ viewBox: "0 0 36 36" },
    		/*$$props*/ ctx[0]
    	];

    	let svg_data = {};

    	for (let i = 0; i < svg_levels.length; i += 1) {
    		svg_data = assign(svg_data, svg_levels[i]);
    	}

    	return {
    		c() {
    			svg = svg_element("svg");
    			title = svg_element("title");
    			t = text("Dark theme on: Moon");
    			circle0 = svg_element("circle");
    			path = svg_element("path");
    			circle1 = svg_element("circle");
    			circle2 = svg_element("circle");
    			circle3 = svg_element("circle");
    			circle4 = svg_element("circle");
    			circle5 = svg_element("circle");
    			circle6 = svg_element("circle");
    			circle7 = svg_element("circle");
    			circle8 = svg_element("circle");
    			circle9 = svg_element("circle");
    			this.h();
    		},
    		l(nodes) {
    			svg = claim_element(nodes, "svg", { xmlns: true, viewBox: true }, 1);
    			var svg_nodes = children(svg);
    			title = claim_element(svg_nodes, "title", {}, 1);
    			var title_nodes = children(title);
    			t = claim_text(title_nodes, "Dark theme on: Moon");
    			title_nodes.forEach(detach);
    			circle0 = claim_element(svg_nodes, "circle", { fill: true, cx: true, cy: true, r: true }, 1);
    			children(circle0).forEach(detach);
    			path = claim_element(svg_nodes, "path", { fill: true, d: true }, 1);
    			children(path).forEach(detach);
    			circle1 = claim_element(svg_nodes, "circle", { fill: true, cx: true, cy: true, r: true }, 1);
    			children(circle1).forEach(detach);
    			circle2 = claim_element(svg_nodes, "circle", { fill: true, cx: true, cy: true, r: true }, 1);
    			children(circle2).forEach(detach);
    			circle3 = claim_element(svg_nodes, "circle", { fill: true, cx: true, cy: true, r: true }, 1);
    			children(circle3).forEach(detach);
    			circle4 = claim_element(svg_nodes, "circle", { fill: true, cx: true, cy: true, r: true }, 1);
    			children(circle4).forEach(detach);
    			circle5 = claim_element(svg_nodes, "circle", { fill: true, cx: true, cy: true, r: true }, 1);
    			children(circle5).forEach(detach);
    			circle6 = claim_element(svg_nodes, "circle", { fill: true, cx: true, cy: true, r: true }, 1);
    			children(circle6).forEach(detach);
    			circle7 = claim_element(svg_nodes, "circle", { fill: true, cx: true, cy: true, r: true }, 1);
    			children(circle7).forEach(detach);
    			circle8 = claim_element(svg_nodes, "circle", { fill: true, cx: true, cy: true, r: true }, 1);
    			children(circle8).forEach(detach);
    			circle9 = claim_element(svg_nodes, "circle", { fill: true, cx: true, cy: true, r: true }, 1);
    			children(circle9).forEach(detach);
    			svg_nodes.forEach(detach);
    			this.h();
    		},
    		h() {
    			attr(circle0, "fill", "#FFD983");
    			attr(circle0, "cx", "18");
    			attr(circle0, "cy", "18");
    			attr(circle0, "r", "18");
    			attr(path, "fill", "#66757F");
    			attr(path, "d", "M0 18c0 9.941 8.059 18 18 18 .295 0 .58-.029.87-.043C24.761 33.393 29\n    26.332 29 18 29 9.669 24.761 2.607 18.87.044 18.58.03 18.295 0 18 0 8.059 0\n    0 8.059 0 18z");
    			attr(circle1, "fill", "#5B6876");
    			attr(circle1, "cx", "10.5");
    			attr(circle1, "cy", "8.5");
    			attr(circle1, "r", "3.5");
    			attr(circle2, "fill", "#5B6876");
    			attr(circle2, "cx", "20");
    			attr(circle2, "cy", "16");
    			attr(circle2, "r", "3");
    			attr(circle3, "fill", "#5B6876");
    			attr(circle3, "cx", "21.5");
    			attr(circle3, "cy", "27.5");
    			attr(circle3, "r", "3.5");
    			attr(circle4, "fill", "#5B6876");
    			attr(circle4, "cx", "21");
    			attr(circle4, "cy", "6");
    			attr(circle4, "r", "2");
    			attr(circle5, "fill", "#5B6876");
    			attr(circle5, "cx", "3");
    			attr(circle5, "cy", "18");
    			attr(circle5, "r", "1");
    			attr(circle6, "fill", "#FFCC4D");
    			attr(circle6, "cx", "30");
    			attr(circle6, "cy", "9");
    			attr(circle6, "r", "1");
    			attr(circle7, "fill", "#5B6876");
    			attr(circle7, "cx", "15");
    			attr(circle7, "cy", "31");
    			attr(circle7, "r", "1");
    			attr(circle8, "fill", "#FFCC4D");
    			attr(circle8, "cx", "32");
    			attr(circle8, "cy", "19");
    			attr(circle8, "r", "2");
    			attr(circle9, "fill", "#5B6876");
    			attr(circle9, "cx", "10");
    			attr(circle9, "cy", "23");
    			attr(circle9, "r", "2");
    			set_svg_attributes(svg, svg_data);
    		},
    		m(target, anchor) {
    			insert(target, svg, anchor);
    			append(svg, title);
    			append(title, t);
    			append(svg, circle0);
    			append(svg, path);
    			append(svg, circle1);
    			append(svg, circle2);
    			append(svg, circle3);
    			append(svg, circle4);
    			append(svg, circle5);
    			append(svg, circle6);
    			append(svg, circle7);
    			append(svg, circle8);
    			append(svg, circle9);
    		},
    		p(ctx, [dirty]) {
    			set_svg_attributes(svg, get_spread_update(svg_levels, [
    				{ xmlns: "http://www.w3.org/2000/svg" },
    				{ viewBox: "0 0 36 36" },
    				dirty & /*$$props*/ 1 && /*$$props*/ ctx[0]
    			]));
    		},
    		i: noop,
    		o: noop,
    		d(detaching) {
    			if (detaching) detach(svg);
    		}
    	};
    }

    function instance$1($$self, $$props, $$invalidate) {
    	$$self.$set = $$new_props => {
    		$$invalidate(0, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    	};

    	$$props = exclude_internal_props($$props);
    	return [$$props];
    }

    class moon extends SvelteComponent {
    	constructor(options) {
    		super();
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});
    	}
    }

    /* src/ThemeSwitcher.svelte generated by Svelte v3.20.1 */
    const file = "src/ThemeSwitcher.svelte";

    // (96:4) {:else}
    function create_else_block(ctx) {
    	let current;

    	const sun$1 = new sun({
    			props: {
    				width: /*size*/ ctx[1],
    				height: /*size*/ ctx[1]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(sun$1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(sun$1, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const sun_changes = {};
    			if (dirty & /*size*/ 2) sun_changes.width = /*size*/ ctx[1];
    			if (dirty & /*size*/ 2) sun_changes.height = /*size*/ ctx[1];
    			sun$1.$set(sun_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(sun$1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(sun$1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(sun$1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(96:4) {:else}",
    		ctx
    	});

    	return block;
    }

    // (94:4) {#if isDarkMode}
    function create_if_block(ctx) {
    	let current;

    	const moon$1 = new moon({
    			props: {
    				width: /*size*/ ctx[1],
    				height: /*size*/ ctx[1]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(moon$1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(moon$1, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const moon_changes = {};
    			if (dirty & /*size*/ 2) moon_changes.width = /*size*/ ctx[1];
    			if (dirty & /*size*/ 2) moon_changes.height = /*size*/ ctx[1];
    			moon$1.$set(moon_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(moon$1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(moon$1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(moon$1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(94:4) {#if isDarkMode}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$2(ctx) {
    	let button;
    	let span;
    	let current_block_type_index;
    	let if_block;
    	let button_class_value;
    	let current;
    	let dispose;
    	const if_block_creators = [create_if_block, create_else_block];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*isDarkMode*/ ctx[0]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			button = element("button");
    			span = element("span");
    			if_block.c();
    			attr_dev(span, "class", "theme-switcher__state svelte-38g5hk");
    			add_location(span, file, 92, 2, 2261);
    			attr_dev(button, "class", button_class_value = "theme-switcher " + /*classes*/ ctx[2].join(" ") + " svelte-38g5hk");
    			attr_dev(button, "aria-label", "Switch theme");
    			attr_dev(button, "style", /*style*/ ctx[3]);
    			add_location(button, file, 87, 0, 2142);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor, remount) {
    			insert_dev(target, button, anchor);
    			append_dev(button, span);
    			if_blocks[current_block_type_index].m(span, null);
    			current = true;
    			if (remount) dispose();
    			dispose = listen_dev(button, "click", toggleTheme, false, false, false);
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				}

    				transition_in(if_block, 1);
    				if_block.m(span, null);
    			}

    			if (!current || dirty & /*classes*/ 4 && button_class_value !== (button_class_value = "theme-switcher " + /*classes*/ ctx[2].join(" ") + " svelte-38g5hk")) {
    				attr_dev(button, "class", button_class_value);
    			}

    			if (!current || dirty & /*style*/ 8) {
    				attr_dev(button, "style", /*style*/ ctx[3]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			if_blocks[current_block_type_index].d();
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let $theme;
    	validate_store(theme, "theme");
    	component_subscribe($$self, theme, $$value => $$invalidate(5, $theme = $$value));
    	let { options = DEFAULT_OPTIONS } = $$props;
    	const writable_props = ["options"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<ThemeSwitcher> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("ThemeSwitcher", $$slots, []);

    	$$self.$set = $$props => {
    		if ("options" in $$props) $$invalidate(4, options = $$props.options);
    	};

    	$$self.$capture_state = () => ({
    		setStyles,
    		DEFAULT_OPTIONS,
    		theme,
    		THEMES,
    		toggleTheme,
    		Sun: sun,
    		Moon: moon,
    		options,
    		isDarkMode,
    		$theme,
    		size,
    		OPTIONS,
    		classes,
    		style
    	});

    	$$self.$inject_state = $$props => {
    		if ("options" in $$props) $$invalidate(4, options = $$props.options);
    		if ("isDarkMode" in $$props) $$invalidate(0, isDarkMode = $$props.isDarkMode);
    		if ("size" in $$props) $$invalidate(1, size = $$props.size);
    		if ("OPTIONS" in $$props) $$invalidate(6, OPTIONS = $$props.OPTIONS);
    		if ("classes" in $$props) $$invalidate(2, classes = $$props.classes);
    		if ("style" in $$props) $$invalidate(3, style = $$props.style);
    	};

    	let isDarkMode;
    	let size;
    	let OPTIONS;
    	let classes;
    	let style;

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$theme*/ 32) {
    			 $$invalidate(0, isDarkMode = $theme === THEMES.DARK);
    		}

    		if ($$self.$$.dirty & /*options*/ 16) {
    			 $$invalidate(6, OPTIONS = { ...DEFAULT_OPTIONS, ...options });
    		}

    		if ($$self.$$.dirty & /*OPTIONS*/ 64) {
    			 $$invalidate(1, size = Number(String(OPTIONS.height).split("px").shift()));
    		}

    		if ($$self.$$.dirty & /*OPTIONS, isDarkMode*/ 65) {
    			 $$invalidate(2, classes = [
    				...[OPTIONS.classList].flat(),
    				isDarkMode
    				? "theme-switcher__state--dark"
    				: "theme-switcher__state--light"
    			]);
    		}

    		if ($$self.$$.dirty & /*OPTIONS*/ 64) {
    			 $$invalidate(3, style = setStyles(OPTIONS));
    		}
    	};

    	return [isDarkMode, size, classes, style, options];
    }

    class ThemeSwitcher extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, { options: 4 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ThemeSwitcher",
    			options,
    			id: create_fragment$2.name
    		});
    	}

    	get options() {
    		throw new Error("<ThemeSwitcher>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set options(value) {
    		throw new Error("<ThemeSwitcher>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* demo/App.svelte generated by Svelte v3.20.1 */
    const file$1 = "demo/App.svelte";

    function create_fragment$3(ctx) {
    	let section;
    	let header;
    	let t0;
    	let ul0;
    	let li0;
    	let a0;
    	let t2;
    	let li1;
    	let a1;
    	let t4;
    	let h1;
    	let t5;
    	let b;
    	let t6;
    	let t7;
    	let t8;
    	let h20;
    	let t10;
    	let ul1;
    	let li2;
    	let t12;
    	let li3;
    	let t14;
    	let li4;
    	let t16;
    	let p;
    	let t18;
    	let ul2;
    	let li5;
    	let span0;
    	let t20;
    	let pre0;
    	let code0;
    	let t22;
    	let t23;
    	let li6;
    	let span1;
    	let t25;
    	let pre1;
    	let code1;
    	let t27;
    	let t28;
    	let h21;
    	let t30;
    	let pre2;
    	let code2;
    	let t32;
    	let pre3;
    	let code3;
    	let current;
    	const themeswitcher = new ThemeSwitcher({ $$inline: true });

    	const block = {
    		c: function create() {
    			section = element("section");
    			header = element("header");
    			create_component(themeswitcher.$$.fragment);
    			t0 = space();
    			ul0 = element("ul");
    			li0 = element("li");
    			a0 = element("a");
    			a0.textContent = "Follow @dev-warner";
    			t2 = space();
    			li1 = element("li");
    			a1 = element("a");
    			a1.textContent = "Star";
    			t4 = space();
    			h1 = element("h1");
    			t5 = text("What a lovely\n    ");
    			b = element("b");
    			t6 = text(/*$theme*/ ctx[0]);
    			t7 = text("\n    theme you have!");
    			t8 = space();
    			h20 = element("h2");
    			h20.textContent = "Features";
    			t10 = space();
    			ul1 = element("ul");
    			li2 = element("li");
    			li2.textContent = "Selection gets persisted";
    			t12 = space();
    			li3 = element("li");
    			li3.textContent = "Theme reacts to user preferences";
    			t14 = space();
    			li4 = element("li");
    			li4.textContent = "You get a lovely happy switch button";
    			t16 = space();
    			p = element("p");
    			p.textContent = "Fancy stuff, you should open up your OS settings and see this site react to\n    your preferences.";
    			t18 = space();
    			ul2 = element("ul");
    			li5 = element("li");
    			span0 = element("span");
    			span0.textContent = "Mac OS:";
    			t20 = space();
    			pre0 = element("pre");
    			code0 = element("code");
    			code0.textContent = "Preferences > General > Appearance.";
    			t22 = text("\n      Then select your theme");
    			t23 = space();
    			li6 = element("li");
    			span1 = element("span");
    			span1.textContent = "Windows 10:";
    			t25 = space();
    			pre1 = element("pre");
    			code1 = element("code");
    			code1.textContent = "Settings > Personalization > Colors.";
    			t27 = text("\n      Then scroll down under Choose your mode and select Dark.");
    			t28 = space();
    			h21 = element("h2");
    			h21.textContent = "Try it out";
    			t30 = space();
    			pre2 = element("pre");
    			code2 = element("code");
    			code2.textContent = "$ npm i svelte-theme-switcher";
    			t32 = space();
    			pre3 = element("pre");
    			code3 = element("code");
    			code3.textContent = "$ yarn add svelte-theme-switcher";
    			attr_dev(a0, "class", "github-button");
    			attr_dev(a0, "href", "https://github.com/dev-warner");
    			attr_dev(a0, "data-color-scheme", "no-preference: light; light: light; dark: dark;");
    			attr_dev(a0, "data-size", "large");
    			attr_dev(a0, "aria-label", "Follow @dev-warner on GitHub");
    			add_location(a0, file$1, 67, 8, 983);
    			attr_dev(li0, "class", "header__link svelte-b8h8le");
    			add_location(li0, file$1, 66, 6, 949);
    			attr_dev(a1, "class", "github-button");
    			attr_dev(a1, "href", "https://github.com/dev-warner/svelte-theme-switcher");
    			attr_dev(a1, "data-color-scheme", "no-preference: dark;");
    			attr_dev(a1, "data-icon", "octicon-star");
    			attr_dev(a1, "data-size", "large");
    			attr_dev(a1, "aria-label", "Star dev-warner/svelte-theme-switcher on GitHub");
    			add_location(a1, file$1, 77, 8, 1318);
    			attr_dev(li1, "class", "header__link svelte-b8h8le");
    			add_location(li1, file$1, 76, 6, 1284);
    			attr_dev(ul0, "class", "header__links svelte-b8h8le");
    			add_location(ul0, file$1, 65, 4, 916);
    			attr_dev(header, "class", "header svelte-b8h8le");
    			add_location(header, file$1, 63, 2, 866);
    			add_location(b, file$1, 92, 4, 1700);
    			add_location(h1, file$1, 90, 2, 1673);
    			add_location(h20, file$1, 96, 2, 1747);
    			attr_dev(li2, "class", "svelte-b8h8le");
    			add_location(li2, file$1, 99, 4, 1777);
    			attr_dev(li3, "class", "svelte-b8h8le");
    			add_location(li3, file$1, 100, 4, 1815);
    			attr_dev(li4, "class", "svelte-b8h8le");
    			add_location(li4, file$1, 101, 4, 1861);
    			attr_dev(ul1, "class", "svelte-b8h8le");
    			add_location(ul1, file$1, 98, 2, 1768);
    			attr_dev(p, "class", "svelte-b8h8le");
    			add_location(p, file$1, 104, 2, 1918);
    			add_location(span0, file$1, 111, 6, 2054);
    			attr_dev(code0, "class", "svelte-b8h8le");
    			add_location(code0, file$1, 113, 8, 2095);
    			add_location(pre0, file$1, 112, 6, 2081);
    			attr_dev(li5, "class", "svelte-b8h8le");
    			add_location(li5, file$1, 110, 4, 2043);
    			add_location(span1, file$1, 118, 6, 2211);
    			attr_dev(code1, "class", "svelte-b8h8le");
    			add_location(code1, file$1, 120, 8, 2256);
    			add_location(pre1, file$1, 119, 6, 2242);
    			attr_dev(li6, "class", "svelte-b8h8le");
    			add_location(li6, file$1, 117, 4, 2200);
    			attr_dev(ul2, "class", "svelte-b8h8le");
    			add_location(ul2, file$1, 109, 2, 2034);
    			add_location(h21, file$1, 126, 2, 2403);
    			attr_dev(code2, "class", "svelte-b8h8le");
    			add_location(code2, file$1, 129, 4, 2436);
    			add_location(pre2, file$1, 128, 2, 2426);
    			attr_dev(code3, "class", "svelte-b8h8le");
    			add_location(code3, file$1, 133, 4, 2501);
    			add_location(pre3, file$1, 132, 2, 2491);
    			attr_dev(section, "class", "container svelte-b8h8le");
    			add_location(section, file$1, 62, 0, 836);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, section, anchor);
    			append_dev(section, header);
    			mount_component(themeswitcher, header, null);
    			append_dev(header, t0);
    			append_dev(header, ul0);
    			append_dev(ul0, li0);
    			append_dev(li0, a0);
    			append_dev(ul0, t2);
    			append_dev(ul0, li1);
    			append_dev(li1, a1);
    			append_dev(section, t4);
    			append_dev(section, h1);
    			append_dev(h1, t5);
    			append_dev(h1, b);
    			append_dev(b, t6);
    			append_dev(h1, t7);
    			append_dev(section, t8);
    			append_dev(section, h20);
    			append_dev(section, t10);
    			append_dev(section, ul1);
    			append_dev(ul1, li2);
    			append_dev(ul1, t12);
    			append_dev(ul1, li3);
    			append_dev(ul1, t14);
    			append_dev(ul1, li4);
    			append_dev(section, t16);
    			append_dev(section, p);
    			append_dev(section, t18);
    			append_dev(section, ul2);
    			append_dev(ul2, li5);
    			append_dev(li5, span0);
    			append_dev(li5, t20);
    			append_dev(li5, pre0);
    			append_dev(pre0, code0);
    			append_dev(li5, t22);
    			append_dev(ul2, t23);
    			append_dev(ul2, li6);
    			append_dev(li6, span1);
    			append_dev(li6, t25);
    			append_dev(li6, pre1);
    			append_dev(pre1, code1);
    			append_dev(li6, t27);
    			append_dev(section, t28);
    			append_dev(section, h21);
    			append_dev(section, t30);
    			append_dev(section, pre2);
    			append_dev(pre2, code2);
    			append_dev(section, t32);
    			append_dev(section, pre3);
    			append_dev(pre3, code3);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (!current || dirty & /*$theme*/ 1) set_data_dev(t6, /*$theme*/ ctx[0]);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(themeswitcher.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(themeswitcher.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(section);
    			destroy_component(themeswitcher);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let $theme;
    	validate_store(theme, "theme");
    	component_subscribe($$self, theme, $$value => $$invalidate(0, $theme = $$value));
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("App", $$slots, []);
    	$$self.$capture_state = () => ({ ThemeSwitcher, theme, $theme });
    	return [$theme];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment$3.name
    		});
    	}
    }

    const app = new App({
      target: document.body
    });

    return app;

}());
//# sourceMappingURL=bundle.js.map
