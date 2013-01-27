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
class Jasius_FileController extends Kebab_Rest_Controller
{
    public function indexAction()
    {
        $param = $this->_helper->param();
        $response = $this->_helper->response();
        $contentId = $param['contentId'];

        $fileList = Jasius_Model_File::getList($contentId);

        $response->setSuccess(true)->addData($fileList)->getResponse();
    }

    public function deleteAction()
    {
        $param = $this->_helper->param();
        $response = $this->_helper->response();

        $retData = array_key_exists('contentId', $param)
                 ? Jasius_Model_File::delAllByContent($param['contentId'])
                 : Jasius_Model_File::del($param['fileId']);

        $response->setSuccess($retData)->getResponse();
    }

    public function postAction()
    {
        $response = $this->_helper->response();
        $errors = array();

        //KBBTODO move this to config file this is hardcoded :S
        $relativePath = WEB_PATH.DIRECTORY_SEPARATOR.'uploads'.DIRECTORY_SEPARATOR;

        $valid_chars_regex = '.A-Z0-9_ !@#$%^&()+={}\[\]\',~`-';

        //Characters allowed in the file name (in a Regular Expression format)
        //Header 'X-File-Name' has the dashes converted to underscores by PHP:
        if (!isset($_SERVER['HTTP_X_FILE_NAME'])) { // Drag & drop upload with ajax upload
            $serverFileName = $this->_request->getParam('Filename');
            $contentId = $this->_request->getParam('contentId');
        } else { // Standart post upload (select files)
            $serverFileName = $_SERVER['HTTP_X_FILE_NAME'];
            $contentId = $_SERVER['HTTP_EXTRAPOSTDATA_CONTENTID'];
        }

        $path_info = pathinfo(preg_replace('/[^'.$valid_chars_regex.']|\.+$/i', '', strtolower($serverFileName)));
        $file_name = 'File_Cnt_'.$contentId.'_'.microtime();

        if (!array_key_exists('extension',$path_info)) {
             $errors['extensionNotExist'] = 'File has not extension';
        } else {
            $file_name = $file_name.'.'.$path_info['extension'];
        }

        $file_name = strtolower(str_replace(' ','',$file_name));

        if (file_exists($relativePath. $file_name)) {
            $errors['fileExist'] = 'A file with this name already exists';
        }

        if (count($errors) > 0) {
            $response->setErrors($errors)->getResponse();
        } else {
            $file = file_get_contents('php://input');
            if(FALSE === file_put_contents($relativePath.$file_name, $file) ){
                $errors['permissionOrDirectoryNotExist'] = 'Error saving file. Check that directory exists and permissions are set properly';
                $response->setErrors($errors)->getResponse();
            } else {
                $size = filesize($relativePath.$file_name);
                $mime = '';
                if (array_key_exists('extension',$path_info)) {
                    $mime = Jasius_Model_File::getMimeType($path_info['extension']);
                }
                $retData = Jasius_Model_File::add($contentId,$file_name, $size , $mime);
                $file = array(
                    'id' => $retData,
                    'name' => $file_name,
                    'size' => $size,
                    'mime' => $mime
                );
                $response->setSuccess(true)->addData($file)->getResponse();
            }
        }
    }
}
