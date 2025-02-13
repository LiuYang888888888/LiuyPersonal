import dimensionManage from "./dimensionManage";
import answerViewManage from './answerViewManage'
import kwIntentionManage from './kwIntentionManage'
import kwFaqManagement from './kwFaqManagement'
import TemplateSetting from './templateSetting'
import kwTemplateSetting from './kwTemplateSetting'
import formsetting from "./formsetting"
export default {
  kwFaqManage: {
    msg: '测试',

  },
  ...dimensionManage,
  ...answerViewManage,
  ...kwIntentionManage,
  ...kwFaqManagement,
  ...TemplateSetting,
  ...kwTemplateSetting,
  ...formsetting
}
