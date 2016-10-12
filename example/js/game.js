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
     * 运行 A* 算法 ( 版本 2 ) 实验用
     */
    Astar.prototype.run2 = function () {
        var astar = this;
        var _loop_2 = function() {
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
            _loop_2();
        }
        var tailNode = astar.openList.top();
        this.solution = [];
        while (tailNode) {
            this.solution.push(tailNode);
            tailNode = tailNode.parent;
        }
        this.showSolution();
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
        this.running = false;
        this.imgContainerId = "image";
        this.actionContainerId = "action";
        this.infoId = "info";
        // 缓存所有的图片片段 dom，免得再找
        this.imgElements = [];
        this.currentNode = new node_1.default(scale);
        this.targetNode = new node_1.default(scale);
        this.scale = scale;
        this.gameContainerId = gameContainerId;
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
        if (this.running)
            return;
        this.currentNode.shuffle();
        this.setStatusByNode(this.currentNode);
    };
    /**
     * start 按钮执行函数
     * 执行 A* 算法
     */
    Game.prototype.start = function () {
        var game = this;
        if (game.running)
            return;
        game.running = true;
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
        this.running = false;
        this.imgContainer.className = 'win';
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
// let game = new Game( "container", 5 );
console.log(game);
console.log("------------------------");
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
        return 2 * manhatten + 100 * diff;
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
function $removeClass(ele, remove) {
    ele.className = ele.className.replace(remove, '').trim();
}
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvdHMvYXN0YXIudHMiLCJzcmMvdHMvZ2FtZS50cyIsInNyYy90cy9oZWFwLnRzIiwic3JjL3RzL21haW4udHMiLCJzcmMvdHMvbm9kZS50cyIsInNyYy90cy91dGlsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOztBQ0FBLHFCQUFpQixRQUFRLENBQUMsQ0FBQTtBQUMxQixxQkFBaUIsUUFBUSxDQUFDLENBQUE7QUFHMUI7O0dBRUc7QUFDSDtJQVNFLGVBQWEsU0FBZSxFQUFFLFVBQWdCO1FBUDlDLGVBQVUsR0FBVyxFQUFFLENBQUE7UUFJZixpQkFBWSxHQUFhLEVBQUUsQ0FBQTtRQUMzQixhQUFRLEdBQVcsRUFBRSxDQUFBO1FBRzNCLElBQUksQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFDO1FBQzNCLElBQUksQ0FBQyxVQUFVLEdBQUcsVUFBVSxDQUFDO1FBQzdCLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxjQUFJLENBQUUsQ0FBRSxTQUFTLENBQUUsRUFBRSxHQUFHLENBQUUsQ0FBQztJQUNqRCxDQUFDO0lBRUQsa0JBQWtCO0lBQ2xCLGtCQUFrQjtJQUVsQjs7T0FFRztJQUNILG1CQUFHLEdBQUg7UUFDRSxJQUFJLEtBQUssR0FBRyxJQUFJLENBQUM7UUFDakI7WUFDRSxJQUFJLFdBQVcsR0FBRyxLQUFLLENBQUMsUUFBUSxDQUFDLEdBQUcsRUFBRSxDQUFDO1lBQ3ZDLEtBQUssQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFFLFdBQVcsQ0FBRSxDQUFDO1lBQ3JDLEtBQUssQ0FBQyxZQUFZLENBQUUsV0FBVyxDQUFDLFNBQVMsRUFBRSxDQUFFLEdBQUcsQ0FBQyxDQUFDO1lBRWxELElBQUksU0FBUyxHQUFHLFdBQVcsQ0FBQyxZQUFZLEVBQUUsQ0FBQztZQUUzQyxTQUFTLENBQUMsT0FBTyxDQUFDLFVBQVMsUUFBUTtnQkFDakMsSUFBSSxJQUFJLEdBQUcsV0FB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SyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ3BDLEdBQUcsQ0FBQyxDQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxHQUFHLEdBQUcsUUFBUSxDQUFDLE1BQU0sRUFBRSxDQUFDLEdBQUcsR0FBRyxFQUFFLENBQUMsRUFBRyxFQUFFLENBQUM7UUFDdEQsRUFBRSxDQUFDLENBQUUsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBRSxPQUFPLENBQUUsS0FBSyxDQUFDLENBQUUsQ0FBQyxDQUFBLENBQUM7WUFDekMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDckMsQ0FBQztJQUNILENBQUM7QUFDSCxDQUFDO0FBUGUsaUJBQVMsWUFPeEIsQ0FBQTtBQUVELHNCQUE4QixLQUFLLEVBQUUsS0FBSztJQUN4QyxJQUFJLElBQUksR0FBRyxPQUFPLENBQUUsS0FBSyxDQUFDLFNBQVMsQ0FBRSxDQUFDO0lBQ3RDLElBQUksSUFBSSxHQUFHLE9BQU8sQ0FBRSxLQUFLLENBQUMsU0FBUyxDQUFFLENBQUM7SUFFdEMsWUFBWSxDQUFFLEtBQUssRUFBRSxTQUFPLElBQU0sQ0FBRSxDQUFDO0lBQ3JDLFNBQVMsQ0FBRSxLQUFLLEVBQUUsU0FBTyxJQUFNLENBQUUsQ0FBQztJQUNsQyxZQUFZLENBQUUsS0FBSyxFQUFFLFNBQU8sSUFBTSxDQUFFLENBQUM7SUFDckMsU0FBUyxDQUFFLEtBQUssRUFBRSxTQUFPLElBQU0sQ0FBRSxDQUFDO0FBQ3BDLENBQUM7QUFSZSxvQkFBWSxlQVEzQixDQUFBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImltcG9ydCBOb2RlIGZyb20gJy4vbm9kZSc7XHJcbmltcG9ydCBIZWFwIGZyb20gJy4vaGVhcCc7XHJcbmltcG9ydCB7IGJlbG9uZ1RvIH0gZnJvbSAnLi91dGlsJztcclxuXHJcbi8qKlxyXG4gKiBBKiDnrpfms5VcclxuICovXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEFzdGFye1xyXG4gIG9wZW5MaXN0OiBIZWFwXHJcbiAgY2xvc2VkTGlzdDogTm9kZVtdID0gW11cclxuICBzdGFydE5vZGU6IE5vZGVcclxuICB0YXJnZXROb2RlOiBOb2RlXHJcblxyXG4gIHByaXZhdGUgYl9jbG9zZWRMaXN0OiBiZWxvbmdUbyA9IHt9XHJcbiAgcHJpdmF0ZSBzb2x1dGlvbjogTm9kZVtdID0gW11cclxuXHJcbiAgY29uc3RydWN0b3IoIHN0YXJ0Tm9kZTogTm9kZSwgdGFyZ2V0Tm9kZTogTm9kZSApe1xyXG4gICAgdGhpcy5zdGFydE5vZGUgPSBzdGFydE5vZGU7XHJcbiAgICB0aGlzLnRhcmdldE5vZGUgPSB0YXJnZXROb2RlO1xyXG4gICAgdGhpcy5vcGVuTGlzdCA9IG5ldyBIZWFwKCBbIHN0YXJ0Tm9kZSBdLCBcIkZcIiApO1xyXG4gIH1cclxuXHJcbiAgLy8gcHVibGljIGZ1bmN0aW9uXHJcbiAgLy8gLS0tLS0tLS0tLS0tLS0tXHJcblxyXG4gIC8qKlxyXG4gICAqIOi/kOihjCBBKiDnrpfms5VcclxuICAgKi9cclxuICBydW4oKXtcclxuICAgIGxldCBhc3RhciA9IHRoaXM7XHJcbiAgICB3aGlsZSAoICFOb2RlLmlzU2FtZSggYXN0YXIub3Blbkxpc3QudG9wKCksIGFzdGFyLnRhcmdldE5vZGUgKSApe1xyXG4gICAgICBsZXQgY3VycmVudE5vZGUgPSBhc3Rhci5vcGVuTGlzdC5wb3AoKTtcclxuICAgICAgYXN0YXIuY2xvc2VkTGlzdC5wdXNoKCBjdXJyZW50Tm9kZSApO1xyXG4gICAgICBhc3Rhci5iX2Nsb3NlZExpc3RbIGN1cnJlbnROb2RlLmdldFZhbFN0cigpIF0gPSAxO1xyXG5cclxuICAgICAgbGV0IG5leHROb2RlcyA9IGN1cnJlbnROb2RlLmdldE5leHROb2RlcygpO1xyXG5cclxuICAgICAgbmV4dE5vZGVzLmZvckVhY2goZnVuY3Rpb24obmV4dE5vZGUpe1xyXG4gICAgICAgIGxldCBjb3N0ID0gY3VycmVudE5vZGUuZ2V0RygpICsgY3VycmVudE5vZGUuZ2V0Q29zdFRvTmV4dCgpO1xyXG4gICAgICAgIGxldCBpbmRleCA9ICBhc3Rhci5vcGVuTGlzdC5nZXRJdGVtSW5kZXgoIG5leHROb2RlICk7XHJcblxyXG4gICAgICAgIGlmICggaW5kZXggIT09IHVuZGVmaW5lZCAmJiBjb3N0IDwgbmV4dE5vZGUuZ2V0RygpICl7XHJcbiAgICAgICAgICBjb25zb2xlLmxvZyggXCJuZXh0IDFcIiApO1xyXG4gICAgICAgICAgYXN0YXIub3Blbkxpc3QucmVtb3ZlKCBpbmRleCApO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKCBhc3Rhci5pc0JlbG9uZ1RvQ2xvc2VkKCBuZXh0Tm9kZSApICYmIGNvc3QgPCBuZXh0Tm9kZS5nZXRHKCkgKXtcclxuICAgICAgICAgIGNvbnNvbGUubG9nKCBcIm5leHQgMlwiICk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoIGluZGV4ID09PSB1bmRlZmluZWQgJiYgIWFzdGFyLmlzQmVsb25nVG9DbG9zZWQoIG5leHROb2RlICkgKXtcclxuICAgICAgICAgIGNvbnNvbGUubG9nKCBcIm5leHQgM1wiICk7XHJcbiAgICAgICAgICBuZXh0Tm9kZS5zZXRHKCBjb3N0ICk7XHJcbiAgICAgICAgICBuZXh0Tm9kZS5zZXRGKCBuZXh0Tm9kZS5nZXRHKCkgKyBuZXh0Tm9kZS5nZXRIKCBhc3Rhci50YXJnZXROb2RlICkgKTtcclxuICAgICAgICAgIGFzdGFyLm9wZW5MaXN0LnB1c2goIG5leHROb2RlICk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgIH1cclxuICAgIGxldCB0YWlsTm9kZSA9IGFzdGFyLm9wZW5MaXN0LnRvcCgpO1xyXG4gICAgdGhpcy5zb2x1dGlvbiA9IFtdO1xyXG4gICAgd2hpbGUoIHRhaWxOb2RlICl7XHJcbiAgICAgIHRoaXMuc29sdXRpb24ucHVzaCggdGFpbE5vZGUgKTtcclxuICAgICAgdGFpbE5vZGUgPSB0YWlsTm9kZS5wYXJlbnQ7XHJcbiAgICB9XHJcbiAgICAvLyB0aGlzLnNob3dTb2x1dGlvbigpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICog6L+Q6KGMIEEqIOeul+azlSAoIOeJiOacrCAyICkg5a6e6aqM55SoXHJcbiAgICovXHJcbiAgcnVuMigpe1xyXG4gICAgbGV0IGFzdGFyID0gdGhpcztcclxuICAgIHdoaWxlICggIU5vZGUuaXNTYW1lKCBhc3Rhci5vcGVuTGlzdC50b3AoKSwgYXN0YXIudGFyZ2V0Tm9kZSApICl7XHJcbiAgICAgIGxldCBjdXJyZW50Tm9kZSA9IGFzdGFyLm9wZW5MaXN0LnBvcCgpO1xyXG4gICAgICBhc3Rhci5jbG9zZWRMaXN0LnB1c2goIGN1cnJlbnROb2RlICk7XHJcbiAgICAgIGFzdGFyLmJfY2xvc2VkTGlzdFsgY3VycmVudE5vZGUuZ2V0VmFsU3RyKCkgXSA9IDE7XHJcblxyXG4gICAgICBsZXQgbmV4dE5vZGVzID0gY3VycmVudE5vZGUuZ2V0TmV4dE5vZGVzKCk7XHJcblxyXG4gICAgICBuZXh0Tm9kZXMuZm9yRWFjaChmdW5jdGlvbihuZXh0Tm9kZSl7XHJcbiAgICAgICAgbGV0IGNvc3QgPSBjdXJyZW50Tm9kZS5nZXRHKCkgKyBjdXJyZW50Tm9kZS5nZXRDb3N0VG9OZXh0KCk7XHJcbiAgICAgICAgbGV0IGluZGV4ID0gIGFzdGFyLm9wZW5MaXN0LmdldEl0ZW1JbmRleCggbmV4dE5vZGUgKTtcclxuXHJcbiAgICAgICAgaWYgKCBpbmRleCAhPT0gdW5kZWZpbmVkICYmIGNvc3QgPCBuZXh0Tm9kZS5nZXRHKCkgKXtcclxuICAgICAgICAgIGNvbnNvbGUubG9nKCBcIm5leHQgMVwiICk7XHJcbiAgICAgICAgICBhc3Rhci5vcGVuTGlzdC5yZW1vdmUoIGluZGV4ICk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoIGFzdGFyLmlzQmVsb25nVG9DbG9zZWQoIG5leHROb2RlICkgJiYgY29zdCA8IG5leHROb2RlLmdldEcoKSApe1xyXG4gICAgICAgICAgY29uc29sZS5sb2coIFwibmV4dCAyXCIgKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICggaW5kZXggPT09IHVuZGVmaW5lZCAmJiAhYXN0YXIuaXNCZWxvbmdUb0Nsb3NlZCggbmV4dE5vZGUgKSApe1xyXG4gICAgICAgICAgY29uc29sZS5sb2coIFwibmV4dCAzXCIgKTtcclxuICAgICAgICAgIG5leHROb2RlLnNldEcoIGNvc3QgKTtcclxuICAgICAgICAgIG5leHROb2RlLnNldEYoIG5leHROb2RlLmdldEcoKSArIG5leHROb2RlLmdldEgoIGFzdGFyLnRhcmdldE5vZGUgKSApO1xyXG4gICAgICAgICAgYXN0YXIub3Blbkxpc3QucHVzaCggbmV4dE5vZGUgKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGxldCB0YWlsTm9kZSA9IGFzdGFyLm9wZW5MaXN0LnRvcCgpO1xyXG4gICAgdGhpcy5zb2x1dGlvbiA9IFtdO1xyXG4gICAgd2hpbGUoIHRhaWxOb2RlICl7XHJcbiAgICAgIHRoaXMuc29sdXRpb24ucHVzaCggdGFpbE5vZGUgKTtcclxuICAgICAgdGFpbE5vZGUgPSB0YWlsTm9kZS5wYXJlbnQ7XHJcbiAgICB9XHJcbiAgICB0aGlzLnNob3dTb2x1dGlvbigpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICog6I635Y+W6Kej5Yaz5pa55qGI5pWw57uEXHJcbiAgICovXHJcbiAgZ2V0U29sdXRpb24oKXtcclxuICAgIHJldHVybiB0aGlzLnNvbHV0aW9uO1xyXG4gIH1cclxuXHJcbiAgLy8gcHJpdmF0ZSBmdW5jdGlvblxyXG4gIC8vIC0tLS0tLS0tLS0tLS0tLVxyXG5cclxuICAvKipcclxuICAgKiDliKTmlq3oioLngrnmmK/lkKblnKggQ0xPU0VEIOS4rVxyXG4gICAqL1xyXG4gIHByaXZhdGUgaXNCZWxvbmdUb0Nsb3NlZCggbm9kZTogTm9kZSApe1xyXG4gICAgbGV0IHN0ciA9IG5vZGUuZ2V0VmFsU3RyKCk7XHJcbiAgICByZXR1cm4gISF0aGlzLmJfY2xvc2VkTGlzdFtzdHJdO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICog5pi+56S66Kej5Yaz5pa55qGI55qE5YW35L2T5q2l6aqkXHJcbiAgICovXHJcbiAgcHJpdmF0ZSBzaG93U29sdXRpb24oKXtcclxuICAgIGxldCBsZW4gPSB0aGlzLnNvbHV0aW9uLmxlbmd0aCxcclxuICAgICAgICBpID0gbGVuIC0gMSxcclxuICAgICAgICBzY2FsZSA9IHRoaXMudGFyZ2V0Tm9kZS5zY2FsZTtcclxuICAgIGZvciAoIDsgaSA+IC0xOyBpIC0tICl7XHJcbiAgICAgIGNvbnNvbGUubG9nKCBgU3RlcCAkeyBsZW4gLSBpIH06IGAgKTtcclxuICAgICAgbGV0IGl0ZW0gPSB0aGlzLnNvbHV0aW9uW2ldLmdldFZhbFN0cigpLnNwbGl0KCcsJyk7XHJcbiAgICAgIGZvciAoIGxldCBqID0gMDsgaiA8IHNjYWxlOyBqICsrICl7XHJcbiAgICAgICAgICBjb25zb2xlLmxvZyggYHwgJHtpdGVtWyBqKnNjYWxlIF19ICR7aXRlbVsgaipzY2FsZSArIDEgXX0gJHtpdGVtWyBqKnNjYWxlICsgMiBdfSB8YCApO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcbiIsImltcG9ydCBOb2RlIGZyb20gXCIuL25vZGVcIjtcclxuaW1wb3J0IEFzdGFyIGZyb20gJy4vYXN0YXInO1xyXG5pbXBvcnQgeyAkaWQsICRjcmVhdGVFbGUsICRyZXBsYWNlQ2xhc3MsICRnZXRQb3MsICRnZXRJbWdJZCwgJGV4Y2hhbmdlUG9zLCBESVJFQ1RJT04gfSBmcm9tICcuL3V0aWwnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgR2FtZXtcclxuICBjdXJyZW50Tm9kZTogTm9kZVxyXG4gIHRhcmdldE5vZGU6IE5vZGVcclxuICBzY2FsZTogbnVtYmVyXHJcbiAgcnVubmluZzogYm9vbGVhbiA9IGZhbHNlXHJcblxyXG4gIHByaXZhdGUgZ2FtZUNvbnRhaW5lcklkOiBzdHJpbmdcclxuICBwcml2YXRlIGltZ0NvbnRhaW5lcklkID0gXCJpbWFnZVwiXHJcbiAgcHJpdmF0ZSBhY3Rpb25Db250YWluZXJJZCA9IFwiYWN0aW9uXCJcclxuICBwcml2YXRlIGluZm9JZCA9IFwiaW5mb1wiXHJcblxyXG4gIHByaXZhdGUgZ2FtZUNvbnRhaW5lclxyXG4gIHByaXZhdGUgaW1nQ29udGFpbmVyXHJcbiAgcHJpdmF0ZSBhY3Rpb25Db250YWluZXJcclxuICBwcml2YXRlIGluZm9Db250YWluZXJcclxuXHJcbiAgLy8g57yT5a2Y5omA5pyJ55qE5Zu+54mH54mH5q61IGRvbe+8jOWFjeW+l+WGjeaJvlxyXG4gIHByaXZhdGUgaW1nRWxlbWVudHMgPSBbXVxyXG4gIC8vIOe8k+WtmOepuueZveWbvueJh+eJh+autSBkb23vvIzlhY3lvpflho3mib5cclxuICBwcml2YXRlIGJsYW5rSW1nRWxlXHJcblxyXG4gIHByaXZhdGUgdGltZUluZm9FbGVcclxuICBwcml2YXRlIHN0ZXBJbmZvRWxlXHJcblxyXG4gIGNvbnN0cnVjdG9yKCBnYW1lQ29udGFpbmVySWQ6IHN0cmluZywgc2NhbGU6IG51bWJlciApe1xyXG4gICAgdGhpcy5jdXJyZW50Tm9kZSA9IG5ldyBOb2RlKCBzY2FsZSApO1xyXG4gICAgdGhpcy50YXJnZXROb2RlID0gbmV3IE5vZGUoIHNjYWxlICk7XHJcbiAgICB0aGlzLnNjYWxlID0gc2NhbGU7XHJcblxyXG4gICAgdGhpcy5nYW1lQ29udGFpbmVySWQgPSBnYW1lQ29udGFpbmVySWQ7XHJcblxyXG4gICAgdGhpcy5nYW1lQ29udGFpbmVyID0gJGlkKCB0aGlzLmdhbWVDb250YWluZXJJZCApO1xyXG4gICAgdGhpcy5pbWdDb250YWluZXIgPSAkY3JlYXRlRWxlKCAnZGl2JywgdGhpcy5pbWdDb250YWluZXJJZCApO1xyXG4gICAgdGhpcy5hY3Rpb25Db250YWluZXIgPSAkY3JlYXRlRWxlKCAnZGl2JywgdGhpcy5hY3Rpb25Db250YWluZXJJZCApO1xyXG4gICAgdGhpcy5pbmZvQ29udGFpbmVyID0gJGNyZWF0ZUVsZSggJ2RpdicsIHRoaXMuaW5mb0lkICk7XHJcblxyXG4gICAgdGhpcy5pbml0KCk7XHJcbiAgfVxyXG5cclxuICAvLyBwdWJsaWMgZnVuY3Rpb25cclxuICAvLyAtLS0tLS0tLS0tLS0tLS1cclxuXHJcbiAgLyoqXHJcbiAgICogbWl4IOaMiemSruaJp+ihjOWHveaVsFxyXG4gICAqIOa3t+WQiO+8jOeUsei1t+Wni+iKgueCueS5seW6j+W+l+WIsOS4gOS4quaWsOeahOiKgueCue+8jOW5tuagueaNruaWsOiKgueCueiuvue9rumhtemdouS4reeahOaYvuekuueKtuaAgVxyXG4gICAqL1xyXG4gIG1peCgpe1xyXG4gICAgaWYgKCB0aGlzLnJ1bm5pbmcgKSByZXR1cm47XHJcbiAgICB0aGlzLmN1cnJlbnROb2RlLnNodWZmbGUoKTtcclxuICAgIHRoaXMuc2V0U3RhdHVzQnlOb2RlKCB0aGlzLmN1cnJlbnROb2RlICk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBzdGFydCDmjInpkq7miafooYzlh73mlbBcclxuICAgKiDmiafooYwgQSog566X5rOVXHJcbiAgICovXHJcbiAgc3RhcnQoKXtcclxuICAgIGxldCBnYW1lID0gdGhpcztcclxuXHJcbiAgICBpZiAoIGdhbWUucnVubmluZyApIHJldHVybjtcclxuICAgIGdhbWUucnVubmluZyA9IHRydWU7XHJcblxyXG4gICAgaWYgKCBOb2RlLmlzU2FtZSggdGhpcy5jdXJyZW50Tm9kZSwgdGhpcy50YXJnZXROb2RlICkgKXtcclxuICAgICAgdGhpcy53aW4oKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGxldCBhc3RhciA9IG5ldyBBc3RhciggdGhpcy5jdXJyZW50Tm9kZSwgdGhpcy50YXJnZXROb2RlICk7XHJcblxyXG4gICAgICBjb25zb2xlLnRpbWUoIFwiQVN0YXIgUnVuICFcIiApO1xyXG4gICAgICBsZXQgc3RhcnRUaW1lID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XHJcbiAgICAgIGFzdGFyLnJ1bigpO1xyXG4gICAgICBsZXQgZW5kVGltZSA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xyXG4gICAgICBjb25zb2xlLnRpbWVFbmQoIFwiQVN0YXIgUnVuICFcIiApO1xyXG4gICAgICBjb25zb2xlLmxvZyggXCIgYXN0YXIgLSBcIiwgYXN0YXIgKTtcclxuXHJcbiAgICAgIGdhbWUudGltZUluZm9FbGUuaW5uZXJIVE1MID0gYCR7ZW5kVGltZSAtIHN0YXJ0VGltZX0gbXNgO1xyXG5cclxuICAgICAgbGV0IHNvbHV0aW9uID0gYXN0YXIuZ2V0U29sdXRpb24oKTtcclxuICAgICAgaWYgKCBzb2x1dGlvbi5sZW5ndGggKSAge1xyXG4gICAgICAgIGxldCBsZW4gPSBzb2x1dGlvbi5sZW5ndGgsXHJcbiAgICAgICAgICAgIGkgPSBsZW4gLSAxO1xyXG5cclxuICAgICAgICBsZXQgcnVuSWQgPSBzZXRJbnRlcnZhbCggZnVuY3Rpb24oKXtcclxuICAgICAgICAgIGlmICggaSA9PT0gLTEgKXtcclxuICAgICAgICAgICAgY2xlYXJJbnRlcnZhbCggcnVuSWQgKTtcclxuICAgICAgICAgICAgZ2FtZS53aW4oKTtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGdhbWUuY3VycmVudE5vZGUgPSBzb2x1dGlvbltpXTtcclxuICAgICAgICAgICAgZ2FtZS5zZXRTdGF0dXNCeU5vZGUoIHNvbHV0aW9uW2ldICk7XHJcbiAgICAgICAgICAgIGdhbWUuc3RlcEluZm9FbGUuaW5uZXJIVE1MID0gYCR7bGVuIC0gaX1cXC8ke2xlbn1gO1xyXG4gICAgICAgICAgICBpLS07XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSwgMTgwICk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIOi1ouW+l+a4uOaIj1xyXG4gICAqL1xyXG4gIHdpbigpe1xyXG4gICAgY29uc29sZS5sb2coIFwid2luISEhXCIgKTtcclxuICAgIHRoaXMucnVubmluZyA9IGZhbHNlO1xyXG4gICAgdGhpcy5pbWdDb250YWluZXIuY2xhc3NOYW1lID0gJ3dpbic7XHJcbiAgfVxyXG5cclxuICAvLyBwcml2YXRlIGZ1bmN0aW9uXHJcbiAgLy8gLS0tLS0tLS0tLS0tLS0tXHJcblxyXG4gIC8qKlxyXG4gICAqIOWIneWni+WMluWHveaVsFxyXG4gICAqL1xyXG4gIHByaXZhdGUgaW5pdCgpe1xyXG4gICAgdGhpcy5pbml0SW1hZ2UoKTtcclxuICAgIHRoaXMuaW5pdE9wZXJhdGlvbigpO1xyXG4gICAgdGhpcy5pbml0SW5mbygpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICog5ou85Zu+5ri45oiP55qE5Zu+54mH5pi+56S66YOo5YiG55qE5Yid5aeL5YyWXHJcbiAgICovXHJcbiAgcHJpdmF0ZSBpbml0SW1hZ2UoKXtcclxuICAgIGxldCBnYW1lID0gdGhpcztcclxuICAgIC8vIOiKgueCueeahOaVsOe7hOihqOekuuS4reeahOavj+S4gOS4quaVsOe7hOeahOmhueWvueW6lOS4gOS4quagvOWtkFxyXG4gICAgZm9yICggbGV0IGkgPSBNYXRoLnBvdyggZ2FtZS5zY2FsZSwgMikgLSAxOyBpID4gLTE7IGkgLS0gKXtcclxuICAgICAgLy8g5qC35byPIGl0ZW0tKiDop4Tlrprmn5DkuIDmoLzlrZDlr7nlupTnmoTlm77niYfniYfmrrXvvIzov5npg6jliIbliJ3lp4vljJblkI7kuI3lho3mlLnlj5hcclxuICAgICAgLy8g5qC35byPIHBvcy0qIOinhOWumuafkOS4gOagvOWtkOWcqCAjaW1hZ2Ug5a655Zmo5Lit55qE5L2N572u77yM6L+Z6YOo5YiG6ZqP552A6IqC54K55Y+Y5YyW6ICM5pS55Y+YXHJcbiAgICAgIGxldCBlbGUgPSAkY3JlYXRlRWxlKCAnZGl2JywgdW5kZWZpbmVkLCBgaXRlbSBpdGVtLSR7aX0gcG9zLSR7aX1gICk7XHJcblxyXG4gICAgICBlbGUuYWRkRXZlbnRMaXN0ZW5lciggJ2NsaWNrJywgZnVuY3Rpb24oZSl7IGdhbWUuaW1nRnJhZ21lbnRIYW5kbGVyKGUpIH0gKTtcclxuXHJcbiAgICAgIC8vIOWIneWni+WMlueahOaXtuiwg+aVtOepuueZveagvOmDqOWIhigg5qC35byP5Li677yaIC5pdGVtLml0ZW0tMC5wb3MtMCAp55qE5L2N572uXHJcbiAgICAgIC8vIOWQjOaXtuWwhuWbvueJh+eJh+auteeahCBkb20g57yT5a2YXHJcbiAgICAgIGlmICggaSA9PT0gMCApe1xyXG4gICAgICAgIGdhbWUuaW1nQ29udGFpbmVyLmFwcGVuZENoaWxkKCBlbGUgKTtcclxuICAgICAgICBnYW1lLmltZ0VsZW1lbnRzLnB1c2goIGVsZSApO1xyXG4gICAgICAgIGdhbWUuYmxhbmtJbWdFbGUgPSBlbGU7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgZ2FtZS5pbWdDb250YWluZXIuaW5zZXJ0QmVmb3JlKCBlbGUsIGdhbWUuaW1nQ29udGFpbmVyLmZpcnN0Q2hpbGQgKTtcclxuICAgICAgICBnYW1lLmltZ0VsZW1lbnRzLnVuc2hpZnQoIGVsZSApO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICBnYW1lLmdhbWVDb250YWluZXIuYXBwZW5kQ2hpbGQoIGdhbWUuaW1nQ29udGFpbmVyICk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiDmi7zlm77nmoTmjInpkq7mk43kvZzpg6jliIbnmoTliJ3lp4vljJZcclxuICAgKi9cclxuICBwcml2YXRlIGluaXRPcGVyYXRpb24oKXtcclxuICAgIGxldCBnYW1lID0gdGhpcztcclxuICAgIC8vIOS4pOS4quaMiemSriBNSVgg5ZKMIFNUQVJUXHJcbiAgICBbXCJNSVhcIiwgXCJTVEFSVFwiXS5mb3JFYWNoKCBmdW5jdGlvbihpdGVtLCBpbmRleCwgYXJyYXkpe1xyXG4gICAgICBsZXQgZWxlID0gJGNyZWF0ZUVsZSggJ2J1dHRvbicsIHVuZGVmaW5lZCwgYGJ0biBidG4tJHtpdGVtLnRvTG93ZXJDYXNlKCl9YCApO1xyXG4gICAgICBlbGUuaW5uZXJIVE1MID0gaXRlbTtcclxuICAgICAgc3dpdGNoKCBpdGVtICl7XHJcbiAgICAgICAgY2FzZSAnTUlYJzpcclxuICAgICAgICAgIGVsZS5hZGRFdmVudExpc3RlbmVyKCAnY2xpY2snLCBnYW1lLm1peC5iaW5kKCBnYW1lICkgKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgJ1NUQVJUJzpcclxuICAgICAgICAgIGVsZS5hZGRFdmVudExpc3RlbmVyKCAnY2xpY2snLCBnYW1lLnN0YXJ0LmJpbmQoIGdhbWUgKSApO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgIH1cclxuICAgICAgZ2FtZS5hY3Rpb25Db250YWluZXIuYXBwZW5kQ2hpbGQoIGVsZSApO1xyXG4gICAgfSk7XHJcbiAgICBnYW1lLmdhbWVDb250YWluZXIuYXBwZW5kQ2hpbGQoIGdhbWUuYWN0aW9uQ29udGFpbmVyICk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiDmi7zlm77nmoTkv6Hmga/mmL7npLrpg6jliIbnmoTliJ3lp4vljJZcclxuICAgKi9cclxuICBwcml2YXRlIGluaXRJbmZvKCl7XHJcbiAgICBsZXQgZ2FtZSA9IHRoaXM7XHJcblxyXG4gICAgWyBcInRpbWVcIiwgXCJzdGVwXCIgXS5mb3JFYWNoKCBmdW5jdGlvbiggdmFsdWUgKXtcclxuICAgICAgbGV0IGRpdkVsZSA9ICRjcmVhdGVFbGUoICdkaXYnLCB1bmRlZmluZWQsICdpbmZvLWl0ZW0nICk7XHJcbiAgICAgIGxldCB0aXRsZSA9ICRjcmVhdGVFbGUoICdzcGFuJywgdW5kZWZpbmVkLCAndGl0bGUnICk7XHJcbiAgICAgIGxldCBjb250ZW50ID0gJGNyZWF0ZUVsZSggJ3NwYW4nICk7XHJcblxyXG4gICAgICB0aXRsZS5pbm5lckhUTUwgPSBgJHt2YWx1ZX06YDtcclxuICAgICAgY29udGVudC5pbm5lckhUTUwgPSAnMCc7XHJcbiAgICAgIGdhbWVbIGAke3ZhbHVlfUluZm9FbGVgIF0gPSBjb250ZW50O1xyXG5cclxuICAgICAgZGl2RWxlLmFwcGVuZENoaWxkKCB0aXRsZSApO1xyXG4gICAgICBkaXZFbGUuYXBwZW5kQ2hpbGQoIGNvbnRlbnQgKTtcclxuICAgICAgZ2FtZS5pbmZvQ29udGFpbmVyLmFwcGVuZENoaWxkKCBkaXZFbGUgKTtcclxuICAgIH0pXHJcbiAgICBnYW1lLmdhbWVDb250YWluZXIuYXBwZW5kQ2hpbGQoIGdhbWUuaW5mb0NvbnRhaW5lciApO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICog5qC55o2u6IqC54K555qE5pWw57uE6KGo56S65p2l6K6+572u5Zu+54mH54mH5q6155qE5L2N572uXHJcbiAgICovXHJcbiAgcHJpdmF0ZSBzZXRTdGF0dXNCeU5vZGUoIG5vZGU6IE5vZGUgKXtcclxuICAgIC8vIGxldCBpbWdFbGVtZW50cyA9IHRoaXMuaW1nQ29udGFpbmVyLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJpdGVtXCIpO1xyXG4gICAgZm9yICggbGV0IGsgPSAwLCBsZW4gPSBub2RlLnZhbHVlLmxlbmd0aDsgayA8IGxlbjsgayArKyApe1xyXG4gICAgICBsZXQgcG9zID0gKCBrID09PSBsZW4gLSAxICkgPyAwIDogayArIDE7O1xyXG4gICAgICBsZXQgdiA9ICggbm9kZS52YWx1ZVtrXSA9PT0gMCApID8gbGVuIDogbm9kZS52YWx1ZVtrXTtcclxuICAgICAgJHJlcGxhY2VDbGFzcyggdGhpcy5pbWdFbGVtZW50c1t2IC0gMV0sIGBwb3MtJHtwb3N9YCwgJ3BvcycgKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIOWbvueJh+eJh+auteS4iueahCBjbGljayDkuovku7blpITnkIblh73mlbDvvIznlKjmnaXnp7vliqjlm77niYfniYfmrrVcclxuICAgKi9cclxuICBwcml2YXRlIGltZ0ZyYWdtZW50SGFuZGxlcihlKXtcclxuICAgIGxldCBpbWdJZCA9ICRnZXRJbWdJZCggZS50YXJnZXQuY2xhc3NOYW1lICk7XHJcbiAgICBsZXQgbm9uWmVyb0RpciA9IHRoaXMuY3VycmVudE5vZGUuZ2V0Tm9uWmVyb0RpcmVjdGlvbigpO1xyXG4gICAgaWYgKCBub25aZXJvRGlyW2ltZ0lkXSApe1xyXG4gICAgICBsZXQgZGlyZWN0aW9uID0gRElSRUNUSU9OWyBgJHtub25aZXJvRGlyWyBpbWdJZCBdfWAgXTtcclxuICAgICAgdGhpcy5jdXJyZW50Tm9kZS5tb3ZlVG8oIGRpcmVjdGlvbiApO1xyXG4gICAgICAkZXhjaGFuZ2VQb3MoIHRoaXMuYmxhbmtJbWdFbGUsIGUudGFyZ2V0ICk7XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcbiIsImltcG9ydCBOb2RlIGZyb20gJy4vbm9kZSc7XHJcbmltcG9ydCB7IGJlbG9uZ1RvIH0gZnJvbSAnLi91dGlsJztcclxuLy8gSGVhcCBPbiBUb3BcclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgSGVhcHtcclxuICBoZWFwOiBOb2RlW10gPSBbXVxyXG4gIGJfaGVhcDogYmVsb25nVG8gPSB7fVxyXG4gIGtleTogc3RyaW5nXHJcbiAgY29uc3RydWN0b3IoIG5vZGVMaXN0OiBOb2RlW10sIGtleTogc3RyaW5nICl7XHJcbiAgICB0aGlzLmtleSA9IGtleTtcclxuICAgIC8vIOeUqOS+neasoeaPkuWFpeeahOaWueW8j+aehOmAoOWIneWni+eahOWwj+mhtuWghlxyXG4gICAgbGV0IGkgPSAwLFxyXG4gICAgICAgIGxlbiA9IG5vZGVMaXN0Lmxlbmd0aDtcclxuICAgIGZvciAoIDsgaSA8IGxlbjsgaSArKyApe1xyXG4gICAgICB0aGlzLnB1c2goIG5vZGVMaXN0W2ldICk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvLyBwdWJsaWMgZnVuY3Rpb25cclxuICAvLyAtLS0tLS0tLS0tLS0tLS1cclxuXHJcbiAgLyoqXHJcbiAgICog6I635Y+W5aCG5Lit5LiL5qCH5Li6IGluZGV4IOeahOWAvFxyXG4gICAqL1xyXG4gIGdldCggaW5kZXg6IG51bWJlciApe1xyXG4gICAgaWYgKCBpbmRleCA+PSAwICYmIGluZGV4IDwgdGhpcy5oZWFwLmxlbmd0aCApe1xyXG4gICAgICByZXR1cm4gdGhpcy5oZWFwWyBpbmRleCBdWyB0aGlzLmtleSBdO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICog5ZCR5aCG5Lit5o+S5YWl5LiA5Liq5paw55qE5YWD57Sg5bm26LCD5pW05aCGXHJcbiAgICog5paw5YWD57Sg5LuO5pWw57uE5bC+6YOo5o+S5YWl77yM54S25ZCO5a+55paw5YWD57Sg5omn6KGM5LiK5rWu6LCD5pW0XHJcbiAgICovXHJcbiAgcHVzaCggbm9kZTogTm9kZSApe1xyXG4gICAgdGhpcy5oZWFwLnB1c2goIG5vZGUgKTtcclxuICAgIHRoaXMuc2V0QkhlYXAoIHRoaXMuaGVhcC5sZW5ndGggLSAxICk7XHJcbiAgICB0aGlzLmdvVXAoIHRoaXMuaGVhcC5sZW5ndGggLSAxICk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiDliKDpmaTlubbov5Tlm57loIbpobblhYPntKDlubbosIPmlbTloIZcclxuICAgKiDlhYjlsIbloIbpobblhYPntKDkuI7mlbDnu4TmnKvlsL7lhYPntKDkupLmjaLvvIznhLblkI7lvLnlh7rmlbDnu4TmnKvlsL7nmoTlhYPntKDvvIzmnIDlkI7lr7nloIbpobblhYPntKDmiafooYzkuIvmsonmk43kvZxcclxuICAgKi9cclxuICBwb3AoKXtcclxuICAgIGlmICggdGhpcy5pc0VtcHR5KCkgKSByZXR1cm47XHJcbiAgICBsZXQgcmVzdWx0O1xyXG4gICAgdGhpcy5zd2FwKCAwLCB0aGlzLmhlYXAubGVuZ3RoIC0gMSApO1xyXG4gICAgcmVzdWx0ID0gdGhpcy5oZWFwLnBvcCgpO1xyXG4gICAgdGhpcy5yZW1vdmVCSGVhcCggcmVzdWx0LmdldFZhbFN0cigpICk7XHJcbiAgICAhdGhpcy5pc0VtcHR5KCkgJiYgdGhpcy5nb0Rvd24oMCk7XHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICog56e76Zmk5aCG5Lit5LiL5qCH5Li6IGluZGV4IOeahOWFg+e0oFxyXG4gICAqIOWwhumcgOenu+mZpOeahOmhueS4juWghumhtuS6kuaNou+8jOeEtuWQjuW8ueWHuuWghumhtu+8jOacgOWQjuWvueS6kuaNoumhue+8iOWOn+Wghumhtu+8ieaJp+ihjOS4iua1ruaTjeS9nFxyXG4gICAqL1xyXG4gIHJlbW92ZSggaW5kZXg6IG51bWJlciApe1xyXG4gICAgaWYoIGluZGV4IDwgMCB8fCBpbmRleCA+PSB0aGlzLmhlYXAubGVuZ3RoICkgcmV0dXJuO1xyXG4gICAgdGhpcy5zd2FwKCAwLCBpbmRleCApO1xyXG4gICAgdGhpcy5wb3AoKTtcclxuICAgIHRoaXMuZ29VcCggaW5kZXggKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIOiOt+WPluWghumhtuWFg+e0oFxyXG4gICAqL1xyXG4gIHRvcCgpe1xyXG4gICAgcmV0dXJuIHRoaXMuaGVhcC5sZW5ndGggJiYgdGhpcy5oZWFwWzBdO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICog5Yik5pat5aCG5piv5ZCm5Li656m6XHJcbiAgICovXHJcbiAgaXNFbXB0eSgpe1xyXG4gICAgcmV0dXJuICF0aGlzLmhlYXAubGVuZ3RoO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICog5Yik5pat5aCG5Lit5piv5ZCm5pyJ5YWD57SgIG5vZGVcclxuICAgKi9cclxuICBnZXRJdGVtSW5kZXgoIG5vZGU6IE5vZGUgKXtcclxuICAgIHJldHVybiB0aGlzLmJfaGVhcFsgbm9kZS5nZXRWYWxTdHIoKSBdO1xyXG4gIH1cclxuXHJcbiAgLy8gcHJpdmF0ZSBmdW5jdGlvblxyXG4gIC8vIC0tLS0tLS0tLS0tLS0tLVxyXG5cclxuICAvKipcclxuICAgKiDov5Tlm57loIbkuK3kuIvmoIfkuLogaW5kZXgg55qE5YWD57SgXHJcbiAgICovXHJcbiAgcHJpdmF0ZSBnZXRWYWx1ZSggaW5kZXg6IG51bWJlciApe1xyXG4gICAgaWYoIGluZGV4IDwgMCB8fCBpbmRleCA+PSB0aGlzLmhlYXAubGVuZ3RoICkgcmV0dXJuO1xyXG4gICAgcmV0dXJuIHRoaXMuaGVhcFtpbmRleF1bdGhpcy5rZXldO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICog5aCG5Lit5LiL5qCH5Li6IGluZGV4IOeahOWFg+e0oOeahOS4iua1ruaTjeS9nFxyXG4gICAqL1xyXG4gIHByaXZhdGUgZ29VcChpbmRleDogbnVtYmVyKXtcclxuICAgIGxldCB2YWx1ZSA9IHRoaXMuZ2V0VmFsdWUoaW5kZXgpLFxyXG4gICAgICAgIHBhcmVudCA9IHRoaXMuZ2V0UGFyZW50SW5kZXgoaW5kZXgpO1xyXG5cclxuICAgIGlmICggcGFyZW50ID09PSB1bmRlZmluZWQgKSByZXR1cm47XHJcblxyXG4gICAgaWYgKCB0aGlzLmdldFZhbHVlKCBwYXJlbnQgKSA+IHRoaXMuZ2V0VmFsdWUoIGluZGV4ICkgKXtcclxuICAgICAgdGhpcy5zd2FwKCBpbmRleCwgcGFyZW50ICk7XHJcbiAgICAgIHRoaXMuZ29VcCggcGFyZW50ICk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiDloIbkuK3kuIvmoIfkuLogaW5kZXgg55qE5YWD57Sg55qE5LiL5rKJ5pON5L2cXHJcbiAgICovXHJcbiAgcHJpdmF0ZSBnb0Rvd24oaW5kZXg6IG51bWJlcil7XHJcbiAgICBsZXQgdmFsdWUgPSB0aGlzLmdldFZhbHVlKGluZGV4KSxcclxuICAgICAgICBbbGVmdCwgcmlnaHRdID0gdGhpcy5nZXRDaGlsZEluZGV4KGluZGV4KSxcclxuICAgICAgICBzd2FwSW5kZXggPSBsZWZ0O1xyXG5cclxuICAgIC8vIOWFg+e0oOaYr+WPtuWtkOiKgueCue+8jOayoeacieWtkOWFg+e0oFxyXG4gICAgaWYgKCBsZWZ0ID09PSBudWxsICkgcmV0dXJuO1xyXG5cclxuICAgIC8vIOiLpeWFg+e0oOacieS4pOS4quWtkOWFg+e0oO+8jOiuvue9riBzd2FwSW5kZXgg5Li66L6D5bCP55qE6YKj5Liq5a2Q5YWD57Sg55qE5LiL5qCHXHJcbiAgICAvLyDoi6XlhYPntKDlj6rmnInlt6blhL/lrZDvvIxzd2FwSW5kZXgg5bey57uP6KKr5Yid5aeL5YyW5Li6IGxlZnQg55qE5YC85LqGXHJcbiAgICBpZiAoIHJpZ2h0ICl7XHJcbiAgICAgIHN3YXBJbmRleCA9IHRoaXMuZ2V0VmFsdWUobGVmdCkgPCB0aGlzLmdldFZhbHVlKHJpZ2h0KSA/IGxlZnQgOiByaWdodDtcclxuICAgIH1cclxuXHJcbiAgICAvLyDmr5TovoPniLblhYPntKDlkozovoPlsI/nmoTpgqPkuKrlrZDlhYPntKDnmoTlgLzvvIzoi6XniLblhYPntKDnmoTlgLzovoPlpKfvvIzliJnnva7mjaLniLblhYPntKDlkozovoPlsI/nmoTlrZDlhYPntKBcclxuICAgIC8vIOeEtuWQjuWcqOaWsOeahOe9ruaNoueahOS9jee9ruWkhOe7p+e7reaJp+ihjOS4i+ayieaTjeS9nFxyXG4gICAgaWYgKCB0aGlzLmdldFZhbHVlKHN3YXBJbmRleCkgPCB2YWx1ZSApIHtcclxuICAgICAgdGhpcy5zd2FwKCBpbmRleCwgc3dhcEluZGV4ICk7XHJcbiAgICAgIHRoaXMuZ29Eb3duKCBzd2FwSW5kZXggKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIOiOt+WPluS4i+agh+S4uiBpbmRleCDnmoTlhYPntKDlnKjloIbkuK3nmoTniLblhYPntKBcclxuICAgKi9cclxuICBwcml2YXRlIGdldFBhcmVudEluZGV4KCBpbmRleDogbnVtYmVyICl7XHJcbiAgICBpZiAoIGluZGV4IDwgMCB8fCBpbmRleCA+PSB0aGlzLmhlYXAubGVuZ3RoICkgcmV0dXJuO1xyXG4gICAgaWYgKCBpbmRleCA9PT0gMCApIHJldHVybiAwO1xyXG4gICAgcmV0dXJuIE1hdGguZmxvb3IoIChpbmRleC0xKS8yICk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiDojrflj5bkuIvmoIfkuLogaW5kZXgg55qE5YWD57Sg5Zyo5aCG5Lit55qE5a2Q5YWD57Sg77yM57y65aSx55qE5a2Q5YWD57Sg55SoIG51bGwg5Luj5pu/XHJcbiAgICovXHJcbiAgcHJpdmF0ZSBnZXRDaGlsZEluZGV4KCBpbmRleDogbnVtYmVyICl7XHJcbiAgICBsZXQgbGVmdCA9IDIqaW5kZXggKyAxLFxyXG4gICAgICAgIHJpZ2h0ID0gMippbmRleCArIDIsXHJcbiAgICAgICAgbGVuZ3RoID0gdGhpcy5oZWFwLmxlbmd0aDtcclxuXHJcbiAgICBpZiAoIHJpZ2h0IDw9IGxlbmd0aCAtIDEgKXtcclxuICAgICAgcmV0dXJuIFsgbGVmdCwgcmlnaHQgXTtcclxuICAgIH0gZWxzZSBpZiAoIGxlZnQgPT09IGxlbmd0aCAtIDEgKSB7XHJcbiAgICAgIHJldHVybiBbIGxlZnQsIG51bGwgXTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHJldHVybiBbIG51bGwsIG51bGwgXTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIOS6pOaNouWghuS4reS4i+agh+WIhuWIq+S4uiBpbmRleDEg5ZKMIGluZGV4MiDnmoTkuKTkuKrlhYPntKBcclxuICAgKi9cclxuICBwcml2YXRlIHN3YXAoIGluZGV4MTogbnVtYmVyLCBpbmRleDI6IG51bWJlciApe1xyXG4gICAgbGV0IHRtcCA9IHRoaXMuaGVhcFtpbmRleDFdO1xyXG4gICAgdGhpcy5oZWFwW2luZGV4MV0gPSB0aGlzLmhlYXBbaW5kZXgyXTtcclxuICAgIHRoaXMuaGVhcFtpbmRleDJdID0gdG1wO1xyXG5cclxuICAgIHRoaXMuc2V0QkhlYXAoIGluZGV4MSApO1xyXG4gICAgdGhpcy5zZXRCSGVhcCggaW5kZXgyICk7XHJcbiAgfVxyXG4gIHByaXZhdGUgc2V0QkhlYXAoIGluZGV4OiBudW1iZXIgKXtcclxuICAgIHRoaXMuYl9oZWFwWyB0aGlzLmhlYXBbIGluZGV4IF0uZ2V0VmFsU3RyKCkgXSA9IGluZGV4O1xyXG4gIH1cclxuICBwcml2YXRlIHJlbW92ZUJIZWFwKCBzdHI6IHN0cmluZyApe1xyXG4gICAgZGVsZXRlIHRoaXMuYl9oZWFwWyBzdHIgXTtcclxuICB9XHJcbn1cclxuIiwiaW1wb3J0IEdhbWUgZnJvbSBcIi4vZ2FtZVwiO1xyXG5sZXQgZ2FtZSA9IG5ldyBHYW1lKCBcImNvbnRhaW5lclwiLCAzICk7XHJcbi8vIGxldCBnYW1lID0gbmV3IEdhbWUoIFwiY29udGFpbmVyXCIsIDUgKTtcclxuXHJcbmNvbnNvbGUubG9nKCBnYW1lICk7XHJcbmNvbnNvbGUubG9nKCBcIi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVwiICk7XHJcbiIsImltcG9ydCB7IERJUkVDVElPTiB9IGZyb20gJy4vdXRpbCc7XHJcblxyXG4vLyBMRVQgRElSRUNUSU9OID0gWyAnTk9ORScsICdVUCcsICdSSUdIVCcsICdET1dOJywgJ0xFRlQnIF07XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBOb2Rle1xyXG4gIHZhbHVlOiBudW1iZXJbXVxyXG4gIHplcm9JbmRleDogbnVtYmVyXHJcbiAgc2NhbGU6IG51bWJlclxyXG4gIHBhcmVudDogTm9kZVxyXG4gIEY6IG51bWJlciA9IDBcclxuICBHOiBudW1iZXIgPSAwXHJcbiAgY29uc3RydWN0b3IoIHNjYWxlOiBudW1iZXIsIGluaXRBcnI/OiBudW1iZXJbXSApIHtcclxuICAgIHRoaXMuc2NhbGUgPSBzY2FsZTtcclxuICAgIHRoaXMudmFsdWUgPSBpbml0QXJyID8gaW5pdEFyciA6IHRoaXMuaW5pdE5vZGVWYWx1ZUJ5U2NhbGUoIHNjYWxlICk7XHJcbiAgICB0aGlzLnplcm9JbmRleCA9IE1hdGgucG93KHNjYWxlLCAyKSAtIDE7XHJcblxyXG4gICAgLy8gdGhpcy5wYXJlbnQgPSBuZXcgTm9kZSh0aGlzLnNjYWxlKTtcclxuICB9XHJcblxyXG4gIC8vIHB1YmxpYyBmdW5jdGlvblxyXG4gIC8vIC0tLS0tLS0tLS0tLS0tLVxyXG5cclxuICAvKipcclxuICAgKiDojrflj5boioLngrnnmoTlgLzvvIzlsIboioLngrnnmoTmlbDnu4TooajnpLrovazmjaLmiJDlrZfnrKbkuLLooajnpLrlubbov5Tlm55cclxuICAgKi9cclxuICBnZXRWYWxTdHIoKXtcclxuICAgIHJldHVybiB0aGlzLnZhbHVlLnRvU3RyaW5nKCk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiDoioLngrnnmoTkubHluo/nrpfms5VcclxuICAgKiDpmo/mnLrmjIflrprkuIDkuKrmlrnlkJHvvIzku6ToioLngrnlkJHor6XmlrnlkJHnp7vliqjvvIzph43lpI3kuIrov7Dov4fnqIvoi6XlubLmrKHovr7liLDkubHluo/nmoTnm67nmoRcclxuICAgKi9cclxuICBzaHVmZmxlKCl7XHJcbiAgICBmb3IoIGxldCBpID0gMDsgaSA8IDUwMDA7IGkgKysgKXtcclxuICAgICAgbGV0IGRpcmVjdGlvbiA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDQgKyAxKTtcclxuICAgICAgdGhpcy5tb3ZlVG8oIGRpcmVjdGlvbiApO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICog5b2T5YmN6IqC54K55ZCR5pa55ZCRIGRpcmVjdGlvbiDnp7vliqjkuIDmrKFcclxuICAgKiDlhbblrp7mmK/oioLngrnnmoTmlbDnu4TooajnpLrkuK3nmoTmlbDlrZcgMCDlkJHmlrnlkJEgZGlyZWN0aW9uIOenu+WKqOS4gOasoVxyXG4gICAqL1xyXG4gIG1vdmVUbyggZGlyZWN0aW9uOiBudW1iZXIgKXtcclxuICAgIGlmICggIXRoaXMuY2FuTW92ZVRvKCBkaXJlY3Rpb24gKSApIHJldHVybjtcclxuICAgIGxldCB0YXJnZXRJbmRleCA9IHRoaXMuZ2V0VGFyZ2V0SW5kZXgoIGRpcmVjdGlvbiApO1xyXG5cclxuICAgIHRoaXMudmFsdWVbIHRoaXMuemVyb0luZGV4IF0gPSB0aGlzLnZhbHVlWyB0YXJnZXRJbmRleCBdO1xyXG4gICAgdGhpcy52YWx1ZVsgdGFyZ2V0SW5kZXggXSA9IDA7XHJcbiAgICB0aGlzLnplcm9JbmRleCA9IHRhcmdldEluZGV4O1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICog6I635Y+W5b2T5YmN6IqC54K555qE5Y+v6IO956e75Yqo5pa55ZCR77yI55SoIDAg5L2N55qE56e75Yqo6L+b6KGM6KGo56S677yJXHJcbiAgICovXHJcbiAgZ2V0WmVyb0RpcmVjdGlvbigpe1xyXG4gICAgbGV0IG5vZGUgPSB0aGlzO1xyXG4gICAgbGV0IERpcmVjdGlvbiA9IHt9O1xyXG4gICAgWyBcIlVQXCIsIFwiUklHSFRcIiwgXCJET1dOXCIsIFwiTEVGVFwiIF0uZm9yRWFjaCggZnVuY3Rpb24oZGlyKXtcclxuICAgICAgbGV0IF9kaXIgPSBESVJFQ1RJT05bZGlyXTtcclxuICAgICAgaWYgKCBub2RlLmNhbk1vdmVUbyggX2RpciApICl7XHJcbiAgICAgICAgbGV0IHRhcmdldEluZGV4ID0gbm9kZS5nZXRUYXJnZXRJbmRleCggX2RpciApO1xyXG4gICAgICAgIERpcmVjdGlvblsgZGlyIF0gPSBgJHtub2RlLnZhbHVlWyB0YXJnZXRJbmRleCBdfWA7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gICAgcmV0dXJuIERpcmVjdGlvbjtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIOWwhuW9k+WJjeiKgueCueeahOWPr+iDveenu+WKqOaWueWQkeeUseeUqCAwIOS9jeeahOenu+WKqOadpeihqOekuui9rOaNouaIkOeUqCAwIOS9jemCu+aOpeeahOmdniAwIOaVsOWtl+eahOenu+WKqOadpei/m+ihjOihqOekulxyXG4gICAqL1xyXG4gIGdldE5vblplcm9EaXJlY3Rpb24oKXtcclxuICAgIGxldCBEaXJlY3Rpb24gPSB7fTtcclxuICAgIGxldCB6ZXJvRGlyID0gdGhpcy5nZXRaZXJvRGlyZWN0aW9uKCk7XHJcbiAgICBmb3IgKCBsZXQgdmFsIGluIHplcm9EaXIgKXtcclxuICAgICAgLy8gbGV0IF92YWw7XHJcbiAgICAgIC8vIHN3aXRjaCggdmFsICl7XHJcbiAgICAgIC8vICAgY2FzZSBcIlVQXCI6XHJcbiAgICAgIC8vICAgICBfdmFsID0gXCJET1dOXCI7XHJcbiAgICAgIC8vICAgICBicmVhaztcclxuICAgICAgLy8gICBjYXNlIFwiUklHSFRcIjpcclxuICAgICAgLy8gICAgIF92YWwgPSBcIkxFRlRcIjtcclxuICAgICAgLy8gICAgIGJyZWFrO1xyXG4gICAgICAvLyAgIGNhc2UgXCJET1dOXCI6XHJcbiAgICAgIC8vICAgICBfdmFsID0gXCJVUFwiO1xyXG4gICAgICAvLyAgICAgYnJlYWs7XHJcbiAgICAgIC8vICAgY2FzZSBcIkxFRlRcIjpcclxuICAgICAgLy8gICAgIF92YWwgPSBcIlJJR0hUXCI7XHJcbiAgICAgIC8vICAgICBicmVhaztcclxuICAgICAgLy8gfVxyXG4gICAgICAvLyBEaXJlY3Rpb25bIHplcm9EaXJbIHZhbCBdIF0gPSBfdmFsO1xyXG5cclxuICAgICAgRGlyZWN0aW9uWyB6ZXJvRGlyWyB2YWwgXSBdID0gdmFsO1xyXG4gICAgfVxyXG4gICAgY29uc29sZS5sb2coIERpcmVjdGlvbiApO1xyXG4gICAgcmV0dXJuIERpcmVjdGlvbjtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIOiOt+WPluW9k+WJjeiKgueCueWcqOWPr+enu+WKqOaWueWQkeS4iueahOWtkOiKgueCueaVsOe7hFxyXG4gICAqL1xyXG4gIGdldE5leHROb2Rlcygpe1xyXG4gICAgbGV0IG5vZGUgPSB0aGlzO1xyXG4gICAgbGV0IG5leHROb2RlczogTm9kZVtdID0gW107XHJcbiAgICBbIERJUkVDVElPTi5VUCwgRElSRUNUSU9OLlJJR0hULCBESVJFQ1RJT04uRE9XTiwgRElSRUNUSU9OLkxFRlQgXS5mb3JFYWNoKCBmdW5jdGlvbihkaXJlY3Rpb24pe1xyXG4gICAgICBpZiAoIG5vZGUuY2FuTW92ZVRvKCBkaXJlY3Rpb24gKSApe1xyXG4gICAgICAgIGxldCBuZXdOb2RlID0gTm9kZS5ub2RlQ2xvbmUoIG5vZGUgKTtcclxuICAgICAgICBuZXdOb2RlLnBhcmVudCA9IG5vZGU7XHJcbiAgICAgICAgbmV3Tm9kZS5tb3ZlVG8oZGlyZWN0aW9uKTtcclxuICAgICAgICBuZXh0Tm9kZXMucHVzaCggbmV3Tm9kZSApO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICAgIHJldHVybiBuZXh0Tm9kZXM7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiDliKTmlq3lvZPliY3oioLngrnvvIjoioLngrnkuK3nmoQgMCDkvY3vvInmmK/lkKblj6/ku6Xmsr8gZGlyZWN0aW9uIOaWueWQkeenu+WKqFxyXG4gICAqL1xyXG4gIGNhbk1vdmVUbyggZGlyZWN0aW9uOiBudW1iZXIgKXtcclxuICAgIGxldCByb3cgPSBNYXRoLmZsb29yKCB0aGlzLnplcm9JbmRleCAvIHRoaXMuc2NhbGUgKTtcclxuICAgIGxldCBjb2wgPSB0aGlzLnplcm9JbmRleCAlIHRoaXMuc2NhbGU7XHJcblxyXG4gICAgc3dpdGNoKCBkaXJlY3Rpb24gKXtcclxuICAgICAgY2FzZSBESVJFQ1RJT04uVVA6XHJcbiAgICAgICAgcmV0dXJuIHJvdyAhPT0gMDtcclxuICAgICAgY2FzZSBESVJFQ1RJT04uUklHSFQ6XHJcbiAgICAgICAgcmV0dXJuIGNvbCAhPT0gdGhpcy5zY2FsZSAtIDE7XHJcbiAgICAgIGNhc2UgRElSRUNUSU9OLkRPV046XHJcbiAgICAgICAgcmV0dXJuIHJvdyAhPT0gdGhpcy5zY2FsZSAtIDE7XHJcbiAgICAgIGNhc2UgRElSRUNUSU9OLkxFRlQ6XHJcbiAgICAgICAgcmV0dXJuIGNvbCAhPT0gMDtcclxuICAgICAgZGVmYXVsdDpcclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiDojrflj5bku47lvZPliY3oioLngrnotbDliLDkuIvkuIDkuKroioLngrnnmoTku6Pku7dcclxuICAgKi9cclxuICBnZXRDb3N0VG9OZXh0KCl7XHJcbiAgICByZXR1cm4gMTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIOiuvue9ruiKgueCueeahCBGIOWAvO+8jOWghuS8muagueaNrui/meS4quWAvOi/m+ihjOaOkuW6j1xyXG4gICAqL1xyXG4gIHNldEYoIHZhbHVlOiBudW1iZXIgKXtcclxuICAgIHRoaXMuRiA9IHZhbHVlO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICog6I635Y+W6IqC54K555qEIEcg5YC8XHJcbiAgICovXHJcbiAgZ2V0Rygpe1xyXG4gICAgcmV0dXJuIHRoaXMuRztcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIOiuvue9ruiKgueCueeahCBHIOWAvFxyXG4gICAqL1xyXG4gIHNldEcoIHZhbHVlOiBudW1iZXIgKXtcclxuICAgIHRoaXMuRyA9IHZhbHVlO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICog6I635Y+W6IqC54K555qEIEgg5YC8XHJcbiAgICovXHJcbiAgZ2V0SCggdGFyZ2V0Tm9kZTogTm9kZSApe1xyXG4gICAgbGV0IGkgPSAwLFxyXG4gICAgICAgIGxlbiA9IHRoaXMudmFsdWUubGVuZ3RoLFxyXG4gICAgICAgIG1hbmhhdHRlbiA9IDAsXHJcbiAgICAgICAgZGlmZiA9IDA7XHJcblxyXG4gICAgZm9yICggOyBpIDwgbGVuOyBpICsrICl7XHJcbiAgICAgIGlmICggdGhpcy52YWx1ZVtpXSAhPT0gaSArIDEgKSBkaWZmICsrO1xyXG5cclxuICAgICAgbGV0IHYgPSB0aGlzLnZhbHVlW2ldO1xyXG4gICAgICBpZiggdiAhPT0gMCApe1xyXG4gICAgICAgIC8vIG5vdyBpblxyXG4gICAgICAgIGxldCByb3cgPSBNYXRoLmZsb29yKCBpL3RoaXMuc2NhbGUgKTtcclxuICAgICAgICBsZXQgY29sID0gaSV0aGlzLnNjYWxlO1xyXG4gICAgICAgIC8vIHNob3VsZCBpblxyXG4gICAgICAgIGxldCBfcm93ID0gTWF0aC5mbG9vciggdi90aGlzLnNjYWxlICk7XHJcbiAgICAgICAgbGV0IF9jb2wgPSB2JXRoaXMuc2NhbGU7XHJcblxyXG4gICAgICAgIG1hbmhhdHRlbiArPSBNYXRoLmFicyggcm93IC0gX3JvdyApICsgTWF0aC5hYnMoIGNvbCAtIF9jb2wgKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiAyKm1hbmhhdHRlbiArIDEwMCpkaWZmO1xyXG4gIH1cclxuXHJcbiAgLy8gcHJpdmF0ZSBmdW5jdGlvblxyXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS1cclxuXHJcbiAgLyoqXHJcbiAgICog5qC55o2u57u05bqmIHNjYWxlIOaehOmAoOiKgueCueeahOWIneWni+ihqOekuuaVsOe7hFxyXG4gICAqL1xyXG4gIHByaXZhdGUgaW5pdE5vZGVWYWx1ZUJ5U2NhbGUoIHNjYWxlOiBudW1iZXIgKXtcclxuICAgIGxldCB2YWwgPSBbXTtcclxuICAgIGZvciAoIGxldCBpID0gMTsgaSA8IE1hdGgucG93KHNjYWxlLCAyKTsgaSArKyApe1xyXG4gICAgICB2YWwucHVzaCggaSApO1xyXG4gICAgfVxyXG4gICAgdmFsLnB1c2goIDAgKTtcclxuICAgIHJldHVybiB2YWw7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiDojrflj5blvZPliY3oioLngrnkuK3lpITkuo4gMCDkvY3nmoTmlrnlkJEgZGlyZWN0aW9uIOWkhOeahOmCu+aOpeaVsOWtl+eahOS4i+agh1xyXG4gICAqL1xyXG4gIHByaXZhdGUgZ2V0VGFyZ2V0SW5kZXgoIGRpcmVjdGlvbjogbnVtYmVyICl7XHJcbiAgICBpZiAoICF0aGlzLmNhbk1vdmVUbyggZGlyZWN0aW9uICkgKSByZXR1cm47XHJcbiAgICBsZXQgdGFyZ2V0SW5kZXg7XHJcbiAgICBzd2l0Y2goIGRpcmVjdGlvbiApe1xyXG4gICAgICBjYXNlIERJUkVDVElPTi5VUDpcclxuICAgICAgICB0YXJnZXRJbmRleCA9IHRoaXMuemVyb0luZGV4IC0gdGhpcy5zY2FsZTtcclxuICAgICAgICBicmVhaztcclxuICAgICAgY2FzZSBESVJFQ1RJT04uUklHSFQ6XHJcbiAgICAgICAgdGFyZ2V0SW5kZXggPSB0aGlzLnplcm9JbmRleCArIDE7XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIGNhc2UgRElSRUNUSU9OLkRPV046XHJcbiAgICAgICAgdGFyZ2V0SW5kZXggPSB0aGlzLnplcm9JbmRleCArIHRoaXMuc2NhbGU7XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIGNhc2UgRElSRUNUSU9OLkxFRlQ6XHJcbiAgICAgICAgdGFyZ2V0SW5kZXggPSB0aGlzLnplcm9JbmRleCAtIDE7XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgdGFyZ2V0SW5kZXggPSB0aGlzLnplcm9JbmRleDtcclxuICAgIH1cclxuICAgIHJldHVybiB0YXJnZXRJbmRleDtcclxuICB9XHJcblxyXG4gIC8vIHN0YXRpYyBmdW5jdGlvblxyXG4gIC8vIC0tLS0tLS0tLS0tLS0tLVxyXG5cclxuICAvKipcclxuICAgKiDliKTmlq3kuKTkuKroioLngrnmmK/lkKbnm7jnrYlcclxuICAgKiDpgJrov4flsIboioLngrnnmoTmlbDnu4TooajnpLrovazmjaLmiJDlrZfnrKbkuLLmnaXov5vooYzmr5TovoNcclxuICAgKi9cclxuICBzdGF0aWMgaXNTYW1lKCBjdXJyZW50Tm9kZTogTm9kZSwgdGFyZ2V0Tm9kZTogTm9kZSApe1xyXG4gICAgcmV0dXJuIGN1cnJlbnROb2RlLmdldFZhbFN0cigpID09PSB0YXJnZXROb2RlLmdldFZhbFN0cigpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICog5Z+65LqOIG5vZGUg5aSN5Yi25LiA5Liq5paw55qE6IqC54K5XHJcbiAgICovXHJcbiAgc3RhdGljIG5vZGVDbG9uZSggbm9kZTogTm9kZSApe1xyXG4gICAgbGV0IG5ld05vZGUgPSBuZXcgTm9kZSggbm9kZS5zY2FsZSApO1xyXG4gICAgbmV3Tm9kZS52YWx1ZSA9IG5vZGUudmFsdWUuc2xpY2UoMCk7XHJcbiAgICBuZXdOb2RlLnplcm9JbmRleCA9IG5vZGUuemVyb0luZGV4O1xyXG4gICAgcmV0dXJuIG5ld05vZGU7XHJcbiAgfVxyXG59XHJcbiIsImV4cG9ydCBlbnVtIERJUkVDVElPTiAgeyBVUCA9IDEsIFJJR0hULCBET1dOLCBMRUZUIH1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgYmVsb25nVG97XHJcbiAgICBbcHJvcE5hbWU6IHN0cmluZ106IG51bWJlcjtcclxufTtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiAkaWQoZWxlSWQ6IHN0cmluZyl7XHJcbiAgcmV0dXJuIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCBlbGVJZCApO1xyXG59O1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uICRjcmVhdGVFbGUoIHRhZ05hbWU6IHN0cmluZywgaWQ/OiBzdHJpbmcsIGNsYXNzTmFtZT86IHN0cmluZyApe1xyXG4gIGxldCBlbGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCB0YWdOYW1lICk7XHJcbiAgaWYoIGlkICkgZWxlLmlkID0gaWQ7XHJcbiAgaWYoIGNsYXNzTmFtZSApIGVsZS5jbGFzc05hbWUgPSBjbGFzc05hbWU7XHJcbiAgcmV0dXJuIGVsZTtcclxufTtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiAkcmVwbGFjZUNsYXNzKCBlbGUsIG5ld0NsYXNzOiBzdHJpbmcsIHByZWZpeDogc3RyaW5nICApe1xyXG4gIGxldCByZWcgPSBuZXcgUmVnRXhwKCBgJHtwcmVmaXh9LShcXFxcZCkrYCwgJ2cnICk7XHJcbiAgZWxlLmNsYXNzTmFtZSA9IGVsZS5jbGFzc05hbWUucmVwbGFjZSggcmVnLCBuZXdDbGFzcyApO1xyXG59XHJcblxyXG5mdW5jdGlvbiAkYWRkQ2xhc3MoIGVsZSwgbmV3Q2xhc3M6IHN0cmluZyApe1xyXG4gIGlmICggZWxlLmNsYXNzTmFtZS5pbmRleE9mKCBuZXdDbGFzcyApID09PSAtMSApe1xyXG4gICAgZWxlLmNsYXNzTmFtZSA9IGAke2VsZS5jbGFzc05hbWV9ICR7bmV3Q2xhc3N9YDtcclxuICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uICRyZW1vdmVDbGFzcyggZWxlLCByZW1vdmU6IHN0cmluZyApe1xyXG4gIGVsZS5jbGFzc05hbWUgPSBlbGUuY2xhc3NOYW1lLnJlcGxhY2UoIHJlbW92ZSwgJycgKS50cmltKCk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiAkZ2V0UG9zKCBjbGFzc05hbWU6IHN0cmluZyApe1xyXG4gIGxldCBjbGFzc0FyciA9IGNsYXNzTmFtZS5zcGxpdCgnICcpO1xyXG4gIGZvciAoIGxldCBpID0gMCwgbGVuID0gY2xhc3NBcnIubGVuZ3RoOyBpIDwgbGVuOyBpICsrICl7XHJcbiAgICBpZiAoIGNsYXNzQXJyW2ldLmluZGV4T2YoICdwb3MnICkgIT09IC0xICl7XHJcbiAgICAgICAgcmV0dXJuIGNsYXNzQXJyW2ldLnNwbGl0KCctJylbMV07XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gJGdldEltZ0lkKCBjbGFzc05hbWU6IHN0cmluZyApe1xyXG4gIGxldCBjbGFzc0FyciA9IGNsYXNzTmFtZS5zcGxpdCgnICcpO1xyXG4gIGZvciAoIGxldCBpID0gMCwgbGVuID0gY2xhc3NBcnIubGVuZ3RoOyBpIDwgbGVuOyBpICsrICl7XHJcbiAgICBpZiAoIGNsYXNzQXJyW2ldLmluZGV4T2YoICdpdGVtLScgKSAhPT0gLTEgKXtcclxuICAgICAgICByZXR1cm4gY2xhc3NBcnJbaV0uc3BsaXQoJy0nKVsxXTtcclxuICAgIH1cclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiAkZXhjaGFuZ2VQb3MoIGl0ZW0xLCBpdGVtMiApe1xyXG4gIGxldCBwb3MxID0gJGdldFBvcyggaXRlbTEuY2xhc3NOYW1lICk7XHJcbiAgbGV0IHBvczIgPSAkZ2V0UG9zKCBpdGVtMi5jbGFzc05hbWUgKTtcclxuXHJcbiAgJHJlbW92ZUNsYXNzKCBpdGVtMiwgYHBvcy0ke3BvczJ9YCApO1xyXG4gICRhZGRDbGFzcyggaXRlbTIsIGBwb3MtJHtwb3MxfWAgKTtcclxuICAkcmVtb3ZlQ2xhc3MoIGl0ZW0xLCBgcG9zLSR7cG9zMX1gICk7XHJcbiAgJGFkZENsYXNzKCBpdGVtMSwgYHBvcy0ke3BvczJ9YCApO1xyXG59XHJcbiJdfQ==
