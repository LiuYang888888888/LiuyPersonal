<template>
  <ul class="basic-list">
    <li v-for="(item, index) in data" :key="item[props.key]" :class="handleCls(item)" @click="clickHandle(item, index)">
      <div>{{ item[props.label] | handleText(item,props.label, formatter)}}</div>
      <div v-if="removeAble"><i class="el-icon-close" @click.stop="handleDel(item, index)"></i></div>
    </li>
  </ul>
</template>
<script>
export default {
  name: 'List',
  props: {
    data: {
      type: Array,
      default() {
        return []
      }
    },
    props: {
      type: Object,
      default() {
        return {
          key: 'id',
          label: 'label'
        }
      }
    },
    formatter: {
      type: Function
    },
    clickSelect: {
      type: Boolean,
      default: false
    },
    // 是否显示删除按钮
    removeAble: {
      type: Boolean,
      default: true
    },
    defaultActive: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      active: this.defaultActive
    }
  },
  filters: {
    handleText(text, item, labelKey, formatter) {
      let res = text;
      if(formatter) {
        res = formatter(text, item, labelKey)
      }

      return res
    }
  },
  methods: {
    clickHandle(item, index) {
      if(this.clickSelect) {
        this.active = item[this.props.key];
      }
      this.$emit('itemClick', item, index)
    },
    handleCls(item) {
      return {
        active: item[this.props.key] == this.active
      }
    },
    handleDel(item, index) {
      this.$emit('itemRemove', item, index)
    }
  }
}
</script>
<style lang="scss">
  .basic-list {
    list-style-type: none;
    margin: 0;
    padding: 0;

    >li {
      padding: 0 10px;
      font-size: 14px;
      line-height: 26px;
      cursor: pointer;
      display: flex;

      &:hover {
        background: #F5F7FA;
      }

      &.active {
        background: #f0f7ff;
        color: #409eff;
      }

      >div:first-child {
        flex: 1;
      }
    }
  }
</style>
