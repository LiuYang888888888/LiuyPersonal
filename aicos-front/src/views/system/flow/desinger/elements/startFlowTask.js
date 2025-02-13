/**
 * 定义任务节点
 */
// import baseTask from "./baseTask";
//
// const {getCustomConfig} = baseTask
//import deleteIcn from '../assets/delete.svg'

/*自定义--- 开始节点*/
import deleteIcnh from "../assets/delete_h.svg";
import { defaultOptions, defaultStateStyles , deepAssignNoArr , startFlowTaskOptions } from './cumStyle.js';

export default {
  shapeType: 'startFlowTask',

  options: {
    ...deepAssignNoArr( defaultOptions, startFlowTaskOptions) ,
    stateStyles: deepAssignNoArr( defaultStateStyles, startFlowTaskOptions.stateStyles),
  },

  /*getCustomConfig() {
    const config = {
      size: 60,
      linkPoints: {
        left: true,
        right: true,
        bottom: true
      },
      anchorPoints: [
        [0, 0.5],
        [1, 0.5],
        // [0.5, 0],
        [0.5, 1]
      ]
    }
    return config
  },*/
  afterDraw(cfg, group) {
    // 处理锚点
    const allPoints = group.findAll(item => item.get('isAnchorPoint'))
    // console.log(allPoints)
    allPoints.forEach((item,index) => {
      item.set('draggable', true)
      item.set('anchorPointIdx', index)
      item.set('anchorPointType', 'out')
      item.attr({
        stroke: 'rgb(242, 153, 0)'
      })
    })

    if(cfg.stateIcon && !cfg.stateIcon.show) {
      return
    }
    group.addShape('image', {
      attrs: {
        img: deleteIcnh,
        x: -10,
        y: 15,
        width: 20,
        height: 20,
      },
      className: 'rect-state-icon',
      name: 'rect-state-icon',
      draggable: true,
    });

  }
}
