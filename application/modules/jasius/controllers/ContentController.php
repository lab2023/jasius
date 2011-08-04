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
class Jasius_ContentController extends Kebab_Rest_Controller
{
    public function postAction()
    {
        $param = $this->_helper->param();

        $response = $this->_helper->response();

        Doctrine_Manager::connection()->beginTransaction();
        try {

            $content = Jasius_Model_Content::add($param['type_id'], $param['title']);
            $retData = Jasius_Model_Data::add($param['type_id'], $content->id, $param);

            if (is_bool($retData) && $retData === true) {
                $success = Doctrine_Manager::connection()->commit();
            } else {
                $success = false;
            }

            if ($success) {
                $response->setSuccess($success)->addNotification('INFO', 'Belgeniz basari ile kaydedilmiştir');
            } else {
                $response->setErrors($retData);
            }

        } catch (Zend_Exception $e) {
            Doctrine_Manager::connection()->rollback();
            throw $e;
        } catch (Doctrine_Exception $e) {
            Doctrine_Manager::connection()->rollback();
            throw $e;
        }

        $response->getResponse();

    }
}
