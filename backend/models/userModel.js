import mongoose from "mongoose";

const userSchema = mongoose.Schema(
	{
		nric: {
			type: String,
			require: true,
			unique: true,
		},
		username: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
		},
		password: {
			type: String,
			minLength: 6,
			required: true,
		},
		profilePic: {
			type: String,
			default: "",
		},
		following: {
			type: [String],
			default: [],
		},
		department: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Department"
		},
		diploma: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Diploma",
		},
		courses: [{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Course"
		}],
		bio: {
			type: String,
			default: "",
		},
		isFrozen: {
			type: Boolean,
			default: false,
		},
		isAdmin: {
			type: Boolean,
			default: false,
		},
		isLecturer: {
			type: Boolean,
			default: false,
		},
		isStudent: {
			type: Boolean,
			default: false,
		}
	},
	{
		timestamps: true,
	}
);

const User = mongoose.model("User", userSchema);

export default User;
