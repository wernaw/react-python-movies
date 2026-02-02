import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTrash} from "@fortawesome/free-solid-svg-icons";


export default function ActorListItem(props) {
    return (
         <div className={`actor-item ${props.actor.isNew ? "new" : ""}`}>
                <span>{props.actor.name}</span>{' '}
                <span>{props.actor.surname}</span>{' '}
                <a className="delete-btn" onClick={props.onDelete}>
                  <FontAwesomeIcon icon={faTrash} style={{ marginRight: "4px" }} />
                  Delete
                </a>
        </div>
    );
}
