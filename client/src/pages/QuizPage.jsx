import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getQuiz, submitQuiz, getMyAttempts } from "../api/quiz.api";

export default function QuizPage() {
  const { courseId } = useParams();
  const navigate = useNavigate();

  //State variables for quiz data, user's attempts, selected answers, quiz result, loading state, submission state, and error messages
  const [quiz, setQuiz] = useState(null);
  const [attempts, setAttempts] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  //Fetch quiz data and user's previous attempts from API on component mount, with error handling and loading state management
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [quizData, attemptsData] = await Promise.all([
          getQuiz(courseId),
          getMyAttempts(courseId),
        ]);
        setQuiz(quizData);
        setAttempts(attemptsData);
        // pre-fill answers array with null for each question
        setAnswers(new Array(quizData.questions.length).fill(null));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [courseId]);

  //Handles selecting an answer for a question, updates the answers state array at the correct index
  const handleAnswer = (questionIndex, optionIndex) => {
    // replace the answer at the right position
    setAnswers((prev) => {
      const updated = [...prev];
      updated[questionIndex] = optionIndex;
      return updated;
    });
  };

  //Handles quiz submission, checks that all questions have been answered, calls submitQuiz API, 
  //updates result state with the response, and refreshes attempts list with error handling and submission state management
  const handleSubmit = async () => {
    if (answers.includes(null)) {
      return setError("Please answer all questions before submitting.");
    }
    try {
      setSubmitting(true);
      setError(null);
      const data = await submitQuiz(courseId, answers);
      setResult(data);
      // refresh attempts list
      const updatedAttempts = await getMyAttempts(courseId);
      setAttempts(updatedAttempts);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  //Handles retaking the quiz by resetting the result and answers state to allow the user to attempt the quiz again
  const handleRetake = () => {
    setResult(null);
    setAnswers(new Array(quiz.questions.length).fill(null));
  };

  //Render loading message, error message, or quiz content based on current state
  if (loading) return <p>Loading quiz...</p>;
  if (error && !quiz) return <p>Error: {error}</p>;
  if (!quiz) return <p>No quiz available for this course.</p>;

  // show result screen after submission
  if (result) {
    return (
      <div>
        <h1>{result.passed ? "🎉 Passed!" : "❌ Failed"}</h1>
        <p>Your score: {result.score}%</p>
        <p>Passing score: {result.passingScore}%</p>
        <p>Correct answers: {result.correct} / {result.total}</p>
        <button onClick={handleRetake}>Retake Quiz</button>
        <button onClick={() => navigate(`/courses/${courseId}`)}>Back to Course</button>
      </div>
    );
  }

  return (
    <div>
      <h1>{quiz.title}</h1>
      <p>Passing score: {quiz.passingScore}%</p>

      {/* previous attempts */}
      {attempts.length > 0 && (
        <div>
          <h2>Your previous attempts</h2>
          <ul>
            {attempts.map((attempt, i) => (
              <li key={attempt._id}>
                Attempt {attempts.length - i}: {attempt.score}%
                — {attempt.passed ? "Passed ✓" : "Failed ✗"}
                — {new Date(attempt.createdAt).toLocaleDateString()}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* questions */}
      {quiz.questions.map((q, qi) => (
        <div key={q._id}>
          <h3>{qi + 1}. {q.question}</h3>
          {q.options.map((option, oi) => (
            <label key={oi} style={{ display: "block" }}>
              <input
                type="radio"
                name={`question-${qi}`}
                checked={answers[qi] === oi}
                onChange={() => handleAnswer(qi, oi)}
              />
              {option}
            </label>
          ))}
        </div>
      ))}

      {error && <p style={{ color: "red" }}>{error}</p>}

      <button onClick={handleSubmit} disabled={submitting}>
        {submitting ? "Submitting..." : "Submit Quiz"}
      </button>
    </div>
  );
}