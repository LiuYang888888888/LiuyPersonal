import Vue from 'vue';

import ExamManage from '../views/exam/examManage';
import ExamList from '../views/exam/examList';
import MarkExamPapers from '../views/exam/markExamPapers';
import BankList from '../views/exam/bankList';
import Statistic from '../views/exam/statistic';
import AnswerSheet from '../views/exam/answerSheet';
import CorrectExam from '../views/exam/correctExam';
import ExamDataAdd from "../views/exam/examDataAdd";

import { loadScript } from '@/util/util';

const baseURL = process.env.BASE_URL;

if (!window.AvueExamDesign) {
  const examDesignUrl = `${baseURL}cdn/exam-design/index.umd.min.js`
  loadScript(examDesignUrl).then(() => {
    Vue.use(window.AvueExamDesign)
  })
}

export {
  ExamManage,
  ExamList,
  MarkExamPapers,
  BankList,
  Statistic,
  AnswerSheet,
  CorrectExam,
  ExamDataAdd
}

/*
1. api/questionnaire/index.js
将单独打包的代码打开，整体打包的代码注释

1.1.src/component.js 目录下cdn 设计器 可不引入

1.2 将文件中的 src\components\QusnView\index.vue 修改为  尽量少使用this.$store.state.
  1247# const systemParamFileType = 'jpg,jpeg,gif,png,pdf,xlsx,xls,doc,docx,mp3,wav,txt,mp4';

1.3 request 调整

1.3.1 改涉及到的API文件里的request
const request = Vue.axios; 
或
import request from '@/utils/request.js';

1.3.2 ##此方案待验证是否有影响## src\router\axios.js
#29 //const getRouter = ().... 
#173  // const router = await getRouter();
#174  // parentProjectRouter 在使用远程加载模块时会有值
#175  // const curRouter = router.parentProjectRouter || router
#210 改为store.dispatch('FedLogOut').then(() => { window.location.href = '/login'; })
注释掉   不要引入import('@/router/router')




2. 用下面的命令打包
//vue-cli-service build --target lib --name 打包后的变量名 --dest 目录 --formats umd-min 需要打包的文件路径

//npx vue-cli-service build --target lib --name Questionnaire --dest lib/Questionnaire --formats umd-min ./src/libByModule/questionnaire.js

npx vue-cli-service build --target lib --name Exam --dest lib/Exam --formats umd-min ./src/libByModule/exam.js   

3. 将lib/Questionnaire 部署至服务器   得到访问地址 如： http://172.16.10.149:28885/EXam/Exam.umd.min.js

4. 添加菜单 
  开启远程模块 
  地址 上面的url 如： http://172.16.10.149:28885/Exam/Exam.umd.min.js
  变量 第二步的变量名或其子元素 如： Exam.BankList
*/

