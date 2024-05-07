import api from "../../../../src/Services/api"

export default async function handler(req, res) {
    try {
        res.setHeader('Content-Type', 'application/json');
        const { userData } = req.body;
        const { data: token } = await api.post(`/users/saveRegister`, [userData]);
        res.statusCode = 200;
        res.json(token);
        res.end();
    } catch (error) {
        res.json(error)
        res.status(500).end
    }
}