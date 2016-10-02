/* globals requestAnimationFrame, L */
/* exported init_map, render_map */

const zoom = 10;

window.castles = [];
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

function init_map(){
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
}

function render_map(castleDistances){

    for(let marker of markers){
        try{
            castle_layer.removeLayer(marker);
        }catch(e){
            own_alliance_castle_layer.removeLayer(marker);
        }
    }
    markers = [];

    let own_alliance_castles = castleDistances.filter(function(castle){
        return window.castles.users[castle.owner_id].own_alliance;
    });

    let other_alliance_castles = castleDistances.filter(function(castle){
        return !window.castles.users[castle.owner_id].own_alliance;
    });

    for(let castle of own_alliance_castles){
        let marker = L.marker([castle.x/zoom, castle.y/zoom], {icon:ownAllianceCastleIcon}).bindPopup(castle.name).addTo(own_alliance_castle_layer);
        markers.push(marker);
    }

    own_alliance_castle_layer.refreshClusters();

    requestAnimationFrame(function(){
        for(let castle of other_alliance_castles){
            let marker = L.marker([castle.x/zoom, castle.y/zoom], {icon:castleIcon}).bindPopup(castle.name).addTo(castle_layer);
            markers.push(marker);
        }
        castle_layer.refreshClusters();
    });

}
