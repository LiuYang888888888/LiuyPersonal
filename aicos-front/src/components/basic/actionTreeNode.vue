<template>
  <div class="action-tree-node" :class="data.node.disabled ? 'disabled' : ''">
    <div>{{data.node.label}}</div>
    <div>
      <el-button
        v-for="action in actions"
        :key="action.command"
        type="primary"
        size="mini"
        :icon="action.icon"
        :title="action.name"
        @click.stop="handleClick(action.command)"
      >
        {{actionType === 'icon' ? '' : action.name}}
      </el-button>
    </div>
  </div>
</template>

<script>

export default {
  name: 'HuilanActionTreeNode',
  props: {
    data: {
      type: Object,
      default() {
        return {
          node: {},
          data: {}
        }
      }
    },
    // icon、button
    actionType: {
      type: String,
      default: 'icon'
    },
    actions: {
      type: Array,
      default() {
        return []
      }
    }
  },
  methods: {
    handleClick(command) {
      this.$emit('command', command, this.data);
    }
  }
}
</script>

<style lang="scss" scoped>
.action-tree-node {
  flex: 1;
  display: flex;
  width: 0;

  >div:first-child{
    flex: 1;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  >div:last-child {
    padding-right: 10px;
    display: none;

    /deep/.el-button {
      padding: 3px;
    }
  }

  &:not(.disabled):hover {
    >div:last-child {
      display: block;
    }
  }
  &.disabled {
    opacity: 0.5;
  }
}
</style>
