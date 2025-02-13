<template>
  <div style="width: 100%; height: 100%">
    <div>
      <div class="kw-header">
        <div class="kw-button-container">
          <!-- 一键排版 -->
          <el-button
            @click="composing"
            type="primary"
            size="small"
            class="kw-btn-blue"
            v-if="permissionList.composingBtn"
            >{{ $t("kwIntentionManage.composing") }}</el-button
          >
        </div>
        <div id="kw-form-container">
          <div class="kw-form-form">
            <!-- 展开节点数量 -->
            <!--            <el-input-->
            <!--              v-model="nodeNum"-->
            <!--              clearable-->
            <!--              size="small"-->
            <!--              :onkeyup="(this.nodeNum = this.nodeNum.replace(/[^0-9]/g, ''))"-->
            <!--              :placeholder="$t('kwIntentionManage.nodeNumName')"-->
            <!--              class="kw-form-type"-->
            <!--            ></el-input>-->
            <!-- 节点数量 -->
            <el-select
              v-model="selectNodeNum"
              clearable
              size="small"
              :placeholder="$t('kwIntentionManage.all')"
              class="kw-form-type"
            >
              <el-option
                :label="$t('kwIntentionManage.noChildNode')"
                value="1"
              ></el-option>
              <el-option
                :label="$t('kwIntentionManage.withChildNode')"
                value="2"
              ></el-option>
            </el-select>
            <!-- 意图类型 -->
            <el-select
              v-model="intentionType"
              clearable
              size="small"
              :placeholder="$t('kwIntentionManage.intentionType')"
              class="kw-form-type"
            >
              <el-option
                :label="$t('kwIntentionManage.answerType')"
                value="1"
              ></el-option>
              <el-option
                :label="$t('kwIntentionManage.taskType')"
                value="2"
              ></el-option>
            </el-select>
            <!-- 意图名称 -->
            <el-input
              :placeholder="$t('kwIntentionManage.intentionName')"
              v-model="intentionName"
              size="small"
              clearable
              class="kw-form-type"
            >
            </el-input>
          </div>
          <div class="kw-form-btn">
            <el-button
              type="primary"
              icon="el-icon-search"
              size="small"
              class="kw-search-btn"
              @click="handlerSearched"
            ></el-button>
            <el-button size="small" class="kw-reset-btn" @click="handlerReset"
              ><i class="aicosicon aicos-icon-clear"></i
            ></el-button>
          </div>
        </div>
      </div>
    </div>
    <div
      ref="container"
      :style="{ height: allWindowTopBodyHeight + 'px' }"
      style="background: #f7f9fb"
    ></div>
    <div class="tips" style="height: 25px; display: flex; align-items: center">
      <div class="tipsContainer">
        <div class="add"></div>
        <p class="tips-title">{{ $t("kwIntentionManage.addBtn") }}</p>
      </div>
      <div class="tipsContainer">
        <div class="answer"></div>
        <p class="tips-title">{{ $t("kwIntentionManage.QA") }}</p>
      </div>
      <div class="tipsContainer">
        <div class="task"></div>
        <p class="tips-title">{{ $t("kwIntentionManage.task") }}</p>
      </div>
      <div class="tipsContainer">
        <div class="normal"></div>
        <p class="tips-title">
          {{ $t("kwIntentionManage.abnormal") }}
          <el-tooltip
            class="item"
            effect="dark"
            :content="$t('kwIntentionManage.abnormalTip')"
            placement="right"
          >
            <i class="el-icon-info" style="cursor: pointer"></i>
          </el-tooltip>
        </p>
      </div>
    </div>
    <HuilanDialog
      :title="$t('kwIntentionManage.buildIntention')"
      append-to-body
      :visible.sync="addFlag"
      width="58%"
    >
      <Add
        ref="relation"
        v-if="addFlag"
        @back="back"
        @saveAnt="saveAnt"
        :botId="botId"
        :isEdit="isEdit"
        :editNode="editNode"
        :itemNode="itemNode"
        :addType="addType"
      />
      <template v-slot:footer>
        <el-button size="small" @click="addFlag = false">{{
          $t("aicosCommon.cancelBtn")
        }}</el-button>
        <el-button size="small" type="primary" @click="handlerSave">{{
          $t("aicosCommon.saveBtn")
        }}</el-button>
      </template>
    </HuilanDialog>
    <el-card class="box-card" :style="boxStyle" v-if="searchContainer">
      <div slot="header" style="display: flex; justify-content: space-between">
        <el-input
          :placeholder="$t('kwIntentionManage.intentionName')"
          v-model="littleIntentionName"
          size="small"
          clearable
          style="width: 65%"
          class="kw-form-type"
        >
        </el-input>
        <el-button
          type="primary"
          icon="el-icon-search"
          size="small"
          class="kw-search-btn"
          @click="handlerSearch"
        ></el-button>
      </div>
      <div class="text-item">
        <div
          v-for="(node, index) in nodeList"
          :key="index"
          class="text"
          :data-id="node.id"
          :title="node.intentName"
          @click="autoCreateEdge($event)"
        >
          {{ node.intentName }}
        </div>
      </div>
      <div style="text-align: center">
        <el-link
          type="primary"
          :underline="false"
          icon="el-icon-plus"
          @click="addNewNode"
          >新增节点</el-link
        >
      </div>
    </el-card>
    <div class="right-container" :style="boxStyle" v-if="isOpen">
      <div class="con-line"></div>
      <div class="top-container"></div>
      <div class="bottom-container"></div>
      <p class="knowledge">
        {{ $t("kwIntentionManage.similarKnowledge")
        }}<el-button size="small" type="text">{{
          `(${knowledgeNum})`
        }}</el-button>
      </p>
      <p class="faq-knowledge">
        {{ $t("kwIntentionManage.faqName")
        }}<el-button size="small" type="text">{{
          `(${faqKnowledgeNum})`
        }}</el-button>
      </p>
      <p class="table-knowledge">
        {{ $t("kwIntentionManage.tableName")
        }}<el-button size="small" type="text">{{
          `(${tableKnowledgeNum})`
        }}</el-button>
      </p>
      <!-- <img @click="closeOpen" class="img-flag" src="./images/shouqi.png" alt="" /> -->
    </div>
    <HuilanDialog
      :title="$t('kwIntentionManage.bindingKnowledge')"
      append-to-body
      :visible.sync="viewKnowledgeDialog"
      width="50%"
    >
      <Bindknowledge v-if="viewKnowledgeDialog" :item="bindData" />
    </HuilanDialog>
  </div>
</template>

<script>
// import G6 from "@antv/g6";
import Add from "./addIntention";
import {
  // topNodes,
  canvasList,
  move,
  sonNodes,
  searchTopNode,
  intentDelete,
  knowledgeCount,
} from "@/api/kwKnowledgeCenter/kwIntention/index";
import Bindknowledge from "./bindknowledge";
import { deepClone, randomLenNum } from "@/util/util";
import { mapGetters } from "vuex";

var graph = "";
// var sourceId = "";
// var targetId = "";
var anchorPointsArr = [
  [0.5, 0],
  [0.5, 1],
];
export default {
  inject: ["desktopWindow", "desktop", "isRobotMenu"],
  props: {
    botId: {
      type: String,
      default: () => {
        return "";
      },
    },
  },
  data() {
    return {
      // 绑定知识
      viewKnowledgeDialog: false,
      bindData: [],
      //
      addType: "",
      noEnd: "",
      end: true,
      similarModel: "",
      highLightName: null, //搜索高亮的字
      sourceAnchorIdx: "",
      targetAnchorIdx: "",
      nodeNum: "", //展开节点数量
      selectNodeNum: "", //节点数量
      intentionType: "", //意图类型
      intentionName: "", //意图名称
      littleIntentionName: "", //小意图名称
      knowledgeNum: 0,
      faqKnowledgeNum: 0,
      tableKnowledgeNum: 0,
      isOpen: false,
      currentId: "",
      nodeList: [],
      // intentionName: "",
      searchContainer: false,
      boxStyle: {
        position: "absolute",
        left: "100px",
        top: "100px",
        width: "250px",
      },
      editNode: {},
      isEdit: false, //是否编辑
      addFlag: false,
      allWindowTopBodyHeight: "", //高
      allWindowTopBodyWidth: "", //宽
      itemNode: {}, //收集点击节点的信息
      nodeInfo: {
        nodes: [],
      },
      copyNodeInfo: {},
    };
  },
  computed: {
    ...mapGetters(["permission"]),
    permissionList() {
      const prefix = this.isRobotMenu ? "robot-" : "";
      return {
        composingBtn: this.vaildData(
          this.permission[`${prefix}relation-composing`],
          false
        ),
      };
    },
  },
  components: {
    Add,
    Bindknowledge,
  },
  mounted() {
    let container;
    if (this.desktopWindow) {
      container =
        this.desktopWindow.$el.getElementsByClassName("desk-window-inner")[0];
    } else {
      container = document.querySelector("#avue-view");
    }
    //获取窗口的大小
    this.allWindowTopBodyHeight = container.offsetHeight - 239;
    this.allWindowTopBodyWidth = container.offsetWidth;
    //监听窗口变化,重新获取新的窗口大小
    if (this.desktopWindow) {
      this.desktopWindow.$on("resize", this.desktopWindowResize);
    }
    this.getDrawList();
  },
  beforeDestroy() {
    if (this.desktopWindow) {
      this.desktopWindow.$off("resize", this.desktopWindowResize);
    }
  },

  methods: {
    //动态获取窗口大小
    desktopWindowResize() {
      this.allWindowTopBodyHeight =
        this.desktopWindow.$el.getElementsByClassName("desk-window-inner")[0]
          .offsetHeight - 239;
      this.allWindowTopBodyWidth =
        this.desktopWindow.$el.getElementsByClassName(
          "desk-window-inner"
        )[0].offsetWidth;
    },

    //获取canvas图数据
    async getDrawList() {
      const info = {
        botId: this.botId,
        leafCount: this.nodeNum, //节点数量，
        tier: this.selectNodeNum, //展开节点数量
        intentType: this.intentionType, //意图类型
        intentName: this.intentionName, //意图名称
      };
      if (this.littleIntentionName != "") {
        this.highLightName = this.littleIntentionName;
      } else {
        this.highLightName = null;
      }
      const result = await canvasList(info);
      if (result.data.code == 200) {
        const Data = result.data.data;
        Data.nodes.forEach((item) => {
          item.label = item.intentName;
          if (item.intentName.length >= 8) {
            item.intentName = item.intentName.substr(0, 7) + "...";
          } else {
            item.intentName = item.intentName;
          }
        });
        Data.edges.forEach((item) => {
          item.sourceAnchor = 1;
          item.targetAnchor = 0;
        });
        // this.nodeInfo.nodes = result.data.data;

        this.nodeInfo = Data;
        import("@antv/g6").then((module) => {
          this.g6(module.default);
        });
      }
    },

    //G6布局方法
    g6(G6) {
      let that = this;
      const container = this.$refs.container;
      const width = this.allWindowTopBodyWidth;
      const height = this.allWindowTopBodyHeight;
      var mainBoxColor = "";
      var mainBoxBackColor = "";
      var titleColor = "";

      G6.registerNode(
        "card-node",
        {
          drawShape: function drawShape(cfg, group) {
            const r = 10;
            // group = group;
            if (cfg.intentType == 1) {
              //问答类型
              mainBoxColor = "rgb(0, 88, 255)";
              mainBoxBackColor = "rgb(233, 241, 255)";
              titleColor = "rgb(0, 88, 255)";
            } else if (cfg.intentType == 2) {
              //任务类型
              mainBoxColor = "rgb(255, 144, 0)";
              mainBoxBackColor = "rgb(255, 251, 232)";
              titleColor = "rgb(255, 144, 0)";
            } else if (cfg.intentType == "") {
              //新建类型
              mainBoxColor = "rgb(163, 207, 82)";
              mainBoxBackColor = "rgb(163, 207, 82)";
              titleColor = "rgb(255, 255, 255)";
            }
            if (cfg.isAbnormal == 1) {
              //异常项
              mainBoxColor = "rgb(238, 35, 68)";
              mainBoxBackColor = "rgb(255, 244, 246)";
              titleColor = "rgb(238, 35, 68)";
            }
            const shape = group.addShape("rect", {
              attrs: {
                x: 0,
                y: 0,
                width: 100,
                height: 32,
                anchorPoints: [
                  [0, 1],
                  [0.5, 1],
                ],
                stroke:
                  cfg.isKnowledge === undefined ? mainBoxColor : "transparent",
                fill:
                  cfg.isKnowledge === undefined ? mainBoxColor : "transparent",
                // shadowColor: mainBoxColor,
                radius: r,
                isAnchorPoint: false,
              },
              name: "main-box",
              zIndex: 999,
              draggable: true,
            });
            shape.set("capture", false);
            if (cfg.isKnowledge === undefined) {
              group.addShape("rect", {
                attrs: {
                  x: 0,
                  y: 0,
                  width: 100,
                  height: 32,
                  anchorPoints: [
                    [0, 1],
                    [0.5, 1],
                  ],
                  fill: mainBoxBackColor,
                  radius: r,
                  isAnchorPoint: false,
                  zIndex: 99,
                },
                name: "title-box",
                draggable: true,
              });
            } else {
              group.addShape("rect", {
                attrs: {
                  x: 0,
                  y: 0,
                  width: 100,
                  height: 32,
                  // anchorPoints: [
                  //   [0, 1],
                  //   [0.5, 1],
                  // ],
                  stroke: "transparent",
                  fill: "transparent",
                  radius: r,
                  isAnchorPoint: false,
                  zIndex: 100,
                },
                name: "title-box",
                draggable: true,
              });
            }

            if (cfg.intentType == 1) {
              //问答类型
              //下面的出口点
              group.addShape("marker", {
                attrs: {
                  x: 50,
                  y: 32,
                  r: 3,
                  cursor: "pointer",
                  symbol: "circle",
                  stroke: mainBoxColor,
                  fill: mainBoxColor,
                  lineWidth: 1,
                  isAnchorPoint: true,
                  localSet: "bottom",
                  // opacity: 1,
                },
                anchorIdx: 1,
                name: "collapse-icon-bottom",
                draggable: true,
              });
              //上面的入口点
              group.addShape("marker", {
                attrs: {
                  x: 50,
                  y: 0,
                  r: 3,
                  cursor: "pointer",
                  symbol: "circle",
                  stroke: mainBoxColor,
                  fill: mainBoxColor,
                  lineWidth: 1,
                  isAnchorPoint: true,
                  localSet: "top",
                },
                anchorIdx: 0,
                name: "collapse-icon-top",
              });
              group.addShape("marker", {
                attrs: {
                  x: 50,
                  y: 0,
                  r: 3,
                  cursor: "pointer",
                  symbol: "circle",
                  stroke: mainBoxColor,
                  fill: mainBoxColor,
                  lineWidth: 1,
                  isAnchorPoint: true,
                  localSet: "right",
                },
                anchorIdx: 2,
                name: "collapse-icon-right",
              });
            } else if (cfg.intentType == 2) {
              //任务类型
              //上面的入口点
              group.addShape("marker", {
                attrs: {
                  x: 50,
                  y: 0,
                  r: 3,
                  cursor: "pointer",
                  symbol: "circle",
                  stroke: mainBoxColor,
                  fill: mainBoxColor,
                  lineWidth: 1,
                  isAnchorPoint: true,
                  localSet: "top",
                },
                anchorIdx: 0,
                name: "collapse-icon-top",
              });
              group.addShape("marker", {
                attrs: {
                  x: 50,
                  y: 0,
                  r: 3,
                  cursor: "pointer",
                  symbol: "circle",
                  stroke: mainBoxColor,
                  fill: mainBoxColor,
                  lineWidth: 1,
                  isAnchorPoint: true,
                  localSet: "right",
                },
                anchorIdx: 2,
                name: "collapse-icon-right",
              });
            }
            if (cfg.isLeaf != 1 && cfg.intentType == 1) {
              group.addShape("image", {
                attrs: {
                  x: -8,
                  y: 8,
                  r: 6,
                  cursor: "pointer",
                  // symbol: cfg.collapse ? G6.Marker.expand : G6.Marker.collapse,
                  width: 16,
                  height: 16,
                  img: cfg.collapse
                    ? require("./images/blueExpand.png")
                    : require("./images/blueShouQi.png"),
                  // symbol: G6.Marker.expand,
                  // stroke: mainBoxColor,
                  lineWidth: 1,
                  isAnchorPoint: false,
                },
                name: "collapse-icon-left",
                draggable: true,
              });
            }
            if (cfg.isLeaf != 1 && cfg.intentType == 2) {
              group.addShape("image", {
                attrs: {
                  x: -8,
                  y: 8,
                  r: 6,
                  width: 16,
                  height: 16,
                  cursor: "pointer",
                  // symbol: cfg.collapse ? G6.Marker.expand : G6.Marker.collapse,
                  img: cfg.collapse
                    ? require("./images/yellowExpand.png")
                    : require("./images/yellowShouQi.png"),
                  // symbol: G6.Marker.expand,
                  // stroke: mainBoxColor,
                  lineWidth: 1,
                  isAnchorPoint: false,
                },
                name: "collapse-icon-left",
                draggable: true,
              });
            }
            if (cfg.isLeaf != 1 && cfg.isAbnormal == 1) {
              group.addShape("image", {
                attrs: {
                  x: -8,
                  y: 8,
                  r: 6,
                  width: 16,
                  height: 16,
                  cursor: "pointer",
                  // symbol: cfg.collapse ? G6.Marker.expand : G6.Marker.collapse,
                  img: cfg.collapse
                    ? require("./images/renExpand.png")
                    : require("./images/redShouQi.png"),
                  // symbol: G6.Marker.expand,
                  // stroke: mainBoxColor,
                  lineWidth: 1,
                  isAnchorPoint: false,
                },
                name: "collapse-icon-left",
                draggable: true,
              });
            }
            if (cfg.intentType == "1" && cfg.isAbnormal != 1) {
              group.addShape("image", {
                attrs: {
                  x: 70,
                  y: 33,
                  width: 26,
                  height: 26,
                  img: require("./images/sousuo.png"),
                  cursor: "pointer",
                  opacity: 0,
                },
                // visible: false,
                // must be assigned in G6 3.3 and later versions. it can be any value you want
                name: "search-shape",
              });
              group.addShape("image", {
                attrs: {
                  x: 85,
                  y: 0,
                  width: 12,
                  height: 12,
                  img: require("./images/blueDel.png"),
                  cursor: "pointer",
                  opacity: 0,
                },
                // visible: false,
                // must be assigned in G6 3.3 and later versions. it can be any value you want
                name: "del-shape",
              });
              //关联
              group.addShape("image", {
                attrs: {
                  x: 100,
                  y: 7,
                  width: 20,
                  height: 20,
                  img: require("./images/guanlianfujian.png"),
                  cursor: "pointer",
                  opacity: 0,
                },
                visible: true,
                // must be assigned in G6 3.3 and later versions. it can be any value you want
                name: "require-shape",
              });
            }
            if (cfg.intentType == "2" && cfg.isAbnormal != "1") {
              // group.addShape("image", {
              //   attrs: {
              //     x: 70,
              //     y: 33,
              //     width: 26,
              //     height: 26,
              //     img: require("./images/sousuo-yellow.png"),
              //     cursor: "pointer",
              //     opacity: 0,
              //   },
              //   // visible: false,
              //   // must be assigned in G6 3.3 and later versions. it can be any value you want
              //   name: "search-shape",
              // });
              group.addShape("image", {
                attrs: {
                  x: 85,
                  y: 0,
                  width: 12,
                  height: 12,
                  img: require("./images/yellowDel.png"),
                  cursor: "pointer",
                  opacity: 0,
                },
                // visible: false,
                // must be assigned in G6 3.3 and later versions. it can be any value you want
                name: "del-shape",
              });
              //关联
              // group.addShape("image", {
              //   attrs: {
              //     x: 100,
              //     y: 7,
              //     width: 20,
              //     height: 20,
              //     img: require("./images/guanlianfujian-yellow.png"),
              //     cursor: "pointer",
              //     opacity: 0,
              //   },
              //   visible: true,
              //   // must be assigned in G6 3.3 and later versions. it can be any value you want
              //   name: "require-shape",
              // });
            }
            if (cfg.isAbnormal == 1) {
              group.addShape("image", {
                attrs: {
                  x: 70,
                  y: 33,
                  width: 26,
                  height: 26,
                  img: require("./images/sousuo-red.png"),
                  cursor: "pointer",
                  opacity: 0,
                },
                // visible: false,
                // must be assigned in G6 3.3 and later versions. it can be any value you want
                name: "search-shape",
              });
              group.addShape("image", {
                attrs: {
                  x: 85,
                  y: 0,
                  width: 12,
                  height: 12,
                  img: require("./images/redDel.png"),
                  cursor: "pointer",
                  opacity: 0,
                },
                // visible: false,
                // must be assigned in G6 3.3 and later versions. it can be any value you want
                name: "del-shape",
              });
              //关联
              group.addShape("image", {
                attrs: {
                  x: 100,
                  y: 7,
                  width: 20,
                  height: 20,
                  img: require("./images/guanlianfujian-red.png"),
                  cursor: "pointer",
                  opacity: 0,
                },
                // must be assigned in G6 3.3 and later versions. it can be any value you want
                name: "require-shape",
              });
            }
            if (
              cfg.intentType == "1" &&
              cfg.knowledgeCount +
                cfg.bindFaqKnowledgeCount +
                cfg.bindTableKnowledgeCount !=
                0 &&
              cfg.isAbnormal != 1
            ) {
              group.addShape("image", {
                attrs: {
                  x: 93,
                  y: 7,
                  width: 16,
                  height: 16,
                  img: require("./images/blueMore.png"),
                  cursor: "pointer",
                },
                visible: true,
                // must be assigned in G6 3.3 and later versions. it can be any value you want
                name: "more-shape",
              });
            }
            if (
              cfg.intentType == "2" &&
              cfg.knowledgeCount +
                cfg.bindFaqKnowledgeCount +
                cfg.bindTableKnowledgeCount !=
                0 &&
              cfg.isAbnormal != 1
            ) {
              group.addShape("image", {
                attrs: {
                  x: 93,
                  y: 7,
                  width: 16,
                  height: 16,
                  img: require("./images/yellowMore.png"),
                  cursor: "pointer",
                },
                visible: true,
                // must be assigned in G6 3.3 and later versions. it can be any value you want
                name: "more-shape",
              });
            }
            if (
              cfg.isAbnormal == 1 &&
              cfg.knowledgeCount +
                cfg.bindFaqKnowledgeCount +
                cfg.bindTableKnowledgeCount !=
                0
            ) {
              group.addShape("image", {
                attrs: {
                  x: 93,
                  y: 7,
                  width: 16,
                  height: 16,
                  img: require("./images/redMore.png"),
                  cursor: "pointer",
                },
                visible: true,
                // must be assigned in G6 3.3 and later versions. it can be any value you want
                name: "more-shape",
              });
            }
            if (cfg.intentName.includes(that.highLightName)) {
              group.addShape("text", {
                attrs: {
                  textBaseline: "top",
                  y: 12,
                  x: 50,
                  lineHeight: 16,
                  text: cfg.intentName,
                  textAlign: "center",
                  fill: cfg.isKnowledge === undefined ? titleColor : "black",
                  isAnchorPoint: false,
                  stroke: "#a3cf52",
                },
                name: `index-title`,
                draggable: true,
              });
            } else {
              group.addShape("text", {
                attrs: {
                  textBaseline: "top",
                  y: 12,
                  x: 50,
                  lineHeight: 16,
                  text: cfg.intentName,
                  textAlign: "center",
                  fill: cfg.isKnowledge === undefined ? titleColor : "black",
                  isAnchorPoint: false,
                },
                name: `index-title`,
                draggable: true,
              });
            }
            cfg.anchorPoints = anchorPointsArr;
            return shape;
          },
          setState(name, value, item) {
            const group = item.get("group");
            // const model = item.get("model");
            // const { topText, bottomText } = model;
            if (name === "selected") {
              const img = group.find((e) => e.get("name") === "require-shape");
              const searchImg = group.find(
                (e) => e.get("name") === "search-shape"
              );
              const shapeImg = group.find((e) => e.get("name") == "more-shape");
              const delImg = group.find((e) => e.get("name") == "del-shape");
              if (img) {
                img.attr({
                  opacity: value ? 1 : 0,
                });
              }
              if (searchImg) {
                searchImg.attr({
                  opacity: value ? 1 : 0,
                });
              }
              if (shapeImg) {
                shapeImg.attr({
                  opacity: value ? 0 : 1,
                });
              }
              if (delImg) {
                delImg.attr({
                  opacity: value ? 1 : 0,
                });
              }
            }
          },
        }

        // "radial"
      );
      G6.registerEdge(
        "mid-point-edge",
        {
          afterDraw(cfg, group) {
            // 获取图形组中的第一个图形，在这里就是边的路径图形
            const shape = group.get("children")[0];
            // console.log(cfg.isDel);
            if (cfg.isDel === undefined) {
              // 获取路径图形的中点坐标
              const midPoint = shape.getPoint(0.5);
              // 在中点增加一个矩形，注意矩形的原点在其左上角
              group.addShape("image", {
                attrs: {
                  width: 10,
                  height: 10,
                  cursor: "pointer",
                  img: require("./images/del.png"),
                  // x 和 y 分别减去 width / 2 与 height / 2，使矩形中心在 midPoint 上
                  x: midPoint.x - 5,
                  y: midPoint.y - 5,
                  opacity: 0,
                },
                name: "line-del",
              });
            }
          },
          update: undefined,
          setState(name, value, item) {
            const group = item.getContainer();
            // const shape = group.get("children")[0];
            if (name === "selected") {
              const delImg = group.find((e) => e.get("name") == "line-del");
              if (delImg) {
                delImg.attr({
                  opacity: value ? 1 : 0,
                });
              }
            }
          },
        },
        "line"
      );
      // const tooltip = new G6.Tooltip({
      //   offsetX: 10,
      //   offsetY: 10,
      //   // the types of items that allow the tooltip show up
      //   // 允许出现 tooltip 的 item 类型
      //   itemTypes: ["node"],
      //   // custom the tooltip's content
      //   // 自定义 tooltip 内容
      //   getContent: (e) => {
      //     const outDiv = document.createElement("div");
      //     outDiv.style.width = "fit-content";
      //     //outDiv.style.padding = '0px 0px 20px 0px';
      //     outDiv.innerHTML = `<h4>${e.item.getModel().label}</h4>`;
      //     return outDiv;
      //   },
      // });

      graph = new G6.Graph({
        container: container,
        width,
        height,
        // renderer: "svg",
        layout: {
          type: "dagre",
          nodesep: 80,
          ranksep: 10,
          controlPoints: true,
          // workerEnabled: true,
        },
        // layout: {
        //   type: "force",
        //   preventOverlap: true,
        //   linkDistance: 200,
        // },

        // plugins: [tooltip],
        // translate the graph to align the canvas's center, support by v3.5.1
        // fitCenter: true,
        modes: {
          default: [
            "drag-canvas",
            "zoom-canvas",
            {
              type: "drag-node",
              shouldBegin: (e) => {
                if (e.target && e.target.attrs.isAnchorPoint) return false;
                return true;
              },
              shouldEnd: (e) => {
                if (e.target && e.target.attrs.isAnchorPoint) return false;

                return true;
              },
            },
            {
              type: "create-edge",
              trigger: "drag", // 'click' by default. options: 'drag', 'click'
              shouldBegin: (e) => {
                if (e.target && e.target.attrs.isAnchorPoint != true)
                  return false;
                that.sourceAnchorIdx = e.target.get("anchorIdx");
                return true;
              },
              shouldEnd: (e) => {
                that.targetAnchorIdx = e.target.get("anchorIdx");
                if (e.target && e.target.attrs.isAnchorPoint != true) {
                  return false;
                }
                return true;
              },
            },
          ],
        },
        defaultNode: {
          type: "card-node",
        },
        defaultEdge: {
          type: "mid-point-edge",
          style: {
            endArrow: true,
            lineWidth: 1,

            stroke: "rgb(199, 202, 211)",
          },
        },
        // fitView: true,
      });
      // 鼠标进入节点
      graph.on("node:mouseenter", (e) => {
        // const Data = e.item.getContainer();
        graph.setItemState(e.item, "selected", true);
      });
      // // 监听鼠标离开节点
      graph.on("node:mouseleave", (e) => {
        graph.setItemState(e.item, "selected", false);
      });
      //拖动节点
      graph.on("node:drag", () => {
        // console.log(e, "###");
        // const x = e.canvasX;
        // const y = e.canvasY;
        // this.boxStyle.left = x + "px";
        this.isOpen = false;
      });
      //监听鼠标进入边
      graph.on("edge:mouseenter", (e) => {
        graph.setItemState(e.item, "selected", true);
      });
      graph.on("edge:mouseleave", (e) => {
        graph.setItemState(e.item, "selected", false);
      });
      graph.on("aftercreateedge", async (e) => {
        const node = e.edge;
        const edge = e.edge._cfg;
        const source = edge.sourceNode._cfg;
        const target = edge.targetNode._cfg;
        const info = {
          fromId: target.id,
          todoId: source.id,
        };

        graph.updateItem(e.edge, {
          sourceAnchor: that.sourceAnchorIdx, //1
          targetAnchor: that.targetAnchorIdx, //0
        });
        const result = await move(info);
        if (result.data.code == 200) {
          const Data = result.data.data;
          if (Data.code == 1) {
            this.$message({
              type: "error",
              message: Data.msg,
            });
            graph.hideItem(node);
          } else {
            graph.showItem(node);
          }
        }
      });
      graph.on("line-del:click", (e) => {
        const node = e.item;
        const model = node.getModel();
        const fromId = model.target;
        const info = {
          fromId: fromId,
          todoId: 0,
        };
        move(info).then(() => {
          graph.hideItem(node);
        });
      });
      graph.on("canvas:dblclick", (e) => {
        const x = e.x;
        const y = e.y;
        this.searchContainer = false;

        graph.add("node", {
          // id: Math.ceil(Math.random() * 100000000000000).toString(),
          label: "",
          x,
          y,
          color: "#a3cf52",
          intentName: this.$t("kwIntentionManage.doubleClick"),
          intentType: "",
        });
      });
      graph.on("canvas:click", () => {
        this.searchContainer = false;
        this.isOpen = false;
        graph.data(that.nodeInfo);
        graph.render();
      });
      graph.on("node:dblclick", (e) => {
        this.itemNode = e.item;
        const Data = e.item._cfg.model;
        this.editNode = e.item._cfg.model;
        // debugger;
        if (Data.isDbclick === undefined) {
          if (Data.intentType == 1 || Data.intentType == 2) {
            //是否是编辑
            this.isEdit = true;
            if (Data.topNode !== null && Data.intentType == 2) {
              this.addType = "son";
            } else {
              this.addType = "";
            }
          } else {
            this.isEdit = false;
          }
          this.addFlag = true;
        }
      });
      graph.on("node:click", (e) => {
        // this.itemNode = e.item;
        const Data = e.item._cfg.model,
          newData = {};
        if (Data.isKnowledge && Data.children.length > 0) {
          if (Data.isDialog) {
            that.viewKnowledgeDialog = true;
            that.bindData = deepClone(Data.children);
          } else {
            const childrenData = deepClone(Data.children),
              edge = [];
            childrenData.map((item) => {
              item.intentName =
                item.content === undefined ? item.question : item.content;
              item.isDbclick = false;
              item.type = "card-node";
              item.isKnowledge = false;
              edge.push({
                source: Data.id,
                target: item.id,
                id: randomLenNum(10, true),
                isDel: false,
              });
            });
            newData.nodes = [...that.copyNodeInfo.nodes, ...childrenData];
            newData.edges = [...that.copyNodeInfo.edges, ...edge];
            // graph.data(newData);
            // graph.render();
            graph.changeData(newData);
          }
        }
        // this.editNode = e.item._cfg.model;
      });
      // 点加号
      graph.on("search-shape:click", async (e) => {
        const node = e.item;
        this.similarModel = node.getModel();
        const info = {
          botId: this.botId,
          intentName: this.intentionName,
          id: this.similarModel.id,
        };
        const result = await searchTopNode(info);
        if (result.data.code == 200) {
          this.nodeList = result.data.data;
        }

        this.highLightName = this.similarModel.intentName;
        this.currentId = this.similarModel.id;
        // const x = e.x;
        // const y = e.y;
        const x = e.canvasX;
        const y = e.canvasY;
        this.boxStyle.left = x + "px";
        this.boxStyle.top = y + 100 + "px";
        this.searchContainer = true;
        this.isOpen = false;
      });
      //点关联
      graph.on("require-shape:click", async (e) => {
        const node = e.item;
        let model = node.getModel(),
          item = { nodes: [], edges: [] };
        // const x = e.canvasX;
        // const y = e.canvasY;
        if (model.intentType !== 2) {
          const result = await knowledgeCount({ id: model.id });
          if (result.data.code == 200) {
            const Data = result.data.data,
              num1 = model.id + randomLenNum(5, true),
              num2 = model.id + randomLenNum(5, true),
              num3 = model.id + randomLenNum(5, true);
            let children = [
              {
                intentName:
                  this.$t("kwIntentionManage.viewBindingKnowledge") +
                  "(" +
                  Data.bindKnowledgeCount +
                  ")",
                isDialog: true,
                id: num1,
                isKnowledge: true,
                isDbclick: false,
                children: Data.bindKnowledgeVoList,
              },
              {
                intentName:
                  this.$t("kwIntentionManage.relatedFAQKnowledge") +
                  "(" +
                  Data.faqCount +
                  ")",
                id: num2,
                isDialog: false,
                isKnowledge: true,
                isDbclick: false,
                children: Data.faqKnowledgeList,
              },
              {
                intentName:
                  this.$t("kwIntentionManage.relatedTableKnowledge") +
                  "(" +
                  Data.qaCount +
                  ")",
                id: num3,
                isDialog: false,
                isKnowledge: true,
                isDbclick: false,
                children: Data.qaKnowledgeList,
              },
            ];
            let edge = [
              {
                source: model.id,
                target: num1,
                sourceAnchor: 2,
                id: randomLenNum(10, true),
                isDel: false,
              },
              {
                source: model.id,
                sourceAnchor: 2,
                target: num2,
                id: randomLenNum(10, true),
                isDel: false,
              },
              {
                source: model.id,
                sourceAnchor: 2,
                target: num3,
                id: randomLenNum(10, true),
                isDel: false,
              },
            ];

            // const el = graph.findById(model.id);
            // el._cfg.model.children = children;
            // graph.renderSubgraph(el);
            // console.log(children);
            item.edges = [...that.nodeInfo.edges, ...edge];
            item.nodes = [...that.nodeInfo.nodes, ...children];
            that.copyNodeInfo = item;
            // graph.data(item);
            // graph.render();
            graph.changeData(item);
            // this.boxStyle.left = x - 10 + "px";
            // this.boxStyle.top = y + 110 + "px";
            // //绑定知识数量
            // this.knowledgeNum =
            //   Data.bindFaqKnowledgeCount + Data.bindTableKnowledgeCount;
            // //faq知识数量
            // this.faqKnowledgeNum = Data.faqCount;
            // //表格知识数量
            // this.tableKnowledgeNum = Data.qaCount;
            // this.isOpen = true;
            // this.searchContainer = false;
          }
        }
      });
      //删除
      graph.on("del-shape:click", async (e) => {
        const node = e.item;
        const model = node.getModel();
        this.$confirm(this.$t("aicosCommon.mutiDeleteConfirmTip"), {
          cancelButtonText: this.$t("aicosCommon.cancelBtn"),
          confirmButtonText: this.$t("aicosCommon.confirmBtn"),
          type: "warning",
        })
          .then(async () => {
            const delInfo = {
              id: model.id,
            };
            const result = await intentDelete(delInfo);
            if (result.data.code == 200) {
              result.data.data.forEach((item) => {
                graph.hideItem(item);
              });
              graph.hideItem(node);
              this.$message({
                type: "success",
                message: this.$t("aicosCommon.deleteSuccessTip"),
              });
            }
          })
          .catch(() => {});
      });
      //展开收起操作
      graph.on("collapse-icon-left:click", async (e) => {
        // console.log(e, "1");
        const node = e.item;
        // console.log(node, "2");
        const model = node.getModel();
        console.log(model);
        // const Data = e.item._cfg;
        if (!model.collapse) {
          const result = await sonNodes(model.id);
          if (result.data.code == 200) {
            const data = result.data.data;
            console.log(data);
            data.forEach((item) => {
              graph.hideItem(item);
            });
            graph.updateItem(node, {
              collapse: true,
            });
          }
        } else {
          const result = await sonNodes(model.id);
          if (result.data.code == 200) {
            const data = result.data.data;
            data.forEach((item) => {
              graph.showItem(item);
              graph.updateItem(item, {
                collapse: false,
              });
            });
            graph.updateItem(node, {
              collapse: false,
            });
          }
        }
        graph.paint();
      });
      // graph.on("aftercreateedge", async (e) => {
      //   this.getDrawList();
      //   graph.data(that.nodeInfo);
      //   graph.render();
      // });
      graph.data(that.nodeInfo);
      graph.render();
      // function refreshDragedNodePosition(e) {
      //   const model = e.item.get("model");
      //   model.fx = e.x;
      //   model.fy = e.y;
      // }
    },
    //弹窗搜索
    async handlerSearch() {
      const info = {
        botId: this.botId,
        intentName: this.littleIntentionName,
        id: this.similarModel.id,
      };
      const result = await searchTopNode(info);
      if (result.data.code == 200) {
        this.nodeList = result.data.data;
      }
    },
    closeOpen() {
      this.isOpen = false;
    },
    //点击进行自动连线
    async autoCreateEdge(e) {
      const data = e.target.dataset;
      const info = {
        fromId: data.id,
        todoId: this.currentId,
      };
      const result = await move(info);
      if (result.data.code == 200) {
        this.searchContainer = false;
        graph.destroy();
        this.getDrawList();
      }
    },
    //搜索
    handlerSearched() {
      graph.destroy();
      this.getDrawList();
    },
    //重置
    handlerReset() {
      this.nodeNum = "";
      this.selectNodeNum = "";
      this.intentionType = "";
      this.intentionName = "";
      this.littleIntentionName = "";
      this.highLightName = null;
      graph.destroy();
      this.getDrawList();
    },
    //排版
    composing() {
      this.nodeNum = "";
      this.selectNodeNum = "";
      this.intentionType = "";
      this.intentionName = "";
      this.littleIntentionName = "";
      this.highLightName = null;
      graph.destroy();
      this.getDrawList();
    },

    //新增节点
    addNewNode() {
      this.addFlag = true;
      this.searchContainer = false;
      this.isEdit = false;
      this.editNode = {};
      this.addType = "son";
    },
    back() {
      this.addFlag = false;
    },
    //弹窗保存
    handlerSave() {
      this.$refs.relation.submitForm();
    },
    //保存
    saveAnt(data) {
      // console.log(this.itemNode);
      const model = this.itemNode.getModel();
      const updateModel = {
        ...model,
        intentName: data.intentName,
      };
      this.itemNode.update(updateModel);
      graph.destroy();
      this.getDrawList();

      this.addFlag = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.text-item {
  max-height: 150px;
  overflow: auto;
}

.text {
  cursor: pointer;
  height: 40px;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 40px;
  font-size: 14px;
  padding: 0 10px;

  &:hover {
    background: #e3f3ff;
    color: #5f8edf;
  }
}

.right-container {
  position: relative;

  .con-line {
    width: 50px;
    height: 1px;
    background: rgb(199, 202, 211);
  }

  .top-container {
    width: 40px;
    height: 50px;
    border: 1px solid rgb(199, 202, 211);
    border-right: none;
    border-bottom: none;
    border-radius: 10px 0 0 0;
    position: absolute;
    left: 50px;
    top: -49px;
  }

  .bottom-container {
    width: 40px;
    height: 50px;
    border: 1px solid rgb(199, 202, 211);
    border-right: none;
    border-radius: 0 0 0 10px;
    position: absolute;
    left: 50px;
    top: 0px;
  }

  .knowledge {
    position: absolute;
    top: -75px;
    left: 92px;
    font-size: 14px;
    font-family: "SourceHanSansCN";
    color: rgb(86, 88, 99);
  }

  .faq-knowledge {
    position: absolute;
    left: 92px;
    top: -26px;
    font-size: 14px;
    font-family: "SourceHanSansCN";
    color: rgb(86, 88, 99);
  }

  .table-knowledge {
    position: absolute;
    top: 22px;
    left: 90px;
    font-size: 14px;
    font-family: "SourceHanSansCN";
    color: rgb(86, 88, 99);
  }

  .img-flag {
    position: absolute;
    left: 43px;
    top: -7px;
  }
}

.add {
  width: 20px;
  height: 20px;
  border-radius: 4px;
  background-color: rgb(163, 207, 82);
}

.answer {
  width: 20px;
  height: 20px;
  background-color: rgb(0, 88, 255);
  border-radius: 4px;
}

.task {
  width: 20px;
  height: 20px;
  border-radius: 4px;
  background-color: rgb(255, 144, 0);
}

.normal {
  width: 20px;
  height: 20px;
  border-radius: 4px;
  background-color: rgb(238, 35, 68);
}

.tipsContainer {
  display: flex;
  align-items: center;
  height: 25px;
  margin-right: 10px;
}

.tips-title {
  margin-left: 10px;
}
</style>
