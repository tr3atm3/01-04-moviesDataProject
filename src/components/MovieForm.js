import React, { useRef } from "react";

const MovieForm = (props) => {
  const title = useRef(null);
  const text = useRef(null);
  const date = useRef(null);
  const handleFormSubmit = (e) => {
    e.preventDefault();
    props.onAddMovie({
      title: title.current.value,
      text: text.current.value,
      date: date.current.value,
    });
  };
  return (
    <div className="formDiv">
      <form className="form" onSubmit={handleFormSubmit}>
        <label htmlFor="title">Title</label>
        <input type="text" id="title" ref={title} />
        <label htmlFor="opening">Opening Text</label>
        <textarea id="opening" ref={text} />
        <label htmlFor="date">Release Date</label>
        <input type="date" id="date" ref={date} />
        <button>Add Movie</button>
      </form>
    </div>
  );
};

export default MovieForm;
