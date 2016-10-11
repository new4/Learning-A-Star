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
        // 缓存所有的图片片段 dom，免得再找
        this.imgElements = [];
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
        this.setStatusByNode(this.currentNode);
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
                var runId_1 = setInterval(function () {
                    if (i_1 === -1) {
                        clearInterval(runId_1);
                        game.win();
                    }
                    else {
                        game.currentNode = solution_1[i_1];
                        game.setStatusByNode(solution_1[i_1]);
                        i_1--;
                    }
                }, 100);
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
     * 拼图游戏的图片显示部分的初始化
     */
    Game.prototype.initImage = function () {
        var game = this;
        // 节点的数组表示中的每一个数组的项对应一个格子
        for (var i = Math.pow(game.scale, 2) - 1; i > -1; i--) {
            // 样式 item-* 规定某一格子对应的图片片段，这部分初始化后不再改变
            // 样式 pos-* 规定某一格子在 #image 容器中的位置，这部分随着节点变化而改变
            var ele = util_1.$createEle('div', undefined, "item item-" + i + " pos-" + i);
            ele.addEventListener('click', function (e) { game.imgFragmentHandler(e); });
            // 初始化的时调整空白格部分( 样式为： .item.item-0.pos-0 )的位置
            // 同时将图片片段的 dom 缓存
            if (i === 0) {
                game.imgContainer.appendChild(ele);
                game.imgElements.push(ele);
                game.blankImgEle = ele;
            }
            else {
                game.imgContainer.insertBefore(ele, game.imgContainer.firstChild);
                game.imgElements.unshift(ele);
            }
        }
        game.gameContainer.appendChild(game.imgContainer);
    };
    /**
     * 拼图的按钮操作部分的初始化
     */
    Game.prototype.initOperation = function () {
        var game = this;
        // 两个按钮 MIX 和 START
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
     * 根据节点的数组表示来设置图片片段的位置
     */
    Game.prototype.setStatusByNode = function (node) {
        // let imgElements = this.imgContainer.getElementsByClassName("item");
        for (var k = 0, len = node.value.length; k < len; k++) {
            var pos = (k === len - 1) ? 0 : k + 1;
            ;
            var v = (node.value[k] === 0) ? len : node.value[k];
            util_1.$replaceClass(this.imgElements[v - 1], "pos-" + pos, 'pos');
        }
    };
    /**
     * 图片块上的 click 事件处理函数，用来移动图片块
     */
    Game.prototype.imgFragmentHandler = function (e) {
        var imgId = util_1.$getImgId(e.target.className);
        var nonZeroDir = this.currentNode.getNonZeroDirection();
        if (nonZeroDir[imgId]) {
            var direction = util_1.DIRECTION[("" + nonZeroDir[imgId])];
            this.currentNode.moveTo(direction);
            util_1.$exchange(this.blankImgEle, e.target);
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
// LET DIRECTION = [ 'NONE', 'UP', 'RIGHT', 'DOWN', 'LEFT' ];
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
function $replaceClass(ele, newClass, prefix) {
    var reg = new RegExp(prefix + "-(\\d)+", 'g');
    ele.className = ele.className.replace(reg, newClass);
}
exports.$replaceClass = $replaceClass;
function $addClass(ele, newClass) {
    if (ele.className.indexOf(newClass) === -1) {
        ele.className = ele.className + " " + newClass;
    }
}
exports.$addClass = $addClass;
function $removeClass(ele, remove) {
    ele.className = ele.className.replace(remove, '').trim();
}
exports.$removeClass = $removeClass;
function $getPos(className) {
    var classArr = className.split(' ');
    for (var i = 0, len = classArr.length; i < len; i++) {
        if (classArr[i].indexOf('pos') !== -1) {
            return classArr[i].split('-')[1];
        }
    }
}
exports.$getPos = $getPos;
function $getImgId(className) {
    var classArr = className.split(' ');
    for (var i = 0, len = classArr.length; i < len; i++) {
        if (classArr[i].indexOf('item-') !== -1) {
            return classArr[i].split('-')[1];
        }
    }
}
exports.$getImgId = $getImgId;
function $exchange(item1, item2) {
    var pos1 = $getPos(item1.className);
    var pos2 = $getPos(item2.className);
    $removeClass(item2, "pos-" + pos2);
    $addClass(item2, "pos-" + pos1);
    $removeClass(item1, "pos-" + pos1);
    $addClass(item1, "pos-" + pos2);
}
exports.$exchange = $exchange;
},{}]},{},[4])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvdHMvYXN0YXIudHMiLCJzcmMvdHMvZ2FtZS50cyIsInNyYy90cy9oZWFwLnRzIiwic3JjL3RzL21haW4udHMiLCJzcmMvdHMvbm9kZS50cyIsInNyYy90cy91dGlsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOztBQ0FBLHFCQUFpQixRQUFRLENBQUMsQ0FBQTtBQUMxQixxQkFBaUIsUUFBUSxDQUFDLENBQUE7QUFHMUI7O0dBRUc7QUFDSDtJQVNFLGVBQWEsU0FBZSxFQUFFLFVBQWdCO1FBUDlDLGVBQVUsR0FBVyxFQUFFLENBQUE7UUFJZixpQkFBWSxHQUFhLEVBQUUsQ0FBQTtRQUMzQixhQUFRLEdBQVcsRUFBRSxDQUFBO1FBRzNCLElBQUksQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFDO1FBQzNCLElBQUksQ0FBQyxVQUFVLEdBQUcsVUFBVSxDQUFDO1FBQzdCLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxjQUFJLENBQUUsQ0FBRSxTQUFTLENBQUUsRUFBRSxHQUFHLENBQUUsQ0FBQztJQUNqRCxDQUFDO0lBRUQsa0JBQWtCO0lBQ2xCLGtCQUFrQjtJQUVsQjs7T0FFRztJQUNILG1CQUFHLEdBQUg7UUFDRSxPQUFPLENBQUMsSUFBSSxDQUFFLGFBQWEsQ0FBRSxDQUFDO1FBRTlCLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQztRQUNqQjtZQUNFLElBQUksV0FBVyxHQUFHLEtBQUssQ0FBQyxRQUFRLENBQUMsR0FBRyxFQUFFLENBQUM7WUFDdkMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUUsV0FBVyxDQUFFLENBQUM7WUFDckMsS0FBSyxDQUFDLFlBQVksQ0FBRSxXQUFXLENBQUMsU0FBUyxFQUFFLENBQUUsR0FBRyxDQUFDLENBQUM7WUFFbEQsSUFBSSxTQUFTLEdBQUcsV0FBVyxDQUFDLFlBQVksRUFBRSxDQUFDO1lBRTNDLFNBQVMsQ0FBQyxPQUFP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bnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJpbXBvcnQgTm9kZSBmcm9tICcuL25vZGUnO1xyXG5pbXBvcnQgSGVhcCBmcm9tICcuL2hlYXAnO1xyXG5pbXBvcnQgeyBiZWxvbmdUbyB9IGZyb20gJy4vdXRpbCc7XHJcblxyXG4vKipcclxuICogQSog566X5rOVXHJcbiAqL1xyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBBc3RhcntcclxuICBvcGVuTGlzdDogSGVhcFxyXG4gIGNsb3NlZExpc3Q6IE5vZGVbXSA9IFtdXHJcbiAgc3RhcnROb2RlOiBOb2RlXHJcbiAgdGFyZ2V0Tm9kZTogTm9kZVxyXG5cclxuICBwcml2YXRlIGJfY2xvc2VkTGlzdDogYmVsb25nVG8gPSB7fVxyXG4gIHByaXZhdGUgc29sdXRpb246IE5vZGVbXSA9IFtdXHJcblxyXG4gIGNvbnN0cnVjdG9yKCBzdGFydE5vZGU6IE5vZGUsIHRhcmdldE5vZGU6IE5vZGUgKXtcclxuICAgIHRoaXMuc3RhcnROb2RlID0gc3RhcnROb2RlO1xyXG4gICAgdGhpcy50YXJnZXROb2RlID0gdGFyZ2V0Tm9kZTtcclxuICAgIHRoaXMub3Blbkxpc3QgPSBuZXcgSGVhcCggWyBzdGFydE5vZGUgXSwgXCJGXCIgKTtcclxuICB9XHJcblxyXG4gIC8vIHB1YmxpYyBmdW5jdGlvblxyXG4gIC8vIC0tLS0tLS0tLS0tLS0tLVxyXG5cclxuICAvKipcclxuICAgKiDov5DooYwgQSog566X5rOVXHJcbiAgICovXHJcbiAgcnVuKCl7XHJcbiAgICBjb25zb2xlLnRpbWUoIFwiQVN0YXIgUnVuICFcIiApO1xyXG5cclxuICAgIGxldCBhc3RhciA9IHRoaXM7XHJcbiAgICB3aGlsZSAoICFOb2RlLmlzU2FtZSggYXN0YXIub3Blbkxpc3QudG9wKCksIGFzdGFyLnRhcmdldE5vZGUgKSApe1xyXG4gICAgICBsZXQgY3VycmVudE5vZGUgPSBhc3Rhci5vcGVuTGlzdC5wb3AoKTtcclxuICAgICAgYXN0YXIuY2xvc2VkTGlzdC5wdXNoKCBjdXJyZW50Tm9kZSApO1xyXG4gICAgICBhc3Rhci5iX2Nsb3NlZExpc3RbIGN1cnJlbnROb2RlLmdldFZhbFN0cigpIF0gPSAxO1xyXG5cclxuICAgICAgbGV0IG5leHROb2RlcyA9IGN1cnJlbnROb2RlLmdldE5leHROb2RlcygpO1xyXG5cclxuICAgICAgbmV4dE5vZGVzLmZvckVhY2goZnVuY3Rpb24obmV4dE5vZGUpe1xyXG4gICAgICAgIGxldCBjb3N0ID0gY3VycmVudE5vZGUuZ2V0RygpICsgY3VycmVudE5vZGUuZ2V0Q29zdFRvTmV4dCgpO1xyXG4gICAgICAgIGxldCBpbmRleCA9ICBhc3Rhci5vcGVuTGlzdC5nZXRJdGVtSW5kZXgoIG5leHROb2RlICk7XHJcblxyXG4gICAgICAgIGlmICggaW5kZXggIT09IHVuZGVmaW5lZCAmJiBjb3N0IDwgbmV4dE5vZGUuZ2V0RygpICl7XHJcbiAgICAgICAgICBjb25zb2xlLmxvZyggXCJuZXh0IDFcIiApO1xyXG4gICAgICAgICAgYXN0YXIub3Blbkxpc3QucmVtb3ZlKCBpbmRleCApO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKCBhc3Rhci5pc0JlbG9uZ1RvQ2xvc2VkKCBuZXh0Tm9kZSApICYmIGNvc3QgPCBuZXh0Tm9kZS5nZXRHKCkgKXtcclxuICAgICAgICAgIGNvbnNvbGUubG9nKCBcIm5leHQgMlwiICk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoIGluZGV4ID09PSB1bmRlZmluZWQgJiYgIWFzdGFyLmlzQmVsb25nVG9DbG9zZWQoIG5leHROb2RlICkgKXtcclxuICAgICAgICAgIGNvbnNvbGUubG9nKCBcIm5leHQgM1wiICk7XHJcbiAgICAgICAgICBuZXh0Tm9kZS5zZXRHKCBjb3N0ICk7XHJcbiAgICAgICAgICBuZXh0Tm9kZS5zZXRGKCBuZXh0Tm9kZS5nZXRHKCkgKyBuZXh0Tm9kZS5nZXRIKCBhc3Rhci50YXJnZXROb2RlICkgKTtcclxuICAgICAgICAgIGFzdGFyLm9wZW5MaXN0LnB1c2goIG5leHROb2RlICk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgIH1cclxuICAgIGNvbnNvbGUudGltZUVuZCggXCJBU3RhciBSdW4gIVwiICk7XHJcblxyXG4gICAgY29uc29sZS5sb2coIFwiIGFzdGFyIC0gXCIsIGFzdGFyICk7XHJcblxyXG4gICAgbGV0IHRhaWxOb2RlID0gYXN0YXIub3Blbkxpc3QudG9wKCk7XHJcbiAgICB0aGlzLnNvbHV0aW9uID0gW107XHJcbiAgICB3aGlsZSggdGFpbE5vZGUgKXtcclxuICAgICAgdGhpcy5zb2x1dGlvbi5wdXNoKCB0YWlsTm9kZSApO1xyXG4gICAgICB0YWlsTm9kZSA9IHRhaWxOb2RlLnBhcmVudDtcclxuICAgIH1cclxuXHJcbiAgICAvLyB0aGlzLnNob3dTb2x1dGlvbigpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICog6I635Y+W6Kej5Yaz5pa55qGI5pWw57uEXHJcbiAgICovXHJcbiAgZ2V0U29sdXRpb24oKXtcclxuICAgIHJldHVybiB0aGlzLnNvbHV0aW9uO1xyXG4gIH1cclxuXHJcbiAgLy8gcHJpdmF0ZSBmdW5jdGlvblxyXG4gIC8vIC0tLS0tLS0tLS0tLS0tLVxyXG5cclxuICAvKipcclxuICAgKiDliKTmlq3oioLngrnmmK/lkKblnKggQ0xPU0VEIOS4rVxyXG4gICAqL1xyXG4gIHByaXZhdGUgaXNCZWxvbmdUb0Nsb3NlZCggbm9kZTogTm9kZSApe1xyXG4gICAgbGV0IHN0ciA9IG5vZGUuZ2V0VmFsU3RyKCk7XHJcbiAgICByZXR1cm4gISF0aGlzLmJfY2xvc2VkTGlzdFtzdHJdO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICog5pi+56S66Kej5Yaz5pa55qGI55qE5YW35L2T5q2l6aqkXHJcbiAgICovXHJcbiAgcHJpdmF0ZSBzaG93U29sdXRpb24oKXtcclxuICAgIGxldCBsZW4gPSB0aGlzLnNvbHV0aW9uLmxlbmd0aCxcclxuICAgICAgICBpID0gbGVuIC0gMSxcclxuICAgICAgICBzY2FsZSA9IHRoaXMudGFyZ2V0Tm9kZS5zY2FsZTtcclxuICAgIGZvciAoIDsgaSA+IC0xOyBpIC0tICl7XHJcbiAgICAgIGNvbnNvbGUubG9nKCBgU3RlcCAkeyBsZW4gLSBpIH06IGAgKTtcclxuICAgICAgbGV0IGl0ZW0gPSB0aGlzLnNvbHV0aW9uW2ldLmdldFZhbFN0cigpLnNwbGl0KCcsJyk7XHJcbiAgICAgIGZvciAoIGxldCBqID0gMDsgaiA8IHNjYWxlOyBqICsrICl7XHJcbiAgICAgICAgICBjb25zb2xlLmxvZyggYHwgJHtpdGVtWyBqKnNjYWxlIF19ICR7aXRlbVsgaipzY2FsZSArIDEgXX0gJHtpdGVtWyBqKnNjYWxlICsgMiBdfSB8YCApO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcbiIsImltcG9ydCBOb2RlIGZyb20gXCIuL25vZGVcIjtcclxuaW1wb3J0IEFzdGFyIGZyb20gJy4vYXN0YXInO1xyXG5pbXBvcnQgeyAkaWQsICRjcmVhdGVFbGUsICRyZXBsYWNlQ2xhc3MsICRnZXRQb3MsICRnZXRJbWdJZCwgJGV4Y2hhbmdlLCBESVJFQ1RJT04gfSBmcm9tICcuL3V0aWwnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgR2FtZXtcclxuICBjdXJyZW50Tm9kZTogTm9kZVxyXG4gIHRhcmdldE5vZGU6IE5vZGVcclxuICBzY2FsZTogbnVtYmVyXHJcblxyXG4gIHByaXZhdGUgZ2FtZUNvbnRhaW5lcklkOiBzdHJpbmdcclxuICBwcml2YXRlIGltZ0NvbnRhaW5lcklkOiBzdHJpbmdcclxuICBwcml2YXRlIGFjdGlvbkNvbnRhaW5lcklkOiBzdHJpbmdcclxuXHJcbiAgcHJpdmF0ZSBnYW1lQ29udGFpbmVyXHJcbiAgcHJpdmF0ZSBpbWdDb250YWluZXJcclxuICBwcml2YXRlIGFjdGlvbkNvbnRhaW5lclxyXG5cclxuICAvLyDnvJPlrZjmiYDmnInnmoTlm77niYfniYfmrrUgZG9t77yM5YWN5b6X5YaN5om+XHJcbiAgcHJpdmF0ZSBpbWdFbGVtZW50cyA9IFtdXHJcbiAgLy8g57yT5a2Y56m655m95Zu+54mH54mH5q61IGRvbe+8jOWFjeW+l+WGjeaJvlxyXG4gIHByaXZhdGUgYmxhbmtJbWdFbGVcclxuXHJcbiAgY29uc3RydWN0b3IoIGdhbWVDb250YWluZXJJZDogc3RyaW5nLCBzY2FsZTogbnVtYmVyICl7XHJcbiAgICB0aGlzLmN1cnJlbnROb2RlID0gbmV3IE5vZGUoIHNjYWxlICk7XHJcbiAgICB0aGlzLnRhcmdldE5vZGUgPSBuZXcgTm9kZSggc2NhbGUgKTtcclxuICAgIHRoaXMuc2NhbGUgPSBzY2FsZTtcclxuXHJcbiAgICB0aGlzLmdhbWVDb250YWluZXJJZCA9IGdhbWVDb250YWluZXJJZDtcclxuICAgIHRoaXMuaW1nQ29udGFpbmVySWQgPSBcImltYWdlXCI7XHJcbiAgICB0aGlzLmFjdGlvbkNvbnRhaW5lcklkID0gXCJhY3Rpb25cIjtcclxuXHJcbiAgICB0aGlzLmdhbWVDb250YWluZXIgPSAkaWQoIHRoaXMuZ2FtZUNvbnRhaW5lcklkICk7XHJcbiAgICB0aGlzLmltZ0NvbnRhaW5lciA9ICRjcmVhdGVFbGUoICdkaXYnLCB0aGlzLmltZ0NvbnRhaW5lcklkICk7XHJcbiAgICB0aGlzLmFjdGlvbkNvbnRhaW5lciA9ICRjcmVhdGVFbGUoICdkaXYnLCB0aGlzLmFjdGlvbkNvbnRhaW5lcklkICk7XHJcblxyXG4gICAgdGhpcy5pbml0KCk7XHJcbiAgfVxyXG5cclxuICAvLyBwdWJsaWMgZnVuY3Rpb25cclxuICAvLyAtLS0tLS0tLS0tLS0tLS1cclxuXHJcbiAgLyoqXHJcbiAgICogbWl4IOaMiemSruaJp+ihjOWHveaVsFxyXG4gICAqIOa3t+WQiO+8jOeUsei1t+Wni+iKgueCueS5seW6j+W+l+WIsOS4gOS4quaWsOeahOiKgueCue+8jOW5tuagueaNruaWsOiKgueCueiuvue9rumhtemdouS4reeahOaYvuekuueKtuaAgVxyXG4gICAqL1xyXG4gIG1peCgpe1xyXG4gICAgdGhpcy5jdXJyZW50Tm9kZS5zaHVmZmxlKCk7XHJcbiAgICB0aGlzLnNldFN0YXR1c0J5Tm9kZSggdGhpcy5jdXJyZW50Tm9kZSApO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogc3RhcnQg5oyJ6ZKu5omn6KGM5Ye95pWwXHJcbiAgICog5omn6KGMIEEqIOeul+azlVxyXG4gICAqL1xyXG4gIHN0YXJ0KCl7XHJcbiAgICBsZXQgZ2FtZSA9IHRoaXM7XHJcbiAgICBpZiAoIE5vZGUuaXNTYW1lKCB0aGlzLmN1cnJlbnROb2RlLCB0aGlzLnRhcmdldE5vZGUgKSApe1xyXG4gICAgICB0aGlzLndpbigpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgbGV0IGFzdGFyID0gbmV3IEFzdGFyKCB0aGlzLmN1cnJlbnROb2RlLCB0aGlzLnRhcmdldE5vZGUgKTtcclxuICAgICAgYXN0YXIucnVuKCk7XHJcblxyXG4gICAgICBsZXQgc29sdXRpb24gPSBhc3Rhci5nZXRTb2x1dGlvbigpO1xyXG4gICAgICBpZiAoIHNvbHV0aW9uLmxlbmd0aCApICB7XHJcbiAgICAgICAgbGV0IGxlbiA9IHNvbHV0aW9uLmxlbmd0aCxcclxuICAgICAgICAgICAgaSA9IGxlbiAtIDE7XHJcblxyXG4gICAgICAgIGxldCBydW5JZCA9IHNldEludGVydmFsKCBmdW5jdGlvbigpe1xyXG4gICAgICAgICAgaWYgKCBpID09PSAtMSApe1xyXG4gICAgICAgICAgICBjbGVhckludGVydmFsKCBydW5JZCApO1xyXG4gICAgICAgICAgICBnYW1lLndpbigpO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgZ2FtZS5jdXJyZW50Tm9kZSA9IHNvbHV0aW9uW2ldO1xyXG4gICAgICAgICAgICBnYW1lLnNldFN0YXR1c0J5Tm9kZSggc29sdXRpb25baV0gKTtcclxuICAgICAgICAgICAgaS0tO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0sIDEwMCApO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiDotaLlvpfmuLjmiI9cclxuICAgKi9cclxuICB3aW4oKXtcclxuICAgIGNvbnNvbGUubG9nKCBcIndpbiEhIVwiICk7XHJcbiAgfVxyXG5cclxuICAvLyBwcml2YXRlIGZ1bmN0aW9uXHJcbiAgLy8gLS0tLS0tLS0tLS0tLS0tXHJcblxyXG4gIC8qKlxyXG4gICAqIOWIneWni+WMluWHveaVsFxyXG4gICAqL1xyXG4gIHByaXZhdGUgaW5pdCgpe1xyXG4gICAgdGhpcy5pbml0SW1hZ2UoKTtcclxuICAgIHRoaXMuaW5pdE9wZXJhdGlvbigpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICog5ou85Zu+5ri45oiP55qE5Zu+54mH5pi+56S66YOo5YiG55qE5Yid5aeL5YyWXHJcbiAgICovXHJcbiAgcHJpdmF0ZSBpbml0SW1hZ2UoKXtcclxuICAgIGxldCBnYW1lID0gdGhpcztcclxuICAgIC8vIOiKgueCueeahOaVsOe7hOihqOekuuS4reeahOavj+S4gOS4quaVsOe7hOeahOmhueWvueW6lOS4gOS4quagvOWtkFxyXG4gICAgZm9yICggbGV0IGkgPSBNYXRoLnBvdyggZ2FtZS5zY2FsZSwgMikgLSAxOyBpID4gLTE7IGkgLS0gKXtcclxuICAgICAgLy8g5qC35byPIGl0ZW0tKiDop4Tlrprmn5DkuIDmoLzlrZDlr7nlupTnmoTlm77niYfniYfmrrXvvIzov5npg6jliIbliJ3lp4vljJblkI7kuI3lho3mlLnlj5hcclxuICAgICAgLy8g5qC35byPIHBvcy0qIOinhOWumuafkOS4gOagvOWtkOWcqCAjaW1hZ2Ug5a655Zmo5Lit55qE5L2N572u77yM6L+Z6YOo5YiG6ZqP552A6IqC54K55Y+Y5YyW6ICM5pS55Y+YXHJcbiAgICAgIGxldCBlbGUgPSAkY3JlYXRlRWxlKCAnZGl2JywgdW5kZWZpbmVkLCBgaXRlbSBpdGVtLSR7aX0gcG9zLSR7aX1gICk7XHJcblxyXG4gICAgICBlbGUuYWRkRXZlbnRMaXN0ZW5lciggJ2NsaWNrJywgZnVuY3Rpb24oZSl7IGdhbWUuaW1nRnJhZ21lbnRIYW5kbGVyKGUpIH0gKTtcclxuXHJcbiAgICAgIC8vIOWIneWni+WMlueahOaXtuiwg+aVtOepuueZveagvOmDqOWIhigg5qC35byP5Li677yaIC5pdGVtLml0ZW0tMC5wb3MtMCAp55qE5L2N572uXHJcbiAgICAgIC8vIOWQjOaXtuWwhuWbvueJh+eJh+auteeahCBkb20g57yT5a2YXHJcbiAgICAgIGlmICggaSA9PT0gMCApe1xyXG4gICAgICAgIGdhbWUuaW1nQ29udGFpbmVyLmFwcGVuZENoaWxkKCBlbGUgKTtcclxuICAgICAgICBnYW1lLmltZ0VsZW1lbnRzLnB1c2goIGVsZSApO1xyXG4gICAgICAgIGdhbWUuYmxhbmtJbWdFbGUgPSBlbGU7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgZ2FtZS5pbWdDb250YWluZXIuaW5zZXJ0QmVmb3JlKCBlbGUsIGdhbWUuaW1nQ29udGFpbmVyLmZpcnN0Q2hpbGQgKTtcclxuICAgICAgICBnYW1lLmltZ0VsZW1lbnRzLnVuc2hpZnQoIGVsZSApO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICBnYW1lLmdhbWVDb250YWluZXIuYXBwZW5kQ2hpbGQoIGdhbWUuaW1nQ29udGFpbmVyICk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiDmi7zlm77nmoTmjInpkq7mk43kvZzpg6jliIbnmoTliJ3lp4vljJZcclxuICAgKi9cclxuICBwcml2YXRlIGluaXRPcGVyYXRpb24oKXtcclxuICAgIGxldCBnYW1lID0gdGhpcztcclxuXHJcbiAgICAvLyDkuKTkuKrmjInpkq4gTUlYIOWSjCBTVEFSVFxyXG4gICAgW1wiTUlYXCIsIFwiU1RBUlRcIl0uZm9yRWFjaCggZnVuY3Rpb24oaXRlbSwgaW5kZXgsIGFycmF5KXtcclxuICAgICAgbGV0IGVsZSA9ICRjcmVhdGVFbGUoICdidXR0b24nLCB1bmRlZmluZWQsIGBidG4gYnRuLSR7aXRlbS50b0xvd2VyQ2FzZSgpfWAgKTtcclxuICAgICAgZWxlLmlubmVySFRNTCA9IGl0ZW07XHJcbiAgICAgIHN3aXRjaCggaXRlbSApe1xyXG4gICAgICAgIGNhc2UgJ01JWCc6XHJcbiAgICAgICAgICBlbGUuYWRkRXZlbnRMaXN0ZW5lciggJ2NsaWNrJywgZ2FtZS5taXguYmluZCggZ2FtZSApICk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlICdTVEFSVCc6XHJcbiAgICAgICAgICBlbGUuYWRkRXZlbnRMaXN0ZW5lciggJ2NsaWNrJywgZ2FtZS5zdGFydC5iaW5kKCBnYW1lICkgKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICB9XHJcbiAgICAgIGdhbWUuYWN0aW9uQ29udGFpbmVyLmFwcGVuZENoaWxkKCBlbGUgKTtcclxuICAgIH0pO1xyXG4gICAgZ2FtZS5nYW1lQ29udGFpbmVyLmFwcGVuZENoaWxkKCBnYW1lLmFjdGlvbkNvbnRhaW5lciApO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICog5qC55o2u6IqC54K555qE5pWw57uE6KGo56S65p2l6K6+572u5Zu+54mH54mH5q6155qE5L2N572uXHJcbiAgICovXHJcbiAgcHJpdmF0ZSBzZXRTdGF0dXNCeU5vZGUoIG5vZGU6IE5vZGUgKXtcclxuICAgIC8vIGxldCBpbWdFbGVtZW50cyA9IHRoaXMuaW1nQ29udGFpbmVyLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJpdGVtXCIpO1xyXG4gICAgZm9yICggbGV0IGsgPSAwLCBsZW4gPSBub2RlLnZhbHVlLmxlbmd0aDsgayA8IGxlbjsgayArKyApe1xyXG4gICAgICBsZXQgcG9zID0gKCBrID09PSBsZW4gLSAxICkgPyAwIDogayArIDE7O1xyXG4gICAgICBsZXQgdiA9ICggbm9kZS52YWx1ZVtrXSA9PT0gMCApID8gbGVuIDogbm9kZS52YWx1ZVtrXTtcclxuICAgICAgJHJlcGxhY2VDbGFzcyggdGhpcy5pbWdFbGVtZW50c1t2IC0gMV0sIGBwb3MtJHtwb3N9YCwgJ3BvcycgKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIOWbvueJh+Wdl+S4iueahCBjbGljayDkuovku7blpITnkIblh73mlbDvvIznlKjmnaXnp7vliqjlm77niYflnZdcclxuICAgKi9cclxuICBwcml2YXRlIGltZ0ZyYWdtZW50SGFuZGxlcihlKXtcclxuICAgIGxldCBpbWdJZCA9ICRnZXRJbWdJZCggZS50YXJnZXQuY2xhc3NOYW1lICk7XHJcbiAgICBsZXQgbm9uWmVyb0RpciA9IHRoaXMuY3VycmVudE5vZGUuZ2V0Tm9uWmVyb0RpcmVjdGlvbigpO1xyXG4gICAgaWYgKCBub25aZXJvRGlyW2ltZ0lkXSApe1xyXG4gICAgICBsZXQgZGlyZWN0aW9uID0gRElSRUNUSU9OWyBgJHtub25aZXJvRGlyWyBpbWdJZCBdfWAgXTtcclxuICAgICAgdGhpcy5jdXJyZW50Tm9kZS5tb3ZlVG8oIGRpcmVjdGlvbiApO1xyXG4gICAgICAkZXhjaGFuZ2UoIHRoaXMuYmxhbmtJbWdFbGUsIGUudGFyZ2V0ICk7XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcbiIsImltcG9ydCBOb2RlIGZyb20gJy4vbm9kZSc7XHJcbmltcG9ydCB7IGJlbG9uZ1RvIH0gZnJvbSAnLi91dGlsJztcclxuLy8gSGVhcCBPbiBUb3BcclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgSGVhcHtcclxuICBoZWFwOiBOb2RlW10gPSBbXVxyXG4gIGJfaGVhcDogYmVsb25nVG8gPSB7fVxyXG4gIGtleTogc3RyaW5nXHJcbiAgY29uc3RydWN0b3IoIG5vZGVMaXN0OiBOb2RlW10sIGtleTogc3RyaW5nICl7XHJcbiAgICB0aGlzLmtleSA9IGtleTtcclxuICAgIC8vIOeUqOS+neasoeaPkuWFpeeahOaWueW8j+aehOmAoOWIneWni+eahOWwj+mhtuWghlxyXG4gICAgbGV0IGkgPSAwLFxyXG4gICAgICAgIGxlbiA9IG5vZGVMaXN0Lmxlbmd0aDtcclxuICAgIGZvciAoIDsgaSA8IGxlbjsgaSArKyApe1xyXG4gICAgICB0aGlzLnB1c2goIG5vZGVMaXN0W2ldICk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvLyBwdWJsaWMgZnVuY3Rpb25cclxuICAvLyAtLS0tLS0tLS0tLS0tLS1cclxuXHJcbiAgLyoqXHJcbiAgICog6I635Y+W5aCG5Lit5LiL5qCH5Li6IGluZGV4IOeahOWAvFxyXG4gICAqL1xyXG4gIGdldCggaW5kZXg6IG51bWJlciApe1xyXG4gICAgaWYgKCBpbmRleCA+PSAwICYmIGluZGV4IDwgdGhpcy5oZWFwLmxlbmd0aCApe1xyXG4gICAgICByZXR1cm4gdGhpcy5oZWFwWyBpbmRleCBdWyB0aGlzLmtleSBdO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICog5ZCR5aCG5Lit5o+S5YWl5LiA5Liq5paw55qE5YWD57Sg5bm26LCD5pW05aCGXHJcbiAgICog5paw5YWD57Sg5LuO5pWw57uE5bC+6YOo5o+S5YWl77yM54S25ZCO5a+55paw5YWD57Sg5omn6KGM5LiK5rWu6LCD5pW0XHJcbiAgICovXHJcbiAgcHVzaCggbm9kZTogTm9kZSApe1xyXG4gICAgdGhpcy5oZWFwLnB1c2goIG5vZGUgKTtcclxuICAgIHRoaXMuc2V0QkhlYXAoIHRoaXMuaGVhcC5sZW5ndGggLSAxICk7XHJcbiAgICB0aGlzLmdvVXAoIHRoaXMuaGVhcC5sZW5ndGggLSAxICk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiDliKDpmaTlubbov5Tlm57loIbpobblhYPntKDlubbosIPmlbTloIZcclxuICAgKiDlhYjlsIbloIbpobblhYPntKDkuI7mlbDnu4TmnKvlsL7lhYPntKDkupLmjaLvvIznhLblkI7lvLnlh7rmlbDnu4TmnKvlsL7nmoTlhYPntKDvvIzmnIDlkI7lr7nloIbpobblhYPntKDmiafooYzkuIvmsonmk43kvZxcclxuICAgKi9cclxuICBwb3AoKXtcclxuICAgIGlmICggdGhpcy5pc0VtcHR5KCkgKSByZXR1cm47XHJcbiAgICBsZXQgcmVzdWx0O1xyXG4gICAgdGhpcy5zd2FwKCAwLCB0aGlzLmhlYXAubGVuZ3RoIC0gMSApO1xyXG4gICAgcmVzdWx0ID0gdGhpcy5oZWFwLnBvcCgpO1xyXG4gICAgdGhpcy5yZW1vdmVCSGVhcCggcmVzdWx0LmdldFZhbFN0cigpICk7XHJcbiAgICAhdGhpcy5pc0VtcHR5KCkgJiYgdGhpcy5nb0Rvd24oMCk7XHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICog56e76Zmk5aCG5Lit5LiL5qCH5Li6IGluZGV4IOeahOWFg+e0oFxyXG4gICAqIOWwhumcgOenu+mZpOeahOmhueS4juWghumhtuS6kuaNou+8jOeEtuWQjuW8ueWHuuWghumhtu+8jOacgOWQjuWvueS6kuaNoumhue+8iOWOn+Wghumhtu+8ieaJp+ihjOS4iua1ruaTjeS9nFxyXG4gICAqL1xyXG4gIHJlbW92ZSggaW5kZXg6IG51bWJlciApe1xyXG4gICAgaWYoIGluZGV4IDwgMCB8fCBpbmRleCA+PSB0aGlzLmhlYXAubGVuZ3RoICkgcmV0dXJuO1xyXG4gICAgdGhpcy5zd2FwKCAwLCBpbmRleCApO1xyXG4gICAgdGhpcy5wb3AoKTtcclxuICAgIHRoaXMuZ29VcCggaW5kZXggKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIOiOt+WPluWghumhtuWFg+e0oFxyXG4gICAqL1xyXG4gIHRvcCgpe1xyXG4gICAgcmV0dXJuIHRoaXMuaGVhcC5sZW5ndGggJiYgdGhpcy5oZWFwWzBdO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICog5Yik5pat5aCG5piv5ZCm5Li656m6XHJcbiAgICovXHJcbiAgaXNFbXB0eSgpe1xyXG4gICAgcmV0dXJuICF0aGlzLmhlYXAubGVuZ3RoO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICog5Yik5pat5aCG5Lit5piv5ZCm5pyJ5YWD57SgIG5vZGVcclxuICAgKi9cclxuICBnZXRJdGVtSW5kZXgoIG5vZGU6IE5vZGUgKXtcclxuICAgIHJldHVybiB0aGlzLmJfaGVhcFsgbm9kZS5nZXRWYWxTdHIoKSBdO1xyXG4gIH1cclxuXHJcbiAgLy8gcHJpdmF0ZSBmdW5jdGlvblxyXG4gIC8vIC0tLS0tLS0tLS0tLS0tLVxyXG5cclxuICAvKipcclxuICAgKiDov5Tlm57loIbkuK3kuIvmoIfkuLogaW5kZXgg55qE5YWD57SgXHJcbiAgICovXHJcbiAgcHJpdmF0ZSBnZXRWYWx1ZSggaW5kZXg6IG51bWJlciApe1xyXG4gICAgaWYoIGluZGV4IDwgMCB8fCBpbmRleCA+PSB0aGlzLmhlYXAubGVuZ3RoICkgcmV0dXJuO1xyXG4gICAgcmV0dXJuIHRoaXMuaGVhcFtpbmRleF1bdGhpcy5rZXldO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICog5aCG5Lit5LiL5qCH5Li6IGluZGV4IOeahOWFg+e0oOeahOS4iua1ruaTjeS9nFxyXG4gICAqL1xyXG4gIHByaXZhdGUgZ29VcChpbmRleDogbnVtYmVyKXtcclxuICAgIGxldCB2YWx1ZSA9IHRoaXMuZ2V0VmFsdWUoaW5kZXgpLFxyXG4gICAgICAgIHBhcmVudCA9IHRoaXMuZ2V0UGFyZW50SW5kZXgoaW5kZXgpO1xyXG5cclxuICAgIGlmICggcGFyZW50ID09PSB1bmRlZmluZWQgKSByZXR1cm47XHJcblxyXG4gICAgaWYgKCB0aGlzLmdldFZhbHVlKCBwYXJlbnQgKSA+IHRoaXMuZ2V0VmFsdWUoIGluZGV4ICkgKXtcclxuICAgICAgdGhpcy5zd2FwKCBpbmRleCwgcGFyZW50ICk7XHJcbiAgICAgIHRoaXMuZ29VcCggcGFyZW50ICk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiDloIbkuK3kuIvmoIfkuLogaW5kZXgg55qE5YWD57Sg55qE5LiL5rKJ5pON5L2cXHJcbiAgICovXHJcbiAgcHJpdmF0ZSBnb0Rvd24oaW5kZXg6IG51bWJlcil7XHJcbiAgICBsZXQgdmFsdWUgPSB0aGlzLmdldFZhbHVlKGluZGV4KSxcclxuICAgICAgICBbbGVmdCwgcmlnaHRdID0gdGhpcy5nZXRDaGlsZEluZGV4KGluZGV4KSxcclxuICAgICAgICBzd2FwSW5kZXggPSBsZWZ0O1xyXG5cclxuICAgIC8vIOWFg+e0oOaYr+WPtuWtkOiKgueCue+8jOayoeacieWtkOWFg+e0oFxyXG4gICAgaWYgKCBsZWZ0ID09PSBudWxsICkgcmV0dXJuO1xyXG5cclxuICAgIC8vIOiLpeWFg+e0oOacieS4pOS4quWtkOWFg+e0oO+8jOiuvue9riBzd2FwSW5kZXgg5Li66L6D5bCP55qE6YKj5Liq5a2Q5YWD57Sg55qE5LiL5qCHXHJcbiAgICAvLyDoi6XlhYPntKDlj6rmnInlt6blhL/lrZDvvIxzd2FwSW5kZXgg5bey57uP6KKr5Yid5aeL5YyW5Li6IGxlZnQg55qE5YC85LqGXHJcbiAgICBpZiAoIHJpZ2h0ICl7XHJcbiAgICAgIHN3YXBJbmRleCA9IHRoaXMuZ2V0VmFsdWUobGVmdCkgPCB0aGlzLmdldFZhbHVlKHJpZ2h0KSA/IGxlZnQgOiByaWdodDtcclxuICAgIH1cclxuXHJcbiAgICAvLyDmr5TovoPniLblhYPntKDlkozovoPlsI/nmoTpgqPkuKrlrZDlhYPntKDnmoTlgLzvvIzoi6XniLblhYPntKDnmoTlgLzovoPlpKfvvIzliJnnva7mjaLniLblhYPntKDlkozovoPlsI/nmoTlrZDlhYPntKBcclxuICAgIC8vIOeEtuWQjuWcqOaWsOeahOe9ruaNoueahOS9jee9ruWkhOe7p+e7reaJp+ihjOS4i+ayieaTjeS9nFxyXG4gICAgaWYgKCB0aGlzLmdldFZhbHVlKHN3YXBJbmRleCkgPCB2YWx1ZSApIHtcclxuICAgICAgdGhpcy5zd2FwKCBpbmRleCwgc3dhcEluZGV4ICk7XHJcbiAgICAgIHRoaXMuZ29Eb3duKCBzd2FwSW5kZXggKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIOiOt+WPluS4i+agh+S4uiBpbmRleCDnmoTlhYPntKDlnKjloIbkuK3nmoTniLblhYPntKBcclxuICAgKi9cclxuICBwcml2YXRlIGdldFBhcmVudEluZGV4KCBpbmRleDogbnVtYmVyICl7XHJcbiAgICBpZiAoIGluZGV4IDwgMCB8fCBpbmRleCA+PSB0aGlzLmhlYXAubGVuZ3RoICkgcmV0dXJuO1xyXG4gICAgaWYgKCBpbmRleCA9PT0gMCApIHJldHVybiAwO1xyXG4gICAgcmV0dXJuIE1hdGguZmxvb3IoIChpbmRleC0xKS8yICk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiDojrflj5bkuIvmoIfkuLogaW5kZXgg55qE5YWD57Sg5Zyo5aCG5Lit55qE5a2Q5YWD57Sg77yM57y65aSx55qE5a2Q5YWD57Sg55SoIG51bGwg5Luj5pu/XHJcbiAgICovXHJcbiAgcHJpdmF0ZSBnZXRDaGlsZEluZGV4KCBpbmRleDogbnVtYmVyICl7XHJcbiAgICBsZXQgbGVmdCA9IDIqaW5kZXggKyAxLFxyXG4gICAgICAgIHJpZ2h0ID0gMippbmRleCArIDIsXHJcbiAgICAgICAgbGVuZ3RoID0gdGhpcy5oZWFwLmxlbmd0aDtcclxuXHJcbiAgICBpZiAoIHJpZ2h0IDw9IGxlbmd0aCAtIDEgKXtcclxuICAgICAgcmV0dXJuIFsgbGVmdCwgcmlnaHQgXTtcclxuICAgIH0gZWxzZSBpZiAoIGxlZnQgPT09IGxlbmd0aCAtIDEgKSB7XHJcbiAgICAgIHJldHVybiBbIGxlZnQsIG51bGwgXTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHJldHVybiBbIG51bGwsIG51bGwgXTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIOS6pOaNouWghuS4reS4i+agh+WIhuWIq+S4uiBpbmRleDEg5ZKMIGluZGV4MiDnmoTkuKTkuKrlhYPntKBcclxuICAgKi9cclxuICBwcml2YXRlIHN3YXAoIGluZGV4MTogbnVtYmVyLCBpbmRleDI6IG51bWJlciApe1xyXG4gICAgbGV0IHRtcCA9IHRoaXMuaGVhcFtpbmRleDFdO1xyXG4gICAgdGhpcy5oZWFwW2luZGV4MV0gPSB0aGlzLmhlYXBbaW5kZXgyXTtcclxuICAgIHRoaXMuaGVhcFtpbmRleDJdID0gdG1wO1xyXG5cclxuICAgIHRoaXMuc2V0QkhlYXAoIGluZGV4MSApO1xyXG4gICAgdGhpcy5zZXRCSGVhcCggaW5kZXgyICk7XHJcbiAgfVxyXG4gIHByaXZhdGUgc2V0QkhlYXAoIGluZGV4OiBudW1iZXIgKXtcclxuICAgIHRoaXMuYl9oZWFwWyB0aGlzLmhlYXBbIGluZGV4IF0uZ2V0VmFsU3RyKCkgXSA9IGluZGV4O1xyXG4gIH1cclxuICBwcml2YXRlIHJlbW92ZUJIZWFwKCBzdHI6IHN0cmluZyApe1xyXG4gICAgZGVsZXRlIHRoaXMuYl9oZWFwWyBzdHIgXTtcclxuICB9XHJcbn1cclxuIiwiaW1wb3J0IEdhbWUgZnJvbSBcIi4vZ2FtZVwiO1xyXG5sZXQgZ2FtZSA9IG5ldyBHYW1lKCBcImNvbnRhaW5lclwiLCAzICk7XHJcblxyXG5jb25zb2xlLmxvZyggZ2FtZSApO1xyXG5jb25zb2xlLmxvZyggXCItLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cIiApO1xyXG5cclxuLy8gaW1wb3J0IG1pbkhlYXAgZnJvbSAnLi9taW4taGVhcCc7XHJcbi8vXHJcbi8vIGNvbnNvbGUubG9nKCBcIi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVwiICk7XHJcbi8vXHJcbi8vIGxldCBoZWFwID0gbmV3IG1pbkhlYXAoIFsgMywgNSwgNCwgMSwgMiwgMTksIDE4LCAyMiwgMTIsIDddICk7XHJcbi8vXHJcbi8vIGNvbnNvbGUubG9nKCBoZWFwLmhlYXAgKTtcclxuLy9cclxuLy8gLy8gZm9yICggbGV0IGkgPSAwLCBsZW4gPSBoZWFwLmhlYXAubGVuZ3RoOyBpIDwgbGVuOyBpICsrICl7XHJcbi8vIC8vICAgY29uc29sZS5sb2coIGhlYXAucG9wKCkgKTtcclxuLy8gLy8gICBjb25zb2xlLmxvZyggaGVhcC5oZWFwICk7XHJcbi8vIC8vIH1cclxuLy8gLy9cclxuLy8gLy8gY29uc29sZS5sb2coIGhlYXAucG9wKCkgKTtcclxuLy8gLy8gY29uc29sZS5sb2coIGhlYXAuaGVhcCApO1xyXG4iLCJpbXBvcnQgeyBESVJFQ1RJT04gfSBmcm9tICcuL3V0aWwnO1xyXG5cclxuLy8gTEVUIERJUkVDVElPTiA9IFsgJ05PTkUnLCAnVVAnLCAnUklHSFQnLCAnRE9XTicsICdMRUZUJyBdO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTm9kZXtcclxuICB2YWx1ZTogbnVtYmVyW11cclxuICB6ZXJvSW5kZXg6IG51bWJlclxyXG4gIHNjYWxlOiBudW1iZXJcclxuICBwYXJlbnQ6IE5vZGVcclxuICBGOiBudW1iZXIgPSAwXHJcbiAgRzogbnVtYmVyID0gMFxyXG4gIGNvbnN0cnVjdG9yKCBzY2FsZTogbnVtYmVyLCBpbml0QXJyPzogbnVtYmVyW10gKSB7XHJcbiAgICB0aGlzLnNjYWxlID0gc2NhbGU7XHJcbiAgICB0aGlzLnZhbHVlID0gaW5pdEFyciA/IGluaXRBcnIgOiB0aGlzLmluaXROb2RlVmFsdWVCeVNjYWxlKCBzY2FsZSApO1xyXG4gICAgdGhpcy56ZXJvSW5kZXggPSBNYXRoLnBvdyhzY2FsZSwgMikgLSAxO1xyXG5cclxuICAgIC8vIHRoaXMucGFyZW50ID0gbmV3IE5vZGUodGhpcy5zY2FsZSk7XHJcbiAgfVxyXG5cclxuICAvLyBwdWJsaWMgZnVuY3Rpb25cclxuICAvLyAtLS0tLS0tLS0tLS0tLS1cclxuXHJcbiAgLyoqXHJcbiAgICog6I635Y+W6IqC54K555qE5YC877yM5bCG6IqC54K555qE5pWw57uE6KGo56S66L2s5o2i5oiQ5a2X56ym5Liy6KGo56S65bm26L+U5ZueXHJcbiAgICovXHJcbiAgZ2V0VmFsU3RyKCl7XHJcbiAgICByZXR1cm4gdGhpcy52YWx1ZS50b1N0cmluZygpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICog6IqC54K555qE5Lmx5bqP566X5rOVXHJcbiAgICog6ZqP5py65oyH5a6a5LiA5Liq5pa55ZCR77yM5Luk6IqC54K55ZCR6K+l5pa55ZCR56e75Yqo77yM6YeN5aSN5LiK6L+w6L+H56iL6Iul5bmy5qyh6L6+5Yiw5Lmx5bqP55qE55uu55qEXHJcbiAgICovXHJcbiAgc2h1ZmZsZSgpe1xyXG4gICAgZm9yKCBsZXQgaSA9IDA7IGkgPCA1MDAwOyBpICsrICl7XHJcbiAgICAgIGxldCBkaXJlY3Rpb24gPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiA0ICsgMSk7XHJcbiAgICAgIHRoaXMubW92ZVRvKCBkaXJlY3Rpb24gKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIOW9k+WJjeiKgueCueWQkeaWueWQkSBkaXJlY3Rpb24g56e75Yqo5LiA5qyhXHJcbiAgICog5YW25a6e5piv6IqC54K555qE5pWw57uE6KGo56S65Lit55qE5pWw5a2XIDAg5ZCR5pa55ZCRIGRpcmVjdGlvbiDnp7vliqjkuIDmrKFcclxuICAgKi9cclxuICBtb3ZlVG8oIGRpcmVjdGlvbjogbnVtYmVyICl7XHJcbiAgICBpZiAoICF0aGlzLmNhbk1vdmVUbyggZGlyZWN0aW9uICkgKSByZXR1cm47XHJcbiAgICBsZXQgdGFyZ2V0SW5kZXggPSB0aGlzLmdldFRhcmdldEluZGV4KCBkaXJlY3Rpb24gKTtcclxuXHJcbiAgICB0aGlzLnZhbHVlWyB0aGlzLnplcm9JbmRleCBdID0gdGhpcy52YWx1ZVsgdGFyZ2V0SW5kZXggXTtcclxuICAgIHRoaXMudmFsdWVbIHRhcmdldEluZGV4IF0gPSAwO1xyXG4gICAgdGhpcy56ZXJvSW5kZXggPSB0YXJnZXRJbmRleDtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIOiOt+WPluW9k+WJjeiKgueCueeahOWPr+iDveenu+WKqOaWueWQke+8iOeUqCAwIOS9jeeahOenu+WKqOi/m+ihjOihqOekuu+8iVxyXG4gICAqL1xyXG4gIGdldFplcm9EaXJlY3Rpb24oKXtcclxuICAgIGxldCBub2RlID0gdGhpcztcclxuICAgIGxldCBEaXJlY3Rpb24gPSB7fTtcclxuICAgIFsgXCJVUFwiLCBcIlJJR0hUXCIsIFwiRE9XTlwiLCBcIkxFRlRcIiBdLmZvckVhY2goIGZ1bmN0aW9uKGRpcil7XHJcbiAgICAgIGxldCBfZGlyID0gRElSRUNUSU9OW2Rpcl07XHJcbiAgICAgIGlmICggbm9kZS5jYW5Nb3ZlVG8oIF9kaXIgKSApe1xyXG4gICAgICAgIGxldCB0YXJnZXRJbmRleCA9IG5vZGUuZ2V0VGFyZ2V0SW5kZXgoIF9kaXIgKTtcclxuICAgICAgICBEaXJlY3Rpb25bIGRpciBdID0gYCR7bm9kZS52YWx1ZVsgdGFyZ2V0SW5kZXggXX1gO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICAgIHJldHVybiBEaXJlY3Rpb247XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiDlsIblvZPliY3oioLngrnnmoTlj6/og73np7vliqjmlrnlkJHnlLHnlKggMCDkvY3nmoTnp7vliqjmnaXooajnpLrovazmjaLmiJDnlKggMCDkvY3pgrvmjqXnmoTpnZ4gMCDmlbDlrZfnmoTnp7vliqjmnaXov5vooYzooajnpLpcclxuICAgKi9cclxuICBnZXROb25aZXJvRGlyZWN0aW9uKCl7XHJcbiAgICBsZXQgRGlyZWN0aW9uID0ge307XHJcbiAgICBsZXQgemVyb0RpciA9IHRoaXMuZ2V0WmVyb0RpcmVjdGlvbigpO1xyXG4gICAgZm9yICggbGV0IHZhbCBpbiB6ZXJvRGlyICl7XHJcbiAgICAgIC8vIGxldCBfdmFsO1xyXG4gICAgICAvLyBzd2l0Y2goIHZhbCApe1xyXG4gICAgICAvLyAgIGNhc2UgXCJVUFwiOlxyXG4gICAgICAvLyAgICAgX3ZhbCA9IFwiRE9XTlwiO1xyXG4gICAgICAvLyAgICAgYnJlYWs7XHJcbiAgICAgIC8vICAgY2FzZSBcIlJJR0hUXCI6XHJcbiAgICAgIC8vICAgICBfdmFsID0gXCJMRUZUXCI7XHJcbiAgICAgIC8vICAgICBicmVhaztcclxuICAgICAgLy8gICBjYXNlIFwiRE9XTlwiOlxyXG4gICAgICAvLyAgICAgX3ZhbCA9IFwiVVBcIjtcclxuICAgICAgLy8gICAgIGJyZWFrO1xyXG4gICAgICAvLyAgIGNhc2UgXCJMRUZUXCI6XHJcbiAgICAgIC8vICAgICBfdmFsID0gXCJSSUdIVFwiO1xyXG4gICAgICAvLyAgICAgYnJlYWs7XHJcbiAgICAgIC8vIH1cclxuICAgICAgLy8gRGlyZWN0aW9uWyB6ZXJvRGlyWyB2YWwgXSBdID0gX3ZhbDtcclxuXHJcbiAgICAgIERpcmVjdGlvblsgemVyb0RpclsgdmFsIF0gXSA9IHZhbDtcclxuICAgIH1cclxuICAgIGNvbnNvbGUubG9nKCBEaXJlY3Rpb24gKTtcclxuICAgIHJldHVybiBEaXJlY3Rpb247XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiDojrflj5blvZPliY3oioLngrnlnKjlj6/np7vliqjmlrnlkJHkuIrnmoTlrZDoioLngrnmlbDnu4RcclxuICAgKi9cclxuICBnZXROZXh0Tm9kZXMoKXtcclxuICAgIGxldCBub2RlID0gdGhpcztcclxuICAgIGxldCBuZXh0Tm9kZXM6IE5vZGVbXSA9IFtdO1xyXG4gICAgWyBESVJFQ1RJT04uVVAsIERJUkVDVElPTi5SSUdIVCwgRElSRUNUSU9OLkRPV04sIERJUkVDVElPTi5MRUZUIF0uZm9yRWFjaCggZnVuY3Rpb24oZGlyZWN0aW9uKXtcclxuICAgICAgaWYgKCBub2RlLmNhbk1vdmVUbyggZGlyZWN0aW9uICkgKXtcclxuICAgICAgICBsZXQgbmV3Tm9kZSA9IE5vZGUubm9kZUNsb25lKCBub2RlICk7XHJcbiAgICAgICAgbmV3Tm9kZS5wYXJlbnQgPSBub2RlO1xyXG4gICAgICAgIG5ld05vZGUubW92ZVRvKGRpcmVjdGlvbik7XHJcbiAgICAgICAgbmV4dE5vZGVzLnB1c2goIG5ld05vZGUgKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgICByZXR1cm4gbmV4dE5vZGVzO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICog5Yik5pat5b2T5YmN6IqC54K577yI6IqC54K55Lit55qEIDAg5L2N77yJ5piv5ZCm5Y+v5Lul5rK/IGRpcmVjdGlvbiDmlrnlkJHnp7vliqhcclxuICAgKi9cclxuICBjYW5Nb3ZlVG8oIGRpcmVjdGlvbjogbnVtYmVyICl7XHJcbiAgICBsZXQgcm93ID0gTWF0aC5mbG9vciggdGhpcy56ZXJvSW5kZXggLyB0aGlzLnNjYWxlICk7XHJcbiAgICBsZXQgY29sID0gdGhpcy56ZXJvSW5kZXggJSB0aGlzLnNjYWxlO1xyXG5cclxuICAgIHN3aXRjaCggZGlyZWN0aW9uICl7XHJcbiAgICAgIGNhc2UgRElSRUNUSU9OLlVQOlxyXG4gICAgICAgIHJldHVybiByb3cgIT09IDA7XHJcbiAgICAgIGNhc2UgRElSRUNUSU9OLlJJR0hUOlxyXG4gICAgICAgIHJldHVybiBjb2wgIT09IHRoaXMuc2NhbGUgLSAxO1xyXG4gICAgICBjYXNlIERJUkVDVElPTi5ET1dOOlxyXG4gICAgICAgIHJldHVybiByb3cgIT09IHRoaXMuc2NhbGUgLSAxO1xyXG4gICAgICBjYXNlIERJUkVDVElPTi5MRUZUOlxyXG4gICAgICAgIHJldHVybiBjb2wgIT09IDA7XHJcbiAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICog6I635Y+W5LuO5b2T5YmN6IqC54K56LWw5Yiw5LiL5LiA5Liq6IqC54K555qE5Luj5Lu3XHJcbiAgICovXHJcbiAgZ2V0Q29zdFRvTmV4dCgpe1xyXG4gICAgcmV0dXJuIDE7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiDorr7nva7oioLngrnnmoQgRiDlgLzvvIzloIbkvJrmoLnmja7ov5nkuKrlgLzov5vooYzmjpLluo9cclxuICAgKi9cclxuICBzZXRGKCB2YWx1ZTogbnVtYmVyICl7XHJcbiAgICB0aGlzLkYgPSB2YWx1ZTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIOiOt+WPluiKgueCueeahCBHIOWAvFxyXG4gICAqL1xyXG4gIGdldEcoKXtcclxuICAgIHJldHVybiB0aGlzLkc7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiDorr7nva7oioLngrnnmoQgRyDlgLxcclxuICAgKi9cclxuICBzZXRHKCB2YWx1ZTogbnVtYmVyICl7XHJcbiAgICB0aGlzLkcgPSB2YWx1ZTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIOiOt+WPluiKgueCueeahCBIIOWAvFxyXG4gICAqL1xyXG4gIGdldEgoIHRhcmdldE5vZGU6IE5vZGUgKXtcclxuICAgIGxldCBpID0gMCxcclxuICAgICAgICBsZW4gPSB0aGlzLnZhbHVlLmxlbmd0aCxcclxuICAgICAgICBtYW5oYXR0ZW4gPSAwLFxyXG4gICAgICAgIGRpZmYgPSAwO1xyXG5cclxuICAgIGZvciAoIDsgaSA8IGxlbjsgaSArKyApe1xyXG4gICAgICBpZiAoIHRoaXMudmFsdWVbaV0gIT09IGkgKyAxICkgZGlmZiArKztcclxuXHJcbiAgICAgIGxldCB2ID0gdGhpcy52YWx1ZVtpXTtcclxuICAgICAgaWYoIHYgIT09IDAgKXtcclxuICAgICAgICAvLyBub3cgaW5cclxuICAgICAgICBsZXQgcm93ID0gTWF0aC5mbG9vciggaS90aGlzLnNjYWxlICk7XHJcbiAgICAgICAgbGV0IGNvbCA9IGkldGhpcy5zY2FsZTtcclxuICAgICAgICAvLyBzaG91bGQgaW5cclxuICAgICAgICBsZXQgX3JvdyA9IE1hdGguZmxvb3IoIHYvdGhpcy5zY2FsZSApO1xyXG4gICAgICAgIGxldCBfY29sID0gdiV0aGlzLnNjYWxlO1xyXG5cclxuICAgICAgICBtYW5oYXR0ZW4gKz0gTWF0aC5hYnMoIHJvdyAtIF9yb3cgKSArIE1hdGguYWJzKCBjb2wgLSBfY29sICk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gMSptYW5oYXR0ZW4gKyAxMDAqZGlmZjtcclxuICB9XHJcblxyXG4gIC8vIHByaXZhdGUgZnVuY3Rpb25cclxuICAvLyAtLS0tLS0tLS0tLS0tLS0tXHJcblxyXG4gIC8qKlxyXG4gICAqIOagueaNrue7tOW6piBzY2FsZSDmnoTpgKDoioLngrnnmoTliJ3lp4vooajnpLrmlbDnu4RcclxuICAgKi9cclxuICBwcml2YXRlIGluaXROb2RlVmFsdWVCeVNjYWxlKCBzY2FsZTogbnVtYmVyICl7XHJcbiAgICBsZXQgdmFsID0gW107XHJcbiAgICBmb3IgKCBsZXQgaSA9IDE7IGkgPCBNYXRoLnBvdyhzY2FsZSwgMik7IGkgKysgKXtcclxuICAgICAgdmFsLnB1c2goIGkgKTtcclxuICAgIH1cclxuICAgIHZhbC5wdXNoKCAwICk7XHJcbiAgICByZXR1cm4gdmFsO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICog6I635Y+W5b2T5YmN6IqC54K55Lit5aSE5LqOIDAg5L2N55qE5pa55ZCRIGRpcmVjdGlvbiDlpITnmoTpgrvmjqXmlbDlrZfnmoTkuIvmoIdcclxuICAgKi9cclxuICBwcml2YXRlIGdldFRhcmdldEluZGV4KCBkaXJlY3Rpb246IG51bWJlciApe1xyXG4gICAgaWYgKCAhdGhpcy5jYW5Nb3ZlVG8oIGRpcmVjdGlvbiApICkgcmV0dXJuO1xyXG4gICAgbGV0IHRhcmdldEluZGV4O1xyXG4gICAgc3dpdGNoKCBkaXJlY3Rpb24gKXtcclxuICAgICAgY2FzZSBESVJFQ1RJT04uVVA6XHJcbiAgICAgICAgdGFyZ2V0SW5kZXggPSB0aGlzLnplcm9JbmRleCAtIHRoaXMuc2NhbGU7XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIGNhc2UgRElSRUNUSU9OLlJJR0hUOlxyXG4gICAgICAgIHRhcmdldEluZGV4ID0gdGhpcy56ZXJvSW5kZXggKyAxO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICBjYXNlIERJUkVDVElPTi5ET1dOOlxyXG4gICAgICAgIHRhcmdldEluZGV4ID0gdGhpcy56ZXJvSW5kZXggKyB0aGlzLnNjYWxlO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICBjYXNlIERJUkVDVElPTi5MRUZUOlxyXG4gICAgICAgIHRhcmdldEluZGV4ID0gdGhpcy56ZXJvSW5kZXggLSAxO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICBkZWZhdWx0OlxyXG4gICAgICAgIHRhcmdldEluZGV4ID0gdGhpcy56ZXJvSW5kZXg7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gdGFyZ2V0SW5kZXg7XHJcbiAgfVxyXG5cclxuICAvLyBzdGF0aWMgZnVuY3Rpb25cclxuICAvLyAtLS0tLS0tLS0tLS0tLS1cclxuXHJcbiAgLyoqXHJcbiAgICog5Yik5pat5Lik5Liq6IqC54K55piv5ZCm55u4562JXHJcbiAgICog6YCa6L+H5bCG6IqC54K555qE5pWw57uE6KGo56S66L2s5o2i5oiQ5a2X56ym5Liy5p2l6L+b6KGM5q+U6L6DXHJcbiAgICovXHJcbiAgc3RhdGljIGlzU2FtZSggY3VycmVudE5vZGU6IE5vZGUsIHRhcmdldE5vZGU6IE5vZGUgKXtcclxuICAgIHJldHVybiBjdXJyZW50Tm9kZS5nZXRWYWxTdHIoKSA9PT0gdGFyZ2V0Tm9kZS5nZXRWYWxTdHIoKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIOWfuuS6jiBub2RlIOWkjeWItuS4gOS4quaWsOeahOiKgueCuVxyXG4gICAqL1xyXG4gIHN0YXRpYyBub2RlQ2xvbmUoIG5vZGU6IE5vZGUgKXtcclxuICAgIGxldCBuZXdOb2RlID0gbmV3IE5vZGUoIG5vZGUuc2NhbGUgKTtcclxuICAgIG5ld05vZGUudmFsdWUgPSBub2RlLnZhbHVlLnNsaWNlKDApO1xyXG4gICAgbmV3Tm9kZS56ZXJvSW5kZXggPSBub2RlLnplcm9JbmRleDtcclxuICAgIHJldHVybiBuZXdOb2RlO1xyXG4gIH1cclxufVxyXG4iLCJleHBvcnQgZW51bSBESVJFQ1RJT04gIHsgVVAgPSAxLCBSSUdIVCwgRE9XTiwgTEVGVCB9XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIGJlbG9uZ1Rve1xyXG4gICAgW3Byb3BOYW1lOiBzdHJpbmddOiBudW1iZXI7XHJcbn07XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gJGlkKGVsZUlkOiBzdHJpbmcpe1xyXG4gIHJldHVybiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCggZWxlSWQgKTtcclxufTtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiAkY3JlYXRlRWxlKCB0YWdOYW1lOiBzdHJpbmcsIGlkPzogc3RyaW5nLCBjbGFzc05hbWU/OiBzdHJpbmcgKXtcclxuICBsZXQgZWxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCggdGFnTmFtZSApO1xyXG4gIGlmKCBpZCApIGVsZS5pZCA9IGlkO1xyXG4gIGlmKCBjbGFzc05hbWUgKSBlbGUuY2xhc3NOYW1lID0gY2xhc3NOYW1lO1xyXG4gIHJldHVybiBlbGU7XHJcbn07XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gJHJlcGxhY2VDbGFzcyggZWxlLCBuZXdDbGFzczogc3RyaW5nLCBwcmVmaXg6IHN0cmluZyAgKXtcclxuICBsZXQgcmVnID0gbmV3IFJlZ0V4cCggYCR7cHJlZml4fS0oXFxcXGQpK2AsICdnJyApO1xyXG4gIGVsZS5jbGFzc05hbWUgPSBlbGUuY2xhc3NOYW1lLnJlcGxhY2UoIHJlZywgbmV3Q2xhc3MgKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uICRhZGRDbGFzcyggZWxlLCBuZXdDbGFzczogc3RyaW5nICl7XHJcbiAgaWYgKCBlbGUuY2xhc3NOYW1lLmluZGV4T2YoIG5ld0NsYXNzICkgPT09IC0xICl7XHJcbiAgICBlbGUuY2xhc3NOYW1lID0gYCR7ZWxlLmNsYXNzTmFtZX0gJHtuZXdDbGFzc31gO1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uICRyZW1vdmVDbGFzcyggZWxlLCByZW1vdmU6IHN0cmluZyApe1xyXG4gIGVsZS5jbGFzc05hbWUgPSBlbGUuY2xhc3NOYW1lLnJlcGxhY2UoIHJlbW92ZSwgJycgKS50cmltKCk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiAkZ2V0UG9zKCBjbGFzc05hbWU6IHN0cmluZyApe1xyXG4gIGxldCBjbGFzc0FyciA9IGNsYXNzTmFtZS5zcGxpdCgnICcpO1xyXG4gIGZvciAoIGxldCBpID0gMCwgbGVuID0gY2xhc3NBcnIubGVuZ3RoOyBpIDwgbGVuOyBpICsrICl7XHJcbiAgICBpZiAoIGNsYXNzQXJyW2ldLmluZGV4T2YoICdwb3MnICkgIT09IC0xICl7XHJcbiAgICAgICAgcmV0dXJuIGNsYXNzQXJyW2ldLnNwbGl0KCctJylbMV07XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gJGdldEltZ0lkKCBjbGFzc05hbWU6IHN0cmluZyApe1xyXG4gIGxldCBjbGFzc0FyciA9IGNsYXNzTmFtZS5zcGxpdCgnICcpO1xyXG4gIGZvciAoIGxldCBpID0gMCwgbGVuID0gY2xhc3NBcnIubGVuZ3RoOyBpIDwgbGVuOyBpICsrICl7XHJcbiAgICBpZiAoIGNsYXNzQXJyW2ldLmluZGV4T2YoICdpdGVtLScgKSAhPT0gLTEgKXtcclxuICAgICAgICByZXR1cm4gY2xhc3NBcnJbaV0uc3BsaXQoJy0nKVsxXTtcclxuICAgIH1cclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiAkZXhjaGFuZ2UoIGl0ZW0xLCBpdGVtMiApe1xyXG4gIGxldCBwb3MxID0gJGdldFBvcyggaXRlbTEuY2xhc3NOYW1lICk7XHJcbiAgbGV0IHBvczIgPSAkZ2V0UG9zKCBpdGVtMi5jbGFzc05hbWUgKTtcclxuXHJcbiAgJHJlbW92ZUNsYXNzKCBpdGVtMiwgYHBvcy0ke3BvczJ9YCApO1xyXG4gICRhZGRDbGFzcyggaXRlbTIsIGBwb3MtJHtwb3MxfWAgKTtcclxuICAkcmVtb3ZlQ2xhc3MoIGl0ZW0xLCBgcG9zLSR7cG9zMX1gICk7XHJcbiAgJGFkZENsYXNzKCBpdGVtMSwgYHBvcy0ke3BvczJ9YCApO1xyXG59XHJcbiJdfQ==
