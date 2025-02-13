<template>
  <div>
    <ckeditor
      ref="ckeditor"
      :editor="editor"
      :value="content"
      :type="type"
      :read-only="disabled"
      :editor-url="`${baseURL}cdn/ckeditor/ckeditor.js`"
      @input="onEditorInput"
      :config="editorConfig"
    >
    </ckeditor>
    <HuilanDialog
      :title="$t('kwFaqManagement.accessoryUpload')"
      append-to-body
      ref="dialog"
      :visible.sync="similarDialogVisible"
      width="1200px"
    >
      <el-tabs v-model="activeName">
        <el-tab-pane :label="$t('kwFaqManagement.customUpload')" name="first">
          <CustomUpload
            ref="custom"
            @getCustomList="getCustomList"
            v-if="similarDialogVisible"
          />
        </el-tab-pane>
        <el-tab-pane
          :label="$t('kwFaqManagement.documentUpload')"
          name="second"
        >
          <div style="height: 500px; overflow: auto">
            <DocumentUpload
              v-if="similarDialogVisible"
              @getDocumentList="getDocumentList"
              ref="document"
              ckEditFlag="ckEdit"
            />
          </div>
        </el-tab-pane>
      </el-tabs>
      <template v-slot:footer>
        <el-button size="small" @click="similarDialogVisible = false">{{
          $t("aicosCommon.cancelBtn")
        }}</el-button>
        <el-button size="small" type="primary" @click="saveSimilar">{{
          $t("aicosCommon.saveBtn")
        }}</el-button>
      </template>
    </HuilanDialog>
  </div>
</template>

<script>
import CKEditor from "ckeditor4-vue";
import { baseURL } from "@/api/common";
import CustomUpload from "@/views/kwKnowledgeCenter/kwKnowledgeMangement/kwFaqManagement/customUpload";
import DocumentUpload from "@/views/kwKnowledgeCenter/kwKnowledgeMangement/kwFileManagement/index";

import serviceList from "@/config/serviceList";
import { mapGetters } from "vuex";

export default {
  name: "knowledgeEditor",
  components: {
    ckeditor: CKEditor.component,
    CustomUpload,
    DocumentUpload,
  },
  data() {
    // CKEditor.skinName = 'moono-lisa';
    var toolbar =
      this.toolbar.length > 0
        ? this.toolbar
        : [
          [
            "Source",
            "-",
            "Templates",
            "Cut",
            "Copy",
            // "Paste",
            // "PasteText",
            // "PasteFromWord",
            "-",
            "Undo",
            "Redo",
            "Find",
            "Replace",
            "-",
            "SelectAll",
            "Bold",
            "Italic",
            "Underline",
            "Strike",
            "Subscript",
            "Superscript",
            "-",
            "CopyFormatting",
            "RemoveFormat",
            "NumberedList",
            "BulletedList",
            "-",
            "Outdent",
            "Indent",
            "-",
            "Blockquote",
            "CreateDiv",
            "-",
            "JustifyLeft",
            "JustifyCenter",
            "JustifyRight",
            "JustifyBlock",
            "Link",
            "Unlink",
            "Anchor",
            "Image",
            "Table",
            "HorizontalRule",
            "Smiley",
            "SpecialChar",
            "PageBreak",
            "TextColor",
            "BGColor",
            "-",
            "accessory",
            "Styles",
            "Format",
            "Font",
            "FontSize",
          ],
          /* { name: 'document', items: [ 'Source', '-', 'Templates' ] },
      { name: 'clipboard', items: [ 'Cut', 'Copy', 'Paste', 'PasteText', 'PasteFromWord', '-', 'Undo', 'Redo' ] },
      { name: 'editing', items: [ 'Find', 'Replace', '-', 'SelectAll' ] },
      // { name: 'forms', items: [ 'Form', 'Checkbox', 'Radio', 'TextField', 'Textarea', 'Select', 'Button', 'ImageButton', 'HiddenField' ] },
      { name: 'basicstyles', items: [ 'Bold', 'Italic', 'Underline', 'Strike', 'Subscript', 'Superscript', '-', 'CopyFormatting', 'RemoveFormat',
          'NumberedList', 'BulletedList', '-', 'Outdent', 'Indent', '-', 'Blockquote', 'CreateDiv', '-', 'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock'] },
      //[ ],
      [ 'Link', 'Unlink', 'Anchor' ],
      { name: 'insert', items: [ 'Image', 'Table', 'HorizontalRule', 'Smiley', 'SpecialChar', 'PageBreak'] },
      { name: 'styles', items: [ 'Styles', 'Format', 'Font', 'FontSize' ] },
      [ 'TextColor', 'BGColor' ],*/
          //{ name: 'tools', items: [ 'Maximize', 'ShowBlocks' ] }
        ];
    return {
      newBaseURL: "",
      similarDialogVisible: false,
      activeName: "first",
      baseURL: baseURL,
      editor: {},
      editorConfig: {
        language: "zh-cn",
        extraPlugins: "colorbutton,colordialog,accessory",
        // filebrowserBrowseUrl: "abc/def",
        // filebrowserUploadUrl:
        //   baseURL +
        //   "api/aicos-file/kmMiniofile/ckeditorUpload?fromSystemName=knowledge&filelibrary=ckeditor&uploadType=ckeditor",
        toolbar: toolbar,
        accessoryHandle: this.show,
      },
    };
  },
  model: {
    prop: "content",
    event: "updateContent",
  },
  props: {
    editorValue: {
      type: String,
      default: "",
    },
    // 文本
    content: {
      type: String,
      default: "",
    },
    // 是否禁用
    disabled: {
      type: Boolean,
      default: false,
    },
    // 富文本类型两种（classic）和（inline）
    isInline: {
      type: Boolean,
      default: false,
    },
    toolbar: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },
  watch: {
    language: {
      handler(newVal) {
        if (newVal === "zh") {
          this.editorConfig.language = "zh-cn";
        } else {
          this.editorConfig.language = "en";
        }
      },
      immediate: true,
    },
  },
  computed: {
    ...mapGetters(["language"]),
    type() {
      return this.isInline ? "inline" : "classic";
    },
  },
  mounted() {
    // window.show = this.show;
    this.newBaseURL = "/" + this.baseURL.split("/")[1];
  },
  methods: {
    show(editor) {
      this.similarDialogVisible = true;
      this.editor = editor;
      this.activeName = "first";
    },
    onEditorInput(val) {
      this.$emit("updateContent", val);
    },
    async saveSimilar() {
      this.$refs.custom.saveImport();
      const documentList = this.$refs.document.selectionList,
        flag = this.$refs.custom.flag;
      if (documentList.length === 0 && flag === 0) {
        this.$message.warning("请上传！");
        return;
      }
      if (documentList.length > 0) {
        this.getDocumentList(documentList);
      }
    },
    getCustomList(data, finished) {
      // 判断附件是否上传成功
      const fileName = data.fileName;
      if (fileName) {
        const suffix = fileName
          .substring(fileName.lastIndexOf(".") + 1)
          .toLowerCase();
        const fileSuffix = [
          "txt",
          "doc",
          "docx",
          "xls",
          "xlsx",
          "pdf",
          "rar",
          "zip",
          "mp4",
          "mav",
          "mp3",
        ];
        const imgSuffix = ["jpg", "png", "jpeg", "gif"];

        let fileBase = `${baseURL}api/${serviceList.file}/miniofile/download`;

        if (`${baseURL}` == "/aicc/") {
          fileBase = `/${serviceList.file}/miniofile/download`;
        }

        if (fileSuffix.includes(suffix)) {
          this.editor.insertHtml(
            `<a target="_blank"  href=${fileBase}${data.url}>${fileName}</a>`
          );
        } else if (imgSuffix.includes(suffix)) {
          this.editor.insertHtml(`<img src="${fileBase}${data.url}" alt='' />`);
        }
        if (finished) {
          this.similarDialogVisible = false;
        }
      } else {
        this.$message.error("上传失败，请稍后重试！");
      }
    },
    getDocumentList(data) {
      data.forEach((item) => {
        if (
          item.fileType == "TXT" ||
          item.fileType == "OTHER" ||
          item.fileType == "VIDEO" ||
          item.fileType == "VOICE"
        ) {
          this.editor.insertHtml(
            `<a  target="_blank" href=${this.newBaseURL}${item.fileAddress}>${item.fileOrginlName}</a>`
          );
        } else if (item.fileType == "IMAGE") {
          this.editor.insertHtml(
            `<img src=${this.newBaseURL}${item.fileAddress}/>`
          );
        }
      });
      this.similarDialogVisible = false;
    },
    // onNamespaceLoaded(config) {
    //   console.log(config, 123);
    // },
    // onEditorReady(editor) {
    //   editor.config = this.$refs.dialog;
    // },
  },
};
</script>
