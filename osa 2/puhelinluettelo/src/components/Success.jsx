/** This component displays a success message after successfully adding a new person */
const Success = ({ message }) => {
  // Don't render anything if the message is null
  if (message === null) {
    return null;
  }

  const style = {
    color: "green",
    background: "lightgrey",
    fontSize: "20px",
    borderStyle: "solid",
    borderRadius: "10px",
    padding: "10px",
    marginBottom: "10px",
  };

  return <div style={style}>{message}</div>;
};

export default Success;
