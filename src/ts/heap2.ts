// Heap On Top
export default class Heap{
  heap: number[] = []
  constructor( heapArr: number[] ){
    this.heap = [];
    for ( let i = 0, len = heapArr.length; i < len; i ++ ){
      this.push( heapArr[i] );
    }
  }

  // public function
  // ---------------
  get( index: number ){
    if ( index >= 0 && index < this.heap.length ){
      return this.heap[ index ];
    }
  }
  push( node: number ){
    this.heap.push( node );
    this.goUp( this.heap.length - 1 );
    console.log( "this.heap -- ", this.heap );
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
    return this.heap[index];
  }
  isEmpty(){
    return !this.heap.length;
  }
  // private function
  // ---------------
  private goUp(index: number){
    let heap = this;
    let value = heap.getValue(index),
        parent = heap.getParentIndex(index);

    if ( parent === undefined ) return;

    if ( heap.getValue( parent ) > heap.getValue( index ) ){
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
      if ( heap.getValue(swapIndex) < value ) {
        heap.swap( index, swapIndex );
        heap.goDown( swapIndex );
      }
    } else if ( left !== null ) {
      if ( heap.getValue(left) < value ) {
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
