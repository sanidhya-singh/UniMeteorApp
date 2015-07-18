Template.commentItem.helpers({
  submittedText: function() {
    return this.submitted.toString();
  },
  ownComment: function() {
    return this.userId === Meteor.userId();
  }
});

Template.commentItem.events({
  'click .delete': function(e) {
      e.preventDefault();
      var currentCommentId = this._id;
      var postId = this.postId;
      swal({
        title: "Delete this comment?",
        text: "You said: \"" + this.body +  "\"\n\nIf you delete this comment you will not be able to recover it later.",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "Delete",
        cancelButtonText: "Cancel",
        closeOnConfirm: false,
        closeOnCancel: true
       },
       function(isConfirm){   if (isConfirm) {
         Meteor.call('commentRemoved', postId, function(error, currentCommentId) {
           if(error)
             throwError(error.reason);
         });
         Comments.remove(currentCommentId);
         Meteor.call('removeCommentNotifications', currentCommentId);
         swal({
           title: "Comment Removed",
           text: "The comment was successfully deleted.",
           type: "success",
           timer: 2000
          });
        } else {

        }
      });
    },
    'click .edit': function(e) {
      e.preventDefault();
      var commentBody = this.body;
      var currentCommentId = this._id;
      swal({
        title: "Edit Comment",
        text: "Original: \"" + commentBody + "\"",
        type: "input",
        showCancelButton: true,
        closeOnConfirm: false,
        inputPlaceholder: "commentBody"
      },
      function(inputValue){
        if (inputValue === false) return false;
        if (inputValue === "") {
          swal.showInputError("Cannot submit an empty comment");
          return false;
        }
        Comments.update(currentCommentId, {$set: {body: inputValue}});
        swal({
          title: "Comment Updated",
          text: "The comment was successfully updated.",
          type: "success",
          timer: 2000
        });
      });
    }
});
