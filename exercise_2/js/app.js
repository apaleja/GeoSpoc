$(function() {
    // Setup leaflet map
    var map = new L.Map('map');

    var basemapLayer = new L.TileLayer('http://{s}.tiles.mapbox.com/v3/github.map-xgq2svrz/{z}/{x}/{y}.png');

    // Center map and default zoom level
    map.setView([17.913, -77.242], 8);

    // Adds the background layer to the map
    map.addLayer(basemapLayer);

    var shipIcon = L.icon({
        iconUrl: 'ship-icon.png',
        iconSize: [7, 20], // size of the icon
        shadowSize: [0, 0], // size of the shadow
        iconAnchor: [3.5, 10], // point of the icon which will correspond to marker's location
        shadowAnchor: [0, 0], // the same for the shadow
        popupAnchor: [0, -10] // point from which the popup should open relative to the iconAnchor
    });

    // Playback options
    var playbackOptions = {
        playControl: false,
        dateControl: false,
        sliderControl: false,
        orientIcons:true,
        tickLen: 1000,
        marker: function(){
            return {
                icon: shipIcon,
                getPopup: function (feature) {
                    return feature.properties.mmsi;
                }
            };
        }
    };

    // Initialize playback
    $.ajax("data/new-ships-latlon.geojson", {
        success: function(data) {
            //var ships = JSON.parse(data);
            var ships = jQuery.grep(JSON.parse(data), function( a ) {
                return a.properties.time.length > 1;
            });
            console.log(ships);

            var playback = new L.Playback(map, ships, null, playbackOptions);
            // Initialize custom control
            var control = new L.Playback.Control(playback);
            control.addTo(map);

            //playback.addData(ships);
            console.log("Ship tracks loaded successfully")
        },
        error: function() {
            alert("Error: Unable to load Ship Tracks ")
        }
    });
});
