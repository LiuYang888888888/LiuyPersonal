import zhDefalut from './zh/default';
import zhCommon from './zh/common';
import zhRegx from "./zh/regx"
import zhMessage from "./zh/message"
import zhKnowledge from './zh/kwKnowledgeCenter/index';
import zhRobotManage from './zh/kwRobotManage/index';
import zhKwCompetence from './zh/kwCompetence/index';
import zhSystem from './zh/system/index';
import zhMywork from './zh/mywork/index';
import zhAiCenter from './zh/aiCenter/index';
import zhAppStore from './zh/appStore/index';
import zhKnowledgeSetting from "./zh/knowledgeSetting/index"
import zhExam from "./zh/exam/index";
export default {
  ...zhDefalut,
  ...zhCommon,
  ...zhRegx,
  ...zhMessage,
  ...zhKnowledge,
  ...zhRobotManage,
  ...zhKwCompetence,
  ...zhSystem,
  ...zhMywork,
  ...zhAiCenter,
  ...zhAppStore,
  ...zhKnowledgeSetting,
  ...zhExam
}
