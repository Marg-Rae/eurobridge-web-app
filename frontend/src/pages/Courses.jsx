import { useEffect, useState } from "react";
import api from "../api/axios.js";
import CourseCard from "../components/CourseCard.jsx";
import Loading from "../components/Loading.jsx";
import ErrorMessage from "../components/ErrorMessage.jsx";

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setIsLoading(true);
        const response = await api.get("/api/courses");
        setCourses(response.data);
      } catch (err) {
        setError("Unable to load courses right now.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourses();
  }, []);

  if (isLoading) {
    return <Loading label="Loading courses" />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  return (
    <section className="page">
      <h1>Courses</h1>
      <div className="card-grid">
        {courses.map((course) => (
          <CourseCard key={course._id} course={course} />
        ))}
      </div>
    </section>
  );
};

export default Courses;
