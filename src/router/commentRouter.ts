import express from "express"
import { CommentController } from "../controller/CommentController"
import { CommentBusiness } from "../business/CommentBusiness"
import { CommentDatabase } from "../database/CommentDatabase"
import { UserDatabase } from "../database/UserDatabase"
import { IdGenerator } from "../services/IdGenerator"
import { TokenManager } from "../services/TokenManager"
import { PostDatabase } from "../database/PostDatabase"

export const commentRouter = express.Router()

const commentController = new CommentController(
  new CommentBusiness(
    new CommentDatabase(),
    new PostDatabase(),
    new UserDatabase(),
    new IdGenerator(),
    new TokenManager()
  )
)

commentRouter.post("/:postId/comments", commentController.createComment)
commentRouter.get("/:postId/comments", commentController.getComments)
commentRouter.put("/:postId/comments/:commentId/vote", commentController.voteComment)