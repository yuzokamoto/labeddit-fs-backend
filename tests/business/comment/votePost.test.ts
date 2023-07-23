import { ZodError } from "zod"
import { CommentBusiness } from "../../../src/business/CommentBusiness"
import { IdGeneratorMock } from "../../mocks/services/IdGeneratorMock"
import { TokenManagerMock } from "../../mocks/services/TokenManagerMock"
import { CommentDatabaseMock } from "../../mocks/database/CommentDatabaseMock"
import { UserDatabaseMock } from "../../mocks/database/UserDatabaseMock"
import { PostDatabaseMock } from "../../mocks/database/PostDatabaseMock"
import { UnauthorizedError } from "../../../src/errors/UnauthorizedError"
import { VotePostSchema } from "../../../src/dtos/post/votePost.dto"
import { VoteCommentSchema } from "../../../src/dtos/comment/voteComment.dto"

describe("Testando voteComment", () => {
  const commentBusiness = new CommentBusiness(
    new CommentDatabaseMock(),
    new PostDatabaseMock(),
    new UserDatabaseMock(),
    new IdGeneratorMock(),
    new TokenManagerMock()
  )

  test("deve criar um vote", async () => {
    const input = VoteCommentSchema.parse({
      token: "token-mock-fulano",
      commentId: "id-mock-comment",
      vote: true
    })

    const output = await commentBusiness.voteComment(input)

    expect(output).toEqual(undefined)
  })

  test("deve disparar erro se o commentId possuir menos de 1 char", async () => {
    expect.assertions(1)

    try {
      const input = VoteCommentSchema.parse({
        token: "token-mock-fulano",
        commentId: "",
        vote: true
      })

    } catch (error) {
      if (error instanceof ZodError) {
        expect(error.issues[0].message).toBe('String must contain at least 1 character(s)')
      }
    }
  })

  test("deve disparar erro se o token for inválido", async () => {
    expect.assertions(2)

    try {
      const input = VoteCommentSchema.parse({
        token: "token invalido",
        commentId: "id-mock-post",
        vote: true
      })

      const output = await commentBusiness.voteComment(input)

    } catch (error) {
      if (error instanceof UnauthorizedError) {
        expect(error.statusCode).toBe(401)
        expect(error.message).toBe("token inválido")
      }
    }
  })
})