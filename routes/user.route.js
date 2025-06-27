import { Router } from "express";
import { getAllUsers, getUserById, createUser, updateUser, deleteUser, loginUser } from "../controllers/user.controller.js";
import { paginationMiddleware } from "../middleware/pagination.js";
import authenticate from "../middleware/auth.js";
import checkRole from "../middleware/checkRole.js";

const userRouter = Router();

userRouter.get('/',authenticate,checkRole('admin'), paginationMiddleware, getAllUsers);
userRouter.get('/:userId',authenticate,checkRole('admin'), getUserById);
userRouter.post('/',authenticate, createUser);
userRouter.put('/:userId',authenticate, updateUser);
userRouter.delete('/:userId',authenticate,checkRole('admin'), deleteUser);
userRouter.post('/login', loginUser);


export { userRouter };