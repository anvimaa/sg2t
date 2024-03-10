const express = require("express");
const path = require("path");
const bcrypt = require("bcrypt");
const router = express.Router();
const prisma = require("../db");

// Importar as rotas
const markingsRoutes = require("./markings");
const bairroRoutes = require("./bairro");
const categoriaRoutes = require("./categoria");
const utenteRoutes = require("./utente");
const licencaRoute = require("./licenca");
const usersRoute = require("./user");
const settingsRoute = require("./settings");

// Middleware para verificar se o usuário está autenticado
const isAuthenticated = (req, res, next) => {
  if (req.session.user) {
    return next();
  }
  res.redirect("/login");
};

// Middleware para adicionar o usuario em locas
router.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  next();
});

// Rota de login
router.get("/login", (req, res) => {
  res.render("auth", {
    layout: null,
  });
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const user = await prisma.user.findUnique({ where: { username } });

  if (user && (await bcrypt.compare(password, user.password))) {
    req.session.user = user;
    res.redirect("/");
  } else {
    res.redirect("/login");
  }
});

// Rota de registro
router.get("/register", (req, res) => {
  res.render("register");
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

// Rota principal
router.get("/", isAuthenticated, (req, res) => {
  res.render("index");
});

// Rota para ver o mapa
router.get("/map", isAuthenticated, (req, res) => {
  res.render("map", {
    layout: false,
  });
});

// Rota para página sobre
router.get("/sobre", isAuthenticated, (req, res) => {
  res.render("sobre");
});

// Outras Rotas...
router.use("/markings", isAuthenticated, markingsRoutes);
router.use("/bairro", isAuthenticated, bairroRoutes);
router.use("/categoria", isAuthenticated, categoriaRoutes);
router.use("/utente", isAuthenticated, utenteRoutes);
router.use("/licenca", isAuthenticated, licencaRoute);
router.use("/users", isAuthenticated, usersRoute);
router.use("/settings", isAuthenticated, settingsRoute);

module.exports = router;
