//Inicializar Mapa
var map = L.map("map").setView([-7.61564, 15.059012], 19);

//-- Definir os mapas
let osm = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  useCache: true,
  crossOrigin: true,
});

let googleSat = L.tileLayer(
  "http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}",
  {
    maxZoom: 20,
    subdomains: ["mt0", "mt1", "mt2", "mt3"],
    useCache: true,
    crossOrigin: true,
  }
);

let googleTraffic = L.tileLayer(
  "https://{s}.google.com/vt/lyrs=m@221097413,traffic&x={x}&y={y}&z={z}",
  {
    maxZoom: 20,
    minZoom: 2,
    subdomains: ["mt0", "mt1", "mt2", "mt3"],
    useCache: true,
    crossOrigin: true,
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

// Export Button
var showHome = `<a href="/" title="Voltar" type="button" class="btn btn-primary btn-sm">
<i class="fa fa-home"></i> Pagina Inicial</a>`;
var showHomeButton = new L.Control({ position: "bottomleft" });
showHomeButton.onAdd = function (map) {
  this._div = L.DomUtil.create("div");
  this._div.innerHTML = showHome;
  return this._div;
};
showHomeButton.addTo(map);

// Adicionar controle de camadas ao mapa
L.control.layers(baseLayers).addTo(map);

// Leaflet Draw
var drawnItems = new L.FeatureGroup();
map.addLayer(drawnItems);

var drawControl = new L.Control.Draw({
  edit: {
    featureGroup: drawnItems,
    poly: {
      allowIntersection: false,
    },
  },
  draw: {
    circle: false,
    circlemarker: false,
    polygon: {
      allowIntersection: false,
      showArea: true,
    },
  },
});
map.addControl(drawControl);

//var featureGroup = L.featureGroup().addTo(map);

map.on("draw:created", function (e) {
  openModal(e.layerType, e.layer);
});

// Map Title
var title = new L.Control({ position: "bottomright" });
title.onAdd = function (map) {
  this._div = L.DomUtil.create("div", "info");
  this.update();
  return this._div;
};
title.update = function () {
  this._div.innerHTML = `GIS-AMU, Administração Municipal do Uíge<br>
    Serviços Técnicos e Infra-Estruturas<br>
    &copy; 2024 Anvima Labs todos direitos reservados`;
};
title.addTo(map);

// Export Button
var showExport = `<a href="#" onclick="geojsonExport()" title="Exportar arquivo GeoJSON" type="button" class="btn btn-danger btn-sm text-light">Exportar</a>`;
var showExportButton = new L.Control({ position: "topright" });
showExportButton.onAdd = function (map) {
  this._div = L.DomUtil.create("div");
  this._div.innerHTML = showExport;
  return this._div;
};
showExportButton.addTo(map);

// Show Layer
var showLayers =
  '<a href="#" onclick="showLayer()" title="Ver/Ocultar" type="button" class="btn btn-danger btn-sm text-light">Ver/Ocultar</a>';
var showLayersButton = new L.Control({ position: "topright" });
showLayersButton.onAdd = function (map) {
  this._div = L.DomUtil.create("div");
  this._div.innerHTML = showLayers;
  return this._div;
};
showLayersButton.addTo(map);

async function loadMap() {
  await resetForm();
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

function openModal(type, layer) {
  $("#modal-default").modal("show");
  console.log(type);

  $("#form").submit(function (e) {
    e.preventDefault();
    let name = $("#name").val();
    let code = $("#code").val();
    let ref = $("#ref").val();
    let bairroId = Number($("#bairroId").val());
    let categoriaId = Number($("#categoriaId").val());
    let fillColor = $("#fillColor").val();
    let fillOpacity = Number($("#fillOpacity").val());
    let color = $("#color").val();
    let weight = Number($("#weight").val());
    let id = -1;

    // Add info to feature properties
    feature = layer.feature = layer.feature || {};
    feature.type = feature.type || "Feature";
    var props = (feature.properties = feature.properties || {}); // Intialize feature.properties
    props.name = name;
    props.code = code;
    props.ref = ref;
    props.fillColor = fillColor;
    props.fillOpacity = fillOpacity;
    props.color = color;
    props.weight = weight;
    drawnItems.addLayer(layer);

    let geojson = JSON.stringify(layer.toGeoJSON());
    let data = {
      id,
      type,
      geojson,
      name,
      code,
      ref,
      fillColor,
      fillOpacity,
      color,
      weight,
      bairroId,
      categoriaId,
    };

    console.log(data);

    //Salvar Dados na Base de Dados
    fetch("/markings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        $("#modal-default").modal("hide");
        loadMap();
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  });
}

function showLayer() {
  if (map.hasLayer(drawnItems)) {
    map.removeLayer(drawnItems);
    console.log(this);
  } else {
    map.addLayer(drawnItems);
  }
}

// Export to GeoJSON File
function geojsonExport() {
  let nodata = '{"type":"FeatureCollection","features":[]}';
  let jsonData = JSON.stringify(drawnItems.toGeoJSON());
  let dataUri =
    "data:application/json;charset=utf-8," + encodeURIComponent(jsonData);
  let datenow = new Date();
  let datenowstr = datenow.toLocaleDateString("en-GB");
  let exportFileDefaultName = "export_draw_" + datenowstr + ".geojson";
  let linkElement = document.createElement("a");
  linkElement.setAttribute("href", dataUri);
  linkElement.setAttribute("download", exportFileDefaultName);
  if (jsonData == nodata) {
    alert("No features are drawn");
  } else {
    linkElement.click();
  }
}

function populeteSelect(id, url) {
  $(id).empty();
  $(id).append(`<option selected disabled value="">Escolha uma opção</option>`);
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      data.data.forEach((d) => {
        $(id).append(
          `
          <option value="${d.id}">${d.nome}</option>
          `
        );
      });
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

async function resetForm() {
  $("#name").val("");
  $("#code").val("");
  $("#ref").val("");
  $("#bairroId").val("").change();
  $("#categoriaId").val("").change();
  $("#fillColor").val("#3d7eff");
  $("#fillOpacity").val(3);
  $("#color").val("#ff0000");
  $("#weight").val(2);
  $("#id").val(-1);
}

$(function () {
  $(".select2").select2();
  populeteSelect("#bairroId", "/bairro");
  populeteSelect("#categoriaId", "/categoria");
  loadMap();
});
