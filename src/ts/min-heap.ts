/**
 * 小顶堆
 */
export default class minHeap{
  heap: number[] = []
  constructor( heapArr: number[] ){
    // 用依次插入的方式构造初始的小顶堆
    for ( let i = 0, len = heapArr.length; i < len; i ++ ){
      this.push( heapArr[i] );
    }
  }

  // public function
  // ---------------

  /**
   * 获取堆中下标为 index 的值
   */
  get( index: number ){
    if ( index >= 0 && index < this.heap.length ){
      return this.heap[ index ];
    }
  }

  /**
   * 向堆中插入一个新的元素并调整堆
   * 新元素从数组尾部插入，然后对新元素执行上浮调整
   */
  push( item: number ){
    this.heap.push( item );
    this.goUp( this.heap.length - 1 );
  }

  /**
   * 删除并返回堆顶元素并调整堆
   * 先将堆顶元素与数组末尾元素互换，然后弹出数组末尾的元素，最后对堆顶元素执行下沉操作
   */
  pop(){
    if ( this.isEmpty() ) return;
    let result;
    this.swap( 0, this.heap.length - 1 );
    result = this.heap.pop();
    !this.isEmpty() && this.goDown(0);
    return result;
  }

  /**
   * 移除堆中下标为 index 的元素
   * 将需移除的项与堆顶互换，然后弹出堆顶，最后对互换项（原堆顶）执行上浮操作
   */
  remove( index: number ){
    if( index < 0 || index >= this.heap.length ) return;
    this.swap( 0, index );
    this.pop();
    this.goUp( index );
  }

  /**
   * 获取堆顶元素
   */
  top(){
    return this.getValue(0);
  }

  /**
   * 判断堆是否为空
   */
  isEmpty(){
    return !this.heap.length;
  }

  // private function
  // ----------------

  /**
   * 返回堆中下标为 index 的元素
   */
  private getValue( index: number ){
    if( index < 0 || index >= this.heap.length ) return;
    return this.heap[index];
  }

  /**
   * 堆中下标为 index 的元素的上浮操作
   */
  private goUp(index: number){
    let value = this.getValue(index),
        parent = this.getParentIndex(index);

    if ( parent === undefined ) return;

    if ( this.getValue( parent ) > this.getValue( index ) ){
      this.swap( index, parent );
      this.goUp( parent );
    }
  }

  /**
   * 堆中下标为 index 的元素的下沉操作
   */
  private goDown(index: number){
    let value = this.getValue(index),
        [left, right] = this.getChildIndex(index),
        swapIndex = left;

    // 元素是叶子节点，没有子元素
    if ( left === null ) return;

    // 若元素有两个子元素，设置 swapIndex 为较小的那个子元素的下标
    // 若元素只有左儿子，swapIndex 已经被初始化为 left 的值了
    if ( right ){
      swapIndex = this.getValue(left) < this.getValue(right) ? left : right;
    }

    // 比较父元素和较小的那个子元素的值，若父元素的值较大，则置换父元素和较小的子元素
    // 然后在新的置换的位置处继续执行下沉操作
    if ( this.getValue(swapIndex) < value ) {
      this.swap( index, swapIndex );
      this.goDown( swapIndex );
    }
  }

  /**
   * 获取下标为 index 的元素在堆中的父元素
   */
  private getParentIndex( index: number ){
    if ( index < 0 || index >= this.heap.length ) return;
    if ( index === 0 ) return 0;
    return Math.floor( (index-1)/2 );
  }

  /**
   * 获取下标为 index 的元素在堆中的子元素，缺失的子元素用 null 代替
   */
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

  /**
   * 交换堆中下标分别为 index1 和 index2 的两个元素
   */
  private swap( index1: number, index2: number ){
    let tmp = this.heap[index1];
    this.heap[index1] = this.heap[index2];
    this.heap[index2] = tmp;
  }
}
