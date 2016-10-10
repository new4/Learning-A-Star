import Node from "./node";
import Astar from './astar';
import { $id, $createEle, $replaceClass, DIRECTION } from './util';

export default class Game{
  currentNode: Node
  targetNode: Node
  scale: number

  private gameContainerId: string
  private imgContainerId: string
  private actionContainerId: string
  private gameContainer
  private imgContainer
  private actionContainer

  constructor( gameContainerId: string, scale: number ){
    this.currentNode = new Node( scale );
    this.targetNode = new Node( scale );
    this.scale = scale;

    this.gameContainerId = gameContainerId;
    this.imgContainerId = "image";
    this.actionContainerId = "action";

    this.gameContainer = $id( this.gameContainerId );
    this.imgContainer = $createEle( 'div', this.imgContainerId );
    this.actionContainer = $createEle( 'div', this.actionContainerId );

    this.init();
  }

  // public function
  // ---------------

  /**
   * mix 按钮执行函数
   * 混合，由起始节点乱序得到一个新的节点，并根据新节点设置页面中的显示状态
   */
  mix(){
    this.currentNode.shuffle();
    this.setStatusWithNode( this.currentNode );
  }

  /**
   * start 按钮执行函数
   * 执行 A* 算法
   */
  start(){
    let game = this;
    if ( Node.isSame( this.currentNode, this.targetNode ) ){
      this.win();
    } else {
      let astar = new Astar( this.currentNode, this.targetNode );
      astar.run();

      let solution = astar.getSolution();
      if ( solution.length )  {
        let len = solution.length,
            i = len - 1;

        let id = setInterval( function(){
          if ( i === -1 ){
            clearInterval( id );
          } else {
            game.currentNode = solution[i];
            game.setStatusWithNode( solution[i] );
            i--;
          }
        }, 500 );
      }
    }
  }

  /**
   * 赢得游戏
   */
  win(){
    console.log( "win!!!" );
  }

  // private function
  // ---------------

  /**
   * 初始化函数
   */
  private init(){
    this.initImage();
    this.initOperation();
  }

  /**
   * 拼图的图片显示部分的初始化
   */
  private initImage(){
    let game = this;
    // game.imgContainer.style.width = `${ this.scale * 82 }px`;
    // 节点的数组表示中的每一个数组的项对应一个格子
    for ( let i = Math.pow( game.scale, 2) - 1; i > -1; i -- ){
      let ele = $createEle( 'div', undefined, `item item-${i} pos-${i}` );
      ele.addEventListener( 'click', function(e){ game.moveImg(e) } );
      ele.setAttribute( "data-pos", `${i}` );
      if ( i === 0 ){
        game.imgContainer.appendChild( ele );
      } else {
        game.imgContainer.insertBefore( ele, game.imgContainer.firstChild );
      }
    }
    game.gameContainer.appendChild( game.imgContainer );
  }

  /**
   * 拼图的按钮操作部分的初始化
   */
  private initOperation(){
    let game = this;
    ["MIX", "START"].forEach( function(item, index, array){
      let ele = $createEle( 'button', undefined, `btn btn-${item.toLowerCase()}` );
      ele.innerHTML = item;
      switch( item ){
        case 'MIX':
          ele.addEventListener( 'click', game.mix.bind( game ) );
          break;
        case 'START':
          ele.addEventListener( 'click', game.start.bind( game ) );
          break;
      }
      game.actionContainer.appendChild( ele );
    });
    game.gameContainer.appendChild( game.actionContainer );
  }

  /**
   * 根据节点的数组表示来更新页面中的显示状态
   */
  private setStatusWithNode( node: Node ){
    let imgItems = this.imgContainer.getElementsByClassName("item");
    for ( let i = 0, len = imgItems.length; i < len; i ++ ){
      imgItems[i].className = $replaceClass( imgItems[i].className, `item-${node.value[i]}`, `item` );
      imgItems[i].setAttribute( "data-pos", `${node.value[i]}` );
    }
  }

  /**
   * 图片块上的 click 事件处理函数，用来移动图片块
   */
  private moveImg(e){
    let imgNumber = e.target.getAttribute("data-pos");
    let nonZeroDir = this.currentNode.getNonZeroDirection();
    if ( nonZeroDir[imgNumber] ){
      let direction = DIRECTION[ `${nonZeroDir[ imgNumber ]}` ];
      this.currentNode.moveTo( direction );
      this.setStatusWithNode( this.currentNode );
    }
  }
}
