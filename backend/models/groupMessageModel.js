import mongoose from "mongoose";

const GroupMessageSchema = new mongoose.Schema(
	{
		groupId: { type: mongoose.Schema.Types.ObjectId, ref: "Group" },
		user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
		username: { type: String, default: "" },
		text: String,
		seen: {
			type: Boolean,
			default: false,
		},
		img: {
			type: String,
			default: "",
		},
	},
	{ timestamps: true }
);

const GroupMessage = mongoose.model("GroupMessage", GroupMessageSchema);

export default GroupMessage;
