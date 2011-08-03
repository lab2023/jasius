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
class Jasius_Model_Access
{
    public static function add($contentId, $type, $roleIds = array(), $userIds = array())
    {
        $retVal = false;

        Doctrine_Manager::connection()->beginTransaction();
        try {

            if ($type == 'all' || $type == 'user') {
                // Add member and all
                $access = new Model_Entity_Access();
                $access->content_id = $contentId;
                $access->access = $type;
                $access->save();
                unset($access);
            } elseif ($type == 'specific' && (is_array($roleIds) || is_array($userIds))) {

                // Role
                if (is_array($roleIds) && count($roleIds) > 0) {
                    foreach ($roleIds as $role) {
                        $access = new Model_Entity_Access();
                        $access->content_id = $contentId;
                        $access->access = $type;
                        $access->allowRole = $role;
                        $access->save();
                        unset($access);
                    }
                }

                // User
                if (is_array($userIds) && count($userIds) > 0) {
                    foreach ($userIds as $user) {
                        $access = new Model_Entity_Access();
                        $access->content_id = $contentId;
                        $access->access = $type;
                        $access->allowUser = $user;
                        $access->save();
                        unset($access);
                    }
                }
            }

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
}
