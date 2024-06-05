import api from "../../../../src/Services/api"

export default async function handler(req, res) {
    try {
        res.setHeader('Content-Type', 'application/json');
        const { email } = req.body;
        const { data: data } = await api.get(`/usersCol/takePassword?email=${email}`);
        res.statusCode = 200;
        res.json(data);
        res.end();
    } catch (error) {
        res.json(error)
        res.status(500).end
    }
}