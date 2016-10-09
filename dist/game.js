"use strict";
var node_1 = require("./node");
var astar_1 = require('./astar');
var util_1 = require('./util');
var Game = (function () {
    function Game(gameContainerId, scale) {
        this.startNode = new node_1.default(scale);
        this.targetNode = new node_1.default(scale);
        this.scale = scale;
        this.gameContainerId = gameContainerId;
        this.imgContainerId = "image";
        this.actionContainerId = "action";
        this.init();
    }
    Game.prototype.mix = function () {
        this.startNode.shuffle();
        this.setStatusWithNode(this.startNode);
    };
    Game.prototype.start = function () {
        if (node_1.default.isSame(this.startNode, this.targetNode)) {
            return console.log('win!!!');
        }
        else {
            var astar = new astar_1.default(this.startNode, this.targetNode);
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
    Game.prototype.moveImg = function (index) {
        console.log("index - - ", index);
        console.log("index - - ", this.startNode);
    };
    Game.prototype.init = function () {
        var game = this;
        game.gameContainer = util_1.$id(game.gameContainerId);
        game.imgContainer = util_1.$createEle('div', game.imgContainerId);
        game.actionContainer = util_1.$createEle('div', game.actionContainerId);
        game.imgContainer.style.width = this.scale * 82 + "px";
        var _loop_1 = function(i) {
            var ele = util_1.$createEle('div', undefined, "item item-" + i);
            ele.addEventListener('click', function () { game.moveImg(i); });
            ele.setAttribute("data-pos", "" + i);
            game.imgContainer.appendChild(ele);
        };
        for (var i = 1; i < Math.pow(game.scale, 2); i++) {
            _loop_1(i);
        }
        game.imgContainer.appendChild(util_1.$createEle('div', undefined, "item item-0"));
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
        game.gameContainer.appendChild(game.imgContainer);
        game.gameContainer.appendChild(game.actionContainer);
    };
    return Game;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Game;
