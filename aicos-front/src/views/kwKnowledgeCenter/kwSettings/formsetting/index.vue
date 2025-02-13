<template>
  <HuilanBasic class="fieldSetting" :left-width="250">
    <template v-slot:left>
      <div style="overflow: hidden">
        <el-row style="margin-right: 0px; margin-left: 0px; padding: 0 20px">
          <el-col :span="8">
            <el-button
              type="primary"
              size="mini"
              @click="addCate"
              v-if="permission[`${prefix}form-type-add`]"
              :title="$t('answerViewManage.buildViewType')"
              >{{ $t("answerViewManage.buildViewType") }}</el-button
            >
          </el-col>
          <el-col :span="8">
            <el-button
              type="primary"
              size="mini"
              @click="editCate"
              v-if="permission[`${prefix}form-type-edit`]"
              :title="$t('answerViewManage.editViewType')"
              >{{ $t("answerViewManage.editViewType") }}</el-button
            >
          </el-col>
          <el-col :span="8">
            <el-button
              type="primary"
              size="mini"
              @click="deleteCate"
              v-if="permission[`${prefix}form-type-delete`]"
              :title="$t('answerViewManage.delViewType')"
              >{{ $t("answerViewManage.delViewType") }}</el-button
            >
          </el-col>
        </el-row>
        <div style="padding-left: 20px">
          <ul
            id="profileConfigList"
            class="profile-config-template-list"
            style="height: calc(100% - 32px)"
          >
            <li
              class="profile-config-item"
              v-for="list in viewTypeList"
              :key="list.id"
              :class="[selectedCateId === list.id ? 'item-this' : '']"
              :title="list.tableName"
              @click="handlerChoose(list.tableName, list.id)"
            >
              <p>{{ list.tableName }}</p>
            </li>
          </ul>
        </div>
      </div>
    </template>
    <div class="">
      <div
        class="kw-right-container"
        :style="{
          // height: allWindowTopBodyHeight ? allWindowTopBodyHeight + 'px' : '',
          marginLeft: '20px',
        }"
      >
        <div style="text-align: right; margin-bottom: 15px">
          <el-button
            size="small"
            type="primary"
            @click="saveSelect"
            v-if="permission[`${prefix}form-select-save`]"
            >{{ $t("aicosCommon.saveBtn") }}
          </el-button>
        </div>
        <avue-crud
          style="height: calc(100vh - 280px); overflow-y: scroll"
          :option="option"
          :data="data"
          ref="crudTemplateTable"
          :table-loading="loading"
          @on-load="onLoad"
          @select="checkboxIsChange"
          @selection-change="selectionChange"
          @select-all="checkboxIsAllChange"
        >
          <template slot-scope="{ row, index }" slot="sort">
            <div v-if="row.defaultChoice !== 1">
              <el-button
                class="el-icon-sort-down"
                type="text"
                size="small"
                v-if="index !== data.length - 3"
                @click="upAndDown(row, 1)"
              ></el-button>
              <el-button
                class="el-icon-sort-up"
                type="text"
                size="small"
                v-if="index !== 2"
                @click="upAndDown(row, 2)"
              >
              </el-button>
            </div>
          </template>
          <template slot-scope="{ row }" slot="menu">
            <el-button
              type="text"
              size="small"
              v-if="
                (row.defaultChoice !== 1 &&
                  permission[`${prefix}form-setting`]) ||
                row.nameEn === 'extendField9' ||
                row.nameEn === 'extendField10'
              "
              @click.stop="handlerSetting(row)"
              >{{ $t("aicosCommon.setUpBtn") }}</el-button
            >
          </template>
          <!-- <template slot="menuRight">
            <el-button
              size="small"
              type="primary"
              @click="saveSelect"
              v-if="permission[`${prefix}form-select-save`]"
              >{{ $t("aicosCommon.saveBtn") }}
            </el-button>
          </template> -->
        </avue-crud>
      </div>
    </div>
    <HuilanDialog
      :title="
        isEdit
          ? $t('answerViewManage.editViewType')
          : $t('answerViewManage.buildViewType')
      "
      append-to-body
      :visible.sync="viewTypeFlag"
      width="600px"
    >
      <el-form
        :model="ruleForm"
        :rules="rules"
        v-if="viewTypeFlag"
        ref="rule"
        label-width="120px"
        class="demo-ruleForm"
      >
        <el-form-item
          :label="$t('formsetting.formName') + ':'"
          prop="tableName"
        >
          <el-input
            v-model="ruleForm.tableName"
            maxlength="30"
            show-word-limit
          ></el-input>
        </el-form-item>
      </el-form>
      <template v-slot:footer>
        <el-button size="small" @click="viewTypeFlag = false">{{
          $t("aicosCommon.cancelBtn")
        }}</el-button>
        <el-button
          size="small"
          type="primary"
          @click="saveViewType"
          :disabled="disable"
          >{{ $t("aicosCommon.saveBtn") }}</el-button
        >
      </template>
    </HuilanDialog>
    <!-- 设置操作 -->
    <HuilanDialog
      :title="$t('aicosCommon.setUpBtn')"
      append-to-body
      :visible.sync="settingDialog"
      width="55%"
    >
      <Setting
        :row="selectionRow"
        :key="new Date().getTime()"
        ref="settingForm"
      />
      <template v-slot:footer>
        <el-button size="small" @click="settingDialog = false">{{
          $t("aicosCommon.cancelBtn")
        }}</el-button>
        <el-button
          size="small"
          type="primary"
          @click="saveSetting"
          :disabled="disable"
          >{{ $t("aicosCommon.saveBtn") }}</el-button
        >
      </template>
    </HuilanDialog>
  </HuilanBasic>
</template>

<script>
import {
  formList,
  saveOrUpdate,
  settingDel,
  settingList,
  changeOrder,
  settingSave,
  saveChoiceIds,
  isNotReference,
} from "@/api/kwKnowledgeCenter/kwSettings/formsetting/index";
import Setting from "./setting";
import { getTextWidth } from "@/util/util";
import { mapGetters } from "vuex";
export default {
  inject: ["desktopWindow", "desktop", "isRobotMenu"],
  name: "",
  props: {
    rowData: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      disable: false,
      idsArr: [],
      isEdit: false,
      allWindowTopBodyHeight: 0, //窗口的高度
      isSearch: false,
      cur: {},
      loading: false,
      editFlag: false, //编辑或新增区分的标识
      selectedCateId: "", //默认左侧列表id
      selectedCateName: "", //默认左侧列表的名字
      viewTypeFlag: false, //表单名称标识
      botId: "", //机器人id
      viewTypeList: [], //表单名称列表
      data: [],
      page: {
        total: 0,
        currentPage: 1,
        pageSize: 10,
      },
      option: {
        menuTitle: this.$t("formsetting.dataPermissions"),
        menuAlign: "center",
        addBtn: false,
        searchBtn: false,
        viewBtn: false,
        delBtn: false,
        editBtn: false,
        menuWidth: 100,
        selectable: (row) => {
          return row.defaultChoice !== 1;
        },
        refreshBtn: false,
        columnBtn: false,
        align: "center",
        selection: true,
        tip: false,
        emptyText: this.$t("aicosCommon.notData"),
        column: [
          {
            label: this.$t("formsetting.EnglishName"),
            prop: "nameEn",
            type: "input",
            minWidth: 120,
            showWordLimit: true,
            overHidden: true,
          },
          {
            label: this.$t("formsetting.ChineseName"),
            prop: "nameZh",
            type: "input",
            minWidth: 120,
            showWordLimit: true,
            overHidden: true,
          },
          {
            label: this.$t("formsetting.displayType"),
            prop: "displayType",
            type: "select",
            dicData: [
              {
                label: this.$t("formsetting.text"),
                value: 0,
              },
              {
                label: this.$t("formsetting.textBox"),
                value: 1,
              },
              {
                label: this.$t("formsetting.textField"),
                value: 2,
              },
              {
                label: this.$t("formsetting.textTieldAnnex"),
                value: 3,
              },
              {
                label: this.$t("formsetting.select"),
                value: 4,
              },
              {
                label: this.$t("formsetting.radio"),
                value: 5,
              },
              {
                label: this.$t("formsetting.check"),
                value: 6,
              },
              {
                label: this.$t("formsetting.dateControl"),
                value: 7,
              },
              {
                label: this.$t("formsetting.attachmentControl"),
                value: 8,
              },
              {
                label: this.$t("formsetting.imageUpload"),
                value: 9,
              },
              {
                label: this.$t("formsetting.editor"),
                value: 10,
              },
            ],
            minWidth: 120,
            showWordLimit: true,
            overHidden: true,
          },
          {
            label: this.$t("formsetting.alias"),
            prop: "alias",
            type: "input",
            minWidth: 120,
            showWordLimit: true,
            overHidden: true,
          },
          {
            label: this.$t("formsetting.required"),
            prop: "ifRequired",
            type: "radio",
            minWidth: 90,
            showWordLimit: true,
            overHidden: true,
            dicData: [
              {
                label: this.$t("aicosCommon.yes"),
                value: 1,
              },
              {
                label: this.$t("aicosCommon.no"),
                value: 0,
              },
            ],
          },
          {
            label: this.$t("formsetting.answerDisplayEle"),
            prop: "ifAnswerDisplay",
            type: "radio",
            dicData: [
              {
                label: this.$t("aicosCommon.yes"),
                value: 1,
              },
              {
                label: this.$t("aicosCommon.no"),
                value: 0,
              },
            ],
            minWidth: 120,
            showWordLimit: true,
            overHidden: true,
          },
          {
            label: this.$t("formsetting.maximumCharacters"),
            prop: "maximumCharacters",
            type: "number",
            minWidth: 120,
            showWordLimit: true,
            overHidden: true,
          },
          {
            label: this.$t("formsetting.sort"),
            prop: "sort",
            type: "input",
            minWidth: 100,
            showWordLimit: true,
            overHidden: true,
          },
        ],
      },
      ruleForm: {
        tableName: "",
      },
      typeNameForm: {
        name: "",
        desc: "",
      },
      rules: {
        tableName: {
          required: true,
          message:
            this.$t("aicosCommon.pleaseInput") +
            this.$t("formsetting.formName"),
          trigger: "blur",
        },
        name: {
          required: true,
          message: this.$t("answerViewManage.viewNameTips"),
          trigger: "blur",
        },
      },
      // 设置
      settingDialog: false,
      selectionRow: {},
    };
  },
  components: {
    Setting,
  },
  computed: {
    prefix() {
      const prefix = this.isRobotMenu ? "robot-" : "";
      return prefix;
    },
    ...mapGetters(["botObj", "permission", "language"]),
  },
  methods: {
    //表格复选框选中事件
    selectionChange(val) {
      let idArr = [];
      val.forEach((item) => {
        idArr.push(item.id);
      });
      this.idsArr = [...new Set(idArr)];
    },
    //动态获取窗口大小
    desktopWindowResize() {
      this.allWindowTopBodyHeight =
        this.desktopWindow.$el.getElementsByClassName(
          "desk-window-inner"
        )[0].offsetHeight;
    },
    //获取左侧列表
    async getList() {
      // const Info = {
      //   robotId: this.botId,
      // };
      const result = await formList(this.botId);
      if (result.data.code == 200) {
        this.viewTypeList = result.data.data;
        if (this.selectedCateId) {
          this.selectedCateId = this.selectedCateId;
        } else {
          this.selectedCateId =
            this.viewTypeList.length > 0 ? this.viewTypeList[0].id : "";
        }
        this.viewTypeList.map((item) => {
          if (item.id === this.selectedCateId) {
            this.selectedCateName = item.tableName;
          }
        });
      }
      this.onLoad();
    },
    getOpenDetail(row) {
      this.$refs.crudTemplateTable.toggleRowExpansion(row);
    },

    //获取右侧表格数据
    async onLoad() {
      this.loading = true;
      this.idsArr = [];
      if (this.selectedCateId !== "") {
        const result = await settingList(this.selectedCateId);
        if (result.data.code == 200) {
          const data = result.data.data;
          if (this.language != "zh") {
            this.option.column.forEach((item) => {
              let width = getTextWidth(item.label).nodeWidth + 80;
              this.$set(item, "width", width);
            });
            this.option.menuWidth = 150;
          }
          this.data = data;
          this.loading = false;

          this.$nextTick(() => {
            data.map((item) => {
              if (item.isChoice === 1) {
                this.idsArr.push(item.id);
                this.$refs.crudTemplateTable.toggleSelection([item], true);
              }
            });
          });
        }
      } else {
        this.loading = false;
        this.data = [];
        if (this.language != "zh") {
          this.option.column.forEach((item) => {
            let width = getTextWidth(item.label).nodeWidth + 80;
            this.$set(item, "width", width);
          });
          this.option.menuWidth = 150;
        }
      }
    },
    //上移,下移
    goWhere(scrow, flag) {
      this.upAndDown(scrow.row.indexLine, flag, scrow.row);
      this.tableDataHandle(this.data, "children");
    },
    // 精确到父亲
    getParentData(list, row) {
      let children = [];
      let findEle = (arr, data) => {
        arr.forEach((item) => {
          if (item.id == data.id) {
            children = arr;
          } else {
            if (item.children && item.children.length) {
              findEle(item.children, data);
            }
          }
        });
      };
      findEle(list, row);
      return children;
    },
    // 上下移动
    async upAndDown(row, flag) {
      // 下移
      if (flag === 1) {
        const result = await changeOrder(row.id, "down");
        if (result.data.code == 200) {
          this.$message({
            type: "success",
            message: this.$t("aicosCommon.successOperate"),
          });
          this.onLoad();
        }
      } else {
        const result = await changeOrder(row.id, "up");
        if (result.data.code == 200) {
          this.$message({
            type: "success",
            message: this.$t("aicosCommon.successOperate"),
          });
          this.onLoad();
        }
      }
    },
    //新增表单名称
    addCate() {
      this.isEdit = false;
      this.editFlag = false;
      this.viewTypeFlag = true;
      this.ruleForm.tableName = "";
    },
    //编辑表单名称
    editCate() {
      this.isEdit = true;
      this.editFlag = true;
      if (this.selectedCateId == "" || this.selectedCateName == "") {
        this.$message({
          type: "warning",
          message: this.$t("answerViewManage.editViewTypeTips"),
        });
        return;
      } else {
        this.viewTypeFlag = true;
        this.ruleForm.tableName = this.selectedCateName;
      }
    },
    // 设置
    handlerSetting(row) {
      this.settingDialog = true;
      this.selectionRow = row;
    },
    // 保存设置
    saveSetting() {
      const faqBasicForm = this.$refs.settingForm.$refs.form;
      faqBasicForm.validate((validate, done) => {
        if (validate) {
          const data = this.$refs.settingForm.saveForm();
          if (data !== false) {
            this.disable = true;
            settingSave(data)
              .then((res) => {
                if (res.data.success) {
                  this.$message.success(this.$t("formsetting.successfullySet"));
                  this.settingDialog = false;
                  this.disable = false;
                  this.onLoad();
                }
              })
              .catch(() => {
                this.disable = false;
              });
          } else {
            done();
          }
        }
      });
    },
    // 保存选择字段
    saveSelect() {
      if (this.idsArr.length === 0) {
        this.$message.warning(this.$t("formsetting.selectData"));
        return false;
      }
      saveChoiceIds(this.idsArr.join(","), this.selectedCateId).then((res) => {
        if (res.data.success) {
          this.$message.success(this.$t("aicosCommon.saveSuccessTip"));
          this.onLoad();
        }
      });
    },
    //删除表单名称
    deleteCate() {
      if (this.selectedCateId == "" || this.selectedCateName == "") {
        this.$message({
          type: "warning",
          message: this.$t("formsetting.selectDeleteTips"),
        });
        return;
      } else {
        isNotReference(this.selectedCateId).then((res) => {
          if (res.data.success && res.data.data) {
            this.$confirm(
              this.$t("formsetting.deleteTips"),
              this.$t("formsetting.deleteForm"),
              {
                cancelButtonText: this.$t("aicosCommon.cancelBtn"),
                confirmButtonText: this.$t("aicosCommon.confirmBtn"),
                type: "warning",
              }
            )
              .then(async () => {
                const result = await settingDel(this.selectedCateId);
                if (result.data.code == 200) {
                  this.$message({
                    type: "success",
                    message: this.$t("aicosCommon.deleteSuccessTip"),
                  });
                  this.selectedCateId = "";
                  this.getList();
                }
              })
              .catch(() => {});
          } else {
            this.$alert(
              this.$t("formsetting.cannotDeleteTips"),
              this.$t("formsetting.deleteForm"),
              {
                confirmButtonText: this.$t("formsetting.gotIt"),
              }
            );
          }
        });
      }
    },
    //保存表单名称
    async saveViewType() {
      const info = {
        robotId: this.botId,
        tableName: this.ruleForm.tableName,
      };
      if (this.editFlag) {
        info.id = this.selectedCateId;
      }
      this.$refs.rule.validate(async (valid) => {
        if (valid) {
          this.disable = true;
          saveOrUpdate(info)
            .then((result) => {
              if (result.data.code == 200) {
                this.$message({
                  type: "success",
                  message: this.$t("aicosCommon.saveSuccessTip"),
                });
                this.disable = false;
                this.viewTypeFlag = false;
                this.getList();
              } else {
                this.disable = false;
              }
            })
            .catch(() => {
              this.disable = false;
            });
        }
      });
    },
    //点击左侧列表方法
    handlerChoose(name, id) {
      this.selectedCateName = name;
      this.selectedCateId = id;
      this.onLoad();
    },
  },
  mounted() {
    if (!this.validatenull(this.rowData)) {
      this.selectedCateId = this.rowData.id;
    }
    // 收起左侧菜单
    if (!this.$store.getters.isCollapse) {
      this.$store.commit("SET_COLLAPSE");
    }
    // 获取机器人id
    // var query = {};
    if (this.desktopWindow) {
      //获取窗口的大小
      this.allWindowTopBodyHeight =
        this.desktopWindow.$el.getElementsByClassName(
          "desk-window-inner"
        )[0].offsetHeight;
      //监听窗口变化,重新获取新的窗口大小
      this.desktopWindow.$on("resize", this.desktopWindowResize);
    }
    this.botId = this.$store.getters.botObj.id;

    this.getList();
  },
  beforeDestroy() {
    //组件销毁取消监听
    if (this.desktopWindow) {
      this.desktopWindow.$off("resize", this.desktopWindowResize);
    }
  },
};
</script>

<style lang="scss" scoped>
/deep/ .avue-crud__menu {
  min-height: 0;
}

.fieldSetting {
  /deep/ .basic-main {
    height: 100% !important;
    overflow: hidden !important;
  }
  #profileConfigList {
    padding: 0;
    height: 695px;
  }

  #profileConfigList .profile-config-item {
    list-style: none;
    height: 30px;
    line-height: 30px;
    padding-left: 10px;
    cursor: pointer;
  }

  #profileConfigList .profile-config-item:hover {
    background-color: #f2f2f2;
  }

  #profileConfigList .profile-config-item.item-this {
    background-color: #f2f2f2;
  }

  #profileConfigList .profile-config-item p {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    cursor: pointer;
    margin: 0;
    font-size: 14px;
  }
}
</style>
