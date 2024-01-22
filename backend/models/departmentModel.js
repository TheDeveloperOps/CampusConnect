import mongoose from "mongoose";


const departmentSchema = new mongoose.Schema(
    {
        name: { type: String, trim: true },
        diploma: [ { type: mongoose.Schema.Types.ObjectId, ref: "Diploma"  } ],
        lecturers: [ { type: mongoose.Schema.Types.ObjectId, ref: "User" }],
        students: [ { type: mongoose.Schema.Types.ObjectId, ref: "User" } ],
    }
);

const Department = mongoose.model("Department", departmentSchema);

export default Department;