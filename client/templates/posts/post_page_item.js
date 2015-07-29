Template.postPageItem.helpers({
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
  },
  stringifyDate: function(date) {
    var split = date.split("/");
    var returnString = split[0] + ' ';
    /*switch(parseInt(split[0])) {
      case 1:
              returnString += split[0] + 'st ';
              break;
      case 2:
              returnString += split[0] + 'nd ';
              break;
      case 3:
              returnString += split[0] + 'rd ';
              break;
      case 21:
              returnString += split[0] + 'st ';
              break;
      case 22:
              returnString += split[0] + 'nd ';
              break;
      case 23:
              returnString += split[0] + 'rd ';
              break;
      case 31:
              returnString += split[0] + 'st ';
              break;
      default:
              returnString += split[0] + 'th ';
              break;
    }*/
    switch(parseInt(split[1])) {
      case 1:
              returnString+= 'January ';
              break;
      case 2:
              returnString+= 'February ';
              break;
      case 3:
              returnString+= 'March ';
              break;

              case 4:
                      returnString+= 'April ';
                      break;
                      case 5:
                              returnString+= 'May ';
                              break;
                              case 6:
                                      returnString+= 'June ';
                                      break;
                                      case 7:
                                              returnString+= 'July ';
                                              break;
                                              case 8:
                                                      returnString+= 'August ';
                                                      break;
                                                      case 9:
                                                              returnString+= 'September ';
                                                              break;
                                                              case 10:
                                                                      returnString+= 'October ';
                                                                      break;
                                                                      case 11:
                                                                              returnString+= 'November ';
                                                                              break;
                                                                              case 12:
                                                                                      returnString+= 'December ';
                                                                                      break;
                                                                                      default:
                                                                                              break;

    }
    returnString += split[2];
    return returnString
  }
});

Template.postPageItem.events({
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
  }
});
