import zhFaq from "./knowledgeMgr/faq"
import zhFile from "./knowledgeMgr/file"
import zhSmalltalk from "./knowledgeMgr/smalltalk"
import zhDoc from "./knowledgeMgr/doc"
import zhTable from "./knowledgeMgr/table"
import zhKnowledgeTest from "./knowledgeTest"
import zhKwRobotAnswer from "./kwRobotAnswer"
import zhkwAudit from './kwAudit'
import zhKwRobotManage from "./kwRobotManage"
import zhKwRobotStudy from "./kwRobotStudy"
import zhKnowledgeBatchTest from "./knowledgeBatchTest"
export default {
  ...zhFaq,
  ...zhFile,
  ...zhSmalltalk,
  ...zhDoc,
  ...zhTable,
  ...zhKnowledgeTest,
  ...zhKwRobotAnswer,
  ...zhkwAudit,
  ...zhKwRobotManage,
  ...zhKwRobotStudy,
  ...zhKnowledgeBatchTest
}
