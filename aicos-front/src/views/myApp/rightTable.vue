<template>
  <div class="riTables">
    <avue-crud
      :table-loading="loading"
      :data="data"
      :option="option"
      :page="page"
      @row-save="rowSave"
      @search-change="searchChange"
      @search-reset="searchReset"
      @refresh-change="refreshChange"
      @current-change="currentChange"
      @size-change="sizeChange"
      @row-del="rowDel"
      @row-update="rowUpdate"
      @selection-change="selectionChange"
    >
      <template slot="menuLeft">
        <el-button
          type="primary"
          size="small"
          @click="importDialogVisible = true"
          >添加应用</el-button
        >
        <el-button
          type="primary"
          size="small"
          @click="importDialogVisible = true"
          >体验中心</el-button
        >
      </template>
    </avue-crud>
  </div>
</template>

<script>
import baseLeftTree from "./baseLeftTree";
import {getDictItemListByDictCodeURL} from '@/api/common';
// import nomal from "@/assets/iconfont/normal.png";
export default {
  name: "riTables",
  components: { baseLeftTree },
  props: {},
  data() {
    return {
      api: null,
      dictName: "",
      data:[],
      page: {
        size: 10,
        pageSizes: [10, 30, 50, 100, 200],
        current: 1,
        total: 0,
      },
      option: {
        // title: "敏感词列表",
        align: "center",
        menuAlign: "center",
        addBtn: true,
        addBtnText: "新增",
        excelBtn: false,
        excelBtnText: "导出全部",
        delBtn: true,
        editBtn: true,
        selection: true,
        searchMenuPosition:"left",
        searchSpan: 8,
        searchMenuSpan: 8,
        rowKey: "id",
        column: [
          {
            label: "词",
            prop: "word",
            search: true,
            type: "input",
            rules: [
              {
                required: true,
                message: "请输入词",
                trigger: "blur",
              },
            ],
          },
          {
            label: "拼音",
            prop: "pinyin",
            search: true,
            type: "input",
            rules: [
              {
                required: true,
                message: "请输入拼音",
                trigger: "blur",
              },
            ],
          },
          {
            label: "近似拼音",
            prop: "similarPinyin",
            search: false,
            type: "input",
          },
          {
            label: "带声调拼音",
            prop: "pinyinWithTone",
            search: false,
            type: "input",
          },
          {
            label: "类型",
            prop: "wordType",
            search: true,
            display: true,
            // hide: true,
            type: "select",
            dicUrl: getDictItemListByDictCodeURL,
            dicMethod: "post",
            dicQuery: {
              code: "ai-aiCenter-thesaurusMgr-pinyin-type",
            },
            props: {
              label: "name",
              value: "code",
            },
          },
          {
            label: "创建时间",
            prop: "createTime",
            search: true,
            display: false,
            type: "daterange",
            format: "yyyy-MM-dd HH:MM:ss",
            valueFormat: "yyyy-MM-dd HH:MM:ss",
          },
        ],
      },
    };
  },
  computed: {},
  created() {
    // this.$refs.treeRef.formOption = this.formOption
  },
  methods: {},
};
</script>

<style lang="scss" scoped>
</style>
