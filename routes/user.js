const express = require("express");
const router = express.Router();
const prisma = require("../db");

router.get("/page", (req, res) => {
  res.render("user");
});

module.exports = router;
