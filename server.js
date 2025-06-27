import express from 'express';
import { startServer } from './models/models.js';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import { config } from 'dotenv';
import {userRouter} from './routes/user.route.js';
import {fileRouter} from './routes/file.route.js';
config();
const app = express();


app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


app.use('/api/v1/users',userRouter);
app.use('/api/v1/files',fileRouter);



app.get('/', (req, res) => {
  res.send('Hello World!');
});




startServer();
app.listen(process.env.PORT || 3000);


