/* global HTMLFormatter */
var font = {
  FontNameItem: [['', '字体'],"宋体", "微软雅黑", "黑体", "楷体", "仿宋", "隶书", "幼圆", "Arial", "Arial Black", "Arial Narrow", "Brush Script MT", "Century Gothic", "Comic Sans MS", "Courier", "Courier New", "MS Sans Serif", "Script", "System", "Times New Roman", "Verdana", "Wide Latin", "Wingdings"],
  FontSizeItem: [['','字号'],["40px","初号"], ["36px","小初"], ["26px","一号"], ["24px","小一"], ["22px","二号"], ["18px","小二"], ["16px","三号"], ["15px","小三"], ["14px","四号"], ["12px","小四"], ["10.5px","五号"], ["9px","小五"], ["7.5px","六号"], ["6.5px","小六"], ["5.5px","七号"], ["5px","八号"], ["5px","5"], ["5.5px","5.5"], ["6.5px","6.5"], ["7.5px","7.5"], ["8px","8"], ["9px","9"], ["10px","10"], ["10.5px","10.5"], ["11px","11"], ["12px","12"], ["14px","14"], ["16px","16"], ["18px","18"], ["20px","20"], ["22px","22"], ["24px","24"], ["26px","26"], ["28px","28"], ["36px","36"], ["48px","48"], ["72px","72"] ]
}
// 获取dom
function getById(id) {
  return document.getElementById(id);
}
// 格式化值,支持%、px，如果为数字，则添加px
function formatValue(value) {
  if(!value) return value;
  var reg = /^\d+(%|px)$/;
  if(reg.test(value)) {
    return value;
  }else {
    return `${value}px`
  }
}
// 初始化下拉框
function initSelect(id, data) {
  var itemArray = data.map(item => {
    var label = item;
    var value = item;
    if(Array.isArray(item)) {
      label = item[1];
      value = item[0];
    }
    return `<option value="${value}">${label}</option>`
  });
  var html = itemArray.join('');
  getById(id).innerHTML = html;
}
// 初始化字体、字号
initSelect('font-family', font.FontNameItem);
initSelect('font-size', font.FontSizeItem);

// 保留所有标签
var keepAll = getById('keep-all');
var keepList = getById('keep-list');
var keepTable = getById('keep-table');
var keepImage = getById('keep-image');
var keepObject = getById('keep-object');
var keepLink = getById('keep-link');
keepAll.addEventListener('change', function() {
  var arr = [keepList, keepTable, keepImage, keepObject, keepLink];
  arr.forEach(item =>{
    item.checked = keepAll.checked;
    item.disabled= keepAll.checked;
  })
})

// 去除标签
var removeAllAttributes = getById('remove-all-attributes');
var removeStyle = getById('remove-style');
var removeEvent = getById('remove-event');
removeAllAttributes.addEventListener('change', function() {
  var arr = [removeStyle, removeEvent];
  arr.forEach(item =>{
    item.checked = removeAllAttributes.checked;
    item.disabled= removeAllAttributes.checked;
  })
})

var keepTableStyle = getById('keep-table-style');
var removeEmptyLine = getById('remove-empty-line');
var mergeSpaces = getById('remove-extra-spaces');
var removeHiddenElement = getById('remove-hidden-elements');
var brTop = getById('br-to-p');
var imageCenter = getById('image-center');
var removeInterferenceWord = getById('remove-noise-words');
var removeInterferenceWordAuto = getById('remove-noise-words-auto');
var fullAngleToHalf = getById('full-angle-to-half-angle');
function defalutSetting() {
  // keepAll.click();
  removeAllAttributes.click();
  keepList.checked = true;
  keepTable.checked = true;
  keepImage.checked = true;
  // keepObject.checked = true;
  keepLink.checked = true;
  keepTableStyle.checked = true;
  removeEmptyLine.checked = true;
  mergeSpaces.checked = true;
  removeHiddenElement.checked = true;
  brTop.checked = true;
  imageCenter.checked = true;
  removeInterferenceWord.checked = true;
  removeInterferenceWordAuto.checked = true;
  fullAngleToHalf.checked = true;

}
defalutSetting();

function buildOptions() {
  let options = {
    keepAllTag: keepAll.checked,
    keepList: keepList.checked,
    keepTable: keepTable.checked,
    keepImage: keepImage.checked,
    keepObject: keepObject.checked,
    keepLink: keepLink.checked,
    keepTableStyle: keepTableStyle.checked,
    removeEmptyLine: removeEmptyLine.checked,
    mergeSpaces: mergeSpaces.checked,
    removeHiddenElement: removeHiddenElement.checked,
    removeAllAttribute: removeAllAttributes.checked,
    removeStyle: removeStyle.checked,
    removeEvent: removeEvent.checked,

    // preSegmentSpacing: getById('space-before-paragraph-checkbox').checked? getById('space-before-paragraph').value : undefined,
    // afterSegmentSpacing: getById('space-after-paragraph-checkbox').checked? getById('space-after-paragraph').value : undefined,
    // lineHeight: getById('line-height').value,
    fontFamily: getById('font-family').value,
    fontSize: getById('font-size').value,
    firstLineIndent: getById('text-indent').checked,
    justify: getById('text-align').checked,
    brTop: brTop.checked,
    tableBorderCollapse: getById('border-collapse').checked,

    imageCenter: imageCenter.checked,
    removeInterferenceWord: removeInterferenceWord.checked,
    // interferenceWord: '',
    fullAngleToHalf: getById('full-angle-to-half-angle').checked,
    removeTags: getById('unwrap-elements').value,
    // imageWidth: getById('image-width').value,
    // imageHeight: getById('image-height').value,
  }
  // 段前
  if(getById('space-before-paragraph-checkbox').checked) {
    options.preSegmentSpacing = getById('space-before-paragraph').value;
  }
  // 段后
  if(getById('space-after-paragraph-checkbox').checked) {
    options.afterSegmentSpacing = getById('space-after-paragraph').value;
  }
  // 行高
  if(getById('line-height-checkbox').checked) {
    options.lineHeight = getById('line-height').value;
  }
  // 去除干扰词
  if(options.removeInterferenceWord) {
    var typeEl = document.querySelector('input[name="removeNoiseWordsType"]:checked');
    var val = ''
    if(typeEl.value && typeEl.value !== 'auto') {
      val = typeEl.nextElementSibling.value;
    }
    options.interferenceWord = val;
  }
  // 图片宽度
  if(getById('image-width-checkbox').checked) {
    options.imageWidth = formatValue(getById('image-width').value);
  }
  // 图片高度
  if(getById('image-height-checkbox').checked) {
    options.imageHeight = formatValue(getById('image-height').value);
  }
  return options;
}
// 确定按钮
function okHandler(pendingFormatHtml) {
  var options = buildOptions();
  var format = new HTMLFormatter(options);
  // pendingFormatHtml = '<p><style></style><span style="display: none">ssss</span><span style="color:#2ecc71"><span style="background-color:#2ecc71">ggggggg</span></span>aaaaaa</p>\n'
  var result = format.format(pendingFormatHtml);
  return result;
}
