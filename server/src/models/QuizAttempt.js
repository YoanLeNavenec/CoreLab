import mongoose from "mongoose";

//Schema for QuizAttempt which records a student's attempt at a quiz, including their answers, score, and whether they passed.
const quizAttemptSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  quiz: { type: mongoose.Schema.Types.ObjectId, ref: "Quiz", required: true },
  course: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
  answers: [{ type: Number }],
  // array of chosen indices, one per question e.g. [0, 2, 1, 3]
  score: { type: Number, required: true },
  // percentage score e.g. 85
  passed: { type: Boolean, required: true },
}, { timestamps: true });

//Export the QuizAttempt model based on the quizAttemptSchema
export default mongoose.model("QuizAttempt", quizAttemptSchema);