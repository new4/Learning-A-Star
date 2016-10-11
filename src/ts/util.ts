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

export function $replaceClass( ele, newClass: string, prefix: string  ){
  let reg = new RegExp( `${prefix}-(\\d)+`, 'g' );
  ele.className = ele.className.replace( reg, newClass );
}

export function $addClass( ele, newClass: string ){
  if ( ele.className.indexOf( newClass ) === -1 ){
    ele.className = `${ele.className} ${newClass}`;
  }
}

export function $removeClass( ele, remove: string ){
  ele.className = ele.className.replace( remove, '' ).trim();
}

export function $getPos( className: string ){
  let classArr = className.split(' ');
  for ( let i = 0, len = classArr.length; i < len; i ++ ){
    if ( classArr[i].indexOf( 'pos' ) !== -1 ){
        return classArr[i].split('-')[1];
    }
  }
}

export function $getImgId( className: string ){
  let classArr = className.split(' ');
  for ( let i = 0, len = classArr.length; i < len; i ++ ){
    if ( classArr[i].indexOf( 'item-' ) !== -1 ){
        return classArr[i].split('-')[1];
    }
  }
}

export function $exchangePos( item1, item2 ){
  let pos1 = $getPos( item1.className );
  let pos2 = $getPos( item2.className );

  $removeClass( item2, `pos-${pos2}` );
  $addClass( item2, `pos-${pos1}` );
  $removeClass( item1, `pos-${pos1}` );
  $addClass( item1, `pos-${pos2}` );
}
