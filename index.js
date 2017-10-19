(function(dependencies, chunks, undefined, global) {
    
    var cache = [],
        cacheCallbacks = {};
    

    function Module() {
        this.id = null;
        this.filename = null;
        this.dirname = null;
        this.exports = {};
        this.loaded = false;
    }

    Module.prototype.require = require;

    function require(index) {
        var module = cache[index],
            callback, exports;

        if (module !== undefined) {
            return module.exports;
        } else {
            callback = dependencies[index];

            cache[index] = module = new Module();
            exports = module.exports;

            callback.call(exports, require, exports, module, undefined, global);
            module.loaded = true;

            return module.exports;
        }
    }

    require.resolve = function(path) {
        return path;
    };

    
    require.async = function async(index, callback) {
        var module = cache[index],
            callbacks, node;

        if (module) {
            callback(module.exports);
        } else if ((callbacks = cacheCallbacks[index])) {
            callbacks[callbacks.length] = callback;
        } else {
            node = document.createElement("script");
            callbacks = cacheCallbacks[index] = [callback];

            node.type = "text/javascript";
            node.charset = "utf-8";
            node.async = true;

            function onLoad() {
                var i = -1,
                    il = callbacks.length - 1;

                while (i++ < il) {
                    callbacks[i](require(index));
                }
                delete cacheCallbacks[index];
            }

            if (node.attachEvent && !(node.attachEvent.toString && node.attachEvent.toString().indexOf("[native code") < 0)) {
                node.attachEvent("onreadystatechange", onLoad);
            } else {
                node.addEventListener("load", onLoad, false);
            }

            node.src = chunks[index];

            document.head.appendChild(node);
        }
    };

    global["AVfCePMB-3dcz-4N3p-Nsma-JyLP9SqwBtGQo"] = function(asyncDependencies) {
        var i = -1,
            il = asyncDependencies.length - 1,
            dependency, index;

        while (i++ < il) {
            dependency = asyncDependencies[i];
            index = dependency[0];

            if (dependencies[index] === null) {
                dependencies[index] = dependency[1];
            }
        }
    };

    

    if (typeof(define) === "function" && define.amd) {
        define([], function() {
            return require(0);
        });
    } else if (typeof(module) !== "undefined" && module.exports) {
        module.exports = require(0);
    } else {
        
        require(0);
        
    }
}([
function(require, exports, module, undefined, global) {
/*@=-/var/www/html/node/_immutable/js-immutable-playground/src/index.js-=@*/
var vm = require(1),
    ImmutableList = require(2),
    ImmutableVector = require(3),
    ImmutableHashMap = require(4),
    ImmutableSet = require(5),
    ImmutableRecord = require(6);


var context = {
    ImmutableList: ImmutableList,
    ImmutableVector: ImmutableVector,
    ImmutableHashMap: ImmutableHashMap,
    ImmutableSet: ImmutableSet,
    ImmutableRecord: ImmutableRecord
};


var input = document.getElementById("input"),
    code = document.getElementById("code"),
    scroll = document.getElementById("scroll");

input.addEventListener("keypress", function onKeyPress(e) {
    if (e.which === 13) {
        evaluate(input.value || "\n");
    }
});


function evaluate(value) {
    var result;

    try {
        result = vm.runInNewContext(value, context);
    } catch(e) {
        result = e.toString();
    }

    code.innerHTML += "> " + value + "\n";
    code.innerHTML += "  " + result + "\n";

    input.value = "";

    scroll.scrollTop = scroll.scrollHeight;
}

evaluate("// Simple JS Console");
evaluate("ImmutableList.of(0, 1, 2, 3, 4);");

},
function(require, exports, module, undefined, global) {
/*@=-vm-browserify@0.0.4/index.js-=@*/
var indexOf = require(7);

var Object_keys = function (obj) {
    if (Object.keys) return Object.keys(obj)
    else {
        var res = [];
        for (var key in obj) res.push(key)
        return res;
    }
};

var forEach = function (xs, fn) {
    if (xs.forEach) return xs.forEach(fn)
    else for (var i = 0; i < xs.length; i++) {
        fn(xs[i], i, xs);
    }
};

var defineProp = (function() {
    try {
        Object.defineProperty({}, '_', {});
        return function(obj, name, value) {
            Object.defineProperty(obj, name, {
                writable: true,
                enumerable: false,
                configurable: true,
                value: value
            })
        };
    } catch(e) {
        return function(obj, name, value) {
            obj[name] = value;
        };
    }
}());

var globals = ['Array', 'Boolean', 'Date', 'Error', 'EvalError', 'Function',
'Infinity', 'JSON', 'Math', 'NaN', 'Number', 'Object', 'RangeError',
'ReferenceError', 'RegExp', 'String', 'SyntaxError', 'TypeError', 'URIError',
'decodeURI', 'decodeURIComponent', 'encodeURI', 'encodeURIComponent', 'escape',
'eval', 'isFinite', 'isNaN', 'parseFloat', 'parseInt', 'undefined', 'unescape'];

function Context() {}
Context.prototype = {};

var Script = exports.Script = function NodeScript (code) {
    if (!(this instanceof Script)) return new Script(code);
    this.code = code;
};

Script.prototype.runInContext = function (context) {
    if (!(context instanceof Context)) {
        throw new TypeError("needs a 'context' argument.");
    }
    
    var iframe = document.createElement('iframe');
    if (!iframe.style) iframe.style = {};
    iframe.style.display = 'none';
    
    document.body.appendChild(iframe);
    
    var win = iframe.contentWindow;
    var wEval = win.eval, wExecScript = win.execScript;

    if (!wEval && wExecScript) {
        // win.eval() magically appears when this is called in IE:
        wExecScript.call(win, 'null');
        wEval = win.eval;
    }
    
    forEach(Object_keys(context), function (key) {
        win[key] = context[key];
    });
    forEach(globals, function (key) {
        if (context[key]) {
            win[key] = context[key];
        }
    });
    
    var winKeys = Object_keys(win);

    var res = wEval.call(win, this.code);
    
    forEach(Object_keys(win), function (key) {
        // Avoid copying circular objects like `top` and `window` by only
        // updating existing context properties or new properties in the `win`
        // that was only introduced after the eval.
        if (key in context || indexOf(winKeys, key) === -1) {
            context[key] = win[key];
        }
    });

    forEach(globals, function (key) {
        if (!(key in context)) {
            defineProp(context, key, win[key]);
        }
    });
    
    document.body.removeChild(iframe);
    
    return res;
};

Script.prototype.runInThisContext = function () {
    return eval(this.code); // maybe...
};

Script.prototype.runInNewContext = function (context) {
    var ctx = Script.createContext(context);
    var res = this.runInContext(ctx);

    forEach(Object_keys(ctx), function (key) {
        context[key] = ctx[key];
    });

    return res;
};

forEach(Object_keys(Script.prototype), function (name) {
    exports[name] = Script[name] = function (code) {
        var s = Script(code);
        return s[name].apply(s, [].slice.call(arguments, 1));
    };
});

exports.createScript = function (code) {
    return exports.Script(code);
};

exports.createContext = Script.createContext = function (context) {
    var copy = new Context();
    if(typeof context === 'object') {
        forEach(Object_keys(context), function (key) {
            copy[key] = context[key];
        });
    }
    return copy;
};

},
function(require, exports, module, undefined, global) {
/*@=-@nathanfaucett/immutable-list@0.0.3/src/index.js-=@*/
var isNull = require(8),
    isUndefined = require(9),
    isArrayLike = require(10),
    isNumber = require(11),
    Iterator = require(12),
    fastBindThis = require(13),
    fastSlice = require(14),
    defineProperty = require(15),
    freeze = require(16),
    isEqual = require(17);


var INTERNAL_CREATE = {},

    ITERATOR_SYMBOL = typeof(Symbol) === "function" ? Symbol.iterator : false,
    IS_LIST = "__ImmutableList__",

    EMPTY_LIST = freeze(new List(INTERNAL_CREATE)),

    IteratorValue = Iterator.Value,

    ListPrototype = List.prototype;


module.exports = List;


function List(value) {
    if (!(this instanceof List)) {
        throw new Error("List() must be called with new");
    }

    this._size = 0;
    this._root = null;
    this._tail = null;

    if (value !== INTERNAL_CREATE) {
        return List_createList(this, value, arguments);
    } else {
        return this;
    }
}

List.EMPTY = EMPTY_LIST;

function List_createList(_this, value, values) {
    var length = values.length;

    if (length > 1) {
        return List_fromArray(_this, values);
    } else if (length === 1) {
        if (isList(value)) {
            return value;
        } else if (isArrayLike(value)) {
            return List_fromArray(_this, value.toArray ? value.toArray() : value);
        } else {
            _this._root = _this._tail = new Node(value, null);
            _this._size = 1;
            return freeze(_this);
        }
    } else {
        return EMPTY_LIST;
    }
}

function List_fromArray(_this, array) {
    var length = array.length,
        i = length - 1,
        tail = new Node(array[i], null),
        root = tail;

    while (i--) {
        root = new Node(array[i], root);
    }

    _this._size = length;
    _this._root = root;
    _this._tail = tail;

    return freeze(_this);
}

List.fromArray = function(array) {
    if (array.length > 0) {
        return List_fromArray(new List(INTERNAL_CREATE), array);
    } else {
        return EMPTY_LIST;
    }
};

List.of = function() {
    return List_createList(new List(INTERNAL_CREATE), arguments[0], arguments);
};

function isList(value) {
    return value && value[IS_LIST] === true;
}

List.isList = isList;

defineProperty(ListPrototype, IS_LIST, {
    configurable: false,
    enumerable: false,
    writable: false,
    value: true
});

ListPrototype.size = function() {
    return this._size;
};

if (defineProperty.hasGettersSetters) {
    defineProperty(ListPrototype, "length", {
        get: ListPrototype.size
    });
}

ListPrototype.count = ListPrototype.size;

ListPrototype.isEmpty = function() {
    return this._size === 0;
};

function List_get(_this, index) {
    if (index === 0) {
        return _this._root;
    } else if (index === _this._size - 1) {
        return _this._tail;
    } else {
        return findNode(_this._root, index);
    }
}

ListPrototype.get = function(index, notSetValue) {
    if (!isNumber(index) || index < 0 || index >= this._size) {
        return notSetValue;
    } else {
        return List_get(this, index).value;
    }
};

ListPrototype.nth = ListPrototype.get;

ListPrototype.first = function(notSetValue) {
    var node = this._root;

    if (isNull(node)) {
        return notSetValue;
    } else {
        return node.value;
    }
};

ListPrototype.last = function(notSetValue) {
    var node = this._tail;

    if (isNull(node)) {
        return notSetValue;
    } else {
        return node.value;
    }
};

ListPrototype.indexOf = function(value) {
    var node = this._root,
        i = 0;

    while (!isNull(node)) {
        if (isEqual(node.value, value)) {
            return i;
        }
        node = node.next;
        i += 1;
    }

    return -1;
};

function copyFromTo(from, to, newNode) {
    if (from !== to) {
        return new Node(from.value, copyFromTo(from.next, to, newNode));
    } else {
        return newNode;
    }
}

function List_set(_this, node, index, value) {
    var list = new List(INTERNAL_CREATE),
        newNode = new Node(value, node.next),
        root = copyFromTo(_this._root, node, newNode),
        tail = isNull(node.next) ? newNode : _this._tail;

    list._size = _this._size;
    list._root = root;
    list._tail = tail;

    return freeze(list);
}

ListPrototype.set = function(index, value) {
    var node;

    if (index < 0 || index >= this._size) {
        throw new Error("List set(index, value) index out of bounds");
    } else {
        node = List_get(this, index);

        if (isEqual(node.value, value)) {
            return this;
        } else {
            return List_set(this, node, index, value);
        }
    }
};

function findParent(parent, node) {
    var next = parent.next;

    if (next !== node) {
        return findParent(next, node);
    } else {
        return parent;
    }
}

function insertCreateNodes(values, index, length, root) {
    var i = index - 1,
        il = length - 1;

    while (i++ < il) {
        root = new Node(values[i], root);
    }

    return root;
}

function List_insert(_this, node, index, values) {
    var list = new List(INTERNAL_CREATE),

        oldRoot = _this._root,
        parent = oldRoot !== node ? findParent(oldRoot, node) : null,

        length = values.length,

        tail = new Node(values[length - 1], node),
        first = insertCreateNodes(values, 0, length - 1, tail),

        root = isNull(parent) ? first : copyFromTo(oldRoot, node, first);

    list._size = _this._size + length;
    list._root = root;
    list._tail = tail;

    return freeze(list);
}

ListPrototype.insert = function(index) {
    if (index < 0 || index >= this._size) {
        throw new Error("List insert(index, value) index out of bounds");
    } else {
        return List_insert(this, List_get(this, index), index, fastSlice(arguments, 1));
    }
};

function findNext(node, count) {

    while (count-- && !isNull(node)) {
        node = node.next;
    }

    return node;
}

function List_remove(_this, node, count) {
    var list = new List(INTERNAL_CREATE),
        next = findNext(node, count),
        root = copyFromTo(_this._root, node, next),
        tail = isNull(next) ? _this._tail : next;

    list._size = _this._size - count;
    list._root = root;
    list._tail = tail;

    return freeze(list);
}

ListPrototype.remove = function(index, count) {
    var size = this._size,
        node;

    count = count || 1;

    if (index < 0 || index >= size) {
        throw new Error("List remove(index[, count=1]) index out of bounds");
    } else if (count > 0) {
        node = List_get(this, index);

        if (node === this._root && count === size) {
            return EMPTY_LIST;
        } else {
            return List_remove(this, node, count);
        }
    } else {
        return this;
    }
};

function List_conj(_this, values) {
    var list = new List(INTERNAL_CREATE),
        root = _this._root,
        tail = _this._tail,
        size = _this._size,
        length = values.length,
        il = length - 1,
        i = 0;

    if (isNull(tail)) {
        root = tail = new Node(values[i], null);
    } else {
        i = -1;
    }

    while (i++ < il) {
        root = new Node(values[i], root);
    }

    list._size = length + size;
    list._root = root;
    list._tail = tail;

    return freeze(list);
}

ListPrototype.unshiftArray = function(array) {
    if (array.length !== 0) {
        return List_conj(this, array);
    } else {
        return this;
    }
};

ListPrototype.conj = function() {
    return this.unshiftArray(arguments);
};

ListPrototype.unshift = ListPrototype.conj;

function List_pop(_this) {
    var list = new List(INTERNAL_CREATE),
        root = _this._root,
        tail = _this._tail,
        newRoot = new Node(root.value, null),
        newTail = newRoot;

    while (true) {
        root = root.next;

        if (isNull(root) || root === tail) {
            break;
        } else {
            newTail = newTail.next = new Node(root.value, null);
        }
    }

    list._size = _this._size - 1;
    list._root = newRoot;
    list._tail = newTail;

    return freeze(list);
}

ListPrototype.pop = function() {
    var size = this._size;

    if (size === 0) {
        return this;
    } else if (size === 1) {
        return EMPTY_LIST;
    } else {
        return List_pop(this);
    }
};

function List_shift(_this) {
    var list = new List(INTERNAL_CREATE);

    list._size = _this._size - 1;
    list._root = _this._root.next;
    list._tail = _this._tail;

    return freeze(list);
}

ListPrototype.shift = function() {
    var size = this._size;

    if (size === 0) {
        return this;
    } else if (size === 1) {
        return EMPTY_LIST;
    } else {
        return List_shift(this);
    }
};

ListPrototype.rest = ListPrototype.shift;

function pushCreateNodes(values, length, root) {
    var i = length;

    while (i--) {
        root = new Node(values[i], root);
    }

    return root;
}

function copyNodes(node, last) {
    if (isNull(node)) {
        return last;
    } else {
        return new Node(node.value, copyNodes(node.next, last));
    }
}

function List_push(_this, values, length) {
    var list = new List(INTERNAL_CREATE),

        oldRoot = _this._root,

        tail = new Node(values[length - 1], null),
        first = length !== 1 ? pushCreateNodes(values, length - 1, tail) : tail,

        root = isNull(oldRoot) ? first : copyNodes(oldRoot, first);

    list._size = _this._size + length;
    list._root = root;
    list._tail = tail;

    return freeze(list);
}

ListPrototype.pushArray = function(array) {
    var length = array.length;

    if (length !== 0) {
        return List_push(this, array, length);
    } else {
        return this;
    }
};

ListPrototype.push = function() {
    return this.pushArray(arguments);
};

function List_concat(a, b) {
    var asize = a._size,
        bsize = b._size,
        root, tail, list;

    if (asize === 0) {
        return b;
    } else if (bsize === 0) {
        return a;
    } else {
        root = copyNodes(a._root, b._root);
        tail = b._tail;

        list = new List(INTERNAL_CREATE);
        list._size = asize + bsize;
        list._root = root;
        list._tail = tail;

        return freeze(list);
    }
}

ListPrototype.concatArray = function(array) {
    var length = array.length,
        i, il, list;

    if (length !== 0) {
        i = -1;
        il = length - 1;
        list = this;

        while (i++ < il) {
            list = List_concat(list, array[i]);
        }

        return list;
    } else {
        return this;
    }
};

ListPrototype.concat = function() {
    return this.concatArray(arguments);
};

function List_iterator(_this) {
    var node = _this._root;

    return new Iterator(function next() {
        var value;

        if (isNull(node)) {
            return Iterator.createDone();
        } else {
            value = node.value;
            node = node.next;

            return new IteratorValue(value, false);
        }
    });
}

function List_iteratorReverse(_this) {
    var root = _this._root,
        node = _this._tail;

    return new Iterator(function next() {
        var value;

        if (isNull(node)) {
            return Iterator.createDone();
        } else {
            value = node.value;
            node = root !== node ? findParent(root, node) : null;

            return new IteratorValue(value, false);
        }
    });
}

ListPrototype.iterator = function(reverse) {
    if (reverse !== true) {
        return List_iterator(this);
    } else {
        return List_iteratorReverse(this);
    }
};

if (ITERATOR_SYMBOL) {
    ListPrototype[ITERATOR_SYMBOL] = ListPrototype.iterator;
}

function List_every(_this, it, callback) {
    var next = it.next(),
        index = 0;

    while (next.done === false) {
        if (!callback(next.value, index, _this)) {
            return false;
        }
        next = it.next();
        index += 1;
    }

    return true;
}

ListPrototype.every = function(callback, thisArg) {
    return List_every(this, List_iterator(this), isUndefined(thisArg) ? callback : fastBindThis(callback, thisArg, 3));
};

function List_filter(_this, it, callback) {
    var results = [],
        next = it.next(),
        index = 0,
        j = 0,
        value;

    while (next.done === false) {
        value = next.value;

        if (callback(value, index, _this)) {
            results[j++] = value;
        }

        next = it.next();
        index += 1;
    }

    return List.of(results);
}

ListPrototype.filter = function(callback, thisArg) {
    return List_filter(this, List_iterator(this), isUndefined(thisArg) ? callback : fastBindThis(callback, thisArg, 3));
};

function List_forEach(_this, it, callback) {
    var next = it.next(),
        index = 0;

    while (next.done === false) {
        if (callback(next.value, index, _this) === false) {
            break;
        }
        next = it.next();
        index += 1;
    }

    return _this;
}

ListPrototype.forEach = function(callback, thisArg) {
    return List_forEach(this, List_iterator(this), isUndefined(thisArg) ? callback : fastBindThis(callback, thisArg, 3));
};

ListPrototype.each = ListPrototype.forEach;

function List_forEachRight(_this, it, callback) {
    var next = it.next(),
        index = _this._size;

    while (next.done === false) {
        index -= 1;
        if (callback(next.value, index, _this) === false) {
            break;
        }
        next = it.next();
    }

    return _this;
}

ListPrototype.forEachRight = function(callback, thisArg) {
    return List_forEachRight(this, List_iteratorReverse(this), isUndefined(thisArg) ? callback : fastBindThis(callback, thisArg, 3));
};

ListPrototype.eachRight = ListPrototype.forEachRight;

function List_map(_this, it, callback) {
    var next = it.next(),
        results = new Array(_this._size),
        index = 0;

    while (next.done === false) {
        results[index] = callback(next.value, index, _this);
        next = it.next();
        index += 1;
    }

    return List.of(results);
}

ListPrototype.map = function(callback, thisArg) {
    return List_map(this, List_iterator(this), isUndefined(thisArg) ? callback : fastBindThis(callback, thisArg, 3));
};

function List_reduce(_this, it, callback, initialValue) {
    var next = it.next(),
        value = initialValue,
        index = 0;

    if (isUndefined(value)) {
        value = next.value;
        next = it.next();
        index = 1;
    }

    while (next.done === false) {
        value = callback(value, next.value, index, _this);
        next = it.next();
        index += 1;
    }

    return value;
}

ListPrototype.reduce = function(callback, initialValue, thisArg) {
    return List_reduce(this, List_iterator(this), isUndefined(thisArg) ? callback : fastBindThis(callback, thisArg, 4), initialValue);
};

function List_reduceRight(_this, it, callback, initialValue) {
    var next = it.next(),
        value = initialValue,
        index = _this._size;

    if (isUndefined(value)) {
        value = next.value;
        next = it.next();
        index -= 1;
    }

    while (next.done === false) {
        index -= 1;
        value = callback(value, next.value, index, _this);
        next = it.next();
    }

    return value;
}

ListPrototype.reduceRight = function(callback, initialValue, thisArg) {
    return List_reduceRight(this, List_iteratorReverse(this), isUndefined(thisArg) ? callback : fastBindThis(callback, thisArg, 4), initialValue);
};

function List_some(_this, it, callback) {
    var next = it.next(),
        index = 0;

    while (next.done === false) {
        if (callback(next.value, index, _this)) {
            return true;
        }
        next = it.next();
        index += 1;
    }

    return false;
}

ListPrototype.some = function(callback, thisArg) {
    return List_some(this, List_iterator(this), isUndefined(thisArg) ? callback : fastBindThis(callback, thisArg, 3));
};

ListPrototype.toArray = function() {
    var array = new Array(this._size),
        node = this._root,
        i = 0;

    while (!isNull(node)) {
        array[i++] = node.value;
        node = node.next;
    }

    return array;
};

ListPrototype.toJSON = ListPrototype.toArray;
List.fromJSON = List.fromArray;

ListPrototype.join = function(separator) {
    var result = "",
        node = this._root,
        value;

    separator = separator || " ";

    while (!isNull(node)) {
        value = node.value;
        node = node.next;

        if (isNull(node)) {
            result += value;
            break;
        } else {
            result += value + separator;
        }
    }

    return result;
};

ListPrototype.toString = function() {
    return "(" + this.join() + ")";
};

ListPrototype.inspect = ListPrototype.toString;

List.equal = function(a, b) {
    if (a === b) {
        return true;
    } else if (!a || !b || a._size !== b._size) {
        return false;
    } else {
        a = a._root;
        b = b._root;

        while (!(isNull(a) || isNull(b))) {
            if (isEqual(a.value, b.value)) {
                a = a.next;
                b = b.next;
            } else {
                return false;
            }
        }

        return true;
    }
};

ListPrototype.equals = function(b) {
    return List.equal(this, b);
};

function Node(value, next) {
    this.value = value;
    this.next = next;
}

function findNode(root, index) {
    var i = 0,
        node = root;

    while (i++ !== index) {
        node = node.next;
    }

    return node;
}
},
function(require, exports, module, undefined, global) {
/*@=-@nathanfaucett/immutable-vector@0.0.3/src/index.js-=@*/
var freeze = require(16),
    Iterator = require(12),
    isNull = require(8),
    isUndefined = require(9),
    isNumber = require(11),
    isArrayLike = require(10),
    fastBindThis = require(13),
    fastSlice = require(14),
    defineProperty = require(15),
    isEqual = require(17);


var INTERNAL_CREATE = {},

    ITERATOR_SYMBOL = typeof(Symbol) === "function" ? Symbol.iterator : false,
    IS_VECTOR = "_ImmutableVector_",

    SHIFT = 5,
    SIZE = 1 << SHIFT,
    MASK = SIZE - 1,

    EMPTY_ARRAY = freeze(createArray()),
    EMPTY_VECTOR = freeze(new Vector(INTERNAL_CREATE)),

    IteratorValue = Iterator.Value,

    VectorPrototype = Vector.prototype;


module.exports = Vector;


function Vector(value) {
    if (!(this instanceof Vector)) {
        throw new Error("Vector() must be called with new");
    }

    this._root = EMPTY_ARRAY;
    this._tail = EMPTY_ARRAY;
    this._size = 0;
    this._shift = SHIFT;

    if (value !== INTERNAL_CREATE) {
        return Vector_createVector(this, value, arguments);
    } else {
        return this;
    }
}

Vector.EMPTY = EMPTY_VECTOR;

function Vector_createVector(_this, value, args) {
    var length = args.length,
        tail;

    if (length > SIZE) {
        return Vector_conjArray(_this, args);
    } else if (length > 1) {
        _this._tail = cloneArray(args, length);
        _this._size = length;
        return freeze(_this);
    } else if (length === 1) {
        if (isVector(value)) {
            return value;
        } else if (isArrayLike(value)) {
            return Vector_conjArray(_this, value.toArray ? value.toArray() : value);
        } else {
            tail = _this._tail = createArray();
            tail[0] = value;
            _this._size = 1;
            return freeze(_this);
        }
    } else {
        return EMPTY_VECTOR;
    }
}

Vector.fromArray = function(array) {
    if (array.length > 0) {
        return Vector_createVector(new Vector(INTERNAL_CREATE), array[0], array);
    } else {
        return EMPTY_VECTOR;
    }
};

Vector.of = function() {
    return Vector_createVector(new Vector(INTERNAL_CREATE), arguments[0], arguments);
};

function isVector(value) {
    return !!(value && value[IS_VECTOR]);
}

Vector.isVector = isVector;

defineProperty(VectorPrototype, IS_VECTOR, {
    configurable: false,
    enumerable: false,
    writable: false,
    value: true
});

VectorPrototype.size = function() {
    return this._size;
};

if (defineProperty.hasGettersSetters) {
    defineProperty(VectorPrototype, "length", {
        get: VectorPrototype.size
    });
}

VectorPrototype.count = VectorPrototype.size;

VectorPrototype.isEmpty = function() {
    return this._size === 0;
};

function tailOff(size) {
    if (size < SIZE) {
        return 0;
    } else {
        return ((size - 1) >>> SHIFT) << SHIFT;
    }
}

function Vector_getArray(_this, index) {
    var array, level;

    if (index >= tailOff(_this._size)) {
        return _this._tail;
    } else {
        array = _this._root;
        level = _this._shift;

        while (level > 0) {
            array = array[(index >>> level) & MASK];
            level = level - SHIFT;
        }

        return array;
    }
}

function Vector_get(_this, index) {
    return Vector_getArray(_this, index)[index & MASK];
}

VectorPrototype.get = function(index, notSetValue) {
    if (!isNumber(index) || index < 0 || index >= this._size) {
        return notSetValue;
    } else {
        return Vector_get(this, index);
    }
};

VectorPrototype.nth = VectorPrototype.get;

VectorPrototype.first = function(notSetValue) {
    var size = this._size;

    if (size === 0) {
        return notSetValue;
    } else {
        return Vector_get(this, 0);
    }
};

VectorPrototype.last = function(notSetValue) {
    var size = this._size;

    if (size === 0) {
        return notSetValue;
    } else {
        return this._tail[(size - 1) & MASK];
    }
};

VectorPrototype.indexOf = function(value) {
    var size = this._size,
        i = -1,
        il = size - 1;

    while (i++ < il) {
        if (isEqual(Vector_get(this, i), value)) {
            return i;
        }
    }

    return -1;
};

function newPathSet(array, size, index, value, level) {
    var newArray = cloneArray(array, ((size - 1) >>> level) & MASK),
        subIndex;

    if (level === 0) {
        newArray[index & MASK] = value;
    } else {
        subIndex = (index >>> level) & MASK;
        newArray[subIndex] = newPathSet(array[subIndex], size, index, value, level - SHIFT);
    }

    return newArray;
}

function Vector_set(_this, index, value) {
    var size = _this._size,
        tail, maskedIndex, vector;

    if (index >= tailOff(size)) {
        tail = _this._tail;
        maskedIndex = index & MASK;

        if (isEqual(tail[maskedIndex], value)) {
            return _this;
        } else {
            tail = cloneArray(tail, (size + 1) & MASK);
            tail[maskedIndex] = value;
            vector = Vector_clone(_this);
            vector._tail = tail;
            return freeze(vector);
        }
    } else if (isEqual(Vector_get(_this, index), value)) {
        return _this;
    } else {
        vector = Vector_clone(_this);
        vector._root = newPathSet(_this._root, size, index, value, _this._shift);
        return freeze(vector);
    }
}

VectorPrototype.set = function(index, value) {
    if (index < 0 || index >= this._size) {
        throw new Error("Vector set(index, value) index out of bounds");
    } else {
        return Vector_set(this, index, value);
    }
};


function Vector_insert(_this, index, values) {
    var size = _this._size,
        length = values.length,
        newSize = size + length,
        results = new Array(newSize),
        j = 0,
        k = 0,
        i, il;

    i = -1;
    il = index - 1;
    while (i++ < il) {
        results[i] = Vector_get(_this, k++);
    }

    i = index - 1;
    il = index + length - 1;
    while (i++ < il) {
        results[i] = values[j++];
    }

    i = index + length - 1;
    il = newSize - 1;
    while (i++ < il) {
        results[i] = Vector_get(_this, k++);
    }

    return Vector_conjArray(new Vector(INTERNAL_CREATE), results);
}

VectorPrototype.insert = function(index) {
    if (index < 0 || index >= this._size) {
        throw new Error("Vector set(index, value) index out of bounds");
    } else {
        return Vector_insert(this, index, fastSlice(arguments, 1));
    }
};

function Vector_remove(_this, index, count) {
    var size = _this._size,
        results = new Array(size - count),
        j = 0,
        i, il;

    i = -1;
    il = index - 1;
    while (i++ < il) {
        results[j++] = Vector_get(_this, i);
    }

    i = index + count - 1;
    il = size - 1;
    while (i++ < il) {
        results[j++] = Vector_get(_this, i);
    }

    return Vector_conjArray(new Vector(INTERNAL_CREATE), results);
}

VectorPrototype.remove = function(index, count) {
    var size = this._size;

    count = count || 1;

    if (index < 0 || index >= size) {
        throw new Error("Vector remove(index[, count=1]) index out of bounds");
    } else if (count > 0) {
        return Vector_remove(this, index, count);
    } else {
        return this;
    }
};

function newPath(array, level) {
    var newArray;

    if (level === 0) {
        return array;
    } else {
        newArray = createArray();
        newArray[0] = newPath(array, level - SHIFT);
        return newArray;
    }
}

function pushTail(parentArray, tailArray, size, level) {
    var subIndex = ((size - 1) >>> level) & MASK,
        newArray = cloneArray(parentArray, subIndex),
        arrayToInsert;

    if (level === SHIFT) {
        arrayToInsert = tailArray;
    } else {
        child = parentArray[subIndex];

        if (isUndefined(child)) {
            arrayToInsert = newPath(tailArray, level - SHIFT);
        } else {
            arrayToInsert = pushTail(child, tailArray, size, level - SHIFT);
        }
    }

    newArray[subIndex] = arrayToInsert;

    return newArray;
}

function Vector_conj(_this, value) {
    var root = _this._root,
        size = _this._size,
        shift = _this._shift,
        tailArray, newShift, newRoot, newTail;

    if (size - tailOff(size) < SIZE) {
        _this._tail[size & MASK] = value;
    } else {
        tailArray = _this._tail;
        newShift = shift;

        if ((size >>> SHIFT) > (1 << shift)) {
            newRoot = createArray();
            newRoot[0] = root;
            newRoot[1] = newPath(tailArray, shift);
            newShift += SHIFT;
        } else {
            newRoot = pushTail(root, tailArray, size, shift);
        }

        newTail = createArray();
        newTail[0] = value;
        _this._tail = newTail;

        _this._root = newRoot;
        _this._shift = newShift;
    }

    _this._size = size + 1;

    return _this;
}

function Vector_conjArray(_this, values) {
    var tail = _this._tail,
        size = _this._size,
        i = -1,
        il = values.length - 1;

    if (tail === EMPTY_ARRAY) {
        _this._tail = createArray();
    } else if (size - tailOff(size) < SIZE) {
        _this._tail = cloneArray(tail, (size + 1) & MASK);
    }

    while (i++ < il) {
        Vector_conj(_this, values[i]);
    }

    return freeze(_this);
}

function Vector_clone(_this) {
    var vector = new Vector(INTERNAL_CREATE);
    vector._root = _this._root;
    vector._tail = _this._tail;
    vector._size = _this._size;
    vector._shift = _this._shift;
    return vector;
}

VectorPrototype.conj = function() {
    return this.pushArray(arguments);
};

VectorPrototype.pushArray = function(array) {
    if (array.length !== 0) {
        return Vector_conjArray(Vector_clone(this), array);
    } else {
        return this;
    }
};

VectorPrototype.push = VectorPrototype.conj;

function Vector_concat(a, b) {
    var asize = a._size,
        bsize = b._size;

    if (asize === 0) {
        return b;
    } else if (bsize === 0) {
        return a;
    } else {
        return Vector_conjArray(Vector_clone(a), b.toArray());
    }
}

VectorPrototype.concatArray = function(array) {
    var length = array.length,
        i, il, vector;

    if (length !== 0) {
        i = -1;
        il = length - 1;
        vector = this;

        while (i++ < il) {
            vector = Vector_concat(vector, array[i]);
        }

        return vector;
    } else {
        return this;
    }
};

VectorPrototype.concat = function() {
    return this.concatArray(arguments);
};

function Vector_unshift(_this, values) {
    var size = _this._size,
        length = values.length,
        newSize = size + length,
        results = new Array(newSize),
        j = length - 1,
        k = 0,
        i, il;

    i = -1;
    il = length - 1;
    while (i++ < il) {
        results[k++] = values[j--];
    }

    i = -1;
    il = size - 1;
    while (i++ < il) {
        results[k++] = Vector_get(_this, i);
    }

    return Vector_conjArray(new Vector(INTERNAL_CREATE), results);
}

VectorPrototype.unshiftArray = function(array) {
    if (array.length !== 0) {
        return Vector_unshift(this, array);
    } else {
        return this;
    }
};

VectorPrototype.unshift = function() {
    return this.unshiftArray(arguments);
};

function popTail(array, size, level) {
    var subIndex = ((size - 2) >>> level) & MASK,
        newChild, newArray;

    if (level > 5) {
        newChild = popTail(array[subIndex], size, level - SHIFT);

        if (isUndefined(newChild) && subIndex === 0) {
            return null;
        } else {
            newArray = cloneArray(array, subIndex);
            newArray[subIndex] = newChild;
            return newArray;
        }
    } else if (subIndex === 0) {
        return null;
    } else {
        return cloneArray(array, subIndex);
    }
}

function Vector_pop(_this) {
    var vector = new Vector(INTERNAL_CREATE),
        size = _this._size,
        shift, newTail, newRoot, newShift;

    if (size - tailOff(size) > 1) {
        newTail = _this._tail.slice(0, (size - 1) & MASK);
        newRoot = _this._root;
        newShift = _this._shift;
    } else {
        newTail = Vector_getArray(_this, size - 2);

        shift = _this._shift;
        newRoot = popTail(_this._root, size, shift);
        newShift = shift;

        if (isNull(newRoot)) {
            newRoot = EMPTY_ARRAY;
        } else if (shift > SHIFT && isUndefined(newRoot[1])) {
            newRoot = newRoot[0];
            newShift -= SHIFT;
        }
    }

    vector._root = newRoot;
    vector._tail = newTail;
    vector._size = size - 1;
    vector._shift = newShift;

    return freeze(vector);
}

VectorPrototype.pop = function() {
    var size = this._size;

    if (size === 0) {
        return this;
    } else if (size === 1) {
        return EMPTY_VECTOR;
    } else {
        return Vector_pop(this);
    }
};

function Vector_shift(_this) {
    var size = _this._size,
        newSize = size - 1,
        results = new Array(newSize),
        j = 0,
        i = 0,
        il = size - 1;

    while (i++ < il) {
        results[j++] = Vector_get(_this, i);
    }

    return Vector_conjArray(new Vector(INTERNAL_CREATE), results);
}

VectorPrototype.shift = function() {
    var size = this._size;

    if (size === 0) {
        return this;
    } else if (size === 1) {
        return EMPTY_VECTOR;
    } else {
        return Vector_shift(this);
    }
};

function Vector_iterator(_this) {
    var index = 0,
        size = _this._size;

    return new Iterator(function next() {
        if (index >= size) {
            return Iterator.createDone();
        } else {
            return new IteratorValue(Vector_get(_this, index++), false);
        }
    });
}

function Vector_iteratorReverse(_this) {
    var index = _this._size - 1;

    return new Iterator(function next() {
        if (index < 0) {
            return Iterator.createDone();
        } else {
            return new IteratorValue(Vector_get(_this, index--), false);
        }
    });
}

VectorPrototype.iterator = function(reverse) {
    if (reverse !== true) {
        return Vector_iterator(this);
    } else {
        return Vector_iteratorReverse(this);
    }
};

if (ITERATOR_SYMBOL) {
    VectorPrototype[ITERATOR_SYMBOL] = VectorPrototype.iterator;
}

function Vector_every(_this, it, callback) {
    var next = it.next(),
        index = 0;

    while (next.done === false) {
        if (!callback(next.value, index, _this)) {
            return false;
        }
        next = it.next();
        index += 1;
    }

    return true;
}

VectorPrototype.every = function(callback, thisArg) {
    return Vector_every(this, Vector_iterator(this), isUndefined(thisArg) ? callback : fastBindThis(callback, thisArg, 3));
};

function Vector_filter(_this, it, callback) {
    var results = [],
        next = it.next(),
        index = 0,
        j = 0,
        value;

    while (next.done === false) {
        value = next.value;

        if (callback(value, index, _this)) {
            results[j++] = value;
        }

        next = it.next();
        index += 1;
    }

    return Vector.of(results);
}

VectorPrototype.filter = function(callback, thisArg) {
    return Vector_filter(this, Vector_iterator(this), isUndefined(thisArg) ? callback : fastBindThis(callback, thisArg, 3));
};

function Vector_forEach(_this, it, callback) {
    var next = it.next(),
        index = 0;

    while (next.done === false) {
        if (callback(next.value, index, _this) === false) {
            break;
        }
        next = it.next();
        index += 1;
    }

    return _this;
}

VectorPrototype.forEach = function(callback, thisArg) {
    return Vector_forEach(this, Vector_iterator(this), isUndefined(thisArg) ? callback : fastBindThis(callback, thisArg, 3));
};

VectorPrototype.each = VectorPrototype.forEach;

function Vector_forEachRight(_this, it, callback) {
    var next = it.next(),
        index = _this._size;

    while (next.done === false) {
        index -= 1;
        if (callback(next.value, index, _this) === false) {
            break;
        }
        next = it.next();
    }

    return _this;
}

VectorPrototype.forEachRight = function(callback, thisArg) {
    return Vector_forEachRight(this, Vector_iteratorReverse(this), isUndefined(thisArg) ? callback : fastBindThis(callback, thisArg, 3));
};

VectorPrototype.eachRight = VectorPrototype.forEachRight;

function Vector_map(_this, it, callback) {
    var next = it.next(),
        results = new Array(_this._size),
        index = 0;

    while (next.done === false) {
        results[index] = callback(next.value, index, _this);
        next = it.next();
        index += 1;
    }

    return Vector.of(results);
}

VectorPrototype.map = function(callback, thisArg) {
    return Vector_map(this, Vector_iterator(this), isUndefined(thisArg) ? callback : fastBindThis(callback, thisArg, 3));
};

function Vector_reduce(_this, it, callback, initialValue) {
    var next = it.next(),
        value = initialValue,
        index = 0;

    if (isUndefined(value)) {
        value = next.value;
        next = it.next();
        index = 1;
    }

    while (next.done === false) {
        value = callback(value, next.value, index, _this);
        next = it.next();
        index += 1;
    }

    return value;
}

VectorPrototype.reduce = function(callback, initialValue, thisArg) {
    return Vector_reduce(this, Vector_iterator(this), isUndefined(thisArg) ? callback : fastBindThis(callback, thisArg, 4), initialValue);
};

function Vector_reduceRight(_this, it, callback, initialValue) {
    var next = it.next(),
        value = initialValue,
        index = _this._size;

    if (isUndefined(value)) {
        value = next.value;
        next = it.next();
        index -= 1;
    }

    while (next.done === false) {
        index -= 1;
        value = callback(value, next.value, index, _this);
        next = it.next();
    }

    return value;
}

VectorPrototype.reduceRight = function(callback, initialValue, thisArg) {
    return Vector_reduceRight(this, Vector_iteratorReverse(this), isUndefined(thisArg) ? callback : fastBindThis(callback, thisArg, 4), initialValue);
};

function Vector_some(_this, it, callback) {
    var next = it.next(),
        index = 0;

    while (next.done === false) {
        if (callback(next.value, index, _this)) {
            return true;
        }
        next = it.next();
        index += 1;
    }

    return false;
}

VectorPrototype.some = function(callback, thisArg) {
    return Vector_some(this, Vector_iterator(this), isUndefined(thisArg) ? callback : fastBindThis(callback, thisArg, 3));
};

VectorPrototype.toArray = function() {
    var size = this._size,
        array = new Array(size),
        i = -1,
        il = size - 1;

    while (i++ < il) {
        array[i] = Vector_get(this, i);
    }

    return array;
};

VectorPrototype.join = function(separator) {
    var size = this._size,
        result = "",
        i = -1,
        il = size - 1;

    separator = separator || " ";

    while (i++ < il) {
        if (i !== il) {
            result += Vector_get(this, i) + separator;
        } else {
            result += Vector_get(this, i);
        }
    }

    return result;
};

VectorPrototype.toString = function() {
    return "[" + this.join() + "]";
};

VectorPrototype.inspect = VectorPrototype.toString;

VectorPrototype.toJSON = VectorPrototype.toArray;
Vector.fromJSON = Vector.fromArray;

Vector.equal = function(a, b) {
    var i;

    if (a === b) {
        return true;
    } else if (!a || !b || a._size !== b._size) {
        return false;
    } else {
        i = a._size;

        while (i--) {
            if (!isEqual(Vector_get(a, i), Vector_get(b, i))) {
                return false;
            }
        }

        return true;
    }
};

VectorPrototype.equals = function(b) {
    return Vector.equal(this, b);
};

function createArray() {
    return new Array(SIZE);
}

function copyArray(a, b, length) {
    var i = -1,
        il = length - 1;

    while (i++ < il) {
        b[i] = a[i];
    }

    return b;
}

function cloneArray(a, length) {
    return copyArray(a, createArray(), length);
}
},
function(require, exports, module, undefined, global) {
/*@=-@nathanfaucett/immutable-hash_map@0.0.4/src/index.js-=@*/
var has = require(26),
    freeze = require(16),
    isNull = require(8),
    isUndefined = require(9),
    isObject = require(20),
    defineProperty = require(15),
    isEqual = require(17),
    hashCode = require(32),
    isArrayLike = require(10),
    fastBindThis = require(13),
    Box = require(33),
    Iterator = require(34),
    BitmapIndexedNode = require(35);


var INTERNAL_CREATE = {},

    ITERATOR_SYMBOL = typeof(Symbol) === "function" ? Symbol.iterator : false,
    IS_MAP = "__ImmutableHashMap__",

    NOT_SET = {},
    EMPTY_MAP = freeze(new HashMap(INTERNAL_CREATE)),

    IteratorValue = Iterator.Value,

    HashMapPrototype;


module.exports = HashMap;


function HashMap(value) {
    if (!(this instanceof HashMap)) {
        throw new Error("HashMap() must be called with new");
    }

    this._size = 0;
    this._root = null;

    if (value !== INTERNAL_CREATE) {
        return HashMap_createHashMap(this, value, arguments);
    } else {
        return this;
    }
}
HashMapPrototype = HashMap.prototype;

HashMap.EMPTY = EMPTY_MAP;

function HashMap_createHashMap(_this, value, args) {
    var length = args.length;

    if (length === 1) {
        if (isArrayLike(value)) {
            return HashMap_fromArray(_this, value.toArray ? value.toArray() : value);
        } else if (isObject(value)) {
            return HashMap_fromObject(_this, value);
        } else {
            return EMPTY_MAP;
        }
    } else if (length > 1) {
        return HashMap_fromArray(_this, args);
    } else {
        return EMPTY_MAP;
    }
}

function HashMap_fromObject(_this, object) {
    var size = 0,
        root = BitmapIndexedNode.EMPTY,
        key, value, newRoot, addedLeaf;

    for (key in object) {
        if (has(object, key)) {
            value = object[key];

            addedLeaf = new Box(null);
            newRoot = root.set(0, hashCode(key), key, value, addedLeaf);

            if (newRoot !== root) {
                root = newRoot;
                if (!isNull(addedLeaf.value)) {
                    size += 1;
                }
            }
        }
    }

    if (size !== 0) {
        _this._size = size;
        _this._root = newRoot;
        return freeze(_this);
    } else {
        return EMPTY_MAP;
    }
}

function HashMap_fromArray(_this, array) {
    var i = 0,
        il = array.length,
        root = BitmapIndexedNode.EMPTY,
        size = 0,
        newRoot, key, value, addedLeaf;

    while (i < il) {
        key = array[i];
        value = array[i + 1];
        addedLeaf = new Box(null);

        newRoot = root.set(0, hashCode(key), key, value, addedLeaf);
        if (newRoot !== root) {
            root = newRoot;
            if (!isNull(addedLeaf.value)) {
                size += 1;
            }
        }

        i += 2;
    }

    if (size !== 0) {
        _this._root = root;
        _this._size = size;
        return freeze(_this);
    } else {
        return EMPTY_MAP;
    }
}

HashMap.fromArray = function(array) {
    if (array.length > 0) {
        return HashMap_createHashMap(new HashMap(INTERNAL_CREATE), array[0], array);
    } else {
        return EMPTY_MAP;
    }
};

HashMap.fromObject = function(object) {
    return HashMap_fromObject(new HashMap(INTERNAL_CREATE), object);
};

HashMap.of = function() {
    return HashMap.fromArray(arguments);
};

HashMap.isHashMap = function(value) {
    return !!(value && value[IS_MAP]);
};

defineProperty(HashMapPrototype, IS_MAP, {
    configurable: false,
    enumerable: false,
    writable: false,
    value: true
});

HashMapPrototype.size = function() {
    return this._size;
};

if (defineProperty.hasGettersSetters) {
    defineProperty(HashMapPrototype, "length", {
        get: HashMapPrototype.size
    });
}

HashMapPrototype.count = HashMapPrototype.size;

HashMapPrototype.isEmpty = function() {
    return this._size === 0;
};

HashMapPrototype.has = function(key) {
    var root = this._root;
    return isNull(root) ? false : root.get(0, hashCode(key), key, NOT_SET) !== NOT_SET;
};

HashMapPrototype.get = function(key, notSetValue) {
    var root = this._root;
    return isNull(root) ? notSetValue : root.get(0, hashCode(key), key);
};

HashMapPrototype.set = function(key, value) {
    var root = this._root,
        size = this._size,
        addedLeaf = new Box(null),
        newRoot = (isNull(root) ? BitmapIndexedNode.EMPTY : root).set(0, hashCode(key), key, value, addedLeaf),
        map;

    if (newRoot === root) {
        return this;
    } else {
        map = new HashMap(INTERNAL_CREATE);
        map._size = isNull(addedLeaf.value) ? size : size + 1;
        map._root = newRoot;
        return freeze(map);
    }
};

HashMapPrototype.remove = function(key) {
    var root = this._root,
        size = this._size,
        newRoot;

    if (isNull(root)) {
        return this;
    } else if (size === 1) {
        return EMPTY_MAP;
    } else {
        newRoot = root.remove(0, hashCode(key), key);

        if (newRoot === root) {
            return this;
        } else {
            map = new HashMap(INTERNAL_CREATE);
            map._size = size - 1;
            map._root = newRoot;
            return freeze(map);
        }
    }
};

function hasNext() {
    return false;
}

function next() {
    return new IteratorValue(undefined, true);
}

HashMapPrototype.iterator = function(reverse) {
    var root = this._root;

    if (isNull(root)) {
        return new Iterator(hasNext, next);
    } else {
        return root.iterator(reverse);
    }
};

if (ITERATOR_SYMBOL) {
    HashMapPrototype[ITERATOR_SYMBOL] = HashMapPrototype.iterator;
}

function HashMap_every(_this, it, callback) {
    var next = it.next(),
        nextValue;

    while (next.done === false) {
        nextValue = next.value;
        if (!callback(nextValue[1], nextValue[0], _this)) {
            return false;
        }
        next = it.next();
    }

    return true;
}

HashMapPrototype.every = function(callback, thisArg) {
    return HashMap_every(this, this.iterator(), isUndefined(thisArg) ? callback : fastBindThis(callback, thisArg, 3));
};

function HashMap_filter(_this, it, callback) {
    var results = [],
        next = it.next(),
        index = 0,
        nextValue, key, value;

    while (next.done === false) {
        nextValue = next.value;
        key = nextValue[0];
        value = nextValue[1];

        if (callback(value, key, _this)) {
            results[index++] = key;
            results[index++] = value;
        }

        next = it.next();
    }

    return HashMap.of(results);
}

HashMapPrototype.filter = function(callback, thisArg) {
    return HashMap_filter(this, this.iterator(), isUndefined(thisArg) ? callback : fastBindThis(callback, thisArg, 3));
};

function HashMap_forEach(_this, it, callback) {
    var next = it.next(),
        nextValue;

    while (next.done === false) {
        nextValue = next.value;
        if (callback(nextValue[1], nextValue[0], _this) === false) {
            break;
        }
        next = it.next();
    }

    return _this;
}

HashMapPrototype.forEach = function(callback, thisArg) {
    return HashMap_forEach(this, this.iterator(), isUndefined(thisArg) ? callback : fastBindThis(callback, thisArg, 3));
};

HashMapPrototype.each = HashMapPrototype.forEach;

function HashMap_forEachRight(_this, it, callback) {
    var next = it.next(),
        nextValue;

    while (next.done === false) {
        nextValue = next.value;
        if (callback(nextValue[1], nextValue[0], _this) === false) {
            break;
        }
        next = it.next();
    }

    return _this;
}

HashMapPrototype.forEachRight = function(callback, thisArg) {
    return HashMap_forEachRight(this, this.iterator(true), isUndefined(thisArg) ? callback : fastBindThis(callback, thisArg, 3));
};

HashMapPrototype.eachRight = HashMapPrototype.forEachRight;

function HashMap_map(_this, it, callback) {
    var next = it.next(),
        results = new Array(_this._size * 2),
        index = 0,
        nextValue, key;

    while (next.done === false) {
        nextValue = next.value;
        key = nextValue[0];
        results[index++] = key;
        results[index++] = callback(nextValue[1], key, _this);
        next = it.next();
    }

    return HashMap.of(results);
}

HashMapPrototype.map = function(callback, thisArg) {
    return HashMap_map(this, this.iterator(), isUndefined(thisArg) ? callback : fastBindThis(callback, thisArg, 3));
};

function HashMap_reduce(_this, it, callback, initialValue) {
    var next = it.next(),
        value = initialValue,
        nextValue, key;

    if (isUndefined(value)) {
        nextValue = next.value;
        key = nextValue[0];
        value = nextValue[1];
        next = it.next();
    }

    while (next.done === false) {
        nextValue = next.value;
        value = callback(value, nextValue[1], key, _this);
        next = it.next();
    }

    return value;
}

HashMapPrototype.reduce = function(callback, initialValue, thisArg) {
    return HashMap_reduce(this, this.iterator(), isUndefined(thisArg) ? callback : fastBindThis(callback, thisArg, 4), initialValue);
};

function HashMap_reduceRight(_this, it, callback, initialValue) {
    var next = it.next(),
        value = initialValue,
        nextValue, key;

    if (isUndefined(value)) {
        nextValue = next.value;
        key = nextValue[0];
        value = nextValue[1];
        next = it.next();
    }

    while (next.done === false) {
        nextValue = next.value;
        value = callback(value, nextValue[1], key, _this);
        next = it.next();
    }

    return value;
}

HashMapPrototype.reduceRight = function(callback, initialValue, thisArg) {
    return HashMap_reduceRight(this, this.iterator(true), isUndefined(thisArg) ? callback : fastBindThis(callback, thisArg, 4), initialValue);
};

function HashMap_some(_this, it, callback) {
    var next = it.next(),
        nextValue;

    while (next.done === false) {
        nextValue = next.value;

        if (callback(nextValue[1], nextValue[0], _this)) {
            return true;
        }
        next = it.next();
    }

    return false;
}

HashMapPrototype.some = function(callback, thisArg) {
    return HashMap_some(this, this.iterator(), isUndefined(thisArg) ? callback : fastBindThis(callback, thisArg, 3));
};

HashMapPrototype.toArray = function() {
    var it = this.iterator(),
        next = it.next(),
        results = new Array(this._size * 2),
        index = 0;

    while (next.done === false) {
        nextValue = next.value;
        results[index++] = nextValue[0];
        results[index++] = nextValue[1];
        next = it.next();
    }

    return results;
};

HashMapPrototype.toObject = function() {
    var it = this.iterator(),
        results = {},
        step;

    while ((step = it.next()).done === false) {
        nextValue = step.value;
        results[nextValue[0]] = nextValue[1];
    }

    return results;
};

HashMap.fromJSON = HashMap.fromObject;
HashMapPrototype.toJSON = HashMapPrototype.toObject;

HashMapPrototype.join = function(separator, keyValueSeparator) {
    var it = this.iterator(),
        next = it.next(),
        result = "";

    separator = separator || ", ";
    keyValueSeparator = keyValueSeparator || ": ";

    while (!next.done) {
        nextValue = next.value;
        next = it.next();

        if (next.done) {
            result += nextValue[0] + keyValueSeparator + nextValue[1];
            break;
        } else {
            result += nextValue[0] + keyValueSeparator + nextValue[1] + separator;
        }
    }

    return result;
};

HashMapPrototype.toString = function() {
    return "{" + this.join() + "}";
};

HashMapPrototype.inspect = HashMapPrototype.toString;

function HashMap_equal(ait, bit) {
    var anext = ait.next(),
        bnext = bit.next(),
        anextValue, bnextValue;

    while (anext.done === false) {
        anextValue = anext.value;
        bnextValue = bnext.value;

        if (!isEqual(anextValue[0], bnextValue[0]) || !isEqual(anextValue[1], bnextValue[1])) {
            return false;
        }

        anext = ait.next();
        bnext = bit.next();
    }

    return true;
}

HashMap.equal = function(a, b) {
    if (a === b) {
        return true;
    } else if (!a || !b || a._size !== b._size) {
        return false;
    } else {
        return HashMap_equal(a.iterator(), b.iterator());
    }
};

HashMapPrototype.equals = function(b) {
    return HashMap.equal(this, b);
};
},
function(require, exports, module, undefined, global) {
/*@=-@nathanfaucett/immutable-set@0.0.3/src/index.js-=@*/
var freeze = require(16),
    Iterator = require(12),
    ImmutableHashMap = require(61),
    isUndefined = require(9),
    isArrayLike = require(10),
    defineProperty = require(15);


var INTERNAL_CREATE = {},

    ITERATOR_SYMBOL = typeof(Symbol) === "function" ? Symbol.iterator : false,
    IS_SET = "_ImmutableSet_",

    EMPTY_SET = freeze(new Set(INTERNAL_CREATE)),

    IteratorValue = Iterator.Value,

    SetPrototype = Set.prototype;


module.exports = Set;


function Set(value) {
    if (!(this instanceof Set)) {
        throw new Error("Set() must be called with new");
    }

    this._hashMap = ImmutableHashMap.EMPTY;

    if (value !== INTERNAL_CREATE) {
        return Set_createSet(this, value, arguments);
    } else {
        return this;
    }
}

Set.EMPTY = EMPTY_SET;

function Set_createSet(_this, value, values) {
    var length = values.length;

    if (length === 1) {
        if (isArrayLike(value)) {
            return Set_fromArray(_this, value.toArray ? value.toArray() : value);
        } else {
            return EMPTY_SET.set(value);
        }
    } else if (length > 1) {
        return Set_fromArray(_this, values);
    } else {
        return EMPTY_SET;
    }
}

function Set_fromArray(_this, array) {
    var i = -1,
        il = array.length - 1,
        hashMap = _this._hashMap,
        value;

    while (i++ < il) {
        value = array[i];
        hashMap = hashMap.set(value, true);
    }

    if (hashMap.size() !== 0) {
        _this._hashMap = hashMap;
        return freeze(_this);
    } else {
        return EMPTY_SET;
    }
}

Set.fromArray = function(array) {
    if (array.length > 0) {
        return Set_createSet(new Set(INTERNAL_CREATE), array[0], array);
    } else {
        return EMPTY_SET;
    }
};

Set.of = function() {
    return Set_createSet(new Set(INTERNAL_CREATE), arguments[0], arguments);
};

Set.isSet = function(value) {
    return !!(value && value[IS_SET]);
};

defineProperty(SetPrototype, IS_SET, {
    configurable: false,
    enumerable: false,
    writable: false,
    value: true
});

SetPrototype.size = function() {
    return this._hashMap.size();
};

if (defineProperty.hasGettersSetters) {
    defineProperty(SetPrototype, "length", {
        get: SetPrototype.size
    });
}

SetPrototype.count = SetPrototype.size;

SetPrototype.isEmpty = function() {
    return this._hashMap.isEmpty();
};

SetPrototype.has = function(value) {
    return this._hashMap.has(value);
};

SetPrototype.get = function(value, notSetValue) {
    if (this._hashMap.has(value)) {
        return value;
    } else {
        return notSetValue;
    }
};

function Set_set(_this, values) {
    var hashMap = _this._hashMap,
        i = -1,
        il = values.length - 1,
        added = 0,
        newImmutableHashMap, set, value;

    while (i++ < il) {
        value = values[i];

        if (!hashMap.has(value)) {
            newImmutableHashMap = hashMap.set(value, true);

            if (newImmutableHashMap !== hashMap) {
                hashMap = newImmutableHashMap;
                added += 1;
            }
        }
    }

    if (added !== 0) {
        set = new Set(INTERNAL_CREATE);
        set._hashMap = hashMap;
        return freeze(set);
    } else {
        return _this;
    }
}

SetPrototype.set = function() {
    if (arguments.length > 0) {
        return Set_set(this, arguments);
    } else {
        return this;
    }
};

SetPrototype.conj = SetPrototype.cons = SetPrototype.add = SetPrototype.set;

function Set_remove(_this, values) {
    var hashMap = _this._hashMap,
        i = -1,
        il = values.length - 1,
        removed = 0,
        newImmutableHashMap, set, value;

    while (i++ < il) {
        value = values[i];

        if (hashMap.has(value)) {
            newImmutableHashMap = hashMap.remove(value);

            if (newImmutableHashMap !== hashMap) {
                hashMap = newImmutableHashMap;
                removed += 1;
            }
        }
    }

    if (removed !== 0) {
        set = new Set(INTERNAL_CREATE);
        set._hashMap = hashMap;
        return freeze(set);
    } else {
        return _this;
    }
}

SetPrototype.remove = function() {
    if (arguments.length > 0) {
        return Set_remove(this, arguments);
    } else {
        return this;
    }
};

function Set_toArray(size, iterator) {
    var results = new Array(size),
        next = iterator.next(),
        index = 0;

    while (!next.done) {
        results[index] = next.value;
        next = iterator.next();
        index += 1;
    }

    return results;
}

SetPrototype.toArray = function() {
    var size = this.size();

    if (size === 0) {
        return [];
    } else {
        return Set_toArray(size, this.iterator());
    }
};

function Set_join(size, iterator, separator) {
    var result = "",
        next = iterator.next(),
        value;

    while (true) {
        value = next.value;
        next = iterator.next();

        if (next.done) {
            result += value;
            break;
        } else {
            result += value + separator;
        }
    }

    return result;
}

SetPrototype.join = function(separator) {
    separator = separator || " ";

    if (this.size() === 0) {
        return "";
    } else {
        return Set_join(this.size(), this.iterator(), separator);
    }
};

SetPrototype.toString = function() {
    return "#{" + this.join() + "}";
};

SetPrototype.toJSON = SetPrototype.toArray;
Set.fromJSON = Set.fromArray;

SetPrototype.inspect = SetPrototype.toString;

SetPrototype.iterator = function(reverse) {
    var hashMapIterator = this._hashMap.iterator(reverse);

    return new Iterator(function next() {
        var iteratorValue = hashMapIterator.next();

        if (iteratorValue.done) {
            return iteratorValue;
        } else {
            return new IteratorValue(iteratorValue.value[0], iteratorValue.done);
        }
    });
};

if (ITERATOR_SYMBOL) {
    SetPrototype[ITERATOR_SYMBOL] = SetPrototype.iterator;
}

function Set_every(_this, it, callback) {
    var next = it.next();

    while (next.done === false) {
        if (!callback(next.value, _this)) {
            return false;
        }
        next = it.next();
    }

    return true;
}

SetPrototype.every = function(callback, thisArg) {
    return Set_every(this, this.iterator(), isUndefined(thisArg) ? callback : fastBindThis(callback, thisArg, 3));
};

function Set_filter(_this, it, callback) {
    var results = [],
        next = it.next(),
        j = 0,
        value;

    while (next.done === false) {
        value = next.value;

        if (callback(value, _this)) {
            results[j++] = value;
        }

        next = it.next();
    }

    return Set.of(results);
}

SetPrototype.filter = function(callback, thisArg) {
    return Set_filter(this, this.iterator(), isUndefined(thisArg) ? callback : fastBindThis(callback, thisArg, 3));
};

function Set_forEach(_this, it, callback) {
    var next = it.next();

    while (next.done === false) {
        if (callback(next.value, _this) === false) {
            break;
        }
        next = it.next();
    }

    return _this;
}

SetPrototype.forEach = function(callback, thisArg) {
    return Set_forEach(this, this.iterator(), isUndefined(thisArg) ? callback : fastBindThis(callback, thisArg, 3));
};

SetPrototype.each = SetPrototype.forEach;

function Set_forEachRight(_this, it, callback) {
    var next = it.next();

    while (next.done === false) {
        if (callback(next.value, _this) === false) {
            break;
        }
        next = it.next();
    }

    return _this;
}

SetPrototype.forEachRight = function(callback, thisArg) {
    return Set_forEachRight(this, this.iterator(true), isUndefined(thisArg) ? callback : fastBindThis(callback, thisArg, 3));
};

SetPrototype.eachRight = SetPrototype.forEachRight;

function Set_map(_this, it, callback) {
    var next = it.next(),
        results = new Array(_this.size()),
        index = 0;

    while (next.done === false) {
        results[index] = callback(next.value, _this);
        next = it.next();
        index += 1;
    }

    return Set.of(results);
}

SetPrototype.map = function(callback, thisArg) {
    return Set_map(this, this.iterator(), isUndefined(thisArg) ? callback : fastBindThis(callback, thisArg, 3));
};

function Set_reduce(_this, it, callback, initialValue) {
    var next = it.next(),
        value = initialValue;

    if (isUndefined(value)) {
        value = next.value;
        next = it.next();
    }

    while (next.done === false) {
        value = callback(value, next.value, _this);
        next = it.next();
    }

    return value;
}

SetPrototype.reduce = function(callback, initialValue, thisArg) {
    return Set_reduce(this, this.iterator(), isUndefined(thisArg) ? callback : fastBindThis(callback, thisArg, 4), initialValue);
};

function Set_reduceRight(_this, it, callback, initialValue) {
    var next = it.next(),
        value = initialValue;

    if (isUndefined(value)) {
        value = next.value;
        next = it.next();
    }

    while (next.done === false) {
        value = callback(value, next.value, _this);
        next = it.next();
    }

    return value;
}

SetPrototype.reduceRight = function(callback, initialValue, thisArg) {
    return Set_reduceRight(this, this.iterator(true), isUndefined(thisArg) ? callback : fastBindThis(callback, thisArg, 4), initialValue);
};

function Set_some(_this, it, callback) {
    var next = it.next();

    while (next.done === false) {
        if (callback(next.value, _this)) {
            return true;
        }
        next = it.next();
    }

    return false;
}

SetPrototype.some = function(callback, thisArg) {
    return Set_some(this, this.iterator(), isUndefined(thisArg) ? callback : fastBindThis(callback, thisArg, 3));
};

Set.equal = function(a, b) {
    return ImmutableHashMap.equal(a._hashMap, b._hashMap);
};

SetPrototype.equals = function(other) {
    return Set.equal(this, other);
};
},
function(require, exports, module, undefined, global) {
/*@=-@nathanfaucett/immutable-record@0.0.3/src/index.js-=@*/
var ImmutableHashMap = require(74),
    defineProperty = require(15),
    inherits = require(42),
    keys = require(49),
    has = require(26),
    freeze = require(16);


var INTERNAL_CREATE = {},

    ITERATOR_SYMBOL = typeof(Symbol) === "function" ? Symbol.iterator : false,

    RECORD_ID = 0,
    IS_RECORD = "__ImmutableRecord__",

    RecordPrototype;


module.exports = Record;


function Record(defaultProps, name) {
    var id = RECORD_ID++,

        defaultName = name || ("RecordType" + id),
        defaultKeys = freeze(keys(defaultProps)),

        LOCAL_INTERNAL_CREATE = INTERNAL_CREATE,
        EMPTY_MAP = ImmutableHashMap.of(defaultProps),

        IS_RECORD_TYPE = "__ImmutableRecord-" + defaultName + "__",

        RecordTypePrototype;


    function RecordType(value) {
        if (!(this instanceof RecordType)) {
            throw new Error(defaultName + "() must be called with new");
        }

        if (value === LOCAL_INTERNAL_CREATE) {
            return this;
        } else {
            if (value) {
                this._map = ImmutableHashMap.of(Record_createProps(defaultProps, value, defaultKeys));
            } else {
                this._map = EMPTY_MAP;
            }
            return freeze(this);
        }
    }
    inherits(RecordType, Record);
    RecordTypePrototype = RecordType.prototype;

    freeze(defaultProps);

    RecordType.EMPTY = freeze(new RecordType());

    RecordType.name = RecordType._name = RecordTypePrototype.name = defaultName;
    RecordTypePrototype._keys = defaultKeys;
    RecordTypePrototype._defaultProps = defaultProps;

    RecordType.fromObject = function(object) {
        return new RecordType(object);
    };
    RecordType.fromJSON = RecordType.fromObject;

    function isRecordType(value) {
        return !!(value && value[IS_RECORD_TYPE]);
    }
    RecordType["is" + name] = isRecordType;

    defineProperty(RecordTypePrototype, IS_RECORD, {
        configurable: false,
        enumerable: false,
        writable: false,
        value: true
    });
    defineProperty(RecordTypePrototype, IS_RECORD_TYPE, {
        configurable: false,
        enumerable: false,
        writable: false,
        value: true
    });

    return RecordType;
}
RecordPrototype = Record.prototype;

function isRecord(value) {
    return !!(value && value[IS_RECORD]);
}

Record.isRecord = isRecord;

defineProperty(RecordPrototype, IS_RECORD, {
    configurable: false,
    enumerable: false,
    writable: false,
    value: true
});

RecordPrototype.has = function(key) {
    return has(this._defaultProps, key);
};

RecordPrototype.get = function(key, notSetValue) {
    return this._map.get(key, notSetValue);
};

RecordPrototype.set = function(key, value) {
    var map, newMap;

    if (!has(this._defaultProps, key)) {
        throw new Error("Cannot set unknown key \"" + key + "\" on " + this.name);
    } else {
        map = this._map;
        newMap = map.set(key, value);

        if (newMap !== map) {
            return Record_createRecord(this, newMap);
        } else {
            return this;
        }
    }
};

RecordPrototype.remove = function(key) {
    var map, newMap;

    if (!has(this._defaultProps, key)) {
        throw new Error("Cannot remove unknown key \"" + key + "\" from " + this.name);
    } else {
        map = this._map;
        newMap = map.remove(key);

        if (newMap !== map) {
            return Record_createRecord(this, newMap);
        } else {
            return this;
        }
    }
};

RecordPrototype.join = function(separator, keyValueSeparator) {
    return this._map.join(separator, keyValueSeparator);
};

RecordPrototype.toString = function() {
    return this.name + " {" + this.join() + "}";
};

Record.equal = function(a, b) {
    return ImmutableHashMap.equal(a._map, b._map);
};

RecordPrototype.equal = function(other) {
    return Record.equal(this, other);
};

function RecordIteratorValue(done, value) {
    this.done = done;
    this.value = value;
}

function RecordIterator(next) {
    this.next = next;
}

function Record_iterator(_this) {
    var map = _this._map;
    keys = _this._keys,
        index = 0,
        length = keys.length;

    return new RecordIterator(function next() {
        var key;

        if (index < length) {
            key = keys[index];
            index += 1;
            return new RecordIteratorValue(false, [key, map.get(key)]);
        } else {
            return new RecordIteratorValue(true, []);
        }
    });
}

function Record_iteratorReverse(_this) {
    var map = _this._map;
    keys = _this._keys,
        index = keys.length;

    return new RecordIterator(function next() {
        var key;

        if (index > 0) {
            index -= 1;
            key = keys[index];
            return new RecordIteratorValue(false, [key, map.get(key)]);
        } else {
            return new RecordIteratorValue(true, []);
        }
    });
}

RecordPrototype.iterator = function(reverse) {
    if (!reverse) {
        return Record_iterator(this);
    } else {
        return Record_iteratorReverse(this);
    }
};

if (ITERATOR_SYMBOL) {
    RecordPrototype[ITERATOR_SYMBOL] = RecordPrototype.iterator;
}

RecordPrototype.every = function(callback, thisArg) {
    return this._map.every(callback, thisArg);
};

RecordPrototype.filter = function(callback, thisArg) {
    return Record_createRecord(this, this._map.filter(callback, thisArg));
};

RecordPrototype.forEach = function(callback, thisArg) {
    this._map.forEach(callback, thisArg);
    return this;
};
RecordPrototype.each = RecordPrototype.forEach;

RecordPrototype.forEachRight = function(callback, thisArg) {
    this._map.forEachRight(callback, thisArg);
    return this;
};
RecordPrototype.eachRight = RecordPrototype.forEachRight;

RecordPrototype.map = function(callback, thisArg) {
    return Record_createRecord(this, this._map.map(callback, thisArg));
};
RecordPrototype.reduce = function(callback, initialValue, thisArg) {
    return this._map.reduce(callback, initialValue, thisArg);
};
RecordPrototype.reduceRight = function(callback, initialValue, thisArg) {
    return this._map.reduceRight(callback, initialValue, thisArg);
};
RecordPrototype.some = function(callback, thisArg) {
    return this._map.some(callback, thisArg);
};

RecordPrototype.toArray = function() {
    return this._map.toArray();
};
RecordPrototype.toObject = function() {
    return this._map.toObject();
};

RecordPrototype.toJSON = RecordPrototype.toObject;

function Record_createRecord(_this, map) {
    var record = new _this.constructor(INTERNAL_CREATE);
    record._map = map;
    return freeze(record);
}

function Record_createProps(defaultProps, props, keys) {
    var localHas = has,
        newProps = {},
        i = -1,
        il = keys.length - 1,
        key;

    while (i++ < il) {
        key = keys[i];
        newProps[key] = localHas(props, key) ? props[key] : defaultProps[key];
    }

    return newProps;
}
},
function(require, exports, module, undefined, global) {
/*@=-indexof@0.0.1/index.js-=@*/

var indexOf = [].indexOf;

module.exports = function(arr, obj){
  if (indexOf) return arr.indexOf(obj);
  for (var i = 0; i < arr.length; ++i) {
    if (arr[i] === obj) return i;
  }
  return -1;
};
},
function(require, exports, module, undefined, global) {
/*@=-@nathanfaucett/is_null@0.0.1/src/index.js-=@*/
module.exports = isNull;


function isNull(value) {
    return value === null;
}

},
function(require, exports, module, undefined, global) {
/*@=-@nathanfaucett/is_undefined@0.0.1/src/index.js-=@*/
module.exports = isUndefined;


function isUndefined(value) {
    return value === void(0);
}

},
function(require, exports, module, undefined, global) {
/*@=-@nathanfaucett/is_array_like@0.0.2/src/index.js-=@*/
var isLength = require(18),
    isFunction = require(19),
    isObject = require(20);


module.exports = isArrayLike;


function isArrayLike(value) {
    return !isFunction(value) && isObject(value) && isLength(value.length);
}

},
function(require, exports, module, undefined, global) {
/*@=-@nathanfaucett/is_number@0.0.1/src/index.js-=@*/
module.exports = isNumber;


function isNumber(value) {
    return typeof(value) === "number" || false;
}

},
function(require, exports, module, undefined, global) {
/*@=-@nathanfaucett/iterator@0.0.2/src/index.js-=@*/
var apply = require(21),
    isFunction = require(19),
    isUndefined = require(9);


var KEYS = 0,
    VALUES = 1,
    ENTRIES = 2,

    ITERATOR_SYMBOL = typeof(Symbol) === "function" ? Symbol.iterator : false,
    EMPTY = new Iterator(createDone),

    IteratorPrototype;


module.exports = Iterator;


function Iterator(next) {
    this.next = next;
}
IteratorPrototype = Iterator.prototype;

Iterator.EMPTY = EMPTY;

function IteratorValue(value, done) {
    this.value = value;
    this.done = done;
}
Iterator.Value = IteratorValue;

function createValue(type, key, value, result) {
    var iteratorValue = (
        type === KEYS ? key :
        type === VALUES ? value : [key, value]
    );

    if (isUndefined(result)) {
        result = new IteratorValue(iteratorValue, false);
    } else {
        result.value = iteratorValue;
    }

    return result;
}
Iterator.createValue = createValue;

function createDone() {
    return new IteratorValue(undefined, true);
}
Iterator.createDone = createDone;

function getIterator(iterable) {
    var iteratorFn = iterable && (ITERATOR_SYMBOL && iterable[ITERATOR_SYMBOL] || iterable.iterator);

    if (isFunction(iteratorFn)) {
        return iteratorFn;
    } else {
        return void(0);
    }
}
Iterator.getIterator = function(iterable) {
    var iteratorFn = getIterator(iterable);

    if (iteratorFn) {
        return function fn() {
            return apply(iteratorFn, arguments, iterable);
        };
    } else {
        return void(0);
    }
};

function hasIterator(iterable) {
    return !!getIterator(iterable);
}
Iterator.hasIterator = hasIterator;

function isIterator(iterator) {
    return !!(iterator && isFunction(iterator.next));
}
Iterator.isIterator = isIterator;

Iterator.KEYS = KEYS;
Iterator.VALUES = VALUES;
Iterator.ENTRIES = ENTRIES;

IteratorPrototype.toString = function() {
    return "[Iterator]";
};
IteratorPrototype.inspect = IteratorPrototype.toSource = IteratorPrototype.toString;

IteratorPrototype.iterator = function() {
    return this;
};
IteratorPrototype[ITERATOR_SYMBOL] = IteratorPrototype.iterator;

},
function(require, exports, module, undefined, global) {
/*@=-@nathanfaucett/fast_bind_this@0.0.1/src/index.js-=@*/
var isNumber = require(11);


module.exports = fastBindThis;


function fastBindThis(callback, thisArg, length) {
    switch (isNumber(length) ? length : (callback.length || -1)) {
        case 0:
            return function bound() {
                return callback.call(thisArg);
            };
        case 1:
            return function bound(a1) {
                return callback.call(thisArg, a1);
            };
        case 2:
            return function bound(a1, a2) {
                return callback.call(thisArg, a1, a2);
            };
        case 3:
            return function bound(a1, a2, a3) {
                return callback.call(thisArg, a1, a2, a3);
            };
        case 4:
            return function bound(a1, a2, a3, a4) {
                return callback.call(thisArg, a1, a2, a3, a4);
            };
        default:
            return function bound() {
                return callback.apply(thisArg, arguments);
            };
    }
}

},
function(require, exports, module, undefined, global) {
/*@=-@nathanfaucett/fast_slice@0.0.1/src/index.js-=@*/
var clamp = require(23),
    isNumber = require(11);


module.exports = fastSlice;


function fastSlice(array, offset) {
    var length = array.length,
        newLength, i, il, result, j;

    offset = clamp(isNumber(offset) ? offset : 0, 0, length);
    i = offset - 1;
    il = length - 1;
    newLength = length - offset;
    result = new Array(newLength);
    j = 0;

    while (i++ < il) {
        result[j++] = array[i];
    }

    return result;
}

},
function(require, exports, module, undefined, global) {
/*@=-@nathanfaucett/define_property@0.0.3/src/index.js-=@*/
var isObject = require(20),
    isFunction = require(19),
    isPrimitive = require(24),
    isNative = require(25),
    has = require(26);


var nativeDefineProperty = Object.defineProperty;


module.exports = defineProperty;


function defineProperty(object, name, descriptor) {
    if (isPrimitive(descriptor) || isFunction(descriptor)) {
        descriptor = {
            value: descriptor
        };
    }
    return nativeDefineProperty(object, name, descriptor);
}

defineProperty.hasGettersSetters = true;

if (!isNative(nativeDefineProperty) || !(function() {
        var object = {},
            value = {};

        try {
            nativeDefineProperty(object, "key", {
                value: value
            });
            if (has(object, "key") && object.key === value) {
                return true;
            } else {
                return false;
            }
        } catch (e) {}

        return false;
    }())) {

    defineProperty.hasGettersSetters = false;

    nativeDefineProperty = function defineProperty(object, name, descriptor) {
        if (!isObject(object)) {
            throw new TypeError("defineProperty(object, name, descriptor) called on non-object");
        }
        if (has(descriptor, "get") || has(descriptor, "set")) {
            throw new TypeError("defineProperty(object, name, descriptor) this environment does not support getters or setters");
        }
        object[name] = descriptor.value;
    };
}

},
function(require, exports, module, undefined, global) {
/*@=-@nathanfaucett/freeze@0.0.1/src/index.js-=@*/
var isNative = require(25),
    emptyFunction = require(31);


var nativeFreeze = Object.freeze;


if (isNative(nativeFreeze) && (function isValidFreeze() {
        "use strict";
        var a = {
            key: "value"
        };

        try {
            nativeFreeze(a);
            a.key = "change";
            delete a.key;
        } catch (e) {
            return true;
        }
        return false;
    }())) {
    module.exports = nativeFreeze;
} else {
    module.exports = emptyFunction.thatReturnsArgument;
}

},
function(require, exports, module, undefined, global) {
/*@=-@nathanfaucett/is_equal@0.0.1/src/index.js-=@*/
module.exports = isEqual;


function isEqual(a, b) {
    return !(a !== b && !(a !== a && b !== b));
}

},
function(require, exports, module, undefined, global) {
/*@=-@nathanfaucett/is_length@0.0.1/src/index.js-=@*/
var isNumber = require(11);


var MAX_SAFE_INTEGER = Math.pow(2, 53) - 1;


module.exports = isLength;


function isLength(value) {
    return isNumber(value) && value > -1 && value % 1 === 0 && value <= MAX_SAFE_INTEGER;
}

},
function(require, exports, module, undefined, global) {
/*@=-@nathanfaucett/is_function@0.0.1/src/index.js-=@*/
var objectToString = Object.prototype.toString,
    isFunction;


if (objectToString.call(function() {}) === "[object Object]") {
    isFunction = function isFunction(value) {
        return value instanceof Function;
    };
} else if (typeof(/./) === "function" || (typeof(Uint8Array) !== "undefined" && typeof(Uint8Array) !== "function")) {
    isFunction = function isFunction(value) {
        return objectToString.call(value) === "[object Function]";
    };
} else {
    isFunction = function isFunction(value) {
        return typeof(value) === "function" || false;
    };
}


module.exports = isFunction;

},
function(require, exports, module, undefined, global) {
/*@=-@nathanfaucett/is_object@0.0.1/src/index.js-=@*/
var isNull = require(8);


module.exports = isObject;


function isObject(value) {
    var type = typeof(value);
    return type === "function" || (!isNull(value) && type === "object") || false;
}

},
function(require, exports, module, undefined, global) {
/*@=-@nathanfaucett/apply@0.0.1/src/index.js-=@*/
var isNullOrUndefined = require(22);


module.exports = apply;


function apply(fn, args, thisArg) {
    if (isNullOrUndefined(thisArg)) {
        return applyNoThisArg(fn, args);
    } else {
        return applyThisArg(fn, args, thisArg);
    }
}

function applyNoThisArg(fn, args) {
    switch (args.length) {
        case 0:
            return fn();
        case 1:
            return fn(args[0]);
        case 2:
            return fn(args[0], args[1]);
        case 3:
            return fn(args[0], args[1], args[2]);
        case 4:
            return fn(args[0], args[1], args[2], args[3]);
        case 5:
            return fn(args[0], args[1], args[2], args[3], args[4]);
        default:
            return fn.apply(null, args);
    }
}

function applyThisArg(fn, args, thisArg) {
    switch (args.length) {
        case 0:
            return fn.call(thisArg);
        case 1:
            return fn.call(thisArg, args[0]);
        case 2:
            return fn.call(thisArg, args[0], args[1]);
        case 3:
            return fn.call(thisArg, args[0], args[1], args[2]);
        case 4:
            return fn.call(thisArg, args[0], args[1], args[2], args[3]);
        case 5:
            return fn.call(thisArg, args[0], args[1], args[2], args[3], args[4]);
        default:
            return fn.apply(thisArg, args);
    }
}

},
function(require, exports, module, undefined, global) {
/*@=-@nathanfaucett/is_null_or_undefined@0.0.1/src/index.js-=@*/
var isNull = require(8),
    isUndefined = require(9);


module.exports = isNullOrUndefined;

/**
  isNullOrUndefined accepts any value and returns true
  if the value is null or undefined. For all other values
  false is returned.
  
  @param {Any}        any value to test
  @returns {Boolean}  the boolean result of testing value

  @example
    isNullOrUndefined(null);   // returns true
    isNullOrUndefined(undefined);   // returns true
    isNullOrUndefined("string");    // returns false
**/
function isNullOrUndefined(value) {
    return isNull(value) || isUndefined(value);
}

},
function(require, exports, module, undefined, global) {
/*@=-@nathanfaucett/clamp@0.0.1/src/index.js-=@*/
module.exports = clamp;


function clamp(x, min, max) {
    if (x < min) {
        return min;
    } else if (x > max) {
        return max;
    } else {
        return x;
    }
}

},
function(require, exports, module, undefined, global) {
/*@=-@nathanfaucett/is_primitive@0.0.2/src/index.js-=@*/
var isNullOrUndefined = require(22);


module.exports = isPrimitive;


function isPrimitive(obj) {
    var typeStr;
    return isNullOrUndefined(obj) || ((typeStr = typeof(obj)) !== "object" && typeStr !== "function") || false;
}

},
function(require, exports, module, undefined, global) {
/*@=-@nathanfaucett/is_native@0.0.2/src/index.js-=@*/
var isFunction = require(19),
    isNullOrUndefined = require(22),
    escapeRegExp = require(27);


var reHostCtor = /^\[object .+?Constructor\]$/,

    functionToString = Function.prototype.toString,

    reNative = RegExp("^" +
        escapeRegExp(Object.prototype.toString)
        .replace(/toString|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
    ),

    isHostObject;


module.exports = isNative;


function isNative(value) {
    return !isNullOrUndefined(value) && (
        isFunction(value) ?
        reNative.test(functionToString.call(value)) : (
            typeof(value) === "object" && (
                (isHostObject(value) ? reNative : reHostCtor).test(value) || false
            )
        )
    ) || false;
}

try {
    String({
        "toString": 0
    } + "");
} catch (e) {
    isHostObject = function isHostObject() {
        return false;
    };
}

isHostObject = function isHostObject(value) {
    return !isFunction(value.toString) && typeof(value + "") === "string";
};

},
function(require, exports, module, undefined, global) {
/*@=-@nathanfaucett/has@0.0.2/src/index.js-=@*/
var isNative = require(25),
    getPrototypeOf = require(30),
    isNullOrUndefined = require(22);


var nativeHasOwnProp = Object.prototype.hasOwnProperty,
    baseHas;


module.exports = has;


function has(object, key) {
    if (isNullOrUndefined(object)) {
        return false;
    } else {
        return baseHas(object, key);
    }
}

if (isNative(nativeHasOwnProp)) {
    baseHas = function baseHas(object, key) {
        if (object.hasOwnProperty) {
            return object.hasOwnProperty(key);
        } else {
            return nativeHasOwnProp.call(object, key);
        }
    };
} else {
    baseHas = function baseHas(object, key) {
        var proto = getPrototypeOf(object);

        if (isNullOrUndefined(proto)) {
            return key in object;
        } else {
            return (key in object) && (!(key in proto) || proto[key] !== object[key]);
        }
    };
}

},
function(require, exports, module, undefined, global) {
/*@=-@nathanfaucett/escape_regexp@0.0.1/src/index.js-=@*/
var toString = require(28);


var reRegExpChars = /[.*+?\^${}()|\[\]\/\\]/g,
    reHasRegExpChars = new RegExp(reRegExpChars.source);


module.exports = escapeRegExp;


function escapeRegExp(string) {
    string = toString(string);
    return (
        (string && reHasRegExpChars.test(string)) ?
        string.replace(reRegExpChars, "\\$&") :
        string
    );
}

},
function(require, exports, module, undefined, global) {
/*@=-@nathanfaucett/to_string@0.0.1/src/index.js-=@*/
var isString = require(29),
    isNullOrUndefined = require(22);


module.exports = toString;


function toString(value) {
    if (isString(value)) {
        return value;
    } else if (isNullOrUndefined(value)) {
        return "";
    } else {
        return value + "";
    }
}

},
function(require, exports, module, undefined, global) {
/*@=-@nathanfaucett/is_string@0.0.1/src/index.js-=@*/
module.exports = isString;


function isString(value) {
    return typeof(value) === "string" || false;
}

},
function(require, exports, module, undefined, global) {
/*@=-@nathanfaucett/get_prototype_of@0.0.1/src/index.js-=@*/
var isObject = require(20),
    isNative = require(25),
    isNullOrUndefined = require(22);


var nativeGetPrototypeOf = Object.getPrototypeOf,
    baseGetPrototypeOf;


module.exports = getPrototypeOf;


function getPrototypeOf(value) {
    if (isNullOrUndefined(value)) {
        return null;
    } else {
        return baseGetPrototypeOf(value);
    }
}

if (isNative(nativeGetPrototypeOf)) {
    baseGetPrototypeOf = function baseGetPrototypeOf(value) {
        return nativeGetPrototypeOf(isObject(value) ? value : Object(value)) || null;
    };
} else {
    if ("".__proto__ === String.prototype) {
        baseGetPrototypeOf = function baseGetPrototypeOf(value) {
            return value.__proto__ || null;
        };
    } else {
        baseGetPrototypeOf = function baseGetPrototypeOf(value) {
            return value.constructor ? value.constructor.prototype : null;
        };
    }
}

},
function(require, exports, module, undefined, global) {
/*@=-@nathanfaucett/empty_function@0.0.1/src/index.js-=@*/
module.exports = emptyFunction;


function emptyFunction() {}

function makeEmptyFunction(value) {
    return function() {
        return value;
    };
}

emptyFunction.thatReturns = makeEmptyFunction;
emptyFunction.thatReturnsFalse = makeEmptyFunction(false);
emptyFunction.thatReturnsTrue = makeEmptyFunction(true);
emptyFunction.thatReturnsNull = makeEmptyFunction(null);
emptyFunction.thatReturnsThis = function() {
    return this;
};
emptyFunction.thatReturnsArgument = function(argument) {
    return argument;
};

},
function(require, exports, module, undefined, global) {
/*@=-@nathanfaucett/hash_code@0.0.2/src/index.js-=@*/
var WeakMapPolyfill = require(36),
    isNumber = require(11),
    isString = require(29),
    isFunction = require(19),
    isBoolean = require(37),
    isNullOrUndefined = require(22),
    numberHashCode = require(38),
    booleanHashCode = require(39),
    stringHashCode = require(40);


var WEAK_MAP = new WeakMapPolyfill(),
    HASH_UID = 1;


module.exports = hashCode;


function hashCode(value) {
    if (isNullOrUndefined(value)) {
        return 0;
    } else {
        if (isFunction(value.valueOf)) {
            value = value.valueOf();
            if (isNullOrUndefined(value)) {
                return 0;
            }
        }

        if (isBoolean(value)) {
            return booleanHashCode(value);
        } else if (isNumber(value)) {
            return numberHashCode(value);
        } else if (isString(value)) {
            return stringHashCode(value);
        } else if (isFunction(value.hashCode)) {
            return value.hashCode();
        } else {
            return getObjectHashCode(value);
        }
    }
}

function getObjectHashCode(value) {
    var hashCode = getHashCode(value);

    if (hashCode !== undefined) {
        return hashCode;
    } else {
        return setHashCode(value);
    }
}

function getHashCode(value) {
    return WEAK_MAP.get(value);
}

function setHashCode(value) {
    var hashCode = HASH_UID++;

    if (HASH_UID & 0x40000000) {
        HASH_UID = 0;
    }

    WEAK_MAP.set(value, hashCode);

    return hashCode;
}

},
function(require, exports, module, undefined, global) {
/*@=-@nathanfaucett/immutable-hash_map@0.0.4/src/Box.js-=@*/
module.exports = Box;


function Box(value) {
    this.value = value;
}
},
function(require, exports, module, undefined, global) {
/*@=-@nathanfaucett/immutable-hash_map@0.0.4/src/Iterator.js-=@*/
var inherits = require(42),
    BaseIterator = require(12);


module.exports = Iterator;


function Iterator(hasNext, next) {
    this.hasNext = hasNext;
    this.next = next;
}
inherits(Iterator, BaseIterator);
},
function(require, exports, module, undefined, global) {
/*@=-@nathanfaucett/immutable-hash_map@0.0.4/src/BitmapIndexedNode.js-=@*/
var isNull = require(8),
    isEqual = require(17),
    hashCode = require(32),
    bitCount = require(50),
    consts = require(51),
    bitpos = require(52),
    arrayCopy = require(53),
    cloneAndSet = require(54),
    removePair = require(55),
    mask = require(56),
    nodeIterator = require(57),
    ArrayNode, createNode;


var baseArrayCopy = arrayCopy.base,
    SHIFT = consts.SHIFT,
    MAX_BITMAP_INDEXED_SIZE = consts.MAX_BITMAP_INDEXED_SIZE,
    EMPTY = new BitmapIndexedNode(0, []),
    BitmapIndexedNodePrototype = BitmapIndexedNode.prototype;


module.exports = BitmapIndexedNode;


ArrayNode = require(58);
createNode = require(59);


function BitmapIndexedNode(bitmap, array) {
    this.bitmap = bitmap;
    this.array = array;
}

BitmapIndexedNode.EMPTY = EMPTY;

BitmapIndexedNodePrototype.get = function(shift, keyHash, key, notSetValue) {
    var bitmap = this.bitmap,
        bit = bitpos(keyHash, shift),
        array, index, keyOrNull, valueOrNode;

    if ((bitmap & bit) === 0) {
        return notSetValue;
    } else {
        array = this.array;
        index = getIndex(bitmap, bit);

        keyOrNull = array[2 * index];
        valueOrNode = array[2 * index + 1];

        if (isNull(keyOrNull)) {
            return valueOrNode.get(shift + SHIFT, keyHash, key, notSetValue);
        } else {
            if (isEqual(key, keyOrNull)) {
                return valueOrNode;
            } else {
                return notSetValue;
            }
        }
    }
};

BitmapIndexedNodePrototype.set = function(shift, keyHash, key, value, addedLeaf) {
    var array = this.array,
        bitmap = this.bitmap,
        bit = bitpos(keyHash, shift),
        index = getIndex(bitmap, bit),
        keyOrNull, valueOrNode, newNode, nodes, jIndex, i, j, newArray;

    if ((bitmap & bit) !== 0) {
        keyOrNull = array[2 * index];
        valueOrNode = array[2 * index + 1];

        if (isNull(keyOrNull)) {
            newNode = valueOrNode.set(shift + SHIFT, keyHash, key, value, addedLeaf);

            if (newNode === valueOrNode) {
                return this;
            } else {
                return new BitmapIndexedNode(bitmap, cloneAndSet(array, 2 * index + 1, newNode));
            }
        }
        if (isEqual(key, keyOrNull)) {
            if (value === valueOrNode) {
                return this;
            } else {
                return new BitmapIndexedNode(bitmap, cloneAndSet(array, 2 * index + 1, value));
            }
        }
        addedLeaf.value = addedLeaf;
        return new BitmapIndexedNode(bitmap,
            cloneAndSet(array,
                2 * index, null,
                2 * index + 1, createNode(shift + SHIFT, keyOrNull, valueOrNode, keyHash, key, value)));
    } else {
        newNode = bitCount(bitmap);

        if (newNode >= MAX_BITMAP_INDEXED_SIZE) {
            nodes = new Array(32);
            jIndex = mask(keyHash, shift);
            nodes[jIndex] = EMPTY.set(shift + SHIFT, keyHash, key, value, addedLeaf);

            i = -1;
            j = 0;
            while (i++ < 31) {
                if (((bitmap >>> i) & 1) !== 0) {
                    if (array[j] == null) {
                        nodes[i] = array[j + 1];
                    } else {
                        nodes[i] = EMPTY.set(shift + SHIFT, hashCode(array[j]), array[j], array[j + 1], addedLeaf);
                    }
                    j += 2;
                }
            }

            return new ArrayNode(newNode + 1, nodes);
        } else {
            newArray = new Array(2 * (newNode + 1));
            baseArrayCopy(array, 0, newArray, 0, 2 * index);

            newArray[2 * index] = key;
            addedLeaf.value = addedLeaf;
            newArray[2 * index + 1] = value;

            baseArrayCopy(array, 2 * index, newArray, 2 * (index + 1), 2 * (newNode - index));

            return new BitmapIndexedNode(bitmap | bit, newArray);
        }
    }
};

BitmapIndexedNodePrototype.remove = function(shift, keyHash, key) {
    var bitmap = this.bitmap,
        bit = bitpos(keyHash, shift),
        index, array, newNode;

    if ((bitmap & bit) === 0) {
        return this;
    } else {
        index = getIndex(bitmap, bit);
        array = this.array;

        keyOrNull = array[2 * index];
        valueOrNode = array[2 * index + 1];

        if (isNull(keyOrNull)) {
            newNode = valueOrNode.remove(shift + SHIFT, keyHash, key);

            if (newNode === valueOrNode) {
                return this;
            } else if (!isNull(newNode)) {
                return new BitmapIndexedNode(bitmap, cloneAndSet(array, 2 * index + 1, newNode));
            } else if (bitmap === bit) {
                return null;
            } else {
                return new BitmapIndexedNode(bitmap ^ bit, removePair(array, index));
            }
        } else {
            if (isEqual(key, keyOrNull)) {
                return new BitmapIndexedNode(bitmap ^ bit, removePair(array, index));
            } else {
                return this;
            }
        }
    }
};

BitmapIndexedNodePrototype.iterator = nodeIterator;

function getIndex(bitmap, bit) {
    return bitCount(bitmap & (bit - 1));
}
},
function(require, exports, module, undefined, global) {
/*@=-@nathanfaucett/weak_map_polyfill@0.0.2/src/index.js-=@*/
var isNative = require(25),
    isPrimitive = require(24),
    createStore = require(41);


var NativeWeakMap = typeof(WeakMap) !== "undefined" ? WeakMap : null,
    WeakMapPolyfill, WeakMapPolyfillPrototype;


if (isNative(NativeWeakMap)) {
    WeakMapPolyfill = NativeWeakMap;
    WeakMapPolyfillPrototype = WeakMapPolyfill.prototype;
} else {
    WeakMapPolyfill = function WeakMap() {
        this.__store = createStore();
    };
    WeakMapPolyfillPrototype = WeakMapPolyfill.prototype;
    WeakMapPolyfillPrototype.constructor = WeakMapPolyfill;

    WeakMapPolyfillPrototype.get = function(key) {
        return this.__store.get(key);
    };

    WeakMapPolyfillPrototype.set = function(key, value) {
        if (isPrimitive(key)) {
            throw new TypeError("Invalid value used as key");
        } else {
            this.__store.set(key, value);
        }
    };

    WeakMapPolyfillPrototype.has = function(key) {
        return this.__store.has(key);
    };

    WeakMapPolyfillPrototype["delete"] = function(key) {
        return this.__store.remove(key);
    };

    WeakMapPolyfillPrototype.length = 0;
}

WeakMapPolyfillPrototype.remove = WeakMapPolyfillPrototype["delete"];


module.exports = WeakMapPolyfill;

},
function(require, exports, module, undefined, global) {
/*@=-@nathanfaucett/is_boolean@0.0.1/src/index.js-=@*/
module.exports = isBoolean;


function isBoolean(value) {
    return typeof(value) === "boolean" || false;
}

},
function(require, exports, module, undefined, global) {
/*@=-@nathanfaucett/number-hash_code@0.0.1/src/index.js-=@*/
module.exports = numberHashCode;


function numberHashCode(number) {
    var hash = number | 0;

    if (hash !== number) {
        hash ^= number * 0xFFFFFFFF;
    }

    while (number > 0xFFFFFFFF) {
        number /= 0xFFFFFFFF;
        hash ^= o;
    }

    return ((hash >>> 1) & 0x40000000) | (hash & 0xBFFFFFFF);
}

},
function(require, exports, module, undefined, global) {
/*@=-@nathanfaucett/boolean-hash_code@0.0.1/src/index.js-=@*/
module.exports = booleanHashCode;


function booleanHashCode(bool) {
    if (bool !== false) {
        return 1231;
    } else {
        return 1237;
    }
}

},
function(require, exports, module, undefined, global) {
/*@=-@nathanfaucett/string-hash_code@0.0.1/src/index.js-=@*/
var isUndefined = require(9);


var STRING_HASH_CACHE_MIN_STRING_LENGTH = 16,
    STRING_HASH_CACHE_MAX_SIZE = 255,
    STRING_HASH_CACHE_SIZE = 0,
    SRTING_HASH_CACHE = {};


module.exports = stringHashCode;


function stringHashCode(string) {
    if (string.length > STRING_HASH_CACHE_MIN_STRING_LENGTH) {
        return cachedHashString(string);
    } else {
        return hashString(string);
    }
}

function cachedHashString(string) {
    var hash = SRTING_HASH_CACHE[string];

    if (isUndefined(hash)) {
        hash = hashString(string);

        if (STRING_HASH_CACHE_SIZE === STRING_HASH_CACHE_MAX_SIZE) {
            STRING_HASH_CACHE_SIZE = 0;
            SRTING_HASH_CACHE = {};
        }

        STRING_HASH_CACHE_SIZE += 1;
        SRTING_HASH_CACHE[string] = hash;
    }

    return hash;
}

function hashString(string) {
    var hash = 0,
        i = -1,
        il = string.length - 1;

    while (i++ < il) {
        hash = 31 * hash + string.charCodeAt(i) | 0;
    }

    return ((hash >>> 1) & 0x40000000) | (hash & 0xBFFFFFFF);
}

},
function(require, exports, module, undefined, global) {
/*@=-@nathanfaucett/create_store@0.0.2/src/index.js-=@*/
var has = require(26),
    defineProperty = require(15),
    isPrimitive = require(24);


var emptyStore = {
        value: undefined
    },
    ObjectPrototype = Object.prototype;


module.exports = createStore;


function createStore() {
    var privateKey = {},
        size = 0;


    function get(key) {
        var store;

        if (isPrimitive(key)) {
            throw new TypeError("Invalid value used as key");
        } else {
            store = key.valueOf(privateKey);

            if (!store || store.identity !== privateKey) {
                store = emptyStore;
            }

            return store;
        }
    }

    function set(key) {
        var store;

        if (isPrimitive(key)) {
            throw new TypeError("Invalid value used as key");
        } else {
            store = key.valueOf(privateKey);

            if (!store || store.identity !== privateKey) {
                store = privateStore(key, privateKey);
                size += 1;
            }

            return store;
        }
    }

    return {
        get: function(key) {
            return get(key).value;
        },
        set: function(key, value) {
            set(key).value = value;
        },
        has: function(key) {
            var store = get(key);
            return store !== emptyStore ? has(store, "value") : false;
        },
        remove: function(key) {
            var store = get(key);

            if (store !== emptyStore) {
                size -= 1;
                return store.remove();
            } else {
                return false;
            }
        },
        clear: function() {
            privateKey = {};
            size = 0;
        },
        size: function() {
            return size;
        }
    };
}

function privateStore(key, privateKey) {
    var keyValueOf = key.valueOf || ObjectPrototype.valueOf,
        store = {
            identity: privateKey,
            remove: function remove() {
                if (key.valueOf === valueOf) {
                    key.valueOf = keyValueOf;
                }
                return delete store.value;
            }
        };

    function valueOf(value) {
        if (value !== privateKey) {
            return keyValueOf.apply(this, arguments);
        } else {
            return store;
        }
    }

    defineProperty(key, "valueOf", {
        value: valueOf,
        configurable: true,
        enumerable: false,
        writable: true
    });

    return store;
}

},
function(require, exports, module, undefined, global) {
/*@=-@nathanfaucett/inherits@0.0.3/src/index.js-=@*/
var create = require(43),
    extend = require(44),
    mixin = require(45),
    defineProperty = require(46);


var descriptor = {
    configurable: true,
    enumerable: false,
    writable: true,
    value: null
};


module.exports = inherits;


function inherits(child, parent) {

    mixin(child, parent);

    if (child.__super) {
        child.prototype = extend(create(parent.prototype), child.__super, child.prototype);
    } else {
        child.prototype = extend(create(parent.prototype), child.prototype);
    }

    defineNonEnumerableProperty(child, "__super", parent.prototype);
    defineNonEnumerableProperty(child.prototype, "constructor", child);

    child.defineStatic = defineStatic;
    child.super_ = parent;

    return child;
}
inherits.defineProperty = defineNonEnumerableProperty;

function defineNonEnumerableProperty(object, name, value) {
    descriptor.value = value;
    defineProperty(object, name, descriptor);
    descriptor.value = null;
}

function defineStatic(name, value) {
    defineNonEnumerableProperty(this, name, value);
}

},
function(require, exports, module, undefined, global) {
/*@=-@nathanfaucett/create@0.0.2/src/index.js-=@*/
var isNull = require(8),
    isNative = require(25),
    isPrimitive = require(24);


var nativeCreate = Object.create;


module.exports = create;


function create(object) {
    return nativeCreate(isPrimitive(object) ? null : object);
}

if (!isNative(nativeCreate)) {
    nativeCreate = function nativeCreate(object) {
        var newObject;

        function F() {
            this.constructor = F;
        }

        if (isNull(object)) {
            F.prototype = null;
            newObject = new F();
            newObject.constructor = newObject.__proto__ = null;
            delete newObject.__proto__;
            return newObject;
        } else {
            F.prototype = object;
            return new F();
        }
    };
}

},
function(require, exports, module, undefined, global) {
/*@=-@nathanfaucett/extend@0.0.2/src/index.js-=@*/
var keys = require(47),
    isNative = require(25);


var nativeAssign = Object.assign,
    extend, baseExtend;


if (isNative(nativeAssign)) {
    extend = nativeAssign;
} else {
    extend = function extend(out) {
        var i = 0,
            il = arguments.length - 1;

        while (i++ < il) {
            baseExtend(out, arguments[i]);
        }

        return out;
    };
    baseExtend = function baseExtend(a, b) {
        var objectKeys = keys(b),
            i = -1,
            il = objectKeys.length - 1,
            key;

        while (i++ < il) {
            key = objectKeys[i];
            a[key] = b[key];
        }
    };
}


module.exports = extend;

},
function(require, exports, module, undefined, global) {
/*@=-@nathanfaucett/mixin@0.0.2/src/index.js-=@*/
var keys = require(49),
    isNullOrUndefined = require(22);


module.exports = mixin;


function mixin(out) {
    var i = 0,
        il = arguments.length - 1;

    while (i++ < il) {
        baseMixin(out, arguments[i]);
    }

    return out;
}

function baseMixin(a, b) {
    var objectKeys = keys(b),
        i = -1,
        il = objectKeys.length - 1,
        key, value;

    while (i++ < il) {
        key = objectKeys[i];

        if (isNullOrUndefined(a[key]) && !isNullOrUndefined((value = b[key]))) {
            a[key] = value;
        }
    }
}

},
function(require, exports, module, undefined, global) {
/*@=-@nathanfaucett/define_property@0.0.2/src/index.js-=@*/
var isObject = require(20),
    isFunction = require(19),
    isPrimitive = require(24),
    isNative = require(25),
    has = require(48);


var nativeDefineProperty = Object.defineProperty;


module.exports = defineProperty;


function defineProperty(object, name, descriptor) {
    if (isPrimitive(descriptor) || isFunction(descriptor)) {
        descriptor = {
            value: descriptor
        };
    }
    return nativeDefineProperty(object, name, descriptor);
}

defineProperty.hasGettersSetters = true;

if (!isNative(nativeDefineProperty) || !(function() {
        var object = {},
            value = {};

        try {
            nativeDefineProperty(object, "key", {
                value: value
            });
            if (has(object, "key") && object.key === value) {
                return true;
            } else {
                return false;
            }
        } catch (e) {}

        return false;
    }())) {

    defineProperty.hasGettersSetters = false;

    nativeDefineProperty = function defineProperty(object, name, descriptor) {
        if (!isObject(object)) {
            throw new TypeError("defineProperty(object, name, descriptor) called on non-object");
        }
        if (has(descriptor, "get") || has(descriptor, "set")) {
            throw new TypeError("defineProperty(object, name, descriptor) this environment does not support getters or setters");
        }
        object[name] = descriptor.value;
    };
}

},
function(require, exports, module, undefined, global) {
/*@=-@nathanfaucett/keys@0.0.1/src/index.js-=@*/
var has = require(48),
    isNative = require(25),
    isNullOrUndefined = require(22),
    isObject = require(20);


var nativeKeys = Object.keys;


module.exports = keys;


function keys(value) {
    if (isNullOrUndefined(value)) {
        return [];
    } else {
        return nativeKeys(isObject(value) ? value : Object(value));
    }
}

if (!isNative(nativeKeys)) {
    nativeKeys = function keys(value) {
        var localHas = has,
            out = [],
            i = 0,
            key;

        for (key in value) {
            if (localHas(value, key)) {
                out[i++] = key;
            }
        }

        return out;
    };
}

},
function(require, exports, module, undefined, global) {
/*@=-@nathanfaucett/has@0.0.1/src/index.js-=@*/
var isNative = require(25),
    getPrototypeOf = require(30),
    isNullOrUndefined = require(22);


var nativeHasOwnProp = Object.prototype.hasOwnProperty,
    baseHas;


module.exports = has;


function has(object, key) {
    if (isNullOrUndefined(object)) {
        return false;
    } else {
        return baseHas(object, key);
    }
}

if (isNative(nativeHasOwnProp)) {
    baseHas = function baseHas(object, key) {
        if (object.hasOwnProperty) {
            return object.hasOwnProperty(key);
        } else {
            return nativeHasOwnProp.call(object, key);
        }
    };
} else {
    baseHas = function baseHas(object, key) {
        var proto = getPrototypeOf(object);

        if (isNullOrUndefined(proto)) {
            return key in object;
        } else {
            return (key in object) && (!(key in proto) || proto[key] !== object[key]);
        }
    };
}

},
function(require, exports, module, undefined, global) {
/*@=-@nathanfaucett/keys@0.0.2/src/index.js-=@*/
var has = require(26),
    isNative = require(25),
    isNullOrUndefined = require(22),
    isObject = require(20);


var nativeKeys = Object.keys;


module.exports = keys;


function keys(value) {
    if (isNullOrUndefined(value)) {
        return [];
    } else {
        return nativeKeys(isObject(value) ? value : Object(value));
    }
}

if (!isNative(nativeKeys)) {
    nativeKeys = function keys(value) {
        var localHas = has,
            out = [],
            i = 0,
            key;

        for (key in value) {
            if (localHas(value, key)) {
                out[i++] = key;
            }
        }

        return out;
    };
}

},
function(require, exports, module, undefined, global) {
/*@=-@nathanfaucett/bit_count@0.0.2/src/index.js-=@*/
module.exports = bitCount;


function bitCount(i) {
    i = i - ((i >>> 1) & 0x55555555);
    i = (i & 0x33333333) + ((i >>> 2) & 0x33333333);
    i = (i + (i >>> 4)) & 0x0f0f0f0f;
    i = i + (i >>> 8);
    i = i + (i >>> 16);
    return i & 0x3f;
}

},
function(require, exports, module, undefined, global) {
/*@=-@nathanfaucett/immutable-hash_map@0.0.4/src/consts.js-=@*/
var consts = exports;


consts.SHIFT = 5;
consts.SIZE = 1 << consts.SHIFT;
consts.MASK = consts.SIZE - 1;

consts.MAX_ARRAY_MAP_SIZE = consts.SIZE / 4;
consts.MAX_BITMAP_INDEXED_SIZE = consts.SIZE / 2;
},
function(require, exports, module, undefined, global) {
/*@=-@nathanfaucett/immutable-hash_map@0.0.4/src/bitpos.js-=@*/
var mask = require(56);


module.exports = bitpos;


function bitpos(hashCode, shift) {
    return 1 << mask(hashCode, shift);
}
},
function(require, exports, module, undefined, global) {
/*@=-@nathanfaucett/array_copy@0.0.1/src/index.js-=@*/
var clamp = require(23),
    isUndefined = require(9);


module.exports = copyArray;


function copyArray(src, srcPos, dest, destPos, length) {
    var srcLength = src.length;

    srcPos = clamp(srcPos, 0, srcLength);
    length = isUndefined(length) ? (srcLength - srcPos) : length;
    destPos = clamp(destPos, 0, length);

    return baseArrayCopy(src, srcPos, dest, destPos, length);
}
copyArray.base = baseArrayCopy;

function baseArrayCopy(src, srcPos, dest, destPos, length) {
    var i = srcPos - 1,
        il = srcPos + length - 1;

    while (i++ < il) {
        dest[destPos++] = src[i];
    }

    return dest;
}

},
function(require, exports, module, undefined, global) {
/*@=-@nathanfaucett/immutable-hash_map@0.0.4/src/cloneAndSet.js-=@*/
var isUndefined = require(9),
    arrayCopy = require(53);


var baseArrayCopy = arrayCopy.base;


module.exports = cloneAndSet;


function cloneAndSet(array, index0, value0, index1, value1) {
    var length = array.length,
        results = new Array(length);

    baseArrayCopy(array, 0, results, 0, length);

    results[index0] = value0;
    if (!isUndefined(index1)) {
        results[index1] = value1;
    }

    return results;
}
},
function(require, exports, module, undefined, global) {
/*@=-@nathanfaucett/immutable-hash_map@0.0.4/src/removePair.js-=@*/
var arrayCopy = require(53);


var baseArrayCopy = arrayCopy.base;


module.exports = removePair;


function removePair(array, index) {
    var length = array.length,
        newArray = new Array(length - 2);

    baseArrayCopy(array, 0, newArray, 0, 2 * index);
    baseArrayCopy(array, 2 * (index + 1), newArray, 2 * index, length - 2 * index);

    return newArray;
}
},
function(require, exports, module, undefined, global) {
/*@=-@nathanfaucett/immutable-hash_map@0.0.4/src/mask.js-=@*/
var consts = require(51);


var MASK = consts.MASK;


module.exports = mask;


function mask(hashCode, shift) {
    return (hashCode >>> shift) & MASK;
}
},
function(require, exports, module, undefined, global) {
/*@=-@nathanfaucett/immutable-hash_map@0.0.4/src/nodeIterator.js-=@*/
var isNull = require(8),
    isUndefined = require(9),
    Iterator = require(34);


var IteratorValue = Iterator.Value;


module.exports = nodeIterator;


function nodeIterator(reverse) {
    if (reverse !== true) {
        return iterator(this);
    } else {
        return iteratorReverse(this);
    }
}

function iterator(_this) {
    var array = _this.array,
        index = 0,
        length = array.length,
        nextIter = null,
        nextEntry = null;

    function advance() {
        var key, iter;

        while (index < length) {
            key = array[index];
            valueOrNode = array[index + 1];
            index += 2;

            if (!isUndefined(key)) {
                nextEntry = [key, valueOrNode];
                return true;
            } else if (!isUndefined(valueOrNode)) {
                iter = valueOrNode.iterator();

                if (!isNull(iter) && iter.hasNext()) {
                    nextIter = iter;
                    return true;
                }
            }
        }

        return false;
    }

    function hasNext() {
        if (!isNull(nextEntry) || !isNull(nextIter)) {
            return true;
        } else {
            return advance();
        }
    }

    function next() {
        var entry = nextEntry;

        if (!isNull(entry)) {
            nextEntry = null;
            return new IteratorValue(entry, false);
        } else if (!isNull(nextIter)) {
            entry = nextIter.next();

            if (!nextIter.hasNext()) {
                nextIter = null;
            }

            return new IteratorValue(entry, false);
        } else if (advance()) {
            return next();
        } else {
            return new IteratorValue(undefined, true);
        }
    }

    return new Iterator(hasNext, next);
}

function iteratorReverse(_this) {
    var array = _this.array,
        length = array.length,
        index = length - 1,
        nextIter = null,
        nextEntry = null;

    function advance() {
        var key, iter;

        while (index > -1) {
            key = array[index - 1];
            valueOrNode = array[index];
            index -= 2;

            if (!isUndefined(key)) {
                nextEntry = [key, valueOrNode];
                return true;
            } else if (!isUndefined(valueOrNode)) {
                iter = valueOrNode.iterator();

                if (!isNull(iter) && iter.hasNext()) {
                    nextIter = iter;
                    return true;
                }
            }
        }

        return false;
    }

    function hasNext() {
        if (!isNull(nextEntry) || !isNull(nextIter)) {
            return true;
        } else {
            return advance();
        }
    }

    function next() {
        var entry = nextEntry;

        if (!isNull(entry)) {
            nextEntry = null;
            return new IteratorValue(entry, false);
        } else if (!isNull(nextIter)) {
            entry = nextIter.next();

            if (!nextIter.hasNext()) {
                nextIter = null;
            }

            return new IteratorValue(entry, false);
        } else if (advance()) {
            return next();
        } else {
            return new IteratorValue(undefined, true);
        }
    }

    return new Iterator(hasNext, next);
}
},
function(require, exports, module, undefined, global) {
/*@=-@nathanfaucett/immutable-hash_map@0.0.4/src/ArrayNode.js-=@*/
var isNull = require(8),
    isNullOrUndefined = require(22),
    consts = require(51),
    mask = require(56),
    cloneAndSet = require(54),
    Iterator = require(34),
    BitmapIndexedNode;


var SHIFT = consts.SHIFT,
    MAX_ARRAY_MAP_SIZE = consts.MAX_ARRAY_MAP_SIZE,
    EMPTY = new ArrayNode(0, []),
    IteratorValue = Iterator.Value,
    ArrayNodePrototype = ArrayNode.prototype;


module.exports = ArrayNode;


BitmapIndexedNode = require(35);


function ArrayNode(count, array) {
    this.count = count;
    this.array = array;
}

ArrayNode.EMPTY = EMPTY;

ArrayNodePrototype.get = function(shift, keyHash, key, notSetValue) {
    var index = mask(keyHash, shift),
        node = this.array[index];

    if (isNullOrUndefined(node)) {
        return notSetValue;
    } else {
        return node.get(shift + SHIFT, keyHash, key, notSetValue);
    }
};

ArrayNodePrototype.set = function(shift, keyHash, key, value, addedLeaf) {
    var index = mask(keyHash, shift),
        array = this.array,
        count = this.count,
        node = array[index],
        newNode;

    if (isNullOrUndefined(node)) {
        return new ArrayNode(count + 1, cloneAndSet(array, index, BitmapIndexedNode.EMPTY.set(shift + SHIFT, keyHash, key, value, addedLeaf)));
    } else {
        newNode = node.set(shift + SHIFT, keyHash, key, value, addedLeaf);

        if (newNode === node) {
            return this;
        } else {
            return new ArrayNode(count, cloneAndSet(array, index, newNode));
        }
    }
};

ArrayNodePrototype.remove = function(shift, keyHash, key) {
    var index = mask(keyHash, shift),
        array = this.array,
        node = array[index],
        newNode, count;

    if (isNullOrUndefined(node)) {
        return this;
    } else {
        newNode = node.remove(shift + SHIFT, keyHash, key);

        if (newNode === node) {
            return this;
        } else {
            array = this.array;
            count = this.count;

            if (isNull(newNode)) {
                if (count <= MAX_ARRAY_MAP_SIZE) {
                    return pack(array, index);
                } else {
                    return new ArrayNode(count - 1, cloneAndSet(array, index, newNode));
                }
            } else {
                return new ArrayNode(count, cloneAndSet(array, index, newNode));
            }
        }
    }
};

function ArrayNode_iterator(_this) {
    var array = _this.array,
        index = 0,
        length = array.length,
        nestedIter = null;

    function hasNext() {
        var node;

        while (true) {
            if (!isNull(nestedIter)) {
                if (nestedIter.hasNext()) {
                    return true;
                } else {
                    nestedIter = null;
                }
            } else {
                if (index === length) {
                    return false;
                } else {
                    node = array[index];
                    index += 1;

                    if (!isNullOrUndefined(node)) {
                        nestedIter = node.iterator();
                    }
                }
            }
        }
    }

    function next() {
        if (hasNext()) {
            return nestedIter.next();
        } else {
            return new IteratorValue(undefined, true);
        }
    }

    return new Iterator(hasNext, next);
}

function ArrayNode_iteratorReverse(_this) {
    var array = _this.array,
        length = array.length,
        index = length - 1,
        nestedIter = null;

    function hasNext() {
        var node;

        while (true) {
            if (!isNull(nestedIter)) {
                if (nestedIter.hasNext()) {
                    return true;
                } else {
                    nestedIter = null;
                }
            } else {
                if (index === -1) {
                    return false;
                } else {
                    node = array[index];
                    index -= 1;

                    if (!isNullOrUndefined(node)) {
                        nestedIter = node.iterator();
                    }
                }
            }
        }
    }

    function next() {
        if (hasNext()) {
            return nestedIter.next();
        } else {
            return new IteratorValue(undefined, true);
        }
    }

    return new Iterator(hasNext, next);
}

ArrayNodePrototype.iterator = function(reverse) {
    if (reverse !== true) {
        return ArrayNode_iterator(this);
    } else {
        return ArrayNode_iteratorReverse(this);
    }
};

function pack(array, index) {
    var newArray = new Array(2 * (count - 1)),
        j = 1,
        bitmap = 0,
        i = -1,
        il = index - 1;

    while (i++ < il) {
        if (!isNull(array[i])) {
            newArray[j] = array[i];
            bitmap |= 1 << i;
            j += 2;
        }
    }

    i = index - 1;
    il = array.length - 1;
    while (i++ < il) {
        if (!isNull(array[i])) {
            newArray[j] = array[i];
            bitmap |= 1 << i;
            j += 2;
        }
    }

    return new BitmapIndexedNode(bitmap, newArray);
}

},
function(require, exports, module, undefined, global) {
/*@=-@nathanfaucett/immutable-hash_map@0.0.4/src/createNode.js-=@*/
var hashCode = require(32),
    Box = require(33),
    HashCollisionNode, BitmapIndexedNode;


module.exports = createNode;


HashCollisionNode = require(60);
BitmapIndexedNode = require(35);


function createNode(shift, key0, value0, keyHash1, key1, value1) {
    var keyHash0 = hashCode(key0),
        addedLeaf;

    if (keyHash0 === keyHash1) {
        return new HashCollisionNode(keyHash0, 2, [key0, value0, key1, value1]);
    } else {
        addedLeaf = new Box(null);
        return BitmapIndexedNode.EMPTY
            .set(shift, keyHash0, key0, value0, addedLeaf)
            .set(shift, keyHash1, key1, value1, addedLeaf);
    }
}
},
function(require, exports, module, undefined, global) {
/*@=-@nathanfaucett/immutable-hash_map@0.0.4/src/HashCollisionNode.js-=@*/
var isEqual = require(17),
    bitpos = require(52),
    arrayCopy = require(53),
    cloneAndSet = require(54),
    removePair = require(55),
    nodeIterator = require(57),
    BitmapIndexedNode;


var baseArrayCopy = arrayCopy.base,
    EMPTY = new HashCollisionNode(0, []),
    HashCollisionNodePrototype = HashCollisionNode.prototype;


module.exports = HashCollisionNode;


BitmapIndexedNode = require(35);


function HashCollisionNode(keyHash, count, array) {
    this.keyHash = keyHash;
    this.count = count;
    this.array = array;
}

HashCollisionNode.EMPTY = EMPTY;

HashCollisionNodePrototype.get = function(shift, keyHash, key, notSetValue) {
    var array = this.array,
        index = getIndex(array, key);

    if (index === -1) {
        return notFound;
    } else {
        if (isEqual(key, array[index])) {
            return array[index + 1];
        } else {
            return notSetValue;
        }
    }
};

HashCollisionNodePrototype.set = function(shift, keyHash, key, value, addedLeaf) {
    var index, count, array, newArray;

    if (keyHash === this.keyHash) {
        array = this.array;
        count = this.count,
            index = getIndex(array, key);

        if (index !== -1) {
            if (array[index + 1] === value) {
                return this;
            } else {
                return new HashCollisionNode(keyHash, count, cloneAndSet(array, index + 1, value));
            }
        } else {
            newArray = new Array(2 * (count + 1));
            baseArrayCopy(array, 0, newArray, 0, 2 * count);
            newArray[2 * count] = key;
            newArray[2 * count + 1] = value;
            addedLeaf.value = addedLeaf;
            return new HashCollisionNode(keyHash, count + 1, newArray);
        }
    } else {
        return new BitmapIndexedNode(bitpos(this.keyHash, shift), [null, this]).set(shift, keyHash, key, value, addedLeaf);
    }
};

HashCollisionNodePrototype.remove = function(shift, keyHash, key) {
    var array = this.array,
        index = getIndex(array, key);

    if (index === -1) {
        return this;
    } else {
        if (array.length === 1) {
            return null;
        } else {
            return new HashCollisionNode(hash, count - 1, removePair(array, index / 2));
        }
    }
};

HashCollisionNodePrototype.iterator = nodeIterator;

function getIndex(array, key) {
    var i = -1,
        il = array.length - 1;

    while (i++ < il) {
        if (isEqual(array[i], key)) {
            return i;
        }
    }

    return -1;
}
},
function(require, exports, module, undefined, global) {
/*@=-@nathanfaucett/immutable-hash_map@0.0.2/src/index.js-=@*/
var has = require(26),
    freeze = require(16),
    isNull = require(8),
    isUndefined = require(9),
    isObject = require(20),
    defineProperty = require(15),
    isEqual = require(17),
    hashCode = require(32),
    isArrayLike = require(10),
    fastBindThis = require(13),
    Box = require(62),
    Iterator = require(63),
    BitmapIndexedNode = require(64);


var INTERNAL_CREATE = {},

    ITERATOR_SYMBOL = typeof(Symbol) === "function" ? Symbol.iterator : false,
    IS_MAP = "__ImmutableHashMap__",

    NOT_SET = {},
    EMPTY_MAP = freeze(new HashMap(INTERNAL_CREATE)),

    IteratorValue = Iterator.Value,

    HashMapPrototype;


module.exports = HashMap;


function HashMap(value) {
    if (!(this instanceof HashMap)) {
        throw new Error("HashMap() must be called with new");
    }

    this.__size = 0;
    this.__root = null;

    if (value !== INTERNAL_CREATE) {
        return HashMap_createHashMap(this, value, arguments);
    } else {
        return this;
    }
}
HashMapPrototype = HashMap.prototype;

HashMap.EMPTY = EMPTY_MAP;

function HashMap_createHashMap(_this, value, args) {
    var length = args.length;

    if (length === 1) {
        if (isArrayLike(value)) {
            return HashMap_fromArray(_this, value.toArray ? value.toArray() : value);
        } else if (isObject(value)) {
            return HashMap_fromObject(_this, value);
        } else {
            return EMPTY_MAP;
        }
    } else if (length > 1) {
        return HashMap_fromArray(_this, args);
    } else {
        return EMPTY_MAP;
    }
}

function HashMap_fromObject(_this, object) {
    var size = 0,
        root = BitmapIndexedNode.EMPTY,
        key, value, newRoot, addedLeaf;

    for (key in object) {
        if (has(object, key)) {
            value = object[key];

            addedLeaf = new Box(null);
            newRoot = root.set(0, hashCode(key), key, value, addedLeaf);

            if (newRoot !== root) {
                root = newRoot;
                if (!isNull(addedLeaf.value)) {
                    size += 1;
                }
            }
        }
    }

    if (size !== 0) {
        _this.__size = size;
        _this.__root = newRoot;
        return freeze(_this);
    } else {
        return EMPTY_MAP;
    }
}

function HashMap_fromArray(_this, array) {
    var i = 0,
        il = array.length,
        root = BitmapIndexedNode.EMPTY,
        size = 0,
        newRoot, key, value, addedLeaf;

    while (i < il) {
        key = array[i];
        value = array[i + 1];
        addedLeaf = new Box(null);

        newRoot = root.set(0, hashCode(key), key, value, addedLeaf);
        if (newRoot !== root) {
            root = newRoot;
            if (!isNull(addedLeaf.value)) {
                size += 1;
            }
        }

        i += 2;
    }

    if (size !== 0) {
        _this.__root = root;
        _this.__size = size;
        return freeze(_this);
    } else {
        return EMPTY_MAP;
    }
}

HashMap.fromArray = function(array) {
    if (array.length > 0) {
        return HashMap_createHashMap(new HashMap(INTERNAL_CREATE), array[0], array);
    } else {
        return EMPTY_MAP;
    }
};

HashMap.of = function() {
    return HashMap.fromArray(arguments);
};

HashMap.isHashMap = function(value) {
    return !!(value && value[IS_MAP]);
};

defineProperty(HashMapPrototype, IS_MAP, {
    configurable: false,
    enumerable: false,
    writable: false,
    value: true
});

HashMapPrototype.size = function() {
    return this.__size;
};

if (defineProperty.hasGettersSetters) {
    defineProperty(HashMapPrototype, "length", {
        get: HashMapPrototype.size
    });
}

HashMapPrototype.count = HashMapPrototype.size;

HashMapPrototype.isEmpty = function() {
    return this.__size === 0;
};

HashMapPrototype.has = function(key) {
    var root = this.__root;
    return isNull(root) ? false : root.get(0, hashCode(key), key, NOT_SET) !== NOT_SET;
};

HashMapPrototype.get = function(key, notSetValue) {
    var root = this.__root;
    return isNull(root) ? notSetValue : root.get(0, hashCode(key), key);
};

HashMapPrototype.set = function(key, value) {
    var root = this.__root,
        size = this.__size,
        addedLeaf = new Box(null),
        newRoot = (isNull(root) ? BitmapIndexedNode.EMPTY : root).set(0, hashCode(key), key, value, addedLeaf),
        map;

    if (newRoot === root) {
        return this;
    } else {
        map = new HashMap(INTERNAL_CREATE);
        map.__size = isNull(addedLeaf.value) ? size : size + 1;
        map.__root = newRoot;
        return freeze(map);
    }
};

HashMapPrototype.remove = function(key) {
    var root = this.__root,
        size = this.__size,
        newRoot;

    if (isNull(root)) {
        return this;
    } else if (size === 1) {
        return EMPTY_MAP;
    } else {
        newRoot = root.remove(0, hashCode(key), key);

        if (newRoot === root) {
            return this;
        } else {
            map = new HashMap(INTERNAL_CREATE);
            map.__size = size - 1;
            map.__root = newRoot;
            return freeze(map);
        }
    }
};

function hasNext() {
    return false;
}

function next() {
    return new IteratorValue(undefined, true);
}

HashMapPrototype.iterator = function(reverse) {
    var root = this.__root;

    if (isNull(root)) {
        return new Iterator(hasNext, next);
    } else {
        return root.iterator(reverse);
    }
};

if (ITERATOR_SYMBOL) {
    HashMapPrototype[ITERATOR_SYMBOL] = HashMapPrototype.iterator;
}

function HashMap_every(_this, it, callback) {
    var next = it.next(),
        nextValue;

    while (next.done === false) {
        nextValue = next.value;
        if (!callback(nextValue[1], nextValue[0], _this)) {
            return false;
        }
        next = it.next();
    }

    return true;
}

HashMapPrototype.every = function(callback, thisArg) {
    return HashMap_every(this, this.iterator(), isUndefined(thisArg) ? callback : fastBindThis(callback, thisArg, 3));
};

function HashMap_filter(_this, it, callback) {
    var results = [],
        next = it.next(),
        index = 0,
        nextValue, key, value;

    while (next.done === false) {
        nextValue = next.value;
        key = nextValue[0];
        value = nextValue[1];

        if (callback(value, key, _this)) {
            results[index++] = key;
            results[index++] = value;
        }

        next = it.next();
    }

    return HashMap.of(results);
}

HashMapPrototype.filter = function(callback, thisArg) {
    return HashMap_filter(this, this.iterator(), isUndefined(thisArg) ? callback : fastBindThis(callback, thisArg, 3));
};

function HashMap_forEach(_this, it, callback) {
    var next = it.next(),
        nextValue;

    while (next.done === false) {
        nextValue = next.value;
        if (callback(nextValue[1], nextValue[0], _this) === false) {
            break;
        }
        next = it.next();
    }

    return _this;
}

HashMapPrototype.forEach = function(callback, thisArg) {
    return HashMap_forEach(this, this.iterator(), isUndefined(thisArg) ? callback : fastBindThis(callback, thisArg, 3));
};

HashMapPrototype.each = HashMapPrototype.forEach;

function HashMap_forEachRight(_this, it, callback) {
    var next = it.next(),
        nextValue;

    while (next.done === false) {
        nextValue = next.value;
        if (callback(nextValue[1], nextValue[0], _this) === false) {
            break;
        }
        next = it.next();
    }

    return _this;
}

HashMapPrototype.forEachRight = function(callback, thisArg) {
    return HashMap_forEachRight(this, this.iterator(true), isUndefined(thisArg) ? callback : fastBindThis(callback, thisArg, 3));
};

HashMapPrototype.eachRight = HashMapPrototype.forEachRight;

function HashMap_map(_this, it, callback) {
    var next = it.next(),
        results = new Array(_this.__size * 2),
        index = 0,
        nextValue, key;

    while (next.done === false) {
        nextValue = next.value;
        key = nextValue[0];
        results[index++] = key;
        results[index++] = callback(nextValue[1], key, _this);
        next = it.next();
    }

    return HashMap.of(results);
}

HashMapPrototype.map = function(callback, thisArg) {
    return HashMap_map(this, this.iterator(), isUndefined(thisArg) ? callback : fastBindThis(callback, thisArg, 3));
};

function HashMap_reduce(_this, it, callback, initialValue) {
    var next = it.next(),
        value = initialValue,
        nextValue, key;

    if (isUndefined(value)) {
        nextValue = next.value;
        key = nextValue[0];
        value = nextValue[1];
        next = it.next();
    }

    while (next.done === false) {
        nextValue = next.value;
        value = callback(value, nextValue[1], key, _this);
        next = it.next();
    }

    return value;
}

HashMapPrototype.reduce = function(callback, initialValue, thisArg) {
    return HashMap_reduce(this, this.iterator(), isUndefined(thisArg) ? callback : fastBindThis(callback, thisArg, 4), initialValue);
};

function HashMap_reduceRight(_this, it, callback, initialValue) {
    var next = it.next(),
        value = initialValue,
        nextValue, key;

    if (isUndefined(value)) {
        nextValue = next.value;
        key = nextValue[0];
        value = nextValue[1];
        next = it.next();
    }

    while (next.done === false) {
        nextValue = next.value;
        value = callback(value, nextValue[1], key, _this);
        next = it.next();
    }

    return value;
}

HashMapPrototype.reduceRight = function(callback, initialValue, thisArg) {
    return HashMap_reduceRight(this, this.iterator(true), isUndefined(thisArg) ? callback : fastBindThis(callback, thisArg, 4), initialValue);
};

function HashMap_some(_this, it, callback) {
    var next = it.next(),
        nextValue;

    while (next.done === false) {
        nextValue = next.value;

        if (callback(nextValue[1], nextValue[0], _this)) {
            return true;
        }
        next = it.next();
    }

    return false;
}

HashMapPrototype.some = function(callback, thisArg) {
    return HashMap_some(this, this.iterator(), isUndefined(thisArg) ? callback : fastBindThis(callback, thisArg, 3));
};

HashMapPrototype.toArray = function() {
    var it = this.iterator(),
        next = it.next(),
        results = new Array(this.__size * 2),
        index = 0;

    while (next.done === false) {
        nextValue = next.value;
        results[index++] = nextValue[0];
        results[index++] = nextValue[1];
        next = it.next();
    }

    return results;
};

HashMapPrototype.toObject = function() {
    var it = this.iterator(),
        results = {},
        step;

    while ((step = it.next()).done === false) {
        nextValue = step.value;
        results[nextValue[0]] = nextValue[1];
    }

    return results;
};

HashMapPrototype.join = function(separator, keyValueSeparator) {
    var it = this.iterator(),
        next = it.next(),
        result = "";

    separator = separator || ", ";
    keyValueSeparator = keyValueSeparator || ": ";

    while (!next.done) {
        nextValue = next.value;
        next = it.next();

        if (next.done) {
            result += nextValue[0] + keyValueSeparator + nextValue[1];
            break;
        } else {
            result += nextValue[0] + keyValueSeparator + nextValue[1] + separator;
        }
    }

    return result;
};

HashMapPrototype.toString = function() {
    return "{" + this.join() + "}";
};

HashMapPrototype.inspect = HashMapPrototype.toString;

function HashMap_equal(ait, bit) {
    var anext = ait.next(),
        bnext = bit.next(),
        anextValue, bnextValue;

    while (anext.done === false) {
        anextValue = anext.value;
        bnextValue = bnext.value;

        if (!isEqual(anextValue[0], bnextValue[0]) || !isEqual(anextValue[1], bnextValue[1])) {
            return false;
        }

        anext = ait.next();
        bnext = bit.next();
    }

    return true;
}

HashMap.equal = function(a, b) {
    if (a === b) {
        return true;
    } else if (!a || !b || a.__size !== b.__size) {
        return false;
    } else {
        return HashMap_equal(a.iterator(), b.iterator());
    }
};

HashMapPrototype.equals = function(b) {
    return HashMap.equal(this, b);
};
},
function(require, exports, module, undefined, global) {
/*@=-@nathanfaucett/immutable-hash_map@0.0.2/src/Box.js-=@*/
module.exports = Box;


function Box(value) {
    this.value = value;
}
},
function(require, exports, module, undefined, global) {
/*@=-@nathanfaucett/immutable-hash_map@0.0.2/src/Iterator.js-=@*/
var inherits = require(42),
    BaseIterator = require(12);


module.exports = Iterator;


function Iterator(hasNext, next) {
    this.hasNext = hasNext;
    this.next = next;
}
inherits(Iterator, BaseIterator);
},
function(require, exports, module, undefined, global) {
/*@=-@nathanfaucett/immutable-hash_map@0.0.2/src/BitmapIndexedNode.js-=@*/
var isNull = require(8),
    isEqual = require(17),
    hashCode = require(32),
    bitCount = require(50),
    consts = require(65),
    bitpos = require(66),
    arrayCopy = require(53),
    cloneAndSet = require(67),
    removePair = require(68),
    mask = require(69),
    nodeIterator = require(70),
    ArrayNode, createNode;


var baseArrayCopy = arrayCopy.base,
    SHIFT = consts.SHIFT,
    MAX_BITMAP_INDEXED_SIZE = consts.MAX_BITMAP_INDEXED_SIZE,
    EMPTY = new BitmapIndexedNode(0, []),
    BitmapIndexedNodePrototype = BitmapIndexedNode.prototype;


module.exports = BitmapIndexedNode;


ArrayNode = require(71);
createNode = require(72);


function BitmapIndexedNode(bitmap, array) {
    this.bitmap = bitmap;
    this.array = array;
}

BitmapIndexedNode.EMPTY = EMPTY;

BitmapIndexedNodePrototype.get = function(shift, keyHash, key, notSetValue) {
    var bitmap = this.bitmap,
        bit = bitpos(keyHash, shift),
        array, index, keyOrNull, valueOrNode;

    if ((bitmap & bit) === 0) {
        return notSetValue;
    } else {
        array = this.array;
        index = getIndex(bitmap, bit);

        keyOrNull = array[2 * index];
        valueOrNode = array[2 * index + 1];

        if (isNull(keyOrNull)) {
            return valueOrNode.get(shift + SHIFT, keyHash, key, notSetValue);
        } else {
            if (isEqual(key, keyOrNull)) {
                return valueOrNode;
            } else {
                return notSetValue;
            }
        }
    }
};

BitmapIndexedNodePrototype.set = function(shift, keyHash, key, value, addedLeaf) {
    var array = this.array,
        bitmap = this.bitmap,
        bit = bitpos(keyHash, shift),
        index = getIndex(bitmap, bit),
        keyOrNull, valueOrNode, newNode, nodes, jIndex, i, j, newArray;

    if ((bitmap & bit) !== 0) {
        keyOrNull = array[2 * index];
        valueOrNode = array[2 * index + 1];

        if (isNull(keyOrNull)) {
            newNode = valueOrNode.set(shift + SHIFT, keyHash, key, value, addedLeaf);

            if (newNode === valueOrNode) {
                return this;
            } else {
                return new BitmapIndexedNode(bitmap, cloneAndSet(array, 2 * index + 1, newNode));
            }
        }
        if (isEqual(key, keyOrNull)) {
            if (value === valueOrNode) {
                return this;
            } else {
                return new BitmapIndexedNode(bitmap, cloneAndSet(array, 2 * index + 1, value));
            }
        }
        addedLeaf.value = addedLeaf;
        return new BitmapIndexedNode(bitmap,
            cloneAndSet(array,
                2 * index, null,
                2 * index + 1, createNode(shift + SHIFT, keyOrNull, valueOrNode, keyHash, key, value)));
    } else {
        newNode = bitCount(bitmap);

        if (newNode >= MAX_BITMAP_INDEXED_SIZE) {
            nodes = new Array(32);
            jIndex = mask(keyHash, shift);
            nodes[jIndex] = EMPTY.set(shift + SHIFT, keyHash, key, value, addedLeaf);

            i = -1;
            j = 0;
            while (i++ < 31) {
                if (((bitmap >>> i) & 1) !== 0) {
                    if (array[j] == null) {
                        nodes[i] = array[j + 1];
                    } else {
                        nodes[i] = EMPTY.set(shift + SHIFT, hashCode(array[j]), array[j], array[j + 1], addedLeaf);
                    }
                    j += 2;
                }
            }

            return new ArrayNode(newNode + 1, nodes);
        } else {
            newArray = new Array(2 * (newNode + 1));
            baseArrayCopy(array, 0, newArray, 0, 2 * index);

            newArray[2 * index] = key;
            addedLeaf.value = addedLeaf;
            newArray[2 * index + 1] = value;

            baseArrayCopy(array, 2 * index, newArray, 2 * (index + 1), 2 * (newNode - index));

            return new BitmapIndexedNode(bitmap | bit, newArray);
        }
    }
};

BitmapIndexedNodePrototype.remove = function(shift, keyHash, key) {
    var bitmap = this.bitmap,
        bit = bitpos(keyHash, shift),
        index, array, newNode;

    if ((bitmap & bit) === 0) {
        return this;
    } else {
        index = getIndex(bitmap, bit);
        array = this.array;

        keyOrNull = array[2 * index];
        valueOrNode = array[2 * index + 1];

        if (isNull(keyOrNull)) {
            newNode = valueOrNode.remove(shift + SHIFT, keyHash, key);

            if (newNode === valueOrNode) {
                return this;
            } else if (!isNull(newNode)) {
                return new BitmapIndexedNode(bitmap, cloneAndSet(array, 2 * index + 1, newNode));
            } else if (bitmap === bit) {
                return null;
            } else {
                return new BitmapIndexedNode(bitmap ^ bit, removePair(array, index));
            }
        } else {
            if (isEqual(key, keyOrNull)) {
                return new BitmapIndexedNode(bitmap ^ bit, removePair(array, index));
            } else {
                return this;
            }
        }
    }
};

BitmapIndexedNodePrototype.iterator = nodeIterator;

function getIndex(bitmap, bit) {
    return bitCount(bitmap & (bit - 1));
}
},
function(require, exports, module, undefined, global) {
/*@=-@nathanfaucett/immutable-hash_map@0.0.2/src/consts.js-=@*/
var consts = exports;


consts.SHIFT = 5;
consts.SIZE = 1 << consts.SHIFT;
consts.MASK = consts.SIZE - 1;

consts.MAX_ARRAY_MAP_SIZE = consts.SIZE / 4;
consts.MAX_BITMAP_INDEXED_SIZE = consts.SIZE / 2;
},
function(require, exports, module, undefined, global) {
/*@=-@nathanfaucett/immutable-hash_map@0.0.2/src/bitpos.js-=@*/
var mask = require(69);


module.exports = bitpos;


function bitpos(hashCode, shift) {
    return 1 << mask(hashCode, shift);
}
},
function(require, exports, module, undefined, global) {
/*@=-@nathanfaucett/immutable-hash_map@0.0.2/src/cloneAndSet.js-=@*/
var isUndefined = require(9),
    arrayCopy = require(53);


var baseArrayCopy = arrayCopy.base;


module.exports = cloneAndSet;


function cloneAndSet(array, index0, value0, index1, value1) {
    var length = array.length,
        results = new Array(length);

    baseArrayCopy(array, 0, results, 0, length);

    results[index0] = value0;
    if (!isUndefined(index1)) {
        results[index1] = value1;
    }

    return results;
}
},
function(require, exports, module, undefined, global) {
/*@=-@nathanfaucett/immutable-hash_map@0.0.2/src/removePair.js-=@*/
var arrayCopy = require(53);


var baseArrayCopy = arrayCopy.base;


module.exports = removePair;


function removePair(array, index) {
    var length = array.length,
        newArray = new Array(length - 2);

    baseArrayCopy(array, 0, newArray, 0, 2 * index);
    baseArrayCopy(array, 2 * (index + 1), newArray, 2 * index, length - 2 * index);

    return newArray;
}
},
function(require, exports, module, undefined, global) {
/*@=-@nathanfaucett/immutable-hash_map@0.0.2/src/mask.js-=@*/
var consts = require(65);


var MASK = consts.MASK;


module.exports = mask;


function mask(hashCode, shift) {
    return (hashCode >>> shift) & MASK;
}
},
function(require, exports, module, undefined, global) {
/*@=-@nathanfaucett/immutable-hash_map@0.0.2/src/nodeIterator.js-=@*/
var isNull = require(8),
    isUndefined = require(9),
    Iterator = require(63);


var IteratorValue = Iterator.Value;


module.exports = nodeIterator;


function nodeIterator(reverse) {
    if (reverse !== true) {
        return iterator(this);
    } else {
        return iteratorReverse(this);
    }
}

function iterator(_this) {
    var array = _this.array,
        index = 0,
        length = array.length,
        nextIter = null,
        nextEntry = null;

    function advance() {
        var key, iter;

        while (index < length) {
            key = array[index];
            valueOrNode = array[index + 1];
            index += 2;

            if (!isUndefined(key)) {
                nextEntry = [key, valueOrNode];
                return true;
            } else if (!isUndefined(valueOrNode)) {
                iter = valueOrNode.iterator();

                if (!isNull(iter) && iter.hasNext()) {
                    nextIter = iter;
                    return true;
                }
            }
        }

        return false;
    }

    function hasNext() {
        if (!isNull(nextEntry) || !isNull(nextIter)) {
            return true;
        } else {
            return advance();
        }
    }

    function next() {
        var entry = nextEntry;

        if (!isNull(entry)) {
            nextEntry = null;
            return new IteratorValue(entry, false);
        } else if (!isNull(nextIter)) {
            entry = nextIter.next();

            if (!nextIter.hasNext()) {
                nextIter = null;
            }

            return new IteratorValue(entry, false);
        } else if (advance()) {
            return next();
        } else {
            return new IteratorValue(undefined, true);
        }
    }

    return new Iterator(hasNext, next);
}

function iteratorReverse(_this) {
    var array = _this.array,
        length = array.length,
        index = length - 1,
        nextIter = null,
        nextEntry = null;

    function advance() {
        var key, iter;

        while (index > -1) {
            key = array[index - 1];
            valueOrNode = array[index];
            index -= 2;

            if (!isUndefined(key)) {
                nextEntry = [key, valueOrNode];
                return true;
            } else if (!isUndefined(valueOrNode)) {
                iter = valueOrNode.iterator();

                if (!isNull(iter) && iter.hasNext()) {
                    nextIter = iter;
                    return true;
                }
            }
        }

        return false;
    }

    function hasNext() {
        if (!isNull(nextEntry) || !isNull(nextIter)) {
            return true;
        } else {
            return advance();
        }
    }

    function next() {
        var entry = nextEntry;

        if (!isNull(entry)) {
            nextEntry = null;
            return new IteratorValue(entry, false);
        } else if (!isNull(nextIter)) {
            entry = nextIter.next();

            if (!nextIter.hasNext()) {
                nextIter = null;
            }

            return new IteratorValue(entry, false);
        } else if (advance()) {
            return next();
        } else {
            return new IteratorValue(undefined, true);
        }
    }

    return new Iterator(hasNext, next);
}
},
function(require, exports, module, undefined, global) {
/*@=-@nathanfaucett/immutable-hash_map@0.0.2/src/ArrayNode.js-=@*/
var isNull = require(8),
    isNullOrUndefined = require(22),
    consts = require(65),
    mask = require(69),
    cloneAndSet = require(67),
    Iterator = require(63),
    BitmapIndexedNode;


var SHIFT = consts.SHIFT,
    MAX_ARRAY_MAP_SIZE = consts.MAX_ARRAY_MAP_SIZE,
    EMPTY = new ArrayNode(0, []),
    IteratorValue = Iterator.Value,
    ArrayNodePrototype = ArrayNode.prototype;


module.exports = ArrayNode;


BitmapIndexedNode = require(64);


function ArrayNode(count, array) {
    this.count = count;
    this.array = array;
}

ArrayNode.EMPTY = EMPTY;

ArrayNodePrototype.get = function(shift, keyHash, key, notSetValue) {
    var index = mask(keyHash, shift),
        node = this.array[index];

    if (isNullOrUndefined(node)) {
        return notSetValue;
    } else {
        return node.get(shift + SHIFT, hash, key, notSetValue);
    }
};

ArrayNodePrototype.set = function(shift, keyHash, key, value, addedLeaf) {
    var index = mask(keyHash, shift),
        array = this.array,
        count = this.count,
        node = array[index],
        newNode;

    if (isNullOrUndefined(node)) {
        return new ArrayNode(count + 1, cloneAndSet(array, index, BitmapIndexedNode.EMPTY.set(shift + SHIFT, keyHash, key, value, addedLeaf)));
    } else {
        newNode = node.set(shift + SHIFT, keyHash, key, value, addedLeaf);

        if (newNode === node) {
            return this;
        } else {
            return new ArrayNode(count, cloneAndSet(array, index, newNode));
        }
    }
};

ArrayNodePrototype.remove = function(shift, keyHash, key) {
    var index = mask(keyHash, shift),
        array = this.array,
        node = array[index],
        newNode, count;

    if (isNullOrUndefined(node)) {
        return this;
    } else {
        newNode = node.remove(shift + SHIFT, keyHash, key);

        if (newNode === node) {
            return this;
        } else {
            array = this.array;
            count = this.count;

            if (isNull(newNode)) {
                if (count <= MAX_ARRAY_MAP_SIZE) {
                    return pack(array, index);
                } else {
                    return new ArrayNode(count - 1, cloneAndSet(array, index, newNode));
                }
            } else {
                return new ArrayNode(count, cloneAndSet(array, index, newNode));
            }
        }
    }
};

function ArrayNode_iterator(_this) {
    var array = _this.array,
        index = 0,
        length = array.length,
        nestedIter = null;

    function hasNext() {
        var node;

        while (true) {
            if (!isNull(nestedIter)) {
                if (nestedIter.hasNext()) {
                    return true;
                } else {
                    nestedIter = null;
                }
            } else {
                if (index === length) {
                    return false;
                } else {
                    node = array[index];
                    index += 1;

                    if (!isNullOrUndefined(node)) {
                        nestedIter = node.iterator();
                    }
                }
            }
        }
    }

    function next() {
        if (hasNext()) {
            return nestedIter.next();
        } else {
            return new IteratorValue(undefined, true);
        }
    }

    return new Iterator(hasNext, next);
}

function ArrayNode_iteratorReverse(_this) {
    var array = _this.array,
        length = array.length,
        index = length - 1,
        nestedIter = null;

    function hasNext() {
        var node;

        while (true) {
            if (!isNull(nestedIter)) {
                if (nestedIter.hasNext()) {
                    return true;
                } else {
                    nestedIter = null;
                }
            } else {
                if (index === -1) {
                    return false;
                } else {
                    node = array[index];
                    index -= 1;

                    if (!isNullOrUndefined(node)) {
                        nestedIter = node.iterator();
                    }
                }
            }
        }
    }

    function next() {
        if (hasNext()) {
            return nestedIter.next();
        } else {
            return new IteratorValue(undefined, true);
        }
    }

    return new Iterator(hasNext, next);
}

ArrayNodePrototype.iterator = function(reverse) {
    if (reverse !== true) {
        return ArrayNode_iterator(this);
    } else {
        return ArrayNode_iteratorReverse(this);
    }
};

function pack(array, index) {
    var newArray = new Array(2 * (count - 1)),
        j = 1,
        bitmap = 0,
        i = -1,
        il = index - 1;

    while (i++ < il) {
        if (!isNull(array[i])) {
            newArray[j] = array[i];
            bitmap |= 1 << i;
            j += 2;
        }
    }

    i = index - 1;
    il = array.length - 1;
    while (i++ < il) {
        if (!isNull(array[i])) {
            newArray[j] = array[i];
            bitmap |= 1 << i;
            j += 2;
        }
    }

    return new BitmapIndexedNode(bitmap, newArray);
}
},
function(require, exports, module, undefined, global) {
/*@=-@nathanfaucett/immutable-hash_map@0.0.2/src/createNode.js-=@*/
var hashCode = require(32),
    Box = require(62),
    HashCollisionNode, BitmapIndexedNode;


module.exports = createNode;


HashCollisionNode = require(73);
BitmapIndexedNode = require(64);


function createNode(shift, key0, value0, keyHash1, key1, value1) {
    var keyHash0 = hashCode(key0),
        addedLeaf;

    if (keyHash0 === keyHash1) {
        return new HashCollisionNode(keyHash0, 2, [key0, value0, key1, value1]);
    } else {
        addedLeaf = new Box(null);
        return BitmapIndexedNode.EMPTY
            .set(shift, keyHash0, key0, value0, addedLeaf)
            .set(shift, keyHash1, key1, value1, addedLeaf);
    }
}
},
function(require, exports, module, undefined, global) {
/*@=-@nathanfaucett/immutable-hash_map@0.0.2/src/HashCollisionNode.js-=@*/
var isEqual = require(17),
    bitpos = require(66),
    arrayCopy = require(53),
    cloneAndSet = require(67),
    removePair = require(68),
    nodeIterator = require(70),
    BitmapIndexedNode;


var baseArrayCopy = arrayCopy.base,
    EMPTY = new HashCollisionNode(0, []),
    HashCollisionNodePrototype = HashCollisionNode.prototype;


module.exports = HashCollisionNode;


BitmapIndexedNode = require(64);


function HashCollisionNode(keyHash, count, array) {
    this.keyHash = keyHash;
    this.count = count;
    this.array = array;
}

HashCollisionNode.EMPTY = EMPTY;

HashCollisionNodePrototype.get = function(shift, keyHash, key, notSetValue) {
    var array = this.array,
        index = getIndex(array, key);

    if (index === -1) {
        return notFound;
    } else {
        if (isEqual(key, array[index])) {
            return array[index + 1];
        } else {
            return notSetValue;
        }
    }
};

HashCollisionNodePrototype.set = function(shift, keyHash, key, value, addedLeaf) {
    var index, count, array, newArray;

    if (keyHash === this.keyHash) {
        array = this.array;
        count = this.count,
            index = getIndex(array, key);

        if (index !== -1) {
            if (array[index + 1] === value) {
                return this;
            } else {
                return new HashCollisionNode(keyHash, count, cloneAndSet(array, index + 1, value));
            }
        } else {
            newArray = new Array(2 * (count + 1));
            baseArrayCopy(array, 0, newArray, 0, 2 * count);
            newArray[2 * count] = key;
            newArray[2 * count + 1] = value;
            addedLeaf.value = addedLeaf;
            return new HashCollisionNode(keyHash, count + 1, newArray);
        }
    } else {
        return new BitmapIndexedNode(bitpos(this.keyHash, shift), [null, this]).set(shift, keyHash, key, value, addedLeaf);
    }
};

HashCollisionNodePrototype.remove = function(shift, keyHash, key) {
    var array = this.array,
        index = getIndex(array, key);

    if (index === -1) {
        return this;
    } else {
        if (array.length === 1) {
            return null;
        } else {
            return new HashCollisionNode(hash, count - 1, removePair(array, index / 2));
        }
    }
};

HashCollisionNodePrototype.iterator = nodeIterator;

function getIndex(array, key) {
    var i = -1,
        il = array.length - 1;

    while (i++ < il) {
        if (isEqual(array[i], key)) {
            return i;
        }
    }

    return -1;
}
},
function(require, exports, module, undefined, global) {
/*@=-@nathanfaucett/immutable-hash_map@0.0.3/src/index.js-=@*/
var has = require(26),
    freeze = require(16),
    isNull = require(8),
    isUndefined = require(9),
    isObject = require(20),
    defineProperty = require(15),
    isEqual = require(17),
    hashCode = require(32),
    isArrayLike = require(10),
    fastBindThis = require(13),
    Box = require(75),
    Iterator = require(76),
    BitmapIndexedNode = require(77);


var INTERNAL_CREATE = {},

    ITERATOR_SYMBOL = typeof(Symbol) === "function" ? Symbol.iterator : false,
    IS_MAP = "__ImmutableHashMap__",

    NOT_SET = {},
    EMPTY_MAP = freeze(new HashMap(INTERNAL_CREATE)),

    IteratorValue = Iterator.Value,

    HashMapPrototype;


module.exports = HashMap;


function HashMap(value) {
    if (!(this instanceof HashMap)) {
        throw new Error("HashMap() must be called with new");
    }

    this._size = 0;
    this._root = null;

    if (value !== INTERNAL_CREATE) {
        return HashMap_createHashMap(this, value, arguments);
    } else {
        return this;
    }
}
HashMapPrototype = HashMap.prototype;

HashMap.EMPTY = EMPTY_MAP;

function HashMap_createHashMap(_this, value, args) {
    var length = args.length;

    if (length === 1) {
        if (isArrayLike(value)) {
            return HashMap_fromArray(_this, value.toArray ? value.toArray() : value);
        } else if (isObject(value)) {
            return HashMap_fromObject(_this, value);
        } else {
            return EMPTY_MAP;
        }
    } else if (length > 1) {
        return HashMap_fromArray(_this, args);
    } else {
        return EMPTY_MAP;
    }
}

function HashMap_fromObject(_this, object) {
    var size = 0,
        root = BitmapIndexedNode.EMPTY,
        key, value, newRoot, addedLeaf;

    for (key in object) {
        if (has(object, key)) {
            value = object[key];

            addedLeaf = new Box(null);
            newRoot = root.set(0, hashCode(key), key, value, addedLeaf);

            if (newRoot !== root) {
                root = newRoot;
                if (!isNull(addedLeaf.value)) {
                    size += 1;
                }
            }
        }
    }

    if (size !== 0) {
        _this._size = size;
        _this._root = newRoot;
        return freeze(_this);
    } else {
        return EMPTY_MAP;
    }
}

function HashMap_fromArray(_this, array) {
    var i = 0,
        il = array.length,
        root = BitmapIndexedNode.EMPTY,
        size = 0,
        newRoot, key, value, addedLeaf;

    while (i < il) {
        key = array[i];
        value = array[i + 1];
        addedLeaf = new Box(null);

        newRoot = root.set(0, hashCode(key), key, value, addedLeaf);
        if (newRoot !== root) {
            root = newRoot;
            if (!isNull(addedLeaf.value)) {
                size += 1;
            }
        }

        i += 2;
    }

    if (size !== 0) {
        _this._root = root;
        _this._size = size;
        return freeze(_this);
    } else {
        return EMPTY_MAP;
    }
}

HashMap.fromArray = function(array) {
    if (array.length > 0) {
        return HashMap_createHashMap(new HashMap(INTERNAL_CREATE), array[0], array);
    } else {
        return EMPTY_MAP;
    }
};

HashMap.fromObject = function(object) {
    return HashMap_fromObject(new HashMap(INTERNAL_CREATE), object);
};

HashMap.of = function() {
    return HashMap.fromArray(arguments);
};

HashMap.isHashMap = function(value) {
    return !!(value && value[IS_MAP]);
};

defineProperty(HashMapPrototype, IS_MAP, {
    configurable: false,
    enumerable: false,
    writable: false,
    value: true
});

HashMapPrototype.size = function() {
    return this._size;
};

if (defineProperty.hasGettersSetters) {
    defineProperty(HashMapPrototype, "length", {
        get: HashMapPrototype.size
    });
}

HashMapPrototype.count = HashMapPrototype.size;

HashMapPrototype.isEmpty = function() {
    return this._size === 0;
};

HashMapPrototype.has = function(key) {
    var root = this._root;
    return isNull(root) ? false : root.get(0, hashCode(key), key, NOT_SET) !== NOT_SET;
};

HashMapPrototype.get = function(key, notSetValue) {
    var root = this._root;
    return isNull(root) ? notSetValue : root.get(0, hashCode(key), key);
};

HashMapPrototype.set = function(key, value) {
    var root = this._root,
        size = this._size,
        addedLeaf = new Box(null),
        newRoot = (isNull(root) ? BitmapIndexedNode.EMPTY : root).set(0, hashCode(key), key, value, addedLeaf),
        map;

    if (newRoot === root) {
        return this;
    } else {
        map = new HashMap(INTERNAL_CREATE);
        map._size = isNull(addedLeaf.value) ? size : size + 1;
        map._root = newRoot;
        return freeze(map);
    }
};

HashMapPrototype.remove = function(key) {
    var root = this._root,
        size = this._size,
        newRoot;

    if (isNull(root)) {
        return this;
    } else if (size === 1) {
        return EMPTY_MAP;
    } else {
        newRoot = root.remove(0, hashCode(key), key);

        if (newRoot === root) {
            return this;
        } else {
            map = new HashMap(INTERNAL_CREATE);
            map._size = size - 1;
            map._root = newRoot;
            return freeze(map);
        }
    }
};

function hasNext() {
    return false;
}

function next() {
    return new IteratorValue(undefined, true);
}

HashMapPrototype.iterator = function(reverse) {
    var root = this._root;

    if (isNull(root)) {
        return new Iterator(hasNext, next);
    } else {
        return root.iterator(reverse);
    }
};

if (ITERATOR_SYMBOL) {
    HashMapPrototype[ITERATOR_SYMBOL] = HashMapPrototype.iterator;
}

function HashMap_every(_this, it, callback) {
    var next = it.next(),
        nextValue;

    while (next.done === false) {
        nextValue = next.value;
        if (!callback(nextValue[1], nextValue[0], _this)) {
            return false;
        }
        next = it.next();
    }

    return true;
}

HashMapPrototype.every = function(callback, thisArg) {
    return HashMap_every(this, this.iterator(), isUndefined(thisArg) ? callback : fastBindThis(callback, thisArg, 3));
};

function HashMap_filter(_this, it, callback) {
    var results = [],
        next = it.next(),
        index = 0,
        nextValue, key, value;

    while (next.done === false) {
        nextValue = next.value;
        key = nextValue[0];
        value = nextValue[1];

        if (callback(value, key, _this)) {
            results[index++] = key;
            results[index++] = value;
        }

        next = it.next();
    }

    return HashMap.of(results);
}

HashMapPrototype.filter = function(callback, thisArg) {
    return HashMap_filter(this, this.iterator(), isUndefined(thisArg) ? callback : fastBindThis(callback, thisArg, 3));
};

function HashMap_forEach(_this, it, callback) {
    var next = it.next(),
        nextValue;

    while (next.done === false) {
        nextValue = next.value;
        if (callback(nextValue[1], nextValue[0], _this) === false) {
            break;
        }
        next = it.next();
    }

    return _this;
}

HashMapPrototype.forEach = function(callback, thisArg) {
    return HashMap_forEach(this, this.iterator(), isUndefined(thisArg) ? callback : fastBindThis(callback, thisArg, 3));
};

HashMapPrototype.each = HashMapPrototype.forEach;

function HashMap_forEachRight(_this, it, callback) {
    var next = it.next(),
        nextValue;

    while (next.done === false) {
        nextValue = next.value;
        if (callback(nextValue[1], nextValue[0], _this) === false) {
            break;
        }
        next = it.next();
    }

    return _this;
}

HashMapPrototype.forEachRight = function(callback, thisArg) {
    return HashMap_forEachRight(this, this.iterator(true), isUndefined(thisArg) ? callback : fastBindThis(callback, thisArg, 3));
};

HashMapPrototype.eachRight = HashMapPrototype.forEachRight;

function HashMap_map(_this, it, callback) {
    var next = it.next(),
        results = new Array(_this._size * 2),
        index = 0,
        nextValue, key;

    while (next.done === false) {
        nextValue = next.value;
        key = nextValue[0];
        results[index++] = key;
        results[index++] = callback(nextValue[1], key, _this);
        next = it.next();
    }

    return HashMap.of(results);
}

HashMapPrototype.map = function(callback, thisArg) {
    return HashMap_map(this, this.iterator(), isUndefined(thisArg) ? callback : fastBindThis(callback, thisArg, 3));
};

function HashMap_reduce(_this, it, callback, initialValue) {
    var next = it.next(),
        value = initialValue,
        nextValue, key;

    if (isUndefined(value)) {
        nextValue = next.value;
        key = nextValue[0];
        value = nextValue[1];
        next = it.next();
    }

    while (next.done === false) {
        nextValue = next.value;
        value = callback(value, nextValue[1], key, _this);
        next = it.next();
    }

    return value;
}

HashMapPrototype.reduce = function(callback, initialValue, thisArg) {
    return HashMap_reduce(this, this.iterator(), isUndefined(thisArg) ? callback : fastBindThis(callback, thisArg, 4), initialValue);
};

function HashMap_reduceRight(_this, it, callback, initialValue) {
    var next = it.next(),
        value = initialValue,
        nextValue, key;

    if (isUndefined(value)) {
        nextValue = next.value;
        key = nextValue[0];
        value = nextValue[1];
        next = it.next();
    }

    while (next.done === false) {
        nextValue = next.value;
        value = callback(value, nextValue[1], key, _this);
        next = it.next();
    }

    return value;
}

HashMapPrototype.reduceRight = function(callback, initialValue, thisArg) {
    return HashMap_reduceRight(this, this.iterator(true), isUndefined(thisArg) ? callback : fastBindThis(callback, thisArg, 4), initialValue);
};

function HashMap_some(_this, it, callback) {
    var next = it.next(),
        nextValue;

    while (next.done === false) {
        nextValue = next.value;

        if (callback(nextValue[1], nextValue[0], _this)) {
            return true;
        }
        next = it.next();
    }

    return false;
}

HashMapPrototype.some = function(callback, thisArg) {
    return HashMap_some(this, this.iterator(), isUndefined(thisArg) ? callback : fastBindThis(callback, thisArg, 3));
};

HashMapPrototype.toArray = function() {
    var it = this.iterator(),
        next = it.next(),
        results = new Array(this._size * 2),
        index = 0;

    while (next.done === false) {
        nextValue = next.value;
        results[index++] = nextValue[0];
        results[index++] = nextValue[1];
        next = it.next();
    }

    return results;
};

HashMapPrototype.toObject = function() {
    var it = this.iterator(),
        results = {},
        step;

    while ((step = it.next()).done === false) {
        nextValue = step.value;
        results[nextValue[0]] = nextValue[1];
    }

    return results;
};

HashMap.fromJSON = HashMap.fromObject;
HashMapPrototype.toJSON = HashMapPrototype.toObject;

HashMapPrototype.join = function(separator, keyValueSeparator) {
    var it = this.iterator(),
        next = it.next(),
        result = "";

    separator = separator || ", ";
    keyValueSeparator = keyValueSeparator || ": ";

    while (!next.done) {
        nextValue = next.value;
        next = it.next();

        if (next.done) {
            result += nextValue[0] + keyValueSeparator + nextValue[1];
            break;
        } else {
            result += nextValue[0] + keyValueSeparator + nextValue[1] + separator;
        }
    }

    return result;
};

HashMapPrototype.toString = function() {
    return "{" + this.join() + "}";
};

HashMapPrototype.inspect = HashMapPrototype.toString;

function HashMap_equal(ait, bit) {
    var anext = ait.next(),
        bnext = bit.next(),
        anextValue, bnextValue;

    while (anext.done === false) {
        anextValue = anext.value;
        bnextValue = bnext.value;

        if (!isEqual(anextValue[0], bnextValue[0]) || !isEqual(anextValue[1], bnextValue[1])) {
            return false;
        }

        anext = ait.next();
        bnext = bit.next();
    }

    return true;
}

HashMap.equal = function(a, b) {
    if (a === b) {
        return true;
    } else if (!a || !b || a._size !== b._size) {
        return false;
    } else {
        return HashMap_equal(a.iterator(), b.iterator());
    }
};

HashMapPrototype.equals = function(b) {
    return HashMap.equal(this, b);
};
},
function(require, exports, module, undefined, global) {
/*@=-@nathanfaucett/immutable-hash_map@0.0.3/src/Box.js-=@*/
module.exports = Box;


function Box(value) {
    this.value = value;
}
},
function(require, exports, module, undefined, global) {
/*@=-@nathanfaucett/immutable-hash_map@0.0.3/src/Iterator.js-=@*/
var inherits = require(42),
    BaseIterator = require(12);


module.exports = Iterator;


function Iterator(hasNext, next) {
    this.hasNext = hasNext;
    this.next = next;
}
inherits(Iterator, BaseIterator);
},
function(require, exports, module, undefined, global) {
/*@=-@nathanfaucett/immutable-hash_map@0.0.3/src/BitmapIndexedNode.js-=@*/
var isNull = require(8),
    isEqual = require(17),
    hashCode = require(32),
    bitCount = require(50),
    consts = require(78),
    bitpos = require(79),
    arrayCopy = require(53),
    cloneAndSet = require(80),
    removePair = require(81),
    mask = require(82),
    nodeIterator = require(83),
    ArrayNode, createNode;


var baseArrayCopy = arrayCopy.base,
    SHIFT = consts.SHIFT,
    MAX_BITMAP_INDEXED_SIZE = consts.MAX_BITMAP_INDEXED_SIZE,
    EMPTY = new BitmapIndexedNode(0, []),
    BitmapIndexedNodePrototype = BitmapIndexedNode.prototype;


module.exports = BitmapIndexedNode;


ArrayNode = require(84);
createNode = require(85);


function BitmapIndexedNode(bitmap, array) {
    this.bitmap = bitmap;
    this.array = array;
}

BitmapIndexedNode.EMPTY = EMPTY;

BitmapIndexedNodePrototype.get = function(shift, keyHash, key, notSetValue) {
    var bitmap = this.bitmap,
        bit = bitpos(keyHash, shift),
        array, index, keyOrNull, valueOrNode;

    if ((bitmap & bit) === 0) {
        return notSetValue;
    } else {
        array = this.array;
        index = getIndex(bitmap, bit);

        keyOrNull = array[2 * index];
        valueOrNode = array[2 * index + 1];

        if (isNull(keyOrNull)) {
            return valueOrNode.get(shift + SHIFT, keyHash, key, notSetValue);
        } else {
            if (isEqual(key, keyOrNull)) {
                return valueOrNode;
            } else {
                return notSetValue;
            }
        }
    }
};

BitmapIndexedNodePrototype.set = function(shift, keyHash, key, value, addedLeaf) {
    var array = this.array,
        bitmap = this.bitmap,
        bit = bitpos(keyHash, shift),
        index = getIndex(bitmap, bit),
        keyOrNull, valueOrNode, newNode, nodes, jIndex, i, j, newArray;

    if ((bitmap & bit) !== 0) {
        keyOrNull = array[2 * index];
        valueOrNode = array[2 * index + 1];

        if (isNull(keyOrNull)) {
            newNode = valueOrNode.set(shift + SHIFT, keyHash, key, value, addedLeaf);

            if (newNode === valueOrNode) {
                return this;
            } else {
                return new BitmapIndexedNode(bitmap, cloneAndSet(array, 2 * index + 1, newNode));
            }
        }
        if (isEqual(key, keyOrNull)) {
            if (value === valueOrNode) {
                return this;
            } else {
                return new BitmapIndexedNode(bitmap, cloneAndSet(array, 2 * index + 1, value));
            }
        }
        addedLeaf.value = addedLeaf;
        return new BitmapIndexedNode(bitmap,
            cloneAndSet(array,
                2 * index, null,
                2 * index + 1, createNode(shift + SHIFT, keyOrNull, valueOrNode, keyHash, key, value)));
    } else {
        newNode = bitCount(bitmap);

        if (newNode >= MAX_BITMAP_INDEXED_SIZE) {
            nodes = new Array(32);
            jIndex = mask(keyHash, shift);
            nodes[jIndex] = EMPTY.set(shift + SHIFT, keyHash, key, value, addedLeaf);

            i = -1;
            j = 0;
            while (i++ < 31) {
                if (((bitmap >>> i) & 1) !== 0) {
                    if (array[j] == null) {
                        nodes[i] = array[j + 1];
                    } else {
                        nodes[i] = EMPTY.set(shift + SHIFT, hashCode(array[j]), array[j], array[j + 1], addedLeaf);
                    }
                    j += 2;
                }
            }

            return new ArrayNode(newNode + 1, nodes);
        } else {
            newArray = new Array(2 * (newNode + 1));
            baseArrayCopy(array, 0, newArray, 0, 2 * index);

            newArray[2 * index] = key;
            addedLeaf.value = addedLeaf;
            newArray[2 * index + 1] = value;

            baseArrayCopy(array, 2 * index, newArray, 2 * (index + 1), 2 * (newNode - index));

            return new BitmapIndexedNode(bitmap | bit, newArray);
        }
    }
};

BitmapIndexedNodePrototype.remove = function(shift, keyHash, key) {
    var bitmap = this.bitmap,
        bit = bitpos(keyHash, shift),
        index, array, newNode;

    if ((bitmap & bit) === 0) {
        return this;
    } else {
        index = getIndex(bitmap, bit);
        array = this.array;

        keyOrNull = array[2 * index];
        valueOrNode = array[2 * index + 1];

        if (isNull(keyOrNull)) {
            newNode = valueOrNode.remove(shift + SHIFT, keyHash, key);

            if (newNode === valueOrNode) {
                return this;
            } else if (!isNull(newNode)) {
                return new BitmapIndexedNode(bitmap, cloneAndSet(array, 2 * index + 1, newNode));
            } else if (bitmap === bit) {
                return null;
            } else {
                return new BitmapIndexedNode(bitmap ^ bit, removePair(array, index));
            }
        } else {
            if (isEqual(key, keyOrNull)) {
                return new BitmapIndexedNode(bitmap ^ bit, removePair(array, index));
            } else {
                return this;
            }
        }
    }
};

BitmapIndexedNodePrototype.iterator = nodeIterator;

function getIndex(bitmap, bit) {
    return bitCount(bitmap & (bit - 1));
}
},
function(require, exports, module, undefined, global) {
/*@=-@nathanfaucett/immutable-hash_map@0.0.3/src/consts.js-=@*/
var consts = exports;


consts.SHIFT = 5;
consts.SIZE = 1 << consts.SHIFT;
consts.MASK = consts.SIZE - 1;

consts.MAX_ARRAY_MAP_SIZE = consts.SIZE / 4;
consts.MAX_BITMAP_INDEXED_SIZE = consts.SIZE / 2;
},
function(require, exports, module, undefined, global) {
/*@=-@nathanfaucett/immutable-hash_map@0.0.3/src/bitpos.js-=@*/
var mask = require(82);


module.exports = bitpos;


function bitpos(hashCode, shift) {
    return 1 << mask(hashCode, shift);
}
},
function(require, exports, module, undefined, global) {
/*@=-@nathanfaucett/immutable-hash_map@0.0.3/src/cloneAndSet.js-=@*/
var isUndefined = require(9),
    arrayCopy = require(53);


var baseArrayCopy = arrayCopy.base;


module.exports = cloneAndSet;


function cloneAndSet(array, index0, value0, index1, value1) {
    var length = array.length,
        results = new Array(length);

    baseArrayCopy(array, 0, results, 0, length);

    results[index0] = value0;
    if (!isUndefined(index1)) {
        results[index1] = value1;
    }

    return results;
}
},
function(require, exports, module, undefined, global) {
/*@=-@nathanfaucett/immutable-hash_map@0.0.3/src/removePair.js-=@*/
var arrayCopy = require(53);


var baseArrayCopy = arrayCopy.base;


module.exports = removePair;


function removePair(array, index) {
    var length = array.length,
        newArray = new Array(length - 2);

    baseArrayCopy(array, 0, newArray, 0, 2 * index);
    baseArrayCopy(array, 2 * (index + 1), newArray, 2 * index, length - 2 * index);

    return newArray;
}
},
function(require, exports, module, undefined, global) {
/*@=-@nathanfaucett/immutable-hash_map@0.0.3/src/mask.js-=@*/
var consts = require(78);


var MASK = consts.MASK;


module.exports = mask;


function mask(hashCode, shift) {
    return (hashCode >>> shift) & MASK;
}
},
function(require, exports, module, undefined, global) {
/*@=-@nathanfaucett/immutable-hash_map@0.0.3/src/nodeIterator.js-=@*/
var isNull = require(8),
    isUndefined = require(9),
    Iterator = require(76);


var IteratorValue = Iterator.Value;


module.exports = nodeIterator;


function nodeIterator(reverse) {
    if (reverse !== true) {
        return iterator(this);
    } else {
        return iteratorReverse(this);
    }
}

function iterator(_this) {
    var array = _this.array,
        index = 0,
        length = array.length,
        nextIter = null,
        nextEntry = null;

    function advance() {
        var key, iter;

        while (index < length) {
            key = array[index];
            valueOrNode = array[index + 1];
            index += 2;

            if (!isUndefined(key)) {
                nextEntry = [key, valueOrNode];
                return true;
            } else if (!isUndefined(valueOrNode)) {
                iter = valueOrNode.iterator();

                if (!isNull(iter) && iter.hasNext()) {
                    nextIter = iter;
                    return true;
                }
            }
        }

        return false;
    }

    function hasNext() {
        if (!isNull(nextEntry) || !isNull(nextIter)) {
            return true;
        } else {
            return advance();
        }
    }

    function next() {
        var entry = nextEntry;

        if (!isNull(entry)) {
            nextEntry = null;
            return new IteratorValue(entry, false);
        } else if (!isNull(nextIter)) {
            entry = nextIter.next();

            if (!nextIter.hasNext()) {
                nextIter = null;
            }

            return new IteratorValue(entry, false);
        } else if (advance()) {
            return next();
        } else {
            return new IteratorValue(undefined, true);
        }
    }

    return new Iterator(hasNext, next);
}

function iteratorReverse(_this) {
    var array = _this.array,
        length = array.length,
        index = length - 1,
        nextIter = null,
        nextEntry = null;

    function advance() {
        var key, iter;

        while (index > -1) {
            key = array[index - 1];
            valueOrNode = array[index];
            index -= 2;

            if (!isUndefined(key)) {
                nextEntry = [key, valueOrNode];
                return true;
            } else if (!isUndefined(valueOrNode)) {
                iter = valueOrNode.iterator();

                if (!isNull(iter) && iter.hasNext()) {
                    nextIter = iter;
                    return true;
                }
            }
        }

        return false;
    }

    function hasNext() {
        if (!isNull(nextEntry) || !isNull(nextIter)) {
            return true;
        } else {
            return advance();
        }
    }

    function next() {
        var entry = nextEntry;

        if (!isNull(entry)) {
            nextEntry = null;
            return new IteratorValue(entry, false);
        } else if (!isNull(nextIter)) {
            entry = nextIter.next();

            if (!nextIter.hasNext()) {
                nextIter = null;
            }

            return new IteratorValue(entry, false);
        } else if (advance()) {
            return next();
        } else {
            return new IteratorValue(undefined, true);
        }
    }

    return new Iterator(hasNext, next);
}
},
function(require, exports, module, undefined, global) {
/*@=-@nathanfaucett/immutable-hash_map@0.0.3/src/ArrayNode.js-=@*/
var isNull = require(8),
    isNullOrUndefined = require(22),
    consts = require(78),
    mask = require(82),
    cloneAndSet = require(80),
    Iterator = require(76),
    BitmapIndexedNode;


var SHIFT = consts.SHIFT,
    MAX_ARRAY_MAP_SIZE = consts.MAX_ARRAY_MAP_SIZE,
    EMPTY = new ArrayNode(0, []),
    IteratorValue = Iterator.Value,
    ArrayNodePrototype = ArrayNode.prototype;


module.exports = ArrayNode;


BitmapIndexedNode = require(77);


function ArrayNode(count, array) {
    this.count = count;
    this.array = array;
}

ArrayNode.EMPTY = EMPTY;

ArrayNodePrototype.get = function(shift, keyHash, key, notSetValue) {
    var index = mask(keyHash, shift),
        node = this.array[index];

    if (isNullOrUndefined(node)) {
        return notSetValue;
    } else {
        return node.get(shift + SHIFT, hash, key, notSetValue);
    }
};

ArrayNodePrototype.set = function(shift, keyHash, key, value, addedLeaf) {
    var index = mask(keyHash, shift),
        array = this.array,
        count = this.count,
        node = array[index],
        newNode;

    if (isNullOrUndefined(node)) {
        return new ArrayNode(count + 1, cloneAndSet(array, index, BitmapIndexedNode.EMPTY.set(shift + SHIFT, keyHash, key, value, addedLeaf)));
    } else {
        newNode = node.set(shift + SHIFT, keyHash, key, value, addedLeaf);

        if (newNode === node) {
            return this;
        } else {
            return new ArrayNode(count, cloneAndSet(array, index, newNode));
        }
    }
};

ArrayNodePrototype.remove = function(shift, keyHash, key) {
    var index = mask(keyHash, shift),
        array = this.array,
        node = array[index],
        newNode, count;

    if (isNullOrUndefined(node)) {
        return this;
    } else {
        newNode = node.remove(shift + SHIFT, keyHash, key);

        if (newNode === node) {
            return this;
        } else {
            array = this.array;
            count = this.count;

            if (isNull(newNode)) {
                if (count <= MAX_ARRAY_MAP_SIZE) {
                    return pack(array, index);
                } else {
                    return new ArrayNode(count - 1, cloneAndSet(array, index, newNode));
                }
            } else {
                return new ArrayNode(count, cloneAndSet(array, index, newNode));
            }
        }
    }
};

function ArrayNode_iterator(_this) {
    var array = _this.array,
        index = 0,
        length = array.length,
        nestedIter = null;

    function hasNext() {
        var node;

        while (true) {
            if (!isNull(nestedIter)) {
                if (nestedIter.hasNext()) {
                    return true;
                } else {
                    nestedIter = null;
                }
            } else {
                if (index === length) {
                    return false;
                } else {
                    node = array[index];
                    index += 1;

                    if (!isNullOrUndefined(node)) {
                        nestedIter = node.iterator();
                    }
                }
            }
        }
    }

    function next() {
        if (hasNext()) {
            return nestedIter.next();
        } else {
            return new IteratorValue(undefined, true);
        }
    }

    return new Iterator(hasNext, next);
}

function ArrayNode_iteratorReverse(_this) {
    var array = _this.array,
        length = array.length,
        index = length - 1,
        nestedIter = null;

    function hasNext() {
        var node;

        while (true) {
            if (!isNull(nestedIter)) {
                if (nestedIter.hasNext()) {
                    return true;
                } else {
                    nestedIter = null;
                }
            } else {
                if (index === -1) {
                    return false;
                } else {
                    node = array[index];
                    index -= 1;

                    if (!isNullOrUndefined(node)) {
                        nestedIter = node.iterator();
                    }
                }
            }
        }
    }

    function next() {
        if (hasNext()) {
            return nestedIter.next();
        } else {
            return new IteratorValue(undefined, true);
        }
    }

    return new Iterator(hasNext, next);
}

ArrayNodePrototype.iterator = function(reverse) {
    if (reverse !== true) {
        return ArrayNode_iterator(this);
    } else {
        return ArrayNode_iteratorReverse(this);
    }
};

function pack(array, index) {
    var newArray = new Array(2 * (count - 1)),
        j = 1,
        bitmap = 0,
        i = -1,
        il = index - 1;

    while (i++ < il) {
        if (!isNull(array[i])) {
            newArray[j] = array[i];
            bitmap |= 1 << i;
            j += 2;
        }
    }

    i = index - 1;
    il = array.length - 1;
    while (i++ < il) {
        if (!isNull(array[i])) {
            newArray[j] = array[i];
            bitmap |= 1 << i;
            j += 2;
        }
    }

    return new BitmapIndexedNode(bitmap, newArray);
}
},
function(require, exports, module, undefined, global) {
/*@=-@nathanfaucett/immutable-hash_map@0.0.3/src/createNode.js-=@*/
var hashCode = require(32),
    Box = require(75),
    HashCollisionNode, BitmapIndexedNode;


module.exports = createNode;


HashCollisionNode = require(86);
BitmapIndexedNode = require(77);


function createNode(shift, key0, value0, keyHash1, key1, value1) {
    var keyHash0 = hashCode(key0),
        addedLeaf;

    if (keyHash0 === keyHash1) {
        return new HashCollisionNode(keyHash0, 2, [key0, value0, key1, value1]);
    } else {
        addedLeaf = new Box(null);
        return BitmapIndexedNode.EMPTY
            .set(shift, keyHash0, key0, value0, addedLeaf)
            .set(shift, keyHash1, key1, value1, addedLeaf);
    }
}
},
function(require, exports, module, undefined, global) {
/*@=-@nathanfaucett/immutable-hash_map@0.0.3/src/HashCollisionNode.js-=@*/
var isEqual = require(17),
    bitpos = require(79),
    arrayCopy = require(53),
    cloneAndSet = require(80),
    removePair = require(81),
    nodeIterator = require(83),
    BitmapIndexedNode;


var baseArrayCopy = arrayCopy.base,
    EMPTY = new HashCollisionNode(0, []),
    HashCollisionNodePrototype = HashCollisionNode.prototype;


module.exports = HashCollisionNode;


BitmapIndexedNode = require(77);


function HashCollisionNode(keyHash, count, array) {
    this.keyHash = keyHash;
    this.count = count;
    this.array = array;
}

HashCollisionNode.EMPTY = EMPTY;

HashCollisionNodePrototype.get = function(shift, keyHash, key, notSetValue) {
    var array = this.array,
        index = getIndex(array, key);

    if (index === -1) {
        return notFound;
    } else {
        if (isEqual(key, array[index])) {
            return array[index + 1];
        } else {
            return notSetValue;
        }
    }
};

HashCollisionNodePrototype.set = function(shift, keyHash, key, value, addedLeaf) {
    var index, count, array, newArray;

    if (keyHash === this.keyHash) {
        array = this.array;
        count = this.count,
            index = getIndex(array, key);

        if (index !== -1) {
            if (array[index + 1] === value) {
                return this;
            } else {
                return new HashCollisionNode(keyHash, count, cloneAndSet(array, index + 1, value));
            }
        } else {
            newArray = new Array(2 * (count + 1));
            baseArrayCopy(array, 0, newArray, 0, 2 * count);
            newArray[2 * count] = key;
            newArray[2 * count + 1] = value;
            addedLeaf.value = addedLeaf;
            return new HashCollisionNode(keyHash, count + 1, newArray);
        }
    } else {
        return new BitmapIndexedNode(bitpos(this.keyHash, shift), [null, this]).set(shift, keyHash, key, value, addedLeaf);
    }
};

HashCollisionNodePrototype.remove = function(shift, keyHash, key) {
    var array = this.array,
        index = getIndex(array, key);

    if (index === -1) {
        return this;
    } else {
        if (array.length === 1) {
            return null;
        } else {
            return new HashCollisionNode(hash, count - 1, removePair(array, index / 2));
        }
    }
};

HashCollisionNodePrototype.iterator = nodeIterator;

function getIndex(array, key) {
    var i = -1,
        il = array.length - 1;

    while (i++ < il) {
        if (isEqual(array[i], key)) {
            return i;
        }
    }

    return -1;
}
}], {}, void(0), (new Function("return this;"))()));
