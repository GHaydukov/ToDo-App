// export default App;
import { useState, useEffect } from "react";

const API_BASE = "http://localhost:3001";

function App() {
  const [todos, setTodos] = useState([]);
  const [popupActive, setPopupActive] = useState(false);
  const [newTodo, setNewTodo] = useState("");

  useEffect(() => {
    getTodos();
  }, []);

  const getTodos = () => {
    fetch(API_BASE + "/todos")
      .then((res) => res.json())
      .then((data) => setTodos(data))
      .catch((err) => console.error("Error: ", err));
  };

  const completeTodo = async (id) => {
    try {
      const response = await fetch(API_BASE + "/todo/complete/" + id, {
        method: "PUT",
      });

      if (response.ok) {
        setTodos((todos) =>
          todos.map((todo) => {
            if (todo._id === id) {
              return { ...todo, complete: !todo.complete };
            }
            return todo;
          })
        );
      } else {
        console.error("Failed to complete todo:", response.status);
      }
    } catch (err) {
      console.error("Error completing todo:", err);
    }
  };

  const deleteTodo = async (id) => {
    try {
      await fetch(API_BASE + "/todo/delete/" + id, {
        method: "DELETE",
      });

      setTodos((prevTodos) => prevTodos.filter((todo) => todo._id !== id));
    } catch (err) {
      console.error("Error deleting todo:", err);
    }
  };

  const addTodo = async () => {
    try {
      const response = await fetch(API_BASE + "/todo/new", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: newTodo,
        }),
      });

      if (response.ok) {
        const data = await response.json();

        setTodos([...todos, data]);
        setPopupActive(false);
        setNewTodo("");
      } else {
        console.error("Failed to create todo:", response.status);
      }
    } catch (err) {
      console.error("Error creating todo:", err);
    }
  };

  return (
    <div className="App">
      <h1>Welcome, Georgi</h1>

      <h4>Your Tasks</h4>

      <div className="todos">
        {todos.map((todo) => (
          <div
            className={"todo " + (todo.complete ? "is-complete" : "")}
            key={todo._id}
            onClick={() => completeTodo(todo._id)}
          >
            <div className="checkbox"></div>
            <div className="text">{todo.text}</div>
            <div className="delete-todo" onClick={() => deleteTodo(todo._id)}>
              X
            </div>
          </div>
        ))}
      </div>

      <div className="addPopup" onClick={() => setPopupActive(true)}>
        +
      </div>

      {popupActive ? (
        <div className="popup">
          <div className="closePopup" onClick={() => setPopupActive(false)}>
            X
          </div>

          <div className="content">
            <h3>Add Task</h3>
            <input
              type="text"
              className="add-todo-input"
              onChange={(e) => setNewTodo(e.target.value)}
              value={newTodo}
            />
            <div className="button" onClick={addTodo}>
              Create Task
            </div>
          </div>
        </div>
      ) : (
        ""
      )}
    </div>
  );
}

export default App;
