<template>
  <el-dialog :title="spid ? '编辑' : '新增'" top="5vh" :visible.sync="dialog" :modal="true" v-if="dialog"
    :before-close="handleDialogClose" width="80%" :lock-scroll="true" :append-to-body="true">
    <div class="mod-menu-home app-container">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm" v-if="dialog">
        <el-form-item label="问卷名称：" prop="pname">
          <el-input v-model="ruleForm.pname" style="width:60%" placeholder="请输入问卷名称" maxlength="100"
            :disabled="look"></el-input>
        </el-form-item>
        <el-form-item label="问卷说明：" prop="descrip">
          <el-input v-model="ruleForm.descrip" style="width:60%" placeholder="请填写问卷说明（200字以内）" type="textarea" :rows="4"
            maxlength="200" :disabled="look"></el-input>
        </el-form-item>
        <el-form-item label="问卷内容：">
          <el-button plain @click="addContent" v-if="!look">+新增内容</el-button>
          <ul class="content-ul">
            <li v-for="(item, index) in questionList" :key="item.id">
              <dl v-if="item.qtype == 'radio'">
                <dt :class="item.ismust == 1 ? 'require' : ''" style="float: left;">{{ index + 1 }}. </dt>
                <dt>{{ item.qcontent }} <span style="color: #af2c30;">（单选）</span></dt>
                <div class="newradio">
                  <el-radio-group v-model="radio[index]">
                    <el-radio :label="index" v-for="(item, index) in item.questionOptionVOList" :key="index">{{
    item.optionContent }}</el-radio>
                  </el-radio-group>
                </div>
              </dl>

              <dl v-if="item.qtype == 'checkbox'">
                <dt :class="item.ismust == 1 ? 'require' : ''" style="float: left;">{{ index + 1 }}. </dt>
                <dt>{{ item.qcontent }} <span style="color: #af2c30;">（多选）</span></dt>
                <div>
                  <el-checkbox-group v-model="checkList[index]" :key="index">
                    <el-checkbox :label="item.optionContent" v-for="(item, index) in item.questionOptionVOList"
                      :key="index"></el-checkbox>
                  </el-checkbox-group>
                </div>
              </dl>

              <dl v-if="item.qtype == 'input'">
                <dt :class="item.ismust == 1 ? 'require' : ''" style="float: left;">{{ index + 1 }}. </dt>
                <dt>{{ item.qcontent }}</dt>
                <el-input v-model="input" placeholder="请输入内容" style="width:60%"></el-input>
              </dl>
              <div class="operation">
                <el-button size="mini" @click="editContent(item)" v-if="!look">编辑</el-button>
                <el-button size="mini" slot="reference" @click="deleteItem(item.id, index)" v-if="!look">删除</el-button>

                <!-- <el-button size="mini" :disabled="index === 0" @click="moveUp(index)">上移</el-button>
                <el-button size="mini" :disabled="index === questionList.length - 1"
                  @click="moveDown(index)">下移</el-button> -->
              </div>
            </li>
          </ul>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :loading="true" v-if="!look && !pictLoading">{{ updateTitle }}</el-button>
          <el-button type="primary" @click="dataFormSubmit" v-if="!look && pictLoading">{{ updateTitle }}</el-button>
          <el-button @click="cancelPage">取消</el-button>
        </el-form-item>
      </el-form>
      <!-- 新增内容弹框 -->
      <el-dialog title="新增内容" :visible.sync="dialogVisible" width="40%" :before-close="cancelDialog"
        :append-to-body="true" v-if="dialogVisible">
        <div>
          <el-form :model="contentForm" :rules="contentrules" ref="contentRuleForm" label-width="100px"
            class="demo-ruleForm" v-if="dialogVisible">
            <el-form-item label="标题：" prop="qcontent">
              <el-input v-model="contentForm.qcontent" maxlength="100"></el-input>
            </el-form-item>
            <el-form-item label="类型：" prop="qtype">
              <el-select v-model="contentForm.qtype" placeholder="请选择类型" style="width:100%" @change="getMarkChange">
                <el-option label="单选" value="radio"></el-option>
                <el-option label="多选" value="checkbox"></el-option>
                <el-option label="文本" value="input"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="是否必填：" prop="ismust">
              <el-radio-group v-model="contentForm.ismust">
                <el-radio label="是" value="1"></el-radio>
                <el-radio label="否" value="0"></el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="选项：" prop="questionOptionVOList"
              v-if="contentForm.qtype == 'checkbox' || contentForm.qtype == 'radio'">
              <el-button plain size="mini" @click="addLine()">+新增选项</el-button>
              <el-table :data="contentForm.questionOptionVOList" style="width: 100%" border class="tableBB">
                <el-table-column label="序号" type="index" width="55" align="center">
                </el-table-column>
                <el-table-column label="选项内容" prop="optionContent" align="left">
                  <template slot-scope="scope">
                    <span v-show="scope.row.isShow">{{ scope.row.optionContent }}</span>
                    <el-input type="text" :placeholder="scope.row.optionContent" v-model="scope.row.optionContent"
                      palceholder="请输入" maxlength="100" />
                  </template>
                </el-table-column>
                <!-- <el-table-column label="互斥" prop="check" align="center" width="55"
                  v-if="contentForm.qtype == 'checkbox'">
                  <template slot-scope="scope">
                    <el-checkbox v-show="!scope.row.isShow" v-model="scope.row.isRepulsion"
                      size="medium "></el-checkbox>
                    <el-checkbox v-show="scope.row.isShow" v-model="scope.row.isRepulsion" size="medium "
                      disabled></el-checkbox>
                  </template>
                </el-table-column> -->
                <el-table-column align="center" label="操作" width="200">
                  <template slot-scope="scope">
                    <!-- <el-button size="mini" type="primary" plain @click="handleEdit(scope.$index, scope.row)"
                      v-show="scope.row.isShow">编辑</el-button> -->
                    <!-- <el-button @click="hold(scope.$index, scope.row)" size="mini" type="success" plain
                      v-show="!scope.row.isShow">保存</el-button> -->
                    <el-button size="mini" plain
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
  </el-dialog>
</template>
<script>
import { questionList, getQuestion, delQuestion, delOption } from "@/api/outSystem/design";
export default {
  data () {
    return {
      // 查询参数
      searchParam: {},
      markData: '',
      title: "新增",//表单新增/编辑
      updateTitle: '立即创建',
      dialogVisible: false,
      input: '',//体重
      radio: {},
      checkList: [],
      ruleForm: {
        pname: '',
        descrip: '',
        questionsVOList: []
      },
      contentForm: {
        questionOptionVOList: [],
      },
      rules: {
        pname: [
          { required: true, message: '请输入模板名称', trigger: 'blur' },
        ],
        descrip: [
          { max: 200, message: '字数限制200以内', trigger: 'blur' }
        ]
      },
      contentrules: {
        qcontent: [
          { required: true, message: '请输入模板名称', trigger: 'blur' },
          { min: 4, message: '长度至少4个字符', trigger: 'blur' }
        ],
        qtype: [
          { required: true, message: '请选择模板类型', trigger: 'change' }
        ],
        ismust: [
          { required: true, message: '请选择是否必填', trigger: 'change' }
        ],
        questionOptionVOList: [
          { required: true, message: '请输入选项', trigger: 'change' }
        ]
      },
      questionList: [],
      pictLoading: true,
    };
  },
  props: {
    dialog: {
      type: Boolean,
      default () {
        return false
      }
    },
    look: {
      type: Boolean,
      default () {
        return false
      }
    },
    spid: {
      type: String,
      default () {
        return ''
      }
    }
  },
  mounted () {},
  methods: {
    clear(){
      this.ruleForm.pname = ''
      this.ruleForm.descrip = ''
      this.ruleForm.questionsVOList = []
    },
    //删除内容
    deleteItem (id, index) {
      if (id) {
        this.$confirm("确定删除?", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            return delQuestion(id);
          })
          .then(() => {
            this.questionList.splice(index, 1);
            this.$message({
              type: "success",
              message: "操作成功!"
            });
          });
      } else {
        this.questionList.splice(index, 1);
      }

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
      if (row.id) {
        this.$confirm("确定删除?", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            return delOption(row.id);
          })
          .then(() => {
            this.contentForm.questionOptionVOList.splice(index, 1);
            this.$message({
              type: "success",
              message: "操作成功!"
            });
          });
      } else {
        this.contentForm.questionOptionVOList.splice(index, 1);
      }
    },
    //新增问题
    addContent () {
      this.contentForm = { questionOptionVOList: [] }
      this.dialogVisible = true
    },
    /* 添加新的一行 (默认是可编辑状态)*/
    addLine () {
      let obj = {
        isShow: false,
        isRepulsion: false
      };
      this.contentForm.questionOptionVOList.push(Object.assign({}, obj));
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
      if (this.contentForm.ismust == 1) {
        this.contentForm.ismust = '是'
      } else {
        this.contentForm.ismust = '否'
      }

      this.dialogVisible = true
    },
    //创建模板
    dataFormSubmit () {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.pictLoading = false
          this.ruleForm.questionsVOList = this.questionList
          const request = this.spid ? questionList(this.ruleForm) : questionList(this.ruleForm)
          request.then(() => {
            this.$message({
              message: this.$t('操作成功！'),
              type: 'success',
              duration: 1500,
              onClose: () => {
                this.$refs.ruleForm.resetFields()
                this.dialog = false;
                this.pictLoading = true
                this.$emit('closespcg')
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
            this.pictLoading = true
          })
        }
      });
    },
    //添加题目
    submitContentForm () {
      this.$refs.contentRuleForm.validate((valid) => {
        if (valid) {
          this.contentForm.ismust = this.contentForm.ismust == '是' ? 1 : 0
          let Obj = { ...this.contentForm }
          if (Obj.id) {
            this.questionList = this.questionList.map(ele => {
              return ele.id == Obj.id ? Obj : ele;
            })
          } else {
            if (Obj.tid) {
              this.questionList = this.questionList.map(ele => {
                return ele.tid == Obj.tid ? Obj : ele;
              })
            } else {
              Obj.tid = parseInt(new Date().getTime() / 1000) + '';
              this.questionList = [...this.questionList, (Object.assign({}, Obj))]
            }
          }

          for (let i = 0; i < this.questionList.length; i++) {
            if (this.questionList[i].qtype == 'input') {
              this.questionList[i].questionOptionVOList = []
            }
            let arr = []
            this.checkList.push(arr)
          }
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
      this.dialog = false;
      this.ruleForm = {
        pname: '',
        descrip: '',
        questionsVOList: []
      },
      this.$emit('closesp')
    },
    //清空大表单
    handleDialogClose () {
      this.$refs.ruleForm.resetFields();
      this.dialog = false;
      this.ruleForm = {
        pname: '',
        descrip: '',
        questionsVOList: []
      },
      this.$emit('closesp')
    },
    //清空题目表单
    cancelDialog () {
      this.$refs.contentRuleForm.resetFields();
      this.dialogVisible = false
    },
    //查看问卷详情
    getRouterValue () {
      if (this.spid) {
        this.title = '编辑'
        this.updateTitle = '保存'
        getQuestion(this.spid).then(res => {
          this.ruleForm = { ...res.data.data }
          res.data.data.questionsVOList.forEach(() => {
            let arr = []
            this.checkList.push(arr)
          });
          this.questionList = res.data.data.questionsVOList
        })
      }
    }
  }
}
</script>

<style scoped lang="scss">
ul {
  list-style: none;
}

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

.el-checkbox-group {
  margin-right: 20px;
}

.el-checkbox {
  display: block;
}

.newradio>.el-radio-group>.el-radio {
  display: block;
  margin-top: 20px;
}

.content-ul {
  max-height: 500px;
  overflow: hidden;
  overflow-y: auto;
}
</style>