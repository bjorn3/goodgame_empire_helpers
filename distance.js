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
            let castles = Castles.find({
                wereld: Session.get("world")
            });
            return castles.fetch().map(function(castle){
                let cmpCastle = Castles.findOne(Session.get("castle"));
                if(!cmpCastle){
                    castle.distance = "Selecteer een kasteel";
                }else{
                    let diff_x = Math.abs(castle.X - cmpCastle.X);
                    let diff_y = Math.abs(castle.Y - cmpCastle.Y);
                    castle.distance = Math.sqrt(Math.pow(diff_x, 2) + Math.pow(diff_y, 2));
                }
                return castle;
            }).sort(function(a,b){
                if(a.distance === "Selecteer een kasteel"){
                    return -1;
                }else{
                    return a.distance > b.distance;
                }
            });
        }
    });
}
