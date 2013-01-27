/**
 * Kebab Application Bootstrap Class
 *
 * @category    Kebab (kebab-reloaded)
 * @package     Applications
 * @namespace   KebabOS.applications.jasius.application.layouts
 * @copyright   Copyright (c) 2010-2011 lab2023 - internet technologies TURKEY Inc. (http://www.lab2023.com)
 * @license     http://www.kebab-project.com/cms/licensing
 */
KebabOS.applications.jasius.application.layouts.Layout = Ext.extend(Ext.Panel, {

    // Application bootstrap
    bootstrap: null,

    layout: 'fit',

    border: false,

    initComponent: function() {

        this.documentsGrid = new KebabOS.applications.jasius.application.views.DocumentsGridPanel({
            bootstrap: this.bootstrap
        });

        Ext.apply(this, {
            items: this.documentsGrid

        });

        KebabOS.applications.jasius.application.layouts.Layout.superclass.initComponent.call(this);
    }
});
