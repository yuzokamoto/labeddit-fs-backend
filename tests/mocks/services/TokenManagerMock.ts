import { TokenPayload } from '../../../src/models/User'

export class TokenManagerMock {
  public createToken = (payload: TokenPayload): string => {
    if (payload.id === "id-mock-fulano") {
      return "token-mock-fulano"
    } else {
      return "token-mock"
    }
  }

  public getPayload = (token: string): TokenPayload | null => {
    if (token === "token-mock-fulano") {
      return {
        id: "id-mock-fulano",
        nickname: "fulano"
      }
    } else {
      return null
    }
  }
}