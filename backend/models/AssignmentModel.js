import mongoose from "mongoose";

const AssignmentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    dueDate: { type: String, require: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
    lecturer: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    students: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    isDone: { type: Boolean, default: false }
},
{ timestamps: true }
);

const Assignment = mongoose.model("Assignment", AssignmentSchema);

export default Assignment;