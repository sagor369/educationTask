const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
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

    // all enrollment Calection
    const adminCalection = client
      .db("educationTask")
      .collection("admin");

    await client.connect();

    // middleFanction
    const mutchStudent = async (req, res, next) => {
      const email = req.params.email;
      console.log(email)
      const mutchEmail = {
        email: email,
      };
      const mutchStudent = await studentsCalection.findOne(mutchEmail);
      if (!mutchStudent) {
        res.send({result: false,  message: "you are not a valide student" });
      } else {
        next();
      }
    };


    // admin check code 
    const isAdmin = async(req, res, next) =>{
      const {adminEmail }= req.body 
      const queryData = {adminEmail}
      const checkEmail = await adminCalection.findOne(queryData)
      if(!checkEmail){
        res.send({result:false, message: "you ar not a admin "})
      }
      else{
        next()
      }
    }

    // student calection code

    // student added in mongodb code
    app.post("/add_student", async (req, res) => {
      const studentDetails = req.body;
      const { name, email, phone, userName, photo, roll } = studentDetails;
      const query = {
        name,
        email,
        phone,
        userName,
        photo,
        roll
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



    // get student in mongodb single student
    app.get("/student/:email", mutchStudent, async (req, res) => {
      const email = req.params.email;
      const queryData = {
        email: email
      }
      const data = await studentsCalection.findOne(queryData);
      res.send({ result: true, data });
    });


    // get all students in mongodb only use for admin 
    app.get("/students",  async (req, res) => {
      const data = await studentsCalection.find().toArray();
      res.send({ result: true, data });
    });


    // student update profile only use for admin 
    app.patch("/student/:id" , isAdmin,  async(req, res)=>{
        const id = req.params.id 
        const roll = req.body
        const studentId = {_id : new ObjectId(id)}
        const result = await studentsCalection.findOne(studentId)
        if(result){
            const rollChange = {
                roll: roll
            }
            const data = await studentsCalection.updateOne(studentId, rollChange)
            res.send({ result: true, data });
        }
    })


    // student delete code 
    app.delete("/student/:id" ,isAdmin,  async(req, res) =>{
        const id = req.params.id 
        const studentId = {_id : new ObjectId(id)}
        const data = await studentsCalection.deleteOne(studentId)
        res.send({ result: true, data });

    })


    // course calection code 

    // all course list 
    app.get("/courses", async(req, res)=>{
      const data = await courseCalection.find().toArray()
      res.send({ result: true, data });
    })


    // course create code 
    app.post("/course", isAdmin, async(req, res) =>{
      const courseData = req.body 
      const {title, description, image, rating, price} = courseData
      const queryData = {
        title,
        description,
        image,
        rating,
        price
      } 
      const data = await courseCalection.insertOne(queryData)
      res.send({ result: true, data });
    })


    // course update code 
    app.patch("/course/:id", isAdmin, async(req,res) =>{
      const id = req.params.id
      const courseId = {_id: new ObjectId(id)}
      const {body} = req.body
      const {title, description, image, rating, price} = body

      const findCourse = await courseCalection.findOne(courseId)

      // update data create 
      const queryData = {
        title: title || findCourse.title,
        description: description || findCourse.description,
        image: image || findCourse.image,
        rating : rating || findCourse.rating,
        price: price || findCourse.price
      } 

      if(findCourse){
        const data = await courseCalection.updateOne(courseId, queryData )
        res.send({ result: true, data });
      }

    })

    //  course delete code 
    app.delete("/course/:id", isAdmin, async(req, res) =>{
      const id = req.params.id
      const deleteId = {_id: new ObjectId(id)}
      const data = await courseCalection.deleteOne(deleteId)
      res.send({ result: true, data });
    })



    // all enrollment code 

    // TODO admin 
    // get enrollment code 
    app.get("/enroll", isAdmin, async(req, res) =>{
      const data = await enrollmentCalection.find().toArray()
      res.send({ result: true, data });
    })


    // enrollment create code 
    app.post("/enroll", async(req, res) =>{
      const {body} = req.body
      const {courseTitle, studentName, studentEmail, courseId } =body

      const queryData = {
        courseId, studentName, studentEmail, courseTitle
      }
      const data = await enrollmentCalection.insertOne(queryData)
      res.send({ result: true, data });
    })


    // enrollment delete code 
    app.delete("/enroll/:id", isAdmin, async(req, res) =>{
      const id = req.params.id
      const deleteId = {_id: new ObjectId(id)}
      const data = await enrollmentCalection.deleteOne(deleteId)
      res.send({ result: true, data });
    })


    // individually enrollment list code 
    app.get("/enroll/:title" , isAdmin,  async(req, res) =>{
      const title = req.params.title 
      const mutchTitle = {
      courseTitle: title 
      }
      const data = await enrollmentCalection.find(mutchTitle).toArray()
      res.send({ result: true, data });

    })




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
