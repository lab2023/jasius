/**
 * Document Manager Application Document Add FormPanel
 *
 * @category    Kebab (kebab-reloaded)
 * @package     Applications
 * @namespace   KebabOS.applications.jasius.application.views.AccessForm
 * @author      Tayfun Öziş ERİKAN <tayfun.ozis.erikan@lab2023.com>
 * @copyright   Copyright (c) 2010-2011 lab2023 - internet technologies TURKEY Inc. (http://www.lab2023.com)
 * @license     http://www.kebab-project.com/cms/licensing
 */

KebabOS.applications.jasius.application.views.FileGrid = Ext.extend(Ext.grid.GridPanel, {

    // Application bootstrap
    owner: null,
    uploader : null,

    initComponent: function() {

        var statusIconRenderer = function(value){
            switch(value){
                default:
                    return value;
                case 'Pending':
                    return '<div class="iconStatus icon-clock" id="pending">';
                case 'Sending':
                    return '<div class="iconStatus icon-loading" id="sending">';
                case 'Error':
                    return '<div class="iconStatus icon-error" id="error">';
                case 'Aborted':
                    return '<div class="iconStatus icon-cancel" id="abort"';
                case 'Completed':
                    return '<div class="iconStatus icon-accept" id="completed">';
            }
        };

        var progressBarColumnRenderer = function(value, meta, record, rowIndex, colIndex, store){
            meta.css += ' x-grid3-td-progress-cell';
            return new Ext.XTemplate(
                '<div class="ux-progress-cell-inner ux-progress-cell-inner-center ux-progress-cell-foreground">',
                    '<div>{value} %</div>',
                '</div>',
                '<div class="ux-progress-cell-inner ux-progress-cell-inner-center ux-progress-cell-background" style="left:{value}%">',
                    '<div style="left:-{value}%">{value} %</div>',
                '</div>'
            ).apply({
                value: value
            });
        };

        var config = {
            enableHdMenu:false,
            stripeRows: false,
            trackMouseOver:true,
            clicksToEdit: true,
            viewConfig: {
                emptyText: Kebab.helper.translate('Drag &amp; drop your files here...'),
                forceFit: true
            },
            store: new Ext.data.JsonStore({
                fields: ['id','name','size','mime','status','progress'],
                idProperty: 'id'
            }),
            cm: new Ext.grid.ColumnModel({
                defaults: {
                    sortable: true
                },
                columns: [
                    new Ext.grid.RowNumberer(),
                    {header:'ID',dataIndex:'id', width:20},
                    {header:Kebab.helper.translate('File Name'),dataIndex:'name', width:150,
                        renderer: function(v,m,rec) {
                            var url = BASE_URL+'/uploads/'+rec.data.name; //TODO move config
                            return "<a href='"+url+"' target='_blank'>"+v+"</a> ";
                        }
                    },
                    {header:Kebab.helper.translate('Size'),dataIndex:'size', width:60, renderer:Ext.util.Format.fileSize},
                    {header:Kebab.helper.translate('Mime'), dataIndex:'mime',width:60},
                    {header:Kebab.helper.translate('Progress'),dataIndex:'progress', renderer:progressBarColumnRenderer},
                    {header:Kebab.helper.translate('Status'),dataIndex:'status', align:'center', width:30, renderer:statusIconRenderer},
                    {
                        xtype: 'actioncolumn',
                        header:Kebab.helper.translate('Operation'),
                        align:'center',
                        width: 30,
                        items: [{
                            getClass: function(v, meta, rec) {

                                // is image ?
                                if (rec.data.mime.indexOf('image')!= -1 && rec.data.status == 'Completed') {
                                    this.items[0].tooltip = Kebab.helper.translate('Preview Image');
                                    return 'icon-picture action-cloumn';
                                } else if (rec.data.mime.indexOf('pdf')!= -1 && rec.data.status == 'Completed'){ // is pdf and upload status complated ?
                                    this.items[0].tooltip = Kebab.helper.translate('PDF Preview');
                                    return 'icon-page-white-acrobat action-cloumn';
                                }

                                if (rec.data.mime.indexOf('image')== -1 && rec.data.status == 'Completed'){ // is file and upload status complated ?
                                    this.items[0].tooltip = Kebab.helper.translate('Download / Open File');
                                    return 'icon-disk action-cloumn';
                                } else {
                                    this.items[0].tooltip = Kebab.helper.translate('File or picture is not ready');
                                    return 'icon-cancel action-cloumn';
                                }
                            },
                            handler: function(grid, rowIndex) {
                                var rec = grid.getStore().getAt(rowIndex);

                                // is image ?
                                if (rec.data.mime.indexOf('image')!= -1 && rec.data.status == 'Completed') {

                                    var image = new Ext.ux.Image ({
                                        url: BASE_URL+'/uploads/'+rec.data.name //TODO move config
                                    });

                                    var previewWin = new Ext.Window({
                                        width: 500,
                                        height: 400,
                                        modal:true,
                                        autoScroll:true,
                                        maximizable:true,
                                        iconCls: 'icon-picture',
                                        title  : 'Preview Image' + ' : ' + rec.data.name,
                                        items: image
                                    });
                                    previewWin.show();
                                }

                                // is pdf ?
                                if (rec.data.mime.indexOf('pdf')!= -1 && rec.data.status == 'Completed') {

                                    var pdfWin = new Ext.Window({
                                        width: 600,
                                        height: 500,
                                        modal:true,
                                        iconCls: 'icon-page-white-acrobat',
                                        maximizable:true,
                                        title  : 'PDF Image' + ' : ' + rec.data.name,
                                        html: "<iframe width='100%' height='100%' src='" + BASE_URL + '/uploads/' + rec.data.name + "' frameborder='0' />",
                                    });
                                    pdfWin.show();

                                    return;
                                }

                                if (rec.data.mime.indexOf('image')== -1 && rec.data.status == 'Completed'){ // is file and upload status complated ?
                                     //TODO move config
                                    window.open(BASE_URL+'/uploads/'+rec.data.name); // open in new window or download
                                }
                            }
                        }]
                    }
                ]
            }),
            columnLines: true,
            listeners: {
                rowdblclick: this.rowDoubleClick
            }
        };

        this.tbar = this.buildTbar();

        Ext.apply(this, config);

        KebabOS.applications.jasius.application.views.FileGrid.superclass.initComponent.apply(this, arguments);
    },

    rowDoubleClick : function(grid, rowIndex, obj) {
        var rec = grid.getStore().getAt(rowIndex);
        if (rec.data.mime.indexOf('image')!= -1 && rec.data.status == 'Completed') {
            var previewWin = new Ext.Window({
                title  : 'Preview',//todo width height
                items : new Ext.ux.Image ({
                    id: 'imgPreview',
                    url: BASE_URL+'/uploads/'+rec.data.name//todo move config
                })
            });
            previewWin.show();
        }

    },

    buildTbar: function() {

        var buttonWidth = 70;

        return  [{
            text:Kebab.helper.translate('Upload Now !'),
            iconCls:'icon-accept',
            scope:this,
            width:buttonWidth,
            handler:function() {
                this.uploader.startUpload();
            }
        },'->',{
            text:Kebab.helper.translate('Abort'),
            iconCls:'icon-cancel',
            scope:this,
            width:buttonWidth,
            handler:function() {
                var selModel = this.getSelectionModel();
                if (!selModel.hasSelection()) {
                    Ext.Msg.alert(Kebab.helper.translate('Warning'), Kebab.helper.translate('Please select an upload to abort'));
                    return true;
                }
                var rec = selModel.getSelected();
                this.uploader.abortUpload(rec.data.id);
            }
        },'-',{
            text:Kebab.helper.translate('Abort All'),
            iconCls:'icon-cancel',
            scope:this,
            width:buttonWidth,
            handler:function() {
                this.uploader.abortAllUploads();
            }
        },'-',{
            text:Kebab.helper.translate('Remove1'),
            iconCls:'icon-delete',
            scope:this,
            width:buttonWidth,
            handler:function() {
                 Ext.Msg.confirm(Kebab.helper.translate('Warning'), Kebab.helper.translate('Are you sure to delete file?'), function(btn, text){
                    if (btn == 'yes'){
                        var selModel = this.getSelectionModel();
                        if (!selModel.hasSelection()) {
                            Ext.Msg.alert(Kebab.helper.translate('Warning'), Kebab.helper.translate('Please select an upload to abort'));
                            return true;
                        }
                        var rec = selModel.getSelected();
                        this.uploader.removeUpload(rec.data.id);
                        if (rec.data.status == 'Completed') {
                            Ext.Ajax.request({
                                url: Kebab.helper.url('jasius/file'),
                                method: 'DELETE',
                                params: {
                                    fileId : rec.data.id
                                },
                                success: function(res){
                                    var rnum = this.getStore().find('id',rec.data.id);
                                    this.getStore().remove(this.getStore().getAt(rnum));
                                },
                                scope:this
                            });
                        }
                    }
                 },this);
            }
        },'-',{
            text:Kebab.helper.translate('Remove All'),
            iconCls:'icon-delete',
            scope: this,
            width:buttonWidth,
            handler:function() {
                Ext.Msg.confirm(Kebab.helper.translate('Warning'),Kebab.helper.translate('Are you sure to delete all file?'), function(btn, text){
                    if (btn == 'yes'){
                        this.uploader.removeAllUploads();
                        Ext.Ajax.request({
                            url: Kebab.helper.url('jasius/file'),
                            method: 'DELETE',
                            params: {
                                contentId : this.owner.owner.contentId
                            },
                            success: function(res){
                                this.getStore().loadData([],false);
                            }, // todo error message and reload grid
                            scope:this
                        });
                    }
                },
                this);
            }
        }];
    }
});
