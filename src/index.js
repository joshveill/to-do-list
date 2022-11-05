const addTaskForm = document.getElementById("addTask");
const modal = document.getElementById("modal");
const overlay = document.getElementById("overlay");
const closeModal = document.getElementById("closeModal");
const projectContainer = document.getElementById("projects");
const newListForm = document.querySelector("[data-new-list-form]");
const newListInput = document.querySelector("[data-new-list-input]");
const taskPad = document.getElementById("taskPad");

const submitTaskForm = document.getElementById("submitTask");

// modal logic
addTaskForm.addEventListener("click", () => {
  modal.style.display = "flex";
  overlay.style.opacity = 1;
});

closeModal.addEventListener("click", () => {
  modal.style.display = "none";
  overlay.style.opacity = 0;
});
// modal logic ^^

const LOCAL_STORAGE_LIST_TASKPAD_KEY = "taskPad.lists";
let taskPadLists =
  JSON.parse(localStorage.getItem(LOCAL_STORAGE_LIST_TASKPAD_KEY)) || [];

submitTaskForm.addEventListener("click", (e) => {
  e.preventDefault();
  modal.style.display = "none";
  overlay.style.opacity = 0;

  const taskContent = document.getElementById("taskContent");
  clearElement(taskContent);

  const form = document.getElementById("taskForm");
  const title = document.getElementById("taskTitle");
  const description = document.getElementById("taskDescription");
  const priority = document.getElementById("taskPriority");
  const date = document.getElementById("taskDate");

  let task = new createTask(
    title.value,
    description.value,
    priority.value,
    date.value
  );

  if (selectedListId === "taskPad") {
    taskPadLists.unshift(task);
  } else {
    let projectList = lists.find((list) => {
      return list.id === selectedListId;
    });
    projectList.tasks.unshift(task);
  }

  renderTasks();
  form.reset();
});

function listIdentifyier() {
  if (selectedListId === "taskPad") {
    let taskList = taskPadLists;
    return taskList;
  } else {
    let projectList = lists.find((list) => {
      return list.id === selectedListId;
    });
    let taskList = projectList.tasks;
    return taskList;
  }
}

function renderTasks() {
  taskContent = document.getElementById("taskContent");
  clearElement(taskContent);

  let taskList = listIdentifyier();

  taskList.forEach((task) => {
    taskContainer = document.getElementById("taskContent");
    taskItem = document.createElement("div");
    taskItem.classList.add("task-item");

    priorityItem = document.createElement("div");
    priorityItem.classList.add("task-item-priority");
    priorityItem.innerText = task.priority;
    dateItem = document.createElement("div");
    dateItem.classList.add("task-item-due-date");
    dateItem.innerText = task.date;
    titleItem = document.createElement("h4");
    titleItem.innerText = task.title;
    descriptionItem = document.createElement("p");
    descriptionItem.classList.add("item-description");
    descriptionItem.innerText = task.description;

    checkboxGroup = document.createElement("div");
    checkboxGroup.classList.add("checkbox-group");
    checkboxItem = document.createElement("input");
    checkboxItem.addEventListener("click", () => {
      taskContainer.removeChild(taskItem);
      taskList.splice(taskItem, 1);

      saveAndRender();
    });
    checkboxItem.classList.add("checkbox-input");
    checkboxItem.type = "checkbox";
    checkboxItem.name = "checkbox";
    labelItem = document.createElement("label");
    labelItem.for = "checkbox";
    labelItem.classList.add("label-checkbox");
    labelItem.innerText = "Completed";
    checkboxGroup.appendChild(checkboxItem);
    checkboxGroup.appendChild(labelItem);

    deleteItem = document.createElement("i");
    deleteItem.classList.add("fa", "fa-trash", "delete-task");
    deleteItem.addEventListener("click", () => {
      taskContainer.removeChild(taskItem);
      taskList.splice(taskItem, 1);

      saveAndRender();
    });

    taskItem.appendChild(deleteItem);
    taskItem.appendChild(checkboxGroup);
    taskItem.appendChild(titleItem);
    taskItem.appendChild(descriptionItem);
    taskItem.appendChild(dateItem);
    taskItem.appendChild(priorityItem);

    taskContainer.appendChild(taskItem);
  });
}

function createTask(title, description, priority, date) {
  this.title = title;
  this.description = description;
  this.priority = priority;
  this.date = date;
}

const LOCAL_STORAGE_LIST_KEY = "task.lists";
const LOCAL_STORAGE_SELECTED_LIST_ID_KEY = "task.selectedListId";

let lists = JSON.parse(localStorage.getItem(LOCAL_STORAGE_LIST_KEY)) || [];
let selectedListId = localStorage.getItem(LOCAL_STORAGE_SELECTED_LIST_ID_KEY);

taskPad.addEventListener("click", (e) => {
  selectedListId = "taskPad";
  taskPad.classList.add("active-list");
  taskPad.classList.remove("project-hover");
  renderTasks();
  saveAndRender();
});

projectContainer.addEventListener("click", (e) => {
  if (e.target.tagName.toLowerCase() === "button") {
    selectedListId = e.target.dataset.listId;
    taskPad.classList.add("project-hover");
    taskPad.classList.remove("active-list");

    let projectList = lists.find((list) => {
      return list.id === selectedListId;
    });
    renderTasks();

    saveAndRender();
  }
});

newListForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const listName = newListInput.value;
  if (listName === null || listName === "")
    return alert("Project must have a name.");
  const list = createList(listName);
  newListInput.value = null;
  lists.push(list);
  saveAndRender();
});

function createList(name) {
  return { id: Date.now().toString(), name: name, tasks: [] };
}

function saveAndRender() {
  save();
  render();
}

function save() {
  localStorage.setItem(LOCAL_STORAGE_LIST_KEY, JSON.stringify(lists));
  localStorage.setItem(
    LOCAL_STORAGE_LIST_TASKPAD_KEY,
    JSON.stringify(taskPadLists)
  );
  localStorage.setItem(LOCAL_STORAGE_SELECTED_LIST_ID_KEY, selectedListId);
}

function render() {
  clearElement(projectContainer);
  renderList();
  renderTasks();
}

function renderList() {
  lists.forEach((list) => {
    const projectButton = document.createElement("button");
    projectButton.classList.add("project-item", "project-hover");
    projectButton.dataset.listId = list.id;
    projectButton.innerText = list.name;

    const deleteListIcon = document.createElement("i");
    deleteListIcon.classList.add("fa", "fa-trash", "project-delete-button");
    deleteListIcon.addEventListener("click", () => {
      projectContainer.removeChild(projectButton);
      lists = lists.filter((list) => list.id !== projectButton.dataset.listId);
      saveAndRender();
    });

    projectButton.appendChild(deleteListIcon);

    if (list.id === selectedListId) {
      projectButton.classList.add("active-list");
      projectButton.classList.remove("project-hover");
    }

    projectContainer.appendChild(projectButton);
  });
}

function clearElement(element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}

render();
