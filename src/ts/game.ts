import Node from "./node";
import Astar from './astar';
import { $id, $createEle, $replaceClass, $getPos, $getImgId, $exchangePos, DIRECTION } from './util';

export default class Game {
    currentNode: Node
    targetNode: Node
    scale: number
    running: boolean = false
    isWin: boolean = false

    private gameContainerId: string
    private imgContainerId = "image"
    private actionContainerId = "action"
    private infoId = "info"

    private gameContainer
    private imgContainer
    private actionContainer
    private infoContainer

    // 缓存所有的图片片段 dom，免得再找
    private imgElements = []
    // 缓存空白图片片段 dom，免得再找
    private blankImgEle

    private timeInfoEle
    private stepInfoEle

    constructor(gameContainerId: string, scale: number) {
        this.currentNode = new Node(scale);
        this.targetNode = new Node(scale);
        this.scale = scale;

        this.gameContainerId = gameContainerId;

        this.gameContainer = $id(this.gameContainerId);
        this.imgContainer = $createEle('div', this.imgContainerId);
        this.actionContainer = $createEle('div', this.actionContainerId);
        this.infoContainer = $createEle('div', this.infoId);

        this.init();
    }

    // public function
    // ---------------

    /**
     * mix 按钮执行函数
     * 混合，由起始节点乱序得到一个新的节点，并根据新节点设置页面中的显示状态
     */
    mix() {
        console.log("runing = ", this.running, " -- ", "isWin = ", this.isWin);
        if (this.running || this.isWin) return;
        this.currentNode.shuffle();
        this.setStatusByNode(this.currentNode);
    }

    /**
     * start 按钮执行函数
     * 执行 A* 算法
     */
    start() {
        let game = this;

        if (game.running) return;
        game.running = true;

        if (Node.isSame(this.currentNode, this.targetNode)) {
            this.win();
        } else {
            let astar = new Astar(this.currentNode, this.targetNode);

            console.time("AStar Run !");
            let startTime = new Date().getTime();
            // astar.run();
            astar.run2();
            let endTime = new Date().getTime();
            console.timeEnd("AStar Run !");
            console.log(" astar - ", astar);

            game.timeInfoEle.innerHTML = `${endTime - startTime} ms`;

            let solution = astar.getSolution();
            if (solution.length) {
                let len = solution.length,
                    i = len - 1;

                let runId = setInterval(function() {
                    if (i === -1) {
                        clearInterval(runId);
                        game.win();
                    } else {
                        game.currentNode = solution[i];
                        game.setStatusByNode(solution[i]);
                        game.stepInfoEle.innerHTML = `${len - i}\/${len}`;
                        i--;
                    }
                }, 180);
            }
        }
    }

    /**
     * 赢得游戏
     */
    win() {
        let game = this;
        let id = setTimeout(function() {
            game.running = false;
            game.imgContainer.className = 'win';
            game.isWin = true;
            clearTimeout(id);
        }, 300);
    }

    // private function
    // ---------------

    /**
     * 初始化函数
     */
    private init() {
        this.initImage();
        this.initOperation();
        this.initInfo();
    }

    /**
     * 拼图游戏的图片显示部分的初始化
     */
    private initImage() {
        let game = this;
        // 节点的数组表示中的每一个数组的项对应一个格子
        for (let i = Math.pow(game.scale, 2) - 1; i > -1; i--) {
            // 样式 item-* 规定某一格子对应的图片片段，这部分初始化后不再改变
            // 样式 pos-* 规定某一格子在 #image 容器中的位置，这部分随着节点变化而改变
            let ele = $createEle('div', undefined, `item item-${i} pos-${i}`);

            ele.addEventListener('click', function(e) { game.imgFragmentHandler(e) });

            // 初始化的时调整空白格部分( 样式为： .item.item-0.pos-0 )的位置
            // 同时将图片片段的 dom 缓存
            if (i === 0) {
                game.imgContainer.appendChild(ele);
                game.imgElements.push(ele);
                game.blankImgEle = ele;
            } else {
                game.imgContainer.insertBefore(ele, game.imgContainer.firstChild);
                game.imgElements.unshift(ele);
            }
        }
        game.gameContainer.appendChild(game.imgContainer);

        // win 效果部分
        this.imgContainer.addEventListener('click', function(e) {
            if (this === e.target) {
                this.className = '';
                game.isWin = false;
            }
        });
    }

    /**
     * 拼图的按钮操作部分的初始化
     */
    private initOperation() {
        let game = this;
        // 两个按钮 MIX 和 START
        ["MIX", "START"].forEach(function(item, index, array) {
            let ele = $createEle('button', undefined, `btn btn-${item.toLowerCase()}`);
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
    }

    /**
     * 拼图的信息显示部分的初始化
     */
    private initInfo() {
        let game = this;

        ["time", "step"].forEach(function(value) {
            let divEle = $createEle('div', undefined, 'info-item');
            let title = $createEle('span', undefined, 'title');
            let content = $createEle('span');

            title.innerHTML = `${value}:`;
            content.innerHTML = '0';
            game[`${value}InfoEle`] = content;

            divEle.appendChild(title);
            divEle.appendChild(content);
            game.infoContainer.appendChild(divEle);
        })
        game.gameContainer.appendChild(game.infoContainer);
    }

    /**
     * 根据节点的数组表示来设置图片片段的位置
     */
    private setStatusByNode(node: Node) {
        // let imgElements = this.imgContainer.getElementsByClassName("item");
        for (let k = 0, len = node.value.length; k < len; k++) {
            let pos = (k === len - 1) ? 0 : k + 1;;
            let v = (node.value[k] === 0) ? len : node.value[k];
            $replaceClass(this.imgElements[v - 1], `pos-${pos}`, 'pos');
        }
    }

    /**
     * 图片片段上的 click 事件处理函数，用来移动图片片段
     */
    private imgFragmentHandler(e) {
        let imgId = $getImgId(e.target.className);
        let nonZeroDir = this.currentNode.getNonZeroDirection();
        if (nonZeroDir[imgId]) {
            let direction = DIRECTION[`${nonZeroDir[imgId]}`];
            this.currentNode.moveTo(direction);
            $exchangePos(this.blankImgEle, e.target);

            if (Node.isSame(this.currentNode, this.targetNode)) this.win();
        }
    }
}
