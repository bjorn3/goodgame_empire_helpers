Router.route("/distance", function(){
    this.render("distance");
});

if(Meteor.isClient){

    Template.distance.onCreated(function(){
        Session.set("world", "gras");
    });

    Template.distance.events({
        "change #world": function(event, self){
            Session.set("world", self.$("#world")[0].selectedOptions[0].textContent);
            if(!Session.get("world")){
               Session.set("world", "gras");
            }
        },
        "change #castles": function(event, self){
            Session.set("castle", self.$("#castles")[0].selectedOptions[0].value);
        }
    });

    Template.distance.helpers({
        castles: function(){
            return Castles.find({
                wereld: Session.get("world")
            });
        },
        castleDistances: function(){
            let world = Session.get("world");
            let castles = Castles.find({
                wereld: world
            });
            
            let cmpCastle = Castles.findOne(Session.get("castle"));
            if(!cmpCastle || cmpCastle.wereld !== world){
                let first_castle = Castles.findOne({wereld:world});
                if(first_castle){
                    Session.set("castle", first_castle.name);
                }else{
                    Session.set("castle", null);
                }
                cmpCastle = first_castle;
            }
            
            return castles.fetch().map(function(castle){
                let diff_x = Math.abs(castle.X - cmpCastle.X);
                let diff_y = Math.abs(castle.Y - cmpCastle.Y);
                castle.distance = Math.sqrt(Math.pow(diff_x, 2) + Math.pow(diff_y, 2));
                return castle;
            }).filter(function(castle){
                return castle.name !== cmpCastle.name;
            }).sort(function(a,b){
                return a.distance > b.distance;
            });
        }
    });
}
