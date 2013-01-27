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
 * @package    Library
 * @subpackage List
 * @author     Onur Özgür ÖZKAN <onur.ozgur.ozkan@lab2023.com>
 * @copyright  Copyright (c) 2010-2011 lab2023 - internet technologies TURKEY Inc. (http://www.lab2023.com)
 * @license    http://www.kebab-project.com/cms/licensing
 * @version    1.5.0
 */


/**
 * Kebab List Class
 *
 * This class help developer to manage list. The main problem is you can pass one item to all other item at list.
 * Thats why we write a $_rules array like
 *
 * <code>
 * <?php
 * $_rules = array (
 *     'pending' => array('active', 'block'),
 *     'active' => array('approve', 'block'),
 *     'approve' => array('active', 'block'),
 *     'block' => array('active', 'approved')
 * );
 * ?>
 * </code>
 *
 * This mean that pending can pass to active and block, active can pass approve and block, etc.
 *
 * @category   Kebab
 * @package    Library
 * @subpackage List
 * @author     Onur Özgür ÖZKAN <onur.ozgur.ozkan@lab2023.com>
 * @copyright  Copyright (c) 2010-2011 lab2023 - internet technologies TURKEY Inc. (http://www.lab2023.com)
 * @license    http://www.kebab-project.com/cms/licensing
 * @version    1.5.0
 */
class Kebab_List
{

    /**
     * Rules should be array otherwise its value is false
     *
     * @var bool|Array
     */
    protected $_rules = false;


    /**
     * Set rules
     *
     * @throws Kebab_List_Exception
     * @param  $rules
     * @return Kebab_List
     */
    public function setRules($rules)
    {
        // Type validation
        if (!is_array($rules)) {
            throw new Kebab_List_Exception("$rules should be array.");
        }

        while (list(, $value) = each($rules)) {
            if (!is_array($value)) {
                throw new Kebab_List_Exception("$rules should be array.");
            }
        }

        $this->_rules = $rules;

        return $this;
    }


    /**
    * Get rules
    *
    * @return Array|bool
    */
    public function getRules()
    {
        return $this->_rules;
    }

    /**
     * Check the item is in listItems
     *
     * @throws Kebab_List_Exception
     * @param  $item
     * @return bool
     */
    public function hasItem($item)
    {
        if (!array_key_exists($item, $this->getRules())) {
            throw new Kebab_List_Exception("List items haven't been initialized");
        }

        return array_key_exists($item, $this->getRules());
    }

    /**
     * Get item from $_rules
     *
     * @throws Kebab_List_Exception
     * @param  string $item
     * @return array
     */
    public function getItem($item)
    {
        if (!array_key_exists($item, $this->getRules())) {
            throw new Kebab_List_Exception("List items haven't been initialized");
        }

        $rules = $this->getRules();

        return $rules[$item];
    }

    /**
     * Set items at $_rules
     *
     * @param  string $item
     * @param  array $rule
     * @return Kebab_List
     */
    public function setItem($item, $rule)
    {
        $this->_rules[$item] = $rule;

        return $this;
    }

    /**
     * Check that $source item has $target item.
     *
     * @param  $from
     * @param  $to
     * @return bool
     */
    public function canPass($from, $to)
    {
        $retVal = false;
        if ($this->hasItem($from)) {
            $rules = $this->getRules();
            $retVal = in_array($to, $rules[$from]);
        }

        return $retVal;
    }
}