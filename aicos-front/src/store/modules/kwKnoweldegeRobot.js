const knowledgeBot = {
  state: {
    botObj: false,
    instanceObj: {},
    robotState: false,
    unknownQuestionReplies: ''
  },
  mutations: {
    SET_BOTOBJ: (state, botObj) => {
      state.botObj = botObj
    },
    SET_InstanceOBJ: (state, instanceObj) => {
      state.instanceObj = instanceObj
    },
    SET_ROBOTSTATE: (state, robotState) => {
      state.robotState = robotState
    },
    SET_UNKNOWNQUESTIONREPLIES: (state, unknownQuestionReplies) => {
      state.unknownQuestionReplies = unknownQuestionReplies
    }
  },
  actions: {}
}
export default knowledgeBot
