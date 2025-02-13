import aihumanIntentionMgr from '../views/kwRobotManage/intentionMgr/index';
import aihumanFaq from '../views/kwRobotManage/knowledgeMgr/faq';
import aihumanFileMgr from '../views/kwRobotManage/knowledgeMgr/fileMgr';
import aihumanSmalltalk from '../views/kwRobotManage/knowledgeMgr/smalltalk';
import aihumanDocKnowledge from '../views/kwRobotManage/knowledgeMgr/docKnowledge';
import aihumanTableKnowledge from '../views/kwRobotManage/knowledgeMgr/tableKnowledge';
import aihumanDimensionMgr from '../views/kwRobotManage/knowledgeSetting/dimensionMgr';
import aihumanAnswerPerspectMgr from '../views/kwRobotManage/knowledgeSetting/answerPerspectMgr';
import aihumanFormSetting from '../views/kwRobotManage/knowledgeSetting/formSetting';
import aihumanAuditSetting from '../views/kwRobotManage/knowledgeSetting/auditSetting';
import aihumanKwRobotInstance from '../views/kwRobotManage/kwRobotInstance/index';
import aihumanSessionModule from '../views/kwKnowledgeCenter/kwCompetence/sessionModule/index';
import aihumanSessionModel from '../views/kwKnowledgeCenter/kwCompetence/sessionModel/index';
import aihumanKwAudit from '../views/kwRobotManage/kwAudit/index';
import aihumanNotionalWords from '../views/aiCenter/thesaurusMgr/notionalWords/index';
import aihumanProperWords from '../views/aiCenter/thesaurusMgr/properWords/index';
import aihumanSynonym from '../views/aiCenter/thesaurusMgr/synonym/index';
import aihumanSensitiveWords from '../views/aiCenter/thesaurusMgr/sensitiveWords/index';
import aihumanPinyin from '../views/aiCenter/thesaurusMgr/pinyin/index';
import aihumanWeight from '../views/aiCenter/thesaurusMgr/weight/index';
import aihumanOccurrence from '../views/aiCenter/thesaurusMgr/occurrence/index';
import aihumanPriority from '../views/aiCenter/thesaurusMgr/priority/index';
import aihumanParticiple from '../views/aiCenter/thesaurusMgr/participle/index';
import aihumanVariable from '../views/aiCenter/thesaurusMgr/variable/index';

import aihumanTemplateSetting from '../views/kwKnowledgeCenter/kwSettings/templateSetting/index';
import aihumanKwRobotStudy from '../views/kwRobotManage/knowledgeOptimize/kwRobotStudy/index';
import aihumanKnowledgeBatchTest from '../views/kwRobotManage/knowledgeOptimize/knowledgeBatchTest/index';
import aihumanKnowledgeBaseTest from '../views/kwRobotManage/knowledgeTest/index';
import aihumanKwRobotAnswer from '../views/kwRobotManage/kwRobotAnswer/index';
import aihumanKwAuditIndex from '../views/kwRobotManage/kwAudit/index';



export {
  aihumanIntentionMgr,
  aihumanFaq,
  aihumanFileMgr,
  aihumanSmalltalk,
  aihumanDocKnowledge,
  aihumanTableKnowledge,
  aihumanDimensionMgr,
  aihumanAnswerPerspectMgr,
  aihumanFormSetting,
  aihumanAuditSetting,
  aihumanKwRobotInstance,
  aihumanSessionModule,
  aihumanSessionModel,
  aihumanKwAudit,
  aihumanNotionalWords,
  aihumanProperWords,
  aihumanSynonym,
  aihumanSensitiveWords,
  aihumanPinyin,
  aihumanWeight,
  aihumanOccurrence,
  aihumanPriority,
  aihumanParticiple,
  aihumanVariable,

  aihumanTemplateSetting,
  aihumanKwRobotStudy,
  aihumanKnowledgeBatchTest,
  aihumanKnowledgeBaseTest,
  aihumanKwRobotAnswer,
  aihumanKwAuditIndex
}


/*
1. 配置修改

1.1 vue.config.js 中添加 修改为
const publicPath = '/aimetaflow/'
将单独打包的代码打开，整体打包的代码注释

1.2 /views/kwRobotManage/knowledgeMgr/faq
打包引入的的文件中 改为isRobotMenu: false 功能项的调用

1.3 /src/config/serviceList.js
将公用的微服务list 调整为aihuman  ps:这步骤根据后端需要进行

1.4 src/config/website.js
将其内设置修改为目标系统的值  特别是 key 




2. 用下面的命令打包
//vue-cli-service build --target lib --name 打包后的变量名 --dest 目录 --formats umd-min 需要打包的文件路径

npx vue-cli-service build --target lib --name KmForAiHuman --dest lib/KmForAiHuman --formats umd-min ./src/libByModule/kmForAiHuman.js

3. 将lib/Questionnaire 部署至服务器   得到访问地址 如： http://172.16.10.149:7777/KmForaihuman/KmForaihuman.umd.min.js
http://172.20.0.147:82/aicos-lib/KmForAiHuman/KmForAiHuman.umd.min.js

4. 添加菜单
  开启远程模块
  地址 上面的url 如： http://172.16.10.149:7777/KmForAiHuman/KmForAiHuman.umd.min.js
  变量 第二步的变量名或其子元素 如： KmForAiHuman.AiHumanKmFaq
*/
