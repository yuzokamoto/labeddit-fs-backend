import { ZodError } from "zod"
import { PostBusiness } from "../../../src/business/PostBusiness"
import { IdGeneratorMock } from "../../mocks/services/IdGeneratorMock"
import { TokenManagerMock } from "../../mocks/services/TokenManagerMock"
import { UserDatabaseMock } from "../../mocks/database/UserDatabaseMock"
import { PostDatabaseMock } from "../../mocks/database/PostDatabaseMock"
import { UnauthorizedError } from "../../../src/errors/UnauthorizedError"
import { VotePostSchema } from "../../../src/dtos/post/votePost.dto"

describe("Testando votePost", () => {
  const postBusiness = new PostBusiness(
    new PostDatabaseMock(),
    new UserDatabaseMock(),
    new IdGeneratorMock(),
    new TokenManagerMock()
  )

  test("deve criar um vote", async () => {
    const input = VotePostSchema.parse({
      token: "token-mock-fulano",
      postId: "id-mock-post",
      vote: true
    })

    const output = await postBusiness.votePost(input)

    expect(output).toEqual(undefined)
  })

  test("deve disparar erro se o postId possuir menos de 1 char", async () => {
    expect.assertions(1)

    try {
      const input = VotePostSchema.parse({
        token: "token-mock-fulano",
        postId: "",
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
      const input = VotePostSchema.parse({
        token: "token invalido",
        postId: "id-mock-post",
        vote: true
      })

      const output = await postBusiness.votePost(input)

    } catch (error) {
      if (error instanceof UnauthorizedError) {
        expect(error.statusCode).toBe(401)
        expect(error.message).toBe("token inválido")
      }
    }
  })
})