import React, { useEffect, useState } from 'react';
import service from './service.js';

function App() {
  const [newTodo, setNewTodo] = useState("");
  const [todos, setTodos] = useState([]);

  async function getTodos() {
    const todos = await service.getTodos();
    setTodos(todos);
  }

  async function createTodo(e) {
    e.preventDefault();
    if (!newTodo.trim()) return;

    await service.addTodo({ name: newTodo, isComplete: false });
    setNewTodo("");
    await getTodos();
  }

  async function updateCompleted(todo, isComplete) {
    await service.updateTodo(todo.id, { name: todo.name, isComplete });
    await getTodos(); // שולף שוב את הרשימה המעודכנת
  }

  async function deleteTodo(id) {
    await service.deleteTodo(id);
    await getTodos();
  }

  useEffect(() => { getTodos(); }, []);

  return (
    <section className="todoapp">
      <header className="header">
        <h1>todos</h1>
        <form onSubmit={createTodo}>
          <input
            className="new-todo"
            placeholder="What needs to be done?"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
          />
        </form>
      </header>

      <section className="main">
        <ul className="todo-list">
          {todos.map(todo => (
            <li className={todo.isComplete ? "completed" : ""} key={todo.id}>
              <div className="view">
                <input
                  className="toggle"
                  type="checkbox"
                  checked={todo.isComplete || false}
                  onChange={(e) => updateCompleted(todo, e.target.checked)}
                />
                <label>{todo.name}</label>
                <button className="destroy" onClick={() => deleteTodo(todo.id)}></button>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </section>
  );
}

export default App;
