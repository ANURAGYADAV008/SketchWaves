const express = require("express");
const boardRouter = express.Router();
const { userAuth } = require("../middlewares/userAuth")
const { Board } = require("../models/board");
const { boardData } = require("../models/boarddata");


boardRouter.post("/createBoard", userAuth, async (req, res) => {
    try {
        const userId = req.user._id;
        const { title } = req.body || "Untitled Board";
        ///create new Board
        console.log(userId);
        const board = await new Board({
            title: title,
            admin: userId
        })
        //console.log(board_id);
        await board.save();
        const data = await new boardData({
            boardId: board._id,
            elements: [],
            version: 1
        })

        await data.save();

        res.status(200).json({
            message: "board created Succefully",
            data: {
                id: board._id,
                title: board.title,
                admin: board.admin,
                createdAt: board.createdAt,
            },
            scene: {
                elements: data.elements,
                version: data.version,
            }
        })

    } catch (error) {
        res.status(400).json({ message: error.message });

    }
})

boardRouter.get("/getallBoards", userAuth, async (req, res) => {
    try {
        const user_Id = req.user._id;
        console.log(user_Id);
        const boards = await Board.find({
            $or: [
                { admin: user_Id },
                { "collaborators.user": user_Id }
            ]
        }).populate("admin", "firstName lastname emailId")

        if (boards.length == 0) throw new Error("No Board Found");

        res.status(200).send({ boards: boards })

    } catch (error) {
        res.status(400).send({ message: error.message })

    }
})

boardRouter.get("/getBoards/:id", userAuth, async (req, res) => {
    try {
        const boardId = req.params.id;
        const userId = req.user._id;

        // Find board metadata
        const board = await Board.findById(boardId)
            .populate("admin", "firstName lastName emailId");

        if (!board) {
            return res.status(404).json({ message: "Board not found" });
        }

        const isAdmin = board.admin._id.equals(userId);

        const isCollaborator = board.collaborators?.some(c =>
            c.user.equals(userId)
        );

        if (!isAdmin && !isCollaborator) {
            return res.status(403).json({ message: "Access denied" });
        }

        // Get board drawing data
        const data = await boardData.findOne({ boardId: boardId });

        if (!data) {
            return res.status(404).json({ message: "Board data not found" });
        }

        res.status(200).json({
            board,
            scene: {
                elements: data.elements,
                version: data.version
            }
        });

    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

boardRouter.put("/saveScene/:id", async (req, res) => {
    console.log("OKKKK")


    try {
        const userId = "69c958731727b688e1ef2c69";
        const boardId = req.params.id;
        const { elements } = req.body


        const isboardExist = await Board.findById(boardId);

        if (!isboardExist) throw new Error("Something Went Wrong");

        // const isAdmin = Board.admin?.equals(userId);

        // const isCollaborator = Board.collaborators?.some(c =>
        //     c.user?.equals(userId)
        // );

        // if (!isAdmin && !isCollaborator) {
        //     return res.status(403).json({ message: "Access denied" });
        // }

        const updateData = await boardData.findOneAndUpdate(
            { boardId: boardId },   // ✅ correct filter
            { elements: elements },
            { new: true }
        );

        if (!updateData) {
            return res.status(404).json({ message: "Board data not found" });
        }

        res.status(200).json({ message: "Data Saved Successfully" });

    }
    catch (error) {
        res.status(500).json({ message: error.message })

    }

})

boardRouter.delete("/deleteBoard/:id", userAuth, async (req, res) => {
    try {
        const boardId = req.params.id
        const userId = req.user._id

        // step 1 — find the Board document (not BoardData)
        const board = await Board.findById(boardId)

        if (!board)
            return res.status(404).json({ message: "Board not found" })

        // step 2 — only admin can delete

        if (!board.admin.equals(userId))
            return res.status(403).json({ message: "Only the board owner can delete it" })

        // step 3 — delete both documents
        await Board.findByIdAndDelete(boardId)
        await boardData.deleteOne({ boardId: boardId })

        res.status(200).json({ message: "Board deleted successfully" })

    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

module.exports = { boardRouter };