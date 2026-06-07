import { useState, useEffect } from "react";
import { getCourses } from "../api/course.api";
import CourseCard from "../components/course/CourseCard";

//CourseList page component that fetches and displays a list of all courses with loading and error handling
export default function CourseList() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  //Fetch courses from API on component mount, with error handling and loading state management
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const data = await getCourses();
        setCourses(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    //Call the fetchCourses function to load courses when the component mounts
    fetchCourses();
  }, []);

  //Render loading message, error message, or list of courses based on current state
  if (loading) return <p>Loading courses...</p>;
  if (error) return <p>Error: {error}</p>;
  if (courses.length === 0) return <p>No courses available yet.</p>;

  //Map over courses and render a CourseCard for each one
  return (
    <div>
      <h1>All Courses</h1>
      <div>
        {courses.map((course) => (
          <CourseCard key={course._id} course={course} />
        ))}
      </div>
    </div>
  );
}