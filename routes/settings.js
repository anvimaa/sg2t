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

module.exports = router;
