<template>
  <section class="permission-item">
    <div class="left-item textOver">
      <slot>
        <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">
          {{ data.menuName }}
        </el-checkbox>
      </slot>
    </div>
    <div class="right-item">
      <el-checkbox-group v-if="data.resourceList" v-model="checkeditems" @change="handleCheckedChange">
        <el-checkbox v-for="item in data.resourceList" :label="item.id" :key="item.id">
          {{ item.name }}
        </el-checkbox>
      </el-checkbox-group>
      <span v-if="data.code == 'system-dept'">
        <el-button size="mini" @click.stop="setdept()" style="margin: 8px 0 0 30px">
          {{$t('system.role.manageable')}}
        </el-button>
      </span>
      <span v-if="data.code == 'configure-myApp'">
        <el-button size="mini" @click.stop="manageraiapp()" style="margin: 8px 0 0 30px">{{ $t("system.role.aiAppTitle")
        }}</el-button>
      </span>
    </div>
  </section>
</template>

<script>
export default {
  name: "PermissionItem",
  props: {
    data: {
      type: Object,
      default () {
        return {};
      },
    },
    checked: {
      type: Array,
      default () {
        return [];
      },
    },
    defaultCheckedMenus: {
      type: Array,
      default () {
        return [];
      },
    },
    parent: {
      type: Function,
      default () { },
    },
    // 针对含有子级的数据
    index: {
      type: Number,
      default: -1,
    },
  },
  data () {
    return {
      isIndeterminate: false,
      checkeditems: [],
      checkAll: false,
    };
  },
  computed: {
    resLenth () {
      return this.data.resourceList.length;
    },
    resIds () {
      let res = [];
      //
      if (this.data && this.data.resourceList) {
        res = this.data.resourceList.map((item) => {
          return item.id;
        });
      }

      return res;
    },
  },
  watch: {
    checked: {
      handler (array) {
        if (this.data.resourceList) {
          const children = this.data.resourceList;
          const temp = [];
          children.forEach((item) => {
            const id = item.id;
            if (array.includes(id)) {
              temp.push(id);
            }
          });
          this.checkeditems = temp;
          if (children.length > 0) {
            this.checkAll =
              children.length > 0 && temp.length === children.length;
          } else {
            // 没有功能项时，根据菜单列表中是否含有来判断是否要选中
            this.handleCheckAll();
          }
          this.isIndeterminate =
            temp.length > 0 && temp.length < children.length;
          if (this.checkAll || this.isIndeterminate) {
            this.$emit("change", {
              checkedItems: this.checkeditems,
              checked: this.checkAll,
              isIndeterminate: this.isIndeterminate,
            });
          }
        }
      },
      immediate: true,
    },
  },
  methods: {
    setdept () {
      this.$emit("setdept");
    },
    manageraiapp () {
      this.$emit("manageraiapp");
    },
    handleCheckAllChange (val) {
      this.checkeditems = val ? this.resIds : [];
      this.isIndeterminate = false;

      const data = {
        checkedItems: this.checkeditems,
        checked: val,
        isIndeterminate: false,
      };
      this.$emit("change", data);
    },
    handleCheckedChange (items) {
      //
      const checkedCount = items.length;

      this.checkAll = checkedCount === this.resLenth;
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.resLenth;

      const data = {
        checkedItems: this.checkeditems,
        checked: this.checkAll,
        isIndeterminate: this.isIndeterminate,
      };
      this.$emit("change", data);
    },
    parentCheckAllEvent (val, parentIndex) {
      // 没有功能项
      // if (this.resIds.length == 0) {
      //   return;
      // }
      // // 不在slot title 中
      if (this.index == -1) {
        if (parentIndex != undefined && this.$parent.index !== parentIndex) {
          return;
        }
      } else {
        if (parentIndex != undefined && this.index !== parentIndex) {
          return;
        }
      }
      this.checkeditems = val ? this.resIds : [];
      this.isIndeterminate = false;
      this.checkAll = val;
      const data = {
        checkedItems: this.checkeditems,
        checked: val,
        isIndeterminate: false,
        silent: true,
      };
      this.$emit("change", data);
    },
    // 初始化时处理全选
    handleCheckAll () {
      if (this.resLenth === 0) {
        const parent = this.parent();
        const data = parent.data;
        if (Array.isArray(data) || data.menuList.length === 0) {
          if (this.defaultCheckedMenus.includes(this.data.id)) {
            this.checkAll = true;
          }
        }
      }
    },
  },
  mounted () {
    if (this.parent()) {
      this.parent().$on("checkedAllChildren", this.parentCheckAllEvent);
    }
    // this.handleCheckAll()
  },
  beforeDestroy () {
    if (this.parent()) {
      this.parent().$off("checkedAllChildren");
    }
  },
};
</script>

<style lang="scss" scoped>
.permission-item {
  display: flex;

  border-top: 1px solid #ebeef5;

  .left-item {
    flex: 0 0 auto;
    display: flex;
    width: 170px;
    padding: 10px 0 10px 20px;
    border-right: 1px solid #ebeef5;
    align-items: center;
  }

  .textOver {
    /deep/.el-checkbox__label {
      width: 130px;
      overflow: hidden;
      text-overflow: ellipsis;
      line-height: 24px;
      vertical-align: bottom;
    }

  }

  .right-item {
    padding: 10px 0;

    .el-checkbox {
      margin: 0 0 0 30px;
    }
  }
}
</style>
