import aiccIntentionMgr from '../views/kwRobotManage/intentionMgr/index';
import aiccFaq from '../views/kwRobotManage/knowledgeMgr/faq';
import aiccFileMgr from '../views/kwRobotManage/knowledgeMgr/fileMgr';
import aiccSmalltalk from '../views/kwRobotManage/knowledgeMgr/smalltalk';
import aiccDocKnowledge from '../views/kwRobotManage/knowledgeMgr/docKnowledge';
import aiccTableKnowledge from '../views/kwRobotManage/knowledgeMgr/tableKnowledge';
import aiccDimensionMgr from '../views/kwRobotManage/knowledgeSetting/dimensionMgr';
import aiccAnswerPerspectMgr from '../views/kwRobotManage/knowledgeSetting/answerPerspectMgr';
import aiccFormSetting from '../views/kwRobotManage/knowledgeSetting/formSetting';
import aiccAuditSetting from '../views/kwRobotManage/knowledgeSetting/auditSetting';
import aiccKwRobotInstance from '../views/kwRobotManage/kwRobotInstance/index';
import aiccSessionModule from '../views/kwKnowledgeCenter/kwCompetence/sessionModule/index';
import aiccSessionModel from '../views/kwKnowledgeCenter/kwCompetence/sessionModel/index';
import aiccKwAudit from '../views/kwRobotManage/kwAudit/index';
import aiccKwRobotStudy from '../views/kwRobotManage/knowledgeOptimize/kwRobotStudy/index';
import aiccKnowledgeBatchTest from '../views/kwRobotManage/knowledgeOptimize/knowledgeBatchTest/index';
import aiccKnowledgeBaseTest from '../views/kwRobotManage/knowledgeTest/index';
import aiccKwRobotAnswer from '../views/kwRobotManage/kwRobotAnswer/index';
import aiccKwAuditIndex from '../views/kwRobotManage/kwAudit/index';

import aiccNotionalWords from '../views/aiCenter/thesaurusMgr/notionalWords/index';
import aiccProperWords from '../views/aiCenter/thesaurusMgr/properWords/index';
import aiccSynonym from '../views/aiCenter/thesaurusMgr/synonym/index';
import aiccSensitiveWords from '../views/aiCenter/thesaurusMgr/sensitiveWords/index';
import aiccPinyin from '../views/aiCenter/thesaurusMgr/pinyin/index';
import aiccWeight from '../views/aiCenter/thesaurusMgr/weight/index';
import aiccOccurrence from '../views/aiCenter/thesaurusMgr/occurrence/index';
import aiccPriority from '../views/aiCenter/thesaurusMgr/priority/index';
import aiccParticiple from '../views/aiCenter/thesaurusMgr/participle/index';
import aiccVariable from '../views/aiCenter/thesaurusMgr/variable/index';

export {
  aiccIntentionMgr,
  aiccFaq,
  aiccFileMgr,
  aiccSmalltalk,
  aiccDocKnowledge,
  aiccTableKnowledge,
  aiccDimensionMgr,
  aiccAnswerPerspectMgr,
  aiccFormSetting,
  aiccAuditSetting,
  aiccKwRobotInstance,
  aiccSessionModule,
  aiccSessionModel,
  aiccKwAudit,
  aiccKwRobotStudy,
  aiccKnowledgeBatchTest,
  aiccKnowledgeBaseTest,
  aiccKwRobotAnswer,
  aiccKwAuditIndex,
  aiccNotionalWords,
  aiccProperWords,
  aiccSynonym,
  aiccSensitiveWords,
  aiccPinyin,
  aiccWeight,
  aiccOccurrence,
  aiccPriority,
  aiccParticiple,
  aiccVariable
}


/*
1. 配置修改

1.1 vue.config.js 中添加 修改为
const publicPath = '/aicc/'
将单独打包的代码打开，整体打包的代码注释

1.2 /views/kwRobotManage/knowledgeMgr/faq
打包引入的的文件中 改为isRobotMenu: false 功能项的调用

1.3 /src/config/serviceList.js
将公用的微服务list 调整为aicc  ps:这步骤根据后端需要进行
ai: aicc-ai换成aicc-system (词要用)




2. 用下面的命令打包
//vue-cli-service build --target lib --name 打包后的变量名 --dest 目录 --formats umd-min 需要打包的文件路径

//npx vue-cli-service build --target lib --name KmForAicc --dest lib/KmForAicc --formats umd-min ./src/libByModule/kmForAicc.js

3. 将lib/Questionnaire 部署至服务器   得到访问地址 如： http://172.16.10.149:7777/KmForAicc/KmForAicc.umd.min.js
http://172.20.0.147:82/aicos-lib/KmForAicc/KmForAicc.umd.min.js

4. 添加菜单
  开启远程模块
  地址 上面的url 如： http://172.16.10.149:7777/KmForAicc/KmForAicc.umd.min.js
  变量 第二步的变量名或其子元素 如： KmForAicc.aiccKmFaq
*/
