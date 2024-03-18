const express = require("express");
const path = require("path");
const router = express.Router();
const prisma = require("../db");
const { isAdmin } = require("./midlewares");
const { logOperation, getCurrentDate } = require("./utlis");

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

router.get("/backup", (req, res) => {
  try {
    const filePath = path.join(__dirname, "../prisma/dev.db");
    res.download(filePath, `backup_${getCurrentDate()}.bak`, (err) => {
      if (err) {
        logOperation(
          "Não foi possivel fazer o Backup",
          3,
          false,
          "",
          err.message
        );
      }
      logOperation("BackUp Realizado com sucesso.", req.session.user.id);
    });
    //return res.redirect("/settings/page");
  } catch (error) {
    logOperation("Erro ao fazer o backup", 3, false);
  }
});

module.exports = router;
