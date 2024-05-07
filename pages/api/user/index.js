import jwt from "jsonwebtoken";

function verifyToken(token, secretKey) {
    return new Promise((resolve, reject) => {
        jwt.verify(token, secretKey, (err, decoded) => {
            if (err) {
                reject(err)
            } else {
                resolve(decoded)
            }
        })
    })
}

export default async function handler(req, res) {
    try {
        res.setHeader('Content-Type', 'application/json')
        const { token } = req.body
        const secretKey = process.env.JWT_SECRET
        const decoded = await verifyToken(token, secretKey)

        if (decoded !== undefined) {
            const userData = decoded.user
            res.statusCode = 200
            res.json(userData[0])
        } else {
            res.statusCode = 200
            res.json(null)
        }
        res.end()
    } catch (error) {
        res.json(error)
        res.status(500).end
    }
}
