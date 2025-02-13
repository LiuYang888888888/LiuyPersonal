<template>
  <el-row class="perspect-manage-container">
    <div
      class="fag-manage-tree"
      :style="{ height: allWindowTopBodyHeight + 'px' }"
    >
      <el-scrollbar style="border-right: 10px solid #f8f9fa">
        <div class="profile-config-template-scroll">
          <ul id="profileConfigList" class="profile-config-template-list">
            <li
              class="profile-config-item"
              v-for="list in viewTypeList"
              :key="list.id"
              :class="[selectedCateId == list.id ? 'item-this' : '']"
              :title="list.codeName"
              @click="handlerChoose(list.codeName, list.id)"
            >
              <p>{{ list.codeName }}</p>
            </li>
          </ul>
        </div>
      </el-scrollbar>
    </div>
    <basic-container
      :style="{ height: allWindowTopBodyHeight + 'px' }"
      class="fag-manage-content"
    >
      <avue-crud
        :option="option"
        :data="data"
        ref="crudTemplateTable"
        :page.sync="page"
        :table-loading="loading"
      >
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
          <el-radio
            :label="row.id"
            v-model="perspectRadios[selectedCateId]"
            @change="radioChange($event, row)"
          >
            <span></span>
          </el-radio>
        </template>
      </avue-crud>
    </basic-container>
    <div
      class="chooseed-spective-wrap"
      :style="{ height: allWindowTopBodyHeight + 'px' }"
    >
      <h5 class="chooseed-spective-header">
        {{ $t("faq.selectedPerspective") }}
      </h5>
      <el-scrollbar>
        <div class="chooseed-cate-item">
          <!--<p class="cate-name">分类一</p>-->
          <ul>
            <li v-for="(perspectItem, i) in curSelectedPerspects" :key="i">
              <span
                class="perspect-tag-text"
                :title="perspectItem.cateName + '：' + perspectItem.name"
                >{{ perspectItem.cateName }}：{{ perspectItem.name }}</span
              >
              <i
                class="perspect-tag-close el-icon-close"
                @click="deletePersItem(perspectItem)"
              ></i>
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
import {
  customerAngleView,
  customerDetailAngleView,
} from "@/api/kwKnowledgeCenter/kwSettings/kwAnswerViewManage/index";
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
  data() {
    var botId = this.$store.getters.botObj.id;
    return {
      curSelectedPerspects: [], // 选中的视角
      allWindowTopBodyHeight: 400, // 弹框高度
      perspectRadios: {},
      botId: botId, //机器人id
      loading: false,
      selectedCateId: "", //默认左侧列表id
      selectedCateName: "", //默认左侧列表的名字
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
        height: 380,
        border: true,
        // selection: 'radio',
        column: [
          {
            label: this.$t("faq.select"),
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
    radioChange(e, row) {
      let cateId = row.parentId;
      let selectedCateIds = [];
      this.curSelectedPerspects.forEach((item) => {
        selectedCateIds.push(item.cateId);
      });
      if (selectedCateIds.join(",").indexOf(cateId) > -1) {
        // 说明该分类下已经选择了一个视角，更新视角就可以了
        this.curSelectedPerspects.every((item) => {
          if (item.cateId == cateId) {
            item.id = row.id;
            item.ids = row.id + "_3";
            item.name = row.name;
            item.angleId = row.id;
            item.deepPath = row.deepPath;
            return false;
          } else {
            // 添加 push
            return true;
          }
        });
      } else {
        // 如果不存在，新增上去
        this.curSelectedPerspects.push({
          cateId: cateId,
          cateid: cateId,
          cateName: this.selectedCateName,
          id: row.id,
          name: row.name,
          ids: row.id + "_3",
          angleId: row.id,
          deepPath: row.deepPath,
        });
      }
    },

    // 删除视角
    deletePersItem(row) {
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

    //获取左侧列表
    async getList() {
      const result = await customerAngleView(this.selectedCateId);
      if (result.data.code == 200) {
        const Data = result.data.data;
        // this.page.total = Data.total;
        this.viewTypeList = Data;
      }
      // this.viewTypeList = [
      //   {
      //     label: "文本",
      //     value: "text",
      //   },
      //   {
      //     label: "多行文本",
      //     value: "multiple_text",
      //   },
      //   {
      //     label: "日期",
      //     value: "date",
      //   },
      //   {
      //     label: "时间",
      //     value: "time",
      //   },
      //   {
      //     label: "日期时间",
      //     value: "date_time",
      //   },
      //   {
      //     label: "数值",
      //     value: "numerical",
      //   },
      //   {
      //     label: "正整数",
      //     value: "positive_integer",
      //   },
      //   {
      //     label: "下拉列表",
      //     value: "drop_down",
      //   },
      //   {
      //     label: "单选框",
      //     value: "single_choice",
      //   },
      //   {
      //     label: "多选框",
      //     value: "multiple_choice",
      //   },
      // ];
      if (this.selectedCateId) {
        this.selectedCateId = this.selectedCateId;
      } else {
        this.selectedCateId =
          this.viewTypeList.length > 0 ? this.viewTypeList[0].id : "";
      }
      this.selectedCateName =
        this.viewTypeList.length > 0 ? this.viewTypeList[0].codeName : "";
      this.getTableData();
    },

    //获取右侧表格数据
    async getTableData() {
      this.loading = true;
      const result = await customerDetailAngleView(this.selectedCateId);
      if (result.data.code == 200) {
        const Data = result.data.data;
        // this.page.total = Data.total;
        if (Data.multipleChoice) {
          this.data = Data.multipleChoice;
        } else {
          this.data = [];
        }
        this.tableDataHandle(this.data, "children");
        this.loading = false;
      }
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
    //点击左侧列表方法
    handlerChoose(name, id) {
      this.selectedCateName = name;
      this.selectedCateId = id;
      this.getTableData();
    },
    //搜索列表
    handlerSearch() {
      // this.$set(this.option, "defaultExpandAll", true);
      this.getTableData();
    },
    //重置搜索结果
    handlerReset() {
      // this.$set(this.option, "defaultExpandAll", false);
      this.viewName = "";
      this.getTableData();
    },

    // 保存选中的视角
    savePerspects() {
      /* let perspectives = [{
        value: this.perspectRadio,
        label: '视角一'
      }];*/
      return this.curSelectedPerspects;
    },
  },
  created() {},
  mounted() {
    // 获取机器人id
    // var query = {};
    // if (this.desktopWindow) {
    //   query = this.desktopWindow.data.query;
    // }
    //  this.botId = query.id;
    this.getList();

    // 返现的数据
    this.choosedPerspects.forEach((item) => {
      item.parentId = item.cateid;
      item.cateId = item.cateid;
      this.curSelectedPerspects.push(item);
    });
  },
  destroyed() {},
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
  padding-left: 200px;
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
