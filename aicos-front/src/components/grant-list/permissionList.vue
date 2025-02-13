<template>
  <div>
    <PermissionItem
      v-for="(child, curIndex) in data"
      :key="child.id"
      :parent="parent"
      :data="child"
      :checked="defaultCheckedItems"
      :defaultCheckedMenus="defaultCheckedMenus"
      @change="permissionChange($event, curIndex)"
      @manageraiapp="manageraiapp()"
      @setdept="setdept()"
    />
  </div>
</template>

<script>
import PermissionItem from './permissionItem'
export default {
  name: 'permissionList',
  components: {
    PermissionItem
  },
  props: {
    data: {
      type: Array,
      default() {
        return []
      }
    },
    defaultCheckedItems: {
      type: Array,
      default() {
        return []
      }
    },
    defaultCheckedMenus: {
      type: Array,
      default() {
        return []
      }
    },
    parent: {
      type: Function,
      default() {}
    },
    index: {
      type: Number,
      default: -1
    }
  },
  // inject: ['menuSet', 'resourceSet'],
  data() {
    const len = this.data.length
    return {
      checkedAll: new Array(len).fill(false),
      isIndeterminate: new Array(len).fill(false),
      // checkedItems: ['19'],
      permissionChecked: []
    }
  },
  methods: {
    setdept(){
      this.$emit('setdept');
    },
    manageraiapp(){
      this.$emit('manageraiapp');
    },

    permissionChange({checkedItems, checked, isIndeterminate, silent}, index) {
      this.$set(this.permissionChecked, index, checkedItems)
      this.$set(this.checkedAll, index, checked)
      this.$set(this.isIndeterminate, index, isIndeterminate)

      if(silent) {
        return
      }
      const allLength = this.data.length;
      const res = {
        checked: false,
        isIndeterminate: false
      }
      if(this.checkedAll.length === allLength && this.checkedAll.every(item => item === true)) {
        res.checked = true
      }else if(this.isIndeterminate.some(item=> item === true)|| this.checkedAll.some(item => item === true)) {
        res.isIndeterminate = true
      }
      this.$emit('checkedChange', res)

    },
    getCheckedMenus() {
      const menuIds = []
      this.data.forEach((item, i) => {
        if(this.checkedAll[i] || this.isIndeterminate[i]) {
          menuIds.push(item.id)
        }
      })

      return {
        menuIds,
        resourceIds: this.permissionChecked.flat(2)
      }
    }
  }
}
</script>

<style scoped>

</style>
