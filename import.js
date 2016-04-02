Router.route("/import", function(){
    this.render("import");
});

if(Meteor.isClient){
    Template.import.events({
        "click #import": function(){
            console.log("Importing...");
            let json_str = $("#json").val().trim();
            try{
                let json = JSON.parse(json_str);
                console.log(json);
                for(let castle of json){
                    Castles.insert(castle);
                }
                console.log(" [done]");
            }catch(e){
                console.log(" [failed]");
                console.log(e);
                console.log(json_str);
            }
        }
    });
}