<?php
 
/**
 * Kebab Framework
 *
 * LICENSE
 *
 * This source file is subject to the  Dual Licensing Model that is bundled
 * with this package in the file LICENSE.txt.
 * It is also available through the world-wide-web at this URL:
 * http://www.kebab-project.com/cms/licensing
 * If you did not receive a copy of the license and are unable to
 * obtain it through the world-wide-web, please send an email
 * to info@lab2023.com so we can send you a copy immediately.
 *
 * @category   Kebab (kebab-reloaded)
 * @package    Kebab
 * @subpackage Library
 * @author     Onur Özgür ÖZKAN <onur.ozgur.ozkan@lab2023.com>
 * @copyright  Copyright (c) 2010-2011 lab2023 - internet technologies TURKEY Inc. (http://www.lab2023.com)
 * @license    http://www.kebab-project.com/cms/licensing
 * @version    1.5.0
 */
 
/**
 * 
 *
 * @category   Kebab (kebab-reloaded)
 * @package    
 * @subpackage 
 * @author     Onur Özgür ÖZKAN <onur.ozgur.ozkan@lab2023.com>
 * @copyright  Copyright (c) 2010-2011 lab2023 - internet technologies TURKEY Inc. (http://www.lab2023.com)
 * @license    http://www.kebab-project.com/cms/licensing
 * @version    1.5.0
 */
class Jasius_Model_Content
{
    public static function add($type_id)
    {
        $content = new Model_Entity_Content();
        $content->type_id = $type_id;
        $content->save();

        return is_object($content) ? $content : false;
    }
    /**
     * Delete by contentId
     * 
     * @static
     * @throws Doctrine_Exception|Zend_Exception
     * @param $contentId
     * @return bool
     */
    public static function del($contentId)
    {
        Doctrine_Manager::connection()->beginTransaction();
        try {
                Doctrine_Query::create()
                    ->delete('Model_Entity_Content content')
                    ->where('content.id = ?', $contentId)
                    ->execute();

            $retVal = Doctrine_Manager::connection()->commit();
        } catch (Doctrine_Exception $e) {
            Doctrine_Manager::connection()->rollback();
            throw $e;
        } catch (Zend_Exception $e) {
            Doctrine_Manager::connection()->rollback();
            throw $e;
        }

        return $retVal;
    }

   
    public static function getAllContentByTypeId($typeId, $dataIds)
    {
        $contentList = Doctrine_Core::getTable('Model_Entity_Content')
                        ->findBy('type_id', $typeId)
                        ->toArray();

        $propertyList = Jasius_Model_Property::getAllPropertyByTypeId($typeId)->execute();

        $retData = array();
        $i = 0;
        foreach($contentList as $content){
            $val = array();
            $val['id'] = $content['id'];
            $data = Jasius_Model_Data::getDataForLoadDocumentForm($content['id']);
            $j = 0;
            foreach ($propertyList as $property) {
                $val[$property['title']] = $data[$j][Jasius_Model_Data::mapping($property['dataType'])];
                $j++;
            }
            $retData[$i] = $val;
            $i++;
        }
        
        return $retData;
    }
}
