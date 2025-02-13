/**
 * 定义任务节点
 */
import baseTask from "./baseTask";

const {getCustomConfig} = baseTask

export default {
  ...baseTask,
  shapeType: 'pluginTask',
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
  }
}
