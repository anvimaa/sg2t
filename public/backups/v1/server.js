const express = require("express");
const app = express();
const port = 3000;

//Data Base
const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("database.db");

db.serialize(() => {
  db.run(
    "CREATE TABLE IF NOT EXISTS markings (id INTEGER PRIMARY KEY, type TEXT, geojson TEXT)"
  );
});

//db.close();

app.use(express.json());
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

app.post("/markings", (req, res) => {
  const { type, geojson } = req.body;

  db.serialize(() => {
    const stmt = db.prepare(
      "INSERT INTO markings (type, geojson) VALUES (?, ?)"
    );
    stmt.run(type, geojson);
    stmt.finalize();

    res.json({ message: "Marking saved successfully" });
  });
});

app.get("/markings", (req, res) => {
  db.serialize(() => {
    db.all("SELECT * FROM markings", (err, rows) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json(rows);
    });
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
