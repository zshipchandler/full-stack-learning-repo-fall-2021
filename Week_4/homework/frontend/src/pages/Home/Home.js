import "./style.css";
import { useEffect, useState, Fragment } from "react";
import ListItem from "../../components/ListItem/ListItem";

export default function Home(props) {
const [input, setInput] = useState('');
const [tasksToDo, setToDos] = useState([]);
const [tasksDone, setDone] = useState([]);

function addTaskToDo() {
  const newToDos = [input, ...tasksToDo];
  setToDos(newToDos);
  setInput("");
}

function doneTask(i) {
  setToDos(tasksToDo.filter((task) => task != tasksToDo[i]));
  setDone([tasksToDo[i], ...tasksDone]);
}

function undo(i) {
  setDone(tasksDone.filter((task) => task != tasksDone[i]));
  const newToDos = [tasksDone[i], ...tasksToDo];
  setToDos(newToDos);
}
  return (
    <Fragment>
      <h1>What Do I have Planned For Today?</h1>
        <h2 id = "howManyTasks">
        I have {tasksToDo.length} tasks left to do
        </h2>
      <div id = "AddTaskBar">
        <input
          placeholder = 'Add a to-do'
          value = {input}
          id = "input_bar"
          onChange={(event) => setInput(event.target.value)}
         ></input>
         <button id='todo-button' onClick={() => addTaskToDo()}>Add task</button>
        </div>
        <h2>To Do:</h2>
        <ul>
          {tasksToDo.map((input, i) => (
          <ListItem
            type = "do"
            index = {i}
            input = {input}
            completeTask = {doneTask}
            undoTask = {undo}
          ></ListItem>
          ))}
        </ul>
        <h2>Finished Tasks:</h2>
        <ul>
          {tasksDone.map((input, i) => (
          <ListItem
            type = "done"
            index = {i}
            input = {input}
            completeTask = {doneTask}
            undoTask = {undo}
            ></ListItem>
            ))}
        </ul>
    </Fragment>
  );
}
