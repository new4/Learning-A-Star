"use strict";
var node_1 = require('./node');
var heap_1 = require('./heap');
var Astar = (function () {
    function Astar(startNode, targetNode) {
        this.startNode = startNode;
        this.targetNode = targetNode;
        this.openList = new heap_1.default([startNode], "F");
        this.closedList = [];
        this.b_closedList = {};
    }
    Astar.prototype.run = function () {
        console.time("AStar Run !");
        var astar = this;
        var count = 0;
        var _loop_1 = function() {
            var currentNode = astar.openList.pop();
            astar.closedList.push(currentNode);
            astar.b_closedList[currentNode.getValStr()] = 1;
            var nextNodes = currentNode.getNextNodes();
            count++;
            nextNodes.forEach(function (nextNode) {
                var cost = currentNode.getG() + currentNode.getCostToNext();
                var index = astar.openList.getItemIndex(nextNode);
                if (index !== undefined && cost < nextNode.getG()) {
                    console.log("next 1");
                    astar.openList.remove(index);
                }
                if (astar.isBelongToClosed(nextNode.getValStr()) && cost < nextNode.getG()) {
                    console.log("next 2");
                }
                if (index === undefined && !astar.isBelongToClosed(nextNode.getValStr())) {
                    console.log("next 3");
                    nextNode.setG(cost);
                    nextNode.setF(nextNode.getG() + nextNode.getH(astar.targetNode));
                    astar.openList.push(nextNode);
                }
            });
        };
        while (!node_1.default.isSame(astar.openList.top(), astar.targetNode)) {
            _loop_1();
        }
        console.timeEnd("AStar Run !");
        console.log(" astar - ", astar);
        var tailNode = astar.openList.top();
        var p = [];
        while (tailNode) {
            p.unshift(tailNode.getValStr());
            tailNode = tailNode.parent;
        }
        console.log(" p ----- ", p);
    };
    Astar.prototype.getHeuristicTo = function () {
    };
    Astar.prototype.isBelongToClosed = function (str) {
        return !!this.b_closedList[str];
    };
    Astar.prototype.removeFromClosed = function (str) {
    };
    return Astar;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Astar;
