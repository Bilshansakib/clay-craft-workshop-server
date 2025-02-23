const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5000",
      "https://clay-craft-workshop.web.app",
      "https://prctice-1.vercel.app",
    ],
  })
);
app.use(express.json());

// app.use((req, res, next) => {
//   res.header({ "Access-Control-Allow-Origin": "*" });
//   next();
// });
// practice-1-project
// gpng6yWmJzBOapZn
// WnLXayNIZN8Bkdzl
// practice-1-project
console.log(process.env.DB_USER);
console.log(process.env.DB_PASS);
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.7hlvjai.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    const craftCollection = client.db("craftDB").collection("craft");
    const userCollection = client.db("craftDB").collection("user");

    app.get("/craft", async (req, res) => {
      const cursor = craftCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.post("/craft", async (req, res) => {
      const newCraft = req.body;
      const result = await craftCollection.insertOne(newCraft);
      res.send(result);
    });

    app.get("/craft/:email", async (req, res) => {
      const result = await craftCollection
        .find({ email: req.params.email })
        .toArray();
      res.send(result);
    });

    app.get("/singleCraft/:id", async (req, res) => {
      console.log(req.params.id);
      const result = await craftCollection.findOne({
        _id: new ObjectId(req.params.id),
      });
      res.send(result);
    });

    app.put("/updateCraft/:id", async (req, res) => {
      console.log(req.params.id);
      const query = { _id: new ObjectId(req.params.id) };
      const data = {
        $set: {
          photo: req.body.photo,
          itemName: req.body.itemName,
          subCategoryName: req.body.subCategoryName,
          shortDescription: req.body.shortDescription,
          price: req.body.price,
          rating: req.body.rating,
          customization: req.body.customization,
          processingTime: req.body.processingTime,
          stockStatus: req.body.stockStatus,
        },
      };
      const result = await craftCollection.updateOne(query, data);
      console.log(result);
      res.send(result);
    });

    app.delete("/delete/:id", async (req, res) => {
      const result = await craftCollection.deleteOne({
        _id: new ObjectId(req.params.id),
      });
      console.log(result);
      res.send(result);
    });

    app.get("/viewDetails/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await craftCollection.findOne(query);
      res.send(result);
    });

    // user section
    app.get("/user", async (req, res) => {
      const cursor = userCollection.find();
      const users = await cursor.toArray();
      res.send(users);
    });

    app.post("/user", async (req, res) => {
      const user = req.body;
      console.log(user);
      const result = await userCollection.insertOne(user);
      res.send(result);
    });

    // sort

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello World bhaia");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
