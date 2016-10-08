import { DIRECTION } from './util';

export default class Node{
  value: number[]
  zeroIndex: number
  scale: number
  parent: Node
  F: number
  G: number
  fromDir: number
  toDir: number
  constructor( scale: number, initArr?: number[] ) {
    this.scale = scale;
    this.value = initArr ? initArr : this.createNodeValueByScale( scale );
    this.zeroIndex = Math.pow(scale, 2) - 1;

    // this.parent = new Node(this.scale);
    this.F = 0;
    this.G = 0;
  }

  // public function
  // ---------------

  getValStr(){
    return this.value.toString();
  }

  shuffle(){
    for( let i = 0; i < 5; i ++ ){
      let direction = Math.floor(Math.random() * 4 + 1);
      this.moveTo( direction );
    }
  }

  moveTo( direction: number ){
    if ( !this.canMoveTo( direction ) ) return;
    let targetIndex;
    switch( direction ){
      case DIRECTION.UP:
        targetIndex = this.zeroIndex - this.scale;
        break;
      case DIRECTION.RIGHT:
        targetIndex = this.zeroIndex + 1;
        break;
      case DIRECTION.DOWN:
        targetIndex = this.zeroIndex + this.scale;
        break;
      case DIRECTION.LEFT:
        targetIndex = this.zeroIndex - 1;
        break;
      default:
        targetIndex = this.zeroIndex;
    }

    this.value[ this.zeroIndex ] = this.value[ targetIndex ];
    this.value[ targetIndex ] = 0;
    this.zeroIndex = targetIndex;
  }

  getNextNodes(){
    let node = this;
    let nextNodes: Node[] = [];
    [ DIRECTION.UP, DIRECTION.RIGHT, DIRECTION.DOWN, DIRECTION.LEFT ].forEach( function(direction){
      if ( node.canMoveTo( direction ) ){
        let newNode = Node.nodeClone( node );
        newNode.parent = node;
        newNode.moveTo(direction);
        nextNodes.push( newNode );
      }
    });
    return nextNodes;
  }

  canMoveTo( direction: number ){
    let row = Math.floor( this.zeroIndex / this.scale );
    let col = this.zeroIndex % this.scale;

    switch( direction ){
      case DIRECTION.UP:
        return row !== 0;
      case DIRECTION.RIGHT:
        return col !== this.scale - 1;
      case DIRECTION.DOWN:
        return row !== this.scale - 1;
      case DIRECTION.LEFT:
        return col !== 0;
      default:
        return false;
    }
  }

  getCostToNext(): number{
    return 1;
  }

  setF( value: number ){
    this.F = value;
  }

  getG(){
    return this.G;
  }

  setG( value: number ){
    this.G = value;
  }

  getH( targetNode: Node ){
    let result: number = 0;

    let diff: number = 0;
    let i = 0,
        len = this.value.length;

    for ( ; i < len; i ++ ){
      if ( this.value[i] !== i + 1 ) diff ++;
    }

    let manhatten: number = 0;
    for ( i = 0; i < len; i ++ ){
      let v = this.value[i];
      if( v !== 0 ){
        // now in
        let row = Math.floor( i/this.scale );
        let col = i%this.scale;
        // should in
        let _row = Math.floor( v/this.scale );
        let _col = v%this.scale;

        manhatten += Math.abs( row - _row ) + Math.abs( col - _col );
      }
    }

    result = 5*manhatten + 1*diff;

    return result;
  }

  // private function
  // ----------------
  private createNodeValueByScale( scale: number ){
    let val = [];
    for ( let i = 1; i < Math.pow(scale, 2); i ++ ){
      val.push( i );
    }
    val.push( 0 );
    return val;
  }
  // static function
  // ---------------
  static isSame( currentNode: Node, targetNode: Node ){
    return currentNode.value.toString() === targetNode.value.toString();
  }
  static nodeClone( node: Node ){
    let newNode = new Node( node.scale );
    newNode.value = node.value.slice(0);
    newNode.zeroIndex = node.zeroIndex;
    return newNode;
  }
  // cost from one node to another node
  static costFromN2N( fromNode: Node, toNode: Node ){

  }
}
