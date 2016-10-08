(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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
    // public function
    // ---------------
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
    // private function
    // ---------------
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
},{"./heap":3,"./node":5}],2:[function(require,module,exports){
"use strict";
var node_1 = require("./node");
var astar_1 = require('./astar');
var util_1 = require('./util');
var Game = (function () {
    function Game(gameContainerId, scale) {
        this.startNode = new node_1.default(scale);
        this.targetNode = new node_1.default(scale);
        this.scale = scale;
        this.gameContainerId = gameContainerId;
        this.imgContainerId = "image";
        this.actionContainerId = "action";
        this.initDOM();
    }
    // public function
    // ---------------
    Game.prototype.mix = function () {
        this.startNode.shuffle();
        this.setStatusWithNode(this.startNode);
    };
    Game.prototype.start = function () {
        if (node_1.default.isSame(this.startNode, this.targetNode)) {
            return console.log('win!!!');
        }
        else {
            var astar = new astar_1.default(this.startNode, this.targetNode);
            astar.run();
        }
    };
    Game.prototype.setStatusWithNode = function (node) {
        var imgItems = this.imgContainerEle.getElementsByClassName("item");
        for (var i = 0, len = imgItems.length; i < len; i++) {
            imgItems[i].className = "item item-" + node.value[i];
        }
    };
    Game.prototype.moveImg = function (index) {
        console.log("index - - ", index);
        // console.log( this.zeroIndex );
    };
    // private function
    // ---------------
    Game.prototype.initDOM = function () {
        var game = this;
        game.gameContainerEle = util_1.$id(game.gameContainerId);
        game.imgContainerEle = util_1.$createEle('div', game.imgContainerId);
        game.actionContainerEle = util_1.$createEle('div', game.actionContainerId);
        var _loop_1 = function(i) {
            var ele = util_1.$createEle('div', undefined, "item item-" + i);
            ele.addEventListener('click', function () { game.moveImg(i); });
            game.imgContainerEle.appendChild(ele);
        };
        for (var i = 1; i < Math.pow(game.scale, 2); i++) {
            _loop_1(i);
        }
        game.imgContainerEle.appendChild(util_1.$createEle('div', undefined, "item item-0"));
        ["MIX", "START"].forEach(function (item, index, array) {
            var ele = util_1.$createEle('button', undefined, "btn btn-" + item.toLowerCase());
            ele.innerHTML = item;
            switch (item) {
                case 'MIX':
                    ele.addEventListener('click', game.mix.bind(game));
                    break;
                case 'START':
                    ele.addEventListener('click', game.start.bind(game));
                    break;
            }
            game.actionContainerEle.appendChild(ele);
        });
        game.gameContainerEle.appendChild(game.imgContainerEle);
        game.gameContainerEle.appendChild(game.actionContainerEle);
    };
    return Game;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Game;
},{"./astar":1,"./node":5,"./util":6}],3:[function(require,module,exports){
"use strict";
// Heap On Top
var Heap = (function () {
    function Heap(nodeList, key) {
        this.heap = [];
        this.b_heap = {};
        this.key = key;
        // 用依次插入的方式构造初始的小顶堆
        var i = 0, len = nodeList.length;
        for (; i < len; i++) {
            this.push(nodeList[i]);
        }
    }
    // public function
    // ---------------
    /**
     * 获取堆中下标为 index 的值
     */
    Heap.prototype.get = function (index) {
        if (index >= 0 && index < this.heap.length) {
            return this.heap[index][this.key];
        }
    };
    /**
     * 向堆中插入一个新的元素并调整堆
     * 新元素从数组尾部插入，然后对新元素执行上浮调整
     */
    Heap.prototype.push = function (node) {
        this.heap.push(node);
        this.goUp(this.heap.length - 1);
    };
    /**
     * 删除并返回堆顶元素并调整堆
     * 先将堆顶元素与数组末尾元素互换，然后弹出数组末尾的元素，最后对堆顶元素执行下沉操作
     */
    Heap.prototype.pop = function () {
        if (this.isEmpty())
            return;
        var result;
        this.swap(0, this.heap.length - 1);
        result = this.heap.pop();
        !this.isEmpty() && this.goDown(0);
        return result;
    };
    /**
     * 移除堆中下标为 index 的元素
     * 将需移除的项与堆顶互换，然后弹出堆顶，最后对互换项（原堆顶）执行上浮操作
     */
    Heap.prototype.remove = function (index) {
        if (index < 0 || index >= this.heap.length)
            return;
        this.swap(0, index);
        this.pop();
        this.goUp(index);
    };
    /**
     * 获取堆顶元素
     */
    Heap.prototype.top = function () {
        return this.heap.length && this.heap[0];
    };
    /**
     * 判断堆是否为空
     */
    Heap.prototype.isEmpty = function () {
        return !this.heap.length;
    };
    /**
     * 判断堆中是否有元素 node
     */
    Heap.prototype.getItemIndex = function (node) {
        var i = 0, len = this.heap.length;
        for (; i < len; i++) {
            if (this.heap[i].getValStr() === node.getValStr())
                return i;
        }
    };
    // private function
    // ---------------
    /**
     * 返回堆中下标为 index 的元素
     */
    Heap.prototype.getValue = function (index) {
        if (index < 0 || index >= this.heap.length)
            return;
        return this.heap[index][this.key];
    };
    /**
     * 堆中下标为 index 的元素的上浮操作
     */
    Heap.prototype.goUp = function (index) {
        var value = this.getValue(index), parent = this.getParentIndex(index);
        if (parent === undefined)
            return;
        if (this.getValue(parent) > this.getValue(index)) {
            this.swap(index, parent);
            this.goUp(parent);
        }
    };
    /**
     * 堆中下标为 index 的元素的下沉操作
     */
    Heap.prototype.goDown = function (index) {
        var value = this.getValue(index), _a = this.getChildIndex(index), left = _a[0], right = _a[1], swapIndex = left;
        // 元素是叶子节点，没有子元素
        if (left === null)
            return;
        // 若元素有两个子元素，设置 swapIndex 为较小的那个子元素的下标
        // 若元素只有左儿子，swapIndex 已经被初始化为 left 的值了
        if (right) {
            swapIndex = this.getValue(left) < this.getValue(right) ? left : right;
        }
        // 比较父元素和较小的那个子元素的值，若父元素的值较大，则置换父元素和较小的子元素
        // 然后在新的置换的位置处继续执行下沉操作
        if (this.getValue(swapIndex) < value) {
            this.swap(index, swapIndex);
            this.goDown(swapIndex);
        }
    };
    /**
     * 获取下标为 index 的元素在堆中的父元素
     */
    Heap.prototype.getParentIndex = function (index) {
        if (index < 0 || index >= this.heap.length)
            return;
        if (index === 0)
            return 0;
        return Math.floor((index - 1) / 2);
    };
    /**
     * 获取下标为 index 的元素在堆中的子元素，缺失的子元素用 null 代替
     */
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
    /**
     * 交换堆中下标分别为 index1 和 index2 的两个元素
     */
    Heap.prototype.swap = function (index1, index2) {
        var tmp = this.heap[index1];
        this.heap[index1] = this.heap[index2];
        this.heap[index2] = tmp;
    };
    return Heap;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Heap;
},{}],4:[function(require,module,exports){
"use strict";
var game_1 = require("./game");
var game = new game_1.default("container", 3);
console.log(game);
console.log("------------------------");
// import minHeap from './min-heap';
//
// console.log( "------------------------" );
//
// let heap = new minHeap( [ 3, 5, 4, 1, 2, 19, 18, 22, 12, 7] );
//
// console.log( heap.heap );
//
// // for ( let i = 0, len = heap.heap.length; i < len; i ++ ){
// //   console.log( heap.pop() );
// //   console.log( heap.heap );
// // }
// //
// // console.log( heap.pop() );
// // console.log( heap.heap );
},{"./game":2}],5:[function(require,module,exports){
"use strict";
var util_1 = require('./util');
var Node = (function () {
    function Node(scale, initArr) {
        this.scale = scale;
        this.value = initArr ? initArr : this.createNodeValueByScale(scale);
        this.zeroIndex = Math.pow(scale, 2) - 1;
        // this.parent = new Node(this.scale);
        this.F = 0;
        this.currentCost = 0;
    }
    // public function
    // ---------------
    Node.prototype.getValStr = function () {
        return this.value.toString();
    };
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
    Node.prototype.getCostToNext = function () {
        return 1;
    };
    Node.prototype.setF = function (value) {
        this.F = value;
    };
    Node.prototype.getG = function () {
        return this.currentCost;
    };
    Node.prototype.setG = function (value) {
        this.currentCost = value;
    };
    Node.prototype.getH = function (targetNode) {
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
                // now in
                var row = Math.floor(i / this.scale);
                var col = i % this.scale;
                // should in
                var _row = Math.floor(v / this.scale);
                var _col = v % this.scale;
                manhatten += Math.abs(row - _row) + Math.abs(col - _col);
            }
        }
        result = 5 * manhatten + 1 * diff;
        return result;
    };
    // private function
    // ----------------
    Node.prototype.createNodeValueByScale = function (scale) {
        var val = [];
        for (var i = 1; i < Math.pow(scale, 2); i++) {
            val.push(i);
        }
        val.push(0);
        return val;
    };
    // static function
    // ---------------
    Node.isSame = function (currentNode, targetNode) {
        return currentNode.value.toString() === targetNode.value.toString();
    };
    Node.nodeClone = function (node) {
        var newNode = new Node(node.scale);
        newNode.value = node.value.slice(0);
        newNode.zeroIndex = node.zeroIndex;
        return newNode;
    };
    // cost from one node to another node
    Node.costFromN2N = function (fromNode, toNode) {
    };
    return Node;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Node;
},{"./util":6}],6:[function(require,module,exports){
"use strict";
(function (DIRECTION) {
    DIRECTION[DIRECTION["UP"] = 1] = "UP";
    DIRECTION[DIRECTION["RIGHT"] = 2] = "RIGHT";
    DIRECTION[DIRECTION["DOWN"] = 3] = "DOWN";
    DIRECTION[DIRECTION["LEFT"] = 4] = "LEFT";
})(exports.DIRECTION || (exports.DIRECTION = {}));
var DIRECTION = exports.DIRECTION;
function $id(eleId) {
    return document.getElementById(eleId);
}
exports.$id = $id;
function $createEle(tagName, id, className) {
    var ele = document.createElement(tagName);
    if (id)
        ele.id = id;
    if (className)
        ele.className = className;
    return ele;
}
exports.$createEle = $createEle;
},{}]},{},[4])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvdHMvYXN0YXIudHMiLCJzcmMvdHMvZ2FtZS50cyIsInNyYy90cy9oZWFwLnRzIiwic3JjL3RzL21haW4udHMiLCJzcmMvdHMvbm9kZS50cyIsInNyYy90cy91dGlsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOztBQ0FBLHFCQUFpQixRQUFRLENBQUMsQ0FBQTtBQUMxQixxQkFBaUIsUUFBUSxDQUFDLENBQUE7QUFHMUI7SUFRRSxlQUFhLFNBQWUsRUFBRSxVQUFnQjtRQUM1QyxJQUFJLENBQUMsU0FBUyxHQUFHLFNBQVMsQ0FBQztRQUMzQixJQUFJLENBQUMsVUFBVSxHQUFHLFVBQVUsQ0FBQztRQUU3QixJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksY0FBSSxDQUFFLENBQUUsU0FBUyxDQUFFLEVBQUUsR0FBRyxDQUFFLENBQUM7UUFDL0MsSUFBSSxDQUFDLFVBQVUsR0FBRyxFQUFFLENBQUM7UUFFckIsSUFBSSxDQUFDLFlBQVksR0FBRyxFQUFFLENBQUM7SUFDekIsQ0FBQztJQUVELGtCQUFrQjtJQUNsQixrQkFBa0I7SUFDbEIsbUJBQUcsR0FBSDtRQUNFLE9BQU8sQ0FBQyxJQUFJLENBQUUsYUFBYSxDQUFFLENBQUM7UUFDOUIsSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDO1FBQ2pCLElBQUksS0FBSyxHQUFHLENBQUMsQ0FBQztRQUVkO1lBQ0UsSUFBSSxXQUFXLEdBQVMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxHQUFHLEVBQUUsQ0FBQztZQUM3QyxLQUFLLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBRSxXQUFXLENBQUUsQ0FBQztZQUNyQyxLQUFLLENBQUMsWUFBWSxDQUFFLFdBQVcsQ0FBQyxTQUFTLEVBQUUsQ0FBRSxHQUFHLENBQUMsQ0FBQztZQUVsRCxJQUFJLFNBQVMsR0FBRyxXQUFXLENBQUMsWUFBWSxFQUFFLENBQUM7WUFFM0MsS0FBSyxFQUFHLENB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SyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3BDLE9BQU8sQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQztRQUNuQyxNQUFNLENBQUMsT0FBTyxDQUFDO0lBQ2pCLENBQUM7SUFDRCxxQ0FBcUM7SUFDOUIsZ0JBQVcsR0FBbEIsVUFBb0IsUUFBYyxFQUFFLE1BQVk7SUFFaEQsQ0FBQztJQUNILFdBQUM7QUFBRCxDQWhLQSxBQWdLQyxJQUFBO0FBaEtEO3NCQWdLQyxDQUFBOzs7QUNsS0QsV0FBWSxTQUFTO0lBQUkscUNBQU0sQ0FBQTtJQUFFLDJDQUFLLENBQUE7SUFBRSx5Q0FBSSxDQUFBO0lBQUUseUNBQUksQ0FBQTtBQUFDLENBQUMsRUFBeEMsaUJBQVMsS0FBVCxpQkFBUyxRQUErQjtBQUFwRCxJQUFZLFNBQVMsR0FBVCxpQkFBd0MsQ0FBQTtBQU1wRCxhQUFvQixLQUFhO0lBQy9CLE1BQU0sQ0FBQyxRQUFRLENBQUMsY0FBYyxDQUFFLEtBQUssQ0FBRSxDQUFDO0FBQzFDLENBQUM7QUFGZSxXQUFHLE1BRWxCLENBQUE7QUFFRCxvQkFBNEIsT0FBZSxFQUFFLEVBQVcsRUFBRSxTQUFrQjtJQUMxRSxJQUFJLEdBQUcsR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFFLE9BQU8sQ0FBRSxDQUFDO0lBQzVDLEVBQUUsQ0FBQSxDQUFFLEVBQUcsQ0FBQztRQUFDLEdBQUcsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDO0lBQ3JCLEVBQUUsQ0FBQSxDQUFFLFNBQVUsQ0FBQztRQUFDLEdBQUcsQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFDO0lBQzFDLE1BQU0sQ0FBQyxHQUFHLENBQUM7QUFDYixDQUFDO0FBTGUsa0JBQVUsYUFLekIsQ0FBQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJpbXBvcnQgTm9kZSBmcm9tICcuL25vZGUnO1xyXG5pbXBvcnQgSGVhcCBmcm9tICcuL2hlYXAnO1xyXG5pbXBvcnQgeyBiZWxvbmdUbyB9IGZyb20gJy4vdXRpbCc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBBc3RhcntcclxuICBvcGVuTGlzdDogSGVhcFxyXG4gIGNsb3NlZExpc3Q6IE5vZGVbXVxyXG4gIHN0YXJ0Tm9kZTogTm9kZVxyXG4gIHRhcmdldE5vZGU6IE5vZGVcclxuXHJcbiAgcHJpdmF0ZSBiX2Nsb3NlZExpc3Q6IGJlbG9uZ1RvXHJcblxyXG4gIGNvbnN0cnVjdG9yKCBzdGFydE5vZGU6IE5vZGUsIHRhcmdldE5vZGU6IE5vZGUgKXtcclxuICAgIHRoaXMuc3RhcnROb2RlID0gc3RhcnROb2RlO1xyXG4gICAgdGhpcy50YXJnZXROb2RlID0gdGFyZ2V0Tm9kZTtcclxuXHJcbiAgICB0aGlzLm9wZW5MaXN0ID0gbmV3IEhlYXAoIFsgc3RhcnROb2RlIF0sIFwiRlwiICk7XHJcbiAgICB0aGlzLmNsb3NlZExpc3QgPSBbXTtcclxuXHJcbiAgICB0aGlzLmJfY2xvc2VkTGlzdCA9IHt9O1xyXG4gIH1cclxuXHJcbiAgLy8gcHVibGljIGZ1bmN0aW9uXHJcbiAgLy8gLS0tLS0tLS0tLS0tLS0tXHJcbiAgcnVuKCl7XHJcbiAgICBjb25zb2xlLnRpbWUoIFwiQVN0YXIgUnVuICFcIiApO1xyXG4gICAgbGV0IGFzdGFyID0gdGhpcztcclxuICAgIGxldCBjb3VudCA9IDA7XHJcblxyXG4gICAgd2hpbGUgKCAhTm9kZS5pc1NhbWUoIGFzdGFyLm9wZW5MaXN0LnRvcCgpLCBhc3Rhci50YXJnZXROb2RlICkgKXtcclxuICAgICAgbGV0IGN1cnJlbnROb2RlOiBOb2RlID0gYXN0YXIub3Blbkxpc3QucG9wKCk7XHJcbiAgICAgIGFzdGFyLmNsb3NlZExpc3QucHVzaCggY3VycmVudE5vZGUgKTtcclxuICAgICAgYXN0YXIuYl9jbG9zZWRMaXN0WyBjdXJyZW50Tm9kZS5nZXRWYWxTdHIoKSBdID0gMTtcclxuXHJcbiAgICAgIGxldCBuZXh0Tm9kZXMgPSBjdXJyZW50Tm9kZS5nZXROZXh0Tm9kZXMoKTtcclxuXHJcbiAgICAgIGNvdW50ICsrO1xyXG5cclxuICAgICAgbmV4dE5vZGVzLmZvckVhY2goZnVuY3Rpb24obmV4dE5vZGUpe1xyXG4gICAgICAgIGxldCBjb3N0ID0gY3VycmVudE5vZGUuZ2V0RygpICsgY3VycmVudE5vZGUuZ2V0Q29zdFRvTmV4dCgpO1xyXG4gICAgICAgIGxldCBpbmRleCA9ICBhc3Rhci5vcGVuTGlzdC5nZXRJdGVtSW5kZXgoIG5leHROb2RlICk7XHJcbiAgICAgICAgaWYgKCBpbmRleCAhPT0gdW5kZWZpbmVkICYmIGNvc3QgPCBuZXh0Tm9kZS5nZXRHKCkgKXtcclxuICAgICAgICAgIGNvbnNvbGUubG9nKCBcIm5leHQgMVwiICk7XHJcbiAgICAgICAgICBhc3Rhci5vcGVuTGlzdC5yZW1vdmUoIGluZGV4ICk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoIGFzdGFyLmlzQmVsb25nVG9DbG9zZWQoIG5leHROb2RlLmdldFZhbFN0cigpICkgJiYgY29zdCA8IG5leHROb2RlLmdldEcoKSApe1xyXG4gICAgICAgICAgY29uc29sZS5sb2coIFwibmV4dCAyXCIgKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICggaW5kZXggPT09IHVuZGVmaW5lZCAmJiAhYXN0YXIuaXNCZWxvbmdUb0Nsb3NlZCggbmV4dE5vZGUuZ2V0VmFsU3RyKCkgKSApe1xyXG4gICAgICAgICAgY29uc29sZS5sb2coIFwibmV4dCAzXCIgKTtcclxuICAgICAgICAgIG5leHROb2RlLnNldEcoIGNvc3QgKTtcclxuICAgICAgICAgIG5leHROb2RlLnNldEYoIG5leHROb2RlLmdldEcoKSArIG5leHROb2RlLmdldEgoIGFzdGFyLnRhcmdldE5vZGUgKSApO1xyXG4gICAgICAgICAgYXN0YXIub3Blbkxpc3QucHVzaCggbmV4dE5vZGUgKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgY29uc29sZS50aW1lRW5kKCBcIkFTdGFyIFJ1biAhXCIgKTtcclxuXHJcbiAgICBjb25zb2xlLmxvZyggXCIgYXN0YXIgLSBcIiwgYXN0YXIgKTtcclxuXHJcbiAgICBsZXQgdGFpbE5vZGUgPSBhc3Rhci5vcGVuTGlzdC50b3AoKTtcclxuICAgIGxldCBwID0gW107XHJcbiAgICB3aGlsZSggdGFpbE5vZGUgKXtcclxuICAgICAgcC51bnNoaWZ0KCB0YWlsTm9kZS5nZXRWYWxTdHIoKSApO1xyXG4gICAgICB0YWlsTm9kZSA9IHRhaWxOb2RlLnBhcmVudDtcclxuICAgIH1cclxuICAgIGNvbnNvbGUubG9nKCBcIiBwIC0tLS0tIFwiLCBwICk7XHJcblxyXG4gIH1cclxuXHJcblxyXG4gIC8vIHByaXZhdGUgZnVuY3Rpb25cclxuICAvLyAtLS0tLS0tLS0tLS0tLS1cclxuICBwcml2YXRlIGdldEhldXJpc3RpY1RvKCl7XHJcblxyXG4gIH1cclxuICBwcml2YXRlIGlzQmVsb25nVG9DbG9zZWQoIHN0cjogc3RyaW5nICl7XHJcbiAgICByZXR1cm4gISF0aGlzLmJfY2xvc2VkTGlzdFtzdHJdO1xyXG4gIH1cclxuICBwcml2YXRlIHJlbW92ZUZyb21DbG9zZWQoIHN0cjpzdHJpbmcgKXtcclxuXHJcbiAgfVxyXG59XHJcbiIsImltcG9ydCBOb2RlIGZyb20gXCIuL25vZGVcIlxyXG5pbXBvcnQgQXN0YXIgZnJvbSAnLi9hc3RhcidcclxuaW1wb3J0IHsgJGlkLCAkY3JlYXRlRWxlIH0gZnJvbSAnLi91dGlsJ1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgR2FtZXtcclxuICBzdGFydE5vZGU6IE5vZGVcclxuICB0YXJnZXROb2RlOiBOb2RlXHJcbiAgc2NhbGU6IG51bWJlclxyXG4gIHByaXZhdGUgZ2FtZUNvbnRhaW5lcklkOiBzdHJpbmdcclxuICBwcml2YXRlIGltZ0NvbnRhaW5lcklkOiBzdHJpbmdcclxuICBwcml2YXRlIGFjdGlvbkNvbnRhaW5lcklkOiBzdHJpbmdcclxuICBwcml2YXRlIGdhbWVDb250YWluZXJFbGVcclxuICBwcml2YXRlIGltZ0NvbnRhaW5lckVsZVxyXG4gIHByaXZhdGUgYWN0aW9uQ29udGFpbmVyRWxlXHJcblxyXG4gIGNvbnN0cnVjdG9yKCBnYW1lQ29udGFpbmVySWQ6IHN0cmluZywgc2NhbGU6IG51bWJlciApe1xyXG4gICAgdGhpcy5zdGFydE5vZGUgPSBuZXcgTm9kZSggc2NhbGUgKTtcclxuICAgIHRoaXMudGFyZ2V0Tm9kZSA9IG5ldyBOb2RlKCBzY2FsZSApO1xyXG4gICAgdGhpcy5zY2FsZSA9IHNjYWxlO1xyXG5cclxuICAgIHRoaXMuZ2FtZUNvbnRhaW5lcklkID0gZ2FtZUNvbnRhaW5lcklkO1xyXG4gICAgdGhpcy5pbWdDb250YWluZXJJZCA9IFwiaW1hZ2VcIjtcclxuICAgIHRoaXMuYWN0aW9uQ29udGFpbmVySWQgPSBcImFjdGlvblwiO1xyXG5cclxuICAgIHRoaXMuaW5pdERPTSgpO1xyXG5cclxuICB9XHJcblxyXG4gIC8vIHB1YmxpYyBmdW5jdGlvblxyXG4gIC8vIC0tLS0tLS0tLS0tLS0tLVxyXG4gIG1peCgpe1xyXG4gICAgdGhpcy5zdGFydE5vZGUuc2h1ZmZsZSgpO1xyXG4gICAgdGhpcy5zZXRTdGF0dXNXaXRoTm9kZSggdGhpcy5zdGFydE5vZGUgKTtcclxuICB9XHJcbiAgc3RhcnQoKXtcclxuICAgIGlmICggTm9kZS5pc1NhbWUoIHRoaXMuc3RhcnROb2RlLCB0aGlzLnRhcmdldE5vZGUgKSApe1xyXG4gICAgICByZXR1cm4gY29uc29sZS5sb2coICd3aW4hISEnICk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBsZXQgYXN0YXIgPSBuZXcgQXN0YXIoIHRoaXMuc3RhcnROb2RlLCB0aGlzLnRhcmdldE5vZGUgKTtcclxuICAgICAgYXN0YXIucnVuKCk7XHJcbiAgICB9XHJcblxyXG4gIH1cclxuICBzZXRTdGF0dXNXaXRoTm9kZSggbm9kZTogTm9kZSApe1xyXG4gICAgbGV0IGltZ0l0ZW1zID0gdGhpcy5pbWdDb250YWluZXJFbGUuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcIml0ZW1cIik7XHJcbiAgICBmb3IgKCBsZXQgaSA9IDAsIGxlbiA9IGltZ0l0ZW1zLmxlbmd0aDsgaSA8IGxlbjsgaSArKyApe1xyXG4gICAgICBpbWdJdGVtc1tpXS5jbGFzc05hbWUgPSBgaXRlbSBpdGVtLSR7bm9kZS52YWx1ZVtpXX1gO1xyXG4gICAgfVxyXG4gIH1cclxuICBtb3ZlSW1nKCBpbmRleCApe1xyXG4gICAgY29uc29sZS5sb2coIFwiaW5kZXggLSAtIFwiLCBpbmRleCApO1xyXG4gICAgLy8gY29uc29sZS5sb2coIHRoaXMuemVyb0luZGV4ICk7XHJcbiAgfVxyXG4gIC8vIHByaXZhdGUgZnVuY3Rpb25cclxuICAvLyAtLS0tLS0tLS0tLS0tLS1cclxuICBwcml2YXRlIGluaXRET00oKXtcclxuICAgIGxldCBnYW1lID0gdGhpcztcclxuICAgIGdhbWUuZ2FtZUNvbnRhaW5lckVsZSA9ICRpZCggZ2FtZS5nYW1lQ29udGFpbmVySWQgKTtcclxuICAgIGdhbWUuaW1nQ29udGFpbmVyRWxlID0gJGNyZWF0ZUVsZSggJ2RpdicsIGdhbWUuaW1nQ29udGFpbmVySWQgKTtcclxuICAgIGdhbWUuYWN0aW9uQ29udGFpbmVyRWxlID0gJGNyZWF0ZUVsZSggJ2RpdicsIGdhbWUuYWN0aW9uQ29udGFpbmVySWQgKTtcclxuXHJcbiAgICBmb3IgKCBsZXQgaSA9IDE7IGkgPCBNYXRoLnBvdyggZ2FtZS5zY2FsZSwgMik7IGkgKysgKXtcclxuICAgICAgbGV0IGVsZSA9ICRjcmVhdGVFbGUoICdkaXYnLCB1bmRlZmluZWQsIGBpdGVtIGl0ZW0tJHtpfWAgKTtcclxuICAgICAgZWxlLmFkZEV2ZW50TGlzdGVuZXIoICdjbGljaycsIGZ1bmN0aW9uKCl7IGdhbWUubW92ZUltZyhpKSB9ICk7XHJcbiAgICAgIGdhbWUuaW1nQ29udGFpbmVyRWxlLmFwcGVuZENoaWxkKCBlbGUgKTtcclxuICAgIH1cclxuICAgIGdhbWUuaW1nQ29udGFpbmVyRWxlLmFwcGVuZENoaWxkKCAkY3JlYXRlRWxlKCAnZGl2JywgdW5kZWZpbmVkLCBcIml0ZW0gaXRlbS0wXCIgKSApO1xyXG5cclxuICAgIFtcIk1JWFwiLCBcIlNUQVJUXCJdLmZvckVhY2goIGZ1bmN0aW9uKGl0ZW0sIGluZGV4LCBhcnJheSl7XHJcbiAgICAgIGxldCBlbGUgPSAkY3JlYXRlRWxlKCAnYnV0dG9uJywgdW5kZWZpbmVkLCBgYnRuIGJ0bi0ke2l0ZW0udG9Mb3dlckNhc2UoKX1gICk7XHJcbiAgICAgIGVsZS5pbm5lckhUTUwgPSBpdGVtO1xyXG4gICAgICBzd2l0Y2goIGl0ZW0gKXtcclxuICAgICAgICBjYXNlICdNSVgnOlxyXG4gICAgICAgICAgZWxlLmFkZEV2ZW50TGlzdGVuZXIoICdjbGljaycsIGdhbWUubWl4LmJpbmQoIGdhbWUgKSApO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSAnU1RBUlQnOlxyXG4gICAgICAgICAgZWxlLmFkZEV2ZW50TGlzdGVuZXIoICdjbGljaycsIGdhbWUuc3RhcnQuYmluZCggZ2FtZSApICk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgfVxyXG4gICAgICBnYW1lLmFjdGlvbkNvbnRhaW5lckVsZS5hcHBlbmRDaGlsZCggZWxlICk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBnYW1lLmdhbWVDb250YWluZXJFbGUuYXBwZW5kQ2hpbGQoIGdhbWUuaW1nQ29udGFpbmVyRWxlICk7XHJcbiAgICBnYW1lLmdhbWVDb250YWluZXJFbGUuYXBwZW5kQ2hpbGQoIGdhbWUuYWN0aW9uQ29udGFpbmVyRWxlICk7XHJcbiAgfVxyXG59XHJcbiIsImltcG9ydCBOb2RlIGZyb20gJy4vbm9kZSc7XHJcbmltcG9ydCB7IGJlbG9uZ1RvIH0gZnJvbSAnLi91dGlsJztcclxuLy8gSGVhcCBPbiBUb3BcclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgSGVhcHtcclxuICBoZWFwOiBOb2RlW10gPSBbXVxyXG4gIGJfaGVhcDogYmVsb25nVG8gPSB7fVxyXG4gIGtleTogc3RyaW5nXHJcbiAgY29uc3RydWN0b3IoIG5vZGVMaXN0OiBOb2RlW10sIGtleTogc3RyaW5nICl7XHJcbiAgICB0aGlzLmtleSA9IGtleTtcclxuICAgIC8vIOeUqOS+neasoeaPkuWFpeeahOaWueW8j+aehOmAoOWIneWni+eahOWwj+mhtuWghlxyXG4gICAgbGV0IGkgPSAwLFxyXG4gICAgICAgIGxlbiA9IG5vZGVMaXN0Lmxlbmd0aDtcclxuICAgIGZvciAoIDsgaSA8IGxlbjsgaSArKyApe1xyXG4gICAgICB0aGlzLnB1c2goIG5vZGVMaXN0W2ldICk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvLyBwdWJsaWMgZnVuY3Rpb25cclxuICAvLyAtLS0tLS0tLS0tLS0tLS1cclxuXHJcbiAgLyoqXHJcbiAgICog6I635Y+W5aCG5Lit5LiL5qCH5Li6IGluZGV4IOeahOWAvFxyXG4gICAqL1xyXG4gIGdldCggaW5kZXg6IG51bWJlciApe1xyXG4gICAgaWYgKCBpbmRleCA+PSAwICYmIGluZGV4IDwgdGhpcy5oZWFwLmxlbmd0aCApe1xyXG4gICAgICByZXR1cm4gdGhpcy5oZWFwWyBpbmRleCBdWyB0aGlzLmtleSBdO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICog5ZCR5aCG5Lit5o+S5YWl5LiA5Liq5paw55qE5YWD57Sg5bm26LCD5pW05aCGXHJcbiAgICog5paw5YWD57Sg5LuO5pWw57uE5bC+6YOo5o+S5YWl77yM54S25ZCO5a+55paw5YWD57Sg5omn6KGM5LiK5rWu6LCD5pW0XHJcbiAgICovXHJcbiAgcHVzaCggbm9kZTogTm9kZSApe1xyXG4gICAgdGhpcy5oZWFwLnB1c2goIG5vZGUgKTtcclxuICAgIHRoaXMuZ29VcCggdGhpcy5oZWFwLmxlbmd0aCAtIDEgKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIOWIoOmZpOW5tui/lOWbnuWghumhtuWFg+e0oOW5tuiwg+aVtOWghlxyXG4gICAqIOWFiOWwhuWghumhtuWFg+e0oOS4juaVsOe7hOacq+WwvuWFg+e0oOS6kuaNou+8jOeEtuWQjuW8ueWHuuaVsOe7hOacq+WwvueahOWFg+e0oO+8jOacgOWQjuWvueWghumhtuWFg+e0oOaJp+ihjOS4i+ayieaTjeS9nFxyXG4gICAqL1xyXG4gIHBvcCgpe1xyXG4gICAgaWYgKCB0aGlzLmlzRW1wdHkoKSApIHJldHVybjtcclxuICAgIGxldCByZXN1bHQ7XHJcbiAgICB0aGlzLnN3YXAoIDAsIHRoaXMuaGVhcC5sZW5ndGggLSAxICk7XHJcbiAgICByZXN1bHQgPSB0aGlzLmhlYXAucG9wKCk7XHJcbiAgICAhdGhpcy5pc0VtcHR5KCkgJiYgdGhpcy5nb0Rvd24oMCk7XHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICog56e76Zmk5aCG5Lit5LiL5qCH5Li6IGluZGV4IOeahOWFg+e0oFxyXG4gICAqIOWwhumcgOenu+mZpOeahOmhueS4juWghumhtuS6kuaNou+8jOeEtuWQjuW8ueWHuuWghumhtu+8jOacgOWQjuWvueS6kuaNoumhue+8iOWOn+Wghumhtu+8ieaJp+ihjOS4iua1ruaTjeS9nFxyXG4gICAqL1xyXG4gIHJlbW92ZSggaW5kZXg6IG51bWJlciApe1xyXG4gICAgaWYoIGluZGV4IDwgMCB8fCBpbmRleCA+PSB0aGlzLmhlYXAubGVuZ3RoICkgcmV0dXJuO1xyXG4gICAgdGhpcy5zd2FwKCAwLCBpbmRleCApO1xyXG4gICAgdGhpcy5wb3AoKTtcclxuICAgIHRoaXMuZ29VcCggaW5kZXggKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIOiOt+WPluWghumhtuWFg+e0oFxyXG4gICAqL1xyXG4gIHRvcCgpe1xyXG4gICAgcmV0dXJuIHRoaXMuaGVhcC5sZW5ndGggJiYgdGhpcy5oZWFwWzBdO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICog5Yik5pat5aCG5piv5ZCm5Li656m6XHJcbiAgICovXHJcbiAgaXNFbXB0eSgpe1xyXG4gICAgcmV0dXJuICF0aGlzLmhlYXAubGVuZ3RoO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICog5Yik5pat5aCG5Lit5piv5ZCm5pyJ5YWD57SgIG5vZGVcclxuICAgKi9cclxuICBnZXRJdGVtSW5kZXgoIG5vZGU6IE5vZGUgKXtcclxuICAgIGxldCBpID0gMCxcclxuICAgICAgICBsZW4gPSB0aGlzLmhlYXAubGVuZ3RoO1xyXG4gICAgZm9yICggOyBpIDwgbGVuOyBpICsrICl7XHJcbiAgICAgIGlmICggdGhpcy5oZWFwW2ldLmdldFZhbFN0cigpID09PSBub2RlLmdldFZhbFN0cigpICkgcmV0dXJuIGk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvLyBwcml2YXRlIGZ1bmN0aW9uXHJcbiAgLy8gLS0tLS0tLS0tLS0tLS0tXHJcblxyXG4gIC8qKlxyXG4gICAqIOi/lOWbnuWghuS4reS4i+agh+S4uiBpbmRleCDnmoTlhYPntKBcclxuICAgKi9cclxuICBwcml2YXRlIGdldFZhbHVlKCBpbmRleDogbnVtYmVyICl7XHJcbiAgICBpZiggaW5kZXggPCAwIHx8IGluZGV4ID49IHRoaXMuaGVhcC5sZW5ndGggKSByZXR1cm47XHJcbiAgICByZXR1cm4gdGhpcy5oZWFwW2luZGV4XVt0aGlzLmtleV07XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiDloIbkuK3kuIvmoIfkuLogaW5kZXgg55qE5YWD57Sg55qE5LiK5rWu5pON5L2cXHJcbiAgICovXHJcbiAgcHJpdmF0ZSBnb1VwKGluZGV4OiBudW1iZXIpe1xyXG4gICAgbGV0IHZhbHVlID0gdGhpcy5nZXRWYWx1ZShpbmRleCksXHJcbiAgICAgICAgcGFyZW50ID0gdGhpcy5nZXRQYXJlbnRJbmRleChpbmRleCk7XHJcblxyXG4gICAgaWYgKCBwYXJlbnQgPT09IHVuZGVmaW5lZCApIHJldHVybjtcclxuXHJcbiAgICBpZiAoIHRoaXMuZ2V0VmFsdWUoIHBhcmVudCApID4gdGhpcy5nZXRWYWx1ZSggaW5kZXggKSApe1xyXG4gICAgICB0aGlzLnN3YXAoIGluZGV4LCBwYXJlbnQgKTtcclxuICAgICAgdGhpcy5nb1VwKCBwYXJlbnQgKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIOWghuS4reS4i+agh+S4uiBpbmRleCDnmoTlhYPntKDnmoTkuIvmsonmk43kvZxcclxuICAgKi9cclxuICBwcml2YXRlIGdvRG93bihpbmRleDogbnVtYmVyKXtcclxuICAgIGxldCB2YWx1ZSA9IHRoaXMuZ2V0VmFsdWUoaW5kZXgpLFxyXG4gICAgICAgIFtsZWZ0LCByaWdodF0gPSB0aGlzLmdldENoaWxkSW5kZXgoaW5kZXgpLFxyXG4gICAgICAgIHN3YXBJbmRleCA9IGxlZnQ7XHJcblxyXG4gICAgLy8g5YWD57Sg5piv5Y+25a2Q6IqC54K577yM5rKh5pyJ5a2Q5YWD57SgXHJcbiAgICBpZiAoIGxlZnQgPT09IG51bGwgKSByZXR1cm47XHJcblxyXG4gICAgLy8g6Iul5YWD57Sg5pyJ5Lik5Liq5a2Q5YWD57Sg77yM6K6+572uIHN3YXBJbmRleCDkuLrovoPlsI/nmoTpgqPkuKrlrZDlhYPntKDnmoTkuIvmoIdcclxuICAgIC8vIOiLpeWFg+e0oOWPquacieW3puWEv+WtkO+8jHN3YXBJbmRleCDlt7Lnu4/ooqvliJ3lp4vljJbkuLogbGVmdCDnmoTlgLzkuoZcclxuICAgIGlmICggcmlnaHQgKXtcclxuICAgICAgc3dhcEluZGV4ID0gdGhpcy5nZXRWYWx1ZShsZWZ0KSA8IHRoaXMuZ2V0VmFsdWUocmlnaHQpID8gbGVmdCA6IHJpZ2h0O1xyXG4gICAgfVxyXG5cclxuICAgIC8vIOavlOi+g+eItuWFg+e0oOWSjOi+g+Wwj+eahOmCo+S4quWtkOWFg+e0oOeahOWAvO+8jOiLpeeItuWFg+e0oOeahOWAvOi+g+Wkp++8jOWImee9ruaNoueItuWFg+e0oOWSjOi+g+Wwj+eahOWtkOWFg+e0oFxyXG4gICAgLy8g54S25ZCO5Zyo5paw55qE572u5o2i55qE5L2N572u5aSE57un57ut5omn6KGM5LiL5rKJ5pON5L2cXHJcbiAgICBpZiAoIHRoaXMuZ2V0VmFsdWUoc3dhcEluZGV4KSA8IHZhbHVlICkge1xyXG4gICAgICB0aGlzLnN3YXAoIGluZGV4LCBzd2FwSW5kZXggKTtcclxuICAgICAgdGhpcy5nb0Rvd24oIHN3YXBJbmRleCApO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICog6I635Y+W5LiL5qCH5Li6IGluZGV4IOeahOWFg+e0oOWcqOWghuS4reeahOeItuWFg+e0oFxyXG4gICAqL1xyXG4gIHByaXZhdGUgZ2V0UGFyZW50SW5kZXgoIGluZGV4OiBudW1iZXIgKXtcclxuICAgIGlmICggaW5kZXggPCAwIHx8IGluZGV4ID49IHRoaXMuaGVhcC5sZW5ndGggKSByZXR1cm47XHJcbiAgICBpZiAoIGluZGV4ID09PSAwICkgcmV0dXJuIDA7XHJcbiAgICByZXR1cm4gTWF0aC5mbG9vciggKGluZGV4LTEpLzIgKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIOiOt+WPluS4i+agh+S4uiBpbmRleCDnmoTlhYPntKDlnKjloIbkuK3nmoTlrZDlhYPntKDvvIznvLrlpLHnmoTlrZDlhYPntKDnlKggbnVsbCDku6Pmm79cclxuICAgKi9cclxuICBwcml2YXRlIGdldENoaWxkSW5kZXgoIGluZGV4OiBudW1iZXIgKXtcclxuICAgIGxldCBsZWZ0ID0gMippbmRleCArIDEsXHJcbiAgICAgICAgcmlnaHQgPSAyKmluZGV4ICsgMixcclxuICAgICAgICBsZW5ndGggPSB0aGlzLmhlYXAubGVuZ3RoO1xyXG5cclxuICAgIGlmICggcmlnaHQgPD0gbGVuZ3RoIC0gMSApe1xyXG4gICAgICByZXR1cm4gWyBsZWZ0LCByaWdodCBdO1xyXG4gICAgfSBlbHNlIGlmICggbGVmdCA9PT0gbGVuZ3RoIC0gMSApIHtcclxuICAgICAgcmV0dXJuIFsgbGVmdCwgbnVsbCBdO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgcmV0dXJuIFsgbnVsbCwgbnVsbCBdO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICog5Lqk5o2i5aCG5Lit5LiL5qCH5YiG5Yir5Li6IGluZGV4MSDlkowgaW5kZXgyIOeahOS4pOS4quWFg+e0oFxyXG4gICAqL1xyXG4gIHByaXZhdGUgc3dhcCggaW5kZXgxOiBudW1iZXIsIGluZGV4MjogbnVtYmVyICl7XHJcbiAgICBsZXQgdG1wID0gdGhpcy5oZWFwW2luZGV4MV07XHJcbiAgICB0aGlzLmhlYXBbaW5kZXgxXSA9IHRoaXMuaGVhcFtpbmRleDJdO1xyXG4gICAgdGhpcy5oZWFwW2luZGV4Ml0gPSB0bXA7XHJcbiAgfVxyXG59XHJcbiIsImltcG9ydCBHYW1lIGZyb20gXCIuL2dhbWVcIjtcclxubGV0IGdhbWUgPSBuZXcgR2FtZSggXCJjb250YWluZXJcIiwgMyApO1xyXG5cclxuY29uc29sZS5sb2coIGdhbWUgKTtcclxuY29uc29sZS5sb2coIFwiLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXCIgKTtcclxuXHJcbi8vIGltcG9ydCBtaW5IZWFwIGZyb20gJy4vbWluLWhlYXAnO1xyXG4vL1xyXG4vLyBjb25zb2xlLmxvZyggXCItLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cIiApO1xyXG4vL1xyXG4vLyBsZXQgaGVhcCA9IG5ldyBtaW5IZWFwKCBbIDMsIDUsIDQsIDEsIDIsIDE5LCAxOCwgMjIsIDEyLCA3XSApO1xyXG4vL1xyXG4vLyBjb25zb2xlLmxvZyggaGVhcC5oZWFwICk7XHJcbi8vXHJcbi8vIC8vIGZvciAoIGxldCBpID0gMCwgbGVuID0gaGVhcC5oZWFwLmxlbmd0aDsgaSA8IGxlbjsgaSArKyApe1xyXG4vLyAvLyAgIGNvbnNvbGUubG9nKCBoZWFwLnBvcCgpICk7XHJcbi8vIC8vICAgY29uc29sZS5sb2coIGhlYXAuaGVhcCApO1xyXG4vLyAvLyB9XHJcbi8vIC8vXHJcbi8vIC8vIGNvbnNvbGUubG9nKCBoZWFwLnBvcCgpICk7XHJcbi8vIC8vIGNvbnNvbGUubG9nKCBoZWFwLmhlYXAgKTtcclxuIiwiaW1wb3J0IHsgRElSRUNUSU9OIH0gZnJvbSAnLi91dGlsJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE5vZGV7XHJcbiAgdmFsdWU6IG51bWJlcltdXHJcbiAgemVyb0luZGV4OiBudW1iZXJcclxuICBzY2FsZTogbnVtYmVyXHJcbiAgcGFyZW50OiBOb2RlXHJcbiAgRjogbnVtYmVyXHJcbiAgY3VycmVudENvc3Q6IG51bWJlclxyXG4gIGNvbnN0cnVjdG9yKCBzY2FsZTogbnVtYmVyLCBpbml0QXJyPzogbnVtYmVyW10gKSB7XHJcbiAgICB0aGlzLnNjYWxlID0gc2NhbGU7XHJcbiAgICB0aGlzLnZhbHVlID0gaW5pdEFyciA/IGluaXRBcnIgOiB0aGlzLmNyZWF0ZU5vZGVWYWx1ZUJ5U2NhbGUoIHNjYWxlICk7XHJcbiAgICB0aGlzLnplcm9JbmRleCA9IE1hdGgucG93KHNjYWxlLCAyKSAtIDE7XHJcblxyXG4gICAgLy8gdGhpcy5wYXJlbnQgPSBuZXcgTm9kZSh0aGlzLnNjYWxlKTtcclxuICAgIHRoaXMuRiA9IDA7XHJcbiAgICB0aGlzLmN1cnJlbnRDb3N0ID0gMDtcclxuICB9XHJcblxyXG4gIC8vIHB1YmxpYyBmdW5jdGlvblxyXG4gIC8vIC0tLS0tLS0tLS0tLS0tLVxyXG5cclxuICBnZXRWYWxTdHIoKXtcclxuICAgIHJldHVybiB0aGlzLnZhbHVlLnRvU3RyaW5nKCk7XHJcbiAgfVxyXG5cclxuICBzaHVmZmxlKCl7XHJcbiAgICBmb3IoIGxldCBpID0gMDsgaSA8IDU7IGkgKysgKXtcclxuICAgICAgbGV0IGRpcmVjdGlvbiA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDQgKyAxKTtcclxuICAgICAgdGhpcy5tb3ZlVG8oIGRpcmVjdGlvbiApO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgbW92ZVRvKCBkaXJlY3Rpb246IG51bWJlciApe1xyXG4gICAgaWYgKCAhdGhpcy5jYW5Nb3ZlVG8oIGRpcmVjdGlvbiApICkgcmV0dXJuO1xyXG4gICAgbGV0IHRhcmdldEluZGV4O1xyXG4gICAgc3dpdGNoKCBkaXJlY3Rpb24gKXtcclxuICAgICAgY2FzZSBESVJFQ1RJT04uVVA6XHJcbiAgICAgICAgdGFyZ2V0SW5kZXggPSB0aGlzLnplcm9JbmRleCAtIHRoaXMuc2NhbGU7XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIGNhc2UgRElSRUNUSU9OLlJJR0hUOlxyXG4gICAgICAgIHRhcmdldEluZGV4ID0gdGhpcy56ZXJvSW5kZXggKyAxO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICBjYXNlIERJUkVDVElPTi5ET1dOOlxyXG4gICAgICAgIHRhcmdldEluZGV4ID0gdGhpcy56ZXJvSW5kZXggKyB0aGlzLnNjYWxlO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICBjYXNlIERJUkVDVElPTi5MRUZUOlxyXG4gICAgICAgIHRhcmdldEluZGV4ID0gdGhpcy56ZXJvSW5kZXggLSAxO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICBkZWZhdWx0OlxyXG4gICAgICAgIHRhcmdldEluZGV4ID0gdGhpcy56ZXJvSW5kZXg7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy52YWx1ZVsgdGhpcy56ZXJvSW5kZXggXSA9IHRoaXMudmFsdWVbIHRhcmdldEluZGV4IF07XHJcbiAgICB0aGlzLnZhbHVlWyB0YXJnZXRJbmRleCBdID0gMDtcclxuICAgIHRoaXMuemVyb0luZGV4ID0gdGFyZ2V0SW5kZXg7XHJcbiAgfVxyXG5cclxuICBnZXROZXh0Tm9kZXMoKXtcclxuICAgIGxldCBub2RlID0gdGhpcztcclxuICAgIGxldCBuZXh0Tm9kZXM6IE5vZGVbXSA9IFtdO1xyXG4gICAgWyBESVJFQ1RJT04uVVAsIERJUkVDVElPTi5SSUdIVCwgRElSRUNUSU9OLkRPV04sIERJUkVDVElPTi5MRUZUIF0uZm9yRWFjaCggZnVuY3Rpb24oZGlyZWN0aW9uKXtcclxuICAgICAgaWYgKCBub2RlLmNhbk1vdmVUbyggZGlyZWN0aW9uICkgKXtcclxuICAgICAgICBsZXQgbmV3Tm9kZSA9IE5vZGUubm9kZUNsb25lKCBub2RlICk7XHJcbiAgICAgICAgbmV3Tm9kZS5wYXJlbnQgPSBub2RlO1xyXG4gICAgICAgIG5ld05vZGUubW92ZVRvKGRpcmVjdGlvbik7XHJcbiAgICAgICAgbmV4dE5vZGVzLnB1c2goIG5ld05vZGUgKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgICByZXR1cm4gbmV4dE5vZGVzO1xyXG4gIH1cclxuXHJcbiAgY2FuTW92ZVRvKCBkaXJlY3Rpb246IG51bWJlciApe1xyXG4gICAgbGV0IHJvdyA9IE1hdGguZmxvb3IoIHRoaXMuemVyb0luZGV4IC8gdGhpcy5zY2FsZSApO1xyXG4gICAgbGV0IGNvbCA9IHRoaXMuemVyb0luZGV4ICUgdGhpcy5zY2FsZTtcclxuXHJcbiAgICBzd2l0Y2goIGRpcmVjdGlvbiApe1xyXG4gICAgICBjYXNlIERJUkVDVElPTi5VUDpcclxuICAgICAgICByZXR1cm4gcm93ICE9PSAwO1xyXG4gICAgICBjYXNlIERJUkVDVElPTi5SSUdIVDpcclxuICAgICAgICByZXR1cm4gY29sICE9PSB0aGlzLnNjYWxlIC0gMTtcclxuICAgICAgY2FzZSBESVJFQ1RJT04uRE9XTjpcclxuICAgICAgICByZXR1cm4gcm93ICE9PSB0aGlzLnNjYWxlIC0gMTtcclxuICAgICAgY2FzZSBESVJFQ1RJT04uTEVGVDpcclxuICAgICAgICByZXR1cm4gY29sICE9PSAwO1xyXG4gICAgICBkZWZhdWx0OlxyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGdldENvc3RUb05leHQoKTogbnVtYmVye1xyXG4gICAgcmV0dXJuIDE7XHJcbiAgfVxyXG5cclxuICBzZXRGKCB2YWx1ZTogbnVtYmVyICl7XHJcbiAgICB0aGlzLkYgPSB2YWx1ZTtcclxuICB9XHJcblxyXG4gIGdldEcoKXtcclxuICAgIHJldHVybiB0aGlzLmN1cnJlbnRDb3N0O1xyXG4gIH1cclxuXHJcbiAgc2V0RyggdmFsdWU6IG51bWJlciApe1xyXG4gICAgdGhpcy5jdXJyZW50Q29zdCA9IHZhbHVlO1xyXG4gIH1cclxuXHJcbiAgZ2V0SCggdGFyZ2V0Tm9kZTogTm9kZSApe1xyXG4gICAgbGV0IHJlc3VsdDogbnVtYmVyID0gMDtcclxuXHJcbiAgICBsZXQgZGlmZjogbnVtYmVyID0gMDtcclxuICAgIGxldCBpID0gMCxcclxuICAgICAgICBsZW4gPSB0aGlzLnZhbHVlLmxlbmd0aDtcclxuXHJcbiAgICBmb3IgKCA7IGkgPCBsZW47IGkgKysgKXtcclxuICAgICAgaWYgKCB0aGlzLnZhbHVlW2ldICE9PSBpICsgMSApIGRpZmYgKys7XHJcbiAgICB9XHJcblxyXG4gICAgbGV0IG1hbmhhdHRlbjogbnVtYmVyID0gMDtcclxuICAgIGZvciAoIGkgPSAwOyBpIDwgbGVuOyBpICsrICl7XHJcbiAgICAgIGxldCB2ID0gdGhpcy52YWx1ZVtpXTtcclxuICAgICAgaWYoIHYgIT09IDAgKXtcclxuICAgICAgICAvLyBub3cgaW5cclxuICAgICAgICBsZXQgcm93ID0gTWF0aC5mbG9vciggaS90aGlzLnNjYWxlICk7XHJcbiAgICAgICAgbGV0IGNvbCA9IGkldGhpcy5zY2FsZTtcclxuICAgICAgICAvLyBzaG91bGQgaW5cclxuICAgICAgICBsZXQgX3JvdyA9IE1hdGguZmxvb3IoIHYvdGhpcy5zY2FsZSApO1xyXG4gICAgICAgIGxldCBfY29sID0gdiV0aGlzLnNjYWxlO1xyXG5cclxuICAgICAgICBtYW5oYXR0ZW4gKz0gTWF0aC5hYnMoIHJvdyAtIF9yb3cgKSArIE1hdGguYWJzKCBjb2wgLSBfY29sICk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICByZXN1bHQgPSA1Km1hbmhhdHRlbiArIDEqZGlmZjtcclxuXHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG4gIH1cclxuXHJcbiAgLy8gcHJpdmF0ZSBmdW5jdGlvblxyXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS1cclxuICBwcml2YXRlIGNyZWF0ZU5vZGVWYWx1ZUJ5U2NhbGUoIHNjYWxlOiBudW1iZXIgKXtcclxuICAgIGxldCB2YWwgPSBbXTtcclxuICAgIGZvciAoIGxldCBpID0gMTsgaSA8IE1hdGgucG93KHNjYWxlLCAyKTsgaSArKyApe1xyXG4gICAgICB2YWwucHVzaCggaSApO1xyXG4gICAgfVxyXG4gICAgdmFsLnB1c2goIDAgKTtcclxuICAgIHJldHVybiB2YWw7XHJcbiAgfVxyXG4gIC8vIHN0YXRpYyBmdW5jdGlvblxyXG4gIC8vIC0tLS0tLS0tLS0tLS0tLVxyXG4gIHN0YXRpYyBpc1NhbWUoIGN1cnJlbnROb2RlOiBOb2RlLCB0YXJnZXROb2RlOiBOb2RlICl7XHJcbiAgICByZXR1cm4gY3VycmVudE5vZGUudmFsdWUudG9TdHJpbmcoKSA9PT0gdGFyZ2V0Tm9kZS52YWx1ZS50b1N0cmluZygpO1xyXG4gIH1cclxuICBzdGF0aWMgbm9kZUNsb25lKCBub2RlOiBOb2RlICl7XHJcbiAgICBsZXQgbmV3Tm9kZSA9IG5ldyBOb2RlKCBub2RlLnNjYWxlICk7XHJcbiAgICBuZXdOb2RlLnZhbHVlID0gbm9kZS52YWx1ZS5zbGljZSgwKTtcclxuICAgIG5ld05vZGUuemVyb0luZGV4ID0gbm9kZS56ZXJvSW5kZXg7XHJcbiAgICByZXR1cm4gbmV3Tm9kZTtcclxuICB9XHJcbiAgLy8gY29zdCBmcm9tIG9uZSBub2RlIHRvIGFub3RoZXIgbm9kZVxyXG4gIHN0YXRpYyBjb3N0RnJvbU4yTiggZnJvbU5vZGU6IE5vZGUsIHRvTm9kZTogTm9kZSApe1xyXG5cclxuICB9XHJcbn1cclxuIiwiZXhwb3J0IGVudW0gRElSRUNUSU9OICB7IFVQID0gMSwgUklHSFQsIERPV04sIExFRlQgfVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBiZWxvbmdUb3tcclxuICAgIFtwcm9wTmFtZTogc3RyaW5nXTogbnVtYmVyO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gJGlkKGVsZUlkOiBzdHJpbmcpe1xyXG4gIHJldHVybiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCggZWxlSWQgKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uICRjcmVhdGVFbGUoIHRhZ05hbWU6IHN0cmluZywgaWQ/OiBzdHJpbmcsIGNsYXNzTmFtZT86IHN0cmluZyApe1xyXG4gIGxldCBlbGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCB0YWdOYW1lICk7XHJcbiAgaWYoIGlkICkgZWxlLmlkID0gaWQ7XHJcbiAgaWYoIGNsYXNzTmFtZSApIGVsZS5jbGFzc05hbWUgPSBjbGFzc05hbWU7XHJcbiAgcmV0dXJuIGVsZTtcclxufVxyXG4iXX0=
