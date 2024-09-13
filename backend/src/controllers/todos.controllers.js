import { database } from "../db/database.js";


export const getAllTodosCtrl = (req, res) => {
  const todos = database.todos;

  const tasksCont = [];

  const user = req.user;

  todos.map(task => {

    if (task.owner === user.id) {
      tasksCont.push(task);
    }

  });

  tasksCont.map((task, index) => {
    task.id = index + 1;
  });

  res.json(tasksCont);

};

export const createTodoCtrl = (req, res) => {

  try {


    const todos = database.todos;

    const lastId = todos[todos.length - 1].id;

    const { title, completed } = req.body;

    const newTask = {
      id: lastId + 1,
      title,
      completed,
      owner: req.user.id,
    };

    todos.push(newTask);

    res.status(201).json({message: 'Tarea creada exitosamente'});

  } catch (error) {

    console.error(error);
    return res.status(500).json({ message: "Error Inesperado" });

  }


}

export const updateTodoCtrl = (req, res) => {

  try {

    const id  = parseInt(req.params.id);

    const { title, completed } = req.body;

    const todos = database.todos;

    const task = todos.find(task => task.id === id);

    if (!task) {
      return res.status(404).json({ message: "Tarea no encontrada" });
    } 

    task.title = title;
    task.completed = completed;

    res.json({ message: "Tarea actualizada" });

  } catch (error) {

    console.error(error);
    return res.status(500).json({ message: "Error Inesperado" });

  }

}

export const deleteTodoCtrl = (req, res) => {

  try {

    const id = parseInt(req.params.id);

    const todos = database.todos;

    const taskIndex = todos.findIndex(task => task.id === id);

    if (taskIndex === -1) {
      return res.status(404).json({ message: "Tarea no encontrada" });
    }

    todos.splice(taskIndex, 1);

    res.json({ message: "Tarea eliminada" });

  } catch (error) {

    console.error(error);
    return res.status(500).json({ message: "Error Inesperado" });

  }

}