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
function $removeClass(className, newClass) {
}
exports.$removeClass = $removeClass;
},{}]},{},[4])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy8ubnBtaW5zdGFsbC9icm93c2VyLXBhY2svNi4wLjEvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwic3JjL3RzL2FzdGFyLnRzIiwic3JjL3RzL2dhbWUudHMiLCJzcmMvdHMvaGVhcC50cyIsInNyYy90cy9tYWluLnRzIiwic3JjL3RzL25vZGUudHMiLCJzcmMvdHMvdXRpbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7QUNBQSxxQkFBaUIsUUFBUSxDQUFDLENBQUE7QUFDMUIscUJBQWlCLFFBQVEsQ0FBQyxDQUFBO0FBRzFCOztHQUVHO0FBQ0g7SUFTRSxlQUFhLFNBQWUsRUFBRSxVQUFnQjtRQVA5QyxlQUFVLEdBQVcsRUFBRSxDQUFBO1FBSWYsaUJBQVksR0FBYSxFQUFFLENBQUE7UUFDM0IsYUFBUSxHQUFXLEVBQUUsQ0FBQTtRQUczQixJQUFJLENBQUMsU0FBUyxHQUFHLFNBQVMsQ0FBQztRQUMzQixJQUFJLENBQUMsVUFBVSxHQUFHLFVBQVUsQ0FBQztRQUM3QixJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksY0FBSSxDQUFFLENBQUUsU0FBUyxDQUFFLEVBQUUsR0FBRyxDQUFFLENBQUM7SUFDakQsQ0FBQztJQUVELGtCQUFrQjtJQUNsQixrQkFBa0I7SUFFbEI7O09BRUc7SUFDSCxtQkFBRyxHQUFIO1FBQ0UsT0FBTyxDQUFDLElBQUksQ0FBRSxhQUFhLENBQUUsQ0FBQztRQUU5QixJQUFJLEtBQUssR0FBRyxJQUFJLENBQUM7UUFDakI7WUFDRSxJQUFJLFdBQVcsR0FBRyxLQUFLLENBQUMsUUFBUSxDQUFDLEdBQUcsRUFBRSxDQUFDO1lBQ3ZDLEtBQUssQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFFLFdBQVcsQ0FBRSxDQUFDO1lBQ3JDLEtBQUssQ0FBQyxZQUFZLENBQUUsV0FBVyxDQUFDLFNBQVMsRUFBRSxDQUFFLEdBQUcsQ0FBQyxDQUFDO1lBRWxELElBQUksU0FBUyxHQUFHLFdBQVcsQ0FBQyxZQUFZ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QyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUssTUFBTSxNQUFHLENBQUUsQ0FBQztRQUNoRCxFQUFFLENBQUMsQ0FBRSxLQUFLLEtBQUssQ0FBQyxDQUFFLENBQUMsQ0FBQSxDQUFDO1lBQ2xCLFFBQVEsQ0FBQyxDQUFDLENBQUMsR0FBRyxRQUFRLENBQUM7UUFDekIsQ0FBQztRQUNELE1BQU0sSUFBTyxRQUFRLENBQUMsQ0FBQyxDQUFDLE1BQUcsQ0FBQztJQUM5QixDQUFDO0lBQ0QsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsQ0FBQztBQUN2QixDQUFDO0FBWGUscUJBQWEsZ0JBVzVCLENBQUE7QUFFRCxtQkFBMkIsU0FBaUIsRUFBRSxRQUFnQjtBQUU5RCxDQUFDO0FBRmUsaUJBQVMsWUFFeEIsQ0FBQTtBQUVELHNCQUE4QixTQUFpQixFQUFFLFFBQWdCO0FBRWpFLENBQUM7QUFGZSxvQkFBWSxlQUUzQixDQUFBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImltcG9ydCBOb2RlIGZyb20gJy4vbm9kZSc7XHJcbmltcG9ydCBIZWFwIGZyb20gJy4vaGVhcCc7XHJcbmltcG9ydCB7IGJlbG9uZ1RvIH0gZnJvbSAnLi91dGlsJztcclxuXHJcbi8qKlxyXG4gKiBBKiDnrpfms5VcclxuICovXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEFzdGFye1xyXG4gIG9wZW5MaXN0OiBIZWFwXHJcbiAgY2xvc2VkTGlzdDogTm9kZVtdID0gW11cclxuICBzdGFydE5vZGU6IE5vZGVcclxuICB0YXJnZXROb2RlOiBOb2RlXHJcblxyXG4gIHByaXZhdGUgYl9jbG9zZWRMaXN0OiBiZWxvbmdUbyA9IHt9XHJcbiAgcHJpdmF0ZSBzb2x1dGlvbjogTm9kZVtdID0gW11cclxuXHJcbiAgY29uc3RydWN0b3IoIHN0YXJ0Tm9kZTogTm9kZSwgdGFyZ2V0Tm9kZTogTm9kZSApe1xyXG4gICAgdGhpcy5zdGFydE5vZGUgPSBzdGFydE5vZGU7XHJcbiAgICB0aGlzLnRhcmdldE5vZGUgPSB0YXJnZXROb2RlO1xyXG4gICAgdGhpcy5vcGVuTGlzdCA9IG5ldyBIZWFwKCBbIHN0YXJ0Tm9kZSBdLCBcIkZcIiApO1xyXG4gIH1cclxuXHJcbiAgLy8gcHVibGljIGZ1bmN0aW9uXHJcbiAgLy8gLS0tLS0tLS0tLS0tLS0tXHJcblxyXG4gIC8qKlxyXG4gICAqIOi/kOihjCBBKiDnrpfms5VcclxuICAgKi9cclxuICBydW4oKXtcclxuICAgIGNvbnNvbGUudGltZSggXCJBU3RhciBSdW4gIVwiICk7XHJcblxyXG4gICAgbGV0IGFzdGFyID0gdGhpcztcclxuICAgIHdoaWxlICggIU5vZGUuaXNTYW1lKCBhc3Rhci5vcGVuTGlzdC50b3AoKSwgYXN0YXIudGFyZ2V0Tm9kZSApICl7XHJcbiAgICAgIGxldCBjdXJyZW50Tm9kZSA9IGFzdGFyLm9wZW5MaXN0LnBvcCgpO1xyXG4gICAgICBhc3Rhci5jbG9zZWRMaXN0LnB1c2goIGN1cnJlbnROb2RlICk7XHJcbiAgICAgIGFzdGFyLmJfY2xvc2VkTGlzdFsgY3VycmVudE5vZGUuZ2V0VmFsU3RyKCkgXSA9IDE7XHJcblxyXG4gICAgICBsZXQgbmV4dE5vZGVzID0gY3VycmVudE5vZGUuZ2V0TmV4dE5vZGVzKCk7XHJcblxyXG4gICAgICBuZXh0Tm9kZXMuZm9yRWFjaChmdW5jdGlvbihuZXh0Tm9kZSl7XHJcbiAgICAgICAgbGV0IGNvc3QgPSBjdXJyZW50Tm9kZS5nZXRHKCkgKyBjdXJyZW50Tm9kZS5nZXRDb3N0VG9OZXh0KCk7XHJcbiAgICAgICAgbGV0IGluZGV4ID0gIGFzdGFyLm9wZW5MaXN0LmdldEl0ZW1JbmRleCggbmV4dE5vZGUgKTtcclxuXHJcbiAgICAgICAgaWYgKCBpbmRleCAhPT0gdW5kZWZpbmVkICYmIGNvc3QgPCBuZXh0Tm9kZS5nZXRHKCkgKXtcclxuICAgICAgICAgIGNvbnNvbGUubG9nKCBcIm5leHQgMVwiICk7XHJcbiAgICAgICAgICBhc3Rhci5vcGVuTGlzdC5yZW1vdmUoIGluZGV4ICk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoIGFzdGFyLmlzQmVsb25nVG9DbG9zZWQoIG5leHROb2RlICkgJiYgY29zdCA8IG5leHROb2RlLmdldEcoKSApe1xyXG4gICAgICAgICAgY29uc29sZS5sb2coIFwibmV4dCAyXCIgKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICggaW5kZXggPT09IHVuZGVmaW5lZCAmJiAhYXN0YXIuaXNCZWxvbmdUb0Nsb3NlZCggbmV4dE5vZGUgKSApe1xyXG4gICAgICAgICAgY29uc29sZS5sb2coIFwibmV4dCAzXCIgKTtcclxuICAgICAgICAgIG5leHROb2RlLnNldEcoIGNvc3QgKTtcclxuICAgICAgICAgIG5leHROb2RlLnNldEYoIG5leHROb2RlLmdldEcoKSArIG5leHROb2RlLmdldEgoIGFzdGFyLnRhcmdldE5vZGUgKSApO1xyXG4gICAgICAgICAgYXN0YXIub3Blbkxpc3QucHVzaCggbmV4dE5vZGUgKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgY29uc29sZS50aW1lRW5kKCBcIkFTdGFyIFJ1biAhXCIgKTtcclxuXHJcbiAgICBjb25zb2xlLmxvZyggXCIgYXN0YXIgLSBcIiwgYXN0YXIgKTtcclxuXHJcbiAgICBsZXQgdGFpbE5vZGUgPSBhc3Rhci5vcGVuTGlzdC50b3AoKTtcclxuICAgIHRoaXMuc29sdXRpb24gPSBbXTtcclxuICAgIHdoaWxlKCB0YWlsTm9kZSApe1xyXG4gICAgICB0aGlzLnNvbHV0aW9uLnB1c2goIHRhaWxOb2RlICk7XHJcbiAgICAgIHRhaWxOb2RlID0gdGFpbE5vZGUucGFyZW50O1xyXG4gICAgfVxyXG5cclxuICAgIC8vIHRoaXMuc2hvd1NvbHV0aW9uKCk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiDojrflj5bop6PlhrPmlrnmoYjmlbDnu4RcclxuICAgKi9cclxuICBnZXRTb2x1dGlvbigpe1xyXG4gICAgcmV0dXJuIHRoaXMuc29sdXRpb247XHJcbiAgfVxyXG5cclxuICAvLyBwcml2YXRlIGZ1bmN0aW9uXHJcbiAgLy8gLS0tLS0tLS0tLS0tLS0tXHJcblxyXG4gIC8qKlxyXG4gICAqIOWIpOaWreiKgueCueaYr+WQpuWcqCBDTE9TRUQg5LitXHJcbiAgICovXHJcbiAgcHJpdmF0ZSBpc0JlbG9uZ1RvQ2xvc2VkKCBub2RlOiBOb2RlICl7XHJcbiAgICBsZXQgc3RyID0gbm9kZS5nZXRWYWxTdHIoKTtcclxuICAgIHJldHVybiAhIXRoaXMuYl9jbG9zZWRMaXN0W3N0cl07XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiDmmL7npLrop6PlhrPmlrnmoYjnmoTlhbfkvZPmraXpqqRcclxuICAgKi9cclxuICBwcml2YXRlIHNob3dTb2x1dGlvbigpe1xyXG4gICAgbGV0IGxlbiA9IHRoaXMuc29sdXRpb24ubGVuZ3RoLFxyXG4gICAgICAgIGkgPSBsZW4gLSAxLFxyXG4gICAgICAgIHNjYWxlID0gdGhpcy50YXJnZXROb2RlLnNjYWxlO1xyXG4gICAgZm9yICggOyBpID4gLTE7IGkgLS0gKXtcclxuICAgICAgY29uc29sZS5sb2coIGBTdGVwICR7IGxlbiAtIGkgfTogYCApO1xyXG4gICAgICBsZXQgaXRlbSA9IHRoaXMuc29sdXRpb25baV0uZ2V0VmFsU3RyKCkuc3BsaXQoJywnKTtcclxuICAgICAgZm9yICggbGV0IGogPSAwOyBqIDwgc2NhbGU7IGogKysgKXtcclxuICAgICAgICAgIGNvbnNvbGUubG9nKCBgfCAke2l0ZW1bIGoqc2NhbGUgXX0gJHtpdGVtWyBqKnNjYWxlICsgMSBdfSAke2l0ZW1bIGoqc2NhbGUgKyAyIF19IHxgICk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcbn1cclxuIiwiaW1wb3J0IE5vZGUgZnJvbSBcIi4vbm9kZVwiO1xyXG5pbXBvcnQgQXN0YXIgZnJvbSAnLi9hc3Rhcic7XHJcbmltcG9ydCB7ICRpZCwgJGNyZWF0ZUVsZSwgJHJlcGxhY2VDbGFzcywgRElSRUNUSU9OIH0gZnJvbSAnLi91dGlsJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEdhbWV7XHJcbiAgY3VycmVudE5vZGU6IE5vZGVcclxuICB0YXJnZXROb2RlOiBOb2RlXHJcbiAgc2NhbGU6IG51bWJlclxyXG5cclxuICBwcml2YXRlIGdhbWVDb250YWluZXJJZDogc3RyaW5nXHJcbiAgcHJpdmF0ZSBpbWdDb250YWluZXJJZDogc3RyaW5nXHJcbiAgcHJpdmF0ZSBhY3Rpb25Db250YWluZXJJZDogc3RyaW5nXHJcbiAgcHJpdmF0ZSBnYW1lQ29udGFpbmVyXHJcbiAgcHJpdmF0ZSBpbWdDb250YWluZXJcclxuICBwcml2YXRlIGFjdGlvbkNvbnRhaW5lclxyXG5cclxuICBjb25zdHJ1Y3RvciggZ2FtZUNvbnRhaW5lcklkOiBzdHJpbmcsIHNjYWxlOiBudW1iZXIgKXtcclxuICAgIHRoaXMuY3VycmVudE5vZGUgPSBuZXcgTm9kZSggc2NhbGUgKTtcclxuICAgIHRoaXMudGFyZ2V0Tm9kZSA9IG5ldyBOb2RlKCBzY2FsZSApO1xyXG4gICAgdGhpcy5zY2FsZSA9IHNjYWxlO1xyXG5cclxuICAgIHRoaXMuZ2FtZUNvbnRhaW5lcklkID0gZ2FtZUNvbnRhaW5lcklkO1xyXG4gICAgdGhpcy5pbWdDb250YWluZXJJZCA9IFwiaW1hZ2VcIjtcclxuICAgIHRoaXMuYWN0aW9uQ29udGFpbmVySWQgPSBcImFjdGlvblwiO1xyXG5cclxuICAgIHRoaXMuZ2FtZUNvbnRhaW5lciA9ICRpZCggdGhpcy5nYW1lQ29udGFpbmVySWQgKTtcclxuICAgIHRoaXMuaW1nQ29udGFpbmVyID0gJGNyZWF0ZUVsZSggJ2RpdicsIHRoaXMuaW1nQ29udGFpbmVySWQgKTtcclxuICAgIHRoaXMuYWN0aW9uQ29udGFpbmVyID0gJGNyZWF0ZUVsZSggJ2RpdicsIHRoaXMuYWN0aW9uQ29udGFpbmVySWQgKTtcclxuXHJcbiAgICB0aGlzLmluaXQoKTtcclxuICB9XHJcblxyXG4gIC8vIHB1YmxpYyBmdW5jdGlvblxyXG4gIC8vIC0tLS0tLS0tLS0tLS0tLVxyXG5cclxuICAvKipcclxuICAgKiBtaXgg5oyJ6ZKu5omn6KGM5Ye95pWwXHJcbiAgICog5re35ZCI77yM55Sx6LW35aeL6IqC54K55Lmx5bqP5b6X5Yiw5LiA5Liq5paw55qE6IqC54K577yM5bm25qC55o2u5paw6IqC54K56K6+572u6aG16Z2i5Lit55qE5pi+56S654q25oCBXHJcbiAgICovXHJcbiAgbWl4KCl7XHJcbiAgICB0aGlzLmN1cnJlbnROb2RlLnNodWZmbGUoKTtcclxuICAgIHRoaXMuc2V0U3RhdHVzV2l0aE5vZGUoIHRoaXMuY3VycmVudE5vZGUgKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIHN0YXJ0IOaMiemSruaJp+ihjOWHveaVsFxyXG4gICAqIOaJp+ihjCBBKiDnrpfms5VcclxuICAgKi9cclxuICBzdGFydCgpe1xyXG4gICAgbGV0IGdhbWUgPSB0aGlzO1xyXG4gICAgaWYgKCBOb2RlLmlzU2FtZSggdGhpcy5jdXJyZW50Tm9kZSwgdGhpcy50YXJnZXROb2RlICkgKXtcclxuICAgICAgdGhpcy53aW4oKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGxldCBhc3RhciA9IG5ldyBBc3RhciggdGhpcy5jdXJyZW50Tm9kZSwgdGhpcy50YXJnZXROb2RlICk7XHJcbiAgICAgIGFzdGFyLnJ1bigpO1xyXG5cclxuICAgICAgbGV0IHNvbHV0aW9uID0gYXN0YXIuZ2V0U29sdXRpb24oKTtcclxuICAgICAgaWYgKCBzb2x1dGlvbi5sZW5ndGggKSAge1xyXG4gICAgICAgIGxldCBsZW4gPSBzb2x1dGlvbi5sZW5ndGgsXHJcbiAgICAgICAgICAgIGkgPSBsZW4gLSAxO1xyXG5cclxuICAgICAgICBsZXQgaWQgPSBzZXRJbnRlcnZhbCggZnVuY3Rpb24oKXtcclxuICAgICAgICAgIGlmICggaSA9PT0gLTEgKXtcclxuICAgICAgICAgICAgY2xlYXJJbnRlcnZhbCggaWQgKTtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGdhbWUuY3VycmVudE5vZGUgPSBzb2x1dGlvbltpXTtcclxuICAgICAgICAgICAgZ2FtZS5zZXRTdGF0dXNXaXRoTm9kZSggc29sdXRpb25baV0gKTtcclxuICAgICAgICAgICAgaS0tO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0sIDUwMCApO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiDotaLlvpfmuLjmiI9cclxuICAgKi9cclxuICB3aW4oKXtcclxuICAgIGNvbnNvbGUubG9nKCBcIndpbiEhIVwiICk7XHJcbiAgfVxyXG5cclxuICAvLyBwcml2YXRlIGZ1bmN0aW9uXHJcbiAgLy8gLS0tLS0tLS0tLS0tLS0tXHJcblxyXG4gIC8qKlxyXG4gICAqIOWIneWni+WMluWHveaVsFxyXG4gICAqL1xyXG4gIHByaXZhdGUgaW5pdCgpe1xyXG4gICAgdGhpcy5pbml0SW1hZ2UoKTtcclxuICAgIHRoaXMuaW5pdE9wZXJhdGlvbigpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICog5ou85Zu+55qE5Zu+54mH5pi+56S66YOo5YiG55qE5Yid5aeL5YyWXHJcbiAgICovXHJcbiAgcHJpdmF0ZSBpbml0SW1hZ2UoKXtcclxuICAgIGxldCBnYW1lID0gdGhpcztcclxuICAgIC8vIGdhbWUuaW1nQ29udGFpbmVyLnN0eWxlLndpZHRoID0gYCR7IHRoaXMuc2NhbGUgKiA4MiB9cHhgO1xyXG4gICAgLy8g6IqC54K555qE5pWw57uE6KGo56S65Lit55qE5q+P5LiA5Liq5pWw57uE55qE6aG55a+55bqU5LiA5Liq5qC85a2QXHJcbiAgICBmb3IgKCBsZXQgaSA9IE1hdGgucG93KCBnYW1lLnNjYWxlLCAyKSAtIDE7IGkgPiAtMTsgaSAtLSApe1xyXG4gICAgICBsZXQgZWxlID0gJGNyZWF0ZUVsZSggJ2RpdicsIHVuZGVmaW5lZCwgYGl0ZW0gaXRlbS0ke2l9IHBvcy0ke2l9YCApO1xyXG4gICAgICBlbGUuYWRkRXZlbnRMaXN0ZW5lciggJ2NsaWNrJywgZnVuY3Rpb24oZSl7IGdhbWUubW92ZUltZyhlKSB9ICk7XHJcbiAgICAgIGVsZS5zZXRBdHRyaWJ1dGUoIFwiZGF0YS1wb3NcIiwgYCR7aX1gICk7XHJcbiAgICAgIGlmICggaSA9PT0gMCApe1xyXG4gICAgICAgIGdhbWUuaW1nQ29udGFpbmVyLmFwcGVuZENoaWxkKCBlbGUgKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBnYW1lLmltZ0NvbnRhaW5lci5pbnNlcnRCZWZvcmUoIGVsZSwgZ2FtZS5pbWdDb250YWluZXIuZmlyc3RDaGlsZCApO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICBnYW1lLmdhbWVDb250YWluZXIuYXBwZW5kQ2hpbGQoIGdhbWUuaW1nQ29udGFpbmVyICk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiDmi7zlm77nmoTmjInpkq7mk43kvZzpg6jliIbnmoTliJ3lp4vljJZcclxuICAgKi9cclxuICBwcml2YXRlIGluaXRPcGVyYXRpb24oKXtcclxuICAgIGxldCBnYW1lID0gdGhpcztcclxuICAgIFtcIk1JWFwiLCBcIlNUQVJUXCJdLmZvckVhY2goIGZ1bmN0aW9uKGl0ZW0sIGluZGV4LCBhcnJheSl7XHJcbiAgICAgIGxldCBlbGUgPSAkY3JlYXRlRWxlKCAnYnV0dG9uJywgdW5kZWZpbmVkLCBgYnRuIGJ0bi0ke2l0ZW0udG9Mb3dlckNhc2UoKX1gICk7XHJcbiAgICAgIGVsZS5pbm5lckhUTUwgPSBpdGVtO1xyXG4gICAgICBzd2l0Y2goIGl0ZW0gKXtcclxuICAgICAgICBjYXNlICdNSVgnOlxyXG4gICAgICAgICAgZWxlLmFkZEV2ZW50TGlzdGVuZXIoICdjbGljaycsIGdhbWUubWl4LmJpbmQoIGdhbWUgKSApO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSAnU1RBUlQnOlxyXG4gICAgICAgICAgZWxlLmFkZEV2ZW50TGlzdGVuZXIoICdjbGljaycsIGdhbWUuc3RhcnQuYmluZCggZ2FtZSApICk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgfVxyXG4gICAgICBnYW1lLmFjdGlvbkNvbnRhaW5lci5hcHBlbmRDaGlsZCggZWxlICk7XHJcbiAgICB9KTtcclxuICAgIGdhbWUuZ2FtZUNvbnRhaW5lci5hcHBlbmRDaGlsZCggZ2FtZS5hY3Rpb25Db250YWluZXIgKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIOagueaNruiKgueCueeahOaVsOe7hOihqOekuuadpeabtOaWsOmhtemdouS4reeahOaYvuekuueKtuaAgVxyXG4gICAqL1xyXG4gIHByaXZhdGUgc2V0U3RhdHVzV2l0aE5vZGUoIG5vZGU6IE5vZGUgKXtcclxuICAgIGxldCBpbWdJdGVtcyA9IHRoaXMuaW1nQ29udGFpbmVyLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJpdGVtXCIpO1xyXG4gICAgZm9yICggbGV0IGkgPSAwLCBsZW4gPSBpbWdJdGVtcy5sZW5ndGg7IGkgPCBsZW47IGkgKysgKXtcclxuICAgICAgaW1nSXRlbXNbaV0uY2xhc3NOYW1lID0gJHJlcGxhY2VDbGFzcyggaW1nSXRlbXNbaV0uY2xhc3NOYW1lLCBgaXRlbS0ke25vZGUudmFsdWVbaV19YCwgYGl0ZW1gICk7XHJcbiAgICAgIGltZ0l0ZW1zW2ldLnNldEF0dHJpYnV0ZSggXCJkYXRhLXBvc1wiLCBgJHtub2RlLnZhbHVlW2ldfWAgKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIOWbvueJh+Wdl+S4iueahCBjbGljayDkuovku7blpITnkIblh73mlbDvvIznlKjmnaXnp7vliqjlm77niYflnZdcclxuICAgKi9cclxuICBwcml2YXRlIG1vdmVJbWcoZSl7XHJcbiAgICBsZXQgaW1nTnVtYmVyID0gZS50YXJnZXQuZ2V0QXR0cmlidXRlKFwiZGF0YS1wb3NcIik7XHJcbiAgICBsZXQgbm9uWmVyb0RpciA9IHRoaXMuY3VycmVudE5vZGUuZ2V0Tm9uWmVyb0RpcmVjdGlvbigpO1xyXG4gICAgaWYgKCBub25aZXJvRGlyW2ltZ051bWJlcl0gKXtcclxuICAgICAgbGV0IGRpcmVjdGlvbiA9IERJUkVDVElPTlsgYCR7bm9uWmVyb0RpclsgaW1nTnVtYmVyIF19YCBdO1xyXG4gICAgICB0aGlzLmN1cnJlbnROb2RlLm1vdmVUbyggZGlyZWN0aW9uICk7XHJcbiAgICAgIHRoaXMuc2V0U3RhdHVzV2l0aE5vZGUoIHRoaXMuY3VycmVudE5vZGUgKTtcclxuICAgIH1cclxuICB9XHJcbn1cclxuIiwiaW1wb3J0IE5vZGUgZnJvbSAnLi9ub2RlJztcclxuaW1wb3J0IHsgYmVsb25nVG8gfSBmcm9tICcuL3V0aWwnO1xyXG4vLyBIZWFwIE9uIFRvcFxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBIZWFwe1xyXG4gIGhlYXA6IE5vZGVbXSA9IFtdXHJcbiAgYl9oZWFwOiBiZWxvbmdUbyA9IHt9XHJcbiAga2V5OiBzdHJpbmdcclxuICBjb25zdHJ1Y3Rvciggbm9kZUxpc3Q6IE5vZGVbXSwga2V5OiBzdHJpbmcgKXtcclxuICAgIHRoaXMua2V5ID0ga2V5O1xyXG4gICAgLy8g55So5L6d5qyh5o+S5YWl55qE5pa55byP5p6E6YCg5Yid5aeL55qE5bCP6aG25aCGXHJcbiAgICBsZXQgaSA9IDAsXHJcbiAgICAgICAgbGVuID0gbm9kZUxpc3QubGVuZ3RoO1xyXG4gICAgZm9yICggOyBpIDwgbGVuOyBpICsrICl7XHJcbiAgICAgIHRoaXMucHVzaCggbm9kZUxpc3RbaV0gKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8vIHB1YmxpYyBmdW5jdGlvblxyXG4gIC8vIC0tLS0tLS0tLS0tLS0tLVxyXG5cclxuICAvKipcclxuICAgKiDojrflj5bloIbkuK3kuIvmoIfkuLogaW5kZXgg55qE5YC8XHJcbiAgICovXHJcbiAgZ2V0KCBpbmRleDogbnVtYmVyICl7XHJcbiAgICBpZiAoIGluZGV4ID49IDAgJiYgaW5kZXggPCB0aGlzLmhlYXAubGVuZ3RoICl7XHJcbiAgICAgIHJldHVybiB0aGlzLmhlYXBbIGluZGV4IF1bIHRoaXMua2V5IF07XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiDlkJHloIbkuK3mj5LlhaXkuIDkuKrmlrDnmoTlhYPntKDlubbosIPmlbTloIZcclxuICAgKiDmlrDlhYPntKDku47mlbDnu4TlsL7pg6jmj5LlhaXvvIznhLblkI7lr7nmlrDlhYPntKDmiafooYzkuIrmta7osIPmlbRcclxuICAgKi9cclxuICBwdXNoKCBub2RlOiBOb2RlICl7XHJcbiAgICB0aGlzLmhlYXAucHVzaCggbm9kZSApO1xyXG4gICAgdGhpcy5zZXRCSGVhcCggdGhpcy5oZWFwLmxlbmd0aCAtIDEgKTtcclxuICAgIHRoaXMuZ29VcCggdGhpcy5oZWFwLmxlbmd0aCAtIDEgKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIOWIoOmZpOW5tui/lOWbnuWghumhtuWFg+e0oOW5tuiwg+aVtOWghlxyXG4gICAqIOWFiOWwhuWghumhtuWFg+e0oOS4juaVsOe7hOacq+WwvuWFg+e0oOS6kuaNou+8jOeEtuWQjuW8ueWHuuaVsOe7hOacq+WwvueahOWFg+e0oO+8jOacgOWQjuWvueWghumhtuWFg+e0oOaJp+ihjOS4i+ayieaTjeS9nFxyXG4gICAqL1xyXG4gIHBvcCgpe1xyXG4gICAgaWYgKCB0aGlzLmlzRW1wdHkoKSApIHJldHVybjtcclxuICAgIGxldCByZXN1bHQ7XHJcbiAgICB0aGlzLnN3YXAoIDAsIHRoaXMuaGVhcC5sZW5ndGggLSAxICk7XHJcbiAgICByZXN1bHQgPSB0aGlzLmhlYXAucG9wKCk7XHJcbiAgICB0aGlzLnJlbW92ZUJIZWFwKCByZXN1bHQuZ2V0VmFsU3RyKCkgKTtcclxuICAgICF0aGlzLmlzRW1wdHkoKSAmJiB0aGlzLmdvRG93bigwKTtcclxuICAgIHJldHVybiByZXN1bHQ7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiDnp7vpmaTloIbkuK3kuIvmoIfkuLogaW5kZXgg55qE5YWD57SgXHJcbiAgICog5bCG6ZyA56e76Zmk55qE6aG55LiO5aCG6aG25LqS5o2i77yM54S25ZCO5by55Ye65aCG6aG277yM5pyA5ZCO5a+55LqS5o2i6aG577yI5Y6f5aCG6aG277yJ5omn6KGM5LiK5rWu5pON5L2cXHJcbiAgICovXHJcbiAgcmVtb3ZlKCBpbmRleDogbnVtYmVyICl7XHJcbiAgICBpZiggaW5kZXggPCAwIHx8IGluZGV4ID49IHRoaXMuaGVhcC5sZW5ndGggKSByZXR1cm47XHJcbiAgICB0aGlzLnN3YXAoIDAsIGluZGV4ICk7XHJcbiAgICB0aGlzLnBvcCgpO1xyXG4gICAgdGhpcy5nb1VwKCBpbmRleCApO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICog6I635Y+W5aCG6aG25YWD57SgXHJcbiAgICovXHJcbiAgdG9wKCl7XHJcbiAgICByZXR1cm4gdGhpcy5oZWFwLmxlbmd0aCAmJiB0aGlzLmhlYXBbMF07XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiDliKTmlq3loIbmmK/lkKbkuLrnqbpcclxuICAgKi9cclxuICBpc0VtcHR5KCl7XHJcbiAgICByZXR1cm4gIXRoaXMuaGVhcC5sZW5ndGg7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiDliKTmlq3loIbkuK3mmK/lkKbmnInlhYPntKAgbm9kZVxyXG4gICAqL1xyXG4gIGdldEl0ZW1JbmRleCggbm9kZTogTm9kZSApe1xyXG4gICAgcmV0dXJuIHRoaXMuYl9oZWFwWyBub2RlLmdldFZhbFN0cigpIF07XHJcbiAgfVxyXG5cclxuICAvLyBwcml2YXRlIGZ1bmN0aW9uXHJcbiAgLy8gLS0tLS0tLS0tLS0tLS0tXHJcblxyXG4gIC8qKlxyXG4gICAqIOi/lOWbnuWghuS4reS4i+agh+S4uiBpbmRleCDnmoTlhYPntKBcclxuICAgKi9cclxuICBwcml2YXRlIGdldFZhbHVlKCBpbmRleDogbnVtYmVyICl7XHJcbiAgICBpZiggaW5kZXggPCAwIHx8IGluZGV4ID49IHRoaXMuaGVhcC5sZW5ndGggKSByZXR1cm47XHJcbiAgICByZXR1cm4gdGhpcy5oZWFwW2luZGV4XVt0aGlzLmtleV07XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiDloIbkuK3kuIvmoIfkuLogaW5kZXgg55qE5YWD57Sg55qE5LiK5rWu5pON5L2cXHJcbiAgICovXHJcbiAgcHJpdmF0ZSBnb1VwKGluZGV4OiBudW1iZXIpe1xyXG4gICAgbGV0IHZhbHVlID0gdGhpcy5nZXRWYWx1ZShpbmRleCksXHJcbiAgICAgICAgcGFyZW50ID0gdGhpcy5nZXRQYXJlbnRJbmRleChpbmRleCk7XHJcblxyXG4gICAgaWYgKCBwYXJlbnQgPT09IHVuZGVmaW5lZCApIHJldHVybjtcclxuXHJcbiAgICBpZiAoIHRoaXMuZ2V0VmFsdWUoIHBhcmVudCApID4gdGhpcy5nZXRWYWx1ZSggaW5kZXggKSApe1xyXG4gICAgICB0aGlzLnN3YXAoIGluZGV4LCBwYXJlbnQgKTtcclxuICAgICAgdGhpcy5nb1VwKCBwYXJlbnQgKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIOWghuS4reS4i+agh+S4uiBpbmRleCDnmoTlhYPntKDnmoTkuIvmsonmk43kvZxcclxuICAgKi9cclxuICBwcml2YXRlIGdvRG93bihpbmRleDogbnVtYmVyKXtcclxuICAgIGxldCB2YWx1ZSA9IHRoaXMuZ2V0VmFsdWUoaW5kZXgpLFxyXG4gICAgICAgIFtsZWZ0LCByaWdodF0gPSB0aGlzLmdldENoaWxkSW5kZXgoaW5kZXgpLFxyXG4gICAgICAgIHN3YXBJbmRleCA9IGxlZnQ7XHJcblxyXG4gICAgLy8g5YWD57Sg5piv5Y+25a2Q6IqC54K577yM5rKh5pyJ5a2Q5YWD57SgXHJcbiAgICBpZiAoIGxlZnQgPT09IG51bGwgKSByZXR1cm47XHJcblxyXG4gICAgLy8g6Iul5YWD57Sg5pyJ5Lik5Liq5a2Q5YWD57Sg77yM6K6+572uIHN3YXBJbmRleCDkuLrovoPlsI/nmoTpgqPkuKrlrZDlhYPntKDnmoTkuIvmoIdcclxuICAgIC8vIOiLpeWFg+e0oOWPquacieW3puWEv+WtkO+8jHN3YXBJbmRleCDlt7Lnu4/ooqvliJ3lp4vljJbkuLogbGVmdCDnmoTlgLzkuoZcclxuICAgIGlmICggcmlnaHQgKXtcclxuICAgICAgc3dhcEluZGV4ID0gdGhpcy5nZXRWYWx1ZShsZWZ0KSA8IHRoaXMuZ2V0VmFsdWUocmlnaHQpID8gbGVmdCA6IHJpZ2h0O1xyXG4gICAgfVxyXG5cclxuICAgIC8vIOavlOi+g+eItuWFg+e0oOWSjOi+g+Wwj+eahOmCo+S4quWtkOWFg+e0oOeahOWAvO+8jOiLpeeItuWFg+e0oOeahOWAvOi+g+Wkp++8jOWImee9ruaNoueItuWFg+e0oOWSjOi+g+Wwj+eahOWtkOWFg+e0oFxyXG4gICAgLy8g54S25ZCO5Zyo5paw55qE572u5o2i55qE5L2N572u5aSE57un57ut5omn6KGM5LiL5rKJ5pON5L2cXHJcbiAgICBpZiAoIHRoaXMuZ2V0VmFsdWUoc3dhcEluZGV4KSA8IHZhbHVlICkge1xyXG4gICAgICB0aGlzLnN3YXAoIGluZGV4LCBzd2FwSW5kZXggKTtcclxuICAgICAgdGhpcy5nb0Rvd24oIHN3YXBJbmRleCApO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICog6I635Y+W5LiL5qCH5Li6IGluZGV4IOeahOWFg+e0oOWcqOWghuS4reeahOeItuWFg+e0oFxyXG4gICAqL1xyXG4gIHByaXZhdGUgZ2V0UGFyZW50SW5kZXgoIGluZGV4OiBudW1iZXIgKXtcclxuICAgIGlmICggaW5kZXggPCAwIHx8IGluZGV4ID49IHRoaXMuaGVhcC5sZW5ndGggKSByZXR1cm47XHJcbiAgICBpZiAoIGluZGV4ID09PSAwICkgcmV0dXJuIDA7XHJcbiAgICByZXR1cm4gTWF0aC5mbG9vciggKGluZGV4LTEpLzIgKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIOiOt+WPluS4i+agh+S4uiBpbmRleCDnmoTlhYPntKDlnKjloIbkuK3nmoTlrZDlhYPntKDvvIznvLrlpLHnmoTlrZDlhYPntKDnlKggbnVsbCDku6Pmm79cclxuICAgKi9cclxuICBwcml2YXRlIGdldENoaWxkSW5kZXgoIGluZGV4OiBudW1iZXIgKXtcclxuICAgIGxldCBsZWZ0ID0gMippbmRleCArIDEsXHJcbiAgICAgICAgcmlnaHQgPSAyKmluZGV4ICsgMixcclxuICAgICAgICBsZW5ndGggPSB0aGlzLmhlYXAubGVuZ3RoO1xyXG5cclxuICAgIGlmICggcmlnaHQgPD0gbGVuZ3RoIC0gMSApe1xyXG4gICAgICByZXR1cm4gWyBsZWZ0LCByaWdodCBdO1xyXG4gICAgfSBlbHNlIGlmICggbGVmdCA9PT0gbGVuZ3RoIC0gMSApIHtcclxuICAgICAgcmV0dXJuIFsgbGVmdCwgbnVsbCBdO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgcmV0dXJuIFsgbnVsbCwgbnVsbCBdO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICog5Lqk5o2i5aCG5Lit5LiL5qCH5YiG5Yir5Li6IGluZGV4MSDlkowgaW5kZXgyIOeahOS4pOS4quWFg+e0oFxyXG4gICAqL1xyXG4gIHByaXZhdGUgc3dhcCggaW5kZXgxOiBudW1iZXIsIGluZGV4MjogbnVtYmVyICl7XHJcbiAgICBsZXQgdG1wID0gdGhpcy5oZWFwW2luZGV4MV07XHJcbiAgICB0aGlzLmhlYXBbaW5kZXgxXSA9IHRoaXMuaGVhcFtpbmRleDJdO1xyXG4gICAgdGhpcy5oZWFwW2luZGV4Ml0gPSB0bXA7XHJcblxyXG4gICAgdGhpcy5zZXRCSGVhcCggaW5kZXgxICk7XHJcbiAgICB0aGlzLnNldEJIZWFwKCBpbmRleDIgKTtcclxuICB9XHJcbiAgcHJpdmF0ZSBzZXRCSGVhcCggaW5kZXg6IG51bWJlciApe1xyXG4gICAgdGhpcy5iX2hlYXBbIHRoaXMuaGVhcFsgaW5kZXggXS5nZXRWYWxTdHIoKSBdID0gaW5kZXg7XHJcbiAgfVxyXG4gIHByaXZhdGUgcmVtb3ZlQkhlYXAoIHN0cjogc3RyaW5nICl7XHJcbiAgICBkZWxldGUgdGhpcy5iX2hlYXBbIHN0ciBdO1xyXG4gIH1cclxufVxyXG4iLCJpbXBvcnQgR2FtZSBmcm9tIFwiLi9nYW1lXCI7XHJcbmxldCBnYW1lID0gbmV3IEdhbWUoIFwiY29udGFpbmVyXCIsIDMgKTtcclxuXHJcbmNvbnNvbGUubG9nKCBnYW1lICk7XHJcbmNvbnNvbGUubG9nKCBcIi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVwiICk7XHJcblxyXG4vLyBpbXBvcnQgbWluSGVhcCBmcm9tICcuL21pbi1oZWFwJztcclxuLy9cclxuLy8gY29uc29sZS5sb2coIFwiLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXCIgKTtcclxuLy9cclxuLy8gbGV0IGhlYXAgPSBuZXcgbWluSGVhcCggWyAzLCA1LCA0LCAxLCAyLCAxOSwgMTgsIDIyLCAxMiwgN10gKTtcclxuLy9cclxuLy8gY29uc29sZS5sb2coIGhlYXAuaGVhcCApO1xyXG4vL1xyXG4vLyAvLyBmb3IgKCBsZXQgaSA9IDAsIGxlbiA9IGhlYXAuaGVhcC5sZW5ndGg7IGkgPCBsZW47IGkgKysgKXtcclxuLy8gLy8gICBjb25zb2xlLmxvZyggaGVhcC5wb3AoKSApO1xyXG4vLyAvLyAgIGNvbnNvbGUubG9nKCBoZWFwLmhlYXAgKTtcclxuLy8gLy8gfVxyXG4vLyAvL1xyXG4vLyAvLyBjb25zb2xlLmxvZyggaGVhcC5wb3AoKSApO1xyXG4vLyAvLyBjb25zb2xlLmxvZyggaGVhcC5oZWFwICk7XHJcbiIsImltcG9ydCB7IERJUkVDVElPTiB9IGZyb20gJy4vdXRpbCc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBOb2Rle1xyXG4gIHZhbHVlOiBudW1iZXJbXVxyXG4gIHplcm9JbmRleDogbnVtYmVyXHJcbiAgc2NhbGU6IG51bWJlclxyXG4gIHBhcmVudDogTm9kZVxyXG4gIEY6IG51bWJlciA9IDBcclxuICBHOiBudW1iZXIgPSAwXHJcbiAgY29uc3RydWN0b3IoIHNjYWxlOiBudW1iZXIsIGluaXRBcnI/OiBudW1iZXJbXSApIHtcclxuICAgIHRoaXMuc2NhbGUgPSBzY2FsZTtcclxuICAgIHRoaXMudmFsdWUgPSBpbml0QXJyID8gaW5pdEFyciA6IHRoaXMuaW5pdE5vZGVWYWx1ZUJ5U2NhbGUoIHNjYWxlICk7XHJcbiAgICB0aGlzLnplcm9JbmRleCA9IE1hdGgucG93KHNjYWxlLCAyKSAtIDE7XHJcblxyXG4gICAgLy8gdGhpcy5wYXJlbnQgPSBuZXcgTm9kZSh0aGlzLnNjYWxlKTtcclxuICB9XHJcblxyXG4gIC8vIHB1YmxpYyBmdW5jdGlvblxyXG4gIC8vIC0tLS0tLS0tLS0tLS0tLVxyXG5cclxuICAvKipcclxuICAgKiDojrflj5boioLngrnnmoTlgLzvvIzlsIboioLngrnnmoTmlbDnu4TooajnpLrovazmjaLmiJDlrZfnrKbkuLLooajnpLrlubbov5Tlm55cclxuICAgKi9cclxuICBnZXRWYWxTdHIoKXtcclxuICAgIHJldHVybiB0aGlzLnZhbHVlLnRvU3RyaW5nKCk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiDoioLngrnnmoTkubHluo/nrpfms5VcclxuICAgKiDpmo/mnLrmjIflrprkuIDkuKrmlrnlkJHvvIzku6ToioLngrnlkJHor6XmlrnlkJHnp7vliqjvvIzph43lpI3kuIrov7Dov4fnqIvoi6XlubLmrKHovr7liLDkubHluo/nmoTnm67nmoRcclxuICAgKi9cclxuICBzaHVmZmxlKCl7XHJcbiAgICBmb3IoIGxldCBpID0gMDsgaSA8IDUwMDA7IGkgKysgKXtcclxuICAgICAgbGV0IGRpcmVjdGlvbiA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDQgKyAxKTtcclxuICAgICAgdGhpcy5tb3ZlVG8oIGRpcmVjdGlvbiApO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICog5b2T5YmN6IqC54K55ZCR5pa55ZCRIGRpcmVjdGlvbiDnp7vliqjkuIDmrKFcclxuICAgKiDlhbblrp7mmK/oioLngrnnmoTmlbDnu4TooajnpLrkuK3nmoTmlbDlrZcgMCDlkJHmlrnlkJEgZGlyZWN0aW9uIOenu+WKqOS4gOasoVxyXG4gICAqL1xyXG4gIG1vdmVUbyggZGlyZWN0aW9uOiBudW1iZXIgKXtcclxuICAgIGlmICggIXRoaXMuY2FuTW92ZVRvKCBkaXJlY3Rpb24gKSApIHJldHVybjtcclxuICAgIGxldCB0YXJnZXRJbmRleCA9IHRoaXMuZ2V0VGFyZ2V0SW5kZXgoIGRpcmVjdGlvbiApO1xyXG5cclxuICAgIHRoaXMudmFsdWVbIHRoaXMuemVyb0luZGV4IF0gPSB0aGlzLnZhbHVlWyB0YXJnZXRJbmRleCBdO1xyXG4gICAgdGhpcy52YWx1ZVsgdGFyZ2V0SW5kZXggXSA9IDA7XHJcbiAgICB0aGlzLnplcm9JbmRleCA9IHRhcmdldEluZGV4O1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICog6I635Y+W5b2T5YmN6IqC54K555qE5Y+v6IO956e75Yqo5pa55ZCR77yI55SoIDAg5L2N55qE56e75Yqo6L+b6KGM6KGo56S677yJXHJcbiAgICovXHJcbiAgZ2V0WmVyb0RpcmVjdGlvbigpe1xyXG4gICAgbGV0IG5vZGUgPSB0aGlzO1xyXG4gICAgbGV0IERpcmVjdGlvbiA9IHt9O1xyXG4gICAgWyBcIlVQXCIsIFwiUklHSFRcIiwgXCJET1dOXCIsIFwiTEVGVFwiIF0uZm9yRWFjaCggZnVuY3Rpb24oZGlyKXtcclxuICAgICAgbGV0IF9kaXIgPSBESVJFQ1RJT05bZGlyXTtcclxuICAgICAgaWYgKCBub2RlLmNhbk1vdmVUbyggX2RpciApICl7XHJcbiAgICAgICAgbGV0IHRhcmdldEluZGV4ID0gbm9kZS5nZXRUYXJnZXRJbmRleCggX2RpciApO1xyXG4gICAgICAgIERpcmVjdGlvblsgZGlyIF0gPSBgJHtub2RlLnZhbHVlWyB0YXJnZXRJbmRleCBdfWA7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gICAgcmV0dXJuIERpcmVjdGlvbjtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIOWwhuW9k+WJjeiKgueCueeahOWPr+iDveenu+WKqOaWueWQkeeUseeUqCAwIOS9jeeahOenu+WKqOadpeihqOekuui9rOaNouaIkOeUqCAwIOS9jemCu+aOpeeahOmdniAwIOaVsOWtl+eahOenu+WKqOadpei/m+ihjOihqOekulxyXG4gICAqL1xyXG4gIGdldE5vblplcm9EaXJlY3Rpb24oKXtcclxuICAgIGxldCBEaXJlY3Rpb24gPSB7fTtcclxuICAgIGxldCB6ZXJvRGlyID0gdGhpcy5nZXRaZXJvRGlyZWN0aW9uKCk7XHJcbiAgICBmb3IgKCBsZXQgdmFsIGluIHplcm9EaXIgKXtcclxuICAgICAgLy8gbGV0IF92YWw7XHJcbiAgICAgIC8vIHN3aXRjaCggdmFsICl7XHJcbiAgICAgIC8vICAgY2FzZSBcIlVQXCI6XHJcbiAgICAgIC8vICAgICBfdmFsID0gXCJET1dOXCI7XHJcbiAgICAgIC8vICAgICBicmVhaztcclxuICAgICAgLy8gICBjYXNlIFwiUklHSFRcIjpcclxuICAgICAgLy8gICAgIF92YWwgPSBcIkxFRlRcIjtcclxuICAgICAgLy8gICAgIGJyZWFrO1xyXG4gICAgICAvLyAgIGNhc2UgXCJET1dOXCI6XHJcbiAgICAgIC8vICAgICBfdmFsID0gXCJVUFwiO1xyXG4gICAgICAvLyAgICAgYnJlYWs7XHJcbiAgICAgIC8vICAgY2FzZSBcIkxFRlRcIjpcclxuICAgICAgLy8gICAgIF92YWwgPSBcIlJJR0hUXCI7XHJcbiAgICAgIC8vICAgICBicmVhaztcclxuICAgICAgLy8gfVxyXG4gICAgICAvLyBEaXJlY3Rpb25bIHplcm9EaXJbIHZhbCBdIF0gPSBfdmFsO1xyXG5cclxuICAgICAgRGlyZWN0aW9uWyB6ZXJvRGlyWyB2YWwgXSBdID0gdmFsO1xyXG4gICAgfVxyXG4gICAgY29uc29sZS5sb2coIERpcmVjdGlvbiApO1xyXG4gICAgcmV0dXJuIERpcmVjdGlvbjtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIOiOt+WPluW9k+WJjeiKgueCueWcqOWPr+enu+WKqOaWueWQkeS4iueahOWtkOiKgueCueaVsOe7hFxyXG4gICAqL1xyXG4gIGdldE5leHROb2Rlcygpe1xyXG4gICAgbGV0IG5vZGUgPSB0aGlzO1xyXG4gICAgbGV0IG5leHROb2RlczogTm9kZVtdID0gW107XHJcbiAgICBbIERJUkVDVElPTi5VUCwgRElSRUNUSU9OLlJJR0hULCBESVJFQ1RJT04uRE9XTiwgRElSRUNUSU9OLkxFRlQgXS5mb3JFYWNoKCBmdW5jdGlvbihkaXJlY3Rpb24pe1xyXG4gICAgICBpZiAoIG5vZGUuY2FuTW92ZVRvKCBkaXJlY3Rpb24gKSApe1xyXG4gICAgICAgIGxldCBuZXdOb2RlID0gTm9kZS5ub2RlQ2xvbmUoIG5vZGUgKTtcclxuICAgICAgICBuZXdOb2RlLnBhcmVudCA9IG5vZGU7XHJcbiAgICAgICAgbmV3Tm9kZS5tb3ZlVG8oZGlyZWN0aW9uKTtcclxuICAgICAgICBuZXh0Tm9kZXMucHVzaCggbmV3Tm9kZSApO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICAgIHJldHVybiBuZXh0Tm9kZXM7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiDliKTmlq3lvZPliY3oioLngrnvvIjoioLngrnkuK3nmoQgMCDkvY3vvInmmK/lkKblj6/ku6Xmsr8gZGlyZWN0aW9uIOaWueWQkeenu+WKqFxyXG4gICAqL1xyXG4gIGNhbk1vdmVUbyggZGlyZWN0aW9uOiBudW1iZXIgKXtcclxuICAgIGxldCByb3cgPSBNYXRoLmZsb29yKCB0aGlzLnplcm9JbmRleCAvIHRoaXMuc2NhbGUgKTtcclxuICAgIGxldCBjb2wgPSB0aGlzLnplcm9JbmRleCAlIHRoaXMuc2NhbGU7XHJcblxyXG4gICAgc3dpdGNoKCBkaXJlY3Rpb24gKXtcclxuICAgICAgY2FzZSBESVJFQ1RJT04uVVA6XHJcbiAgICAgICAgcmV0dXJuIHJvdyAhPT0gMDtcclxuICAgICAgY2FzZSBESVJFQ1RJT04uUklHSFQ6XHJcbiAgICAgICAgcmV0dXJuIGNvbCAhPT0gdGhpcy5zY2FsZSAtIDE7XHJcbiAgICAgIGNhc2UgRElSRUNUSU9OLkRPV046XHJcbiAgICAgICAgcmV0dXJuIHJvdyAhPT0gdGhpcy5zY2FsZSAtIDE7XHJcbiAgICAgIGNhc2UgRElSRUNUSU9OLkxFRlQ6XHJcbiAgICAgICAgcmV0dXJuIGNvbCAhPT0gMDtcclxuICAgICAgZGVmYXVsdDpcclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiDojrflj5bku47lvZPliY3oioLngrnotbDliLDkuIvkuIDkuKroioLngrnnmoTku6Pku7dcclxuICAgKi9cclxuICBnZXRDb3N0VG9OZXh0KCl7XHJcbiAgICByZXR1cm4gMTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIOiuvue9ruiKgueCueeahCBGIOWAvO+8jOWghuS8muagueaNrui/meS4quWAvOi/m+ihjOaOkuW6j1xyXG4gICAqL1xyXG4gIHNldEYoIHZhbHVlOiBudW1iZXIgKXtcclxuICAgIHRoaXMuRiA9IHZhbHVlO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICog6I635Y+W6IqC54K555qEIEcg5YC8XHJcbiAgICovXHJcbiAgZ2V0Rygpe1xyXG4gICAgcmV0dXJuIHRoaXMuRztcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIOiuvue9ruiKgueCueeahCBHIOWAvFxyXG4gICAqL1xyXG4gIHNldEcoIHZhbHVlOiBudW1iZXIgKXtcclxuICAgIHRoaXMuRyA9IHZhbHVlO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICog6I635Y+W6IqC54K555qEIEgg5YC8XHJcbiAgICovXHJcbiAgZ2V0SCggdGFyZ2V0Tm9kZTogTm9kZSApe1xyXG4gICAgbGV0IGkgPSAwLFxyXG4gICAgICAgIGxlbiA9IHRoaXMudmFsdWUubGVuZ3RoLFxyXG4gICAgICAgIG1hbmhhdHRlbiA9IDAsXHJcbiAgICAgICAgZGlmZiA9IDA7XHJcblxyXG4gICAgZm9yICggOyBpIDwgbGVuOyBpICsrICl7XHJcbiAgICAgIGlmICggdGhpcy52YWx1ZVtpXSAhPT0gaSArIDEgKSBkaWZmICsrO1xyXG5cclxuICAgICAgbGV0IHYgPSB0aGlzLnZhbHVlW2ldO1xyXG4gICAgICBpZiggdiAhPT0gMCApe1xyXG4gICAgICAgIC8vIG5vdyBpblxyXG4gICAgICAgIGxldCByb3cgPSBNYXRoLmZsb29yKCBpL3RoaXMuc2NhbGUgKTtcclxuICAgICAgICBsZXQgY29sID0gaSV0aGlzLnNjYWxlO1xyXG4gICAgICAgIC8vIHNob3VsZCBpblxyXG4gICAgICAgIGxldCBfcm93ID0gTWF0aC5mbG9vciggdi90aGlzLnNjYWxlICk7XHJcbiAgICAgICAgbGV0IF9jb2wgPSB2JXRoaXMuc2NhbGU7XHJcblxyXG4gICAgICAgIG1hbmhhdHRlbiArPSBNYXRoLmFicyggcm93IC0gX3JvdyApICsgTWF0aC5hYnMoIGNvbCAtIF9jb2wgKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiAxKm1hbmhhdHRlbiArIDEwMCpkaWZmO1xyXG4gIH1cclxuXHJcbiAgLy8gcHJpdmF0ZSBmdW5jdGlvblxyXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS1cclxuXHJcbiAgLyoqXHJcbiAgICog5qC55o2u57u05bqmIHNjYWxlIOaehOmAoOiKgueCueeahOWIneWni+ihqOekuuaVsOe7hFxyXG4gICAqL1xyXG4gIHByaXZhdGUgaW5pdE5vZGVWYWx1ZUJ5U2NhbGUoIHNjYWxlOiBudW1iZXIgKXtcclxuICAgIGxldCB2YWwgPSBbXTtcclxuICAgIGZvciAoIGxldCBpID0gMTsgaSA8IE1hdGgucG93KHNjYWxlLCAyKTsgaSArKyApe1xyXG4gICAgICB2YWwucHVzaCggaSApO1xyXG4gICAgfVxyXG4gICAgdmFsLnB1c2goIDAgKTtcclxuICAgIHJldHVybiB2YWw7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiDojrflj5blvZPliY3oioLngrnkuK3lpITkuo4gMCDkvY3nmoTmlrnlkJEgZGlyZWN0aW9uIOWkhOeahOmCu+aOpeaVsOWtl+eahOS4i+agh1xyXG4gICAqL1xyXG4gIHByaXZhdGUgZ2V0VGFyZ2V0SW5kZXgoIGRpcmVjdGlvbjogbnVtYmVyICl7XHJcbiAgICBpZiAoICF0aGlzLmNhbk1vdmVUbyggZGlyZWN0aW9uICkgKSByZXR1cm47XHJcbiAgICBsZXQgdGFyZ2V0SW5kZXg7XHJcbiAgICBzd2l0Y2goIGRpcmVjdGlvbiApe1xyXG4gICAgICBjYXNlIERJUkVDVElPTi5VUDpcclxuICAgICAgICB0YXJnZXRJbmRleCA9IHRoaXMuemVyb0luZGV4IC0gdGhpcy5zY2FsZTtcclxuICAgICAgICBicmVhaztcclxuICAgICAgY2FzZSBESVJFQ1RJT04uUklHSFQ6XHJcbiAgICAgICAgdGFyZ2V0SW5kZXggPSB0aGlzLnplcm9JbmRleCArIDE7XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIGNhc2UgRElSRUNUSU9OLkRPV046XHJcbiAgICAgICAgdGFyZ2V0SW5kZXggPSB0aGlzLnplcm9JbmRleCArIHRoaXMuc2NhbGU7XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIGNhc2UgRElSRUNUSU9OLkxFRlQ6XHJcbiAgICAgICAgdGFyZ2V0SW5kZXggPSB0aGlzLnplcm9JbmRleCAtIDE7XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgdGFyZ2V0SW5kZXggPSB0aGlzLnplcm9JbmRleDtcclxuICAgIH1cclxuICAgIHJldHVybiB0YXJnZXRJbmRleDtcclxuICB9XHJcblxyXG4gIC8vIHN0YXRpYyBmdW5jdGlvblxyXG4gIC8vIC0tLS0tLS0tLS0tLS0tLVxyXG5cclxuICAvKipcclxuICAgKiDliKTmlq3kuKTkuKroioLngrnmmK/lkKbnm7jnrYlcclxuICAgKiDpgJrov4flsIboioLngrnnmoTmlbDnu4TooajnpLrovazmjaLmiJDlrZfnrKbkuLLmnaXov5vooYzmr5TovoNcclxuICAgKi9cclxuICBzdGF0aWMgaXNTYW1lKCBjdXJyZW50Tm9kZTogTm9kZSwgdGFyZ2V0Tm9kZTogTm9kZSApe1xyXG4gICAgcmV0dXJuIGN1cnJlbnROb2RlLmdldFZhbFN0cigpID09PSB0YXJnZXROb2RlLmdldFZhbFN0cigpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICog5Z+65LqOIG5vZGUg5aSN5Yi25LiA5Liq5paw55qE6IqC54K5XHJcbiAgICovXHJcbiAgc3RhdGljIG5vZGVDbG9uZSggbm9kZTogTm9kZSApe1xyXG4gICAgbGV0IG5ld05vZGUgPSBuZXcgTm9kZSggbm9kZS5zY2FsZSApO1xyXG4gICAgbmV3Tm9kZS52YWx1ZSA9IG5vZGUudmFsdWUuc2xpY2UoMCk7XHJcbiAgICBuZXdOb2RlLnplcm9JbmRleCA9IG5vZGUuemVyb0luZGV4O1xyXG4gICAgcmV0dXJuIG5ld05vZGU7XHJcbiAgfVxyXG59XHJcbiIsImV4cG9ydCBlbnVtIERJUkVDVElPTiAgeyBVUCA9IDEsIFJJR0hULCBET1dOLCBMRUZUIH1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgYmVsb25nVG97XHJcbiAgICBbcHJvcE5hbWU6IHN0cmluZ106IG51bWJlcjtcclxufTtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiAkaWQoZWxlSWQ6IHN0cmluZyl7XHJcbiAgcmV0dXJuIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCBlbGVJZCApO1xyXG59O1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uICRjcmVhdGVFbGUoIHRhZ05hbWU6IHN0cmluZywgaWQ/OiBzdHJpbmcsIGNsYXNzTmFtZT86IHN0cmluZyApe1xyXG4gIGxldCBlbGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCB0YWdOYW1lICk7XHJcbiAgaWYoIGlkICkgZWxlLmlkID0gaWQ7XHJcbiAgaWYoIGNsYXNzTmFtZSApIGVsZS5jbGFzc05hbWUgPSBjbGFzc05hbWU7XHJcbiAgcmV0dXJuIGVsZTtcclxufTtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiAkcmVwbGFjZUNsYXNzKCBjbGFzc05hbWU6IHN0cmluZywgbmV3Q2xhc3M6IHN0cmluZywgcHJlZml4OiBzdHJpbmcgICl7XHJcbiAgbGV0IHJlc3VsdCA9IFwiXCI7XHJcbiAgbGV0IGNsYXNzQXJyID0gY2xhc3NOYW1lLnNwbGl0KCBcIiBcIiApO1xyXG4gIGZvciAoIGxldCBpID0gMCwgbGVuID0gY2xhc3NBcnIubGVuZ3RoOyBpIDwgbGVuOyBpICsrICl7XHJcbiAgICBsZXQgaW5kZXggPSBjbGFzc0FycltpXS5pbmRleE9mKCBgJHtwcmVmaXh9LWAgKTtcclxuICAgIGlmICggaW5kZXggIT09IC0xICl7XHJcbiAgICAgIGNsYXNzQXJyW2ldID0gbmV3Q2xhc3M7XHJcbiAgICB9XHJcbiAgICByZXN1bHQgKz0gYCR7Y2xhc3NBcnJbaV19IGA7XHJcbiAgfVxyXG4gIHJldHVybiByZXN1bHQudHJpbSgpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gJGFkZENsYXNzKCBjbGFzc05hbWU6IHN0cmluZywgbmV3Q2xhc3M6IHN0cmluZyApe1xyXG5cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uICRyZW1vdmVDbGFzcyggY2xhc3NOYW1lOiBzdHJpbmcsIG5ld0NsYXNzOiBzdHJpbmcgKXtcclxuICBcclxufSJdfQ==
