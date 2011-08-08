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
class Jasius_AccessController extends Kebab_Rest_Controller
{
    public function postAction()
    {
        $param = $this->_helper->param();
        $response = $this->_helper->response();
        $roles = array_key_exists('roleId',$param) ? $param['roleId'] : array();
        $users = array_key_exists('userId',$param) ? $param['userId'] : array();
        $success = Jasius_Model_Access::add($param['contentId'], $param['accessType'], $roles, $users);

        if ($success) {
            $response->setSuccess(true)->addNotification('INFO', 'Erişimler başarı ile kaydedilmiştir.');
        } else {
            $response->addNotification('ERR', 'Erişim Kaydı Başarısız..');
        }

        $response->getResponse();
    }
}
