import api from "../../../../src/Services/api"

export default async function handler(req, res) {
    try {
        res.setHeader('Content-Type', 'application/json');
        const { usuario, telefono } = req.body;
        const { data: data } = await api.get(`/usersCol/resetClave?usuario=${usuario}&telefono=${telefono}`);
        res.statusCode = 200;
        res.json(data);
        res.end();
    } catch (error) {
        res.json(error)
        res.status(500).end
    }
}