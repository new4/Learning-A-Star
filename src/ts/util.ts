export enum DIRECTION  { UP = 1, RIGHT, DOWN, LEFT }

export interface belongTo{
    [propName: string]: number;
};

export function $id(eleId: string){
  return document.getElementById( eleId );
};

export function $createEle( tagName: string, id?: string, className?: string ){
  let ele = document.createElement( tagName );
  if( id ) ele.id = id;
  if( className ) ele.className = className;
  return ele;
};

export function $replaceClass( className: string, newClass: string, prefix: string  ){
  let result = "";
  let classArr = className.split( " " );
  for ( let i = 0, len = classArr.length; i < len; i ++ ){
    let index = classArr[i].indexOf( `${prefix}-` );
    if ( index !== -1 ){
      classArr[i] = newClass;
    }
    result += `${classArr[i]} `;
  }
  return result.trim();
}

export function $addClass( className: string, newClass: string ){
  
}

export function $removeClass( className: string, newClass: string ){
  
}