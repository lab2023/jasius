/**
 * Document Manager Application Document Add FormPanel
 *
 * @category    Kebab (kebab-reloaded)
 * @package     Applications
 * @namespace   KebabOS.applications.jasius.application.views.DocumentAddWindow
 * @author      Tayfun Öziş ERİKAN <tayfun.ozis.erikan@lab2023.com>
 * @copyright   Copyright (c) 2010-2011 lab2023 - internet technologies TURKEY Inc. (http://www.lab2023.com)
 * @license     http://www.kebab-project.com/cms/licensing
 */

KebabOS.applications.jasius.application.views.PropertyFormPanel = Ext.extend(Ext.FormPanel, {

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

        KebabOS.applications.jasius.application.views.PropertyFormPanel.superclass.initComponent.call(this);
    },

    listeners: {
        activate: function(panel) {
            panel.doLayout();
            this.onLoad();
        }
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
            allowBlank: property.isRequire == 1 ? false : true,
            tabIndex: property.weight
        };

        if (property.defaultValue) {
            Ext.apply(config, {value: property.defaultValue});
        }
        switch (property.dataType) {

            case "integer":
                field = new Ext.form.NumberField(config);
                break;
            case "decimal":
                field = new Ext.form.NumberField(config);
                break;
            case "float":
                field = new Ext.form.NumberField(config);
                break;
            case "boolean":
                field = new Ext.form.Checkbox(config);
                break;
            case "clob":
                field = new Ext.form.TextArea(config);
                break;
            case "date":
                field = new Ext.form.DateField(Ext.apply(config, {
                    format: 'Y-m-d'
                }));
                break;
            case "time":
                field = new Ext.form.TimeField(Ext.apply(config, {
                    format: 'H:i:s'
                }));
                break;
            case "timestamp":
                field = new Ext.ux.form.DateTime(Ext.apply(config, {
                    dateFormat: 'Y-m-d',
                    timeFormat: 'H:i:s'
                }));
                break;
            case "enum":
                field = new Ext.form.ComboBox(Ext.apply(config, {
                    typeAhead: true,
                    triggerAction: 'all',
                    lazyRender:true,
                    mode: 'local',
                    store: Ext.util.JSON.decode(Ext.util.JSON.encode(property.enum)),
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

        var params = {
             name: field.getName(),
             value: field.getValue()
        }

        if  (this.owner.contentId != null) {
            Ext.apply(params, {
                contentId :this.owner.contentId
            })
        }
        
        Ext.Ajax.request({
            url: Kebab.helper.url('jasius/is-unique'),
            method: 'GET',
            params: params,
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
            form.submit({
                method: this.owner.contentId != null ? 'PUT' :'POST',
                url: Kebab.helper.url('jasius/content'),
                params : {
                    contentId : this.owner.contentId != null ? this.owner.contentId : 0
                },
                waitMsg: 'Saving...',
                success: function(form, action) {
                    form.reset();
                    form.owner.contentId = action.result.contentId;
                    form.owner.fireEvent('showNextItem', form.owner);
                }
            });
        }
    },

    onLoad: function() {
        var contentId = this.owner.contentId;
        if (contentId != null) {
            this.getForm().load({
                url : Kebab.helper.url('jasius/content')+'/contentId/'+contentId,
                waitMsg: Kebab.helper.translate('Loading ...'),
                method:'GET',
                success : function (form, action) {
                }
            });
        }
    }
});