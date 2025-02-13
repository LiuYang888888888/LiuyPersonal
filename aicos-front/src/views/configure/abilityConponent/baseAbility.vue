<template>
  <div>
    <div v-if="switchPage === '1'">
      <basic-container style="margin: 20px 10px; padding: 0">
        <HuilanBasicToolbar style="margin-top: 0">
          <el-button
            type="primary"
            size="small"
            @click.stop="plugAdd"
            v-if="permissionList.addBtn"
            >添加能力
          </el-button>
          <el-button
            type="primary"
            size="small"
            @click="setting"
            v-if="category1 === 'voice'"
          >
            ASR和TTS配置
          </el-button>
        </HuilanBasicToolbar>
        <HuilanBasicSearchbar
          :model="searchForm"
          :fields="searchFieldList"
          @reset="searchReset"
          @search="searchChange"
        >
          <template v-slot:appendTool>
            <el-button type="default" @click="configColumn"
              ><i class="el-icon-s-operation"></i
            ></el-button>
          </template>
        </HuilanBasicSearchbar>
        <avue-crud
          :option="option"
          :table-loading="loading"
          :data="data"
          :page="page"
          ref="crud"
          v-model="form"
          :before-open="beforeOpen"
          :permission="permissionJson"
          @row-del="rowDel"
          @row-update="rowUpdate"
          @row-save="rowSave"
          @selection-change="selectionChange"
          @current-change="currentChange"
          @size-change="sizeChange"
          @refresh-change="refreshChange"
          @on-load="treeLoad"
        >
          <template slot-scope="isTrain" slot="isTrain"
            >{{ isTrain.row.isTrain === "1" ? "是" : "否" }}
          </template>
          <template v-slot:menu="scope">
            <HuilanBasicActionTool
              :actions="getRowActions(scope.row)"
              @command="handleCommand($event, scope.row, scope.index)"
            />
          </template>
          <template slot-scope="scope" slot="description">
            <el-tag
              style="margin-right: 4px; margin-bottom: 4px"
              size="small"
              v-for="item of descriptionToSring(scope.row.description)"
              :key="item"
              >{{ item }}</el-tag
            >
          </template>
        </avue-crud>
      </basic-container>
    </div>
    <AddForm
      ref="addForm"
      :category1="category1"
      @prePageList="prePageList"
      class="addform"
    ></AddForm>
    <!-- asr\tts配置 -->
    <el-drawer
      title="ASR/TTS配置"
      append-to-body
      :visible.sync="settingVisible"
      size="80%"
      custom-class="huilan-drawer-form"
    >
      <div style="padding: 30px 10px">
        <Asrandtts ref="asrandtts" v-if="settingVisible" />
      </div>
    </el-drawer>
    <el-drawer
      title="能力配置"
      size="55%"
      append-to-body
      custom-class="huilan-drawer-form"
      :visible.sync="configVisible"
      :wrapperClosable="false"
      :show-close="false"
    >
      <el-tabs
        v-model="activeName"
        @tab-click="handleClick"
        style="padding: 30px 10px"
        v-if="configVisible"
      >
        <el-tab-pane label="热词标注" name="first">
          <Hotword
            ref="hotword"
            v-if="activeName === 'first'"
            @cancel="cancelDrawer"
          />
        </el-tab-pane>
        <el-tab-pane label="参数配置" name="second">
          <Paramconfig v-if="activeName === 'second'" @cancel="cancelDrawer" />
        </el-tab-pane>
      </el-tabs>
      <template v-slot:footer>
        <el-button size="small" @click="configVisible = false">取消</el-button>
        <el-button size="small" type="primary" @click="saveSelectConfig"
          >保存</el-button
        >
      </template>
    </el-drawer>
    <div v-if="switchPage === '2'">
      <NaturalLanguageProcessing
        :rowDataPage="rowData"
        ref="naturalLanguageProcessing"
        @nplHandl="nplHandl"
      >
      </NaturalLanguageProcessing>
    </div>
    <div v-if="switchPage === '3'">
      <InterfaceDescription
        :rowData="rowData"
        @nplHandl="nplHandl"
      ></InterfaceDescription>
    </div>
  </div>
</template>

<script>
// import {mapGetters} from "vuex";
import { getAllCloudvendorList } from "@/api/system/vendor";
import { mapGetters, mapMutations } from "vuex";
import {
  aiAbilityListByPage,
  aiAbilitySave,
  // abilityUpdate,
  abilityDelete,
  // getServiceNumberByAbilityId,
} from "@/api/configure/application";
import serviceList from "@/config/serviceList";
import Paramconfig from "./paramconfig";
import AddForm from "./addForm";
import Hotword from "./hotWord";
import NaturalLanguageProcessing from "@/views/aiCapacityBase/abilityExperience";
import InterfaceDescription from "../../interfaceDescription/index";
import aiInterfaceParama from "@/util/aiInterfaceParama";
import Asrandtts from "../../system/asrAndtts/index";
// const { system, ai } = serviceList;
const { system } = serviceList;
// import { getRules } from "@/util/regx";
import { baseURL } from "@/api/common";

export default {
  name: "baseAbility",
  components: {
    AddForm,
    NaturalLanguageProcessing,
    InterfaceDescription,
    Asrandtts,
    Hotword,
    Paramconfig,
  },
  props: {
    category1: {
      type: String,
      default: "",
    },
    category2: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      // 能力配置
      activeName: "first",
      configVisible: false,
      // asr\tts
      settingVisible: false,
      //
      aiInterfaceParama,
      rowData: {},
      switchPage: "1",
      form: {},
      dialogVisible: false,
      page: {
        pageSize: 10,
        pageSizes: [10, 30, 50, 100, 200],
        currentPage: 1,
        total: 0,
      },
      loading: true,
      data: [],
      option: {
        header: false,
        height: "auto",
        calcHeight: 95,
        tip: false,
        searchShow: true,
        searchSpan: 8,
        searchMenuSpan: 6,
        // tree: true,
        border: true,
        index: true,
        // selection: true,
        menuBtn: true,
        viewBtn: false,
        menuAlign: "center",
        editBtn: false,
        addBtn: false,
        menuWidth: 240,
        labelWidth: 140,
        searchLabelWidth: 100,
        // dialogWidth: 480,
        dialogClickModal: false,
        delBtn: false,
        dialogWidth: "40%",
        dialogType: "drawer",
        dialogCustomClass: "huilan-drawer-form",
        // expand: true,
        column: [
          {
            label: "厂商来源",
            prop: "cloudvendorId",
            searchSpan: 6,
            // search: true,
            span: 24,
            type: "select",
            dicUrl: `${baseURL}api/${system}/baseCloudvendor/getAllCloudvendorList`,
            dicMethod: "post",
            width: 120,
            dicQuery: {
              // code: "ability-classification",
            },
            props: {
              label: "name",
              value: "id",
            },
          },
          {
            label: "能力名称",
            prop: "name",
            // search: true,
            searchSpan: 6,
            type: "input",
          },
          {
            label: "支持训练",
            prop: "isTrain",
            formsolt: true,
            width: 90,
          },
          {
            label: "能力标识",
            prop: "code",
            search: false,
            searchSpan: 6,
            type: "input",
          },
          {
            label: "更新时间",
            prop: "updateTime",
            width: 160,
          },
          {
            label: "描述",
            prop: "description",
            solt: true,
          },
        ],
      },
      searchForm: {
        cloudvendorId: "",
        name: "",
      },
      searchFieldList: [
        {
          prop: "cloudvendorId",
          placeholder: "请选择厂商来源",
          type: "select",
          dicData: [],
        },
        {
          prop: "name",
          placeholder: "请输入能力名称",
        },
      ],
      typeId: null,
    };
  },
  computed: {
    ...mapGetters(["permission"]),
    permissionList() {
      return {
        addBtn: this.vaildData(
          this.permission["ai-ability-emotion-add"],
          false
        ),
        viewBtn: false,
        delBtn: this.vaildData(
          this.permission["ai-ability-emotion-del"],
          false
        ),
        configBtn: this.vaildData(
          this.permission["ai-ability-voice-config"],
          false
        ),
        editBtn: this.vaildData(
          this.permission["ai-ability-emotion-edit"],
          false
        ),
        experience: this.vaildData(
          this.permission["ai-ability-emotion-experience"],
          false
        ),
      };
    },
  },
  mounted() {
    getAllCloudvendorList({}).then((res) => {
      if (res.data.success) {
        // console.log(res.data);
        this.searchFieldList[0].dicData = res.data.data;
        this.searchFieldList[0].dicData.map((item) => {
          item.label = item.name;
          item.value = item.id;
        });
      }
    });
    const scope = this;
    setTimeout(() => {
      scope.option.column[0].value = "2";
    }, 1500);
  },
  methods: {
    ...mapMutations({
      setCurentRouterPage: "CURENT_ROUTER_PAGE",
    }),
    handleClick() {
      if (this.activeName === "second") {
        this.$refs.hotword.local();
      }
    },
    cancelDrawer() {
      this.configVisible = false;
    },
    setting() {
      this.settingVisible = true;
      this.$nextTick(() => {
        this.$refs.asrandtts.init(this.category2);
      });
    },
    nplHandl(rowData, switchPage) {
      this.rowData = { ...rowData, headerTitle: rowData.headerTitle };
      this.switchPage = switchPage;
      if (switchPage === "2") {
        this.$nextTick(() => {
          this.$refs.naturalLanguageProcessing.switchPageTab(rowData);
        });
      }
    },
    getRowActions(row) {
      const map = {
        editBtn: {
          name: "编辑",
          command: "rowUpdate",
        },
        delBtn: {
          name: "删除",
          command: "rowDel",
        },
        configBtn: {
          name: "能力配置",
          command: "rowConfig",
        },
        experience: {
          name: "体验使用",
          command: "enable",
        },
      };

      const list = ["editBtn", "delBtn", "experience"];
      if (row.code === "asrForUploadFileWithHuilan") {
        list.splice(1, 0, "configBtn");
      }
      const actions = [];
      list.forEach((item) => {
        if (this.permissionList[item]) {
          if (map[item].name === "体验使用" || map[item].name === "能力配置" || map[item].name === "编辑" || map[item].name === "删除") {
            if (
              !(
                row.code === "recordingFileAsrCallbackWithAliyunLocal" ||
                row.code === "recordingFileAsrCallbackWithAliyun"
              )
            ) {
              actions.push(map[item]);
            }
          } else {
            actions.push(map[item]);
          }
        }
      });
      return actions;
    },
    handleCommand(command, row, index) {
      this[command](row, index);
    },
    configColumn() {
      this.$refs.crud.$refs.dialogColumn.columnBox = true;
    },
    rowConfig() {
      this.configVisible = true;
    },
    rowSave(row, done, loading) {
      row = { ...row };
      aiAbilitySave(row).then(
        (res) => {
          // this.onLoad(this.page);
          if (res.data.success) {
            this.$message({
              type: "success",
              message: "操作成功!",
            });
            this.treeLoad();
            done();
          } else {
            this.$message({
              type: "error",
              message: res.data.msg,
            });
            loading();
          }
        },
        (error) => {
          window.console.log(error);
          loading();
        }
      );
    },
    rowUpdate(row) {
      row = { ...row };
      if (row.jsonValue) {
        this.$refs.addForm.requstData = JSON.parse(row.jsonValue);
      }
      this.$refs.addForm.form = row;
      this.$refs.addForm.title = "编辑能力";
      if (row.description) {
        this.$refs.addForm.dynamicTags = row.description.split(",");
      } else {
        this.$refs.addForm.dynamicTags = [];
      }
      this.$refs.addForm.dialogVisible = true;
    },
    rowDel(row) {
      this.$confirm("确定将选择数据删除?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        abilityDelete({ id: row.id }).then(() => {
          this.treeLoad();
          this.$message({
            type: "success",
            message: "操作成功!",
          });
        });
      });
    },
    searchReset() {
      this.query = {};
      this.treeLoad(this.page);
    },
    searchChange() {
      this.query = { ...this.searchForm };
      this.page.currentPage = 1;
      this.treeLoad(this.page, this.query);
    },
    selectionChange(list) {
      this.selectionList = list;
    },
    selectionClear() {
      this.selectionList = [];
      this.$refs.crud.toggleSelection();
    },
    beforeOpen(done /*, type*/) {
      this.form.systemparamId = this.parentId;
      done();
    },
    currentChange(currentPage) {
      this.page.currentPage = currentPage;
      this.treeLoad({ ...this.page, currentPage });
    },
    sizeChange(pageSize) {
      this.page.pageSize = pageSize;
      this.treeLoad({ ...this.page, pageSize });
    },
    refreshChange() {
      this.treeLoad(this.page, this.query);
    },
    treeLoad(page, seach) {
      this.loading = true;
      const pageParmas = { ...this.page, ...page };
      const params = {
        current: pageParmas.currentPage,
        size: pageParmas.pageSize,
        category1: this.category1,
        category2: this.category2,
        ...seach,
      };
      aiAbilityListByPage(params).then((res) => {
        if (res.data.success) {
          const data = res.data.data;
          this.data = data.records;
          this.page.total = data.total;
          this.loading = false;
        }
        // this.selectionClear();
      });
    },
    doLayout() {
      this.$refs.crud && this.$refs.crud.doLayout();
    },
    plugAdd() {
      this.$refs.addForm.dialogVisible = true;
      this.$refs.addForm.title = "添加能力";
      this.$refs.addForm.prentResetForm("form");
      // this.$refs.addForm.form = {};
    },
    prePageList() {
      this.treeLoad();
    },
    enable(data) {
      this.rowData = { headerTitle: "ability", ...data };
      this.switchPage = "2";
      this.$nextTick(() => {
        this.$refs.naturalLanguageProcessing.applicationReset(this.rowData);
      });
      this.setCurentRouterPage("ability");
    },
    descriptionToSring(str) {
      let arr = [];
      let newStr = [];
      if (str) {
        arr = str.split(",");
        arr.map((v) => {
          newStr.push(v);
        });
      }
      return newStr;
    },
    experienceResetRouter() {
      // this.rowData = {};
      // this.switchPage = "2";
    },
  },
  // invide(key) {
  //   let flag = false;
  //   aiInterfaceParama.params.dataJson.map((v) => {
  //     if (v[key] && key !=='recordingFileAsrCallbackWithAliyunLocal') {
  //       flag = true;
  //     }
  //     if (key === 'recordingFileAsrWithAliyun') {
  //       flag = true;
  //     }
  //   });
  //   return flag;
  // },
};
</script>

<style scoped lang="scss">
.box .el-scrollbar__wrap {
  //单行注释
  overflow: scroll;
}

/deep/ .avue-view {
  margin: 0;
  padding: 0 !important;
}
/deep/ .el-drawer__header {
  padding-bottom: 0;
  margin-bottom: 0;
}
/deep/ .el-drawer__body > div {
  padding-top: 0 !important;
}
/deep/ .huilan-basic .basic-main {
  padding-top: 10px;
}
</style>
