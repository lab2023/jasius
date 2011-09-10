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

KebabOS.applications.documentManager.application.views.FileUpload = Ext.extend(Ext.ux.AwesomeUploader, {

    owner: null,
    fileGrid: null,

    initComponent: function() {
        var config = {
            awesomeUploaderRoot: 'http://localhost/assets/vendors/swfupload/',
            allowDragAndDropAnywhere:true,
            autoStartUpload:false,
            maxFileSizeBytes: 14 * 1024 * 1024 // 1 GB
        };

        Ext.apply(this, Ext.apply(this.initialConfig, config));
        
        KebabOS.applications.documentManager.application.views.FileUpload.superclass.initComponent.call(this);
    },

    listeners: {
        fileselected:function(awesomeUploader, file) {
            this.fileGrid.getStore().loadData({
                id:file.id + this.fileGrid.getStore().data.length,
                name:file.name,
                size:file.size,
                status:'Pending',
                progress:0
            }, true);
        },
        uploadstart:function(awesomeUploader, file) {

            this.updateFileUploadRecord(file.id, 'status', 'Sending');
        },
        uploadprogress:function(awesomeUploader, fileId, bytesComplete, bytesTotal) {

            this.updateFileUploadRecord(fileId, 'progress', Math.round((bytesComplete / bytesTotal) * 100));
        },
        uploadcomplete:function(awesomeUploader, file, serverData, resultObject) {

            try {
                var result = Ext.util.JSON.decode(serverData);//throws a SyntaxError.
            } catch(e) {
                resultObject.error = 'Invalid JSON data returned';
                return false;
            }
            resultObject = result;

            if (result.success) {
                this.updateFileUploadRecord(file.id, 'progress', 100);
                this.updateFileUploadRecord(file.id, 'status', 'Uploaded');
            } else {
                return false;
            }

        },
        uploadaborted:function(awesomeUploader, file) {
            this.updateFileUploadRecord(file.id, 'status', 'Aborted');
        },
        uploadremoved:function(awesomeUploader, file) {
            var store = this.fileGrid.getStore();
            this.fileGrid.getStore().remove(store.getById(file.id));
        },
        uploaderror:function(awesomeUploader, file, serverData, resultObject) {
            resultObject = resultObject || {};

            var error = 'Error! ';
            if (resultObject.error) {
                error += resultObject.error;
            }

            this.updateFileUploadRecord(file.id, 'progress', 0);
            this.updateFileUploadRecord(file.id, 'status', 'Error');

        }
    },

    updateFileUploadRecord : function(id, column, value){
            var rec = this.fileGrid.getStore().getById(id);
            rec.set(column, value);
            rec.commit();
    }

});