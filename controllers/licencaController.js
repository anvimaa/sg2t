const prisma = require("../db");
const { makeButonEditDelete, formatDateTime } = require("../routes/utlis");

async function getLicencas(isAdmin) {
  try {
    let data = await prisma.licenca.findMany({
      orderBy: [{ createdAt: "desc" }],
      include: { marking: { select: { name: true, estado: true } } },
    });

    data = data.map((d) => {
      return {
        id: d.id,
        descricao: d.descricao,
        numero: d.numero,
        observacao: d.observacao,
        createdAt: d.createdAt.toLocaleDateString("pt-BR", formatDateTime),
        btn: makeButonEditDelete(
          d.id,
          "licenca",
          false,
          false,
          isAdmin || false
        ),
        marking: d.marking,
      };
    });
    return data;
  } catch (error) {
    console.log(error);
    throw Error("Erro: get licencas");
  }
}

async function getLicencaById(id) {
  try {
    const licenca = await prisma.licenca.findUnique({
      where: { id },
      include: { marking: { select: { name: true, estado: true } } },
    });

    if (licenca) return licenca;
    return null;
  } catch (error) {
    throw Error("Erro: get licenca by id");
  }
}

async function deleteLicente(id) {
  try {
    const licenca = await prisma.licenca.findUnique({ where: { id } });

    if (!licenca) return false;

    await prisma.licenca.delete({ where: { id } });

    return true;
  } catch (error) {
    throw Error("Erro: delete licenca");
  }
}

async function updateLicenca(id, data) {
  try {
    const licenca = await prisma.licenca.findUnique({ where: { id } });

    if (!licenca) return false;

    await prisma.licenca.update({
      data,
      where: { id },
    });
    return true;
  } catch (error) {
    throw Error("Erro: update licenca");
  }
}

async function createLicenca(data) {
  try {
    const licenca = await prisma.licenca.findFirst({
      where: { AND: { numero: data.numero, descricao: data.descricao } },
    });

    if (licenca) return "Ja existe uma Licenca com esses dados";

    const marking = await prisma.marking.findUnique({
      where: { code: data.code },
    });

    if (!marking) return "Ponto inexistente";
    data.markingId = marking.id;
    await prisma.licenca.create({ data });
    return "Criado com sucesso";
  } catch (error) {
    console.log(error);
    throw Error("Erro: create licenca");
  }
}

module.exports = {
  getLicencas,
  getLicencaById,
  deleteLicente,
  updateLicenca,
  createLicenca,
};
