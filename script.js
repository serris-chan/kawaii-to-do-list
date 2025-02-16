document.addEventListener('DOMContentLoaded', () => {
    const todoList = document.getElementById('tasks');
    const newTaskInput = document.getElementById('new-task');
    const addTaskButton = document.getElementById('add-task');
    const timerDisplay = document.getElementById('timer');
    const startTimerButton = document.getElementById('start-timer');
    const resetTimerButton = document.getElementById('reset-timer');
    const clearTasksButton = document.getElementById('clear-all');

    let tasks = [];
    let minutes = 25;
    let seconds = 0;
    let intervalId = null; // Corrected typo
    let isRunning = false;
    let currentTheme = 'default';

    // New additions for task icons and priority colors go here:
    const icons = {
        "heart": "❤️",
        "star": "⭐",
        "anime_char":"🌸"
    };

    const priorityColors = {
        "low": "#F0E68C", // Light Pastel Yellow
        "medium": "#FFA07A", // Light Salmon
        "high": "#FFB6C1" //Light Pink
    };

    function addIcon(task, iconType) {
        if (iconType in icons) {
            return `${task} ${icons[iconType]}`
        }
        return task;
    }

    function addTaskToList(taskText, iconType, priority) {
        const task = {id:Date.now(), text:taskText, completed:false, icon: iconType, priority:priority};
        tasks.push(task);
        renderTasks();
        newTaskInput.value = ''; // Clear the input.
    }

    document.getElementById('change-theme').addEventListener('click', () => {
        currentTheme = (currentTheme === 'default') ? 'kawaii-pastel' : 'default';
        document.body.className = currentTheme;
    });

    function showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout( () => {
            notification.remove()
        }, 5000) // Notification disappears after 5 seconds
    }

    // Task Management
    addTaskButton.addEventListener('click', () => {
        const taskText = newTaskInput.value.trim(); // Corrected property access
        const iconSelect = document.getElementById('icon-select');
        const prioritySelect = document.getElementById('priority-select');
        if (taskText) {
            const task = { id: Date.now(), text: taskText, completed: false };
            addTaskToList(taskText, iconSelect.value, prioritySelect.value);
            showNotification('Yay! A new task has been added!', 'success')
        }
    });

    // Clear Tasks
    setTimeout(() => {
        if (clearTasksButton) {
            clearTasksButton.addEventListener('click', () => {
                tasks = []; // Empty the tasks array
                renderTasks(); // Re-render the list to show it's empty
                showNotification('All tasks have been cleared, Senpai!', 'success');
            });
        } else {
            console.error('Clear tasks button not found in the DOM');
        }
    }, 500);

    function renderTasks() {
        todoList.innerHTML = '';
        tasks.forEach(task => {
            const li = document.createElement('li');
            li.textContent = addIcon(task.text, task.icon);
            li.id = task.id;
            li.style.color = priorityColors[task.priority] || '#000'; // Defaulting to black if priority is not set.
            li.addEventListener('click', () => toggleTask(task.id));
            if (task.completed) li.classList.add('completed');
            todoList.appendChild(li);
        });
    }

    function toggleTask(id) {
        const task = tasks.find(t => t.id === id); // Changed to strict equality
        if (task) {
            task.completed = !task.completed;
            renderTasks();
        }
    }

    // Pomodoro Timer
    function updateTimer() {
        if (seconds === 0) {
            if (minutes === 0) {
                clearInterval(intervalId); // Corrected typo
                isRunning = false;
                startTimerButton.textContent = 'Start';
                alert("Time's up! Take a break or start again!");
                return;
            }
            minutes--;
            seconds = 59;
        } else {
            seconds--;
        }
        timerDisplay.textContent = `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    }
    
    startTimerButton.addEventListener('click', () => {
        if (isRunning) {
            clearInterval(intervalId); // Corrected typo
            startTimerButton.textContent = 'Start'; // Corrected button text
        } else {
            intervalId = setInterval(updateTimer, 1000); // Added to start timer
            startTimerButton.textContent = 'Pause';
        }
        isRunning = !isRunning;
    });

    resetTimerButton.addEventListener('click', () => {
        clearInterval(intervalId);
        minutes = 25;
        seconds = 0;
        timerDisplay.textContent = '25:00';
        isRunning = false;
        startTimerButton.textContent = 'Start';
    });

    // Initial Render
    renderTasks();
});