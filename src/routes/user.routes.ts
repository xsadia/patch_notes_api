import { Router } from 'express';
import { hash } from 'bcryptjs';
import { User } from '../models/User';
import { isAuthenticated } from '../middlewares/isAuthenticated';

export const userRouter = Router();

//Rota temporaria por preguica de abrir o terminal do mongo
userRouter.get('/', async (request, response) => {
    try {
        const users = await User.find()
            .populate('posts');

        return response.json(users);
    } catch (err) {
        return response.status(400).json({ error: err.message });
    }
});

userRouter.post('/', async (request, response) => {
    const { email, username, password } = request.body;
    try {
        const userEmailExists = await User.findOne({ email });

        if (userEmailExists) {
            throw new Error('E-mail already in use.');
        }

        const usernameExists = await User.findOne({ username });

        if (usernameExists) {
            throw new Error('Username already in use.');
        }

        const hashedPassword = await hash(password, 8);

        const user = new User({
            username,
            email,
            password: hashedPassword
        });

        await user.save();

        return response.status(201).send();


    } catch (err) {
        return response.status(400).json({ error: err.message });
    }

});

userRouter.post('/admin', async (request, response) => {
    const { email, username, password } = request.body;
    try {
        const userEmailExists = await User.findOne({ email });

        if (userEmailExists) {
            throw new Error('E-mail already in use.');
        }

        const usernameExists = await User.findOne({ username });

        if (usernameExists) {
            throw new Error('Username already in use.');
        }

        const hashedPassword = await hash(password, 8);

        const user = new User({
            username,
            email,
            password: hashedPassword,
            role: 'admin'
        });

        await user.save();

        return response.status(201).send();


    } catch (err) {
        return response.status(400).json({ error: err.message });
    }

});

userRouter.delete('/', isAuthenticated, async (request, response) => {
    const { _id } = request.user;
    try {
        const user = await User.findOne({ _id });

        if (!user) {
            throw new Error('User not found');
        }

        await User.findByIdAndDelete(_id);

        return response.status(204).send();
    } catch (err) {
        return response.status(404).json({ error: err.message });
    }
});

userRouter.patch('/', isAuthenticated, async (request, response) => {
    const { _id } = request.user;
    const { email, username } = request.body;

    try {
        const user = await User.findOne({ _id });
        const emailInUse = await User.findOne({ email });
        const usernameInUse = await User.findOne({ username });

        if (!user) {
            throw new Error('User not found');
        }

        if (emailInUse && user.email !== email) {
            throw new Error('E-mail already in use');
        }

        if (usernameInUse && user.username !== username) {
            throw new Error('Username already in use');
        }

        user.email = email;
        user.username = username;

        await user.save();

        return response.status(204).send();
    } catch (err) {
        return response.status(400).json({ error: err.message });
    }
});