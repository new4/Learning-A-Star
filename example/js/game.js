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
        while (!astar.openList.isEmpty()) {
            // 成功
            if (node_1.default.isSame(astar.openList.top(), astar.targetNode)) {
                console.log("success!");
                break;
            }
            ;
            var currentNode = astar.openList.pop();
            astar.closedList.push(currentNode);
            astar.b_closedList[currentNode.getValStr()] = 1;
            var nextNodes = currentNode.getNextNodes();
            for (var i = 0, len = nextNodes.length; i < len; i++) {
                var nextNode = nextNodes[i];
                if (astar.isBelongToClosed(nextNode)) {
                    // console.log("continue 1");
                    continue;
                }
                var index = astar.openList.getItemIndex(nextNode);
                var cost = currentNode.getG() + currentNode.getCostToNext();
                if (index === undefined) {
                    nextNode.setG(cost);
                    nextNode.setF(nextNode.getG() + nextNode.getH(astar.targetNode));
                    astar.openList.push(nextNode);
                }
                else if (cost >= astar.openList.heap[index].getG()) {
                    // console.log("continue 2");
                    continue;
                }
            }
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
            // astar.run();
            astar.run2();
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
/**
 * 节点 Node 类定义
 */
var Node = (function () {
    function Node(scale, initArr) {
        this.F = 0;
        this.G = 0;
        this.scale = scale;
        this.value = initArr ? initArr : this.initNodeValueByScale(scale);
        this.zeroIndex = Math.pow(scale, 2) - 1;
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
/**
 * 根据 ID 获取元素
 */
function $id(eleId) {
    return document.getElementById(eleId);
}
exports.$id = $id;
;
/**
 * 根据 tagName 创建一个新的元素，可以指定该元素的 ID 和 className
 */
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
/**
 * 移除元素 ele 上的某个类名
 */
function $removeClass(ele, removeStr) {
    ele.className = ele.className.replace(removeStr, '').trim();
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvdHMvYXN0YXIudHMiLCJzcmMvdHMvZ2FtZS50cyIsInNyYy90cy9oZWFwLnRzIiwic3JjL3RzL21haW4udHMiLCJzcmMvdHMvbm9kZS50cyIsInNyYy90cy91dGlsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOztBQ0FBLHFCQUFpQixRQUFRLENBQUMsQ0FBQTtBQUMxQixxQkFBaUIsUUFBUSxDQUFDLENBQUE7QUFHMUI7O0dBRUc7QUFDSDtJQVNJLGVBQVksU0FBZSxFQUFFLFVBQWdCO1FBUDdDLGVBQVUsR0FBVyxFQUFFLENBQUE7UUFJZixpQkFBWSxHQUFhLEVBQUUsQ0FBQTtRQUMzQixhQUFRLEdBQVcsRUFBRSxDQUFBO1FBR3pCLElBQUksQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFDO1FBQzNCLElBQUksQ0FBQyxVQUFVLEdBQUcsVUFBVSxDQUFDO1FBQzdCLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxjQUFJLENBQUMsQ0FBQyxTQUFTLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQztJQUMvQyxDQUFDO0lBRUQsa0JBQWtCO0lBQ2xCLGtCQUFrQjtJQUVsQjs7T0FFRztJQUNILG1CQUFHLEdBQUg7UUFDSSxJQUFJLEtBQUssR0FBRyxJQUFJLENBQUM7UUFDakI7WUFDSSxJQUFJLFdBQVcsR0FBRyxLQUFLLENBQUMsUUFBUSxDQUFDLEdBQUcsRUFBRSxDQUFDO1lBQ3ZDLEtBQUssQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO1lBQ25DLEtBQUssQ0FBQyxZQUFZLENBQUMsV0FBVyxDQUFDLFNBQVMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBRWhELElBQUksU0FBUyxHQUFHLFdBQVcsQ0FBQyxZQUFZLEVBQUUsQ0FBQztZQUUzQyxTQUFTLENBQUMsT0FBTyxDQUFDLFVBQVMsUUFBUTtnQkFDL0IsSUFBSSxJQUFJLEdBQUcsV0FB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QUFFRCxzQkFBNkIsS0FBSyxFQUFFLEtBQUs7SUFDckMsSUFBSSxJQUFJLEdBQUcsT0FBTyxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQztJQUNwQyxJQUFJLElBQUksR0FBRyxPQUFPLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBRXBDLFlBQVksQ0FBQyxLQUFLLEVBQUUsU0FBTyxJQUFNLENBQUMsQ0FBQztJQUNuQyxTQUFTLENBQUMsS0FBSyxFQUFFLFNBQU8sSUFBTSxDQUFDLENBQUM7SUFDaEMsWUFBWSxDQUFDLEtBQUssRUFBRSxTQUFPLElBQU0sQ0FBQyxDQUFDO0lBQ25DLFNBQVMsQ0FBQyxLQUFLLEVBQUUsU0FBTyxJQUFNLENBQUMsQ0FBQztBQUNwQyxDQUFDO0FBUmUsb0JBQVksZUFRM0IsQ0FBQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJpbXBvcnQgTm9kZSBmcm9tICcuL25vZGUnO1xyXG5pbXBvcnQgSGVhcCBmcm9tICcuL2hlYXAnO1xyXG5pbXBvcnQgeyBiZWxvbmdUbyB9IGZyb20gJy4vdXRpbCc7XHJcblxyXG4vKipcclxuICogQSog566X5rOVXHJcbiAqL1xyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBBc3RhciB7XHJcbiAgICBvcGVuTGlzdDogSGVhcFxyXG4gICAgY2xvc2VkTGlzdDogTm9kZVtdID0gW11cclxuICAgIHN0YXJ0Tm9kZTogTm9kZVxyXG4gICAgdGFyZ2V0Tm9kZTogTm9kZVxyXG5cclxuICAgIHByaXZhdGUgYl9jbG9zZWRMaXN0OiBiZWxvbmdUbyA9IHt9XHJcbiAgICBwcml2YXRlIHNvbHV0aW9uOiBOb2RlW10gPSBbXVxyXG5cclxuICAgIGNvbnN0cnVjdG9yKHN0YXJ0Tm9kZTogTm9kZSwgdGFyZ2V0Tm9kZTogTm9kZSkge1xyXG4gICAgICAgIHRoaXMuc3RhcnROb2RlID0gc3RhcnROb2RlO1xyXG4gICAgICAgIHRoaXMudGFyZ2V0Tm9kZSA9IHRhcmdldE5vZGU7XHJcbiAgICAgICAgdGhpcy5vcGVuTGlzdCA9IG5ldyBIZWFwKFtzdGFydE5vZGVdLCBcIkZcIik7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gcHVibGljIGZ1bmN0aW9uXHJcbiAgICAvLyAtLS0tLS0tLS0tLS0tLS1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOi/kOihjCBBKiDnrpfms5VcclxuICAgICAqL1xyXG4gICAgcnVuKCkge1xyXG4gICAgICAgIGxldCBhc3RhciA9IHRoaXM7XHJcbiAgICAgICAgd2hpbGUgKCFOb2RlLmlzU2FtZShhc3Rhci5vcGVuTGlzdC50b3AoKSwgYXN0YXIudGFyZ2V0Tm9kZSkpIHtcclxuICAgICAgICAgICAgbGV0IGN1cnJlbnROb2RlID0gYXN0YXIub3Blbkxpc3QucG9wKCk7XHJcbiAgICAgICAgICAgIGFzdGFyLmNsb3NlZExpc3QucHVzaChjdXJyZW50Tm9kZSk7XHJcbiAgICAgICAgICAgIGFzdGFyLmJfY2xvc2VkTGlzdFtjdXJyZW50Tm9kZS5nZXRWYWxTdHIoKV0gPSAxO1xyXG5cclxuICAgICAgICAgICAgbGV0IG5leHROb2RlcyA9IGN1cnJlbnROb2RlLmdldE5leHROb2RlcygpO1xyXG5cclxuICAgICAgICAgICAgbmV4dE5vZGVzLmZvckVhY2goZnVuY3Rpb24obmV4dE5vZGUpIHtcclxuICAgICAgICAgICAgICAgIGxldCBjb3N0ID0gY3VycmVudE5vZGUuZ2V0RygpICsgY3VycmVudE5vZGUuZ2V0Q29zdFRvTmV4dCgpO1xyXG4gICAgICAgICAgICAgICAgbGV0IGluZGV4ID0gYXN0YXIub3Blbkxpc3QuZ2V0SXRlbUluZGV4KG5leHROb2RlKTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoaW5kZXggIT09IHVuZGVmaW5lZCAmJiBjb3N0IDwgbmV4dE5vZGUuZ2V0RygpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJuZXh0IDFcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgYXN0YXIub3Blbkxpc3QucmVtb3ZlKGluZGV4KTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoYXN0YXIuaXNCZWxvbmdUb0Nsb3NlZChuZXh0Tm9kZSkgJiYgY29zdCA8IG5leHROb2RlLmdldEcoKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwibmV4dCAyXCIpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGlmIChpbmRleCA9PT0gdW5kZWZpbmVkICYmICFhc3Rhci5pc0JlbG9uZ1RvQ2xvc2VkKG5leHROb2RlKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwibmV4dCAzXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIG5leHROb2RlLnNldEcoY29zdCk7XHJcbiAgICAgICAgICAgICAgICAgICAgbmV4dE5vZGUuc2V0RihuZXh0Tm9kZS5nZXRHKCkgKyBuZXh0Tm9kZS5nZXRIKGFzdGFyLnRhcmdldE5vZGUpKTtcclxuICAgICAgICAgICAgICAgICAgICBhc3Rhci5vcGVuTGlzdC5wdXNoKG5leHROb2RlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgdGFpbE5vZGUgPSBhc3Rhci5vcGVuTGlzdC50b3AoKTtcclxuICAgICAgICB0aGlzLnNvbHV0aW9uID0gW107XHJcbiAgICAgICAgd2hpbGUgKHRhaWxOb2RlKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc29sdXRpb24ucHVzaCh0YWlsTm9kZSk7XHJcbiAgICAgICAgICAgIHRhaWxOb2RlID0gdGFpbE5vZGUucGFyZW50O1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyB0aGlzLnNob3dTb2x1dGlvbigpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog6L+Q6KGMIEEqIOeul+azlSAoIOeJiOacrCAyICkg5a6e6aqM55SoXHJcbiAgICAgKi9cclxuICAgIHJ1bjIoKSB7XHJcbiAgICAgICAgbGV0IGFzdGFyID0gdGhpcztcclxuICAgICAgICB3aGlsZSAoIWFzdGFyLm9wZW5MaXN0LmlzRW1wdHkoKSkge1xyXG4gICAgICAgICAgICAvLyDmiJDlip9cclxuICAgICAgICAgICAgaWYgKE5vZGUuaXNTYW1lKGFzdGFyLm9wZW5MaXN0LnRvcCgpLCBhc3Rhci50YXJnZXROb2RlKSkge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJzdWNjZXNzIVwiKVxyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIGxldCBjdXJyZW50Tm9kZSA9IGFzdGFyLm9wZW5MaXN0LnBvcCgpO1xyXG4gICAgICAgICAgICBhc3Rhci5jbG9zZWRMaXN0LnB1c2goY3VycmVudE5vZGUpO1xyXG4gICAgICAgICAgICBhc3Rhci5iX2Nsb3NlZExpc3RbY3VycmVudE5vZGUuZ2V0VmFsU3RyKCldID0gMTtcclxuXHJcbiAgICAgICAgICAgIGxldCBuZXh0Tm9kZXMgPSBjdXJyZW50Tm9kZS5nZXROZXh0Tm9kZXMoKTtcclxuXHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwLCBsZW4gPSBuZXh0Tm9kZXMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGxldCBuZXh0Tm9kZSA9IG5leHROb2Rlc1tpXTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoYXN0YXIuaXNCZWxvbmdUb0Nsb3NlZChuZXh0Tm9kZSkpIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcImNvbnRpbnVlIDFcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgbGV0IGluZGV4ID0gYXN0YXIub3Blbkxpc3QuZ2V0SXRlbUluZGV4KG5leHROb2RlKTtcclxuICAgICAgICAgICAgICAgIGxldCBjb3N0ID0gY3VycmVudE5vZGUuZ2V0RygpICsgY3VycmVudE5vZGUuZ2V0Q29zdFRvTmV4dCgpO1xyXG4gICAgICAgICAgICAgICAgaWYgKGluZGV4ID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICBuZXh0Tm9kZS5zZXRHKGNvc3QpO1xyXG4gICAgICAgICAgICAgICAgICAgIG5leHROb2RlLnNldEYobmV4dE5vZGUuZ2V0RygpICsgbmV4dE5vZGUuZ2V0SChhc3Rhci50YXJnZXROb2RlKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgYXN0YXIub3Blbkxpc3QucHVzaChuZXh0Tm9kZSk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGNvc3QgPj0gYXN0YXIub3Blbkxpc3QuaGVhcFtpbmRleF0uZ2V0RygpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJjb250aW51ZSAyXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIC8vIG5leHROb2RlLnNldEcoY29zdCk7XHJcbiAgICAgICAgICAgICAgICAvLyBuZXh0Tm9kZS5zZXRGKG5leHROb2RlLmdldEcoKSArIG5leHROb2RlLmdldEgoYXN0YXIudGFyZ2V0Tm9kZSkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgdGFpbE5vZGUgPSBhc3Rhci5vcGVuTGlzdC50b3AoKTtcclxuICAgICAgICB0aGlzLnNvbHV0aW9uID0gW107XHJcbiAgICAgICAgd2hpbGUgKHRhaWxOb2RlKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc29sdXRpb24ucHVzaCh0YWlsTm9kZSk7XHJcbiAgICAgICAgICAgIHRhaWxOb2RlID0gdGFpbE5vZGUucGFyZW50O1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnNob3dTb2x1dGlvbigpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog6I635Y+W6Kej5Yaz5pa55qGI5pWw57uEXHJcbiAgICAgKi9cclxuICAgIGdldFNvbHV0aW9uKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnNvbHV0aW9uO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIHByaXZhdGUgZnVuY3Rpb25cclxuICAgIC8vIC0tLS0tLS0tLS0tLS0tLVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog5Yik5pat6IqC54K55piv5ZCm5ZyoIENMT1NFRCDkuK1cclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSBpc0JlbG9uZ1RvQ2xvc2VkKG5vZGU6IE5vZGUpIHtcclxuICAgICAgICBsZXQgc3RyID0gbm9kZS5nZXRWYWxTdHIoKTtcclxuICAgICAgICByZXR1cm4gISF0aGlzLmJfY2xvc2VkTGlzdFtzdHJdO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog5pi+56S66Kej5Yaz5pa55qGI55qE5YW35L2T5q2l6aqkXHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgc2hvd1NvbHV0aW9uKCkge1xyXG4gICAgICAgIGxldCBsZW4gPSB0aGlzLnNvbHV0aW9uLmxlbmd0aCxcclxuICAgICAgICAgICAgaSA9IGxlbiAtIDEsXHJcbiAgICAgICAgICAgIHNjYWxlID0gdGhpcy50YXJnZXROb2RlLnNjYWxlO1xyXG4gICAgICAgIGZvciAoOyBpID4gLTE7IGktLSkge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhgU3RlcCAke2xlbiAtIGl9OiBgKTtcclxuICAgICAgICAgICAgbGV0IGl0ZW0gPSB0aGlzLnNvbHV0aW9uW2ldLmdldFZhbFN0cigpLnNwbGl0KCcsJyk7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgc2NhbGU7IGorKykge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coYHwgJHtpdGVtW2ogKiBzY2FsZV19ICR7aXRlbVtqICogc2NhbGUgKyAxXX0gJHtpdGVtW2ogKiBzY2FsZSArIDJdfSB8YCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIiwiaW1wb3J0IE5vZGUgZnJvbSBcIi4vbm9kZVwiO1xyXG5pbXBvcnQgQXN0YXIgZnJvbSAnLi9hc3Rhcic7XHJcbmltcG9ydCB7ICRpZCwgJGNyZWF0ZUVsZSwgJHJlcGxhY2VDbGFzcywgJGdldFBvcywgJGdldEltZ0lkLCAkZXhjaGFuZ2VQb3MsIERJUkVDVElPTiB9IGZyb20gJy4vdXRpbCc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBHYW1lIHtcclxuICAgIGN1cnJlbnROb2RlOiBOb2RlXHJcbiAgICB0YXJnZXROb2RlOiBOb2RlXHJcbiAgICBzY2FsZTogbnVtYmVyXHJcbiAgICBydW5uaW5nOiBib29sZWFuID0gZmFsc2VcclxuICAgIGlzV2luOiBib29sZWFuID0gZmFsc2VcclxuXHJcbiAgICBwcml2YXRlIGdhbWVDb250YWluZXJJZDogc3RyaW5nXHJcbiAgICBwcml2YXRlIGltZ0NvbnRhaW5lcklkID0gXCJpbWFnZVwiXHJcbiAgICBwcml2YXRlIGFjdGlvbkNvbnRhaW5lcklkID0gXCJhY3Rpb25cIlxyXG4gICAgcHJpdmF0ZSBpbmZvSWQgPSBcImluZm9cIlxyXG5cclxuICAgIHByaXZhdGUgZ2FtZUNvbnRhaW5lclxyXG4gICAgcHJpdmF0ZSBpbWdDb250YWluZXJcclxuICAgIHByaXZhdGUgYWN0aW9uQ29udGFpbmVyXHJcbiAgICBwcml2YXRlIGluZm9Db250YWluZXJcclxuXHJcbiAgICAvLyDnvJPlrZjmiYDmnInnmoTlm77niYfniYfmrrUgZG9t77yM5YWN5b6X5YaN5om+XHJcbiAgICBwcml2YXRlIGltZ0VsZW1lbnRzID0gW11cclxuICAgIC8vIOe8k+WtmOepuueZveWbvueJh+eJh+autSBkb23vvIzlhY3lvpflho3mib5cclxuICAgIHByaXZhdGUgYmxhbmtJbWdFbGVcclxuXHJcbiAgICBwcml2YXRlIHRpbWVJbmZvRWxlXHJcbiAgICBwcml2YXRlIHN0ZXBJbmZvRWxlXHJcblxyXG4gICAgY29uc3RydWN0b3IoZ2FtZUNvbnRhaW5lcklkOiBzdHJpbmcsIHNjYWxlOiBudW1iZXIpIHtcclxuICAgICAgICB0aGlzLmN1cnJlbnROb2RlID0gbmV3IE5vZGUoc2NhbGUpO1xyXG4gICAgICAgIHRoaXMudGFyZ2V0Tm9kZSA9IG5ldyBOb2RlKHNjYWxlKTtcclxuICAgICAgICB0aGlzLnNjYWxlID0gc2NhbGU7XHJcblxyXG4gICAgICAgIHRoaXMuZ2FtZUNvbnRhaW5lcklkID0gZ2FtZUNvbnRhaW5lcklkO1xyXG5cclxuICAgICAgICB0aGlzLmdhbWVDb250YWluZXIgPSAkaWQodGhpcy5nYW1lQ29udGFpbmVySWQpO1xyXG4gICAgICAgIHRoaXMuaW1nQ29udGFpbmVyID0gJGNyZWF0ZUVsZSgnZGl2JywgdGhpcy5pbWdDb250YWluZXJJZCk7XHJcbiAgICAgICAgdGhpcy5hY3Rpb25Db250YWluZXIgPSAkY3JlYXRlRWxlKCdkaXYnLCB0aGlzLmFjdGlvbkNvbnRhaW5lcklkKTtcclxuICAgICAgICB0aGlzLmluZm9Db250YWluZXIgPSAkY3JlYXRlRWxlKCdkaXYnLCB0aGlzLmluZm9JZCk7XHJcblxyXG4gICAgICAgIHRoaXMuaW5pdCgpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIHB1YmxpYyBmdW5jdGlvblxyXG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBtaXgg5oyJ6ZKu5omn6KGM5Ye95pWwXHJcbiAgICAgKiDmt7flkIjvvIznlLHotbflp4voioLngrnkubHluo/lvpfliLDkuIDkuKrmlrDnmoToioLngrnvvIzlubbmoLnmja7mlrDoioLngrnorr7nva7pobXpnaLkuK3nmoTmmL7npLrnirbmgIFcclxuICAgICAqL1xyXG4gICAgbWl4KCkge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKFwicnVuaW5nID0gXCIsIHRoaXMucnVubmluZywgXCIgLS0gXCIsIFwiaXNXaW4gPSBcIiwgdGhpcy5pc1dpbik7XHJcbiAgICAgICAgaWYgKHRoaXMucnVubmluZyB8fCB0aGlzLmlzV2luKSByZXR1cm47XHJcbiAgICAgICAgdGhpcy5jdXJyZW50Tm9kZS5zaHVmZmxlKCk7XHJcbiAgICAgICAgdGhpcy5zZXRTdGF0dXNCeU5vZGUodGhpcy5jdXJyZW50Tm9kZSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBzdGFydCDmjInpkq7miafooYzlh73mlbBcclxuICAgICAqIOaJp+ihjCBBKiDnrpfms5VcclxuICAgICAqL1xyXG4gICAgc3RhcnQoKSB7XHJcbiAgICAgICAgbGV0IGdhbWUgPSB0aGlzO1xyXG5cclxuICAgICAgICBpZiAoZ2FtZS5ydW5uaW5nKSByZXR1cm47XHJcbiAgICAgICAgZ2FtZS5ydW5uaW5nID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgaWYgKE5vZGUuaXNTYW1lKHRoaXMuY3VycmVudE5vZGUsIHRoaXMudGFyZ2V0Tm9kZSkpIHtcclxuICAgICAgICAgICAgdGhpcy53aW4oKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBsZXQgYXN0YXIgPSBuZXcgQXN0YXIodGhpcy5jdXJyZW50Tm9kZSwgdGhpcy50YXJnZXROb2RlKTtcclxuXHJcbiAgICAgICAgICAgIGNvbnNvbGUudGltZShcIkFTdGFyIFJ1biAhXCIpO1xyXG4gICAgICAgICAgICBsZXQgc3RhcnRUaW1lID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XHJcbiAgICAgICAgICAgIC8vIGFzdGFyLnJ1bigpO1xyXG4gICAgICAgICAgICBhc3Rhci5ydW4yKCk7XHJcbiAgICAgICAgICAgIGxldCBlbmRUaW1lID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XHJcbiAgICAgICAgICAgIGNvbnNvbGUudGltZUVuZChcIkFTdGFyIFJ1biAhXCIpO1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIiBhc3RhciAtIFwiLCBhc3Rhcik7XHJcblxyXG4gICAgICAgICAgICBnYW1lLnRpbWVJbmZvRWxlLmlubmVySFRNTCA9IGAke2VuZFRpbWUgLSBzdGFydFRpbWV9IG1zYDtcclxuXHJcbiAgICAgICAgICAgIGxldCBzb2x1dGlvbiA9IGFzdGFyLmdldFNvbHV0aW9uKCk7XHJcbiAgICAgICAgICAgIGlmIChzb2x1dGlvbi5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgIGxldCBsZW4gPSBzb2x1dGlvbi5sZW5ndGgsXHJcbiAgICAgICAgICAgICAgICAgICAgaSA9IGxlbiAtIDE7XHJcblxyXG4gICAgICAgICAgICAgICAgbGV0IHJ1bklkID0gc2V0SW50ZXJ2YWwoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGkgPT09IC0xKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsZWFySW50ZXJ2YWwocnVuSWQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBnYW1lLndpbigpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGdhbWUuY3VycmVudE5vZGUgPSBzb2x1dGlvbltpXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZ2FtZS5zZXRTdGF0dXNCeU5vZGUoc29sdXRpb25baV0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBnYW1lLnN0ZXBJbmZvRWxlLmlubmVySFRNTCA9IGAke2xlbiAtIGl9XFwvJHtsZW59YDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaS0tO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0sIDE4MCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDotaLlvpfmuLjmiI9cclxuICAgICAqL1xyXG4gICAgd2luKCkge1xyXG4gICAgICAgIGxldCBnYW1lID0gdGhpcztcclxuICAgICAgICBsZXQgaWQgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBnYW1lLnJ1bm5pbmcgPSBmYWxzZTtcclxuICAgICAgICAgICAgZ2FtZS5pbWdDb250YWluZXIuY2xhc3NOYW1lID0gJ3dpbic7XHJcbiAgICAgICAgICAgIGdhbWUuaXNXaW4gPSB0cnVlO1xyXG4gICAgICAgICAgICBjbGVhclRpbWVvdXQoaWQpO1xyXG4gICAgICAgIH0sIDMwMCk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gcHJpdmF0ZSBmdW5jdGlvblxyXG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDliJ3lp4vljJblh73mlbBcclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSBpbml0KCkge1xyXG4gICAgICAgIHRoaXMuaW5pdEltYWdlKCk7XHJcbiAgICAgICAgdGhpcy5pbml0T3BlcmF0aW9uKCk7XHJcbiAgICAgICAgdGhpcy5pbml0SW5mbygpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog5ou85Zu+5ri45oiP55qE5Zu+54mH5pi+56S66YOo5YiG55qE5Yid5aeL5YyWXHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgaW5pdEltYWdlKCkge1xyXG4gICAgICAgIGxldCBnYW1lID0gdGhpcztcclxuICAgICAgICAvLyDoioLngrnnmoTmlbDnu4TooajnpLrkuK3nmoTmr4/kuIDkuKrmlbDnu4TnmoTpobnlr7nlupTkuIDkuKrmoLzlrZBcclxuICAgICAgICBmb3IgKGxldCBpID0gTWF0aC5wb3coZ2FtZS5zY2FsZSwgMikgLSAxOyBpID4gLTE7IGktLSkge1xyXG4gICAgICAgICAgICAvLyDmoLflvI8gaXRlbS0qIOinhOWumuafkOS4gOagvOWtkOWvueW6lOeahOWbvueJh+eJh+aute+8jOi/memDqOWIhuWIneWni+WMluWQjuS4jeWGjeaUueWPmFxyXG4gICAgICAgICAgICAvLyDmoLflvI8gcG9zLSog6KeE5a6a5p+Q5LiA5qC85a2Q5ZyoICNpbWFnZSDlrrnlmajkuK3nmoTkvY3nva7vvIzov5npg6jliIbpmo/nnYDoioLngrnlj5jljJbogIzmlLnlj5hcclxuICAgICAgICAgICAgbGV0IGVsZSA9ICRjcmVhdGVFbGUoJ2RpdicsIHVuZGVmaW5lZCwgYGl0ZW0gaXRlbS0ke2l9IHBvcy0ke2l9YCk7XHJcblxyXG4gICAgICAgICAgICBlbGUuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbihlKSB7IGdhbWUuaW1nRnJhZ21lbnRIYW5kbGVyKGUpIH0pO1xyXG5cclxuICAgICAgICAgICAgLy8g5Yid5aeL5YyW55qE5pe26LCD5pW056m655m95qC86YOo5YiGKCDmoLflvI/kuLrvvJogLml0ZW0uaXRlbS0wLnBvcy0wICnnmoTkvY3nva5cclxuICAgICAgICAgICAgLy8g5ZCM5pe25bCG5Zu+54mH54mH5q6155qEIGRvbSDnvJPlrZhcclxuICAgICAgICAgICAgaWYgKGkgPT09IDApIHtcclxuICAgICAgICAgICAgICAgIGdhbWUuaW1nQ29udGFpbmVyLmFwcGVuZENoaWxkKGVsZSk7XHJcbiAgICAgICAgICAgICAgICBnYW1lLmltZ0VsZW1lbnRzLnB1c2goZWxlKTtcclxuICAgICAgICAgICAgICAgIGdhbWUuYmxhbmtJbWdFbGUgPSBlbGU7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBnYW1lLmltZ0NvbnRhaW5lci5pbnNlcnRCZWZvcmUoZWxlLCBnYW1lLmltZ0NvbnRhaW5lci5maXJzdENoaWxkKTtcclxuICAgICAgICAgICAgICAgIGdhbWUuaW1nRWxlbWVudHMudW5zaGlmdChlbGUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGdhbWUuZ2FtZUNvbnRhaW5lci5hcHBlbmRDaGlsZChnYW1lLmltZ0NvbnRhaW5lcik7XHJcblxyXG4gICAgICAgIC8vIHdpbiDmlYjmnpzpg6jliIZcclxuICAgICAgICB0aGlzLmltZ0NvbnRhaW5lci5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMgPT09IGUudGFyZ2V0KSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNsYXNzTmFtZSA9ICcnO1xyXG4gICAgICAgICAgICAgICAgZ2FtZS5pc1dpbiA9IGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDmi7zlm77nmoTmjInpkq7mk43kvZzpg6jliIbnmoTliJ3lp4vljJZcclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSBpbml0T3BlcmF0aW9uKCkge1xyXG4gICAgICAgIGxldCBnYW1lID0gdGhpcztcclxuICAgICAgICAvLyDkuKTkuKrmjInpkq4gTUlYIOWSjCBTVEFSVFxyXG4gICAgICAgIFtcIk1JWFwiLCBcIlNUQVJUXCJdLmZvckVhY2goZnVuY3Rpb24oaXRlbSwgaW5kZXgsIGFycmF5KSB7XHJcbiAgICAgICAgICAgIGxldCBlbGUgPSAkY3JlYXRlRWxlKCdidXR0b24nLCB1bmRlZmluZWQsIGBidG4gYnRuLSR7aXRlbS50b0xvd2VyQ2FzZSgpfWApO1xyXG4gICAgICAgICAgICBlbGUuaW5uZXJIVE1MID0gaXRlbTtcclxuICAgICAgICAgICAgc3dpdGNoIChpdGVtKSB7XHJcbiAgICAgICAgICAgICAgICBjYXNlICdNSVgnOlxyXG4gICAgICAgICAgICAgICAgICAgIGVsZS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGdhbWUubWl4LmJpbmQoZ2FtZSkpO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSAnU1RBUlQnOlxyXG4gICAgICAgICAgICAgICAgICAgIGVsZS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGdhbWUuc3RhcnQuYmluZChnYW1lKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZ2FtZS5hY3Rpb25Db250YWluZXIuYXBwZW5kQ2hpbGQoZWxlKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICBnYW1lLmdhbWVDb250YWluZXIuYXBwZW5kQ2hpbGQoZ2FtZS5hY3Rpb25Db250YWluZXIpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog5ou85Zu+55qE5L+h5oGv5pi+56S66YOo5YiG55qE5Yid5aeL5YyWXHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgaW5pdEluZm8oKSB7XHJcbiAgICAgICAgbGV0IGdhbWUgPSB0aGlzO1xyXG5cclxuICAgICAgICBbXCJ0aW1lXCIsIFwic3RlcFwiXS5mb3JFYWNoKGZ1bmN0aW9uKHZhbHVlKSB7XHJcbiAgICAgICAgICAgIGxldCBkaXZFbGUgPSAkY3JlYXRlRWxlKCdkaXYnLCB1bmRlZmluZWQsICdpbmZvLWl0ZW0nKTtcclxuICAgICAgICAgICAgbGV0IHRpdGxlID0gJGNyZWF0ZUVsZSgnc3BhbicsIHVuZGVmaW5lZCwgJ3RpdGxlJyk7XHJcbiAgICAgICAgICAgIGxldCBjb250ZW50ID0gJGNyZWF0ZUVsZSgnc3BhbicpO1xyXG5cclxuICAgICAgICAgICAgdGl0bGUuaW5uZXJIVE1MID0gYCR7dmFsdWV9OmA7XHJcbiAgICAgICAgICAgIGNvbnRlbnQuaW5uZXJIVE1MID0gJzAnO1xyXG4gICAgICAgICAgICBnYW1lW2Ake3ZhbHVlfUluZm9FbGVgXSA9IGNvbnRlbnQ7XHJcblxyXG4gICAgICAgICAgICBkaXZFbGUuYXBwZW5kQ2hpbGQodGl0bGUpO1xyXG4gICAgICAgICAgICBkaXZFbGUuYXBwZW5kQ2hpbGQoY29udGVudCk7XHJcbiAgICAgICAgICAgIGdhbWUuaW5mb0NvbnRhaW5lci5hcHBlbmRDaGlsZChkaXZFbGUpO1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgZ2FtZS5nYW1lQ29udGFpbmVyLmFwcGVuZENoaWxkKGdhbWUuaW5mb0NvbnRhaW5lcik7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDmoLnmja7oioLngrnnmoTmlbDnu4TooajnpLrmnaXorr7nva7lm77niYfniYfmrrXnmoTkvY3nva5cclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSBzZXRTdGF0dXNCeU5vZGUobm9kZTogTm9kZSkge1xyXG4gICAgICAgIC8vIGxldCBpbWdFbGVtZW50cyA9IHRoaXMuaW1nQ29udGFpbmVyLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJpdGVtXCIpO1xyXG4gICAgICAgIGZvciAobGV0IGsgPSAwLCBsZW4gPSBub2RlLnZhbHVlLmxlbmd0aDsgayA8IGxlbjsgaysrKSB7XHJcbiAgICAgICAgICAgIGxldCBwb3MgPSAoayA9PT0gbGVuIC0gMSkgPyAwIDogayArIDE7O1xyXG4gICAgICAgICAgICBsZXQgdiA9IChub2RlLnZhbHVlW2tdID09PSAwKSA/IGxlbiA6IG5vZGUudmFsdWVba107XHJcbiAgICAgICAgICAgICRyZXBsYWNlQ2xhc3ModGhpcy5pbWdFbGVtZW50c1t2IC0gMV0sIGBwb3MtJHtwb3N9YCwgJ3BvcycpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOWbvueJh+eJh+auteS4iueahCBjbGljayDkuovku7blpITnkIblh73mlbDvvIznlKjmnaXnp7vliqjlm77niYfniYfmrrVcclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSBpbWdGcmFnbWVudEhhbmRsZXIoZSkge1xyXG4gICAgICAgIGxldCBpbWdJZCA9ICRnZXRJbWdJZChlLnRhcmdldC5jbGFzc05hbWUpO1xyXG4gICAgICAgIGxldCBub25aZXJvRGlyID0gdGhpcy5jdXJyZW50Tm9kZS5nZXROb25aZXJvRGlyZWN0aW9uKCk7XHJcbiAgICAgICAgaWYgKG5vblplcm9EaXJbaW1nSWRdKSB7XHJcbiAgICAgICAgICAgIGxldCBkaXJlY3Rpb24gPSBESVJFQ1RJT05bYCR7bm9uWmVyb0RpcltpbWdJZF19YF07XHJcbiAgICAgICAgICAgIHRoaXMuY3VycmVudE5vZGUubW92ZVRvKGRpcmVjdGlvbik7XHJcbiAgICAgICAgICAgICRleGNoYW5nZVBvcyh0aGlzLmJsYW5rSW1nRWxlLCBlLnRhcmdldCk7XHJcblxyXG4gICAgICAgICAgICBpZiAoTm9kZS5pc1NhbWUodGhpcy5jdXJyZW50Tm9kZSwgdGhpcy50YXJnZXROb2RlKSkgdGhpcy53aW4oKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIiwiaW1wb3J0IE5vZGUgZnJvbSAnLi9ub2RlJztcclxuaW1wb3J0IHsgYmVsb25nVG8gfSBmcm9tICcuL3V0aWwnO1xyXG4vLyBIZWFwIE9uIFRvcFxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBIZWFwIHtcclxuICAgIGhlYXA6IE5vZGVbXSA9IFtdXHJcbiAgICBiX2hlYXA6IGJlbG9uZ1RvID0ge31cclxuICAgIGtleTogc3RyaW5nXHJcbiAgICBjb25zdHJ1Y3Rvcihub2RlTGlzdDogTm9kZVtdLCBrZXk6IHN0cmluZykge1xyXG4gICAgICAgIHRoaXMua2V5ID0ga2V5O1xyXG4gICAgICAgIC8vIOeUqOS+neasoeaPkuWFpeeahOaWueW8j+aehOmAoOWIneWni+eahOWwj+mhtuWghlxyXG4gICAgICAgIGxldCBpID0gMCxcclxuICAgICAgICAgICAgbGVuID0gbm9kZUxpc3QubGVuZ3RoO1xyXG4gICAgICAgIGZvciAoOyBpIDwgbGVuOyBpKyspIHtcclxuICAgICAgICAgICAgdGhpcy5wdXNoKG5vZGVMaXN0W2ldKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLy8gcHVibGljIGZ1bmN0aW9uXHJcbiAgICAvLyAtLS0tLS0tLS0tLS0tLS1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOiOt+WPluWghuS4reS4i+agh+S4uiBpbmRleCDnmoTlgLxcclxuICAgICAqL1xyXG4gICAgZ2V0KGluZGV4OiBudW1iZXIpIHtcclxuICAgICAgICBpZiAoaW5kZXggPj0gMCAmJiBpbmRleCA8IHRoaXMuaGVhcC5sZW5ndGgpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuaGVhcFtpbmRleF1bdGhpcy5rZXldO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOWQkeWghuS4reaPkuWFpeS4gOS4quaWsOeahOWFg+e0oOW5tuiwg+aVtOWghlxyXG4gICAgICog5paw5YWD57Sg5LuO5pWw57uE5bC+6YOo5o+S5YWl77yM54S25ZCO5a+55paw5YWD57Sg5omn6KGM5LiK5rWu6LCD5pW0XHJcbiAgICAgKi9cclxuICAgIHB1c2gobm9kZTogTm9kZSkge1xyXG4gICAgICAgIHRoaXMuaGVhcC5wdXNoKG5vZGUpO1xyXG4gICAgICAgIHRoaXMuc2V0QkhlYXAodGhpcy5oZWFwLmxlbmd0aCAtIDEpO1xyXG4gICAgICAgIHRoaXMuZ29VcCh0aGlzLmhlYXAubGVuZ3RoIC0gMSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDliKDpmaTlubbov5Tlm57loIbpobblhYPntKDlubbosIPmlbTloIZcclxuICAgICAqIOWFiOWwhuWghumhtuWFg+e0oOS4juaVsOe7hOacq+WwvuWFg+e0oOS6kuaNou+8jOeEtuWQjuW8ueWHuuaVsOe7hOacq+WwvueahOWFg+e0oO+8jOacgOWQjuWvueWghumhtuWFg+e0oOaJp+ihjOS4i+ayieaTjeS9nFxyXG4gICAgICovXHJcbiAgICBwb3AoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuaXNFbXB0eSgpKSByZXR1cm47XHJcbiAgICAgICAgbGV0IHJlc3VsdDtcclxuICAgICAgICB0aGlzLnN3YXAoMCwgdGhpcy5oZWFwLmxlbmd0aCAtIDEpO1xyXG4gICAgICAgIHJlc3VsdCA9IHRoaXMuaGVhcC5wb3AoKTtcclxuICAgICAgICB0aGlzLnJlbW92ZUJIZWFwKHJlc3VsdC5nZXRWYWxTdHIoKSk7XHJcbiAgICAgICAgIXRoaXMuaXNFbXB0eSgpICYmIHRoaXMuZ29Eb3duKDApO1xyXG4gICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDnp7vpmaTloIbkuK3kuIvmoIfkuLogaW5kZXgg55qE5YWD57SgXHJcbiAgICAgKiDlsIbpnIDnp7vpmaTnmoTpobnkuI7loIbpobbkupLmjaLvvIznhLblkI7lvLnlh7rloIbpobbvvIzmnIDlkI7lr7nkupLmjaLpobnvvIjljp/loIbpobbvvInmiafooYzkuIrmta7mk43kvZxcclxuICAgICAqL1xyXG4gICAgcmVtb3ZlKGluZGV4OiBudW1iZXIpIHtcclxuICAgICAgICBpZiAoaW5kZXggPCAwIHx8IGluZGV4ID49IHRoaXMuaGVhcC5sZW5ndGgpIHJldHVybjtcclxuICAgICAgICB0aGlzLnN3YXAoMCwgaW5kZXgpO1xyXG4gICAgICAgIHRoaXMucG9wKCk7XHJcbiAgICAgICAgdGhpcy5nb1VwKGluZGV4KTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOiOt+WPluWghumhtuWFg+e0oFxyXG4gICAgICovXHJcbiAgICB0b3AoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuaGVhcC5sZW5ndGggJiYgdGhpcy5oZWFwWzBdO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog5Yik5pat5aCG5piv5ZCm5Li656m6XHJcbiAgICAgKi9cclxuICAgIGlzRW1wdHkoKSB7XHJcbiAgICAgICAgcmV0dXJuICF0aGlzLmhlYXAubGVuZ3RoO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog5Yik5pat5aCG5Lit5piv5ZCm5pyJ5YWD57SgIG5vZGVcclxuICAgICAqL1xyXG4gICAgZ2V0SXRlbUluZGV4KG5vZGU6IE5vZGUpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5iX2hlYXBbbm9kZS5nZXRWYWxTdHIoKV07XHJcbiAgICB9XHJcblxyXG4gICAgLy8gcHJpdmF0ZSBmdW5jdGlvblxyXG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDov5Tlm57loIbkuK3kuIvmoIfkuLogaW5kZXgg55qE5YWD57SgXHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgZ2V0VmFsdWUoaW5kZXg6IG51bWJlcikge1xyXG4gICAgICAgIGlmIChpbmRleCA8IDAgfHwgaW5kZXggPj0gdGhpcy5oZWFwLmxlbmd0aCkgcmV0dXJuO1xyXG4gICAgICAgIHJldHVybiB0aGlzLmhlYXBbaW5kZXhdW3RoaXMua2V5XTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOWghuS4reS4i+agh+S4uiBpbmRleCDnmoTlhYPntKDnmoTkuIrmta7mk43kvZxcclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSBnb1VwKGluZGV4OiBudW1iZXIpIHtcclxuICAgICAgICBsZXQgdmFsdWUgPSB0aGlzLmdldFZhbHVlKGluZGV4KSxcclxuICAgICAgICAgICAgcGFyZW50ID0gdGhpcy5nZXRQYXJlbnRJbmRleChpbmRleCk7XHJcblxyXG4gICAgICAgIGlmIChwYXJlbnQgPT09IHVuZGVmaW5lZCkgcmV0dXJuO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5nZXRWYWx1ZShwYXJlbnQpID4gdGhpcy5nZXRWYWx1ZShpbmRleCkpIHtcclxuICAgICAgICAgICAgdGhpcy5zd2FwKGluZGV4LCBwYXJlbnQpO1xyXG4gICAgICAgICAgICB0aGlzLmdvVXAocGFyZW50KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDloIbkuK3kuIvmoIfkuLogaW5kZXgg55qE5YWD57Sg55qE5LiL5rKJ5pON5L2cXHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgZ29Eb3duKGluZGV4OiBudW1iZXIpIHtcclxuICAgICAgICBsZXQgdmFsdWUgPSB0aGlzLmdldFZhbHVlKGluZGV4KSxcclxuICAgICAgICAgICAgW2xlZnQsIHJpZ2h0XSA9IHRoaXMuZ2V0Q2hpbGRJbmRleChpbmRleCksXHJcbiAgICAgICAgICAgIHN3YXBJbmRleCA9IGxlZnQ7XHJcblxyXG4gICAgICAgIC8vIOWFg+e0oOaYr+WPtuWtkOiKgueCue+8jOayoeacieWtkOWFg+e0oFxyXG4gICAgICAgIGlmIChsZWZ0ID09PSBudWxsKSByZXR1cm47XHJcblxyXG4gICAgICAgIC8vIOiLpeWFg+e0oOacieS4pOS4quWtkOWFg+e0oO+8jOiuvue9riBzd2FwSW5kZXgg5Li66L6D5bCP55qE6YKj5Liq5a2Q5YWD57Sg55qE5LiL5qCHXHJcbiAgICAgICAgLy8g6Iul5YWD57Sg5Y+q5pyJ5bem5YS/5a2Q77yMc3dhcEluZGV4IOW3sue7j+iiq+WIneWni+WMluS4uiBsZWZ0IOeahOWAvOS6hlxyXG4gICAgICAgIGlmIChyaWdodCkge1xyXG4gICAgICAgICAgICBzd2FwSW5kZXggPSB0aGlzLmdldFZhbHVlKGxlZnQpIDwgdGhpcy5nZXRWYWx1ZShyaWdodCkgPyBsZWZ0IDogcmlnaHQ7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyDmr5TovoPniLblhYPntKDlkozovoPlsI/nmoTpgqPkuKrlrZDlhYPntKDnmoTlgLzvvIzoi6XniLblhYPntKDnmoTlgLzovoPlpKfvvIzliJnnva7mjaLniLblhYPntKDlkozovoPlsI/nmoTlrZDlhYPntKBcclxuICAgICAgICAvLyDnhLblkI7lnKjmlrDnmoTnva7mjaLnmoTkvY3nva7lpITnu6fnu63miafooYzkuIvmsonmk43kvZxcclxuICAgICAgICBpZiAodGhpcy5nZXRWYWx1ZShzd2FwSW5kZXgpIDwgdmFsdWUpIHtcclxuICAgICAgICAgICAgdGhpcy5zd2FwKGluZGV4LCBzd2FwSW5kZXgpO1xyXG4gICAgICAgICAgICB0aGlzLmdvRG93bihzd2FwSW5kZXgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOiOt+WPluS4i+agh+S4uiBpbmRleCDnmoTlhYPntKDlnKjloIbkuK3nmoTniLblhYPntKBcclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSBnZXRQYXJlbnRJbmRleChpbmRleDogbnVtYmVyKSB7XHJcbiAgICAgICAgaWYgKGluZGV4IDwgMCB8fCBpbmRleCA+PSB0aGlzLmhlYXAubGVuZ3RoKSByZXR1cm47XHJcbiAgICAgICAgaWYgKGluZGV4ID09PSAwKSByZXR1cm4gMDtcclxuICAgICAgICByZXR1cm4gTWF0aC5mbG9vcigoaW5kZXggLSAxKSAvIDIpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog6I635Y+W5LiL5qCH5Li6IGluZGV4IOeahOWFg+e0oOWcqOWghuS4reeahOWtkOWFg+e0oO+8jOe8uuWkseeahOWtkOWFg+e0oOeUqCBudWxsIOS7o+abv1xyXG4gICAgICovXHJcbiAgICBwcml2YXRlIGdldENoaWxkSW5kZXgoaW5kZXg6IG51bWJlcikge1xyXG4gICAgICAgIGxldCBsZWZ0ID0gMiAqIGluZGV4ICsgMSxcclxuICAgICAgICAgICAgcmlnaHQgPSAyICogaW5kZXggKyAyLFxyXG4gICAgICAgICAgICBsZW5ndGggPSB0aGlzLmhlYXAubGVuZ3RoO1xyXG5cclxuICAgICAgICBpZiAocmlnaHQgPD0gbGVuZ3RoIC0gMSkge1xyXG4gICAgICAgICAgICByZXR1cm4gW2xlZnQsIHJpZ2h0XTtcclxuICAgICAgICB9IGVsc2UgaWYgKGxlZnQgPT09IGxlbmd0aCAtIDEpIHtcclxuICAgICAgICAgICAgcmV0dXJuIFtsZWZ0LCBudWxsXTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICByZXR1cm4gW251bGwsIG51bGxdO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOS6pOaNouWghuS4reS4i+agh+WIhuWIq+S4uiBpbmRleDEg5ZKMIGluZGV4MiDnmoTkuKTkuKrlhYPntKBcclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSBzd2FwKGluZGV4MTogbnVtYmVyLCBpbmRleDI6IG51bWJlcikge1xyXG4gICAgICAgIGxldCB0bXAgPSB0aGlzLmhlYXBbaW5kZXgxXTtcclxuICAgICAgICB0aGlzLmhlYXBbaW5kZXgxXSA9IHRoaXMuaGVhcFtpbmRleDJdO1xyXG4gICAgICAgIHRoaXMuaGVhcFtpbmRleDJdID0gdG1wO1xyXG5cclxuICAgICAgICB0aGlzLnNldEJIZWFwKGluZGV4MSk7XHJcbiAgICAgICAgdGhpcy5zZXRCSGVhcChpbmRleDIpO1xyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBzZXRCSGVhcChpbmRleDogbnVtYmVyKSB7XHJcbiAgICAgICAgdGhpcy5iX2hlYXBbdGhpcy5oZWFwW2luZGV4XS5nZXRWYWxTdHIoKV0gPSBpbmRleDtcclxuICAgIH1cclxuICAgIHByaXZhdGUgcmVtb3ZlQkhlYXAoc3RyOiBzdHJpbmcpIHtcclxuICAgICAgICBkZWxldGUgdGhpcy5iX2hlYXBbc3RyXTtcclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQgR2FtZSBmcm9tIFwiLi9nYW1lXCI7XHJcblxyXG5sZXQgZ2FtZSA9IG5ldyBHYW1lKFwiY29udGFpbmVyXCIsIDMpO1xyXG4vLyBsZXQgZ2FtZSA9IG5ldyBHYW1lKCBcImNvbnRhaW5lclwiLCA1ICk7XHJcblxyXG5jb25zb2xlLmxvZyhnYW1lKTtcclxuY29uc29sZS5sb2coXCItLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cIik7XHJcbiIsImltcG9ydCB7IERJUkVDVElPTiB9IGZyb20gJy4vdXRpbCc7XHJcblxyXG4vLyBMRVQgRElSRUNUSU9OID0gWyAnTk9ORScsICdVUCcsICdSSUdIVCcsICdET1dOJywgJ0xFRlQnIF07XHJcblxyXG4vKipcclxuICog6IqC54K5IE5vZGUg57G75a6a5LmJXHJcbiAqL1xyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBOb2RlIHtcclxuICAgIHZhbHVlOiBudW1iZXJbXSAgICAgLy8g5p+Q5LiA6IqC54K555qE5YC877yM55So5LiA57u05pWw57uE6KGo56S6XHJcbiAgICB6ZXJvSW5kZXg6IG51bWJlciAgIC8vIOiKgueCueWAvOaVsOe7hOS4reeahCAwIOWAvOaJgOWcqOS9jee9rueahOS4i+agh1xyXG4gICAgc2NhbGU6IG51bWJlciAgICAgICAvLyDoioLngrnlsLrluqbvvIwzKjPvvIw0KjTvvIw1KjUg562J562JXHJcbiAgICBwYXJlbnQ6IE5vZGUgICAgICAgIC8vIOW9k+WJjeiKgueCueeahOeItuiKgueCue+8jOeItuiKgueCuemAmui/h+WvuSAwIOS9jeeahOafkOS4gOatpeenu+WKqOWIsOi+vuW9k+WJjeiKgueCuVxyXG4gICAgRjogbnVtYmVyID0gMFxyXG4gICAgRzogbnVtYmVyID0gMFxyXG5cclxuICAgIGNvbnN0cnVjdG9yKHNjYWxlOiBudW1iZXIsIGluaXRBcnI/OiBudW1iZXJbXSkge1xyXG4gICAgICAgIHRoaXMuc2NhbGUgPSBzY2FsZTtcclxuICAgICAgICB0aGlzLnZhbHVlID0gaW5pdEFyciA/IGluaXRBcnIgOiB0aGlzLmluaXROb2RlVmFsdWVCeVNjYWxlKHNjYWxlKTtcclxuICAgICAgICB0aGlzLnplcm9JbmRleCA9IE1hdGgucG93KHNjYWxlLCAyKSAtIDE7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gcHVibGljIGZ1bmN0aW9uXHJcbiAgICAvLyAtLS0tLS0tLS0tLS0tLS1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOiOt+WPluiKgueCueeahOWAvO+8jOWwhuiKgueCueeahOaVsOe7hOihqOekuui9rOaNouaIkOWtl+espuS4suihqOekuuW5tui/lOWbnlxyXG4gICAgICovXHJcbiAgICBnZXRWYWxTdHIoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMudmFsdWUudG9TdHJpbmcoKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOiKgueCueeahOS5seW6j+eul+azlVxyXG4gICAgICog6ZqP5py65oyH5a6a5LiA5Liq5pa55ZCR77yM5Luk6IqC54K55ZCR6K+l5pa55ZCR56e75Yqo77yM6YeN5aSN5LiK6L+w6L+H56iL6Iul5bmy5qyh6L6+5Yiw5Lmx5bqP55qE55uu55qEXHJcbiAgICAgKi9cclxuICAgIHNodWZmbGUoKSB7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCA1MDAwOyBpKyspIHtcclxuICAgICAgICAgICAgbGV0IGRpcmVjdGlvbiA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDQgKyAxKTtcclxuICAgICAgICAgICAgdGhpcy5tb3ZlVG8oZGlyZWN0aW9uKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDlvZPliY3oioLngrnlkJHmlrnlkJEgZGlyZWN0aW9uIOenu+WKqOS4gOasoVxyXG4gICAgICog5YW25a6e5piv6IqC54K555qE5pWw57uE6KGo56S65Lit55qE5pWw5a2XIDAg5ZCR5pa55ZCRIGRpcmVjdGlvbiDnp7vliqjkuIDmrKFcclxuICAgICAqL1xyXG4gICAgbW92ZVRvKGRpcmVjdGlvbjogbnVtYmVyKSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLmNhbk1vdmVUbyhkaXJlY3Rpb24pKSByZXR1cm47XHJcbiAgICAgICAgbGV0IHRhcmdldEluZGV4ID0gdGhpcy5nZXRUYXJnZXRJbmRleChkaXJlY3Rpb24pO1xyXG5cclxuICAgICAgICB0aGlzLnZhbHVlW3RoaXMuemVyb0luZGV4XSA9IHRoaXMudmFsdWVbdGFyZ2V0SW5kZXhdO1xyXG4gICAgICAgIHRoaXMudmFsdWVbdGFyZ2V0SW5kZXhdID0gMDtcclxuICAgICAgICB0aGlzLnplcm9JbmRleCA9IHRhcmdldEluZGV4O1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog6I635Y+W5b2T5YmN6IqC54K555qE5Y+v6IO956e75Yqo5pa55ZCR77yI55SoIDAg5L2N55qE56e75Yqo6L+b6KGM6KGo56S677yJXHJcbiAgICAgKi9cclxuICAgIGdldFplcm9EaXJlY3Rpb24oKSB7XHJcbiAgICAgICAgbGV0IG5vZGUgPSB0aGlzO1xyXG4gICAgICAgIGxldCBEaXJlY3Rpb24gPSB7fTtcclxuICAgICAgICBbXCJVUFwiLCBcIlJJR0hUXCIsIFwiRE9XTlwiLCBcIkxFRlRcIl0uZm9yRWFjaChmdW5jdGlvbihkaXIpIHtcclxuICAgICAgICAgICAgbGV0IF9kaXIgPSBESVJFQ1RJT05bZGlyXTtcclxuICAgICAgICAgICAgaWYgKG5vZGUuY2FuTW92ZVRvKF9kaXIpKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgdGFyZ2V0SW5kZXggPSBub2RlLmdldFRhcmdldEluZGV4KF9kaXIpO1xyXG4gICAgICAgICAgICAgICAgRGlyZWN0aW9uW2Rpcl0gPSBgJHtub2RlLnZhbHVlW3RhcmdldEluZGV4XX1gO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgcmV0dXJuIERpcmVjdGlvbjtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOWwhuW9k+WJjeiKgueCueeahOWPr+iDveenu+WKqOaWueWQkeeUseeUqCAwIOS9jeeahOenu+WKqOadpeihqOekuui9rOaNouaIkOeUqCAwIOS9jemCu+aOpeeahOmdniAwIOaVsOWtl+eahOenu+WKqOadpei/m+ihjOihqOekulxyXG4gICAgICovXHJcbiAgICBnZXROb25aZXJvRGlyZWN0aW9uKCkge1xyXG4gICAgICAgIGxldCBEaXJlY3Rpb24gPSB7fTtcclxuICAgICAgICBsZXQgemVyb0RpciA9IHRoaXMuZ2V0WmVyb0RpcmVjdGlvbigpO1xyXG4gICAgICAgIGZvciAobGV0IHZhbCBpbiB6ZXJvRGlyKSB7XHJcbiAgICAgICAgICAgIERpcmVjdGlvblt6ZXJvRGlyW3ZhbF1dID0gdmFsO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gRGlyZWN0aW9uO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog6I635Y+W5b2T5YmN6IqC54K55Zyo5Y+v56e75Yqo5pa55ZCR5LiK55qE5a2Q6IqC54K55pWw57uEXHJcbiAgICAgKi9cclxuICAgIGdldE5leHROb2RlcygpIHtcclxuICAgICAgICBsZXQgbm9kZSA9IHRoaXM7XHJcbiAgICAgICAgbGV0IG5leHROb2RlczogTm9kZVtdID0gW107XHJcbiAgICAgICAgW0RJUkVDVElPTi5VUCwgRElSRUNUSU9OLlJJR0hULCBESVJFQ1RJT04uRE9XTiwgRElSRUNUSU9OLkxFRlRdLmZvckVhY2goZnVuY3Rpb24oZGlyZWN0aW9uKSB7XHJcbiAgICAgICAgICAgIGlmIChub2RlLmNhbk1vdmVUbyhkaXJlY3Rpb24pKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgbmV3Tm9kZSA9IE5vZGUubm9kZUNsb25lKG5vZGUpO1xyXG4gICAgICAgICAgICAgICAgbmV3Tm9kZS5wYXJlbnQgPSBub2RlO1xyXG4gICAgICAgICAgICAgICAgbmV3Tm9kZS5tb3ZlVG8oZGlyZWN0aW9uKTtcclxuICAgICAgICAgICAgICAgIG5leHROb2Rlcy5wdXNoKG5ld05vZGUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgcmV0dXJuIG5leHROb2RlcztcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOWIpOaWreW9k+WJjeiKgueCue+8iOiKgueCueS4reeahCAwIOS9je+8ieaYr+WQpuWPr+S7peayvyBkaXJlY3Rpb24g5pa55ZCR56e75YqoXHJcbiAgICAgKi9cclxuICAgIGNhbk1vdmVUbyhkaXJlY3Rpb246IG51bWJlcikge1xyXG4gICAgICAgIGxldCByb3cgPSBNYXRoLmZsb29yKHRoaXMuemVyb0luZGV4IC8gdGhpcy5zY2FsZSk7XHJcbiAgICAgICAgbGV0IGNvbCA9IHRoaXMuemVyb0luZGV4ICUgdGhpcy5zY2FsZTtcclxuXHJcbiAgICAgICAgc3dpdGNoIChkaXJlY3Rpb24pIHtcclxuICAgICAgICAgICAgY2FzZSBESVJFQ1RJT04uVVA6XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcm93ICE9PSAwO1xyXG4gICAgICAgICAgICBjYXNlIERJUkVDVElPTi5SSUdIVDpcclxuICAgICAgICAgICAgICAgIHJldHVybiBjb2wgIT09IHRoaXMuc2NhbGUgLSAxO1xyXG4gICAgICAgICAgICBjYXNlIERJUkVDVElPTi5ET1dOOlxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJvdyAhPT0gdGhpcy5zY2FsZSAtIDE7XHJcbiAgICAgICAgICAgIGNhc2UgRElSRUNUSU9OLkxFRlQ6XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gY29sICE9PSAwO1xyXG4gICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOiOt+WPluS7juW9k+WJjeiKgueCuei1sOWIsOS4i+S4gOS4quiKgueCueeahOS7o+S7t1xyXG4gICAgICovXHJcbiAgICBnZXRDb3N0VG9OZXh0KCkge1xyXG4gICAgICAgIHJldHVybiAxO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog6K6+572u6IqC54K555qEIEYg5YC877yM5aCG5Lya5qC55o2u6L+Z5Liq5YC86L+b6KGM5o6S5bqPXHJcbiAgICAgKi9cclxuICAgIHNldEYodmFsdWU6IG51bWJlcikge1xyXG4gICAgICAgIHRoaXMuRiA9IHZhbHVlO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog6I635Y+W6IqC54K555qEIEcg5YC8XHJcbiAgICAgKi9cclxuICAgIGdldEcoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuRztcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOiuvue9ruiKgueCueeahCBHIOWAvFxyXG4gICAgICovXHJcbiAgICBzZXRHKHZhbHVlOiBudW1iZXIpIHtcclxuICAgICAgICB0aGlzLkcgPSB2YWx1ZTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOiOt+WPluiKgueCueeahCBIIOWAvFxyXG4gICAgICovXHJcbiAgICBnZXRIKHRhcmdldE5vZGU6IE5vZGUpIHtcclxuICAgICAgICBsZXQgaSA9IDAsXHJcbiAgICAgICAgICAgIGxlbiA9IHRoaXMudmFsdWUubGVuZ3RoLFxyXG4gICAgICAgICAgICBtYW5oYXR0ZW4gPSAwLFxyXG4gICAgICAgICAgICBkaWZmID0gMDtcclxuXHJcbiAgICAgICAgZm9yICg7IGkgPCBsZW47IGkrKykge1xyXG4gICAgICAgICAgICBpZiAodGhpcy52YWx1ZVtpXSAhPT0gaSArIDEpIGRpZmYrKztcclxuXHJcbiAgICAgICAgICAgIGxldCB2ID0gdGhpcy52YWx1ZVtpXTtcclxuICAgICAgICAgICAgaWYgKHYgIT09IDApIHtcclxuICAgICAgICAgICAgICAgIC8vIG5vdyBpblxyXG4gICAgICAgICAgICAgICAgbGV0IHJvdyA9IE1hdGguZmxvb3IoaSAvIHRoaXMuc2NhbGUpO1xyXG4gICAgICAgICAgICAgICAgbGV0IGNvbCA9IGkgJSB0aGlzLnNjYWxlO1xyXG4gICAgICAgICAgICAgICAgLy8gc2hvdWxkIGluXHJcbiAgICAgICAgICAgICAgICBsZXQgX3JvdyA9IE1hdGguZmxvb3IodiAvIHRoaXMuc2NhbGUpO1xyXG4gICAgICAgICAgICAgICAgbGV0IF9jb2wgPSB2ICUgdGhpcy5zY2FsZTtcclxuXHJcbiAgICAgICAgICAgICAgICBtYW5oYXR0ZW4gKz0gTWF0aC5hYnMocm93IC0gX3JvdykgKyBNYXRoLmFicyhjb2wgLSBfY29sKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIDIgKiBtYW5oYXR0ZW4gKyAxMDAgKiBkaWZmO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIHByaXZhdGUgZnVuY3Rpb25cclxuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOagueaNrue7tOW6piBzY2FsZSDmnoTpgKDoioLngrnnmoTliJ3lp4vooajnpLrmlbDnu4RcclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSBpbml0Tm9kZVZhbHVlQnlTY2FsZShzY2FsZTogbnVtYmVyKSB7XHJcbiAgICAgICAgbGV0IHZhbCA9IFtdO1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAxOyBpIDwgTWF0aC5wb3coc2NhbGUsIDIpOyBpKyspIHtcclxuICAgICAgICAgICAgdmFsLnB1c2goaSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhbC5wdXNoKDApO1xyXG4gICAgICAgIHJldHVybiB2YWw7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDojrflj5blvZPliY3oioLngrnkuK3lpITkuo4gMCDkvY3nmoTmlrnlkJEgZGlyZWN0aW9uIOWkhOeahOmCu+aOpeaVsOWtl+eahOS4i+agh1xyXG4gICAgICovXHJcbiAgICBwcml2YXRlIGdldFRhcmdldEluZGV4KGRpcmVjdGlvbjogbnVtYmVyKSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLmNhbk1vdmVUbyhkaXJlY3Rpb24pKSByZXR1cm47XHJcbiAgICAgICAgbGV0IHRhcmdldEluZGV4O1xyXG4gICAgICAgIHN3aXRjaCAoZGlyZWN0aW9uKSB7XHJcbiAgICAgICAgICAgIGNhc2UgRElSRUNUSU9OLlVQOlxyXG4gICAgICAgICAgICAgICAgdGFyZ2V0SW5kZXggPSB0aGlzLnplcm9JbmRleCAtIHRoaXMuc2NhbGU7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBESVJFQ1RJT04uUklHSFQ6XHJcbiAgICAgICAgICAgICAgICB0YXJnZXRJbmRleCA9IHRoaXMuemVyb0luZGV4ICsgMTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIERJUkVDVElPTi5ET1dOOlxyXG4gICAgICAgICAgICAgICAgdGFyZ2V0SW5kZXggPSB0aGlzLnplcm9JbmRleCArIHRoaXMuc2NhbGU7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBESVJFQ1RJT04uTEVGVDpcclxuICAgICAgICAgICAgICAgIHRhcmdldEluZGV4ID0gdGhpcy56ZXJvSW5kZXggLSAxO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICB0YXJnZXRJbmRleCA9IHRoaXMuemVyb0luZGV4O1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGFyZ2V0SW5kZXg7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gc3RhdGljIGZ1bmN0aW9uXHJcbiAgICAvLyAtLS0tLS0tLS0tLS0tLS1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOWIpOaWreS4pOS4quiKgueCueaYr+WQpuebuOetiVxyXG4gICAgICog6YCa6L+H5bCG6IqC54K555qE5pWw57uE6KGo56S66L2s5o2i5oiQ5a2X56ym5Liy5p2l6L+b6KGM5q+U6L6DXHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyBpc1NhbWUoY3VycmVudE5vZGU6IE5vZGUsIHRhcmdldE5vZGU6IE5vZGUpIHtcclxuICAgICAgICByZXR1cm4gY3VycmVudE5vZGUuZ2V0VmFsU3RyKCkgPT09IHRhcmdldE5vZGUuZ2V0VmFsU3RyKCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDln7rkuo4gbm9kZSDlpI3liLbkuIDkuKrmlrDnmoToioLngrlcclxuICAgICAqL1xyXG4gICAgc3RhdGljIG5vZGVDbG9uZShub2RlOiBOb2RlKSB7XHJcbiAgICAgICAgbGV0IG5ld05vZGUgPSBuZXcgTm9kZShub2RlLnNjYWxlKTtcclxuICAgICAgICBuZXdOb2RlLnZhbHVlID0gbm9kZS52YWx1ZS5zbGljZSgwKTtcclxuICAgICAgICBuZXdOb2RlLnplcm9JbmRleCA9IG5vZGUuemVyb0luZGV4O1xyXG4gICAgICAgIHJldHVybiBuZXdOb2RlO1xyXG4gICAgfVxyXG59XHJcbiIsImV4cG9ydCBlbnVtIERJUkVDVElPTiB7IFVQID0gMSwgUklHSFQsIERPV04sIExFRlQgfVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBiZWxvbmdUbyB7XHJcbiAgICBbcHJvcE5hbWU6IHN0cmluZ106IG51bWJlcjtcclxufTtcclxuXHJcbi8qKlxyXG4gKiDmoLnmja4gSUQg6I635Y+W5YWD57SgXHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gJGlkKGVsZUlkOiBzdHJpbmcpIHtcclxuICAgIHJldHVybiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChlbGVJZCk7XHJcbn07XHJcblxyXG4vKipcclxuICog5qC55o2uIHRhZ05hbWUg5Yib5bu65LiA5Liq5paw55qE5YWD57Sg77yM5Y+v5Lul5oyH5a6a6K+l5YWD57Sg55qEIElEIOWSjCBjbGFzc05hbWVcclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiAkY3JlYXRlRWxlKHRhZ05hbWU6IHN0cmluZywgaWQ/OiBzdHJpbmcsIGNsYXNzTmFtZT86IHN0cmluZykge1xyXG4gICAgbGV0IGVsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQodGFnTmFtZSk7XHJcbiAgICBpZiAoaWQpIGVsZS5pZCA9IGlkO1xyXG4gICAgaWYgKGNsYXNzTmFtZSkgZWxlLmNsYXNzTmFtZSA9IGNsYXNzTmFtZTtcclxuICAgIHJldHVybiBlbGU7XHJcbn07XHJcbmV4cG9ydCBmdW5jdGlvbiAkcmVwbGFjZUNsYXNzKGVsZSwgbmV3Q2xhc3M6IHN0cmluZywgcHJlZml4OiBzdHJpbmcpIHtcclxuICAgIGxldCByZWcgPSBuZXcgUmVnRXhwKGAke3ByZWZpeH0tKFxcXFxkKStgLCAnZycpO1xyXG4gICAgZWxlLmNsYXNzTmFtZSA9IGVsZS5jbGFzc05hbWUucmVwbGFjZShyZWcsIG5ld0NsYXNzKTtcclxufVxyXG5cclxuZnVuY3Rpb24gJGFkZENsYXNzKGVsZSwgbmV3Q2xhc3M6IHN0cmluZykge1xyXG4gICAgaWYgKGVsZS5jbGFzc05hbWUuaW5kZXhPZihuZXdDbGFzcykgPT09IC0xKSB7XHJcbiAgICAgICAgZWxlLmNsYXNzTmFtZSA9IGAke2VsZS5jbGFzc05hbWV9ICR7bmV3Q2xhc3N9YDtcclxuICAgIH1cclxufVxyXG5cclxuLyoqXHJcbiAqIOenu+mZpOWFg+e0oCBlbGUg5LiK55qE5p+Q5Liq57G75ZCNXHJcbiAqL1xyXG5mdW5jdGlvbiAkcmVtb3ZlQ2xhc3MoZWxlLCByZW1vdmVTdHI6IHN0cmluZykge1xyXG4gICAgZWxlLmNsYXNzTmFtZSA9IGVsZS5jbGFzc05hbWUucmVwbGFjZShyZW1vdmVTdHIsICcnKS50cmltKCk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiAkZ2V0UG9zKGNsYXNzTmFtZTogc3RyaW5nKSB7XHJcbiAgICBsZXQgY2xhc3NBcnIgPSBjbGFzc05hbWUuc3BsaXQoJyAnKTtcclxuICAgIGZvciAobGV0IGkgPSAwLCBsZW4gPSBjbGFzc0Fyci5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xyXG4gICAgICAgIGlmIChjbGFzc0FycltpXS5pbmRleE9mKCdwb3MnKSAhPT0gLTEpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGNsYXNzQXJyW2ldLnNwbGl0KCctJylbMV07XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gJGdldEltZ0lkKGNsYXNzTmFtZTogc3RyaW5nKSB7XHJcbiAgICBsZXQgY2xhc3NBcnIgPSBjbGFzc05hbWUuc3BsaXQoJyAnKTtcclxuICAgIGZvciAobGV0IGkgPSAwLCBsZW4gPSBjbGFzc0Fyci5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xyXG4gICAgICAgIGlmIChjbGFzc0FycltpXS5pbmRleE9mKCdpdGVtLScpICE9PSAtMSkge1xyXG4gICAgICAgICAgICByZXR1cm4gY2xhc3NBcnJbaV0uc3BsaXQoJy0nKVsxXTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiAkZXhjaGFuZ2VQb3MoaXRlbTEsIGl0ZW0yKSB7XHJcbiAgICBsZXQgcG9zMSA9ICRnZXRQb3MoaXRlbTEuY2xhc3NOYW1lKTtcclxuICAgIGxldCBwb3MyID0gJGdldFBvcyhpdGVtMi5jbGFzc05hbWUpO1xyXG5cclxuICAgICRyZW1vdmVDbGFzcyhpdGVtMiwgYHBvcy0ke3BvczJ9YCk7XHJcbiAgICAkYWRkQ2xhc3MoaXRlbTIsIGBwb3MtJHtwb3MxfWApO1xyXG4gICAgJHJlbW92ZUNsYXNzKGl0ZW0xLCBgcG9zLSR7cG9zMX1gKTtcclxuICAgICRhZGRDbGFzcyhpdGVtMSwgYHBvcy0ke3BvczJ9YCk7XHJcbn1cclxuIl19
