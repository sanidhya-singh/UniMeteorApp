Template.postSubmit.onCreated(function() {
  Session.set('postSubmitErrors', {});
});

Template.postSubmit.onRendered(function() {
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

Template.postSubmit.helpers({
  errorMessage: function(field) {
    return Session.get('postSubmitErrors')[field];
  },
  errorClass: function (field) {
    return !!Session.get('postSubmitErrors')[field] ? 'has-error' : '';
  }
});

Template.postSubmit.events({
  'submit form': function(e) {
    e.preventDefault();

    // get the MagicSuggest selection
    var data = [];
    var ms = $('#tags').magicSuggest({}).getSelection();
    for(i=0; i<ms.length; i++) {
      data.push(ms[i].id);
    }

    // fetch the uploaded image (if any)
    var photoURL = document.getElementById('lost-item-image').src;

    var post = {
      title: $(e.target).find('[name=title]').val().trim(),
      description: $(e.target).find('[name=description]').val().trim(),
      location: $(e.target).find('[name=location]').val().trim(),
      time: $(e.target).find('[name=my-datepicker]').val(),
      image: photoURL,
      tags: data
    };

    // check for errors in the post attributes
    var errors = validatePost(post);
    if (errors.title || errors.description || errors.location || errors.time || errors.tags)
      return Session.set('postSubmitErrors', errors);

    Meteor.call('postInsert', post, function(error, result) {
      // display the error to the user and abort
      if (error)
        return throwError(error.reason);

      Router.go('postPage', {_id: result._id});
    });
  },
  'change .dataInput': function(event, template) {
    event.preventDefault();
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
              document.getElementById('lost-item-image').src = '/images/loader.gif'
             setTimeout(function() {
               document.getElementById('lost-item-image').src = photoURL;
             }, 4000);
          }
        });
     });
   }
});
