const express = require('express');
const cors = require('cors');
const {ObjectId,MongoClient} = require('mongodb')
require("dotenv").config();

const client = new MongoClient('mongodb://localhost:27017')
const app = express();
const db = client.db('nFactorial')
const todos = db.collection('toDoList');
app.use(express.json(), cors())


// Get all items (GET)
app.get("/items", async (req,res) => {
    
    const response = await todos.find({}).toArray();
    res.status(200).send(response)
})

// Add item (POST)
app.post("/items", async (req,res) => {
  let item = req.body;
  const response = await todos.insertOne(item);
  item["_id"] = response.insertedId;
  res.status(200).send(item);
})

// Change status (PUT)
app.put("/items/:itemId", async (req,res) => {
  const itemId = req.params.itemId;
  const {status} = req.body;
  console.log("_id:", itemId)
  console.log("status:", status)
  if(status){
      const result = await todos.updateOne({_id: new ObjectId(itemId)}, {
          $set: {
              status
          }
      })
      res.status(200).send(`${result.matchedCount} document(s) matched the filter, updated ${result.modifiedCount} document(s)`);
  } 
})

// Delete item (DELETE)
app.delete("/items/:itemId", async (req,res) => {
  const itemId = req.params.itemId;
  const result = await todos.deleteOne({_id: new ObjectId(itemId)})
  res.status(200).send("Item was successfully deleted!")
})

async function run() {
  try {
    // Connect the client to the server    (optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");

  } finally {
  }
}
run().catch(console.dir);

app.listen(8000, () => {
    console.log("Server is started")
})