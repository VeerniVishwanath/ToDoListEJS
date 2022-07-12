const express = require("express");
const app = express();
const date = require(__dirname + "/date.js");
var items = ["Buy Food", "Cook Food", "Eat Food"];
var workItems = [];

app.use(express.urlencoded({ extended: true })); //BodyParser

app.set("view engine", "ejs");

app.use(express.static("public"));

app.get("/", (req, res) => {
  const day = date.getDate();
  res.render("list", { titleName: day, items: items });
});

app.get("/work", (req, res) => {
  res.render("list", { titleName: "Work", items: workItems });
});

app.post("/", (req, res) => {
  var item = req.body.newItem;
  var button = req.body.button;
  if (button == "Work") {
    workItems.push(item);
    res.redirect("/work");
  } else {
    items.push(item);
    res.redirect("/");
  }
});

app.listen(3000, () => {
  console.log("server running on port 3000");
});
