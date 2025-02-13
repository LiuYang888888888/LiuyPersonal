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
        yueviewBtn: this.vaildData(
          this.permission[`sys-commonForm-dataMag-xf-yueview`],
          false
        ),
        yueeditBtn: this.vaildData(
          this.permission[`sys-commonForm-dataMag-xf-yueed`],
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
<style scoped>
.kqtitle {
  display: flex;
  height: 60px;
  width: 100%;
  line-height: 60px;
  margin: 40px auto;
}

.cstitle {
  height: 60px;
  width: 100%;
  line-height: 60px;
  text-align: center;
  margin: 40px auto 0;
  font-size: 18px;
  font-weight: 600;
}

.csdate {
  width: 100%;
  text-align: center;
  height: 30px;
  line-height: 30px;
  margin: 0 auto 40px;
  font-size: 16px;
}

.kqtxt {
  font-size: 18px;
  width: 100%;
  text-align: center;
}

.listadd {
  width: 60%;
  margin: 0 auto 40px;
  text-align: right;
}

.footer {
  width: 200px;
  margin: 200px auto 0;
  display: flex;
}

.table tr {
  height: 40px;
}

.table tr td {
  line-height: 40px;
  text-align: center;
}

.zhushi {
  width: 100%;
  text-align: center;
  height: 30px;
  line-height: 30px;
  font-size: 14px;
}

.csfooter {
  width: 100%;
  margin: 200px auto 0;
  text-align: center;
}
/deep/ .el-button--primary.is-plain{
  color: #fff;
}
.jidumain{
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
  width: 100%;
}
.jidumain .chushi{
  font-size: 18px;
  font-weight: 600;
  margin-left: 20px;
}
.jidumain .jiduclass{
  font-size: 18px;
  font-weight: 600;
  margin-right: 20px;
}
</style>