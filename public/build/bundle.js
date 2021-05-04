
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(window.document);
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
    function set_store_value(store, ret, value = ret) {
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
    function empty() {
        return text('');
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
    function toggle_class(element, name, toggle) {
        element.classList[toggle ? 'add' : 'remove'](name);
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
    function get_current_component() {
        if (!current_component)
            throw new Error('Function called outside component initialization');
        return current_component;
    }
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
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
    function setContext(key, context) {
        get_current_component().$$.context.set(key, context);
    }
    function getContext(key) {
        return get_current_component().$$.context.get(key);
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
    function init(component, options, instance, create_fragment, not_equal, props, dirty = [-1]) {
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
            context: new Map(parent_component ? parent_component.$$.context : options.context || []),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false
        };
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
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.37.0' }, detail)));
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

    /* src/Task.svelte generated by Svelte v3.37.0 */
    const file$5 = "src/Task.svelte";

    function create_fragment$5(ctx) {
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
    			add_location(input0, file$5, 23, 6, 465);
    			add_location(td0, file$5, 23, 2, 461);
    			attr_dev(input1, "type", "number");
    			attr_dev(input1, "min", "0");
    			attr_dev(input1, "max", "90");
    			input1.disabled = /*disabled*/ ctx[3];
    			add_location(input1, file$5, 25, 5, 532);
    			add_location(td1, file$5, 24, 2, 523);
    			attr_dev(input2, "type", "checkbox");
    			input2.disabled = /*disabled*/ ctx[3];
    			add_location(input2, file$5, 27, 6, 620);
    			add_location(td2, file$5, 27, 2, 616);
    			if (img0.src !== (img0_src_value = "images/edit.svg")) attr_dev(img0, "src", img0_src_value);
    			attr_dev(img0, "alt", "Edit Item");
    			attr_dev(img0, "class", "svelte-lynhnu");
    			add_location(img0, file$5, 30, 7, 739);
    			attr_dev(button0, "class", "svelte-lynhnu");
    			toggle_class(button0, "active", /*active*/ ctx[4]);
    			add_location(button0, file$5, 29, 5, 693);
    			add_location(td3, file$5, 28, 2, 684);
    			if (img1.src !== (img1_src_value = "images/trash-alt.svg")) attr_dev(img1, "src", img1_src_value);
    			attr_dev(img1, "alt", "Remove Item");
    			attr_dev(img1, "class", "svelte-lynhnu");
    			add_location(img1, file$5, 33, 14, 821);
    			attr_dev(button1, "class", "svelte-lynhnu");
    			add_location(button1, file$5, 33, 6, 813);
    			add_location(td4, file$5, 33, 2, 809);
    			add_location(tr, file$5, 22, 0, 454);
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
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$5($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Task", slots, []);
    	let { name } = $$props, { time } = $$props, { done } = $$props;
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
    		dispatch("delete");
    	}

    	const writable_props = ["name", "time", "done"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Task> was created with unknown prop '${key}'`);
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
    		if ("name" in $$props) $$invalidate(0, name = $$props.name);
    		if ("time" in $$props) $$invalidate(1, time = $$props.time);
    		if ("done" in $$props) $$invalidate(2, done = $$props.done);
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
    		if ("name" in $$props) $$invalidate(0, name = $$props.name);
    		if ("time" in $$props) $$invalidate(1, time = $$props.time);
    		if ("done" in $$props) $$invalidate(2, done = $$props.done);
    		if ("disabled" in $$props) $$invalidate(3, disabled = $$props.disabled);
    		if ("active" in $$props) $$invalidate(4, active = $$props.active);
    		if ("oldtime" in $$props) oldtime = $$props.oldtime;
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
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, { name: 0, time: 1, done: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Task",
    			options,
    			id: create_fragment$5.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*name*/ ctx[0] === undefined && !("name" in props)) {
    			console.warn("<Task> was created without expected prop 'name'");
    		}

    		if (/*time*/ ctx[1] === undefined && !("time" in props)) {
    			console.warn("<Task> was created without expected prop 'time'");
    		}

    		if (/*done*/ ctx[2] === undefined && !("done" in props)) {
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

    let userList = writable([]);

    /* src/Tasklist.svelte generated by Svelte v3.37.0 */

    const { console: console_1$2 } = globals;
    const file$4 = "src/Tasklist.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[13] = list[i].name;
    	child_ctx[14] = list[i].time;
    	child_ctx[15] = list[i].done;
    	child_ctx[16] = list;
    	child_ctx[17] = i;
    	return child_ctx;
    }

    // (35:4) {#each $userList as { name, time, done }
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
    	binding_callbacks.push(() => bind(task, "name", task_name_binding));
    	binding_callbacks.push(() => bind(task, "time", task_time_binding));
    	binding_callbacks.push(() => bind(task, "done", task_done_binding));
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
    		source: "(35:4) {#each $userList as { name, time, done }",
    		ctx
    	});

    	return block;
    }

    function create_fragment$4(ctx) {
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
    			add_location(th0, file$4, 27, 4, 588);
    			add_location(th1, file$4, 28, 4, 607);
    			add_location(th2, file$4, 29, 4, 626);
    			add_location(th3, file$4, 30, 4, 645);
    			add_location(th4, file$4, 31, 4, 664);
    			add_location(thead, file$4, 26, 2, 576);
    			add_location(tbody, file$4, 33, 2, 694);
    			add_location(h4, file$4, 39, 4, 863);
    			attr_dev(input0, "type", "text");
    			add_location(input0, file$4, 41, 10, 900);
    			add_location(td0, file$4, 41, 6, 896);
    			attr_dev(input1, "type", "number");
    			attr_dev(input1, "min", "0");
    			attr_dev(input1, "max", "90");
    			add_location(input1, file$4, 43, 8, 968);
    			add_location(td1, file$4, 42, 6, 955);
    			attr_dev(input2, "type", "checkbox");
    			add_location(input2, file$4, 45, 10, 1057);
    			add_location(td2, file$4, 45, 6, 1053);
    			add_location(button, file$4, 46, 10, 1122);
    			add_location(td3, file$4, 46, 6, 1118);
    			add_location(tr, file$4, 40, 4, 885);
    			add_location(tfoot, file$4, 38, 2, 851);
    			attr_dev(table, "class", "svelte-c3e669");
    			add_location(table, file$4, 25, 0, 566);
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
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let $userList;
    	validate_store(userList, "userList");
    	component_subscribe($$self, userList, $$value => $$invalidate(3, $userList = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Tasklist", slots, []);
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

    		console.log($userList);
    	}

    	function remove(id) {
    		$userList.splice(id, 1);
    		userList.set($userList);
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1$2.warn(`<Tasklist> was created with unknown prop '${key}'`);
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
    		if ("nextTask" in $$props) $$invalidate(0, nextTask = $$props.nextTask);
    		if ("nextTime" in $$props) $$invalidate(1, nextTime = $$props.nextTime);
    		if ("nextDone" in $$props) $$invalidate(2, nextDone = $$props.nextDone);
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
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Tasklist",
    			options,
    			id: create_fragment$4.name
    		});
    	}
    }

    /* src/Header.svelte generated by Svelte v3.37.0 */

    const file$3 = "src/Header.svelte";

    function create_fragment$3(ctx) {
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
    			h2.textContent = "TFH";
    			add_location(br, file$3, 26, 2, 576);
    			attr_dev(sub, "class", "svelte-1sru9z3");
    			add_location(sub, file$3, 27, 2, 585);
    			attr_dev(h1, "class", "svelte-1sru9z3");
    			add_location(h1, file$3, 23, 0, 492);
    			attr_dev(h2, "class", "svelte-1sru9z3");
    			add_location(h2, file$3, 29, 0, 609);
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
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Header", slots, []);
    	let { version } = $$props;
    	let { hour } = $$props, { min } = $$props;
    	let desc = "";
    	const writable_props = ["version", "hour", "min"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Header> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("version" in $$props) $$invalidate(3, version = $$props.version);
    		if ("hour" in $$props) $$invalidate(0, hour = $$props.hour);
    		if ("min" in $$props) $$invalidate(1, min = $$props.min);
    	};

    	$$self.$capture_state = () => ({ version, hour, min, desc });

    	$$self.$inject_state = $$props => {
    		if ("version" in $$props) $$invalidate(3, version = $$props.version);
    		if ("hour" in $$props) $$invalidate(0, hour = $$props.hour);
    		if ("min" in $$props) $$invalidate(1, min = $$props.min);
    		if ("desc" in $$props) $$invalidate(2, desc = $$props.desc);
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
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, { version: 3, hour: 0, min: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Header",
    			options,
    			id: create_fragment$3.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*version*/ ctx[3] === undefined && !("version" in props)) {
    			console.warn("<Header> was created without expected prop 'version'");
    		}

    		if (/*hour*/ ctx[0] === undefined && !("hour" in props)) {
    			console.warn("<Header> was created without expected prop 'hour'");
    		}

    		if (/*min*/ ctx[1] === undefined && !("min" in props)) {
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

    /* src/Playlist.svelte generated by Svelte v3.37.0 */

    const file$2 = "src/Playlist.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[15] = list[i].name;
    	child_ctx[16] = list[i].time;
    	child_ctx[17] = list[i].done;
    	child_ctx[18] = list;
    	child_ctx[19] = i;
    	return child_ctx;
    }

    // (75:2) {#if done !== undefined}
    function create_if_block_1(ctx) {
    	let input;
    	let mounted;
    	let dispose;

    	function input_change_handler() {
    		/*input_change_handler*/ ctx[10].call(input, /*each_value*/ ctx[18], /*each_index*/ ctx[19]);
    	}

    	const block = {
    		c: function create() {
    			input = element("input");
    			attr_dev(input, "type", "checkbox");
    			input.disabled = true;
    			add_location(input, file$2, 74, 26, 1725);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, input, anchor);
    			input.checked = /*done*/ ctx[17];

    			if (!mounted) {
    				dispose = listen_dev(input, "change", input_change_handler);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (dirty & /*windowList*/ 1) {
    				input.checked = /*done*/ ctx[17];
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(75:2) {#if done !== undefined}",
    		ctx
    	});

    	return block;
    }

    // (71:0) {#each windowList as { name, time, done }}
    function create_each_block(ctx) {
    	let br;
    	let t0;
    	let span0;
    	let t1_value = /*name*/ ctx[15] + "";
    	let t1;
    	let t2;
    	let span1;
    	let t3_value = /*time*/ ctx[16] + "";
    	let t3;
    	let t4;
    	let t5;
    	let if_block_anchor;
    	let if_block = /*done*/ ctx[17] !== undefined && create_if_block_1(ctx);

    	const block = {
    		c: function create() {
    			br = element("br");
    			t0 = space();
    			span0 = element("span");
    			t1 = text(t1_value);
    			t2 = space();
    			span1 = element("span");
    			t3 = text(t3_value);
    			t4 = text(" min");
    			t5 = space();
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    			add_location(br, file$2, 71, 2, 1644);
    			add_location(span0, file$2, 72, 2, 1653);
    			add_location(span1, file$2, 73, 2, 1675);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, br, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, span0, anchor);
    			append_dev(span0, t1);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, span1, anchor);
    			append_dev(span1, t3);
    			append_dev(span1, t4);
    			insert_dev(target, t5, anchor);
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*windowList*/ 1 && t1_value !== (t1_value = /*name*/ ctx[15] + "")) set_data_dev(t1, t1_value);
    			if (dirty & /*windowList*/ 1 && t3_value !== (t3_value = /*time*/ ctx[16] + "")) set_data_dev(t3, t3_value);

    			if (/*done*/ ctx[17] !== undefined) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block_1(ctx);
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(br);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(span0);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(span1);
    			if (detaching) detach_dev(t5);
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(71:0) {#each windowList as { name, time, done }}",
    		ctx
    	});

    	return block;
    }

    // (87:0) {#if (playing)}
    function create_if_block$1(ctx) {
    	let p;

    	const block = {
    		c: function create() {
    			p = element("p");
    			p.textContent = "Now Playing";
    			add_location(p, file$2, 87, 2, 1911);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(87:0) {#if (playing)}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$2(ctx) {
    	let t0;
    	let button;
    	let t2;
    	let t3;
    	let p;
    	let t4;
    	let t5;
    	let t6;
    	let t7_value = (/*estimatedComplete*/ ctx[2]._hour % 12 || 12) + "";
    	let t7;
    	let t8;

    	let t9_value = (/*estimatedComplete*/ ctx[2]._min < 10
    	? "0" + /*estimatedComplete*/ ctx[2]._min
    	: /*estimatedComplete*/ ctx[2]._min) + "";

    	let t9;
    	let t10;
    	let t11_value = (/*estimatedComplete*/ ctx[2]._hour > 12 ? "PM" : "AM") + "";
    	let t11;
    	let mounted;
    	let dispose;
    	let each_value = /*windowList*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	let if_block = /*playing*/ ctx[3] && create_if_block$1(ctx);

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t0 = space();
    			button = element("button");
    			button.textContent = "Play this";
    			t2 = space();
    			if (if_block) if_block.c();
    			t3 = space();
    			p = element("p");
    			t4 = text("Playlist has ");
    			t5 = text(/*totalTime*/ ctx[1]);
    			t6 = text(" minutes remaining. This will finish at aprox. ");
    			t7 = text(t7_value);
    			t8 = text(":");
    			t9 = text(t9_value);
    			t10 = space();
    			t11 = text(t11_value);
    			add_location(button, file$2, 81, 0, 1816);
    			add_location(p, file$2, 89, 0, 1936);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, t0, anchor);
    			insert_dev(target, button, anchor);
    			insert_dev(target, t2, anchor);
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, t3, anchor);
    			insert_dev(target, p, anchor);
    			append_dev(p, t4);
    			append_dev(p, t5);
    			append_dev(p, t6);
    			append_dev(p, t7);
    			append_dev(p, t8);
    			append_dev(p, t9);
    			append_dev(p, t10);
    			append_dev(p, t11);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler*/ ctx[11], false, false, false);
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
    						each_blocks[i].m(t0.parentNode, t0);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			if (/*playing*/ ctx[3]) {
    				if (if_block) ; else {
    					if_block = create_if_block$1(ctx);
    					if_block.c();
    					if_block.m(t3.parentNode, t3);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			if (dirty & /*totalTime*/ 2) set_data_dev(t5, /*totalTime*/ ctx[1]);
    			if (dirty & /*estimatedComplete*/ 4 && t7_value !== (t7_value = (/*estimatedComplete*/ ctx[2]._hour % 12 || 12) + "")) set_data_dev(t7, t7_value);

    			if (dirty & /*estimatedComplete*/ 4 && t9_value !== (t9_value = (/*estimatedComplete*/ ctx[2]._min < 10
    			? "0" + /*estimatedComplete*/ ctx[2]._min
    			: /*estimatedComplete*/ ctx[2]._min) + "")) set_data_dev(t9, t9_value);

    			if (dirty & /*estimatedComplete*/ 4 && t11_value !== (t11_value = (/*estimatedComplete*/ ctx[2]._hour > 12 ? "PM" : "AM") + "")) set_data_dev(t11, t11_value);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(button);
    			if (detaching) detach_dev(t2);
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(t3);
    			if (detaching) detach_dev(p);
    			mounted = false;
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
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Playlist", slots, []);
    	let { userListObj } = $$props, { min } = $$props;
    	let windowList = [];
    	let index = 0;

    	userListObj.forEach(e => {
    		if (e.done === false) {
    			windowList.push(e);
    			windowList.push({ name: "Break", time: 5, done: undefined });
    		}
    	});

    	let { normalMusic } = $$props, { breakMusic } = $$props;
    	normalMusic.pause();
    	breakMusic.pause();
    	let totalTime;
    	let estimatedComplete = { _hour: 0, _min: 0 };
    	let { hour } = $$props;
    	let playing = false;
    	let accumulator = 0;

    	function playMusic() {
    		if (windowList[index].done === undefined) {
    			normalMusic.pause();
    			breakMusic.play();
    		} else {
    			normalMusic.play();
    			breakMusic.pause();
    		}
    	}

    	function updr() {
    		if (!playing) return;

    		if (windowList[index].time > 0) {
    			$$invalidate(0, windowList[index].time--, windowList);
    		} else if (windowList.length > index) {
    			$$invalidate(0, windowList[index].done = true, windowList);
    			index++;
    			playMusic();
    		}

    		$$invalidate(0, windowList);
    	}

    	const writable_props = ["userListObj", "min", "normalMusic", "breakMusic", "hour"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Playlist> was created with unknown prop '${key}'`);
    	});

    	function input_change_handler(each_value, each_index) {
    		each_value[each_index].done = this.checked;
    		$$invalidate(0, windowList);
    	}

    	const click_handler = () => {
    		$$invalidate(3, playing = !playing);
    	};

    	$$self.$$set = $$props => {
    		if ("userListObj" in $$props) $$invalidate(4, userListObj = $$props.userListObj);
    		if ("min" in $$props) $$invalidate(5, min = $$props.min);
    		if ("normalMusic" in $$props) $$invalidate(6, normalMusic = $$props.normalMusic);
    		if ("breakMusic" in $$props) $$invalidate(7, breakMusic = $$props.breakMusic);
    		if ("hour" in $$props) $$invalidate(8, hour = $$props.hour);
    	};

    	$$self.$capture_state = () => ({
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
    		playMusic,
    		updr
    	});

    	$$self.$inject_state = $$props => {
    		if ("userListObj" in $$props) $$invalidate(4, userListObj = $$props.userListObj);
    		if ("min" in $$props) $$invalidate(5, min = $$props.min);
    		if ("windowList" in $$props) $$invalidate(0, windowList = $$props.windowList);
    		if ("index" in $$props) index = $$props.index;
    		if ("normalMusic" in $$props) $$invalidate(6, normalMusic = $$props.normalMusic);
    		if ("breakMusic" in $$props) $$invalidate(7, breakMusic = $$props.breakMusic);
    		if ("totalTime" in $$props) $$invalidate(1, totalTime = $$props.totalTime);
    		if ("estimatedComplete" in $$props) $$invalidate(2, estimatedComplete = $$props.estimatedComplete);
    		if ("hour" in $$props) $$invalidate(8, hour = $$props.hour);
    		if ("playing" in $$props) $$invalidate(3, playing = $$props.playing);
    		if ("accumulator" in $$props) $$invalidate(9, accumulator = $$props.accumulator);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*min, windowList, accumulator, hour, estimatedComplete, totalTime*/ 807) {
    			{
    				updr();
    				$$invalidate(9, accumulator = 0);

    				for (let item of windowList) {
    					$$invalidate(9, accumulator += item.time);
    				}

    				$$invalidate(1, totalTime = accumulator);
    				$$invalidate(2, estimatedComplete = { _hour: hour, _min: min });

    				if (estimatedComplete._min + totalTime >= 60) {
    					$$invalidate(2, estimatedComplete._hour++, estimatedComplete);
    					if (estimatedComplete._hour == 24) $$invalidate(2, estimatedComplete._hour = 0, estimatedComplete);
    					$$invalidate(2, estimatedComplete._min = estimatedComplete._min + totalTime % 60, estimatedComplete);
    				} else $$invalidate(2, estimatedComplete._min += totalTime, estimatedComplete);
    			}
    		}

    		if ($$self.$$.dirty & /*playing, normalMusic, breakMusic*/ 200) {
    			{
    				if (!playing) {
    					normalMusic.pause();
    					breakMusic.pause();
    				} else {
    					playMusic();
    				}
    			}
    		}
    	};

    	return [
    		windowList,
    		totalTime,
    		estimatedComplete,
    		playing,
    		userListObj,
    		min,
    		normalMusic,
    		breakMusic,
    		hour,
    		accumulator,
    		input_change_handler,
    		click_handler
    	];
    }

    class Playlist extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {
    			userListObj: 4,
    			min: 5,
    			normalMusic: 6,
    			breakMusic: 7,
    			hour: 8
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Playlist",
    			options,
    			id: create_fragment$2.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*userListObj*/ ctx[4] === undefined && !("userListObj" in props)) {
    			console.warn("<Playlist> was created without expected prop 'userListObj'");
    		}

    		if (/*min*/ ctx[5] === undefined && !("min" in props)) {
    			console.warn("<Playlist> was created without expected prop 'min'");
    		}

    		if (/*normalMusic*/ ctx[6] === undefined && !("normalMusic" in props)) {
    			console.warn("<Playlist> was created without expected prop 'normalMusic'");
    		}

    		if (/*breakMusic*/ ctx[7] === undefined && !("breakMusic" in props)) {
    			console.warn("<Playlist> was created without expected prop 'breakMusic'");
    		}

    		if (/*hour*/ ctx[8] === undefined && !("hour" in props)) {
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
    }

    /* src/Youtube.svelte generated by Svelte v3.37.0 */

    const { console: console_1$1 } = globals;
    const file$1 = "src/Youtube.svelte";

    function create_fragment$1(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			attr_dev(div, "id", /*divId*/ ctx[0]);
    			add_location(div, file$1, 73, 0, 1950);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
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

    let iframeApiReady = false;
    var tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    var firstScriptTag = document.getElementsByTagName("script")[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    window.onYouTubeIframeAPIReady = () => window.dispatchEvent(new Event("iframeApiReady"));

    function instance$1($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Youtube", slots, []);
    	let { videoId } = $$props;
    	let player;
    	let divId = "player_" + parseInt(Math.random() * 109999);

    	function play() {
    		player.playVideo();
    	}

    	function pause() {
    		player.pauseVideo();
    	}

    	function setPlaylist(playlist, index, startSeconds) {
    		player.loadPlaylist(playlist, index, startSeconds);
    	}

    	const dispatch = createEventDispatcher();

    	window.addEventListener("iframeApiReady", function (e) {
    		console.log("yo", divId);

    		player = new YT.Player(divId,
    		{
    				height: "390",
    				width: "640",
    				videoId,
    				events: {
    					onReady: playerIsReady,
    					onStateChange: playerStateChange
    				}
    			});
    	});

    	function playerStateChange({ data }) {
    		dispatch("PlayerStateChange", data);
    		console.log(data);
    		let strReturn = "";

    		if (data == -1) {
    			strReturn = "(unstarted)";
    		}

    		if (data == 0) {
    			strReturn = "(ended)";
    		}

    		if (data == 1) {
    			strReturn = "(playing)";
    		}

    		if (data == 2) {
    			strReturn = "(paused)";
    		}

    		if (data == 3) {
    			strReturn = "(buffering)";
    		}

    		if (data == 5) {
    			strReturn = "(video cued).";
    		}

    		dispatch("PlayerStateChangeString", strReturn);
    	}

    	function playerIsReady() {
    		dispatch("Ready");

    		setInterval(
    			() => {
    				dispatch("currentPlayTime", player.getCurrentTime()); //console.log(player.getCurrentTime())
    			},
    			1000
    		); //console.log(player.getCurrentTime())
    	}

    	const writable_props = ["videoId"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1$1.warn(`<Youtube> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("videoId" in $$props) $$invalidate(1, videoId = $$props.videoId);
    	};

    	$$self.$capture_state = () => ({
    		iframeApiReady,
    		setContext,
    		onMount,
    		tag,
    		firstScriptTag,
    		createEventDispatcher,
    		getContext,
    		videoId,
    		player,
    		divId,
    		play,
    		pause,
    		setPlaylist,
    		dispatch,
    		playerStateChange,
    		playerIsReady
    	});

    	$$self.$inject_state = $$props => {
    		if ("videoId" in $$props) $$invalidate(1, videoId = $$props.videoId);
    		if ("player" in $$props) player = $$props.player;
    		if ("divId" in $$props) $$invalidate(0, divId = $$props.divId);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [divId, videoId, play, pause, setPlaylist];
    }

    class Youtube extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {
    			videoId: 1,
    			play: 2,
    			pause: 3,
    			setPlaylist: 4
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Youtube",
    			options,
    			id: create_fragment$1.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*videoId*/ ctx[1] === undefined && !("videoId" in props)) {
    			console_1$1.warn("<Youtube> was created without expected prop 'videoId'");
    		}
    	}

    	get videoId() {
    		throw new Error("<Youtube>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set videoId(value) {
    		throw new Error("<Youtube>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get play() {
    		return this.$$.ctx[2];
    	}

    	set play(value) {
    		throw new Error("<Youtube>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get pause() {
    		return this.$$.ctx[3];
    	}

    	set pause(value) {
    		throw new Error("<Youtube>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get setPlaylist() {
    		return this.$$.ctx[4];
    	}

    	set setPlaylist(value) {
    		throw new Error("<Youtube>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/App.svelte generated by Svelte v3.37.0 */

    const { console: console_1 } = globals;
    const file = "src/App.svelte";

    // (119:2) {#if plist && $userList != []}
    function create_if_block(ctx) {
    	let playlist;
    	let current;

    	playlist = new Playlist({
    			props: {
    				userListObj: /*$userList*/ ctx[8],
    				min: /*min*/ ctx[3],
    				hour: /*hour*/ ctx[2],
    				breakMusic: /*breakMusic*/ ctx[7],
    				normalMusic: /*normalMusic*/ ctx[6]
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
    			if (dirty & /*$userList*/ 256) playlist_changes.userListObj = /*$userList*/ ctx[8];
    			if (dirty & /*min*/ 8) playlist_changes.min = /*min*/ ctx[3];
    			if (dirty & /*hour*/ 4) playlist_changes.hour = /*hour*/ ctx[2];
    			if (dirty & /*breakMusic*/ 128) playlist_changes.breakMusic = /*breakMusic*/ ctx[7];
    			if (dirty & /*normalMusic*/ 64) playlist_changes.normalMusic = /*normalMusic*/ ctx[6];
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
    		source: "(119:2) {#if plist && $userList != []}",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let main;
    	let header;
    	let t0;
    	let p0;
    	let t1;
    	let t2;
    	let p1;
    	let t3;
    	let t4;
    	let tasklist;
    	let t5;
    	let br;
    	let t6;
    	let button;
    	let t7;
    	let t8;
    	let t9;
    	let current;
    	let mounted;
    	let dispose;

    	header = new Header({
    			props: {
    				version: /*version*/ ctx[0],
    				hour: /*hour*/ ctx[2],
    				min: /*min*/ ctx[3]
    			},
    			$$inline: true
    		});

    	tasklist = new Tasklist({ $$inline: true });
    	let if_block = /*plist*/ ctx[5] && /*$userList*/ ctx[8] != [] && create_if_block(ctx);

    	const block = {
    		c: function create() {
    			main = element("main");
    			create_component(header.$$.fragment);
    			t0 = space();
    			p0 = element("p");
    			t1 = text(/*t*/ ctx[4]);
    			t2 = space();
    			p1 = element("p");
    			t3 = text(/*deltaTime*/ ctx[1]);
    			t4 = space();
    			create_component(tasklist.$$.fragment);
    			t5 = space();
    			br = element("br");
    			t6 = space();
    			button = element("button");
    			t7 = text("Make into Playlist : ");
    			t8 = text(/*plist*/ ctx[5]);
    			t9 = space();
    			if (if_block) if_block.c();
    			add_location(p0, file, 107, 2, 3220);
    			add_location(p1, file, 108, 2, 3233);
    			add_location(br, file, 112, 2, 3277);
    			add_location(button, file, 113, 2, 3286);
    			add_location(main, file, 105, 0, 3175);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			mount_component(header, main, null);
    			append_dev(main, t0);
    			append_dev(main, p0);
    			append_dev(p0, t1);
    			append_dev(main, t2);
    			append_dev(main, p1);
    			append_dev(p1, t3);
    			append_dev(main, t4);
    			mount_component(tasklist, main, null);
    			append_dev(main, t5);
    			append_dev(main, br);
    			append_dev(main, t6);
    			append_dev(main, button);
    			append_dev(button, t7);
    			append_dev(button, t8);
    			append_dev(main, t9);
    			if (if_block) if_block.m(main, null);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler*/ ctx[9], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			const header_changes = {};
    			if (dirty & /*version*/ 1) header_changes.version = /*version*/ ctx[0];
    			if (dirty & /*hour*/ 4) header_changes.hour = /*hour*/ ctx[2];
    			if (dirty & /*min*/ 8) header_changes.min = /*min*/ ctx[3];
    			header.$set(header_changes);
    			if (!current || dirty & /*t*/ 16) set_data_dev(t1, /*t*/ ctx[4]);
    			if (!current || dirty & /*deltaTime*/ 2) set_data_dev(t3, /*deltaTime*/ ctx[1]);
    			if (!current || dirty & /*plist*/ 32) set_data_dev(t8, /*plist*/ ctx[5]);

    			if (/*plist*/ ctx[5] && /*$userList*/ ctx[8] != []) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*plist, $userList*/ 288) {
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
    			dispose();
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
    	/*
      In this example I've used a simple median.
      You can use other methods, but it's important not to use an average. 
      If the user switches tabs and back, an average would put far too much
      weight on the outlier.
      */
    	var values = arr.concat(); // copy array so it isn't mutated

    	values.sort(function (a, b) {
    		return a - b;
    	});

    	if (values.length === 0) return 0;
    	var half = Math.floor(values.length / 2);
    	if (values.length % 2) return values[half];
    	var median = (values[half - 1] + values[half]) / 2;
    	return median;
    }

    function messanger(id, message, callback) {
    	console.log(id + message + "messanger fired");

    	browser.tabs.sendMessage(id, true).then(response => {
    		console.log("Message from the content script:");
    		console.log(response, message);
    		callback();
    	});
    }

    function instance($$self, $$props, $$invalidate) {
    	let $userList;
    	validate_store(userList, "userList");
    	component_subscribe($$self, userList, $$value => $$invalidate(8, $userList = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("App", slots, []);
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
    		var dt = Date.now() - expected; // the drift (positive for overshooting)

    		if (dt > interval) {
    			// something really bad happened. Maybe the browser (tab) was inactive?
    			// possibly special handling to avoid futile "catch up" run
    			console.log("Significant time drift ... Correcting ... (if you get this message many times, please contact us, because it's likely a bug)");

    			$$invalidate(4, t = new Date());
    			$$invalidate(2, hour = t.getHours());
    			$$invalidate(3, min = t.getMinutes());
    			$$invalidate(1, deltaTime = t.getSeconds());
    		}

    		// do what is to be done
    		$$invalidate(1, deltaTime++, deltaTime);

    		// don't update the history for exceptionally large values
    		if (dt <= interval) {
    			// sample drift amount to history after removing current correction
    			// (add to remove because the correction is applied by subtraction)
    			drift_history.push(dt + drift_correction);

    			// predict new drift correction
    			drift_correction = calc_drift(drift_history);

    			// cap and refresh samples
    			if (drift_history.length >= drift_history_samples) {
    				drift_history.shift();
    			}
    		}

    		expected += interval;

    		// take into account drift with prediction
    		setTimeout(step, Math.max(0, interval - dt - drift_correction));
    	}

    	let plist = false;
    	let normalMusic = {};
    	let breakMusic = {};
    	normalMusic.play = () => messanger(0, "play");
    	normalMusic.pause = () => messanger(0, "pause");
    	breakMusic.play = () => messanger(2, "play");
    	breakMusic.pause = () => messanger(2, "pause");
    	const writable_props = ["version"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	const click_handler = function () {
    		$$invalidate(5, plist = !plist);
    	};

    	$$self.$$set = $$props => {
    		if ("version" in $$props) $$invalidate(0, version = $$props.version);
    	};

    	$$self.$capture_state = () => ({
    		Tasklist,
    		Header,
    		Playlist,
    		Youtube,
    		userList,
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
    		$userList
    	});

    	$$self.$inject_state = $$props => {
    		if ("version" in $$props) $$invalidate(0, version = $$props.version);
    		if ("interval" in $$props) interval = $$props.interval;
    		if ("expected" in $$props) expected = $$props.expected;
    		if ("t" in $$props) $$invalidate(4, t = $$props.t);
    		if ("deltaTime" in $$props) $$invalidate(1, deltaTime = $$props.deltaTime);
    		if ("hour" in $$props) $$invalidate(2, hour = $$props.hour);
    		if ("min" in $$props) $$invalidate(3, min = $$props.min);
    		if ("drift_history" in $$props) drift_history = $$props.drift_history;
    		if ("drift_history_samples" in $$props) drift_history_samples = $$props.drift_history_samples;
    		if ("drift_correction" in $$props) drift_correction = $$props.drift_correction;
    		if ("plist" in $$props) $$invalidate(5, plist = $$props.plist);
    		if ("normalMusic" in $$props) $$invalidate(6, normalMusic = $$props.normalMusic);
    		if ("breakMusic" in $$props) $$invalidate(7, breakMusic = $$props.breakMusic);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*deltaTime, min, hour*/ 14) {
    			{
    				if (deltaTime === 60) {
    					$$invalidate(3, min++, min);
    					$$invalidate(1, deltaTime = 0);
    				}

    				if (min >= 60) {
    					$$invalidate(2, hour++, hour);
    					$$invalidate(3, min = 0);
    				}

    				if (hour == 24) {
    					$$invalidate(2, hour = 0);
    				}
    			}
    		}
    	};

    	return [
    		version,
    		deltaTime,
    		hour,
    		min,
    		t,
    		plist,
    		normalMusic,
    		breakMusic,
    		$userList,
    		click_handler
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

    		if (/*version*/ ctx[0] === undefined && !("version" in props)) {
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
        version: "Beta",
      },
    });

    return app;

}());
//# sourceMappingURL=bundle.js.map
