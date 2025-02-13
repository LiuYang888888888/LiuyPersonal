<template>
  <div>
    <el-form ref="importList" label-position="right" label-width="100px">
      <el-form-item
        :label="$t('kwFaqManagement.accessoryUpload') + ':'"
        prop="file"
      >
        <el-upload
          class="upload-demo"
          ref="uploadTableQa"
          accept=".xls,.xlsx"
          action=""
          :with-credentials="true"
          :http-request="uploadTableQahttpRequest"
          :auto-upload="false"
          limit="1"
          :header="uploadHeader"
        >
          <el-button
            slot="trigger"
            size="small"
            type="primary"
            style="margin-right: 20px"
            >{{ $t("kwFaqManagement.chooseFile") }}</el-button
          >
          <!--  style="display: inline-block; margin-left: 20px" -->
          <span slot="tip" class="el-upload__tip">
            {{ $t("kwFaqManagement.excelFilesTip") }}
          </span>
        </el-upload>
      </el-form-item>
      <el-form-item prop="upload">
        <el-button type="text" @click="downloadTemplate">{{
          $t("kwFaqManagement.uploadTemplate")
        }}</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
// import { excelUpload } from '@/api/cocoentitiesInWord/sensitiveWords/sensitiveWords.js';
// import { importExcel } from '@/api/cocoentitiesInWord/managerTableList/managerTableList.js';
// import { importFaq, importTableQA } from '@/api/cocoKnowledgeProud/index.js';
// import { importMissKnowledge } from '@/api/cocoLcak/index.js'
import serviceList from "@/config/serviceList";
import { baseURL } from "@/api/common";
import { mapGetters } from "vuex";
import { getToken } from "@/util/auth";
import { importExcel } from "@/api/kwKnowledgeCenter/kwIntention/index";
import { faqImport } from "@/api/kwKnowledgeCenter/kwKnowledgeMangement/kwFaqManagement/index";
import { tableBatchImport } from "@/api/kwKnowledgeCenter/kwKnowledgeMangement/kwTabManagement/index";
const { knowledge } = serviceList;
export default {
  data() {
    return {
      closeFlag: false,
      uploadHeader: {
        timeout: 0,
      },
    };
  },
  props: {
    moduleName: {
      type: String,
      default: "",
    },
  },
  computed: {
    ...mapGetters(["botObj"]),
  },
  methods: {
    uploadTableQahttpRequest(param) {
      let fileObj = param.file; // 相当于input里取得的files
      // console.log(fileObj);
      // 检查文件类型
      const allowedExtensions = /(\.xls|\.xlsx)$/i;
      if (!allowedExtensions.exec(fileObj.name)) {
        this.$message({
          type: 'error',
          message: this.$t("kwIntentionManage.errFileUploadType"),
          // '请选择 XLSX, XLS 类型的文件！',
        });
        this.$emit("successImport", false);
        return;
      }

      if (!['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet','application/vnd.ms-excel'].includes(fileObj.type)) {
        this.$message({
          type: 'error',
          message: '请选择 XLSX, XLS 类型的文件！',
        });
        this.$emit("successImport", false);
        return;
      }

      let fd = new FormData(); // FormData 对象
      let size = Number(fileObj.size / 1024 / 1024);
      fd.append("file", fileObj);
      fd.append("botId", this.botObj.id);
      if (size > 20) {
        this.$message({
          type: "warning",
          message: "文件大小不能超过20MB,请重新上传!",
        });
        this.$emit("successImport", false);
        return;
      }
      //   fd.append('cateId', this.curSelectedTreeNode.id);
      //   fd.append('formId', this.curSelectedTreeNode.formId);
      if (this.moduleName == "intent") {
        importExcel(fd).then(
          () => {
            this.closeFlag = true;
            this.$message({
              type: "success",
              message: "导入成功!",
            });
            this.$emit("successImport", true);
          },
          (error) => {
            this.$emit("successImport", false);
            window.console.log(error);
          }
        );
      } else if (this.moduleName == "FAQ") {
        faqImport(fd).then(
          () => {
            this.closeFlag = true;
            this.$message({
              type: "success",
              message: "导入成功!",
            });
            this.$emit("successImport", true);
          },
          (error) => {
            this.$emit("successImport", false);
            console.log(error);
          }
        );
      } else if (this.moduleName == "tableQA") {
        tableBatchImport(fd).then(
          (res) => {
            if (res.data.success) {
              this.closeFlag = true;
              this.$message({
                type: "success",
                message: "导入成功!",
              });
              this.$emit("successImport", true);
            }
          },
          (error) => {
            this.$emit("successImport", false);
            console.log(error);
          }
        );
      }
    },
    // 下载模板
    downloadTemplate() {
      if (this.moduleName == "intent") {
        window.open(
          `${baseURL}api/${knowledge}/km-intent/excel/download?token=${getToken()}`
        );
      }
      if (this.moduleName === "FAQ") {
        window.open(
          `${baseURL}api/${knowledge}/faqQuestion/excel/download?token=${getToken()}`
        );
      }
      if (this.moduleName === "tableQA") {
        window.open(`${baseURL}api/${knowledge}/tableQa/download/template`);
      }
      // } else if (this.importFlag === '2') {
      //   window.open(`/api/${aiworkorder}/system/excelDownload?fileName=entity.xls`)
      // } else if (this.importFlag == 'fap') {
      //   window.open(`/api/${aiworkorder}/system/templatedownload?fileName=QA知识提取.xlsx`)
      // } else if (this.importFlag == 'tableQA') {
      //   window.open(`/api/${aiworkorder}/syndimension/templatedown`)
      // } else if (this.importFlag == 'lack') {
      //   window.open(`/api/${aiworkorder}/system/excelDownload?fileName=缺失知识登记.xlsx`)
      // }
    },
    saveImport() {
      if (this.$refs.uploadTableQa.uploadFiles.length > 0) {
        this.$refs.uploadTableQa.submit();
      } else {
        this.$emit("successImport", false);
      }
    },
  },
};
</script>

<style></style>
