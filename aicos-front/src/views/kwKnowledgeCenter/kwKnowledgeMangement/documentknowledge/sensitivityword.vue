<template>
  <div class="sensitivityword">
    <div class="result">
      <template v-if="listData.length > 0">
        <div v-for="(obj, i) in listData" :key="i">
          <el-checkbox-group v-model="checkedCities" @change="handleCheckedCitiesChange">
            <Resultcommon :item="obj" :question="obj.sensitiveWord" @handle="handleResult" />
          </el-checkbox-group>
        </div>
      </template>
      <template v-else>
        <div class="empty">{{ $t("doc.noResultsTips") }}</div>
      </template>
    </div>
    <div class="tool">
      <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">{{ $t("doc.all")
      }}</el-checkbox>
      <el-button type="text" @click="handelDel">{{ $t("aicosCommon.batchDeleteBtn") }}</el-button>
    </div>
    <HuilanDialog :title="$t('doc.editSensitiveWords')" append-to-body :visible.sync="sensitivitywordDialog" width="40%">
      <Sensitivitywordadd :markForm="editObj" :key="new Date().getTime()" tool="edit" ref="sensitivitywordadd" />
      <template v-slot:footer>
        <el-button size="small" @click="sensitivitywordDialog = false">{{
          $t("aicosCommon.cancelBtn")
        }}</el-button>
        <el-button size="small" type="primary" :disabled="save" @click="handlerSaveSensitivityword">{{
          $t("aicosCommon.saveBtn") }}</el-button>
      </template>
    </HuilanDialog>
  </div>
</template>
<script>
import Resultcommon from "./resultcommon";
import {
  selectSensitiveByKnId,
  deleteSensitiveById,
  updateSensitive,
  deleteSensitiveBatch
} from "@/api/kwKnowledgeCenter/kwKnowledgeMangement/documentknowledge/index";
import Sensitivitywordadd from "./sensitivitywordadd";
export default {
  components: {
    Resultcommon,
    Sensitivitywordadd
  },
  props: {
    markForm: {
      type: Object,
      default: () => {
        return {};
      }
    },
    text: {
      type: String,
      default: ""
    }
  },
  data () {
    return {
      checkAll: false,
      isIndeterminate: false,
      listData: [],
      checkedCities: [],
      sensitivitywordDialog: false,
      editObj: {},
      save: false
    };
  },
  mounted () {
    this.getList();
  },
  methods: {
    // 获取敏感词所有数据
    getList () {
      selectSensitiveByKnId({ fileKnowledgeId: this.markForm.id }).then(res => {
        if (res.data.success) {
          if (res.data.data !== null) {
            this.listData = res.data.data;
          } else {
            this.listData = [];
          }
        }
        this.$emit("handelReslut", this.listData);
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
        this.listData.map(item => {
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
          type: "warning"
        }).then(() => {
          deleteSensitiveById({ id: val.id }).then(res => {
            if (res.data.success) {
              this.$message.success(this.$t('aicosCommon.successOperate'));
              this.getList();
              this.$forceUpdate();
            }
          });
        });
      }
      if (val.type === "edit") {
        this.editObj = val;
        this.sensitivitywordDialog = true;
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
        type: "warning"
      }).then(() => {
        deleteSensitiveBatch({ id: this.checkedCities.join(",") }).then(res => {
          if (res.data.success) {
            this.$message.success(this.$t('aicosCommon.successOperate'));
            this.getList();
          }
        });
      });
    },
    // 编辑敏感词
    handlerSaveSensitivityword () {
      const faqBasicForm = this.$refs.sensitivitywordadd.$refs.faqBasicFormRef;
      new Promise(resolve => {
        faqBasicForm.validate(validate => {
          if (validate) {
            const data = this.$refs.sensitivitywordadd.saveFaqBasic();
            if (this.editObj.sensitiveWord !== data.sensitiveWord) {
              if (this.text.indexOf(data.sensitiveWord) === -1) {
                data.start = "0";
                data.end = "0";
              } else {
                data.start = this.text.indexOf(data.sensitiveWord);
                data.end =
                  Number(this.text.indexOf(data.sensitiveWord)) +
                  Number(data.sensitiveWord.length);
              }
            }
            this.save = true;
            updateSensitive(data)
              .then(res => {
                if (res.data.success) {
                  this.$message.success(this.$t('aicosCommon.editSuccessTip'));
                  this.save = false;
                  this.sensitivitywordDialog = false;
                  this.getList();
                }
              })
              .catch(() => {
                this.save = false;
              });
            resolve();
          }
        });
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.sensitivityword {
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
