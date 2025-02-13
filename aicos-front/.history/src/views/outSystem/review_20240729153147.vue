<template>
  <basic-container>
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
      <el-form-item v-for="(item, index) in ruleForm" :key="index">
        <div>
          <span style="color: #f00;" v-if="item.ismust == 1">*</span>
          {{ index + 1 }}. {{ item.qcontent }}
          <span style="color: #409eff;" v-if="item.qtype == 'checkbox'">（多选）</span>
          <span style="color: #409eff;" v-if="item.qtype == 'radio'">（单选）</span>
        </div>
        <div v-if="item.qtype == 'radio'" class="newradio">
          <el-radio-group v-model="item.answers">
            <el-radio :label="item.id" v-for="(item, index) in item.questionOptionVOList" :key="index">
              <span style="display: inline-block;margin-left: 10px;">{{ item.name }}</span>
              <span style="display: inline-block;margin-left: 10px;">{{ item.optionContent }}</span>
            </el-radio>
          </el-radio-group>
        </div>

        <div v-if="item.qtype == 'checkbox'" class="newradio">
          <el-checkbox-group v-model="item.checkList" :key="index">
            <el-checkbox :label="item.id" v-for="(item, index) in item.questionOptionVOList" :key="index">
              <span style="display: inline-block;margin-left: 10px;">{{ item.name }}</span>
              <span style="display: inline-block;margin-left: 10px;">{{ item.optionContent }}</span>
            </el-checkbox>
          </el-checkbox-group>
        </div>

        <div v-if="item.qtype == 'input'">
          <el-input v-model="item.answers" type="textarea" autosize placeholder="请输入内容" style="width:60%"></el-input>
        </div>
      </el-form-item>
    </el-form>
    <div class="operation" v-if="ruleForm.length > 0 && tj">
      <el-button type="primary" :loading="true" v-if="!pictLoading">提交中</el-button>
      <el-button @click="save" type="primary" v-if="pictLoading">提交</el-button>
      <el-button @click="cancle" type="info">取消</el-button>
    </div>

  </basic-container>
</template>

<script>
import { mapGetters } from "vuex";
import { getUser, getQuestionDetail, getQuestion, submitQuestion } from "@/api/outSystem/design";
export default {
  data () {
    return {
      dialogTableVisible:false,
      dialogQuest:false,
      tj:false,
      ruleForm:[],
      checkList:[],
      Eng:['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'],
      savezt:true,
      saveArr:[],
      pictLoading:true,
      ptitle:''
    };
  },
  created () {

  },
  destroyed () {

  },
  mounted () {
    this.getUser()
  },
  computed: {
    ...mapGetters(["permission"]),
  },
  methods: {
    //获取是否提交
    async getUser () {
      let res = await getUser()
      if (res.data.code === 200) {
        this.tj = res.data.data
        getQuestionDetail(1).then(result => {
          if (result.data.code == 200) {
            getQuestion(result.data.data.id).then(question => {
              this.ptitle = question.data.data.pname
              question.data.data.questionsVOList.forEach(e => {
                e.checkList = []
                e.answers = ''
                if (e.questionOptionVOList.length > 0) {
                  e.questionOptionVOList.forEach((e1, i) => {
                    e1.name = this.Eng[i]
                  });
                }
              });
              this.ruleForm = question.data.data.questionsVOList
            })
          }
        })
      }
    },
    //提交调查问卷
    save () {
      this.saveArr = []
      try {
        this.ruleForm.forEach(e => {
          if (e.ismust == 1) {
            if (e.qtype == 'checkbox') {
              if (e.checkList.length == 0) {
                this.savezt = false
                throw new Error('End Loop')
              } else {
                this.savezt = true
                e.answers = e.checkList.join(',')
              }
            } else {
              if (!e.answers) {
                this.savezt = false
                throw new Error('End Loop')
              } else {
                this.savezt = true
              }
            }
          } else {
            if (e.qtype == 'checkbox') {
              if (e.checkList.length > 0) {
                e.answers = e.checkList.join(',')
              }
            }
          }

          let obj = {
            answers: e.answers,
            pid: e.pid,
            qid: e.id,
            qtype: e.qtype,
          }
          this.saveArr.push(obj)
        })
      } catch (e) {
        if (e.message === 'End Loop') throw e
      }

      if (this.savezt) {
        this.pictLoading = false
        submitQuestion({ userQuestionList: this.saveArr }).then(res => {
          if (res.data.code == 200) {
            this.$message({
              message: '提交成功',
              type: 'success'
            });
            this.pictLoading = true
            this.dialogQuest = false
            this.getUser()
          } else {
            this.$message({
              message: '提交失败',
              type: 'warning'
            });
            this.pictLoading = true
          }
        })
      } else {
        this.$message({
          message: '缺少必填项',
          type: 'warning',
        });
      }
    },
    //调查问卷
    handleQuest () {
      this.dialogQuest = true
    },
    cancle () {
      this.dialogQuest = false
    }
  }
};
</script>

<style scoped>
.search-list {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  margin-bottom: 20px;
}

.search-tj {
  margin-top: 20px;
  margin-left: 20px;
}

.title-int {
  width: 200px;
}

.searchdiv {
  width: 100%;
}

.searchBtn {
  display: flex;
  width: 200px;
  margin: 20px auto;
}

.cell {
  text-align: center;
}

.block {
  width: 80%;
  margin: 40px auto 20px;
}

.el-date-editor.el-input,
.el-date-editor.el-input__inner {
  width: 150px !important;
}

/deep/ .el-select>.el-input {
  width: 120px !important;
}

.search-title {
  display: flex;
  width: 400px;
}

.biaoti {
  width: 100px;
  line-height: 40px;
  text-align: right;
}

.searchBtnadd {
  display: flex;
  width: 200px;
  margin: 20px 0px 20px 20px;
}

.tablelist {
  margin-top: 40px;
  width: 100%;
  max-height: 500px;
  overflow: hidden;
  overflow-y: auto;
}

.tabletitle {
  width: 100%;
  font-size: 18px;
  margin-bottom: 20px;
  font-weight: 600;
}
.operation{
  width: 100%;
  text-align: center;
}
</style>
