const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose")
const date = require(__dirname + "/date.js");
const _=require("lodash");

const app = express();
const port = 3000;

mongoose.connect("mongodb+srv://deewakarrao59:RCODyQqL0qvCtRM1@cluster0.iumvyuo.mongodb.net/TodoList");

const itemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  }
})

const Item = mongoose.model("Item", itemSchema);

const Item1 = new Item({
  name: "Welcome to your todoList!"
})

const Item2 = new Item({
  name:"This is the second Item"
})
const defaultItems = [Item1,Item2];

const listSchema = new mongoose.Schema({
  name: String,
  items: [itemSchema]
})

const List = mongoose.model("List", listSchema);

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

const items = ["Buy Food", "Cook Food", "Eat Food"];
const workItems = [];

app.get("/", function(req, res) {

  Item.find({})
  .then(foundItems=>{
    if(foundItems.length===0){
      Item.insertMany(defaultItems)
   .then((result)=>{
      console.log('Data inserted successfully:',result);
    })
   .catch((error)=>{
       console.log('Error inserting data:',error);
    })

    res.redirect('/');
    }
    else{
      res.render("list", {listTitle: "Today", newListItems: foundItems});
    }
  })
  .catch(error=>{
    console.log('Error finding data:',error)
  })

const day = date.getDate();
  

});

app.get("/:customList", (req,res)=>{
  const customListName = _.capitalize(req.params.customList);

  List.findOne({name: customListName})
  .then(foundList=>{
    if(!foundList){
      const list = new List({
        name: customListName,
        items: defaultItems
      })

      list.save();

      res.redirect("/" + customListName);
    }
    else{

      res.render("List", {listTitle: foundList.name, newListItems: foundList.items})
    }
  })
  .catch(err=>
    console.log(err)
    )
  })

app.post("/", function(req, res){

  const itemName = req.body.newItem;
  const listName = req.body.list;

  const item = new Item({
    name: itemName
  })

  if(listName==="Today"){
    item.save();
    res.redirect("/")
  }else{
    List.findOne({name: listName})
    .then(foundList=>{

      foundList.items.push(item);
      foundList.save();
      res.redirect("/"+ listName);
    })
  }
  
});

app.post("/delete", (req,res)=>{
  const checkedItem = req.body.checkbox;
  const listName = req.body.listName;

  if(listName === "Today"){
    Item.findByIdAndDelete(checkedItem)
  .then(result=>{
    console.log("Succesfully deleted checked Item!!",result)
    res.redirect("/");
  })
  .catch(err=>{
    console.log(err);
  })

  }else{
    List.findOneAndUpdate({name:listName},{$pull: {items:{_id: checkedItem}}}).
    then(()=>{
      res.redirect("/"+ listName);
    })
  }

  
})

app.get("/work", function(req,res){
  res.render("list", {listTitle: "Work List", newListItems: workItems});
});

app.get("/about", function(req, res){
  res.render("about");
});

app.listen(port, function() {
  console.log(`Server started on http://localhost:${3000}`);
});
