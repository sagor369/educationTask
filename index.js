const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// mongoDB connect code

const uri = `mongodb+srv://${process.env.MDB_User}:${process.env.MDB_Pass}@cluster0.nsogw9w.mongodb.net/?retryWrites=true&w=majority`;

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
    // all student  Calection
    const studentsCalection = client.db("educationTask").collection("students");

    // all Course Calection
    const courseCalection = client.db("educationTask").collection("course");

    // all enrollment Calection
    const enrollmentCalection = client
      .db("educationTask")
      .collection("enrollment");

    await client.connect();

    // student calection code

    // student added in mongodb code
    app.post("/add_student", async (req, res) => {
      const studentDetails = req.body;
      const { name, email, phone, userName, photo } = studentDetails;
      const query = {
        name,
        email,
        phone,
        userName,
        photo,
      };

      // student  mutching in mongodb
      const mutchEmail = {
        email: email,
      };
      const mutchStudent = await studentsCalection.findOne(mutchEmail);
      if (mutchStudent) {
        res.send({ message: "student already added" });
      }

      // add student in mongodb
      else {
        const data = await studentsCalection.insertOne(query);
        res.send({ result: true, data });
      }
    });


    // get student in mongodb 
    

    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
