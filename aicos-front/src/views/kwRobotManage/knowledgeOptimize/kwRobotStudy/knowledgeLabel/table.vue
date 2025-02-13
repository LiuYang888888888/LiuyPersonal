<template>
  <el-row class="perspect-manage-container">
    <div
      class="fag-manage-tree"
      :style="{ height: allWindowTopBodyHeight + 'px' }"
      style="overflow-y: auto"
    >
      <LeftTree
        ref="tree"
        @getNode="getNode"
        @nodeClick="nodeClick"
        :classType="classType"
        :botId="botId"
        :isMine="false"
        :isSetting="false"
        :name="$t('table.knowledgeClass')"
      />
    </div>
    <basic-container
      :style="{ height: allWindowTopBodyHeight + 'px' }"
      class="fag-manage-content"
    >
      <avue-crud
        :option="faqTableOption"
        :data="faqTableData"
        ref="crudFaqTable"
        :page.sync="faqTablePage"
        :table-loading="loading"
        @select="selectRow"
        @selection-change="selectionChange"
        @select-all="selectionALL"
        @on-load="onLoad"
      >
        <template slot="header">
          <div class="kw-header">
            <div id="kw-form-container" style="margin: 0px; padding: 0">
              <div class="kw-form-form">
                <el-input
                  size="small"
                  :placeholder="
                    $t('aicosCommon.pleaseInput') + $t('table.question')
                  "
                  v-model="queryObj.question"
                  clearable
                  class="kw-form-type"
                >
                </el-input>
              </div>
              <div class="kw-form-btn">
                <el-button
                  size="small"
                  type="primary"
                  icon="el-icon-search"
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
        <template #radio="{ row }">
          <el-radio v-model="selectId" :label="row.id">&nbsp;</el-radio>
        </template>
        <template slot-scope="{ row }" slot="answer">
          <div v-html="row.answer" class="answer-table-container"></div>
        </template>
        <template slot-scope="scope" slot="knowledgeStatus">
          <span v-if="scope.row.knowledgeStatus == '0'">{{ $t('table.draft') }}  </span>
          <span v-else-if="scope.row.knowledgeStatus == '1'">{{ $t('table.published') }}  </span>
        </template>
        <template slot-scope="scope" slot="status">
          <span v-if="scope.row.status == 0"> {{ $t('table.deactivate') }} </span>
          <span v-else-if="scope.row.status == 1"> {{ $t('table.enable') }} </span>
        </template>
      </avue-crud>
    </basic-container>
  </el-row>
</template>

<script>
import { mapGetters } from "vuex";
import { loadListUrl } from "@/api/kwKnowledgeCenter/kwKnowledgeMangement/kwTabManagement/index.js";
import LeftTree from "@/components/kwLeftTree/index";
export default {
  inject: ["desktopWindow", "desktop"],
  props: {
    // 选中的视角
    faqData: {
      type: Array,
      default: () => {
        return [];
      }
    }
  },
  data() {
    return {
      botId: "",
      selectId: "",
      classType: "tableQa", // 树的类型
      curSelectedPerspects: [], // 选中的视角
      allWindowTopBodyHeight: 700, // 弹框高度
      perspectRadios: {},
      loading: false,
      curSelectedTreeNode: {},
      curTreeNodeId: "", //默认左侧列表id
      selectedCateName: "", //默认左侧列表的名字
      viewTypeList: [], //视角类型列表
      viewName: "", //搜索用的视角名称
      tableListId: "", //列表数据的id
      queryObj: {
        // titleType: "1",
        question: ""
      },
      faqTableData: [],
      faqTablePage: {
        total: 0,
        currentPage: 1,
        pageSize: 10
      },
      faqTableOption: {
        searchShowBtn: false,
        refreshBtn: false,
        tip: false,
        searchShow: true,
        searchMenuSpan: 6,
        dialogWidth: "60%",
        columnBtn: false,
        border: true,
        index: false,
        addBtn: false,
        // selection: true,
        editBtn: false,
        delBtn: false,
        viewBtn: false,
        menu: false,
        menuWidth: 300,
        menuAlign: "center",
        dialogClickModal: false,
        labelWidth: 120,
        height: 550,
        emptyText: this.$t("aicosCommon.notData"),
        column: [
          {
            label: "",
            prop: "radio",
            width: 60,
            hide: false
          },
          {
            label: this.$t('table.question'),
            prop: "question",
            minWidth: 200,
            showWordLimit: true,
            overHidden: true
          },
          {
            label:  this.$t('table.numberOfAnswers'),
            prop: "answerNum",
            minWidth: 200,
            showWordLimit: true,
            overHidden: true
          },
          {
            label: this.$t('table.knowledgeState'),
            prop: "knowledgeStatus",
            span: 12,
            width: 150,
            showWordLimit: true,
            overHidden: true
          },
          {
            label:this.$t('table.startStopStatus'),
            prop: "status",
            width: 130,
            showWordLimit: true,
            overHidden: true
          }
        ]
      }
    };
  },
  components: {
    LeftTree
  },
  computed: {
    ...mapGetters(["botObj"])
  },
  methods: {
    //获取树的node和resolve
    getNode(data) {
      this.node = data.node;
      this.resolve = data.resolve;
    },
    //左侧树节点点击,右侧区域响应
    nodeClick(nodeId) {
      var tree = this.$refs.tree.$refs.tree;
      var curNode = tree.getNode(nodeId);

      this.curSelectedTreeNode = curNode;
      this.curTreeNodeId = curNode.data.id;

      this.onLoad();
    },

    selectionChange() {
      // console.log(list, 'change');
    },

    //获取右侧表格数据
    onLoad() {
      var info = {};

      info = {
        ...this.queryObj,
        botId: this.botObj.id,
        dimensionId: "",
        angleId: "",
        cateId: this.curSelectedTreeNode.data
          ? this.curSelectedTreeNode.data.id
          : "0",
        current: this.faqTablePage.currentPage,
        size: this.faqTablePage.pageSize
      };

      this.loading = true;
      loadListUrl(info).then(resData => {
        resData = resData.data;
        if (resData.code == 200) {
          this.faqTableData = resData.data.records;
          // this.tableDataHandle(this.data, "children");
          this.faqTablePage.total = resData.data.total;
          this.loading = false;

          if (this.curSelectedPerspects.length > 0) {
            this.$refs.crudFaqTable.toggleSelection(
              this.curSelectedPerspects,
              true
            );
          }
        }
      });
    },

    //搜索列表
    handlerSearch() {
      this.onLoad();
    },
    //重置搜索结果
    handlerReset() {
      this.queryObj.question = "";
      this.onLoad();
    }
  },
  created() {
    // 获取机器人id
    this.botId = this.botObj.id;
  },
  mounted() {
    this.faqData.forEach(item => {
      this.curSelectedPerspects.push(item);
    });
  },
  destroyed() {}
};
</script>

<style lang="scss" scoped>
.answer-table-container {
  p {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    width: 100%;
  }

  img {
    width: 20px !important;
    height: 20px !important;
  }
}

/deep/ {
  .avue-crud__menu {
    display: none;
  }

  .chooseed-spective-wrap .el-scrollbar__view {
    height: auto;
  }
}

.profile-config-template-scroll {
  padding-top: 10px;
}

/deep/ .profile-config-template-scroll .el-card__body {
  padding: 0 5px 0 10px;
}

/deep/ .el-table__row {
  p {
    margin: 0;
    padding: 0;
  }
}

#profileConfigList {
  padding: 0;
  margin: 0;

  .profile-config-item {
    list-style: none;
    height: 30px;
    line-height: 30px;
    padding-left: 10px;
    cursor: pointer;
  }

  .profile-config-item:hover {
    background-color: #f2f2f2;
  }

  .profile-config-item.item-this {
    background-color: #f2f2f2;
  }

  .profile-config-item p {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    cursor: pointer;
    margin: 0;
    font-size: 14px;
  }
}

.perspect-manage-container {
  position: relative;
  padding-left: 200px;
  padding-right: 0px;

  .fag-manage-tree {
    position: absolute;
    left: 0;
    width: 200px;
    background-color: #fff;
    margin: 0 -7px;
    border-right: 10px solid #f8f9fa;
  }

  .fag-manage-content {
    background-color: #fff;
    margin-left: 6px;
    margin-right: 6px;
    padding: 10px 0;
  }

  /deep/ .fag-manage-content .el-card__body {
    padding: 0;
  }

  .chooseed-spective-wrap {
    position: absolute;
    right: 0;
    top: 0;
    width: 200px;
  }
}

.chooseed-spective-wrap {
  border-left: 10px solid #f8f9fa;
  border-right: 1px solid #ebeef5;

  .chooseed-spective-content {
    height: calc(100% - 50px);
    overflow-y: auto;
  }

  .chooseed-spective-header {
    margin: 0;
    padding: 0 0 0 10px;
    font-size: 14px;
    border-bottom: 1px solid #ebeef5;
    font-weight: normal;
    height: 40px;
    line-height: 40px;
  }

  .chooseed-cate-item {
    padding: 5px 10px 0;

    .cate-name {
      background-color: #fafafa;
      height: 32px;
      line-height: 32px;
      margin: 0;
      padding: 0;
    }

    ul {
      padding: 0;
      margin: 0;
      list-style: none;

      li {
        background-color: #f4f4f5;
        color: #909399;
        margin: 0 0 10px 0;
        max-width: 100%;
        align-items: center;
        height: 24px;
        padding: 0 20px 0 4px;
        line-height: 22px;
        border: 1px solid #e9e9eb;
        border-radius: 4px;
        white-space: nowrap;
        font-size: 12px;
        position: relative;

        .perspect-tag-text {
          overflow: hidden;
          text-overflow: ellipsis;
          color: #909399;
          line-height: 22px;
          font-size: 12px;
          white-space: nowrap;
          max-width: 140px;
          display: inline-block;
        }

        .perspect-tag-close {
          color: #909399;
          background-color: #c0c4cc;
          border-radius: 50%;
          text-align: center;
          position: absolute;
          top: 3px;
          right: 4px;
          cursor: pointer;
          font-size: 12px;
          height: 16px;
          width: 16px;
          line-height: 16px;
          vertical-align: middle;
          transform: scale(0.8);
        }
      }
    }
  }
}
</style>
