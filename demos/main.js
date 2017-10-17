/*
    Hello source-viewers!
    We're glad you're interested in how Tangram can be used to make amazing maps!
    - The Mapzen Tangram team
*/

(function () {
    var scene_url = 'demos/scene.yaml';

    // Create Tangram as a Leaflet layer
    var layer = Tangram.leafletLayer({
        scene: scene_url,
        events: {
            hover: onHover,     // hover event (defined below)
            click: onClick      // click event (defined below)
        },
        // debug: {
        //     layer_stats: true // enable to collect detailed layer stats, access w/`scene.debug.layerStats()`
        // },
        logLevel: 'debug',
        attribution: '<a href="https://mapzen.com/tangram" target="_blank">Tangram</a> | &copy; OSM contributors | <a href="https://mapzen.com/" target="_blank">Mapzen</a>'
    });

    // Create a Leaflet map
    var map = L.map('map', {
        maxZoom: 20,
        zoomSnap: 0,
        keyboard: false
    });

    // Useful events to subscribe to
    layer.scene.subscribe({
        load: function (msg) {
            // scene was loaded
            injectAPIKey(msg.config);
        },
        update: function (msg) {
            // scene updated
            injectAPIKey(msg.config);
        },
        preUpdate: function (will_render) {
            // before scene update
            // zoom in/out if up/down arrows pressed
            var zoom_step = 0.03;
            if (key.isPressed('up')) {
                map._move(map.getCenter(), map.getZoom() + zoom_step);
            }
            else if (key.isPressed('down')) {
                map._move(map.getCenter(), map.getZoom() - zoom_step);
            }
        },
        postUpdate: function (will_render){
            // after scene update
        },
        view_complete: function (msg) {
            // new set of map tiles was rendered
        },
        error: function (msg) {
            // on error
        },
        warning: function (msg) {
            // on warning
        }
    });

    function injectAPIKey(config) {
        if (config.global.sdk_mapzen_api_key) {
            config.global.sdk_mapzen_api_key = 'mapzen-T3tPjn7';
        }
        else {
            for (var name in config.sources) {
                var source = config.sources[name];
                if (source.url.search('mapzen.com')) {
                    source.url_params = source.url_params || {};
                    source.url_params.api_key = 'mapzen-T3tPjn7';
                }
            }
        }
    }

    // Feature selection
    var el_selection = document.createElement('div'); // DOM element shown on hover
    el_selection.setAttribute('class', 'label');
    map.getContainer().appendChild(el_selection); // append to map

    function onHover (selection) {
        var feature = selection.feature;
        if (feature && feature.properties.name) {
            var name = feature.properties.name;

            el_selection.style.visibility = 'visible';
            el_selection.style.left = selection.pixel.x + 'px';
            el_selection.style.top = selection.pixel.y + 'px';
            el_selection.innerHTML = '<span class="labelInner">' + name + '</span>';
        }
        else {
            el_selection.style.visibility = 'hidden';
        }
    }

    // Link to edit in Open Street Map on alt+click (opens popup window)
    function onClick() {
        if (key.alt) {
            var center = map.getCenter();
            var url = 'https://www.openstreetmap.org/edit?#map=' + map.getZoom() + '/' + center.lat + '/' + center.lng;
            window.open(url, '_blank');
        }
    };

    /*** Map ***/

    window.map = map;
    window.layer = layer;
    window.scene = layer.scene;

    window.addEventListener('load', function() {
        layer.addTo(map);
        layer.bringToFront();
    });
}());
