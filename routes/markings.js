const express = require("express");
const router = express.Router();
const { makeButonEditDelete, formatDate } = require("./utlis");
const prisma = require("../db");

router.get("/page", async (req, res) => {
  try {
    res.render("markings");
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/detail/:id", async (req, res) => {
  try {
    let id = Number(req.params.id);
    const marking = await prisma.marking.findUnique({
      where: { id },
      include: {
        utente: true,
        licencas: true,
        bairro: true,
        categoria: true,
      },
    });

    if (!marking) {
      return res.status(404).redirect("/");
    }
    console.log(marking);
    res.render("markings/detail", { marking });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/", async (req, res) => {
  try {
    let data = await prisma.marking.findMany({
      include: {
        bairro: true,
        categoria: true,
      },
    });

    data = data.map((d) => {
      return {
        id: d.id,
        name: d.name,
        code: d.code,
        ref: d.ref,
        createdAt: d.createdAt.toLocaleDateString("pt-BR", formatDate),
        btn: makeButonEditDelete(d.id, "markings", true),
        type: d.type,
        fillColor: d.fillColor,
        fillOpacity: d.fillOpacity / 10,
        color: d.color,
        weight: d.weight,
        geojson: d.geojson,
        bairro: d.bairro.nome,
        categoria: d.categoria.nome,
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
    const exist = await prisma.marking.findFirst({ where: { id } });

    if (exist) {
      return res.json(exist);
    }

    return res.status(404).json({ error: "Marking inexistente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    let {
      bairroId,
      type,
      geojson,
      name,
      code,
      ref,
      fillColor,
      fillOpacity,
      color,
      weight,
      id,
      categoriaId,
    } = req.body;

    id = Number(id);
    let message = "";

    if (id == -1) {
      const exist = await prisma.marking.findFirst({
        where: { code, geojson },
      });
      if (exist) {
        return res
          .status(400)
          .json({ message: "Ja existe um ponto marcado com esses dados." });
      }

      await prisma.marking.create({
        data: {
          type,
          geojson,
          name,
          code,
          ref,
          fillColor,
          fillOpacity,
          color,
          weight,
          bairroId,
          categoriaId,
        },
      });

      message = "Cadastrado com sucesso";
    } else {
      const exist = await prisma.marking.findFirst({ where: { id } });

      if (!exist) {
        return res.status(404).json({ message: "Marking inexistente" });
      }
      await prisma.marking.update({
        data: {
          name,
          code,
          ref,
          fillColor,
          fillOpacity: Number(fillOpacity),
          color,
          weight: Number(weight),
        },
        where: { id },
      });

      message = "Editado com sucesso";
    }
    res.json({ message });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    let id = Number(req.params.id);
    let { name, code, ref, fillColor, fillOpacity, color, weight } = req.body;
    const exist = await prisma.marking.findFirst({ where: { id } });

    if (!exist) {
      return res.status(404).json({ message: "Marking inexistente" });
    }
    await prisma.marking.update({
      data: {
        name,
        code,
        ref,
        fillColor,
        fillOpacity: Number(fillOpacity),
        color,
        weight: Number(weight),
      },
      where: { id },
    });

    res.json({ message: "Marking Atualizado com sucesso!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const exist = await prisma.marking.findFirst({ where: { id } });

    if (!exist) {
      return res.status(404).json({ error: "Marking inexistente" });
    }

    await prisma.marking.delete({ where: { id } });

    res.json({ message: "Marking deletado com sucesso" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
