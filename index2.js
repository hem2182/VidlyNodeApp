const mongoose = require("mongoose");

// In real-world application, connection string comes from a configuration file.
mongoose
  .connect("mongodb://localhost/playground")
  .then(() => console.log("Connected to MongoDB..."))
  .catch((err) => console.log("Could not connect to MongoDB...", err));

// Schemas Define the shape of document in a collection in MongoDB. The Schema concept is specific to mongoose.
// It is not part of MongoDB. the schema defines the properties that we have in a document in a MongoDB collection.

// Schema Types that we can use are: String, Number, Date, Boolean, Buffer, ObjectID, Array

const courseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50,
  },
  // category value should be one of the values in enum
  category: {
    type: String,
    enum: ["web", "mobile", "network"],
    required: true,
  },
  author: String,
  // if we want tags to have at least one tag. use custom validators
  tags: {
    type: Array,
    validate: {
      validator: function (value) {
        return value && value.length > 0;
      },
      message: "A course should have at least one tag",
    },
  },
  date: { type: Date, default: Date.now },
  isPublished: Boolean,
  // price is required only for published courses
  price: {
    type: Number,
    required: function () {
      return this.isPublished;
    },
    min: 10,
    max: 200,
  },
});

// Now, the schema must be compiled into a Model. the first argument is the singular name of the model this collection is for.
// this will create a collection called courses in mongoDB. we have passed its singular name here.
// the 2nd argument is the schema that defines the shape of document in the courses collection.
// with this we get a course class in our application.
const Course = mongoose.model("Course", courseSchema);

// Saving a document
async function createCourse() {
  const course = new Course({
    name: "nodeCourse",
    author: "Mosh",
    tags: null,
    category: "-",
    isPublished: true,
    price: 10,
  });
  try {
    const result = await course.save();
    console.log(result);
  } catch (ex) {
    for (field in ex.errors) {
      const x = ex.errors[field];
      console.log(
        x.properties.path,
        " property is invalid.",
        " Error Message: ",
        x.properties.message,
        " Current Value:",
        x.properties.value
      );
    }
  }
}
createCourse();

// Querying Documents
// find() returns a DocumentQuery object which is like a promise. so, we can await or use .then method.
async function getCourses() {
  const courses = await Course.find();
  console.log(courses);
}

// Updating a Document - Query First: Find the course, modify its properties and then save.
// with this approach, you can validate that the update is a valid update operation.
// this approach is useful, when you have to fulfill some business rules before updating.
async function updateCourse(id) {
  var course = await Course.findById(id);
  if (!course) return;

  course.isPublished = true;
  course.author = "Another Author";

  // the below approach is identical to the above approach.
  //   course.set({
  //     isPublished = true;
  //     author = "Another Author";
  //   });

  const result = await course.save();
  console.log(result);
}

// Updating a Document - Update First: Update the document directly. Optionally get the updated document.
// use the update() method to do this. this takes in a filter object. with this we can update multiple documents at once based on the filter query.

// update() method returns the query object like {n: 1, nModified: 1, ok: 1} instead of the course object.
async function updateCourse(id) {
  var result = await Course.update(
    { _id: id },
    {
      $set: {
        author: "Mosh",
        isPublished: false,
      },
    }
  );
  console.log(result);
}

// Removing documents.
async function removeCourse(id) {
  // this method finds the first one and delete it based on the filter condition passed. it returns the query object as before.
  const result = await Course.deleteOne({ _id: id });
  console.log(result);

  // similar to update, you can also use, findByIdAndRemove to get either null or the deleted object.
}
