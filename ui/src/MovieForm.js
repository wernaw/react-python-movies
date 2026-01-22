import {useState} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTimes} from "@fortawesome/free-solid-svg-icons";


export default function MovieForm(props) {
    const [title, setTitle] = useState('');
    const [year, setYear] = useState('');
    const [director, setDirector] = useState('');
    const [description, setDescription] = useState('');
    const [actors, setActors] = useState([
        { name: '', surname: '' }
    ]);

    function addMovie(event) {
        event.preventDefault();

        if (title.length < 5) {
            return alert('Title is too short!');
        }

          if (!/^\d{4}$/.test(year)) {
            return alert('Year must be a 4-digit number!');
        }

        props.onMovieSubmit({title, year, director, description, actors});

        setTitle('');
        setYear('');
        setDirector('');
        setDescription('');
        setActors([{ name: '', surname: '' }]);
    }

        function handleActorChange(index, field, value) {
            const updatedActors = [...actors];
            updatedActors[index][field] = value;
            setActors(updatedActors);
        }

        function addActor() {
            setActors([...actors, { name: '', surname: '' }]);
        }

        function removeActor(index) {
            setActors(actors.filter((_, i) => i !== index));
        }

    return <form onSubmit={addMovie}>
        <h2>Add movie</h2>
        <div>
            <label>Title</label>
            <input type="text" value={title} onChange={(event) => setTitle(event.target.value)}/>
        </div>
        <div>
            <label>Year</label>
            <input type="text" value={year} onChange={(event) => setYear(event.target.value)}/>
        </div>
        <div>
            <label>Director</label>
            <input type="text" value={director} onChange={(event) => setDirector(event.target.value)}/>
        </div>
        <div>
            <label>Description</label>
            <textarea value={description} onChange={(event) => setDescription(event.target.value)}/>
        </div>
        <div>
            {actors.map((actor, index) => (
                    <div key={index} style={{ display: "flex", gap: "8px", marginBottom: "6px" }}>
                        <input
                            placeholder="Name"
                            value={actor.name}
                            onChange={event => handleActorChange(index, "name", event.target.value)}
                        />
                        <input
                            placeholder="Surname"
                            value={actor.surname}
                            onChange={event => handleActorChange(index, "surname", event.target.value)}
                        />

                        {actors.length > 1 && (
                            <button
                                type="button"
                                onClick={() => removeActor(index)}
                                className="remove-actor-btn"
                                aria-label="Remove actor"
                            >
                                <FontAwesomeIcon icon={faTimes} />
                            </button>
                        )}
                    </div>
                ))}

                <button type="button" onClick={addActor}>Add another actor
                </button>
        </div>
        <button>{props.buttonLabel || 'Submit'}</button>
    </form>;
}
