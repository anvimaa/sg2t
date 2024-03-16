const express = require("express");
const router = express.Router();
const { makeButonEditDelete, formatDate } = require("./utlis");
const { isAdmin } = require("./midlewares");
const prisma = require("../db");

router.get("/page", isAdmin, async (req, res) => {
  try {
    res.render("bairro");
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/", async (req, res) => {
  try {
    let data = await prisma.bairro.findMany({
      include: { markings: true },
    });

    data = data.map((d) => {
      return {
        id: d.id,
        nome: d.nome,
        descricao: d.descricao,
        createdAt: d.createdAt.toLocaleDateString("pt-BR", formatDate),
        btn: makeButonEditDelete(
          d.id,
          "bairro",
          false,
          false,
          req.session.user.isAdmin || false
        ),
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
    const exist = await prisma.bairro.findFirst({
      where: { id },
      include: { markings: true },
    });

    if (exist) {
      return res.json(exist);
    }

    return res.status(404).json({ error: "Bairro inexistente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/", isAdmin, async (req, res) => {
  try {
    let { nome, descricao, id } = req.body;
    id = Number(id);

    let message = "";
    if (id == -1) {
      const exist = await prisma.bairro.findFirst({ where: { nome } });
      if (exist) {
        return res
          .status(400)
          .json({ message: "Ja existe um bariro com esse nome" });
      }

      await prisma.bairro.create({ data: { nome, descricao } });

      message = "Cadastrado com sucesso";
    } else {
      const exist = await prisma.bairro.findFirst({ where: { id } });

      if (!exist) {
        return res.status(404).json({ message: "Bairro inexistente" });
      }
      await prisma.bairro.update({
        data: { nome, descricao },
        where: { id },
      });
      message = "Editado com sucesso";
    }
    res.status(201).json({ message });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put("/:id", isAdmin, async (req, res) => {
  try {
    const id = Number(req.params.id);

    const { nome, descricao } = req.body;
    const exist = await prisma.bairro.findFirst({ where: { id } });

    if (!exist) {
      return res.status(404).json({ error: "Bairro inexistente" });
    }
    await prisma.bairro.update({ data: { nome, descricao }, where: { id } });

    res.json({ message: "Bairro Atualizado com sucesso!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete("/:id", isAdmin, async (req, res) => {
  try {
    let id = Number(req.params.id);
    const exist = await prisma.bairro.findFirst({ where: { id } });

    if (!exist) {
      return res.status(404).json({ error: "Bairro inexistente" });
    }

    await prisma.bairro.delete({ where: { id } });

    res.json({ message: "Bairro deletado com sucesso" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
