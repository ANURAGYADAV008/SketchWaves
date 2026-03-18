const express = require("express");
const boardRouter = express.Router();
const { userAuth } = require("../middlewares/userAuth")
const { Board } = require("../models/board");
const { boardData } = require("../models/boarddata");


boardRouter.post("/createBoard", userAuth, async (req, res) => {
    try {
        const userId = req.user_id;
        const { title } = req.body || "Untitled Board";
        ///create new Board
        const board = await new Board.create({
            title: title,
            admin: userId
        })

        const data = await new boardData.create({
            boardId: board_id,
            elements: [],
            version: 1
        })

        res.status(200).json({
            message: "board created Succefully",
            data: {
                id: board_id,
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
        const { user_Id } = req;
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

        //find board MetaData
        const board = await Board.findById(boardId).populate("admin", "firstName lastName emailId");

        if (!board) return res.status(400).json({ message: "Board Not save" });

        const isAdmin = board.admin._id.equals(userId)
        const isCollaborator = board.collaborators
            .some(c => c.user.equals(userId))

        if (!isAdmin && !isCollaborator)
            return res.status(403).json({ message: "Access denied" })


        const data = boardData.findOne({ boardId: id });
        if (!board) throw new Error("Something went wrong");

        res.status(200).json({
            board,
            scene: {
                elements: data.elements,
                version: data.version
            }

        })

    } catch (error) {
        res.status(400).send({ message: error.message });

    }

})

boardRouter.put("/saveScene/:id", userAuth, async (req, res) => {

})



boardRouter.delete("/deleteBoard/:id", userAuth, async (req, res) => {
  try {
    const boardId = req.params.id
    const userId  = req.user._id

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
