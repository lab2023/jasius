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

    /**
     * Build grid columns
     */
    buildColumns: function() {
        return [{
            header   : Kebab.helper.translate('ID'),
            dataIndex: 'id',
            sortable:true
        },{
            header   : Kebab.helper.translate('Title'),
            dataIndex: 'title',
            sortable:true
        }];
    },

    buildTbar: function() {

        var typesCombo = new Kebab.library.ext.AutocompleteComboBox({
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
                    var addButton = Ext.getCmp('document-add-button');
                    if(combo.getValue()) {
                        addButton.enable();
                    } else {
                        addButton.disable();
                    }
                }
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
                    this.fireEvent('addDocument', typesCombo.getValue());
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