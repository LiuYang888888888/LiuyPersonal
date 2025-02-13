import enFaq from "./knowledgeMgr/faq"
import enFile from "./knowledgeMgr/file"
import enSmalltalk from "./knowledgeMgr/smalltalk"
import enDoc from "./knowledgeMgr/doc"
import enTable from "./knowledgeMgr/table"
import enKnowledgeTest from "./knowledgeTest"
import enKwRobotAnswer from "./kwRobotAnswer"
import enkwAudit from './kwAudit'
import enKwRobotManage from "./kwRobotManage"
import enKwRobotStudy from "./kwRobotStudy"
import enKnowledgeBatchTest from "./knowledgeBatchTest"
export default {
  ...enFaq,
  ...enFile,
  ...enSmalltalk,
  ...enDoc,
  ...enTable,
  ...enKnowledgeTest,
  ...enKwRobotAnswer,
  ...enkwAudit,
  ...enKwRobotManage,
  ...enKwRobotStudy,
  ...enKnowledgeBatchTest
}
