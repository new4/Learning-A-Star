import { DIRECTION } from './util';

export default class Node{
  value: number[]
  zeroIndex: number
  scale: number
  parent: Node
  constructor( scale: number ) {
    this.scale = scale;
    this.value = this.createNodeValueByScale( scale );
    this.zeroIndex = Math.pow(scale, 2) - 1;
  }

  // public function
  // ---------------

  shuffle(){
    for( let i = 0; i < 1000; i ++ ){
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
}
