<template>
  <basic-container>
    <avue-crud :option="optionyue" :table-loading="loadingyue" :data="datayue" :page="pageyue" :permission="permissionList"
      :before-open="beforeOpenyue" v-model="formyue" ref="crudyue" @row-update="rowUpdateyue"
      @current-change="currentChangeyue" @size-change="sizeChangeyue" @on-load="onLoadyue">
        <template v-slot:menu="scope">
          <el-button type="text" size="small" @click="yueView(scope.row,scope.index)">查看
          </el-button>
          <el-button type="text" size="small" @click="yueUpdate(scope.row,scope.index)">编辑
          </el-button>
        </template>
      </avue-crud>
  </basic-container>
</template>
<script>
import { mapGetters } from "vuex";
import {
  getYueLingqu,
  getYueLingquUpdate
} from "@/api/Political/common";
export default {
  data () {
    return {
      formyue: {},
      queryyue: {},
      loadingyue: true,
      pageyue: {
        pageSize: 10,
        currentPage: 1,
        total: 0
      },
      selectionListyue: [],
      optionyue: {
        height: 'auto',
        align: 'center',
        calcHeight: 150,
        searchShow: true,
        searchMenuSpan: 6,
        tip: false,
        border: true,
        index: true,
        indexLabel: '序号',
        indexWidth: 100,
        editBtn: false,
        addBtn: false,
        delBtn: false,
        viewBtn: false,
        selection: false,
        column: [
          {
            type: 'input',
            label: '所在处室',
            span: 24,
            display: true,
            hideLabel: false,
            prop: 'suozcs',
            isListDisplay: true,
            readonly: true
          },
          {
            type: 'input',
            label: '年月',
            span: 24,
            display: true,
            hideLabel: false,
            prop: 'niany',
            isListDisplay: true,
            readonly: true
          },
          {
            type: 'input',
            label: '人数',
            span: 24,
            display: true,
            hideLabel: false,
            prop: 'rens',
            isListDisplay: true,
            readonly: true
          },
          {
            type: 'input',
            label: '可用名额',
            span: 24,
            display: true,
            hideLabel: false,
            prop: 'keyme',
            isListDisplay: true,
            readonly: true
          },
          {
            type: 'input',
            label: '余数累计',
            span: 24,
            display: true,
            hideLabel: false,
            prop: 'yuslj',
            isListDisplay: true,
          }
        ],
      },
      datayue:[],
    }
  },
  computed: {
    ...mapGetters(["permission"]),
    permissionList () {
      return {
        yueBtn: this.vaildData(
          this.permission[`sys-commonForm-dataMag-xf-yue`],
          false
        ),
      };
    },
    ids () {
      let ids = [];
      this.selectionList.forEach(ele => {
        ids.push(ele.id);
      });
      return ids.join(",");
    }
  },
  methods: {
    onLoadyue (page) {
      this.loadingyue = false;
      const dataParam = {
        current: page.currentPage,
        size: page.pageSize,
      };
      getYueLingqu(dataParam).then(res => {
        const data = res.data.data;
        this.pageyue.total = data.total;
        this.datayue = data.records;
        this.loadingyue = false;
        this.selectionClearyue();
      });
    },
    selectionClearyue () {
      this.selectionListyue = [];
      this.$refs.crudyue.toggleSelection();
    },
    currentChangeyue (currentPage) {
      this.pageyue.currentPage = currentPage;
    },
    sizeChangeyue (pageSize) {
      this.pageyue.pageSize = pageSize;
    },
    refreshChangeyue () {
      this.onLoadyue(this.pageyue, this.queryyue);
    },
    yueView(row,index){
      this.$refs.crudyue.rowView(row, index);
    },
    yueUpdate(row,index){
      this.$refs.crudyue.rowEdit(row, index);
    },
    rowUpdateyue(row, index, done, loading){
      getYueLingquUpdate(row).then(() => {
        done();
        this.onLoadyue(this.pageyue);
        this.$message({
          type: "success",
          message: "操作成功!"
        });
      }, error => {
        window.console.log(error);
        loading();
      });
    }
  }
}
</script>