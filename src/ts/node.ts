import { DIRECTION } from './util';

// LET DIRECTION = [ 'NONE', 'UP', 'RIGHT', 'DOWN', 'LEFT' ];

/**
 * 节点 Node 类定义
 */
export default class Node {
    value: number[]     // 某一节点的值，用一维数组表示
    zeroIndex: number   // 节点值数组中的 0 值所在位置的下标
    scale: number       // 节点尺度，3*3，4*4，5*5 等等
    parent: Node        // 当前节点的父节点，父节点通过对 0 位的某一步移动到达当前节点
    F: number = 0
    G: number = 0

    constructor(scale: number, initArr?: number[]) {
        this.scale = scale;
        this.value = initArr ? initArr : this.initNodeValueByScale(scale);
        this.zeroIndex = Math.pow(scale, 2) - 1;
    }

    // public function
    // ---------------

    /**
     * 获取节点的值，将节点的数组表示转换成字符串表示并返回
     */
    getValStr() {
        return this.value.toString();
    }

    /**
     * 节点的乱序算法
     * 随机指定一个方向，令节点向该方向移动，重复上述过程若干次达到乱序的目的
     */
    shuffle() {
        for (let i = 0; i < 5000; i++) {
            let direction = Math.floor(Math.random() * 4 + 1);
            this.moveTo(direction);
        }
    }

    /**
     * 当前节点向方向 direction 移动一次
     * 其实是节点的数组表示中的数字 0 向方向 direction 移动一次
     */
    moveTo(direction: number) {
        if (!this.canMoveTo(direction)) return;
        let targetIndex = this.getTargetIndex(direction);

        this.value[this.zeroIndex] = this.value[targetIndex];
        this.value[targetIndex] = 0;
        this.zeroIndex = targetIndex;
    }

    /**
     * 获取当前节点的可能移动方向（用 0 位的移动进行表示）
     */
    getZeroDirection() {
        let node = this;
        let Direction = {};
        ["UP", "RIGHT", "DOWN", "LEFT"].forEach(function(dir) {
            let _dir = DIRECTION[dir];
            if (node.canMoveTo(_dir)) {
                let targetIndex = node.getTargetIndex(_dir);
                Direction[dir] = `${node.value[targetIndex]}`;
            }
        });
        return Direction;
    }

    /**
     * 将当前节点的可能移动方向由用 0 位的移动来表示转换成用 0 位邻接的非 0 数字的移动来进行表示
     */
    getNonZeroDirection() {
        let Direction = {};
        let zeroDir = this.getZeroDirection();
        for (let val in zeroDir) {
            Direction[zeroDir[val]] = val;
        }
        return Direction;
    }

    /**
     * 获取当前节点在可移动方向上的子节点数组
     */
    getNextNodes() {
        let node = this;
        let nextNodes: Node[] = [];
        [DIRECTION.UP, DIRECTION.RIGHT, DIRECTION.DOWN, DIRECTION.LEFT].forEach(function(direction) {
            if (node.canMoveTo(direction)) {
                let newNode = Node.nodeClone(node);
                newNode.parent = node;
                newNode.moveTo(direction);
                nextNodes.push(newNode);
            }
        });
        return nextNodes;
    }

    /**
     * 判断当前节点（节点中的 0 位）是否可以沿 direction 方向移动
     */
    canMoveTo(direction: number) {
        let row = Math.floor(this.zeroIndex / this.scale);
        let col = this.zeroIndex % this.scale;

        switch (direction) {
            case DIRECTION.UP:
                return row !== 0;
            case DIRECTION.RIGHT:
                return col !== this.scale - 1;
            case DIRECTION.DOWN:
                return row !== this.scale - 1;
            case DIRECTION.LEFT:
                return col !== 0;
            default:
                return false;
        }
    }

    /**
     * 获取从当前节点走到下一个节点的代价
     */
    getCostToNext() {
        return 1;
    }

    /**
     * 设置节点的 F 值，堆会根据这个值进行排序
     */
    setF(value: number) {
        this.F = value;
    }

    /**
     * 获取节点的 G 值
     */
    getG() {
        return this.G;
    }

    /**
     * 设置节点的 G 值
     */
    setG(value: number) {
        this.G = value;
    }

    /**
     * 获取节点的 H 值
     */
    getH(targetNode: Node) {
        let i = 0,
            len = this.value.length,
            manhatten = 0,
            diff = 0;

        for (; i < len; i++) {
            if (this.value[i] !== i + 1) diff++;

            let v = this.value[i];
            if (v !== 0) {
                // now in
                let row = Math.floor(i / this.scale);
                let col = i % this.scale;
                // should in
                let _row = Math.floor(v / this.scale);
                let _col = v % this.scale;

                manhatten += Math.abs(row - _row) + Math.abs(col - _col);
            }
        }

        return 2 * manhatten + 100 * diff;
    }

    // private function
    // ----------------

    /**
     * 根据维度 scale 构造节点的初始表示数组
     */
    private initNodeValueByScale(scale: number) {
        let val = [];
        for (let i = 1; i < Math.pow(scale, 2); i++) {
            val.push(i);
        }
        val.push(0);
        return val;
    }

    /**
     * 获取当前节点中处于 0 位的方向 direction 处的邻接数字的下标
     */
    private getTargetIndex(direction: number) {
        if (!this.canMoveTo(direction)) return;
        let targetIndex;
        switch (direction) {
            case DIRECTION.UP:
                targetIndex = this.zeroIndex - this.scale;
                break;
            case DIRECTION.RIGHT:
                targetIndex = this.zeroIndex + 1;
                break;
            case DIRECTION.DOWN:
                targetIndex = this.zeroIndex + this.scale;
                break;
            case DIRECTION.LEFT:
                targetIndex = this.zeroIndex - 1;
                break;
            default:
                targetIndex = this.zeroIndex;
        }
        return targetIndex;
    }

    // static function
    // ---------------

    /**
     * 判断两个节点是否相等
     * 通过将节点的数组表示转换成字符串来进行比较
     */
    static isSame(currentNode: Node, targetNode: Node) {
        return currentNode.getValStr() === targetNode.getValStr();
    }

    /**
     * 基于 node 复制一个新的节点
     */
    static nodeClone(node: Node) {
        let newNode = new Node(node.scale);
        newNode.value = node.value.slice(0);
        newNode.zeroIndex = node.zeroIndex;
        return newNode;
    }
}
