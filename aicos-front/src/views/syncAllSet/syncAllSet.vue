<template>
  <HuilanBasic class="newCss">
    <div class="menuTitle">{{ $t('system.syncAllSet.dataSync') }}</div>
    <HuilanBasicSearchbar :model="searchForm" :fields="searchFieldList" @search="searchChange" @reset="searchReset">
      <template v-slot:appendTool>
        <el-button type="default" @click="configColumn"><i class="el-icon-s-operation"></i></el-button>
      </template>
    </HuilanBasicSearchbar>
    <avue-crud :option="syncListOption" :table-loading="loading" :data="syncListData" ref="syncListRef"
      v-model="syncListForm" :page.sync="page" :permission="permissionList" :before-open="beforeOpen"
      :before-close="beforeClose" @row-del="rowDel" @row-update="rowUpdate" @row-save="rowSave"
      @selection-change="selectionChange" @current-change="currentChange" @size-change="sizeChange"
      @refresh-change="refreshChange" @on-load="onLoad">



      <template v-slot:menu="scope">
        <HuilanBasicActionTool :actions="getRowActions(scope.row)" :limt="language == 'en' ? 2 : 5"
          @command="handleCommand($event, scope.row, scope.index)" />
      </template>
      <!-- <template slot-scope="scope" slot="menu">
        <el-button
          type="text"
          v-if="permissionList.syncTenantBtn"
          icon="el-icon-video-play"
          size="small"
          @click.stop="syncALLData(scope.row, scope.index, 'syncFullTenant')"
          >全量同步租户
        </el-button>
        <el-button
          type="text"
          v-if="permissionList.syncDeptBtn"
          icon="el-icon-video-play"
          size="small"
          @click.stop="syncALLData(scope.row, scope.index, 'syncFullDept')"
          >全量同步部门
        </el-button>
        <el-button
          type="text"
          v-if="permissionList.syncUserBtn"
          icon="el-icon-video-play"
          size="small"
          @click.stop="syncALLData(scope.row, scope.index, 'syncFullUser')"
          >全量同步用户
        </el-button>

        <el-button
          type="text"
          v-if="permissionList.syncSetBtn"
          icon="el-icon-setting"
          size="small"
          @click.stop="syncSet(scope.row, scope.index)"
          >同步设置
        </el-button>
      </template> -->
    </avue-crud>

    <HuilanDialog :title="syncSetTitle" append-to-body :visible.sync="syncSetTag" :fullscreen="false"
      :before-close="syncSetClose" width="660px">
      <avue-form ref="syncFormRef" v-model="syncFormObj" :option="syncFormOption">
      </avue-form>
      <template v-slot:footer>
        <el-button icon="el-icon-check" size="small" type="primary" @click="syncSetSave">{{
          $t('system.syncAllSet.confirmBtn') }}</el-button>
        <el-button icon="el-icon-close" size="small" @click="syncSetClose">{{ $t('system.syncAllSet.cancelBtn')
        }}</el-button>
      </template>
    </HuilanDialog>
  </HuilanBasic>
</template>

<script>
import { mapGetters } from "vuex";
import {
  syncListPage,
  getSyncSet,
  syncSetUpdate,
  getSyncDic,
  syncFullFun,
} from "@/api/syncAllSet/syncAllSet";
import { getTextWidth } from "@/util/util"

export default {
  name: 'dataSync',
  components: {},
  data () {
    //const scop = this;
    return {
      syncDicData: {},
      page: {
        pageSize: 10,
        currentPage: 1,
        total: 0,
        pageSizes: [10, 20, 30, 40, 50, 100],
      },
      activeType: {
        type: 0,
        origin: 0,
        status: 1,
        enabled: 1,
      },

      query: {},
      loading: true,
      syncListData: [],
      syncListOption: {
        header: false,
        span: 24,
        menuWidth: 380,
        addBtn: false,
        viewBtn: false,
        editBtn: false,
        delBtn: false,
        searchShow: true,
        index: true,
        border: true,
        // searchIndex: 1,
        searchIcon: true,
        searchSpan: 4,
        searchMenuSpan: 3,
        searchMenuPosition: "right",
        emptyText: this.$t('aicosCommon.notData'),
        column: [
          {
            label: this.$t("system.syncAllSet.systemName"),
            prop: "name",
            // search: true,
            maxlength: 50,
            showWordLimit: true,
          },
          {
            label: this.$t("system.syncAllSet.systemCode"),
            prop: "systemCode",
            // search: true,
            // hide: true,
            // disabled: true,
            // display:false,
          },
          {
            label: this.$t("system.syncAllSet.systemIcon"),
            prop: "appstoreIcon",
            //hide: true,
            type: "icon",
            align: "center",
          },
          {
            label: this.$t("system.syncAllSet.authorize"),
            prop: "isAuth",
            span: 24,
            type: "radio",
            dicData: [
              { label: this.$t("aicosCommon.no"), value: 0 },
              { label: this.$t("aicosCommon.yes"), value: 1 },
            ],
            value: 0,
            align: "center",
          },
          {
            label: this.$t("system.syncAllSet.updateTime"),
            prop: "updateTime",
            span: 24,
            //hide: true,
            //disabled: true,
            overHidden: true,
            display: false,
            align: "center",
          },
        ],
      },
      searchForm: {
        name: "",
        systemCode: "",
      },
      searchFieldList: [
        {
          prop: "name",
          placeholder: this.$t("system.syncAllSet.pleaseInput") + this.$t("system.syncAllSet.systemName"),
        },
        {
          prop: "systemCode",
          placeholder: this.$t("system.syncAllSet.pleaseInput") + this.$t("system.syncAllSet.systemCode"),
        },
      ],

      syncSetTag: false,
      syncSetTitle: this.$t("system.syncAllSet.syncSettings"),
      syncFormObj: {
        systemCode: "",
        operateCode: [],
      },
      syncFormOption: {
        submitBtn: false,
        emptyBtn: false,
        span: 24,
        column: [
          {
            label: this.$t("system.syncAllSet.systemCode"),
            prop: "systemCode",
            display: false,
          },
          {
            label: this.$t("system.syncAllSet.systemName"),
            prop: "name",
            display: false,
          },
          {
            label: this.$t("system.syncAllSet.syncSettings"),
            type: "checkbox",
            prop: "operateCode",
            labelWidth: 120,
            dicData: "",
            /*dicUrl: getDictItemListByDictCodeURL,
            dicMethod: 'post',
            dicQuery: {
              code: 'syncSet'
            },*/
            props: {
              label: "name",
              value: "value",
            },
            value: "",
            all: true,
          },
        ],
      },
    };
  },
  computed: {
    ...mapGetters(["permission", 'language']),
    permissionList () {
      return {
        syncTenantBtn: this.vaildData(
          this.permission[`sys-sync-tenant`],
          false
        ),
        syncDeptBtn: this.vaildData(this.permission[`sys-sync-dept`], false),
        syncUserBtn: this.vaildData(this.permission[`sys-sync-user`], false),
        syncSetBtn: this.vaildData(this.permission[`sys-sync-set`], false),
      };
    },
  },
  methods: {
    // 列显隐
    configColumn () {
      this.$refs.syncListRef.$refs.dialogColumn.columnBox = true;
    },
    getRowActions () {
      const map = {
        syncTenantBtn: {
          name: this.$t("system.syncAllSet.fullTenant"),
          command: 'syncFullTenant'
        },
        syncDeptBtn: {
          name: this.$t("system.syncAllSet.fullDept"),
          command: "syncFullDept",
        },
        syncUserBtn: {
          name: this.$t("system.syncAllSet.fullUser"),
          command: "syncFullUser",
        },
        syncSetBtn: {
          name: this.$t("system.syncAllSet.syncSettings"),
          command: "syncSet",
        },

      };
      const list = ['syncTenantBtn', "syncDeptBtn", "syncUserBtn", "syncSetBtn"];
      const actions = [];

      list.forEach((item) => {
        if (this.permissionList[item]) {
          actions.push(map[item]);
        }
      });
      return actions;
    },
    handleCommand (command, row, index) {
      const crud = this.$refs.syncListRef;
      const cruddActions = ["rowView", "rowEdit", "rowDel"];
      // console.log(command);
      if (cruddActions.includes(command)) {
        crud[command](row, index);
      } else {
        this[command](row, index);
      }
    },
    searchReset () {
      this.query = {};
      this.onLoad(this.page);
    },
    searchChange () {
      this.query = {
        ...this.searchForm,
      };
      this.page.currentPage = 1;
      this.onLoad(this.page);
    },

    selectionChange (list) {
      this.selectionList = list;
    },

    selectionClear () {
      this.selectionList = [];
      this.$refs.syncListRef.toggleSelection();
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

    onLoad (page, params = {}) {
      this.loading = true;
      const dataListParam = {
        ...this.activeType,
        ...params,
        ...this.query,
        current: page.currentPage,
        size: page.pageSize,
      };

      syncListPage(dataListParam).then((res) => {
        const dataRes = res.data.data;
        this.page.total = dataRes.total;
        this.page.pageSize = dataRes.size;
        this.page.currentPage = dataRes.current;
        this.syncListData = dataRes.records;
        if (this.language != 'zh') {
          this.syncListOption.column.forEach(item => {
            let width = getTextWidth(item.label).nodeWidth + 100;
            this.$set(item, "width", width)
          })
        }
        this.loading = false;
        this.selectionClear();
      });
    },
    syncFullTenant (row, index) {
      this.syncALLData(row, index, 'syncFullTenant')
    },
    syncFullDept (row, index) {
      this.syncALLData(row, index, 'syncFullDept')
    },
    syncFullUser (row, index) {
      this.syncALLData(row, index, 'syncFullUser')
    },
    syncALLData (row, index, type) {
      const dataAllParam = {
        systemCode: row.systemCode,
        type: type,
      };

      this.$confirm(this.$t('system.syncAllSet.syncTip'), {
        confirmButtonText: this.$t('system.syncAllSet.confirmBtn'),
        cancelButtonText: this.$t('system.syncAllSet.cancelBtn'),
        type: "warning",
      })
        .then(() => {
          return syncFullFun(dataAllParam);
        })
        .then(() => {
          this.$message({
            type: "success",
            message: this.$t('system.syncAllSet.successMessage'),
          });
        });
    },
    syncSet (row) {
      const dataSetParam = {
        systemCode: row.systemCode,
      };
      getSyncSet(dataSetParam).then((res) => {
        this.syncSetTag = true;
        this.syncSetTitle = "【 " + row.name + ` 】  ${this.$t('system.syncAllSet.syncSettings')}`;

        const dataRes = res.data.data;
        const operateCodeData = dataRes.map((item) => {
          return item.operateCode;
        });

        this.syncFormObj.systemCode = row.systemCode;
        this.syncFormObj.name = row.name;
        this.syncFormObj.operateCode = operateCodeData;
      });
    },
    syncSetClose () {
      this.syncSetTag = false;
    },
    syncSetSave () {
      const dataPerateCode = this.syncFormObj.operateCode.map((val) => {
        return {
          system: this.syncFormObj.name,
          systemCode: this.syncFormObj.systemCode,
          operateCode: val,
          operate: this.syncDicData
            .filter((ele) => ele.value == val)
            .map((ele) => {
              return ele.name;
            })
            .join(),
        };
      });

      syncSetUpdate(this.syncFormObj.systemCode, dataPerateCode).then(() => {
        this.$message({
          type: "success",
          message: this.$t('system.syncAllSet.successMessage'),
        });
        this.syncSetClose();
      });
    },
    getDisData () {
      getSyncDic({ code: "syncSet" }).then((res) => {
        //console.log("获取数据字典");
        const disRes = res.data.data;
        this.syncDicData = disRes;
        this.findObject(this.syncFormOption.column, "operateCode").dicData =
          disRes;
      });
    },
  },
  mounted () {
    this.getDisData();
  },
};
</script>

<style lang="scss" scoped>
.newCss {
  position: relative;

  .menuTitle {
    position: absolute;
    top: 30px;
    left: 40px;
    font-size: 22px;
    font-weight: 500;
    z-index: 99;
  }

  /deep/.avue-crud__search .avue-form__group {
    justify-content: flex-end;
  }

  /deep/.avue-crud__search .avue-form__menu {
    width: 240px;
  }

  /deep/.el-card__body .avue-crud__menu {
    justify-content: flex-end;
  }
}
</style>
