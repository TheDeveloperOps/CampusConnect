import Course from "../models/courseModel.js";
import Assignment from "../models/AssignmentModel.js";
import { io } from "../socket/socket.js";


const getCourses = async (req, res) => {
    const user = req.user;

    try {
        const diplomaId = user.diploma;

        const courses = await Course.find({ diploma: diplomaId });

        res.status(200).json({ courses });
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
        console.error(error);
    }
};


const enrollCourse = async (req, res) => {
    const { courseId, enrollmentKey } = req.body;
    if (!courseId || !enrollmentKey) {
        return res.status(401).json({ error: "Missing data" });
    }

    const course = await Course.findById(courseId);

    if (!course) {
        return res.status(404).send("Course Not Found");
    }

    if (course.courseKey !== enrollmentKey) {
        return res.status(400).json({ error: "Incorrect Enrollment Key" });
    }

    // Check if the user is already enrolled in the course
    if (course.enrolledStudents.includes(req.user._id)) {
        return res.status(400).json({ error: "User is already enrolled in this course" });
    }

    // If the user is not already enrolled, update the course
    const updateCourse = await Course.findOneAndUpdate(
        { _id: courseId },
        { $push: { enrolledStudents: req.user._id } },
        { new: true }
    );

    return res.status(200).json(updateCourse);
};


const getEnrolledCourses = async (req, res) => {
    const user = req.user;

    try {
        const courses = await Course.find({ enrolledStudents: user._id });

        res.status(200).json({ courses });
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
        console.error(error);
    }
};

const getAssignments = async (req, res) => {
    const { courseId } = req.params;
    const user = req.user;
    try {
        const assignments = await Assignment.find({ students: user._id , course: courseId });

        res.status(200).json({ assignments });
    }catch(error) {
        res.status(500).json({ error: "Internal Server" });
    }
};


const markAssignmentDone = async (req, res) => {
    const { assignmentId } = req.params;

    try {
        const assignment = await Assignment.findById(assignmentId);

        if (!assignment) {
            return res.status(404).json({ error: 'Assignment not found' });
        }

        // Toggle the value of isDone
        assignment.isDone = !assignment.isDone;

        await assignment.save();

        res.status(201).json(assignment);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};



export { getCourses, enrollCourse, getAssignments, getEnrolledCourses, markAssignmentDone };
