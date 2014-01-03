<?php
$this->Html->script('http://ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.js', array('inline' => false));
$this->Html->script('http://cdnjs.cloudflare.com/ajax/libs/handlebars.js/1.0.0/handlebars.js', array('inline' => false));
$this->Html->script('http://builds.emberjs.com/release/ember.js', array('inline' => false));
$this->Html->script('http://builds.emberjs.com/beta/ember-data.js', array('inline' => false));
$this->Html->script('vendor/ember-data-cakephp-rest-adapter', array('inline' => false));
$this->Html->script('app', array('inline' => false));
?>
<div class="pages home">
    <h2><?php echo __('Ember Application'); ?></h2>

    <div id="ember-app"></div>

    <script type="text/x-handlebars" data-template-name="application">
        {{#link-to 'posts'}}Posts{{/link-to}} | {{#link-to 'users'}}Users{{/link-to}} | {{#link-to 'comments'}}Comments{{/link-to}}

        {{outlet}}
    </script>

    <script type="text/x-handlebars" data-template-name="posts">
        <br />
        <br />
        <h4>Posts</h4>
        <ul>
            {{#each model}}
                <li>
                    {{#link-to 'post' this}}
                        {{title}}
                    {{/link-to}}
                </li>
            {{/each}}
        </ul>

        {{outlet}}
    </script>

    <script type="text/x-handlebars" data-template-name="post">
        <br />
        <dl>
            <dt>ID</dt>
            <dd>{{id}}</dd>
            <dt>Title</dt>
            <dd>{{title}}</dd>
            <dt>Content</dt>
            <dd>{{model.content}}</dd>
            <dt>Created</dt>
            <dd>{{created}}</dd>
            <dt>Modified</dt>
            <dd>{{modified}}</dd>
        </dl>
        <br />
        {{#link-to 'posts'}}Back{{/link-to}}
    </script>

    <script type="text/x-handlebars" data-template-name="users">
        <br />
        <br />
        <h4>Users</h4>
        <ul>
            {{#each model}}
                <li>
                    {{#link-to 'user' this}}
                        {{fullName}}
                    {{/link-to}}
                </li>
            {{/each}}
        </ul>

        {{outlet}}
    </script>

    <script type="text/x-handlebars" data-template-name="user">
        <br />
        <dl>
            <dt>ID</dt>
            <dd>{{id}}</dd>
            <dt>First Name</dt>
            <dd>{{firstname}}</dd>
            <dt>Surname</dt>
            <dd>{{surname}}</dd>
        </dl>
    </script>

    <script type="text/x-handlebars" data-template-name="comments">
        <br />
        <br />
        <h4>Comments</h4>
        <ul>
            {{#each model}}
                <li>
                    {{#link-to 'comment' this}}
                        {{comment}}
                    {{/link-to}}
                </li>
            {{/each}}
        </ul>

        {{outlet}}
    </script>

    <script type="text/x-handlebars" data-template-name="comment">
        <br />
        <dl>
            <dt>ID</dt>
            <dd>{{id}}</dd>
            <dt>Comment</dt>
            <dd>{{comment}}</dd>
            <dt>Post ID</dt>
            <dd>{{post.id}}</dd>
        </dl>
    </script>

    <!-- REFERENCE -->
    <br />
    <hr />
    <br />
    <h2><?php echo __('Reference'); ?></h2>
    <table cellpadding="0" cellspacing="0">
        <tr>
            <th>Section</th>
            <th>Web</th>
            <th>REST</th>
        </tr>
        <tr>
            <td>Comments</td>
            <td><?php echo $this->Html->link('Index', array('controller' => 'comments', 'action' => 'index')); ?></td>
            <td>
                <?php echo $this->Html->link('Index', array('controller' => 'comments', 'action' => 'index', 'ext' => 'json')); ?> |
                <?php echo $this->Html->link('Single', array('controller' => 'comments', 'action' => 'view', 1, 'ext' => 'json')); ?>
            </td>
        </tr>
        <tr>
            <td>Posts</td>
            <td><?php echo $this->Html->link('Index', array('controller' => 'posts', 'action' => 'index')); ?></td>
            <td>
                <?php echo $this->Html->link('Index', array('controller' => 'posts', 'action' => 'index', 'ext' => 'json')); ?> |
                <?php echo $this->Html->link('Single', array('controller' => 'posts', 'action' => 'view', 1, 'ext' => 'json')); ?>
            </td>
        </tr>
        <tr>
            <td>Users</td>
            <td><?php echo $this->Html->link('Index', array('controller' => 'users', 'action' => 'index')); ?></td>
            <td>
                <?php echo $this->Html->link('Index', array('controller' => 'users', 'action' => 'index', 'ext' => 'json')); ?> |
                <?php echo $this->Html->link('Single', array('controller' => 'users', 'action' => 'view', 1, 'ext' => 'json')); ?>
            </td>
        </tr>
    </table>
</div>
