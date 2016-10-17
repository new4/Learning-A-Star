import Node from './node';
import Heap from './heap';
import { belongTo } from './util';

/**
 * A* 算法
 */
export default class Astar {
    openList: Heap
    closedList: Node[] = []
    startNode: Node
    targetNode: Node

    private b_closedList: belongTo = {}
    private solution: Node[] = []

    constructor(startNode: Node, targetNode: Node) {
        this.startNode = startNode;
        this.targetNode = targetNode;
        this.openList = new Heap([startNode], "F");
    }

    // public function
    // ---------------

    /**
     * 运行 A* 算法
     */
    run() {
        let astar = this;
        while (!Node.isSame(astar.openList.top(), astar.targetNode)) {
            let currentNode = astar.openList.pop();
            astar.closedList.push(currentNode);
            astar.b_closedList[currentNode.getValStr()] = 1;

            let nextNodes = currentNode.getNextNodes();

            nextNodes.forEach(function(nextNode) {
                let cost = currentNode.getG() + currentNode.getCostToNext();
                let index = astar.openList.getItemIndex(nextNode);

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
        }

        let tailNode = astar.openList.top();
        this.solution = [];
        while (tailNode) {
            this.solution.push(tailNode);
            tailNode = tailNode.parent;
        }
        // this.showSolution();
    }

    /**
     * 运行 A* 算法 ( 版本 2 ) 实验用
     */
    run2() {
        let astar = this;
        while (!Node.isSame(astar.openList.top(), astar.targetNode)) {
            let currentNode = astar.openList.pop();
            astar.closedList.push(currentNode);
            astar.b_closedList[currentNode.getValStr()] = 1;

            let nextNodes = currentNode.getNextNodes();

            nextNodes.forEach(function(nextNode) {
                let cost = currentNode.getG() + currentNode.getCostToNext();
                let index = astar.openList.getItemIndex(nextNode);

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
        }

        let tailNode = astar.openList.top();
        this.solution = [];
        while (tailNode) {
            this.solution.push(tailNode);
            tailNode = tailNode.parent;
        }
        this.showSolution();
    }

    /**
     * 获取解决方案数组
     */
    getSolution() {
        return this.solution;
    }

    // private function
    // ---------------

    /**
     * 判断节点是否在 CLOSED 中
     */
    private isBelongToClosed(node: Node) {
        let str = node.getValStr();
        return !!this.b_closedList[str];
    }

    /**
     * 显示解决方案的具体步骤
     */
    private showSolution() {
        let len = this.solution.length,
            i = len - 1,
            scale = this.targetNode.scale;
        for (; i > -1; i--) {
            console.log(`Step ${len - i}: `);
            let item = this.solution[i].getValStr().split(',');
            for (let j = 0; j < scale; j++) {
                console.log(`| ${item[j * scale]} ${item[j * scale + 1]} ${item[j * scale + 2]} |`);
            }
        }
    }
}
