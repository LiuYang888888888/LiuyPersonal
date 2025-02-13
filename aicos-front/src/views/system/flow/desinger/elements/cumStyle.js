import deleteIcn from '../assets/delete.svg';
//import deleteIcnh from "../assets/delete_h.svg";

export const huiLanDev = 'PUBLIC';

export const deepAssign = (...param) => {
  let result = Object.assign({}, ...param);
  for (let item of param) {
    for (let [idx, val] of Object.entries(item)) {
      if (typeof val === 'object') {
        result[idx] = deepAssign(result[idx], val);
      }
    }
  }
  return result;
}

export const deepAssignNoArr = (...param) => {
  let result = Object.assign({}, ...param);
  for (let item of param) {
    for (let [idx, val] of Object.entries(item)) {
      if ((typeof val === 'object') && !Array.isArray(val)) {
        result[idx] = deepAssign(result[idx], val);
      }
    }
  }
  return result;
}

const cumfontFamily = "Chinese Quote,-apple-system,BlinkMacSystemFont,Segoe UI,PingFang SC,Hiragino Sans GB,Microsoft YaHei,Helvetica Neue,Helvetica,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol";

export const cumColor = {
  "userTask":"#ec7b38",
  "exclusiveGateway": "#1fc1ef",
  "startTask": "#1e90ff",
  "visitTask": "#ffd200",
  "subProcess": "#a760e8",
  "startFlowTask": "#b7da77",
  "endTask": "#ff7170",
}


const Ie = "rgb(253, 253, 253)";
const Pe = "rgb(95, 149, 255)";
const Ne = "rgb(95, 149, 255)";
const je = "rgb(247, 250, 255)";
const De = "rgb(95, 149, 255)";
const Le = "rgb(224, 224, 224)";
const Re = "rgb(95, 149, 255)";
const Be = "rgb(224, 224, 224)";
const Ge = "rgb(95, 149, 255)";

export const cumModelRectStyles = () => {

  const options = {
    size: [300, 120],
    style: {
      radius: 10,
      stroke: "#1e90ff",
      fill: "#ffffff",
      lineWidth: 1,
      fillOpacity: 1
    },
    labelCfg: {
      style: {
        fill: "#ffffff",
        fontSize: 16,
        fontFamily: cumfontFamily,
        textAlign: "center",
        textBaseline: "middle",
      },
      offset: 30
    },
    descriptionCfg: {
      style: {
        fontSize: 12,
        fill: "#bfbfbf",
        fontFamily: cumfontFamily,
      },
      paddingTop: 0
    },
    preRect: {
      show: !0,
      width: 300,
      height: 60,
      fill: "#1e90ff",
      radius: 10
    },
    linkPoints: {
      top: !1,
      right: !1,
      bottom: !1,
      left: !1,
      size: 12,
      lineWidth: 1,
      fill: "#72CC4A",
      stroke: "#72CC4A"
    },
    logoIcon: {
      show: !0,
      x: 0,
      y: 0,
      img: deleteIcn,
      width: 16,
      height: 16,
      offset: 0,
      fill: "#f00",
      stroke: "#f00"
    },
    stateIcon: {
      show: !0,
      x: 0,
      y: 0,
      img: deleteIcn,
      width: 16,
      height: 16,
      offset: -5,
    },
    anchorPoints: [
      [0, .5],
      [1, .5]
    ]
  }
  return options
}

export const cumStateStyles = function() {

  const Fe = {
    nodeLabel: {
      style: {
        fill: "#000",
        fontSize: 12,
        textAlign: "center",
        textBaseline: "middle"
      },
      offset: 4
    },
    defaultNode: {
      type: "circle",
      style: {
        lineWidth: 1,
        stroke: Pe,
        fill: "rgb(239, 244, 255)"
      },
      size: 20,
      color: Pe,
      linkPoints: {
        size: 8,
        lineWidth: 1,
        fill: je,
        stroke: Ne
      }
    },

    nodeStateStyles: {
      active: {
        fill: je,
        stroke: Ne,
        lineWidth: 2,
        shadowColor: Pe,
        shadowBlur: 10
      },
      selected: {
        fill: "rgb(255, 255, 255)",
        stroke: De,
        lineWidth: 4,
        shadowColor: De,
        shadowBlur: 10,
        "text-shape": {
          fontWeight: 500
        }
      },
      highlight: {
        fill: "rgb(223, 234, 255)",
        stroke: "#4572d9",
        lineWidth: 2,
        "text-shape": {
          fontWeight: 500
        }
      },
      inactive: {
        fill: "rgb(247, 250, 255)",
        stroke: "rgb(191, 213, 255)",
        lineWidth: 1
      },
      disable: {
        fill: "rgb(250, 250, 250)",
        stroke: "rgb(224, 224, 224)",
        lineWidth: 1
      }
    },
    edgeLabel: {
      style: {
        fill: "rgb(0, 0, 0)",
        textAlign: "center",
        textBaseline: "middle",
        fontSize: 12
      }
    },
    defaultEdge: {
      type: "tasklinkline",
      size: 1,
      style: {
        radius: 10,
        offset: 30,
        endArrow: true,
        stroke: '#666666',
        lineAppendWidth: 2
      },
      color: Le
    },
    edgeStateStyles: {
      active: {
        stroke: "rgb(95, 149, 255)",
        lineWidth: 2,
        shadowBlur: 10,
        shadowColor: Re,
      },
      selected: {
        stroke: Re,
        lineWidth: 2,
        shadowColor: Re,
        shadowBlur: 10,
        "text-shape": {
          fontWeight: 500
        }
      },
      highlight: {
        stroke: "rgb(95, 149, 255)",
        lineWidth: 2,
        "text-shape": {
          fontWeight: 500
        }
      },
      inactive: {
        stroke: "rgb(234, 234, 234)",
        lineWidth: 1
      },
      disable: {
        stroke: "rgb(245, 245, 245)",
        lineWidth: 1
      }
    },
    comboLabel: {
      style: {
        fill: "rgb(0, 0, 0)",
        textBaseline: "middle",
        fontSize: 12
      },
      refY: 10,
      refX: 10
    },
    defaultCombo: {
      type: "circle",
      style: {
        fill: Ie,
        lineWidth: 1,
        stroke: Be,
        r: 5,
        width: 20,
        height: 10
      },
      size: [20, 5],
      color: Be,
      padding: [25, 20, 15, 20]
    },
    comboStateStyles: {
      active: {
        stroke: "rgb(95, 149, 255)",
        lineWidth: 1,
        fill: "rgb(247, 250, 255)"
      },
      selected: {
        stroke: Ge,
        lineWidth: 2,
        fill: Ie,
        shadowColor: Ge,
        shadowBlur: 10,
        "text-shape": {
          fontWeight: 500
        }
      },
      highlight: {
        stroke: "#4572d9",
        lineWidth: 2,
        fill: Ie,
        "text-shape": {
          fontWeight: 500
        }
      },
      inactive: {
        stroke: "rgb(224, 224, 224)",
        fill: Ie,
        lineWidth: 1
      },
      disable: {
        stroke: "rgb(234, 234, 234)",
        fill: "rgb(250, 250, 250)",
        lineWidth: 1
      }
    },
    delegateStyle: {
      fill: "#F3F9FF",
      fillOpacity: .5,
      stroke: "#1890FF",
      strokeOpacity: .9,
      lineDash: [5, 5]
    },
  }

  return Fe
}

export const defaultOptions = {
  size: [300, 120],
  style: {
    radius: 10,
    stroke: "#1e90ff",
    fill: "#ffffff",
    lineWidth: 1,
    fillOpacity: 1
  },
  labelCfg: {
    style: {
      fill: "#ffffff",
      fontSize: 16,
      fontWeight: 500,
      fontFamily: cumfontFamily,
      textAlign: "center",
      textBaseline: "middle",
    },
    offset: 150,
  },
  descriptionCfg: {
    show: !0,
    style: {
      fontSize: 12,
      fill: "#bfbfbf",
      fontFamily: cumfontFamily,
    },
    paddingTop: 0
  },
  preRect: {
    show: !0,
    width: 300,
    height: 60,
    fill: "#1e90ff",
    radius: 10
  },
  linkPoints: {
    top: !1,
    right: !1,
    bottom: !1,
    left: !1,
    size: 12,
    lineWidth: 1,
    fill: "#ffffff",
    stroke: "#1e90ff"
  },
  logoIcon: {
    show: 0,
    x: 0,
    y: 0,
    img: deleteIcn,
    width: 16,
    height: 16,
    offset: 0,
    fill: "#f00",
    stroke: "#f00"
  },
  stateIcon: {
    show: !0,
    x: 120,
    y: -30,
    img: deleteIcn,
    width: 20,
    height: 20,
    offset: 0,
  },
  anchorPoints: [
    [0, 0.5],
    [1, 0.5],
    [0.5, 0],
    [0.5, 1]
  ]
}

export const defaultStateStyles = {
  active: {
    //fill: "rgb(247, 250, 255)",
    stroke: "rgb(95, 149, 255)",
    lineWidth: 3,
    shadowColor: "rgb(95, 149, 255)",
    shadowBlur: 10
  },
  selected: {
    //fill: "rgb(255, 255, 255)",
    stroke: "rgb(95, 149, 255)",
    lineWidth: 5,
    shadowColor: "rgb(95, 149, 255)",
    shadowBlur: 12,
    "text-shape": {
      fontWeight: 700
    }
  },
  highlight: {
    fill: "rgb(223, 234, 255)",
    stroke: "#4572d9",
    lineWidth: 2,
    "text-shape": {
      fontWeight: 700
    }
  },
  inactive: {
    fill: "rgb(247, 250, 255)",
    stroke: "rgb(191, 213, 255)",
    lineWidth: 1
  },
  disable: {
    fill: "rgb(250, 250, 250)",
    stroke: "rgb(224, 224, 224)",
    lineWidth: 1
  }
}


export const endTaskOptions = {
  size: 100,
  style: {
    stroke: cumColor.endTask,
    fill: "#f8dddd",
  },
  labelCfg: {
    style: {
      fill: cumColor.endTask,
    },
  },
  linkPoints: {
    left: 1,
    top: 1,
    bottom: 1,
  },
  anchorPoints: [
    [0, 0.5],
    // [1, 0.5],
    [0.5, 0],
    [0.5, 1]
  ],
  stateStyles: {
    active: {
      stroke: cumColor.endTask,
      shadowColor: cumColor.endTask,
    },
    selected: {
      stroke: cumColor.endTask,
      shadowColor:  cumColor.endTask,
    },
  }
}

export const startFlowTaskOptions = {
  size: 100,
  style: {
    stroke: cumColor.startFlowTask,
    fill: "#eff8e0"
  },
  labelCfg: {
    style: {
      fill: cumColor.startFlowTask,
    },
  },
  linkPoints: {
    left: true,
    right: true,
    bottom: true,
  },
  anchorPoints: [
    [0, 0.5],
    [1, 0.5],
    // [0.5, 0],
    [0.5, 1]
  ],
  stateStyles: {
    active: {
      stroke: cumColor.startFlowTask,
      shadowColor: cumColor.startFlowTask,
    },
    selected: {
      stroke: cumColor.startFlowTask,
      shadowColor: cumColor.startFlowTask,
    },
  }
}

export const userTaskOptions = {
  size: [300, 120],
  style: {
    stroke: cumColor.userTask,
  },
  preRect: {
    fill: cumColor.userTask,
  },
  stateStyles: {
    active: {
      stroke: cumColor.userTask,
      shadowColor: cumColor.userTask,
    },
    selected: {
      stroke: cumColor.userTask,
      shadowColor: cumColor.userTask,
    },
  }
}

export const exclusiveGatewayOptions = {
  size: [300, 120],
  style: {
    stroke: cumColor.exclusiveGateway,
  },
  preRect: {
    fill: cumColor.exclusiveGateway,
  },
  stateStyles: {
    active: {
      stroke: cumColor.exclusiveGateway,
      shadowColor: cumColor.exclusiveGateway,
    },
    selected: {
      stroke: cumColor.exclusiveGateway,
      shadowColor: cumColor.exclusiveGateway,
    },
  }
}

export const startTaskOptions = {
  size: [240, 80],
  style: {
    stroke: cumColor.startTask,
  },
  labelCfg: {
    offset: 120,
  },
  preRect: {
    width: 240,
    height: 40,
    fill: cumColor.startTask,
  },
  stateIcon: {
    x: 90,
  },
  stateStyles: {
    active: {
      stroke: cumColor.startTask,
      shadowColor: cumColor.startTask,
    },
    selected: {
      stroke: cumColor.startTask,
      shadowColor: cumColor.startTask,
    },
  }
}

export const visitTaskOptions = {
  size: [240, 80],
  style: {
    stroke: cumColor.visitTask,
  },
  labelCfg: {
    offset: 120,
  },
  preRect: {
    width: 240,
    height: 40,
    fill: cumColor.visitTask,
  },
  stateIcon: {
    x: 90,
  },
  stateStyles: {
    active: {
      stroke: cumColor.visitTask,
      shadowColor: cumColor.visitTask,
    },
    selected: {
      stroke: cumColor.visitTask,
      shadowColor: cumColor.visitTask,
    },
  }
}

export const subProcessOptions = {
  size: [240, 80],
  style: {
    stroke: cumColor.subProcess,
  },
  preRect: {
    fill: cumColor.subProcess,
  },
  stateStyles: {
    active: {
      stroke: cumColor.subProcess,
      shadowColor: cumColor.subProcess,
    },
    selected: {
      stroke: cumColor.subProcess,
      shadowColor: cumColor.subProcess,
    },
  }
}

export const lineOptions = {
  defaultEdge: {
    type: "tasklinkline",
    size: 1,
    style: {
      radius: 10,
      offset: 30,
      endArrow: true,
      stroke: '#666666',
      lineAppendWidth: 2
    },
    color: Le
  },
  edgeStateStyles: {
    active: {
      stroke: "rgb(95, 149, 255)",
      lineWidth: 2,
      shadowBlur: 10,
      shadowColor: Re,
    },
    selected: {
      stroke: Re,
      lineWidth: 2,
      shadowColor: Re,
      shadowBlur: 10,
      "text-shape": {
        fontWeight: 500
      }
    },
    highlight: {
      stroke: "rgb(95, 149, 255)",
      lineWidth: 2,
      "text-shape": {
        fontWeight: 500
      }
    },
    inactive: {
      stroke: "rgb(234, 234, 234)",
      lineWidth: 1
    },
    disable: {
      stroke: "rgb(245, 245, 245)",
      lineWidth: 1
    }
  },
}