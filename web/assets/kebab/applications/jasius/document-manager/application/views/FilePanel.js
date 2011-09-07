/**
 * Document Manager Application Document Add FormPanel
 *
 * @category    Kebab (kebab-reloaded)
 * @package     Applications
 * @namespace   KebabOS.applications.documentManager.application.views.DocumentAddWindow
 * @author      Tayfun Öziş ERİKAN <tayfun.ozis.erikan@lab2023.com>
 * @copyright   Copyright (c) 2010-2011 lab2023 - internet technologies TURKEY Inc. (http://www.lab2023.com)
 * @license     http://www.kebab-project.com/cms/licensing
 */

KebabOS.applications.documentManager.application.views.FilePanel = Ext.extend(Ext.Panel, {

    owner: null,
    
    layout: {
        type: 'hbox',
        pack: 'start',
        align: 'stretch'
    },
    frame:true,
    border: false,

    initComponent: function() {

        var statusIconRenderer = function(value){
            switch(value){
                default:
                    return value;
                case 'Pending':
                    return '<img src="hourglass.png" width=16 height=16>';
                case 'Sending':
                    return '<img src="loading.gif" width=16 height=16>';
                case 'Error':
                    return '<img src="cross.png" width=16 height=16>';
                case 'Cancelled':
                case 'Aborted':
                    return '<img src="cancel.png" width=16 height=16>';
                case 'Uploaded':
                    return '<img src="tick.png" width=16 height=16>';
            }
        },

        progressBarColumnTemplate = new Ext.XTemplate(
            '<div class="ux-progress-cell-inner ux-progress-cell-inner-center ux-progress-cell-foreground">',
                '<div>{value} %</div>',
            '</div>',
            '<div class="ux-progress-cell-inner ux-progress-cell-inner-center ux-progress-cell-background" style="left:{value}%">',
                '<div style="left:-{value}%">{value} %</div>',
            '</div>'
        ),

        progressBarColumnRenderer = function(value, meta, record, rowIndex, colIndex, store){
            meta.css += ' x-grid3-td-progress-cell';
            return progressBarColumnTemplate.apply({
                value: value
            });
        },

        updateFileUploadRecord = function(id, column, value){
            var rec = fileUploadPanel.awesomeUploaderGrid.store.getById(id);
            rec.set(column, value);
            rec.commit();
        };

        var uploader = new Ext.Panel({
            title:'Ext JS Super Uploader'
            ,items:[
                {
                    xtype:'awesomeuploader'
                    ,ref:'awesomeUploader'
                    ,extraPostData:{
                    'key':'value'
                    ,'test':'testvalue'
                }
                    ,height:40
                    ,allowDragAndDropAnywhere:true
                    ,autoStartUpload:false
                    ,maxFileSizeBytes: 15 * 1024 * 100024 // 15 MiB
                    ,listeners:{
                    scope:this
                    ,fileselected:function(awesomeUploader, file) {

                        //Example of cancelling a file to be selection
                        if (file.name == 'image.jpg') {
                            Ext.Msg.alert('Error', 'You cannot upload a file named "image.jpg"');
                            return false;
                        }

                        fileUploadPanel.awesomeUploaderGrid.store.loadData({
                            id:file.id
                            ,name:file.name
                            ,size:file.size
                            ,status:'Pending'
                            ,progress:0
                        }, true);
                    }
                    ,uploadstart:function(awesomeUploader, file) {

                        updateFileUploadRecord(file.id, 'status', 'Sending');
                    }
                    ,uploadprogress:function(awesomeUploader, fileId, bytesComplete, bytesTotal) {

                        updateFileUploadRecord(fileId, 'progress', Math.round((bytesComplete / bytesTotal) * 100));
                    }
                    ,uploadcomplete:function(awesomeUploader, file, serverData, resultObject) {
                        //Ext.Msg.alert('Data returned from server'+ serverData);

                        try {
                            var result = Ext.util.JSON.decode(serverData);//throws a SyntaxError.
                        } catch(e) {
                            resultObject.error = 'Invalid JSON data returned';
                            return false;
                        }
                        resultObject = result;

                        if (result.success) {
                            updateFileUploadRecord(file.id, 'progress', 100);
                            updateFileUploadRecord(file.id, 'status', 'Uploaded');
                        } else {
                            return false;
                        }

                    }
                    ,uploadaborted:function(awesomeUploader, file) {
                        updateFileUploadRecord(file.id, 'status', 'Aborted');
                    }
                    ,uploadremoved:function(awesomeUploader, file) {

                        fileUploadPanel.awesomeUploaderGrid.store.remove(fileUploadPanel.awesomeUploaderGrid.store.getById(file.id));
                    }
                    ,uploaderror:function(awesomeUploader, file, serverData, resultObject) {
                        resultObject = resultObject || {};

                        var error = 'Error! ';
                        if (resultObject.error) {
                            error += resultObject.error;
                        }

                        updateFileUploadRecord(file.id, 'progress', 0);
                        updateFileUploadRecord(file.id, 'status', 'Error');

                    }
                }
                },
                {
                    xtype:'grid'
                    ,ref:'awesomeUploaderGrid'
                    ,width:420
                    ,height:200
                    ,enableHdMenu:false
                    ,tbar:[
                    {
                        text:'Start Upload'
                        ,icon:'tick.png'
                        ,scope:this
                        ,handler:function() {
                        fileUploadPanel.awesomeUploader.startUpload();
                    }
                    },
                    {
                        text:'Abort'
                        ,icon:'cancel.png'
                        ,scope:this
                        ,handler:function() {
                        var selModel = fileUploadPanel.awesomeUploaderGrid.getSelectionModel();
                        if (!selModel.hasSelection()) {
                            Ext.Msg.alert('', 'Please select an upload to cancel');
                            return true;
                        }
                        var rec = selModel.getSelected();
                        fileUploadPanel.awesomeUploader.abortUpload(rec.data.id);
                    }
                    },
                    {
                        text:'Abort All'
                        ,icon:'cancel.png'
                        ,scope:this
                        ,handler:function() {
                        fileUploadPanel.awesomeUploader.abortAllUploads();
                    }
                    },
                    {
                        text:'Remove'
                        ,icon:'cross.png'
                        ,scope:this
                        ,handler:function() {
                        var selModel = fileUploadPanel.awesomeUploaderGrid.getSelectionModel();
                        if (!selModel.hasSelection()) {
                            Ext.Msg.alert('', 'Please select an upload to cancel');
                            return true;
                        }
                        var rec = selModel.getSelected();
                        fileUploadPanel.awesomeUploader.removeUpload(rec.data.id);
                    }
                    },
                    {
                        text:'Remove All'
                        ,icon:'cross.png'
                        ,scope:this
                        ,handler:function() {
                        fileUploadPanel.awesomeUploader.removeAllUploads();
                    }
                    }
                ]
                    ,store:new Ext.data.JsonStore({
                    fields: ['id','name','size','status','progress']
                    ,idProperty: 'id'
                })
                    ,columns:[
                    {header:'File Name',dataIndex:'name', width:150}
                    ,
                    {header:'Size',dataIndex:'size', width:60, renderer:Ext.util.Format.fileSize}
                    ,
                    {header:'&nbsp;',dataIndex:'status', width:30, renderer:statusIconRenderer}
                    ,
                    {header:'Status',dataIndex:'status', width:60}
                    ,
                    {header:'Progress',dataIndex:'progress', renderer:progressBarColumnRenderer}
                ]
                }
            ]
        });

        this.items = [uploader];

        KebabOS.applications.documentManager.application.views.FilePanel.superclass.initComponent.call(this);
    },

    listeners: {
        activate: function(panel) { // HBox layout bug fix
            panel.doLayout();
            this.onLoad();
        }
    },
    onLoad: function() {
        var contentId = this.owner.contentId;
        /*if (contentId != null) {
            this.accessFrom.getForm().load({
                url : Kebab.helper.url('jasius/file'),
                waitMsg: 'Loading...',
                params: {
                    contentId : contentId
                },
                method:'GET',
                success : function (form, action) {
                    
                },
                scope:this
            });
        }*/
    }
});