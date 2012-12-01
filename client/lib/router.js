/**
 * Created with JetBrains WebStorm.
 * User: Panda
 * Date: 2012.11.21.
 * Time: 23:02
 * To change this template use File | Settings | File Templates.
 */
var RuccRouter = Backbone.Router.extend({
    routes: {
        "": "main",
        "new": "new"
    },
    main: function () {
        Session.set("currentPage", "mainPage");
    },
    new: function () {
        Session.set("currentPage", "newPage");
    },

    redirect: function (url) {
        this.navigate(url, true);
    }
});

Router = new RuccRouter;