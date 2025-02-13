/*
Copyright (c) 2003-2012, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.html or http://ckeditor.com/license
*/

(function()
{
	var attributesMap ={
    src: '',
    autoplay: false,
    loop: false,
    controls: true,
    id: '',
    class: '',
    style: '',
  };

	function loadValue( objectNode, paramMap ){

		var isCheckbox = ( this instanceof CKEDITOR.ui.dialog.checkbox );
    var key = this.id;
    var attrDef = attributesMap[ key ];
    if ( objectNode.getAttribute( key ) !== null )
    {
      var value = objectNode.getAttribute( key );
      if ( isCheckbox )
        this.setValue( value.toLowerCase() == 'true' );
      else
        this.setValue( value );
      return;
    }
    else if ( isCheckbox )
      this.setValue( attrDef );
	}

	function commitValue( objectNode, paramMap ){

		var isRemove = ( this.getValue() === '' );
		var isCheckbox = ( this instanceof CKEDITOR.ui.dialog.checkbox );
    var key = this.id;
    var attrDef = attributesMap[ key ];
    var value = this.getValue();
    if ( isRemove || isCheckbox && value === attrDef )
      objectNode.removeAttribute( key );
    else
      objectNode.setAttribute( key, value );
	}

	CKEDITOR.dialog.add( 'audio', function( editor )
	{
    var lang = editor.lang.aicosMedia;
    // var audioUploadRename = editor.config.filebrowserAudioUploadRename;
    // var filebrowserUploadRename = editor.config.filebrowserUploadRename;
    var audioUploadSuffix = editor.config.filebrowserAudioUploadSuffix;
    var filebrowserUploadSuffix = editor.config.filebrowserUploadSuffix;

    // var ifRename = '';
    var uploadSuffix = [];
    // if (audioUploadRename !== undefined) {
    //   ifRename = audioUploadRename
    // } else if (filebrowserUploadRename !== undefined) {
    //   ifRename = filebrowserUploadRename
    // }
    if (audioUploadSuffix !== undefined) {
      uploadSuffix = audioUploadSuffix
    } else if (filebrowserUploadSuffix !== undefined) {
      uploadSuffix = filebrowserUploadSuffix
    }

		return {
			title : lang.audiotitle,
			minWidth : 420,
			minHeight : 310,
			onShow : function()
			{
				// Clear previously saved elements.
				this.fakeImage = this.objectNode = null;

				// Try to detect any embed or object tag that has Flash parameters.
				var fakeImage = this.getSelectedElement();
				if ( fakeImage && fakeImage.data( 'cke-real-element-type' ) && fakeImage.data( 'cke-real-element-type' ) == 'audio' )
				{
					this.fakeImage = fakeImage;

					var realElement = editor.restoreRealElement( fakeImage ),
						objectNode = null,
            paramMap = {}

          objectNode = realElement;
          var array = [ 'id', 'controls', 'autoplay', 'loop', 'src', 'style', 'class']
          for(var u = 0,r = array.length; u<r; u++) {
            var key = array[u]
            paramMap[key] = objectNode.getAttribute(key)
          }

					this.objectNode = objectNode;

					this.setupContent( objectNode, paramMap, fakeImage );
          // var urlField = this.getContentElement( 'info', 'src' );
          // urlField.select();
				}
			},
			onOk : function()
			{
				var objectNode = null,
					paramMap = null;
				if ( !this.fakeImage ){
						objectNode = CKEDITOR.dom.element.createFromHtml( '<cke:audio></cke:audio>', editor.document );
				}else{
					objectNode = this.objectNode;
				}

				if ( objectNode ){
					paramMap = {};
          var array = [ 'id', 'controls', 'autoplay', 'loop', 'src', 'style', 'class']
          for(var u = 0,r = array.length; u<r; u++) {
            var key = array[u]
            paramMap[key] = objectNode.getAttribute(key)
          }
				}
				var extraStyles = {}, extraAttributes = {};
				this.commitContent( objectNode, paramMap, extraStyles, extraAttributes );

				// Refresh the fake image.
				var newFakeImage = editor.createFakeElement( objectNode, 'cke_audio', 'audio', true );
				newFakeImage.setAttributes( extraAttributes );
				newFakeImage.setStyles( extraStyles );
				if ( this.fakeImage ){
					newFakeImage.replace( this.fakeImage );
					editor.getSelection().selectElement( newFakeImage );
				}
				else
					editor.insertElement( newFakeImage );
			},

			onHide : function()
			{
				if ( this.preview )
					this.preview.setHtml('');

			},

			contents : [
				{
					id : 'info',
					label : editor.lang.common.generalTab,
					accessKey : 'I',
					elements :
					[
						{
							type : 'vbox',
							padding : 0,
							children :
							[
								{
									type : 'hbox',
									widths : [ '280px', '110px' ],
									align : 'right',
									children :
									[
										{
											id : 'src',
											type : 'text',
											label : editor.lang.common.url,
											required : true,
											validate : CKEDITOR.dialog.validate.notEmpty( lang.validateSrc ),
											setup : loadValue,
											commit : commitValue
										},
										{
											type : 'button',
											id : 'browse',
											filebrowser : 'info:src',
											hidden : true,
											// v-align with the 'src' field.
											// TODO: We need something better than a fixed size here.
											style : 'display:inline-block;margin-top:10px;',
											label : editor.lang.common.browseServer
										}
									]
								}
							]
						}
					]
				},
				{
					id : 'properties',
					label : lang.propertiesTab,
					elements :
					[
            {
              type: 'fieldset',
              label: CKEDITOR.tools.htmlEncode( lang.audiovars ),
              children: [ {
                type: 'vbox',
                padding: 0,
                children: [ {
                  type: 'checkbox',
                  id: 'controls',
                  label: '启用控制按钮',
                  'default': false,
                  setup: loadValue,
                  commit: commitValue
                },
                  {
                    type: 'checkbox',
                    id: 'autoplay',
                    label: lang.chkPlay,
                    'default': false,
                    setup: loadValue,
                    commit: commitValue
                  },
                  {
                    type: 'checkbox',
                    id: 'loop',
                    label: lang.chkLoop,
                    'default': false,
                    setup: loadValue,
                    commit: commitValue
                    // },
                    // {
                    // 	type: 'checkbox',
                    // 	id: 'allowFullScreen',
                    // 	label: lang.chkFull,
                    // 	'default': true,
                    // 	setup: loadValue,
                    // 	commit: commitValue
                  } ]
              } ]
            }
					]
				},
        {
          id : 'Upload',
          hidden : true,
          filebrowser : 'uploadButton',
          label : editor.lang.common.upload,
          elements :[
            {
                type : 'file',
                id : 'upload',
                label : editor.lang.common.upload,
                size : 38,
                onChange:function(){
                    var value=this.getValue(),
                        reg=new RegExp(".("+uploadSuffix.join('|')+")$","i"),
                        uploadBtn=this.getDialog().getContentElement('Upload', 'uploadButton');
                    if(!reg.test(value)){
                        uploadBtn.disable();
                        alert(lang.validateAudio+uploadSuffix.join(','));
                    }else{
                        uploadBtn.enable();
                    };
                }
            },
            {
                type : 'fileButton',
                id : 'uploadButton',
                label : editor.lang.common.uploadSubmit,
                filebrowser : 'info:src',
                'for' : [ 'Upload', 'upload' ]
            }]
        },
				{
					id : 'advanced',
					label : editor.lang.common.advancedTab,
					elements :
					[
						{
							type : 'hbox',
							children :
							[
								{
									type : 'text',
									id : 'id',
									label : editor.lang.common.id,
									setup : loadValue,
									commit : commitValue
								}
							]
						},
            {
              type : 'text',
              id : 'class',
              label : editor.lang.common.cssClass,
              setup : loadValue,
              commit : commitValue
            },
						{
							type : 'text',
							id : 'style',
							validate : CKEDITOR.dialog.validate.inlineStyle( editor.lang.common.invalidInlineStyle ),
							label : editor.lang.common.cssStyle,
							setup : loadValue,
							commit : commitValue
						}
					]
				}
			]
		};
	} );
})();
