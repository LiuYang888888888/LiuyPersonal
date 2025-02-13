<template>
  <el-popover
    ref="popover"
    placement="bottom-end"
    :width="width"
    trigger="click"
    popper-class="adv-search"
    transition="slide-in-down-linear"
    class="adv-search-popover"
  >
    <div class="adv-search__header">
      <h3>{{ title }}</h3>
      <div><i class="adv-search__header__close el-icon-close" @click="handleClose"></i></div>
    </div>
    <div class="adv-search__body">
      <slot></slot>
    </div>
    <div class="adv-search__footer">
      <el-button type="primary" size="small" @click="handleSearch">查询</el-button>
      <el-button type="default" size="small" @click="handleRest">重置</el-button>
      <el-button type="default" size="small" @click="handleClose">关闭</el-button>
    </div>
    <template v-slot:reference>
      <slot name="reference">
        <el-button type="default"><i class="aicosicon aicos-icon-gaojisousuo"></i></el-button>
      </slot>
    </template>
  </el-popover>
</template>

<script>
export default {
  name: 'HuilanBasicAdvSearch',
  props: {
    title: {
      type: String,
      default: '高级查询'
    },
    width: {
      type: String,
      default: '600'
    }
  },
  methods: {
    handleSearch() {
      this.$emit('search')
    },
    handleRest() {
      this.$emit('reset')
    },
    handleClose() {
      this.$refs.popover.doToggle();
      this.$emit('close')
    }
  }
}
</script>
<style>
.slide-in-down-linear-enter-active,.slide-in-down-linear-leave-active {
  transition: opacity .2s linear,transform .2s linear;
}

.slide-in-down-linear-enter,.slide-in-down-linear-leave,.slide-in-down-linear-leave-active {
  opacity: 0;
  transform: translate(0, -20px) scaleY(0);
}
</style>
<style lang="scss" scoped>
.adv-search-popover {
  margin: 0 10px;
}
.adv-search {
  padding: 10px;
}
.adv-search__header {
  display: flex;
  padding: 0 0 10px;
  align-items: center;
  border-bottom: 1px solid #eeeeee;

>h3 {
  margin:0;
  flex: 1;
  font-size: 1em;
  font-weight: 400;
}
}
.adv-search__header__close {
  cursor: pointer;

&:hover {
   color: #0045c8;
 }
}
.adv-search__body {
  padding: 20px 20px 0;
}
.adv-search__footer {
  padding-top: 10px;
  text-align: right;
}
</style>
