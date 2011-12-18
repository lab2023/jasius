/**
 * jasius Application TypesDataStore
 *
 * @category    Kebab (kebab-reloaded)
 * @package     Applications
 * @namespace   KebabOS.applications.jasius.application.models.RoleDataStore
 * @author      Tayfun Öziş ERİKAN <tayfun.ozis.erikan@lab2023.com>
 * @copyright   Copyright (c) 2010-2011 lab2023 - internet technologies TURKEY Inc. (http://www.lab2023.com)
 * @license     http://www.kebab-project.com/licensing
 */
KebabOS.applications.jasius.application.models.FilesDataStore = Ext.extend(Kebab.library.ext.RESTfulBasicDataStore, {


    bootstrap: null,

    restAPI: 'jasius/file',

    readerFields:[
        {name: 'id'},
        {name: 'name'},
        {name: 'size'},
        {name: 'status'},
        {name: 'progress'}
    ]
});