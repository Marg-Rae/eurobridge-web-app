const CourseCard = ({ course }) => {
  return (
    <article className="card">
      <div className="card-header">
        <h3>{course.title}</h3>
        <span className="pill">{course.level}</span>
      </div>
      <p>{course.description}</p>
      <div className="card-meta">
        <span>{course.duration}</span>
        <span>{course.price}</span>
      </div>
    </article>
  );
};

export default CourseCard;
