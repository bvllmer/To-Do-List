const input = document.getElementById("taskInput");
const addButton = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");

// Load tasks from LocalStorage on page load
window.addEventListener("DOMContentLoaded", () => {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.forEach(text => addTask(text));
});

addButton.addEventListener("click", () => {
    const taskText = input.value.trim();
    if (taskText !== "") {
        addTask(taskText);
        saveTask(taskText);
        input.value = "";
    }
});

function addTask(taskText) {
    const li = document.createElement("li");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";

    const label = document.createElement("label");
    label.textContent = taskText;

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
        removeTask(taskText);
    });

    li.appendChild(checkbox);
    li.appendChild(label);
    li.appendChild(deleteBtn);
    taskList.appendChild(li);
}

function saveTask(taskText) {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.push(taskText);
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function removeTask(taskText) {
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks = tasks.filter(task => task !== taskText);
    localStorage.setItem("tasks", JSON.stringify(tasks));
}
