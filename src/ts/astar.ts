import Node from './node';
import Heap from './heap';

interface belongTo{
    [propName: string]: boolean;
}

export default class Astar{
  openList: Node[]
  closedList: Node[]
  startNode: Node
  targetNode: Node

  private b_closedList: belongTo
  constructor( startNode: Node, targetNode: Node ){
    this.startNode = startNode;
    this.targetNode = targetNode;

    this.openList = [ startNode ];
    this.closedList = [];
  }

  // public function
  // ---------------
  run(){
    console.log( "AStar Run !" );
    let heap = new Heap( this.openList );
    let currentNode = heap.pop();
    // while ( !Node.isSame( currentNode, this.targetNode ) ){
      this.closedList.push( currentNode );

      let nextNodes = currentNode.getNextNodes();

      nextNodes.forEach(function(nextNode){

      });

    // }


  }


  // private function
  // ---------------
  private isBelongToClosed( str: string ){
    return !!this.b_closedList[str];
  }

}
