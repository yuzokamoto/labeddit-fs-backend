import { ZodError } from "zod"
import { PostBusiness } from "../../../src/business/PostBusiness"
import { IdGeneratorMock } from "../../mocks/services/IdGeneratorMock"
import { TokenManagerMock } from "../../mocks/services/TokenManagerMock"
import { UserDatabaseMock } from "../../mocks/database/UserDatabaseMock"
import { PostDatabaseMock } from "../../mocks/database/PostDatabaseMock"
import { CreatePostSchema } from "../../../src/dtos/post/createPost.dto"
import { UnauthorizedError } from "../../../src/errors/UnauthorizedError"

describe("Testando createPost", () => {
  const postBusiness = new PostBusiness(
    new PostDatabaseMock(),
    new UserDatabaseMock(),
    new IdGeneratorMock(),
    new TokenManagerMock()
  )

  test("deve criar um post", async () => {
    const input = CreatePostSchema.parse({
      token: "token-mock-fulano",
      content: "Post de teste"
    })

    const output = await postBusiness.createPost(input)

    expect(output).toEqual(undefined)
  })

  test("deve disparar erro se o content possuir menos de 1 char", async () => {
    expect.assertions(1)

    try {
      const input = CreatePostSchema.parse({
        token: "token-mock-fulano",
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
      const input = CreatePostSchema.parse({
        token: "token invalido",
        content: "Post de teste"
      })

      const output = await postBusiness.createPost(input)

    } catch (error) {
      if (error instanceof UnauthorizedError) {
        expect(error.statusCode).toBe(401)
        expect(error.message).toBe("token inválido")
      }
    }
  })
})