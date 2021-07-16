import { Router } from 'express';
import { isAuthenticated } from '../middlewares/isAuthenticated';
import { Post } from '../models/Post';
import { User } from '../models/User';
import { Comment } from '../models/Comment';

export const commentsRouter = Router();

commentsRouter.get('/', async (request, response) => {
    const comments = await Comment.find()
        .populate('post')
        .populate('owner');

    return response.json(comments);
});

commentsRouter.post('/:postId', isAuthenticated, async (request, response) => {
    const { content } = request.body;
    const { postId } = request.params;
    const { _id } = request.user;

    try {

        const post = await Post.findOne({ _id: postId });

        if (!post) {
            throw new Error('Post not found');
        }

        const user = await User.findOne({ _id });

        if (!user) {
            throw new Error('User not found');
        }

        const comment = new Comment({
            content,
            post: post._id,
            owner: user._id
        });

        await comment.save();

        post.comments.push(comment._id);

        await post.save();

        return response.status(201).send();
    } catch (err) {
        return response.status(400).json({ error: err.message });
    }
});