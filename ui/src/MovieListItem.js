import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTrash, faEdit} from "@fortawesome/free-solid-svg-icons";
import {useState} from "react";


export default function MovieListItem(props) {
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});

  function startEditing() {
    setFormData({
      title: props.movie.title,
      year: props.movie.year,
      director: props.movie.director,
      description: props.movie.description,
    });
    setEditing(true);
  }

  function handleChange(field, value) {
    setFormData(prev => ({ ...prev, [field]: value }));
  }

  function handleUpdate(e) {
    e.preventDefault();

    props.onUpdate({
      ...props.movie,
      ...formData,
        year: String(formData.year)
    });
    setEditing(false);
  }

  if (editing) {
    return (
      <form onSubmit={handleUpdate} style={{marginBottom: "1rem"}}>
        <input
          type="text"
          value={formData.title}
          onChange={e => handleChange("title", e.target.value)}
          placeholder="Title"
          required
        />
        <input
          type="text"
          value={formData.year}
          onChange={e => handleChange("year", e.target.value)}
          placeholder="Year"
          pattern="\d{4}"
          required
        />
        <input
          type="text"
          value={formData.director}
          onChange={e => handleChange("director", e.target.value)}
          placeholder="Director"
          required
        />
        <textarea
          value={formData.description}
          onChange={e => handleChange("description", e.target.value)}
          placeholder="Description"
        />
        <button type="submit">Save</button>
        <button type="edit-btn" onClick={() => setEditing(false)}>Cancel</button>
      </form>
    );
  }

  return (
    <div className={`movie-item ${props.movie.isNew ? "new" : ""}`}>
      <div>
        <strong>{props.movie.title}</strong>{" "}
        <span>({props.movie.year})</span>{" "}
        directed by <strong>{props.movie.director}</strong>{" "}
        <a className="delete-btn" onClick={props.onDelete}>
          <FontAwesomeIcon icon={faTrash} style={{ marginRight: "4px" }} />
          Delete
        </a>
        <a className="edit-btn" onClick={startEditing} style={{ marginLeft: "8px" }}>
          <FontAwesomeIcon icon={faEdit} style={{ marginRight: "4px" }} />
          Edit
        </a>
      </div>

      {props.movie.actors.length > 0 && (
        <span>
          <strong>Actors:</strong>{" "}
          {props.movie.actors.map((actor, index) => (
            <span key={index}>
              {actor.name} {actor.surname}
              {index < props.movie.actors.length - 1 && ", "}
            </span>
          ))}
        </span>
      )}

      <div>{props.movie.description}</div>
    </div>
  );
}
