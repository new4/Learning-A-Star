"use strict";
var minHeap = (function () {
    function minHeap(heapArr) {
        this.heap = [];
        for (var i = 0, len = heapArr.length; i < len; i++) {
            this.push(heapArr[i]);
        }
    }
    minHeap.prototype.get = function (index) {
        if (index >= 0 && index < this.heap.length) {
            return this.heap[index];
        }
    };
    minHeap.prototype.push = function (item) {
        this.heap.push(item);
        this.goUp(this.heap.length - 1);
    };
    minHeap.prototype.pop = function () {
        if (this.isEmpty())
            return;
        var result;
        this.swap(0, this.heap.length - 1);
        result = this.heap.pop();
        !this.isEmpty() && this.goDown(0);
        return result;
    };
    minHeap.prototype.remove = function (index) {
        if (index < 0 || index >= this.heap.length)
            return;
        this.swap(0, index);
        this.pop();
        this.goUp(index);
    };
    minHeap.prototype.top = function () {
        return this.getValue(0);
    };
    minHeap.prototype.isEmpty = function () {
        return !this.heap.length;
    };
    minHeap.prototype.getValue = function (index) {
        if (index < 0 || index >= this.heap.length)
            return;
        return this.heap[index];
    };
    minHeap.prototype.goUp = function (index) {
        var value = this.getValue(index), parent = this.getParentIndex(index);
        if (parent === undefined)
            return;
        if (this.getValue(parent) > this.getValue(index)) {
            this.swap(index, parent);
            this.goUp(parent);
        }
    };
    minHeap.prototype.goDown = function (index) {
        var value = this.getValue(index), _a = this.getChildIndex(index), left = _a[0], right = _a[1], swapIndex = left;
        if (left === null)
            return;
        if (right) {
            swapIndex = this.getValue(left) < this.getValue(right) ? left : right;
        }
        if (this.getValue(swapIndex) < value) {
            this.swap(index, swapIndex);
            this.goDown(swapIndex);
        }
    };
    minHeap.prototype.getParentIndex = function (index) {
        if (index < 0 || index >= this.heap.length)
            return;
        if (index === 0)
            return 0;
        return Math.floor((index - 1) / 2);
    };
    minHeap.prototype.getChildIndex = function (index) {
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
    minHeap.prototype.swap = function (index1, index2) {
        var tmp = this.heap[index1];
        this.heap[index1] = this.heap[index2];
        this.heap[index2] = tmp;
    };
    return minHeap;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = minHeap;
