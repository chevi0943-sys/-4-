const API_URL = "http://localhost:5127/tasks"; // שימי לב לנתיב המתאים ב־backend

async function getTodos() {
  const response = await fetch(API_URL);
  return response.json();
}

async function addTodo(todo) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(todo)
  });
  return response.json();
}

async function updateTodo(id, todo) {
  await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(todo)
  });
  // אין return כי ה־API מחזיר NoContent (204)
}

async function deleteTodo(id) {
  await fetch(`${API_URL}/${id}`, {
    method: "DELETE"
  });
  // אין return
}

export default {
  getTodos,
  addTodo,
  updateTodo,
  deleteTodo
};
