/**
 * 定义节点链接线的样式
 */
//import deleteIcn from '../assets/delete.svg';
import deleteIcnb from "../assets/delete_b.svg";

export default {
  afterDraw(cfg, group) {
    // 获取图形组中的第一个图形，在这里就是边的路径图形
    const shape = group.get('children')[0];
    // 获取路径图形的中点坐标
    const midPoint = shape.getPoint(0.5);
    // 在中点增加一个矩形，注意矩形的原点在其左上角
    // group.addShape('rect', {
    //     attrs: {
    //         width: 10,
    //         height: 10,
    //         fill: '#f00',
    //         // x 和 y 分别减去 width / 2 与 height / 2，使矩形中心在 midPoint 上
    //         x: midPoint.x - 5,
    //         y: midPoint.y - 5,
    //     },
    // });
    // debugger
    const sourceModel = cfg.sourceNode.getModel()
    let targetModel = {}
    if(cfg.targetNode) {
      targetModel = cfg.targetNode.getModel()
    }
    // 如果连线的两边都没有stateIcon,线上也不添加
    if(sourceModel.stateIcon && !sourceModel.stateIcon.show || targetModel.stateIcon && !targetModel.stateIcon.show) {
      return
    }
    group.addShape('image', {
      attrs: {
        // ...iconStyle,
        img: deleteIcnb,
        x: midPoint.x - 10,
        y: midPoint.y - 10,
        width: 20,
        height: 20,
      },
      className: 'rect-state-icon',
      name: 'rect-state-icon',
      draggable: true,
    });
  },
  update: undefined

}
