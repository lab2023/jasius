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

KebabOS.applications.documentManager.application.views.AccessFormPanel = Ext.extend(Ext.Panel, {

    bootstrap: null,
    layout: {
        type: 'vbox',
        align : 'stretch',
        pack  : 'start'
    },
    frame:true,
    border: false,

    initComponent: function() {

        this.accessFrom = new KebabOS.applications.documentManager.application.views.AccessForm({
            bootstrap: this.bootstrap,
            height:250,
            border:false
        });

        this.roleGrid = new KebabOS.applications.documentManager.application.views.RoleGrid({
            bootstrap: this.bootstrap,
            flex:1,
            frame:true,
            title:'Rol seç'
        });

        this.userGrid = new KebabOS.applications.documentManager.application.views.UserGrid({
            bootstrap: this.bootstrap,
            flex:1,
            frame:true,
            title:'Kullanıcı seç'
        });

        this.rolesAndUsersPanels = new Ext.Panel({
                flex:1,
            disabled:true,
            layout: {
                type: 'hbox',
                align : 'stretch',
                pack  : 'start'
            },
            border:false,
            items:[this.roleGrid,{width:5, border:false},this.userGrid]
        });

        Ext.apply(this, {
            items:[this.accessFrom,this.rolesAndUsersPanels]
        });

        KebabOS.applications.documentManager.application.views.AccessFormPanel.superclass.initComponent.call(this);
    }
});