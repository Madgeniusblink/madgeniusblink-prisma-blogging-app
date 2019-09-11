import bcrypt from 'bcryptjs'
import generateToken from '../utils/generateToken'
import getUserId from "../utils/getUserId"
import hashPassword from "../utils/hashPassword"
import { emailTaken, userExists, postExists, commentExists} from "../utils/validationFunctions"


const Mutation = {
    async createUser(parent, args, { prisma }, info) {
        await emailTaken(prisma, args.data.email)
        const password = await hashPassword(args.data.password)

        
        const user = await prisma.mutation.createUser({
                data: {
                  ...args.data,
                  password: password
                } 
            })
            // not adding info will return all scalar fields
        // JWT user.id
        return {
            user,
            token: generateToken(user.id)
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
            token: generateToken(user.id)
        }
        
    },
    async deleteUser(parent, args, {prisma, request}, info) {
        const userId = getUserId(request)

        await userExists(prisma, userId)
        return prisma.mutation.deleteUser({ where: { id: userId } }, info)
    },
    async updateUser(parent, args, { prisma, request }, info) {
        const userId = getUserId(request)

        if (typeof args.data.password === 'string') {
            args.data.password = await hashPassword(args.data.password)
        }

        return prisma.mutation.updateUser({ 
            where: {
                id: userId
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
    async deletePost(parent, args, { prisma, request }, info) {
        const userId = getUserId(request)

        const postExist = await postExists(prisma, args.id, userId)

        if (!postExist) {
            throw new Error("unable to delete post")
        }
        

        return prisma.mutation.deletePost({
            where: {
                id: args.id
            }
        }, info)
    },
    async updatePost(parent, args, { prisma, request }, info) {
        const userId = getUserId(request)
        const postExist = await postExists(prisma, args.id, userId)
        const isPublished = await prisma.exists.Post({
            id: args.id,
            published: true
        })

        if (!postExist) {
            throw new Error("unable to update post")
        }

        // ispublished is true and args.data.published is about to be false
        if (isPublished && args.data.published === false) {
            await prisma.mutation.deleteManyComments({
                where: {
                    post: {
                        id: args.id
                    }
                }
            })
        }

        return prisma.mutation.updatePost({
            where: {
                id: args.id
            },
            data: {
                ...args.data
            }
        }, info)

    },
    async createComment(parent, args, { prisma, request }, info) {
        const userId = getUserId(request)
        const postExist = await prisma.exists.Post({
            id: args.data.post,
            published: true
        })
        const userExist = await userExists(prisma, userId)


        if (!userExist) {
            throw new Error("unable to publish your comment")
        }

        if(!postExist) {
            throw new Error("Unable to find post")
        }

        return prisma.mutation.createComment({
            data: {
                ...args.data,
                author: {
                    connect: {
                        id: userId
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
    async deleteComment(parent, args, { prisma, request }, info) {
        const userId = getUserId(request)
        const commentExist = await commentExists(prisma, args.id, userId)

        if (!commentExist) {
            throw new Error(`Unable to delete comment!`)
        }

        return prisma.mutation.deleteComment({ where: { id: args.id}}, info)

    },
    async updateComment(parent, args, { prisma, request }, info) {
        const userId = getUserId(request)
        const commentExist = await commentExists(prisma, args.id, userId)

        if (!commentExist) {
            throw new Error(`Unable to update comment!`)
        }

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
