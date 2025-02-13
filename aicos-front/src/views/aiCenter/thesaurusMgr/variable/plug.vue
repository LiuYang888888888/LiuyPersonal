<template>
  <div>
    <HuilanDialog :title="$t('aiCenter.variable.selectPluginLibrary')" append-to-body :visible.sync="dialogVisiblePlug"
      width="1200px">
      <el-row class="variable" gutter="20">
        <el-col span="8" class="left">
          <div :style="tabclenHei">
            <el-scrollbar>
              <avue-crud :table-loading="loading" :data="data" :option="option" :page="page" :row-style="rowStyle"
                @current-change="currentChange" @on-load="onLoad" @row-click="rowClick" @size-change="sizeChange">
              </avue-crud>
            </el-scrollbar>
          </div>
        </el-col>
        <el-col span="16" class="right" v-if="dialogVisiblePlug">
          <div :style="tabclenHeiRi">
            <el-scrollbar>
              <avue-crud :table-loading="loading" ref="crud" :data="riData" :option="RiOption" :page="riPage"
                :row-style="rowStyle" @on-load="riOnLoad" @search-change="searchChange" @search-reset="searchReset"
                @selection-change="selectionChange" @current-change="riCurrentChange" @size-change="riSizeChange">
                <template v-slot:menuLeft>
                  <el-button type="primary" size="small" @click.stop="plugAdd">{{ $t('aiCenter.variable.addPlugin') }}
                  </el-button>
                </template>
              </avue-crud>
            </el-scrollbar>
          </div>
        </el-col>
        <el-col span="24" class="btn">
          <el-button type="primary" size="mini" @click="plugSave">{{ $t('aicosCommon.confirmBtn') }}</el-button>
          <el-button size="mini" @click="closes">{{ $t('aicosCommon.closeBtn') }}</el-button>
        </el-col>
      </el-row>
    </HuilanDialog>
    <AddPlug ref="addPlug" @chilPlug="parenPlug"></AddPlug>
  </div>
</template>

<script>
import AddPlug from "./addPlug.vue";
import {
  getEntityInstanceList,
  getList
} from "@/api/aiCenter/thesaurusMgr/plug";
const tabclenHei = document.body.clientHeight - 290;
const tabclenHeiRi = document.body.clientHeight - 290;
import { mapGetters } from "vuex";
export default {
  name: "variable",
  components: {
    AddPlug
  },
  props: {
    applicationId: {
      type: String
    }
  },
  watch: {},
  computed: {
    ...mapGetters(["permission"]),
    permissionList () {
      return {
        addBtn: this.vaildData(this.permission["sys-plug-add"], false),
        addBtnCh: this.vaildData(this.permission["sys-plug-addPlug"], false),
        viewBtn: false,
        delBtn: this.vaildData(this.permission["sys-plug-del"], false),
        delBtnCh: this.vaildData(this.permission["sys-plug-delCh"], false),
        delBatchBtn: this.vaildData(
          this.permission["sys-plug-batchDel"],
          false
        ),
        editBtn: this.vaildData(this.permission["sys-plug-edit"], false),
        editBtnCh: this.vaildData(this.permission["sys-plug-editCh"], false)
      };
    }
  },
  data () {
    return {
      tabclenHei: `height:${tabclenHei}px`,
      tabclenHeiRi: `height:${tabclenHeiRi}px`,
      page: {
        size: 10,
        pageSizes: [10, 30, 50, 100, 200],
        current: 1,
        total: 0
      },
      riPage: {
        size: 10,
        pageSizes: [10, 30, 50, 100, 200],
        current: 1,
        total: 0
      },
      dialogVisiblePlug: false,
      pluginGroupId: null,
      data: [],
      riData: [],
      curRow: {},
      plugData: {},
      form: {
        variableName: null,
        dataSources: "custom",
        variableValue: null,
        name: null
      },
      option: {
        // title: "敏感词列表",
        align: "center",
        menuAlign: "center",
        addBtn: false,
        excelBtn: false,
        delBtn: false,
        editBtn: true,
        selection: false,
        searchSpan: 8,
        searchMenuSpan: 8,
        refresh: false,
        rowKey: "id",
        operation: false,
        menu: false,
        columnBtn: false,
        viewBtn: false,
        refreshBtn: false,
        dialogClickModal: false,
        searchShow: false,
        column: [
          {
            label: this.$t('aiCenter.variable.groupName'),
            prop: "pluginGroupName"
          }
        ]
      },
      RiOption: {
        align: "center",
        menuAlign: "center",
        addBtn: false,
        excelBtn: false,
        delBtn: false,
        editBtn: false,
        searchSpan: 8,
        searchMenuSpan: 8,
        refresh: false,
        rowKey: "id",
        operation: false,
        columnBtn: false,
        viewBtn: false,
        refreshBtn: false,
        dialogClickModal: false,
        searchShow: true,
        selection: true,
        menu: false,
        column: [
          {
            label: this.$t('aiCenter.variable.pluginName'),
            prop: "pluginName",
            search: true,
            searchLabelWidth: 100,
          },
          {
            label: this.$t('aiCenter.variable.updateTime'),
            prop: "updateTime",
            search: false
          }
        ]
      }
    };
  },
  mounted () {
    const params = {
      ...this.page,
      applicationId: this.applicationId
    };
    getList(params).then(res => {
      const data = res.data;
      if (data.success) {
        // this.data = data.data;
        this.curRow = data.data.records[0];
        this.pluginGroupId = data.data.records[0].id;
        this.page.total = data.data.total;
      }
    });
  },
  methods: {
    onLoad () {
      const params = {
        ...this.page,
        applicationId: this.applicationId
      };
      getList(params).then(res => {
        const data = res.data;
        if (data.success) {
          this.data = data.data.records;
          this.page.total = data.data.total;
        }
      });
    },
    onloadList (page) {
      const params = {
        ...this.page,
        ...page,
        applicationId: this.applicationId
      };
      getList(params).then(res => {
        const data = res.data;
        if (data.success) {
          this.data = data.data.records;
          this.page.total = data.data.total;
        }
      });
    },
    riOnLoad (seaParams, pluginGroupId, pagePara) {
      if (
        !this.pluginGroupId ||
        seaParams.layout === "total, sizes, prev, pager, next, jumper"
      ) {
        return;
      }
      const params = {
        ...this.page,
        ...pagePara,
        pluginGroupId: pluginGroupId || this.pluginGroupId,
        ...seaParams
      };
      getEntityInstanceList(params).then(res => {
        const data = res.data;
        if (data.success) {
          this.riData = data.data.records;
          this.riPage.total = data.data.total;
        }
      });
    },
    riOnLoadList (seaParams, pluginGroupId, pagePara) {
      if (
        !this.pluginGroupId ||
        seaParams.layout === "total, sizes, prev, pager, next, jumper"
      ) {
        return;
      }
      const params = {
        ...this.page,
        ...pagePara,
        pluginGroupId: pluginGroupId || this.pluginGroupId,
        ...seaParams
      };
      getEntityInstanceList(params).then(res => {
        const data = res.data;
        if (data.success) {
          this.riData = data.data.records;
          this.riPage.total = data.data.total;
        }
      });
    },
    selePlug () {
      this.dialogVisiblePlug = true;
    },
    searchChange (params, done) {
      this.riOnLoadList(params);
      done();
    },
    rowClick (row) {
      this.curRow = row;
      this.pluginGroupId = row.id;
      this.riOnLoadList({}, row.id);
    },
    rowStyle ({ row }) {
      if (row.id === this.curRow.id) {
        return {
          background: "#ecf5ff"
        };
      }
    },
    searchReset () {
      this.riOnLoadList({});
    },
    selectionChange (selection) {
      if (selection.length) {
        if (selection.length > 1) {
          const nowVal = selection.shift();
          this.$refs.crud.toggleRowSelection(nowVal, false);
        } else if (selection.length === 1) {
          // 对单选数据的操作写在这⾥
          this.plugData = selection;
        } else {
          this.$message.warning(this.$t('aiCenter.variable.onlyChooseDataTip'));
        }
      }
    },
    closes () {
      this.dialogVisiblePlug = false;
      this.plugData = {};
    },
    plugSave () {
      this.$emit("chilGetPlug", this.plugData);
      this.dialogVisiblePlug = false;
    },
    plugAdd () {
      this.$refs.addPlug.dialogVisible = true;
      this.$refs.addPlug.baseForm.pluginGroupId = this.pluginGroupId;
      this.$refs.addPlug.baseForm.requestType = "http";
      this.$refs.addPlug.flagCode = "http";
    },
    parenPlug (data) {
      console.log(data);
      this.riOnLoadList({});
    },
    currentChange (currentPage) {
      this.page.current = currentPage;
      this.onloadList({ current: currentPage });
    },
    riCurrentChange (currentPage) {
      this.riPage.current = currentPage;
      this.riOnLoadList({}, null, { current: currentPage });
    },
    sizeChange (pageSize) {
      this.page.size = pageSize;
      this.onloadList({ size: pageSize });
    },
    riSizeChange (pageSize) {
      this.riPage.size = pageSize;
      this.riOnLoadList({}, null, { size: pageSize });
    }
  }
};
</script>

<style lang="scss" scoped>
.left {
  /deep/ .avue-crud__menu {
    display: none;
  }
}

.right {
  /deep/ .avue-crud__right {
    display: none;
  }
}

.variable {
  .btn {
    margin-top: 20px;
    text-align: right;
  }
}
</style>
