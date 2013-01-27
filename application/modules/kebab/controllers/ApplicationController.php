<?php
/**
 * Kebab Project
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
 * @category    Kebab
 * @package     Modules
 * @subpackage  Controllers
 * @author      Onur Özgür ÖZKAN <onur.ozgur.ozkan@lab2023.com>
 * @copyright   Copyright (c) 2010-2011 lab2023 - internet technologies TURKEY Inc. (http://www.lab2023.com)
 * @license     http://www.kebab-project.com/cms/licensing
 * @version     1.5.0
 */

/**
 * Application Manager
 *
 * This service is list all application and set them active and passive.
 *
 * @category    Kebab
 * @package     Modules
 * @subpackage  Controllers
 * @author      Onur Özgür ÖZKAN <onur.ozgur.ozkan@lab2023.com>
 * @copyright   Copyright (c) 2010-2011 lab2023 - internet technologies TURKEY Inc. (http://www.lab2023.com)
 * @license     http://www.kebab-project.com/cms/licensing
 * @version     1.5.0
 */
class Kebab_ApplicationController extends Kebab_Rest_Controller
{
    public function indexAction()
    {
        // Mapping
        $mapping = array(
            'id' => 'application.id',
            'active' => 'application.active',
            'description' => 'applicationTranslation.description',
            'title' => 'title',
        );

        $ids = $this->_helper->search('Model_Entity_Application', true);
        $order = $this->_helper->sort($mapping);

        $query = Kebab_Model_Application::getAll($ids, $order);
        $pager = $this->_helper->pagination($query);
        $responseData = $pager->execute(array(), Doctrine::HYDRATE_ARRAY);

        // Response
        $this->_helper->response(true)->addData($responseData)->addTotal($pager->getNumResults())->getResponse();
    }

    public function putAction()
    {
        // Getting parameters
        $params = $this->_helper->param();

        // Convert data collection array if not
        $collection = $this->_helper->array()->isCollection($params['data'])
                ? $params['data']
                : $this->_helper->array()->convertRecordtoCollection($params['data']);

        // Updating status
        Doctrine_Manager::connection()->beginTransaction();
        try {
            // Doctrine
            foreach ($collection as $record) {
                $story = new Model_Entity_Application();
                $story->assignIdentifier($record['id']);
                $story->set('active', $record['active']);
                $story->save();
            }
            Doctrine_Manager::connection()->commit();
            unset($story);

            // Response
            $this->_helper->response(true, 202)->getResponse();
        } catch (Zend_Exception $e) {
            Doctrine_Manager::connection()->rollback();
            throw $e;
        } catch (Doctrine_Exception $e) {
            Doctrine_Manager::connection()->rollback();
            throw $e;
        }
    }
}