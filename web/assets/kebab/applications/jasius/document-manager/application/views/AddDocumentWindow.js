/**
 * Document Manager Application Document Add Window
 *
 * @category    Kebab (kebab-reloaded)
 * @package     Applications
 * @namespace   KebabOS.applications.documentManager.application.views.DocumentAddWindow
 * @author      Tayfun Öziş ERİKAN <tayfun.ozis.erikan@lab2023.com>
 * @copyright   Copyright (c) 2010-2011 lab2023 - internet technologies TURKEY Inc. (http://www.lab2023.com)
 * @license     http://www.kebab-project.com/cms/licensing
 */

KebabOS.applications.documentManager.application.views.DocumentAddWindow = Ext.extend(Ext.Window, {

    bootstrap: null,

    propertyData: null,

    formPanel: null,

    initComponent: function() {

        var config = {
            border: false,
            layout: 'card',
            activeItem: 0
        };

        Ext.apply(this, config);

        this.items = this.buildItems();
        this.fbar = this.buildFbar();

        KebabOS.applications.documentManager.application.views.DocumentAddWindow.superclass.initComponent.call(this);
    },

    buildItems: function() {

        this.formPanel = new KebabOS.applications.documentManager.application.views.DocumentAddFormPanel({
            title: 'Doküman Özellikleri',
            frame:true,
            propertyData: this.propertyData
        });

        return [
            this.formPanel, {
                title: 'panel 2'
            }, {
                title: 'panel 3'
            }
        ];
    },

    buildFbar: function() {
        return ['->', {
            id: this.id + '-prev',
            disabled: true,
            tooltip: 'Bir önceki ekrana döner',
            text: '&laquo; Önceki'
        },{
            id: this.id + '-next',
            iconCls: 'icon-disk',
            tooltip: 'Şu anki bilgileri kaydeder ve bir sonraki ekrana geçer',
            text: 'Kaydet &raquo;',
            handler: function() {
                this.fireEvent('submitActiveForm', this.getLayout().activeItem);
            },
            scope:this
        }];
    }
});