import { CommentBusiness } from "../../../src/business/CommentBusiness"
import { IdGeneratorMock } from "../../mocks/services/IdGeneratorMock"
import { TokenManagerMock } from "../../mocks/services/TokenManagerMock"
import { CommentDatabaseMock } from "../../mocks/database/CommentDatabaseMock"
import { UserDatabaseMock } from "../../mocks/database/UserDatabaseMock"
import { PostDatabaseMock } from "../../mocks/database/PostDatabaseMock"
import { GetCommentsSchema } from "../../../src/dtos/comment/getComments.dto"
import { CommentModel } from "../../../src/models/Comment"

describe("Testando getComments", () => {
  const commentBusiness = new CommentBusiness(
    new CommentDatabaseMock(),
    new PostDatabaseMock(),
    new UserDatabaseMock(),
    new IdGeneratorMock(),
    new TokenManagerMock()
  )

  test("deve retornar uma lista de comments", async () => {
    const input = GetCommentsSchema.parse({
      token: "token-mock-fulano",
      postId: "id-mock-post"
    })

    const output = await commentBusiness.getComments(input)

    const expectedPost: CommentModel = {
      id: "id-mock-comment",
      postId: "id-mock-post",
      content: "Mock de comment",
      votesCount: -1,
      createdAt: expect.any(String),
      creator: {
        id: "id-mock-fulano",
        nickname: "fulano"
      }
    }

    expect(output).toContainEqual(expectedPost)
  })
})