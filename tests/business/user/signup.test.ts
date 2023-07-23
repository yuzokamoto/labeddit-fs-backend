import { ZodError } from "zod"
import { UserBusiness } from "../../../src/business/UserBusiness"
import { SignupSchema } from "../../../src/dtos/user/signup.dto"
import { HashManagerMock } from "../../mocks/services/HashManagerMock"
import { IdGeneratorMock } from "../../mocks/services/IdGeneratorMock"
import { TokenManagerMock } from "../../mocks/services/TokenManagerMock"
import { UserDatabaseMock } from "../../mocks/database/UserDatabaseMock"
import { ConflictError } from "../../../src/errors/ConflictError"

describe("Testando signup", () => {
  const userBusiness = new UserBusiness(
    new UserDatabaseMock(),
    new IdGeneratorMock(),
    new TokenManagerMock(),
    new HashManagerMock()
  )

  test("deve gerar um token ao cadastrar", async () => {
    const input = SignupSchema.parse({
      nickname: "Teste",
      email: "teste@email.com",
      password: "teste123"
    })

    const output = await userBusiness.signup(input)

    expect(output).toEqual({
      token: "token-mock"
    })    
  })

  test("deve disparar erro se o nickname não possuir pelo menos 1 char", async () => {
    expect.assertions(1)

    try {
      const input = SignupSchema.parse({
        nickname: "",
        email: "teste@email.com",
        password: "teste123"
      })
      
    } catch (error) {
      if (error instanceof ZodError) {
        expect(error.issues[0].message).toBe('String must contain at least 1 character(s)')
      }
    }
  })

  test("deve disparar erro caso e-mail já exista", async () => {
    expect.assertions(2)

    try {
      const input = SignupSchema.parse({
        nickname: "fulano",
        email: "fulano@email.com",
        password: "fulano123"
      })

      const output = await userBusiness.signup(input)

    } catch (error) {
      if (error instanceof ConflictError) {
        expect(error.statusCode).toBe(409)
        expect(error.message).toBe("Email já cadastrado")
      }
    }
  })
})