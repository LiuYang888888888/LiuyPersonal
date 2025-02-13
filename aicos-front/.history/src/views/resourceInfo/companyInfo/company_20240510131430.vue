<template>
  <HuilanBasic>
    <HuilanBasicToolbar style="margin-top: 0;">
      <el-button
        type="primary"
        size="small"
        @click="handleAdd"
        >新增</el-button
      >
    </HuilanBasicToolbar>
    <avue-crud
      :option="option"
      :search.sync="search"
      :table-loading="loading"
      :permission="permissionList"
      :data="data"
      ref="crud"
      v-model="form"
      @row-del="rowDel"
      @row-update="rowUpdate"
      @row-save="rowSave"
      :before-open="beforeOpen"
      :page.sync="page"
      @selection-change="selectionChange"
      @search-change="searchChange"
      @current-change="currentChange"
      @size-change="sizeChange"
      @refresh-change="refreshChange"
      @on-load="onLoad"
    >

      <template slot-scope="scope" slot="menu">
        <el-button
          type="text" 
          size="small"
          @click.stop="dictItemMgr(scope.row, scope.index)"
          >形式审查
        </el-button>
      </template>
    </avue-crud>

  </HuilanBasic>
</template>

<script>
import {
  getList,
  remove,
  update,
  getUserAllInfo,
  enableStatus,
  lockStatus,
  resetPassword,
  getBaseUserByAccount,
} from "@/api/system/user";
import { mapGetters } from "vuex";
import departmentAuthorityTree from "@/components/TreeSelect/departmentAuthorityTree";
import TreeSelect from "@/components/TreeSelect";
import { isNull } from "@/util/qsgCommon.js";
import OptOrgCommon from "@/views/optOrg/OptOrgCommon";
let action = 'https://api.avuejs.com/imgupload'
export default {
  components: {
    departmentAuthorityTree,
    OptOrgCommon,
    TreeSelect,
  },
  data() {
    return {
      shencha:false,
      form: {},
      isManager: false,
      search: {},
      selectionList: [],
      query: {},
      loading: true,
      page: {
        pageSize: 10,
        currentPage: 1,
        total: 0,
      },
      init: {
        roleTree: [],
        deptTree: [],
      },
      treeDeptId: "0",
      treeDeptName: "部门目录",
      option: {
        header: false,
        tip: false,
        searchShow: true,
        border:true,
        align:'center',
        menuAlign:'center',
        index: true,
        indexLabel:'编号', 
        indexWidth:100,
        selection: false,
        addBtn: false,
        viewBtn: true,
        delBtn: false,
        // editBtn: true,
        searchMenuSpan:4,
        // dialogClickModal: true,
        // dialogWidth: "40%",
        // dialogType: "drawer",
        // dialogCustomClass: "huilan-drawer-form",
        menuWidth: 300,
        column: [
          {
            label: "单位名称",
            prop: "account",
            width:200,
            row:true,
            labelWidth: 80,
            labelPosition:'left',
            formatter: (val /*,value,label*/) => {
              return val.account + "";
            },
          },
          {
            label: "单位概况",
            prop: "mobile",
            width: 200,
            row:true,
            labelWidth: 80,
            labelPosition:'left',
            type:'textarea',
            minRows:4,
          },
          {
            label: "法人",
            prop: "roles",
            width: 200,
            row:true,
            labelWidth: 80,
            labelPosition:'left',
            type:'select',
          },
          {
            label: "联系人",
            prop: "mobile",
            search: true,
            width:200,
            row:true,
            labelWidth: 80,
            labelPosition:'left',
            type:'select',
          },
          {
            label: "联系方式",
            prop: "status",
            width: 200,
            row:true,
            labelWidth: 80,
            labelPosition:'left',
          },
          {
            label: "邮箱",
            prop: "isLock",
            type: "select",
            width: 100,
            row:true,
            labelWidth: 80,
            labelPosition:'left',
          },
          {
            label: "统一社会信用代码",
            prop: "realName",
            width:200,
            row:true,
            labelWidth: 160,
            labelPosition:'left',
          },
          {
            label: "单位性质",
            prop: "realName",
            width:200,
            row:true,
            labelWidth:80,
            labelPosition:'left',
          },
          {
            label: "成立时间",
            prop: "realName",
            slot: true,
            width:200,
            row:true,
            labelWidth: 80,
            labelPosition:'left',
          },
          {
            label: "注册资本",
            prop: "",
            width:200,
            row:true,
            labelWidth: 80,
            labelPosition:'left',
          },
          {
            label: "人员规模",
            prop: "",
            width:150,
            row:true,
            labelWidth: 80,
            labelPosition:'left',
          },
          {
            label: "军工资质",
            prop: "",
            width:150,
            row:true,
            labelWidth: 80,
            labelPosition:'left',
          },
          {
            label: "保密等级",
            prop: "",
            width:100,
            row:true,
            labelWidth: 80,
            labelPosition:'left',
          },
          {
            label: "所在地",
            prop: "",
            width:100,
            row:true,
            labelWidth: 80,
            labelPosition:'left',
          },
          {
            label: "企业类型",
            prop: "",
            slot: true,
            width:100,
            row:true,
            labelWidth: 80,
            labelPosition:'left',
          },
          {
            label: "所属领域",
            prop: "",
            slot: true,
            width:100,
            row:true,
            labelWidth: 80,
            labelPosition:'left',
          },
        ],
        
      },
      data: [],
      treeItemId: "0",
    };
  },
  watch: {},
  computed: {
    ...mapGetters(["permission"]),
    permissionList() {
      return {
        addBtn: this.vaildData(this.permission.projectmanage_add, false),
        viewBtn: this.vaildData(this.permission.projectmanage_view, true),
        delBtn: this.vaildData(this.permission.projectmanage_delete, true),
        editBtn: this.vaildData(this.permission.projectmanage_edit, true)
      };
    },
  },
  mounted() {},
  methods: {
    initData() {
      this.form.deptId = this.treeDeptId;
      this.form.deptName = this.treeDeptName;
    },
    dictItemMgr(){
      this.shencha = !this.shencha
    },
    rowSave(row, done, loading) {
      row.account = row.account.trim();

      if (!isNull(row.directLeader.user)) {
        row.directLeader = row.directLeader.user[0].account;
      } else {
        row.directLeader = "";
      }
      row.roles = [];
      add(row).then(
        () => {
          // this.initFlag = false;
          this.onLoad(this.page);
          this.$message({
            type: "success",
            message: "操作成功!",
          });
          done();
        },
        (error) => {
          window.console.log(error);
          loading();
        }
      );
    },
    rowUpdate(row, index, done, loading) {
      // row.deptId = row.deptId.join(",");
      // row.roleId = row.roleId.join(",");
      // row.postId = row.postId.join(",");

      if (!isNull(row.directLeader.user)) {
        row.directLeader = row.directLeader.user[0].account;
      } else {
        row.directLeader = "";
      }

      update(row).then(
        () => {
          // this.initFlag = false;
          this.onLoad(this.page);
          this.$message({
            type: "success",
            message: "操作成功!",
          });
          done();
        },
        (error) => {
          window.console.log(error);
          loading();
        }
      );
    },
    rowDel(row) {
      this.$confirm("确定将选择数据删除?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          return remove(row.id);
        })
        .then(() => {
          this.onLoad(this.page);
          this.$message({
            type: "success",
            message: "操作成功!",
          });
        });
    },
    async enable(row) {
      let text = row.status === "1" ? "停用" : "启用";
      try {
        await this.$confirm(`确定将用户${text}?`, {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        });
      } catch (e) {
        return;
      }
      const params = {
        id: row.id,
        status: row.status === "1" ? "0" : "1",
      };
      const { data } = await enableStatus(params);

      if (data.success) {
        this.$message.success("操作成功！");
        this.onLoad(this.page);
      }
    },
    async lock(row) {
      let text = row.isLock === "0" ? "锁定" : "解锁";
      try {
        await this.$confirm(`确定将用户${text}?`, {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        });
      } catch (e) {
        return;
      }
      const params = {
        id: row.id,
        isLock: row.isLock === "1" ? "0" : "1",
      };
      const { data } = await lockStatus(params);

      if (data.success) {
        this.$message.success("操作成功！");
        this.onLoad(this.page);
      }
    },
    async resetPwd(row) {
      const params = {
        account: row.account,
        newPassword: this.$store.state.common.systemParam.defaultPassword,
      };
      const { data } = await resetPassword(params);
      if (data.success) {
        this.$message.success("操作成功！");
        this.onLoad(this.page);
      }
    },
    searchChange(params, done) {
      this.query = params
      this.page.currentPage = 1;
      this.onLoad(this.page, params);
      done();
    },
    selectionChange(list) {
      this.selectionList = list;
    },
    async beforeOpen(done, type) {
      if (type === "add") {
        this.form.directLeader = {
          num: {
            user: { max: 1 },
          },
          user: [],
        };
        this.initData();
      }
      if (["edit", "view"].includes(type)) {
        await getUserAllInfo(this.form.id).then(async (res) => {
          const data = res.data.data;
          Reflect.deleteProperty(data, "tenantId");

          if (!isNull(data.directLeader)) {
            await getBaseUserByAccount({ account: data.directLeader }).then(
              (res) => {
                const dataRes = res.data.data;
                data.directLeader = {
                  num: {
                    user: { max: 1 },
                  },
                  user: [
                    {
                      realName: dataRes.realName,
                      id: dataRes.account,
                      account: dataRes.account,
                    },
                  ],
                };
              }
            );
          } else {
            data.directLeader = {
              num: {
                user: { max: 1 },
              },
              user: [],
            };
          }
          this.form = data;

          // }, 5000)
        });
      }
      done();
    },
    currentChange(currentPage) {
      this.page.currentPage = currentPage;
    },
    sizeChange(pageSize) {
      this.page.pageSize = pageSize;
    },
    refreshChange() {
      this.onLoad(this.page, this.query);
    },
    onLoad(page, params, treeItemId) {
      if (!treeItemId) {
        treeItemId = this.treeDeptId;
      }
      var obj = {
        ...this.query,
      };
      this.loading = true;
      getList(this.page.currentPage, this.page.pageSize, obj, treeItemId).then(
        (res) => {
          const data = res.data.data;
          this.page.total = data.total;
          this.data = data.records;
          this.loading = false;
        }
      );
    },
    handleAdd() {
      this.$refs.crud.rowAdd();
    },
    handleCommand(command, row, index) {
      const crud = this.$refs.crud;
      const cruddActions = ["rowView", "rowEdit", "rowDel"];
      if (cruddActions.includes(command)) {
        crud[command](row, index);
      } else {
        this[command](row, index);
      }
    },
    configColumn() {
      this.$refs.crud.$refs.dialogColumn.columnBox = true;
    },
  },
};
</script>

<style lang="scss">
.box {
  height: 800px;
}

.box .el-scrollbar {
  height: 100%;
}

.box .el-scrollbar__wrap {
  overflow: scroll;
}
</style>
