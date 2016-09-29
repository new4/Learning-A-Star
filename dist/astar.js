"use strict";
var heap_1 = require('./heap');
var Astar = (function () {
    function Astar(startNode, targetNode) {
        this.startNode = startNode;
        this.targetNode = targetNode;
        this.openList = [startNode];
        this.closedList = [];
    }
    Astar.prototype.run = function () {
        console.log("AStar Run !");
        var heap = new heap_1.default(this.openList);
        var currentNode = heap.pop();
        this.closedList.push(currentNode);
        var nextNodes = currentNode.getNextNodes();
        nextNodes.forEach(function (nextNode) {
        });
    };
    Astar.prototype.isBelongToClosed = function (str) {
        return !!this.b_closedList[str];
    };
    return Astar;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Astar;
