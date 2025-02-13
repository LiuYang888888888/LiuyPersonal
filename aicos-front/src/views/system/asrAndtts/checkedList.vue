<template>
  <div class="checkedMain">
    <div class="checkedHead">
      <span>{{title}}</span>
      <el-button
        v-if="( checkedListData.length > 0)"
        style="float: right; padding: 3px; " 
        type="danger"
        icon="el-icon-close"
        circle
        size="mini"
        @click="handleDelAll()"
      ></el-button>
    </div>
    <ul class="checkedList">
      <li v-for="(item, index) in checkedListData" :key="item[props.key]" :class="handleCls(item)" @click="clickHandle(item, index)">
        <div>{{ item[props.label] | handleText(item,props.label, formatter)}}</div>
        <div><i class="el-icon-close" @click.stop="handleDel(item, index)"></i></div>
      </li>
    </ul>
  </div>
</template>
<script>
export default {
  name: 'checkedList',
  props: {
    checkedListData: {
      type: Array,
      default() {
        return []
      }
    },
    title:{
      type: String,
      default: '已选'
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
    }
  },
  data() {
    return {
      active: '',
      checkedListTitle: this.checkedListTitle,
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
      this.$emit('itemRemove', item, index);
    },
    handleDelAll() {
      this.$emit('itemRemoveAll');
    }
  }
}
</script>
<style lang="scss">
  .checkedMain {
    border: 1px solid #dcdfe6;
  }
  .checkedHead {
    height: 39px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #dcdfe6;
    padding: 0 10px;
  }
  .checkedList {
    list-style-type: none;
    margin: 0;
    padding: 0;
    height: 390px;
    overflow-y: auto;
    padding: 5px 0;

    >li {
      padding: 3px 10px 2px;
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
