const express = require("express");
const path = require("path");
const fs = require("fs");
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

router.get("/restore", (req, res) => {
  res.json(successMessage("Restauração realizada com sucesso"));
});

module.exports = router;
