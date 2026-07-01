const Notification = ({ message, type }) => {
  let colour = 'green'
  if (type === 'error') {
    colour = 'red'
  }

  const style = {
    color: colour,
    background: 'lightgrey',
    fontSize: '25px',
    borderStyle: 'solid',
    borderRadius: '10px',
    padding: '10px',
    marginBottom: '10px',
  }

  return <div style={style}>{message}</div>
}

export default Notification
