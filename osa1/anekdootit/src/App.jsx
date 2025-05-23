import { useState } from "react";

const Button = (props) => <button onClick={props.onClick}>{props.text}</button>;

const MostVotedAnecdote = (props) => {
  const { votes, anecdotes } = props;

  let mostVotes = votes[0];
  let largestIndex = 0;

  for (let i = 1; i < 8; i++) {
    if (votes[i] > mostVotes) {
      mostVotes = votes[i];
      largestIndex = i;
    }
  }

  return (
    <div>
      {anecdotes[largestIndex]}
      <br />
      has {votes[largestIndex]} votes
    </div>
  );
};

const App = () => {
  const anecdotes = [
    "If it hurts, do it more often.",
    "Adding manpower to a late software project makes it later!",
    "The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.",
    "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.",
    "Premature optimization is the root of all evil.",
    "Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.",
    "Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when dianosing patients.",
    "The only way to go fast, is to go well.",
  ];

  const [selected, setSelected] = useState(0);
  const [votes, setVotes] = useState(Array(8).fill(0));

  const handleSelected = () => {
    const newSelected = Math.floor(Math.random() * 8);
    setSelected(newSelected);
  };

  const handleVote = (anecdote) => {
    const newVotes = { ...votes };
    newVotes[anecdote] += 1;
    setVotes(newVotes);
  };

  return (
    <div>
      <h1>Anecdote of the day</h1>
      <div>{anecdotes[selected]}</div>
      <div>has {votes[selected]} votes</div>
      <div>
        <Button onClick={() => handleVote(selected)} text={"vote"} />
        <Button onClick={handleSelected} text={"next anecdote"} />
      </div>
      <h1>Anecdote with the most votes</h1>
      <MostVotedAnecdote votes={votes} anecdotes={anecdotes} />
    </div>
  );
};

export default App;
