<template>
  <basic-container>
    <el-form :rules="rules" ref="informationForm" :model="informationForm">
      <el-row style="margin: 0px;">
        <el-col :span="16">
          <el-form-item label="文章标题：" label-width="150" prop="title">
            <el-input style="width: 500px;" :disabled="disableFlag" v-model="informationForm.title" placeholder="请输入文章标题"/>
          </el-form-item>
        </el-col>
        <el-col :span="5"></el-col>
        <el-col :span="3">
          <el-form-item>
            <el-button :disabled="disableFlag" @click="handleNewArticle">发布</el-button>
            <el-button v-if="cancelShow" @click="handleCancel">取消</el-button>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="文章来源：" label-width="150" prop="sourceId">
            <el-input style="width: 300px;" :disabled="disableFlag" v-model="informationForm.sourceId" placeholder="请输入文章来源"/>
          </el-form-item>

        </el-col>
        <el-col :span="4"></el-col>
        <el-col :span="6">
          <el-form-item label="所属栏目：" label-width="150" prop="columnName">
            <el-select
              v-model="informationForm.columnName"
              placeholder="请选择所属栏目"
              size="medium"
              clearable
              ref="select"
              style=""
              :disabled="disableFlag"
            >
              <el-option hidden key="id" :value="informationForm.columnId" :label="informationForm.columnName">
              </el-option>
              <el-tree
                :data="treeData"
                :props="defaultProps"
                @node-click="handleNodeClick"
                :expand-on-click-node="false"
                :check-on-click-node="true"
                accordion
                ref="tree"
                node-key="ID"
                :default-expand-all="false"
              >
                <span slot-scope="{ data }">
                  <span>{{ data.PAGE_NAME }}</span>
                </span>
              </el-tree>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <Editor :value="informationForm.editorData" :disabled="disableFlag" @input="getContent"></Editor>
        </el-col>
      </el-row>
    </el-form>
  </basic-container>
</template>

<script>
import Editor from "./editor.vue"
import {queryPagePList, saveArticle, getById} from "@/api/outSystem/information"

export default {
  name: 'Information',
  components: {
    Editor,
  },
  props: {
    className: {
      type: String,
      default: "",
    },
  },

  mounted() {
    if (this.$route.query.id != undefined) {
      this.informationForm.articleId = this.$route.query.id
      this.getArticleById(this.informationForm.articleId)
    }
    if (this.$route.query.disableFlag != undefined){
      this.disableFlag = this.$route.query.disableFlag
      this.cancelShow = true
    }
  },

  data() {
    return {
      articleInfo:{},
      showLoading: null,
      cloumnId: '',
      rules: {
        title: [
          { required: true, message: "请输入文章标题", trigger: "blur" },
        ],
        sourceId: [
          { required: true, message: "请输入文章来源", trigger: "blur" },
        ],
        columnName: [
          { required: true, message: "请选择文章所属栏目", trigger: "blur" },
        ],
      },
      informationForm:{
        columnId:'',//所属栏目ID
        columnName: '',//所属栏目名称
        title: '',//文章标题
        sourceId:'',//文章来源
        articleId:'',//文章id
        editorData: '',//文章内容
      },

      showFlag: false,
      disableFlag:null,
      cancelShow:false,
      messageText:'',
      // 树形控件数据
      treeData: [],
      defaultProps: {
        children: "children",
        label: "PAGE_NAME",
      },

    }
  },
  watch: {
  },
  methods: {
    getArticleById(id){
      let dataParam = new URLSearchParams()
      dataParam.append("id", id)
      getById(dataParam).then(res=>{
        this.informationForm.columnId = res.data.data.page_id
        this.informationForm.columnName = res.data.data.page_name
        this.informationForm.title = res.data.data.title
        this.informationForm.sourceId = res.data.data.source_id
        this.informationForm.articleId = res.data.data.id
        this.informationForm.editorData = res.data.data.content
      })
    },
    handleCancel(){
      this.$router.push('/outSystem/information/indexList')
    },
    handleNewArticle(){
      this.$refs.informationForm.validate((valid) => {
        if (valid){
          let param = new URLSearchParams()
          param.append("content", this.informationForm.editorData)
          param.append("pageId", this.informationForm.columnId)
          param.append("sourceId", this.informationForm.sourceId)
          param.append("title", this.informationForm.title)
          param.append("id", this.informationForm.articleId)
          if (this.informationForm.articleId){
            this.messageText = '文章修改成功！'
          }else{
            this.messageText = '文章新增成功！'
          }
          this.showLoading = this.$loading({
            lock: true,
            text: "处理中，请稍后...",
            spinner: "el-icon-loading",
          });
          saveArticle(param).then(res=>{
            if(res.status===200){
              this.$message.success(this.messageText)
            }else{
              this.$message.error("出错了，请稍后再试！")
            }
            this.$router.back(-1)
            this.showLoading.close();
          })
        }
      })
    },
    // 结构树点击事件
    handleNodeClick(data) {
      this.informationForm.columnId = data.ID; // select绑定值为点击的选项的value
      this.informationForm.columnName = data.PAGE_NAME; // input中显示值为label
      this.$refs.select.blur(); // 点击后关闭下拉框，因为点击树形控件后select不会自动折叠
    },
    getPageList(){
      queryPagePList().then(res=>{
        this.treeData = res.data.data
      })
    },
    //获取getContent
    getContent(data) {
      this.informationForm.editorData = data;
    },
  },
  created() {
    this.getPageList();
  }
}
</script>

<style scoped lang="scss">
.el-form-item {
  display: flex;
  justify-content: flex-start;
  align-items: center;
}

/deep/.el-input--small .el-input__inner {
  height: 40px;
  line-height: 40px;
}
</style>
