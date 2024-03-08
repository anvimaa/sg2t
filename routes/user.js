const express = require("express");
const router = express.Router();
const prisma = require("../db");

router.get("/page", (req, res) => {
  res.render("user");
});

router.get("/", async (req, res) => {
  const users = await prisma.user.findMany({
    include: { posts: true },
  });
  console.log(users);
  res.json(users);
});

module.exports = router;
