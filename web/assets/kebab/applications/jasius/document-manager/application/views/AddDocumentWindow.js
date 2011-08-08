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
            activeItem: 1
        };

        Ext.apply(this, config);

        this.items = this.buildItems();
        this.fbar = this.buildFbar();

        KebabOS.applications.documentManager.application.views.DocumentAddWindow.superclass.initComponent.call(this);
    },

    buildItems: function() {

        this.formPanel = new KebabOS.applications.documentManager.application.views.DocumentAddFormPanel({
            title: Kebab.helper.translate('Document Properties'),
            frame: true,
            owner: this
        });

        this.accessPanel = new KebabOS.applications.documentManager.application.views.AccessFormPanel({
            title: Kebab.helper.translate('Document Properties'),
            frame: true,
            bootstrap: this
        });

        return [
            this.formPanel,
            this.accessPanel, {
                title: 'panel 3'
            }
        ];
    },

    buildFbar: function() {

        return ['->', {
            id: this.id + '-prev',
            disabled: true,
            tooltip: Kebab.helper.translate('Returns to the previous screen'),
            text: Kebab.helper.translate('&laquo; Previous')
        },{
            id: this.id + '-next',
            iconCls: 'icon-disk',
            tooltip: Kebab.helper.translate('Save current informations and go to next screen'),
            text: Kebab.helper.translate('Save &raquo;'),
            handler: function() {
                this.fireEvent('submitActiveForm', this);
            },
            scope:this
        }];
    }
});