import Vue from 'vue';

// import QusnList from './questionnaireList';
// import BankList from './questionBank';
// import Statistic from './questionnaireStatistic';
// import QusnDataAdd from './questionnaireAddRecord';
import QusnList from './questionnaireListWrapper';
import BankList from './questionBankWrapper';
import Statistic from './questionnaireStatisticWrappper';
import QusnDataAdd from './questionnaireAddRecordWrapper';

import{loadScript} from '@/util/util';
import {setRuntime,getRuntime} from '@/util/runtime';

// 由于这里之后只有在ajax中才会用到，且用的时宿主环境的router信息，所有这里可以只设置一个空对象
const router = getRuntime('router');
if(!router) {
  setRuntime({
    router: {}
  })
}


const baseURL = process.env.BASE_URL;

if(!window.AvueQuestionnaireDesign) {
  const questionnaireDesinerUrl = `${baseURL}cdn/questionnaire-design/index.umd.min.js`
  loadScript(questionnaireDesinerUrl).then(()=>{
    //添加问卷设计器
    Vue.use(window.AvueQuestionnaireDesign);
  })
}

export {
  QusnList,
  BankList,
  Statistic,
  QusnDataAdd
}
