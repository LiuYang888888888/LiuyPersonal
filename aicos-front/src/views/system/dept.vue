<template>
  <HuilanBasic :left-width="240">
    <template v-slot:left>
      <departmentAuthorityTree :nodeClick="nodeClick" ref="childTree" />
    </template>
    <!-- <el-col :span="5">
      <div class="box">
        <el-scrollbar>
          <basic-container>
            <departmentAuthorityTree
              :nodeClick="nodeClick"
            />
          </basic-container>
        </el-scrollbar>
      </div>
    </el-col> -->
    <HuilanBasicToolbar style="margin-top: 0">
      <el-button v-if="permissionList.addBtn" type="primary" size="small" @click="handleAdd">{{ $t("aicosCommon.addBtn")
      }}</el-button>
      <el-button v-if="permissionList.delMoreBtn" type="danger" size="small" @click="handleDel">{{
        $t("aicosCommon.batchDeleteBtn") }}</el-button>
    </HuilanBasicToolbar>
    <avue-crud :option="option" :table-loading="loading" :data="data" ref="crud" v-model="form" :page.sync="page"
      :permission="permissionList" :before-open="beforeOpen" :before-close="beforeClose" @row-del="rowDel"
      @row-update="rowUpdate" @row-save="rowSave" @search-change="searchChange" @search-reset="searchReset"
      @selection-change="selectionChange" @current-change="currentChange" @size-change="sizeChange"
      @refresh-change="refreshChange" @on-load="onLoad">
      <!-- <template slot-scope="scope" slot="menu">
            <el-button
              type="text"
              icon="iconfont iconicon_group"
              size="small"
              @click.stop="userMgr(scope.row,scope.index)"
            >用户管理
            </el-button>
          </template> -->
      <template slot-scope="{ row }" slot="deptCategory">
        <el-tag>{{ row.deptCategoryName }}</el-tag>
      </template>
      <template slot-scope="{ row }" slot="leaderIdForm">
        <div>
          <OptOrgCommon v-model="row.leaderId" :title="$t('system.dept.selectLeaders')" :tabs="['user']"
            :dataView="OptOrgDataView"></OptOrgCommon>
        </div>
      </template>
      <template v-slot:menu="scope">
        <HuilanBasicActionTool :actions="getRowActions(scope.row)"
          @command="handleCommand($event, scope.row, scope.index)" />
      </template>
    </avue-crud>
    <!-- <el-dialog
          title="用户管理"
          :visible.sync="dialogVisible"
          width="40%"
        >
          <el-transfer v-model="deptUserList" :data="waitingList"></el-transfer>
          <span slot="footer" class="dialog-footer">
            <el-button type="primary" size="small" @click="dialogVisible = false">确 定</el-button>
            <el-button size="small" @click="dialogVisible = false">取 消</el-button>
          </span>
        </el-dialog> -->
  </HuilanBasic>
</template>

<script>
import {
  // getLazyList,
  remove,
  update,
  add,
  // getDept,
  // getDeptTree,
  // getDeptLazyTree,
  getCanBeManagerDeptLazyTree,
  deleteBatch,
  // getDeptUserList,
  // saveDeptUser
} from "@/api/system/dept";
import { getUserList, getUser } from "@/api/system/user";
import { mapGetters } from "vuex";
// import website from '@/config/website';
import { getRules } from "@/util/regx";
import departmentAuthorityTree from "@/components/TreeSelect/departmentAuthorityTree";

import { isNull } from "@/util/qsgCommon.js";
import OptOrgCommon from "@/views/optOrg/OptOrgCommon";

export default {
  components: {
    departmentAuthorityTree,
    OptOrgCommon,
  },
  data () {
    const me = this;
    return {
      deptLeaderData: {
        num: {
          user: { max: 1 },
        },
      },

      OptOrgDataView: false,

      treeDeptId: "0",
      // treeData: [],
      // treeOption: {
      //   menu: false,
      //   addBtn: false,
      //   nodeKey: 'id',
      //   lazy: true,
      //   props: {
      //     label: 'deptName',
      //     children: 'children',
      //     // 设置了value后getNode才能通过key获取节点
      //     value: 'id'
      //   },
      //   defaultExpandedKeys: ['0'],
      //   treeLoad: function (node, resolve) {
      //     if(node.level === 0) {
      //       resolve([{deptName: '部门目录', id: '0'}])
      //       return;
      //     }
      //     const parentId = node.data.id;
      //     getCanBeManagerDeptLazyTree(parentId).then(res => {
      //       resolve(res.data.data.map(item => {
      //         return {
      //           ...item,
      //           leaf: item.isLeaf === '1'
      //         }
      //       }))
      //     });
      //   }
      // },
      form: {},
      selectionList: [],
      query: {},
      loading: true,
      parentId: "0",
      parentName: "部门目录",
      path: "",
      level: 1,
      page: {
        // pageSize: 10,
        // currentPage: 1,
        total: 0,
      },
      option: {
        // lazy: true,
        header: false,
        tip: false,
        // simplePage: true,
        searchShow: true,
        searchMenuSpan: 6,
        border: false,
        index: true,
        addBtn: false,
        selection: true,
        viewBtn: false,
        editBtn: false,
        delBtn: false,
        // menuWidth: 300,
        dialogClickModal: false,
        dialogWidth: "40%",
        dialogType: "drawer",
        dialogCustomClass: "huilan-drawer-form",
        emptyText: this.$t('aicosCommon.notData'),
        column: [
          {
            label: this.$t("system.dept.superiorDepartment"),
            prop: "parentName",
            span: 24,
            hide: true,
            //控制是否显示在列显隐的表格中
            showColumn: false,
            disabled: true,
            // props: {
            //   label: "title"
            // }
          },
          {
            label: this.$t("system.dept.departmentName"),
            prop: "deptName",
            span: 24,
            // search: true,
            maxlength: 50,
            showWordLimit: true,
            rules: [
              {
                required: true,
                message: this.$t("aicosCommon.pleaseInput") + this.$t("system.dept.departmentName"),
                trigger: "blur",
              },
              ...getRules(["charNumHanUnderline"]),
            ],
          },
          // {
          //   label: "部门编码",
          //   prop: "code",
          //   editDisabled: true,
          //   span: 24,
          //   rules: [{
          //     required: true,
          //     message: "请输入部门编码",
          //     trigger: "blur"
          //   }]
          // },
          // {
          //   label: "英文简称",
          //   prop: "code1",
          //   span: 24,
          //   search: true,
          //   disabled: true,
          //   hide: true,
          //   rules: [{
          //     required: false,
          //     message: "请输入部门",
          //     trigger: "blur"
          //   }]
          // },
          {
            label: this.$t("system.dept.departmentLeaders"),
            prop: "leaderId",
            span: 24,
            hide: true,
            formslot: true,
            //控制是否显示在列显隐的表格中
            showColumn: false,
            type: "table",
            dialogWidth: "900px",
            children: {
              border: true,
              searchSpan: 8,
              searchLabelWidth: 50,
              searchMenuSpan: 6,
              // selection: true,
              // tip: false,
              column: [
                {
                  label: " ",
                  width: 50,
                  prop: "id",
                  formatter (row, column, cellVal) {
                    const propRef =
                      me.$refs.crud.$refs.dialogForm.$refs.tableForm.getPropRef(
                        "leaderId"
                      );
                    const inputRef = propRef.$refs.temp;

                    return `<span class="el-checkbox__input ${inputRef.active && inputRef.active.id == cellVal
                      ? "is-checked"
                      : ""
                    }">
                              <span class="el-checkbox__inner"></span>
                              <input type="checkbox" aria-hidden="false" class="el-checkbox__original" value="">
                            </span>`;
                  },
                },
                {
                  label: this.$t("system.dept.realName"),
                  // width: 120,
                  search: true,
                  prop: "realName",
                },
                {
                  label: this.$t("system.dept.accountNumber"),
                  search: true,
                  prop: "account",
                },
              ],
            },
            props: {
              label: "realName",
              value: "id",
            },
            onLoad ({ page, value, data }, callback) {
              //首次加载去查询对应的值
              if (value) {
                // this.$message.success('首次查询'+value)
                getUser(value).then((res) => {
                  const dataRes = res.data.data;
                  if (dataRes) {
                    callback(dataRes);
                  }
                });
                // callback({
                //   id: '0',
                //   name: '张三',
                //   sex: '男'
                // })
                return;
              }
              // if(data){
              //   this.$message.success('搜索查询参数'+JSON.stringify(data))
              // }
              // if(page){
              //   this.$message.success('分页参数'+JSON.stringify(page))
              // }
              const { realName, ...others } = data || {};

              getUserList({
                deptId: 0,
                ...others,
                realName,
                current: page.currentPage,
                size: page.pageSize,
              }).then((res) => {
                const data = res.data.data;
                callback({
                  total: data.total,
                  data: data.records,
                });
              });
            },
          },
          {
            label: this.$t("system.dept.departmentOverview"),
            prop: "remark",
            span: 24,
            type: "textarea",
            align: "right",
            maxlength: 100,
            showWordLimit: true,
            width: 80,
            hide: true,
            rules: getRules(["expectSpecials"]),
          },
        ],
      },
      data: [],
      treeItemId: "0",
      isManager: false,
      // waitingList:[],
      // deptUserList: [],
      // dialogVisible: false
    };
  },
  computed: {
    ...mapGetters(["userInfo", "permission", "language"]),
    permissionList () {
      return {
        addBtn: this.vaildData(
          this.isManager && this.permission["system-dept-save"],
          false
        ),
        viewBtn: this.vaildData(this.permission["system-dept-view"], false),
        delBtn: this.vaildData(
          this.isManager && this.permission["system-dept-delete"],
          false
        ),
        editBtn: this.vaildData(
          this.isManager && this.permission["system-dept-update"],
          false
        ),
        delMoreBtn: this.vaildData(
          this.isManager && this.permission["system-dept-delMore"],
          false
        ),
        // addBtn: true,
        // viewBtn: true,
        // delBtn: true,
        // editBtn: true
      };
    },
    // ids() {
    //   let ids = [];
    //   this.selectionList.forEach(ele => {
    //     ids.push(ele.id);
    //   });
    //   return ids.join(",");
    // }
  },
  methods: {
    handleDel () {
      if (this.selectionList.length == 0) {
        this.$message({
          type: "warning",
          message: this.$t("aicosCommon.chooseDataTip"),
        });
      } else {
        let tempDelData = [ ... this.selectionList];
        this.$confirm(
          this.$t("system.user.deleteTip") + this.selectionList.length + this.$t("system.user.countsTip"),
          this.$t("system.user.tip"),
          {
            confirmButtonText: this.$t("aicosCommon.confirmBtn"),
            cancelButtonText: this.$t("aicosCommon.cancelBtn"),
            type: "warning",
          }
        )
          .then(() => {
            const delIds = this.selectionList.map((item) => item.id);
            return deleteBatch(delIds.join(","));
          })
          .then(() => {
            // this.onLoad()
            this.$message({
              type: "success",
              message: this.$t("aicosCommon.successOperate"),
            });
  
            this.$refs.childTree.updateTreeNode("add", {  ...tempDelData[0]} );

            this.refreshChange();
          });
      }
    },
    getRowActions () {
      const map = {
        viewBtn: {
          name: this.$t("aicosCommon.viewBtn"),
          command: "rowView",
        },
        delBtn: {
          name: this.$t("aicosCommon.delBtn"),
          command: "rowDel",
        },
        editBtn: {
          name: this.$t("aicosCommon.editBtn"),
          command: "rowEdit",
        },
      };
      const list = ["viewBtn", "editBtn", "delBtn"];
      const actions = [];

      list.forEach((item) => {
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
    handleAdd () {
      this.$refs.crud.rowAdd();
    },
    getPath (node) {
      let path = [];
      let curNode = node;
      while (curNode.level > 1) {
        path.push(curNode.key);
        curNode = curNode.parent;
      }
      return path.reverse().join();
    },
    initData (type) {
      this.form.parentId = this.parentId;
      this.form.parentName = this.parentName;
      if (type == "add") {
        this.form.deptLevel = this.level;
        this.form.ancestors = this.path;
      }
    },
    rowSave (row, done, loading) {
      if (!isNull(row.leaderId.user)) {
        row.leaderId = row.leaderId.user[0].id;
      } else {
        row.leaderId = "";
      }

      add(row).then(
        (res) => {
          // 获取新增数据的相关字段
          const data = res.data.data;
          row.id = data.id;
          this.$message({
            type: "success",
            message: this.$t("aicosCommon.successOperate"),
          });
          //保存后刷新子组件树结构
          this.$refs.childTree.updateTreeNode("add", data);
          // 数据回调进行刷新
          done(row);
          this.refreshChange();
        },
        (error) => {
          window.console.log(error);
          loading();
        }
      );
    },
    rowUpdate (row, index, done, loading) {
      // console.log('rowUpdate', row);
      if (!isNull(row.leaderId.user)) {
        if(!isNull(row.leaderId.user[0].tempId)){
          row.leaderId = row.leaderId.user[0].tempId;
        }else{
          row.leaderId = row.leaderId.user[0].id;
        }
        // row.leaderId = row.leaderId.user[0].id;
      } else {
        row.leaderId = "";
      }
      // console.log('rowUpdate', row.leaderId);


      update(row).then(
        () => {
          this.$refs.childTree.updateTreeNode("update", row);
          this.$message({
            type: "success",
            message: this.$t("aicosCommon.successOperate"),
          });
          // 数据回调进行刷新
          done(row);
        },
        (error) => {
          window.console.log(error);
          loading();
        }
      );
    },
    rowDel (row, index, done) {
      this.$confirm(this.$t("aicosCommon.mutiDeleteConfirmTip"), {
        confirmButtonText: this.$t("aicosCommon.confirmBtn"),
        cancelButtonText: this.$t("aicosCommon.cancelBtn"),
        type: "warning",
      })
        .then(() => {
          return remove(row.id);
        })
        .then(() => {
          this.$message({
            type: "success",
            message: this.$t("aicosCommon.successOperate"),
          });
          this.$refs.childTree.updateTreeNode("del", row);
          // 数据回调进行刷新
          done(row);
          this.refreshChange();
        });
    },
    // handleDelete() {
    //   if (this.selectionList.length === 0) {
    //     this.$message.warning("请选择至少一条数据");
    //     return;
    //   }
    //   this.$confirm("确定将选择数据删除?", {
    //     confirmButtonText: "确定",
    //     cancelButtonText: "取消",
    //     type: "warning"
    //   })
    //     .then(() => {
    //       return remove(this.ids);
    //     })
    //     .then(() => {
    //       // 刷新表格数据并重载
    //       this.data = [];
    //       this.parentId = 0;
    //       this.$refs.crud.refreshTable();
    //       this.$refs.crud.toggleSelection();
    //       // 表格数据重载
    //       this.onLoad(this.page);
    //       this.$message({
    //         type: "success",
    //         message: this.$t("aicosCommon.successOperate")
    //       });
    //     });
    // },
    searchReset () {
      this.query = {};
      this.parentId = 0;
      this.onLoad(this.page);
    },
    searchChange (params, done) {
      this.query = params;
      // this.parentId = '';
      this.page.currentPage = 1;
      this.onLoad(this.page, params);
      done();
    },
    selectionChange (list) {
      this.selectionList = list;
    },
    selectionClear () {
      this.selectionList = [];
      this.$refs.crud.toggleSelection();
    },
    async beforeOpen (done, type) {

      this.option.labelPosition = this.language == 'en' ? 'top' : 'right'

      this.initData(type);

      if (type === "add") {
        this.form.leaderId = {
          num: {
            user: { max: 1 },
          },
          user: [],
        };
        this.initData();
      }

      if (type === "view") {
        this.OptOrgDataView = true;
      } else {
        this.OptOrgDataView = false;
      }


      if (["edit", "view"].includes(type)) {
        if (!isNull(this.form.leaderId)) {
          await getUser(this.form.leaderId).then((res) => {
            const dataRes = res.data.data;
            this.form.leaderId = {
              num: {
                user: { max: 1 },
              },
              user: [
                {
                  realName: dataRes.realName,
                  id: dataRes.account,
                  tempId: dataRes.id,
                  account: dataRes.account,
                },
              ],
            };
          });
        } else {
          this.form.leaderId = {
            num: {
              user: { max: 1 },
            },
            user: [],
          };
        }
      }
      done();
    },
    beforeClose (done) {
      // this.parentId = "";
      // const column = this.findObject(this.option.column, "parentId");
      // column.value = "";
      // column.addDisabled = false;
      done();
    },
    currentChange (currentPage) {
      this.page.currentPage = currentPage;
    },
    sizeChange (pageSize) {
      this.page.pageSize = pageSize;
    },
    refreshChange () {
      this.onLoad(this.page, this.query);
    },
    onLoad (page, params = {}, treeItemId) {
      if (this.treeDeptId == "0" && !treeItemId) {
        return;
      }
      if (!treeItemId) {
        treeItemId = this.treeDeptId;
      }
      // const pageConf = {
      //   // current: page.currentPage,
      //   // size: page.pageSize,
      // };
      this.loading = true;
      // console.log(this.parentId)
      getCanBeManagerDeptLazyTree(
        this.treeDeptId,
        // Object.assign(params, this.query, pageConf)
        // Object.assign(params, this.query)
        params.deptName
      ).then((res) => {
        const data = res.data.data.retList;
        this.loading = false;
        this.data = data;

        // this.page.total = data.total;
        this.selectionClear();
      });
    },
    nodeClick (data, node, root) {
      if (data.id === "0") {
        if (node.childNodes.length === 0) {
          this.loading = false;
        }
        this.isManager = root;
        if (this.userInfo.isAdmin === "1") {
          this.isManager = true;
        }
      } else {
        if (data.isManager === "1") {
          this.isManager = true;
        } else {
          this.isManager = false;
        }
      }
      this.path = this.getPath(node);
      this.treeDeptId = data.id;
      this.parentId = data.id;
      this.parentName = data.deptName;
      this.level = node.level;
      this.onLoad(this.page, {}, data.id);
    },
    // async userMgr(row, index) {
    //   const {data} = await getDeptUserList(row.id)
    // }
  },
  mounted () {
    // 收起左侧菜单
    if (!this.$store.getters.isCollapse) {
      this.$store.commit("SET_COLLAPSE");
    }
    // this.$refs.deptTree.setCurrentKey("0");
  },
};
</script>

<style></style>
