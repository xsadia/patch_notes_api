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
        type: mongoose.Schema.Types.ObjectId.cast,
        ref: 'user'
    }
});

export const Comment = mongoose.model('Comment', CommentSchema);