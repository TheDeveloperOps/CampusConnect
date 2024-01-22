import Course from "../models/courseModel.js";
import Assignment from "../models/AssignmentModel.js";
import { io } from "../socket/socket.js";
import { v2 as cloudinary } from "cloudinary";


const addCourse = async (req, res) => {
    const { course, enrollmentKey } = req.body;
    const lecturer = req.user;
    const courseObject = JSON.parse(course);

    try {
        const existingCourse = await Course.findById(courseObject._id);

        if (!existingCourse) {
            console.log("Course Not Found");
            return res.status(401).json({ error: 'No such course exists' });
        }

        // Update the enrollmentKey and lecturer for the found course
        const updatedCourse = await Course.findOneAndUpdate(
            { _id: courseObject._id, lecturer: { $ne: lecturer._id } },
            {
                $set: {
                    courseKey: enrollmentKey,
                    lecturer: lecturer._id
                }
            },
            { new: true, upsert: false }
        );

        if(!updatedCourse) {
            return res.status(400).json({ error: "You have already registered for this course" });
        }

        io.emit("addCourse", updatedCourse);

        return res.status(201).json(updatedCourse);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};




const deleteCourse = async (req, res) => {
    const courseId = req.params.courseId;

    try {
        const deletedCourse = await Course.findByIdAndUpdate(
            courseId,
            { $unset: { lecturer: 1 } },
            { new: true }
        );

        if (deletedCourse) {
            res.status(200).json({ message: "Course has been deleted successfully" });
        } else {
            res.status(404).json({ error: "Course Not Found" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server" });
    }
};



const getCourses = async (req, res) => {
    const userId = req.params.userId;

    try {
        const courses = await Course.find({ lecturer: userId });

        res.status(200).json(courses);
    }catch(error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};


const getAllCourses = async (req, res) => {
    try {
        const courses = await Course.find({ diploma: req.user.diploma });

        res.status(200).json(courses);
    }catch(error) {
        console.error(error);
    }
};


const uploadFile = async (req, res) => {
    try {
        if (!req.body || !req.body.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const uploadedFile = req.body.file;
        const cloudinaryUploadResponses = await cloudinary.uploader.upload(uploadedFile);
        const fileUrl = cloudinaryUploadResponses.secure_url;

        // Handle the Cloudinary upload responses if needed
        console.log('File uploaded to Cloudinary:', fileUrl);

        // Send a response indicating the successful upload to Cloudinary
        res.status(200).json({ fileUrl });
    } catch (error) {
        // Handle errors
        console.error('Error uploading file to Cloudinary:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


const addAssignment = async (req, res) => {
    const { assignment, description, dueDate, courseId } = req.body;
    const lecturer = req.user;
    const courseObject = JSON.parse(courseId);
    const course = await Course.findById(courseObject._id);

    try {
        const newAssignment = await Assignment.create({
            name: assignment,
            description: description,
            dueDate: dueDate,
            lecturer: lecturer,
            students: course.enrolledStudents,
            course: courseObject._id
        });

        io.emit("addAssignment", newAssignment);

        res.status(201).json(newAssignment);
    }catch(error) {
        console.error(error);
    }
};


const getAssignments = async (req, res) => {
    const { userId } = req.params;

    try {
        const assignments = await Assignment.find({ lecturer: userId });

        res.status(200).json(assignments);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};


const deleteAssignment = async (req, res) => {
    const { assignmentId }= req.params;
    try {
        const deletedAssignment = await Assignment.findByIdAndDelete(assignmentId);

        io.emit("deleteAssignment", deletedAssignment);
        res.status(201).json(deletedAssignment);
    }catch(error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error"});
    }
}

export {
    addCourse,
    deleteCourse,
    getCourses,
    uploadFile,
    getAllCourses,
    addAssignment,
    getAssignments,
    deleteAssignment
};