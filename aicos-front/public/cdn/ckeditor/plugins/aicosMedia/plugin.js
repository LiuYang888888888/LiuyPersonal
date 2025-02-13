/*
为编辑器添加video和audio的支持,
编辑器添加addMovie和addAudio方法
*/

(function() {
  function createFakeElement(editor, realElement, movieType) {
    var cls = "cke_video";
    if (movieType == "audio") {
      cls = "cke_audio";
    }
    return editor.createFakeParserElement(realElement, cls, movieType, true);
  }

  CKEDITOR.plugins.add("aicosMedia", {
    hidpi: true,
    icons: "video,audio",
    lang: ["zh-cn"],
    init: function(editor) {
      var lang = editor.lang.aicosMedia;
      var allowed = "video[src,height,width]";

      if (CKEDITOR.dialog.isTabEnabled(editor, "video", "properties"))
        allowed += ";video[loop, autoplay, controls]";
      if (CKEDITOR.dialog.isTabEnabled(editor, "video", "advanced"))
        allowed += ";video[id]{*}(*)";

      var audioAllowed = "audio[src,height,width]";
      if (CKEDITOR.dialog.isTabEnabled(editor, "audio", "properties"))
        audioAllowed += ";audio[loop, autoplay, controls]";
      if (CKEDITOR.dialog.isTabEnabled(editor, "audio", "advanced"))
        audioAllowed += ";audio[id]{*}(*)";

      CKEDITOR.tools.extend(
        editor.lang.fakeobjects,
        lang.extfakeobjects
      );
      var videoCmd = editor.addCommand( "video", new CKEDITOR.dialogCommand("video", {
          allowedContent: allowed,
          requiredContent: "video"
        })
      );
      editor.addFeature(videoCmd);

      editor.ui.addButton("video", {
        label: lang.video,
        command: "video"
      });
      editor.ui.addButton("audio", {
        label: lang.audio,
        command: "audio"
      });
      CKEDITOR.dialog.add("video", this.path + "dialogs/video.js");

      var audioCmd = editor.addCommand("audio", new CKEDITOR.dialogCommand("audio", {
        allowedContent: audioAllowed,
        requiredContent: 'audio'
      }));
      editor.addFeature(audioCmd);
      CKEDITOR.dialog.add("audio", this.path + "dialogs/audio.js");

      editor.addMovie = function(src, width, height, image) {
        var defWidth = width || 400,
          defHeight = height || 300,
          attribute = {
            // allowFullScreen: "true", //当类型为flash时object和embed公用的属性
            controls: "true",
            src: src,
            // poster: image,
            width: defWidth,
            height: defHeight
          },
          objectNode = null;

        objectNode = CKEDITOR.dom.element.createFromHtml( "<cke:video></cke:video>", editor.document);

        if(image){
          attribute.poster = image;
        }
        objectNode.setAttributes(attribute);

        // Refresh the fake image.
        var movieType = "video";
        var newFakeImage = editor.createFakeElement( objectNode, "cke_video", movieType, true);
        editor.insertElement(newFakeImage);
      };
      editor.addAudio = function(src, image) {
        var defWidth = 400,
          defHeight = 27,
          attribute = {
            src: src,
            controls: true
            // width: defWidth,
            // height: defHeight
          },
          objectNode = null;

        objectNode = CKEDITOR.dom.element.createFromHtml("<cke:audio></cke:audio>",editor.document);
        objectNode.setAttributes(attribute);

        var newFakeImage = editor.createFakeElement(objectNode, "cke_audio", "audio", true);
        if (image) {
          //创建外层标签
          var divEle = CKEDITOR.dom.element.createFromHtml(
              '<div style="text-align: center;width:400px;margin:0 auto;"></div>',
              editor.document
            ),
            imgEle = CKEDITOR.dom.element.createFromHtml(
              '<img src="' + image + '" width=400/>',
              editor.document
            );
          divEle.append(imgEle);
          divEle.append(newFakeImage);
          editor.insertElement(divEle);
        } else {
          editor.insertElement(newFakeImage);
        }
      };

      // setTimeout(function() {
      //   editor.addMovie('a.mp4', 400, 300,'a.jpg');
      //   editor.addAudio('a.mp4', 'a.jpg');
      // }, 1000);
      CKEDITOR.addCss(
      "img.cke_video" +
        "{" +
        "background-image: url(" +
        CKEDITOR.getUrl(this.path + "images/placeholder.png") +
        ");" +
        "background-position: center center;" +
        "background-repeat: no-repeat;" +
        "border: 1px solid #a9a9a9;" +
        "width: 128px;" +
        "height: 128px;" +
        "}" +
        "img.cke_audio" +
        "{" +
        "width: 400px; height:27px;" +
        "background:url(" +
        CKEDITOR.getUrl(this.path + "images/placeholder_audio.png") +
        ") center no-repeat;" +
        "}"
      );

      // If the "menu" plugin is loaded, register the menu items.
      if (editor.addMenuItems) {
        editor.addMenuGroup("audio", 25); //创建wmp菜单组
        editor.addMenuGroup("video", 26); //创建newflash菜单组
        editor.addMenuItems({
          video: {
            label: lang.properties,
            command: "video",
            group: "video"
          },
          audio: {
            label: lang.audiotitle,
            command: "audio",
            group: "audio"
          }
        });
      }

      editor.on("doubleclick", function(evt) {
        var element = evt.data.element;
        if (element.is("img")) {
          var relType = element.data("cke-real-element-type");
          if (relType == "video") {
            evt.data.dialog = "video";
          } else if (relType == "audio") {
            evt.data.dialog = "audio";
          }
        }
      });

      // If the "contextmenu" plugin is loaded, register the listeners.
      if (editor.contextMenu) {
        editor.contextMenu.addListener(function(element, selection) {
          if (element && element.is("img") && !element.isReadOnly())
            var relType = element.data("cke-real-element-type");
          if (relType == "video") {
            return { video: CKEDITOR.TRISTATE_OFF };
          } else if (relType == "audio") {
            return { audio: CKEDITOR.TRISTATE_OFF };
          }
        });
      }

      // 处理vido和audio标签
      // editor.on(
      //   "toHtml",
      //   function(evt) {
      //     var evtData = evt.data,
      //       data = evtData.dataValue;
      //     var protectElementNamesRegex = /(<\/?)((?:video)([\s][^>]*)?>)/gi;
      //
      //     data = data.replace(protectElementNamesRegex, "$1cke:$2");
      //
      //     evtData.dataValue = data;
      //   },
      //   null,
      //   null,
      //   4
      // );
    },

    afterInit: function(editor) {
      var dataProcessor = editor.dataProcessor,
        dataFilter = dataProcessor && dataProcessor.dataFilter;

      if (dataFilter) {
        // 删除原来flash中注册的处理
        // var elements = dataFilter.elementsRules;
        // delete(elements['cke:object']);
        // delete(elements['cke:embed']);
        // elements.$length -= 2;

        dataFilter.addRules(
          {
            elements: {
              "video": function(element) {
                return createFakeElement(editor, element, "video");
              },
              "audio": function(element) {
                return createFakeElement(editor, element, "audio");
              }
            }
          },
          5
        );
      }
    },

    requires: ["fakeobjects"]
  });
})();
