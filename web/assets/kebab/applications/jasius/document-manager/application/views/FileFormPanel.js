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

KebabOS.applications.documentManager.application.views.FileFormPanel = Ext.extend(Ext.FormPanel, {

    owner: null,

    initComponent: function() {
        /*this.frame = true;
        this.title = 'File Upload Form',

        this.defaults = {
            anchor: '100%',
            allowBlank: false,
            msgTarget: 'side'
        },

        this.items = [{
            xtype: 'fileuploadfield',
            id: 'form-file',
            emptyText: 'Select a file',
            fieldLabel: 'File',
            name: 'photo-path'
        }];

        this.buttons = [{
            text: 'Upload',
            iconCls: 'icon-add',
            handler: function(){
                var form = this.getForm();
                if(form.isValid()){
                    form.submit({
                        url: 'file-upload.php',
                        waitMsg: 'Uploading your photo...',
                        success: function(fp, o) {
                            alert('Success', 'Processed file "' + o.result.file + '" on the server');
                        }
                    });
                }
            }
        },{
            text: 'Reset',
            handler: function() {
                this.getForm().reset();
            }
        }]*/
        this.fileUpload = true,
       // Other properties omitted
       this.items = {
          allowBlank :false,
          id :'file',
          inputType :'file',
          name :'myFile',
          fieldLabel :'File',
          blankText :'Please choose a file',
          anchor :'95%',
          required :true,
          autoShow :true,
          xtype :'textfield'
       };
       this.buttonAlign = 'right',
       this.buttons = [ {
          text :'Upload',
          iconCls:'icon-add',
          handler : function() {
              console.log(this.owner);
             if (this.getForm().isValid()) {
                this.getForm().submit( {
                   method : 'POST',
                   url :Kebab.helper.url('jasius/file'),
                   params: {
                       contentId : this.owner.owner.contentId
                   },
                   waitMsg :'Uploading your file...',
                   success : function(form, action) {
                      Ext.Msg.alert('Success', 'File processed successfuly!');
                   }
                });
             }
          },
          scope: this
       } ]

        KebabOS.applications.documentManager.application.views.FileFormPanel.superclass.initComponent.call(this);
    },

    listeners: {
        activate: function(panel) { // HBox layout bug fix
            panel.doLayout();
            this.onLoad();
        }
    },
    onLoad: function() {
        var contentId = this.owner.contentId;
        /*if (contentId != null) {
            this.accessFrom.getForm().load({
                url : Kebab.helper.url('jasius/file'),
                waitMsg: 'Loading...',
                params: {
                    contentId : contentId
                },
                method:'GET',
                success : function (form, action) {
                    
                },
                scope:this
            });
        }*/
    }
});