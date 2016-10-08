import Node from './node';
import Heap from './heap';
import { belongTo } from './util';

export default class Astar{
  openList: Heap
  closedList: Node[]
  startNode: Node
  targetNode: Node

  private b_closedList: belongTo

  constructor( startNode: Node, targetNode: Node ){
    this.startNode = startNode;
    this.targetNode = targetNode;

    this.openList = new Heap( [ startNode ], "F" );
    this.closedList = [];

    this.b_closedList = {};
  }

  // public function
  // ---------------
  run(){
    console.time( "AStar Run !" );
    let astar = this;
    while ( !Node.isSame( astar.openList.top(), astar.targetNode ) ){
      let currentNode = astar.openList.pop();
      astar.closedList.push( currentNode );
      astar.b_closedList[ currentNode.getValStr() ] = 1;

      let nextNodes = currentNode.getNextNodes();

      nextNodes.forEach(function(nextNode){
        let cost = currentNode.getG() + currentNode.getCostToNext();
        let index =  astar.openList.getItemIndex( nextNode );

        if ( index !== undefined && cost < nextNode.getG() ){
          console.log( "next 1" );
          astar.openList.remove( index );
        }

        if ( astar.isBelongToClosed( nextNode.getValStr() ) && cost < nextNode.getG() ){
          console.log( "next 2" );
        }

        if ( index === undefined && !astar.isBelongToClosed( nextNode.getValStr() ) ){
          console.log( "next 3" );
          nextNode.setG( cost );
          nextNode.setF( nextNode.getG() + nextNode.getH( astar.targetNode ) );
          astar.openList.push( nextNode );
        }
      });
    }
    console.timeEnd( "AStar Run !" );

    console.log( " astar - ", astar );

    let tailNode = astar.openList.top();
    let p = [];
    while( tailNode ){
      p.unshift( tailNode.getValStr() );
      tailNode = tailNode.parent;
    }
    console.log( " p ----- ", p );

  }


  // private function
  // ---------------
  private getHeuristicTo(){

  }
  private isBelongToClosed( str: string ){
    return !!this.b_closedList[str];
  }
  private removeFromClosed( str:string ){

  }
}
