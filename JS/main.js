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

new Sortable(taskList, {
    animation: 150,
    onEnd: () => {
        updateOrderInLocalStorage();
    }
});

function updateOrderInLocalStorage() {
    const newOrder = [];
    taskList.querySelectorAll("li").forEach(li => {
        const label = li.querySelector("label");
        const checkbox = li.querySelector("input[type=checkbox]");
        const priority = li.querySelector(".priority-tag")?.textContent?.toLowerCase() || "low";
        newOrder.push({
            text: label.textContent,
            completed: checkbox.checked,
            priority: priority
        });
    });
    localStorage.setItem("tasks", JSON.stringify(newOrder));
}

document.getElementById("clearCompletedBtn").addEventListener("click", () => {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    const remainingTasks = tasks.filter(t => !t.completed);
    localStorage.setItem("tasks", JSON.stringify(remainingTasks));

    // Animate and remove completed tasks
    const listItems = document.querySelectorAll("#taskList li");
    listItems.forEach(li => {
        const checkbox = li.querySelector("input[type='checkbox']");
        if (checkbox && checkbox.checked) {
            li.classList.add("fade-out");
            setTimeout(() => li.remove(), 300); // Match duration with CSS
        }
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
    // const priority = document.getElementById("prioritySelect").value;

    if (taskText !== "") {
        const task = {
            text: taskText,
            completed: false,
            // priority: priority
        };
        saveTask(task);
        renderTasks();
        input.value = "";
        document.getElementById("prioritySelect").value = "low"; // reset
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

    const prioritySpan = document.createElement("span");
    prioritySpan.className = `priority-tag ${task.priority || "low"}`;
    prioritySpan.textContent = (task.priority || "Low").toUpperCase();
    prioritySpan.style.marginRight = "8px";
    prioritySpan.style.fontSize = "0.75rem";
    prioritySpan.style.fontWeight = "bold";

    const label = document.createElement("label");
    label.textContent = task.text;
    enableInlineEdit(label, task, li);

    const deleteBtn = document.createElement("button");
    deleteBtn.classList.add("remove-btn");

    const img = document.createElement("img");
    img.src = "./Icons/google-rounded-close.png";
    img.alt = "Delete Task";
    img.style.width = "16px";
    img.style.height = "16px";
    deleteBtn.appendChild(img);
    
    deleteBtn.addEventListener("click", () => {
        li.classList.add("fade-out");
        setTimeout(() => {
            li.remove();
            removeTask(task.text);
        }, 300); // Match the fade duration
    });


    checkbox.addEventListener("change", () => {
        task.completed = checkbox.checked;

        const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
        const index = tasks.findIndex(t => t.text === task.text && t.completed !== task.completed);
        if (index !== -1) {
            tasks[index].completed = task.completed;
            localStorage.setItem("tasks", JSON.stringify(tasks));
        }

        renderTasks();
    });


    li.appendChild(checkbox);
    // li.appendChild(prioritySpan);
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
        const priority = li.querySelector(".priority-tag")?.textContent?.toLowerCase() || "low";
        tasks.push({
            text: label.textContent,
            completed: checkbox.checked,
            priority: priority
        });
    });
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function enableInlineEdit(label, task, li) {
    label.addEventListener("dblclick", () => {
        const inputEdit = document.createElement("input");
        inputEdit.type = "text";
        inputEdit.value = label.textContent;
        inputEdit.classList.add("edit-input");

        const originalText = task.text;

        li.replaceChild(inputEdit, label);
        inputEdit.focus();

        const saveEdit = () => {
        const newText = inputEdit.value.trim();
        if (newText !== "") {
            const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
            const index = tasks.findIndex(t => t.text === originalText && t.completed === task.completed);
            if (index !== -1) {
                tasks[index].text = newText;
                localStorage.setItem("tasks", JSON.stringify(tasks));
            }

            renderTasks(); // triggers re-adding the label and all events
        } else {
            li.replaceChild(label, inputEdit); // cancel if empty
        }
    };


        inputEdit.addEventListener("blur", saveEdit);
        inputEdit.addEventListener("keydown", (e) => {
            if (e.key === "Enter") saveEdit();
        });
    });
}
