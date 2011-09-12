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

        $response->setSuccess(true)->addData($fileList);

        $response->getResponse();
    }

    public function postAction()
    {
        $response = $this->_helper->response();
        $relativePath = WEB_PATH.DIRECTORY_SEPARATOR.'uploads'.DIRECTORY_SEPARATOR;
        //die($relativePath);

        /*$forwardSlashPos = strrpos(__FILE__, '/');
        $backSlashPos = strrpos(__FILE__, '\\');
        if($forwardSlashPos){
            $save_path = substr(__FILE__, 0, $forwardSlashPos).'/'.$relativePath.'/';
        }else{
            $save_path = substr(__FILE__, 0, $backSlashPos).'\\'.$relativePath.'\\';
        }

        die($save_path);*/

        //$save_path = $_SERVER['DOCUMENT_ROOT'].'/awesomeuploadertest/testuploads/';

        $valid_chars_regex = '.A-Z0-9_ !@#$%^&()+={}\[\]\',~`-';	// Characters allowed in the file name (in a Regular Expression format)
        //$extension_whitelist = array('csv', 'gif', 'png','tif');	// Allowed file extensions
        $MAX_FILENAME_LENGTH = 260;

        //Header 'X-File-Name' has the dashes converted to underscores by PHP:
        if(!isset($_SERVER['HTTP_X_FILE_NAME']) ){
            HandleError($response,'Missing file name!');
        }

        $file_name = preg_replace('/[^'.$valid_chars_regex.']|\.+$/i', '', $_SERVER['HTTP_X_FILE_NAME']);
        if (strlen($file_name) == 0 || strlen($file_name) > $MAX_FILENAME_LENGTH) {
            HandleError($response,'Invalid file name');
        }

        if(file_exists($relativePath. $file_name) ){
            HandleError($response,'A file with this name already exists');
        }

        //echo 'Reading php://input stream...<BR>Writing to file: '.$uploadPath.$fileName.'<BR>';
        /*
        // Validate file extension
            $path_info = pathinfo($file_name);
            $file_extension = $path_info["extension"];
            $is_valid_extension = false;
            foreach ($extension_whitelist as $extension) {
                if (strcasecmp($file_extension, $extension) == 0) {
                    $is_valid_extension = true;
                    break;
                }
            }
            if (!$is_valid_extension) {
                HandleError("Invalid file extension");
                exit(0);
            }
        */

        $file = file_get_contents('php://input');
        if(FALSE === file_put_contents($relativePath.$file_name, $file) ){
            //die('{"success":false,"error":"Error saving file. Check that directory exists and permissions are set properly"}');
            HandleError($response,'Error saving file. Check that directory exists and permissions are set properly"');
        } else {
            $response->setSuccess(true);
            $response->getResponse();
        }


        function HandleError($response, $message){
            $response->setSuccess(false);
            $response->getResponse();
        }

    }
}
