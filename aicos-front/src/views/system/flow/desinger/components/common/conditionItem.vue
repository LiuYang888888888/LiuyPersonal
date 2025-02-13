<template>
  <div class="condition-row">
    <div>
      <el-form-item
        :rules="[{required: true, message: '请选择表单字段'}]"
        :prop="`${propPre}field`"
      >
        <el-input v-if="useInput" v-model="data.field"/>
        <el-select
          v-else
          placeholder="请选择表单字段"
          filterable
          v-model="data.field"
        >
          <el-option v-for="field in canUseFields" :key="field.name" :label="field.displayName" :value="field.name"/>
        </el-select>
      </el-form-item>
    </div>
    <div>
      <el-form-item
        label-width="20px"
        :rules="[{required: true, message: '请选择判断符'}]"
        :prop="`${propPre}operator`"
      >
        <el-select
          placeholder="请选择判断符"
          v-model="data.operator"
        >
          <el-option v-for="op in operatorList" :key="op.value" :label="op.label" :value="op.value"/>
        </el-select>
      </el-form-item>
    </div>
    <div>
      <el-form-item
        label-width="20px"
        :rules="[{required: true, message: '内容不能为空'}]"
        :prop="`${propPre}value`"
      >
        <template v-if="needSelect">
          <el-select
            placeholder="请选择"
            filterable
            v-model="data.value"
          >
            <el-option v-for="op in valList" :key="op.value" :label="op.label" :value="op.value"/>
          </el-select>
        </template>
        <el-input
          v-else
          v-model="data.value"
        ></el-input>
      </el-form-item>
    </div>
    <div v-if="deleteIco">
      <el-button icon="el-icon-delete" size="mini" class="del-btn" @click="handleClick"/>
<!--      <i class="el-icon-delete"></i>-->
    </div>
  </div>
</template>

<script>

export default {
  name: 'ConditionItem',
  props: {
    allFields: {
      type: Array,
      default() {
        return []
      }
    },
    data: Object,
    propPre: {
      type: String,
      default: ''
    },
    deleteIco: {
      type: Boolean,
      default: false
    },
    getFildData: {
      type: Function,
      default() {
        return()=>[]
      }
    },
    useInput: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      canUseFields: this.allFields.filter(item=> !item.name.startsWith('column_')),
      valList: [],
      needSelect: false,
      // operatorList: [
      //   {label: '等于', value: 'eq'},
      //   {label: '不等于', value: 'uneq'},
      //   {label: '包含', value: 'contain'},
      //   {label: '不包含', value: 'uncontain'},
      //   {label: '大于', value: 'gt'},
      //   {label: '大于等于', value: 'gteq'},
      //   {label: '小于', value: 'lt'},
      //   {label: '小于等于', value: 'lteq'}
      // ]
    }
  },
  computed: {
    operatorList() {
      if(this.data.field.startsWith('string_') || this.useInput) {
        return [
          {label: '等于', value: 'eq'},
          {label: '不等于', value: 'uneq'}
          // {label: '包含', value: 'contain'},
          // {label: '不包含', value: 'uncontain'}
        ]
      }else {
        return [
          {label: '等于', value: 'eq'},
          {label: '不等于', value: 'uneq'},
          // {label: '包含', value: 'contain'},
          // {label: '不包含', value: 'uncontain'},
          {label: '大于', value: 'gt'},
          {label: '大于等于', value: 'gteq'},
          {label: '小于', value: 'lt'},
          {label: '小于等于', value: 'lteq'}
        ]
      }
    }
  },
  watch: {
    'data.field': {
      handler(newVal) {
        if(this.useInput) {
          this.handleChange(newVal)
        }
      },
      immediate: true
    }
  },
  methods: {
    async handleChange(newVal) {
      const field = this.allFields.find(item=>item.name === newVal)
      // debugger
      if(field) {
        // 这里先不用缓存，按下方的处理后，保存流程的时候会把list属性一起存到后台
        // if(field.list) {
        //   this.valList = field.list
        //   this.needSelect = true;
        // }else {
        // debugger
        const typeList = ['radio', 'checkbox', 'select', 'cascader', 'tree']
        if(typeList.includes(field.formType) ) {
          const list = await this.getFildData(field.name);
          // 缓存数据
          // field.list = list;
          this.valList = list;
          this.needSelect = true;
        }else {
          this.needSelect = false
        }
        // }
      }
    },
    handleClick() {
      this.$emit('remove', this.data)
    }
  }
}
</script>

<style lang="scss" scoped>
.condition-row {
  display: flex;
}
.del-btn {
  padding: 5px;
  margin-left: 5px;
  margin-top: 3px;
}
</style>
