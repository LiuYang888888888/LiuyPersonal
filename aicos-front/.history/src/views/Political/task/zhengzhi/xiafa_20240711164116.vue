<template>
  <basic-container>
    <avue-crud :option="option" :table-loading="loading" :data="data" :page="page" :permission="permissionList"
      :before-open="beforeOpen" v-model="form" ref="crud" @row-update="rowUpdate" @row-save="rowSave" @row-del="rowDel"
      @search-change="searchChange" @search-reset="searchReset" @selection-change="selectionChange"
      @current-change="currentChange" @size-change="sizeChange" @on-load="onLoad">
      <template slot="menuLeft">
        <!-- <el-button type="danger" size="small" icon="el-icon-delete" plain v-if="permission.projectreport_delete"
          @click="handleDelete">删 除
        </el-button> -->
      </template>
      <template v-slot:menu="scope">
        <el-button type="text" size="small" v-if="permissionList.viewBtn"
          @click="comFormMagview(scope.row)">查看
        </el-button>
        <el-button type="text" size="small" v-if="permissionList.editBtn"
          @click="comFormMagedit(scope.row)">编辑
        </el-button>
        <el-button type="text" size="small" v-if="permissionList.delBtn"
          @click="comFormMagdel(scope.row)">删除
        </el-button>
        <el-button type="text" size="small" v-if="permissionList.tzxiafaBtn"
          @click="comFormMagTzxiafa(scope.row)">下发
        </el-button>
        <el-button type="text" size="small" v-if="permissionList.yueduBtn"
          @click="comFormMagYuedu(scope.row)">阅读情况
        </el-button>
        <el-button type="text" size="small" v-if="permissionList.xinxiBtn"
          @click="comFormMagXinxi(scope.row)">信息收集
        </el-button>
      </template>
    </avue-crud>
    <!--任务管理通知阅读情况-->
    <HuilanDialog
      :title="yueduTitle"
      :fullscreen="false"
      width="80%"
      append-to-body
      :visible.sync="yueduShow"
    > 
    <el-table
        :data="tableDatayuedu"
        border
        style="width: 80%;margin: 0 auto;">
        <el-table-column
          align="center"
          label="业务处室"
        >
          <template slot-scope="{ row }">
            <span>{{ row.chushi }}</span>
          </template>
        </el-table-column>

        <el-table-column
          align="center"
          label="阅读状态"
        >
          <template slot-scope="{ row }">
            <span v-if="row.yueduzt == '未读'" style="color: #f00;">{{ row.yueduzt }}</span>
            <span v-else>{{ row.yueduzt }}</span>
          </template>
        </el-table-column>
      </el-table>

      <div class="csfooter">
        <el-button plain @click="closeyuedu">关闭</el-button>
      </div>
    </HuilanDialog>

    <!--任务管理通知信息收集-->
    <HuilanDialog
      :title="xinxiTitle"
      :fullscreen="false"
      width="80%"
      append-to-body
      :visible.sync="xinxiShow"
    > 
    <el-table
        :data="tableDataxinxi"
        border
        style="width: 80%;margin: 0 auto;">
        <el-table-column
          align="center"
          label="标题"
        >
          <template slot-scope="{ row }">
            <span>{{ row.title }}</span>
          </template>
        </el-table-column>

        <el-table-column
          align="center"
          label="上报部门"
        >
          <template slot-scope="{ row }">
            <span>{{ row.part }}</span>
          </template>
        </el-table-column>

        <el-table-column
          align="center"
          label="发布状态"
        >
          <template slot-scope="{ row }">
            <span>{{ row.zt }}</span>
          </template>
        </el-table-column>

        <el-table-column
          align="center"
          label="上报人员"
        >
          <template slot-scope="{ row }">
            <span>{{ row.people }}</span>
          </template>
        </el-table-column>

        <el-table-column
          align="center"
          label="上报时间"
        >
          <template slot-scope="{ row }">
            <span>{{ row.date }}</span>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="操作">
          <template slot-scope="{row}">
            <el-button
              type="primary"
              size="mini"
              @click="xinxiInfo(row)"
            >
              查看详情
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="csfooter">
        <el-button plain @click="closexinxi">关闭</el-button>
      </div>
    </HuilanDialog>
  </basic-container>
</template>

<script>
import { mapGetters } from "vuex";
import {
  getList,
  add,
  remove,
  tijiao
} from "@/api/Political/taskcom";
export default {
  data () {
    return {
      yueduTitle:'阅读情况',
      yueduShow:false,
      tableDatayuedu:[],
      
      xinxiTitle:'信息收集',
      xinxiShow:false,
      tableDataxinxi:[],

      form: {},
      query: {},
      loading: true,
      page: {
        pageSize: 10,
        currentPage: 1,
        total: 0
      },
      selectionList: [],
      option: {
        height: 'auto',
        align: 'center',
        calcHeight: 210,
        searchShow: true,
        searchMenuSpan: 6,
        tip: false,
        border: true,
        index: true,
        indexLabel:'序号',
        indexWidth:100,
        viewBtn: false,
        delBtn:false,
        editBtn:false,
        selection: true,
        labelPosition: 'left',
        labelSuffix: '：',
        labelWidth: 120,
        gutter: 0,
        submitBtn: true,
        submitText: '提交',
        emptyBtn: true,
        emptyText: '清空',
        menuPosition: 'center',
        column: [
          {
            type: 'input',
            label: '标题',
            span: 24,
            display: true,
            hideLabel: false,
            prop: 'biaot',
            isListDisplay: true,
          },
          {
            label: '发布部门',
            span: 24,
            display: false,
            prop: 'fabbm',
          },
          {
            type: 'select',
            label: '发布状态',
            span: 24,
            display: false,
            prop: 'fabzt',
            props: {
              label: 'name',
              value: 'value'
            },
            dicUrl: '/aicos/api/aicos-system/baseDict/getDictItemListByDictCode',
            dicMethod: 'post',
            dicQuery: {
              code: 'fabuzt'
            },
            cascaderItem: [],
          },
          {
            label: '发布人',
            span: 24,
            display: false,
            prop: 'fabr',
          },
          {
            label: '发布时间',
            span: 24,
            display: false,
            prop: 'fabsj',
          },
          {
            type: 'select',
            label: '接收单位',
            dicData: [
              {
                label: '秘书处',
                value: '0'
              },
              {
                label: '发展规划与政策法规处',
                value: '1'
              },
              {
                label: '基础领域统筹处',
                value: '2'
              }
            ],
            cascaderItem: [],
            span: 24,
            display: true,
            props: {
              label: 'label',
              value: 'value'
            },
            hideLabel: false,
            prop: 'jiesdw',
            isListDisplay: true,
            multiple: true,
            hide:true,
          },
          {
            type: 'textarea',
            label: '内容',
            span: 24,
            display: true,
            hideLabel: false,
            prop: 'nar',
            isListDisplay: true,
            hide:true,
          },
          {
            type: 'upload',
            label: '附件',
            span: 24,
            display: true,
            showFileList: true,
            multiple: true,
            limit: 10,
            action: '/aicos/api/aicos-file/miniofile/upload',
            propsHttp: {
              home: '/aicos',
              url: 'newFileName',
              name: 'oldFileName',
              res: 'data',
              fileName: 'file'
            },
            canvasOption: {},
            hideLabel: false,
            prop: 'fuj',
            isListDisplay: true,
            listType: 'text',
            data: {
              fromSystemName: 'base'
            },
            hide:true,
          }
        ],
      },
      data: []
    };
  },
  computed: {
    ...mapGetters(["permission"]),
    permissionList () {
      return {
        tzxiafaBtn: this.vaildData(
          this.permission[`sys-commonForm-dataMag-tzxiafa`],
          false
        ),
        tzxiafaBtn: this.vaildData(
          this.permission[`sys-commonForm-dataMag-tzxiafa`],
          false
        ),
        yueduBtn: this.vaildData(
          this.permission[`sys-commonForm-dataMag-yuedu`],
          false
        ),
        xinxiBtn: this.vaildData(
          this.permission[`sys-commonForm-dataMag-xinxi`],
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
    //任务管理通知下发
    comFormMagTzxiafa(){
      this.$confirm(
        "是否确认下发？",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).then( () => {
        
      })
    },
    //任务管理通知阅读情况
    comFormMagYuedu(){
      this.yueduShow = true
    },
    closeyuedu(){
      this.yueduShow = false
    },
    //任务管理信息收集
    comFormMagXinxi(){
      this.xinxiShow = true
    },
    closexinxi(){
      this.xinxiShow = false
    },
    xinxiInfo(row){
      console.log(row)
    },
    rowSave (row, done, loading) {
      add(row).then(() => {
        done();
        this.onLoad(this.page);
        this.$message({
          type: "success",
          message: "操作成功!"
        });
      }, error => {
        window.console.log(error);
        loading();
      });
    },
    rowUpdate (row, index, done, loading) {
      update(row).then(() => {
        done();
        this.onLoad(this.page);
        this.$message({
          type: "success",
          message: "操作成功!"
        });
      }, error => {
        window.console.log(error);
        loading();
      });
    },
    rowDel (row) {
      this.$confirm("确定将选择数据删除?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          return remove(row.id);
        })
        .then(() => {
          this.onLoad(this.page);
          this.$message({
            type: "success",
            message: "操作成功!"
          });
        });
    },
    handleDelete () {
      if (this.selectionList.length === 0) {
        this.$message.warning("请选择至少一条数据");
        return;
      }
      this.$confirm("确定将选择数据删除?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          return remove(this.ids);
        })
        .then(() => {
          this.onLoad(this.page);
          this.$message({
            type: "success",
            message: "操作成功!"
          });
          this.$refs.crud.toggleSelection();
        });
    },
    beforeOpen (done, type) {
      if (["edit", "view"].includes(type)) {
        getDetail(this.form.id).then(res => {
          this.form = res.data.data;
        });
      }
      done();
    },
    searchReset () {
      this.query = {};
      this.onLoad(this.page);
    },
    searchChange (params, done) {
      this.query = params;
      this.page.currentPage = 1;
      this.onLoad(this.page, params);
      done();
    },
    selectionChange (list) {
      this.selectionList = list;
    },
    selectionClear () {
      this.selectionList = [];
      this.$refs.crud.toggleSelection();
    },
    currentChange (currentPage) {
      this.page.currentPage = currentPage;
    },
    sizeChange (pageSize) {
      this.page.pageSize = pageSize;
    },
    onLoad (page) {
      this.loading = false;
      const dataParam = {
        current: page.currentPage,
        size: page.pageSize,
        ...this.query
      };
      getList(dataParam).then(res => {
        const data = res.data.data;
        this.page.total = data.total;
        this.data = data.records;
        this.loading = false;
        this.selectionClear();
      });
    }
  }
};
</script>

<style></style>
