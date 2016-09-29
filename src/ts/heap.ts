import Node from './node';

// Heap On Top
export default class Heap{
  heap: Node[]
  constructor( nodeList: Node[] ){
    this.heap = nodeList;
  }

  // public function
  // ---------------
  push( node: Node ){
    console.log( "push" )
    this.heap.push();
  }

  pop(){
    console.log( "pop" )
    return this.heap.shift();
  }

  // private function
  // ---------------

}
