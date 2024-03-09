const columnsBairro = [
  { data: "nome", autowidth: true },
  { data: "descricao", autowidth: true },
  { data: "createdAt", autowidth: true },
  { data: "btn", autowidth: true },
];

const columnsMarkings = [
  { data: "name", autowidth: true },
  { data: "code", autowidth: true },
  { data: "ref", autowidth: true },
  { data: "bairro", autowidth: true },
  { data: "categoria", autowidth: true },
  { data: "createdAt", autowidth: true },
  { data: "btn", autowidth: true },
];

const columnscategoria = [
  { data: "nome", autowidth: true },
  { data: "createdAt", autowidth: true },
  { data: "btn", autowidth: true },
];

const columnsUtente = [
  { data: "nome", autowidth: true },
  { data: "bi", autowidth: true },
  { data: "genero", autowidth: true },
  { data: "email", autowidth: true },
  { data: "telefone", autowidth: true },
  { data: "createdAt", autowidth: true },
  { data: "btn", autowidth: true },
];

$(function () {
  //Plugins
  $(".select2").select2();

  // Loading Tables
  loadTable("#table-bairro", "/bairro", columnsBairro);
  loadTable("#table-markings", "/markings", columnsMarkings);
  loadTable("#table-categoria", "/categoria", columnscategoria);
  loadTable("#table-utente", "/utente", columnsUtente);

  // Bottons Clicks
  $("#btn-novo-bairro").click((e) => {
    $("#card-title").text("Novo Registro");
    showModal("#modal-bairro");
  });

  $("#btn-novo-categoria").click((e) => {
    $("#card-title").text("Novo Registro");
    showModal("#modal-categoria");
  });

  $("#btn-novo-utente").click((e) => {
    $("#card-title").text("Novo Registro");
    showModal("#modal-utente");
  });

  // Submit Forms
  submitForm("bairro");
  submitForm("markings");
  submitForm("categoria");
  submitForm("utente");
});

function loadTable(table, url, columns) {
  $(table)
    .DataTable({
      responsive: true,
      lengthChange: true,
      autoWidth: true,
      buttons: ["excel", "pdf", "print", "colvis"],
      language: {
        lengthMenu: "Exibir _MENU_ Registros por página",
        search: "Procurar",
        paginate: { previous: "Retornar", next: "Avançar" },
        zeroRecords: "Nenhum registro foi encontrado",
        info: "Exibindo página _PAGE_ de _PAGES_ (_MAX_ registros.)",
        infoEmpty: "Sem registros",
      },
      processing: true,
      filter: true,
      lengthMenu: [
        [5, 10, 25, -1],
        [5, 10, 25, "Todos"],
      ],
      pageLength: 10,
      //order: [3, "asc"],
      ajax: {
        url: url,
        type: "GET",
        dataType: "json",
      },
      columns: columns,
    })
    .buttons()
    .container()
    .appendTo(`${table}_wrapper .col-md-6:eq(0)`);
}

function refreshTable(table) {
  $(table).DataTable().ajax.reload();
}

function showModal(modal) {
  $(modal).modal("show");
}

function submitForm(model) {
  $(`#form-${model}`).submit((e) => {
    e.preventDefault();

    var data = $(`#form-${model}`).serialize();
    data = convertSerializedToJSON(data);

    fetch(`/${model}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        // alert(data.message);
        $(`#modal-${model}`).modal("hide");
        refreshTable(`#table-${model}`);
        clearForm(`#form-${model}`);
      })
      .catch((error) => {
        alert(error.message);
      });
  });
}

function clearForm(form) {
  $("#id").val(-1);
  $(form)[0].reset();
}

function convertSerializedToJSON(serializedData) {
  var dataArray = serializedData.split("&").map((pair) => {
    var keyValue = pair.split("=");
    return { name: keyValue[0], value: decodeURIComponent(keyValue[1] || "") };
  });

  var jsonData = {};
  dataArray.forEach((item) => {
    jsonData[item.name] = item.value;
  });

  return jsonData;
}

function onDelete(id, model) {
  if (confirm(`Tens certeza que pretendes deletrar este registro?`)) {
    fetch(`/${model}/${id}`, {
      method: "DELETE",
    })
      .then((response) => {
        // alert("Deletado com sucesso");
        refreshTable(`#table-${model}`);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }
}

function onEdit(id, model) {
  $("#card-title").text("Editar Registro");
  fetch(`/${model}/${id}`, {
    method: "GET",
  })
    .then((response) => response.json())
    .then((data) => {
      $.each(data, (key, value) => {
        $(`#${key}`).val(value).change();
      });
      showModal(`#modal-${model}`);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}
