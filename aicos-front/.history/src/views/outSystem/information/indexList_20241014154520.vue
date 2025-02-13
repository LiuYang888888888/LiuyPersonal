<template>
  <HuilanBasic>
    <div class="armyList">
      <avue-crud :option="option" :table-loading="loading" :data="data" :page="page" :permission="permissionList"
                 :before-open="beforeOpen" v-model="form" ref="crud" @refresh-change="refreshChange"
                 @search-change="searchChange" @search-reset="searchReset" @selection-change="selectionChange"
                 @current-change="currentChange" @size-change="sizeChange" @on-load="onLoad">
        <template slot="content" slot-scope="scope">
          <div class="contentColumn">
            <p v-html="scope.row.content"></p>
          </div>
        </template>

        <template #article_state="scope">
          <el-tag v-if="scope.row.article_state == DRAFT" effect="dark" type="info">草稿</el-tag>
          <el-tag v-if="scope.row.article_state == 2" type="danger">已发布</el-tag>
        </template>
      
        <template slot-scope="scope" slot="menuLeft">
          <el-button v-if="permissionList.addBtn" size="medium" icon="el-icon-plus" type="primary" @click="handleAdd">
            发布
          </el-button>
        </template>
        <template v-slot:menu="scope">
          <el-button type="text" size="small" v-if="permissionList.viewBtn"
                     @click="handleView(scope.row,scope.index)">查看
          </el-button>
          <el-button type="text" size="small" v-if="permissionList.updateBtn && scope.row.article_state === 'DRAFT'"
                     @click="handleUpdate(scope.row,scope.index)">编辑
          </el-button>
          <el-button type="text" size="small" v-if="permissionList.delBtn && scope.row.article_state === 'DRAFT'"
                     @click="handelDel(scope.row)">删除
          </el-button>
        </template>
      </avue-crud>


    </div>
  </HuilanBasic>

</template>

<script>
import {mapGetters} from "vuex";
import {getUserInfoPost} from "@/api/system/user";
const baseUrl = process.env.BASE_URL;
import { queryList, deleteById} from "@/api/outSystem/information"

export default {
  data() {
    const me = this;
    var lianxfs = (rule, value, callback) => {
      const regMobile = /^1(3|4|5|6|7|8|9)\d{9}$/
      if (!regMobile.test(value)) {
        callback(new Error('请输入正确的手机号'))
      } else {
        callback()
      }
    }
    return {
      title:'',
      newImg:`${baseUrl}img/new.png`,
      userInfo: {},
      addressData: [],
      dataJson: {},
      form: {},
      query: {},
      pageId:'',
      loading: true,
      page: {
        pageSize: 10,
        currentPage: 1,
        total: 0,
        pageSizes: [10, 20, 30, 40, 50, 100],
      },

      selectionList: [],
      option: {
        // height: 'auto',
        align: 'center',
        // calcHeight: 1000,
        searchShow: true,
        searchMenuSpan: 6,
        tip: false,
        excelBtn: false,
        border: true,
        addBtn: false,
        editBtn: false,
        delBtn: false,
        index: true,
        indexLabel: '序号',
        viewBtn: false,
        selection: true,
        labelPosition: 'right',
        labelSuffix: '',
        labelWidth: 120,
        gutter: 0,
        submitBtn: true,
        submitText: '提交',
        emptyBtn: true,
        emptyText: '清空',
        menuAlign: 'center',
        menuPosition: 'center',
        isCustom: false,
        column: [
          {
            type: 'input',
            label: '标题',
            span: 24,
            display: true,
            width: 120,
            tree: true,
            overHidden: true,
            hideLabel: false,
            dataType: '',
            prop: 'title',
            isListDisplay: true,
            search: true
          },
          {
            type: 'tree',
            label: '所属栏目',
            span: 24,
            display: true,
            parent: true,
            props: {
              label: 'PAGE_NAME',
              value: 'ID'
            },
            accordion: true,//手风琴模式
            hideLabel: false,
            dataType: 'string',
            prop: 'page_name',
            isListDisplay: true,
            search: true,
            dicMethod: 'post',
            dicUrl: '/aicos/api/aicos-second/member/article/queryPagePList',
            dicQuery: {},
          },
          {
            type: 'select',
            label: '审核状态',
            cascaderItem: [],
            span: 24,
            width: 140,
            display: false,
            props: {
              label: 'name',
              value: 'code'
            },
            hideLabel: false,
            dataType: '',
            prop: 'article_state',
            isListDisplay: true,
            dicUrl: '/aicos/api/aicos-system/baseDict/getDictItemListByDictCode',
            dicMethod: 'post',
            dicQuery: {
              code: 'articleStatus'
            },
            search: false,
            rules: [
              {
                required: true,
                message: '审核状态必须填写'
              }
            ]
          },
          {
            type: 'input',
            label: '信息来源',
            span: 24,
            display: true,
            overHidden: true,
            hideLabel: false,
            dataType: '',
            prop: 'source_id',
            isListDisplay: true,
            search: false
          },
          {
            type: 'input',
            label: '发布者',
            span: 24,
            display: true,
            hideLabel: false,
            dataType: '',
            prop: 'author',
            isListDisplay: true,
            search: true
          },
          {
            type: 'textarea',
            label: '文章正文',
            span: 24,
            display: true,
            hide:true,
            hideLabel: false,
            dataType: '',
            prop: 'content',
            isListDisplay: true,
            search: false
          },
          {
            type: 'datetime',
            label: '发布时间',
            span: 24,
            display: true,
            format: 'yyyy-MM-dd',
            valueFormat: 'yyyy-MM-dd',
            searchDefaultTime: ["00:00:00", "23:59:59"],//搜索框的默认时分秒设置
            hideLabel: false,
            hide: false,
            dataType: 'datetime',
            prop: 'create_date',
            isListDisplay: false,
            searchSpan:8,
            search: true,
            searchRange: true,
          },
        ],
      },
      data: [],

    };
  },
  computed: {
    ...mapGetters(["permission"]),
    permissionList() {
      return {
        addBtn: this.vaildData(
          this.permission["outSystem-information-add"],
          false
        ),
        viewBtn: this.vaildData(
          this.permission["outSystem-information-view"],
          false
        ),
        updateBtn: this.vaildData(
          this.permission[`outSystem-information-update`],
          false
        ),
        delBtn: this.vaildData(
          this.permission[`outSystem-information-del`],
          false
        ),
      };
    },
    ids() {
      let ids = [];
      this.selectionList.forEach(ele => {
        ids.push(ele.id);
      });
      return ids.join(",");
    }
  },
  mounted() {
  },
  created() {
    this.getUserInfo()
  },
  methods: {
    // 获取用户信息
    getUserInfo() {
      getUserInfoPost().then((res) => {
        this.userInfo = res.data.data;
      })
    },
    // 信息发布
    handleAdd() {
      this.$router.push('/outSystem/information/informationAdd');
    },
    handleView(row, index) {
      this.$router.push({name:'informationAdd',query: {id:row.id,disableFlag:true}})
    },
    handleUpdate(row, index) {
      this.$router.push({name:'informationAdd',query: {id:row.id,disableFlag:false}})
    },
    handelDel(row) {
      this.$confirm("确定将选择数据删除?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          const params = new URLSearchParams();
          params.append("id", row.id);
          return deleteById(params);
        })
        .then(() => {
          this.$message({
            type: "success",
            message: "删除成功!",
          });
          this.onLoad(this.page);
        });
    },
    refreshChange() {
      this.onLoad(this.page,  this.title, this.pageId);
    },
    beforeOpen(done, type) {
      if (["add", "edit", "view"].includes(type)) {
        if (type == 'add') {
          this.form.fabz = this.userInfo.account
        }
        this.initData(type);
      }
      done();
    },

    initData(/*type*/) {
    },

    searchReset() {
      this.query = {};
      this.title = '';
      this.pageId = '';
      this.onLoad(this.page);
    },

    searchChange(params, done) {
      console.log("搜索条件",params)
      if (params.title != undefined){
        this.title = params.title
      }else{
        this.title = ''
      }
      if (params.page_name != undefined){
        this.pageId = params.page_name
      }else{
        this.pageId = ''
      }
      this.page.currentPage = 1;
      this.onLoad(this.page);
      done();
    },
    selectionChange(list) {
      this.selectionList = list;
    },
    selectionClear() {
      this.selectionList = [];
      this.$refs.crud.toggleSelection();
    },
    currentChange(currentPage) {
      this.page.currentPage = currentPage;
    },
    sizeChange(pageSize) {
      this.page.pageSize = pageSize;
    },
    onLoad(page) {
      this.loading = false;
      let dataParam = new URLSearchParams()
      dataParam.append("page", page.currentPage)
      dataParam.append("size", page.pageSize)
      dataParam.append("pageId", this.pageId)
      dataParam.append("title", this.title)
      queryList(dataParam).then(res => {

        this.page.total = res.data.data.total;
        this.page.pageSize = res.data.data.size;
        this.page.currentPage = res.data.data.page;
        this.data = res.data.data.data;

        this.loading = false;
        this.selectionClear();
      });
    }
  }
};
</script>

<style>
</style>
