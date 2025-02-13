<template>


  <HuilanBasic>

    <avue-crud :option="option" :table-loading="loading" :data="data" :page="page" :permission="permissionList"
               :before-open="beforeOpen" v-model="form" ref="crud" @row-update="rowUpdate" @row-save="rowSave"
               @row-del="rowDel"
               @search-change="searchChange" @search-reset="searchReset" @selection-change="selectionChange"
               @current-change="currentChange" @size-change="sizeChange" @on-load="onLoad">
      <template slot-scope="scope" slot="menuLeft">
        <el-button v-if="permissionList.addBtn" size="small" icon="el-icon-plus" type="primary" @click="handleAdd">
          新增
        </el-button>
        <!--                <el-button v-if="permissionList.addBtn" size="small" icon="el-icon-delete" type="primary" @click="handleDel">-->
        <!--                  批量删除-->
        <!--                </el-button>-->
      </template>
      <template v-slot:menu="scope">
        <el-button type="text" size="small" v-if="permissionList.viewBtn"
                   @click="handleView(scope.row,scope.index)">查看
        </el-button>
        <el-button type="text" size="small" v-if="permissionList.updateBtn"
                   @click="handleUpdate(scope.row,scope.index)">编辑
        </el-button>
        <el-button type="text" size="small" v-if="permissionList.delBtn"
                   @click="handelDel(scope.row)">删除
        </el-button>
        <el-button type="text" size="small" v-if="permissionList.examineBtn"
                   @click="handelExamine(scope.row)">审核
        </el-button>
        <!-- <el-button type="text" size="small" v-if="permissionList.enableStatus"
                   @click="handelStatus(scope.row)">{{scope.row.status === '0' ? enable : deactivate}}
        </el-button> -->
        <!--        <el-button type="text" size="small" v-if="permissionList.enableLock"-->
        <!--                   @click="handelLock(scope.row)">锁定-->
        <!--        </el-button>-->
        <el-button type="text" size="small" v-if="permissionList.resetPassword"
                   @click="handelResetPassword(scope.row)">重置密码
        </el-button>
      </template>
    </avue-crud>
  </HuilanBasic>
</template>

<script>
import {mapGetters} from "vuex";
import FormPreview from "@/components/formPreview";
import {complete, disagree, getList, updateMemberInfo, addMemberInfo} from "@/api/system/member"
import {deleteBatch, enableStatus, remove, resetPassword} from "@/api/system/user";
import {baseURL} from "@/api/common";

export default {
  components: {FormPreview},
  data() {
    var lianxfs = (rule, value, callback) => {
      const regMobile = /^1(3|4|5|6|7|8|9)\d{9}$/
      if (!regMobile.test(value)) {
        callback(new Error('请输入正确的手机号'))
      } else {
        callback()
      }
    }
    return {
      enable:this.$t("system.user.enable"),
      deactivate:this.$t("system.user.deactivate"),
      enableLockText: '',
      // 上传数据
      fileList: [],
      // 表单样式
      labelPosition: 'right',
      memberShow: false,
      tableDatashenhe: {},
      addressData: [],
      dataJson: {},
      form: {},
      query: {},
      loading: true,
      page: {
        pageSize: 10,
        currentPage: 1,
        total: 0,
        pageSizes: [10, 20, 30, 40, 50, 100],
      },
      selectionList: [],
      option: {
        align: 'center',
        searchShow: true,
        searchMenuSpan: 6,
        tip: false,
        border: true,
        addBtn: false,
        editBtn: false,
        delBtn: false,
        index: true,
        indexLabel: '序号',
        indexWidth: 100,
        viewBtn: false,
        selection: true,
        labelPosition: 'right',
        labelSuffix: '',
        labelWidth: 120,
        gutter: 0,
        submitBtn: true,
        submitText: '提交',
        emptyBtn: true,
        emptyText: '清空',
        menuAlign: 'center',
        menuPosition: 'center',
        menuWidth: 400,
        isCustom: false,
        column: [
          {
            type: 'input',
            label: '登录账号',
            span: 24,

            display: true,
            hideLabel: false,
            dataType: '',
            prop: 'loginName',
            isListDisplay: true,
            search: true,
            required: true,
            rules: [],
            showWordLimit: true,
            clearable: false
          },
          {
            type: 'select',
            label: '用户类型',
            hide:false,
            cascaderItem: [],
            span: 24,
            display: true,
            props: {
              label: 'name',
              value: 'value'
            },
            hideLabel: false,
            dataType: '',
            prop: 'extendField1',
            isListDisplay: true,
            search: false,
            dicUrl: '/aicos/api/aicos-system/baseDict/getDictItemListByDictCode',
            dicMethod: 'post',
            dicQuery: {
              code: 'yhlx'
            },
            rules: [],
          },
          {
            type: 'input',
            label: '姓名',
            hide:true,
            span: 24,
            display: false,
            hideLabel: false,
            dataType: '',
            prop: 'realName',
            isListDisplay: true,
            search: false,
            required: true,

            showWordLimit: true,
            clearable: false
          },
          {
            type: 'input',
            label: '单位名称',
            hide:false,
            span: 24,
            display: true,
            hideLabel: false,
            dataType: '',
            prop: 'extendField3',
            isListDisplay: true,
            search: true,
            required: true,
            showWordLimit: true,
            clearable: false
          },
          {
            type: 'input',
            label: '联系人',
            hide:false,
            span: 24,
            display: true,
            hideLabel: false,
            dataType: '',
            prop: 'extendField4',
            isListDisplay: true,
            search: false,
            required: true,
            rules: [],
            showWordLimit: true,
            clearable: false
          },
          {
            type: 'input',
            label: '职务',
            hide:true,
            span: 24,
            display: false,
            hideLabel: false,
            dataType: '',
            prop: 'zhiwu',
            isListDisplay: true,
            search: false,
            required: true,
            rules: [],
            showWordLimit: true,
            clearable: false
          },
          {
            type: 'input',
            label: '联系电话',
            hide:false,
            span: 24,
            display: true,
            hideLabel: false,
            dataType: '',
            prop: 'extendField5',
            isListDisplay: true,
            search: false,
            required: true,
            rules: [],
            showWordLimit: true,
            clearable: false
          },
          {
            type: 'input',
            label: '邮箱',
            hide:true,
            span: 24,
            display: true,
            hideLabel: false,
            dataType: '',
            prop: 'email',
            isListDisplay: true,
            search: false,
            required: true,
            rules: [],
            showWordLimit: true,
            clearable: false
          },
          {
            type: 'upload',
            label: '头像',
            hide:true,
            span: 24,
            display: true,
            showFileList: true,
            multiple: false,
            limit: 1,
            accept: 'image/png, image/jpeg',
            fileSize: 10000,
            tip: '只能上传jpg/png，且不超过10M',
            action: '/aicos/api/aicos-file/miniofile/upload',
            propsHttp: {
              // home: '/aicos',
              url: 'newFileName',
              name: 'oldFileName',
              res: 'data',
              fileName: 'file'
            },
            uploadAfter(res, show) {
              const base = baseURL.replace(/\/$/, '');
              res.newFileName = base + res.newFileName;
              show(res)
            },
            canvasOption: {},
            hideLabel: false,
            dataType: '',
            prop: 'avatar',
            isListDisplay: true,
            search: false,
            listType: 'picture-img',
            required: false,
            rules: [],
            data: {
              fromSystemName: 'base'
            }
          },
          // {
          //   label: this.$t("system.user.enableStatus"),
          //   prop: "status",
          //   type: "radio",
          //   display: false,
          //   search: false,

          //   dicData: [
          //     {
          //       label: this.$t("system.user.enable"),
          //       value: "1",
          //     },
          //     {
          //       label: this.$t("system.user.deactivate"),
          //       value: "0",
          //     },
          //   ],
          //   value: "1",
          //   span: 24,
          // },
          {
            label: this.$t("system.user.examineStatus"),
            prop: "extendField8",
            search: true,
            display: false,

            // search: true,
            // searchSpan: 4,
            type: "radio",
            dicData: [
              {
                label: this.$t("system.user.unaudited"),
                value: "1",
              },
              {
                label: this.$t("system.user.complete"),
                value: "2",
              },
              {
                label: this.$t("system.user.disagree"),
                value: "3",
              },
            ],
          },
        ],
      },
      data: []
    };
  },

  computed: {
    ...mapGetters(["permission"]),
    permissionList() {
      return {
        addBtn: this.vaildData(
          this.permission["system-member-save"],
          false
        ),
        viewBtn: this.vaildData(
          this.permission["system-member-view"],
          false
        ),
        updateBtn: this.vaildData(
          this.permission[`system-member-update`],
          false
        ),
        delBtn: this.vaildData(
          this.permission[`system-member-delete`],
          false
        ),
        //审核
        examineBtn: this.vaildData(
          this.permission[`system-user-examineBtn`],
          false
        ),
        // 用户停用、启用
        enableStatus: this.vaildData(
          this.permission[`system-member-enableStatus`],
          false
        ),
        // 用户锁定
        enableLock: this.vaildData(
          this.permission[`system-member-enableLock`],
          false
        ),
        // 重置密码
        resetPassword: this.vaildData(
          this.permission[`system-member-resetPassword`],
          false
        ),
      };
    },
    ids() {
      let ids = [];
      this.selectionList.forEach(ele => {
        ids.push(ele.id);
      });
      return ids.join(",");
    }
  },
  mounted() {
    // this.setMenuWidth()
  },
  created() {

  },
  methods: {
    setMenuWidth () {
      setTimeout(() => {
        let width = 0;
        let list = document.querySelectorAll('.avue-crud__menu');
        list.forEach(ele => {
          let childList = ele.children
          let allWidth = 0;
          for (let i = 0; i < childList.length; i++) {
            const child = childList[i]
            allWidth += child.offsetWidth + 18
          }
          if (allWidth >= width) width = allWidth
        })
        this.option.menuWidth = width
      })
    },

    //
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
    // 重置密码
    handelResetPassword(row) {
      const newPassword = this.$store.state.common.systemParam.defaultPassword;
      const params = {
        loginName: row.loginName,
        newPassword: newPassword,
      };
      resetPassword(params).then((res) => {
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
      }).catch((res) => {
        this.$message.error(res.msg);
      })
    },

    // 启用
    handelStatus(row) {
      let text =
        row.status === "1"
          ? this.$t("system.user.deactivate")
          : this.$t("system.user.enable");
      this.$confirm(`${this.$t("system.user.confirmUserTip")}${text}?`, '提示', {
        confirmButtonText: this.$t("aicosCommon.confirmBtn"),
        cancelButtonText: this.$t("aicosCommon.cancelBtn"),
        type: 'warning'
      }).then(() => {
        const params = {
          id: row.id,
          status: row.status === "1" ? "0" : "1",
        };
        enableStatus(params).then((res) => {
          if (res.code === 200) {
            this.$message.success(this.$t("aicosCommon.successOperate"));
          }
        })
          .then(() => {
            this.onLoad(this.page)
          })
      }).catch(() => {

      });
    },
    // 审核
    handelExamine(row) {

      let text = this.$t("system.user.examine");
      this.$confirm(`${this.$t("system.user.confirmUserTip")}${text}?`, '提示', {
        confirmButtonText: '通过',
        cancelButtonText: '拒绝',
        type: 'warning'
      }).then(() => {
        const params = {
          id: row.id
        }
        complete(params).then((res) => {
          if (res.code === 200) {
            this.$message({
              type: 'success',
              message: '审核成功!'
            });
          }
        })
          .then(() => {
            this.onLoad(this.page)
          })
      }).catch(() => {
        const params = {
          id: row.id
        }
        disagree(params).then((res) => {
          if (res.code === 200) {
            this.$message({
              type: 'info',
              message: '已拒绝'
            });
          }
        })
          .then(() => {
            this.onLoad(this.page)
          })
      });

    },

    // 新增row
    handleAdd() {
      this.option.submitBtn = true;
      this.option.emptyBtn = true;

      for (var i = 0; i < this.option.column.length; i++) {
        this.$set(this.option.column[i], 'disabled', false)
      }
      this.$refs.crud.rowAdd();
    },
    // 批量删除
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
    // 验证表格格式
    beforeAvatarUpload(file) {
      // 通过split方法和fileArr方法获取到文件的后缀名
      let fileArr = file.name.split('.')
      let suffix = fileArr[fileArr.length - 1]
      if (!/(xls|xlsx)/i.test(suffix)) {
        this.$message({
          message: "文件格式错误！",
          type: 'error'
        })
        return false
      }
      return true
    },

    rowSave(row, done, loading) {
      addMemberInfo(row).then(() => {
        done();
        this.onLoad(this.page);
        this.$message({
          type: "success",
          message: "添加成功！"
        });
      }, error => {
        window.console.log(error);
        loading();
      });

    },
    rowUpdate(row, index, done, loading) {
      updateMemberInfo(row).then(() => {
        done();
        this.onLoad(this.page);
        this.$message({
          type: "success",
          message: "修改成功!"
        });
      }, error => {
        window.console.log(error);
        loading();
      });
    },
    handleView(row, index) {
      this.$refs.crud.rowView(row, index);
    },
    handleUpdate(row, index) {
      this.$refs.crud.rowEdit(row, index);
    },
    handelDel(row) {
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

    // 用户停用、启用
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
      const {data} = await enableStatus(params);

      if (data.success) {
        this.$message.success(this.$t("aicosCommon.successOperate"));
        this.onLoad(this.page);
      }
    },

    beforeOpen(done, type) {
      if (["add", "edit", "view"].includes(type)) {
        this.initData(type);
      }
      done();
    },

    initData(/*type*/) {
    },

    searchReset() {
      this.query = {};
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
    selectionClear() {
      this.selectionList = [];
      this.$refs.crud.toggleSelection();
    },
    currentChange(currentPage) {
      this.page.currentPage = currentPage;
    },
    sizeChange(pageSize) {
      this.page.pageSize = pageSize;
    },
    onLoad(page, params = {}) {
      this.loading = true;
      var obj = {
        ...this.query,
      };
      getList(obj, page.currentPage, page.pageSize).then(res => {
        const data = res.data.data;
        this.page.total = data.total;
        this.page.pageSize = data.size;
        this.page.currentPage = data.current;
        this.data = data.records;
        if (data.records.isLock === 0) {
          this.enableLockText = '解锁'
        }
        this.loading = false;
        this.selectionClear();
      });
    }
  }
};
</script>

<style lang="scss" scoped>

</style>
