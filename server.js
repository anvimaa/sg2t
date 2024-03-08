const express = require("express");
const hbs = require("hbs");
const app = express();
const port = 3000;

const routes = require("./routes");

app.set("views", __dirname + "/views");
app.set("view engine", "hbs");
app.use(express.static(__dirname + "/public"));

app.use(express.json());

hbs.registerPartials(__dirname + "/views/parcials");

// Use routes from the routes/index.js file
app.use("/", routes);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
