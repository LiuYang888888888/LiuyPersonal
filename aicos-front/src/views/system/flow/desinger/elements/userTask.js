/**
 * 定义任务节点
 */
import baseTask from "./baseTask";

/*自定义--- 结束节点*/
//import deleteIcnh from "../assets/delete_h.svg";
import { defaultOptions, defaultStateStyles , deepAssignNoArr , userTaskOptions } from './cumStyle.js';

//const {getCustomConfig} = baseTask ;

export default {
  ...baseTask,
  shapeType: 'userTask',

  options: {
    ...deepAssignNoArr( defaultOptions, userTaskOptions) ,
    stateStyles: deepAssignNoArr( defaultStateStyles, userTaskOptions.stateStyles),
  },


  /*getCustomConfig(cfg) {
    return getCustomConfig.call(this, cfg)
  },*/
  getAnchorPointType(anchorVal) {
    const inMap = ['0,0.5', '1,0.5', '0.5,0'];
    let res = 'out'
    if(inMap.includes(anchorVal)) {
      res = 'in'
    }
    return res
  }
}
