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
    /**
     * @static
     * @throws Doctrine_Exception|Zend_Exception
     * @param $contentId
     * @param $type
     * @param array $roleIds
     * @param array $userIds
     * @return bool
     */
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

    /**
     * @static
     * @param $contentId
     * @param $type
     * @param array $roleIds
     * @param array $userIds
     * @return void
     */
    public static function put($contentId, $type, $roleIds = array(), $userIds = array())
    {
        self::del($contentId);
        self::add($contentId, $type, $roleIds, $userIds);
    }

    /**
     * Yetkiye göre wall döndürür
     *
     * @static
     * @param string $sort
     * @return Doctrine_Query
     */
    public static function getAllRightAccess($contentId)
    {
        $query = Doctrine_Query::create()
                    ->select('access.content_id, access.access, access.allowuser, access.allowrole')
                    ->from('Model_Entity_Access access')
                    ->where('access.content_id = ?', $contentId)
                    ->setHydrationMode(Doctrine::HYDRATE_ARRAY)->execute();
        if (count($query) == 0) {
            return false;
        }

        $access = array();
        $users = array(); $roles = array();
        for ($i = 0; $i < count($query); $i++){
            $access['accessType'] = $query[$i]['access'];
            if ($query[$i]['allowUser'] != 0) {
                $users[] = $query[$i]['allowUser'];
            }
            if ($query[$i]['allowRole'] != 0) {
                $roles[] = $query[$i]['allowRole'];
            }
        }
        if (count($users) > 0){

            $queryUser = Doctrine_Query::create()
                       ->select('user.id, user.fullname')
                       ->from('Model_Entity_User user')
                       ->whereIn('user.id',$users)
                       ->setHydrationMode(Doctrine::HYDRATE_ARRAY)->execute();

            $access['users'] = $queryUser;
        }
        if (count($roles) > 0){
            $lang = Zend_Auth::getInstance()->getIdentity()->language;
            $queryRole = Doctrine_Query::create()
                       ->select('role.id, roleTranslation.title as title')
                       ->from('Model_Entity_Role role')
                       ->leftJoin('role.Translation roleTranslation')
                       ->where('roleTranslation.lang = ?', $lang)
                       ->andWhereIn('role.id',$roles)
                       ->setHydrationMode(Doctrine::HYDRATE_ARRAY)->execute();
            
            $access['roles'] = $queryRole;
        }


        return $access;
    }
    /**
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
                    ->delete('Model_Entity_Access contentAccess')
                    ->where('contentAccess.content_id = ?', $contentId)
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

    /**
     * @static
     * @param Doctrine_Query $query
     * @return Doctrine_Query
     */
    public static function set(Doctrine_Query $query)
    {
        $query->where('access.access = ?', 'all');
        if (Zend_Auth::getInstance()->hasIdentity()) {
            $userSessionId = Zend_Auth::getInstance()->getIdentity()->id;
            $userSessionRoles = Zend_Auth::getInstance()->getIdentity()->roles;
            $query->orWhere('access.access = ?', 'user');
            $query->orWhere('access.user_id = ?', $userSessionId);
            $query->orWhereIn('access.role_id', $userSessionRoles);
        };

        return $query;
    }
}
