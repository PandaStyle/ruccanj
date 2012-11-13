Meteor.subscribe("events");

if (Meteor.isClient) {
    Meteor.startup(function () {
      //  debugger;
        $('#container').masonry({
            itemSelector: '.box',
            isFitWidth: true
        });
    });

}

///////////////////////////////////////////////////////////////////////////////
// Events
Template.event_list.events = function () {
    return Events.find({}, {sort: {timestamp: 1}});
};

Template.kulso.rendered = function () {
    console.log("kulso kesz");
    initMasonry();
};


var initMasonry = function(){
   // $("#container").masonry( 'reload' );

}

///////////////////////////////////////////////////////////////////////////////
// Create Event dialog
var openCreateDialog = function (x, y) {
    Session.set("createError", null);
    Session.set("showCreateDialog", true);
};

Template.page.showCreateDialog = function () {
    return Session.get("showCreateDialog");
};

Template.createDialog.events({
    'click .save': function (event, template) {
        var title = template.find(".title").value;
        var date = template.find(".date").value;
        var location = template.find(".location").value;
        var description = template.find(".description").value;
        var public = ! template.find(".private").checked;

        if (title.length && description.length) {
            Meteor.call('createEvent', {
                title: title,
                date: date,
                description: description,
                location: location,
                public: public
            }, function (error, party) {
                console.log(error);
            });
            Session.set("showCreateDialog", false);
        } else {
            Session.set("createError",
                "It needs a title and a description, or why bother?");
        }
    },

    'click .cancel': function () {
        Session.set("showCreateDialog", false);
    }
});

Template.createDialog.error = function () {
    return Session.get("createError");
};

Template.jumbotron.events({
    'click #add': function (event, template) {
        openCreateDialog();
    }
});

