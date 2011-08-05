/**
 * Kebab Application Bootstrap Class
 *
 * @category    Kebab (kebab-reloaded)
 * @package     Applications
 * @namespace   KebabOS.applications.documentManager.application.controllers
 * @author      Yunus ÖZCAN <yunus.ozcan@lab2023.com>
 * @copyright   Copyright (c) 2010-2011 lab2023 - internet technologies TURKEY Inc. (http://www.lab2023.com)
 * @license     http://www.kebab-project.com/cms/licensing
 */
KebabOS.applications.documentManager.application.controllers.Index = Ext.extend(Ext.util.Observable, {

    // Application bootstrap
    bootstrap: null,

    propertyData: null,

    constructor: function(config) {

        // Base Config
        Ext.apply(this, config || {});

        // Call Superclass initComponent() method
        KebabOS.applications.documentManager.application.controllers.Index.superclass.constructor.apply(this, arguments);

        this.init();
    },

    // Initialize and define routing settings
    init: function() {

        this.bootstrap.layout.documentsGrid.on('selectType', this.getPropertiesByTypeIdAction, this);
        this.bootstrap.layout.documentsGrid.on('addDocument', this.addDocumentAction, this);

    },

    // Actions -----------------------------------------------------------------

    getPropertiesByTypeIdAction: function(typeId) {
        if (typeId) {
            this.fireEvent('propertiesBeforeLoad');
            Ext.Ajax.request({
                url: Kebab.helper.url('jasius/property'),
                method: 'GET',
                params: {
                    typeId: parseInt(typeId)
                },
                success: function(res){
                    this.fireEvent('propertiesLoaded', res);
                },
                failure: function(){
                    this.fireEvent('propertiesLoadException');
                },
                scope:this
            });
        }
    },

    /**
     * Get selected types by document properties and show document add wizard
     * @return void
     */
    addDocumentAction: function() {
        this._buildAddDocumentWindow();
    },

    submitActiveFormAction: function(activeForm){
        if (activeForm.getForm().isValid()){
            activeForm.getForm().submit({
                method: 'POST',
                url: Kebab.helper.url('jasius/content'),
                waitMsg: 'Saving...',
                success: function() {
                    // KBBTODO save & nextstep
                }
            });
        }
    },


    // Utils --------------------------------------------------------------------

    /**
     * Get property data
     * @return object
     */
    getProperty: function() {
        return this.propertyData;
    },

    /**
     * Set and return the properties
     * @param data object
     * @return
     */
    setPropertyData: function(data) {
        return this.propertyData = data;
    },

    /**
     * Document add wizard window builder
     * @private
     * @return void
     */
    _buildAddDocumentWindow: function() {

        var win = Ext.getCmp(data.type.id + '-add-window');
        
        if (!win) {
            win = new KebabOS.applications.documentManager.application.views.DocumentAddWindow({
                id: data.type.id + '-add-window',
                animateTarget: 'document-add-button',
                title: Kebab.helper.translate('Add new document wizard') + ' : ' + data.type.text,
                iconCls: 'icon-add',
                bootstrap: this,
                propertyData: data,
                width:600,
                height:400,
                maximizable: true,
                manager: this.bootstrap.app.getDesktop().getManager()
            });
            win.show();

            win.on('submitActiveForm', this.submitActiveFormAction, this);

        } else {
            win.show();
        }
    }
});
