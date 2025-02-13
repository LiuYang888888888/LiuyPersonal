/**
 * 处理aicos中上传图片和文件的问题
 */
(function(){
  CKEDITOR.plugins.add("aicosUploadFix", {
    requires: 'image',
    afterInit: function(editor) {
      let urlPrefix = '';
      // 重设ajax上传参数，以满足aicos的需求
      function fileUploadRequest(evt) {
        var requestData = evt.data.requestData;
        var upload = requestData.upload;
        if(upload) {
          requestData.file = upload;
          delete requestData.upload;
        }
      }

      // 重新ajax回调
      function newListener (evt) {
        var fileLoader = evt.data.fileLoader,
          xhr = fileLoader.xhr,
          data = evt.data;

        try {
          var response = JSON.parse( xhr.responseText );

          // Error message does not need to mean that upload finished unsuccessfully.
          // It could mean that ex. file name was changes during upload due to naming collision.
          // if ( response.error && response.error.message ) {
          //   data.message = response.error.message;
          // }

          // But !uploaded means error.
          if ( !response.success ) {
            data.message = response.msg;
            evt.cancel();
          } else {
            // 'message', 'fileName', 'url'
            // for ( var i in response.data ) {
            //   data[ i ] = response.data[ i ];
            // }
            data.message = response.msg;
            data.fileName = response.data.objectName;
            data.url = urlPrefix + response.data.newFileName;
          }
        } catch ( err ) {
          // Response parsing error.
          data.message = fileLoader.lang.filetools.responseError;
          CKEDITOR.warn( 'filetools-response-error', { responseText: xhr.responseText } );

          evt.cancel();
        }
      }
      // editor.on('fileUploadResponse', )
      let oldListenerFn = null;
      function changeFileUploadResponse() {
        let listeners = editor._.events.fileUploadResponse.listeners;

        for (let i = 0; i < listeners.length; i++) {
          let cur = listeners[i];
          if(cur.priority === 999) {
            oldListenerFn = cur.fn;
            break;
          }
        }
        editor.removeListener('fileUploadResponse', oldListenerFn);
        editor.on('fileUploadResponse', newListener, null, null, 999);
      }

      const dialogNames = ['image', 'link','video', 'audio']
      const checkUploadUrl = function(name) {
        const capitalize = CKEDITOR.tools.capitalize;
        const key = `filebrowser${capitalize(name, 1)}UploadUrl`
        let url = editor.config[key]

        if(!url) {
          url = editor.config.filebrowserUploadUrl
        }

        const urlPrefixArr = url && url.match(/\/?[^/]+/);

        if(urlPrefixArr) {
          urlPrefix = urlPrefixArr[0];
        }
        return url
      }
      editor.on('dialogShow', function(env) {
        const dialog = env.data;
        const dialogName = dialog.getName();
        if(dialogNames.includes(dialogName)) {
          if(checkUploadUrl(dialogName)) {
            editor.on('fileUploadRequest', fileUploadRequest);
            changeFileUploadResponse();
          }
        }
      })
      editor.on('dialogHide', function(env) {
        const dialog = env.data;
        const dialogName = dialog.getName();
        if(dialogNames.includes(dialogName)) {
          if(checkUploadUrl(dialogName)) {
            editor.removeListener('fileUploadRequest', fileUploadRequest);
            editor.removeListener('fileUploadResponse', newListener);
            editor.on('fileUploadResponse', oldListenerFn, null, null, 999);
          }
        }
      })
    }
  });
})()
