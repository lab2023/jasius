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

    bootstrap: null,

    propertyData: null,

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

        var items = [], i = 2;

        items[0] = {
            hidden:true,
            name: 'type_id',
            value: this.propertyData.type.id
        };
        items[1] = new Ext.form.TextField({
            fieldLabel: Kebab.helper.translate('Document Title'),
            name: 'title',
            allowBlank:false
        });

        Ext.each(this.propertyData.data, function(property) {
            items[i++] = this._getFormItem(property);
        }, this);

        return [items];
    },

    _getFormItem: function(property) {

        var field = null;

        var config = {
            name: 'item_' + property.id,
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
                    hiddenName: 'item_' + property.id
                }));
                break;
            default:
                field = new Ext.form.TextField(config);
                break;
        }

        return field;
    }
});