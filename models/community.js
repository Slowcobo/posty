const mongoose = require('mongoose');

const communitySchema = new mongoose.Schema({
    name: String,
    description: String,
    image: String,
    posts: [{
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'Post'
    }]
});

module.exports = mongoose.model('Community', communitySchema);