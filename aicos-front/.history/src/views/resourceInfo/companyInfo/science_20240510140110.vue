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
    <el-upload :auto-upload="false"
               :show-file-list="false"
               action="action"
               :on-change="handleChange"
               style="margin-bottom: 20px;">
      <el-button type="primary">导入</el-button>
    </el-upload>
    <avue-crud
      :option="option"
      :search.sync="search"
      :table-loading="loading"
      :permission="permissionList"
      :data="data"
      ref="crud"
      v-model="form"
      @cell-click="cellClick"
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
        searchShow: false,
        border:true,
        align:'center',
        menuAlign:'center',
        index: true,
        indexLabel:'编号', 
        indexWidth:100,
        selection: false,
        addBtn: false,
        viewBtn: true,
        delBtn: true,
        // editBtn: true,
        searchMenuSpan:4,
        menuWidth: 300,
        column: [
          {
            label: "统一社会信用代码",
            prop: "account",
            width:200,
            row:true,
            labelWidth: 140,
            labelPosition:'left',
            formatter: (val /*,value,label*/) => {
              return val.account + "";
            },
          },
          {
            label: "研发投入",
            prop: "account",
            width: 200,
            row:true,
            labelWidth: 80,
            labelPosition:'left',
            type:'textarea',
            minRows:4,
          },
          {
            label: "专利数量",
            prop: "roles",
            width: 200,
            row:true,
            labelWidth: 80,
            labelPosition:'left',
          },
          {
            label: "年度资产",
            prop: "",
            width:200,
            row:true,
            labelWidth: 80,
            labelPosition:'left',
            formatter: (val ) => {
              val = "详情"
              return val;
            },
          },
          {
            label: "年度利润",
            prop: "",
            width: 200,
            row:true,
            labelWidth: 80,
            labelPosition:'left',
            formatter: (val ) => {
              val = "详情"
              return val;
            },
          },
          {
            label: "奖项",
            prop: "isLock",
            type: "select",
            width: 100,
            row:true,
            labelWidth: 80,
            labelPosition:'left',
          },
          {
            label: "认证",
            prop: "realName",
            width:200,
            row:true,
            labelWidth: 80,
            labelPosition:'left',
          },
          {
            label: "保密等级",
            prop: "realName",
            width:200,
            row:true,
            labelWidth:80,
            labelPosition:'left',
          },
          {
            label: "保密证有效期",
            prop: "realName",
            slot: true,
            width:200,
            row:true,
            labelWidth: 140,
            labelPosition:'left',
          },
          {
            label: "科技创新人员能力",
            prop: "",
            width:200,
            row:true,
            labelWidth: 140,
            labelPosition:'left',
          },
          {
            label: "科技创新设备能力",
            prop: "",
            width:150,
            row:true,
            labelWidth: 140,
            labelPosition:'left',
          },
          {
            label: "科技创新投入能力",
            prop: "",
            width:150,
            row:true,
            labelWidth: 140,
            labelPosition:'left',
          },
          {
            label: "科技创新成果能力",
            prop: "",
            width:100,
            row:true,
            labelWidth: 140,
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
    /*导入*/
    handleChange (file, fileLis) {
      this.$Export.xlsx(file.raw)
        .then(data => {
          this.form = data.results;
        })
    },
    /*单元格点击*/
    cellClick(row, column, cell, event){
      if(column.label == '年度资产'){
        console.log(11111111111)
      }
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
