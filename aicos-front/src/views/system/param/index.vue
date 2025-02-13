<template>
  <HuilanBasic :left-width="240">
    <template v-slot:left>
      <div class="box">
        <el-scrollbar>
          <jurisdictionBtn ref="treeRef" :getSysParamList="api" :nodeClick="nodeClick" :parentformOption="formOption"
            :dictName="dictName" :saveCurent="save" :rowDelCurent="rowDel" />
        </el-scrollbar>
      </div>
    </template>
    <ParamItemList ref="itemList" :parentId="parentId" />
  </HuilanBasic>
</template>

<script>
import {
  // getChildList,
  remove,
  update,
  add,
  getSysParamList,
  // addDictItem,
  // updateDictItem,
  // removeDictItem
  // getDict,
  // getDictTree
} from "@/api/system/param";
import { mapGetters } from "vuex";
import ParamItemList from "./paramItemList";
import { getRules } from "@/util/regx";
import treeNodeMixin from "@/views/resourceCenter/treeNodeMixin";
import jurisdictionBtn from "@/components/TreeSelect/jurisdictionBtn";
export default {
  mixins: [treeNodeMixin],
  components: {
    ParamItemList,
    jurisdictionBtn,
  },
  data () {
    return {
      api: null,
      treeData: [],
      maps: new Map(),
      formOption: {
        emptyBtn: false,
        submitIcon: "el-icon-circle-check",
        labelPosition: 'top',
        column: [
          {
            label: this.$t('system.param.parameterCoding'),
            prop: "code",
            search: true,
            disabled: false,
            span: 24,
            maxlength: 50,
            showWordLimit: true,
            rules: [
              {
                required: true,
                message: this.$t('aicosCommon.pleaseInput') + this.$t('system.param.parameterCoding'),
                trigger: "blur",
              },
              ...getRules(["charNumLine"]),
            ],
          },
          {
            label: this.$t('system.param.parameterName'),
            prop: "name",
            search: true,
            align: "center",
            span: 24,
            maxlength: 50,
            showWordLimit: true,
            rules: [
              {
                required: true,
                message: this.$t('aicosCommon.pleaseInput') + this.$t('system.param.parameterName'),
                trigger: "blur",
              },
              ...getRules(["charNumHanUnderline"]),
            ],
          },
          {
            label: this.$t('system.param.parameterType'),
            prop: "type",
            search: true,
            align: "center",
            type: "select",
            span: 24,
            value: "user",
            editDisabled: false,
            disabled: false,
            dicData: [
              {
                label: this.$t('system.param.systemLevel'),
                value: "system",
              },
              {
                label: this.$t('system.param.userLevel'),
                value: "user",
              },
            ],
            rules: [
              {
                required: true,
                message: this.$t('aicosCommon.pleaseInput') + this.$t('system.param.parameterType'),
                trigger: "blur",
              },
            ],
          },
          {
            label: this.$t('system.param.parameterRemark'),
            prop: "remark",
            type: "textarea",
            maxlength: 100,
            showWordLimit: true,
            span: 24,
            rules: getRules(["expectSpecials"], this),
            hide: true,
          },
        ],
      },
      dictName: "",
      parentId: "",
      formParent: {},
      selectionList: [],
      query: {},
      loading: true,
      loadingChild: true,
      pageParent: {
        pageSize: 10,
        pageSizes: [10, 30, 50, 100, 200],
        currentPage: 1,
        total: 0,
      },
      dataParent: [],
      itemDialogVisible: false,
      editItem: false, //编辑时存储当前行数据
      // flag: 0, //判断是编辑还是新增
      resolve: null, //保存刷新leftTree
    };
  },
  computed: {
    ...mapGetters(["permission", "userInfo"]),
  },
  created () {
    this.formOption.column.map((v) => {
      if (v.prop === "type" && this.userInfo.isAdmin != "1") {
        v.disabled = true;
      }
    });
    this.api = getSysParamList;
  },
  mounted () {
    // 收起左侧菜单
    if (!this.$store.getters.isCollapse) {
      this.$store.commit("SET_COLLAPSE");
    }
  },
  methods: {
    rowUpdate (parent, data, done, loading, parmasData) {
      // this.form = row
      const form = parmasData.form;
      const parmas = { ...form };
      update(parmas).then(
        () => {
          this.$message({
            type: "success",
            message: this.$t('aicosCommon.successOperate')
          });
          this.$refs.treeRef.itemDialogVisible = false;
          const currentKey = "0";
          const node = {
            data: { id: currentKey },
          };
          this.$refs.treeRef.treeOption.treeOption.treeLoad(
            node,
            parmasData.resolve
          );
          // done();
        },
        (error) => {
          window.console.log(error);
          // loading();
          this.$refs.treeRef.itemDialogVisible = false;
          // done();
        }
      );
    },
    rowDel (data, done, resolve) {
      remove(data.id).then(
        () => {
          this.$message({
            type: "success",
            message: this.$t('aicosCommon.successOperate')
          });
          const currentKey = "0";
          const node = {
            data: { id: currentKey },
          };
          this.$refs.treeRef.treeOption.treeOption.treeLoad(node, resolve);
        },
        (error) => {
          window.console.log(error);
        }
      );
    },
    nodeClick (data) {
      if (Array.isArray(data)) {
        this.parentId = data[0].id;
        this.dictName = data[0].name;
      } else {
        this.parentId = data.id;
        this.dictName = data.name;
      }
    },
    save (parent, data, done, loading, parmas) {
      const scop = this;
      const form = {
        ...parmas.form,
      };
      if (parmas.flag === 1) {
        add(form).then(
          () => {
            parmas.itemDialogVisible = false;
            const currentKey = parmas.leftTree.getCurrentKey();
            const node = {
              data: { id: currentKey },
            };
            scop.$refs.treeRef.treeOption.treeOption.treeLoad(
              node,
              parmas.resolve
            );
            scop.$message({
              type: "success",
              message: this.$t('aicosCommon.successOperate')
            });
            scop.$refs.treeRef.itemDialogVisible = false;
          },
          (error) => {
            window.console.log(error);
            scop.$refs.treeRef.itemDialogVisible = false;
          }
        );
      } else {
        this.rowUpdate(parent, data, done, loading, parmas);
      }
    },
  },
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

.dialog {
  /deep/ {
    .el-form-item__content {
      text-align: right;
    }

    .el-dialog__body {
      padding-bottom: 0;
    }
  }
}
</style>
