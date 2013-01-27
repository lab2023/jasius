/* -----------------------------------------------------------------------------
 Kebab Project 1.5.x (Kebab Reloaded)
 http://kebab-project.com
 Copyright (c) 2010-2011 lab2023 - internet technologies TURKEY Inc.
 http://www.lab2023.com

    * LICENSE
    *
    * This source file is subject to the  Dual Licensing Model that is bundled
    * with this package in the file LICENSE.txt.
    * It is also available through the world-wide-web at this URL:
    * http://www.kebab-project.com/cms/licensing
    * If you did not receive a copy of the license and are unable to
    * obtain it through the world-wide-web, please send an email
    * to info@lab2023.com so we can send you a copy immediately.
----------------------------------------------------------------------------- */

/**
 * Sign up Singleton Object
 */
SignIn = function(){

    var signInAPI = null,
        forgotPasswordAPI = null,
        signInForm = null,
        forgotPasswordForm = null;

    return {

        init: function(){

            // API Setup
            signInAPI = Kebab.helper.url('kebab/session');
            forgotPasswordAPI = Kebab.helper.url('kebab/forgot-password');

            // Call builders
            this.buildSignInForm();
            this.buildForgotPasswordForm();
        },

        // BUILDERS ----------------------------------------------------------------------------------------------------

        /**
         * Login form builder
         */
        buildSignInForm: function() {
            signInForm = new Ext.FormPanel({
                renderTo: 'signIn-form',
                bodyCssClass: 'kebab-transparent',
                url: signInAPI,
                frame:false,
                labelAlign:'top',
                width: '100%',
                buttonAlign:'left',
                border:false,
                defaultType: 'textfield',
                hideLabels: true,
                items: [{
                    fieldLabel: Kebab.helper.translate('Your user name'),
                    emptyText: Kebab.helper.translate('Your user name'),
                    name: 'userName',
                    width: 180,
                    allowBlank:false
                },{
                    fielLabel: Kebab.helper.translate('Your password'),
                    emptyText: Kebab.helper.translate('Your password'),
                    name: 'password',
                    width: 140,
                    inputType: 'password',
                    allowBlank:false
                }, {
                    xtype: 'checkboxgroup',
                    items: [{boxLabel: Kebab.helper.translate('Keep signed in'), name: 'rememberMe', checked: false}]
                }],
                buttons: [{
                    width:80,
                    iconCls: 'icon-accept',
                    text: Kebab.helper.translate('Send'),
                    handler: function() {
                        this.signInAction();
                    },
                    scope:this
                },{
                    xtype:'panel',
                    border:false,
                    bodyCssClass: 'kebab-transparent',
                    html: '<a href="#" id="singUp-link">' + Kebab.helper.translate('Sign-up') + '</a>' +
                            Kebab.helper.translate(' or ') + '<a href="#" id="forgotPassword-link">' +
                            Kebab.helper.translate('Forgot password') + '</a>'
                }],
                keys:[{
                    key: [Ext.EventObject.ENTER], handler: function() {
                        this.signInAction();
                    }, scope:this
                }],
                listeners: {
                    afterRender: function(){
                        // Add events
                        Ext.fly('singUp-link').on('click', function(e) {
                            e.stopEvent();
                            Kebab.helper.redirect('backend/sign-up');
                        }, this);

                        Ext.fly('forgotPassword-link').on('click', function(e) {
                            e.stopEvent();
                            this.showForgotPasswordForm();
                        }, this);
                    },
                    scope:this
                }
            });
        },

        /**
         * Forgot password form builder
         */
        buildForgotPasswordForm: function() {
            forgotPasswordForm = new Ext.FormPanel({
                renderTo: 'forgotPassword-form',
                bodyCssClass: 'kebab-transparent',
                url: forgotPasswordAPI,
                method: 'POST',
                frame:false,
                labelAlign:'top',
                width: '100%',
                buttonAlign:'left',
                border:false,
                defaultType: 'textfield',
                hideLabels: true,
                items: [{
                    fieldLabel: Kebab.helper.translate('Your e-mail address'),
                    emptyText: Kebab.helper.translate('Your e-mail address'),
                    name: 'email',
                    anchor:'100%',
                    allowBlank:false,
                    vtype: 'email'
                }],
                buttons: [{
                    width:80,
                    iconCls: 'icon-accept',
                    text: Kebab.helper.translate('Send'),
                    handler: function() {
                        this.forgotPasswordAction();
                    },
                    scope:this
                },{
                    xtype:'panel',
                    border:false,
                    bodyCssClass: 'kebab-transparent',
                    html: '<a href="#" id="forgotPasswordCancel-link">' + Kebab.helper.translate('Cancel') + '</a>'
                }],
                keys:[{
                    key: [Ext.EventObject.ENTER], handler: function() {
                        this.forgotPasswordAction();
                    }, scope:this
                }],
                listeners: {
                    afterRender: function(){
                        // Add events
                        Ext.fly('forgotPasswordCancel-link').on('click', function(e) {
                            e.stopEvent();
                            this.showSignInForm();
                        }, this)
                    },
                    scope:this
                }
            });
        },

        // UTILS -------------------------------------------------------------------------------------------------------

        /**
         * Show the pre-loader
         */
        showPreLoader: function() {
            Ext.fly('kebab-progress-bar').fadeIn();
            Ext.fly('signIn-form-wrapper').fadeOut();
            Ext.fly('forgotPassword-form-wrapper').fadeOut();
            Ext.fly('kebab-system-backend-signIn-container').scale(270,[65]);
        },

        /**
         * Show the login form
         */
        showSignInForm: function() {
            Ext.fly('kebab-progress-bar').fadeOut();
            Ext.fly('signIn-form-wrapper').fadeIn();
            Ext.fly('forgotPassword-form-wrapper').fadeOut();
            Ext.fly('kebab-system-backend-signIn-container').scale([330],[245]);
        },

        /**
         * Show the forgot password form
         */
        showForgotPasswordForm: function() {
            Ext.fly('kebab-progress-bar').fadeOut();
            Ext.fly('signIn-form-wrapper').fadeOut();
            Ext.fly('forgotPassword-form-wrapper').fadeIn();
            Ext.fly('kebab-system-backend-signIn-container').scale(400,[175]);
        },

        // ACTIONS -----------------------------------------------------------------------------------------------------

        /**
         * Sign in action
         */
        signInAction: function() {
            if (signInForm.getForm().isValid()) {
                this.showPreLoader();
                signInForm.getForm().submit({
                    success : function() {
                        Kebab.helper.redirect('backend/desktop');
                    },
                    failure : function() {
                        this.showSignInForm();
                    },
                    scope:this
                });
            }
        },

        /**
         * Forgot password action
         */
        forgotPasswordAction: function() {
             if (forgotPasswordForm.getForm().isValid()) {
                this.showPreLoader();
                forgotPasswordForm.getForm().submit({
                    success : function() {
                        this.showSignInForm();
                    },
                    failure : function() {
                        this.showForgotPasswordForm();
                    },
                    scope:this
                });
            }
        }
    };
}();

Ext.onReady(SignIn.init, SignIn);
