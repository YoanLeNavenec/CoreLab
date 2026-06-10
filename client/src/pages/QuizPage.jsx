import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getQuiz, submitQuiz, getMyAttempts } from "../api/quiz.api";
import styles from "../styles/Quiz.module.css";

export default function QuizPage() {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState(null);
  const [attempts, setAttempts] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [quizData, attemptsData] = await Promise.all([
          getQuiz(courseId),
          getMyAttempts(courseId),
        ]);
        setQuiz(quizData);
        setAttempts(attemptsData);
        setAnswers(new Array(quizData.questions.length).fill(null));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [courseId]);

  const handleAnswer = (questionIndex, optionIndex) => {
    setAnswers((prev) => {
      const updated = [...prev];
      updated[questionIndex] = optionIndex;
      return updated;
    });
  };

  const handleSubmit = async () => {
    if (answers.includes(null)) {
      return setError("Please answer all questions before submitting.");
    }
    try {
      setSubmitting(true);
      setError(null);
      const data = await submitQuiz(courseId, answers);
      setResult(data);
      const updatedAttempts = await getMyAttempts(courseId);
      setAttempts(updatedAttempts);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleRetake = () => {
    setResult(null);
    setAnswers(new Array(quiz.questions.length).fill(null));
  };

  if (loading) return <p className="text-muted">Loading quiz...</p>;
  if (error && !quiz) return <p className={styles.error}>{error}</p>;
  if (!quiz) return <p className="text-muted">No quiz available for this course.</p>;

  if (result) {
    return (
      <div className={styles.page}>
        <div className={styles.results}>
          <p className={styles.resultsLabel}>Your result</p>
          <p className={`${styles.resultsScore} ${result.passed ? styles.resultsPassed : styles.resultsFailed}`}>
            {result.score}%
          </p>
          <p className={styles.resultsMessage}>
            {result.passed ? "You passed!" : "You didn't pass this time."}
          </p>
          <p className="text-muted">Passing score: {result.passingScore}% — {result.correct} / {result.total} correct</p>
          <div className={styles.actions} style={{ marginTop: '24px', justifyContent: 'center' }}>
            <button className={styles.btnSecondary} onClick={handleRetake}>Retake Quiz</button>
            <button className={styles.btnPrimary} onClick={() => navigate(`/courses/${courseId}`)}>Back to Course</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <p className={styles.breadcrumb}>
          Courses <span>/</span> {quiz.title}
        </p>
        <h1>{quiz.title}</h1>
        <p className="text-muted">Passing score: {quiz.passingScore}%</p>
        <div className={styles.progressBar}>
          <div className={styles.progressTrack}>
            <div
              className={styles.progressFill}
              style={{ width: `${(answers.filter(a => a !== null).length / quiz.questions.length) * 100}%` }}
            />
          </div>
          <span className={styles.progressCount}>
            {answers.filter(a => a !== null).length} / {quiz.questions.length} answered
          </span>
        </div>
      </div>

      {attempts.length > 0 && (
        <div className={styles.questionCard} style={{ marginBottom: '24px' }}>
          <p className={styles.questionNumber}>Previous attempts</p>
          {attempts.map((attempt, i) => (
            <p key={attempt._id} className="text-muted">
              Attempt {attempts.length - i}: {attempt.score}%
              — {attempt.passed ? "Passed" : "Failed"}
              — {new Date(attempt.createdAt).toLocaleDateString()}
            </p>
          ))}
        </div>
      )}

      {quiz.questions.map((q, qi) => (
        <div key={q._id} className={styles.questionCard}>
          <p className={styles.questionNumber}>Question {qi + 1}</p>
          <p className={styles.questionText}>{q.question}</p>
          <div className={styles.options}>
            {q.options.map((option, oi) => (
              <button
                key={oi}
                className={`${styles.option} ${answers[qi] === oi ? styles.optionSelected : ''}`}
                onClick={() => handleAnswer(qi, oi)}
              >
                <span className={styles.optionLetter}>
                  {String.fromCharCode(65 + oi)}
                </span>
                {option}
              </button>
            ))}
          </div>
        </div>
      ))}

      {error && <p className={styles.error}>{error}</p>}

      <div className={styles.actions}>
        <button className={styles.btnSecondary} onClick={() => navigate(`/courses/${courseId}`)}>
          Cancel
        </button>
        <button className={styles.btnPrimary} onClick={handleSubmit} disabled={submitting}>
          {submitting ? "Submitting..." : "Submit Quiz"}
        </button>
      </div>
    </div>
  );
}
