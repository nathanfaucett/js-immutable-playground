(function(dependencies, undefined, global) {
    var cache = [];

    function require(index) {
        var module = cache[index],
            callback, exports;

        if (module !== undefined) {
            return module.exports;
        } else {
            callback = dependencies[index];
            exports = {};

            cache[index] = module = {
                exports: exports,
                require: require
            };

            callback.call(exports, require, exports, module, global);
            return module.exports;
        }
    }

    require.resolve = function(path) {
        return path;
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
function(require, exports, module, global) {

global.ImmutableList = require(1);
global.ImmutableVector = require(22);
global.ImmutableMap = require(23);
global.ImmutableSet = require(46);


},
function(require, exports, module, global) {

var isNull = require(2),
    isUndefined = require(3),
    isArrayLike = require(4),
    fastBindThis = require(10),
    fastSlice = require(11),
    defineProperty = require(13),
    isEqual = require(21);


var INTERNAL_CREATE = {},

    ITERATOR_SYMBOL = typeof(Symbol) === "function" ? Symbol.iterator : false,
    IS_LIST = "__ImmutableList__",

    EMPTY_LIST = new List(INTERNAL_CREATE),

    ListPrototype = List.prototype;


module.exports = List;


function List(value) {
    if (!(this instanceof List)) {
        throw new Error("List() must be called with new");
    }

    this.__size = 0;
    this.__root = null;
    this.__tail = null;

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
            _this.__root = _this.__tail = new Node(value, null);
            _this.__size = 1;
            return _this;
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

    _this.__size = length;
    _this.__root = root;
    _this.__tail = tail;

    return _this;
}

List.of = function(value) {
    if (arguments.length > 0) {
        return List_createList(new List(INTERNAL_CREATE), value, arguments);
    } else {
        return EMPTY_LIST;
    }
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
    return this.__size;
};

if (defineProperty.hasGettersSetters) {
    defineProperty(ListPrototype, "length", {
        get: ListPrototype.size
    });
}

ListPrototype.count = ListPrototype.size;

ListPrototype.isEmpty = function() {
    return this.__size === 0;
};

function List_get(_this, index) {
    if (index === 0) {
        return _this.__root;
    } else if (index === _this.__size - 1) {
        return _this.__tail;
    } else {
        return findNode(_this.__root, index);
    }
}

ListPrototype.get = function(index) {
    if (index < 0 || index >= this.__size) {
        return undefined;
    } else {
        return List_get(this, index).value;
    }
};

ListPrototype.nth = ListPrototype.get;

ListPrototype.first = function() {
    var node = this.__root;

    if (isNull(node)) {
        return undefined;
    } else {
        return node.value;
    }
};

ListPrototype.last = function() {
    var node = this.__tail;

    if (isNull(node)) {
        return undefined;
    } else {
        return node.value;
    }
};

ListPrototype.indexOf = function(value) {
    var node = this.__root,
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
        root = copyFromTo(_this.__root, node, newNode),
        tail = isNull(node.next) ? newNode : _this.__tail;

    list.__size = _this.__size;
    list.__root = root;
    list.__tail = tail;

    return list;
}

ListPrototype.set = function(index, value) {
    var node;

    if (index < 0 || index >= this.__size) {
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

        oldRoot = _this.__root,
        parent = oldRoot !== node ? findParent(oldRoot, node) : null,

        length = values.length,

        tail = new Node(values[length - 1], node),
        first = insertCreateNodes(values, 0, length - 1, tail),

        root = isNull(parent) ? first : copyFromTo(oldRoot, node, first);

    list.__size = _this.__size + length;
    list.__root = root;
    list.__tail = tail;

    return list;
}

ListPrototype.insert = function(index) {
    if (index < 0 || index >= this.__size) {
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
        root = copyFromTo(_this.__root, node, next),
        tail = isNull(next) ? _this.__tail : next;

    list.__size = _this.__size - count;
    list.__root = root;
    list.__tail = tail;

    return list;
}

ListPrototype.remove = function(index, count) {
    var size = this.__size,
        node;

    count = count || 1;

    if (index < 0 || index >= size) {
        throw new Error("List remove(index[, count=1]) index out of bounds");
    } else if (count > 0) {
        node = List_get(this, index);

        if (node === this.__root && count === size) {
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
        root = _this.__root,
        tail = _this.__tail,
        size = _this.__size,
        length = values.length,
        il = length - 1,
        i;

    if (isNull(tail)) {
        i = 0;
        root = tail = new Node(values[i], null);
    } else {
        i = -1;
    }

    while (i++ < il) {
        root = new Node(values[i], root);
    }

    list.__size = length + size;
    list.__root = root;
    list.__tail = tail;

    return list;
}

ListPrototype.conj = function() {
    if (arguments.length !== 0) {
        return List_conj(this, arguments);
    } else {
        return this;
    }
};

ListPrototype.unshift = ListPrototype.conj;

function List_pop(_this) {
    var list = new List(INTERNAL_CREATE),
        root = _this.__root,
        tail = _this.__tail,
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

    list.__size = _this.__size - 1;
    list.__root = newRoot;
    list.__tail = newTail;

    return list;
}

ListPrototype.pop = function() {
    var size = this.__size;

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

    list.__size = _this.__size - 1;
    list.__root = _this.__root.next;
    list.__tail = _this.__tail;

    return list;
}

ListPrototype.shift = function() {
    var size = this.__size;

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

        oldRoot = _this.__root,

        tail = new Node(values[length - 1], null),
        first = length !== 1 ? pushCreateNodes(values, length - 1, tail) : tail,

        root = isNull(oldRoot) ? first : copyNodes(oldRoot, first);

    list.__size = _this.__size + length;
    list.__root = root;
    list.__tail = tail;

    return list;
}

ListPrototype.push = function() {
    var length = arguments.length;

    if (length !== 0) {
        return List_push(this, arguments, length);
    } else {
        return this;
    }
};

function List_concat(a, b) {
    var asize = a.__size,
        bsize = b.__size,
        root, tail, list;

    if (asize === 0) {
        return b;
    } else if (bsize === 0) {
        return a;
    } else {
        root = copyNodes(a.__root, b.__root);
        tail = b.__tail;

        list = new List(INTERNAL_CREATE);
        list.__size = asize + bsize;
        list.__root = root;
        list.__tail = tail;
        return list;
    }
}

ListPrototype.concat = function() {
    var length = arguments.length,
        i, il, list;

    if (length !== 0) {
        i = -1;
        il = length - 1;
        list = this;

        while (i++ < il) {
            list = List_concat(list, arguments[i]);
        }

        return list;
    } else {
        return this;
    }
};

function ListIteratorValue(done, value) {
    this.done = done;
    this.value = value;
}

function ListIterator(next) {
    this.next = next;
}

function List_iterator(_this) {
    var node = _this.__root;

    return new ListIterator(function next() {
        var value;

        if (isNull(node)) {
            return new ListIteratorValue(true, undefined);
        } else {
            value = node.value;
            node = node.next;

            return new ListIteratorValue(false, value);
        }
    });
}

function List_iteratorReverse(_this) {
    var root = _this.__root,
        node = _this.__tail;

    return new ListIterator(function next() {
        var value;

        if (isNull(node)) {
            return new ListIteratorValue(true, undefined);
        } else {
            value = node.value;
            node = root !== node ? findParent(root, node) : null;

            return new ListIteratorValue(false, value);
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
        index = _this.__size;

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
        results = new Array(_this.__size),
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
        index = _this.__size;

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
    var array = new Array(this.__size),
        node = this.__root,
        i = 0;

    while (!isNull(node)) {
        array[i++] = node.value;
        node = node.next;
    }

    return array;
};

ListPrototype.join = function(separator) {
    var result = "",
        node = this.__root,
        value;

    separator = separator || " ";

    while (true) {
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
    } else if (!a || !b || a.__size !== b.__size) {
        return false;
    } else {
        a = a.__root;
        b = b.__root;

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
function(require, exports, module, global) {

module.exports = isNull;


function isNull(value) {
    return value === null;
}


},
function(require, exports, module, global) {

module.exports = isUndefined;


function isUndefined(value) {
    return value === void(0);
}


},
function(require, exports, module, global) {

var isLength = require(5),
    isFunction = require(7),
    isObject = require(8);


module.exports = isArrayLike;


function isArrayLike(value) {
    return !isFunction(value) && isObject(value) && isLength(value.length);
}


},
function(require, exports, module, global) {

var isNumber = require(6);


var MAX_SAFE_INTEGER = Math.pow(2, 53) - 1;


module.exports = isLength;


function isLength(value) {
    return isNumber(value) && value > -1 && value % 1 === 0 && value <= MAX_SAFE_INTEGER;
}


},
function(require, exports, module, global) {

module.exports = isNumber;


function isNumber(value) {
    return typeof(value) === "number" || false;
}


},
function(require, exports, module, global) {

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
function(require, exports, module, global) {

var isNullOrUndefined = require(9);


module.exports = isObject;


function isObject(value) {
    var type = typeof(value);
    return type === "function" || (!isNullOrUndefined(value) && type === "object") || false;
}


},
function(require, exports, module, global) {

var isNull = require(2),
    isUndefined = require(3);


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
function(require, exports, module, global) {

var isNumber = require(6);


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
function(require, exports, module, global) {

var clamp = require(12),
    isNumber = require(6);


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
function(require, exports, module, global) {

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
function(require, exports, module, global) {

var isObject = require(8),
    isFunction = require(7),
    isPrimitive = require(14),
    isNative = require(15),
    has = require(19);


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
        var object = {};
        try {
            nativeDefineProperty(object, "key", {
                value: "value"
            });
            if (has(object, "key") && object.key === "value") {
                return true;
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
function(require, exports, module, global) {

var isNullOrUndefined = require(9);


module.exports = isPrimitive;


function isPrimitive(obj) {
    var typeStr;
    return isNullOrUndefined(obj) || ((typeStr = typeof(obj)) !== "object" && typeStr !== "function") || false;
}


},
function(require, exports, module, global) {

var isFunction = require(7),
    isNullOrUndefined = require(9),
    escapeRegExp = require(16);


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
function(require, exports, module, global) {

var toString = require(17);


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
function(require, exports, module, global) {

var isString = require(18),
    isNullOrUndefined = require(9);


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
function(require, exports, module, global) {

module.exports = isString;


function isString(value) {
    return typeof(value) === "string" || false;
}


},
function(require, exports, module, global) {

var isNative = require(15),
    getPrototypeOf = require(20),
    isNullOrUndefined = require(9);


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
        return nativeHasOwnProp.call(object, key);
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
function(require, exports, module, global) {

var isObject = require(8),
    isNative = require(15),
    isNullOrUndefined = require(9);


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
function(require, exports, module, global) {

module.exports = isEqual;


function isEqual(a, b) {
    return !(a !== b && !(a !== a && b !== b));
}


},
function(require, exports, module, global) {

var isNull = require(2),
    isUndefined = require(3),
    isArrayLike = require(4),
    fastBindThis = require(10),
    fastSlice = require(11),
    defineProperty = require(13),
    isEqual = require(21);


var INTERNAL_CREATE = {},

    ITERATOR_SYMBOL = typeof(Symbol) === "function" ? Symbol.iterator : false,
    IS_VECTOR = "__ImmutableVector__",

    SHIFT = 5,
    SIZE = 1 << SHIFT,
    MASK = SIZE - 1,

    EMPTY_ARRAY = createArray(),
    EMPTY_NODE = createNode(),
    EMPTY_VECTOR = new Vector(INTERNAL_CREATE),

    VectorPrototype = Vector.prototype;


module.exports = Vector;


function Vector(value) {
    if (!(this instanceof Vector)) {
        throw new Error("Vector() must be called with new");
    }

    this.__root = EMPTY_NODE;
    this.__tail = EMPTY_ARRAY;
    this.__size = 0;
    this.__shift = SHIFT;

    if (value !== INTERNAL_CREATE) {
        return Vector_createVector(this, value, arguments);
    } else {
        return this;
    }
}

function Vector_createVector(_this, value, args) {
    var length = args.length,
        tail;

    if (length > 32) {
        return Vector_conjArray(_this, args);
    } else if (length > 1) {
        _this.__tail = copyArray(args, createArray(), length);
        _this.__size = length;
        return _this;
    } else if (length === 1) {
        if (isVector(value)) {
            return value;
        } else if (isArrayLike(value)) {
            return Vector_conjArray(_this, value.toArray ? value.toArray() : value);
        } else {
            tail = _this.__tail = createArray();
            tail[0] = value;
            _this.__size = 1;
            return _this;
        }
    } else {
        return EMPTY_VECTOR;
    }
}

Vector.of = function(value) {
    if (arguments.length > 0) {
        return Vector_createVector(new Vector(INTERNAL_CREATE), value, arguments);
    } else {
        return EMPTY_VECTOR;
    }
};

function isVector(value) {
    return value && value[IS_VECTOR] === true;
}

Vector.isVector = isVector;

defineProperty(VectorPrototype, IS_VECTOR, {
    configurable: false,
    enumerable: false,
    writable: false,
    value: true
});

VectorPrototype.size = function() {
    return this.__size;
};

if (defineProperty.hasGettersSetters) {
    defineProperty(VectorPrototype, "length", {
        get: VectorPrototype.size
    });
}

VectorPrototype.count = VectorPrototype.size;

VectorPrototype.isEmpty = function() {
    return this.__size === 0;
};

function tailOff(size) {
    if (size < 32) {
        return 0;
    } else {
        return ((size - 1) >>> SHIFT) << SHIFT;
    }
}

function Vector_getNode(_this, index) {
    var node = _this.__root,
        level = _this.__shift;

    while (level > 0) {
        node = node.array[(index >>> level) & MASK];
        level = level - SHIFT;
    }

    return node;
}

function Vector_getArrayFor(_this, index) {
    if (index >= tailOff(_this.__size)) {
        return _this.__tail;
    } else {
        return Vector_getNode(_this, index).array;
    }
}

function Vector_get(_this, index) {
    return Vector_getArrayFor(_this, index)[index & MASK];
}

VectorPrototype.get = function(index) {
    if (index < 0 || index >= this.__size) {
        return undefined;
    } else {
        return Vector_get(this, index);
    }
};

VectorPrototype.nth = VectorPrototype.get;

VectorPrototype.first = function() {
    var size = this.__size;

    if (size === 0) {
        return undefined;
    } else {
        return Vector_get(this, 0);
    }
};

VectorPrototype.last = function() {
    var size = this.__size;

    if (size === 0) {
        return undefined;
    } else {
        return this.__tail[(size - 1) & MASK];
    }
};

VectorPrototype.indexOf = function(value) {
    var size = this.__size,
        i = -1,
        il = size - 1;

    while (i++ < il) {
        if (isEqual(Vector_get(this, i), value)) {
            return i;
        }
    }

    return -1;
};

function newPathSet(node, size, index, value, level) {
    var newNode = cloneNode(node, ((size - 1) >>> level) & MASK),
        subIndex;

    if (level === 0) {
        newNode.array[index & MASK] = value;
    } else {
        subIndex = (index >>> level) & MASK;
        newNode.array[subIndex] = newPathSet(node.array[subIndex], size, index, value, level - SHIFT);
    }

    return newNode;
}

function Vector_set(_this, index, value) {
    var size = _this.__size,
        tail, maskedIndex, vector;

    if (index >= tailOff(size)) {
        tail = _this.__tail;
        maskedIndex = index & MASK;

        if (isEqual(tail[maskedIndex], value)) {
            return _this;
        } else {
            tail = cloneArray(tail, (size + 1) & MASK);
            tail[maskedIndex] = value;
            vector = Vector_clone(_this);
            vector.__tail = tail;
            return vector;
        }
    } else if (isEqual(Vector_get(_this, index), value)) {
        return _this;
    } else {
        vector = Vector_clone(_this);
        vector.__root = newPathSet(_this.__root, size, index, value, _this.__shift);
        return vector;
    }
}

VectorPrototype.set = function(index, value) {
    if (index < 0 || index >= this.__size) {
        throw new Error("Vector set(index, value) index out of bounds");
    } else {
        return Vector_set(this, index, value);
    }
};


function Vector_insert(_this, index, values) {
    var size = _this.__size,
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
    if (index < 0 || index >= this.__size) {
        throw new Error("Vector set(index, value) index out of bounds");
    } else {
        return Vector_insert(this, index, fastSlice(arguments, 1));
    }
};

function Vector_remove(_this, index, count) {
    var size = _this.__size,
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
    var size = this.__size;

    count = count || 1;

    if (index < 0 || index >= size) {
        throw new Error("Vector remove(index[, count=1]) index out of bounds");
    } else if (count > 0) {
        return Vector_remove(this, index, count);
    } else {
        return this;
    }
};

function newPath(node, level) {
    var newNode;

    if (level === 0) {
        return node;
    } else {
        newNode = createNode();
        newNode.array[0] = newPath(node, level - SHIFT);
        return newNode;
    }
}

function pushTail(parentNode, tailNode, size, level) {
    var subIndex = ((size - 1) >>> level) & MASK,
        newNode = cloneNode(parentNode, subIndex),
        nodeToInsert;

    if (level === SHIFT) {
        nodeToInsert = tailNode;
    } else {
        child = parentNode.array[subIndex];

        if (isUndefined(child)) {
            nodeToInsert = newPath(tailNode, level - SHIFT);
        } else {
            nodeToInsert = pushTail(child, tailNode, size, level - SHIFT);
        }
    }

    newNode.array[subIndex] = nodeToInsert;

    return newNode;
}

function Vector_conj(_this, value) {
    var root = _this.__root,
        size = _this.__size,
        shift = _this.__shift,
        tailNode, newShift, newRoot, newTail;

    if (size - tailOff(size) < SIZE) {
        _this.__tail[size & MASK] = value;
    } else {
        tailNode = new Node(_this.__tail);
        newShift = shift;

        if ((size >>> SHIFT) > (1 << shift)) {
            newRoot = createNode();
            newRoot.array[0] = root;
            newRoot.array[1] = newPath(tailNode, shift);
            newShift += SHIFT;
        } else {
            newRoot = pushTail(root, tailNode, size, shift);
        }

        newTail = createArray();
        newTail[0] = value;
        _this.__tail = newTail;

        _this.__root = newRoot;
        _this.__shift = newShift;
    }

    _this.__size = size + 1;

    return _this;
}

function Vector_conjArray(_this, values) {
    var tail = _this.__tail,
        size = _this.__size,
        i = -1,
        il = values.length - 1;

    if (tail === EMPTY_ARRAY) {
        _this.__tail = createArray();
    } else if (size - tailOff(size) < SIZE) {
        _this.__tail = cloneArray(tail, (size + 1) & MASK);
    }

    while (i++ < il) {
        Vector_conj(_this, values[i]);
    }

    return _this;
}

function Vector_clone(_this) {
    var vector = new Vector(INTERNAL_CREATE);
    vector.__root = _this.__root;
    vector.__tail = _this.__tail;
    vector.__size = _this.__size;
    vector.__shift = _this.__shift;
    return vector;
}

VectorPrototype.conj = function() {
    if (arguments.length !== 0) {
        return Vector_conjArray(Vector_clone(this), arguments);
    } else {
        return this;
    }
};

VectorPrototype.push = VectorPrototype.conj;

function Vector_concat(a, b) {
    var asize = a.__size,
        bsize = b.__size;

    if (asize === 0) {
        return b;
    } else if (bsize === 0) {
        return a;
    } else {
        return Vector_conjArray(Vector_clone(a), b.toArray());
    }
}

VectorPrototype.concat = function() {
    var length = arguments.length,
        i, il, vector;

    if (length !== 0) {
        i = -1;
        il = length - 1;
        vector = this;

        while (i++ < il) {
            vector = Vector_concat(vector, arguments[i]);
        }

        return vector;
    } else {
        return this;
    }
};

function Vector_unshift(_this, values) {
    var size = _this.__size,
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

VectorPrototype.unshift = function() {
    if (arguments.length !== 0) {
        return Vector_unshift(this, arguments);
    } else {
        return this;
    }
};

function popTail(node, size, level) {
    var subIndex = ((size - 2) >>> level) & MASK,
        newChild, newNode;

    if (level > 5) {
        newChild = popTail(node.array[subIndex], size, level - SHIFT);

        if (isUndefined(newChild) && subIndex === 0) {
            return null;
        } else {
            newNode = cloneNode(node, subIndex);
            newNode.array[subIndex] = newChild;
            return newNode;
        }
    } else if (subIndex === 0) {
        return null;
    } else {
        return cloneNode(node, subIndex);
    }
}

function Vector_pop(_this) {
    var vector = new Vector(INTERNAL_CREATE),
        size = _this.__size,
        shift, newTail, newRoot, newShift;

    if (size - tailOff(size) > 1) {
        newTail = _this.__tail.slice(0, (size - 1) & MASK);
        newRoot = _this.__root;
        newShift = _this.__shift;
    } else {
        newTail = Vector_getArrayFor(_this, size - 2);

        shift = _this.__shift;
        newRoot = popTail(_this.__root, size, shift);
        newShift = shift;

        if (isNull(newRoot)) {
            newRoot = EMPTY_NODE;
        } else if (shift > SHIFT && isUndefined(newRoot.array[1])) {
            newRoot = newRoot.array[0];
            newShift -= SHIFT;
        }
    }

    vector.__root = newRoot;
    vector.__tail = newTail;
    vector.__size = size - 1;
    vector.__shift = newShift;

    return vector;
}

VectorPrototype.pop = function() {
    var size = this.__size;

    if (size === 0) {
        return this;
    } else if (size === 1) {
        return EMPTY_VECTOR;
    } else {
        return Vector_pop(this);
    }
};

function Vector_shift(_this) {
    var size = _this.__size,
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
    var size = this.__size;

    if (size === 0) {
        return this;
    } else if (size === 1) {
        return EMPTY_VECTOR;
    } else {
        return Vector_shift(this);
    }
};

function VectorIteratorValue(done, value) {
    this.done = done;
    this.value = value;
}

function VectorIterator(next) {
    this.next = next;
}

function Vector_iterator(_this) {
    var index = 0,
        size = _this.__size;

    return new VectorIterator(function next() {
        if (index >= size) {
            return new VectorIteratorValue(true, undefined);
        } else {
            return new VectorIteratorValue(false, Vector_get(_this, index++));
        }
    });
}

function Vector_iteratorReverse(_this) {
    var index = _this.__size - 1;

    return new VectorIterator(function next() {
        if (index < 0) {
            return new VectorIteratorValue(true, undefined);
        } else {
            return new VectorIteratorValue(false, Vector_get(_this, index--));
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
        index = _this.__size;

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
        results = new Array(_this.__size),
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
        index = _this.__size;

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
    var size = this.__size,
        array = new Array(size),
        i = -1,
        il = size - 1;

    while (i++ < il) {
        array[i] = Vector_get(this, i);
    }

    return array;
};

VectorPrototype.join = function(separator) {
    var size = this.__size,
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

Vector.equal = function(a, b) {
    var i;

    if (a === b) {
        return true;
    } else if (!a || !b || a.__size !== b.__size) {
        return false;
    } else {
        i = a.__size;

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

function Node(array) {
    this.array = array;
}

function createNode() {
    return new Node(createArray());
}

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

function copyNode(from, to, length) {
    copyArray(from.array, to.array, length);
    return to;
}

function cloneNode(node, length) {
    return copyNode(node, createNode(), length);
}


},
function(require, exports, module, global) {

var has = require(19),
    isNull = require(2),
    isUndefined = require(3),
    isObject = require(8),
    defineProperty = require(13),
    isEqual = require(21),
    hashCode = require(24),
    isArrayLike = require(4),
    fastBindThis = require(10),
    Box = require(31),
    Iterator = require(32),
    IteratorValue = require(33),
    BitmapIndexedNode = require(34);


var INTERNAL_CREATE = {},

    ITERATOR_SYMBOL = typeof(Symbol) === "function" ? Symbol.iterator : false,
    IS_MAP = "__ImmutableMap__",

    NOT_SET = {},
    EMPTY_MAP = new Map(INTERNAL_CREATE),

    MapPrototype;


module.exports = Map;


function Map(value) {
    if (!(this instanceof Map)) {
        throw new Error("Map() must be called with new");
    }

    this.__size = 0;
    this.__root = null;

    if (value !== INTERNAL_CREATE) {
        return Map_createMap(this, value, arguments);
    } else {
        return this;
    }
}
MapPrototype = Map.prototype;

Map.EMPTY = EMPTY_MAP;

function Map_createMap(_this, value, args) {
    var length = args.length;

    if (length === 1) {
        if (isArrayLike(value)) {
            return Map_fromArray(_this, value.toArray ? value.toArray() : value);
        } else if (isObject(value)) {
            return Map_fromObject(_this, value);
        } else {
            return EMPTY_MAP;
        }
    } else if (length > 1) {
        return Map_fromArray(_this, args);
    } else {
        return EMPTY_MAP;
    }
}

function Map_fromObject(_this, object) {
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
        return _this;
    } else {
        return EMPTY_MAP;
    }
}

function Map_fromArray(_this, array) {
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
        return _this;
    } else {
        return EMPTY_MAP;
    }
}

Map.of = function(value) {
    if (arguments.length > 0) {
        return Map_createMap(new Map(INTERNAL_CREATE), value, arguments);
    } else {
        return EMPTY_MAP;
    }
};

Map.fromArguments = function(args) {
    if (args.length > 0) {
        return Map_createMap(new Map(INTERNAL_CREATE), args[0], args);
    } else {
        return EMPTY_MAP;
    }
};

Map.isMap = function(value) {
    return value && value[IS_MAP] === true;
};

defineProperty(MapPrototype, IS_MAP, {
    configurable: false,
    enumerable: false,
    writable: false,
    value: true
});

MapPrototype.size = function() {
    return this.__size;
};

if (defineProperty.hasGettersSetters) {
    defineProperty(MapPrototype, "length", {
        get: MapPrototype.size
    });
}

MapPrototype.count = MapPrototype.size;

MapPrototype.isEmpty = function() {
    return this.__size === 0;
};

MapPrototype.has = function(key) {
    var root = this.__root;
    return isNull(root) ? false : root.get(0, hashCode(key), key, NOT_SET) !== NOT_SET;
};

MapPrototype.get = function(key) {
    var root = this.__root;
    return isNull(root) ? undefined : root.get(0, hashCode(key), key);
};

MapPrototype.set = function(key, value) {
    var root = this.__root,
        size = this.__size,
        addedLeaf = new Box(null),
        newRoot = (isNull(root) ? BitmapIndexedNode.EMPTY : root).set(0, hashCode(key), key, value, addedLeaf),
        map;

    if (newRoot === root) {
        return this;
    } else {
        map = new Map(INTERNAL_CREATE);
        map.__size = isNull(addedLeaf.value) ? size : size + 1;
        map.__root = newRoot;
        return map;
    }
};

MapPrototype.remove = function(key) {
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
            map = new Map(INTERNAL_CREATE);
            map.__size = size - 1;
            map.__root = newRoot;
            return map;
        }
    }
};

function hasNext() {
    return false;
}

function next() {
    return new IteratorValue(true, undefined);
}

MapPrototype.iterator = function(reverse) {
    var root = this.__root;

    if (isNull(root)) {
        return new Iterator(hasNext, next);
    } else {
        return root.iterator(reverse);
    }
};

if (ITERATOR_SYMBOL) {
    MapPrototype[ITERATOR_SYMBOL] = MapPrototype.iterator;
}

function Map_every(_this, it, callback) {
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

MapPrototype.every = function(callback, thisArg) {
    return Map_every(this, this.iterator(), isUndefined(thisArg) ? callback : fastBindThis(callback, thisArg, 3));
};

function Map_filter(_this, it, callback) {
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

    return Map.of(results);
}

MapPrototype.filter = function(callback, thisArg) {
    return Map_filter(this, this.iterator(), isUndefined(thisArg) ? callback : fastBindThis(callback, thisArg, 3));
};

function Map_forEach(_this, it, callback) {
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

MapPrototype.forEach = function(callback, thisArg) {
    return Map_forEach(this, this.iterator(), isUndefined(thisArg) ? callback : fastBindThis(callback, thisArg, 3));
};

MapPrototype.each = MapPrototype.forEach;

function Map_forEachRight(_this, it, callback) {
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

MapPrototype.forEachRight = function(callback, thisArg) {
    return Map_forEachRight(this, this.iterator(true), isUndefined(thisArg) ? callback : fastBindThis(callback, thisArg, 3));
};

MapPrototype.eachRight = MapPrototype.forEachRight;

function Map_map(_this, it, callback) {
    var next = it.next(),
        results = new Array(_this.__size * 2),
        index = 0,
        nextValue, key, resultValue;

    while (next.done === false) {
        nextValue = next.value;
        key = nextValue[0];
        resultValue = callback(nextValue[1], key, _this);
        results[index++] = resultValue[0];
        results[index++] = resultValue[1];
        next = it.next();
    }

    return Map.of(results);
}

MapPrototype.map = function(callback, thisArg) {
    return Map_map(this, this.iterator(), isUndefined(thisArg) ? callback : fastBindThis(callback, thisArg, 3));
};

function Map_reduce(_this, it, callback, initialValue) {
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

MapPrototype.reduce = function(callback, initialValue, thisArg) {
    return Map_reduce(this, this.iterator(), isUndefined(thisArg) ? callback : fastBindThis(callback, thisArg, 4), initialValue);
};

function Map_reduceRight(_this, it, callback, initialValue) {
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

MapPrototype.reduceRight = function(callback, initialValue, thisArg) {
    return Map_reduceRight(this, this.iterator(true), isUndefined(thisArg) ? callback : fastBindThis(callback, thisArg, 4), initialValue);
};

function Map_some(_this, it, callback) {
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

MapPrototype.some = function(callback, thisArg) {
    return Map_some(this, this.iterator(), isUndefined(thisArg) ? callback : fastBindThis(callback, thisArg, 3));
};

MapPrototype.toArray = function() {
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

MapPrototype.toObject = function() {
    var it = this.iterator(),
        next = it.next(),
        results = {};

    while (next.done === false) {
        nextValue = next.value;
        results[nextValue[0]] = nextValue[1];
        next = it.next();
    }

    return results;
};

MapPrototype.join = function(separator, keyValueSeparator) {
    var it = this.iterator(),
        next = it.next(),
        result = "";

    separator = separator || ", ";
    keyValueSeparator = keyValueSeparator || ": ";

    while (true) {
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

MapPrototype.toString = function() {
    return "{" + this.join() + "}";
};

MapPrototype.inspect = MapPrototype.toString;

function Map_equal(ait, bit) {
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

Map.equal = function(a, b) {
    if (a === b) {
        return true;
    } else if (!a || !b || a.__size !== b.__size) {
        return false;
    } else {
        return Map_equal(a.iterator(), b.iterator());
    }
};

MapPrototype.equals = function(b) {
    return Map.equal(this, b);
};


},
function(require, exports, module, global) {

var WeakMapPolyfill = require(25),
    isNumber = require(6),
    isString = require(18),
    isFunction = require(7),
    isBoolean = require(27),
    isNullOrUndefined = require(9),
    numberHashCode = require(28),
    booleanHashCode = require(29),
    stringHashCode = require(30);


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
function(require, exports, module, global) {

var isNative = require(15),
    isPrimitive = require(14),
    createStore = require(26);


var NativeWeakMap = typeof(WeakMap) !== "undefined" ? WeakMap : null,
    WeakMapPolyfill, WeakMapPolyfillPrototype;


if (isNative(NativeWeakMap)) {
    WeakMapPolyfill = NativeWeakMap;
    WeakMapPolyfillPrototype = WeakMapPolyfill.prototype;
} else {
    WeakMapPolyfill = function WeakMap() {
        if (!(this instanceof WeakMap)) {
            throw new TypeError("Constructor WeakMap requires 'new'");
        } else {
            this.__store = createStore();
        }
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
function(require, exports, module, global) {

var has = require(19),
    defineProperty = require(13),
    isPrimitive = require(14);


var emptyStore = {
    value: undefined
};


module.exports = createStore;


function createStore() {
    var privateKey = {};

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
            return store !== emptyStore ? store.remove() : false;
        },
        clear: function() {
            privateKey = {};
        }
    };
}

function privateStore(key, privateKey) {
    var valueOf = key.valueOf || Object.prototype.valueOf,
        store = {
            identity: privateKey,
            remove: function() {
                key.valueOf = valueOf;
                return delete store.value;
            }
        };

    defineProperty(key, "valueOf", {
        value: function(value) {
            return value !== privateKey ? valueOf.apply(this, arguments) : store;
        },
        configurable: true,
        enumerable: false,
        writable: true
    });

    return store;
}


},
function(require, exports, module, global) {

module.exports = isBoolean;


function isBoolean(value) {
    return typeof(value) === "boolean" || false;
}


},
function(require, exports, module, global) {

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
function(require, exports, module, global) {

module.exports = booleanHashCode;


function booleanHashCode(bool) {
    if (bool !== false) {
        return 1231;
    } else {
        return 1237;
    }
}


},
function(require, exports, module, global) {

var isUndefined = require(3);


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
function(require, exports, module, global) {

module.exports = Box;


function Box(value) {
    this.value = value;
}


},
function(require, exports, module, global) {

module.exports = Iterator;


function Iterator(hasNext, next) {
    this.hasNext = hasNext;
    this.next = next;
}


},
function(require, exports, module, global) {

module.exports = IteratorValue;


function IteratorValue(done, value) {
    this.done = done;
    this.value = value;
}


},
function(require, exports, module, global) {

var isNull = require(2),
    isEqual = require(21),
    hashCode = require(24),
    consts = require(35),
    bitpos = require(36),
    copyArray = require(38),
    cloneAndSet = require(39),
    removePair = require(40),
    mask = require(37),
    bitCount = require(41),
    nodeIterator = require(42),
    ArrayNode, createNode;


var SHIFT = consts.SHIFT,
    MAX_BITMAP_INDEXED_SIZE = consts.MAX_BITMAP_INDEXED_SIZE,
    EMPTY = new BitmapIndexedNode(0, []),
    BitmapIndexedNodePrototype = BitmapIndexedNode.prototype;


module.exports = BitmapIndexedNode;


ArrayNode = require(43);
createNode = require(44);


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
            copyArray(array, 0, newArray, 0, 2 * index);

            newArray[2 * index] = key;
            addedLeaf.value = addedLeaf;
            newArray[2 * index + 1] = value;

            copyArray(array, 2 * index, newArray, 2 * (index + 1), 2 * (newNode - index));

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
function(require, exports, module, global) {

var consts = exports;


consts.SHIFT = 5;
consts.SIZE = 1 << consts.SHIFT;
consts.MASK = consts.SIZE - 1;

consts.MAX_ARRAY_MAP_SIZE = consts.SIZE / 4;
consts.MAX_BITMAP_INDEXED_SIZE = consts.SIZE / 2;


},
function(require, exports, module, global) {

var mask = require(37);


module.exports = bitpos;


function bitpos(hashCode, shift) {
    return 1 << mask(hashCode, shift);
}


},
function(require, exports, module, global) {

var consts = require(35);


var MASK = consts.MASK;


module.exports = mask;


function mask(hashCode, shift) {
    return (hashCode >>> shift) & MASK;
}


},
function(require, exports, module, global) {

module.exports = copyArray;


function copyArray(src, srcPos, dest, destPos, length) {
    var i = srcPos - 1,
        il = srcPos + length - 1;

    while (i++ < il) {
        dest[destPos++] = src[i];
    }
}


},
function(require, exports, module, global) {

var copyArray = require(38);


module.exports = cloneAndSet;


function cloneAndSet(array, index0, value0, index1, value1) {
    var length = array.length,
        results = new Array(length);

    copyArray(array, 0, results, 0, length);

    results[index0] = value0;
    if (index1 !== undefined) {
        results[index1] = value1;
    }

    return results;
}


},
function(require, exports, module, global) {

var copyArray = require(38);


module.exports = removePair;


function removePair(array, index) {
    var length = array.length,
        newArray = new Array(length - 2);

    copyArray(array, 0, newArray, 0, 2 * index);
    copyArray(array, 2 * (index + 1), newArray, 2 * index, length - 2 * index);

    return newArray;
}


},
function(require, exports, module, global) {

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
function(require, exports, module, global) {

var isNull = require(2),
    isUndefined = require(3),
    Iterator = require(32),
    IteratorValue = require(33);


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
            return new IteratorValue(false, entry);
        } else if (!isNull(nextIter)) {
            entry = nextIter.next();

            if (!nextIter.hasNext()) {
                nextIter = null;
            }

            return new IteratorValue(false, entry);
        } else if (advance()) {
            return next();
        } else {
            return new IteratorValue(true, undefined);
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
            return new IteratorValue(false, entry);
        } else if (!isNull(nextIter)) {
            entry = nextIter.next();

            if (!nextIter.hasNext()) {
                nextIter = null;
            }

            return new IteratorValue(false, entry);
        } else if (advance()) {
            return next();
        } else {
            return new IteratorValue(true, undefined);
        }
    }

    return new Iterator(hasNext, next);
}


},
function(require, exports, module, global) {

var isNull = require(2),
    isNullOrUndefined = require(9),
    consts = require(35),
    mask = require(37),
    cloneAndSet = require(39),
    Iterator = require(32),
    IteratorValue = require(33),
    BitmapIndexedNode;


var SHIFT = consts.SHIFT,
    MAX_ARRAY_MAP_SIZE = consts.MAX_ARRAY_MAP_SIZE,
    EMPTY = new ArrayNode(0, []),
    ArrayNodePrototype = ArrayNode.prototype;


module.exports = ArrayNode;


BitmapIndexedNode = require(34);


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
            return new IteratorValue(true, undefined);
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
            return new IteratorValue(true, undefined);
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
function(require, exports, module, global) {

var hashCode = require(24),
    Box = require(31),
    HashCollisionNode, BitmapIndexedNode;


module.exports = createNode;


HashCollisionNode = require(45);
BitmapIndexedNode = require(34);


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
function(require, exports, module, global) {

var isEqual = require(21),
    bitpos = require(36),
    copyArray = require(38),
    cloneAndSet = require(39),
    removePair = require(40),
    nodeIterator = require(42),
    BitmapIndexedNode;


var EMPTY = new HashCollisionNode(0, []),
    HashCollisionNodePrototype = HashCollisionNode.prototype;


module.exports = HashCollisionNode;


BitmapIndexedNode = require(34);


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
            copyArray(array, 0, newArray, 0, 2 * count);
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
function(require, exports, module, global) {

var ImmutableMap = require(23),
    isUndefined = require(3),
    isArrayLike = require(4),
    defineProperty = require(13);


var INTERNAL_CREATE = {},

    ITERATOR_SYMBOL = typeof(Symbol) === "function" ? Symbol.iterator : false,
    IS_SET = "__ImmutableSet__",

    EMPTY_SET = new Set(INTERNAL_CREATE),

    SetPrototype = Set.prototype;


module.exports = Set;


function Set(value) {
    if (!(this instanceof Set)) {
        throw new Error("Set() must be called with new");
    }

    this.__map = ImmutableMap.EMPTY;

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
        map = _this.__map,
        value;

    while (i++ < il) {
        value = array[i];
        map = map.set(value, true);
    }

    if (map.size() !== 0) {
        _this.__map = map;
        return _this;
    } else {
        return EMPTY_SET;
    }
}

Set.of = function(value) {
    if (arguments.length > 0) {
        return Set_createSet(new Set(INTERNAL_CREATE), value, arguments);
    } else {
        return EMPTY_SET;
    }
};

Set.isSet = function(value) {
    return value && value[IS_SET] === true;
};

defineProperty(SetPrototype, IS_SET, {
    configurable: false,
    enumerable: false,
    writable: false,
    value: true
});

SetPrototype.size = function() {
    return this.__map.size();
};

if (defineProperty.hasGettersSetters) {
    defineProperty(SetPrototype, "length", {
        get: SetPrototype.size
    });
}

SetPrototype.count = SetPrototype.size;

SetPrototype.isEmpty = function() {
    return this.__map.isEmpty();
};

SetPrototype.has = function(value) {
    return this.__map.has(value);
};

SetPrototype.get = function(value) {
    if (this.__map.has(value)) {
        return value;
    } else {
        return undefined;
    }
};

function Set_set(_this, values) {
    var map = _this.__map,
        i = -1,
        il = values.length - 1,
        added = 0,
        newImmutableMap, set, value;

    while (i++ < il) {
        value = values[i];

        if (!map.has(value)) {
            newImmutableMap = map.set(value, true);

            if (newImmutableMap !== map) {
                map = newImmutableMap;
                added += 1;
            }
        }
    }

    if (added !== 0) {
        set = new Set(INTERNAL_CREATE);
        set.__map = map;
        return set;
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
    var map = _this.__map,
        i = -1,
        il = values.length - 1,
        removed = 0,
        newImmutableMap, set, value;

    while (i++ < il) {
        value = values[i];

        if (map.has(value)) {
            newImmutableMap = map.remove(value);

            if (newImmutableMap !== map) {
                map = newImmutableMap;
                removed += 1;
            }
        }
    }

    if (removed !== 0) {
        set = new Set(INTERNAL_CREATE);
        set.__map = map;
        return set;
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
    if (this.size() === 0) {
        return [];
    } else {
        return Set_toArray(this.__size, this.iterator());
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
        return Set_join(this.__size, this.iterator(), separator);
    }
};

SetPrototype.toString = function() {
    return "#{" + this.join() + "}";
};

SetPrototype.inspect = SetPrototype.toString;

function SetIteratorValue(done, value) {
    this.done = done;
    this.value = value;
}

function SetIterator(mapIterator) {
    this.next = function next() {
        var iteratorValue = mapIterator.next();

        if (iteratorValue.done) {
            return new SetIteratorValue(true, undefined);
        } else {
            return new SetIteratorValue(iteratorValue.done, iteratorValue.value[0]);
        }
    };
}

SetPrototype.iterator = function(reverse) {
    return new SetIterator(this.__map.iterator(reverse));
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
        results = new Array(_this.__size),
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
    return ImmutableMap.equal(a.__map, b.__map);
};

SetPrototype.equals = function(other) {
    return Set.equal(this, other);
};


}], void 0, (new Function("return this;"))()));
