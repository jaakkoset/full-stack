const Course = (props) => {
  const { parts, name } = props.course;

  return (
    <div>
      <Header title={name} />
      <Content parts={parts} />
    </div>
  );
};

const Header = (props) => <h1>{props.title}</h1>;

const Content = (props) => {
  const { parts } = props;
  return (
    <div>
      {parts.map((part) => (
        <Part key={part.id} part={part} />
      ))}
    </div>
  );
};

const Part = (props) => (
  <p>
    {props.part.name} {props.part.exercises}
  </p>
);

const App = () => {
  const course = {
    name: "Half Stack application development",
    id: 1,
    parts: [
      {
        name: "Fundamentals of React",
        exercises: 10,
        id: 1,
      },
      {
        name: "Using props to pass data",
        exercises: 7,
        id: 2,
      },
      {
        name: "State of a component",
        exercises: 14,
        id: 3,
      },
    ],
  };

  return (
    <div>
      <Course course={course} />
    </div>
  );
};

export default App;
