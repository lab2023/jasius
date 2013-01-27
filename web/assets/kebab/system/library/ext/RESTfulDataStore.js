/**
 * RESTfulDataStore extend by Ext.data.Store
 *
 * @category    Kebab
 * @package     Kebab
 * @namespace   Kebab.library
 * @author      Tayfun Öziş ERİKAN <tayfun.ozis.erikan@lab2023.com>
 * @copyright   Copyright (c) 2010-2011 lab2023 - internet technologies TURKEY Inc. (http://www.lab2023.com)
 * @license     http://www.kebab-project.com/cms/licensing
 */
Ext.namespace('Kebab.library.ext');
Kebab.library.ext.RESTfulDataStore = Ext.extend(Ext.data.Store, {

    // RESTful enable
    restful: true,

    // Auto-load enable
    autoLoad: false,

    // Auto-destroy enable
    autoDestroy: true,

    // Remote sort enable
    remoteSort: true,

    // Auto-save default disable
    autoSave: false,

    // Batch editing default enable
    batch: false,

    // System REST API
    restAPI: 'api/url',

    // Json Reader Config
    readerConfig: {
        idProperty: 'id',
        root: 'data',
        totalProperty: 'total',
        messageProperty: 'notifications'
    },

    // JSON Reader fields
    readerFields: [
        {name: 'id', type: 'int'},
        {name: 'title', type: 'string', allowBlank: false},
        {name: 'description', type: 'string'}
    ],

    // Store Constructor
    constructor : function() {

        // HTTP Proxy
        this.proxy = new Ext.data.HttpProxy({
            url : Kebab.helper.url(this.restAPI)
        });

        // JSON Reader
        this.reader = new Ext.data.JsonReader(
            this.readerConfig,
            this.buildReaderFields()
        );

        // JSON Writer
        this.writer = new Ext.data.JsonWriter({
            encode: true,
            writeAllFields: false
        });

        // Base Config
        var config = {
            proxy: this.proxy,
            reader: this.reader,
            writer: this.writer
        };

        // Merge initialConfig and base config
        Ext.apply(this, config);

        // Call Superclass initComponent() method
        Kebab.library.ext.RESTfulDataStore.superclass.constructor.apply(this, arguments);
    },

    buildReaderFields: function() {
        return this.readerFields;
    },

    listeners : {
        write : function(){
            Kebab.helper.message(
                Kebab.helper.translate('Success'),
                Kebab.helper.translate('Operation was performed successfully')
            );
        },
        exception : function(){
            Kebab.helper.message(
                Kebab.helper.translate('Error'),
                Kebab.helper.translate('Operation was not performed'),
                true
            );
        }
    }
});