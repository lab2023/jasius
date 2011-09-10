/**
 * Document Manager Application Document Add FormPanel
 *
 * @category    Kebab (kebab-reloaded)
 * @package     Applications
 * @namespace   KebabOS.applications.documentManager.application.views.AccessForm
 * @author      Tayfun Öziş ERİKAN <tayfun.ozis.erikan@lab2023.com>
 * @copyright   Copyright (c) 2010-2011 lab2023 - internet technologies TURKEY Inc. (http://www.lab2023.com)
 * @license     http://www.kebab-project.com/cms/licensing
 */

KebabOS.applications.documentManager.application.views.FileGrid = Ext.extend(Ext.grid.GridPanel, {

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
                case 'Cancelled':
                case 'Aborted':
                    return '<div class="iconStatus icon-cancel" id="abort"';
                case 'Uploaded':
                    return '<div class="iconStatus icon-accept" id="uploaded">';
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
            stripeRows: true,
            trackMouseOver:true,
            clicksToEdit: true,
            viewConfig: {
                emptyText: Kebab.helper.translate('Record not found...'),
                forceFit: true
            },
            store: new Ext.data.JsonStore({
                fields: ['id','name','size','status','progress'],
                idProperty: 'id'
            }),
            cm: new Ext.grid.ColumnModel({
                defaults: {
                    sortable: true
                },
                columns: [
                    {header:'File Name',dataIndex:'name', width:150},
                    {header:'Size',dataIndex:'size', width:60, renderer:Ext.util.Format.fileSize},
                    {header:'Status',dataIndex:'status', width:30, renderer:statusIconRenderer},
                    {header:'Progress',dataIndex:'progress', renderer:progressBarColumnRenderer}
                ]
            }),
            columnLines: true,
            tbar: this.buildTbar()
        };

        Ext.apply(this, config);

        KebabOS.applications.documentManager.application.views.FileGrid.superclass.initComponent.apply(this, arguments);
    },

    buildTbar: function() {;
        return  [{
            text:'Start Upload',
            iconCls:'icon-accept',
            scope:this,
            handler:function() {
                this.uploader.startUpload();
            }
        },{
            text:'Abort',
            iconCls:'icon-cancel',
            scope:this,
            handler:function() {
                var selModel = this.getSelectionModel();
                if (!selModel.hasSelection()) {
                    Ext.Msg.alert('', 'Please select an upload to cancel');
                    return true;
                }
                var rec = selModel.getSelected();
                this.uploader.abortUpload(rec.data.id);
            }
        },{
            text:'Abort All',
            iconCls:'icon-cancel',
            scope:this,
            handler:function() {
                this.uploader.abortAllUploads();
            }
        },{
            text:'Remove',
            iconCls:'icon-delete',
            scope:this,
            handler:function() {
                var selModel = this.getSelectionModel();
                if (!selModel.hasSelection()) {
                    Ext.Msg.alert('', 'Please select an upload to cancel');
                    return true;
                }
                var rec = selModel.getSelected();
                this.uploader.removeUpload(rec.data.id);
            }
        },{
            text:'Remove All',
            iconCls:'icon-delete',
            scope: this,
            handler:function() {
                this.uploader.removeAllUploads();
            }
        }];
    }
});
