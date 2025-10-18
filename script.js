function saveTasksToStorage(tasks) {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasksFromStorage() {
    const data = localStorage.getItem("tasks");
    return data ? JSON.parse(data) : [];
}

let currentFilter = "all"; // Global filtre değişkeni

function displayTasks(filter = "all") {
    let tasks = loadTasksFromStorage();

    // 🔽 1. Görevleri tarihe göre sırala (artan)
    tasks.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

    // 🔍 Arama kutusundaki metni al
    const searchKeyword = document.getElementById("searchInput")?.value.toLowerCase() || "";

    // 🔍 Filtre ve arama birlikte
    tasks = tasks.filter(task => {
        const matchesFilter =
            (filter === "all") ||
            (filter === "completed" && task.isCompleted) ||
            (filter === "incomplete" && !task.isCompleted);

        const matchesSearch =
            task.title.toLowerCase().includes(searchKeyword) ||
            task.description.toLowerCase().includes(searchKeyword) ||
            task.dueDate.includes(searchKeyword); // Tarihte arama

        return matchesFilter && matchesSearch;
    });

    const table = document.getElementById("taskTableBody");
    table.innerHTML = "";

    tasks.forEach((task, index) => {
        const newRow = document.createElement("tr");

        const titleCell = document.createElement("td");
        titleCell.textContent = task.title;
        newRow.appendChild(titleCell);

        const descCell = document.createElement("td");
        descCell.textContent = task.description;
        newRow.appendChild(descCell);

        const dateCell = document.createElement("td");
        dateCell.textContent = task.dueDate;
        newRow.appendChild(dateCell);

        const completedCell = document.createElement("td");
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = task.isCompleted;
        checkbox.addEventListener("change", function () {
            task.isCompleted = checkbox.checked;
            saveTasksToStorage(tasks);
            displayTasks(currentFilter);
        });
        completedCell.appendChild(checkbox);
        newRow.appendChild(completedCell);

        const deleteCell = document.createElement("td");
        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "🗑️ Sil";
        deleteBtn.style.backgroundColor = "#e74c3c";
        deleteBtn.style.color = "white";
        deleteBtn.style.border = "none";
        deleteBtn.style.padding = "5px 10px";
        deleteBtn.style.cursor = "pointer";
        deleteBtn.style.borderRadius = "5px";

        deleteBtn.addEventListener("click", function () {
            tasks.splice(index, 1);
            saveTasksToStorage(tasks);
            displayTasks(currentFilter);
        });

        deleteCell.appendChild(deleteBtn);
        newRow.appendChild(deleteCell);

        table.appendChild(newRow);
    });
}

document.getElementById("addTaskBtn").addEventListener("click", function () {
    const title = document.getElementById("title").value.trim();
    const description = document.getElementById("description").value.trim();
    const dueDate = document.getElementById("dueDate").value;

    if (title === "" || description === "" || dueDate === "") {
        alert("Lütfen tüm alanları doldurun.");
        return;
    }

    const tasks = loadTasksFromStorage();
    tasks.push({
        title: title,
        description: description,
        dueDate: dueDate,
        isCompleted: false
    });
    saveTasksToStorage(tasks);

    displayTasks(currentFilter);

    // Formu temizle
    document.getElementById("title").value = "";
    document.getElementById("description").value = "";
    document.getElementById("dueDate").value = "";
});

function filterTasks(filterType) {
    currentFilter = filterType;
    displayTasks(currentFilter);
}

window.onload = function () {
    displayTasks(currentFilter);
}

// 🔍 Arama kutusuna yazıldıkça filtrele
document.getElementById("searchInput").addEventListener("input", function () {
    displayTasks(currentFilter);
});
