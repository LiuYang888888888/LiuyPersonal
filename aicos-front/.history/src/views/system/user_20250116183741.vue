<template>
  <HuilanBasic :left-width="240">
    <template v-slot:left>
      <departmentAuthorityTree :nodeClick="nodeClick" />
    </template>
    <!--    <div style="height:500px;">-->
    <!--        <HuilanEditor/>-->
    <!--    </div>-->
    <HuilanBasicToolbar style="margin-top: 0">
      <el-button
        v-if="permissionList.addBtn"
        type="primary"
        size="small"
        @click="handleAdd"
        >{{ $t("aicosCommon.addBtn") }}
      </el-button>
      <el-button
        v-if="permissionList.delMoreBtn"
        type="danger"
        size="small"
        @click="handleDel"
        >{{ $t("aicosCommon.batchDeleteBtn") }}
      </el-button>
    </HuilanBasicToolbar>
    <HuilanBasicSearchbar
      :model="searchForm"
      :fields="searchFieldList"
      @search="searchChange"
    >
      <template v-slot:appendTool>
        <!--        有search、reset事件-->
        <!--        <HuilanBasicAdvSearch-->
        <!--          @search=""-->
        <!--          @reset=""-->
        <!--        >-->
        <!--          <el-form size="small" label-width="80px">-->
        <!--            <el-row>-->
        <!--              <el-col span="12">-->
        <!--                <el-form-item label="属性1"><el-input/></el-form-item>-->
        <!--              </el-col>-->
        <!--              <el-col span="12">-->
        <!--                <el-form-item label="属性1"><el-input/></el-form-item>-->
        <!--              </el-col>-->
        <!--            </el-row>-->
        <!--            <el-row>-->
        <!--              <el-col span="12">-->
        <!--                <el-form-item label="属性1"><el-input/></el-form-item>-->
        <!--              </el-col>-->
        <!--              <el-col span="12">-->
        <!--                <el-form-item label="属性1"><el-input/></el-form-item>-->
        <!--              </el-col>-->
        <!--            </el-row>-->
        <!--            <el-row>-->
        <!--              <el-col span="12">-->
        <!--                <el-form-item label="属性1"><el-input/></el-form-item>-->
        <!--              </el-col>-->
        <!--              <el-col span="12">-->
        <!--                <el-form-item label="属性1"><el-input/></el-form-item>-->
        <!--              </el-col>-->
        <!--            </el-row>-->
        <!--            <el-row>-->
        <!--              <el-col span="12">-->
        <!--                <el-form-item label="属性1"><el-input/></el-form-item>-->
        <!--              </el-col>-->
        <!--              <el-col span="12">-->
        <!--                <el-form-item label="属性1"><el-input/></el-form-item>-->
        <!--              </el-col>-->
        <!--            </el-row>-->
        <!--          </el-form>-->

        <!--        </HuilanBasicAdvSearch>-->
        <el-button type="default" @click="configColumn"
          ><i class="el-icon-s-operation"></i
        ></el-button>
      </template>
    </HuilanBasicSearchbar>

    <avue-crud
      :option="option"
      :search.sync="search"
      :table-loading="loading"
      :data="data"
      ref="crud"
      v-model="form"
      @row-del="rowDel"
      @row-update="rowUpdate"
      @row-save="rowSave"
      :before-open="beforeOpen"
      :page.sync="page"
      @selection-change="selectionChange"
      @current-change="currentChange"
      @size-change="sizeChange"
      @refresh-change="refreshChange"
      @on-load="onLoad"
    >
      <template v-slot:menu="scope">
        <HuilanBasicActionTool
          :actions="getRowActions(scope.row)"
          @command="handleCommand($event, scope.row, scope.index)"
          :limt="language == 'en' ? 4 : 5"
        />
      </template>
      <template slot-scope="scope" slot="directLeaderForm">
        <div>
          <OptOrgCommon
            v-model="form.directLeader"
            :title="$t('system.user.selectDirectLeader')"
            :tabs="['user']"
            :dataView="OptOrgDataView"
          >
          </OptOrgCommon>
        </div>
      </template>

      <template slot-scope="scope" slot="deptIdForm">
        <div>
          <TreeSelect
            :multiple="false"
            v-model="form.deptId"
            :showValue="treeDeptName"
            :treeOption="treeOption"
          />
        </div>
      </template>
    </avue-crud>
  </HuilanBasic>
</template>

<script>
import {
  getList,
  // getUser,
  // getUserPlatform,
  remove,
  update,
  // updatePlatform,
  add,
  // grant,
  // resetPassword,
  deleteBatch,
  getUserAllInfo,
  enableStatus,
  lockStatus,
  resetPasswordyh,
  getBaseUserByAccount,
} from "@/api/system/user";
import {
  /*getDeptTree,*/ /*getDeptLazyTree,*/ getCanBeManagerDeptLazyTree /*, getPartOfDeptTree*/,
} from "@/api/system/dept";
// import {getRoleTree} from "@/api/system/role";
// import {getPostList} from "@/api/system/post";
import { mapGetters } from "vuex";
import { getDictItemListByDictCodeURL } from "@/api/common";

// import website from '@/config/website';
// import {getToken} from '@/util/auth';
import { getRules } from "@/util/regx";
import departmentAuthorityTree from "@/components/TreeSelect/departmentAuthorityTree";

import TreeSelect from "@/components/TreeSelect";
import { getTextWidth } from "@/util/util";
import { isNull } from "@/util/qsgCommon.js";
import OptOrgCommon from "@/views/optOrg/OptOrgCommon";

// import HuilanEditor from "@/components/editor/HuilanEditor";

export default {
  components: {
    departmentAuthorityTree,
    OptOrgCommon,
    TreeSelect,
    // HuilanEditor
  },
  data() {
    // const validatePass = (rule, value, callback) => {
    //   if (value === '') {
    //     callback(new Error('请输入密码'));
    //   } else {
    //     callback();
    //   }
    // };
    // const validatePass2 = (rule, value, callback) => {
    //   if (value === '') {
    //     callback(new Error('请再次输入密码'));
    //   } else if (value !== this.form.password) {
    //     callback(new Error('两次输入密码不一致!'));
    //   } else {
    //     callback();
    //   }
    // };
    return {
      treeOption: {
        defaultExpandedKeys: ["0"],
        // showCheckbox: true,
        // checkStrictly: true,
        props: {
          label: "deptName",
          isLeaf: "leaf",
          disabled: "disabled",
          // value: 'id'
        },
        lazy: true,
        key: "id",
        // expandOnClickNode: false,
        load: (node, resolve) => {
          // let parentId = node.data && node.data.id
          if (node.level === 0) {
            // parentId = 0
            resolve([
              {
                deptName: this.$t("system.user.departmentDirectory"),
                id: "0",
                disabled: true,
              },
            ]);
            return;
          }
          // const parentId = node.data.id;
          getCanBeManagerDeptLazyTree(node.data.id).then((res) => {
            const dataRes = res.data.data.retList;
            resolve(
              dataRes.map((item) => {
                return {
                  ...item,
                  leaf: item.isLeaf === "1",
                };
              })
            );
          });
        },
      },

      directLeaderData: {
        num: {
          user: { max: 1 },
        },
      },

      OptOrgDataView: false,

      form: {},
      isManager: false,
      search: {},
      // api: { getCanBeManagerDeptLazyTree },
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
        total: 0,
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
      treeDeptId: "0",
      treeDeptName: "部门目录",
      // treeData: [],
      // treeOption: {
      //   menu: false,
      //   addBtn: false,
      //   nodeKey: "id",
      //   lazy: true,
      //   props: {
      //     label: "deptName",
      //     children: "children",
      //     // 设置了value后getNode才能通过key获取节点
      //     value: "id",
      //   },
      //   defaultExpandedKeys: ["0"],
      //   treeLoad: function (node, resolve) {
      //     if (node.level === 0) {
      //       resolve([{ deptName: "部门目录", id: "0" }]);
      //       return;
      //     }
      //     const parentId = node.data.id;
      //     getCanBeManagerDeptLazyTree(parentId).then((res) => {
      //       const data = res.data.data;
      //       setTimeout(() => {
      //         if (parentId === "0") {
      //           if (data.length > 0) {
      //             me.$refs.deptTree.setCurrentKey(data[0].id);
      //             me.nodeClick(data[0]);
      //           } else {
      //             me.loading = false;
      //           }
      //         }
      //       });
      //       resolve(
      //         data.map((item) => {
      //           return {
      //             ...item,
      //             leaf: item.isLeaf === "1",
      //           };
      //         })
      //       );
      //     });
      //   },
      // },
      option: {
        // height: "auto",
        // calcHeight: 80,
        header: false,
        tip: false,
        searchShow: true,
        searchMenuSpan: 4,
        border: false,
        index: true,
        selection: true,
        viewBtn: false,
        delBtn: false,
        editBtn: false,
        //dialogType: 'drawer',
        dialogClickModal: false,
        dialogWidth: "40%",
        dialogType: "drawer",
        dialogCustomClass: "huilan-drawer-form",
        emptyText: this.$t("aicosCommon.notData"),
        // form: {},
        menuWidth: 250,
        column: [
          {
            label: this.$t("system.user.userName"),
            prop: "account",
            // search: true,
            display: false,
            formatter: (val /*,value,label*/) => {
              return val.account + "";
            },
          },
          {
            label: this.$t("system.user.realName"),
            prop: "realName",
            // search: true,
            display: false,
            formatter: (val /*,value,label*/) => {
              return val.realName + "";
            },
          },
          {
            label: this.$t("system.user.phone"),
            prop: "mobile",
            // search: true,
            hide: true,
            display: false,
            width: 110,
          },
          {
            label: this.$t("system.user.roles"),
            prop: "roles",
            overHidden: true,
            width: 200,
            display: false,
            formatter: (val, value) => {
              const roleName = value
                .map((ele) => {
                  return ele.roleName;
                })
                .join();
              return roleName || "--";
            },
          },

          // {
          //   label: "所属部门",
          //   prop: "deptName",
          //   slot: true,
          //   display: false
          // },
          {
            label: this.$t("system.user.enableStatus"),
            prop: "status",
            width: 120,
            display: false,
            // search: true,
            searchSpan: 4,
            type: "radio",
            dicData: [
              {
                label: this.$t("system.user.enable"),
                value: "1",
              },
              {
                label: this.$t("system.user.deactivate"),
                value: "0",
              },
            ],
          },
          {
            label: this.$t("system.user.lockingState"),
            prop: "isLock",
            display: false,
            // search: true,
            searchSpan: 4,
            type: "radio",
            width: 130,
            dicData: [
              {
                label: this.$t("system.user.lock"),
                value: "1",
              },
              {
                label: this.$t("system.user.unLocked"),
                value: "0",
              },
            ],
          },
        ],
        group: [
          {
            label: this.$t("system.user.basicInformation"),
            prop: "baseInfo",
            icon: "el-icon-user-solid",
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
                label: this.$t("system.user.userName"),
                prop: "account",
                editDisabled: true,
                maxlength: 50,
                showWordLimit: true,
                rules: [
                  {
                    required: true,
                    message:
                      this.$t("aicosCommon.pleaseInput") +
                      this.$t("system.user.userName"),
                    trigger: "blur",
                  },
                  ...getRules(["charNum"]),
                ],
                span: 24,
              },
              {
                label: this.$t("system.user.realName"),
                prop: "realName",
                maxlength: 50,
                showWordLimit: true,
                rules: [
                  {
                    required: true,
                    message:
                      this.$t("aicosCommon.pleaseInput") +
                      this.$t("system.user.realName"),
                    trigger: "blur",
                  },
                  ...getRules(["charNumHan"]),
                ],
                span: 24,
              },
              {
                label: this.$t("system.user.personnelType"),
                prop: "isAdmin",
                type: "radio",
                dicData: [
                  {
                    label: this.$t("system.user.general"),
                    value: "0",
                  },
                  {
                    label: this.$t("system.user.administrator"),
                    value: "3",
                  },
                ],
                value: "0",
                span: 24,
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
                label: this.$t("system.user.department"),
                prop: "deptId",
                //addDisplay: true,
                //editDisplay: false,
                //addDisabled: true,
                //editDisabled: true,
                span: 24,
              },
              {
                label: this.$t("system.user.directLeader"),
                prop: "directLeader",
                span: 24,
                formslot: true,
              },
              // {
              //   label: '部门',
              //   prop: 'deptId',
              //   addDisplay: false,
              //   viewDisplay: false,
              //   span: 24,
              //   type: 'tree',
              //   // dicUrl:'/api/aiworkorder-system/baseDept/getPartOfDeptTree',
              //   // dicMethod: 'post',
              //   // dicQuery: {
              //   //   id:'{{key}}'
              //   // },
              //   defaultExpandedKeys: [],
              //   // dicFormatter({data:{deptList}}) {
              //   //   // ;
              //   //   const handle = function (arr) {
              //   //     arr.forEach(function (item) {
              //   //       if(item.deptList) {
              //   //         item.children = item.deptList
              //   //         handle(item.deptList)
              //   //       }
              //   //     })
              //   //   }
              //   //
              //   //   handle(deptList);
              //   //
              //   //   return deptList
              //   // },
              //   props: {
              //     label: 'deptName',
              //     value: 'id'
              //   },
              //   lazy:true,
              //   // expandOnClickNode: false,
              //   treeLoad: function (node, resolve) {
              //     const defKeys = node.store.defaultExpandedKeys;
              //     const defKeysLen = defKeys.length;
              //
              //     let parentId = node.data.id
              //     if(node.level === 0) {
              //
              //       // resolve([]);
              //       // return
              //       // setTimeout(()=> {
              //       //   resolve([{deptName: '部门目录', id: '0', leaf: false}])
              //       // }, 2000);
              //       // return;
              //       parentId = 0
              //     }
              //     // const parentId = node.data.id;
              //     getDeptLazyTree(parentId).then(res => {
              //       const data = res.data.data;
              //       if(defKeysLen === 0 || defKeys[defKeys.length - 1] === node.key) {
              //         me.editDeptIdPromiseResolve();
              //       }
              //       // setTimeout(()=>{
              //         resolve(data.map(item => {
              //           return {
              //             ...item,
              //             leaf: item.isLeaf === '1'
              //           }
              //         }))
              //       // }, 5000)
              //     });
              //   }
              // },
              {
                label: this.$t("system.user.phone"),
                prop: "mobile",
                rules: [...getRules(["mobile"])],
                span: 24,
              },
              {
                label: this.$t("system.user.sex"),
                prop: "sex",
                type: "radio",
                dicData: [
                  {
                    label: this.$t("system.user.man"),
                    value: "1",
                  },
                  {
                    label: this.$t("system.user.woman"),
                    value: "2",
                  },
                ],
                value: "1",
                span: 24,
              },
              {
                label: this.$t("system.user.enableStatus"),
                prop: "status",
                type: "radio",
                dicData: [
                  {
                    label: this.$t("system.user.enable"),
                    value: "1",
                  },
                  {
                    label: this.$t("system.user.deactivate"),
                    value: "0",
                  },
                ],
                value: "1",
                span: 24,
              },
              {
                label: this.$t("system.user.lockingState"),
                prop: "isLock",
                type: "radio",
                dicData: [
                  {
                    label: this.$t("system.user.lock"),
                    value: "1",
                  },
                  {
                    label: this.$t("system.user.unLocked"),
                    value: "0",
                  },
                ],
                value: "0",
              },
            ],
          },
          {
            label: this.$t("system.user.additionalInformation"),
            prop: "detailInfo",
            icon: "el-icon-s-order",
            collapse: false,
            column: [
              {
                label: this.$t("system.user.dateOfBirth"),
                type: "date",
                prop: "birthday",
                format: "yyyy-MM-dd",
                valueFormat: "yyyy-MM-dd",
              },
              {
                label: this.$t("system.user.IDcard"),
                prop: "idcard",
                rules: getRules(["idCard"]),
              },
              {
                label: this.$t("system.user.politicalOutlook"),
                prop: "political",
                type: "select",
                dicUrl: getDictItemListByDictCodeURL,
                dicMethod: "post",
                dicQuery: {
                  code: "political",
                },
                props: {
                  label: "name",
                  value: "code",
                },
              },
              {
                label: this.$t("system.user.education"),
                prop: "education",
                type: "select",
                dicUrl: getDictItemListByDictCodeURL,
                dicMethod: "post",
                dicQuery: {
                  code: "education",
                },
                props: {
                  label: "name",
                  value: "code",
                },
              },
              {
                label: this.$t("system.user.zhiwu"),
                prop: "tel",
                // 职务
                // rules: getRules(["phone"]),
              },
              {
                label: this.$t("system.user.email"),
                prop: "email",
                rules: [
                  {
                    type: "email",
                    message:
                      this.$t("aicosCommon.pleaseInput") +
                      this.$t("system.user.emailTip"),
                    trigger: "blur",
                  },
                ],
              },
              {
                label: this.$t("system.user.qq"),
                prop: "qq",
                rules: [
                  ...getRules(['isQQ'])
                ],
              },
              {
                label: this.$t("system.user.fax"),
                prop: "fax",
                rules: [
                  ...getRules(['isFax'])
                ],
              },
              {
                label: this.$t("system.user.homeAddress"),
                prop: "address",
                overHidden: true,
                maxlength: 50,
                showWordLimit: true,
                rules: getRules(["charNumHanUnderline"]),
                span: 24,
              },
              {
                label: this.$t("system.user.post"),
                prop: "workPosition",
                overHidden: true,
                type: "select",
                dicUrl: getDictItemListByDictCodeURL,
                dicMethod: "post",
                dicQuery: {
                  code: "position_type",
                },
                props: {
                  label: "name",
                  value: "code",
                },
              },
              {
                label: this.$t("system.user.position"),
                prop: "deptPosition",
                type: "select",
                dicUrl: getDictItemListByDictCodeURL,
                dicMethod: "post",
                dicQuery: {
                  code: "work_type",
                },
                props: {
                  label: "name",
                  value: "code",
                },
              },
              {
                label: this.$t("system.user.employeeType"),
                prop: "workerType",
                type: "select",
                dicUrl: getDictItemListByDictCodeURL,
                dicMethod: "post",
                dicQuery: {
                  code: "worker_type",
                },
                props: {
                  label: "name",
                  value: "code",
                },
              },
              {
                label: this.$t("system.user.joinedDate"),
                type: "date",
                prop: "inDate",
                format: "yyyy-MM-dd",
                valueFormat: "yyyy-MM-dd",
                rules: [
                  {
                    validator: (rule, value, callback )=>{
                      this.checkThreeVal(rule, value, callback, "inDate" );
                    },
                    trigger: 'blur'
                  },
                ],
              },
              {
                label: this.$t("system.user.probationDate"),
                type: "date",
                prop: "changeDate",
                format: "yyyy-MM-dd",
                valueFormat: "yyyy-MM-dd",
                rules: [
                  {
                    validator: (rule, value, callback )=>{
                      this.checkThreeVal(rule, value, callback, "changeDate");
                    },
                    trigger: 'blur'
                  },
                ],
              },
              {
                label: this.$t("system.user.terminationDate"),
                type: "date",
                prop: "outDate",
                format: "yyyy-MM-dd",
                valueFormat: "yyyy-MM-dd",
                rules: [
                  {
                    validator: (rule, value, callback)=>{
                      this.checkThreeVal(rule, value, callback, "outDate");
                    },
                    trigger: 'blur'
                  },
                ],
              },
              {
                label: this.$t("system.user.remark"),
                prop: "remark",
                type: "textarea",
                maxlength: 100,
                showWordLimit: true,
                rules: getRules(["expectSpecials"]),
                span: 24,
              },
            ],
          },
        ],
      },
      data: [],
      treeItemId: "0",
      searchForm: {
        account: "",
        realName: "",
        status: "",
        isLock: "",
      },
      searchFieldList: [
        {
          prop: "account",
          placeholder:
            this.$t("aicosCommon.pleaseInput") +
            this.$t("system.user.userName"),
        },
        {
          prop: "realName",
          placeholder:
            this.$t("aicosCommon.pleaseInput") +
            this.$t("system.user.realName"),
        },
        {
          type: "select",
          prop: "status",
          placeholder:
            this.$t("aicosCommon.pleaseSelect") +
            this.$t("system.user.enableStatus"),
          dicData: [
            {
              label: this.$t("system.user.enable"),
              value: "1",
            },
            {
              label: this.$t("system.user.deactivate"),
              value: "0",
            },
          ],
        },
        {
          type: "select",
          prop: "isLock",
          placeholder:
            this.$t("aicosCommon.pleaseSelect") +
            this.$t("system.user.lockingState"),
          dicData: [
            {
              label: this.$t("system.user.lock"),
              value: "1",
            },
            {
              label: this.$t("system.user.unLocked"),
              value: "0",
            },
          ],
        },
      ],
    };
  },
  watch: {},
  computed: {
    ...mapGetters(["userInfo", "permission", "language"]),
    permissionList() {
      return {
        addBtn:
          this.isManager &&
          this.treeDeptId !== "0" &&
          this.vaildData(this.permission["system-user-save"], false),
        delMoreBtn:
          this.isManager &&
          this.treeDeptId !== "0" &&
          this.vaildData(this.permission["system-user-delMore"], false),
        viewBtn:
          //this.isManager &&
          this.vaildData(this.permission["system-user-view"], false),
        delBtn:
          this.isManager &&
          this.vaildData(this.permission["system-user-delete"], false),
        editBtn:
          this.isManager &&
          this.vaildData(this.permission["system-user-update"], false),
        enableStatus:
          this.isManager &&
          this.vaildData(this.permission["system-user-enableStatus"], false),
        enableLock:
          this.isManager &&
          this.vaildData(this.permission["system-user-enableLock"], false),
        resetPassword:
          this.isManager &&
          this.vaildData(this.permission["system-user-resetPassword"], false),
        // addBtn: this.treeDeptId !=='0',
        // viewBtn: true,
        // delBtn: true,
        // editBtn: true
      };
    },
  },
  mounted() {
    // 收起左侧菜单
    if (!this.$store.getters.isCollapse) {
      this.$store.commit("SET_COLLAPSE");
    }

    // this.isAdminToShowColumn();

    // 非租户模式默认加载管理组数据
    // if (!website.tenantMode) {
    //   this.initData(website.tenantId);
    // }
  },
  methods: {
    checkThreeVal(rule, value, callback, type ){
      // console.log(this.form);
      // console.log(this.form[type]);
      // console.log(value);

      // console.log(this.$refs.crud.$refs.dialogForm)
      // this.$refs.crud.$refs.dialogForm.$refs.tableForm.refclearValidate(['inDate','changeDate','outDate']);
      this.$refs.crud.$refs.dialogForm.$refs.tableForm.clearValidate(['inDate','changeDate','outDate'])

      let arrObj = {
        'inDate': new Date( this.form.inDate ).getTime(),
        'changeDate': new Date( this.form.changeDate ).getTime(),
        'outDate': new Date( this.form.outDate ).getTime(),
      };


      if( isNull(this.form[type])) {
        callback();
      }

      const { inDate, changeDate, outDate } = arrObj;
      // console.log(arrObj)

      let inDateText =  this.$t("system.user.joinedDate");
      let changeDateText =  this.$t("system.user.probationDate");
      let outDateText =  this.$t("system.user.terminationDate");
      let notEarlierText =  this.$t("system.user.notEarlier");


      if (inDate && !changeDate && !outDate) {
        callback();
      }else if(inDate && changeDate && !outDate){
        if( changeDate >= inDate ){
          callback();
        }else{
          callback(new Error(inDateText + notEarlierText + changeDateText));
        }

      }else if(inDate && changeDate && outDate){
        if( changeDate >= inDate ){
          if( outDate >= changeDate ){
            callback();
          }else{
            callback(new Error(changeDateText + notEarlierText + outDateText));
          }
        }else{
          callback(new Error(inDateText + notEarlierText + changeDateText));
        }

      }else if (inDate && !changeDate && outDate) {
        if( outDate >= inDate ){
          callback();
        }else{
          callback(new Error(inDateText + notEarlierText + outDateText));
        }
      }else if (!inDate) {
        if(changeDate || outDate){
          if(changeDate){
            callback(new Error(changeDateText + notEarlierText + inDateText));
          }else if(outDate){
            callback(new Error(inDateText + notEarlierText + outDateText));
          }
        }else{
          callback();
        }
      }else{
        callback();
      }



    },

    //根据是不是超管显示isAdmin字段
    // isAdminToShowColumn () {

    //   const isAdminColumn = this.findObject(this.option.group, "isAdmin");

    //   if (this.userInfo.isAdmin == 1 ) {
    //     // console.log("是超管");
    //     this.$set(isAdminColumn,'display', true);
    //   } else {
    //     // console.log("不是超管");
    //     this.$set(isAdminColumn,'display', false);

    //   }
    // },

    // nodeClick(data) {
    //   if (data.id === "0") {
    //     this.$message.error("不能选择部门目录");
    //     return;
    //   }
    //   if (data.isManager !== "1") {
    //     this.$message.error("没有部门权限，不能管理部门下的人员");
    //     return;
    //   }
    //   this.treeDeptId = data.id;
    //   this.treeDeptName = data.deptName;
    //   this.page.currentPage = 1;
    //   this.onLoad(this.page);

    //   // 修改人员时使用
    //   const deptId = this.findObject(this.option.group, "deptId");
    //   if (data.ancestors && data.ancestors !== "") {
    //     deptId.defaultExpandedKeys = data.ancestors.split(",");
    //   }
    // },
    handleDel() {
      if (this.selectionList.length == 0) {
        this.$message({
          type: "warning",
          message: this.$t("aicosCommon.chooseDataTip"),
        });
      } else {
        this.$confirm(
          this.$t("system.user.deleteTip") +
            this.selectionList.length +
            this.$t("system.user.countsTip"),
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
            this.$message({
              type: "success",
              message: this.$t("aicosCommon.successOperate"),
            });

            this.refreshChange();
          });
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
            message: this.$t("aicosCommon.successOperate"),
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
            message: this.$t("aicosCommon.successOperate"),
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
      this.$confirm(this.$t("aicosCommon.mutiDeleteConfirmTip"), {
        confirmButtonText: this.$t("aicosCommon.confirmBtn"),
        cancelButtonText: this.$t("aicosCommon.cancelBtn"),
        type: "warning",
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
    async enable(row) {
      let text =
        row.status === "1"
          ? this.$t("system.user.deactivate")
          : this.$t("system.user.enable");
      try {
        await this.$confirm(
          `${this.$t("system.user.confirmUserTip")}${text}?`,
          {
            confirmButtonText: this.$t("aicosCommon.confirmBtn"),
            cancelButtonText: this.$t("aicosCommon.cancelBtn"),
            type: "warning",
          }
        );
      } catch (e) {
        return;
      }
      const params = {
        id: row.id,
        status: row.status === "1" ? "0" : "1",
      };
      const { data } = await enableStatus(params);

      if (data.success) {
        this.$message.success(this.$t("aicosCommon.successOperate"));
        this.onLoad(this.page);
      }
    },
    async lock(row) {
      let text =
        row.isLock === "0"
          ? this.$t("system.user.lock")
          : this.$t("system.user.unLock");
      try {
        await this.$confirm(
          `${this.$t("system.user.confirmUserTip")}${text}?`,
          {
            confirmButtonText: this.$t("aicosCommon.confirmBtn"),
            cancelButtonText: this.$t("aicosCommon.cancelBtn"),
            type: "warning",
          }
        );
      } catch (e) {
        return;
      }
      const params = {
        id: row.id,
        isLock: row.isLock === "1" ? "0" : "1",
      };
      const { data } = await lockStatus(params);

      if (data.success) {
        this.$message.success(this.$t("aicosCommon.successOperate"));
        this.onLoad(this.page);
      }
    },

    copyNewPwd(text = " ") {
      this.$Clipboard({
        text: text,
      })
        .then(() => {
          this.$message.success(this.$t("aicosCommon.replicatingSuccessTip"));
        })
        .catch(() => {
          this.$message.error(this.$t("aicosCommon.copyFailedTip"));
        });
    },

    async resetPwd(row) {
      const newPassword = this.$store.state.common.systemParam.defaultPassword;
      const params = {
        account: row.account,
        newPassword: newPassword,
      };
      const { data } = await resetPasswordyh(params);
      if (data.success) {
        // this.$message.success("操作成功！");

        this.$msgbox({
          title: this.$t("system.user.tip"),
          message: this.$t("system.user.resetPassWordTip") + newPassword,
          showCancelButton: true,
          confirmButtonText: this.$t("aicosCommon.copyBtn"),
          cancelButtonText: this.$t("aicosCommon.confirmBtn"),
          cancelButtonClass: "el-button--primary",
          confirmButtonClass: "el-button--success",
        }).then((action) => {
          if (action === "confirm") {
            this.copyNewPwd(newPassword);
          }
        });

        this.onLoad(this.page);
      }
    },
    searchChange() {
      this.query = {
        ...this.searchForm,
      };
      this.page.currentPage = 1;
      this.onLoad();
    },
    selectionChange(list) {
      this.selectionList = list;
    },
    async beforeOpen(done, type) {
      if (type !== "view") {
        this.option.labelPosition = this.language == "en" ? "top" : "right";
      }

      const isAdminColumn = this.findObject(this.option.group, "isAdmin");

      if (this.userInfo.isAdmin == 1) {
        if (this.form.isAdmin == 1) {
          // console.log("是超管 又是在查看或编辑超管的信息");
          this.$set(isAdminColumn, "display", false);
        } else {
          // console.log("是超管 但不是在查看或编辑超管的信息");
          this.$set(isAdminColumn, "display", true);
        }
      } else {
        // console.log("不是超管，不管在查看或编辑谁的信息");
        this.$set(isAdminColumn, "display", false);
      }

      if (type === "add") {
        this.form.directLeader = {
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
        await getUserAllInfo(this.form.id).then(async (res) => {
          const data = res.data.data;
          Reflect.deleteProperty(data, "tenantId");
          // setTimeout(()=> {
          // if(type === 'edit') {
          //   // const deptInput = this.$refs.crud.$refs.dialogForm.$refs.tableForm.$refs.deptId[0].$refs.temp;
          //   // deptInput.created = true;
          //   new Promise((resolve) => {
          //     this.editDeptIdPromiseResolve = resolve
          //   }).then(() => {
          //     this.form = data;
          //   })
          // }else {
          //   this.form = data;
          // }
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
      // if (this.treeDeptId == "0" && !treeItemId) {
      //   return;
      // }
      // if (!page) {
      //   return;
      // }
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
          if (this.language != "zh") {
            this.option.column.forEach((item) => {
              let width = getTextWidth(item.label).nodeWidth + 80;
              if (item.width) {
                if (width < item.width) {
                  return;
                }
                this.$set(item, "width", width);
              } else {
                this.$set(item, "minWidth", width);
              }
            });
          }
          this.loading = false;
        }
      );
    },
    nodeClick(data /*, node, root*/) {
      // eslint-disable-line
      this.treeDeptId = data.id;
      this.treeDeptName = data.deptName;
      this.isManager = false;
      //if (data.isManager === "0" || data.id ==="0") {
      if (data.isManager === "0") {
        this.isManager = false;
      } else {
        this.isManager = true;
      }
      this.onLoad(this.page, {}, data.id);
    },
    handleAdd() {
      this.$refs.crud.rowAdd();
    },
    getRowActions(row) {
      let userIsAdmin = this.userInfo.isAdmin;
      let canHandel = false;
      if (userIsAdmin == 1 && row.isAdmin != 1) {
        // console.log("当前是超管, 并且当前行不是超管");
        canHandel = true;
      } else if (userIsAdmin == 3 && row.isAdmin == 0) {
        // console.log("当前是租户管理员，并且当前行是普通用户");
        canHandel = true;
      } else if (userIsAdmin == 0 && row.isAdmin == 0) {
        //console.log("当前是普通用户，并且当前行是普通用户");
        if (this.userInfo.account == row.account) {
          // console.log('当前普通用户是自己，不可以操作')
          canHandel = false;
        } else {
          // console.log('当前普通用户不是自己，可以操作')
          canHandel = true;
        }
      }

      const map = {
        viewBtn: {
          name: this.$t("aicosCommon.viewBtn"),
          command: "rowView",
          canHandel: true,
        },
        delBtn: {
          name: this.$t("aicosCommon.delBtn"),
          command: "rowDel",
          canHandel: canHandel,
        },
        editBtn: {
          name: this.$t("aicosCommon.editBtn"),
          command: "rowEdit",
          canHandel: canHandel,
        },
        enableStatus: {
          name:
            row.status === "1"
              ? this.$t("system.user.deactivate")
              : this.$t("system.user.enable"),
          command: "enable",
          canHandel: canHandel,
        },
        enableLock: {
          name:
            row.isLock === "0"
              ? this.$t("system.user.lock")
              : this.$t("system.user.unLock"),
          command: "lock",
          canHandel: canHandel,
        },
        resetPassword: {
          name: this.$t("system.user.resetPwd"),
          command: "resetPwd",
          canHandel: true,
        },
      };
      const list = [
        "viewBtn",
        "editBtn",
        "enableStatus",
        "enableLock",
        "resetPassword",
        "delBtn",
      ];
      const actions = [];

      list.forEach((item) => {
        if (this.permissionList[item] && map[item].canHandel) {
          actions.push(map[item]);
        }
      });
      return actions;
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
