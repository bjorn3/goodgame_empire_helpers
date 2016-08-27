/* globals L, Handlebars */

const zoom = 10;

var castles = [];
var map;
var own_alliance_castle_layer;
var castle_layer;
var markers = [];

var ownAllianceCastleIcon = L.icon({
    className: "own_alliance_castle_icon",
    iconUrl: 'marker.castle.color.png',

    iconSize:     [32, 32], // size of the icon
    iconAnchor:   [0, 0], // point of the icon which will correspond to marker's location
    popupAnchor:  [15, 0] // point from which the popup should open relative to the iconAnchor
});

var castleIcon = L.icon({
    iconUrl: 'marker.castle.color.png',

    iconSize:     [32, 32],
    iconAnchor:   [0, 0],
    popupAnchor:  [15, 0]
});
//var castleIcon = L.Icon.Default;

jQuery(function($){
    $("#data").on("change", function(){
        render_castle_list();
        render_table();
        render_map();
    });
    $("#world").on("change", function(){
        render_castle_list();
        render_table();
        render_map();
    });
    render_castle_list();
    render_table();
    
    map = L.map("map", {
        center: [600/zoom,600/zoom],
        zoom: 3,
        minZoom: 2,
        maxZoom: 8,
        maxBounds: [[0,0], [1200/zoom,1200/zoom]],
        crs: L.CRS.Simple
    });
    L.tileLayer('tile.png', {continuousWorld: true, maxNativeZoom: 0, maxZoom: 16}).addTo(map);
    
    own_alliance_castle_layer = L.markerClusterGroup({
        iconCreateFunction: function() {
            let icon = Object.create(ownAllianceCastleIcon);
            icon.options = Object.create(icon.options);
            icon._initHooksCalled = false;
            icon.options.className = "own_alliance_castle_icon multiple_icons";
            return icon;
        },
        maxClusterRadius: 40
    }).addTo(map);
    castle_layer = L.markerClusterGroup({
        iconCreateFunction: function() {
            let icon = Object.create(castleIcon);
            icon.options = Object.create(icon.options);
            icon._initHooksCalled = false;
            icon.options.className = "multiple_icons";
            return icon;
        },
        maxClusterRadius: 40
    }).addTo(map);
    
    render_map();
});

function render_castle_list(){
    try{
        castles = JSON.parse($("#data").val()) || [];
    }catch(e){
        castles = {castles:{}};
    }
    let world = $("#world")[0].selectedOptions[0].value;
    let castles_template = Handlebars.compile(`<select id="castles">
            {{#each castles}}
                <option value="{{@index}}">{{name}}</option>
            {{/each}}
        </select>`);
    let world_castles = Object.values(castles.castles).filter(function(castle){
        return castle.world === world;
    }).map(function(castle){
        if(!castle.name){
            castle.name = castles.users[castle.owner_id].username + "_" + castle.id;
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
    let world_castles = Object.values(castles.castles).filter(function(castle){
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
            castle.name = castles.users[castle.owner_id].username + "_" + castle.id;
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

function render_map(){
    let castleDistances = get_castles();
    
    for(let marker of markers){
        castle_layer.removeLayer(marker);
    }
    markers = [];
    
    let own_alliance_castles = castleDistances.filter(function(castle){
        return castles.users[castle.owner_id].own_alliance;
    });
    
    let other_alliance_castles = castleDistances.filter(function(castle){
        return !castles.users[castle.owner_id].own_alliance;
    });
    
    for(let castle of own_alliance_castles){
        let marker = L.marker([castle.x/zoom, castle.y/zoom], {icon:ownAllianceCastleIcon}).bindPopup(castle.name).addTo(own_alliance_castle_layer);
        markers.push(marker);
    }
    
    for(let castle of other_alliance_castles){
        let marker = L.marker([castle.x/zoom, castle.y/zoom], {icon:castleIcon}).bindPopup(castle.name).addTo(castle_layer);
        markers.push(marker);
    }
    
    castle_layer.refreshClusters();
}
