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
class Jasius_Model_Type
{
    public static function getAllTypes($typeIds)
    {
        $lang = Zend_Auth::getInstance()->getIdentity()->language;
        $query =  Doctrine_Query::create()
                    ->select('type.id, typeTranslation.title as title')
                    ->from('Model_Entity_Type type')
                    ->leftJoin('type.Translation typeTranslation')
                    ->where('typeTranslation.lang = ?', $lang)
                    ->andWhere('type.active = 1')
                    ->andWhereIn('type.id', $typeIds)
                    ->setHydrationMode(Doctrine::HYDRATE_ARRAY);
        return $query;
    }

    public static function getTypeById($typeId)
    {
        $lang = Zend_Auth::getInstance()->getIdentity()->language;
        $query =  Doctrine_Query::create()
                    ->select('type.id, typeTranslation.title as title')
                    ->from('Model_Entity_Type type')
                    ->leftJoin('type.Translation typeTranslation')
                    ->where('typeTranslation.lang = ?', $lang)
                    ->andWhereIn('type.id', $typeId)
                    ->setHydrationMode(Doctrine::HYDRATE_SCALAR);
        return $query;
    }
}
