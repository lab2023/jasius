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
 * @author     Mehmet Ali KÜÇÜK <mehmet.a.kucuk@gmail.com.com>
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
class Jasius_Model_IsUnique
{
    public static function isUniqueProperty($propertyId, $value, $contentId)
    {
        $retVal = true;
        
        $property = Jasius_Model_Property::get($propertyId)->fetchOne();

        $errorMessage = '';
        $field = Jasius_Model_Data::mapping($property['dataType']);
        $isUniqueCheck = Doctrine_Query::create()
                                 ->from('Model_Entity_Data data')
                                 ->where($field . '= ?', $value)
                                 ->andWhere('content_id != ?', $contentId)
                                 ->count() > 0
                        ? true
                        : false;

        if ($isUniqueCheck) {
            $errorMessage = 'Same record entered before';
        }
        
        if ($errorMessage != '') {
            $retVal = $errorMessage;
        }

        return $retVal;
    }
}
