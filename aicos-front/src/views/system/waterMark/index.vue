<template>
  <HuilanBasic>
    <HuilanBasicToolbar style="margin-top: 0">
      <el-button
        v-if="permissionList.addBtn"
        type="primary"
        size="small"
        @click="handleAdd"
        >新增</el-button
      >
    </HuilanBasicToolbar>
    <HuilanBasicSearchbar
      :model="searchForm"
      :fields="searchFieldList"
      @search="searchChange"
      @reset="searchReset"
    >
      <template v-slot:appendTool>
        <el-button type="default" @click="configColumn"
          ><i class="el-icon-s-operation"></i
        ></el-button>
      </template>
    </HuilanBasicSearchbar>
    <avue-crud
      :option="option"
      :search.sync="query"
      :table-loading="loading"
      :data="data"
      ref="crud"
      v-model="form"
      :permission="permissionList"
      @row-del="rowDel"
      @row-update="rowUpdate"
      @row-save="rowSave"
      :before-open="beforeOpen"
      :page.sync="page"
      @current-change="currentChange"
      @size-change="sizeChange"
      @refresh-change="refreshChange"
      @on-load="onLoad"
    >
      <template v-slot:menu="scope">
        <HuilanBasicActionTool
          :actions="getRowActions(scope.row)"
          @command="handleCommand($event, scope.row, scope.index)"
        />
      </template>
    </avue-crud>
  </HuilanBasic>
</template>

<script>
// import PublishedFormMgr from './publishedForm'
import { mapGetters } from "vuex";
// import { getObjType } from '@/util/util'
import serviceList from "@/config/serviceList";
import { getList, add, update, remove } from "@/api/system/waterMark";
import { getRules } from "@/util/regx";
import { baseURL } from "@/api/common";

export default {
  name: "waterMark",
  components: {
    // PublishedFormMgr
  },
  data() {
    return {
      form: {
        // type: 'system'
      },
      query: {},
      loading: false,
      data: [],
      page: {
        pageSize: 10,
        currentPage: 1,
        total: 0,
      },
      option: {
        tip: false,
        header: false,
        searchShow: true,
        searchMenuSpan: 6,
        border: false,
        index: true,
        addBtn: false,
        // selection: true,
        viewBtn: false,
        editBtn:false,
        delBtn:false,
        // menuWidth: 460,
        dialogClickModal: false,
        // labelWidth: 100,
        dialogWidth: "40%",
        dialogType: "drawer",
        dialogCustomClass: "huilan-drawer-form",
        column: [
          {
            label: "水印名称",
            prop: "name",
            span: 24,
            maxlength: 50,
            showWordLimit: true,
            // search: true,
            rules: [
              {
                required: true,
                message: "请输入水印名称",
                trigger: "blur",
              },
              ...getRules(["charNumHanUnderline"]),
            ],
          },
          {
            label: "水印位置",
            prop: "position",
            span: 24,
            // display: false,
            type: "select",
            dicData: [
              {
                label: "左上",
                value: "LT",
              },
              {
                label: "左中",
                value: "LC",
              },
              {
                label: "左下",
                value: "LB",
              },
              {
                label: "中上",
                value: "CT",
              },
              {
                label: "中",
                value: "C",
              },
              {
                label: "中下",
                value: "CB",
              },
              {
                label: "右上",
                value: "RT",
              },
              {
                label: "右中",
                value: "RC",
              },
              {
                label: "右下",
                value: "RB",
              },
            ],
            value: "RT",
          },
          {
            label: "水印透明度",
            prop: "opacity",
            span: 24,
            // display: false,
            type: "slider",
            min: 0,
            max: 1,
            step: 0.01,
            value: 0.5,
          },
          {
            label: "是否默认",
            prop: "defaultDisplay",
            type: "radio",
            span: 24,
            // search: true,
            // addDisplay: false,
            // editDisplay: false,
            dicData: [
              {
                label: "是",
                value: "1",
              },
              {
                label: "否",
                value: "0",
              },
            ],
            value: "0",
          },
          {
            label: "水印类型",
            prop: "type",
            type: "radio",
            span: 24,
            // search: true,
            // addDisplay: false,
            // editDisplay: false,
            dicData: [
              {
                label: "图片",
                value: "picture",
              },
              {
                label: "文字",
                value: "word",
              },
            ],
            change: this.typeChange,
            value: "picture",
          },
          {
            label: "水印图片",
            type: "upload",
            listType: "picture-img",
            // showFileList: false,
            // propsHttp: {
            //   res: 'data',
            //   url: 'link',
            // },
            canvasOption: {
              text: " ",
              ratio: 0.1,
            },
            action: `${baseURL}api/${serviceList.file}/miniofile/upload`,
            propsHttp: {
              home: "",
              url: "newFileName",
              name: "oldFileName",
              res: "data",
              fileName: "file",
            },
            data: {
              fromSystemName: "base",
            },
            uploadAfter: this.uploadAfter,
            // tip: '只能上传jpg/png用户头像，且不超过500kb',
            span: 12,
            row: true,
            hide: true,
            prop: "imgUrl",
            rules: [
              {
                required: true,
                message: "请上传水印图片",
                trigger: "blur",
              },
            ],
          },
          {
            label: "水印文字",
            prop: "text",
            maxlength: 50,
            showWordLimit: true,
            span: 24,
            hide: true,
            display: false,
            rules: [
              {
                required: true,
                message: "请输入水印文字",
                trigger: "blur",
              },
              ...getRules(["expectSpecials"]),
            ],
            // addDisplay: false,
            // editDisplay: false
          },
          {
            label: "文字大小(px)",
            prop: "fontSize",
            span: 24,
            type: "number",
            display: false,
            hide: true,
            value: 14,
            // addDisplay: false,
            // editDisplay: false
          },
          {
            label: "文字颜色",
            prop: "fontColor",
            span: 24,
            type: "color",
            display: false,
            hide: true,
            value: "#999",
            // addDisplay: false,
            // editDisplay: false
          },
          {
            label: "描述",
            prop: "remark",
            span: 24,
            type: "textarea",
            align: "right",
            width: 80,
            hide: true,
            maxlength: 100,
            showWordLimit: true,
            rules: getRules(["expectSpecials"]),
          },
        ],
      },
      searchForm: {
        name: "",
      },
      searchFieldList: [
        {
          prop: "name",
          placeholder: "请输入水印名称",
        },
      ],
      designDialogVisible: false,
      curForm: {},
      useableFields: [],
      curFormJson: {},
      versionDialogVisible: false,
    };
  },
  computed: {
    ...mapGetters(["permission"]),
    permissionList() {
      return {
        addBtn: this.vaildData(this.permission["system-watermark-save"], false),
        viewBtn: this.vaildData(
          this.permission["system-watermark-view"],
          false
        ),
        delBtn: this.vaildData(
          this.permission["system-watermark-delete"],
          false
        ),
        editBtn: this.vaildData(
          this.permission["system-watermark-update"],
          false
        ),
      };
    },
  },
  // watch: {
  //   'form.type'(newVal) {
  //     const urlCol = this.findObject(this.option.column, 'url')
  //     if(newVal === 'custom') {
  //       urlCol.display = true
  //       urlCol.rules[0].required = true
  //     }else {
  //       urlCol.display = false
  //       urlCol.rules[0].required = false
  //     }
  //   }
  // },
  methods: {
    // 新增
    handleAdd() {
      this.$refs.crud.rowAdd();
    },
    // 列显隐
    configColumn() {
      this.$refs.crud.$refs.dialogColumn.columnBox = true;
    },
    getRowActions() {
      const map = {
        viewBtn:{
          name:"查看",
          command:'rowView'
        },
        delBtn: {
          name: "删除",
          command: "rowDel",
        },
        editBtn: {
          name: "编辑",
          command: "rowEdit",
        },
      };
      const list = ['viewBtn',"editBtn","delBtn"];
      const actions = [];

      list.forEach((item) => {
        if (this.permissionList[item]) {
          actions.push(map[item]);
        }
      });
      return actions;
    },
    handleCommand(command, row, index) {
      const crud = this.$refs.crud;
      const cruddActions = ["rowView", "rowEdit", "rowDel"];
      if (cruddActions.includes(command)) {
        crud[command](row, index);
      } else {
        this[command](row, index);
      }
    },
    buildSubmitData({
      imgUrl,
      bucketName,
      objectName,
      text,
      fontSize,
      fontColor,
      ...rest
    }) {
      let config = {};
      let content = "";
      if (rest.type === "picture") {
        content = imgUrl;
        config = {
          bucketName,
          objectName,
        };
      } else {
        content = text;
        config = {
          fontSize,
          fontColor,
        };
      }
      return {
        ...rest,
        content,
        config: JSON.stringify(config),
      };
    },
    rowSave(row, done, loading) {
      const data = this.buildSubmitData(row);
      add(data).then(
        () => {
          // 获取新增数据的相关字段
          // const data = res.data.data;
          // row.id = data.id;
          this.$message({
            type: "success",
            message: "操作成功!",
          });
          // 数据回调进行刷新
          this.onLoad(this.page);
          done();
        },
        (error) => {
          window.console.log(error);
          loading();
        }
      );
    },
    rowUpdate(row, index, done, loading) {
      const data = this.buildSubmitData(row);
      update(data).then(
        () => {
          this.$message({
            type: "success",
            message: "操作成功!",
          });
          // 数据回调进行刷新
          this.onLoad(this.page);
          done();
        },
        (error) => {
          window.console.log(error);
          loading();
        }
      );
    },
    rowDel(row, index, done) {
      this.$confirm("确定将选择数据删除?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          return remove(row.id);
        })
        .then(() => {
          this.$message({
            type: "success",
            message: "操作成功!",
          });
          // 数据回调进行刷新
          this.onLoad(this.page);
          done();
        });
    },
    beforeOpen(done, type) {
      // if (["add"].includes(type)) {
      //   // this.form.type = 'system'
      //   this.form.formJson = ''
      // }
      if (["edit", "view"].includes(type)) {
        const config = JSON.parse(this.form.config);
        let temp = {};
        if (this.form.type === "picture") {
          temp = {
            imgUrl: this.form.content,
            ...config,
          };
        } else {
          temp = {
            text: this.form.content,
            ...config,
          };
        }
        Object.assign(this.form, temp);
      }
      done();
    },
    searchReset() {
      this.query = {};
      // this.parentId = 0;
      this.onLoad(this.page);
    },
    searchChange() {
      this.query = {
        ...this.searchForm,
      };
      this.page.currentPage = 1;
      this.onLoad(this.page);
    },
    currentChange(currentPage) {
      this.page.currentPage = currentPage;
    },
    sizeChange(pageSize) {
      this.page.pageSize = pageSize;
    },
    refreshChange() {
      this.onLoad(this.page, this.query);
    },
    onLoad(page, params = {}) {
      const pageConf = {
        current: page.currentPage,
        size: page.pageSize,
      };
      this.loading = true;
      getList(Object.assign(params, this.query, pageConf)).then((res) => {
        const data = res.data.data;
        this.loading = false;
        this.data = data.records;
        this.page.total = data.total;
      });
    },
    // async getUseableFields() {
    //   const {data:{data}} = await getUseableFieldsList()
    //
    //   this.useableFields = data
    // },
    uploadAfter(res, show) {
      this.form.bucketName = res.bucketName;
      this.form.objectName = res.objectName;
      show(res);
    },
    typeChange({ value }) {
      const column = this.option.column;
      column.forEach((item) => {
        if (value === "picture") {
          if (item.prop === "imgUrl") {
            item.display = true;
          }
          if (["text", "fontSize", "fontColor"].includes(item.prop)) {
            item.display = false;
          }
        } else {
          if (item.prop === "imgUrl") {
            item.display = false;
          }
          if (["text", "fontSize", "fontColor"].includes(item.prop)) {
            item.display = true;
          }
        }
      });
    },
  },
};
</script>

<style scoped lang="scss">
.form-design-dialog {
  /deep/ .el-dialog__body {
    height: calc(100% - 120px);
    padding: 0;
  }
}
</style>
