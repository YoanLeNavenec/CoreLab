import { useState, useEffect } from "react";
import { getMyEnrollments } from "../api/course.api";
import { useAuthStore } from "../store/authStore";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const { user } = useAuthStore();
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);

  //Fetch user's course enrollments on component mount, with error handling and loading state management
  useEffect(() => {
    const fetchEnrollments = async () => {
      try {
        const data = await getMyEnrollments();
        setEnrollments(data);
      } catch (err) {
        console.error(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEnrollments();
  }, []);

  //Render loading message or dashboard content based on current state
  if (loading) return <p>Loading...</p>;

  //Render welcome message, list of enrolled courses with progress, and instructor section if user is an instructor
  return (
    <div>
      <h1>Welcome back, {user.name}</h1>

      <h2>My Courses</h2>
      {enrollments.length === 0 ? (
        <p>You haven't enrolled in any courses yet. <Link to="/courses">Browse courses</Link></p>
      ) : (
        <ul>
          {enrollments.map((enrollment) => (
            <li key={enrollment._id}>
              <Link to={`/courses/${enrollment.course._id}`}>
                {enrollment.course.title}
              </Link>
              <p>Progress: {enrollment.progress}%</p>
              <div style={{ width: "100%", background: "#eee" }}>
                <div style={{
                  width: `${enrollment.progress}%`,
                  background: "green",
                  height: "8px"
                }} />
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* If the user is an instructor, show a section with a link to create a new course.*/}
      {user.role === "instructor" && (
        <div>
          <h2>My Courses as Instructor</h2>
          <Link to="/courses/new">Create a new course</Link>
        </div>
      )}
    </div>
  );
}