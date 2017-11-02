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

    global["6VkjTrde-Z02J-4FJJ-4gHl-nPtaD6IdYyJpg"] = function(asyncDependencies) {
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
var jsconsole = require(1);


window.onload = function() {
    jsconsole(
        document.getElementById("jsconsole"),
        "var list = ImmutableList.of(0, 1, 2, 3, 4);"
    );
};

},
function(require, exports, module, undefined, global) {
/*@=-/var/www/html/node/_immutable/js-immutable-playground/src/jsconsole.js-=@*/
var vm = require(2),
    util = require(3),
    ImmutableList = require(4),
    ImmutableVector = require(5),
    ImmutableHashMap = require(6),
    ImmutableSet = require(7),
    ImmutableRecord = require(8);


var JSCONSOLE_HTML = [
    '<div class="console" style="background-color: #EEE; padding: 8px; border: 1px solid #DDD;">',
    '  <div class="scroll" style="overflow: auto; max-height: 386px;">',
    '    <pre class="code" style="background-color: none; border: none;"></pre>',
    '  </div>',
    '  <hr/>',
    '  <div class="input" style="position: relative;">',
    '    <span class="arrow" style="',
    '       font-family: monospace,',
    '       monospace; font-size: 1em;',
    '       height: 36px;',
    '       line-height: 36px;',
    '       position: absolute;',
    '       top: 0px;',
    '       left: 8px;',
    '    ">></span>',
    '    <input class="input text" type="text" value="" style="',
    '       font-family: monospace, monospace;',
    '        font-size: 1em;',
    '        line-height: 1.25em;',
    '        height: 36px;',
    '        display: inline-block;',
    '        padding: 8px 8px 8px 24px;',
    '    "/>',
    '  </div>',
    '</div>'
].join("\n");


module.exports = jsconsole;


function jsconsole(rootElement, defaultExpr) {
    var history = [],
        historyIndex = 0,

        context = {
            ImmutableList: ImmutableList,
            ImmutableVector: ImmutableVector,
            ImmutableHashMap: ImmutableHashMap,
            ImmutableSet: ImmutableSet,
            ImmutableRecord: ImmutableRecord
        };

    rootElement.innerHTML = JSCONSOLE_HTML;

    var input = rootElement.querySelector("input.input"),
        code = rootElement.querySelector("pre.code"),
        scroll = rootElement.querySelector("div.scroll");

    function evaluate(value) {
        var result;

        history.push(value);
        historyIndex = history.length - 1;

        try {
            result = vm.runInNewContext(value, context);
        } catch(e) {
            result = e.toString();
        }

        code.innerHTML += "> " + value + "\n";
        code.innerHTML += "  " + util.inspect(result) + "\n";

        input.value = "";

        scroll.scrollTop = scroll.scrollHeight;
    }

    function onKeyPress(e) {
        if (e.which === 13) {
            evaluate(input.value || "\n");
        } else if (e.keyCode === 38) {
            input.value = history[historyIndex];
            historyIndex -= 1;

            if (historyIndex < 0) {
                historyIndex = 0;
            }
        } else if (e.keyCode === 40) {
            input.value = history[historyIndex];
            historyIndex += 1;

            if (historyIndex >= history.length) {
                historyIndex = history.length - 1;
            }
        }
    }

    input.addEventListener("keypress", onKeyPress);

    try {
        input.focus();
    } catch(e) {}

    evaluate(defaultExpr);
};

},
function(require, exports, module, undefined, global) {
/*@=-vm-browserify@0.0.4/index.js-=@*/
var indexOf = require(9);

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
/*@=-util@0.10.3/util.js-=@*/
var process = require(10);
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

var formatRegExp = /%[sdj%]/g;
exports.format = function(f) {
  if (!isString(f)) {
    var objects = [];
    for (var i = 0; i < arguments.length; i++) {
      objects.push(inspect(arguments[i]));
    }
    return objects.join(' ');
  }

  var i = 1;
  var args = arguments;
  var len = args.length;
  var str = String(f).replace(formatRegExp, function(x) {
    if (x === '%%') return '%';
    if (i >= len) return x;
    switch (x) {
      case '%s': return String(args[i++]);
      case '%d': return Number(args[i++]);
      case '%j':
        try {
          return JSON.stringify(args[i++]);
        } catch (_) {
          return '[Circular]';
        }
      default:
        return x;
    }
  });
  for (var x = args[i]; i < len; x = args[++i]) {
    if (isNull(x) || !isObject(x)) {
      str += ' ' + x;
    } else {
      str += ' ' + inspect(x);
    }
  }
  return str;
};


// Mark that a method should not be used.
// Returns a modified function which warns once by default.
// If --no-deprecation is set, then it is a no-op.
exports.deprecate = function(fn, msg) {
  // Allow for deprecating things in the process of starting up.
  if (isUndefined(global.process)) {
    return function() {
      return exports.deprecate(fn, msg).apply(this, arguments);
    };
  }

  if (process.noDeprecation === true) {
    return fn;
  }

  var warned = false;
  function deprecated() {
    if (!warned) {
      if (process.throwDeprecation) {
        throw new Error(msg);
      } else if (process.traceDeprecation) {
        console.trace(msg);
      } else {
        console.error(msg);
      }
      warned = true;
    }
    return fn.apply(this, arguments);
  }

  return deprecated;
};


var debugs = {};
var debugEnviron;
exports.debuglog = function(set) {
  if (isUndefined(debugEnviron))
    debugEnviron = process.env.NODE_DEBUG || '';
  set = set.toUpperCase();
  if (!debugs[set]) {
    if (new RegExp('\\b' + set + '\\b', 'i').test(debugEnviron)) {
      var pid = process.pid;
      debugs[set] = function() {
        var msg = exports.format.apply(exports, arguments);
        console.error('%s %d: %s', set, pid, msg);
      };
    } else {
      debugs[set] = function() {};
    }
  }
  return debugs[set];
};


/**
 * Echos the value of a value. Trys to print the value out
 * in the best way possible given the different types.
 *
 * @param {Object} obj The object to print out.
 * @param {Object} opts Optional options object that alters the output.
 */
/* legacy: obj, showHidden, depth, colors*/
function inspect(obj, opts) {
  // default options
  var ctx = {
    seen: [],
    stylize: stylizeNoColor
  };
  // legacy...
  if (arguments.length >= 3) ctx.depth = arguments[2];
  if (arguments.length >= 4) ctx.colors = arguments[3];
  if (isBoolean(opts)) {
    // legacy...
    ctx.showHidden = opts;
  } else if (opts) {
    // got an "options" object
    exports._extend(ctx, opts);
  }
  // set default options
  if (isUndefined(ctx.showHidden)) ctx.showHidden = false;
  if (isUndefined(ctx.depth)) ctx.depth = 2;
  if (isUndefined(ctx.colors)) ctx.colors = false;
  if (isUndefined(ctx.customInspect)) ctx.customInspect = true;
  if (ctx.colors) ctx.stylize = stylizeWithColor;
  return formatValue(ctx, obj, ctx.depth);
}
exports.inspect = inspect;


// http://en.wikipedia.org/wiki/ANSI_escape_code#graphics
inspect.colors = {
  'bold' : [1, 22],
  'italic' : [3, 23],
  'underline' : [4, 24],
  'inverse' : [7, 27],
  'white' : [37, 39],
  'grey' : [90, 39],
  'black' : [30, 39],
  'blue' : [34, 39],
  'cyan' : [36, 39],
  'green' : [32, 39],
  'magenta' : [35, 39],
  'red' : [31, 39],
  'yellow' : [33, 39]
};

// Don't use 'blue' not visible on cmd.exe
inspect.styles = {
  'special': 'cyan',
  'number': 'yellow',
  'boolean': 'yellow',
  'undefined': 'grey',
  'null': 'bold',
  'string': 'green',
  'date': 'magenta',
  // "name": intentionally not styling
  'regexp': 'red'
};


function stylizeWithColor(str, styleType) {
  var style = inspect.styles[styleType];

  if (style) {
    return '\u001b[' + inspect.colors[style][0] + 'm' + str +
           '\u001b[' + inspect.colors[style][1] + 'm';
  } else {
    return str;
  }
}


function stylizeNoColor(str, styleType) {
  return str;
}


function arrayToHash(array) {
  var hash = {};

  array.forEach(function(val, idx) {
    hash[val] = true;
  });

  return hash;
}


function formatValue(ctx, value, recurseTimes) {
  // Provide a hook for user-specified inspect functions.
  // Check that value is an object with an inspect function on it
  if (ctx.customInspect &&
      value &&
      isFunction(value.inspect) &&
      // Filter out the util module, it's inspect function is special
      value.inspect !== exports.inspect &&
      // Also filter out any prototype objects using the circular check.
      !(value.constructor && value.constructor.prototype === value)) {
    var ret = value.inspect(recurseTimes, ctx);
    if (!isString(ret)) {
      ret = formatValue(ctx, ret, recurseTimes);
    }
    return ret;
  }

  // Primitive types cannot have properties
  var primitive = formatPrimitive(ctx, value);
  if (primitive) {
    return primitive;
  }

  // Look up the keys of the object.
  var keys = Object.keys(value);
  var visibleKeys = arrayToHash(keys);

  if (ctx.showHidden) {
    keys = Object.getOwnPropertyNames(value);
  }

  // IE doesn't make error fields non-enumerable
  // http://msdn.microsoft.com/en-us/library/ie/dww52sbt(v=vs.94).aspx
  if (isError(value)
      && (keys.indexOf('message') >= 0 || keys.indexOf('description') >= 0)) {
    return formatError(value);
  }

  // Some type of object without properties can be shortcutted.
  if (keys.length === 0) {
    if (isFunction(value)) {
      var name = value.name ? ': ' + value.name : '';
      return ctx.stylize('[Function' + name + ']', 'special');
    }
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    }
    if (isDate(value)) {
      return ctx.stylize(Date.prototype.toString.call(value), 'date');
    }
    if (isError(value)) {
      return formatError(value);
    }
  }

  var base = '', array = false, braces = ['{', '}'];

  // Make Array say that they are Array
  if (isArray(value)) {
    array = true;
    braces = ['[', ']'];
  }

  // Make functions say that they are functions
  if (isFunction(value)) {
    var n = value.name ? ': ' + value.name : '';
    base = ' [Function' + n + ']';
  }

  // Make RegExps say that they are RegExps
  if (isRegExp(value)) {
    base = ' ' + RegExp.prototype.toString.call(value);
  }

  // Make dates with properties first say the date
  if (isDate(value)) {
    base = ' ' + Date.prototype.toUTCString.call(value);
  }

  // Make error with message first say the error
  if (isError(value)) {
    base = ' ' + formatError(value);
  }

  if (keys.length === 0 && (!array || value.length == 0)) {
    return braces[0] + base + braces[1];
  }

  if (recurseTimes < 0) {
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    } else {
      return ctx.stylize('[Object]', 'special');
    }
  }

  ctx.seen.push(value);

  var output;
  if (array) {
    output = formatArray(ctx, value, recurseTimes, visibleKeys, keys);
  } else {
    output = keys.map(function(key) {
      return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array);
    });
  }

  ctx.seen.pop();

  return reduceToSingleString(output, base, braces);
}


function formatPrimitive(ctx, value) {
  if (isUndefined(value))
    return ctx.stylize('undefined', 'undefined');
  if (isString(value)) {
    var simple = '\'' + JSON.stringify(value).replace(/^"|"$/g, '')
                                             .replace(/'/g, "\\'")
                                             .replace(/\\"/g, '"') + '\'';
    return ctx.stylize(simple, 'string');
  }
  if (isNumber(value))
    return ctx.stylize('' + value, 'number');
  if (isBoolean(value))
    return ctx.stylize('' + value, 'boolean');
  // For some reason typeof null is "object", so special case here.
  if (isNull(value))
    return ctx.stylize('null', 'null');
}


function formatError(value) {
  return '[' + Error.prototype.toString.call(value) + ']';
}


function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
  var output = [];
  for (var i = 0, l = value.length; i < l; ++i) {
    if (hasOwnProperty(value, String(i))) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          String(i), true));
    } else {
      output.push('');
    }
  }
  keys.forEach(function(key) {
    if (!key.match(/^\d+$/)) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          key, true));
    }
  });
  return output;
}


function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
  var name, str, desc;
  desc = Object.getOwnPropertyDescriptor(value, key) || { value: value[key] };
  if (desc.get) {
    if (desc.set) {
      str = ctx.stylize('[Getter/Setter]', 'special');
    } else {
      str = ctx.stylize('[Getter]', 'special');
    }
  } else {
    if (desc.set) {
      str = ctx.stylize('[Setter]', 'special');
    }
  }
  if (!hasOwnProperty(visibleKeys, key)) {
    name = '[' + key + ']';
  }
  if (!str) {
    if (ctx.seen.indexOf(desc.value) < 0) {
      if (isNull(recurseTimes)) {
        str = formatValue(ctx, desc.value, null);
      } else {
        str = formatValue(ctx, desc.value, recurseTimes - 1);
      }
      if (str.indexOf('\n') > -1) {
        if (array) {
          str = str.split('\n').map(function(line) {
            return '  ' + line;
          }).join('\n').substr(2);
        } else {
          str = '\n' + str.split('\n').map(function(line) {
            return '   ' + line;
          }).join('\n');
        }
      }
    } else {
      str = ctx.stylize('[Circular]', 'special');
    }
  }
  if (isUndefined(name)) {
    if (array && key.match(/^\d+$/)) {
      return str;
    }
    name = JSON.stringify('' + key);
    if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
      name = name.substr(1, name.length - 2);
      name = ctx.stylize(name, 'name');
    } else {
      name = name.replace(/'/g, "\\'")
                 .replace(/\\"/g, '"')
                 .replace(/(^"|"$)/g, "'");
      name = ctx.stylize(name, 'string');
    }
  }

  return name + ': ' + str;
}


function reduceToSingleString(output, base, braces) {
  var numLinesEst = 0;
  var length = output.reduce(function(prev, cur) {
    numLinesEst++;
    if (cur.indexOf('\n') >= 0) numLinesEst++;
    return prev + cur.replace(/\u001b\[\d\d?m/g, '').length + 1;
  }, 0);

  if (length > 60) {
    return braces[0] +
           (base === '' ? '' : base + '\n ') +
           ' ' +
           output.join(',\n  ') +
           ' ' +
           braces[1];
  }

  return braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];
}


// NOTE: These type checking functions intentionally don't use `instanceof`
// because it is fragile and can be easily faked with `Object.create()`.
function isArray(ar) {
  return Array.isArray(ar);
}
exports.isArray = isArray;

function isBoolean(arg) {
  return typeof arg === 'boolean';
}
exports.isBoolean = isBoolean;

function isNull(arg) {
  return arg === null;
}
exports.isNull = isNull;

function isNullOrUndefined(arg) {
  return arg == null;
}
exports.isNullOrUndefined = isNullOrUndefined;

function isNumber(arg) {
  return typeof arg === 'number';
}
exports.isNumber = isNumber;

function isString(arg) {
  return typeof arg === 'string';
}
exports.isString = isString;

function isSymbol(arg) {
  return typeof arg === 'symbol';
}
exports.isSymbol = isSymbol;

function isUndefined(arg) {
  return arg === void 0;
}
exports.isUndefined = isUndefined;

function isRegExp(re) {
  return isObject(re) && objectToString(re) === '[object RegExp]';
}
exports.isRegExp = isRegExp;

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}
exports.isObject = isObject;

function isDate(d) {
  return isObject(d) && objectToString(d) === '[object Date]';
}
exports.isDate = isDate;

function isError(e) {
  return isObject(e) &&
      (objectToString(e) === '[object Error]' || e instanceof Error);
}
exports.isError = isError;

function isFunction(arg) {
  return typeof arg === 'function';
}
exports.isFunction = isFunction;

function isPrimitive(arg) {
  return arg === null ||
         typeof arg === 'boolean' ||
         typeof arg === 'number' ||
         typeof arg === 'string' ||
         typeof arg === 'symbol' ||  // ES6 symbol
         typeof arg === 'undefined';
}
exports.isPrimitive = isPrimitive;

exports.isBuffer = require(11);

function objectToString(o) {
  return Object.prototype.toString.call(o);
}


function pad(n) {
  return n < 10 ? '0' + n.toString(10) : n.toString(10);
}


var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
              'Oct', 'Nov', 'Dec'];

// 26 Feb 16:19:34
function timestamp() {
  var d = new Date();
  var time = [pad(d.getHours()),
              pad(d.getMinutes()),
              pad(d.getSeconds())].join(':');
  return [d.getDate(), months[d.getMonth()], time].join(' ');
}


// log is just a thin wrapper to console.log that prepends a timestamp
exports.log = function() {
  console.log('%s - %s', timestamp(), exports.format.apply(exports, arguments));
};


/**
 * Inherit the prototype methods from one constructor into another.
 *
 * The Function.prototype.inherits from lang.js rewritten as a standalone
 * function (not on Function.prototype). NOTE: If this file is to be loaded
 * during bootstrapping this function needs to be rewritten using some native
 * functions as prototype setup using normal JavaScript does not work as
 * expected during bootstrapping (see mirror.js in r114903).
 *
 * @param {function} ctor Constructor function which needs to inherit the
 *     prototype.
 * @param {function} superCtor Constructor function to inherit prototype from.
 */
exports.inherits = require(12);

exports._extend = function(origin, add) {
  // Don't do anything if add isn't an object
  if (!add || !isObject(add)) return origin;

  var keys = Object.keys(add);
  var i = keys.length;
  while (i--) {
    origin[keys[i]] = add[keys[i]];
  }
  return origin;
};

function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

},
function(require, exports, module, undefined, global) {
/*@=-@nathanfaucett/immutable-list@0.0.3/src/index.js-=@*/
var isNull = require(17),
    isUndefined = require(18),
    isArrayLike = require(19),
    isNumber = require(20),
    Iterator = require(21),
    fastBindThis = require(22),
    fastSlice = require(23),
    defineProperty = require(24),
    freeze = require(25),
    isEqual = require(26);


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
var freeze = require(25),
    Iterator = require(21),
    isNull = require(17),
    isUndefined = require(18),
    isNumber = require(20),
    isArrayLike = require(19),
    fastBindThis = require(22),
    fastSlice = require(23),
    defineProperty = require(24),
    isEqual = require(26);


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
var has = require(35),
    freeze = require(25),
    isNull = require(17),
    isUndefined = require(18),
    isObject = require(29),
    defineProperty = require(24),
    isEqual = require(26),
    hashCode = require(41),
    isArrayLike = require(19),
    fastBindThis = require(22),
    Box = require(42),
    Iterator = require(43),
    BitmapIndexedNode = require(44);


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
var freeze = require(25),
    Iterator = require(21),
    ImmutableHashMap = require(70),
    isUndefined = require(18),
    isArrayLike = require(19),
    defineProperty = require(24);


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
var ImmutableHashMap = require(83),
    defineProperty = require(24),
    inherits = require(51),
    keys = require(58),
    has = require(35),
    freeze = require(25);


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
/*@=-process@0.11.9/browser.js-=@*/
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},
function(require, exports, module, undefined, global) {
/*@=-util@0.10.3/support/isBuffer.js-=@*/
var Buffer = require(13).Buffer;
module.exports = function isBuffer(arg) {
  return arg instanceof Buffer;
}

},
function(require, exports, module, undefined, global) {
/*@=-inherits@2.0.1/inherits_browser.js-=@*/
if (typeof Object.create === 'function') {
  // implementation from standard node.js 'util' module
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    ctor.prototype = Object.create(superCtor.prototype, {
      constructor: {
        value: ctor,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
  };
} else {
  // old school shim for old browsers
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    var TempCtor = function () {}
    TempCtor.prototype = superCtor.prototype
    ctor.prototype = new TempCtor()
    ctor.prototype.constructor = ctor
  }
}

},
function(require, exports, module, undefined, global) {
/*@=-buffer@3.6.0/index.js-=@*/
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * @license  MIT
 */
/* eslint-disable no-proto */

'use strict'

var base64 = require(14)
var ieee754 = require(15)
var isArray = require(16)

exports.Buffer = Buffer
exports.SlowBuffer = SlowBuffer
exports.INSPECT_MAX_BYTES = 50
Buffer.poolSize = 8192 // not used by this implementation

var rootParent = {}

/**
 * If `Buffer.TYPED_ARRAY_SUPPORT`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Use Object implementation (most compatible, even IE6)
 *
 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
 * Opera 11.6+, iOS 4.2+.
 *
 * Due to various browser bugs, sometimes the Object implementation will be used even
 * when the browser supports typed arrays.
 *
 * Note:
 *
 *   - Firefox 4-29 lacks support for adding new properties to `Uint8Array` instances,
 *     See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438.
 *
 *   - Safari 5-7 lacks support for changing the `Object.prototype.constructor` property
 *     on objects.
 *
 *   - Chrome 9-10 is missing the `TypedArray.prototype.subarray` function.
 *
 *   - IE10 has a broken `TypedArray.prototype.subarray` function which returns arrays of
 *     incorrect length in some situations.

 * We detect these buggy browsers and set `Buffer.TYPED_ARRAY_SUPPORT` to `false` so they
 * get the Object implementation, which is slower but behaves correctly.
 */
Buffer.TYPED_ARRAY_SUPPORT = global.TYPED_ARRAY_SUPPORT !== undefined
  ? global.TYPED_ARRAY_SUPPORT
  : typedArraySupport()

function typedArraySupport () {
  function Bar () {}
  try {
    var arr = new Uint8Array(1)
    arr.foo = function () { return 42 }
    arr.constructor = Bar
    return arr.foo() === 42 && // typed array instances can be augmented
        arr.constructor === Bar && // constructor can be set
        typeof arr.subarray === 'function' && // chrome 9-10 lack `subarray`
        arr.subarray(1, 1).byteLength === 0 // ie10 has broken `subarray`
  } catch (e) {
    return false
  }
}

function kMaxLength () {
  return Buffer.TYPED_ARRAY_SUPPORT
    ? 0x7fffffff
    : 0x3fffffff
}

/**
 * Class: Buffer
 * =============
 *
 * The Buffer constructor returns instances of `Uint8Array` that are augmented
 * with function properties for all the node `Buffer` API functions. We use
 * `Uint8Array` so that square bracket notation works as expected -- it returns
 * a single octet.
 *
 * By augmenting the instances, we can avoid modifying the `Uint8Array`
 * prototype.
 */
function Buffer (arg) {
  if (!(this instanceof Buffer)) {
    // Avoid going through an ArgumentsAdaptorTrampoline in the common case.
    if (arguments.length > 1) return new Buffer(arg, arguments[1])
    return new Buffer(arg)
  }

  if (!Buffer.TYPED_ARRAY_SUPPORT) {
    this.length = 0
    this.parent = undefined
  }

  // Common case.
  if (typeof arg === 'number') {
    return fromNumber(this, arg)
  }

  // Slightly less common case.
  if (typeof arg === 'string') {
    return fromString(this, arg, arguments.length > 1 ? arguments[1] : 'utf8')
  }

  // Unusual.
  return fromObject(this, arg)
}

function fromNumber (that, length) {
  that = allocate(that, length < 0 ? 0 : checked(length) | 0)
  if (!Buffer.TYPED_ARRAY_SUPPORT) {
    for (var i = 0; i < length; i++) {
      that[i] = 0
    }
  }
  return that
}

function fromString (that, string, encoding) {
  if (typeof encoding !== 'string' || encoding === '') encoding = 'utf8'

  // Assumption: byteLength() return value is always < kMaxLength.
  var length = byteLength(string, encoding) | 0
  that = allocate(that, length)

  that.write(string, encoding)
  return that
}

function fromObject (that, object) {
  if (Buffer.isBuffer(object)) return fromBuffer(that, object)

  if (isArray(object)) return fromArray(that, object)

  if (object == null) {
    throw new TypeError('must start with number, buffer, array or string')
  }

  if (typeof ArrayBuffer !== 'undefined') {
    if (object.buffer instanceof ArrayBuffer) {
      return fromTypedArray(that, object)
    }
    if (object instanceof ArrayBuffer) {
      return fromArrayBuffer(that, object)
    }
  }

  if (object.length) return fromArrayLike(that, object)

  return fromJsonObject(that, object)
}

function fromBuffer (that, buffer) {
  var length = checked(buffer.length) | 0
  that = allocate(that, length)
  buffer.copy(that, 0, 0, length)
  return that
}

function fromArray (that, array) {
  var length = checked(array.length) | 0
  that = allocate(that, length)
  for (var i = 0; i < length; i += 1) {
    that[i] = array[i] & 255
  }
  return that
}

// Duplicate of fromArray() to keep fromArray() monomorphic.
function fromTypedArray (that, array) {
  var length = checked(array.length) | 0
  that = allocate(that, length)
  // Truncating the elements is probably not what people expect from typed
  // arrays with BYTES_PER_ELEMENT > 1 but it's compatible with the behavior
  // of the old Buffer constructor.
  for (var i = 0; i < length; i += 1) {
    that[i] = array[i] & 255
  }
  return that
}

function fromArrayBuffer (that, array) {
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    array.byteLength
    that = Buffer._augment(new Uint8Array(array))
  } else {
    // Fallback: Return an object instance of the Buffer class
    that = fromTypedArray(that, new Uint8Array(array))
  }
  return that
}

function fromArrayLike (that, array) {
  var length = checked(array.length) | 0
  that = allocate(that, length)
  for (var i = 0; i < length; i += 1) {
    that[i] = array[i] & 255
  }
  return that
}

// Deserialize { type: 'Buffer', data: [1,2,3,...] } into a Buffer object.
// Returns a zero-length buffer for inputs that don't conform to the spec.
function fromJsonObject (that, object) {
  var array
  var length = 0

  if (object.type === 'Buffer' && isArray(object.data)) {
    array = object.data
    length = checked(array.length) | 0
  }
  that = allocate(that, length)

  for (var i = 0; i < length; i += 1) {
    that[i] = array[i] & 255
  }
  return that
}

if (Buffer.TYPED_ARRAY_SUPPORT) {
  Buffer.prototype.__proto__ = Uint8Array.prototype
  Buffer.__proto__ = Uint8Array
} else {
  // pre-set for values that may exist in the future
  Buffer.prototype.length = undefined
  Buffer.prototype.parent = undefined
}

function allocate (that, length) {
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = Buffer._augment(new Uint8Array(length))
    that.__proto__ = Buffer.prototype
  } else {
    // Fallback: Return an object instance of the Buffer class
    that.length = length
    that._isBuffer = true
  }

  var fromPool = length !== 0 && length <= Buffer.poolSize >>> 1
  if (fromPool) that.parent = rootParent

  return that
}

function checked (length) {
  // Note: cannot use `length < kMaxLength` here because that fails when
  // length is NaN (which is otherwise coerced to zero.)
  if (length >= kMaxLength()) {
    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
                         'size: 0x' + kMaxLength().toString(16) + ' bytes')
  }
  return length | 0
}

function SlowBuffer (subject, encoding) {
  if (!(this instanceof SlowBuffer)) return new SlowBuffer(subject, encoding)

  var buf = new Buffer(subject, encoding)
  delete buf.parent
  return buf
}

Buffer.isBuffer = function isBuffer (b) {
  return !!(b != null && b._isBuffer)
}

Buffer.compare = function compare (a, b) {
  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
    throw new TypeError('Arguments must be Buffers')
  }

  if (a === b) return 0

  var x = a.length
  var y = b.length

  var i = 0
  var len = Math.min(x, y)
  while (i < len) {
    if (a[i] !== b[i]) break

    ++i
  }

  if (i !== len) {
    x = a[i]
    y = b[i]
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

Buffer.isEncoding = function isEncoding (encoding) {
  switch (String(encoding).toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'binary':
    case 'base64':
    case 'raw':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      return true
    default:
      return false
  }
}

Buffer.concat = function concat (list, length) {
  if (!isArray(list)) throw new TypeError('list argument must be an Array of Buffers.')

  if (list.length === 0) {
    return new Buffer(0)
  }

  var i
  if (length === undefined) {
    length = 0
    for (i = 0; i < list.length; i++) {
      length += list[i].length
    }
  }

  var buf = new Buffer(length)
  var pos = 0
  for (i = 0; i < list.length; i++) {
    var item = list[i]
    item.copy(buf, pos)
    pos += item.length
  }
  return buf
}

function byteLength (string, encoding) {
  if (typeof string !== 'string') string = '' + string

  var len = string.length
  if (len === 0) return 0

  // Use a for loop to avoid recursion
  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'ascii':
      case 'binary':
      // Deprecated
      case 'raw':
      case 'raws':
        return len
      case 'utf8':
      case 'utf-8':
        return utf8ToBytes(string).length
      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return len * 2
      case 'hex':
        return len >>> 1
      case 'base64':
        return base64ToBytes(string).length
      default:
        if (loweredCase) return utf8ToBytes(string).length // assume utf8
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}
Buffer.byteLength = byteLength

function slowToString (encoding, start, end) {
  var loweredCase = false

  start = start | 0
  end = end === undefined || end === Infinity ? this.length : end | 0

  if (!encoding) encoding = 'utf8'
  if (start < 0) start = 0
  if (end > this.length) end = this.length
  if (end <= start) return ''

  while (true) {
    switch (encoding) {
      case 'hex':
        return hexSlice(this, start, end)

      case 'utf8':
      case 'utf-8':
        return utf8Slice(this, start, end)

      case 'ascii':
        return asciiSlice(this, start, end)

      case 'binary':
        return binarySlice(this, start, end)

      case 'base64':
        return base64Slice(this, start, end)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return utf16leSlice(this, start, end)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = (encoding + '').toLowerCase()
        loweredCase = true
    }
  }
}

Buffer.prototype.toString = function toString () {
  var length = this.length | 0
  if (length === 0) return ''
  if (arguments.length === 0) return utf8Slice(this, 0, length)
  return slowToString.apply(this, arguments)
}

Buffer.prototype.equals = function equals (b) {
  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
  if (this === b) return true
  return Buffer.compare(this, b) === 0
}

Buffer.prototype.inspect = function inspect () {
  var str = ''
  var max = exports.INSPECT_MAX_BYTES
  if (this.length > 0) {
    str = this.toString('hex', 0, max).match(/.{2}/g).join(' ')
    if (this.length > max) str += ' ... '
  }
  return '<Buffer ' + str + '>'
}

Buffer.prototype.compare = function compare (b) {
  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
  if (this === b) return 0
  return Buffer.compare(this, b)
}

Buffer.prototype.indexOf = function indexOf (val, byteOffset) {
  if (byteOffset > 0x7fffffff) byteOffset = 0x7fffffff
  else if (byteOffset < -0x80000000) byteOffset = -0x80000000
  byteOffset >>= 0

  if (this.length === 0) return -1
  if (byteOffset >= this.length) return -1

  // Negative offsets start from the end of the buffer
  if (byteOffset < 0) byteOffset = Math.max(this.length + byteOffset, 0)

  if (typeof val === 'string') {
    if (val.length === 0) return -1 // special case: looking for empty string always fails
    return String.prototype.indexOf.call(this, val, byteOffset)
  }
  if (Buffer.isBuffer(val)) {
    return arrayIndexOf(this, val, byteOffset)
  }
  if (typeof val === 'number') {
    if (Buffer.TYPED_ARRAY_SUPPORT && Uint8Array.prototype.indexOf === 'function') {
      return Uint8Array.prototype.indexOf.call(this, val, byteOffset)
    }
    return arrayIndexOf(this, [ val ], byteOffset)
  }

  function arrayIndexOf (arr, val, byteOffset) {
    var foundIndex = -1
    for (var i = 0; byteOffset + i < arr.length; i++) {
      if (arr[byteOffset + i] === val[foundIndex === -1 ? 0 : i - foundIndex]) {
        if (foundIndex === -1) foundIndex = i
        if (i - foundIndex + 1 === val.length) return byteOffset + foundIndex
      } else {
        foundIndex = -1
      }
    }
    return -1
  }

  throw new TypeError('val must be string, number or Buffer')
}

// `get` is deprecated
Buffer.prototype.get = function get (offset) {
  console.log('.get() is deprecated. Access using array indexes instead.')
  return this.readUInt8(offset)
}

// `set` is deprecated
Buffer.prototype.set = function set (v, offset) {
  console.log('.set() is deprecated. Access using array indexes instead.')
  return this.writeUInt8(v, offset)
}

function hexWrite (buf, string, offset, length) {
  offset = Number(offset) || 0
  var remaining = buf.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }

  // must be an even number of digits
  var strLen = string.length
  if (strLen % 2 !== 0) throw new Error('Invalid hex string')

  if (length > strLen / 2) {
    length = strLen / 2
  }
  for (var i = 0; i < length; i++) {
    var parsed = parseInt(string.substr(i * 2, 2), 16)
    if (isNaN(parsed)) throw new Error('Invalid hex string')
    buf[offset + i] = parsed
  }
  return i
}

function utf8Write (buf, string, offset, length) {
  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
}

function asciiWrite (buf, string, offset, length) {
  return blitBuffer(asciiToBytes(string), buf, offset, length)
}

function binaryWrite (buf, string, offset, length) {
  return asciiWrite(buf, string, offset, length)
}

function base64Write (buf, string, offset, length) {
  return blitBuffer(base64ToBytes(string), buf, offset, length)
}

function ucs2Write (buf, string, offset, length) {
  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
}

Buffer.prototype.write = function write (string, offset, length, encoding) {
  // Buffer#write(string)
  if (offset === undefined) {
    encoding = 'utf8'
    length = this.length
    offset = 0
  // Buffer#write(string, encoding)
  } else if (length === undefined && typeof offset === 'string') {
    encoding = offset
    length = this.length
    offset = 0
  // Buffer#write(string, offset[, length][, encoding])
  } else if (isFinite(offset)) {
    offset = offset | 0
    if (isFinite(length)) {
      length = length | 0
      if (encoding === undefined) encoding = 'utf8'
    } else {
      encoding = length
      length = undefined
    }
  // legacy write(string, encoding, offset, length) - remove in v0.13
  } else {
    var swap = encoding
    encoding = offset
    offset = length | 0
    length = swap
  }

  var remaining = this.length - offset
  if (length === undefined || length > remaining) length = remaining

  if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
    throw new RangeError('attempt to write outside buffer bounds')
  }

  if (!encoding) encoding = 'utf8'

  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'hex':
        return hexWrite(this, string, offset, length)

      case 'utf8':
      case 'utf-8':
        return utf8Write(this, string, offset, length)

      case 'ascii':
        return asciiWrite(this, string, offset, length)

      case 'binary':
        return binaryWrite(this, string, offset, length)

      case 'base64':
        // Warning: maxLength not taken into account in base64Write
        return base64Write(this, string, offset, length)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return ucs2Write(this, string, offset, length)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}

Buffer.prototype.toJSON = function toJSON () {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this._arr || this, 0)
  }
}

function base64Slice (buf, start, end) {
  if (start === 0 && end === buf.length) {
    return base64.fromByteArray(buf)
  } else {
    return base64.fromByteArray(buf.slice(start, end))
  }
}

function utf8Slice (buf, start, end) {
  end = Math.min(buf.length, end)
  var res = []

  var i = start
  while (i < end) {
    var firstByte = buf[i]
    var codePoint = null
    var bytesPerSequence = (firstByte > 0xEF) ? 4
      : (firstByte > 0xDF) ? 3
      : (firstByte > 0xBF) ? 2
      : 1

    if (i + bytesPerSequence <= end) {
      var secondByte, thirdByte, fourthByte, tempCodePoint

      switch (bytesPerSequence) {
        case 1:
          if (firstByte < 0x80) {
            codePoint = firstByte
          }
          break
        case 2:
          secondByte = buf[i + 1]
          if ((secondByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F)
            if (tempCodePoint > 0x7F) {
              codePoint = tempCodePoint
            }
          }
          break
        case 3:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F)
            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
              codePoint = tempCodePoint
            }
          }
          break
        case 4:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          fourthByte = buf[i + 3]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F)
            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
              codePoint = tempCodePoint
            }
          }
      }
    }

    if (codePoint === null) {
      // we did not generate a valid codePoint so insert a
      // replacement char (U+FFFD) and advance only 1 byte
      codePoint = 0xFFFD
      bytesPerSequence = 1
    } else if (codePoint > 0xFFFF) {
      // encode to utf16 (surrogate pair dance)
      codePoint -= 0x10000
      res.push(codePoint >>> 10 & 0x3FF | 0xD800)
      codePoint = 0xDC00 | codePoint & 0x3FF
    }

    res.push(codePoint)
    i += bytesPerSequence
  }

  return decodeCodePointsArray(res)
}

// Based on http://stackoverflow.com/a/22747272/680742, the browser with
// the lowest limit is Chrome, with 0x10000 args.
// We go 1 magnitude less, for safety
var MAX_ARGUMENTS_LENGTH = 0x1000

function decodeCodePointsArray (codePoints) {
  var len = codePoints.length
  if (len <= MAX_ARGUMENTS_LENGTH) {
    return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
  }

  // Decode in chunks to avoid "call stack size exceeded".
  var res = ''
  var i = 0
  while (i < len) {
    res += String.fromCharCode.apply(
      String,
      codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
    )
  }
  return res
}

function asciiSlice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; i++) {
    ret += String.fromCharCode(buf[i] & 0x7F)
  }
  return ret
}

function binarySlice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; i++) {
    ret += String.fromCharCode(buf[i])
  }
  return ret
}

function hexSlice (buf, start, end) {
  var len = buf.length

  if (!start || start < 0) start = 0
  if (!end || end < 0 || end > len) end = len

  var out = ''
  for (var i = start; i < end; i++) {
    out += toHex(buf[i])
  }
  return out
}

function utf16leSlice (buf, start, end) {
  var bytes = buf.slice(start, end)
  var res = ''
  for (var i = 0; i < bytes.length; i += 2) {
    res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256)
  }
  return res
}

Buffer.prototype.slice = function slice (start, end) {
  var len = this.length
  start = ~~start
  end = end === undefined ? len : ~~end

  if (start < 0) {
    start += len
    if (start < 0) start = 0
  } else if (start > len) {
    start = len
  }

  if (end < 0) {
    end += len
    if (end < 0) end = 0
  } else if (end > len) {
    end = len
  }

  if (end < start) end = start

  var newBuf
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    newBuf = Buffer._augment(this.subarray(start, end))
  } else {
    var sliceLen = end - start
    newBuf = new Buffer(sliceLen, undefined)
    for (var i = 0; i < sliceLen; i++) {
      newBuf[i] = this[i + start]
    }
  }

  if (newBuf.length) newBuf.parent = this.parent || this

  return newBuf
}

/*
 * Need to make sure that buffer isn't trying to write out of bounds.
 */
function checkOffset (offset, ext, length) {
  if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
}

Buffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }

  return val
}

Buffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    checkOffset(offset, byteLength, this.length)
  }

  var val = this[offset + --byteLength]
  var mul = 1
  while (byteLength > 0 && (mul *= 0x100)) {
    val += this[offset + --byteLength] * mul
  }

  return val
}

Buffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length)
  return this[offset]
}

Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  return this[offset] | (this[offset + 1] << 8)
}

Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  return (this[offset] << 8) | this[offset + 1]
}

Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return ((this[offset]) |
      (this[offset + 1] << 8) |
      (this[offset + 2] << 16)) +
      (this[offset + 3] * 0x1000000)
}

Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] * 0x1000000) +
    ((this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    this[offset + 3])
}

Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var i = byteLength
  var mul = 1
  var val = this[offset + --i]
  while (i > 0 && (mul *= 0x100)) {
    val += this[offset + --i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readInt8 = function readInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length)
  if (!(this[offset] & 0x80)) return (this[offset])
  return ((0xff - this[offset] + 1) * -1)
}

Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset] | (this[offset + 1] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset + 1] | (this[offset] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset]) |
    (this[offset + 1] << 8) |
    (this[offset + 2] << 16) |
    (this[offset + 3] << 24)
}

Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] << 24) |
    (this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    (this[offset + 3])
}

Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, true, 23, 4)
}

Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, false, 23, 4)
}

Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, true, 52, 8)
}

Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, false, 52, 8)
}

function checkInt (buf, value, offset, ext, max, min) {
  if (!Buffer.isBuffer(buf)) throw new TypeError('buffer must be a Buffer instance')
  if (value > max || value < min) throw new RangeError('value is out of bounds')
  if (offset + ext > buf.length) throw new RangeError('index out of range')
}

Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkInt(this, value, offset, byteLength, Math.pow(2, 8 * byteLength), 0)

  var mul = 1
  var i = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkInt(this, value, offset, byteLength, Math.pow(2, 8 * byteLength), 0)

  var i = byteLength - 1
  var mul = 1
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0)
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
  this[offset] = (value & 0xff)
  return offset + 1
}

function objectWriteUInt16 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffff + value + 1
  for (var i = 0, j = Math.min(buf.length - offset, 2); i < j; i++) {
    buf[offset + i] = (value & (0xff << (8 * (littleEndian ? i : 1 - i)))) >>>
      (littleEndian ? i : 1 - i) * 8
  }
}

Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
  } else {
    objectWriteUInt16(this, value, offset, true)
  }
  return offset + 2
}

Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8)
    this[offset + 1] = (value & 0xff)
  } else {
    objectWriteUInt16(this, value, offset, false)
  }
  return offset + 2
}

function objectWriteUInt32 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffffffff + value + 1
  for (var i = 0, j = Math.min(buf.length - offset, 4); i < j; i++) {
    buf[offset + i] = (value >>> (littleEndian ? i : 3 - i) * 8) & 0xff
  }
}

Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset + 3] = (value >>> 24)
    this[offset + 2] = (value >>> 16)
    this[offset + 1] = (value >>> 8)
    this[offset] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, true)
  }
  return offset + 4
}

Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24)
    this[offset + 1] = (value >>> 16)
    this[offset + 2] = (value >>> 8)
    this[offset + 3] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, false)
  }
  return offset + 4
}

Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = 0
  var mul = 1
  var sub = value < 0 ? 1 : 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = byteLength - 1
  var mul = 1
  var sub = value < 0 ? 1 : 0
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80)
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
  if (value < 0) value = 0xff + value + 1
  this[offset] = (value & 0xff)
  return offset + 1
}

Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
  } else {
    objectWriteUInt16(this, value, offset, true)
  }
  return offset + 2
}

Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8)
    this[offset + 1] = (value & 0xff)
  } else {
    objectWriteUInt16(this, value, offset, false)
  }
  return offset + 2
}

Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
    this[offset + 2] = (value >>> 16)
    this[offset + 3] = (value >>> 24)
  } else {
    objectWriteUInt32(this, value, offset, true)
  }
  return offset + 4
}

Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (value < 0) value = 0xffffffff + value + 1
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24)
    this[offset + 1] = (value >>> 16)
    this[offset + 2] = (value >>> 8)
    this[offset + 3] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, false)
  }
  return offset + 4
}

function checkIEEE754 (buf, value, offset, ext, max, min) {
  if (value > max || value < min) throw new RangeError('value is out of bounds')
  if (offset + ext > buf.length) throw new RangeError('index out of range')
  if (offset < 0) throw new RangeError('index out of range')
}

function writeFloat (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38)
  }
  ieee754.write(buf, value, offset, littleEndian, 23, 4)
  return offset + 4
}

Buffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
  return writeFloat(this, value, offset, true, noAssert)
}

Buffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
  return writeFloat(this, value, offset, false, noAssert)
}

function writeDouble (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308)
  }
  ieee754.write(buf, value, offset, littleEndian, 52, 8)
  return offset + 8
}

Buffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
  return writeDouble(this, value, offset, true, noAssert)
}

Buffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
  return writeDouble(this, value, offset, false, noAssert)
}

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function copy (target, targetStart, start, end) {
  if (!start) start = 0
  if (!end && end !== 0) end = this.length
  if (targetStart >= target.length) targetStart = target.length
  if (!targetStart) targetStart = 0
  if (end > 0 && end < start) end = start

  // Copy 0 bytes; we're done
  if (end === start) return 0
  if (target.length === 0 || this.length === 0) return 0

  // Fatal error conditions
  if (targetStart < 0) {
    throw new RangeError('targetStart out of bounds')
  }
  if (start < 0 || start >= this.length) throw new RangeError('sourceStart out of bounds')
  if (end < 0) throw new RangeError('sourceEnd out of bounds')

  // Are we oob?
  if (end > this.length) end = this.length
  if (target.length - targetStart < end - start) {
    end = target.length - targetStart + start
  }

  var len = end - start
  var i

  if (this === target && start < targetStart && targetStart < end) {
    // descending copy from end
    for (i = len - 1; i >= 0; i--) {
      target[i + targetStart] = this[i + start]
    }
  } else if (len < 1000 || !Buffer.TYPED_ARRAY_SUPPORT) {
    // ascending copy from start
    for (i = 0; i < len; i++) {
      target[i + targetStart] = this[i + start]
    }
  } else {
    target._set(this.subarray(start, start + len), targetStart)
  }

  return len
}

// fill(value, start=0, end=buffer.length)
Buffer.prototype.fill = function fill (value, start, end) {
  if (!value) value = 0
  if (!start) start = 0
  if (!end) end = this.length

  if (end < start) throw new RangeError('end < start')

  // Fill 0 bytes; we're done
  if (end === start) return
  if (this.length === 0) return

  if (start < 0 || start >= this.length) throw new RangeError('start out of bounds')
  if (end < 0 || end > this.length) throw new RangeError('end out of bounds')

  var i
  if (typeof value === 'number') {
    for (i = start; i < end; i++) {
      this[i] = value
    }
  } else {
    var bytes = utf8ToBytes(value.toString())
    var len = bytes.length
    for (i = start; i < end; i++) {
      this[i] = bytes[i % len]
    }
  }

  return this
}

/**
 * Creates a new `ArrayBuffer` with the *copied* memory of the buffer instance.
 * Added in Node 0.12. Only available in browsers that support ArrayBuffer.
 */
Buffer.prototype.toArrayBuffer = function toArrayBuffer () {
  if (typeof Uint8Array !== 'undefined') {
    if (Buffer.TYPED_ARRAY_SUPPORT) {
      return (new Buffer(this)).buffer
    } else {
      var buf = new Uint8Array(this.length)
      for (var i = 0, len = buf.length; i < len; i += 1) {
        buf[i] = this[i]
      }
      return buf.buffer
    }
  } else {
    throw new TypeError('Buffer.toArrayBuffer not supported in this browser')
  }
}

// HELPER FUNCTIONS
// ================

var BP = Buffer.prototype

/**
 * Augment a Uint8Array *instance* (not the Uint8Array class!) with Buffer methods
 */
Buffer._augment = function _augment (arr) {
  arr.constructor = Buffer
  arr._isBuffer = true

  // save reference to original Uint8Array set method before overwriting
  arr._set = arr.set

  // deprecated
  arr.get = BP.get
  arr.set = BP.set

  arr.write = BP.write
  arr.toString = BP.toString
  arr.toLocaleString = BP.toString
  arr.toJSON = BP.toJSON
  arr.equals = BP.equals
  arr.compare = BP.compare
  arr.indexOf = BP.indexOf
  arr.copy = BP.copy
  arr.slice = BP.slice
  arr.readUIntLE = BP.readUIntLE
  arr.readUIntBE = BP.readUIntBE
  arr.readUInt8 = BP.readUInt8
  arr.readUInt16LE = BP.readUInt16LE
  arr.readUInt16BE = BP.readUInt16BE
  arr.readUInt32LE = BP.readUInt32LE
  arr.readUInt32BE = BP.readUInt32BE
  arr.readIntLE = BP.readIntLE
  arr.readIntBE = BP.readIntBE
  arr.readInt8 = BP.readInt8
  arr.readInt16LE = BP.readInt16LE
  arr.readInt16BE = BP.readInt16BE
  arr.readInt32LE = BP.readInt32LE
  arr.readInt32BE = BP.readInt32BE
  arr.readFloatLE = BP.readFloatLE
  arr.readFloatBE = BP.readFloatBE
  arr.readDoubleLE = BP.readDoubleLE
  arr.readDoubleBE = BP.readDoubleBE
  arr.writeUInt8 = BP.writeUInt8
  arr.writeUIntLE = BP.writeUIntLE
  arr.writeUIntBE = BP.writeUIntBE
  arr.writeUInt16LE = BP.writeUInt16LE
  arr.writeUInt16BE = BP.writeUInt16BE
  arr.writeUInt32LE = BP.writeUInt32LE
  arr.writeUInt32BE = BP.writeUInt32BE
  arr.writeIntLE = BP.writeIntLE
  arr.writeIntBE = BP.writeIntBE
  arr.writeInt8 = BP.writeInt8
  arr.writeInt16LE = BP.writeInt16LE
  arr.writeInt16BE = BP.writeInt16BE
  arr.writeInt32LE = BP.writeInt32LE
  arr.writeInt32BE = BP.writeInt32BE
  arr.writeFloatLE = BP.writeFloatLE
  arr.writeFloatBE = BP.writeFloatBE
  arr.writeDoubleLE = BP.writeDoubleLE
  arr.writeDoubleBE = BP.writeDoubleBE
  arr.fill = BP.fill
  arr.inspect = BP.inspect
  arr.toArrayBuffer = BP.toArrayBuffer

  return arr
}

var INVALID_BASE64_RE = /[^+\/0-9A-Za-z-_]/g

function base64clean (str) {
  // Node strips out invalid characters like \n and \t from the string, base64-js does not
  str = stringtrim(str).replace(INVALID_BASE64_RE, '')
  // Node converts strings with length < 2 to ''
  if (str.length < 2) return ''
  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
  while (str.length % 4 !== 0) {
    str = str + '='
  }
  return str
}

function stringtrim (str) {
  if (str.trim) return str.trim()
  return str.replace(/^\s+|\s+$/g, '')
}

function toHex (n) {
  if (n < 16) return '0' + n.toString(16)
  return n.toString(16)
}

function utf8ToBytes (string, units) {
  units = units || Infinity
  var codePoint
  var length = string.length
  var leadSurrogate = null
  var bytes = []

  for (var i = 0; i < length; i++) {
    codePoint = string.charCodeAt(i)

    // is surrogate component
    if (codePoint > 0xD7FF && codePoint < 0xE000) {
      // last char was a lead
      if (!leadSurrogate) {
        // no lead yet
        if (codePoint > 0xDBFF) {
          // unexpected trail
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        } else if (i + 1 === length) {
          // unpaired lead
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        }

        // valid lead
        leadSurrogate = codePoint

        continue
      }

      // 2 leads in a row
      if (codePoint < 0xDC00) {
        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
        leadSurrogate = codePoint
        continue
      }

      // valid surrogate pair
      codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000
    } else if (leadSurrogate) {
      // valid bmp char, but last char was a lead
      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
    }

    leadSurrogate = null

    // encode utf8
    if (codePoint < 0x80) {
      if ((units -= 1) < 0) break
      bytes.push(codePoint)
    } else if (codePoint < 0x800) {
      if ((units -= 2) < 0) break
      bytes.push(
        codePoint >> 0x6 | 0xC0,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x10000) {
      if ((units -= 3) < 0) break
      bytes.push(
        codePoint >> 0xC | 0xE0,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x110000) {
      if ((units -= 4) < 0) break
      bytes.push(
        codePoint >> 0x12 | 0xF0,
        codePoint >> 0xC & 0x3F | 0x80,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else {
      throw new Error('Invalid code point')
    }
  }

  return bytes
}

function asciiToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; i++) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF)
  }
  return byteArray
}

function utf16leToBytes (str, units) {
  var c, hi, lo
  var byteArray = []
  for (var i = 0; i < str.length; i++) {
    if ((units -= 2) < 0) break

    c = str.charCodeAt(i)
    hi = c >> 8
    lo = c % 256
    byteArray.push(lo)
    byteArray.push(hi)
  }

  return byteArray
}

function base64ToBytes (str) {
  return base64.toByteArray(base64clean(str))
}

function blitBuffer (src, dst, offset, length) {
  for (var i = 0; i < length; i++) {
    if ((i + offset >= dst.length) || (i >= src.length)) break
    dst[i + offset] = src[i]
  }
  return i
}

},
function(require, exports, module, undefined, global) {
/*@=-base64-js@0.0.8/lib/b64.js-=@*/
var lookup = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

;(function (exports) {
	'use strict';

  var Arr = (typeof Uint8Array !== 'undefined')
    ? Uint8Array
    : Array

	var PLUS   = '+'.charCodeAt(0)
	var SLASH  = '/'.charCodeAt(0)
	var NUMBER = '0'.charCodeAt(0)
	var LOWER  = 'a'.charCodeAt(0)
	var UPPER  = 'A'.charCodeAt(0)
	var PLUS_URL_SAFE = '-'.charCodeAt(0)
	var SLASH_URL_SAFE = '_'.charCodeAt(0)

	function decode (elt) {
		var code = elt.charCodeAt(0)
		if (code === PLUS ||
		    code === PLUS_URL_SAFE)
			return 62 // '+'
		if (code === SLASH ||
		    code === SLASH_URL_SAFE)
			return 63 // '/'
		if (code < NUMBER)
			return -1 //no match
		if (code < NUMBER + 10)
			return code - NUMBER + 26 + 26
		if (code < UPPER + 26)
			return code - UPPER
		if (code < LOWER + 26)
			return code - LOWER + 26
	}

	function b64ToByteArray (b64) {
		var i, j, l, tmp, placeHolders, arr

		if (b64.length % 4 > 0) {
			throw new Error('Invalid string. Length must be a multiple of 4')
		}

		// the number of equal signs (place holders)
		// if there are two placeholders, than the two characters before it
		// represent one byte
		// if there is only one, then the three characters before it represent 2 bytes
		// this is just a cheap hack to not do indexOf twice
		var len = b64.length
		placeHolders = '=' === b64.charAt(len - 2) ? 2 : '=' === b64.charAt(len - 1) ? 1 : 0

		// base64 is 4/3 + up to two characters of the original data
		arr = new Arr(b64.length * 3 / 4 - placeHolders)

		// if there are placeholders, only get up to the last complete 4 chars
		l = placeHolders > 0 ? b64.length - 4 : b64.length

		var L = 0

		function push (v) {
			arr[L++] = v
		}

		for (i = 0, j = 0; i < l; i += 4, j += 3) {
			tmp = (decode(b64.charAt(i)) << 18) | (decode(b64.charAt(i + 1)) << 12) | (decode(b64.charAt(i + 2)) << 6) | decode(b64.charAt(i + 3))
			push((tmp & 0xFF0000) >> 16)
			push((tmp & 0xFF00) >> 8)
			push(tmp & 0xFF)
		}

		if (placeHolders === 2) {
			tmp = (decode(b64.charAt(i)) << 2) | (decode(b64.charAt(i + 1)) >> 4)
			push(tmp & 0xFF)
		} else if (placeHolders === 1) {
			tmp = (decode(b64.charAt(i)) << 10) | (decode(b64.charAt(i + 1)) << 4) | (decode(b64.charAt(i + 2)) >> 2)
			push((tmp >> 8) & 0xFF)
			push(tmp & 0xFF)
		}

		return arr
	}

	function uint8ToBase64 (uint8) {
		var i,
			extraBytes = uint8.length % 3, // if we have 1 byte left, pad 2 bytes
			output = "",
			temp, length

		function encode (num) {
			return lookup.charAt(num)
		}

		function tripletToBase64 (num) {
			return encode(num >> 18 & 0x3F) + encode(num >> 12 & 0x3F) + encode(num >> 6 & 0x3F) + encode(num & 0x3F)
		}

		// go through the array every three bytes, we'll deal with trailing stuff later
		for (i = 0, length = uint8.length - extraBytes; i < length; i += 3) {
			temp = (uint8[i] << 16) + (uint8[i + 1] << 8) + (uint8[i + 2])
			output += tripletToBase64(temp)
		}

		// pad the end with zeros, but make sure to not forget the extra bytes
		switch (extraBytes) {
			case 1:
				temp = uint8[uint8.length - 1]
				output += encode(temp >> 2)
				output += encode((temp << 4) & 0x3F)
				output += '=='
				break
			case 2:
				temp = (uint8[uint8.length - 2] << 8) + (uint8[uint8.length - 1])
				output += encode(temp >> 10)
				output += encode((temp >> 4) & 0x3F)
				output += encode((temp << 2) & 0x3F)
				output += '='
				break
		}

		return output
	}

	exports.toByteArray = b64ToByteArray
	exports.fromByteArray = uint8ToBase64
}(typeof exports === 'undefined' ? (this.base64js = {}) : exports))

},
function(require, exports, module, undefined, global) {
/*@=-ieee754@1.1.8/index.js-=@*/
exports.read = function (buffer, offset, isLE, mLen, nBytes) {
  var e, m
  var eLen = nBytes * 8 - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var nBits = -7
  var i = isLE ? (nBytes - 1) : 0
  var d = isLE ? -1 : 1
  var s = buffer[offset + i]

  i += d

  e = s & ((1 << (-nBits)) - 1)
  s >>= (-nBits)
  nBits += eLen
  for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8) {}

  m = e & ((1 << (-nBits)) - 1)
  e >>= (-nBits)
  nBits += mLen
  for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8) {}

  if (e === 0) {
    e = 1 - eBias
  } else if (e === eMax) {
    return m ? NaN : ((s ? -1 : 1) * Infinity)
  } else {
    m = m + Math.pow(2, mLen)
    e = e - eBias
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
}

exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c
  var eLen = nBytes * 8 - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0)
  var i = isLE ? 0 : (nBytes - 1)
  var d = isLE ? 1 : -1
  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0

  value = Math.abs(value)

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0
    e = eMax
  } else {
    e = Math.floor(Math.log(value) / Math.LN2)
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--
      c *= 2
    }
    if (e + eBias >= 1) {
      value += rt / c
    } else {
      value += rt * Math.pow(2, 1 - eBias)
    }
    if (value * c >= 2) {
      e++
      c /= 2
    }

    if (e + eBias >= eMax) {
      m = 0
      e = eMax
    } else if (e + eBias >= 1) {
      m = (value * c - 1) * Math.pow(2, mLen)
      e = e + eBias
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen)
      e = 0
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

  e = (e << mLen) | m
  eLen += mLen
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

  buffer[offset + i - d] |= s * 128
}

},
function(require, exports, module, undefined, global) {
/*@=-isarray@1.0.0/index.js-=@*/
var toString = {}.toString;

module.exports = Array.isArray || function (arr) {
  return toString.call(arr) == '[object Array]';
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
var isLength = require(27),
    isFunction = require(28),
    isObject = require(29);


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
var apply = require(30),
    isFunction = require(28),
    isUndefined = require(18);


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
var isNumber = require(20);


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
var clamp = require(32),
    isNumber = require(20);


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
var isObject = require(29),
    isFunction = require(28),
    isPrimitive = require(33),
    isNative = require(34),
    has = require(35);


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
var isNative = require(34),
    emptyFunction = require(40);


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
var isNumber = require(20);


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
var isNull = require(17);


module.exports = isObject;


function isObject(value) {
    var type = typeof(value);
    return type === "function" || (!isNull(value) && type === "object") || false;
}

},
function(require, exports, module, undefined, global) {
/*@=-@nathanfaucett/apply@0.0.1/src/index.js-=@*/
var isNullOrUndefined = require(31);


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
var isNull = require(17),
    isUndefined = require(18);


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
var isNullOrUndefined = require(31);


module.exports = isPrimitive;


function isPrimitive(obj) {
    var typeStr;
    return isNullOrUndefined(obj) || ((typeStr = typeof(obj)) !== "object" && typeStr !== "function") || false;
}

},
function(require, exports, module, undefined, global) {
/*@=-@nathanfaucett/is_native@0.0.2/src/index.js-=@*/
var isFunction = require(28),
    isNullOrUndefined = require(31),
    escapeRegExp = require(36);


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
var isNative = require(34),
    getPrototypeOf = require(39),
    isNullOrUndefined = require(31);


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
var toString = require(37);


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
var isString = require(38),
    isNullOrUndefined = require(31);


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
var isObject = require(29),
    isNative = require(34),
    isNullOrUndefined = require(31);


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
var WeakMapPolyfill = require(45),
    isNumber = require(20),
    isString = require(38),
    isFunction = require(28),
    isBoolean = require(46),
    isNullOrUndefined = require(31),
    numberHashCode = require(47),
    booleanHashCode = require(48),
    stringHashCode = require(49);


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
var inherits = require(51),
    BaseIterator = require(21);


module.exports = Iterator;


function Iterator(hasNext, next) {
    this.hasNext = hasNext;
    this.next = next;
}
inherits(Iterator, BaseIterator);
},
function(require, exports, module, undefined, global) {
/*@=-@nathanfaucett/immutable-hash_map@0.0.4/src/BitmapIndexedNode.js-=@*/
var isNull = require(17),
    isEqual = require(26),
    hashCode = require(41),
    bitCount = require(59),
    consts = require(60),
    bitpos = require(61),
    arrayCopy = require(62),
    cloneAndSet = require(63),
    removePair = require(64),
    mask = require(65),
    nodeIterator = require(66),
    ArrayNode, createNode;


var baseArrayCopy = arrayCopy.base,
    SHIFT = consts.SHIFT,
    MAX_BITMAP_INDEXED_SIZE = consts.MAX_BITMAP_INDEXED_SIZE,
    EMPTY = new BitmapIndexedNode(0, []),
    BitmapIndexedNodePrototype = BitmapIndexedNode.prototype;


module.exports = BitmapIndexedNode;


ArrayNode = require(67);
createNode = require(68);


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
var isNative = require(34),
    isPrimitive = require(33),
    createStore = require(50);


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
var isUndefined = require(18);


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
var has = require(35),
    defineProperty = require(24),
    isPrimitive = require(33);


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
var create = require(52),
    extend = require(53),
    mixin = require(54),
    defineProperty = require(55);


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
var isNull = require(17),
    isNative = require(34),
    isPrimitive = require(33);


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
var keys = require(56),
    isNative = require(34);


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
var keys = require(58),
    isNullOrUndefined = require(31);


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
var isObject = require(29),
    isFunction = require(28),
    isPrimitive = require(33),
    isNative = require(34),
    has = require(57);


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
var has = require(57),
    isNative = require(34),
    isNullOrUndefined = require(31),
    isObject = require(29);


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
var isNative = require(34),
    getPrototypeOf = require(39),
    isNullOrUndefined = require(31);


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
var has = require(35),
    isNative = require(34),
    isNullOrUndefined = require(31),
    isObject = require(29);


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
var mask = require(65);


module.exports = bitpos;


function bitpos(hashCode, shift) {
    return 1 << mask(hashCode, shift);
}
},
function(require, exports, module, undefined, global) {
/*@=-@nathanfaucett/array_copy@0.0.1/src/index.js-=@*/
var clamp = require(32),
    isUndefined = require(18);


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
var isUndefined = require(18),
    arrayCopy = require(62);


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
var arrayCopy = require(62);


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
var consts = require(60);


var MASK = consts.MASK;


module.exports = mask;


function mask(hashCode, shift) {
    return (hashCode >>> shift) & MASK;
}
},
function(require, exports, module, undefined, global) {
/*@=-@nathanfaucett/immutable-hash_map@0.0.4/src/nodeIterator.js-=@*/
var isNull = require(17),
    isUndefined = require(18),
    Iterator = require(43);


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
var isNull = require(17),
    isNullOrUndefined = require(31),
    consts = require(60),
    mask = require(65),
    cloneAndSet = require(63),
    Iterator = require(43),
    BitmapIndexedNode;


var SHIFT = consts.SHIFT,
    MAX_ARRAY_MAP_SIZE = consts.MAX_ARRAY_MAP_SIZE,
    EMPTY = new ArrayNode(0, []),
    IteratorValue = Iterator.Value,
    ArrayNodePrototype = ArrayNode.prototype;


module.exports = ArrayNode;


BitmapIndexedNode = require(44);


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
var hashCode = require(41),
    Box = require(42),
    HashCollisionNode, BitmapIndexedNode;


module.exports = createNode;


HashCollisionNode = require(69);
BitmapIndexedNode = require(44);


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
var isEqual = require(26),
    bitpos = require(61),
    arrayCopy = require(62),
    cloneAndSet = require(63),
    removePair = require(64),
    nodeIterator = require(66),
    BitmapIndexedNode;


var baseArrayCopy = arrayCopy.base,
    EMPTY = new HashCollisionNode(0, []),
    HashCollisionNodePrototype = HashCollisionNode.prototype;


module.exports = HashCollisionNode;


BitmapIndexedNode = require(44);


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
var has = require(35),
    freeze = require(25),
    isNull = require(17),
    isUndefined = require(18),
    isObject = require(29),
    defineProperty = require(24),
    isEqual = require(26),
    hashCode = require(41),
    isArrayLike = require(19),
    fastBindThis = require(22),
    Box = require(71),
    Iterator = require(72),
    BitmapIndexedNode = require(73);


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
var inherits = require(51),
    BaseIterator = require(21);


module.exports = Iterator;


function Iterator(hasNext, next) {
    this.hasNext = hasNext;
    this.next = next;
}
inherits(Iterator, BaseIterator);
},
function(require, exports, module, undefined, global) {
/*@=-@nathanfaucett/immutable-hash_map@0.0.2/src/BitmapIndexedNode.js-=@*/
var isNull = require(17),
    isEqual = require(26),
    hashCode = require(41),
    bitCount = require(59),
    consts = require(74),
    bitpos = require(75),
    arrayCopy = require(62),
    cloneAndSet = require(76),
    removePair = require(77),
    mask = require(78),
    nodeIterator = require(79),
    ArrayNode, createNode;


var baseArrayCopy = arrayCopy.base,
    SHIFT = consts.SHIFT,
    MAX_BITMAP_INDEXED_SIZE = consts.MAX_BITMAP_INDEXED_SIZE,
    EMPTY = new BitmapIndexedNode(0, []),
    BitmapIndexedNodePrototype = BitmapIndexedNode.prototype;


module.exports = BitmapIndexedNode;


ArrayNode = require(80);
createNode = require(81);


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
var mask = require(78);


module.exports = bitpos;


function bitpos(hashCode, shift) {
    return 1 << mask(hashCode, shift);
}
},
function(require, exports, module, undefined, global) {
/*@=-@nathanfaucett/immutable-hash_map@0.0.2/src/cloneAndSet.js-=@*/
var isUndefined = require(18),
    arrayCopy = require(62);


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
var arrayCopy = require(62);


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
var consts = require(74);


var MASK = consts.MASK;


module.exports = mask;


function mask(hashCode, shift) {
    return (hashCode >>> shift) & MASK;
}
},
function(require, exports, module, undefined, global) {
/*@=-@nathanfaucett/immutable-hash_map@0.0.2/src/nodeIterator.js-=@*/
var isNull = require(17),
    isUndefined = require(18),
    Iterator = require(72);


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
var isNull = require(17),
    isNullOrUndefined = require(31),
    consts = require(74),
    mask = require(78),
    cloneAndSet = require(76),
    Iterator = require(72),
    BitmapIndexedNode;


var SHIFT = consts.SHIFT,
    MAX_ARRAY_MAP_SIZE = consts.MAX_ARRAY_MAP_SIZE,
    EMPTY = new ArrayNode(0, []),
    IteratorValue = Iterator.Value,
    ArrayNodePrototype = ArrayNode.prototype;


module.exports = ArrayNode;


BitmapIndexedNode = require(73);


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
var hashCode = require(41),
    Box = require(71),
    HashCollisionNode, BitmapIndexedNode;


module.exports = createNode;


HashCollisionNode = require(82);
BitmapIndexedNode = require(73);


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
var isEqual = require(26),
    bitpos = require(75),
    arrayCopy = require(62),
    cloneAndSet = require(76),
    removePair = require(77),
    nodeIterator = require(79),
    BitmapIndexedNode;


var baseArrayCopy = arrayCopy.base,
    EMPTY = new HashCollisionNode(0, []),
    HashCollisionNodePrototype = HashCollisionNode.prototype;


module.exports = HashCollisionNode;


BitmapIndexedNode = require(73);


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
var has = require(35),
    freeze = require(25),
    isNull = require(17),
    isUndefined = require(18),
    isObject = require(29),
    defineProperty = require(24),
    isEqual = require(26),
    hashCode = require(41),
    isArrayLike = require(19),
    fastBindThis = require(22),
    Box = require(84),
    Iterator = require(85),
    BitmapIndexedNode = require(86);


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
var inherits = require(51),
    BaseIterator = require(21);


module.exports = Iterator;


function Iterator(hasNext, next) {
    this.hasNext = hasNext;
    this.next = next;
}
inherits(Iterator, BaseIterator);
},
function(require, exports, module, undefined, global) {
/*@=-@nathanfaucett/immutable-hash_map@0.0.3/src/BitmapIndexedNode.js-=@*/
var isNull = require(17),
    isEqual = require(26),
    hashCode = require(41),
    bitCount = require(59),
    consts = require(87),
    bitpos = require(88),
    arrayCopy = require(62),
    cloneAndSet = require(89),
    removePair = require(90),
    mask = require(91),
    nodeIterator = require(92),
    ArrayNode, createNode;


var baseArrayCopy = arrayCopy.base,
    SHIFT = consts.SHIFT,
    MAX_BITMAP_INDEXED_SIZE = consts.MAX_BITMAP_INDEXED_SIZE,
    EMPTY = new BitmapIndexedNode(0, []),
    BitmapIndexedNodePrototype = BitmapIndexedNode.prototype;


module.exports = BitmapIndexedNode;


ArrayNode = require(93);
createNode = require(94);


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
var mask = require(91);


module.exports = bitpos;


function bitpos(hashCode, shift) {
    return 1 << mask(hashCode, shift);
}
},
function(require, exports, module, undefined, global) {
/*@=-@nathanfaucett/immutable-hash_map@0.0.3/src/cloneAndSet.js-=@*/
var isUndefined = require(18),
    arrayCopy = require(62);


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
var arrayCopy = require(62);


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
var consts = require(87);


var MASK = consts.MASK;


module.exports = mask;


function mask(hashCode, shift) {
    return (hashCode >>> shift) & MASK;
}
},
function(require, exports, module, undefined, global) {
/*@=-@nathanfaucett/immutable-hash_map@0.0.3/src/nodeIterator.js-=@*/
var isNull = require(17),
    isUndefined = require(18),
    Iterator = require(85);


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
var isNull = require(17),
    isNullOrUndefined = require(31),
    consts = require(87),
    mask = require(91),
    cloneAndSet = require(89),
    Iterator = require(85),
    BitmapIndexedNode;


var SHIFT = consts.SHIFT,
    MAX_ARRAY_MAP_SIZE = consts.MAX_ARRAY_MAP_SIZE,
    EMPTY = new ArrayNode(0, []),
    IteratorValue = Iterator.Value,
    ArrayNodePrototype = ArrayNode.prototype;


module.exports = ArrayNode;


BitmapIndexedNode = require(86);


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
var hashCode = require(41),
    Box = require(84),
    HashCollisionNode, BitmapIndexedNode;


module.exports = createNode;


HashCollisionNode = require(95);
BitmapIndexedNode = require(86);


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
var isEqual = require(26),
    bitpos = require(88),
    arrayCopy = require(62),
    cloneAndSet = require(89),
    removePair = require(90),
    nodeIterator = require(92),
    BitmapIndexedNode;


var baseArrayCopy = arrayCopy.base,
    EMPTY = new HashCollisionNode(0, []),
    HashCollisionNodePrototype = HashCollisionNode.prototype;


module.exports = HashCollisionNode;


BitmapIndexedNode = require(86);


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
