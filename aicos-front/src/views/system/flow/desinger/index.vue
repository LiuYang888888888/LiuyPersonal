<template>
  <div class="flow-editor-container">
    <ul class="flow-editor-toolbar" v-if="mode === 'default'">
      <template v-for="item in itemList">
        <li
          v-if="!item.hidden"
          draggable="true"
          :type="item.type"
          :key="item.type"
          @dragstart="dragItem"
        >
          <i class="aicosicon" :class="( item.icon + ' ' + item.type )"></i>
          <span> {{ item.name }}</span>
        </li>
      </template>
    </ul>
    <div
      class="g6Container"
      ref="container"
      @drop="dropToolbarItem"
      :style="mode === 'default' ? '' : 'height: 100%;border-top:none;'"
    ></div>
    <el-drawer
      v-if="mode === 'default'"
      title="属性设置"
      :visible.sync="drawer"
      :size="560"
      :before-close="handleClose"
      direction="rtl"
      append-to-body
    >
      <div class="prop-drawer-container">
        <el-scrollbar>
          <component
            v-if="nodeKey !== ''"
            :key="nodeKey"
            :is="curNodePropCmp"
            @close="handlePropsClose"
          />
        </el-scrollbar>
      </div>
    </el-drawer>
  </div>
</template>

<script>
// import G6 from "@antv/g6";
// import "./behavior";
// import "./elements";
import dropToolbarItem from "./mixin/dropToolbarItem";
import nodeProperties from "./mixin/nodeProperties";
import transformToFlowableData from "./mixin/transformToFlowableData";
import handleEdgeCondition from "./mixin/handleEdgeCondition";

import { lineOptions } from './elements/cumStyle.js';

export default {
  name: "HuilanFlowEditor",
  mixins: [dropToolbarItem, nodeProperties, transformToFlowableData, handleEdgeCondition],
  props: {
    mode: {
      type: String,
      default: "default",
    },
    formId: {
      type: String,
      default: "",
    },
    formFields: {
      type: Array,
      default() {
        return [];
      },
    },
    flowData: {
      type: Object,
      default() {
        return {};
      },
    },
    processInfo: {
      type: Object,
      default() {
        return {};
      },
    },
    type: {
      type: String,
      // noForm、normal、simple
      default: "normal",
    },
  },
  provide() {
    return {
      desinger: this,
    };
  },
  data() {
    return {
      data: {
        // 点集
        // nodes: [
        //   {
        //     id: 'node1', // String，该节点存在则必须，节点的唯一标识
        //     x: 100, // Number，可选，节点位置的 x 值
        //     y: 200, // Number，可选，节点位置的 y 值
        //   },
        //   {
        //     id: 'node2', // String，该节点存在则必须，节点的唯一标识
        //     // type: 'modelRect',
        //     type: 'userTask',
        //     x: 300, // Number，可选，节点位置的 x 值
        //     y: 200, // Number，可选，节点位置的 y 值
        //     // logoIcon: {
        //     //   // 是否显示 icon，值为 false 则不渲染 icon
        //     //   show: true,
        //     //   x: 0,
        //     //   y: 0,
        //     //   // icon 的地址，字符串类型
        //     //   img: 'https://gw.alipayobjects.com/zos/basement_prod/4f81893c-1806-4de4-aff3-9a6b266bc8a2.svg',
        //     //   width: 16,
        //     //   height: 16,
        //     //   // 用于调整图标的左右位置
        //     //   offset: 0
        //     // },
        //     label: 'userTask'
        //   },
        // ],
        // // 边集
        // edges: [
        //   {
        //     source: 'node1', // String，必须，起始点 id
        //     target: 'node2', // String，必须，目标点 id
        //   },
        // ],
      },
      start: {
        pageX: 0,
        pageY: 0,
      },
      graph: {},
      sourceAnchorIdx: "",
      targetAnchorIdx: "",
      drawer: false,
    };
  },
  watch: {
    flowData: {
      handler(newVal) {
        this.data = newVal;
        if (this.mode == "view") {
          this.buildViewData();
        }
        if (this.graph && this.graph.changeData) {
          // console.log('graph.getWidth()')
          // console.log(this.graph.getWidth())
          const container = this.$refs.container;
          const width = container.offsetWidth;
          const height = container.offsetHeight;
          this.graph.changeSize(width, height);
          this.graph.changeData(newVal);
        }
      },
      immediate: true,
    },
  },
  methods: {
    init(G6) {
      const container = this.$refs.container;
      const width = container.offsetWidth;
      const height = container.offsetHeight;
      // console.log(width, height, 'container')
      //
      // const toolbar = new G6.ToolBar()
      // const imageMinimap = new G6.ImageMinimap({
      //   width: 200,
      //   graphImg: 'https://gw.alipayobjects.com/mdn/rms_f8c6a0/afts/img/A*eD7nT6tmYgAAAAAAAAAAAABkARQnAQ'
      // });

      const tooltip = new G6.Tooltip({
        offsetX: 10,
        offsetY: 10,
        // trigger: 'click',
        // the types of items that allow the tooltip show up
        // 允许出现 tooltip 的 item 类型
        itemTypes: ["node"],
        // custom the tooltip's content
        // 自定义 tooltip 内容
        getContent: (e) => {
          const outDiv = document.createElement("div");
          outDiv.style.width = "fit-content";
          //outDiv.style.padding = '0px 0px 20px 0px';
          const currentShape = e.item.get("currentShape");
          const model = e.item.getModel();
          if (!["userTask", "visitTask"].includes(currentShape)) {
            return outDiv;
          }
          if (currentShape === "visitTask" && model.nodeSetting.visitType === "robot") {
            outDiv.innerHTML = `
            <table class="node-tip">
              <tr>
                  <td>处理人</td>
                  <td>机器人</td>
              </tr>
            </table>`;
          } else {
            const handlers = model.nodeSetting.handler;
            const users = handlers.list
              .filter((item) => item.type === "user")
              .map((item) => item.name);
            const depts = handlers.list
              .filter((item) => item.type === "dept")
              .map((item) => item.name);
            const roles = handlers.list
              .filter((item) => item.type === "role")
              .map((item) => item.name);
            let dic = [];
            if (handlers.applicant) {
              dic.push("申请人");
            }
            if (handlers.applicantLeader) {
              dic.push("申请人部门领导");
            }
            if (handlers.submitterLeader) {
              dic.push("提交人部门领导");
            }
            if (handlers.submitDirectLeader) {
              dic.push("提交人直属领导");
            }
            const array = ['<table class="node-tip">'];
            if (users.length > 0) {
              array.push(`
                <tr>
                  <td>处理人</td>
                  <td>${users.join("、")}</td>
                </tr>
              `);
            }
            if (depts.length > 0) {
              array.push(`
                <tr>
                  <td>处理部门</td>
                  <td>${depts.join("、")}</td>
              </tr>
              `);
            }
            if (roles.length > 0) {
              array.push(`
                <tr>
                  <td>处理角色</td>
                  <td>${roles.join("、")}</td>
              </tr>
              `);
            }
            if (dic.length > 0) {
              array.push(`
                <tr>
                  <td>动态人员</td>
                  <td>${dic.join("、")}</td>
              </tr>
              `);
            }
            if (array.length == 1) {
              array.push(`
                <tr>
                  <td colspan="2">无处理人</td>
              </tr>
              `);
            }
            array.push("</table>");
            outDiv.innerHTML = array.join("");
          }
          return outDiv;
        },
        shouldBegin: (e) => {
          let res = false;
          switch (e.item.get("currentShape")) {
            case "userTask":
              res = true;
              break;
            case "visitTask":
              res = true;
              break;
            // case '3':
            //   if (e.target.get('name') !== 'text-shape') res = true;
            //   else res = false;
            //   break;
            // default:
            //   res = true;
            //   break;
          }
          return res;
        },
      });

      const graph = new G6.Graph({
        container: container, // String | HTMLElement，必须，在 Step 1 中创建的容器 id 或容器本身
        width, // Number，必须，图的宽度
        height, // Number，必须，图的高度
        // plugins: [toolbar, imageMinimap],
        plugins: [tooltip],
        modes: {
          default: [
            "drag-canvas",
            "zoom-canvas",
            // 'click-select',
            "deleteNodeAndEdge",
            "baseInteract",
            // 'nodeSetting',
            {
              type: "drag-node",
              shouldBegin: (e) => {
                if (e.target.get("isAnchorPoint")) return false;
                return true;
              },
            },
            {
              type: "create-edge",
              trigger: "drag", // set the trigger to be drag to make the create-edge triggered by drag
              shouldBegin: (e) => {
                // avoid beginning at other shapes on the node
                if (e.target && e.target.get("isAnchorPoint") !== true) {
                  return false;
                } else if (e.target.get("anchorPointType") === "in") {
                  // anchorPointType 有三种类型 in、out、in-out
                  this.$message.error("输入点不能作为连线的起始节点");
                  return false;
                }
                const curAnchorIndex = e.target.get("anchorPointIdx");
                const anchorPointType = e.target.get("anchorPointType");
                // 普通输出节点只能有一条连线
                if (anchorPointType !== "in-out") {
                  const item = e.item;
                  const itemType = item.getType();
                  if (itemType === "node") {
                    const outEdges = item.getOutEdges();
                    const flag = outEdges.some((edge) => {
                      const edgeModel = edge.getModel();
                      return edgeModel.sourceAnchor === curAnchorIndex;
                    });
                    if (flag) {
                      this.$message.error("当前节点只能有一条输出线");
                      return false;
                    }
                  }
                }
                this.sourceAnchorIdx = curAnchorIndex;
                // e.target.set('links', e.target.get('links') + 1); // cache the number of edge connected to this anchor-point circle
                return true;
              },
              shouldEnd: (e) => {
                // avoid ending at other shapes on the node
                if (e.target && e.target.get("isAnchorPoint") !== true) {
                  return false;
                } else if (e.target.get("anchorPointType") === "out") {
                  this.$message.error("输出点不能作为连线的结束节点");
                  return false;
                }
                if (e.target) {
                  this.targetAnchorIdx = e.target.get("anchorPointIdx");
                  // e.target.set('links', e.target.get('links') + 1);  // cache the number of edge connected to this anchor-point circle
                  return true;
                }
                this.targetAnchorIdx = undefined;
                return true;
              },
            },
          ],
          view: ["drag-canvas", "zoom-canvas"],
        },
        defaultEdge: lineOptions.defaultEdge,
        edgeStateStyles:lineOptions.edgeStateStyles,
      });
      if (this.mode == "view") {
        this.buildViewData();
      }
      graph.data(this.data); // 读取 Step 2 中的数据源到图上
      graph.render(); // 渲染图

      if (this.mode == "view") {
        graph.setMode("view");
      }
      this.graph = graph;
      if (this.mode !== "view") {
        this.addListener();
      }
    },
    addListener() {
      this.graph.on("afteradditem", (e) => {
        if (e.item && e.item.getType() === "edge") {
          const model = e.item.getModel();
          // 解决更新组件时，调用事件造成属性错误
          if (model.sourceAnchor == undefined) {
            this.graph.updateItem(e.item, {
              sourceAnchor: this.sourceAnchorIdx,
            });
          }
        }
      });

      this.graph.on("aftercreateedge", (e) => {
        const model = e.edge.getModel();
        if (model.targetAnchor !== undefined) {
          return;
        }
        const condition = this.getEdgeCondition(
          e.edge.get("sourceNode"),
          this.sourceAnchorIdx
        );
        // update the sourceAnchor and targetAnchor for the newly added edge
        this.graph.updateItem(e.edge, {
          sourceAnchor: this.sourceAnchorIdx,
          targetAnchor: this.targetAnchorIdx,
          condition,
        });

        // update the curveOffset for parallel edges
        // const edges = graph.save().edges;
        // processParallelEdgesOnAnchorPoint(edges);
        // graph.getEdges().forEach((edge, i) => {
        //   graph.updateItem(edge, {
        //     curveOffset: edges[i].curveOffset,
        //     curvePosition: edges[i].curvePosition,
        //   });
        // });
      });

      this.graph.on("node:click", (e) => {
        const node = e.item;
        if (node.destroyed) {
          return;
        }
        const currentShape = node.get("currentShape");
        const skip = ["startFlowTask"];
        if (!skip.includes(currentShape)) {
          this.nodeSetting(node);
          this.drawer = true;
          this.$store.commit("SET_DIALOGVISIBLE", true);
        }
      });
    },
    getData() {
      const data = this.graph.save();
      const flowableData = this.toFlowableData(data);
      return {
        gatewayUsedFields: this.gatewayUsedFields,
        editorData: data,
        flowableData,
      };
    },
    buildViewData() {
      if (this.data && Array.isArray(this.data.nodes)) {
        this.data.nodes.forEach((node) => {
          // if(!['startFlowTask', 'endTask'].includes(node.type)) {

          Object.assign(node, {
            linkPoints: {
              left: false,
              right: false,
              top: false,
              bottom: false,
            },
            // anchorPoints: [],
            hideAnchorPoints: true,
            stateIcon: {
              show: false,
            },
          });
          // }
        });
      }
    },
    handleClose() {
      this.drawer = false;
      this.$store.commit("SET_DIALOGVISIBLE", false);
    },
    resizeGraph(width, height) {
      const container = this.$refs.container;
      const w = width || container && container.offsetWidth;
      const h = height || container && container.offsetHeight;
      if(w && h){
        this.graph.changeSize(w, h);
      }
    },
    // 当容器的大小改变时，自动改变画布的大小
    resizeObserver() {
      if(!window.ResizeObserver) {
        console.log('浏览器不支持ResizeObserver');
        return
      }
      const container = this.$refs.container;
      const resizeObserver = new ResizeObserver((/*entries*/) => {
        this.resizeGraph();
      });
      resizeObserver.observe(container);
      this.$on('hook:beforeDestroy', () => {
        resizeObserver.unobserve(container);
      })
    }
  },
  mounted() {
    import('./behavior');
    import('./elements');
    import('@antv/g6').then((module)=>{
      this.init(module.default);
      this.resizeObserver();
    })
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.flow-editor-container {
  width: 100%;
  height: 100%;
  //border: 1px solid #e9e9e9;
}
.flow-editor-toolbar {
  list-style-type: none;
  margin: 0;
  padding: 0px 0 0 20px;
  text-align: left;
  height: 40px;
  display: flex;
}
.flow-editor-toolbar li {
  display: flex;
  justify-items: center;
  border: 1px solid #c5c2c2;
  border-radius: 8px;
  height: 40px;
  padding: 5px 15px 5px 10px;
  margin-right: 15px;
  cursor: pointer;
  i {
    display: inline-block;
    color: #fff;
    font-size: 16px;
    width: 30px;
    height: 30px;
    line-height: 30px;
    border-radius:50%;
    text-align: center;
    margin-right: 8px;
  }
  span {
    line-height: 30px;
    color: #303133;
    font-size: 14px;
  }
  .userTask { background-color: #ec7b38; }
  .exclusiveGateway {  background-color: #1fc1ef; }
  .startTask {  background-color: #1e90ff; }
  .visitTask {  background-color: #ffd200; }
  .subProcess {  background-color: #a760e8; }
  .startFlowTask {  background-color: #b7da77; }
  .endTask {  background-color: #ff7170; }

}
.g6Container {
  position: relative;
  width: 100%;
  height: calc(100% - 45px);
  margin: 0 auto;
  //border-top: 1px solid #e9e9e9;

  /deep/.node-tip {
    td:first-child {
      font-weight: 700;
      padding: 3px 5px 3px 0;
      text-align: right;
    }
  }
}
.prop-drawer-container {
  height: calc(100vh - 82px);

  /deep/.el-scrollbar {
    height: 100%;
  }
}
</style>
