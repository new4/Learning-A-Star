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
    console.log( "AStar Run !" );
    let astar = this;
    let count = 0;
    while ( !Node.isSame( astar.openList.top(), astar.targetNode ) && !astar.openList.isEmpty() ){
      let currentNode: Node;

      do{
        if( astar.openList.isEmpty() ) return console.log( " empty! " );
        currentNode = astar.openList.pop();
      } while ( astar.b_closedList[ currentNode.value.toString() ] === 1 );

      astar.closedList.push( currentNode );
      astar.b_closedList[ currentNode.value.toString() ] = 1;

      let nextNodes = currentNode.getNextNodes();

      count ++;

      nextNodes.forEach(function(nextNode){
        nextNode.F = currentNode.getCurrentCost() + currentNode.getCostToNext() + nextNode.getHeuristicToTarget(astar.targetNode);
        nextNode.currentCost = count;
        astar.openList.push( nextNode );
      });

    }

    console.log( " astar - ", astar );

    let tailNode = astar.openList.top();
    let p = [];
    while( tailNode ){
      p.push( tailNode.value.toString() );
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

}
