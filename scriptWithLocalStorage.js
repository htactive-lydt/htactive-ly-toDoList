class ToDoClass {

    constructor() {
        this.taskUndo = {};
        this.indexUndo;
        this.tasks = JSON.parse(localStorage.getItem('items')) || [];

        this.loadTasks(this.tasks);
        this.addEventListener();
    }

    addEventListener() {
        document.getElementById('addTask').addEventListener('keypress', event => {
            if (event.keyCode === 13) {
                this.addTask(event.target.value);
                event.target.value = "";
            }
        });
    }

    makeId = (length) => {
        var result = '';
        var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for (var i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }

    addTask = (task) => {
        if (task != "") {
            if (this.tasks.findIndex(item => item.task == task) == -1) {
                this.tasks.push({ id: this.makeId(10), task: task, isComplete: false })
                this.loadTasks(this.tasks);
            } else {
                document.getElementById("error").style.display = "block";
                document.getElementById("errorContent").textContent = "The task already exist!";
            }
        } else {
            document.getElementById("error").style.display = "block";
            document.getElementById("errorContent").textContent = "Please input task content!";
        }
    }

    addTaskClick = () => {
        let task = document.getElementById("addTask").value;
        this.addTask(task);
        document.getElementById('addTask').value = "";
    }

    completeTodo = (id) => {
        let index = this.tasks.findIndex(t => t.id == id);
        this.tasks[index].isComplete = !this.tasks[index].isComplete;
        this.loadTasks(this.tasks);
    }

    deleteTodo = (event, id) => {
        let index = this.tasks.findIndex(item => item.id == id);
        if (this.tasks[index].isComplete == true) {
            alert("You can't delete done task!!");
        } else {
            if (confirm("Are you sure you want to delete this task?")) {
                this.indexUndo = index;
                clearInterval(this.timer);
                this.taskUndo = this.tasks[index];
                this.tasks.splice(index, 1);
                this.loadTasks(this.tasks);

                // Undo
                let divUndo = document.getElementById("undo");
                divUndo.innerHTML = this.generateUndo();
                this.timer = setInterval(() => {
                    let c = document.getElementById("second");
                    if (c != undefined && c != null) {
                        let second = c.textContent;
                        if (second == 0) {
                            divUndo.innerHTML = "";
                        } else {
                            document.getElementById("second").textContent = second - 1;
                        }
                    }
                }, 1000);
            }
        }

    }

    generateUndo = () => {
        return `
        <div class="alert alert-warning" role="alert" id="undoContent">
            <a class="close" onclick="$('#undoContent').hide()">×</a>
            <p>Còn: <span id="second" value="">5</span>s</p>
            <button class="btn btn-primary" type="button" onclick="toDo.undo()">Undo</button>
        </div>
        `;
    }

    undo = () => {
        this.tasks.splice(this.indexUndo, 0, this.taskUndo);
        this.loadTasks(this.tasks);
        document.getElementById("undo").innerHTML = "";
    }

    editTask = (event, id) => {
        let input = document.getElementById(id);
        input.disabled = false;
        event.target.className = "edit-icon fa fa-save";
        document.getElementById("save-" + id).setAttribute("onClick", "toDo.saveEditTask(event, '" + id + "')");

        input.focus();
        var length = input.value.length;
        input.setSelectionRange(length, length);
        // Focus into input tag
    }

    saveEditTask = (event, id) => {
        let index = this.tasks.findIndex(t => t.id == id);
        let input = document.getElementById(id).value;
        this.tasks[index].task = input;
        this.loadTasks(this.tasks);
    }

    checkSelectAll = () => {
        let doneTask = this.tasks.filter(item => item.isComplete == true);
        if (doneTask.length == this.tasks.length) {
            return 1;
        }
        return 0;
    }

    generateSelectAllHtml = () => {
        return `
        <li class="list-group-item checkbox">
            <div class="row">
                <div class="col-md-1 col-xs-1 col-lg-1 col-sm-1 checkbox">
                    <label><input id="toggleTaskStatus" type="checkbox" onchange="toDo.selectAllTask()" value="" class="" ${this.checkSelectAll() == 1 ? 'checked' : ''}></label>
                </div>
                <div class="col-md-10 col-xs-10 col-lg-10 col-sm-10 task-text ">
                    <b>Select All</b>
                </div>
            </div>
        </li>
        `;
    }

    selectAllTask = () => {
        var checkbox = event.target;
        if (checkbox.checked) {
            this.tasks.forEach(item => {
                item.isComplete = true;
            })
        } else {
            this.tasks.forEach(item => {
                item.isComplete = false;
            })
        }
        this.loadTasks(this.tasks);
    }

    filterByStatus = () => {
        let resultFilter = [];
        let choosen = document.getElementById("filter").value;
        if (choosen == "1") {
            resultFilter = this.tasks.filter(item => item.isComplete == true);
        } else if (choosen == "0") {
            resultFilter = this.tasks.filter(item => item.isComplete == false);
        } else {
            resultFilter = this.tasks;
        }
        this.loadTasks(resultFilter);
    }

    countMarkDone = () => {
        let doneTask = this.tasks.filter(item => item.isComplete == true);
        let percent;
        if (this.tasks.length != 0) {
            percent = doneTask.length / this.tasks.length * 100;
        } else percent = 0;
        document.getElementById("percent").innerHTML = Math.round(percent) + "%";
        document.getElementById("percent").style.width = percent + "%";
    }

    generateTaskHtml = (task) => {
        return `
            <li class="list-group-item checkbox">
            <div class="row">
                <div class="col-md-1 col-xs-1 col-lg-1 col-sm-1 checkbox">
                <label><input id="toggleTaskStatus" type="checkbox" onchange="toDo.completeTodo('${task.id}')" value="" class="" ${task.isComplete ? 'checked' : ''}></label>
                </div>
                <div class="col-md-10 col-xs-10 col-lg-10 col-sm-10 task-text ${task.isComplete ? 'complete' : ''}">
                <input type="text" value="${task.task}" style="border: none; background-color: #fff; width: 300px; height: 30px" disabled id="${task.id}"></input>
                
                </div>
                <div class="col-md-1 col-xs-1 col-lg-1 col-sm-1 delete-icon-area">
                <a class="" onClick="toDo.editTask(event, '${task.id}')" id = "save-${task.id}"><i id="editTask" data-id="${task.id}" class="edit-icon fa fa-pencil-square-o"></i></a>
                <a class="" onClick="toDo.deleteTodo(event, '${task.id}')" data-confirm="Are you sure to delete this item?"><i id="deleteTask" data-id="${task.id}" class="delete-icon glyphicon glyphicon-trash"></i></a>
                </div>
            </div>
            </li>
        `;
    }

    loadTasks = (tasksList) => {
        localStorage.setItem('items', JSON.stringify(this.tasks));
        this.countMarkDone();
        let taskHtml = tasksList.reduce((html, task) => html += this.generateTaskHtml(task), '');
        if (tasksList != undefined && tasksList.length != 0) {
            taskHtml = this.generateSelectAllHtml() + taskHtml;
        }
        document.getElementById('taskList').innerHTML = taskHtml;
    }

}

let toDo;
window.addEventListener("load", () => {
    toDo = new ToDoClass();
});