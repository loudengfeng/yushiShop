export function handleTree(data, id, parentId, children) {
  let config = {
    id: id || 'id',
    parentId: parentId || 'parentId',
    childrenList: children || 'children'
  };

  var childrenListMap = {};
  var nodeIds = {};
  var tree = [];

  for (let d of data) {
    let parentId = d[config.parentId];
    if (childrenListMap[parentId] == null) {
      childrenListMap[parentId] = [];
    }
    nodeIds[d[config.id]] = d;
    childrenListMap[parentId].push(d);
  }

  for (let d of data) {
    let parentId = d[config.parentId];
    if (nodeIds[parentId] == null) {
      tree.push(d);
    }
  }

  for (let t of tree) {
    adaptToChildrenList(t);
  }

  function adaptToChildrenList(o) {
    if (childrenListMap[o[config.id]] !== null) {
      o[config.childrenList] = childrenListMap[o[config.id]];
    }
    if (o[config.childrenList]) {
      for (let c of o[config.childrenList]) {
        adaptToChildrenList(c);
      }
    }
  }
  return tree;
}
// export function debounce(fn, delay){
//   let timer = null;
//   return function(){
//     clearTimeout(timer);
//     timer = setTimeout(()=> {
//       fn.apply(this, arguments);
//     }, delay)
//   }
// }
export function debounce(callback, wait = 1000) {
  var timeId = null;
  // 闭包的应用
  return function () {
    var self = this;
    var args = arguments;
    // 清除可能存在的timeId
    if (timeId !== null) {
      clearTimeout(timeId);
    }
    timeId = setTimeout(() => {
      // TODO: 必须使用apply或者call,将回调函数的this指向Vue
      callback.apply(self, args);
    }, wait)
  }
}

export const exportToWord = (id, name) => {
  // 获取选中区域Html
  const dom = document.getElementById(id);
  const content = dom.innerHTML;
  const convertedContent = convertToWordDocument(content);

  // Html类型数据 转换为 文件类型数据
  const blob = new Blob([convertedContent], { type: "application/msword" });

  // 下载Word文档
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = name + ".doc" || "exported.doc";
  link.click();
};

//完善Html格式
const convertToWordDocument = (content) => {
  const header = `<!DOCTYPE html><html><head><meta charset='utf-8'><title>Exported Document</title></head><body>`;
  const footer = `</body></html>`;

  return `${header}${content}${footer}`;
};

