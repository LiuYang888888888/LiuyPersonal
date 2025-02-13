<template>
  <el-collapse v-model="activeCollapse" class="permission-collapse">
    <el-collapse-item v-for="(menu, index) in data" :key="menu.id" :name="menu.id" :disabled="menu.menuList.length == 0">
      <template v-slot:title>
        <PermissionItem :index="index" :parent="provideParent" :data="menu" :checked="defaultCheckedItems"
          :defaultCheckedMenus="defaultCheckedMenus" @change="handleSelfResChange($event, index)"
          @manageraiapp="manageraiapp()" @setdept="setdept()">
          <el-checkbox :indeterminate="isIndeterminate[index]" v-model="checkAll[index]"
            @change="handleCheckAllChange($event, index, menu)">
            {{ menu.menuName }}
          </el-checkbox>
          <template v-if="menu.code === 'visual'">
            <el-button size="mini" @click.stop="setproject()">{{ $t('system.role.manageable') }}</el-button>
          </template>
        </PermissionItem>
      </template>
      <template v-if="needSelf(menu)">
        <PermissionCollapse ref="collapse" style="padding-left: 20px" :index="index" :parent="provideParent"
          :defaultCheckedItems="defaultCheckedItems" :defaultCheckedMenus="defaultCheckedMenus" :data="menu.menuList"
          @checkedChange="handleCheckedChange($event, index, menu)" @manageraiapp="manageraiapp()" @setdept="setdept()" />
      </template>
      <template v-else>
        <PermissionList ref="list" :index="index" :data="menu.menuList" :defaultCheckedItems="defaultCheckedItems"
          :defaultCheckedMenus="defaultCheckedMenus" :parent="provideParent"
          @checkedChange="handleCheckedChange($event, index, menu)" @manageraiapp="manageraiapp()" @setdept="setdept()" />
      </template>
    </el-collapse-item>
  </el-collapse>
</template>

<script>
import PermissionItem from "./permissionItem";
import PermissionList from "./permissionList";
export default {
  name: "PermissionCollapse",
  components: {
    PermissionList,
    PermissionItem,
  },
  props: {
    data: {
      type: Array,
      default () {
        return [];
      },
    },
    parent: {
      type: Function,
      default () { },
    },
    index: {
      type: Number,
      default: -1,
    },
    defaultCheckedItems: {
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
  },
  // inject: ['menuSet', 'resourceSet'],
  data () {
    const len = this.data.length;
    return {
      activeCollapse: "",
      isIndeterminate: new Array(len).fill(false),
      checkeditems: [],
      checkAll: new Array(len).fill(false),
      // 存放当前的权限
      selfRes: [],
      // 存放子项的权限
      childRes: [],
      // permissionChecked: []
    };
  },
  computed: {
    allKeys () {
      return this.data.map((item) => item.id);
    },
  },
  methods: {
    setdept () {
      this.$emit("setdept");
    },
    setproject () {
      this.$emit('setproject');
    },
    manageraiapp () {
      this.$emit("manageraiapp");
    },
    provideParent () {
      return this;
    },
    needSelf (menu) {
      const menuList = menu.menuList;
      const menuLen = menuList.length;
      let flag = false;

      for (let i = 0; i < menuLen; i++) {
        let cur = menuList[i];
        if (cur.menuList.length > 0) {
          flag = true;
          break;
        }
      }

      return flag;
    },
    removeCheckedItem (item) {
      const index = this.checkeditems.indexOf(item);
      if (index > -1) {
        this.checkeditems.splice(index, 1);
      }
    },
    handleCheckAllChange (val, index, data) {
      this.$set(this.isIndeterminate, index, false);
      if (val) {
        this.checkeditems.push(data.id);
        this.childRes = data.menuList.map(() => {
          return {
            checked: true,
            isIndeterminate: false,
          };
        });
      } else {
        this.removeCheckedItem(data.id);
        this.childRes = [];
      }
      const checkedLength = this.checkAll.filter(
        (item) => item === true
      ).length;
      let res = {
        parentIndex: this.index,
        checked: this.checkAll.every((item) => item === true),
        isIndeterminate:
          this.isIndeterminate.some((item) => item === true) ||
          (0 < checkedLength && checkedLength < this.checkAll.length),
      };
      this.$emit("checkedChange", res);
      //
      this.$emit("checkedAllChildren", val, index);
    },
    parentCheckAllEvent (val, parentIndex) {
      if (parentIndex != undefined && parentIndex !== this.index) {
        return;
      }
      this.checkeditems = val ? [...this.allKeys] : [];
      // this.checkAll = val ? this.allKeys.map(item=> true) : [];
      this.checkAll.forEach((item, i) => {
        this.checkAll.splice(i, 1, val);
        this.isIndeterminate.splice(i, 1, false);
      });
      this.$emit("checkedAllChildren", val);
    },
    handleCheckedChange (event, index, data) {
      this.$set(this.childRes, index, event);

      let selfRes = this.selfRes[index];
      if (data.resourceList.length > 0 && !selfRes) {
        selfRes = {
          checked: false,
          isIndeterminate: false,
        };
      }
      // 处理全选状态
      let checkedAll = event.checked;
      if (selfRes) {
        checkedAll = checkedAll && selfRes.checked;
      }
      this.checkAll.splice(index, 1, checkedAll);

      // 处理半选状态
      let isIndeterminate = event.isIndeterminate;
      if (selfRes) {
        isIndeterminate = isIndeterminate || selfRes.isIndeterminate;
        if (!isIndeterminate) {
          if (!checkedAll) {
            isIndeterminate = event.checked || selfRes.checked;
          }
        }
      }
      this.isIndeterminate.splice(index, 1, isIndeterminate);
      if (checkedAll) {
        // 因为事件是再nextTick中触发的，会造成这里data重复的问题,在第一次初始化的时候会有问题
        if (!this.checkeditems.includes(data.id)) {
          this.checkeditems.push(data.id);
        }
        // this.checkeditems.push(data.id);
      } else {
        this.removeCheckedItem(data.id);
      }


      this.$nextTick(() => {
        let len = this.checkeditems.length;
        let eData = {};
        if (len === 0) {
          eData = {
            checked: false,
            isIndeterminate: this.isIndeterminate.some((item) => item === true),
          };
        } else if (len === this.allKeys.length) {
          eData = { checked: true, isIndeterminate: false };
        } else {
          eData = { checked: false, isIndeterminate: true };
        }

        this.$emit("checkedChange", eData);
      });
    },
    handleSelfResChange (event, index) {
      this.$set(this.selfRes, index, event);
      if (event.silent) {
        return;
      }
      let childRes = this.childRes[index];
      // 没有子菜单是
      if (this.data[index].menuList.length == 0) {
        childRes = {
          checked: event.checked,
          isIndeterminate: event.indeterminate,
        };
      } else {
        if (!childRes) {
          childRes = {
            checked: false,
            isIndeterminate: false,
          };
        }
      }
      this.handleCheckedChange(childRes, index, this.data[index]);
    },
    getCheckedMenus () {
      const menuIds = [];
      this.data.forEach((item, i) => {
        if (this.isIndeterminate[i] || this.checkAll[i]) {
          menuIds.push(item.id);
        }
      });
      const refsCollapse = this.$refs.collapse;
      const refsList = this.$refs.list;

      let res = {
        menuIds: menuIds,
        resourceIds: [],
      };
      if (refsCollapse) {
        res = refsCollapse.reduce(({ menuIds, resourceIds }, item) => {
          const temp = item.getCheckedMenus();
          return {
            menuIds: [...menuIds, ...temp.menuIds],
            resourceIds: [...resourceIds, ...temp.resourceIds],
          };
        }, res);
      }
      if (refsList) {
        res = refsList.reduce(({ menuIds, resourceIds }, item) => {
          const temp = item.getCheckedMenus();
          return {
            menuIds: [...menuIds, ...temp.menuIds],
            resourceIds: [...resourceIds, ...temp.resourceIds],
          };
        }, res);
      }
      // 合并自身的权限
      this.selfRes.forEach((item) => {
        if (item) {
          res.resourceIds.push(...item.checkedItems);
        }
      });

      return res;
    },
  },
  mounted () {
    if (this.parent()) {
      this.parent().$on("checkedAllChildren", this.parentCheckAllEvent);
    }
  },
  beforeDestroy () {
    if (this.parent()) {
      this.parent().$off("checkedAllChildren");
    }
  },
};
</script>

<style lang="scss" scoped>
.permission-collapse {
  /deep/ .el-collapse-item {
    &.is-disabled {
      .el-collapse-item__header {
        cursor: default;

        .el-collapse-item__arrow {
          display: none;
        }
      }
    }

    .el-collapse-item__header {
      height: auto;

      .permission-item {
        line-height: 1.769230769230769;
        border-top: none;

        .left-item {
          padding-left: 0;
          border-right: none;
        }
      }
    }
  }

  /deep/ .el-collapse-item__content {
    padding-bottom: 0;
  }

  .permission-collapse {
    border-bottom: none;
  }
}
</style>
