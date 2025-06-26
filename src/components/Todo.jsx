import { useEffect, useState } from "react";

export default function Todo({ userId }) {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");
  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState("");
  const [loadingAdd, setLoadingAdd] = useState(false);
  const [loadingSaveId, setLoadingSaveId] = useState(null);
  const [loadingDeleteId, setLoadingDeleteId] = useState(null);

  const fetchTodos = async () => {
    try {
      const res = await fetch(`http://localhost/todo-backend/get_todos.php?user_id=${userId}`);
      const data = await res.json();
      setTodos(data);
    } catch (err) {
      console.error("Error fetching todos:", err);
    }
  };

  const addTodo = async () => {
    if (!newTodo.trim()) return;
    setLoadingAdd(true);
    try {
      await fetch("http://localhost/todo-backend/add_todo.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId, text: newTodo }),
      });
      setNewTodo("");
      fetchTodos();
    } catch (err) {
      console.error("Error adding todo:", err);
    } finally {
      setLoadingAdd(false);
    }
  };

  const updateTodo = async () => {
    if (!editText.trim()) return;
    setLoadingSaveId(editId);
    try {
      await fetch("https://boltxgaming.com/todo/update_todo.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: editId, text: editText }),
      });
      setEditId(null);
      setEditText("");
      fetchTodos();
    } catch (err) {
      console.error("Error updating todo:", err);
    } finally {
      setLoadingSaveId(null);
    }
  };

  const deleteTodo = async (id) => {
    setLoadingDeleteId(id);
    try {
      await fetch("https://boltxgaming.com/todo/delete_todo.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      fetchTodos();
    } catch (err) {
      console.error("Error deleting todo:", err);
    } finally {
      setLoadingDeleteId(null);
    }
  };

  const startEditing = (id, text) => {
    setEditId(id);
    setEditText(text);
  };

  const cancelEditing = () => {
    setEditId(null);
    setEditText("");
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  return (
    <div className="row justify-content-center">
      <div className="col-12 col-sm-10 col-md-8 col-lg-6 col-xl-5">
        <div className="card shadow p-4 mb-4" style={{ maxWidth: "600px", margin: "auto" }}>
          <h3 className="mb-3 text-primary">Your Todos</h3>

          <div className="input-group mb-4">
            <input
              type="text"
              className="form-control"
              placeholder="New Todo"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              disabled={loadingAdd}
            />
            <button className="btn btn-primary" onClick={addTodo} disabled={loadingAdd}>
              {loadingAdd ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" />
                  Adding...
                </>
              ) : (
                "Add"
              )}
            </button>
          </div>

          {todos.length === 0 ? (
            <p className="text-muted">No todos yet. Add one above!</p>
          ) : (
            <ul className="list-group">
              {todos.map((todo) => (
                <li
                  key={todo.id}
                  className="list-group-item d-flex align-items-center justify-content-between flex-wrap gap-2"
                >
                  {editId === todo.id ? (
                    <div className="w-100 d-flex flex-column flex-md-row align-items-md-center gap-2">
                      <input
                        className="form-control"
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        disabled={loadingSaveId === todo.id}
                      />
                      <div className="btn-group">
                        <button
                          className="btn btn-success btn-sm"
                          onClick={updateTodo}
                          disabled={loadingSaveId === todo.id}
                        >
                          {loadingSaveId === todo.id ? (
                            <span className="spinner-border spinner-border-sm me-2" />
                          ) : null}
                          Save
                        </button>
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={cancelEditing}
                          disabled={loadingSaveId === todo.id}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <span className="me-2 flex-grow-1">{todo.text}</span>
                      <div className="btn-group">
                        <button
                          className="btn btn-outline-success btn-sm"
                          onClick={() => startEditing(todo.id, todo.text)}
                          disabled={loadingDeleteId === todo.id}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-outline-danger btn-sm"
                          onClick={() => deleteTodo(todo.id)}
                          disabled={loadingDeleteId === todo.id}
                        >
                          {loadingDeleteId === todo.id ? (
                            <span className="spinner-border spinner-border-sm me-1" />
                          ) : null}
                          Delete
                        </button>
                      </div>
                    </>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
