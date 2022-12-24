import inquirer from 'inquirer';
import chalk from 'chalk';

type todoItemType = {task:string,date:Date,time:string,status:string}

class Todo {
    static todosList: todoItemType[] = [];
    push = (item: todoItemType) => {
        Todo.todosList.push(item)
    };
    getTodos = () => Todo.todosList
    updateTodo = (list:todoItemType[]) => Todo.todosList = list
    
}

// let todos: todoItemType[] = [];
let todos = new Todo();


enum ActionsQuestion { show = "Show Todo Items",add = "Add Item", delete = "Delete Item", update = "Update Item", changeStatus = "Change Item Status" };

interface todo {
    userAnswer: ActionsQuestion,
    addTodo: string,
    deleteId: number,
    updateId: number,
    updateText: string,
    changeStatus: string,
    changeStatusId: number
}

const handleTodos = async () => {

    const question: todo = await inquirer.prompt(
        [
        {
            type:"list",
            name:"userAnswer",
            message:"Please select options to perform actions",
            choices:["Show Todo Items","Add Item","Delete Item","Update Item","Change Item Status"]
        },
        {
            type:"string",
            name:"addTodo",
            message:"What is to be done?",
            when(answer) {
               return  answer.userAnswer === "Add Item"
            }
        },
        {
            type:"number",
            name:"deleteId",
            message:"Please enter id of item you want to delete",
            when(answer) {
               return todos.getTodos().length && answer.userAnswer === "Delete Item"
            }
        },
        {
            type:"number",
            name:"updateId",
            message:"Please enter id of item you want to update",
            when(answer) {
               return todos.getTodos().length && answer.userAnswer === "Update Item"
            }
        },
        {
            type:"string",
            name:"updateText",
            message:"Please enter text for update todo item",
            when(answer) {
                return todos.getTodos().length && answer.updateId
            }
        },
        {
                
            type:"number",
            name:"changeStatusId",
            message:"Please enter id of item you want to change status",
            when(answer) {
              return todos.getTodos().length &&  answer.userAnswer === "Change Item Status"
            }
        },
        {
            type:"list",
            name:"changeStatus",
            message:"Please select status",
            choices:["active","done"],
            when(answer) {
                return todos.getTodos().length &&  answer.changeStatusId
            }
        }
    ]
    )
    const {
        userAnswer,
        addTodo,
        deleteId,
        updateId,
        updateText,
        changeStatus,
        changeStatusId,
    } = question
    
    const handleShowItem = () => {
        if(!todos.getTodos().length) {
            console.log(chalk.bgGray("There is no item in Todo"))
        } else {
            todos.getTodos().map((item,index) => {
                if(item.status === "active") {
                    console.log(chalk.yellow(`ID:${index} - ${item.task} - ${item.date} | ${item.time}`))
                } else {
                    console.log(chalk.green(`ID:${index} - ${item.task} - ${item.date} | ${item.time}`))

                }
            })
        }
        handleTodos();
    }
    
    const handleAddItem = () => {
        const data: todoItemType = {
            task:addTodo,
            date: new Date(),
            time: new Date().toTimeString(),
            status:"active"
        }
        todos.push(data)
        handleTodos();
    }
    
    const handleDeleteItem = () => {
        let filteredData = todos.getTodos()
        filteredData.splice(deleteId,1)
        todos.updateTodo(filteredData)
        handleTodos();
    }
    
    const handleUpdateItem = () => {
        const data: todoItemType = {
            task:updateText,
            date: new Date(),
            time: new Date().toTimeString(),
            status:"active"
        }
        let filteredData = todos.getTodos()
           filteredData[updateId] =  data
            todos.updateTodo(filteredData)
        handleTodos();
    }
    
    const handleChangeStatusItem = () => {
        let filteredData = todos.getTodos()
        const data: todoItemType = {
            task:filteredData[changeStatusId].task,
            date: filteredData[changeStatusId].date,
            time: filteredData[changeStatusId].time,
            status:changeStatus
        }
            filteredData[changeStatusId] =  data
            todos.updateTodo(filteredData)
        handleTodos();
    }
    
    
    switch(userAnswer) {
        case ActionsQuestion.show:
            handleShowItem();
            break;
        case ActionsQuestion.add:
            handleAddItem();
            break;
        case ActionsQuestion.delete:
            handleDeleteItem();
            break;
        case ActionsQuestion.update:
            handleUpdateItem();
            break;
        case ActionsQuestion.changeStatus:
            handleChangeStatusItem();
            break;
    }
}

handleTodos()
