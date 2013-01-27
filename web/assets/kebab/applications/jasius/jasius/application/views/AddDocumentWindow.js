/**
 * Document Manager Application Document Add Window
 *
 * @category    Kebab (kebab-reloaded)
 * @package     Applications
 * @namespace   KebabOS.applications.jasius.application.views.DocumentAddWindow
 * @author      Tayfun Öziş ERİKAN <tayfun.ozis.erikan@lab2023.com>
 * @copyright   Copyright (c) 2010-2011 lab2023 - internet technologies TURKEY Inc. (http://www.lab2023.com)
 * @license     http://www.kebab-project.com/cms/licensing
 */

KebabOS.applications.jasius.application.views.DocumentAddWindow = Ext.extend(Ext.Window, {

    bootstrap: null,

    propertyData: null,

    formPanel: null,

    accessPanel: null,

    initComponent: function() {

        var config = {
            border: false,
            layout: 'card',
            activeItem: 0
        };

        Ext.apply(this, config);

        this.items = this.buildItems();
        this.fbar = this.buildFbar();

        KebabOS.applications.jasius.application.views.DocumentAddWindow.superclass.initComponent.call(this);
    },

    buildItems: function() {

        this.formPanel = new KebabOS.applications.jasius.application.views.PropertyFormPanel({
            itemNumber: 0,
            title: Kebab.helper.translate('Document Properties'),
            frame: true,
            owner: this,
            listeners:{
                activate: function(){
                    this.owner.buttonControl();
                }
            }
        });

        this.accessPanel = new KebabOS.applications.jasius.application.views.AccessPanel({
            title: Kebab.helper.translate('Document Accessing Settings'),
            itemNumber: 1,
            frame: true,
            owner: this,
            listeners:{
                activate: function(){
                    this.owner.buttonControl();
                }
            }
        });

        this.filePanel = new KebabOS.applications.jasius.application.views.FilePanel({
            title: Kebab.helper.translate('Document Files'),
            itemNumber: 1,
            frame: true,
            owner: this,
            listeners:{
                activate: function(){
                    this.owner.buttonControl();
                }
            }
        });

        return [
            this.formPanel,
            this.accessPanel,
            this.filePanel
        ];
    },
    buttonControl: function () {
        var index = this.items.indexOf(this.getLayout().activeItem);
        var count = this.items.length;
        var btnNext = Ext.getCmp(this.id + '-next');
        var btnPrev = Ext.getCmp(this.id + '-prev');
        var btnSave = Ext.getCmp(this.id + '-save');

        if (index < count - 1) {
            if (index == 0){
                this.contentId != null ? btnNext.enable() : btnNext.disable();
            } else {
                btnNext.enable();
            }
            btnSave.setText(Kebab.helper.translate('Save &raquo;'));
            btnSave.setTooltip(Kebab.helper.translate('Save current informations and go to next screen'));
        } else {
            btnSave.setText(Kebab.helper.translate('Finish'));
            btnSave.setTooltip(Kebab.helper.translate('Finish document wizard'));
            btnNext.disable()
        }

        index > 0 ?  btnPrev.enable() : btnPrev.disable();
    },
    buildFbar: function() {

        return ['->', {
            id: this.id + '-prev',
            disabled: true,
            tooltip: Kebab.helper.translate('Returns to the previous screen'),
            text: Kebab.helper.translate('&laquo; Previous'),
            handler : function (){
                this.fireEvent('showPrevItem', this);
            },
            scope:this
        },{
            id: this.id + '-next',
            disabled: true,
            tooltip: Kebab.helper.translate('Returns to the next screen'),
            text: Kebab.helper.translate('Next &raquo;'),
            handler : function (){
                this.fireEvent('showNextItem', this);
            },
            scope:this
        },{
            id: this.id + '-save',
            iconCls: 'icon-disk',
            tooltip: Kebab.helper.translate('Save current informations and go to next screen'),
            text: Kebab.helper.translate('Save &raquo;'),
            handler: function() {
                this.fireEvent('submitActiveForm', this);
            },
            scope:this
        }];
    }
});