import mongoose, { Mongoose } from "mongoose";

const CourseSchema = new mongoose.Schema({
    courseCode: {
        type: String,
        require: true,
        unique: true
    },
    courseName: {
        type: String,
        require: true
    },
    courseAssignment: {
        assignments: [],
        submissionDate: Date
    },
    lecturer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    enrolledStudents: [{type: mongoose.Schema.Types.ObjectId}],
    courseKey: {
        type: String,
        default: ""
    },
    diploma: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Diploma"
    }
},
    { timestamps: true }
);

const Course = mongoose.model("Course", CourseSchema);

export default Course;