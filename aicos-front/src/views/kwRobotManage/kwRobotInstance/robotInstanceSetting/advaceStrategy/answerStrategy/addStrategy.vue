<template>
  <avue-form :option="option" v-model="addForm" ref="addFormRef">
    <template slot-scope="{disabled,size}" slot="priority">
      <div>
        <el-input type="number" :size="size" min="1" v-model="addForm.priority"></el-input>
        <p style="margin: 0;color: #c7cad3;font-size: 12px;">只能输入正整数。“1”为最高优先级</p>
      </div>
    </template>
  </avue-form>
</template>

<script>

export default {
  props: {
    type: {
      type: String,
      required: true,
      default: 'add'
    },
    data: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  data() {
    return {
      addForm: {},
      option: {
        column: [
          {
            type: 'input',
            label: '策略名称',
            span: 24,
            display: true,
            prop: 'strategyName',
            maxlength: 50,
            showWordLimit: true,
            required: true,
            rules: [
              {
                required: true,
                message: '请输入策略名称',
              }
            ]
          },
          {
            type: 'number',
            label: '策略优先级',
            span: 24,
            display: true,
            prop: 'priority'
          }
        ],
        labelPosition: 'right',
        labelSuffix: '：',
        labelWidth: 100,
        gutter: 0,
        menuBtn: false,
        submitBtn: false,
        emptyBtn: false,
        menuPosition: 'center',
        tabs: false,
        detail: false
      }
    }
  },
  mounted() {
    if (this.type == 'edit') {
      this.addForm = {
        strategyName: this.data.strategyName,
        priority: this.data.priority,
        id: this.data.id
      }
    }
  }
}
</script>

<style>
</style>
