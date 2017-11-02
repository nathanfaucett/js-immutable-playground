var jsconsole = require("./jsconsole");


window.onload = function() {
    jsconsole(
        document.getElementById("jsconsole"),
        "var list = ImmutableList.of(0, 1, 2, 3, 4);"
    );
};
