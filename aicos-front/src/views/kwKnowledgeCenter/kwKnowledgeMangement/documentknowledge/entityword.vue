<template>
  <div class="entityword">
    <div class="result">
      <template v-if="listData.length > 0">
        <div v-for="(obj, i) in listData" :key="i">
          <el-checkbox-group v-model="checkedCities" @change="handleCheckedCitiesChange">
            <Resultcommon :item="obj" :question="obj.entityWord" @handle="handleResult" />
          </el-checkbox-group>
        </div>
      </template>
      <template v-else>
        <div class="empty">{{ $t('doc.noResultsTips') }}</div>
      </template>
    </div>
    <div class="tool">
      <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">{{ $t('doc.all')
      }}</el-checkbox>
      <el-button type="text" @click="handelDel">{{ $t('aicosCommon.batchDeleteBtn') }}</el-button>
    </div>
    <HuilanDialog :title="$t('doc.editAnInstance')" append-to-body :visible.sync="entitywordDialog" width="40%">
      <Entityworddadd :markForm="editObj" ref="entitywordadd" tool="edit" :key="new Date().getTime()" />
      <template v-slot:footer>
        <el-button size="small" @click="entitywordDialog = false">{{
          $t("aicosCommon.cancelBtn")
        }}</el-button>
        <el-button size="small" type="primary" @click="handlerEntityword" :disabled="disable">{{ $t("aicosCommon.saveBtn")
        }}</el-button>
      </template>
    </HuilanDialog>
  </div>
</template>
<script>
import Resultcommon from "./resultcommon";
import {
  selectEntityWordByKnId,
  deleteEntityWordById,
  updateEntityWord,
  deleteEntityWordBatch,
} from "@/api/kwKnowledgeCenter/kwKnowledgeMangement/documentknowledge/index";
import Entityworddadd from "./entityworddadd";
export default {
  components: {
    Resultcommon,
    Entityworddadd,
  },
  props: {
    markForm: {
      type: Object,
      default: () => {
        return {};
      },
    },
    text: {
      type: String,
      default: "",
    },
  },
  data () {
    return {
      disable: false,
      checkAll: false,
      isIndeterminate: false,
      listData: [],
      checkedCities: [],
      entitywordDialog: false,
      editObj: {},
    };
  },
  mounted () {
    this.getList();
  },
  methods: {
    // 获取全部实例
    getList () {
      selectEntityWordByKnId({ fileKnowledgeId: this.markForm.id }).then(
        (res) => {
          if (res.data.success) {
            if (res.data.data !== null) {
              this.listData = res.data.data;
            } else {
              this.listData = [];
            }
          }
          this.$emit("handelReslut", this.listData);
        }
      );
    },
    // 编辑or删除
    handleResult (val) {
      if (val.type === "del") {
        this.$confirm(this.$t('doc.deleteDataTips'), {
          confirmButtonText: this.$t('aicosCommon.confirmBtn'),
          cancelButtonText: this.$t('aicosCommon.cancelBtn'),
          type: "warning",
        }).then(() => {
          deleteEntityWordById({ id: val.id }).then((res) => {
            if (res.data.success) {
              this.$message.success(this.$t('aicosCommon.successOperate'));
              this.getList();
            }
          });
        });
      }
      if (val.type === "edit") {
        this.editObj = val;
        this.entitywordDialog = true;
      }
    },
    handleCheckedCitiesChange(value) {
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.listData.length;
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.listData.length;
    },
    // 全选逻辑
    handleCheckAllChange (val) {
      if (val) {
        this.listData.map((item) => {
          this.checkedCities.push(item.id);
        });
      } else {
        this.checkedCities = [];
      }
      this.isIndeterminate = false;
    },
    handelDel () {
      if (this.checkedCities.length === 0) {
        this.$message.warning(this.$t('doc.selectAnnotationTips'));
        return;
      }
      this.$confirm(this.$t('aicosCommon.mutiDeleteConfirmTip'), {
        confirmButtonText: this.$t('aicosCommon.confirmBtn'),
        cancelButtonText: this.$t('aicosCommon.cancelBtn'),
        type: "warning",
      }).then(() => {
        deleteEntityWordBatch({ id: this.checkedCities.join(",") }).then(
          (res) => {
            if (res.data.success) {
              this.$message.success(this.$t('aicosCommon.successOperate'));
              this.getList();
            }
          }
        );
      });
    },
    // 编辑实例
    handlerEntityword () {
      const faqBasicForm = this.$refs.entitywordadd.$refs.faqBasicFormRef;
      new Promise((resolve) => {
        faqBasicForm.validate((validate) => {
          if (validate) {
            const data = this.$refs.entitywordadd.saveFaqBasic();
            if (this.editObj.entityWord !== data.entityWord) {
              if (this.text.indexOf(data.entityWord) === -1) {
                data.start = "0";
                data.end = "0";
              } else {
                data.start = this.text.indexOf(data.entityWord);
                data.end =
                  Number(this.text.indexOf(data.entityWord)) +
                  Number(data.entityWord.length);
              }
            }
            this.disable = true;
            updateEntityWord(data)
              .then((res) => {
                if (res.data.success) {
                  this.$message.success(this.$t('aicosCommon.editSuccessTip'));
                  this.entitywordDialog = false;
                  this.disable = false;
                  this.getList();
                }
              })
              .catch(() => {
                this.disable = false;
              });
            resolve();
          }
        });
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.entityword {
  .result {
    height: 500px;
    overflow: auto;
    padding: 10px;
    padding-bottom: 0px;

    .el-checkbox-group {
      font-size: 16px;
      margin-bottom: 10px;
    }
  }

  .tool {
    border-top: 1px solid #c4c4c4;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .empty {
    text-align: center;
    margin-top: 200px;
  }
}
</style>
