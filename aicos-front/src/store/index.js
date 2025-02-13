import Vue from 'vue'
import Vuex from 'vuex'
import user from './modules/user'
import common from './modules/common'
import tags from './modules/tags'
import logs from './modules/logs'
import dict from './modules/dict'
import getters from './getters'
import system from './modules/system'
import thesaurusMgr from './modules/thesaurusMgr'
import knowledgeBot from './modules/kwKnoweldegeRobot'
import aiMagement from './modules/aiMagement'

Vue.use(Vuex)
const store = new Vuex.Store({
  modules: {
    user,
    common,
    logs,
    tags,
    dict,
    system,
    thesaurusMgr,
    aiMagement,
    knowledgeBot
  },
  getters,
})
// 获取未登录前的参数
// store.dispatch('getFrontparam')
setTimeout(()=>{
  store.dispatch('getFrontparam');
}, 100)

export default store
