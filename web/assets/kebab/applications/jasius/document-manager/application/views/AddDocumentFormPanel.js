/**
 * Document Manager Application Document Add FormPanel
 *
 * @category    Kebab (kebab-reloaded)
 * @package     Applications
 * @namespace   KebabOS.applications.documentManager.application.views.DocumentAddWindow
 * @author      Tayfun Öziş ERİKAN <tayfun.ozis.erikan@lab2023.com>
 * @copyright   Copyright (c) 2010-2011 lab2023 - internet technologies TURKEY Inc. (http://www.lab2023.com)
 * @license     http://www.kebab-project.com/cms/licensing
 */

KebabOS.applications.documentManager.application.views.DocumentAddFormPanel = Ext.extend(Ext.FormPanel, {

    owner: null,

    initComponent: function() {

        var config = {
            padding:5,
            autoScroll: true,
            defaultType: 'textfield',
            defaults: {
                anchor: '100%'
            }
        };

        Ext.apply(this, config);

        this.items = this.buildItems();

        KebabOS.applications.documentManager.application.views.DocumentAddFormPanel.superclass.initComponent.call(this);
    },

    buildItems: function() {

        var propertyData = this.owner.propertyData.data,
            items = [],
            i = 0;

        Ext.each(propertyData, function(property) {
            items[i++] = this._getFormItem(property);
        }, this);

        return [items];
    },

    _getFormItem: function(property) {

        var field = null;

        var config = {
            name: property.name,
            fieldLabel: property.title,
            allowBlank: property.isRequired ? true : false,
            tabIndex: property.weight
        };

        if (property.defaultValue) {
            Ext.apply(config, {value: property.defaultValue});
        }

        switch (property.dataType) {

            case "integer" || "decimal" || "float":
                field = new Ext.form.NumberField(config);
                break;
            case "boolean":
                field = new Ext.form.Checkbox(config);
                break;
            case "clob":
                field = new Ext.form.TextArea(config);
                break;
            case "date":
                field = new Ext.form.DateField(config);
                break;
            case "time":
                field = new Ext.form.TimeField(config);
                break;
            case "timestamp":
                field = new Ext.ux.form.DateTime(Ext.apply(config, {
                    dateFormat: 'd-m-Y',
                    timeFormat: 'H:i:s'
                }));
                break;
            case "enum":
                field = new Ext.form.ComboBox(Ext.apply(config, {
                    typeAhead: true,
                    triggerAction: 'all',
                    lazyRender:true,
                    mode: 'local',
                    store: new Ext.data.ArrayStore({
                        fields: ['value'],
                        data: [property.enum]
                    }),
                    valueField: 'value',
                    displayField: 'value',
                    hiddenName: property.name
                }));
                break;
            default:
                field = new Ext.form.TextField(config);
                break;
        }



        if (parseInt(property.isUnique) == 1) {
            field.on('blur', this.onCheckIsUnique, this);
        }

        return field;
    },

    onCheckIsUnique: function(field) {

        field.disable();
        
        Ext.Ajax.request({
            url: Kebab.helper.url('jasius/is-unique'),
            method: 'GET',
            params: {
                name: field.getName(),
                value: field.getValue()
            },
            success: function(res){
                field.enable();
                var response = Ext.util.JSON.decode(res.responseText);
                if (!response.success) {
                    field.markInvalid(response.msg);
                }
            },
            scope:this
        });
    },

    onSubmit: function() {
        var form = this.getForm();
        
        if (form.isValid()) {
            return form.submit({
                method: 'POST',
                url: Kebab.helper.url('jasius/content'),
                waitMsg: 'Saving...',
                success: function() {
                    return true;
                },
                failure: function() {
                    return false;
                }
            });
        }
    }

});