import { Router } from 'express';
import { createFile, getAllFiles,getFileByAccessToken, downloadFile,deleteFile,getFilesByUserId,getUserFiles,lockFile,unlockFile,searchFiles, updateFile } from '../controllers/file.controller.js';
import  authenticate  from '../middleware/auth.js';
import  uploadMiddleware  from '../middleware/upload.js';
import { paginationMiddleware } from '../middleware/pagination.js';
import checkRole from '../middleware/checkRole.js';
const fileRouter = Router();


fileRouter.get('/user', authenticate, getUserFiles); 
fileRouter.get('/user/:userId', authenticate,checkRole('admin'), getFilesByUserId); 
fileRouter.get('/search', authenticate, searchFiles);
fileRouter.get('/:accessToken', authenticate, getFileByAccessToken); 
fileRouter.get('/', authenticate,checkRole('admin'),paginationMiddleware, getAllFiles);
fileRouter.post('/',authenticate,uploadMiddleware, createFile);
fileRouter.put('/:accessToken', authenticate, updateFile);
fileRouter.get('/download/:accessToken', authenticate, downloadFile);
fileRouter.delete('/:accessToken', authenticate, deleteFile);
fileRouter.post('/lock/:accessToken', authenticate, lockFile);
fileRouter.post('/unlock/:accessToken', authenticate, unlockFile);


export {fileRouter};