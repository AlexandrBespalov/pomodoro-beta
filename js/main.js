// Переменные
let workTime = 25 * 60;
let shortBreakTime = 5 * 60;
let longBreakTime = 15 * 60; 
let currentTaskIndex = 0;
let timer;
let isRunning = false;
let tasks = []; // Определение массива задач
let time = workTime;"time"
let isWorkTime = true;
let isBreakCompleted = true;
let taskTime = workTime;

// Функция обновления таймера
function updateTimer() {
  const minutes = Math.max(0, Math.floor(time / 60));
  const seconds = Math.max(0, time % 60);
  const timerDisplay = document.getElementById('timer');
  timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

// Функция запуска таймера
function startTimer() {
  if (!isRunning) {
    isRunning = true;
    timer = setInterval(() => {
      if (time >= 0) {
        time--;
        updateTimer();
        updateBackground(); // Обновление фона при каждом обновлении таймера
      } else {
        clearInterval(timer);
        isRunning = false;
        handleTimerCompletion(); // Обработка завершения таймера
        updateBackground(); // Обновление фона при завершении таймера
      }
    }, 1000);
  }
}

// Функция обработки завершения работы
function handleWorkCompletion() {
  const taskListItems = Array.from(document.querySelectorAll('.task-list li'));
  const currentTaskItem = taskListItems[currentTaskIndex];

  if (currentTaskIndex < tasks.length - 1) {
    currentTaskIndex++;
    isWorkTime = false;
    time = shortBreakTime;
    taskTime = workTime;
  } else {
    currentTaskIndex = 0;
    isWorkTime = false;
    time = longBreakTime;
    taskTime = workTime;
  }

  isWorkTime = true;
  isBreakCompleted = false;

  updateTaskName();
  updateTimer();
  updateBackground();
  startTimer();
}

// Функция обработки завершения таймера
function handleTimerCompletion() {
  if (isWorkTime) {
    handleWorkCompletion();
  } else {
    handleBreakCompletion();
  }
}

// Функция обновления фона и названия задачи
function updateBackgroundAndTaskName() {
  updateBackground();
  updateTaskName();
}

// Функция обновления фона
function updateBackground() {
  const body = document.querySelector('body');
  let backgroundColor = '';

  if (isWorkTime && !isBreakCompleted) {
    backgroundColor = '#FFCDD2'; // бледно-красный
  } else if (isWorkTime && isBreakCompleted) {
    backgroundColor = '#C8E6C9'; // бледно-зеленый
  } else {
    backgroundColor = '#BBDEFB'; // бледно-синий
  }

  body.style.backgroundColor = backgroundColor;
}

// Функция приостановки таймера
function pauseTimer() {
  if (isRunning) {
    clearInterval(timer);
    isRunning = false;
  }
}

// Функция сброса таймера
function resetTimer() {
  clearInterval(timer);
  isRunning = false;
  time = workTime;
  taskTime = workTime;
  isWorkTime = true;
  updateTimer();
  updateTaskName();
  updateBackground();
}

// Функция обработки завершения перерыва
function handleBreakCompletion() {
  currentTaskIndex++;
  time = workTime;
  isWorkTime = true;
  isBreakCompleted = true;
  updateTimer();
  startTimer();
  updateBackgroundAndTaskName(); // Обновление фона и названия задачи
}

// Функция обработки завершения задачи
function handleTaskCompletion() {
  const taskListItems = Array.from(document.querySelectorAll('.task-list li'));
  const currentTaskItem = taskListItems[currentTaskIndex];

  if (!currentTaskItem.classList.contains('break')) {
    currentTaskItem.classList.add('completed');
  }

  if (currentTaskIndex < taskListItems.length - 1) {
    currentTaskIndex++;
    time = taskTime;
    isWorkTime = true;
    isBreakCompleted = false;
  } else {
    currentTaskIndex = 0;
    time = longBreakTime;
    isWorkTime = false;
    isBreakCompleted = true;
  }

  updateBackgroundAndTaskName(); // Обновление фона и названия задачи
  updateTimer();
  startTimer();
  updateTaskList();
}

// Функция добавления задачи
function addTask(name) {
  tasks.push({
    name: name,
    completed: false
  });

  updateTaskList();
  updateTaskName();
}

// Функция удаления задачи
function deleteTask(index) {
  tasks.splice(index, 1);

  if (index === currentTaskIndex) {
    resetTimer();
    updateTaskName();
  } else if (index < currentTaskIndex) {
    currentTaskIndex--;
  }

  updateTaskList();
}

// Функция обработки изменения состояния задачи
function toggleTaskCompletion(index) {
  tasks[index].completed = !tasks[index].completed;
  updateTaskList();
  updateTaskName();
}

// Обработчик события изменения состояния чекбокса
document.querySelector('.task-list').addEventListener('change', (e) => {
  if (e.target.matches('.checkbox input[type="checkbox"]')) {
    const taskIndex = Array.from(e.target.parentNode.parentNode.parentNode.children).indexOf(e.target.parentNode.parentNode);
    toggleTaskCompletion(taskIndex);
  }
});

// Функция отметки задачи выполненной
function completeTask(index) {
  tasks[index].completed = true;
  updateTaskList();
  updateTaskName();
}

// Функция обновления названия текущей задачи
function updateTaskName() {
  const currentTask = tasks[currentTaskIndex];
  const taskNameDisplay = document.getElementById('current-task');

  if (isWorkTime && !isBreakCompleted) {
    taskNameDisplay.textContent = currentTask ? currentTask.name : 'Поставьте перед собой задачу';
  } else if (isWorkTime && isBreakCompleted) {
    taskNameDisplay.textContent = 'Перерыв закончен! Вернитесь к работе!';
  } else {
    taskNameDisplay.textContent = 'Длинный перерыв! Отдохните и подготовьтесь к следующему циклу работы.';
  }
}

// Функция обновления списка задач
function updateTaskList() {
  const taskList = document.querySelector('.task-list');
  taskList.innerHTML = '';

  tasks.forEach((task, index) => {
    const taskItem = document.createElement('li');
    taskItem.textContent = task.name;

    if (index === currentTaskIndex) {
      taskItem.classList.add('active');
    }

    if (task.completed) {
      taskItem.classList.add('completed');
    }

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Удалить';
    deleteButton.addEventListener('click', () => {
      deleteTask(index);
    });

    taskItem.appendChild(deleteButton);
    taskList.appendChild(taskItem);
  });
}

// Обработчик события клика по кнопке "Старт"
document.querySelector('.start-btn').addEventListener('click', startTimer);

// Обработчик события клика по кнопке "Пауза"
document.querySelector('.pause-btn').addEventListener('click', pauseTimer);

// Обработчик события клика по кнопке "Сброс"
document.querySelector('.reset-btn').addEventListener('click', resetTimer);

// Обработчик события клика по кнопке "Настройка"
document.querySelector('.settings-btn').addEventListener('click', () => {
  const overlay = document.querySelector('.overlay');
  overlay.classList.add('active');
});

// Обработчик события клика по кнопке "Сохранить" в окне настроек
document.querySelector('.save-btn').addEventListener('click', () => {
  const workTimeInput = document.getElementById('work-time-input');
  const shortBreakInput = document.getElementById('short-break-input');
  const longBreakInput = document.getElementById('long-break-input');

  workTime = parseInt(workTimeInput.value) * 60;
  shortBreakTime = parseInt(shortBreakInput.value) * 60;
  longBreakTime = parseInt(longBreakInput.value) * 60;

  const overlay = document.querySelector('.overlay');
  overlay.classList.remove('active');

  time = workTime;
  updateTimer();
});

// Обработчик события отправки формы добавления задачи
document.querySelector('.task-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const taskInput = document.querySelector('.task-input');
  const taskName = taskInput.value.trim();

  if (taskName !== '') {
    addTask(taskName);
    taskInput.value = '';
  }
});

// Обработчик события клика по задаче
document.querySelector('.task-list').addEventListener('click', (e) => {
  if (e.target.tagName === 'LI') {
    const taskIndex = Array.from(e.target.parentNode.children).indexOf(e.target);

    if (taskIndex !== -1) {
      if (taskIndex < currentTaskIndex) {
        resetTimer();
        updateTaskName();
      }
      completeTask(taskIndex);
    }
  }
});

// Инициализация
updateTimer();
updateTaskList();
updateTaskName();
updateBackground();
