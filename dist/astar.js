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
        console.log("AStar Run !");
        var astar = this;
        var count = 0;
        var _loop_1 = function() {
            console.log("openlist - ", astar.openList);
            console.log("closedList - ", astar.closedList);
            var currentNode;
            do {
                if (astar.openList.isEmpty())
                    return { value: console.log(" empty! ") };
                currentNode = astar.openList.pop();
            } while (astar.b_closedList[currentNode.value.toString()] === 1);
            astar.closedList.push(currentNode);
            astar.b_closedList[currentNode.value.toString()] = 1;
            var nextNodes = currentNode.getNextNodes();
            count++;
            nextNodes.forEach(function (nextNode) {
                nextNode.F = currentNode.getCurrentCost() + currentNode.getCostToNext() + nextNode.getHeuristicToTarget(astar.targetNode);
                nextNode.currentCost = count;
                astar.openList.push(nextNode);
            });
        };
        while (!node_1.default.isSame(astar.openList.top(), astar.targetNode) && !astar.openList.isEmpty()) {
            var state_1 = _loop_1();
            if (typeof state_1 === "object") return state_1.value;
        }
        console.log(" astar - ", astar);
        var tailNode = astar.openList.top();
        var p = [];
        while (tailNode) {
            p.push(tailNode.value.toString());
            tailNode = tailNode.parent;
        }
        console.log(" p ----- ", p);
    };
    Astar.prototype.getHeuristicTo = function () {
    };
    Astar.prototype.isBelongToClosed = function (str) {
        return !!this.b_closedList[str];
    };
    return Astar;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Astar;
