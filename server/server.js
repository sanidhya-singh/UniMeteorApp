Accounts.config({
  sendVerificationEmail: true
});

Accounts.validateLoginAttempt(function(attempt){
  /*if (attempt.user && attempt.user.emails && !attempt.user.emails[0].verified ) {
    throw new Meteor.Error(400, 'Please verify your email');
    return false; // the login is aborted
  }*/
  return true;
});

Accounts.validateNewUser(function (user) {
    if (user.emails[0].address.indexOf("snu.edu.in") != -1) {
      return true;
    }
    throw new Meteor.Error(1, "You are not a valid user of this application.");
});
