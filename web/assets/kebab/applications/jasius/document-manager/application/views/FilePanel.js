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
        type: 'vbox',
        pack: 'start',
        align: 'stretch'
    },
    frame:true,
    border: false,


    initComponent: function(panel) {

        this.fileUploader = new KebabOS.applications.documentManager.application.views.FileUpload({
            owner: this,
            extraPostData : {
                contentId : this.owner.contentId
            }
        });

        this.fileGrid = new KebabOS.applications.documentManager.application.views.FileGrid ({
            owner : this,
            flex:1,
            uploader: this.fileUploader
        });

        this.fileUploader.fileGrid = this.fileGrid;
        
        this.items = [this.fileUploader, this.fileGrid];

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
        if(contentId != null) {
            Ext.Ajax.request({
                url: Kebab.helper.url('jasius/file'),
                method: 'GET',
                params: {
                    contentId : contentId
                },
                success: function(res){
                    var response = Ext.util.JSON.decode(res.responseText);
                    this.fileGrid.getStore().loadData(response.data);
                    var store = this.fileGrid.getStore();
                    if (store.data.length > 0) {
                        var rec = store.getAt(store.data.length - 1);
                        this.fileUploader.fileId = rec.data.id;
                    }
                },
                scope:this
            });
        }
    }
});