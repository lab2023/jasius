-- phpMyAdmin SQL Dump
-- version 3.3.10deb1
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Sep 27, 2011 at 02:18 PM
-- Server version: 5.1.54
-- PHP Version: 5.3.5-1ubuntu7.2

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `jasius_production`
--

-- --------------------------------------------------------

--
-- Table structure for table `jasius_access`
--

CREATE TABLE IF NOT EXISTS `jasius_access` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `content_id` bigint(20) NOT NULL,
  `access` enum('all','user','specific') COLLATE utf8_bin NOT NULL,
  `allowuser` bigint(20) NOT NULL,
  `allowrole` bigint(20) NOT NULL,
  `deleted_at` datetime DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `created_by` bigint(20) NOT NULL,
  `updated_by` bigint(20) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `content_id_idx` (`content_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin AUTO_INCREMENT=1 ;

--
-- Dumping data for table `jasius_access`
--


-- --------------------------------------------------------

--
-- Table structure for table `jasius_content`
--

CREATE TABLE IF NOT EXISTS `jasius_content` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `type_id` bigint(20) NOT NULL,
  `deleted_at` datetime DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `created_by` bigint(20) NOT NULL,
  `updated_by` bigint(20) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `type_id_idx` (`type_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin AUTO_INCREMENT=1 ;

--
-- Dumping data for table `jasius_content`
--


-- --------------------------------------------------------

--
-- Table structure for table `jasius_data`
--

CREATE TABLE IF NOT EXISTS `jasius_data` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `property_id` bigint(20) NOT NULL,
  `content_id` bigint(20) NOT NULL,
  `decimalvalue` decimal(24,6) DEFAULT NULL,
  `floatvalue` decimal(24,6) DEFAULT NULL,
  `integervalue` bigint(20) DEFAULT NULL,
  `datevalue` date DEFAULT NULL,
  `stringvalue` text COLLATE utf8_bin,
  `timevalue` time DEFAULT NULL,
  `timestampvalue` datetime DEFAULT NULL,
  `booleanvalue` tinyint(1) DEFAULT NULL,
  `enumvalue` text COLLATE utf8_bin,
  `arrayvalue` text COLLATE utf8_bin,
  `objectvalue` longtext COLLATE utf8_bin,
  `blobvalue` longblob,
  `clobvalue` longtext COLLATE utf8_bin,
  `gzipvalue` text COLLATE utf8_bin,
  `deleted_at` datetime DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `created_by` bigint(20) NOT NULL,
  `updated_by` bigint(20) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `property_id_idx` (`property_id`),
  KEY `content_id_idx` (`content_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin AUTO_INCREMENT=1 ;

--
-- Dumping data for table `jasius_data`
--


-- --------------------------------------------------------

--
-- Table structure for table `jasius_data_search`
--

CREATE TABLE IF NOT EXISTS `jasius_data_search` (
  `keyword` varchar(200) COLLATE utf8_bin NOT NULL DEFAULT '',
  `field` varchar(50) COLLATE utf8_bin NOT NULL DEFAULT '',
  `position` bigint(20) NOT NULL DEFAULT '0',
  `id` bigint(20) NOT NULL DEFAULT '0',
  PRIMARY KEY (`keyword`,`field`,`position`,`id`),
  KEY `jasius_data_search_id_jasius_data_id` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- Dumping data for table `jasius_data_search`
--


-- --------------------------------------------------------

--
-- Table structure for table `jasius_file`
--

CREATE TABLE IF NOT EXISTS `jasius_file` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `content_id` bigint(20) NOT NULL,
  `name` varchar(80) COLLATE utf8_bin NOT NULL,
  `size` bigint(20) NOT NULL,
  `mime` varchar(50) COLLATE utf8_bin DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `created_by` bigint(20) NOT NULL,
  `updated_by` bigint(20) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `content_id_idx` (`content_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin AUTO_INCREMENT=1 ;

--
-- Dumping data for table `jasius_file`
--


-- --------------------------------------------------------

--
-- Table structure for table `jasius_property`
--

CREATE TABLE IF NOT EXISTS `jasius_property` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `type_id` bigint(20) DEFAULT NULL,
  `datatype` enum('string','clob','integer','decimal','enum','timestamp','time','date') COLLATE utf8_bin NOT NULL,
  `isunique` tinyint(4) NOT NULL,
  `isrequire` tinyint(4) NOT NULL,
  `defaultvalue` varchar(255) COLLATE utf8_bin DEFAULT NULL,
  `enum` longtext COLLATE utf8_bin,
  `weight` bigint(20) NOT NULL,
  `deleted_at` datetime DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `created_by` bigint(20) NOT NULL,
  `updated_by` bigint(20) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `type_id_idx` (`type_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_bin AUTO_INCREMENT=9 ;

--
-- Dumping data for table `jasius_property`
--

INSERT INTO `jasius_property` (`id`, `type_id`, `datatype`, `isunique`, `isrequire`, `defaultvalue`, `enum`, `weight`, `deleted_at`, `created_at`, `updated_at`, `created_by`, `updated_by`) VALUES
(1, 1, 'string', 0, 1, NULL, NULL, 1, NULL, '2011-09-27 14:18:00', '2011-09-27 14:18:00', 0, 0),
(2, 1, 'clob', 1, 1, NULL, NULL, 2, NULL, '2011-09-27 14:18:00', '2011-09-27 14:18:00', 0, 0),
(3, 1, 'integer', 1, 1, NULL, NULL, 3, NULL, '2011-09-27 14:18:00', '2011-09-27 14:18:00', 0, 0),
(4, 1, 'decimal', 0, 1, NULL, NULL, 4, NULL, '2011-09-27 14:18:00', '2011-09-27 14:18:00', 0, 0),
(5, 1, 'enum', 0, 0, NULL, 'a:3:{i:0;s:3:"php";i:1;s:4:"java";i:2;s:4:"ruby";}', 6, NULL, '2011-09-27 14:18:00', '2011-09-27 14:18:00', 0, 0),
(6, 1, 'date', 0, 1, NULL, NULL, 7, NULL, '2011-09-27 14:18:00', '2011-09-27 14:18:00', 0, 0),
(7, 1, 'time', 0, 1, NULL, NULL, 8, NULL, '2011-09-27 14:18:01', '2011-09-27 14:18:01', 0, 0),
(8, 1, 'timestamp', 0, 1, NULL, NULL, 9, NULL, '2011-09-27 14:18:01', '2011-09-27 14:18:01', 0, 0);

-- --------------------------------------------------------

--
-- Table structure for table `jasius_property_translation`
--

CREATE TABLE IF NOT EXISTS `jasius_property_translation` (
  `id` bigint(20) NOT NULL DEFAULT '0',
  `title` varchar(255) COLLATE utf8_bin NOT NULL,
  `lang` char(2) COLLATE utf8_bin NOT NULL DEFAULT '',
  PRIMARY KEY (`id`,`lang`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- Dumping data for table `jasius_property_translation`
--

INSERT INTO `jasius_property_translation` (`id`, `title`, `lang`) VALUES
(1, 'Text', 'en'),
(1, 'Metin', 'tr'),
(2, 'Paragraph', 'en'),
(2, 'Paragraf', 'tr'),
(3, 'Integer', 'en'),
(3, 'Tam', 'tr'),
(4, 'Decimal field', 'en'),
(4, 'Ondalık Sayı', 'tr'),
(5, 'Combobox', 'en'),
(5, 'Liste', 'tr'),
(6, 'Date', 'en'),
(6, 'Tarih', 'tr'),
(7, 'Time', 'en'),
(7, 'Zaman', 'tr'),
(8, 'Date &amp; Time', 'en'),
(8, 'Tarih &amp; Zaman', 'tr');

-- --------------------------------------------------------

--
-- Table structure for table `jasius_type`
--

CREATE TABLE IF NOT EXISTS `jasius_type` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `active` tinyint(1) NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `deleted_at` datetime DEFAULT NULL,
  `created_by` bigint(20) NOT NULL,
  `updated_by` bigint(20) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_bin AUTO_INCREMENT=2 ;

--
-- Dumping data for table `jasius_type`
--

INSERT INTO `jasius_type` (`id`, `active`, `created_at`, `updated_at`, `deleted_at`, `created_by`, `updated_by`) VALUES
(1, 1, '2011-09-27 14:18:00', '2011-09-27 14:18:00', NULL, 0, 0);

-- --------------------------------------------------------

--
-- Table structure for table `jasius_type_search`
--

CREATE TABLE IF NOT EXISTS `jasius_type_search` (
  `keyword` varchar(200) COLLATE utf8_bin NOT NULL DEFAULT '',
  `field` varchar(50) COLLATE utf8_bin NOT NULL DEFAULT '',
  `position` bigint(20) NOT NULL DEFAULT '0',
  `id` bigint(20) NOT NULL DEFAULT '0',
  `lang` char(2) COLLATE utf8_bin NOT NULL DEFAULT '',
  PRIMARY KEY (`keyword`,`field`,`position`,`id`,`lang`),
  KEY `jasius_type_search_id_jasius_type_translation_id` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- Dumping data for table `jasius_type_search`
--

INSERT INTO `jasius_type_search` (`keyword`, `field`, `position`, `id`, `lang`) VALUES
('test', 'title', 0, 1, 'en'),
('test', 'title', 0, 1, 'tr');

-- --------------------------------------------------------

--
-- Table structure for table `jasius_type_translation`
--

CREATE TABLE IF NOT EXISTS `jasius_type_translation` (
  `id` bigint(20) NOT NULL DEFAULT '0',
  `title` varchar(255) COLLATE utf8_bin NOT NULL,
  `lang` char(2) COLLATE utf8_bin NOT NULL DEFAULT '',
  PRIMARY KEY (`id`,`lang`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- Dumping data for table `jasius_type_translation`
--

INSERT INTO `jasius_type_translation` (`id`, `title`, `lang`) VALUES
(1, 'Test', 'en'),
(1, 'Test', 'tr');

-- --------------------------------------------------------

--
-- Table structure for table `system_action`
--

CREATE TABLE IF NOT EXISTS `system_action` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `controller_id` bigint(20) DEFAULT NULL,
  `name` varchar(255) COLLATE utf8_bin DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `controller_id_idx` (`controller_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_bin AUTO_INCREMENT=9 ;

--
-- Dumping data for table `system_action`
--

INSERT INTO `system_action` (`id`, `controller_id`, `name`) VALUES
(1, 5, 'delete'),
(2, 1, 'desktop'),
(3, 17, 'index'),
(4, 19, 'post'),
(5, 19, 'get'),
(6, 19, 'index'),
(7, 19, 'delete'),
(8, 19, 'put');

-- --------------------------------------------------------

--
-- Table structure for table `system_application`
--

CREATE TABLE IF NOT EXISTS `system_application` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `identity` varchar(255) COLLATE utf8_bin DEFAULT NULL,
  `classname` varchar(255) COLLATE utf8_bin DEFAULT NULL,
  `name` varchar(255) COLLATE utf8_bin DEFAULT NULL,
  `department` varchar(255) COLLATE utf8_bin DEFAULT NULL,
  `version` varchar(255) COLLATE utf8_bin DEFAULT NULL,
  `type` enum('application','system') COLLATE utf8_bin DEFAULT NULL,
  `active` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `identity` (`identity`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_bin AUTO_INCREMENT=9 ;

--
-- Dumping data for table `system_application`
--

INSERT INTO `system_application` (`id`, `identity`, `classname`, `name`, `department`, `version`, `type`, `active`) VALUES
(1, 'aboutMe-application', 'KebabOS.applications.aboutMe.application.Bootstrap', 'about-me', 'preferences', '0.0.1', 'system', 1),
(2, 'feedback-application', 'KebabOS.applications.feedback.application.Bootstrap', 'feedback', 'preferences', '0.0.1', 'system', 1),
(3, 'userManager-application', 'KebabOS.applications.userManager.application.Bootstrap', 'user-manager', 'administration', '0.0.1', 'system', 1),
(4, 'feedbackManager-application', 'KebabOS.applications.feedbackManager.application.Bootstrap', 'feedback-manager', 'administration', '0.0.1', 'system', 1),
(5, 'storyManager-application', 'KebabOS.applications.storyManager.application.Bootstrap', 'story-manager', 'administration', '0.0.1', 'system', 1),
(6, 'roleManager-application', 'KebabOS.applications.roleManager.application.Bootstrap', 'role-manager', 'administration', '0.0.1', 'system', 1),
(7, 'applicationManager-application', 'KebabOS.applications.applicationManager.application.Bootstrap', 'application-manager', 'administration', '0.0.1', 'system', 1),
(8, 'jasius-application', 'KebabOS.applications.jasius.application.Bootstrap', 'jasius', 'jasius', '0.0.1', 'application', 1);

-- --------------------------------------------------------

--
-- Table structure for table `system_application_search`
--

CREATE TABLE IF NOT EXISTS `system_application_search` (
  `keyword` varchar(200) COLLATE utf8_bin NOT NULL DEFAULT '',
  `field` varchar(50) COLLATE utf8_bin NOT NULL DEFAULT '',
  `position` bigint(20) NOT NULL DEFAULT '0',
  `id` bigint(20) NOT NULL DEFAULT '0',
  `lang` char(2) COLLATE utf8_bin NOT NULL DEFAULT '',
  PRIMARY KEY (`keyword`,`field`,`position`,`id`,`lang`),
  KEY `system_application_search_id_system_application_translation_id` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- Dumping data for table `system_application_search`
--

INSERT INTO `system_application_search` (`keyword`, `field`, `position`, `id`, `lang`) VALUES
('bilgilerim', 'title', 1, 1, 'tr'),
('bilgilerinizi', 'description', 1, 1, 'tr'),
('information', 'description', 3, 1, 'en'),
('kisisel', 'description', 0, 1, 'tr'),
('kisisel', 'title', 0, 1, 'tr'),
('personal', 'description', 2, 1, 'en'),
('yoenetin', 'description', 2, 1, 'tr'),
('bildirim', 'title', 1, 2, 'tr'),
('feedback', 'description', 1, 2, 'en'),
('feedback', 'title', 0, 2, 'en'),
('geri', 'title', 0, 2, 'tr'),
('geribildirim', 'description', 0, 2, 'tr'),
('goenderin', 'description', 1, 2, 'tr'),
('send', 'description', 0, 2, 'en'),
('add', 'description', 1, 3, 'en'),
('cikarin', 'description', 2, 3, 'tr'),
('duezenleyin', 'description', 3, 3, 'tr'),
('edit', 'description', 2, 3, 'en'),
('ekleyin', 'description', 1, 3, 'tr'),
('kullanici', 'description', 0, 3, 'tr'),
('kullanici', 'title', 0, 3, 'tr'),
('manager', 'title', 1, 3, 'en'),
('remove', 'description', 4, 3, 'en'),
('user', 'description', 0, 3, 'en'),
('user', 'title', 0, 3, 'en'),
('yoenetici', 'title', 1, 3, 'tr'),
('bildirim', 'description', 1, 4, 'tr'),
('bildirim', 'title', 1, 4, 'tr'),
('duezenleyin', 'description', 2, 4, 'tr'),
('edit', 'description', 1, 4, 'en'),
('feedback', 'description', 0, 4, 'en'),
('feedback', 'title', 0, 4, 'en'),
('geri', 'description', 0, 4, 'tr'),
('geri', 'title', 0, 4, 'tr'),
('manager', 'title', 1, 4, 'en'),
('yoeneticisi', 'title', 2, 4, 'tr'),
('duezenleyin', 'description', 2, 5, 'tr'),
('hikayeleri', 'title', 1, 5, 'tr'),
('hikayelerini', 'description', 1, 5, 'tr'),
('kullanici', 'description', 0, 5, 'tr'),
('kullanici', 'title', 0, 5, 'tr'),
('manage', 'description', 0, 5, 'en'),
('manager', 'title', 1, 5, 'en'),
('stories', 'description', 2, 5, 'en'),
('story', 'title', 0, 5, 'en'),
('yoeneticisi', 'title', 2, 5, 'tr'),
('manager', 'title', 1, 6, 'en'),
('managment', 'description', 1, 6, 'en'),
('rol', 'title', 0, 6, 'tr'),
('role', 'title', 0, 6, 'en'),
('roles', 'description', 0, 6, 'en'),
('rolleri', 'description', 0, 6, 'tr'),
('yoeneticisi', 'title', 1, 6, 'tr'),
('yoenetin', 'description', 1, 6, 'tr'),
('application', 'title', 0, 7, 'en'),
('applications', 'description', 2, 7, 'en'),
('kebab', 'description', 0, 7, 'tr'),
('kebab', 'description', 1, 7, 'en'),
('manage', 'description', 0, 7, 'en'),
('manager', 'title', 1, 7, 'en'),
('uygulama', 'title', 0, 7, 'tr'),
('uygulamalarini', 'description', 1, 7, 'tr'),
('yoeneticisi', 'title', 1, 7, 'tr'),
('yoenetin', 'description', 2, 7, 'tr'),
('bulut', 'description', 1, 8, 'tr'),
('cloud', 'description', 4, 8, 'en'),
('documents', 'description', 2, 8, 'en'),
('dokuemanlarinizi', 'description', 0, 8, 'tr'),
('jasius', 'title', 0, 8, 'en'),
('jasius', 'title', 0, 8, 'tr'),
('manage', 'description', 0, 8, 'en'),
('uezerinden', 'description', 2, 8, 'tr'),
('yoenetin', 'description', 3, 8, 'tr');

-- --------------------------------------------------------

--
-- Table structure for table `system_application_translation`
--

CREATE TABLE IF NOT EXISTS `system_application_translation` (
  `id` bigint(20) NOT NULL DEFAULT '0',
  `title` varchar(255) COLLATE utf8_bin DEFAULT NULL,
  `description` longtext COLLATE utf8_bin,
  `lang` char(2) COLLATE utf8_bin NOT NULL DEFAULT '',
  PRIMARY KEY (`id`,`lang`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- Dumping data for table `system_application_translation`
--

INSERT INTO `system_application_translation` (`id`, `title`, `description`, `lang`) VALUES
(1, 'About Me', 'Set your personal information.', 'en'),
(1, 'Kişisel Bilgilerim', 'Kişisel bilgilerinizi yönetin.', 'tr'),
(2, 'Feedback', 'Send feedback.', 'en'),
(2, 'Geri Bildirim', 'Geribildirim gönderin.', 'tr'),
(3, 'User Manager', 'User add, edit and remove.', 'en'),
(3, 'Kullanıcı Yönetici', 'Kullanıcı ekleyin çıkarın düzenleyin.', 'tr'),
(4, 'Feedback Manager', 'Feedback edit.', 'en'),
(4, 'Geri Bildirim Yöneticisi', 'Geri bildirim düzenleyin.', 'tr'),
(5, 'Story Manager', 'Manage system stories.', 'en'),
(5, 'Kullanıcı Hikayeleri Yöneticisi', 'Kullanıcı hikayelerini düzenleyin.', 'tr'),
(6, 'Role Manager', 'Roles managment.', 'en'),
(6, 'Rol Yöneticisi', 'Rolleri yönetin.', 'tr'),
(7, 'Application Manager', 'Manage Kebab applications', 'en'),
(7, 'Uygulama Yöneticisi', 'Kebab uygulamalarını yönetin', 'tr'),
(8, 'Jasius', 'Manage your documents on cloud', 'en'),
(8, 'Jasius', 'Dokümanlarınızı bulut üzerinden yönetin', 'tr');

-- --------------------------------------------------------

--
-- Table structure for table `system_controller`
--

CREATE TABLE IF NOT EXISTS `system_controller` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `module_id` bigint(20) DEFAULT NULL,
  `name` varchar(255) COLLATE utf8_bin DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `module_id_idx` (`module_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_bin AUTO_INCREMENT=23 ;

--
-- Dumping data for table `system_controller`
--

INSERT INTO `system_controller` (`id`, `module_id`, `name`) VALUES
(1, 1, 'backend'),
(2, 1, 'error'),
(3, 1, 'index'),
(4, 2, 'password'),
(5, 2, 'session'),
(6, 2, 'forgot-password'),
(7, 2, 'story'),
(8, 2, 'feedback'),
(9, 2, 'feedback-manager'),
(10, 2, 'profile'),
(11, 2, 'role'),
(12, 2, 'role-story'),
(13, 2, 'user'),
(14, 2, 'user-role'),
(15, 2, 'user-invitation'),
(16, 2, 'application'),
(17, 3, 'type'),
(18, 3, 'property'),
(19, 3, 'content'),
(20, 3, 'access'),
(21, 3, 'file'),
(22, 3, 'is-unique');

-- --------------------------------------------------------

--
-- Table structure for table `system_feedback`
--

CREATE TABLE IF NOT EXISTS `system_feedback` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) NOT NULL,
  `application_id` bigint(20) DEFAULT NULL,
  `description` longtext COLLATE utf8_bin,
  `status` enum('open','progress','closed') COLLATE utf8_bin DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `deleted_at` datetime DEFAULT NULL,
  `created_by` bigint(20) NOT NULL,
  `updated_by` bigint(20) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id_idx` (`user_id`),
  KEY `application_id_idx` (`application_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin AUTO_INCREMENT=1 ;

--
-- Dumping data for table `system_feedback`
--


-- --------------------------------------------------------

--
-- Table structure for table `system_module`
--

CREATE TABLE IF NOT EXISTS `system_module` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8_bin DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_bin AUTO_INCREMENT=4 ;

--
-- Dumping data for table `system_module`
--

INSERT INTO `system_module` (`id`, `name`) VALUES
(1, 'default'),
(3, 'jasius'),
(2, 'kebab');

-- --------------------------------------------------------

--
-- Table structure for table `system_permission`
--

CREATE TABLE IF NOT EXISTS `system_permission` (
  `role_id` bigint(20) NOT NULL DEFAULT '0',
  `story_id` bigint(20) NOT NULL DEFAULT '0',
  PRIMARY KEY (`role_id`,`story_id`),
  KEY `system_permission_story_id_system_story_id` (`story_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- Dumping data for table `system_permission`
--

INSERT INTO `system_permission` (`role_id`, `story_id`) VALUES
(1, 1),
(2, 1),
(1, 2),
(2, 2),
(2, 3),
(2, 4),
(2, 5),
(2, 6),
(2, 7),
(1, 8),
(2, 8),
(1, 9),
(2, 9),
(1, 10),
(2, 10);

-- --------------------------------------------------------

--
-- Table structure for table `system_role`
--

CREATE TABLE IF NOT EXISTS `system_role` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `active` tinyint(1) DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `created_by` bigint(20) NOT NULL,
  `updated_by` bigint(20) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_bin AUTO_INCREMENT=3 ;

--
-- Dumping data for table `system_role`
--

INSERT INTO `system_role` (`id`, `active`, `created_at`, `updated_at`, `created_by`, `updated_by`) VALUES
(1, 1, '2011-09-27 14:17:56', '2011-09-27 14:17:56', 0, 0),
(2, 1, '2011-09-27 14:17:56', '2011-09-27 14:17:56', 0, 0);

-- --------------------------------------------------------

--
-- Table structure for table `system_role_search`
--

CREATE TABLE IF NOT EXISTS `system_role_search` (
  `keyword` varchar(200) COLLATE utf8_bin NOT NULL DEFAULT '',
  `field` varchar(50) COLLATE utf8_bin NOT NULL DEFAULT '',
  `position` bigint(20) NOT NULL DEFAULT '0',
  `id` bigint(20) NOT NULL DEFAULT '0',
  `lang` char(2) COLLATE utf8_bin NOT NULL DEFAULT '',
  PRIMARY KEY (`keyword`,`field`,`position`,`id`,`lang`),
  KEY `system_role_search_id_system_role_translation_id` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- Dumping data for table `system_role_search`
--

INSERT INTO `system_role_search` (`keyword`, `field`, `position`, `id`, `lang`) VALUES
('member', 'title', 0, 1, 'en'),
('ueye', 'title', 0, 1, 'tr'),
('admin', 'title', 0, 2, 'en'),
('yoenetici', 'title', 0, 2, 'tr');

-- --------------------------------------------------------

--
-- Table structure for table `system_role_translation`
--

CREATE TABLE IF NOT EXISTS `system_role_translation` (
  `id` bigint(20) NOT NULL DEFAULT '0',
  `title` varchar(255) COLLATE utf8_bin DEFAULT NULL,
  `description` longtext COLLATE utf8_bin,
  `lang` char(2) COLLATE utf8_bin NOT NULL DEFAULT '',
  PRIMARY KEY (`id`,`lang`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- Dumping data for table `system_role_translation`
--

INSERT INTO `system_role_translation` (`id`, `title`, `description`, `lang`) VALUES
(1, 'Member', 'Member Role', 'en'),
(1, 'Üye', 'Üye Rolü', 'tr'),
(2, 'Admin', 'Admin Role', 'en'),
(2, 'Yönetici', 'Yönetici Rolü', 'tr');

-- --------------------------------------------------------

--
-- Table structure for table `system_service`
--

CREATE TABLE IF NOT EXISTS `system_service` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `story_id` bigint(20) DEFAULT NULL,
  `controller_id` bigint(20) DEFAULT NULL,
  `action_id` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `story_id_idx` (`story_id`),
  KEY `controller_id_idx` (`controller_id`),
  KEY `action_id_idx` (`action_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_bin AUTO_INCREMENT=24 ;

--
-- Dumping data for table `system_service`
--

INSERT INTO `system_service` (`id`, `story_id`, `controller_id`, `action_id`) VALUES
(1, 1, NULL, 2),
(2, 1, NULL, 1),
(3, 1, 8, NULL),
(4, 2, 4, NULL),
(5, 7, 9, NULL),
(6, 4, 11, NULL),
(7, 4, 12, NULL),
(8, 3, 13, NULL),
(9, 3, 14, NULL),
(10, 3, 15, NULL),
(11, 5, 7, NULL),
(12, 2, 10, NULL),
(13, 6, 16, NULL),
(14, 8, NULL, 3),
(15, 9, 18, NULL),
(16, 10, NULL, 4),
(17, 10, NULL, 5),
(18, 10, NULL, 6),
(19, 10, NULL, 7),
(20, 10, NULL, 8),
(21, 10, 20, NULL),
(22, 10, 21, NULL),
(23, 10, 22, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `system_story`
--

CREATE TABLE IF NOT EXISTS `system_story` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8_bin DEFAULT NULL,
  `active` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_bin AUTO_INCREMENT=11 ;

--
-- Dumping data for table `system_story`
--

INSERT INTO `system_story` (`id`, `name`, `active`) VALUES
(1, 'access_desktop', 1),
(2, 'profile_management', 1),
(3, 'user_management', 1),
(4, 'role_management', 1),
(5, 'story_management', 1),
(6, 'application_management', 1),
(7, 'feedback_management', 1),
(8, 'jasius_see_document_type', 1),
(9, 'jasius_property', 1),
(10, 'jasius_add_document', 1);

-- --------------------------------------------------------

--
-- Table structure for table `system_story_application`
--

CREATE TABLE IF NOT EXISTS `system_story_application` (
  `story_id` bigint(20) NOT NULL DEFAULT '0',
  `application_id` bigint(20) NOT NULL DEFAULT '0',
  PRIMARY KEY (`story_id`,`application_id`),
  KEY `system_story_application_application_id_system_application_id` (`application_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- Dumping data for table `system_story_application`
--

INSERT INTO `system_story_application` (`story_id`, `application_id`) VALUES
(1, 1),
(1, 2),
(3, 3),
(7, 4),
(5, 5),
(4, 6),
(6, 7),
(10, 8);

-- --------------------------------------------------------

--
-- Table structure for table `system_story_search`
--

CREATE TABLE IF NOT EXISTS `system_story_search` (
  `keyword` varchar(200) COLLATE utf8_bin NOT NULL DEFAULT '',
  `field` varchar(50) COLLATE utf8_bin NOT NULL DEFAULT '',
  `position` bigint(20) NOT NULL DEFAULT '0',
  `id` bigint(20) NOT NULL DEFAULT '0',
  `lang` char(2) COLLATE utf8_bin NOT NULL DEFAULT '',
  PRIMARY KEY (`keyword`,`field`,`position`,`id`,`lang`),
  KEY `system_story_search_id_system_story_translation_id` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- Dumping data for table `system_story_search`
--

INSERT INTO `system_story_search` (`keyword`, `field`, `position`, `id`, `lang`) VALUES
('access', 'description', 0, 1, 'en'),
('access', 'title', 0, 1, 'en'),
('cevirimici', 'description', 0, 1, 'tr'),
('desktop', 'description', 2, 1, 'en'),
('desktop', 'title', 2, 1, 'en'),
('erisim', 'description', 4, 1, 'tr'),
('erisim', 'title', 1, 1, 'tr'),
('login', 'description', 4, 1, 'en'),
('masauestuene', 'description', 3, 1, 'tr'),
('masauestuene', 'title', 0, 1, 'tr'),
('olduktan', 'description', 1, 1, 'tr'),
('sonra', 'description', 2, 1, 'tr'),
('bilgilerini', 'description', 6, 2, 'tr'),
('change', 'description', 2, 2, 'en'),
('degistirebilir', 'description', 7, 2, 'tr'),
('dil', 'description', 3, 2, 'tr'),
('etc', 'description', 6, 2, 'en'),
('gibi', 'description', 5, 2, 'tr'),
('isim', 'description', 1, 2, 'tr'),
('kullanicilar', 'description', 0, 2, 'tr'),
('language', 'description', 5, 2, 'en'),
('management', 'title', 1, 2, 'en'),
('profil', 'title', 0, 2, 'tr'),
('profile', 'title', 0, 2, 'en'),
('secimi', 'description', 4, 2, 'tr'),
('soyisim', 'description', 2, 2, 'tr'),
('surname', 'description', 4, 2, 'en'),
('user', 'description', 0, 2, 'en'),
('yoenetimi', 'title', 1, 2, 'tr'),
('add', 'description', 1, 3, 'en'),
('cikarin', 'description', 2, 3, 'tr'),
('duezenleyin', 'description', 3, 3, 'tr'),
('edit', 'description', 2, 3, 'en'),
('ekleyin', 'description', 1, 3, 'tr'),
('kullanici', 'description', 0, 3, 'tr'),
('kullanici', 'title', 0, 3, 'tr'),
('management', 'title', 1, 3, 'en'),
('remove', 'description', 4, 3, 'en'),
('user', 'description', 0, 3, 'en'),
('user', 'title', 0, 3, 'en'),
('yoenetimi', 'title', 1, 3, 'tr'),
('manage', 'description', 0, 4, 'en'),
('management', 'title', 1, 4, 'en'),
('rol', 'title', 0, 4, 'tr'),
('role', 'title', 0, 4, 'en'),
('roles', 'description', 2, 4, 'en'),
('rollerini', 'description', 1, 4, 'tr'),
('sistem', 'description', 0, 4, 'tr'),
('yoenetimi', 'title', 1, 4, 'tr'),
('yoenetin', 'description', 2, 4, 'tr'),
('hikayeleri', 'title', 1, 5, 'tr'),
('hikayelerini', 'description', 1, 5, 'tr'),
('kullanici', 'description', 0, 5, 'tr'),
('kullanim', 'title', 0, 5, 'tr'),
('manage', 'description', 0, 5, 'en'),
('management', 'title', 1, 5, 'en'),
('stories', 'description', 3, 5, 'en'),
('story', 'title', 0, 5, 'en'),
('user', 'description', 2, 5, 'en'),
('yoenetimi', 'title', 2, 5, 'tr'),
('yoenetin', 'description', 2, 5, 'tr'),
('application', 'title', 0, 6, 'en'),
('applications', 'description', 2, 6, 'en'),
('kebab', 'description', 0, 6, 'tr'),
('kebab', 'description', 1, 6, 'en'),
('manage', 'description', 0, 6, 'en'),
('management', 'title', 1, 6, 'en'),
('uygulama', 'title', 0, 6, 'tr'),
('uygulamalarini', 'description', 1, 6, 'tr'),
('yoeneticisi', 'title', 1, 6, 'tr'),
('yoenetin', 'description', 2, 6, 'tr'),
('bildirimlerini', 'description', 2, 7, 'tr'),
('feedback', 'title', 0, 7, 'en'),
('feedbacks', 'description', 2, 7, 'en'),
('geri', 'description', 1, 7, 'tr'),
('geribildirim', 'title', 0, 7, 'tr'),
('kullanici', 'description', 0, 7, 'tr'),
('manage', 'description', 0, 7, 'en'),
('management', 'title', 1, 7, 'en'),
('user', 'description', 1, 7, 'en'),
('yoenetimi', 'title', 1, 7, 'tr'),
('yoenetin', 'description', 3, 7, 'tr'),
('buetuen', 'description', 1, 8, 'tr'),
('buetuen', 'title', 0, 8, 'tr'),
('document', 'description', 4, 8, 'en'),
('document', 'title', 2, 8, 'en'),
('doekueman', 'description', 2, 8, 'tr'),
('doekueman', 'title', 1, 8, 'tr'),
('goerebilir', 'description', 4, 8, 'tr'),
('goerme', 'title', 3, 8, 'tr'),
('kullanici', 'description', 0, 8, 'tr'),
('tiplerini', 'description', 3, 8, 'tr'),
('tiplerini', 'title', 2, 8, 'tr'),
('types', 'description', 5, 8, 'en'),
('types', 'title', 3, 8, 'en'),
('user', 'description', 0, 8, 'en'),
('ile', 'description', 1, 9, 'tr'),
('jasius', 'description', 0, 9, 'tr'),
('jasius', 'description', 3, 9, 'en'),
('jasius', 'title', 0, 9, 'en'),
('jasius', 'title', 0, 9, 'tr'),
('managmanent', 'description', 1, 9, 'en'),
('managment', 'title', 3, 9, 'en'),
('oezellik', 'description', 2, 9, 'tr'),
('oezellik', 'title', 2, 9, 'tr'),
('property', 'description', 0, 9, 'en'),
('property', 'title', 2, 9, 'en'),
('yoenetimi', 'description', 3, 9, 'tr'),
('yoenetimi', 'title', 3, 9, 'tr'),
('add', 'description', 0, 10, 'en'),
('add', 'title', 2, 10, 'en'),
('document', 'description', 3, 10, 'en'),
('document', 'title', 5, 10, 'en'),
('doekueman', 'description', 3, 10, 'tr'),
('doekueman', 'title', 3, 10, 'tr'),
('ekleme', 'description', 4, 10, 'tr'),
('ekleme', 'title', 4, 10, 'tr'),
('ile', 'description', 1, 10, 'tr'),
('jasius', 'description', 0, 10, 'tr'),
('jasius', 'description', 5, 10, 'en'),
('jasius', 'title', 0, 10, 'en'),
('jasius', 'title', 0, 10, 'tr'),
('yeni', 'description', 2, 10, 'tr'),
('yeni', 'title', 2, 10, 'tr');

-- --------------------------------------------------------

--
-- Table structure for table `system_story_translation`
--

CREATE TABLE IF NOT EXISTS `system_story_translation` (
  `id` bigint(20) NOT NULL DEFAULT '0',
  `title` varchar(255) COLLATE utf8_bin DEFAULT NULL,
  `description` longtext COLLATE utf8_bin,
  `lang` char(2) COLLATE utf8_bin NOT NULL DEFAULT '',
  PRIMARY KEY (`id`,`lang`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- Dumping data for table `system_story_translation`
--

INSERT INTO `system_story_translation` (`id`, `title`, `description`, `lang`) VALUES
(1, 'Access to desktop', 'Access the desktop after login.', 'en'),
(1, 'Masaüstüne erişim', 'Çevirimiçi olduktan sonra masaüstüne erişim', 'tr'),
(2, 'Profile management', 'User can change name, surname, language etc.', 'en'),
(2, 'Profil yönetimi', 'Kullanıcılar isim, soyisim, dil seçimi gibi bilgilerini değiştirebilir.', 'tr'),
(3, 'User management', 'User add, edit and remove.', 'en'),
(3, 'Kullanıcı yönetimi', 'Kullanıcı ekleyin çıkarın düzenleyin.', 'tr'),
(4, 'Role management', 'Manage system roles', 'en'),
(4, 'Rol yönetimi', 'Sistem rollerini yönetin', 'tr'),
(5, 'Story management', 'Manage the user stories.', 'en'),
(5, 'Kullanım hikayeleri yönetimi', 'Kullanıcı hikayelerini yönetin.', 'tr'),
(6, 'Application management', 'Manage Kebab applications.', 'en'),
(6, 'Uygulama Yöneticisi', 'Kebab uygulamalarını yönetin.', 'tr'),
(7, 'Feedback management', 'Manage user feedbacks', 'en'),
(7, 'Geribildirim yönetimi', 'Kullanıcı geri bildirimlerini yönetin', 'tr'),
(8, 'See all document types', 'User can see all document types', 'en'),
(8, 'Bütün döküman tiplerini görme', 'Kullanıcı bütün döküman tiplerini görebilir', 'tr'),
(9, 'Jasius - Property managment', 'Property managmanent with jasius', 'en'),
(9, 'Jasius - Özellik yönetimi', 'Jasius ile özellik yönetimi', 'tr'),
(10, 'Jasius - Add a new document', 'Add a new document with jasius', 'en'),
(10, 'Jasius - Yeni döküman ekleme', 'Jasius ile yeni döküman ekleme', 'tr');

-- --------------------------------------------------------

--
-- Table structure for table `system_user`
--

CREATE TABLE IF NOT EXISTS `system_user` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `fullname` varchar(255) COLLATE utf8_bin DEFAULT NULL,
  `username` varchar(55) COLLATE utf8_bin DEFAULT NULL,
  `email` varchar(255) COLLATE utf8_bin NOT NULL,
  `password` varchar(255) COLLATE utf8_bin DEFAULT NULL,
  `language` enum('en','tr') COLLATE utf8_bin DEFAULT NULL,
  `activationkey` varchar(255) COLLATE utf8_bin DEFAULT NULL,
  `status` enum('pending','banned','approved') COLLATE utf8_bin DEFAULT NULL,
  `active` tinyint(1) DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `deleted_at` datetime DEFAULT NULL,
  `created_by` bigint(20) NOT NULL,
  `updated_by` bigint(20) NOT NULL,
  `slug` varchar(255) COLLATE utf8_bin DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `activationkey` (`activationkey`),
  UNIQUE KEY `system_user_sluggable_idx` (`slug`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_bin AUTO_INCREMENT=3 ;

--
-- Dumping data for table `system_user`
--

INSERT INTO `system_user` (`id`, `fullname`, `username`, `email`, `password`, `language`, `activationkey`, `status`, `active`, `created_at`, `updated_at`, `deleted_at`, `created_by`, `updated_by`, `slug`) VALUES
(1, 'Member', 'member', 'member@jasi.us', 'aa08769cdcb26674c6706093503ff0a3', 'tr', NULL, 'approved', 1, '2011-09-27 14:17:56', '2011-09-27 14:17:56', NULL, 0, 0, 'member'),
(2, 'Admin', 'admin', 'admin@jasi.us', '21232f297a57a5a743894a0e4a801fc3', 'en', NULL, 'approved', 1, '2011-09-27 14:17:56', '2011-09-27 14:17:56', NULL, 0, 0, 'admin');

-- --------------------------------------------------------

--
-- Table structure for table `system_user_role`
--

CREATE TABLE IF NOT EXISTS `system_user_role` (
  `user_id` bigint(20) NOT NULL DEFAULT '0',
  `role_id` bigint(20) NOT NULL DEFAULT '0',
  PRIMARY KEY (`user_id`,`role_id`),
  KEY `system_user_role_role_id_system_role_id` (`role_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- Dumping data for table `system_user_role`
--

INSERT INTO `system_user_role` (`user_id`, `role_id`) VALUES
(1, 1),
(2, 2);

-- --------------------------------------------------------

--
-- Table structure for table `system_user_search`
--

CREATE TABLE IF NOT EXISTS `system_user_search` (
  `keyword` varchar(200) COLLATE utf8_bin NOT NULL DEFAULT '',
  `field` varchar(50) COLLATE utf8_bin NOT NULL DEFAULT '',
  `position` bigint(20) NOT NULL DEFAULT '0',
  `id` bigint(20) NOT NULL DEFAULT '0',
  PRIMARY KEY (`keyword`,`field`,`position`,`id`),
  KEY `system_user_search_id_system_user_id` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- Dumping data for table `system_user_search`
--

INSERT INTO `system_user_search` (`keyword`, `field`, `position`, `id`) VALUES
('jasi', 'email', 1, 1),
('member', 'email', 0, 1),
('member', 'fullName', 0, 1),
('member', 'userName', 0, 1),
('admin', 'email', 0, 2),
('admin', 'fullName', 0, 2),
('admin', 'userName', 0, 2),
('jasi', 'email', 1, 2);

--
-- Constraints for dumped tables
--

--
-- Constraints for table `jasius_access`
--
ALTER TABLE `jasius_access`
  ADD CONSTRAINT `jasius_access_content_id_jasius_content_id` FOREIGN KEY (`content_id`) REFERENCES `jasius_content` (`id`);

--
-- Constraints for table `jasius_content`
--
ALTER TABLE `jasius_content`
  ADD CONSTRAINT `jasius_content_type_id_jasius_type_id` FOREIGN KEY (`type_id`) REFERENCES `jasius_type` (`id`);

--
-- Constraints for table `jasius_data`
--
ALTER TABLE `jasius_data`
  ADD CONSTRAINT `jasius_data_content_id_jasius_content_id` FOREIGN KEY (`content_id`) REFERENCES `jasius_content` (`id`),
  ADD CONSTRAINT `jasius_data_property_id_jasius_property_id` FOREIGN KEY (`property_id`) REFERENCES `jasius_property` (`id`);

--
-- Constraints for table `jasius_data_search`
--
ALTER TABLE `jasius_data_search`
  ADD CONSTRAINT `jasius_data_search_id_jasius_data_id` FOREIGN KEY (`id`) REFERENCES `jasius_data` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `jasius_file`
--
ALTER TABLE `jasius_file`
  ADD CONSTRAINT `jasius_file_content_id_jasius_content_id` FOREIGN KEY (`content_id`) REFERENCES `jasius_content` (`id`);

--
-- Constraints for table `jasius_property`
--
ALTER TABLE `jasius_property`
  ADD CONSTRAINT `jasius_property_type_id_jasius_type_id` FOREIGN KEY (`type_id`) REFERENCES `jasius_type` (`id`);

--
-- Constraints for table `jasius_property_translation`
--
ALTER TABLE `jasius_property_translation`
  ADD CONSTRAINT `jasius_property_translation_id_jasius_property_id` FOREIGN KEY (`id`) REFERENCES `jasius_property` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `jasius_type_search`
--
ALTER TABLE `jasius_type_search`
  ADD CONSTRAINT `jasius_type_search_id_jasius_type_translation_id` FOREIGN KEY (`id`) REFERENCES `jasius_type_translation` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `jasius_type_translation`
--
ALTER TABLE `jasius_type_translation`
  ADD CONSTRAINT `jasius_type_translation_id_jasius_type_id` FOREIGN KEY (`id`) REFERENCES `jasius_type` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `system_action`
--
ALTER TABLE `system_action`
  ADD CONSTRAINT `system_action_controller_id_system_controller_id` FOREIGN KEY (`controller_id`) REFERENCES `system_controller` (`id`);

--
-- Constraints for table `system_application_search`
--
ALTER TABLE `system_application_search`
  ADD CONSTRAINT `system_application_search_id_system_application_translation_id` FOREIGN KEY (`id`) REFERENCES `system_application_translation` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `system_application_translation`
--
ALTER TABLE `system_application_translation`
  ADD CONSTRAINT `system_application_translation_id_system_application_id` FOREIGN KEY (`id`) REFERENCES `system_application` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `system_controller`
--
ALTER TABLE `system_controller`
  ADD CONSTRAINT `system_controller_module_id_system_module_id` FOREIGN KEY (`module_id`) REFERENCES `system_module` (`id`);

--
-- Constraints for table `system_feedback`
--
ALTER TABLE `system_feedback`
  ADD CONSTRAINT `system_feedback_application_id_system_application_id` FOREIGN KEY (`application_id`) REFERENCES `system_application` (`id`),
  ADD CONSTRAINT `system_feedback_user_id_system_user_id` FOREIGN KEY (`user_id`) REFERENCES `system_user` (`id`);

--
-- Constraints for table `system_permission`
--
ALTER TABLE `system_permission`
  ADD CONSTRAINT `system_permission_role_id_system_role_id` FOREIGN KEY (`role_id`) REFERENCES `system_role` (`id`),
  ADD CONSTRAINT `system_permission_story_id_system_story_id` FOREIGN KEY (`story_id`) REFERENCES `system_story` (`id`);

--
-- Constraints for table `system_role_search`
--
ALTER TABLE `system_role_search`
  ADD CONSTRAINT `system_role_search_id_system_role_translation_id` FOREIGN KEY (`id`) REFERENCES `system_role_translation` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `system_role_translation`
--
ALTER TABLE `system_role_translation`
  ADD CONSTRAINT `system_role_translation_id_system_role_id` FOREIGN KEY (`id`) REFERENCES `system_role` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `system_service`
--
ALTER TABLE `system_service`
  ADD CONSTRAINT `system_service_action_id_system_action_id` FOREIGN KEY (`action_id`) REFERENCES `system_action` (`id`),
  ADD CONSTRAINT `system_service_controller_id_system_controller_id` FOREIGN KEY (`controller_id`) REFERENCES `system_controller` (`id`),
  ADD CONSTRAINT `system_service_story_id_system_story_id` FOREIGN KEY (`story_id`) REFERENCES `system_story` (`id`);

--
-- Constraints for table `system_story_application`
--
ALTER TABLE `system_story_application`
  ADD CONSTRAINT `system_story_application_application_id_system_application_id` FOREIGN KEY (`application_id`) REFERENCES `system_application` (`id`),
  ADD CONSTRAINT `system_story_application_story_id_system_story_id` FOREIGN KEY (`story_id`) REFERENCES `system_story` (`id`);

--
-- Constraints for table `system_story_search`
--
ALTER TABLE `system_story_search`
  ADD CONSTRAINT `system_story_search_id_system_story_translation_id` FOREIGN KEY (`id`) REFERENCES `system_story_translation` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `system_story_translation`
--
ALTER TABLE `system_story_translation`
  ADD CONSTRAINT `system_story_translation_id_system_story_id` FOREIGN KEY (`id`) REFERENCES `system_story` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `system_user_role`
--
ALTER TABLE `system_user_role`
  ADD CONSTRAINT `system_user_role_role_id_system_role_id` FOREIGN KEY (`role_id`) REFERENCES `system_role` (`id`),
  ADD CONSTRAINT `system_user_role_user_id_system_user_id` FOREIGN KEY (`user_id`) REFERENCES `system_user` (`id`);

--
-- Constraints for table `system_user_search`
--
ALTER TABLE `system_user_search`
  ADD CONSTRAINT `system_user_search_id_system_user_id` FOREIGN KEY (`id`) REFERENCES `system_user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
