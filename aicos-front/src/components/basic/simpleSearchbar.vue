<template>
  <div class="huilan-simple-searchbar">
    <el-input
      size="small"
      v-model="text"
      clearable
      :placeholder="placeholder"
      @change="handleChange"
      @clear="doSearch"
    >
      <template v-slot:suffix>
        <i class="el-input__icon el-icon-search" @click="handleIconClick"></i>
      </template>
    </el-input>
  </div>
</template>

<script>
export default {
  name: 'HuilanSimpleSearchbar',
  props: {
    placeholder: {
      type: String
    }
  },
  data() {
    return {
      text: '',
      textChange: false
    }
  },
  methods: {
    handleChange() {
      // 防止在输入后直接点搜索按钮，造成搜索两次
      this.textChange = true;
      this.doSearch();
      setTimeout(()=>{
        this.textChange = false;
      }, 1000)
    },
    handleIconClick() {
      if(!this.textChange) {
        this.doSearch();
      }
    },
    doSearch() {
      this.$emit('search', this.text);
    }
  }
}
</script>

<style lang="scss" scoped>
.huilan-simple-searchbar {
  padding: 20px 20px 10px;

  .el-input__icon {
    color: #070b2d;

    &:hover {
      opacity: 0.5;
    }
  }
}
</style>
