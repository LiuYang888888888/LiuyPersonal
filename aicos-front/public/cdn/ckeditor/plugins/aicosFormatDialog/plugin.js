CKEDITOR.plugins.add("aicosFormatDialog", {
  hidpi: true,
  icons: "format",
  lang: ["zh-cn"],
  init: function(editor) {
    var lang = editor.lang.aicosFormatDialog;
    const label = lang.name;

    CKEDITOR.dialog.addIframe('formatCommand', label, this.path + 'dialogs/dialog.html', 730, 255,function () {
      var dialog = this.getDialog(),
        cureditor=dialog._.editor,
        dialogCont=dialog.parts.contents;

      // dialogCont.setStyle('overflow',"hidden");
      // win.doc = win.$('#docCont')[0];

      var htmlContent = cureditor.getSelectedHtml(true);
      if(htmlContent !== '') {
        htmlContent = cureditor.dataProcessor.toDataFormat(htmlContent);
      }else {
        htmlContent= cureditor.getData()
      }

      // win.$('#docCont').html (htmlContent);
      // win.gHtml=htmlContent;

      // winSize&&dialog.resize(winSize.width,winSize.height);

      dialog.on("ok",function(){
        var iframWin=dialogCont.$.getElementsByTagName('iframe')[0].contentWindow;

        var cont=iframWin.okHandler(htmlContent);
        if(cont==null||cont==""){
          return false;
        }
        //cureditor.setData(cont);
        // win.doc.innerHTML = cont;
        // setTimeout(function(){win.doc.innerHTML = cont;},0)
        setTimeout(function(){
          // win.doc.innerHTML = cont;
          // var content = cureditor.getData()
          var htmlContent = cureditor.getSelectedHtml(true);
          if(htmlContent !== '') {
            cureditor.insertHtml(cont);
          }else {
            cureditor.setData(cont);
          }
          // cureditor.setData(cont);
        },0)
        dialog.removeListener('ok',arguments.callee);

      });

    });

    editor.addCommand('formatCommand', new CKEDITOR.dialogCommand('formatCommand'));

    editor.ui.addButton('format', {
      label: label,
      command: 'formatCommand'
    });
  }
});
