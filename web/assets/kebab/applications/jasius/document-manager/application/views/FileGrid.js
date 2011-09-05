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

KebabOS.applications.documentManager.application.views.FileGrid = Ext.extend(Ext.grid.GridPanel, {

    // Application bootstrap
    owner: null,

    initComponent: function() {

        // json data store
        var store = new KebabOS.applications.documentManager.application.models.FilesDataStore();

        var config = {
            stripeRows: true,
            trackMouseOver:true,
            clicksToEdit: true,
            viewConfig: {
                emptyText: Kebab.helper.translate('Record not found...'),
                forceFit: true
            },
            store: store,
            cm: new Ext.grid.ColumnModel({
                defaults: {
                    sortable: true
                },
                columns: [
                    {header: Kebab.helper.translate('Name'), width:100, dataIndex: 'name'},
                    {header: Kebab.helper.translate('Mime'),  dataIndex: 'mime'},
                    {header: Kebab.helper.translate('Size'),  dataIndex: 'size'}
                ]
            }),
            columnLines: true

        };

        Ext.apply(this, config);

        KebabOS.applications.documentManager.application.views.FileGrid.superclass.initComponent.apply(this, arguments);
    },

    buildTbar: function() {
        return  [{
                xtype: 'fileuploadfield',
                emptyText: 'Dosya seçiniz...',
                fieldLabel: 'File',
                name: 'ufile',
                id: 'form-file-1',
                button_text:'Gözat',
                button_disabled:false,
                buttonAlign:'right'
            },'->',{
                id: 'file-upload-button',
                text: Kebab.helper.translate('Upload'),
                iconCls: 'icon-add',
                scope: this
            }
        ];
    }
});
