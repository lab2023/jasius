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
    bootstrap: null,

    initComponent: function() {

        // json data store
        this.comboStore = new KebabOS.applications.documentManager.application.models.UserDataStore({
            bootstrap:this.bootstrap
        });
        this.store = new Ext.data.ArrayStore({
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
            emptyText:'Ad soyad veya e-posta adresi yazınız.',
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
            width:300
        });

        this.tbar = [
        userCombobox,{
                text:'Ekle',
                iconCls:'icon-accept',
                handler:function(){

                    var finded = this.store.find('id', userCombobox.value);
                    if(finded == -1){
                        var record = new this.store.recordType({
                            id: userCombobox.value,
                            fullName: userCombobox.lastSelectionText
                        });
                        this.store.insert(0, record);
                    }
                },
                scope:this
            },{
                text:'Çıkar',
                iconCls:'icon-cancel',
                handler:function() {
                    var sm = this.getSelectionModel();

                    if (!sm.getCount()) {
                        return false;
                    } else {
                        sm.each(function(selection) {
                            this.store.remove(selection);
                        }, this);
                    }
                },
                scope:this
            }
        ];
        this.columns = [
            {
                header   : 'ID',
                width:12,
                dataIndex: 'id',
                sortable:true
            },
                {
                header   : 'Tam Adı',
                width:100,
                dataIndex: 'fullName',
                sortable:true
            }
        ];

        Ext.apply(this, config);

        KebabOS.applications.documentManager.application.views.UserGrid.superclass.initComponent.apply(this, arguments);
    }
});
