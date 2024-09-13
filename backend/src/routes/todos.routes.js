import { Router } from "express";
import { createTodoCtrl, getAllTodosCtrl, updateTodoCtrl } from "../controllers/todos.controllers.js";
import validarJwt from "../middlewares/validar-jwt.js";

const todosRouter = Router();

todosRouter.get("/", validarJwt, getAllTodosCtrl);
todosRouter.post("/create", validarJwt, createTodoCtrl);
todosRouter.put("/edit/:id", updateTodoCtrl);

export { todosRouter };
