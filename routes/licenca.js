const express = require("express");
const router = express.Router();
const { makeButonEditDelete, formatDate } = require("./utlis");
const prisma = require("../db");

router.get("/page", async (req, res) => {
  try {
    res.render("licenca");
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/", async (req, res) => {
  try {
    let data = await prisma.licenca.findMany({
      include: { marking: true },
    });

    data = data.map((d) => {
      return {
        id: d.id,
        descricao: d.descricao,
        numero: d.numero,
        observacao: d.observacao,
        createdAt: d.createdAt.toLocaleDateString("pt-BR", formatDate),
        btn: makeButonEditDelete(
          d.id,
          "licenca",
          false,
          false,
          req.user.isAdmin
        ),
        marking: d.marking,
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
    const exist = await prisma.licenca.findFirst({
      where: { id },
      include: { marking: true },
    });

    if (exist) {
      return res.json(exist);
    }

    return res.status(404).json({ error: "licenca inexistente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    let { descricao, code, numero, id, observacao } = req.body;
    id = Number(id);

    let message = "";
    if (id == -1) {
      const exist = await prisma.licenca.findFirst({
        where: { descricao, numero },
      });
      if (exist) {
        return res
          .status(400)
          .json({ message: "Ja existe uma licenca com esses dados" });
      }

      const marking = await prisma.marking.findUnique({ where: { code } });

      if (!marking) {
        return res.status(404).json({ message: "Ponto inexistente" });
      }

      await prisma.licenca.create({
        data: { descricao, numero, observacao, markingId: marking.id, code },
      });

      message = "Cadastrado com sucesso";
    } else {
      const exist = await prisma.licenca.findFirst({ where: { id } });

      if (!exist) {
        return res.status(404).json({ message: "licenca inexistente" });
      }
      await prisma.licenca.update({
        data: { descricao, numero, observacao },
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

    const { descricao, numero, observacao } = req.body;
    const exist = await prisma.licenca.findFirst({ where: { id } });

    if (!exist) {
      return res.status(404).json({ error: "licenca inexistente" });
    }
    await prisma.licenca.update({
      data: { descricao, numero, observacao },
      where: { id },
    });

    res.json({ message: "licenca Atualizado com sucesso!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    let id = Number(req.params.id);
    const exist = await prisma.licenca.findFirst({ where: { id } });

    if (!exist) {
      return res.status(404).json({ error: "licenca inexistente" });
    }

    await prisma.licenca.delete({ where: { id } });

    res.json({ message: "licenca deletado com sucesso" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
