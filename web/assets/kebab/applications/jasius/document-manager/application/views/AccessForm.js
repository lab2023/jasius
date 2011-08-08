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

KebabOS.applications.documentManager.application.views.AccessForm = Ext.extend(Ext.FormPanel, {

    url: null,
    border:false,

    initComponent: function() {

        var config = {
            url: Kebab.helper.url('jasius/access'),
            labelAlign: 'top',
            hideLabels:true,
            items:[
                {
                    xtype: 'radiogroup',
                    items: [
                        {boxLabel: 'Herkes', name: 'allow', inputValue: 'all', checked: true},
                        {boxLabel: 'Üyeler', name: 'allow', inputValue: 'user'},
                        {boxLabel: 'Özel', name: 'allow', inputValue: 'specific',
                            listeners: {
                                check: function(field, checked) {
                                        this.fireEvent('allowAll', !checked);
                                }, scope:this
                            }
                        }
                    ]
                }
            ],
            buttons:[
                {
                    text:'Yayınla',
                    iconCls:'icon-accept',
                    handler: function() {
                        var userIds = [], roleIds = [];
                        var i = 0;
                        Ext.each(this.bootstrap.layout.roleGrid.getSelectionModel().getSelections(), function(data) {
                            roleIds[i++] = data.id;
                        });
                        var i = 0;
                        Ext.each(this.bootstrap.layout.userGrid.store.data.items, function(data) {
                            userIds[i++] = data.data.id;
                        });
                        Ext.each(this.getForm().items.items, function(data) {
                            if(data.xtype =='radiogroup'){
                                Ext.each(data.items.items, function(items) {
                                    if(items.checked){;
                                        accessTpye = items.inputValue;
                                    }
                                });
                            }
                        });
                        var accessType = accessTpye
                        if(this.getForm().isValid()){
                            Ext.Ajax.request({
                                url: this.url,
                                method: 'POST',
                                params: {
                                    accessType:Ext.util.JSON.encode(accessType),
                                    roleId:Ext.util.JSON.encode(roleIds),
                                    userId:Ext.util.JSON.encode(userIds)
                                },
                                success : function() {
                                     Kebab.helper.message(this.bootstrap.launcher.text, 'İşlem Başarılı');
                                },

                                failure : function() {
                                    Kebab.helper.message(this.bootstrap.launcher.text, 'İşlem Başarısız');
                                }, scope:this
                            });
                        }
                    },
                    scope:this
                }
            ]
        };

        Ext.apply(this, Ext.apply(this.initialConfig, config));

        KebabOS.applications.documentManager.application.views.AccessForm.superclass.initComponent.apply(this, arguments);
    }
});