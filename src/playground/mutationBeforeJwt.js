import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import getUserId from "../utils/getUserId"

import { emailTaken, userExists, postExists, commentExists} from "../utils/validationFunctions"

// Enum
// 1. A special type that defines a set of constants.
// 2. This type can then be used as the type for a field (similar to scalar and custom object types).
// 3. Values for the field must be one of the constant for the type

// EXAMPLE:
// Userrole(enum) - standard, editor, admin
// UserRole must be one of the Enum above.. anything else fails
// type User {
//     role: UserRole!
// }


const Mutation = {
    async createUser(parent, args, { prisma }, info) {
        await emailTaken(prisma, args.data.email)
        // args.data comes from the prisma api arguments
        // take in password -> Validate password -> Hash password -> Generate auth token
        if (args.data.password.length < 8) {
            throw new Error('Password must be 8 characters or longer.')
        }

        const password = await bcrypt.hash(args.data.password, 10)

        const user = await prisma.mutation.createUser({
                data: {
                  ...args.data,
                  password: password
                } 
            })
            // not adding info will return all scalar fields

        return {
            user,
            token: jwt.sign({ userId: user.id }, 'mysecretfornow')
        }
    },
    async loginUser(parent, args, {prisma}, info) {
        // find user by email
        const user = await prisma.query.user({
            where: {
                email: args.data.email
            }
        })

        if (!user) {
            throw new Error(`Unable to login`)
        }

        const isMatch = await bcrypt.compare(args.data.password, user.password)

        if (!isMatch) {
            throw new Error(`Unable to login`)
        }
        
        return {
            user,
            token: jwt.sign({ userId: user.id}, 'mysecretfornow')
        }
        
    },
    async deleteUser(parent, args, {prisma}, info) {
        await userExists(prisma, args.id)

        return prisma.mutation.deleteUser({ where: { id: args.id}}, info)
    },
    async updateUser(parent, args, { prisma }, info) {
        await userExists(args.id)

        return prisma.mutation.updateUser({ 
            where: {
                id: args.id
            },
            data: args.data
        }, info)
    },
    async createPost(parent, args, {prisma, request}, info) {
        const userId = getUserId(request)
        await userExists(prisma, args.data.author)

        return prisma.mutation.createPost({
            data: {
                ...args.data,
                author: {
                    connect: {
                        id: userId
                    }
                }
            },
        }, info)
    },
    async deletePost(parent, args, { prisma }, info) {
        await postExists(prisma, args.id)

        return prisma.mutation.deletePost({
            where: {
                id: args.id
            }
        }, info)
    },
    async updatePost(parent, args, { prisma, pubsub }, info) {
        await postExists(args.id)

        return prisma.mutation.updatePost({
            where: {
                id: args.id
            },
            data: {
                ...args.data
            }
        }, info)

    },
    async createComment(parent, args, { prisma, pubsub }, info) {
        const postExists = await prisma.exists.Post({ id: args.data.post })
        const userExists = await prisma.exists.User({ id: args.data.author })


        if (!userExists || !postExists) {
            throw new Error("unable to publish your comment")
        }

        return prisma.mutation.createComment({
            data: {
                ...args.data,
                author: {
                    connect: {
                        id: args.data.author
                    }
                },
                post: {
                    connect: {
                        id: args.data.post
                    }
                }
            },
        }, info)
    },
    async deleteComment(parent, args, { prisma, pubsub }, info) {
        await commentExists(prisma, args.id)

        return prisma.mutation.deleteComment({ where: { id: args.id}}, info)

    },
    async updateComment(parent, args, { prisma, pubsub }, info) {
        await commentExists(prisma,args.id)

        return prisma.mutation.updateComment({
            where: {
                id: args.id
            },
            data: {
                ...args.data
            }
        }, info)
    }
}

export { Mutation as default }
