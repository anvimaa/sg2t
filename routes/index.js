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
const authRoute = require("./auth");

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

// Middleware para verificar se o usuario que prentende deletar um ob, é administrador
router.use((req, res, next) => {
  if (req.method == "DELETE" && !req.session.user.isAdmin) {
    logOperation(
      ` [DELETE] Acesso negado! ${req.session.user.nome}`,
      req.session.user.id,
      false
    );
    return res.status(403).json({ message: "Acesso negado" });
  }
  next();
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
router.use("/", authRoute);
router.use("/markings", isAuthenticated, markingsRoutes);
router.use("/bairro", isAuthenticated, bairroRoutes);
router.use("/categoria", isAuthenticated, categoriaRoutes);
router.use("/utente", isAuthenticated, utenteRoutes);
router.use("/licenca", isAuthenticated, licencaRoute);
router.use("/users", isAuthenticated, usersRoute);
router.use("/settings", isAuthenticated, settingsRoute);

module.exports = router;
