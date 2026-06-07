import mongoose from "mongoose";

//Schema for Quiz questions with Title and several answers per question + a reference to the course it comes from.
const questionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: [{ type: String, required: true }],
  // options is an array of strings e.g. ["Paris", "London", "Berlin", "Madrid"]
  correctIndex: { type: Number, required: true },
  // index of the correct option in the options array e.g. 0 = "Paris"
});

//Quiz schema with title, reference to course, array of questions, and passing score percentage
const quizSchema = new mongoose.Schema({
  title: { type: String, required: true },
  course: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
  questions: [questionSchema],
  passingScore: { type: Number, default: 70 },
  // percentage needed to pass e.g. 70 means 70%
}, { timestamps: true });

//Export the Quiz model based on the quizSchema
export default mongoose.model("Quiz", quizSchema);