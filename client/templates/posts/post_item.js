Template.postItem.helpers({
  ownPost: function() {
    return this.userId == Meteor.userId();
  },
  upvotedClass: function() {
    var userId = Meteor.userId();
    if (userId && !_.include(this.upvoters, userId)) {
      return 'btn-primary upvotable';
    } else {
      return 'disabled';
    }
  }
});

Template.postItem.onRendered(function() {
  $('.cards .image').dimmer({
  on: 'hover'
});
  });
Template.postItem.events({
  'click .upvotable': function(e) {
    e.preventDefault();
    Meteor.call('upvote', this._id);
  },
  'click .delete': function(e) {
    e.preventDefault();
    var currentPostId = this._id;
    swal({
      title: "Delete this post?",
      text: "This change will be irrevocable.",
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: "#DD6B55",
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
      closeOnConfirm: false,
      closeOnCancel: true
    },
    function(isConfirm){
      if (isConfirm) {
        Posts.remove(currentPostId);
        Meteor.call('removeChildComments', currentPostId);
        Router.go('home');
        swal({
          title: 'Post Removed',
          text: 'The post was successfully deleted.',
          timer: 2000,
          type: 'success'
        });
      } else {

      }
    });
  },
  'click .view-post': function(e) {
    Router.go('postPage', {_id: this._id});
  },
  'click .edit-post': function(e) {
    Router.go('postEdit', {_id: this._id});
  }
});
