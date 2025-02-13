/**
 * 定义任务节点
 */
import baseTask from "./baseTask";

/*自定义--- 创建节点*/
//import deleteIcnh from "../assets/delete_h.svg";
import { defaultOptions, defaultStateStyles , deepAssignNoArr , startTaskOptions } from './cumStyle.js';


const {getCustomConfig} = baseTask

export default {
  ...baseTask,
  shapeType: 'startTask',

  options: {
    ...deepAssignNoArr( defaultOptions, startTaskOptions) ,
    stateStyles: deepAssignNoArr( defaultStateStyles, startTaskOptions.stateStyles),
  },

  getCustomConfig(cfg) {
    const config = getCustomConfig.call(this, cfg)
    const extAnchors = cfg.extAnchors || []
    // Object.assign(config.linkPoints, {
    //     top: false,
    //     bottom: true
    // })
    config.anchorPoints = [
      [0, 0.5],
      [1, 0.5],
      [0.5, 0],
      // [0.5, 1,'提交'],
      ...extAnchors
    ]
    return config
  },
  getAnchorPointType(anchorVal) {
    const inMap = ['0,0.5', '1,0.5', '0.5,0'];
    let res = 'out'
    if(inMap.includes(anchorVal)) {
      res = 'in'
    }
    return res
  }
}
