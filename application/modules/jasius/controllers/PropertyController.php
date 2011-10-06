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
 * @package    Modules
 * @subpackage Controller
 * @author     Onur Özgür ÖZKAN <onur.ozgur.ozkan@lab2023.com>
 * @copyright  Copyright (c) 2010-2011 lab2023 - internet technologies TURKEY Inc. (http://www.lab2023.com)
 * @license    http://www.kebab-project.com/cms/licensing
 * @version    1.5.0
 */
 
/**
 * 
 *
 * @category   Kebab
 * @package    Modules
 * @subpackage Controller
 * @author     Onur Özgür ÖZKAN <onur.ozgur.ozkan@lab2023.com>
 * @copyright  Copyright (c) 2010-2011 lab2023 - internet technologies TURKEY Inc. (http://www.lab2023.com)
 * @license    http://www.kebab-project.com/cms/licensing
 * @version    1.5.0
 */
class Jasius_PropertyController extends Kebab_Rest_Controller
{
    public function indexAction()
    {
        $param = $this->_helper->param();
        $typeArray = Jasius_Model_Type::getTypeById($param['typeId'])->fetchOne();
        $type = array('id' => $typeArray['type_id'], 'text' => $typeArray['typeTranslation_title']);

        $retData = Jasius_Model_Property::getAllPropertyByTypeId($param['typeId'],'NUMBER_ARRAY')->execute();
        $this->_helper->response(true, 200)->add('type', $type)->addTotal(count($retData))->addData($retData)->getResponse();
    }

    public function getAction()
    {
        $param = $this->_helper->param();
        $retData = Jasius_Model_Property::get($param['id'])->execute();
        $this->_helper->response(true)->addData($retData)->getResponse();
    }
}
