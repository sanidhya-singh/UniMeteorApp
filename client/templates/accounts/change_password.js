Template.changePassword.events({
  'click .logout': function(e) {
    e.preventDefault();
    Meteor.logout();
    Router.go('home');
  }
});
