<template>
  <el-form
    :model="templateForm"
    :rules="rules"
    ref="templateFormRef"
    label-width="120px"
    :label-position="language != 'zh' ? 'top' : 'right'"
    class="demo-ruleForm"
  >
    <!--  模板名称  -->
    <el-form-item :label="$t('kwTemplateSetting.templateName')+'：'" prop="templateName">
      <el-input
        v-model="templateForm.templateName"
        maxlength="30"
        show-word-limit
      ></el-input>
    </el-form-item>
    <!--  模板类型  -->
    <el-form-item :label="$t('kwTemplateSetting.templateType')+'：'" prop="templateType" class="template-type">
      <el-select v-model="templateForm.templateType">
        <el-option :label="$t('kwTemplateSetting.faq')" value="1"></el-option>
        <el-option :label="$t('kwTemplateSetting.dialogueProcess')" value="2"></el-option>
      </el-select>
    </el-form-item>
    <!--  封面图  -->
    <el-form-item :label="$t('kwTemplateSetting.templateCoverImage')+'：'" prop="filePath">
      <el-upload
        class="upload-demo"
        :on-preview="handlePreview"
        :on-remove="handleRemove"
        :before-remove="beforeRemove"
        :before-upload="beforeUpload"
        :on-change="handleChange"
        :multiple="false"
        :action="templateImgAction"
        :on-success="successUpload"
        :on-exceed="handleExceed"
        :file-list="fileList"
        ref="upload">
        <el-button size="small" type="primary">{{$t('kwTemplateSetting.uploadBtn')}}</el-button>
      </el-upload>
    </el-form-item>
    <!--  模板样式  -->
    <el-form-item :label="$t('kwTemplateSetting.templateStyle')+'：'" prop="templateStyle">
      <div style="margin-top: 8px">
        <knowledge-editor
          v-model="templateForm.templateStyle"
        ></knowledge-editor>
      </div>
<!--      <div style="width:600px;height:260px;border-radius: 10px;background: linear-gradient(to bottom, #699bff, #074dd8);color: #fff">-->
<!--         <div style="height: 120px">-->
<!--           <span style="font-size:36px;float: left;margin-left: 30px; margin-top: 35px;">#{address}</span>-->
<!--           <span style="font-size:36px;float: right;margin-right: 25px; margin-top: 35px;">#{date} | #{week}</span>-->
<!--         </div>-->
<!--        <div>-->
<!--          <span style="width: 275px;height: 85px;font-size: 100px;display: inline-block;border-right: 3px solid #bdd5ff;font-size: 100px;line-height: 85px;text-align: center;">#{t}℃</span>-->
<!--          <span style="display: inline-block;font-size: 26px;margin-left: 35px;">-->
<!--            <span style="display: block;margin-bottom: 15px;">#{weather}</span>-->
<!--            <span style="display: block">#{climate}</span>-->
<!--          </span>-->
<!--        </div>-->
<!--      </div>-->
    </el-form-item>
  </el-form>
</template>
<script>
import { baseURL } from "@/api/common";
import {
  saveTemplate,
  updateTemplate,
  showTemplateDetail
} from "@/api/kwKnowledgeCenter/kwSettings/templateSetting/index";
import { mapGetters } from "vuex";
import serviceList from "@/config/serviceList";

export default {
  computed: {
    ...mapGetters(["language"])
  },
  props: {
    templateId: {
      type: String
    },
    addOrEdit: {
      type: String,
      default: 'add'
    }
  },
  data() {
    return {
      templateImgAction: `${baseURL}api/${serviceList.file}/kmMiniofile/upload?fromSystemName=aiccfilepath&filelibrary=aiccfilepath`,
      fileList: [],
      templateSrc: '',
      templateForm: {
        templateName: '',
        templateType: '1',
        fileName: '',
        filePath: '',
        templateStyle: ''
      },
      rules: {
        templateName:[
          { required: true, message: this.$t("kwTemplateSetting.templateTypeTip"), trigger: 'blur' },
        ],
        templateType: [
          { required: true, message: this.$t("kwTemplateSetting.templateTypeTip"), trigger: 'change' },
        ],
        filePath: [
          { required: true, message: this.$t("kwTemplateSetting.filePathTip"), trigger: 'change' },
        ],
        templateStyle: [
          { required: true, message: this.$t("kwTemplateSetting.templateStyleTip"), trigger: 'blur' },
        ]
      },
    }
  },
  async mounted() {
    // this.originUrl = window.location.origin;
    this.templateSrc = window.location.protocol + `//liuff.huilan.com`;
    if(this.addOrEdit == 'edit') {
      const templateData = await showTemplateDetail(this.templateId)
      console.log('templateData',templateData)
      var templateDetail = templateData.data.data
      this.templateId = templateDetail.id
      this.templateForm.templateName = templateDetail.templateName
      this.templateForm.templateType = templateDetail.templateType + ''
      this.templateForm.filePath = JSON.parse(templateDetail.templatePicture).filePath
      this.templateForm.fileName = JSON.parse(templateDetail.templatePicture).fileName
      this.fileList = [
        {
          name: this.templateForm.fileName,
          url: this.templateForm.filePath
        }
      ],
      this.templateForm.templateStyle = templateDetail.templateStyle

      // this.templateForm.templateStyle = templateDetail.templateStyle.split('src="')[0] + 'src="' +this.templateSrc + templateDetail.templateStyle.split('src="')[1]
      // console.log('templateDetail.templateStyle',this.templateForm.templateStyle)
    }
  },
  methods: {
    //保存模板
    submitTemplate() {
      this.$refs.templateFormRef.validate(async (valid) => {
        if (valid) {
          var templatePicture = {
            fileName: this.templateForm.fileName,
            filePath: this.templateForm.filePath,
          }
          // this.templateForm.templateStyle = this.templateForm.templateStyle.split(this.templateSrc)[0] + this.templateForm.templateStyle.split(this.templateSrc)[1]
          if(this.addOrEdit == 'add') {
            const info = {
              templateName: this.templateForm.templateName, //名字
              templatePicture: JSON.stringify(templatePicture),
              templateType: this.templateForm.templateType, //业务类型
              templateStyle: this.templateForm.templateStyle,
            };
            const result = await saveTemplate(info);
            if (result.data.code == 200) {
              this.$message({
                type: "success",
                message: "操作成功",
              });
              this.$emit("closeTemplateDialog");
            }
          } else {
            const info = {
              id: this.templateId,
              templateName: this.templateForm.templateName, //名字
              templatePicture: JSON.stringify(templatePicture),
              templateType: this.templateForm.templateType, //业务类型
              templateStyle: this.templateForm.templateStyle,
            };
            const result = await updateTemplate(info);
            if (result.data.code == 200) {
              this.$message({
                type: "success",
                message: "操作成功",
              });
              this.$emit("closeTemplateDialog");
            }
          }


        }
      });
    },
    //上传成功
    successUpload(file) {
      var fileJson = JSON.parse(file.data.data);

      this.templateForm.fileName = file.data.fileName;
      this.templateForm.filePath =  fileJson.newFileName;
      this.fileList = [{
        name: file.data.fileName,
        url: file.data.url
      }]
      // this.templateForm.templateStyle = '<div class="template-style"><img src="'+ this.templateSrc + file.data.url +'" /></div>'
    },
    //删除上传模板
    handleRemove(/* file */) {
      // this.fileList = fileList
      this.templateForm.fileName = '';
      this.templateForm.templatePicture =  '';
      // this.templateForm.templateStyle = '';
    },
  }
}
</script>
<style lang="scss" scoped>
/deep/ .template-type .el-select {
  width: 100%;
}
.template-style {
  height: 100%;
  img {
    height: 100%;
  }
}
</style>
