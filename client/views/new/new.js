/**
 * Created with JetBrains WebStorm.
 * User: Panda
 * Date: 2012.11.22.
 * Time: 22:11
 * To change this template use File | Settings | File Templates.
 */

var selectedFriends = [];


$.fn.state = function(state) {
    var d = 'disabled'
    return this.each(function () {
        var $this = $(this);
        $this[0].className = $this[0].className.replace(/\bstate-.*?\b/g, '');
        $this.html( $this.data()[state] )
        state == 'loading' ? $this.addClass(d+' state-'+state).attr(d,d) : $this.removeClass(d).removeAttr(d)
    })
}


function getFormValues(){

    var template = $('form#newForm');

    return result = {
         isPublic : !template.find("#form-public").is(':checked'),
         title : template.find("#form-title").val(),
         date : template.find("#form-when").val(),
         location : template.find("#form-where").val(),
         description : template.find("#form-info").val(),
         tag : template.find('input[name$="hiddenTagListA"]').val().split(','),
         invitees: selectedFriends
    }

}

Template.new.rendered = function(){

    $('#form-public').toggleButtons({
        width: 220,
        label: {
            enabled: "Privát",
            disabled: "Publikus"
        },
        style: {
            // Accepted values ["primary", "danger", "info", "success", "warning"] or nothing
            enabled: "info",
            disabled: "success"
        }
    });

    jQuery(".tagManager").tagsManager({
        prefilled: ["Pisa", "Rome"],
        CapitalizeFirstLetter: true,
        preventSubmitOnEnter: true,
        typeahead: true,
        typeaheadAjaxSource: null,
        typeaheadSource: ["Pisa", "Rome", "Milan", "Florence", "New York", "Paris", "Berlin", "London", "Madrid"],
        delimeters: [44, 188, 13],
        backspace: [8],
        blinkBGColor_1: '#FFFF9C',
        blinkBGColor_2: '#CDE69C',
        hiddenTagListName: 'hiddenTagListA'
    });

    openMap(1);
}

Template.new.events({
    'submit form': function(evt){

        evt.preventDefault();

        var formValues = getFormValues();

            Meteor.call('createEvent', {
                title: formValues.title,
                date: formValues.date,
                description: formValues.description,
                location: formValues.location,
                tag: formValues.tag,
                public: formValues.isPublic,
                invitees: formValues.invitees
            }, function (error, party) {
                if(error)
                    console.log(error);

                Router.redirect("/");
            });

    },

    'click #friends': function(evt, tmp){
        $(evt.target).state('loading');
        Meteor.call("getFriends", cb2);



        function cb2(error, data){

            $(evt.target).state('complete')
                         .prop('disabled', true);
            $(".ac").show();
            if(!error){
                var friends = _.map(data.data, function(item){
                    return {
                        label: item.name,
                        value: item.id,
                        picUrl: item.picture.data.url
                    }
                });

                function split( val ) {
                    return val.split( /,\s*/ );
                }
                function extractLast( term ) {
                    return split( term ).pop();
                }


                $( "#project" )
                    .bind( "keydown", function( event ) {
                        if ( event.keyCode === $.ui.keyCode.TAB &&
                            $( this ).data( "autocomplete" ).menu.active ) {
                            event.preventDefault();
                        }
                    })
                .autocomplete({
                    minLength: 0,
                    source: friends,
                    search: function() {
                        // custom minLength
                        var term = extractLast( this.value );
                        if ( term.length < 1 ) {
                            return false;
                        }
                    },
                    focus: function( event, ui ) {
                        $( "#project" ).val( ui.item.label );
                        return false;
                    },
                    select: function( event, ui ) {

                        $(".selectedFriends").append($("<li>", {text: ui.item.label}));

                        selectedFriends.push(ui.item);
                        this.value = "";
                        return false;

                    }
                })
                    .data( "autocomplete" )._renderItem = function( ul, item ) {
                    return $( "<li>" )
                        .data( "item.autocomplete", item )
                        .append( "<a>" + item.label + "<img src=" + item.picUrl + "></img></a>" )
                        .appendTo( ul );
                };


            }

        }

    },

    'click #insert': function(evt){
        var tags = $('input[name$="hiddenTagListA"]').val().split(',');
        debugger;
        Meteor.call("addTags", {array: tags}, function(error, party){
            debugger;
        });
    }

})




