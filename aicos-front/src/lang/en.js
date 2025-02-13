import enSystem from './en/system/index';
import enMywork from './en/mywork/index';
import enAiCenter from './en/aiCenter/index';
import enAppStore from './en/appStore/index';
import enKnowledgeSetting from "./en/knowledgeSetting/index"
import enKwCompetence from './en/kwCompetence/index';
import enRobotManage from './en/kwRobotManage/index';
import enKnowledge from './en/kwKnowledgeCenter/index';
import enCommon from './en/common';
import enRegx from "./en/regx"
import enMessage from "./en/message"
import enDefalut from './en/default';
import enExam from "./en/exam/index";
export default {
  ...enDefalut,
  ...enCommon,
  ...enRegx,
  ...enMessage,
  ...enSystem,
  ...enMywork,
  ...enAiCenter,
  ...enAppStore,
  ...enKnowledge,
  ...enKnowledgeSetting,
  ...enRobotManage,
  ...enKwCompetence,
  ...enExam
}
