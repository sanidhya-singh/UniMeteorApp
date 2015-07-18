Template.about.events({
  'click .sign-up': function(e) {
    e.stopPropagation();
    Template._loginButtons.toggleDropdown();
  }
});
