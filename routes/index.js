const express = require("express");
const path = require("path");
const bcrypt = require("bcrypt");
const router = express.Router();
const prisma = require("../db");
const { isAuthenticated } = require("./midlewares");
const { logOperation } = require("./utlis");

// Importar as rotas
const markingsRoutes = require("./markings");
const bairroRoutes = require("./bairro");
const categoriaRoutes = require("./categoria");
const utenteRoutes = require("./utente");
const licencaRoute = require("./licenca");
const usersRoute = require("./user");
const settingsRoute = require("./settings");

// Middleware para adicionar o usuario em locas
router.use(async (req, res, next) => {
  let settings = await prisma.settings.findFirst({ where: { id: 1 } });

  let configs = {
    theme: settings.theme,
    sidebar: settings.theme == "dark-mode" ? "sidebar-dark" : "sidebar-light",
    navbar: settings.theme == "dark-mode" ? "navbar-dark" : "navbar-light",
    appName: settings.appName,
  };

  res.locals.user = req.session.user || null;
  res.locals.theme = settings.theme || "dark-mode";
  res.locals.sidebar =
    settings.theme == "dark-mode"
      ? "sidebar-dark-primary"
      : "sidebar-light-primary";
  res.locals.navbar =
    settings.theme == "dark-mode" ? "navbar-dark" : "navbar-light";
  res.locals.appName = settings.appName;
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
    await prisma.user.update({
      where: { username },
      data: { lastLogin: new Date(Date.now()) },
    });
    req.session.user = user;
    logOperation(`Sessão iniciada por: ${user.nome}`, user.id);
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
router.get("/", (req, res) => {
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
router.use("/utente", utenteRoutes);
router.use("/licenca", isAuthenticated, licencaRoute);
router.use("/users", isAuthenticated, usersRoute);
router.use("/settings", isAuthenticated, settingsRoute);

module.exports = router;
