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

  // tasksCont.map((task, index) => {
  //   task.id = index + 1;
  // });

  res.json(tasksCont);

};

export const createTodoCtrl = (req, res) => {

  try {


    const todos = database.todos;

    // const lastId = todos[todos.length - 1].id;

    const { title, completed } = req.body;

    const newTask = {
      // id: lastId + 1,
      title,
      completed,
      owner: req.user.id,
    };

    todos.push(newTask);

    res.status(201).json({ message: 'Tarea creada exitosamente' });

  } catch (error) {

    console.error(error);
    return res.status(500).json({ message: "Error Inesperado" });

  }


}

export const updateTodoCtrl = (req, res) => {
  const user = req.user

  if (!user) {
    return res.status(401).json({ message: 'No autorizado' })
  }

  const { id } = req.params
  const { title, completed } = req.body
  const todo = database.todos.find((todo) => todo.id === Number(id))

  if (!title) {
    return res.status(400).json({ message: 'Falta el título' })
  }
  if (!todo) {
    return res.status(404).json({ message: 'Tarea no encontrada' })
  }
  if (todo.owner !== user.id) {
    return res.status(403).json({ message: 'No permitido' })
  }

  todo.title = title
  todo.completed = completed

  res.json({ message: 'Tarea actualizada', todo })
}

export const deleteTodoCtrl = (req, res) => {
  const user = req.user
  const { id } = req.params

  if (!user) {
    return res.status(401).json({ message: 'No autorizado' })
  }

  const todoIndex = database.todos.findIndex((todo) => todo.id === Number(id))

  if (todoIndex === -1) {
    return res.status(404).json({ message: 'Tarea no encontrada' })
  }

  const todo = database.todos[todoIndex]

  console.log(todo);

  if (todo.owner !== user.id) {
    return res.status(401).json({ message: 'No autorizado' })
  }

  database.todos.splice(todoIndex, 1)

  res.json({ todo })
}