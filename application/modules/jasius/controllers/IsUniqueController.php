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
 * @package    Module
 * @subpackage Controller
 * @author     Onur Özgür ÖZKAN <onur.ozgur.ozkan@lab2023.com>
 * @copyright  Copyright (c) 2010-2011 lab2023 - internet technologies TURKEY Inc. (http://www.lab2023.com)
 * @license    http://www.kebab-project.com/cms/licensing
 * @version    1.5.0
 */

/**
 *
 * @category   Kebab
 * @package    Module
 * @subpackage Controller
 * @author     Mehmet Ali KÜÇÜK <mehmet.a.kucuk@gmail.com.com>
 * @copyright  Copyright (c) 2010-2011 lab2023 - internet technologies TURKEY Inc. (http://www.lab2023.com)
 * @license    http://www.kebab-project.com/cms/licensing
 * @version    1.5.0
 */
class Jasius_IsUniqueController extends Kebab_Rest_Controller
{
    public function indexAction()
    {
        $param = $this->_helper->param();
        $response = $this->_helper->response();

        $expProperty = explode('_',$param['name']);
        $propertyId = $expProperty[count($expProperty)-1];

        $contentId = array_key_exists('contentId',$param) ? $param['contentId'] : 0;


        $retData = Jasius_Model_IsUnique::isUniqueProperty($propertyId, $param['value'], $contentId);

        if (is_bool($retData) && $retData === true){
            $response->setSuccess(true);
        } else {
            $response->add('msg', $retData);
        }
        $response->getResponse();
    }
}
