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
        console.log("win!!!");
        var game = this;
        // let id = setTimeout( function(){
        game.running = false;
        game.imgContainer.className = 'win';
        game.isWin = true;
        // clearTimeout( id );
        // }, 200);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvdHMvYXN0YXIudHMiLCJzcmMvdHMvZ2FtZS50cyIsInNyYy90cy9oZWFwLnRzIiwic3JjL3RzL21haW4udHMiLCJzcmMvdHMvbm9kZS50cyIsInNyYy90cy91dGlsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOztBQ0FBLHFCQUFpQixRQUFRLENBQUMsQ0FBQTtBQUMxQixxQkFBaUIsUUFBUSxDQUFDLENBQUE7QUFHMUI7O0dBRUc7QUFDSDtJQVNFLGVBQWEsU0FBZSxFQUFFLFVBQWdCO1FBUDlDLGVBQVUsR0FBVyxFQUFFLENBQUE7UUFJZixpQkFBWSxHQUFhLEVBQUUsQ0FBQTtRQUMzQixhQUFRLEdBQVcsRUFBRSxDQUFBO1FBRzNCLElBQUksQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFDO1FBQzNCLElBQUksQ0FBQyxVQUFVLEdBQUcsVUFBVSxDQUFDO1FBQzdCLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxjQUFJLENBQUUsQ0FBRSxTQUFTLENBQUUsRUFBRSxHQUFHLENBQUUsQ0FBQztJQUNqRCxDQUFDO0lBRUQsa0JBQWtCO0lBQ2xCLGtCQUFrQjtJQUVsQjs7T0FFRztJQUNILG1CQUFHLEdBQUg7UUFDRSxJQUFJLEtBQUssR0FBRyxJQUFJLENBQUM7UUFDakI7WUFDRSxJQUFJLFdBQVcsR0FBRyxLQUFLLENBQUMsUUFBUSxDQUFDLEdBQUcsRUFBRSxDQUFDO1lBQ3ZDLEtBQUssQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFFLFdBQVcsQ0FBRSxDQUFDO1lBQ3JDLEtBQUssQ0FBQyxZQUFZLENBQUUsV0FBVyxDQUFDLFNBQVMsRUFBRSxDQUFFLEdBQUcsQ0FBQyxDQUFDO1lBRWxELElBQUksU0FBUyxHQUFHLFdBQVcsQ0FBQyxZQUFZLEVBQUUsQ0FBQztZQUUzQyxTQUFTLENBQUMsT0FBTyxDQUFDLFVBQVMsUUFBUTtnQkFDakMsSUFBSSxJQUFJLEdBQUcsV0FB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QUFDLENBQUMsQ0FBQztRQUNyQyxDQUFDO0lBQ0gsQ0FBQztBQUNILENBQUM7QUFQZSxpQkFBUyxZQU94QixDQUFBO0FBRUQsc0JBQThCLEtBQUssRUFBRSxLQUFLO0lBQ3hDLElBQUksSUFBSSxHQUFHLE9BQU8sQ0FBRSxLQUFLLENBQUMsU0FBUyxDQUFFLENBQUM7SUFDdEMsSUFBSSxJQUFJLEdBQUcsT0FBTyxDQUFFLEtBQUssQ0FBQyxTQUFTLENBQUUsQ0FBQztJQUV0QyxZQUFZLENBQUUsS0FBSyxFQUFFLFNBQU8sSUFBTSxDQUFFLENBQUM7SUFDckMsU0FBUyxDQUFFLEtBQUssRUFBRSxTQUFPLElBQU0sQ0FBRSxDQUFDO0lBQ2xDLFlBQVksQ0FBRSxLQUFLLEVBQUUsU0FBTyxJQUFNLENBQUUsQ0FBQztJQUNyQyxTQUFTLENBQUUsS0FBSyxFQUFFLFNBQU8sSUFBTSxDQUFFLENBQUM7QUFDcEMsQ0FBQztBQVJlLG9CQUFZLGVBUTNCLENBQUEiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiaW1wb3J0IE5vZGUgZnJvbSAnLi9ub2RlJztcclxuaW1wb3J0IEhlYXAgZnJvbSAnLi9oZWFwJztcclxuaW1wb3J0IHsgYmVsb25nVG8gfSBmcm9tICcuL3V0aWwnO1xyXG5cclxuLyoqXHJcbiAqIEEqIOeul+azlVxyXG4gKi9cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQXN0YXJ7XHJcbiAgb3Blbkxpc3Q6IEhlYXBcclxuICBjbG9zZWRMaXN0OiBOb2RlW10gPSBbXVxyXG4gIHN0YXJ0Tm9kZTogTm9kZVxyXG4gIHRhcmdldE5vZGU6IE5vZGVcclxuXHJcbiAgcHJpdmF0ZSBiX2Nsb3NlZExpc3Q6IGJlbG9uZ1RvID0ge31cclxuICBwcml2YXRlIHNvbHV0aW9uOiBOb2RlW10gPSBbXVxyXG5cclxuICBjb25zdHJ1Y3Rvciggc3RhcnROb2RlOiBOb2RlLCB0YXJnZXROb2RlOiBOb2RlICl7XHJcbiAgICB0aGlzLnN0YXJ0Tm9kZSA9IHN0YXJ0Tm9kZTtcclxuICAgIHRoaXMudGFyZ2V0Tm9kZSA9IHRhcmdldE5vZGU7XHJcbiAgICB0aGlzLm9wZW5MaXN0ID0gbmV3IEhlYXAoIFsgc3RhcnROb2RlIF0sIFwiRlwiICk7XHJcbiAgfVxyXG5cclxuICAvLyBwdWJsaWMgZnVuY3Rpb25cclxuICAvLyAtLS0tLS0tLS0tLS0tLS1cclxuXHJcbiAgLyoqXHJcbiAgICog6L+Q6KGMIEEqIOeul+azlVxyXG4gICAqL1xyXG4gIHJ1bigpe1xyXG4gICAgbGV0IGFzdGFyID0gdGhpcztcclxuICAgIHdoaWxlICggIU5vZGUuaXNTYW1lKCBhc3Rhci5vcGVuTGlzdC50b3AoKSwgYXN0YXIudGFyZ2V0Tm9kZSApICl7XHJcbiAgICAgIGxldCBjdXJyZW50Tm9kZSA9IGFzdGFyLm9wZW5MaXN0LnBvcCgpO1xyXG4gICAgICBhc3Rhci5jbG9zZWRMaXN0LnB1c2goIGN1cnJlbnROb2RlICk7XHJcbiAgICAgIGFzdGFyLmJfY2xvc2VkTGlzdFsgY3VycmVudE5vZGUuZ2V0VmFsU3RyKCkgXSA9IDE7XHJcblxyXG4gICAgICBsZXQgbmV4dE5vZGVzID0gY3VycmVudE5vZGUuZ2V0TmV4dE5vZGVzKCk7XHJcblxyXG4gICAgICBuZXh0Tm9kZXMuZm9yRWFjaChmdW5jdGlvbihuZXh0Tm9kZSl7XHJcbiAgICAgICAgbGV0IGNvc3QgPSBjdXJyZW50Tm9kZS5nZXRHKCkgKyBjdXJyZW50Tm9kZS5nZXRDb3N0VG9OZXh0KCk7XHJcbiAgICAgICAgbGV0IGluZGV4ID0gIGFzdGFyLm9wZW5MaXN0LmdldEl0ZW1JbmRleCggbmV4dE5vZGUgKTtcclxuXHJcbiAgICAgICAgaWYgKCBpbmRleCAhPT0gdW5kZWZpbmVkICYmIGNvc3QgPCBuZXh0Tm9kZS5nZXRHKCkgKXtcclxuICAgICAgICAgIGNvbnNvbGUubG9nKCBcIm5leHQgMVwiICk7XHJcbiAgICAgICAgICBhc3Rhci5vcGVuTGlzdC5yZW1vdmUoIGluZGV4ICk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoIGFzdGFyLmlzQmVsb25nVG9DbG9zZWQoIG5leHROb2RlICkgJiYgY29zdCA8IG5leHROb2RlLmdldEcoKSApe1xyXG4gICAgICAgICAgY29uc29sZS5sb2coIFwibmV4dCAyXCIgKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICggaW5kZXggPT09IHVuZGVmaW5lZCAmJiAhYXN0YXIuaXNCZWxvbmdUb0Nsb3NlZCggbmV4dE5vZGUgKSApe1xyXG4gICAgICAgICAgY29uc29sZS5sb2coIFwibmV4dCAzXCIgKTtcclxuICAgICAgICAgIG5leHROb2RlLnNldEcoIGNvc3QgKTtcclxuICAgICAgICAgIG5leHROb2RlLnNldEYoIG5leHROb2RlLmdldEcoKSArIG5leHROb2RlLmdldEgoIGFzdGFyLnRhcmdldE5vZGUgKSApO1xyXG4gICAgICAgICAgYXN0YXIub3Blbkxpc3QucHVzaCggbmV4dE5vZGUgKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgbGV0IHRhaWxOb2RlID0gYXN0YXIub3Blbkxpc3QudG9wKCk7XHJcbiAgICB0aGlzLnNvbHV0aW9uID0gW107XHJcbiAgICB3aGlsZSggdGFpbE5vZGUgKXtcclxuICAgICAgdGhpcy5zb2x1dGlvbi5wdXNoKCB0YWlsTm9kZSApO1xyXG4gICAgICB0YWlsTm9kZSA9IHRhaWxOb2RlLnBhcmVudDtcclxuICAgIH1cclxuICAgIC8vIHRoaXMuc2hvd1NvbHV0aW9uKCk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiDov5DooYwgQSog566X5rOVICgg54mI5pysIDIgKSDlrp7pqoznlKhcclxuICAgKi9cclxuICBydW4yKCl7XHJcbiAgICBsZXQgYXN0YXIgPSB0aGlzO1xyXG4gICAgd2hpbGUgKCAhTm9kZS5pc1NhbWUoIGFzdGFyLm9wZW5MaXN0LnRvcCgpLCBhc3Rhci50YXJnZXROb2RlICkgKXtcclxuICAgICAgbGV0IGN1cnJlbnROb2RlID0gYXN0YXIub3Blbkxpc3QucG9wKCk7XHJcbiAgICAgIGFzdGFyLmNsb3NlZExpc3QucHVzaCggY3VycmVudE5vZGUgKTtcclxuICAgICAgYXN0YXIuYl9jbG9zZWRMaXN0WyBjdXJyZW50Tm9kZS5nZXRWYWxTdHIoKSBdID0gMTtcclxuXHJcbiAgICAgIGxldCBuZXh0Tm9kZXMgPSBjdXJyZW50Tm9kZS5nZXROZXh0Tm9kZXMoKTtcclxuXHJcbiAgICAgIG5leHROb2Rlcy5mb3JFYWNoKGZ1bmN0aW9uKG5leHROb2RlKXtcclxuICAgICAgICBsZXQgY29zdCA9IGN1cnJlbnROb2RlLmdldEcoKSArIGN1cnJlbnROb2RlLmdldENvc3RUb05leHQoKTtcclxuICAgICAgICBsZXQgaW5kZXggPSAgYXN0YXIub3Blbkxpc3QuZ2V0SXRlbUluZGV4KCBuZXh0Tm9kZSApO1xyXG5cclxuICAgICAgICBpZiAoIGluZGV4ICE9PSB1bmRlZmluZWQgJiYgY29zdCA8IG5leHROb2RlLmdldEcoKSApe1xyXG4gICAgICAgICAgY29uc29sZS5sb2coIFwibmV4dCAxXCIgKTtcclxuICAgICAgICAgIGFzdGFyLm9wZW5MaXN0LnJlbW92ZSggaW5kZXggKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICggYXN0YXIuaXNCZWxvbmdUb0Nsb3NlZCggbmV4dE5vZGUgKSAmJiBjb3N0IDwgbmV4dE5vZGUuZ2V0RygpICl7XHJcbiAgICAgICAgICBjb25zb2xlLmxvZyggXCJuZXh0IDJcIiApO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKCBpbmRleCA9PT0gdW5kZWZpbmVkICYmICFhc3Rhci5pc0JlbG9uZ1RvQ2xvc2VkKCBuZXh0Tm9kZSApICl7XHJcbiAgICAgICAgICBjb25zb2xlLmxvZyggXCJuZXh0IDNcIiApO1xyXG4gICAgICAgICAgbmV4dE5vZGUuc2V0RyggY29zdCApO1xyXG4gICAgICAgICAgbmV4dE5vZGUuc2V0RiggbmV4dE5vZGUuZ2V0RygpICsgbmV4dE5vZGUuZ2V0SCggYXN0YXIudGFyZ2V0Tm9kZSApICk7XHJcbiAgICAgICAgICBhc3Rhci5vcGVuTGlzdC5wdXNoKCBuZXh0Tm9kZSApO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgbGV0IHRhaWxOb2RlID0gYXN0YXIub3Blbkxpc3QudG9wKCk7XHJcbiAgICB0aGlzLnNvbHV0aW9uID0gW107XHJcbiAgICB3aGlsZSggdGFpbE5vZGUgKXtcclxuICAgICAgdGhpcy5zb2x1dGlvbi5wdXNoKCB0YWlsTm9kZSApO1xyXG4gICAgICB0YWlsTm9kZSA9IHRhaWxOb2RlLnBhcmVudDtcclxuICAgIH1cclxuICAgIHRoaXMuc2hvd1NvbHV0aW9uKCk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiDojrflj5bop6PlhrPmlrnmoYjmlbDnu4RcclxuICAgKi9cclxuICBnZXRTb2x1dGlvbigpe1xyXG4gICAgcmV0dXJuIHRoaXMuc29sdXRpb247XHJcbiAgfVxyXG5cclxuICAvLyBwcml2YXRlIGZ1bmN0aW9uXHJcbiAgLy8gLS0tLS0tLS0tLS0tLS0tXHJcblxyXG4gIC8qKlxyXG4gICAqIOWIpOaWreiKgueCueaYr+WQpuWcqCBDTE9TRUQg5LitXHJcbiAgICovXHJcbiAgcHJpdmF0ZSBpc0JlbG9uZ1RvQ2xvc2VkKCBub2RlOiBOb2RlICl7XHJcbiAgICBsZXQgc3RyID0gbm9kZS5nZXRWYWxTdHIoKTtcclxuICAgIHJldHVybiAhIXRoaXMuYl9jbG9zZWRMaXN0W3N0cl07XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiDmmL7npLrop6PlhrPmlrnmoYjnmoTlhbfkvZPmraXpqqRcclxuICAgKi9cclxuICBwcml2YXRlIHNob3dTb2x1dGlvbigpe1xyXG4gICAgbGV0IGxlbiA9IHRoaXMuc29sdXRpb24ubGVuZ3RoLFxyXG4gICAgICAgIGkgPSBsZW4gLSAxLFxyXG4gICAgICAgIHNjYWxlID0gdGhpcy50YXJnZXROb2RlLnNjYWxlO1xyXG4gICAgZm9yICggOyBpID4gLTE7IGkgLS0gKXtcclxuICAgICAgY29uc29sZS5sb2coIGBTdGVwICR7IGxlbiAtIGkgfTogYCApO1xyXG4gICAgICBsZXQgaXRlbSA9IHRoaXMuc29sdXRpb25baV0uZ2V0VmFsU3RyKCkuc3BsaXQoJywnKTtcclxuICAgICAgZm9yICggbGV0IGogPSAwOyBqIDwgc2NhbGU7IGogKysgKXtcclxuICAgICAgICAgIGNvbnNvbGUubG9nKCBgfCAke2l0ZW1bIGoqc2NhbGUgXX0gJHtpdGVtWyBqKnNjYWxlICsgMSBdfSAke2l0ZW1bIGoqc2NhbGUgKyAyIF19IHxgICk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcbn1cclxuIiwiaW1wb3J0IE5vZGUgZnJvbSBcIi4vbm9kZVwiO1xyXG5pbXBvcnQgQXN0YXIgZnJvbSAnLi9hc3Rhcic7XHJcbmltcG9ydCB7ICRpZCwgJGNyZWF0ZUVsZSwgJHJlcGxhY2VDbGFzcywgJGdldFBvcywgJGdldEltZ0lkLCAkZXhjaGFuZ2VQb3MsIERJUkVDVElPTiB9IGZyb20gJy4vdXRpbCc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBHYW1le1xyXG4gIGN1cnJlbnROb2RlOiBOb2RlXHJcbiAgdGFyZ2V0Tm9kZTogTm9kZVxyXG4gIHNjYWxlOiBudW1iZXJcclxuICBydW5uaW5nOiBib29sZWFuID0gZmFsc2VcclxuICBpc1dpbjogYm9vbGVhbiA9IGZhbHNlXHJcblxyXG4gIHByaXZhdGUgZ2FtZUNvbnRhaW5lcklkOiBzdHJpbmdcclxuICBwcml2YXRlIGltZ0NvbnRhaW5lcklkID0gXCJpbWFnZVwiXHJcbiAgcHJpdmF0ZSBhY3Rpb25Db250YWluZXJJZCA9IFwiYWN0aW9uXCJcclxuICBwcml2YXRlIGluZm9JZCA9IFwiaW5mb1wiXHJcblxyXG4gIHByaXZhdGUgZ2FtZUNvbnRhaW5lclxyXG4gIHByaXZhdGUgaW1nQ29udGFpbmVyXHJcbiAgcHJpdmF0ZSBhY3Rpb25Db250YWluZXJcclxuICBwcml2YXRlIGluZm9Db250YWluZXJcclxuXHJcbiAgLy8g57yT5a2Y5omA5pyJ55qE5Zu+54mH54mH5q61IGRvbe+8jOWFjeW+l+WGjeaJvlxyXG4gIHByaXZhdGUgaW1nRWxlbWVudHMgPSBbXVxyXG4gIC8vIOe8k+WtmOepuueZveWbvueJh+eJh+autSBkb23vvIzlhY3lvpflho3mib5cclxuICBwcml2YXRlIGJsYW5rSW1nRWxlXHJcblxyXG4gIHByaXZhdGUgdGltZUluZm9FbGVcclxuICBwcml2YXRlIHN0ZXBJbmZvRWxlXHJcblxyXG4gIGNvbnN0cnVjdG9yKCBnYW1lQ29udGFpbmVySWQ6IHN0cmluZywgc2NhbGU6IG51bWJlciApe1xyXG4gICAgdGhpcy5jdXJyZW50Tm9kZSA9IG5ldyBOb2RlKCBzY2FsZSApO1xyXG4gICAgdGhpcy50YXJnZXROb2RlID0gbmV3IE5vZGUoIHNjYWxlICk7XHJcbiAgICB0aGlzLnNjYWxlID0gc2NhbGU7XHJcblxyXG4gICAgdGhpcy5nYW1lQ29udGFpbmVySWQgPSBnYW1lQ29udGFpbmVySWQ7XHJcblxyXG4gICAgdGhpcy5nYW1lQ29udGFpbmVyID0gJGlkKCB0aGlzLmdhbWVDb250YWluZXJJZCApO1xyXG4gICAgdGhpcy5pbWdDb250YWluZXIgPSAkY3JlYXRlRWxlKCAnZGl2JywgdGhpcy5pbWdDb250YWluZXJJZCApO1xyXG4gICAgdGhpcy5hY3Rpb25Db250YWluZXIgPSAkY3JlYXRlRWxlKCAnZGl2JywgdGhpcy5hY3Rpb25Db250YWluZXJJZCApO1xyXG4gICAgdGhpcy5pbmZvQ29udGFpbmVyID0gJGNyZWF0ZUVsZSggJ2RpdicsIHRoaXMuaW5mb0lkICk7XHJcblxyXG4gICAgdGhpcy5pbml0KCk7XHJcbiAgfVxyXG5cclxuICAvLyBwdWJsaWMgZnVuY3Rpb25cclxuICAvLyAtLS0tLS0tLS0tLS0tLS1cclxuXHJcbiAgLyoqXHJcbiAgICogbWl4IOaMiemSruaJp+ihjOWHveaVsFxyXG4gICAqIOa3t+WQiO+8jOeUsei1t+Wni+iKgueCueS5seW6j+W+l+WIsOS4gOS4quaWsOeahOiKgueCue+8jOW5tuagueaNruaWsOiKgueCueiuvue9rumhtemdouS4reeahOaYvuekuueKtuaAgVxyXG4gICAqL1xyXG4gIG1peCgpe1xyXG4gICAgY29uc29sZS5sb2coIFwicnVuaW5nID0gXCIsIHRoaXMucnVubmluZywgXCIgLS0gXCIsIFwiaXNXaW4gPSBcIiwgdGhpcy5pc1dpbiApO1xyXG4gICAgaWYgKCB0aGlzLnJ1bm5pbmcgfHwgdGhpcy5pc1dpbiApIHJldHVybjtcclxuICAgIHRoaXMuY3VycmVudE5vZGUuc2h1ZmZsZSgpO1xyXG4gICAgdGhpcy5zZXRTdGF0dXNCeU5vZGUoIHRoaXMuY3VycmVudE5vZGUgKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIHN0YXJ0IOaMiemSruaJp+ihjOWHveaVsFxyXG4gICAqIOaJp+ihjCBBKiDnrpfms5VcclxuICAgKi9cclxuICBzdGFydCgpe1xyXG4gICAgbGV0IGdhbWUgPSB0aGlzO1xyXG5cclxuICAgIGlmICggZ2FtZS5ydW5uaW5nICkgcmV0dXJuO1xyXG4gICAgZ2FtZS5ydW5uaW5nID0gdHJ1ZTtcclxuXHJcbiAgICBpZiAoIE5vZGUuaXNTYW1lKCB0aGlzLmN1cnJlbnROb2RlLCB0aGlzLnRhcmdldE5vZGUgKSApe1xyXG4gICAgICB0aGlzLndpbigpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgbGV0IGFzdGFyID0gbmV3IEFzdGFyKCB0aGlzLmN1cnJlbnROb2RlLCB0aGlzLnRhcmdldE5vZGUgKTtcclxuXHJcbiAgICAgIGNvbnNvbGUudGltZSggXCJBU3RhciBSdW4gIVwiICk7XHJcbiAgICAgIGxldCBzdGFydFRpbWUgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcclxuICAgICAgYXN0YXIucnVuKCk7XHJcbiAgICAgIGxldCBlbmRUaW1lID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XHJcbiAgICAgIGNvbnNvbGUudGltZUVuZCggXCJBU3RhciBSdW4gIVwiICk7XHJcbiAgICAgIGNvbnNvbGUubG9nKCBcIiBhc3RhciAtIFwiLCBhc3RhciApO1xyXG5cclxuICAgICAgZ2FtZS50aW1lSW5mb0VsZS5pbm5lckhUTUwgPSBgJHtlbmRUaW1lIC0gc3RhcnRUaW1lfSBtc2A7XHJcblxyXG4gICAgICBsZXQgc29sdXRpb24gPSBhc3Rhci5nZXRTb2x1dGlvbigpO1xyXG4gICAgICBpZiAoIHNvbHV0aW9uLmxlbmd0aCApICB7XHJcbiAgICAgICAgbGV0IGxlbiA9IHNvbHV0aW9uLmxlbmd0aCxcclxuICAgICAgICAgICAgaSA9IGxlbiAtIDE7XHJcblxyXG4gICAgICAgIGxldCBydW5JZCA9IHNldEludGVydmFsKCBmdW5jdGlvbigpe1xyXG4gICAgICAgICAgaWYgKCBpID09PSAtMSApe1xyXG4gICAgICAgICAgICBjbGVhckludGVydmFsKCBydW5JZCApO1xyXG4gICAgICAgICAgICBnYW1lLndpbigpO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgZ2FtZS5jdXJyZW50Tm9kZSA9IHNvbHV0aW9uW2ldO1xyXG4gICAgICAgICAgICBnYW1lLnNldFN0YXR1c0J5Tm9kZSggc29sdXRpb25baV0gKTtcclxuICAgICAgICAgICAgZ2FtZS5zdGVwSW5mb0VsZS5pbm5lckhUTUwgPSBgJHtsZW4gLSBpfVxcLyR7bGVufWA7XHJcbiAgICAgICAgICAgIGktLTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9LCAxODAgKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICog6LWi5b6X5ri45oiPXHJcbiAgICovXHJcbiAgd2luKCl7XHJcbiAgICBjb25zb2xlLmxvZyggXCJ3aW4hISFcIiApO1xyXG4gICAgbGV0IGdhbWUgPSB0aGlzO1xyXG4gICAgLy8gbGV0IGlkID0gc2V0VGltZW91dCggZnVuY3Rpb24oKXtcclxuICAgICAgZ2FtZS5ydW5uaW5nID0gZmFsc2U7XHJcbiAgICAgIGdhbWUuaW1nQ29udGFpbmVyLmNsYXNzTmFtZSA9ICd3aW4nO1xyXG4gICAgICBnYW1lLmlzV2luID0gdHJ1ZTtcclxuICAgICAgLy8gY2xlYXJUaW1lb3V0KCBpZCApO1xyXG4gICAgLy8gfSwgMjAwKTtcclxuICB9XHJcblxyXG4gIC8vIHByaXZhdGUgZnVuY3Rpb25cclxuICAvLyAtLS0tLS0tLS0tLS0tLS1cclxuXHJcbiAgLyoqXHJcbiAgICog5Yid5aeL5YyW5Ye95pWwXHJcbiAgICovXHJcbiAgcHJpdmF0ZSBpbml0KCl7XHJcbiAgICB0aGlzLmluaXRJbWFnZSgpO1xyXG4gICAgdGhpcy5pbml0T3BlcmF0aW9uKCk7XHJcbiAgICB0aGlzLmluaXRJbmZvKCk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiDmi7zlm77muLjmiI/nmoTlm77niYfmmL7npLrpg6jliIbnmoTliJ3lp4vljJZcclxuICAgKi9cclxuICBwcml2YXRlIGluaXRJbWFnZSgpe1xyXG4gICAgbGV0IGdhbWUgPSB0aGlzO1xyXG4gICAgLy8g6IqC54K555qE5pWw57uE6KGo56S65Lit55qE5q+P5LiA5Liq5pWw57uE55qE6aG55a+55bqU5LiA5Liq5qC85a2QXHJcbiAgICBmb3IgKCBsZXQgaSA9IE1hdGgucG93KCBnYW1lLnNjYWxlLCAyKSAtIDE7IGkgPiAtMTsgaSAtLSApe1xyXG4gICAgICAvLyDmoLflvI8gaXRlbS0qIOinhOWumuafkOS4gOagvOWtkOWvueW6lOeahOWbvueJh+eJh+aute+8jOi/memDqOWIhuWIneWni+WMluWQjuS4jeWGjeaUueWPmFxyXG4gICAgICAvLyDmoLflvI8gcG9zLSog6KeE5a6a5p+Q5LiA5qC85a2Q5ZyoICNpbWFnZSDlrrnlmajkuK3nmoTkvY3nva7vvIzov5npg6jliIbpmo/nnYDoioLngrnlj5jljJbogIzmlLnlj5hcclxuICAgICAgbGV0IGVsZSA9ICRjcmVhdGVFbGUoICdkaXYnLCB1bmRlZmluZWQsIGBpdGVtIGl0ZW0tJHtpfSBwb3MtJHtpfWAgKTtcclxuXHJcbiAgICAgIGVsZS5hZGRFdmVudExpc3RlbmVyKCAnY2xpY2snLCBmdW5jdGlvbihlKXsgZ2FtZS5pbWdGcmFnbWVudEhhbmRsZXIoZSkgfSApO1xyXG5cclxuICAgICAgLy8g5Yid5aeL5YyW55qE5pe26LCD5pW056m655m95qC86YOo5YiGKCDmoLflvI/kuLrvvJogLml0ZW0uaXRlbS0wLnBvcy0wICnnmoTkvY3nva5cclxuICAgICAgLy8g5ZCM5pe25bCG5Zu+54mH54mH5q6155qEIGRvbSDnvJPlrZhcclxuICAgICAgaWYgKCBpID09PSAwICl7XHJcbiAgICAgICAgZ2FtZS5pbWdDb250YWluZXIuYXBwZW5kQ2hpbGQoIGVsZSApO1xyXG4gICAgICAgIGdhbWUuaW1nRWxlbWVudHMucHVzaCggZWxlICk7XHJcbiAgICAgICAgZ2FtZS5ibGFua0ltZ0VsZSA9IGVsZTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBnYW1lLmltZ0NvbnRhaW5lci5pbnNlcnRCZWZvcmUoIGVsZSwgZ2FtZS5pbWdDb250YWluZXIuZmlyc3RDaGlsZCApO1xyXG4gICAgICAgIGdhbWUuaW1nRWxlbWVudHMudW5zaGlmdCggZWxlICk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIGdhbWUuZ2FtZUNvbnRhaW5lci5hcHBlbmRDaGlsZCggZ2FtZS5pbWdDb250YWluZXIgKTtcclxuXHJcbiAgICAvLyB3aW4g5pWI5p6c6YOo5YiGXHJcbiAgICB0aGlzLmltZ0NvbnRhaW5lci5hZGRFdmVudExpc3RlbmVyKCAnY2xpY2snLCBmdW5jdGlvbihlKXtcclxuICAgICAgaWYgKCB0aGlzID09PSBlLnRhcmdldCApIHtcclxuICAgICAgICB0aGlzLmNsYXNzTmFtZSA9ICcnO1xyXG4gICAgICAgIGdhbWUuaXNXaW4gPSBmYWxzZTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiDmi7zlm77nmoTmjInpkq7mk43kvZzpg6jliIbnmoTliJ3lp4vljJZcclxuICAgKi9cclxuICBwcml2YXRlIGluaXRPcGVyYXRpb24oKXtcclxuICAgIGxldCBnYW1lID0gdGhpcztcclxuICAgIC8vIOS4pOS4quaMiemSriBNSVgg5ZKMIFNUQVJUXHJcbiAgICBbXCJNSVhcIiwgXCJTVEFSVFwiXS5mb3JFYWNoKCBmdW5jdGlvbihpdGVtLCBpbmRleCwgYXJyYXkpe1xyXG4gICAgICBsZXQgZWxlID0gJGNyZWF0ZUVsZSggJ2J1dHRvbicsIHVuZGVmaW5lZCwgYGJ0biBidG4tJHtpdGVtLnRvTG93ZXJDYXNlKCl9YCApO1xyXG4gICAgICBlbGUuaW5uZXJIVE1MID0gaXRlbTtcclxuICAgICAgc3dpdGNoKCBpdGVtICl7XHJcbiAgICAgICAgY2FzZSAnTUlYJzpcclxuICAgICAgICAgIGVsZS5hZGRFdmVudExpc3RlbmVyKCAnY2xpY2snLCBnYW1lLm1peC5iaW5kKCBnYW1lICkgKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgJ1NUQVJUJzpcclxuICAgICAgICAgIGVsZS5hZGRFdmVudExpc3RlbmVyKCAnY2xpY2snLCBnYW1lLnN0YXJ0LmJpbmQoIGdhbWUgKSApO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgIH1cclxuICAgICAgZ2FtZS5hY3Rpb25Db250YWluZXIuYXBwZW5kQ2hpbGQoIGVsZSApO1xyXG4gICAgfSk7XHJcbiAgICBnYW1lLmdhbWVDb250YWluZXIuYXBwZW5kQ2hpbGQoIGdhbWUuYWN0aW9uQ29udGFpbmVyICk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiDmi7zlm77nmoTkv6Hmga/mmL7npLrpg6jliIbnmoTliJ3lp4vljJZcclxuICAgKi9cclxuICBwcml2YXRlIGluaXRJbmZvKCl7XHJcbiAgICBsZXQgZ2FtZSA9IHRoaXM7XHJcblxyXG4gICAgWyBcInRpbWVcIiwgXCJzdGVwXCIgXS5mb3JFYWNoKCBmdW5jdGlvbiggdmFsdWUgKXtcclxuICAgICAgbGV0IGRpdkVsZSA9ICRjcmVhdGVFbGUoICdkaXYnLCB1bmRlZmluZWQsICdpbmZvLWl0ZW0nICk7XHJcbiAgICAgIGxldCB0aXRsZSA9ICRjcmVhdGVFbGUoICdzcGFuJywgdW5kZWZpbmVkLCAndGl0bGUnICk7XHJcbiAgICAgIGxldCBjb250ZW50ID0gJGNyZWF0ZUVsZSggJ3NwYW4nICk7XHJcblxyXG4gICAgICB0aXRsZS5pbm5lckhUTUwgPSBgJHt2YWx1ZX06YDtcclxuICAgICAgY29udGVudC5pbm5lckhUTUwgPSAnMCc7XHJcbiAgICAgIGdhbWVbIGAke3ZhbHVlfUluZm9FbGVgIF0gPSBjb250ZW50O1xyXG5cclxuICAgICAgZGl2RWxlLmFwcGVuZENoaWxkKCB0aXRsZSApO1xyXG4gICAgICBkaXZFbGUuYXBwZW5kQ2hpbGQoIGNvbnRlbnQgKTtcclxuICAgICAgZ2FtZS5pbmZvQ29udGFpbmVyLmFwcGVuZENoaWxkKCBkaXZFbGUgKTtcclxuICAgIH0pXHJcbiAgICBnYW1lLmdhbWVDb250YWluZXIuYXBwZW5kQ2hpbGQoIGdhbWUuaW5mb0NvbnRhaW5lciApO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICog5qC55o2u6IqC54K555qE5pWw57uE6KGo56S65p2l6K6+572u5Zu+54mH54mH5q6155qE5L2N572uXHJcbiAgICovXHJcbiAgcHJpdmF0ZSBzZXRTdGF0dXNCeU5vZGUoIG5vZGU6IE5vZGUgKXtcclxuICAgIC8vIGxldCBpbWdFbGVtZW50cyA9IHRoaXMuaW1nQ29udGFpbmVyLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJpdGVtXCIpO1xyXG4gICAgZm9yICggbGV0IGsgPSAwLCBsZW4gPSBub2RlLnZhbHVlLmxlbmd0aDsgayA8IGxlbjsgayArKyApe1xyXG4gICAgICBsZXQgcG9zID0gKCBrID09PSBsZW4gLSAxICkgPyAwIDogayArIDE7O1xyXG4gICAgICBsZXQgdiA9ICggbm9kZS52YWx1ZVtrXSA9PT0gMCApID8gbGVuIDogbm9kZS52YWx1ZVtrXTtcclxuICAgICAgJHJlcGxhY2VDbGFzcyggdGhpcy5pbWdFbGVtZW50c1t2IC0gMV0sIGBwb3MtJHtwb3N9YCwgJ3BvcycgKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIOWbvueJh+eJh+auteS4iueahCBjbGljayDkuovku7blpITnkIblh73mlbDvvIznlKjmnaXnp7vliqjlm77niYfniYfmrrVcclxuICAgKi9cclxuICBwcml2YXRlIGltZ0ZyYWdtZW50SGFuZGxlcihlKXtcclxuICAgIGxldCBpbWdJZCA9ICRnZXRJbWdJZCggZS50YXJnZXQuY2xhc3NOYW1lICk7XHJcbiAgICBsZXQgbm9uWmVyb0RpciA9IHRoaXMuY3VycmVudE5vZGUuZ2V0Tm9uWmVyb0RpcmVjdGlvbigpO1xyXG4gICAgaWYgKCBub25aZXJvRGlyW2ltZ0lkXSApe1xyXG4gICAgICBsZXQgZGlyZWN0aW9uID0gRElSRUNUSU9OWyBgJHtub25aZXJvRGlyWyBpbWdJZCBdfWAgXTtcclxuICAgICAgdGhpcy5jdXJyZW50Tm9kZS5tb3ZlVG8oIGRpcmVjdGlvbiApO1xyXG4gICAgICAkZXhjaGFuZ2VQb3MoIHRoaXMuYmxhbmtJbWdFbGUsIGUudGFyZ2V0ICk7XHJcblxyXG4gICAgICBpZiAoIE5vZGUuaXNTYW1lKCB0aGlzLmN1cnJlbnROb2RlLCB0aGlzLnRhcmdldE5vZGUgKSApIHRoaXMud2luKCk7XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcbiIsImltcG9ydCBOb2RlIGZyb20gJy4vbm9kZSc7XHJcbmltcG9ydCB7IGJlbG9uZ1RvIH0gZnJvbSAnLi91dGlsJztcclxuLy8gSGVhcCBPbiBUb3BcclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgSGVhcHtcclxuICBoZWFwOiBOb2RlW10gPSBbXVxyXG4gIGJfaGVhcDogYmVsb25nVG8gPSB7fVxyXG4gIGtleTogc3RyaW5nXHJcbiAgY29uc3RydWN0b3IoIG5vZGVMaXN0OiBOb2RlW10sIGtleTogc3RyaW5nICl7XHJcbiAgICB0aGlzLmtleSA9IGtleTtcclxuICAgIC8vIOeUqOS+neasoeaPkuWFpeeahOaWueW8j+aehOmAoOWIneWni+eahOWwj+mhtuWghlxyXG4gICAgbGV0IGkgPSAwLFxyXG4gICAgICAgIGxlbiA9IG5vZGVMaXN0Lmxlbmd0aDtcclxuICAgIGZvciAoIDsgaSA8IGxlbjsgaSArKyApe1xyXG4gICAgICB0aGlzLnB1c2goIG5vZGVMaXN0W2ldICk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvLyBwdWJsaWMgZnVuY3Rpb25cclxuICAvLyAtLS0tLS0tLS0tLS0tLS1cclxuXHJcbiAgLyoqXHJcbiAgICog6I635Y+W5aCG5Lit5LiL5qCH5Li6IGluZGV4IOeahOWAvFxyXG4gICAqL1xyXG4gIGdldCggaW5kZXg6IG51bWJlciApe1xyXG4gICAgaWYgKCBpbmRleCA+PSAwICYmIGluZGV4IDwgdGhpcy5oZWFwLmxlbmd0aCApe1xyXG4gICAgICByZXR1cm4gdGhpcy5oZWFwWyBpbmRleCBdWyB0aGlzLmtleSBdO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICog5ZCR5aCG5Lit5o+S5YWl5LiA5Liq5paw55qE5YWD57Sg5bm26LCD5pW05aCGXHJcbiAgICog5paw5YWD57Sg5LuO5pWw57uE5bC+6YOo5o+S5YWl77yM54S25ZCO5a+55paw5YWD57Sg5omn6KGM5LiK5rWu6LCD5pW0XHJcbiAgICovXHJcbiAgcHVzaCggbm9kZTogTm9kZSApe1xyXG4gICAgdGhpcy5oZWFwLnB1c2goIG5vZGUgKTtcclxuICAgIHRoaXMuc2V0QkhlYXAoIHRoaXMuaGVhcC5sZW5ndGggLSAxICk7XHJcbiAgICB0aGlzLmdvVXAoIHRoaXMuaGVhcC5sZW5ndGggLSAxICk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiDliKDpmaTlubbov5Tlm57loIbpobblhYPntKDlubbosIPmlbTloIZcclxuICAgKiDlhYjlsIbloIbpobblhYPntKDkuI7mlbDnu4TmnKvlsL7lhYPntKDkupLmjaLvvIznhLblkI7lvLnlh7rmlbDnu4TmnKvlsL7nmoTlhYPntKDvvIzmnIDlkI7lr7nloIbpobblhYPntKDmiafooYzkuIvmsonmk43kvZxcclxuICAgKi9cclxuICBwb3AoKXtcclxuICAgIGlmICggdGhpcy5pc0VtcHR5KCkgKSByZXR1cm47XHJcbiAgICBsZXQgcmVzdWx0O1xyXG4gICAgdGhpcy5zd2FwKCAwLCB0aGlzLmhlYXAubGVuZ3RoIC0gMSApO1xyXG4gICAgcmVzdWx0ID0gdGhpcy5oZWFwLnBvcCgpO1xyXG4gICAgdGhpcy5yZW1vdmVCSGVhcCggcmVzdWx0LmdldFZhbFN0cigpICk7XHJcbiAgICAhdGhpcy5pc0VtcHR5KCkgJiYgdGhpcy5nb0Rvd24oMCk7XHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICog56e76Zmk5aCG5Lit5LiL5qCH5Li6IGluZGV4IOeahOWFg+e0oFxyXG4gICAqIOWwhumcgOenu+mZpOeahOmhueS4juWghumhtuS6kuaNou+8jOeEtuWQjuW8ueWHuuWghumhtu+8jOacgOWQjuWvueS6kuaNoumhue+8iOWOn+Wghumhtu+8ieaJp+ihjOS4iua1ruaTjeS9nFxyXG4gICAqL1xyXG4gIHJlbW92ZSggaW5kZXg6IG51bWJlciApe1xyXG4gICAgaWYoIGluZGV4IDwgMCB8fCBpbmRleCA+PSB0aGlzLmhlYXAubGVuZ3RoICkgcmV0dXJuO1xyXG4gICAgdGhpcy5zd2FwKCAwLCBpbmRleCApO1xyXG4gICAgdGhpcy5wb3AoKTtcclxuICAgIHRoaXMuZ29VcCggaW5kZXggKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIOiOt+WPluWghumhtuWFg+e0oFxyXG4gICAqL1xyXG4gIHRvcCgpe1xyXG4gICAgcmV0dXJuIHRoaXMuaGVhcC5sZW5ndGggJiYgdGhpcy5oZWFwWzBdO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICog5Yik5pat5aCG5piv5ZCm5Li656m6XHJcbiAgICovXHJcbiAgaXNFbXB0eSgpe1xyXG4gICAgcmV0dXJuICF0aGlzLmhlYXAubGVuZ3RoO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICog5Yik5pat5aCG5Lit5piv5ZCm5pyJ5YWD57SgIG5vZGVcclxuICAgKi9cclxuICBnZXRJdGVtSW5kZXgoIG5vZGU6IE5vZGUgKXtcclxuICAgIHJldHVybiB0aGlzLmJfaGVhcFsgbm9kZS5nZXRWYWxTdHIoKSBdO1xyXG4gIH1cclxuXHJcbiAgLy8gcHJpdmF0ZSBmdW5jdGlvblxyXG4gIC8vIC0tLS0tLS0tLS0tLS0tLVxyXG5cclxuICAvKipcclxuICAgKiDov5Tlm57loIbkuK3kuIvmoIfkuLogaW5kZXgg55qE5YWD57SgXHJcbiAgICovXHJcbiAgcHJpdmF0ZSBnZXRWYWx1ZSggaW5kZXg6IG51bWJlciApe1xyXG4gICAgaWYoIGluZGV4IDwgMCB8fCBpbmRleCA+PSB0aGlzLmhlYXAubGVuZ3RoICkgcmV0dXJuO1xyXG4gICAgcmV0dXJuIHRoaXMuaGVhcFtpbmRleF1bdGhpcy5rZXldO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICog5aCG5Lit5LiL5qCH5Li6IGluZGV4IOeahOWFg+e0oOeahOS4iua1ruaTjeS9nFxyXG4gICAqL1xyXG4gIHByaXZhdGUgZ29VcChpbmRleDogbnVtYmVyKXtcclxuICAgIGxldCB2YWx1ZSA9IHRoaXMuZ2V0VmFsdWUoaW5kZXgpLFxyXG4gICAgICAgIHBhcmVudCA9IHRoaXMuZ2V0UGFyZW50SW5kZXgoaW5kZXgpO1xyXG5cclxuICAgIGlmICggcGFyZW50ID09PSB1bmRlZmluZWQgKSByZXR1cm47XHJcblxyXG4gICAgaWYgKCB0aGlzLmdldFZhbHVlKCBwYXJlbnQgKSA+IHRoaXMuZ2V0VmFsdWUoIGluZGV4ICkgKXtcclxuICAgICAgdGhpcy5zd2FwKCBpbmRleCwgcGFyZW50ICk7XHJcbiAgICAgIHRoaXMuZ29VcCggcGFyZW50ICk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiDloIbkuK3kuIvmoIfkuLogaW5kZXgg55qE5YWD57Sg55qE5LiL5rKJ5pON5L2cXHJcbiAgICovXHJcbiAgcHJpdmF0ZSBnb0Rvd24oaW5kZXg6IG51bWJlcil7XHJcbiAgICBsZXQgdmFsdWUgPSB0aGlzLmdldFZhbHVlKGluZGV4KSxcclxuICAgICAgICBbbGVmdCwgcmlnaHRdID0gdGhpcy5nZXRDaGlsZEluZGV4KGluZGV4KSxcclxuICAgICAgICBzd2FwSW5kZXggPSBsZWZ0O1xyXG5cclxuICAgIC8vIOWFg+e0oOaYr+WPtuWtkOiKgueCue+8jOayoeacieWtkOWFg+e0oFxyXG4gICAgaWYgKCBsZWZ0ID09PSBudWxsICkgcmV0dXJuO1xyXG5cclxuICAgIC8vIOiLpeWFg+e0oOacieS4pOS4quWtkOWFg+e0oO+8jOiuvue9riBzd2FwSW5kZXgg5Li66L6D5bCP55qE6YKj5Liq5a2Q5YWD57Sg55qE5LiL5qCHXHJcbiAgICAvLyDoi6XlhYPntKDlj6rmnInlt6blhL/lrZDvvIxzd2FwSW5kZXgg5bey57uP6KKr5Yid5aeL5YyW5Li6IGxlZnQg55qE5YC85LqGXHJcbiAgICBpZiAoIHJpZ2h0ICl7XHJcbiAgICAgIHN3YXBJbmRleCA9IHRoaXMuZ2V0VmFsdWUobGVmdCkgPCB0aGlzLmdldFZhbHVlKHJpZ2h0KSA/IGxlZnQgOiByaWdodDtcclxuICAgIH1cclxuXHJcbiAgICAvLyDmr5TovoPniLblhYPntKDlkozovoPlsI/nmoTpgqPkuKrlrZDlhYPntKDnmoTlgLzvvIzoi6XniLblhYPntKDnmoTlgLzovoPlpKfvvIzliJnnva7mjaLniLblhYPntKDlkozovoPlsI/nmoTlrZDlhYPntKBcclxuICAgIC8vIOeEtuWQjuWcqOaWsOeahOe9ruaNoueahOS9jee9ruWkhOe7p+e7reaJp+ihjOS4i+ayieaTjeS9nFxyXG4gICAgaWYgKCB0aGlzLmdldFZhbHVlKHN3YXBJbmRleCkgPCB2YWx1ZSApIHtcclxuICAgICAgdGhpcy5zd2FwKCBpbmRleCwgc3dhcEluZGV4ICk7XHJcbiAgICAgIHRoaXMuZ29Eb3duKCBzd2FwSW5kZXggKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIOiOt+WPluS4i+agh+S4uiBpbmRleCDnmoTlhYPntKDlnKjloIbkuK3nmoTniLblhYPntKBcclxuICAgKi9cclxuICBwcml2YXRlIGdldFBhcmVudEluZGV4KCBpbmRleDogbnVtYmVyICl7XHJcbiAgICBpZiAoIGluZGV4IDwgMCB8fCBpbmRleCA+PSB0aGlzLmhlYXAubGVuZ3RoICkgcmV0dXJuO1xyXG4gICAgaWYgKCBpbmRleCA9PT0gMCApIHJldHVybiAwO1xyXG4gICAgcmV0dXJuIE1hdGguZmxvb3IoIChpbmRleC0xKS8yICk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiDojrflj5bkuIvmoIfkuLogaW5kZXgg55qE5YWD57Sg5Zyo5aCG5Lit55qE5a2Q5YWD57Sg77yM57y65aSx55qE5a2Q5YWD57Sg55SoIG51bGwg5Luj5pu/XHJcbiAgICovXHJcbiAgcHJpdmF0ZSBnZXRDaGlsZEluZGV4KCBpbmRleDogbnVtYmVyICl7XHJcbiAgICBsZXQgbGVmdCA9IDIqaW5kZXggKyAxLFxyXG4gICAgICAgIHJpZ2h0ID0gMippbmRleCArIDIsXHJcbiAgICAgICAgbGVuZ3RoID0gdGhpcy5oZWFwLmxlbmd0aDtcclxuXHJcbiAgICBpZiAoIHJpZ2h0IDw9IGxlbmd0aCAtIDEgKXtcclxuICAgICAgcmV0dXJuIFsgbGVmdCwgcmlnaHQgXTtcclxuICAgIH0gZWxzZSBpZiAoIGxlZnQgPT09IGxlbmd0aCAtIDEgKSB7XHJcbiAgICAgIHJldHVybiBbIGxlZnQsIG51bGwgXTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHJldHVybiBbIG51bGwsIG51bGwgXTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIOS6pOaNouWghuS4reS4i+agh+WIhuWIq+S4uiBpbmRleDEg5ZKMIGluZGV4MiDnmoTkuKTkuKrlhYPntKBcclxuICAgKi9cclxuICBwcml2YXRlIHN3YXAoIGluZGV4MTogbnVtYmVyLCBpbmRleDI6IG51bWJlciApe1xyXG4gICAgbGV0IHRtcCA9IHRoaXMuaGVhcFtpbmRleDFdO1xyXG4gICAgdGhpcy5oZWFwW2luZGV4MV0gPSB0aGlzLmhlYXBbaW5kZXgyXTtcclxuICAgIHRoaXMuaGVhcFtpbmRleDJdID0gdG1wO1xyXG5cclxuICAgIHRoaXMuc2V0QkhlYXAoIGluZGV4MSApO1xyXG4gICAgdGhpcy5zZXRCSGVhcCggaW5kZXgyICk7XHJcbiAgfVxyXG4gIHByaXZhdGUgc2V0QkhlYXAoIGluZGV4OiBudW1iZXIgKXtcclxuICAgIHRoaXMuYl9oZWFwWyB0aGlzLmhlYXBbIGluZGV4IF0uZ2V0VmFsU3RyKCkgXSA9IGluZGV4O1xyXG4gIH1cclxuICBwcml2YXRlIHJlbW92ZUJIZWFwKCBzdHI6IHN0cmluZyApe1xyXG4gICAgZGVsZXRlIHRoaXMuYl9oZWFwWyBzdHIgXTtcclxuICB9XHJcbn1cclxuIiwiaW1wb3J0IEdhbWUgZnJvbSBcIi4vZ2FtZVwiO1xyXG5sZXQgZ2FtZSA9IG5ldyBHYW1lKCBcImNvbnRhaW5lclwiLCAzICk7XHJcbi8vIGxldCBnYW1lID0gbmV3IEdhbWUoIFwiY29udGFpbmVyXCIsIDUgKTtcclxuXHJcbmNvbnNvbGUubG9nKCBnYW1lICk7XHJcbmNvbnNvbGUubG9nKCBcIi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVwiICk7XHJcbiIsImltcG9ydCB7IERJUkVDVElPTiB9IGZyb20gJy4vdXRpbCc7XHJcblxyXG4vLyBMRVQgRElSRUNUSU9OID0gWyAnTk9ORScsICdVUCcsICdSSUdIVCcsICdET1dOJywgJ0xFRlQnIF07XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBOb2Rle1xyXG4gIHZhbHVlOiBudW1iZXJbXVxyXG4gIHplcm9JbmRleDogbnVtYmVyXHJcbiAgc2NhbGU6IG51bWJlclxyXG4gIHBhcmVudDogTm9kZVxyXG4gIEY6IG51bWJlciA9IDBcclxuICBHOiBudW1iZXIgPSAwXHJcbiAgY29uc3RydWN0b3IoIHNjYWxlOiBudW1iZXIsIGluaXRBcnI/OiBudW1iZXJbXSApIHtcclxuICAgIHRoaXMuc2NhbGUgPSBzY2FsZTtcclxuICAgIHRoaXMudmFsdWUgPSBpbml0QXJyID8gaW5pdEFyciA6IHRoaXMuaW5pdE5vZGVWYWx1ZUJ5U2NhbGUoIHNjYWxlICk7XHJcbiAgICB0aGlzLnplcm9JbmRleCA9IE1hdGgucG93KHNjYWxlLCAyKSAtIDE7XHJcblxyXG4gICAgLy8gdGhpcy5wYXJlbnQgPSBuZXcgTm9kZSh0aGlzLnNjYWxlKTtcclxuICB9XHJcblxyXG4gIC8vIHB1YmxpYyBmdW5jdGlvblxyXG4gIC8vIC0tLS0tLS0tLS0tLS0tLVxyXG5cclxuICAvKipcclxuICAgKiDojrflj5boioLngrnnmoTlgLzvvIzlsIboioLngrnnmoTmlbDnu4TooajnpLrovazmjaLmiJDlrZfnrKbkuLLooajnpLrlubbov5Tlm55cclxuICAgKi9cclxuICBnZXRWYWxTdHIoKXtcclxuICAgIHJldHVybiB0aGlzLnZhbHVlLnRvU3RyaW5nKCk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiDoioLngrnnmoTkubHluo/nrpfms5VcclxuICAgKiDpmo/mnLrmjIflrprkuIDkuKrmlrnlkJHvvIzku6ToioLngrnlkJHor6XmlrnlkJHnp7vliqjvvIzph43lpI3kuIrov7Dov4fnqIvoi6XlubLmrKHovr7liLDkubHluo/nmoTnm67nmoRcclxuICAgKi9cclxuICBzaHVmZmxlKCl7XHJcbiAgICBmb3IoIGxldCBpID0gMDsgaSA8IDUwMDA7IGkgKysgKXtcclxuICAgICAgbGV0IGRpcmVjdGlvbiA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDQgKyAxKTtcclxuICAgICAgdGhpcy5tb3ZlVG8oIGRpcmVjdGlvbiApO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICog5b2T5YmN6IqC54K55ZCR5pa55ZCRIGRpcmVjdGlvbiDnp7vliqjkuIDmrKFcclxuICAgKiDlhbblrp7mmK/oioLngrnnmoTmlbDnu4TooajnpLrkuK3nmoTmlbDlrZcgMCDlkJHmlrnlkJEgZGlyZWN0aW9uIOenu+WKqOS4gOasoVxyXG4gICAqL1xyXG4gIG1vdmVUbyggZGlyZWN0aW9uOiBudW1iZXIgKXtcclxuICAgIGlmICggIXRoaXMuY2FuTW92ZVRvKCBkaXJlY3Rpb24gKSApIHJldHVybjtcclxuICAgIGxldCB0YXJnZXRJbmRleCA9IHRoaXMuZ2V0VGFyZ2V0SW5kZXgoIGRpcmVjdGlvbiApO1xyXG5cclxuICAgIHRoaXMudmFsdWVbIHRoaXMuemVyb0luZGV4IF0gPSB0aGlzLnZhbHVlWyB0YXJnZXRJbmRleCBdO1xyXG4gICAgdGhpcy52YWx1ZVsgdGFyZ2V0SW5kZXggXSA9IDA7XHJcbiAgICB0aGlzLnplcm9JbmRleCA9IHRhcmdldEluZGV4O1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICog6I635Y+W5b2T5YmN6IqC54K555qE5Y+v6IO956e75Yqo5pa55ZCR77yI55SoIDAg5L2N55qE56e75Yqo6L+b6KGM6KGo56S677yJXHJcbiAgICovXHJcbiAgZ2V0WmVyb0RpcmVjdGlvbigpe1xyXG4gICAgbGV0IG5vZGUgPSB0aGlzO1xyXG4gICAgbGV0IERpcmVjdGlvbiA9IHt9O1xyXG4gICAgWyBcIlVQXCIsIFwiUklHSFRcIiwgXCJET1dOXCIsIFwiTEVGVFwiIF0uZm9yRWFjaCggZnVuY3Rpb24oZGlyKXtcclxuICAgICAgbGV0IF9kaXIgPSBESVJFQ1RJT05bZGlyXTtcclxuICAgICAgaWYgKCBub2RlLmNhbk1vdmVUbyggX2RpciApICl7XHJcbiAgICAgICAgbGV0IHRhcmdldEluZGV4ID0gbm9kZS5nZXRUYXJnZXRJbmRleCggX2RpciApO1xyXG4gICAgICAgIERpcmVjdGlvblsgZGlyIF0gPSBgJHtub2RlLnZhbHVlWyB0YXJnZXRJbmRleCBdfWA7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gICAgcmV0dXJuIERpcmVjdGlvbjtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIOWwhuW9k+WJjeiKgueCueeahOWPr+iDveenu+WKqOaWueWQkeeUseeUqCAwIOS9jeeahOenu+WKqOadpeihqOekuui9rOaNouaIkOeUqCAwIOS9jemCu+aOpeeahOmdniAwIOaVsOWtl+eahOenu+WKqOadpei/m+ihjOihqOekulxyXG4gICAqL1xyXG4gIGdldE5vblplcm9EaXJlY3Rpb24oKXtcclxuICAgIGxldCBEaXJlY3Rpb24gPSB7fTtcclxuICAgIGxldCB6ZXJvRGlyID0gdGhpcy5nZXRaZXJvRGlyZWN0aW9uKCk7XHJcbiAgICBmb3IgKCBsZXQgdmFsIGluIHplcm9EaXIgKXtcclxuICAgICAgLy8gbGV0IF92YWw7XHJcbiAgICAgIC8vIHN3aXRjaCggdmFsICl7XHJcbiAgICAgIC8vICAgY2FzZSBcIlVQXCI6XHJcbiAgICAgIC8vICAgICBfdmFsID0gXCJET1dOXCI7XHJcbiAgICAgIC8vICAgICBicmVhaztcclxuICAgICAgLy8gICBjYXNlIFwiUklHSFRcIjpcclxuICAgICAgLy8gICAgIF92YWwgPSBcIkxFRlRcIjtcclxuICAgICAgLy8gICAgIGJyZWFrO1xyXG4gICAgICAvLyAgIGNhc2UgXCJET1dOXCI6XHJcbiAgICAgIC8vICAgICBfdmFsID0gXCJVUFwiO1xyXG4gICAgICAvLyAgICAgYnJlYWs7XHJcbiAgICAgIC8vICAgY2FzZSBcIkxFRlRcIjpcclxuICAgICAgLy8gICAgIF92YWwgPSBcIlJJR0hUXCI7XHJcbiAgICAgIC8vICAgICBicmVhaztcclxuICAgICAgLy8gfVxyXG4gICAgICAvLyBEaXJlY3Rpb25bIHplcm9EaXJbIHZhbCBdIF0gPSBfdmFsO1xyXG5cclxuICAgICAgRGlyZWN0aW9uWyB6ZXJvRGlyWyB2YWwgXSBdID0gdmFsO1xyXG4gICAgfVxyXG4gICAgY29uc29sZS5sb2coIERpcmVjdGlvbiApO1xyXG4gICAgcmV0dXJuIERpcmVjdGlvbjtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIOiOt+WPluW9k+WJjeiKgueCueWcqOWPr+enu+WKqOaWueWQkeS4iueahOWtkOiKgueCueaVsOe7hFxyXG4gICAqL1xyXG4gIGdldE5leHROb2Rlcygpe1xyXG4gICAgbGV0IG5vZGUgPSB0aGlzO1xyXG4gICAgbGV0IG5leHROb2RlczogTm9kZVtdID0gW107XHJcbiAgICBbIERJUkVDVElPTi5VUCwgRElSRUNUSU9OLlJJR0hULCBESVJFQ1RJT04uRE9XTiwgRElSRUNUSU9OLkxFRlQgXS5mb3JFYWNoKCBmdW5jdGlvbihkaXJlY3Rpb24pe1xyXG4gICAgICBpZiAoIG5vZGUuY2FuTW92ZVRvKCBkaXJlY3Rpb24gKSApe1xyXG4gICAgICAgIGxldCBuZXdOb2RlID0gTm9kZS5ub2RlQ2xvbmUoIG5vZGUgKTtcclxuICAgICAgICBuZXdOb2RlLnBhcmVudCA9IG5vZGU7XHJcbiAgICAgICAgbmV3Tm9kZS5tb3ZlVG8oZGlyZWN0aW9uKTtcclxuICAgICAgICBuZXh0Tm9kZXMucHVzaCggbmV3Tm9kZSApO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICAgIHJldHVybiBuZXh0Tm9kZXM7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiDliKTmlq3lvZPliY3oioLngrnvvIjoioLngrnkuK3nmoQgMCDkvY3vvInmmK/lkKblj6/ku6Xmsr8gZGlyZWN0aW9uIOaWueWQkeenu+WKqFxyXG4gICAqL1xyXG4gIGNhbk1vdmVUbyggZGlyZWN0aW9uOiBudW1iZXIgKXtcclxuICAgIGxldCByb3cgPSBNYXRoLmZsb29yKCB0aGlzLnplcm9JbmRleCAvIHRoaXMuc2NhbGUgKTtcclxuICAgIGxldCBjb2wgPSB0aGlzLnplcm9JbmRleCAlIHRoaXMuc2NhbGU7XHJcblxyXG4gICAgc3dpdGNoKCBkaXJlY3Rpb24gKXtcclxuICAgICAgY2FzZSBESVJFQ1RJT04uVVA6XHJcbiAgICAgICAgcmV0dXJuIHJvdyAhPT0gMDtcclxuICAgICAgY2FzZSBESVJFQ1RJT04uUklHSFQ6XHJcbiAgICAgICAgcmV0dXJuIGNvbCAhPT0gdGhpcy5zY2FsZSAtIDE7XHJcbiAgICAgIGNhc2UgRElSRUNUSU9OLkRPV046XHJcbiAgICAgICAgcmV0dXJuIHJvdyAhPT0gdGhpcy5zY2FsZSAtIDE7XHJcbiAgICAgIGNhc2UgRElSRUNUSU9OLkxFRlQ6XHJcbiAgICAgICAgcmV0dXJuIGNvbCAhPT0gMDtcclxuICAgICAgZGVmYXVsdDpcclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiDojrflj5bku47lvZPliY3oioLngrnotbDliLDkuIvkuIDkuKroioLngrnnmoTku6Pku7dcclxuICAgKi9cclxuICBnZXRDb3N0VG9OZXh0KCl7XHJcbiAgICByZXR1cm4gMTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIOiuvue9ruiKgueCueeahCBGIOWAvO+8jOWghuS8muagueaNrui/meS4quWAvOi/m+ihjOaOkuW6j1xyXG4gICAqL1xyXG4gIHNldEYoIHZhbHVlOiBudW1iZXIgKXtcclxuICAgIHRoaXMuRiA9IHZhbHVlO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICog6I635Y+W6IqC54K555qEIEcg5YC8XHJcbiAgICovXHJcbiAgZ2V0Rygpe1xyXG4gICAgcmV0dXJuIHRoaXMuRztcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIOiuvue9ruiKgueCueeahCBHIOWAvFxyXG4gICAqL1xyXG4gIHNldEcoIHZhbHVlOiBudW1iZXIgKXtcclxuICAgIHRoaXMuRyA9IHZhbHVlO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICog6I635Y+W6IqC54K555qEIEgg5YC8XHJcbiAgICovXHJcbiAgZ2V0SCggdGFyZ2V0Tm9kZTogTm9kZSApe1xyXG4gICAgbGV0IGkgPSAwLFxyXG4gICAgICAgIGxlbiA9IHRoaXMudmFsdWUubGVuZ3RoLFxyXG4gICAgICAgIG1hbmhhdHRlbiA9IDAsXHJcbiAgICAgICAgZGlmZiA9IDA7XHJcblxyXG4gICAgZm9yICggOyBpIDwgbGVuOyBpICsrICl7XHJcbiAgICAgIGlmICggdGhpcy52YWx1ZVtpXSAhPT0gaSArIDEgKSBkaWZmICsrO1xyXG5cclxuICAgICAgbGV0IHYgPSB0aGlzLnZhbHVlW2ldO1xyXG4gICAgICBpZiggdiAhPT0gMCApe1xyXG4gICAgICAgIC8vIG5vdyBpblxyXG4gICAgICAgIGxldCByb3cgPSBNYXRoLmZsb29yKCBpL3RoaXMuc2NhbGUgKTtcclxuICAgICAgICBsZXQgY29sID0gaSV0aGlzLnNjYWxlO1xyXG4gICAgICAgIC8vIHNob3VsZCBpblxyXG4gICAgICAgIGxldCBfcm93ID0gTWF0aC5mbG9vciggdi90aGlzLnNjYWxlICk7XHJcbiAgICAgICAgbGV0IF9jb2wgPSB2JXRoaXMuc2NhbGU7XHJcblxyXG4gICAgICAgIG1hbmhhdHRlbiArPSBNYXRoLmFicyggcm93IC0gX3JvdyApICsgTWF0aC5hYnMoIGNvbCAtIF9jb2wgKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiAyKm1hbmhhdHRlbiArIDEwMCpkaWZmO1xyXG4gIH1cclxuXHJcbiAgLy8gcHJpdmF0ZSBmdW5jdGlvblxyXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS1cclxuXHJcbiAgLyoqXHJcbiAgICog5qC55o2u57u05bqmIHNjYWxlIOaehOmAoOiKgueCueeahOWIneWni+ihqOekuuaVsOe7hFxyXG4gICAqL1xyXG4gIHByaXZhdGUgaW5pdE5vZGVWYWx1ZUJ5U2NhbGUoIHNjYWxlOiBudW1iZXIgKXtcclxuICAgIGxldCB2YWwgPSBbXTtcclxuICAgIGZvciAoIGxldCBpID0gMTsgaSA8IE1hdGgucG93KHNjYWxlLCAyKTsgaSArKyApe1xyXG4gICAgICB2YWwucHVzaCggaSApO1xyXG4gICAgfVxyXG4gICAgdmFsLnB1c2goIDAgKTtcclxuICAgIHJldHVybiB2YWw7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiDojrflj5blvZPliY3oioLngrnkuK3lpITkuo4gMCDkvY3nmoTmlrnlkJEgZGlyZWN0aW9uIOWkhOeahOmCu+aOpeaVsOWtl+eahOS4i+agh1xyXG4gICAqL1xyXG4gIHByaXZhdGUgZ2V0VGFyZ2V0SW5kZXgoIGRpcmVjdGlvbjogbnVtYmVyICl7XHJcbiAgICBpZiAoICF0aGlzLmNhbk1vdmVUbyggZGlyZWN0aW9uICkgKSByZXR1cm47XHJcbiAgICBsZXQgdGFyZ2V0SW5kZXg7XHJcbiAgICBzd2l0Y2goIGRpcmVjdGlvbiApe1xyXG4gICAgICBjYXNlIERJUkVDVElPTi5VUDpcclxuICAgICAgICB0YXJnZXRJbmRleCA9IHRoaXMuemVyb0luZGV4IC0gdGhpcy5zY2FsZTtcclxuICAgICAgICBicmVhaztcclxuICAgICAgY2FzZSBESVJFQ1RJT04uUklHSFQ6XHJcbiAgICAgICAgdGFyZ2V0SW5kZXggPSB0aGlzLnplcm9JbmRleCArIDE7XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIGNhc2UgRElSRUNUSU9OLkRPV046XHJcbiAgICAgICAgdGFyZ2V0SW5kZXggPSB0aGlzLnplcm9JbmRleCArIHRoaXMuc2NhbGU7XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIGNhc2UgRElSRUNUSU9OLkxFRlQ6XHJcbiAgICAgICAgdGFyZ2V0SW5kZXggPSB0aGlzLnplcm9JbmRleCAtIDE7XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgdGFyZ2V0SW5kZXggPSB0aGlzLnplcm9JbmRleDtcclxuICAgIH1cclxuICAgIHJldHVybiB0YXJnZXRJbmRleDtcclxuICB9XHJcblxyXG4gIC8vIHN0YXRpYyBmdW5jdGlvblxyXG4gIC8vIC0tLS0tLS0tLS0tLS0tLVxyXG5cclxuICAvKipcclxuICAgKiDliKTmlq3kuKTkuKroioLngrnmmK/lkKbnm7jnrYlcclxuICAgKiDpgJrov4flsIboioLngrnnmoTmlbDnu4TooajnpLrovazmjaLmiJDlrZfnrKbkuLLmnaXov5vooYzmr5TovoNcclxuICAgKi9cclxuICBzdGF0aWMgaXNTYW1lKCBjdXJyZW50Tm9kZTogTm9kZSwgdGFyZ2V0Tm9kZTogTm9kZSApe1xyXG4gICAgcmV0dXJuIGN1cnJlbnROb2RlLmdldFZhbFN0cigpID09PSB0YXJnZXROb2RlLmdldFZhbFN0cigpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICog5Z+65LqOIG5vZGUg5aSN5Yi25LiA5Liq5paw55qE6IqC54K5XHJcbiAgICovXHJcbiAgc3RhdGljIG5vZGVDbG9uZSggbm9kZTogTm9kZSApe1xyXG4gICAgbGV0IG5ld05vZGUgPSBuZXcgTm9kZSggbm9kZS5zY2FsZSApO1xyXG4gICAgbmV3Tm9kZS52YWx1ZSA9IG5vZGUudmFsdWUuc2xpY2UoMCk7XHJcbiAgICBuZXdOb2RlLnplcm9JbmRleCA9IG5vZGUuemVyb0luZGV4O1xyXG4gICAgcmV0dXJuIG5ld05vZGU7XHJcbiAgfVxyXG59XHJcbiIsImV4cG9ydCBlbnVtIERJUkVDVElPTiAgeyBVUCA9IDEsIFJJR0hULCBET1dOLCBMRUZUIH1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgYmVsb25nVG97XHJcbiAgICBbcHJvcE5hbWU6IHN0cmluZ106IG51bWJlcjtcclxufTtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiAkaWQoZWxlSWQ6IHN0cmluZyl7XHJcbiAgcmV0dXJuIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCBlbGVJZCApO1xyXG59O1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uICRjcmVhdGVFbGUoIHRhZ05hbWU6IHN0cmluZywgaWQ/OiBzdHJpbmcsIGNsYXNzTmFtZT86IHN0cmluZyApe1xyXG4gIGxldCBlbGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCB0YWdOYW1lICk7XHJcbiAgaWYoIGlkICkgZWxlLmlkID0gaWQ7XHJcbiAgaWYoIGNsYXNzTmFtZSApIGVsZS5jbGFzc05hbWUgPSBjbGFzc05hbWU7XHJcbiAgcmV0dXJuIGVsZTtcclxufTtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiAkcmVwbGFjZUNsYXNzKCBlbGUsIG5ld0NsYXNzOiBzdHJpbmcsIHByZWZpeDogc3RyaW5nICApe1xyXG4gIGxldCByZWcgPSBuZXcgUmVnRXhwKCBgJHtwcmVmaXh9LShcXFxcZCkrYCwgJ2cnICk7XHJcbiAgZWxlLmNsYXNzTmFtZSA9IGVsZS5jbGFzc05hbWUucmVwbGFjZSggcmVnLCBuZXdDbGFzcyApO1xyXG59XHJcblxyXG5mdW5jdGlvbiAkYWRkQ2xhc3MoIGVsZSwgbmV3Q2xhc3M6IHN0cmluZyApe1xyXG4gIGlmICggZWxlLmNsYXNzTmFtZS5pbmRleE9mKCBuZXdDbGFzcyApID09PSAtMSApe1xyXG4gICAgZWxlLmNsYXNzTmFtZSA9IGAke2VsZS5jbGFzc05hbWV9ICR7bmV3Q2xhc3N9YDtcclxuICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uICRyZW1vdmVDbGFzcyggZWxlLCByZW1vdmU6IHN0cmluZyApe1xyXG4gIGVsZS5jbGFzc05hbWUgPSBlbGUuY2xhc3NOYW1lLnJlcGxhY2UoIHJlbW92ZSwgJycgKS50cmltKCk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiAkZ2V0UG9zKCBjbGFzc05hbWU6IHN0cmluZyApe1xyXG4gIGxldCBjbGFzc0FyciA9IGNsYXNzTmFtZS5zcGxpdCgnICcpO1xyXG4gIGZvciAoIGxldCBpID0gMCwgbGVuID0gY2xhc3NBcnIubGVuZ3RoOyBpIDwgbGVuOyBpICsrICl7XHJcbiAgICBpZiAoIGNsYXNzQXJyW2ldLmluZGV4T2YoICdwb3MnICkgIT09IC0xICl7XHJcbiAgICAgICAgcmV0dXJuIGNsYXNzQXJyW2ldLnNwbGl0KCctJylbMV07XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gJGdldEltZ0lkKCBjbGFzc05hbWU6IHN0cmluZyApe1xyXG4gIGxldCBjbGFzc0FyciA9IGNsYXNzTmFtZS5zcGxpdCgnICcpO1xyXG4gIGZvciAoIGxldCBpID0gMCwgbGVuID0gY2xhc3NBcnIubGVuZ3RoOyBpIDwgbGVuOyBpICsrICl7XHJcbiAgICBpZiAoIGNsYXNzQXJyW2ldLmluZGV4T2YoICdpdGVtLScgKSAhPT0gLTEgKXtcclxuICAgICAgICByZXR1cm4gY2xhc3NBcnJbaV0uc3BsaXQoJy0nKVsxXTtcclxuICAgIH1cclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiAkZXhjaGFuZ2VQb3MoIGl0ZW0xLCBpdGVtMiApe1xyXG4gIGxldCBwb3MxID0gJGdldFBvcyggaXRlbTEuY2xhc3NOYW1lICk7XHJcbiAgbGV0IHBvczIgPSAkZ2V0UG9zKCBpdGVtMi5jbGFzc05hbWUgKTtcclxuXHJcbiAgJHJlbW92ZUNsYXNzKCBpdGVtMiwgYHBvcy0ke3BvczJ9YCApO1xyXG4gICRhZGRDbGFzcyggaXRlbTIsIGBwb3MtJHtwb3MxfWAgKTtcclxuICAkcmVtb3ZlQ2xhc3MoIGl0ZW0xLCBgcG9zLSR7cG9zMX1gICk7XHJcbiAgJGFkZENsYXNzKCBpdGVtMSwgYHBvcy0ke3BvczJ9YCApO1xyXG59XHJcbiJdfQ==
