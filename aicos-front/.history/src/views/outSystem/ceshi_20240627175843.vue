<template>
  <div class="mod-menu-home app-container">
    <div class="header">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/nursing/template' }">模板管理</el-breadcrumb-item>
        <el-breadcrumb-item>{{ title }}模板</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
      <el-form-item label="模板名称：" prop="name">
        <el-input v-model="ruleForm.name" style="width:60%" placeholder="请输入模板名称"></el-input>
      </el-form-item>
      <el-form-item label="模板类型：" prop="dynamicformTypeId">
        <el-select v-model="ruleForm.dynamicformTypeId" placeholder="请选择模板类型" style="width:60%;">
          <el-option :label="item.name" :value="item.id" v-for="item in typeList"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="模板说明：" prop="remark">
        <el-input v-model="ruleForm.remark" style="width:60%" placeholder="请填写模板说明（200字以内）" type="textarea"
          :rows="4"></el-input>
      </el-form-item>
      <el-form-item label="模板内容：">
        <el-button plain @click="dialogVisible = true">+新增内容</el-button>
        <ol>
          <li v-for="(item, index) in questionList" :key="item.id">
            <dl v-if="item.type == 'radio'">
              <dt :class="item.require ? 'require' : ''">{{ item.title }}</dt>
              <el-radio v-model="radio" :label="index" v-for="(item, index) in item.questionItem" :key="index">{{
          item.content }}</el-radio>
            </dl>
            <dl v-if="item.type == 'checkbox'">
              <dt :class="item.require ? 'require' : ''">{{ item.title }}</dt>
              <el-checkbox-group v-model="checkList" v-for="(item, index) in item.questionItem" :key="index">
                <el-checkbox :label="item.content"></el-checkbox>
              </el-checkbox-group>
            </dl>
            <dl v-if="item.type == 'datetime'">
              <dt :class="item.require ? 'require' : ''">{{ item.title }}</dt>
              <el-date-picker v-model="value1" type="date" placeholder="选择日期" style="width:60%">
              </el-date-picker>
            </dl>
            <dl v-if="item.type == 'input'">
              <dt :class="item.require ? 'require' : ''">{{ item.title }}</dt>
              <el-input v-model="input" placeholder="请输入内容" style="width:60%"></el-input>
            </dl>
            <div class="operation">
              <el-button size="mini" @click="editContent(item)">编辑</el-button>
              <el-popconfirm title="您确定要删除吗" @confirm="deleteItem(index)" style="margin-left:10px;margin-right: 10px;">
                <span slot="reference" style="cursor: pointer;color:#1890FF">
                  <el-button size="mini" slot="reference">删除</el-button>
                </span>
              </el-popconfirm>
              <el-button size="mini" :disabled="index === 0" @click="moveUp(index)">上移</el-button>
              <el-button size="mini" :disabled="index === questionList.length - 1"
                @click="moveDown(index)">下移</el-button>
            </div>
          </li>
        </ol>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="dataFormSubmit">{{ updateTitle }}</el-button>
        <el-button @click="cancelPage">取消</el-button>
      </el-form-item>
    </el-form>
    <!-- 新增内容弹框 -->
    <el-dialog title="新增内容" :visible.sync="dialogVisible" width="40%" @close="cancelDialog">
      <div>
        <el-form :model="contentForm" :rules="contentrules" ref="contentRuleForm" label-width="100px"
          class="demo-ruleForm">
          <el-form-item label="标题：" prop="title">
            <el-input v-model="contentForm.title"></el-input>
          </el-form-item>
          <el-form-item label="类型：" prop="type">
            <el-select v-model="contentForm.type" placeholder="请选择类型" style="width:100%" @change="getMarkChange">
              <el-option label="单选" value="radio"></el-option>
              <el-option label="多选" value="checkbox"></el-option>
              <el-option label="文本" value="input"></el-option>
              <el-option label="日期" value="datetime"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="是否必填：" prop="require">
            <el-radio-group v-model="contentForm.require">
              <el-radio label="是" value="true"></el-radio>
              <el-radio label="否" value="false"></el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="选项：" prop="questionItem"
            v-if="contentForm.type == 'checkbox' || contentForm.type == 'radio'">
            <el-button plain size="mini" @click="addLine()">+新增选项</el-button>
            <el-table :data="contentForm.questionItem" style="width: 100%" border class="tableBB">
              <el-table-column label="序号" type="index" width="55" align="center">
              </el-table-column>
              <el-table-column label="选项内容" prop="content" align="left">
                <template slot-scope="scope">
                  <span v-show="scope.row.isShow">{{ scope.row.content }}</span>
                  <el-input type="text" :placeholder="scope.row.content" v-model="scope.row.content"
                    v-show="!scope.row.isShow" palceholder="请输入" />
                </template>
              </el-table-column>
              <el-table-column label="互斥" prop="check" align="center" width="55" v-if="contentForm.type == 'checkbox'">
                <template slot-scope="scope">
                  <el-checkbox v-show="!scope.row.isShow" v-model="scope.row.isRepulsion" size="medium "></el-checkbox>
                  <el-checkbox v-show="scope.row.isShow" v-model="scope.row.isRepulsion" size="medium "
                    disabled></el-checkbox>
                </template>
              </el-table-column>
              <el-table-column align="center" label="操作" width="200">
                <template slot-scope="scope">
                  <el-button size="mini" type="primary" plain @click="handleEdit(scope.$index, scope.row)"
                    v-show="scope.row.isShow">编辑</el-button>
                  <el-button @click="hold(scope.$index, scope.row)" size="mini" type="success" plain
                    v-show="!scope.row.isShow">保存</el-button>
                  <el-button size="mini" type="danger" plain
                    @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelDialog">取 消</el-button>
        <el-button type="primary" @click="submitContentForm">确 定</el-button>
      </span>
    </el-dialog>
    <el-backtop></el-backtop>
  </div>
</template>
<script>
export default {
  data () {
    return {
      typeList: [],
      pageQuery: {
        pageSize: 10,
        pageNum: 1
      },
      // 查询参数
      searchParam: {
      },
      // 返回参数
      pageVO: {
        list: [],
        total: 0,
        pages: 0
      },
      markData: '',
      DelVisible: false,
      title: "新增",//表单新增/编辑
      updateTitle: '立即创建',
      dialogVisible: false,
      input: '',//体重
      value1: '',//时间选择器
      radio: '1',
      checkList: ['选中且禁用', '复选框 A'],
      ruleForm: {
        isDisabled: true
      },
      contentForm: {
        questionItem: []
      },
      rules: {
        name: [
          { required: true, message: '请输入模板名称', trigger: 'blur' },
        ],
        dynamicformTypeId: [
          { required: true, message: '请选择模板类型', trigger: 'change' }
        ],
        remark: [
          { max: 200, message: '字数限制200以内', trigger: 'blur' }
        ]
      },
      contentrules: {
        title: [
          { required: true, message: '请输入模板名称', trigger: 'blur' },
          { min: 4, message: '长度至少4个字符', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '请选择模板类型', trigger: 'change' }
        ],
        require: [
          { required: true, message: '请选择是否必填', trigger: 'change' }
        ],
        questionItem: [
          { required: true, message: '请输入选项', trigger: 'change' }
        ]
      },
      questionList: [
      ]
    };
  },
  mounted () {
    this.getRouterValue()
    this.getTypePage()
  },
  methods: {
    //删除内容
    deleteItem (index) {
      this.questionList.splice(index, 1);
    },
    /* 编辑题目的选项 */
    handleEdit (index, row) {
      row.isShow = false;
    },
    /* 保存题目的选项 */
    hold (index, row) {
      row.isShow = true;
    },
    /* 删除 */
    handleDelete (index, row) {
      this.contentForm.questionItem.splice(index, 1);
    },
    /* 添加新的一行 (默认是可编辑状态)*/
    addLine () {
      let obj = {
        content: "",
        isShow: false,
        isRepulsion: false
      };
      this.contentForm.questionItem.push(Object.assign({}, obj));
    },
    getTypePage () {
      
    },
    //监听选择框的值
    getMarkChange (value) {
      this.markData = value
    },
    // 上移
    moveUp (index) {
      let questionList = this.questionList
      questionList.splice(index - 1, 1, ...questionList.splice(index, 1, questionList[index - 1]))
    },
    // 下移
    moveDown (index) {
      let questionList = this.questionList
      questionList.splice(index, 1, ...questionList.splice(index + 1, 1, questionList[index]))
    },
    //编辑题目
    editContent (item) {
      this.contentForm = { ...item }
      if (this.contentForm.require == true) {
        this.contentForm.require = '是'
      } else {
        this.contentForm.require = '否'
      }
      console.log(this.contentForm, '点击编辑查看当前表单')
      this.dialogVisible = true
    },
    dataFormSubmit () {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.ruleForm.fields = JSON.stringify(this.questionList)
          console.log(this.ruleForm.fields)
          const request = this.$route.query.id ? api.update(this.ruleForm) : api.save(this.ruleForm)
          request.then(data => {
            this.$message({
              message: this.$t('table.actionSuccess'),
              type: 'success',
              duration: 1500,
              onClose: () => {
                this.$refs.ruleForm.resetFields()
                this.$router.go(-1)
              }
            })
          })
        } else {
          this.$nextTick(() => {
            let isError = document.getElementsByClassName('is-error')
            isError[0].scrollIntoView({
              block: 'center',
              behavior: 'smooth',
            })
          })
        }
      });
    },
    //添加题目
    submitContentForm () {
      this.$refs.contentRuleForm.validate((valid) => {
        if (valid) {
          this.contentForm.require = this.contentForm.require == '是' ? true : false
          let Obj = { ...this.contentForm }
          if (Obj.id) {
            this.questionList = this.questionList.map(ele => {
              return ele.id == Obj.id ? Obj : ele;
            })
          } else {
            Obj.id = Date.now()
            this.questionList = [...this.questionList, (Object.assign({}, Obj))]
          }
          console.log(this.questionList, '当前模板内容')
          this.dialogVisible = false
          this.$refs.contentRuleForm.resetFields();
        } else {
          return false;
        }
      });
    },
    //清空大表单
    cancelPage () {
      this.$refs.ruleForm.resetFields();
      this.$router.go(-1)
    },
    //清空题目表单
    cancelDialog () {
      this.$refs.contentRuleForm.resetFields();
      this.dialogVisible = false
    },
    getRouterValue () {
      if (this.$route.query.id) {
        this.title = '编辑'
        this.updateTitle = '保存'
        // api.getTemplateById(this.$route.query.id).then(res => {
        //   this.ruleForm = { ...res }
        //   this.questionList = JSON.parse(res.fields)
        //   console.log(this.updateTitle, '修改？')
        // })
      }
    }
  }
}
</script>

<style scoped lang="scss">
.require:before {
  content: '* ';
  color: red;
}

::v-deep .tableBB .el-input__inner {
  border: none !important;
}

.operation {
  width: 60%;
  text-align: right;
}

.header {
  padding: 24px;
  font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB, Microsoft YaHei, SimSun, sans-serif;
  font-weight: 400;
  -webkit-font-smoothing: antialiased;
  -webkit-tap-highlight-color: transparent;
  font-size: 18px;
  font-weight: bolder;
}
</style>