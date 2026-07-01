const Logout = ({ name, handleClick }) => (
  <div>
    <p>
      {name} logged in <button onClick={handleClick}>Logout</button>
    </p>
  </div>
)

export default Logout
