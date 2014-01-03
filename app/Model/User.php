<?php
App::uses('AppModel', 'Model');
/**
 * User Model
 *
 * @property Post $Post
 */
class User extends AppModel {

	public $displayField = 'fullname';

    public $virtualFields = array(
        'fullname' => 'CONCAT(User.firstname, " ", User.surname)'
    );

/**
 * hasMany associations
 *
 * @var array
 */
	public $hasMany = array(
		'Post' => array(
			'className' => 'Post',
			'foreignKey' => 'user_id',
			'dependent' => false,
			'conditions' => '',
			'fields' => '',
			'order' => '',
			'limit' => '',
			'offset' => '',
			'exclusive' => '',
			'finderQuery' => '',
			'counterQuery' => ''
		)
	);

}
