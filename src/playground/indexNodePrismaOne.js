
// EXAMPLE OF USING PRISMA FUNCTION INSTEAD OF THE GRAPHQL PLAYFROUM

prisma.query.users(null, `{ id name posts { id title } }`).then((data) => {
    console.log(JSON.stringify(data, undefined, 4))
})

prisma.query.comments(null, `{ id text author { id name } }`).then((data) => {
    console.log(JSON.stringify(data, undefined, 4))
})

prisma.mutation.createPost({
    data: {
        title: "My second CreatePost chaining From Prisma.js",
        body: "",
        published: false,
        author: {
            connect: {
                id: "ck05nxlag00290721wg247817"
            }
        }
    }
}, '{ id title body published author { id name }}').then(data => {
    console.log(data)
    return prisma.query.users(null, `{ id name posts { id title } }`)

}).then(data => {
    console.log(data)
    console.log(JSON.stringify(data, undefined, 4))
})

// mutation updatePost

prisma.mutation.updatePost({
    where: {
        id: "ck0762iau00nb0721duydvaax"
    },
    data: {
        body: "This is brand new",
        published: true,
    }
}, '{ id title body published }').then(data => {
    console.log(data)
    return prisma.query.posts(null, '{ id title body published author { id name }}')
}).then(data => {
    console.log(JSON.stringify(data, undefined, 4))
})