Template.postEdit.onCreated(function() {
  Session.set('postEditErrors', {});
});

Template.postEdit.onRendered(function() {
  $('#my-datepicker').datepicker();
  $('#tags').magicSuggest({
       allowFreeEntries: true,
       allowDuplicates: false,
       selectionCls: 'magicSuggestSelection',
       placeholder: 'Start typing to tag...',
       noSuggestionText: 'No matches found',
       required: true,
       useTabKey: true,
       useCommaKey: true,
       data: ['Cellphone', 'Laptop', 'Book', 'Wallet', 'Watch', 'Bag', 'Nokia', 'Dell', 'Micromax', 'Samsung', 'Apple', 'YU', 'HP', 'Lenovo', 'Calculator', 'Charger'],
       maxDropHeight: 125
   });
   $(function () {
     $('[data-toggle="tooltip"]').tooltip()
   })
});

Template.postEdit.helpers({
  errorMessage: function(field) {
    return Session.get('postEditErrors')[field];
  },
  errorClass: function (field) {
    return !!Session.get('postEditErrors')[field] ? 'has-error' : '';
  },
  getTags: function() {
  }
});

Template.postEdit.events({
  'submit form': function(e) {
    e.preventDefault();

    var currentPostId = this._id;

    // get the MagicSuggest selection
    var data = [];
    var ms = $('#tags').magicSuggest({}).getSelection();
    for(i=0; i<ms.length; i++) {
      data.push(ms[i].id);
    }

    // fetch the uploaded image (if any)
    var photoURL = document.getElementById('lost-item-image').src;

    var postProperties = {
      title: $(e.target).find('[name=title]').val().trim(),
      description: $(e.target).find('[name=description]').val().trim(),
      location: $(e.target).find('[name=location]').val().trim(),
      time: $(e.target).find('[name=my-datepicker]').val(),
      image: photoURL,
      tags: data
    }

    var errors = validatePost(postProperties);
    if (errors.title || errors.description || errors.location || errors.time || errors.tags)
      return Session.set('postEditErrors', errors);

    Posts.update(currentPostId, {$set: postProperties}, function(error) {
      if (error) {
        // display the error to the user
        throwError(error.reason);
      } else {
        Router.go('postPage', {_id: currentPostId});
      }
    });
  },
  'change .dataInput': function(event, template) {
    event.preventDefault();
    $('#image-loader').addClass('active');
      FS.Utility.eachFile(event, function(file) {
        Images.insert(file, function (err, fileObj) {
          if (err){
            swal({
              title: 'Sorry.',
              text: 'Something went wrong while uploading the file.\n\nPlease make sure you are uploading an image file (.jpg or .jpeg) smaller than 2MB.',
              type: 'error'
            });
             // handle error
          } else {
             // handle success depending what you need to do
             swal({
               title: 'Upload Complete',
               text: 'The file was uploaded successfully!',
               type: 'success',
               timer: 3000,
               showConfirmButton: false
              });
              var photoURL = "/cfs/files/images/" + fileObj._id;
             setTimeout(function() {
               document.getElementById('lost-item-image').src = photoURL;
               $('#image-loader').removeClass('active');
             }, 7000);
          }
        });
     });
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
