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
class Jasius_Model_File
{
    public static function getList($contentId)
    {
        $query =  Doctrine_Query::create()
                    ->select('file.name, file.size, "Completed" as status, 100 as progress')
                    ->from('Model_Entity_File file')
                    ->where('file.content_id = ?', $contentId)
                    ->setHydrationMode(Doctrine::HYDRATE_ARRAY);
        return $query->execute();
    }

    public  static  function  add($contentId, $name, $size, $mime)
    {
        $file = new Model_Entity_File();

        $file->content_id = $contentId;
        $file->name = $name;
        $file->size = $size;
        $file->mime = $mime;
        $file->save();
        
        unset($file);

        return true;
    }
    public static function delPhysicalFile($type, $id)
    {

        $fileL = Doctrine_Query::create()
                ->select('file.name')
                ->from('Model_Entity_File file')
                ->setHydrationMode(Doctrine::HYDRATE_ARRAY);
        if ($type === 'Content') {
            $fileL->where('file.content_id = ?', $id);
        } else {
            $fileL->where('file.id = ?', $id);
        }
        $fileList = $fileL->execute();
        
        $relativePath = WEB_PATH.DIRECTORY_SEPARATOR.'uploads'.DIRECTORY_SEPARATOR;
        $retVal = true;
        foreach ($fileList as $file) {
            if (file_exists($relativePath.$file['name'])) {
                if (FALSE === unlink($relativePath.$file['name'])) {
                    $retVal = false;
                    break;
                }
            }
        }
        return $retVal;
    }

    public static function del($fileId)
    {
        if (self::delPhysicalFile('File',$fileId)) {
            Doctrine_Manager::connection()->beginTransaction();
            try {
                    Doctrine_Query::create()
                        ->delete('Model_Entity_File file')
                        ->Where('file.id = ?',$fileId)
                        ->execute();

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

    public static function delAllByContent($contentId)
    {
        if (self::delPhysicalFile('Content',$contentId)) {
            Doctrine_Manager::connection()->beginTransaction();
            try {
                    Doctrine_Query::create()
                        ->delete('Model_Entity_File file')
                        ->Where('file.content_id = ?',$contentId)
                        ->execute();

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

}
