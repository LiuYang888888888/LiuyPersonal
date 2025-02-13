<template>
  <div>
    <el-form ref="importList" label-position="right" label-width="100px">
      <el-form-item :label="$t('kwFaqManagement.accessoryUpload') + ':'" prop="file">
        <el-upload
          class="upload-demo"
          ref="uploadTableQa"
          accept=".xls,.xlsx"
          action=""
          :with-credentials="true"
          :http-request="uploadTableQahttpRequest"
          :auto-upload="false"
          limit="1"
        >
          <el-button
            slot="trigger"
            size="small"
            type="primary"
            style="margin-right: 20px"
            >{{ $t("kwFaqManagement.chooseFile") }}</el-button
          >
          <!--  style="display: inline-block; margin-left: 20px" -->
          <span slot="tip" class="el-upload__tip"> 只能上传xls,xls格式的 excel文件 </span>
        </el-upload>
      </el-form-item>
      <el-form-item prop="upload">
        <el-link type="primary" :underline="false">{{
          $t("kwFaqManagement.uploadTemplate")
        }}</el-link>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
// import { excelUpload } from '@/api/cocoentitiesInWord/sensitiveWords/sensitiveWords';
// import { importExcel } from '@/api/cocoentitiesInWord/managerTableList/managerTableList';
// import { importFaq, importTableQA } from '@/api/cocoKnowledgeProud/index';
// import { importMissKnowledge } from '@/api/cocoLcak/index'
// import serviceList from "@/config/serviceList";
// const { aiworkorder } = serviceList;
import { mapGetters } from "vuex";
import { importExcel } from "@/api/kwKnowledgeCenter/kwIntention/index";
import { tableImport } from "@/api/kwKnowledgeCenter/kwKnowledgeMangement/kwTabManagement/index";
export default {
  data() {
    return {
      closeFlag: false,
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
      let fd = new FormData(); // FormData 对象
      let size = Number(fileObj.size / 1024 / 1024);
      fd.append("file", fileObj);
      fd.append("botId", this.botObj.id);
      if (size > 20) {
        this.$message({
          type: "warning",
          message: "文件大小不能超过20MB,请重新上传!",
        });
        return;
      }
      if (this.moduleName == "intent") {
        importExcel(fd).then(
          () => {
            setTimeout(() => {
              this.$message({
                type: "success",
                message: "导入成功!",
              });
              this.$emit("successImport");
            }, 1000);
            this.closeFlag = true;
          },
          (error) => {
            setTimeout(() => {
              window.console.log(error);
            }, 1000);
          }
        );
      } else if (this.moduleName == "FAQ") {
        tableImport(fd).then(
          () => {
            setTimeout(() => {
              this.$message({
                type: "success",
                message: "导入成功!",
              });
              this.$emit("successImport");
            }, 1000);
            this.closeFlag = true;
          },
          (error) => {
            setTimeout(() => {
              window.console.log(error);
            }, 1000);
          }
        );
      }
    },
    // 下载模板
    // downloadTemplate() {
    //   if (this.importFlag === '1') {
    //     window.open(`/api/${aiworkorder}/system/excelDownload?fileName=sensitive.xls`)
    //   } else if (this.importFlag === '2') {
    //     window.open(`/api/${aiworkorder}/system/excelDownload?fileName=entity.xls`)
    //   } else if (this.importFlag == 'fap') {
    //     window.open(`/api/${aiworkorder}/system/templatedownload?fileName=QA知识提取.xlsx`)
    //   } else if (this.importFlag == 'tableQA') {
    //     window.open(`/api/${aiworkorder}/syndimension/templatedown`)
    //   } else if (this.importFlag == 'lack') {
    //     window.open(`/api/${aiworkorder}/system/excelDownload?fileName=缺失知识登记.xlsx`)
    //   }
    // },
    saveImport() {
      this.$refs.uploadTableQa.submit();
    },
  },
};
</script>

<style></style>
