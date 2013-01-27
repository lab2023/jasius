/**
 * Document Manager Application Document Add FormPanel
 *
 * @category    Kebab (kebab-reloaded)
 * @package     Applications
 * @namespace   KebabOS.applications.jasius.application.views.DocumentAddWindow
 * @author      Tayfun Öziş ERİKAN <tayfun.ozis.erikan@lab2023.com>
 * @copyright   Copyright (c) 2010-2011 lab2023 - internet technologies TURKEY Inc. (http://www.lab2023.com)
 * @license     http://www.kebab-project.com/cms/licensing
 */

KebabOS.applications.jasius.application.views.FilePanel = Ext.extend(Ext.Panel, {

    owner: null,

    layout: {
        type: 'vbox',
        pack: 'start',
        align: 'stretch'
    },
    frame:true,
    bodyCfg: {
        cls: 'fileUploadArea'
    },
    border: false,
    padding: 2,


    initComponent: function(panel) {

        this.fileUploader = new KebabOS.applications.jasius.application.views.FileUpload({
            owner: this,
            height:0
        });

        this.fileGrid = new KebabOS.applications.jasius.application.views.FileGrid ({
            owner : this,
            flex:1,
            frame:true,
            uploader: this.fileUploader
        });

        this.fileUploader.fileGrid = this.fileGrid;

        this.items = [
            this.fileUploader,
            this.fileGrid
        ];

        KebabOS.applications.jasius.application.views.FilePanel.superclass.initComponent.call(this);
    },

    listeners: {
        activate: function(panel) { //KBBTODO HBox layout bug fix
            panel.doLayout();
            this.onLoad();
        }
    },

    onSubmit:function() {
        this.owner.close();
    },

    onLoad: function() {
        var contentId = this.owner.contentId;
        this.fileUploader.extraPostData = {
            contentId : this.owner.contentId
        };
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