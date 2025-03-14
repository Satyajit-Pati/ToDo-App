// Load todos from local storage when page loads
let todoList = JSON.parse(localStorage.getItem('todos')) || [];
    
function saveTodos() {
  localStorage.setItem('todos', JSON.stringify(todoList));
}

function addTodo() {
  const inputElement = document.querySelector('#todo-input');
  const dateElement = document.querySelector('#todo-date');
  const errorElement = document.querySelector('#error-message');
  
  const todoItem = inputElement.value.trim();
  const todoDate = dateElement.value;
  
  // Validate input
  if (!todoItem) {
    errorElement.textContent = "Please enter a task";
    return;
  }
  
  if (!todoDate) {
    errorElement.textContent = "Please select a date";
    return;
  }
  
  errorElement.textContent = "";
  
  // Add new todo with a unique ID and completed status
  todoList.push({
    id: Date.now(),
    item: todoItem,
    dueDate: todoDate,
    completed: false
  });
  
  // Clear inputs
  inputElement.value = '';
  dateElement.value = '';
  
  // Save to localStorage and update display
  saveTodos();
  displayItems();
}

function toggleTodoStatus(id) {
  const todoIndex = todoList.findIndex(todo => todo.id === id);
  if (todoIndex !== -1) {
    todoList[todoIndex].completed = !todoList[todoIndex].completed;
    saveTodos();
    displayItems();
  }
}

function deleteTodo(id) {
  todoList = todoList.filter(todo => todo.id !== id);
  saveTodos();
  displayItems();
}

function formatDate(dateString) {
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
}

function isOverdue(dateString) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const dueDate = new Date(dateString);
  return dueDate < today;
}

function displayItems() {
  const containerElement = document.querySelector('#todo-container');
  
  if (todoList.length === 0) {
    containerElement.innerHTML = '<div class="empty-state">No tasks yet! Add a task to get started.</div>';
    return;
  }
  
  // Sort todos: completed at the bottom, then by date
  todoList.sort((a, b) => {
    if (a.completed !== b.completed) return a.completed ? 1 : -1;
    return new Date(a.dueDate) - new Date(b.dueDate);
  });
  
  let newHtml = '';
  
  todoList.forEach(todo => {
    const { id, item, dueDate, completed } = todo;
    const isTaskOverdue = !completed && isOverdue(dueDate);
    const dateClass = isTaskOverdue ? 'date-badge overdue' : 'date-badge';
    
    newHtml += `
      <div class="todo-item ${completed ? 'completed' : ''}">
        <div class="grid-container">
          <div>
            <input type="checkbox" class="todo-checkbox" 
              ${completed ? 'checked' : ''} 
              onchange="toggleTodoStatus(${id})">
            <span>${item}</span>
          </div>
          <span class="${dateClass}">${formatDate(dueDate)}</span>
          <div class="todo-actions">
            <button class='btn btn-delete' onclick="deleteTodo(${id})">Delete</button>
          </div>
        </div>
      </div>
    `;
  });
  
  containerElement.innerHTML = newHtml;
}

// Initialize keyboard shortcuts
document.addEventListener('keydown', function(event) {
  if (event.key === 'Enter') {
    const activeElement = document.activeElement;
    if (activeElement.id === 'todo-input' || activeElement.id === 'todo-date') {
      addTodo();
    }
  }
});

// Initial display
displayItems();