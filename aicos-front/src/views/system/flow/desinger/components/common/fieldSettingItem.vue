<template>
  <div class="field-setting-item">
    <el-form-item :label="data.displayName">
      <el-input disabled/>
    </el-form-item>
    <div class="field-setting-inner">
      <el-radio-group v-model="type" size="small">
        <el-radio-button label="edit">可编辑</el-radio-button>
        <el-radio-button label="visible">仅可见</el-radio-button>
        <el-radio-button label="hidden">隐藏</el-radio-button>
      </el-radio-group>
    </div>
  </div>
</template>

<script>

export default {
  name: 'FieldSettingItem',
  props: {
    data: {
      type: Object
    },
    type: {
      type: String
    }
  },
  watch: {
    type(newVal) {
      this.groupVal = newVal
    },
    groupVal(newVal) {
      this.$emit('change', newVal, this.data.name )
    }
  },
  data() {
    return {
      groupVal: this.type
    }
  },
  methods: {

  }
}
</script>

<style lang="scss" scoped>
.field-setting-item {
  position: relative;
  padding: 5px;

  .field-setting-inner {
    display: none;
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: #9092984d;
  }

  &:hover {
    .field-setting-inner {
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
}
</style>
