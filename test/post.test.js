import 'cross-fetch/polyfill'
import 'regenerator-runtime/runtime'
import seedDatabase, { userOne, postOne, postTwo } from "./utils/seedDatabase"
import getClient from "./utils/getClient"
import prisma from "../src/prisma"
import { getPosts, myPosts, updatePost, createPost, deletePost } from "./utils/operations"


const client = getClient()

beforeEach(seedDatabase)

test("Should expose public posts", async () => {
    const response = await client.query({ query: getPosts })

    expect(response.data.posts.length).toBe(1)
    expect(response.data.posts[0].published).toBe(true)
})

test('should fetch users', async () => {
    const client = getClient(userOne.jwt)

    const { data } = await client.query({ query: myPosts })
    expect(data.myPosts.length).toBe(2)

})

test('should be able to update own post', async () => {
    const client = getClient(userOne.jwt)
    const variables = {
        id: postOne.post.id,
        data: {
            published: false
        }
    }
    const { data } = await client.mutate({ mutation: updatePost, variables })
    const exists = await prisma.exists.Post({ id: postOne.post.id, published: false})
    expect(data.updatePost.published).toBe(false)
    expect(exists).toBe(true)
})

test('creating a post', async () => {
    const client = getClient(userOne.jwt)
    const variables = {
        data: {
            title: "My new JavaScript Course Coming soon learn more",
            body: "coming soon..",
            published: true
        }
    }
    const { data } = await client.mutate({ mutation: createPost, variables })
    expect(data.createPost.title).toBe("My new JavaScript Course Coming soon learn more")
    expect(data.createPost.published).toBe(true)
})

test('delete a post', async () => {
    const client = getClient(userOne.jwt)
    const variables = {
        id: postTwo.post.id
    }

    await client.mutate({ mutation: deletePost, variables })
    const exists = await prisma.exists.Post({ id: postTwo.post.id })
    expect(exists).toBe(false)
})