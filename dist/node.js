"use strict";
var util_1 = require('./util');
var Node = (function () {
    function Node(scale) {
        this.scale = scale;
        this.value = this.createNodeValueByScale(scale);
        this.zeroIndex = Math.pow(scale, 2) - 1;
        this.F = 0;
        this.currentCost = 0;
    }
    Node.prototype.shuffle = function () {
        for (var i = 0; i < 5; i++) {
            var direction = Math.floor(Math.random() * 4 + 1);
            this.moveTo(direction);
        }
    };
    Node.prototype.moveTo = function (direction) {
        if (!this.canMoveTo(direction))
            return;
        var targetIndex;
        switch (direction) {
            case util_1.DIRECTION.UP:
                targetIndex = this.zeroIndex - this.scale;
                break;
            case util_1.DIRECTION.RIGHT:
                targetIndex = this.zeroIndex + 1;
                break;
            case util_1.DIRECTION.DOWN:
                targetIndex = this.zeroIndex + this.scale;
                break;
            case util_1.DIRECTION.LEFT:
                targetIndex = this.zeroIndex - 1;
                break;
            default:
                targetIndex = this.zeroIndex;
        }
        this.value[this.zeroIndex] = this.value[targetIndex];
        this.value[targetIndex] = 0;
        this.zeroIndex = targetIndex;
    };
    Node.prototype.getNextNodes = function () {
        var node = this;
        var nextNodes = [];
        [util_1.DIRECTION.UP, util_1.DIRECTION.RIGHT, util_1.DIRECTION.DOWN, util_1.DIRECTION.LEFT].forEach(function (direction) {
            if (node.canMoveTo(direction)) {
                var newNode = Node.nodeClone(node);
                newNode.parent = node;
                newNode.moveTo(direction);
                nextNodes.push(newNode);
            }
        });
        return nextNodes;
    };
    Node.prototype.canMoveTo = function (direction) {
        var row = Math.floor(this.zeroIndex / this.scale);
        var col = this.zeroIndex % this.scale;
        switch (direction) {
            case util_1.DIRECTION.UP:
                return row !== 0;
            case util_1.DIRECTION.RIGHT:
                return col !== this.scale - 1;
            case util_1.DIRECTION.DOWN:
                return row !== this.scale - 1;
            case util_1.DIRECTION.LEFT:
                return col !== 0;
            default:
                return false;
        }
    };
    Node.prototype.getHeuristicToTarget = function (targetNode) {
        var result = 0;
        var diff = 0;
        var i = 0, len = this.value.length;
        for (; i < len; i++) {
            if (this.value[i] !== i + 1)
                diff++;
        }
        var manhatten = 0;
        for (i = 0; i < len; i++) {
            var v = this.value[i];
            if (v !== 0) {
                var row = Math.floor(i / this.scale);
                var col = i % this.scale;
                var _row = Math.floor(v / this.scale);
                var _col = v % this.scale;
                manhatten += Math.abs(row - _row) + Math.abs(col - _col);
            }
        }
        result = 5 * manhatten + 1 * diff;
        return result;
    };
    Node.prototype.getCurrentCost = function () {
        return this.currentCost;
    };
    Node.prototype.getCostToNext = function () {
        return 1;
    };
    Node.prototype.createNodeValueByScale = function (scale) {
        var val = [];
        for (var i = 1; i < Math.pow(scale, 2); i++) {
            val.push(i);
        }
        val.push(0);
        return val;
    };
    Node.isSame = function (currentNode, targetNode) {
        return currentNode.value.toString() === targetNode.value.toString();
    };
    Node.nodeClone = function (node) {
        var newNode = new Node(node.scale);
        newNode.value = node.value.slice(0);
        newNode.zeroIndex = node.zeroIndex;
        return newNode;
    };
    Node.costFromN2N = function (fromNode, toNode) {
    };
    return Node;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Node;
