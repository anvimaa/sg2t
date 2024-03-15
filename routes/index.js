const express = require("express");
const nodemailer = require("nodemailer");
const router = express.Router();
const prisma = require("../db");
const { isAuthenticated } = require("./midlewares");
const { logOperation } = require("./utlis");

const SMTP_SERVER = process.env.SMTP_SERVER;
const USER_SMTP = process.env.USER_SMTP;
const PASS_SMTP = process.env.PASS_SMTP;
const EMAIL_SMTP = process.env.EMAIL_SMTP;

// Importar as rotas
const markingsRoutes = require("./markings");
const bairroRoutes = require("./bairro");
const categoriaRoutes = require("./categoria");
const utenteRoutes = require("./utente");
const licencaRoute = require("./licenca");
const usersRoute = require("./user");
const settingsRoute = require("./settings");
const authRoute = require("./auth");

// Middleware para adicionar o usuario em locas
router.use(async (req, res, next) => {
  let settings = await prisma.settings.findFirst({ where: { id: 1 } });

  let configs = {
    theme: settings.theme,
    sidebar: settings.theme == "dark-mode" ? "sidebar-dark" : "sidebar-light",
    navbar: settings.theme == "dark-mode" ? "navbar-dark" : "navbar-light",
    appName: settings.appName,
  };

  res.locals.user = req.session.user || null;
  res.locals.theme = settings.theme || "dark-mode";
  res.locals.sidebar =
    settings.theme == "dark-mode"
      ? "sidebar-dark-primary"
      : "sidebar-light-primary";
  res.locals.navbar =
    settings.theme == "dark-mode" ? "navbar-dark" : "navbar-light";
  res.locals.appName = settings.appName;
  // res.locals.csrfToken = req.csrfToken() || null;
  next();
});

// Middleware para verificar se o usuario que prentende deletar um ob, é administrador
router.use((req, res, next) => {
  if (req.method == "DELETE" && !req.session.user.isAdmin) {
    logOperation(
      ` [DELETE] Acesso negado! ${req.session.user.nome}`,
      req.session.user.id,
      false
    );
    return res.status(403).json({ message: "Acesso negado" });
  }
  next();
});

// Rota principal
router.get("/", isAuthenticated, async (req, res) => {
  try {
    let data = {
      marks: await prisma.marking.count(),
      bairros: await prisma.bairro.count(),
      utentes: await prisma.utente.count(),
      licencas: await prisma.licenca.count(),
    };

    let markings = {
      pendentes: await prisma.marking.count({
        where: { estado: "Pendente" },
      }),
      letigio: await prisma.marking.count({
        where: { estado: "Letígio" },
      }),
      regularizado: await prisma.marking.count({
        where: { estado: "Regularizado" },
      }),
    };

    markings.percentPendente = (
      (markings.pendentes / data.marks) *
      100
    ).toFixed(2);
    markings.percentLetigio = ((markings.letigio / data.marks) * 100).toFixed(
      2
    );
    markings.percentRegularizado = (
      (markings.regularizado / data.marks) *
      100
    ).toFixed(2);

    res.render("index", { data, markings });
  } catch (error) {
    logOperation(
      "Erro na pagina inicial",
      req.session.user.id,
      false,
      "/",
      error
    );
    return;
  }
});

// Rota para ver o mapa
router.get("/map", isAuthenticated, (req, res) => {
  res.render("map", {
    layout: false,
  });
});

// Rota para página sobre
router.get("/sobre", isAuthenticated, (req, res) => {
  res.render("sobre", {
    layout: null,
  });
});

router.post("/send-email", async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    let transporter = nodemailer.createTransport({
      host: SMTP_SERVER,
      port: 587,
      secure: false, // upgrade later with STARTTLS
      auth: {
        user: USER_SMTP,
        pass: PASS_SMTP,
      },
    });

    let mailOptions = {
      from: email, // Email do remetente do formulário
      to: EMAIL_SMTP,
      subject: subject,
      text: `Nome: ${name}\nEmail: ${email}\n\n${message}`,
    };

    // Enviando o email
    await transporter.sendMail(mailOptions);

    // Salvando o email na tabela do banco de dados utilizando Prisma
    await prisma.email.create({
      data: {
        name,
        email,
        subject,
        message,
      },
    });

    logOperation(`Email enviado por ${name}-${email}`, 3);
    console.log("Email Enviado com sucesso");
    res.json({ message: "Recebemos o seu e-mail!", type: "success" });
  } catch (error) {
    logOperation(
      `Erro ao enviar email`,
      3,
      false,
      "/send-email",
      error.message
    );
    return;
  }
});

// Outras Rotas...
router.use("/", authRoute);
router.use("/markings", isAuthenticated, markingsRoutes);
router.use("/bairro", isAuthenticated, bairroRoutes);
router.use("/categoria", isAuthenticated, categoriaRoutes);
router.use("/utente", isAuthenticated, utenteRoutes);
router.use("/licenca", isAuthenticated, licencaRoute);
router.use("/users", isAuthenticated, usersRoute);
router.use("/settings", isAuthenticated, settingsRoute);

module.exports = router;
