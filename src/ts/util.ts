export enum DIRECTION  { UP = 1, RIGHT, DOWN, LEFT }

export function clone(){

}

export function $id(eleId: string){
  return document.getElementById( eleId );
}

export function $createEle( tagName: string, id?: string, className?: string ){
  let ele = document.createElement( tagName );
  if( id ) ele.id = id;
  if( className ) ele.className = className;
  return ele;
}
