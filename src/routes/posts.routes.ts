import { Router } from 'express';
import { isAdmin } from '../helpers/isAdmin';
import { isAuthenticated } from '../middlewares/isAuthenticated';
import { Post } from '../models/Post';
import { User } from '../models/User';

export const postsRouter = Router();

postsRouter.get('/', async (request, response) => {
    const page = Number(request.query.page);
    const limit = Number(request.query.limit);
    const skipIndex = (page - 1) * limit;
    try {
        const posts = await Post.find()
            .limit(limit)
            .skip(skipIndex)
            .populate('user')
            .populate('comments');

        return response.json(posts);
    } catch (err) {
        return response.status(400).json({ error: err.message });
    }
});

postsRouter.get('/:postId', async (request, response) => {
    const { postId } = request.params;
    try {
        const post = await Post.findOne({ _id: postId })
            .populate('user')
            .populate('comments');

        if (!post) {
            throw new Error('Post not found');
        }

        return response.json(post);
    } catch (err) {
        return response.status(400).json({ error: err.message });
    }
});

postsRouter.post('/', isAuthenticated, async (request, response) => {
    const { title, content, subtitle } = request.body;
    const { _id } = request.user;

    try {
        const user = await User.findOne({ _id });

        if (!user) {
            throw new Error('User not found for some reason');
        }

        const admin = isAdmin(user);

        if (!admin) {
            throw new Error('You don\'t have permission to post');
        }

        const post = new Post({
            title,
            subtitle,
            content,
            user: _id
        });

        await post.save();

        user.posts.push(post._id);

        await user.save();

        return response.status(201).send();
    } catch (err) {
        return response.status(400).json({ error: err.message });
    }
});

postsRouter.delete('/:postId', isAuthenticated, async (request, response) => {
    const { postId } = request.params;
    const { _id } = request.user;

    try {
        const user = await User.findOne({ _id });
        const post = await Post.findOne({ _id: postId });

        if (!post) {
            throw new Error('Post not found');
        }

        const admin = isAdmin(user);

        if (!admin) {
            throw new Error('You don\'t have permission to delete posts');
        }

        await Post.findByIdAndDelete(postId);

        return response.status(204).send();
    } catch (err) {
        return response.status(400).json({ error: err.message });
    }
});