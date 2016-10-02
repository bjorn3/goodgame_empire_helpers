/* globals requestAnimationFrame, Handlebars, init_map, render_map */

jQuery(function($){
    $("#data").on("change", function(){
        render_castle_list();
        render_table();
        requestAnimationFrame(function(){
            render_map(get_castles());
        });
    });
    $("#world").on("change", function(){
        render_castle_list();
        render_table();
        requestAnimationFrame(function(){
            render_map(get_castles());
        });
    });
    render_castle_list();
    render_table();

    init_map();
    requestAnimationFrame(function(){
        render_map(get_castles());
    });
});

function render_castle_list(){
    try{
        window.castles = JSON.parse($("#data").val()) || [];
    }catch(e){
        window.castles = {castles:{}};
    }
    let world = $("#world")[0].selectedOptions[0].value;
    let castles_template = Handlebars.compile(`<select id="castles">
            {{#each castles}}
                <option value="{{@index}}">{{name}}</option>
            {{/each}}
        </select>`);
    let world_castles = Object.values(window.castles.castles).filter(function(castle){
        return castle.world === world;
    }).map(function(castle){
        if(!castle.name){
            castle.name = window.castles.users[castle.owner_id].username + "_" + castle.id;
        }
        return castle;
    });
    $("#castles_wrapper").html(castles_template({castles:world_castles}));
    $("#castles").on("change", function(){
        render_table();
    });
}

function get_castles(){
    let world = $("#world")[0].selectedOptions[0].value;
    let world_castles = Object.values(window.castles.castles).filter(function(castle){
        return castle.world === world;
    });
    let selected_castle = {};
    try{
        selected_castle = world_castles[$("#castles")[0].selectedOptions[0].value];
    }catch(e){}
    let castleDistances = world_castles.map(function(castle){
        let diff_x = Math.abs(castle.x - selected_castle.x);
        let diff_y = Math.abs(castle.y - selected_castle.y);
        castle.distance = Math.sqrt(Math.pow(diff_x, 2) + Math.pow(diff_y, 2));
        return castle;
    }).sort(function(a, b){
        return a.distance > b.distance;
    }).map(function(castle){
        if(!castle.name){
            castle.name = window.castles.users[castle.owner_id].username + "_" + castle.id;
        }
        castle.distance = Math.round(castle.distance);
        return castle;
    });
    return castleDistances;
}

function render_table(){
    let world_castles = get_castles();
    let selected_castle = [];
    try{
        selected_castle = world_castles[$("#castles")[0].selectedOptions[0].value];
    }catch(e){
    }

    let castleDistances = get_castles().filter(function(castle){
        return castle != selected_castle;
    });

    let table_template = Handlebars.compile(`{{#each castleDistances}}
            <tr>
                <td width="500">{{name}}</td>
                <td>{{x}}</td>
                <td>{{y}}</td>
                <td>{{distance}}</td>
            </tr>
        {{/each}}`);
    $("table#results tbody").html(table_template({castleDistances: castleDistances}));
}
