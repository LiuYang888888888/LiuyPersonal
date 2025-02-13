<template>
  <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px" class="flow-node-prop-form">
    <el-form-item label="节点名称" prop="name">
      <el-input v-model="form.name"></el-input>
    </el-form-item>
    <el-form-item label="插件" prop="plugin">
      <el-select v-model="form.plugin">
        <el-option
          v-for="plugin in pluginList"
          :key="plugin.value"
          :value="plugin.value"
          :label="plugin.name"
        />
      </el-select>
    </el-form-item>
    <el-form-item class="submit-bar">
      <el-button type="primary" @click="onSubmit">确定</el-button>
      <el-button @click="onCancel">取消</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import {getDictionary} from '@/api/system/dict'
export default {
  name: 'PluginTaskProp',
  inject: ['desinger'],
  data() {
    return {
      form: {
        name: '',
        plugin: ''
      },
      rules: {
        name: [
          {required: true, message: '请输入节点名称'}
        ],
        plugin: [
          {required: true, message: '请选择插件'}
        ]
      },
      pluginList: []
    }
  },
  watch: {
    'desinger.curNodeSetting': {
      handler(newVal) {
        this.form = newVal
        this.fieldSetting = newVal.fieldSetting
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
    async getPluginList() {
      const {data:{data}} = await getDictionary({code: 'pluginTaskPlugins'})
      this.pluginList = data
    },
    onSubmit() {
      const me = this
      this.$refs.form.validate(function(valid) {
        if(valid) {
          const data = {
            ...me.form
          }
          me.$emit('close', data)
        }
      })

    },
    onCancel() {
      this.$emit('close',)
    }
  },
  mounted() {
    this.getPluginList()
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
