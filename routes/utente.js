const express = require("express");
const router = express.Router();
const {
  makeButonEditDelete,
  formatDate,
  logOperation,
  deleteFile,
  formatDateTime,
} = require("./utlis");
const { upload } = require("./midlewares");
const prisma = require("../db");

router.get("/page", async (req, res) => {
  try {
    res.render("utente");
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/", async (req, res) => {
  try {
    let data = await prisma.utente.findMany({
      orderBy: [
        {
          createdAt: "desc",
        },
      ],
      include: { markings: true },
    });

    data = data.map((d) => {
      return {
        id: d.id,
        nome: d.nome,
        genero: d.genero,
        morada: d.morada,
        telefone: d.telefone,
        email: d.email,
        bi: d.bi,
        foto: d.foto,
        nascimento: d.nascimento.toLocaleDateString("pt-BR", formatDate),
        createdAt: d.createdAt.toLocaleDateString("pt-BR", formatDate),
        btn: makeButonEditDelete(d.id, "utente", true, true),
        markings: d.markings,
      };
    });
    return res.send({ data: data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const utente = await prisma.utente.findUnique({
      where: { id },
    });

    if (utente) {
      utente.nascimento = utente.nascimento.toISOString().slice(0, 10);
      return res.json(utente);
    }

    return res.status(404).json({ error: "utente inutenteente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/", upload.single("foto"), async (req, res) => {
  try {
    let { nome, bi, telefone, email, nascimento, genero, morada } = req.body;
    let data = { nome, bi, telefone, email, nascimento, genero, morada };
    data.nascimento = new Date(data.nascimento).toISOString();
    const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

    let id = Number(req.body.id);
    let message = "";
    if (id == -1) {
      const utente = await prisma.utente.findUnique({
        where: { bi: data.bi, email: data.email, telefone: data.telefone },
      });
      if (utente) {
        return res
          .status(400)
          .json({ message: "Ja utentee um utente com esses dados" });
      }

      data.foto = imagePath || "/dist/img/avatar.png";
      await prisma.utente.create({ data });
      message = "Cadastrado com sucesso";
    } else {
      const utente = await prisma.utente.findUnique({ where: { id } });

      if (!utente) {
        return res.status(404).json({ message: "utente inutenteente" });
      }

      if (imagePath) {
        data.foto = imagePath;
        await deleteFile(utente.foto);
      }

      await prisma.utente.update({
        data,
        where: { id },
      });
      message = "Editado com sucesso";
    }
    res.status(201).json({ message });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    const data = req.body;
    const utente = await prisma.utente.findUnique({ where: { id } });

    if (!utente) {
      return res.status(404).json({ error: "utente inutenteente" });
    }
    await prisma.utente.update({ data, where: { id } });

    res.json({ message: "utente Atualizado com sucesso!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    let id = Number(req.params.id);
    const utente = await prisma.utente.findUnique({ where: { id } });

    if (!utente) {
      return res.status(404).json({ error: "utente inutenteente" });
    }
    await deleteFile(utente.foto);
    await prisma.utente.delete({ where: { id } });

    res.json({ message: "utente deletado com sucesso" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/detail/:id", async (req, res) => {
  try {
    let id = Number(req.params.id);
    const utente = await prisma.utente.findUnique({
      where: { id },
      include: {
        markings: true,
      },
    });

    if (!utente) {
      return res.status(404).redirect("/");
    }

    utente.nascimento = utente.nascimento.toLocaleDateString("pt", formatDate);
    utente.createdAt = utente.createdAt.toLocaleDateString(
      "pt",
      formatDateTime
    );
    utente.updatedAt = utente.updatedAt.toLocaleDateString(
      "pt",
      formatDateTime
    );
    res.render("utente/details", { utente });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
