<template>
  <el-row class="perspect-manage-container" :gutter="30">
    <el-col span="18">
      <basic-container :style="{ height: allWindowTopBodyHeight + 'px' }" class="fag-manage-content">
        <avue-crud :option="faqTableOption" :data="faqTableData" ref="crudFaqTable" :page.sync="faqTablePage"
          :table-loading="loading" @select="selectRow" @selection-change="selectionChange" @select-all="selectionALL"
          @on-load="onLoad">
        </avue-crud>
      </basic-container>
    </el-col>
    <el-col span="6">
      <div class="chooseed-spective-wrap" :style="{ height: allWindowTopBodyHeight + 'px' }">
        <h5 class="chooseed-spective-header">{{ $t('system.asrAndTts.selectedTimbre') }}</h5>
        <div class="chooseed-spective-content">
          <div class="chooseed-cate-item">
            <ul v-if="curSelectedPerspects.length > 0">
              <li v-for="perspectItem in curSelectedPerspects" :key="perspectItem.id">
                <span class="perspect-tag-text" :title="perspectItem.name">{{
                  perspectItem.name
                }}</span>
                <i class="perspect-tag-close el-icon-close" @click="deletePersItem(perspectItem)"></i>
              </li>
            </ul>
            <p style="
                text-align: center;
                color: rgb(188 187 187);
                padding-top: 20px;
              " v-else>
              {{ $t("aicosCommon.pleaseSelect") + $t('system.asrAndTts.timbre') }}
            </p>
          </div>
        </div>
      </div>
    </el-col>
  </el-row>
</template>

<script>
import { mapGetters } from "vuex";
import { getVoice } from "@/api/system/asrAndtts/tts";
export default {
  inject: ["desktopWindow", "desktop"],
  props: {
    deployMethod: {
      type: String,
      default: "public",
    },
    company: {
      type: String,
      default: "ali",
    },
    // 选中的视角
    faqData: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },
  data () {
    return {
      botId: "",
      curSelectedPerspects: [], // 选中的视角
      allWindowTopBodyHeight: 400, // 弹框高度
      loading: false,
      curSelectedTreeNode: {},
      viewTypeList: [], //视角类型列表
      tableListId: "", //列表数据的id
      faqTableData: [],
      faqTablePage: {
        total: 0,
        currentPage: 1,
        pageSize: 10,
      },
      faqTableOption: {
        searchShowBtn: false,
        refreshBtn: false,
        tip: false,
        searchShow: false,
        dialogWidth: "60%",
        columnBtn: false,
        border: true,
        index: false,
        addBtn: false,
        selection: true,
        editBtn: false,
        delBtn: false,
        viewBtn: false,
        menu: false,
        menuWidth: 300,
        dialogClickModal: false,
        // reserveSelection:true,
        height: 350,
        column: [
          {
            label:this.$t("system.asrAndTts.timbreName") ,
            prop: "name",
            width: 200,
            showWordLimit: true,
            overHidden: true,
          },
          {
            label:this.$t("system.asrAndTts.sex"),
            prop: "sex",
            showWordLimit: true,
            overHidden: true,
          },
          {
            label:this.$t("system.asrAndTts.scene") ,
            prop: "scene",
            showWordLimit: true,
            overHidden: true,
          },
          {
            label:this.$t("system.asrAndTts.languages"),
            prop: "lang",
            showWordLimit: true,
            overHidden: true,
          },
        ],
      },
    };
  },
  computed: {
    ...mapGetters(["botObj"]),
  },
  methods: {
    // 选中数据
    selectRow (list, row) {
      var isChecked = false;
      var selectedIds = [];
      this.curSelectedPerspects.forEach((item) => {
        selectedIds.push(item.id);
      });

      // 判断是否选中
      list.every((item) => {
        if (item.id == row.id) {
          isChecked = true;
          if (selectedIds.join(",").indexOf(row.id) < 0) {
            this.curSelectedPerspects.push(row);
          }
          return false;
        }
        isChecked = false;
        return true;
      });
      if (!isChecked) {
        // 取消选中
        this.curSelectedPerspects.every((item, index) => {
          if (item.id == row.id) {
            this.curSelectedPerspects.splice(index, 1);
            return false;
          }
          return true;
        });
      }
    },
    // 选中all数据
    selectionALL (list) {
      var selectedIds = [];
      var curPageData = this.faqTableData; // 当前页的数据
      var curPageDataIds = []; // 当前页数据ids
      this.curSelectedPerspects.forEach((item) => {
        selectedIds.push(item.id);
      });
      if (list.length > 0) {
        // 全选
        list.forEach((item) => {
          if (selectedIds.join(",").indexOf(item.id) < 0) {
            // 说明没有
            this.curSelectedPerspects.push(item);
          }
        });
      } else {
        // 取消全选
        curPageData.forEach((item) => {
          curPageDataIds.push(item.id);
        });

        this.curSelectedPerspects = this.curSelectedPerspects.filter((item) => {
          if (curPageDataIds.indexOf(item.id) < 0) {
            return item;
          }
        });
      }
    },
    // 删除选中的数据
    deletePersItem (row) {
      var curPageData = this.faqTableData; // 当前页的数据
      var curPageDataIds = []; // 当前页数据ids

      curPageData.forEach((item) => {
        curPageDataIds.push(item.id);
      });

      this.curSelectedPerspects.every((item, index) => {
        if (item.id == row.id) {
          this.curSelectedPerspects.splice(index, 1);
          if (curPageDataIds.indexOf(item.id) >= 0) {
            this.$refs.crudFaqTable.toggleSelection([item], false);
          }
          return false;
        } else {
          // 添加 push
          return true;
        }
      });
    },
    //表格数据
    onLoad () {
      const info = {
        deployMethod: this.deployMethod,
        company: this.company,
      };
      this.loading = true;
      getVoice(info).then((resData) => {
        resData = resData.data;
        if (resData.code == 200) {
          this.faqTableData = resData.data;
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
    // 保存选中的数据
    saveSimilarQuesion () {
      var similarDatas = [];

      this.curSelectedPerspects.forEach((item) => {
        similarDatas.push({
          id: item.id,
          name: item.name,
        });
      });
      return similarDatas;
    },
  },
  created () { },
  mounted () {
    this.faqData.forEach((item) => {
      this.curSelectedPerspects.push(item);
    });
  },
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

.perspect-manage-container {
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
