const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const prisma = require("../db");
const { makeButonEditDelete, formatDate, formatDateTime } = require("./utlis");

router.get("/page", async (req, res) => {
  try {
    return res.render("settings");
  } catch (error) {
    return;
  }
});

module.exports = router;
