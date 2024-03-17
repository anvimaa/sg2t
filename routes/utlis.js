const fs = require("fs").promises;
const path = require("path");
const prisma = require("../db");

const formatDate = {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
};

const formatDateTime = {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "numeric",
  minute: "numeric",
};

async function deleteFile(filePath) {
  if (filePath == "/dist/img/avatar.png") return;
  try {
    const file = path.join(__dirname, "../public/", filePath);
    await fs.unlink(file);
  } catch (error) {
    console.error(`Erro ao remover arquivo ${filePath}:`, error);
    throw new Error(`Erro ao remover arquivo ${filePath}.`);
  }
}

async function logOperation(
  description,
  userId,
  success = true,
  route = null,
  errorMessage = null
) {
  try {
    let logDirectory = path.join(__dirname, "../logs");
    let logFilePath = path.join(
      logDirectory,
      `system_logs_${getCurrentDate()}.txt`
    );

    // Verifica se o diretório de logs existe, se não, cria-o
    await fs.mkdir(logDirectory, { recursive: true });

    // // Registra o log na base de dados
    await prisma.log.create({
      data: {
        description,
        success,
        route,
        errorMessage,
        userId,
      },
    });

    // Registra o log em um arquivo de texto
    let logEntry = `[${new Date().toLocaleString()}] - ${
      success ? "SUCCESS" : "ERROR"
    }: ${description}`;

    if (!success && route) {
      logEntry += `\n  Route: ${route}`;
    }

    if (!success && errorMessage) {
      logEntry += `\n  Error Message: ${errorMessage}`;
    }

    logEntry += "\n";

    await fs.appendFile(logFilePath, logEntry, "utf-8");
  } catch (error) {
    console.error("Erro ao registrar operação no log:", error);
  }
}

function getCurrentDate() {
  const now = new Date();
  const year = now.getFullYear();
  const month = (now.getMonth() + 1).toString().padStart(2, "0");
  const day = now.getDate().toString().padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function makeButonEditDelete(
  id,
  model,
  constumnEdit = false,
  detail = false,
  isAdmin = false
) {
  let btn = "";
  if (detail) {
    btn += `<a class="btn btn-info" href="/${model}/detail/${id}">
    <i class="fa fa-info"></i></a>-`;
  }
  if (constumnEdit) {
    btn += `<button class="btn btn-warning"onclick="onEditeModel('${id}')">
        <i class="fa fa-pen"></i></button>-`;
  } else {
    btn += `<button class="btn btn-warning"onclick="onEdit('${id}','${model}')">
        <i class="fa fa-pen"></i></button>-`;
  }
  if (isAdmin) {
    btn += `<button onclick="onDelete('${id}','${model}')" class="btn btn-danger">
          <i class="fa fa-trash"></i></button>`;
  }
  return btn;
}

function errorMessage(message) {
  return { message, type: "error" };
}

function successMessage(message = "Feito com sucesso") {
  return { message, type: "success" };
}

module.exports = {
  makeButonEditDelete,
  formatDate,
  formatDateTime,
  deleteFile,
  logOperation,
  errorMessage,
  successMessage,
};
