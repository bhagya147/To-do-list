
"use strict";

// ===============================
// 1. SELECT HTML ELEMENTS
// ===============================

const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const priorityInput = document.getElementById("priority");
const dueDateInput = document.getElementById("dueDate");

const taskList = document.getElementById("taskList");

const searchInput = document.getElementById("searchInput");
const filterInput = document.getElementById("filter");

const totalTasks = document.getElementById("totalTasks");
const completedTasks = document.getElementById("completedTasks");
const pendingTasks = document.getElementById("pendingTasks");

const submitBtn = document.getElementById("submitBtn");
const clearBtn = document.getElementById("clearBtn");


// ===============================
// 2. INITIAL STATE
// ===============================

let tasks = [];

let editId = null;


// Load tasks from LocalStorage safely
try {
  const savedTasks = localStorage.getItem("tasks");

  tasks = savedTasks ? JSON.parse(savedTasks) : [];

  if (!Array.isArray(tasks)) {
    tasks = [];
  }

} catch (error) {
  console.error("Unable to load tasks:", error);
  tasks = [];
}


// ===============================
// 3. SAVE TASKS
// ===============================

function saveTasks() {

  try {
    localStorage.setItem("tasks", JSON.stringify(tasks));

  } catch (error) {
    console.error("Unable to save tasks:", error);
    alert("Tasks save avvaledu. Browser storage check cheyyi.");
  }

}


// ===============================
// 4. ADD / UPDATE TASK
// ===============================

taskForm.addEventListener("submit", function (event) {

  event.preventDefault();

  const title = taskInput.value.trim();

  const priority = priorityInput.value;

  const dueDate = dueDateInput.value;


  // Empty task validation
  if (title === "") {
    alert("Please enter a task!");
    return;
  }


  // Update existing task
  if (editId !== null) {

    tasks = tasks.map(function (task) {

      if (task.id === editId) {

        return {
          ...task,
          title: title,
          priority: priority,
          dueDate: dueDate
        };

      }

      return task;

    });

    editId = null;

    submitBtn.textContent = "Add Task";


  } else {

    // Create new task

    const newTask = {

      id: Date.now(),

      title: title,

      priority: priority,

      dueDate: dueDate,

      completed: false

    };

    tasks.push(newTask);

  }


  saveTasks();

  taskForm.reset();

  renderTasks();

});


// ===============================
// 5. RENDER TASKS
// ===============================

function renderTasks() {

  taskList.innerHTML = "";


  const searchText = searchInput.value
    .trim()
    .toLowerCase();

  const filterValue = filterInput.value;


  // Search + Filter

  const filteredTasks = tasks.filter(function (task) {

    const matchesSearch = task.title
      .toLowerCase()
      .includes(searchText);


    const matchesFilter =
      filterValue === "all" ||

      (filterValue === "active" && !task.completed) ||

      (filterValue === "completed" && task.completed);


    return matchesSearch && matchesFilter;

  });


  // Empty state

  if (filteredTasks.length === 0) {

    const emptyMessage = document.createElement("p");

    emptyMessage.textContent = "No tasks found!";

    emptyMessage.style.textAlign = "center";

    emptyMessage.style.padding = "20px";

    emptyMessage.style.color = "#777";

    taskList.appendChild(emptyMessage);

  }


  // Create task elements

  filteredTasks.forEach(function (task) {

    const li = document.createElement("li");

    li.className = task.completed
      ? "task completed"
      : "task";


    // Task information

    const taskInfo = document.createElement("div");

    taskInfo.className = "task-info";


    const titleElement = document.createElement("h3");

    titleElement.textContent = task.title;


    const priorityElement = document.createElement("p");

    priorityElement.className = "priority " + task.priority;

    priorityElement.textContent = "Priority: " + task.priority;


    const dateElement = document.createElement("p");

    dateElement.textContent =
      "Due Date: " + (task.dueDate || "No date");


    taskInfo.append(
      titleElement,
      priorityElement,
      dateElement
    );


    // Task action buttons

    const actions = document.createElement("div");

    actions.className = "task-actions";


    const completeBtn = document.createElement("button");

    completeBtn.className = "complete-btn";

    completeBtn.textContent = task.completed
      ? "Undo"
      : "Done";


    const editBtn = document.createElement("button");

    editBtn.className = "edit-btn";

    editBtn.textContent = "Edit";


    const deleteBtn = document.createElement("button");

    deleteBtn.className = "delete-btn";

    deleteBtn.textContent = "Delete";


    actions.append(
      completeBtn,
      editBtn,
      deleteBtn
    );


    li.append(
      taskInfo,
      actions
    );


    // ===============================
    // 6. COMPLETE / UNCOMPLETE
    // ===============================

    completeBtn.addEventListener("click", function () {

      tasks = tasks.map(function (item) {

        if (item.id === task.id) {

          return {
            ...item,
            completed: !item.completed
          };

        }

        return item;

      });


      saveTasks();

      renderTasks();

    });


    // ===============================
    // 7. EDIT TASK
    // ===============================

    editBtn.addEventListener("click", function () {

      taskInput.value = task.title;

      priorityInput.value = task.priority;

      dueDateInput.value = task.dueDate || "";


      editId = task.id;


      submitBtn.textContent = "Update Task";


      taskInput.focus();

    });


    // ===============================
    // 8. DELETE TASK
    // ===============================

    deleteBtn.addEventListener("click", function () {

      tasks = tasks.filter(function (item) {

        return item.id !== task.id;

      });


      // If deleted task was being edited
      if (editId === task.id) {

        editId = null;

        taskForm.reset();

        submitBtn.textContent = "Add Task";

      }


      saveTasks();

      renderTasks();

    });


    // Add task to UI

    taskList.appendChild(li);

  });


  updateStats();

}


// ===============================
// 9. UPDATE TASK STATISTICS
// ===============================

function updateStats() {

  const completed = tasks.filter(function (task) {

    return task.completed;

  }).length;


  const pending = tasks.length - completed;


  totalTasks.textContent = tasks.length;

  completedTasks.textContent = completed;

  pendingTasks.textContent = pending;

}


// ===============================
// 10. SEARCH TASKS
// ===============================

searchInput.addEventListener("input", function () {

  renderTasks();

});


// ===============================
// 11. FILTER TASKS
// ===============================

filterInput.addEventListener("change", function () {

  renderTasks();

});


// ===============================
// 12. CLEAR COMPLETED TASKS
// ===============================

clearBtn.addEventListener("click", function () {

  tasks = tasks.filter(function (task) {

    return !task.completed;

  });


  // Reset edit mode

  editId = null;

  taskForm.reset();

  submitBtn.textContent = "Add Task";


  saveTasks();

  renderTasks();

});


// ===============================
// 13. INITIAL RENDER
// ===============================

renderTasks();
