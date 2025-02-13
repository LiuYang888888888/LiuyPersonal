/**
 * 子流程
 */

import baseTask from "./baseTask";

/*自定义--- 子流程节点*/
//import deleteIcnh from "../assets/delete_h.svg";
import { defaultOptions, defaultStateStyles , deepAssignNoArr , subProcessOptions } from './cumStyle.js';


const {getCustomConfig} = baseTask

export default {
  ...baseTask,
  shapeType: 'subProcess',

  options: {
    ...deepAssignNoArr( defaultOptions, subProcessOptions) ,
    stateStyles: deepAssignNoArr( defaultStateStyles, subProcessOptions.stateStyles),
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
      [0.5, 1],
      ...extAnchors
    ]
    return config
  },
  getAnchorPointType() {
    // const inMap = ['0,0.5', '1,0.5', '0.5,0', '0.5,1'];
    let res = 'in-out'
    // if(inMap.includes(anchorVal)) {
    //   res = 'in'
    // }
    return res
  }
}
