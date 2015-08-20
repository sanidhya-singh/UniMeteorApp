Template.header.helpers({
  activeRouteClass: function(/* route names */) {
    var args = Array.prototype.slice.call(arguments, 0);
    args.pop();

    var active = _.any(args, function(name) {
      return Router.current() && Router.current().route.getName() === name
    });

    return active && 'active';
  }
});

Template.header.onCreated(function() {
     $('.ui.dropdown').dropdown();
});

Template.header.onRendered(function() {
  new WOW().init();
});

Template.header.events({
  'click .mobile-view': function(e) {
    e.preventDefault();
    $('.ui.vertical.menu').toggle();
  },
  'click .toggle-dropdown': function(e) {
    e.preventDefault();
    $('.ui.dropdown').dropdown();
  }
});
