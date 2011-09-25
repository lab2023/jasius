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
    public static $validate = false;
    
    public static function add($contentId, array $propertyFormData)
    {
        // Validation
        $retData = self::validation($contentId, $propertyFormData);

        if (!self::$validate) {
            $retVal = $retData;
        } else {
            // Save collection
            $dataCollection = new Doctrine_Collection('Model_Entity_Data');
            $dataCollection->fromArray($retData);
            $dataCollection->save();
            unset($dataCollection);
            
            $retVal = true;
        }

        return $retVal;
    }

    public static function update($contentId, $propertyFormData)
    {
        $retData = self::validation($contentId, $propertyFormData);

        if (!self::$validate) {
            $retVal = $retData;
        } else {
            Doctrine_Manager::connection()->beginTransaction();
            try {
                foreach ($retData as $data) {
                    $col = self::getDataColumn($data);
                    $query = Doctrine_Query::create()
                                ->update('Model_Entity_Data')
                                ->set("$col", '?', $data[$col])
                                ->where('property_id = ?', (int) $data['property_id'])
                                ->andWhere('content_id = ?', (int) $data['content_id']);
                    $query->execute();
                }
                $retVal = Doctrine_Manager::connection()->commit();
            } catch (Doctrine_Exception $e) {
                Doctrine_Manager::connection()->rollback();
                throw $e;
            } catch (Zend_Exception $e) {
                Doctrine_Manager::connection()->rollback();
                throw $e;
            }
        }

        return $retVal;
    }

    public static function getDataColumn($data)
    {
        if (array_key_exists('integerValue', $data)) {
            return 'integerValue';
        }

        if (array_key_exists('stringValue', $data)) {
            return 'stringValue';
        }

        if (array_key_exists('decimalValue', $data)) {
            return 'decimalValue';
        }

        if (array_key_exists('floatValue', $data)) {
            return 'floatValue';
        }

        if (array_key_exists('dateValue', $data)) {
            return 'dateValue';
        }

        if (array_key_exists('timeValue', $data)) {
            return 'timeValue';
        }

        if (array_key_exists('timestampValue', $data)) {
            return 'timestampValue';
        }

        if (array_key_exists('booleanValue', $data)) {
            return 'booleanValue';
        }

        if (array_key_exists('enumValue', $data)) {
            return 'enumValue';
        }

        if (array_key_exists('arrayValue', $data)) {
            return 'arrayValue';
        }

        if (array_key_exists('objectValue', $data)) {
            return 'objectValue';
        }

        if (array_key_exists('gzipValue', $data)) {
            return 'gzipValue';
        }

        if (array_key_exists('clobValue', $data)) {
            return 'clobValue';
        }

        if (array_key_exists('blobValue', $data)) {
            return 'blobValue';
        }

        throw new Kebab_Exception('Column data type could not detected');
    }

    public static function validation ($contentId, $propertyFormData)
    {
        self::$validate = false;
        $content = Doctrine_Core::getTable('Model_Entity_Content')->find($contentId);
        $propertyDataStructure = Jasius_Model_Property::getAllPropertyByTypeId($content->type_id)->execute();
        $i = 0;
        $errorMessage = array();
        $dataCollectionArray = array();
        foreach ($propertyFormData as $propertyKey => $propertyValue) {
            // Check dataType
            if ($propertyDataStructure[$i]['dataType'] === 'clob') {
                $propertyValue = (string) $propertyValue;
            }
            
            $dataTypeCheck = Doctrine_Validator::isValidType($propertyValue, $propertyDataStructure[$i]['dataType']);
            if (!$dataTypeCheck) {
                $errorMessage[$propertyKey] = 'Data type is not appropriate in this area';
            }

            // Check Require
            if ($propertyDataStructure[$i]['isRequire'] && is_null($propertyValue)) {
                $errorMessage[$propertyKey] = 'Field cannot be left blank';
            }

            // Check enum
            if ($propertyDataStructure[$i]['dataType'] === 'enum') {
                $enum = $propertyDataStructure[$i]['enum'];
                if (!in_array($propertyValue, $enum)) {
                    $errorMessage[$propertyKey] = 'Please select from the list';
                }
            }

            // Add default value if value is null and defaultValue is set
            if (is_null($propertyValue) && !is_null($propertyDataStructure[$i]['defaultValue'])) {
                $propertyFormData[$propertyKey] = $propertyDataStructure[$i]['defaultValue'];
            }

            // Check isUnique
            if ($propertyDataStructure[$i]['isUnique']) {
                $field = self::mapping($propertyDataStructure[$i]['dataType']);
                $isUniqueCheck = Doctrine_Query::create()->from('Model_Entity_Data data')
                                         ->where($field . '= ?', $propertyValue)
                                         ->andWhere('data.content_id != ?', $contentId)->count() > 0
                                ? true
                                : false;

                if ($isUniqueCheck) {
                    $errorMessage[$propertyKey] = 'Same record entered before';
                }
            }

            $dataCollectionArray[$i]['property_id'] = $propertyDataStructure[$i]['id'];
            $dataCollectionArray[$i]['content_id'] = $contentId;
            $dataCollectionArray[$i][self::mapping($propertyDataStructure[$i]['dataType'])] = $propertyValue;

            $i++;
        } // eof foreach

        if (count($errorMessage) > 0) {
            self::$validate = false;
            return $errorMessage;
        } else {
            self::$validate = true;
            return $dataCollectionArray;
        }
    }

    public static function getDataForLoadDocumentForm($contentId)
    {
        $query = Doctrine_Query::create()
                    ->select('
                        data.property_id,
                        data.integerValue,
                        data.decimalValue,
                        data.floatValue,
                        data.timeValue,
                        data.timestampValue,
                        data.dateValue,
                        data.booleanValue,
                        data.stringValue,
                        data.blobValue,
                        data.clobValue,
                        data.enumValue,
                        data.arrayValue,
                        data.objectValue,
                        data.gzipValue,
                        property.dataType as dataType
                    ')
                    ->from('Model_Entity_Data data')
                    ->leftJoin('data.Property property')
                    ->where('data.content_id = ?', $contentId)
                    ->orderBy('property.weight ASC')
                    ->setHydrationMode(Doctrine::HYDRATE_ARRAY);

        $rawData = $query->execute();

        return $rawData;
    }

    public static function del($contentId)
    {
        Doctrine_Manager::connection()->beginTransaction();
        try {
                Doctrine_Query::create()
                    ->delete('Model_Entity_Data data')
                    ->where('data.content_id = ?', $contentId)
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
    
    public static function mapping($dataType)
    {
        switch ($dataType) {
            case 'integer':
                $retDataType = 'integerValue';
                break;
            case 'string':
                $retDataType = 'stringValue';
                break;
            case 'boolean':
                $retDataType = 'booleanValue';
                break;
            case 'enum':
                $retDataType = 'enumValue';
                break;
            case 'float':
                $retDataType = 'floatValue';
                break;
            case 'decimal':
                $retDataType = 'decimalValue';
                break;
            case 'array':
                $retDataType = 'arrayValue';
                break;
            case 'object':
                $retDataType = 'objectValue';
                break;
            case 'blob':
                $retDataType = 'blobValue';
                break;
            case 'clob':
                $retDataType = 'clobValue';
                break;
            case 'timestamp':
                $retDataType = 'timestampValue';
                break;
            case 'time':
                $retDataType = 'timeValue';
                break;
            case 'date':
                $retDataType = 'dateValue';
                break;
            case 'gzip':
                $retDataType = 'gzipValue';
                break;
            default:
                throw new Kebab_Exception('Unvalid data type');
                break;
        }

        return $retDataType;
    }
}
