const taskInput = document.getElementById("taskInput");
const addButton = document.getElementById("addButton");
const taskList = document.getElementById("taskList");
const clearAlltask = document.getElementById("clearAlltask");

let tasks = [];

// Legger til oppgave når knappen klikkes
addButton.addEventListener("click", addtask);
taskList.addEventListener("click", handleTaskClick);
taskList.addEventListener("click", toggleTask);
taskList.addEventListener("dragstart", handleDragStart);
taskList.addEventListener("dragover", handleDragOver);
taskList.addEventListener("drop", handleDrop);

function addtask() {
    const taskText = taskInput.value.trim();

    if (taskText !== "") {
        tasks.push(taskText);
        renderTasks();
        taskInput.value = ""; // Tømmer input-feltet
    }
}

function toggleTask(e) {
    if (e.target.tagName === "LI") {
        const taskItem = e.target;
        const taskIndex = Array.from(taskList.children).indexOf(taskItem);
        taskItem.classList.toggle("completed");
        tasks[taskIndex] = tasks[taskIndex].startsWith("✔") ? tasks[taskIndex].slice(2) : "✔ " + tasks[taskIndex];
        renderTasks();
    }
}

function handleTaskClick(e) {
    if (e.target.classList.contains("remove")) {
        const taskItem = e.target.parentElement; // Finner <li> som inneholder knappen
        const taskIndex = Array.from(taskList.children).indexOf(taskItem); // Finner indeksen til <li>

        if (taskIndex > -1) { // Sjekker at indeksen er gyldig
            tasks.splice(taskIndex, 1); // Fjerner oppgaven fra oppgavelisten
            renderTasks(); // Render oppgavene på nytt
        }
    }
}

function handleDragStart(e) {
    const taskItem = e.target;
    const taskIndex = Array.from(taskList.children).indexOf(taskItem);
    e.dataTransfer.setData("text/plain", taskIndex);
}

function handleDragOver(e) {
    e.preventDefault(); // Nødvendig for å tillate dropping
}

function handleDrop(e) {
    e.preventDefault(); // Forhindre standard oppførsel
    const taskIndex = parseInt(e.dataTransfer.getData("text/plain"));
    const dropTarget = e.target.closest("li"); // Finn nærmeste li-element

    if (dropTarget) {
        const dropIndex = Array.from(taskList.children).indexOf(dropTarget);

        if (taskIndex !== dropIndex) {
            const [removedTask] = tasks.splice(taskIndex, 1);
            tasks.splice(dropIndex, 0, removedTask);
            renderTasks();
        }
    }
}

function renderTasks() {
    // Tømmer hele oppgavelisten slik at den kan vises oppdatert
    taskList.innerHTML = "";

    tasks.forEach((taskText, index) => {
        // Lager et nytt <li>-element for å vise oppgaven
        const taskItem = document.createElement("li");
        // Setter teksten i taskItem til oppgaven, med nummer foran
        taskItem.textContent = `${index + 1}. ${taskText}`;

        taskItem.draggable = true; // Gjør oppgaven dra-bar
        taskItem.dataset.index = index;

        if (taskText.startsWith("✔")) {
            taskItem.classList.add("completed");
        }

        // Lager en knapp for å fjerne oppgaven fra listen
        const removeButton = document.createElement("button");
        removeButton.innerHTML = `<i class="fas fa-trash"></i>`;
        removeButton.classList.add("remove");

        // Legger fjern-knappen til oppgaveelementet
        taskItem.appendChild(removeButton);
        taskList.appendChild(taskItem);
    });

    // Viser eller skjuler "Clear all" knappen
    clearAlltask.style.display = taskList.innerHTML !== "" ? "block" : "none";
}

// Clear all button functionality
clearAlltask.addEventListener("click", function() {
    taskList.innerHTML = ""; // Tømmer oppgavelisten
    tasks = []; // Tømmer oppgavelisten i tasks arrayet
    clearAlltask.style.display = "none"; // Skjuler "Clear all" knappen
});
