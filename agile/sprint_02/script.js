document.addEventListener('DOMContentLoaded', () => {
    const todoForm = document.getElementById('todo-form');
    const todoInput = document.getElementById('todo-input');
    const todoList = document.getElementById('todo-list');

    const API_URL = 'http://localhost:3000/todos';

    // Fetch and display todos
    const fetchTodos = async () => {
        try {
            const response = await fetch(API_URL);
            const data = await response.json();
            todoList.innerHTML = '';
            data.todos.forEach(todo => {
                const li = document.createElement('li');
                li.innerHTML = `<span class="${todo.completed ? 'completed' : ''}">${todo.title}</span>`;

                const deleteButton = document.createElement('button');
                deleteButton.textContent = '削除';
                deleteButton.addEventListener('click', () => deleteTodo(todo.id));
                li.appendChild(deleteButton);

                li.querySelector('span').addEventListener('click', () => toggleTodo(todo.id, !todo.completed));

                todoList.appendChild(li);
            });
        } catch (error) {
            console.error('Error fetching todos:', error);
        }
    };

    // Add a new todo
    todoForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const title = todoInput.value.trim();
        if (title) {
            try {
                await fetch(API_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ title }),
                });
                todoInput.value = '';
                fetchTodos();
            } catch (error) {
                console.error('Error adding todo:', error);
            }
        }
    });

    // Toggle todo completion
    const toggleTodo = async (id, completed) => {
        try {
            await fetch(`${API_URL}/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ completed }),
            });
            fetchTodos();
        } catch (error) {
            console.error('Error updating todo:', error);
        }
    };

    // Delete a todo
    const deleteTodo = async (id) => {
        try {
            await fetch(`${API_URL}/${id}`, {
                method: 'DELETE',
            });
            fetchTodos();
        } catch (error) {
            console.error('Error deleting todo:', error);
        }
    };

    fetchTodos();
});
