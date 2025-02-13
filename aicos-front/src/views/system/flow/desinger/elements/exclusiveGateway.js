/**
 * 定义服务节点
 */
import baseTask from "./baseTask";


/*自定义--- 分支节点*/
//import deleteIcnh from "../assets/delete_h.svg";
import { defaultOptions, defaultStateStyles , deepAssignNoArr , exclusiveGatewayOptions } from './cumStyle.js';


const {getCustomConfig} = baseTask

export default {
  ...baseTask,
  shapeType: 'exclusiveGateway',

  options: {
    ...deepAssignNoArr( defaultOptions, exclusiveGatewayOptions) ,
    stateStyles: deepAssignNoArr( defaultStateStyles, exclusiveGatewayOptions.stateStyles),
  },

  getCustomConfig(cfg) {
    const config = getCustomConfig.call(this, cfg)
    const extAnchors = cfg.extAnchors || []
    // Object.assign(config.linkPoints, {
    //     top: false,
    //     bottom: true
    // })
    config.anchorPoints = [
      // [0, 0.5],
      // [1, 0.5],
      [0.5, 0],
      // [0.5, 1,'开始'],
      ...extAnchors
    ]
    return config
  },
  getAnchorPointType(anchorVal) {
    const inMap = ['0.5,0'];
    let res = 'out'
    if(inMap.includes(anchorVal)) {
      res = 'in'
    }
    return res
  }
}
