<template>
  <div>
    <avue-crud :option="recordOption" :table-loading="recordLoading" :data="recordData" ref="auditRecordCrud"
      v-model="recordForm" :page.sync="page" @search-change="searchChange" @search-reset="searchReset"
      @selection-change="selectionChange" @current-change="currentChange" @size-change="sizeChange"
      @refresh-change="refreshChange" @on-load="recordOnLoad">
      <template slot="menu" slot-scope="{ type, size, row }">
        <el-button :type="type" :size="size" @click.stop="viewFaqVersion(row)">{{ $t('aicosCommon.viewBtn') }}</el-button>
        <!-- <el-button
          v-if="row.rollbackFlag === 1"
          :type="type"
          :size="size"
          @click.stop="callbackVersion(row)"
          >回退到该版本</el-button
        > -->
      </template>
    </avue-crud>
    <!--查看-->
    <el-drawer :title="$t('aicosCommon.viewBtn')" :visible.sync="faqRecordVersionIsShow" :custom-class="addDrawerClass"
      append-to-body size="85%">
      <Addanswer v-if="faqRecordVersionIsShow" ref="addanswer" :rowData="rowData" :title="$t('aicosCommon.viewBtn')"
        :selectData="curRecord" />
    </el-drawer>
  </div>
</template>

<script>
import Addanswer from "./addanswer";
import {
  versionListUrl
} from "@/api/kwKnowledgeCenter/kwKnowledgeMangement/kwTabManagement/answersetting";
export default {
  props: {
    rowData: {
      type: Object,
      default: () => {
        return {};
      },
    },
    curVesionRecordRow: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  components: {
    Addanswer,
  },
  data () {
    return {
      curSelectedTreeNode: {
        data: {
          id: "0",
          dname: this.$t('table.generalClass'),
        },
      },
      curRecordVersionData: {}, // 当前版本下的数据
      query: {},
      recordLoading: false,
      selectionList: [],
      parentId: "0",
      faqRecordVersionIsShow: false,
      sourceType: "auditList",
      page: {
        pageSize: 10,
        currentPage: 1,
        total: 0,
      },
      recordOption: {
        refreshBtn: false,
        tip: false,
        border: true,
        header: false,
        index: false,
        menu: true,
        selection: false,
        labelWidth: 120,
        editBtn: false,
        viewBtn: false,
        delBtn: false,
        emptyText: this.$t("aicosCommon.notData"),
        column: [
          {
            label: this.$t('table.version'),
            prop: "version",
          },
          {
            label: this.$t('table.createTime'),
            prop: "createTime",
          },
        ],
      },
      recordData: [],
      recordForm: {},
      curRecord: {}
    };
  },
  methods: {
    viewFaqVersion (row) {
      this.curRecord = row;
      this.faqRecordVersionIsShow = true;
    },
    // 回退到该版本
    // callbackVersion(row) {
    //   callbackVersionUrl(row.questionid, row.version).then((resData) => {
    //     resData = resData.data;
    //     if (resData.code == 200) {
    //       this.$message({
    //         type: "success",
    //         message: "回退成功！",
    //       });
    //     }
    //   });
    // },
    searchReset () {
      this.query = {};
      this.recordOnLoad(this.page);
    },
    // 搜索
    searchChange (params, done) {
      this.query = params;
      // this.parentId = '';
      this.page.currentPage = 1;
      this.recordOnLoad(this.page, params);
      done();
    },
    selectionChange (list) {
      this.selectionList = list;
    },
    selectionClear () {
      this.selectionList = [];
      this.$refs.auditRecordCrud.toggleSelection();
    },
    currentChange (currentPage) {
      this.page.currentPage = currentPage;
    },
    sizeChange (pageSize) {
      this.page.pageSize = pageSize;
    },
    refreshChange () {
      this.recordOnLoad(this.page, this.query);
    },
    recordOnLoad (page) {
      let me = this;
      let queryParam = {
        id: this.curVesionRecordRow.id,
        current: page.currentPage,
        size: page.pageSize,
      };
      this.recordLoading = true;
      versionListUrl(queryParam).then((res) => {
        if (res.data.success) {
          me.recordData = res.data.data ? res.data.data.records : [];
          me.page.total = parseInt(res.data.data.total);
          me.recordLoading = false;
          me.selectionClear();
        }
      });
    },
  },
};
</script>

<style scoped></style>
