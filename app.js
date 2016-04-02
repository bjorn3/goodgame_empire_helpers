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
