const mongoose = require("mongoose")
const boardSchema = new mongoose.Schema({
    title: {
        type: String,
        default: "Untitled Board",
    },
    admin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    collaborators: [
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,  // fixed path
                ref: "User",
            },
            role: {
                type: String,
                enum: ["editor", "viewer"],
                default: "editor",
            }
        }
    ],

}, { timestamps: true });
boardSchema.index({ admin: 1 })
const Board = mongoose.model("Board", boardSchema)
module.exports = { Board }