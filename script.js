let taskName = document.getElementById("taskName");
let taskDesc = document.getElementById("taskDesc");
let taskP = document.getElementById("taskP");
let taskD = document.getElementById("taskD");
let taskS = document.getElementById("taskState");
let add = document.getElementById("add");

let addModal = document.getElementById("addModal");
let addTaskButton = document.getElementById("addTask");

let editModal = document.getElementById("editModal");
let editTaskName = document.getElementById("editTaskName");
let editTaskDesc = document.getElementById("editTaskDesc");
let editTaskD = document.getElementById("editTaskD");
let editTaskP = document.getElementById("editTaskP");
let editTaskState = document.getElementById("editTaskState");

let deleteModal = document.getElementById("deleteModal");
let taskToDeleteId = null;

let todoList = [];
let editingTaskId = null;

// the function who retrieve data from local storag
fetchData();

// Add Task
add.onclick = function () {
    addModal.classList.remove("hidden");
    addModal.classList.add('animate2');
};

function addTask(name, desc, priority, deadline, state) {
    const task = {
        id: Date.now(),
        title: name,
        desc: desc,
        deadline: deadline,
        priority: priority,
        state: state,
    };
    todoList.push(task);
    updateScreen();
    storeData(todoList);

    //animation 
    const newTask = document.querySelector(`li[data-id="${task.id}"]`);
    if (newTask) {
        newTask.classList.add('animate1');
    }
}

addTaskButton.onclick = function () {
    const name = taskName.value;
    const desc = taskDesc.value;
    const priority = taskP.value;
    const deadline = taskD.value;
    const state = taskS.value;
    if (name == "" || priority == "" || deadline == "" || state == "") {
        window.alert("Some fields are empty");
    } else if (Date.parse(deadline) - Date.now() < 0) {
        window.alert("Date is not valid");
    } else if (priority !== "p1" && priority !== "p2" && priority !== "p3") {
        window.alert("Invalid priority");
    } else {
        addTask(name, desc, priority, deadline, parseInt(state));
        closeAddModal();
    }
};

function updateScreen() {
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
        taskElement.setAttribute('data-id', task.id);
        taskElement.classList.add("border-b", "border-gray-200", "pb-4", "mb-4", "opacity-0", "transition-opacity", "duration-300");
        taskElement.innerHTML = `
    <div class="${getBGColor(task.priority)} rounded-2xl px-6 py-2">
        <div class="flex justify-between">
            <div>
                <p class="font-medium text-gray-900">${task.title}</p>
                <p class="text-sm font-medium text-gray-600">Deadline: ${task.deadline}</p>
            </div>
            <p class="text-sm font-medium ${getPriorityColor(task.priority)}">Priority: ${task.priority}</p>
        </div>
        <div class="mt-2 flex justify-end space-x-4">
            <button class="text-indigo-600 hover:text-indigo-500" onclick="editTask(${task.id})">Edit</button>
            <button class="text-indigo-600 hover:text-indigo-500" onclick="deleteTask(${task.id})">Delete</button>
        </div>
    </div>
`;
        todoTasksContainer.appendChild(taskElement);
        setTimeout(() => {
            taskElement.classList.remove('opacity-0');
        }, 10);


        // Distribute tasks into their proper columns
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
            return "text-red-600";
        case "p2":
            return "text-yellow-600";
        case "p3":
            return "text-green-600";
        default:
            return "text-gray-600";
    }
}

function getBGColor(priority) {
    switch (priority) {
        case "p1":
            return "bg-red-300";
        case "p2":
            return "bg-yellow-300";
        case "p3":
            return "bg-green-300";
        default:
            return "bg-gray-300";
    }
}
//the function who fill the edit fields with the selected task 
function editTask(id) {
    const task = todoList.find(task => task.id === id);
    if (task) {
        editTaskName.value = task.title;
        editTaskDesc.value = task.desc;
        editTaskP.value = task.priority;
        editTaskD.value = task.deadline;
        editTaskState.value = task.state;
        editingTaskId = id;
        editModal.classList.remove("hidden");
        //animation 
        editModal.classList.add('animate2');
    }
}
//the function who update the current task 
function updateTask(id, desc, title, priority, deadline, state) {
    const taskIndex = todoList.findIndex(task => task.id === id);
    if (taskIndex > -1) {
        todoList[taskIndex].title = title;
        todoList[taskIndex].desc = desc;
        todoList[taskIndex].priority = priority;
        todoList[taskIndex].deadline = deadline;
        todoList[taskIndex].state = state;
        updateScreen();
        storeData(todoList);
    }
}


document.getElementById("saveEdit").onclick = function () {
    if (editingTaskId) {
        const state = parseInt(editTaskState.value);
        updateTask(editingTaskId, editTaskDesc.value, editTaskName.value, editTaskP.value, editTaskD.value, state);
        closeModal();
    }
};

function closeModal() {
    editModal.classList.add("hidden");
    resetEditFields();
}
function deleteTask(id) {
    taskToDeleteId = id;
    setTimeout(() => {
        deleteModal.classList.remove("hidden");
        deleteModal.classList.add('animate2');
    }, 300); 
}


document.getElementById("confirmDelete").onclick = function () {
    if (taskToDeleteId) {
        const taskToDelete = document.querySelector(`li[data-id="${taskToDeleteId}"]`);
        if (taskToDelete) {    
            taskToDelete.classList.add('animate3');
            closeDeleteModal();

            taskToDelete.addEventListener('animationend', function() {
            todoList = todoList.filter(task => task.id !== taskToDeleteId);
            storeData(todoList);
            updateScreen(); 
            taskToDeleteId = null; 
            }, { once: true });
        }
    }
};

function closeAddModal() {
    addModal.classList.add("hidden");
    resetInputFields();
}

function closeEditModal() {
    editModal.classList.add("hidden");
    editingTaskId = null;
}

function closeDeleteModal() {
    deleteModal.classList.add("hidden");
}

function resetInputFields() {
    taskName.value = "";
    taskDesc.value = "";
    taskP.value = "";
    taskD.value = "";
    taskS.value = "";
    editingTaskId = null;
}

function resetEditFields() {
    editTaskName.value = "";
    editTaskDesc.value = "";
    editTaskP.value = "";
    editTaskD.value = "";
    editTaskState.value = "0"; // Reset state to To Do
    editingTaskId = null;
}

function storeData(array) {
    window.localStorage.setItem("tasks", JSON.stringify(array));
}

function fetchData() {
    let data = window.localStorage.getItem("tasks");
    if (data) {
        todoList = JSON.parse(data);
        updateScreen();
    }
}