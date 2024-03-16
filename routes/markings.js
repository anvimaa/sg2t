const express = require("express");
const router = express.Router();
const { makeButonEditDelete, formatDate, formatDateTime } = require("./utlis");
const { isAdmin } = require("./midlewares");
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
    res.render("markings/detail", { marking });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/", async (req, res) => {
  try {
    let data = await prisma.marking.findMany({
      orderBy: [
        {
          createdAt: "desc",
        },
      ],
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
        createdAt: d.createdAt.toLocaleDateString("pt-BR", formatDateTime),
        btn: makeButonEditDelete(
          d.id,
          "markings",
          false,
          true,
          req.session.user.isAdmin || false
        ),
        type: d.type,
        fillColor: d.fillColor,
        fillOpacity: d.fillOpacity / 10,
        color: d.color,
        weight: d.weight,
        geojson: d.geojson,
        bairro: d.bairro.nome,
        categoria: d.categoria.nome,
        largura: d.largura,
        comprimento: d.comprimento,
        estado:
          d.estado == "Pendente"
            ? "<span class='badge badge-warning'>Pendente</spna>"
            : d.estado == "Letígio"
            ? "<span class='badge badge-danger'>Letígio</spna>"
            : "<span class='badge badge-success'>Regularizado</spna>",
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
      largura,
      comprimento,
      weight,
      estado,
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
          estado,
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
          largura,
          estado,
          comprimento,
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

router.put("/:id", isAdmin, async (req, res) => {
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
    return res.status(500).json({ error: error.message });
  }
});

router.post("/associate", async (req, res) => {
  try {
    let { bi, id } = req.body;
    id = Number(id);
    const utente = await prisma.utente.findUnique({ where: { bi } });
    const marking = await prisma.marking.findUnique({ where: { id } });
    if (!utente || !marking) {
      return res
        .status(404)
        .json({ message: "Utente Inexistente!", type: "error" });
    }
    if (marking.isAssociated) {
      return res
        .status(400)
        .json({ message: "Esta marcação já está associada!", type: "error" });
    }
    await prisma.marking.update({
      data: { utenteId: utente.id, isAssociated: true },
      where: { id },
    });
    return res.json({ message: `Associado com sucesso`, type: "success" });
  } catch (error) {
    res.status(500).json({ message: error.message, type: "error" });
  }
});

module.exports = router;
