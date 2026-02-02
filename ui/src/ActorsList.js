import ActorListItem from "./ActorListItem";
import {useTransition, animated} from '@react-spring/web';


export default function ActorsList(props) {
    const transitions = useTransition(props.actors, {
        keys: actor => actor.id,

        from: {opacity: 0, transform: 'translateY(-20px)', backgroundColor: '#d4edda'},
        enter: actor => ({backgroundColor: actor.isNew ? '#d4edda' : '#fff', opacity: 1, transform: 'rotateX(0deg)'}),
        leave: {opacity: 0, transform: 'translateX(50px)'},
        config: {tension: 300, friction: 10},
      });

    return (
        <div>
        <h2>Actors</h2>
        <ul className="actor-list">
            {transitions((style, actor) => (
              <animated.li
                style={{
                  ...style,
                  backgroundColor: actor.isNew ? '#d4edda' : '#fff',
                  padding: '0.5rem',
                  borderRadius: '6px',
                  marginBottom: '0.5rem',
                }}
              >
                <ActorListItem
                  actor={actor}
                  onDelete={() => props.onDeleteActor(actor)}
                />
              </animated.li>
            ))}
          </ul>
        </div>
      );
    }
