
import menu from './menu'
import tenant from './tenant'
import resource from './resource'
import dict from "./dict"
import param from './param'
import vendor from './vendor'
import syncAllSet from './syncAllSet'
import asrAndTts from './asrAndTts'
import logs from './logs'
import user from './user'
import role from './role'
import dept from "./dept"
export default {
  system: {
    ...menu,
    ...resource,
    ...dict,
    ...param,
    ...tenant,
    ...vendor,
    ...syncAllSet,
    ...asrAndTts,
    ...logs,
    ...user,
    ...role,
    ...dept

  }
}
