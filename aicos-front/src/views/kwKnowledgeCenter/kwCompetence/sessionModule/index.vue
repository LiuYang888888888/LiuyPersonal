<template>
  <HuilanBasic class="kw-base-container">
    <avue-crud
      :option="option"
      :data="data"
      ref="crud"
      :page.sync="page"
      :table-loading="loading"
      @on-load="onLoad"
      @select="select"
      @select-all="selectAll"
      @selection-change="selectionChange"
    >
      <template slot="header">
        <div class="kw-header">
          <div class="kw-button-container">
            <!-- 新增会话模块 -->
            <el-button
              @click="addModule"
              class="kw-build-button kw-btn-green"
              v-if="permission['module-add']"
              size="small"
              >{{ $t("kwCompetence.addSessionModel") }}</el-button
            >
            <el-button @click="docDown" type="primary" size="small">{{
              $t("kwCompetence.documentDownloadTips")
            }}</el-button>
            <!-- 批量操作 -->
            <el-dropdown
              class="kw-batch-button"
              @command="handleCommand"
              v-if="
                permission['module-startMore'] ||
                  permission['module-stopMore'] ||
                  permission['module-deleteMore']
              "
            >
              <el-button type="primary" size="small">
                {{ $t("kwIntentionManage.moreOperate")
                }}<i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <!-- 批量启用 -->
                <el-dropdown-item
                  command="banthStart"
                  v-if="permission['module-startMore']"
                  >{{ $t("aicosCommon.batchStart") }}</el-dropdown-item
                >
                <!-- 批量停用 -->
                <el-dropdown-item
                  command="banthPause"
                  v-if="permission['module-stopMore']"
                  >{{ $t("aicosCommon.batchPause") }}</el-dropdown-item
                >
                <!-- 批量删除 -->
                <el-dropdown-item
                  command="banthDel"
                  v-if="permission['module-deleteMore']"
                  >{{ $t("aicosCommon.batchDeleteBtn") }}</el-dropdown-item
                >
              </el-dropdown-menu>
            </el-dropdown>
          </div>
          <div id="kw-form-container">
            <div class="kw-form-form">
              <!-- 状态 -->
              <el-select
                v-model="moduleStatus"
                clearable
                size="small"
                :placeholder="$t('kwCompetence.status')"
                class="kw-form-type"
              >
                <el-option
                  :label="$t('aicosCommon.start')"
                  value="1"
                ></el-option>
                <el-option
                  :label="$t('aicosCommon.pause')"
                  value="0"
                ></el-option>
              </el-select>
              <!-- 搜索内容 -->
              <el-input
                :placeholder="$t('kwCompetence.modelNameTips')"
                v-model="searchContent"
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
              <el-button size="small" class="kw-reset-btn" @click="handlerReset"
                ><i class="aicosicon aicos-icon-clear"></i
              ></el-button>
            </div>
          </div>
        </div>
      </template>
      <!-- 操作栏 -->
      <template slot-scope="scope" slot="menu">
        <!-- 编辑 -->
        <el-button
          type="text"
          size="small"
          v-if="permission['module-edit'] && scope.row.isSystem === 0"
          @click.stop="handlerEdit(scope.row, scope.index)"
          >{{ $t("aicosCommon.editBtn") }}</el-button
        >
        <!-- 启用 -->
        <el-button
          type="text"
          size="small"
          v-if="
            scope.row.isUse == 0 &&
              permission['module-start'] &&
              scope.row.type !== 5
          "
          @click.stop="changeStatus(scope.row, scope.index, true)"
          >{{ $t("aicosCommon.start") }}</el-button
        >
        <!-- 停用 -->
        <el-button
          type="text"
          size="small"
          v-if="
            scope.row.isUse == 1 &&
              permission['module-stop'] &&
              scope.row.type !== 5
          "
          @click.stop="changeStatus(scope.row, scope.index, false)"
          >{{ $t("aicosCommon.pause") }}</el-button
        >
        <!-- 删除 -->
        <el-button
          type="text"
          size="small"
          class="kw-del-btn"
          v-if="permission['module-delete'] && scope.row.isSystem === 0"
          @click.stop="handlerDel(scope.row, scope.index)"
          >{{ $t("aicosCommon.delBtn") }}</el-button
        >
      </template>
      <!-- 状态 -->
      <template slot-scope="scope" slot="isUse">
        <!-- 启用 -->
        <div v-if="scope.row.isUse == 1">{{ $t("aicosCommon.start") }}</div>
        <!-- 停用 -->
        <div v-if="scope.row.isUse == 0">{{ $t("aicosCommon.pause") }}</div>
      </template>
      <!-- 是否兜底 -->
      <template slot-scope="{ row }" slot="isDetail">
        <el-switch
          v-if="row.moduleType === 1 || row.moduleType === 2"
          v-model="value1"
          active-text="开"
          inactive-text="关"
        >
        </el-switch>
        <span v-else>--</span>
      </template>
    </avue-crud>
    <HuilanDialog
      :title="
        isEdit ? $t('kwCompetence.editModule') : $t('kwCompetence.addModule')
      "
      append-to-body
      :visible.sync="addFlag"
      width="800px"
    >
      <AddModule
        ref="module"
        v-if="addFlag"
        :botId="botId"
        :cur="cur"
        @successSave="successSave"
        :isEdit="isEdit"
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
  </HuilanBasic>
</template>

<script>
import AddModule from "./addModule";
import { mapGetters } from "vuex";
import {
  listDataModule,
  updateEnabled,
  moduleDelete
} from "@/api/kwRobot/kwRobotTrain/index";
import serviceList from "@/config/serviceList";
import { baseURL } from "@/api/common";
const { file } = serviceList;
export default {
  components: {
    AddModule
  },
  computed: {
    ...mapGetters(["botObj", "permission"])
  },
  mounted() {
    this.botId = this.botObj.id;
  },
  data() {
    return {
      idsArr: [],
      cur: {},
      isEdit: false,
      botId: "",
      moduleStatus: "", //状态
      searchContent: "", //搜索内容
      addFlag: false,
      loading: false,
      data: [],
      page: {
        total: 0,
        currentPage: 1,
        pageSize: 10
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
        selectable: row => {
          return row.isSystem === 0;
        },
        emptyText: this.$t("aicosCommon.notData"),

        column: [
          // 模块名称
          {
            label: this.$t("kwCompetence.moduleName"), //模块名称
            prop: "name"
          },
          // 会话模块地址
          {
            label: this.$t("kwCompetence.moduleUrl"), //会话模块地址
            prop: "address",
            minWidth: 100,
            overHidden: true,
            formatter: (val, value, label) => {
              if (this.validatenull(value)) {
                return "--";
              }
              return label;
            }
          },
          // 类型
          {
            label: this.$t("kwCompetence.type"),
            prop: "moduleType",
            type: "select",
            dicData: [
              {
                label: this.$t("kwCompetence.knowledgeBase"),
                value: 0
              },
              {
                label: this.$t("kwCompetence.model"),
                value: 1
              },
              {
                label: this.$t("kwCompetence.SE"),
                value: 2
              },
              {
                label: this.$t("kwCompetence.other"),
                value: 3
              }
            ],
            formatter: (val, value, label) => {
              if (this.validatenull(value)) {
                return "--";
              }
              return label;
            }
          },
          // 状态
          {
            label: this.$t("kwCompetence.status"), //状态
            prop: "isUse"
          }
        ]
      }
    };
  },
  methods: {
    async onLoad() {
      const info = {
        botId: this.botObj.id,
        current: this.page.currentPage,
        size: this.page.pageSize,
        enabled: this.moduleStatus, //状态
        modelName: this.searchContent //模块名称
      };
      this.loading = true;
      const result = await listDataModule(info);
      if (result.data.code == 200) {
        const Data = result.data.data;
        this.loading = false;
        // console.log(Data);
        this.page.total = Data.total;
        this.data = Data.records;
      }
    },
    //新建
    addModule() {
      this.isEdit = false;
      this.addFlag = true;
      this.cur = {};
    },
    //编辑
    handlerEdit(row) {
      this.cur = row;
      this.addFlag = true;
      this.isEdit = true;
    },
    //更改状态
    changeStatus(row, index, flag) {
      if (flag) {
        //启用
        this.$confirm(this.$t("answerViewManage.enableTypeTips"), {
          cancelButtonText: this.$t("aicosCommon.cancelBtn"),
          confirmButtonText: this.$t("aicosCommon.confirmBtn"),
          type: "warning"
        }).then(async () => {
          const startInfo = {
            ids: row.id,
            type: 1
          };
          const startResult = await updateEnabled(startInfo);
          if (startResult.data.code == 200) {
            this.$message({
              type: "success",
              message: this.$t("aicosCommon.successOperate")
            });
            this.onLoad();
          }
        });
      } else {
        //停用
        this.$confirm(this.$t("answerViewManage.disableTypeTips"), {
          cancelButtonText: this.$t("aicosCommon.cancelBtn"),
          confirmButtonText: this.$t("aicosCommon.confirmBtn"),
          type: "warning"
        }).then(async () => {
          const startInfo = {
            ids: row.id,
            type: 0
          };
          const startResult = await updateEnabled(startInfo);
          if (startResult.data.code == 200) {
            this.$message({
              type: "success",
              message: this.$t("aicosCommon.successOperate")
            });
            this.onLoad();
          }
        });
      }
    },
    //删除
    handlerDel(row) {
      this.$confirm(this.$t("answerViewManage.delViewTypeTips"), {
        cancelButtonText: this.$t("aicosCommon.cancelBtn"),
        confirmButtonText: this.$t("aicosCommon.confirmBtn"),
        type: "warning"
      })
        .then(async () => {
          const delInfo = {
            ids: row.id
          };
          const result = await moduleDelete(delInfo);
          if (result.data.code == 200) {
            this.$message({
              type: "success",
              message: this.$t("aicosCommon.deleteSuccessTip")
            });
            this.onLoad();
          }
        })
        .catch(() => {});
    },
    docDown() {
      window.open(
        `${baseURL}api/${file}/miniofile/download/000000/ActionAgent第三方会话模块接口规范_1691980053480.pdf`
      );
    },
    //点击复选框
    selectionChange(val) {
      const newArr = [];
      val.forEach(item => {
        newArr.push(item.id);
      });
      this.idsArr = [...new Set(newArr)];
    },

    //批量操作
    async handleCommand(command) {
      if (command == "banthStart") {
        //批量启用
        if (this.idsArr.length == 0) {
          this.$message({
            type: "warning",
            message: this.$t("aicosCommon.chooseDataTip")
          });
          return;
        } else {
          const startInfo = {
            ids: this.idsArr.join(","),
            type: 1
          };
          const startResult = await updateEnabled(startInfo);
          if (startResult.data.code == 200) {
            this.$message({
              type: "success",
              message: this.$t("aicosCommon.successOperate")
            });
            this.onLoad();
          }
        }
      } else if (command == "banthPause") {
        //批量停用
        if (this.idsArr.length == 0) {
          this.$message({
            type: "warning",
            message: this.$t("aicosCommon.chooseDataTip")
          });
          return;
        } else {
          const startInfo = {
            ids: this.idsArr.join(","),
            type: 0
          };
          const startResult = await updateEnabled(startInfo);
          if (startResult.data.code == 200) {
            this.$message({
              type: "success",
              message: this.$t("aicosCommon.successOperate")
            });
            this.onLoad();
          }
        }
      } else if (command == "banthDel") {
        //批量删除
        if (this.idsArr.length == 0) {
          this.$message({
            type: "warning",
            message: this.$t("aicosCommon.chooseDataTip")
          });
          return;
        } else {
          this.$confirm(this.$t("answerViewManage.delViewTypeTips"), {
            cancelButtonText: this.$t("aicosCommon.cancelBtn"),
            confirmButtonText: this.$t("aicosCommon.confirmBtn"),
            type: "warning"
          })
            .then(async () => {
              const startInfo = {
                ids: this.idsArr.join(",")
              };
              const startResult = await moduleDelete(startInfo);
              if (startResult.data.code == 200) {
                this.$message({
                  type: "success",
                  message: this.$t("aicosCommon.deleteSuccessTip")
                });
                this.onLoad();
              }
            })
            .catch(() => {});
        }
      }
    },

    //搜索
    handlerSearch() {
      this.onLoad();
    },
    //重置
    handlerReset() {
      this.moduleStatus = "";
      this.searchContent = "";
      this.onLoad();
    },
    //点击保存
    handlerSave() {
      this.$refs.module.saveOrUpdate();
    },
    //保存成功
    successSave() {
      this.addFlag = false;
      this.onLoad();
    }
  }
};
</script>

<style lang="scss" scoped>
/deep/ .avue-crud__menu {
  display: none;
}
</style>
