/**
 * @return {string}
 */
export function AddZero(index) {
  index = index + 1;
  if (index < 10) {
    return "0" + index;
  } else return index;
}

export function isObjectValueEqual(a, b) {
  //取对象a和b的属性名
  let aProps = Object.getOwnPropertyNames(a);
  let bProps = Object.getOwnPropertyNames(b);
  //判断属性名的length是否一致
  if (aProps.length !== bProps.length) {
    return false;
  }

  //循环取出属性名，再判断属性值是否一致
  for (let i = 0; i < aProps.length; i++) {
    let propName = aProps[i];
    if (a[propName] !== b[propName]) {
      return false;
    }
  }
  return true;
}

export function getOnlyHash(length = 15) {
  return Number(
    Math.random().toString().substr(3, length) + Date.now()
  ).toString(36);
}

/**
 * 深度比较两个对象是否相等
 * @type {{compare: compareObj.compare, isObject: (function(*=): boolean), isArray: (function(*=): boolean)}}
 */
export const compareObj = {
  // 比较两个对象是否相等
  compare: function (oldData, newData) {
    // 类型为基本类型时,如果相同,则返回true
    if (oldData === newData) return true;
    if (
      compareObj.isObject(oldData) &&
      compareObj.isObject(newData) &&
      Object.keys(oldData).length === Object.keys(newData).length
    ) {
      // 类型为对象并且元素个数相同
      // 遍历所有对象中所有属性,判断元素是否相同
      for (const key in oldData) {
        if (oldData.hasOwnProperty(key)) {
          if (!compareObj.compare(oldData[key], newData[key])) {
            // 对象中具有不相同属性 返回false
            return false;
          }
        }
      }
    } else if (
      compareObj.isArray(oldData) &&
      compareObj.isArray(oldData) &&
      oldData.length === newData.length
    ) {
      // 类型为数组并且数组长度相同
      for (let i = 0, length = oldData.length; i < length; i++) {
        if (!compareObj.compare(oldData[i], newData[i])) {
          // 如果数组元素中具有不相同元素,
          return false;
        }
      }
    } else {
      // 其它类型,均返回false
      return false;
    }
    // 走到这里,说明数组或者对象中所有元素都相同,返回true
    return true;
  },
  // 判断此类型是否是Array类型
  isObject: function (obj) {
    return Object.prototype.toString.call(obj) === "[object Object]";
  },
  // 判断此对象是否是Object类型
  isArray: function (arr) {
    return Object.prototype.toString.call(arr) === "[object Array]";
  },
};

/**
 * 分割路由
 * @param {路由search} route
 * @returns Map对象
 */
export function routeBreakUp(route) {
  let map = new Map();
  route = route.split("?").join("").split("&");
  route.forEach((item) => {
    const tmp = item.split("=");
    map.set(tmp[0], tmp[1]);
  });
  return map;
}
