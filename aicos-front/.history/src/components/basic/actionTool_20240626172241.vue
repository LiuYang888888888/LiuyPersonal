<template>
  <div>
    <el-button v-for="btn in group.btns" :key="btn.command" type="text" size="small" :disabled="btn.disabled"
      @click.stop="handleClick(btn.command)">{{ btn.name }}
    </el-button>
    <el-dropdown v-if="group.dropList.length > 0" class="more-actions" @command="handleClick">
      <span class="dropdown-link">
        {{ $t('aicosCommon.more') }}<i class="el-icon-arrow-down el-icon--right"></i>
      </span>
      <el-dropdown-menu v-slot="dropdown">
        <el-dropdown-item v-for="item in group.dropList" :key="item.command" :command="item.command"
          :disabled="item.disabled">{{ item.name }}</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>

<script>
export default {
  name: 'HuilanBasicActionTool',
  props: {
    /**
     * item: {
     *   name: '查看',
     *   command: 'view',
     *   disabled: false
     * }
     */
    actions: {
      type: Array,
      default () {
        return []
      }
    },
    limt: {
      type: Number,
      default: 5
    }
  },
  data () {
    return {
    }
  },
  computed: {
    group () {
      let end = this.limt;
      if (this.actions.length > this.limt) {
        end = this.limt - 1
      }
      let btns = this.actions.slice(0, end);
      let dropList = this.actions.slice(end);
      return {
        btns,
        dropList
      }
    }
  },
  methods: {
    handleClick (command) {
      this.$emit('command', command)
    }
  }
}
</script>

<style lang="scss" scoped>
.more-actions {
  margin-left: 10px;
}

.dropdown-link {
  color: #af2c30;
  cursor: pointer;

  &:hover {
    color: #af2c30;
  }
}
</style>
