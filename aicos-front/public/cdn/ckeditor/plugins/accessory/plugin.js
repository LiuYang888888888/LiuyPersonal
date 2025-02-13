/**
 * 知识管理中使用的附件插件
 */
CKEDITOR.plugins.add('accessory', {
  icons: 'accessory',
  init: function (editor) {
    var lang = editor.lang.toolbar;
    editor.addCommand('accessory', {
      exec: function (editor) {

        var config = editor.config;

        if(config.accessoryHandle) {
          config.accessoryHandle(editor);
        }
      },
    });
    editor.ui.addButton('accessory', {
      label:lang.toolbarGroups.accessory,
      command: 'accessory',
      toolbar: 'insert',
    })
  }
})
