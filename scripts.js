let todoItemsContainer = document.getElementById("todoItemsContainer");
let addTodoButton = document.getElementById("addTodoButton");
let saveTodoButton = document.getElementById("saveTodoButton");
let clearCompletedButton = document.getElementById("clearCompletedButton");
let clearAllTasksButton = document.getElementById("clearAllTasksButton");
let searchTodo = document.getElementById("searchTodo");
let filterAll = document.getElementById("filterAll");
let filterCompleted = document.getElementById("filterCompleted");
let filterPending = document.getElementById("filterPending");

function getTodoListFromLocalStorage() {
    let stringifiedTodoList = localStorage.getItem("todoList");
    let parsedTodoList = JSON.parse(stringifiedTodoList);
    return parsedTodoList === null ? [] : parsedTodoList;
}

let todoList = getTodoListFromLocalStorage();
let todosCount = todoList.length;

function onAddTodo() {
    let userInputElement = document.getElementById("todoUserInput");
    let userInputValue = userInputElement.value;

    if (userInputValue === "") {
        alert("Enter Valid Text");
        return;
    }

    todosCount += 1;

    let newTodo = {
        text: userInputValue,
        uniqueNo: todosCount,
        isChecked: false
    };

    todoList.push(newTodo);
    createAndAppendTodo(newTodo);
    userInputElement.value = "";
}

function onDeleteTodo(todoId) {
    todoList = todoList.filter(todo => `todo${todo.uniqueNo}` !== todoId);
    updateTodoList(todoList);
}

function onTodoStatusChange(checkboxId, labelId, todoId) {
    let checkboxElement = document.getElementById(checkboxId);
    let labelElement = document.getElementById(labelId);

    let todo = todoList.find(todo => `todo${todo.uniqueNo}` === todoId);
    todo.isChecked = checkboxElement.checked;

    if (todo.isChecked) {
        labelElement.classList.add("checked");
    } else {
        labelElement.classList.remove("checked");
    }
}

function createAndAppendTodo(todo) {
    let todoId = "todo" + todo.uniqueNo;
    let checkboxId = "checkbox" + todo.uniqueNo;
    let labelId = "label" + todo.uniqueNo;

    let todoElement = document.createElement("li");
    todoElement.classList.add("todo-item-container", "d-flex", "flex-row");
    todoElement.id = todoId;
    todoItemsContainer.appendChild(todoElement);

    let inputElement = document.createElement("input");
    inputElement.type = "checkbox";
    inputElement.id = checkboxId;
    inputElement.checked = todo.isChecked;
    inputElement.classList.add("checkbox-input");
    inputElement.onclick = function() {
        onTodoStatusChange(checkboxId, labelId, todoId);
    };
    todoElement.appendChild(inputElement);

    let labelContainer = document.createElement("div");
    labelContainer.classList.add("label-container", "d-flex", "flex-row");
    todoElement.appendChild(labelContainer);

    let labelElement = document.createElement("label");
    labelElement.setAttribute("for", checkboxId);
    labelElement.id = labelId;
    labelElement.classList.add("checkbox-label");
    labelElement.textContent = todo.text;
    if (todo.isChecked) {
        labelElement.classList.add("checked");
    }
    labelContainer.appendChild(labelElement);

    let deleteIconContainer = document.createElement("div");
    deleteIconContainer.classList.add("delete-icon-container");
    labelContainer.appendChild(deleteIconContainer);

    let deleteIcon = document.createElement("i");
    deleteIcon.classList.add("far", "fa-trash-alt", "delete-icon");
    deleteIcon.onclick = function() {
        onDeleteTodo(todoId);
    };
    deleteIconContainer.appendChild(deleteIcon);
}

function updateTodoList(todos) {
    todoItemsContainer.innerHTML = "";

    if (todos.length === 0) {
        let noTasksMessage = document.createElement("p");
        noTasksMessage.textContent = "No tasks to show";
        noTasksMessage.classList.add("no-tasks-message");
        todoItemsContainer.appendChild(noTasksMessage);
    } else {
        for (let todo of todos) {
            createAndAppendTodo(todo);
        }
    }
}

function onSaveTodos() {
    localStorage.setItem("todoList", JSON.stringify(todoList));
}

function onClearCompleted() {
    todoList = todoList.filter(todo => !todo.isChecked);
    updateTodoList(todoList);
}

function onClearAllTasks() {
    todoList = [];
    updateTodoList(todoList);
}

addTodoButton.onclick = onAddTodo;

saveTodoButton.onclick = onSaveTodos;

clearCompletedButton.onclick = onClearCompleted;

clearAllTasksButton.onclick = onClearAllTasks;

searchTodo.oninput = function() {
    let searchTerm = this.value.toLowerCase();
    let filteredList = todoList.filter(todo => todo.text.toLowerCase().includes(searchTerm));
    updateTodoList(filteredList);
};

filterAll.onclick = function() {
    updateTodoList(todoList);
};

filterCompleted.onclick = function() {
    let filteredList = todoList.filter(todo => todo.isChecked);
    updateTodoList(filteredList);
};

filterPending.onclick = function() {
    let filteredList = todoList.filter(todo => !todo.isChecked);
    updateTodoList(filteredList);
};

updateTodoList(todoList);