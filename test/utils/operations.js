import { gql } from "apollo-boost"

export const createUser = gql`
    mutation($data:CreateUserInput!) {
        createUser(data:$data) {
            token,
            user {
                id
                name
                email
            }
        }
    }
`

export const getUsers = gql`
    query {
        users {
            id
            name
            email
        }
    }
`
export const getProfile = gql`
        query {
            me {
                id
                name
                email
            }
        }
    `

export const loginUser = gql`
    mutation($data:loginUserInput!) {
        loginUser(data:$data) {
            token
        }
    }
`

export const getPosts = gql`
    query {
        posts {
            id
            title
            body
            published
        }
    }
`

export const myPosts = gql`
    query {
        myPosts {
            id
            title
            body
            published
        }
    }
`
export const updatePost = gql`
    mutation($id: ID!, $data: UpdatePostInput!) {
        updatePost(id:$id, data:$data) {
            id
            title
            body
            published
        }
    }
`

export const createPost = gql`
    mutation($data:CreatePostInput!) {
        createPost(data:$data) {
            id
            title
            body
            published
        }
    }
`

export const deletePost = gql`
    mutation($id:ID!) {
        deletePost(id: $id) {
            id
        }
    }
`

export const deleteComment = gql`
    mutation($id: ID!) {
        deleteComment(id: $id) {
            id
        }
    }
`
export const subscribeToComments = gql`
    subscription($postId: ID!) {
        comment(postId: $postId) {
            mutation
            node {
                id
                text
            }
        }
    }
`

export const subscribeToPosts = gql`
    subscription {
        post {
            mutation
        }
    }
`