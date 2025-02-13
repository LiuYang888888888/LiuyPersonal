<template>
  <div>
    <ckeditor
      :editor-url="editorUrl"
      :config="editorConfig"
      :disabled="disabled"
      :value="value"
      @input="handleEditorInput"
    ></ckeditor>
    <ImageUploadDialog ref="imgUploadDialog"/>
    <VideoUploadDialog ref="videoUploadDialog"/>
    <AudioUploadDialog ref="audioUploadDialog"/>
    <AttachmentUploadDialog ref="attachmentUploadDialog"/>
  </div>
</template>

<script>
import CKEditor from "ckeditor4-vue";
import {baseURL} from "@/api/common";
import ImageUploadDialog from "./imageUpload";
import VideoUploadDialog from "./videoUpload";
import AudioUploadDialog from "./audioUpload";
import AttachmentUploadDialog from "./attachmentUpload";
export default {
  name: 'HuilanEditor',
  components: {
    ckeditor: CKEditor.component,
    ImageUploadDialog,
    VideoUploadDialog,
    AudioUploadDialog,
    AttachmentUploadDialog
  },
  props: {
    config: {
      type: Object,
      default() {
        return {};
      }
    },
    value: {
      type: String,
      default: ''
    },
    disabled:{
      type:Boolean,
      default() {
        return {};
      }
    },
  },
  data() {
    return {
      defaultEditorConfig: {
        toolbar: [
          { name: 'document',     items : [ 'Source','-','Print','-'] },
          { name: 'clipboard',    items : [ /*'uploadWordImg','-',*/'Undo','Redo','-' ] },
          { name: 'editing',      items : [ 'Find','Replace','-','SelectAll'] },
          { name: 'insert',       items : ['aicosImageUpload','aicosVideoUpload','aicosAudioUpload','aicosAttachmentUpload', 'Link', 'advTable','HorizontalRule','Smiley','SpecialChar','-'] },
          { name: 'basicstyles',  items : [ 'Bold','Italic','Underline','Strike','-','CopyFormatting','RemoveFormat', 'Subscript', 'Superscript'/*, 'format'*/] },
          { name: 'paragraph',    items : [ 'JustifyLeft','JustifyCenter','JustifyRight','JustifyBlock','-'] },
          { name: 'links',        items : [ 'Link','Unlink','-'] },
          { name: 'styles',       items : ['Font','FontSize','-'] },
          { name: 'colors',       items : [ 'TextColor','BGColor','-'] },
          { name: 'tools',        items : [ 'ShowBlocks', 'Format'/*, 'editorMaximize'*/] }
        ],
        smiley_path: `${baseURL}cdn/ckeditor/plugins/smiley/images/`,
        font_names:'宋体;黑体;仿宋;楷体;隶书;Arial;Comic Sans MS;Courier New;Tahoma;Times New Roman;Verdana;ALKATIP Tor',
        fontSize_sizes:'初号/40px;小初/36px;一号/26px;小一/24px;二号/22px;小二/18px;三号/16px;小三/15px;四号/14px;小四/12px;五号/10.5px;小五/9px;六号/7.5px;小六/6.5px;七号/5.5px;八号/5px',
        extraPlugins: 'advTable,aicosMedia,aicosFormatDialog, iframedialog, aicosMediaUpload,image2',
        // filebrowserVideoUploadUrl: getUploadUrl(),
        // filebrowserAudioUploadUrl: getUploadUrl(),
        // filebrowserImageUploadUrl: getUploadUrl(),
        // filebrowserLinkUploadUrl: getUploadUrl(),
        // filebrowserUploadUrl: getUploadUrl(),
        // filebrowserUploadUrl: getUploadUrl(),
        // fileTools_requestHeaders: {
        //   [website.tokenHeader]: getToken()
        // },
        allowedContent: true,
        // height: 600
        imageUploadCallback: this.showImageUploadDialog,
        videoUploadCallback: this.showVideoUploadDialog,
        audioUploadCallback: this.showAudioUploadDialog,
        attachmentUploadCallback: this.showAttachmentUploadDialog,
        removePlugins: 'image'
      }
    }
  },
  computed: {
    editorUrl() {
      return `${baseURL}cdn/ckeditor/ckeditor.js`;
    },
    editorConfig() {
      const cobineConfig = {
        extraPlugins: `${this.defaultEditorConfig.extraPlugins},${this.config.extraPlugins}`,
        removePlugins: `${this.defaultEditorConfig.removePlugins},${this.config.removePlugins}`,
      }
      return Object.assign({}, this.defaultEditorConfig, this.config, cobineConfig);
    }
  },
  methods: {
    showImageUploadDialog(editor) {
      this.$refs.imgUploadDialog.showDialog(editor);
    },
    showVideoUploadDialog(editor) {
      this.$refs.videoUploadDialog.showDialog(editor);
    },
    showAudioUploadDialog(editor) {
      this.$refs.audioUploadDialog.showDialog(editor);
    },
    showAttachmentUploadDialog(editor) {
      this.$refs.attachmentUploadDialog.showDialog(editor);
    },
    handleEditorInput(content) {
      this.$emit('input', content);
    }
  }
}
</script>

<style scoped>
.cke_bottom{display: none !important;}
</style>
