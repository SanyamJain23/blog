const mongoose = require('mongoose');
mongoose.set('useCreateIndex', true)

 
const PostSchema = new mongoose.Schema({
    title: String,
    description: String,
    content: String,
    username: String,
    image:String,
    createdAt: {
        type: Date,
        default: new Date()
    }
});
 
const Post = mongoose.model('Post', PostSchema);
 
module.exports = Post;