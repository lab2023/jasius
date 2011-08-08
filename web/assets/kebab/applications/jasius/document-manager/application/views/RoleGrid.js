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

KebabOS.applications.documentManager.application.views.RoleGrid = Ext.extend(Ext.grid.GridPanel, {

    // Application bootstrap
    owner: null,

    initComponent: function() {

        // json data store
        var store = new KebabOS.applications.documentManager.application.models.RoleDataStore();

        var sm = new Ext.grid.CheckboxSelectionModel();

        var config = {
            stripeRows: true,
            trackMouseOver:true,
            clicksToEdit: true,
            viewConfig: {
                emptyText: Kebab.helper.translate('Record not found...'),
                forceFit: true
            },
            store: store,
            cm: new Ext.grid.ColumnModel({
                defaults: {
                    width: 120,
                    sortable: true
                },
                columns: [
                    sm,
                    {header: Kebab.helper.translate('Title'), width: 200, dataIndex: 'title'}
                ]
            }),
            sm: sm,
            columnLines: true
        };

        Ext.apply(this, config);

        KebabOS.applications.documentManager.application.views.RoleGrid.superclass.initComponent.apply(this, arguments);
    },

    listeners: {
        afterRender: function(grid) {
            grid.store.load();
        }
    }
});
