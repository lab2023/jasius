/**
 * Document Manager Application Document Add FormPanel
 *
 * @category    Kebab (kebab-reloaded)
 * @package     Applications
 * @namespace   KebabOS.applications.jasius.application.views.AccessForm
 * @author      Tayfun Öziş ERİKAN <tayfun.ozis.erikan@lab2023.com>
 * @copyright   Copyright (c) 2010-2011 lab2023 - internet technologies TURKEY Inc. (http://www.lab2023.com)
 * @license     http://www.kebab-project.com/cms/licensing
 */

KebabOS.applications.jasius.application.views.AccessFormPanel = Ext.extend(Ext.FormPanel, {

    owner: this,
    
    url: null,
    
    border:false,

    initComponent: function() {

        var config = {
            url: Kebab.helper.url('jasius/access'),
            labelAlign: 'top',
            hideLabels:false,
            labelSeparator: '',
            items: this.buildItems()
        };

        Ext.apply(this, Ext.apply(this.initialConfig, config));

        KebabOS.applications.jasius.application.views.AccessFormPanel.superclass.initComponent.apply(this, arguments);
    },

    buildItems : function (){
        this.roleGrid = new KebabOS.applications.jasius.application.views.RoleGrid({
            owner: this,
            layout: 'fit',
            flex:1,
            frame:true,
            title:'Rol seç'
        });

        this.userGrid = new KebabOS.applications.jasius.application.views.UserGrid({
            owner: this,
            flex:2,
            frame:true,
            layout: 'fit',
            title:'Kullanıcı seç'
        });
        this.rolesAndUsersPanels = new Ext.Panel({
            flex:1,
            disabled: true,
            layout: {
                type: 'hbox',
                align : 'stretch',
                pack  : 'start'
            },
            border:false,
            items:[
                this.roleGrid,
                {width:5, border:false},
                this.userGrid
            ]
        });

        return [{
            xtype: 'radiogroup',
            fieldLabel: Kebab.helper.translate('Who can access this document?'),
            items: [
                {boxLabel: Kebab.helper.translate('Everybody'), name: 'accessType', inputValue: 'all', checked: true},
                {boxLabel: Kebab.helper.translate('Users'), name: 'accessType', inputValue: 'user'},
                {boxLabel: Kebab.helper.translate('Special'), name: 'accessType', inputValue: 'specific',
                    listeners: {
                        check: function(field, checked) {
                            this.fireEvent('allowAll', !checked);
                        }, scope:this
                    }
                }
                ]
            }
        ]
    }
});