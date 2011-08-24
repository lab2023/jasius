/**
 * DocumentManager Application DocumentsDataStore
 *
 * @category    Kebab
 * @package     Applications
 * @namespace   KebabOS.applications.documentManager.application.models.DocumentsDataStore
 * @author      Tayfun Öziş ERİKAN <tayfun.ozis.erikan@lab2023.com>
 * @copyright   Copyright (c) 2010-2011 lab2023 - internet technologies TURKEY Inc. (http://www.lab2023.com)
 * @license     http://www.kebab-project.com/cms/licensing
 */
KebabOS.applications.documentManager.application.models.DocumentsDataStore = Ext.extend(Kebab.library.ext.RESTfulBasicDataStore, {

    bootstrap: null,

    restAPI: 'jasius/content',

    readerFields:[
        {name: 'content_id', type:'integer'}
    ]
});