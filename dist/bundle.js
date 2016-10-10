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
            this.solution.push(tailNode);
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
        var len = this.solution.length, i = len - 1, scale = this.targetNode.scale;
        for (; i > -1; i--) {
            console.log("Step " + (len - i) + ": ");
            var item = this.solution[i].getValStr().split(',');
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
        this.currentNode = new node_1.default(scale);
        this.targetNode = new node_1.default(scale);
        this.scale = scale;
        this.gameContainerId = gameContainerId;
        this.imgContainerId = "image";
        this.actionContainerId = "action";
        this.gameContainer = util_1.$id(this.gameContainerId);
        this.imgContainer = util_1.$createEle('div', this.imgContainerId);
        this.actionContainer = util_1.$createEle('div', this.actionContainerId);
        this.init();
    }
    // public function
    // ---------------
    /**
     * mix 按钮执行函数
     * 混合，由起始节点乱序得到一个新的节点，并根据新节点设置页面中的显示状态
     */
    Game.prototype.mix = function () {
        this.currentNode.shuffle();
        this.setStatusWithNode(this.currentNode);
    };
    /**
     * start 按钮执行函数
     * 执行 A* 算法
     */
    Game.prototype.start = function () {
        var game = this;
        if (node_1.default.isSame(this.currentNode, this.targetNode)) {
            this.win();
        }
        else {
            var astar = new astar_1.default(this.currentNode, this.targetNode);
            astar.run();
            var solution_1 = astar.getSolution();
            if (solution_1.length) {
                var len = solution_1.length, i_1 = len - 1;
                var id_1 = setInterval(function () {
                    if (i_1 === -1) {
                        clearInterval(id_1);
                    }
                    else {
                        game.currentNode = solution_1[i_1];
                        game.setStatusWithNode(solution_1[i_1]);
                        i_1--;
                    }
                }, 500);
            }
        }
    };
    /**
     * 赢得游戏
     */
    Game.prototype.win = function () {
        console.log("win!!!");
    };
    // private function
    // ---------------
    /**
     * 初始化函数
     */
    Game.prototype.init = function () {
        this.initImage();
        this.initOperation();
    };
    /**
     * 拼图的图片显示部分的初始化
     */
    Game.prototype.initImage = function () {
        var game = this;
        // game.imgContainer.style.width = `${ this.scale * 82 }px`;
        // 节点的数组表示中的每一个数组的项对应一个格子
        for (var i = Math.pow(game.scale, 2) - 1; i > -1; i--) {
            var ele = util_1.$createEle('div', undefined, "item item-" + i + " pos-" + i);
            ele.addEventListener('click', function (e) { game.moveImg(e); });
            ele.setAttribute("data-pos", "" + i);
            if (i === 0) {
                game.imgContainer.appendChild(ele);
            }
            else {
                game.imgContainer.insertBefore(ele, game.imgContainer.firstChild);
            }
        }
        game.gameContainer.appendChild(game.imgContainer);
    };
    /**
     * 拼图的按钮操作部分的初始化
     */
    Game.prototype.initOperation = function () {
        var game = this;
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
            game.actionContainer.appendChild(ele);
        });
        game.gameContainer.appendChild(game.actionContainer);
    };
    /**
     * 根据节点的数组表示来更新页面中的显示状态
     */
    Game.prototype.setStatusWithNode = function (node) {
        var imgItems = this.imgContainer.getElementsByClassName("item");
        for (var i = 0, len = imgItems.length; i < len; i++) {
            imgItems[i].className = util_1.$replaceClass(imgItems[i].className, "item-" + node.value[i], "item");
            imgItems[i].setAttribute("data-pos", "" + node.value[i]);
        }
    };
    /**
     * 图片块上的 click 事件处理函数，用来移动图片块
     */
    Game.prototype.moveImg = function (e) {
        var imgNumber = e.target.getAttribute("data-pos");
        var nonZeroDir = this.currentNode.getNonZeroDirection();
        if (nonZeroDir[imgNumber]) {
            var direction = util_1.DIRECTION[("" + nonZeroDir[imgNumber])];
            this.currentNode.moveTo(direction);
            this.setStatusWithNode(this.currentNode);
        }
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
        var targetIndex = this.getTargetIndex(direction);
        this.value[this.zeroIndex] = this.value[targetIndex];
        this.value[targetIndex] = 0;
        this.zeroIndex = targetIndex;
    };
    /**
     * 获取当前节点的可能移动方向（用 0 位的移动进行表示）
     */
    Node.prototype.getZeroDirection = function () {
        var node = this;
        var Direction = {};
        ["UP", "RIGHT", "DOWN", "LEFT"].forEach(function (dir) {
            var _dir = util_1.DIRECTION[dir];
            if (node.canMoveTo(_dir)) {
                var targetIndex = node.getTargetIndex(_dir);
                Direction[dir] = "" + node.value[targetIndex];
            }
        });
        return Direction;
    };
    /**
     * 将当前节点的可能移动方向由用 0 位的移动来表示转换成用 0 位邻接的非 0 数字的移动来进行表示
     */
    Node.prototype.getNonZeroDirection = function () {
        var Direction = {};
        var zeroDir = this.getZeroDirection();
        for (var val in zeroDir) {
            // let _val;
            // switch( val ){
            //   case "UP":
            //     _val = "DOWN";
            //     break;
            //   case "RIGHT":
            //     _val = "LEFT";
            //     break;
            //   case "DOWN":
            //     _val = "UP";
            //     break;
            //   case "LEFT":
            //     _val = "RIGHT";
            //     break;
            // }
            // Direction[ zeroDir[ val ] ] = _val;
            Direction[zeroDir[val]] = val;
        }
        console.log(Direction);
        return Direction;
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
    /**
     * 判断当前节点（节点中的 0 位）是否可以沿 direction 方向移动
     */
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
        return 1 * manhatten + 100 * diff;
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
    /**
     * 获取当前节点中处于 0 位的方向 direction 处的邻接数字的下标
     */
    Node.prototype.getTargetIndex = function (direction) {
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
        return targetIndex;
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
;
function $id(eleId) {
    return document.getElementById(eleId);
}
exports.$id = $id;
;
function $createEle(tagName, id, className) {
    var ele = document.createElement(tagName);
    if (id)
        ele.id = id;
    if (className)
        ele.className = className;
    return ele;
}
exports.$createEle = $createEle;
;
function $replaceClass(className, newClass, prefix) {
    var result = "";
    var classArr = className.split(" ");
    for (var i = 0, len = classArr.length; i < len; i++) {
        var index = classArr[i].indexOf(prefix + "-");
        if (index !== -1) {
            classArr[i] = newClass;
        }
        result += classArr[i] + " ";
    }
    return result.trim();
}
exports.$replaceClass = $replaceClass;
function $addClass(className, newClass) {
}
exports.$addClass = $addClass;
function $removeClass() {
}
exports.$removeClass = $removeClass;
},{}]},{},[4])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy8ubnBtaW5zdGFsbC9icm93c2VyLXBhY2svNi4wLjEvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwic3JjL3RzL2FzdGFyLnRzIiwic3JjL3RzL2dhbWUudHMiLCJzcmMvdHMvaGVhcC50cyIsInNyYy90cy9tYWluLnRzIiwic3JjL3RzL25vZGUudHMiLCJzcmMvdHMvdXRpbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7QUNBQSxxQkFBaUIsUUFBUSxDQUFDLENBQUE7QUFDMUIscUJBQWlCLFFBQVEsQ0FBQyxDQUFBO0FBRzFCOztHQUVHO0FBQ0g7SUFTRSxlQUFhLFNBQWUsRUFBRSxVQUFnQjtRQVA5QyxlQUFVLEdBQVcsRUFBRSxDQUFBO1FBSWYsaUJBQVksR0FBYSxFQUFFLENBQUE7UUFDM0IsYUFBUSxHQUFXLEVBQUUsQ0FBQTtRQUczQixJQUFJLENBQUMsU0FBUyxHQUFHLFNBQVMsQ0FBQztRQUMzQixJQUFJLENBQUMsVUFBVSxHQUFHLFVBQVUsQ0FBQztRQUM3QixJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksY0FBSSxDQUFFLENBQUUsU0FBUyxDQUFFLEVBQUUsR0FBRyxDQUFFLENBQUM7SUFDakQsQ0FBQztJQUVELGtCQUFrQjtJQUNsQixrQkFBa0I7SUFFbEI7O09BRUc7SUFDSCxtQkFBRyxHQUFIO1FBQ0UsT0FBTyxDQUFDLElBQUksQ0FBRSxhQUFhLENBQUUsQ0FBQztRQUU5QixJQUFJLEtBQUssR0FBRyxJQUFJLENBQUM7UUFDakI7WUFDRSxJQUFJLFdBQVcsR0FBRyxLQUFLLENBQUMsUUFBUSxDQUFDLEdBQUcsRUFBRSxDQUFDO1lBQ3ZDLEtBQUssQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFFLFdBQVcsQ0FBRSxDQUFDO1lBQ3JDLEtBQUssQ0FBQyxZQUFZLENBQUUsV0FBVyxDQUFDLFNBQVMsRUFBRSxDQUFFLEdBQUcsQ0FBQyxDQUFDO1lBRWxELElBQUksU0FBUyxHQUFHLFdBQVcsQ0FBQyxZQUFZ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QyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUssTUFBTSxNQUFHLENBQUUsQ0FBQztRQUNoRCxFQUFFLENBQUMsQ0FBRSxLQUFLLEtBQUssQ0FBQyxDQUFFLENBQUMsQ0FBQSxDQUFDO1lBQ2xCLFFBQVEsQ0FBQyxDQUFDLENBQUMsR0FBRyxRQUFRLENBQUM7UUFDekIsQ0FBQztRQUNELE1BQU0sSUFBTyxRQUFRLENBQUMsQ0FBQyxDQUFDLE1BQUcsQ0FBQztJQUM5QixDQUFDO0lBQ0QsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsQ0FBQztBQUN2QixDQUFDO0FBWGUscUJBQWEsZ0JBVzVCLENBQUE7QUFFRCxtQkFBMkIsU0FBaUIsRUFBRSxRQUFnQjtBQUU5RCxDQUFDO0FBRmUsaUJBQVMsWUFFeEIsQ0FBQTtBQUVEO0FBRUEsQ0FBQztBQUZlLG9CQUFZLGVBRTNCLENBQUEiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiaW1wb3J0IE5vZGUgZnJvbSAnLi9ub2RlJztcclxuaW1wb3J0IEhlYXAgZnJvbSAnLi9oZWFwJztcclxuaW1wb3J0IHsgYmVsb25nVG8gfSBmcm9tICcuL3V0aWwnO1xyXG5cclxuLyoqXHJcbiAqIEEqIOeul+azlVxyXG4gKi9cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQXN0YXJ7XHJcbiAgb3Blbkxpc3Q6IEhlYXBcclxuICBjbG9zZWRMaXN0OiBOb2RlW10gPSBbXVxyXG4gIHN0YXJ0Tm9kZTogTm9kZVxyXG4gIHRhcmdldE5vZGU6IE5vZGVcclxuXHJcbiAgcHJpdmF0ZSBiX2Nsb3NlZExpc3Q6IGJlbG9uZ1RvID0ge31cclxuICBwcml2YXRlIHNvbHV0aW9uOiBOb2RlW10gPSBbXVxyXG5cclxuICBjb25zdHJ1Y3Rvciggc3RhcnROb2RlOiBOb2RlLCB0YXJnZXROb2RlOiBOb2RlICl7XHJcbiAgICB0aGlzLnN0YXJ0Tm9kZSA9IHN0YXJ0Tm9kZTtcclxuICAgIHRoaXMudGFyZ2V0Tm9kZSA9IHRhcmdldE5vZGU7XHJcbiAgICB0aGlzLm9wZW5MaXN0ID0gbmV3IEhlYXAoIFsgc3RhcnROb2RlIF0sIFwiRlwiICk7XHJcbiAgfVxyXG5cclxuICAvLyBwdWJsaWMgZnVuY3Rpb25cclxuICAvLyAtLS0tLS0tLS0tLS0tLS1cclxuXHJcbiAgLyoqXHJcbiAgICog6L+Q6KGMIEEqIOeul+azlVxyXG4gICAqL1xyXG4gIHJ1bigpe1xyXG4gICAgY29uc29sZS50aW1lKCBcIkFTdGFyIFJ1biAhXCIgKTtcclxuXHJcbiAgICBsZXQgYXN0YXIgPSB0aGlzO1xyXG4gICAgd2hpbGUgKCAhTm9kZS5pc1NhbWUoIGFzdGFyLm9wZW5MaXN0LnRvcCgpLCBhc3Rhci50YXJnZXROb2RlICkgKXtcclxuICAgICAgbGV0IGN1cnJlbnROb2RlID0gYXN0YXIub3Blbkxpc3QucG9wKCk7XHJcbiAgICAgIGFzdGFyLmNsb3NlZExpc3QucHVzaCggY3VycmVudE5vZGUgKTtcclxuICAgICAgYXN0YXIuYl9jbG9zZWRMaXN0WyBjdXJyZW50Tm9kZS5nZXRWYWxTdHIoKSBdID0gMTtcclxuXHJcbiAgICAgIGxldCBuZXh0Tm9kZXMgPSBjdXJyZW50Tm9kZS5nZXROZXh0Tm9kZXMoKTtcclxuXHJcbiAgICAgIG5leHROb2Rlcy5mb3JFYWNoKGZ1bmN0aW9uKG5leHROb2RlKXtcclxuICAgICAgICBsZXQgY29zdCA9IGN1cnJlbnROb2RlLmdldEcoKSArIGN1cnJlbnROb2RlLmdldENvc3RUb05leHQoKTtcclxuICAgICAgICBsZXQgaW5kZXggPSAgYXN0YXIub3Blbkxpc3QuZ2V0SXRlbUluZGV4KCBuZXh0Tm9kZSApO1xyXG5cclxuICAgICAgICBpZiAoIGluZGV4ICE9PSB1bmRlZmluZWQgJiYgY29zdCA8IG5leHROb2RlLmdldEcoKSApe1xyXG4gICAgICAgICAgY29uc29sZS5sb2coIFwibmV4dCAxXCIgKTtcclxuICAgICAgICAgIGFzdGFyLm9wZW5MaXN0LnJlbW92ZSggaW5kZXggKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICggYXN0YXIuaXNCZWxvbmdUb0Nsb3NlZCggbmV4dE5vZGUgKSAmJiBjb3N0IDwgbmV4dE5vZGUuZ2V0RygpICl7XHJcbiAgICAgICAgICBjb25zb2xlLmxvZyggXCJuZXh0IDJcIiApO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKCBpbmRleCA9PT0gdW5kZWZpbmVkICYmICFhc3Rhci5pc0JlbG9uZ1RvQ2xvc2VkKCBuZXh0Tm9kZSApICl7XHJcbiAgICAgICAgICBjb25zb2xlLmxvZyggXCJuZXh0IDNcIiApO1xyXG4gICAgICAgICAgbmV4dE5vZGUuc2V0RyggY29zdCApO1xyXG4gICAgICAgICAgbmV4dE5vZGUuc2V0RiggbmV4dE5vZGUuZ2V0RygpICsgbmV4dE5vZGUuZ2V0SCggYXN0YXIudGFyZ2V0Tm9kZSApICk7XHJcbiAgICAgICAgICBhc3Rhci5vcGVuTGlzdC5wdXNoKCBuZXh0Tm9kZSApO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICBjb25zb2xlLnRpbWVFbmQoIFwiQVN0YXIgUnVuICFcIiApO1xyXG5cclxuICAgIGNvbnNvbGUubG9nKCBcIiBhc3RhciAtIFwiLCBhc3RhciApO1xyXG5cclxuICAgIGxldCB0YWlsTm9kZSA9IGFzdGFyLm9wZW5MaXN0LnRvcCgpO1xyXG4gICAgdGhpcy5zb2x1dGlvbiA9IFtdO1xyXG4gICAgd2hpbGUoIHRhaWxOb2RlICl7XHJcbiAgICAgIHRoaXMuc29sdXRpb24ucHVzaCggdGFpbE5vZGUgKTtcclxuICAgICAgdGFpbE5vZGUgPSB0YWlsTm9kZS5wYXJlbnQ7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gdGhpcy5zaG93U29sdXRpb24oKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIOiOt+WPluino+WGs+aWueahiOaVsOe7hFxyXG4gICAqL1xyXG4gIGdldFNvbHV0aW9uKCl7XHJcbiAgICByZXR1cm4gdGhpcy5zb2x1dGlvbjtcclxuICB9XHJcblxyXG4gIC8vIHByaXZhdGUgZnVuY3Rpb25cclxuICAvLyAtLS0tLS0tLS0tLS0tLS1cclxuXHJcbiAgLyoqXHJcbiAgICog5Yik5pat6IqC54K55piv5ZCm5ZyoIENMT1NFRCDkuK1cclxuICAgKi9cclxuICBwcml2YXRlIGlzQmVsb25nVG9DbG9zZWQoIG5vZGU6IE5vZGUgKXtcclxuICAgIGxldCBzdHIgPSBub2RlLmdldFZhbFN0cigpO1xyXG4gICAgcmV0dXJuICEhdGhpcy5iX2Nsb3NlZExpc3Rbc3RyXTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIOaYvuekuuino+WGs+aWueahiOeahOWFt+S9k+atpemqpFxyXG4gICAqL1xyXG4gIHByaXZhdGUgc2hvd1NvbHV0aW9uKCl7XHJcbiAgICBsZXQgbGVuID0gdGhpcy5zb2x1dGlvbi5sZW5ndGgsXHJcbiAgICAgICAgaSA9IGxlbiAtIDEsXHJcbiAgICAgICAgc2NhbGUgPSB0aGlzLnRhcmdldE5vZGUuc2NhbGU7XHJcbiAgICBmb3IgKCA7IGkgPiAtMTsgaSAtLSApe1xyXG4gICAgICBjb25zb2xlLmxvZyggYFN0ZXAgJHsgbGVuIC0gaSB9OiBgICk7XHJcbiAgICAgIGxldCBpdGVtID0gdGhpcy5zb2x1dGlvbltpXS5nZXRWYWxTdHIoKS5zcGxpdCgnLCcpO1xyXG4gICAgICBmb3IgKCBsZXQgaiA9IDA7IGogPCBzY2FsZTsgaiArKyApe1xyXG4gICAgICAgICAgY29uc29sZS5sb2coIGB8ICR7aXRlbVsgaipzY2FsZSBdfSAke2l0ZW1bIGoqc2NhbGUgKyAxIF19ICR7aXRlbVsgaipzY2FsZSArIDIgXX0gfGAgKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxufVxyXG4iLCJpbXBvcnQgTm9kZSBmcm9tIFwiLi9ub2RlXCI7XHJcbmltcG9ydCBBc3RhciBmcm9tICcuL2FzdGFyJztcclxuaW1wb3J0IHsgJGlkLCAkY3JlYXRlRWxlLCAkcmVwbGFjZUNsYXNzLCBESVJFQ1RJT04gfSBmcm9tICcuL3V0aWwnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgR2FtZXtcclxuICBjdXJyZW50Tm9kZTogTm9kZVxyXG4gIHRhcmdldE5vZGU6IE5vZGVcclxuICBzY2FsZTogbnVtYmVyXHJcblxyXG4gIHByaXZhdGUgZ2FtZUNvbnRhaW5lcklkOiBzdHJpbmdcclxuICBwcml2YXRlIGltZ0NvbnRhaW5lcklkOiBzdHJpbmdcclxuICBwcml2YXRlIGFjdGlvbkNvbnRhaW5lcklkOiBzdHJpbmdcclxuICBwcml2YXRlIGdhbWVDb250YWluZXJcclxuICBwcml2YXRlIGltZ0NvbnRhaW5lclxyXG4gIHByaXZhdGUgYWN0aW9uQ29udGFpbmVyXHJcblxyXG4gIGNvbnN0cnVjdG9yKCBnYW1lQ29udGFpbmVySWQ6IHN0cmluZywgc2NhbGU6IG51bWJlciApe1xyXG4gICAgdGhpcy5jdXJyZW50Tm9kZSA9IG5ldyBOb2RlKCBzY2FsZSApO1xyXG4gICAgdGhpcy50YXJnZXROb2RlID0gbmV3IE5vZGUoIHNjYWxlICk7XHJcbiAgICB0aGlzLnNjYWxlID0gc2NhbGU7XHJcblxyXG4gICAgdGhpcy5nYW1lQ29udGFpbmVySWQgPSBnYW1lQ29udGFpbmVySWQ7XHJcbiAgICB0aGlzLmltZ0NvbnRhaW5lcklkID0gXCJpbWFnZVwiO1xyXG4gICAgdGhpcy5hY3Rpb25Db250YWluZXJJZCA9IFwiYWN0aW9uXCI7XHJcblxyXG4gICAgdGhpcy5nYW1lQ29udGFpbmVyID0gJGlkKCB0aGlzLmdhbWVDb250YWluZXJJZCApO1xyXG4gICAgdGhpcy5pbWdDb250YWluZXIgPSAkY3JlYXRlRWxlKCAnZGl2JywgdGhpcy5pbWdDb250YWluZXJJZCApO1xyXG4gICAgdGhpcy5hY3Rpb25Db250YWluZXIgPSAkY3JlYXRlRWxlKCAnZGl2JywgdGhpcy5hY3Rpb25Db250YWluZXJJZCApO1xyXG5cclxuICAgIHRoaXMuaW5pdCgpO1xyXG4gIH1cclxuXHJcbiAgLy8gcHVibGljIGZ1bmN0aW9uXHJcbiAgLy8gLS0tLS0tLS0tLS0tLS0tXHJcblxyXG4gIC8qKlxyXG4gICAqIG1peCDmjInpkq7miafooYzlh73mlbBcclxuICAgKiDmt7flkIjvvIznlLHotbflp4voioLngrnkubHluo/lvpfliLDkuIDkuKrmlrDnmoToioLngrnvvIzlubbmoLnmja7mlrDoioLngrnorr7nva7pobXpnaLkuK3nmoTmmL7npLrnirbmgIFcclxuICAgKi9cclxuICBtaXgoKXtcclxuICAgIHRoaXMuY3VycmVudE5vZGUuc2h1ZmZsZSgpO1xyXG4gICAgdGhpcy5zZXRTdGF0dXNXaXRoTm9kZSggdGhpcy5jdXJyZW50Tm9kZSApO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogc3RhcnQg5oyJ6ZKu5omn6KGM5Ye95pWwXHJcbiAgICog5omn6KGMIEEqIOeul+azlVxyXG4gICAqL1xyXG4gIHN0YXJ0KCl7XHJcbiAgICBsZXQgZ2FtZSA9IHRoaXM7XHJcbiAgICBpZiAoIE5vZGUuaXNTYW1lKCB0aGlzLmN1cnJlbnROb2RlLCB0aGlzLnRhcmdldE5vZGUgKSApe1xyXG4gICAgICB0aGlzLndpbigpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgbGV0IGFzdGFyID0gbmV3IEFzdGFyKCB0aGlzLmN1cnJlbnROb2RlLCB0aGlzLnRhcmdldE5vZGUgKTtcclxuICAgICAgYXN0YXIucnVuKCk7XHJcblxyXG4gICAgICBsZXQgc29sdXRpb24gPSBhc3Rhci5nZXRTb2x1dGlvbigpO1xyXG4gICAgICBpZiAoIHNvbHV0aW9uLmxlbmd0aCApICB7XHJcbiAgICAgICAgbGV0IGxlbiA9IHNvbHV0aW9uLmxlbmd0aCxcclxuICAgICAgICAgICAgaSA9IGxlbiAtIDE7XHJcblxyXG4gICAgICAgIGxldCBpZCA9IHNldEludGVydmFsKCBmdW5jdGlvbigpe1xyXG4gICAgICAgICAgaWYgKCBpID09PSAtMSApe1xyXG4gICAgICAgICAgICBjbGVhckludGVydmFsKCBpZCApO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgZ2FtZS5jdXJyZW50Tm9kZSA9IHNvbHV0aW9uW2ldO1xyXG4gICAgICAgICAgICBnYW1lLnNldFN0YXR1c1dpdGhOb2RlKCBzb2x1dGlvbltpXSApO1xyXG4gICAgICAgICAgICBpLS07XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSwgNTAwICk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIOi1ouW+l+a4uOaIj1xyXG4gICAqL1xyXG4gIHdpbigpe1xyXG4gICAgY29uc29sZS5sb2coIFwid2luISEhXCIgKTtcclxuICB9XHJcblxyXG4gIC8vIHByaXZhdGUgZnVuY3Rpb25cclxuICAvLyAtLS0tLS0tLS0tLS0tLS1cclxuXHJcbiAgLyoqXHJcbiAgICog5Yid5aeL5YyW5Ye95pWwXHJcbiAgICovXHJcbiAgcHJpdmF0ZSBpbml0KCl7XHJcbiAgICB0aGlzLmluaXRJbWFnZSgpO1xyXG4gICAgdGhpcy5pbml0T3BlcmF0aW9uKCk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiDmi7zlm77nmoTlm77niYfmmL7npLrpg6jliIbnmoTliJ3lp4vljJZcclxuICAgKi9cclxuICBwcml2YXRlIGluaXRJbWFnZSgpe1xyXG4gICAgbGV0IGdhbWUgPSB0aGlzO1xyXG4gICAgLy8gZ2FtZS5pbWdDb250YWluZXIuc3R5bGUud2lkdGggPSBgJHsgdGhpcy5zY2FsZSAqIDgyIH1weGA7XHJcbiAgICAvLyDoioLngrnnmoTmlbDnu4TooajnpLrkuK3nmoTmr4/kuIDkuKrmlbDnu4TnmoTpobnlr7nlupTkuIDkuKrmoLzlrZBcclxuICAgIGZvciAoIGxldCBpID0gTWF0aC5wb3coIGdhbWUuc2NhbGUsIDIpIC0gMTsgaSA+IC0xOyBpIC0tICl7XHJcbiAgICAgIGxldCBlbGUgPSAkY3JlYXRlRWxlKCAnZGl2JywgdW5kZWZpbmVkLCBgaXRlbSBpdGVtLSR7aX0gcG9zLSR7aX1gICk7XHJcbiAgICAgIGVsZS5hZGRFdmVudExpc3RlbmVyKCAnY2xpY2snLCBmdW5jdGlvbihlKXsgZ2FtZS5tb3ZlSW1nKGUpIH0gKTtcclxuICAgICAgZWxlLnNldEF0dHJpYnV0ZSggXCJkYXRhLXBvc1wiLCBgJHtpfWAgKTtcclxuICAgICAgaWYgKCBpID09PSAwICl7XHJcbiAgICAgICAgZ2FtZS5pbWdDb250YWluZXIuYXBwZW5kQ2hpbGQoIGVsZSApO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGdhbWUuaW1nQ29udGFpbmVyLmluc2VydEJlZm9yZSggZWxlLCBnYW1lLmltZ0NvbnRhaW5lci5maXJzdENoaWxkICk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIGdhbWUuZ2FtZUNvbnRhaW5lci5hcHBlbmRDaGlsZCggZ2FtZS5pbWdDb250YWluZXIgKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIOaLvOWbvueahOaMiemSruaTjeS9nOmDqOWIhueahOWIneWni+WMllxyXG4gICAqL1xyXG4gIHByaXZhdGUgaW5pdE9wZXJhdGlvbigpe1xyXG4gICAgbGV0IGdhbWUgPSB0aGlzO1xyXG4gICAgW1wiTUlYXCIsIFwiU1RBUlRcIl0uZm9yRWFjaCggZnVuY3Rpb24oaXRlbSwgaW5kZXgsIGFycmF5KXtcclxuICAgICAgbGV0IGVsZSA9ICRjcmVhdGVFbGUoICdidXR0b24nLCB1bmRlZmluZWQsIGBidG4gYnRuLSR7aXRlbS50b0xvd2VyQ2FzZSgpfWAgKTtcclxuICAgICAgZWxlLmlubmVySFRNTCA9IGl0ZW07XHJcbiAgICAgIHN3aXRjaCggaXRlbSApe1xyXG4gICAgICAgIGNhc2UgJ01JWCc6XHJcbiAgICAgICAgICBlbGUuYWRkRXZlbnRMaXN0ZW5lciggJ2NsaWNrJywgZ2FtZS5taXguYmluZCggZ2FtZSApICk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlICdTVEFSVCc6XHJcbiAgICAgICAgICBlbGUuYWRkRXZlbnRMaXN0ZW5lciggJ2NsaWNrJywgZ2FtZS5zdGFydC5iaW5kKCBnYW1lICkgKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICB9XHJcbiAgICAgIGdhbWUuYWN0aW9uQ29udGFpbmVyLmFwcGVuZENoaWxkKCBlbGUgKTtcclxuICAgIH0pO1xyXG4gICAgZ2FtZS5nYW1lQ29udGFpbmVyLmFwcGVuZENoaWxkKCBnYW1lLmFjdGlvbkNvbnRhaW5lciApO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICog5qC55o2u6IqC54K555qE5pWw57uE6KGo56S65p2l5pu05paw6aG16Z2i5Lit55qE5pi+56S654q25oCBXHJcbiAgICovXHJcbiAgcHJpdmF0ZSBzZXRTdGF0dXNXaXRoTm9kZSggbm9kZTogTm9kZSApe1xyXG4gICAgbGV0IGltZ0l0ZW1zID0gdGhpcy5pbWdDb250YWluZXIuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcIml0ZW1cIik7XHJcbiAgICBmb3IgKCBsZXQgaSA9IDAsIGxlbiA9IGltZ0l0ZW1zLmxlbmd0aDsgaSA8IGxlbjsgaSArKyApe1xyXG4gICAgICBpbWdJdGVtc1tpXS5jbGFzc05hbWUgPSAkcmVwbGFjZUNsYXNzKCBpbWdJdGVtc1tpXS5jbGFzc05hbWUsIGBpdGVtLSR7bm9kZS52YWx1ZVtpXX1gLCBgaXRlbWAgKTtcclxuICAgICAgaW1nSXRlbXNbaV0uc2V0QXR0cmlidXRlKCBcImRhdGEtcG9zXCIsIGAke25vZGUudmFsdWVbaV19YCApO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICog5Zu+54mH5Z2X5LiK55qEIGNsaWNrIOS6i+S7tuWkhOeQhuWHveaVsO+8jOeUqOadpeenu+WKqOWbvueJh+Wdl1xyXG4gICAqL1xyXG4gIHByaXZhdGUgbW92ZUltZyhlKXtcclxuICAgIGxldCBpbWdOdW1iZXIgPSBlLnRhcmdldC5nZXRBdHRyaWJ1dGUoXCJkYXRhLXBvc1wiKTtcclxuICAgIGxldCBub25aZXJvRGlyID0gdGhpcy5jdXJyZW50Tm9kZS5nZXROb25aZXJvRGlyZWN0aW9uKCk7XHJcbiAgICBpZiAoIG5vblplcm9EaXJbaW1nTnVtYmVyXSApe1xyXG4gICAgICBsZXQgZGlyZWN0aW9uID0gRElSRUNUSU9OWyBgJHtub25aZXJvRGlyWyBpbWdOdW1iZXIgXX1gIF07XHJcbiAgICAgIHRoaXMuY3VycmVudE5vZGUubW92ZVRvKCBkaXJlY3Rpb24gKTtcclxuICAgICAgdGhpcy5zZXRTdGF0dXNXaXRoTm9kZSggdGhpcy5jdXJyZW50Tm9kZSApO1xyXG4gICAgfVxyXG4gIH1cclxufVxyXG4iLCJpbXBvcnQgTm9kZSBmcm9tICcuL25vZGUnO1xyXG5pbXBvcnQgeyBiZWxvbmdUbyB9IGZyb20gJy4vdXRpbCc7XHJcbi8vIEhlYXAgT24gVG9wXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEhlYXB7XHJcbiAgaGVhcDogTm9kZVtdID0gW11cclxuICBiX2hlYXA6IGJlbG9uZ1RvID0ge31cclxuICBrZXk6IHN0cmluZ1xyXG4gIGNvbnN0cnVjdG9yKCBub2RlTGlzdDogTm9kZVtdLCBrZXk6IHN0cmluZyApe1xyXG4gICAgdGhpcy5rZXkgPSBrZXk7XHJcbiAgICAvLyDnlKjkvp3mrKHmj5LlhaXnmoTmlrnlvI/mnoTpgKDliJ3lp4vnmoTlsI/pobbloIZcclxuICAgIGxldCBpID0gMCxcclxuICAgICAgICBsZW4gPSBub2RlTGlzdC5sZW5ndGg7XHJcbiAgICBmb3IgKCA7IGkgPCBsZW47IGkgKysgKXtcclxuICAgICAgdGhpcy5wdXNoKCBub2RlTGlzdFtpXSApO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLy8gcHVibGljIGZ1bmN0aW9uXHJcbiAgLy8gLS0tLS0tLS0tLS0tLS0tXHJcblxyXG4gIC8qKlxyXG4gICAqIOiOt+WPluWghuS4reS4i+agh+S4uiBpbmRleCDnmoTlgLxcclxuICAgKi9cclxuICBnZXQoIGluZGV4OiBudW1iZXIgKXtcclxuICAgIGlmICggaW5kZXggPj0gMCAmJiBpbmRleCA8IHRoaXMuaGVhcC5sZW5ndGggKXtcclxuICAgICAgcmV0dXJuIHRoaXMuaGVhcFsgaW5kZXggXVsgdGhpcy5rZXkgXTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIOWQkeWghuS4reaPkuWFpeS4gOS4quaWsOeahOWFg+e0oOW5tuiwg+aVtOWghlxyXG4gICAqIOaWsOWFg+e0oOS7juaVsOe7hOWwvumDqOaPkuWFpe+8jOeEtuWQjuWvueaWsOWFg+e0oOaJp+ihjOS4iua1ruiwg+aVtFxyXG4gICAqL1xyXG4gIHB1c2goIG5vZGU6IE5vZGUgKXtcclxuICAgIHRoaXMuaGVhcC5wdXNoKCBub2RlICk7XHJcbiAgICB0aGlzLnNldEJIZWFwKCB0aGlzLmhlYXAubGVuZ3RoIC0gMSApO1xyXG4gICAgdGhpcy5nb1VwKCB0aGlzLmhlYXAubGVuZ3RoIC0gMSApO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICog5Yig6Zmk5bm26L+U5Zue5aCG6aG25YWD57Sg5bm26LCD5pW05aCGXHJcbiAgICog5YWI5bCG5aCG6aG25YWD57Sg5LiO5pWw57uE5pyr5bC+5YWD57Sg5LqS5o2i77yM54S25ZCO5by55Ye65pWw57uE5pyr5bC+55qE5YWD57Sg77yM5pyA5ZCO5a+55aCG6aG25YWD57Sg5omn6KGM5LiL5rKJ5pON5L2cXHJcbiAgICovXHJcbiAgcG9wKCl7XHJcbiAgICBpZiAoIHRoaXMuaXNFbXB0eSgpICkgcmV0dXJuO1xyXG4gICAgbGV0IHJlc3VsdDtcclxuICAgIHRoaXMuc3dhcCggMCwgdGhpcy5oZWFwLmxlbmd0aCAtIDEgKTtcclxuICAgIHJlc3VsdCA9IHRoaXMuaGVhcC5wb3AoKTtcclxuICAgIHRoaXMucmVtb3ZlQkhlYXAoIHJlc3VsdC5nZXRWYWxTdHIoKSApO1xyXG4gICAgIXRoaXMuaXNFbXB0eSgpICYmIHRoaXMuZ29Eb3duKDApO1xyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIOenu+mZpOWghuS4reS4i+agh+S4uiBpbmRleCDnmoTlhYPntKBcclxuICAgKiDlsIbpnIDnp7vpmaTnmoTpobnkuI7loIbpobbkupLmjaLvvIznhLblkI7lvLnlh7rloIbpobbvvIzmnIDlkI7lr7nkupLmjaLpobnvvIjljp/loIbpobbvvInmiafooYzkuIrmta7mk43kvZxcclxuICAgKi9cclxuICByZW1vdmUoIGluZGV4OiBudW1iZXIgKXtcclxuICAgIGlmKCBpbmRleCA8IDAgfHwgaW5kZXggPj0gdGhpcy5oZWFwLmxlbmd0aCApIHJldHVybjtcclxuICAgIHRoaXMuc3dhcCggMCwgaW5kZXggKTtcclxuICAgIHRoaXMucG9wKCk7XHJcbiAgICB0aGlzLmdvVXAoIGluZGV4ICk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiDojrflj5bloIbpobblhYPntKBcclxuICAgKi9cclxuICB0b3AoKXtcclxuICAgIHJldHVybiB0aGlzLmhlYXAubGVuZ3RoICYmIHRoaXMuaGVhcFswXTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIOWIpOaWreWghuaYr+WQpuS4uuepulxyXG4gICAqL1xyXG4gIGlzRW1wdHkoKXtcclxuICAgIHJldHVybiAhdGhpcy5oZWFwLmxlbmd0aDtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIOWIpOaWreWghuS4reaYr+WQpuacieWFg+e0oCBub2RlXHJcbiAgICovXHJcbiAgZ2V0SXRlbUluZGV4KCBub2RlOiBOb2RlICl7XHJcbiAgICByZXR1cm4gdGhpcy5iX2hlYXBbIG5vZGUuZ2V0VmFsU3RyKCkgXTtcclxuICB9XHJcblxyXG4gIC8vIHByaXZhdGUgZnVuY3Rpb25cclxuICAvLyAtLS0tLS0tLS0tLS0tLS1cclxuXHJcbiAgLyoqXHJcbiAgICog6L+U5Zue5aCG5Lit5LiL5qCH5Li6IGluZGV4IOeahOWFg+e0oFxyXG4gICAqL1xyXG4gIHByaXZhdGUgZ2V0VmFsdWUoIGluZGV4OiBudW1iZXIgKXtcclxuICAgIGlmKCBpbmRleCA8IDAgfHwgaW5kZXggPj0gdGhpcy5oZWFwLmxlbmd0aCApIHJldHVybjtcclxuICAgIHJldHVybiB0aGlzLmhlYXBbaW5kZXhdW3RoaXMua2V5XTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIOWghuS4reS4i+agh+S4uiBpbmRleCDnmoTlhYPntKDnmoTkuIrmta7mk43kvZxcclxuICAgKi9cclxuICBwcml2YXRlIGdvVXAoaW5kZXg6IG51bWJlcil7XHJcbiAgICBsZXQgdmFsdWUgPSB0aGlzLmdldFZhbHVlKGluZGV4KSxcclxuICAgICAgICBwYXJlbnQgPSB0aGlzLmdldFBhcmVudEluZGV4KGluZGV4KTtcclxuXHJcbiAgICBpZiAoIHBhcmVudCA9PT0gdW5kZWZpbmVkICkgcmV0dXJuO1xyXG5cclxuICAgIGlmICggdGhpcy5nZXRWYWx1ZSggcGFyZW50ICkgPiB0aGlzLmdldFZhbHVlKCBpbmRleCApICl7XHJcbiAgICAgIHRoaXMuc3dhcCggaW5kZXgsIHBhcmVudCApO1xyXG4gICAgICB0aGlzLmdvVXAoIHBhcmVudCApO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICog5aCG5Lit5LiL5qCH5Li6IGluZGV4IOeahOWFg+e0oOeahOS4i+ayieaTjeS9nFxyXG4gICAqL1xyXG4gIHByaXZhdGUgZ29Eb3duKGluZGV4OiBudW1iZXIpe1xyXG4gICAgbGV0IHZhbHVlID0gdGhpcy5nZXRWYWx1ZShpbmRleCksXHJcbiAgICAgICAgW2xlZnQsIHJpZ2h0XSA9IHRoaXMuZ2V0Q2hpbGRJbmRleChpbmRleCksXHJcbiAgICAgICAgc3dhcEluZGV4ID0gbGVmdDtcclxuXHJcbiAgICAvLyDlhYPntKDmmK/lj7blrZDoioLngrnvvIzmsqHmnInlrZDlhYPntKBcclxuICAgIGlmICggbGVmdCA9PT0gbnVsbCApIHJldHVybjtcclxuXHJcbiAgICAvLyDoi6XlhYPntKDmnInkuKTkuKrlrZDlhYPntKDvvIzorr7nva4gc3dhcEluZGV4IOS4uui+g+Wwj+eahOmCo+S4quWtkOWFg+e0oOeahOS4i+agh1xyXG4gICAgLy8g6Iul5YWD57Sg5Y+q5pyJ5bem5YS/5a2Q77yMc3dhcEluZGV4IOW3sue7j+iiq+WIneWni+WMluS4uiBsZWZ0IOeahOWAvOS6hlxyXG4gICAgaWYgKCByaWdodCApe1xyXG4gICAgICBzd2FwSW5kZXggPSB0aGlzLmdldFZhbHVlKGxlZnQpIDwgdGhpcy5nZXRWYWx1ZShyaWdodCkgPyBsZWZ0IDogcmlnaHQ7XHJcbiAgICB9XHJcblxyXG4gICAgLy8g5q+U6L6D54i25YWD57Sg5ZKM6L6D5bCP55qE6YKj5Liq5a2Q5YWD57Sg55qE5YC877yM6Iul54i25YWD57Sg55qE5YC86L6D5aSn77yM5YiZ572u5o2i54i25YWD57Sg5ZKM6L6D5bCP55qE5a2Q5YWD57SgXHJcbiAgICAvLyDnhLblkI7lnKjmlrDnmoTnva7mjaLnmoTkvY3nva7lpITnu6fnu63miafooYzkuIvmsonmk43kvZxcclxuICAgIGlmICggdGhpcy5nZXRWYWx1ZShzd2FwSW5kZXgpIDwgdmFsdWUgKSB7XHJcbiAgICAgIHRoaXMuc3dhcCggaW5kZXgsIHN3YXBJbmRleCApO1xyXG4gICAgICB0aGlzLmdvRG93biggc3dhcEluZGV4ICk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiDojrflj5bkuIvmoIfkuLogaW5kZXgg55qE5YWD57Sg5Zyo5aCG5Lit55qE54i25YWD57SgXHJcbiAgICovXHJcbiAgcHJpdmF0ZSBnZXRQYXJlbnRJbmRleCggaW5kZXg6IG51bWJlciApe1xyXG4gICAgaWYgKCBpbmRleCA8IDAgfHwgaW5kZXggPj0gdGhpcy5oZWFwLmxlbmd0aCApIHJldHVybjtcclxuICAgIGlmICggaW5kZXggPT09IDAgKSByZXR1cm4gMDtcclxuICAgIHJldHVybiBNYXRoLmZsb29yKCAoaW5kZXgtMSkvMiApO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICog6I635Y+W5LiL5qCH5Li6IGluZGV4IOeahOWFg+e0oOWcqOWghuS4reeahOWtkOWFg+e0oO+8jOe8uuWkseeahOWtkOWFg+e0oOeUqCBudWxsIOS7o+abv1xyXG4gICAqL1xyXG4gIHByaXZhdGUgZ2V0Q2hpbGRJbmRleCggaW5kZXg6IG51bWJlciApe1xyXG4gICAgbGV0IGxlZnQgPSAyKmluZGV4ICsgMSxcclxuICAgICAgICByaWdodCA9IDIqaW5kZXggKyAyLFxyXG4gICAgICAgIGxlbmd0aCA9IHRoaXMuaGVhcC5sZW5ndGg7XHJcblxyXG4gICAgaWYgKCByaWdodCA8PSBsZW5ndGggLSAxICl7XHJcbiAgICAgIHJldHVybiBbIGxlZnQsIHJpZ2h0IF07XHJcbiAgICB9IGVsc2UgaWYgKCBsZWZ0ID09PSBsZW5ndGggLSAxICkge1xyXG4gICAgICByZXR1cm4gWyBsZWZ0LCBudWxsIF07XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICByZXR1cm4gWyBudWxsLCBudWxsIF07XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiDkuqTmjaLloIbkuK3kuIvmoIfliIbliKvkuLogaW5kZXgxIOWSjCBpbmRleDIg55qE5Lik5Liq5YWD57SgXHJcbiAgICovXHJcbiAgcHJpdmF0ZSBzd2FwKCBpbmRleDE6IG51bWJlciwgaW5kZXgyOiBudW1iZXIgKXtcclxuICAgIGxldCB0bXAgPSB0aGlzLmhlYXBbaW5kZXgxXTtcclxuICAgIHRoaXMuaGVhcFtpbmRleDFdID0gdGhpcy5oZWFwW2luZGV4Ml07XHJcbiAgICB0aGlzLmhlYXBbaW5kZXgyXSA9IHRtcDtcclxuXHJcbiAgICB0aGlzLnNldEJIZWFwKCBpbmRleDEgKTtcclxuICAgIHRoaXMuc2V0QkhlYXAoIGluZGV4MiApO1xyXG4gIH1cclxuICBwcml2YXRlIHNldEJIZWFwKCBpbmRleDogbnVtYmVyICl7XHJcbiAgICB0aGlzLmJfaGVhcFsgdGhpcy5oZWFwWyBpbmRleCBdLmdldFZhbFN0cigpIF0gPSBpbmRleDtcclxuICB9XHJcbiAgcHJpdmF0ZSByZW1vdmVCSGVhcCggc3RyOiBzdHJpbmcgKXtcclxuICAgIGRlbGV0ZSB0aGlzLmJfaGVhcFsgc3RyIF07XHJcbiAgfVxyXG59XHJcbiIsImltcG9ydCBHYW1lIGZyb20gXCIuL2dhbWVcIjtcclxubGV0IGdhbWUgPSBuZXcgR2FtZSggXCJjb250YWluZXJcIiwgMyApO1xyXG5cclxuY29uc29sZS5sb2coIGdhbWUgKTtcclxuY29uc29sZS5sb2coIFwiLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXCIgKTtcclxuXHJcbi8vIGltcG9ydCBtaW5IZWFwIGZyb20gJy4vbWluLWhlYXAnO1xyXG4vL1xyXG4vLyBjb25zb2xlLmxvZyggXCItLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cIiApO1xyXG4vL1xyXG4vLyBsZXQgaGVhcCA9IG5ldyBtaW5IZWFwKCBbIDMsIDUsIDQsIDEsIDIsIDE5LCAxOCwgMjIsIDEyLCA3XSApO1xyXG4vL1xyXG4vLyBjb25zb2xlLmxvZyggaGVhcC5oZWFwICk7XHJcbi8vXHJcbi8vIC8vIGZvciAoIGxldCBpID0gMCwgbGVuID0gaGVhcC5oZWFwLmxlbmd0aDsgaSA8IGxlbjsgaSArKyApe1xyXG4vLyAvLyAgIGNvbnNvbGUubG9nKCBoZWFwLnBvcCgpICk7XHJcbi8vIC8vICAgY29uc29sZS5sb2coIGhlYXAuaGVhcCApO1xyXG4vLyAvLyB9XHJcbi8vIC8vXHJcbi8vIC8vIGNvbnNvbGUubG9nKCBoZWFwLnBvcCgpICk7XHJcbi8vIC8vIGNvbnNvbGUubG9nKCBoZWFwLmhlYXAgKTtcclxuIiwiaW1wb3J0IHsgRElSRUNUSU9OIH0gZnJvbSAnLi91dGlsJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE5vZGV7XHJcbiAgdmFsdWU6IG51bWJlcltdXHJcbiAgemVyb0luZGV4OiBudW1iZXJcclxuICBzY2FsZTogbnVtYmVyXHJcbiAgcGFyZW50OiBOb2RlXHJcbiAgRjogbnVtYmVyID0gMFxyXG4gIEc6IG51bWJlciA9IDBcclxuICBjb25zdHJ1Y3Rvciggc2NhbGU6IG51bWJlciwgaW5pdEFycj86IG51bWJlcltdICkge1xyXG4gICAgdGhpcy5zY2FsZSA9IHNjYWxlO1xyXG4gICAgdGhpcy52YWx1ZSA9IGluaXRBcnIgPyBpbml0QXJyIDogdGhpcy5pbml0Tm9kZVZhbHVlQnlTY2FsZSggc2NhbGUgKTtcclxuICAgIHRoaXMuemVyb0luZGV4ID0gTWF0aC5wb3coc2NhbGUsIDIpIC0gMTtcclxuXHJcbiAgICAvLyB0aGlzLnBhcmVudCA9IG5ldyBOb2RlKHRoaXMuc2NhbGUpO1xyXG4gIH1cclxuXHJcbiAgLy8gcHVibGljIGZ1bmN0aW9uXHJcbiAgLy8gLS0tLS0tLS0tLS0tLS0tXHJcblxyXG4gIC8qKlxyXG4gICAqIOiOt+WPluiKgueCueeahOWAvO+8jOWwhuiKgueCueeahOaVsOe7hOihqOekuui9rOaNouaIkOWtl+espuS4suihqOekuuW5tui/lOWbnlxyXG4gICAqL1xyXG4gIGdldFZhbFN0cigpe1xyXG4gICAgcmV0dXJuIHRoaXMudmFsdWUudG9TdHJpbmcoKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIOiKgueCueeahOS5seW6j+eul+azlVxyXG4gICAqIOmaj+acuuaMh+WumuS4gOS4quaWueWQke+8jOS7pOiKgueCueWQkeivpeaWueWQkeenu+WKqO+8jOmHjeWkjeS4iui/sOi/h+eoi+iLpeW5suasoei+vuWIsOS5seW6j+eahOebrueahFxyXG4gICAqL1xyXG4gIHNodWZmbGUoKXtcclxuICAgIGZvciggbGV0IGkgPSAwOyBpIDwgNTAwMDsgaSArKyApe1xyXG4gICAgICBsZXQgZGlyZWN0aW9uID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogNCArIDEpO1xyXG4gICAgICB0aGlzLm1vdmVUbyggZGlyZWN0aW9uICk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiDlvZPliY3oioLngrnlkJHmlrnlkJEgZGlyZWN0aW9uIOenu+WKqOS4gOasoVxyXG4gICAqIOWFtuWunuaYr+iKgueCueeahOaVsOe7hOihqOekuuS4reeahOaVsOWtlyAwIOWQkeaWueWQkSBkaXJlY3Rpb24g56e75Yqo5LiA5qyhXHJcbiAgICovXHJcbiAgbW92ZVRvKCBkaXJlY3Rpb246IG51bWJlciApe1xyXG4gICAgaWYgKCAhdGhpcy5jYW5Nb3ZlVG8oIGRpcmVjdGlvbiApICkgcmV0dXJuO1xyXG4gICAgbGV0IHRhcmdldEluZGV4ID0gdGhpcy5nZXRUYXJnZXRJbmRleCggZGlyZWN0aW9uICk7XHJcblxyXG4gICAgdGhpcy52YWx1ZVsgdGhpcy56ZXJvSW5kZXggXSA9IHRoaXMudmFsdWVbIHRhcmdldEluZGV4IF07XHJcbiAgICB0aGlzLnZhbHVlWyB0YXJnZXRJbmRleCBdID0gMDtcclxuICAgIHRoaXMuemVyb0luZGV4ID0gdGFyZ2V0SW5kZXg7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiDojrflj5blvZPliY3oioLngrnnmoTlj6/og73np7vliqjmlrnlkJHvvIjnlKggMCDkvY3nmoTnp7vliqjov5vooYzooajnpLrvvIlcclxuICAgKi9cclxuICBnZXRaZXJvRGlyZWN0aW9uKCl7XHJcbiAgICBsZXQgbm9kZSA9IHRoaXM7XHJcbiAgICBsZXQgRGlyZWN0aW9uID0ge307XHJcbiAgICBbIFwiVVBcIiwgXCJSSUdIVFwiLCBcIkRPV05cIiwgXCJMRUZUXCIgXS5mb3JFYWNoKCBmdW5jdGlvbihkaXIpe1xyXG4gICAgICBsZXQgX2RpciA9IERJUkVDVElPTltkaXJdO1xyXG4gICAgICBpZiAoIG5vZGUuY2FuTW92ZVRvKCBfZGlyICkgKXtcclxuICAgICAgICBsZXQgdGFyZ2V0SW5kZXggPSBub2RlLmdldFRhcmdldEluZGV4KCBfZGlyICk7XHJcbiAgICAgICAgRGlyZWN0aW9uWyBkaXIgXSA9IGAke25vZGUudmFsdWVbIHRhcmdldEluZGV4IF19YDtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgICByZXR1cm4gRGlyZWN0aW9uO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICog5bCG5b2T5YmN6IqC54K555qE5Y+v6IO956e75Yqo5pa55ZCR55Sx55SoIDAg5L2N55qE56e75Yqo5p2l6KGo56S66L2s5o2i5oiQ55SoIDAg5L2N6YK75o6l55qE6Z2eIDAg5pWw5a2X55qE56e75Yqo5p2l6L+b6KGM6KGo56S6XHJcbiAgICovXHJcbiAgZ2V0Tm9uWmVyb0RpcmVjdGlvbigpe1xyXG4gICAgbGV0IERpcmVjdGlvbiA9IHt9O1xyXG4gICAgbGV0IHplcm9EaXIgPSB0aGlzLmdldFplcm9EaXJlY3Rpb24oKTtcclxuICAgIGZvciAoIGxldCB2YWwgaW4gemVyb0RpciApe1xyXG4gICAgICAvLyBsZXQgX3ZhbDtcclxuICAgICAgLy8gc3dpdGNoKCB2YWwgKXtcclxuICAgICAgLy8gICBjYXNlIFwiVVBcIjpcclxuICAgICAgLy8gICAgIF92YWwgPSBcIkRPV05cIjtcclxuICAgICAgLy8gICAgIGJyZWFrO1xyXG4gICAgICAvLyAgIGNhc2UgXCJSSUdIVFwiOlxyXG4gICAgICAvLyAgICAgX3ZhbCA9IFwiTEVGVFwiO1xyXG4gICAgICAvLyAgICAgYnJlYWs7XHJcbiAgICAgIC8vICAgY2FzZSBcIkRPV05cIjpcclxuICAgICAgLy8gICAgIF92YWwgPSBcIlVQXCI7XHJcbiAgICAgIC8vICAgICBicmVhaztcclxuICAgICAgLy8gICBjYXNlIFwiTEVGVFwiOlxyXG4gICAgICAvLyAgICAgX3ZhbCA9IFwiUklHSFRcIjtcclxuICAgICAgLy8gICAgIGJyZWFrO1xyXG4gICAgICAvLyB9XHJcbiAgICAgIC8vIERpcmVjdGlvblsgemVyb0RpclsgdmFsIF0gXSA9IF92YWw7XHJcblxyXG4gICAgICBEaXJlY3Rpb25bIHplcm9EaXJbIHZhbCBdIF0gPSB2YWw7XHJcbiAgICB9XHJcbiAgICBjb25zb2xlLmxvZyggRGlyZWN0aW9uICk7XHJcbiAgICByZXR1cm4gRGlyZWN0aW9uO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICog6I635Y+W5b2T5YmN6IqC54K55Zyo5Y+v56e75Yqo5pa55ZCR5LiK55qE5a2Q6IqC54K55pWw57uEXHJcbiAgICovXHJcbiAgZ2V0TmV4dE5vZGVzKCl7XHJcbiAgICBsZXQgbm9kZSA9IHRoaXM7XHJcbiAgICBsZXQgbmV4dE5vZGVzOiBOb2RlW10gPSBbXTtcclxuICAgIFsgRElSRUNUSU9OLlVQLCBESVJFQ1RJT04uUklHSFQsIERJUkVDVElPTi5ET1dOLCBESVJFQ1RJT04uTEVGVCBdLmZvckVhY2goIGZ1bmN0aW9uKGRpcmVjdGlvbil7XHJcbiAgICAgIGlmICggbm9kZS5jYW5Nb3ZlVG8oIGRpcmVjdGlvbiApICl7XHJcbiAgICAgICAgbGV0IG5ld05vZGUgPSBOb2RlLm5vZGVDbG9uZSggbm9kZSApO1xyXG4gICAgICAgIG5ld05vZGUucGFyZW50ID0gbm9kZTtcclxuICAgICAgICBuZXdOb2RlLm1vdmVUbyhkaXJlY3Rpb24pO1xyXG4gICAgICAgIG5leHROb2Rlcy5wdXNoKCBuZXdOb2RlICk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gICAgcmV0dXJuIG5leHROb2RlcztcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIOWIpOaWreW9k+WJjeiKgueCue+8iOiKgueCueS4reeahCAwIOS9je+8ieaYr+WQpuWPr+S7peayvyBkaXJlY3Rpb24g5pa55ZCR56e75YqoXHJcbiAgICovXHJcbiAgY2FuTW92ZVRvKCBkaXJlY3Rpb246IG51bWJlciApe1xyXG4gICAgbGV0IHJvdyA9IE1hdGguZmxvb3IoIHRoaXMuemVyb0luZGV4IC8gdGhpcy5zY2FsZSApO1xyXG4gICAgbGV0IGNvbCA9IHRoaXMuemVyb0luZGV4ICUgdGhpcy5zY2FsZTtcclxuXHJcbiAgICBzd2l0Y2goIGRpcmVjdGlvbiApe1xyXG4gICAgICBjYXNlIERJUkVDVElPTi5VUDpcclxuICAgICAgICByZXR1cm4gcm93ICE9PSAwO1xyXG4gICAgICBjYXNlIERJUkVDVElPTi5SSUdIVDpcclxuICAgICAgICByZXR1cm4gY29sICE9PSB0aGlzLnNjYWxlIC0gMTtcclxuICAgICAgY2FzZSBESVJFQ1RJT04uRE9XTjpcclxuICAgICAgICByZXR1cm4gcm93ICE9PSB0aGlzLnNjYWxlIC0gMTtcclxuICAgICAgY2FzZSBESVJFQ1RJT04uTEVGVDpcclxuICAgICAgICByZXR1cm4gY29sICE9PSAwO1xyXG4gICAgICBkZWZhdWx0OlxyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIOiOt+WPluS7juW9k+WJjeiKgueCuei1sOWIsOS4i+S4gOS4quiKgueCueeahOS7o+S7t1xyXG4gICAqL1xyXG4gIGdldENvc3RUb05leHQoKXtcclxuICAgIHJldHVybiAxO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICog6K6+572u6IqC54K555qEIEYg5YC877yM5aCG5Lya5qC55o2u6L+Z5Liq5YC86L+b6KGM5o6S5bqPXHJcbiAgICovXHJcbiAgc2V0RiggdmFsdWU6IG51bWJlciApe1xyXG4gICAgdGhpcy5GID0gdmFsdWU7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiDojrflj5boioLngrnnmoQgRyDlgLxcclxuICAgKi9cclxuICBnZXRHKCl7XHJcbiAgICByZXR1cm4gdGhpcy5HO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICog6K6+572u6IqC54K555qEIEcg5YC8XHJcbiAgICovXHJcbiAgc2V0RyggdmFsdWU6IG51bWJlciApe1xyXG4gICAgdGhpcy5HID0gdmFsdWU7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiDojrflj5boioLngrnnmoQgSCDlgLxcclxuICAgKi9cclxuICBnZXRIKCB0YXJnZXROb2RlOiBOb2RlICl7XHJcbiAgICBsZXQgaSA9IDAsXHJcbiAgICAgICAgbGVuID0gdGhpcy52YWx1ZS5sZW5ndGgsXHJcbiAgICAgICAgbWFuaGF0dGVuID0gMCxcclxuICAgICAgICBkaWZmID0gMDtcclxuXHJcbiAgICBmb3IgKCA7IGkgPCBsZW47IGkgKysgKXtcclxuICAgICAgaWYgKCB0aGlzLnZhbHVlW2ldICE9PSBpICsgMSApIGRpZmYgKys7XHJcblxyXG4gICAgICBsZXQgdiA9IHRoaXMudmFsdWVbaV07XHJcbiAgICAgIGlmKCB2ICE9PSAwICl7XHJcbiAgICAgICAgLy8gbm93IGluXHJcbiAgICAgICAgbGV0IHJvdyA9IE1hdGguZmxvb3IoIGkvdGhpcy5zY2FsZSApO1xyXG4gICAgICAgIGxldCBjb2wgPSBpJXRoaXMuc2NhbGU7XHJcbiAgICAgICAgLy8gc2hvdWxkIGluXHJcbiAgICAgICAgbGV0IF9yb3cgPSBNYXRoLmZsb29yKCB2L3RoaXMuc2NhbGUgKTtcclxuICAgICAgICBsZXQgX2NvbCA9IHYldGhpcy5zY2FsZTtcclxuXHJcbiAgICAgICAgbWFuaGF0dGVuICs9IE1hdGguYWJzKCByb3cgLSBfcm93ICkgKyBNYXRoLmFicyggY29sIC0gX2NvbCApO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIDEqbWFuaGF0dGVuICsgMTAwKmRpZmY7XHJcbiAgfVxyXG5cclxuICAvLyBwcml2YXRlIGZ1bmN0aW9uXHJcbiAgLy8gLS0tLS0tLS0tLS0tLS0tLVxyXG5cclxuICAvKipcclxuICAgKiDmoLnmja7nu7TluqYgc2NhbGUg5p6E6YCg6IqC54K555qE5Yid5aeL6KGo56S65pWw57uEXHJcbiAgICovXHJcbiAgcHJpdmF0ZSBpbml0Tm9kZVZhbHVlQnlTY2FsZSggc2NhbGU6IG51bWJlciApe1xyXG4gICAgbGV0IHZhbCA9IFtdO1xyXG4gICAgZm9yICggbGV0IGkgPSAxOyBpIDwgTWF0aC5wb3coc2NhbGUsIDIpOyBpICsrICl7XHJcbiAgICAgIHZhbC5wdXNoKCBpICk7XHJcbiAgICB9XHJcbiAgICB2YWwucHVzaCggMCApO1xyXG4gICAgcmV0dXJuIHZhbDtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIOiOt+WPluW9k+WJjeiKgueCueS4reWkhOS6jiAwIOS9jeeahOaWueWQkSBkaXJlY3Rpb24g5aSE55qE6YK75o6l5pWw5a2X55qE5LiL5qCHXHJcbiAgICovXHJcbiAgcHJpdmF0ZSBnZXRUYXJnZXRJbmRleCggZGlyZWN0aW9uOiBudW1iZXIgKXtcclxuICAgIGlmICggIXRoaXMuY2FuTW92ZVRvKCBkaXJlY3Rpb24gKSApIHJldHVybjtcclxuICAgIGxldCB0YXJnZXRJbmRleDtcclxuICAgIHN3aXRjaCggZGlyZWN0aW9uICl7XHJcbiAgICAgIGNhc2UgRElSRUNUSU9OLlVQOlxyXG4gICAgICAgIHRhcmdldEluZGV4ID0gdGhpcy56ZXJvSW5kZXggLSB0aGlzLnNjYWxlO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICBjYXNlIERJUkVDVElPTi5SSUdIVDpcclxuICAgICAgICB0YXJnZXRJbmRleCA9IHRoaXMuemVyb0luZGV4ICsgMTtcclxuICAgICAgICBicmVhaztcclxuICAgICAgY2FzZSBESVJFQ1RJT04uRE9XTjpcclxuICAgICAgICB0YXJnZXRJbmRleCA9IHRoaXMuemVyb0luZGV4ICsgdGhpcy5zY2FsZTtcclxuICAgICAgICBicmVhaztcclxuICAgICAgY2FzZSBESVJFQ1RJT04uTEVGVDpcclxuICAgICAgICB0YXJnZXRJbmRleCA9IHRoaXMuemVyb0luZGV4IC0gMTtcclxuICAgICAgICBicmVhaztcclxuICAgICAgZGVmYXVsdDpcclxuICAgICAgICB0YXJnZXRJbmRleCA9IHRoaXMuemVyb0luZGV4O1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHRhcmdldEluZGV4O1xyXG4gIH1cclxuXHJcbiAgLy8gc3RhdGljIGZ1bmN0aW9uXHJcbiAgLy8gLS0tLS0tLS0tLS0tLS0tXHJcblxyXG4gIC8qKlxyXG4gICAqIOWIpOaWreS4pOS4quiKgueCueaYr+WQpuebuOetiVxyXG4gICAqIOmAmui/h+WwhuiKgueCueeahOaVsOe7hOihqOekuui9rOaNouaIkOWtl+espuS4suadpei/m+ihjOavlOi+g1xyXG4gICAqL1xyXG4gIHN0YXRpYyBpc1NhbWUoIGN1cnJlbnROb2RlOiBOb2RlLCB0YXJnZXROb2RlOiBOb2RlICl7XHJcbiAgICByZXR1cm4gY3VycmVudE5vZGUuZ2V0VmFsU3RyKCkgPT09IHRhcmdldE5vZGUuZ2V0VmFsU3RyKCk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiDln7rkuo4gbm9kZSDlpI3liLbkuIDkuKrmlrDnmoToioLngrlcclxuICAgKi9cclxuICBzdGF0aWMgbm9kZUNsb25lKCBub2RlOiBOb2RlICl7XHJcbiAgICBsZXQgbmV3Tm9kZSA9IG5ldyBOb2RlKCBub2RlLnNjYWxlICk7XHJcbiAgICBuZXdOb2RlLnZhbHVlID0gbm9kZS52YWx1ZS5zbGljZSgwKTtcclxuICAgIG5ld05vZGUuemVyb0luZGV4ID0gbm9kZS56ZXJvSW5kZXg7XHJcbiAgICByZXR1cm4gbmV3Tm9kZTtcclxuICB9XHJcbn1cclxuIiwiZXhwb3J0IGVudW0gRElSRUNUSU9OICB7IFVQID0gMSwgUklHSFQsIERPV04sIExFRlQgfVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBiZWxvbmdUb3tcclxuICAgIFtwcm9wTmFtZTogc3RyaW5nXTogbnVtYmVyO1xyXG59O1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uICRpZChlbGVJZDogc3RyaW5nKXtcclxuICByZXR1cm4gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoIGVsZUlkICk7XHJcbn07XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gJGNyZWF0ZUVsZSggdGFnTmFtZTogc3RyaW5nLCBpZD86IHN0cmluZywgY2xhc3NOYW1lPzogc3RyaW5nICl7XHJcbiAgbGV0IGVsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoIHRhZ05hbWUgKTtcclxuICBpZiggaWQgKSBlbGUuaWQgPSBpZDtcclxuICBpZiggY2xhc3NOYW1lICkgZWxlLmNsYXNzTmFtZSA9IGNsYXNzTmFtZTtcclxuICByZXR1cm4gZWxlO1xyXG59O1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uICRyZXBsYWNlQ2xhc3MoIGNsYXNzTmFtZTogc3RyaW5nLCBuZXdDbGFzczogc3RyaW5nLCBwcmVmaXg6IHN0cmluZyAgKXtcclxuICBsZXQgcmVzdWx0ID0gXCJcIjtcclxuICBsZXQgY2xhc3NBcnIgPSBjbGFzc05hbWUuc3BsaXQoIFwiIFwiICk7XHJcbiAgZm9yICggbGV0IGkgPSAwLCBsZW4gPSBjbGFzc0Fyci5sZW5ndGg7IGkgPCBsZW47IGkgKysgKXtcclxuICAgIGxldCBpbmRleCA9IGNsYXNzQXJyW2ldLmluZGV4T2YoIGAke3ByZWZpeH0tYCApO1xyXG4gICAgaWYgKCBpbmRleCAhPT0gLTEgKXtcclxuICAgICAgY2xhc3NBcnJbaV0gPSBuZXdDbGFzcztcclxuICAgIH1cclxuICAgIHJlc3VsdCArPSBgJHtjbGFzc0FycltpXX0gYDtcclxuICB9XHJcbiAgcmV0dXJuIHJlc3VsdC50cmltKCk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiAkYWRkQ2xhc3MoIGNsYXNzTmFtZTogc3RyaW5nLCBuZXdDbGFzczogc3RyaW5nICl7XHJcblxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gJHJlbW92ZUNsYXNzKCl7XHJcbiAgXHJcbn0iXX0=
