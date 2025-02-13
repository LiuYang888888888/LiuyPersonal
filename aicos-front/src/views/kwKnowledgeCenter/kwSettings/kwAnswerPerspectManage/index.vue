<template>
  <HuilanBasic :left-width="250">
    <template v-slot:left>
      <div
        class="kw-left-container kw-base-container"
        :style="
          allWindowTopBodyHeight && { height: allWindowTopBodyHeight + 'px' }
        "
      >
        <el-row style="margin-right: 0px; margin-left: 0px">
          <el-col :span="8">
            <el-button
              type="primary"
              size="mini"
              @click="addCate"
              v-if="permission[`${prefix}angle-type-add`]"
              :title="$t('answerViewManage.buildViewType')"
              >{{ $t("answerViewManage.buildViewType") }}</el-button
            >
          </el-col>
          <el-col :span="8">
            <el-button
              type="primary"
              size="mini"
              @click="editCate"
              v-if="permission[`${prefix}angle-type-edit`]"
              :title="$t('answerViewManage.editViewType')"
              >{{ $t("answerViewManage.editViewType") }}</el-button
            >
          </el-col>
          <el-col :span="8">
            <el-button
              type="primary"
              size="mini"
              @click="deleteCate"
              v-if="permission[`${prefix}angle-type-delete`]"
              :title="$t('answerViewManage.delViewType')"
              >{{ $t("answerViewManage.delViewType") }}</el-button
            >
          </el-col>
        </el-row>
        <div
          class="profile-config-template-scroll"
          style="height: calc(100% - 36px); overflow: auto"
        >
          <ul
            id="profileConfigList"
            class="profile-config-template-list"
            style="height: calc(100% - 32px)"
          >
            <li
              class="profile-config-item"
              v-for="list in viewTypeList"
              :key="list.id"
              :class="[selectedCateId == list.id ? 'item-this' : '']"
              :title="list.name"
              @click="handlerChoose(list.name, list.id)"
            >
              <p>{{ list.name }}</p>
            </li>
          </ul>
        </div>
      </div>
    </template>
    <div class="">
      <div
        class="kw-right-container"
        :style="{
          height: allWindowTopBodyHeight ? allWindowTopBodyHeight + 'px' : '',
          marginLeft: '20px',
        }"
      >
        <avue-crud
          :option="option"
          :data="data"
          :permission="permissionList"
          ref="crudTemplateTable"
          @row-click="getOpenDetail"
          :page.sync="page"
          :table-loading="loading"
          @on-load="onLoad"
          @select="checkboxIsChange"
          @select-all="checkboxIsAllChange"
        >
          <template slot="header">
            <div class="kw-header">
              <div class="kw-button-container">
                <el-button
                  @click="addDomain"
                  class="kw-build-button kw-btn-green"
                  v-if="permission[`${prefix}angle-add`]"
                  >{{ $t("answerViewManage.buildDomain") }}</el-button
                >
              </div>
              <div id="kw-form-container">
                <div class="kw-form-form">
                  <el-input
                    :placeholder="$t('answerViewManage.viewName')"
                    v-model="viewName"
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
                    class="kw-search-btn"
                    @click="handlerSearch"
                    size="small"
                  ></el-button>
                  <el-button
                    class="kw-reset-btn"
                    @click="handlerReset"
                    size="small"
                    ><i class="aicosicon aicos-icon-clear"></i
                  ></el-button>
                </div>
              </div>
            </div>
          </template>
          <template slot-scope="scope" slot="menu">
            <el-button
              type="text"
              size="small"
              v-if="
                scope.row.level == 1 && permission[`${prefix}angle-addChildren`]
              "
              @click.stop="handlerAddDomain(scope.row, scope.index)"
              >{{ $t("answerViewManage.buildChildDomain") }}</el-button
            >
            <el-button
              type="text"
              size="small"
              v-if="
                scope.row.level != 1 && permission[`${prefix}angle-addChildren`]
              "
              @click.stop="handlerAddDomain(scope.row, scope.index)"
              >{{ $t("answerViewManage.buildChildDomain") }}</el-button
            >
            <el-button
              type="text"
              size="small"
              v-if="permission[`${prefix}angle-edit`]"
              @click.stop="handlerEdit(scope.row, scope.index)"
              >{{ $t("aicosCommon.editBtn") }}</el-button
            >
            <el-button
              type="text"
              size="small"
              v-if="
                scope.row.indexLine[scope.row.indexLine.length - 1] != 0 &&
                permission[`${prefix}angle-up`]
              "
              @click.stop="goWhere(scope, true)"
              >{{ $t("aicosCommon.moveUp") }}</el-button
            >
            <el-button
              type="text"
              size="small"
              v-if="
                scope.row.indexLine[scope.row.indexLine.length - 1] + 1 !=
                  scope.row.parentLength && permission[`${prefix}angle-down`]
              "
              @click.stop="goWhere(scope, false)"
              >{{ $t("aicosCommon.moveDown") }}</el-button
            >
            <el-button
              type="text"
              size="small"
              class="kw-del-btn"
              v-if="permission[`${prefix}angle-delete`]"
              @click.stop="handlerDel(scope.row, scope.index)"
              >{{ $t("aicosCommon.delBtn") }}</el-button
            >
          </template>
        </avue-crud>
      </div>
    </div>
    <HuilanDialog
      :title="
        isEdit
          ? $t('answerViewManage.editViewTypeName')
          : $t('answerViewManage.viewTypeName')
      "
      append-to-body
      :visible.sync="viewTypeFlag"
      width="600px"
    >
      <el-form
        :label-position="labelPosition"
        :model="ruleForm"
        :rules="rules"
        v-if="viewTypeFlag"
        ref="rule"
        label-width="120px"
        class="demo-ruleForm"
      >
        <el-form-item
          :label="$t('answerViewManage.name') + ':'"
          prop="typeName"
        >
          <el-input
            v-model="ruleForm.typeName"
            maxlength="10"
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
          :disabled="btnDisable"
          >{{ $t("aicosCommon.saveBtn") }}</el-button
        >
      </template>
    </HuilanDialog>

    <HuilanDialog
      :title="
        isEdit
          ? $t('answerViewManage.editViewDetail')
          : $t('answerViewManage.viewDetail')
      "
      append-to-body
      :visible.sync="viewNameFlag"
      width="600px"
    >
      <el-form
        :label-position="labelPosition"
        :model="typeNameForm"
        v-if="viewNameFlag"
        :rules="rules"
        ref="typeNameForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item :label="$t('answerViewManage.names') + ':'" prop="name">
          <el-input
            v-model="typeNameForm.name"
            maxlength="15"
            show-word-limit
          ></el-input>
        </el-form-item>
        <el-form-item
          :label="$t('answerViewManage.encoding') + ':'"
          prop="code"
        >
          <el-input
            v-model="typeNameForm.code"
            maxlength="30"
            show-word-limit
          ></el-input>
        </el-form-item>
        <el-form-item :label="$t('answerViewManage.desc') + ':'" prop="desc">
          <el-input
            type="textarea"
            v-model="typeNameForm.desc"
            maxlength="200"
            show-word-limit
          ></el-input>
        </el-form-item>
      </el-form>

      <template v-slot:footer>
        <el-button size="small" @click="viewNameFlag = false">{{
          $t("aicosCommon.cancelBtn")
        }}</el-button>
        <el-button
          size="small"
          type="primary"
          @click="saveViewName"
          :disabled="disabled"
          >{{ $t("aicosCommon.saveBtn") }}</el-button
        >
      </template>
    </HuilanDialog>
  </HuilanBasic>
  <!--<someComponent></someComponent>-->
</template>

<script>
//import someComponent from './someComponent'
import {
  angleTypeList,
  saveOrUpdate,
  viewDelete,
  angleList,
  angelSaveOrUpdate,
  changeOrder,
} from "@/api/kwKnowledgeCenter/kwSettings/kwAnswerViewManage/index";
import { getRules } from "@/util/regx";
import { mapGetters } from "vuex";
export default {
  inject: ["desktopWindow", "desktop", "isRobotMenu"],
  name: "",
  data() {
    return {
      btnDisable: false,
      disabled: false,
      isEdit: false,
      allWindowTopBodyHeight: 0, //窗口的高度
      isSearch: false,
      cur: {},
      loading: false,
      editFlag: false, //编辑或新增区分的标识
      selectedCateId: "", //默认左侧列表id
      selectedCateName: "", //默认左侧列表的名字
      viewTypeFlag: false, //视角类型标识
      viewNameFlag: false,
      botId: "", //机器人id
      viewTypeList: [], //视角类型列表
      viewName: "", //搜索用的视角名称
      tableListId: "", //列表数据的id
      data: [],
      page: {
        total: 0,
        currentPage: 1,
        pageSize: 10,
      },
      option: {
        // selection: true,
        rowKey: "id",
        rowParentKey: "ancestors",
        height: 550,
        menuWidth: 260,
        addBtn: false,
        editBtn: false,
        viewBtn: false,
        delBtn: false,
        searchBtn: false,
        columnBtn: false,
        refreshBtn: false,
        stripe: true,
        emptyText: this.$t('aicosCommon.notData'),
        column: [
          {
            label: this.$t("answerViewManage.viewName"), //视角名称
            prop: "name",
          },
          {
            label: this.$t("answerViewManage.encoding"),
            prop: "code",
            rules: [
              {
                pattern: /^[a-z0-9]+$/,
                message: this.$t("answerViewManage.numberTips"),
              },
            ],
          },
          {
            label: this.$t("answerViewManage.desc"), //类型
            prop: "remake",
          },
        ],
      },
      ruleForm: {
        typeName: "",
      },
      typeNameForm: {
        name: "",
        code: "",
        desc: "",
      },
      rules: {
        typeName: {
          required: true,
          message: this.$t("answerViewManage.viewTypeTips"),
          trigger: "blur",
        },
        code: {
          pattern: /^[a-z0-9]+$/,
          message: this.$t("answerViewManage.lowercaseTips"),
          trigger: "blur",
        },
        name: [
          {
            required: true,
            message: this.$t("answerViewManage.viewNameTips"),
            trigger: "blur",
          },
          ...getRules(["charNumHan"]),
        ],
      },
    };
  },
  components: {
    //someComponent
  },
  computed: {
    prefix() {
      const prefix = this.isRobotMenu ? "robot-" : "";
      return prefix;
    },
    // 计算属性
    ...mapGetters(["permission", "language"]),
    labelPosition() {
      return this.language != "zh" ? "top" : "right";
    },
  },
  methods: {
    //动态获取窗口大小
    desktopWindowResize() {
      this.allWindowTopBodyHeight =
        this.desktopWindow.$el.getElementsByClassName(
          "desk-window-inner"
        )[0].offsetHeight;
    },

    //获取左侧列表
    async getList() {
      const Info = {
        botId: this.botId,
      };
      const result = await angleTypeList(Info);
      if (result.data.code == 200) {
        this.viewTypeList = result.data.data;
        if (this.selectedCateId) {
          this.selectedCateId = this.selectedCateId;
        } else {
          this.selectedCateId =
            this.viewTypeList.length > 0 ? this.viewTypeList[0].id : "";
        }
        this.viewTypeList.forEach((item) => {
          if (item.id == this.selectedCateId) {
            this.selectedCateName = item.name;
          }
        });
        // this.selectedCateName =
        //   this.viewTypeList.length > 0 ? this.viewTypeList[0].name : "";
      }
      this.onLoad();
    },

    getOpenDetail(row) {
      this.$refs.crudTemplateTable.toggleRowExpansion(row);
    },

    //获取右侧表格数据

    onLoad() {
      let that = this;
      this.$nextTick(async () => {
        setTimeout(async () => {
          this.loading = true;
          const tableInfo = {
            botId: this.botId,
            current: this.page.currentPage,
            size: this.page.pageSize,
            name: this.viewName,
          };
          tableInfo.id = that.selectedCateId;
          tableInfo.topNode = that.selectedCateId;
          const result = await angleList(tableInfo);
          this.option.menuWidth = this.language != "zh" ? 390 : 260;
          if (result.data.code == 200) {
            const Data = result.data.data;
            this.page.total = Data.total;
            this.data = Data.records;
            this.tableDataHandle(this.data, "children");
            this.loading = false;
          }
        }, 100);
      });
    },

    //处理获取到的树型表格数据
    tableDataHandle(arr, key, level = 0, indexLine = []) {
      level = level + 1;
      arr.map((item, idx) => {
        item.level = level;
        item.indexLine = Object.assign([], indexLine);
        item.indexLine.push(idx);
        item.parentLength = arr.length;
        if (item[key]) {
          this.tableDataHandle(item[key], key, level, item.indexLine);
        }
      });
      return arr;
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
    async upAndDown(target, flag, row) {
      let temTable;
      if (target.length == 1) {
        temTable = this.data;
      } else {
        temTable = this.getParentData(this.data, row);
      }
      let index = target[target.length - 1];
      if (flag) {
        //上移
        const moveId = {
          fromId: temTable[index].id,
          todoId: temTable[index - 1].id,
        };
        const result = await changeOrder(moveId);
        if (result.data.code == 200) {
          this.$message({
            type: "success",
            message: this.$t("aicosCommon.successOperate"),
          });
          this.onLoad();
        }
      } else {
        const moveId = {
          fromId: temTable[index].id,
          todoId: temTable[index + 1].id,
        };
        const result = await changeOrder(moveId);
        if (result.data.code == 200) {
          this.$message({
            type: "success",
            message: this.$t("aicosCommon.successOperate"),
          });
          this.onLoad();
        }
      }
    },
    //新增视角类型
    addCate() {
      this.isEdit = false;
      this.editFlag = false;
      this.viewTypeFlag = true;
      this.ruleForm.typeName = "";
    },
    //编辑视角类型
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
        this.ruleForm.typeName = this.selectedCateName;
      }
    },
    //删除视角类型
    deleteCate() {
      if (this.selectedCateId == "" || this.selectedCateName == "") {
        this.$message({
          type: "warning",
          message: this.$t("answerViewManage.editViewTypeTips"),
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
              id: this.selectedCateId,
            };
            const result = await viewDelete(delInfo);
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
      }
    },
    //保存视角类型
    async saveViewType() {
      const info = {
        botId: this.botId,
        name: this.ruleForm.typeName,
      };
      if (this.editFlag) {
        info.id = this.selectedCateId;
      }
      this.$refs.rule.validate(async (valid) => {
        if (valid) {
          this.btnDisable = true;
          saveOrUpdate(info)
            .then((result) => {
              if (result.data.code == 200) {
                this.$message({
                  type: "success",
                  message: this.$t("aicosCommon.saveSuccessTip"),
                });
                this.viewTypeFlag = false;
                this.btnDisable = false;
                this.getList();
              }
            })
            .catch(() => {
              this.btnDisable = false;
            });
        }
      });
    },
    //点击左侧列表方法
    handlerChoose(name, id) {
      this.selectedCateName = name;
      this.selectedCateId = id;
      this.viewName = "";
      this.onLoad();
    },

    //新增领域
    addDomain() {
      this.isEdit = false;
      this.editFlag = false;
      this.viewNameFlag = true;
      this.typeNameForm.name = "";
      this.typeNameForm.code = "";
      this.typeNameForm.desc = "";
      this.cur = {};
    },
    //新建子级视角
    handlerAddDomain(row) {
      this.cur = row;
      this.isEdit = false;
      this.editFlag = false;
      this.viewNameFlag = true;
      this.typeNameForm.name = "";
      this.typeNameForm.code = "";
      this.typeNameForm.desc = "";
    },
    //编辑领域
    handlerEdit(row) {
      this.viewNameFlag = true;
      this.isEdit = true;
      this.editFlag = true;
      this.tableListId = row.id;
      this.typeNameForm.name = row.name;
      this.typeNameForm.code = row.code;
      this.typeNameForm.desc = row.remake;
    },
    //删除领域数据
    handlerDel(row) {
      this.$confirm(this.$t("answerViewManage.delViewTypeTips"), {
        cancelButtonText: this.$t("aicosCommon.cancelBtn"),
        confirmButtonText: this.$t("aicosCommon.confirmBtn"),
        type: "warning",
      })
        .then(async () => {
          const delInfo = {
            id: row.id,
          };
          const result = await viewDelete(delInfo);
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
    //搜索列表
    handlerSearch() {
      this.onLoad();
      setTimeout(() => {
        this.listIsExpand(this.data, true);
      }, 300);
    },

    //重置搜索结果
    handlerReset() {
      // this.$set(this.option, "defaultExpandAll", false);
      this.viewName = "";
      this.onLoad();
      this.listIsExpand(this.data, false);
    },
    //列表树的展开收起
    listIsExpand(arr, expandFlag) {
      this.loading = true;
      arr.forEach((item) => {
        this.$refs.crudTemplateTable.toggleRowExpansion(item, expandFlag);
        if (item.children) {
          this.listIsExpand(item.children, expandFlag);
        }
      });
      this.loading = false;
    },
    //保存领域
    async saveViewName() {
      let that = this;
      const tableInfo = {
        topNode: that.selectedCateId,
        botId: that.botId,
        name: that.typeNameForm.name,
        remake: that.typeNameForm.desc,
        code: this.typeNameForm.code,
        ancestors: that.cur.id ? that.cur.id : that.selectedCateId, //父级id
        secondNode: that.cur.secondNode ? that.cur.secondNode : that.cur.id, //顶级id
      };
      if (that.editFlag) {
        tableInfo.id = that.tableListId;
      }
      that.$refs.typeNameForm.validate(async (valid) => {
        if (valid) {
          this.disabled = true;
          angelSaveOrUpdate(tableInfo)
            .then((result) => {
              if (result.data.code == 200) {
                that.$message({
                  type: "success",
                  message: that.$t("aicosCommon.saveSuccessTip"),
                });
                this.disabled = false;
                that.viewNameFlag = false;
                that.onLoad();
                setTimeout(() => {
                  if (tableInfo.secondNode != "") {
                    that.getOpenDetail(that.cur);
                  }
                  that.cur = {};
                }, 200);
              }
            })
            .catch(() => {
              this.disabled = false;
            });
        }
      });
    },
  },
  created() {},
  mounted() {
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
  destroyed() {},
};
</script>

<style lang="scss" scoped>
/deep/ .avue-crud__menu {
  min-height: 0;
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
</style>
