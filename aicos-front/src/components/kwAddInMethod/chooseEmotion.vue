<template>
  <el-row class="perspect-manage-container">
    <basic-container :style="{ height: allWindowTopBodyHeight + 'px' }" class="fag-manage-content">
      <avue-crud :option="option" :data="data" ref="crudTemplateTable" :table-loading="loading" @on-load="onLoad">
        <!-- <template slot="header">
          <div class="kw-header">
            <div id="kw-form-container" style="margin: 0px; padding: 0">
              <div class="kw-form-form">
                <el-input
                  size="small"
                  :placeholder="$t('answerViewManage.viewName')"
                  v-model="viewName"
                  clearable
                  class="kw-form-type"
                >
                </el-input>
              </div>
              <div class="kw-form-btn">
                <el-button
                  size="small"
                  type="primary"
                  class="kw-search-btn"
                  icon="el-icon-search"
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
        </template> -->
        <template slot="radioIndex" slot-scope="{ row }">
          <el-radio :label="row.id" v-model="perspectRadios[selectedCateId]" @change="radioChange($event, row)">
            <span></span>
          </el-radio>
        </template>
      </avue-crud>
    </basic-container>
    <div class="chooseed-spective-wrap" :style="{ height: allWindowTopBodyHeight + 'px' }">
      <h5 class="chooseed-spective-header">{{ $t('faq.selectedPerspective') }}</h5>
      <el-scrollbar>
        <div class="chooseed-cate-item">
          <!--<p class="cate-name">分类一</p>-->
          <ul>
            <li v-for="(perspectItem, i) in curSelectedPerspects" :key="i">
              <span class="perspect-tag-text" :title="perspectItem.name">{{
                perspectItem.name
              }}</span>
              <i class="perspect-tag-close el-icon-close" @click="deletePersItem(perspectItem)"></i>
            </li>
          </ul>
        </div>
      </el-scrollbar>
    </div>
  </el-row>
  <!--<someComponent></someComponent>-->
</template>

<script>
import { mapGetters } from "vuex";
// import {
//   angleTypeList,
//   angleList,
// } from "@/api/kwKnowledgeCenter/kwSettings/kwAnswerViewManage/index";
import { getDictionary } from "@/api/system/dict";
export default {
  inject: ["desktopWindow", "desktop"],
  props: {
    // 选中的视角
    choosedPerspects: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },
  data () {
    var botId = this.$store.getters.botObj.id;
    return {
      curSelectedPerspects: [], // 选中的视角
      allWindowTopBodyHeight: 400, // 弹框高度
      perspectRadios: {},
      botId: botId, //机器人id
      loading: false,
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
        rowKey: "id",
        rowParentKey: "ancestors",
        addBtn: false,
        editBtn: false,
        viewBtn: false,
        delBtn: false,
        searchBtn: false,
        columnBtn: false,
        refreshBtn: false,
        stripe: true,
        menu: false,
        // height: 300,
        border: true,
        // selection: 'radio',
        column: [
          {
            label: this.$t('faq.select'),
            prop: "radioIndex",
            width: 100,
          },
          {
            label: this.$t("answerViewManage.viewName"), //视角名称
            prop: "name",
          },
          {
            label: this.$t("answerViewManage.desc"), //备注
            prop: "remark",
          },
        ],
      },
    };
  },
  components: {
    //someComponent
  },
  computed: {
    // 计算属性
    ...mapGetters(["botObj"]),
  },
  methods: {
    // 选中视角
    radioChange (e, row) {
      this.curSelectedPerspects = [];
      // 如果不存在，新增上去
      this.curSelectedPerspects.push({
        ids: row.id + "_4",
        id: row.id,
        name: row.name,
        cateName: '客户情绪'
      });
    },

    // 删除视角
    deletePersItem (row) {
      this.curSelectedPerspects.every((item, index) => {
        if (item.id == row.id) {
          this.curSelectedPerspects.splice(index, 1);
          this.perspectRadios[row.cateId] = "";
          return false;
        } else {
          // 添加 push
          return true;
        }
      });
    },

    //获取右侧表格数据
    onLoad () {
      this.loading = true;
      getDictionary({ code: "angle_view_emotion" }).then((res) => {
        if (res.data.code == 200) {
          this.loading = false;
          this.data = res.data.data;
        }
      });
    },

    //处理获取到的树型表格数据
    tableDataHandle (arr, key, level = 0, indexLine = []) {
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
    //搜索列表
    handlerSearch () {
      // this.$set(this.option, "defaultExpandAll", true);
      this.onLoad();
    },
    //重置搜索结果
    handlerReset () {
      // this.$set(this.option, "defaultExpandAll", false);
      this.viewName = "";
      this.onLoad();
    },

    // 保存选中的视角
    savePerspects () {
      /* let perspectives = [{
        value: this.perspectRadio,
        label: '视角一'
      }];*/
      return this.curSelectedPerspects;
    },
  },
  created () { },
  mounted () {
    // 获取机器人id
    // var query = {};
    // if (this.desktopWindow) {
    //   query = this.desktopWindow.data.query;
    // }
    //  this.botId = query.id;
    // 返现的数据
    this.choosedPerspects.forEach((item) => {
      this.curSelectedPerspects.push(item);
    });
  },
  destroyed () { },
};
</script>

<style lang="scss" scoped>
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
  // padding-left: 200px;
  padding-right: 200px;

  .fag-manage-tree {
    position: absolute;
    left: 0;
    width: 200px;
    background-color: #fff;
    margin: 0 -7px;
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

  .el-scrollbar {
    height: calc(100% - 50px);
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
