const path = require("path");
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const csrf = require("csurf");
const { logOperation } = require("./utlis");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueFileName = `${uuidv4()}_${Date.now()}${path.extname(
      file.originalname
    )}`;
    cb(null, uniqueFileName);
  },
});

const upload = multer({ storage: storage });

// Middleware para verificar se o usuário está autenticado
const isAuthenticated = (req, res, next) => {
  if (req.session.user) {
    return next();
  }
  res.redirect("/login");
};

const isAdmin = (req, res, next) => {
  if (req.session.user.isAdmin) {
    return next();
  }
  logOperation(
    `Acesso negado para ${req.session.user.nome}`,
    req.session.user.id,
    false
  );
  res.redirect("/");
};

const csrfProtection = csrf({ cookie: true });

module.exports = {
  upload,
  isAuthenticated,
  isAdmin,
  csrfProtection,
};
