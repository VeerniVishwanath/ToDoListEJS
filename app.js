const express = require("express");
const app = express();
const date = require(__dirname + "/date.js");
const mongoose = require("mongoose");
const _ = require("lodash");

const day = date.getDate();

app.use(express.urlencoded({ extended: true })); //BodyParser

app.set("view engine", "ejs");

app.use(express.static("public"));

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

  // Schema for customList
  const customListSchema = new mongoose.Schema({
    name: String,
    customItems: [itemSchema],
  });

  // Model for ListSchema
  const customList = new mongoose.model("customList", customListSchema);

  const defaultItems = [item1, item2, item3];

  // Home Get Method
  app.get("/", (req, res) => {

    Item.find({}, (err, foundItems) => {
      if (foundItems.length === 0) {
        // Saving to DB
        Item.insertMany(defaultItems)
          .then(() => {
            console.log("Successfully Inserted data");
          })
          .catch((err) => {
            console.log(err);
          });
        res.redirect("/");
      } else {
        res.render("list", { titleName: day, items: foundItems });
      }
    });
  });

  //  Dynamic Paths
  app.get("/:customPath", (req, res) => {
    const customPath = _.lowerCase(req.params.customPath);

    customList.findOne({ name: customPath }, (err, result) => {
      if (err) {
        console.log(err);
      } else {
        if (!result) {
          // Creating Documents
          const list = new customList({
            name: customPath,
            customItems: defaultItems,
          }).save();

          setTimeout(() => {
            res.redirect("/" + customPath);
          }, 200);
        } else {
          res.render("list", {
            titleName: customPath,
            items: result.customItems,
          });
        }
      }
    });
  });

  // Home Post Method
  app.post("/", (req, res) => {
    const itemName = req.body.newItem;
    const button = req.body.button;

    // Create new Item Document
    const item = new Item({
      name: itemName,
    });
    
    if( button == day){
      item.save();
      res.redirect("/");
    }else{
      customList.findOne({name:button},(err,result)=>{
        if(!err){
          result.customItems.push(item);
          result.save();
          res.redirect("/"+button);
        }
      })
    }
  });

  // Delete Post Method
  app.post("/delete", (req, res) => {
    const itemId = req.body.checkbox;
    Item.deleteOne({ _id: itemId })
      .then(() => {
        console.log("Successfully Deleted");
      })
      .catch((err) => {
        console.log("Error is" + err);
      });
    res.redirect("/");
  });
}
app.listen(3000, () => {
  console.log("server running on port 3000");
});
