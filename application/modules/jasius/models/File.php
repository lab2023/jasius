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
                    ->select('file.name, file.size, file.mime, "Completed" as status, 100 as progress')
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
        
        $statement = Doctrine_Manager::getInstance()->connection();
        $result = $statement->execute("SELECT LAST_INSERT_ID()")->fetchColumn(0);
        return $result;
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
        $retVal = false;
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
        $retVal = false;
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

    public static function getMimeType($extension)
    {
        $mimeTypes = self::getMimeTypes();
        return $mimeTypes[$extension];
    }

    public static function getMimeTypes() {

        $mimeTypes = array();

        $mimeTypes['3dm'] = 'x-world/x-3dmf';
        $mimeTypes['3dmf'] = 'x-world/x-3dmf';
        $mimeTypes['a'] = 'application/octet-stream';
        $mimeTypes['aab'] = 'application/x-authorware-bin';
        $mimeTypes['aam'] = 'application/x-authorware-map';
        $mimeTypes['aas'] = 'application/x-authorware-seg';
        $mimeTypes['abc'] = 'text/vnd.abc';
        $mimeTypes['acgi'] = 'text/html';
        $mimeTypes['afl'] = 'video/animaflex';
        $mimeTypes['ai'] = 'application/postscript';
        $mimeTypes['aif'] = 'audio/x-aiff';
        $mimeTypes['aifc'] = 'audio/x-aiff';
        $mimeTypes['aiff'] = 'audio/x-aiff';
        $mimeTypes['aim'] = 'application/x-aim';
        $mimeTypes['aip'] = 'text/x-audiosoft-intra';
        $mimeTypes['ani'] = 'application/x-navi-animation';
        $mimeTypes['aos'] = 'application/x-nokia-9000-communicator-add-on-software';
        $mimeTypes['aps'] = 'application/mime';
        $mimeTypes['arc'] = 'application/octet-stream';
        $mimeTypes['arj'] = 'application/arj';
        $mimeTypes['art'] = 'image/x-jg';
        $mimeTypes['asf'] = 'video/x-ms-asf';
        $mimeTypes['asm'] = 'text/x-asm';
        $mimeTypes['asp'] = 'text/asp';
        $mimeTypes['asx'] = 'video/x-ms-asf';
        $mimeTypes['au'] = 'audio/x-au';
        $mimeTypes['avi'] = 'video/x-msvideo';
        $mimeTypes['avs'] = 'video/avs-video';
        $mimeTypes['bcpio'] = 'application/x-bcpio';
        $mimeTypes['bin'] = 'application/x-binary';
        $mimeTypes['bm'] = 'image/bmp';
        $mimeTypes['bmp'] = 'image/bmp';
        $mimeTypes['boo'] = 'application/book';
        $mimeTypes['book'] = 'application/book';
        $mimeTypes['boz'] = 'application/x-bzip2';
        $mimeTypes['bsh'] = 'application/x-bsh';
        $mimeTypes['bz'] = 'application/x-bzip';
        $mimeTypes['bz2'] = 'application/x-bzip2';
        $mimeTypes['c'] = 'text/x-c';
        $mimeTypes['c++'] = 'text/plain';
        $mimeTypes['cat'] = 'application/vnd.ms-pki.seccat';
        $mimeTypes['cc'] = 'text/x-c';
        $mimeTypes['ccad'] = 'application/clariscad';
        $mimeTypes['cco'] = 'application/x-cocoa';
        $mimeTypes['cdf'] = 'application/x-netcdf';
        $mimeTypes['cer'] = 'application//x-x509-ca-cert';
        $mimeTypes['cha'] = 'application/x-chat';
        $mimeTypes['chat'] = 'application/x-chat';
        $mimeTypes['class'] = 'application/java';
        $mimeTypes['com'] = 'application/octet-stream';
        $mimeTypes['conf'] = 'text/plain';
        $mimeTypes['cpio'] = 'application/x-cpio';
        $mimeTypes['cpp'] = 'text/x-c';
        $mimeTypes['cpt'] = 'application/x-cpt';
        $mimeTypes['crl'] = 'application/pkix-crl';
        $mimeTypes['crt'] = 'application/pkix-cert';
        $mimeTypes['crt'] = 'application/x-x509-ca-cert';
        $mimeTypes['csh'] = 'text/x-script.csh';
        $mimeTypes['css'] = 'text/css';
        $mimeTypes['cxx'] = 'text/plain';
        $mimeTypes['dcr'] = 'application/x-director';
        $mimeTypes['deepv'] = 'application/x-deepv';
        $mimeTypes['def'] = 'text/plain';
        $mimeTypes['der'] = 'application/x-x509-ca-cert';
        $mimeTypes['dif'] = 'video/x-dv';
        $mimeTypes['dir'] = 'application/x-director';
        $mimeTypes['dl'] = 'video/dl';
        $mimeTypes['doc'] = 'application/msword';
        $mimeTypes['dot'] = 'application/msword';
        $mimeTypes['dp'] = 'application/commonground';
        $mimeTypes['drw'] = 'application/drafting';
        $mimeTypes['dump'] = 'application/octet-stream';
        $mimeTypes['dv'] = 'video/x-dv';
        $mimeTypes['dvi'] = 'application/x-dvi';
        $mimeTypes['dwf'] = 'model/vnd.dwf';
        $mimeTypes['dwg'] = 'application/acad';
        $mimeTypes['dxf'] = 'application/dxf';
        $mimeTypes['dxr'] = 'application/x-director';
        $mimeTypes['el'] = 'text/x-script.elisp';
        $mimeTypes['elc'] = 'application/x-elc';
        $mimeTypes['env'] = 'application/x-envoy';
        $mimeTypes['eps'] = 'application/postscript';
        $mimeTypes['es'] = 'application/x-esrehber';
        $mimeTypes['etx'] = 'text/x-setext';
        $mimeTypes['evy'] = 'application/x-envoy';
        $mimeTypes['exe'] = 'application/octet-stream';
        $mimeTypes['f'] = 'text/x-fortran';
        $mimeTypes['f77'] = 'text/x-fortran';
        $mimeTypes['f90'] = 'text/x-fortran';
        $mimeTypes['fdf'] = 'application/vnd.fdf';
        $mimeTypes['fif'] = 'image/fif';
        $mimeTypes['fli'] = 'video/x-fli';
        $mimeTypes['flo'] = 'image/florian';
        $mimeTypes['flx'] = 'text/vnd.fmi.flexstor';
        $mimeTypes['fmf'] = 'video/x-atomic3d-feature';
        $mimeTypes['for'] = 'text/x-fortran';
        $mimeTypes['fpx'] = 'image/vnd.net-fpx';
        $mimeTypes['frl'] = 'application/freeloader';
        $mimeTypes['funk'] = 'audio/make';
        $mimeTypes['g'] = 'text/plain';
        $mimeTypes['g3'] = 'image/g3fax';
        $mimeTypes['gif'] = 'image/gif';
        $mimeTypes['gl'] = 'video/x-gl';
        $mimeTypes['gsd'] = 'audio/x-gsm';
        $mimeTypes['gsm'] = 'audio/x-gsm';
        $mimeTypes['gsp'] = 'application/x-gsp';
        $mimeTypes['gss'] = 'application/x-gss';
        $mimeTypes['gtar'] = 'application/x-gtar';
        $mimeTypes['gz'] = 'application/x-gzip';
        $mimeTypes['gzip'] = 'multipart/x-gzip';
        $mimeTypes['h'] = 'text/x-h';
        $mimeTypes['hdf'] = 'application/x-hdf';
        $mimeTypes['help'] = 'application/x-helpfile';
        $mimeTypes['hgl'] = 'application/vnd.hp-hpgl';
        $mimeTypes['hh'] = 'text/x-h';
        $mimeTypes['hlb'] = 'text/x-script';
        $mimeTypes['hlp'] = 'application/x-helpfile';
        $mimeTypes['hpg'] = 'application/vnd.hp-hpgl';
        $mimeTypes['hpgl'] = 'application/vnd.hp-hpgl';
        $mimeTypes['hqx'] = 'application/binhex';
        $mimeTypes['hta'] = 'application/hta';
        $mimeTypes['htc'] = 'text/x-component';
        $mimeTypes['htm'] = 'text/html';
        $mimeTypes['html'] = 'text/html';
        $mimeTypes['htmls'] = 'text/html';
        $mimeTypes['htt'] = 'text/webviewhtml';
        $mimeTypes['htx'] = 'text/html';
        $mimeTypes['ice'] = 'x-conference/x-cooltalk';
        $mimeTypes['ico'] = 'image/x-icon';
        $mimeTypes['idc'] = 'text/plain';
        $mimeTypes['ief'] = 'image/ief';
        $mimeTypes['iefs'] = 'image/ief';
        $mimeTypes['iges'] = 'model/iges';
        $mimeTypes['igs'] = 'model/iges';
        $mimeTypes['ima'] = 'application/x-ima';
        $mimeTypes['imap'] = 'application/x-httpd-imap';
        $mimeTypes['inf'] = 'application/inf';
        $mimeTypes['ins'] = 'application/x-internett-signup';
        $mimeTypes['ip'] = 'application/x-ip2';
        $mimeTypes['isu'] = 'video/x-isvideo';
        $mimeTypes['it'] = 'audio/it';
        $mimeTypes['iv'] = 'application/x-inventor';
        $mimeTypes['ivr'] = 'i-world/i-vrml';
        $mimeTypes['ivy'] = 'application/x-livescreen';
        $mimeTypes['jam'] = 'audio/x-jam';
        $mimeTypes['jav'] = 'text/x-java-source';
        $mimeTypes['java'] = 'text/x-java-source';
        $mimeTypes['jcm'] = 'application/x-java-commerce';
        $mimeTypes['jfif'] = 'image/pjpeg';
        $mimeTypes['jfif-tbnl'] = 'image/jpeg';
        $mimeTypes['jpe'] = 'image/jpeg';
        $mimeTypes['jpeg'] = 'image/jpeg';
        $mimeTypes['jpg'] = 'image/jpeg';
        $mimeTypes['jps'] = 'image/x-jps';
        $mimeTypes['js'] = 'application/x-javascript';
        $mimeTypes['jut'] = 'image/jutvision';
        $mimeTypes['kar'] = 'music/x-karaoke';
        $mimeTypes['ksh'] = 'text/x-script.ksh';
        $mimeTypes['la'] = 'audio/x-nspaudio';
        $mimeTypes['lam'] = 'audio/x-liveaudio';
        $mimeTypes['latex'] = 'application/x-latex';
        $mimeTypes['lha'] = 'application/octet-stream';
        $mimeTypes['lhx'] = 'application/octet-stream';
        $mimeTypes['list'] = 'text/plain';
        $mimeTypes['lma'] = 'audio/x-nspaudio';
        $mimeTypes['log'] = 'text/plain';
        $mimeTypes['lsp'] = 'text/x-script.lisp';
        $mimeTypes['lst'] = 'text/plain';
        $mimeTypes['lsx'] = 'text/x-la-asf';
        $mimeTypes['ltx'] = 'application/x-latex';
        $mimeTypes['lzh'] = 'application/octet-stream';
        $mimeTypes['lzx'] = 'application/octet-stream';
        $mimeTypes['m'] = 'text/plain';
        $mimeTypes['m1v'] = 'video/mpeg';
        $mimeTypes['m2a'] = 'audio/mpeg';
        $mimeTypes['m2v'] = 'video/mpeg';
        $mimeTypes['m3u'] = 'audio/x-mpequrl';
        $mimeTypes['man'] = 'application/x-troff-man';
        $mimeTypes['map'] = 'application/x-navimap';
        $mimeTypes['mar'] = 'text/plain';
        $mimeTypes['mbd'] = 'application/mbedlet';
        $mimeTypes['mc$'] = 'application/x-magic-cap-package-1.0';
        $mimeTypes['mcd'] = 'application/x-mathcad';
        $mimeTypes['mcf'] = 'image/vasa';
        $mimeTypes['mcp'] = 'application/netmc';
        $mimeTypes['me'] = 'application/x-troff-me';
        $mimeTypes['mht'] = 'message/rfc822';
        $mimeTypes['mhtml'] = 'message/rfc822';
        $mimeTypes['mid'] = 'x-music/x-midi';
        $mimeTypes['midi'] = 'audio/midi';
        $mimeTypes['mif'] = 'application/x-mif';
        $mimeTypes['mime'] = 'www/mime';
        $mimeTypes['mjf'] = 'audio/x-vnd.audioexplosion.mjuicemediafile';
        $mimeTypes['mjpg'] = 'video/x-motion-jpeg';
        $mimeTypes['mm'] = 'application/base64';
        $mimeTypes['mm']  = 'application/x-meme';
        $mimeTypes['mme'] = 'application/base64';
        $mimeTypes['mod'] = 'audio/x-mod';
        $mimeTypes['moov'] = 'video/quicktime';
        $mimeTypes['mov'] = 'video/quicktime';
        $mimeTypes['movie'] = 'video/x-sgi-movie';
        $mimeTypes['mp2'] = 'audio/mpeg';
        $mimeTypes['mp3'] = 'audio/mpeg3';
        $mimeTypes['mpa'] = 'audio/mpeg';
        $mimeTypes['mpc'] = 'application/x-project';
        $mimeTypes['mpe'] = 'video/mpeg';
        $mimeTypes['mpeg'] = 'video/mpeg';
        $mimeTypes['mpg'] = 'audio/mpeg';
        $mimeTypes['mpga'] = 'audio/mpeg';
        $mimeTypes['mpp'] = 'application/vnd.ms-project';
        $mimeTypes['mpt'] = 'application/x-project';
        $mimeTypes['mpv'] = 'application/x-project';
        $mimeTypes['mpx'] = 'application/x-project';
        $mimeTypes['mrc'] = 'application/marc';
        $mimeTypes['ms'] = 'application/x-troff-ms';
        $mimeTypes['mv'] = 'video/x-sgi-movie';
        $mimeTypes['my'] = 'audio/make';
        $mimeTypes['mzz'] = 'application/x-vnd.audioexplosion.mzz';
        $mimeTypes['nap'] = 'image/naplps';
        $mimeTypes['naplps'] = 'image/naplps';
        $mimeTypes['nc'] = 'application/x-netcdf';
        $mimeTypes['ncm'] = 'application/vnd.nokia.configuration-message';
        $mimeTypes['nif'] = 'image/x-niff';
        $mimeTypes['niff'] = 'image/x-niff';
        $mimeTypes['nix'] = 'application/x-mix-transfer';
        $mimeTypes['nsc'] = 'application/x-conference';
        $mimeTypes['nvd'] = 'application/x-navidoc';
        $mimeTypes['o'] = 'application/octet-stream';
        $mimeTypes['oda'] = 'application/oda';
        $mimeTypes['omc'] = 'application/x-omc';
        $mimeTypes['omcd'] = 'application/x-omcdatamaker';
        $mimeTypes['omcr'] = 'application/x-omcregerator';
        $mimeTypes['p'] = 'text/x-pascal';
        $mimeTypes['p10'] = 'application/pkcs10';
        $mimeTypes['p12'] = 'application/pkcs-12';
        $mimeTypes['p7a'] = 'application/x-pkcs7-signature';
        $mimeTypes['p7c'] = 'application/pkcs7-mime';
        $mimeTypes['p7m'] = 'application/pkcs7-mime';
        $mimeTypes['p7r'] = 'application/x-pkcs7-certreqresp';
        $mimeTypes['p7s'] = 'application/pkcs7-signature';
        $mimeTypes['part'] = 'application/pro_eng';
        $mimeTypes['pas'] = 'text/pascal';
        $mimeTypes['pbm'] = 'image/x-portable-bitmap';
        $mimeTypes['pcl'] = 'application/x-pcl';
        $mimeTypes['pct'] = 'image/x-pict';
        $mimeTypes['pcx'] = 'image/x-pcx';
        $mimeTypes['pdb'] = 'chemical/x-pdb';
        $mimeTypes['pdf'] = 'application/pdf';
        $mimeTypes['pfunk'] = 'audio/make';
        $mimeTypes['pgm'] = 'image/x-portable-graymap';
        $mimeTypes['pic'] = 'image/pict';
        $mimeTypes['pict'] = 'image/pict';
        $mimeTypes['pkg'] = 'application/x-newton-compatible-pkg';
        $mimeTypes['pko'] = 'application/vnd.ms-pki.pko';
        $mimeTypes['pl'] = 'text/x-script.perl';
        $mimeTypes['plx'] = 'application/x-pixclscript';
        $mimeTypes['pm'] = 'text/x-script.perl-module';
        $mimeTypes['pm4'] = 'application/x-pagemaker';
        $mimeTypes['pm5'] = 'application/x-pagemaker';
        $mimeTypes['png'] = 'image/png';
        $mimeTypes['pnm'] = 'image/x-portable-anymap';
        $mimeTypes['pot'] = 'application/mspowerpoint';
        $mimeTypes['pov'] = 'model/x-pov';
        $mimeTypes['ppa'] = 'application/vnd.ms-powerpoint';
        $mimeTypes['ppm'] = 'image/x-portable-pixmap';
        $mimeTypes['pps'] = 'application/mspowerpoint';
        $mimeTypes['ppt'] = 'application/mspowerpoint';
        $mimeTypes['ppz'] = 'application/mspowerpoint';
        $mimeTypes['pre'] = 'application/x-freelance';
        $mimeTypes['prt'] = 'application/pro_eng';
        $mimeTypes['ps'] = 'application/postscript';
        $mimeTypes['psd'] = 'application/octet-stream';
        $mimeTypes['pvu'] = 'paleovu/x-pv';
        $mimeTypes['pwz'] = 'application/vnd.ms-powerpoint';
        $mimeTypes['py'] = 'text/x-script.phyton';
        $mimeTypes['pyc'] = 'applicaiton/x-bytecode.python';
        $mimeTypes['qcp'] = 'audio/vnd.qcelp';
        $mimeTypes['qd3'] = 'x-world/x-3dmf';
        $mimeTypes['qd3d'] = 'x-world/x-3dmf';
        $mimeTypes['qif'] = 'image/x-quicktime';
        $mimeTypes['qt'] = 'video/quicktime';
        $mimeTypes['qtc'] = 'video/x-qtc';
        $mimeTypes['qti'] = 'image/x-quicktime';
        $mimeTypes['qtif'] = 'image/x-quicktime';
        $mimeTypes['ra'] = 'audio/x-pn-realaudio';
        $mimeTypes['rar'] = 'application/x-rar';
        $mimeTypes['ram'] = 'audio/x-pn-realaudio';
        $mimeTypes['ras'] = 'image/cmu-raster';
        $mimeTypes['rast'] = 'image/cmu-raster';
        $mimeTypes['rexx'] = 'text/x-script.rexx';
        $mimeTypes['rf'] = 'image/vnd.rn-realflash';
        $mimeTypes['rgb'] = 'image/x-rgb';
        $mimeTypes['rm'] = 'audio/x-pn-realaudio';
        $mimeTypes['rmi'] = 'audio/mid';
        $mimeTypes['rmm'] = 'audio/x-pn-realaudio';
        $mimeTypes['rmp'] = 'audio/x-pn-realaudio';
        $mimeTypes['rng'] = 'application/ringing-tones';
        $mimeTypes['rnx'] = 'application/vnd.rn-realplayer';
        $mimeTypes['roff'] = 'application/x-troff';
        $mimeTypes['rp'] = 'image/vnd.rn-realpix';
        $mimeTypes['rpm'] = 'audio/x-pn-realaudio-plugin';
        $mimeTypes['rt'] = 'text/richtext';
        $mimeTypes['rtf'] = 'application/rtf';
        $mimeTypes['rtx'] = 'application/rtf';
        $mimeTypes['rv'] = 'video/vnd.rn-realvideo';
        $mimeTypes['s'] = 'text/x-asm';
        $mimeTypes['s3m'] = 'audio/s3m';
        $mimeTypes['saveme'] = 'application/octet-stream';
        $mimeTypes['sbk'] = 'application/x-tbook';
        $mimeTypes['scm'] = 'application/x-lotusscreencam';
        $mimeTypes['sdml'] = 'text/plain';
        $mimeTypes['sdp'] = 'application/sdp';
        $mimeTypes['sdr'] = 'application/sounder';
        $mimeTypes['sea'] = 'application/sea';
        $mimeTypes['set'] = 'application/set';
        $mimeTypes['sgm'] = 'text/sgml';
        $mimeTypes['sgml'] = 'text/sgml';
        $mimeTypes['sh'] = 'application/x-bsh';
        $mimeTypes['shar'] = 'application/x-bsh';
        $mimeTypes['shtml'] = 'text/html';
        $mimeTypes['sid'] = 'audio/x-psid';
        $mimeTypes['sit'] = 'application/x-sit';
        $mimeTypes['skd'] = 'application/x-koan';
        $mimeTypes['skm'] = 'application/x-koan';
        $mimeTypes['skp'] = 'application/x-koan';
        $mimeTypes['skt'] = 'application/x-koan';
        $mimeTypes['sl'] = 'application/x-seelogo';
        $mimeTypes['smi'] = 'application/smil';
        $mimeTypes['smil'] = 'application/smil';
        $mimeTypes['snd'] = 'audio/basic';
        $mimeTypes['sol'] = 'application/solids';
        $mimeTypes['spc'] = 'text/x-speech';
        $mimeTypes['spl'] = 'application/futuresplash';
        $mimeTypes['spr'] = 'application/x-sprite';
        $mimeTypes['sprite'] = 'application/x-sprite';
        $mimeTypes['src'] = 'application/x-wais-source';
        $mimeTypes['ssi'] = 'text/x-server-parsed-html';
        $mimeTypes['ssm'] = 'application/streamingmedia';
        $mimeTypes['sst'] = 'application/vnd.ms-pki.certstore';
        $mimeTypes['step'] = 'application/step';
        $mimeTypes['stl'] = 'application/sla';
        $mimeTypes['stl'] = 'application/x-navistyle';
        $mimeTypes['stp'] = 'application/step';
        $mimeTypes['sv4cpio'] = 'application/x-sv4cpio';
        $mimeTypes['sv4crc'] = 'application/x-sv4crc';
        $mimeTypes['svf'] = 'image/x-dwg';
        $mimeTypes['svr'] = 'application/x-world';
        $mimeTypes['swf'] = 'application/x-shockwave-flash';
        $mimeTypes['t'] = 'application/x-troff';
        $mimeTypes['talk'] = 'text/x-speech';
        $mimeTypes['tar'] = 'application/x-tar';
        $mimeTypes['tbk'] = 'application/toolbook';
        $mimeTypes['tcl'] = 'application/x-tcl';
        $mimeTypes['tcsh'] = 'text/x-script.tcsh';
        $mimeTypes['tex'] = 'application/x-tex';
        $mimeTypes['texi'] = 'application/x-texinfo';
        $mimeTypes['texinfo'] = 'application/x-texinfo';
        $mimeTypes['text'] = 'text/plain';
        $mimeTypes['tgz'] = 'application/gnutar';
        $mimeTypes['tgz'] = 'application/x-compressed';
        $mimeTypes['tif'] = 'image/tiff';
        $mimeTypes['tiff'] = 'image/tiff';
        $mimeTypes['tr'] = 'application/x-troff';
        $mimeTypes['tsi'] = 'audio/tsp-audio';
        $mimeTypes['tsp'] = 'application/dsptype';
        $mimeTypes['tsv'] = 'text/tab-separated-values';
        $mimeTypes['turbot'] = 'image/florian';
        $mimeTypes['txt'] = 'text/plain';
        $mimeTypes['uil'] = 'text/x-uil';
        $mimeTypes['uni'] = 'text/uri-list';
        $mimeTypes['unis'] = 'text/uri-list';
        $mimeTypes['unv'] = 'application/i-deas';
        $mimeTypes['uri'] = 'text/uri-list';
        $mimeTypes['uris'] = 'text/uri-list';
        $mimeTypes['ustar'] = 'application/x-ustar';
        $mimeTypes['ustar'] = 'multipart/x-ustar';
        $mimeTypes['uu'] = 'text/x-uuencode';
        $mimeTypes['uue'] = 'text/x-uuencode';
        $mimeTypes['vcd'] = 'application/x-cdlink';
        $mimeTypes['vcs'] = 'text/x-vcalendar';
        $mimeTypes['vda'] = 'application/vda';
        $mimeTypes['vdo'] = 'video/vdo';
        $mimeTypes['vew'] = 'application/groupwise';
        $mimeTypes['viv'] = 'video/vivo';
        $mimeTypes['vivo'] = 'video/vivo';
        $mimeTypes['vmd'] = 'application/vocaltec-media-desc';
        $mimeTypes['vmf'] = 'application/vocaltec-media-file';
        $mimeTypes['voc'] = 'audio/voc';
        $mimeTypes['vos'] = 'video/vosaic';
        $mimeTypes['vox'] = 'audio/voxware';
        $mimeTypes['vqe'] = 'audio/x-twinvq-plugin';
        $mimeTypes['vqf'] = 'audio/x-twinvq';
        $mimeTypes['vql'] = 'audio/x-twinvq-plugin';
        $mimeTypes['vrml'] = 'application/x-vrml';
        $mimeTypes['vrt'] = 'x-world/x-vrt';
        $mimeTypes['vsd'] = 'application/x-visio';
        $mimeTypes['vst'] = 'application/x-visio';
        $mimeTypes['vsw'] = 'application/x-visio';
        $mimeTypes['w60'] = 'application/wordperfect6.0';
        $mimeTypes['w61'] = 'application/wordperfect6.1';
        $mimeTypes['w6w'] = 'application/msword';
        $mimeTypes['wav'] = 'audio/wav';
        $mimeTypes['wb1'] = 'application/x-qpro';
        $mimeTypes['wbmp'] = 'image/vnd.wap.wbmp';
        $mimeTypes['web'] = 'application/vnd.xara';
        $mimeTypes['wiz'] = 'application/msword';
        $mimeTypes['wk1'] = 'application/x-123';
        $mimeTypes['wmf'] = 'windows/metafile';
        $mimeTypes['wml'] = 'text/vnd.wap.wml';
        $mimeTypes['wmlc'] = 'application/vnd.wap.wmlc';
        $mimeTypes['wmls'] = 'text/vnd.wap.wmlscript';
        $mimeTypes['wmlsc'] = 'application/vnd.wap.wmlscriptc';
        $mimeTypes['word'] = 'application/msword';
        $mimeTypes['wp'] = 'application/wordperfect';
        $mimeTypes['wp5'] = 'application/wordperfect';
        $mimeTypes['wp6'] = 'application/wordperfect';
        $mimeTypes['wpd'] = 'application/wordperfect';
        $mimeTypes['wq1'] = 'application/x-lotus';
        $mimeTypes['wri'] = 'application/mswrite';
        $mimeTypes['wrl'] = 'application/x-world';
        $mimeTypes['wrl'] = 'x-world/x-vrml';
        $mimeTypes['wrz'] = 'x-world/x-vrml';
        $mimeTypes['wsc'] = 'text/scriplet';
        $mimeTypes['wsrc'] = 'application/x-wais-source';
        $mimeTypes['wtk'] = 'application/x-wintalk';
        $mimeTypes['xbm'] = 'image/x-xbitmap';
        $mimeTypes['xdr'] = 'video/x-amt-demorun';
        $mimeTypes['xgz'] = 'xgl/drawing';
        $mimeTypes['xif'] = 'image/vnd.xiff';
        $mimeTypes['xl'] = 'application/excel';
        $mimeTypes['xla'] = 'application/excel';
        $mimeTypes['xla'] = 'application/x-msexcel';
        $mimeTypes['xlb'] = 'application/excel';
        $mimeTypes['xlb'] = 'application/x-excel';
        $mimeTypes['xlc'] = 'application/excel';
        $mimeTypes['xlc'] = 'application/x-excel';
        $mimeTypes['xld'] = 'application/excel';
        $mimeTypes['xlk'] = 'application/excel';
        $mimeTypes['xlk'] = 'application/x-excel';
        $mimeTypes['xll'] = 'application/excel';
        $mimeTypes['xll'] = 'application/x-excel';
        $mimeTypes['xlm'] = 'application/excel';
        $mimeTypes['xlm'] = 'application/x-excel';
        $mimeTypes['xls'] = 'application/excel';
        $mimeTypes['xls'] = 'application/x-msexcel';
        $mimeTypes['xlt'] = 'application/excel';
        $mimeTypes['xlv'] = 'application/excel';
        $mimeTypes['xlw'] = 'application/excel';
        $mimeTypes['xm'] = 'audio/xm';
        $mimeTypes['xml'] = 'application/xml';
        $mimeTypes['xmz'] = 'xgl/movie';
        $mimeTypes['xpix'] = 'application/x-vnd.ls-xpix';
        $mimeTypes['xpm'] = 'image/x-xpixmap';
        $mimeTypes['x-png'] = 'image/png';
        $mimeTypes['xsr'] = 'video/x-amt-showrun';
        $mimeTypes['xwd'] = 'image/x-xwd';
        $mimeTypes['xyz'] = 'chemical/x-pdb';
        $mimeTypes['z'] = 'application/x-compress';
        $mimeTypes['z'] = 'application/x-compressed';
        $mimeTypes['zip'] = 'application/zip';
        $mimeTypes['zoo'] = 'application/octet-stream';
        $mimeTypes['zsh'] = 'text/x-script.zsh';
        $mimeTypes['doc'] = 'application/msword';
        $mimeTypes['dot'] = 'application/msword';
        $mimeTypes['docx'] = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
        $mimeTypes['dotx'] = 'application/vnd.openxmlformats-officedocument.wordprocessingml.template';
        $mimeTypes['docm'] = 'application/vnd.ms-word.document.macroEnabled.12';
        $mimeTypes['dotm'] = 'application/vnd.ms-word.template.macroEnabled.12';
        $mimeTypes['xls'] = 'application/vnd.ms-excel';
        $mimeTypes['xlt'] = 'application/vnd.ms-excel';
        $mimeTypes['xla'] = 'application/vnd.ms-excel';
        $mimeTypes['xlsx'] = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
        $mimeTypes['xltx'] = 'application/vnd.openxmlformats-officedocument.spreadsheetml.template';
        $mimeTypes['xlsm'] = 'application/vnd.ms-excel.sheet.macroEnabled.12';
        $mimeTypes['xltm'] = 'application/vnd.ms-excel.template.macroEnabled.12';
        $mimeTypes['xlam'] = 'application/vnd.ms-excel.addin.macroEnabled.12';
        $mimeTypes['xlsb'] = 'application/vnd.ms-excel.sheet.binary.macroEnabled.12';
        $mimeTypes['ppt'] = 'application/vnd.ms-powerpoint';
        $mimeTypes['pot'] = 'application/vnd.ms-powerpoint';
        $mimeTypes['pps'] = 'application/vnd.ms-powerpoint';
        $mimeTypes['ppa'] = 'application/vnd.ms-powerpoint';
        $mimeTypes['pptx'] = 'application/vnd.openxmlformats-officedocument.presentationml.presentation';
        $mimeTypes['potx'] = 'application/vnd.openxmlformats-officedocument.presentationml.template';
        $mimeTypes['ppsx'] = 'application/vnd.openxmlformats-officedocument.presentationml.slideshow';
        $mimeTypes['ppam'] = 'application/vnd.ms-powerpoint.addin.macroEnabled.12';
        $mimeTypes['pptm'] = 'application/vnd.ms-powerpoint.presentation.macroEnabled.12';
        $mimeTypes['potm'] = 'application/vnd.ms-powerpoint.template.macroEnabled.12';
        $mimeTypes['ppsm'] = 'application/vnd.ms-powerpoint.slideshow.macroEnabled.12';

        return $mimeTypes;
    }

}
