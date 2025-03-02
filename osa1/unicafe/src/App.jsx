import { useState } from "react";

const Button = ({ onClick, text }) => <button onClick={onClick}>{text}</button>;

const Statistics = (props) => {
  if (props.all === 0) {
    return <div>No feedback given</div>;
  }
  return (
    <div>
      <table>
        <tbody>
          <StatisticLine text={"good"} value={props.good} />
          <StatisticLine text={"neutral"} value={props.neutral} />
          <StatisticLine text={"bad"} value={props.bad} />
          <StatisticLine text={"all"} value={props.all} />
          <StatisticLine text={"average"} value={props.average} />
          <StatisticLine text={"positive"} value={props.positive} />
        </tbody>
      </table>
    </div>
  );
};

const StatisticLine = (props) => (
  <tr>
    <td>{props.text}</td>
    <td>{props.value}</td>
  </tr>
);

const App = () => {
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);
  const [total, setTotal] = useState(0);
  const [average, setAverage] = useState(0);
  const [positive, setPositive] = useState(0);

  const handleGood = () => {
    const newGood = good + 1;
    setGood(newGood);
    const newTotal = total + 1;
    setTotal(newTotal);
    setAverage((newGood - bad) / newTotal);
    setPositive(newGood / newTotal);
  };

  const handleNeutral = () => {
    const newNetutral = neutral + 1;
    setNeutral(newNetutral);
    const newTotal = total + 1;
    setTotal(newTotal);
    setAverage((good - bad) / newTotal);
    setPositive(good / newTotal);
  };

  const handleBad = () => {
    const newBad = bad + 1;
    setBad(newBad);
    const newTotal = total + 1;
    setTotal(newTotal);
    setAverage((good - newBad) / newTotal);
    setPositive(good / newTotal);
  };

  return (
    <div>
      <div>
        <h1>give feedback</h1>
        <Button onClick={handleGood} text={"good"} />
        <Button onClick={handleNeutral} text={"neutral"} />
        <Button onClick={handleBad} text={"bad"} />
      </div>
      <div>
        <h1>statistics</h1>
        <Statistics
          good={good}
          neutral={neutral}
          bad={bad}
          all={total}
          average={average}
          positive={100 * positive + " %"}
        />
      </div>
    </div>
  );
};

export default App;
