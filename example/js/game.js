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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvdHMvYXN0YXIudHMiLCJzcmMvdHMvZ2FtZS50cyIsInNyYy90cy9oZWFwLnRzIiwic3JjL3RzL21haW4udHMiLCJzcmMvdHMvbm9kZS50cyIsInNyYy90cy91dGlsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOztBQ0FBLHFCQUFpQixRQUFRLENBQUMsQ0FBQTtBQUMxQixxQkFBaUIsUUFBUSxDQUFDLENBQUE7QUFHMUI7O0dBRUc7QUFDSDtJQVNJLGVBQVksU0FBZSxFQUFFLFVBQWdCO1FBUDdDLGVBQVUsR0FBVyxFQUFFLENBQUE7UUFJZixpQkFBWSxHQUFhLEVBQUUsQ0FBQTtRQUMzQixhQUFRLEdBQVcsRUFBRSxDQUFBO1FBR3pCLElBQUksQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFDO1FBQzNCLElBQUksQ0FBQyxVQUFVLEdBQUcsVUFBVSxDQUFDO1FBQzdCLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxjQUFJLENBQUMsQ0FBQyxTQUFTLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQztJQUMvQyxDQUFDO0lBRUQsa0JBQWtCO0lBQ2xCLGtCQUFrQjtJQUVsQjs7T0FFRztJQUNILG1CQUFHLEdBQUg7UUFDSSxJQUFJLEtBQUssR0FBRyxJQUFJLENBQUM7UUFDakI7WUFDSSxJQUFJLFdBQVcsR0FBRyxLQUFLLENBQUMsUUFBUSxDQUFDLEdBQUcsRUFBRSxDQUFDO1lBQ3ZDLEtBQUssQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO1lBQ25DLEtBQUssQ0FBQyxZQUFZLENBQUMsV0FBVyxDQUFDLFNBQVMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBRWhELElBQUksU0FBUyxHQUFHLFdBQVcsQ0FBQyxZQUFZLEVBQUUsQ0FBQztZQUUzQyxTQUFTLENBQUMsT0FBTyxDQUFDLFVBQVMsUUFBUTtnQkFDL0IsSUFBSSxJQUFJLEdBQUcsV0FB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LEtBQUssRUFBRSxTQUFPLElBQU0sQ0FBQyxDQUFDO0lBQ25DLFNBQVMsQ0FBQyxLQUFLLEVBQUUsU0FBTyxJQUFNLENBQUMsQ0FBQztJQUNoQyxZQUFZLENBQUMsS0FBSyxFQUFFLFNBQU8sSUFBTSxDQUFDLENBQUM7SUFDbkMsU0FBUyxDQUFDLEtBQUssRUFBRSxTQUFPLElBQU0sQ0FBQyxDQUFDO0FBQ3BDLENBQUM7QUFSZSxvQkFBWSxlQVEzQixDQUFBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImltcG9ydCBOb2RlIGZyb20gJy4vbm9kZSc7XHJcbmltcG9ydCBIZWFwIGZyb20gJy4vaGVhcCc7XHJcbmltcG9ydCB7IGJlbG9uZ1RvIH0gZnJvbSAnLi91dGlsJztcclxuXHJcbi8qKlxyXG4gKiBBKiDnrpfms5VcclxuICovXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEFzdGFyIHtcclxuICAgIG9wZW5MaXN0OiBIZWFwXHJcbiAgICBjbG9zZWRMaXN0OiBOb2RlW10gPSBbXVxyXG4gICAgc3RhcnROb2RlOiBOb2RlXHJcbiAgICB0YXJnZXROb2RlOiBOb2RlXHJcblxyXG4gICAgcHJpdmF0ZSBiX2Nsb3NlZExpc3Q6IGJlbG9uZ1RvID0ge31cclxuICAgIHByaXZhdGUgc29sdXRpb246IE5vZGVbXSA9IFtdXHJcblxyXG4gICAgY29uc3RydWN0b3Ioc3RhcnROb2RlOiBOb2RlLCB0YXJnZXROb2RlOiBOb2RlKSB7XHJcbiAgICAgICAgdGhpcy5zdGFydE5vZGUgPSBzdGFydE5vZGU7XHJcbiAgICAgICAgdGhpcy50YXJnZXROb2RlID0gdGFyZ2V0Tm9kZTtcclxuICAgICAgICB0aGlzLm9wZW5MaXN0ID0gbmV3IEhlYXAoW3N0YXJ0Tm9kZV0sIFwiRlwiKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBwdWJsaWMgZnVuY3Rpb25cclxuICAgIC8vIC0tLS0tLS0tLS0tLS0tLVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog6L+Q6KGMIEEqIOeul+azlVxyXG4gICAgICovXHJcbiAgICBydW4oKSB7XHJcbiAgICAgICAgbGV0IGFzdGFyID0gdGhpcztcclxuICAgICAgICB3aGlsZSAoIU5vZGUuaXNTYW1lKGFzdGFyLm9wZW5MaXN0LnRvcCgpLCBhc3Rhci50YXJnZXROb2RlKSkge1xyXG4gICAgICAgICAgICBsZXQgY3VycmVudE5vZGUgPSBhc3Rhci5vcGVuTGlzdC5wb3AoKTtcclxuICAgICAgICAgICAgYXN0YXIuY2xvc2VkTGlzdC5wdXNoKGN1cnJlbnROb2RlKTtcclxuICAgICAgICAgICAgYXN0YXIuYl9jbG9zZWRMaXN0W2N1cnJlbnROb2RlLmdldFZhbFN0cigpXSA9IDE7XHJcblxyXG4gICAgICAgICAgICBsZXQgbmV4dE5vZGVzID0gY3VycmVudE5vZGUuZ2V0TmV4dE5vZGVzKCk7XHJcblxyXG4gICAgICAgICAgICBuZXh0Tm9kZXMuZm9yRWFjaChmdW5jdGlvbihuZXh0Tm9kZSkge1xyXG4gICAgICAgICAgICAgICAgbGV0IGNvc3QgPSBjdXJyZW50Tm9kZS5nZXRHKCkgKyBjdXJyZW50Tm9kZS5nZXRDb3N0VG9OZXh0KCk7XHJcbiAgICAgICAgICAgICAgICBsZXQgaW5kZXggPSBhc3Rhci5vcGVuTGlzdC5nZXRJdGVtSW5kZXgobmV4dE5vZGUpO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChpbmRleCAhPT0gdW5kZWZpbmVkICYmIGNvc3QgPCBuZXh0Tm9kZS5nZXRHKCkpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIm5leHQgMVwiKTtcclxuICAgICAgICAgICAgICAgICAgICBhc3Rhci5vcGVuTGlzdC5yZW1vdmUoaW5kZXgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGlmIChhc3Rhci5pc0JlbG9uZ1RvQ2xvc2VkKG5leHROb2RlKSAmJiBjb3N0IDwgbmV4dE5vZGUuZ2V0RygpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJuZXh0IDJcIik7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKGluZGV4ID09PSB1bmRlZmluZWQgJiYgIWFzdGFyLmlzQmVsb25nVG9DbG9zZWQobmV4dE5vZGUpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJuZXh0IDNcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgbmV4dE5vZGUuc2V0Ryhjb3N0KTtcclxuICAgICAgICAgICAgICAgICAgICBuZXh0Tm9kZS5zZXRGKG5leHROb2RlLmdldEcoKSArIG5leHROb2RlLmdldEgoYXN0YXIudGFyZ2V0Tm9kZSkpO1xyXG4gICAgICAgICAgICAgICAgICAgIGFzdGFyLm9wZW5MaXN0LnB1c2gobmV4dE5vZGUpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgbGV0IHRhaWxOb2RlID0gYXN0YXIub3Blbkxpc3QudG9wKCk7XHJcbiAgICAgICAgdGhpcy5zb2x1dGlvbiA9IFtdO1xyXG4gICAgICAgIHdoaWxlICh0YWlsTm9kZSkge1xyXG4gICAgICAgICAgICB0aGlzLnNvbHV0aW9uLnB1c2godGFpbE5vZGUpO1xyXG4gICAgICAgICAgICB0YWlsTm9kZSA9IHRhaWxOb2RlLnBhcmVudDtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gdGhpcy5zaG93U29sdXRpb24oKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOi/kOihjCBBKiDnrpfms5UgKCDniYjmnKwgMiApIOWunumqjOeUqFxyXG4gICAgICovXHJcbiAgICBydW4yKCkge1xyXG4gICAgICAgIGxldCBhc3RhciA9IHRoaXM7XHJcbiAgICAgICAgd2hpbGUgKCFOb2RlLmlzU2FtZShhc3Rhci5vcGVuTGlzdC50b3AoKSwgYXN0YXIudGFyZ2V0Tm9kZSkpIHtcclxuICAgICAgICAgICAgbGV0IGN1cnJlbnROb2RlID0gYXN0YXIub3Blbkxpc3QucG9wKCk7XHJcbiAgICAgICAgICAgIGFzdGFyLmNsb3NlZExpc3QucHVzaChjdXJyZW50Tm9kZSk7XHJcbiAgICAgICAgICAgIGFzdGFyLmJfY2xvc2VkTGlzdFtjdXJyZW50Tm9kZS5nZXRWYWxTdHIoKV0gPSAxO1xyXG5cclxuICAgICAgICAgICAgbGV0IG5leHROb2RlcyA9IGN1cnJlbnROb2RlLmdldE5leHROb2RlcygpO1xyXG5cclxuICAgICAgICAgICAgbmV4dE5vZGVzLmZvckVhY2goZnVuY3Rpb24obmV4dE5vZGUpIHtcclxuICAgICAgICAgICAgICAgIGxldCBjb3N0ID0gY3VycmVudE5vZGUuZ2V0RygpICsgY3VycmVudE5vZGUuZ2V0Q29zdFRvTmV4dCgpO1xyXG4gICAgICAgICAgICAgICAgbGV0IGluZGV4ID0gYXN0YXIub3Blbkxpc3QuZ2V0SXRlbUluZGV4KG5leHROb2RlKTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoaW5kZXggIT09IHVuZGVmaW5lZCAmJiBjb3N0IDwgbmV4dE5vZGUuZ2V0RygpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJuZXh0IDFcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgYXN0YXIub3Blbkxpc3QucmVtb3ZlKGluZGV4KTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoYXN0YXIuaXNCZWxvbmdUb0Nsb3NlZChuZXh0Tm9kZSkgJiYgY29zdCA8IG5leHROb2RlLmdldEcoKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwibmV4dCAyXCIpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGlmIChpbmRleCA9PT0gdW5kZWZpbmVkICYmICFhc3Rhci5pc0JlbG9uZ1RvQ2xvc2VkKG5leHROb2RlKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwibmV4dCAzXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIG5leHROb2RlLnNldEcoY29zdCk7XHJcbiAgICAgICAgICAgICAgICAgICAgbmV4dE5vZGUuc2V0RihuZXh0Tm9kZS5nZXRHKCkgKyBuZXh0Tm9kZS5nZXRIKGFzdGFyLnRhcmdldE5vZGUpKTtcclxuICAgICAgICAgICAgICAgICAgICBhc3Rhci5vcGVuTGlzdC5wdXNoKG5leHROb2RlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgdGFpbE5vZGUgPSBhc3Rhci5vcGVuTGlzdC50b3AoKTtcclxuICAgICAgICB0aGlzLnNvbHV0aW9uID0gW107XHJcbiAgICAgICAgd2hpbGUgKHRhaWxOb2RlKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc29sdXRpb24ucHVzaCh0YWlsTm9kZSk7XHJcbiAgICAgICAgICAgIHRhaWxOb2RlID0gdGFpbE5vZGUucGFyZW50O1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnNob3dTb2x1dGlvbigpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog6I635Y+W6Kej5Yaz5pa55qGI5pWw57uEXHJcbiAgICAgKi9cclxuICAgIGdldFNvbHV0aW9uKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnNvbHV0aW9uO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIHByaXZhdGUgZnVuY3Rpb25cclxuICAgIC8vIC0tLS0tLS0tLS0tLS0tLVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog5Yik5pat6IqC54K55piv5ZCm5ZyoIENMT1NFRCDkuK1cclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSBpc0JlbG9uZ1RvQ2xvc2VkKG5vZGU6IE5vZGUpIHtcclxuICAgICAgICBsZXQgc3RyID0gbm9kZS5nZXRWYWxTdHIoKTtcclxuICAgICAgICByZXR1cm4gISF0aGlzLmJfY2xvc2VkTGlzdFtzdHJdO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog5pi+56S66Kej5Yaz5pa55qGI55qE5YW35L2T5q2l6aqkXHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgc2hvd1NvbHV0aW9uKCkge1xyXG4gICAgICAgIGxldCBsZW4gPSB0aGlzLnNvbHV0aW9uLmxlbmd0aCxcclxuICAgICAgICAgICAgaSA9IGxlbiAtIDEsXHJcbiAgICAgICAgICAgIHNjYWxlID0gdGhpcy50YXJnZXROb2RlLnNjYWxlO1xyXG4gICAgICAgIGZvciAoOyBpID4gLTE7IGktLSkge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhgU3RlcCAke2xlbiAtIGl9OiBgKTtcclxuICAgICAgICAgICAgbGV0IGl0ZW0gPSB0aGlzLnNvbHV0aW9uW2ldLmdldFZhbFN0cigpLnNwbGl0KCcsJyk7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgc2NhbGU7IGorKykge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coYHwgJHtpdGVtW2ogKiBzY2FsZV19ICR7aXRlbVtqICogc2NhbGUgKyAxXX0gJHtpdGVtW2ogKiBzY2FsZSArIDJdfSB8YCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIiwiaW1wb3J0IE5vZGUgZnJvbSBcIi4vbm9kZVwiO1xyXG5pbXBvcnQgQXN0YXIgZnJvbSAnLi9hc3Rhcic7XHJcbmltcG9ydCB7ICRpZCwgJGNyZWF0ZUVsZSwgJHJlcGxhY2VDbGFzcywgJGdldFBvcywgJGdldEltZ0lkLCAkZXhjaGFuZ2VQb3MsIERJUkVDVElPTiB9IGZyb20gJy4vdXRpbCc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBHYW1lIHtcclxuICAgIGN1cnJlbnROb2RlOiBOb2RlXHJcbiAgICB0YXJnZXROb2RlOiBOb2RlXHJcbiAgICBzY2FsZTogbnVtYmVyXHJcbiAgICBydW5uaW5nOiBib29sZWFuID0gZmFsc2VcclxuICAgIGlzV2luOiBib29sZWFuID0gZmFsc2VcclxuXHJcbiAgICBwcml2YXRlIGdhbWVDb250YWluZXJJZDogc3RyaW5nXHJcbiAgICBwcml2YXRlIGltZ0NvbnRhaW5lcklkID0gXCJpbWFnZVwiXHJcbiAgICBwcml2YXRlIGFjdGlvbkNvbnRhaW5lcklkID0gXCJhY3Rpb25cIlxyXG4gICAgcHJpdmF0ZSBpbmZvSWQgPSBcImluZm9cIlxyXG5cclxuICAgIHByaXZhdGUgZ2FtZUNvbnRhaW5lclxyXG4gICAgcHJpdmF0ZSBpbWdDb250YWluZXJcclxuICAgIHByaXZhdGUgYWN0aW9uQ29udGFpbmVyXHJcbiAgICBwcml2YXRlIGluZm9Db250YWluZXJcclxuXHJcbiAgICAvLyDnvJPlrZjmiYDmnInnmoTlm77niYfniYfmrrUgZG9t77yM5YWN5b6X5YaN5om+XHJcbiAgICBwcml2YXRlIGltZ0VsZW1lbnRzID0gW11cclxuICAgIC8vIOe8k+WtmOepuueZveWbvueJh+eJh+autSBkb23vvIzlhY3lvpflho3mib5cclxuICAgIHByaXZhdGUgYmxhbmtJbWdFbGVcclxuXHJcbiAgICBwcml2YXRlIHRpbWVJbmZvRWxlXHJcbiAgICBwcml2YXRlIHN0ZXBJbmZvRWxlXHJcblxyXG4gICAgY29uc3RydWN0b3IoZ2FtZUNvbnRhaW5lcklkOiBzdHJpbmcsIHNjYWxlOiBudW1iZXIpIHtcclxuICAgICAgICB0aGlzLmN1cnJlbnROb2RlID0gbmV3IE5vZGUoc2NhbGUpO1xyXG4gICAgICAgIHRoaXMudGFyZ2V0Tm9kZSA9IG5ldyBOb2RlKHNjYWxlKTtcclxuICAgICAgICB0aGlzLnNjYWxlID0gc2NhbGU7XHJcblxyXG4gICAgICAgIHRoaXMuZ2FtZUNvbnRhaW5lcklkID0gZ2FtZUNvbnRhaW5lcklkO1xyXG5cclxuICAgICAgICB0aGlzLmdhbWVDb250YWluZXIgPSAkaWQodGhpcy5nYW1lQ29udGFpbmVySWQpO1xyXG4gICAgICAgIHRoaXMuaW1nQ29udGFpbmVyID0gJGNyZWF0ZUVsZSgnZGl2JywgdGhpcy5pbWdDb250YWluZXJJZCk7XHJcbiAgICAgICAgdGhpcy5hY3Rpb25Db250YWluZXIgPSAkY3JlYXRlRWxlKCdkaXYnLCB0aGlzLmFjdGlvbkNvbnRhaW5lcklkKTtcclxuICAgICAgICB0aGlzLmluZm9Db250YWluZXIgPSAkY3JlYXRlRWxlKCdkaXYnLCB0aGlzLmluZm9JZCk7XHJcblxyXG4gICAgICAgIHRoaXMuaW5pdCgpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIHB1YmxpYyBmdW5jdGlvblxyXG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBtaXgg5oyJ6ZKu5omn6KGM5Ye95pWwXHJcbiAgICAgKiDmt7flkIjvvIznlLHotbflp4voioLngrnkubHluo/lvpfliLDkuIDkuKrmlrDnmoToioLngrnvvIzlubbmoLnmja7mlrDoioLngrnorr7nva7pobXpnaLkuK3nmoTmmL7npLrnirbmgIFcclxuICAgICAqL1xyXG4gICAgbWl4KCkge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKFwicnVuaW5nID0gXCIsIHRoaXMucnVubmluZywgXCIgLS0gXCIsIFwiaXNXaW4gPSBcIiwgdGhpcy5pc1dpbik7XHJcbiAgICAgICAgaWYgKHRoaXMucnVubmluZyB8fCB0aGlzLmlzV2luKSByZXR1cm47XHJcbiAgICAgICAgdGhpcy5jdXJyZW50Tm9kZS5zaHVmZmxlKCk7XHJcbiAgICAgICAgdGhpcy5zZXRTdGF0dXNCeU5vZGUodGhpcy5jdXJyZW50Tm9kZSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBzdGFydCDmjInpkq7miafooYzlh73mlbBcclxuICAgICAqIOaJp+ihjCBBKiDnrpfms5VcclxuICAgICAqL1xyXG4gICAgc3RhcnQoKSB7XHJcbiAgICAgICAgbGV0IGdhbWUgPSB0aGlzO1xyXG5cclxuICAgICAgICBpZiAoZ2FtZS5ydW5uaW5nKSByZXR1cm47XHJcbiAgICAgICAgZ2FtZS5ydW5uaW5nID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgaWYgKE5vZGUuaXNTYW1lKHRoaXMuY3VycmVudE5vZGUsIHRoaXMudGFyZ2V0Tm9kZSkpIHtcclxuICAgICAgICAgICAgdGhpcy53aW4oKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBsZXQgYXN0YXIgPSBuZXcgQXN0YXIodGhpcy5jdXJyZW50Tm9kZSwgdGhpcy50YXJnZXROb2RlKTtcclxuXHJcbiAgICAgICAgICAgIGNvbnNvbGUudGltZShcIkFTdGFyIFJ1biAhXCIpO1xyXG4gICAgICAgICAgICBsZXQgc3RhcnRUaW1lID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XHJcbiAgICAgICAgICAgIGFzdGFyLnJ1bigpO1xyXG4gICAgICAgICAgICBsZXQgZW5kVGltZSA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xyXG4gICAgICAgICAgICBjb25zb2xlLnRpbWVFbmQoXCJBU3RhciBSdW4gIVwiKTtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCIgYXN0YXIgLSBcIiwgYXN0YXIpO1xyXG5cclxuICAgICAgICAgICAgZ2FtZS50aW1lSW5mb0VsZS5pbm5lckhUTUwgPSBgJHtlbmRUaW1lIC0gc3RhcnRUaW1lfSBtc2A7XHJcblxyXG4gICAgICAgICAgICBsZXQgc29sdXRpb24gPSBhc3Rhci5nZXRTb2x1dGlvbigpO1xyXG4gICAgICAgICAgICBpZiAoc29sdXRpb24ubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgbGVuID0gc29sdXRpb24ubGVuZ3RoLFxyXG4gICAgICAgICAgICAgICAgICAgIGkgPSBsZW4gLSAxO1xyXG5cclxuICAgICAgICAgICAgICAgIGxldCBydW5JZCA9IHNldEludGVydmFsKGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChpID09PSAtMSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjbGVhckludGVydmFsKHJ1bklkKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZ2FtZS53aW4oKTtcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBnYW1lLmN1cnJlbnROb2RlID0gc29sdXRpb25baV07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGdhbWUuc2V0U3RhdHVzQnlOb2RlKHNvbHV0aW9uW2ldKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZ2FtZS5zdGVwSW5mb0VsZS5pbm5lckhUTUwgPSBgJHtsZW4gLSBpfVxcLyR7bGVufWA7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGktLTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9LCAxODApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog6LWi5b6X5ri45oiPXHJcbiAgICAgKi9cclxuICAgIHdpbigpIHtcclxuICAgICAgICBsZXQgZ2FtZSA9IHRoaXM7XHJcbiAgICAgICAgbGV0IGlkID0gc2V0VGltZW91dChmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgZ2FtZS5ydW5uaW5nID0gZmFsc2U7XHJcbiAgICAgICAgICAgIGdhbWUuaW1nQ29udGFpbmVyLmNsYXNzTmFtZSA9ICd3aW4nO1xyXG4gICAgICAgICAgICBnYW1lLmlzV2luID0gdHJ1ZTtcclxuICAgICAgICAgICAgY2xlYXJUaW1lb3V0KGlkKTtcclxuICAgICAgICB9LCAzMDApO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIHByaXZhdGUgZnVuY3Rpb25cclxuICAgIC8vIC0tLS0tLS0tLS0tLS0tLVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog5Yid5aeL5YyW5Ye95pWwXHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgaW5pdCgpIHtcclxuICAgICAgICB0aGlzLmluaXRJbWFnZSgpO1xyXG4gICAgICAgIHRoaXMuaW5pdE9wZXJhdGlvbigpO1xyXG4gICAgICAgIHRoaXMuaW5pdEluZm8oKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOaLvOWbvua4uOaIj+eahOWbvueJh+aYvuekuumDqOWIhueahOWIneWni+WMllxyXG4gICAgICovXHJcbiAgICBwcml2YXRlIGluaXRJbWFnZSgpIHtcclxuICAgICAgICBsZXQgZ2FtZSA9IHRoaXM7XHJcbiAgICAgICAgLy8g6IqC54K555qE5pWw57uE6KGo56S65Lit55qE5q+P5LiA5Liq5pWw57uE55qE6aG55a+55bqU5LiA5Liq5qC85a2QXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IE1hdGgucG93KGdhbWUuc2NhbGUsIDIpIC0gMTsgaSA+IC0xOyBpLS0pIHtcclxuICAgICAgICAgICAgLy8g5qC35byPIGl0ZW0tKiDop4Tlrprmn5DkuIDmoLzlrZDlr7nlupTnmoTlm77niYfniYfmrrXvvIzov5npg6jliIbliJ3lp4vljJblkI7kuI3lho3mlLnlj5hcclxuICAgICAgICAgICAgLy8g5qC35byPIHBvcy0qIOinhOWumuafkOS4gOagvOWtkOWcqCAjaW1hZ2Ug5a655Zmo5Lit55qE5L2N572u77yM6L+Z6YOo5YiG6ZqP552A6IqC54K55Y+Y5YyW6ICM5pS55Y+YXHJcbiAgICAgICAgICAgIGxldCBlbGUgPSAkY3JlYXRlRWxlKCdkaXYnLCB1bmRlZmluZWQsIGBpdGVtIGl0ZW0tJHtpfSBwb3MtJHtpfWApO1xyXG5cclxuICAgICAgICAgICAgZWxlLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oZSkgeyBnYW1lLmltZ0ZyYWdtZW50SGFuZGxlcihlKSB9KTtcclxuXHJcbiAgICAgICAgICAgIC8vIOWIneWni+WMlueahOaXtuiwg+aVtOepuueZveagvOmDqOWIhigg5qC35byP5Li677yaIC5pdGVtLml0ZW0tMC5wb3MtMCAp55qE5L2N572uXHJcbiAgICAgICAgICAgIC8vIOWQjOaXtuWwhuWbvueJh+eJh+auteeahCBkb20g57yT5a2YXHJcbiAgICAgICAgICAgIGlmIChpID09PSAwKSB7XHJcbiAgICAgICAgICAgICAgICBnYW1lLmltZ0NvbnRhaW5lci5hcHBlbmRDaGlsZChlbGUpO1xyXG4gICAgICAgICAgICAgICAgZ2FtZS5pbWdFbGVtZW50cy5wdXNoKGVsZSk7XHJcbiAgICAgICAgICAgICAgICBnYW1lLmJsYW5rSW1nRWxlID0gZWxlO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgZ2FtZS5pbWdDb250YWluZXIuaW5zZXJ0QmVmb3JlKGVsZSwgZ2FtZS5pbWdDb250YWluZXIuZmlyc3RDaGlsZCk7XHJcbiAgICAgICAgICAgICAgICBnYW1lLmltZ0VsZW1lbnRzLnVuc2hpZnQoZWxlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBnYW1lLmdhbWVDb250YWluZXIuYXBwZW5kQ2hpbGQoZ2FtZS5pbWdDb250YWluZXIpO1xyXG5cclxuICAgICAgICAvLyB3aW4g5pWI5p6c6YOo5YiGXHJcbiAgICAgICAgdGhpcy5pbWdDb250YWluZXIuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzID09PSBlLnRhcmdldCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jbGFzc05hbWUgPSAnJztcclxuICAgICAgICAgICAgICAgIGdhbWUuaXNXaW4gPSBmYWxzZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog5ou85Zu+55qE5oyJ6ZKu5pON5L2c6YOo5YiG55qE5Yid5aeL5YyWXHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgaW5pdE9wZXJhdGlvbigpIHtcclxuICAgICAgICBsZXQgZ2FtZSA9IHRoaXM7XHJcbiAgICAgICAgLy8g5Lik5Liq5oyJ6ZKuIE1JWCDlkowgU1RBUlRcclxuICAgICAgICBbXCJNSVhcIiwgXCJTVEFSVFwiXS5mb3JFYWNoKGZ1bmN0aW9uKGl0ZW0sIGluZGV4LCBhcnJheSkge1xyXG4gICAgICAgICAgICBsZXQgZWxlID0gJGNyZWF0ZUVsZSgnYnV0dG9uJywgdW5kZWZpbmVkLCBgYnRuIGJ0bi0ke2l0ZW0udG9Mb3dlckNhc2UoKX1gKTtcclxuICAgICAgICAgICAgZWxlLmlubmVySFRNTCA9IGl0ZW07XHJcbiAgICAgICAgICAgIHN3aXRjaCAoaXRlbSkge1xyXG4gICAgICAgICAgICAgICAgY2FzZSAnTUlYJzpcclxuICAgICAgICAgICAgICAgICAgICBlbGUuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBnYW1lLm1peC5iaW5kKGdhbWUpKTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgJ1NUQVJUJzpcclxuICAgICAgICAgICAgICAgICAgICBlbGUuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBnYW1lLnN0YXJ0LmJpbmQoZ2FtZSkpO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGdhbWUuYWN0aW9uQ29udGFpbmVyLmFwcGVuZENoaWxkKGVsZSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgZ2FtZS5nYW1lQ29udGFpbmVyLmFwcGVuZENoaWxkKGdhbWUuYWN0aW9uQ29udGFpbmVyKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOaLvOWbvueahOS/oeaBr+aYvuekuumDqOWIhueahOWIneWni+WMllxyXG4gICAgICovXHJcbiAgICBwcml2YXRlIGluaXRJbmZvKCkge1xyXG4gICAgICAgIGxldCBnYW1lID0gdGhpcztcclxuXHJcbiAgICAgICAgW1widGltZVwiLCBcInN0ZXBcIl0uZm9yRWFjaChmdW5jdGlvbih2YWx1ZSkge1xyXG4gICAgICAgICAgICBsZXQgZGl2RWxlID0gJGNyZWF0ZUVsZSgnZGl2JywgdW5kZWZpbmVkLCAnaW5mby1pdGVtJyk7XHJcbiAgICAgICAgICAgIGxldCB0aXRsZSA9ICRjcmVhdGVFbGUoJ3NwYW4nLCB1bmRlZmluZWQsICd0aXRsZScpO1xyXG4gICAgICAgICAgICBsZXQgY29udGVudCA9ICRjcmVhdGVFbGUoJ3NwYW4nKTtcclxuXHJcbiAgICAgICAgICAgIHRpdGxlLmlubmVySFRNTCA9IGAke3ZhbHVlfTpgO1xyXG4gICAgICAgICAgICBjb250ZW50LmlubmVySFRNTCA9ICcwJztcclxuICAgICAgICAgICAgZ2FtZVtgJHt2YWx1ZX1JbmZvRWxlYF0gPSBjb250ZW50O1xyXG5cclxuICAgICAgICAgICAgZGl2RWxlLmFwcGVuZENoaWxkKHRpdGxlKTtcclxuICAgICAgICAgICAgZGl2RWxlLmFwcGVuZENoaWxkKGNvbnRlbnQpO1xyXG4gICAgICAgICAgICBnYW1lLmluZm9Db250YWluZXIuYXBwZW5kQ2hpbGQoZGl2RWxlKTtcclxuICAgICAgICB9KVxyXG4gICAgICAgIGdhbWUuZ2FtZUNvbnRhaW5lci5hcHBlbmRDaGlsZChnYW1lLmluZm9Db250YWluZXIpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog5qC55o2u6IqC54K555qE5pWw57uE6KGo56S65p2l6K6+572u5Zu+54mH54mH5q6155qE5L2N572uXHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgc2V0U3RhdHVzQnlOb2RlKG5vZGU6IE5vZGUpIHtcclxuICAgICAgICAvLyBsZXQgaW1nRWxlbWVudHMgPSB0aGlzLmltZ0NvbnRhaW5lci5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFwiaXRlbVwiKTtcclxuICAgICAgICBmb3IgKGxldCBrID0gMCwgbGVuID0gbm9kZS52YWx1ZS5sZW5ndGg7IGsgPCBsZW47IGsrKykge1xyXG4gICAgICAgICAgICBsZXQgcG9zID0gKGsgPT09IGxlbiAtIDEpID8gMCA6IGsgKyAxOztcclxuICAgICAgICAgICAgbGV0IHYgPSAobm9kZS52YWx1ZVtrXSA9PT0gMCkgPyBsZW4gOiBub2RlLnZhbHVlW2tdO1xyXG4gICAgICAgICAgICAkcmVwbGFjZUNsYXNzKHRoaXMuaW1nRWxlbWVudHNbdiAtIDFdLCBgcG9zLSR7cG9zfWAsICdwb3MnKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDlm77niYfniYfmrrXkuIrnmoQgY2xpY2sg5LqL5Lu25aSE55CG5Ye95pWw77yM55So5p2l56e75Yqo5Zu+54mH54mH5q61XHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgaW1nRnJhZ21lbnRIYW5kbGVyKGUpIHtcclxuICAgICAgICBsZXQgaW1nSWQgPSAkZ2V0SW1nSWQoZS50YXJnZXQuY2xhc3NOYW1lKTtcclxuICAgICAgICBsZXQgbm9uWmVyb0RpciA9IHRoaXMuY3VycmVudE5vZGUuZ2V0Tm9uWmVyb0RpcmVjdGlvbigpO1xyXG4gICAgICAgIGlmIChub25aZXJvRGlyW2ltZ0lkXSkge1xyXG4gICAgICAgICAgICBsZXQgZGlyZWN0aW9uID0gRElSRUNUSU9OW2Ake25vblplcm9EaXJbaW1nSWRdfWBdO1xyXG4gICAgICAgICAgICB0aGlzLmN1cnJlbnROb2RlLm1vdmVUbyhkaXJlY3Rpb24pO1xyXG4gICAgICAgICAgICAkZXhjaGFuZ2VQb3ModGhpcy5ibGFua0ltZ0VsZSwgZS50YXJnZXQpO1xyXG5cclxuICAgICAgICAgICAgaWYgKE5vZGUuaXNTYW1lKHRoaXMuY3VycmVudE5vZGUsIHRoaXMudGFyZ2V0Tm9kZSkpIHRoaXMud2luKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCBOb2RlIGZyb20gJy4vbm9kZSc7XHJcbmltcG9ydCB7IGJlbG9uZ1RvIH0gZnJvbSAnLi91dGlsJztcclxuLy8gSGVhcCBPbiBUb3BcclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgSGVhcCB7XHJcbiAgICBoZWFwOiBOb2RlW10gPSBbXVxyXG4gICAgYl9oZWFwOiBiZWxvbmdUbyA9IHt9XHJcbiAgICBrZXk6IHN0cmluZ1xyXG4gICAgY29uc3RydWN0b3Iobm9kZUxpc3Q6IE5vZGVbXSwga2V5OiBzdHJpbmcpIHtcclxuICAgICAgICB0aGlzLmtleSA9IGtleTtcclxuICAgICAgICAvLyDnlKjkvp3mrKHmj5LlhaXnmoTmlrnlvI/mnoTpgKDliJ3lp4vnmoTlsI/pobbloIZcclxuICAgICAgICBsZXQgaSA9IDAsXHJcbiAgICAgICAgICAgIGxlbiA9IG5vZGVMaXN0Lmxlbmd0aDtcclxuICAgICAgICBmb3IgKDsgaSA8IGxlbjsgaSsrKSB7XHJcbiAgICAgICAgICAgIHRoaXMucHVzaChub2RlTGlzdFtpXSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8vIHB1YmxpYyBmdW5jdGlvblxyXG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDojrflj5bloIbkuK3kuIvmoIfkuLogaW5kZXgg55qE5YC8XHJcbiAgICAgKi9cclxuICAgIGdldChpbmRleDogbnVtYmVyKSB7XHJcbiAgICAgICAgaWYgKGluZGV4ID49IDAgJiYgaW5kZXggPCB0aGlzLmhlYXAubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmhlYXBbaW5kZXhdW3RoaXMua2V5XTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDlkJHloIbkuK3mj5LlhaXkuIDkuKrmlrDnmoTlhYPntKDlubbosIPmlbTloIZcclxuICAgICAqIOaWsOWFg+e0oOS7juaVsOe7hOWwvumDqOaPkuWFpe+8jOeEtuWQjuWvueaWsOWFg+e0oOaJp+ihjOS4iua1ruiwg+aVtFxyXG4gICAgICovXHJcbiAgICBwdXNoKG5vZGU6IE5vZGUpIHtcclxuICAgICAgICB0aGlzLmhlYXAucHVzaChub2RlKTtcclxuICAgICAgICB0aGlzLnNldEJIZWFwKHRoaXMuaGVhcC5sZW5ndGggLSAxKTtcclxuICAgICAgICB0aGlzLmdvVXAodGhpcy5oZWFwLmxlbmd0aCAtIDEpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog5Yig6Zmk5bm26L+U5Zue5aCG6aG25YWD57Sg5bm26LCD5pW05aCGXHJcbiAgICAgKiDlhYjlsIbloIbpobblhYPntKDkuI7mlbDnu4TmnKvlsL7lhYPntKDkupLmjaLvvIznhLblkI7lvLnlh7rmlbDnu4TmnKvlsL7nmoTlhYPntKDvvIzmnIDlkI7lr7nloIbpobblhYPntKDmiafooYzkuIvmsonmk43kvZxcclxuICAgICAqL1xyXG4gICAgcG9wKCkge1xyXG4gICAgICAgIGlmICh0aGlzLmlzRW1wdHkoKSkgcmV0dXJuO1xyXG4gICAgICAgIGxldCByZXN1bHQ7XHJcbiAgICAgICAgdGhpcy5zd2FwKDAsIHRoaXMuaGVhcC5sZW5ndGggLSAxKTtcclxuICAgICAgICByZXN1bHQgPSB0aGlzLmhlYXAucG9wKCk7XHJcbiAgICAgICAgdGhpcy5yZW1vdmVCSGVhcChyZXN1bHQuZ2V0VmFsU3RyKCkpO1xyXG4gICAgICAgICF0aGlzLmlzRW1wdHkoKSAmJiB0aGlzLmdvRG93bigwKTtcclxuICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog56e76Zmk5aCG5Lit5LiL5qCH5Li6IGluZGV4IOeahOWFg+e0oFxyXG4gICAgICog5bCG6ZyA56e76Zmk55qE6aG55LiO5aCG6aG25LqS5o2i77yM54S25ZCO5by55Ye65aCG6aG277yM5pyA5ZCO5a+55LqS5o2i6aG577yI5Y6f5aCG6aG277yJ5omn6KGM5LiK5rWu5pON5L2cXHJcbiAgICAgKi9cclxuICAgIHJlbW92ZShpbmRleDogbnVtYmVyKSB7XHJcbiAgICAgICAgaWYgKGluZGV4IDwgMCB8fCBpbmRleCA+PSB0aGlzLmhlYXAubGVuZ3RoKSByZXR1cm47XHJcbiAgICAgICAgdGhpcy5zd2FwKDAsIGluZGV4KTtcclxuICAgICAgICB0aGlzLnBvcCgpO1xyXG4gICAgICAgIHRoaXMuZ29VcChpbmRleCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDojrflj5bloIbpobblhYPntKBcclxuICAgICAqL1xyXG4gICAgdG9wKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmhlYXAubGVuZ3RoICYmIHRoaXMuaGVhcFswXTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOWIpOaWreWghuaYr+WQpuS4uuepulxyXG4gICAgICovXHJcbiAgICBpc0VtcHR5KCkge1xyXG4gICAgICAgIHJldHVybiAhdGhpcy5oZWFwLmxlbmd0aDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOWIpOaWreWghuS4reaYr+WQpuacieWFg+e0oCBub2RlXHJcbiAgICAgKi9cclxuICAgIGdldEl0ZW1JbmRleChub2RlOiBOb2RlKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuYl9oZWFwW25vZGUuZ2V0VmFsU3RyKCldO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIHByaXZhdGUgZnVuY3Rpb25cclxuICAgIC8vIC0tLS0tLS0tLS0tLS0tLVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog6L+U5Zue5aCG5Lit5LiL5qCH5Li6IGluZGV4IOeahOWFg+e0oFxyXG4gICAgICovXHJcbiAgICBwcml2YXRlIGdldFZhbHVlKGluZGV4OiBudW1iZXIpIHtcclxuICAgICAgICBpZiAoaW5kZXggPCAwIHx8IGluZGV4ID49IHRoaXMuaGVhcC5sZW5ndGgpIHJldHVybjtcclxuICAgICAgICByZXR1cm4gdGhpcy5oZWFwW2luZGV4XVt0aGlzLmtleV07XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDloIbkuK3kuIvmoIfkuLogaW5kZXgg55qE5YWD57Sg55qE5LiK5rWu5pON5L2cXHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgZ29VcChpbmRleDogbnVtYmVyKSB7XHJcbiAgICAgICAgbGV0IHZhbHVlID0gdGhpcy5nZXRWYWx1ZShpbmRleCksXHJcbiAgICAgICAgICAgIHBhcmVudCA9IHRoaXMuZ2V0UGFyZW50SW5kZXgoaW5kZXgpO1xyXG5cclxuICAgICAgICBpZiAocGFyZW50ID09PSB1bmRlZmluZWQpIHJldHVybjtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuZ2V0VmFsdWUocGFyZW50KSA+IHRoaXMuZ2V0VmFsdWUoaW5kZXgpKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc3dhcChpbmRleCwgcGFyZW50KTtcclxuICAgICAgICAgICAgdGhpcy5nb1VwKHBhcmVudCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog5aCG5Lit5LiL5qCH5Li6IGluZGV4IOeahOWFg+e0oOeahOS4i+ayieaTjeS9nFxyXG4gICAgICovXHJcbiAgICBwcml2YXRlIGdvRG93bihpbmRleDogbnVtYmVyKSB7XHJcbiAgICAgICAgbGV0IHZhbHVlID0gdGhpcy5nZXRWYWx1ZShpbmRleCksXHJcbiAgICAgICAgICAgIFtsZWZ0LCByaWdodF0gPSB0aGlzLmdldENoaWxkSW5kZXgoaW5kZXgpLFxyXG4gICAgICAgICAgICBzd2FwSW5kZXggPSBsZWZ0O1xyXG5cclxuICAgICAgICAvLyDlhYPntKDmmK/lj7blrZDoioLngrnvvIzmsqHmnInlrZDlhYPntKBcclxuICAgICAgICBpZiAobGVmdCA9PT0gbnVsbCkgcmV0dXJuO1xyXG5cclxuICAgICAgICAvLyDoi6XlhYPntKDmnInkuKTkuKrlrZDlhYPntKDvvIzorr7nva4gc3dhcEluZGV4IOS4uui+g+Wwj+eahOmCo+S4quWtkOWFg+e0oOeahOS4i+agh1xyXG4gICAgICAgIC8vIOiLpeWFg+e0oOWPquacieW3puWEv+WtkO+8jHN3YXBJbmRleCDlt7Lnu4/ooqvliJ3lp4vljJbkuLogbGVmdCDnmoTlgLzkuoZcclxuICAgICAgICBpZiAocmlnaHQpIHtcclxuICAgICAgICAgICAgc3dhcEluZGV4ID0gdGhpcy5nZXRWYWx1ZShsZWZ0KSA8IHRoaXMuZ2V0VmFsdWUocmlnaHQpID8gbGVmdCA6IHJpZ2h0O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8g5q+U6L6D54i25YWD57Sg5ZKM6L6D5bCP55qE6YKj5Liq5a2Q5YWD57Sg55qE5YC877yM6Iul54i25YWD57Sg55qE5YC86L6D5aSn77yM5YiZ572u5o2i54i25YWD57Sg5ZKM6L6D5bCP55qE5a2Q5YWD57SgXHJcbiAgICAgICAgLy8g54S25ZCO5Zyo5paw55qE572u5o2i55qE5L2N572u5aSE57un57ut5omn6KGM5LiL5rKJ5pON5L2cXHJcbiAgICAgICAgaWYgKHRoaXMuZ2V0VmFsdWUoc3dhcEluZGV4KSA8IHZhbHVlKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc3dhcChpbmRleCwgc3dhcEluZGV4KTtcclxuICAgICAgICAgICAgdGhpcy5nb0Rvd24oc3dhcEluZGV4KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDojrflj5bkuIvmoIfkuLogaW5kZXgg55qE5YWD57Sg5Zyo5aCG5Lit55qE54i25YWD57SgXHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgZ2V0UGFyZW50SW5kZXgoaW5kZXg6IG51bWJlcikge1xyXG4gICAgICAgIGlmIChpbmRleCA8IDAgfHwgaW5kZXggPj0gdGhpcy5oZWFwLmxlbmd0aCkgcmV0dXJuO1xyXG4gICAgICAgIGlmIChpbmRleCA9PT0gMCkgcmV0dXJuIDA7XHJcbiAgICAgICAgcmV0dXJuIE1hdGguZmxvb3IoKGluZGV4IC0gMSkgLyAyKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOiOt+WPluS4i+agh+S4uiBpbmRleCDnmoTlhYPntKDlnKjloIbkuK3nmoTlrZDlhYPntKDvvIznvLrlpLHnmoTlrZDlhYPntKDnlKggbnVsbCDku6Pmm79cclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSBnZXRDaGlsZEluZGV4KGluZGV4OiBudW1iZXIpIHtcclxuICAgICAgICBsZXQgbGVmdCA9IDIgKiBpbmRleCArIDEsXHJcbiAgICAgICAgICAgIHJpZ2h0ID0gMiAqIGluZGV4ICsgMixcclxuICAgICAgICAgICAgbGVuZ3RoID0gdGhpcy5oZWFwLmxlbmd0aDtcclxuXHJcbiAgICAgICAgaWYgKHJpZ2h0IDw9IGxlbmd0aCAtIDEpIHtcclxuICAgICAgICAgICAgcmV0dXJuIFtsZWZ0LCByaWdodF07XHJcbiAgICAgICAgfSBlbHNlIGlmIChsZWZ0ID09PSBsZW5ndGggLSAxKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBbbGVmdCwgbnVsbF07XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgcmV0dXJuIFtudWxsLCBudWxsXTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDkuqTmjaLloIbkuK3kuIvmoIfliIbliKvkuLogaW5kZXgxIOWSjCBpbmRleDIg55qE5Lik5Liq5YWD57SgXHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgc3dhcChpbmRleDE6IG51bWJlciwgaW5kZXgyOiBudW1iZXIpIHtcclxuICAgICAgICBsZXQgdG1wID0gdGhpcy5oZWFwW2luZGV4MV07XHJcbiAgICAgICAgdGhpcy5oZWFwW2luZGV4MV0gPSB0aGlzLmhlYXBbaW5kZXgyXTtcclxuICAgICAgICB0aGlzLmhlYXBbaW5kZXgyXSA9IHRtcDtcclxuXHJcbiAgICAgICAgdGhpcy5zZXRCSGVhcChpbmRleDEpO1xyXG4gICAgICAgIHRoaXMuc2V0QkhlYXAoaW5kZXgyKTtcclxuICAgIH1cclxuICAgIHByaXZhdGUgc2V0QkhlYXAoaW5kZXg6IG51bWJlcikge1xyXG4gICAgICAgIHRoaXMuYl9oZWFwW3RoaXMuaGVhcFtpbmRleF0uZ2V0VmFsU3RyKCldID0gaW5kZXg7XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIHJlbW92ZUJIZWFwKHN0cjogc3RyaW5nKSB7XHJcbiAgICAgICAgZGVsZXRlIHRoaXMuYl9oZWFwW3N0cl07XHJcbiAgICB9XHJcbn1cclxuIiwiaW1wb3J0IEdhbWUgZnJvbSBcIi4vZ2FtZVwiO1xyXG5sZXQgZ2FtZSA9IG5ldyBHYW1lKFwiY29udGFpbmVyXCIsIDMpO1xyXG4vLyBsZXQgZ2FtZSA9IG5ldyBHYW1lKCBcImNvbnRhaW5lclwiLCA1ICk7XHJcblxyXG5jb25zb2xlLmxvZyhnYW1lKTtcclxuY29uc29sZS5sb2coXCItLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cIik7XHJcbiIsImltcG9ydCB7IERJUkVDVElPTiB9IGZyb20gJy4vdXRpbCc7XHJcblxyXG4vLyBMRVQgRElSRUNUSU9OID0gWyAnTk9ORScsICdVUCcsICdSSUdIVCcsICdET1dOJywgJ0xFRlQnIF07XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBOb2RlIHtcclxuICAgIHZhbHVlOiBudW1iZXJbXVxyXG4gICAgemVyb0luZGV4OiBudW1iZXJcclxuICAgIHNjYWxlOiBudW1iZXJcclxuICAgIHBhcmVudDogTm9kZVxyXG4gICAgRjogbnVtYmVyID0gMFxyXG4gICAgRzogbnVtYmVyID0gMFxyXG4gICAgY29uc3RydWN0b3Ioc2NhbGU6IG51bWJlciwgaW5pdEFycj86IG51bWJlcltdKSB7XHJcbiAgICAgICAgdGhpcy5zY2FsZSA9IHNjYWxlO1xyXG4gICAgICAgIHRoaXMudmFsdWUgPSBpbml0QXJyID8gaW5pdEFyciA6IHRoaXMuaW5pdE5vZGVWYWx1ZUJ5U2NhbGUoc2NhbGUpO1xyXG4gICAgICAgIHRoaXMuemVyb0luZGV4ID0gTWF0aC5wb3coc2NhbGUsIDIpIC0gMTtcclxuXHJcbiAgICAgICAgLy8gdGhpcy5wYXJlbnQgPSBuZXcgTm9kZSh0aGlzLnNjYWxlKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBwdWJsaWMgZnVuY3Rpb25cclxuICAgIC8vIC0tLS0tLS0tLS0tLS0tLVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog6I635Y+W6IqC54K555qE5YC877yM5bCG6IqC54K555qE5pWw57uE6KGo56S66L2s5o2i5oiQ5a2X56ym5Liy6KGo56S65bm26L+U5ZueXHJcbiAgICAgKi9cclxuICAgIGdldFZhbFN0cigpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy52YWx1ZS50b1N0cmluZygpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog6IqC54K555qE5Lmx5bqP566X5rOVXHJcbiAgICAgKiDpmo/mnLrmjIflrprkuIDkuKrmlrnlkJHvvIzku6ToioLngrnlkJHor6XmlrnlkJHnp7vliqjvvIzph43lpI3kuIrov7Dov4fnqIvoi6XlubLmrKHovr7liLDkubHluo/nmoTnm67nmoRcclxuICAgICAqL1xyXG4gICAgc2h1ZmZsZSgpIHtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IDUwMDA7IGkrKykge1xyXG4gICAgICAgICAgICBsZXQgZGlyZWN0aW9uID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogNCArIDEpO1xyXG4gICAgICAgICAgICB0aGlzLm1vdmVUbyhkaXJlY3Rpb24pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOW9k+WJjeiKgueCueWQkeaWueWQkSBkaXJlY3Rpb24g56e75Yqo5LiA5qyhXHJcbiAgICAgKiDlhbblrp7mmK/oioLngrnnmoTmlbDnu4TooajnpLrkuK3nmoTmlbDlrZcgMCDlkJHmlrnlkJEgZGlyZWN0aW9uIOenu+WKqOS4gOasoVxyXG4gICAgICovXHJcbiAgICBtb3ZlVG8oZGlyZWN0aW9uOiBudW1iZXIpIHtcclxuICAgICAgICBpZiAoIXRoaXMuY2FuTW92ZVRvKGRpcmVjdGlvbikpIHJldHVybjtcclxuICAgICAgICBsZXQgdGFyZ2V0SW5kZXggPSB0aGlzLmdldFRhcmdldEluZGV4KGRpcmVjdGlvbik7XHJcblxyXG4gICAgICAgIHRoaXMudmFsdWVbdGhpcy56ZXJvSW5kZXhdID0gdGhpcy52YWx1ZVt0YXJnZXRJbmRleF07XHJcbiAgICAgICAgdGhpcy52YWx1ZVt0YXJnZXRJbmRleF0gPSAwO1xyXG4gICAgICAgIHRoaXMuemVyb0luZGV4ID0gdGFyZ2V0SW5kZXg7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDojrflj5blvZPliY3oioLngrnnmoTlj6/og73np7vliqjmlrnlkJHvvIjnlKggMCDkvY3nmoTnp7vliqjov5vooYzooajnpLrvvIlcclxuICAgICAqL1xyXG4gICAgZ2V0WmVyb0RpcmVjdGlvbigpIHtcclxuICAgICAgICBsZXQgbm9kZSA9IHRoaXM7XHJcbiAgICAgICAgbGV0IERpcmVjdGlvbiA9IHt9O1xyXG4gICAgICAgIFtcIlVQXCIsIFwiUklHSFRcIiwgXCJET1dOXCIsIFwiTEVGVFwiXS5mb3JFYWNoKGZ1bmN0aW9uKGRpcikge1xyXG4gICAgICAgICAgICBsZXQgX2RpciA9IERJUkVDVElPTltkaXJdO1xyXG4gICAgICAgICAgICBpZiAobm9kZS5jYW5Nb3ZlVG8oX2RpcikpIHtcclxuICAgICAgICAgICAgICAgIGxldCB0YXJnZXRJbmRleCA9IG5vZGUuZ2V0VGFyZ2V0SW5kZXgoX2Rpcik7XHJcbiAgICAgICAgICAgICAgICBEaXJlY3Rpb25bZGlyXSA9IGAke25vZGUudmFsdWVbdGFyZ2V0SW5kZXhdfWA7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgICByZXR1cm4gRGlyZWN0aW9uO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog5bCG5b2T5YmN6IqC54K555qE5Y+v6IO956e75Yqo5pa55ZCR55Sx55SoIDAg5L2N55qE56e75Yqo5p2l6KGo56S66L2s5o2i5oiQ55SoIDAg5L2N6YK75o6l55qE6Z2eIDAg5pWw5a2X55qE56e75Yqo5p2l6L+b6KGM6KGo56S6XHJcbiAgICAgKi9cclxuICAgIGdldE5vblplcm9EaXJlY3Rpb24oKSB7XHJcbiAgICAgICAgbGV0IERpcmVjdGlvbiA9IHt9O1xyXG4gICAgICAgIGxldCB6ZXJvRGlyID0gdGhpcy5nZXRaZXJvRGlyZWN0aW9uKCk7XHJcbiAgICAgICAgZm9yIChsZXQgdmFsIGluIHplcm9EaXIpIHtcclxuICAgICAgICAgICAgRGlyZWN0aW9uW3plcm9EaXJbdmFsXV0gPSB2YWw7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBEaXJlY3Rpb247XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDojrflj5blvZPliY3oioLngrnlnKjlj6/np7vliqjmlrnlkJHkuIrnmoTlrZDoioLngrnmlbDnu4RcclxuICAgICAqL1xyXG4gICAgZ2V0TmV4dE5vZGVzKCkge1xyXG4gICAgICAgIGxldCBub2RlID0gdGhpcztcclxuICAgICAgICBsZXQgbmV4dE5vZGVzOiBOb2RlW10gPSBbXTtcclxuICAgICAgICBbRElSRUNUSU9OLlVQLCBESVJFQ1RJT04uUklHSFQsIERJUkVDVElPTi5ET1dOLCBESVJFQ1RJT04uTEVGVF0uZm9yRWFjaChmdW5jdGlvbihkaXJlY3Rpb24pIHtcclxuICAgICAgICAgICAgaWYgKG5vZGUuY2FuTW92ZVRvKGRpcmVjdGlvbikpIHtcclxuICAgICAgICAgICAgICAgIGxldCBuZXdOb2RlID0gTm9kZS5ub2RlQ2xvbmUobm9kZSk7XHJcbiAgICAgICAgICAgICAgICBuZXdOb2RlLnBhcmVudCA9IG5vZGU7XHJcbiAgICAgICAgICAgICAgICBuZXdOb2RlLm1vdmVUbyhkaXJlY3Rpb24pO1xyXG4gICAgICAgICAgICAgICAgbmV4dE5vZGVzLnB1c2gobmV3Tm9kZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgICByZXR1cm4gbmV4dE5vZGVzO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog5Yik5pat5b2T5YmN6IqC54K577yI6IqC54K55Lit55qEIDAg5L2N77yJ5piv5ZCm5Y+v5Lul5rK/IGRpcmVjdGlvbiDmlrnlkJHnp7vliqhcclxuICAgICAqL1xyXG4gICAgY2FuTW92ZVRvKGRpcmVjdGlvbjogbnVtYmVyKSB7XHJcbiAgICAgICAgbGV0IHJvdyA9IE1hdGguZmxvb3IodGhpcy56ZXJvSW5kZXggLyB0aGlzLnNjYWxlKTtcclxuICAgICAgICBsZXQgY29sID0gdGhpcy56ZXJvSW5kZXggJSB0aGlzLnNjYWxlO1xyXG5cclxuICAgICAgICBzd2l0Y2ggKGRpcmVjdGlvbikge1xyXG4gICAgICAgICAgICBjYXNlIERJUkVDVElPTi5VUDpcclxuICAgICAgICAgICAgICAgIHJldHVybiByb3cgIT09IDA7XHJcbiAgICAgICAgICAgIGNhc2UgRElSRUNUSU9OLlJJR0hUOlxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGNvbCAhPT0gdGhpcy5zY2FsZSAtIDE7XHJcbiAgICAgICAgICAgIGNhc2UgRElSRUNUSU9OLkRPV046XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcm93ICE9PSB0aGlzLnNjYWxlIC0gMTtcclxuICAgICAgICAgICAgY2FzZSBESVJFQ1RJT04uTEVGVDpcclxuICAgICAgICAgICAgICAgIHJldHVybiBjb2wgIT09IDA7XHJcbiAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog6I635Y+W5LuO5b2T5YmN6IqC54K56LWw5Yiw5LiL5LiA5Liq6IqC54K555qE5Luj5Lu3XHJcbiAgICAgKi9cclxuICAgIGdldENvc3RUb05leHQoKSB7XHJcbiAgICAgICAgcmV0dXJuIDE7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDorr7nva7oioLngrnnmoQgRiDlgLzvvIzloIbkvJrmoLnmja7ov5nkuKrlgLzov5vooYzmjpLluo9cclxuICAgICAqL1xyXG4gICAgc2V0Rih2YWx1ZTogbnVtYmVyKSB7XHJcbiAgICAgICAgdGhpcy5GID0gdmFsdWU7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDojrflj5boioLngrnnmoQgRyDlgLxcclxuICAgICAqL1xyXG4gICAgZ2V0RygpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5HO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog6K6+572u6IqC54K555qEIEcg5YC8XHJcbiAgICAgKi9cclxuICAgIHNldEcodmFsdWU6IG51bWJlcikge1xyXG4gICAgICAgIHRoaXMuRyA9IHZhbHVlO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog6I635Y+W6IqC54K555qEIEgg5YC8XHJcbiAgICAgKi9cclxuICAgIGdldEgodGFyZ2V0Tm9kZTogTm9kZSkge1xyXG4gICAgICAgIGxldCBpID0gMCxcclxuICAgICAgICAgICAgbGVuID0gdGhpcy52YWx1ZS5sZW5ndGgsXHJcbiAgICAgICAgICAgIG1hbmhhdHRlbiA9IDAsXHJcbiAgICAgICAgICAgIGRpZmYgPSAwO1xyXG5cclxuICAgICAgICBmb3IgKDsgaSA8IGxlbjsgaSsrKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLnZhbHVlW2ldICE9PSBpICsgMSkgZGlmZisrO1xyXG5cclxuICAgICAgICAgICAgbGV0IHYgPSB0aGlzLnZhbHVlW2ldO1xyXG4gICAgICAgICAgICBpZiAodiAhPT0gMCkge1xyXG4gICAgICAgICAgICAgICAgLy8gbm93IGluXHJcbiAgICAgICAgICAgICAgICBsZXQgcm93ID0gTWF0aC5mbG9vcihpIC8gdGhpcy5zY2FsZSk7XHJcbiAgICAgICAgICAgICAgICBsZXQgY29sID0gaSAlIHRoaXMuc2NhbGU7XHJcbiAgICAgICAgICAgICAgICAvLyBzaG91bGQgaW5cclxuICAgICAgICAgICAgICAgIGxldCBfcm93ID0gTWF0aC5mbG9vcih2IC8gdGhpcy5zY2FsZSk7XHJcbiAgICAgICAgICAgICAgICBsZXQgX2NvbCA9IHYgJSB0aGlzLnNjYWxlO1xyXG5cclxuICAgICAgICAgICAgICAgIG1hbmhhdHRlbiArPSBNYXRoLmFicyhyb3cgLSBfcm93KSArIE1hdGguYWJzKGNvbCAtIF9jb2wpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gMiAqIG1hbmhhdHRlbiArIDEwMCAqIGRpZmY7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gcHJpdmF0ZSBmdW5jdGlvblxyXG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tLVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog5qC55o2u57u05bqmIHNjYWxlIOaehOmAoOiKgueCueeahOWIneWni+ihqOekuuaVsOe7hFxyXG4gICAgICovXHJcbiAgICBwcml2YXRlIGluaXROb2RlVmFsdWVCeVNjYWxlKHNjYWxlOiBudW1iZXIpIHtcclxuICAgICAgICBsZXQgdmFsID0gW107XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDE7IGkgPCBNYXRoLnBvdyhzY2FsZSwgMik7IGkrKykge1xyXG4gICAgICAgICAgICB2YWwucHVzaChpKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFsLnB1c2goMCk7XHJcbiAgICAgICAgcmV0dXJuIHZhbDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOiOt+WPluW9k+WJjeiKgueCueS4reWkhOS6jiAwIOS9jeeahOaWueWQkSBkaXJlY3Rpb24g5aSE55qE6YK75o6l5pWw5a2X55qE5LiL5qCHXHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgZ2V0VGFyZ2V0SW5kZXgoZGlyZWN0aW9uOiBudW1iZXIpIHtcclxuICAgICAgICBpZiAoIXRoaXMuY2FuTW92ZVRvKGRpcmVjdGlvbikpIHJldHVybjtcclxuICAgICAgICBsZXQgdGFyZ2V0SW5kZXg7XHJcbiAgICAgICAgc3dpdGNoIChkaXJlY3Rpb24pIHtcclxuICAgICAgICAgICAgY2FzZSBESVJFQ1RJT04uVVA6XHJcbiAgICAgICAgICAgICAgICB0YXJnZXRJbmRleCA9IHRoaXMuemVyb0luZGV4IC0gdGhpcy5zY2FsZTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIERJUkVDVElPTi5SSUdIVDpcclxuICAgICAgICAgICAgICAgIHRhcmdldEluZGV4ID0gdGhpcy56ZXJvSW5kZXggKyAxO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgRElSRUNUSU9OLkRPV046XHJcbiAgICAgICAgICAgICAgICB0YXJnZXRJbmRleCA9IHRoaXMuemVyb0luZGV4ICsgdGhpcy5zY2FsZTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIERJUkVDVElPTi5MRUZUOlxyXG4gICAgICAgICAgICAgICAgdGFyZ2V0SW5kZXggPSB0aGlzLnplcm9JbmRleCAtIDE7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgIHRhcmdldEluZGV4ID0gdGhpcy56ZXJvSW5kZXg7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0YXJnZXRJbmRleDtcclxuICAgIH1cclxuXHJcbiAgICAvLyBzdGF0aWMgZnVuY3Rpb25cclxuICAgIC8vIC0tLS0tLS0tLS0tLS0tLVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog5Yik5pat5Lik5Liq6IqC54K55piv5ZCm55u4562JXHJcbiAgICAgKiDpgJrov4flsIboioLngrnnmoTmlbDnu4TooajnpLrovazmjaLmiJDlrZfnrKbkuLLmnaXov5vooYzmr5TovoNcclxuICAgICAqL1xyXG4gICAgc3RhdGljIGlzU2FtZShjdXJyZW50Tm9kZTogTm9kZSwgdGFyZ2V0Tm9kZTogTm9kZSkge1xyXG4gICAgICAgIHJldHVybiBjdXJyZW50Tm9kZS5nZXRWYWxTdHIoKSA9PT0gdGFyZ2V0Tm9kZS5nZXRWYWxTdHIoKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOWfuuS6jiBub2RlIOWkjeWItuS4gOS4quaWsOeahOiKgueCuVxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgbm9kZUNsb25lKG5vZGU6IE5vZGUpIHtcclxuICAgICAgICBsZXQgbmV3Tm9kZSA9IG5ldyBOb2RlKG5vZGUuc2NhbGUpO1xyXG4gICAgICAgIG5ld05vZGUudmFsdWUgPSBub2RlLnZhbHVlLnNsaWNlKDApO1xyXG4gICAgICAgIG5ld05vZGUuemVyb0luZGV4ID0gbm9kZS56ZXJvSW5kZXg7XHJcbiAgICAgICAgcmV0dXJuIG5ld05vZGU7XHJcbiAgICB9XHJcbn1cclxuIiwiZXhwb3J0IGVudW0gRElSRUNUSU9OIHsgVVAgPSAxLCBSSUdIVCwgRE9XTiwgTEVGVCB9XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIGJlbG9uZ1RvIHtcclxuICAgIFtwcm9wTmFtZTogc3RyaW5nXTogbnVtYmVyO1xyXG59O1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uICRpZChlbGVJZDogc3RyaW5nKSB7XHJcbiAgICByZXR1cm4gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoZWxlSWQpO1xyXG59O1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uICRjcmVhdGVFbGUodGFnTmFtZTogc3RyaW5nLCBpZD86IHN0cmluZywgY2xhc3NOYW1lPzogc3RyaW5nKSB7XHJcbiAgICBsZXQgZWxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCh0YWdOYW1lKTtcclxuICAgIGlmIChpZCkgZWxlLmlkID0gaWQ7XHJcbiAgICBpZiAoY2xhc3NOYW1lKSBlbGUuY2xhc3NOYW1lID0gY2xhc3NOYW1lO1xyXG4gICAgcmV0dXJuIGVsZTtcclxufTtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiAkcmVwbGFjZUNsYXNzKGVsZSwgbmV3Q2xhc3M6IHN0cmluZywgcHJlZml4OiBzdHJpbmcpIHtcclxuICAgIGxldCByZWcgPSBuZXcgUmVnRXhwKGAke3ByZWZpeH0tKFxcXFxkKStgLCAnZycpO1xyXG4gICAgZWxlLmNsYXNzTmFtZSA9IGVsZS5jbGFzc05hbWUucmVwbGFjZShyZWcsIG5ld0NsYXNzKTtcclxufVxyXG5cclxuZnVuY3Rpb24gJGFkZENsYXNzKGVsZSwgbmV3Q2xhc3M6IHN0cmluZykge1xyXG4gICAgaWYgKGVsZS5jbGFzc05hbWUuaW5kZXhPZihuZXdDbGFzcykgPT09IC0xKSB7XHJcbiAgICAgICAgZWxlLmNsYXNzTmFtZSA9IGAke2VsZS5jbGFzc05hbWV9ICR7bmV3Q2xhc3N9YDtcclxuICAgIH1cclxufVxyXG5cclxuZnVuY3Rpb24gJHJlbW92ZUNsYXNzKGVsZSwgcmVtb3ZlOiBzdHJpbmcpIHtcclxuICAgIGVsZS5jbGFzc05hbWUgPSBlbGUuY2xhc3NOYW1lLnJlcGxhY2UocmVtb3ZlLCAnJykudHJpbSgpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gJGdldFBvcyhjbGFzc05hbWU6IHN0cmluZykge1xyXG4gICAgbGV0IGNsYXNzQXJyID0gY2xhc3NOYW1lLnNwbGl0KCcgJyk7XHJcbiAgICBmb3IgKGxldCBpID0gMCwgbGVuID0gY2xhc3NBcnIubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcclxuICAgICAgICBpZiAoY2xhc3NBcnJbaV0uaW5kZXhPZigncG9zJykgIT09IC0xKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBjbGFzc0FycltpXS5zcGxpdCgnLScpWzFdO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uICRnZXRJbWdJZChjbGFzc05hbWU6IHN0cmluZykge1xyXG4gICAgbGV0IGNsYXNzQXJyID0gY2xhc3NOYW1lLnNwbGl0KCcgJyk7XHJcbiAgICBmb3IgKGxldCBpID0gMCwgbGVuID0gY2xhc3NBcnIubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcclxuICAgICAgICBpZiAoY2xhc3NBcnJbaV0uaW5kZXhPZignaXRlbS0nKSAhPT0gLTEpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGNsYXNzQXJyW2ldLnNwbGl0KCctJylbMV07XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gJGV4Y2hhbmdlUG9zKGl0ZW0xLCBpdGVtMikge1xyXG4gICAgbGV0IHBvczEgPSAkZ2V0UG9zKGl0ZW0xLmNsYXNzTmFtZSk7XHJcbiAgICBsZXQgcG9zMiA9ICRnZXRQb3MoaXRlbTIuY2xhc3NOYW1lKTtcclxuXHJcbiAgICAkcmVtb3ZlQ2xhc3MoaXRlbTIsIGBwb3MtJHtwb3MyfWApO1xyXG4gICAgJGFkZENsYXNzKGl0ZW0yLCBgcG9zLSR7cG9zMX1gKTtcclxuICAgICRyZW1vdmVDbGFzcyhpdGVtMSwgYHBvcy0ke3BvczF9YCk7XHJcbiAgICAkYWRkQ2xhc3MoaXRlbTEsIGBwb3MtJHtwb3MyfWApO1xyXG59XHJcbiJdfQ==
