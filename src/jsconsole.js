var vm = require("vm"),
    util = require("util"),
    ImmutableList = require("@nathanfaucett/immutable-list"),
    ImmutableVector = require("@nathanfaucett/immutable-vector"),
    ImmutableHashMap = require("@nathanfaucett/immutable-hash_map"),
    ImmutableSet = require("@nathanfaucett/immutable-set"),
    ImmutableRecord = require("@nathanfaucett/immutable-record");


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
