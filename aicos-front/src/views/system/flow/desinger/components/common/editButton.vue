<template>
  <div class="edit-button">
    <el-button
      v-if="!edit"
      size="small"
      @dblclick.native="handleDbClick"
    >{{ value }}</el-button>
    <el-input
      v-else
      ref="input"
      size="small"
      :value="value"
      @input="handleChane"
      @keyup.enter.native="endEdit"
      @blur="endEdit"
    />
  </div>
</template>

<script>
export default {
  name: 'editButton',
  props: {
    size: String,
    value: String
  },
  data() {
    return {
      edit: false
    }
  },
  methods: {
    handleDbClick() {
      this.edit = true
      this.$nextTick(()=> {
        this.$refs.input.focus()
      })
    },
    handleChane(newVal) {
      this.$emit('input', newVal)
    },
    endEdit() {
      this.edit = false
    }
  }
}
</script>

<style lang="scss" scoped>
.edit-button {
  display: inline-block;

  /deep/+ &{
    margin-left: 10px;
  }
}
</style>
