const express = require("express");
const router = express.Router();
const {
  getLicencas,
  getLicencaById,
  deleteLicente,
  updateLicenca,
  createLicenca,
} = require("../controllers/licencaController");

const { errorMessage, successMessage } = require("./utlis");

router.get("/page", async (_, res) => {
  try {
    res.render("licenca");
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/", async (req, res) => {
  try {
    let data = await getLicencas(req.session.user.isAdmin);
    return res.send({ data: data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const licenca = await getLicencaById(id);
    if (licenca) return res.json(licenca);
    return res.status(404).json(errorMessage("Licenca nao encontrada"));
  } catch (error) {
    res.status(500).json(errorMessage(error.message));
  }
});

router.post("/", async (req, res) => {
  try {
    let { descricao, code, numero, id, observacao } = req.body;
    id = Number(id);
    let message = "";

    if (id == -1) {
      message = await createLicenca({
        descricao,
        numero,
        code,
        observacao,
      });
    } else {
      const result = await updateLicenca(id, { descricao, numero, observacao });
      message = result ? "Editado com sucesso" : "Licenca nao encontrada";
    }
    res.json(successMessage(message));
  } catch (error) {
    res.status(500).json(errorMessage(error.message));
  }
});

router.put("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { descricao, numero, observacao } = req.body;
    const result = await updateLicenca(id, { descricao, numero, observacao });
    if (result) return res.json(successMessage());
    res.status(400).json(errorMessage("Licenca inexistente"));
  } catch (error) {
    res.status(500).json(errorMessage(error.message));
  }
});

router.delete("/:id", async (req, res) => {
  try {
    let id = Number(req.params.id);
    const result = await deleteLicente(id);
    if (result) return res.json(successMessage());
    res.status(400).json(errorMessage("Licenca Existente"));
  } catch (error) {
    res.status(500).json(errorMessage(error.message));
  }
});

module.exports = router;
