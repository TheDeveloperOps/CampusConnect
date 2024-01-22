import mongoose from "mongoose";

const diplomaSchema = mongoose.Schema({
    name: { type: String, default: "" },
    courses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }],
    department: { type: mongoose.Schema.Types.ObjectId, ref: "Department" },
    lecturers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    students: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }]
});

const Diploma = mongoose.model("Diploma", diplomaSchema);

export default Diploma;
