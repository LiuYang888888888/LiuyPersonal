<template>
    <div class="Huilan-search" @click.stop>
      <el-tabs v-model="searchType">
        <el-tab-pane label="应用" name="app"></el-tab-pane>
        <el-tab-pane label="文章" name="article"></el-tab-pane>
        <el-tab-pane label="知识" name="knowledge"></el-tab-pane>
        <el-tab-pane label="图片" name="picture"></el-tab-pane>
        <el-tab-pane label="视频" name="video"></el-tab-pane>
        <el-tab-pane label="音频" name="audio"></el-tab-pane>
        <el-tab-pane label="设置" name="setting"></el-tab-pane>
        <el-tab-pane label="帮助" name="help"></el-tab-pane>
      </el-tabs>
      <el-input
        placeholder="请输入关键词"
        prefix-icon="aicosicon aicos-icon-search02"
        v-model="searchText"
      />
      <div class="search-result">
        <el-scrollbar wrap-class="search-result__wrap">
          <component :is="cmp" :searchText="searchText"/>
        </el-scrollbar>
      </div>
    </div>
</template>

<script>
import AppSearch from './appSearch'
export default {
  name: 'index',
  components: {
    AppSearch
  },
  computed: {
    cmp() {
      const map = {
        app: 'AppSearch',
        article: 'AppSearch',
        knowledge: 'AppSearch',
        picture: 'AppSearch',
        video: 'AppSearch',
        audio: 'AppSearch',
        setting: 'AppSearch',
        help: 'AppSearch',
      }
      return map[this.searchType]
    }
  },
  data() {
    return {
      searchType: '',
      searchText:''
    }
  }
}
</script>

<style lang="scss" scoped>
.Huilan-search {
  position: absolute;
  left: 0;
  bottom: 10px;
  width: 580px;
  padding: 5px 30px 0;
  background: #d8e0f5;
  user-select: none;
  z-index: 1000;
  border-radius: 8px;
  overflow: hidden;

  /deep/.el-tabs__nav-wrap::after{
    background: #d8e0f5;
  }

  /deep/.el-input__inner {
    border-radius: 10px;
  }
  /deep/.el-input__prefix {
    left: 10px;
  }

  .search-result {
    padding: 10px 0;
  }

  /deep/ .search-result__wrap {
    max-height: calc(100vh - 300px);
  }


}
</style>
