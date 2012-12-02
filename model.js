// All Events -- data model
// Loaded on both the client and the server

///////////////////////////////////////////////////////////////////////////////
// Events

/*
  Each event is represented by a document in the Events collection:
    owner: user id
    location: String
    title, description: String
    public: Boolean
    invited: Array of user id's that are invited (only if !public)
    rsvps: Array of objects like {user: userId, rsvp: "yes"} (or "no"/"maybe")
*/
Events = new Meteor.Collection("events");

///////////////////////////////////////////////////////////////////////////////
// Tags

/*
 All available tags
 allTags: Array of Strings
 */
Tags = new Meteor.Collection("tags");


//TODO: musthave
//Events.allow({});


Meteor.methods({
  // options should include: title, description, x, y, public
  createEvent: function (options) {
    options = options || {};
    if (! (typeof options.title === "string" && options.title.length &&
           typeof options.description === "string" &&
           options.description.length))
      throw new Meteor.Error(400, "Required parameter missing");
    if (options.title.length > 100)
      throw new Meteor.Error(413, "Title too long");
    if (options.description.length > 1000)
      throw new Meteor.Error(413, "Description too long");


    return Events.insert({
      //owner: this.userId,
      title: options.title,
      date: options.date,
      location: options.location,
      description: options.description,
      tag: options.tag,
      public: !! options.public,
      invitees: options.invitees
    });
  },

   getFriends: function () {
        console.log(Meteor.user().services.facebook.accessToken);
        // get profile data from Facebook
        var result = Meteor.http.get("https://graph.facebook.com/me/friends?fields=name,picture", {
            params: {access_token: Meteor.user().services.facebook.accessToken}});

        if ( !result.error && result.data) {
            // if successfully obtained facebook profile, save it off
            return result.data;
        }
   },

   addTags: function(param){
       for(var i = 0; i < param.array.length; i++){
           Tags.insert({
               name: param.array[i]
           })
       }
   },




    getAccessToken: function () {
        return Meteor.user().services.facebook.accessToken;
    }
});


