"use strict";
var Heap = (function () {
    function Heap(nodeList, key) {
        this.heap = [];
        this.b_heap = {};
        this.heap = nodeList;
        this.key = key;
        this.update();
    }
    Heap.prototype.get = function (index) {
        if (index >= 0 && index < this.heap.length) {
            return this.heap[index];
        }
    };
    Heap.prototype.set = function (index) {
    };
    Heap.prototype.push = function (node) {
        this.heap.push(node);
        this.goUp(this.heap.length - 1);
    };
    Heap.prototype.pop = function () {
        if (this.isEmpty())
            return;
        var result;
        this.swap(0, this.heap.length - 1);
        result = this.heap.pop();
        !this.isEmpty() && this.goDown(0);
        return result;
    };
    Heap.prototype.remove = function (index) {
        if (index < 0 || index >= this.heap.length)
            return;
    };
    Heap.prototype.top = function () {
        if (this.heap[0])
            return this.heap[0];
    };
    Heap.prototype.getValue = function (index) {
        if (index < 0 || index >= this.heap.length)
            return;
        return this.heap[index][this.key];
    };
    Heap.prototype.isEmpty = function () {
        return !this.heap.length;
    };
    Heap.prototype.has = function (node) {
        var queryStr = node.value.toString();
        return !!this.b_heap[queryStr];
    };
    Heap.prototype.update = function () {
        for (var i = Math.floor(this.heap.length / 2); i > -1; i--) {
            this.goDown(i);
        }
    };
    Heap.prototype.goUp = function (index) {
        var heap = this;
        var value = heap.getValue(index), parent = heap.getParentIndex(index);
        if (!parent)
            return;
        if (heap.getValue(parent) < heap.getValue(index)) {
            this.swap(index, parent);
            this.goUp(parent);
        }
    };
    Heap.prototype.goDown = function (index) {
        var heap = this;
        var value = heap.getValue(index), _a = heap.getChildIndex(index), left = _a[0], right = _a[1];
        if (left && right) {
            var swapIndex = heap.getValue(left) < heap.getValue(right) ? left : right;
            if (heap.getValue[swapIndex] < heap.getValue[index]) {
                heap.swap(index, swapIndex);
                heap.goDown(swapIndex);
            }
        }
        else if (left !== null) {
            if (heap.getValue[left] < heap.getValue[index]) {
                heap.swap(index, left);
                heap.goDown(left);
            }
        }
        else {
            console.log("go down: no children!");
        }
    };
    Heap.prototype.getParentIndex = function (index) {
        if (index < 0 || index >= this.heap.length)
            return;
        if (index === 0)
            return 0;
        return Math.floor((index - 1) / 2);
    };
    Heap.prototype.getChildIndex = function (index) {
        var left = 2 * index + 1, right = 2 * index + 2, length = this.heap.length;
        if (right <= length - 1) {
            return [left, right];
        }
        else if (left === length - 1) {
            return [left, null];
        }
        else {
            return [null, null];
        }
    };
    Heap.prototype.swap = function (parentIndex, childIndex) {
        var tmp = this.heap[parentIndex];
        this.heap[parentIndex] = this.heap[childIndex];
        this.heap[childIndex] = tmp;
    };
    return Heap;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Heap;
