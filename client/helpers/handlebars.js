Template.registerHelper('pluralize', function(n, thing) {
  // fairly stupid pluralizer
  if (n === 1) {
    return '1 ' + thing;
  } else {
    return n + ' ' + thing + 's';
  }
});

Template.registerHelper('getFromSession', function(arg) {
  return Session.get(arg);
});

Template.registerHelper('getLastSeen', function(date) {
  var currentTime = new Date();
  currentTime = currentTime.getTime();
  var postTime = date;
  var timeElapsed = currentTime - postTime.getTime();
  var timeElapsed = Math.round(timeElapsed/1000/60);
  if(timeElapsed < 1) {
    return " a few seconds ago";
  }
  else if(timeElapsed == 1) {
    return " a minute ago";
  }
  else if(timeElapsed > 1 && timeElapsed < 60) {
    return timeElapsed + " minutes ago";
  }
  else if(timeElapsed >= 60 && timeElapsed < 1440) {
    return Math.round(timeElapsed/60) + "h ago";
  }
  else if(timeElapsed >= 1440) {
    return Math.round(timeElapsed/60/24) + "d ago";
  }
});
