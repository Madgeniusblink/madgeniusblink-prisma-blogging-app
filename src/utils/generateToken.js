import jwt from 'jsonwebtoken'

const generateToken = (userId) => {
    return jwt.sign({ userId }, 'mysecretfornow', { expiresIn: "7 days" })
}

export { generateToken as default }