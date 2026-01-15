document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('taskInput');
    const deadlineInput = document.getElementById('deadlineInput');
    const addTaskBtn = document.getElementById('addTaskBtn');
    const taskList = document.getElementById('taskList');
    const clearCompletedBtn = document.getElementById('clearCompletedBtn');

    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    
    function renderTasks() {
        taskList.innerHTML = '';
        const now = new Date();

        tasks.forEach((task, index) => {
            const li = document.createElement('li');

            const deadlineDate = task.deadline ? new Date(task.deadline) : null;
            const isOverdue = deadlineDate && deadlineDate < now && !task.completed;

            const taskBox = document.createElement('div');
            taskBox.className = `task-box ${task.completed ? 'completed' : ''} ${isOverdue ? 'overdue' : ''}`;
            taskBox.innerHTML = `
                ${task.text}
                ${task.deadline ? `<small>Due: ${deadlineDate.toLocaleString()}</small>` : ''}
            `;

            taskBox.addEventListener('click', () => {
                toggleComplete(index);
            });

            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = 'Delete';
            deleteBtn.className = 'delete-btn';
            deleteBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                tasks.splice(index, 1);
                saveTasks();
                renderTasks();
            });

            li.appendChild(taskBox);
            li.appendChild(deleteBtn);
            taskList.appendChild(li);
        });
    }
    addTaskBtn.addEventListener('click', () => {
        const taskText = taskInput.value.trim();
        const deadlineValue = deadlineInput.value;

        if (!taskText) return;

        tasks.push({
            text: taskText,
            completed: false,
            deadline: deadlineValue || null
        });

        taskInput.value = '';
        deadlineInput.value = '';
        saveTasks();
        renderTasks();
    });
    function toggleComplete(index) {
        tasks[index].completed = !tasks[index].completed;
        saveTasks();
        renderTasks();
    }

    clearCompletedBtn.addEventListener('click', () => {
        tasks = tasks.filter(task => !task.completed);
        saveTasks();
        renderTasks();
    });
    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }
    renderTasks();
});
