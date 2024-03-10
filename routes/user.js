const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const prisma = require("../db");
const { makeButonEditDelete, formatDate, formatDateTime } = require("./utlis");

router.get("/page", async (req, res) => {
  try {
    let users = await prisma.user.findMany();
    users = users.map((u) => {
      return {
        id: u.id,
        nome: u.nome,
        lastLogin: u.lastLogin.toLocaleDateString("pt-BR", formatDateTime),
        createdAt: u.createdAt.toLocaleDateString("pt-BR", formatDateTime),
        btn: makeButonEditDelete(u.id, "users"),
      };
    });
    return res.render("users", { users });
  } catch (error) {
    return;
  }
});

router.post("/", async (req, res) => {
  try {
    const { nome, username, password, isAdmin } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    await prisma.user.create({
      data: {
        nome,
        username,
        password: hashedPassword,
        isAdmin: isAdmin == "on" ? true : false,
      },
    });
    return res.redirect("/users/page");
  } catch (error) {
    return;
  }
});

router.get("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const exist = await prisma.user.findFirst({
      where: { id },
    });
    if (exist) {
      return res.json(exist);
    }
    return res.status(404).json({ error: "user inexistente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    const { nome, username } = req.body;
    const exist = await prisma.user.findFirst({ where: { id } });

    if (!exist) {
      return res.status(404).json({ error: "user inexistente" });
    }
    await prisma.user.update({
      data: { nome, username },
      where: { id },
    });

    res.json({ message: "user Atualizado com sucesso!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    let id = Number(req.params.id);
    const exist = await prisma.user.findFirst({ where: { id } });

    if (!exist) {
      return res.status(404).json({ error: "user inexistente" });
    }

    if (exist.username == "root") {
      return res.redirect("/users/page");
    }

    await prisma.user.delete({ where: { id } });

    return res.redirect("/users/page");
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
