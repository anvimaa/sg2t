//Inicializar Mapa
var map = L.map("map").setView([-7.60874, 15.06131], 13);

//-- Definir os mapas
let osm = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
});

let googleSat = L.tileLayer(
  "http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}",
  {
    maxZoom: 20,
    subdomains: ["mt0", "mt1", "mt2", "mt3"],
  }
);

let googleTraffic = L.tileLayer(
  "https://{s}.google.com/vt/lyrs=m@221097413,traffic&x={x}&y={y}&z={z}",
  {
    maxZoom: 20,
    minZoom: 2,
    subdomains: ["mt0", "mt1", "mt2", "mt3"],
  }
);
//-- Difinir os Mapas

// Apresentar o mapa
googleSat.addTo(map);

// Definir as camadas
let baseLayers = {
  "Ver como Open Street Map": osm,
  "Ver como o Google Mapa Satálite": googleSat,
  "Ver como o Google Mapa Satálite": googleSat,
};

// Adicionar controle de camadas ao mapa
L.control.layers(baseLayers).addTo(map);

var drawnItems = new L.FeatureGroup();
map.addLayer(drawnItems);

var drawControl = new L.Control.Draw({
  draw: {
    marker: true,
    polyline: true,
    rectangle: true,
    polygon: true,
    circle: false,
  },
  edit: {
    featureGroup: drawnItems,
    remove: true,
  },
});
map.addControl(drawControl);

map.on("draw:created", function (e) {
  var type = e.layerType;
  var layer = e.layer;
  var geojson = JSON.stringify(layer.toGeoJSON());

  // Salva no banco de dados
  fetch("/markings", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ type, geojson }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
    })
    .catch((error) => {
      console.error("Error:", error);
    });

  drawnItems.addLayer(layer);
});

// Map Title
var title = new L.Control({ position: "bottomleft" });
title.onAdd = function (map) {
  this._div = L.DomUtil.create("div", "info");
  this.update();
  return this._div;
};
title.update = function () {
  this._div.innerHTML =
    "Create some features<br>with drawing tools<br>then export to geojson file";
};
title.addTo(map);

//Bascar objetos na Base
fetch("/markings")
  .then((response) => response.json())
  .then((data) => {
    data.forEach((marking) => {
      var layer = L.geoJSON(JSON.parse(marking.geojson));
      drawnItems.addLayer(layer);
    });
  })
  .catch((error) => {
    console.error("Error:", error);
  });

document
  .getElementById("toggle-markings")
  .addEventListener("click", function () {
    if (map.hasLayer(drawnItems)) {
      map.removeLayer(drawnItems);
      this.classList.remove("visible");
      this.classList.add("hidden");
    } else {
      map.addLayer(drawnItems);
      this.classList.remove("hidden");
      this.classList.add("visible");
    }
  });
