const express = require("express");
const session = require("express-session");
const hbs = require("hbs");
const app = express();
const port = 3000;

const routes = require("./routes");

app.set("views", __dirname + "/views");
app.set("view engine", "hbs");

app.use(express.static(__dirname + "/public"));
app.use(express.urlencoded({ extended: true }));
app.use(
  session({ secret: "secretpass", resave: false, saveUninitialized: false })
);
app.use(express.json());

hbs.registerPartials(__dirname + "/views/parcials");

app.use("/", routes);

app.listen(port, () => {
  console.log(`Server running http://localhost:${port}/`);
});
