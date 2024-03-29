const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
const prisma = require("../db");
const { isAuthenticated } = require("./midlewares");
const { logOperation } = require("./utlis");

// Rota de login
router.get("/login", (req, res) => {
  res.render("auth", {
    layout: null,
  });
});

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await prisma.user.findUnique({ where: { username } });

    if (user && (await bcrypt.compare(password, user.password))) {
      await prisma.user.update({
        where: { username },
        data: { lastLogin: new Date(Date.now()) },
      });
      req.session.user = user;
      logOperation(`Sessão iniciada!`, user.id);
      res.redirect("/");
    } else {
      res.redirect("/login");
    }
  } catch (error) {
    logOperation("Erro no servidor", 1, false, "/login", error);
    return;
  }
});

router.post("/register", async (req, res) => {
  const { username, password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.user.create({
    data: {
      username,
      password: hashedPassword,
      isAdmin: true,
    },
  });

  res.redirect("/login");
});

// Rota de logout
router.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/login");
  });
});

module.exports = router;
