import { ZodError } from "zod"
import { CommentBusiness } from "../../../src/business/CommentBusiness"
import { IdGeneratorMock } from "../../mocks/services/IdGeneratorMock"
import { TokenManagerMock } from "../../mocks/services/TokenManagerMock"
import { CommentDatabaseMock } from "../../mocks/database/CommentDatabaseMock"
import { UserDatabaseMock } from "../../mocks/database/UserDatabaseMock"
import { PostDatabaseMock } from "../../mocks/database/PostDatabaseMock"
import { UnauthorizedError } from "../../../src/errors/UnauthorizedError"
import { CreateCommentSchema } from "../../../src/dtos/comment/createComment.dto"

describe("Testando createComment", () => {
  const commentBusiness = new CommentBusiness(
    new CommentDatabaseMock(),
    new PostDatabaseMock(),
    new UserDatabaseMock(),
    new IdGeneratorMock(),
    new TokenManagerMock()
  )

  test("deve criar um comment", async () => {
    const input = CreateCommentSchema.parse({
      token: "token-mock-fulano",
      postId: "id-mock-post",
      content: "Comment de teste"
    })

    const output = await commentBusiness.createComment(input)

    expect(output).toEqual(undefined)
  })

  test("deve disparar erro se o content possuir menos de 1 char", async () => {
    expect.assertions(1)

    try {
      const input = CreateCommentSchema.parse({
        token: "token-mock-fulano",
        postId: "id-mock-post",
        content: ""
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
      const input = CreateCommentSchema.parse({
        token: "token invalido",
        postId: "id-mock-post",
        content: "Comment de teste"
      })

      const output = await commentBusiness.createComment(input)

    } catch (error) {
      if (error instanceof UnauthorizedError) {
        expect(error.statusCode).toBe(401)
        expect(error.message).toBe("token inválido")
      }
    }
  })
})