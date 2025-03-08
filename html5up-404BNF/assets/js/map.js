require([
    "esri/Map",
    "esri/views/MapView",
    "esri/Graphic",
    "esri/symbols/SimpleMarkerSymbol" // or "esri/symbols/PictureMarkerSymbol"
], function(Map, MapView, Graphic, SimpleMarkerSymbol) {
    const map = new Map({
        basemap: "topo-vector"
    });

    const view = new MapView({
        container: "mapDiv",
        map: map,
        center: [-118.244, 34.052],
        zoom: 12
    });

    const point = {
        type: "point",
        longitude: -118.244,
        latitude: 34.052
    };

    const simpleMarkerSymbol = {
        type: "simple-marker",
        color: [226, 119, 40],
        outline: {
            color: [255, 255, 255],
            width: 1
        }
    };

    const graphic = new Graphic({
        geometry: point,
        symbol: simpleMarkerSymbol
    });

    view.graphics.add(graphic);
});
