import MovieListItem from "./MovieListItem";
import {useTransition, animated} from '@react-spring/web';


export default function MoviesList(props) {
    const transitions = useTransition(props.movies, {
        keys: movie => movie.id,

        from: {opacity: 0, transform: 'translateY(-20px)', backgroundColor: '#d4edda'},
        enter: movie => ({backgroundColor: movie.isNew ? '#d4edda' : '#fff', opacity: 1, transform: 'rotateX(0deg)'}),
        leave: {opacity: 0, transform: 'translateX(50px)'},
        config: {tension: 300, friction: 10},
      });

    return (
        <div>
        <h2>Movies</h2>
        <ul className="movies-list">
            {transitions((style, movie) => (
              <animated.li
                style={{
                  ...style,
                  backgroundColor: movie.isNew ? '#d4edda' : '#fff',
                  padding: '0.5rem',
                  borderRadius: '6px',
                  marginBottom: '0.5rem',
                }}
              >
                <MovieListItem
                  movie={movie}
                  onDelete={() => props.onDeleteMovie(movie)}
                  onUpdate={props.onUpdateMovie}
                />
              </animated.li>
            ))}
          </ul>
        </div>
      );
    }
