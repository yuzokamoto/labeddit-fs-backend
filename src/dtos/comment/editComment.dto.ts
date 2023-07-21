import z from "zod"

export interface EditCommentInputDTO {
  token: string,
  content: string,
  commentId: string
}

export type EditCommentOutputDTO = undefined

export const EditCommentSchema = z.object({
  token: z.string().min(1),
  content: z.string().min(1),
  commentId: z.string().min(1)
}).transform(data => data as EditCommentInputDTO)