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
 * @category   Kebab
 * @package    Module
 * @subpackage Model
 * @author     Onur Özgür ÖZKAN <onur.ozgur.ozkan@lab2023.com>
 * @copyright  Copyright (c) 2010-2011 lab2023 - internet technologies TURKEY Inc. (http://www.lab2023.com)
 * @license    http://www.kebab-project.com/cms/licensing
 * @version    1.5.0
 */
 
/**
 * 
 *
 * @category   Kebab
 * @package    Module
 * @subpackage Model
 * @author     Onur Özgür ÖZKAN <onur.ozgur.ozkan@lab2023.com>
 * @copyright  Copyright (c) 2010-2011 lab2023 - internet technologies TURKEY Inc. (http://www.lab2023.com)
 * @license    http://www.kebab-project.com/cms/licensing
 * @version    1.5.0
 */
class Jasius_Model_Content
{
    public static function add($type_id)
    {
        $content = new Model_Entity_Content();
        $content->type_id = $type_id;
        $content->save();

        return is_object($content) ? $content : false;
    }
    /**
     * Delete by contentId
     * 
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
                    ->delete('Model_Entity_Content content')
                    ->where('content.id = ?', $contentId)
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
     * @param $typeId
     * @param array $options
     * @return array
     */
    public static function getAllContentByTypeId($typeId, Array $options = array())
    {
        $userSessionId = Zend_Auth::getInstance()->getIdentity()->id;
        $contentQuery = Doctrine_Query::create()
                            ->select('DISTINCT content.id')
                            ->from('Model_Entity_Content content')
                            ->leftJoin('content.Data data ON data.content_id = content.id')
                            ->leftJoin('content.Access jaccess ON content.id = jaccess.content_id')
                            ->where('content.type_id = ?', $typeId)
                            ->setHydrationMode(Doctrine::HYDRATE_SINGLE_SCALAR);
        $accessStr = "jaccess.access = 'all' OR content.created_by = $userSessionId";

        // Get userId if has identity
        if (Zend_Auth::getInstance()->hasIdentity()) {
            $userSessionRoles = Zend_Auth::getInstance()->getIdentity()->roles;
            $accessStr = $accessStr." OR jaccess.access = 'user' OR jaccess.allowUser = $userSessionId OR jaccess.allowRole  IN (".implode(',',$userSessionRoles).")";
        };
        $contentQuery->andWhere($accessStr);
        // Search Options
        if (isset($options['search'])) {
            $contentQuery->andWhereIn('data.id', $options['search']);
        }

        // Order Options
        if (isset($options['order'])) {
            $dir  = $options['order']['dir'];
            $sort = $options['order']['sort'];
            $propertyArray = explode('_', $sort);
            if($propertyArray[count($propertyArray) -1] == 'id') {
                $sortKey = 'content.id';
            } else {
                $sortKey = 'data.'
                           . Jasius_Model_Data::mapping(Doctrine_Core::getTable('Model_Entity_Property')->find($propertyArray[2])->dataType);
                //KBBTODO fixe the code like end($propertyArray)
                $contentQuery->andWhere('data.property_id = ?', $propertyArray[count($propertyArray) -1]);
            }

            $contentQuery->orderBy("data.property_id $dir, $sortKey $dir");
        }
        $contentList = $contentQuery->execute();
        $propertyList = Jasius_Model_Property::getAllPropertyByTypeId($typeId)->execute();

        // Filter Options
        if (isset($options['filter'])) {
            $filter = array();
            foreach ($options['filter'] as $item) {
                $filter[$item['field']] = $item;
            }
        }

        //select content property values
        $contentData = array();
        $i = 0;
        foreach ($contentList as $content) {
            $addContentToContentData = true;
            $val = array();
            $val['content_id'] = $content['id'];
            $data = Jasius_Model_Data::getDataForLoadDocumentForm($content['id']);
            $j = 0;
            foreach ($propertyList as $property) {

                $dataValue = $data[$j][Jasius_Model_Data::mapping($property['dataType'])];
                
                if (isset($filter) && array_key_exists($property['name'], $filter)) {
                    
                    $filterValue = $filter[$property['name']]['value'];
                    $filterType = $filter[$property['name']]['type'];
                    switch ($filterType) {
                        case 'string' :
                            $addContentToContentData = is_integer(strpos($dataValue, $filterValue)) ? true : false;
                            $dataValue = str_replace($filterValue, "<b>$filterValue</b>", $dataValue);
                            break;
                        case 'list' :
                            if (strstr($filterValue, ',')) {
                                $fi = explode(',', $filterValue);
                                for ($q = 0; $q < count($fi); $q++) {
                                    $fi[$q] = "'" . $fi[$q] . "'";
                                }

                                $addContentToContentData = in_array($dataValue, $fi);
                            } else {
                                 $addContentToContentData = ($dataValue == $filterValue);
                            }
                            break;
                        case 'boolean' :
                            $addContentToContentData = ($dataValue == $filterValue);
                            break;
                        case 'numeric' :
                            switch ($filter[$property['name']]['comparison']) {
                                case 'eq' :
                                    $addContentToContentData = $filterValue == $dataValue ? true : false;
                                    break;
                                case 'lt' :
                                    $addContentToContentData = $filterValue < $dataValue ? true : false;
                                    break;
                                case 'gt' :
                                    $addContentToContentData = $filterValue > $dataValue ? true : false;
                                    break;
                            }
                            break;
                        case 'date' :
                            $filterValue = date('Y-m-d', strtotime($filterValue));
                            switch ($filter[$property['name']]['comparison']) {
                                case 'eq' :
                                    $addContentToContentData = $filterValue == $dataValue ? true : false;
                                    break;
                                case 'lt' :
                                    $addContentToContentData = $filterValue < $dataValue ? true : false;
                                    break;
                                case 'gt' :
                                    $addContentToContentData = $filterValue > $dataValue ? true : false;
                                    break;
                            }
                            break;
                    }
                }

                $val[$property['name']] = $dataValue;
                $j++;
            }

            if ($addContentToContentData) {
                $contentData[$i] = $val;
            }
            $i++;
        }
        
        // Pagination Option
        // KBBTODO this area is hardcode pls send me limit and start value everytime!
        $start = 0;
        $limit = 25;
        if (isset($options['pagination'])) {
            $start = $options['pagination']['start'];
            $limit = $options['pagination']['limit'];
        }

        $retData = array();
        $retData['total'] = count($contentData);
        $retData['data'] = array_values(array_slice($contentData, $start, $limit));

        return $retData;
    }
}
