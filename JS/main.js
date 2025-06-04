const input = document.getElementById("taskInput");
const addButton = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");

// Load tasks from LocalStorage on page load
window.addEventListener("DOMContentLoaded", () => {
    const stored = JSON.parse(localStorage.getItem("tasks")) || [];
    const tasks = stored.map(t =>
        typeof t === "string" ? { text: t, completed: false } : t
    );
    renderTasks();
    updateFilterButton(getViewFromURL());
    localStorage.setItem("tasks", JSON.stringify(tasks)); // Ensure tasks are stored in the correct format

    document.querySelectorAll(".filters button").forEach(button => {
        button.addEventListener("click", () => {
            setFilter(button.dataset.view);
        });
    });
});

function getViewFromURL() {
    const params = new URLSearchParams(window.location.search);
    const view = params.get("view");
    return view === "completed" || view === "active" ? view : "all";
}

function setFilter(view) {
    const url = new URL(window.location);
    if (view === "all") {
        url.searchParams.delete("view");
    } else {
        url.searchParams.set("view", view);
    }
    window.history.pushState({}, "", url);
    renderTasks();
    updateFilterButton(view);
}

function updateFilterButton(view) {
    document.querySelectorAll(".filters button").forEach(btn => {
        if (btn.dataset.view === view || (view === "all" && !btn.dataset.view)) {
            btn.classList.add("active-filter");
        } else {
            btn.classList.remove("active-filter");
        }
    });
}

addButton.addEventListener("click", () => {
    const taskText = input.value.trim();
    if (taskText !== "") {
        const task = { text: taskText, completed: false };
        addTask(task);
        saveTask(task);
        input.value = "";
    }
});

input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        addButton.click();
    }
});

function addTask(task, filterView = "all") {
    if (
        (filterView === "completed" && !task.completed) ||
        (filterView === "active" && task.completed)
    ) {
        return; // Skip this task
    }

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

        // Update just this task in LocalStorage
        const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
        const index = tasks.findIndex(t => t.text === task.text);
        if (index !== -1) {
            tasks[index].completed = task.completed;
            localStorage.setItem("tasks", JSON.stringify(tasks));
        }

        renderTasks();
    });

    li.appendChild(checkbox);
    li.appendChild(label);
    li.appendChild(deleteBtn);
    taskList.appendChild(li);
}

function renderTasks() {
    const view = getViewFromURL();
    const stored = JSON.parse(localStorage.getItem("tasks")) || [];
    const tasks = stored.map(t =>
        typeof t === "string" ? { text: t, completed: false } : t
    );

    taskList.innerHTML = ""; // Clear current list
    tasks.forEach(task => addTask(task, view));
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
