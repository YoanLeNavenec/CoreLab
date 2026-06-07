import mongoose from "mongoose";

//Lesson Model with time in minutes
const lessonSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String },
  videoUrl: { type: String },
  course: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
  order: { type: Number, required: true },
  duration: { type: Number },
}, { timestamps: true });

export default mongoose.model("Lesson", lessonSchema);