<template>
  <div style="padding: 5px 30px 0">
    <HuilanBasicToolbar style="margin-top: 0">
      <el-button v-if="permissionList.addBtn" type="primary" size="small" @click="handleAdd">{{ $t("aicosCommon.addBtn")
      }}</el-button>
      <el-button v-if="permission.role_delete" type="danger" size="small" icon="el-icon-delete" @click="handleDelete">{{
        $t("aicosCommon.delBtn") }}
      </el-button>
    </HuilanBasicToolbar>
    <HuilanBasicSearchbar :model="searchForm" :fields="searchFieldList" @search="searchChange">
      <template v-slot:appendTool>
        <el-button type="default" @click="configColumn"><i class="el-icon-s-operation"></i></el-button>
      </template>
    </HuilanBasicSearchbar>
    <avue-crud :option="option" :table-loading="loading" :data="data" ref="crud" v-model="form" :before-open="beforeOpen"
      :page.sync="page" @row-del="rowDel" @row-update="rowUpdate" @row-save="rowSave" @selection-change="selectionChange"
      @current-change="currentChange" @size-change="sizeChange" @refresh-change="refreshChange" @on-load="onLoad">
      <!--      <template slot="menuLeft">
        <el-button type="danger"
                   size="small"
                   icon="el-icon-delete"
                   v-if="permission.role_delete"
                   plain
                   @click="handleDelete">删 除
        </el-button>
        &lt;!&ndash; <el-button size="small"
                   icon="el-icon-setting"
                   @click="handleRole"
                   plain>权限设置
        </el-button> &ndash;&gt;
      </template>-->
      <template v-slot:menu="scope">
        <!--        <el-button-->
        <!--          type="text"-->
        <!--          icon="el-icon-setting"-->
        <!--          size="small"-->
        <!--          v-if="permissionList.enablePermission"-->
        <!--          @click.stop="handleRole(scope.row,scope.index)"-->
        <!--        >角色权限-->
        <!--        </el-button>-->
        <!--        <el-button-->
        <!--          type="text"-->
        <!--          icon="el-icon-setting"-->
        <!--          size="small"-->
        <!--          v-if="permissionList.enableMgrUser"-->
        <!--          @click.stop="handleUser(scope.row,scope.index)"-->
        <!--        >添加人员-->
        <!--        </el-button>-->
        <HuilanBasicActionTool :actions="getRowActions()" @command="handleCommand($event, scope.row, scope.index)" />
      </template>
    </avue-crud>
    <HuilanDialog :title="$t('system.role.rolePermissionSet')" append-to-body :visible.sync="box" width="960px">
      <!--      <GrantList-->
      <!--        ref="grantList"-->
      <!--        v-if="box"-->
      <!--        :data="menuGrantList"-->
      <!--        :defaultCheckedItems="selectedRes"-->
      <!--        :role="curRole"-->
      <!--      >-->
      <!--        <template v-slot:topmenu>-->
      <!--          <el-button size="mini" @click="managerAiApp">可管理Ai应用</el-button>-->
      <!--        </template>-->
      <!--      </GrantList>-->
      <RoleAuth v-if="box" ref="roleAuth" :role="curRole" style="margin-top: -25px" />

      <template v-slot:footer>
        <el-button size="small" type="primary" @click="submit">{{ $t("aicosCommon.confirmBtn") }}</el-button>
        <el-button size="small" @click="box = false">{{ $t("aicosCommon.cancelBtn") }}</el-button>
      </template>
    </HuilanDialog>
    <HuilanDialog :title="$t('system.role.personnelManagement')" append-to-body :visible.sync="userDialogVisible"
      width="900px">
      <RoleUser v-if="userDialogVisible" ref="roleUser" v-model="selectedUsers" :role="curRole" />

      <template v-slot:footer>
        <el-button size="small" type="primary" @click="saveUsers">{{ $t("aicosCommon.confirmBtn") }}</el-button>
        <el-button size="small" @click="userDialogVisible = false">{{ $t("aicosCommon.cancelBtn") }}</el-button>
      </template>
    </HuilanDialog>

    <!--    <component-->
    <!--      v-if="custom"-->
    <!--      ref="authCmp"-->
    <!--      is="AuthCmp"-->
    <!--      :role="curRole"-->
    <!--    />-->
  </div>
</template>

<script>
import {
  add,
  getList,
  getDeptByRoleId /*getRole, getRoleTreeById,*/ /*grant, grantTree,*/,
  remove,
  update,
  saveRoleUser,
  /*getSelectedResource,*/ getSelectedUser
  /*saveAiApplicationInRole, getSelectedAiApplication*/
} from "@/api/system/role";
// import { getAllTenant } from '@/api/system/tenant';
import { mapGetters } from "vuex";
// import website from '@/config/website';
// import List from '@/components/list'
// import GrantList from '@/components/grant-list';
import RoleUser from "./role/RoleUser";
// import RoleAiApp from './role/RoleAiApp'
import RoleAuth from "./role/roleAuth";
import { getRules } from "@/util/regx";

export default {
  components: {
    // List
    // GrantList,
    RoleUser,
    // RoleAiApp,
    RoleAuth
  },
  data () {
    return {
      dia: true,
      form: {},
      box: false,
      props: {
        label: "title",
        value: "key"
      },
      // menuGrantList: [],
      // selectedRes: [],
      dataScopeGrantList: [],
      apiScopeGrantList: [],
      apiGrantList: [],
      menuTreeObj: [],
      dataScopeTreeObj: [],
      apiScopeTreeObj: [],
      selectionList: [],
      query: {},
      loading: true,
      page: {
        pageSize: 10,
        currentPage: 1,
        total: 0
      },
      option: {
        tip: false,
        header: false,
        // simplePage: true,
        searchShow: true,
        searchMenuSpan: 6,
        // tree: true,
        border: false,
        index: true,
        selection: false,
        viewBtn: false,
        editBtn: false,
        delBtn: false,
        menuWidth: 400,
        dialogWidth: "30%",
        dialogClickModal: false,
        dialogType: "drawer",
        dialogCustomClass: "huilan-drawer-form",
        emptyText :this.$t('aicosCommon.notData'),
        column: [
          {
            label: this.$t('system.role.roleName'),
            prop: "roleName",
            // search: true,
            span: 24,
            maxlength: 50,
            showWordLimit: true,
            rules: [
              {
                required: true,
                message: this.$t('aicosCommon.pleaseInput') + this.$t('system.role.roleName'),
                trigger: "blur"
              },
              ...getRules(["charNumHanUnderline"])
            ]
          }
          // {
          //   label: "所属租户",
          //   prop: "tenantId",
          //   display: false
          // }
        ]
      },
      data: [],
      curRole: {},
      userDialogVisible: false,
      selectedUsers: [],
      // aiAppDialogVisible: false,
      // selectedAiApps: []
      // custom: false
      searchForm: {
        roleName: ""
      },
      searchFieldList: [
        {
          prop: "roleName",
          placeholder: this.$t('aicosCommon.pleaseInput') + this.$t('system.role.roleName')
        }
      ]
    };
  },
  computed: {
    ...mapGetters(["userInfo", "permission"]),
    permissionList () {
      return {
        addBtn: this.vaildData(this.permission["system-role-save"], false),
        viewBtn: this.vaildData(this.permission["system-role-view"], false),
        delBtn: this.vaildData(this.permission["system-role-delete"], false),
        editBtn: this.vaildData(this.permission["system-role-update"], false),
        enablePermission: this.vaildData(
          this.permission["system-role-mgrPermission"],
          false
        ),
        enableMgrUser: this.vaildData(
          this.permission["system-role-mgrUser"],
          false
        )
        // addBtn: true,
        // viewBtn: true,
        // delBtn: true,
        // editBtn: true
      };
    },
    ids () {
      let ids = [];
      this.selectionList.forEach(ele => {
        ids.push(ele.id);
      });
      return ids.join(",");
    },
    idsArray () {
      let ids = [];
      this.selectionList.forEach(ele => {
        ids.push(ele.id);
      });
      return ids;
    }
  },
  methods: {
    initData () {
      // getRoleTreeById(roleId).then(res => {
      //   const column = this.findObject(this.option.column, "parentId");
      //   column.dicData = res.data.data;
      // });
    },
    submit () {
      this.$refs.roleAuth.submit().then(() => {
        this.box = false;
        this.$message({
          type: "success",
          message: this.$t("aicosCommon.successOperate"),
        });
        this.onLoad(this.page);
      });
    },
    rowSave (row, done, loading) {
      add(row).then(
        () => {
          this.onLoad(this.page);
          this.$message({
            type: "success",
            message: this.$t("aicosCommon.successOperate"),
          });
          done();
        },
        error => {
          window.console.log(error);
          loading();
        }
      );
    },
    rowUpdate (row, index, done, loading) {
      update(row).then(
        () => {
          this.onLoad(this.page);
          this.$message({
            type: "success",
            message: this.$t("aicosCommon.successOperate"),
          });
          done();
        },
        error => {
          window.console.log(error);
          loading();
        }
      );
    },
    rowDel (row) {
      this.$confirm(this.$t("aicosCommon.mutiDeleteConfirmTip"), {
        confirmButtonText: this.$t("aicosCommon.confirmBtn"),
        cancelButtonText: this.$t("aicosCommon.cancelBtn"),
        type: "warning"
      })
        .then(() => {
          return remove(row.id);
        })
        .then(() => {
          this.onLoad(this.page);
          this.$message({
            type: "success",
            message: this.$t("aicosCommon.successOperate"),
          });
        });
    },
    searchChange () {
      this.query = {
        ...this.searchForm
      };
      this.page.currentPage = 1;
      this.onLoad();
      // done();
    },
    selectionChange (list) {
      this.selectionList = list;
    },
    selectionClear () {
      this.selectionList = [];
      this.$refs.crud.toggleSelection();
    },
    beforeOpen (done, type) {
      if (["add", "edit"].includes(type)) {
        this.initData(this.form.id);
      }
      done();
    },
    async handleRole (row /*, index, url='otherSys/index'*/) {
      this.curRole = row;

      // import('./auth/' + url).then(Cmp => {
      //   debugger
      //   this.$options.components.AuthCmp = Cmp.default
      //
      //   this.custom = true;
      // })
      // return
      // const [grentData, selectedResData] = await Promise.all([grantTree(), getSelectedResource(row.id)]);
      //
      // this.menuGrantList = grentData.data.data.menuList;
      // this.selectedRes = selectedResData.data.data.map(item=>item.id);
      this.box = true;
    },
    handleDelete () {
      if (this.selectionList.length === 0) {
        this.$message.warning(this.$t("aicosCommon.chooseDataTip"));
        return;
      }
      this.$confirm(this.$t("aicosCommon.mutiDeleteConfirmTip"), {
        confirmButtonText: this.$t("aicosCommon.confirmBtn"),
        cancelButtonText: this.$t("aicosCommon.cancelBtn"),
        type: "warning"
      })
        .then(() => {
          return remove(this.ids);
        })
        .then(() => {
          this.onLoad(this.page);
          this.$message({
            type: "success",
            message: this.$t("aicosCommon.successOperate"),
          });
          this.$refs.crud.toggleSelection();
        });
    },
    currentChange (currentPage) {
      this.page.currentPage = currentPage;
    },
    sizeChange (pageSize) {
      this.page.pageSize = pageSize;
    },
    refreshChange () {
      this.onLoad();
    },
    onLoad () {
      this.loading = true;
      getList(this.page.currentPage, this.page.pageSize, this.query).then(
        res => {
          const data = res.data.data;
          this.data = data.records;
          this.page.total = data.total;
          this.loading = false;
          this.selectionClear();
        }
      );
    },
    async handleUser (row) {
      this.curRole = row;

      await getDeptByRoleId(row.id).then(
        res => {
          if (res.data.data.length > 0) {
            getSelectedUser(row.id).then(
              nres => {
                // console.log("nres.data.data",nres.data.data)
                this.selectedUsers = nres.data.data;
                this.userDialogVisible = true;
              },
              error => {
                window.console.log(error);
              }
            );
          } else {
            this.$message.error(this.$t("system.role.rolePermissionsTip"));
            this.userDialogVisible = false;
          }
        },
        error => {
          window.console.log(error);
        }
      );
    },
    async saveUsers () {
      // const roleUser = this.$refs.roleUser;
      const params = {
        roleId: this.curRole.id,
        userIds: this.selectedUsers.map(item => item.id).join()
      };

      const { data } = await saveRoleUser(params);

      if (data.success) {
        this.$message.success(this.$t('system.role.setUserTip'));
        this.userDialogVisible = false;
      }
    },
    handleAdd () {
      this.$refs.crud.rowAdd();
    },
    // rowStyle({row}) {
    //   return {
    //     background: '#e3f3ff'
    //   }
    // }
    getRowActions () {
      const map = {
        viewBtn: {
          name: this.$t("aicosCommon.viewBtn"),
          command: "rowView"
        },
        delBtn: {
          name: this.$t("aicosCommon.delBtn"),
          command: "rowDel"
        },
        editBtn: {
          name: this.$t("aicosCommon.editBtn"),
          command: "rowEdit"
        },
        enablePermission: {
          name: this.$t("system.role.rolePermission"),
          command: "handleRole"
        },
        enableMgrUser: {
          name: this.$t("system.role.addPeople"),
          command: "handleUser"
        }
      };
      const list = [
        "viewBtn",
        "editBtn",
        "enablePermission",
        "enableMgrUser",
        "delBtn"
      ];
      const actions = [];

      list.forEach(item => {
        if (this.permissionList[item]) {
          actions.push(map[item]);
        }
      });
      return actions;
    },
    handleCommand (command, row, index) {
      const crud = this.$refs.crud;
      const cruddActions = ["rowView", "rowEdit", "rowDel"];
      if (cruddActions.includes(command)) {
        crud[command](row, index);
      } else {
        this[command](row, index);
      }
    },
    configColumn () {
      this.$refs.crud.$refs.dialogColumn.columnBox = true;
    }
  }
};
</script>
