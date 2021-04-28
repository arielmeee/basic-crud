const mongoose = require('mongoose');

//Attributes of the Course object
var courseSchema = new mongoose.Schema({
    courseName: {
        type: String,
        required: true
    },
    courseId: {
        type: Number,
        required: true
    },
    courseDuration: {
        type: Number,
        required: true
    },
    courseFee: {
        type: Number,
        required: true
    }
});

mongoose.model('Course', courseSchema);