var imageStore = new FS.Store.GridFS("images");

Images = new FS.Collection("images", {
 stores: [imageStore],
 filter: {
    maxSize: 2097152, // in bytes
    allow: {
      contentTypes: ['image/*'],
      extensions: ['jpg', 'jpeg']
    },
    deny: {
      extensions: ['png']
    },
    onInvalid: function (message) {
      if (Meteor.isClient) {
        console.log(message);
      } else {
        console.log(message);
      }
    }
  }
});

Images.deny({
 insert: function(){
 return false;
 },
 update: function(){
 return false;
 },
 remove: function(){
 return false;
 },
 download: function(){
 return false;
 }
 });

Images.allow({
 insert: function(){
 return true;
 },
 update: function(){
 return true;
 },
 remove: function(){
 return true;
 },
 download: function(){
 return true;
 }
});
