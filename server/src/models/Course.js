import mongoose from "mongoose";

//Course Model
const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  instructor: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  lessons: [{ type: mongoose.Schema.Types.ObjectId, ref: "Lesson" }],
  price: { type: Number, default: 0 },
  thumbnail: { type: String },
  isPublished: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.model("Course", courseSchema);