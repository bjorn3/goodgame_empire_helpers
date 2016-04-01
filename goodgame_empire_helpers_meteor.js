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

Router.route("/import", function(){
    if(this.params.query.json){
        console.log(this.params.query.json);
        try{
            let json = JSON.parse(this.params.query.json);
            console.log(json);
            for(let castle of json){
                Castles.insert(castle);
            }
        }catch(e){
            console.log("invalid json");
        }
    }
    this.render("import");
});
