const input = document.getElementById("taskInput");
const addButton = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");

// Load tasks from LocalStorage on page load
window.addEventListener("DOMContentLoaded", () => {
    const stored = JSON.parse(localStorage.getItem("tasks")) || [];
    const tasks = stored.map(t =>
        typeof t === "string" ? { text: t, completed: false } : t
    );
    tasks.forEach(task => addTask(task));
    localStorage.setItem("tasks", JSON.stringify(tasks)); // Ensure tasks are stored in the correct format
});

addButton.addEventListener("click", () => {
    const taskText = input.value.trim();
    if (taskText !== "") {
        const task = { text: taskText, completed: false };
        addTask(task);
        saveTask(task);
        input.value = "";
    }
});

function addTask(task) {
    const li = document.createElement("li");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;

    const label = document.createElement("label");
    label.textContent = task.text;

    const deleteBtn = document.createElement("button");
    deleteBtn.classList.add("remove-btn");

    const img = document.createElement("img");
    img.src = "./Icons/google-rounded-close.png";
    img.alt = "Delete Task";
    img.style.width = "16px";
    img.style.height = "16px";
    deleteBtn.appendChild(img);
    
    deleteBtn.addEventListener("click", () => {
        li.remove();
        removeTask(task.text);
    });

    checkbox.addEventListener("change", () => {
        task.completed = checkbox.checked;
        updateTasksInLocalStorage();
    });

    li.appendChild(checkbox);
    li.appendChild(label);
    li.appendChild(deleteBtn);
    taskList.appendChild(li);
}

function saveTask(task) {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.push(task);
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function removeTask(taskText) {
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks = tasks.filter(task => task.text !== taskText);
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function updateTasksInLocalStorage() {
    const tasks = [];
    taskList.querySelectorAll("li").forEach(li => {
        const checkbox = li.querySelector("input[type=checkbox]");
        const label = li.querySelector("label");
        tasks.push({
            text: label.textContent,
            completed: checkbox.checked
        });
    });
    localStorage.setItem("tasks", JSON.stringify(tasks));
}
