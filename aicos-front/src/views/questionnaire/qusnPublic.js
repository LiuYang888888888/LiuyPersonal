import { isNull } from '@/util/qsgCommon.js';

/*将前端格式的optionItem转换为 可保存的JSON frontJson backJson*/
export const makeApiJsonByDomitem = (row) =>{   
  let res = {
    frontJson: {},
    backJson: {}
  }

  let optionDicData = [];
  let optionBack = [];
  let optionNum = 0;

  row.optionItem.map((item)=>{
    optionDicData.push(
      { label: item, value: '0', checked: false, canInput: false, },
    );
    if( row.subjectType == 1 || row.subjectType == 2 || row.subjectType == 3  ){
      optionNum++;
      optionBack.push(
        { 'label': item }
      );
    }
    
  })

  let tempFrontJson = {
    type: 'radio',
    typeQusn: 'radioQusn',
    dicData: optionDicData ,
    props: {
      label: 'label',
      value: 'value'
    }
  }

  switch(row.subjectType){
    case 1:
      tempFrontJson = {
        type: 'radio',
        typeQusn: 'radioQusn',
        icon: 'icon-radio',
        dicData: optionDicData ,
        rowSet: 1,
        props: {
          label: 'label',
          value: 'value'
        }
      }
      break;
    case 2:
      tempFrontJson = {
        type: 'checkbox',
        typeQusn: 'checkboxQusn',
        icon: 'icon-checkbox',
        dicData: optionDicData ,
        rowSet: 1,
        maxAndMin: [0 ,optionNum],
        checkboxMin: 0,
        checkboxMax: optionNum,
        props: {
          label: 'label',
          value: 'value'
        }
      }
      break;
    case 3:
      tempFrontJson = {
        type: 'select',
        typeQusn: 'selectQusn',
        icon: 'icon-select',
        inputWidthUnit: '%',
        inputWidth: 100,
        dicData: optionDicData ,
        props: {
          label: 'label',
          value: 'value'
        }
      }
      break;
    case 4:
      tempFrontJson = {
        type: 'input',
        typeQusn: 'inputQusn',
        icon: 'icon-input',
        inputWidthUnit: '%',
        inputWidth: 100,
      }
      break;
    case 5:
      tempFrontJson = {
        type: 'textarea',
        typeQusn: 'textareaQusn',
        icon: 'icon-textarea',
        inputWidthUnit: '%',
        inputWidth: 100,
        inputRow: 3,
      }
      break;
    case 6:
      tempFrontJson = {
        type: 'html',
        typeQusn: 'htmlQusn',
        icon: 'icon-richtext',
      }
      break;
    default:

  }

  const frontJsonRes = {
    ...tempFrontJson,
    subjectType: row.subjectType,
    label: row.bankSubjectName,
    display: true,
  }

  const backJsonRes = {
    label: row.bankSubjectName,
    subjectType: row.subjectType,
    dicData: optionBack,
  }

  res = {
    frontJson: frontJsonRes,
    backJson: backJsonRes,
    optionNum: optionNum,
  }

  return res

}

/*将后端backJson 转换为 前端 frontJson ，处理批量导入的题目frontJson为空的情况*/
export const makeFrontJsonByBackJson = (backJson) =>{
  let res = '';
  if(!isNull(backJson)){

    let tempRes = {};
    let tempJson = JSON.parse(backJson);
    let tempDicData = tempJson.dicData.map(item=>item.label);
    let tempRow = {
      bankSubjectName: tempJson.label,
      subjectType: tempJson.subjectType,
      optionItem: tempDicData,
    }
    
    tempRes = makeApiJsonByDomitem(tempRow);
    
    res = JSON.stringify ( tempRes.frontJson ) 
  }
  
  return res
}