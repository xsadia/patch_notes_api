import mongoose from 'mongoose';

const CommentSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post'
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export const Comment = mongoose.model('Comment', CommentSchema);