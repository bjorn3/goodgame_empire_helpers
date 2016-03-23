/* global Meteor, Template, Session, Router, AccountsTemplates, $ */

Router.configure({
    layoutTemplate: "layout"
});

AccountsTemplates.configure({
    defaultLayout: "layout"
});

Router.route("/", {
    name: "home",
    path: "/",
    action: function(){
        this.redirect("/distance");
    }
});

Router.plugin('ensureSignedIn', {
    except: ['home', 'atSignIn', 'atSignUp', 'atForgotPassword']
});

AccountsTemplates.configureRoute("signIn");

Router.route("/logout", function(){
    AccountsTemplates.logout();
    this.redirect("/");
});

if (Meteor.isClient) {
    // counter starts at 0
    Session.setDefault('counter', 0);

    Template.hello.helpers({
        counter: function () {
            return Session.get('counter');
        }
    });

    Template.hello.events({
        'click button': function () {
            // increment the counter when button is clicked
            Session.set('counter', Session.get('counter') + 1);
        }
    });

    Template.layout.onRendered(function(){
        $(this.$[0]).foundation();
    });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
