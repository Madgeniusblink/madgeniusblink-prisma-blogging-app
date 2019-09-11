// VALIDATION FUNCTIONS

export const emailTaken = async (prisma, email) => {
    const emailTaken = await prisma.exists.User({ email: email})

    if (emailTaken) {
        throw new Error('Unable to create user')
    }
    return emailTaken
}

export const userExists = async (prisma, id) => {
    const userExists = await prisma.exists.User({ id: id})

    if (!userExists) {
        throw new Error('User not found')
    }

    return userExists
}
export const postExists = async (prisma, id, userId) => {
    return prisma.exists.Post({
        id: id,
        author: {
            id: userId
        }
   })
}
export const commentExists = async (prisma, id, userId) => {
    return  prisma.exists.Comment({
        id: id,
        author: {
            id: userId
        }
    })
}