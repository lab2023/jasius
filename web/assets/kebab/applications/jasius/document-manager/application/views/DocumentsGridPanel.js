/**
 * Document Manager Application GridPanel View
 *
 * @category    Kebab (kebab-reloaded)
 * @package     Applications
 * @namespace   KebabOS.applications.documentManager.application.views.DocumentsGridPanel
 * @author      Tayfun Öziş ERİKAN <tayfun.ozis.erikan@lab2023.com>
 * @copyright   Copyright (c) 2010-2011 lab2023 - internet technologies TURKEY Inc. (http://www.lab2023.com)
 * @license     http://www.kebab-project.com/cms/licensing
 */

KebabOS.applications.documentManager.application.views.DocumentsGridPanel = Ext.extend(Ext.grid.GridPanel, {
    
    // Application bootstrap
    bootstrap: null,

    initComponent: function() {

        // json data store
        this.store = new KebabOS.applications.documentManager.application.models.DocumentsDataStore();

        var config = {
            columnLines:true,
            stripeRows:true,
            loadMask: true,
            viewConfig: {
                forceFit: true
            }
        };
        
        Ext.apply(this, config);

        this.columns = this.buildColumns();
        this.tbar = this.buildTbar();
        this.bbar = this.buildBbar();

        KebabOS.applications.documentManager.application.views.DocumentsGridPanel.superclass.initComponent.call(this);
    },
    setColumnModel : function (propertyDt) {
        var propertyData = propertyDt.data,
        i = 0;

        Ext.each(propertyData, function(property) {
            ++i;
            if (this.getColumnModel().getColumnHeader(i) != property.title ) {
                this.addColumn(property.title, property.title, i);
            }
        }, this);

        return true;
    },

    /**
     * Build grid columns
     */
    buildColumns: function() {
        return [{
            header   : Kebab.helper.translate('ID'),
            dataIndex: 'id',
            width:5,
            sortable:true
        },{
                xtype: 'actioncolumn',
                width: 10,
                items: [{
                    iconCls   : 'icon-page-edit action-cloumn',  // Use a URL in the icon config
                    tooltip: Kebab.helper.translate('Update Content'),
                    handler: function(grid, rowIndex) {
                        var rec = grid.getStore().getAt(rowIndex);
                        this.fireEvent('updateDocument',rec.data.id);
                    },
                    scope : this
                },{
                    iconCls   : 'icon-page-delete action-cloumn',  // Use a URL in the icon config
                    tooltip: Kebab.helper.translate('Delete Content'),
                    handler: function(grid, rowIndex) {
                        Ext.Msg.confirm('Warning', 'Are you sure to delete content?', function(btn, text){
                            if (btn == 'yes'){
                                grid.deleteRow(grid, rowIndex);
                            }
                        });
                    }
                }]
        }];
    },

    deleteRow: function(grid , rowIndex) {
        var rec = grid.getStore().getAt(rowIndex);
        Ext.Ajax.request({
                url: Kebab.helper.url('jasius/content'),
                method: 'DELETE',
                params: {
                    contentId: rec.data.id
                },
                success: function(){
                    this.getStore().remove(this.getStore().getAt(rowIndex));
                },
                failure: function(){
                    Kebab.helper.message('Error','Record can not delete',false, 'ERR');
                },
                scope:this
            });

    },
    buildTbar: function() {

        var typesCombo = new Kebab.library.ext.AutocompleteComboBox({
            id: 'document-types-combo',
            emptyText: Kebab.helper.translate('Please select your file type...'),
            name: 'type',
            tpl:'<tpl for="."><div class="x-combo-list-item">{title}</div></tpl>',
            triggerAction: 'all',
            forceSelection: false,
            lazyRender:false,
            allowBlank: false,
            mode: 'remote',
            selectOnFocus: true,
            store: new KebabOS.applications.documentManager.application.models.TypesDataStore(),
            valueField: 'id',
            displayField: 'title',
            hiddenName: 'type',
            scope:this,
            listeners: {
                select: function(combo) {
                    if(combo.getValue()) {
                        this.fireEvent('selectType', combo.getValue());
                    }
                },
                scope:this
            }
        });

        return  [
            typesCombo,
            '-', {
                id: 'document-add-button',
                text: Kebab.helper.translate('Add'),
                iconCls: 'icon-add',
                disabled:true,
                handler: function() {
                    this.fireEvent('addDocument');
                },
                scope: this
            }
        ];
    },

    buildBbar: function() {
        return new Kebab.library.ext.ExtendedPagingToolbar({
            store: this.getStore()
        });
    }
});