import 'cross-fetch/polyfill'
import 'regenerator-runtime/runtime'
import prisma from "../src/prisma"
import seedDatabase, { userOne } from './utils/seedDatabase'
import getClient from "./utils/getClient"
import { createUser, getProfile, getUsers, loginUser } from "./utils/operations"


const client = getClient()


beforeEach(seedDatabase)



test('Should create a new user', async () => {
    const variables = {
        data: {
            name: "maya",
            email: "maya@example.com",
            password: "Mypass123"
        }
    }

    const response = await client.mutate({
        mutation: createUser,
        variables
    })

    const exists = await prisma.exists.User({ id: response.data.createUser.user.id })
    expect(exists).toBe(true)
});

test("Should expose public author profile", async () => {
    const response = await client.query({ query: getUsers })
    
    expect(response.data.users.length).toBe(2)
    expect(response.data.users[0].email).toBe(null)
    expect(response.data.users[0].name).toBe("jen")
})

test('should not login with bad credentials', async () => {
    const variables = {
        data: {
            email: "rock@example.com",
            password: "red123993"
        }
    }

    await expect(client.mutate({ mutation: loginUser, variables })).rejects.toThrow()
})


test('should not signup user with invalid password', async () => {
    const variables = {
        data: {
            name: "coco",
            email: "coco@example.com",
            password: "Mypas"
        }
    }

    await expect(client.mutate({ mutation: createUser, variables })).rejects.toThrow()
})


test('Should fetch user profile', async () => {
    const client = getClient(userOne.jwt)
    const { data } = await client.query({ query: getProfile })

    expect(data.me.id).toBe(userOne.user.id)
    expect(data.me.name).toBe(userOne.user.name)
    expect(data.me.email).toBe(userOne.user.email)
})