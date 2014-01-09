<?php 
class AppSchema extends CakeSchema {

	public function before($event = array()) {
        $db = ConnectionManager::getDataSource($this->connection);
        $db->cacheSources = false;
		return true;
	}

	public function after($event = array()) {
        if (isset($event['create'])) {
            App::uses('ClassRegistry', 'Utility');
            switch ($event['create']) {
                case 'comments':
                    $comment = ClassRegistry::init('Comment');
                    $comment->create();
                    $comment->save(
                        array(
                            'Comment' => array('id' => 1, 'post_id' => 1, 'comment' => 'A great post!')
                        )
                    );
                    $comment->create();
                    $comment->save(
                        array(
                            'Comment' => array('id' => 2, 'post_id' => 1, 'comment' => 'I agree with the above, truly inspiring')
                        )
                    );
                    break;
                case 'posts':
                    $post = ClassRegistry::init('Post');
                    $post->create();
                    $post->save(
                        array(
                            'Post' => array('id' => 1, 'user_id' => 1, 'title' => 'A test post', 'content' => 'A fantastic post has been written', 'created' => '1383814055', 'modified' => '1383814055')
                        )
                    );
                    break;
                case 'users':
                    $user = ClassRegistry::init('User');
                    $user->create();
                    $user->save(
                        array(
                            'User' => array('id' => 1, 'firstname' => 'Josh', 'surname' => 'Taylor')
                        )
                    );
                    break;
            }
        }
	}

	public $comments = array(
		'id' => array('type' => 'integer', 'null' => false, 'default' => null, 'key' => 'primary'),
		'post_id' => array('type' => 'integer', 'null' => true, 'default' => null, 'key' => 'index'),
		'comment' => array('type' => 'text', 'null' => true, 'default' => null, 'collate' => 'utf8_general_ci', 'charset' => 'utf8'),
		'indexes' => array(
			'PRIMARY' => array('column' => 'id', 'unique' => 1),
			'post_id' => array('column' => 'post_id', 'unique' => 0)
		),
		'tableParameters' => array('charset' => 'utf8', 'collate' => 'utf8_general_ci', 'engine' => 'InnoDB')
	);

	public $posts = array(
		'id' => array('type' => 'integer', 'null' => false, 'default' => null, 'key' => 'primary'),
		'user_id' => array('type' => 'integer', 'null' => true, 'default' => null, 'key' => 'index'),
		'title' => array('type' => 'string', 'null' => true, 'default' => null, 'length' => 100, 'collate' => 'utf8_general_ci', 'charset' => 'utf8'),
		'content' => array('type' => 'text', 'null' => true, 'default' => null, 'collate' => 'utf8_general_ci', 'charset' => 'utf8'),
		'created' => array('type' => 'integer', 'null' => true, 'default' => null),
		'modified' => array('type' => 'integer', 'null' => true, 'default' => null),
		'indexes' => array(
			'PRIMARY' => array('column' => 'id', 'unique' => 1),
			'user_id' => array('column' => 'user_id', 'unique' => 0)
		),
		'tableParameters' => array('charset' => 'utf8', 'collate' => 'utf8_general_ci', 'engine' => 'InnoDB')
	);

	public $users = array(
		'id' => array('type' => 'integer', 'null' => false, 'default' => null, 'key' => 'primary'),
		'firstname' => array('type' => 'string', 'null' => true, 'default' => null, 'length' => 100, 'collate' => 'utf8_general_ci', 'charset' => 'utf8'),
		'surname' => array('type' => 'string', 'null' => true, 'default' => null, 'length' => 100, 'collate' => 'utf8_general_ci', 'charset' => 'utf8'),
		'indexes' => array(
			'PRIMARY' => array('column' => 'id', 'unique' => 1)
		),
		'tableParameters' => array('charset' => 'utf8', 'collate' => 'utf8_general_ci', 'engine' => 'InnoDB')
	);

}
