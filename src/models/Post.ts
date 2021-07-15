import mongoose from 'mongoose';

const PostSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    comments: [
        {
            types: mongoose.Schema.Types.ObjectId,
            ref: 'Comment'
        }
    ],
});

export const Post = mongoose.model('Post', PostSchema);

