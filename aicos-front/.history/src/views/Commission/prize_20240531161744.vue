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
      treeDeptId: "0",
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
        menuWidth: 300,
        column: [
          {
            label: "成果登记号",
            prop: "account",
            width:200,
            row:true,
            labelWidth: 100,
            labelPosition:'left',
            formatter: (val /*,value,label*/) => {
              return val.account + "";
            },
          },
          {
            label: "项目名称",
            prop: "realName",
            search: true,
            width:200,
            row:true,
            labelWidth: 80,
            labelPosition:'left',
            formatter: (val /*,value,label*/) => {
              return val.realName + "";
            },
          },
          {
            label: "主要完成人",
            prop: "mobile",
            width: 200,
            row:true,
            labelWidth: 100,
            labelPosition:'left',
          },
          {
            label: "主要完成单位",
            prop: "roles",
            width: 200,
            row:true,
            labelWidth: 120,
            labelPosition:'left',
            type:'select',
          },
          {
            label: "主管部门",
            prop: "mobile",
            search: true,
            width:200,
            row:true,
            labelWidth: 80,
            labelPosition:'left',
            type:'select',
          },
          {
            label: "提名人",
            prop: "status",
            width: 200,
            row:true,
            labelWidth: 80,
            labelPosition:'left',
          },
          {
            label: "密级",
            prop: "isLock",
            type: "select",
            width: 100,
            row:true,
            labelWidth: 80,
            labelPosition:'left',
          },
          {
            label: "提名等级",
            prop: "realName",
            type: "select",
            width:200,
            row:true,
            labelWidth: 80,
            labelPosition:'left',
          },
          {
            label: "提名日期",
            prop: "realName",
            width:200,
            row:true,
            labelWidth: 80,
            labelPosition:'left',
          },
          {
            label: "流程节点",
            prop: "",
            slot: true,
            display: false,
            width:100,
          },
          {
            label: '附件上传',
            prop: 'imgUrl',
            type: 'upload',
            multiple: true,
            hide:true,
            span: 24,
            labelWidth: 80,
            labelPosition:'left',
            propsHttp: {
              url: 'url',
              name: 'name',
              res: 'data'
            },
            action: action
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
