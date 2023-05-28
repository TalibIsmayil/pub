const mongoose = require('mongoose');

const LessonSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    roomId: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    teacher: {
        type: String,
        required: true
    },
    hostUrl: {
        type: String,
        required: true
    },
    guestUrl: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Lesson', LessonSchema);