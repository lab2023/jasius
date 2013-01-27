<?php
/*
 *  $Id$
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
 * "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
 * LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
 * A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
 * OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
 * SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
 * LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
 * DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
 * THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 * This software consists of voluntary contributions made by many individuals
 * and is licensed under the LGPL. For more information, see
 * <http://www.phpdoctrine.org>.
 */

/**
 * Doctrine_Template_Blameable
 *
 * Easily add created and updated by columns to your doctrine records that are automatically set
 * when records are saved
 *
 * @package     Doctrine
 * @subpackage  Template
 * @license     http://www.opensource.org/licenses/lgpl-license.php LGPL
 * @link        www.phpdoctrine.org
 * @since       1.2
 * @version     $Revision$
 * @author      Colin DeCarlo <cdecarlo@gmail.com>
 */
class Doctrine_Template_Blameable extends Doctrine_Template
{
    /**
     * Array of Blameable options
     *
     * @var string
     */
    protected $_options = array('listener'      => 'Doctrine_Template_Listener_Blameable',
                                'blameVar'      => 'id',
                                'default'       => false,
                                'params'        => array(),
                                'columns'       => array('created' =>  array('name'          =>  'created_by',
                                                                             'alias'         =>  null,
                                                                             'type'          =>  'integer',
                                                                             'length'        =>  8,
                                                                             'disabled'      =>  false,
                                                                             'options'       =>  array('notnull' => true,)
                                                                            ),
                                                         'updated' =>  array('name'          =>  'updated_by',
                                                                             'alias'         =>  null,
                                                                             'type'          =>  'integer',
                                                                             'length'        =>  8,
                                                                             'disabled'      =>  false,
                                                                             'onInsert'      =>  true,
                                                                             'options'       =>  array('notnull' => true,)
                                                                            )
                                                        ),
                                'relations'       => array('created' => array('disabled'      => true,
                                                                              'name'          => 'CreatedBy',
                                                                              'class'         => 'Model_User',
                                                                              'foreign'       => 'id',
                                                                              ),
                                                           'updated' => array('disabled'      => true,
                                                                              'name'          => 'UpdatedBy',
                                                                              'class'         => 'Model_User',
                                                                              'foreign'       => 'id',
                                                                              ),
                                                        ));


    /**
     * __construct
     *
     * @param array $options
     * @return void
     */
    public function __construct(array $options = array())
    {

        if (!class_exists($this->_options['listener'], true)) {
            throw new Exception('Class: ' . $this->_options['listener'] . ' not found');
        }

        parent::__construct($options);

    }

    /**
     * Set table definition for Blameable behavior
     *
     * @return void
     */
    public function setTableDefinition()
    {
        if( ! $this->_options['columns']['created']['disabled']) {
            $name = $this->_options['columns']['created']['name'];
            if ($this->_options['columns']['created']['alias']) {
                $name .= ' as ' . $this->_options['columns']['created']['alias'];
            }
            $this->hasColumn($name, $this->_options['columns']['created']['type'],
                             $this->_options['columns']['created']['length'],
                             $this->_options['columns']['created']['options']);
        }

        if( ! $this->_options['columns']['updated']['disabled']) {
            $name = $this->_options['columns']['updated']['name'];
            if ($this->_options['columns']['updated']['alias']) {
                $name .= ' as ' . $this->_options['columns']['updated']['alias'];
            }

            if ($this->_options['columns']['updated']['onInsert'] !== true &&
              $this->_options['columns']['updated']['options']['notnull'] === true) {
                $this->_options['columns']['updated']['options']['notnull'] = false;
            }

            $this->hasColumn($name, $this->_options['columns']['updated']['type'],
                             $this->_options['columns']['updated']['length'],
                             $this->_options['columns']['updated']['options']);
        }

        $listener = new $this->_options['listener']($this->_options);

        if (get_class($listener) !== 'Doctrine_Template_Listener_Blameable' &&
            !is_subclass_of($listener, 'Doctrine_Template_Listener_Blameable')) {
            	throw new Exception('Invalid listener. Must be Doctrine_Template_Listener_Blameable or subclass');
        }
        $this->addListener($listener, 'Blameable');
    }

    /**
     * Setup the relations for the Blameable behavior
     *
     * @return void
     */
    public function setUp()
    {

      if( ! $this->_options['relations']['created']['disabled']) {
        $this->hasOne($this->_options['relations']['created']['class'] . ' as ' . $this->_options['relations']['created']['name'],
          array('local' => $this->_options['columns']['created']['name'],
                'foreign' => $this->_options['relations']['created']['foreign'],
          )
        );
      }

      if( ! $this->_options['relations']['updated']['disabled'] && ! $this->_options['columns']['updated']['disabled']) {
        $this->hasOne($this->_options['relations']['updated']['class'] . ' as ' . $this->_options['relations']['updated']['name'],
          array('local' => $this->_options['columns']['updated']['name'],
                'foreign' => $this->_options['relations']['updated']['foreign'],
          )
        );
      }


    }
}
