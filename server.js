const express = require("express");
const hbs = require("hbs");
const app = express();
const port = 3000;

const routes = require("./routes");

app.set("view engine", "hbs");
app.set("views", "./views");
app.use(express.json());
app.use(express.static("public"));

hbs.registerPartials(__dirname + "/views/parcials");

// Use routes from the routes/index.js file
app.use("/", routes);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
