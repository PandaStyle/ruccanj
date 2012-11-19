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
