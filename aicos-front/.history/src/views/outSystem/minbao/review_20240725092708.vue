<el-dialog :title="ptitle" :visible.sync="dialogQuest" :modal="true" :modal-append-to-body="false" width="60%" :lock-scroll="true">
  <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
    <el-form-item v-for="(item,index) in ruleForm" :key="index">
      <div> <span style="color: #f00;" v-if="item.ismust == 1">*</span>  {{ index+1 }}.  {{item.qcontent}} <span style="color: #409eff;" v-if="item.qtype == 'checkbox'">（多选）</span> <span style="color: #409eff;" v-if="item.qtype == 'radio'">（单选）</span></div>
      <div v-if="item.qtype == 'radio'" class="newradio">
        <el-radio-group v-model="item.answers">
          <el-radio :label="item.id" v-for="(item, index) in item.questionOptionVOList" :key="index"> <span style="display: inline-block;margin-left: 10px;">{{item.name}}</span>  <span style="display: inline-block;margin-left: 10px;">{{ item.optionContent }}</span></el-radio>
        </el-radio-group>
      </div>

      <div v-if="item.qtype == 'checkbox'" class="newradio">
        <el-checkbox-group v-model="item.checkList" :key="index">
          <el-checkbox :label="item.id" v-for="(item, index) in item.questionOptionVOList" :key="index"> <span style="display: inline-block;margin-left: 10px;">{{item.name}}</span> <span style="display: inline-block;margin-left: 10px;">{{ item.optionContent }}</span> </el-checkbox>
        </el-checkbox-group>
      </div>

      <div v-if="item.qtype == 'input'">
        <el-input v-model="item.answers" type="textarea" autosize placeholder="请输入内容" style="width:60%"></el-input>
      </div>
    </el-form-item>
  </el-form>
  <div class="operation">
    <el-button size="mini" type="primary" :loading="true" v-if="!pictLoading">提交中</el-button>
    <el-button size="mini" @click="save" type="primary" v-if="pictLoading">提交</el-button>
    <el-button size="mini" @click="cancle" type="info">取消</el-button>
  </div>
</el-dialog>