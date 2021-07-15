import { compare } from 'bcryptjs';
import { Router } from 'express';
import { User } from '../models/User';
import authConfig from '../config/authConfig';
import { sign } from 'jsonwebtoken';

export const sessionRouter = Router();

sessionRouter.post('/', async (request, response) => {
    const { email, password } = request.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            throw new Error('Incorrect e-mail/password combination');
        }

        const passwordMatch = await compare(password, user.password);

        if (!passwordMatch) {
            throw new Error('Incorrect e-mail/password combination');
        }

        const { secret, expiresIn } = authConfig.jwt;

        const token = sign({}, secret, {
            subject: user._id.toString(),
            expiresIn
        });

        return response.json({ token });
    } catch (err) {
        return response.status(401).json({ error: err.message });
    }
});