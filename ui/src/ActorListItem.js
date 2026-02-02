import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTrash, faPlus} from "@fortawesome/free-solid-svg-icons";
import {useState} from "react";


export default function ActorListItem(props) {
    const [selectedMovieId, setSelectedMovieId] = useState("");
    const [showAssign, setShowAssign] = useState(false);
    const movies = props.movies || [];

    function handleAssign() {
        props.onAssign(props.actor.id, selectedMovieId);
        setShowAssign(false);
        setSelectedMovieId("");
    }

    return (
         <div className={`actor-item ${props.actor.isNew ? "new" : ""}`}>
                <div className="actor-details">
                <span>{props.actor.name}</span>{' '}
                <span>{props.actor.surname}</span>{' '}
                <a className="delete-btn" onClick={props.onDelete}>
                  <FontAwesomeIcon icon={faTrash} style={{ marginRight: "4px" }} />
                  Delete
                </a>
                <a
                  className="assign-btn"
                  onClick={() => setShowAssign((prev) => !prev)}
                >
                  <FontAwesomeIcon icon={faPlus} style={{ marginRight: "4px" }} />
                  Assign
                </a>
                </div>
                {showAssign && (
                  <div className="actor-assign">
                    <select
                      value={selectedMovieId}
                      onChange={(e) => setSelectedMovieId(e.target.value)}
                      disabled={movies.length === 0}
                    >
                      <option value="">Select a movie</option>
                    {movies.map((movie) => (
                      <option key={movie.id} value={movie.id}>
                        {movie.title}
                      </option>
                    ))}
                  </select>
                    <button
                      className="button submit-btn"
                      onClick={handleAssign}
                      disabled={!selectedMovieId || movies.length === 0}
                    >
                      Submit
                    </button>
                  </div>
                )}
        </div>
    );
}
