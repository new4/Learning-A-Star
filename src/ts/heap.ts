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
  get( index: number ){
    if ( index >= 0 && index < this.heap.length ){
      return this.heap[ index ];
    }
  }
  set( index: number ){

  }
  push( node: Node ){
    this.heap.push(node);
    this.goUp( this.heap.length - 1 );
  }
  pop(){
    if ( this.isEmpty() ) return;
    let result;
    this.swap( 0, this.heap.length - 1 );
    result = this.heap.pop();
    !this.isEmpty() && this.goDown(0);
    return result;
  }
  remove( index: number ){
    if( index < 0 || index >= this.heap.length ) return;
  }

  top(){
    if ( this.heap[0] ) return this.heap[0];
  }

  // 获取通过 key 指定的值
  getValue( index: number ){
    if( index < 0 || index >= this.heap.length ) return;
    return this.heap[index][this.key];
  }

  isEmpty(){
    return !this.heap.length;
  }

  has( node: Node ){
    let queryStr = node.value.toString();
    return !!this.b_heap[queryStr];
  }
  // private function
  // ---------------
  private update(){
    for ( let i = Math.floor( this.heap.length/2 ); i > -1; i -- ){
      this.goDown(i);
    }
  }
  private goUp(index: number){
    let heap = this;
    let value = heap.getValue(index),
        parent = heap.getParentIndex(index);

    if ( !parent ) return;

    if ( heap.getValue( parent ) < heap.getValue( index ) ){
      this.swap( index, parent );
      this.goUp( parent );
    }
  }
  private goDown(index: number){
    let heap = this;
    let value = heap.getValue(index),
        [left, right] = heap.getChildIndex(index);

    if ( left && right ){
      let swapIndex = heap.getValue(left) < heap.getValue(right) ? left : right;
      if ( heap.getValue[ swapIndex ] < heap.getValue[ index ] ) {
        heap.swap( index, swapIndex );
        heap.goDown( swapIndex );
      }
    } else if ( left !== null ) {
      if ( heap.getValue[ left ] < heap.getValue[ index ] ) {
        heap.swap( index, left );
        heap.goDown( left );
      }
    } else {
      console.log( "go down: no children!" );
    }
  }
  private getParentIndex( index: number ){
    if ( index < 0 || index >= this.heap.length ) return;
    if ( index === 0 ) return 0;
    return Math.floor( (index-1)/2 );
  }
  private getChildIndex( index: number ){
    let left = 2*index + 1,
        right = 2*index + 2,
        length = this.heap.length;

    if ( right <= length - 1 ){
      return [ left, right ];
    } else if ( left === length - 1 ) {
      return [ left, null ];
    } else {
      return [ null, null ];
    }
  }
  private swap( parentIndex: number, childIndex: number ){
    let tmp = this.heap[parentIndex];
    this.heap[parentIndex] = this.heap[childIndex];
    this.heap[childIndex] = tmp;
  }
  // static function
  // ---------------
}
