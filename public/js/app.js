const Toast = Swal.mixin({
  toast: true,
  position: "top",
  showConfirmButton: false,
  timer: 5000,
});

$(function () {
  //Plugins
  $(".select2").select2();

  $("#btn-theme").click((e) => {
    fetch("/settings/update-theme")
      .then((res) => res.json())
      .then((res) => {
        if (res.theme == "light-mode") {
          $("body").removeClass("dark-mode");
          $("#sidebar").removeClass("sidebar-dark-primary");
          $("#navbar").removeClass("navbar-dark");

          $("body").addClass("light-mode");
          $("#sidebar").addClass("sidebar-light-primary");
          $("#navbar").addClass("navbar-light");
        } else {
          $("body").removeClass("light-mode");
          $("#sidebar").removeClass("sidebar-light-primary");
          $("#navbar").removeClass("navbar-light");

          $("body").addClass("dark-mode");
          $("#sidebar").addClass("sidebar-dark-primary");
          $("#navbar").addClass("navbar-dark");
        }
      })
      .catch((e) => {
        console.error(e);
      });
  });
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
      pageLength: 5,
      order: [],
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

function loadSimpleTable(table) {
  $(table).DataTable({
    responsive: true,
    lengthChange: true,
    autoWidth: true,
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
    pageLength: 5,
    order: [],
  });
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

function submitSimpleForm(model) {
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
        alert(data.message);
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

function onDelete(id, model, refresh = "0") {
  if (confirm(`Tens certeza que pretendes deletrar este registro?`)) {
    fetch(`/${model}/${id}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (refresh == "0") refreshTable(`#table-${model}`);
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

function submitSimpleForm(form, url) {
  $(form).submit((e) => {
    e.preventDefault();

    var data = $(form).serialize();
    data = convertSerializedToJSON(data);

    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((res) => {
        Toast.fire({
          icon: res.type,
          title: res.message,
        });
        if (res.type == "success") $(form)[0].reset();
      })
      .catch((e) => {
        Toast.fire({
          icon: "error",
          title: e.message,
        });
      });
  });
}

function submitFileForm(model) {
  $(`#form-${model}`).submit((e) => {
    e.preventDefault();

    const formData = new FormData($(`#form-${model}`)[0]);

    fetch(`/${model}`, {
      method: "POST",
      body: formData,
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
