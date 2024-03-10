let formatDate = {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
};

let formatDateTime = {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "numeric",
  minute: "numeric",
};

let count = 1;

function makeButonEditDelete(id = "", model = "", detail = false) {
  let btn = "";
  if (detail) {
    btn += `<a class="btn btn-info" href="/${model}/detail/${id}">
    <i class="fa fa-info"></i></a>-`;
  }
  btn += `<button class="btn btn-warning"onclick="onEdit('${id}','${model}')">
        <i class="fa fa-pen"></i></button>-
        <button onclick="onDelete('${id}','${model}')" class="btn btn-danger">
        <i class="fa fa-trash"></i></button>`;
  return btn;
}

module.exports = {
  makeButonEditDelete,
  formatDate,
  formatDateTime,
};
