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
                    this.setPropertyData(res.responseText);
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

    submitActiveFormAction: function(window){
        window.getLayout().activeItem.onSubmit();
    },

    wizardNext : function (window) {
        var activeItem = window.getLayout().activeItem;
        if (window.items.indexOf(activeItem) < window.items.length){
            window.getLayout().setActiveItem(window.items.indexOf(activeItem) + 1);
        }
    },
    
    wizardPrev : function () {
        if (window.getLayout().activeItem > 0){
            window.getLayout().setActiveItem(window.getLayout().activeItem - 1);
        }
    },
    // Utils --------------------------------------------------------------------

    /**
     * Get property data
     * @return object
     */
    getPropertyData: function() {
        return this.propertyData;
    },

    /**
     * Set and return the properties
     * @param data object
     * @return
     */
    setPropertyData: function(data) {
        this.propertyData = Ext.util.JSON.decode(data);
    },

    /**
     * Document add wizard window builder
     * @private
     * @return void
     */
    _buildAddDocumentWindow: function() {

        var data = this.getPropertyData();

        if (data) {
            var win = Ext.getCmp(data.type.id + '-add-window');

            if (!win) {
                win = new KebabOS.applications.documentManager.application.views.DocumentAddWindow({
                    id: data.type.id + '-add-window',
                    animateTarget: 'document-add-button',
                    title: Kebab.helper.translate('Add new document wizard') + ' : ' + data.type.text,
                    iconCls: 'icon-add',
                    bootstrap: this.bootstrap,
                    propertyData: this.getPropertyData(),
                    width:400,
                    height:200,
                    maximizable: true,
                    manager: this.bootstrap.app.getDesktop().getManager()
                });
                win.show();

                win.on('submitActiveForm', this.submitActiveFormAction, this);
                win.on('showNextItem', this.wizardNext, this);

            } else {
                win.show();
            }
        }
    }
});
