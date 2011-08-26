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
        this.fileGrid = new KebabOS.applications.documentManager.application.views.FileGrid({
            owner: this,
            flex:2,
            frame:true,
            border:true
        })

        this.items = [this.fileGrid,
            {width:5, border:false},
            {xtype:'panel', title:'viewer', flex:2,border:true}]

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