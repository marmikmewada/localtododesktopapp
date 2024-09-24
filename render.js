const todoInput = document.getElementById('todo-input');
const addTodoBtn = document.getElementById('add-todo-btn');
const todoList = document.getElementById('todo-list');

let todos = [];

// Load existing todos from file
loadTodos();

// Add event listeners
addTodoBtn.addEventListener('click', addTodo);
todoList.addEventListener('click', handleTodoClick);

function loadTodos() {
  const filePath = window.electron.path.join(__dirname, 'todos.json');
  console.log(`Loading todos from ${filePath}`);

  window.electron.fs.readFile(filePath, (err, data) => {
    if (err) {
      console.error('Error loading todos:', err);
      todos = []; // Initialize empty todos if file doesn't exist
    } else {
      todos = JSON.parse(data.toString());
      console.log('Loaded todos:', todos);
    }
    renderTodoList(); // Call to render the list
  });
}

function addTodo() {
  const newTodo = todoInput.value.trim();
  console.log(`Adding todo: "${newTodo}"`);

  if (newTodo) {
    todos.push({ text: newTodo, completed: false });
    saveTodos(); // Save immediately after adding
    todoInput.value = '';
    renderTodoList(); // Render the updated list
  } else {
    console.warn('Cannot add an empty todo');
  }
}

function handleTodoClick(event) {
  if (event.target.tagName === 'LI') {
    const todoIndex = event.target.dataset.index;
    console.log(`Toggling completion for todo at index: ${todoIndex}`);

    todos[todoIndex].completed = !todos[todoIndex].completed; // Toggle completion state
    saveTodos();
    renderTodoList(); // Re-render the list
  } else if (event.target.tagName === 'BUTTON') {
    const todoIndex = event.target.dataset.index;
    console.log(`Deleting todo at index: ${todoIndex}`);

    todos.splice(todoIndex, 1); // Remove todo
    saveTodos();
    renderTodoList(); // Re-render the list
  } else {
    console.warn('Click event not handled for:', event.target);
  }
}

function renderTodoList() {
  console.log('Rendering todo list');
  todoList.innerHTML = '';

  todos.forEach((todo, index) => {
    const todoElement = document.createElement('li');
    todoElement.textContent = todo.text;
    todoElement.dataset.index = index;

    if (todo.completed) {
      todoElement.classList.add('completed');
    }

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.dataset.index = index;

    todoElement.appendChild(deleteButton);
    todoList.appendChild(todoElement);
  });
}

function saveTodos() {
  const filePath = window.electron.path.join(__dirname, 'todos.json');
  console.log(`Saving todos to ${filePath}`);

  window.electron.fs.writeFile(filePath, JSON.stringify(todos), (err) => {
    if (err) {
      console.error('Failed to save todos:', err);
    } else {
      console.log('Todos saved successfully');
    }
  });
}
