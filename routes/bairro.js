const express = require("express");
const router = express.Router();
const { isAdmin } = require("./midlewares");
const {
  getBairros,
  getBairroById,
  deleteBairro,
  updateBairro,
  createBairro,
} = require("../controllers/bairroController");
const { errorMessage, successMessage } = require("./utlis");

router.get("/page", isAdmin, async (_, res) => {
  try {
    res.render("bairro");
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/", async (req, res) => {
  try {
    let data = await getBairros(req.session.user.isAdmin);
    return res.send({ data: data });
  } catch (error) {
    res.status(500).json(errorMessage(error.message));
  }
});

router.get("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const bairro = await getBairroById(id);
    if (bairro) return res.json(bairro);
    return res.status(404).json(errorMessage("Bairro nao encontrado"));
  } catch (error) {
    res.status(500).json(errorMessage(error.message));
  }
});

router.post("/", isAdmin, async (req, res) => {
  try {
    let { nome, descricao, id } = req.body;
    id = Number(id);

    let message = "";
    if (id == -1) {
      message = await createBairro({
        nome,
        descricao,
      });
    } else {
      const result = await updateBairro(id, { descricao, nome });
      message = result ? "Editado com sucesso" : "Nao encontrada";
    }
    res.status(201).json(successMessage(message));
  } catch (error) {
    res.status(500).json(errorMessage(error.message));
  }
});

router.put("/:id", isAdmin, async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { nome, descricao } = req.body;
    const result = await updateBairro(id, { descricao, nome });
    if (result) return res.json(successMessage());
    res.status(400).json(errorMessage("Bairro inexistente"));
  } catch (error) {
    res.status(500).json(errorMessage(error.message));
  }
});

router.delete("/:id", isAdmin, async (req, res) => {
  try {
    let id = Number(req.params.id);
    const result = await deleteBairro(id);
    if (result) return res.json(successMessage());
    res.status(400).json(errorMessage("Bairro Existente"));
  } catch (error) {
    res.status(500).json(errorMessage(error.message));
  }
});

module.exports = router;
