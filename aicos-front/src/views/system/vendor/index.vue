<template>
  <HuilanBasic>
    <HuilanBasicToolbar style="margin-top: 0">
      <el-button v-if="permissionList.addBtn" type="primary" size="small" @click="addCloud">{{ $t('aicosCommon.addBtn')
      }}</el-button>
    </HuilanBasicToolbar>
    <HuilanBasicSearchbar :model="searchForm" :fields="searchFieldList" @search="searchChange" @reset="searchReset">
    </HuilanBasicSearchbar>
    <avue-crud :table-loading="loading" :data="data" :option="option" :page="page" v-model="form" ref="crud"
      @refresh-change="refreshChange" @current-change="currentChange" @size-change="sizeChange" @row-del="rowDel"
      @row-update="rowUpdate" @selection-change="selectionChange">
      <!-- <template slot="menuLeft" v-if="permissionList.addBtn">
        <el-button type="primary" size="small" @click="addCloud"
          >新增</el-button
        >
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
          @click.stop="rowUpdate(scope.row)"
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
    <QSGDrawer :title="title" append-to-body size="40%" custom-class="huilan-drawer-form" :before-close="cansell"
      :visible.sync="cloudVisible">
      <el-form ref="form" :model="form" label-width="110px" :label-position="labelPosition" size="mini"
        style="padding: 0 30px">
        <el-form-item :label="$t('system.vendor.name')" prop="name"
          :rules="[{ required: true, message: $t('aicosCommon.pleaseInput') + $t('system.vendor.name') }]">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item :label="$t('system.vendor.type')" prop="type"
          :rules="[{ required: true, message: $t('aicosCommon.pleaseSelect') + $t('system.vendor.type') }]">
          <el-select v-model="form.type" style="width: 100%">
            <el-option v-for="option in typeList" :key="option.code" :label="option.name" :value="option.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('system.vendor.appKey')" prop="appKey"
          :rules="[{ required: true, message: $t('aicosCommon.pleaseInput') + $t('system.vendor.appKey') }]">
          <el-input v-model="form.appKey"></el-input>
        </el-form-item>
        <el-form-item :label="$t('system.vendor.appSecret')" prop="appSecret"
          :rules="[{ required: true, message: $t('aicosCommon.pleaseInput') + $t('system.vendor.appSecret') }]">
          <el-input v-model="form.appSecret"></el-input>
        </el-form-item>
        <div class="plugCrudBox">
          <PlugCrud :personalityDisplay="false" title="" :requstData="requstData" @chilReData="preGetData"></PlugCrud>
        </div>
      </el-form>
      <template slot="footer">
        <!-- <div class="drawerBtn" style="text-align: right; padding: 15px 20px 8px 15px;"> -->
        <el-button type="primary" size="small" icon="el-icon-circle-plus-outline" @click="onSubmit('form')">{{
          $t('aicosCommon.saveBtn') }}
        </el-button>
        <el-button @click="cansell" size="small " icon="el-icon-circle-close">{{ $t('aicosCommon.cancelBtn')
        }}</el-button>
        <!-- </div> -->
      </template>
    </QSGDrawer>
  </HuilanBasic>
</template>

<script>
import PlugCrud from "@/components/plugCrud";
import { mapGetters } from "vuex";
import {
  save,
  listByPage,
  properDelete,
  properUpdate,
} from "@/api/system/vendor";
import { getDictionary } from "@/api/system/dict";
import { getDictItemListByDictCodeURL } from "@/api/common";

import QSGDrawer from "@/components/QSGDrawer/index";

export default {
  name: "vendor",
  components: { PlugCrud, QSGDrawer },
  watch: {},
  computed: {
    ...mapGetters(["permission", "language"]),
    permissionList () {
      return {
        addBtn: this.vaildData(this.permission["sys-shop-add"], false),
        viewBtn: false,
        delBtn: this.vaildData(this.permission["sys-shop-del"], false),
        editBtn: this.vaildData(this.permission["sys-shop-edit"], false),
      };
    },
  },
  data () {
    return {
      title: this.$t('aicosCommon.addBtn'),
      labelPosition: 'right',
      importForm: {},
      cloudVisible: false,
      form: {
        name: null,
        appKey: null,
        appSecret: null,
      },
      importDialogVisible: false,
      selectionList: [],
      requstData: [],
      loading: true,
      curAiAppId: "",
      page: {
        size: 10,
        pageSizes: [10, 30, 50, 100, 200],
        current: 1,
        total: 0,
      },
      query: {},
      data: [],
      searchForm: {
        name: "",
      },
      searchFieldList: [
        {
          prop: "name",
          placeholder: this.$t('aicosCommon.pleaseInput') + this.$t('system.vendor.name'),
        }
      ],
      option: {
        // title: "敏感词列表",
        header: false,
        tip: false,
        align: "left",
        menuAlign: "center",
        addBtn: false,
        addBtnText: this.$t('aicosCommon.addBtn'),
        excelBtn: false,
        excelBtnText: this.$t('system.vendor.exportAll'),
        delBtn: false,
        editBtn: false,
        selection: false,
        searchMenuPosition: "left",
        searchSpan: 8,
        searchMenuSpan: 8,
        rowKey: "id",
        menuWidth: 200,
        refreshBtn: false,
        columnBtn: false,
        searchShowBtn: false,
        // height: 650,
        emptyText: this.$t('aicosCommon.notData'),
        column: [
          {
            label: this.$t('system.vendor.name'),
            prop: "name",
            // search: true,
            type: "input",
            searchLabelWidth: 46,
            searchSpan: 6,
            // order: 1,
          },
          {
            label: this.$t('system.vendor.type'),
            prop: "type",
            type: "select",
            width: 120,
            dicUrl: getDictItemListByDictCodeURL,
            dicMethod: "post",
            dicQuery: {
              code: "cloud-vendor-type",
            },
            props: {
              label: "name",
              value: "code",
            },
          },
          {
            label: this.$t('system.vendor.appKey'),
            prop: "appKey",
            search: false,
            type: "input",
            // order: 2,
            // editDisplay: false,
            // addDisplay: false,
          },
          {
            label: this.$t('system.vendor.appSecret'),
            prop: "appSecret",
            search: false,
            type: "input",
            // order: 3,
            // editDisplay: false,
            // addDisplay: false,
          },
        ],
      },
      typeList: [],
    };
  },
  mounted () {
    this.pageList();
    this.getTypeList();
  },
  methods: {
    getRowActions () {
      const map = {
        delBtn: {
          name: this.$t('aicosCommon.delBtn'),
          command: "rowDel",
        },
        editBtn: {
          name: this.$t('aicosCommon.editBtn'),
          command: "rowUpdate",
        }
      };
      const list = ["editBtn", "delBtn"];
      const actions = [];

      list.forEach((item) => {
        if (this.permissionList[item]) {
          actions.push(map[item]);
        }
      });
      return actions;
    },
    handleCommand (command, row, index) {
      const crud = this.$refs.crud;
      const cruddActions = ["rowView", "rowEdit", "rowDel"];
      if (cruddActions.includes(command)) {
        crud[command](row, index);
      } else {
        this[command](row, index);
      }
    },
    onLoad () {
      const params = { ...this.page };
      listByPage(params).then((res) => {
        const data = res.data;
        if (data.success) {
          this.data = data.data.records;
          this.page.total = data.data.total;
          this.loading = false;
        } else {
          this.$message.error(data.msg);
        }
      });
    },
    pageList (params) {
      const parameter = {
        ...this.page,
        ...params,
      };
      listByPage(parameter).then((res) => {
        const data = res.data;
        if (data.success) {
          this.data = data.data.records;
          this.page.total = data.data.total;
          this.loading = false;
        } else {
          this.$message.error(data.msg);
        }
      });
    },
    searchChange () {
      this.query = {
        ...this.searchForm,
      };
      this.page.currentPage = 1;
      this.pageList(this.query);
    },
    searchReset () {
      this.pageList({ current: 1, size: 10 });
    },
    refreshChange () {
      this.pageList(this.query);
    },
    currentChange (currentPage) {
      this.page.current = currentPage;
      this.pageList({ current: currentPage, ...this.query });
    },
    sizeChange (pageSize) {
      this.page.size = pageSize;
      this.pageList({ size: pageSize, ...this.query });
    },
    rowDel (row, index, done) {
      this.$confirm(this.$t("aicosCommon.successOperate"), {
        confirmButtonText: this.$t("aicosCommon.confirmBtn"),
        cancelButtonText: this.$t("aicosCommon.cancelBtn"),
        type: "warning"
      }).then(() => {
        properDelete({ id: row.id }).then(() => {
          this.pageList();
          this.$message({
            type: "success",
            message: this.$t("aicosCommon.successOperate"),
          });
          done();
        });
      });
    },
    rowUpdate (row) {
      this.form = row;
      this.title = this.$t('aicosCommon.editBtn');
      this.labelPosition = this.language === 'en' ? 'top' : 'right'
      if (row.appParam) {
        this.requstData = JSON.parse(row.appParam);
      }
      this.cloudVisible = true;
    },
    addCloud () {
      this.cloudVisible = true;
      this.title = this.$t('aicosCommon.addBtn');
      this.labelPosition = this.language === 'en' ? 'top' : 'right'
      this.form = {
        name: null,
        appKey: null,
        appSecret: null,
      };
      this.requstData = [];
      if (this.$refs.form !== undefined) {
        this.$refs["form"].resetFields();
      }
    },
    onSubmit (formName) {
      const scope = this;
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let appParam = JSON.stringify(scope.requstData);
          let params = {
            ...scope.form,
            appParam,
          };
          if (scope.title === this.$t('aicosCommon.addBtn')) {
            save({ ...params }).then(
              (res) => {
                if (res.data.success) {
                  scope.$message({
                    type: "success",
                    message: this.$t("aicosCommon.successOperate"),
                  });
                  scope.cloudVisible = false;
                  scope.pageList();
                } else {
                  scope.$message({
                    type: "error",
                    message: res.data.msg,
                  });
                  scope.cloudVisible = false;
                  scope.pageList();
                }
              },
              (error) => {
                window.console.log(error);
              }
            );
          } else {
            properUpdate(params).then(
              () => {
                scope.$message({
                  type: "success",
                  message: this.$t("aicosCommon.successOperate"),
                });
                scope.pageList();
                scope.cloudVisible = false;
              },
              (error) => {
                window.console.log(error);
              }
            );
          }
        }
      });
    },
    preGetData (data) {
      this.requstData = data.requstData;
    },
    cansell () {
      this.cloudVisible = false;
      this.form = {
        name: null,
        appKey: null,
        appSecret: null,
      };
      // this.$refs["form"].resetFields();
      this.requstData = [];
    },
    async getTypeList () {
      const query = {
        code: "cloud-vendor-type",
      };
      const {
        data: { data },
      } = await getDictionary(query);
      this.typeList = data;
    },
  },
};
</script>

<style scoped lang="scss">
.plugCrudBox {
  /deep/ h2 {
    display: none;
  }
}
</style>
