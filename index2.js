const mongoose = require("mongoose");

mongoose
  .connect("mongodb://localhost/playground")
  .then(() => console.log("Connected to MongoDB..."))
  .catch((err) => console.log("Could not connect to MongoDB...", err));

const authorSchema = new mongoose.Schema({
  name: String,
  bio: String,
  website: String,
});

const Author = mongoose.model("Author", authorSchema);

const Course = mongoose.model(
  "Course",
  new mongoose.Schema({
    name: String,
    authors: [authorSchema],
  })
);

async function createCourse(name, authors) {
  const course = new Course({ name, authors });
  const result = await course.save();
  console.log(result);
}

async function addAuthor(courseId, author) {
  const course = await Course.findById(courseId);
  course.authors.push(author);
  course.save();
}

async function removeAuthor(courseId, authorId) {
  const course = await Course.findById(courseId);
  const author = course.authors.id(authorId);
  author.remove();
  course.save();
}

// createCourse("NodeCourse", [
//   new Author({ name: "Mosh", bio: "Mosh Bio", website: "Mosh Website" }),
//   new Author({ name: "John", bio: "John Bio", website: "John Website" }),
// ]);

// addAuthor("5eeb7cecf661462c64444a8d", new Author({ name: "Mike" }));

removeAuthor("5eeb7cecf661462c64444a8d", "5eeb7cecf661462c64444a8c");
