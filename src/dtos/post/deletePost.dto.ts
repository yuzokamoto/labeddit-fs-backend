import z from "zod"

export interface DeletePostInputDTO {
  token: string,
  postId: string
}

export type DeletePostOutputDTO = undefined

export const DeletePostSchema = z.object({
  token: z.string().min(1),
  postId: z.string().min(1)
}).transform(data => data as DeletePostInputDTO)