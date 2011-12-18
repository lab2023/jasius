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
 * @category   Kebab
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
 * @category   Kebab
 * @package
 * @subpackage
 * @author     Onur Özgür ÖZKAN <onur.ozgur.ozkan@lab2023.com>
 * @copyright  Copyright (c) 2010-2011 lab2023 - internet technologies TURKEY Inc. (http://www.lab2023.com)
 * @license    http://www.kebab-project.com/cms/licensing
 * @version    1.5.0
 */
class Jasius_Model_Property
{
    public static function getAllPropertyByTypeId($typeId, $arrayForm)
    {
        $lang = Zend_Auth::getInstance()->getIdentity()->language;
        $query =  Doctrine_Query::create()
                    ->select('
                        CONCAT("property_item_", property.id) as name,
                        propertyTranslation.title as title,
                        property.dataType,
                        property.isUnique,
                        property.isRequire,
                        property.defaultValue,
                        property.enum,
                        property.weight
                    ')
                    ->from('Model_Entity_Property property')
                    ->leftJoin('property.Translation propertyTranslation')
                    ->where('propertyTranslation.lang = ?', $lang)
                    ->andWhere('property.type_id = ?', $typeId)
                    ->orderBy('property.weight ASC')
                    ->setHydrationMode(Doctrine::HYDRATE_ARRAY);

        if ($arrayForm === 'NUMBER_ARRAY') {
            return $query;
        } else {
            $query = $query->execute();
            $propertyDataStructure = array();
            foreach ($query as $property){
                $propertyDataStructure[$property['name']] = $property;
            }
            return $propertyDataStructure;
        }
    }

    public static function get($id)
    {
        $query = Doctrine_Query::create()
                    ->select('property.id, property.dataType, property.isUnique, property.isRequire ,property.defaultValue, property.enum')
                    ->from('Model_Entity_Property property')
                    ->where('property.id = ?', $id)
                    ->setHydrationMode(Doctrine::HYDRATE_ARRAY)
                    ->useQueryCache(Kebab_Cache_Query::isEnable());
        return $query;
    }
}
