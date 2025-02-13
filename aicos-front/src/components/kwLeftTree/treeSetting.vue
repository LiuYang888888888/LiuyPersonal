<template>
  <div style="background: #f8f9fa; height: 100%; padding: 20px">
    <el-row class="kw-hasLeft-container" style="height: 100%">
      <div class="kw-left-container" style="height: 100%">
        <LeftTree
          ref="tree"
          @getNode="getNode"
          @nodeClick="nodeClick"
          :classType="classType"
          :botId="botId"
          :isMine="isMine"
          :isSetting="isSetting"
          :name="treeRootName"
        />
      </div>

      <el-container
        class="kw-right-container"
        style="height: 100%; padding: 30px"
      >
        <avue-crud
          :option="option"
          :data="data"
          :permission="permissionList"
          ref="crudTemplateTable"
          :page.sync="page"
          :table-loading="loading"
          @on-load="onLoad"
          @select="checkboxIsChange"
          @selection-change="selectionChange"
          @select-all="checkboxIsAllChange"
        >
          <template slot="header">
            <div class="kw-header">
              <div class="kw-button-container" style="margin-bottom: 20px">
                <!-- 新增分类 -->
                <el-button
                  @click="addClassify"
                  class="kw-build-button kw-btn-green"
                  >{{ $t("kwIntentionManage.buildClassify") }}</el-button
                >
                <!-- 批量操作 -->
                <el-dropdown class="kw-batch-button" @command="handleCommand">
                  <el-button type="primary">
                    {{ $t("aicosCommon.batchOperate")
                    }}<i class="el-icon-arrow-down el-icon--right"></i>
                  </el-button>
                  <el-dropdown-menu slot="dropdown">
                    <!-- 批量移动 -->
                    <el-dropdown-item command="move">{{
                      $t("aicosCommon.batchMove")
                    }}</el-dropdown-item>
                    <!-- 批量删除 -->
                    <el-dropdown-item command="del">{{
                      $t("aicosCommon.batchDeleteBtn")
                    }}</el-dropdown-item>
                    <!-- 批量启用 -->
                    <el-dropdown-item command="start">{{
                      $t("aicosCommon.batchStart")
                    }}</el-dropdown-item>
                    <!-- 批量停用 -->
                    <el-dropdown-item command="pause">{{
                      $t("aicosCommon.batchPause")
                    }}</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </div>
            </div>
          </template>

          <template slot-scope="scope" slot="menu">
            <!-- 编辑 -->
            <el-button
              type="text"
              size="small"
              @click.stop="handlerEdit(scope.row, scope.index)"
              >{{ $t("aicosCommon.editBtn") }}</el-button
            >
            <!-- 上移 -->
            <el-button
              type="text"
              size="small"
              v-if="scope.index != 0"
              @click.stop="goWhere(true, scope.row, scope.index)"
              >{{ $t("aicosCommon.moveUp") }}</el-button
            >
            <!-- 下移 -->
            <el-button
              type="text"
              size="small"
              v-if="scope.index != data.length - 1"
              @click.stop="goWhere(false, scope.row, scope.index)"
              >{{ $t("aicosCommon.moveDown") }}</el-button
            >
            <!-- 移动 -->
            <el-button
              type="text"
              size="small"
              @click.stop="handlerMove(scope.row, scope.index)"
              >{{ $t("aicosCommon.move") }}</el-button
            >
            <!-- 启用 -->
            <el-button
              type="text"
              size="small"
              v-if="scope.row.status != 1"
              @click.stop="changeStatus(true, scope.row, scope.index)"
              >{{ $t("aicosCommon.start") }}</el-button
            >
            <!-- 停用 -->
            <el-button
              type="text"
              size="small"
              v-if="scope.row.status == 1"
              @click.stop="changeStatus(false, scope.row, scope.index)"
              >{{ $t("aicosCommon.pause") }}</el-button
            >
            <!-- 删除 -->
            <el-button
              type="text"
              size="small"
              class="kw-del-btn"
              @click.stop="handlerDel(scope.row, scope.index)"
              >{{ $t("aicosCommon.delBtn") }}</el-button
            >
          </template>
          <template slot-scope="scope" slot="status">
            <div v-if="scope.row.status == 1">
              {{ $t("aicosCommon.start") }}
            </div>
            <div v-else>{{ $t("aicosCommon.pause") }}</div>
          </template>
        </avue-crud>
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
            v-if="classifyFlag"
            label-width="109px"
          >
            <el-form-item
              :label="$t('kwIntentionManage.classifyNames') + '：'"
              prop="classifyName"
            >
              <el-input
                v-model="formData.classifyName"
                :placeholder="$t('kwIntentionManage.classifyNameTips')"
                clearable
                :maxlength="50"
                show-word-limit
                :style="{ width: '100%' }"
              >
              </el-input>
            </el-form-item>
            <template v-if="classType === 'tableQa'">
              <el-form-item :label="$t('faq.formReference')" prop="formId">
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
        <!-- 移动分类 -->
        <HuilanDialog
          :title="$t('kwIntentionManage.moveTargetClassify')"
          append-to-body
          :visible.sync="moveClassifyFlag"
          width="450px"
        >
          <el-form
            ref="elFormCas"
            :label-position="labelPosition"
            label-width="109px"
            v-if="moveClassifyFlag"
            :model="moveData"
            :rules="rules"
            size="medium"
          >
            <el-form-item
              :label="$t('kwIntentionManage.targetClassify') + ':'"
              prop="moveInfo"
            >
              <el-cascader
                style="width: 100%"
                :props="props"
                expandTrigger="hover"
                clearable
                :placeholder="$t('kwIntentionManage.targetClassifyTips')"
                v-model="moveData.moveInfo"
                @change="cascaderSelectChange"
                ref="cascaderRef"
                popper-class="hiddenRadio"
              >
                <template slot-scope="{ node, data }">
                  <el-tooltip
                    :disabled="data.dname.length < 11"
                    class="item"
                    effect="dark"
                    :content="data.dname"
                    placement="top-start"
                  >
                    <div
                      style="
                        width: 230px;
                        overflow: hidden;
                        text-overflow: ellipsis;
                      "
                    >
                      {{ data.dname }}
                    </div>
                  </el-tooltip>
                </template>
              </el-cascader>
            </el-form-item>
          </el-form>
          <template v-slot:footer>
            <el-button size="small" @click="moveClassifyFlag = false">{{
              $t("aicosCommon.cancelBtn")
            }}</el-button>
            <el-button size="small" type="primary" @click="saveMove">{{
              $t("aicosCommon.saveBtn")
            }}</el-button>
          </template>
        </HuilanDialog>
      </el-container>
    </el-row>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import LeftTree from "@/components/kwLeftTree/index";
import {
  sonList,
  saveOrUpdate,
  changeOrder,
  changeStatus,
  classifyDelete,
  treeList,
  moveNode,
  batchDelete,
  batchStatus,
  batchMove,
} from "@/api/kwKnowledgeCenter/kwClassifySetting/index";
import { formList } from "@/api/kwKnowledgeCenter/kwSettings/formsetting/index";
import { getRules } from "@/util/regx";
export default {
  props: {
    botId: {
      type: String,
      default: () => {
        return "";
      },
    },
    classType: {
      type: String,
      default: () => {
        return "";
      },
    },
    treeRootName: {
      type: String,
      default: () => {
        return "全部";
      },
    },
  },
  data() {
    return {
      btnDisabled: false,
      isbatchMoveFlag: false, //是否是批量移动的标识
      idsArr: [],
      isEditOrAddType: "add",
      isSetting: false,
      cur: {},
      moveClassifyFlag: false,
      props: {
        // multiple: true,
        checkStrictly: true, // 父子不想关联
        // emitPath: false,
        lazy: true,
        lazyLoad: this.lazyLoads,
        value: "id",
        label: "dname",
      },
      isMine: false,
      ancestorsId: "0",
      loading: false,
      classifyFlag: false, //新建分类标识
      moveData: {
        moveInfo: "",
      },
      disabled: false,
      formData: {
        classifyName: "",
        formId: "",
        id: "",
      },
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
      currentData: {},
      options: [],
      data: [],
      page: {
        total: 0,
        currentPage: 1,
        pageSize: 10,
      },
      node: "",
      resolve: "",
      option: {
        menuWidth: 300,
        tip: false,
        selection: true,
        addBtn: false,
        editBtn: false,
        viewBtn: false,
        delBtn: false,
        searchBtn: false,
        columnBtn: false,
        refreshBtn: false,
        menuAlign: "left",
        stripe: true,
        emptyText: this.$t("aicosCommon.notData"),
        column: [
          {
            label: this.$t("kwIntentionManage.classifyName"), //分类名称
            prop: "name",
          },
          {
            label: this.$t("faq.formReference"),
            prop: "formId",
            type: "select",
            props: {
              label: "tableName",
              value: "id",
            },
            dicData: [],
            hide: true,
          },
          {
            label: this.$t("kwIntentionManage.nodeStatus"), //状态
            prop: "status",
          },
        ],
      },
    };
  },
  components: {
    LeftTree,
  },
  computed: {
    // 计算属性
    ...mapGetters(["language"]),
    labelPosition() {
      return this.language != "zh" ? "top" : "left";
    },
  },
  mounted() {
    if (this.classType === "tableQa") {
      const formId = this.findObject(this.option.column, "formId");
      formId.hide = false;
      formList(this.botId).then((res) => {
        if (res.data.success) {
          formId.dicData = res.data.data;
          this.options = res.data.data;
        }
      });
    }
  },
  methods: {
    //批量操作按钮
    handleCommand(command) {
      var that = this;
      const tree = this.$refs.tree.$refs.tree;
      // const curParent = tree.getNode(this.ancestorsId);
      // let curNode = tree.getNode(row.id);
      //批量删除
      if (command == "del") {
        if (this.idsArr.length == 0) {
          this.$message({
            type: "warning",
            message: this.$t("aicosCommon.chooseDataTip"),
          });
          return;
        } else {
          this.$confirm(this.$t("answerViewManage.delViewTypeTips"), {
            cancelButtonText: this.$t("aicosCommon.cancelBtn"),
            confirmButtonText: this.$t("aicosCommon.confirmBtn"),
            type: "warning",
          })
            .then(async () => {
              const delInfo = {
                ids: this.idsArr,
              };
              const result = await batchDelete(delInfo);
              if (result.data.code == 200) {
                this.$message({
                  type: "success",
                  message: this.$t("aicosCommon.deleteSuccessTip"),
                });
                that.updateTreeNode("patchDel");
                that.onLoad();
              }
            })
            .catch(() => {});
        }
      } else if (command == "start") {
        //批量启用
        if (this.idsArr.length == 0) {
          this.$message({
            type: "warning",
            message: this.$t("aicosCommon.chooseDataTip"),
          });
          return;
        } else {
          this.$confirm(this.$t("answerViewManage.isStart"), {
            cancelButtonText: this.$t("aicosCommon.cancelBtn"),
            confirmButtonText: this.$t("aicosCommon.confirmBtn"),
            type: "warning",
          })
            .then(async () => {
              const startInfo = {
                ids: this.idsArr,
                status: 1,
              };
              const result = await batchStatus(startInfo);
              if (result.data.code == 200) {
                this.$message({
                  type: "success",
                  message: this.$t("aicosCommon.successOperate"),
                });
                this.idsArr.forEach((item) => {
                  var curNode = tree.getNode(item);
                  if (curNode) {
                    curNode.data.status = 1;
                  }
                });
                that.onLoad();
              }
            })
            .catch(() => {});
        }
      } else if (command == "pause") {
        //批量停用
        if (this.idsArr.length == 0) {
          this.$message({
            type: "warning",
            message: this.$t("aicosCommon.chooseDataTip"),
          });
          return;
        } else {
          this.$confirm(this.$t("answerViewManage.isPause"), {
            cancelButtonText: this.$t("aicosCommon.cancelBtn"),
            confirmButtonText: this.$t("aicosCommon.confirmBtn"),
            type: "warning",
          })
            .then(async () => {
              const startInfo = {
                ids: this.idsArr,
                status: 0,
              };
              const result = await batchStatus(startInfo);
              if (result.data.code == 200) {
                this.$message({
                  type: "success",
                  message: this.$t("aicosCommon.successOperate"),
                });
                this.idsArr.forEach((item) => {
                  var curNode = tree.getNode(item);
                  if (curNode) {
                    curNode.data.status = 0;
                    if (curNode.loaded) {
                      curNode.loaded = false;
                      if (curNode.expanded) {
                        curNode.expand();
                      }
                    }
                  }
                });

                that.onLoad();
              }
            })
            .catch(() => {});
        }
      } else if (command == "move") {
        if (this.idsArr.length == 0) {
          this.$message({
            type: "warning",
            message: this.$t("aicosCommon.chooseDataTip"),
          });
          return;
        } else {
          this.isbatchMoveFlag = true;
          this.moveClassifyFlag = true;
          this.moveData.moveInfo = "";
        }
      }
    },
    //表格复选框选中事件
    selectionChange(val) {
      var idArr = [];
      val.forEach((item) => {
        idArr.push(item.id);
      });
      this.idsArr = [...new Set(idArr)];
    },
    //级联懒加载
    lazyLoads(node, resolve) {
      if (node.level == 0) {
        const info = {
          ancestors: 0,
          botId: this.botId,
          classType: this.classType,
          mine: this.isMine,
        };
        treeList(info).then((res) => {
          resolve(
            res.data.data.map((item) => {
              if (this.cur.id) {
                if (item.id == this.cur.id) {
                  item.disabled = true;
                }
              }
              if (this.idsArr.length > 0) {
                this.idsArr.forEach((ele) => {
                  if (ele == item.id) {
                    item.disabled = true;
                  }
                });
              }
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
              if (this.cur.id) {
                if (item.id == this.cur.id) {
                  item.disabled = true;
                }
              }
              if (this.idsArr.length > 0) {
                this.idsArr.forEach((ele) => {
                  if (ele == item.id) {
                    item.disabled = true;
                  }
                });
              }
              return {
                ...item,
                leaf: item.isLeaf != 0,
              };
            })
          );
        });
      }
    },
    //级联选中
    cascaderSelectChange() {
      this.$refs.cascaderRef.dropDownVisible = false;
    },
    async onLoad() {
      this.loading = true;
      this.option.menuWidth = this.language != "zh" ? 400 : 300;
      const info = {
        ancestors: this.ancestorsId,
        classType: this.classType,
        botId: this.botId,
      };
      const result = await sonList(info);
      if (result.data.code == 200) {
        this.data = result.data.data;
        this.loading = false;
      }
    },
    //左侧树节点切换
    nodeClick(data) {
      this.ancestorsId = data.currentNodeId;
      this.currentData = data;
      this.onLoad();
    },
    //获取树的node和resolve
    getNode(data) {
      this.node = data.node;
      this.resolve = data.resolve;
    },

    updateTreeNode(type, data) {
      const tree = this.$refs.tree.$refs.tree;
      const curParent = tree.getNode(this.ancestorsId);
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
        curNode = tree.getNode(data.id);
        if (curNode) {
          curNode.data.dname = data.classifyName;
        }
      } else if (type === "del") {
        tree.remove(data.id);
      } else if (type == "patchDel") {
        this.idsArr.forEach((node) => {
          tree.remove(node.id);
        });

        if (curParent.loaded) {
          curParent.loaded = false;

          if (curParent.expanded) {
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

    submitForm() {
      let that = this;
      this.$refs.elForm.validate(async (valid) => {
        if (!valid) return;
        const info = {
          dname: this.formData.classifyName,
          ancestors: this.ancestorsId,
          botId: this.botId,
          formId: this.formData.formId,
          classType: this.classType,
        };
        if (this.isEditOrAddType == "edit") {
          info.id = this.formData.id;
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
              that.onLoad();
            }
          })
          .catch(() => {
            this.btnDisabled = false;
          });
      });
    },

    saveMove() {
      this.$refs.elFormCas.validate(async () => {
        // if (!valid) return;
        if (this.moveData.moveInfo.length == 0) {
          this.$message({
            type: "warning",
            message: this.$t("kwIntentionManage.targetClassifyTips"),
          });
          return;
        }
        if (this.isbatchMoveFlag) {
          const moveInfo = {
            fromIds: this.idsArr,
            todoId: this.moveData.moveInfo[this.moveData.moveInfo.length - 1],
          };
          const result = await batchMove(moveInfo);
          if (result.data.code == 200) {
            this.$message({
              type: "success",
              message: this.$t("aicosCommon.successOperate"),
            });
            this.moveClassifyFlag = false;
            this.$refs.tree.clearNode();
            this.$refs.tree.loadNode(this.node, this.resolve);
            this.onLoad();
            this.isbatchMoveFlag = false;
          }
        } else {
          const moveInfo = {
            fromId: this.cur.id,
            todoId: this.moveData.moveInfo[this.moveData.moveInfo.length - 1],
          };
          const result = await moveNode(moveInfo);
          if (result.data.code == 200) {
            this.$message({
              type: "success",
              message: this.$t("aicosCommon.successOperate"),
            });
            this.moveClassifyFlag = false;
            this.$refs.tree.clearNode();
            this.$refs.tree.loadNode(this.node, this.resolve);
            this.onLoad();
            this.isbatchMoveFlag = false;
          }
        }
      });
    },
    //新建分类
    addClassify() {
      this.classifyFlag = true;
      this.formData.classifyName = "";
      if (this.classType === "tableQa") {
        if (this.ancestorsId !== "0") {
          this.disabled = true;
          this.formData.formId = this.currentData.formId;
        } else {
          this.disabled = false;
          this.formData.formId = "";
        }
      }
      this.isEditOrAddType = "add";
    },

    // 编辑分类
    handlerEdit(row) {
      this.classifyFlag = true;
      this.formData.classifyName = row.name;
      this.formData.id = row.id;
      if (this.classType === "tableQa") {
        this.formData.formId = row.formId;
        if (this.ancestorsId === "0" && row.isAllowed === 1) {
          this.disabled = false;
        } else {
          this.disabled = true;
        }
      }
      this.isEditOrAddType = "edit";
    },

    //移动分类
    handlerMove(row) {
      this.cur = row;
      this.isbatchMoveFlag = false;
      this.moveClassifyFlag = true;
      this.moveData.moveInfo = "";
    },
    //上移下移
    async goWhere(flag, row, index) {
      if (flag) {
        //上移
        const moveInfo = {
          fromId: row.id,
          todoId: this.data[index - 1].id,
        };
        const result = await changeOrder(moveInfo);
        if (result.data.code == 200) {
          this.$message({
            type: "success",
            message: this.$t("aicosCommon.successOperate"),
          });
          this.onLoad();
          this.updateTreeNode("move");
        }
      } else {
        //下移
        const moveInfo = {
          fromId: row.id,
          todoId: this.data[index + 1].id,
        };
        const result = await changeOrder(moveInfo);
        if (result.data.code == 200) {
          this.$message({
            type: "success",
            message: this.$t("aicosCommon.successOperate"),
          });
          this.onLoad();
          this.updateTreeNode("move");
        }
      }
    },

    //启用,停用
    async changeStatus(flag, row) {
      const tree = this.$refs.tree.$refs.tree;
      // const curParent = tree.getNode(this.ancestorsId);
      let curNode = tree.getNode(row.id);

      if (flag) {
        //启用
        const statusInfo = {
          id: row.id,
          status: 1,
        };
        const result = await changeStatus(statusInfo);
        if (result.data.code == 200) {
          this.$message({
            type: "success",
            message: this.$t("kwIntentionManage.successStart"),
          });
          if (curNode) {
            curNode.data.status = 1;
          }
          this.onLoad();
        }
      } else {
        //停用
        const statusInfo = {
          id: row.id,
          status: 0,
        };
        const result = await changeStatus(statusInfo);
        if (result.data.code == 200) {
          this.$message({
            type: "success",
            message: this.$t("aicosCommon.stopSuccessTip"),
          });

          if (curNode) {
            curNode.data.status = 0;

            if (curNode.loaded) {
              curNode.loaded = false;

              if (curNode.expanded) {
                curNode.expand();
              }
            }
          }
          this.onLoad();
        }
      }
    },
    //删除
    handlerDel(row) {
      this.$confirm(this.$t("kwIntentionManage.sureDelClassify"), {
        cancelButtonText: this.$t("aicosCommon.cancelBtn"),
        confirmButtonText: this.$t("aicosCommon.confirmBtn"),
        type: "warning",
      })
        .then(async () => {
          const info = {
            id: row.id,
          };
          const result = await classifyDelete(info);
          if (result.data.code == 200) {
            this.$message({
              type: "success",
              message: this.$t("aicosCommon.deleteSuccessTip"),
            });
            this.updateTreeNode("del", row);
            this.onLoad();
          }
        })
        .catch(() => {});
    },
  },
};
</script>

<style lang="scss" scoped>
.hiddenRadio .el-radio__inner {
  top: -18px;
  left: -19px;
  border-radius: 0;
  border: 0;
  width: 170px;
  height: 34px;
  background-color: transparent;
  cursor: pointer;
  box-sizing: border-box;
  position: absolute;
}

.hiddenRadio .el-radio__input.is-checked .el-radio__inner {
  background: transparent;
}

/deep/ .avue-crud {
  overflow: auto;
}

::v-deep .el-cascader-menu {
  max-width: 250px !important;
}
</style>
