<template>
  <el-form
    ref="addFileFrom"
    :model="fileFrom"
    label-position="labelPosition"
    label-width="85px"
    :rules="rules"
    size="mini"
    class="file-addFile"
  >
    <el-form-item :label="$t('file.category') + ':'">
      <el-input
        class="file-manage-type"
        readonly
        v-model="curTreeNodeName"
      ></el-input>
    </el-form-item>
    <el-form-item
      :label="$t('file.fileUpload') + ':'"
      style="min-height: 70px"
      prop="fileAddress"
      class="kw-upload-err"
    >
      <el-upload
        :action="action"
        ref="upload"
        multiple="false"
        :file-list="fileList"
        :limit="1"
        :on-remove="handleRemove"
        :on-success="handleSuccess"
        :on-exceed="fileUploadExceed"
        :before-upload="checkFileBeforeUpload"
      >
        <el-button size="small" type="primary">{{
          $t("file.uploadFile")
        }}</el-button>
      </el-upload>
    </el-form-item>
    <el-form-item :label="$t('file.remark') + ':'">
      <el-input v-model="fileFrom.marks"></el-input>
    </el-form-item>
    <div style="margin-left: 10px">
      <p class="file-add-tips">{{ $t("file.note") }}</p>
      <p>
        {{ $t("file.supportExtensionTips") }}
      </p>
      <p>{{ $t("file.imageSizeTips") }}</p>
    </div>
  </el-form>
</template>

<script>
import {
  getUploadUrl,
  checkFileType,
  addFile,
  updataFile,
} from "@/api/kwKnowledgeCenter/kwKnowledgeMangement/kwFileManagement/index.js";
import { mapGetters } from "vuex";
export default {
  props: {
    robotId: {
      type: String,
      default: "",
    },
    fileId: {
      type: String,
      default: "",
    },
    fileType: {
      type: String,
      default: "add",
    },
    curSelectedTreeNode: {
      type: Object,
    },
    curTreeNodeName: {
      type: String,
    },
    curTreeNode: {
      type: String,
    },
    nodeDeepPath: {
      type: Array,
      default: () => {
        return [];
      },
    },
    fileUpdataObj: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  computed: {
    ...mapGetters(["language"]),
    labelPosition() {
      return this.language != "zh" ? "top" : "right";
    },
  },
  data() {
    //检验预览动作
    var fileMustUpload = (rule, value, callback) => {
      if (
        this.fileFrom.fileAddress == "" ||
        this.fileFrom.fileAddress == null
      ) {
        return callback(new Error(this.$t("file.uploadFileTips")));
      } else {
        callback();
      }
    };
    return {
      fileFrom: {
        fileAddress: "",
        marks: "",
      },
      action: getUploadUrl(),
      neWFile: "",
      fileList: [],
      //form验证
      rules: {
        fileAddress: [
          { required: true, validator: fileMustUpload, trigger: "change" },
        ],
      },
    };
  },
  mounted() {
    if (this.fileType == "edit") {
      this.fileFrom.fileAddress = this.fileUpdataObj.fileAddress;
      this.fileFrom.marks = this.fileUpdataObj.marks;
      this.fileList.push({
        name: this.fileUpdataObj.fileOrginlName,
        url: this.fileUpdataObj.fileAddress,
      });
    } else if (this.fileType == "add") {
      this.fileFrom.fileAddress = "";
      this.fileId = "";
    }
  },
  methods: {
    beforeAvatarUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isLt2M;
    },
    // 上传前校验文件大小
    checkFileBeforeUpload(file) {
      console.log("before-upload", file);
      const isLt5M = file.size / 1024 / 1024 < 5; // 限制文件大小
      const isLt512k = file.size / 1024 / 1024 < 0.5; // 限制图片大小
      if (file.type == "image/jpg") {
        if (!isLt512k) {
          this.$message.error("上传图片大小不能超过512k!");
          return false;
        }
      } else {
        if (!isLt5M) {
          this.$message.error("上传文件大小不能超过5M!");
          return false;
        }
      }
      return true;
    },
    fileUploadExceed(/*files, fileList*/) {
      // console.log('inPPTUploadExceed');
      this.$message({
        type: "warning",
        message: this.$t("file.fileUploadExceed"),
      });
    },

    submit() {
      this.$refs.addFileFrom.validate(async (valid) => {
        if (valid) {
          const formData = new FormData();
          formData.append("file", this.neWFile);
          formData.append("categyId", this.curTreeNode); //分组Id
          formData.append("fileAddress", this.fileFrom.fileAddress); //文件地址
          formData.append("fileId", this.fileId); //文件id
          formData.append("marks", this.fileFrom.marks); //备注
          formData.append("robotId", this.robotId); //备注
          if (this.fileType == "edit") {
            updataFile(formData).then(() => {
              this.$message({
                type: "success",
                message: this.$t("aicosCommon.saveSuccessTip"),
              });
              this.$emit("addOrEditEmitEvent", {
                type: "mangelist",
                nodeDeepPath: this.nodeDeepPath,
              });
            });
          } else {
            addFile(formData).then(() => {
              this.$message({
                type: "success",
                message: this.$t("aicosCommon.saveSuccessTip"),
              });
              this.$emit("addOrEditEmitEvent", {
                type: "mangelist",
                nodeDeepPath: this.nodeDeepPath,
              });
              this.fileUpdataObj = {};
            });
          }
        }
      });
    },
    handleSuccess(response, file) {
      if (file.response.code !== 200) {
        this.$message.error(file.response.msg);
        this.fileFrom.fileAddress = "";
        this.neWFile = [];
        this.$refs.upload.clearFiles();
        return false;
      }
      this.fileFrom.fileAddress = file.response.data.newFileName;
      this.neWFile = file.raw;
      if (
        this.fileFrom.fileAddress != "" &&
        this.fileFrom.fileAddress != null
      ) {
        this.$refs.addFileFrom.clearValidate("fileAddress"); //清除文字校验
      }
    },
    onChange(file) {
      const formData = new FormData();
      formData.append("file", file.raw);
      checkFileType(formData).then((resData) => {
        if (resData.data.data == true) {
          this.$refs.upload.submit();
        } else {
          this.$message.error(resData.data.msg);
          this.fileList = [];
        }
      });
    },
    handleRemove() {
      this.fileFrom.fileAddress = "";
    },
  },
};
</script>

<style lang="scss" scoped>
.file-addFile {
  width: 90% !important;
  margin: auto !important;
}

/deep/.file-manage-type .el-input__inner {
  border: none !important;
}

.file-add-tips {
  font-weight: 700;
}

.kw-upload-err {
  ::v-deep &.el-form-item--mini .el-form-item__error {
    padding-top: 4px;
  }
}
</style>
