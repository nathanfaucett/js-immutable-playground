var vm = require("vm"),
    util = require("util"),
    ImmutableList = require("@nathanfaucett/immutable-list"),
    ImmutableVector = require("@nathanfaucett/immutable-vector"),
    ImmutableHashMap = require("@nathanfaucett/immutable-hash_map"),
    ImmutableSet = require("@nathanfaucett/immutable-set"),
    ImmutableRecord = require("@nathanfaucett/immutable-record");


var context = {
    ImmutableList: ImmutableList,
    ImmutableVector: ImmutableVector,
    ImmutableHashMap: ImmutableHashMap,
    ImmutableSet: ImmutableSet,
    ImmutableRecord: ImmutableRecord
};

var history = [],
    historyIndex = 0;


var input = document.getElementById("input"),
    code = document.getElementById("code"),
    scroll = document.getElementById("scroll");

input.addEventListener("keypress", function onKeyPress(e) {
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
});

try {
    input.focus();
} catch(e) {}

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

evaluate("ImmutableList.of(0, 1, 2, 3, 4);");
