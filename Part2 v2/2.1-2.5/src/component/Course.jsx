const Header = ({ course }) => <h1>{course.name}</h1>;

const Part = ({ part }) => (
  <p>
    {part.name} {part.exercises}
  </p>
);

const Content = ({ parts }) => (
  <div>
    {parts.map(part => (
      <Part key={part.id} part={part} />
    ))}
  </div>
);

const Total = ({ parts }) => {
  const total = parts.reduce((sum, part) => {
    console.log('Calculating the sum:', sum, part);
    return sum + part.exercises;
  }, 0);
  return <p><strong>Total of {total} exercises</strong></p>;
};

const MainTitle = () => (
  <div>
    <h1>Web Development Curriculim</h1>
  </div>
);

const Course = ({ course }) => (
  <div>
    <Header course={course} />
    <Content parts={course.parts} />
    <Total parts={course.parts} />
    <hr />
  </div>

);

export default Course;
