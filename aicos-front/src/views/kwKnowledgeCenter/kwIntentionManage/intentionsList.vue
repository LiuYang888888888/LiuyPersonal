<template>
  <div>
    <!-- 意图列表区域 -->
    <basic-container>
      <div class="intentionContainer" v-show="triggerFlag">
        <!-- <div class="kw-left-container" :style="{ height: allWindowTopBodyHeight + 'px' }">
          <LeftTree
            ref="tree"
            @getNode="getNode"
            @nodeClick="nodeClick"
            :classType="classType"
            :botId="botId"
            @openSetting="openSetting"
            name="自定义意图"
          />
        </div> -->

        <avue-crud
          :option="option"
          :data="data"
          :permission="permissionList"
          ref="crud"
          :page.sync="page"
          :table-loading="loading"
          @on-load="onLoad"
          @row-click="getOpenDetail"
          @select="select"
          @select-all="selectAll"
          @selection-change="selectionChange"
        >
          <template slot="header">
            <div class="kw-header">
              <div class="kw-button-container">
                <!-- 新增意图 -->
                <el-button
                  @click="addIntention"
                  class="kw-build-button kw-btn-green"
                  v-if="permissionList.addBtn"
                  >{{ $t("kwIntentionManage.buildIntention") }}</el-button
                >
                <!-- 批量操作 -->
                <el-dropdown class="kw-batch-button" @command="handleCommand">
                  <el-button
                    type="primary"
                    class="kw-btn-blue"
                    v-if="
                      permissionList.deleteMoreBtn ||
                      permissionList.importBtn ||
                      permissionList.exportBtn
                    "
                  >
                    {{ $t("kwIntentionManage.moreOperate")
                    }}<i class="el-icon-arrow-down el-icon--right"></i>
                  </el-button>
                  <el-dropdown-menu slot="dropdown">
                    <!-- 批量删除 -->
                    <el-dropdown-item
                      command="banthDel"
                      v-if="permissionList.deleteMoreBtn"
                      >{{ $t("aicosCommon.batchDeleteBtn") }}</el-dropdown-item
                    >
                    <!-- 批量导入 -->
                    <el-dropdown-item
                      command="banthImport"
                      v-if="permissionList.importBtn"
                      >{{ $t("aicosCommon.batchImport") }}</el-dropdown-item
                    >
                    <!-- 导出全部 -->
                    <el-dropdown-item
                      command="banthExport"
                      v-if="permissionList.exportBtn"
                      >{{ $t("kwIntentionManage.exportAll") }}</el-dropdown-item
                    >
                    <!-- 数据同步 -->
                    <el-dropdown-item
                      command="sync"
                      v-if="permissionList.syncBtn"
                      >{{ $t("kwIntentionManage.dataSync") }}</el-dropdown-item
                    >
                  </el-dropdown-menu>
                </el-dropdown>
                <!-- 反问话术 -->
                <!-- <el-button class="kw-warning-button">{{
                  $t("kwIntentionManage.artQuestion")
                }}</el-button> -->
              </div>
              <div id="kw-form-container">
                <div class="kw-form-form">
                  <!-- 意图类型 -->
                  <el-select
                    v-model="intentionType"
                    clearable
                    size="small"
                    :placeholder="$t('kwIntentionManage.intentionType')"
                    class="kw-form-type"
                  >
                    <el-option
                      v-for="(item, index) in typeList"
                      :key="index"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                  <!-- 训练状态 -->
                  <!-- <el-select
                  v-model="intentionStatus"
                  size="small"
                  clearable
                  :placeholder="$t('kwIntentionManage.intentionStatus')"
                  class="kw-form-type"
                >
                  <el-option
                    v-for="(item, index) in statusList"
                    :key="index"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select> -->
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
                    @click="handlerSearch"
                  ></el-button>
                  <el-button
                    size="small"
                    class="kw-reset-btn"
                    @click="handlerReset"
                    ><i class="aicosicon aicos-icon-clear"></i
                  ></el-button>
                </div>
              </div>
            </div>
          </template>

          <template slot-scope="{ row }" slot="menu">
            <!-- 编辑 -->
            <el-button
              type="text"
              size="small"
              v-if="permissionList.editBtn"
              @click.stop="handlerEdit(row)"
              >{{ $t("aicosCommon.editBtn") }}</el-button
            >

            <!-- 添加子意图 -->
            <el-button
              v-if="
                row.intentType != null &&
                row.intentType == 1 &&
                permissionList.childrenBtn
              "
              type="text"
              size="small"
              :disabled="row.intentType != 1"
              @click.stop="handlerAddIntention(row)"
              >{{ $t("kwIntentionManage.addIntention") }}</el-button
            >
            <!-- 删除 -->
            <el-button
              type="text"
              size="small"
              class="kw-del-btn"
              v-if="permissionList.delBtn"
              @click.stop="handlerDel(row)"
              >{{ $t("aicosCommon.delBtn") }}</el-button
            >
          </template>

          <template slot-scope="{ row }" slot="intentType">
            <!-- 问答类型 -->
            <div v-if="row.intentType == 1">
              {{ $t("kwIntentionManage.answerType") }}
            </div>
            <!-- 任务类型 -->
            <div v-else>{{ $t("kwIntentionManage.taskType") }}</div>
          </template>
          <template slot-scope="{ row }" slot="trainingFlag">
            <!-- 已训练 -->
            <div v-if="row.trainingFlag == 1">
              {{ $t("kwIntentionManage.hasTrain") }}
            </div>
            <div v-else>{{ $t("kwIntentionManage.readyTrain") }}</div>
          </template>
        </avue-crud>
      </div>
      <!-- 新建意图区域 -->
      <div class="addIntentionContainer" v-if="!triggerFlag">
        <Add
          @back="back"
          :botId="botId"
          :classifyId="classifyId"
          :cur="cur"
          :isEdit="isEdit"
          :sonCur="sonCur"
          :addSonIntentFlag="addSonIntentFlag"
          :addType="addType"
        />
      </div>

      <!-- 意图导入 -->
      <HuilanDialog
        :title="$t('kwIntentionManage.intentImport')"
        append-to-body
        :visible.sync="importFlag"
        width="600px"
      >
        <Import
          moduleName="intent"
          ref="import"
          importFlag=""
          @successImport="successImport"
          v-if="importFlag"
        />
        <template v-slot:footer>
          <el-button size="small" @click="importFlag = false">{{
            $t("aicosCommon.cancelBtn")
          }}</el-button>
          <el-button
            size="small"
            type="primary"
            @click="handlerSave"
            :disabled="importBtn"
            >{{ $t("aicosCommon.saveBtn") }}</el-button
          >
        </template>
      </HuilanDialog>
    </basic-container>
  </div>
</template>

<script>
import LeftTree from "@/components/kwLeftTree/index";
import Add from "./add";
import Setting from "./setting";
import Import from "@/components/kwImportComponent/index";
import {
  intentList,
  intentDelete,
  batchDelete,
  batchSyncToEs,
  // intentionExport,
} from "@/api/kwKnowledgeCenter/kwIntention/index";
import { mapGetters } from "vuex";
import serviceList from "@/config/serviceList";
import { baseURL } from "@/api/common";
const { knowledge } = serviceList;
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
      importBtn: false,
      importFlag: false,
      ids: [],
      sonCur: {},
      addSonIntentFlag: false,
      isEdit: false,
      cur: {},
      node: "",
      resolve: "",
      typeList: [
        { label: this.$t("kwIntentionManage.answerType"), value: "1" },
        { label: this.$t("kwIntentionManage.taskType"), value: "2" },
      ],
      statusList: [
        { label: this.$t("kwIntentionManage.hasTrain"), value: "1" },
        { label: this.$t("kwIntentionManage.readyTrain"), value: "0" },
      ],
      classifyId: "0", //分类id
      allWindowTopBodyHeight: 0, //窗口的高度
      classType: "intent",
      settingDrawer: false, //业务分类弹窗开关
      triggerFlag: true, //列表页和新建意图页进行切换
      intentionType: "", //问答类型
      intentionStatus: "", //训练状态
      intentionName: "", //意图名称
      data: [],
      page: {
        total: 0,
        currentPage: 1,
        pageSize: 10,
      },
      option: {
        tip: false,
        selection: true,
        // height: 515,
        addBtn: false,
        editBtn: false,
        viewBtn: false,
        delBtn: false,
        searchBtn: false,
        columnBtn: false,
        refreshBtn: false,
        stripe: true,
        menuWidth: 260,
        menuAlign: "center",
        emptyText: this.$t('aicosCommon.notData'),
        column: [
          {
            label: this.$t("kwIntentionManage.intentionName"), //意图名称
            prop: "intentName",
            overHidden: true,
            formatter: (val, value, label) => {
              if (this.validatenull(value)) {
                return "--";
              }
              return label;
            },
          },
          {
            label: this.$t("kwIntentionManage.intentionType"), //意图类型
            prop: "intentType",
            formatter: (val, value, label) => {
              if (this.validatenull(value)) {
                return "--";
              }
              return label;
            },
          },
          {
            label: this.$t("kwIntentionManage.intentTheme"), //意图主题
            prop: "intentTheme",
            overHidden: true,
            formatter: (val, value, label) => {
              if (this.validatenull(value)) {
                return "--";
              }
              return label;
            },
          },
          // {
          //   label: this.$t("kwIntentionManage.intentionStatus"), //训练状态
          //   prop: "trainingFlag",
          // },
          {
            label: this.$t("kwIntentionManage.commonAnswer"), //常用问法
            prop: "commonCount",
          },
          {
            label: this.$t("kwIntentionManage.regular"), //正则表达式
            prop: "regularCount",
          },
        ],
      },
      addType: "",
    };
  },
  computed: {
    ...mapGetters(["permission"]),
    permissionList() {
      const prefix = this.isRobotMenu ? "robot-" : "";
      return {
        addBtn: this.vaildData(
          this.permission[`${prefix}intention-add`],
          false
        ),
        delBtn: this.vaildData(
          this.permission[`${prefix}intention-delete`],
          false
        ),
        editBtn: this.vaildData(
          this.permission[`${prefix}intention-edit`],
          false
        ),
        childrenBtn: this.vaildData(
          this.permission[`${prefix}intention-addchildren`],
          false
        ),
        deleteMoreBtn: this.vaildData(
          this.permission[`${prefix}intention-deleteMore`],
          false
        ),
        exportBtn: this.vaildData(
          this.permission[`${prefix}intention-export`],
          false
        ),
        syncBtn: this.vaildData(
          this.permission[`${prefix}intention-batchSyncToEs`],
          false
        ),
        importBtn: this.vaildData(
          this.permission[`${prefix}intention-import`],
          false
        ),
      };
    },
  },
  components: {
    LeftTree,
    Add,
    Setting,
    Import,
  },
  methods: {
    async onLoad() {
      this.loading = true;
      const info = {
        botId: this.botId,
        classifyId: this.classifyId,
        current: this.page.currentPage,
        size: this.page.pageSize,
        intentName: this.intentionName, //意图名称
        intentType: this.intentionType, //意图类型
        trainingFlag: this.intentionStatus, //训练状态
      };
      const result = await intentList(info);
      if (result.data.code == 200) {
        // console.log(result.data);
        this.data = result.data.data.records;
        // this.tableDataHandle(this.data, "children");
        this.page.total = result.data.data.total;
        this.loading = false;
      }
    },
    //处理获取到的树型表格数据
    // tableDataHandle(arr, key, level = 0, indexLine = []) {
    //   level = level + 1;
    //   arr.map((item, idx) => {
    //     item.level = level;
    //     item.indexLine = Object.assign([], indexLine);
    //     item.indexLine.push(idx);
    //     item.parentLength = arr.length;
    //     if (item[key]) {
    //       this.tableDataHandle(item[key], key, level, item.indexLine);
    //     }
    //   });
    //   console.log(arr, "####");
    //   return arr;
    // },
    nodeClick(data) {
      this.classifyId = data;
      this.onLoad();
    },
    //动态获取窗口大小
    desktopWindowResize() {
      this.allWindowTopBodyHeight =
        this.desktopWindow.$el.getElementsByClassName(
          "desk-window-inner"
        )[0].offsetHeight;
    },
    //抽屉关闭的回调
    handlerClose() {
      this.$refs.tree.clearNode();
      this.$refs.tree.loadNode(this.node, this.resolve);
    },
    //获取树的node和resolve
    getNode(data) {
      this.node = data.node;
      this.resolve = data.resolve;
    },
    //搜索
    handlerSearch() {
      this.onLoad();
      setTimeout(() => {
        this.listIsExpand(this.data, true);
      }, 300);
    },
    //重置
    handlerReset() {
      this.intentionName = "";
      this.intentionType = "";
      this.intentionStatus = "";
      this.onLoad();
      this.listIsExpand(this.data, false);
    },
    //导入保存
    handlerSave() {
      this.importBtn = true;
      this.$refs.import.saveImport();
    },
    successImport(type) {
      this.importBtn = false;
      if (type) {
        this.importFlag = false;
        this.onLoad();
      } 
    },
    //列表树的展开收起
    listIsExpand(arr, expandFlag) {
      this.loading = true;
      arr.forEach((item) => {
        this.$refs.crud.toggleRowExpansion(item, expandFlag);
        if (item.children) {
          this.listIsExpand(item.children, expandFlag);
        }
      });
      this.loading = false;
    },
    //新建意图
    addIntention() {
      this.addType = "parent";
      this.triggerFlag = false;
      this.isEdit = false;
      this.cur = {};
      this.sonCur = {};
      // this.addSonIntentFlag = true;
    },
    //编辑新建完的意图
    handlerEdit(row) {
      this.cur = row;
      this.addType = "";
      this.triggerFlag = false;
      this.isEdit = true;
      this.sonCur = {};
      // this.addSonIntentFlag = true;
    },
    //添加子意图
    handlerAddIntention(row) {
      this.addType = "son";
      this.cur = {};
      this.sonCur = row;
      this.isEdit = false;
      this.addSonIntentFlag = true;
      this.triggerFlag = false;
    },

    //删除单条意图
    async handlerDel(row) {
      this.$confirm(this.$t("answerViewManage.delViewTypeTips"), {
        cancelButtonText: this.$t("aicosCommon.cancelBtn"),
        confirmButtonText: this.$t("aicosCommon.confirmBtn"),
        type: "warning",
      })
        .then(async () => {
          const delInfo = {
            id: row.id,
          };
          const result = await intentDelete(delInfo);
          if (result.data.code == 200) {
            this.$message({
              type: "success",
              message: this.$t("aicosCommon.deleteSuccessTip"),
            });
            this.onLoad();
          }
        })
        .catch(() => {});
    },
    //取消新建意图
    back() {
      this.triggerFlag = true;
      this.onLoad();
      setTimeout(() => {
        this.getOpenDetail(this.sonCur);
        this.sonCur = {};
      }, 200);
    },
    getOpenDetail(row) {
      this.$refs.crud.toggleRowExpansion(row);
    },
    //业务设置
    openSetting() {
      this.settingDrawer = true;
    },

    //设置子级选中
    setChildren(children, type) {
      children.map((item) => {
        this.toggleSelection(item, type);
        if (item.children) {
          this.setChildren(item.children, type);
        }
      });
    },
    toggleSelection(row, select) {
      if (row) {
        this.$nextTick(() => {
          this.$refs.crud && this.$refs.crud.toggleRowSelection(row, select);
        });
      }
    },
    // 设置父级选中/取消
    setParent(currentRow, type, parent, selectionLists) {
      if (!parent.length) {
        parent = this.data;
      }
      let allSelect = [];
      parent.forEach((item) => {
        if (item.children) {
          // 注：ancestors是当前选中节点的所有父节点的一个字符串形式的数据，这个很关键
          if (currentRow.topNode.indexOf(item.id) != -1) {
            // 选中
            if (type) {
              selectionLists.forEach((k) => {
                item.children.forEach((j) => {
                  if (k.id == j.id) {
                    allSelect.push(j);
                  }
                });
              });
              if (allSelect.length == item.children.length) {
                this.toggleSelection(item, type);
                selectionLists.push(item);
                this.select(selectionLists, item);
              } else {
                this.setParent(currentRow, type, item.children, selectionLists);
              }
            } else {
              // 取消选中
              this.toggleSelection(item, type);
              this.setParent(currentRow, type, item.children);
            }
          }
        }
      });
    },
    // 选中父节点时，子节点一起选中取消
    select(selection, row) {
      const hasSelect = selection.some((el) => {
        return row.id === el.id;
      });
      if (hasSelect) {
        if (row.children) {
          // 解决子组件没有被勾选到
          this.setChildren(row.children, true);
        }
        // 子级选中, 如果当前的同级都选中了，则父级就选中了(目前只做到父级选中，爷爷级选不中)
        // this.setParent(row, true, [], selection);
      } else {
        if (row.children) {
          this.setChildren(row.children, false);
        }
        // 子级取消选中, 传入当前选中节点, 所有父级取消选中
        this.setParent(row, false, []);
      }
    },

    // 选择全部
    selectAll(selection) {
      // data第一层只要有在selection里面就是全选
      const isSelect = selection.some((el) => {
        const tableDataIds = this.data.map((j) => j.id);
        return tableDataIds.includes(el.id);
      });
      // data第一层只要有不在selection里面就是全不选
      const isCancel = !this.data.every((el) => {
        const selectIds = selection.map((j) => j.id);
        return selectIds.includes(el.id);
      });
      if (isSelect) {
        selection.map((el) => {
          if (el.children) {
            // 解决子组件没有被勾选到
            this.setChildren(el.children, true);
          }
        });
      }
      if (isCancel) {
        this.data.map((el) => {
          if (el.children) {
            // 解决子组件没有被勾选到
            this.setChildren(el.children, false);
          }
        });
      }
    },

    //获取选中数据
    selectionChange(value) {
      console.log(value, "###");
      var idArr = [];
      value.forEach((item) => {
        idArr.push(item.id);
      });
      this.ids = [...new Set(idArr)];
    },

    //下拉菜单的操作
    async handleCommand(command) {
      if (command == "banthDel") {
        if (this.ids.length == 0) {
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
                ids: this.ids,
              };
              const result = await batchDelete(delInfo);
              if (result.data.code == 200) {
                this.$message({
                  type: "success",
                  message: this.$t("aicosCommon.deleteSuccessTip"),
                });
                this.onLoad();
              }
            })
            .catch(() => {});
        }
      } else if (command == "banthExport") {
        var form = document.createElement("form");
        var botInput = document.createElement("input");
        var classifyId = document.createElement("input");
        var currentInput = document.createElement("input");
        var sizeInput = document.createElement("input");
        var intentInput = document.createElement("input");
        var intentType = document.createElement("input");
        var trainingFlag = document.createElement("input");
        form.setAttribute("style", "display:none");
        form.setAttribute("method", "get");
        //botId
        botInput.setAttribute("type", "hidden");
        botInput.setAttribute("name", "botId");
        botInput.setAttribute("value", this.botId);
        form.append(botInput);
        //classify
        classifyId.setAttribute("type", "hidden");
        classifyId.setAttribute("name", "classifyId");
        classifyId.setAttribute("value", this.classifyId);
        form.append(classifyId);
        //currentInput
        currentInput.setAttribute("type", "hidden");
        currentInput.setAttribute("name", "current");
        currentInput.setAttribute("value", this.page.currentPage);
        form.append(currentInput);
        //size
        sizeInput.setAttribute("type", "hidden");
        sizeInput.setAttribute("name", "size");
        sizeInput.setAttribute("value", this.page.pageSize);
        form.append(sizeInput);
        //intentName
        intentInput.setAttribute("type", "hidden");
        intentInput.setAttribute("name", "intentName");
        intentInput.setAttribute("value", this.intentionName);
        form.append(intentInput);
        //intentType
        intentType.setAttribute("type", "hidden");
        intentType.setAttribute("name", "intentType");
        intentType.setAttribute("value", this.intentionType);
        form.append(intentType);
        //trainingFlag
        trainingFlag.setAttribute("type", "hidden");
        trainingFlag.setAttribute("name", "trainingFlag");
        trainingFlag.setAttribute("value", this.intentionStatus);
        form.append(trainingFlag);

        form.setAttribute(
          "action",
          `${baseURL}api/${knowledge}/km-intent/export`
        );
        form.setAttribute("target", "_blank");
        var body = document.createElement("body");
        body.setAttribute("style", "display:none");
        document.body.appendChild(form);
        form.submit();
        form.remove();
      } else if (command == "banthImport") {
        this.importFlag = true;
      } else if (command === "sync") {
        let obj = {
          botId: this.botId,
          classifyId: this.classifyId,
          ids: this.ids,
          current: 1,
          size: 10000000,
          intentName: this.intentionName,
          intentType: this.intentionType,
        };
        batchSyncToEs(obj).then((res) => {
          if (res.data.code === 200) {
            this.$message.success("同步成功");
            this.onLoad();
          }
        });
      }
    },
  },
  mounted() {
    if (this.desktopWindow) {
      //获取窗口的大小
      this.allWindowTopBodyHeight =
        this.desktopWindow.$el.getElementsByClassName(
          "desk-window-inner"
        )[0].offsetHeight;
      //监听窗口变化,重新获取新的窗口大小
      this.desktopWindow.$on("resize", this.desktopWindowResize);
    }
  },
  beforeDestroy() {
    if (this.desktopWindow) {
      this.desktopWindow.$off("resize", this.desktopWindowResize);
    }
  },
};
</script>

<style lang="scss" scoped>
/deep/ .el-card__body {
  padding: 0;
}

/deep/ .avue-crud__menu {
  display: none;
}
</style>
