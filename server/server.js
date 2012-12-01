/**
 * Created with JetBrains WebStorm.
 * User: Panda
 * Date: 2012.11.19.
 * Time: 0:22
 * To change this template use File | Settings | File Templates.
 */
Meteor.publish("events", function () {
    return Events.find({});
});



Accounts.onCreateUser(function(options, user) {
    if (options.profile) { // maintain the default behavior
        user.profile = options.profile;
    }

    // get profile data from Facebook
    var result = Meteor.http.get("https://graph.facebook.com/me?fields=id,name,picture", {
        params: {access_token: user.services.facebook.accessToken}});

    if ( !result.error && result.data) {
        // if successfully obtained facebook profile, save it off
        user.profile.facebook = result.data;
    }

    return user;
});


