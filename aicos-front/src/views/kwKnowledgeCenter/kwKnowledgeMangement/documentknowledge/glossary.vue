<template>
  <div class="glossary">
    <div class="result">
      <template v-if="listData.length > 0">
        <div v-for="(obj, i) in listData" :key="i">
          <el-checkbox-group v-model="checkedCities" @change="handleCheckedCitiesChange">
            <Resultcommon :item="obj" @handle="handleResult" :question="obj.properWord" />
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
    <HuilanDialog :title="$t('doc.editProprietaryWords')" append-to-body :visible.sync="glossaryDialog" width="40%">
      <Glossaryadd :markForm="editObj" ref="glossaryadd" :key="new Date().getTime()" tool="edit" />
      <template v-slot:footer>
        <el-button size="small" @click="glossaryDialog = false">{{
          $t("aicosCommon.cancelBtn")
        }}</el-button>
        <el-button size="small" type="primary" @click="handlerSaveGlossary" :disabled="disable">{{
          $t("aicosCommon.saveBtn") }}</el-button>
      </template>
    </HuilanDialog>
  </div>
</template>
<script>
import {
  selectProperByKnId,
  deleteProperById,
  updateProper,
  deleteProperBatch,
} from "@/api/kwKnowledgeCenter/kwKnowledgeMangement/documentknowledge/index";
import Resultcommon from "./resultcommon";
import Glossaryadd from "./glossaryadd";
export default {
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
  components: {
    Resultcommon,
    Glossaryadd,
  },
  data () {
    return {
      disable: false,
      checkAll: false,
      isIndeterminate: false,
      listData: [],
      checkedCities: [],
      glossaryDialog: false,
      editObj: {},
    };
  },
  mounted () {
    this.getList();
  },
  methods: {
    // 获取专有词所有数据
    getList () {
      selectProperByKnId({ fileKnowledgeId: this.markForm.id }).then((res) => {
        if (res.data.success) {
          if (res.data.data !== null) {
            this.listData = res.data.data;
          } else {
            this.listData = [];
          }
          this.$emit("handelReslut", this.listData);
        }
      });
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
    // 编辑or删除
    handleResult (val) {
      if (val.type === "del") {
        this.$confirm(this.$t('doc.deleteDataTips'), {
          confirmButtonText: this.$t('aicosCommon.confirmBtn'),
          cancelButtonText: this.$t('aicosCommon.cancelBtn'),
          type: "warning",
        }).then(() => {
          deleteProperById({ id: val.id }).then((res) => {
            if (res.data.success) {
              this.$message.success(this.$t('aicosCommon.successOperate'));
              this.getList();
            }
          });
        });
      }
      if (val.type === "edit") {
        this.editObj = val;
        this.glossaryDialog = true;
      }
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
        deleteProperBatch({ id: this.checkedCities.join(",") }).then((res) => {
          if (res.data.success) {
            this.$message.success(this.$t('aicosCommon.successOperate'));
            this.getList();
          }
        });
      });
    },
    // 专有词编辑保存
    handlerSaveGlossary () {
      const faqBasicForm = this.$refs.glossaryadd.$refs.faqBasicFormRef;
      new Promise((resolve) => {
        faqBasicForm.validate((validate) => {
          if (validate) {
            const data = this.$refs.glossaryadd.saveFaqBasic();
            if (this.editObj.properWord !== data.properWord) {
              if (this.text.indexOf(data.properWord) === -1) {
                data.start = "0";
                data.end = "0";
              } else {
                data.start = this.text.indexOf(data.properWord);
                data.end =
                  Number(this.text.indexOf(data.properWord)) +
                  Number(data.properWord.length);
              }
            }
            this.disable = true;
            updateProper(data)
              .then((res) => {
                if (res.data.success) {
                  this.$message.success(this.$t('aicosCommon.editSuccessTip'));
                  this.glossaryDialog = false;
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
.glossary {
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
