
const express = require("express");
const { json } = require("express/lib/response");
const app = express();
var msg = null;
//const data = require("./DB.json");

// express.json() is a built-in middleware function in Express. It parses incoming requests with JSON payloads
app.use(express.json());

const fs = require("fs");
const { arrayBuffer } = require("stream/consumers");


//console.log(data);

// handling post request
app.post("/post", (req, res)=>{

    // reading data from file using fs module
    let data = fs.readFileSync("./DB.json", {"encoding": "utf-8"});
    // parsing data coming from json file, it will become object now
    data = JSON.parse(data);

    let max = 0;
    // getting maximum id from json file
    data.forEach(element => {
    
      if(element.id > max) max = element.id;        
    });
    // as we have received request in body, getting it
    let body = req.body;
    // making next id
    body.id = max + 1;
    // pushing coming body from user into our data i.e. json data
    data.push(body);
    // writing updated data back to file after stringyfying it
    fs.writeFileSync("./DB.json", JSON.stringify(data));
    res.send("data inserted successfully");
});

// dealing with put request i.e. updating data
app.put("/put",(req, res)=>{
// id is being sent using query string, converting it into int
let id = parseInt(req.query.id);
// getting body data
let body = req.body;
// assing id to body data
body.id = id;
// reading file
let data = fs.readFileSync("./DB.json", {"encoding": "utf-8"});
// parsing data from file
data = JSON.parse(data);
// looping through data
data.forEach((obj, index)=>{
  // updating data where id sent by user and data id is same and assigning this id new data that we received in body
if(obj.id === id){
  data[index] = body;
}
});
// writing data back to file after stringiying it
fs.writeFileSync("./DB.json", JSON.stringify(data));
// sending response
res.send("data updated successfully");
});

// :id is knwon as param, it can be considerd as dynamic url
app.delete("/delete/:id", (req, res)=>{
  // getting id through params property url would be: localhost:4000/delete/:id
  let id = parseInt(req.params.id);
  // reading file and parsing it to make data an array
  let data = fs.readFileSync("./DB.json", {"encoding":"utf-8"});
  data = JSON.parse(data);
  // looping through data
  data.forEach((obj, index)=>{
  // splice remove item from an array on a specific index
  if(obj.id === id){
    data.splice(index, index);
    msg = "data deleted successfully";
  }
  else{
    msg = "data deletion  un-successful";
  }
  }); 
  // writing data back to file
  fs.writeFileSync("./DB.json", JSON.stringify(data));

  res.send(msg);
  });
  
// handling all bad request i.e. 404 reuests
app.all("*", (req, res)=>{
    res.status(404).send("We don't entertain this page");
});

app.listen(4000, console.log("our server is running"));