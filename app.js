/* globals Handlebars */

const castles = //insert data.json here

jQuery(function($){
    $("#world").on("change", function(){
        render_castle_list();
        render_table();
    });
    render_castle_list();
    render_table();
});

function render_castle_list(){
    let world = $("#world")[0].selectedOptions[0].textContent;
    let castles_template = Handlebars.compile(`<select id="castles">
            {{#each castles}}
                <option value="{{@index}}">{{name}}</option>
            {{/each}}
        </select>`);
    let world_castles = castles.filter(function(castle){
        return castle.wereld === world;
    });
    $("#castles_wrapper").html(castles_template({castles:world_castles}));
    $("#castles").on("change", function(){
        render_table();
    });
}

function render_table(){
    let world = $("#world")[0].selectedOptions[0].textContent;
    let world_castles = castles.filter(function(castle){
        return castle.wereld === world;
    });
    let selected_castle = world_castles[$("#castles")[0].selectedOptions[0].value];
    let table_template = Handlebars.compile(`{{#each castleDistances}}
            <tr>
                <td width="500">{{name}}</td>
                <td>{{X}}</td>
                <td>{{Y}}</td>
                <td>{{wereld}}</td>
                <td>{{distance}}</td>
            </tr>
        {{/each}}`);
    let castleDistances = world_castles.filter(function(castle){
        return castle != selected_castle;
    }).map(function(castle){
        let diff_x = Math.abs(castle.X - selected_castle.X);
        let diff_y = Math.abs(castle.Y - selected_castle.Y);
        castle.distance = Math.sqrt(Math.pow(diff_x, 2) + Math.pow(diff_y, 2));
        return castle;
    }).sort(function(a, b){
        return a.distance > b.distance;
    }).map(function(castle){
        castle.distance = Math.round(castle.distance);
        return castle;
    });
    $("table#results tbody").html(table_template({castleDistances: castleDistances}));
}