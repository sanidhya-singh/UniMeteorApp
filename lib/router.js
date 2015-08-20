Router.configure({
  layoutTemplate: 'layout',
  loadingTemplate: 'loading',
  notFoundTemplate: 'notFound',
  waitOn: function() {
    return [Meteor.subscribe('notifications')]
  }
});

Router.route('/posts/:_id', {
  name: 'postPage',
  waitOn: function() {
    return [
      Meteor.subscribe('singlePost', this.params._id),
      Meteor.subscribe('comments', this.params._id)
    ];
  },
  data: function() { return Posts.findOne(this.params._id); }
});

Router.route('/posts/:_id/edit', {
  name: 'postEdit',
  waitOn: function() {
    return Meteor.subscribe('singlePost', this.params._id);
  },
  data: function() { return Posts.findOne(this.params._id); }
});

Router.route('/submit', {
  name: 'postSubmit'
  }
);

var requireLogin = function() {
  if (! Meteor.user()) {
    if (Meteor.loggingIn()) {
      this.render(this.loadingTemplate);
    } else {
      this.render('accessDenied');
    }
  } else {
    this.next();
  }
}

Router.onBeforeAction('dataNotFound', {only: 'postPage'});
Router.onBeforeAction(requireLogin, {only: 'postSubmit'});


PostsListController = RouteController.extend({
  template: 'postsList',
  increment: 6,
  postsLimit: function() {
    return parseInt(this.params.postsLimit) || this.increment;
  },
  findOptions: function() {
    return {sort: this.sort, limit: this.postsLimit()};
  },
  subscriptions: function() {
    this.postsSub = Meteor.subscribe('posts', this.findOptions());
  },
  posts: function() {
    return Posts.find({}, this.findOptions());
  },
  data: function() {
    var self = this;
    return {
      posts: self.posts(),
      ready: self.postsSub.ready,
      nextPath: function() {
        if (self.posts().count() === self.postsLimit())
          return self.nextPath();
      }
    };
  }
});

NewPostsController = PostsListController.extend({
  sort: {submitted: -1, _id: -1},
  nextPath: function() {
    return Router.routes.newPosts.path({postsLimit: this.postsLimit() + this.increment})
  }
});

BestPostsController = PostsListController.extend({
  sort: {votes: -1, submitted: -1, _id: -1},
  nextPath: function() {
    return Router.routes.bestPosts.path({postsLimit: this.postsLimit() + this.increment})
  }
});

TagController = RouteController.extend({
            template: 'tagList',
            increment: 6,
            postsLimit: function() {
              return parseInt(this.params.postsLimit);
            },
            findOptions: function() {
              return {sort: {votes: -1}, limit: this.postsLimit()};
            },
            subscriptions: function() {
              this.postsSub = Meteor.subscribe('taggedPosts', this.params.tagged, this.findOptions());
            },
            posts: function() {
              return Posts.find({}, this.findOptions());
            },
            data: function() {
              Session.set('tag', this.params.tagged);
              var hasMore = this.posts().count() === this.postsLimit();
              var temp = Router.current().location.get().path;
              var nextPath = temp.substring(0, temp.lastIndexOf("/") + 1) + (this.postsLimit() + this.increment);
              return {
                  posts: this.posts(),
                  ready: this.postsSub.ready,
                  nextPath: hasMore ? nextPath : null
              };
            }
});

Router.route('/about', {
  name: 'about'
});

Router.route('/test', {
  name: 'test',
  template: 'mapTest'
});

Router.route('/', {
  name: 'home',
  controller: NewPostsController
});

Router.route('/new/:postsLimit?', {name: 'newPosts'});
Router.route('/best/:postsLimit?', {name: 'bestPosts'});
Router.route('/tag/:tagged/:postsLimit?', {name: 'tag'});
