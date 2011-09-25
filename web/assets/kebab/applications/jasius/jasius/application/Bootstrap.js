/**
 * Kebab Application Bootstrap Class
 *
 * @category    Kebab (kebab-reloaded)
 * @package     Applications
 * @namespace   KebabOS.applications.jasius.application
 * @author      Yunus ÖZCAN <yunus.ozcan@lab2023.com>
 * @copyright   Copyright (c) 2010-2011 lab2023 - internet technologies TURKEY Inc. (http://www.lab2023.com)
 * @license     http://www.kebab-project.com/cms/licensing
 */
Ext.extend(KebabOS.applications.jasius.application.Bootstrap, Kebab.OS.Application, {

    createApplication : function() {

        var desktop = this.app.getDesktop();
        var app = desktop.getApplication(this.id);

        if (!app) {

            // desktop width and heigth
            var winWidth = parseInt(desktop.getWinWidth() / 1.2);
            var winHeight = parseInt(desktop.getWinHeight() / 1.2);

            // Default layout
            this.layout = new KebabOS.applications.jasius.application.layouts.Layout({
                bootstrap: this
            });

            // Default controller
            this.defaultController = new KebabOS.applications.jasius.application.controllers.Index({
                bootstrap: this
            });

            // create window
            app = desktop.createApplication({
                id: this.id,
                title: this.title.text,
                description: this.title.description,
                iconCls: 'jasius-application-gui-icon',
                width: winWidth,
                height: winHeight,
                border:false,
                items: this.layout
            });

        }
        app.show();
    }
});