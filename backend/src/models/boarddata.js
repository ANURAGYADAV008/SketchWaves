const mongoose = require("mongoose")

const boardDataSchema = new mongoose.Schema({
    boardId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Board",
        required: true,
        unique: true,
    },
    elements: {
        type: Array,
        default: [],
    },
    version: {
        type: Number,
        default: 1,
    },
}, { timestamps: true })

const boardData = mongoose.model("BoardData", boardDataSchema)
module.exports = { boardData }