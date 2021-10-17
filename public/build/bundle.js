
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
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
    let src_url_equal_anchor;
    function src_url_equal(element_src, url) {
        if (!src_url_equal_anchor) {
            src_url_equal_anchor = document.createElement('a');
        }
        src_url_equal_anchor.href = url;
        return element_src === src_url_equal_anchor.href;
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
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
    function set_store_value(store, ret, value) {
        store.set(value);
        return ret;
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
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
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
    function to_number(value) {
        return value === '' ? null : +value;
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_input_value(input, value) {
        input.value = value == null ? '' : value;
    }
    function set_style(node, key, value, important) {
        node.style.setProperty(key, value, important ? 'important' : '');
    }
    function toggle_class(element, name, toggle) {
        element.classList[toggle ? 'add' : 'remove'](name);
    }
    function custom_event(type, detail, bubbles = false) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, false, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error('Function called outside component initialization');
        return current_component;
    }
    function onDestroy(fn) {
        get_current_component().$$.on_destroy.push(fn);
    }
    function createEventDispatcher() {
        const component = get_current_component();
        return (type, detail) => {
            const callbacks = component.$$.callbacks[type];
            if (callbacks) {
                // TODO are there situations where events could be dispatched
                // in a server (non-DOM) environment?
                const event = custom_event(type, detail);
                callbacks.slice().forEach(fn => {
                    fn.call(component, event);
                });
            }
        };
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
    function add_flush_callback(fn) {
        flush_callbacks.push(fn);
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
            set_current_component(null);
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

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);

    function bind(component, name, callback) {
        const index = component.$$.props[name];
        if (index !== undefined) {
            component.$$.bound[index] = callback;
            callback(component.$$.ctx[index]);
        }
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
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
        }
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
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
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
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
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
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
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
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.44.0' }, detail), true));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function prop_dev(node, property, value) {
        node[property] = value;
        dispatch_dev('SvelteDOMSetProperty', { node, property, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    /* src/Task.svelte generated by Svelte v3.44.0 */
    const file$4 = "src/Task.svelte";

    function create_fragment$4(ctx) {
    	let tr;
    	let td0;
    	let input0;
    	let t0;
    	let td1;
    	let input1;
    	let t1;
    	let t2;
    	let td2;
    	let input2;
    	let t3;
    	let td3;
    	let button0;
    	let img0;
    	let img0_src_value;
    	let t4;
    	let td4;
    	let button1;
    	let img1;
    	let img1_src_value;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			tr = element("tr");
    			td0 = element("td");
    			input0 = element("input");
    			t0 = space();
    			td1 = element("td");
    			input1 = element("input");
    			t1 = text(" min");
    			t2 = space();
    			td2 = element("td");
    			input2 = element("input");
    			t3 = space();
    			td3 = element("td");
    			button0 = element("button");
    			img0 = element("img");
    			t4 = space();
    			td4 = element("td");
    			button1 = element("button");
    			img1 = element("img");
    			attr_dev(input0, "type", "text");
    			input0.disabled = /*disabled*/ ctx[3];
    			attr_dev(input0, "class", "svelte-1nhaj3o");
    			add_location(input0, file$4, 23, 6, 465);
    			add_location(td0, file$4, 23, 2, 461);
    			attr_dev(input1, "type", "number");
    			attr_dev(input1, "min", "0");
    			attr_dev(input1, "max", "90");
    			input1.disabled = /*disabled*/ ctx[3];
    			attr_dev(input1, "class", "svelte-1nhaj3o");
    			add_location(input1, file$4, 25, 5, 532);
    			add_location(td1, file$4, 24, 2, 523);
    			attr_dev(input2, "type", "checkbox");
    			input2.disabled = /*disabled*/ ctx[3];
    			attr_dev(input2, "class", "svelte-1nhaj3o");
    			add_location(input2, file$4, 27, 6, 620);
    			add_location(td2, file$4, 27, 2, 616);
    			if (!src_url_equal(img0.src, img0_src_value = "images/edit.svg")) attr_dev(img0, "src", img0_src_value);
    			attr_dev(img0, "alt", "Edit Item");
    			attr_dev(img0, "class", "svelte-1nhaj3o");
    			add_location(img0, file$4, 30, 7, 739);
    			attr_dev(button0, "class", "svelte-1nhaj3o");
    			toggle_class(button0, "active", /*active*/ ctx[4]);
    			add_location(button0, file$4, 29, 5, 693);
    			add_location(td3, file$4, 28, 2, 684);
    			if (!src_url_equal(img1.src, img1_src_value = "images/trash-alt.svg")) attr_dev(img1, "src", img1_src_value);
    			attr_dev(img1, "alt", "Remove Item");
    			attr_dev(img1, "class", "svelte-1nhaj3o");
    			add_location(img1, file$4, 33, 14, 821);
    			attr_dev(button1, "class", "svelte-1nhaj3o");
    			add_location(button1, file$4, 33, 6, 813);
    			add_location(td4, file$4, 33, 2, 809);
    			add_location(tr, file$4, 22, 0, 454);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tr, anchor);
    			append_dev(tr, td0);
    			append_dev(td0, input0);
    			set_input_value(input0, /*name*/ ctx[0]);
    			append_dev(tr, t0);
    			append_dev(tr, td1);
    			append_dev(td1, input1);
    			set_input_value(input1, /*time*/ ctx[1]);
    			append_dev(td1, t1);
    			append_dev(tr, t2);
    			append_dev(tr, td2);
    			append_dev(td2, input2);
    			input2.checked = /*done*/ ctx[2];
    			append_dev(tr, t3);
    			append_dev(tr, td3);
    			append_dev(td3, button0);
    			append_dev(button0, img0);
    			append_dev(tr, t4);
    			append_dev(tr, td4);
    			append_dev(td4, button1);
    			append_dev(button1, img1);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input0, "input", /*input0_input_handler*/ ctx[7]),
    					listen_dev(input1, "input", /*input1_input_handler*/ ctx[8]),
    					listen_dev(input2, "change", /*input2_change_handler*/ ctx[9]),
    					listen_dev(button0, "click", /*toggle*/ ctx[5], false, false, false),
    					listen_dev(img1, "click", /*remove*/ ctx[6], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*disabled*/ 8) {
    				prop_dev(input0, "disabled", /*disabled*/ ctx[3]);
    			}

    			if (dirty & /*name*/ 1 && input0.value !== /*name*/ ctx[0]) {
    				set_input_value(input0, /*name*/ ctx[0]);
    			}

    			if (dirty & /*disabled*/ 8) {
    				prop_dev(input1, "disabled", /*disabled*/ ctx[3]);
    			}

    			if (dirty & /*time*/ 2 && to_number(input1.value) !== /*time*/ ctx[1]) {
    				set_input_value(input1, /*time*/ ctx[1]);
    			}

    			if (dirty & /*disabled*/ 8) {
    				prop_dev(input2, "disabled", /*disabled*/ ctx[3]);
    			}

    			if (dirty & /*done*/ 4) {
    				input2.checked = /*done*/ ctx[2];
    			}

    			if (dirty & /*active*/ 16) {
    				toggle_class(button0, "active", /*active*/ ctx[4]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Task', slots, []);
    	let { name, time, done } = $$props;
    	let disabled = true;
    	let active = false;
    	let oldtime = time;

    	function toggle() {
    		if (active && (time > 90 || time < 0 || !time)) {
    			$$invalidate(1, time = oldtime);
    		} else {
    			oldtime = time;
    		}

    		$$invalidate(3, disabled = !disabled);
    		$$invalidate(4, active = !active);
    	}

    	const dispatch = createEventDispatcher();

    	function remove() {
    		dispatch('delete');
    	}

    	const writable_props = ['name', 'time', 'done'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Task> was created with unknown prop '${key}'`);
    	});

    	function input0_input_handler() {
    		name = this.value;
    		$$invalidate(0, name);
    	}

    	function input1_input_handler() {
    		time = to_number(this.value);
    		$$invalidate(1, time);
    	}

    	function input2_change_handler() {
    		done = this.checked;
    		$$invalidate(2, done);
    	}

    	$$self.$$set = $$props => {
    		if ('name' in $$props) $$invalidate(0, name = $$props.name);
    		if ('time' in $$props) $$invalidate(1, time = $$props.time);
    		if ('done' in $$props) $$invalidate(2, done = $$props.done);
    	};

    	$$self.$capture_state = () => ({
    		name,
    		time,
    		done,
    		disabled,
    		active,
    		oldtime,
    		toggle,
    		createEventDispatcher,
    		dispatch,
    		remove
    	});

    	$$self.$inject_state = $$props => {
    		if ('name' in $$props) $$invalidate(0, name = $$props.name);
    		if ('time' in $$props) $$invalidate(1, time = $$props.time);
    		if ('done' in $$props) $$invalidate(2, done = $$props.done);
    		if ('disabled' in $$props) $$invalidate(3, disabled = $$props.disabled);
    		if ('active' in $$props) $$invalidate(4, active = $$props.active);
    		if ('oldtime' in $$props) oldtime = $$props.oldtime;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		name,
    		time,
    		done,
    		disabled,
    		active,
    		toggle,
    		remove,
    		input0_input_handler,
    		input1_input_handler,
    		input2_change_handler
    	];
    }

    class Task extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, { name: 0, time: 1, done: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Task",
    			options,
    			id: create_fragment$4.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*name*/ ctx[0] === undefined && !('name' in props)) {
    			console.warn("<Task> was created without expected prop 'name'");
    		}

    		if (/*time*/ ctx[1] === undefined && !('time' in props)) {
    			console.warn("<Task> was created without expected prop 'time'");
    		}

    		if (/*done*/ ctx[2] === undefined && !('done' in props)) {
    			console.warn("<Task> was created without expected prop 'done'");
    		}
    	}

    	get name() {
    		throw new Error("<Task>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set name(value) {
    		throw new Error("<Task>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get time() {
    		throw new Error("<Task>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set time(value) {
    		throw new Error("<Task>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get done() {
    		throw new Error("<Task>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set done(value) {
    		throw new Error("<Task>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    const subscriber_queue = [];
    /**
     * Create a `Writable` store that allows both updating and reading by subscription.
     * @param {*=}value initial value
     * @param {StartStopNotifier=}start start and stop notifications for subscriptions
     */
    function writable(value, start = noop) {
        let stop;
        const subscribers = new Set();
        function set(new_value) {
            if (safe_not_equal(value, new_value)) {
                value = new_value;
                if (stop) { // store is ready
                    const run_queue = !subscriber_queue.length;
                    for (const subscriber of subscribers) {
                        subscriber[1]();
                        subscriber_queue.push(subscriber, value);
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
            subscribers.add(subscriber);
            if (subscribers.size === 1) {
                stop = start(set) || noop;
            }
            run(value);
            return () => {
                subscribers.delete(subscriber);
                if (subscribers.size === 0) {
                    stop();
                    stop = null;
                }
            };
        }
        return { set, update, subscribe };
    }

    let userList = writable([]);

    /* src/Tasklist.svelte generated by Svelte v3.44.0 */
    const file$3 = "src/Tasklist.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[13] = list[i].name;
    	child_ctx[14] = list[i].time;
    	child_ctx[15] = list[i].done;
    	child_ctx[16] = list;
    	child_ctx[17] = i;
    	return child_ctx;
    }

    // (34:4) {#each $userList as { name, time, done }
    function create_each_block$1(ctx) {
    	let task;
    	let updating_name;
    	let updating_time;
    	let updating_done;
    	let current;

    	function task_name_binding(value) {
    		/*task_name_binding*/ ctx[6](value, /*name*/ ctx[13], /*each_value*/ ctx[16], /*id*/ ctx[17]);
    	}

    	function task_time_binding(value) {
    		/*task_time_binding*/ ctx[7](value, /*time*/ ctx[14], /*each_value*/ ctx[16], /*id*/ ctx[17]);
    	}

    	function task_done_binding(value) {
    		/*task_done_binding*/ ctx[8](value, /*done*/ ctx[15], /*each_value*/ ctx[16], /*id*/ ctx[17]);
    	}

    	function delete_handler() {
    		return /*delete_handler*/ ctx[9](/*id*/ ctx[17]);
    	}

    	let task_props = {};

    	if (/*name*/ ctx[13] !== void 0) {
    		task_props.name = /*name*/ ctx[13];
    	}

    	if (/*time*/ ctx[14] !== void 0) {
    		task_props.time = /*time*/ ctx[14];
    	}

    	if (/*done*/ ctx[15] !== void 0) {
    		task_props.done = /*done*/ ctx[15];
    	}

    	task = new Task({ props: task_props, $$inline: true });
    	binding_callbacks.push(() => bind(task, 'name', task_name_binding));
    	binding_callbacks.push(() => bind(task, 'time', task_time_binding));
    	binding_callbacks.push(() => bind(task, 'done', task_done_binding));
    	task.$on("delete", delete_handler);

    	const block = {
    		c: function create() {
    			create_component(task.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(task, target, anchor);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			const task_changes = {};

    			if (!updating_name && dirty & /*$userList*/ 8) {
    				updating_name = true;
    				task_changes.name = /*name*/ ctx[13];
    				add_flush_callback(() => updating_name = false);
    			}

    			if (!updating_time && dirty & /*$userList*/ 8) {
    				updating_time = true;
    				task_changes.time = /*time*/ ctx[14];
    				add_flush_callback(() => updating_time = false);
    			}

    			if (!updating_done && dirty & /*$userList*/ 8) {
    				updating_done = true;
    				task_changes.done = /*done*/ ctx[15];
    				add_flush_callback(() => updating_done = false);
    			}

    			task.$set(task_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(task.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(task.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(task, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(34:4) {#each $userList as { name, time, done }",
    		ctx
    	});

    	return block;
    }

    function create_fragment$3(ctx) {
    	let table;
    	let thead;
    	let th0;
    	let t1;
    	let th1;
    	let t3;
    	let th2;
    	let t5;
    	let th3;
    	let t7;
    	let th4;
    	let t9;
    	let tbody;
    	let t10;
    	let tfoot;
    	let h4;
    	let t12;
    	let tr;
    	let td0;
    	let input0;
    	let t13;
    	let td1;
    	let input1;
    	let t14;
    	let t15;
    	let td2;
    	let input2;
    	let t16;
    	let td3;
    	let button;
    	let current;
    	let mounted;
    	let dispose;
    	let each_value = /*$userList*/ ctx[3];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			table = element("table");
    			thead = element("thead");
    			th0 = element("th");
    			th0.textContent = "Task:";
    			t1 = space();
    			th1 = element("th");
    			th1.textContent = "Time:";
    			t3 = space();
    			th2 = element("th");
    			th2.textContent = "Done?";
    			t5 = space();
    			th3 = element("th");
    			th3.textContent = "Edit?";
    			t7 = space();
    			th4 = element("th");
    			th4.textContent = "Remove?";
    			t9 = space();
    			tbody = element("tbody");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t10 = space();
    			tfoot = element("tfoot");
    			h4 = element("h4");
    			h4.textContent = "Add Task";
    			t12 = space();
    			tr = element("tr");
    			td0 = element("td");
    			input0 = element("input");
    			t13 = space();
    			td1 = element("td");
    			input1 = element("input");
    			t14 = text(" min");
    			t15 = space();
    			td2 = element("td");
    			input2 = element("input");
    			t16 = space();
    			td3 = element("td");
    			button = element("button");
    			button.textContent = "+";
    			add_location(th0, file$3, 26, 4, 561);
    			add_location(th1, file$3, 27, 4, 580);
    			add_location(th2, file$3, 28, 4, 599);
    			add_location(th3, file$3, 29, 4, 618);
    			add_location(th4, file$3, 30, 4, 637);
    			add_location(thead, file$3, 25, 2, 549);
    			add_location(tbody, file$3, 32, 2, 667);
    			add_location(h4, file$3, 38, 4, 836);
    			attr_dev(input0, "type", "text");
    			add_location(input0, file$3, 40, 10, 873);
    			add_location(td0, file$3, 40, 6, 869);
    			attr_dev(input1, "type", "number");
    			attr_dev(input1, "min", "0");
    			attr_dev(input1, "max", "90");
    			add_location(input1, file$3, 42, 8, 941);
    			add_location(td1, file$3, 41, 6, 928);
    			attr_dev(input2, "type", "checkbox");
    			add_location(input2, file$3, 44, 10, 1030);
    			add_location(td2, file$3, 44, 6, 1026);
    			add_location(button, file$3, 45, 10, 1095);
    			add_location(td3, file$3, 45, 6, 1091);
    			add_location(tr, file$3, 39, 4, 858);
    			add_location(tfoot, file$3, 37, 2, 824);
    			add_location(table, file$3, 24, 0, 539);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, table, anchor);
    			append_dev(table, thead);
    			append_dev(thead, th0);
    			append_dev(thead, t1);
    			append_dev(thead, th1);
    			append_dev(thead, t3);
    			append_dev(thead, th2);
    			append_dev(thead, t5);
    			append_dev(thead, th3);
    			append_dev(thead, t7);
    			append_dev(thead, th4);
    			append_dev(table, t9);
    			append_dev(table, tbody);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(tbody, null);
    			}

    			append_dev(table, t10);
    			append_dev(table, tfoot);
    			append_dev(tfoot, h4);
    			append_dev(tfoot, t12);
    			append_dev(tfoot, tr);
    			append_dev(tr, td0);
    			append_dev(td0, input0);
    			set_input_value(input0, /*nextTask*/ ctx[0]);
    			append_dev(tr, t13);
    			append_dev(tr, td1);
    			append_dev(td1, input1);
    			set_input_value(input1, /*nextTime*/ ctx[1]);
    			append_dev(td1, t14);
    			append_dev(tr, t15);
    			append_dev(tr, td2);
    			append_dev(td2, input2);
    			input2.checked = /*nextDone*/ ctx[2];
    			append_dev(tr, t16);
    			append_dev(tr, td3);
    			append_dev(td3, button);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(input0, "input", /*input0_input_handler*/ ctx[10]),
    					listen_dev(input1, "input", /*input1_input_handler*/ ctx[11]),
    					listen_dev(input2, "change", /*input2_change_handler*/ ctx[12]),
    					listen_dev(button, "click", /*addToUserList*/ ctx[4], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*$userList, remove*/ 40) {
    				each_value = /*$userList*/ ctx[3];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$1(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$1(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(tbody, null);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}

    			if (dirty & /*nextTask*/ 1 && input0.value !== /*nextTask*/ ctx[0]) {
    				set_input_value(input0, /*nextTask*/ ctx[0]);
    			}

    			if (dirty & /*nextTime*/ 2 && to_number(input1.value) !== /*nextTime*/ ctx[1]) {
    				set_input_value(input1, /*nextTime*/ ctx[1]);
    			}

    			if (dirty & /*nextDone*/ 4) {
    				input2.checked = /*nextDone*/ ctx[2];
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(table);
    			destroy_each(each_blocks, detaching);
    			mounted = false;
    			run_all(dispose);
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
    	let $userList;
    	validate_store(userList, 'userList');
    	component_subscribe($$self, userList, $$value => $$invalidate(3, $userList = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Tasklist', slots, []);
    	let nextTask;
    	let nextTime = 25;
    	let nextDone = false;

    	function addToUserList() {
    		if (nextTime === undefined || nextTime > 90 || nextTime < 0) ; else {
    			set_store_value(
    				userList,
    				$userList = [
    					...$userList,
    					{
    						name: nextTask,
    						time: nextTime,
    						done: nextDone
    					}
    				],
    				$userList
    			);

    			$$invalidate(0, nextTask = "");
    			$$invalidate(1, nextTime = 25);
    			$$invalidate(2, nextDone = false);
    		}
    	}

    	function remove(id) {
    		$userList.splice(id, 1);
    		userList.set($userList);
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Tasklist> was created with unknown prop '${key}'`);
    	});

    	function task_name_binding(value, name, each_value, id) {
    		each_value[id].name = value;
    		userList.set($userList);
    	}

    	function task_time_binding(value, time, each_value, id) {
    		each_value[id].time = value;
    		userList.set($userList);
    	}

    	function task_done_binding(value, done, each_value, id) {
    		each_value[id].done = value;
    		userList.set($userList);
    	}

    	const delete_handler = id => remove(id);

    	function input0_input_handler() {
    		nextTask = this.value;
    		$$invalidate(0, nextTask);
    	}

    	function input1_input_handler() {
    		nextTime = to_number(this.value);
    		$$invalidate(1, nextTime);
    	}

    	function input2_change_handler() {
    		nextDone = this.checked;
    		$$invalidate(2, nextDone);
    	}

    	$$self.$capture_state = () => ({
    		Task,
    		userList,
    		nextTask,
    		nextTime,
    		nextDone,
    		addToUserList,
    		remove,
    		$userList
    	});

    	$$self.$inject_state = $$props => {
    		if ('nextTask' in $$props) $$invalidate(0, nextTask = $$props.nextTask);
    		if ('nextTime' in $$props) $$invalidate(1, nextTime = $$props.nextTime);
    		if ('nextDone' in $$props) $$invalidate(2, nextDone = $$props.nextDone);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		nextTask,
    		nextTime,
    		nextDone,
    		$userList,
    		addToUserList,
    		remove,
    		task_name_binding,
    		task_time_binding,
    		task_done_binding,
    		delete_handler,
    		input0_input_handler,
    		input1_input_handler,
    		input2_change_handler
    	];
    }

    class Tasklist extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Tasklist",
    			options,
    			id: create_fragment$3.name
    		});
    	}
    }

    /* src/Header.svelte generated by Svelte v3.44.0 */

    const file$2 = "src/Header.svelte";

    function create_fragment$2(ctx) {
    	let h1;
    	let t0_value = (/*hour*/ ctx[0] % 12 || 12) + "";
    	let t0;
    	let t1;

    	let t2_value = (/*min*/ ctx[1] < 10
    	? "0" + /*min*/ ctx[1]
    	: /*min*/ ctx[1]) + "";

    	let t2;
    	let t3;
    	let t4_value = (/*hour*/ ctx[0] > 12 ? "PM" : "AM") + "";
    	let t4;
    	let t5;
    	let br;
    	let t6;
    	let sub;
    	let t7;
    	let t8;
    	let h2;

    	const block = {
    		c: function create() {
    			h1 = element("h1");
    			t0 = text(t0_value);
    			t1 = text(":");
    			t2 = text(t2_value);
    			t3 = space();
    			t4 = text(t4_value);
    			t5 = space();
    			br = element("br");
    			t6 = space();
    			sub = element("sub");
    			t7 = text(/*desc*/ ctx[2]);
    			t8 = space();
    			h2 = element("h2");
    			h2.textContent = "Musical Pomodoro";
    			add_location(br, file$2, 26, 2, 576);
    			attr_dev(sub, "class", "svelte-1sru9z3");
    			add_location(sub, file$2, 27, 2, 585);
    			attr_dev(h1, "class", "svelte-1sru9z3");
    			add_location(h1, file$2, 23, 0, 492);
    			attr_dev(h2, "class", "svelte-1sru9z3");
    			add_location(h2, file$2, 29, 0, 609);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h1, anchor);
    			append_dev(h1, t0);
    			append_dev(h1, t1);
    			append_dev(h1, t2);
    			append_dev(h1, t3);
    			append_dev(h1, t4);
    			append_dev(h1, t5);
    			append_dev(h1, br);
    			append_dev(h1, t6);
    			append_dev(h1, sub);
    			append_dev(sub, t7);
    			insert_dev(target, t8, anchor);
    			insert_dev(target, h2, anchor);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*hour*/ 1 && t0_value !== (t0_value = (/*hour*/ ctx[0] % 12 || 12) + "")) set_data_dev(t0, t0_value);

    			if (dirty & /*min*/ 2 && t2_value !== (t2_value = (/*min*/ ctx[1] < 10
    			? "0" + /*min*/ ctx[1]
    			: /*min*/ ctx[1]) + "")) set_data_dev(t2, t2_value);

    			if (dirty & /*hour*/ 1 && t4_value !== (t4_value = (/*hour*/ ctx[0] > 12 ? "PM" : "AM") + "")) set_data_dev(t4, t4_value);
    			if (dirty & /*desc*/ 4) set_data_dev(t7, /*desc*/ ctx[2]);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h1);
    			if (detaching) detach_dev(t8);
    			if (detaching) detach_dev(h2);
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
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Header', slots, []);
    	let { version } = $$props;
    	let { hour, min } = $$props;
    	let desc = "";
    	const writable_props = ['version', 'hour', 'min'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Header> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('version' in $$props) $$invalidate(3, version = $$props.version);
    		if ('hour' in $$props) $$invalidate(0, hour = $$props.hour);
    		if ('min' in $$props) $$invalidate(1, min = $$props.min);
    	};

    	$$self.$capture_state = () => ({ version, hour, min, desc });

    	$$self.$inject_state = $$props => {
    		if ('version' in $$props) $$invalidate(3, version = $$props.version);
    		if ('hour' in $$props) $$invalidate(0, hour = $$props.hour);
    		if ('min' in $$props) $$invalidate(1, min = $$props.min);
    		if ('desc' in $$props) $$invalidate(2, desc = $$props.desc);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*hour, version*/ 9) {
    			if (hour === 23) {
    				$$invalidate(2, desc = "Hour of the Rat");
    			} else if (hour === 0) {
    				$$invalidate(2, desc = "Midnight");
    			} else if (hour === 1) {
    				$$invalidate(2, desc = "Hour of the Ox");
    			} else if (hour === 2) {
    				$$invalidate(2, desc = "Late Hour");
    			} else if (hour === 3) {
    				$$invalidate(2, desc = "Hour of the Tiger");
    			} else if (hour === 4) {
    				$$invalidate(2, desc = "Morning Hour");
    			} else if (hour === 5) {
    				$$invalidate(2, desc = "Daybreak");
    			} else {
    				$$invalidate(2, desc = version);
    			}
    		}
    	};

    	return [hour, min, desc, version];
    }

    class Header extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, { version: 3, hour: 0, min: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Header",
    			options,
    			id: create_fragment$2.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*version*/ ctx[3] === undefined && !('version' in props)) {
    			console.warn("<Header> was created without expected prop 'version'");
    		}

    		if (/*hour*/ ctx[0] === undefined && !('hour' in props)) {
    			console.warn("<Header> was created without expected prop 'hour'");
    		}

    		if (/*min*/ ctx[1] === undefined && !('min' in props)) {
    			console.warn("<Header> was created without expected prop 'min'");
    		}
    	}

    	get version() {
    		throw new Error("<Header>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set version(value) {
    		throw new Error("<Header>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get hour() {
    		throw new Error("<Header>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set hour(value) {
    		throw new Error("<Header>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get min() {
    		throw new Error("<Header>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set min(value) {
    		throw new Error("<Header>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/Playlist.svelte generated by Svelte v3.44.0 */
    const file$1 = "src/Playlist.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[17] = list[i].name;
    	child_ctx[18] = list[i].time;
    	child_ctx[19] = list[i].done;
    	child_ctx[20] = list;
    	child_ctx[21] = i;
    	return child_ctx;
    }

    // (76:2) {#if done !== undefined}
    function create_if_block$1(ctx) {
    	let td;
    	let input;
    	let mounted;
    	let dispose;

    	function input_change_handler() {
    		/*input_change_handler*/ ctx[11].call(input, /*each_value*/ ctx[20], /*each_index*/ ctx[21]);
    	}

    	const block = {
    		c: function create() {
    			td = element("td");
    			input = element("input");
    			attr_dev(input, "type", "checkbox");
    			input.disabled = true;
    			attr_dev(input, "class", "svelte-wrrsnf");
    			add_location(input, file$1, 75, 30, 1807);
    			add_location(td, file$1, 75, 26, 1803);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, td, anchor);
    			append_dev(td, input);
    			input.checked = /*done*/ ctx[19];

    			if (!mounted) {
    				dispose = listen_dev(input, "change", input_change_handler);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (dirty & /*windowList*/ 1) {
    				input.checked = /*done*/ ctx[19];
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(td);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(76:2) {#if done !== undefined}",
    		ctx
    	});

    	return block;
    }

    // (72:0) {#each windowList as { name, time, done }}
    function create_each_block(ctx) {
    	let tr;
    	let td0;
    	let t0_value = /*name*/ ctx[17] + "";
    	let t0;
    	let t1;
    	let td1;
    	let t2_value = /*time*/ ctx[18] + "";
    	let t2;
    	let t3;
    	let t4;
    	let t5;
    	let if_block = /*done*/ ctx[19] !== undefined && create_if_block$1(ctx);

    	const block = {
    		c: function create() {
    			tr = element("tr");
    			td0 = element("td");
    			t0 = text(t0_value);
    			t1 = space();
    			td1 = element("td");
    			t2 = text(t2_value);
    			t3 = text(" min");
    			t4 = space();
    			if (if_block) if_block.c();
    			t5 = space();
    			add_location(td0, file$1, 73, 2, 1739);
    			add_location(td1, file$1, 74, 2, 1757);
    			add_location(tr, file$1, 72, 2, 1732);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tr, anchor);
    			append_dev(tr, td0);
    			append_dev(td0, t0);
    			append_dev(tr, t1);
    			append_dev(tr, td1);
    			append_dev(td1, t2);
    			append_dev(td1, t3);
    			append_dev(tr, t4);
    			if (if_block) if_block.m(tr, null);
    			append_dev(tr, t5);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*windowList*/ 1 && t0_value !== (t0_value = /*name*/ ctx[17] + "")) set_data_dev(t0, t0_value);
    			if (dirty & /*windowList*/ 1 && t2_value !== (t2_value = /*time*/ ctx[18] + "")) set_data_dev(t2, t2_value);

    			if (/*done*/ ctx[19] !== undefined) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$1(ctx);
    					if_block.c();
    					if_block.m(tr, t5);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr);
    			if (if_block) if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(72:0) {#each windowList as { name, time, done }}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1(ctx) {
    	let table;
    	let t0;
    	let button;
    	let img;
    	let img_src_value;
    	let img_alt_value;
    	let t1;
    	let p;
    	let t2;
    	let t3;
    	let t4;
    	let t5_value = (/*estimatedComplete*/ ctx[3]._hour % 12 || 12) + "";
    	let t5;
    	let t6;

    	let t7_value = (/*estimatedComplete*/ ctx[3]._min < 10
    	? "0" + /*estimatedComplete*/ ctx[3]._min
    	: /*estimatedComplete*/ ctx[3]._min) + "";

    	let t7;
    	let t8;
    	let t9_value = (/*estimatedComplete*/ ctx[3]._hour > 12 ? "PM" : "AM") + "";
    	let t9;
    	let mounted;
    	let dispose;
    	let each_value = /*windowList*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			table = element("table");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t0 = space();
    			button = element("button");
    			img = element("img");
    			t1 = space();
    			p = element("p");
    			t2 = text("Playlist has ");
    			t3 = text(/*totalTime*/ ctx[1]);
    			t4 = text(" minutes remaining. This will finish at aprox. ");
    			t5 = text(t5_value);
    			t6 = text(":");
    			t7 = text(t7_value);
    			t8 = space();
    			t9 = text(t9_value);
    			add_location(table, file$1, 70, 0, 1679);

    			if (!src_url_equal(img.src, img_src_value = /*playing*/ ctx[2]
    			? "images/stop-circle.svg"
    			: "images/play-circle.svg")) attr_dev(img, "src", img_src_value);

    			attr_dev(img, "width", "32");
    			attr_dev(img, "alt", img_alt_value = /*playing*/ ctx[2] ? "Stop Playing?" : "Play?");
    			add_location(img, file$1, 87, 5, 1979);
    			add_location(button, file$1, 84, 0, 1922);
    			add_location(p, file$1, 89, 0, 2112);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, table, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(table, null);
    			}

    			insert_dev(target, t0, anchor);
    			insert_dev(target, button, anchor);
    			append_dev(button, img);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, p, anchor);
    			append_dev(p, t2);
    			append_dev(p, t3);
    			append_dev(p, t4);
    			append_dev(p, t5);
    			append_dev(p, t6);
    			append_dev(p, t7);
    			append_dev(p, t8);
    			append_dev(p, t9);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler*/ ctx[12], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*windowList, undefined*/ 1) {
    				each_value = /*windowList*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(table, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			if (dirty & /*playing*/ 4 && !src_url_equal(img.src, img_src_value = /*playing*/ ctx[2]
    			? "images/stop-circle.svg"
    			: "images/play-circle.svg")) {
    				attr_dev(img, "src", img_src_value);
    			}

    			if (dirty & /*playing*/ 4 && img_alt_value !== (img_alt_value = /*playing*/ ctx[2] ? "Stop Playing?" : "Play?")) {
    				attr_dev(img, "alt", img_alt_value);
    			}

    			if (dirty & /*totalTime*/ 2) set_data_dev(t3, /*totalTime*/ ctx[1]);
    			if (dirty & /*estimatedComplete*/ 8 && t5_value !== (t5_value = (/*estimatedComplete*/ ctx[3]._hour % 12 || 12) + "")) set_data_dev(t5, t5_value);

    			if (dirty & /*estimatedComplete*/ 8 && t7_value !== (t7_value = (/*estimatedComplete*/ ctx[3]._min < 10
    			? "0" + /*estimatedComplete*/ ctx[3]._min
    			: /*estimatedComplete*/ ctx[3]._min) + "")) set_data_dev(t7, t7_value);

    			if (dirty & /*estimatedComplete*/ 8 && t9_value !== (t9_value = (/*estimatedComplete*/ ctx[3]._hour > 12 ? "PM" : "AM") + "")) set_data_dev(t9, t9_value);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(table);
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(button);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(p);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let $userList;
    	validate_store(userList, 'userList');
    	component_subscribe($$self, userList, $$value => $$invalidate(14, $userList = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Playlist', slots, []);
    	let { userListObj, min } = $$props;
    	let windowList = [];
    	let index = 0;

    	userListObj.forEach((e, i) => {
    		if (e.done === false) {
    			windowList.push({
    				...e,
    				callback: () => {
    					set_store_value(userList, $userList[i].done = true, $userList);
    				}
    			});

    			windowList.push({ name: "Break", time: 5, done: undefined });
    		}
    	});

    	let { normalMusic, breakMusic } = $$props;
    	normalMusic.pause();
    	breakMusic.pause();
    	let totalTime;
    	let estimatedComplete = { _hour: 0, _min: 0 };
    	let { hour } = $$props;
    	let playing = false;
    	let accumulator = 0;
    	let { speak = false } = $$props;

    	function playMusic() {
    		if (windowList[index].done === undefined) {
    			normalMusic.pause();
    			breakMusic.play();
    		} else {
    			normalMusic.play();
    			breakMusic.pause();
    		}

    		if (speak) speechSynthesis.speak(new window.SpeechSynthesisUtterance(windowList[index].name));
    	}

    	function updr() {
    		if (!playing) return;

    		if (windowList[index].time > 0) {
    			$$invalidate(0, windowList[index].time--, windowList);
    		} else if (windowList.length > index) {
    			$$invalidate(0, windowList[index].done = true, windowList);
    			if (windowList[index].callback != null) windowList[index].callback();
    			index++;
    			playMusic();
    		}

    		$$invalidate(0, windowList);
    	}

    	const writable_props = ['userListObj', 'min', 'normalMusic', 'breakMusic', 'hour', 'speak'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Playlist> was created with unknown prop '${key}'`);
    	});

    	function input_change_handler(each_value, each_index) {
    		each_value[each_index].done = this.checked;
    		$$invalidate(0, windowList);
    	}

    	const click_handler = () => {
    		$$invalidate(2, playing = !playing);
    	};

    	$$self.$$set = $$props => {
    		if ('userListObj' in $$props) $$invalidate(4, userListObj = $$props.userListObj);
    		if ('min' in $$props) $$invalidate(5, min = $$props.min);
    		if ('normalMusic' in $$props) $$invalidate(6, normalMusic = $$props.normalMusic);
    		if ('breakMusic' in $$props) $$invalidate(7, breakMusic = $$props.breakMusic);
    		if ('hour' in $$props) $$invalidate(8, hour = $$props.hour);
    		if ('speak' in $$props) $$invalidate(9, speak = $$props.speak);
    	};

    	$$self.$capture_state = () => ({
    		userList,
    		userListObj,
    		min,
    		windowList,
    		index,
    		normalMusic,
    		breakMusic,
    		totalTime,
    		estimatedComplete,
    		hour,
    		playing,
    		accumulator,
    		speak,
    		playMusic,
    		updr,
    		$userList
    	});

    	$$self.$inject_state = $$props => {
    		if ('userListObj' in $$props) $$invalidate(4, userListObj = $$props.userListObj);
    		if ('min' in $$props) $$invalidate(5, min = $$props.min);
    		if ('windowList' in $$props) $$invalidate(0, windowList = $$props.windowList);
    		if ('index' in $$props) index = $$props.index;
    		if ('normalMusic' in $$props) $$invalidate(6, normalMusic = $$props.normalMusic);
    		if ('breakMusic' in $$props) $$invalidate(7, breakMusic = $$props.breakMusic);
    		if ('totalTime' in $$props) $$invalidate(1, totalTime = $$props.totalTime);
    		if ('estimatedComplete' in $$props) $$invalidate(3, estimatedComplete = $$props.estimatedComplete);
    		if ('hour' in $$props) $$invalidate(8, hour = $$props.hour);
    		if ('playing' in $$props) $$invalidate(2, playing = $$props.playing);
    		if ('accumulator' in $$props) $$invalidate(10, accumulator = $$props.accumulator);
    		if ('speak' in $$props) $$invalidate(9, speak = $$props.speak);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*min, windowList, accumulator, hour, totalTime*/ 1315) {
    			{
    				updr();
    				$$invalidate(10, accumulator = 0);

    				for (let item of windowList) {
    					$$invalidate(10, accumulator += item.time);
    				}

    				$$invalidate(1, totalTime = accumulator);

    				$$invalidate(3, estimatedComplete = {
    					_hour: (hour + Math.floor((min + totalTime) / 60)) % 24,
    					_min: (min + totalTime) % 60
    				});
    			}
    		}

    		if ($$self.$$.dirty & /*playing, normalMusic, breakMusic*/ 196) {
    			if (!playing) {
    				normalMusic.pause();
    				breakMusic.pause();
    			} else {
    				playMusic();
    			}
    		}
    	};

    	return [
    		windowList,
    		totalTime,
    		playing,
    		estimatedComplete,
    		userListObj,
    		min,
    		normalMusic,
    		breakMusic,
    		hour,
    		speak,
    		accumulator,
    		input_change_handler,
    		click_handler
    	];
    }

    class Playlist extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {
    			userListObj: 4,
    			min: 5,
    			normalMusic: 6,
    			breakMusic: 7,
    			hour: 8,
    			speak: 9
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Playlist",
    			options,
    			id: create_fragment$1.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*userListObj*/ ctx[4] === undefined && !('userListObj' in props)) {
    			console.warn("<Playlist> was created without expected prop 'userListObj'");
    		}

    		if (/*min*/ ctx[5] === undefined && !('min' in props)) {
    			console.warn("<Playlist> was created without expected prop 'min'");
    		}

    		if (/*normalMusic*/ ctx[6] === undefined && !('normalMusic' in props)) {
    			console.warn("<Playlist> was created without expected prop 'normalMusic'");
    		}

    		if (/*breakMusic*/ ctx[7] === undefined && !('breakMusic' in props)) {
    			console.warn("<Playlist> was created without expected prop 'breakMusic'");
    		}

    		if (/*hour*/ ctx[8] === undefined && !('hour' in props)) {
    			console.warn("<Playlist> was created without expected prop 'hour'");
    		}
    	}

    	get userListObj() {
    		throw new Error("<Playlist>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set userListObj(value) {
    		throw new Error("<Playlist>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get min() {
    		throw new Error("<Playlist>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set min(value) {
    		throw new Error("<Playlist>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get normalMusic() {
    		throw new Error("<Playlist>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set normalMusic(value) {
    		throw new Error("<Playlist>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get breakMusic() {
    		throw new Error("<Playlist>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set breakMusic(value) {
    		throw new Error("<Playlist>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get hour() {
    		throw new Error("<Playlist>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set hour(value) {
    		throw new Error("<Playlist>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get speak() {
    		throw new Error("<Playlist>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set speak(value) {
    		throw new Error("<Playlist>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/App.svelte generated by Svelte v3.44.0 */

    const { Object: Object_1, console: console_1 } = globals;
    const file = "src/App.svelte";

    // (155:2) {#if plist}
    function create_if_block(ctx) {
    	let playlist;
    	let current;

    	playlist = new Playlist({
    			props: {
    				userListObj: /*$userList*/ ctx[7],
    				speak: /*speak*/ ctx[6],
    				min: /*min*/ ctx[2],
    				hour: /*hour*/ ctx[1],
    				breakMusic: /*breakMusic*/ ctx[5],
    				normalMusic: /*normalMusic*/ ctx[4]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(playlist.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(playlist, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const playlist_changes = {};
    			if (dirty & /*$userList*/ 128) playlist_changes.userListObj = /*$userList*/ ctx[7];
    			if (dirty & /*speak*/ 64) playlist_changes.speak = /*speak*/ ctx[6];
    			if (dirty & /*min*/ 4) playlist_changes.min = /*min*/ ctx[2];
    			if (dirty & /*hour*/ 2) playlist_changes.hour = /*hour*/ ctx[1];
    			if (dirty & /*breakMusic*/ 32) playlist_changes.breakMusic = /*breakMusic*/ ctx[5];
    			if (dirty & /*normalMusic*/ 16) playlist_changes.normalMusic = /*normalMusic*/ ctx[4];
    			playlist.$set(playlist_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(playlist.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(playlist.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(playlist, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(155:2) {#if plist}",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let main;
    	let header;
    	let t0;
    	let tasklist;
    	let t1;
    	let details;
    	let summary;
    	let t3;
    	let button0;
    	let t4;
    	let t5;
    	let t6;
    	let button1;
    	let t8;
    	let button2;
    	let t9;
    	let img;
    	let img_src_value;
    	let button3;
    	let label0;
    	let input0;
    	let t10;
    	let t11;
    	let label1;
    	let input1;
    	let t12;
    	let t13;
    	let current;
    	let mounted;
    	let dispose;

    	header = new Header({
    			props: {
    				version: /*version*/ ctx[0],
    				hour: /*hour*/ ctx[1],
    				min: /*min*/ ctx[2]
    			},
    			$$inline: true
    		});

    	tasklist = new Tasklist({ $$inline: true });
    	let if_block = /*plist*/ ctx[3] && create_if_block(ctx);

    	const block = {
    		c: function create() {
    			main = element("main");
    			create_component(header.$$.fragment);
    			t0 = space();
    			create_component(tasklist.$$.fragment);
    			t1 = space();
    			details = element("details");
    			summary = element("summary");
    			summary.textContent = "Options";
    			t3 = space();
    			button0 = element("button");
    			t4 = text("Make into Playlist : ");
    			t5 = text(/*plist*/ ctx[3]);
    			t6 = space();
    			button1 = element("button");
    			button1.textContent = "Nuke Task List (removes cache)";
    			t8 = space();
    			button2 = element("button");
    			t9 = text("Export tasks to file ");
    			img = element("img");
    			button3 = element("button");
    			label0 = element("label");
    			input0 = element("input");
    			t10 = text("\n      Load tasks from file");
    			t11 = space();
    			label1 = element("label");
    			input1 = element("input");
    			t12 = text("\n    Speak cues");
    			t13 = space();
    			if (if_block) if_block.c();
    			add_location(summary, file, 113, 4, 2923);
    			add_location(button0, file, 114, 2, 2952);
    			add_location(button1, file, 119, 2, 3088);
    			if (!src_url_equal(img.src, img_src_value = "images/save.svg")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "width", "16");
    			attr_dev(img, "alt", "Save to file");
    			add_location(img, file, 131, 26, 3487);
    			add_location(button2, file, 120, 2, 3154);
    			attr_dev(input0, "type", "file");
    			set_style(input0, "display", "none");
    			add_location(input0, file, 138, 6, 3607);
    			add_location(label0, file, 137, 4, 3593);
    			add_location(button3, file, 136, 3, 3580);
    			attr_dev(input1, "type", "checkbox");
    			add_location(input1, file, 150, 4, 3897);
    			set_style(label1, "display", "inline");
    			add_location(label1, file, 149, 2, 3861);
    			details.open = true;
    			add_location(details, file, 112, 2, 2904);
    			attr_dev(main, "class", "svelte-z8pi4v");
    			add_location(main, file, 109, 0, 2844);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			mount_component(header, main, null);
    			append_dev(main, t0);
    			mount_component(tasklist, main, null);
    			append_dev(main, t1);
    			append_dev(main, details);
    			append_dev(details, summary);
    			append_dev(details, t3);
    			append_dev(details, button0);
    			append_dev(button0, t4);
    			append_dev(button0, t5);
    			append_dev(details, t6);
    			append_dev(details, button1);
    			append_dev(details, t8);
    			append_dev(details, button2);
    			append_dev(button2, t9);
    			append_dev(button2, img);
    			append_dev(details, button3);
    			append_dev(button3, label0);
    			append_dev(label0, input0);
    			append_dev(label0, t10);
    			append_dev(details, t11);
    			append_dev(details, label1);
    			append_dev(label1, input1);
    			input1.checked = /*speak*/ ctx[6];
    			append_dev(label1, t12);
    			append_dev(main, t13);
    			if (if_block) if_block.m(main, null);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(button0, "click", /*click_handler*/ ctx[10], false, false, false),
    					listen_dev(button1, "click", /*nuke*/ ctx[8], false, false, false),
    					listen_dev(button2, "click", /*click_handler_1*/ ctx[11], false, false, false),
    					listen_dev(input0, "change", /*change_handler*/ ctx[12], false, false, false),
    					listen_dev(input1, "change", /*input1_change_handler*/ ctx[13])
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			const header_changes = {};
    			if (dirty & /*version*/ 1) header_changes.version = /*version*/ ctx[0];
    			if (dirty & /*hour*/ 2) header_changes.hour = /*hour*/ ctx[1];
    			if (dirty & /*min*/ 4) header_changes.min = /*min*/ ctx[2];
    			header.$set(header_changes);
    			if (!current || dirty & /*plist*/ 8) set_data_dev(t5, /*plist*/ ctx[3]);

    			if (dirty & /*speak*/ 64) {
    				input1.checked = /*speak*/ ctx[6];
    			}

    			if (/*plist*/ ctx[3]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*plist*/ 8) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(main, null);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(header.$$.fragment, local);
    			transition_in(tasklist.$$.fragment, local);
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(header.$$.fragment, local);
    			transition_out(tasklist.$$.fragment, local);
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(header);
    			destroy_component(tasklist);
    			if (if_block) if_block.d();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function calc_drift(arr) {
    	// Calculate drift correction.
    	let values = arr.concat(); // copy array

    	values.sort(function (a, b) {
    		return a - b;
    	});

    	if (values.length === 0) return 0;
    	let half = Math.floor(values.length / 2);
    	if (values.length % 2) return values[half];
    	let median = (values[half - 1] + values[half]) / 2.0;
    	return median;
    }

    async function messanger(id, message) {
    	return await browser.tabs.sendMessage(id, { [message]: true });
    }

    function instance($$self, $$props, $$invalidate) {
    	let $userList;
    	validate_store(userList, 'userList');
    	component_subscribe($$self, userList, $$value => $$invalidate(7, $userList = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);
    	let { version } = $$props;
    	let interval = 1000; // ms
    	let expected = Date.now() + interval;
    	let t = new Date();
    	let deltaTime = t.getSeconds();
    	let hour = t.getHours();
    	let min = t.getMinutes();
    	let drift_history = [];
    	let drift_history_samples = 10;
    	let drift_correction = 0;
    	setTimeout(step, interval);

    	function step() {
    		let dt = Date.now() - expected; // the drift (positive for overshooting)

    		if (dt > interval) {
    			console.log("Significant time drift ...");
    			t = new Date();
    			$$invalidate(1, hour = t.getHours());
    			$$invalidate(2, min = t.getMinutes());
    			$$invalidate(9, deltaTime = t.getSeconds());
    		}

    		$$invalidate(9, deltaTime++, deltaTime);

    		if (dt <= interval) {
    			drift_history.push(dt + drift_correction);
    			drift_correction = calc_drift(drift_history);

    			if (drift_history.length >= drift_history_samples) {
    				drift_history.shift();
    			}
    		}

    		expected += interval;
    		setTimeout(step, Math.max(0, interval - dt - drift_correction));
    	}

    	let plist = false;
    	let normalMusic = {};
    	let breakMusic = {};
    	normalMusic.play = async () => messanger(await browser.runtime.sendMessage({ GetID: "normalMusic" }), "play");
    	normalMusic.pause = async () => messanger(await browser.runtime.sendMessage({ GetID: "normalMusic" }), "pause");
    	breakMusic.play = async () => messanger(await browser.runtime.sendMessage({ GetID: "breakMusic" }), "play");
    	breakMusic.pause = async () => messanger(await browser.runtime.sendMessage({ GetID: "breakMusic" }), "pause");
    	if (localStorage.getItem("userList") != null) Object.assign($userList, JSON.parse(localStorage.getItem("userList")));
    	const unsubscribe = userList.subscribe(() => localStorage.setItem("userList", JSON.stringify($userList)));
    	onDestroy(unsubscribe);

    	function nuke() {
    		set_store_value(userList, $userList = [], $userList);
    		localStorage.removeItem("userList");
    	}

    	let speak = false;
    	const writable_props = ['version'];

    	Object_1.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	const click_handler = function () {
    		if ($userList.length !== 0) $$invalidate(3, plist = !plist);
    	};

    	const click_handler_1 = function () {
    		let dl = document.createElement("a");
    		dl.setAttribute("href", "data:application/json;charset=utf-8," + encodeURIComponent(JSON.stringify($userList)));
    		dl.setAttribute("download", "tasks.json");
    		dl.click();
    	};

    	const change_handler = async function () {
    		let f = await this.files[0].text();
    		set_store_value(userList, $userList = JSON.parse(f), $userList);
    	};

    	function input1_change_handler() {
    		speak = this.checked;
    		$$invalidate(6, speak);
    	}

    	$$self.$$set = $$props => {
    		if ('version' in $$props) $$invalidate(0, version = $$props.version);
    	};

    	$$self.$capture_state = () => ({
    		Tasklist,
    		Header,
    		Playlist,
    		userList,
    		onDestroy,
    		version,
    		interval,
    		expected,
    		t,
    		deltaTime,
    		hour,
    		min,
    		drift_history,
    		drift_history_samples,
    		drift_correction,
    		calc_drift,
    		step,
    		plist,
    		messanger,
    		normalMusic,
    		breakMusic,
    		unsubscribe,
    		nuke,
    		speak,
    		$userList
    	});

    	$$self.$inject_state = $$props => {
    		if ('version' in $$props) $$invalidate(0, version = $$props.version);
    		if ('interval' in $$props) interval = $$props.interval;
    		if ('expected' in $$props) expected = $$props.expected;
    		if ('t' in $$props) t = $$props.t;
    		if ('deltaTime' in $$props) $$invalidate(9, deltaTime = $$props.deltaTime);
    		if ('hour' in $$props) $$invalidate(1, hour = $$props.hour);
    		if ('min' in $$props) $$invalidate(2, min = $$props.min);
    		if ('drift_history' in $$props) drift_history = $$props.drift_history;
    		if ('drift_history_samples' in $$props) drift_history_samples = $$props.drift_history_samples;
    		if ('drift_correction' in $$props) drift_correction = $$props.drift_correction;
    		if ('plist' in $$props) $$invalidate(3, plist = $$props.plist);
    		if ('normalMusic' in $$props) $$invalidate(4, normalMusic = $$props.normalMusic);
    		if ('breakMusic' in $$props) $$invalidate(5, breakMusic = $$props.breakMusic);
    		if ('speak' in $$props) $$invalidate(6, speak = $$props.speak);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*deltaTime, min*/ 516) {
    			if (deltaTime === 60) {
    				$$invalidate(2, min++, min);
    				$$invalidate(9, deltaTime = 0);
    			}
    		}

    		if ($$self.$$.dirty & /*min, hour*/ 6) {
    			if (min >= 60) {
    				$$invalidate(1, hour++, hour);
    				$$invalidate(2, min = 0);
    			}
    		}

    		if ($$self.$$.dirty & /*hour*/ 2) {
    			if (hour === 24) {
    				$$invalidate(1, hour = 0);
    			}
    		}
    	};

    	return [
    		version,
    		hour,
    		min,
    		plist,
    		normalMusic,
    		breakMusic,
    		speak,
    		$userList,
    		nuke,
    		deltaTime,
    		click_handler,
    		click_handler_1,
    		change_handler,
    		input1_change_handler
    	];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, { version: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*version*/ ctx[0] === undefined && !('version' in props)) {
    			console_1.warn("<App> was created without expected prop 'version'");
    		}
    	}

    	get version() {
    		throw new Error("<App>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set version(value) {
    		throw new Error("<App>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    const app = new App({
      target: document.body,
      props: {
        version: browser.runtime.getManifest().version,
      },
    });

    return app;

})();
//# sourceMappingURL=bundle.js.map
