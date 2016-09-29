"use strict";
var Heap = (function () {
    function Heap(nodeList) {
        this.heap = nodeList;
    }
    Heap.prototype.push = function (node) {
        console.log("push");
        this.heap.push();
    };
    Heap.prototype.pop = function () {
        console.log("pop");
        return this.heap.shift();
    };
    return Heap;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Heap;
