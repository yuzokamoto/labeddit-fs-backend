import { PostBusiness } from "../../../src/business/PostBusiness"
import { IdGeneratorMock } from "../../mocks/services/IdGeneratorMock"
import { TokenManagerMock } from "../../mocks/services/TokenManagerMock"
import { UserDatabaseMock } from "../../mocks/database/UserDatabaseMock"
import { PostDatabaseMock } from "../../mocks/database/PostDatabaseMock"
import { GetPostsSchema } from "../../../src/dtos/post/getPosts.dto"
import { PostModel } from "../../../src/models/Post"

describe("Testando getPosts", () => {
  const postBusiness = new PostBusiness(
    new PostDatabaseMock(),
    new UserDatabaseMock(),
    new IdGeneratorMock(),
    new TokenManagerMock()
  )

  test("deve retornar uma lista de users", async () => {
    const input = GetPostsSchema.parse({
      token: "token-mock-fulano"
    })

    const output = await postBusiness.getPosts(input)

    const expectedPost: PostModel = {
      id: "id-mock-post",
      content: "Mock de post",
      votesCount: 1,
      commentsCount: 0,
      createdAt: expect.any(String),
      creator: {
        id: "id-mock-fulano",
        nickname: "fulano"
      }
    }

    expect(output).toContainEqual(expectedPost)
  })
})