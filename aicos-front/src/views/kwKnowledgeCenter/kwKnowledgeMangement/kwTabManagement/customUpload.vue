<template>
  <div>
    <el-form ref="importList" label-position="right" label-width="100px">
      <el-form-item :label="$t('kwFaqManagement.accessoryUpload') + ''" prop="file">
        <el-upload
          class="upload-demo"
          ref="uploadTableQa"
          accept=".txt, .doc, .docx, .xls, .xlsx, .pdf, .jpg, .png, .jpeg, .rar, .zip, .mp3,.wav,.mp4"
          action=""
          :with-credentials="true"
          :http-request="uploadTableQahttpRequest"
          :auto-upload="false"
          limit="1"
        >
          <el-button slot="trigger" size="small" type="primary">{{
            $t("kwFaqManagement.accessoryUpload")
          }}</el-button>
          <!-- <div
            slot="tip"
            class="el-upload__tip"
            style="display: inline-block; margin-left: 20px"
          >
            只能上传xls,xls格式的 excel文件
          </div> -->
        </el-upload>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
// import { excelUpload } from '@/api/cocoentitiesInWord/sensitiveWords/sensitiveWords.js';
// import { importExcel } from '@/api/cocoentitiesInWord/managerTableList/managerTableList.js';
// import { importFaq, importTableQA } from '@/api/cocoKnowledgeProud/index.js';
// import { importMissKnowledge } from '@/api/cocoLcak/index.js'
// import serviceList from "@/config/serviceList";
// const { aiworkorder } = serviceList;
import { ckeditorUpload } from "@/api/kwKnowledgeCenter/kwKnowledgeMangement/kwTabManagement/index";
export default {
  data() {
    return {
      closeFlag: false,
    };
  },
  props: {
    importFlag: {
      type: String,
      default: "0",
    },
  },
  methods: {
    uploadTableQahttpRequest(param) {
      let fileObj = param.file; // 相当于input里取得的files
      let fd = new FormData(); // FormData 对象
      // let size = Number(fileObj.size / 1024 / 1024);
      fd.append("upload", fileObj);
      // if (size > 20) {
      //   this.$message({
      //     type: "warning",
      //     message: "文件大小不能超过20MB,请重新上传!",
      //   });
      //   return;
      // }
      ckeditorUpload(fd).then(
        (res) => {
          setTimeout(() => {
            this.$emit("getCustomList", res.data);
          }, 100);
        },
        (error) => {
          setTimeout(() => {
            window.console.log(error);
          }, 1000);
        }
      );
    },
    saveImport() {
      this.$refs.uploadTableQa.submit();
    },
  },
};
</script>

<style></style>
