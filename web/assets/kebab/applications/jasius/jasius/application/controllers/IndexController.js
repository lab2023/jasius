/**
 * Kebab Application Bootstrap Class
 *
 * @category    Kebab (kebab-reloaded)
 * @package     Applications
 * @namespace   KebabOS.applications.jasius.application.controllers
 * @author      Yunus ÖZCAN <yunus.ozcan@lab2023.com>
 * @copyright   Copyright (c) 2010-2011 lab2023 - internet technologies TURKEY Inc. (http://www.lab2023.com)
 * @license     http://www.kebab-project.com/cms/licensing
 */
KebabOS.applications.jasius.application.controllers.Index = Ext.extend(Ext.util.Observable, {

    // Application bootstrap
    bootstrap: null,

    propertyData: null,

    constructor: function(config) {

        // Base Config
        Ext.apply(this, config || {});

        // Call Superclass initComponent() method
        KebabOS.applications.jasius.application.controllers.Index.superclass.constructor.apply(this, arguments);

        this.init();
    },

    // Initialize and define routing settings
    init: function() {

        var documentsGrid = this.bootstrap.layout.documentsGrid;

        documentsGrid.on('selectType', this.getPropertiesByTypeIdAction, this);
        documentsGrid.on('addDocument', this.addDocumentAction, this);
        documentsGrid.on('updateDocument', this.updateDocumentAction, this);
        documentsGrid.on('rowDblClick',this.bootstrap.layout.documentsGrid.rowDoubleClick, this);
        documentsGrid.on('viewFileOfDocument',this.viewFileOfDocument, this);

        this.on('propertiesBeforeLoad', function() {
            var button = Ext.getCmp('document-add-button');
            var buttonSearch = Ext.getCmp('document-search-button');
            buttonSearch.disable();
            button.setIconClass('icon-loading');
            button.disable();
        });
        this.on('propertiesLoaded', function(typeId) {
            var button = Ext.getCmp('document-add-button');
            var buttonSearch = Ext.getCmp('document-search-button');
            buttonSearch.enable();
            var grid = this.bootstrap.layout.documentsGrid;
            grid.getBottomToolbar().refresh.show();
            button.setIconClass('icon-add');
            button.enable();
            if (grid.initializeColumnModel()) {
                if (grid.setColumnModel(this.getPropertyData())) {
                    grid.getStore().load({params: {start:0, limit:this.bootstrap.app.getSettings().project.pageSizeDefault}});
                    grid.reconfigure(grid.getStore(), grid.getColumnModel());
                    
                }
            }
        });
        this.on('propertiesLoadException', function() {
            var button = Ext.getCmp('document-add-button');
            var buttonSearch = Ext.getCmp('document-search-button');
            buttonSearch.enable();
            button.setIconClass('icon-add');
            button.enable();
        });

    },

    // Actions -----------------------------------------------------------------

    getPropertiesByTypeIdAction: function(typeId) {

        if (typeId) {

            var store = this.bootstrap.layout.documentsGrid.getStore();
            store.setBaseParam('typeId', typeId);
            this.fireEvent('propertiesBeforeLoad');
            Ext.Ajax.request({
                url: Kebab.helper.url('jasius/property'),
                method: 'GET',
                params: {
                    typeId: parseInt(typeId)
                },
                success: function(res){
                    this.setPropertyData(res.responseText);
                    this.fireEvent('propertiesLoaded');
                },
                failure: function(){
                    this.fireEvent('propertiesLoadException');
                },
                scope:this
            });
        }
    },
    viewFileOfDocument : function(contentId) {
        this._buildDocumentWindow(contentId);
        var win = Ext.getCmp(contentId + '-add-window');
        win.getLayout().setActiveItem(2);
    },
    updateDocumentAction : function(contentId) {
        this._buildDocumentWindow(contentId);
    },

    /**
     * Get selected types by document properties and show document add wizard
     * @return void
     */
    addDocumentAction: function() {
        this._buildDocumentWindow(null);
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
    
    wizardPrev : function (window) {
        var activeItem = window.getLayout().activeItem;
        if (window.items.indexOf(activeItem)> 0){
            window.getLayout().setActiveItem(window.items.indexOf(activeItem)- 1);
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
    _buildDocumentWindow: function(id) {

        var data = this.getPropertyData();
        
        if (data) {
            var win = Ext.getCmp(id + '-add-window');
            if (!win) {
                var desktop = this.bootstrap.app.getDesktop();
                win = desktop.createApplication({
                    id: id + '-add-window',
                    animateTarget: 'document-add-button',
                    contentId : id,
                    width:desktop.getWinWidth() * 0.6,
                    height:desktop.getWinHeight() * 0.8,
                    title: '#' + id + ' : ' + Kebab.helper.translate('Document wizard') + ' : ' + data.type.text,
                    description: Kebab.helper.translate('Document wizard &amp; document detail window'),
                    iconCls: 'jasius-application-gui-icon',
                    bootstrap: this.bootstrap,
                    propertyData: this.getPropertyData(),
                    maximizable: true
                }, KebabOS.applications.jasius.application.views.DocumentAddWindow);
                win.show();
            } else {
                win.show();
            }

            win.on('submitActiveForm', this.submitActiveFormAction, this);
            win.on('showNextItem', this.wizardNext, this);
            win.on('showPrevItem', this.wizardPrev, this);
            win.on('buttoncontrol', this.buttonControl, this);
        }
    }
});
