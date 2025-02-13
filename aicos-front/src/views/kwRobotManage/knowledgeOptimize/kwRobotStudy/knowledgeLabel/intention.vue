<template>
  <div>
    <!-- 意图列表区域 -->
    <avue-crud
      :option="option"
      :data="data"
      :permission="permissionList"
      ref="crud"
      :page.sync="page"
      :table-loading="loading"
      @on-load="onLoad"
      @row-click="getOpenDetail"
      @select="select"
      @select-all="selectAll"
      @selection-change="selectionChange"
    >
      <template slot="header">
        <div class="kw-header">
          <div id="kw-form-container">
            <div class="kw-form-form">
              <!-- 意图类型 -->
              <el-select
                v-model="intentionType"
                clearable
                size="small"
                :placeholder="$t('kwIntentionManage.intentionType')"
                class="kw-form-type"
              >
                <el-option
                  v-for="(item, index) in typeList"
                  :key="index"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
              <!-- 训练状态 -->
              <!-- <el-select
                  v-model="intentionStatus"
                  size="small"
                  clearable
                  :placeholder="$t('kwIntentionManage.intentionStatus')"
                  class="kw-form-type"
                >
                  <el-option
                    v-for="(item, index) in statusList"
                    :key="index"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select> -->
              <!-- 意图名称 -->
              <el-input
                :placeholder="$t('kwIntentionManage.intentionName')"
                v-model="intentionName"
                size="small"
                clearable
                class="kw-form-type"
              >
              </el-input>
            </div>
            <div class="kw-form-btn">
              <el-button
                type="primary"
                icon="el-icon-search"
                size="small"
                class="kw-search-btn"
                @click="handlerSearch"
              ></el-button>
              <el-button size="small" class="kw-reset-btn" @click="handlerReset"
                ><i class="aicosicon aicos-icon-clear"></i
              ></el-button>
            </div>
          </div>
        </div>
      </template>
      <template #radio="{ row }">
          <el-radio v-model="selectId" :label="row.id">&nbsp;</el-radio>
        </template>
      <template slot-scope="{ row }" slot="intentType">
        <!-- 问答类型 -->
        <div v-if="row.intentType == 1">
          {{ $t("kwIntentionManage.answerType") }}
        </div>
        <!-- 任务类型 -->
        <div v-else>{{ $t("kwIntentionManage.taskType") }}</div>
      </template>
      <template slot-scope="{ row }" slot="trainingFlag">
        <!-- 已训练 -->
        <div v-if="row.trainingFlag == 1">
          {{ $t("kwIntentionManage.hasTrain") }}
        </div>
        <div v-else>{{ $t("kwIntentionManage.readyTrain") }}</div>
      </template>
    </avue-crud>
  </div>
</template>

<script>
import { intentList } from "@/api/kwKnowledgeCenter/kwIntention/index";
import { mapGetters } from "vuex";
export default {
  inject: ["desktopWindow", "desktop", "isRobotMenu"],
  data() {
    return {
      selectId: "",
      ids: [],
      sonCur: {},
      addSonIntentFlag: false,
      isEdit: false,
      cur: {},
      node: "",
      resolve: "",
      typeList: [
        { label: this.$t("kwIntentionManage.answerType"), value: "1" },
        { label: this.$t("kwIntentionManage.taskType"), value: "2" },
      ],
      statusList: [
        { label: this.$t("kwIntentionManage.hasTrain"), value: "1" },
        { label: this.$t("kwIntentionManage.readyTrain"), value: "0" },
      ],
      classifyId: "0", //分类id
      classType: "intent",
      intentionType: "", //问答类型
      intentionStatus: "", //训练状态
      intentionName: "", //意图名称
      data: [],
      page: {
        total: 0,
        currentPage: 1,
        pageSize: 10,
      },
      option: {
        tip: false,
        // selection: true,
        // height: 515,
        addBtn: false,
        editBtn: false,
        viewBtn: false,
        delBtn: false,
        searchBtn: false,
        columnBtn: false,
        refreshBtn: false,
        stripe: true,
        menuWidth: 200,
        menu:false,
        menuAlign: "center",
        emptyText: this.$t('aicosCommon.notData'),
        column: [
          {
            label:'',
            prop:'radio',
            width:100
          },
          {
            label: this.$t("kwIntentionManage.intentionName"), //意图名称
            prop: "intentName",
            overHidden: true,
          },
          {
            label: this.$t("kwIntentionManage.intentionType"), //意图类型
            prop: "intentType",
          },
          // {
          //   label: this.$t("kwIntentionManage.intentionStatus"), //训练状态
          //   prop: "trainingFlag",
          // },
          {
            label: this.$t("kwIntentionManage.commonAnswer"), //常用问法
            prop: "commonCount",
          },
          {
            label: this.$t("kwIntentionManage.regular"), //正则表达式
            prop: "regularCount",
          },
        ],
      },
      addType: "",
    };
  },
  computed: {
    ...mapGetters(["permission"]),
  },
  components: {
  },
  methods: {
    async onLoad() {
      this.loading = true;
      const info = {
        botId: this.$store.getters.botObj.id,
        classifyId: this.classifyId,
        current: this.page.currentPage,
        size: this.page.pageSize,
        intentName: this.intentionName, //意图名称
        intentType: this.intentionType, //意图类型
        trainingFlag: this.intentionStatus, //训练状态
      };
      const result = await intentList(info);
      if (result.data.code == 200) {
        this.data = result.data.data.records;
        this.page.total = result.data.data.total;
        this.loading = false;
      }
    },
    //搜索
    handlerSearch() {
      this.onLoad();
      setTimeout(() => {
        this.listIsExpand(this.data, true);
      }, 300);
    },
    //重置
    handlerReset() {
      this.intentionName = "";
      this.intentionType = "";
      this.intentionStatus = "";
      this.onLoad();
      this.listIsExpand(this.data, false);
    },
    //列表树的展开收起
    listIsExpand(arr, expandFlag) {
      this.loading = true;
      arr.forEach((item) => {
        this.$refs.crud.toggleRowExpansion(item, expandFlag);
        if (item.children) {
          this.listIsExpand(item.children, expandFlag);
        }
      });
      this.loading = false;
    },
  },
};
</script>

<style lang="scss" scoped>
/deep/ .el-card__body {
  padding: 0;
}
/deep/ .avue-crud__menu {
  display: none;
}
</style>
