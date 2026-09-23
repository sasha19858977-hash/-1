let tasks = [];
let currentFilter = "all";
function loadTasks() {
    try {
        const savedTasks =
            localStorage.getItem(
                "studyPlannerTasks"
            );
        if (savedTasks) {
            const parsed =
                JSON.parse(savedTasks);
            if (Array.isArray(parsed)) {
                tasks = parsed;
            }
        }
    } catch (error) {
        console.error(
            "Помилка завантаження:",
            error
        );
        tasks = [];
    }
}
function saveTasks() {
    try {
        localStorage.setItem(
            "studyPlannerTasks",
            JSON.stringify(tasks)
        );
    } catch (error) {
        console.error(
            "Помилка збереження:",
            error
        );
    }
}
function addTask(voiceText = null) {
    const input =
        document.getElementById(
            "taskInput"
        );
    const subject =
        document.getElementById(
            "subjectInput"
        );
    const date =
        document.getElementById(
            "dateInput"
        );
    const priority =
        document.getElementById(
            "priorityInput"
        )
    if (
        !input ||
        !subject ||
        !date ||
        !priority
    ) {
        console.error(
            "Не знайдено елементи форми."
        );
        return;
    }
    const text =
        voiceText !== null
            ? String(voiceText).trim()
            : input.value.trim();
    if (text === "") {
        alert(
            "Введіть назву навчального завдання!"
        );
        input.focus();
        return;
    }
    const task = {
        id:
            Date.now() +
            Math.floor(
                Math.random() * 1000
            ),
        text: text,
        subject:
            subject.value,
        date:
            date.value,
        priority:
            priority.value,
        completed:
            false
    };
    tasks.push(task);
    saveTasks();
    if (voiceText === null) {
        input.value = "";
        date.value = "";
    }
    renderTasks();
}
function toggleTask(id) {
    tasks =
        tasks.map(task => {
            if (
                Number(task.id) ===
                Number(id)
            ) {
                return {
                    ...task,
                    completed:
                        !task.completed
                };
            }
            return task;
        });
    saveTasks();
    renderTasks();
}
function deleteTask(id) {
    tasks =
        tasks.filter(
            task =>
                Number(task.id) !==
                Number(id)
        );
    saveTasks();
    renderTasks();
}
function filterTasks(
    filter,
    button
) {
    currentFilter =
        filter;
    document
        .querySelectorAll(
            ".filter-btn"
        )
        .forEach(btn => {
            btn.classList.remove(
                "active"
            );
        });
    if (button) {
        button.classList.add(
            "active"
        );
    }
    renderTasks();
}
function renderTasks() {
    const list =
        document.getElementById(
            "taskList"
        );
    if (!list) {
        return;
    }
    list.innerHTML = "";
    const filteredTasks =
        tasks.filter(task => {
            if (
                currentFilter ===
                "active"
            ) {
                return !task.completed;
            }
            if (
                currentFilter ===
                "completed"
            ) {
                return task.completed;
            }
            return true;
        });
    if (
        filteredTasks.length === 0
    ) {
        list.innerHTML = `
            <div class="empty-message">
                ✦ Завдань поки немає
            </div>
        `;
        updateStatistics();
        return;
    }
    filteredTasks.forEach(task => {
        const element =
            document.createElement(
                "div"
            );
        element.className =
            "task";
        if (
            task.completed
        ) {
            element.classList.add(
                "completed"
            );
        }
        if (
            task.priority ===
            "Високий"
        ) {
            element.classList.add(
                "priority-high"
            );
        }
        if (
            task.priority ===
            "Середній"
        ) {
            element.classList.add(
                "priority-medium"
            );
        }
        if (
            task.priority ===
            "Низький"
        ) {
            element.classList.add(
                "priority-low"
            );
        }
        let formattedDate =
            "Без дедлайну";
        if (task.date) {
            const date =
                new Date(
                    task.date +
                    "T00:00:00"
                );
            if (
                !Number.isNaN(
                    date.getTime()
                )
            ) {
                formattedDate =
                    date.toLocaleDateString(
                        "uk-UA"
                    );
            }
        }
        const safeText =
            escapeHTML(
                task.text
            );
        const safeSubject =
            escapeHTML(
                task.subject
            );
        const safePriority =
            escapeHTML(
                task.priority
            );
        element.innerHTML = `
            <div class="task-title">
                ${
                    task.completed
                        ? "✓"
                        : "○"
                }
                ${safeText}
            </div>
            <div class="task-info">
                <span>
                    📚 ${safeSubject}
                </span>
                <span>
                    📅 ${formattedDate}
                </span>
                <span>
                    ${getPriorityIcon(
                        task.priority
                    )}
                    ${safePriority}
                </span>
            </div>
            <div class="task-actions">
                <button
                    class="complete-btn"
                    type="button"
                    onclick="
                        toggleTask(${task.id})
                    "
                >
                    ${
                        task.completed
                            ? "↩ Скасувати"
                            : "✓ Виконано"
                    }
                </button>
                <button
                    class="delete-btn"
                    type="button"
                    onclick="
                        deleteTask(${task.id})
                    "
                >
                    🗑 Видалити
                </button>
            </div>
        `;
        list.appendChild(
            element
        );
    });
    updateStatistics();
}
function escapeHTML(value) {
    return String(value)
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );
}
function getPriorityIcon(
    priority
) {
    if (
        priority ===
        "Високий"
    ) {
        return "🔴";
    }
    if (
        priority ===
        "Середній"
    ) {
        return "🟠";
    }
    return "🟢";
}
function updateStatistics() {
    const total =
        tasks.length;
    const completed =
        tasks.filter(
            task =>
                task.completed
        ).length;
    const remaining =
        total -
        completed;
    let progress = 0;
    if (total > 0) {
        progress =
            Math.round(
                (
                    completed /
                    total
                ) * 100
            );
    }
    const totalElement =
        document.getElementById(
            "totalCount"
        );
    const completedElement =
        document.getElementById(
            "completedCount"
        );
    const remainingElement =
        document.getElementById(
            "remainingCount"
        );
    const progressText =
        document.getElementById(
            "progressText"
        );
    const progressFill =
        document.getElementById(
            "progressFill"
        );
    if (totalElement) {
        totalElement.textContent =
            total;
    }
    if (completedElement) {
        completedElement.textContent =
            completed;

    }
    if (remainingElement) {
        remainingElement.textContent =
            remaining;
    }
    if (progressText) {
        progressText.textContent =
            progress + "%";
    }
    if (progressFill) {
        progressFill.style.width =
            progress + "%";
    }
}
function showCurrentDate() {
    const today =
        new Date();
    const day =
        String(
            today.getDate()
        ).padStart(
            2,
            "0"
        );
    const month =
        String(
            today.getMonth() + 1
        ).padStart(
            2,
            "0"
        );
    const year =
        today.getFullYear();
    const element =
        document.getElementById(
            "todayDate"
        );
    if (element) {
        element.textContent =
            `${day}.${month}.${year}`;
    }
}
function setupKeyboard() {
    const input =
        document.getElementById(
            "taskInput"
        );
    if (!input) {
        return;
    }
    input.addEventListener(
        "keydown",
        event => {
            if (
                event.key ===
                "Enter"
            ) {
                event.preventDefault();
                addTask();
            }
        }
    );
}
document.addEventListener(
    "DOMContentLoaded",
    function() {
        loadTasks();
        showCurrentDate();
        renderTasks();
        setupKeyboard();
    }
);