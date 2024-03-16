const express = require("express");
const router = express.Router();
const prisma = require("../db");
const { isAdmin } = require("./midlewares");
const { makeButonEditDelete, formatDate, formatDateTime } = require("./utlis");

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
    const settings = await prisma.settings.findFirst({ where: { id: 1 } });
    const theme = settings.theme == "dark-mode" ? "light-mode" : "dark-mode";
    await prisma.settings.update({ data: { theme }, where: { id: 1 } });
    return res.json({ theme });
  } catch (error) {
    return;
  }
});

module.exports = router;
