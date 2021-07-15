import express from 'express';
import mongoose from 'mongoose';
import { sessionRouter } from './routes/session.routes';
import { userRouter } from './routes/user.routes';

const app = express();
app.use(express.json());

app.use('/users', userRouter);

app.use('/sessions', sessionRouter);

mongoose.connect('mongodb://localhost:27017/patch_notes', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
});

mongoose.connection.on("error", err => {
    console.log("err", err);
});

mongoose.connection.on("connected", (err, res) => {
    console.log("mongoose is connected");
});

app.listen(3333, () => {
    console.log('Server running on http://localhost:3333');
});