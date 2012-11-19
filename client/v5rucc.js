Meteor.subscribe("events");
    Meteor.startup(function () {

        Meteor.subscribe("events", function(){

            Meteor.setTimeout(function(){
                var $container = $('#container');
                $container.isotope({
                    itemSelector : '.box'
                });

            }, 10);
        });

    });

///////////////////////////////////////////////////////////////////////////////
// Events
Template.event_list.events = function () {

   return Events.find({});
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

