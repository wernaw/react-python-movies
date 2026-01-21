export default function MovieListItem(props) {
    return (
        <div>
            <div>
                <strong>{props.movie.title}</strong>
                {' '}
                <span>({props.movie.year})</span>
                {' '}
                directed by <strong>{props.movie.director}</strong>
                {' '}
                <a onClick={props.onDelete}>Delete</a>
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
            <div>
            {props.movie.description}
            </div>
        </div>
    );
}
