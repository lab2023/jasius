<?php

/**
 * Model_Entity_Type
 * 
 * This class has been auto-generated by the Doctrine ORM Framework
 * 
 * @property string $title
 * @property boolean $active
 * @property Doctrine_Collection $Property
 * @property Doctrine_Collection $Content
 * 
 * @package    ##PACKAGE##
 * @subpackage ##SUBPACKAGE##
 * @author     lab2023 - Dev. Team <info@lab2023.com>
 * @version    SVN: $Id: Builder.php 7490 2010-03-29 19:53:27Z jwage $
 */
class Model_Entity_Type extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('jasius_type');
        $this->hasColumn('title', 'string', 255, array(
             'type' => 'string',
             'notnull' => true,
             'length' => '255',
             ));
        $this->hasColumn('active', 'boolean', null, array(
             'type' => 'boolean',
             'notnull' => true,
             ));

        $this->option('type', 'INNODB');
        $this->option('collate', 'utf8_bin');
        $this->option('charset', 'utf8');
    }

    public function setUp()
    {
        parent::setUp();
        $this->hasMany('Model_Entity_Property as Property', array(
             'local' => 'property_id',
             'foreign' => 'id'));

        $this->hasMany('Model_Entity_Content as Content', array(
             'local' => 'content_id',
             'foreign' => 'id'));

        $timestampable0 = new Doctrine_Template_Timestampable();
        $softdelete0 = new Doctrine_Template_SoftDelete();
        $blameable0 = new Doctrine_Template_Blameable();
        $i18n0 = new Doctrine_Template_I18n(array(
             'fields' => 
             array(
              0 => 'title',
             ),
             'className' => 'TypeTranslation',
             'lenghth' => 2,
             ));
        $searchable1 = new Doctrine_Template_Searchable(array(
             'fields' => 
             array(
              0 => 'title',
             ),
             'className' => 'JasiusTypeSearch',
             ));
        $i18n0->addChild($searchable1);
        $this->actAs($timestampable0);
        $this->actAs($softdelete0);
        $this->actAs($blameable0);
        $this->actAs($i18n0);
    }
}