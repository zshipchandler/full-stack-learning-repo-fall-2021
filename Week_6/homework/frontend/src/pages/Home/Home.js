import "./style.css";
import { useEffect, useState, Fragment } from "react";
import ListItem from "../../components/ListItem/ListItem";
import { useHistory } from "react-router-dom";
import jwtDecode from "jwt-decode";

export default function Home(props) {
const history = useHistory();
const [tasksToDo, setToDos] = useState([]);
const [tasksDone, setDone] = useState([]);
const [name, setName] = useState();
const [taskName, setTaskName] = useState();

useEffect(() => {
  async function loadCredentials() {
    if (!localStorage.getItem("@token")) {
      history.push("/login");
    } else {
      const request = await fetch("http://localhost:4000/auth", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("@token"),
        },
      });

      const status = await request.status;

      if (status != 200) {
        history.push("/login");
      }
      const decode = jwtDecode(localStorage.getItem("@token"));
      setName(decode.name);
    }
  }

  async function loadToDos() {
    const request = await fetch("http://localhost:4000/getAll", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("@token"),
      },
    });
  const resp = await request.json();
  const status = await request.status;

  //success case
  if (status == 200) {
    const data = resp.data;
    const todos = [];
    const completed = [];

    data.map((item) => {
      if (!item.status) {
        todos.push(item.description);
      } else {
        completed.push(item.description);
      }
    });
    setDone(completed);
    setToDos(todos);
  }
  }

  loadCredentials().then(() => {
    loadToDos();
  });
}, []);

async function addTaskToDo() {
  if (taskName) {
    if (tasksToDo.includes(taskName)) {
      alert("Task already exists")
    } else {
      setToDos(tasksToDo.concat(taskName));
    }
    setTaskName("");

    //backend
    console.log(taskName);
    const request = await fetch("http://localhost:4000/todo", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("@token"),
      },
      body: JSON.stringify({ description: taskName, state: false }),
    });

    const resp = await request.json();
    console.log(JSON.stringify(resp));
    const status = await request.status;

    if (status == 200) {
      //success
      setToDos(tasksToDo.concat(resp.description));
      console.log(taskName.id);
    }
  }
}

async function doneTask(i) {
  const finishedTask = tasksToDo[i];
  //backend
  const request1 = await fetch("http://localhost:4000/id", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("@token"),
    },
    body: JSON.stringify({ description: finishedTask}),
  });

  const resp1 = await request1.json();
  const id = resp1.id;

  const request = await fetch("http://localhost:4000/toggle", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("@token"),
    },
    body: JSON.stringify({ id: id}),
  });

  const resp = await request.json();
  const status = await request.status;

  setToDos(tasksToDo.filter((task) => task != finishedTask));
  setDone([finishedTask, ...tasksDone]);
}

async function undo(i) {
  const unDoneTask = tasksDone[i];

  //backend
  const request1 = await fetch("http://localhost:4000/id", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("@token"),
    },
    body: JSON.stringify({ description: unDoneTask}),
  });

  const resp1 = await request1.json();
  const id = resp1.id;

  const request = await fetch("http://localhost:4000/toggle", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("@token"),
    },
    body: JSON.stringify({ id: id }),
  });

  const resp = await request.json();
  const status = await request.status;

  if (status == 200) {
    //success
    setDone(tasksDone.filter((task) => task != tasksDone[i]));
    const newToDos = [tasksDone[i], ...tasksToDo];
    setToDos(newToDos);
  }
}

  return (
    <Fragment>
      <h1>What Do I have Planned For Today?</h1>
        <h2 id = "howManyTasks">
        {name}, you have {tasksToDo.length} tasks left to do
        </h2>
      <div id = "AddTaskBar">
        <input
          placeholder = 'Add a to-do'
          value = {taskName}
          id = "input_bar"
          onChange={(event) => setTaskName(event.target.value)}
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
        <button 
          className = "logout-button"
          onClick={() => {
            localStorage.removeItem("@token");
            history.push("/login");
          }}
          > Logout </button>
    </Fragment>
  );
}
