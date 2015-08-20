Posts = new Mongo.Collection('posts');


Posts.allow({
  update: function(userId, post) { return ownsDocument(userId, post); },
  remove: function(userId, post) { return ownsDocument(userId, post); },
});

Posts.deny({
  update: function(userId, post, fieldNames) {
    // may only edit the following fields:
    return (_.without(fieldNames, 'title', 'description', 'time', 'location', 'tags', 'image').length > 0);
  }
});

Posts.deny({
  update: function(userId, post, fieldNames, modifier) {
    var errors = validatePost(modifier.$set);
    return errors.title || errors.description || errors.location || errors.time || errors.tags;
  }
});

validatePost = function (post) {
  var errors = {};

  if (!post.title)
    errors.title = "Please provide a title";

  if (!post.description)
    errors.description =  "Please provide a description";

  if(!post.time)
    errors.time = "Please provide a time";

  if(!post.location)
    errors.location = "Please provide a location";

  if(post.tags.length < 1)
    errors.tags = "Please provide atleast 1 tag";

  return errors;
}

Meteor.methods({
  postInsert: function(postAttributes) {
    check(this.userId, String);
    check(postAttributes, {
      title: String,
      description: String,
      location: String,
      time: String,
      image: String,
      tags: Array
    });

    var errors = validatePost(postAttributes);
    if (errors.title || errors.description || errors.location || errors.time || errors.tags)
      throw new Meteor.Error('invalid-post', "You must set a title and URL for your post");

    var user = Meteor.user();
    var post = _.extend(postAttributes, {
      userId: user._id,
      author: user.username,
      submitted: new Date(),
      commentsCount: 0,
      upvoters: [],
      votes: 0,
      found: false
    });

    var postId = Posts.insert(post);

    return {
      _id: postId
    };
  },

  upvote: function(postId) {
    check(this.userId, String);
    check(postId, String);

    var affected = Posts.update({
      _id: postId,
      upvoters: {$ne: this.userId}
    }, {
      $addToSet: {upvoters: this.userId},
      $inc: {votes: 1}
    });

    if (! affected)
      throw new Meteor.Error('invalid', "You weren't able to upvote that post");
  }
});
