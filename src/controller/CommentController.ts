import { Request, Response } from "express";
import { ZodError } from "zod"
import { BaseError } from "../errors/BaseError";
import { VoteCommentSchema } from "../dtos/comment/voteComment.dto";
import { DeleteCommentSchema } from "../dtos/comment/deleteComment.dto";
import { EditCommentSchema } from "../dtos/comment/editComment.dto";
import { GetCommentsSchema } from "../dtos/comment/getComments.dto";
import { CreateCommentSchema } from "../dtos/comment/createComment.dto";
import { CommentBusiness } from "../business/CommentBusiness";

export class CommentController {
  constructor(
    private commentBusiness: CommentBusiness
  ) {}

  public createComment = async (req: Request, res: Response) => {
    try {

      const input = CreateCommentSchema.parse({
        token: req.headers.authorization,
        postId: req.params.postId,
        content: req.body.content
      })

      const response = await this.commentBusiness.createComment(input)
      res.status(201).send(response)
      
    } catch (error) {
      console.log(error)

      if (error instanceof ZodError) {
        res.status(400).send(error.issues)

      } else if (error instanceof BaseError) {
        res.status(error.statusCode).send(error.message)

      } else {
        res.status(500).send("Erro inesperado")
      }
    }
  }

  public getComments = async (req: Request, res: Response) => {
    try {

      const input = GetCommentsSchema.parse({
        token: req.headers.authorization,
        postId: req.params.postId
      })

      const response = await this.commentBusiness.getComments(input)
      res.status(200).send(response)
      
    } catch (error) {
      console.log(error)

      if (error instanceof ZodError) {
        res.status(400).send(error.issues)

      } else if (error instanceof BaseError) {
        res.status(error.statusCode).send(error.message)

      } else {
        res.status(500).send("Erro inesperado")
      }
    }
  }

  public editComment = async (req: Request, res: Response) => {
    try {

      const input = EditCommentSchema.parse({
        token: req.headers.authorization,
        commentId: req.params.commentId,
        content: req.body.content
      })

      const response = await this.commentBusiness.editComment(input)
      res.status(200).send(response)
      
    } catch (error) {
      console.log(error)

      if (error instanceof ZodError) {
        res.status(400).send(error.issues)

      } else if (error instanceof BaseError) {
        res.status(error.statusCode).send(error.message)

      } else {
        res.status(500).send("Erro inesperado")
      }
    }
  }

  public deleteComment = async (req: Request, res: Response) => {
    try {

      const input = DeleteCommentSchema.parse({
        token: req.headers.authorization,
        commentId: req.params.commentId
      })

      const response = await this.commentBusiness.deleteComment(input)
      res.status(200).send(response)
      
    } catch (error) {
      console.log(error)

      if (error instanceof ZodError) {
        res.status(400).send(error.issues)

      } else if (error instanceof BaseError) {
        res.status(error.statusCode).send(error.message)

      } else {
        res.status(500).send("Erro inesperado")
      }
    }
  }

  public voteComment = async (req: Request, res: Response) => {
    try {

      const input = VoteCommentSchema.parse({
        token: req.headers.authorization,
        commentId: req.params.commentId,
        vote: req.body.vote
      })

      const response = await this.commentBusiness.voteComment(input)
      res.status(200).send(response)
      
    } catch (error) {
      console.log(error)

      if (error instanceof ZodError) {
        res.status(400).send(error.issues)

      } else if (error instanceof BaseError) {
        res.status(error.statusCode).send(error.message)

      } else {
        res.status(500).send("Erro inesperado")
      }
    }
  }
}