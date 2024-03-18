const express = require("express");
const path = require("path");
const fs = require("fs");
const multer = require("multer");
const sqlite3 = require("better-sqlite3");
const sqlite = require("sqlite3").verbose();

const router = express.Router();
const prisma = require("../db");
const { isAdmin } = require("./midlewares");
const {
  logOperation,
  getCurrentDate,
  successMessage,
  errorMessage,
} = require("./utlis");

const upload = multer();
const dbPath = path.join(__dirname, "../prisma/dev.db");

router.get("/page", isAdmin, async (req, res) => {
  try {
    const logs = await prisma.log.findMany({
      orderBy: [
        {
          createdAt: "desc",
        },
      ],
      include: { user: true },
    });
    return res.render("settings", { logs });
  } catch (error) {
    return;
  }
});

router.get("/update-theme", async (req, res) => {
  try {
    const user = req.session.user;
    let theme = user.theme == "dark-mode" ? "light-mode" : "dark-mode";
    await prisma.user.update({
      data: { theme },
      where: { id: Number(user.id) },
    });
    req.session.user.theme = theme;
    return res.json({ theme });
  } catch (error) {
    return;
  }
});

router.get("/backup", async (req, res) => {
  try {
    const db = sqlite3(dbPath);
    await db.backup(path.join(__dirname, "../backup/backup.db"));
    logOperation("BackUp Realizado com sucesso.", req.session.user.id);
    res.json(successMessage("Backup Realizado com Sucesso"));
  } catch (error) {
    logOperation("Erro ao fazer o backup", 3, false);
  }
});

router.get("/restore", async (req, res) => {
  try {
    const db = new sqlite.Database(dbPath);
    const backupPath = path.join(__dirname, "../backup/backup.db");
    console.log("Dentro");
    db.serialize(function () {
      db.backup(backupPath)
        .step(1)
        .on("end", function () {
          console.log("Sucesso");
          logOperation("Backup realizado com sucesso", req.session.user.id);
          res.json(successMessage("Restauração realizada com sucesso"));
        })
        .on("error", function (err) {
          logOperation("Erro ao fazer a restauração", 3, false);
          console.log(err);
          res.status(500).json(errorMessage("Erro ao rastaurar os dados"));
        });
    });
  } catch (error) {
    logOperation("Erro ao fazer a restauração", 3, false);
    console.log(error);
    res.status(500).json({ error: "Erro no servidor" });
  }
});

function restoreBD() {}

module.exports = router;
