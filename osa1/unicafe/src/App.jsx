import { useState } from "react";

const Button = ({ onClick, text }) => <button onClick={onClick}>{text}</button>;

const App = () => {
  // tallenna napit omaan tilaansa
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);

  const handleGood = () => {
    const newGood = good + 1;
    setGood(newGood);
  };

  const handleNeutral = () => {
    const newNetutral = neutral + 1;
    setNeutral(newNetutral);
  };

  const handleBad = () => {
    const newBad = bad + 1;
    setBad(newBad);
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
        good {good}
        <br />
        neutral {neutral}
        <br />
        bad {bad}
        <br />
      </div>
    </div>
  );
};

export default App;
