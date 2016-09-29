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
  private gameContainerEle
  private imgContainerEle
  private actionContainerEle

  constructor( gameContainerId: string, scale: number ){
    this.startNode = new Node( scale );
    this.targetNode = new Node( scale );
    this.scale = scale;

    this.gameContainerId = gameContainerId;
    this.imgContainerId = "image";
    this.actionContainerId = "action";

    this.initDOM();

  }

  // public function
  // ---------------
  mix(){
    this.startNode.shuffle();
    this.setStatusWithNode( this.startNode );
  }
  start(){
    if ( Node.isSame( this.startNode, this.targetNode ) ){
      return console.log( 'win!!!' );
    } else {
      let astar = new Astar( this.startNode, this.targetNode );
      astar.run();
    }

  }
  setStatusWithNode( node: Node ){
    let imgItems = this.imgContainerEle.getElementsByClassName("item");
    for ( let i = 0, len = imgItems.length; i < len; i ++ ){
      imgItems[i].className = `item item-${node.value[i]}`;
    }
  }
  // private function
  // ---------------
  private initDOM(){
    let game = this;
    game.gameContainerEle = $id( game.gameContainerId );
    game.imgContainerEle = $createEle( 'div', game.imgContainerId );
    game.actionContainerEle = $createEle( 'div', game.actionContainerId );

    for ( let i = 1; i < Math.pow( game.scale, 2); i ++ ){
      let ele = $createEle( 'div', undefined, `item item-${i}` );
      game.imgContainerEle.appendChild( ele );
    }
    game.imgContainerEle.appendChild( $createEle( 'div', undefined, "item item-0" ) );

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
      game.actionContainerEle.appendChild( ele );
    });

    game.gameContainerEle.appendChild( game.imgContainerEle );
    game.gameContainerEle.appendChild( game.actionContainerEle );
  }
}
