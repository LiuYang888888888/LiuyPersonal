<template>
  <div>
    <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px" class="flow-node-prop-form">
      <el-form-item label="节点名称" prop="name">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <div style="text-align: right">
        <el-button type="text" size="small" @click="addCondition">新增</el-button>
      </div>
      <el-table
        size="small"
        :data="conditionList"
      >
        <el-table-column prop="name" label="分支名称"/>
        <el-table-column label="操作" width="100">
          <template slot-scope="scope">
            <el-button v-if="scope.row.id !== 'other'" @click="edit(scope.row, scope.$index)" type="text" size="small">编辑</el-button>
            <el-button v-if="scope.row.id !== 'other'" @click="remove(scope.row, scope.$index)" type="text" size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-form-item class="submit-bar">
        <el-button type="primary" @click="onSubmit">确定</el-button>
        <el-button @click="onCancel">取消</el-button>
      </el-form-item>
    </el-form>
    <el-dialog
      title="分支"
      :visible.sync="conditionDialogVisible"
      append-to-body
      width="650px"
    >
      <el-form ref="condition" :rules="conditionFormRules" :model="conditionForm" size="small" label-width="80px">
        <el-form-item label="分支名称" prop="name">
          <el-input v-model="conditionForm.name"></el-input>
        </el-form-item>
        <ConditionItem
          :useInput="desinger.type=== 'noForm'"
          :allFields="desinger.formFields"
          :data="conditionForm"
          :getFildData="getFildData"
        />
        <div style="margin-bottom: 15px;">
          <el-button icon="el-icon-circle-plus" size="small" @click="addAnd">且条件</el-button>
        </div>
        <ConditionItem
          v-for="(item, index) in conditionForm.andCondationList"
          :key="index"
          :useInput="desinger.type=== 'noForm'"
          :allFields="desinger.formFields"
          :data="item"
          :getFildData="getFildData"
          :propPre="`andCondationList.${index}.`"
          deleteIco
          @remove="removeAndCondation(index)"
        />
        <div style="margin-bottom: 15px;">
          <el-button icon="el-icon-circle-plus-outline" size="small" @click="addOr">或条件</el-button>
        </div>
        <ConditionItem
          v-for="(item, index) in conditionForm.orCondationList"
          :key="index"
          :useInput="desinger.type=== 'noForm'"
          :allFields="desinger.formFields"
          :data="item"
          :getFildData="getFildData"
          :propPre="`orCondationList.${index}.`"
          deleteIco
          @remove="removeOrCondation(index)"
        />
      </el-form>
      <template v-slot:footer>
        <el-button type="primary" size="small" @click="saveCondition">确定</el-button>
        <el-button size="small" @click="cancelCondition">取消</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import ConditionItem from './common/conditionItem'
import conditionVal from './mixin/conditionVal'
export default {
  name: 'ExclusiveGatewayProp',
  components:{
    ConditionItem
  },
  mixins: [conditionVal],
  inject: ['desinger'],
  data() {
    return {
      form: {
        name: ''
      },
      rules: {
        name: [
          {required: true, message: '请输入节点名称'}
        ]
      },
      conditionList: [
        {name: '其他', id: 'other'}
      ],
      conditionDialogVisible: false,
      conditionForm: {
        name: '',
        field: '',
        operator: 'eq',
        value: '',
        andCondationList: [],
        orCondationList: [],
      },
      conditionFormRules: {
        name: [
          {required: true, message: '请输入分支名称'}
        ]
      }
    }
  },
  watch: {
    'desinger.curNodeSetting': {
      handler(newVal) {
        this.form = newVal
        this.conditionList = newVal.conditionList
      },
      immediate: true
    },
    // 'desinger.formFields': {
    //   handler(newVal) {
    //     let res = {}
    //     newVal.forEach(item => {
    //       res[item.name] = 'edit'
    //     })
    //
    //     this.fieldSetting = Object.assign(this.fieldSetting, res)
    //   },
    //   immediate: true
    // }
  },
  methods: {
    addCondition() {
      this.conditionForm = {
        id: `condition_${Date.now()}`,
        name: '',
        field: '',
        operator: 'eq',
        value: '',
        andCondationList: [],
        orCondationList: [],
      }
      this.conditionDialogVisible = true
      if(this.$refs.condition) {
        setTimeout(()=> {
          this.$refs.condition.clearValidate()
        }, 10)
      }
    },
    addAnd() {
      this.conditionForm.andCondationList.push({
        field: '',
        operator: 'eq',
        value: ''
      })
    },
    removeAndCondation(index) {
      this.conditionForm.andCondationList.splice(index, 1)
    },
    addOr() {
      this.conditionForm.orCondationList.push({
        field: '',
        operator: 'eq',
        value: ''
      })
    },
    removeOrCondation(index) {
      this.conditionForm.orCondationList.splice(index, 1)
    },
    saveCondition() {
      this.$refs.condition.validate(valid => {
        if(valid) {
          const {index, ...others} = this.conditionForm
          if(index) {
            this.conditionList.splice(index, 1, others)
          }else {
            this.conditionList.push(others)
          }
          this.conditionDialogVisible = false
        }
      })
    },
    cancelCondition() {
      this.conditionDialogVisible = false
    },
    edit(row, index) {
      this.conditionForm = this.deepClone(row)
      this.conditionForm.index = index
      this.conditionDialogVisible = true
    },
    remove(row,index) {
      this.conditionList.splice(index, 1)
    },
    onSubmit() {
      const me = this
      this.$refs.form.validate(function(valid) {
        if(valid) {
          const data = {
            ...me.form,
            conditionList: me.conditionList
          }
          me.$emit('close', data)
        }
      })

    },
    onCancel() {
      this.$emit('close',)
    }
  }
}
</script>

<style lang="scss" scoped>
.flow-node-prop-form {
  padding: 0 10px 60px;
}
.submit-bar {
  position: absolute;
  left: 10px;
  bottom: 0;
  margin-bottom: 0;
  padding: 10px 0;
  width: calc(100% - 20px);
  text-align: right;
  background: #fff;
  z-index: 2;
}
</style>
