const path = require("path");
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");

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

module.exports = {
  upload,
  isAuthenticated,
};
