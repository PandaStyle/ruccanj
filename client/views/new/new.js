/**
 * Created with JetBrains WebStorm.
 * User: Panda
 * Date: 2012.11.22.
 * Time: 22:11
 * To change this template use File | Settings | File Templates.
 */


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
         isPublic : template.find("#form-public").val()[0] === 0,
         title : template.find("#form-title").val(),
         date : template.find("#form-when").val(),
         location : template.find("#form-where").val(),
         description : template.find("#form-info").val(),
         tag : template.find("select#form-tags :selected").val()
    }

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
                public: formValues.isPublic
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
            $(evt.target).state('complete');
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
                        if ( term.length < 2 ) {
                            return false;
                        }
                    },
                    focus: function( event, ui ) {
                        $( "#project" ).val( ui.item.label );
                        return false;
                    },
                    select: function( event, ui ) {

                        $(".selectedFriends").append($("<li>", {text: ui.item.label}));

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



//                $( "#form-findfriends").autocomplete({
//                    minLength: 0,
//                    source: friends,
//                    focus: function( event, ui ) {
//
//                        return false;
//                    },
//                    select: function( event, ui ) {
//                        $( "#form-findfriends" ).val( ui.item.name );
//                        $( "#project-id" ).val( ui.item.name );
//                        $( "#project-description" ).html( ui.item.name );
//                        $( "#project-icon" ).attr( "src",  ui.item.picUrl );
//
//                        return false;
//                    }
//                })
//                    .data( "autocomplete" )._renderItem = function( ul, item ) {
//                    return $( "<li>" )
//                        .data( "item.autocomplete", item )
//                        .append( "<a>" + item.name + "<br></a>" )
//                        .appendTo( ul );
//                };


            }

            //
        }

    }

})




