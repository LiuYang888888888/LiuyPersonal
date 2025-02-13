<template>
  <basic-container>
    <avue-crud :option="option" :table-loading="loading" :data="data" :page="page" :permission="permissionList"
      :before-open="beforeOpen" v-model="form" ref="crud" @row-update="rowUpdate" @row-save="rowSave" @row-del="rowDel"
      @search-change="searchChange" @search-reset="searchReset" @selection-change="selectionChange"
      @current-change="currentChange" @size-change="sizeChange" @on-load="onLoad" :upload-preview="uploadPreview" :upload-after="uploadAfter">
      <template slot="menuLeft">
        <!-- <el-button type="danger" size="small" icon="el-icon-delete" plain v-if="permission.projectreport_delete"
          @click="handleDelete">删 除
        </el-button> -->
      </template>
      <template v-slot:menu="scope">
        <el-button type="text" size="small" v-if="permissionList.viewBtn"
          @click="comFormMagview(scope.row,scope.index)">查看
        </el-button>
        <el-button type="text" size="small" v-if="permissionList.editBtn && scope.row.fabzt == 0"
          @click="comFormMagedit(scope.row,scope.index)">编辑
        </el-button>
        <el-button type="text" size="small" v-if="permissionList.delBtn && scope.row.fabzt == 0"
          @click="comFormMagdel(scope.row)">删除
        </el-button>
        <el-button type="text" size="small" v-if="permissionList.tzxiafaBtn && scope.row.fabzt == 0"
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
      :fullscreen="true"
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
            <span>{{ row.xiafbmmc }}</span>
          </template>
        </el-table-column>

        <el-table-column
          align="center"
          label="阅读状态"
        >
          <template slot-scope="{ row }">
            <span v-if="row.yuedzt == 0" style="color: #f00;">未读</span>
            <span v-else>已读</span>
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
      :fullscreen="true"
      width="80%"
      append-to-body
      :visible.sync="xinxiShow"
    > 
      <avue-crud :option="optionSb" :table-loading="loadingSb" :data="dataSb" :page="pageSb" :permission="permissionList"
      :before-open="beforeOpenSb" v-model="formSb" ref="crudSb" @current-change="currentChangeSb" @size-change="sizeChangeSb" 
      @on-load="onLoadSb" :upload-preview="uploadPreviewSb">
        <template v-slot:menu="scope">
          <el-button type="text" size="small" @click="infoview(scope.row,scope.index)">查看
          </el-button>
        </template>
      </avue-crud>
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
  update,
  tijiao,
  danwei,
  yuedu,
  shoubao
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
        selection: false,
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
            dicData: [],
            span: 24,
            display: true,
            props: {
              label: 'deptName',
              value: 'id'
            },
            hideLabel: false,
            prop: 'jiesdwdm',
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
            multiple: false,
            limit: 1,
            action: '/aicos/api/aicos-file/miniofile/upload',
            propsHttp: {
              home: '/aicos',
              url: 'newFileName',
              name: 'objectName',
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
      data: [],
      type:'',


      formSb: {},
      querySb: {},
      loadingSb: true,
      pageSb: {
        pageSize: 10,
        currentPage: 1,
        total: 0
      },
      selectionListSb: [],
      optionSb: {
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
        addBtn:false,
        delBtn:false,
        editBtn:false,
        selection: false,
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
            dicData: [],
            span: 24,
            display: true,
            props: {
              label: 'deptName',
              value: 'id'
            },
            hideLabel: false,
            prop: 'jiesdwdm',
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
            multiple: false,
            limit: 1,
            action: '/aicos/api/aicos-file/miniofile/upload',
            propsHttp: {
              home: '/aicos',
              url: 'newFileName',
              name: 'objectName',
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
      dataSb: [],
    };
  },
  computed: {
    ...mapGetters(["permission"]),
    permissionList () {
      return {
        addBtn: this.vaildData(
          this.permission[`sys-commonForm-dataMag-tzxf-add`],
          false
        ),
        viewBtn: this.vaildData(
          this.permission[`sys-commonForm-dataMag-tzxf-view`],
          false
        ),
        delBtn: this.vaildData(
          this.permission[`sys-commonForm-dataMag-tzxf-del`],
          false
        ),
        editBtn: this.vaildData(
          this.permission[`sys-commonForm-dataMag-tzxf-edit`],
          false
        ),
        tzxiafaBtn: this.vaildData(
          this.permission[`sys-commonForm-dataMag-tzxf-xiafa`],
          false
        ),
        yueduBtn: this.vaildData(
          this.permission[`sys-commonForm-dataMag-tzxf-yuedu`],
          false
        ),
        xinxiBtn: this.vaildData(
          this.permission[`sys-commonForm-dataMag-tzxf-xinxi`],
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
    uploadPreview(file){
      if(this.type == "view"){
        const http = window.location.protocol + "//"
        const url = window.location.host
        const url2 = http + url + file.url
        window.open(url2,'_self')
      }
    },
    //任务管理通知下发
    comFormMagTzxiafa(row){
      this.$confirm(
        "是否确认下发？",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).then( () => {
        return tijiao({id:row.id})
      })
        .then(() => {
          this.onLoad(this.page);
          this.$message({
            type: "success",
            message: "操作成功!"
          });
        });
    },
    //任务管理通知阅读情况
    comFormMagYuedu(row){
      this.yueduShow = true
      const params = new URLSearchParams();
      params.append("id",row.id);
      yuedu(params).then((res) => {
        if(res.data.code == 200){
          this.tableDatayuedu = res.data.data.data
        }else{
          this.$message({
            type: "error",
            message: res.msg
          });
        }
      },error => {
        window.console.log(error);
      });
    },
    closeyuedu(){
      this.yueduShow = false
      this.tableDatayuedu = []
    },
    //任务管理信息收集
    comFormMagXinxi(row){
      this.xinxiShow = true
      this.guanlrwtzid = row.id
    },
    closexinxi(){
      this.xinxiShow = false
    },
    
    comFormMagview(row,index){
      this.$refs.crud.rowView(row, index)
    },
    rowSave (row, done, loading) {
      if(row.fuj.length > 0){
        row.fuj = row.fuj[0].value
      }else{
        row.fuj = ''
      }
      if(row.jiesdwdm){
        row.jiesdwdm = row.jiesdwdm.join(",")
      }
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
    comFormMagedit(row,index){
      this.$refs.crud.rowEdit(row, index);
    },
    rowUpdate (row, index, done, loading) {
      if(Array.isArray(row.fuj)){
        row.fuj = row.fuj[0].value
      }
      if(row.jiesdwdm){
        row.jiesdwdm = row.jiesdwdm.join(",")
      }
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
    comFormMagdel(row){
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

    // handleDelete () {
    //   if (this.selectionList.length === 0) {
    //     this.$message.warning("请选择至少一条数据");
    //     return;
    //   }
    //   this.$confirm("确定将选择数据删除?", {
    //     confirmButtonText: "确定",
    //     cancelButtonText: "取消",
    //     type: "warning"
    //   })
    //     .then(() => {
    //       return remove(this.ids);
    //     })
    //     .then(() => {
    //       this.onLoad(this.page);
    //       this.$message({
    //         type: "success",
    //         message: "操作成功!"
    //       });
    //       this.$refs.crud.toggleSelection();
    //     });
    // },

    beforeOpen (done, type) {
      this.type = type
      danwei().then(res =>{
        const column = this.findObject(this.option.column, "jiesdwdm");
        column.dicData = res.data.data;
      })
      if (["add","edit", "view"].includes(type)) {
        if(type == "edit"){
          this.form.jiesdwdm = this.form.jiesdwdm.split(",")
        }
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
    },


    infoview()
    searchResetSb () {
      this.querySb = {};
      this.onLoadSb(this.pageSb);
    },
    searchChangeSb (params, done) {
      this.query = params;
      this.pageSb.currentPage = 1;
      this.onLoadSb(this.pageSb, params);
      done();
    },
    selectionChangeSb (list) {
      this.selectionListSb = list;
    },
    selectionClearSb () {
      this.selectionListSb = [];
      this.$refs.crudSb.toggleSelection();
    },
    currentChangeSb (currentPage) {
      this.pageSb.currentPage = currentPage;
    },
    sizeChangeSb (pageSize) {
      this.pageSb.pageSize = pageSize;
    },
    onLoadSb (page) {
      this.loadingSb = false;
      const dataParam = {
        current: page.currentPage,
        size: page.pageSize,
        guanlrwtzid:this.guanlrwtzid,
        ...this.query
      };
      shoubao(dataParam).then(res => {
        const data = res.data.data;
        this.pageSb.total = data.total;
        this.dataSb = data.records;
        this.loadingSb = false;
        this.selectionClearSb();
      });
    }
  }
};
</script>

<style>
  .csfooter{
    text-align: center;
    margin-top: 40px;
  }
</style>
