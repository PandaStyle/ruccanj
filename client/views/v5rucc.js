var $container,
    $optionSets,
    $optionLinks;


Session.set("currentPage", null);


Router = new RuccRouter;


//This is DOm Ready
Meteor.startup(function () {

    $container = $('#container');
    $optionSets = $('#filters .labelfilters');
    $optionLinks = $optionSets.find('span');


    Meteor.subscribe("events", function(){
        //the magic happens here
        Meteor.flush();

        $container.isotope({
            itemSelector : '.box',
            animationEngine: 'best-available'
        });

        setupFilterEvents();
    });


    Backbone.history.start({pushState: true});

});

///////////////////////////////////////////////////////////////////////////////
// pageContent
Template.pageContent.newPage = function () {
    return Session.get("currentPage") == "newPage";
};

Template.pageContent.mainPage = function () {
    return Session.get("currentPage") == "mainPage";
};


Template.new.rendered= function(){
    openMap(1);
}
///////////////////////////////////////////////////////////////////////////////
// Filter event handlers
function setupFilterEvents(){
    $optionLinks.click(function(){
        var $this = $(this),
            tempval = $this.attr('data-label');
        // don't proceed if already selected
        if ( tempval == "" ) {
            return false;
        }
        var $optionSet = $this.parents('.labelfilters');
        var offolni = $this.hasClass('sel') ? true : false;
        $optionSet.find('.sel').removeClass('sel');
        if (!offolni) $this.addClass('sel');

        // make option object dynamically, i.e. { filter: '.my-filter-class' }
        var options = {},
            key = "filter",
            value = !offolni ? "[data-labels*=" + tempval + "]" : "*";
        // parse 'false' as false boolean
        value = value === 'false' ? false : value;
        options[ key ] = value;
        console.log(key, value)
        if ( key === 'layoutMode' && typeof changeLayoutMode === 'function' ) {
            // changes in layout modes need extra logic
            changeLayoutMode( $this, options )
        } else {
            // otherwise, apply new options
            $container.isotope( options );
        }

        return false;
    });
}

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

Template.main.showCreateDialog = function () {
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



///////////////////////////////////////////////////////////////////////////////
// Isotope extend functions
$.Isotope.prototype._getCenteredMasonryColumns = function() {
    this.width = this.element.width();

    var parentWidth = this.element.parent().width();

    var colW = this.options.masonry && this.options.masonry.columnWidth ||
        this.$filteredAtoms.outerWidth(true) ||
        parentWidth;

    var cols = Math.floor( parentWidth / colW );
    cols = Math.max( cols, 1 );

    this.masonry.cols = cols;
    this.masonry.columnWidth = colW;
};

$.Isotope.prototype._masonryReset = function() {
    this.masonry = {};
    // FIXME shouldn't have to call this again
    this._getCenteredMasonryColumns();
    var i = this.masonry.cols;
    this.masonry.colYs = [];
    while (i--) {
        this.masonry.colYs.push( 0 );
    }
};

$.Isotope.prototype._masonryResizeChanged = function() {
    var prevColCount = this.masonry.cols;
    this._getCenteredMasonryColumns();
    return ( this.masonry.cols !== prevColCount );
};

$.Isotope.prototype._masonryGetContainerSize = function() {
    var unusedCols = 0,
        i = this.masonry.cols;
    while ( --i ) {
        if ( this.masonry.colYs[i] !== 0 ) {
            break;
        }
        unusedCols++;
    }

    return {
        height : Math.max.apply( Math, this.masonry.colYs ),
        width : (this.masonry.cols - unusedCols) * this.masonry.columnWidth
    };
};

