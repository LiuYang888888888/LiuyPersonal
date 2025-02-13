import { isNull } from '@/util/qsgCommon.js';

/*将前端格式的optionItem转换为 可保存的JSON frontJson backJson*/
export const makeApiJsonByDomitem = (row) => {
  let res = {
    frontJson: {},
    backJson: {}
  }

  let optionDicData = [];
  let optionBack = [];
  let optionNum = 0;

  row.optionItem.map((item) => {
    optionDicData.push(
      item
    );
    if (row.subjectType !== 5) {
      optionNum++;
      optionBack.push(
        item
      );
    }

  })

  let tempFrontJson = {
    type: 'radio',
    typeExam: 'radioExam',
    dicData: optionDicData,
    props: {
      label: 'label',
      value: 'value'
    },
    score: 0,
  }

  switch (row.subjectType) {
    case 1:
      tempFrontJson = {
        type: 'radio',
        typeExam: 'radioExam',
        icon: 'icon-radio',
        dicData: optionDicData,
        rowSet: 1,
        score: 0,
        props: {
          label: 'label',
          value: 'value'
        },
        scoringRule: 1,
        prop: row.prop,
        disChecked: row.disChecked
      }
      break;
    case 2:
      tempFrontJson = {
        type: 'checkbox',
        typeExam: 'checkboxExam',
        icon: 'icon-checkbox',
        dicData: optionDicData,
        rowSet: 1,
        maxAndMin: [0, optionNum],
        checkboxMin: 0,
        checkboxMax: optionNum,
        score: 0,
        props: {
          label: 'label',
          value: 'value'
        },
        scoringRule: 2,
        prop: row.prop,
        disChecked: row.disChecked
      }
      break;
    case 3:
      tempFrontJson = {
        type: 'radio',
        typeExam: 'estimateExam',
        icon: 'icon-select',
        inputWidthUnit: '%',
        inputWidth: 100,
        rowSet: 1,
        dicData: optionDicData,
        props: {
          label: 'label',
          value: 'value'
        },
        score: 0,
        scoringRule: 1,
        prop: row.prop,
        disChecked: row.disChecked
      }
      break;
    case 4:
      tempFrontJson = {
        type: 'input',
        typeExam: 'inputExam',
        icon: 'icon-input',
        inputWidthUnit: '%',
        inputWidth: 100,
        score: 0,
        dicData: optionDicData,
        scoringRule: 3,
        prop: row.prop
      }
      break;
    case 5:
      tempFrontJson = {
        type: 'textarea',
        typeExam: 'textareaExam',
        icon: 'icon-textarea',
        inputWidthUnit: '%',
        inputWidth: 100,
        inputRow: 3,
        score: 0,
        referenceAnswer: row.referenceAnswer,
        scoringRule: 4,
        prop: row.prop
      }
      break;
    case 6:
      tempFrontJson = {
        type: 'html',
        typeExam: 'htmlExam',
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
    problemAnalysis: row.problemAnalysis
  }

  const backJsonRes = {
    label: row.bankSubjectName,
    subjectType: row.subjectType,
    dicData: optionBack,
    problemAnalysis: row.problemAnalysis,
  }
  if (row.subjectType === 5) {
    backJsonRes.referenceAnswer = row.referenceAnswer
  }

  res = {
    frontJson: frontJsonRes,
    backJson: backJsonRes,
    optionNum: optionNum,
  }

  return res

}

/*将后端backJson 转换为 前端 frontJson ，处理批量导入的题目frontJson为空的情况*/
export const makeFrontJsonByBackJson = (backJson) => {
  let res = '';
  if (!isNull(backJson)) {

    let tempRes = {};
    let tempJson = JSON.parse(backJson);
    let tempDicData = tempJson.dicData.map(item => item);
    let tempRow = {
      bankSubjectName: tempJson.label,
      subjectType: tempJson.subjectType,
      optionItem: tempDicData,
    }

    tempRes = makeApiJsonByDomitem(tempRow);

    res = JSON.stringify(tempRes.frontJson)
  }

  return res
}