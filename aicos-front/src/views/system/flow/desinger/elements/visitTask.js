/**
 * 定义任务节点
 */
import baseTask from "./baseTask";

/*自定义--- 创建节点*/
//import deleteIcnh from "../assets/delete_h.svg";
import { defaultOptions, defaultStateStyles , deepAssignNoArr , visitTaskOptions } from './cumStyle.js';


//const {getCustomConfig} = baseTask

export default {
  ...baseTask,
  shapeType: 'visitTask',

  options: {
    ...deepAssignNoArr( defaultOptions, visitTaskOptions) ,
    stateStyles: deepAssignNoArr( defaultStateStyles, visitTaskOptions.stateStyles),
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
