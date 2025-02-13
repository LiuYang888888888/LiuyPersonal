/**
 * 作为其他节点的基础配置
 */
import {Global, Shape} from "@antv/g6";
import deleteIcn from '../assets/delete.svg'

export default {
  options: {
    ...Shape.Node.getShape('modelRect').options,
    stateStyles: {
      ...Global.nodeStateStyles,
    }
  },
  getCustomConfig({extAnchors = []}) {
    return {
      logoIcon: false,
      stateIcon: {
        img: deleteIcn,
        width: 20,
        height: 20
      },
      linkPoints: {
        top: true,
        right: true,
        left: true,
        stroke: 'rgb(95, 149, 255)',
        fill: 'rgb(247, 250, 255)'
      },
      /*labelCfg: {
        offset: 10
      },*/
      anchorPoints: [
        [0, 0.5],
        [1, 0.5],
        [0.5, 0],
        ...extAnchors
        // [0.5, 1]
      ]
    }
  },
  afterDraw(cfg, group) {
    // 处理锚点
    // const allPoints = group.findAll(item => item.get('isAnchorPoint'))
    // console.log(allPoints)
    // allPoints.forEach((item,index) => {
    //     item.set('draggable', true)
    //     item.set('anchorPointIdx', index)
    // })
    // 处理label信息
    /*重新定义一些属性*/

    const width = this.getOptions(cfg).size[0];
    const height = this.getOptions(cfg).size[1];

    const Label = group.find(item => item.get('name') === 'text-shape');
    Label.attr('x', 0);
    Label.attr('y', ( 4-(height /4)) );

    const pre = group.find(item => item.get('name') === 'pre-rect');
    pre.attr('width', width);
    pre.attr('height', height / 2 );

    // 处理删除按钮信息
    const delIcon = group.find(item => item.get('name') === 'rect-state-icon')
    if(delIcon) {
      delIcon.attr('x', (width - 30) / 2 -20 );
      delIcon.attr('y', ( -(height /4) - 8) );
    }

    this.drawLine(cfg, group)
  },
  drawLine(cfg, group) {
    const {linkPoints = {}} = this.getOptions(cfg);
    const {size: markSize, r: markR} = linkPoints;
    const r = markSize / 2 || markR || 5
    const [width] = this.getSize(cfg)
    const style = {
      path: [
        ['M', -width / 2 + r, 0],
        ['L', width / 2 - r, 0]
      ],
      stroke: '#c5c5c5'
    }
    group.addShape('path', {
      attrs: style,
      // className: `${this.type}-keyShape`,
      name: `rect-split-line`,
      draggable: true,
    });
  },
  /**
   * 重写drawLinkPoints方法，根据anchorPoints去生成
   * @param cfg
   * @param group
   */
  drawLinkPoints(cfg, group) {
    const {linkPoints = {}, anchorPoints = []} = this.getOptions(cfg);

    // const { top, left, right, bottom, size: markSize, r: markR, ...markStyle } = linkPoints;
    const {size: markSize, r: markR, ...markStyle} = linkPoints;
    const size = this.getSize(cfg);
    const width = size[0];
    const height = size[1];

    // 缓存width，更新时用
    this.oldWidth = width


    // 自定义配置项，查看时隐藏锚点
    if(cfg.hideAnchorPoints) {
      return
    }
    anchorPoints.forEach((item, index) => {
      const x = (item[0] - 0.5) * width;
      const y = (item[1] - 0.5) * height;

      const attrs = {
        ...markStyle,
        x,
        y,
        r: markSize / 2 || markR || 5
      }

      this.addAnchor(item, attrs, group, index/*, cfg.hideAnchorPoints*/)
    })

  },
  addAnchorPointText(opt, group) {
    const fontSize = 14
    // const textWidth = this.getTextWidth(opt.text, fontSize)
    const x = opt.x
    // const y = opt.y - (opt.text.length > 4 ? 0 : fontSize)
    const y = opt.y - fontSize -5
    const text = group.addShape('text', {
      attrs: {
        text: opt.text,
        x,
        y,
        fontSize,
        fill: '#595959',
        // stroke: '#000',
        textBaseline: 'middle',
        textAlign: 'center'
        // ...iconStyle,
      },
      className: 'link-point-cls-text',
      name: 'link-point-text' + opt.text,
      draggable: true,
    });
    // if (opt.text.length > 4) {
    //   text.rotateAtStart(Math.PI / 4)
    //   text.translate(10, -10)
    // }
    return text
  },
  addAnchor(item, attrs, group, index/*, onlyShowText*/) {
    let textNode
    if (item[2]) {
      textNode = this.addAnchorPointText({
        x: attrs.x,
        y: attrs.y,
        text: item[2]
      }, group, item);
    }
    let anchorVal = item.join()
    // 第三个值用来标识节点，解决节点文字变更时的更新问题
    if(item[3]) {
      anchorVal = item[3]
    }
    const anchorPointType = this.getAnchorPointType && this.getAnchorPointType(anchorVal)
    if(anchorPointType === 'out') {
      attrs.stroke= 'rgb(242, 153, 0)'
    }else if(anchorPointType === 'in-out') {
      attrs.stroke= 'rgb(144, 217, 82)'
    }
    // if(onlyShowText) {
    //   return
    // }
    group.addShape('circle', {
      attrs: attrs,
      className: 'link-point-cls',
      // name 不唯一再使用click-select behavior 时有，点的x,y坐标不正确了
      // name 不唯一，造成originStyle存储有误
      name: 'link-point-' + anchorVal,
      isAnchorPoint: true,
      anchorPointIdx: index,
      anchorVal: anchorVal,
      anchorPointType,
      textNode,
      draggable: true
    });
  },
  isAnchorsChange(allExistedAnchors, anchorPoints, anchorPointsStr) {
    if(allExistedAnchors.length !== anchorPointsStr.length) {
      return true
    }
    for(let i = 0,l = allExistedAnchors.length; i<l; i++) {
      const item = allExistedAnchors[i]
      const anchorVal = item.get('anchorVal')
      const index = anchorPointsStr.indexOf(anchorVal)
      const textNode = item.get('textNode')

      if(index !== -1) {
        const anchorPoint = anchorPoints[index]
        const textChange = anchorPoint[2] && textNode && anchorPoint[2] !== textNode.attr('text')
        if(textChange) {
          return true
        }
      }else {
        return true
      }
    }
    return false
  },
  updateLinkPoints(cfg, group) {
    const {linkPoints = {}, anchorPoints = []} = this.getOptions(cfg);
    const {fill: markFill, stroke: markStroke, lineWidth: borderWidth} = linkPoints;
    let markSize = linkPoints.size / 2;
    if (!markSize) markSize = linkPoints.r;
    const size = this.getSize(cfg);
    const width = size[0];
    const height = size[1];

    const styles = {
      r: markSize,
      fill: markFill,
      stroke: markStroke,
      lineWidth: borderWidth,
    };
    const allExistedAnchors = group.findAll(element => {
      return element.get('isAnchorPoint')
    });
    // console.log(allExistedAnchors.map(item =>({x: item.attrs.x,y: item.attrs.y})))
    const anchorPointsStr = anchorPoints.map(item => {
      if(item[3]) {
        return item[3]
      }else {
        return item.join()
      }
    })
    let existedAnchors = []
    let hasAnchorChange = this.isAnchorsChange(allExistedAnchors, anchorPoints, anchorPointsStr)

    if(!hasAnchorChange) {
      return
    }

    this.changedAnchors = []
    // 删除不存在的锚点, 更新已存在的点的index值
    allExistedAnchors.forEach(item => {
      const anchorVal = item.get('anchorVal')
      const index = anchorPointsStr.indexOf(anchorVal)
      const textNode = item.get('textNode')

      if (index === -1) {
        if (textNode) {
          textNode.remove()
        }
        this.changedAnchors.push({oldVal: item.get('anchorPointIdx'), action: 'del'})
        item.remove()
      } else {
        const anchorPoint = anchorPoints[index]
        const textChange = anchorPoint[2] && textNode && anchorPoint[2] !== textNode.attr('text')

        // 更新文字节点
        if(textChange) {
          textNode.attr({text: anchorPoint[2]})
        }
        if(!this.isWidthChanged(width) || hasAnchorChange) {
          const newX = (anchorPoint[0] - 0.5) * width;
          const newY = (anchorPoint[1] - 0.5) * height;
          item.attr({
            x: newX,
            y: newY
          })
          if(textNode) {
            textNode.attr({
              x: newX,
              // y: newY
            })
          }
        }
        // item.attr({
        //   ...styles
        // });
        // 更新index值
        const oldVal = item.get('anchorPointIdx');
        if(oldVal !== index) {
          this.changedAnchors.push({oldVal: item.get('anchorPointIdx'), action: 'change', newVal: index})
          item.set('anchorPointIdx', index)
        }
        existedAnchors.push(anchorVal)
      }
    });

    // 将不存在的节点添加进来
    anchorPoints.forEach((item, index) => {
      let anchorVal = item.join()
      if(item[3]) {
        anchorVal = item[3]
      }
      if (!existedAnchors.includes(anchorVal)) {
        const x = (item[0] - 0.5) * width;
        const y = (item[1] - 0.5) * height;

        const attrs = {
          x,
          y,
          ...styles
        }
        this.addAnchor(item, attrs, group, index)
      }
    })

  },
  isWidthChanged(width) {
    return width === this.oldWidth
  },
  afterUpdate(cfg, item) {
    const group = item.getContainer();
    const [width/*,height*/] = this.getSize(cfg);
    //console.log(width,height)
    const {linkPoints = {}, stateIcon} = this.getOptions(cfg);
    const {size: markSize, r: markR} = linkPoints;
    const r = markSize / 2 || markR || 5

    // 修改label
    const Label = group.find(item => item.get('name') === 'text-shape');
    Label.attr('x', Label.attr('x') - 16)


    // 默认宽度为185
    if (!this.isWidthChanged()) {
      // 宽度发生变化时需要更新 stateIconShape
      const delIcon = group.find(item => item.get('name') === 'rect-state-icon')
      delIcon.attr('x', width / 2 - delIcon.attr('width') + stateIcon.offset)
      // 更新线
      const splitLine = group.find(item => item.get('name') === 'rect-split-line')
      splitLine.attr({
        path: [
          ['M', -width / 2 + r, 0],
          ['L', width / 2 - r, 0]
        ]
      })
    }

    // 更新删除的锚点的连接线
    if(this.changedAnchors && this.changedAnchors.length > 0) {
      item.getOutEdges().forEach(edge => {
        const model = edge.getModel()
        const find = this.changedAnchors.find(item => item.oldVal === model.sourceAnchor)
        if(find) {
          // item.removeEdge(edge)
          if(find.action === 'del') {
            // 不能直接destroy,直接destroy后获取整个流程图数据的时候报错
            edge.needRemove = true
          }else {
            // edge.set('sourceAnchor', find.newVal)
            model.sourceAnchor = find.newVal
          }
        }
      })
      // this.removedAnchors
    }
    // 更新完成后更新缓存
    this.oldWidth = width;

    this.afterDraw(cfg, group);


  },
  // 获取文本长度
  // getTextWidth(text, fontSize) {
  //     const pattern = new RegExp('[\u4E00-\u9FA5]+');
  //     let currentWidth = 0;
  //     text.split('').forEach(letter => {
  //         if(pattern.test(letter)) {
  //             // Chinese charactors
  //             currentWidth += fontSize
  //         }else {
  //             currentWidth += G6.Util.getLetterWidth(letter, fontSize)
  //         }
  //     })
  //     return currentWidth
  // }
}
