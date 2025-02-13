<template>
  <div class="select-user-container">
    <el-popover width="450" trigger="click">
      <el-tabs v-model="activeTab">
        <el-tab-pane label="人员" name="first">
          <el-container>
            <el-aside width="170px">
              <div style="height: 300px">
                <el-scrollbar>
                  <el-tree
                    :props="deptTreeProps"
                    :load="loadTreeDept"
                    :default-expanded-keys="['0']"
                    :expand-on-click-node="false"
                    node-key="id"
                    lazy
                    ref="usersTree"
                    @node-click="deptNodeClick"
                  >
                  </el-tree>
                </el-scrollbar>
              </div>
            </el-aside>
            <el-main>
              <div style="height: 300px; border-left: 1px solid #e4e7ed">
                <el-scrollbar>
                  <el-table
                    :data="userList"
                    style="width: 100%"
                    size="mini"
                    row-key="id"
                    @row-click="userRowClick"
                    @selection-change="userSelectChange"
                    ref="userTable"
                  >
                    <el-table-column prop="account" label="用户名" />
                    <el-table-column prop="realName" label="姓名" />
                    <el-table-column type="selection" width="55" />
                  </el-table>
                  <el-pagination
                    small
                    background
                    layout="total,->, prev, next"
                    :total="userPage.total"
                    @current-change="userPageChange"
                  />
                </el-scrollbar>
              </div>
            </el-main>
          </el-container>
        </el-tab-pane>
        <el-tab-pane
          label="部门"
          name="sec"
          :disabled="disabledTabs.includes('sec')"
          lazy
        >
          <div style="height: 300px">
            <el-scrollbar>
              <el-tree
                :props="deptTreeProps"
                :load="loadTreeDept"
                :default-expanded-keys="['0']"
                :expand-on-click-node="false"
                :check-strictly="true"
                :check-on-click-node="true"
                node-key="id"
                lazy
                show-checkbox
                class="dept-tree"
                ref="deptTree"
                @check-change="deptCheckChange"
              >
                <!--                <span class="dept-tree-node" slot-scope="{ node, data }">-->
                <!--                  <span>{{ node.label }}</span>-->
                <!--                  <span>-->
                <!--                    <el-checkbox v-model="checked"/>-->
                <!--                  </span>-->
                <!--                </span>-->
              </el-tree>
            </el-scrollbar>
          </div>
          <!--          <div style="border-top: 1px solid #E4E7ED;padding-top: 5px;">-->
          <!--            <el-checkbox v-model="selected.includeChildren">包含子部门</el-checkbox>-->
          <!--          </div>-->
        </el-tab-pane>
        <el-tab-pane
          label="角色"
          name="third"
          :disabled="disabledTabs.includes('third')"
        >
          <div style="height: 300px">
            <el-scrollbar>
              <el-table
                :data="roleList"
                :show-header="false"
                style="width: 100%"
                size="mini"
                row-key="id"
                @row-click="roleRowClick"
                ref="roleTable"
                @selection-change="roleSelectChange"
              >
                <el-table-column prop="roleName" label="名称" />
                <el-table-column type="selection" width="55" />
              </el-table>
              <el-pagination
                small
                background
                layout="total,->, prev, next"
                :total="rolePage.total"
                @current-change="rolePageChange"
              />
            </el-scrollbar>
          </div>
        </el-tab-pane>
        <el-tab-pane
          label="动态"
          name="fourth"
          :disabled="disabledTabs.includes('fourth')"
        >
          <div style="height: 300px">
            <el-checkbox v-model="selected.applicant">申请人</el-checkbox>
            <p class="select-user-tip"></p>
            <el-checkbox v-model="selected.applicantLeader"
              >申请人直属领导</el-checkbox
            >
            <p class="select-user-tip">由单据创建人直属领导审批</p>
            <el-checkbox v-model="selected.submitterLeader"
              >提交人直属领导</el-checkbox
            >
            <p class="select-user-tip">由单据上一节点负责人直属领导审批</p>
          </div>
        </el-tab-pane>
      </el-tabs>
      <i slot="reference" class="select-user el-icon-circle-plus-outline"></i>
    </el-popover>
    <el-tag
      closable
      size="small"
      v-for="item in selected.list"
      :key="item.id"
      @close="removeSelect(item)"
      >{{ item.name }}</el-tag
    >
    <el-tag
      closable
      size="small"
      v-if="selected.applicant"
      @close="removeChecked('applicant')"
      >申请人</el-tag
    >
    <el-tag
      closable
      size="small"
      v-if="selected.applicantLeader"
      @close="removeChecked('applicantLeader')"
      >申请人直属领导</el-tag
    >
    <el-tag
      closable
      size="small"
      v-if="selected.submitterLeader"
      @close="removeChecked('submitterLeader')"
      >提交人直属领导</el-tag
    >
  </div>
</template>

<script>
import { getDeptLazyTree } from "@/api/system/dept";
import { getList } from "@/api/system/user";
import { getList as getRoleList } from "@/api/system/role";
export default {
  name: "selectUser",
  props: {
    value: {
      type: Object,
      default() {
        return {
          list: [],
          includeChildren: false,
          applicant: false,
          applicantLeader: false,
          submitterLeader: false,
        };
      },
    },
    disabledTabs: {
      type: Array,
      default() {
        return [];
      },
    },
    personCharge: {
      type: Function,
      default() {
        return function () {};
      },
    },
  },
  data() {
    return {
      activeTab: "first",
      deptTreeProps: {
        label: "deptName",
        children: "children",
        isLeaf: "leaf",
      },
      treeDeptId: "0",
      userList: [],
      userPage: {
        pageSize: 10,
        currentPage: 1,
        total: 0,
      },
      loading: false,
      rolePage: {
        pageSize: 10,
        currentPage: 1,
        total: 0,
      },
      roleLoading: false,
      roleList: [],
      selected: {
        list: [],
        includeChildren: false,
        applicantLeader: false,
        submitterLeader: false,
      },
      skip: false,
    };
  },
  watch: {
    selected: {
      handler(newVal) {
        const scop = this;
        setTimeout(() => {
          if (newVal.list.length > 0 || newVal.applicant || newVal.submitterLeader || newVal.applicantLeader) {
            scop.personCharge();
          }
        }, 500);
        if (this.skip) {
          this.skip = false;
          return;
        }
        this.skip = true;
        this.$emit("input", newVal);
      },
      deep: true,
    },
    value: {
      handler(newVal) {
        if (this.skip) {
          this.skip = false;
          return;
        }
        this.skip = true;
        this.selected = newVal;
      },
      deep: true,
    },
    dialogVisible: {
      handler(newVal) {
        console.log(newVal);
      },
    },
  },
  methods: {
    loadTreeDept(node, resolve) {
      if (node.level === 0) {
        resolve([{ deptName: "部门目录", id: "0", disable: true }]);
        return;
      }
      const parentId = node.data.id;
      getDeptLazyTree(parentId).then((res) => {
        const data = res.data.data;
        resolve(
          data.map((item) => {
            return {
              ...item,
              leaf: item.isLeaf === "1",
            };
          })
        );

        if (this.activeTab === "sec") {
          this.initDeptSelect(node);
        }
      });
    },
    deptNodeClick(data) {
      this.treeDeptId = data.id;
      this.userPage.currentPage = 1;
      this.loadUserByDeptId();
    },
    loadUserByDeptId(params = {}) {
      if (this.treeDeptId == "0") {
        return;
      }
      this.loading = true;
      getList(
        this.userPage.currentPage,
        this.userPage.pageSize,
        params,
        this.treeDeptId
      ).then((res) => {
        const data = res.data.data;
        this.userPage.total = data.total;
        this.userList = data.records;
        this.loading = false;
        // setTimeout(()=>{
        //
        // }, 100)
        this.$nextTick(() => {
          this.initUserSelect();
        });
      });
    },
    initUserSelect() {
      this.initUserSelecting = true;
      this.userList.forEach((user) => {
        const temp = this.selected.list.find(
          (item) => item.id === user.account
        );
        if (temp) {
          this.$refs.userTable.toggleRowSelection(user, true);
        }
      });
      this.initUserSelecting = false;
    },
    userPageChange(page) {
      this.userPage.currentPage = page;
      this.loadUserByDeptId();
    },
    userRowClick(row) {
      this.$refs.userTable.toggleRowSelection(row);
    },
    userSelectChange(rows) {
      const scop = this;
      setTimeout(() => {
        scop.personCharge();
      }, 500);
      if (this.initUserSelecting) {
        return;
      }
      this.userList.forEach((item) => {
        const index = this.selected.list.findIndex(
          (user) => user.id === item.account
        );
        if (rows.includes(item)) {
          if (index === -1) {
            this.selected.list.push({
              type: "user",
              id: item.account,
              name: item.realName,
            });
          }
        } else {
          if (index > -1) {
            this.selected.list.splice(index, 1);
          }
        }
      });
    },
    initDeptSelect(node) {
      this.initDeptSelecting = true;
      node.childNodes.forEach((dept) => {
        const temp = this.selected.list.find(
          (item) => item.id === dept.data.id
        );
        if (temp) {
          this.$refs.deptTree.setChecked(dept.data.id, true);
        }
      });
      this.initDeptSelecting = false;
    },
    deptCheckChange(node, checked) {
      if (this.initDeptSelecting) {
        return;
      }
      if (checked) {
        this.selected.list.push({
          type: "dept",
          id: node.id,
          name: node.deptName,
        });
      } else {
        const index = this.selected.list.findIndex(
          (item) => item.id === node.id
        );
        this.selected.list.splice(index, 1);
      }
    },
    rolePageChange(page) {
      this.rolePage.currentPage = page;
      this.loadRoleList();
    },
    loadRoleList(params = {}) {
      this.roleLoading = true;
      getRoleList(
        this.rolePage.currentPage,
        this.rolePage.pageSize,
        params
      ).then((res) => {
        const data = res.data.data;
        this.roleList = data.records;
        this.rolePage.total = data.total;
        this.roleLoading = false;
        // setTimeout(()=>{
        //
        // }, 100)
        this.$nextTick(() => {
          this.initRoleSelect();
        });
      });
    },
    initRoleSelect() {
      this.initRoleSelecting = true;
      this.roleList.forEach((role) => {
        const temp = this.selected.list.find((item) => item.id === role.id);
        if (temp) {
          this.$refs.roleTable.toggleRowSelection(role, true);
        }
      });
      this.initRoleSelecting = false;
    },
    roleRowClick(row) {
      this.$refs.roleTable.toggleRowSelection(row);
    },
    roleSelectChange(rows) {
      const scop = this;
      setTimeout(() => {
        scop.personCharge();
      }, 500);
      if (this.initRoleSelecting) {
        return;
      }
      this.roleList.forEach((item) => {
        const index = this.selected.list.findIndex(
          (role) => role.id === item.id
        );
        if (rows.includes(item)) {
          if (index === -1) {
            this.selected.list.push({
              type: "role",
              id: item.id,
              name: item.roleName,
            });
          }
        } else {
          if (index > -1) {
            this.selected.list.splice(index, 1);
          }
        }
      });
    },
    removeSelect(item) {
      let flag = false;
      if (item.type === "user") {
        const curUser = this.userList.find((user) => user.account === item.id);
        if (curUser) {
          flag = true;
          this.$refs.userTable.toggleRowSelection(curUser);
        }
      } else if (item.type === "dept") {
        if (this.$refs.deptTree) {
          const dept = this.$refs.deptTree.getNode(item.id);
          if (dept) {
            flag = true;
            this.$refs.deptTree.setChecked(item.id, false);
          }
        }
      }
      if (item.type === "role") {
        const curRole = this.roleList.find((role) => role.id === item.id);
        if (curRole) {
          flag = true;
          this.$refs.roleTable.toggleRowSelection(curRole);
        }
      }
      if (!flag) {
        const index = this.selected.list.findIndex((sel) => sel.id === item.id);
        this.selected.list.splice(index, 1);
      }
    },
    removeChecked(key) {
      this.selected[key] = false;
    },
  },
  mounted() {
    this.skip = true;
    this.selected = this.value;
    this.loadRoleList();
  },
};
</script>

<style lang="scss" scoped>
.select-user {
  font-size: 1.5em;
  cursor: pointer;
  margin-top: 6px;
  margin-right: 8px;
  &:hover {
    color: #1e9fff;
  }
}
.dept-tree {
  /deep/.el-checkbox {
    order: 1;
  }
  /deep/.el-tree-node__label {
    flex: 1;
  }
}
//.dept-tree-node {
//  flex: 1;
//  display: flex;
//  align-items: center;
//  justify-content: space-between;
//  //font-size: 14px;
//  //padding-right: 8px;
//}
.select-user-tip {
  margin: 5px 0 10px;
  color: #8a979e;
  font-size: 12px;
}
.select-user-container {
  /deep/.el-tag {
    margin-right: 5px;
  }
}
</style>
