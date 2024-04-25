document.addEventListener('DOMContentLoaded', function() {
    const taskList = document.getElementById('taskList');
    const taskInput = document.getElementById('taskInput');
    const addTaskBtn = document.getElementById('addTaskBtn');
    const refreshBtn = document.getElementById('refreshBtn');

    addTaskBtn.addEventListener('click', addTask);
    refreshBtn.addEventListener('click', refreshTasks);

    function addTask() {
        const taskText = taskInput.value.trim();

        if (taskText !== '') {
            fetch('http://127.0.0.1:8000/api/tasks', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ text: taskText })
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to add task');
                }
                return response.json();
            })
            .then(task => {
                const li = createTaskElement(task);
                taskList.appendChild(li);
            })
            .catch(error => {
                console.error('Error:', error);
            });
        }
    }

    function refreshTasks() {
        taskList.innerHTML = '';
        fetch('http://127.0.0.1:8000/api/tasks')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch tasks');
                }
                return response.json();
            })
            .then(tasks => {
                tasks.forEach(task => {
                    const li = createTaskElement(task);
                    taskList.appendChild(li);
                });
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }

    function createTaskElement(task) {
        const li = document.createElement('li');
        li.textContent = task.text;

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.addEventListener('click', function() {
            deleteTask(task.id);
        });
        li.appendChild(deleteBtn);

        const updateBtn = document.createElement('button');
        updateBtn.textContent = 'Update';
        updateBtn.addEventListener('click', function() {
            updateTask(task);
        });
        li.appendChild(updateBtn);

        return li;
    }

    function deleteTask(taskId) {
        fetch(`http://127.0.0.1:8000/api/tasks/${taskId}`, {
            method: 'DELETE'
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to delete task');
            }
            return response.json();
        })
        .then(() => {
            refreshTasks();
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }

    function updateTask(task) {
        const newText = prompt('Enter the new text for the task:', task.text);
        if (newText !== null) {
            fetch(`http://127.0.0.1:8000/api/tasks/${task.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ text: newText })
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to update task');
                }
                return response.json();
            })
            .then(() => {
                refreshTasks();
            })
            .catch(error => {
                console.error('Error:', error);
            });
        }
    }

    // Отримання та відображення списку завдань при завантаженні сторінки
    refreshTasks();
});
