<template>
  <el-row>
    <el-col :span="5">
      <div class="box">
        <el-scrollbar>
          <basic-container>
            <avue-tree ref="leftTree" :option="treeOption" :data="treeData" @node-click="nodeClick">
              <template v-slot="{ node, data }">
                <div class="custom-tree-node">
                  <div :title="node.label">{{ node.label }}</div>
                  <div>
                    <el-button-group>
<!--                      <el-button type="primary" size="mini" icon="el-icon-view" title="查看" @click="viewTreeNode(data)"></el-button>-->
                      <el-button type="primary" size="mini" icon="el-icon-plus" title="新增" @click="addTreeNode(data)"></el-button>
                      <el-button type="primary" size="mini" icon="el-icon-edit" title="编辑" @click="editTreeNode(data)"></el-button>
                      <el-button type="primary" size="mini" icon="el-icon-delete" title="删除" @click="removeTreeNode(data)"></el-button>
                    </el-button-group>
                  </div>
                </div>
              </template>
            </avue-tree>
          </basic-container>
        </el-scrollbar>
      </div>
    </el-col>
    <el-col :span="19">
      <basic-container>
        <avue-crud :option="option"
                   :search.sync="search"
                   :table-loading="loading"
                   :data="data"
                   ref="crud"
                   v-model="form"
                   :permission="permissionList"
                   @row-del="rowDel"
                   @row-update="rowUpdate"
                   @row-save="rowSave"
                   :before-open="beforeOpen"
                   :page.sync="page"
                   @search-change="searchChange"
                   @search-reset="searchReset"
                   @selection-change="selectionChange"
                   @current-change="currentChange"
                   @size-change="sizeChange"
                   @refresh-change="refreshChange"
                   @on-load="onLoad">
          <template slot="menuLeft">
            <!-- <el-button type="danger"
                       size="small"
                       plain
                       icon="el-icon-delete"
                       v-if="permission.user_delete"
                       @click="handleDelete">删 除
            </el-button> -->
            <!-- <el-button type="info"
                       size="small"
                       plain
                       v-if="permission.user_reset"
                       icon="el-icon-refresh"
                       @click="handleReset">密码重置
            </el-button> -->

          </template>
          <template slot-scope="scope" slot="menu">
            <el-button
              type="text"
              icon="el-icon-circle-plus-outline"
              size="small"
              v-if="permissionList.enableStatus"
              @click.stop="enable(scope.row,scope.index)"
            >{{scope.row.status === '1' ? '停用' : '启用'}}
            </el-button>
            <el-button
              type="text"
              icon="el-icon-circle-plus-outline"
              size="small"
              v-if="permissionList.enableLock"
              @click.stop="lock(scope.row,scope.index)"
            >{{scope.row.isLock === '0' ? '锁定' : '解锁'}}
            </el-button>
            <el-button
              type="text"
              icon="el-icon-refresh-left"
              size="small"
              v-if="permissionList.resetPassword"
              @click.stop="resetPwd(scope.row,scope.index)"
            >重置密码
            </el-button>
          </template>
          <!-- <template slot-scope="{row}"
                    slot="deptName">
            <el-tag>{{row.deptName}}</el-tag>
          </template> -->
        </avue-crud>
      </basic-container>
    </el-col>
  </el-row>
</template>

<script>
import {
  getChildrenMaterialFolder,
  getList,
  // getUser,
  // getUserPlatform,
  remove,
  update,
  // updatePlatform,
  add,
  // grant,
  // resetPassword,
  getUserAllInfo,
  enableStatus,
  lockStatus,
  resetPassword
} from "@/api/resourceCenter";
import {/*getDeptTree,*/ getDeptLazyTree/*, getPartOfDeptTree*/} from "@/api/system/dept";
// import {getRoleTree} from "@/api/system/role";
// import {getPostList} from "@/api/system/post";
import {mapGetters} from "vuex";
// import serviceList from '@/config/serviceList'
import {getDictItemListByDictCodeURL} from '@/api/common';

// const { system } = serviceList
// import website from '@/config/website';
// import {getToken} from '@/util/auth';
import { getRules } from '@/util/regx'

import treeNodeMixin from './treeNodeMixin';

export default {
  mixins: [treeNodeMixin],
  data() {
    const me = this;
    return {
      form: {},
      search:{},
      // roleBox: false,
      // excelBox: false,
      // platformBox: false,
      // initFlag: true,
      selectionList: [],
      query: {},
      loading: true,
      // platformLoading: false,
      page: {
        pageSize: 10,
        currentPage: 1,
        total: 0
      },
      // platformPage: {
      //   pageSize: 10,
      //   currentPage: 1,
      //   total: 0
      // },
      init: {
        roleTree: [],
        deptTree: [],
      },
      // props: {
      //   label: "title",
      //   value: "key"
      // },
      // roleGrantList: [],
      // roleTreeObj: [],
      treeDeptId: '0',
      treeDeptName: '分类目录',
      treeData: [],
      treeOption: {
        menu: false,
        addBtn: false,
        nodeKey: 'id',
        lazy: true,
        props: {
          label: 'deptName',
          children: 'children',
          // 设置了value后getNode才能通过key获取节点
          value: 'id'
        },
        formOption: {
          column: [
            {
              label: '分类名称',
              prop: 'name'
            },
            {
              label: '分类名称',
              prop: 'name'
            }
          ]
        },
        defaultExpandedKeys: ['0'],
        treeLoad: function (node, resolve) {
          if(node.level === 0) {
            resolve([{deptName: '分类目录', id: '0'}])
            return
          }
          const parentId = node.data.id;
          getChildrenMaterialFolder({id: parentId, folderType: ''}).then(res => {
            const data = res.data.data;
            setTimeout(()=> {
              if( parentId === '0') {
                if(data.length > 0) {
                  me.$refs.deptTree.setCurrentKey(data[0].id)
                  me.nodeClick(data[0])
                }else {
                  me.loading = false
                }
              }
            })
            resolve(data.map(item => {
              return {
                ...item,
                leaf: item.isLeaf === '1'
              }
            }))
          });
        }
      },
      option: {
        height: 'auto',
        calcHeight: 80,
        tip: false,
        searchShow: true,
        searchMenuSpan: 4,
        border: true,
        index: true,
        selection: false,
        viewBtn: true,
        //dialogType: 'drawer',
        dialogClickModal: false,
        dialogWidth: '40%',
        // form: {},
        menuWidth: 400,
        column: [
          {
            label: "用户名",
            prop: "account",
            search: true,
            display: false
          },
          {
            label: "姓名",
            prop: "realName",
            search: true,
            display: false
          },
          {
            label: "电话",
            prop: "mobile",
            // search: true,
            display: false
          },
          // {
          //   label: "所属部门",
          //   prop: "deptName",
          //   slot: true,
          //   display: false
          // },
          {
            label: "启用状态",
            prop: "status",
            display: false,
            search: true,
            searchSpan: 4,
            type: "radio",
            dicData: [
              {
                label: "启用",
                value: '1'
              },
              {
                label: "停用",
                value: '0'
              }
            ]
          },
          {
            label: "锁定状态",
            prop: "isLock",
            display: false,
            search: true,
            searchSpan: 4,
            type: "radio",
            dicData: [
              {
                label: "锁定",
                value: '1'
              },
              {
                label: "未锁定",
                value: '0'
              }
            ]
          }
        ],
        group: [
          {
            label: '基础信息',
            prop: 'baseInfo',
            icon: 'el-icon-user-solid',
            column: [
              // {
              //   label: "用户编码",
              //   prop: "code",
              //   // hide: !website.tenantMode,
              //   // addDisplay: website.tenantMode,
              //   // editDisplay: website.tenantMode,
              //   // viewDisplay: website.tenantMode,
              //   rules: [{
              //     required: true,
              //     message: "请输入用户编码",
              //     trigger: "blur"
              //   }],
              //   span: 24,
              // },
              {
                label: "用户名",
                prop: "account",
                editDisabled: true,
                maxlength: 50,
                showWordLimit: true,
                rules: [{
                  required: true,
                  message: "请输入用户名",
                  trigger: "blur"
                },
                ...getRules(['charNum'])
                ],
                span: 24
              },
              {
                label: "姓名",
                prop: "realName",
                maxlength: 50,
                showWordLimit: true,
                rules: [{
                  required: true,
                  message: "请输入姓名",
                  trigger: "blur"
                },
                ...getRules(['charNumHan'])
                ],
                span: 24
              },
              // {
              //   label: '密码',
              //   prop: 'password',
              //   type: 'password',
              //   editDisplay: false,
              //   viewDisplay: false,
              //   span: 24,
              //   rules: [{required: true, validator: validatePass, trigger: 'blur'}]
              // },
              // {
              //   label: '确认密码',
              //   prop: 'password2',
              //   type: 'password',
              //   editDisplay: false,
              //   viewDisplay: false,
              //   span: 24,
              //   rules: [{required: true, validator: validatePass2, trigger: 'blur'}]
              // },
              {
                label: '部门',
                prop: 'deptName',
                addDisplay: true,
                editDisplay: false,
                addDisabled: true,
                span: 24
              },
              {
                label: '部门',
                prop: 'deptId',
                addDisplay: false,
                viewDisplay: false,
                span: 24,
                type: 'tree',
                // dicUrl:'/api/aiworkorder-system/baseDept/getPartOfDeptTree',
                // dicMethod: 'post',
                // dicQuery: {
                //   id:'{{key}}'
                // },
                defaultExpandedKeys: [],
                // dicFormatter({data:{deptList}}) {
                //   // ;
                //   const handle = function (arr) {
                //     arr.forEach(function (item) {
                //       if(item.deptList) {
                //         item.children = item.deptList
                //         handle(item.deptList)
                //       }
                //     })
                //   }
                //
                //   handle(deptList);
                //
                //   return deptList
                // },
                props: {
                  label: 'deptName',
                  value: 'id'
                },
                lazy:true,
                // expandOnClickNode: false,
                treeLoad: function (node, resolve) {
                  const defKeys = node.store.defaultExpandedKeys;
                  const defKeysLen = defKeys.length;

                  let parentId = node.data.id
                  if(node.level === 0) {

                    // resolve([]);
                    // return
                    // setTimeout(()=> {
                    //   resolve([{deptName: '部门目录', id: '0', leaf: false}])
                    // }, 2000);
                    // return;
                    parentId = 0
                  }
                  // const parentId = node.data.id;
                  getDeptLazyTree(parentId).then(res => {
                    const data = res.data.data;
                    if(defKeysLen === 0 || defKeys[defKeys.length - 1] === node.key) {
                      me.editDeptIdPromiseResolve();
                    }
                    // setTimeout(()=>{
                    resolve(data.map(item => {
                      return {
                        ...item,
                        leaf: item.isLeaf === '1'
                      }
                    }))
                    // }, 5000)
                  });
                }
              },
              {
                label: '电话',
                prop: 'mobile',
                rules: [
                  ...getRules(['mobile'])
                ],
                span: 24
              },
              {
                label: "性别",
                prop: "sex",
                type: "radio",
                dicData: [
                  {
                    label: "男",
                    value: '1'
                  },
                  {
                    label: "女",
                    value: '2'
                  }
                ],
                value: '1',
                span: 24
              },
              {
                label: '启用状态',
                prop: 'status',
                type: "radio",
                dicData: [
                  {
                    label: "启用",
                    value: '1'
                  },
                  {
                    label: "停用",
                    value: '0'
                  }
                ],
                value: '1',
                span: 24
              },
              {
                label: '锁定状态',
                prop: 'isLock',
                type: "radio",
                dicData: [
                  {
                    label: "锁定",
                    value: '1'
                  },
                  {
                    label: "未锁定",
                    value: '0'
                  }
                ],
                value: '0'
              },
            ]
          },
          {
            label: '附加信息',
            prop: 'detailInfo',
            icon: 'el-icon-s-order',
            collapse:false,
            column: [
              {
                label: "出生日期",
                type: "date",
                prop: "birthday",
                format: "yyyy-MM-dd hh:mm:ss",
                valueFormat: "yyyy-MM-dd hh:mm:ss",
              },
              {
                label: "身份证",
                prop: "idcard",
                rules: getRules(['idCard'])
              },
              {
                label: "政治面貌",
                prop: "political",
                type: "select",
                dicUrl: getDictItemListByDictCodeURL,
                dicMethod: 'post',
                dicQuery: {
                  code: 'political'
                },
                props: {
                  label: "name",
                  value: "code"
                }
              },
              {
                label: "学历",
                prop: "education",
                type: "select",
                dicUrl: getDictItemListByDictCodeURL,
                dicMethod: 'post',
                dicQuery: {
                  code: 'education'
                },
                props: {
                  label: "name",
                  value: "code"
                }
              },
              {
                label: "座机",
                prop: "tel",
                rules: getRules(['phone'])
              },
              {
                label: "邮箱",
                prop: "email",
                rules: [
                  {type:'email',message: '请输入正确的邮箱地址', trigger: 'blur'}
                ]
              },
              {
                label: "QQ",
                prop: "qq"
              },
              {
                label: "传真",
                prop: "fax"
              },
              {
                label: "家庭住址",
                prop: "address",
                overHidden: true,
                maxlength: 50,
                showWordLimit: true,
                rules: getRules(['charNumHanUnderline']),
                span: 24
              },
              {
                label: "岗位",
                prop: "workPosition",
                overHidden: true,
                type: "select",
                dicUrl: getDictItemListByDictCodeURL,
                dicMethod: 'post',
                dicQuery: {
                  code: 'position_type'
                },
                props: {
                  label: "name",
                  value: "code"
                }
              },
              {
                label: "职位",
                prop: "deptPosition",
                type: "select",
                dicUrl: getDictItemListByDictCodeURL,
                dicMethod: 'post',
                dicQuery: {
                  code: 'work_type'
                },
                props: {
                  label: "name",
                  value: "code"
                }
              },
              {
                label: "员工类型",
                prop: "workerType",
                type: "select",
                dicUrl: getDictItemListByDictCodeURL,
                dicMethod: 'post',
                dicQuery: {
                  code: 'worker_type'
                },
                props: {
                  label: "name",
                  value: "code"
                }
              },
              {
                label: "入职日期",
                type: "date",
                prop: "inDate",
                format: "yyyy-MM-dd hh:mm:ss",
                valueFormat: "yyyy-MM-dd hh:mm:ss",
              },
              {
                label: "转正日期",
                type: "date",
                prop: "changeDate",
                format: "yyyy-MM-dd hh:mm:ss",
                valueFormat: "yyyy-MM-dd hh:mm:ss",
              },
              {
                label: "离职日期",
                type: "date",
                prop: "outDate",
                format: "yyyy-MM-dd hh:mm:ss",
                valueFormat: "yyyy-MM-dd hh:mm:ss",
              },
              {
                label: "备注",
                prop: "remark",
                type: 'textarea',
                maxlength: 100,
                showWordLimit: true,
                rules: getRules(['expectSpecials']),
                span: 24
              }
            ]
          }
        ]
      },
      data: [],
    };
  },
  watch: {
  },
  computed: {
    ...mapGetters(["permission"]),
    permissionList() {
      return {
        addBtn: this.treeDeptId !=='0' && this.vaildData(this.permission['system-user-save'], false),
        viewBtn: this.vaildData(this.permission['system-user-view'], false),
        delBtn: this.vaildData(this.permission['system-user-delete'], false),
        editBtn: this.vaildData(this.permission['system-user-update'], false),
        enableStatus: this.vaildData(this.permission['system-user-enableStatus'], false),
        enableLock: this.vaildData(this.permission['system-user-enableLock'], false),
        resetPassword: this.vaildData(this.permission['system-user-resetPassword'], false)
        // addBtn: this.treeDeptId !=='0',
        // viewBtn: true,
        // delBtn: true,
        // editBtn: true
      };
    },
  },
  mounted() {
    // 非租户模式默认加载管理组数据
    // if (!website.tenantMode) {
    //   this.initData(website.tenantId);
    // }
  },
  methods: {
    nodeClick(data) {
      if(data.id === '0') {
        this.$message.error('不能选择部门目录')
        return
      }
      this.treeDeptId = data.id;
      this.treeDeptName = data.deptName;
      this.page.currentPage = 1;
      this.onLoad(this.page);

      // 修改人员时使用
      const deptId = this.findObject(this.option.group, 'deptId')
      if(data.ancestors && data.ancestors !== '') {
        deptId.defaultExpandedKeys = data.ancestors.split(',')
      }
    },
    initData() {
      this.form.deptId = this.treeDeptId;
      this.form.deptName = this.treeDeptName;
    },
    rowSave(row, done, loading) {
      // row.deptId = row.deptId.join(",");
      // row.roleId = row.roleId.join(",");
      // row.postId = row.postId.join(",");
      row.account = row.account.trim()
      add(row).then(() => {
        // this.initFlag = false;
        this.onLoad(this.page);
        this.$message({
          type: "success",
          message: "操作成功!"
        });
        done();
      }, error => {
        window.console.log(error);
        loading();
      });
    },
    rowUpdate(row, index, done, loading) {
      // row.deptId = row.deptId.join(",");
      // row.roleId = row.roleId.join(",");
      // row.postId = row.postId.join(",");
      update(row).then(() => {
        // this.initFlag = false;
        this.onLoad(this.page);
        this.$message({
          type: "success",
          message: "操作成功!"
        });
        done();
      }, error => {
        window.console.log(error);
        loading();
      });
    },
    rowDel(row) {
      this.$confirm("确定将选择数据删除?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          return remove(row.id);
        })
        .then(() => {
          this.onLoad(this.page);
          this.$message({
            type: "success",
            message: "操作成功!"
          });
        });
    },
    async enable(row) {
      const params = {
        id: row.id,
        status: row.status === '1' ? '0': '1'
      }
      const { data } = await enableStatus(params);

      if(data.success) {
        this.$message.success('操作成功！');
        this.onLoad(this.page);
      }
    },
    async lock(row) {
      const params = {
        id: row.id,
        isLock: row.isLock === '1' ? '0': '1'
      }
      const { data } = await lockStatus(params);

      if(data.success) {
        this.$message.success('操作成功！');
        this.onLoad(this.page);
      }
    },
    async resetPwd(row) {
      const params = {
        account: row.account,
        newPassword: this.$store.state.common.systemParam.defaultPassword
      }
      const { data } = await resetPassword(params)
      if(data.success) {
        this.$message.success('操作成功！');
        this.onLoad(this.page);
      }
    },
    searchReset() {
      this.query = {};
      // this.treeDeptId = '';
      this.onLoad(this.page);
    },
    searchChange(params, done) {
      this.query = params;
      this.page.currentPage = 1;
      this.onLoad(this.page, params);
      done();
    },
    selectionChange(list) {
      this.selectionList = list;
    },
    beforeOpen(done, type) {
      if(type === 'add') {
        this.initData();
      }
      if (["edit", "view"].includes(type)) {
        getUserAllInfo(this.form.id).then(res => {
          const data = res.data.data;
          Reflect.deleteProperty(data, 'tenantId');
          // setTimeout(()=> {
          if(type === 'edit') {
            const deptInput = this.$refs.crud.$refs.dialogForm.$refs.tableForm.$refs.deptId[0].$refs.temp;
            deptInput.created = true;
            new Promise((resolve) => {
              this.editDeptIdPromiseResolve = resolve
            }).then(() => {
              this.form = data;
            })
          }else {
            this.form = data;
          }

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
    onLoad(page, params = {}) {
      if(this.treeDeptId == '0') {
        return;
      }
      var obj = {
        account: params.account,
        isLock: params.isLock,
        realName: params.realName,
        status: params.status
      }
      this.loading = true;
      getList(page.currentPage, page.pageSize, obj, this.treeDeptId).then(res => {
        const data = res.data.data;
        this.page.total = data.total;
        this.data = data.records;
        this.loading = false;
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.custom-tree-node {
  flex: 1;
  display: flex;
  width: 0;

  >div:first-child {
    flex: 1;
    font-size: 14px;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  >div:last-child {
    /deep/.el-button {
      padding: 3px;
    }
  }
}
</style>
