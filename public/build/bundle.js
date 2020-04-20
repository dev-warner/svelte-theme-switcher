
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
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia(MATCH_DARK_THEME).matches;

    const STORED =
      typeof window !== "undefined" && localStorage.getItem(LOCAL_STORAGE_KEY);

    const DEFAULT_THEME = STORED
      ? STORED
      : IS_USER_PREFERNCE_DARK
      ? THEMES.DARK
      : THEMES.LIGHT;

    onChange(DEFAULT_THEME);

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

    function onChange(theme) {
      document.documentElement.classList.remove(
        `theme-${theme === THEMES.DARK ? THEMES.LIGHT : THEMES.DARK}`
      );
      document.documentElement.classList.add(`theme-${theme}`);
      localStorage.setItem(LOCAL_STORAGE_KEY, theme);
    }

    if (typeof window !== "undefined") {
      window.matchMedia &&
        window.matchMedia(MATCH_DARK_THEME).addListener(onSystemThemeChange);

      theme.subscribe((theme) => {
        onChange(theme);
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

    // (105:4) {:else}
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
    		source: "(105:4) {:else}",
    		ctx
    	});

    	return block;
    }

    // (103:4) {#if isDarkMode}
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
    		source: "(103:4) {#if isDarkMode}",
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
    			attr_dev(span, "class", "theme-switcher__state svelte-17stncj");
    			add_location(span, file, 101, 2, 2599);
    			attr_dev(button, "class", button_class_value = "theme-switcher " + /*classes*/ ctx[2].join(" ") + " svelte-17stncj");
    			attr_dev(button, "aria-label", "Switch theme");
    			attr_dev(button, "style", /*style*/ ctx[3]);
    			add_location(button, file, 96, 0, 2480);
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

    			if (!current || dirty & /*classes*/ 4 && button_class_value !== (button_class_value = "theme-switcher " + /*classes*/ ctx[2].join(" ") + " svelte-17stncj")) {
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
    	let li5;
    	let t17;
    	let a2;
    	let t19;
    	let p;
    	let t21;
    	let ul2;
    	let li6;
    	let span0;
    	let t23;
    	let pre0;
    	let code0;
    	let t25;
    	let t26;
    	let li7;
    	let span1;
    	let t28;
    	let pre1;
    	let code1;
    	let t30;
    	let t31;
    	let h21;
    	let t33;
    	let pre2;
    	let code2;
    	let t35;
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
    			li5 = element("li");
    			t17 = text("Can be used as a web component\n      ");
    			a2 = element("a");
    			a2.textContent = "demo here";
    			t19 = space();
    			p = element("p");
    			p.textContent = "Fancy stuff, you should open up your OS settings and see this site react to\n    your preferences.";
    			t21 = space();
    			ul2 = element("ul");
    			li6 = element("li");
    			span0 = element("span");
    			span0.textContent = "Mac OS:";
    			t23 = space();
    			pre0 = element("pre");
    			code0 = element("code");
    			code0.textContent = "Preferences > General > Appearance.";
    			t25 = text("\n      Then select your theme");
    			t26 = space();
    			li7 = element("li");
    			span1 = element("span");
    			span1.textContent = "Windows 10:";
    			t28 = space();
    			pre1 = element("pre");
    			code1 = element("code");
    			code1.textContent = "Settings > Personalization > Colors.";
    			t30 = text("\n      Then scroll down under Choose your mode and select Dark.");
    			t31 = space();
    			h21 = element("h2");
    			h21.textContent = "Try it out";
    			t33 = space();
    			pre2 = element("pre");
    			code2 = element("code");
    			code2.textContent = "$ npm i svelte-theme-switcher";
    			t35 = space();
    			pre3 = element("pre");
    			code3 = element("code");
    			code3.textContent = "$ yarn add svelte-theme-switcher";
    			attr_dev(a0, "class", "github-button svelte-32xdr0");
    			attr_dev(a0, "href", "https://github.com/dev-warner");
    			attr_dev(a0, "data-color-scheme", "no-preference: light; light: light; dark: dark;");
    			attr_dev(a0, "data-size", "large");
    			attr_dev(a0, "aria-label", "Follow @dev-warner on GitHub");
    			add_location(a0, file$1, 68, 8, 986);
    			attr_dev(li0, "class", "header__link svelte-32xdr0");
    			add_location(li0, file$1, 67, 6, 952);
    			attr_dev(a1, "class", "github-button svelte-32xdr0");
    			attr_dev(a1, "href", "https://github.com/dev-warner/svelte-theme-switcher");
    			attr_dev(a1, "data-color-scheme", "no-preference: dark;");
    			attr_dev(a1, "data-icon", "octicon-star");
    			attr_dev(a1, "data-size", "large");
    			attr_dev(a1, "aria-label", "Star dev-warner/svelte-theme-switcher on GitHub");
    			add_location(a1, file$1, 78, 8, 1321);
    			attr_dev(li1, "class", "header__link svelte-32xdr0");
    			add_location(li1, file$1, 77, 6, 1287);
    			attr_dev(ul0, "class", "header__links svelte-32xdr0");
    			add_location(ul0, file$1, 66, 4, 919);
    			attr_dev(header, "class", "header svelte-32xdr0");
    			add_location(header, file$1, 64, 2, 869);
    			add_location(b, file$1, 93, 4, 1703);
    			add_location(h1, file$1, 91, 2, 1676);
    			add_location(h20, file$1, 97, 2, 1750);
    			attr_dev(li2, "class", "svelte-32xdr0");
    			add_location(li2, file$1, 100, 4, 1780);
    			attr_dev(li3, "class", "svelte-32xdr0");
    			add_location(li3, file$1, 101, 4, 1818);
    			attr_dev(li4, "class", "svelte-32xdr0");
    			add_location(li4, file$1, 102, 4, 1864);
    			attr_dev(a2, "href", "/web-components");
    			attr_dev(a2, "class", "svelte-32xdr0");
    			add_location(a2, file$1, 105, 6, 1962);
    			attr_dev(li5, "class", "svelte-32xdr0");
    			add_location(li5, file$1, 103, 4, 1914);
    			attr_dev(ul1, "class", "svelte-32xdr0");
    			add_location(ul1, file$1, 99, 2, 1771);
    			attr_dev(p, "class", "svelte-32xdr0");
    			add_location(p, file$1, 109, 2, 2023);
    			add_location(span0, file$1, 116, 6, 2159);
    			attr_dev(code0, "class", "svelte-32xdr0");
    			add_location(code0, file$1, 118, 8, 2200);
    			add_location(pre0, file$1, 117, 6, 2186);
    			attr_dev(li6, "class", "svelte-32xdr0");
    			add_location(li6, file$1, 115, 4, 2148);
    			add_location(span1, file$1, 123, 6, 2316);
    			attr_dev(code1, "class", "svelte-32xdr0");
    			add_location(code1, file$1, 125, 8, 2361);
    			add_location(pre1, file$1, 124, 6, 2347);
    			attr_dev(li7, "class", "svelte-32xdr0");
    			add_location(li7, file$1, 122, 4, 2305);
    			attr_dev(ul2, "class", "svelte-32xdr0");
    			add_location(ul2, file$1, 114, 2, 2139);
    			add_location(h21, file$1, 131, 2, 2508);
    			attr_dev(code2, "class", "svelte-32xdr0");
    			add_location(code2, file$1, 134, 4, 2541);
    			add_location(pre2, file$1, 133, 2, 2531);
    			attr_dev(code3, "class", "svelte-32xdr0");
    			add_location(code3, file$1, 138, 4, 2606);
    			add_location(pre3, file$1, 137, 2, 2596);
    			attr_dev(section, "class", "container svelte-32xdr0");
    			add_location(section, file$1, 63, 0, 839);
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
    			append_dev(ul1, t16);
    			append_dev(ul1, li5);
    			append_dev(li5, t17);
    			append_dev(li5, a2);
    			append_dev(section, t19);
    			append_dev(section, p);
    			append_dev(section, t21);
    			append_dev(section, ul2);
    			append_dev(ul2, li6);
    			append_dev(li6, span0);
    			append_dev(li6, t23);
    			append_dev(li6, pre0);
    			append_dev(pre0, code0);
    			append_dev(li6, t25);
    			append_dev(ul2, t26);
    			append_dev(ul2, li7);
    			append_dev(li7, span1);
    			append_dev(li7, t28);
    			append_dev(li7, pre1);
    			append_dev(pre1, code1);
    			append_dev(li7, t30);
    			append_dev(section, t31);
    			append_dev(section, h21);
    			append_dev(section, t33);
    			append_dev(section, pre2);
    			append_dev(pre2, code2);
    			append_dev(section, t35);
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
