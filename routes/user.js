const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const prisma = require("../db");
const { isAdmin } = require("./midlewares");
const {
  makeButonEditDelete,
  formatDateTime,
  logOperation,
  deleteFile,
} = require("./utlis");
const { upload } = require("./midlewares");

router.get("/page", isAdmin, async (req, res) => {
  try {
    let users = await prisma.user.findMany();
    users = users.map((u) => {
      return {
        id: u.id,
        nome: u.nome,
        lastLogin: u.lastLogin.toLocaleDateString("pt-BR", formatDateTime),
        createdAt: u.createdAt.toLocaleDateString("pt-BR", formatDateTime),
        btn: makeButonEditDelete(
          u.id,
          "users",
          false,
          false,
          req.session.user.isAdmin || false
        ),
      };
    });
    return res.render("users", { users });
  } catch (error) {
    return;
  }
});

router.post("/", isAdmin, async (req, res) => {
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

router.delete("/:id", isAdmin, async (req, res) => {
  try {
    let id = Number(req.params.id);
    const user = await prisma.user.findUnique({ where: { id } });

    if (!user) {
      return res.status(404).json({ error: "user inuserente" });
    }

    if (user.id == 3) {
      return res.redirect("/users/page");
    }

    await deleteFile(user.avatar);
    await prisma.user.delete({ where: { id } });

    return res.redirect("/users/page");
  } catch (error) {
    logOperation(
      "Erro ao deletar usuario",
      req.session.user.id,
      false,
      "DELETE: /users/",
      error.message
    );
    res.status(500).json({ error: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const user = await prisma.user.findUnique({
      where: { id },
    });
    if (user) {
      delete user.password;
      user.lastLogin = user.lastLogin.toLocaleDateString(
        "pt-BR",
        formatDateTime
      );
      user.updatedAt = user.updatedAt.toLocaleDateString(
        "pt-BR",
        formatDateTime
      );
      user.createdAt = user.createdAt.toLocaleDateString(
        "pt-BR",
        formatDateTime
      );
      return res.render("users/details", { user });
    }
    return res.status(404).json({ error: "user inuserente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    const { nome, username } = req.body;
    const user = await prisma.user.findUnique({ where: { id } });

    if (!user) {
      return res.status(404).json({ error: "user inuserente" });
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

router.post("/update", upload.single("avatar"), async (req, res) => {
  try {
    let id = Number(req.body.id);
    const { nome, username } = req.body;
    const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

    const user = await prisma.user.findUnique({ where: { id } });

    if (!user) {
      return res.redirect("/");
    }

    if (imagePath) await deleteFile(user.avatar);

    const data = {
      nome,
      username,
      avatar: imagePath || user.avatar,
    };

    await prisma.user.update({ data, where: { id } });
    await logOperation("Usuario atualizado com sucesso", req.session.user.id);
    return res.redirect(`/users/${id}`);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/reset-password", async (req, res) => {
  try {
    let id = Number(req.body.id2);
    let { newPassword, oldPassword } = req.body;

    if (newPassword === oldPassword) {
      await logOperation(
        "Tentativa de alterar a senha",
        req.session.user.id,
        false
      );
      return res
        .status(400)
        .json({ message: "As senhas devem ser diferentes.", type: "error" });
    }

    const user = await prisma.user.findUnique({ where: { id } });

    if (!user) {
      await logOperation(
        "Tentativa de alterar senha de outro usuario",
        req.session.user.id,
        false
      );
      return res.redirect("/");
    }

    const isDone = await bcrypt.compare(oldPassword, user.password);
    if (!isDone) {
      await logOperation(
        "Tentativa de alterar a senha",
        req.session.user.id,
        false
      );
      return res
        .status(400)
        .json({ message: "Senha atual inválida.", type: "error" });
    }

    const password = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({ data: { password }, where: { id } });

    return res.json({ message: "Senha Alterada com sucesso", type: "success" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
