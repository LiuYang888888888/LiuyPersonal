CKEDITOR.plugins.add( 'advTable',{
    icons: 'advTable',
    init : function( editor ){
        var lang = editor.lang.table;
        var PANELTABLEROW=5;
        var PANELTABLECOL=8;

        //弹出层试按钮
        editor.ui.add( 'advTable', CKEDITOR.UI_PANELBUTTON,{
            label : lang.toolbar,
            className : 'cke_button_table',
            modes : { wysiwyg : 1 },
            panel :
            {
                title: lang.title,
                css : '.cke_table_outer{border:1px solid white;}'
                    + '.cke_table{width:100%;line-height:10px;cursor:pointer;}'
                    + '.cke_table td{border:1px solid #D0D0D0;width:10px;height:10px;}',
                attributes : { role : 'listbox', 'aria-label' : '' }
            },

            onBlock : function( panel, block )
            {
                block.autoSize = true;
                block.element.setHtml(renderTablePanel(panel));
                block.element.getDocument().getBody().setStyle( 'overflow', 'hidden' );
            }

        });
        // toolbar 中没有配置Table时，command table 是禁用的
        editor.addFeature( editor.getCommand('table') );

        function renderTablePanel(panel){
            var output = [];
            //弹出层事件
            var fn1 = CKEDITOR.tools.addFunction(function(e){
                var target=e.target;
                var colIdx=target.cellIndex,
                  rowIdx=target.parentNode.rowIndex,
                  table=target.parentNode.parentNode;
                if(table.rows){
                    for(var i=0;i<table.rows.length;i++){
                        for(var j=0;j<table.rows[i].cells.length;j++){
                            var cell=table.rows[i].cells[j];
                            if(j<=colIdx&&i<=rowIdx){
                                cell.style.background="#E0E0E0";
                            }else{
                                cell.style.background="";
                            }
                        }
                    }
                }
            });
            var fn2= CKEDITOR.tools.addFunction(function(e){
                var target=e.target;
                var colIdx=target.cellIndex+1,
                  rowIdx=target.parentNode.rowIndex+1,
                  table=target.parentNode.parentNode;
                if(table.rows){
                    for(var i=0;i<table.rows.length;i++){
                        for(var j=0;j<table.rows[i].cells.length;j++){
                            var cell=table.rows[i].cells[j];
                            cell.style.background="";
                        }
                    }
                }
                insertTable(rowIdx,colIdx);
                panel.hide();
            });
            var fn3= CKEDITOR.tools.addFunction(function(e){
                var table=e.target;
                if(table.rows){
                    for(var i=0;i<table.rows.length;i++){
                        for(var j=0;j<table.rows[i].cells.length;j++){
                            var cell=table.rows[i].cells[j];
                            cell.style.background="";
                        }
                    }
                }
            });
            output.push('<div class="cke_table_outer"><table onmousemove="CKEDITOR.tools.callFunction(', fn1, ',event);" onmouseout="CKEDITOR.tools.callFunction(', fn3, ',event);" id="select_table_panel" unselectable="on" onselectstart="return false" class="cke_table">');
            for(var i=0;i<PANELTABLEROW;i++){
                output.push("<tr>");
                for(var j=0;j<PANELTABLECOL;j++){
                    output.push('<td onclick="CKEDITOR.tools.callFunction(', fn2, ',event);">&nbsp;</td>');
                }
                output.push("</tr>");
            }
            output.push('</table>');
            output.push("<span style='width:100%; display:block; clear:both;'>");
            output.push("<input type='button' value='"+lang.title+"' onclick='CKEDITOR.instances."+editor.name+".execCommand( \"table\" );' style='width:100%; height:25px; overflow:hidden; border:1px solid #D0D0D0;background:#F1F1F1;cursor:pointer;outline: none;'/>");
            output.push("</span></div>");
            return output.join("");
        }

        var makeElement = function( name ){ return new CKEDITOR.dom.element( name, editor.document ); };
        //插入基本参数表格
        function insertTable(rows,cols){
            // var selection = editor.getSelection();
            var table = makeElement( 'table' );
            var tbody = table.append( makeElement( 'tbody' ) ),
            rows = parseInt( rows, 10 ) || 0,
            cols = parseInt( cols, 10 ) || 0;
            for ( var i = 0 ; i < rows ; i++ ){
                var row = tbody.append( makeElement( 'tr' ) );
                for ( var j = 0 ; j < cols ; j++ ){
                    var cell = row.append( makeElement( 'td' ) );
                    cell.appendBogus();
                }
            }
            table.setAttribute( 'border', 1 );
            table.setAttribute( 'style', "width: 200px;border-collapse:collapse;" );
            editor.insertElement( table );
        }
    },
    requires : [ 'table' ]
});
