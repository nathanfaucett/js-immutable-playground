var vm = require("vm"),
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


var input = document.getElementById("input"),
    code = document.getElementById("code"),
    scroll = document.getElementById("scroll");

input.addEventListener("keypress", function onKeyPress(e) {
    if (e.which === 13) {
        evaluate(input.value || "\n");
    }
});


function evaluate(value) {
    var result = vm.runInNewContext(value, context);

    code.innerHTML += "> " + value + "\n";
    code.innerHTML += "  " + result + "\n";

    input.value = "";
    
    scroll.scrollTop = scroll.scrollHeight;
}

evaluate("ImmutableList.of(0, 1, 2, 3, 4);");
