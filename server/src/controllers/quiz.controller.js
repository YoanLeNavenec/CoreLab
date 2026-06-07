import Quiz from "../models/Quiz.js";
import QuizAttempt from "../models/QuizAttempt.js";
import Course from "../models/Course.js";

export const createQuiz = async (req, res) => {
  // Only the course instructor can create a quiz for their course
  try {
    const course = await Course.findById(req.params.courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });

    if (course.instructor.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }
    
    // Check if a quiz already exists for this course
    const quiz = await Quiz.create({
      ...req.body,
      course: req.params.courseId,
    });

    res.status(201).json(quiz);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//Get the quiz for a course, but only return the question text and options, not the correct answers
export const getQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findOne({ course: req.params.courseId });
    if (!quiz) return res.status(404).json({ message: "No quiz for this course" });

    //strip correct answers before sending to student
    const safeQuiz = {
      _id: quiz._id,
      title: quiz.title,
      passingScore: quiz.passingScore,
      questions: quiz.questions.map(({ _id, question, options }) => ({
        _id,
        question,
        options,
        //correctIndex is intentionally excluded
      })),
    };

    //Instructors can see the full quiz with correct answers, students get the safe version without correct answers
    res.json(safeQuiz);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//Submit quiz answers, grade the attempt server-side, and record the attempt in the database
export const submitQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findOne({ course: req.params.courseId });
    if (!quiz) return res.status(404).json({ message: "No quiz for this course" });

    const { answers } = req.body;

    if (answers.length !== quiz.questions.length) {
      return res.status(400).json({ message: "Answer count doesn't match question count" });
    }

    //grade the attempt server-side
    let correct = 0;
    quiz.questions.forEach((q, i) => {
      if (answers[i] === q.correctIndex) correct++;
    });

    //calculate score as a percentage and determine if the student passed based on the quiz's passing score
    const score = Math.round((correct / quiz.questions.length) * 100);
    const passed = score >= quiz.passingScore;

    //Record the quiz attempt in the database with a reference to the student, quiz, course, their answers, score, and whether they passed
    const attempt = await QuizAttempt.create({
      student: req.user.id,
      quiz: quiz._id,
      course: req.params.courseId,
      answers,
      score,
      passed,
    });

    //Return the score, whether they passed, the passing score for the quiz, how many they got correct, total questions, and the attempt ID for reference
    res.status(201).json({
      score,
      passed,
      passingScore: quiz.passingScore,
      correct,
      total: quiz.questions.length,
      attemptId: attempt._id,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//Get all quiz attempts for the logged-in student for a specific course, sorted by most recent first
export const getMyAttempts = async (req, res) => {
  try {
    const attempts = await QuizAttempt.find({
      student: req.user.id,
      course: req.params.courseId,
    }).sort({ createdAt: -1 });
    // -1 = newest first

    res.json(attempts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};