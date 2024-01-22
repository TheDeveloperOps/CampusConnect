import mongoose from "mongoose";

const groupSchema = new mongoose.Schema(
	{
		name: { type: String, trim: true },
		pic: { type: String, default: ""},
		user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
		participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
		lastMessage: {
			text: { type: String, default: "" },
			sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
			username: { type: String, default: "" },
		},
		seen: {
			type: Boolean,
			default: false,
		},
		admin: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
		code: { type: String, default: ""}
	},
	{ timestamps: true }
);

const Group = mongoose.model("Group", groupSchema);

export default Group;
