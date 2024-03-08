const express = require("express");
const path = require("path");
const router = express.Router();

// Import and use the markings routes
const markingsRoutes = require("./markings");
const terrenoRoutes = require("./terreno");
const bairroRoutes = require("./bairro");
const categoriaRoutes = require("./categoria");
const userRoutes = require("./user");

// Serve index.html on the root route
router.get("/", (req, res) => {
  res.render("index")
});

router.get("/map", (req, res) => {
  res.render("map")
});

router.get("/sobre", (req, res) => {
  res.render("sobre")
});

router.use("/markings", markingsRoutes);
router.use("/bairro", bairroRoutes);
router.use("/terreno", terrenoRoutes);
router.use("/categoria", categoriaRoutes);
router.use("/user", userRoutes);

module.exports = router;