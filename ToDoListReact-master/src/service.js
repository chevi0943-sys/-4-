const API_URL = "http://localhost:5127/tasks"; // הנתיב מתאים ל־backend בענן

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
}

async function deleteTodo(id) {
  await fetch(`${API_URL}/${id}`, {
    method: "DELETE"
  });
}

export default {
  getTodos,
  addTodo,
  updateTodo,
  deleteTodo
};
