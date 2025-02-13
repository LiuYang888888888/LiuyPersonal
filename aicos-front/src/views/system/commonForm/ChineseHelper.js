/**
 * 封装 中文转英文方法
 */
 
// 引入字符编码（JSON）
import PinYin from './ChineseHelperStr.js'
 
// 定义方法
const loadPinYinInit = {}
 
// 获取所有编码
loadPinYinInit.GetPinyinStr = function () {   
  return PinYin;
}
 
// 汉字转拼音  
//type  
//''默认全拼驼峰 ZhangSanFeng
//F 首字母 ZSF
//SF ZhangSF
loadPinYinInit.ConvertPinyin = function (l1,type) {
  var l2 = l1.length;
  var I1 = "";
  var reg = new RegExp('[a-zA-Z0-9]');
  var hzs = 0 ;
  for (var i = 0; i < l2; i++) {
    var val = l1.substr(i, 1);
    
    if (reg.test(val)) {
      I1 += val;
    } else {
      hzs++
      var name = loadPinYinInit.arraySearch(val,type,hzs);
      if (name !== false) {
        I1 += name;
      }
    } 
  }
  I1 = I1.replace(/ /g, ' ');
  while (I1.indexOf('--') > 0) {
    I1 = I1.replace('--', '-');
  }
  return I1;
}
 
// 在对象中搜索  
loadPinYinInit.arraySearch = function (l1,type,hzs) {
  let needName = ''
  for (var name in PinYin) {
    if (PinYin[name].indexOf(l1) != -1) {
      needName =  loadPinYinInit.ucfirst(name,type,hzs); break;
    }
  }
  return needName;
}
 
// 首字母大写  
loadPinYinInit.ucfirst = function(l1,type,hzs) {
  if (l1.length > 0) {
    var first = l1.substr(0, 1).toUpperCase();
    var spare = l1.substr(1, l1.length);
    if( type == 'F'){
      return first; 
    }else if(type == 'SF'){
      if(hzs == 1) {
        return first + spare;
      }else{
        return first; 
      }
      
    }else{
      return first + spare; 
    }
    
  }
}
export default loadPinYinInit