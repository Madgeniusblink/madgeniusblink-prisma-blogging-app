
const prisma = new Prisma({
    typeDefs: 'src/generated/prisma.graphql',
    endpoint: 'http://localhost:4466/'
})



// prisma.query | prisma.mutation | prisma.subscription
// null stands for the variable that takes arguments (..)

// one method for every signle type
// prisma.exists.User
// prisma.exists.Comment
// prisma.exists.Post

// prisma.exists.Comment({
//     id: "ck05pjdkl00op0721tpbii1ez",
//     author: {
//         name: "john"
//     }

// }).then(exists => console.log(exists))

// prisma.exists.User({
//     id: "ck05nxlag00290721wg247817"
// }).then(exists => console.log(exists))

const createPostForUser = async (authorId, data) => {
    const userExists = await prisma.exists.User({ id: authorId})

    if (!userExists) {
        throw new Error(`User not found`)
    }

    const post = await prisma.mutation.createPost({
        data: {
            ...data,
            author: {
                connect: {
                    id: authorId
                }
            }
        }
    },'{ author { id name email posts { id title published } } }')

    return post.author
};

// createPostForUser("ck077rlve01en0721uf5x0kr8", {
//         title: "my 1999nd tried article",
//         body: "",
//         published: false,
// }).then((user) => {
//     console.log(JSON.stringify(user, undefined, 2))
// }).catch(error => console.error(error.message))


const updatePostForUser = async (postId, data) => {
    const postExists = await prisma.exists.Post({ id: postId})

    if (!postExists) {
        throw new Error(`Post not found! There for you can not update the post`)
    }

    const post = await prisma.mutation.updatePost({
        where: {
            id: postId
        },
        data: {
            ...data
        }
    }, "{ author { id name email posts { id title published } } }")

    return post.author
}


// updatePostForUser("ck07h032q039p0721a09572oj", {
//     title: "my last post updated",
//     body: "this was my 1999nd tried article post",
//     published: true
// }).then((user) => {
//     console.log(JSON.stringify(user, undefined, 4))
// }).catch(error => console.error(error.message))