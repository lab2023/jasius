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

    constructor: function(config) {

        // Base Config
        Ext.apply(this, config || {});

        // Call Superclass initComponent() method
        KebabOS.applications.documentManager.application.controllers.Index.superclass.constructor.apply(this, arguments);

        this.init();
    },

    // Initialize and define routing settings
    init: function() {

        this.bootstrap.layout.documentsGrid.on('addDocument', this.addDocumentAction, this);

    },

    // Actions -----------------------------------------------------------------

    /**
     * Get selected types by document properties and show document add wizard
     * @param typeId object
     * @return void
     */
    addDocumentAction: function(typeId) {
        
        if (typeId) {
            Ext.Ajax.request({
                url: Kebab.helper.url('jasius/property'),
                method: 'GET',
                params: {
                    id: parseInt(typeId)
                },
                success: function(res){
                    var data = Ext.util.JSON.decode(res.responseText);
                    this._buildAddDocumentWindow(data);
                },
                failure: function(){
                    Kebab.helper.message('Hata', 'İstek başarısız');
                },
                scope:this
            });
        }
    },

    submitActiveFormAction: function(activeForm){
        if (activeForm.getForm().isValid()){
            activeForm.getForm().submit({
                method: 'POST',
                url: 'jasius/content',
                waitMsg: 'Kaydediliyor...',
                success: function() {
                    this.fireEvent('nextStep');
                }
            });
        }
    },


    // Utils --------------------------------------------------------------------

    /**
     * Document add wizard window builder
     * @private
     * @param data
     * @return void
     */
    _buildAddDocumentWindow: function(data) {

        var win = Ext.getCmp(data.type.id + '-add-window');
        
        if (!win) {
            win = new KebabOS.applications.documentManager.application.views.DocumentAddWindow({
                id: data.type.id + '-add-window',
                animateTarget: 'document-add-button',
                title: 'Yeni "' + data.type.text + '" Ekleme Sihirbazı',
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
