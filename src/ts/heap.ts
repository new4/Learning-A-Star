import Node from './node';
import { belongTo } from './util';
// Heap On Top
export default class Heap{
  heap: Node[] = []
  b_heap: belongTo = {}
  key: string
  constructor( nodeList: Node[], key: string ){
    this.heap = nodeList;
    this.key = key;
    this.update();
  }

  // public function
  // ---------------
  push( node: Node ){
    this.heap.push(node);
    this.update();
  }

  pop(){
    if ( this.isEmpty() ) return;
    let result = this.heap.shift();
    !this.isEmpty() && this.update();
    return result;
  }

  top(){
    return this.heap[0];
  }

  isEmpty(){
    return !this.heap.length;
  }

  has(node: Node){
    let queryStr = node.value.toString();
    return !!this.b_heap[queryStr];
  }
  // private function
  // ---------------
  private update(){
    console.log( "heap update!" );
    for ( let i = Math.floor( this.heap.length/2 ); i > -1; i -- ){
      this.sink(i);
    }
  }
  private sink(index: number){
    console.log( ` ---------- sink ${index} ----------` );

    if( index >= Math.floor( this.heap.length/2 ) ) return;

    let value = this.heap[index][this.key];
    let [left, right] = this.getChildIndex(index);

    if ( left && this.heap[left] && this.heap[left][this.key] < value ) this.swap( index, left );
    if ( right && this.heap[right] && this.heap[right][this.key] < value ) this.swap( index, right );
  }
  private getChildIndex(index: number){
    let left, right;
    if ( index >= Math.floor( this.heap.length/2 ) ) return [null, null];
    left = 2*index + 1;
    right = (left + 1) === this.heap.length ? ( left + 1 ) : null;
    return [ left, right ];
  }
  private swap( parent: number, child: number ){
    let tmp = this.heap[parent];
    this.heap[parent] = this.heap[child];
    this.heap[child] = tmp;
    this.sink( child );
  }
  // static function
  // ---------------
  static getChildIndex(heap: Node[], index: number){
    let left, right;
    if ( index >= Math.floor( heap.length/2 ) ) return;
    left = 2*index + 1;
    right = (left + 1) === heap.length ? ( left + 1 ) : null;
    return [ left, right ];
  }
}
