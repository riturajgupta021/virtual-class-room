import jwt from "jsonwebtoken"

const generateToken = (user) => {
    return jwt.sign({
        id: user._id
    } , process.env.SECRET_KEY )
}

export default generateToken
