/* global Meteor, Template, Session, Router */
/* globals Castles */

Router.route("/distance", function(){
    this.render("distance");
});

if(Meteor.isClient){

    Template.distance.onCreated(function(){
        Session.set("world", "gras");
        let castle = Castles.findOne({wereld:"gras"});
        if(castle){
            Session.set("castle", castle.name);
        }else{
            Session.set("castle", null);
        }
    });

    Template.distance.events({
        "change #world": function(event, self){
            Session.set("world", self.$("#world")[0].selectedOptions[0].textContent);
            if(!Session.get("world")){
               Session.set("world", "gras");
            }

        }
    });

    Template.distance.helpers({
        castles: function(){
            return Castles.find({
                wereld: Session.get("world")
            });
        }
    });
}
