export enum DIRECTION { UP = 1, RIGHT, DOWN, LEFT }

export interface belongTo {
    [propName: string]: number;
};

/**
 * 根据 ID 获取元素
 */
export function $id(eleId: string) {
    return document.getElementById(eleId);
};

/**
 * 根据 tagName 创建一个新的元素，可以指定该元素的 ID 和 className
 */
export function $createEle(tagName: string, id?: string, className?: string) {
    let ele = document.createElement(tagName);
    if (id) ele.id = id;
    if (className) ele.className = className;
    return ele;
};
export function $replaceClass(ele, newClass: string, prefix: string) {
    let reg = new RegExp(`${prefix}-(\\d)+`, 'g');
    ele.className = ele.className.replace(reg, newClass);
}

function $addClass(ele, newClass: string) {
    if (ele.className.indexOf(newClass) === -1) {
        ele.className = `${ele.className} ${newClass}`;
    }
}

/**
 * 移除元素 ele 上的某个类名
 */
function $removeClass(ele, removeStr: string) {
    ele.className = ele.className.replace(removeStr, '').trim();
}

export function $getPos(className: string) {
    let classArr = className.split(' ');
    for (let i = 0, len = classArr.length; i < len; i++) {
        if (classArr[i].indexOf('pos') !== -1) {
            return classArr[i].split('-')[1];
        }
    }
}

export function $getImgId(className: string) {
    let classArr = className.split(' ');
    for (let i = 0, len = classArr.length; i < len; i++) {
        if (classArr[i].indexOf('item-') !== -1) {
            return classArr[i].split('-')[1];
        }
    }
}

export function $exchangePos(item1, item2) {
    let pos1 = $getPos(item1.className);
    let pos2 = $getPos(item2.className);

    $removeClass(item2, `pos-${pos2}`);
    $addClass(item2, `pos-${pos1}`);
    $removeClass(item1, `pos-${pos1}`);
    $addClass(item1, `pos-${pos2}`);
}
