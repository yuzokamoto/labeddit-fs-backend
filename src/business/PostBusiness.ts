import { PostDatabase } from "../database/PostDatabase";
import { UserDatabase } from "../database/UserDatabase";
import { CreatePostInputDTO, CreatePostOutputDTO } from "../dtos/post/createPost.dto";
import { DeletePostInputDTO, DeletePostOutputDTO } from "../dtos/post/deletePost.dto";
import { EditPostInputDTO, EditPostOutputDTO } from "../dtos/post/editPost.dto";
import { GetPostByIdInputDTO, GetPostByIdOutputDTO } from "../dtos/post/getPostById.dto";
import { GetPostsInputDTO, GetPostsOutputDTO } from "../dtos/post/getPosts.dto";
import { VotePostInputDTO, VotePostOutputDTO } from "../dtos/post/votePost.dto";
import { ForbiddenError } from "../errors/ForbiddenError";
import { NotFoundError } from "../errors/NotFoundError";
import { UnauthorizedError } from "../errors/UnauthorizedError";
import { Post, PostModel, PostVoteDB } from "../models/Post";
import { IdGenerator } from "../services/IdGenerator";
import { TokenManager } from "../services/TokenManager";

export class PostBusiness {
  constructor(
    private postDatabase: PostDatabase,
    private userDatabase: UserDatabase,
    private idGenerator: IdGenerator,
    private tokenManager: TokenManager
  ) { }

  public createPost =
    async (input: CreatePostInputDTO): Promise<CreatePostOutputDTO> => {

      const { token, content } = input

      const payload = this.tokenManager.getPayload(token)
      if (!payload) {
        throw new UnauthorizedError("token inválido")
      }

      const id = this.idGenerator.generate()

      const post = new Post(
        id,
        content,
        0,
        0,
        new Date().toISOString(),
        payload.id,
        payload.nickname
      )

      await this.postDatabase.insertPost(post.toDBModel())

      const output: CreatePostOutputDTO = undefined
      return output
    }

  public getPosts =
    async (input: GetPostsInputDTO): Promise<GetPostsOutputDTO> => {

      const { token } = input

      const payload = this.tokenManager.getPayload(token)
      if (!payload) {
        throw new UnauthorizedError("token inválido")
      }

      const postsDB = await this.postDatabase.getPosts()

      const postsModel: PostModel[] = []

      for (let postDB of postsDB) {
        const userDB = await this.userDatabase.findById(postDB.creator_id)

        const post = new Post(
          postDB.id,
          postDB.content,
          postDB.votes_count,
          postDB.comments_count,
          postDB.created_at,
          postDB.creator_id,
          userDB.nickname
        )

        postsModel.push(post.toBusinessModel())
      }

      const output: GetPostsOutputDTO = postsModel
      return output
    }

  public getPostById =
    async (input: GetPostByIdInputDTO): Promise<GetPostByIdOutputDTO> => {

      const { token, postId } = input

      const payload = this.tokenManager.getPayload(token)
      if (!payload) {
        throw new UnauthorizedError("token inválido")
      }

      const postDB = await this.postDatabase.findById(postId)

      if (!postDB) {
        throw new NotFoundError("id não existe")
      }

      const userDB = await this.userDatabase.findById(postDB.creator_id)

      const post = new Post(
        postDB.id,
        postDB.content,
        postDB.votes_count,
        postDB.comments_count,
        postDB.created_at,
        postDB.creator_id,
        userDB.nickname
      )

      const output: GetPostByIdOutputDTO = post.toBusinessModel()
      return output
    }

  public editPost =
    async (input: EditPostInputDTO): Promise<EditPostOutputDTO> => {

      const { token, content, postId } = input

      const payload = this.tokenManager.getPayload(token)
      if (!payload) {
        throw new UnauthorizedError("token inválido")
      }

      const postDB = await this.postDatabase.findById(postId)

      if (!postDB) {
        throw new NotFoundError("id não existe")
      }

      if (payload.id !== postDB.creator_id) {
        throw new ForbiddenError("somente quem criou o post pode editá-lo")
      }

      const userDB = await this.userDatabase.findById(postDB.creator_id)

      const post = new Post(
        postDB.id,
        postDB.content,
        postDB.votes_count,
        postDB.comments_count,
        postDB.created_at,
        postDB.creator_id,
        userDB.nickname
      )

      post.setContent(content)

      await this.postDatabase.updatePost(post.toDBModel())

      const output: EditPostOutputDTO = undefined
      return output
    }

  public deletePost =
    async (input: DeletePostInputDTO): Promise<DeletePostOutputDTO> => {

      const { token, postId } = input

      const payload = this.tokenManager.getPayload(token)
      if (!payload) {
        throw new UnauthorizedError("token inválido")
      }

      const postDB = await this.postDatabase.findById(postId)

      if (!postDB) {
        throw new NotFoundError("id não existe")
      }

      if (payload.id !== postDB.creator_id) {
        throw new ForbiddenError("somente quem criou o post pode deletá-lo")
      }

      const userDB = await this.userDatabase.findById(postDB.creator_id)

      const post = new Post(
        postDB.id,
        postDB.content,
        postDB.votes_count,
        postDB.comments_count,
        postDB.created_at,
        postDB.creator_id,
        userDB.nickname
      )

      await this.postDatabase.deletePost(post.toDBModel())

      const output: DeletePostOutputDTO = undefined
      return output
    }

  public votePost =
    async (input: VotePostInputDTO): Promise<VotePostOutputDTO> => {

      const { token, postId, vote } = input

      const payload = this.tokenManager.getPayload(token)
      if (!payload) {
        throw new UnauthorizedError("token inválido")
      }

      const postDB = await this.postDatabase.findById(postId)

      if (!postDB) {
        throw new NotFoundError("id não existe")
      }

      const userDB = await this.userDatabase.findById(postDB.creator_id)

      const post = new Post(
        postDB.id,
        postDB.content,
        postDB.votes_count,
        postDB.comments_count,
        postDB.created_at,
        postDB.creator_id,
        userDB.nickname
      )

      const voteAsNumber = vote ? 1 : 0

      const postVoteDB = await this.postDatabase.findPostVote(postId, payload.id)

      if (postVoteDB) {
        if (postVoteDB.vote) {
          if (vote) {
            post.decreaseVotesCount()
            await this.postDatabase.deletePostVote(postId, payload.id)
          } else {
            post.decreaseVotesCount()
            post.decreaseVotesCount()
            await this.postDatabase.updatePostVote(postId, payload.id, voteAsNumber)
          }

        } else {
          if (vote) {
            post.increaseVotesCount()
            post.increaseVotesCount()
            await this.postDatabase.updatePostVote(postId, payload.id, voteAsNumber)
          } else {
            post.increaseVotesCount()
            await this.postDatabase.deletePostVote(postId, payload.id)
          }
        }

        await this.postDatabase.updatePost(post.toDBModel())

      } else {
        vote ? post.increaseVotesCount() : post.decreaseVotesCount()
        await this.postDatabase.updatePost(post.toDBModel())
        await this.postDatabase.insertPostVote(postId, payload.id, voteAsNumber)
      }

      const output: VotePostOutputDTO = undefined
      return output
    }
}