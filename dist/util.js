"use strict";
(function (DIRECTION) {
    DIRECTION[DIRECTION["UP"] = 1] = "UP";
    DIRECTION[DIRECTION["RIGHT"] = 2] = "RIGHT";
    DIRECTION[DIRECTION["DOWN"] = 3] = "DOWN";
    DIRECTION[DIRECTION["LEFT"] = 4] = "LEFT";
})(exports.DIRECTION || (exports.DIRECTION = {}));
var DIRECTION = exports.DIRECTION;
;
function $id(eleId) {
    return document.getElementById(eleId);
}
exports.$id = $id;
;
function $createEle(tagName, id, className) {
    var ele = document.createElement(tagName);
    if (id)
        ele.id = id;
    if (className)
        ele.className = className;
    return ele;
}
exports.$createEle = $createEle;
;
function $replaceClass(className, str, prefix) {
    var result = "";
    var classArr = className.split(" ");
    for (var i = 0, len = classArr.length; i < len; i++) {
        var index = classArr[i].indexOf(prefix + "-");
        if (index !== -1) {
            classArr[i] = str;
        }
        result += classArr[i] + " ";
    }
    console.log("result -- ", result);
    return result.trim();
}
exports.$replaceClass = $replaceClass;
