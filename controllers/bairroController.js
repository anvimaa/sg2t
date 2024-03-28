const prisma = require("../db");
const { makeButonEditDelete, formatDateTime } = require("../routes/utlis");

async function getBairros(isAdmin) {
  try {
    let data = await prisma.bairro.findMany({
      orderBy: [{ createdAt: "desc" }],
      include: { markings: { select: { name: true, estado: true } } },
    });

    data = data.map((d) => {
      return {
        id: d.id,
        nome: d.nome,
        descricao: d.descricao,
        createdAt: d.createdAt.toLocaleDateString("pt-BR", formatDateTime),
        btn: makeButonEditDelete(
          d.id,
          "bairro",
          false,
          false,
          isAdmin || false
        ),
        markings: d.markings,
      };
    });
    return data;
  } catch (error) {
    throw Error("Erro: get bairros");
  }
}

async function getBairroById(id) {
  try {
    const bairro = await prisma.bairro.findUnique({
      where: { id },
      include: { markings: { select: { name: true, estado: true } } },
    });

    if (bairro) return bairro;
    return null;
  } catch (error) {
    throw Error("Erro: get bairro by id");
  }
}

async function deleteBairro(id) {
  try {
    const bairro = await prisma.bairro.findUnique({ where: { id } });

    if (!bairro) return false;

    await prisma.bairro.delete({ where: { id } });

    return true;
  } catch (error) {
    throw Error("Erro: delete bairro");
  }
}

async function updateBairro(id, data) {
  try {
    const bairro = await prisma.bairro.findUnique({ where: { id } });

    if (!bairro) return false;

    await prisma.bairro.update({
      data,
      where: { id },
    });
    return true;
  } catch (error) {
    throw Error("Erro: update bairro");
  }
}

async function createBairro(data) {
  try {
    const bairro = await prisma.bairro.findFirst({
      where: { nome: data.nome },
    });
    if (bairro) return "Ja existe uma bairro com esse nome";
    await prisma.bairro.create({ data });
    return "Criado com sucesso";
  } catch (error) {
    console.log(error);
    throw Error("Erro: create bairro");
  }
}

module.exports = {
  getBairros,
  getBairroById,
  updateBairro,
  deleteBairro,
  createBairro,
};
