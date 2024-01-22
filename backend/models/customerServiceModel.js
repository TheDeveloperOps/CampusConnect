import mongoose from "mongoose";

const customerServiceSchema = mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            require: true,
        },
        reportType: {
            type: String,
            require: true,
        },
        subject: {
            type: String,
            require: true,
        },
        description: {
            type: String,
            require: true,
        },
        isSolve: {
            type: Boolean,
            default: false
        }
    },
    { timestamps: true }
);

const CustomerService = mongoose.model("CustomerService", customerServiceSchema);

export default CustomerService;