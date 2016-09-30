"use strict";
var Heap = (function () {
    function Heap(nodeList, key) {
        this.heap = [];
        this.b_heap = {};
        this.heap = nodeList;
        this.key = key;
        this.update();
    }
    Heap.prototype.push = function (node) {
        this.heap.push(node);
        this.update();
    };
    Heap.prototype.pop = function () {
        if (this.isEmpty())
            return;
        var result = this.heap.shift();
        !this.isEmpty() && this.update();
        return result;
    };
    Heap.prototype.top = function () {
        return this.heap[0];
    };
    Heap.prototype.isEmpty = function () {
        return !this.heap.length;
    };
    Heap.prototype.has = function (node) {
        var queryStr = node.value.toString();
        return !!this.b_heap[queryStr];
    };
    Heap.prototype.update = function () {
        console.log("heap update!");
        for (var i = Math.floor(this.heap.length / 2); i > -1; i--) {
            this.sink(i);
        }
    };
    Heap.prototype.sink = function (index) {
        console.log(" ---------- sink " + index + " ----------");
        if (index >= Math.floor(this.heap.length / 2))
            return;
        var value = this.heap[index][this.key];
        var _a = this.getChildIndex(index), left = _a[0], right = _a[1];
        if (left && this.heap[left] && this.heap[left][this.key] < value)
            this.swap(index, left);
        if (right && this.heap[right] && this.heap[right][this.key] < value)
            this.swap(index, right);
    };
    Heap.prototype.getChildIndex = function (index) {
        var left, right;
        if (index >= Math.floor(this.heap.length / 2))
            return [null, null];
        left = 2 * index + 1;
        right = (left + 1) === this.heap.length ? (left + 1) : null;
        return [left, right];
    };
    Heap.prototype.swap = function (parent, child) {
        var tmp = this.heap[parent];
        this.heap[parent] = this.heap[child];
        this.heap[child] = tmp;
        this.sink(child);
    };
    Heap.getChildIndex = function (heap, index) {
        var left, right;
        if (index >= Math.floor(heap.length / 2))
            return;
        left = 2 * index + 1;
        right = (left + 1) === heap.length ? (left + 1) : null;
        return [left, right];
    };
    return Heap;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Heap;
