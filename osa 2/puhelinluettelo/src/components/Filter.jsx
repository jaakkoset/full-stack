const Filter = (props) => {
  const doNothing = (event) => {
    // When user hits enter in the filter text field, nothing should happen
    event.preventDefault();
  };

  return (
    <form onSubmit={doNothing}>
      <div>
        filter shown with:{" "}
        <input value={props.newFilter} onChange={props.handleFilterChange} />
      </div>
    </form>
  );
};

export default Filter;
