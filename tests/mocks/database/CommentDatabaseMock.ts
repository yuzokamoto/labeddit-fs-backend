import { BaseDatabase } from "../../../src/database/BaseDatabase";
import { CommentDB, CommentVoteDB } from "../../../src/models/Comment";

const commentsMock: CommentDB[] = [
  {
    id: "id-mock-comment",
    post_id: "id-mock-post",
    content: "Mock de comment",
    votes_count: -1,
    creator_id: "id-mock-fulano",
    created_at: new Date().toISOString()
  }
]

const commentsVotesMock: CommentVoteDB[] = [
  {
    comment_id: "id-mock-comment",
    user_id: "id-mock-fulano",
    vote: 0
  }
]

export class CommentDatabaseMock extends BaseDatabase {
  public static TABLE_COMMENTS = "comments"
  public static TABLE_COMMENTS_VOTES = "comments_votes"

  public insertComment = async (commentDB: CommentDB): Promise<void> => {

  }

  public getPostComments = async (postId: string): Promise<CommentDB[]> => {
    return commentsMock
  }

  public findById = async (id: string): Promise<CommentDB | undefined> => {
    return commentsMock.filter(comment => comment.id === id)[0]
  }

  public updateComment = async (commentDB: CommentDB): Promise<void> => {

  }

  public findCommentVote =
    async (commentId: string, userId: string): Promise<CommentVoteDB | undefined> => {
      return commentsVotesMock.filter(commentVote => (
        commentVote.comment_id === commentId
        && commentVote.user_id === userId
      ))[0]
    }

  public insertCommentVote
    = async (commentId: string, userId: string, vote: Number): Promise<void> => {

    }

  public updateCommentVote
    = async (commentId: string, userId: string, vote: number): Promise<void> => {

    }

  public deleteCommentVote
    = async (commentId: string, userId: string): Promise<void> => {

    }
}