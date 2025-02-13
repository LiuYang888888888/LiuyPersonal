/**
 * @license Copyright (c) 2003-2016, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

( function() {

	var attributesMap = {
		play: {name: 'autoplay'},
		menu: {name: 'controls'}
	};

	var names = [ 'id', 'loop', 'src', 'width', 'height', 'style', 'class'];
	for ( var i = 0; i < names.length; i++ ) {
		attributesMap[ names[ i ] ] = {name: names[ i ]};
	}

	names = [ 'play', 'loop', 'menu' ];
	for ( i = 0; i < names.length; i++ )
		attributesMap[ names[ i ] ][ 'default' ] = false;

	function loadValue( objectNode, paramMap ) {
		var attributes = attributesMap[ this.id ];
		if ( !attributes ){
      return;
    }

		var isCheckbox = ( this instanceof CKEDITOR.ui.dialog.checkbox );

		var attrName = attributes.name;
    if ( paramMap[attrName] !== null ) {
			var value = paramMap[attrName];
			if ( isCheckbox ) {
				this.setValue( value && value.toLowerCase() === 'true' );
			} else {
				this.setValue( value );
			}
		} else if ( isCheckbox ) {
			this.setValue( !!attributes['default'] );
		}
	}

	function commitValue( objectNode, paramMap ) {
		var attributes = attributesMap[ this.id ];
		if ( !attributes ) {
      return;
    }

		var isRemove = ( this.getValue() === '' ),
			isCheckbox = ( this instanceof CKEDITOR.ui.dialog.checkbox );

		var value = this.getValue();
		if ( isRemove || isCheckbox && value === attributes[ 'default' ] )
			objectNode.removeAttribute( attributes.name );
		else
			objectNode.setAttribute( attributes.name, value );
	}

	CKEDITOR.dialog.add( 'video', function( editor ) {
    var lang = editor.lang.aicosMedia;
    // var videoUploadRename = editor.config.filebrowserVideoUploadRename;
    // var filebrowserUploadRename = editor.config.filebrowserUploadRename;
    var videoUploadSuffix = editor.config.filebrowserVideoUploadSuffix;
    var filebrowserUploadSuffix = editor.config.filebrowserUploadSuffix;

    // var ifRename = '';
    var uploadSuffix = [];
    // if (videoUploadRename !== undefined) {
    //     ifRename = videoUploadRename
    // } else if (filebrowserUploadRename !== undefined) {
    //     ifRename = filebrowserUploadRename
    // }
    if (videoUploadSuffix !== undefined) {
        uploadSuffix = videoUploadSuffix
    } else if (filebrowserUploadSuffix !== undefined) {
        uploadSuffix = filebrowserUploadSuffix
    }

		return {
			title: lang.title,
			minWidth: 420,
			minHeight: 310,
      onShow: function() {
				// Clear previously saved elements.
				this.fakeImage = this.objectNode = null;

				// Try to detect any embed or object tag that has Flash parameters.
				var fakeImage = this.getSelectedElement();
        var elementType = fakeImage && fakeImage.data( 'cke-real-element-type' );
				if ( elementType === 'video' ) {
					this.fakeImage = fakeImage;

					var realElement = editor.restoreRealElement( fakeImage ),
						objectNode = null,
						paramMap = {};

					objectNode = realElement;

					var array = [ 'id', 'controls', 'autoplay', 'loop', 'src', 'width', 'height', 'style', 'class']
					for(var u = 0,r = array.length; u<r; u++) {
						var key = array[u]
						paramMap[key] = objectNode.getAttribute(key)
					}

					this.objectNode = objectNode;

					this.setupContent( objectNode, paramMap, fakeImage );
				}
			},
			onOk: function() {
				var objectNode = null,
					paramMap = null,
          srcEl = this.getContentElement("info", "src"),
          ObjType = srcEl.getValue().indexOf(".swf") == -1 ? "video" : "swf";
				if ( !this.fakeImage ) {
						objectNode = CKEDITOR.dom.element.createFromHtml( '<cke:video></cke:video>', editor.document );
				} else {
					objectNode = this.objectNode;
				}

				// Produce the paramMap if there's an object tag.
				if ( objectNode ) {
					paramMap = {};
					// var paramList = objectNode.getElementsByTag( 'param', 'cke' );
					// for ( var i = 0, length = paramList.count(); i < length; i++ )
					// 	paramMap[ paramList.getItem( i ).getAttribute( 'name' ) ] = paramList.getItem( i );
					var array = [ 'id', 'controls', 'autoplay', 'loop', 'src', 'width', 'height', 'style', 'class']
          for(var u = 0,r = array.length; u<r; u++) {
              var key = array[u]
              paramMap[key] = objectNode.getAttribute(key)
          }
				}

				// A subset of the specified attributes/styles
				// should also be applied on the fake element to
				// have better visual effect. (#5240)
				var extraStyles = {},
					extraAttributes = {};
				this.commitContent( objectNode, paramMap, extraStyles, extraAttributes );

				// Refresh the fake image.
				var newFakeImage = editor.createFakeElement( objectNode, 'cke_video', ObjType, true );
				newFakeImage.setAttributes( extraAttributes );
				newFakeImage.setStyles( extraStyles );
				if ( this.fakeImage ) {
					newFakeImage.replace( this.fakeImage );
					editor.getSelection().selectElement( newFakeImage );
				} else {
					editor.insertElement( newFakeImage );
				}
			},

			onHide: function() {
				if ( this.preview )
					this.preview.setHtml( '' );
			},

			contents: [ {
				id: 'info',
				label: editor.lang.common.generalTab,
				accessKey: 'I',
				elements: [ {
					type: 'vbox',
					padding: 0,
					children: [ {
						type: 'hbox',
						widths: [ '280px', '110px' ],
						align: 'right',
						className: 'cke_dialog_flash_url',
						children: [ {
							id: 'src',
							type: 'text',
							label: editor.lang.common.url,
							required: true,
							validate: CKEDITOR.dialog.validate.notEmpty( lang.validateSrc ),
							setup: loadValue,
							commit: commitValue,
							onLoad: function() {
							}
						},
						{
							type: 'button',
							id: 'browse',
							filebrowser: 'info:src',
							hidden: true,
							// v-align with the 'src' field.
							// TODO: We need something better than a fixed size here.
							style: 'display:inline-block;margin-top:14px;',
							label: editor.lang.common.browseServer
						} ]
					} ]
				},
				{
					type: 'hbox',
					widths: [ '25%', '75%' ],
					children: [ {
						type: 'text',
						id: 'width',
						requiredContent: 'video[width]',
						style: 'width:95px',
						label: editor.lang.common.width,
						validate: CKEDITOR.dialog.validate.htmlLength( editor.lang.common.invalidHtmlLength.replace( '%1', editor.lang.common.width ) ),
						setup: loadValue,
						commit: commitValue
					},
					{
						type: 'text',
						id: 'height',
						requiredContent: 'video[height]',
						style: 'width:95px',
						label: editor.lang.common.height,
						validate: CKEDITOR.dialog.validate.htmlLength( editor.lang.common.invalidHtmlLength.replace( '%1', editor.lang.common.height ) ),
						setup: loadValue,
						commit: commitValue
					} ]
				} ]
			},
			{
				id: 'properties',
				label: lang.propertiesTab,
				elements: [
				{
					type: 'fieldset',
					label: CKEDITOR.tools.htmlEncode( lang.flashvars ),
					children: [ {
						type: 'vbox',
						padding: 0,
						children: [ {
							type: 'checkbox',
							id: 'menu',
							label: '启用控制按钮',
							'default': false,
							setup: loadValue,
							commit: commitValue
						},
						{
							type: 'checkbox',
							id: 'play',
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
				} ]
			},
      {
          id: 'Upload',
          hidden: true,
          filebrowser: 'uploadButton',
          label: editor.lang.common.upload,
          elements: [ {
            type: 'file',
            id: 'upload',
            label: editor.lang.common.upload,
            size: 38,
            onChange: function () {
              var value = this.getValue(),
                reg = new RegExp(".(" + uploadSuffix.join("|") + ")$", "i"),
                uploadButton = this.getDialog().getContentElement("Upload", "uploadButton");
              if (!reg.test(value)) {
                uploadButton.disable();
                alert(lang.validateVideo + uploadSuffix.join(","))
              } else {
                uploadButton.enable()
              }
            }
          },
            {
              type: 'fileButton',
              id: 'uploadButton',
              label: editor.lang.common.uploadSubmit,
              filebrowser: 'info:src',
              'for': [ 'Upload', 'upload' ]
            }]
        },
			{
				id: 'advanced',
				label: editor.lang.common.advancedTab,
				elements: [ {
					type: 'hbox',
					children: [ {
						type: 'text',
						id: 'id',
						requiredContent: 'video[id]',
						label: editor.lang.common.id,
						setup: loadValue,
						commit: commitValue
					} ]
				},
				{
					type: 'hbox',
					children: [ {
						type: 'text',
						id: 'class',
						requiredContent: 'video(cke-xyz)', // Random text like 'xyz' will check if all are allowed.
						label: editor.lang.common.cssClass,
						setup: loadValue,
						commit: commitValue
					} ]
				},
				{
					type: 'text',
					id: 'style',
					requiredContent: 'video{cke-xyz}', // Random text like 'xyz' will check if all are allowed.
					validate: CKEDITOR.dialog.validate.inlineStyle( editor.lang.common.invalidInlineStyle ),
					label: editor.lang.common.cssStyle,
					setup: loadValue,
					commit: commitValue
				} ]
			} ]
		};
	} );
} )();
