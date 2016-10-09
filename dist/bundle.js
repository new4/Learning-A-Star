(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";
var node_1 = require('./node');
var heap_1 = require('./heap');
/**
 * A* 算法
 */
var Astar = (function () {
    function Astar(startNode, targetNode) {
        this.closedList = [];
        this.b_closedList = {};
        this.solution = [];
        this.startNode = startNode;
        this.targetNode = targetNode;
        this.openList = new heap_1.default([startNode], "F");
    }
    // public function
    // ---------------
    /**
     * 运行 A* 算法
     */
    Astar.prototype.run = function () {
        console.time("AStar Run !");
        var astar = this;
        var _loop_1 = function() {
            var currentNode = astar.openList.pop();
            astar.closedList.push(currentNode);
            astar.b_closedList[currentNode.getValStr()] = 1;
            var nextNodes = currentNode.getNextNodes();
            nextNodes.forEach(function (nextNode) {
                var cost = currentNode.getG() + currentNode.getCostToNext();
                var index = astar.openList.getItemIndex(nextNode);
                if (index !== undefined && cost < nextNode.getG()) {
                    console.log("next 1");
                    astar.openList.remove(index);
                }
                if (astar.isBelongToClosed(nextNode) && cost < nextNode.getG()) {
                    console.log("next 2");
                }
                if (index === undefined && !astar.isBelongToClosed(nextNode)) {
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
        this.solution = [];
        while (tailNode) {
            this.solution.unshift(tailNode.getValStr());
            tailNode = tailNode.parent;
        }
        // this.showSolution();
    };
    /**
     * 获取解决方案数组
     */
    Astar.prototype.getSolution = function () {
        return this.solution;
    };
    // private function
    // ---------------
    /**
     * 判断节点是否在 CLOSED 中
     */
    Astar.prototype.isBelongToClosed = function (node) {
        var str = node.getValStr();
        return !!this.b_closedList[str];
    };
    /**
     * 显示解决方案的具体步骤
     */
    Astar.prototype.showSolution = function () {
        var i = 0, len = this.solution.length, scale = this.targetNode.scale;
        for (; i < len; i++) {
            console.log("Step " + i + " ---");
            var item = this.solution[i].split(',');
            for (var j = 0; j < scale; j++) {
                console.log("| " + item[j * scale] + " " + item[j * scale + 1] + " " + item[j * scale + 2] + " |");
            }
        }
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
        this.setBHeap(this.heap.length - 1);
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
        this.removeBHeap(result.getValStr());
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
        return this.b_heap[node.getValStr()];
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
        this.setBHeap(index1);
        this.setBHeap(index2);
    };
    Heap.prototype.setBHeap = function (index) {
        this.b_heap[this.heap[index].getValStr()] = index;
    };
    Heap.prototype.removeBHeap = function (str) {
        delete this.b_heap[str];
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
        this.F = 0;
        this.G = 0;
        this.scale = scale;
        this.value = initArr ? initArr : this.initNodeValueByScale(scale);
        this.zeroIndex = Math.pow(scale, 2) - 1;
        // this.parent = new Node(this.scale);
    }
    // public function
    // ---------------
    /**
     * 获取节点的值，将节点的数组表示转换成字符串表示并返回
     */
    Node.prototype.getValStr = function () {
        return this.value.toString();
    };
    /**
     * 节点的乱序算法
     * 随机指定一个方向，令节点向该方向移动，重复上述过程若干次达到乱序的目的
     */
    Node.prototype.shuffle = function () {
        for (var i = 0; i < 5000; i++) {
            var direction = Math.floor(Math.random() * 4 + 1);
            this.moveTo(direction);
        }
    };
    /**
     * 当前节点向方向 direction 移动一次
     * 其实是节点的数组表示中的数字 0 向方向 direction 移动一次
     */
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
    /**
     * 获取当前节点在可移动方向上的子节点数组
     */
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
    /**
     * 获取从当前节点走到下一个节点的代价
     */
    Node.prototype.getCostToNext = function () {
        return 1;
    };
    /**
     * 设置节点的 F 值，堆会根据这个值进行排序
     */
    Node.prototype.setF = function (value) {
        this.F = value;
    };
    /**
     * 获取节点的 G 值
     */
    Node.prototype.getG = function () {
        return this.G;
    };
    /**
     * 设置节点的 G 值
     */
    Node.prototype.setG = function (value) {
        this.G = value;
    };
    /**
     * 获取节点的 H 值
     */
    Node.prototype.getH = function (targetNode) {
        var i = 0, len = this.value.length, manhatten = 0, diff = 0;
        for (; i < len; i++) {
            if (this.value[i] !== i + 1)
                diff++;
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
        return 1 * manhatten + 1000 * diff;
    };
    // private function
    // ----------------
    /**
     * 根据维度 scale 构造节点的初始表示数组
     */
    Node.prototype.initNodeValueByScale = function (scale) {
        var val = [];
        for (var i = 1; i < Math.pow(scale, 2); i++) {
            val.push(i);
        }
        val.push(0);
        return val;
    };
    // static function
    // ---------------
    /**
     * 判断两个节点是否相等
     * 通过将节点的数组表示转换成字符串来进行比较
     */
    Node.isSame = function (currentNode, targetNode) {
        return currentNode.getValStr() === targetNode.getValStr();
    };
    /**
     * 基于 node 复制一个新的节点
     */
    Node.nodeClone = function (node) {
        var newNode = new Node(node.scale);
        newNode.value = node.value.slice(0);
        newNode.zeroIndex = node.zeroIndex;
        return newNode;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvdHMvYXN0YXIudHMiLCJzcmMvdHMvZ2FtZS50cyIsInNyYy90cy9oZWFwLnRzIiwic3JjL3RzL21haW4udHMiLCJzcmMvdHMvbm9kZS50cyIsInNyYy90cy91dGlsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOztBQ0FBLHFCQUFpQixRQUFRLENBQUMsQ0FBQTtBQUMxQixxQkFBaUIsUUFBUSxDQUFDLENBQUE7QUFHMUI7O0dBRUc7QUFDSDtJQVNFLGVBQWEsU0FBZSxFQUFFLFVBQWdCO1FBUDlDLGVBQVUsR0FBVyxFQUFFLENBQUE7UUFJZixpQkFBWSxHQUFhLEVBQUUsQ0FBQTtRQUMzQixhQUFRLEdBQWEsRUFBRSxDQUFBO1FBRzdCLElBQUksQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFDO1FBQzNCLElBQUksQ0FBQyxVQUFVLEdBQUcsVUFBVSxDQUFDO1FBQzdCLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxjQUFJLENBQUUsQ0FBRSxTQUFTLENBQUUsRUFBRSxHQUFHLENBQUUsQ0FBQztJQUNqRCxDQUFDO0lBRUQsa0JBQWtCO0lBQ2xCLGtCQUFrQjtJQUVsQjs7T0FFRztJQUNILG1CQUFHLEdBQUg7UUFDRSxPQUFPLENBQUMsSUFBSSxDQUFFLGFBQWEsQ0FBRSxDQUFDO1FBRTlCLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQztRQUNqQjtZQUNFLElBQUksV0FBVyxHQUFHLEtBQUssQ0FBQyxRQUFRLENBQUMsR0FBRyxFQUFFLENBQUM7WUFDdkMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUUsV0FBVyxDQUFFLENBQUM7WUFDckMsS0FBSyxDQUFDLFlBQVksQ0FBRSxXQUFXLENBQUMsU0FBUyxFQUFFLENBQUUsR0FBRyxDQUFDLENBQUM7WUFFbEQsSUFBSSxTQUFTLEdBQUcsV0FBVyxDQUFDLFlBQVksRUFBRSxDQUFDO1lBRTNDLFNBQVMsQ0FBQyxPQUFP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QUM7QUFBRCxDQTlMQSxBQThMQyxJQUFBO0FBOUxEO3NCQThMQyxDQUFBOzs7QUNoTUQsV0FBWSxTQUFTO0lBQUkscUNBQU0sQ0FBQTtJQUFFLDJDQUFLLENBQUE7SUFBRSx5Q0FBSSxDQUFBO0lBQUUseUNBQUksQ0FBQTtBQUFDLENBQUMsRUFBeEMsaUJBQVMsS0FBVCxpQkFBUyxRQUErQjtBQUFwRCxJQUFZLFNBQVMsR0FBVCxpQkFBd0MsQ0FBQTtBQU1wRCxhQUFvQixLQUFhO0lBQy9CLE1BQU0sQ0FBQyxRQUFRLENBQUMsY0FBYyxDQUFFLEtBQUssQ0FBRSxDQUFDO0FBQzFDLENBQUM7QUFGZSxXQUFHLE1BRWxCLENBQUE7QUFFRCxvQkFBNEIsT0FBZSxFQUFFLEVBQVcsRUFBRSxTQUFrQjtJQUMxRSxJQUFJLEdBQUcsR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFFLE9BQU8sQ0FBRSxDQUFDO0lBQzVDLEVBQUUsQ0FBQSxDQUFFLEVBQUcsQ0FBQztRQUFDLEdBQUcsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDO0lBQ3JCLEVBQUUsQ0FBQSxDQUFFLFNBQVUsQ0FBQztRQUFDLEdBQUcsQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFDO0lBQzFDLE1BQU0sQ0FBQyxHQUFHLENBQUM7QUFDYixDQUFDO0FBTGUsa0JBQVUsYUFLekIsQ0FBQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJpbXBvcnQgTm9kZSBmcm9tICcuL25vZGUnO1xyXG5pbXBvcnQgSGVhcCBmcm9tICcuL2hlYXAnO1xyXG5pbXBvcnQgeyBiZWxvbmdUbyB9IGZyb20gJy4vdXRpbCc7XHJcblxyXG4vKipcclxuICogQSog566X5rOVXHJcbiAqL1xyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBBc3RhcntcclxuICBvcGVuTGlzdDogSGVhcFxyXG4gIGNsb3NlZExpc3Q6IE5vZGVbXSA9IFtdXHJcbiAgc3RhcnROb2RlOiBOb2RlXHJcbiAgdGFyZ2V0Tm9kZTogTm9kZVxyXG5cclxuICBwcml2YXRlIGJfY2xvc2VkTGlzdDogYmVsb25nVG8gPSB7fVxyXG4gIHByaXZhdGUgc29sdXRpb246IHN0cmluZ1tdID0gW11cclxuXHJcbiAgY29uc3RydWN0b3IoIHN0YXJ0Tm9kZTogTm9kZSwgdGFyZ2V0Tm9kZTogTm9kZSApe1xyXG4gICAgdGhpcy5zdGFydE5vZGUgPSBzdGFydE5vZGU7XHJcbiAgICB0aGlzLnRhcmdldE5vZGUgPSB0YXJnZXROb2RlO1xyXG4gICAgdGhpcy5vcGVuTGlzdCA9IG5ldyBIZWFwKCBbIHN0YXJ0Tm9kZSBdLCBcIkZcIiApO1xyXG4gIH1cclxuXHJcbiAgLy8gcHVibGljIGZ1bmN0aW9uXHJcbiAgLy8gLS0tLS0tLS0tLS0tLS0tXHJcblxyXG4gIC8qKlxyXG4gICAqIOi/kOihjCBBKiDnrpfms5VcclxuICAgKi9cclxuICBydW4oKXtcclxuICAgIGNvbnNvbGUudGltZSggXCJBU3RhciBSdW4gIVwiICk7XHJcblxyXG4gICAgbGV0IGFzdGFyID0gdGhpcztcclxuICAgIHdoaWxlICggIU5vZGUuaXNTYW1lKCBhc3Rhci5vcGVuTGlzdC50b3AoKSwgYXN0YXIudGFyZ2V0Tm9kZSApICl7XHJcbiAgICAgIGxldCBjdXJyZW50Tm9kZSA9IGFzdGFyLm9wZW5MaXN0LnBvcCgpO1xyXG4gICAgICBhc3Rhci5jbG9zZWRMaXN0LnB1c2goIGN1cnJlbnROb2RlICk7XHJcbiAgICAgIGFzdGFyLmJfY2xvc2VkTGlzdFsgY3VycmVudE5vZGUuZ2V0VmFsU3RyKCkgXSA9IDE7XHJcblxyXG4gICAgICBsZXQgbmV4dE5vZGVzID0gY3VycmVudE5vZGUuZ2V0TmV4dE5vZGVzKCk7XHJcblxyXG4gICAgICBuZXh0Tm9kZXMuZm9yRWFjaChmdW5jdGlvbihuZXh0Tm9kZSl7XHJcbiAgICAgICAgbGV0IGNvc3QgPSBjdXJyZW50Tm9kZS5nZXRHKCkgKyBjdXJyZW50Tm9kZS5nZXRDb3N0VG9OZXh0KCk7XHJcbiAgICAgICAgbGV0IGluZGV4ID0gIGFzdGFyLm9wZW5MaXN0LmdldEl0ZW1JbmRleCggbmV4dE5vZGUgKTtcclxuXHJcbiAgICAgICAgaWYgKCBpbmRleCAhPT0gdW5kZWZpbmVkICYmIGNvc3QgPCBuZXh0Tm9kZS5nZXRHKCkgKXtcclxuICAgICAgICAgIGNvbnNvbGUubG9nKCBcIm5leHQgMVwiICk7XHJcbiAgICAgICAgICBhc3Rhci5vcGVuTGlzdC5yZW1vdmUoIGluZGV4ICk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoIGFzdGFyLmlzQmVsb25nVG9DbG9zZWQoIG5leHROb2RlICkgJiYgY29zdCA8IG5leHROb2RlLmdldEcoKSApe1xyXG4gICAgICAgICAgY29uc29sZS5sb2coIFwibmV4dCAyXCIgKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICggaW5kZXggPT09IHVuZGVmaW5lZCAmJiAhYXN0YXIuaXNCZWxvbmdUb0Nsb3NlZCggbmV4dE5vZGUgKSApe1xyXG4gICAgICAgICAgY29uc29sZS5sb2coIFwibmV4dCAzXCIgKTtcclxuICAgICAgICAgIG5leHROb2RlLnNldEcoIGNvc3QgKTtcclxuICAgICAgICAgIG5leHROb2RlLnNldEYoIG5leHROb2RlLmdldEcoKSArIG5leHROb2RlLmdldEgoIGFzdGFyLnRhcmdldE5vZGUgKSApO1xyXG4gICAgICAgICAgYXN0YXIub3Blbkxpc3QucHVzaCggbmV4dE5vZGUgKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgY29uc29sZS50aW1lRW5kKCBcIkFTdGFyIFJ1biAhXCIgKTtcclxuXHJcbiAgICBjb25zb2xlLmxvZyggXCIgYXN0YXIgLSBcIiwgYXN0YXIgKTtcclxuXHJcbiAgICBsZXQgdGFpbE5vZGUgPSBhc3Rhci5vcGVuTGlzdC50b3AoKTtcclxuICAgIHRoaXMuc29sdXRpb24gPSBbXTtcclxuICAgIHdoaWxlKCB0YWlsTm9kZSApe1xyXG4gICAgICB0aGlzLnNvbHV0aW9uLnVuc2hpZnQoIHRhaWxOb2RlLmdldFZhbFN0cigpICk7XHJcbiAgICAgIHRhaWxOb2RlID0gdGFpbE5vZGUucGFyZW50O1xyXG4gICAgfVxyXG5cclxuICAgIC8vIHRoaXMuc2hvd1NvbHV0aW9uKCk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiDojrflj5bop6PlhrPmlrnmoYjmlbDnu4RcclxuICAgKi9cclxuICBnZXRTb2x1dGlvbigpe1xyXG4gICAgcmV0dXJuIHRoaXMuc29sdXRpb247XHJcbiAgfVxyXG5cclxuICAvLyBwcml2YXRlIGZ1bmN0aW9uXHJcbiAgLy8gLS0tLS0tLS0tLS0tLS0tXHJcblxyXG4gIC8qKlxyXG4gICAqIOWIpOaWreiKgueCueaYr+WQpuWcqCBDTE9TRUQg5LitXHJcbiAgICovXHJcbiAgcHJpdmF0ZSBpc0JlbG9uZ1RvQ2xvc2VkKCBub2RlOiBOb2RlICl7XHJcbiAgICBsZXQgc3RyID0gbm9kZS5nZXRWYWxTdHIoKTtcclxuICAgIHJldHVybiAhIXRoaXMuYl9jbG9zZWRMaXN0W3N0cl07XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiDmmL7npLrop6PlhrPmlrnmoYjnmoTlhbfkvZPmraXpqqRcclxuICAgKi9cclxuICBwcml2YXRlIHNob3dTb2x1dGlvbigpe1xyXG4gICAgbGV0IGkgPSAwLFxyXG4gICAgICAgIGxlbiA9IHRoaXMuc29sdXRpb24ubGVuZ3RoLFxyXG4gICAgICAgIHNjYWxlID0gdGhpcy50YXJnZXROb2RlLnNjYWxlO1xyXG4gICAgZm9yICggOyBpIDwgbGVuOyBpICsrICl7XHJcbiAgICAgIGNvbnNvbGUubG9nKCBgU3RlcCAke2l9IC0tLWAgKTtcclxuICAgICAgbGV0IGl0ZW0gPSB0aGlzLnNvbHV0aW9uW2ldLnNwbGl0KCcsJyk7XHJcbiAgICAgIGZvciAoIGxldCBqID0gMDsgaiA8IHNjYWxlOyBqICsrICl7XHJcbiAgICAgICAgICBjb25zb2xlLmxvZyggYHwgJHtpdGVtWyBqKnNjYWxlIF19ICR7aXRlbVsgaipzY2FsZSArIDEgXX0gJHtpdGVtWyBqKnNjYWxlICsgMiBdfSB8YCApO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcbiIsImltcG9ydCBOb2RlIGZyb20gXCIuL25vZGVcIlxyXG5pbXBvcnQgQXN0YXIgZnJvbSAnLi9hc3RhcidcclxuaW1wb3J0IHsgJGlkLCAkY3JlYXRlRWxlIH0gZnJvbSAnLi91dGlsJ1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgR2FtZXtcclxuICBzdGFydE5vZGU6IE5vZGVcclxuICB0YXJnZXROb2RlOiBOb2RlXHJcbiAgc2NhbGU6IG51bWJlclxyXG4gIHByaXZhdGUgZ2FtZUNvbnRhaW5lcklkOiBzdHJpbmdcclxuICBwcml2YXRlIGltZ0NvbnRhaW5lcklkOiBzdHJpbmdcclxuICBwcml2YXRlIGFjdGlvbkNvbnRhaW5lcklkOiBzdHJpbmdcclxuICBwcml2YXRlIGdhbWVDb250YWluZXJFbGVcclxuICBwcml2YXRlIGltZ0NvbnRhaW5lckVsZVxyXG4gIHByaXZhdGUgYWN0aW9uQ29udGFpbmVyRWxlXHJcblxyXG4gIGNvbnN0cnVjdG9yKCBnYW1lQ29udGFpbmVySWQ6IHN0cmluZywgc2NhbGU6IG51bWJlciApe1xyXG4gICAgdGhpcy5zdGFydE5vZGUgPSBuZXcgTm9kZSggc2NhbGUgKTtcclxuICAgIHRoaXMudGFyZ2V0Tm9kZSA9IG5ldyBOb2RlKCBzY2FsZSApO1xyXG4gICAgdGhpcy5zY2FsZSA9IHNjYWxlO1xyXG5cclxuICAgIHRoaXMuZ2FtZUNvbnRhaW5lcklkID0gZ2FtZUNvbnRhaW5lcklkO1xyXG4gICAgdGhpcy5pbWdDb250YWluZXJJZCA9IFwiaW1hZ2VcIjtcclxuICAgIHRoaXMuYWN0aW9uQ29udGFpbmVySWQgPSBcImFjdGlvblwiO1xyXG5cclxuICAgIHRoaXMuaW5pdERPTSgpO1xyXG5cclxuICB9XHJcblxyXG4gIC8vIHB1YmxpYyBmdW5jdGlvblxyXG4gIC8vIC0tLS0tLS0tLS0tLS0tLVxyXG4gIG1peCgpe1xyXG4gICAgdGhpcy5zdGFydE5vZGUuc2h1ZmZsZSgpO1xyXG4gICAgdGhpcy5zZXRTdGF0dXNXaXRoTm9kZSggdGhpcy5zdGFydE5vZGUgKTtcclxuICB9XHJcbiAgc3RhcnQoKXtcclxuICAgIGlmICggTm9kZS5pc1NhbWUoIHRoaXMuc3RhcnROb2RlLCB0aGlzLnRhcmdldE5vZGUgKSApe1xyXG4gICAgICByZXR1cm4gY29uc29sZS5sb2coICd3aW4hISEnICk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBsZXQgYXN0YXIgPSBuZXcgQXN0YXIoIHRoaXMuc3RhcnROb2RlLCB0aGlzLnRhcmdldE5vZGUgKTtcclxuICAgICAgYXN0YXIucnVuKCk7XHJcbiAgICB9XHJcblxyXG4gIH1cclxuICBzZXRTdGF0dXNXaXRoTm9kZSggbm9kZTogTm9kZSApe1xyXG4gICAgbGV0IGltZ0l0ZW1zID0gdGhpcy5pbWdDb250YWluZXJFbGUuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcIml0ZW1cIik7XHJcbiAgICBmb3IgKCBsZXQgaSA9IDAsIGxlbiA9IGltZ0l0ZW1zLmxlbmd0aDsgaSA8IGxlbjsgaSArKyApe1xyXG4gICAgICBpbWdJdGVtc1tpXS5jbGFzc05hbWUgPSBgaXRlbSBpdGVtLSR7bm9kZS52YWx1ZVtpXX1gO1xyXG4gICAgfVxyXG4gIH1cclxuICBtb3ZlSW1nKCBpbmRleCApe1xyXG4gICAgY29uc29sZS5sb2coIFwiaW5kZXggLSAtIFwiLCBpbmRleCApO1xyXG4gICAgLy8gY29uc29sZS5sb2coIHRoaXMuemVyb0luZGV4ICk7XHJcbiAgfVxyXG4gIC8vIHByaXZhdGUgZnVuY3Rpb25cclxuICAvLyAtLS0tLS0tLS0tLS0tLS1cclxuICBwcml2YXRlIGluaXRET00oKXtcclxuICAgIGxldCBnYW1lID0gdGhpcztcclxuICAgIGdhbWUuZ2FtZUNvbnRhaW5lckVsZSA9ICRpZCggZ2FtZS5nYW1lQ29udGFpbmVySWQgKTtcclxuICAgIGdhbWUuaW1nQ29udGFpbmVyRWxlID0gJGNyZWF0ZUVsZSggJ2RpdicsIGdhbWUuaW1nQ29udGFpbmVySWQgKTtcclxuICAgIGdhbWUuYWN0aW9uQ29udGFpbmVyRWxlID0gJGNyZWF0ZUVsZSggJ2RpdicsIGdhbWUuYWN0aW9uQ29udGFpbmVySWQgKTtcclxuXHJcbiAgICBmb3IgKCBsZXQgaSA9IDE7IGkgPCBNYXRoLnBvdyggZ2FtZS5zY2FsZSwgMik7IGkgKysgKXtcclxuICAgICAgbGV0IGVsZSA9ICRjcmVhdGVFbGUoICdkaXYnLCB1bmRlZmluZWQsIGBpdGVtIGl0ZW0tJHtpfWAgKTtcclxuICAgICAgZWxlLmFkZEV2ZW50TGlzdGVuZXIoICdjbGljaycsIGZ1bmN0aW9uKCl7IGdhbWUubW92ZUltZyhpKSB9ICk7XHJcbiAgICAgIGdhbWUuaW1nQ29udGFpbmVyRWxlLmFwcGVuZENoaWxkKCBlbGUgKTtcclxuICAgIH1cclxuICAgIGdhbWUuaW1nQ29udGFpbmVyRWxlLmFwcGVuZENoaWxkKCAkY3JlYXRlRWxlKCAnZGl2JywgdW5kZWZpbmVkLCBcIml0ZW0gaXRlbS0wXCIgKSApO1xyXG5cclxuICAgIFtcIk1JWFwiLCBcIlNUQVJUXCJdLmZvckVhY2goIGZ1bmN0aW9uKGl0ZW0sIGluZGV4LCBhcnJheSl7XHJcbiAgICAgIGxldCBlbGUgPSAkY3JlYXRlRWxlKCAnYnV0dG9uJywgdW5kZWZpbmVkLCBgYnRuIGJ0bi0ke2l0ZW0udG9Mb3dlckNhc2UoKX1gICk7XHJcbiAgICAgIGVsZS5pbm5lckhUTUwgPSBpdGVtO1xyXG4gICAgICBzd2l0Y2goIGl0ZW0gKXtcclxuICAgICAgICBjYXNlICdNSVgnOlxyXG4gICAgICAgICAgZWxlLmFkZEV2ZW50TGlzdGVuZXIoICdjbGljaycsIGdhbWUubWl4LmJpbmQoIGdhbWUgKSApO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSAnU1RBUlQnOlxyXG4gICAgICAgICAgZWxlLmFkZEV2ZW50TGlzdGVuZXIoICdjbGljaycsIGdhbWUuc3RhcnQuYmluZCggZ2FtZSApICk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgfVxyXG4gICAgICBnYW1lLmFjdGlvbkNvbnRhaW5lckVsZS5hcHBlbmRDaGlsZCggZWxlICk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBnYW1lLmdhbWVDb250YWluZXJFbGUuYXBwZW5kQ2hpbGQoIGdhbWUuaW1nQ29udGFpbmVyRWxlICk7XHJcbiAgICBnYW1lLmdhbWVDb250YWluZXJFbGUuYXBwZW5kQ2hpbGQoIGdhbWUuYWN0aW9uQ29udGFpbmVyRWxlICk7XHJcbiAgfVxyXG59XHJcbiIsImltcG9ydCBOb2RlIGZyb20gJy4vbm9kZSc7XHJcbmltcG9ydCB7IGJlbG9uZ1RvIH0gZnJvbSAnLi91dGlsJztcclxuLy8gSGVhcCBPbiBUb3BcclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgSGVhcHtcclxuICBoZWFwOiBOb2RlW10gPSBbXVxyXG4gIGJfaGVhcDogYmVsb25nVG8gPSB7fVxyXG4gIGtleTogc3RyaW5nXHJcbiAgY29uc3RydWN0b3IoIG5vZGVMaXN0OiBOb2RlW10sIGtleTogc3RyaW5nICl7XHJcbiAgICB0aGlzLmtleSA9IGtleTtcclxuICAgIC8vIOeUqOS+neasoeaPkuWFpeeahOaWueW8j+aehOmAoOWIneWni+eahOWwj+mhtuWghlxyXG4gICAgbGV0IGkgPSAwLFxyXG4gICAgICAgIGxlbiA9IG5vZGVMaXN0Lmxlbmd0aDtcclxuICAgIGZvciAoIDsgaSA8IGxlbjsgaSArKyApe1xyXG4gICAgICB0aGlzLnB1c2goIG5vZGVMaXN0W2ldICk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvLyBwdWJsaWMgZnVuY3Rpb25cclxuICAvLyAtLS0tLS0tLS0tLS0tLS1cclxuXHJcbiAgLyoqXHJcbiAgICog6I635Y+W5aCG5Lit5LiL5qCH5Li6IGluZGV4IOeahOWAvFxyXG4gICAqL1xyXG4gIGdldCggaW5kZXg6IG51bWJlciApe1xyXG4gICAgaWYgKCBpbmRleCA+PSAwICYmIGluZGV4IDwgdGhpcy5oZWFwLmxlbmd0aCApe1xyXG4gICAgICByZXR1cm4gdGhpcy5oZWFwWyBpbmRleCBdWyB0aGlzLmtleSBdO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICog5ZCR5aCG5Lit5o+S5YWl5LiA5Liq5paw55qE5YWD57Sg5bm26LCD5pW05aCGXHJcbiAgICog5paw5YWD57Sg5LuO5pWw57uE5bC+6YOo5o+S5YWl77yM54S25ZCO5a+55paw5YWD57Sg5omn6KGM5LiK5rWu6LCD5pW0XHJcbiAgICovXHJcbiAgcHVzaCggbm9kZTogTm9kZSApe1xyXG4gICAgdGhpcy5oZWFwLnB1c2goIG5vZGUgKTtcclxuICAgIHRoaXMuc2V0QkhlYXAoIHRoaXMuaGVhcC5sZW5ndGggLSAxICk7XHJcbiAgICB0aGlzLmdvVXAoIHRoaXMuaGVhcC5sZW5ndGggLSAxICk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiDliKDpmaTlubbov5Tlm57loIbpobblhYPntKDlubbosIPmlbTloIZcclxuICAgKiDlhYjlsIbloIbpobblhYPntKDkuI7mlbDnu4TmnKvlsL7lhYPntKDkupLmjaLvvIznhLblkI7lvLnlh7rmlbDnu4TmnKvlsL7nmoTlhYPntKDvvIzmnIDlkI7lr7nloIbpobblhYPntKDmiafooYzkuIvmsonmk43kvZxcclxuICAgKi9cclxuICBwb3AoKXtcclxuICAgIGlmICggdGhpcy5pc0VtcHR5KCkgKSByZXR1cm47XHJcbiAgICBsZXQgcmVzdWx0O1xyXG4gICAgdGhpcy5zd2FwKCAwLCB0aGlzLmhlYXAubGVuZ3RoIC0gMSApO1xyXG4gICAgcmVzdWx0ID0gdGhpcy5oZWFwLnBvcCgpO1xyXG4gICAgdGhpcy5yZW1vdmVCSGVhcCggcmVzdWx0LmdldFZhbFN0cigpICk7XHJcbiAgICAhdGhpcy5pc0VtcHR5KCkgJiYgdGhpcy5nb0Rvd24oMCk7XHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICog56e76Zmk5aCG5Lit5LiL5qCH5Li6IGluZGV4IOeahOWFg+e0oFxyXG4gICAqIOWwhumcgOenu+mZpOeahOmhueS4juWghumhtuS6kuaNou+8jOeEtuWQjuW8ueWHuuWghumhtu+8jOacgOWQjuWvueS6kuaNoumhue+8iOWOn+Wghumhtu+8ieaJp+ihjOS4iua1ruaTjeS9nFxyXG4gICAqL1xyXG4gIHJlbW92ZSggaW5kZXg6IG51bWJlciApe1xyXG4gICAgaWYoIGluZGV4IDwgMCB8fCBpbmRleCA+PSB0aGlzLmhlYXAubGVuZ3RoICkgcmV0dXJuO1xyXG4gICAgdGhpcy5zd2FwKCAwLCBpbmRleCApO1xyXG4gICAgdGhpcy5wb3AoKTtcclxuICAgIHRoaXMuZ29VcCggaW5kZXggKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIOiOt+WPluWghumhtuWFg+e0oFxyXG4gICAqL1xyXG4gIHRvcCgpe1xyXG4gICAgcmV0dXJuIHRoaXMuaGVhcC5sZW5ndGggJiYgdGhpcy5oZWFwWzBdO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICog5Yik5pat5aCG5piv5ZCm5Li656m6XHJcbiAgICovXHJcbiAgaXNFbXB0eSgpe1xyXG4gICAgcmV0dXJuICF0aGlzLmhlYXAubGVuZ3RoO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICog5Yik5pat5aCG5Lit5piv5ZCm5pyJ5YWD57SgIG5vZGVcclxuICAgKi9cclxuICBnZXRJdGVtSW5kZXgoIG5vZGU6IE5vZGUgKXtcclxuICAgIHJldHVybiB0aGlzLmJfaGVhcFsgbm9kZS5nZXRWYWxTdHIoKSBdO1xyXG4gIH1cclxuXHJcbiAgLy8gcHJpdmF0ZSBmdW5jdGlvblxyXG4gIC8vIC0tLS0tLS0tLS0tLS0tLVxyXG5cclxuICAvKipcclxuICAgKiDov5Tlm57loIbkuK3kuIvmoIfkuLogaW5kZXgg55qE5YWD57SgXHJcbiAgICovXHJcbiAgcHJpdmF0ZSBnZXRWYWx1ZSggaW5kZXg6IG51bWJlciApe1xyXG4gICAgaWYoIGluZGV4IDwgMCB8fCBpbmRleCA+PSB0aGlzLmhlYXAubGVuZ3RoICkgcmV0dXJuO1xyXG4gICAgcmV0dXJuIHRoaXMuaGVhcFtpbmRleF1bdGhpcy5rZXldO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICog5aCG5Lit5LiL5qCH5Li6IGluZGV4IOeahOWFg+e0oOeahOS4iua1ruaTjeS9nFxyXG4gICAqL1xyXG4gIHByaXZhdGUgZ29VcChpbmRleDogbnVtYmVyKXtcclxuICAgIGxldCB2YWx1ZSA9IHRoaXMuZ2V0VmFsdWUoaW5kZXgpLFxyXG4gICAgICAgIHBhcmVudCA9IHRoaXMuZ2V0UGFyZW50SW5kZXgoaW5kZXgpO1xyXG5cclxuICAgIGlmICggcGFyZW50ID09PSB1bmRlZmluZWQgKSByZXR1cm47XHJcblxyXG4gICAgaWYgKCB0aGlzLmdldFZhbHVlKCBwYXJlbnQgKSA+IHRoaXMuZ2V0VmFsdWUoIGluZGV4ICkgKXtcclxuICAgICAgdGhpcy5zd2FwKCBpbmRleCwgcGFyZW50ICk7XHJcbiAgICAgIHRoaXMuZ29VcCggcGFyZW50ICk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiDloIbkuK3kuIvmoIfkuLogaW5kZXgg55qE5YWD57Sg55qE5LiL5rKJ5pON5L2cXHJcbiAgICovXHJcbiAgcHJpdmF0ZSBnb0Rvd24oaW5kZXg6IG51bWJlcil7XHJcbiAgICBsZXQgdmFsdWUgPSB0aGlzLmdldFZhbHVlKGluZGV4KSxcclxuICAgICAgICBbbGVmdCwgcmlnaHRdID0gdGhpcy5nZXRDaGlsZEluZGV4KGluZGV4KSxcclxuICAgICAgICBzd2FwSW5kZXggPSBsZWZ0O1xyXG5cclxuICAgIC8vIOWFg+e0oOaYr+WPtuWtkOiKgueCue+8jOayoeacieWtkOWFg+e0oFxyXG4gICAgaWYgKCBsZWZ0ID09PSBudWxsICkgcmV0dXJuO1xyXG5cclxuICAgIC8vIOiLpeWFg+e0oOacieS4pOS4quWtkOWFg+e0oO+8jOiuvue9riBzd2FwSW5kZXgg5Li66L6D5bCP55qE6YKj5Liq5a2Q5YWD57Sg55qE5LiL5qCHXHJcbiAgICAvLyDoi6XlhYPntKDlj6rmnInlt6blhL/lrZDvvIxzd2FwSW5kZXgg5bey57uP6KKr5Yid5aeL5YyW5Li6IGxlZnQg55qE5YC85LqGXHJcbiAgICBpZiAoIHJpZ2h0ICl7XHJcbiAgICAgIHN3YXBJbmRleCA9IHRoaXMuZ2V0VmFsdWUobGVmdCkgPCB0aGlzLmdldFZhbHVlKHJpZ2h0KSA/IGxlZnQgOiByaWdodDtcclxuICAgIH1cclxuXHJcbiAgICAvLyDmr5TovoPniLblhYPntKDlkozovoPlsI/nmoTpgqPkuKrlrZDlhYPntKDnmoTlgLzvvIzoi6XniLblhYPntKDnmoTlgLzovoPlpKfvvIzliJnnva7mjaLniLblhYPntKDlkozovoPlsI/nmoTlrZDlhYPntKBcclxuICAgIC8vIOeEtuWQjuWcqOaWsOeahOe9ruaNoueahOS9jee9ruWkhOe7p+e7reaJp+ihjOS4i+ayieaTjeS9nFxyXG4gICAgaWYgKCB0aGlzLmdldFZhbHVlKHN3YXBJbmRleCkgPCB2YWx1ZSApIHtcclxuICAgICAgdGhpcy5zd2FwKCBpbmRleCwgc3dhcEluZGV4ICk7XHJcbiAgICAgIHRoaXMuZ29Eb3duKCBzd2FwSW5kZXggKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIOiOt+WPluS4i+agh+S4uiBpbmRleCDnmoTlhYPntKDlnKjloIbkuK3nmoTniLblhYPntKBcclxuICAgKi9cclxuICBwcml2YXRlIGdldFBhcmVudEluZGV4KCBpbmRleDogbnVtYmVyICl7XHJcbiAgICBpZiAoIGluZGV4IDwgMCB8fCBpbmRleCA+PSB0aGlzLmhlYXAubGVuZ3RoICkgcmV0dXJuO1xyXG4gICAgaWYgKCBpbmRleCA9PT0gMCApIHJldHVybiAwO1xyXG4gICAgcmV0dXJuIE1hdGguZmxvb3IoIChpbmRleC0xKS8yICk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiDojrflj5bkuIvmoIfkuLogaW5kZXgg55qE5YWD57Sg5Zyo5aCG5Lit55qE5a2Q5YWD57Sg77yM57y65aSx55qE5a2Q5YWD57Sg55SoIG51bGwg5Luj5pu/XHJcbiAgICovXHJcbiAgcHJpdmF0ZSBnZXRDaGlsZEluZGV4KCBpbmRleDogbnVtYmVyICl7XHJcbiAgICBsZXQgbGVmdCA9IDIqaW5kZXggKyAxLFxyXG4gICAgICAgIHJpZ2h0ID0gMippbmRleCArIDIsXHJcbiAgICAgICAgbGVuZ3RoID0gdGhpcy5oZWFwLmxlbmd0aDtcclxuXHJcbiAgICBpZiAoIHJpZ2h0IDw9IGxlbmd0aCAtIDEgKXtcclxuICAgICAgcmV0dXJuIFsgbGVmdCwgcmlnaHQgXTtcclxuICAgIH0gZWxzZSBpZiAoIGxlZnQgPT09IGxlbmd0aCAtIDEgKSB7XHJcbiAgICAgIHJldHVybiBbIGxlZnQsIG51bGwgXTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHJldHVybiBbIG51bGwsIG51bGwgXTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIOS6pOaNouWghuS4reS4i+agh+WIhuWIq+S4uiBpbmRleDEg5ZKMIGluZGV4MiDnmoTkuKTkuKrlhYPntKBcclxuICAgKi9cclxuICBwcml2YXRlIHN3YXAoIGluZGV4MTogbnVtYmVyLCBpbmRleDI6IG51bWJlciApe1xyXG4gICAgbGV0IHRtcCA9IHRoaXMuaGVhcFtpbmRleDFdO1xyXG4gICAgdGhpcy5oZWFwW2luZGV4MV0gPSB0aGlzLmhlYXBbaW5kZXgyXTtcclxuICAgIHRoaXMuaGVhcFtpbmRleDJdID0gdG1wO1xyXG5cclxuICAgIHRoaXMuc2V0QkhlYXAoIGluZGV4MSApO1xyXG4gICAgdGhpcy5zZXRCSGVhcCggaW5kZXgyICk7XHJcbiAgfVxyXG4gIHByaXZhdGUgc2V0QkhlYXAoIGluZGV4OiBudW1iZXIgKXtcclxuICAgIHRoaXMuYl9oZWFwWyB0aGlzLmhlYXBbIGluZGV4IF0uZ2V0VmFsU3RyKCkgXSA9IGluZGV4O1xyXG4gIH1cclxuICBwcml2YXRlIHJlbW92ZUJIZWFwKCBzdHI6IHN0cmluZyApe1xyXG4gICAgZGVsZXRlIHRoaXMuYl9oZWFwWyBzdHIgXTtcclxuICB9XHJcbn1cclxuIiwiaW1wb3J0IEdhbWUgZnJvbSBcIi4vZ2FtZVwiO1xyXG5sZXQgZ2FtZSA9IG5ldyBHYW1lKCBcImNvbnRhaW5lclwiLCAzICk7XHJcblxyXG5jb25zb2xlLmxvZyggZ2FtZSApO1xyXG5jb25zb2xlLmxvZyggXCItLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cIiApO1xyXG5cclxuLy8gaW1wb3J0IG1pbkhlYXAgZnJvbSAnLi9taW4taGVhcCc7XHJcbi8vXHJcbi8vIGNvbnNvbGUubG9nKCBcIi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVwiICk7XHJcbi8vXHJcbi8vIGxldCBoZWFwID0gbmV3IG1pbkhlYXAoIFsgMywgNSwgNCwgMSwgMiwgMTksIDE4LCAyMiwgMTIsIDddICk7XHJcbi8vXHJcbi8vIGNvbnNvbGUubG9nKCBoZWFwLmhlYXAgKTtcclxuLy9cclxuLy8gLy8gZm9yICggbGV0IGkgPSAwLCBsZW4gPSBoZWFwLmhlYXAubGVuZ3RoOyBpIDwgbGVuOyBpICsrICl7XHJcbi8vIC8vICAgY29uc29sZS5sb2coIGhlYXAucG9wKCkgKTtcclxuLy8gLy8gICBjb25zb2xlLmxvZyggaGVhcC5oZWFwICk7XHJcbi8vIC8vIH1cclxuLy8gLy9cclxuLy8gLy8gY29uc29sZS5sb2coIGhlYXAucG9wKCkgKTtcclxuLy8gLy8gY29uc29sZS5sb2coIGhlYXAuaGVhcCApO1xyXG4iLCJpbXBvcnQgeyBESVJFQ1RJT04gfSBmcm9tICcuL3V0aWwnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTm9kZXtcclxuICB2YWx1ZTogbnVtYmVyW11cclxuICB6ZXJvSW5kZXg6IG51bWJlclxyXG4gIHNjYWxlOiBudW1iZXJcclxuICBwYXJlbnQ6IE5vZGVcclxuICBGOiBudW1iZXIgPSAwXHJcbiAgRzogbnVtYmVyID0gMFxyXG4gIGNvbnN0cnVjdG9yKCBzY2FsZTogbnVtYmVyLCBpbml0QXJyPzogbnVtYmVyW10gKSB7XHJcbiAgICB0aGlzLnNjYWxlID0gc2NhbGU7XHJcbiAgICB0aGlzLnZhbHVlID0gaW5pdEFyciA/IGluaXRBcnIgOiB0aGlzLmluaXROb2RlVmFsdWVCeVNjYWxlKCBzY2FsZSApO1xyXG4gICAgdGhpcy56ZXJvSW5kZXggPSBNYXRoLnBvdyhzY2FsZSwgMikgLSAxO1xyXG5cclxuICAgIC8vIHRoaXMucGFyZW50ID0gbmV3IE5vZGUodGhpcy5zY2FsZSk7XHJcbiAgfVxyXG5cclxuICAvLyBwdWJsaWMgZnVuY3Rpb25cclxuICAvLyAtLS0tLS0tLS0tLS0tLS1cclxuXHJcbiAgLyoqXHJcbiAgICog6I635Y+W6IqC54K555qE5YC877yM5bCG6IqC54K555qE5pWw57uE6KGo56S66L2s5o2i5oiQ5a2X56ym5Liy6KGo56S65bm26L+U5ZueXHJcbiAgICovXHJcbiAgZ2V0VmFsU3RyKCl7XHJcbiAgICByZXR1cm4gdGhpcy52YWx1ZS50b1N0cmluZygpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICog6IqC54K555qE5Lmx5bqP566X5rOVXHJcbiAgICog6ZqP5py65oyH5a6a5LiA5Liq5pa55ZCR77yM5Luk6IqC54K55ZCR6K+l5pa55ZCR56e75Yqo77yM6YeN5aSN5LiK6L+w6L+H56iL6Iul5bmy5qyh6L6+5Yiw5Lmx5bqP55qE55uu55qEXHJcbiAgICovXHJcbiAgc2h1ZmZsZSgpe1xyXG4gICAgZm9yKCBsZXQgaSA9IDA7IGkgPCA1MDAwOyBpICsrICl7XHJcbiAgICAgIGxldCBkaXJlY3Rpb24gPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiA0ICsgMSk7XHJcbiAgICAgIHRoaXMubW92ZVRvKCBkaXJlY3Rpb24gKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIOW9k+WJjeiKgueCueWQkeaWueWQkSBkaXJlY3Rpb24g56e75Yqo5LiA5qyhXHJcbiAgICog5YW25a6e5piv6IqC54K555qE5pWw57uE6KGo56S65Lit55qE5pWw5a2XIDAg5ZCR5pa55ZCRIGRpcmVjdGlvbiDnp7vliqjkuIDmrKFcclxuICAgKi9cclxuICBtb3ZlVG8oIGRpcmVjdGlvbjogbnVtYmVyICl7XHJcbiAgICBpZiAoICF0aGlzLmNhbk1vdmVUbyggZGlyZWN0aW9uICkgKSByZXR1cm47XHJcbiAgICBsZXQgdGFyZ2V0SW5kZXg7XHJcbiAgICBzd2l0Y2goIGRpcmVjdGlvbiApe1xyXG4gICAgICBjYXNlIERJUkVDVElPTi5VUDpcclxuICAgICAgICB0YXJnZXRJbmRleCA9IHRoaXMuemVyb0luZGV4IC0gdGhpcy5zY2FsZTtcclxuICAgICAgICBicmVhaztcclxuICAgICAgY2FzZSBESVJFQ1RJT04uUklHSFQ6XHJcbiAgICAgICAgdGFyZ2V0SW5kZXggPSB0aGlzLnplcm9JbmRleCArIDE7XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIGNhc2UgRElSRUNUSU9OLkRPV046XHJcbiAgICAgICAgdGFyZ2V0SW5kZXggPSB0aGlzLnplcm9JbmRleCArIHRoaXMuc2NhbGU7XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIGNhc2UgRElSRUNUSU9OLkxFRlQ6XHJcbiAgICAgICAgdGFyZ2V0SW5kZXggPSB0aGlzLnplcm9JbmRleCAtIDE7XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgdGFyZ2V0SW5kZXggPSB0aGlzLnplcm9JbmRleDtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLnZhbHVlWyB0aGlzLnplcm9JbmRleCBdID0gdGhpcy52YWx1ZVsgdGFyZ2V0SW5kZXggXTtcclxuICAgIHRoaXMudmFsdWVbIHRhcmdldEluZGV4IF0gPSAwO1xyXG4gICAgdGhpcy56ZXJvSW5kZXggPSB0YXJnZXRJbmRleDtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIOiOt+WPluW9k+WJjeiKgueCueWcqOWPr+enu+WKqOaWueWQkeS4iueahOWtkOiKgueCueaVsOe7hFxyXG4gICAqL1xyXG4gIGdldE5leHROb2Rlcygpe1xyXG4gICAgbGV0IG5vZGUgPSB0aGlzO1xyXG4gICAgbGV0IG5leHROb2RlczogTm9kZVtdID0gW107XHJcbiAgICBbIERJUkVDVElPTi5VUCwgRElSRUNUSU9OLlJJR0hULCBESVJFQ1RJT04uRE9XTiwgRElSRUNUSU9OLkxFRlQgXS5mb3JFYWNoKCBmdW5jdGlvbihkaXJlY3Rpb24pe1xyXG4gICAgICBpZiAoIG5vZGUuY2FuTW92ZVRvKCBkaXJlY3Rpb24gKSApe1xyXG4gICAgICAgIGxldCBuZXdOb2RlID0gTm9kZS5ub2RlQ2xvbmUoIG5vZGUgKTtcclxuICAgICAgICBuZXdOb2RlLnBhcmVudCA9IG5vZGU7XHJcbiAgICAgICAgbmV3Tm9kZS5tb3ZlVG8oZGlyZWN0aW9uKTtcclxuICAgICAgICBuZXh0Tm9kZXMucHVzaCggbmV3Tm9kZSApO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICAgIHJldHVybiBuZXh0Tm9kZXM7XHJcbiAgfVxyXG5cclxuICBjYW5Nb3ZlVG8oIGRpcmVjdGlvbjogbnVtYmVyICl7XHJcbiAgICBsZXQgcm93ID0gTWF0aC5mbG9vciggdGhpcy56ZXJvSW5kZXggLyB0aGlzLnNjYWxlICk7XHJcbiAgICBsZXQgY29sID0gdGhpcy56ZXJvSW5kZXggJSB0aGlzLnNjYWxlO1xyXG5cclxuICAgIHN3aXRjaCggZGlyZWN0aW9uICl7XHJcbiAgICAgIGNhc2UgRElSRUNUSU9OLlVQOlxyXG4gICAgICAgIHJldHVybiByb3cgIT09IDA7XHJcbiAgICAgIGNhc2UgRElSRUNUSU9OLlJJR0hUOlxyXG4gICAgICAgIHJldHVybiBjb2wgIT09IHRoaXMuc2NhbGUgLSAxO1xyXG4gICAgICBjYXNlIERJUkVDVElPTi5ET1dOOlxyXG4gICAgICAgIHJldHVybiByb3cgIT09IHRoaXMuc2NhbGUgLSAxO1xyXG4gICAgICBjYXNlIERJUkVDVElPTi5MRUZUOlxyXG4gICAgICAgIHJldHVybiBjb2wgIT09IDA7XHJcbiAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICog6I635Y+W5LuO5b2T5YmN6IqC54K56LWw5Yiw5LiL5LiA5Liq6IqC54K555qE5Luj5Lu3XHJcbiAgICovXHJcbiAgZ2V0Q29zdFRvTmV4dCgpe1xyXG4gICAgcmV0dXJuIDE7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiDorr7nva7oioLngrnnmoQgRiDlgLzvvIzloIbkvJrmoLnmja7ov5nkuKrlgLzov5vooYzmjpLluo9cclxuICAgKi9cclxuICBzZXRGKCB2YWx1ZTogbnVtYmVyICl7XHJcbiAgICB0aGlzLkYgPSB2YWx1ZTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIOiOt+WPluiKgueCueeahCBHIOWAvFxyXG4gICAqL1xyXG4gIGdldEcoKXtcclxuICAgIHJldHVybiB0aGlzLkc7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiDorr7nva7oioLngrnnmoQgRyDlgLxcclxuICAgKi9cclxuICBzZXRHKCB2YWx1ZTogbnVtYmVyICl7XHJcbiAgICB0aGlzLkcgPSB2YWx1ZTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIOiOt+WPluiKgueCueeahCBIIOWAvFxyXG4gICAqL1xyXG4gIGdldEgoIHRhcmdldE5vZGU6IE5vZGUgKXtcclxuICAgIGxldCBpID0gMCxcclxuICAgICAgICBsZW4gPSB0aGlzLnZhbHVlLmxlbmd0aCxcclxuICAgICAgICBtYW5oYXR0ZW4gPSAwLFxyXG4gICAgICAgIGRpZmYgPSAwO1xyXG5cclxuICAgIGZvciAoIDsgaSA8IGxlbjsgaSArKyApe1xyXG4gICAgICBpZiAoIHRoaXMudmFsdWVbaV0gIT09IGkgKyAxICkgZGlmZiArKztcclxuXHJcbiAgICAgIGxldCB2ID0gdGhpcy52YWx1ZVtpXTtcclxuICAgICAgaWYoIHYgIT09IDAgKXtcclxuICAgICAgICAvLyBub3cgaW5cclxuICAgICAgICBsZXQgcm93ID0gTWF0aC5mbG9vciggaS90aGlzLnNjYWxlICk7XHJcbiAgICAgICAgbGV0IGNvbCA9IGkldGhpcy5zY2FsZTtcclxuICAgICAgICAvLyBzaG91bGQgaW5cclxuICAgICAgICBsZXQgX3JvdyA9IE1hdGguZmxvb3IoIHYvdGhpcy5zY2FsZSApO1xyXG4gICAgICAgIGxldCBfY29sID0gdiV0aGlzLnNjYWxlO1xyXG5cclxuICAgICAgICBtYW5oYXR0ZW4gKz0gTWF0aC5hYnMoIHJvdyAtIF9yb3cgKSArIE1hdGguYWJzKCBjb2wgLSBfY29sICk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gMSptYW5oYXR0ZW4gKyAxMDAwKmRpZmY7XHJcbiAgfVxyXG5cclxuICAvLyBwcml2YXRlIGZ1bmN0aW9uXHJcbiAgLy8gLS0tLS0tLS0tLS0tLS0tLVxyXG5cclxuICAvKipcclxuICAgKiDmoLnmja7nu7TluqYgc2NhbGUg5p6E6YCg6IqC54K555qE5Yid5aeL6KGo56S65pWw57uEXHJcbiAgICovXHJcbiAgcHJpdmF0ZSBpbml0Tm9kZVZhbHVlQnlTY2FsZSggc2NhbGU6IG51bWJlciApe1xyXG4gICAgbGV0IHZhbCA9IFtdO1xyXG4gICAgZm9yICggbGV0IGkgPSAxOyBpIDwgTWF0aC5wb3coc2NhbGUsIDIpOyBpICsrICl7XHJcbiAgICAgIHZhbC5wdXNoKCBpICk7XHJcbiAgICB9XHJcbiAgICB2YWwucHVzaCggMCApO1xyXG4gICAgcmV0dXJuIHZhbDtcclxuICB9XHJcbiAgLy8gc3RhdGljIGZ1bmN0aW9uXHJcbiAgLy8gLS0tLS0tLS0tLS0tLS0tXHJcblxyXG4gIC8qKlxyXG4gICAqIOWIpOaWreS4pOS4quiKgueCueaYr+WQpuebuOetiVxyXG4gICAqIOmAmui/h+WwhuiKgueCueeahOaVsOe7hOihqOekuui9rOaNouaIkOWtl+espuS4suadpei/m+ihjOavlOi+g1xyXG4gICAqL1xyXG4gIHN0YXRpYyBpc1NhbWUoIGN1cnJlbnROb2RlOiBOb2RlLCB0YXJnZXROb2RlOiBOb2RlICl7XHJcbiAgICByZXR1cm4gY3VycmVudE5vZGUuZ2V0VmFsU3RyKCkgPT09IHRhcmdldE5vZGUuZ2V0VmFsU3RyKCk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiDln7rkuo4gbm9kZSDlpI3liLbkuIDkuKrmlrDnmoToioLngrlcclxuICAgKi9cclxuICBzdGF0aWMgbm9kZUNsb25lKCBub2RlOiBOb2RlICl7XHJcbiAgICBsZXQgbmV3Tm9kZSA9IG5ldyBOb2RlKCBub2RlLnNjYWxlICk7XHJcbiAgICBuZXdOb2RlLnZhbHVlID0gbm9kZS52YWx1ZS5zbGljZSgwKTtcclxuICAgIG5ld05vZGUuemVyb0luZGV4ID0gbm9kZS56ZXJvSW5kZXg7XHJcbiAgICByZXR1cm4gbmV3Tm9kZTtcclxuICB9XHJcbn1cclxuIiwiZXhwb3J0IGVudW0gRElSRUNUSU9OICB7IFVQID0gMSwgUklHSFQsIERPV04sIExFRlQgfVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBiZWxvbmdUb3tcclxuICAgIFtwcm9wTmFtZTogc3RyaW5nXTogbnVtYmVyO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gJGlkKGVsZUlkOiBzdHJpbmcpe1xyXG4gIHJldHVybiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCggZWxlSWQgKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uICRjcmVhdGVFbGUoIHRhZ05hbWU6IHN0cmluZywgaWQ/OiBzdHJpbmcsIGNsYXNzTmFtZT86IHN0cmluZyApe1xyXG4gIGxldCBlbGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCB0YWdOYW1lICk7XHJcbiAgaWYoIGlkICkgZWxlLmlkID0gaWQ7XHJcbiAgaWYoIGNsYXNzTmFtZSApIGVsZS5jbGFzc05hbWUgPSBjbGFzc05hbWU7XHJcbiAgcmV0dXJuIGVsZTtcclxufVxyXG4iXX0=
