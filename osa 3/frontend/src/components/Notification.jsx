/** This component displays a success message after a person is added successfully */
const Notification = ({ message, type }) => {
  /** Display a notification message. The `type` can be success or error and it determines
   * the style of the notification. */
  // Don't render anything if the message is null
  if (message === null) {
    return null;
  }

  // Determine the colour of the notification based on the type of the notification
  let color;
  if (type === "success") {
    color = "green";
  } else if (type === "error") {
    color = "red";
  } else {
    // Colour is grey for an unknown type
    color = "grey";
  }

  const style = {
    color: color,
    background: "lightgrey",
    fontSize: "20px",
    borderStyle: "solid",
    borderRadius: "10px",
    padding: "10px",
    marginBottom: "10px",
  };
  //console.log("style:", style);
  return <div style={style}>{message}</div>;
};

export default Notification;
