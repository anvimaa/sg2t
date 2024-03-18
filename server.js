const express = require("express");
const session = require("express-session");
const hbs = require("hbs");
const cookieParser = require("cookie-parser");

const app = express();
const port = 3000;

const SECRET_KEY_SESSION = "bf221c6bd3984e5f9d3c599b4da9aeae";

const routes = require("./routes");

app.set("views", __dirname + "/views");
app.set("view engine", "hbs");
app.use(cookieParser());
// app.use(csrf({ cookie: true }));
app.use(express.static(__dirname + "/public"));
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: SECRET_KEY_SESSION,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(express.json());
hbs.registerPartials(__dirname + "/views/parcials");
app.use("/", routes);

app.listen(port, () => {
  console.log(`Servidor Executando em: http://localhost:${port}/`);
});
