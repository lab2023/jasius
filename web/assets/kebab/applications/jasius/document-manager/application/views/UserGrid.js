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

KebabOS.applications.documentManager.application.views.UserGrid = Ext.extend(Ext.grid.GridPanel, {

    // Application bootstrap
    owner: null,

    initComponent: function() {

        // json data store
        this.comboStore = new KebabOS.applications.documentManager.application.models.UserDataStore();
        this.store = new Ext.data.JsonStore({
            fields: ['id', 'fullName']
        });
        var config = {
            loadMask: true,
            viewConfig: {
                // To be equal to the width of columns
                forceFit: true
            }
        };
        var userCombobox = new Kebab.library.ext.AutocompleteComboBox({
            tpl:'<tpl for="."><div ext:qtip="{fullName}" class="x-combo-list-item">{fullName} - {email}</div></tpl>',
            emptyText:Kebab.helper.translate('Name Surname or E-mail write...'),
            typeAhead: true,
            triggerAction: 'all',
            forceSelection: true,
            lazyRender:false,
            mode: 'remote',
            store: this.comboStore,
            valueField: 'id',
            displayField: 'fullName',
            hiddenName: 'userId',
            scope:this,
            width:300,
            listeners: {
                select : {fn:function (combo) {
                    if(this.store.find('id', combo.getValue()) == -1){
                        var record = new this.store.recordType({
                            id: combo.getValue(),
                            fullName: combo.lastSelectionText
                        });
                        this.store.insert(0, record);
                    } else {
                        Kebab.helper.message(Kebab.helper.translate('Warning'),
                            Kebab.helper.translate('There is exist in list'),
                            true,
                            'WARN');
                    }
                    combo.setValue(null);
                }},
                scope :this
            }
        });

        this.tbar = [
            userCombobox
        ];
        this.columns = [
            {
                header   : 'ID',
                width:5,
                dataIndex: 'id',
                sortable:true
            },{
                header   : Kebab.helper.translate('Full Name'),
                width:90,
                dataIndex: 'fullName',
                sortable:true
            },{
                xtype: 'actioncolumn',
                width: 5,
                items: [{
                    iconCls   : 'icon-delete action-cloumn',  // Use a URL in the icon config
                    tooltip: Kebab.helper.translate('Delete User'),
                    handler: function(grid, rowIndex) {
                        var rec = grid.getStore().getAt(rowIndex);
                        grid.getStore().remove(rec);
                    }
                }]
            }
        ];

        Ext.apply(this, config);

        KebabOS.applications.documentManager.application.views.UserGrid.superclass.initComponent.apply(this, arguments);
    }
});
