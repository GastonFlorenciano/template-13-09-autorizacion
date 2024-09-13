import { Router } from "express";
import { createTodoCtrl, deleteTodoCtrl, getAllTodosCtrl, updateTodoCtrl } from "../controllers/todos.controllers.js";
import validarJwt from "../middlewares/validar-jwt.js";

const todosRouter = Router();

todosRouter.get("/", validarJwt, getAllTodosCtrl);
todosRouter.post("/create", validarJwt, createTodoCtrl);
todosRouter.put("/edit/:id", validarJwt, updateTodoCtrl);
todosRouter.delete("/delete/:id", validarJwt, deleteTodoCtrl);

export { todosRouter };
