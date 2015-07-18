Comments = new Mongo.Collection('comments');

Comments.allow({
  remove: function(commentId, comment) { return ownsDocument(commentId, comment); },
  update: function(commentId, comment) { return ownsDocument(commentId, comment); }
});

Meteor.methods({
  commentInsert: function(commentAttributes) {
    check(this.userId, String);
    check(commentAttributes, {
      postId: String,
      body: String
    });

    var user = Meteor.user();
    var post = Posts.findOne(commentAttributes.postId);

    if (!post)
      throw new Meteor.Error('invalid-comment', 'You must comment on a post');

    comment = _.extend(commentAttributes, {
      userId: user._id,
      author: user.username,
      submitted: new Date()
    });

    // update the post with the number of comments
    Posts.update(comment.postId, {$inc: {commentsCount: 1}});

    // create the comment, save the id
    comment._id = Comments.insert(comment);

    // now create a notification, informing the user that there's been a comment
    createCommentNotification(comment);

    return comment._id;
  },
  removeChildComments: function(currentPostId) {
    check(currentPostId, String);
    Comments.remove({postId: currentPostId});
    Notifications.remove({postId: currentPostId});
  },
  commentRemoved: function(postId) {
    check(postId, String);
    Posts.update(postId, {$inc: {commentsCount: -1}});
  }
});
