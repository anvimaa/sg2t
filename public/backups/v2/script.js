//Inicializar Mapa
var map = L.map("map").setView([-7.60874, 15.06131], 15);

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

// Definir as camadas
let baseLayers = {
  "Ver como Satálite": googleSat,
  "Ver como Open Street": osm,
  "Ver como Tráfego": googleTraffic,
};

// Apresentar o mapa
googleSat.addTo(map);

// Adicionar controle de camadas ao mapa
L.control.layers(baseLayers).addTo(map);

var drawnItems = new L.FeatureGroup();
map.addLayer(drawnItems);

var drawControl = new L.Control.Draw({
  draw: {
    marker: false,
    polyline: false,
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

var featureGroup = L.featureGroup().addTo(map);

map.on("draw:created", function (e) {
  var type = e.layerType;
  var layer = e.layer;

  var tempMarker = featureGroup.addLayer(e.layer);

  var popupContent =
    '<form role="form" id="form">' +
    '<div class="form-group">' +
    '<label class="control-label"><strong>Nome: </strong></label>' +
    '<input type="text" placeholder="Nome do Local" id="name" name="name" class="form-control"/>' +
    "</div>" +
    '<div class="form-group">' +
    '<label class="control-label"><strong>Código: </strong></label>' +
    '<input type="text" placeholder="Código" id="code" name="code" class="form-control"/>' +
    "</div>" +
    '<div class="form-group">' +
    '<label class="control-label"><strong>Referência: </strong></label>' +
    '<input type="text" placeholder="Referência" id="ref" name="ref" class="form-control"/>' +
    "</div>" +
    '<div class="form-group">' +
    '<div style="text-align:center;"><button type="submit" value="submit" class="btn btn-primary trigger-submit">Salvar</button></div>' +
    "</div>" +
    "</form>";

  tempMarker
    .bindPopup(popupContent, {
      keepInView: true,
      closeButton: false,
    })
    .openPopup();

  $("#form").submit(function (e) {
    e.preventDefault();
    let name = $("#name").val();
    let code = $("#code").val();
    let ref = $("#ref").val();

    var geojson = JSON.stringify(layer.toGeoJSON());

    //Salvar Dados na Base de Dados
    fetch("/markings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ type, geojson, name, code, ref }),
    })
      .then((response) => response.json())
      .then((data) => {
        tempMarker.closePopup();
        console.log(data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  });
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
    "SySInfra, Administração Municipal do Uíe<br>Serviços Técnicos e Infra-Estruturas<br>&copy;AnvimaTech todos direitos reservados";
};
title.addTo(map);

//Bascar objetos na Base
fetch("/markings")
  .then((response) => response.json())
  .then((data) => {
    data.forEach((marking) => {
      var layer = L.geoJSON(JSON.parse(marking.geojson));

      // Adicionar um evento de clique à camada GeoJSON
      layer.on("click", function (event) {
        // Criar o conteúdo do popup com as informações adicionais
        let popupContent =
          "<strong>Nome:</strong> " +
          marking.name +
          "<br>" +
          "<strong>Código:</strong> " +
          marking.code +
          "<br>" +
          "<strong>Referência:</strong> " +
          marking.ref;

        // Exibir o popup no local do clique
        L.popup().setLatLng(event.latlng).setContent(popupContent).openOn(map);
      });
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
