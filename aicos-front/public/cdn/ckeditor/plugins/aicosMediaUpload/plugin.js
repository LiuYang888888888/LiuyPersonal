CKEDITOR.plugins.add("aicosMediaUpload", {
  hidpi: true,
  icons: "image-upload,video-upload,audio-upload,attachment-upload",
  lang: ["zh-cn"],
  init: function(editor) {
    var lang = editor.lang.aicosMediaUpload;

    // 图片上传
    const imageUploadCommand = editor.addCommand('aicosImageUpload', {
      allowedContent: 'figure figcaption img[src,alt,width,height]',
      exec: function(editor) {
        if(editor.config.imageUploadCallback) {
          editor.config.imageUploadCallback(editor)
        }
      }
    });
    editor.addFeature(imageUploadCommand);

    editor.ui.addButton('aicosImageUpload', {
      label: lang.imageUpload,
      icon: 'image-upload',
      command: 'aicosImageUpload'
    });

    // 视频上传
    const videoUploadCommand = editor.addCommand('aicosVideoUpload', {
      allowedContent: 'video',
      exec: function(editor) {
        if(editor.config.videoUploadCallback) {
          editor.config.videoUploadCallback(editor)
        }
      }
    });
    editor.addFeature(videoUploadCommand);

    editor.ui.addButton('aicosVideoUpload', {
      label: lang.videoUpload,
      icon: 'video-upload',
      command: 'aicosVideoUpload'
    });

    // 音频上传
    const audioUploadCommand = editor.addCommand('aicosAudioUpload', {
      allowedContent: 'audio',
      exec: function(editor) {
        if(editor.config.audioUploadCallback) {
          editor.config.audioUploadCallback(editor)
        }
      }
    });
    editor.addFeature(audioUploadCommand);

    editor.ui.addButton('aicosAudioUpload', {
      label: lang.audioUpload,
      icon: 'audio-upload',
      command: 'aicosAudioUpload'
    });

    // 附件上传
    const attachmentUploadCommand = editor.addCommand('aicosAttachmentUpload', {
      allowedContent: 'figure figcaption img[src,alt,width,height]',
      exec: function(editor) {
        if(editor.config.attachmentUploadCallback) {
          editor.config.attachmentUploadCallback(editor)
        }
      }
    });
    editor.addFeature(attachmentUploadCommand);

    editor.ui.addButton('aicosAttachmentUpload', {
      label: lang.attachmentUpload,
      icon: 'attachment-upload',
      command: 'aicosAttachmentUpload'
    });
  }
});
