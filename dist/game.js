"use strict";
var node_1 = require("./node");
var astar_1 = require('./astar');
var util_1 = require('./util');
var Game = (function () {
    function Game(gameContainerId, scale) {
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
    Game.prototype.mix = function () {
        this.currentNode.shuffle();
        this.setStatusWithNode(this.currentNode);
    };
    Game.prototype.start = function () {
        if (node_1.default.isSame(this.currentNode, this.targetNode)) {
            return console.log('win!!!');
        }
        else {
            var astar = new astar_1.default(this.currentNode, this.targetNode);
            astar.run();
        }
    };
    Game.prototype.setStatusWithNode = function (node) {
        var imgItems = this.imgContainer.getElementsByClassName("item");
        for (var i = 0, len = imgItems.length; i < len; i++) {
            imgItems[i].className = "item item-" + node.value[i];
            imgItems[i].setAttribute("data-pos", "" + node.value[i]);
        }
    };
    Game.prototype.moveImg = function (e) {
        var imgNumber = e.target.getAttribute("data-pos");
        var nonZeroDir = this.currentNode.getNonZeroDirection();
        if (nonZeroDir[imgNumber]) {
            var direction = util_1.DIRECTION[("" + nonZeroDir[imgNumber])];
            this.currentNode.moveTo(direction);
            this.setStatusWithNode(this.currentNode);
        }
    };
    Game.prototype.init = function () {
        this.initImage();
        this.initOperation();
    };
    Game.prototype.initImage = function () {
        var game = this;
        game.imgContainer.style.width = this.scale * 82 + "px";
        for (var i = Math.pow(game.scale, 2) - 1; i > -1; i--) {
            var ele = util_1.$createEle('div', undefined, "item item-" + i);
            ele.addEventListener('click', function (e) { game.moveImg(e); });
            ele.setAttribute("data-pos", "" + i);
            if (i === 0) {
                game.imgContainer.appendChild(ele);
            }
            else {
                game.imgContainer.insertBefore(ele, game.imgContainer.firstChild);
            }
        }
        game.gameContainer.appendChild(game.imgContainer);
    };
    Game.prototype.initOperation = function () {
        var game = this;
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
    return Game;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Game;
