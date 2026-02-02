import './App.css';
import {useState, useEffect} from "react";
import "milligram";
import MovieForm from "./MovieForm";
import MoviesList from "./MoviesList";
import ActorForm from "./ActorForm";
import ActorsList from "./ActorsList";
import Loader from "./Loader";
import {ToastContainer, toast } from 'react-toastify';


function App() {
    const [movies, setMovies] = useState([]);
    const [addingMovie, setAddingMovie] = useState(false);
    const [loading, setLoading] = useState(true);
    const [actors, setActors] = useState([]);
    const [addingActor, setAddingActor] = useState(false);

    async function handleAddMovie(movie) {
        const response = await fetch('/movies', {
            method: 'POST',
            body: JSON.stringify(movie),
            headers: {'Content-Type': 'application/json'}
        });
        if (response.ok) {toast.success ("Movie added successfully!");
            const movieWithID = await response.json();
            movie.id = movieWithID.id;
            movie.isNew = true;

            setMovies([...movies, movie]);
            setAddingMovie(false);

            setTimeout(() => {
                setMovies(prev => prev.map(m => m.id === movie.id ? { ...m, isNew: false } : m));
            }, 2000);

            const actorsResponse = await fetch('/actors');
            if (actorsResponse.ok) {
                const updatedActors = await actorsResponse.json();
                setActors(updatedActors);
            }
        }
        else {toast.error ("Failed to add movie")}
    }

    async function handleAddActor(actor) {
        const response = await fetch('/actors', {
        method: 'POST',
        body: JSON.stringify(actor),
        headers: { 'Content-Type': 'application/json' }
      });

      if (response.ok) {toast.success ("Actor added successfully!")
          const actorWithID = await response.json();
          actor.id = actorWithID.id;
          actor.isNew = true;

        setActors([...actors, actor]);
        setAddingActor(false);

        setTimeout(() => {
            setActors(prev => prev.map(a => a.id === actor.id ? { ...a, isNew: false } : a));
            }, 2000);
      }
      else {toast.error ("Failed to add actor")}
    }

    async function handleDeleteMovie(movie) {
        if (!(await confirmDelete("Are you sure you want to delete this movie?"))) {
            return;
          }

        const url = `/movies/${movie.id}`;
        const response = await fetch(url, {method: 'DELETE'});
        if (response.ok) {toast.success ("Movie deleted successfully!")
            setMovies(movies.filter(m => m !== movie));
        }
        else {toast.error ("Failed to delete movie")}
        }

    async function handleDeleteActor(actor) {
        if (!(await confirmDelete("Are you sure you want to delete this actor?"))) {
            return;
          }

        const url = `/actors/${actor.id}`;
        const response = await fetch(url, {method: 'DELETE'});
        if (response.ok) {toast.success ("Actor deleted successfully!")
            setActors(actors.filter(a => a !== actor));

            setMovies(prevMovies =>
                prevMovies.map(movie => ({
                    ...movie,
                    actors: movie.actors ? movie.actors.filter(a => a.id !== actor.id) : []
                }))
            );
        }
        else {toast.error ("Failed to delete actor")}
        }

    async function getActorsForMovie(movieId) {
        const response = await fetch(`/movies/${movieId}/actors`);
        if (!response.ok) {
            return [];
        }
        return await response.json();
    }

    useEffect(() => {
        const fetchMovies = async () => {
            setLoading(true);

            const response = await fetch(`/movies`);
            if (response.ok) {
                const movies = await response.json();
                const moviesWithActors = await Promise.all(
                    movies.map(async (movie) => {
                        const actors = await getActorsForMovie(movie.id);
                        return {
                            ...movie,
                            actors
                        };
                    })
                );

                setMovies(moviesWithActors);
            }
            else {toast.error ("Sorry! We couldn't load movies")}
            setLoading(false);
        };
        fetchMovies();
    }, []);

    useEffect(() => {
        const fetchActors = async () => {
            setLoading(true);

            const response = await fetch(`/actors`);
            if (response.ok) {
                const actors = await response.json();
                setActors(actors);
            }
            else {toast.error ("Sorry! We couldn't load actors")}
            setLoading(false);
        };
        fetchActors();
    }, []);

     function confirmDelete(message) {
        return new Promise((resolve) => {
        toast(
          ({ closeToast }) => (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <span>{message}</span>
              <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                <button
                  className="button button-outline" onClick={() => {resolve(false);closeToast()}}
                > Cancel
                </button>
                <button
                  className="button" onClick={() => {resolve(true); closeToast()}}
                > Yes
                </button>
              </div>
            </div>
          ),
          { autoClose: false, position: 'top-center' }
        );
      });
    }

    async function handleUpdateMovie(updatedMovie) {
      const response = await fetch(`/movies/${updatedMovie.id}`, {
        method: "PUT",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
          title: updatedMovie.title,
          year: updatedMovie.year,
          director: updatedMovie.director,
          description: updatedMovie.description,
          actors: []
        })
      });

      if (response.ok) {toast.success("Movie updated successfully!")
        setMovies(prev =>
          prev.map(m => (m.id === updatedMovie.id ? updatedMovie : m))
        );
      }
      else {
        toast.error("Failed to update movie");
      }
    }

    return (
        <div className="container">
            <ToastContainer position="top-center" autoClose={2000} />
            <div className="row">
            <h1>My favourite movies to watch</h1>
            </div>
            <div className="row">
            <div className="column">
                {loading ? (
                    <div style={{display: "flex", justifyContent: "center", alignItems: "center",
                        marginTop: "2rem", minHeight: "500px"}}>
                      <Loader />
                    </div>
                  ) : movies.length === 0 ? (
                    <p>No movies yet. Maybe add something?</p>
                  ) : (
                    <MoviesList
                      movies={movies}
                      onDeleteMovie={handleDeleteMovie}
                      onUpdateMovie={handleUpdateMovie}
                    />
                  )}

                 {addingMovie
                    ? <MovieForm
                        onMovieSubmit={handleAddMovie}
                        buttonLabel="Add a movie"
                    />
                    : <button onClick={() => setAddingMovie(true)}>Add a movie</button>}
                </div>

                <div className="column column-25">
                    {loading ? (
                    <div style={{display: "flex", justifyContent: "center", alignItems: "center",
                        marginTop: "2rem", minHeight: "500px"}}>
                      <Loader />
                    </div>
                  ) :
                    actors.length === 0 ? (
                        <p>No actors yet</p>
                    ) : (
                        <ActorsList
                            actors={actors}
                            onDeleteActor={handleDeleteActor}
                        />
                    )
                    }
                    {addingActor
                        ? <ActorForm
                            onActorSubmit={handleAddActor}
                            buttonLabel="Add an actor"
                        />
                        : <button onClick={() => setAddingActor(true)}>Add an actor</button>}
                </div>
                </div>
            </div>
        );
}

export default App;
