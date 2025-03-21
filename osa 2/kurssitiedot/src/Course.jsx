const Course = (props) => {
  const { parts, name } = props.course;
  const total = parts.reduce((sum, part) => {
    return sum + part.exercises;
  }, 0);

  return (
    <div>
      <Header title={name} />
      <Content parts={parts} />
      <Total total={total} />
    </div>
  );
};

const Header = (props) => <h2>{props.title}</h2>;

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

const Total = (props) => (
  <p>
    <b>total of {props.total} exercises</b>
  </p>
);

export default Course;
