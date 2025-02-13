<template>
  <!--  <el-collapse v-model="activeCollapse" class="permission-collapse">-->
  <!--    <el-collapse-item v-for="(menu, index) in data" :key="menu.id" :name="menu.id">-->
  <!--      <template slot="title">-->
  <!--        <el-checkbox :indeterminate="isIndeterminate[index]" v-model="checkAll[index]" @change="handleCheckAllChange($event, index, menu)">{{ menu.menuName }}</el-checkbox>-->
  <!--      </template>-->
  <!--      <template v-if="menu.menuList">-->
  <!--        <PermissionItem v-for="(child, curIndex) in menu.menuList" :key="child.id" :data="child" :checked="checkeditems" @change="permissionChange($event, curIndex, index, menu)"/>-->
  <!--      </template>-->
  <!--    </el-collapse-item>-->
  <!--  </el-collapse>-->
  <div>
    <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange"
      style="margin-bottom: 10px">{{ $t("system.role.all") }}</el-checkbox>
    <!-- <el-button size="mini" @click="setDept">可管理部门设置</el-button> -->
    <slot name="topmenu"></slot>
    <PermissionCollapse ref="collapse" :parent="provideParent" :data="data" :defaultCheckedItems="defaultCheckedItems"
      :defaultCheckedMenus="defaultCheckedMenus" @checkedChange="checkChange" @manageraiapp="manageraiapp"
      @setdept="setDept" @setproject="setproject" />
    <HuilanDialog :title="$t('system.role.departmentSet')" append-to-body :visible.sync="deptDialogVisible" width="600px">
      <!--      <avue-form ref="deptForm" v-model="form" :option="option" ></avue-form>-->
      <TreeSelect v-if="deptDialogVisible" multiple v-model="deptIds" :showValue="deptNames" :treeOption="treeOption"
        :className="className" />

      <template v-slot:footer>
        <el-button size="small" type="primary" @click="saveDepts">{{ $t("aicosCommon.confirmBtn") }}</el-button>
        <el-button size="small" @click="deptDialogVisible = false">{{ $t("aicosCommon.cancelBtn") }}</el-button>
      </template>
    </HuilanDialog>
    <HuilanDialog :title="$t('system.role.largeScreenSet')" append-to-body :visible.sync="projectDialogVisible"
      width="600px">
      <template v-if="projectDialogVisible">
        <el-select v-model="categoryName" :placeholder="$t('aicosCommon.pleaseSelect')" size="small" multiple
          style="width: 100%">
          <el-option v-for="item in options" :key="item.id" :label="item.categoryName" :value="item.id">
          </el-option>
        </el-select>
      </template>
      <template v-slot:footer>
        <el-button size="small" type="primary" @click="saveProject">{{ $t("aicosCommon.confirmBtn") }}</el-button>
        <el-button size="small" @click="projectDialogVisible = false">{{ $t("aicosCommon.cancelBtn") }}</el-button>
      </template>
    </HuilanDialog>
  </div>
</template>

<script>
import { getDeptLazyTree } from "@/api/system/dept";
import {
  getDeptByRoleId,
  saveRoleDeptRelation,
  categoryList,
  saveCategory
} from "@/api/system/role";
// import serviceList from '@/config/serviceList'

// const { system } = serviceList
// import PermissionItem from './permissionItem'
import PermissionCollapse from "./permissionCollapse";
import TreeSelect from "@/components/TreeSelect";
export default {
  components: {
    // PermissionItem,
    PermissionCollapse,
    TreeSelect,
  },
  props: {
    className: {
      type: String,
      default: "",
    },
    data: {
      type: Array,
      default () {
        return [];
      },
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
    role: {
      type: Object,
      default () {
        return {};
      },
    },
  },
  data () {
    // const me = this;
    return {
      checkAll: false,
      isIndeterminate: false,
      deptDialogVisible: false,
      //
      projectDialogVisible: false,
      options: [],
      categoryName: [],
      //
      selectedDepts: [],
      deptIds: [],
      deptNames: [],
      treeOption: {
        defaultExpandedKeys: ["0"],
        // showCheckbox: true,
        // checkStrictly: true,
        props: {
          label: "deptName",
          isLeaf: "leaf",
          // value: 'id'
        },
        lazy: true,
        key: "id",
        // expandOnClickNode: false,
        load: function (node, resolve) {
          let parentId = node.data && node.data.id;
          if (node.level === 0) {
            // parentId = 0
            resolve([{ deptName: "部门目录", id: "0" }]);
            return;
          }
          // const parentId = node.data.id;
          getDeptLazyTree(parentId).then((res) => {
            const data = res.data.data;
            // setTimeout(()=>{
            resolve(
              data.map((item) => {
                return {
                  ...item,
                  leaf: item.isLeaf === "1",
                };
              })
            );
            // }, 5000)
          });
        },
      },
    };
  },
  // computed: {
  //   newData() {
  //     return [{
  //       id: 'test1',
  //       menuName: '测试层级1',
  //       menuList: [{
  //         id: 'test1-1',
  //         menuName: '测试层级1-1',
  //         menuList: this.data
  //       },{
  //         id: 'test1-2',
  //         menuName: '测试层级1-2',
  //         menuList: []
  //       },{
  //         id: 'test1-3',
  //         menuName: '测试层级1-3',
  //         menuList: []
  //       }]
  //     },{
  //       id: 'test2',
  //       menuName: '测试层级2',
  //       menuList: []
  //     },{
  //       id: 'test3',
  //       menuName: '测试层级3',
  //       menuList: []
  //     }]
  //   }
  // },
  methods: {
    provideParent () {
      return this;
    },
    handleCheckAllChange (val) {
      this.isIndeterminate = false;
      this.checkAll = val;
      this.$emit("checkedAllChildren", val);
    },
    checkChange (data) {
      this.checkAll = data.checked;
      this.isIndeterminate = data.isIndeterminate;
    },
    getSubmitData () {
      const { menuIds, resourceIds } = this.$refs.collapse.getCheckedMenus();
      return {
        menuIds: menuIds.join(),
        resourceIds: resourceIds.join(),
      };
    },
    async setproject () {
      let res = await categoryList(this.role.id);
      if (res.data.success) {
        this.options = res.data.data.list
        this.categoryName = res.data.data.key
      }
      this.projectDialogVisible = true;
    },
    async saveProject () {
      let obj = { roleId: this.role.id, categoryIds: this.categoryName };
      await saveCategory(obj)
      this.$message.success(this.$t("aicosCommon.saveSuccessTip"));
      this.projectDialogVisible = false
    },
    async setDept () {
      await this.getSelectedDept();
      this.deptDialogVisible = true;
    },
    manageraiapp () {
      this.$emit("manageraiapp");
    },
    async saveDepts () {
      const data = {
        roleId: this.role.id,
        list: this.deptIds.map((item) => ({ id: item })),
      };
      await saveRoleDeptRelation(data);
      this.$message.success(this.$t("aicosCommon.saveSuccessTip"));
      this.deptDialogVisible = false;
    },
    async getSelectedDept () {
      const {
        data: { data },
      } = await getDeptByRoleId(this.role.id);
      // this.form.deptIds = data.map(item=>item.deptId).join(',')
      let ids = [];
      let names = [];
      data.forEach(({ id, deptName }) => {
        ids.push(id);
        names.push(deptName);
      });
      this.deptIds = ids;
      this.deptNames = names;
      this.selectedDepts = data;
    },
  },
  // mounted() {
  //   this.getSelectedDept()
  // }
};
</script>

<style lang="scss" scoped>
.permission-collapse {
  /deep/ .el-collapse-item__content {
    padding-bottom: 0;
  }
}
</style>
