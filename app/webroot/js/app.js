var App = Ember.Application.create({
    rootElement: '#ember-app'
});

App.ApplicationAdapter = DS.CakeRESTAdapter.extend({
    namespace: 'apps/cakephp-test'
});

App.Router.map(function() {
    this.resource('posts', function() {
        this.resource('post', {'path': ':post_id'});
    });
    this.resource('users', function() {
        this.resource('user', {'path': ':user_id'});
    });
    this.resource('comments', function() {
        this.resource('comment', {'path': ':comment_id'});
    });
});

App.Post = DS.Model.extend({
    title: DS.attr(),
    content: DS.attr(),
    created: DS.attr(),
    modified: DS.attr()
});

App.User = DS.Model.extend({
    firstname: DS.attr(),
    surname: DS.attr(),

    fullName: function() {
        return this.get('firstname') + ' ' + this.get('surname');
    }.property('firstname', 'surname')
});

App.Comment = DS.Model.extend({
    comment: DS.attr(),
    post: DS.belongsTo('post')
});

App.PostsRoute = Ember.Route.extend({
    model: function() {
        return this.store.findAll('post');
    }
});

App.UsersRoute = Ember.Route.extend({
    model: function() {
        return this.store.findAll('user');
    }
});

App.CommentsRoute = Ember.Route.extend({
    model: function() {
        return this.store.findAll('comment');
    }
});
