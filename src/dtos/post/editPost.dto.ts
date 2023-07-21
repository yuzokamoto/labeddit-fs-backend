import z from "zod"

export interface EditPostInputDTO {
  token: string,
  content: string,
  postId: string
}

export type EditPostOutputDTO = undefined

export const EditPostSchema = z.object({
  token: z.string().min(1),
  content: z.string().min(1),
  postId: z.string().min(1)
}).transform(data => data as EditPostInputDTO)