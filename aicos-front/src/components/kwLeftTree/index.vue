<template>
  <div>
    <el-scrollbar>
      <!-- <basic-container> -->
      <div class="search-container" v-if="isSetting">
        <el-input
          :placeholder="this.$t('faq.contentTips')"
          v-model="inputSearch"
          size="small"
          @keyup.enter.native="searchFlag = true"
          style="width: 85%"
        >
          <i
            slot="suffix"
            class="el-input__icon el-icon-search"
            style="cursor: pointer"
            @click="searchFlag = true"
          ></i>
        </el-input>
        <i
          class="el-icon-setting"
          @click.stop="openClassifySetting"
          v-if="ckEditFlag != 'ckEdit'"
          style="cursor: pointer; color: #409eff"
        ></i>
      </div>
      <el-tree
        class="filter-tree"
        :props="props"
        highlight-current="true"
        :current-node-key="currentKey"
        :default-expanded-keys="defaultExpand"
        :load="loadNode"
        node-key="id"
        @node-click="handlerNodeClick"
        lazy
        :expand-on-click-node="false"
        :filter-node-method="filterNode"
        ref="tree"
        @node-expand="nodeExpand"
        @node-collapse="nodeCollapse"
      >
        <span
          class="custom-tree-node"
          style=" -webkit-box-flex: 1;
          -ms-flex: 1;
           flex: 1;
           display: -webkit-box;
          display: -ms-flexbox;
           display: flex;
           width: 0;"
          slot-scope="{ node, data }"
          @mouseenter="mouseenter(data)"
          @mouseleave="mouseleave(data)"
          :title="data.dname + (data.num ? `(${data.num})` : '')"
        >
          <i
            v-if="data.id == 'mine'"
            class="aicosicon aicos-icon-tag"
            style="color: #e7af0a; margin-right: 5px"
          ></i>
          <span
            class="kw-nodeName"
            v-if="data.id == 'mine'"
            :class="{ isPause: data.status != 1 && data.id != 0 }"
            >{{$t('aicosCommon.myCollect')}}{{ data.num ? `(${data.num})` : "" }}
          </span>
          <span
            class="kw-nodeName"
            v-else
            :class="{ isPause: data.status != 1 && data.id != 0 }"
            >{{ data.dname }}{{ data.num ? `(${data.num})` : "" }}
          </span>
          <span>
            <i
              class="el-icon-plus"
              v-if="data.id == 0 && isSetting && ckEditFlag != 'ckEdit'"
              style="color: #409eff"
              :title="$t('aicosCommon.addClassify')"
              @click.stop="addNewClassify(data)"
            ></i>
          </span>
          <!-- <span v-if="data.id == 'mine' && isSetting">
              <i class="el-icon-circle-plus-outline" @click.stop="addCollect"></i>
            </span> -->
          <span
            v-show="
              data.id != 'mine' && data.id != 0 && data.isShow && isSetting
            "
          >
            <!-- 新增 -->
            <i
              class="el-icon-plus"
              style="color: #409eff"
              v-if="data.favorite != 1 && ckEditFlag != 'ckEdit'"
              :title="$t('aicosCommon.addClassify')"
              @click.stop="addNewClassify(data)"
            ></i>
            <!-- 编辑 -->
            <i
              class="el-icon-edit"
              style="color: #409eff"
              v-if="data.favorite != 1 && ckEditFlag != 'ckEdit'"
              :title="$t('aicosCommon.editBtn')"
              @click.stop="addEditClassify(data)"
            ></i>

            <!-- 收藏 -->
            <i
              class="aicosicon aicos-icon-quxiaoshoucang_huaban1"
              style="color: #409eff"
              :title="$t('aicosCommon.collect')"
              v-if="
                data.collectStatus == 0 &&
                data.favorite != 1 &&
                ckEditFlag != 'ckEdit'
              "
              @click.stop="collectClassify(data)"
            ></i>
            <!-- 取消收藏 -->
            <i
              class="aicosicon aicos-icon-shoucangfill"
              style="color: #409eff"
              :title="$t('aicosCommon.cancelCollect')"
              v-if="
                data.collectStatus == 1 &&
                data.favorite != 1 &&
                ckEditFlag != 'ckEdit'
              "
              @click.stop="cancelCollectClassify(data)"
            ></i>
            <!-- 删除 -->
            <i
              class="el-icon-delete"
              style="color: #dd3a24"
              v-if="data.favorite != 1 && ckEditFlag != 'ckEdit'"
              :title="$t('aicosCommon.delBtn')"
              @click.stop="deleteCollectClassify(data)"
            ></i>

            <!-- 取消收藏 -->
            <i
              class="aicosicon aicos-icon-shoucangfill"
              style="color: #5aabfe"
              v-if="data.favorite == 1 && ckEditFlag != 'ckEdit'"
              :title="$t('aicosCommon.cancelCollect')"
              @click.stop="cancelCollectClassify(data)"
            ></i>
            <!-- <i
                class="el-icon-video-pause"
                @click.stop="pauseOrPlay(false, data)"
                v-if="data.status == 1"
              ></i>
              <i
                class="el-icon-video-play"
                @click.stop="pauseOrPlay(true, data)"
                v-if="data.status == 0"
              ></i> -->
          </span>
        </span>
      </el-tree>

      <!-- 搜索表格 -->
      <HuilanDialog
        :title="$t('kwIntentionManage.searchClassify')"
        append-to-body
        :visible.sync="searchFlag"
        width="600px"
      >
        <SearchTable
          v-if="searchFlag"
          :name="inputSearch"
          :botId="botId"
          :classType="classType"
          @localNode="localNode"
        />
      </HuilanDialog>

      <!-- 新建分类 -->
      <HuilanDialog
        :title="
          isEditOrAddType == 'add'
            ? $t('kwIntentionManage.buildClassifyName')
            : $t('kwIntentionManage.editClassifyName')
        "
        append-to-body
        :visible.sync="classifyFlag"
        width="450px"
      >
        <el-form
          :label-position="labelPosition"
          ref="elForm"
          :model="formData"
          :rules="rules"
          size="medium"
          label-width="90px"
        >
          <el-form-item
            :label="$t('kwIntentionManage.classifyNames') + ':'"
            prop="classifyName"
          >
            <el-input
              v-model="formData.classifyName"
              :placeholder="$t('kwIntentionManage.classifyNameTips')"
              clearable
              :style="{ width: '100%' }"
              maxlength="50"
              show-word-limit
            >
            </el-input>
          </el-form-item>
          <template v-if="classType === 'tableQa'">
            <el-form-item :label="$t('faq.formReference') + ':'" prop="formId">
              <el-select
                v-model="formData.formId"
                :placeholder="$t('aicosCommon.pleaseSelect')"
                :disabled="disabled"
              >
                <el-option
                  v-for="item in options"
                  :key="item.id"
                  :label="item.tableName"
                  :value="item.id"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </template>
        </el-form>
        <template v-slot:footer>
          <el-button size="small" @click="classifyFlag = false">{{
            $t("aicosCommon.cancelBtn")
          }}</el-button>
          <el-button
            size="small"
            type="primary"
            @click="submitForm"
            :disabled="btnDisabled"
            >{{ $t("aicosCommon.saveBtn") }}</el-button
          >
        </template>
      </HuilanDialog>
      <!-- </basic-container> -->
    </el-scrollbar>
  </div>
</template>

<script>
import { getLazyList } from "@/api/kwKnowledgeCenter/kwSettings/kwDimensionManage/index";
import {
  treeList,
  changeStatus,
  collect,
  cancel,
  saveOrUpdate,
  classifyDelete,
} from "@/api/kwKnowledgeCenter/kwClassifySetting/index";
import { formList } from "@/api/kwKnowledgeCenter/kwSettings/formsetting/index";
import { getRules } from "@/util/regx";
import { mapGetters } from "vuex";

import SearchTable from "./searchTable";
export default {
  inject: ["desktopWindow", "desktop"],
  computed: {
    // 计算属性
    ...mapGetters(["language"]),

    labelPosition() {
      return this.language != "zh" ? "top" : "right";
    },
  },
  components: {
    SearchTable,
  },
  props: {
    name: {
      type: String,
      default: () => {
        return "全部";
      },
    },
    //机器人id
    botId: {
      type: String,
      default() {
        return "";
      },
    },
    //类型:意图or faq
    classType: {
      type: String,
      default() {
        return "";
      },
    },
    //是否需要返回我的收藏节点
    isMine: {
      type: Boolean,
      default: () => {
        return true;
      },
    },
    //是否是分类设置界面
    isSetting: {
      type: Boolean,
      default: () => {
        return true;
      },
    },
    // 默认展开的节点
    defaultExpandNodes: {
      type: Array,
      default: () => {
        return ["0"];
      },
    },
    //是不是从富文本编辑器过来的
    ckEditFlag: {
      type: String,
      default: () => {
        return "";
      },
    },
  },
  data() {
    return {
      btnDisabled: false,
      options: [],
      searchFlag: false,
      formData: {
        classifyName: "",
        formId: "",
      },
      disabled: false,
      rules: {
        classifyName: [
          {
            required: true,
            message: this.$t("kwIntentionManage.classifyNameTips"),
            trigger: "blur",
          },
          ...getRules(["charNumHanUnderline"]),
        ],
        formId: [
          {
            required: true,
            message:
              this.$t("aicosCommon.pleaseSelect") +
              this.$t("faq.formReference"),
            trigger: "blur",
          },
        ],
      },
      cur: {},
      classifyFlag: false,
      isEditOrAddType: "add", //编辑,新增标识
      inputSearch: "", //输入的内容
      moveClassifyFlag: false,
      // botId: "",
      props: {
        label: "dname",
        children: "children",
        // 设置了value后getNode才能通过key获取节点
        // value: "id",
        isLeaf: "leaf",
      },
      classProps: {
        // multiple: true,
        checkStrictly: true, // 父子不想关联
        // emitPath: false,
        lazy: true,
        lazyLoad: this.lazyLoads,
        value: "id",
        label: "dname",
        multiple: true,
      },
      moveData: {
        moveInfo: "",
      },
      node: "", //重新请求的节点参数
      resolve: "", //重新请求的节点方法
      currentNodeId: "0", //当前点击节点id
      defaultExpand: [], //默认展开节点id
    };
  },
  methods: {
    //级联懒加载
    lazyLoads(node, resolve) {
      if (node.level == 0) {
        const info = {
          ancestors: 0,
          botId: this.botId,
          classType: this.classType,
          mine: this.isMine,
        };
        var listArr = [];
        // console.log(info);
        treeList(info).then((res) => {
          listArr = res.data.data.filter((item) => {
            return item.id != "mine";
          });
          resolve(
            listArr.map((item) => {
              return {
                ...item,
                leaf: item.isLeaf != 0,
              };
            })
          );
        });
      } else {
        var parentId = node.data.id;
        const info = {
          ancestors: parentId,
          botId: this.botId,
          classType: this.classType,
          mine: this.isMine,
        };
        treeList(info).then((res) => {
          resolve(
            res.data.data.map((item) => {
              return {
                ...item,
                leaf: item.isLeaf != 0,
              };
            })
          );
        });
      }
    },

    //表格树懒加载
    loadNode(node, resolve) {
      // let that = this;
      if (node.level === 0) {
        this.node = node;
        this.resolve = resolve;
        return resolve([{ id: "0", dname: this.name }]);
      }
      const parentId = node.data.id;

      if (
        this.classType == "intent" ||
        this.classType == "faq" ||
        this.classType == "file" ||
        this.classType === "gossip" ||
        this.classType === "tableQa"
      ) {
        const info = {
          ancestors: parentId,
          botId: this.botId,
          classType: this.classType,
          mine: this.isMine,
        };
        treeList(info).then((res) => {
          resolve(
            res.data.data.map((item) => {
              return {
                ...item,
                leaf: item.isLeaf != 0,
              };
            })
          );

          this.positionSetCurrentKey();
        });
      } else {
        getLazyList(parentId).then((res) => {
          resolve(
            res.data.data.map((item) => {
              return {
                ...item,
                leaf: item.isLeaf == 0,
              };
            })
          );

          this.positionSetCurrentKey();
        });
      }
    },

    // 定位node节点
    positionSetCurrentKey() {
      this.$emit("getNode", { node: this.node, resolve: this.resolve });
      this.$nextTick(() => {
        setTimeout(() => {
          this.$refs.tree.setCurrentKey(this.currentNodeId);
        }, 200);
      });
    },

    //新建分类
    addNewClassify(data) {
      this.classifyFlag = true;
      this.isEditOrAddType = "add";
      this.formData.classifyName = "";
      if (this.classType === "tableQa") {
        if (data.id !== "0") {
          this.formData.formId = data.formId;
        } else {
          this.formData.formId = "";
        }
        if (data.isLeaf === undefined || data.isAllowed === undefined) {
          this.disabled = false;
        } else {
          this.disabled = true;
        }
      }
      // this.$nextTick(() => {
      //   this.$refs.elForm.resetFields();
      // });
      this.cur = data;
    },
    //编辑分类
    addEditClassify(data) {
      this.classifyFlag = true;
      this.isEditOrAddType = "edit";
      if (this.classType === "tableQa") {
        this.formData.formId = data.formId;
        // console.log(data);
        if (data.isAllowed === 1 && data.ancestors === "0") {
          this.disabled = false;
        } else {
          this.disabled = true;
        }
      }
      this.formData.classifyName = data.dname;
      this.formData.id = data.id;
      this.cur = data;
    },
    //保存分类
    submitForm() {
      let that = this;
      this.$refs.elForm.validate(async (valid) => {
        if (!valid) return;
        const info = {
          dname: this.formData.classifyName,
          ancestors: this.cur.id,
          botId: this.botId,
          classType: this.classType,
        };
        if (this.classType === "tableQa") {
          info.formId = this.formData.formId;
        }
        if (this.isEditOrAddType == "edit") {
          info.id = this.cur.id;
        }
        this.btnDisabled = true;
        saveOrUpdate(info)
          .then((result) => {
            if (result.data.code == 200) {
              this.$message({
                type: "success",
                message: that.$t("aicosCommon.successOperate"),
              });
              that.classifyFlag = false;
              if (that.isEditOrAddType == "add") {
                that.updateTreeNode(that.isEditOrAddType);
              } else {
                that.updateTreeNode(that.isEditOrAddType, that.formData);
              }
              this.btnDisabled = false;
            }
          })
          .catch(() => {
            this.btnDisabled = false;
          });
      });
    },

    //删除分类
    deleteCollectClassify(data) {
      this.$confirm(this.$t("kwIntentionManage.sureDelClassify"), {
        cancelButtonText: this.$t("aicosCommon.cancelBtn"),
        confirmButtonText: this.$t("aicosCommon.confirmBtn"),
        type: "warning",
      })
        .then(async () => {
          const info = {
            id: data.id,
          };
          const result = await classifyDelete(info);
          if (result.data.code == 200) {
            this.$message({
              type: "success",
              message: this.$t("aicosCommon.deleteSuccessTip"),
            });
            this.updateTreeNode("del", data);
          }
        })
        .catch(() => {});
    },
    //节点更新
    updateTreeNode(type, data) {
      let that = this;
      const tree = that.$refs.tree;
      const curParent = tree.getNode(this.cur.id);
      let curNode = {};
      if (type === "add") {
        if (curParent.isLeaf) {
          curParent.isLeaf = false;
          curParent.loaded = false;
          if (!curParent.expanded) {
            curParent.expand();
          }
        } else {
          if (curParent.loaded) {
            curParent.loaded = false;
            curParent.expand();
          } else {
            curParent.expand();
          }
        }
      } else if (type === "edit") {
        this.updateCollectTreeNode();
        curNode = tree.getNode(data.id);
        if (curNode) {
          curNode.data.dname = data.classifyName;
        }
      } else if (type === "del") {
        if (curParent) {
          if (curParent.loaded) {
            curParent.loaded = false;
            if (curParent.expanded) {
              curParent.expand();
            }
          }
        }
        // else {
        tree.remove(data.id);
        // }
        this.$refs.tree.clearNode();
        this.$refs.tree.loadNode(this.node, this.resolve);
        this.$nextTick(() => {
          setTimeout(() => {
            this.$emit("nodeClick", "0");
            this.$refs.tree.setCurrentKey("0");
          }, 800);
        });
      } else if (type == "patchDel") {
        this.selectionList.forEach((node) => {
          tree.remove(node.id);
        });

        if (curParent.loaded) {
          curParent.loaded = false;

          if (!curParent.expanded) {
            curParent.expand();
          }
        }
      } else if (type == "move") {
        if (curParent.loaded) {
          curParent.loaded = false;

          if (curParent.expanded) {
            curParent.expand();
          }
        }
      }
    },
    //定位到指定节点
    localNode(data) {
      let that = this;
      if (data.deepPath == "") {
        var tree = that.$refs.tree;
        var curParent = tree.getNode("0");
        curParent.expand();
        this.$refs.tree.setCurrentKey(data.id);
        this.$emit("nodeClick", data.id);
      } else {
        // var tree = that.$refs.tree;
        const deepPathArr = data.deepPath.split(",");
        // var curParent = tree.getNode(deepPathArr[0]);
        deepPathArr.forEach((item) => {
          this.defaultExpand.push(item);
        });
        this.$nextTick(() => {
          setTimeout(() => {
            this.$refs.tree.setCurrentKey(data.id);
            this.$emit("nodeClick", data.id);
          }, 800);
        });
      }

      this.searchFlag = false;
    },
    clearNode() {
      this.node.childNodes = [];
    },

    mouseenter(data) {
      this.$set(data, "isShow", true);
    },
    mouseleave(data) {
      this.$set(data, "isShow", false);
    },
    handlerNodeClick(data) {
      // console.log(data);
      this.currentNodeId = data.dynamicId ? data.dynamicId : data.id;
      // console.log(this.currentNodeId);
      const item = { ...data, currentNodeId: this.currentNodeId };
      this.$emit("nodeClick", item);
    },
    reset() {
      this.node.childNodes = [];
      this.loadNode(this.node, this.resolve);
    },
    nodeExpand(data) {
      this.defaultExpand.push(data.id);
    },
    nodeCollapse(data) {
      this.defaultExpand.splice(this.defaultExpand.indexOf(data.id), 1);
    },

    //打开分类设置
    openClassifySetting() {
      this.$emit("openSetting");
    },

    updateCollectTreeNode() {
      const tree = this.$refs.tree;
      const curParent = tree.getNode("0");

      if (curParent.loaded) {
        curParent.loaded = false;

        if (curParent.expanded) {
          curParent.expand();
        }
      }
    },

    //保存收藏
    async collectClassify(data) {
      this.$confirm(this.$t("kwIntentionManage.collectTips"), {
        cancelButtonText: this.$t("aicosCommon.cancelBtn"),
        confirmButtonText: this.$t("aicosCommon.confirmBtn"),
        type: "warning",
      })
        .then(async () => {
          var newArr = [];
          newArr.push(data.id);
          const moveInfo = {
            classifyIds: newArr,
            classType: this.classType,
            botId: this.botId,
          };
          const result = await collect(moveInfo);
          if (result.data.code == 200) {
            this.$message({
              type: "success",
              message: this.$t("kwIntentionManage.successCollect"),
            });
            /*this.clearNode();
        this.loadNode(this.node, this.resolve);*/
            this.updateCollectTreeNode();
          }
        })
        .catch(() => {});
    },

    //取消收藏
    cancelCollectClassify(data) {
      this.$confirm(this.$t("kwIntentionManage.cancelCollect"), {
        cancelButtonText: this.$t("aicosCommon.cancelBtn"),
        confirmButtonText: this.$t("aicosCommon.confirmBtn"),
        type: "warning",
      })
        .then(async () => {
          const info = {
            classifyId: data.dynamicId ? data.dynamicId : data.id,
            classType: this.classType,
            botId: this.botId,
          };
          const result = await cancel(info);
          if (result.data.code == 200) {
            this.$message({
              type: "success",
              message: this.$t("aicosCommon.successOperate"),
            });
            /* this.clearNode();
            this.loadNode(this.node, this.resolve);*/
            this.updateCollectTreeNode();
          }
        })
        .catch(() => {});
    },

    //启用停用
    async pauseOrPlay(flag, data) {
      if (flag) {
        //启用
        const statusInfo = {
          id: data.id,
          status: 1,
        };
        const result = await changeStatus(statusInfo);
        if (result.data.code == 200) {
          this.$message({
            type: "success",
            message: this.$t("kwIntentionManage.successStart"),
          });
          this.clearNode();
          this.loadNode(this.node, this.resolve);
        }
      } else {
        //停用
        const statusInfo = {
          id: data.id,
          status: 0,
        };
        const result = await changeStatus(statusInfo);
        if (result.data.code == 200) {
          this.$message({
            type: "success",
            message: this.$t("aicosCommon.stopSuccessTip"),
          });
          this.clearNode();
          this.loadNode(this.node, this.resolve);
        }
      }
    },
  },

  mounted() {
    formList(this.botId).then((res) => {
      if (res.data.success) {
        this.options = res.data.data;
      }
    });
    if (this.defaultExpandNodes.length > 1) {
      this.defaultExpandNodes.forEach((item, index) => {
        if (index < this.defaultExpandNodes.length - 1) {
          this.defaultExpand.push(item);
        }
      });
    } else {
      this.defaultExpand = this.defaultExpandNodes;
    }

    this.currentNodeId =
      this.defaultExpandNodes[this.defaultExpandNodes.length - 1];
    // this.$emit("nodeClick", this.currentNodeId);
  },
};
</script>

<style lang="scss" scoped>
.custom-tree-node {
  display: flex;
  justify-content: space-between;
  align-items: center;

  .kw-nodeName {
    font-size: 14px;

    width: 240px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    display: block;
  }

  // .isPause {
  //   color: #e4e4e4;
  // }
}

/deep/ .el-tree-node.is-current > .el-tree-node__content {
  background: #f5f7f9 !important;
}

/deep/ .el-tree-node__content span {
  overflow: visible;
}

.search-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}
</style>
