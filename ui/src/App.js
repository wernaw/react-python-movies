import './App.css';
import {useState, useEffect} from "react";
import "milligram";
import MovieForm from "./MovieForm";
import MoviesList from "./MoviesList";
import Loader from "./Loader";
import {ToastContainer, toast } from 'react-toastify';


function App() {
    const [movies, setMovies] = useState([]);
    const [addingMovie, setAddingMovie] = useState(false);
    const [loading, setLoading] = useState(true);

    async function handleAddMovie(movie) {
        const response = await fetch('/movies', {
            method: 'POST',
            body: JSON.stringify(movie),
            headers: {'Content-Type': 'application/json'}
        });
        if (response.ok) {
            toast.success ("Movie added successfully!");
            const movieWithID = await response.json();
            movie.id = movieWithID.id;
            movie.isNew = true;

            setMovies([...movies, movie]);
            setAddingMovie(false);

            setTimeout(() => {
              setMovies(prev => prev.map(m => m.id === movie.id ? { ...m, isNew: false } : m));
            }, 2000);
        }
        else {toast.error ("Failed to add movie")}
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

    return (
        <div className="container">
            <ToastContainer position="top-center" autoClose={2000} />
            <h1>My favourite movies to watch</h1>
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
                />
              )}

             {addingMovie
                ? <MovieForm
                    onMovieSubmit={handleAddMovie}
                    buttonLabel="Add a movie"
                />
                : <button onClick={() => setAddingMovie(true)}>Add a movie</button>}
        </div>
    );
}

export default App;
