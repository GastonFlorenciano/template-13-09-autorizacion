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
  
  console.log(tasksCont);
  
  res.json(tasksCont);

};
