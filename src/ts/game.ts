import Node from "./node"
import Astar from './astar'
import { $id, $createEle } from './util'

export default class Game{
  startNode: Node
  targetNode: Node
  scale: number
  private gameContainerId: string
  private imgContainerId: string
  private actionContainerId: string
  private gameContainer
  private imgContainer
  private actionContainer

  constructor( gameContainerId: string, scale: number ){
    this.startNode = new Node( scale );
    this.targetNode = new Node( scale );
    this.scale = scale;

    this.gameContainerId = gameContainerId;
    this.imgContainerId = "image";
    this.actionContainerId = "action";

    this.init();
  }

  // public function
  // ---------------

  /**
   * mix 按钮执行函数
   * 混合，由起始节点乱序得到一个新的节点，并根据新节点设置页面中的显示状态
   */
  mix(){
    this.startNode.shuffle();
    this.setStatusWithNode( this.startNode );
  }

  /**
   * start 按钮执行函数
   * 执行 A* 算法
   */
  start(){
    if ( Node.isSame( this.startNode, this.targetNode ) ){
      return console.log( 'win!!!' );
    } else {
      let astar = new Astar( this.startNode, this.targetNode );
      astar.run();
    }
  }

  /**
   * 根据节点的数组表示来更新页面中的显示状态
   */
  setStatusWithNode( node: Node ){
    let imgItems = this.imgContainer.getElementsByClassName("item");
    for ( let i = 0, len = imgItems.length; i < len; i ++ ){
      imgItems[i].className = `item item-${node.value[i]}`;
      imgItems[i].setAttribute( "data-pos", `${node.value[i]}` );
    }
  }


  moveImg( index ){
    console.log( "index - - ", index );
    console.log( "index - - ", this.startNode );

  }

  // private function
  // ---------------

  /**
   * 初始化函数
   */
  private init(){
    let game = this;
    game.gameContainer = $id( game.gameContainerId );
    game.imgContainer = $createEle( 'div', game.imgContainerId );
    game.actionContainer = $createEle( 'div', game.actionContainerId );

    game.imgContainer.style.width = `${ this.scale * 82 }px`;

    // 节点的数组表示中的每一个数组的项对应一个格子
    for ( let i = 1; i < Math.pow( game.scale, 2); i ++ ){
      let ele = $createEle( 'div', undefined, `item item-${i}` );
      ele.addEventListener( 'click', function(){ game.moveImg(i) } );

      ele.setAttribute( "data-pos", `${i}` );

      game.imgContainer.appendChild( ele );
    }
    game.imgContainer.appendChild( $createEle( 'div', undefined, "item item-0" ) );

    // 功能按钮的初始化与事件绑定
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

    game.gameContainer.appendChild( game.imgContainer );
    game.gameContainer.appendChild( game.actionContainer );
  }
}
