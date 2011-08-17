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
                forceFit: false
            }
        };
        
        Ext.apply(this, config);

        this.columns = this.buildColumns();
        this.tbar = this.buildTbar();
        this.bbar = this.buildBbar();

        KebabOS.applications.documentManager.application.views.DocumentsGridPanel.superclass.initComponent.call(this);
    },
    rowDoubleClick : function(grid, rowIndex, obj) {
        var rec = grid.getStore().getAt(rowIndex);
        grid.fireEvent('updateDocument',rec.data.id);
    },
    setColumnModel : function (propertyDt) {
        var propertyData = propertyDt.data;
        Ext.each(propertyData, function(property) {
            if(this.colModel.findColumnIndex(property.name) < 0) {
                var field = this.getStoreField(property);
                var column = this.getGridColumn(property);
                this.addColumn(field, column);
            }
        }, this);
        
        delete this.store.reader.ef;
        this.store.reader.buildExtractors();
        return true;
    },

    getGridFilter : function (property) {
        var filter = {
            dataIndex: property.name
        };

        switch (property.dataType) {
            case "decimal":
                Ext.apply(filter, {type : 'numeric'});
                break;
            case "float":
                Ext.apply(filter, {type : 'numeric'});
                break;
            case "integer" :
                Ext.apply(filter, {type : 'numeric'});
            case "boolean":
                Ext.apply(filter, {type : 'numeric'});
                break;
            case "date":
                Ext.apply(filter, {
                    type : 'date'
                });
                break;
            case "time":
                Ext.apply(filter, {
                    type : 'date'
                });
                break;
            case  "timestamp":
                Ext.apply(filter, {
                    type : 'date'
                });
                break;
            default:
                Ext.apply(filter, {type : 'string'});
                break;
        }

        return filter;
    },
    getGridColumn : function(property) {
        var column = {
            header : property.title,
            dataIndex : property.name,
            width :150,
            sortable:true,
            filterable: true
        };
        switch (property.dataType) {
            case "date":
                Ext.apply(column, {
                    xtype : 'datecolumn',
                    format :'d-m-Y'
                });
                break;
            case "time":
                Ext.apply(column, {
                    xtype : 'datecolumn',
                    format :'H:i:s'
                });
                break;
            case  "timestamp":
                Ext.apply(column, {
                    xtype : 'datecolumn',
                    format :'d-m-Y H:i:s'
                });
                break;
            default:
                break;
        }
        return column;
    },
    getStoreField : function(property) {
        var field = {
            name : property.name
        };
        switch (property.dataType) {
            case "decimal":
                Ext.apply(field, {type : 'double'});
                break;
            case "float":
                Ext.apply(field, {type : 'double'});
                break;
            case "integer" :
                Ext.apply(field, {type : 'integer'});
            case "boolean":
                Ext.apply(field, {type : 'boolean'});
                break;
            case "date":
                Ext.apply(field, {
                    type : 'date'
                });
                break;
            case "time":
                Ext.apply(field, {
                    type : 'date'
                });
                break;
            case  "timestamp":
                Ext.apply(field, {
                    type : 'date'
                });
                break;
            default:
                Ext.apply(field, {type : 'string'});
                break;
        }
        return field;
    },

    /**
     * Build grid columns
     */
    buildColumns: function() {
        return [{
                xtype: 'actioncolumn',
                width: 50,
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
        },{
            header   : 'ID',
            dataIndex: 'id',
            width:30,
            sortable:true,
            filterable:true
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

        var serachField = new Ext.ux.form.SearchField({
            id: 'document-search-button',
            store: this.getStore(),
            emptyText: Kebab.helper.translate('Please type keyword here...'),
            width:180,
            disabled : true
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
            },
            '->',
            serachField
        ];
    },

    buildBbar: function() {
        var paging = new Kebab.library.ext.ExtendedPagingToolbar({
            store: this.getStore()

        });
        paging.refresh.hide();
        return paging;
    }
});