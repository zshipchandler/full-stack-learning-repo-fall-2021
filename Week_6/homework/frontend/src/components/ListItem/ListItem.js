import "./style.css";

export default function ListItem(props) {
    function Click() {
        if (props.type == "do") {
            return props.completeTask(props.index);
        } else {
            return props.undoTask(props.index);
        }
    }

    let icon = '';
    if (props.type == "do") {
        icon = <img src = "/assets/checkmark.svg" class = "checkIcon"></img>
    } else {
        icon = <img src = "/assets/arrow-undo.svg" class = "undoIcon"></img>
    }

    return (
    <li>
        <div id="listItem">
            {props.input}
            <div id="icon-container"
                onClick={() => Click()}
            >
                {icon}
            </div>
        </div>
    </li>
    );
}