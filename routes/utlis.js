let formatDate = {
  year: "numeric",
  month: "long",
  day: "numeric",
  hour: "numeric",
  minute: "numeric",
};

function makeButonEditDelete(id, model) {
  return `<button class="btn btn-info"onclick="onEdit('${id}','${model}')">
        <i class="fa fa-pen"></i></button>
        <button onclick="onDelete('${id}','${model}')" class="btn btn-danger">
        <i class="fa fa-trash"></i></button>`;
}

module.exports = {
  makeButonEditDelete,
  formatDate,
};
