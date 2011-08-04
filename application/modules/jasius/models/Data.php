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
class Jasius_Model_Data
{
    /**
     * @static
     * @param $typeId
     * @param $contentId
     * @param array $propertyFormData
     * @return array|bool
     */
    public static function add($typeId, $contentId, array $propertyFormData)
    {
        // assertion count($propertyFormData) === count($propertyDataStructrue)
        $propertyDataStructure = Jasius_Model_Property::getAllPropertyByTypeId($typeId)->execute();

        // Check type_id is in $propertyFormData
        if (array_key_exists('type_id', $propertyFormData)) {
            unset($propertyFormData['type_id']);
        }

        // Check type_id is in $propertyFormData
        if (array_key_exists('title', $propertyFormData)) {
            unset($propertyFormData['title']);
        }
        if (array_key_exists('controller', $propertyFormData)) {
            unset($propertyFormData['controller']);
        }
         if (array_key_exists('action', $propertyFormData)) {
            unset($propertyFormData['action']);
        }
         if (array_key_exists('module', $propertyFormData)) {
            unset($propertyFormData['module']);
        }
        // Sort $propertyFormData with $item_id
        ksort($propertyFormData);

        // Validation
        $i = 0;
        $errorMessage = array();
        $dataCollectionArray = array();
        foreach ($propertyFormData as $propertyKey => $propertyValue) {

            //KBBTODO use listlist($id, $dataType, $isUni) = $propertyDataStructure[$i];

            // Check dataType
            $dataTypeCheck = Doctrine_Validator::isValidType($propertyValue, $propertyDataStructure[$i]['dataType']);
            if (!$dataTypeCheck) {
                $errorMessage[$propertyKey] = 'Veri tipiniz bu alana uygun degil.';
            }

            // Check Require
            if ($propertyDataStructure[$i]['isRequire'] && is_null($propertyValue)) {
                $errorMessage[$propertyKey] = 'Bu alan bos bırakılamaz.';
            }

            // Check enum
            if ($propertyDataStructure[$i]['dataType'] === 'enum') {
                $enum = unserialize($propertyDataStructure[$i]['enum']);
                if (!in_array($propertyValue, $enum)) {
                    $errorMessage[$propertyKey] = 'Lütfen listeden bir tane seçiniz';
                }
            }

            // Add default value if value is null and defaultValue is set
            if (is_null($propertyValue) && !is_null($propertyDataStructure[$i]['defaultValue'])) {
                $propertyFormData[$propertyKey] = $propertyDataStructure[$i]['defaultValue'];
            }

            // Check isUnique
            if ($propertyDataStructure[$i]['isUnique']) {
                $field = self::mapping($propertyDataStructure[$i]['dataType']);
                $isUniqueCheck = Doctrine_Query::create()->from('Model_Entity_Data data')->where($field . '= ?', $propertyValue)->count() > 0
                                ? true
                                : false;

                if ($isUniqueCheck) {
                    $errorMessage[$propertyKey] = 'Daha önce böyle bir kayıt girilmiştir.';
                }
            }

            $dataCollectionArray[$i]['property_id'] = $propertyDataStructure[$i]['id'];
            $dataCollectionArray[$i]['content_id'] = $contentId;
            $dataCollectionArray[$i][self::mapping($propertyDataStructure[$i]['dataType'])] = $propertyValue;

            $i++;
        } // eof foreach

        if (count($errorMessage)) {
            $retVal = $errorMessage;
        } else {
            // Save collection
            $dataCollection = new Doctrine_Collection('Model_Entity_Data');
            $dataCollection->fromArray($dataCollectionArray);
            $dataCollection->save();
            unset($dataCollection);
            
            $retVal = true;
        }

        return $retVal;
    }

    public static function mapping($dataType)
    {
        switch ($dataType) {
            case 'integer':
                $retDataType = 'numberValue';
                break;
            case 'string':
                $retDataType = 'textValue';
                break;
            case 'boolean':
                $retDataType = 'numberValue';
                break;
            case 'enum':
                $retDataType = 'textValue';
                break;
            case 'float':
                $retDataType = 'numberValue';
                break;
            case 'decimal':
                $retDataType = 'numberValue';
                break;
            case 'array':
                $retDataType = 'textValue';
                break;
            case 'object':
                $retDataType = 'textValue';
                break;
            case 'blob':
                $retDataType = 'textValue';
                break;
            case 'clob':
                $retDataType = 'textValue';
                break;
            case 'timestamp':
                $retDataType = 'timeValue';
                break;
            case 'time':
                $retDataType = 'timeValue';
                break;
            case 'date':
                $retDataType = 'timeValue';
                break;
            case 'gzip':
                $retDataType = 'textValue';
                break;
            default:
                throw new Kebab_Exception('Unvalid data type');
                break;
        }

        return $retDataType;
    }
}
