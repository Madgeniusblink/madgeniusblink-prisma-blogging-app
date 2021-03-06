import { Prisma } from 'prisma-binding'
import { fragmentReplacements } from "./resolvers/index"

const prisma = new Prisma({
    typeDefs: 'src/generated/prisma.graphql',
    endpoint: process.env.PRISMA_ENDPOINT,
    secret: process.env.PRISMA_SECRET,
    fragmentReplacements
})

export { prisma as default }

// prisma.query | prisma.mutation | prisma.subscription
// null stands for the variable that takes arguments (..)

// one method for every signle type
// prisma.exists.User
// prisma.exists.Comment
// prisma.exists.Post
