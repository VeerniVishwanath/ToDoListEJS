const express = require("express");
const app = express();
const date = require(__dirname + "/date.js");
const mongoose = require("mongoose");

// Mongoose DataBase Connnection

main().catch((err) => console.log(err));

async function main() {
  const url = "mongodb://127.0.0.1:27017";
  const Path = "/todolistDB";
  await mongoose.connect(url + Path);

  // Schema For Items
  const itemSchema = new mongoose.Schema({
    name: {
      type: String,
      required: [true, "Why no Name??"],
    },
  });

  // Model for ItemSchema
  const Item = new mongoose.model("Item", itemSchema);

  // Adding Documents in MongoDB

  const item1 = new Item({
    name: "Welcome to the todoList!!",
  });

  const item2 = new Item({
    name: "Hit the + button to add a new item.",
  });

  const item3 = new Item({
    name: "<-- Hit this button to delete an item.",
  });

  const defaultItems = [item1, item2, item3];

  Item.insertMany(defaultItems)
    .then(() => {
      console.log("Successfully Inserted data");
    })
    .catch((err) => {
      console.log(err);
    });
}

app.use(express.urlencoded({ extended: true })); //BodyParser

app.set("view engine", "ejs");

app.use(express.static("public"));

// Home Get Method
app.get("/", (req, res) => {
  const day = date.getDate();
  res.render("list", { titleName: day, items: items });
});

// Work Get Method
app.get("/work", (req, res) => {
  res.render("list", { titleName: "Work", items: workItems });
});

// Home Post Method
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
