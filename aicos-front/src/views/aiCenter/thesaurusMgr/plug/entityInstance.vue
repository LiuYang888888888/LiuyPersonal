<template>
  <div class="entityInstance">
    <HuilanBasicToolbar style="margin-top: 0">
      <el-button v-if="permissionList.addBtn" type="primary" size="small" @click="addPlug">{{ $t("aicosCommon.addBtn")
      }}</el-button>
      <el-button type="danger" size="small" v-if="permissionList.delBatchBtn" @click.stop="batchDel">{{
        $t("aicosCommon.batchDeleteBtn") }}
      </el-button>
    </HuilanBasicToolbar>
    <HuilanBasicSearchbar :model="searchForm" :fields="searchFieldList" @search="searchChange" @reset="searchReset">
      <template v-slot:appendTool>
        <el-button type="default" @click="configColumn"><i class="el-icon-s-operation"></i></el-button>
      </template>
    </HuilanBasicSearchbar>
    <avue-crud :option="option" :search.sync="query" :table-loading="loading" :data="data" ref="crud" v-model="form"
      :permission="permissionList" @row-save="rowSave" :page.sync="page" :before-open="beforeOpen"
      @selection-change="selectionChange" @current-change="currentChange" @size-change="sizeChange"
      @refresh-change="refreshChange" @on-load="onLoad">
      <!-- <template v-slot:menuLeft>
        <el-button
          type="primary"
          size="small"
          @click.stop="addPlug"
          v-if="permissionList.addBtn"
          >新增插件
        </el-button>
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="small"
          v-if="permissionList.delBatchBtn"
          @click.stop="batchDel"
          >批量删除
        </el-button>
      </template> -->
      <template v-slot:menu="scope">
        <HuilanBasicActionTool :actions="getRowActions(scope.row)"
          @command="handleCommand($event, scope.row, scope.index)" />
      </template>
      <!-- <template slot-scope="scope" slot="menu">
        <el-button
          v-if="permissionList.editBtn"
          type="text"
          icon="el-icon-edit-outline"
          size="small"
          @click.stop="editPlug(scope.row)"
          >编辑</el-button
        >
        <el-button
          v-if="permissionList.delBtn"
          type="text"
          icon="el-icon-delete"
          size="small"
          @click.stop="rowDel(scope.row)"
          >删除</el-button
        >
      </template> -->
    </avue-crud>
    <el-drawer
      :title="`${flagDiog === 'add' ? $t('aicosCommon.addBtn') + $t('aiCenter.plug.plugin') : $t('aicosCommon.editBtn') + $t('aiCenter.plug.plugin')}`"
      append-to-body :visible.sync="dialogVisible" custom-class="huilan-drawer-form" size="800px">
      <el-form style="padding: 30px" ref="form" :label-position="labelPosition" :model="baseForm" label-width="80px"
        :rules="rules" size="mini">
        <el-form-item :label="$t('aiCenter.plug.pluginName')" prop="pluginName">
          <el-input size="small" v-model="baseForm.pluginName"
            :placeholder="$t('aicosCommon.pleaseInput') + $t('aiCenter.plug.pluginName')" maxlength="50"
            show-word-limit></el-input>
        </el-form-item>
        <el-form-item :label="$t('aiCenter.plug.callMethod')" prop="requestType">
          <el-select size="small" v-model="baseForm.requestType"
            :placeholder="$t('aicosCommon.pleaseInput') + $t('aiCenter.plug.callMethod')" default-first-option="true"
            style="width: 100%" @change="requestTypeChange">
            <el-option :label="item.name" :value="item.code" v-for="item of requestTypeArr" :key="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="flagCode === 'http'" :label="$t('aiCenter.plug.requestMethod')" prop="requestMethod">
          <el-select size="small" v-model="baseForm.requestMethod"
            :placeholder="$t('aicosCommon.pleaseSelect') + $t('aiCenter.plug.requestMethod')"
            default-first-option="true" style="width: 100%">
            <el-option :label="item.name" :value="item.code" v-for="item of requestMethodArr" :key="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="flagCode === 'http'" :label="$t('aiCenter.plug.interfaceAddress')" prop="pluginUrl">
          <el-input size="small" v-model="baseForm.pluginUrl"
            :placeholder="$t('aicosCommon.pleaseInput') + $t('aiCenter.plug.interfaceAddress')"></el-input>
        </el-form-item>
        <el-form-item :label="$t('aiCenter.plug.className')" v-if="flagCode === 'class'" prop="" class="">
          <el-input size="small" v-model="baseForm.pluginClass"
            :placeholder="$t('aicosCommon.pleaseInput') + $t('aiCenter.plug.className')"></el-input>
        </el-form-item>
        <el-form-item :label="$t('aiCenter.plug.script')" v-if="flagCode === 'script'" prop="" class="">
          <el-input size="small" type="textarea" :autosize="{ minRows: 4, maxRows: 6 }" v-model="baseForm.script"
            :placeholder="$t('aicosCommon.pleaseInput') + $t('aiCenter.plug.script')"></el-input>
        </el-form-item>
        <PlugCrud v-if="flagCode === 'http'" :personalityDisplay="false" @chilReData="preGetData"
          :requstData="optionRequstData"></PlugCrud>
        <el-form-item v-if="flagCode === 'http'" :label="$t('aiCenter.plug.returnParameter')" prop=""
          class="returnParItem">
          <el-input size="small" v-model="baseForm.returnParams"
            :placeholder="$t('aicosCommon.pleaseInput') + $t('aiCenter.plug.returnParameter')"></el-input>
        </el-form-item>
        <el-form-item class="menuR">
          <el-button type="primary" @click="onSubmit">{{ $t('aicosCommon.confirmBtn') }}</el-button>
          <el-button @click="cancel">{{ $t('aicosCommon.cancelBtn') }}</el-button>
        </el-form-item>
      </el-form>
    </el-drawer>
  </div>
</template>

<script>
import {
  getEntityInstanceList,
  addEntityInstance,
  removeEntityInstance,
  updateEntityInstance,
  removeEntityInstanceBatch,
  requestTypeList
} from "@/api/aiCenter/thesaurusMgr/plug";
import { mapGetters } from "vuex";
import PlugCrud from "@/components/plugCrud";

export default {
  name: "entityInstance",
  components: {
    PlugCrud
  },
  props: {
    entityId: String
  },
  data () {
    return {
      labelPosition: 'right',
      searchForm: {
        pluginName: ""
      },
      searchFieldList: [
        {
          prop: "pluginName",
          placeholder: this.$t('aicosCommon.pleaseInput') + this.$t('aiCenter.plug.pluginName')
        }
      ],
      //
      personalityData: [],
      form: {
        // type: 'system'
      },
      flagDiog: "add",
      baseForm: {
        pluginName: null,
        requestType: null,
        requestMethod: null,
        pluginUrl: null,
        script: undefined,
        pluginParams: undefined,
        pluginClass: undefined,
        returnParams: "",
        requestContenttype: undefined
      },
      query: {},
      loading: false,
      flagCode: "http",
      data: [],
      selectionList: [],
      dialogVisible: false,
      page: {
        pageSize: 10,
        currentPage: 1,
        total: 0
      },
      option: {
        tip: false,
        header: false,
        searchShow: true,
        border: true,
        index: true,
        selection: true,
        viewBtn: true,
        refreshBtn: false,
        columnBtn: false,
        addBtn: false,
        editBtn: false,
        delBtn: false,
        menuWidth: 160,
        searchMenuSpan: 6,
        dialogClickModal: false,
        dialogWidth: "30%",
        emptyText :this.$t('aicosCommon.notData'),
        column: [
          {
            label: this.$t('aiCenter.plug.pluginName'),
            prop: "pluginName",
            type: "input",
            // search: true,
            searchSpan: 9,
            span: 24,
            overHidden: true,
            placeholder: this.$t('aicosCommon.pleaseInput') + this.$t('aiCenter.plug.pluginName')
          },
          {
            label: this.$t('aiCenter.plug.pluginType'),
            prop: "requestType",
            width: 120,
            align: "center"
          },
          {
            label: this.$t('aiCenter.plug.updateTime'),
            prop: "updateTime",
            search: false,
            display: false,
            span: 24,
            type: "date",
            format: "yyyy-MM-dd HH:MM:ss",
            width: 180,
            align: "center"
          }
        ]
      },
      optionRequstForm: {},
      optionRequstData: [],
      requestTypeArr: [],
      requestMethodArr: [],
      rules: {
        pluginName: [
          { required: true, message: this.$t('aicosCommon.pleaseInput') + this.$t('aiCenter.plug.pluginName'), trigger: "blur" }
        ],
        requestType: [
          { required: true, message: this.$t('aicosCommon.pleaseInput') + this.$t('aiCenter.plug.callMethod'), trigger: "blur" }
        ],
        requestMethod: [
          { required: true, message: this.$t('aicosCommon.pleaseSelect') + this.$t('aiCenter.plug.requestMethod'), trigger: "blur" }
        ],
        pluginUrl: [
          { required: true, message: this.$t('aicosCommon.pleaseInput') + this.$t('aiCenter.plug.interfaceAddress'), trigger: "blur" }
        ]
      }
    };
  },
  computed: {
    ...mapGetters(["permission", 'language']),
    permissionList () {
      return {
        addBtn: this.vaildData(
          this.permission["sys-plug-basePlugin-save"],
          false
        ),
        viewBtn: false,
        delBtn: this.vaildData(
          this.permission["sys-plug-basePlugin-delete"],
          false
        ),
        delBatchBtn: this.vaildData(
          this.permission["sys-plug-basePlugin-deleteBatch"],
          false
        ),
        editBtn: this.vaildData(
          this.permission["sys-plug-basePlugin-update"],
          false
        )
      };
    }
  },
  watch: {
    entityId () {
      this.searchReset();
    }
  },
  mounted () {
    const scope = this;
    requestTypeList({ code: "system-plug-requestMethod" }).then(res => {
      // console.log(res);
      const data = res.data;
      if (data.success) {
        this.requestMethodArr = data.data;
        setTimeout(() => {
          scope.baseForm.requestMethod = data.data[0].code;
        }, 500);
      }
    });
    requestTypeList({ code: "system-plug-requestType" }).then(res => {
      // console.log(res);
      const data = res.data;
      if (data.success) {
        this.requestTypeArr = data.data;
        scope.baseForm.requestType = data.data[0].code;
      }
    });
  },
  methods: {
    rowSave (row, done, loading) {
      addEntityInstance(row).then(
        () => {
          // 获取新增数据的相关字段
          // const data = res.data.data;
          // row.id = data.id;
          this.$message({
            type: "success",
            message: this.$t("aicosCommon.successOperate")
          });
          // 数据回调进行刷新
          this.onLoad(this.page);
          done();
        },
        error => {
          window.console.log(error);
          loading();
        }
      );
    },
    rowDel (row) {
      this.$confirm(this.$t("aicosCommon.mutiDeleteConfirmTip"), {
        confirmButtonText: this.$t("aicosCommon.confirmBtn"),
        cancelButtonText: this.$t("aicosCommon.cancelBtn"),
        type: "warning"
      })
        .then(() => {
          return removeEntityInstance(row.id);
        })
        .then(() => {
          this.$message({
            type: "success",
            message: this.$t("aicosCommon.successOperate")
          });
          // 数据回调进行刷新
          this.onLoad(this.page);
        });
    },
    batchDel () {
      if (this.selectionList.length === 0) {
        this.$message.warning(this.$t("aicosCommon.chooseDataTip"));
        return;
      }
      this.$confirm(this.$t("aicosCommon.mutiDeleteConfirmTip"), {
        confirmButtonText: this.$t("aicosCommon.confirmBtn"),
        cancelButtonText: this.$t("aicosCommon.cancelBtn"),
        type: "warning"
      })
        .then(() => {
          const ids = this.selectionList.map(item => item.id);
          return removeEntityInstanceBatch(ids.join());
        })
        .then(() => {
          this.onLoad(this.page);
          this.$message({
            type: "success",
            message: this.$t("aicosCommon.successOperate")
          });
          this.$refs.crud.toggleSelection();
        });
    },
    getRowActions () {
      const map = {
        delBtn: {
          name: this.$t("aicosCommon.delBtn"),
          command: "rowDel"
        },
        editBtn: {
          name: this.$t("aicosCommon.editBtn"),
          command: "rowEdit"
        }
      };
      const list = ["editBtn", "delBtn"];
      const actions = [];

      list.forEach(item => {
        if (this.permissionList[item]) {
          actions.push(map[item]);
        }
      });
      return actions;
    },
    handleCommand (command, row) {
      if (command === "rowEdit") {
        this.editPlug(row);
      }
      if (command === "rowDel") {
        this.rowDel(row);
      }
    },
    searchReset () {
      this.query = {};
      // this.parentId = 0;
      this.onLoad(this.page);
    },
    configColumn () {
      this.$refs.crud.$refs.dialogColumn.columnBox = true;
    },
    searchChange () {
      this.query = {
        ...this.searchForm
      };
      this.page.currentPage = 1;
      this.onLoad(this.page);
    },
    currentChange (currentPage) {
      this.page.currentPage = currentPage;
    },
    sizeChange (pageSize) {
      this.page.pageSize = pageSize;
    },
    refreshChange () {
      this.onLoad(this.page, this.query);
    },
    selectionChange (list) {
      this.selectionList = list;
    },
    selectionClear () {
      this.selectionList = [];
      this.$refs.crud.toggleSelection();
    },
    beforeOpen (done) {

      done();
    },
    onLoad (page, params = {}) {
      const self = this;
      if (self.entityId === "") {
        return;
      }
      const pageConf = {
        pluginGroupId: self.entityId,
        current: page.currentPage,
        size: page.pageSize
      };
      self.loading = true;
      getEntityInstanceList(Object.assign(params, self.query, pageConf)).then(
        res => {
          const data = res.data.data;
          self.loading = false;
          self.data = data.records;
          self.page.total = data.total;
          self.selectionClear();
        }
      );
    },
    requestTypeChange (data) {
      this.flagCode = data;
      if (data !== "http") {
        this.baseForm.pluginUrl = undefined;
        this.baseForm.requestMethod = undefined;
        this.baseForm.returnParams = undefined;
        this.optionRequstData = [];
      }
    },
    editPlug (row) {
      this.dialogVisible = true;
      this.baseForm = row;
      this.flagDiog = "edit";
      this.baseForm.pluginGroupId = this.entityId;
      this.flagCode = row.requestType;
      this.labelPosition = this.language == "en" ? "top" : "right";
      if (row.pluginParams) {
        this.optionRequstData = JSON.parse(row.pluginParams);
      }
    },
    onSubmit () {
      const scope = this;
      scope.$refs["form"].validate(valid => {
        if (valid) {
          if (!scope.baseForm.pluginGroupId) {
            return;
          }
          let swichParams = {};
          if (scope.baseForm.requestType === "http") {
            swichParams = {
              pluginParams: JSON.stringify(scope.optionRequstData)
            };
          }
          const params = { ...scope.baseForm, ...swichParams };
          if (scope.flagDiog === "add") {
            addEntityInstance(params).then(res => {
              const data = res.data;
              if (data.success) {
                scope.$message.success(this.$t('aicosCommon.saveSuccessTip'));
                scope.closes();
                scope.onLoad(scope.page);
                this.dialogVisible = false;
              }
            });
          } else {
            updateEntityInstance(params).then(
              () => {
                scope.$message({
                  type: "success",
                  message: this.$t("aicosCommon.successOperate")
                });
                // 数据回调进行刷新
                scope.onLoad(scope.page);
                scope.closes();
                this.dialogVisible = false;
              },
              error => {
                window.console.log(error);
              }
            );
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    closes () {
      this.baseForm = {};
      this.optionRequstData = [];
      this.optionRebonseData = [];
    },
    cancel () {
      this.closes();
      this.dialogVisible = false;
    },
    addPlug () {
      this.dialogVisible = true;
      this.closes();
      this.baseForm.requestType = "http";
      this.flagCode = "http";
      this.flagDiog = "add";
      this.labelPosition = this.language == "en" ? "top" : "right";
      this.baseForm.pluginGroupId = this.entityId;
    },
    preGetData (data) {
      this.optionRequstData = data.requstData;
    }
  }
};
</script>

<style scoped lang="scss">
.entityInstance {
  /deep/ .avue-crud__menu {
    min-height: 0;
  }

  .menuR {
    /deep/ .el-form-item__content {
      text-align: right;
      margin-top: 40px;
    }
  }
}

.menuR {
  text-align: right;
  margin-top: 40px;
}

.returnParItem {
  margin-top: 20px;
}
</style>
