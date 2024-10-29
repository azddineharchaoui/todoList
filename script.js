let taskName = document.querySelector(".taskName");
let taskP = document.querySelector(".taskP");
let taskD = document.querySelector(".taskD");
let add = document.getElementById("add");


let todoList = [];
let editingTaskId = null; 

// Add Task
add.onclick = function () {
    if (taskName.value !== "" && taskP.value !== "") {
        if (editingTaskId) {
            updateTask(editingTaskId, taskName.value, taskP.value, taskD.value, 0); // Default state as To Do
        } else {
            addTask(taskName.value, taskP.value, taskD.value);
        }
        resetInputFields();
    }
};

function addTask(name, priority, deadline) {
    const task = {
        id: Date.now(),
        title: name,
        deadline: deadline,
        priority: priority,
        state: 0, // 0: ToDo, 1: In Progress, 2: Done
    };
    todoList.push(task);
    renderTasks();
}

function renderTasks() {
    const todoTasksContainer = document.querySelector(".todo-tasks");
    const inProgressTasksContainer = document.querySelector(".in-progress-tasks");
    const doneTasksContainer = document.querySelector(".done-tasks");

    // Clear existing tasks
    todoTasksContainer.innerHTML = "";
    inProgressTasksContainer.innerHTML = "";
    doneTasksContainer.innerHTML = "";

    // Task counters
    let todoCount = 0;
    let inProgressCount = 0;
    let doneCount = 0;

    // Sort tasks by priority
    todoList.sort((a, b) => {
        return getPriorityValue(a.priority) - getPriorityValue(b.priority);
    });

    todoList.forEach(task => {
        const taskElement = document.createElement("li");
        taskElement.classList.add("border-b", "border-gray-200", "pb-4", "mb-4");
        taskElement.innerHTML = `
            <div class="flex justify-between">
                <div>
                    <p class="font-medium text-gray-900">${task.title}</p>
                    <p class="text-sm font-medium text-gray-600">Due: ${task.deadline}</p>
                </div>
                <p class="text-sm font-medium ${getPriorityColor(task.priority)}">Priority: ${task.priority}</p>
            </div>
            <div class="mt-2 flex justify-end space-x-4">
                <button class="text-indigo-600 hover:text-indigo-500" onclick="editTask(${task.id})">Edit</button>
                <button class="text-indigo-600 hover:text-indigo-500" onclick="deleteTask(${task.id})">Delete</button>
            </div>
        `;

        // Distribute tasks into their respective columns
        if (task.state === 0) {
            todoTasksContainer.appendChild(taskElement);
            todoCount++;
        } else if (task.state === 1) {
            inProgressTasksContainer.appendChild(taskElement);
            inProgressCount++;
        } else if (task.state === 2) {
            doneTasksContainer.appendChild(taskElement);
            doneCount++;
        }
    });

    // Update task counts
    document.getElementById("todoCount").innerText = todoCount;
    document.getElementById("inProgressCount").innerText = inProgressCount;
    document.getElementById("doneCount").innerText = doneCount;
}


function getPriorityValue(priority) {
    switch (priority) {
        case "p1":
            return 1;
        case "p2":
            return 2;
        case "p3":
            return 3;
        default:
            return 4; 
    }
}



function getPriorityColor(priority) {
    switch (priority) {
        case "p1":
            return "text-green-600";
        case "p2":
            return "text-red-600";
        case "p3":
            return "text-yellow-600";
        default:
            return "text-gray-600";
    }
}

function deleteTask(id) {
    taskToDeleteId = id; 
    deleteModal.classList.remove("hidden"); 
}


function resetInputFields() {
    taskName.value = "";
    taskP.value = "";
    taskD.value = "";
    editingTaskId = null; 
}