const express = require("express");
const router = express.Router();
const { makeButonEditDelete, formatDate } = require("./utlis");
const prisma = require("../db");

router.get("/page", async (req, res) => {
  try {
    res.render("categoria");
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/", async (req, res) => {
  try {
    let data = await prisma.categoria.findMany({
      include: { markings: true },
    });

    data = data.map((d) => {
      return {
        id: d.id,
        nome: d.nome,
        createdAt: d.createdAt.toLocaleDateString("pt-BR", formatDate),
        btn: makeButonEditDelete(d.id, "categoria"),
        markings: d.markings,
      };
    });
    return res.status(200).send({ data: data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const exist = await prisma.categoria.findFirst({ where: { id } });

    if (exist) {
      return res.json(exist);
    }

    return res.status(404).json({ error: "Categoria inexistente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    let { nome, id } = req.body;
    id = Number(id);
    let message = "";
    if (id == -1) {
      const exist = await prisma.categoria.findFirst({ where: { nome } });
      if (exist) {
        return res
          .status(400)
          .json({ message: "Ja existe uma categoria com esse nome" });
      }

      await prisma.categoria.create({ data: { nome, descricao: nome } });

      message = "Cadastrado com sucesso";
    } else {
      const exist = await prisma.categoria.findFirst({ where: { id } });

      if (!exist) {
        return res.status(404).json({ message: "Categoria inexistente" });
      }
      await prisma.categoria.update({ data: { nome }, where: { id } });
      message = "Editado com sucesso";
    }
    res.json({ message });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { nome } = req.body;
    const exist = await prisma.categoria.findFirst({ where: { id } });

    if (!exist) {
      return res.status(404).json({ error: "Categoria inexistente" });
    }
    await prisma.categoria.update({ data: { nome }, where: { id } });

    res.json({ message: "Categoria Atualizado com sucesso!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    let id = Number(req.params.id);
    const exist = await prisma.categoria.findFirst({ where: { id } });

    if (!exist) {
      return res.status(404).json({ error: "Categoria inexistente" });
    }

    await prisma.categoria.delete({ where: { id } });

    res.json({ message: "Categoria deletado com sucesso" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
