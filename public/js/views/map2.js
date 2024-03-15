//sample data values define in us-states.js
var data = us_states;

var map = new L.Map("map", { zoom: 5, center: new L.latLng([37.8, -96]) });

map.addLayer(
  new L.TileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png")
); //base layer

var featuresLayer = new L.GeoJSON(data, {
  style: function (feature) {
    return { color: feature.properties.color };
  },
  onEachFeature: function (feature, marker) {
    marker.bindPopup(
      '<h4 style="color:' +
        feature.properties.color +
        '">' +
        feature.properties.name +
        "</h4>"
    );
  },
});

map.addLayer(featuresLayer);

var drawnItems = new L.FeatureGroup();
map.addLayer(drawnItems);

var searchControl = new L.Control.Search({
  layer: drawnItems,
  propertyName: "name",
  marker: false,
  moveToLocation: function (latlng, title, map) {
    //map.fitBounds( latlng.layer.getBounds() );
    var zoom = map.getBoundsZoom(latlng.layer.getBounds());
    map.setView(latlng, zoom); // access the zoom
  },
});

searchControl
  .on("search:locationfound", function (e) {
    //console.log('search:locationfound', );

    //map.removeLayer(this._markerSearch)

    e.layer.setStyle({ fillColor: "#3f0", color: "#0f0" });
    if (e.layer._popup) e.layer.openPopup();
  })
  .on("search:collapsed", function (e) {
    featuresLayer.eachLayer(function (layer) {
      //restore feature color
      featuresLayer.resetStyle(layer);
    });
  });

map.addControl(searchControl); //inizialize search control

function loadMap() {
  fetch("/markings")
    .then((response) => response.json())
    .then((data) => {
      data.data.forEach((marking) => {
        var layer = L.geoJSON(JSON.parse(marking.geojson), {
          style: {
            fillColor: marking.fillColor,
            weight: marking.weight,
            opacity: 1,
            color: marking.color,
            dashArray: "3",
            fillOpacity: marking.fillOpacity,
          },
        });

        // Adicionar um evento de clique à camada GeoJSON
        layer.on("click", function (event) {
          // Criar o conteúdo do popup com as informações adicionais
          let popupContent = `
              <h3>${marking.name}</h3>
              <h5>Código ${marking.code}</h5>
              <h5>Bairro ${marking.bairro}</h5>
              `;

          // Exibir o popup no local do clique
          L.popup()
            .setLatLng(event.latlng)
            .setContent(popupContent)
            .openOn(map);
        });
        drawnItems.addLayer(layer);
      });
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

loadMap();
