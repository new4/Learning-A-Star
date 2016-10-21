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
        this.isWin = false;
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
        console.log("runing = ", this.running, " -- ", "isWin = ", this.isWin);
        if (this.running || this.isWin)
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
        var game = this;
        var id = setTimeout(function () {
            game.running = false;
            game.imgContainer.className = 'win';
            game.isWin = true;
            clearTimeout(id);
        }, 300);
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
        // win 效果部分
        this.imgContainer.addEventListener('click', function (e) {
            if (this === e.target) {
                this.className = '';
                game.isWin = false;
            }
        });
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
            if (node_1.default.isSame(this.currentNode, this.targetNode))
                this.win();
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
            Direction[zeroDir[val]] = val;
        }
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy8ubnBtaW5zdGFsbC9icm93c2VyLXBhY2svNi4wLjEvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwic3JjL3RzL2FzdGFyLnRzIiwic3JjL3RzL2dhbWUudHMiLCJzcmMvdHMvaGVhcC50cyIsInNyYy90cy9tYWluLnRzIiwic3JjL3RzL25vZGUudHMiLCJzcmMvdHMvdXRpbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7QUNBQSxxQkFBaUIsUUFBUSxDQUFDLENBQUE7QUFDMUIscUJBQWlCLFFBQVEsQ0FBQyxDQUFBO0FBRzFCOztHQUVHO0FBQ0g7SUFTSSxlQUFZLFNBQWUsRUFBRSxVQUFnQjtRQVA3QyxlQUFVLEdBQVcsRUFBRSxDQUFBO1FBSWYsaUJBQVksR0FBYSxFQUFFLENBQUE7UUFDM0IsYUFBUSxHQUFXLEVBQUUsQ0FBQTtRQUd6QixJQUFJLENBQUMsU0FBUyxHQUFHLFNBQVMsQ0FBQztRQUMzQixJQUFJLENBQUMsVUFBVSxHQUFHLFVBQVUsQ0FBQztRQUM3QixJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksY0FBSSxDQUFDLENBQUMsU0FBUyxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUM7SUFDL0MsQ0FBQztJQUVELGtCQUFrQjtJQUNsQixrQkFBa0I7SUFFbEI7O09BRUc7SUFDSCxtQkFBRyxHQUFIO1FBQ0ksSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDO1FBQ2pCO1lBQ0ksSUFBSSxXQUFXLEdBQUcsS0FBSyxDQUFDLFFBQVEsQ0FBQyxHQUFHLEVBQUUsQ0FBQztZQUN2QyxLQUFLLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztZQUNuQyxLQUFLLENBQUMsWUFBWSxDQUFDLFdBQVcsQ0FBQyxTQUFTLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUVoRCxJQUFJLFNBQVMsR0FBRyxXQUFXLENBQUMsWUFBWSxFQUFFLENBQUM7WUFFM0MsU0FBUyxDQUFDLE9BQU8sQ0FBQyxVQUFT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RyxDQUFDLENBQUM7SUFDcEMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLEdBQUcsR0FBRyxRQUFRLENBQUMsTUFBTSxFQUFFLENBQUMsR0FBRyxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQztRQUNsRCxFQUFFLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNwQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNyQyxDQUFDO0lBQ0wsQ0FBQztBQUNMLENBQUM7QUFQZSxlQUFPLFVBT3RCLENBQUE7QUFFRCxtQkFBMEIsU0FBaUI7SUFDdkMsSUFBSSxRQUFRLEdBQUcsU0FBUyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUNwQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsR0FBRyxHQUFHLFFBQVEsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxHQUFHLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDO1FBQ2xELEVBQUUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3RDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3JDLENBQUM7SUFDTCxDQUFDO0FBQ0wsQ0FBQztBQVBlLGlCQUFTLFlBT3hCLENBQUE7QUFFRCxzQkFBNkIsS0FBSyxFQUFFLEtBQUs7SUFDckMsSUFBSSxJQUFJLEdBQUcsT0FBTyxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQztJQUNwQyxJQUFJLElBQUksR0FBRyxPQUFPLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBRXBDLFlBQVksQ0FBQyxLQUFLLEVBQUUsU0FBTyxJQUFNLENBQUMsQ0FBQztJQUNuQyxTQUFTLENBQUMsS0FBSyxFQUFFLFNBQU8sSUFBTSxDQUFDLENBQUM7SUFDaEMsWUFBWSxDQUFDLEtBQUssRUFBRSxTQUFPLElBQU0sQ0FBQyxDQUFDO0lBQ25DLFNBQVMsQ0FBQyxLQUFLLEVBQUUsU0FBTyxJQUFNLENBQUMsQ0FBQztBQUNwQyxDQUFDO0FBUmUsb0JBQVksZUFRM0IsQ0FBQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJpbXBvcnQgTm9kZSBmcm9tICcuL25vZGUnO1xyXG5pbXBvcnQgSGVhcCBmcm9tICcuL2hlYXAnO1xyXG5pbXBvcnQgeyBiZWxvbmdUbyB9IGZyb20gJy4vdXRpbCc7XHJcblxyXG4vKipcclxuICogQSog566X5rOVXHJcbiAqL1xyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBBc3RhciB7XHJcbiAgICBvcGVuTGlzdDogSGVhcFxyXG4gICAgY2xvc2VkTGlzdDogTm9kZVtdID0gW11cclxuICAgIHN0YXJ0Tm9kZTogTm9kZVxyXG4gICAgdGFyZ2V0Tm9kZTogTm9kZVxyXG5cclxuICAgIHByaXZhdGUgYl9jbG9zZWRMaXN0OiBiZWxvbmdUbyA9IHt9XHJcbiAgICBwcml2YXRlIHNvbHV0aW9uOiBOb2RlW10gPSBbXVxyXG5cclxuICAgIGNvbnN0cnVjdG9yKHN0YXJ0Tm9kZTogTm9kZSwgdGFyZ2V0Tm9kZTogTm9kZSkge1xyXG4gICAgICAgIHRoaXMuc3RhcnROb2RlID0gc3RhcnROb2RlO1xyXG4gICAgICAgIHRoaXMudGFyZ2V0Tm9kZSA9IHRhcmdldE5vZGU7XHJcbiAgICAgICAgdGhpcy5vcGVuTGlzdCA9IG5ldyBIZWFwKFtzdGFydE5vZGVdLCBcIkZcIik7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gcHVibGljIGZ1bmN0aW9uXHJcbiAgICAvLyAtLS0tLS0tLS0tLS0tLS1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOi/kOihjCBBKiDnrpfms5VcclxuICAgICAqL1xyXG4gICAgcnVuKCkge1xyXG4gICAgICAgIGxldCBhc3RhciA9IHRoaXM7XHJcbiAgICAgICAgd2hpbGUgKCFOb2RlLmlzU2FtZShhc3Rhci5vcGVuTGlzdC50b3AoKSwgYXN0YXIudGFyZ2V0Tm9kZSkpIHtcclxuICAgICAgICAgICAgbGV0IGN1cnJlbnROb2RlID0gYXN0YXIub3Blbkxpc3QucG9wKCk7XHJcbiAgICAgICAgICAgIGFzdGFyLmNsb3NlZExpc3QucHVzaChjdXJyZW50Tm9kZSk7XHJcbiAgICAgICAgICAgIGFzdGFyLmJfY2xvc2VkTGlzdFtjdXJyZW50Tm9kZS5nZXRWYWxTdHIoKV0gPSAxO1xyXG5cclxuICAgICAgICAgICAgbGV0IG5leHROb2RlcyA9IGN1cnJlbnROb2RlLmdldE5leHROb2RlcygpO1xyXG5cclxuICAgICAgICAgICAgbmV4dE5vZGVzLmZvckVhY2goZnVuY3Rpb24obmV4dE5vZGUpIHtcclxuICAgICAgICAgICAgICAgIGxldCBjb3N0ID0gY3VycmVudE5vZGUuZ2V0RygpICsgY3VycmVudE5vZGUuZ2V0Q29zdFRvTmV4dCgpO1xyXG4gICAgICAgICAgICAgICAgbGV0IGluZGV4ID0gYXN0YXIub3Blbkxpc3QuZ2V0SXRlbUluZGV4KG5leHROb2RlKTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoaW5kZXggIT09IHVuZGVmaW5lZCAmJiBjb3N0IDwgbmV4dE5vZGUuZ2V0RygpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJuZXh0IDFcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgYXN0YXIub3Blbkxpc3QucmVtb3ZlKGluZGV4KTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoYXN0YXIuaXNCZWxvbmdUb0Nsb3NlZChuZXh0Tm9kZSkgJiYgY29zdCA8IG5leHROb2RlLmdldEcoKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwibmV4dCAyXCIpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGlmIChpbmRleCA9PT0gdW5kZWZpbmVkICYmICFhc3Rhci5pc0JlbG9uZ1RvQ2xvc2VkKG5leHROb2RlKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwibmV4dCAzXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIG5leHROb2RlLnNldEcoY29zdCk7XHJcbiAgICAgICAgICAgICAgICAgICAgbmV4dE5vZGUuc2V0RihuZXh0Tm9kZS5nZXRHKCkgKyBuZXh0Tm9kZS5nZXRIKGFzdGFyLnRhcmdldE5vZGUpKTtcclxuICAgICAgICAgICAgICAgICAgICBhc3Rhci5vcGVuTGlzdC5wdXNoKG5leHROb2RlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgdGFpbE5vZGUgPSBhc3Rhci5vcGVuTGlzdC50b3AoKTtcclxuICAgICAgICB0aGlzLnNvbHV0aW9uID0gW107XHJcbiAgICAgICAgd2hpbGUgKHRhaWxOb2RlKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc29sdXRpb24ucHVzaCh0YWlsTm9kZSk7XHJcbiAgICAgICAgICAgIHRhaWxOb2RlID0gdGFpbE5vZGUucGFyZW50O1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyB0aGlzLnNob3dTb2x1dGlvbigpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog6L+Q6KGMIEEqIOeul+azlSAoIOeJiOacrCAyICkg5a6e6aqM55SoXHJcbiAgICAgKi9cclxuICAgIHJ1bjIoKSB7XHJcbiAgICAgICAgbGV0IGFzdGFyID0gdGhpcztcclxuICAgICAgICB3aGlsZSAoIU5vZGUuaXNTYW1lKGFzdGFyLm9wZW5MaXN0LnRvcCgpLCBhc3Rhci50YXJnZXROb2RlKSkge1xyXG4gICAgICAgICAgICBsZXQgY3VycmVudE5vZGUgPSBhc3Rhci5vcGVuTGlzdC5wb3AoKTtcclxuICAgICAgICAgICAgYXN0YXIuY2xvc2VkTGlzdC5wdXNoKGN1cnJlbnROb2RlKTtcclxuICAgICAgICAgICAgYXN0YXIuYl9jbG9zZWRMaXN0W2N1cnJlbnROb2RlLmdldFZhbFN0cigpXSA9IDE7XHJcblxyXG4gICAgICAgICAgICBsZXQgbmV4dE5vZGVzID0gY3VycmVudE5vZGUuZ2V0TmV4dE5vZGVzKCk7XHJcblxyXG4gICAgICAgICAgICBuZXh0Tm9kZXMuZm9yRWFjaChmdW5jdGlvbihuZXh0Tm9kZSkge1xyXG4gICAgICAgICAgICAgICAgbGV0IGNvc3QgPSBjdXJyZW50Tm9kZS5nZXRHKCkgKyBjdXJyZW50Tm9kZS5nZXRDb3N0VG9OZXh0KCk7XHJcbiAgICAgICAgICAgICAgICBsZXQgaW5kZXggPSBhc3Rhci5vcGVuTGlzdC5nZXRJdGVtSW5kZXgobmV4dE5vZGUpO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChpbmRleCAhPT0gdW5kZWZpbmVkICYmIGNvc3QgPCBuZXh0Tm9kZS5nZXRHKCkpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIm5leHQgMVwiKTtcclxuICAgICAgICAgICAgICAgICAgICBhc3Rhci5vcGVuTGlzdC5yZW1vdmUoaW5kZXgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGlmIChhc3Rhci5pc0JlbG9uZ1RvQ2xvc2VkKG5leHROb2RlKSAmJiBjb3N0IDwgbmV4dE5vZGUuZ2V0RygpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJuZXh0IDJcIik7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKGluZGV4ID09PSB1bmRlZmluZWQgJiYgIWFzdGFyLmlzQmVsb25nVG9DbG9zZWQobmV4dE5vZGUpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJuZXh0IDNcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgbmV4dE5vZGUuc2V0Ryhjb3N0KTtcclxuICAgICAgICAgICAgICAgICAgICBuZXh0Tm9kZS5zZXRGKG5leHROb2RlLmdldEcoKSArIG5leHROb2RlLmdldEgoYXN0YXIudGFyZ2V0Tm9kZSkpO1xyXG4gICAgICAgICAgICAgICAgICAgIGFzdGFyLm9wZW5MaXN0LnB1c2gobmV4dE5vZGUpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxldCB0YWlsTm9kZSA9IGFzdGFyLm9wZW5MaXN0LnRvcCgpO1xyXG4gICAgICAgIHRoaXMuc29sdXRpb24gPSBbXTtcclxuICAgICAgICB3aGlsZSAodGFpbE5vZGUpIHtcclxuICAgICAgICAgICAgdGhpcy5zb2x1dGlvbi5wdXNoKHRhaWxOb2RlKTtcclxuICAgICAgICAgICAgdGFpbE5vZGUgPSB0YWlsTm9kZS5wYXJlbnQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuc2hvd1NvbHV0aW9uKCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDojrflj5bop6PlhrPmlrnmoYjmlbDnu4RcclxuICAgICAqL1xyXG4gICAgZ2V0U29sdXRpb24oKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuc29sdXRpb247XHJcbiAgICB9XHJcblxyXG4gICAgLy8gcHJpdmF0ZSBmdW5jdGlvblxyXG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDliKTmlq3oioLngrnmmK/lkKblnKggQ0xPU0VEIOS4rVxyXG4gICAgICovXHJcbiAgICBwcml2YXRlIGlzQmVsb25nVG9DbG9zZWQobm9kZTogTm9kZSkge1xyXG4gICAgICAgIGxldCBzdHIgPSBub2RlLmdldFZhbFN0cigpO1xyXG4gICAgICAgIHJldHVybiAhIXRoaXMuYl9jbG9zZWRMaXN0W3N0cl07XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDmmL7npLrop6PlhrPmlrnmoYjnmoTlhbfkvZPmraXpqqRcclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSBzaG93U29sdXRpb24oKSB7XHJcbiAgICAgICAgbGV0IGxlbiA9IHRoaXMuc29sdXRpb24ubGVuZ3RoLFxyXG4gICAgICAgICAgICBpID0gbGVuIC0gMSxcclxuICAgICAgICAgICAgc2NhbGUgPSB0aGlzLnRhcmdldE5vZGUuc2NhbGU7XHJcbiAgICAgICAgZm9yICg7IGkgPiAtMTsgaS0tKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGBTdGVwICR7bGVuIC0gaX06IGApO1xyXG4gICAgICAgICAgICBsZXQgaXRlbSA9IHRoaXMuc29sdXRpb25baV0uZ2V0VmFsU3RyKCkuc3BsaXQoJywnKTtcclxuICAgICAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBzY2FsZTsgaisrKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhgfCAke2l0ZW1baiAqIHNjYWxlXX0gJHtpdGVtW2ogKiBzY2FsZSArIDFdfSAke2l0ZW1baiAqIHNjYWxlICsgMl19IHxgKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQgTm9kZSBmcm9tIFwiLi9ub2RlXCI7XHJcbmltcG9ydCBBc3RhciBmcm9tICcuL2FzdGFyJztcclxuaW1wb3J0IHsgJGlkLCAkY3JlYXRlRWxlLCAkcmVwbGFjZUNsYXNzLCAkZ2V0UG9zLCAkZ2V0SW1nSWQsICRleGNoYW5nZVBvcywgRElSRUNUSU9OIH0gZnJvbSAnLi91dGlsJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEdhbWUge1xyXG4gICAgY3VycmVudE5vZGU6IE5vZGVcclxuICAgIHRhcmdldE5vZGU6IE5vZGVcclxuICAgIHNjYWxlOiBudW1iZXJcclxuICAgIHJ1bm5pbmc6IGJvb2xlYW4gPSBmYWxzZVxyXG4gICAgaXNXaW46IGJvb2xlYW4gPSBmYWxzZVxyXG5cclxuICAgIHByaXZhdGUgZ2FtZUNvbnRhaW5lcklkOiBzdHJpbmdcclxuICAgIHByaXZhdGUgaW1nQ29udGFpbmVySWQgPSBcImltYWdlXCJcclxuICAgIHByaXZhdGUgYWN0aW9uQ29udGFpbmVySWQgPSBcImFjdGlvblwiXHJcbiAgICBwcml2YXRlIGluZm9JZCA9IFwiaW5mb1wiXHJcblxyXG4gICAgcHJpdmF0ZSBnYW1lQ29udGFpbmVyXHJcbiAgICBwcml2YXRlIGltZ0NvbnRhaW5lclxyXG4gICAgcHJpdmF0ZSBhY3Rpb25Db250YWluZXJcclxuICAgIHByaXZhdGUgaW5mb0NvbnRhaW5lclxyXG5cclxuICAgIC8vIOe8k+WtmOaJgOacieeahOWbvueJh+eJh+autSBkb23vvIzlhY3lvpflho3mib5cclxuICAgIHByaXZhdGUgaW1nRWxlbWVudHMgPSBbXVxyXG4gICAgLy8g57yT5a2Y56m655m95Zu+54mH54mH5q61IGRvbe+8jOWFjeW+l+WGjeaJvlxyXG4gICAgcHJpdmF0ZSBibGFua0ltZ0VsZVxyXG5cclxuICAgIHByaXZhdGUgdGltZUluZm9FbGVcclxuICAgIHByaXZhdGUgc3RlcEluZm9FbGVcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihnYW1lQ29udGFpbmVySWQ6IHN0cmluZywgc2NhbGU6IG51bWJlcikge1xyXG4gICAgICAgIHRoaXMuY3VycmVudE5vZGUgPSBuZXcgTm9kZShzY2FsZSk7XHJcbiAgICAgICAgdGhpcy50YXJnZXROb2RlID0gbmV3IE5vZGUoc2NhbGUpO1xyXG4gICAgICAgIHRoaXMuc2NhbGUgPSBzY2FsZTtcclxuXHJcbiAgICAgICAgdGhpcy5nYW1lQ29udGFpbmVySWQgPSBnYW1lQ29udGFpbmVySWQ7XHJcblxyXG4gICAgICAgIHRoaXMuZ2FtZUNvbnRhaW5lciA9ICRpZCh0aGlzLmdhbWVDb250YWluZXJJZCk7XHJcbiAgICAgICAgdGhpcy5pbWdDb250YWluZXIgPSAkY3JlYXRlRWxlKCdkaXYnLCB0aGlzLmltZ0NvbnRhaW5lcklkKTtcclxuICAgICAgICB0aGlzLmFjdGlvbkNvbnRhaW5lciA9ICRjcmVhdGVFbGUoJ2RpdicsIHRoaXMuYWN0aW9uQ29udGFpbmVySWQpO1xyXG4gICAgICAgIHRoaXMuaW5mb0NvbnRhaW5lciA9ICRjcmVhdGVFbGUoJ2RpdicsIHRoaXMuaW5mb0lkKTtcclxuXHJcbiAgICAgICAgdGhpcy5pbml0KCk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gcHVibGljIGZ1bmN0aW9uXHJcbiAgICAvLyAtLS0tLS0tLS0tLS0tLS1cclxuXHJcbiAgICAvKipcclxuICAgICAqIG1peCDmjInpkq7miafooYzlh73mlbBcclxuICAgICAqIOa3t+WQiO+8jOeUsei1t+Wni+iKgueCueS5seW6j+W+l+WIsOS4gOS4quaWsOeahOiKgueCue+8jOW5tuagueaNruaWsOiKgueCueiuvue9rumhtemdouS4reeahOaYvuekuueKtuaAgVxyXG4gICAgICovXHJcbiAgICBtaXgoKSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJydW5pbmcgPSBcIiwgdGhpcy5ydW5uaW5nLCBcIiAtLSBcIiwgXCJpc1dpbiA9IFwiLCB0aGlzLmlzV2luKTtcclxuICAgICAgICBpZiAodGhpcy5ydW5uaW5nIHx8IHRoaXMuaXNXaW4pIHJldHVybjtcclxuICAgICAgICB0aGlzLmN1cnJlbnROb2RlLnNodWZmbGUoKTtcclxuICAgICAgICB0aGlzLnNldFN0YXR1c0J5Tm9kZSh0aGlzLmN1cnJlbnROb2RlKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIHN0YXJ0IOaMiemSruaJp+ihjOWHveaVsFxyXG4gICAgICog5omn6KGMIEEqIOeul+azlVxyXG4gICAgICovXHJcbiAgICBzdGFydCgpIHtcclxuICAgICAgICBsZXQgZ2FtZSA9IHRoaXM7XHJcblxyXG4gICAgICAgIGlmIChnYW1lLnJ1bm5pbmcpIHJldHVybjtcclxuICAgICAgICBnYW1lLnJ1bm5pbmcgPSB0cnVlO1xyXG5cclxuICAgICAgICBpZiAoTm9kZS5pc1NhbWUodGhpcy5jdXJyZW50Tm9kZSwgdGhpcy50YXJnZXROb2RlKSkge1xyXG4gICAgICAgICAgICB0aGlzLndpbigpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGxldCBhc3RhciA9IG5ldyBBc3Rhcih0aGlzLmN1cnJlbnROb2RlLCB0aGlzLnRhcmdldE5vZGUpO1xyXG5cclxuICAgICAgICAgICAgY29uc29sZS50aW1lKFwiQVN0YXIgUnVuICFcIik7XHJcbiAgICAgICAgICAgIGxldCBzdGFydFRpbWUgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcclxuICAgICAgICAgICAgYXN0YXIucnVuKCk7XHJcbiAgICAgICAgICAgIGxldCBlbmRUaW1lID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XHJcbiAgICAgICAgICAgIGNvbnNvbGUudGltZUVuZChcIkFTdGFyIFJ1biAhXCIpO1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIiBhc3RhciAtIFwiLCBhc3Rhcik7XHJcblxyXG4gICAgICAgICAgICBnYW1lLnRpbWVJbmZvRWxlLmlubmVySFRNTCA9IGAke2VuZFRpbWUgLSBzdGFydFRpbWV9IG1zYDtcclxuXHJcbiAgICAgICAgICAgIGxldCBzb2x1dGlvbiA9IGFzdGFyLmdldFNvbHV0aW9uKCk7XHJcbiAgICAgICAgICAgIGlmIChzb2x1dGlvbi5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgIGxldCBsZW4gPSBzb2x1dGlvbi5sZW5ndGgsXHJcbiAgICAgICAgICAgICAgICAgICAgaSA9IGxlbiAtIDE7XHJcblxyXG4gICAgICAgICAgICAgICAgbGV0IHJ1bklkID0gc2V0SW50ZXJ2YWwoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGkgPT09IC0xKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsZWFySW50ZXJ2YWwocnVuSWQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBnYW1lLndpbigpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGdhbWUuY3VycmVudE5vZGUgPSBzb2x1dGlvbltpXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZ2FtZS5zZXRTdGF0dXNCeU5vZGUoc29sdXRpb25baV0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBnYW1lLnN0ZXBJbmZvRWxlLmlubmVySFRNTCA9IGAke2xlbiAtIGl9XFwvJHtsZW59YDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaS0tO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0sIDE4MCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDotaLlvpfmuLjmiI9cclxuICAgICAqL1xyXG4gICAgd2luKCkge1xyXG4gICAgICAgIGxldCBnYW1lID0gdGhpcztcclxuICAgICAgICBsZXQgaWQgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBnYW1lLnJ1bm5pbmcgPSBmYWxzZTtcclxuICAgICAgICAgICAgZ2FtZS5pbWdDb250YWluZXIuY2xhc3NOYW1lID0gJ3dpbic7XHJcbiAgICAgICAgICAgIGdhbWUuaXNXaW4gPSB0cnVlO1xyXG4gICAgICAgICAgICBjbGVhclRpbWVvdXQoaWQpO1xyXG4gICAgICAgIH0sIDMwMCk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gcHJpdmF0ZSBmdW5jdGlvblxyXG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDliJ3lp4vljJblh73mlbBcclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSBpbml0KCkge1xyXG4gICAgICAgIHRoaXMuaW5pdEltYWdlKCk7XHJcbiAgICAgICAgdGhpcy5pbml0T3BlcmF0aW9uKCk7XHJcbiAgICAgICAgdGhpcy5pbml0SW5mbygpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog5ou85Zu+5ri45oiP55qE5Zu+54mH5pi+56S66YOo5YiG55qE5Yid5aeL5YyWXHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgaW5pdEltYWdlKCkge1xyXG4gICAgICAgIGxldCBnYW1lID0gdGhpcztcclxuICAgICAgICAvLyDoioLngrnnmoTmlbDnu4TooajnpLrkuK3nmoTmr4/kuIDkuKrmlbDnu4TnmoTpobnlr7nlupTkuIDkuKrmoLzlrZBcclxuICAgICAgICBmb3IgKGxldCBpID0gTWF0aC5wb3coZ2FtZS5zY2FsZSwgMikgLSAxOyBpID4gLTE7IGktLSkge1xyXG4gICAgICAgICAgICAvLyDmoLflvI8gaXRlbS0qIOinhOWumuafkOS4gOagvOWtkOWvueW6lOeahOWbvueJh+eJh+aute+8jOi/memDqOWIhuWIneWni+WMluWQjuS4jeWGjeaUueWPmFxyXG4gICAgICAgICAgICAvLyDmoLflvI8gcG9zLSog6KeE5a6a5p+Q5LiA5qC85a2Q5ZyoICNpbWFnZSDlrrnlmajkuK3nmoTkvY3nva7vvIzov5npg6jliIbpmo/nnYDoioLngrnlj5jljJbogIzmlLnlj5hcclxuICAgICAgICAgICAgbGV0IGVsZSA9ICRjcmVhdGVFbGUoJ2RpdicsIHVuZGVmaW5lZCwgYGl0ZW0gaXRlbS0ke2l9IHBvcy0ke2l9YCk7XHJcblxyXG4gICAgICAgICAgICBlbGUuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbihlKSB7IGdhbWUuaW1nRnJhZ21lbnRIYW5kbGVyKGUpIH0pO1xyXG5cclxuICAgICAgICAgICAgLy8g5Yid5aeL5YyW55qE5pe26LCD5pW056m655m95qC86YOo5YiGKCDmoLflvI/kuLrvvJogLml0ZW0uaXRlbS0wLnBvcy0wICnnmoTkvY3nva5cclxuICAgICAgICAgICAgLy8g5ZCM5pe25bCG5Zu+54mH54mH5q6155qEIGRvbSDnvJPlrZhcclxuICAgICAgICAgICAgaWYgKGkgPT09IDApIHtcclxuICAgICAgICAgICAgICAgIGdhbWUuaW1nQ29udGFpbmVyLmFwcGVuZENoaWxkKGVsZSk7XHJcbiAgICAgICAgICAgICAgICBnYW1lLmltZ0VsZW1lbnRzLnB1c2goZWxlKTtcclxuICAgICAgICAgICAgICAgIGdhbWUuYmxhbmtJbWdFbGUgPSBlbGU7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBnYW1lLmltZ0NvbnRhaW5lci5pbnNlcnRCZWZvcmUoZWxlLCBnYW1lLmltZ0NvbnRhaW5lci5maXJzdENoaWxkKTtcclxuICAgICAgICAgICAgICAgIGdhbWUuaW1nRWxlbWVudHMudW5zaGlmdChlbGUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGdhbWUuZ2FtZUNvbnRhaW5lci5hcHBlbmRDaGlsZChnYW1lLmltZ0NvbnRhaW5lcik7XHJcblxyXG4gICAgICAgIC8vIHdpbiDmlYjmnpzpg6jliIZcclxuICAgICAgICB0aGlzLmltZ0NvbnRhaW5lci5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMgPT09IGUudGFyZ2V0KSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNsYXNzTmFtZSA9ICcnO1xyXG4gICAgICAgICAgICAgICAgZ2FtZS5pc1dpbiA9IGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDmi7zlm77nmoTmjInpkq7mk43kvZzpg6jliIbnmoTliJ3lp4vljJZcclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSBpbml0T3BlcmF0aW9uKCkge1xyXG4gICAgICAgIGxldCBnYW1lID0gdGhpcztcclxuICAgICAgICAvLyDkuKTkuKrmjInpkq4gTUlYIOWSjCBTVEFSVFxyXG4gICAgICAgIFtcIk1JWFwiLCBcIlNUQVJUXCJdLmZvckVhY2goZnVuY3Rpb24oaXRlbSwgaW5kZXgsIGFycmF5KSB7XHJcbiAgICAgICAgICAgIGxldCBlbGUgPSAkY3JlYXRlRWxlKCdidXR0b24nLCB1bmRlZmluZWQsIGBidG4gYnRuLSR7aXRlbS50b0xvd2VyQ2FzZSgpfWApO1xyXG4gICAgICAgICAgICBlbGUuaW5uZXJIVE1MID0gaXRlbTtcclxuICAgICAgICAgICAgc3dpdGNoIChpdGVtKSB7XHJcbiAgICAgICAgICAgICAgICBjYXNlICdNSVgnOlxyXG4gICAgICAgICAgICAgICAgICAgIGVsZS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGdhbWUubWl4LmJpbmQoZ2FtZSkpO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSAnU1RBUlQnOlxyXG4gICAgICAgICAgICAgICAgICAgIGVsZS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGdhbWUuc3RhcnQuYmluZChnYW1lKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZ2FtZS5hY3Rpb25Db250YWluZXIuYXBwZW5kQ2hpbGQoZWxlKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICBnYW1lLmdhbWVDb250YWluZXIuYXBwZW5kQ2hpbGQoZ2FtZS5hY3Rpb25Db250YWluZXIpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog5ou85Zu+55qE5L+h5oGv5pi+56S66YOo5YiG55qE5Yid5aeL5YyWXHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgaW5pdEluZm8oKSB7XHJcbiAgICAgICAgbGV0IGdhbWUgPSB0aGlzO1xyXG5cclxuICAgICAgICBbXCJ0aW1lXCIsIFwic3RlcFwiXS5mb3JFYWNoKGZ1bmN0aW9uKHZhbHVlKSB7XHJcbiAgICAgICAgICAgIGxldCBkaXZFbGUgPSAkY3JlYXRlRWxlKCdkaXYnLCB1bmRlZmluZWQsICdpbmZvLWl0ZW0nKTtcclxuICAgICAgICAgICAgbGV0IHRpdGxlID0gJGNyZWF0ZUVsZSgnc3BhbicsIHVuZGVmaW5lZCwgJ3RpdGxlJyk7XHJcbiAgICAgICAgICAgIGxldCBjb250ZW50ID0gJGNyZWF0ZUVsZSgnc3BhbicpO1xyXG5cclxuICAgICAgICAgICAgdGl0bGUuaW5uZXJIVE1MID0gYCR7dmFsdWV9OmA7XHJcbiAgICAgICAgICAgIGNvbnRlbnQuaW5uZXJIVE1MID0gJzAnO1xyXG4gICAgICAgICAgICBnYW1lW2Ake3ZhbHVlfUluZm9FbGVgXSA9IGNvbnRlbnQ7XHJcblxyXG4gICAgICAgICAgICBkaXZFbGUuYXBwZW5kQ2hpbGQodGl0bGUpO1xyXG4gICAgICAgICAgICBkaXZFbGUuYXBwZW5kQ2hpbGQoY29udGVudCk7XHJcbiAgICAgICAgICAgIGdhbWUuaW5mb0NvbnRhaW5lci5hcHBlbmRDaGlsZChkaXZFbGUpO1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgZ2FtZS5nYW1lQ29udGFpbmVyLmFwcGVuZENoaWxkKGdhbWUuaW5mb0NvbnRhaW5lcik7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDmoLnmja7oioLngrnnmoTmlbDnu4TooajnpLrmnaXorr7nva7lm77niYfniYfmrrXnmoTkvY3nva5cclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSBzZXRTdGF0dXNCeU5vZGUobm9kZTogTm9kZSkge1xyXG4gICAgICAgIC8vIGxldCBpbWdFbGVtZW50cyA9IHRoaXMuaW1nQ29udGFpbmVyLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJpdGVtXCIpO1xyXG4gICAgICAgIGZvciAobGV0IGsgPSAwLCBsZW4gPSBub2RlLnZhbHVlLmxlbmd0aDsgayA8IGxlbjsgaysrKSB7XHJcbiAgICAgICAgICAgIGxldCBwb3MgPSAoayA9PT0gbGVuIC0gMSkgPyAwIDogayArIDE7O1xyXG4gICAgICAgICAgICBsZXQgdiA9IChub2RlLnZhbHVlW2tdID09PSAwKSA/IGxlbiA6IG5vZGUudmFsdWVba107XHJcbiAgICAgICAgICAgICRyZXBsYWNlQ2xhc3ModGhpcy5pbWdFbGVtZW50c1t2IC0gMV0sIGBwb3MtJHtwb3N9YCwgJ3BvcycpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOWbvueJh+eJh+auteS4iueahCBjbGljayDkuovku7blpITnkIblh73mlbDvvIznlKjmnaXnp7vliqjlm77niYfniYfmrrVcclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSBpbWdGcmFnbWVudEhhbmRsZXIoZSkge1xyXG4gICAgICAgIGxldCBpbWdJZCA9ICRnZXRJbWdJZChlLnRhcmdldC5jbGFzc05hbWUpO1xyXG4gICAgICAgIGxldCBub25aZXJvRGlyID0gdGhpcy5jdXJyZW50Tm9kZS5nZXROb25aZXJvRGlyZWN0aW9uKCk7XHJcbiAgICAgICAgaWYgKG5vblplcm9EaXJbaW1nSWRdKSB7XHJcbiAgICAgICAgICAgIGxldCBkaXJlY3Rpb24gPSBESVJFQ1RJT05bYCR7bm9uWmVyb0RpcltpbWdJZF19YF07XHJcbiAgICAgICAgICAgIHRoaXMuY3VycmVudE5vZGUubW92ZVRvKGRpcmVjdGlvbik7XHJcbiAgICAgICAgICAgICRleGNoYW5nZVBvcyh0aGlzLmJsYW5rSW1nRWxlLCBlLnRhcmdldCk7XHJcblxyXG4gICAgICAgICAgICBpZiAoTm9kZS5pc1NhbWUodGhpcy5jdXJyZW50Tm9kZSwgdGhpcy50YXJnZXROb2RlKSkgdGhpcy53aW4oKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIiwiaW1wb3J0IE5vZGUgZnJvbSAnLi9ub2RlJztcclxuaW1wb3J0IHsgYmVsb25nVG8gfSBmcm9tICcuL3V0aWwnO1xyXG4vLyBIZWFwIE9uIFRvcFxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBIZWFwIHtcclxuICAgIGhlYXA6IE5vZGVbXSA9IFtdXHJcbiAgICBiX2hlYXA6IGJlbG9uZ1RvID0ge31cclxuICAgIGtleTogc3RyaW5nXHJcbiAgICBjb25zdHJ1Y3Rvcihub2RlTGlzdDogTm9kZVtdLCBrZXk6IHN0cmluZykge1xyXG4gICAgICAgIHRoaXMua2V5ID0ga2V5O1xyXG4gICAgICAgIC8vIOeUqOS+neasoeaPkuWFpeeahOaWueW8j+aehOmAoOWIneWni+eahOWwj+mhtuWghlxyXG4gICAgICAgIGxldCBpID0gMCxcclxuICAgICAgICAgICAgbGVuID0gbm9kZUxpc3QubGVuZ3RoO1xyXG4gICAgICAgIGZvciAoOyBpIDwgbGVuOyBpKyspIHtcclxuICAgICAgICAgICAgdGhpcy5wdXNoKG5vZGVMaXN0W2ldKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLy8gcHVibGljIGZ1bmN0aW9uXHJcbiAgICAvLyAtLS0tLS0tLS0tLS0tLS1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOiOt+WPluWghuS4reS4i+agh+S4uiBpbmRleCDnmoTlgLxcclxuICAgICAqL1xyXG4gICAgZ2V0KGluZGV4OiBudW1iZXIpIHtcclxuICAgICAgICBpZiAoaW5kZXggPj0gMCAmJiBpbmRleCA8IHRoaXMuaGVhcC5sZW5ndGgpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuaGVhcFtpbmRleF1bdGhpcy5rZXldO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOWQkeWghuS4reaPkuWFpeS4gOS4quaWsOeahOWFg+e0oOW5tuiwg+aVtOWghlxyXG4gICAgICog5paw5YWD57Sg5LuO5pWw57uE5bC+6YOo5o+S5YWl77yM54S25ZCO5a+55paw5YWD57Sg5omn6KGM5LiK5rWu6LCD5pW0XHJcbiAgICAgKi9cclxuICAgIHB1c2gobm9kZTogTm9kZSkge1xyXG4gICAgICAgIHRoaXMuaGVhcC5wdXNoKG5vZGUpO1xyXG4gICAgICAgIHRoaXMuc2V0QkhlYXAodGhpcy5oZWFwLmxlbmd0aCAtIDEpO1xyXG4gICAgICAgIHRoaXMuZ29VcCh0aGlzLmhlYXAubGVuZ3RoIC0gMSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDliKDpmaTlubbov5Tlm57loIbpobblhYPntKDlubbosIPmlbTloIZcclxuICAgICAqIOWFiOWwhuWghumhtuWFg+e0oOS4juaVsOe7hOacq+WwvuWFg+e0oOS6kuaNou+8jOeEtuWQjuW8ueWHuuaVsOe7hOacq+WwvueahOWFg+e0oO+8jOacgOWQjuWvueWghumhtuWFg+e0oOaJp+ihjOS4i+ayieaTjeS9nFxyXG4gICAgICovXHJcbiAgICBwb3AoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuaXNFbXB0eSgpKSByZXR1cm47XHJcbiAgICAgICAgbGV0IHJlc3VsdDtcclxuICAgICAgICB0aGlzLnN3YXAoMCwgdGhpcy5oZWFwLmxlbmd0aCAtIDEpO1xyXG4gICAgICAgIHJlc3VsdCA9IHRoaXMuaGVhcC5wb3AoKTtcclxuICAgICAgICB0aGlzLnJlbW92ZUJIZWFwKHJlc3VsdC5nZXRWYWxTdHIoKSk7XHJcbiAgICAgICAgIXRoaXMuaXNFbXB0eSgpICYmIHRoaXMuZ29Eb3duKDApO1xyXG4gICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDnp7vpmaTloIbkuK3kuIvmoIfkuLogaW5kZXgg55qE5YWD57SgXHJcbiAgICAgKiDlsIbpnIDnp7vpmaTnmoTpobnkuI7loIbpobbkupLmjaLvvIznhLblkI7lvLnlh7rloIbpobbvvIzmnIDlkI7lr7nkupLmjaLpobnvvIjljp/loIbpobbvvInmiafooYzkuIrmta7mk43kvZxcclxuICAgICAqL1xyXG4gICAgcmVtb3ZlKGluZGV4OiBudW1iZXIpIHtcclxuICAgICAgICBpZiAoaW5kZXggPCAwIHx8IGluZGV4ID49IHRoaXMuaGVhcC5sZW5ndGgpIHJldHVybjtcclxuICAgICAgICB0aGlzLnN3YXAoMCwgaW5kZXgpO1xyXG4gICAgICAgIHRoaXMucG9wKCk7XHJcbiAgICAgICAgdGhpcy5nb1VwKGluZGV4KTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOiOt+WPluWghumhtuWFg+e0oFxyXG4gICAgICovXHJcbiAgICB0b3AoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuaGVhcC5sZW5ndGggJiYgdGhpcy5oZWFwWzBdO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog5Yik5pat5aCG5piv5ZCm5Li656m6XHJcbiAgICAgKi9cclxuICAgIGlzRW1wdHkoKSB7XHJcbiAgICAgICAgcmV0dXJuICF0aGlzLmhlYXAubGVuZ3RoO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog5Yik5pat5aCG5Lit5piv5ZCm5pyJ5YWD57SgIG5vZGVcclxuICAgICAqL1xyXG4gICAgZ2V0SXRlbUluZGV4KG5vZGU6IE5vZGUpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5iX2hlYXBbbm9kZS5nZXRWYWxTdHIoKV07XHJcbiAgICB9XHJcblxyXG4gICAgLy8gcHJpdmF0ZSBmdW5jdGlvblxyXG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDov5Tlm57loIbkuK3kuIvmoIfkuLogaW5kZXgg55qE5YWD57SgXHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgZ2V0VmFsdWUoaW5kZXg6IG51bWJlcikge1xyXG4gICAgICAgIGlmIChpbmRleCA8IDAgfHwgaW5kZXggPj0gdGhpcy5oZWFwLmxlbmd0aCkgcmV0dXJuO1xyXG4gICAgICAgIHJldHVybiB0aGlzLmhlYXBbaW5kZXhdW3RoaXMua2V5XTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOWghuS4reS4i+agh+S4uiBpbmRleCDnmoTlhYPntKDnmoTkuIrmta7mk43kvZxcclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSBnb1VwKGluZGV4OiBudW1iZXIpIHtcclxuICAgICAgICBsZXQgdmFsdWUgPSB0aGlzLmdldFZhbHVlKGluZGV4KSxcclxuICAgICAgICAgICAgcGFyZW50ID0gdGhpcy5nZXRQYXJlbnRJbmRleChpbmRleCk7XHJcblxyXG4gICAgICAgIGlmIChwYXJlbnQgPT09IHVuZGVmaW5lZCkgcmV0dXJuO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5nZXRWYWx1ZShwYXJlbnQpID4gdGhpcy5nZXRWYWx1ZShpbmRleCkpIHtcclxuICAgICAgICAgICAgdGhpcy5zd2FwKGluZGV4LCBwYXJlbnQpO1xyXG4gICAgICAgICAgICB0aGlzLmdvVXAocGFyZW50KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDloIbkuK3kuIvmoIfkuLogaW5kZXgg55qE5YWD57Sg55qE5LiL5rKJ5pON5L2cXHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgZ29Eb3duKGluZGV4OiBudW1iZXIpIHtcclxuICAgICAgICBsZXQgdmFsdWUgPSB0aGlzLmdldFZhbHVlKGluZGV4KSxcclxuICAgICAgICAgICAgW2xlZnQsIHJpZ2h0XSA9IHRoaXMuZ2V0Q2hpbGRJbmRleChpbmRleCksXHJcbiAgICAgICAgICAgIHN3YXBJbmRleCA9IGxlZnQ7XHJcblxyXG4gICAgICAgIC8vIOWFg+e0oOaYr+WPtuWtkOiKgueCue+8jOayoeacieWtkOWFg+e0oFxyXG4gICAgICAgIGlmIChsZWZ0ID09PSBudWxsKSByZXR1cm47XHJcblxyXG4gICAgICAgIC8vIOiLpeWFg+e0oOacieS4pOS4quWtkOWFg+e0oO+8jOiuvue9riBzd2FwSW5kZXgg5Li66L6D5bCP55qE6YKj5Liq5a2Q5YWD57Sg55qE5LiL5qCHXHJcbiAgICAgICAgLy8g6Iul5YWD57Sg5Y+q5pyJ5bem5YS/5a2Q77yMc3dhcEluZGV4IOW3sue7j+iiq+WIneWni+WMluS4uiBsZWZ0IOeahOWAvOS6hlxyXG4gICAgICAgIGlmIChyaWdodCkge1xyXG4gICAgICAgICAgICBzd2FwSW5kZXggPSB0aGlzLmdldFZhbHVlKGxlZnQpIDwgdGhpcy5nZXRWYWx1ZShyaWdodCkgPyBsZWZ0IDogcmlnaHQ7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyDmr5TovoPniLblhYPntKDlkozovoPlsI/nmoTpgqPkuKrlrZDlhYPntKDnmoTlgLzvvIzoi6XniLblhYPntKDnmoTlgLzovoPlpKfvvIzliJnnva7mjaLniLblhYPntKDlkozovoPlsI/nmoTlrZDlhYPntKBcclxuICAgICAgICAvLyDnhLblkI7lnKjmlrDnmoTnva7mjaLnmoTkvY3nva7lpITnu6fnu63miafooYzkuIvmsonmk43kvZxcclxuICAgICAgICBpZiAodGhpcy5nZXRWYWx1ZShzd2FwSW5kZXgpIDwgdmFsdWUpIHtcclxuICAgICAgICAgICAgdGhpcy5zd2FwKGluZGV4LCBzd2FwSW5kZXgpO1xyXG4gICAgICAgICAgICB0aGlzLmdvRG93bihzd2FwSW5kZXgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOiOt+WPluS4i+agh+S4uiBpbmRleCDnmoTlhYPntKDlnKjloIbkuK3nmoTniLblhYPntKBcclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSBnZXRQYXJlbnRJbmRleChpbmRleDogbnVtYmVyKSB7XHJcbiAgICAgICAgaWYgKGluZGV4IDwgMCB8fCBpbmRleCA+PSB0aGlzLmhlYXAubGVuZ3RoKSByZXR1cm47XHJcbiAgICAgICAgaWYgKGluZGV4ID09PSAwKSByZXR1cm4gMDtcclxuICAgICAgICByZXR1cm4gTWF0aC5mbG9vcigoaW5kZXggLSAxKSAvIDIpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog6I635Y+W5LiL5qCH5Li6IGluZGV4IOeahOWFg+e0oOWcqOWghuS4reeahOWtkOWFg+e0oO+8jOe8uuWkseeahOWtkOWFg+e0oOeUqCBudWxsIOS7o+abv1xyXG4gICAgICovXHJcbiAgICBwcml2YXRlIGdldENoaWxkSW5kZXgoaW5kZXg6IG51bWJlcikge1xyXG4gICAgICAgIGxldCBsZWZ0ID0gMiAqIGluZGV4ICsgMSxcclxuICAgICAgICAgICAgcmlnaHQgPSAyICogaW5kZXggKyAyLFxyXG4gICAgICAgICAgICBsZW5ndGggPSB0aGlzLmhlYXAubGVuZ3RoO1xyXG5cclxuICAgICAgICBpZiAocmlnaHQgPD0gbGVuZ3RoIC0gMSkge1xyXG4gICAgICAgICAgICByZXR1cm4gW2xlZnQsIHJpZ2h0XTtcclxuICAgICAgICB9IGVsc2UgaWYgKGxlZnQgPT09IGxlbmd0aCAtIDEpIHtcclxuICAgICAgICAgICAgcmV0dXJuIFtsZWZ0LCBudWxsXTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICByZXR1cm4gW251bGwsIG51bGxdO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOS6pOaNouWghuS4reS4i+agh+WIhuWIq+S4uiBpbmRleDEg5ZKMIGluZGV4MiDnmoTkuKTkuKrlhYPntKBcclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSBzd2FwKGluZGV4MTogbnVtYmVyLCBpbmRleDI6IG51bWJlcikge1xyXG4gICAgICAgIGxldCB0bXAgPSB0aGlzLmhlYXBbaW5kZXgxXTtcclxuICAgICAgICB0aGlzLmhlYXBbaW5kZXgxXSA9IHRoaXMuaGVhcFtpbmRleDJdO1xyXG4gICAgICAgIHRoaXMuaGVhcFtpbmRleDJdID0gdG1wO1xyXG5cclxuICAgICAgICB0aGlzLnNldEJIZWFwKGluZGV4MSk7XHJcbiAgICAgICAgdGhpcy5zZXRCSGVhcChpbmRleDIpO1xyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBzZXRCSGVhcChpbmRleDogbnVtYmVyKSB7XHJcbiAgICAgICAgdGhpcy5iX2hlYXBbdGhpcy5oZWFwW2luZGV4XS5nZXRWYWxTdHIoKV0gPSBpbmRleDtcclxuICAgIH1cclxuICAgIHByaXZhdGUgcmVtb3ZlQkhlYXAoc3RyOiBzdHJpbmcpIHtcclxuICAgICAgICBkZWxldGUgdGhpcy5iX2hlYXBbc3RyXTtcclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQgR2FtZSBmcm9tIFwiLi9nYW1lXCI7XHJcbmxldCBnYW1lID0gbmV3IEdhbWUoXCJjb250YWluZXJcIiwgMyk7XHJcbi8vIGxldCBnYW1lID0gbmV3IEdhbWUoIFwiY29udGFpbmVyXCIsIDUgKTtcclxuXHJcbmNvbnNvbGUubG9nKGdhbWUpO1xyXG5jb25zb2xlLmxvZyhcIi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVwiKTtcclxuIiwiaW1wb3J0IHsgRElSRUNUSU9OIH0gZnJvbSAnLi91dGlsJztcclxuXHJcbi8vIExFVCBESVJFQ1RJT04gPSBbICdOT05FJywgJ1VQJywgJ1JJR0hUJywgJ0RPV04nLCAnTEVGVCcgXTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE5vZGUge1xyXG4gICAgdmFsdWU6IG51bWJlcltdXHJcbiAgICB6ZXJvSW5kZXg6IG51bWJlclxyXG4gICAgc2NhbGU6IG51bWJlclxyXG4gICAgcGFyZW50OiBOb2RlXHJcbiAgICBGOiBudW1iZXIgPSAwXHJcbiAgICBHOiBudW1iZXIgPSAwXHJcbiAgICBjb25zdHJ1Y3RvcihzY2FsZTogbnVtYmVyLCBpbml0QXJyPzogbnVtYmVyW10pIHtcclxuICAgICAgICB0aGlzLnNjYWxlID0gc2NhbGU7XHJcbiAgICAgICAgdGhpcy52YWx1ZSA9IGluaXRBcnIgPyBpbml0QXJyIDogdGhpcy5pbml0Tm9kZVZhbHVlQnlTY2FsZShzY2FsZSk7XHJcbiAgICAgICAgdGhpcy56ZXJvSW5kZXggPSBNYXRoLnBvdyhzY2FsZSwgMikgLSAxO1xyXG5cclxuICAgICAgICAvLyB0aGlzLnBhcmVudCA9IG5ldyBOb2RlKHRoaXMuc2NhbGUpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIHB1YmxpYyBmdW5jdGlvblxyXG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDojrflj5boioLngrnnmoTlgLzvvIzlsIboioLngrnnmoTmlbDnu4TooajnpLrovazmjaLmiJDlrZfnrKbkuLLooajnpLrlubbov5Tlm55cclxuICAgICAqL1xyXG4gICAgZ2V0VmFsU3RyKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnZhbHVlLnRvU3RyaW5nKCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDoioLngrnnmoTkubHluo/nrpfms5VcclxuICAgICAqIOmaj+acuuaMh+WumuS4gOS4quaWueWQke+8jOS7pOiKgueCueWQkeivpeaWueWQkeenu+WKqO+8jOmHjeWkjeS4iui/sOi/h+eoi+iLpeW5suasoei+vuWIsOS5seW6j+eahOebrueahFxyXG4gICAgICovXHJcbiAgICBzaHVmZmxlKCkge1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgNTAwMDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGxldCBkaXJlY3Rpb24gPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiA0ICsgMSk7XHJcbiAgICAgICAgICAgIHRoaXMubW92ZVRvKGRpcmVjdGlvbik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog5b2T5YmN6IqC54K55ZCR5pa55ZCRIGRpcmVjdGlvbiDnp7vliqjkuIDmrKFcclxuICAgICAqIOWFtuWunuaYr+iKgueCueeahOaVsOe7hOihqOekuuS4reeahOaVsOWtlyAwIOWQkeaWueWQkSBkaXJlY3Rpb24g56e75Yqo5LiA5qyhXHJcbiAgICAgKi9cclxuICAgIG1vdmVUbyhkaXJlY3Rpb246IG51bWJlcikge1xyXG4gICAgICAgIGlmICghdGhpcy5jYW5Nb3ZlVG8oZGlyZWN0aW9uKSkgcmV0dXJuO1xyXG4gICAgICAgIGxldCB0YXJnZXRJbmRleCA9IHRoaXMuZ2V0VGFyZ2V0SW5kZXgoZGlyZWN0aW9uKTtcclxuXHJcbiAgICAgICAgdGhpcy52YWx1ZVt0aGlzLnplcm9JbmRleF0gPSB0aGlzLnZhbHVlW3RhcmdldEluZGV4XTtcclxuICAgICAgICB0aGlzLnZhbHVlW3RhcmdldEluZGV4XSA9IDA7XHJcbiAgICAgICAgdGhpcy56ZXJvSW5kZXggPSB0YXJnZXRJbmRleDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOiOt+WPluW9k+WJjeiKgueCueeahOWPr+iDveenu+WKqOaWueWQke+8iOeUqCAwIOS9jeeahOenu+WKqOi/m+ihjOihqOekuu+8iVxyXG4gICAgICovXHJcbiAgICBnZXRaZXJvRGlyZWN0aW9uKCkge1xyXG4gICAgICAgIGxldCBub2RlID0gdGhpcztcclxuICAgICAgICBsZXQgRGlyZWN0aW9uID0ge307XHJcbiAgICAgICAgW1wiVVBcIiwgXCJSSUdIVFwiLCBcIkRPV05cIiwgXCJMRUZUXCJdLmZvckVhY2goZnVuY3Rpb24oZGlyKSB7XHJcbiAgICAgICAgICAgIGxldCBfZGlyID0gRElSRUNUSU9OW2Rpcl07XHJcbiAgICAgICAgICAgIGlmIChub2RlLmNhbk1vdmVUbyhfZGlyKSkge1xyXG4gICAgICAgICAgICAgICAgbGV0IHRhcmdldEluZGV4ID0gbm9kZS5nZXRUYXJnZXRJbmRleChfZGlyKTtcclxuICAgICAgICAgICAgICAgIERpcmVjdGlvbltkaXJdID0gYCR7bm9kZS52YWx1ZVt0YXJnZXRJbmRleF19YDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHJldHVybiBEaXJlY3Rpb247XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDlsIblvZPliY3oioLngrnnmoTlj6/og73np7vliqjmlrnlkJHnlLHnlKggMCDkvY3nmoTnp7vliqjmnaXooajnpLrovazmjaLmiJDnlKggMCDkvY3pgrvmjqXnmoTpnZ4gMCDmlbDlrZfnmoTnp7vliqjmnaXov5vooYzooajnpLpcclxuICAgICAqL1xyXG4gICAgZ2V0Tm9uWmVyb0RpcmVjdGlvbigpIHtcclxuICAgICAgICBsZXQgRGlyZWN0aW9uID0ge307XHJcbiAgICAgICAgbGV0IHplcm9EaXIgPSB0aGlzLmdldFplcm9EaXJlY3Rpb24oKTtcclxuICAgICAgICBmb3IgKGxldCB2YWwgaW4gemVyb0Rpcikge1xyXG4gICAgICAgICAgICBEaXJlY3Rpb25bemVyb0Rpclt2YWxdXSA9IHZhbDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIERpcmVjdGlvbjtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOiOt+WPluW9k+WJjeiKgueCueWcqOWPr+enu+WKqOaWueWQkeS4iueahOWtkOiKgueCueaVsOe7hFxyXG4gICAgICovXHJcbiAgICBnZXROZXh0Tm9kZXMoKSB7XHJcbiAgICAgICAgbGV0IG5vZGUgPSB0aGlzO1xyXG4gICAgICAgIGxldCBuZXh0Tm9kZXM6IE5vZGVbXSA9IFtdO1xyXG4gICAgICAgIFtESVJFQ1RJT04uVVAsIERJUkVDVElPTi5SSUdIVCwgRElSRUNUSU9OLkRPV04sIERJUkVDVElPTi5MRUZUXS5mb3JFYWNoKGZ1bmN0aW9uKGRpcmVjdGlvbikge1xyXG4gICAgICAgICAgICBpZiAobm9kZS5jYW5Nb3ZlVG8oZGlyZWN0aW9uKSkge1xyXG4gICAgICAgICAgICAgICAgbGV0IG5ld05vZGUgPSBOb2RlLm5vZGVDbG9uZShub2RlKTtcclxuICAgICAgICAgICAgICAgIG5ld05vZGUucGFyZW50ID0gbm9kZTtcclxuICAgICAgICAgICAgICAgIG5ld05vZGUubW92ZVRvKGRpcmVjdGlvbik7XHJcbiAgICAgICAgICAgICAgICBuZXh0Tm9kZXMucHVzaChuZXdOb2RlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHJldHVybiBuZXh0Tm9kZXM7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDliKTmlq3lvZPliY3oioLngrnvvIjoioLngrnkuK3nmoQgMCDkvY3vvInmmK/lkKblj6/ku6Xmsr8gZGlyZWN0aW9uIOaWueWQkeenu+WKqFxyXG4gICAgICovXHJcbiAgICBjYW5Nb3ZlVG8oZGlyZWN0aW9uOiBudW1iZXIpIHtcclxuICAgICAgICBsZXQgcm93ID0gTWF0aC5mbG9vcih0aGlzLnplcm9JbmRleCAvIHRoaXMuc2NhbGUpO1xyXG4gICAgICAgIGxldCBjb2wgPSB0aGlzLnplcm9JbmRleCAlIHRoaXMuc2NhbGU7XHJcblxyXG4gICAgICAgIHN3aXRjaCAoZGlyZWN0aW9uKSB7XHJcbiAgICAgICAgICAgIGNhc2UgRElSRUNUSU9OLlVQOlxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJvdyAhPT0gMDtcclxuICAgICAgICAgICAgY2FzZSBESVJFQ1RJT04uUklHSFQ6XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gY29sICE9PSB0aGlzLnNjYWxlIC0gMTtcclxuICAgICAgICAgICAgY2FzZSBESVJFQ1RJT04uRE9XTjpcclxuICAgICAgICAgICAgICAgIHJldHVybiByb3cgIT09IHRoaXMuc2NhbGUgLSAxO1xyXG4gICAgICAgICAgICBjYXNlIERJUkVDVElPTi5MRUZUOlxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGNvbCAhPT0gMDtcclxuICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDojrflj5bku47lvZPliY3oioLngrnotbDliLDkuIvkuIDkuKroioLngrnnmoTku6Pku7dcclxuICAgICAqL1xyXG4gICAgZ2V0Q29zdFRvTmV4dCgpIHtcclxuICAgICAgICByZXR1cm4gMTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOiuvue9ruiKgueCueeahCBGIOWAvO+8jOWghuS8muagueaNrui/meS4quWAvOi/m+ihjOaOkuW6j1xyXG4gICAgICovXHJcbiAgICBzZXRGKHZhbHVlOiBudW1iZXIpIHtcclxuICAgICAgICB0aGlzLkYgPSB2YWx1ZTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOiOt+WPluiKgueCueeahCBHIOWAvFxyXG4gICAgICovXHJcbiAgICBnZXRHKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLkc7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDorr7nva7oioLngrnnmoQgRyDlgLxcclxuICAgICAqL1xyXG4gICAgc2V0Ryh2YWx1ZTogbnVtYmVyKSB7XHJcbiAgICAgICAgdGhpcy5HID0gdmFsdWU7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDojrflj5boioLngrnnmoQgSCDlgLxcclxuICAgICAqL1xyXG4gICAgZ2V0SCh0YXJnZXROb2RlOiBOb2RlKSB7XHJcbiAgICAgICAgbGV0IGkgPSAwLFxyXG4gICAgICAgICAgICBsZW4gPSB0aGlzLnZhbHVlLmxlbmd0aCxcclxuICAgICAgICAgICAgbWFuaGF0dGVuID0gMCxcclxuICAgICAgICAgICAgZGlmZiA9IDA7XHJcblxyXG4gICAgICAgIGZvciAoOyBpIDwgbGVuOyBpKyspIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMudmFsdWVbaV0gIT09IGkgKyAxKSBkaWZmKys7XHJcblxyXG4gICAgICAgICAgICBsZXQgdiA9IHRoaXMudmFsdWVbaV07XHJcbiAgICAgICAgICAgIGlmICh2ICE9PSAwKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBub3cgaW5cclxuICAgICAgICAgICAgICAgIGxldCByb3cgPSBNYXRoLmZsb29yKGkgLyB0aGlzLnNjYWxlKTtcclxuICAgICAgICAgICAgICAgIGxldCBjb2wgPSBpICUgdGhpcy5zY2FsZTtcclxuICAgICAgICAgICAgICAgIC8vIHNob3VsZCBpblxyXG4gICAgICAgICAgICAgICAgbGV0IF9yb3cgPSBNYXRoLmZsb29yKHYgLyB0aGlzLnNjYWxlKTtcclxuICAgICAgICAgICAgICAgIGxldCBfY29sID0gdiAlIHRoaXMuc2NhbGU7XHJcblxyXG4gICAgICAgICAgICAgICAgbWFuaGF0dGVuICs9IE1hdGguYWJzKHJvdyAtIF9yb3cpICsgTWF0aC5hYnMoY29sIC0gX2NvbCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiAyICogbWFuaGF0dGVuICsgMTAwICogZGlmZjtcclxuICAgIH1cclxuXHJcbiAgICAvLyBwcml2YXRlIGZ1bmN0aW9uXHJcbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDmoLnmja7nu7TluqYgc2NhbGUg5p6E6YCg6IqC54K555qE5Yid5aeL6KGo56S65pWw57uEXHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgaW5pdE5vZGVWYWx1ZUJ5U2NhbGUoc2NhbGU6IG51bWJlcikge1xyXG4gICAgICAgIGxldCB2YWwgPSBbXTtcclxuICAgICAgICBmb3IgKGxldCBpID0gMTsgaSA8IE1hdGgucG93KHNjYWxlLCAyKTsgaSsrKSB7XHJcbiAgICAgICAgICAgIHZhbC5wdXNoKGkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB2YWwucHVzaCgwKTtcclxuICAgICAgICByZXR1cm4gdmFsO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog6I635Y+W5b2T5YmN6IqC54K55Lit5aSE5LqOIDAg5L2N55qE5pa55ZCRIGRpcmVjdGlvbiDlpITnmoTpgrvmjqXmlbDlrZfnmoTkuIvmoIdcclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSBnZXRUYXJnZXRJbmRleChkaXJlY3Rpb246IG51bWJlcikge1xyXG4gICAgICAgIGlmICghdGhpcy5jYW5Nb3ZlVG8oZGlyZWN0aW9uKSkgcmV0dXJuO1xyXG4gICAgICAgIGxldCB0YXJnZXRJbmRleDtcclxuICAgICAgICBzd2l0Y2ggKGRpcmVjdGlvbikge1xyXG4gICAgICAgICAgICBjYXNlIERJUkVDVElPTi5VUDpcclxuICAgICAgICAgICAgICAgIHRhcmdldEluZGV4ID0gdGhpcy56ZXJvSW5kZXggLSB0aGlzLnNjYWxlO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgRElSRUNUSU9OLlJJR0hUOlxyXG4gICAgICAgICAgICAgICAgdGFyZ2V0SW5kZXggPSB0aGlzLnplcm9JbmRleCArIDE7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBESVJFQ1RJT04uRE9XTjpcclxuICAgICAgICAgICAgICAgIHRhcmdldEluZGV4ID0gdGhpcy56ZXJvSW5kZXggKyB0aGlzLnNjYWxlO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgRElSRUNUSU9OLkxFRlQ6XHJcbiAgICAgICAgICAgICAgICB0YXJnZXRJbmRleCA9IHRoaXMuemVyb0luZGV4IC0gMTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgdGFyZ2V0SW5kZXggPSB0aGlzLnplcm9JbmRleDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRhcmdldEluZGV4O1xyXG4gICAgfVxyXG5cclxuICAgIC8vIHN0YXRpYyBmdW5jdGlvblxyXG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDliKTmlq3kuKTkuKroioLngrnmmK/lkKbnm7jnrYlcclxuICAgICAqIOmAmui/h+WwhuiKgueCueeahOaVsOe7hOihqOekuui9rOaNouaIkOWtl+espuS4suadpei/m+ihjOavlOi+g1xyXG4gICAgICovXHJcbiAgICBzdGF0aWMgaXNTYW1lKGN1cnJlbnROb2RlOiBOb2RlLCB0YXJnZXROb2RlOiBOb2RlKSB7XHJcbiAgICAgICAgcmV0dXJuIGN1cnJlbnROb2RlLmdldFZhbFN0cigpID09PSB0YXJnZXROb2RlLmdldFZhbFN0cigpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog5Z+65LqOIG5vZGUg5aSN5Yi25LiA5Liq5paw55qE6IqC54K5XHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyBub2RlQ2xvbmUobm9kZTogTm9kZSkge1xyXG4gICAgICAgIGxldCBuZXdOb2RlID0gbmV3IE5vZGUobm9kZS5zY2FsZSk7XHJcbiAgICAgICAgbmV3Tm9kZS52YWx1ZSA9IG5vZGUudmFsdWUuc2xpY2UoMCk7XHJcbiAgICAgICAgbmV3Tm9kZS56ZXJvSW5kZXggPSBub2RlLnplcm9JbmRleDtcclxuICAgICAgICByZXR1cm4gbmV3Tm9kZTtcclxuICAgIH1cclxufVxyXG4iLCJleHBvcnQgZW51bSBESVJFQ1RJT04geyBVUCA9IDEsIFJJR0hULCBET1dOLCBMRUZUIH1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgYmVsb25nVG8ge1xyXG4gICAgW3Byb3BOYW1lOiBzdHJpbmddOiBudW1iZXI7XHJcbn07XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gJGlkKGVsZUlkOiBzdHJpbmcpIHtcclxuICAgIHJldHVybiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChlbGVJZCk7XHJcbn07XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gJGNyZWF0ZUVsZSh0YWdOYW1lOiBzdHJpbmcsIGlkPzogc3RyaW5nLCBjbGFzc05hbWU/OiBzdHJpbmcpIHtcclxuICAgIGxldCBlbGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KHRhZ05hbWUpO1xyXG4gICAgaWYgKGlkKSBlbGUuaWQgPSBpZDtcclxuICAgIGlmIChjbGFzc05hbWUpIGVsZS5jbGFzc05hbWUgPSBjbGFzc05hbWU7XHJcbiAgICByZXR1cm4gZWxlO1xyXG59O1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uICRyZXBsYWNlQ2xhc3MoZWxlLCBuZXdDbGFzczogc3RyaW5nLCBwcmVmaXg6IHN0cmluZykge1xyXG4gICAgbGV0IHJlZyA9IG5ldyBSZWdFeHAoYCR7cHJlZml4fS0oXFxcXGQpK2AsICdnJyk7XHJcbiAgICBlbGUuY2xhc3NOYW1lID0gZWxlLmNsYXNzTmFtZS5yZXBsYWNlKHJlZywgbmV3Q2xhc3MpO1xyXG59XHJcblxyXG5mdW5jdGlvbiAkYWRkQ2xhc3MoZWxlLCBuZXdDbGFzczogc3RyaW5nKSB7XHJcbiAgICBpZiAoZWxlLmNsYXNzTmFtZS5pbmRleE9mKG5ld0NsYXNzKSA9PT0gLTEpIHtcclxuICAgICAgICBlbGUuY2xhc3NOYW1lID0gYCR7ZWxlLmNsYXNzTmFtZX0gJHtuZXdDbGFzc31gO1xyXG4gICAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiAkcmVtb3ZlQ2xhc3MoZWxlLCByZW1vdmU6IHN0cmluZykge1xyXG4gICAgZWxlLmNsYXNzTmFtZSA9IGVsZS5jbGFzc05hbWUucmVwbGFjZShyZW1vdmUsICcnKS50cmltKCk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiAkZ2V0UG9zKGNsYXNzTmFtZTogc3RyaW5nKSB7XHJcbiAgICBsZXQgY2xhc3NBcnIgPSBjbGFzc05hbWUuc3BsaXQoJyAnKTtcclxuICAgIGZvciAobGV0IGkgPSAwLCBsZW4gPSBjbGFzc0Fyci5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xyXG4gICAgICAgIGlmIChjbGFzc0FycltpXS5pbmRleE9mKCdwb3MnKSAhPT0gLTEpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGNsYXNzQXJyW2ldLnNwbGl0KCctJylbMV07XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gJGdldEltZ0lkKGNsYXNzTmFtZTogc3RyaW5nKSB7XHJcbiAgICBsZXQgY2xhc3NBcnIgPSBjbGFzc05hbWUuc3BsaXQoJyAnKTtcclxuICAgIGZvciAobGV0IGkgPSAwLCBsZW4gPSBjbGFzc0Fyci5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xyXG4gICAgICAgIGlmIChjbGFzc0FycltpXS5pbmRleE9mKCdpdGVtLScpICE9PSAtMSkge1xyXG4gICAgICAgICAgICByZXR1cm4gY2xhc3NBcnJbaV0uc3BsaXQoJy0nKVsxXTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiAkZXhjaGFuZ2VQb3MoaXRlbTEsIGl0ZW0yKSB7XHJcbiAgICBsZXQgcG9zMSA9ICRnZXRQb3MoaXRlbTEuY2xhc3NOYW1lKTtcclxuICAgIGxldCBwb3MyID0gJGdldFBvcyhpdGVtMi5jbGFzc05hbWUpO1xyXG5cclxuICAgICRyZW1vdmVDbGFzcyhpdGVtMiwgYHBvcy0ke3BvczJ9YCk7XHJcbiAgICAkYWRkQ2xhc3MoaXRlbTIsIGBwb3MtJHtwb3MxfWApO1xyXG4gICAgJHJlbW92ZUNsYXNzKGl0ZW0xLCBgcG9zLSR7cG9zMX1gKTtcclxuICAgICRhZGRDbGFzcyhpdGVtMSwgYHBvcy0ke3BvczJ9YCk7XHJcbn1cclxuIl19
