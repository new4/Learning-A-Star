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
        this.infoId = "info";
        this.gameContainer = util_1.$id(this.gameContainerId);
        this.imgContainer = util_1.$createEle('div', this.imgContainerId);
        this.actionContainer = util_1.$createEle('div', this.actionContainerId);
        this.infoContainer = util_1.$createEle('div', this.infoId);
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
            console.time("AStar Run !");
            var startTime = new Date().getTime();
            astar.run();
            var endTime = new Date().getTime();
            console.timeEnd("AStar Run !");
            console.log(" astar - ", astar);
            game.timeInfoEle.innerHTML = (endTime - startTime) + " ms";
            var solution_1 = astar.getSolution();
            if (solution_1.length) {
                var len_1 = solution_1.length, i_1 = len_1 - 1;
                var runId_1 = setInterval(function () {
                    if (i_1 === -1) {
                        clearInterval(runId_1);
                        game.win();
                    }
                    else {
                        game.currentNode = solution_1[i_1];
                        game.setStatusByNode(solution_1[i_1]);
                        game.stepInfoEle.innerHTML = (len_1 - i_1) + "/" + len_1;
                        i_1--;
                    }
                }, 180);
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
        this.initInfo();
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
     * 拼图的信息显示部分的初始化
     */
    Game.prototype.initInfo = function () {
        var game = this;
        ["time", "step"].forEach(function (value) {
            var divEle = util_1.$createEle('div', undefined, 'info-item');
            var title = util_1.$createEle('span', undefined, 'title');
            var content = util_1.$createEle('span');
            title.innerHTML = value + ":";
            content.innerHTML = '0';
            game[(value + "InfoEle")] = content;
            divEle.appendChild(title);
            divEle.appendChild(content);
            game.infoContainer.appendChild(divEle);
        });
        game.gameContainer.appendChild(game.infoContainer);
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
     * 图片片段上的 click 事件处理函数，用来移动图片片段
     */
    Game.prototype.imgFragmentHandler = function (e) {
        var imgId = util_1.$getImgId(e.target.className);
        var nonZeroDir = this.currentNode.getNonZeroDirection();
        if (nonZeroDir[imgId]) {
            var direction = util_1.DIRECTION[("" + nonZeroDir[imgId])];
            this.currentNode.moveTo(direction);
            util_1.$exchangePos(this.blankImgEle, e.target);
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
function $exchangePos(item1, item2) {
    var pos1 = $getPos(item1.className);
    var pos2 = $getPos(item2.className);
    $removeClass(item2, "pos-" + pos2);
    $addClass(item2, "pos-" + pos1);
    $removeClass(item1, "pos-" + pos1);
    $addClass(item1, "pos-" + pos2);
}
exports.$exchangePos = $exchangePos;
},{}]},{},[4])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvdHMvYXN0YXIudHMiLCJzcmMvdHMvZ2FtZS50cyIsInNyYy90cy9oZWFwLnRzIiwic3JjL3RzL21haW4udHMiLCJzcmMvdHMvbm9kZS50cyIsInNyYy90cy91dGlsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOztBQ0FBLHFCQUFpQixRQUFRLENBQUMsQ0FBQTtBQUMxQixxQkFBaUIsUUFBUSxDQUFDLENBQUE7QUFHMUI7O0dBRUc7QUFDSDtJQVNFLGVBQWEsU0FBZSxFQUFFLFVBQWdCO1FBUDlDLGVBQVUsR0FBVyxFQUFFLENBQUE7UUFJZixpQkFBWSxHQUFhLEVBQUUsQ0FBQTtRQUMzQixhQUFRLEdBQVcsRUFBRSxDQUFBO1FBRzNCLElBQUksQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFDO1FBQzNCLElBQUksQ0FBQyxVQUFVLEdBQUcsVUFBVSxDQUFDO1FBQzdCLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxjQUFJLENBQUUsQ0FBRSxTQUFTLENBQUUsRUFBRSxHQUFHLENBQUUsQ0FBQztJQUNqRCxDQUFDO0lBRUQsa0JBQWtCO0lBQ2xCLGtCQUFrQjtJQUVsQjs7T0FFRztJQUNILG1CQUFHLEdBQUg7UUFFRSxJQUFJLEtBQUssR0FBRyxJQUFJLENBQUM7UUFDakI7WUFDRSxJQUFJLFdBQVcsR0FBRyxLQUFLLENBQUMsUUFBUSxDQUFDLEdBQUcsRUFBRSxDQUFDO1lBQ3ZDLEtBQUssQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFFLFdBQVcsQ0FBRSxDQUFDO1lBQ3JDLEtBQUssQ0FBQyxZQUFZLENBQUUsV0FBVyxDQUFDLFNBQVMsRUFBRSxDQUFFLEdBQUcsQ0FBQyxDQUFDO1lBRWxELElBQUksU0FBUyxHQUFHLFdBQVcsQ0FBQyxZQUFZLEVBQUUsQ0FBQztZQUUzQyxTQUFTLENBQUMsT0FBTyxDQUFDLFVBQVMsUUFBUTtnQkFDakMsSUFBSSxJQUFJLEdBQUcsV0FB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LENBQUM7SUFDckMsU0FBUyxDQUFFLEtBQUssRUFBRSxTQUFPLElBQU0sQ0FBRSxDQUFDO0FBQ3BDLENBQUM7QUFSZSxvQkFBWSxlQVEzQixDQUFBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImltcG9ydCBOb2RlIGZyb20gJy4vbm9kZSc7XHJcbmltcG9ydCBIZWFwIGZyb20gJy4vaGVhcCc7XHJcbmltcG9ydCB7IGJlbG9uZ1RvIH0gZnJvbSAnLi91dGlsJztcclxuXHJcbi8qKlxyXG4gKiBBKiDnrpfms5VcclxuICovXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEFzdGFye1xyXG4gIG9wZW5MaXN0OiBIZWFwXHJcbiAgY2xvc2VkTGlzdDogTm9kZVtdID0gW11cclxuICBzdGFydE5vZGU6IE5vZGVcclxuICB0YXJnZXROb2RlOiBOb2RlXHJcblxyXG4gIHByaXZhdGUgYl9jbG9zZWRMaXN0OiBiZWxvbmdUbyA9IHt9XHJcbiAgcHJpdmF0ZSBzb2x1dGlvbjogTm9kZVtdID0gW11cclxuXHJcbiAgY29uc3RydWN0b3IoIHN0YXJ0Tm9kZTogTm9kZSwgdGFyZ2V0Tm9kZTogTm9kZSApe1xyXG4gICAgdGhpcy5zdGFydE5vZGUgPSBzdGFydE5vZGU7XHJcbiAgICB0aGlzLnRhcmdldE5vZGUgPSB0YXJnZXROb2RlO1xyXG4gICAgdGhpcy5vcGVuTGlzdCA9IG5ldyBIZWFwKCBbIHN0YXJ0Tm9kZSBdLCBcIkZcIiApO1xyXG4gIH1cclxuXHJcbiAgLy8gcHVibGljIGZ1bmN0aW9uXHJcbiAgLy8gLS0tLS0tLS0tLS0tLS0tXHJcblxyXG4gIC8qKlxyXG4gICAqIOi/kOihjCBBKiDnrpfms5VcclxuICAgKi9cclxuICBydW4oKXtcclxuXHJcbiAgICBsZXQgYXN0YXIgPSB0aGlzO1xyXG4gICAgd2hpbGUgKCAhTm9kZS5pc1NhbWUoIGFzdGFyLm9wZW5MaXN0LnRvcCgpLCBhc3Rhci50YXJnZXROb2RlICkgKXtcclxuICAgICAgbGV0IGN1cnJlbnROb2RlID0gYXN0YXIub3Blbkxpc3QucG9wKCk7XHJcbiAgICAgIGFzdGFyLmNsb3NlZExpc3QucHVzaCggY3VycmVudE5vZGUgKTtcclxuICAgICAgYXN0YXIuYl9jbG9zZWRMaXN0WyBjdXJyZW50Tm9kZS5nZXRWYWxTdHIoKSBdID0gMTtcclxuXHJcbiAgICAgIGxldCBuZXh0Tm9kZXMgPSBjdXJyZW50Tm9kZS5nZXROZXh0Tm9kZXMoKTtcclxuXHJcbiAgICAgIG5leHROb2Rlcy5mb3JFYWNoKGZ1bmN0aW9uKG5leHROb2RlKXtcclxuICAgICAgICBsZXQgY29zdCA9IGN1cnJlbnROb2RlLmdldEcoKSArIGN1cnJlbnROb2RlLmdldENvc3RUb05leHQoKTtcclxuICAgICAgICBsZXQgaW5kZXggPSAgYXN0YXIub3Blbkxpc3QuZ2V0SXRlbUluZGV4KCBuZXh0Tm9kZSApO1xyXG5cclxuICAgICAgICBpZiAoIGluZGV4ICE9PSB1bmRlZmluZWQgJiYgY29zdCA8IG5leHROb2RlLmdldEcoKSApe1xyXG4gICAgICAgICAgY29uc29sZS5sb2coIFwibmV4dCAxXCIgKTtcclxuICAgICAgICAgIGFzdGFyLm9wZW5MaXN0LnJlbW92ZSggaW5kZXggKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICggYXN0YXIuaXNCZWxvbmdUb0Nsb3NlZCggbmV4dE5vZGUgKSAmJiBjb3N0IDwgbmV4dE5vZGUuZ2V0RygpICl7XHJcbiAgICAgICAgICBjb25zb2xlLmxvZyggXCJuZXh0IDJcIiApO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKCBpbmRleCA9PT0gdW5kZWZpbmVkICYmICFhc3Rhci5pc0JlbG9uZ1RvQ2xvc2VkKCBuZXh0Tm9kZSApICl7XHJcbiAgICAgICAgICBjb25zb2xlLmxvZyggXCJuZXh0IDNcIiApO1xyXG4gICAgICAgICAgbmV4dE5vZGUuc2V0RyggY29zdCApO1xyXG4gICAgICAgICAgbmV4dE5vZGUuc2V0RiggbmV4dE5vZGUuZ2V0RygpICsgbmV4dE5vZGUuZ2V0SCggYXN0YXIudGFyZ2V0Tm9kZSApICk7XHJcbiAgICAgICAgICBhc3Rhci5vcGVuTGlzdC5wdXNoKCBuZXh0Tm9kZSApO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICBsZXQgdGFpbE5vZGUgPSBhc3Rhci5vcGVuTGlzdC50b3AoKTtcclxuICAgIHRoaXMuc29sdXRpb24gPSBbXTtcclxuICAgIHdoaWxlKCB0YWlsTm9kZSApe1xyXG4gICAgICB0aGlzLnNvbHV0aW9uLnB1c2goIHRhaWxOb2RlICk7XHJcbiAgICAgIHRhaWxOb2RlID0gdGFpbE5vZGUucGFyZW50O1xyXG4gICAgfVxyXG5cclxuICAgIC8vIHRoaXMuc2hvd1NvbHV0aW9uKCk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiDojrflj5bop6PlhrPmlrnmoYjmlbDnu4RcclxuICAgKi9cclxuICBnZXRTb2x1dGlvbigpe1xyXG4gICAgcmV0dXJuIHRoaXMuc29sdXRpb247XHJcbiAgfVxyXG5cclxuICAvLyBwcml2YXRlIGZ1bmN0aW9uXHJcbiAgLy8gLS0tLS0tLS0tLS0tLS0tXHJcblxyXG4gIC8qKlxyXG4gICAqIOWIpOaWreiKgueCueaYr+WQpuWcqCBDTE9TRUQg5LitXHJcbiAgICovXHJcbiAgcHJpdmF0ZSBpc0JlbG9uZ1RvQ2xvc2VkKCBub2RlOiBOb2RlICl7XHJcbiAgICBsZXQgc3RyID0gbm9kZS5nZXRWYWxTdHIoKTtcclxuICAgIHJldHVybiAhIXRoaXMuYl9jbG9zZWRMaXN0W3N0cl07XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiDmmL7npLrop6PlhrPmlrnmoYjnmoTlhbfkvZPmraXpqqRcclxuICAgKi9cclxuICBwcml2YXRlIHNob3dTb2x1dGlvbigpe1xyXG4gICAgbGV0IGxlbiA9IHRoaXMuc29sdXRpb24ubGVuZ3RoLFxyXG4gICAgICAgIGkgPSBsZW4gLSAxLFxyXG4gICAgICAgIHNjYWxlID0gdGhpcy50YXJnZXROb2RlLnNjYWxlO1xyXG4gICAgZm9yICggOyBpID4gLTE7IGkgLS0gKXtcclxuICAgICAgY29uc29sZS5sb2coIGBTdGVwICR7IGxlbiAtIGkgfTogYCApO1xyXG4gICAgICBsZXQgaXRlbSA9IHRoaXMuc29sdXRpb25baV0uZ2V0VmFsU3RyKCkuc3BsaXQoJywnKTtcclxuICAgICAgZm9yICggbGV0IGogPSAwOyBqIDwgc2NhbGU7IGogKysgKXtcclxuICAgICAgICAgIGNvbnNvbGUubG9nKCBgfCAke2l0ZW1bIGoqc2NhbGUgXX0gJHtpdGVtWyBqKnNjYWxlICsgMSBdfSAke2l0ZW1bIGoqc2NhbGUgKyAyIF19IHxgICk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcbn1cclxuIiwiaW1wb3J0IE5vZGUgZnJvbSBcIi4vbm9kZVwiO1xyXG5pbXBvcnQgQXN0YXIgZnJvbSAnLi9hc3Rhcic7XHJcbmltcG9ydCB7ICRpZCwgJGNyZWF0ZUVsZSwgJHJlcGxhY2VDbGFzcywgJGdldFBvcywgJGdldEltZ0lkLCAkZXhjaGFuZ2VQb3MsIERJUkVDVElPTiB9IGZyb20gJy4vdXRpbCc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBHYW1le1xyXG4gIGN1cnJlbnROb2RlOiBOb2RlXHJcbiAgdGFyZ2V0Tm9kZTogTm9kZVxyXG4gIHNjYWxlOiBudW1iZXJcclxuXHJcbiAgcHJpdmF0ZSBnYW1lQ29udGFpbmVySWQ6IHN0cmluZ1xyXG4gIHByaXZhdGUgaW1nQ29udGFpbmVySWQ6IHN0cmluZ1xyXG4gIHByaXZhdGUgYWN0aW9uQ29udGFpbmVySWQ6IHN0cmluZ1xyXG4gIHByaXZhdGUgaW5mb0lkOiBzdHJpbmdcclxuXHJcbiAgcHJpdmF0ZSBnYW1lQ29udGFpbmVyXHJcbiAgcHJpdmF0ZSBpbWdDb250YWluZXJcclxuICBwcml2YXRlIGFjdGlvbkNvbnRhaW5lclxyXG4gIHByaXZhdGUgaW5mb0NvbnRhaW5lclxyXG5cclxuICAvLyDnvJPlrZjmiYDmnInnmoTlm77niYfniYfmrrUgZG9t77yM5YWN5b6X5YaN5om+XHJcbiAgcHJpdmF0ZSBpbWdFbGVtZW50cyA9IFtdXHJcbiAgLy8g57yT5a2Y56m655m95Zu+54mH54mH5q61IGRvbe+8jOWFjeW+l+WGjeaJvlxyXG4gIHByaXZhdGUgYmxhbmtJbWdFbGVcclxuXHJcbiAgcHJpdmF0ZSB0aW1lSW5mb0VsZVxyXG4gIHByaXZhdGUgc3RlcEluZm9FbGVcclxuXHJcbiAgY29uc3RydWN0b3IoIGdhbWVDb250YWluZXJJZDogc3RyaW5nLCBzY2FsZTogbnVtYmVyICl7XHJcbiAgICB0aGlzLmN1cnJlbnROb2RlID0gbmV3IE5vZGUoIHNjYWxlICk7XHJcbiAgICB0aGlzLnRhcmdldE5vZGUgPSBuZXcgTm9kZSggc2NhbGUgKTtcclxuICAgIHRoaXMuc2NhbGUgPSBzY2FsZTtcclxuXHJcbiAgICB0aGlzLmdhbWVDb250YWluZXJJZCA9IGdhbWVDb250YWluZXJJZDtcclxuICAgIHRoaXMuaW1nQ29udGFpbmVySWQgPSBcImltYWdlXCI7XHJcbiAgICB0aGlzLmFjdGlvbkNvbnRhaW5lcklkID0gXCJhY3Rpb25cIjtcclxuICAgIHRoaXMuaW5mb0lkID0gXCJpbmZvXCI7XHJcblxyXG4gICAgdGhpcy5nYW1lQ29udGFpbmVyID0gJGlkKCB0aGlzLmdhbWVDb250YWluZXJJZCApO1xyXG4gICAgdGhpcy5pbWdDb250YWluZXIgPSAkY3JlYXRlRWxlKCAnZGl2JywgdGhpcy5pbWdDb250YWluZXJJZCApO1xyXG4gICAgdGhpcy5hY3Rpb25Db250YWluZXIgPSAkY3JlYXRlRWxlKCAnZGl2JywgdGhpcy5hY3Rpb25Db250YWluZXJJZCApO1xyXG4gICAgdGhpcy5pbmZvQ29udGFpbmVyID0gJGNyZWF0ZUVsZSggJ2RpdicsIHRoaXMuaW5mb0lkICk7XHJcblxyXG4gICAgdGhpcy5pbml0KCk7XHJcbiAgfVxyXG5cclxuICAvLyBwdWJsaWMgZnVuY3Rpb25cclxuICAvLyAtLS0tLS0tLS0tLS0tLS1cclxuXHJcbiAgLyoqXHJcbiAgICogbWl4IOaMiemSruaJp+ihjOWHveaVsFxyXG4gICAqIOa3t+WQiO+8jOeUsei1t+Wni+iKgueCueS5seW6j+W+l+WIsOS4gOS4quaWsOeahOiKgueCue+8jOW5tuagueaNruaWsOiKgueCueiuvue9rumhtemdouS4reeahOaYvuekuueKtuaAgVxyXG4gICAqL1xyXG4gIG1peCgpe1xyXG4gICAgdGhpcy5jdXJyZW50Tm9kZS5zaHVmZmxlKCk7XHJcbiAgICB0aGlzLnNldFN0YXR1c0J5Tm9kZSggdGhpcy5jdXJyZW50Tm9kZSApO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogc3RhcnQg5oyJ6ZKu5omn6KGM5Ye95pWwXHJcbiAgICog5omn6KGMIEEqIOeul+azlVxyXG4gICAqL1xyXG4gIHN0YXJ0KCl7XHJcbiAgICBsZXQgZ2FtZSA9IHRoaXM7XHJcbiAgICBpZiAoIE5vZGUuaXNTYW1lKCB0aGlzLmN1cnJlbnROb2RlLCB0aGlzLnRhcmdldE5vZGUgKSApe1xyXG4gICAgICB0aGlzLndpbigpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgbGV0IGFzdGFyID0gbmV3IEFzdGFyKCB0aGlzLmN1cnJlbnROb2RlLCB0aGlzLnRhcmdldE5vZGUgKTtcclxuXHJcbiAgICAgIGNvbnNvbGUudGltZSggXCJBU3RhciBSdW4gIVwiICk7XHJcbiAgICAgIGxldCBzdGFydFRpbWUgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcclxuICAgICAgYXN0YXIucnVuKCk7XHJcbiAgICAgIGxldCBlbmRUaW1lID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XHJcbiAgICAgIGNvbnNvbGUudGltZUVuZCggXCJBU3RhciBSdW4gIVwiICk7XHJcbiAgICAgIGNvbnNvbGUubG9nKCBcIiBhc3RhciAtIFwiLCBhc3RhciApO1xyXG5cclxuICAgICAgZ2FtZS50aW1lSW5mb0VsZS5pbm5lckhUTUwgPSBgJHtlbmRUaW1lIC0gc3RhcnRUaW1lfSBtc2A7XHJcblxyXG4gICAgICBsZXQgc29sdXRpb24gPSBhc3Rhci5nZXRTb2x1dGlvbigpO1xyXG4gICAgICBpZiAoIHNvbHV0aW9uLmxlbmd0aCApICB7XHJcbiAgICAgICAgbGV0IGxlbiA9IHNvbHV0aW9uLmxlbmd0aCxcclxuICAgICAgICAgICAgaSA9IGxlbiAtIDE7XHJcblxyXG4gICAgICAgIGxldCBydW5JZCA9IHNldEludGVydmFsKCBmdW5jdGlvbigpe1xyXG4gICAgICAgICAgaWYgKCBpID09PSAtMSApe1xyXG4gICAgICAgICAgICBjbGVhckludGVydmFsKCBydW5JZCApO1xyXG4gICAgICAgICAgICBnYW1lLndpbigpO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgZ2FtZS5jdXJyZW50Tm9kZSA9IHNvbHV0aW9uW2ldO1xyXG4gICAgICAgICAgICBnYW1lLnNldFN0YXR1c0J5Tm9kZSggc29sdXRpb25baV0gKTtcclxuICAgICAgICAgICAgZ2FtZS5zdGVwSW5mb0VsZS5pbm5lckhUTUwgPSBgJHtsZW4gLSBpfVxcLyR7bGVufWA7XHJcbiAgICAgICAgICAgIGktLTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9LCAxODAgKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICog6LWi5b6X5ri45oiPXHJcbiAgICovXHJcbiAgd2luKCl7XHJcbiAgICBjb25zb2xlLmxvZyggXCJ3aW4hISFcIiApO1xyXG4gIH1cclxuXHJcbiAgLy8gcHJpdmF0ZSBmdW5jdGlvblxyXG4gIC8vIC0tLS0tLS0tLS0tLS0tLVxyXG5cclxuICAvKipcclxuICAgKiDliJ3lp4vljJblh73mlbBcclxuICAgKi9cclxuICBwcml2YXRlIGluaXQoKXtcclxuICAgIHRoaXMuaW5pdEltYWdlKCk7XHJcbiAgICB0aGlzLmluaXRPcGVyYXRpb24oKTtcclxuICAgIHRoaXMuaW5pdEluZm8oKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIOaLvOWbvua4uOaIj+eahOWbvueJh+aYvuekuumDqOWIhueahOWIneWni+WMllxyXG4gICAqL1xyXG4gIHByaXZhdGUgaW5pdEltYWdlKCl7XHJcbiAgICBsZXQgZ2FtZSA9IHRoaXM7XHJcbiAgICAvLyDoioLngrnnmoTmlbDnu4TooajnpLrkuK3nmoTmr4/kuIDkuKrmlbDnu4TnmoTpobnlr7nlupTkuIDkuKrmoLzlrZBcclxuICAgIGZvciAoIGxldCBpID0gTWF0aC5wb3coIGdhbWUuc2NhbGUsIDIpIC0gMTsgaSA+IC0xOyBpIC0tICl7XHJcbiAgICAgIC8vIOagt+W8jyBpdGVtLSog6KeE5a6a5p+Q5LiA5qC85a2Q5a+55bqU55qE5Zu+54mH54mH5q6177yM6L+Z6YOo5YiG5Yid5aeL5YyW5ZCO5LiN5YaN5pS55Y+YXHJcbiAgICAgIC8vIOagt+W8jyBwb3MtKiDop4Tlrprmn5DkuIDmoLzlrZDlnKggI2ltYWdlIOWuueWZqOS4reeahOS9jee9ru+8jOi/memDqOWIhumaj+edgOiKgueCueWPmOWMluiAjOaUueWPmFxyXG4gICAgICBsZXQgZWxlID0gJGNyZWF0ZUVsZSggJ2RpdicsIHVuZGVmaW5lZCwgYGl0ZW0gaXRlbS0ke2l9IHBvcy0ke2l9YCApO1xyXG5cclxuICAgICAgZWxlLmFkZEV2ZW50TGlzdGVuZXIoICdjbGljaycsIGZ1bmN0aW9uKGUpeyBnYW1lLmltZ0ZyYWdtZW50SGFuZGxlcihlKSB9ICk7XHJcblxyXG4gICAgICAvLyDliJ3lp4vljJbnmoTml7bosIPmlbTnqbrnmb3moLzpg6jliIYoIOagt+W8j+S4uu+8miAuaXRlbS5pdGVtLTAucG9zLTAgKeeahOS9jee9rlxyXG4gICAgICAvLyDlkIzml7blsIblm77niYfniYfmrrXnmoQgZG9tIOe8k+WtmFxyXG4gICAgICBpZiAoIGkgPT09IDAgKXtcclxuICAgICAgICBnYW1lLmltZ0NvbnRhaW5lci5hcHBlbmRDaGlsZCggZWxlICk7XHJcbiAgICAgICAgZ2FtZS5pbWdFbGVtZW50cy5wdXNoKCBlbGUgKTtcclxuICAgICAgICBnYW1lLmJsYW5rSW1nRWxlID0gZWxlO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGdhbWUuaW1nQ29udGFpbmVyLmluc2VydEJlZm9yZSggZWxlLCBnYW1lLmltZ0NvbnRhaW5lci5maXJzdENoaWxkICk7XHJcbiAgICAgICAgZ2FtZS5pbWdFbGVtZW50cy51bnNoaWZ0KCBlbGUgKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgZ2FtZS5nYW1lQ29udGFpbmVyLmFwcGVuZENoaWxkKCBnYW1lLmltZ0NvbnRhaW5lciApO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICog5ou85Zu+55qE5oyJ6ZKu5pON5L2c6YOo5YiG55qE5Yid5aeL5YyWXHJcbiAgICovXHJcbiAgcHJpdmF0ZSBpbml0T3BlcmF0aW9uKCl7XHJcbiAgICBsZXQgZ2FtZSA9IHRoaXM7XHJcbiAgICAvLyDkuKTkuKrmjInpkq4gTUlYIOWSjCBTVEFSVFxyXG4gICAgW1wiTUlYXCIsIFwiU1RBUlRcIl0uZm9yRWFjaCggZnVuY3Rpb24oaXRlbSwgaW5kZXgsIGFycmF5KXtcclxuICAgICAgbGV0IGVsZSA9ICRjcmVhdGVFbGUoICdidXR0b24nLCB1bmRlZmluZWQsIGBidG4gYnRuLSR7aXRlbS50b0xvd2VyQ2FzZSgpfWAgKTtcclxuICAgICAgZWxlLmlubmVySFRNTCA9IGl0ZW07XHJcbiAgICAgIHN3aXRjaCggaXRlbSApe1xyXG4gICAgICAgIGNhc2UgJ01JWCc6XHJcbiAgICAgICAgICBlbGUuYWRkRXZlbnRMaXN0ZW5lciggJ2NsaWNrJywgZ2FtZS5taXguYmluZCggZ2FtZSApICk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlICdTVEFSVCc6XHJcbiAgICAgICAgICBlbGUuYWRkRXZlbnRMaXN0ZW5lciggJ2NsaWNrJywgZ2FtZS5zdGFydC5iaW5kKCBnYW1lICkgKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICB9XHJcbiAgICAgIGdhbWUuYWN0aW9uQ29udGFpbmVyLmFwcGVuZENoaWxkKCBlbGUgKTtcclxuICAgIH0pO1xyXG4gICAgZ2FtZS5nYW1lQ29udGFpbmVyLmFwcGVuZENoaWxkKCBnYW1lLmFjdGlvbkNvbnRhaW5lciApO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICog5ou85Zu+55qE5L+h5oGv5pi+56S66YOo5YiG55qE5Yid5aeL5YyWXHJcbiAgICovXHJcbiAgcHJpdmF0ZSBpbml0SW5mbygpe1xyXG4gICAgbGV0IGdhbWUgPSB0aGlzO1xyXG5cclxuICAgIFsgXCJ0aW1lXCIsIFwic3RlcFwiIF0uZm9yRWFjaCggZnVuY3Rpb24oIHZhbHVlICl7XHJcbiAgICAgIGxldCBkaXZFbGUgPSAkY3JlYXRlRWxlKCAnZGl2JywgdW5kZWZpbmVkLCAnaW5mby1pdGVtJyApO1xyXG4gICAgICBsZXQgdGl0bGUgPSAkY3JlYXRlRWxlKCAnc3BhbicsIHVuZGVmaW5lZCwgJ3RpdGxlJyApO1xyXG4gICAgICBsZXQgY29udGVudCA9ICRjcmVhdGVFbGUoICdzcGFuJyApO1xyXG5cclxuICAgICAgdGl0bGUuaW5uZXJIVE1MID0gYCR7dmFsdWV9OmA7XHJcbiAgICAgIGNvbnRlbnQuaW5uZXJIVE1MID0gJzAnO1xyXG4gICAgICBnYW1lWyBgJHt2YWx1ZX1JbmZvRWxlYCBdID0gY29udGVudDtcclxuXHJcbiAgICAgIGRpdkVsZS5hcHBlbmRDaGlsZCggdGl0bGUgKTtcclxuICAgICAgZGl2RWxlLmFwcGVuZENoaWxkKCBjb250ZW50ICk7XHJcbiAgICAgIGdhbWUuaW5mb0NvbnRhaW5lci5hcHBlbmRDaGlsZCggZGl2RWxlICk7XHJcbiAgICB9KVxyXG4gICAgZ2FtZS5nYW1lQ29udGFpbmVyLmFwcGVuZENoaWxkKCBnYW1lLmluZm9Db250YWluZXIgKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIOagueaNruiKgueCueeahOaVsOe7hOihqOekuuadpeiuvue9ruWbvueJh+eJh+auteeahOS9jee9rlxyXG4gICAqL1xyXG4gIHByaXZhdGUgc2V0U3RhdHVzQnlOb2RlKCBub2RlOiBOb2RlICl7XHJcbiAgICAvLyBsZXQgaW1nRWxlbWVudHMgPSB0aGlzLmltZ0NvbnRhaW5lci5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFwiaXRlbVwiKTtcclxuICAgIGZvciAoIGxldCBrID0gMCwgbGVuID0gbm9kZS52YWx1ZS5sZW5ndGg7IGsgPCBsZW47IGsgKysgKXtcclxuICAgICAgbGV0IHBvcyA9ICggayA9PT0gbGVuIC0gMSApID8gMCA6IGsgKyAxOztcclxuICAgICAgbGV0IHYgPSAoIG5vZGUudmFsdWVba10gPT09IDAgKSA/IGxlbiA6IG5vZGUudmFsdWVba107XHJcbiAgICAgICRyZXBsYWNlQ2xhc3MoIHRoaXMuaW1nRWxlbWVudHNbdiAtIDFdLCBgcG9zLSR7cG9zfWAsICdwb3MnICk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiDlm77niYfniYfmrrXkuIrnmoQgY2xpY2sg5LqL5Lu25aSE55CG5Ye95pWw77yM55So5p2l56e75Yqo5Zu+54mH54mH5q61XHJcbiAgICovXHJcbiAgcHJpdmF0ZSBpbWdGcmFnbWVudEhhbmRsZXIoZSl7XHJcbiAgICBsZXQgaW1nSWQgPSAkZ2V0SW1nSWQoIGUudGFyZ2V0LmNsYXNzTmFtZSApO1xyXG4gICAgbGV0IG5vblplcm9EaXIgPSB0aGlzLmN1cnJlbnROb2RlLmdldE5vblplcm9EaXJlY3Rpb24oKTtcclxuICAgIGlmICggbm9uWmVyb0RpcltpbWdJZF0gKXtcclxuICAgICAgbGV0IGRpcmVjdGlvbiA9IERJUkVDVElPTlsgYCR7bm9uWmVyb0RpclsgaW1nSWQgXX1gIF07XHJcbiAgICAgIHRoaXMuY3VycmVudE5vZGUubW92ZVRvKCBkaXJlY3Rpb24gKTtcclxuICAgICAgJGV4Y2hhbmdlUG9zKCB0aGlzLmJsYW5rSW1nRWxlLCBlLnRhcmdldCApO1xyXG4gICAgfVxyXG4gIH1cclxufVxyXG4iLCJpbXBvcnQgTm9kZSBmcm9tICcuL25vZGUnO1xyXG5pbXBvcnQgeyBiZWxvbmdUbyB9IGZyb20gJy4vdXRpbCc7XHJcbi8vIEhlYXAgT24gVG9wXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEhlYXB7XHJcbiAgaGVhcDogTm9kZVtdID0gW11cclxuICBiX2hlYXA6IGJlbG9uZ1RvID0ge31cclxuICBrZXk6IHN0cmluZ1xyXG4gIGNvbnN0cnVjdG9yKCBub2RlTGlzdDogTm9kZVtdLCBrZXk6IHN0cmluZyApe1xyXG4gICAgdGhpcy5rZXkgPSBrZXk7XHJcbiAgICAvLyDnlKjkvp3mrKHmj5LlhaXnmoTmlrnlvI/mnoTpgKDliJ3lp4vnmoTlsI/pobbloIZcclxuICAgIGxldCBpID0gMCxcclxuICAgICAgICBsZW4gPSBub2RlTGlzdC5sZW5ndGg7XHJcbiAgICBmb3IgKCA7IGkgPCBsZW47IGkgKysgKXtcclxuICAgICAgdGhpcy5wdXNoKCBub2RlTGlzdFtpXSApO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLy8gcHVibGljIGZ1bmN0aW9uXHJcbiAgLy8gLS0tLS0tLS0tLS0tLS0tXHJcblxyXG4gIC8qKlxyXG4gICAqIOiOt+WPluWghuS4reS4i+agh+S4uiBpbmRleCDnmoTlgLxcclxuICAgKi9cclxuICBnZXQoIGluZGV4OiBudW1iZXIgKXtcclxuICAgIGlmICggaW5kZXggPj0gMCAmJiBpbmRleCA8IHRoaXMuaGVhcC5sZW5ndGggKXtcclxuICAgICAgcmV0dXJuIHRoaXMuaGVhcFsgaW5kZXggXVsgdGhpcy5rZXkgXTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIOWQkeWghuS4reaPkuWFpeS4gOS4quaWsOeahOWFg+e0oOW5tuiwg+aVtOWghlxyXG4gICAqIOaWsOWFg+e0oOS7juaVsOe7hOWwvumDqOaPkuWFpe+8jOeEtuWQjuWvueaWsOWFg+e0oOaJp+ihjOS4iua1ruiwg+aVtFxyXG4gICAqL1xyXG4gIHB1c2goIG5vZGU6IE5vZGUgKXtcclxuICAgIHRoaXMuaGVhcC5wdXNoKCBub2RlICk7XHJcbiAgICB0aGlzLnNldEJIZWFwKCB0aGlzLmhlYXAubGVuZ3RoIC0gMSApO1xyXG4gICAgdGhpcy5nb1VwKCB0aGlzLmhlYXAubGVuZ3RoIC0gMSApO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICog5Yig6Zmk5bm26L+U5Zue5aCG6aG25YWD57Sg5bm26LCD5pW05aCGXHJcbiAgICog5YWI5bCG5aCG6aG25YWD57Sg5LiO5pWw57uE5pyr5bC+5YWD57Sg5LqS5o2i77yM54S25ZCO5by55Ye65pWw57uE5pyr5bC+55qE5YWD57Sg77yM5pyA5ZCO5a+55aCG6aG25YWD57Sg5omn6KGM5LiL5rKJ5pON5L2cXHJcbiAgICovXHJcbiAgcG9wKCl7XHJcbiAgICBpZiAoIHRoaXMuaXNFbXB0eSgpICkgcmV0dXJuO1xyXG4gICAgbGV0IHJlc3VsdDtcclxuICAgIHRoaXMuc3dhcCggMCwgdGhpcy5oZWFwLmxlbmd0aCAtIDEgKTtcclxuICAgIHJlc3VsdCA9IHRoaXMuaGVhcC5wb3AoKTtcclxuICAgIHRoaXMucmVtb3ZlQkhlYXAoIHJlc3VsdC5nZXRWYWxTdHIoKSApO1xyXG4gICAgIXRoaXMuaXNFbXB0eSgpICYmIHRoaXMuZ29Eb3duKDApO1xyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIOenu+mZpOWghuS4reS4i+agh+S4uiBpbmRleCDnmoTlhYPntKBcclxuICAgKiDlsIbpnIDnp7vpmaTnmoTpobnkuI7loIbpobbkupLmjaLvvIznhLblkI7lvLnlh7rloIbpobbvvIzmnIDlkI7lr7nkupLmjaLpobnvvIjljp/loIbpobbvvInmiafooYzkuIrmta7mk43kvZxcclxuICAgKi9cclxuICByZW1vdmUoIGluZGV4OiBudW1iZXIgKXtcclxuICAgIGlmKCBpbmRleCA8IDAgfHwgaW5kZXggPj0gdGhpcy5oZWFwLmxlbmd0aCApIHJldHVybjtcclxuICAgIHRoaXMuc3dhcCggMCwgaW5kZXggKTtcclxuICAgIHRoaXMucG9wKCk7XHJcbiAgICB0aGlzLmdvVXAoIGluZGV4ICk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiDojrflj5bloIbpobblhYPntKBcclxuICAgKi9cclxuICB0b3AoKXtcclxuICAgIHJldHVybiB0aGlzLmhlYXAubGVuZ3RoICYmIHRoaXMuaGVhcFswXTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIOWIpOaWreWghuaYr+WQpuS4uuepulxyXG4gICAqL1xyXG4gIGlzRW1wdHkoKXtcclxuICAgIHJldHVybiAhdGhpcy5oZWFwLmxlbmd0aDtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIOWIpOaWreWghuS4reaYr+WQpuacieWFg+e0oCBub2RlXHJcbiAgICovXHJcbiAgZ2V0SXRlbUluZGV4KCBub2RlOiBOb2RlICl7XHJcbiAgICByZXR1cm4gdGhpcy5iX2hlYXBbIG5vZGUuZ2V0VmFsU3RyKCkgXTtcclxuICB9XHJcblxyXG4gIC8vIHByaXZhdGUgZnVuY3Rpb25cclxuICAvLyAtLS0tLS0tLS0tLS0tLS1cclxuXHJcbiAgLyoqXHJcbiAgICog6L+U5Zue5aCG5Lit5LiL5qCH5Li6IGluZGV4IOeahOWFg+e0oFxyXG4gICAqL1xyXG4gIHByaXZhdGUgZ2V0VmFsdWUoIGluZGV4OiBudW1iZXIgKXtcclxuICAgIGlmKCBpbmRleCA8IDAgfHwgaW5kZXggPj0gdGhpcy5oZWFwLmxlbmd0aCApIHJldHVybjtcclxuICAgIHJldHVybiB0aGlzLmhlYXBbaW5kZXhdW3RoaXMua2V5XTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIOWghuS4reS4i+agh+S4uiBpbmRleCDnmoTlhYPntKDnmoTkuIrmta7mk43kvZxcclxuICAgKi9cclxuICBwcml2YXRlIGdvVXAoaW5kZXg6IG51bWJlcil7XHJcbiAgICBsZXQgdmFsdWUgPSB0aGlzLmdldFZhbHVlKGluZGV4KSxcclxuICAgICAgICBwYXJlbnQgPSB0aGlzLmdldFBhcmVudEluZGV4KGluZGV4KTtcclxuXHJcbiAgICBpZiAoIHBhcmVudCA9PT0gdW5kZWZpbmVkICkgcmV0dXJuO1xyXG5cclxuICAgIGlmICggdGhpcy5nZXRWYWx1ZSggcGFyZW50ICkgPiB0aGlzLmdldFZhbHVlKCBpbmRleCApICl7XHJcbiAgICAgIHRoaXMuc3dhcCggaW5kZXgsIHBhcmVudCApO1xyXG4gICAgICB0aGlzLmdvVXAoIHBhcmVudCApO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICog5aCG5Lit5LiL5qCH5Li6IGluZGV4IOeahOWFg+e0oOeahOS4i+ayieaTjeS9nFxyXG4gICAqL1xyXG4gIHByaXZhdGUgZ29Eb3duKGluZGV4OiBudW1iZXIpe1xyXG4gICAgbGV0IHZhbHVlID0gdGhpcy5nZXRWYWx1ZShpbmRleCksXHJcbiAgICAgICAgW2xlZnQsIHJpZ2h0XSA9IHRoaXMuZ2V0Q2hpbGRJbmRleChpbmRleCksXHJcbiAgICAgICAgc3dhcEluZGV4ID0gbGVmdDtcclxuXHJcbiAgICAvLyDlhYPntKDmmK/lj7blrZDoioLngrnvvIzmsqHmnInlrZDlhYPntKBcclxuICAgIGlmICggbGVmdCA9PT0gbnVsbCApIHJldHVybjtcclxuXHJcbiAgICAvLyDoi6XlhYPntKDmnInkuKTkuKrlrZDlhYPntKDvvIzorr7nva4gc3dhcEluZGV4IOS4uui+g+Wwj+eahOmCo+S4quWtkOWFg+e0oOeahOS4i+agh1xyXG4gICAgLy8g6Iul5YWD57Sg5Y+q5pyJ5bem5YS/5a2Q77yMc3dhcEluZGV4IOW3sue7j+iiq+WIneWni+WMluS4uiBsZWZ0IOeahOWAvOS6hlxyXG4gICAgaWYgKCByaWdodCApe1xyXG4gICAgICBzd2FwSW5kZXggPSB0aGlzLmdldFZhbHVlKGxlZnQpIDwgdGhpcy5nZXRWYWx1ZShyaWdodCkgPyBsZWZ0IDogcmlnaHQ7XHJcbiAgICB9XHJcblxyXG4gICAgLy8g5q+U6L6D54i25YWD57Sg5ZKM6L6D5bCP55qE6YKj5Liq5a2Q5YWD57Sg55qE5YC877yM6Iul54i25YWD57Sg55qE5YC86L6D5aSn77yM5YiZ572u5o2i54i25YWD57Sg5ZKM6L6D5bCP55qE5a2Q5YWD57SgXHJcbiAgICAvLyDnhLblkI7lnKjmlrDnmoTnva7mjaLnmoTkvY3nva7lpITnu6fnu63miafooYzkuIvmsonmk43kvZxcclxuICAgIGlmICggdGhpcy5nZXRWYWx1ZShzd2FwSW5kZXgpIDwgdmFsdWUgKSB7XHJcbiAgICAgIHRoaXMuc3dhcCggaW5kZXgsIHN3YXBJbmRleCApO1xyXG4gICAgICB0aGlzLmdvRG93biggc3dhcEluZGV4ICk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiDojrflj5bkuIvmoIfkuLogaW5kZXgg55qE5YWD57Sg5Zyo5aCG5Lit55qE54i25YWD57SgXHJcbiAgICovXHJcbiAgcHJpdmF0ZSBnZXRQYXJlbnRJbmRleCggaW5kZXg6IG51bWJlciApe1xyXG4gICAgaWYgKCBpbmRleCA8IDAgfHwgaW5kZXggPj0gdGhpcy5oZWFwLmxlbmd0aCApIHJldHVybjtcclxuICAgIGlmICggaW5kZXggPT09IDAgKSByZXR1cm4gMDtcclxuICAgIHJldHVybiBNYXRoLmZsb29yKCAoaW5kZXgtMSkvMiApO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICog6I635Y+W5LiL5qCH5Li6IGluZGV4IOeahOWFg+e0oOWcqOWghuS4reeahOWtkOWFg+e0oO+8jOe8uuWkseeahOWtkOWFg+e0oOeUqCBudWxsIOS7o+abv1xyXG4gICAqL1xyXG4gIHByaXZhdGUgZ2V0Q2hpbGRJbmRleCggaW5kZXg6IG51bWJlciApe1xyXG4gICAgbGV0IGxlZnQgPSAyKmluZGV4ICsgMSxcclxuICAgICAgICByaWdodCA9IDIqaW5kZXggKyAyLFxyXG4gICAgICAgIGxlbmd0aCA9IHRoaXMuaGVhcC5sZW5ndGg7XHJcblxyXG4gICAgaWYgKCByaWdodCA8PSBsZW5ndGggLSAxICl7XHJcbiAgICAgIHJldHVybiBbIGxlZnQsIHJpZ2h0IF07XHJcbiAgICB9IGVsc2UgaWYgKCBsZWZ0ID09PSBsZW5ndGggLSAxICkge1xyXG4gICAgICByZXR1cm4gWyBsZWZ0LCBudWxsIF07XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICByZXR1cm4gWyBudWxsLCBudWxsIF07XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiDkuqTmjaLloIbkuK3kuIvmoIfliIbliKvkuLogaW5kZXgxIOWSjCBpbmRleDIg55qE5Lik5Liq5YWD57SgXHJcbiAgICovXHJcbiAgcHJpdmF0ZSBzd2FwKCBpbmRleDE6IG51bWJlciwgaW5kZXgyOiBudW1iZXIgKXtcclxuICAgIGxldCB0bXAgPSB0aGlzLmhlYXBbaW5kZXgxXTtcclxuICAgIHRoaXMuaGVhcFtpbmRleDFdID0gdGhpcy5oZWFwW2luZGV4Ml07XHJcbiAgICB0aGlzLmhlYXBbaW5kZXgyXSA9IHRtcDtcclxuXHJcbiAgICB0aGlzLnNldEJIZWFwKCBpbmRleDEgKTtcclxuICAgIHRoaXMuc2V0QkhlYXAoIGluZGV4MiApO1xyXG4gIH1cclxuICBwcml2YXRlIHNldEJIZWFwKCBpbmRleDogbnVtYmVyICl7XHJcbiAgICB0aGlzLmJfaGVhcFsgdGhpcy5oZWFwWyBpbmRleCBdLmdldFZhbFN0cigpIF0gPSBpbmRleDtcclxuICB9XHJcbiAgcHJpdmF0ZSByZW1vdmVCSGVhcCggc3RyOiBzdHJpbmcgKXtcclxuICAgIGRlbGV0ZSB0aGlzLmJfaGVhcFsgc3RyIF07XHJcbiAgfVxyXG59XHJcbiIsImltcG9ydCBHYW1lIGZyb20gXCIuL2dhbWVcIjtcclxubGV0IGdhbWUgPSBuZXcgR2FtZSggXCJjb250YWluZXJcIiwgMyApO1xyXG5cclxuY29uc29sZS5sb2coIGdhbWUgKTtcclxuY29uc29sZS5sb2coIFwiLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXCIgKTtcclxuXHJcbi8vIGltcG9ydCBtaW5IZWFwIGZyb20gJy4vbWluLWhlYXAnO1xyXG4vL1xyXG4vLyBjb25zb2xlLmxvZyggXCItLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cIiApO1xyXG4vL1xyXG4vLyBsZXQgaGVhcCA9IG5ldyBtaW5IZWFwKCBbIDMsIDUsIDQsIDEsIDIsIDE5LCAxOCwgMjIsIDEyLCA3XSApO1xyXG4vL1xyXG4vLyBjb25zb2xlLmxvZyggaGVhcC5oZWFwICk7XHJcbi8vXHJcbi8vIC8vIGZvciAoIGxldCBpID0gMCwgbGVuID0gaGVhcC5oZWFwLmxlbmd0aDsgaSA8IGxlbjsgaSArKyApe1xyXG4vLyAvLyAgIGNvbnNvbGUubG9nKCBoZWFwLnBvcCgpICk7XHJcbi8vIC8vICAgY29uc29sZS5sb2coIGhlYXAuaGVhcCApO1xyXG4vLyAvLyB9XHJcbi8vIC8vXHJcbi8vIC8vIGNvbnNvbGUubG9nKCBoZWFwLnBvcCgpICk7XHJcbi8vIC8vIGNvbnNvbGUubG9nKCBoZWFwLmhlYXAgKTtcclxuIiwiaW1wb3J0IHsgRElSRUNUSU9OIH0gZnJvbSAnLi91dGlsJztcclxuXHJcbi8vIExFVCBESVJFQ1RJT04gPSBbICdOT05FJywgJ1VQJywgJ1JJR0hUJywgJ0RPV04nLCAnTEVGVCcgXTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE5vZGV7XHJcbiAgdmFsdWU6IG51bWJlcltdXHJcbiAgemVyb0luZGV4OiBudW1iZXJcclxuICBzY2FsZTogbnVtYmVyXHJcbiAgcGFyZW50OiBOb2RlXHJcbiAgRjogbnVtYmVyID0gMFxyXG4gIEc6IG51bWJlciA9IDBcclxuICBjb25zdHJ1Y3Rvciggc2NhbGU6IG51bWJlciwgaW5pdEFycj86IG51bWJlcltdICkge1xyXG4gICAgdGhpcy5zY2FsZSA9IHNjYWxlO1xyXG4gICAgdGhpcy52YWx1ZSA9IGluaXRBcnIgPyBpbml0QXJyIDogdGhpcy5pbml0Tm9kZVZhbHVlQnlTY2FsZSggc2NhbGUgKTtcclxuICAgIHRoaXMuemVyb0luZGV4ID0gTWF0aC5wb3coc2NhbGUsIDIpIC0gMTtcclxuXHJcbiAgICAvLyB0aGlzLnBhcmVudCA9IG5ldyBOb2RlKHRoaXMuc2NhbGUpO1xyXG4gIH1cclxuXHJcbiAgLy8gcHVibGljIGZ1bmN0aW9uXHJcbiAgLy8gLS0tLS0tLS0tLS0tLS0tXHJcblxyXG4gIC8qKlxyXG4gICAqIOiOt+WPluiKgueCueeahOWAvO+8jOWwhuiKgueCueeahOaVsOe7hOihqOekuui9rOaNouaIkOWtl+espuS4suihqOekuuW5tui/lOWbnlxyXG4gICAqL1xyXG4gIGdldFZhbFN0cigpe1xyXG4gICAgcmV0dXJuIHRoaXMudmFsdWUudG9TdHJpbmcoKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIOiKgueCueeahOS5seW6j+eul+azlVxyXG4gICAqIOmaj+acuuaMh+WumuS4gOS4quaWueWQke+8jOS7pOiKgueCueWQkeivpeaWueWQkeenu+WKqO+8jOmHjeWkjeS4iui/sOi/h+eoi+iLpeW5suasoei+vuWIsOS5seW6j+eahOebrueahFxyXG4gICAqL1xyXG4gIHNodWZmbGUoKXtcclxuICAgIGZvciggbGV0IGkgPSAwOyBpIDwgNTAwMDsgaSArKyApe1xyXG4gICAgICBsZXQgZGlyZWN0aW9uID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogNCArIDEpO1xyXG4gICAgICB0aGlzLm1vdmVUbyggZGlyZWN0aW9uICk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiDlvZPliY3oioLngrnlkJHmlrnlkJEgZGlyZWN0aW9uIOenu+WKqOS4gOasoVxyXG4gICAqIOWFtuWunuaYr+iKgueCueeahOaVsOe7hOihqOekuuS4reeahOaVsOWtlyAwIOWQkeaWueWQkSBkaXJlY3Rpb24g56e75Yqo5LiA5qyhXHJcbiAgICovXHJcbiAgbW92ZVRvKCBkaXJlY3Rpb246IG51bWJlciApe1xyXG4gICAgaWYgKCAhdGhpcy5jYW5Nb3ZlVG8oIGRpcmVjdGlvbiApICkgcmV0dXJuO1xyXG4gICAgbGV0IHRhcmdldEluZGV4ID0gdGhpcy5nZXRUYXJnZXRJbmRleCggZGlyZWN0aW9uICk7XHJcblxyXG4gICAgdGhpcy52YWx1ZVsgdGhpcy56ZXJvSW5kZXggXSA9IHRoaXMudmFsdWVbIHRhcmdldEluZGV4IF07XHJcbiAgICB0aGlzLnZhbHVlWyB0YXJnZXRJbmRleCBdID0gMDtcclxuICAgIHRoaXMuemVyb0luZGV4ID0gdGFyZ2V0SW5kZXg7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiDojrflj5blvZPliY3oioLngrnnmoTlj6/og73np7vliqjmlrnlkJHvvIjnlKggMCDkvY3nmoTnp7vliqjov5vooYzooajnpLrvvIlcclxuICAgKi9cclxuICBnZXRaZXJvRGlyZWN0aW9uKCl7XHJcbiAgICBsZXQgbm9kZSA9IHRoaXM7XHJcbiAgICBsZXQgRGlyZWN0aW9uID0ge307XHJcbiAgICBbIFwiVVBcIiwgXCJSSUdIVFwiLCBcIkRPV05cIiwgXCJMRUZUXCIgXS5mb3JFYWNoKCBmdW5jdGlvbihkaXIpe1xyXG4gICAgICBsZXQgX2RpciA9IERJUkVDVElPTltkaXJdO1xyXG4gICAgICBpZiAoIG5vZGUuY2FuTW92ZVRvKCBfZGlyICkgKXtcclxuICAgICAgICBsZXQgdGFyZ2V0SW5kZXggPSBub2RlLmdldFRhcmdldEluZGV4KCBfZGlyICk7XHJcbiAgICAgICAgRGlyZWN0aW9uWyBkaXIgXSA9IGAke25vZGUudmFsdWVbIHRhcmdldEluZGV4IF19YDtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgICByZXR1cm4gRGlyZWN0aW9uO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICog5bCG5b2T5YmN6IqC54K555qE5Y+v6IO956e75Yqo5pa55ZCR55Sx55SoIDAg5L2N55qE56e75Yqo5p2l6KGo56S66L2s5o2i5oiQ55SoIDAg5L2N6YK75o6l55qE6Z2eIDAg5pWw5a2X55qE56e75Yqo5p2l6L+b6KGM6KGo56S6XHJcbiAgICovXHJcbiAgZ2V0Tm9uWmVyb0RpcmVjdGlvbigpe1xyXG4gICAgbGV0IERpcmVjdGlvbiA9IHt9O1xyXG4gICAgbGV0IHplcm9EaXIgPSB0aGlzLmdldFplcm9EaXJlY3Rpb24oKTtcclxuICAgIGZvciAoIGxldCB2YWwgaW4gemVyb0RpciApe1xyXG4gICAgICAvLyBsZXQgX3ZhbDtcclxuICAgICAgLy8gc3dpdGNoKCB2YWwgKXtcclxuICAgICAgLy8gICBjYXNlIFwiVVBcIjpcclxuICAgICAgLy8gICAgIF92YWwgPSBcIkRPV05cIjtcclxuICAgICAgLy8gICAgIGJyZWFrO1xyXG4gICAgICAvLyAgIGNhc2UgXCJSSUdIVFwiOlxyXG4gICAgICAvLyAgICAgX3ZhbCA9IFwiTEVGVFwiO1xyXG4gICAgICAvLyAgICAgYnJlYWs7XHJcbiAgICAgIC8vICAgY2FzZSBcIkRPV05cIjpcclxuICAgICAgLy8gICAgIF92YWwgPSBcIlVQXCI7XHJcbiAgICAgIC8vICAgICBicmVhaztcclxuICAgICAgLy8gICBjYXNlIFwiTEVGVFwiOlxyXG4gICAgICAvLyAgICAgX3ZhbCA9IFwiUklHSFRcIjtcclxuICAgICAgLy8gICAgIGJyZWFrO1xyXG4gICAgICAvLyB9XHJcbiAgICAgIC8vIERpcmVjdGlvblsgemVyb0RpclsgdmFsIF0gXSA9IF92YWw7XHJcblxyXG4gICAgICBEaXJlY3Rpb25bIHplcm9EaXJbIHZhbCBdIF0gPSB2YWw7XHJcbiAgICB9XHJcbiAgICBjb25zb2xlLmxvZyggRGlyZWN0aW9uICk7XHJcbiAgICByZXR1cm4gRGlyZWN0aW9uO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICog6I635Y+W5b2T5YmN6IqC54K55Zyo5Y+v56e75Yqo5pa55ZCR5LiK55qE5a2Q6IqC54K55pWw57uEXHJcbiAgICovXHJcbiAgZ2V0TmV4dE5vZGVzKCl7XHJcbiAgICBsZXQgbm9kZSA9IHRoaXM7XHJcbiAgICBsZXQgbmV4dE5vZGVzOiBOb2RlW10gPSBbXTtcclxuICAgIFsgRElSRUNUSU9OLlVQLCBESVJFQ1RJT04uUklHSFQsIERJUkVDVElPTi5ET1dOLCBESVJFQ1RJT04uTEVGVCBdLmZvckVhY2goIGZ1bmN0aW9uKGRpcmVjdGlvbil7XHJcbiAgICAgIGlmICggbm9kZS5jYW5Nb3ZlVG8oIGRpcmVjdGlvbiApICl7XHJcbiAgICAgICAgbGV0IG5ld05vZGUgPSBOb2RlLm5vZGVDbG9uZSggbm9kZSApO1xyXG4gICAgICAgIG5ld05vZGUucGFyZW50ID0gbm9kZTtcclxuICAgICAgICBuZXdOb2RlLm1vdmVUbyhkaXJlY3Rpb24pO1xyXG4gICAgICAgIG5leHROb2Rlcy5wdXNoKCBuZXdOb2RlICk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gICAgcmV0dXJuIG5leHROb2RlcztcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIOWIpOaWreW9k+WJjeiKgueCue+8iOiKgueCueS4reeahCAwIOS9je+8ieaYr+WQpuWPr+S7peayvyBkaXJlY3Rpb24g5pa55ZCR56e75YqoXHJcbiAgICovXHJcbiAgY2FuTW92ZVRvKCBkaXJlY3Rpb246IG51bWJlciApe1xyXG4gICAgbGV0IHJvdyA9IE1hdGguZmxvb3IoIHRoaXMuemVyb0luZGV4IC8gdGhpcy5zY2FsZSApO1xyXG4gICAgbGV0IGNvbCA9IHRoaXMuemVyb0luZGV4ICUgdGhpcy5zY2FsZTtcclxuXHJcbiAgICBzd2l0Y2goIGRpcmVjdGlvbiApe1xyXG4gICAgICBjYXNlIERJUkVDVElPTi5VUDpcclxuICAgICAgICByZXR1cm4gcm93ICE9PSAwO1xyXG4gICAgICBjYXNlIERJUkVDVElPTi5SSUdIVDpcclxuICAgICAgICByZXR1cm4gY29sICE9PSB0aGlzLnNjYWxlIC0gMTtcclxuICAgICAgY2FzZSBESVJFQ1RJT04uRE9XTjpcclxuICAgICAgICByZXR1cm4gcm93ICE9PSB0aGlzLnNjYWxlIC0gMTtcclxuICAgICAgY2FzZSBESVJFQ1RJT04uTEVGVDpcclxuICAgICAgICByZXR1cm4gY29sICE9PSAwO1xyXG4gICAgICBkZWZhdWx0OlxyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIOiOt+WPluS7juW9k+WJjeiKgueCuei1sOWIsOS4i+S4gOS4quiKgueCueeahOS7o+S7t1xyXG4gICAqL1xyXG4gIGdldENvc3RUb05leHQoKXtcclxuICAgIHJldHVybiAxO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICog6K6+572u6IqC54K555qEIEYg5YC877yM5aCG5Lya5qC55o2u6L+Z5Liq5YC86L+b6KGM5o6S5bqPXHJcbiAgICovXHJcbiAgc2V0RiggdmFsdWU6IG51bWJlciApe1xyXG4gICAgdGhpcy5GID0gdmFsdWU7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiDojrflj5boioLngrnnmoQgRyDlgLxcclxuICAgKi9cclxuICBnZXRHKCl7XHJcbiAgICByZXR1cm4gdGhpcy5HO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICog6K6+572u6IqC54K555qEIEcg5YC8XHJcbiAgICovXHJcbiAgc2V0RyggdmFsdWU6IG51bWJlciApe1xyXG4gICAgdGhpcy5HID0gdmFsdWU7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiDojrflj5boioLngrnnmoQgSCDlgLxcclxuICAgKi9cclxuICBnZXRIKCB0YXJnZXROb2RlOiBOb2RlICl7XHJcbiAgICBsZXQgaSA9IDAsXHJcbiAgICAgICAgbGVuID0gdGhpcy52YWx1ZS5sZW5ndGgsXHJcbiAgICAgICAgbWFuaGF0dGVuID0gMCxcclxuICAgICAgICBkaWZmID0gMDtcclxuXHJcbiAgICBmb3IgKCA7IGkgPCBsZW47IGkgKysgKXtcclxuICAgICAgaWYgKCB0aGlzLnZhbHVlW2ldICE9PSBpICsgMSApIGRpZmYgKys7XHJcblxyXG4gICAgICBsZXQgdiA9IHRoaXMudmFsdWVbaV07XHJcbiAgICAgIGlmKCB2ICE9PSAwICl7XHJcbiAgICAgICAgLy8gbm93IGluXHJcbiAgICAgICAgbGV0IHJvdyA9IE1hdGguZmxvb3IoIGkvdGhpcy5zY2FsZSApO1xyXG4gICAgICAgIGxldCBjb2wgPSBpJXRoaXMuc2NhbGU7XHJcbiAgICAgICAgLy8gc2hvdWxkIGluXHJcbiAgICAgICAgbGV0IF9yb3cgPSBNYXRoLmZsb29yKCB2L3RoaXMuc2NhbGUgKTtcclxuICAgICAgICBsZXQgX2NvbCA9IHYldGhpcy5zY2FsZTtcclxuXHJcbiAgICAgICAgbWFuaGF0dGVuICs9IE1hdGguYWJzKCByb3cgLSBfcm93ICkgKyBNYXRoLmFicyggY29sIC0gX2NvbCApO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIDEqbWFuaGF0dGVuICsgMTAwKmRpZmY7XHJcbiAgfVxyXG5cclxuICAvLyBwcml2YXRlIGZ1bmN0aW9uXHJcbiAgLy8gLS0tLS0tLS0tLS0tLS0tLVxyXG5cclxuICAvKipcclxuICAgKiDmoLnmja7nu7TluqYgc2NhbGUg5p6E6YCg6IqC54K555qE5Yid5aeL6KGo56S65pWw57uEXHJcbiAgICovXHJcbiAgcHJpdmF0ZSBpbml0Tm9kZVZhbHVlQnlTY2FsZSggc2NhbGU6IG51bWJlciApe1xyXG4gICAgbGV0IHZhbCA9IFtdO1xyXG4gICAgZm9yICggbGV0IGkgPSAxOyBpIDwgTWF0aC5wb3coc2NhbGUsIDIpOyBpICsrICl7XHJcbiAgICAgIHZhbC5wdXNoKCBpICk7XHJcbiAgICB9XHJcbiAgICB2YWwucHVzaCggMCApO1xyXG4gICAgcmV0dXJuIHZhbDtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIOiOt+WPluW9k+WJjeiKgueCueS4reWkhOS6jiAwIOS9jeeahOaWueWQkSBkaXJlY3Rpb24g5aSE55qE6YK75o6l5pWw5a2X55qE5LiL5qCHXHJcbiAgICovXHJcbiAgcHJpdmF0ZSBnZXRUYXJnZXRJbmRleCggZGlyZWN0aW9uOiBudW1iZXIgKXtcclxuICAgIGlmICggIXRoaXMuY2FuTW92ZVRvKCBkaXJlY3Rpb24gKSApIHJldHVybjtcclxuICAgIGxldCB0YXJnZXRJbmRleDtcclxuICAgIHN3aXRjaCggZGlyZWN0aW9uICl7XHJcbiAgICAgIGNhc2UgRElSRUNUSU9OLlVQOlxyXG4gICAgICAgIHRhcmdldEluZGV4ID0gdGhpcy56ZXJvSW5kZXggLSB0aGlzLnNjYWxlO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICBjYXNlIERJUkVDVElPTi5SSUdIVDpcclxuICAgICAgICB0YXJnZXRJbmRleCA9IHRoaXMuemVyb0luZGV4ICsgMTtcclxuICAgICAgICBicmVhaztcclxuICAgICAgY2FzZSBESVJFQ1RJT04uRE9XTjpcclxuICAgICAgICB0YXJnZXRJbmRleCA9IHRoaXMuemVyb0luZGV4ICsgdGhpcy5zY2FsZTtcclxuICAgICAgICBicmVhaztcclxuICAgICAgY2FzZSBESVJFQ1RJT04uTEVGVDpcclxuICAgICAgICB0YXJnZXRJbmRleCA9IHRoaXMuemVyb0luZGV4IC0gMTtcclxuICAgICAgICBicmVhaztcclxuICAgICAgZGVmYXVsdDpcclxuICAgICAgICB0YXJnZXRJbmRleCA9IHRoaXMuemVyb0luZGV4O1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHRhcmdldEluZGV4O1xyXG4gIH1cclxuXHJcbiAgLy8gc3RhdGljIGZ1bmN0aW9uXHJcbiAgLy8gLS0tLS0tLS0tLS0tLS0tXHJcblxyXG4gIC8qKlxyXG4gICAqIOWIpOaWreS4pOS4quiKgueCueaYr+WQpuebuOetiVxyXG4gICAqIOmAmui/h+WwhuiKgueCueeahOaVsOe7hOihqOekuui9rOaNouaIkOWtl+espuS4suadpei/m+ihjOavlOi+g1xyXG4gICAqL1xyXG4gIHN0YXRpYyBpc1NhbWUoIGN1cnJlbnROb2RlOiBOb2RlLCB0YXJnZXROb2RlOiBOb2RlICl7XHJcbiAgICByZXR1cm4gY3VycmVudE5vZGUuZ2V0VmFsU3RyKCkgPT09IHRhcmdldE5vZGUuZ2V0VmFsU3RyKCk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiDln7rkuo4gbm9kZSDlpI3liLbkuIDkuKrmlrDnmoToioLngrlcclxuICAgKi9cclxuICBzdGF0aWMgbm9kZUNsb25lKCBub2RlOiBOb2RlICl7XHJcbiAgICBsZXQgbmV3Tm9kZSA9IG5ldyBOb2RlKCBub2RlLnNjYWxlICk7XHJcbiAgICBuZXdOb2RlLnZhbHVlID0gbm9kZS52YWx1ZS5zbGljZSgwKTtcclxuICAgIG5ld05vZGUuemVyb0luZGV4ID0gbm9kZS56ZXJvSW5kZXg7XHJcbiAgICByZXR1cm4gbmV3Tm9kZTtcclxuICB9XHJcbn1cclxuIiwiZXhwb3J0IGVudW0gRElSRUNUSU9OICB7IFVQID0gMSwgUklHSFQsIERPV04sIExFRlQgfVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBiZWxvbmdUb3tcclxuICAgIFtwcm9wTmFtZTogc3RyaW5nXTogbnVtYmVyO1xyXG59O1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uICRpZChlbGVJZDogc3RyaW5nKXtcclxuICByZXR1cm4gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoIGVsZUlkICk7XHJcbn07XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gJGNyZWF0ZUVsZSggdGFnTmFtZTogc3RyaW5nLCBpZD86IHN0cmluZywgY2xhc3NOYW1lPzogc3RyaW5nICl7XHJcbiAgbGV0IGVsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoIHRhZ05hbWUgKTtcclxuICBpZiggaWQgKSBlbGUuaWQgPSBpZDtcclxuICBpZiggY2xhc3NOYW1lICkgZWxlLmNsYXNzTmFtZSA9IGNsYXNzTmFtZTtcclxuICByZXR1cm4gZWxlO1xyXG59O1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uICRyZXBsYWNlQ2xhc3MoIGVsZSwgbmV3Q2xhc3M6IHN0cmluZywgcHJlZml4OiBzdHJpbmcgICl7XHJcbiAgbGV0IHJlZyA9IG5ldyBSZWdFeHAoIGAke3ByZWZpeH0tKFxcXFxkKStgLCAnZycgKTtcclxuICBlbGUuY2xhc3NOYW1lID0gZWxlLmNsYXNzTmFtZS5yZXBsYWNlKCByZWcsIG5ld0NsYXNzICk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiAkYWRkQ2xhc3MoIGVsZSwgbmV3Q2xhc3M6IHN0cmluZyApe1xyXG4gIGlmICggZWxlLmNsYXNzTmFtZS5pbmRleE9mKCBuZXdDbGFzcyApID09PSAtMSApe1xyXG4gICAgZWxlLmNsYXNzTmFtZSA9IGAke2VsZS5jbGFzc05hbWV9ICR7bmV3Q2xhc3N9YDtcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiAkcmVtb3ZlQ2xhc3MoIGVsZSwgcmVtb3ZlOiBzdHJpbmcgKXtcclxuICBlbGUuY2xhc3NOYW1lID0gZWxlLmNsYXNzTmFtZS5yZXBsYWNlKCByZW1vdmUsICcnICkudHJpbSgpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gJGdldFBvcyggY2xhc3NOYW1lOiBzdHJpbmcgKXtcclxuICBsZXQgY2xhc3NBcnIgPSBjbGFzc05hbWUuc3BsaXQoJyAnKTtcclxuICBmb3IgKCBsZXQgaSA9IDAsIGxlbiA9IGNsYXNzQXJyLmxlbmd0aDsgaSA8IGxlbjsgaSArKyApe1xyXG4gICAgaWYgKCBjbGFzc0FycltpXS5pbmRleE9mKCAncG9zJyApICE9PSAtMSApe1xyXG4gICAgICAgIHJldHVybiBjbGFzc0FycltpXS5zcGxpdCgnLScpWzFdO1xyXG4gICAgfVxyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uICRnZXRJbWdJZCggY2xhc3NOYW1lOiBzdHJpbmcgKXtcclxuICBsZXQgY2xhc3NBcnIgPSBjbGFzc05hbWUuc3BsaXQoJyAnKTtcclxuICBmb3IgKCBsZXQgaSA9IDAsIGxlbiA9IGNsYXNzQXJyLmxlbmd0aDsgaSA8IGxlbjsgaSArKyApe1xyXG4gICAgaWYgKCBjbGFzc0FycltpXS5pbmRleE9mKCAnaXRlbS0nICkgIT09IC0xICl7XHJcbiAgICAgICAgcmV0dXJuIGNsYXNzQXJyW2ldLnNwbGl0KCctJylbMV07XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gJGV4Y2hhbmdlUG9zKCBpdGVtMSwgaXRlbTIgKXtcclxuICBsZXQgcG9zMSA9ICRnZXRQb3MoIGl0ZW0xLmNsYXNzTmFtZSApO1xyXG4gIGxldCBwb3MyID0gJGdldFBvcyggaXRlbTIuY2xhc3NOYW1lICk7XHJcblxyXG4gICRyZW1vdmVDbGFzcyggaXRlbTIsIGBwb3MtJHtwb3MyfWAgKTtcclxuICAkYWRkQ2xhc3MoIGl0ZW0yLCBgcG9zLSR7cG9zMX1gICk7XHJcbiAgJHJlbW92ZUNsYXNzKCBpdGVtMSwgYHBvcy0ke3BvczF9YCApO1xyXG4gICRhZGRDbGFzcyggaXRlbTEsIGBwb3MtJHtwb3MyfWAgKTtcclxufVxyXG4iXX0=
